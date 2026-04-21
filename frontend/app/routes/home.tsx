import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import { Zap, FileCheck, LayoutDashboard, Car, Briefcase } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sistema de Aluguel de Carros" },
    { name: "description", content: "Bem-vindo ao sistema de aluguel de carros" },
  ];
}

export default function Home() {
  return (

    <main className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center justify-center items-center">
        <div className="mx-auto bg-primary/10 border border-primary/40 rounded-full  w-80 flex items-center justify-center gap-2">
          <span className=" inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
          <p className="text-primary">O futuro do aluguel de carros</p>
        </div>
        <h1 className="font-bold text-primary mt-9 mb-4 text-8xl font-racing italic"  > VrumVrum</h1>
        <h2 className="text-6xl font-racing text-text-main mt-20 mb-4">
          Alugue o carro ideal de forma{" "}
          <span className="text-primary">100%</span>{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">digital.</span>
        </h2>
        <p className="text-text-main/80 mb-8">
          Esqueça a burocracia. Escolha seu veículo, assine o contrato digitalmente e saia dirigindo. Simples, rápido e seguro.
        </p>

        <div className="mt-12">
          <a
            href="/veiculos"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary text-black font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            <Car size={18} /> Quero Alugar
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 ml-4 mt-4 sm:mt-0 font-bold py-3 px-8 rounded-lg border border-yellow-400 text-primary bg-transparent transition-colors duration-200"
          >
            <Briefcase size={18} /> Sou um agente
          </a>
        </div>
      </div>
      <div className="text-center justify-center items-center bg-bg-card/20 mx-auto p-6 rounded-3xl mt-12 mb-12 border border-slate-700/30">
        <h2 className="mt-10 mb-5 text-4xl font-racing text-primary">Porque escolher a VrumVrum? </h2>
        <p>Nossa plataforma foi desenhada para eliminar o atrito entre você e o seu próximo destino.</p>
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
