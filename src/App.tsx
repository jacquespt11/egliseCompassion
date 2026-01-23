// src/App.tsx
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import AppRouter from './AppRouter';
import './styles/globals.css';


// Composant de transition
import { motion } from 'framer-motion';

function TransitionScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen flex-col items-center justify-center text-center space-y-16 max-w-7xl mx-auto px-4 relative overflow-hidden"
    >
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0F172A] to-[#0F172A]"
        />
      </div>

      {/* Conteneur principal avec délai en cascade */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.3,
              delayChildren: 0.2
            }
          }
        }}
        className="relative z-10 flex flex-col items-center w-full"
      >
        {/* Logo avec effet de lueur */}
        <motion.div
          variants={{
            hidden: { scale: 0.8, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 50 } }
          }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -inset-20 bg-blue-500/20 blur-3xl rounded-full"
          />
          <img
            src="https://egliselacompassion.org/wp-content/uploads/2025/01/LA-COMPASSION-1024x254-1-2.png"
            alt="logo église la compassion"
            className="relative w-[800px] max-w-full drop-shadow-2xl"
          />
        </motion.div>

        {/* Titres et Textes avec typographie améliorée */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="space-y-6">
          <h1 className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 leading-tight tracking-tight drop-shadow-lg">
            MyCompassion Space
          </h1>

          <p className="text-2xl md:text-3xl text-blue-100/80 font-light tracking-[0.2em] uppercase">
            La Compassion • Centre Évangélique
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          className="h-px w-64 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-12"
        />

        {/* Indicateur de chargement sophistiqué */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [-10, 0, -10],
                  backgroundColor: ["#60A5FA", "#3B82F6", "#60A5FA"],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-4 h-4 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            ))}
          </div>

          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg text-blue-200/70 font-medium tracking-widest uppercase text-xs"
          >
            Chargement des modules
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Footer fixe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 text-blue-300/30 text-xs tracking-widest uppercase"
      >
        © 2025 La Compassion • Système sécurisé v2.0
      </motion.div>
    </motion.div>
  );
}

// Composant principal
function AppContent() {
  const { currentPage, navigate } = useNavigation();

  useEffect(() => {
    // Transition automatique après 5 secondes
    if (currentPage === 'transition') {
      const timer = setTimeout(() => {
        navigate('login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, navigate]);

  if (currentPage === 'transition') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <TransitionScreen />
      </div>
    );
  }

  return <AppRouter />;
}

// Point d'entrée de l'application
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider initialPage="transition">
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'backdrop-blur-xl bg-white/10 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700',
            }}
          />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}