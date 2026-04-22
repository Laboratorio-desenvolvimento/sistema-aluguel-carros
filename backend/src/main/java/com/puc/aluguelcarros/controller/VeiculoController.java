package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.service.VeiculoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import io.micronaut.core.annotation.Nullable;
import io.micronaut.core.convert.format.Format;
import java.util.Date;
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
    public List<Veiculo> listar(
            @QueryValue @Nullable @Format("yyyy-MM-dd") Date inicio,
            @QueryValue @Nullable @Format("yyyy-MM-dd") Date fim,
            @QueryValue @Nullable Long excludeId) {
        if (inicio != null && fim != null) {
            return veiculoService.listarDisponiveis(inicio, fim, excludeId);
        }
        return veiculoService.listarTodos();
    }

    @Get("/agente/{agenteId}")
    @Status(HttpStatus.OK)
    public List<Veiculo> listarPorAgente(@PathVariable Long agenteId) {
        return veiculoService.listarPorAgente(agenteId);
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
