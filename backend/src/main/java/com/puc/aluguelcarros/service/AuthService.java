package com.puc.aluguelcarros.service;

import com.puc.aluguelcarros.configuration.security.BCryptPasswordEncoderService;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.SessaoUsuario;
import com.puc.aluguelcarros.model.UsuarioSistema;
import com.puc.aluguelcarros.repository.SessaoUsuarioRepository;
import com.puc.aluguelcarros.repository.UsuarioSistemaRepository;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.token.generator.TokenGenerator;
import jakarta.inject.Singleton;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

@Singleton
public class AuthService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final BCryptPasswordEncoderService passwordEncoder;
    private final TokenGenerator tokenGenerator;
    private final SessaoUsuarioRepository sessaoUsuarioRepository;
    private final ClienteService clienteService;
    private final AgenteService agenteService;

    public AuthService(UsuarioSistemaRepository usuarioSistemaRepository, 
                       BCryptPasswordEncoderService passwordEncoder, 
                       TokenGenerator tokenGenerator, 
                       SessaoUsuarioRepository sessaoUsuarioRepository,
                       ClienteService clienteService,
                       AgenteService agenteService) {
        this.usuarioSistemaRepository = usuarioSistemaRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenGenerator = tokenGenerator;
        this.sessaoUsuarioRepository = sessaoUsuarioRepository;
        this.clienteService = clienteService;
        this.agenteService = agenteService;
    }

    public AuthResult autenticar(String email, String senha) {
        UsuarioSistema usuario = usuarioSistemaRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos."));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        return gerarSessaoEToken(usuario);
    }

    @Transactional
    public AuthResult cadastrarCliente(Cliente cliente) {
        Cliente salvo = clienteService.salvar(cliente);
        return gerarSessaoEToken(salvo);
    }

    @Transactional
    public AuthResult cadastrarAgente(Agente agente) {
        Agente salvo = agenteService.salvar(agente);
        return gerarSessaoEToken(salvo);
    }

    private AuthResult gerarSessaoEToken(UsuarioSistema usuario) {
        String role = "CLIENTE";
        if (usuario instanceof Agente) {
            role = "AGENTE";
        } else if (usuario instanceof Cliente) {
            role = "CLIENTE";
        } else {
            if (agenteService.listarTodos().stream().anyMatch(a -> a.getId().equals(usuario.getId()))) {
                role = "AGENTE";
            }
        }

        Authentication authentication = Authentication.build(
                usuario.getEmail(),
                Collections.singletonList(role),
                Collections.singletonMap("userId", usuario.getId())
        );
        
        Optional<String> tokenOpt = tokenGenerator.generateToken(authentication, 3600);
        
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Erro ao gerar token JWT");
        }
        
        String token = tokenOpt.get();
        
        SessaoUsuario sessao = new SessaoUsuario();
        sessao.setUsuario(usuario);
        sessao.setToken(token);
        sessao.setDataExpiracao(LocalDateTime.now().plusSeconds(3600));
        sessao.setValida(true);
        sessaoUsuarioRepository.save(sessao);

        return new AuthResult(usuario, token, role);
    }

    public record AuthResult(UsuarioSistema usuario, String token, String tipo) {}
}
