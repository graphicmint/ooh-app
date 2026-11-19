import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Calendar,
} from 'lucide-react';
import { AuthUser } from '../types/auth';
import { authService, getTodayPasscode } from '../services/auth';
import {
  InterspaceLogo,
  SubtleBrandWatermark,
} from './InterspaceBrand';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDark: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isDark }) => {
  const [email, setEmail] = useState('Graphicmint@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const todayPasscode = getTodayPasscode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.validateCredentials(email, password);
      if (result.isValid && result.user) {
        authService.saveSession(result.user, rememberMe);
        setIsLoading(false);
        onLoginSuccess(result.user);
      } else {
        setIsLoading(false);
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 350);
  };

  const handleFillDemo = () => {
    setEmail('Graphicmint@gmail.com');
    setPassword(todayPasscode);
    setError(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-[#000000] text-slate-100">
      <SubtleBrandWatermark />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#AF1763]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0D6EFD]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-[#191C24] backdrop-blur-xl border border-slate-200 dark:border-[#2C2E33] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <InterspaceLogo isDark={isDark} size="lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <span>Enterprise OOH Portal</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#198754]/15 text-[#198754] dark:text-[#20c975] border border-[#198754]/30">
                <ShieldCheck className="w-3 h-3" /> Secure
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to access <strong className="text-[#AF1763] dark:text-[#e84c96]">BlitzDeck</strong> & <strong className="text-[#0DCAF0]">SiteSync</strong>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#AB2E3C]/15 border border-[#AB2E3C]/40 text-xs text-[#AB2E3C] dark:text-[#f8a5ae] flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-[#AB2E3C] dark:text-[#f05668] shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Graphicmint@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#0F1117] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#AF1763]/40 focus:border-[#AF1763] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Security Passkey
              </label>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#0DCAF0]" />
                <span>Daily Dynamic (Date ÷ 2)</span>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter today's dynamic passkey"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-[#2C2E33] bg-slate-50 dark:bg-[#0F1117] text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-[#AF1763]/40 focus:border-[#AF1763] font-mono tracking-wider transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                title={showPassword ? 'Hide passkey' : 'Show passkey'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-[#2C2E33] text-[#AF1763] focus:ring-[#AF1763]"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">Remember session</span>
            </label>

            <span className="text-[11px] text-slate-400">
              Format: <strong className="text-slate-600 dark:text-[#0DCAF0] font-mono">DDMMYYYY ÷ 2</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#AF1763] to-[#d63384] hover:brightness-110 active:scale-[0.99] text-white shadow-lg shadow-[#AF1763]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Helper Box */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#2C2E33]">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#2C2E33] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0D6EFD]" />
                <span>Quick Access Profile</span>
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] font-extrabold text-[#0DCAF0] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Auto-Fill Credentials
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
              <div>
                Email ID: <span className="text-slate-900 dark:text-slate-200 font-semibold">Graphicmint@gmail.com</span>
              </div>
              <div>
                Passkey Formula: <span className="text-[#AF1763] dark:text-[#e84c96] font-bold">Current Date (DDMMYYYY) ÷ 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
