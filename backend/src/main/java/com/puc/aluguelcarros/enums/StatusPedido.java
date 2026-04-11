package com.puc.aluguelcarros.enums;

public enum StatusPedido {
    INTRODUCED("Introduzido"),
    UNDER_REVIEW("Em Análise"),
    APPROVED("Aprovado"),
    REJECTED("Rejeitado"),
    CANCELLED("Cancelado"),
    COMPLETED("Concluído");
    
    private final String descricao;

    private StatusPedido(String descricao) {
        this.descricao = descricao;
    }
    public String getDescricao() {
        return descricao;
    }
}
