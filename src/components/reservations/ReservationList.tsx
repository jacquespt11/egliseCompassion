import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';
import { ReservationCard } from './ReservationCard';
import type { UserRole } from '../../types/user';
import type { Reservation } from '../../types/reservation';

interface ReservationListProps {
  userId?: string;
  departmentId?: string;
  userRole?: UserRole;
  onViewDetails: (reservation: Reservation) => void;
  onCancelReservation: (reservation: Reservation) => void;
  onEditReservation: (reservation: Reservation) => void;
}

export function ReservationList({
  userId,
  departmentId,
  userRole,
  onViewDetails,
  onCancelReservation,
  onEditReservation
}: ReservationListProps) {
  const { reservations, loading, fetchReservations } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchReservations(userId, departmentId);
  }, [fetchReservations, userId, departmentId]);

  const filteredReservations = reservations.filter(reservation => {
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (reservation.title || '').toLowerCase().includes(searchLower) ||
        (reservation.description || '').toLowerCase().includes(searchLower) ||
        reservation.roomName.toLowerCase().includes(searchLower) ||
        (reservation.userName || '').toLowerCase().includes(searchLower) ||
        reservation.department.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      return reservation.status === statusFilter;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400 mb-4"
          >
            Mes réservations
          </motion.h1>
          <p className="text-white/60">
            Consultez et gérez toutes vos réservations de salles
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Filtre par statut */}
            <div className="flex gap-2">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                {['all', 'EN_ATTENTE', 'APPROUVEE', 'REFUSEE', 'ANNULEE'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {status === 'all' ? 'Tous' : 
                     status === 'EN_ATTENTE' ? 'En attente' :
                     status === 'APPROUVEE' ? 'Approuvées' :
                     status === 'REFUSEE' ? 'Refusées' : 'Annulées'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{reservations.length}</p>
                <p className="text-sm text-white/60">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-300">
                  {reservations.filter(r => r.status === 'EN_ATTENTE').length}
                </p>
                <p className="text-sm text-white/60">En attente</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-300">
                  {reservations.filter(r => r.status === 'APPROUVEE').length}
                </p>
                <p className="text-sm text-white/60">Approuvées</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-rose-300">
                  {reservations.filter(r => r.status === 'REFUSEE').length}
                </p>
                <p className="text-sm text-white/60">Refusées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        {filteredReservations.length > 0 ? (
          <div className="space-y-6">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onViewDetails={() => onViewDetails(reservation)}
                onEdit={() => onEditReservation(reservation)}
                onCancel={() => onCancelReservation(reservation)}
                isAdmin={userRole === 'ADMIN'}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-white/30" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Aucune réservation trouvée</h3>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune réservation ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore de réservation.'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}