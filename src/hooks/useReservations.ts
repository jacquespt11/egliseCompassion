import { useState, useCallback } from 'react';
import type { Reservation, CreateReservationDto } from '../types/reservation';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = useCallback(async (data: CreateReservationDto) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        userId: 'current-user-id',
        status: 'EN_ATTENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setReservations(prev => [newReservation, ...prev]);
      return newReservation;
    } catch (err) {
      setError('Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (id: string, updates: Partial<Reservation>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, ...updates, updatedAt: new Date() }
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
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'ANNULEE', updatedAt: new Date() }
          : reservation
      ));
    } catch (err) {
      setError('Erreur lors de l\'annulation de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async (userId?: string, departmentId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mock pour le moment
      const mockReservations: Reservation[] = [
        {
          id: '1',
          roomId: '1',
          userId: userId || 'user1',
          departmentId: departmentId || 'dept1',
          title: 'Réunion d\'équipe',
          description: 'Réunion hebdomadaire de l\'équipe',
          startDate: new Date('2024-01-15T10:00:00'),
          endDate: new Date('2024-01-15T12:00:00'),
          status: 'APPROUVEE',
          participants: 10,
          equipmentRequested: ['projector', 'whiteboard'],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          roomName: 'Salle de conférence principale',
          userName: 'Jean Dupont',
          departmentName: 'Développement'
        },
        {
          id: '2',
          roomId: '2',
          userId: userId || 'user2',
          departmentId: departmentId || 'dept2',
          title: 'Formation React',
          description: 'Session de formation sur React et TypeScript',
          startDate: new Date('2024-01-16T14:00:00'),
          endDate: new Date('2024-01-16T17:00:00'),
          status: 'EN_ATTENTE',
          participants: 15,
          equipmentRequested: ['projector', 'whiteboard', 'wifi'],
          createdAt: new Date('2024-01-11'),
          updatedAt: new Date('2024-01-11'),
          roomName: 'Salle de formation',
          userName: 'Marie Curie',
          departmentName: 'Formation'
        },
        {
          id: '3',
          roomId: '3',
          userId: userId || 'user3',
          departmentId: departmentId || 'dept3',
          title: 'Présentation client',
          description: 'Présentation du nouveau produit',
          startDate: new Date('2024-01-17T09:00:00'),
          endDate: new Date('2024-01-17T11:00:00'),
          status: 'REFUSEE',
          participants: 8,
          equipmentRequested: ['projector', 'screen', 'sound_system'],
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12'),
          roomName: 'Salle de réunion VIP',
          userName: 'Pierre Martin',
          departmentName: 'Commercial',
          rejectionReason: 'Salle déjà réservée pour cet horaire'
        }
      ];
      
      // Filtrer par userId ou departmentId si fournis
      const filteredReservations = mockReservations.filter(reservation => {
        if (userId && reservation.userId !== userId) return false;
        if (departmentId && reservation.departmentId !== departmentId) return false;
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

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    cancelReservation,
    fetchReservations,
  };
}