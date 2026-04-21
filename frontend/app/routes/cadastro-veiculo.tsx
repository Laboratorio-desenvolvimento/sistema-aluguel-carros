import { useState } from "react";
import type { Route } from "./+types/cadastro-veiculo";
import { CarFront, PlusCircle, ShieldCheck } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard do Agente - VrumVrum" },
    { name: "description", content: "Cadastre veículos para disponibilizar no VrumVrum" },
  ];
}

interface VeiculoFormData {
  matricula: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: string;
  categoria: string;
  combustivel: string;
  lugares: string;
  potencia: string;
  valorDia: string;
  avaliacao: string;
  destaque: boolean;
  itens: string;
  foto: string;
}

const initialFormData: VeiculoFormData = {
  matricula: "",
  marca: "",
  modelo: "",
  placa: "",
  ano: "",
  categoria: "",
  combustivel: "",
  lugares: "",
  potencia: "",
  valorDia: "",
  avaliacao: "",
  destaque: false,
  itens: "",
  foto: "",
};

const inputCls =
  "w-full px-3 py-2 border border-slate-600 bg-bg-card/50 text-text-main placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50";

const labelCls = "block text-sm font-medium text-gray-200 mb-1";

export default function CadastroVeiculo() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<VeiculoFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "placa") {
      setFormData((prev) => ({ ...prev, placa: value.toUpperCase() }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.matricula.trim()) return "A matrícula é obrigatória.";
    if (!formData.marca.trim()) return "A marca é obrigatória.";
    if (!formData.modelo.trim()) return "O modelo é obrigatório.";
    if (!formData.placa.trim()) return "A placa é obrigatória.";
    if (!formData.ano) return "O ano é obrigatório.";
    if (!formData.valorDia) return "O valor da diária é obrigatório.";

    const ano = Number(formData.ano);
    if (Number.isNaN(ano) || ano < 1950) return "Informe um ano válido.";

    const valorDia = Number(formData.valorDia);
    if (Number.isNaN(valorDia) || valorDia <= 0) return "O valor da diária deve ser maior que zero.";

    const lugares = formData.lugares ? Number(formData.lugares) : null;
    if (lugares !== null && (Number.isNaN(lugares) || lugares <= 0)) {
      return "Quantidade de lugares inválida.";
    }

    const avaliacao = formData.avaliacao ? Number(formData.avaliacao) : null;
    if (avaliacao !== null && (Number.isNaN(avaliacao) || avaliacao < 0 || avaliacao > 5)) {
      return "A avaliação deve estar entre 0 e 5.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        matricula: formData.matricula.trim(),
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        placa: formData.placa.trim().toUpperCase(),
        ano: Number(formData.ano),
        categoria: formData.categoria || null,
        combustivel: formData.combustivel || null,
        lugares: formData.lugares ? Number(formData.lugares) : null,
        potencia: formData.potencia.trim() || null,
        valorDia: Number(formData.valorDia),
        avaliacao: formData.avaliacao ? Number(formData.avaliacao) : 0,
        destaque: formData.destaque,
        itens: formData.itens.trim() || null,
        foto: formData.foto.trim() || null,
      };

      const response = await fetch("/api/veiculo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Não foi possível cadastrar o veículo.");
      }

      setSuccessMessage("Veículo cadastrado com sucesso.");
      setFormData(initialFormData);
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado ao cadastrar veículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 min-h-[calc(100vh-75px)] bg-slate-950/90 backdrop-blur-md py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="bg-slate-900 rounded-2xl shadow-md ring-1 ring-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 px-6 py-5">
            <div className="flex items-center gap-3 text-black">
              <CarFront size={24} />
              <div>
                <h1 className="text-2xl font-bold">Dashboard do Agente</h1>
                <p className="text-sm font-medium opacity-90">Cadastre novos veículos para disponibilizar no catálogo.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{errorMessage}</p>
              </div>
            )}

            {!showForm && (
              <div className="rounded-xl border border-dashed border-yellow-500/50 p-6 bg-slate-800/30 mb-5">
                <p className="text-gray-200 mb-4">
                  Comece adicionando um novo veículo para disponibilizar no catálogo da VrumVrum.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setShowForm(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold py-2 px-5 rounded-md transition-colors duration-200"
                >
                  <PlusCircle size={17} />
                  Criar veículo
                </button>
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="matricula" className={labelCls}>Matrícula</label>
                  <input id="matricula" name="matricula" value={formData.matricula} onChange={handleChange} className={inputCls} placeholder="Ex.: VRM-2026-001" />
                </div>

                <div>
                  <label htmlFor="placa" className={labelCls}>Placa</label>
                  <input id="placa" name="placa" value={formData.placa} onChange={handleChange} className={inputCls} placeholder="Ex.: ABC1D23" maxLength={8} />
                </div>

                <div>
                  <label htmlFor="marca" className={labelCls}>Marca</label>
                  <input id="marca" name="marca" value={formData.marca} onChange={handleChange} className={inputCls} placeholder="Ex.: Toyota" />
                </div>

                <div>
                  <label htmlFor="modelo" className={labelCls}>Modelo</label>
                  <input id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} className={inputCls} placeholder="Ex.: Corolla" />
                </div>

                <div>
                  <label htmlFor="ano" className={labelCls}>Ano</label>
                  <input id="ano" name="ano" type="number" value={formData.ano} onChange={handleChange} className={inputCls} min={1950} max={2100} />
                </div>

                <div>
                  <label htmlFor="valorDia" className={labelCls}>Valor da diária (R$)</label>
                  <input id="valorDia" name="valorDia" type="number" value={formData.valorDia} onChange={handleChange} className={inputCls} min={1} step="0.01" />
                </div>

                <div>
                  <label htmlFor="categoria" className={labelCls}>Categoria</label>
                  <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className={inputCls}>
                    <option value="">Selecione</option>
                    <option value="Hatch">Hatch</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Luxo">Luxo</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="combustivel" className={labelCls}>Combustível</label>
                  <select id="combustivel" name="combustivel" value={formData.combustivel} onChange={handleChange} className={inputCls}>
                    <option value="">Selecione</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Etanol">Etanol</option>
                    <option value="Flex">Flex</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Elétrico">Elétrico</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lugares" className={labelCls}>Lugares</label>
                  <input id="lugares" name="lugares" type="number" value={formData.lugares} onChange={handleChange} className={inputCls} min={1} max={12} />
                </div>

                <div>
                  <label htmlFor="potencia" className={labelCls}>Potência</label>
                  <input id="potencia" name="potencia" value={formData.potencia} onChange={handleChange} className={inputCls} placeholder="Ex.: 150cv" />
                </div>

                <div>
                  <label htmlFor="avaliacao" className={labelCls}>Avaliação inicial (0 a 5)</label>
                  <input id="avaliacao" name="avaliacao" type="number" value={formData.avaliacao} onChange={handleChange} className={inputCls} min={0} max={5} step="0.1" />
                </div>

                <div>
                  <label htmlFor="foto" className={labelCls}>URL da foto</label>
                  <input id="foto" name="foto" value={formData.foto} onChange={handleChange} className={inputCls} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label htmlFor="itens" className={labelCls}>Itens especiais</label>
                <textarea
                  id="itens"
                  name="itens"
                  value={formData.itens}
                  onChange={handleChange}
                  className={inputCls}
                  rows={3}
                  placeholder="Ex.: Ar-condicionado, Wi-Fi, Seguro incluso"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <input
                  type="checkbox"
                  name="destaque"
                  checked={formData.destaque}
                  onChange={handleChange}
                  className="w-4 h-4 accent-yellow-500"
                />
                Marcar veículo como destaque
              </label>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-slate-700 pt-5">
                <div className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <ShieldCheck size={16} className="text-yellow-500" />
                  O cadastro é enviado diretamente para o backend da plataforma.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setErrorMessage("");
                    }}
                    className="inline-flex items-center justify-center border border-slate-600 text-gray-200 font-bold py-2 px-5 rounded-md hover:bg-slate-800 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black font-bold py-2 px-5 rounded-md transition-colors duration-200"
                  >
                    <PlusCircle size={17} />
                    {loading ? "Cadastrando..." : "Cadastrar veículo"}
                  </button>
                </div>
              </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
