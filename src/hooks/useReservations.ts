// src/hooks/useReservations.ts
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Reservation, CreateReservationDto } from '../types/reservation';
import * as reservationService from '../services/api/symfony-reservation.service';

interface UseReservationsProps {
  userId?: string;
  departmentId?: string;
  userRole?: string;
}

export const useReservations = ({ userId, departmentId }: UseReservationsProps = {}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les réservations
  const fetchReservations = useCallback(async (currentUserId?: string, currentDeptId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Préparer les filtres
      const filters: any = {};

      // Utiliser les IDs passés en arg ou ceux du hook
      const uId = currentUserId || userId;
      const dId = currentDeptId || departmentId;

      // Si on filtre par user
      if (uId) {
        // Si l'ID est numérique (cas probable avec Symfony)
        const numId = parseInt(uId, 10);
        if (!isNaN(numId)) {
          filters.userId = numId;
        }
      }

      // TODO: Gérer le filtrage par département côté API si nécessaire
      // if (dId) filters.departmentId = dId;

      const data = await reservationService.getAllReservations(filters);
      setReservations(data);
      return data;
    } catch (err) {
      const errorMessage = 'Erreur lors du chargement des réservations';
      setError(errorMessage);
      toast.error('Impossible de charger les réservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, departmentId]);

  // Créer une réservation
  const createReservation = useCallback(async (data: CreateReservationDto) => {
    setLoading(true);
    try {
      const newReservation = await reservationService.createReservation(data);
      setReservations(prev => [...prev, newReservation]);
      toast.success('Réservation créée avec succès');
      return newReservation;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création de la réservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Annuler une réservation
  const cancelReservation = useCallback(async (reservationId: string) => {
    try {
      const numId = parseInt(reservationId, 10);
      if (isNaN(numId)) throw new Error('ID de réservation invalide');

      await reservationService.updateReservationStatus(numId, 'cancelled');

      setReservations(prev => prev.map(r =>
        r.id === reservationId ? { ...r, status: 'ANNULEE' } : r
      ));
      toast.success('Réservation annulée');
    } catch (err) {
      toast.error('Erreur lors de l\'annulation');
      throw err;
    }
  }, []);

  // Mettre à jour une réservation
  const updateReservation = useCallback(async (reservationId: string, data: Partial<Reservation>) => {
    try {
      const numId = parseInt(reservationId, 10);
      if (isNaN(numId)) throw new Error('ID de réservation invalide');

      // Note: On utilise le service d'update ajouté précédemment
      const updated = await reservationService.updateReservation(numId, data);

      setReservations(prev => prev.map(r =>
        r.id === reservationId ? updated : r
      ));
      toast.success('Réservation mise à jour');
    } catch (err) {
      // Fallback si l'update n'est pas supporté ou échoue
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
      throw err;
    }
  }, []);

  return {
    reservations,
    loading,
    error,
    fetchReservations, // Renommé de loadReservations pour consistance
    createReservation,
    cancelReservation,
    updateReservation,
  };
};