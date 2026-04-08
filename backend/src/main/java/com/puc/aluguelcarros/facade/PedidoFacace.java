package com.puc.aluguelcarros.facade;
import com.puc.aluguelcarros.model.Agente;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.UsuarioSistema;
import com.puc.aluguelcarros.service.PedidoService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import lombok.extern.java.Log;

import java.util.List;
import java.util.ArrayList;

@Singleton
public class PedidoFacace {
    @Inject
    private PedidoService pedidoService;

    public HttpResponse<Pedido> criarPedido(Pedido pedido) {
        try {
            // Verificar se o carro está disponível para as datas solicitadas
            boolean isDisponivel = pedidoService.verificarDisponibilidade(pedido.getVeiculo(), pedido.getDataInicioDesejada(), pedido.getDataFimDesejada());
            if (!isDisponivel) {
                return HttpResponse.status(HttpStatus.CONFLICT).body(null);
            }

            // Criar o pedido
            Pedido novoPedido = pedidoService.criarPedido(pedido.getCliente(), pedido.getVeiculo(), pedido.getDataInicioDesejada(), pedido.getDataFimDesejada());
            return HttpResponse.status(HttpStatus.CREATED).body(novoPedido);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public HttpResponse<Pedido> cancelarPedido(Pedido pedido) {
        try {
            pedidoService.cancelarPedido(pedido);
            return HttpResponse.ok();
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public HttpResponse<Pedido> reprovarPedido(Pedido pedido) {
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
            return pedidoService.getPedidosByAgente((Agente)usuario);
        }
        return new ArrayList<>();
    }

    public Pedido getPedidoById(Long id) {
        return pedidoService.getPedidoById(id);
    }

    public HttpResponse<Pedido> executarPedido(Pedido pedido){
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

    public HttpResponse<Pedido> modificarPedido(Pedido pedido, UsuarioSistema usuario){
        if(pedido == null || usuario == null){
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        if(usuario instanceof Cliente){
            Pedido pedidoModificado = pedidoService.modificarPedido((Cliente) usuario, pedido);
            if(pedidoModificado != null){
                return HttpResponse.ok(pedidoModificado);
            } else {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
        } else if(usuario instanceof Agente){
            Pedido pedidoModificado = pedidoService.modificarPedido((Agente) usuario, pedido);
            if(pedidoModificado != null){
                return HttpResponse.ok(pedidoModificado);
            } else {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
        } else {
            return HttpResponse.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

}