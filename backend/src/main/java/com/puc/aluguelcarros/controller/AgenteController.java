package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.service.AgenteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.util.List;

@Controller("/agente")
@Secured(SecurityRule.IS_ANONYMOUS)
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public Agente criar(@Body Agente agente) {
        return agenteService.salvar(agente);
    }

    @Get
    @Status(HttpStatus.OK)
    public List<Agente> listar() {
        return agenteService.listarTodos();
    }

    @Delete("/{cnpj}")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String cnpj) {
        agenteService.deletar(cnpj);
    }

    @Put("/{cnpj}")
    @Status(HttpStatus.OK)
    public Agente atualizar(@PathVariable String cnpj, @Body Agente agente) {
        return agenteService.atualizar(cnpj, agente);
    }

    @Error
    public HttpResponse<String> handleErro(RuntimeException e) {
        return HttpResponse.badRequest(e.getMessage());
    }
}
