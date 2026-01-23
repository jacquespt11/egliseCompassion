import { useState, useCallback, useEffect } from 'react';
import type { Room, RoomStatus, RoomType } from '../types/room';
import * as roomService from '../services/api/symfony-room.service';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedRooms = await roomService.getAllRooms();
      setRooms(fetchedRooms);
      return fetchedRooms;
    } catch (err) {
      const errorMessage = 'Erreur lors de la récupération des salles';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const newRoom = await roomService.createRoom(roomData);
      setRooms(prev => [newRoom, ...prev]);
      toast.success('Salle créée avec succès');
      return newRoom;
    } catch (err) {
      const errorMessage = 'Erreur lors de la création de la salle';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: string, updates: Partial<Room>) => {
    setLoading(true);
    setError(null);

    try {
      // Conversion de l'ID string en number pour le service Symfony
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) throw new Error('ID de salle invalide');

      const updatedRoom = await roomService.updateRoom(numericId, updates);

      setRooms(prev => prev.map(room =>
        room.id === id ? updatedRoom : room
      ));

      toast.success('Salle mise à jour avec succès');
    } catch (err) {
      const errorMessage = 'Erreur lors de la mise à jour de la salle';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) throw new Error('ID de salle invalide');

      await roomService.deleteRoom(numericId);
      setRooms(prev => prev.filter(room => room.id !== id));
      toast.success('Salle supprimée avec succès');
    } catch (err) {
      const errorMessage = 'Erreur lors de la suppression de la salle';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour filtrer par type
  const filterRoomsByType = useCallback((type: RoomType | 'all'): Room[] => {
    if (type === 'all') return rooms;
    return rooms.filter(room => room.type === type);
  }, [rooms]);

  // Fonction pour filtrer par capacité
  const filterRoomsByCapacity = useCallback((minCapacity: number): Room[] => {
    return rooms.filter(room => room.capacity >= minCapacity);
  }, [rooms]);

  // Initial fetch
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    filterRoomsByType,
    filterRoomsByCapacity,
  };
}