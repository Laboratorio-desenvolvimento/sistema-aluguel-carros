import { useEffect, useState, useRef } from "react";
import { authService } from "~/services/auth.service";
import { User, LogOut, LayoutDashboard, ChevronDown, ClipboardList } from "lucide-react";

export default function Navbar() {
    const [user, setUser] = useState<{ id: number; nome: string; email: string; tipo: "CLIENTE" | "AGENTE" } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = authService.getToken();
        const storedUser = localStorage.getItem("vrumvrum_usuario");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 text-primary font-bold tracking-widest text-sm border-l border-slate-700 pl-8 cursor-pointer focus:outline-none"
                                    >
                                        Olá, {user.nome.split(" ")[0]}
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-60 bg-bg-card border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 z-[60] p-1.5">
                                            <div className="px-4 py-3 mb-1.5 border-b border-slate-700/50">
                                                <p className="text-[10px] text-text-main/40 font-black uppercase tracking-[0.2em] mb-0.5">Sua Conta</p>
                                                <p className="text-sm text-text-main font-bold truncate">{user.nome}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <a
                                                    href="/perfil"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-text-main/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <User size={16} />
                                                    </div>
                                                    <span className="font-semibold">Meu Perfil</span>
                                                </a>

                                                {user.tipo === "AGENTE" ? (
                                                    <a
                                                        href="/dashboard"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-main/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                            <LayoutDashboard size={16} />
                                                        </div>
                                                        <span className="font-semibold">Painel de Controle</span>
                                                    </a>
                                                ) : (
                                                    <a
                                                        href="/pedidos"
                                                        className="flex items-center gap-3 px-4 py-2 text-sm text-text-main/80 hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                            <ClipboardList size={16} />
                                                        </div>
                                                        <span className="font-semibold">Meus Pedidos</span>
                                                    </a>
                                                )}
                                            </div>

                                            <div className="mt-1.5 pt-1.5 border-t border-slate-700/50">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                                        <LogOut size={16} />
                                                    </div>
                                                    <span className="font-semibold">Sair da conta</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
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