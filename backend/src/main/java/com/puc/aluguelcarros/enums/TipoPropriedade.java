package com.puc.aluguelcarros.enums;

public enum TipoPropriedade {
    CLIENT("Cliente"),
    ENTERPRISE("Empresa"),
    BANK("Banco");

    private final String dono;

    private TipoPropriedade(String dono) {
        this.dono = dono;
    }

    public String getDono() {
        return dono;
    }
}
