import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sistema de Aluguel de Carros" },
    { name: "description", content: "Bem-vindo ao sistema de aluguel de carros" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">Aluguel de Carros</h1>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium">
                Home
              </a>
              <a href="/cadastro-cliente" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium">
                Cadastro
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
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
          </div>
        </div>
      </main>
    </div>
  );
}
