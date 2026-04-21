import { ClipboardList } from "lucide-react";

export default function DashboardPedidos() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardList className="text-primary" size={20} /> Lista de Pedidos
        </h3>
        <p className="text-text-main/40 text-sm">Gerencie todas as solicitações de aluguel recebidas.</p>
      </div>

      <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-12 rounded-[2rem] shadow-2xl text-center">
        <p className="text-text-main/40 text-xl font-bold italic">Nenhum pedido encontrado no momento.</p>
      </div>
    </div>
  );
}
