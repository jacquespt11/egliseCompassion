import { useState, useCallback } from 'react';
import type { Reservation, CreateReservationDto } from '../types/reservation';
import { useAuth } from './useAuth';

export function useReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async (userId?: string, departmentId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ... code pour récupérer les réservations
      
      setReservations(reservations);
      return reservations;
    } catch (err) {
      setError('Erreur lors de la récupération des réservations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  
  const createReservation = useCallback(async (data: CreateReservationDto) => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crée les dates ISO complètes
      const startDate = new Date(`${data.date}T${data.startTime}:00`).toISOString();
      const endDate = new Date(`${data.date}T${data.endTime}:00`).toISOString();
      
      const newReservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        roomId: data.roomId,
        roomName: '', 
        userId: user?.id || 'current-user-id',
        userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Utilisateur',
        userEmail: user?.email || '',
        departmentId: data.departmentId || user?.departmentId || '',
        departmentName: user?.department || '',
        title: data.title,
        description: data.description || '',
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        startDate: startDate,
        endDate: endDate,
        status: 'EN_ATTENTE',
        participants: data.participants || 1,
        equipmentRequested: data.equipmentRequested || [],
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
    return {
    reservations,
    loading,
    error,
    createReservation,
    fetchReservations,
  };
  
}