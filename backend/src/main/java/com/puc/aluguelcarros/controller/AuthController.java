package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.service.AuthService;
import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Error;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Status;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.serde.annotation.Serdeable;

@Controller("/auth")
@Secured(SecurityRule.IS_ANONYMOUS)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Post("/login")
    @Status(HttpStatus.OK)
    public AuthResponse login(@Body LoginRequest request) {
        AuthService.AuthResult result = authService.autenticar(request.email(), request.senha());
        return toResponse(result, "Login realizado com sucesso.");
    }

    @Post("/cadastrar/cliente")
    @Status(HttpStatus.CREATED)
    public AuthResponse cadastrarCliente(@Body Cliente cliente) {
        AuthService.AuthResult result = authService.cadastrarCliente(cliente);
        return toResponse(result, "Cliente cadastrado e logado com sucesso.");
    }

    @Post("/cadastrar/agente")
    @Status(HttpStatus.CREATED)
    public AuthResponse cadastrarAgente(@Body Agente agente) {
        AuthService.AuthResult result = authService.cadastrarAgente(agente);
        return toResponse(result, "Agente cadastrado e logado com sucesso.");
    }

    private AuthResponse toResponse(AuthService.AuthResult result, String mensagem) {
        return new AuthResponse(
                result.usuario().getId(),
                result.usuario().getNome(),
                result.usuario().getEmail(),
                result.token(),
                result.tipo(),
                mensagem
        );
    }

    @Error
    public HttpResponse<String> handleErro(RuntimeException e) {
        return HttpResponse.unauthorized().body(e.getMessage());
    }

    @Introspected
    @Serdeable
    public record LoginRequest(String email, String senha) {}

    @Introspected
    @Serdeable
    public record AuthResponse(Long id, String nome, String email, String token, String tipo, String mensagem) {}
}
