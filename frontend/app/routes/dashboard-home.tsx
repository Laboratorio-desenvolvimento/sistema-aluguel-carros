import { Clock, ShieldCheck, Car, TrendingUp, ClipboardList, Users, CheckCircle, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import api from "~/services/api.service";

interface Veiculo {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  categoria: string;
  combustivel: string;
  lugares: number;
  potencia: string;
  valorDia: number;
  avaliacao: number;
  destaque?: boolean;
  itens: string | null;
  foto: string | null;
}

interface Pedido {
  id: number;
  dataSolicitacao: string;
  status: string;
  cliente?: { id: number; nome: string };
  veiculo?: { id: number; modelo: string };
  agente?: { id: number };
  contrato?: {
    valorTotal: number;
  };
}

export default function DashboardHome() {
  const cardCls = "bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 transition-all duration-300 group";
  const iconBoxCls = "mb-5 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors";
  
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const storedUser = localStorage.getItem("vrumvrum_usuario");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        try {
          const [veiculosRes, pedidosRes] = await Promise.all([
            api.get(`/veiculo/agente/${user.id}`),
            api.get('/pedidos')
          ]);
          setVeiculos(veiculosRes.data);
          
          // Filtra pedidos para o escopo do Agente
          const agentPedidos = pedidosRes.data.filter((p: any) => p.agente?.id === user.id);
          setPedidos(agentPedidos);
        } catch (err) {
          console.error("Erro ao puxar dados reais para o dashboard:", err);
        }
      }
    };
    fetchDashboardData();
  }, []);

  const totalCarros = veiculos.length;
  const pedidosAtivos = pedidos.filter(p => !["CANCELLED", "REJECTED"].includes(p.status)).length;
  const pedidosAguardando = pedidos.filter(p => p.status === "PENDING" || p.status === "UNDER_REVIEW").length;
  const clientesAtivos = new Set(pedidos.filter(p => p.cliente).map(p => p.cliente!.id)).size;
  
  
  const rendimentoTotal = pedidos
    .filter(p => p.status === "APPROVED" || p.status === "COMPLETED")
    .reduce((sum, p) => sum + (p.contrato?.valorTotal || 0), 0);

  const carrosAlugados = pedidos.filter(p => p.status === "APPROVED").length;
  const pctAlugados = totalCarros > 0 ? Math.round((carrosAlugados / totalCarros) * 100) : 0;

  const pedidosRecentes = [...pedidos]
    .sort((a, b) => new Date(b.dataSolicitacao || Date.now()).getTime() - new Date(a.dataSolicitacao || Date.now()).getTime())
    .slice(0, 3);
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        <div className={cardCls}>
          <div className={iconBoxCls}>
            <Car size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Total de Frota</p>
          <h3 className="text-3xl font-black text-text-main">{totalCarros}</h3>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
            <TrendingUp size={14} /> Ativo no catálogo
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <ClipboardList size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Pedidos Ativos</p>
          <h3 className="text-3xl font-black text-text-main">{pedidosAtivos}</h3>
          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
            <Clock size={14} /> {pedidosAguardando} pendentes / análise
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <Users size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Clientes</p>
          <h3 className="text-3xl font-black text-text-main">{clientesAtivos}</h3>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
            <CheckCircle size={14} /> Contratos vigentes
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <CheckCircle size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Carros Alugados</p>
          <h3 className="text-3xl font-black text-text-main">{carrosAlugados} <span className="text-sm text-text-main/20">/ {totalCarros}</span></h3>
          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
            <ShieldCheck size={14} /> {pctAlugados}% da frota alocada
          </div>
        </div>

        <div className={`${cardCls} bg-primary/5 hover:border-primary border border-primary/20`}>
          <div className={`${iconBoxCls} bg-primary/20 group-hover:bg-primary/30`}>
            <DollarSign size={24} className="text-primary" />
          </div>
          <p className="text-text-main/60 text-[10px] font-black uppercase tracking-widest mb-1">Visão Financeira Bruta</p>
          <h3 className="text-2xl font-black text-primary">
             {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rendimentoTotal)}
          </h3>
          <div className="mt-4 flex items-center gap-1 text-primary/80 text-[10px] font-bold uppercase tracking-widest leading-tight">
            Validados em Análise
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className={`${cardCls} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Clock className="text-primary" size={20} /> Pedidos Recentes
            </h3>
            <a href="/dashboard/pedidos" className="text-primary text-sm font-bold hover:underline">Ver todos</a>
          </div>
          <div className="space-y-6">
            {pedidosRecentes.length > 0 ? pedidosRecentes.map((pedido) => (
              <div key={pedido.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {pedido.cliente?.nome ? pedido.cliente.nome.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <p className="text-text-main font-bold">{pedido.cliente?.nome || "Cliente (Sem Nome)"}</p>
                    <p className="text-text-main/40 text-[10px] font-bold uppercase tracking-widest mt-1">{pedido.veiculo?.modelo || "Veículo Excluído"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${pedido.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : pedido.status === 'REJECTED' || pedido.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                  {pedido.status}
                </span>
              </div>
            )) : (
              <p className="p-4 text-sm font-bold text-text-main/40">Nenhum pedido atrelado aos seus veículos ainda.</p>
            )}
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-2">
            <ShieldCheck className="text-primary" size={20} /> Atalhos Rápidos
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <a href="/dashboard/contratos" className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
              <p className="text-text-main font-bold group-hover:text-primary transition-colors">Contratos Ativos</p>
              <p className="text-text-main/40 text-xs">Gerencie os contratos de locação</p>
            </a>
            <a href="/dashboard/history" className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
              <p className="text-text-main font-bold group-hover:text-primary transition-colors">Histórico Completo</p>
              <p className="text-text-main/40 text-xs">Consulte atividades passadas</p>
            </a>
            <a href="/dashboard/pedidos" className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
              <p className="text-text-main font-bold group-hover:text-primary transition-colors">Todos os Pedidos</p>
              <p className="text-text-main/40 text-xs">Veja a fila de solicitações</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
