// components/rooms/RoomGallery.tsx
import { useState } from 'react';
import { Search, Grid, List, Plus } from 'lucide-react';
import type { Room } from '../../types/room';
import { RoomCard } from './RoomCard';
import { RoomForm } from './RoomForm';
import { RoomFilters } from './RoomFilters';

interface RoomGalleryProps {
  rooms: Room[];
  onRoomCreate?: (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  userRole?: 'ADMIN' | 'RESPONSABLE';
}

export function RoomGallery({ 
  rooms, 
  onRoomCreate,
  userRole = 'RESPONSABLE' 
}: RoomGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [filters, setFilters] = useState({
    capacity: 0,
    equipment: [] as string[],
    status: 'ACTIVE' as Room['status']
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = room.capacity >= filters.capacity;
    const matchesEquipment = filters.equipment.length === 0 || 
                           filters.equipment.some(eq => room.equipment.includes(eq));
    const matchesStatus = !filters.status || room.status === filters.status;
    
    return matchesSearch && matchesCapacity && matchesEquipment && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Galerie des Salles
          </h1>
          <p className="text-white/60 mt-2">
            {filteredRooms.length} salle{filteredRooms.length !== 1 ? 's' : ''} disponible{filteredRooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {userRole === 'ADMIN' && (
          <button
            onClick={() => setShowRoomForm(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Ajouter une salle
          </button>
        )}
      </div>

      {/* Barre de contrôle */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 mb-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
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

          {/* Filtres */}
          <RoomFilters filters={filters} onFiltersChange={setFilters} />

          {/* Vue */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-500/20 text-blue-300' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grille de salles */}
      {filteredRooms.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'flex flex-col gap-4'
        }>
          {filteredRooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={userRole === 'ADMIN' ? () => {/* TODO */} : undefined}
              onToggleStatus={userRole === 'ADMIN' ? () => {/* TODO */} : undefined}
              variant={userRole === 'ADMIN' ? 'admin' : 'user'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-white/5 rounded-2xl mb-4">
            <Search className="w-12 h-12 text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">
            Aucune salle trouvée
          </h3>
          <p className="text-white/50">
            Essayez de modifier vos critères de recherche ou vos filtres
          </p>
        </div>
      )}

      {/* Modal de création/édition */}
      {showRoomForm && onRoomCreate && (
        <RoomForm
          onClose={() => setShowRoomForm(false)}
          onSubmit={onRoomCreate}
        />
      )}
    </div>
  );
}