import { useState, useCallback } from 'react';
import type { Room, RoomStatus, RoomType } from '../types/room';

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
      
      // Données mock CORRIGÉES pour correspondre au type Room
      const mockRooms: Room[] = [
        {
          id: '1',
          name: 'Salle de conférence principale',
          description: 'Grande salle équipée pour les conférences et réunions importantes',
          capacity: 50,
          type: 'auditorium', // Ajouté: type RoomType
          amenities: ['projector', 'screen', 'sound_system', 'microphone', 'wifi', 'air_conditioning'], // Renommé de equipment à amenities
          status: 'ACTIVE',
          location: 'Bâtiment principal - Rez-de-chaussée', // Ajouté
          floor: 0, // Ajouté
          images: [],
          color: '#3B82F6', // Ajouté
          equipment: ['projector', 'screen', 'sound_system', 'microphone', 'wifi'], // Gardé comme optionnel
          departmentId: 'general', // Optionnel
          createdAt: new Date('2024-01-01').toISOString(), // Converti en string
          updatedAt: new Date('2024-01-10').toISOString(), // Converti en string
          imageUrl: '/images/conference-room.jpg' // Optionnel
        },
        {
          id: '2',
          name: 'Salle de réunion A',
          description: 'Salle de réunion standard pour les équipes de 10 personnes',
          capacity: 10,
          type: 'meeting', // Ajouté
          amenities: ['whiteboard', 'wifi', 'coffee_machine', 'video_conference'],
          status: 'ACTIVE',
          location: 'Bâtiment principal - 1er étage',
          floor: 1,
          images: [],
          color: '#10B981',
          equipment: ['whiteboard', 'wifi', 'coffee_machine'],
          departmentId: 'general',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          imageUrl: '/images/meeting-room.jpg'
        },
        {
          id: '3',
          name: 'Salle de formation',
          description: 'Salle équipée pour les formations avec tables individuelles',
          capacity: 25,
          type: 'classroom', // Ajouté
          amenities: ['projector', 'whiteboard', 'wifi', 'printer', 'charging_stations'],
          status: 'ACTIVE',
          location: 'Bâtiment annexe - Rez-de-chaussée',
          floor: 0,
          images: [],
          color: '#8B5CF6',
          equipment: ['projector', 'whiteboard', 'wifi', 'printer'],
          departmentId: 'training',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          imageUrl: '/images/training-room.jpg'
        },
        {
          id: '4',
          name: 'Auditorium',
          description: 'Grand auditorium pour les événements et présentations',
          capacity: 200,
          type: 'auditorium', // Ajouté
          amenities: ['projector', 'screen', 'sound_system', 'microphone', 'camera', 'wifi', 'lighting', 'stage'],
          status: 'ACTIVE',
          location: 'Bâtiment événementiel',
          floor: 0,
          images: [],
          color: '#EF4444',
          equipment: ['projector', 'screen', 'sound_system', 'microphone', 'camera', 'wifi'],
          departmentId: 'events',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          imageUrl: '/images/auditorium.jpg'
        },
        {
          id: '5',
          name: 'Salle de réunion B',
          description: 'Petite salle de réunion pour les discussions privées',
          capacity: 6,
          type: 'meeting', // Ajouté
          amenities: ['whiteboard', 'wifi', 'soundproofing'],
          status: 'MAINTENANCE',
          location: 'Bâtiment principal - 2ème étage',
          floor: 2,
          images: [],
          color: '#F59E0B',
          equipment: ['whiteboard', 'wifi'],
          departmentId: 'general',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-12').toISOString(),
          imageUrl: '/images/small-meeting-room.jpg'
        },
        {
          id: '6',
          name: 'Salle créative',
          description: 'Salle avec espace collaboratif et équipements créatifs',
          capacity: 15,
          type: 'meeting', // Ajouté
          amenities: ['whiteboard', 'wifi', 'printer', 'coffee_machine', 'creative_tools', 'tv'],
          status: 'ACTIVE',
          location: 'Bâtiment créatif',
          floor: 1,
          images: [],
          color: '#EC4899',
          equipment: ['whiteboard', 'wifi', 'printer', 'coffee_machine'],
          departmentId: 'creative',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString(),
          imageUrl: '/images/creative-room.jpg'
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
        createdAt: new Date().toISOString(), // Converti en string
        updatedAt: new Date().toISOString(), // Converti en string
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
          ? { ...room, ...updates, updatedAt: new Date().toISOString() } // Converti en string
          : room
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la salle');
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
    filterRoomsByType,
    filterRoomsByCapacity,
  };
}