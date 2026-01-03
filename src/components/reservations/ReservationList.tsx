// src/components/reservations/ReservationList.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Clock, ChevronRight, RefreshCw, Download } from 'lucide-react';
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
  const [dateFilter, setDateFilter] = useState<string>('all');

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
        reservation.departmentId.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      return reservation.status === statusFilter;
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date();
      const reservationDate = new Date(reservation.startTime);
      
      switch(dateFilter) {
        case 'today':
          return reservationDate.toDateString() === today.toDateString();
        case 'this_week':
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          return reservationDate >= startOfWeek;
        case 'this_month':
          return reservationDate.getMonth() === today.getMonth() && 
                 reservationDate.getFullYear() === today.getFullYear();
        case 'upcoming':
          return reservationDate >= today;
        case 'past':
          return reservationDate < today;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-2xl shadow-amber-500/20 dark:shadow-amber-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Mes réservations
              </h1>
              <p className="text-amber-100 text-lg">
                Consultez et gérez toutes vos réservations de salles
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => fetchReservations(userId, departmentId)}
                className="px-5 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all border border-white/30 shadow-lg flex items-center gap-2 hover:shadow-white/20"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </button>
              <button 
                onClick={() => {/* Exporter */}}
                className="px-5 py-3 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-amber-900/30"
              >
                <Download className="w-5 h-5" />
                Exporter
              </button>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Total</p>
                  <p className="font-semibold text-white text-lg">{reservations.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/30">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">En attente</p>
                  <p className="font-semibold text-white text-lg">
                    {reservations.filter(r => r.status === 'EN_ATTENTE').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/30">
                  <Calendar className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Approuvées</p>
                  <p className="font-semibold text-white text-lg">
                    {reservations.filter(r => r.status === 'APPROUVEE').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/30">
                  <Calendar className="w-5 h-5 text-rose-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Refusées</p>
                  <p className="font-semibold text-white text-lg">
                    {reservations.filter(r => r.status === 'REFUSEE').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-500/30">
                  <Calendar className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Annulées</p>
                  <p className="font-semibold text-white text-lg">
                    {reservations.filter(r => r.status === 'ANNULEE').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher une réservation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-3">
              {/* Filtre par date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:focus:ring-amber-800"
                >
                  <option value="all">Toutes dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="this_week">Cette semaine</option>
                  <option value="this_month">Ce mois</option>
                  <option value="upcoming">À venir</option>
                  <option value="past">Passées</option>
                </select>
              </div>

              {/* Filtre par statut */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 border-2 border-gray-200 dark:border-gray-600">
                {[
                  { id: 'all', label: 'Tous', color: 'bg-gray-500' },
                  { id: 'EN_ATTENTE', label: 'En attente', color: 'bg-amber-500' },
                  { id: 'APPROUVEE', label: 'Approuvées', color: 'bg-emerald-500' },
                  { id: 'REFUSEE', label: 'Refusées', color: 'bg-rose-500' },
                  { id: 'ANNULEE', label: 'Annulées', color: 'bg-gray-500' },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === filter.id
                        ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${filter.color}`} />
                      {filter.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 dark:text-gray-300">
                {filteredReservations.length} réservations trouvées
                <span className="text-gray-600 dark:text-gray-400 text-sm font-normal ml-2">
                  sur {reservations.length} totales
                </span>
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-700 dark:text-gray-400">En attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-gray-700 dark:text-gray-400">Approuvées</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        {filteredReservations.length > 0 ? (
          <motion.div 
            layout
            className="space-y-4 mb-12"
          >
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
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-amber-500 dark:text-amber-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Aucune réservation ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore de réservation.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setDateFilter('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/30"
              >
                Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        )}

        {/* Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Pour toute modification ou annulation, veuillez contacter l'administrateur si la réservation est déjà approuvée.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Les réservations en attente peuvent être modifiées ou annulées directement.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}