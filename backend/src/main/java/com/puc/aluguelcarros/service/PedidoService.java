package com.puc.aluguelcarros.service;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Veiculo;
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

@Singleton
public class PedidoService {
    private final PedidoRepository finalRepository;
    public PedidoService(PedidoRepository repository) {
        this.finalRepository = repository;
    }

    public List<Pedido> listarTodos() {
        return finalRepository.findAll();
    }

    public List<Pedido> getPedidosByClients(Cliente cliente){
        List<Pedido> pedidos = finalRepository.findByCliente(cliente);
        if(pedidos.isEmpty()){
            throw new PersistenceException("Nenhum pedido encontrado para o cliente: " + cliente.getNome());
        }
        return pedidos;
    }

    public List<Pedido> getPedidosByAgente(Agente agente){
        List<Pedido> pedidos = finalRepository.findByAgente(agente);
        if(pedidos.isEmpty()){
            throw new PersistenceException("Nenhum pedido encontrado para o agente: " + agente.getNome());
        }
        return pedidos;
    }

    public Pedido getPedidoById(Long id){
        return finalRepository.findById(id).orElseThrow(() -> new PersistenceException("Pedido não encontrado"));
    }

    @Transactional
    public void deletar(Long id) {
        Pedido pedido = finalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado."));
        finalRepository.delete(pedido);
    }

    @Transactional
    public Pedido modificarPedido(Cliente cliente, Pedido pedidoAtualizado){
        Pedido pedidoExistente = finalRepository.findByIdAndCliente(pedidoAtualizado.getId(), cliente)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado para o cliente."));
        pedidoExistente.setContrato(pedidoAtualizado.getContrato());
        return finalRepository.update(pedidoExistente);
    }

    @Transactional
    public Pedido modificarPedido(Agente agente, Pedido pedidoAtualizado){
        Pedido pedidoExistente = finalRepository.findByIdAndAgente(pedidoAtualizado.getId(), agente)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado para o agente."));
        pedidoExistente.setContrato(pedidoAtualizado.getContrato());
        return finalRepository.update(pedidoExistente);
    }

    @Transactional
    public Pedido criarPedido(Cliente cliente, Veiculo veiculo, Date inicio, Date fim) {
        if (cliente == null || veiculo == null || inicio == null || fim == null) {
            throw new IllegalArgumentException("Todos os campos (cliente, veículo, datas) são obrigatórios.");
        }

        Date agora = new Date();

        if (inicio.after(fim)) {
            throw new IllegalArgumentException("A data de início não pode ser posterior à data de término.");
        }

        if (inicio.before(agora)) {
            throw new IllegalArgumentException("A data de início deve ser a partir de hoje.");
        }

        if (!verificarDisponibilidade(veiculo, inicio, fim)) {
            throw new RuntimeException("Veículo não está disponível para o período selecionado.");
        }

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setVeiculo(veiculo);
        pedido.setDataInicioDesejada(inicio);
        pedido.setDataFimDesejada(fim);
        pedido.setDataSolicitacao(agora); 
        pedido.setStatus(StatusPedido.INTRODUCED);

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
        return finalRepository.update(pedido);
    }

    @Transactional
    public HttpStatus executarPedido(Pedido pedido){
        if(pedido == null){
            return HttpStatus.BAD_REQUEST;
        }
        if(pedido.getStatus() != StatusPedido.UNDER_REVIEW){
            return HttpStatus.BAD_REQUEST;
        }
        Contrato contrato = new Contrato();
        pedido.setContrato(contrato);
        pedido.setStatus(StatusPedido.APPROVED);
        finalRepository.update(pedido);
        return HttpStatus.OK;
    }

    @Transactional
    public HttpResponse<Pedido> reprovarPedido(Pedido pedido) {
        if (pedido == null) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if (pedido.getStatus() == StatusPedido.REJECTED) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if (pedido.getStatus() == StatusPedido.CANCELLED) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }   

        if (pedido.getStatus() == StatusPedido.COMPLETED) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if (pedido.getStatus() == StatusPedido.APPROVED) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        pedido.setStatus(StatusPedido.REJECTED);
        return HttpResponse.ok(finalRepository.update(pedido));
    } 

    public boolean verificarDisponibilidade(Veiculo veiculo, Date dataInicio, Date dataFim) {
        List<Pedido> pedidos = finalRepository.findByVeiculo(veiculo);
        for (Pedido pedido : pedidos) {
            if (pedido.getStatus() == StatusPedido.APPROVED || 
                pedido.getStatus() == StatusPedido.UNDER_REVIEW || 
                pedido.getStatus() == StatusPedido.INTRODUCED) {
                if (dataInicio.before(pedido.getDataFimDesejada()) && dataFim.after(pedido.getDataInicioDesejada())) {
                    return false;
                }
            }
        }
        return true; 
    }
}
