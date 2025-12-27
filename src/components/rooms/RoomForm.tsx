// components/rooms/RoomForm.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import type { Room } from '../../types/room';
import { EQUIPMENT_OPTIONS, ROOM_STATUS } from '../../utils/constants';

interface RoomFormProps {
  room?: Room; // Pour l'édition
  onSubmit: (roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function RoomForm({ room, onSubmit, onClose }: RoomFormProps) {
  const isEditing = !!room;
  
  const [formData, setFormData] = useState({
    name: room?.name || '',
    description: room?.description || '',
    capacity: room?.capacity || 10,
    location: room?.location || '',
    equipment: room?.equipment || [] as string[],
    status: room?.status || 'ACTIVE',
    imageUrl: room?.imageUrl || '',
    departmentId: room?.departmentId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (formData.capacity < 1) newErrors.capacity = 'La capacité doit être positive';
    if (!formData.location.trim()) newErrors.location = 'La localisation est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
              </h2>
              <p className="text-white/60 mt-1">
                {isEditing ? 'Mettez à jour les informations de la salle' : 'Remplissez les informations de la nouvelle salle'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white/60" />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Nom et Capacité */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  Nom de la salle
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-white/5 border ${errors.name ? 'border-rose-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none`}
                  placeholder="Ex: Salle de conférence principale"
                />
                {errors.name && (
                  <p className="text-sm text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  Capacité
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  className={`w-full bg-white/5 border ${errors.capacity ? 'border-rose-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none`}
                  placeholder="Nombre de personnes"
                />
                {errors.capacity && (
                  <p className="text-sm text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.capacity}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                Description
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full bg-white/5 border ${errors.description ? 'border-rose-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none resize-none`}
                placeholder="Décrivez la salle, son ambiance, ses usages..."
              />
              {errors.description && (
                <p className="text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Localisation */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                Localisation
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full bg-white/5 border ${errors.location ? 'border-rose-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none`}
                placeholder="Ex: Bâtiment A, RDC, porte 205"
              />
              {errors.location && (
                <p className="text-sm text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Équipements */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Équipements disponibles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <div
                    key={eq.value}
                    onClick={() => handleEquipmentToggle(eq.value)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      formData.equipment.includes(eq.value)
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      formData.equipment.includes(eq.value)
                        ? 'bg-blue-500'
                        : 'bg-white/10'
                    }`}>
                      {formData.equipment.includes(eq.value) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm">{eq.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Statut
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(ROOM_STATUS).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => setFormData({ ...formData, status: key as Room['status'] })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                      formData.status === key
                        ? value.color + ' border-current/30'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                      key === 'ACTIVE' ? 'bg-emerald-500' :
                      key === 'INACTIVE' ? 'bg-rose-500' :
                      'bg-amber-500'
                    }`} />
                    <span className="text-sm font-medium">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* URL de l'image */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80">
                Image (URL)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="https://exemple.com/image.jpg"
                />
                <button
                  type="button"
                  className="px-4 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Parcourir
                </button>
              </div>
              {formData.imageUrl && (
                <div className="mt-2 p-2 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-2">Aperçu :</p>
                  <img
                    src={formData.imageUrl}
                    alt="Aperçu"
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/room-placeholder.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Mettre à jour' : 'Créer la salle'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}