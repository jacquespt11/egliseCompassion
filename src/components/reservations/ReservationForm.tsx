import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, AlertCircle, Check, X, ArrowLeft,
  Plus, Minus, Repeat
} from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '../../hooks/useReservations';
import { useBookingRules } from '../../hooks/useBookingRules';
import type { Room } from '../../types/room';
import type { CreateReservationDto } from '../../types/reservation';
import { RecurrenceOptions } from '../reservations/RecurrenceOptions';
import { Button } from '../shared/Button';

interface ReservationFormProps {
  rooms: Room[];
  currentDepartmentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReservationForm({ rooms, currentDepartmentId, onSuccess, onCancel }: ReservationFormProps) {
  const { createReservation, loading } = useReservations();
  const { validateReservation, checkRoomAvailability } = useBookingRules();
  
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const now = new Date();
  const defaultEndTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const [formData, setFormData] = useState<CreateReservationDto & {
    recurrence?: any;
    isRecurrent?: boolean;
  }>({
    roomId: '',
    title: '',
    description: '',
    date: formatDate(now),
    startTime: formatTime(now),
    endTime: formatTime(defaultEndTime),
    participants: 1,
    equipmentRequested: [],
    departmentId: currentDepartmentId || '',
    isRecurrent: false,
    recurrence: null,
  });

  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrence, setRecurrence] = useState(null);
  const [validationResult, setValidationResult] = useState({ isValid: true, message: '' });
  const [availability, setAvailability] = useState<{ isAvailable: boolean; conflict: any | null }>({ 
    isAvailable: true, 
    conflict: null 
  });

  const availableRooms = rooms.filter(room => room.status === 'ACTIVE');
  const selectedRoom = availableRooms.find(room => room.id === formData.roomId);

  // Gestion des participants avec boutons +/-
  const handleAttendeesChange = (type: 'increment' | 'decrement' | 'manual', value?: number) => {
    setFormData(prev => {
      let newValue = prev.participants || 1;
      
      if (type === 'increment') {
        newValue += 1;
      } else if (type === 'decrement') {
        newValue = Math.max(1, newValue - 1);
      } else if (type === 'manual' && value !== undefined) {
        newValue = Math.max(1, value);
      }
      
      return { ...prev, participants: newValue };
    });
  };

  interface ValidationReservation extends CreateReservationDto {
    startDate?: Date;
    endDate?: Date;
  }

  const getReservationForValidation = (): ValidationReservation => {
    return {
      ...formData,
      startDate: new Date(`${formData.date}T${formData.startTime}`),
      endDate: new Date(`${formData.date}T${formData.endTime}`),
    };
  };

  // Validation en temps réel
  useEffect(() => {
    const reservationForValidation = getReservationForValidation();
    const result = validateReservation(reservationForValidation as any);
    setValidationResult(result);
    
    if (formData.roomId && formData.date && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      
      const availabilityCheck = checkRoomAvailability(
        formData.roomId,
        startDateTime,
        endDateTime,
        []
      );
      setAvailability(availabilityCheck);
    }
  }, [formData, validateReservation, checkRoomAvailability]);

