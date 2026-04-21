package com.puc.aluguelcarros.facade;

import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.UsuarioSistema;
import com.puc.aluguelcarros.service.PedidoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import java.util.List;
import java.util.ArrayList;

@Singleton
public class PedidoFacade {
    @Inject
    private PedidoService pedidoService;

    public HttpResponse<List<Pedido>> listarTodos() {
        try {
            return HttpResponse.ok(pedidoService.listarTodos());
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public List<Pedido> listarPedidosCliente(Long clienteId) {
        try {
            Pedido temp = new Pedido();
            Cliente c = new Cliente();
            c.setId(clienteId);
            return pedidoService.getPedidosByClients(c);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public HttpResponse<?> criarPedido(Pedido pedido) {
        try {
            Pedido novoPedido = pedidoService.criarPedido(pedido);
            return HttpResponse.status(HttpStatus.CREATED).body(novoPedido);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }

    @Serdeable
    public static class ErroDTO {
        private String mensagem;

        public ErroDTO(String mensagem) {
            this.mensagem = mensagem;
        }

        public String getMensagem() {
            return mensagem;
        }
    }

    public HttpResponse<?> cancelarPedido(Pedido pedido) {
        try {
            pedidoService.cancelarPedido(pedido);
            return HttpResponse.ok();
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }

    public HttpResponse<?> reprovarPedido(Pedido pedido) {
        try {
            pedidoService.reprovarPedido(pedido);
            return HttpResponse.ok();
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }

    public List<Pedido> getPedidos(UsuarioSistema usuario) {
        return pedidoService.getPedidos(usuario);
    }

    public Pedido getPedidoById(Long id) {
        return pedidoService.getPedidoById(id);
    }

    public HttpResponse<?> executarPedido(Pedido pedido) {
        try {
            HttpStatus status = pedidoService.executarPedido(pedido);
            return HttpResponse.status(status).body(pedido);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErroDTO(e.getMessage()));
        }
    }

    @Inject
    private com.puc.aluguelcarros.repository.UsuarioSistemaRepository usuarioRepository;

    public HttpResponse<?> assinarPedido(Long id, Long userId) {
        try {
            UsuarioSistema usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            return HttpResponse.ok(pedidoService.assinarPedido(id, usuario));
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }

    public HttpResponse<?> editarPedido(Long id, Pedido pedidoAtualizado, Long userId) {
        try {
            UsuarioSistema usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            if (!(usuario instanceof Cliente)) {
                throw new RuntimeException("Apenas clientes podem editar pedidos");
            }
            return HttpResponse.ok(pedidoService.editarPedido(id, pedidoAtualizado, (Cliente) usuario));
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }
}