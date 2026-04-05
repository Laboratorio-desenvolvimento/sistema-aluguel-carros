package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;

@Serdeable
@Entity
@Table(name = "empregadora")
@Data
public class EntidadeEmpregadora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Column(unique = true)
    private String cnpj;
    private Double rendimento;


}
