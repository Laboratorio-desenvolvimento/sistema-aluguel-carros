import { useState } from "react";
import type { Route } from "./+types/login";
import Navbar from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Acesse sua conta no sistema de aluguel de carros" },
  ];
}

interface LoginData {
  email: string;
  senha: string;
}

interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  mensagem: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!loginData.email || !loginData.senha) {
      setErrorMessage("Informe email e senha.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      setErrorMessage("Email inválido.");
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Falha ao autenticar.");
      }

      const payload = (await response.json()) as LoginResponse;
      setSuccessMessage(`${payload.mensagem} Bem-vindo(a), ${payload.nome}.`);
      setLoginData({ email: "", senha: "" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mx-auto max-w-md bg-white dark:bg-slate-900 dark:ring-1 dark:ring-slate-700 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Login
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu.email@exemplo.com"
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
              value={loginData.senha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Ainda não tem conta? <a href="/cadastro-cliente" className="text-blue-600 dark:text-blue-400 hover:underline">Cadastre-se</a>
          </p>
          <p className="mt-2">
            <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Voltar para home</a>
          </p>
        </div>
      </div>
  );
}
