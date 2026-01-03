// src/components/layout/DashboardLayout.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Building2, 
  BookOpen, 
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Users as UsersIcon,
  FileText,
  Home,
  ChevronRight,
  Activity
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    firstName?: string;
    lastName?: string;
    role: 'ADMIN' | 'RESPONSABLE' | 'USER';
    email: string;
  } | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'planing', label: 'Planning', icon: Calendar, color: 'text-emerald-400' },
  { id: 'room_gallery', label: 'Salles', icon: Building2, color: 'text-purple-400' },
  { id: 'my_reservations', label: 'Mes réservations', icon: BookOpen, color: 'text-amber-400' },
  { id: 'profile', label: 'Profil', icon: User, color: 'text-rose-400' },
];

const adminMenuItems = [
  { id: 'admin_dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'admin_approvals', label: 'Approbations', icon: Shield, color: 'text-amber-400' },
  { id: 'admin_users', label: 'Utilisateurs', icon: UsersIcon, color: 'text-emerald-400' },
  { id: 'admin_departments', label: 'Départements', icon: Building2, color: 'text-purple-400' },
  { id: 'admin_audit', label: 'Journal', icon: FileText, color: 'text-cyan-400' },
  { id: 'admin_settings', label: 'Paramètres', icon: Settings, color: 'text-gray-400' },
];

// Fonction pour formater le titre de la page
const getPageTitle = (pageId: string): string => {
  const titles: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'planing': 'Planning',
    'room_gallery': 'Salles',
    'my_reservations': 'Mes réservations',
    'profile': 'Profil',
    'admin_dashboard': 'Tableau de bord Admin',
    'admin_approvals': 'Approbations',
    'admin_users': 'Utilisateurs',
    'admin_departments': 'Départements',
    'admin_audit': 'Journal',
    'admin_settings': 'Paramètres'
  };
  return titles[pageId] || pageId.replace('_', ' ');
};

export function DashboardLayout({ 
  children, 
  user, 
  currentPage, 
  onNavigate, 
  onLogout 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUserName = () => {
    if (!user) return 'Utilisateur';
    return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0];
  };

  const getInitials = () => {
    if (!user) return 'U';
    return user.firstName && user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : user.email[0].toUpperCase();
  };

  // Notification state
  const hasUnreadNotifications = true; // À remplacer par votre logique réelle

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* HEADER : FORCÉ PLEINE LARGEUR + COULEUR DISTINCTE */}
      <header style={{ backgroundColor: '#05102D' }} className="fixed top-0 left-0 w-full h-16 text-white z-[100] shadow-xl border-b border-slate-700/50 dark:border-gray-800/50">
        <div className="h-full px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* OPTION 1 : Bouton Hamburger avec animation */}
            <motion.button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/10 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6" />
              {/* Indicateur d'état de la sidebar */}
              {!sidebarOpen && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-white text-lg tracking-tight">La Compassion</h1>
                <p className="text-[10px] text-blue-300/80 uppercase tracking-[0.2em] font-bold">Workspace</p>
              </div>
            </div>

            {/* OPTION 2 : Indicateur de page actuelle */}
            <div className="hidden md:flex items-center gap-3 ml-6 pl-6 border-l border-slate-700/50">
              <div className="h-6 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold text-white">{getPageTitle(currentPage)}</p>
                <p className="text-xs text-blue-300/70">
                  {currentPage.startsWith('admin') ? 'Administration' : 'Gestion des réservations'}
                </p>
              </div>
            </div>
          </div>

          {/* Recherche (Centrée) */}
          <div className="hidden md:flex flex-1 max-w-md mx-10">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher réservations, salles, utilisateurs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-700/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all text-sm text-white placeholder-slate-400 backdrop-blur-sm"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded bg-slate-800 text-slate-300 border border-slate-700 hidden lg:block">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Profil & Notifs */}
          <div className="flex items-center gap-4">
            {/* OPTION 3 : Notifications avec effet pulse */}
            <div className="relative">
              <button className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Bell className="w-5 h-5" />
                {/* Badge de notification avec pulse */}
                {hasUnreadNotifications && (
                  <>
                    <motion.span 
                      className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    />
                    <motion.span 
                      className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold">{getUserName()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                      {user?.role === 'ADMIN' ? 'Administrateur' : 
                       user?.role === 'RESPONSABLE' ? 'Responsable' : 'Utilisateur'}
                    </p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-blue-400/50" />
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-sm border-2 border-slate-700 shadow-lg">
                  {getInitials()}
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay Mobile */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />
            
            <motion.aside
              initial={{ x: -300 }} 
              animate={{ x: 0 }} 
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-4rem)] w-72 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 border-r border-slate-700/50 dark:border-gray-700/50 z-[120] lg:z-40 overflow-y-auto shadow-2xl lg:shadow-xl"
            >
              {/* Header Mobile Sidebar */}
              <div className="lg:hidden p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-bold text-lg">Navigation</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-8 mt-2">
                {/* Menu Principal */}
                <div>
                  <div className="flex items-center justify-between px-4 mb-4">
                    <h3 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">Principal</h3>
                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent rounded-full"></div>
                  </div>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => { 
                          onNavigate(item.id); 
                          if(window.innerWidth < 1024) setSidebarOpen(false); 
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                          currentPage === item.id 
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-300 font-bold border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                            : 'text-slate-300 dark:text-gray-400 hover:bg-white/5 hover:text-white hover:border hover:border-white/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`p-2 rounded-lg ${currentPage === item.id ? 'bg-blue-500/30' : 'bg-slate-800/50 group-hover:bg-blue-500/20'}`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.id === 'planing' && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Nouveau
                          </span>
                        )}
                        {currentPage === item.id && (
                          <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Menu Admin */}
                {user?.role === 'ADMIN' && (
                  <div>
                    <div className="flex items-center justify-between px-4 mb-4">
                      <h3 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em]">Administration</h3>
                      <div className="w-6 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full"></div>
                    </div>
                    <div className="space-y-1">
                      {adminMenuItems.map((item) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          onClick={() => { 
                            onNavigate(item.id); 
                            if(window.innerWidth < 1024) setSidebarOpen(false); 
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                            currentPage === item.id 
                              ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-300 font-bold border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                              : 'text-slate-300 dark:text-gray-400 hover:bg-white/5 hover:text-white hover:border hover:border-white/5'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`p-2 rounded-lg ${currentPage === item.id ? 'bg-purple-500/30' : 'bg-slate-800/50 group-hover:bg-purple-500/20'}`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.id === 'admin_approvals' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              3
                            </span>
                          )}
                          {currentPage === item.id && (
                            <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              {/* Pied de sidebar */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900/80 to-transparent border-t border-slate-700/50">
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Réservations aujourd'hui</p>
                      <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-400/50" />
                  </div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-300 hover:text-white hover:from-red-500/30 hover:to-red-600/20 transition-all border border-red-500/30 hover:border-red-500/50 font-bold group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CONTENU : SE DÉCALE SI SIDEBAR OUVERT */}
      <main 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
        }`}
      >
        <div className="p-4 md:p-10 max-w-[1400px] mx-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/30 border border-gray-100 dark:border-gray-700/50 p-6 min-h-[80vh]"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;