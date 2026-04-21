package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.model.UsuarioSistema;
import com.puc.aluguelcarros.enums.StatusPedido;
import com.puc.aluguelcarros.repository.PedidoRepository;
import com.puc.aluguelcarros.model.Contrato;
import jakarta.persistence.PersistenceException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;
import java.time.ZoneId;

@Singleton
public class PedidoService {
    private final PedidoRepository finalRepository;

    @jakarta.inject.Inject
    private com.puc.aluguelcarros.repository.ClienteRepository clienteRepository;

    @jakarta.inject.Inject
    private com.puc.aluguelcarros.repository.VeiculoRepository veiculoRepository;

    @jakarta.inject.Inject
    private com.puc.aluguelcarros.repository.AgenteRepository agenteRepository;

    public PedidoService(PedidoRepository repository) {
        this.finalRepository = repository;
    }

    public List<Pedido> listarTodos() {
        return finalRepository.findAll();
    }

    public List<Pedido> getPedidosByClients(Cliente cliente) {
        List<Pedido> pedidos = finalRepository.findByCliente(cliente);
        if (pedidos.isEmpty()) {
            throw new PersistenceException("Nenhum pedido encontrado para o cliente: " + cliente.getNome());
        }
        return pedidos;
    }

    public List<Pedido> getPedidosByAgente(Agente agente) {
        List<Pedido> pedidos = finalRepository.findByAgente(agente);
        if (pedidos.isEmpty()) {
            throw new PersistenceException("Nenhum pedido encontrado para o agente: " + agente.getNome());
        }
        return pedidos;
    }

    public List<Pedido> getPedidos(UsuarioSistema usuario) {
        if (usuario == null) return new java.util.ArrayList<>();
        if (usuario instanceof Cliente) return getPedidosByClients((Cliente) usuario);
        if (usuario instanceof Agente) return getPedidosByAgente((Agente) usuario);
        return new java.util.ArrayList<>();
    }

    public Pedido getPedidoById(Long id) {
        return finalRepository.findById(id).orElseThrow(() -> new PersistenceException("Pedido não encontrado"));
    }

