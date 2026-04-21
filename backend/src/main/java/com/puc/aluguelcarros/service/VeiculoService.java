package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.repository.VeiculoRepository;
import jakarta.inject.Singleton;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import java.util.List;

@Singleton
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final PedidoService pedidoService;

    public VeiculoService(VeiculoRepository veiculoRepository, PedidoService pedidoService) {
        this.veiculoRepository = veiculoRepository;
        this.pedidoService = pedidoService;
    }

    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    public List<Veiculo> listarDisponiveis(java.util.Date inicio, java.util.Date fim) {
        List<Veiculo> todos = veiculoRepository.findAll();
        if (inicio == null || fim == null) return todos;

        return todos.stream()
            .filter(v -> pedidoService.verificarDisponibilidade(v, inicio, fim))
            .toList();
    }

    @Transactional
    public Veiculo salvar(Veiculo veiculo) {
        try {
            return veiculoRepository.save(veiculo);
        } catch (PersistenceException e) {
            String mensagem = e.getCause() != null ? e.getCause().getMessage() : "";
            if (mensagem.contains("matricula") || mensagem.contains("MATRICULA")) {
                throw new RuntimeException("Matrícula já cadastrada.");
            } else if (mensagem.contains("placa") || mensagem.contains("PLACA")) {
                throw new RuntimeException("Placa já cadastrada.");
            }
            throw new RuntimeException("Já possui um veículo cadastrado com esses dados: " + e.getMessage());
        }
    }

    @Transactional
    public void deletar(String matricula) {
        Veiculo veiculo = veiculoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado."));
        veiculoRepository.delete(veiculo);
    }

    @Transactional
    public Veiculo atualizar(String matricula, Veiculo veiculoAtualizado) {
        Veiculo existente = veiculoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado."));

        existente.setAno(veiculoAtualizado.getAno());
        existente.setMarca(veiculoAtualizado.getMarca());
        existente.setModelo(veiculoAtualizado.getModelo());
        existente.setPlaca(veiculoAtualizado.getPlaca());
        existente.setCategoria(veiculoAtualizado.getCategoria());
        existente.setCombustivel(veiculoAtualizado.getCombustivel());
        existente.setLugares(veiculoAtualizado.getLugares());
        existente.setPotencia(veiculoAtualizado.getPotencia());
        existente.setAvaliacao(veiculoAtualizado.getAvaliacao());
        existente.setDestaque(veiculoAtualizado.getDestaque());
        existente.setItens(veiculoAtualizado.getItens());
        existente.setFoto(veiculoAtualizado.getFoto());
        existente.setAgente(veiculoAtualizado.getAgente());
        
        if (veiculoAtualizado.getValorDia() != null) {
            existente.setValorDia(veiculoAtualizado.getValorDia());
        }

        return veiculoRepository.update(existente);
    }
}
