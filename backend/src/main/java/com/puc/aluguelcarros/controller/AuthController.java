package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.service.ClienteService;
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

    private final ClienteService clienteService;

    public AuthController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Post("/login")
    @Status(HttpStatus.OK)
    public LoginResponse login(@Body LoginRequest request) {
        Cliente cliente = clienteService.autenticar(request.email(), request.senha());

        return new LoginResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                "Login realizado com sucesso."
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
    public record LoginResponse(Long id, String nome, String email, String mensagem) {}
}
