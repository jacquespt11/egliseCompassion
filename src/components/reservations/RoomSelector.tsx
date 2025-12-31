// components/reservations/RoomSelector.tsx
import { useState } from 'react';
import { Search, Users, MapPin, Check } from 'lucide-react';
import type { Room } from '../../types/room';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  filters?: {
    capacity?: number;
    equipment?: string[];
    departmentId?: string;
  };
}

export function RoomSelector({ rooms, selectedRoom, onSelectRoom, filters }: RoomSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtrer les salles
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchTerm === '' || 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = !filters?.capacity || room.capacity >= filters.capacity;
    const matchesDepartment = !filters?.departmentId || room.departmentId === filters.departmentId;
    
    // Filtre par équipement
    let matchesEquipment = true;
    if (filters?.equipment && filters.equipment.length > 0) {
      const roomEquipment = room.equipment || [];
      matchesEquipment = filters.equipment.every(eq => roomEquipment.includes(eq));
    }
    
    return matchesSearch && matchesCapacity && matchesDepartment && matchesEquipment;
  });

  const getEquipmentIcon = (equipment: string) => {
    switch (equipment.toLowerCase()) {
      case 'wifi': return '📶';
      case 'projecteur': return '📽️';
      case 'projector': return '📽️';
      case 'tableau blanc': return '📋';
      case 'whiteboard': return '📋';
      case 'machine à café': return '☕';
      case 'coffee_machine': return '☕';
      case 'système audio': return '🔊';
      case 'sound_system': return '🔊';
      case 'écran': return '🖥️';
      case 'screen': return '🖥️';
      case 'microphone': return '🎤';
      case 'imprimante': return '🖨️';
      case 'printer': return '🖨️';
      default: return '⚙️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 rounded-xl transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Liste des salles */}
      {filteredRooms.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
          : 'space-y-3'
        }>
          {filteredRooms.map((room) => {
            const isSelected = selectedRoom?.id === room.id;
            const roomEquipment = room.equipment || [];
            const roomImage = room.imageUrl || (room.images && room.images[0]) || '/room-placeholder.jpg';
            
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`
                  p-4 rounded-xl border transition-all cursor-pointer
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={roomImage}
                      alt={room.name}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/room-placeholder.jpg';
                      }}
                    />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate">{room.name}</h3>
                      <div className="flex items-center text-amber-300 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {room.capacity}
                      </div>
                    </div>

                    <p className="text-sm text-white/70 mb-3 line-clamp-2">{room.description}</p>

                    <div className="flex items-center text-white/60 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{room.location}</span>
                    </div>

                    {/* Équipements */}
                    {roomEquipment.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {roomEquipment.slice(0, 4).map((eq, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-white/70"
                            title={eq}
                          >
                            {getEquipmentIcon(eq)} {eq}
                          </span>
                        ))}
                        {roomEquipment.length > 4 && (
                          <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/50">
                            +{roomEquipment.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-white/5 rounded-2xl mb-4">
            <Search className="w-12 h-12 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            Aucune salle disponible
          </h3>
          <p className="text-white/50">
            Aucune salle ne correspond à vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}