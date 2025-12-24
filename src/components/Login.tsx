import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Building2, Calendar, Users, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white">Église la Compassion</h1>
                <p className="text-white/60 text-sm">Système de réservation</p>
              </div>
            </div>
            <h2 className="text-white mb-2">Bienvenue</h2>
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="inline-flex items-center text-white/90">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-[#3B82F6] bg-white/5 gap-2 border-white/10 rounded focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                />
                <span className="ml-2"> Se souvenir de moi</span>
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white py-3 rounded-lg hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all"
            >
              Se connecter
            </motion.button>

            <div className="text-center">
              <button type="button" className="text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex flex-col items-center justify-center"
        >
          <div className="relative">
            {/* Main building illustration */}
            <div className="w-80 h-80 bg-gradient-to-br from-[#1E3A8A]/20 to-[#3B82F6]/20 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-32 h-32 text-[#3B82F6]" />
            </div>

            {/* Floating icons */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-[#10B981]/20 rounded-2xl border border-[#10B981]/30 flex items-center justify-center backdrop-blur-sm"
            >
              <Calendar className="w-10 h-10 text-[#10B981]" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#F59E0B]/20 rounded-2xl border border-[#F59E0B]/30 flex items-center justify-center backdrop-blur-sm"
            >
              <Users className="w-10 h-10 text-[#F59E0B]" />
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-white mb-2">Gestion simplifiée</h3>
            <p className="text-white/60 max-w-md">
              Réservez vos locaux en quelques clics et gérez efficacement les espaces de votre église
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
