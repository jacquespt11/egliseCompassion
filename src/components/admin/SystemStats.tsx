import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Home, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  XCircle,
  BarChart3,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

interface ChartData {
  labels: string[];
  reservations: number[];
  users: number[];
}

const SystemStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalReservations: 0,
    pendingApprovals: 0,
    activeToday: 0,
    cancellationRate: 0,
    averageUsage: 0,
    peakHours: [] as string[],
  });

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    reservations: [],
    users: []
  });
  const [loading, setLoading] = useState(true);

  // Données de démonstration
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      // Simulation de chargement
      setTimeout(() => {
        setStats({
          totalUsers: 42,
          totalRooms: 12,
          totalReservations: 156,
          pendingApprovals: 8,
          activeToday: 18,
          cancellationRate: 12.5,
          averageUsage: 67.8,
          peakHours: ['10:00', '14:00', '19:00'],
        });

        // Générer des données de graphique en fonction de la période
        let labels = [];
        let reservations = [];
        let users = [];

        if (timeRange === 'week') {
          labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
          reservations = [12, 19, 8, 15, 22, 10, 14];
          users = [4, 7, 3, 6, 9, 2, 5];
        } else if (timeRange === 'month') {
          labels = Array.from({ length: 4 }, (_, i) => `Sem ${i + 1}`);
          reservations = [45, 52, 38, 41];
          users = [15, 18, 12, 16];
        } else {
          labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
          reservations = [120, 135, 145, 130, 165, 180, 195, 210, 190, 200, 185, 175];
          users = [25, 28, 30, 32, 35, 38, 40, 42, 41, 45, 43, 46];
        }

        setChartData({ labels, reservations, users });
        setLoading(false);
      }, 1000);
    };

    fetchStats();
  }, [timeRange]);

  const statCards: StatCard[] = [
    {
      id: 'users',
      title: 'Utilisateurs Actifs',
      value: stats.totalUsers,
      change: 12,
      icon: <Users className="text-white" size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      description: 'Responsables de départements'
    },
    {
      id: 'rooms',
      title: 'Salles Disponibles',
      value: stats.totalRooms,
      change: 0,
      icon: <Home className="text-white" size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      description: 'Locaux gérés'
    },
    {
      id: 'reservations',
      title: 'Réservations Totales',
      value: stats.totalReservations,
      change: 8.5,
      icon: <Calendar className="text-white" size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      description: 'Depuis le début'
    },
    {
      id: 'pending',
      title: 'En Attente',
      value: stats.pendingApprovals,
      change: -2,
      icon: <Clock className="text-white" size={24} />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      description: 'Approbations nécessaires'
    },
    {
      id: 'active',
      title: 'Actifs Aujourd\'hui',
      value: stats.activeToday,
      change: 15,
      icon: <TrendingUp className="text-white" size={24} />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      description: 'Réservations du jour'
    },
    {
      id: 'cancellation',
      title: 'Taux d\'Annulation',
      value: `${stats.cancellationRate}%`,
      change: -1.2,
      icon: <XCircle className="text-white" size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-500',
      description: 'Moyenne mensuelle'
    }
  ];

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  const handleExportReport = () => {
    // Logique d'export du rapport
    console.log('Exporting system report...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Statistiques du Système</h2>
          <p className="text-gray-600">Vue d'ensemble des performances et statistiques</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === 'week' ? 'Semaine' : range === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.description}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                {card.icon}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(card.change)}`}>
                <span>{getTrendIcon(card.change)}</span>
                <span>{Math.abs(card.change)}%</span>
              </div>
              <span className="text-xs text-gray-500">vs période précédente</span>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques et métriques avancées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des réservations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Activité des Réservations</h3>
              <p className="text-sm text-gray-500">Évolution sur la période</p>
            </div>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          
          <div className="h-64 flex items-end gap-2 pt-8">
            {chartData.reservations.map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-90"
                  style={{ height: `${(value / Math.max(...chartData.reservations)) * 100}%` }}
                  title={`${value} réservations`}
                />
                <div className="mt-2 text-xs text-gray-500 text-center">
                  {chartData.labels[index]}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Réservations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Utilisateurs actifs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques avancées */}
        <div className="space-y-6">
          {/* Taux d'occupation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Taux d'Occupation</h3>
              <div className="text-2xl font-bold text-blue-600">
                {stats.averageUsage}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-4 rounded-full transition-all duration-500"
                style={{ width: `${stats.averageUsage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Moyenne d'utilisation des salles
            </p>
          </div>

          {/* Heures de pointe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Heures de Pointe</h3>
            <div className="space-y-3">
              {stats.peakHours.map((hour, index) => (
                <div key={hour} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 
                        ? 'bg-red-100 text-red-600'
                        : index === 1
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{hour}</span>
                  </div>
                  <span className="text-gray-500">Forte demande</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes système */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-amber-600" size={24} />
              <h3 className="font-semibold text-amber-800">Alertes Actives</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                <span>
                  <strong>{stats.pendingApprovals} approbations</strong> en attente
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <span>
                  <strong>2 salles</strong> en maintenance cette semaine
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <span>
                  <strong>Système</strong> opérationnel à 100%
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Résumé des départements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Activité par Département</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Département</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Réservations</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Utilisateurs</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Taux d'Usage</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Musique', reservations: 45, users: 8, usage: 85, status: 'Actif' },
                { name: 'Enfance', reservations: 38, users: 6, usage: 72, status: 'Actif' },
                { name: 'Accueil', reservations: 28, users: 5, usage: 65, status: 'Actif' },
                { name: 'Media', reservations: 22, users: 4, usage: 58, status: 'Modéré' },
                { name: 'Administration', reservations: 15, users: 3, usage: 45, status: 'Faible' },
              ].map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.reservations}</td>
                  <td className="py-3 px-4">{dept.users}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${dept.usage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{dept.usage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dept.status === 'Actif'
                        ? 'bg-green-100 text-green-800'
                        : dept.status === 'Modéré'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;