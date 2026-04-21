import { useEffect, useState } from "react";
import { authService } from "~/services/auth.service";

export default function Navbar() {
    const [user, setUser] = useState<{ id: number; nome: string; email: string; tipo: "CLIENTE" | "AGENTE" } | null>(null);

    useEffect(() => {
        const token = authService.getToken();
        const storedUser = localStorage.getItem("vrumvrum_usuario");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);



    const handleLogout = () => {
        authService.logout();
        localStorage.removeItem("vrumvrum_usuario");
        window.location.href = "/";
    };

    return (
        <nav className="bg-bg-main/90 backdrop-blur-md border-b border-slate-700/50 shadow-sm sticky top-0 z-50 transition-all duration-300 py-1">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="/" className="flex items-center gap-3 group">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-12 h-10 group-hover:translate-x-1 transition-transform duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M2 13h4M1 10h3M3 16h2" className="stroke-yellow-500" strokeWidth="2" strokeLinecap="round" />
                            <path d="M23 15l-1-1h-2.5l-2-4h-7l-2 4H6v1h17v-1z M7 15v-1h2.3l1.5-3h6.4l1.5 3H21v1H7z" className="fill-yellow-500/30" />
                            <path d="M6 15.5h15l1 1v1H5v-1l1-1z" className="fill-yellow-500" />
                            <circle cx="8" cy="18" r="1.5" className="fill-yellow-500" />
                            <circle cx="18" cy="18" r="1.5" className="fill-yellow-500" />
                        </svg>
                        <h1 className="text-3xl font-black text-text-main tracking-tighter font-racing italic transition-colors">VrumVrum</h1>
                    </a>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center gap-8">
                            <a href="/" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors">
                                Início
                            </a>

                            <a href="/veiculos" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors">
                                Veículos
                            </a>

                            {user ? (
                                <>
                                    {user.tipo === "CLIENTE" ? (
                                        <a href="/pedidos" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors">
                                            Pedidos
                                        </a>
                                    ) : (
                                        <a href="/dashboard" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors">
                                            Dashboard
                                        </a>
                                    )}
                                    <span className="text-primary font-bold tracking-widest text-sm border-l border-slate-700 pl-8">
                                        Olá, {user.nome.split(" ")[0]}
                                    </span>
                                    <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-bold uppercase tracking-widest text-sm transition-colors cursor-pointer">
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors border-l border-slate-700 pl-8">
                                        Login
                                    </a>

                                    <a href="/cadastro" className="text-text-main/80 hover:text-primary font-bold uppercase tracking-widest text-sm transition-colors">
                                        Cadastro
                                    </a>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
}
