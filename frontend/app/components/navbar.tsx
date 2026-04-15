import { useEffect, useState } from "react";

export default function Navbar() {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    }, []);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
            setTheme("light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
            setTheme("dark");
        }
    };

    return (
        <nav className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm sticky top-0 z-50 transition-all duration-300 py-1">
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
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter font-racing italic transition-colors">VrumVrum</h1>
                    </a>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-8">
                            <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold uppercase tracking-widest text-sm transition-colors">
                                Início
                            </a>

                            <a href="/veiculos" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold uppercase tracking-widest text-sm transition-colors">
                                Veículos
                            </a>

                            <a href="/login" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold uppercase tracking-widest text-sm transition-colors">
                                Login
                            </a>

                            <a href="/cadastro" className="text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold uppercase tracking-widest text-sm transition-colors">
                                Cadastro
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
