package com.puc.aluguelcarros.service;

import java.util.Date;
import java.util.List;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Contrato;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.repository.ContratoRepository;
import jakarta.persistence.PersistenceException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;

@Singleton
public class ContratoService {
    ContratoRepository contratoRepository;

    public ContratoService(ContratoRepository contratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    @Transactional
    public HttpStatus criarContrato(Contrato contrato) {
        Date agora = new Date();
        if(contrato == null || contrato.getAgente() == null || contrato.getVeiculo() == null || contrato.getDataInicio() == null || contrato.getDataFim() == null) {
            return HttpStatus.BAD_REQUEST;
        }

        if (contrato.getDataInicio().before(agora) || !contrato.getDataInicio().before(contrato.getDataFim())) {

            return HttpStatus.BAD_REQUEST;
        }

        if(contrato.getValorTotal() <= 0) {
            return HttpStatus.BAD_REQUEST;
        }

        try {
            contratoRepository.save(contrato);
            return HttpStatus.CREATED;
        } catch (PersistenceException e) {
            return HttpStatus.BAD_REQUEST;
        }
    }

    public List<Contrato> getContratosByAgente(Agente agente) {
        List<Contrato> contratos = contratoRepository.findByAgenteId(agente.getId()).stream().toList();
        if (contratos.isEmpty()) {
            throw new PersistenceException("Nenhum contrato encontrado para o agente: " + agente.getNome());
        }
        return contratos;
    }
}