  // Mettre à jour departmentId si currentDepartmentId change
  useEffect(() => {
    if (currentDepartmentId && currentDepartmentId !== formData.departmentId) {
      setFormData(prev => ({
        ...prev,
        departmentId: currentDepartmentId
      }));
    }
  }, [currentDepartmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validationResult.isValid) {
      toast.error(validationResult.message);
      return;
    }

    if (!availability.isAvailable) {
      toast.error('La salle n\'est pas disponible pour cette plage horaire');
      return;
    }

    // Préparer les données de réservation
    const reservationData: CreateReservationDto & { isRecurrent?: boolean; recurrence?: any } = {
      roomId: formData.roomId,
      title: formData.title,
      description: formData.description || '',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      participants: formData.participants || 1,
      equipmentRequested: formData.equipmentRequested || [],
      departmentId: formData.departmentId,
      isRecurrent: isRecurrent,
      recurrence: recurrence,
    };

    try {
      await createReservation(reservationData);
      toast.success(isRecurrent ? 'Réservations récurrentes créées avec succès !' : 'Réservation créée avec succès !');
      onSuccess();
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Nouvelle réservation
              </h1>
              <p className="text-white/60 mt-2 text-sm md:text-base">
                Remplissez le formulaire pour réserver une salle
              </p>
            </div>
            <div className="flex items-center gap-3">
              {validationResult.isValid && availability.isAvailable ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">Formulaire valide</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-5 h-5" />
                  <span className="font-medium text-sm md:text-base">Problèmes détectés</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6 md:space-y-8"
        >
          {/* Section Informations de base */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Informations de la réservation</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Titre de la réservation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none text-sm md:text-base"
                  placeholder="Ex: Réunion d'équipe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none min-h-[100px] text-sm md:text-base"
                  placeholder="Décrivez l'activité prévue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={formatDate(new Date())}
                    className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Heure de début *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Heure de fin *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    min={formData.startTime}
                    className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Nombre de participants avec boutons +/- */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Nombre de participants *
                </label>
                <div className="flex items-center gap-3 max-w-xs">
                  <button
                    type="button"
                    onClick={() => handleAttendeesChange('decrement')}
                    className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Réduire le nombre de participants"
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      value={formData.participants || 1}
                      onChange={(e) => handleAttendeesChange('manual', parseInt(e.target.value))}
                      className="w-full p-3 md:p-4 border border-white/10 rounded-lg bg-white/5 text-white text-center text-base md:text-lg font-medium focus:ring-2 focus:ring-blue-400/50 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleAttendeesChange('increment')}
                    className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Augmenter le nombre de participants"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                <p className="text-xs md:text-sm text-white/60 mt-2">
                  Minimum: 1 participant
                </p>
              </div>
            </div>
          </div>

          {/* Section Salle */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Sélection de la salle</h2>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Salle *
              </label>
              <select
                required
                value={formData.roomId}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    roomId: e.target.value
                  });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg md:rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none text-sm md:text-base"
              >
                <option value="">Sélectionnez une salle</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacité: {room.capacity} personnes)
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white/5 rounded-lg md:rounded-xl">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h3 className="font-semibold text-white text-sm md:text-base">
                    {selectedRoom.name}
                  </h3>
                  {!availability.isAvailable && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs md:text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Non disponible</span>
                    </div>
                  )}
                </div>
                
                <p className="text-white/60 text-xs md:text-sm mb-2">
                  {selectedRoom.description}
                </p>
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {selectedRoom.capacity} personnes max
                  </span>
                </div>

                {/* Équipements en badges (sans cases à cocher) */}
                <div className="mt-3 md:mt-4">
                  <h4 className="text-sm font-medium text-white/80 mb-2">Équipements inclus :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities?.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/90 border border-white/20"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {availability.conflict && (
                  <div className="mt-3 md:mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-xs md:text-sm text-rose-300">
                      {availability.conflict.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Option de récurrence */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">Réservation récurrente</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRecurrent(!isRecurrent)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRecurrent 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isRecurrent ? 'Désactiver' : 'Activer'}
              </button>
            </div>
            
            {isRecurrent && (
              <RecurrenceOptions
                value={recurrence}
                onChange={setRecurrence}
                onRemove={() => {
                  setIsRecurrent(false);
                  setRecurrence(null);
                }}
              />
            )}
          </div>

          {/* Validation et actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="space-y-3">
                <h3 className="text-base md:text-lg font-semibold text-white">Validation</h3>
                
                {!validationResult.isValid && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-xs md:text-sm text-rose-300">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {validationResult.message}
                    </p>
                  </div>
                )}

                {!availability.isAvailable && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs md:text-sm text-amber-300">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      La salle n'est pas disponible pour cette plage horaire
                    </p>
                  </div>
                )}

                {validationResult.isValid && availability.isAvailable && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-xs md:text-sm text-emerald-300">
                      <Check className="w-4 h-4 inline mr-2" />
                      Tous les critères sont remplis
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 md:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !validationResult.isValid || !availability.isAvailable}
                  isLoading={loading}
                  className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
                >
                  {isRecurrent ? 'Créer les réservations récurrentes' : 'Créer la réservation'}
                </Button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}