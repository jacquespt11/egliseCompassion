// src/hooks/useReservations.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Reservation } from '../types/reservation';

interface UseReservationsProps {
  userId?: string;
  departmentId?: string;
  userRole?: string;
}

export const useReservations = ({ userId, departmentId, userRole }: UseReservationsProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les réservations
  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Remplacer par appel API
      const mockReservations: Reservation[] = [
        {
          id: '1',
          userId: userId || 'user1',
          departmentId: departmentId || 'dept1',
          roomId: 'room1',
          title: 'Réunion d\'équipe',
          description: 'Réunion hebdomadaire de l\'équipe',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          attendees: 10,
          approvalstatus: 'APPROVED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      setReservations(mockReservations);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      toast.error('Impossible de charger les réservations');
    } finally {
      setLoading(false);
    }
  }, [userId, departmentId]);

  // Créer une réservation
  const createReservation = useCallback(async (data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      // TODO: Remplacer par appel API
      const newReservation: Reservation = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setReservations(prev => [...prev, newReservation]);
      toast.success('Réservation créée avec succès');
      return newReservation;
    } catch (err) {
      toast.error('Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Annuler une réservation
  const cancelReservation = useCallback(async (reservationId: string) => {
    try {
      // TODO: Remplacer par appel API
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      toast.success('Réservation annulée');
    } catch (err) {
      toast.error('Erreur lors de l\'annulation');
      throw err;
    }
  }, []);

  // Mettre à jour une réservation
  const updateReservation = useCallback(async (reservationId: string, data: Partial<Reservation>) => {
    try {
      // TODO: Remplacer par appel API
      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
      ));
      toast.success('Réservation mise à jour');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  }, []);

  return {
    reservations,
    loading,
    error,
    loadReservations,
    createReservation,
    cancelReservation,
    updateReservation,
  };
};