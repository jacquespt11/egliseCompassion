// components/rooms/RoomCard.tsx (version simplifiée)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, Eye, BookOpen, Star } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Room } from '../../types/room';

interface RoomCardProps {
  room: Room;
  onViewDetails?: () => void;
  onReserve?: () => void;
}

export function RoomCard({ room, onViewDetails, onReserve }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Créer des variables avec des valeurs par défaut pour les propriétés optionnelles
  const roomEquipment = room.equipment || [];
  const roomImage = room.imageUrl || (room.images && room.images[0]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Disponible';
      case 'INACTIVE':
        return 'Indisponible';
      case 'MAINTENANCE':
        return 'Maintenance';
      default:
        return 'Inconnu';
    }
  };

  const getStatusType = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
    >
      {/* Image de la salle */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        {roomImage ? (
          <img
            src={roomImage}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // En cas d'erreur de chargement de l'image
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFmMjkzZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSJ3aGl0ZSI+R2JhdGltZW50PC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="w-20 h-20 text-white/30" />
          </div>
        )}
        
        {/* Badge de statut */}
        <div className="absolute top-4 right-4">
          <StatusBadge 
            status={getStatusType(room.status)} 
            label={getStatusLabel(room.status)} 
            size="sm" 
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
          <p className="text-white/60 text-sm line-clamp-2">{room.description}</p>
        </div>

        {/* Caractéristiques */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white/40" />
            <span className="text-white/70 text-sm">Capacité : {room.capacity} personnes</span>
          </div>
          
          {room.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/40" />
              <span className="text-white/70 text-sm">{room.location}</span>
            </div>
          )}
          
          {/* Note/évaluation */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-white/70 text-sm">4.8/5 (24 avis)</span>
          </div>
        </div>

        {/* Équipements */}
        {roomEquipment.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-white/60 mb-2">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {roomEquipment.slice(0, 3).map((equip, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                >
                  {equip}
                </span>
              ))}
              {roomEquipment.length > 3 && (
                <span className="px-2 py-1 text-xs text-white/40">
                  +{roomEquipment.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Détails</span>
            </button>
          )}
          
          {onReserve && room.status === 'ACTIVE' && (
            <button
              onClick={onReserve}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Réserver</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}