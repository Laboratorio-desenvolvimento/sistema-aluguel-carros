package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.Contrato;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@Repository
public interface ContratoRepository extends CrudRepository<Contrato, Long> {;
    Optional<Contrato> findById(Long id);
    Optional<Contrato> findByAgenteId(Long agenteId);
    Optional<Contrato> findByVeiculoId(Long veiculoId);
}
