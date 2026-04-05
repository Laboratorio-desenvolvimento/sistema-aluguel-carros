package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.EntidadeEmpregadora;
import com.puc.aluguelcarros.service.EntidadeEmpregadoraService;
import io.micronaut.http.annotation.*;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import io.micronaut.http.HttpStatus;

import java.util.List;

@Controller("/entidadeEmpregadora")
@Secured(SecurityRule.IS_ANONYMOUS)
public class EntidadeEmpregadoraController {
    private final EntidadeEmpregadoraService entidadeEmpregadoraService;

    public EntidadeEmpregadoraController(EntidadeEmpregadoraService entidadeEmpregadoraService) {
        this.entidadeEmpregadoraService = entidadeEmpregadoraService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public EntidadeEmpregadora criar (@Body EntidadeEmpregadora entidadeEmpregadora){
        return entidadeEmpregadoraService.salvar(entidadeEmpregadora);
    }

    @Get
    @Status(HttpStatus.CREATED)
    public List<EntidadeEmpregadora> listar (){
        return entidadeEmpregadoraService.listarTodos();
    }

    @Delete("/{id}")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar (Long id) {
        entidadeEmpregadoraService.deletar(id);
    }
}
