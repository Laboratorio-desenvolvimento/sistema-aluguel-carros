package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.Veiculo;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VeiculoRepository extends CrudRepository<Veiculo, Long> {
    Optional<Veiculo> findByMatricula(String matricula);

    Optional<Veiculo> findByPlaca(String placa);

    @io.micronaut.data.annotation.Query("SELECT v FROM Veiculo v WHERE v.id NOT IN (" +
            "SELECT p.veiculo.id FROM Pedido p WHERE p.status IN ('APPROVED', 'UNDER_REVIEW', 'PENDING', 'COMPLETED') " +
            "AND (:excludeId IS NULL OR p.id <> :excludeId) " +
            "AND p.dataInicioDesejada <= :fim AND p.dataFimDesejada >= :inicio)")
    List<Veiculo> findDisponiveis(java.util.Date inicio, java.util.Date fim, @io.micronaut.core.annotation.Nullable Long excludeId);

    List<Veiculo> findAllByAgenteId(Long agenteId);
}
