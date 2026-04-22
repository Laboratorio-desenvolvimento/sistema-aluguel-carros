import { useState, useEffect } from "react";
import type { Route } from "./+types/cadastro-veiculo";
import { 
  PlusCircle, 
  ShieldCheck, 
  Image as ImageIcon, 
  Settings, 
  DollarSign, 
  Hash, 
  Star,
  ArrowLeft,
  Car,
  Fuel,
  Users
} from "lucide-react";
import api from "~/services/api.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastrar Veículo - VrumVrum" },
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
  lugares: "5",
  potencia: "",
  valorDia: "",
  avaliacao: "5",
  destaque: false,
  itens: "",
  foto: "",
};

export default function CadastroVeiculo() {
  const [formData, setFormData] = useState<VeiculoFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("vrumvrum_usuario");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    try {
      const payload = {
        ...formData,
        ano: Number(formData.ano),
        lugares: Number(formData.lugares),
        valorDia: Number(formData.valorDia),
        avaliacao: Number(formData.avaliacao),
        agente: { id: userId }
      };
      await api.post("/veiculo", payload);
      setSuccessMessage("Veículo cadastrado com sucesso!");
      setTimeout(() => { window.location.href = "/dashboard/meus-veiculos"; }, 1500);
    } catch (error: any) {
      console.error("Erro completo na requisição:", error.response?.data);
      const resp = error.response?.data;
      const msg = typeof resp === 'string' ? resp : (resp?.message || JSON.stringify(resp));
      setErrorMessage(msg || "Erro ao cadastrar veículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    const form = document.getElementById("cadastroForm") as HTMLFormElement;
    if (form) {
      let isValid = true;
      const inputs = form.querySelectorAll("input, select, textarea");
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i] as any;
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
          break; // Stop at first invalid
        }
      }
      if (!isValid) return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const inputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all shadow-inner placeholder:text-gray-500 text-sm";
  const labelClasses = "block text-[10px] font-black uppercase tracking-[0.2em] text-text-main/60 mb-2 ml-1";

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-bg-main">
      <div className="mx-auto max-w-7xl">
        
        {/* Harmonized Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div>
            <a href="/dashboard/meus-veiculos" className="inline-flex items-center gap-2 text-text-main/30 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-6">
              <ArrowLeft size={14} /> Voltar
            </a>
            <h1 className="text-6xl font-black text-text-main italic font-racing tracking-tighter leading-none mb-4">
              NOVO <br /> <span className="text-primary italic">VEÍCULO</span>
            </h1>
            <p className="text-text-main/30 font-medium max-w-md">Integre um novo veículo à sua frota profissional na VrumVrum.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {successMessage && <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-3xl text-green-500 font-bold text-sm tracking-tight">{successMessage}</div>}
            {errorMessage && <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 font-bold text-sm tracking-tight">{errorMessage}</div>}

            <div className="flex gap-3 mb-8">
                {[1, 2, 3].map((step) => (
                   <div key={step} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${currentStep >= step ? "bg-primary shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-slate-800"}`} />
                ))}
            </div>

            <form id="cadastroForm" onSubmit={handleSubmit} className="space-y-8 relative">
              {currentStep === 1 && (
                <div className="bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-10 rounded-[3rem] space-y-8 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 italic"><Hash size={16} /> Registro</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClasses}>Modelo</label><input name="modelo" value={formData.modelo} onChange={handleChange} className={inputClasses} placeholder="Ex: X5 M" required /></div>
                  <div><label className={labelClasses}>Marca</label><input name="marca" value={formData.marca} onChange={handleChange} className={inputClasses} placeholder="Ex: BMW" required /></div>
                  <div><label className={labelClasses}>Matrícula</label><input name="matricula" value={formData.matricula} onChange={handleChange} className={inputClasses} placeholder="VRM-..." required /></div>
                  <div><label className={labelClasses}>Placa</label><input name="placa" value={formData.placa} onChange={handleChange} className={inputClasses} placeholder="ABC-1234" maxLength={8} required /></div>
                </div>
              </div>
              )}

              {currentStep === 2 && (
                <div className="bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-10 rounded-[3rem] space-y-8 animate-in fade-in slide-in-from-right-4 relative">
                  <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 italic"><Settings size={16} /> Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div><label className={labelClasses}>Ano</label><input name="ano" type="number" value={formData.ano} onChange={handleChange} className={inputClasses} required /></div>
                   <div><label className={labelClasses}>Categoria</label>
                    <select name="categoria" value={formData.categoria} onChange={handleChange} className={inputClasses} required>
                      <option value="">Selecione</option>
                      <option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Luxo">Luxo</option><option value="Esportivo">Esportivo</option>
                    </select>
                   </div>
                   <div><label className={labelClasses}>Combustível</label>
                    <select name="combustivel" value={formData.combustivel} onChange={handleChange} className={inputClasses} required>
                      <option value="">Selecione</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Álcool">Álcool</option>
                      <option value="Flex">Flex</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Gás Natural (GNV)">Gás Natural (GNV)</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                   </div>
                   <div><label className={labelClasses}>Lugares</label><input name="lugares" type="number" value={formData.lugares} onChange={handleChange} className={inputClasses} required /></div>
                   <div><label className={labelClasses}>Potência</label><input name="potencia" value={formData.potencia} onChange={handleChange} className={inputClasses} placeholder="500cv" /></div>
                </div>
              </div>
              )}

              {currentStep === 3 && (
                <div className="bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-10 rounded-[3rem] space-y-8 animate-in fade-in slide-in-from-right-4 relative">
                  <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3 italic"><DollarSign size={16} /> Visibilidade</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className={labelClasses}>Valor da Diária (R$)</label><input name="valorDia" type="number" step="0.01" value={formData.valorDia} onChange={handleChange} className={inputClasses} required /></div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className={labelClasses.replace("mb-2", "mb-0")}>Foto do Veículo</label>
                        <button type="button" onClick={() => setUploadType(prev => prev === "url" ? "file" : "url")} className="text-[9px] font-bold text-primary uppercase hover:underline mr-1 transition-all">
                          {uploadType === "url" ? "Upload de Arquivo" : "Usar Link"}
                        </button>
                      </div>
                      {uploadType === "url" ? (
                        <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input name="foto" value={formData.foto.startsWith("data:") ? "" : formData.foto} onChange={handleChange} className={`${inputClasses} pl-11`} placeholder="Ex: https://img.com/..." />
                        </div>
                      ) : (
                        <div className="relative border-2 border-dashed border-slate-700/80 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 hover:border-primary/40 transition-all flex items-center justify-center cursor-pointer h-[52px]">
                          <span className="text-xs text-gray-400 font-semibold truncate px-4 flex items-center gap-2">
                             <ImageIcon size={16} className={formData.foto.startsWith("data:") ? "text-green-500" : "text-gray-500"} /> 
                             {formData.foto.startsWith("data:") ? "1 Imagem Carregada" : "Clique ou arraste a imagem"}
                          </span>
                          <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, foto: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div><label className={labelClasses}>Itens Extras</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "Ar-condicionado", "Alarme", "Bluetooth", "Câmera de Ré", 
                        "Dir. Hidráulica", "GPS", "Seguro", "Teto Solar", "Wi-Fi"
                      ].map((item) => {
                        const isSelected = formData.itens.split(",").map(i=>i.trim()).includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              const current = formData.itens.split(",").filter(Boolean).map(i => i.trim());
                              if (current.includes(item)) {
                                setFormData(prev => ({ ...prev, itens: current.filter(i => i !== item).join(",") }));
                              } else {
                                setFormData(prev => ({ ...prev, itens: [...current, item].join(",") }));
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${isSelected ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-slate-800/50 text-gray-400 border-slate-700 hover:border-slate-500 hover:text-gray-300'}`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="flex items-center gap-4 p-6 bg-slate-800/40 border border-slate-700 rounded-[2rem] cursor-pointer hover:bg-slate-800/60 hover:border-slate-600 shadow-inner transition-all duration-300">
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${formData.destaque ? 'bg-primary border-primary shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-white/10'}`}>
                        {formData.destaque && <Star size={16} fill="black" className="text-black" />}
                    </div>
                    <input type="checkbox" name="destaque" className="hidden" checked={formData.destaque} onChange={handleChange} />
                    <div>
                        <p className="text-sm font-black text-text-main italic font-racing uppercase tracking-tight">Destaque VIP</p>
                        <p className="text-[10px] text-text-main/40 font-bold uppercase tracking-widest leading-none mt-1">Exibição prioritária no catálogo principal.</p>
                    </div>
                  </label>
                </div>
              </div>
              )}

              <div className="flex justify-between items-center gap-4 pt-4">
                {currentStep > 1 ? (
                  <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-4 px-8 rounded-2xl transition-all text-center border border-slate-700">
                    Voltar
                  </button>
                ) : <div className="w-1" />}
                
                {currentStep < 3 ? (
                  <button type="button" onClick={handleNextStep} className="bg-primary hover:bg-yellow-500 text-black text-xs font-black uppercase py-4 px-8 rounded-2xl transition-all tracking-widest text-center shadow-lg shadow-black/20">
                    Avançar Etapa
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="bg-primary hover:bg-yellow-500 disabled:opacity-50 text-black text-xs font-black uppercase py-4 px-8 rounded-2xl transition-all tracking-widest text-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    {loading ? "Processando..." : "Finalizar Cadastro"}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <div className="sticky top-12">
                <div className="bg-bg-card border border-white/10 shadow-2xl shadow-black/40 p-10 rounded-[3rem] text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-main/30 mb-8 italic">Digital Rendering</p>
                    <div className="bg-slate-900/60 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl relative max-w-sm mx-auto text-left group transition-all duration-500 hover:border-primary/30">
                        <div className="h-56 bg-white/5 relative">
                             {formData.foto ? <img src={formData.foto} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" /> : <div className="w-full h-full flex items-center justify-center opacity-5"><Car size={100} /></div>}
                             <div className="absolute top-6 left-6 flex gap-2">
                                <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/10">{formData.matricula || "MATR-000"}</span>
                                {formData.destaque && <span className="bg-primary text-black text-[8px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1"><Star size={10} fill="black" /></span>}
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-text-main/20 text-[8px] font-black uppercase tracking-widest mb-1">{formData.marca || "OFF-BRAND"}</h4>
                                    <h3 className="text-2xl font-black text-text-main italic font-racing leading-none">{formData.modelo || "NOVO VEÍCULO"}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary font-black text-2xl italic font-racing tracking-tighter leading-none">R$ {formData.valorDia || "0.00"}</p>
                                    <p className="text-[8px] text-text-main/20 uppercase font-black tracking-widest mt-1">dia</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="flex items-center gap-3 text-text-main/40 bg-white/5 p-3 rounded-2xl border border-white/5"><Fuel size={14} className="text-primary/40" /> <span className="text-[9px] font-black uppercase">{formData.combustivel || "—"}</span></div>
                                <div className="flex items-center gap-3 text-text-main/40 bg-white/5 p-3 rounded-2xl border border-white/5"><Users size={14} className="text-primary/40" /> <span className="text-[9px] font-black uppercase">{formData.lugares} Lugares</span></div>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5 opacity-40">
                                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Stock On</span>
                                <span className="text-[8px] text-text-main/40 font-black uppercase tracking-widest">{formData.placa || "—"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
