import { ClipboardList, CheckCircle, XCircle, Eye, X, Clock, User, Car, Calendar, DollarSign, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, useEffect } from "react";
import api from "~/services/api.service";

interface Pedido {
  id: number;
  dataSolicitacao: string;
  dataInicioDesejada: string;
  dataFimDesejada: string;
  status: string;
  cliente?: { id: number; nome: string; email: string };
  veiculo?: { id: number; modelo: string; placa: string; marca: string };
  agente?: { id: number };
  contrato?: { id: number; valorTotal: number };
}

export default function DashboardPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPedido, setModalPedido] = useState<Pedido | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "aprovados" | "encerrados">("pendentes");

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("vrumvrum_usuario");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      
      const res = await api.get('/pedidos');
      const agentPedidos = res.data.filter((p: any) => p.agente?.id === user.id);
      
      const sorted = agentPedidos.sort((a: any, b: any) => {
          return new Date(b.dataSolicitacao || 0).getTime() - new Date(a.dataSolicitacao || 0).getTime();
      });
      setPedidos(sorted);
    } catch (e) {
      console.error("Erro ao carregar pedidos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const formatDate = (d: string) => {
    if (!d) return "--/--/----";
    return new Date(d).toLocaleDateString("pt-BR");
  };

  const handleAprovar = async (pedido: Pedido) => {
  try {
    const response = await api.put("/pedidos/executar", pedido);

    console.log("Sucesso:", response.data);

    fetchPedidos();
    setModalPedido(null);
  } catch (error: any) {
    console.error("Erro completo:", error);

    if (error.response) {
      // Backend respondeu (erro 4xx ou 5xx)
      console.error("Status:", error.response.status);
      console.error("Dados:", error.response.data);

      alert(
        `Erro ${error.response.status}: ${
          typeof error.response.data === "object"
            ? JSON.stringify(error.response.data)
            : error.response.data
        }`
      );
    } else if (error.request) {
      // Request foi feita mas não teve resposta (CORS, servidor off, etc)
      console.error("Sem resposta:", error.request);
      alert("Erro: sem resposta do servidor.");
    } else {
      // Erro ao montar a requisição
      console.error("Erro:", error.message);
      alert(`Erro: ${error.message}`);
    }
  }
};
  const handleReprovar = async (pedido: Pedido) => {
    try {
        await api.put("/pedidos/reprovar", pedido);
        fetchPedidos();
        setModalPedido(null);
    } catch(e) {
        console.error(e);
        alert("Erro ao reprovar o pedido.");
    }
  };

  const filteredPedidos = pedidos.filter(p => {
    if (filtro === "todos") return true;
    if (filtro === "pendentes") return p.status === "PENDING" || p.status === "UNDER_REVIEW";
    if (filtro === "aprovados") return p.status === "APPROVED" || p.status === "COMPLETED";
    if (filtro === "encerrados") return p.status === "REJECTED" || p.status === "CANCELLED";
    return true;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
             <ClipboardList className="text-primary" size={20} /> Pedidos Recebidos
           </h3>
           <p className="text-text-main/40 text-sm">Acompanhe as solicitações e direcione para execução.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
            {["pendentes", "todos", "aprovados", "encerrados"].map(f => (
                <button
                   key={f}
                   onClick={() => setFiltro(f as any)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filtro === f ? 'bg-primary text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-text-main/40 hover:text-text-main hover:bg-white/5'}`}
                >
                   {f}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-[2rem] shadow-2xl overflow-hidden">
         {loading ? (
             <div className="flex justify-center p-12 text-primary animate-pulse"><RefreshCw className="animate-spin" /></div>
         ) : filteredPedidos.length === 0 ? (
             <p className="text-text-main/40 text-sm font-bold italic text-center p-12">Nenhum registro no filtro atual.</p>
         ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] uppercase text-text-main/40 tracking-widest border-b border-white/5">
                        <tr>
                            <th className="py-3 px-4">Locação</th>
                            <th className="py-3 px-4">Veículo</th>
                            <th className="py-3 px-4">Cliente</th>
                            <th className="py-3 px-4">Período Desejado</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPedidos.map(pedido => (
                            <tr key={pedido.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="py-4 px-4 font-bold text-text-main">
                                    #{pedido.id} <br/> 
                                    <span className="text-[10px] text-text-main/40">{formatDate(pedido.dataSolicitacao)}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="font-bold text-primary">{pedido.veiculo?.modelo || "N/A"}</p>
                                    <p className="text-xs text-text-main/40 uppercase font-black">{pedido.veiculo?.placa}</p>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="font-bold">{pedido.cliente?.nome || "Desconhecido"}</p>
                                </td>
                                <td className="py-4 px-4 font-bold text-xs">
                                    {formatDate(pedido.dataInicioDesejada)} &rarr; {formatDate(pedido.dataFimDesejada)}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${pedido.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : pedido.status === 'REJECTED' || pedido.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                        {pedido.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <button onClick={() => setModalPedido(pedido)} className="p-2.5 bg-slate-800 hover:bg-primary hover:text-black text-primary rounded-xl transition-colors border border-primary/20 hover:border-primary shadow-lg">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         )}
      </div>

      {modalPedido && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
             <div className="bg-bg-card border border-white/10 p-8 rounded-[2rem] w-full max-w-2xl shadow-2xl relative">
                 <button onClick={() => setModalPedido(null)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={24} /></button>
                 
                 <div className="mb-6">
                    <h2 className="text-2xl font-black text-primary uppercase italic tracking-wider flex items-center gap-3">
                        Detalhes do Pedido #{modalPedido.id}
                    </h2>
                    <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${modalPedido.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : modalPedido.status === 'REJECTED' || modalPedido.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-primary/10 text-primary border border-primary/30'}`}>
                        Status Atual: {modalPedido.status}
                    </span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 mb-6">
                    <div>
                        <p className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest flex items-center gap-2 mb-1"><User size={12} className="text-primary"/> Perfil do Cliente</p>
                        <p className="font-bold text-base">{modalPedido.cliente?.nome}</p>
                        <p className="text-sm text-text-main/60">{modalPedido.cliente?.email}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest flex items-center gap-2 mb-1"><Car size={12} className="text-primary"/> Veículo Selecionado</p>
                        <p className="font-bold text-base">{modalPedido.veiculo?.modelo} <span className="text-xs font-normal">({modalPedido.veiculo?.marca})</span></p>
                        <p className="text-xs text-text-main/60 uppercase tracking-widest">Placa: {modalPedido.veiculo?.placa}</p>
                    </div>
                 </div>

                 <div className="flex gap-6 p-6 rounded-3xl border border-white/5 bg-white/5 mb-8">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest flex items-center gap-2 mb-1"><Calendar size={12} className="text-primary"/> Janela de Locação</p>
                        <p className="font-bold text-sm tracking-widest">{formatDate(modalPedido.dataInicioDesejada)} &rarr; {formatDate(modalPedido.dataFimDesejada)}</p>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                     <button onClick={() => setModalPedido(null)} className="px-5 py-3 font-bold text-xs text-text-main/60 hover:text-text-main transition-colors uppercase tracking-widest">
                         Fechar
                     </button>
                     
                     {(modalPedido.status === 'PENDING' || modalPedido.status === 'UNDER_REVIEW') && (
                         <>
                            <button onClick={() => handleReprovar(modalPedido)} className="px-5 py-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-2 border border-red-500/20 hover:border-red-500">
                                <ThumbsDown size={14} /> Recusar
                            </button>
                            <button onClick={() => handleAprovar(modalPedido)} className="px-5 py-3 bg-primary hover:bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2">
                                <ThumbsUp size={14} /> Executar Pedido
                            </button>
                         </>
                     )}
                 </div>
             </div>
         </div>
      )}

    </div>
  );
}
