// src/pages/AdminSettingPage.tsx
import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Lock, 
  Users, 
  Calendar,
  Mail,
  Shield,
  Palette,
  Sun,
  Moon,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Database,
  Network,
  Globe,
  Zap
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmationModal } from '../components/shared/ConfirmationModal';
import { AdminSettingsPageProps } from '../types/component-props';


interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('general');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailOnNewReservation: true,
      emailOnApprovalNeeded: true,
      pushNotifications: true,
      dailySummary: true,
      weeklyReport: false,
    },
    reservation: {
      maxDaysInAdvance: 30,
      minNoticeHours: 2,
      maxHoursPerBooking: 4,
      allowWeekendBookings: false,
      allowRecurring: true,
      maxRecurringWeeks: 4,
    },
    system: {
      maintenanceMode: false,
      requireAdminApproval: true,
      allowMultipleBookings: false,
      autoCancelUnapproved: 48,
      backupFrequency: 'daily',
      logRetention: 90,
    },
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: '587',
      senderEmail: 'admin@compassion.org',
      senderName: 'Église La Compassion',
      smtpUsername: '',
      smtpPassword: '',
      enableSSL: true,
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChar: true,
      sessionTimeout: 60,
      twoFactorAuth: false,
      maxLoginAttempts: 5,
    }
  });

  const settingSections: SettingSection[] = [
    { id: 'general', title: 'Général', icon: <Settings size={20} />, description: 'Paramètres système', color: 'from-blue-500 to-cyan-500' },
    { id: 'appearance', title: 'Apparence', icon: <Palette size={20} />, description: 'Thème et interface', color: 'from-purple-500 to-pink-500' },
    { id: 'notifications', title: 'Notifications', icon: <Bell size={20} />, description: 'Alertes et emails', color: 'from-amber-500 to-orange-500' },
    { id: 'reservation', title: 'Réservations', icon: <Calendar size={20} />, description: 'Règles de réservation', color: 'from-emerald-500 to-teal-500' },
    { id: 'security', title: 'Sécurité', icon: <Lock size={20} />, description: 'Accès et permissions', color: 'from-red-500 to-rose-500' },
    { id: 'email', title: 'Email', icon: <Mail size={20} />, description: 'Configuration SMTP', color: 'from-indigo-500 to-blue-500' },
    { id: 'users', title: 'Utilisateurs', icon: <Users size={20} />, description: 'Gestion des départements', color: 'from-violet-500 to-purple-500' },
  ];

  const handleSettingChange = (category: keyof typeof settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    // Implémentation de sauvegarde des paramètres
    console.log('Settings saved:', settings);
    // API call ici
  };

  const handleResetSettings = () => {
    // Réinitialiser les paramètres
    setSettings({
      notifications: {
        emailOnNewReservation: true,
        emailOnApprovalNeeded: true,
        pushNotifications: true,
        dailySummary: true,
        weeklyReport: false,
      },
      reservation: {
        maxDaysInAdvance: 30,
        minNoticeHours: 2,
        maxHoursPerBooking: 4,
        allowWeekendBookings: false,
        allowRecurring: true,
        maxRecurringWeeks: 4,
      },
      system: {
        maintenanceMode: false,
        requireAdminApproval: true,
        allowMultipleBookings: false,
        autoCancelUnapproved: 48,
        backupFrequency: 'daily',
        logRetention: 90,
      },
      email: {
        smtpServer: 'smtp.gmail.com',
        smtpPort: '587',
        senderEmail: 'admin@compassion.org',
        senderName: 'Église La Compassion',
        smtpUsername: '',
        smtpPassword: '',
        enableSSL: true,
      },
      security: {
        passwordMinLength: 8,
        requireSpecialChar: true,
        sessionTimeout: 60,
        twoFactorAuth: false,
        maxLoginAttempts: 5,
      }
    });
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/20 dark:shadow-purple-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Paramètres Administrateur
              </h1>
              <p className="text-purple-100 text-lg">
                Gérez les paramètres système, les notifications et les règles de réservation
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Connecté en tant que</p>
                <p className="font-semibold text-white">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/30">
                  <Database className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Mode</p>
                  <p className="font-semibold text-white text-lg">Production</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/30">
                  <Network className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Serveur</p>
                  <p className="font-semibold text-white text-lg">En ligne</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/30">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Performance</p>
                  <p className="font-semibold text-white text-lg">Optimale</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/30">
                  <Globe className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Version</p>
                  <p className="font-semibold text-white text-lg">v2.1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 p-2">Sections des paramètres</h3>
              <div className="space-y-3">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left transition-all duration-300 ${
                      activeSection === section.id
                        ? 'transform -translate-y-1'
                        : 'hover:transform hover:-translate-y-0.5'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl border-2 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} border-transparent shadow-lg`
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          activeSection === section.id
                            ? 'bg-white/20'
                            : 'bg-gray-100 dark:bg-gray-600'
                        }`}>
                          <div className={
                            activeSection === section.id
                              ? 'text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }>
                            {section.icon}
                          </div>
                        </div>
                        <div>
                          <div className={`font-bold ${
                            activeSection === section.id
                              ? 'text-white'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {section.title}
                          </div>
                          <div className={`text-sm ${
                            activeSection === section.id
                              ? 'text-white/90'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {section.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="text-amber-600 dark:text-amber-400" size={20} />
                  <h3 className="font-bold text-amber-800 dark:text-amber-300">Zone Administrateur</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  Seul l'administrateur principal peut modifier ces paramètres. Toutes les modifications affectent l'ensemble du système.
                </p>
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  Dernière modification : Aujourd'hui à 14:30
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              {/* Section Apparence */}
              {activeSection === 'appearance' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Apparence</h2>
                      <p className="text-gray-600 dark:text-gray-400">Personnalisez l'interface utilisateur</p>
                    </div>
                    <Palette className="w-8 h-8 text-purple-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sélecteur de thème */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                      <label className="block font-bold text-lg text-gray-900 dark:text-white mb-6">
                        Thème de l'application
                      </label>
                      <div className="space-y-4">
                        <button
                          onClick={() => theme !== 'light' && toggleTheme()}
                          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                            theme === 'light'
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
                              <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">Mode Clair</div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Interface lumineuse et énergique</p>
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => theme !== 'dark' && toggleTheme()}
                          className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                            theme === 'dark'
                              ? 'border-blue-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-lg'
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                              <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">Mode Sombre</div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Interface élégante et reposante</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Autres préférences d'apparence */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                      <label className="block font-bold text-lg text-gray-900 dark:text-white mb-6">
                        Préférences d'affichage
                      </label>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">Animations</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Effets de transition et micro-interactions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">Densité d'affichage</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Espacement des éléments de l'interface</p>
                          </div>
                          <select className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800">
                            <option>Confortable</option>
                            <option>Compact</option>
                            <option>Dense</option>
                          </select>
                        </div>
                        
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Les changements d'apparence prennent effet immédiatement pour tous les utilisateurs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Générale */}
              {activeSection === 'general' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres Généraux</h2>
                      <p className="text-gray-600 dark:text-gray-400">Configuration du système principal</p>
                    </div>
                    <Settings className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contenu de la section générale */}
                    {/* ... (remplir avec les champs de paramètres généraux) */}
                  </div>
                </div>
              )}

              {/* Section Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres de Notifications</h2>
                      <p className="text-gray-600 dark:text-gray-400">Configurez les alertes et notifications</p>
                    </div>
                    <Bell className="w-8 h-8 text-amber-500" />
                  </div>
                  {/* Contenu existant des notifications */}
                  {/* ... */}
                </div>
              )}

              {/* Section Réservations */}
              {activeSection === 'reservation' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Règles de Réservation</h2>
                      <p className="text-gray-600 dark:text-gray-400">Définissez les règles de réservation des salles</p>
                    </div>
                    <Calendar className="w-8 h-8 text-emerald-500" />
                  </div>
                  {/* Contenu existant des réservations */}
                  {/* ... */}
                </div>
              )}

              {/* Section Sécurité */}
              {activeSection === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres de Sécurité</h2>
                      <p className="text-gray-600 dark:text-gray-400">Protégez l'accès au système</p>
                    </div>
                    <Lock className="w-8 h-8 text-red-500" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Exemple de champ de sécurité */}
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                      <label className="block font-bold text-lg text-gray-900 dark:text-white mb-6">
                        Mot de passe SMTP
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={settings.email.smtpPassword}
                          onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl pl-4 pr-12 py-3 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800"
                          placeholder="Entrez le mot de passe SMTP"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Mot de passe utilisé pour l'envoi d'emails automatiques
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-amber-500/30 flex items-center gap-3 justify-center"
                >
                  <RotateCcw className="w-5 h-5" />
                  Réinitialiser les paramètres
                </button>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="px-6 py-3.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-xl font-bold transition-all border-2 border-gray-300 dark:border-gray-600">
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/30 flex items-center gap-3 justify-center"
                  >
                    <Save className="w-5 h-5" />
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de réinitialisation */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetSettings}
        title="Réinitialiser les paramètres"
        message="Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ? Cette action est irréversible et affectera tous les utilisateurs."
        confirmText="Réinitialiser"
        cancelText="Annuler"
        type="warning"
      />
    </div>
  );
};

export default AdminSettingsPage;