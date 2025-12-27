// components/rooms/RoomCard.tsx
import { motion } from 'framer-motion';
import { Users, MapPin, Wifi, Tv, Coffee, Shield, ShieldOff } from 'lucide-react';
import type { Room } from '../../types/room';
import { StatusBadge } from '../shared/StatusBadge';

interface RoomCardProps {
  room: Room;
  onBook?: (room: Room) => void;
  onEdit?: (room: Room) => void;
  onToggleStatus?: (room: Room) => void;
  variant?: 'user' | 'admin';
}

export function RoomCard({ 
  room, 
  onBook, 
  onEdit, 
  onToggleStatus, 
  variant = 'user' 
}: RoomCardProps) {
  const getEquipmentIcon = (equipment: string) => {
    const icons: Record<string, React.ReactElement> = {
      wifi: <Wifi className="w-4 h-4" />,
      projector: <Tv className="w-4 h-4" />,
      coffee: <Coffee className="w-4 h-4" />,
      whiteboard: <div className="w-4 h-4 border border-white rounded" />,
    };
    return icons[equipment] || <div className="w-4 h-4 bg-gray-500 rounded" />;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden shadow-xl"
    >
      {/* Header avec image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.imageUrl || '/room-placeholder.jpg'}
          alt={room.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={room.status} />
        </div>
        {variant === 'admin' && onToggleStatus && (
          <button
            onClick={() => onToggleStatus(room)}
            className="absolute top-3 left-3 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
          >
            {room.status === 'ACTIVE' ? (
              <ShieldOff className="w-5 h-5 text-red-300" />
            ) : (
              <Shield className="w-5 h-5 text-green-300" />
            )}
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{room.name}</h3>
          <div className="flex items-center text-amber-300">
            <Users className="w-4 h-4 mr-1" />
            <span className="font-semibold">{room.capacity}</span>
          </div>
        </div>

        <p className="text-white/70 text-sm mb-4 line-clamp-2">{room.description}</p>

        {/* Localisation */}
        <div className="flex items-center text-white/60 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{room.location}</span>
        </div>

        {/* Équipements */}
        <div className="flex flex-wrap gap-2 mb-5">
          {room.equipment.slice(0, 3).map((eq, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg"
              title={eq}
            >
              {getEquipmentIcon(eq)}
              <span className="text-xs text-white/80">{eq}</span>
            </div>
          ))}
          {room.equipment.length > 3 && (
            <div className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/60">
              +{room.equipment.length - 3}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {variant === 'admin' && onEdit && (
            <button
              onClick={() => onEdit(room)}
              className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Modifier
            </button>
          )}
          <button
            onClick={() => onBook?.(room)}
            disabled={room.status !== 'ACTIVE'}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              room.status === 'ACTIVE'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            {room.status === 'ACTIVE' ? 'Réserver' : 'Indisponible'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}