package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Contrato;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.service.ContratoService;
import com.puc.aluguelcarros.service.AgenteService;
import com.puc.aluguelcarros.model.Agente; 
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.authentication.Authentication;
import io.micronaut.security.rules.SecurityRule;
import java.util.List;

@Controller("/contratos")
@Secured(SecurityRule.IS_ANONYMOUS)
public class ContratoController {
    private final ContratoService contratoService;
    private final AgenteService agenteService;

    public ContratoController(ContratoService contratoService, AgenteService agenteService) {
        this.contratoService = contratoService;
        this.agenteService = agenteService;
    }

    @Post
    @Secured("AGENTE")
    @Status(HttpStatus.CREATED)
    public HttpResponse<?> criarContrato(@Body Contrato contrato) {
        HttpStatus status = contratoService.criarContrato(contrato);
        return HttpResponse.status(status).body(null);
    }

    @Get("/agente")
    @Secured("AGENTE")
    @Status(HttpStatus.OK)
    public HttpResponse<List<Contrato>> listarContratosAgente(Authentication authentication) {
        try {
            Object userId = authentication.getAttributes().get("userId");
            if (userId == null) {
                return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Long agenteId = Long.parseLong(userId.toString());

            Agente agente = agenteService.getById(agenteId);
            List<Contrato> contratos = contratoService.getContratosByAgente(agente);
            return HttpResponse.ok(contratos);
        } catch (NumberFormatException e) {
            return HttpResponse.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return HttpResponse.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
