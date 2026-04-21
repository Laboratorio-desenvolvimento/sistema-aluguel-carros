import { useState, useEffect } from "react";
import {
  Car,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  PenTool,
  ShieldCheck,
  X,
  ArrowRight,
  Calendar,
  Trash2
} from "lucide-react";
import api from "~/services/api.service";

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

interface PedidoCardProps {
  pedido: Pedido;
  isSelected: boolean;
  onSelect: () => void;
  onRefresh: () => void;
  onCancel: (id: number) => void;
}

const statusConfig = {
  PENDING: { label: "Pendente", color: "bg-primary", icon: Clock },
  UNDER_REVIEW: { label: "Em Análise", color: "bg-primary", icon: AlertCircle },
  APPROVED: { label: "Aprovado", color: "bg-green-400", icon: CheckCircle },
  REJECTED: { label: "Rejeitado", color: "bg-red-500", icon: XCircle },
  CANCELLED: { label: "Cancelado", color: "bg-bg-card/50 border border-slate-700/500", icon: XCircle },
  COMPLETED: { label: "Concluído", color: "bg-purple-500", icon: CheckCircle },
};

const steps = [
  { id: "PENDING", label: "Solicitação" },
  { id: "UNDER_REVIEW", label: "Análise" },
  { id: "APPROVED", label: "Aprovado" },
  { id: "COMPLETED", label: "Concluído" },
];

