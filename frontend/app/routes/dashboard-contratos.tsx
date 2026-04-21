import { FileText } from "lucide-react";

export default function DashboardContratos() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FileText className="text-primary" size={20} /> Contratos Ativos
        </h3>
        <p className="text-text-main/40 text-sm">Visualize e gerencie os contratos digitais de locação.</p>
      </div>

      <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-12 rounded-[2rem] shadow-2xl text-center">
        <p className="text-text-main/40 text-xl font-bold italic">Nenhum contrato ativo disponível.</p>
      </div>
    </div>
  );
}
