package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.service.VeiculoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.util.List;

@Controller("/veiculo")
@Secured(SecurityRule.IS_ANONYMOUS)
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }

    @Post
    @Secured("AGENTE")
    @Status(HttpStatus.CREATED)
    public Veiculo criar(@Body Veiculo veiculo) {
        return veiculoService.salvar(veiculo);
    }

    @Get
    @Status(HttpStatus.OK)
    public List<Veiculo> listar() {
        return veiculoService.listarTodos();
    }

    @Delete("/{matricula}")
    @Secured("AGENTE")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String matricula) {
        veiculoService.deletar(matricula);
    }

    @Put("/{matricula}")
    @Secured("AGENTE")
    @Status(HttpStatus.OK)
    public Veiculo atualizar(@PathVariable String matricula, @Body Veiculo veiculo) {
        return veiculoService.atualizar(matricula, veiculo);
    }

    @Error
    public HttpResponse<String> handleErro(RuntimeException e) {
        return HttpResponse.badRequest(e.getMessage());
    }
}
