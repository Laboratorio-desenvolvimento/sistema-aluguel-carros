package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Serdeable
@Entity
@Table(name = "banco")
@Data
@EqualsAndHashCode(callSuper = true)
public class Banco extends Agente{
    @OneToMany(mappedBy = "banco")
    private List<ContratoCredito> contratosCredito;
}
