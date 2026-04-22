import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Car, Fuel, Image as ImageIcon, Save, Star, Users } from "lucide-react";
import api from "~/services/api.service";
import { resolverFotoVeiculo } from "~/services/veiculo-foto.service";

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
  lugares: "5",
  potencia: "",
  valorDia: "",
  avaliacao: "5",
  destaque: false,
  itens: "",
  foto: "",
};

export default function EditarVeiculo() {
  const { id } = useParams();

  const [formData, setFormData] = useState<VeiculoFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingVeiculo, setLoadingVeiculo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("vrumvrum_usuario");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const carregarVeiculo = async () => {
      if (!id) {
        setErrorMessage("Veículo inválido.");
        setLoadingVeiculo(false);
        return;
      }

      try {
        const response = await api.get(`/veiculo/${id}`);
        const veiculo = response.data;

        setFormData({
          matricula: veiculo.matricula ?? "",
          marca: veiculo.marca ?? "",
          modelo: veiculo.modelo ?? "",
          placa: veiculo.placa ?? "",
          ano: veiculo.ano ? String(veiculo.ano) : "",
          categoria: veiculo.categoria ?? "",
          combustivel: veiculo.combustivel ?? "",
          lugares: veiculo.lugares ? String(veiculo.lugares) : "5",
          potencia: veiculo.potencia ?? "",
          valorDia: veiculo.valorDia ? String(veiculo.valorDia) : "",
          avaliacao: veiculo.avaliacao ? String(veiculo.avaliacao) : "5",
          destaque: Boolean(veiculo.destaque),
          itens: veiculo.itens ?? "",
          foto: veiculo.foto ?? "",
        });
      } catch {
        setErrorMessage("Não foi possível carregar os dados do veículo.");
      } finally {
        setLoadingVeiculo(false);
      }
    };

    carregarVeiculo();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    if (name === "foto") {
      setFotoArquivo(null);
      setFotoPreview("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setFotoArquivo(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!id || !userId) {
        throw new Error("Dados inválidos para atualização.");
      }

      const payload = {
        ...formData,
        ano: Number(formData.ano),
        lugares: Number(formData.lugares),
        valorDia: Number(formData.valorDia),
        avaliacao: Number(formData.avaliacao),
        foto: uploadType === "url" ? formData.foto : "",
        agenteId: userId,
      };

      const body = new FormData();
      body.append("veiculo", JSON.stringify(payload));
      if (uploadType === "file" && fotoArquivo) {
        body.append("foto", fotoArquivo);
      }

      await api.put(`/veiculo/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Veículo atualizado com sucesso!");
      setTimeout(() => {
        window.location.href = "/dashboard/meus-veiculos";
      }, 1200);
    } catch (error: any) {
      const resp = error.response?.data;
      const msg = typeof resp === "string" ? resp : (resp?.message || "Erro ao atualizar veículo.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const itensSelecionados = formData.itens.split(",").map((i) => i.trim()).filter(Boolean);
  const previewImagem = uploadType === "file"
    ? (fotoPreview || resolverFotoVeiculo(formData.foto) || "")
    : (resolverFotoVeiculo(formData.foto) || formData.foto);

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all shadow-inner placeholder:text-gray-500 text-sm";
  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-text-main/60 mb-2 ml-1";

  if (loadingVeiculo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg-main">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div>
            <a href="/dashboard/meus-veiculos" className="inline-flex items-center gap-2 text-text-main/40 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4">
              <ArrowLeft size={14} /> Voltar
            </a>
            <h1 className="text-5xl font-black text-text-main italic font-racing leading-none">EDITAR <span className="text-primary">VEÍCULO</span></h1>
          </div>

          {successMessage && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 font-bold text-sm">{successMessage}</div>}
          {errorMessage && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold text-sm">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-8 rounded-[2rem] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClasses}>Modelo</label><input name="modelo" value={formData.modelo} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Marca</label><input name="marca" value={formData.marca} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Matrícula</label><input name="matricula" value={formData.matricula} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Placa</label><input name="placa" value={formData.placa} onChange={handleChange} className={inputClasses} maxLength={8} required /></div>
              <div><label className={labelClasses}>Ano</label><input name="ano" type="number" value={formData.ano} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Categoria</label><input name="categoria" value={formData.categoria} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Combustível</label><input name="combustivel" value={formData.combustivel} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Lugares</label><input name="lugares" type="number" value={formData.lugares} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Potência</label><input name="potencia" value={formData.potencia} onChange={handleChange} className={inputClasses} /></div>
              <div><label className={labelClasses}>Valor da Diária</label><input name="valorDia" type="number" step="0.01" value={formData.valorDia} onChange={handleChange} className={inputClasses} required /></div>
              <div><label className={labelClasses}>Avaliação</label><input name="avaliacao" type="number" step="0.1" value={formData.avaliacao} onChange={handleChange} className={inputClasses} /></div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={labelClasses.replace("mb-2", "mb-0")}>Foto do Veículo</label>
                <button
                  type="button"
                  onClick={() => setUploadType((prev) => prev === "url" ? "file" : "url")}
                  className="text-[10px] font-bold text-primary uppercase hover:underline"
                >
                  {uploadType === "url" ? "Upload de Arquivo" : "Usar Link"}
                </button>
              </div>

              {uploadType === "url" ? (
                <input
                  name="foto"
                  value={formData.foto}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="https://..."
                />
              ) : (
                <div className="relative border-2 border-dashed border-slate-700/80 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 transition-all flex items-center justify-center cursor-pointer h-[56px]">
                  <span className="text-xs text-gray-400 font-semibold truncate px-4 flex items-center gap-2">
                    <ImageIcon size={16} className={fotoArquivo ? "text-green-500" : "text-gray-500"} />
                    {fotoArquivo ? "1 imagem selecionada" : "Clique para selecionar"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Itens Extras</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Ar-condicionado", "Alarme", "Bluetooth", "Câmera de Ré",
                  "Dir. Hidráulica", "GPS", "Seguro", "Teto Solar", "Wi-Fi"
                ].map((item) => {
                  const isSelected = itensSelecionados.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const current = itensSelecionados;
                        if (current.includes(item)) {
                          setFormData((prev) => ({ ...prev, itens: current.filter((i) => i !== item).join(",") }));
                        } else {
                          setFormData((prev) => ({ ...prev, itens: [...current, item].join(",") }));
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${isSelected ? "bg-primary text-black border-primary" : "bg-slate-800/50 text-gray-400 border-slate-700"}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input type="checkbox" name="destaque" checked={formData.destaque} onChange={handleChange} />
              <span className="text-sm text-text-main">Veículo em destaque</span>
            </label>

            <button type="submit" disabled={loading} className="bg-primary hover:bg-yellow-500 disabled:opacity-50 text-black text-xs font-black uppercase py-4 px-8 rounded-2xl transition-all tracking-widest inline-flex items-center gap-2">
              <Save size={16} /> {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-12 bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-8 rounded-[2rem]">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-main/30 mb-6 italic">Pré-visualização</p>
            <div className="bg-slate-900/60 rounded-[2rem] border border-slate-800 overflow-hidden max-w-sm mx-auto text-left group">
              <div className="h-56 bg-white/5 relative">
                {previewImagem ? <img src={previewImagem} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-10"><Car size={92} /></div>}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">{formData.matricula || "MATR-000"}</span>
                  {formData.destaque && <span className="bg-primary text-black text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1"><Star size={10} fill="black" /></span>}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-text-main/30 text-[10px] font-black uppercase tracking-widest mb-1">{formData.marca || "MARCA"}</h4>
                    <h3 className="text-2xl font-black text-text-main italic font-racing leading-none">{formData.modelo || "VEÍCULO"}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-2xl italic font-racing leading-none">R$ {formData.valorDia || "0.00"}</p>
                    <p className="text-[9px] text-text-main/30 uppercase font-black tracking-widest mt-1">dia</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-text-main/60 bg-white/5 p-2 rounded-xl border border-white/5"><Fuel size={14} className="text-primary/40" /> <span className="text-[10px] font-black uppercase">{formData.combustivel || "—"}</span></div>
                  <div className="flex items-center gap-2 text-text-main/60 bg-white/5 p-2 rounded-xl border border-white/5"><Users size={14} className="text-primary/40" /> <span className="text-[10px] font-black uppercase">{formData.lugares} Lugares</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
