import { useEffect, useState } from "react";
import type { Route } from "./+types/pedidos";
import {
  Car,
  Calendar,
  User,
  FileText,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import api from "~/services/api.service";

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
  };
}

const statusConfig = {
  INTRODUCED: { label: "Introduzido", color: "bg-primary", icon: Clock },
  UNDER_REVIEW: { label: "Em Análise", color: "bg-primary", icon: AlertCircle },
  APPROVED: { label: "Aprovado", color: "bg-green-400", icon: CheckCircle },
  REJECTED: { label: "Rejeitado", color: "bg-red-500", icon: XCircle },
  CANCELLED: { label: "Cancelado", color: "bg-bg-card/50 border border-slate-700/500", icon: XCircle },
  COMPLETED: { label: "Concluído", color: "bg-purple-500", icon: CheckCircle },
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            timeZone: "UTC"
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        }).format(value);
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
        <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main">Minhas Reservas</h1>
            <p className="mt-2 text-text-main/80">Consulte o status das suas solicitações de aluguel</p>
            </div>

            {pedidos.length === 0 ? (
            <div className="text-center py-12">
                <Car className="h-16 w-16 text-text-main/70 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-main mb-2">Nenhuma reserva encontrada</h3>
                <p className="text-text-main/60">Você ainda não fez nenhuma solicitação de aluguel.</p>
            </div>
            ) : (
            <div className="bg-bg-card/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl">
                <ul className="divide-y divide-gray-200">
                {pedidos.map((pedido) => {
                    const statusInfo = statusConfig[pedido.status as keyof typeof statusConfig] || statusConfig.INTRODUCED;
                    const StatusIcon = statusInfo.icon;
                    return (
                    <li key={pedido.id} className="px-6 py-4 hover:bg-slate-800/40 transition-colors">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <span className={`flex-shrink-0 w-3 h-3 rounded-full ${statusInfo.color}`}></span>
                            <div>
                            <div className="flex items-center gap-2 text-sm text-text-main font-medium">
                                <Car className="h-5 w-5 text-text-main/70" />
                                {pedido.veiculo.marca} {pedido.veiculo.modelo}
                            </div>
                            <div className="text-sm text-text-main/70 mt-1">
                                {pedido.veiculo.placa} • {formatDate(pedido.dataInicioDesejada)} - {formatDate(pedido.dataFimDesejada)}
                            </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                            <div className="flex items-center gap-2 text-sm text-text-main/70">
                            <StatusIcon className="h-4 w-4" />
                            <span>{statusInfo.label}</span>
                            </div>
                            <div className="text-sm font-medium text-text-main">Reserva #{pedido.id}</div>
                            <button
                            onClick={() => setSelectedPedido(pedido)}
                            className="inline-flex items-center gap-1 px-3 py-1 border border-slate-700 rounded-md text-text-main bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                            <Eye className="h-4 w-4" />
                            Detalhes
                            </button>
                        </div>
                        </div>
                    </li>
                    );
                })}
                </ul>
            </div>
            )}

            {selectedPedido && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
                <div className="mt-20 w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <h2 className="text-xl font-semibold text-text-main">Detalhes da Reserva #{selectedPedido.id}</h2>
                    <p className="text-sm text-text-main/70">
                        Pedido de {formatDate(selectedPedido.dataInicioDesejada)} até {formatDate(selectedPedido.dataFimDesejada)}
                    </p>
                    </div>
                    <button onClick={() => setSelectedPedido(null)} className="text-text-main/70 hover:text-gray-700">
                    <XCircle className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Status:</span>
                    <span>{statusConfig[selectedPedido.status as keyof typeof statusConfig]?.label ?? selectedPedido.status}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-bg-card/50 border border-slate-700/50 p-4 rounded-2xl">
                    <div>
                        <h3 className="text-sm font-semibold text-text-main mb-2">Veículo</h3>
                        <p className="text-sm text-gray-700">{selectedPedido.veiculo.marca} {selectedPedido.veiculo.modelo}</p>
                        <p className="text-sm text-text-main/70">Placa: {selectedPedido.veiculo.placa}</p>
                        <p className="text-sm text-text-main/70">Categoria: {selectedPedido.veiculo.categoria}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-main mb-2">Valor</h3>

                        <p className="text-lg font-bold text-primary">
                            {formatCurrency(
                            (selectedPedido.veiculo.valorDia || 0) *
                            Math.ceil(
                                (new Date(selectedPedido.dataFimDesejada).getTime() -
                                new Date(selectedPedido.dataInicioDesejada).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                            )}
                        </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-bg-card/50 border border-slate-700/50 p-4 rounded-2xl">
                    <div>
                        <span className="text-sm font-medium text-text-main">Início</span>
                        <p className="text-sm text-gray-700">{formatDate(selectedPedido.dataInicioDesejada)}</p>
                    </div>
                    <div>
                        <span className="text-sm font-medium text-text-main">Fim</span>
                        <p className="text-sm text-gray-700">{formatDate(selectedPedido.dataFimDesejada)}</p>
                    </div>
                    </div>

                    {selectedPedido.agente ? (
                    <div className="bg-bg-card/50 border border-slate-700/50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2">
                        <User className="h-5 w-5 text-gray-700" />
                        Agente responsável
                        </div>
                        <p className="text-sm text-gray-700">{selectedPedido.agente.nome}</p>
                        <p className="text-sm text-text-main/70">{selectedPedido.agente.email}</p>
                    </div>
                    ) : (
                    <div className="bg-primary/10 border border-yellow-500/30 p-4 rounded-2xl text-primary">
                        <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Contrato ainda não foi gerado para esta reserva.
                        </div>
                    </div>
                    )}

                    {selectedPedido.contrato && (
                    <div className="bg-bg-card/50 border border-slate-700/50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 text-sm font-semibold text-text-main mb-2">
                        <FileText className="h-5 w-5 text-gray-700" />
                        Contrato
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-gray-700">
                        <div>
                            <span className="font-medium">Início</span>
                            <p>{formatDate(selectedPedido.contrato.dataInicio)}</p>
                        </div>
                        <div>
                            <span className="font-medium">Fim</span>
                            <p>{formatDate(selectedPedido.contrato.dataFim)}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="font-medium">Valor total</span>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(selectedPedido.contrato.valorTotal)}</p>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}
