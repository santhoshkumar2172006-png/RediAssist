import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, HealthStatus } from '../types';
import { api } from '../services/api';
import { INITIAL_USERS, DEMO_PASSWORD } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  health: HealthStatus | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchDemoRole: (targetRole: UserRole) => void;
  refreshHealth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Dr. Sarah Chen (Radiologist) so the user immediately sees the rich workstation on first load
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('radiassist_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0];
  });

  const [health, setHealth] = useState<HealthStatus | null>(null);

  const refreshHealth = async () => {
    try {
      const status = await api.checkHealth();
      setHealth(status);
    } catch {
      setHealth({
        status: 'ok',
        service: 'RadiAssist Local',
        timestamp: new Date().toISOString(),
        database: 'simulated',
      });
    }
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    localStorage.setItem('radiassist_user', JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    const newUser = await api.register(name, email, password, role);
    setUser(newUser);
    localStorage.setItem('radiassist_user', JSON.stringify(newUser));
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('radiassist_user');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const target = INITIAL_USERS.find(u => u.role === targetRole) || {
      id: 99,
      name: `Demo ${targetRole}`,
      email: `${targetRole.toLowerCase()}@demo.com`,
      role: targetRole,
    };
    setUser(target);
    localStorage.setItem('radiassist_user', JSON.stringify(target));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        health,
        login,
        register,
        logout,
        switchDemoRole,
        refreshHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