    @Transactional
    public void deletar(Long id) {
        Pedido pedido = finalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));
        finalRepository.delete(pedido);
    }

    @Transactional
    public Pedido criarPedido(Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getVeiculo() == null || 
            pedido.getDataInicioDesejada() == null || pedido.getDataFimDesejada() == null) {
            throw new IllegalArgumentException("Campos obrigatórios ausentes.");
        }

        Cliente cliente = clienteRepository.findById(pedido.getCliente().getId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Veiculo veiculo = veiculoRepository.findById(pedido.getVeiculo().getId())
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        Agente agente = null;
        if (pedido.getAgente() != null && pedido.getAgente().getId() != null) {
            agente = agenteRepository.findById(pedido.getAgente().getId())
                    .orElse(null);
        }

        LocalDate localInicio = pedido.getDataInicioDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
        LocalDate localFim = pedido.getDataFimDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
        LocalDate localHoje = LocalDate.now(ZoneId.of("UTC"));

        if (localInicio.isAfter(localFim)) throw new IllegalArgumentException("Início após o fim.");
        if (localInicio.isBefore(localHoje)) throw new IllegalArgumentException("Início no passado.");

        if (!verificarDisponibilidade(veiculo, pedido.getDataInicioDesejada(), pedido.getDataFimDesejada())) {
            throw new RuntimeException("Veículo indisponível.");
        }

        pedido.setCliente(cliente);
        pedido.setVeiculo(veiculo);
        pedido.setAgente(agente);
        pedido.setDataSolicitacao(new Date());
        pedido.setStatus(StatusPedido.PENDING);

        return finalRepository.save(pedido);
    }

    @Transactional
    public Pedido cancelarPedido(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido não pode ser nulo.");
        }

        if (pedido.getStatus() == StatusPedido.CANCELLED) {
            throw new IllegalStateException("O pedido já está cancelado.");
        }

        if (pedido.getStatus() == StatusPedido.COMPLETED) {
            throw new IllegalStateException("O pedido já foi concluído e não pode ser cancelado.");
        }

        pedido.setStatus(StatusPedido.CANCELLED);
        pedido.setDataCancelamento(new Date());
        return finalRepository.update(pedido);
    }

    @Transactional
    public HttpStatus executarPedido(Pedido pedido) {
        if (pedido == null) {
            return HttpStatus.BAD_REQUEST;
        }
        if (pedido.getStatus() != StatusPedido.UNDER_REVIEW) {
            return HttpStatus.BAD_REQUEST;
        }
        Contrato contrato = new Contrato();
        pedido.setContrato(contrato);
        pedido.setStatus(StatusPedido.APPROVED);
        finalRepository.update(pedido);
        return HttpStatus.OK;
    }

    @Transactional
    public Pedido reprovarPedido(Pedido pedido) {
        if (pedido == null) throw new IllegalArgumentException("Pedido nulo.");
        Pedido pedidoExistente = getPedidoById(pedido.getId());
        pedidoExistente.setStatus(StatusPedido.REJECTED);
        return finalRepository.update(pedidoExistente);
    }

    @Transactional
    public Pedido assinarPedido(Long id, UsuarioSistema usuario) {
        Pedido pedido = finalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));

        if (pedido.getContrato() == null) {
            throw new RuntimeException("Contrato ainda não gerado para este pedido.");
        }

        if (usuario instanceof Cliente) {
            pedido.getContrato().setAssinadoCliente(true);
        } else if (usuario instanceof Agente) {
            pedido.getContrato().setAssinadoAgente(true);
        }

        if (pedido.getContrato().isAssinadoCliente() && pedido.getContrato().isAssinadoAgente()) {
            pedido.setStatus(StatusPedido.COMPLETED);
        }

        return finalRepository.update(pedido);
    }

    @Transactional
    public Pedido editarPedido(Long id, Pedido pedidoAtualizado, Cliente cliente) {
        Pedido pedido = finalRepository.findByIdAndCliente(id, cliente)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado ou não pertence ao cliente."));

        if (pedido.getStatus() != StatusPedido.PENDING) {
            throw new RuntimeException("Apenas pedidos pendentes podem ser editados.");
        }

        Veiculo veiculo = veiculoRepository.findById(pedidoAtualizado.getVeiculo().getId())
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

        LocalDate localInicio = pedidoAtualizado.getDataInicioDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
        LocalDate localFim = pedidoAtualizado.getDataFimDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
        LocalDate localHoje = LocalDate.now(ZoneId.of("UTC"));

        if (localInicio.isAfter(localFim)) throw new IllegalArgumentException("Início após o fim.");
        if (localInicio.isBefore(localHoje)) throw new IllegalArgumentException("Início no passado.");

        if (!verificarDisponibilidade(veiculo, pedidoAtualizado.getDataInicioDesejada(), pedidoAtualizado.getDataFimDesejada(), pedido.getId())) {
            throw new RuntimeException("Veículo indisponível.");
        }

        pedido.setVeiculo(veiculo);
        pedido.setDataInicioDesejada(pedidoAtualizado.getDataInicioDesejada());
        pedido.setDataFimDesejada(pedidoAtualizado.getDataFimDesejada());

        return finalRepository.update(pedido);
    }

    public boolean verificarDisponibilidade(Veiculo veiculo, Date dataInicio, Date dataFim) {
        return verificarDisponibilidade(veiculo, dataInicio, dataFim, null);
    }

    public boolean verificarDisponibilidade(Veiculo veiculo, Date dataInicio, Date dataFim, Long excludePedidoId) {
        LocalDate localInicio = dataInicio.toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
        LocalDate localFim = dataFim.toInstant().atZone(ZoneId.of("UTC")).toLocalDate();

        List<Pedido> pedidos = finalRepository.findByVeiculo(veiculo);
        for (Pedido pedido : pedidos) {
            if (excludePedidoId != null && pedido.getId().equals(excludePedidoId)) {
                continue;
            }
            if (pedido.getStatus() == StatusPedido.APPROVED ||
                    pedido.getStatus() == StatusPedido.UNDER_REVIEW ||
                    pedido.getStatus() == StatusPedido.PENDING ||
                    pedido.getStatus() == StatusPedido.COMPLETED) {

                LocalDate resInicio = pedido.getDataInicioDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();
                LocalDate resFim = pedido.getDataFimDesejada().toInstant().atZone(ZoneId.of("UTC")).toLocalDate();

                if (!localInicio.isAfter(resFim) && !localFim.isBefore(resInicio)) {
                    return false;
                }
            }
        }
        return true;
    }
}
