import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Login } from './components/Login';
import { Toaster } from 'sonner';

export type Page = 'login' | 'transition';
export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('transition');

  // Pour passer à la page de connexion après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 5000); // 5 secondes de transition

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string, password: string) => {
    console.log("Email:", email, "Password:", password);
    // Ajouter ici la logique de connexion
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentPage === 'transition' ? (
                <div className="h-screen flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto"
                  >
                    {/* Logo avec effet de halo */}
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="absolute -inset-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl rounded-full"
                      />
                      <img
                        src="https://egliselacompassion.org/wp-content/uploads/2025/01/LA-COMPASSION-1024x254-1-2.png"
                        alt="logo église la compassion"
                        className="relative w-[800px] max-w-full rounded-xl shadow-2xl"
                      />
                    </div>
                    
                    {/* Contenu textuel */}
                    <div className="space-y-8">
                      {/* Titre principal */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="space-y-4"
                      >
                        <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 leading-tight">
                          Système de réservation
                        </h1>
                        
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="text-2xl md:text-3xl text-white/80 font-light tracking-wider"
                        >
                          La Compassion • Centre Évangélique
                        </motion.p>
                      </motion.div>
                      
                      {/* Ligne décorative */}
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 1.2, delay: 1.1 }}
                        className="h-1.5 w-80 md:w-96 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"
                      />
                    </div>
                    
                    {/* Indicateur de chargement */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.4 }}
                      className="pt-8"
                    >
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse delay-150" />
                          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse delay-300" />
                        </div>
                        <span className="text-lg font-medium text-white/60">
                          Initialisation en cours...
                        </span>
                      </div>
                    </motion.div>
                    
                    {/* Note discrète */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 2 }}
                      className="text-sm text-white/40 font-light pt-12"
                    >
                      Version 2.0 • © 2025 La Compassion
                    </motion.p>
                  </motion.div>
                </div>
              ) : (
                <div className="p-6">
                  <Login onLogin={handleLogin} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}