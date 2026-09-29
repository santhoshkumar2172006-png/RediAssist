import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/DesignSystem';
import { DEMO_PASSWORD } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('radiologist@demo.com');
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('RADIOLOGIST');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter full name');
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    login(demoEmail, DEMO_PASSWORD).catch((err) => {
      setError(err?.message || 'Quick login failed');
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172033] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Radiology Medical Mark */}
        <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-[#172033] text-white mb-3">
          <Activity className="w-5 h-5 text-[#38BDF8]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#172033]">
          RadiAssist Clinical Workstation
        </h1>
        <p className="text-xs text-[#667085] mt-0.5">
          AI-powered radiology workflow copilot · Institutional PACS Access
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E4E7EC] rounded-lg p-6 space-y-4">
          {/* Quick Demo Access Bar */}
          <div className="p-3 bg-[#F8FAFC] border border-[#E4E7EC] rounded text-xs space-y-2">
            <span className="font-semibold text-[#172033] text-[11px] uppercase tracking-wider block">
              Direct Clinical Role Access
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('radiologist@demo.com')}
                className="p-1.5 rounded border border-[#D0D5DD] bg-white hover:bg-[#F2F4F7] text-left"
              >
                <div className="font-semibold text-[#172033]">Radiologist</div>
                <div className="text-[10px] text-[#667085]">Dr. S. Chen</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('doctor@demo.com')}
                className="p-1.5 rounded border border-[#D0D5DD] bg-white hover:bg-[#F2F4F7] text-left"
              >
                <div className="font-semibold text-[#172033]">Referring MD</div>
                <div className="text-[10px] text-[#667085]">Dr. M. Brody</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@demo.com')}
                className="p-1.5 rounded border border-[#D0D5DD] bg-white hover:bg-[#F2F4F7] text-left"
              >
                <div className="font-semibold text-[#172033]">PACS Admin</div>
                <div className="text-[10px] text-[#667085]">Console</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {isRegister && (
              <div>
                <label className="block font-medium text-[#344054] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-[#344054] mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033] font-mono focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#344054] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#D0D5DD] rounded text-[#172033] font-mono focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}</span>
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-[#F2F4F7]">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-[#2563EB] hover:underline"
            >
              {isRegister ? 'Already registered? Sign in here' : 'Need a new account? Register'}
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-[#667085]">
          HIPAA & 21 CFR Part 11 Regulated Environment
        </div>
      </div>
    </div>
  );
};
