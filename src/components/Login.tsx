import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, Users, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void; // Ajouté pour la navigation
}

export function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (email && password) {
      onLogin(email, password);
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

  return (
    <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold">Église la Compassion</h1>
              <p className="text-white/60 text-sm">Système de réservation</p>
            </div>
          </div>
          <h2 className="text-2xl text-white mb-2">Bienvenue</h2>
          <p className="text-white/70">Connectez-vous pour gérer vos réservations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/90 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all"
                placeholder="votre.email@eglise.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-3 rounded-lg font-semibold shadow-lg shadow-[#3B82F6]/20 transition-all"
          >
            Se connecter
          </motion.button>

          <div className="text-center space-x-2">
            <button 
              type="button" 
              onClick={onNavigateToRegister}
              className="text-[#3B82F6] hover:text-[#60A5FA] text-sm"
            >
              Créer un compte 
            </button>
            <span className="text-white/20">|</span>
            <button type="button" className="text-white/40 hover:text-white text-sm">
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      </motion.div>

      {/* Illustration à droite */}
      <motion.div className="hidden md:flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-80 h-80 bg-gradient-to-br from-[#1E3A8A]/20 to-[#3B82F6]/20 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
            <Building2 className="w-32 h-32 text-[#3B82F6]" />
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -top-6 -right-6 w-20 h-20 bg-[#10B981]/20 rounded-2xl border border-[#10B981]/30 flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-10 h-10 text-[#10B981]" />
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#F59E0B]/20 rounded-2xl border border-[#F59E0B]/30 flex items-center justify-center backdrop-blur-sm">
            <Users className="w-10 h-10 text-[#F59E0B]" />
          </motion.div>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Gestion simplifiée</h3>
          <p className="text-white/60 max-w-md">Réservez vos locaux en quelques clics pour votre département.</p>
        </div>
      </motion.div>
    </div>
  );
}