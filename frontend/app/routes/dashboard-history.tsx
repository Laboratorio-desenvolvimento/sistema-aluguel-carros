import { History } from "lucide-react";

export default function DashboardHistory() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <History className="text-primary" size={20} /> Histórico de Locações
        </h3>
        <p className="text-text-main/40 text-sm">Consulte o registro completo de todas as atividades passadas.</p>
      </div>

      <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-12 rounded-[2rem] shadow-2xl text-center">
        <p className="text-text-main/40 text-xl font-bold italic">O histórico está vazio.</p>
      </div>
    </div>
  );
}
