package com.puc.aluguelcarros.model;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;
import lombok.*;
import com.puc.aluguelcarros.enums.StatusPedido;
import java.util.Date;

@Serdeable
@Entity
@Table(name = "pedido")
@Data
public class Pedido{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date dataSolicitacao;
    private Date dataInicioDesejada;
    private Date dataFimDesejada;
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'PENDING'")
    private StatusPedido status = StatusPedido.PENDING;
    private Date dataCancelamento;
    @OneToOne
    @JoinColumn(name = "contrato_id")
    private Contrato contrato;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "agente_id")
    private Agente agente;
    @ManyToOne
    @JoinColumn(name = "veiculo_id")
    private Veiculo veiculo;
}