import { useEffect, useState } from "react";
import type { Route } from "./+types/veiculos";
import {
  Car,
  Clock,
  Fuel,
  Users,
  Gauge,
  Star,
  ArrowRight,
  Snowflake,
  Wifi,
  ShieldCheck,
  X,
  XCircle,
  CheckCircle,
  Calendar
} from "lucide-react";
import api from "~/services/api.service";

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
  agente?: {
    id: number;
    nome: string;
  } | null;
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
  const [reservaSucesso, setReservaSucesso] = useState(false);
  const [reservaErro, setReservaErro] = useState<string | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [dataInicialBusca, setDataInicialBusca] = useState("");
  const [dataFinalBusca, setDataFinalBusca] = useState("");

  const fetchVeiculos = (inicio?: string, fim?: string) => {
    setLoading(true);
    const params = inicio && fim ? { inicio, fim } : {};
    api.get("/veiculo", { params })
      .then((res) => {
        setVeiculos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar veículos:", err);
        setVeiculos([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    const usuario = localStorage.getItem("vrumvrum_usuario");
    setAutenticado(!!usuario);
    fetchVeiculos();
  }, []);

  const handleBuscar = () => {
    fetchVeiculos(dataInicialBusca, dataFinalBusca);
  };

  const handleReservar = (veiculo: Veiculo) => {
    if (!autenticado) {
      window.location.href = "/login?redirect=/veiculos";
      return;
    }

    setVeiculoSelecionado(veiculo);
    setModalAberto(true);
    setReservaSucesso(false);
    setReservaErro(null);
    setDataInicial(dataInicialBusca || "");
    setDataFinal(dataFinalBusca || "");
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
        agente: veiculoSelecionado?.agente ? {
          id: veiculoSelecionado.agente.id
        } : null,
        dataInicioDesejada: new Date(dataInicial).toISOString(),
        dataFimDesejada: new Date(dataFinal).toISOString(),
        dataSolicitacao: new Date().toISOString(),
        status: "INTRODUCED",
      };

      console.log("Enviando reserva:", reserva);

      const resposta = await api.post("/pedidos", reserva);

      setReservaSucesso(true);
      console.log("Pedido criado:", resposta.data);
    } catch (erro: any) {
      const mensagemErro = erro.response?.data?.mensagem || "Ocorreu um erro ao processar sua reserva. Verifique os dados e tente novamente.";
      if (erro.response && erro.response.status === 409) {
        setReservaErro("Este veículo não está mais disponível para as datas selecionadas. Por favor, tente outro período ou veículo.");
      } else {
        console.error("Erro ao enviar reserva:", erro);
        setReservaErro(mensagemErro);
      }
    }
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setVeiculoSelecionado(null);
    setReservaSucesso(false);
    setReservaErro(null);
  };


  const categorias = ["Todos", ...Array.from(new Set(veiculos.map((v) => v.categoria).filter(Boolean)))];
  const veiculosFiltrados =
    filtroCategoria === "Todos"
      ? veiculos
      : veiculos.filter((v) => v.categoria === filtroCategoria);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-75px)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-75px)] py-10 px-4">
      {modalAberto && veiculoSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-bg-card rounded-[1.5rem] border border-slate-700/50 shadow-2xl max-w-lg w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-400">
            {reservaSucesso ? (
              <div className="p-12 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-primary" size={48} />
                </div>
                <h2 className="text-3xl font-black text-text-main font-racing italic">Reserva Solicitada!</h2>
                <p className="text-text-main/60 text-sm leading-relaxed">
                  Sua solicitação para o <span className="text-primary font-bold">{veiculoSelecionado.marca} {veiculoSelecionado.modelo}</span> foi enviada com sucesso e está aguardando aprovação de um agente.
                </p>
                <button
                  onClick={handleFecharModal}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-black rounded-xl transition-all cursor-pointer"
                >
                  ENTENDIDO
                </button>
              </div>
            ) : reservaErro ? (
              <div className="p-12 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="text-red-500" size={48} />
                </div>
                <h2 className="text-3xl font-black text-red-500 font-racing italic">Indisponível</h2>
                <p className="text-text-main/60 text-sm leading-relaxed">
                  {reservaErro}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setReservaErro(null)}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-text-main font-black rounded-xl transition-all cursor-pointer"
                  >
                    TENTAR DATAS
                  </button>
                  <button
                    onClick={handleFecharModal}
                    className="flex-1 py-4 border border-slate-700 hover:bg-slate-800 text-text-main font-black rounded-xl transition-all cursor-pointer"
                  >
                    SAIR
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative p-8 border-b border-slate-700/50 bg-slate-800/30">
                  <h2 className="text-2xl font-black text-primary font-racing italic tracking-tight">Confirmar Reserva</h2>
                  <p className="text-text-main/40 font-bold uppercase tracking-widest text-[10px] mt-1">
                    {veiculoSelecionado.marca} {veiculoSelecionado.modelo}
                  </p>
                  <button
                    onClick={handleFecharModal}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-text-main/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Retirada</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                          type="date"
                          value={dataInicial}
                          onChange={(e) => setDataInicial(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Devolução</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                          type="date"
                          value={dataFinal}
                          onChange={(e) => setDataFinal(e.target.value)}
                          min={dataInicial || new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {dataInicial && dataFinal && new Date(dataFinal) > new Date(dataInicial) ? (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-main/40 font-bold uppercase tracking-wider">Período:</span>
                        <span className="text-text-main font-black">
                          {Math.ceil((new Date(dataFinal).getTime() - new Date(dataInicial).getTime()) / (1000 * 60 * 60 * 24))} dias
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-text-main/40 font-bold uppercase tracking-wider">Valor Diária:</span>
                        <span className="text-text-main font-black">R$ {(veiculoSelecionado.valorDia || 0).toFixed(2)}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-700 flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Total Geral</p>
                          <h3 className="text-3xl font-black text-text-main">
                            R$ {((veiculoSelecionado.valorDia || 0) * Math.ceil((new Date(dataFinal).getTime() - new Date(dataInicial).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 text-center">
                      <p className="text-text-main/20 text-xs font-bold uppercase tracking-widest">Aguardando definição de datas</p>
                    </div>
                  )}
                </div>

                <div className="p-8 pt-0 flex gap-4">
                  <button
                    onClick={handleFecharModal}
                    className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-text-main/60 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmarReserva}
                    className="flex-[2] px-6 py-4 bg-primary hover:bg-primary/90 text-black font-black rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                  >
                    CONFIRMAR <ArrowRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-racing text-primary italic mb-2">
            Veículos <span className="text-text-main">disponíveis</span>
          </h1>
          <p className="text-text-main/80">
            Escolha o veículo ideal para a sua próxima viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer ${filtroCategoria === cat
                ? "bg-primary text-black border border-yellow-400"
                : "bg-bg-card/50 backdrop-blur-md text-text-main/80 border border-slate-700 hover:border-yellow-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mb-12 bg-bg-card/30 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Data Retirada</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                <input
                  type="date"
                  value={dataInicialBusca}
                  onChange={(e) => setDataInicialBusca(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-main/40 uppercase tracking-widest ml-1">Data Devolução</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                <input
                  type="date"
                  value={dataFinalBusca}
                  onChange={(e) => setDataFinalBusca(e.target.value)}
                  min={dataInicialBusca || new Date().toISOString().split("T")[0]}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-xs text-text-main focus:outline-none focus:border-primary transition-all cursor-pointer"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleBuscar}
                disabled={!dataInicialBusca || !dataFinalBusca}
                className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black rounded-xl text-xs transition-all cursor-pointer uppercase tracking-widest"
              >
                Buscar Disponíveis
              </button>
            </div>
          </div>
        </div>

        {veiculosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-racing text-text-main italic mb-2">Sem veículos!</h2>
            <p className="text-gray-400 text-center text-lg">Ainda não possuímos veículos cadastrados no momento.<br />Volte a consultar em breve!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {veiculosFiltrados.map((v) => (
              <div
                key={v.id}
                className="bg-bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-800 hover:border-yellow-500/50 flex flex-col group"
              >
                <div className="bg-bg-card h-44 flex items-center justify-center relative overflow-hidden">
                  {v.foto ? (
                    <img src={v.foto.startsWith("data:") ? v.foto : `data:image/jpeg;base64,${v.foto}`} alt={`${v.marca} ${v.modelo}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <Car size={80} className="text-text-main/10" />
                  )}
                  {v.destaque && (
                    <span className="absolute top-3 left-3 bg-primary text-black text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
                      <Star size={11} fill="black" /> Destaque
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-text-main text-sm font-bold">{v.marca}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{v.marca} {v.modelo}</h2>
                    <div className="flex items-center gap-1 text-primary text-sm font-bold">
                      <Star size={14} fill="currentColor" /> {v.avaliacao ? v.avaliacao.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs bg-slate-800/80 text-text-main/80 px-2 py-0.5 rounded-full">{v.categoria || "Geral"}</span>
                    <span className="text-xs text-gray-400">{v.ano}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center bg-bg-card/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Fuel size={16} className="text-primary mb-1" />
                      <span className="text-xs text-text-main/80">{v.combustivel || "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-bg-card/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Users size={16} className="text-primary mb-1" />
                      <span className="text-xs text-text-main/80">{v.lugares || "?"} lugares</span>
                    </div>
                    <div className="flex flex-col items-center bg-bg-card/50 backdrop-blur-sm border border-slate-700/50 rounded-lg py-2">
                      <Gauge size={16} className="text-primary mb-1" />
                      <span className="text-xs text-text-main/80">{v.potencia || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(v.itens ? v.itens.split(",") : []).map((item) => (
                      <span
                        key={item.trim()}
                        className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-yellow-400/30 px-2 py-0.5 rounded-full"
                      >
                        {itemIcon[item.trim()]} {item.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-5 px-1">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-primary">
                      <Users size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-main/40 font-black uppercase tracking-widest leading-none">Agente Responsável</span>
                      <span className="text-xs text-text-main font-bold">{v.agente?.nome || "VrumVrum Oficial"}</span>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-5">
                    <div>
                      {dataInicialBusca && dataFinalBusca && new Date(dataFinalBusca) > new Date(dataInicialBusca) ? (
                        <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-0.5">Total {Math.ceil((new Date(dataFinalBusca).getTime() - new Date(dataInicialBusca).getTime()) / (1000 * 60 * 60 * 24))} dias</span>
                          <span className="text-2xl font-black text-text-main font-racing">
                            R$ {(v.valorDia * Math.ceil((new Date(dataFinalBusca).getTime() - new Date(dataInicialBusca).getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-black text-text-main font-racing">
                            R$ {v.valorDia ? v.valorDia.toFixed(2) : "0.00"}
                          </span>
                          <span className="text-sm text-gray-400">/dia</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleReservar(v)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-black text-sm py-2 px-5 rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      Reservar <ArrowRight size={16} />
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
