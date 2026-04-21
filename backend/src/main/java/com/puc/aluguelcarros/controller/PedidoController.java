package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.facade.PedidoFacade;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import java.util.List;

@Controller("/pedidos")
@Secured(SecurityRule.IS_ANONYMOUS)
public class PedidoController {
    private final PedidoFacade pedidoFacace;

    public PedidoController(PedidoFacade pedidoFacace) {
        this.pedidoFacace = pedidoFacace;
    }

    @Get
    @Secured("AGENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<List<Pedido>> listar() {
        return pedidoFacace.listarTodos();
    }

    @Get("/{id}")
    @Status(HttpStatus.OK)
    public HttpResponse<Pedido> getPedidoById(@PathVariable Long id) {
        try {
            Pedido pedido = pedidoFacace.getPedidoById(id);
            return HttpResponse.ok(pedido);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Post
    @Secured("CLIENTE")
    @Status(HttpStatus.CREATED)
    public HttpResponse<?> criarPedido(@Body Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return pedidoFacace.criarPedido(pedido);
    }

    @Get("/cliente")
    @Secured("CLIENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<List<Pedido>> listarPedidosCliente(Authentication authentication) {
        try {
            Object userId = authentication.getAttributes().get("userId");
            if (userId == null) {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Long clienteId = Long.parseLong(userId.toString());
            List<Pedido> pedidos = pedidoFacace.listarPedidosCliente(clienteId);
            return HttpResponse.ok(pedidos);
        } catch (NumberFormatException e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Put("/cancelar")
    @Secured("CLIENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<?> cancelarPedido(@Body Pedido pedido) {
        return pedidoFacace.cancelarPedido(pedido);
    }

    @Put("/reprovar")
    @Secured("AGENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<?> reprovarPedido(@Body Pedido pedido) {
        return pedidoFacace.reprovarPedido(pedido);
    }

    @Put("/executar")
    @Secured("AGENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<?> executarPedido(@Body Pedido pedido) {
        return pedidoFacace.executarPedido(pedido);
    }

    @Post("/{id}/assinar")
    @Secured({ "CLIENTE", "AGENTE" })
    @Status(HttpStatus.OK)
    public HttpResponse<?> assinarPedido(@PathVariable Long id, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getAttributes().get("userId").toString());
        return pedidoFacace.assinarPedido(id, userId);
    }

    @Put("/{id}")
    @Secured("CLIENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<?> editarPedido(@PathVariable Long id, @Body Pedido pedido, Authentication authentication) {
        Long userId = Long.parseLong(authentication.getAttributes().get("userId").toString());
        return pedidoFacace.editarPedido(id, pedido, userId);
    }
}
