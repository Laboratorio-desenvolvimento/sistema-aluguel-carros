import { FileText, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "~/services/api.service";

interface Contrato {
  id: number;
  dataInicio: string;
  dataFim: string;
  valorTotal: number;
  veiculo?: { modelo: string; marca: string; placa: string };
  agente?: { id: number };
}

export default function DashboardContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContratos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contratos/agente");
      setContratos(res.data);
    } catch (e) {
      console.error("Erro ao carregar contratos", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const formatDate = (d: string) => {
    if (!d) return "--/--/----";
    return new Date(d).toLocaleDateString("pt-BR");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          <FileText className="text-primary" size={20} /> Contratos Ativos
        </h3>
        <p className="text-text-main/40 text-sm">
          Visualize e gerencie os contratos digitais de locação.
        </p>
      </div>

      <div className="bg-bg-card/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-[2rem] shadow-2xl">
        {loading ? (
          <div className="flex justify-center p-12 text-primary animate-pulse">
            <RefreshCw className="animate-spin" />
          </div>
        ) : contratos.length === 0 ? (
          <p className="text-text-main/40 text-xl font-bold italic text-center p-12">
            Nenhum contrato ativo disponível.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-text-main/40 tracking-widest border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Veículo</th>
                  <th className="py-3 px-4">Período</th>
                  <th className="py-3 px-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 font-bold">#{c.id}</td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-primary">
                        {c.veiculo?.modelo}
                      </p>
                      <p className="text-xs text-text-main/40 uppercase">
                        {c.veiculo?.placa}
                      </p>
                    </td>

                    <td className="py-4 px-4 text-xs font-bold">
                      {formatDate(c.dataInicio)} → {formatDate(c.dataFim)}
                    </td>

                    <td className="py-4 px-4 font-bold text-green-500">
                      R$ {c.valorTotal?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}