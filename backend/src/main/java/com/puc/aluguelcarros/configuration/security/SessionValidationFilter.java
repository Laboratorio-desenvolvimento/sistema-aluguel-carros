package com.puc.aluguelcarros.configuration.security;

import com.puc.aluguelcarros.model.SessaoUsuario;
import com.puc.aluguelcarros.repository.SessaoUsuarioRepository;
import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.HttpResponse;
import org.reactivestreams.Publisher;

import java.util.Optional;

@Filter(Filter.MATCH_ALL_PATTERN)
public class SessionValidationFilter implements HttpServerFilter {

    private final SessaoUsuarioRepository sessaoUsuarioRepository;

    public SessionValidationFilter(SessaoUsuarioRepository sessaoUsuarioRepository) {
        this.sessaoUsuarioRepository = sessaoUsuarioRepository;
    }

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        Optional<String> authorization = request.getHeaders().getAuthorization();
        Optional<String> tokenOpt = authorization.filter(auth -> auth.startsWith("Bearer ")).map(auth -> auth.substring(7));
        
        if (tokenOpt.isPresent()) {
            String token = tokenOpt.get();
            Optional<SessaoUsuario> sessaoOpt = sessaoUsuarioRepository.findByToken(token);
            
            if (sessaoOpt.isEmpty() || !sessaoOpt.get().isValida()) {
                return Publishers.just(HttpResponse.status(HttpStatus.UNAUTHORIZED).body("Token JWT não vinculado a uma sessão válida."));
            }
        }
        
        return chain.proceed(request);
    }
}
