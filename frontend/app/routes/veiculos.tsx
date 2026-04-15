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
  const [modalAberto, setModalAberto] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

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

  const handleReservar = (veiculo: Veiculo) => {
    if (!autenticado) {
      window.location.href = "/login?redirect=/veiculos";
      return;
    }

    setVeiculoSelecionado(veiculo);
    setModalAberto(true);
    setDataInicial("");
    setDataFinal("");
  };

  const handleConfirmarReserva = async () => {
    if (!dataInicial || !dataFinal) {
      alert("Por favor, preencha as datas!");
      return;
    }

    if (new Date(dataInicial) >= new Date(dataFinal)) {
      alert("A data final deve ser posterior à data inicial!");
      return;
    }

    try {
      const usuarioJSON = localStorage.getItem("vrumvrum_usuario");
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

      if (!usuario) {
        alert("Por favor, faça login para realizar a reserva.");
        window.location.href = "/login?redirect=/veiculos";
        return;
      }

      const reserva = {
        cliente: {
          id: usuario.id,
        },
        veiculo: {
          id: veiculoSelecionado?.id,
        },
        dataInicioDesejada: new Date(dataInicial).toISOString(),
        dataFimDesejada: new Date(dataFinal).toISOString(),
        dataSolicitacao: new Date().toISOString(),
        status: "INTRODUCED",
      };

      console.log("Enviando reserva:", reserva);

      const resposta = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reserva),
      });

      if (resposta.ok) {
        const pedidoCriado = await resposta.json();
        alert("Reserva criada com sucesso!");
        console.log("Pedido criado:", pedidoCriado);
        setModalAberto(false);
      } else if (resposta.status === 409) {
        alert("Veículo não está disponível para as datas selecionadas!");
      } else {
        const errorText = await resposta.text();
        console.error("Erro do servidor:", errorText);
        alert(`Erro ao criar reserva: ${resposta.status} - ${errorText}`);
      }
    } catch (erro) {
      console.error("Erro ao enviar reserva:", erro);
      alert("Erro de conexão. Verifique sua conexão com o servidor.");
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setVeiculoSelecionado(null);
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
      {/* Modal de Reserva */}
      {modalAberto && veiculoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-black">Reservar Veículo</h2>
              <p className="text-black/80 text-sm mt-1">
                {veiculoSelecionado.marca} {veiculoSelecionado.modelo}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Informações do Veículo */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Valor da diária:</span>
                  <span className="text-xl font-bold text-yellow-400">
                    R$ {(veiculoSelecionado?.valorDia || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Categoria:</span>
                  <span className="text-white">{veiculoSelecionado?.categoria || "N/A"}</span>
                </div>
              </div>

              {/* Data Inicial */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* Data Final */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  min={dataInicial || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* Cálculo de Dias */}
              {dataInicial && dataFinal && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Número de dias:</span>
                    <span className="text-lg font-bold text-yellow-400">
                      {Math.ceil(
                        (new Date(dataFinal).getTime() -
                          new Date(dataInicial).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      dias
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-yellow-500/30">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-2xl font-black text-yellow-400">
                      R${" "}
                      {(
                        (veiculoSelecionado?.valorDia || 0) *
                        Math.ceil(
                          (new Date(dataFinal).getTime() -
                            new Date(dataInicial).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800/50 p-6 rounded-b-2xl border-t border-slate-700 flex gap-3">
              <button
                onClick={handleFecharModal}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReserva}
                className="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Confirmar <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

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
                      onClick={() => handleReservar(v)}
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
