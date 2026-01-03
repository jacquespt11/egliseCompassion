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
  Moon
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmationModal } from '../components/shared/ConfirmationModal';

interface AdminSettingsPageProps {
  user: {
    role: 'ADMIN' | 'RESPONSABLE' | 'USER';
    email: string;
  } | null;
}

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('general');
  const [showResetModal, setShowResetModal] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailOnNewReservation: true,
      emailOnApprovalNeeded: true,
      pushNotifications: true,
    },
    reservation: {
      maxDaysInAdvance: 30,
      minNoticeHours: 2,
      maxHoursPerBooking: 4,
      allowWeekendBookings: false,
    },
    system: {
      maintenanceMode: false,
      requireAdminApproval: true,
      allowMultipleBookings: false,
      autoCancelUnapproved: 48, // heures
    },
    email: {
      smtpServer: '',
      smtpPort: '',
      senderEmail: 'admin@compassion.org',
      senderName: 'Église La Compassion',
    }
  });

  const settingSections: SettingSection[] = [
    { id: 'general', title: 'Général', icon: <Settings size={20} />, description: 'Paramètres système' },
    { id: 'appearance', title: 'Apparence', icon: <Palette size={20} />, description: 'Thème et interface' },
    { id: 'notifications', title: 'Notifications', icon: <Bell size={20} />, description: 'Alertes et emails' },
    { id: 'reservation', title: 'Réservations', icon: <Calendar size={20} />, description: 'Règles de réservation' },
    { id: 'security', title: 'Sécurité', icon: <Lock size={20} />, description: 'Accès et permissions' },
    { id: 'email', title: 'Email', icon: <Mail size={20} />, description: 'Configuration SMTP' },
    { id: 'users', title: 'Utilisateurs', icon: <Users size={20} />, description: 'Gestion des départements' },
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
      },
      reservation: {
        maxDaysInAdvance: 30,
        minNoticeHours: 2,
        maxHoursPerBooking: 4,
        allowWeekendBookings: false,
      },
      system: {
        maintenanceMode: false,
        requireAdminApproval: true,
        allowMultipleBookings: false,
        autoCancelUnapproved: 48,
      },
      email: {
        smtpServer: '',
        smtpPort: '',
        senderEmail: 'admin@compassion.org',
        senderName: 'Église La Compassion',
      }
    });
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-blue-600 dark:text-blue-400" size={28} />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Paramètres Administrateur</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Gérez les paramètres système, les notifications et les règles de réservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {section.icon}
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{section.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-amber-600 dark:text-amber-400" size={18} />
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300">Zone Administrateur</h3>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  Seul l'administrateur principal peut modifier ces paramètres
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Connecté en tant que: <span className="font-semibold">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Section Apparence */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Apparence</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sélecteur de thème */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <label className="block font-medium mb-4 text-gray-800 dark:text-white">
                        Thème de l'application
                      </label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => theme !== 'light' && toggleTheme()}
                          className={`flex-1 p-4 border rounded-lg text-center transition-all ${
                            theme === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex justify-center mb-2">
                            <Sun className="w-8 h-8 text-yellow-500" />
                          </div>
                          <div className="font-medium">Clair</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interface lumineuse</p>
                        </button>
                        <button
                          onClick={() => theme !== 'dark' && toggleTheme()}
                          className={`flex-1 p-4 border rounded-lg text-center transition-all ${
                            theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex justify-center mb-2">
                            <Moon className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div className="font-medium">Sombre</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interface sombre</p>
                        </button>
                      </div>
                    </div>

                    {/* Autres préférences d'apparence */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <label className="block font-medium mb-4 text-gray-800 dark:text-white">
                        Autres préférences
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Animations</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Effets de transition</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-800 dark:text-white">Densité</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Espacement des éléments</p>
                          </div>
                          <select className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2 text-gray-800 dark:text-white">
                            <option>Confortable</option>
                            <option>Compact</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Générale */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Paramètres Généraux</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contenu existant de la section générale */}
                    {/* ... */}
                  </div>
                </div>
              )}

              {/* Section Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Paramètres de Notifications</h2>
                  {/* Contenu existant des notifications */}
                  {/* ... */}
                </div>
              )}

              {/* Section Réservations */}
              {activeSection === 'reservation' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Règles de Réservation</h2>
                  {/* Contenu existant des réservations */}
                  {/* ... */}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Réinitialiser les paramètres
                </button>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
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
        message="Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ? Cette action est irréversible."
        confirmText="Réinitialiser"
        cancelText="Annuler"
        type="warning"
      />
    </div>
  );
};

export default AdminSettingsPage;