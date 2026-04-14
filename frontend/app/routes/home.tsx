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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center justify-center items-center">
          <div className="mx-auto bg-yellow-400/10 border border-yellow-400/40 rounded-full  w-80 flex items-center justify-center gap-1">
            <span className=" inline-block w-2 h-2 rounded-full bg-yellow-600"></span>
            <p className="text-yellow-500 dark:text-yellow-500">O futuro do aluguel de carros</p>
          </div>
          <h1 className="font-bold text-yellow-500 mt-9 mb-4 text-8xl font-racing italic"  > VrumVrum</h1>
          <h2 className="text-6xl font-racing text-gray-900 dark:text-gray-100 mt-4 mb-4">
            Alugue o carro ideal de forma{" "}
            <span className="text-yellow-400">100%</span>{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">digital.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Esqueça a burocracia. Escolha seu veículo, assine o contrato digitalmente e saia dirigindo. Simples, rápido e seguro.
          </p>

          <div className="mt-12">
            <a
              href="/cadastro-cliente"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Comece seu Cadastro Agora
            </a>
            <a
              href="/login"
              className="inline-block ml-4 mt-4 sm:mt-0 font-bold py-3 px-8 rounded-lg  border border-yellow-400 text-yellow-400 bg-transparent transition-colors duration-200"
            >
              Já tenho conta
            </a>
          </div>
        </div>
      </main>
  );
}
