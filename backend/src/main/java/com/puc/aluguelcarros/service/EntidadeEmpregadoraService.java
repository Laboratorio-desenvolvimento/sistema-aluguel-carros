package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.model.EntidadeEmpregadora;
import com.puc.aluguelcarros.repository.EntidadeEmpregadoraRepository;
import jakarta.inject.Singleton;

import java.util.List;

@Singleton
public class EntidadeEmpregadoraService {
    private final EntidadeEmpregadoraRepository repository;


    public EntidadeEmpregadoraService(EntidadeEmpregadoraRepository repository) {
        this.repository = repository;
    }

    public List<EntidadeEmpregadora> listarTodos() {
        return repository.findAll();
    }

    public EntidadeEmpregadora salvar(EntidadeEmpregadora entidadeEmpregadora) {
        return repository.save(entidadeEmpregadora);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
