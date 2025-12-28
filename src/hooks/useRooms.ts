import { useState, useCallback } from 'react';
import type { Room } from '../types/room';

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mock
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'Salle de conférence principale',
          description: 'Grande salle équipée pour les conférences et réunions importantes',
          capacity: 50,
          status: 'ACTIVE',
          equipment: ['projector', 'screen', 'sound_system', 'microphone', 'wifi'],
          images: [],
          departmentId: 'general',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '2',
          name: 'Salle de réunion A',
          description: 'Salle de réunion standard pour les équipes de 10 personnes',
          capacity: 10,
          status: 'ACTIVE',
          equipment: ['whiteboard', 'wifi', 'coffee_machine'],
          images: [],
          departmentId: 'general',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '3',
          name: 'Salle de formation',
          description: 'Salle équipée pour les formations avec tables individuelles',
          capacity: 25,
          status: 'ACTIVE',
          equipment: ['projector', 'whiteboard', 'wifi', 'printer'],
          images: [],
          departmentId: 'training',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '4',
          name: 'Auditorium',
          description: 'Grand auditorium pour les événements et présentations',
          capacity: 200,
          status: 'ACTIVE',
          equipment: ['projector', 'screen', 'sound_system', 'microphone', 'camera', 'wifi'],
          images: [],
          departmentId: 'events',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '5',
          name: 'Salle de réunion B',
          description: 'Petite salle de réunion pour les discussions privées',
          capacity: 6,
          status: 'MAINTENANCE',
          equipment: ['whiteboard', 'wifi'],
          images: [],
          departmentId: 'general',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-12'),
        },
        {
          id: '6',
          name: 'Salle créative',
          description: 'Salle avec espace collaboratif et équipements créatifs',
          capacity: 15,
          status: 'ACTIVE',
          equipment: ['whiteboard', 'wifi', 'printer', 'coffee_machine'],
          images: [],
          departmentId: 'creative',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-10'),
        },
      ];
      
      setRooms(mockRooms);
      return mockRooms;
    } catch (err) {
      setError('Erreur lors de la récupération des salles');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRoom: Room = {
        ...roomData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setRooms(prev => [newRoom, ...prev]);
      return newRoom;
    } catch (err) {
      setError('Erreur lors de la création de la salle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: string, updates: Partial<Room>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRooms(prev => prev.map(room => 
        room.id === id 
          ? { ...room, ...updates, updatedAt: new Date() }
          : room
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la salle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useState(() => {
    fetchRooms();
  });

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    createRoom,
    updateRoom,
  };
}