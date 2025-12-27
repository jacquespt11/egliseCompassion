// hooks/useRooms.ts
import { useState, useEffect } from 'react';
import type { Room } from '../types/room';

const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Salle de Conférence Principale',
    description: 'Une grande salle équipée pour les conférences et réunions importantes',
    capacity: 50,
    location: 'Bâtiment A, RDC',
    equipment: ['wifi', 'projector', 'sound_system', 'microphone', 'camera'],
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Salle de Réunion B',
    description: 'Salle de réunion intime pour les petites équipes',
    capacity: 10,
    location: 'Bâtiment B, 1er étage',
    equipment: ['wifi', 'whiteboard', 'screen', 'coffee_machine'],
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    name: 'Salle Polyvalente',
    description: 'Espace modulable pour divers événements et formations',
    capacity: 100,
    location: 'Bâtiment C, Hall principal',
    equipment: ['wifi', 'projector', 'sound_system', 'air_conditioning'],
    status: 'MAINTENANCE',
    imageUrl: 'https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?w=800&auto=format&fit=crop',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-02-01T16:45:00Z',
  },
];

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRooms(MOCK_ROOMS);
      setLoading(false);
    }, 500);
  }, []);

  const createRoom = async (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...roomData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(room => 
      room.id === id 
        ? { ...room, ...updates, updatedAt: new Date().toISOString() }
        : room
    ));
  };

  const updateRoomStatus = async (id: string, status: Room['status']) => {
    await updateRoom(id, { status });
  };

  return {
    rooms,
    loading,
    error,
    createRoom,
    updateRoom,
    updateRoomStatus,
    refetch: () => {
      // Pour l'intégration future avec API
      setLoading(true);
      setTimeout(() => {
        setRooms(MOCK_ROOMS);
        setLoading(false);
      }, 500);
    },
  };
};