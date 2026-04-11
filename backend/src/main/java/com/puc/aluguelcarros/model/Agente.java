package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;

@Serdeable
@Entity
@Table(name = "agente")
@Data
@EqualsAndHashCode(callSuper = true)
public class Agente extends UsuarioSistema{
    @Column(unique = true)
    private String cnpj;
}
