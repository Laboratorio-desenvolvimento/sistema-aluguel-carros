package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.service.VeiculoFotoStorageService;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.server.types.files.StreamedFile;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller("/uploads/veiculos")
@Secured(SecurityRule.IS_ANONYMOUS)
public class UploadController {

    private final VeiculoFotoStorageService fotoStorageService;

    public UploadController(VeiculoFotoStorageService fotoStorageService) {
        this.fotoStorageService = fotoStorageService;
    }

    @Get("/{nomeArquivo}")
    public HttpResponse<StreamedFile> obterFoto(@PathVariable String nomeArquivo) {
        try {
            Path arquivo = fotoStorageService.resolver(nomeArquivo);
            if (!Files.exists(arquivo) || !Files.isRegularFile(arquivo)) {
                return HttpResponse.notFound();
            }

                MediaType mediaType = MediaType.forFilename(nomeArquivo);
            StreamedFile streamedFile = new StreamedFile(
                    Files.newInputStream(arquivo),
                    mediaType != null ? mediaType : MediaType.APPLICATION_OCTET_STREAM_TYPE
            );

            return HttpResponse.ok(streamedFile)
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400");
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível ler a imagem solicitada.");
        }
    }
}