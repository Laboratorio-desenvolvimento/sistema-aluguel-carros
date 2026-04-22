package com.puc.aluguelcarros.service;
import com.puc.aluguelcarros.configuration.security.BCryptPasswordEncoderService;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.EntidadeEmpregadora;
import com.puc.aluguelcarros.repository.ClienteRepository;
import com.puc.aluguelcarros.repository.EntidadeEmpregadoraRepository;
import jakarta.persistence.PersistenceException;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.util.List;

@Singleton
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final EntidadeEmpregadoraRepository empregadoraRepository;
    private final BCryptPasswordEncoderService passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository, EntidadeEmpregadoraRepository empregadoraRepository, BCryptPasswordEncoderService passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.empregadoraRepository = empregadoraRepository;
    }
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Transactional
    public Cliente salvar(Cliente cliente) {
        try {
            validarCamposObrigatorios(cliente);
            String senhaCripto = passwordEncoder.encode(cliente.getSenha());
            cliente.setSenha(senhaCripto);
            return clienteRepository.save(cliente);
        } catch (PersistenceException e) {
            String mensagem = e.getCause().getMessage();
            if (mensagem.contains("CPF")) {
                throw new RuntimeException("CPF já cadastrado.");
            } else if (mensagem.contains("RG")) {
                throw new RuntimeException("RG já cadastrado.");
            }
            throw new RuntimeException("Já possui um usuário cadastrado com esses dados.");
        }
    }

    @Transactional
    public void deletar(String cpf) {
        Cliente cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        clienteRepository.delete(cliente);
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    private List<EntidadeEmpregadora> resolverEmpregadoras(List<EntidadeEmpregadora> empregadoras) {
        if (empregadoras == null) return null;
        return empregadoras.stream()
                .map(emp -> empregadoraRepository.findByCnpj(emp.getCnpj())
                        .orElse(emp))
                .toList();
    }


    public Cliente atualizar(String cpf, Cliente clienteAtualizado) {
        Cliente clienteExistente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        validarCamposObrigatorios(clienteAtualizado);

        clienteExistente.setNome(clienteAtualizado.getNome());
        clienteExistente.setEmail(clienteAtualizado.getEmail());
        clienteExistente.setCpf(clienteAtualizado.getCpf());
        clienteExistente.setRg(clienteAtualizado.getRg());
        clienteExistente.setProfissao(clienteAtualizado.getProfissao());
        clienteExistente.setCep(clienteAtualizado.getCep());
        clienteExistente.setLogradouro(clienteAtualizado.getLogradouro());
        clienteExistente.setNumero(clienteAtualizado.getNumero());
        clienteExistente.setComplemento(clienteAtualizado.getComplemento());
        clienteExistente.setBairro(clienteAtualizado.getBairro());
        clienteExistente.setCidade(clienteAtualizado.getCidade());
        clienteExistente.setEstado(clienteAtualizado.getEstado());
        clienteExistente.setEmpregadoras(resolverEmpregadoras(clienteAtualizado.getEmpregadoras()));

        if (clienteAtualizado.getSenha() != null) {
            clienteExistente.setSenha(passwordEncoder.encode(clienteAtualizado.getSenha()));
        }

        return clienteRepository.update(clienteExistente);
    }

    public Cliente autenticar(String email, String senha) {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos."));

        if (!passwordEncoder.matches(senha, cliente.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        return cliente;
    }

    public List<EntidadeEmpregadora> listarEmpregadoras(Long clienteId) {
        Cliente cliente = buscarPorId(clienteId);
        return cliente.getEmpregadoras();
    }

    private void validarCamposObrigatorios(Cliente cliente) {
        if (cliente.getCep() == null || cliente.getCep().isBlank()) {
            throw new RuntimeException("O campo CEP é obrigatório.");
        }
        if (cliente.getLogradouro() == null || cliente.getLogradouro().isBlank()) {
            throw new RuntimeException("O campo Logradouro é obrigatório.");
        }
        if (cliente.getNumero() == null || cliente.getNumero().isBlank()) {
            throw new RuntimeException("O campo Número é obrigatório.");
        }
        if (cliente.getBairro() == null || cliente.getBairro().isBlank()) {
            throw new RuntimeException("O campo Bairro é obrigatório.");
        }
        if (cliente.getCidade() == null || cliente.getCidade().isBlank()) {
            throw new RuntimeException("O campo Cidade é obrigatório.");
        }
        if (cliente.getEstado() == null || cliente.getEstado().isBlank()) {
            throw new RuntimeException("O campo Estado é obrigatório.");
        }

        if (cliente.getEmpregadoras() == null) {
            return;
        }

        for (EntidadeEmpregadora empregadora : cliente.getEmpregadoras()) {
            if (empregadora.getNome() == null || empregadora.getNome().isBlank()) {
                throw new RuntimeException("O nome da empresa é obrigatório para cada vínculo empregatício.");
            }
            if (empregadora.getCargo() == null || empregadora.getCargo().isBlank()) {
                throw new RuntimeException("O cargo é obrigatório para cada vínculo empregatício.");
            }
            if (empregadora.getFaixaRendaMensal() == null || empregadora.getFaixaRendaMensal().isBlank()) {
                throw new RuntimeException("A faixa de renda mensal é obrigatória para cada vínculo empregatício.");
            }
        }
    }

}
