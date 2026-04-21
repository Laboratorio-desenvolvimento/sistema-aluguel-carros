import { useState, useEffect } from "react";
import type { Route } from "./+types/login";
import Navbar from "~/components/navbar";
import { Home } from "lucide-react";
import { authService, type LoginRequest } from "~/services/auth.service";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login - VrumVrum" },
    { name: "description", content: "Acesse sua conta no VrumVrum" },
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
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) setRedirectTo(redirect);
  }, []);

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
      const payload = await authService.login(loginData);

      localStorage.setItem("vrumvrum_usuario", JSON.stringify({ 
        id: payload.id, 
        nome: payload.nome, 
        email: payload.email,
        tipo: payload.tipo 
      }));
      setSuccessMessage(`Bem-vindo(a), ${payload.nome}! Redirecionando...`);
      setLoginData({ email: "", senha: "" });
      setTimeout(() => { window.location.href = redirectTo; }, 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-75px)]">
      <div className="w-full max-w-md bg-bg-card ring-1 ring-slate-700/50 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-text-main mb-8 text-center">
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
            <label htmlFor="email" className="block text-sm font-medium text-text-main/80 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 bg-bg-card/50 text-text-main placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-text-main/80 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={loginData.senha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-600 bg-bg-card/50 text-text-main placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:bg-yellow-300 text-black font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-text-main/80">
          <p>
            Ainda não tem conta? <a href="/cadastro" className="text-primary font-semibold hover:underline">Cadastre-se</a>
          </p>
          <p className="mt-2 text-center flex justify-center">
            <a href="/" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
              <Home size={14} /> Voltar para home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
