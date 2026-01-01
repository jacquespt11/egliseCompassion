import { useState, useCallback } from 'react';
import type { Reservation, CreateReservationDto } from '../types/reservation';
import { useAuth } from './useAuth';

export function useReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = useCallback(async (data: CreateReservationDto) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        userId: user?.id || 'current-user-id',
        userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Utilisateur',
        userEmail: user?.email || '',
        department: user?.department || '',
        status: 'EN_ATTENTE',
        date: data.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        startTime: data.startDate?.split('T')[1]?.substring(0, 5) || '09:00',
        endTime: data.endDate?.split('T')[1]?.substring(0, 5) || '10:00',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setReservations(prev => [newReservation, ...prev]);
      return newReservation;
    } catch (err) {
      setError('Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateReservation = useCallback(async (id: string, updates: Partial<Reservation>) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => prev.map(reservation => 
        reservation.id === id 
          ? { 
              ...reservation, 
              ...updates, 
              updatedAt: new Date().toISOString()
            }
          : reservation
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => prev.map(reservation => 
        reservation.id === id 
          ? { 
              ...reservation, 
              status: 'ANNULEE', 
              updatedAt: new Date().toISOString()
            }
          : reservation
      ));
    } catch (err) {
      setError('Erreur lors de l\'annulation de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async (userId?: string, department?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mock avec toutes les propriétés requises
      const mockReservations: Reservation[] = [
        {
          id: '1',
          roomId: '1',
          userId: userId || 'user1',
          department: department || 'Développement',
          title: 'Réunion d\'équipe',
          description: 'Réunion hebdomadaire de l\'équipe',
          // Pour les réservations sur plusieurs jours
          startDate: new Date('2024-01-15T10:00:00').toISOString(),
          endDate: new Date('2024-01-15T12:00:00').toISOString(),
          // Pour les réservations sur une journée
          date: '2024-01-15',
          startTime: '10:00',
          endTime: '12:00',
          status: 'APPROUVEE',
          participants: 10,
          equipmentRequested: ['projector', 'whiteboard'],
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          roomName: 'Salle de conférence principale',
          userName: 'Jean Dupont',
          userEmail: 'jean.dupont@example.com',
          departmentName: 'Développement'
        },
        {
          id: '2',
          roomId: '2',
          userId: userId || 'user2',
          department: department || 'Formation',
          title: 'Formation React',
          description: 'Session de formation sur React et TypeScript',
          startDate: new Date('2024-01-16T14:00:00').toISOString(),
          endDate: new Date('2024-01-16T17:00:00').toISOString(),
          date: '2024-01-16',
          startTime: '14:00',
          endTime: '17:00',
          status: 'EN_ATTENTE',
          participants: 15,
          equipmentRequested: ['projector', 'whiteboard', 'wifi'],
          createdAt: new Date('2024-01-11').toISOString(),
          updatedAt: new Date('2024-01-11').toISOString(),
          roomName: 'Salle de formation',
          userName: 'Marie Curie',
          userEmail: 'marie.curie@example.com',
          departmentName: 'Formation'
        },
        {
          id: '3',
          roomId: '3',
          userId: userId || 'user3',
          department: department || 'Commercial',
          title: 'Présentation client',
          description: 'Présentation du nouveau produit',
          startDate: new Date('2024-01-17T09:00:00').toISOString(),
          endDate: new Date('2024-01-17T11:00:00').toISOString(),
          date: '2024-01-17',
          startTime: '09:00',
          endTime: '11:00',
          status: 'REFUSEE',
          participants: 8,
          equipmentRequested: ['projector', 'screen', 'sound_system'],
          createdAt: new Date('2024-01-12').toISOString(),
          updatedAt: new Date('2024-01-12').toISOString(),
          roomName: 'Salle de réunion VIP',
          userName: 'Pierre Martin',
          userEmail: 'pierre.martin@example.com',
          departmentName: 'Commercial',
          rejectionReason: 'Salle déjà réservée pour cet horaire'
        }
      ];
      
      // Filtrer par userId ou department si fournis
      const filteredReservations = mockReservations.filter(reservation => {
        if (userId && reservation.userId !== userId) return false;
        if (department && reservation.department !== department) return false;
        return true;
      });
      
      setReservations(filteredReservations);
      return filteredReservations;
    } catch (err) {
      setError('Erreur lors de la récupération des réservations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserReservations = useCallback(() => {
    if (!user) return [];
    return reservations.filter(reservation => 
      reservation.userId === user.id || 
      (user.department && reservation.department === user.department)
    );
  }, [reservations, user]);

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    cancelReservation,
    fetchReservations,
    getUserReservations,
  };
}