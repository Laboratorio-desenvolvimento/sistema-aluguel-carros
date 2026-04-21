import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { authService } from "~/services/auth.service";
import { Zap, FileCheck, LayoutDashboard, Car, Briefcase, ClipboardList } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "VrumVrum - Aluguel de Carros Digital" },
    { name: "description", content: "Alugue seu veículo de forma 100% digital e sem burocracia na VrumVrum." },
  ];
}

export default function Home() {
  const [user, setUser] = useState<{ id: number; nome: string; email: string; tipo: "CLIENTE" | "AGENTE" } | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    const storedUser = localStorage.getItem("vrumvrum_usuario");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
      <main className="">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center justify-center items-center">
          <div className="mx-auto bg-primary/10 border border-primary/40 rounded-full w-80 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <p className="text-primary font-bold text-sm">O futuro do aluguel de carros</p>
          </div>
          <h1 className="font-bold text-primary mt-9 mb-4 text-8xl font-racing italic">VrumVrum</h1>
          <h2 className="text-6xl font-racing text-text-main mt-20 mb-4">
            Alugue o carro ideal de forma{" "}
            <span className="text-primary">100%</span>{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-primary bg-clip-text text-transparent">digital.</span>
          </h2>
          <p className="text-text-main/80 mb-8 max-w-2xl mx-auto">
            Esqueça a burocracia. Escolha seu veículo, assine o contrato digitalmente e saia dirigindo. Simples, rápido e seguro.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user ? (
                <>
                  <a
                      href="/veiculos"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20"
                  >
                    <Car size={20} /> Quero Alugar
                  </a>
                  <a
                      href="/login"
                      className="inline-flex items-center gap-2 font-bold py-4 px-10 rounded-xl border border-primary/50 text-primary hover:bg-primary/5 transition-all"
                  >
                    <Briefcase size={20} /> Sou um agente
                  </a>
                </>
            ) : user.tipo === "CLIENTE" ? (
                <>
                  <a
                      href="/veiculos"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20"
                  >
                    <Car size={20} /> Ver Veículos
                  </a>
                  <a
                      href="/pedidos"
                      className="inline-flex items-center gap-2 font-bold py-4 px-10 rounded-xl border border-primary/50 text-primary hover:bg-primary/5 transition-all"
                  >
                    <ClipboardList size={20} /> Meus Pedidos
                  </a>
                </>
            ) : (
                <>
                  <a
                      href="/dashboard"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-primary/20"
                  >
                    <LayoutDashboard size={20} /> Ir para Dashboard
                  </a>
                  <a
                      href="/veiculos"
                      className="inline-flex items-center gap-2 font-bold py-4 px-10 rounded-xl border border-primary/50 text-primary hover:bg-primary/5 transition-all"
                  >
                    <Car size={20} /> Ver Veículos
                  </a>
                </>
            )}
          </div>
        </div>

        <div className="text-center justify-center items-center bg-bg-card/20 mx-auto p-6 rounded-3xl mt-12 mb-12 border border-slate-700/30">
          <h2 className="mt-10 mb-5 text-4xl font-racing text-primary">Porque escolher a VrumVrum? </h2>
          <p className="text-text-main/70">Nossa plataforma foi desenhada para eliminar o atrito entre você e o seu próximo destino.</p>
          <div className="mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group text-left">
              <div className="mb-5 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3 tracking-tight">Aprovação Imediata</h3>
              <p className="text-text-main/70 leading-relaxed">Análise de crédito e aprovação em tempo real. Não perca tempo em filas de locadoras.</p>
            </div>
            <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group text-left">
              <div className="mb-5 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileCheck size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3 tracking-tight">Contratos Seguros</h3>
              <p className="text-text-main/70 leading-relaxed">Assinatura digital com validade jurídica. Transparência total nas condições e valores.</p>
            </div>
            <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-300 group text-left">
              <div className="mb-5 w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <LayoutDashboard size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3 tracking-tight">Gestão Completa</h3>
              <p className="text-text-main/70 leading-relaxed">Acompanhe seus prazos, renove contratos e gerencie seus aluguéis direto pelo celular.</p>
            </div>
          </div>
        </div>
      </main>
  );
}