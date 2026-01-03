import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, AlertCircle, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { TimeDisplay } from '../shared/TimeDisplay';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import type { Reservation } from '../../types/reservation';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
  isAdmin?: boolean;
}

export function ReservationCard({ reservation, onEdit, onCancel, onViewDetails, isAdmin = false }: ReservationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Convertir les statuts de réservation en statuts pour StatusBadge
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROUVEE':
        return { status: 'success' as const, label: 'Approuvée' };
      case 'EN_ATTENTE':
        return { status: 'pending' as const, label: 'En attente' };
      case 'REFUSEE':
        return { status: 'error' as const, label: 'Refusée' };
      case 'ANNULEE':
        return { status: 'warning' as const, label: 'Annulée' };
      default:
        return { status: 'info' as const, label: 'Inconnu' };
    }
  };

  const statusConfig = getStatusConfig(reservation.status);

  // Créer des dates valides pour TimeDisplay
  const createDateObject = (dateString: string | undefined, timeString?: string): string | Date | undefined => {
    if (!dateString) return undefined;
    
    if (timeString) {
      // Combiner date et heure
      const dateTimeString = `${dateString}T${timeString}:00`;
      return new Date(dateTimeString);
    }
    
    // Retourner juste la date si pas d'heure spécifiée
    return new Date(dateString);
  };

  // Créer les dates pour l'affichage
  const displayDate = createDateObject(reservation.date);
  const startDateTime = createDateObject(reservation.date, reservation.startTime);
  const endDateTime = createDateObject(reservation.date, reservation.endTime);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
      >
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Informations principales */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {reservation.title || `Réservation ${reservation.id}`}
                  </h3>
                  <StatusBadge status={statusConfig.status} label={statusConfig.label} />
                </div>
                <p className="text-white/60 mb-4">
                  {reservation.description || 'Aucune description'}
                </p>
              </div>

              {/* Menu d'actions */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-white/60" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg z-10">
                    <div className="p-2">
                      {onViewDetails && (
                        <button
                          onClick={() => {
                            onViewDetails();
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir détails</span>
                        </button>
                      )}
                      {onEdit && reservation.status === 'EN_ATTENTE' && (
                        <button
                          onClick={() => {
                            onEdit();
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/80 hover:text-white transition-all"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Modifier</span>
                        </button>
                      )}
                      {onCancel && (reservation.status === 'EN_ATTENTE' || reservation.status === 'APPROUVEE') && (
                        <button
                          onClick={() => {
                            setShowCancelModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-rose-400 hover:text-rose-300 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Annuler</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Détails */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <div className="space-y-1">
                  {displayDate && (
                    <TimeDisplay date={displayDate} showTime={false} showIcon={false} />
                  )}
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>
                      {reservation.startTime} - {reservation.endTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <MapPin className="w-4 h-4" />
                  <span>Salle</span>
                </div>
                <p className="text-white font-medium">{reservation.roomName || 'Salle non spécifiée'}</p>
                <p className="text-sm text-white/60">
                  Département: {reservation.departmentName || 'Non spécifié'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Users className="w-4 h-4" />
                  <span>Participants</span>
                </div>
                <p className="text-white font-medium">{reservation.participants || 0} personnes</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="w-4 h-4" />
                  <span>Statut</span>
                </div>
                <div className="flex flex-col gap-1">
                  <StatusBadge status={statusConfig.status} label={statusConfig.label} />
                  {reservation.status === 'REFUSEE' && reservation.rejectionReason && (
                    <p className="text-sm text-rose-400 mt-1">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {reservation.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Équipements demandés */}
            {reservation.equipmentRequested && reservation.equipmentRequested.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-white/70 mb-3">Équipements demandés</h4>
                <div className="flex flex-wrap gap-2">
                  {reservation.equipmentRequested.map((equip, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70"
                    >
                      {equip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires pour admin */}
            {isAdmin && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-white/70 mb-3">Informations administratives</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/50">Département</p>
                    <p className="text-white">{reservation.departmentName || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Créé par</p>
                    <p className="text-white">{reservation.userName || 'Utilisateur inconnu'}</p>
                  </div>
                  {reservation.comments && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-white/50">Commentaires</p>
                      <p className="text-white/70">{reservation.comments}</p>
                    </div>
                  )}
                  {reservation.updatedAt && (
                    <div>
                      <p className="text-sm text-white/50">Dernière mise à jour</p>
                      <TimeDisplay date={new Date(reservation.updatedAt)} showIcon={false} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmation d'annulation */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          onCancel?.();
          setShowCancelModal(false);
        }}
        title="Annuler la réservation"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
        confirmText="Annuler la réservation"
        cancelText="Conserver"
        type="danger"
      />
    </>
  );
}