package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.EntidadeEmpregadora;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@Repository
public interface EntidadeEmpregadoraRepository extends CrudRepository<EntidadeEmpregadora, Long> {
    Optional<EntidadeEmpregadora> findByCnpj(String cnpj);
}
