import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Toaster, toast } from 'sonner';

// Types étendus pour gérer les rôles, (Admin et Responsable de département) et les états de profil
export type Page = 'transition' | 'login' | 'register' | 'admin_profile' | 'planing';

export interface User {
  email: string;
  role: 'ADMIN' | 'RESPONSABLE';
  isProfileComplete: boolean;
}

export default function App() {
  const handleRegister = (data: any) => {
    console.log("Données d'inscription reçues:", data);
    // Ici, nous appellerons l'API pour créer le compte et la liaison Membership
    toast.success("Compte créé avec succès ! Veuillez vous connecter.");
    setCurrentPage('login');
  };
  
  const [currentPage, setCurrentPage] = useState<Page>('transition');
  const [user, setUser] = useState<User | null>(null);

  // Transition initiale de 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Logique de simulation basée sur les règles métier
    console.log("Tentative de connexion:", email);

    if (email === "admin@compassion.org" && password === "admin") {
      const adminUser: User = { 
        email, 
        role: 'ADMIN', 
        isProfileComplete: false // L'admin doit compléter son profil
      };
      setUser(adminUser);
      toast.success("Connexion Admin réussie");
      setCurrentPage('admin_profile');
    } else {
      // Simulation pour un responsable (à lier à l'API plus tard)
      const respUser: User = { 
        email, 
        role: 'RESPONSABLE', 
        isProfileComplete: true 
      };
      setUser(respUser);
      toast.success("Bienvenue Responsable de département");
      setCurrentPage('planing');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentPage === 'transition' && (
                <div className="min-h-screen flex items-center justify-center p-8">
                  <TransitionScreen />
                </div>
              )}
              
              {currentPage === 'login' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <Login 
                    onLogin={handleLogin} 
                    onNavigateToRegister={() => setCurrentPage('register')} 
                  />
                </div>
              )}

              {currentPage === 'register' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <Register 
                    onRegister={handleRegister} 
                    onBackToLogin={() => setCurrentPage('login')} 
                  />
                </div>
              )}

              // Modifiez les pages admin_profile :

              {currentPage === 'admin_profile' && user && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <div className="p-12 text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Bienvenue, {user.email}
                    </h1>
                    <p className="mt-4 text-xl text-white/60">
                      Rôle: {user.role} • {user.isProfileComplete ? 'Profil complet' : 'Veuillez compléter votre profil'}
                    </p>
                  </div>
                </div>
              )}

              {currentPage === 'planing' && user && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <div className="p-12 text-center max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Planning des réservations
                    </h1>
                    <p className="mt-4 text-xl text-white/60">
                      Bienvenue {user.email} • Gérez et visualisez toutes vos réservations
                    </p>
                  </div>
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

// Sous-composant pour l'écran de transition avec animations améliorées
function TransitionScreen() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center text-center space-y-16 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo avec effet de halo */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -inset-12 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full animate-pulse" />
        <img
          src="https://egliselacompassion.org/wp-content/uploads/2025/01/LA-COMPASSION-1024x254-1-2.png"
          alt="logo église la compassion"
          className="relative w-[900px] max-w-full rounded-xl shadow-2xl"
        />
      </motion.div>

      {/* Contenu textuel avec animations */}
      <div className="space-y-10">
        {/* Titre principal avec effet moderne */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 leading-tight tracking-tight">
            Système de réservation
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-3xl md:text-4xl text-white/80 font-light tracking-wider"
          >
            La Compassion • Centre Évangélique
          </motion.p>
        </motion.div>

        {/* Ligne décorative animée */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-2 w-96 mx-auto bg-gradient-to-r from-transparent via-blue-400/80 to-transparent rounded-full shadow-lg"
        />
      </div>

      {/* Indicateur de chargement stylisé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="pt-12"
      >
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Points animés en cascade */}
          <div className="flex items-center justify-center space-x-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg"
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Texte de chargement */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-xl font-medium text-white/70 tracking-wider"
          >
            Initialisation du système...
          </motion.span>
        </div>
      </motion.div>

      {/* Note discrète en bas */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="text-sm text-white/40 font-light pt-16"
      >
        Version Professionnelle 2.0 • © 2025 La Compassion
      </motion.p>
    </motion.div>
  );
}