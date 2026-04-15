package com.puc.aluguelcarros.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Serdeable
@Entity
@Table(name = "sessao_usuario")
@Data
public class SessaoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioSistema usuario;

    @Column(nullable = false, length = 1024, unique = true)
    private String token;

    private LocalDateTime dataCriacao;
    private LocalDateTime dataExpiracao;
    
    @Column(nullable = false)
    private boolean valida = true;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }
}
