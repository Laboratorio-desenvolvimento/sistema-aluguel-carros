import type { Route } from "./+types/dashboard";
import { useEffect, useState } from "react";
import { authService } from "~/services/auth.service";
import { Car, ClipboardList, Clock, CheckCircle, Zap, ShieldCheck, TrendingUp, Users } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard - VrumVrum" },
        { name: "description", content: "Gerencie sua frota e pedidos na VrumVrum" },
    ];
}

export default function Dashboard() {
    const [user, setUser] = useState<{ id: number; nome: string; email: string; tipo: string } | null>(null);

    useEffect(() => {
        const token = authService.getToken();
        const storedUser = localStorage.getItem("vrumvrum_usuario");
        if (token && storedUser) {
            const user = JSON.parse(storedUser);
            setUser(user);
            if (user.tipo !== "AGENTE") {
                window.location.href = "/";
                return;
            }
        } else {
            window.location.href = "/login?redirect=/dashboard";
            return;
        }
    }, []);

    const cardCls = "bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 transition-all duration-300 group";
    const iconBoxCls = "mb-5 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors";

    return (
        <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-text-main tracking-tight italic font-racing">
                            Olá, <span className="text-primary">{user?.nome.split(" ")[0]}!</span>
                        </h1>
                        <p className="text-text-main/60 mt-2 text-lg">Aqui está o resumo da sua operação hoje.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="/cadastro-veiculo" className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <Zap size={18} /> Novo Veículo
                        </a>
                    </div>
                </div>

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
                        <p className="text-text-main/40 text-sm font-bold uppercase tracking-widest mb-1">Taxa de Conversão</p>
                        <h3 className="text-3xl font-black text-text-main">94%</h3>
                        <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
                            <ShieldCheck size={14} /> Alta fidelidade
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className={`${cardCls} lg:col-span-2`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                                <Clock className="text-primary" size={20} /> Pedidos Recentes
                            </h3>
                            <a href="/pedidos" className="text-primary text-sm font-bold hover:underline">Ver todos</a>
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
                            <button className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
                                <p className="text-text-main font-bold group-hover:text-primary transition-colors">Relatórios Mensais</p>
                                <p className="text-text-main/40 text-xs">Baixe os PDFs de faturamento</p>
                            </button>
                            <button className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
                                <p className="text-text-main font-bold group-hover:text-primary transition-colors">Configurar Frota</p>
                                <p className="text-text-main/40 text-xs">Ajuste preços e disponibilidade</p>
                            </button>
                            <button className="w-full p-4 bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl text-left transition-all group">
                                <p className="text-text-main font-bold group-hover:text-primary transition-colors">Suporte Direto</p>
                                <p className="text-text-main/40 text-xs">Fale com a central VrumVrum</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}