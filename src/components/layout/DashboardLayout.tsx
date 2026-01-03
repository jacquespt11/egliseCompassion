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
  Home
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

export function DashboardLayout({ 
  children, 
  user, 
  currentPage, 
  onNavigate, 
  onLogout 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* HEADER : FORCÉ PLEINE LARGEUR + COULEUR DISTINCTE */}
      <header className="fixed top-0 left-0 w-full h-16 bg-slate-900 dark:bg-black text-white z-[100] shadow-lg border-b border-slate-700 dark:border-gray-800">
        <div className="h-full px-4 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Bouton Hamburger avec flou */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all border border-white/10"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/20">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-white text-lg tracking-tight">La Compassion</h1>
                <p className="text-[10px] text-blue-300 uppercase tracking-[0.2em] font-bold">Workspace</p>
              </div>
            </div>
          </div>

          {/* Recherche (Centrée) */}
          <div className="hidden md:flex flex-1 max-w-md mx-10">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 dark:bg-gray-800 border border-slate-700 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm text-white"
              />
            </div>
          </div>

          {/* Profil & Notifs */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold">{getUserName()}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm border-2 border-slate-700">
                {getInitials()}
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 lg:top-16 h-full lg:h-[calc(100vh-4rem)] w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-[120] lg:z-40 overflow-y-auto shadow-2xl lg:shadow-none"
            >
              {/* Header Mobile Sidebar */}
              <div className="lg:hidden p-6 bg-slate-900 text-white flex items-center justify-between">
                <span className="font-bold">Navigation</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-8">
                <div>
                  <h3 className="px-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Principal</h3>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => { onNavigate(item.id); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          currentPage === item.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {user?.role === 'ADMIN' && (
                  <div>
                    <h3 className="px-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Admin</h3>
                    <div className="space-y-1">
                      {adminMenuItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { onNavigate(item.id); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            currentPage === item.id 
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </nav>

              <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Quitter</span>
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
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[80vh]"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;