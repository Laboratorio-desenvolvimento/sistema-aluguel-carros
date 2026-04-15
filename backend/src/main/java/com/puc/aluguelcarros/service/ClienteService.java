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
            throw new RuntimeException("Dados duplicados.");
        }
    }

    @Transactional
    public void deletar(String cpf) {
        Cliente cliente = clienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
        clienteRepository.delete(cliente);
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

        clienteExistente.setNome(clienteAtualizado.getNome());
        clienteExistente.setEmail(clienteAtualizado.getEmail());
        clienteExistente.setCpf(clienteAtualizado.getCpf());
        clienteExistente.setRg(clienteAtualizado.getRg());
        clienteExistente.setProfissao(clienteAtualizado.getProfissao());
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

}
