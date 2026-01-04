// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload,
  Star,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react';
import type { User as UserType } from '../types/user';
import type { Page } from '../types/common';

interface ProfilePageProps {
  user: UserType | null;
  onNavigate: (page: Page) => void;
  onUpdateProfile: (data: Partial<UserType>) => Promise<void>;
}

export function ProfilePage({ user, onNavigate, onUpdateProfile }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
    bio: user?.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const stats = {
    totalReservations: 42,
    approvedReservations: 38,
    pendingReservations: 4,
    memberSince: '2023-06-15',
    lastActive: 'Aujourd\'hui à 10:30',
    rating: 4.8,
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    // Validation des mots de passe si en train de changer
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Le mot de passe actuel est requis';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'Le nouveau mot de passe est requis';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Minimum 8 caractères';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onUpdateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        bio: formData.bio,
      });
      
      // Si changement de mot de passe
      if (formData.currentPassword && formData.newPassword) {
        // Logique pour changer le mot de passe
        console.log('Changement de mot de passe...');
      }

      setIsEditing(false);
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
      bio: user?.bio || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    return user.firstName && user.lastName 
      ? `${user.firstName[0]}${user.lastName[0]}` 
      : user.email[0].toUpperCase();
  };

  const getRoleLabel = (role?: string) => {
    switch(role) {
      case 'ADMIN': return 'Administrateur';
      case 'RESPONSABLE': return 'Responsable';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = (role?: string) => {
    switch(role) {
      case 'ADMIN': return 'from-purple-500 to-purple-600';
      case 'RESPONSABLE': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-rose-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 shadow-2xl shadow-rose-500/20 dark:shadow-rose-900/30"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-white">{getInitials()}</div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity rounded-3xl">
                      <Camera className="w-8 h-8 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 p-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {isEditing ? 'Modifier mon profil' : 'Mon profil'}
                </h1>
                <p className="text-rose-100 text-lg">
                  {isEditing 
                    ? 'Mettez à jour vos informations personnelles' 
                    : 'Consultez et gérez vos informations personnelles'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white text-rose-700 rounded-xl font-semibold hover:bg-rose-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-rose-900/30"
                >
                  <Edit className="w-5 h-5" />
                  Modifier le profil
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 shadow-lg"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 bg-white text-rose-700 rounded-xl font-semibold hover:bg-rose-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-rose-900/30 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-700"></div>
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Enregistrer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/30">
                  <Calendar className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Réservations</p>
                  <p className="font-semibold text-white text-2xl">{stats.totalReservations}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/30">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">En attente</p>
                  <p className="font-semibold text-white text-2xl">{stats.pendingReservations}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/30">
                  <Star className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Note moyenne</p>
                  <p className="font-semibold text-white text-2xl">{stats.rating}/5</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/30">
                  <Calendar className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Membre depuis</p>
                  <p className="font-semibold text-white text-2xl">
                    {new Date(stats.memberSince).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formulaire/Informations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRoleColor(user?.role)} text-white`}>
                  {getRoleLabel(user?.role)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Prénom
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                          errors.firstName ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800`}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && (
                        <p className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.firstName || 'Non spécifié'}</span>
                    </div>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Nom
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                          errors.lastName ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800`}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && (
                        <p className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.lastName || 'Non spécifié'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Adresse email
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                          errors.email ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                    </div>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                          errors.phone ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800`}
                        placeholder="+33 1 23 45 67 89"
                      />
                      {errors.phone && (
                        <p className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.phone || 'Non spécifié'}</span>
                    </div>
                  )}
                </div>

                {/* Département */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Département
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800"
                    >
                      <option value="">Sélectionnez un département</option>
                      <option value="Chorale">Chorale</option>
                      <option value="Louange">Louange</option>
                      <option value="Intercession">Intercession</option>
                      <option value="Technique">Technique</option>
                      <option value="Accueil">Accueil</option>
                      <option value="Enfants">Enfants</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <Building2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.department || 'Non spécifié'}</span>
                    </div>
                  )}
                </div>

                {/* Position/Fonction */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Fonction
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800"
                      placeholder="Votre fonction"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{user?.position || 'Non spécifié'}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Biographie
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800 resize-none"
                      placeholder="Décrivez-vous en quelques mots..."
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.bio || 'Aucune biographie renseignée'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Changement de mot de passe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/20">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sécurité du compte</h2>
                  <p className="text-gray-600 dark:text-gray-400">Changez votre mot de passe</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mot de passe actuel */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                        errors.currentPassword ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 pr-12`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-rose-500 text-sm mt-2">{errors.currentPassword}</p>
                  )}
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                        errors.newPassword ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 pr-12`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-rose-500 text-sm mt-2">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirmer mot de passe */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 ${
                        errors.confirmPassword ? 'border-rose-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 pr-12`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-rose-500 text-sm mt-2">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Conseils de sécurité</p>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                        <li>• Minimum 8 caractères</li>
                        <li>• Combinez lettres, chiffres et symboles</li>
                        <li>• Évitez les mots de passe courants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Statut du compte */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Statut du compte</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Compte vérifié</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">Email confirmé</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">2FA</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Non activé</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors border border-blue-300 dark:border-blue-700">
                    Activer
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-xl border-2 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dernière connexion</p>
                      <p className="text-sm text-amber-700 dark:text-amber-400">{stats.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Actions rapides</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('my_reservations')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900">
                      <Calendar className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      Mes réservations
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Exporter mes données
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                </button>

                {user?.role === 'ADMIN' && (
                  <button 
                    onClick={() => onNavigate('admin_settings')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        Paramètres admin
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
            >
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Pour toute assistance, contactez l'administrateur
                </p>
                <a 
                  href="mailto:admin@compassion.org" 
                  className="text-rose-600 dark:text-rose-400 font-bold hover:underline block mt-2"
                >
                  admin@compassion.org
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}