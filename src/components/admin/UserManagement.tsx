// src/components/admin/UserManagement.tsx
import React, { useState, useMemo } from 'react';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  Eye, 
  User as UserIcon,
  Mail,
  Building,
  Shield,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import type { User as UserType, UserRole, ApprovalStatus } from '../../types/user';

interface UserManagementProps {
  users: UserType[];
  loading: boolean;
  onRefresh: () => void;
  onEditUser: (user: UserType) => void;
  onDeleteUser: (user: UserType) => void;
  onApproveUser: (user: UserType) => void;
  onViewDetails: (user: UserType) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users = [],
  loading,
  onRefresh,
  onEditUser,
  onDeleteUser,
  onApproveUser,
  onViewDetails,
}) => {
  // États
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserType;
    direction: 'asc' | 'desc';
  } | null>(null);

  // S'assurer que users est toujours un tableau
  const safeUsers = Array.isArray(users) ? users : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Trier les utilisateurs
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...safeUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        // Pour les chaînes
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Pour les dates
        if (typeof aValue === 'string' && typeof bValue === 'string' && 
            (sortConfig.key === 'createdAt' || sortConfig.key === 'lastLogin')) {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Pour les nombres ou autres
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [safeUsers, sortConfig]);

  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Handlers
  const handleSelectAll = () => {
    if (selectedUsers.length === safeUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(safeUsers.map(user => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSort = (key: keyof UserType) => {
    setSortConfig(current => {
      if (current && current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleDeleteClick = (user: UserType) => {
    if (user.email === 'admin@compassion.org') {
      toast.error('Impossible de supprimer le compte administrateur principal');
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await onDeleteUser(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="text-purple-600" size={16} />;
      case 'RESPONSABLE':
        return <Building className="text-blue-600" size={16} />;
      default:
        return <UserIcon className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: UserType['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getApprovalColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format de date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  // Rendu
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedUsers.length === safeUsers.length && safeUsers.length > 0}
            onChange={handleSelectAll}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedUsers.length} sélectionné(s)
          </span>
        </div>
        
        {selectedUsers.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const selected = safeUsers.filter(u => selectedUsers.includes(u.id));
                selected.forEach(user => onApproveUser(user));
                setSelectedUsers([]);
              }}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
            >
              Approuver
            </button>
            <button
              onClick={() => {
                const selected = safeUsers.filter(u => selectedUsers.includes(u.id));
                if (selected.some(u => u.email === 'admin@compassion.org')) {
                  toast.error('Impossible de supprimer le compte administrateur');
                  return;
                }
                if (confirm(`Êtes-vous sûr de vouloir supprimer ${selected.length} utilisateur(s) ?`)) {
                  selected.forEach(user => onDeleteUser(user));
                  setSelectedUsers([]);
                }
              }}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Chargement des utilisateurs...</p>
          </div>
        ) : safeUsers.length === 0 ? (
          <div className="p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              Aucun utilisateur
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par créer un nouvel utilisateur.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === safeUsers.length && safeUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    Utilisateur
                    {sortConfig?.key === 'firstName' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {sortConfig?.key === 'email' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Rôle
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Statut
                    {sortConfig?.key === 'status' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('approvalStatus')}
                >
                  <div className="flex items-center gap-1">
                    Approbation
                    {sortConfig?.key === 'approvalStatus' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Date création
                    {sortConfig?.key === 'createdAt' && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Département: {user.departmentId || 'Non assigné'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail size={14} className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">
                        {user.role === 'ADMIN' ? 'Administrateur' : 
                         user.role === 'RESPONSABLE' ? 'Responsable' : 'Utilisateur'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Actif' : 
                       user.status === 'inactive' ? 'Inactif' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalColor(user.approvalStatus ?? 'PENDING')}`}>
                        {user.approvalStatus === 'APPROVED' ? 'Approuvé' : 
                        user.approvalStatus === 'REJECTED' ? 'Rejeté' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      {formatDate(user.createdAt)}
                    </div>
                    {user.lastLogin && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Dernière connexion: {formatDate(user.lastLogin)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(user)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="Voir détails"
                      >
                        <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        title="Modifier"
                      >
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      {user.approvalStatus === 'PENDING' && (
                        <button
                          onClick={() => onApproveUser(user)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                          title="Approuver"
                        >
                          <CheckCircle size={16} className="text-green-600" />
                        </button>
                      )}
                      {user.email !== 'admin@compassion.org' && (
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                          title="Supprimer"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, sortedUsers.length)} sur {sortedUsers.length} utilisateurs
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.firstName} ${userToDelete?.lastName} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default UserManagement;