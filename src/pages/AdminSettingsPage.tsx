import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Lock, 
  Users, 
  Calendar,
  Mail,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ConfirmationModal from '../components/shared/ConfirmationModal';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-blue-600" size={28} />
            <h1 className="text-3xl font-bold text-gray-800">Paramètres Administrateur</h1>
          </div>
          <p className="text-gray-600">
            Gérez les paramètres système, les notifications et les règles de réservation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {section.icon}
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-amber-600" size={18} />
                  <h3 className="font-semibold text-amber-800">Zone Administrateur</h3>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  Seul l'administrateur principal peut modifier ces paramètres
                </p>
                <div className="text-xs text-gray-600">
                  Connecté en tant que: <span className="font-semibold">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Section Générale */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Paramètres Généraux</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <span className="font-medium">Mode Maintenance</span>
                            <p className="text-sm text-gray-500">Bloque toutes les réservations</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.system.maintenanceMode}
                            onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                            className="toggle"
                          />
                        </label>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <span className="font-medium">Approval Requise</span>
                            <p className="text-sm text-gray-500">Toutes réservations nécessitent approbation</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.system.requireAdminApproval}
                            onChange={(e) => handleSettingChange('system', 'requireAdminApproval', e.target.checked)}
                            className="toggle"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="mb-2">
                          <label className="block font-medium mb-1">Annulation Auto (heures)</label>
                          <p className="text-sm text-gray-500 mb-2">Annule les réservations non approuvées après:</p>
                        </div>
                        <select
                          value={settings.system.autoCancelUnapproved}
                          onChange={(e) => handleSettingChange('system', 'autoCancelUnapproved', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                          <option value={24}>24 heures</option>
                          <option value={48}>48 heures</option>
                          <option value={72}>72 heures</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Notifications */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Paramètres de Notifications</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="font-medium">Email sur nouvelle réservation</span>
                          <p className="text-sm text-gray-500">Recevoir un email pour chaque nouvelle demande</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailOnNewReservation}
                          onChange={(e) => handleSettingChange('notifications', 'emailOnNewReservation', e.target.checked)}
                          className="toggle"
                        />
                      </label>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="font-medium">Notifications Push</span>
                          <p className="text-sm text-gray-500">Alertes navigateur pour actions urgentes</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotifications}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                          className="toggle"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Réservations */}
              {activeSection === 'reservation' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Règles de Réservation</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block font-medium mb-2">Jours max à l'avance</label>
                      <input
                        type="number"
                        value={settings.reservation.maxDaysInAdvance}
                        onChange={(e) => handleSettingChange('reservation', 'maxDaysInAdvance', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min="1"
                        max="365"
                      />
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block font-medium mb-2">Heures min de préavis</label>
                      <input
                        type="number"
                        value={settings.reservation.minNoticeHours}
                        onChange={(e) => handleSettingChange('reservation', 'minNoticeHours', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min="0"
                        max="168"
                      />
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="block font-medium mb-2">Heures max par réservation</label>
                      <input
                        type="number"
                        value={settings.reservation.maxHoursPerBooking}
                        onChange={(e) => handleSettingChange('reservation', 'maxHoursPerBooking', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        min="1"
                        max="24"
                      />
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <span className="font-medium">Réservations weekend</span>
                          <p className="text-sm text-gray-500">Autoriser les réservations le weekend</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.reservation.allowWeekendBookings}
                          onChange={(e) => handleSettingChange('reservation', 'allowWeekendBookings', e.target.checked)}
                          className="toggle"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Réinitialiser les paramètres
                </button>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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