package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.Veiculo;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;

@Repository
public interface VeiculoRepository extends CrudRepository<Veiculo, Long> {
    Optional<Veiculo> findByMatricula(String matricula);
    Optional<Veiculo> findByPlaca(String placa);
}
