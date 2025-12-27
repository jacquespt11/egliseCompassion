// components/rooms/RoomFilters.tsx
import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { EQUIPMENT_OPTIONS } from '../../utils/constants';
import type { Room } from '../../types/room';

interface RoomFiltersProps {
  filters: {
    capacity: number;
    equipment: string[];
    status: Room['status'] | '';
  };
  onFiltersChange: (filters: any) => void;
}

export function RoomFilters({ filters, onFiltersChange }: RoomFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEquipmentToggle = (equipment: string) => {
    const newEquipment = filters.equipment.includes(equipment)
      ? filters.equipment.filter(e => e !== equipment)
      : [...filters.equipment, equipment];
    
    onFiltersChange({ ...filters, equipment: newEquipment });
  };

  const clearFilters = () => {
    onFiltersChange({ capacity: 0, equipment: [], status: '' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span>Filtres</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
        {(filters.capacity > 0 || filters.equipment.length > 0 || filters.status) && (
          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
            {[filters.capacity > 0, filters.equipment.length > 0, !!filters.status].filter(Boolean).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 z-50">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">Filtres avancés</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-white/50 hover:text-white flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Tout effacer
            </button>
          </div>

          {/* Capacité */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium text-white/80">
              Capacité minimum
            </label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>0</span>
                <span className="font-medium">{filters.capacity} personnes</span>
                <span>100+</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.capacity}
                onChange={(e) => onFiltersChange({ ...filters, capacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-medium text-white/80">
              Équipements
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq.value}
                  onClick={() => handleEquipmentToggle(eq.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    filters.equipment.includes(eq.value)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/80">
              Statut
            </label>
            <div className="flex gap-2">
              {['ACTIVE', 'INACTIVE', 'MAINTENANCE'].map((status) => (
                <button
                  key={status}
                  onClick={() => onFiltersChange({ 
                    ...filters, 
                    status: filters.status === status ? '' : status as Room['status'] 
                  })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.status === status
                      ? status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : status === 'INACTIVE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {status === 'ACTIVE' && 'Activée'}
                  {status === 'INACTIVE' && 'Indisponible'}
                  {status === 'MAINTENANCE' && 'Maintenance'}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton d'application */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Appliquer les filtres
          </button>
        </div>
      )}
    </div>
  );
}