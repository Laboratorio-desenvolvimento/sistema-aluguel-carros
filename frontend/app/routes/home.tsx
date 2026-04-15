import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sistema de Aluguel de Carros" },
    { name: "description", content: "Bem-vindo ao sistema de aluguel de carros" },
  ];
}

export default function Home() {
  return (

      <main className="bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center justify-center items-center">
          <div className="mx-auto bg-yellow-400/10 border border-yellow-400/40 rounded-full  w-80 flex items-center justify-center gap-2">
            <span className=" inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
            <p className="text-yellow-400 dark:text-yellow-400">O futuro do aluguel de carros</p>
          </div>
          <h1 className="font-bold text-yellow-300 mt-9 mb-4 text-8xl font-racing italic"  > VrumVrum</h1>
          <h2 className="text-6xl font-racing text-gray-900 dark:text-gray-100 mt-20 mb-4">
            Alugue o carro ideal de forma{" "}
            <span className="text-yellow-300">100%</span>{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">digital.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Esqueça a burocracia. Escolha seu veículo, assine o contrato digitalmente e saia dirigindo. Simples, rápido e seguro.
          </p>

          <div className="mt-12">
            <a
              href="/cadastro-cliente"
              className="inline-block bg-yellow-300 hover:bg-yellow-400 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Quero Alugar
            </a>
            <a
              href=""
              className="inline-block ml-4 mt-4 sm:mt-0 font-bold py-3 px-8 rounded-lg  border border-yellow-400 text-yellow-400 bg-transparent transition-colors duration-200"
            >
              Sou um agente
            </a>
          </div>
        </div>
        <div className="text-center justify-center items-center bg-[#0F223F] mx-auto p-6">
          <h2 className="mt-10 mb-5 text-4xl font-racing text-yellow-300">Porque escolher a VrumVrum? </h2>
          <p>Nossa plataforma foi desenhada para eliminar o atrito entre você e o seu próximo destino.</p>
          <div className="mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 ">
              <div className="icon">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovação Imediata</h3>
              <p className="text-gray-900">Análise de crédito e aprovação em tempo real. Não perca tempo em filas de locadoras.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
              <div className="icon">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contratos Seguros</h3>
              <p className="text-gray-900">Assinatura digital com validade jurídica. Transparência total nas condições e valores.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
              <div className="icon">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão Completa</h3>
              <p className="text-gray-900">Acompanhe seus prazos, renove contratos e gerencie seus aluguéis direto pelo celular.</p>
            </div>
          </div>
        </div>
      </main>
  );
}
