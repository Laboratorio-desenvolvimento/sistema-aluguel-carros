export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm dark:bg-slate-900 dark:shadow-slate-950/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-bold text-blue-600">Aluguel de Carros</h1>
                    <div className="flex gap-4">
                        <a href="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium">
                            Início
                        </a>
                        <a href="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium">
                            Login
                        </a>
                        <a href="/cadastro-cliente" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 font-medium">
                            Cadastro
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