export default function PedidoCard({ pedido, isSelected, onSelect, onRefresh, onCancel }: PedidoCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [editDataInicio, setEditDataInicio] = useState("");
  const [editDataFim, setEditDataFim] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [edicaoSucesso, setEdicaoSucesso] = useState(false);

  const [disponivel, setDisponivel] = useState(true);
  const [validandoDisponibilidade, setValidandoDisponibilidade] = useState(false);
  const [erroDisponibilidade, setErroDisponibilidade] = useState<string | null>(null);

  const statusInfo = statusConfig[pedido.status as keyof typeof statusConfig] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  const getStepIndex = (status: string) => {
    if (status === "REJECTED" || status === "CANCELLED") return -1;
    const index = steps.findIndex(s => s.id === status);
    return index === -1 ? 0 : index;
  };

  const currentStep = getStepIndex(pedido.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const getDias = () => {
    if (!editDataInicio || !editDataFim) return 0;
    const inicio = new Date(editDataInicio);
    const fim = new Date(editDataFim);
    const diffTime = fim.getTime() - inicio.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const dias = getDias();
  const valorTotal = dias > 0 ? dias * pedido.veiculo.valorDia : 0;

  useEffect(() => {
    if (showEditModal && editDataInicio && editDataFim && dias > 0 && !edicaoSucesso) {
      const checkDisponibilidade = async () => {
        setValidandoDisponibilidade(true);
        setErroDisponibilidade(null);
        try {
          const res = await api.get("/veiculo", {
            params: { 
              inicio: editDataInicio, 
              fim: editDataFim,
              excludeId: pedido.id 
            }
          });
          const veiculosDisponiveis = res.data;
          const aindaDisponivel = veiculosDisponiveis.some((v: any) => v.id === pedido.veiculo.id);
          setDisponivel(aindaDisponivel);
          if (!aindaDisponivel) {
            setErroDisponibilidade("O veículo não está disponível nestas novas datas.");
          }
        } catch (err) {
          console.error("Erro ao validar disponibilidade", err);
        } finally {
          setValidandoDisponibilidade(false);
        }
      };
      const timer = setTimeout(checkDisponibilidade, 500);
      return () => clearTimeout(timer);
    }
  }, [editDataInicio, editDataFim, showEditModal, edicaoSucesso]);

  const handleAssinar = async () => {
    try {
      await api.post(`/pedidos/${pedido.id}/assinar`);
      alert("Contrato assinado com sucesso!");
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.mensagem || "Erro ao assinar contrato");
    }
  };

  const handleIniciarEdicao = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditDataInicio(pedido.dataInicioDesejada.split("T")[0]);
    setEditDataFim(pedido.dataFimDesejada.split("T")[0]);
    setEdicaoSucesso(false);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = async () => {
    if (dias <= 0) return;
    setSalvando(true);
    try {
      await api.put(`/pedidos/${pedido.id}`, {
        veiculo: { id: pedido.veiculo.id },
        dataInicioDesejada: new Date(editDataInicio).toISOString(),
        dataFimDesejada: new Date(editDataFim).toISOString()
      });
      setEdicaoSucesso(true);
    } catch (err: any) {
      alert(err.response?.data?.mensagem || "Erro ao atualizar reserva");
    } finally {
      setSalvando(false);
    }
  };

  const handleFecharEdicao = () => {
    setShowEditModal(false);
    if (edicaoSucesso) onRefresh();
  };

  const handleConfirmarCancelamento = () => {
    onCancel(pedido.id);
    setShowCancelModal(false);
  };

  return (
    <>
      <div className={`bg-bg-card/40 backdrop-blur-md border transition-all duration-500 overflow-hidden cursor-pointer ${isSelected ? "border-primary/50 ring-1 ring-primary/20 rounded-[2.5rem]" : "border-slate-800 rounded-[2rem] hover:border-slate-600 active:scale-[0.98]"
        }`} onClick={onSelect}>

        <div className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusInfo.color} text-black shadow-lg`}>
              <StatusIcon size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-main">{pedido.veiculo.marca} {pedido.veiculo.modelo}</h3>
              <p className="text-sm text-text-main/40 font-bold uppercase tracking-widest mt-0.5">Reserva #{pedido.id} • {formatDate(pedido.dataSolicitacao)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-right hidden sm:block border-r border-slate-800 pr-6 mr-2">
              <p className="text-[10px] text-text-main/40 font-black uppercase tracking-widest mb-1">Status</p>
              <p className={`text-sm font-bold ${statusInfo.color.replace('bg-', 'text-')}`}>{statusInfo.label}</p>
            </div>

            <div className="flex items-center gap-3 flex-1 sm:flex-none">
              {pedido.status === 'PENDING' && (
                <button
                  onClick={handleIniciarEdicao}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all cursor-pointer"
                >
                  <PenTool size={14} /> Editar Datas
                </button>
              )}
              {(pedido.status === 'PENDING' || pedido.status === 'APPROVED') && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCancelModal(true); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  <XCircle size={14} /> Cancelar
                </button>
              )}
              <div className={`w-10 h-10 rounded-xl bg-slate-800 text-text-main/40 flex items-center justify-center transition-transform duration-500 ${isSelected ? "rotate-180 text-primary" : ""}`}>
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="p-8 pt-0 border-t border-slate-700/30 animate-in slide-in-from-top-4 duration-500" onClick={(e) => e.stopPropagation()}>
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
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${idx <= currentStep ? "bg-primary border-primary text-black" : "bg-bg-card border-slate-800 text-text-main/20"
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
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/30">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Car size={14} /> Detalhes da Reserva
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
                    <div>
                      <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Valor Total</p>
                      <p className="text-sm text-primary font-black">R$ {((Math.ceil((new Date(pedido.dataFimDesejada).getTime() - new Date(pedido.dataInicioDesejada).getTime()) / (1000 * 60 * 60 * 24))) * pedido.veiculo.valorDia).toFixed(2)}</p>
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

              <div className="space-y-6">
                {pedido.contrato ? (
                  <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/30 h-full flex flex-col">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                      <PenTool size={14} /> Contrato Digital
                    </h4>

                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] text-text-main/30 font-black uppercase tracking-widest mb-1">Valor Total</p>
                          <p className="text-3xl font-black text-text-main">R$ {pedido.contrato.valorTotal.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-green-500/20">
                          Garantia Ativa
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-700/30">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className={pedido.contrato.assinadoCliente ? "text-green-500" : "text-text-main/20"} />
                            <span className="text-sm font-bold">Sua Assinatura</span>
                          </div>
                          {pedido.contrato.assinadoCliente ? (
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Confirmado</span>
                          ) : (
                            <button onClick={handleAssinar} className="px-6 py-3 bg-primary hover:bg-primary/90 text-black text-[10px] font-black rounded-xl transition-all cursor-pointer">ASSINAR AGORA</button>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className={pedido.contrato.assinadoAgente ? "text-green-500" : "text-text-main/20"} />
                            <span className="text-sm font-bold">Assinatura Agente</span>
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
                    <p className="text-sm text-text-main/40 font-bold uppercase tracking-widest">Aguardando aprovação</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-bg-card border border-slate-700/50 rounded-[1.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-400">
            {edicaoSucesso ? (
              <div className="p-12 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-primary" size={48} />
                </div>
                <h2 className="text-3xl font-black text-text-main font-racing italic">Reserva Atualizada!</h2>
                <p className="text-text-main/60 text-sm leading-relaxed">
                  As novas datas para o <span className="text-primary font-bold">{pedido.veiculo.marca} {pedido.veiculo.modelo}</span> foram registradas com sucesso.
                </p>
                <button
                  onClick={handleFecharEdicao}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-black rounded-xl transition-all cursor-pointer"
                >
                  ENTENDIDO
                </button>
              </div>
            ) : (
              <>
                <div className="relative p-8 border-b border-slate-700/50 bg-slate-800/30">
                  <h2 className="text-2xl font-black text-primary font-racing italic tracking-tight">Ajustar Período</h2>
                  <p className="text-text-main/40 font-bold uppercase tracking-widest text-[10px] mt-1">
                    {pedido.veiculo.marca} {pedido.veiculo.modelo}
                  </p>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-text-main/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Retirada</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                          type="date"
                          value={editDataInicio}
                          onChange={(e) => setEditDataInicio(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Devolução</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                          type="date"
                          value={editDataFim}
                          onChange={(e) => setEditDataFim(e.target.value)}
                          min={editDataInicio || new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {editDataInicio && editDataFim && dias > 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-main/40 font-bold uppercase tracking-wider">Novo Período:</span>
                        <span className="text-text-main font-black">{dias} dias</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-main/40 font-bold uppercase tracking-wider">Valor Diária:</span>
                        <span className="text-text-main font-black">R$ {pedido.veiculo.valorDia.toFixed(2)}</span>
                      </div>

                      {erroDisponibilidade && (
                        <div className="py-2 px-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                          <XCircle size={14} /> {erroDisponibilidade}
                        </div>
                      )}

                      <div className="pt-4 border-t border-slate-700 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Novo Total</p>
                          <h3 className="text-3xl font-black text-text-main">
                            R$ {valorTotal.toFixed(2)}
                          </h3>
                        </div>
                        {validandoDisponibilidade && (
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-1" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
                      <p className="text-text-main/20 text-xs font-bold uppercase tracking-widest">Aguardando definição de datas</p>
                    </div>
                  )}
                </div>

                <div className="p-8 pt-0 flex gap-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-text-main/60 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleSalvarEdicao}
                    disabled={salvando || !disponivel || validandoDisponibilidade || dias <= 0}
                    className="flex-[2] px-6 py-4 bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                  >
                    {salvando ? "PROCESSANDO..." : <>CONFIRMAR <ArrowRight size={20} /></>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-bg-card border border-slate-700/50 rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-400">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 className="text-red-500" size={40} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-text-main font-racing italic italic">Cancelar Reserva?</h2>
                <p className="text-text-main/40 font-bold uppercase tracking-widest text-[10px] mt-1">Pedido #{pedido.id}</p>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs text-text-main/60 leading-relaxed font-medium">
                  Ao cancelar esta reserva, os seguintes impactos ocorrerão:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-xs text-text-main/80 font-bold">
                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Ação irreversível: você não poderá reativar este pedido.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-text-main/80 font-bold">
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Liberação imediata: o {pedido.veiculo.marca} {pedido.veiculo.modelo} ficará disponível para outros clientes.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs text-text-main/80 font-bold">
                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Contrato Invalidado: qualquer documento gerado será anulado.</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-text-main/60 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Manter Reserva
                </button>
                <button
                  onClick={handleConfirmarCancelamento}
                  className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all active:scale-95 cursor-pointer uppercase text-xs tracking-widest"
                >
                  Sim, Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
