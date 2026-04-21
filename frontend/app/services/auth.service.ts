import api from "./api.service";

export interface LoginRequest {
  email: string;
  senha?: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
  tipo: "CLIENTE" | "AGENTE";
  mensagem: string;
}

export const authService = {
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    const data: AuthResponse = response.data;
    this.saveToken(data.token);
    return data;
  },

  async cadastrarCliente(cliente: any): Promise<AuthResponse> {
    const response = await api.post("/auth/cadastrar/cliente", cliente);
    const data: AuthResponse = response.data;
    this.saveToken(data.token);
    return data;
  },

  async cadastrarAgente(agente: any): Promise<AuthResponse> {
    const response = await api.post("/auth/cadastrar/agente", agente);
    const data: AuthResponse = response.data;
    this.saveToken(data.token);
    return data;
  },

  saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('vrumvrum_usuario');
    }
  },

  getAuthHeaders(): any {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
