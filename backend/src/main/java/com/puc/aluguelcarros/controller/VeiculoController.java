package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.dto.VeiculoPayload;
import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.service.VeiculoService;
import io.micronaut.core.annotation.Nullable;
import io.micronaut.core.convert.format.Format;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Consumes;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Delete;
import io.micronaut.http.annotation.Error;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Part;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.annotation.Put;
import io.micronaut.http.annotation.QueryValue;
import io.micronaut.http.annotation.Status;
import io.micronaut.http.multipart.CompletedFileUpload;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.serde.ObjectMapper;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Controller("/veiculo")
@Secured(SecurityRule.IS_ANONYMOUS)
public class VeiculoController {

    private final VeiculoService veiculoService;
    private final ObjectMapper objectMapper;

    public VeiculoController(VeiculoService veiculoService, ObjectMapper objectMapper) {
        this.veiculoService = veiculoService;
        this.objectMapper = objectMapper;
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

    @Get("/{id}")
    @Status(HttpStatus.OK)
    public Veiculo buscarPorId(@PathVariable Long id) {
        return veiculoService.buscarPorId(id);
    }

    @Get("/agente/{agenteId}")
    @Status(HttpStatus.OK)
    public List<Veiculo> listarPorAgente(@PathVariable Long agenteId) {
        return veiculoService.listarPorAgente(agenteId);
    }

    @Post
    @Secured("AGENTE")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Status(HttpStatus.CREATED)
    public Veiculo criar(
            @Part("veiculo") String veiculoJson,
            @Nullable @Part("foto") CompletedFileUpload fotoArquivo) {
        VeiculoPayload payload = parsePayload(veiculoJson);
        return veiculoService.salvarComUpload(payload, fotoArquivo);
    }

    @Put("/{id}")
    @Secured("AGENTE")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Status(HttpStatus.OK)
    public Veiculo atualizar(
            @PathVariable Long id,
            @Part("veiculo") String veiculoJson,
            @Nullable @Part("foto") CompletedFileUpload fotoArquivo) {
        VeiculoPayload payload = parsePayload(veiculoJson);
        return veiculoService.atualizarPorId(id, payload, fotoArquivo);
    }

    @Delete("/{id}")
    @Secured("AGENTE")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        veiculoService.deletarPorId(id);
    }

    @Error
    public HttpResponse<String> handleErro(RuntimeException e) {
        return HttpResponse.badRequest(e.getMessage());
    }

    private VeiculoPayload parsePayload(String json) {
        try {
            return objectMapper.readValue(json, VeiculoPayload.class);
        } catch (IOException e) {
            throw new RuntimeException("Dados do veículo inválidos.");
        }
    }
}
