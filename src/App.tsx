import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminProfileEdit } from './components/AdminProfileEdit';
import { Toaster, toast } from 'sonner';

// Types étendus pour gérer les rôles et les états de profil
export type Page = 'transition' | 'login' | 'register' | 'admin_profile_edit' | 'dashboard' | 'planing' | 'room_gallery';

export interface User {
  email: string;
  role: 'ADMIN' | 'RESPONSABLE';
  isProfileComplete: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('transition');
  const [user, setUser] = useState<User | null>(null);

  // Transition initiale de 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = (data: any) => {
    console.log("Données d'inscription reçues:", data);
    // Simulation : création du compte responsable
    const newUser: User = {
      email: data.email,
      role: 'RESPONSABLE',
      isProfileComplete: true,
      firstName: data.firstName,
      lastName: data.lastName
    };
    setUser(newUser);
    toast.success("Compte créé avec succès !");
    setCurrentPage('planing');
  };

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
      setCurrentPage('admin_profile_edit');
    } else {
      // Simulation pour un responsable
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

  const handleAdminProfileComplete = (profileData: any) => {
    // Mettre à jour les informations de l'admin
    const updatedUser: User = {
      ...user!,
      ...profileData,
      isProfileComplete: true
    };
    setUser(updatedUser);
    toast.success("Profil complété avec succès !");
    setCurrentPage('dashboard');
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

              {currentPage === 'admin_profile_edit' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <AdminProfileEdit 
                    onComplete={handleAdminProfileComplete}
                    userEmail={user?.email || ''}
                  />
                </div>
              )}

              {currentPage === 'dashboard' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <AdminDashboard 
                    user={user} 
                    onNavigateToRooms={() => setCurrentPage('room_gallery')}
                  />
                </div>
              )}

              {currentPage === 'planing' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <PlaningDashboard 
                    user={user} 
                    onNavigateToRooms={() => setCurrentPage('room_gallery')}
                  />
                </div>
              )}

              {currentPage === 'room_gallery' && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <RoomGalleryPage />
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

// Composant Dashboard pour l'Admin
function AdminDashboard({ user, onNavigateToRooms }: { user: User | null, onNavigateToRooms?: () => void }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Tableau de bord Administrateur
            </h1>
            <p className="mt-2 text-white/60">
              Bienvenue, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/50">{user?.email}</p>
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mt-1">
              Administrateur Principal
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Salles</h3>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-sm text-white/60 mt-2">Locaux disponibles</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Départements</h3>
            <p className="text-3xl font-bold text-white">15</p>
            <p className="text-sm text-white/60 mt-2">Départements actifs</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Réservations</h3>
            <p className="text-3xl font-bold text-white">47</p>
            <p className="text-sm text-white/60 mt-2">Cette semaine</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <button 
            onClick={onNavigateToRooms}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Gérer les salles
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant Dashboard pour les Responsables (Planning)
function PlaningDashboard({ user, onNavigateToRooms }: { user: User | null, onNavigateToRooms?: () => void }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Planning des Réservations
            </h1>
            <p className="mt-2 text-white/60">
              Gestion des salles - La Compassion
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/50">{user?.email}</p>
            <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium mt-1">
              Responsable de Département
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Réserver une salle</h3>
            <p className="text-white/60 mb-6">
              Sélectionnez une salle et une plage horaire pour votre événement
            </p>
            <button 
              onClick={onNavigateToRooms}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Voir les salles disponibles
            </button>
          </div>
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Mes réservations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Salle de conférence principale</p>
                  <p className="text-sm text-white/60">Aujourd'hui, 14h-16h</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Confirmée
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium text-white">Salle de réunion B</p>
                  <p className="text-sm text-white/60">Demain, 10h-12h</p>
                </div>
                <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                  En attente
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">Instructions</h3>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Les réservations doivent être faites au minimum 24h à l'avance
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Chaque département peut réserver jusqu'à 2 salles simultanément
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              L'administrateur valide toutes les réservations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Page de galerie des salles
import { useRooms } from './hooks/useRooms';
import { RoomGallery } from './components/rooms/RoomGallery';

function RoomGalleryPage() {
  const { rooms, loading, createRoom } = useRooms();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Chargement des salles...</p>
        </div>
      </div>
    );
  }

  const handleRoomCreate = (roomData: any) => {
    console.log('Créer salle:', roomData);
    createRoom(roomData);
  };

  return (
    <div className="min-h-screen w-full">
      <RoomGallery 
        rooms={rooms} 
        userRole="ADMIN" 
        onRoomCreate={handleRoomCreate}
      />
    </div>
  );
}