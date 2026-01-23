// src/components/layout/Sidebar.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  BookOpen,
  User,
  Settings,
  LogOut,
  Shield,
  Users as UsersIcon,
  FileText,
  ChevronRight,
  Home,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../shared/ThemeToggle';

// Types
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  onLogout: () => void;
  isMobile?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  adminOnly?: boolean;
}

// Animations
const sidebarVariants = {
  open: { x: 0, opacity: 1 },
  closed: { x: -300, opacity: 0 }
};

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 }
};

const navItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

// Items de navigation
const userMenuItems: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-500' },
  { id: 'planing', label: 'Planning', icon: Calendar, color: 'text-emerald-500' },
  { id: 'room_gallery', label: 'Salles', icon: Building2, color: 'text-purple-500' },
  { id: 'my_reservations', label: 'Mes réservations', icon: BookOpen, color: 'text-amber-500' },
  { id: 'profile', label: 'Profil', icon: User, color: 'text-rose-500' },
];

const adminMenuItems: NavItem[] = [
  { id: 'admin_dashboard', label: 'Tableau de bord Admin', icon: LayoutDashboard, color: 'text-blue-500', adminOnly: true },
  { id: 'admin_approvals', label: 'Approbations', icon: Shield, color: 'text-amber-500', adminOnly: true },
  { id: 'admin_users', label: 'Utilisateurs', icon: UsersIcon, color: 'text-emerald-500', adminOnly: true },
  { id: 'admin_departments', label: 'Départements', icon: Building2, color: 'text-purple-500', adminOnly: true },
  { id: 'admin_audit', label: 'Journal', icon: FileText, color: 'text-cyan-500', adminOnly: true },
  { id: 'admin_settings', label: 'Paramètres', icon: Settings, color: 'text-gray-500', adminOnly: true },
];

// Composant réutilisable d'item de navigation
const NavItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  showChevron?: boolean;
}> = ({ item, isActive, onClick, showChevron = false }) => {
  const Icon = item.icon;
  const { theme } = useTheme();

  return (
    <motion.button
      variants={navItemVariants}
      onClick={onClick}
      className={`
        group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg 
        transition-all duration-200 ease-in-out relative overflow-hidden
        ${isActive
          ? 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 ' +
          'text-blue-600 dark:text-blue-300 font-semibold ring-1 ring-blue-500/20'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 ' +
          'hover:text-gray-900 dark:hover:text-white'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Effet de fond actif */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="flex items-center gap-3 flex-1">
        <div className={`
          p-2 rounded-lg transition-all duration-200
          ${isActive
            ? 'bg-blue-500/20 dark:bg-blue-500/30'
            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
          }
        `}>
          <Icon className={`w-5 h-5 ${item.color}`} />
        </div>
        <span className="text-left">{item.label}</span>
      </div>

      {showChevron && (
        <ChevronRight className={`
          w-4 h-4 transition-transform duration-200
          ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}
          ${isActive ? 'rotate-90' : ''}
        `} />
      )}

      {/* Effet de hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-gray-800/10"
        initial={{ x: '-100%' }}
        whileHover={{ x: '0%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  user,
  onLogout,
  isMobile = false,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Fermer la sidebar en cliquant à l'extérieur (mobile seulement)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onClose]);

  // Empêcher le défilement du body quand la sidebar est ouverte (mobile)
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.role === 'ADMIN';

  // Obtenir les initiales pour l'avatar
  const getInitials = () => {
    if (!user) return 'U';
    if (user.fullName) {
      const names = user.fullName.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <>
      {/* Overlay pour mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar principale */}
      <AnimatePresence mode="wait">
        {(isOpen || !isMobile) && (
          <motion.aside
            ref={sidebarRef}
            key="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`
              fixed lg:sticky top-0 left-0 h-screen w-72 z-40 flex flex-col
              bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
              shadow-xl lg:shadow-sm
              ${isMobile ? '' : 'lg:translate-x-0'}
            `}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {/* En-tête de la sidebar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Compassion Space
                  </h1>
                  <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">
                    {isAdmin ? 'Administration' : 'Gestion des salles'}
                  </p>
                </div>
              </div>

              {/* Info utilisateur */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {user?.fullName || user?.email?.split('@')[0] || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-2 px-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {userMenuItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <NavItem
                          item={item}
                          isActive={currentPage === item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            if (isMobile) onClose();
                          }}
                          showChevron={currentPage === item.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Section admin */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                      Administration
                    </h3>
                    <div className="space-y-1">
                      {adminMenuItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <NavItem
                            item={item}
                            isActive={currentPage === item.id}
                            onClick={() => {
                              onNavigate(item.id);
                              if (isMobile) onClose();
                            }}
                            showChevron={currentPage === item.id}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </nav>
            </div>

            {/* Pied de sidebar */}
            {/* Pied de sidebar */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
              {/* Bouton de thème dans la sidebar */}
              <div className="mb-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thème {theme === 'dark' ? 'sombre' : 'clair'}
                  </span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Bouton déconnexion - Toujours visible dans la sidebar */}
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
                         bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                         text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </motion.button>

              {/* Version texte simple pour mobile */}
              {isMobile && (
                <button
                  onClick={onClose}
                  className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Fermer le menu
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;