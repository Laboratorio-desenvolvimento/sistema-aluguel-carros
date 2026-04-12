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
          <div className="mx-auto bg-[#0D1B3E] border rounded-full border-[#2D5BE3] w-80 ">
            <span className="w-2 h-2 rounded-full bg-red-900"></span>
            <p className="text-[#2563EB] dark:text-[#D6E4FF]">O futuro do aluguel de carros</p>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Bem-vindo ao Sistema de Aluguel de Carros
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Faça seu cadastro e comece a alugar os melhores carros disponíveis
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-8 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Variedade de Carros
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha entre diversos modelos e marcas disponíveis
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Preços Competitivos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                As melhores tarifas do mercado para suas necessidades
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 dark:bg-slate-900 dark:ring-1 dark:ring-slate-700">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Fácil e Seguro
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Processo simples e seguro de contratação
              </p>
            </div>
          </div>

          <div className="mt-12">
            <a
              href="/cadastro-cliente"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Comece seu Cadastro Agora
            </a>
            <a
              href="/login"
              className="inline-block ml-4 mt-4 sm:mt-0 bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-8 rounded-lg border border-blue-200 transition-colors duration-200"
            >
              Já tenho conta
            </a>
          </div>
        </div>
      </main>
  );
}
