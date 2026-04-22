package com.puc.aluguelcarros.dto;

import io.micronaut.core.annotation.Introspected;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
@Introspected
@Serdeable
public class VeiculoPayload {

    @NotBlank(message = "Matrícula é obrigatória.")
    private String matricula;

    @NotBlank(message = "Marca é obrigatória.")
    private String marca;

    @NotBlank(message = "Modelo é obrigatório.")
    private String modelo;

    @NotBlank(message = "Placa é obrigatória.")
    private String placa;

    @NotNull(message = "Ano é obrigatório.")
    @Min(value = 1900, message = "Ano inválido.")
    private Integer ano;

    @NotBlank(message = "Categoria é obrigatória.")
    private String categoria;

    @NotBlank(message = "Combustível é obrigatório.")
    private String combustivel;

    @NotNull(message = "Lugares é obrigatório.")
    @Min(value = 1, message = "Lugares deve ser maior que zero.")
    private Integer lugares;

    private String potencia;

    @NotNull(message = "Valor da diária é obrigatório.")
    @Positive(message = "Valor da diária deve ser maior que zero.")
    private Double valorDia;

    @DecimalMin(value = "0.0", message = "Avaliação inválida.")
    private Double avaliacao;

    private Boolean destaque;
    private String itens;
    private String foto;

    @NotNull(message = "Agente é obrigatório.")
    private Long agenteId;
}