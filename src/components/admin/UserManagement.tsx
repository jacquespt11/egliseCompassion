import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  Building2,
  Shield,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'department_leader';
  departmentId?: string;
  department?: string;
  isProfileComplete?: boolean;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

interface Department {
  id: string;
  name: string;
  color: string;
}

interface UserManagementProps {
  users: User[];
  departments: Department[];
  loading: boolean;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleStatus: (userId: string, active: boolean) => Promise<void>;
  onCreateUser: () => void;
}

type UserRole = 'ALL' | 'admin' | 'user' | 'department_leader';
type UserStatus = 'ALL' | 'active' | 'inactive' | 'pending';

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  departments,
  loading,
  onApprove,
  onReject,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onCreateUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Filtrer les utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtre par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtre par rôle
      if (roleFilter !== 'ALL' && user.role !== roleFilter) {
        return false;
      }

      // Filtre par statut
      if (statusFilter !== 'ALL' && user.status !== statusFilter) {
        return false;
      }

      // Filtre par département
      if (departmentFilter !== 'ALL') {
        if (!user.departmentId || user.departmentId !== departmentFilter) {
          return false;
        }
      }

      return true;
    });
  }, [users, searchTerm, roleFilter, statusFilter, departmentFilter]);

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return 'Non assigné';
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Inconnu';
  };

  const getDepartmentColor = (departmentId?: string) => {
    if (!departmentId) return 'bg-gray-100 text-gray-800';
    const dept = departments.find(d => d.id === departmentId);
    if (dept?.color) {
      const colorMap: Record<string, string> = {
        'blue': 'bg-blue-100 text-blue-800',
        'green': 'bg-green-100 text-green-800',
        'purple': 'bg-purple-100 text-purple-800',
        'red': 'bg-red-100 text-red-800',
        'amber': 'bg-amber-100 text-amber-800',
        'cyan': 'bg-cyan-100 text-cyan-800'
      };
      return colorMap[dept.color.split('-')[1]] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    responsables: users.filter(u => u.role === 'department_leader').length,
    users: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec statistiques */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
          <p className="text-gray-600 mt-1">
            {filteredUsers.length} utilisateur(s) trouvé(s) • {stats.total} au total
          </p>
        </div>

        <button
          onClick={onCreateUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <UserPlus size={18} />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-50">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.admins}</p>
              <p className="text-sm text-gray-600">Administrateurs</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-50">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.responsables}</p>
              <p className="text-sm text-gray-600">Responsables</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            <div className="flex bg-gray-100 border border-gray-300 rounded-lg p-1">
              {(['ALL', 'admin', 'department_leader', 'user'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    roleFilter === role
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {role === 'ALL' ? 'Tous' : 
                   role === 'admin' ? 'Admins' : 
                   role === 'department_leader' ? 'Responsables' : 'Utilisateurs'}
                </button>
              ))}
            </div>

            <div className="flex bg-gray-100 border border-gray-300 rounded-lg p-1">
              {(['ALL', 'active', 'inactive', 'pending'] as UserStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {status === 'ALL' ? 'Tous' : 
                   status === 'active' ? 'Actifs' : 
                   status === 'inactive' ? 'Inactifs' : 'En attente'}
                </button>
              ))}
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tous départements</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun utilisateur trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL'
              ? 'Aucun utilisateur ne correspond à vos critères.'
              : 'Aucun utilisateur dans le système.'}
          </p>
          {(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL' || departmentFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
                setDepartmentFilter('ALL');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Département</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          {user.isProfileComplete ? (
                            <p className="text-xs text-green-600">Profil complet</p>
                          ) : (
                            <p className="text-xs text-amber-600">Profil incomplet</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-700">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 ${getDepartmentColor(user.departmentId)}`}>
                        <Building2 className="w-3 h-3" />
                        {getDepartmentName(user.departmentId)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <StatusBadge 
                        status={user.role === 'admin' ? 'info' : user.role === 'department_leader' ? 'warning' : 'success'}
                        label={user.role === 'admin' ? 'Administrateur' : user.role === 'department_leader' ? 'Responsable' : 'Utilisateur'}
                        size="sm"
                      />
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-green-500' :
                          user.status === 'inactive' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <span className="text-sm text-gray-700">
                          {user.status === 'active' ? 'Actif' : 
                           user.status === 'inactive' ? 'Inactif' : 'En attente'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewUser(user)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEditUser(user)}
                          className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-amber-600"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Êtes-vous sûr de vouloir ${user.status === 'active' ? 'désactiver' : 'activer'} cet utilisateur ?`)) {
                              onToggleStatus(user.id, user.status !== 'active');
                            }
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                        >
                          {user.status === 'active' ? (
                            <XCircle size={16} className="text-gray-600" />
                          ) : (
                            <CheckCircle size={16} className="text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                              onDeleteUser(user.id);
                            }
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Affichage de 1 à {filteredUsers.length} sur {stats.total} utilisateurs
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Précédent
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white border border-blue-600 rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;