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
  ChevronDown,
  ChevronUp,
  MapPin,
  PenTool,
  ShieldCheck,
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
    assinadoCliente: boolean;
    assinadoAgente: boolean;
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

    const handleAssinar = async (id: number) => {
      try {
        await api.post(`/pedidos/${id}/assinar`);
        alert("Contrato assinado com sucesso!");
        fetchPedidos();
      } catch (err: any) {
        alert(err.response?.data?.mensagem || "Erro ao assinar contrato");
      }
    };

    const steps = [
      { id: "INTRODUCED", label: "Solicitação", desc: "Aguardando agente" },
      { id: "UNDER_REVIEW", label: "Análise", desc: "Verificando dados" },
      { id: "APPROVED", label: "Aprovado", desc: "Contrato gerado" },
      { id: "COMPLETED", label: "Concluído", desc: "Veículo retirado" },
    ];

    const getStepIndex = (status: string) => {
      if (status === "REJECTED" || status === "CANCELLED") return -1;
      const index = steps.findIndex(s => s.id === status);
      return index === -1 ? 0 : index;
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

                {pedidos.length === 0 ? (
                    <div className="text-center py-20 bg-bg-card/20 border border-dashed border-slate-700 rounded-[2.5rem]">
                        <Car className="h-20 w-20 text-text-main/10 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-text-main mb-2">Nenhuma reserva encontrada</h3>
                        <p className="text-text-main/40">Você ainda não realizou nenhuma solicitação de aluguel.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pedidos.map((pedido) => {
                            const isSelected = selectedPedido?.id === pedido.id;
                            const statusInfo = statusConfig[pedido.status as keyof typeof statusConfig] || statusConfig.INTRODUCED;
                            const StatusIcon = statusInfo.icon;
                            const currentStep = getStepIndex(pedido.status);

                            return (
                                <div 
                                    key={pedido.id} 
                                    className={`bg-bg-card/40 backdrop-blur-md border transition-all duration-500 overflow-hidden ${
                                        isSelected ? "border-primary/50 ring-1 ring-primary/20 rounded-[2.5rem]" : "border-slate-800 rounded-[2rem] hover:border-slate-600"
                                    }`}
                                >
                                    {/* Header do Item */}
                                    <div 
                                        onClick={() => setSelectedPedido(isSelected ? null : pedido)}
                                        className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusInfo.color} text-black shadow-lg`}>
                                                <StatusIcon size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-text-main">{pedido.veiculo.marca} {pedido.veiculo.modelo}</h3>
                                                <p className="text-sm text-text-main/40 font-bold uppercase tracking-widest mt-0.5">Reserva #{pedido.id} • {formatDate(pedido.dataSolicitacao)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs text-text-main/40 font-black uppercase tracking-widest mb-1">Status Atual</p>
                                                <p className={`text-sm font-bold ${statusInfo.color.replace('bg-', 'text-')}`}>{statusInfo.label}</p>
                                            </div>
                                            <div className={`p-2 rounded-lg bg-slate-800 text-text-main/40 transition-transform duration-500 ${isSelected ? "rotate-180 text-primary" : ""}`}>
                                                <ChevronDown size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conteúdo Expandido */}
                                    {isSelected && (
                                        <div className="p-8 pt-0 border-t border-slate-700/30 animate-in slide-in-from-top-4 duration-500">
                                            {/* Stepper de Progresso */}
                                            {currentStep !== -1 && (
                                                <div className="py-10">
                                                    <div className="relative flex justify-between">
                                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2" />
                                                        <div 
                                                            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-1000" 
                                                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                                        />
                                                        {steps.map((step, idx) => (
                                                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                                                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                                                                    idx <= currentStep ? "bg-primary border-primary text-black" : "bg-bg-card border-slate-800 text-text-main/20"
                                                                }`}>
                                                                    {idx < currentStep ? <CheckCircle size={18} /> : <span className="text-xs font-black">{idx + 1}</span>}
                                                                </div>
                                                                <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${idx <= currentStep ? "text-primary" : "text-text-main/20"}`}>{step.label}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                                {/* Detalhes do Veículo e Período */}
                                                <div className="space-y-6">
                                                    <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/30">
                                                        <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <Car size={14} /> Detalhes do Aluguel
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div>
                                                                <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Período</p>
                                                                <p className="text-sm text-text-main font-bold">{formatDate(pedido.dataInicioDesejada)} - {formatDate(pedido.dataFimDesejada)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Categoria</p>
                                                                <p className="text-sm text-text-main font-bold">{pedido.veiculo.categoria}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Placa</p>
                                                                <p className="text-sm text-text-main font-bold">{pedido.veiculo.placa}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Valor Diária</p>
                                                                <p className="text-sm text-text-main font-bold">R$ {pedido.veiculo.valorDia.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {pedido.agente && (
                                                        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                                                            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                <User size={14} /> Atendimento
                                                            </h4>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                                    {pedido.agente.nome[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-text-main font-bold">{pedido.agente.nome}</p>
                                                                    <p className="text-xs text-text-main/40">{pedido.agente.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Contrato e Assinaturas */}
                                                <div className="space-y-6">
                                                    {pedido.contrato ? (
                                                        <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/30 h-full flex flex-col">
                                                            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                                                                <PenTool size={14} /> Contrato Digital
                                                            </h4>
                                                            
                                                            <div className="flex-1 space-y-6">
                                                                <div className="flex justify-between items-end">
                                                                    <div>
                                                                        <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Valor Total do Contrato</p>
                                                                        <p className="text-3xl font-black text-text-main">R$ {pedido.contrato.valorTotal.toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-green-500/20">
                                                                        Garantia Ativa
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4 pt-4 border-t border-slate-700/30">
                                                                    {/* Assinatura Cliente */}
                                                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                                                                        <div className="flex items-center gap-3">
                                                                            <ShieldCheck size={20} className={pedido.contrato.assinadoCliente ? "text-green-500" : "text-text-main/20"} />
                                                                            <span className="text-sm font-bold">Sua Assinatura</span>
                                                                        </div>
                                                                        {pedido.contrato.assinadoCliente ? (
                                                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmado</span>
                                                                        ) : (
                                                                            <button 
                                                                                onClick={() => handleAssinar(pedido.id)}
                                                                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-black text-[10px] font-black rounded-lg transition-all cursor-pointer"
                                                                            >
                                                                                ASSINAR AGORA
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {/* Assinatura Agente */}
                                                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                                                                        <div className="flex items-center gap-3">
                                                                            <ShieldCheck size={20} className={pedido.contrato.assinadoAgente ? "text-green-500" : "text-text-main/20"} />
                                                                            <span className="text-sm font-bold">Assinatura do Agente</span>
                                                                        </div>
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${pedido.contrato.assinadoAgente ? "text-green-500" : "text-text-main/20"}`}>
                                                                            {pedido.contrato.assinadoAgente ? "Confirmado" : "Pendente"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-800/10 border-2 border-dashed border-slate-700/30 rounded-3xl p-10 text-center flex flex-col items-center justify-center h-full">
                                                            <FileText size={40} className="text-text-main/10 mb-4" />
                                                            <p className="text-sm text-text-main/40 font-bold uppercase tracking-widest">Aguardando aprovação para gerar contrato</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
