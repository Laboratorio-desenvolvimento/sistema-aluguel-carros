package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.UsuarioSistema;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface UsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Long> {
    Optional<UsuarioSistema> findByEmail(String email);
}
