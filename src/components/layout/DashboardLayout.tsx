import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Building2, 
  BookOpen, 
  User,
  Bell,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import type { User as UserType, Page } from '../../types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserType | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'planing' as Page, label: 'Planning', icon: Calendar, color: 'text-emerald-400' },
  { id: 'room_gallery' as Page, label: 'Salles', icon: Building2, color: 'text-purple-400' },
  { id: 'my_reservations' as Page, label: 'Mes réservations', icon: BookOpen, color: 'text-amber-400' },
  { id: 'profile' as Page, label: 'Profil', icon: User, color: 'text-rose-400' },
];

const adminMenuItems = [
  { id: 'notifications' as Page, label: 'Notifications', icon: Bell, color: 'text-cyan-400' },
  { id: 'settings' as Page, label: 'Paramètres', icon: Settings, color: 'text-gray-400' },
];

export function DashboardLayout({ 
  children, 
  user, 
  currentPage, 
  onNavigate, 
  onLogout 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white">
      {/* Sidebar pour desktop */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col w-64 bg-white/5 backdrop-blur-xl border-r border-white/10"
      >
        {/* Header sidebar */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">La Compassion</h2>
              <p className="text-xs text-white/50">Réservation de salles</p>
            </div>
          </div>
        </div>

        {/* Menu principal */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider px-3 py-2">
              Navigation
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  currentPage === item.id 
                    ? 'bg-white/10 text-white' 
                    : 'hover:bg-white/5 text-white/70 hover:text-white'
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
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider px-3 py-2">
                Administration
              </p>
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    currentPage === item.id 
                      ? 'bg-white/10 text-white' 
                      : 'hover:bg-white/5 text-white/70 hover:text-white'
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
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/50">
                {user?.role === 'ADMIN' ? 'Administrateur' : 'Responsable'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all mt-2"
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
            className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] border-r border-white/10 shadow-2xl"
          >
            {/* Contenu similaire à la sidebar desktop */}
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
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/50">
                {user?.role === 'ADMIN' ? 'Admin' : 'Responsable'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Contenu de la page */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}