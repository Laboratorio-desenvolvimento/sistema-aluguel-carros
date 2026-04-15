package com.puc.aluguelcarros.controller;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.facade.PedidoFacace;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import java.util.List;

@Controller("/pedidos")
@Secured(SecurityRule.IS_ANONYMOUS)
public class PedidoController {
    private final PedidoFacace pedidoFacace;
    
    public PedidoController(PedidoFacace pedidoFacace) {
        this.pedidoFacace = pedidoFacace;
    }

    @Get
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
    @Status(HttpStatus.CREATED)
    public HttpResponse<Pedido> criarPedido(@Body Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return pedidoFacace.criarPedido(pedido);
    }

    @Put("/cancelar")
    @Status(HttpStatus.OK)
    public HttpResponse<Pedido> cancelarPedido(@Body Pedido pedido) {
        return pedidoFacace.cancelarPedido(pedido);
    }

    @Put("/reprovar")
    @Status(HttpStatus.OK)
    public HttpResponse<Pedido> reprovarPedido(@Body Pedido pedido) {
        return pedidoFacace.reprovarPedido(pedido);
    }

    @Put("/executar")
    @Status(HttpStatus.OK)
    public HttpResponse<Pedido> executarPedido(@Body Pedido pedido) {
        return pedidoFacace.executarPedido(pedido);
    }
}
