import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, AlertCircle, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useReservations } from '../../hooks/useReservations';
import { useBookingRules } from '../../hooks/useBookingRules';
import type { Room } from '../../types/room';
import type { CreateReservationDto } from '../../types/reservation';

interface ReservationFormProps {
  rooms: Room[];
  currentDepartmentId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReservationForm({ rooms, currentDepartmentId, onSuccess, onCancel }: ReservationFormProps) {
  const { createReservation, loading } = useReservations();
  const { validateReservation, checkRoomAvailability } = useBookingRules();
  
  // Fonction pour formater la date au format YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fonction pour formater l'heure au format HH:MM
  const formatTime = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  const now = new Date();
  const defaultEndTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 heures

  // ✅ CORRECTION : Utilisez le nouveau type CreateReservationDto sans roomName
  const [formData, setFormData] = useState<CreateReservationDto>({
    roomId: '',
    title: '',
    description: '',
    date: formatDate(now), // Format YYYY-MM-DD
    startTime: formatTime(now), // Format HH:MM
    endTime: formatTime(defaultEndTime), // Format HH:MM
    participants: 1,
    equipmentRequested: [],
    departmentId: currentDepartmentId || '',
  });

  const [validationResult, setValidationResult] = useState({ isValid: true, message: '' });
  const [availability, setAvailability] = useState<{ isAvailable: boolean; conflict: any | null }>({ 
    isAvailable: true, 
    conflict: null 
  });

  // ✅ CORRECTION : Utilisez un type séparé pour la validation
  interface ValidationReservation extends CreateReservationDto {
    startDate?: Date;
    endDate?: Date;
  }

  // Convertir les données du formulaire en un objet compatible avec validateReservation
  const getReservationForValidation = (): ValidationReservation => {
    return {
      ...formData,
      // Créer des objets Date pour la validation si nécessaire
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
      
      // Utiliser les réservations existantes depuis le hook si disponible
      const availabilityCheck = checkRoomAvailability(
        formData.roomId,
        startDateTime,
        endDateTime,
        [] // Pour l'instant, tableau vide - à remplacer par les réservations réelles
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

    // ✅ CORRECTION : S'assurer que tous les champs obligatoires sont présents
    const reservationData: CreateReservationDto = {
      roomId: formData.roomId,
      title: formData.title,
      description: formData.description || '',
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      participants: formData.participants || 1,
      equipmentRequested: formData.equipmentRequested || [],
      departmentId: formData.departmentId,
    };

    try {
      await createReservation(reservationData);
      toast.success('Réservation créée avec succès !');
      onSuccess();
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
      console.error(error);
    }
  };

  const availableRooms = rooms.filter(room => room.status === 'ACTIVE');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Nouvelle réservation
              </h1>
              <p className="text-white/60 mt-2">
                Remplissez le formulaire pour réserver une salle
              </p>
            </div>
            <div className="flex items-center gap-3">
              {validationResult.isValid && availability.isAvailable ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Formulaire valide</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400">
                  <X className="w-5 h-5" />
                  <span className="font-medium">Problèmes détectés</span>
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
          className="space-y-8"
        >
          {/* Section Informations de base */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Informations de la réservation</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Titre de la réservation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none min-h-[100px]"
                  placeholder="Décrivez l'activité prévue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nombre de participants *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.participants || 1}
                  onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section Salle */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Sélection de la salle</h2>
            
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
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 outline-none"
              >
                <option value="">Sélectionnez une salle</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacité: {room.capacity} personnes)
                  </option>
                ))}
              </select>
            </div>

            {formData.roomId && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">
                    {availableRooms.find(r => r.id === formData.roomId)?.name}
                  </h3>
                  {!availability.isAvailable && (
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Non disponible</span>
                    </div>
                  )}
                </div>
                
                {availableRooms.find(r => r.id === formData.roomId) && (
                  <>
                    <p className="text-white/60 text-sm mb-2">
                      {availableRooms.find(r => r.id === formData.roomId)?.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {availableRooms.find(r => r.id === formData.roomId)?.capacity} personnes max
                      </span>
                    </div>
                  </>
                )}

                {availability.conflict && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-sm text-rose-300">
                      {availability.conflict.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section Équipements */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Équipements supplémentaires</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'projecteur', 'écran', 'tableau blanc', 'système audio', 
                'microphone', 'wifi', 'machine à café', 'imprimante'
              ].map(equipment => (
                <label key={equipment} className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData.equipmentRequested || []).includes(equipment)}
                    onChange={(e) => {
                      const current = formData.equipmentRequested || [];
                      if (e.target.checked) {
                        setFormData({ ...formData, equipmentRequested: [...current, equipment] });
                      } else {
                        setFormData({ 
                          ...formData, 
                          equipmentRequested: current.filter(item => item !== equipment) 
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-white/80 capitalize">{equipment}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Validation et actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Validation</h3>
                
                {!validationResult.isValid && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-sm text-rose-300">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {validationResult.message}
                    </p>
                  </div>
                )}

                {!availability.isAvailable && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-sm text-amber-300">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      La salle n'est pas disponible pour cette plage horaire
                    </p>
                  </div>
                )}

                {validationResult.isValid && availability.isAvailable && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-sm text-emerald-300">
                      <Check className="w-4 h-4 inline mr-2" />
                      Tous les critères sont remplis
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || !validationResult.isValid || !availability.isAvailable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création en cours...' : 'Créer la réservation'}
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}