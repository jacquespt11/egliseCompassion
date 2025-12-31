import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { useRooms } from './hooks/useRooms';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PlaningPage } from './pages/PlaningPage';
import { RoomGalleryPage } from './pages/RoomGalleryPage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';

// Composants d'authentification
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminProfileEdit } from './components/AdminProfileEdit';

// Autres composants
import { ReservationForm } from './components/reservations/ReservationForm';
import { ReservationList } from './components/reservations/ReservationList';

// Types
import type { User } from './types/user';
import type { Page } from './types/common';

export default function App() {
  const { rooms } = useRooms();
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
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      role: 'RESPONSABLE',
      profileCompleted: true, // CORRIGÉ: isProfileComplete -> profileCompleted
      firstName: data.firstName,
      lastName: data.lastName,
      departmentId: data.departmentId
    };
    setUser(newUser);
    toast.success("Compte créé avec succès !");
    setCurrentPage('planing');
  };

  const handleLogin = (email: string, password: string) => {
    console.log("Tentative de connexion:", email);

    if (email === "admin@compassion.org" && password === "admin") {
      const adminUser: User = { 
        id: 'admin_001',
        email, 
        role: 'ADMIN', 
        profileCompleted: false, // CORRIGÉ: isProfileComplete -> profileCompleted
        firstName: 'Admin',
        lastName: 'System'
      };
      setUser(adminUser);
      toast.success("Connexion Admin réussie");
      setCurrentPage('admin_profile_edit');
    } else {
      const respUser: User = { 
        id: Math.random().toString(36).substr(2, 9),
        email, 
        role: 'RESPONSABLE', 
        profileCompleted: true,
        departmentId: '5',
        firstName: 'Responsable',
        lastName: 'Département'
      };
      setUser(respUser);
      toast.success("Bienvenue Responsable de département");
      setCurrentPage('planing');
    }
  };

  const handleAdminProfileComplete = (profileData: any) => {
    const updatedUser: User = {
      ...user!,
      ...profileData,
      profileCompleted: true //  profileCompleted
    };
    setUser(updatedUser);
    toast.success("Profil complété avec succès !");
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    toast.info("Vous avez été déconnecté");
  };

  // Render le contenu basé sur la page actuelle
  const renderContent = () => {
    switch (currentPage) {
      case 'transition':
        return <TransitionScreen />;

      case 'login':
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <Login 
              onLogin={handleLogin} 
              onNavigateToRegister={() => setCurrentPage('register')} 
            />
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <Register 
              onRegister={handleRegister} 
              onBackToLogin={() => setCurrentPage('login')} 
            />
          </div>
        );

      case 'admin_profile_edit':
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <AdminProfileEdit 
              onComplete={handleAdminProfileComplete}
              userEmail={user?.email || ''}
            />
          </div>
        );

      case 'admin_approvals':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminApprovalPage onNavigate={(page: string) => setCurrentPage(page as Page)} />
              </motion.div>
            </AnimatePresence>
          </DashboardLayout>
        );
      
      case 'dashboard':
      case 'planing':
      case 'room_gallery':
      case 'my_reservations':
      case 'reservation_form':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLogout={handleLogout}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentPage === 'dashboard' && <DashboardPage user={user} />}
                {currentPage === 'planing' && <PlaningPage user={user} onNavigate={setCurrentPage} />}
                {currentPage === 'room_gallery' && <RoomGalleryPage user={user} onNavigate={setCurrentPage} />}
                {currentPage === 'my_reservations' && (
                  <ReservationList
                    userId={user?.id}
                    departmentId={user?.departmentId}
                    userRole={user?.role}
                    onViewDetails={(reservation: any) => {
                      console.log('Voir détails:', reservation);
                    }}
                    onCancelReservation={(reservation: any) => {
                      console.log('Annuler réservation:', reservation);
                    }}
                    onEditReservation={(reservation: any) => {
                      console.log('Modifier réservation:', reservation);
                      setCurrentPage('reservation_form');
                    }}
                  />
                )}
                {currentPage === 'reservation_form' && (
                  <ReservationForm
                    rooms={rooms}
                    currentDepartmentId={user?.departmentId}
                    onSuccess={() => {
                      toast.success('Réservation créée avec succès !');
                      setCurrentPage('my_reservations');
                    }}
                    onCancel={() => setCurrentPage('planing')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </DashboardLayout>
        );

      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <>
      <MainLayout>
        {renderContent()}
      </MainLayout>
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          className: 'backdrop-blur-xl bg-white/5 border border-white/10',
        }}
      />
    </>
  );
}

// Sous-composant pour l'écran de transition (inchangé)
function TransitionScreen() {
  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center text-center space-y-16 max-w-5xl mx-auto"
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