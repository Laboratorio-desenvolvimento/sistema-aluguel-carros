package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.puc.aluguelcarros.enums.TipoPropriedade;

@Serdeable
@Entity
@Table(name = "contrato")
@Data
public class Contrato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date dataInicio;
    private Date dataFim;
    private Double valorTotal;
    private boolean assinadoCliente;
    private boolean assinadoAgente;
    @Enumerated(EnumType.STRING)
    private TipoPropriedade tipoPropriedade;
    @OneToOne
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;
    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;
    @ManyToOne
    @JoinColumn(name = "agente_id")
    private Agente agente;
}
