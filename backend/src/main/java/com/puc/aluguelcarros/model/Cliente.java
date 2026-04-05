package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Serdeable
@Entity
@Table(name = "cliente")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    @Column(unique = true)
    private String email;

    private String senha;

    @Column(unique = true)
    private String rg;

    @Column(unique = true)
    private String cpf;

    private String profissao;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinTable(
            name = "cliente_empregadora",
            joinColumns = @JoinColumn(name = "cliente_id"),
            inverseJoinColumns = @JoinColumn(name = "empregadora_id")
    )
    private List<EntidadeEmpregadora> empregadoras;
}
