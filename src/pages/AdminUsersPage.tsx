// src/pages/AdminUsersPage.tsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Download, 
  Upload, 
  Shield, 
  UserCheck, 
  UserX, 
  Activity,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Composants
import UserManagement from '../components/admin/UserManagement';

// Types
import type { User, ApprovalStatus, UserRole } from '../types/user';
import type { AdminUser, Department as AdminDepartment, RecentActivity } from '../types/admin';
import type { PageId } from '../types/routes';

// Utilitaires
import { ADMIN_ROUTES } from '../utils/adminRoutes';

interface AdminUsersPageProps {
  onNavigate?: (pageId: PageId) => void;
}

const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ onNavigate }) => {
  // États
  const [users, setUsers] = useState<User[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([
    { 
      id: '1', 
      name: 'Chorale', 
      description: 'Département de chorale',
      leader: 'Jean Dupont',
      leaderEmail: 'jean.dupont@compassion.org',
      memberCount: 12,
      active: true,
      color: 'blue',
      createdAt: '2024-01-01',
      updatedAt: '2024-03-20'
    },
    {
      id: '2',
      name: 'Technique',
      description: 'Département technique',
      leader: 'Marie Martin',
      leaderEmail: 'marie.martin@compassion.org',
      memberCount: 8,
      active: true,
      color: 'green',
      createdAt: '2024-02-15',
      updatedAt: '2024-03-18'
    },
    {
      id: '3',
      name: 'Musique',
      description: 'Département de musique et louange',
      leader: 'Pierre Durand',
      leaderEmail: 'pierre.durand@compassion.org',
      memberCount: 15,
      active: true,
      color: 'purple',
      createdAt: '2024-01-10',
      updatedAt: '2024-03-15'
    }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user',
      action: 'Nouveau compte créé',
      user: 'Jean Dupont',
      timestamp: '2024-03-20T10:30:00',
      status: 'success'
    },
    {
      id: '2',
      type: 'reservation',
      action: 'Réservation approuvée',
      user: 'Marie Martin',
      timestamp: '2024-03-19T14:20:00',
      status: 'success'
    },
    {
      id: '3',
      type: 'user',
      action: 'Compte désactivé',
      user: 'Pierre Durand',
      timestamp: '2024-03-18T09:15:00',
      status: 'warning'
    }
  ]);

  // Données mock pour les statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingApproval: 0,
    departmentLeaders: 0
  });

  // Fonction pour trouver l'ID du département par son nom
  const findDepartmentIdByName = (departmentName: string): string => {
    const dept = departments.find(d => d.name === departmentName);
    return dept ? dept.id : '';
  };

  // Fonction de conversion AdminUser -> User pour UserManagement
  const convertToUser = (adminUser: AdminUser): User => {
    // Convertir le rôle AdminUser en UserRole
    let userRole: UserRole;
    if (adminUser.role === 'admin' || adminUser.role === 'ADMIN') {
      userRole = 'ADMIN';
    } else if (adminUser.role === 'department_leader' || adminUser.role === 'RESPONSABLE') {
      userRole = 'RESPONSABLE';
    } else {
      userRole = 'USER';
    }

    // Convertir le statut AdminUser en statut User
    let userStatus: 'active' | 'inactive' | 'pending';
    switch (adminUser.status) {
      case 'active':
        userStatus = 'active';
        break;
      case 'pending':
        userStatus = 'pending';
        break;
      default:
        userStatus = 'inactive';
    }

    // Convertir l'approbation
    const approvalStatus: ApprovalStatus = adminUser.approved ? 'APPROVED' : 'PENDING';

    // Extraire le prénom et nom du champ name si firstName/lastName n'existent pas
    let firstName = adminUser.firstName || '';
    let lastName = adminUser.lastName || '';
    
    if (!firstName && !lastName && adminUser.name) {
      const nameParts = adminUser.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      role: userRole,
      profileCompleted: adminUser.profileCompleted,
      firstName: firstName,
      lastName: lastName,
      // Utiliser la fonction pour trouver l'ID du département
      departmentId: findDepartmentIdByName(adminUser.department),
      isActive: adminUser.status === 'active',
      status: userStatus,
      approvalStatus: approvalStatus,
      createdAt: adminUser.createdAt,
      lastLogin: adminUser.lastLogin || undefined,
      phone: adminUser.phone || undefined
    };
  };

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@compassion.org',
            role: 'ADMIN',
            profileCompleted: true,
            firstName: 'Admin',
            lastName: 'System',
            departmentId: '4',
            isActive: true,
            status: 'active',
            approvalStatus: 'APPROVED',
            createdAt: '2024-01-01',
            lastLogin: '2024-03-20T10:30:00',
            phone: '+1234567890'
          },
          {
            id: '2',
            email: 'jean.dupont@compassion.org',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Jean',
            lastName: 'Dupont',
            departmentId: '1',
            isActive: true,
            status: 'active',
            approvalStatus: 'APPROVED',
            createdAt: '2024-01-15',
            lastLogin: '2024-03-19T14:20:00',
            phone: '+1234567891'
          },
          {
            id: '3',
            email: 'marie.martin@compassion.org',
            role: 'RESPONSABLE',
            profileCompleted: false,
            firstName: 'Marie',
            lastName: 'Martin',
            departmentId: '2',
            isActive: false,
            status: 'pending',
            approvalStatus: 'PENDING',
            createdAt: '2024-02-10',
            phone: '+1234567892'
          },
          {
            id: '4',
            email: 'pierre.durand@compassion.org',
            role: 'USER',
            profileCompleted: true,
            firstName: 'Pierre',
            lastName: 'Durand',
            departmentId: '3',
            isActive: false,
            status: 'inactive',
            approvalStatus: 'REJECTED',
            createdAt: '2024-01-05',
            lastLogin: '2024-02-28T09:15:00',
            phone: '+1234567893'
          },
          {
            id: '5',
            email: 'sophie.leroy@compassion.org',
            role: 'RESPONSABLE',
            profileCompleted: true,
            firstName: 'Sophie',
            lastName: 'Leroy',
            departmentId: '2',
            isActive: true,
            status: 'active',
            approvalStatus: 'APPROVED',
            createdAt: '2024-01-20',
            lastLogin: '2024-03-18T16:45:00',
            phone: '+1234567894'
          },
        ];

        const mockAdminUsers: AdminUser[] = mockUsers.map(user => {
          const department = departments.find(d => d.id === user.departmentId);
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            department: department?.name || 'Non assigné',
            role: (user.role === 'ADMIN' ? 'admin' : 
                   user.role === 'RESPONSABLE' ? 'department_leader' : 'user') as AdminUser['role'],
            status: (user.status || 'inactive') as AdminUser['status'],
            reservationsCount: Math.floor(Math.random() * 20),
            lastLogin: user.lastLogin || '',
            createdAt: user.createdAt || '',
            approved: user.approvalStatus === 'APPROVED',
            profileCompleted: user.profileCompleted || false,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName
          };
        });

        // Calculer les statistiques
        const activeUsers = mockUsers.filter(u => u.isActive).length;
        const pendingApproval = mockUsers.filter(u => u.approvalStatus === 'PENDING').length;
        const departmentLeaders = mockUsers.filter(u => u.role === 'RESPONSABLE').length;

        setUsers(mockUsers);
        setAdminUsers(mockAdminUsers);
        setFilteredUsers(mockAdminUsers);
        
        setStats({
          totalUsers: mockUsers.length,
          activeUsers,
          pendingApproval,
          departmentLeaders
        });
        
        toast.success('Utilisateurs chargés avec succès');
      } catch (error) {
        console.error('Erreur de chargement des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [departments]);

  // Filtrer les utilisateurs
  useEffect(() => {
    let results = [...adminUsers];
    
    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    }
    
    // Filtre par rôle
    if (roleFilter !== 'all') {
      results = results.filter(user => {
        if (roleFilter === 'admin') return user.role === 'admin' || user.role === 'ADMIN';
        if (roleFilter === 'department_leader') return user.role === 'department_leader' || user.role === 'RESPONSABLE';
        if (roleFilter === 'user') return user.role === 'user' || user.role === 'USER';
        return true;
      });
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(results);
  }, [adminUsers, searchQuery, roleFilter, statusFilter]);

  // Handlers
  const handleRefresh = async (): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.info('Liste actualisée');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async (): Promise<void> => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Export terminé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };

  const handleUserAction = async (action: string, user: User): Promise<void> => {
    toast.info(`${action} pour l'utilisateur ${user.firstName} ${user.lastName} (${user.email})`);
    // Simuler un délai pour l'action
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  // Convertir les utilisateurs filtrés pour UserManagement
  const usersForUserManagement = filteredUsers ? filteredUsers.map(convertToUser) : [];

  // Handlers pour UserManagement qui prennent un User
  const handleEditUser = async (user: User): Promise<void> => {
    await handleUserAction('Modifier', user);
  };

  const handleDeleteUser = async (user: User): Promise<void> => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      await handleUserAction('Supprimer', user);
    }
  };

  const handleApproveUser = async (user: User): Promise<void> => {
    if (window.confirm(`Êtes-vous sûr de vouloir approuver l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      await handleUserAction('Approuver', user);
    }
  };

  const handleViewDetails = async (user: User): Promise<void> => {
    if (onNavigate) {
      // Pourrait naviguer vers une page de détails spécifique plus tard
      // onNavigate(`user_detail/${user.id}`);
      onNavigate('admin_users');
      // Afficher des détails dans une modal ou sidebar
      toast.info(`Détails de ${user.firstName} ${user.lastName}`);
    }
  };

  // Rendu
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les comptes utilisateurs, les rôles et les permissions
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => handleRefresh()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter un utilisateur
          </button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total utilisateurs</p>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
            </div>
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Utilisateurs actifs</p>
              <p className="text-2xl font-bold mt-1">{stats.activeUsers}</p>
            </div>
            <UserCheck size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">En attente</p>
              <p className="text-2xl font-bold mt-1">{stats.pendingApproval}</p>
            </div>
            <Shield size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Responsables</p>
              <p className="text-2xl font-bold mt-1">{stats.departmentLeaders}</p>
            </div>
            <UserCheck size={24} />
          </div>
        </div>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtres */}
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="department_leader">Responsables</option>
              <option value="user">Utilisateurs</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="pending">En attente</option>
            </select>
            
            <button
              onClick={() => handleExportUsers()}
              disabled={exportLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Download size={18} />
              {exportLoading ? 'Export en cours...' : 'Exporter'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tableau des utilisateurs via UserManagement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <UserManagement
          users={usersForUserManagement}
          loading={loading}
          onRefresh={handleRefresh}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onApproveUser={handleApproveUser}
          onViewDetails={handleViewDetails}
        />
      </motion.div>

      {/* Activités récentes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Activités récentes
          </h2>
          <Activity size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user} • {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;