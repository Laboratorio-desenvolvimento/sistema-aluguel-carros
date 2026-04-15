import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Sistema de Aluguel de Carros" },
        { name: "description", content: "Bem-vindo ao sistema de aluguel de carros" },
    ];
}

export default function DashboardCliente() {
    localStorage.setItem("nome", "X"); //Remover Linha depois de login funcional!
    const nome = localStorage.getItem("nome");
    return (
        <main className="bg-slate-950/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12  items-center">
                <h2 className="text-2xl font-bold "> Bem vindo, {nome}</h2>
                <div className="mt-15 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Pedidos Aprovados (Ativos)
                        </h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 col-span-1 md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Aguardando Assinatura
                        </h3>
                    </div>

                </div>
            </div>
            <div className="mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex gap-2">
                    <div className="icon">⚡</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Carros</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex gap-2">
                    <div className="icon">⚡</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Seus Pedidos</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex gap-2">
                    <div className="icon">⚡</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendentes</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex gap-2">
                    <div className="icon">⚡</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovados</h3>
                </div>
            </div>
        </main>
    );
}


