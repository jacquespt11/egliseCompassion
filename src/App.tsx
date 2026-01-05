// src/App.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PlaningPage } from './pages/PlaningPage';
import { RoomGalleryPage } from './pages/RoomGalleryPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage';
import AdminAuditPage from './pages/AdminAuditPage';

// Composants d'authentification
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminProfileEdit } from './components/AdminProfileEdit';

// Autres composants
import { ReservationForm } from './components/reservations/ReservationForm';
import { ReservationList } from './components/reservations/ReservationList';

// Types
import type { User, UserRole } from './types/user';
import type { PageId } from './types/routes';

// Hooks
import { useRooms } from './hooks/useRooms';
import { ThemeProvider } from './contexts/ThemeContext';

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
          <h1 className="text-[100px] md:text-[120px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 leading-tight tracking-tight">
            MyCompassion Space
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

function AppContent() {
  const { rooms } = useRooms();
  const [currentPage, setCurrentPage] = useState<PageId>('transition');
  const [user, setUser] = useState<User | null>(null);

  // Transition initiale
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('login');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mettre à jour le titre de la page
  useEffect(() => {
    const titles: Record<PageId, string> = {
      'transition': 'Chargement...',
      'login': 'Connexion',
      'register': 'Inscription',
      'admin_profile_edit': 'Compléter le profil',
      'dashboard': 'Tableau de bord',
      'planing': 'Planning',
      'room_gallery': 'Salles',
      'my_reservations': 'Mes réservations',
      'profile': 'Mon Profil',
      'notifications': 'Notifications',
      'settings': 'Paramètres',
      'reservation_form': 'Nouvelle réservation',
      'admin_dashboard': 'Tableau de bord Admin',
      'admin_approvals': 'Approbations en attente',
      'admin_users': 'Gestion des utilisateurs',
      'admin_departments': 'Gestion des départements',
      'admin_audit': 'Journal des activités',
      'admin_settings': 'Paramètres administrateur'
    };

    document.title = titles[currentPage] || 'Système de réservation - La Compassion';
  }, [currentPage]);

  const handleRegister = (data: any) => {
    console.log("Données d'inscription reçues:", data);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      role: 'RESPONSABLE' as UserRole,
      profileCompleted: true,
      firstName: data.firstName,
      lastName: data.lastName,
      departmentId: data.departmentId || '',
      status: 'pending',
      isActive: false,
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    toast.success("Compte créé avec succès ! En attente d'approbation.");
    setCurrentPage('planing');
  };

  const handleLogin = (email: string, password: string) => {
    console.log("Tentative de connexion:", email);

    if (email === "admin@compassion.org" && password === "admin") {
      const adminUser: User = { 
        id: 'admin_001',
        email, 
        role: 'ADMIN' as UserRole, 
        profileCompleted: false,
        firstName: 'Admin',
        lastName: 'System',
        departmentId: '',
        isActive: true,
        status: 'active',
        approvalStatus: 'APPROVED',
        createdAt: '2024-01-01'
      };
      setUser(adminUser);
      toast.success("Connexion Admin réussie");
      setCurrentPage('admin_profile_edit');
    } else {
      // Simulation d'un utilisateur responsable
      const respUser: User = { 
        id: Math.random().toString(36).substr(2, 9),
        email, 
        role: 'RESPONSABLE' as UserRole, 
        profileCompleted: true,
        departmentId: '1',
        firstName: 'Responsable',
        lastName: 'Département',
        isActive: true,
        status: 'active',
        approvalStatus: 'APPROVED',
        createdAt: '2024-01-15'
      };
      setUser(respUser);
      toast.success("Bienvenue Responsable de département");
      setCurrentPage('planing');
    }
  };

  const handleAdminProfileComplete = (profileData: any) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        ...profileData,
        profileCompleted: true
      };
      setUser(updatedUser);
      toast.success("Profil complété avec succès !");
      setCurrentPage('admin_dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    toast.info("Vous avez été déconnecté");
  };

  // Fonction de navigation avec vérification des permissions
  const handleNavigate = (page: PageId) => {
    // Vérifier si c'est une page admin
    const isAdminPage = page.startsWith('admin_');
    
    if (isAdminPage && user?.role !== 'ADMIN') {
      toast.error('Accès non autorisé. Réservé aux administrateurs.');
      return;
    }
    
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'transition':
        return <TransitionScreen />;

      case 'login':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            <Login 
              onLogin={handleLogin} 
              onNavigateToRegister={() => setCurrentPage('register')} 
            />
          </div>
        );

      case 'register':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            <Register 
              onRegister={handleRegister} 
              onBackToLogin={() => setCurrentPage('login')} 
            />
          </div>
        );

      case 'admin_profile_edit':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            <AdminProfileEdit 
              onComplete={handleAdminProfileComplete}
              userEmail={user?.email || ''}
            />
          </div>
        );

      // Pages utilisateur
      case 'dashboard':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <DashboardPage user={user} />
          </DashboardLayout>
        );

      case 'planing':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <PlaningPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'room_gallery':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <RoomGalleryPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'my_reservations':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <ReservationList
              userId={user?.id}
              departmentId={user?.departmentId}
            />
          </DashboardLayout>
        );

      case 'profile':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <div className="max-w-4xl mx-auto p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Mon Profil</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0] || user?.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                        {user?.role === 'ADMIN' ? 'Administrateur' : 
                         user?.role === 'RESPONSABLE' ? 'Responsable de département' : 'Utilisateur'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardLayout>
        );

      case 'settings':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <div className="max-w-4xl mx-auto p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Paramètres</h1>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-400">Paramètres utilisateur à implémenter...</p>
              </div>
            </div>
          </DashboardLayout>
        );

      // Pages admin
      case 'admin_dashboard':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminDashboardPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'admin_approvals':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminApprovalPage onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'admin_users':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminUsersPage onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'admin_departments':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminDepartmentsPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'admin_audit':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminAuditPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'admin_settings':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <AdminSettingsPage user={user} onNavigate={handleNavigate} />
          </DashboardLayout>
        );

      case 'reservation_form':
        return (
          <DashboardLayout
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            <ReservationForm
              rooms={rooms}
              currentDepartmentId={user?.departmentId}
              onSuccess={() => {
                toast.success('Réservation créée avec succès !');
                setCurrentPage('my_reservations');
              }}
              onCancel={() => setCurrentPage('planing')}
            />
          </DashboardLayout>
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
            <div className="text-center text-white p-6">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-300 mb-6">Page non trouvée</p>
              <button
                onClick={() => user?.role === 'ADMIN' ? setCurrentPage('admin_dashboard') : setCurrentPage('dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'backdrop-blur-xl bg-white/10 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700',
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <AppContent />
      </MainLayout>
    </ThemeProvider>
  );
}