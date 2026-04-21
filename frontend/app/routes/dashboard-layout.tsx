import { useEffect, useState } from "react";
import { authService } from "~/services/auth.service";
import { Car, ClipboardList, Clock, CheckCircle, Zap, ShieldCheck, TrendingUp, Users } from "lucide-react";
import DashboardTabs from "~/components/dashboard-tabs";
import { Outlet, useLocation } from "react-router";

export default function DashboardLayout() {
  const [user, setUser] = useState<{ id: number; nome: string; email: string; tipo: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = authService.getToken();
    const storedUser = localStorage.getItem("vrumvrum_usuario");
    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      if (user.tipo !== "AGENTE") {
        window.location.href = "/";
        return;
      }
    } else {
      window.location.href = "/login?redirect=/dashboard";
      return;
    }
  }, []);

  const cardCls = "bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] shadow-2xl hover:border-primary/40 transition-all duration-300 group";
  const iconBoxCls = "mb-5 w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors";

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-main tracking-tight italic font-racing">
              Olá, <span className="text-primary">{user?.nome.split(" ")[0]}!</span>
            </h1>
            <p className="text-text-main/60 mt-2 text-lg">Aqui está o resumo da sua operação hoje.</p>
          </div>
          <div className="flex gap-4">
            <a href="/cadastro-veiculo" className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Zap size={18} /> Novo Veículo
            </a>
          </div>
        </div>

        <DashboardTabs currentPath={location.pathname} />

        <Outlet />
      </div>
    </main>
  );
}
