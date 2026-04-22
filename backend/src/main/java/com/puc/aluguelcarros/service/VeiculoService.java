package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.dto.VeiculoPayload;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.repository.AgenteRepository;
import com.puc.aluguelcarros.repository.VeiculoRepository;
import io.micronaut.http.multipart.CompletedFileUpload;
import jakarta.inject.Singleton;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.List;
import java.util.Set;

@Singleton
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;
    private final AgenteRepository agenteRepository;
    private final VeiculoFotoStorageService fotoStorageService;
    private final Validator validator;

    public VeiculoService(
            VeiculoRepository veiculoRepository,
            AgenteRepository agenteRepository,
            VeiculoFotoStorageService fotoStorageService,
            Validator validator) {
        this.veiculoRepository = veiculoRepository;
        this.agenteRepository = agenteRepository;
        this.fotoStorageService = fotoStorageService;
        this.validator = validator;
    }

    public List<Veiculo> listarTodos() {
        return veiculoRepository.findAll();
    }

    public List<Veiculo> listarDisponiveis(java.util.Date inicio, java.util.Date fim, Long excludeId) {
        if (inicio == null || fim == null)
            return veiculoRepository.findAll();

        return veiculoRepository.findDisponiveis(inicio, fim, excludeId);
    }

    public List<Veiculo> listarPorAgente(Long agenteId) {
        return veiculoRepository.findAllByAgenteId(agenteId);
    }

    public Veiculo buscarPorId(Long id) {
        return veiculoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado."));
    }

    @Transactional
    public Veiculo salvar(Veiculo veiculo) {
        try {
            return veiculoRepository.save(veiculo);
        } catch (PersistenceException e) {
            throw tratarErroPersistencia(e);
        }
    }

    @Transactional
    public Veiculo salvarComUpload(VeiculoPayload payload, CompletedFileUpload fotoArquivo) {
        validarPayload(payload);

        Veiculo novo = new Veiculo();
        preencherCamposComuns(novo, payload);

        String referenciaFoto = payload.getFoto();
        if (fotoArquivo != null && fotoArquivo.getSize() > 0) {
            referenciaFoto = fotoStorageService.armazenar(fotoArquivo);
        }
        novo.setFoto(normalizarTexto(referenciaFoto));

        try {
            return veiculoRepository.save(novo);
        } catch (PersistenceException e) {
            throw tratarErroPersistencia(e);
        }
    }

    @Transactional
    public void deletar(String matricula) {
        Veiculo veiculo = veiculoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Veículo não encontrado."));
        if (fotoStorageService.isReferenciaLocal(veiculo.getFoto())) {
            fotoStorageService.excluirPorReferencia(veiculo.getFoto());
        }
        veiculoRepository.delete(veiculo);
    }

    @Transactional
    public void deletarPorId(Long id) {
        Veiculo veiculo = buscarPorId(id);
        if (fotoStorageService.isReferenciaLocal(veiculo.getFoto())) {
            fotoStorageService.excluirPorReferencia(veiculo.getFoto());
        }
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

    @Transactional
    public Veiculo atualizarPorId(Long id, VeiculoPayload payload, CompletedFileUpload fotoArquivo) {
        validarPayload(payload);

        Veiculo existente = buscarPorId(id);
        preencherCamposComuns(existente, payload);

        String novaReferenciaFoto = existente.getFoto();
        String fotoUrlInformada = normalizarTexto(payload.getFoto());

        if (fotoArquivo != null && fotoArquivo.getSize() > 0) {
            if (fotoStorageService.isReferenciaLocal(existente.getFoto())) {
                fotoStorageService.excluirPorReferencia(existente.getFoto());
            }
            novaReferenciaFoto = fotoStorageService.armazenar(fotoArquivo);
        } else if (fotoUrlInformada != null) {
            if (fotoStorageService.isReferenciaLocal(existente.getFoto()) && !fotoUrlInformada.equals(existente.getFoto())) {
                fotoStorageService.excluirPorReferencia(existente.getFoto());
            }
            novaReferenciaFoto = fotoUrlInformada;
        }

        existente.setFoto(novaReferenciaFoto);

        try {
            return veiculoRepository.update(existente);
        } catch (PersistenceException e) {
            throw tratarErroPersistencia(e);
        }
    }

    private void preencherCamposComuns(Veiculo destino, VeiculoPayload payload) {
        Agente agente = agenteRepository.findById(payload.getAgenteId())
                .orElseThrow(() -> new RuntimeException("Agente não encontrado."));

        destino.setMatricula(normalizarTexto(payload.getMatricula()));
        destino.setMarca(normalizarTexto(payload.getMarca()));
        destino.setModelo(normalizarTexto(payload.getModelo()));
        destino.setPlaca(normalizarTexto(payload.getPlaca()));
        destino.setAno(payload.getAno());
        destino.setCategoria(normalizarTexto(payload.getCategoria()));
        destino.setCombustivel(normalizarTexto(payload.getCombustivel()));
        destino.setLugares(payload.getLugares());
        destino.setPotencia(normalizarTexto(payload.getPotencia()));
        destino.setValorDia(payload.getValorDia());
        destino.setAvaliacao(payload.getAvaliacao());
        destino.setDestaque(payload.getDestaque() != null ? payload.getDestaque() : Boolean.FALSE);
        destino.setItens(normalizarTexto(payload.getItens()));
        destino.setAgente(agente);
    }

    private void validarPayload(VeiculoPayload payload) {
        Set<ConstraintViolation<VeiculoPayload>> violations = validator.validate(payload);
        if (!violations.isEmpty()) {
            ConstraintViolation<VeiculoPayload> violation = violations.iterator().next();
            throw new RuntimeException(violation.getMessage());
        }
    }

    private RuntimeException tratarErroPersistencia(PersistenceException e) {
        String mensagem = e.getCause() != null ? e.getCause().getMessage() : "";
        if (mensagem.contains("matricula") || mensagem.contains("MATRICULA")) {
            return new RuntimeException("Matrícula já cadastrada.");
        }
        if (mensagem.contains("placa") || mensagem.contains("PLACA")) {
            return new RuntimeException("Placa já cadastrada.");
        }
        return new RuntimeException("Já possui um veículo cadastrado com esses dados: " + e.getMessage());
    }

    private String normalizarTexto(String valor) {
        if (valor == null) {
            return null;
        }
        String texto = valor.trim();
        return texto.isEmpty() ? null : texto;
    }
}
