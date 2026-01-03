import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ChevronRight } from 'lucide-react';
import type { User } from '../types/user';
import type { Page } from '../types/common';

interface PlaningPageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
}

export function PlaningPage({  onNavigate }: PlaningPageProps) {
  const reservations = [
    { id: 1, room: 'Salle de conférence principale', time: '9h-11h', status: 'confirmed', capacity: 50 },
    { id: 2, room: 'Salle de réunion B', time: '14h-16h', status: 'pending', capacity: 12 },
    { id: 3, room: 'Auditorium', time: '18h-20h', status: 'confirmed', capacity: 200 },
  ];

  const timeSlots = [
    '8h-10h', '10h-12h', '12h-14h', '14h-16h', '16h-18h', '18h-20h'
  ];

  const rooms = [
    { id: 1, name: 'Salle A', capacity: 20, status: 'available' },
    { id: 2, name: 'Salle B', capacity: 15, status: 'occupied' },
    { id: 3, name: 'Salle C', capacity: 30, status: 'available' },
    { id: 4, name: 'Salle D', capacity: 25, status: 'maintenance' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4"
        >
          Planning des réservations
        </motion.h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-white/60">
            Visualisez et gérez les réservations de salles en temps réel
          </p>
          <button 
            onClick={() => onNavigate('reservation_form')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Grille de planning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendrier */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Planning du jour</h3>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white/60">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-white/60 font-medium">Heure</th>
                  {rooms.map(room => (
                    <th key={room.id} className="text-left py-3 text-white/60 font-medium">
                      {room.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot} className="border-b border-white/5">
                    <td className="py-4 text-white/80 font-medium">{timeSlot}</td>
                    {rooms.map(room => (
                      <td key={`${timeSlot}-${room.id}`} className="py-4">
                        <div className={`p-3 rounded-lg ${
                          room.status === 'available' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                          room.status === 'occupied' ? 'bg-rose-500/10 border border-rose-500/20' :
                          'bg-amber-500/10 border border-amber-500/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${
                              room.status === 'available' ? 'text-emerald-300' :
                              room.status === 'occupied' ? 'text-rose-300' : 'text-amber-300'
                            }`}>
                              {room.status === 'available' ? 'Libre' :
                               room.status === 'occupied' ? 'Occupé' : 'Maintenance'}
                            </span>
                            <Users className="w-4 h-4 text-white/40" />
                          </div>
                          <p className="text-xs text-white/50 mt-1">Capacité: {room.capacity}</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Liste des réservations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Mes réservations */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Mes réservations aujourd'hui</h3>
            <div className="space-y-4">
              {reservations.map(reservation => (
                <motion.div
                  key={reservation.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                  onClick={() => onNavigate('my_reservations')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        reservation.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <h4 className="font-medium text-white">{reservation.room}</h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Users className="w-4 h-4" />
                      <span>Capacité: {reservation.capacity} personnes</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigate('my_reservations')}
              className="w-full mt-6 py-3 text-center text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              Voir toutes mes réservations
            </button>
          </div>

          {/* Statistiques */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-500/20">
            <h4 className="text-lg font-semibold text-white mb-4">Statistiques du jour</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Salles disponibles</span>
                <span className="text-xl font-bold text-emerald-300">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Réservations totales</span>
                <span className="text-xl font-bold text-cyan-300">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Taux d'occupation</span>
                <span className="text-xl font-bold text-white">75%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Légende */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-white/5 rounded-xl flex flex-wrap gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-white/70">Salle disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-sm text-white/70">Salle occupée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-white/70">En maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-white/70">Votre réservation</span>
        </div>
      </motion.div>
    </div>
  );
}