import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  department: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  entity: 'RESERVATION' | 'USER' | 'ROOM' | 'PROFILE';
  entityId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  action: string;
  entity: string;
  userId: string;
}

const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
    },
    action: '',
    entity: '',
    userId: ''
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Données de démonstration
  const mockLogs: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      userId: 'user1',
      userName: 'Julia Ebusa',
      userEmail: 'julia@compassion.org',
      department: 'Protocole',
      action: 'CREATE',
      entity: 'RESERVATION',
      entityId: 'res_001',
      details: 'Réservation de la salle A pour répétition',
      ipAddress: '192.168.1.100',
      userAgent: 'Chrome/120.0.0.0'
    },
    {
      id: '2',
      timestamp: '2024-01-15T11:15:00Z',
      userId: 'admin1',
      userName: 'Admin System',
      userEmail: 'admin@compassion.org',
      department: 'Administration',
      action: 'APPROVE',
      entity: 'RESERVATION',
      entityId: 'res_001',
      details: 'Réservation approuvée avec commentaire: "OK"',
      ipAddress: '192.168.1.1',
      userAgent: 'Safari/17.0'
    },
    {
      id: '3',
      timestamp: '2024-01-14T14:20:00Z',
      userId: 'user2',
      userName: 'Rhenard Bonkhey',
      userEmail: 'rhenard@compassion.org',
      department: 'Genius hub',
      action: 'UPDATE',
      entity: 'PROFILE',
      entityId: 'profile_001',
      details: 'Mise à jour des informations de contact',
      ipAddress: '192.168.1.150',
      userAgent: 'Firefox/121.0'
    },
    {
      id: '4',
      timestamp: '2024-01-14T16:45:00Z',
      userId: 'user3',
      userName: 'Pierre Martin',
      userEmail: 'pierre@compassion.org',
      department: 'Evangélistion',
      action: 'CREATE',
      entity: 'RESERVATION',
      entityId: 'res_002',
      details: 'Demande de réservation salle B - Réunion équipe',
      ipAddress: '192.168.1.200',
      userAgent: 'Edge/120.0.0.0'
    },
    {
      id: '5',
      timestamp: '2024-01-13T09:10:00Z',
      userId: 'admin1',
      userName: 'Admin System',
      userEmail: 'admin@compassion.org',
      department: 'Administration',
      action: 'REJECT',
      entity: 'RESERVATION',
      entityId: 'res_003',
      details: 'Réservation refusée: conflit horaire',
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome/120.0.0.0'
    }
  ];

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      setLogs(mockLogs);
      setFilteredLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterLogs();
  }, [filters, searchTerm]);

  const filterLogs = () => {
    let filtered = [...logs];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.userName.toLowerCase().includes(term) ||
        log.userEmail.toLowerCase().includes(term) ||
        log.department.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term)
      );
    }

    // Filtre par action
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Filtre par entité
    if (filters.entity) {
      filtered = filtered.filter(log => log.entity === filters.entity);
    }

    // Filtre par date
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Edit size={16} className="text-green-600" />;
      case 'UPDATE': return <Edit size={16} className="text-blue-600" />;
      case 'DELETE': return <XCircle size={16} className="text-red-600" />;
      case 'APPROVE': return <CheckCircle size={16} className="text-green-600" />;
      case 'REJECT': return <XCircle size={16} className="text-red-600" />;
      default: return <Eye size={16} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-50 text-green-700 border-green-200';
      case 'UPDATE': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-50 text-red-700 border-red-200';
      case 'APPROVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECT': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'RESERVATION': return <Calendar size={14} />;
      case 'USER': return <User size={14} />;
      default: return <Eye size={14} />;
    }
  };

  const handleExport = () => {
    // Logique d'export CSV
    console.log('Exporting logs...');
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* En-tête avec filtres */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Journal d'activités</h2>
            <p className="text-gray-600">Suivi complet des actions système</p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Exporter CSV
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes les actions</option>
                <option value="CREATE">Création</option>
                <option value="UPDATE">Modification</option>
                <option value="DELETE">Suppression</option>
                <option value="APPROVE">Approbation</option>
                <option value="REJECT">Rejet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entité</label>
              <select
                value={filters.entity}
                onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Toutes les entités</option>
                <option value="RESERVATION">Réservation</option>
                <option value="USER">Utilisateur</option>
                <option value="ROOM">Salle</option>
                <option value="PROFILE">Profil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des logs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date/Heure</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Utilisateur</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Action</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Détails</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm">
                      {format(parseISO(log.timestamp), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                    <Clock size={14} className="text-gray-400 ml-2" />
                    <span className="text-sm">
                      {format(parseISO(log.timestamp), 'HH:mm', { locale: fr })}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-sm text-gray-500">{log.department}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      {getEntityIcon(log.entity)}
                      <span className="text-xs">{log.entity}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs truncate" title={log.details}>
                    {log.details}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {log.entityId}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Eye size={14} />
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Affichage de {filteredLogs.length} sur {logs.length} entrées
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
            Précédent
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </div>

      {/* Modal Détails */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Détails du log</h3>
                  <p className="text-gray-600">ID: {selectedLog.id}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Heure</label>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {format(parseISO(selectedLog.timestamp), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <div className="p-2 bg-gray-50 rounded-lg">{selectedLog.ipAddress}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                    <div><strong>Nom:</strong> {selectedLog.userName}</div>
                    <div><strong>Email:</strong> {selectedLog.userEmail}</div>
                    <div><strong>Département:</strong> {selectedLog.department}</div>
                    <div><strong>User ID:</strong> {selectedLog.userId}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {getActionIcon(selectedLog.action)}
                    <span className={`px-3 py-1 rounded-full font-medium ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action} - {selectedLog.entity}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Détails complets</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {selectedLog.details}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedLog.userAgent}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;