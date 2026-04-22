import { useEffect, useState } from "react";
import { 
  Car, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  TrendingUp,
  Fuel,
  Users,
  Gauge,
  Star,
  Zap
} from "lucide-react";
import api from "~/services/api.service";

interface Veiculo {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  categoria: string;
  combustivel: string;
  lugares: number;
  potencia: string;
  valorDia: number;
  avaliacao: number;
  destaque?: boolean;
  itens: string | null;
  foto: string | null;
}

export default function DashboardVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [veiculoToDelete, setVeiculoToDelete] = useState<Veiculo | null>(null);

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        const storedUser = localStorage.getItem("vrumvrum_usuario");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const response = await api.get(`/veiculo/agente/${user.id}`);
          setVeiculos(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVeiculos();
  }, []);

  const handleDelete = async () => {
    if (!veiculoToDelete) return;
    try {
      await api.delete(`/veiculo/${veiculoToDelete.matricula}`);
      setVeiculos(veiculos.filter(v => v.id !== veiculoToDelete.id));
      setDeleteModalOpen(false);
    } catch (error) {
      alert("Erro ao excluir veículo.");
    }
  };

  const filteredVeiculos = veiculos.filter(v => 
    v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-75px)] py-10 px-4">
      {/* Harmonized Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Frota", val: veiculos.length, icon: Car, color: "text-primary" },
          { label: "Destaques", val: veiculos.filter(v => v.destaque).length, icon: Star, color: "text-green-500" },
          { label: "Avaliação", val: veiculos.length > 0 ? (veiculos.reduce((acc, v) => acc + (v.avaliacao || 0), 0) / veiculos.length).toFixed(1) : "0.0", icon: TrendingUp, color: "text-yellow-500" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-bg-card/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex items-center gap-6 shadow-xl">
            <div className={`w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold">{stat.label}</p>
              <h3 className="text-3xl font-bold text-text-main mt-1">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Harmonized Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-10 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-full py-3 pl-12 pr-6 text-sm text-text-main focus:outline-none focus:border-primary/50 placeholder:text-gray-500"
          />
        </div>
        <a href="/cadastro-veiculo" className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <Zap size={18} /> Novo Veículo
        </a>
      </div>

      {/* Grid */}
      {filteredVeiculos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="text-2xl font-bold text-text-main mb-2">Sem Resultados</h3>
          <p className="text-gray-400 text-center text-sm">Não encontramos veículos registrados que correspondam à sua busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVeiculos.map((v) => (
            <div 
              key={v.id} 
              className="bg-bg-card/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden hover:border-yellow-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="h-44 bg-bg-card flex items-center justify-center relative overflow-hidden">
                {v.foto ? (
                  <img 
                    src={v.foto.startsWith("data:") ? v.foto : `data:image/jpeg;base64,${v.foto}`} 
                    alt={v.modelo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-main/10">
                    <Car size={80} />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-sm text-text-main text-xs font-bold px-2 py-1 rounded-md">
                    {v.matricula}
                  </span>
                  {v.destaque && (
                    <span className="bg-primary text-black text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <Star size={12} fill="black" /> Destaque
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 duration-300">
                  <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"><Edit2 size={18} /></button>
                  <button 
                    onClick={() => { setVeiculoToDelete(v); setDeleteModalOpen(true); }}
                    className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-gray-400 text-xs font-semibold mb-1">{v.marca}</h4>
                    <h3 className="text-lg font-bold text-text-main leading-tight">{v.modelo}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-xl">R$ {v.valorDia.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">/dia</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center justify-center gap-2 text-text-main/80 bg-bg-card/50 backdrop-blur-sm border border-slate-700/50 p-2 rounded-lg">
                    <Fuel size={14} className="text-primary" />
                    <span className="text-xs font-semibold">{v.combustivel || "—"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-text-main/80 bg-bg-card/50 backdrop-blur-sm border border-slate-700/50 p-2 rounded-lg">
                    <Users size={14} className="text-primary" />
                    <span className="text-xs font-semibold">{v.lugares} Lugares</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-xs text-green-500 font-semibold">Ativo</p>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">{v.placa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Harmonized Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-slate-700 p-6 rounded-2xl max-w-md w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Excluir Veículo?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Você está prestes a remover permanentemente este veículo da sua frota. Essa ação é irreversível.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-text-main font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
