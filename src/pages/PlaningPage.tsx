// src/pages/PlaningPage.tsx
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ChevronRight, Plus, BarChart, Zap, Filter, Download, RefreshCw } from 'lucide-react';
import type { User } from '../types/user';
import type { PageId } from '../types/common';

interface PlaningPageProps {
  user: User | null;
  onNavigate: (page: PageId) => void;
}

export function PlaningPage({ user, onNavigate }: PlaningPageProps) {
  const reservations = [
    { id: 1, room: 'Salle de conférence principale', time: '9h-11h', status: 'confirmed', capacity: 50, department: 'Chorale' },
    { id: 2, room: 'Salle de réunion B', time: '14h-16h', status: 'pending', capacity: 12, department: 'Technique' },
    { id: 3, room: 'Auditorium', time: '18h-20h', status: 'confirmed', capacity: 200, department: 'Louange' },
    { id: 4, room: 'Salle de prière', time: '10h-12h', status: 'confirmed', capacity: 30, department: 'Intercession' },
  ];

  const timeSlots = [
    '8h-10h', '10h-12h', '12h-14h', '14h-16h', '16h-18h', '18h-20h'
  ];

  const rooms = [
    { id: 1, name: 'Salle A', capacity: 20, status: 'available', currentReservation: null },
    { id: 2, name: 'Salle B', capacity: 15, status: 'occupied', currentReservation: 'Chorale (9h-11h)' },
    { id: 3, name: 'Salle C', capacity: 30, status: 'available', currentReservation: null },
    { id: 4, name: 'Salle D', capacity: 25, status: 'maintenance', currentReservation: null },
    { id: 5, name: 'Auditorium', capacity: 200, status: 'occupied', currentReservation: 'Louange (18h-20h)' },
    { id: 6, name: 'Salle Poly.', capacity: 40, status: 'available', currentReservation: null },
  ];

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient amélioré */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Planning des réservations
              </h1>
              <p className="text-emerald-100 text-lg">
                Visualisez et gérez les réservations de salles en temps réel
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate('room_gallery')}
                className="px-5 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all border border-white/30 shadow-lg flex items-center gap-2 hover:shadow-white/20"
              >
                <Users className="w-5 h-5" />
                Voir les salles
              </button>
              <button 
                onClick={() => onNavigate('reservation_form')}
                className="px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-emerald-900/30"
              >
                <Calendar className="w-5 h-5" />
                Nouvelle réservation
              </button>
            </div>
          </div>

          {/* Date & Stats avec fonds solides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Date actuelle</p>
                  <p className="font-semibold text-white text-lg">{today}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-100">Réservations du jour</p>
                  <p className="font-semibold text-white text-lg">12 réservations</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <BarChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Taux d'occupation</p>
                  <p className="font-semibold text-white text-lg">68%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barre de contrôle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <select className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800">
                <option>Toutes les salles</option>
                <option>Salles disponibles</option>
                <option>Salles occupées</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <input 
                type="date" 
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all border-2 border-gray-200 dark:border-gray-600 shadow-sm flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
            <button className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Grille de planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendrier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-100 dark:border-gray-700 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Zap className="w-6 h-6 text-emerald-500" />
                  Planning du jour
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble des réservations par créneau horaire</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg border-2 border-emerald-200 dark:border-emerald-800 font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors shadow-sm">
                  Vue hebdomadaire
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shadow-inner">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
                    <th className="text-left py-5 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm border-b-2 border-gray-200 dark:border-gray-700">
                      Heure
                    </th>
                    {rooms.map(room => (
                      <th key={room.id} className="text-left py-5 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm border-b-2 border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col">
                          <span className="font-bold text-lg">{room.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">Capacité: {room.capacity}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot, slotIndex) => (
                    <tr key={timeSlot} className={`${
                      slotIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/30'
                    }`}>
                      <td className="py-5 px-6 text-gray-900 dark:text-gray-300 font-bold border-b-2 border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-emerald-500" />
                          <span className="text-lg">{timeSlot}</span>
                        </div>
                      </td>
                      {rooms.map(room => {
                        const isReserved = room.currentReservation && 
                          (room.currentReservation.includes(timeSlot.substring(0, 2)) || 
                           room.status === 'occupied');
                        
                        return (
                          <td key={`${timeSlot}-${room.id}`} className="py-4 px-4 border-b-2 border-gray-200 dark:border-gray-700">
                            <div className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer transform hover:-translate-y-1 ${
                              room.status === 'available' && !isReserved 
                                ? 'bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600' 
                                : room.status === 'occupied' || isReserved
                                ? 'bg-gradient-to-br from-white to-rose-50 dark:from-gray-800 dark:to-rose-900/10 border-rose-300 dark:border-rose-700 hover:border-rose-400 dark:hover:border-rose-600'
                                : 'bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/10 border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                  room.status === 'available' && !isReserved
                                    ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                                    : room.status === 'occupied' || isReserved
                                    ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300'
                                    : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300'
                                }`}>
                                  {room.status === 'available' && !isReserved ? 'Libre' :
                                   room.status === 'occupied' || isReserved ? 'Occupé' : 'Maintenance'}
                                </span>
                                <Users className="w-5 h-5 text-gray-500" />
                              </div>
                              {room.currentReservation && (
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                  {room.currentReservation}
                                </p>
                              )}
                              {!room.currentReservation && room.status === 'available' && (
                                <button 
                                  onClick={() => onNavigate('reservation_form')}
                                  className="mt-3 w-full py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Réserver
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Liste des réservations */}
          <div className="space-y-8">
            {/* Mes réservations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  Mes réservations
                </h3>
                <span className="px-3 py-1.5 text-sm font-bold bg-white/30 text-white rounded-full">
                  4 aujourd'hui
                </span>
              </div>
              
              <div className="space-y-4">
                {reservations.map(reservation => (
                  <motion.div
                    key={reservation.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                      reservation.status === 'confirmed' 
                        ? 'bg-white/30 border-white/30 hover:border-white/50' 
                        : 'bg-amber-500/30 border-amber-300/30 hover:border-amber-300/50'
                    }`}
                    onClick={() => onNavigate('my_reservations')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          reservation.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        <h4 className="font-bold text-white group-hover:text-emerald-200 transition-colors">
                          {reservation.room}
                        </h4>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/90">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/90">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Capacité: {reservation.capacity} personnes</span>
                      </div>
                      <div className="text-xs px-3 py-1.5 bg-white/20 rounded-lg border border-white/30 text-white">
                        Département: {reservation.department}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button 
                onClick={() => onNavigate('my_reservations')}
                className="w-full mt-8 py-3.5 text-center text-blue-700 bg-white hover:bg-blue-50 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
              >
                Voir toutes mes réservations
              </button>
            </motion.div>

            {/* Légende */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-gray-100 dark:border-gray-700 shadow-2xl"
            >
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <BarChart className="w-6 h-6 text-purple-500" />
                Légende du planning
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Salle disponible</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prête pour réservation immédiate</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10 border-2 border-rose-200 dark:border-rose-800">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900 border-2 border-rose-300 dark:border-rose-700 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-rose-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Salle occupée</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Réservée pour ce créneau horaire</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-2 border-amber-200 dark:border-amber-800">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-amber-500"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">En maintenance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Indisponible temporairement</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Besoin d'aide ? Contactez l'administrateur à{' '}
              <a href="mailto:admin@compassion.org" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                admin@compassion.org
              </a>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Les réservations doivent être approuvées par l'administrateur
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}