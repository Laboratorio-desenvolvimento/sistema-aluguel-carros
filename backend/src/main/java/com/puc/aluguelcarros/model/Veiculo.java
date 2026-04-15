package com.puc.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;

@Serdeable
@Entity
@Table(name = "veiculo")
@Data

public class Veiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String matricula;
    private Integer ano;
    private String marca;
    private String modelo;
    @Column(unique = true)
    private String placa;
    @Column(name = "valor_dia")
    private Double valorDia;

    private String categoria;
    private String combustivel;
    private Integer lugares;
    private String potencia;
    private Double avaliacao;
    private Boolean destaque;
    
    @Column(length = 500)
    private String itens; // Itens extras, exemplo: "Ar-condicionado,Wi-Fi,Seguro incluso"
    
    @Column(columnDefinition = "TEXT")
    private String foto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "agente_id")
    private Agente agente;
}
