import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Home, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Bell,
  BarChart3,
  Download,
  ChevronRight,
  Eye
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import ApprovalQueue from './ApprovalQueue';
import AdminNotification from './AdminNotification';
import SystemStats from './SystemStats';
import AuditLog from './AuditLog';

interface RecentActivity {
  id: string;
  type: 'reservation' | 'user' | 'system';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
  status?: 'success' | 'warning' | 'error';
}

interface DashboardStats {
  pendingApprovals: number;
  activeReservations: number;
  availableRooms: number;
  totalUsers: number;
  occupancyRate: number;
  avgResponseTime: string;
}

const AdminDashboard: React.FC = () => {
  // Mock user data instead of useAuth hook
  const user = {
    name: 'Admin System',
    email: 'admin@compassion.org'
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'notifications' | 'audit'>('overview');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');
  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'reservation',
      action: 'Nouvelle réservation',
      user: 'Eric Matumona',
      timestamp: '2024-01-15T14:30:00Z',
      status: 'success'
    },
    {
      id: '2',
      type: 'user',
      action: 'Nouvel utilisateur',
      user: 'Didier Zola',
      timestamp: '2024-01-15T09:15:00Z',
      details: 'Département: Enfance',
      status: 'success'
    },
    {
      id: '3',
      type: 'system',
      action: 'Maintenance planifiée',
      user: 'Système',
      timestamp: '2024-01-14T16:45:00Z',
      status: 'warning'
    },
    {
      id: '4',
      type: 'reservation',
      action: 'Réservation annulée',
      user: 'Pierre Molenda',
      timestamp: '2024-01-14T11:20:00Z',
      status: 'error'
    },
    {
      id: '5',
      type: 'user',
      action: 'Profil mis à jour',
      user: 'Sophie Bolela',
      timestamp: '2024-01-13T15:10:00Z',
      status: 'success'
    }
  ]);

  const [quickStats] = useState<DashboardStats>({
    pendingApprovals: 8,
    activeReservations: 18,
    availableRooms: 9,
    totalUsers: 42,
    occupancyRate: 67.8,
    avgResponseTime: '2.5h'
  });

  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // Générer les jours du mois courant pour le calendrier
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });
    setCalendarDays(days);
  }, []);

  const getDayClass = (day: Date) => {
    const baseClass = 'w-10 h-10 flex items-center justify-center rounded-full transition-colors';
    
    if (isSameDay(day, selectedDate)) {
      return `${baseClass} bg-blue-600 text-white`;
    }
    
    if (day.getDay() === 0 || day.getDay() === 6) {
      return `${baseClass} text-gray-400 hover:bg-gray-100`;
    }
    
    return `${baseClass} text-gray-700 hover:bg-gray-100`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'reservation': return <Calendar className="text-blue-600" size={16} />;
      case 'user': return <Users className="text-green-600" size={16} />;
      case 'system': return <AlertCircle className="text-amber-600" size={16} />;
      default: return <Bell className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status?: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-amber-600 bg-amber-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const isCurrentDay = (day: Date) => {
    const today = new Date();
    return isSameDay(day, today);
  };

  const handleExportData = () => {
    // Logique d'export des données
    console.log('Exporting dashboard data...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord Administrateur</h1>
              <p className="text-gray-600">
                Bonjour, {user?.name} • {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['today', 'week', 'month'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      dateRange === range
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === 'today' ? 'Aujourd\'hui' : range === 'week' ? 'Semaine' : 'Mois'}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={18} />
                Exporter
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 -mb-px">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 size={18} /> },
              { id: 'approvals', label: 'Approbations', icon: <CheckCircle size={18} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
              { id: 'audit', label: 'Journal', icon: <Eye size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'En attente',
                    value: quickStats.pendingApprovals,
                    icon: <Clock className="text-amber-600" size={24} />,
                    color: 'bg-amber-50',
                    change: '+2',
                    description: 'Approbations'
                  },
                  {
                    title: 'Actives aujourd\'hui',
                    value: quickStats.activeReservations,
                    icon: <Calendar className="text-blue-600" size={24} />,
                    color: 'bg-blue-50',
                    change: '+15%',
                    description: 'Réservations'
                  },
                  {
                    title: 'Salles disponibles',
                    value: quickStats.availableRooms,
                    icon: <Home className="text-green-600" size={24} />,
                    color: 'bg-green-50',
                    change: '+1',
                    description: 'Sur 12 total'
                  },
                  {
                    title: 'Taux d\'occupation',
                    value: `${quickStats.occupancyRate}%`,
                    icon: <TrendingUp className="text-purple-600" size={24} />,
                    color: 'bg-purple-50',
                    change: '+5.2%',
                    description: 'Moyenne'
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        {stat.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grille principale */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activités récentes */}
                <div className="lg:col-span-2 space-y-6">
                  <SystemStats />
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Activités Récentes</h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Voir tout
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="pt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-medium text-gray-800">{activity.action}</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {format(new Date(activity.timestamp), 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Par {activity.user}</span>
                              {activity.status && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                  {activity.status === 'success' ? 'Réussi' :
                                   activity.status === 'warning' ? 'Avertissement' : 'Erreur'}
                                </span>
                              )}
                            </div>
                            {activity.details && (
                              <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Calendrier mini */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Calendrier</h3>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => (
                        <div key={day} className="text-center text-sm text-gray-500 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(day)}
                          className={getDayClass(day)}
                        >
                          <span className={`text-sm ${isCurrentDay(day) && !isSameDay(day, selectedDate) ? 'text-blue-600 font-bold' : ''}`}>
                            {format(day, 'd')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats rapides */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Stats Rapides</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temps réponse moyen</span>
                        <span className="font-medium">{quickStats.avgResponseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Utilisateurs totaux</span>
                        <span className="font-medium">{quickStats.totalUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Taux d'annulation</span>
                        <span className="font-medium text-red-600">12.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Heure de pointe</span>
                        <span className="font-medium">14:00-16:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions rapides */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-white mb-4">Actions Rapides</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                        <span className="text-white">Gérer les utilisateurs</span>
                        <ChevronRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                        <span className="text-white">Voir les rapports</span>
                        <ChevronRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group">
                        <span className="text-white">Paramètres système</span>
                        <ChevronRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'approvals' && (
            <ApprovalQueue 
              requests={[]}
              loading={false}
              onApprove={async (requestId: string, notes?: string) => {
                console.log('Approve:', requestId, notes);
              }}
              onReject={async (requestId: string, reason: string) => {
                console.log('Reject:', requestId, reason);
              }}
              onViewDetails={(request) => {
                console.log('View details:', request);
              }}
            />
          )}
          {activeTab === 'notifications' && <AdminNotification />}
          {activeTab === 'audit' && <AuditLog />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;