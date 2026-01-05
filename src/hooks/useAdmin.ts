import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ApprovalRequest, AuditLogEntry, SystemStats, AdminNotification } from '../types/admin';
import type { Department } from '../types/user';

export function useAdmin() {
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovalRequests = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRequests: ApprovalRequest[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'Jean Kenge',
          userEmail: 'jean.kenge@example.com',
          department: 'Musique',
          status: 'pending',
          submittedAt: '2024-01-10T10:00:00Z',
          createdAt: '2024-01-10T08:30:00Z',
          type: 'USER_REGISTRATION'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Marie Curie',
          userEmail: 'marie@example.com',
          department: 'Sciences',
          roomId: 'room1',
          roomName: 'Salle de conférence',
          date: '2024-01-15',
          startTime: '14:00',
          endTime: '16:00',
          purpose: 'Réunion importante',
          status: 'pending',
          submittedAt: '2024-01-11T09:30:00Z',
          createdAt: '2024-01-10T08:30:00Z',
          type: 'RESERVATION'
        }
      ];
      
      setApprovalRequests(mockRequests);
      return mockRequests;
    } catch (error) {
      toast.error('Erreur lors du chargement des demandes');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveRequest = useCallback(async (requestId: string, notes?: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovalRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
              comments: notes
            }
          : req
      ));
      
      toast.success('Demande approuvée avec succès');
      return true;
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectRequest = useCallback(async (requestId: string, reason: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApprovalRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin',
              comments: reason
            }
          : req
      ));
      
      toast.success('Demande refusée avec succès');
      return true;
    } catch (error) {
      toast.error('Erreur lors du refus');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSystemStats = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStats: SystemStats = {
        totalRooms: 24,
        totalReservations: 478,
        pendingApprovals: 8,
        totalUsers: 156,
        activeReservations: 120,
        availableRooms: 18,
        upcomingMaintenance: 2,
        systemHealth: 98.5
      };
      
      setSystemStats(mockStats);
      return mockStats;
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuditLogs = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLogs: AuditLogEntry[] = Array.from({ length: limit }, (_, i) => ({
        id: `${page}-${i}`,
        entityId: `entity-${i}`, // Propriété manquante ajoutée
        userId: `user${i}`,
        userName: i === 0 ? 'Admin System' : `Utilisateur ${i}`,
        userEmail: i === 0 ? 'admin@compassion.org' : `user${i}@compassion.org`,
        department: i % 3 === 0 ? 'Administration' : i % 3 === 1 ? 'Chorale' : 'Technique',
        entity: i % 4 === 0 ? 'USER' : i % 4 === 1 ? 'RESERVATION' : i % 4 === 2 ? 'ROOM' : 'DEPARTMENT',
        action: i % 3 === 0 ? 'CREATE' : i % 3 === 1 ? 'UPDATE' : 'DELETE',
        details: `${i % 3 === 0 ? 'Création' : i % 3 === 1 ? 'Modification' : 'Suppression'} de ${i % 4 === 0 ? 'utilisateur' : i % 4 === 1 ? 'réservation' : i % 4 === 2 ? 'salle' : 'département'}`,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        ipAddress: `192.168.1.${i}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }));
      
      setAuditLogs(mockLogs);
      return mockLogs;
    } catch (error) {
      toast.error('Erreur lors du chargement des logs');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: AdminNotification[] = [
        {
          id: '1',
          type: 'APPROVAL',
          title: 'Nouvelle inscription en attente',
          message: 'Blaise Makaba souhaite rejoindre le département Musique',
          read: false,
          priority: 'HIGH',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          timestamp: new Date(Date.now() - 3600000).toISOString(), // Propriété manquante ajoutée
          actionRequired: true, // Propriété manquante ajoutée
          actionUrl: '/admin/approvals',
          relatedId: '1'
        },
        {
          id: '2',
          type: 'SYSTEM', 
          title: 'Salle en maintenance',
          message: 'La salle de conférence A est en maintenance jusqu\'à demain',
          read: true,
          priority: 'MEDIUM',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          timestamp: new Date(Date.now() - 7200000).toISOString(), // Propriété manquante ajoutée
          actionRequired: false // Propriété manquante ajoutée
        }
      ];
      
      setNotifications(mockNotifications);
      return mockNotifications;
    } catch (error) {
      toast.error('Erreur lors du chargement des notifications');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  }, []);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDepartments: Department[] = [
        {
          id: '1',
          name: 'Chorale 2',
          description: 'Département d\'adoration et de louange',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jeunesse',
          description: 'Activités pour les jeunes',
          createdAt: '2023-02-20T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z'
        }
      ];
      
      setDepartments(mockDepartments);
      return mockDepartments;
    } catch (error) {
      toast.error('Erreur lors du chargement des départements');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useState(() => {
    fetchSystemStats();
    fetchNotifications();
    fetchDepartments();
  });

  return {
    // État
    approvalRequests,
    auditLogs,
    systemStats,
    notifications,
    departments,
    loading,
    
    // Méthodes
    fetchApprovalRequests,
    approveRequest,
    rejectRequest,
    fetchSystemStats,
    fetchAuditLogs,
    fetchNotifications,
    markNotificationAsRead,
    fetchDepartments,
  };
}