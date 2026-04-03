import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

type Tab = 'login' | 'register';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab]           = useState<Tab>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy]         = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, register, authError, clearError } = useAuthStore();

  const reset = () => { setName(''); setEmail(''); setPassword(''); setLocalError(''); clearError(); };

  const switchTab = (t: Tab) => { setTab(t); reset(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (tab === 'register' && name.trim().length < 2) {
      setLocalError('Nome deve ter pelo menos 2 caracteres.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setBusy(true);
    try {
      if (tab === 'login') await login(email, password);
      else                 await register(email, password, name.trim());
      onClose();
    } catch {
      setLocalError(authError ?? 'Erro inesperado. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  const displayError = localError || authError;

  // Friendly Portuguese error messages
  const friendlyError = (msg: string) => {
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
      return 'Email ou senha incorretos.';
    if (msg.includes('email-already-in-use'))
      return 'Este email já está cadastrado. Tente fazer login.';
    if (msg.includes('invalid-email'))
      return 'Email inválido.';
    if (msg.includes('weak-password'))
      return 'Senha fraca. Use pelo menos 6 caracteres.';
    if (msg.includes('network-request-failed'))
      return 'Sem conexão com a internet. Tente novamente.';
    return msg;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-sm shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="text-sm font-black text-white">RoboKids Academy</h2>
              <p className="text-[10px] text-slate-400">Salve seu progresso na nuvem!</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl transition-colors">×</button>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-4 mt-4 bg-slate-800 rounded-xl p-1 gap-1">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-colors ${
                tab === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'login' ? '🔑 Entrar' : '✨ Criar Conta'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <AnimatePresence mode="wait">
            {tab === 'register' && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Nome do Inventor(a)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Maria Robótica"
                  required
                  className="mt-1 w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="mt-1 w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="mt-1 w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {displayError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2"
            >
              ⚠️ {friendlyError(displayError)}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20"
          >
            {busy ? '⏳ Aguarde...' : tab === 'login' ? '🚀 Entrar' : '✨ Criar Conta'}
          </button>

          <p className="text-center text-[10px] text-slate-500">
            {tab === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
            <button
              type="button"
              onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              {tab === 'login' ? 'Criar Conta' : 'Entrar'}
            </button>
          </p>

          {tab === 'login' && (
            <p className="text-center text-[10px] text-slate-600">
              🎮 Sem conta? Continue como convidado — seu progresso fica salvo localmente.
            </p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
