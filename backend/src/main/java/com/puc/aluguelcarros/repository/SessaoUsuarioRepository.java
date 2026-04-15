package com.puc.aluguelcarros.repository;

import com.puc.aluguelcarros.model.SessaoUsuario;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface SessaoUsuarioRepository extends JpaRepository<SessaoUsuario, Long> {
    Optional<SessaoUsuario> findByToken(String token);
}
