import { useEffect, useState } from "react";
import type { Route } from "./+types/veiculos";
import {
  Car,
  Fuel,
  Users,
  Gauge,
  Star,
  ArrowRight,
  Snowflake,
  Wifi,
  ShieldCheck,
} from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Veículos - VrumVrum" },
    { name: "description", content: "Consulte os veículos disponíveis para aluguel no VrumVrum" },
  ];
}

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


const itemIcon: Record<string, React.ReactNode> = {
  "Ar-condicionado": <Snowflake size={13} />,
  "Wi-Fi": <Wifi size={13} />,
  "Seguro incluso": <ShieldCheck size={13} />,
};

export default function Veiculos() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = localStorage.getItem("vrumvrum_usuario");
    setAutenticado(!!usuario);

    fetch("/api/veiculo")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setVeiculos(data);
        setLoading(false);
      })
      .catch((_) => {
        setVeiculos([]);
        setLoading(false);
      });
  }, []);

  const handleReservar = () => {
    if (!autenticado) {
      window.location.href = "/login?redirect=/veiculos";
      return;
    }

    // Fazer reserva

    alert("Iniciando reserva do veículo!");
  };


  const categorias = ["Todos", ...Array.from(new Set(veiculos.map((v) => v.categoria).filter(Boolean)))];
  const veiculosFiltrados =
    filtroCategoria === "Todos"
      ? veiculos
      : veiculos.filter((v) => v.categoria === filtroCategoria);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-75px)] bg-slate-950/90 backdrop-blur-md">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-75px)] bg-slate-950/90 backdrop-blur-md py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-racing text-yellow-300 italic mb-2">
            Veículos <span className="text-white">disponíveis</span>
          </h1>
          <p className="text-gray-300">
            Escolha o veículo ideal para a sua próxima viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${filtroCategoria === cat
                ? "bg-yellow-400 text-black border border-yellow-400"
                : "bg-slate-900/50 backdrop-blur-md text-gray-300 border border-slate-700 hover:border-yellow-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {veiculosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-racing text-white italic mb-2">Sem veículos!</h2>
            <p className="text-gray-400 text-center text-lg">Ainda não possuímos veículos cadastrados no momento.<br />Volte a consultar em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {veiculosFiltrados.map((v) => (
              <div
                key={v.id}
                className="bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-800 hover:border-yellow-500/50 flex flex-col group"
              >
                <div className="bg-slate-900 h-44 flex items-center justify-center relative overflow-hidden">
                  {v.foto ? (
                    <img src={v.foto.startsWith("data:") ? v.foto : `data:image/jpeg;base64,${v.foto}`} alt={`${v.marca} ${v.modelo}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <Car size={80} className="text-white/10" />
                  )}
                  {v.destaque && (
                    <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                      <Star size={11} fill="black" /> Destaque
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-white text-sm font-bold">{v.marca}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">{v.marca} {v.modelo}</h2>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> {v.avaliacao ? v.avaliacao.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-slate-800/80 text-gray-300 px-2 py-0.5 rounded-full">{v.categoria || "Geral"}</span>
                    <span className="text-xs text-gray-400">{v.ano}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Fuel size={16} className="text-yellow-400 mb-1" />
                      <span className="text-xs text-gray-300">{v.combustivel || "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Users size={16} className="text-yellow-400 mb-1" />
                      <span className="text-xs text-gray-300">{v.lugares || "?"} lugares</span>
                    </div>
                    <div className="flex flex-col items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Gauge size={16} className="text-yellow-400 mb-1" />
                      <span className="text-xs text-gray-300">{v.potencia || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(v.itens ? v.itens.split(",") : []).map((item) => (
                      <span
                        key={item.trim()}
                        className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 px-2 py-0.5 rounded-full"
                      >
                        {itemIcon[item.trim()]} {item.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white font-racing">
                        R$ {v.valorDia ? v.valorDia.toFixed(2) : "0.00"}
                      </span>
                      <span className="text-sm text-gray-400">/dia</span>
                    </div>
                    <button
                      onClick={handleReservar}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-sm py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Reservar <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
