import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, ArrowLeft, Church } from 'lucide-react';
import { toast } from 'sonner';
import { DepartmentSelector } from './auth/DepartmentSelector';

interface RegisterProps {
  onRegister: (formData: any) => void;
  onBackToLogin: () => void;
}

export function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    departmentId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.departmentId) {
      toast.error("Veuillez sélectionner un département.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      setIsSubmitting(false);
      return;
    }

    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    onRegister(formData);
    setIsSubmitting(false);
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setFormData({...formData, departmentId});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header avec retour */}
        <div className="flex items-center justify-between mb-8">
          <motion.button 
            onClick={onBackToLogin}
            className="flex items-center gap-3 text-white/70 hover:text-white transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-white/5"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Retour à la connexion</span>
          </motion.button>
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Church className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">La Compassion</h3>
              <p className="text-xs text-white/50">Centre Évangélique</p>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Carte principale */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header de la carte */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-8 border-b border-white/10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300">
                  Inscription Responsable
                </h2>
                <p className="text-white/60 mt-2">Créez votre compte pour gérer votre département</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section Informations personnelles */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Informations personnelles</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
                      <span>Prénom</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="Ex: Perfect"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
                      <span>Nom</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="Ex: Tshibangu"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Département avec DepartmentSelector */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Département</h3>
                </div>
                
                <DepartmentSelector 
                  value={formData.departmentId}
                  onSelect={handleDepartmentSelect}
                  label="Sélectionnez votre département"
                  required={true}
                  showIcon={true}
                />
                
                <p className="text-sm text-white/50">
                  Le département sélectionné déterminera les salles que vous pourrez réserver.
                </p>
              </div>

              {/* Section Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Contact</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
                    <span>Email professionnel</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 outline-none transition-all hover:border-white/20"
                      placeholder="votre.nom@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* Section Sécurité */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Sécurité</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
                      <span>Mot de passe</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="Minimum 8 caractères"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
                      <span>Confirmation</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="Retapez votre mot de passe"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-sm text-white/70">
                    <strong>Recommandations de sécurité :</strong> Utilisez un mot de passe fort contenant au moins 8 caractères, avec des majuscules, des minuscules, des chiffres et des caractères spéciaux.
                  </p>
                </div>
              </div>

              {/* Bouton de soumission */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 mt-8 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Création du compte...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Créer mon compte responsable
                  </span>
                )}
              </motion.button>
            </form>

            {/* Note informative */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3 text-sm text-white/50">
                <div className="p-1 rounded bg-white/5 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <p>
                  Votre compte sera créé en tant que "Responsable de département". Un administrateur devra valider votre compte avant que vous puissiez effectuer des réservations. Vous recevrez une notification par email une fois votre compte validé.
                </p>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-white/50 mt-4">
                <div className="p-1 rounded bg-white/5 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <p>
                  En tant que responsable, vous pourrez réserver des salles pour les activités de votre département, consulter le planning des réservations et gérer vos réservations en cours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}