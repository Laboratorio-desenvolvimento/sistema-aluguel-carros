package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;

@Serdeable
@Entity
@Table(name = "empresa")
@Data
@EqualsAndHashCode(callSuper = true)
public class Empresa extends Agente{
    
}
