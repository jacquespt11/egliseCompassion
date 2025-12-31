import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, UserPlus, Shield } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import { useAdmin } from '../hooks/useAdmin';
import type { User } from '../types/user';

interface AdminUsersPageProps {
  onNavigate: (page: string) => void;
}

export function AdminUsersPage({ onNavigate }: AdminUsersPageProps) {
  const { 
    departments, 
    loading, 
    fetchDepartments 
  } = useAdmin();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchDepartments();
        
        // Données mock pour les utilisateurs
        const mockUsers: User[] = [
          {
            id: 'admin_001',
            email: 'admin@compassion.org',
            role: 'ADMIN',
            profileCompleted: true,
            firstName: 'Administrateur',
            lastName: 'Principal',
            phone: '+243 81 000 0000',
            departmentId: '1'
          },
          {
            id: 'user1',
            email: 'jean.dupont@example.com',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Jean',
            lastName: 'Dupont',
            phone: '+243 81 234 5678',
            departmentId: '5',
            department: 'Musique'
          },
          {
            id: 'user2',
            email: 'marie.curie@example.com',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Marie',
            lastName: 'Curie',
            phone: '+243 82 345 6789',
            departmentId: '2',
            department: 'Jeunesse'
          },
          {
            id: 'user3',
            email: 'pierre.martin@example.com',
            role: 'RESPONSABLE',
            profileCompleted: false,
            firstName: 'Pierre',
            lastName: 'Martin',
            phone: '+243 83 456 7890',
            departmentId: '3',
            department: 'Technique'
          },
          {
            id: 'user4',
            email: 'sophie.bernard@example.com',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Sophie',
            lastName: 'Bernard',
            departmentId: '4',
            department: 'Protocole'
          },
          {
            id: 'user5',
            email: 'lucas.petit@example.com',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Lucas',
            lastName: 'Petit',
            phone: '+243 84 567 8901',
            departmentId: '6',
            department: 'Intercession'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchDepartments]);

  const handleViewUser = (user: User) => {
    // Pour l'instant, afficher les détails dans une alerte
    alert(`Détails de l'utilisateur:\n\n${JSON.stringify(user, null, 2)}`);
  };

  const handleEditUser = (user: User) => {
    // Ouvrir le modal d'édition
    alert(`Édition de l'utilisateur: ${user.firstName} ${user.lastName}`);
  };

  const handleDeleteUser = async (userId: string) => {
    // Simuler la suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      setUsers(prev => prev.filter(user => user.id !== userId));
      setIsLoading(false);
      alert('Utilisateur supprimé avec succès');
    }
  };

  const handleToggleStatus = async (userId: string, active: boolean) => {
    // Simuler le changement de statut
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulation
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user /*, active */ } // À adapter avec votre modèle
        : user
    ));
    setIsLoading(false);
    alert(`Utilisateur ${active ? 'activé' : 'désactivé'} avec succès`);
  };

  const handleCreateUser = () => {
    alert('Création d\'un nouvel utilisateur');
  };

  const handleBack = () => {
    onNavigate('admin_dashboard');
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au tableau de bord</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Gestion des utilisateurs
                </h1>
                <p className="text-white/60 mt-1">
                  Gérez les comptes et les autorisations des utilisateurs
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-sm text-white/60">Utilisateurs</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-emerald-300">
                {users.filter(u => u.profileCompleted).length}
              </p>
              <p className="text-sm text-white/60">Profils complets</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Guide de gestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Instructions de gestion</h3>
            <p className="text-white/60 mb-3">
              En tant qu'administrateur, vous pouvez :
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Créer de nouveaux comptes utilisateurs</span>
              </li>
              <li className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Assigner des départements aux responsables</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Activer ou désactiver des comptes</span>
              </li>
            </ul>
          </div>
          <div className="md:w-64">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-white/60">
                <strong>Important :</strong> La suppression d'un utilisateur est définitive et supprime toutes ses réservations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gestion des utilisateurs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <UserManagement
          user={users}
          department={departments}
          loading={isLoading || loading}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
          onCreateUser={handleCreateUser}
        />
      </motion.div>

      {/* Information sur les rôles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">À propos des rôles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Administrateur</h4>
                <p className="text-sm text-white/60">
                  Accès complet au système, gestion de tous les utilisateurs et paramètres.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">Responsable de département</h4>
                <p className="text-sm text-white/60">
                  Peut réserver des salles pour son département et gérer ses réservations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}