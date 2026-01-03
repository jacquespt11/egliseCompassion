import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Bell, 
  Shield, 
  Mail, 
  Globe, 
  Moon, 
  Sun,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  user: any;
}

export function SettingsPage({ user }: SettingsPageProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reservations: true,
    approvals: user?.role === 'ADMIN',
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showDepartment: true,
    showEmail: false,
  });
  const [language, setLanguage] = useState('fr');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveSettings = () => {
    // Sauvegarder les paramètres
    console.log('Settings saved:', {
      theme,
      notifications,
      privacy,
      language,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Apparence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Apparence
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Personnalisez l'apparence de l'application
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Thème */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Thème
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Sun className="w-6 h-6 text-yellow-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Clair
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Interface lumineuse
                    </p>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Moon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Sombre
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Interface sombre
                    </p>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className={`p-4 rounded-lg border-2 transition-all border-gray-200 dark:border-gray-700 hover:border-gray-300`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className="relative w-12 h-6">
                        <Sun className="absolute left-0 w-5 h-5 text-yellow-500" />
                        <Moon className="absolute right-0 w-5 h-5 text-indigo-400" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Automatique
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Basé sur le système
                    </p>
                  </button>
                </div>
              </div>

              {/* Disposition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Disposition
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors">
                    <Smartphone className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Mobile
                    </p>
                  </button>
                  <button className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors">
                    <Monitor className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      Desktop
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Notifications
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gérez vos préférences de notifications
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {key === 'email' && 'Notifications par email'}
                      {key === 'push' && 'Notifications push'}
                      {key === 'reservations' && 'Mises à jour des réservations'}
                      {key === 'approvals' && 'Demandes d\'approbation'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key === 'email' && 'Recevoir des emails de confirmation'}
                      {key === 'push' && 'Notifications dans le navigateur'}
                      {key === 'reservations' && 'Changements dans vos réservations'}
                      {key === 'approvals' && 'Nouvelles demandes d\'approbation'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sécurité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Sécurité
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Modifiez votre mot de passe et paramètres de sécurité
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ancien mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Confidentialité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Confidentialité
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {key === 'profileVisible' && 'Profil visible'}
                      {key === 'showDepartment' && 'Afficher département'}
                      {key === 'showEmail' && 'Afficher email'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivacy(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Langue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Langue
                </h2>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6"
          >
            <div className="text-center">
              <Save className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Sauvegarder les modifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Vos modifications seront appliquées immédiatement
              </p>
              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Sauvegarder
              </button>
              <button className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 mt-3">
                Réinitialiser
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}