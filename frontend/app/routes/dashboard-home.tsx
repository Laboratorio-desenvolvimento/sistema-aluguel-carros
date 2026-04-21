import { Clock, ShieldCheck, Car, TrendingUp, ClipboardList, Users, CheckCircle } from "lucide-react";

export default function DashboardHome() {
  const cardCls = "bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 transition-all duration-300 group";
  const iconBoxCls = "mb-5 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className={cardCls}>
          <div className={iconBoxCls}>
            <Car size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Total de Carros</p>
          <h3 className="text-3xl font-black text-text-main">24</h3>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
            <TrendingUp size={14} /> +3 este mês
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <ClipboardList size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Pedidos Ativos</p>
          <h3 className="text-3xl font-black text-text-main">12</h3>
          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
            <Clock size={14} /> 4 aguardando
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <Users size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Clientes</p>
          <h3 className="text-3xl font-black text-text-main">158</h3>
          <div className="mt-4 flex items-center gap-1 text-green-400 text-xs font-bold">
            <TrendingUp size={14} /> +12% crescimento
          </div>
        </div>

        <div className={cardCls}>
          <div className={iconBoxCls}>
            <CheckCircle size={24} className="text-primary" />
          </div>
          <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Carros Alugados</p>
          <h3 className="text-3xl font-black text-text-main">18 <span className="text-sm text-text-main/20">/ 24</span></h3>
          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
            <ShieldCheck size={14} /> 75% da frota ativa
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    J
                  </div>
                  <div>
                    <p className="text-text-main font-bold">João Silva</p>
                    <p className="text-text-main/40 text-xs">Toyota Corolla • 3 dias</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                  Aguardando
                </span>
              </div>
            ))}
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
