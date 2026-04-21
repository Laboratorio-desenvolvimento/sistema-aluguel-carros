package com.puc.aluguelcarros.facade;

import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.UsuarioSistema;
import com.puc.aluguelcarros.service.PedidoService;
import com.puc.aluguelcarros.service.ClienteService;
import com.puc.aluguelcarros.service.VeiculoService;
import com.puc.aluguelcarros.service.AgenteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import lombok.extern.java.Log;

import java.util.List;
import java.util.ArrayList;

@Singleton
public class PedidoFacade {
    @Inject
    private PedidoService pedidoService;

    @Inject
    private ClienteService clienteService;

    @Inject
    private VeiculoService veiculoService;

    @Inject
    private AgenteService agenteService;

    public HttpResponse<List<Pedido>> listarTodos() {
        try {
            List<Pedido> pedidos = pedidoService.listarTodos();
            return HttpResponse.ok(pedidos);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public List<Pedido> listarPedidosCliente(Long clienteId) {
        try {
            List<Pedido> pedidos = pedidoService.getPedidosByClients(clienteService.buscarPorId(clienteId));
            return pedidos;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    public HttpResponse<?> criarPedido(Pedido pedido) {
        try {
            Cliente cliente = clienteService.listarTodos().stream()
                    .filter(c -> c.getId().equals(pedido.getCliente().getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

            var veiculo = veiculoService.listarTodos().stream()
                    .filter(v -> v.getId().equals(pedido.getVeiculo().getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Veículo não encontrado"));

            Agente agente = null;
            if (pedido.getAgente() != null && pedido.getAgente().getId() != null) {
                agente = agenteService.listarTodos().stream()
                        .filter(a -> a.getId().equals(pedido.getAgente().getId()))
                        .findFirst()
                        .orElse(null);
            }

            boolean isDisponivel = pedidoService.verificarDisponibilidade(veiculo, pedido.getDataInicioDesejada(),
                    pedido.getDataFimDesejada());
            if (!isDisponivel) {
                return HttpResponse.status(HttpStatus.CONFLICT)
                        .body(new ErroDTO("Veículo não disponível para este período"));
            }

            Pedido novoPedido = pedidoService.criarPedido(cliente, veiculo, agente, pedido.getDataInicioDesejada(),
                    pedido.getDataFimDesejada());
            return HttpResponse.status(HttpStatus.CREATED).body(novoPedido);
        } catch (Exception e) {
            e.printStackTrace();
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErroDTO(e.getMessage()));
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
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public HttpResponse<?> reprovarPedido(Pedido pedido) {
        try {
            pedidoService.reprovarPedido(pedido);
            return HttpResponse.ok();
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public List<Pedido> getPedidos(UsuarioSistema usuario) {
        if (usuario == null) {
            return new ArrayList<>();
        }
        if (usuario instanceof Cliente) {
            return pedidoService.getPedidosByClients((Cliente) usuario);
        }

        if (usuario instanceof Agente) {
            return pedidoService.getPedidosByAgente((Agente) usuario);
        }
        return new ArrayList<>();
    }

    public Pedido getPedidoById(Long id) {
        return pedidoService.getPedidoById(id);
    }

    public HttpResponse<?> executarPedido(Pedido pedido) {
        try {
            HttpStatus status = pedidoService.executarPedido(pedido);
            if (status == HttpStatus.OK) {
                return HttpResponse.ok(pedido);
            } else {
                return HttpResponse.status(status).body(null);
            }
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public HttpResponse<?> modificarPedido(Pedido pedido, UsuarioSistema usuario) {
        if (pedido == null || usuario == null) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if (usuario instanceof Cliente) {
            Pedido pedidoModificado = pedidoService.modificarPedido((Cliente) usuario, pedido);
            if (pedidoModificado != null) {
                return HttpResponse.ok(pedidoModificado);
            } else {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
        } else if (usuario instanceof Agente) {
            Pedido pedidoModificado = pedidoService.modificarPedido((Agente) usuario, pedido);
            if (pedidoModificado != null) {
                return HttpResponse.ok(pedidoModificado);
            } else {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
        } else {
            return HttpResponse.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    public HttpResponse<?> assinarPedido(Long id, UsuarioSistema usuario) {
        try {
            Pedido pedido = pedidoService.assinarPedido(id, usuario);
            return HttpResponse.ok(pedido);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(new ErroDTO(e.getMessage()));
        }
    }
}