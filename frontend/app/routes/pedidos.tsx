import { useEffect, useState } from "react";
import type { Route } from "./+types/pedidos";
import {
  Car,
  XCircle,
  AlertCircle,
} from "lucide-react";
import api from "~/services/api.service";
import PedidoCard from "~/components/PedidoCard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Minhas Reservas - VrumVrum" },
    { name: "description", content: "Consulte suas reservas de veículos no VrumVrum" },
  ];
}

interface Pedido {
  id: number;
  dataSolicitacao: string;
  dataInicioDesejada: string;
  dataFimDesejada: string;
  status: string;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  agente?: {
    id: number;
    nome: string;
    email: string;
  };
  veiculo: {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    categoria: string;
    valorDia: number;
  };
  contrato?: {
    id: number;
    dataInicio: string;
    dataFim: string;
    valorTotal: number;
    assinadoCliente: boolean;
    assinadoAgente: boolean;
  };
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("vrumvrum_usuario");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.tipo !== "CLIENTE") {
        window.location.href = "/";
        return;
      }
    } else {
      window.location.href = "/login?redirect=/pedidos";
      return;
    }
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await api.get("/pedidos/cliente");
      setPedidos(response.data);
    } catch (err: any) {
      setError(err.response?.data?.mensagem || "Erro ao buscar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!cancelandoId) return;
    try {
      await api.put(`/pedidos/cancelar`, { id: cancelandoId });
      alert("Reserva cancelada com sucesso.");
      setCancelandoId(null);
      fetchPedidos();
    } catch (err: any) {
      alert(err.response?.data?.mensagem || "Erro ao cancelar reserva");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main">Minhas Reservas</h1>
            <p className="mt-2 text-text-main/80">Consulte o status das suas solicitações de aluguel</p>
          </div>
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-text-main mb-2">Buscando...</h3>
            <p className="text-text-main/60">Estamos localizando suas reservas.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main">Minhas Reservas</h1>
            <p className="mt-2 text-text-main/80">Consulte o status das suas solicitações de aluguel</p>
          </div>
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-main mb-2">Ops! Ocorreu um erro</h3>
            <p className="text-text-main/60 mb-6">{error}</p>
            <button
              onClick={fetchPedidos}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-black font-bold rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-racing text-primary italic mb-2">Minhas <span className="text-text-main">Reservas</span></h1>
          <p className="text-text-main/60 font-medium">Acompanhe o status e assine seus contratos digitalmente.</p>
        </div>

        {cancelandoId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
            <div className="bg-bg-card border border-slate-700 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl scale-in-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-main">Cancelar Reserva?</h3>
              <p className="text-sm text-text-main/60">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-4">
                <button onClick={handleCancelar} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-xl transition-all">SIM, CANCELAR</button>
                <button onClick={() => setCancelandoId(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-text-main font-black text-xs rounded-xl transition-all">VOLTAR</button>
              </div>
            </div>
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="text-center py-20 bg-bg-card/20 border border-dashed border-slate-700 rounded-[2.5rem]">
            <Car className="h-20 w-20 text-text-main/10 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-text-main mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-text-main/40">Você ainda não realizou nenhuma solicitação.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <PedidoCard 
                key={pedido.id}
                pedido={pedido}
                isSelected={selectedPedidoId === pedido.id}
                onSelect={() => setSelectedPedidoId(selectedPedidoId === pedido.id ? null : pedido.id)}
                onRefresh={fetchPedidos}
                onCancel={(id) => setCancelandoId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
