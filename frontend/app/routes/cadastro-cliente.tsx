import { useState } from "react";
import type { Route } from "./+types/cadastro-cliente";
import Navbar from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro de Cliente" },
    { name: "description", content: "Formulário de cadastro de novo cliente" },
  ];
}

interface FormData {
  nome: string;
  email: string;
  senha: string;
  rg: string;
  cpf: string;
  profissao: string;
}

export default function CadastroCliente() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    senha: "",
    rg: "",
    cpf: "",
    profissao: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.rg ||
      !formData.cpf ||
      !formData.profissao
    ) {
      setErrorMessage("Todos os campos são obrigatórios");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Email inválido");
      return false;
    }

    if (formData.cpf.replace(/\D/g, "").length !== 11) {
      setErrorMessage("CPF deve conter 11 dígitos");
      return false;
    }

    if (formData.rg.replace(/\D/g, "").length < 7) {
      setErrorMessage("RG inválido");
      return false;
    }

    if (formData.senha.length < 6) {
      setErrorMessage("Senha deve ter no mínimo 6 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Cliente cadastrado com sucesso!");
        setFormData({
          nome: "",
          email: "",
          senha: "",
          rg: "",
          cpf: "",
          profissao: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData || "Erro ao cadastrar cliente");
      }
    } catch (error) {
      setErrorMessage(`Erro de conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="mx-auto max-w-md bg-white dark:bg-slate-900 dark:ring-1 dark:ring-slate-700 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Cadastro de Cliente
        </h1>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label htmlFor="rg" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              RG
            </label>
            <input
              type="text"
              id="rg"
              name="rg"
              value={formData.rg}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua inscrição estadual"
            />
          </div>

          <div>
            <label htmlFor="profissao" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Profissão
            </label>
            <input
              type="text"
              id="profissao"
              name="profissao"
              value={formData.profissao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua profissão"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Já tem cadastro? <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Faça login</a>
          </p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Voltar para home</a>
          </p>
        </div>
      </div>
  );
}
