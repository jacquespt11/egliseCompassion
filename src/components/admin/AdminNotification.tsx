import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  Home,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import type { ApprovalRequest } from '../../types/admin';

interface Notification {
  id: string;
  type: 'APPROVAL' | 'SYSTEM' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: boolean;
  metadata?: {
    reservationId?: string;
    userId?: string;
    roomId?: string;
    department?: string;
  };
}

// Interface étendue pour les demandes d'approbation avec propriétés de réservation
interface ReservationApprovalRequest extends Omit<ApprovalRequest, 'status'> {
  status: 'pending' | 'approved' | 'rejected';
  roomName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
}

const AdminNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [approvalQueue, setApprovalQueue] = useState<ReservationApprovalRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'approvals'>('all');
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  // Données de démonstration
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulation de chargement
      setTimeout(() => {
        setNotifications([
          {
            id: '1',
            type: 'APPROVAL',
            title: 'Nouvelle réservation en attente',
            message: 'Jean Dupont (Musique) a demandé la salle A',
            timestamp: '2024-01-15T14:30:00Z',
            read: false,
            priority: 'HIGH',
            actionRequired: true,
            metadata: {
              reservationId: 'res_001',
              userId: 'user1',
              roomId: 'room_a',
              department: 'Musique'
            }
          },
          {
            id: '2',
            type: 'SYSTEM',
            title: 'Maintenance planifiée',
            message: 'Maintenance système prévue ce weekend',
            timestamp: '2024-01-15T10:15:00Z',
            read: false,
            priority: 'MEDIUM',
            actionRequired: false
          },
          {
            id: '3',
            type: 'WARNING',
            title: 'Conflit d\'horaire détecté',
            message: 'Deux réservations simultanées pour la salle B',
            timestamp: '2024-01-14T16:45:00Z',
            read: true,
            priority: 'HIGH',
            actionRequired: true
          },
          {
            id: '4',
            type: 'INFO',
            title: 'Nouvel utilisateur inscrit',
            message: 'Marie Curie (Enfance) a créé un compte',
            timestamp: '2024-01-14T09:20:00Z',
            read: true,
            priority: 'LOW',
            actionRequired: false,
            metadata: {
              userId: 'user2',
              department: 'Enfance'
            }
          },
          {
            id: '5',
            type: 'APPROVAL',
            title: 'Demande de modification',
            message: 'Pierre Martin souhaite modifier sa réservation',
            timestamp: '2024-01-13T11:10:00Z',
            read: true,
            priority: 'MEDIUM',
            actionRequired: true
          }
        ]);

        setApprovalQueue([
          {
            id: '1',
            userId: 'user1',
            userName: 'Julia',
            userEmail: 'julia@compassion.org',
            department: 'Protocole',
            roomName: 'Salle A - Auditorium',
            date: '2024-01-20',
            startTime: '14:00',
            endTime: '16:00',
            purpose: 'Répétition',
            submittedAt: '2024-01-15T14:30:00Z',
            createdAt: '2024-01-10T08:30:00Z',
            status: 'pending', 
            type: 'RESERVATION'
          },
          {
            id: '2',
            userId: 'user3',
            userName: 'Sophie Bernard',
            userEmail: 'sophie@compassion.org',
            department: 'Media',
            roomName: 'Salle B - Studio',
            date: '2024-01-18',
            startTime: '10:00',
            endTime: '12:00',
            purpose: 'Enregistrement podcast',
            submittedAt: '2024-01-15T09:15:00Z',
            createdAt: '2024-01-10T08:30:00Z',
            status: 'pending', // CORRIGÉ: 'PENDING' -> 'pending'
            type: 'RESERVATION' // Ajout de la propriété manquante
          },
          {
            id: '3',
            userId: 'user4',
            userName: 'Thomas Petit',
            userEmail: 'thomas@compassion.org',
            department: 'Enfance',
            roomName: 'Salle C - Salle de jeu',
            date: '2024-01-22',
            startTime: '15:00',
            endTime: '17:00',
            purpose: 'Réunion des moniteurs',
            submittedAt: '2024-01-14T16:20:00Z',
            createdAt: '2024-01-10T08:30:00Z',
            status: 'pending', // CORRIGÉ: 'PENDING' -> 'pending'
            type: 'RESERVATION' // Ajout de la propriété manquante
          }
        ]);

        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'approvals') return notification.type === 'APPROVAL';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const approvalCount = notifications.filter(n => n.type === 'APPROVAL' && !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'APPROVAL': return <Clock className="text-amber-600" size={20} />;
      case 'SYSTEM': return <AlertCircle className="text-blue-600" size={20} />;
      case 'WARNING': return <AlertCircle className="text-red-600" size={20} />;
      case 'INFO': return <Bell className="text-green-600" size={20} />;
      default: return <Bell className="text-gray-600" size={20} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'HIGH': return 'border-l-4 border-l-red-500';
      case 'MEDIUM': return 'border-l-4 border-l-amber-500';
      case 'LOW': return 'border-l-4 border-l-blue-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setShowMarkAllModal(false);
  };

  const handleApproveReservation = (id: string) => {
    // Logique d'approbation
    setApprovalQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'approved' } : item // CORRIGÉ: 'APPROVED' -> 'approved'
      )
    );
    
    // Marquer la notification comme lue
    const notificationId = notifications.find(n => 
      n.metadata?.reservationId === id || n.id === id
    )?.id;
    if (notificationId) handleMarkAsRead(notificationId);
  };

  const handleRejectReservation = (id: string) => {
    // Logique de rejet
    setApprovalQueue(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'rejected' } : item // CORRIGÉ: 'REJECTED' -> 'rejected'
      )
    );
    
    // Marquer la notification comme lue
    const notificationId = notifications.find(n => 
      n.metadata?.reservationId === id || n.id === id
    )?.id;
    if (notificationId) handleMarkAsRead(notificationId);
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
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
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              <p className="text-gray-600">
                {unreadCount} non-lue{unreadCount !== 1 ? 's' : ''} • {approvalCount} approbation{approvalCount !== 1 ? 's' : ''} en attente
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMarkAllModal(true)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={unreadCount === 0}
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 -mb-px">
          {[
            { id: 'all', label: 'Toutes', count: notifications.length },
            { id: 'unread', label: 'Non lues', count: unreadCount },
            { id: 'approvals', label: 'Approbations', count: approvalCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-500">
              {activeTab === 'unread' 
                ? 'Toutes les notifications sont lues'
                : activeTab === 'approvals'
                ? 'Aucune approbation en attente'
                : 'Aucune notification disponible'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${getPriorityColor(notification.priority)} ${
                !notification.read ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-gray-600">{notification.message}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {format(parseISO(notification.timestamp), 'dd/MM à HH:mm', { locale: fr })}
                      </span>
                      <button
                        onClick={() => handleViewDetails(notification)}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {notification.metadata && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {notification.metadata.reservationId && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          <Calendar size={12} />
                          Réservation: {notification.metadata.reservationId}
                        </span>
                      )}
                      {notification.metadata.userId && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          <User size={12} />
                          {notification.metadata.department || 'Utilisateur'}
                        </span>
                      )}
                      {notification.metadata.roomId && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          <Home size={12} />
                          {notification.metadata.roomId}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {notification.actionRequired && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Action requise:</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            Marquer comme lu
                          </button>
                          {notification.type === 'APPROVAL' && notification.metadata?.reservationId && (
                            <>
                              <button
                                onClick={() => handleApproveReservation(notification.metadata!.reservationId!)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              >
                                <Check size={14} />
                                Approuver
                              </button>
                              <button
                                onClick={() => handleRejectReservation(notification.metadata!.reservationId!)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              >
                                <X size={14} />
                                Rejeter
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* File d'attente des approbations (si tab approprié) */}
      {activeTab === 'approvals' && approvalQueue.filter(item => item.status === 'pending').length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">File d'attente des approbations</h3>
          <div className="space-y-4">
            {approvalQueue.filter(item => item.status === 'pending').map((item) => (
              <div
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <User className="text-gray-400" size={18} />
                      <span className="font-medium">{item.userName}</span>
                      <span className="text-sm text-gray-500">({item.department})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {item.date && format(parseISO(item.date), 'dd MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {item.startTime} - {item.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={14} />
                        {item.roomName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveReservation(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleRejectReservation(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <XCircle size={18} />
                      Rejeter
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  <strong>Motif:</strong> {item.purpose}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Soumis le {format(parseISO(item.submittedAt), 'dd/MM à HH:mm', { locale: fr })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Marquer tout comme lu */}
      <ConfirmationModal
        isOpen={showMarkAllModal}
        onClose={() => setShowMarkAllModal(false)}
        onConfirm={handleMarkAllAsRead}
        title="Marquer toutes les notifications comme lues"
        message="Êtes-vous sûr de vouloir marquer toutes les notifications comme lues ? Cette action est réversible."
        confirmText="Marquer comme lu"
        cancelText="Annuler"
        type="info"
      />

      {/* Modal Détails de la notification */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <h3 className="text-xl font-bold text-gray-800">{selectedNotification.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-500 mb-1">Priorité</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedNotification.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : selectedNotification.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedNotification.priority === 'HIGH' ? 'Haute' :
                         selectedNotification.priority === 'MEDIUM' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Date</label>
                      <span>
                        {format(parseISO(selectedNotification.timestamp), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Statut</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedNotification.read
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedNotification.read ? 'Lu' : 'Non lu'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">Action requise</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedNotification.actionRequired
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedNotification.actionRequired ? 'Oui' : 'Non'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedNotification.metadata && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Informations supplémentaires</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                {!selectedNotification.read && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotification;