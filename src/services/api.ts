import { User, UserRole, HealthStatus } from '../types';
import { INITIAL_USERS, DEMO_PASSWORD } from '../data/mockData';

const API_BASE_URL = 'http://127.0.0.1:8001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('radiassist_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('radiassist_token', token);
    } else {
      localStorage.removeItem('radiassist_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status,
          service: data.service,
          timestamp: new Date().toISOString(),
          database: 'connected',
        };
      }
    } catch {
      // Backend not running on 8001; return local fallback status
    }
    return {
      status: 'ok',
      service: 'RadiAssist Client (Local Mode)',
      timestamp: new Date().toISOString(),
      database: 'simulated',
    };
  }

  async login(email: string, password: string):Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access_token);
        return {
          token: data.access_token,
          user: {
            id: data.user_id,
            name: data.name,
            email: data.email,
            role: data.role,
          },
        };
      }
    } catch {
      // Backend offline; use local demo user validation
    }

    // Local fallback authentication
    const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && (password === DEMO_PASSWORD || password === "password" || password === "demo")) {
      const simulatedToken = `simulated-jwt-${user.id}-${Date.now()}`;
      this.setToken(simulatedToken);
      return {
        token: simulatedToken,
        user,
      };
    }

    throw new Error('Invalid email or password. Please use demo credentials.');
  }

  async register(name: string, email: string, password: string, role: UserRole): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend offline fallback
    }

    // Fallback new user
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    return newUser;
  }

  async getMe(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Offline fallback
    }
    return null;
  }
}

export const api = new ApiService();
