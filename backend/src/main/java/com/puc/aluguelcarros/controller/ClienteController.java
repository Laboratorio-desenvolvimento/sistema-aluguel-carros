package com.puc.aluguelcarros.controller;

import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.EntidadeEmpregadora;
import com.puc.aluguelcarros.service.ClienteService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.*;
import io.micronaut.http.annotation.Error;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import jakarta.transaction.Transactional;

import java.util.List;

@Controller("/cliente")
@Secured(SecurityRule.IS_ANONYMOUS)
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @Post
    @Status(HttpStatus.CREATED)
    public Cliente criar (@Body Cliente cliente) {
        return clienteService.salvar(cliente);
    }

    @Get
    @Status(HttpStatus.CREATED)
    public List<Cliente> listar (){
        return clienteService.listarTodos();
    }

    @Delete("/{cpf}")
    @Status(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String cpf) {
        clienteService.deletar(cpf);
    }

    @Put("/{cpf}")
    @Status(HttpStatus.OK)
    public Cliente atualizar(@PathVariable String cpf, @Body Cliente cliente) {
        return clienteService.atualizar(cpf, cliente);
    }

    @Get("/{id}/empregadoras")
    @Status(HttpStatus.OK)
    public List<EntidadeEmpregadora> listarEmpregadoras(@PathVariable Long id) {
        return clienteService.listarEmpregadoras(id);
    }

    @Error
    public HttpResponse<String> handleErro(RuntimeException e) {
        return HttpResponse.badRequest(e.getMessage());
    }

}
