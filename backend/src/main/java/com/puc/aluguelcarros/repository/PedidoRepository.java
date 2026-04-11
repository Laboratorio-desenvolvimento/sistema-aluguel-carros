package com.puc.aluguelcarros.repository;
import com.puc.aluguelcarros.model.Pedido;
import com.puc.aluguelcarros.model.Cliente;
import com.puc.aluguelcarros.model.Veiculo;
import com.puc.aluguelcarros.model.Agente;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends CrudRepository<Pedido, Long>{
    Optional<Pedido> findById(Long id);
    Optional<Pedido> findByIdAndCliente(Long id, Cliente cliente);
    Optional<Pedido> findByIdAndAgente(Long id, Agente agente);
    List<Pedido> findByVeiculoId(Veiculo veiculo);
    List<Pedido> findByCliente(Cliente cliente);
    List<Pedido> findByContratoAgente(Agente agente);
}
