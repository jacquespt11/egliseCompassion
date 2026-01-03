import React from 'react';
import { Activity, Search, Filter, Download, Eye, User as UserIcon, Building2, Calendar } from 'lucide-react';
import type { User as UserType } from '../types/user';
import type { AuditLogEntry } from '../types/admin';
import { ADMIN_ROUTES } from '../utils/adminRoutes';

interface AdminAuditPageProps {
  user: UserType | null;
}

const AdminAuditPage: React.FC<AdminAuditPageProps> = ({ user }) => {
  const auditLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-03-20T10:30:00',
      userId: '2',
      userName: 'Jean Dupont',
      userEmail: 'jean.dupont@compassion.org',
      department: 'Musique',
      action: 'CREATE',
      entity: 'RESERVATION',
      entityId: 'res_123',
      details: 'Nouvelle réservation pour la salle de musique',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/91.0'
    },
    {
      id: '2',
      timestamp: '2024-03-20T09:15:00',
      userId: '1',
      userName: 'Admin System',
      userEmail: 'admin@compassion.org',
      department: 'Administration',
      action: 'APPROVE',
      entity: 'USER',
      entityId: 'user_456',
      details: 'Approvision du compte de Marie Martin',
      ipAddress: '192.168.1.1',
      userAgent: 'Firefox/89.0'
    },
    {
      id: '3',
      timestamp: '2024-03-19T14:20:00',
      userId: '3',
      userName: 'Marie Martin',
      userEmail: 'marie.martin@compassion.org',
      department: 'Jeunesse',
      action: 'UPDATE',
      entity: 'PROFILE',
      entityId: 'profile_789',
      details: 'Mise à jour du profil utilisateur',
      ipAddress: '192.168.1.101',
      userAgent: 'Safari/14.0'
    },
    {
      id: '4',
      timestamp: '2024-03-19T11:45:00',
      userId: '1',
      userName: 'Admin System',
      userEmail: 'admin@compassion.org',
      department: 'Administration',
      action: 'DELETE',
      entity: 'RESERVATION',
      entityId: 'res_456',
      details: 'Suppression d\'une réservation annulée',
      ipAddress: '192.168.1.1',
      userAgent: 'Firefox/89.0'
    },
    {
      id: '5',
      timestamp: '2024-03-18T16:30:00',
      userId: '4',
      userName: 'Pierre Durand',
      userEmail: 'pierre.durand@compassion.org',
      department: 'Accueil',
      action: 'CREATE',
      entity: 'RESERVATION',
      entityId: 'res_789',
      details: 'Réservation pour réunion d\'équipe',
      ipAddress: '192.168.1.102',
      userAgent: 'Chrome/91.0'
    }
  ];

  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString()).length,
    creates: auditLogs.filter(log => log.action === 'CREATE').length,
    updates: auditLogs.filter(log => log.action === 'UPDATE').length,
    deletes: auditLogs.filter(log => log.action === 'DELETE').length,
    approvals: auditLogs.filter(log => log.action === 'APPROVE' || log.action === 'REJECT').length
  };

  const getActionIcon = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'CREATE': return <span className="text-green-500">+</span>;
      case 'UPDATE': return <span className="text-blue-500">↻</span>;
      case 'DELETE': return <span className="text-red-500">×</span>;
      case 'APPROVE': return <span className="text-green-500">✓</span>;
      case 'REJECT': return <span className="text-red-500">✗</span>;
      default: return <span>•</span>;
    }
  };

  const getActionColor = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'UPDATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'APPROVE': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'REJECT': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getEntityIcon = (entity: AuditLogEntry['entity']) => {
    switch (entity) {
      case 'USER': return <UserIcon className="w-4 h-4" />;
      case 'DEPARTMENT': return <Building2 className="w-4 h-4" />;
      case 'RESERVATION': return <Calendar className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-blue-600 dark:text-blue-400" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {ADMIN_ROUTES.admin_audit.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {ADMIN_ROUTES.admin_audit.description}
              </p>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les logs..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter size={18} />
                <span>Filtrer</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download size={18} />
                <span>Exporter</span>
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total logs</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Créations</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.creates}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Mises à jour</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.updates}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Suppressions</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.deletes}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Approbations</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approvals}</p>
            </div>
          </div>
        </div>

        {/* Tableau des logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Utilisateur</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Entité</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Détails</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Date/Heure</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                          {getActionIcon(log.action)}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{log.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{log.department}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entity)}
                        <span className="text-gray-800 dark:text-white">{log.entity}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{log.details}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        IP: {log.ipAddress} • {log.userAgent}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-800 dark:text-white">
                          {new Date(log.timestamp).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {auditLogs.length === 0 && (
            <div className="py-12 text-center">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Aucun log d'activité
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Aucune activité enregistrée pour le moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuditPage;