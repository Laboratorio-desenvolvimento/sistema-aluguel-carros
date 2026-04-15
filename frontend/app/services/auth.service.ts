export const API_URL = 'http://localhost:8080';

export interface LoginRequest {
  email: string;
  senha?: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  token: string;
  mensagem: string;
}

export const authService = {
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
        let errorMsg = 'Erro na autenticação.';
        try { errorMsg = await response.text() } catch(e) {}
        throw new Error(errorMsg);
    }
    
    const data: AuthResponse = await response.json();
    this.saveToken(data.token);
    return data;
  },

  async cadastrarCliente(cliente: any): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/cadastrar/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });

    if (!response.ok) {
        let errorMsg = 'Erro ao cadastrar cliente.';
        try { errorMsg = await response.text() } catch(e) {}
        throw new Error(errorMsg);
    }

    const data: AuthResponse = await response.json();
    this.saveToken(data.token);
    return data;
  },

  async cadastrarAgente(agente: any): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/cadastrar/agente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agente),
    });

    if (!response.ok) {
        let errorMsg = 'Erro ao cadastrar agente.';
        try { errorMsg = await response.text() } catch(e) {}
        throw new Error(errorMsg);
    }

    const data: AuthResponse = await response.json();
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
    }
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
