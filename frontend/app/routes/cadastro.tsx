import { useState } from "react";
import type { Route } from "./+types/cadastro";
import { User, Building2, TriangleAlert, Home } from "lucide-react";
import { authService } from "~/services/auth.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro - VrumVrum" },
    { name: "description", content: "Cadastre-se no VrumVrum como cliente ou agente" },
  ];
}

interface ClienteFormData {
  nome: string;
  email: string;
  senha: string;
  rg: string;
  cpf: string;
  profissao: string;
}

interface AgenteFormData {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
  tipoAgente: "EMPRESA" | "BANCO";
}

type TabType = "cliente" | "agente";

const formatCPF = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 14);

const formatRG = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .slice(0, 12);

const formatCNPJ = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})/, "$1-$2")
    .slice(0, 18);

const inputCls =
  "w-full px-3 py-2 border border-slate-600 bg-bg-card/50 text-text-main placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50";

const labelCls = "block text-sm font-medium text-gray-200 mb-1";

export default function Cadastro() {
  const [activeTab, setActiveTab] = useState<TabType>("cliente");

  const [clienteData, setClienteData] = useState<ClienteFormData>({
    nome: "",
    email: "",
    senha: "",
    rg: "",
    cpf: "",
    profissao: "",
  });

  const [agenteData, setAgenteData] = useState<AgenteFormData>({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    tipoAgente: "EMPRESA",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cpf") formatted = formatCPF(value);
    else if (name === "rg") formatted = formatRG(value);
    setClienteData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleAgenteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cnpj") formatted = formatCNPJ(value);
    setAgenteData((prev) => ({ ...prev, [name]: formatted }));
  };

  const validateCliente = (): boolean => {
    if (!clienteData.nome) { setErrorMessage("O campo Nome é obrigatório."); return false; }
    if (!clienteData.email) { setErrorMessage("O campo Email é obrigatório."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteData.email)) {
      setErrorMessage("Email inválido. Use o formato: usuario@dominio.com"); return false;
    }
    if (!clienteData.cpf) { setErrorMessage("O campo CPF é obrigatório."); return false; }
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(clienteData.cpf)) {
      setErrorMessage("CPF inválido. Use o formato: 000.000.000-00"); return false;
    }
    if (!clienteData.rg) { setErrorMessage("O campo RG é obrigatório."); return false; }
    if (clienteData.rg.replace(/\D/g, "").length < 7) {
      setErrorMessage("RG inválido. Use o formato: 00.000.000-0"); return false;
    }
    if (!clienteData.profissao) { setErrorMessage("O campo Profissão é obrigatório."); return false; }
    if (!clienteData.senha) { setErrorMessage("O campo Senha é obrigatório."); return false; }
    if (clienteData.senha.length < 6) {
      setErrorMessage("Senha muito curta. Use no mínimo 6 caracteres."); return false;
    }
    return true;
  };

  const validateAgente = (): boolean => {
    if (!agenteData.nome) { setErrorMessage("O campo Nome é obrigatório."); return false; }
    if (!agenteData.email) { setErrorMessage("O campo Email é obrigatório."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agenteData.email)) {
      setErrorMessage("Email inválido. Use o formato: usuario@dominio.com"); return false;
    }
    if (!agenteData.cnpj) { setErrorMessage("O campo CNPJ é obrigatório."); return false; }
    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(agenteData.cnpj)) {
      setErrorMessage("CNPJ inválido. Use o formato: 00.000.000/0000-00"); return false;
    }
    if (!agenteData.senha) { setErrorMessage("O campo Senha é obrigatório."); return false; }
    if (agenteData.senha.length < 6) {
      setErrorMessage("Senha muito curta. Use no mínimo 6 caracteres."); return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (activeTab === "cliente" && !validateCliente()) return;
    if (activeTab === "agente" && !validateAgente()) return;

    setLoading(true);

    try {
      const isCliente = activeTab === "cliente";
      let payload;

      if (isCliente) {
        payload = await authService.cadastrarCliente(clienteData);
      } else {
        payload = await authService.cadastrarAgente(agenteData);
      }

      const tipo = isCliente ? "Cliente" : "Agente";
      setSuccessMessage(`${tipo} cadastrado com sucesso! Logando...`);
      localStorage.setItem("vrumvrum_usuario", JSON.stringify({ 
        id: payload.id, 
        nome: payload.nome, 
        email: payload.email,
        tipo: isCliente ? "CLIENTE" : "AGENTE"
      }));
      
      if (isCliente) {
        setClienteData({ nome: "", email: "", senha: "", rg: "", cpf: "", profissao: "" });
      } else {
        setAgenteData({ nome: "", email: "", senha: "", cnpj: "", tipoAgente: "EMPRESA" });
      }
      
      setTimeout(() => { window.location.href = "/"; }, 1500);

    } catch (error) {
      setErrorMessage(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-75px)] py-12">
      <div className="w-full max-w-md bg-bg-card ring-1 ring-slate-700/50 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-text-main mb-6 text-center">
          Cadastro
        </h1>

        <div className="flex rounded-lg overflow-hidden border border-slate-700 mb-6">
          <button
            id="tab-cliente"
            type="button"
            onClick={() => switchTab("cliente")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors duration-200 ${
              activeTab === "cliente"
                ? "bg-primary text-black"
                : "bg-bg-card text-text-main/80 hover:bg-bg-card/80"
            }`}
          >
            <User size={15} /> Cliente
          </button>
          <button
            id="tab-agente"
            type="button"
            onClick={() => switchTab("agente")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold transition-colors duration-200 border-l border-slate-700 ${
              activeTab === "agente"
                ? "bg-primary text-black"
                : "bg-bg-card text-text-main/80 hover:bg-bg-card/80"
            }`}
          >
            <Building2 size={15} /> Agente
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className={labelCls}>Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={activeTab === "cliente" ? clienteData.nome : agenteData.nome}
              onChange={activeTab === "cliente" ? handleClienteChange : handleAgenteChange}
              className={inputCls}
              placeholder={activeTab === "cliente" ? "Digite seu nome completo" : "Nome da empresa ou banco"}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelCls}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={activeTab === "cliente" ? clienteData.email : agenteData.email}
              onChange={activeTab === "cliente" ? handleClienteChange : handleAgenteChange}
              className={inputCls}
              placeholder="seu.email@exemplo.com"
            />
          </div>

          {activeTab === "cliente" && (
            <>
              <div>
                <label htmlFor="cpf" className={labelCls}>CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={clienteData.cpf}
                  onChange={handleClienteChange}
                  maxLength={14}
                  className={inputCls}
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label htmlFor="rg" className={labelCls}>RG</label>
                <input
                  type="text"
                  id="rg"
                  name="rg"
                  value={clienteData.rg}
                  onChange={handleClienteChange}
                  maxLength={12}
                  className={inputCls}
                  placeholder="00.000.000-0"
                />
              </div>

              <div>
                <label htmlFor="profissao" className={labelCls}>Profissão</label>
                <input
                  type="text"
                  id="profissao"
                  name="profissao"
                  value={clienteData.profissao}
                  onChange={handleClienteChange}
                  className={inputCls}
                  placeholder="Sua profissão"
                />
              </div>
            </>
          )}

          {activeTab === "agente" && (
            <>
              <div>
                <label htmlFor="cnpj" className={labelCls}>CNPJ</label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  value={agenteData.cnpj}
                  onChange={handleAgenteChange}
                  maxLength={18}
                  className={inputCls}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label htmlFor="tipoAgente" className={labelCls}>Tipo de Agente</label>
                <select
                  id="tipoAgente"
                  name="tipoAgente"
                  value={agenteData.tipoAgente}
                  onChange={handleAgenteChange}
                  className={inputCls}
                >
                  <option value="EMPRESA">🏢 Empresa</option>
                  <option value="BANCO">🏦 Banco</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="senha" className={labelCls}>Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={activeTab === "cliente" ? clienteData.senha : agenteData.senha}
              onChange={activeTab === "cliente" ? handleClienteChange : handleAgenteChange}
              className={inputCls}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <TriangleAlert size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-black font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-text-main/80">
          <p>
            Já tem cadastro?{" "}
            <a href="/login" className="text-primary font-semibold hover:underline">
              Faça login
            </a>
          </p>
          <p className="mt-2 text-center flex justify-center">
            <a
              href="/"
              className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              <Home size={14} /> Voltar para home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
