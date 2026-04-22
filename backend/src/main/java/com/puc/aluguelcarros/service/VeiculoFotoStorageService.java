package com.puc.aluguelcarros.service;

import io.micronaut.context.annotation.Value;
import io.micronaut.http.multipart.CompletedFileUpload;
import jakarta.annotation.PostConstruct;
import jakarta.inject.Singleton;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Singleton
public class VeiculoFotoStorageService {

    private static final String PUBLIC_PREFIX = "/uploads/veiculos/";

    @Value("${app.upload.veiculos-dir:uploads/veiculos}")
    private String uploadDir;

    private Path baseDir;

    @PostConstruct
    void init() {
        try {
            baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(baseDir);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório de upload.", e);
        }
    }

    public String armazenar(CompletedFileUpload arquivo) {
        if (arquivo == null || arquivo.getFilename() == null || arquivo.getFilename().isBlank()) {
            return null;
        }

        String extension = extrairExtensao(arquivo.getFilename());
        String nomeArquivo = UUID.randomUUID() + extension;
        Path destino = resolver(nomeArquivo);

        try (InputStream inputStream = arquivo.getInputStream()) {
            Files.copy(inputStream, destino, StandardCopyOption.REPLACE_EXISTING);
            return PUBLIC_PREFIX + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a foto do veículo.", e);
        }
    }

    public Path resolver(String nomeArquivo) {
        Path destino = baseDir.resolve(nomeArquivo).normalize();
        if (!destino.startsWith(baseDir)) {
            throw new RuntimeException("Caminho de arquivo inválido.");
        }
        return destino;
    }

    public boolean isReferenciaLocal(String referencia) {
        return referencia != null && referencia.startsWith(PUBLIC_PREFIX);
    }

    public void excluirPorReferencia(String referencia) {
        if (!isReferenciaLocal(referencia)) {
            return;
        }

        String nomeArquivo = referencia.substring(PUBLIC_PREFIX.length());
        Path arquivo = resolver(nomeArquivo);
        try {
            Files.deleteIfExists(arquivo);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao excluir a foto antiga do veículo.", e);
        }
    }

    private String extrairExtensao(String nomeArquivoOriginal) {
        int idx = nomeArquivoOriginal.lastIndexOf('.');
        if (idx < 0) {
            return ".jpg";
        }
        String ext = nomeArquivoOriginal.substring(idx).toLowerCase(Locale.ROOT);
        if (ext.length() > 10) {
            return ".jpg";
        }
        return ext;
    }
}