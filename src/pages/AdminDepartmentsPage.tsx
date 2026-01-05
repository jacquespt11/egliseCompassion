import React from 'react';
import { Building2, Users, Activity, Plus } from 'lucide-react';
import type { User } from '../types/user';
import type { Department } from '../types/admin';
import { ADMIN_ROUTES } from '../utils/adminRoutes';
import { AdminDepartmentsPageProps } from '../types/component-props';



const AdminDepartmentsPage: React.FC<AdminDepartmentsPageProps> = ({ user, onNavigate }) => {
  const departments: Department[] = [
    { 
      id: '1', 
      name: 'Chorale', 
      description: 'Département de musique et louange',
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
      name: 'Jeunesse', 
      description: 'Département des jeunes',
      leader: 'Marie Martin',
      leaderEmail: 'marie.martin@compassion.org',
      memberCount: 8,
      active: true,
      color: 'green',
      createdAt: '2024-01-15',
      updatedAt: '2024-03-19'
    },
    { 
      id: '3', 
      name: 'Accueil', 
      description: 'Accueil et service aux nouveaux',
      leader: 'Pierre Durand',
      leaderEmail: 'pierre.durand@compassion.org',
      memberCount: 6,
      active: true,
      color: 'purple',
      createdAt: '2024-01-10',
      updatedAt: '2024-03-18'
    },
    { 
      id: '4', 
      name: 'Administration', 
      description: 'Gestion administrative',
      leader: 'Admin System',
      leaderEmail: 'admin@compassion.org',
      memberCount: 3,
      active: true,
      color: 'red',
      createdAt: '2023-12-01',
      updatedAt: '2024-03-20'
    },
    { 
      id: '5', 
      name: 'Audio-Visuel', 
      description: 'Support technique et audiovisuel',
      leader: 'Sophie Leroy',
      leaderEmail: 'sophie.leroy@compassion.org',
      memberCount: 5,
      active: true,
      color: 'amber',
      createdAt: '2024-02-01',
      updatedAt: '2024-03-15'
    },
    { 
      id: '6', 
      name: 'Sécurité', 
      description: 'Sécurité et gestion des accès',
      leader: 'Lucas Moreau',
      leaderEmail: 'lucas.moreau@compassion.org',
      memberCount: 4,
      active: false,
      color: 'cyan',
      createdAt: '2024-01-20',
      updatedAt: '2024-03-10'
    }
  ];

  const stats = {
    total: departments.length,
    active: departments.filter(d => d.active).length,
    inactive: departments.filter(d => !d.active).length,
    totalMembers: departments.reduce((sum, dept) => sum + dept.memberCount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="text-blue-600 dark:text-blue-400" size={28} />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {ADMIN_ROUTES.admin_departments.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {ADMIN_ROUTES.admin_departments.description}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
              <Plus size={18} />
              <span>Nouveau département</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total départements</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Membres total</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalMembers}</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Inactifs</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.inactive}</p>
                </div>
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des départements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Département</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Responsable</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Membres</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Statut</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Date création</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {departments.map(dept => (
                  <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          dept.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                          dept.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                          dept.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                          dept.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                          dept.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                          'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                        }`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{dept.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{dept.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{dept.leader}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{dept.leaderEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800 dark:text-white">{dept.memberCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dept.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {dept.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                      {new Date(dept.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors">
                          Modifier
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                          Voir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDepartmentsPage;