import { useState } from 'react';
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
  Shield,
  Users as UsersIcon,
  FileText
} from 'lucide-react';
import type { Page } from '../../types/common';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    firstName?: string;
    lastName?: string;
    role: 'ADMIN' | 'RESPONSABLE' | 'USER';
    email: string;
  } | null;
  currentPage: string;
  onNavigate: (page: Page) => void;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Récupérer le nom complet de l'utilisateur
  const getUserName = () => {
    if (!user) return 'Utilisateur';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email.split('@')[0];
  };

  // Récupérer le rôle affiché
  const getUserRole = () => {
    if (!user) return 'Invité';
    switch (user.role) {
      case 'ADMIN': return 'Administrateur';
      case 'RESPONSABLE': return 'Responsable';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {/* Sidebar pour desktop */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm"
      >
        {/* Header sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">La Compassion</h2>
              <p className="text-xs text-gray-500">Réservation de salles</p>
            </div>
          </div>
        </div>

        {/* Menu principal */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
              Navigation
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Menu admin */}
          {user?.role === 'ADMIN' && (
            <div className="mt-8 space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                Administration
              </p>
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as Page)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    currentPage === item.id 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">
                {getUserName()}
              </p>
              <p className="text-xs text-gray-500">
                {getUserRole()}
              </p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-2xl"
          >
            {/* Header sidebar mobile */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">La Compassion</h2>
                  <p className="text-xs text-gray-500">Réservation de salles</p>
                </div>
              </div>
            </div>

            {/* Menu mobile */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                  Navigation
                </p>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id as Page);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      currentPage === item.id 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Menu admin mobile */}
              {user?.role === 'ADMIN' && (
                <div className="mt-8 space-y-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                    Administration
                  </p>
                  {adminMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as Page);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        currentPage === item.id 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>

            {/* Footer sidebar mobile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getUserRole()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  onLogout();
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header mobile */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {getUserName()}
              </p>
              <p className="text-xs text-gray-500">
                {getUserRole()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;