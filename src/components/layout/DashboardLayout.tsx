// src/components/layout/DashboardLayout.tsx - Version simplifiée
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  Menu,
  X,
  ChevronDown,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { useTheme } from '../../hooks/useTheme';
import Sidebar from './Sidebar';
import { ThemeToggle } from '../shared/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { currentPage, navigate } = useNavigation();
  const { theme } = useTheme();

  // Détection automatique desktop/mobile pour la sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonctions utilitaires
  const getUserName = () => {
    if (!user) return 'Utilisateur';
    return user.firstName || user.email.split('@')[0];
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (user.firstName) {
      const names = user.firstName.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Tableau de bord',
      'planing': 'Planning',
      'room_gallery': 'Salles',
      'my_reservations': 'Mes réservations',
      'profile': 'Profil',
      'admin_dashboard': 'Tableau de bord Admin',
      'admin_approvals': 'Approbations en attente',
      'admin_users': 'Gestion des utilisateurs',
      'admin_departments': 'Gestion des départements',
      'admin_audit': 'Journal des activités',
      'admin_settings': 'Paramètres administrateur',
      'reservation_form': 'Nouvelle réservation'
    };
    return titles[currentPage] || currentPage.replace('_', ' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Section gauche */}
          <div className="flex items-center gap-4">
            {/* Bouton menu hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 text-white"
                >
                  C
                </motion.div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                  Compassion Space
                </h1>
                <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                  {user?.role === 'ADMIN' ? 'Administration' : 'Gestion des réservations'}
                </p>
              </div>
            </div>

            {/* Barre de recherche (desktop) */}
            <div className="hidden lg:flex items-center ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600 
                           bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section droite */}
          <div className="flex items-center gap-4">
            {/* Bouton de thème dans le header (desktop) */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="sr-only">Notifications</span>
            </button>

            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm">
                  {getInitials()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === 'ADMIN' ? 'Administrateur' : 
                     user?.role === 'RESPONSABLE' ? 'department_leader' : 'Utilisateur'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu déroulant utilisateur */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-white">{getUserName()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>Mon profil</span>
                    </button>
                    <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar factorisée */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={navigate}
        user={user}
        onLogout={logout}
        isMobile={window.innerWidth < 1024}
      />

      {/* Contenu principal */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen && window.innerWidth >= 1024 ? 'lg:ml-72' : ''}`}>
        <div className="p-4 md:p-6 lg:p-8">
          {/* Titre de page pour mobile */}
          <div className="lg:hidden mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {getPageTitle()}
            </h2>
          </div>

          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Bouton flottant pour mobile */}
      {window.innerWidth < 1024 && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden z-40 p-4 rounded-full 
                   bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                   shadow-lg hover:shadow-xl transition-all duration-300
                   hover:scale-110 active:scale-95"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;