import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Shield, Building2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdminProfileEditProps {
  onComplete: (profileData: any) => void;
  userEmail: string;
}

export function AdminProfileEdit({ onComplete, userEmail }: AdminProfileEditProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    position: 'Administrateur Principal',
    department: 'Direction Générale'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      setIsSubmitting(false);
      return;
    }

    if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      toast.error("Numéro de téléphone invalide");
      setIsSubmitting(false);
      return;
    }

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Appeler la fonction de complétion
    onComplete(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header avec informations système */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-8 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300">
                  Compléter votre profil
                </h2>
                <p className="text-white/60 mt-1">Administrateur Principal - Église La Compassion</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                Compte système
              </div>
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className="p-6 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white/60" />
              <span className="text-white/80">{userEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-white/60" />
              <span className="text-white/80">Accès complet au système</span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Informations personnelles */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/5">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Informations personnelles</h3>
              </div>
              
              <div className="text-white/70 mb-6">
                <p>En tant qu'Administrateur Principal, votre profil sera utilisé pour :</p>
                <ul className="mt-2 space-y-1 pl-5 list-disc">
                  <li>La validation des réservations</li>
                  <li>La gestion des départements</li>
                  <li>La communication avec les responsables</li>
                </ul>
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
                      placeholder="Votre prénom"
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
                      placeholder="Votre nom de famille"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/5">
                  <Phone className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Informations de contact</h3>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80 ml-1">
                  Numéro de téléphone
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/30 outline-none transition-all hover:border-white/20"
                    placeholder="+243 XX XXX XXXX"
                  />
                </div>
                <p className="text-sm text-white/50">
                  Optionnel - utilisé uniquement pour les urgences système
                </p>
              </div>
            </div>

            {/* Section Position */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white/5">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Rôle et responsabilités</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1">
                    Position
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.position}
                      readOnly
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1">
                    Département
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.department}
                      readOnly
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-white/80">
                  <strong>Note :</strong> En tant qu'Administrateur Principal, vous avez accès à toutes les fonctionnalités du système, y compris la gestion des utilisateurs, la validation des réservations et les paramètres système.
                </p>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="pt-8 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Finalisation...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Compléter le profil et accéder au tableau de bord
                  </span>
                )}
              </motion.button>
              
              <p className="text-center text-white/50 mt-4 text-sm">
                Cette étape est obligatoire pour votre première connexion
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}