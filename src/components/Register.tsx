import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, ArrowLeft, Briefcase, Church } from 'lucide-react';
import { toast } from 'sonner';

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

  // Liste fictive des départements (à remplacer par un appel API plus tard)
  const departments = [
    { id: '1', name: 'Genius hub' },
    { id: '2', name: 'Protocole' },
    { id: '3', name: 'Intercession' },
    { id: '4', name: 'Sécurité' },
    { id: '5', name: 'Jeunesse' },
    { id: '6', name: 'Ecole des ouvriers' },
    { id: '7', name: 'Ecole de bapteme' },
    { id: '8', name: 'Affermissement' },
    { id: '9', name: 'Ecole des adolescences' },
    { id: '10', name: 'Suivi des ames' },
    { id: '11', name: 'Salubrité' },
    { id: '12', name: 'Evangelisation' },
    { id: '13', name: 'Technique' },
    { id: '14', name: 'Chorale 1' },
    { id: '15', name: 'Chorale 2' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!formData.departmentId) {
      toast.error("Veuillez sélectionner un département.");
      return;
    }

    onRegister(formData);
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
          
          {/* Logo et titre centré */}
          <div className="flex items-center gap-3">
            <Church className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">La Compassion</h3>
              <p className="text-xs text-white/50">Centre Évangélique</p>
            </div>
          </div>
          
          <div className="w-32"></div> {/* Pour équilibrer la flexbox */}
        </div>

        {/* Carte principale */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header de la carte avec Building2 */}
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
                    <label className="text-sm font-medium text-white/80 ml-1">Prénom</label>
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
                    <label className="text-sm font-medium text-white/80 ml-1">Nom</label>
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

              {/* Section Département */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Département</h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 ml-1">Sélectionnez votre département</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <select
                      required
                      value={formData.departmentId}
                      onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white appearance-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/30 outline-none transition-all hover:border-white/20 cursor-pointer"
                    >
                      <option value="" className="bg-[#1E293B] text-white/70">Sélectionnez votre département</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id} className="bg-[#1E293B] text-white">
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>
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
                  <label className="text-sm font-medium text-white/80 ml-1">Email professionnel</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 outline-none transition-all hover:border-white/20"
                      placeholder="votre.nom@eglise.com"
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
                    <label className="text-sm font-medium text-white/80 ml-1">Mot de passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/80 ml-1">Confirmation</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white focus:ring-2 focus:ring-green-400/50 focus:border-green-400/30 outline-none transition-all hover:border-white/20"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 mt-8 group"
              >
                <span className="flex items-center justify-center gap-3">
                  <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Créer mon compte responsable
                </span>
              </motion.button>
            </form>

            {/* Note informative */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3 text-sm text-white/50">
                <div className="p-1 rounded bg-white/5 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <p>
                  Vos données sont sécurisées et utilisées uniquement pour la gestion des réservations de votre département.
                  Un administrateur devra valider votre compte avant la première connexion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}