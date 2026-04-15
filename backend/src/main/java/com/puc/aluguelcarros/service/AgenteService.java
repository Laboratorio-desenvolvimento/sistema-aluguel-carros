package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.configuration.security.BCryptPasswordEncoderService;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.repository.AgenteRepository;
import jakarta.inject.Singleton;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import java.util.List;

@Singleton
public class AgenteService {

    private final AgenteRepository agenteRepository;
    private final BCryptPasswordEncoderService passwordEncoder;

    public AgenteService(AgenteRepository agenteRepository, BCryptPasswordEncoderService passwordEncoder) {
        this.agenteRepository = agenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Agente> listarTodos() {
        return agenteRepository.findAll();
    }

    @Transactional
    public Agente salvar(Agente agente) {
        try {
            agente.setSenha(passwordEncoder.encode(agente.getSenha()));
            return agenteRepository.save(agente);
        } catch (PersistenceException e) {
            String mensagem = e.getCause() != null ? e.getCause().getMessage() : "";
            if (mensagem.contains("CNPJ") || mensagem.contains("cnpj")) {
                throw new RuntimeException("CNPJ já cadastrado.");
            } else if (mensagem.contains("email")) {
                throw new RuntimeException("Email já cadastrado.");
            }
            throw new RuntimeException("Dados duplicados.");
        }
    }

    @Transactional
    public void deletar(String cnpj) {
        Agente agente = agenteRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));
        agenteRepository.delete(agente);
    }

    @Transactional
    public Agente atualizar(String cnpj, Agente agenteAtualizado) {
        Agente existente = agenteRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        existente.setNome(agenteAtualizado.getNome());
        existente.setEmail(agenteAtualizado.getEmail());
        existente.setCnpj(agenteAtualizado.getCnpj());
        existente.setTipoAgente(agenteAtualizado.getTipoAgente());

        if (agenteAtualizado.getSenha() != null && !agenteAtualizado.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(agenteAtualizado.getSenha()));
        }

        return agenteRepository.update(existente);
    }
}
