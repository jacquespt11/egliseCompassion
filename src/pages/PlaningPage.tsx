// src/pages/PlaningPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, ChevronRight, Plus, BarChart, Zap, 
  Filter, Download, RefreshCw, Grid, List, CalendarDays
} from 'lucide-react';
import type { User } from '../types/user';
import type { PageId } from '../types/common';
import { Button } from '../components/shared/Button';
import { CalendarView } from '../components/Planing/CalendarView';

interface PlaningPageProps {
  user: User | null;
  onNavigate: (page: PageId) => void;
}

export function PlaningPage({ user, onNavigate }: PlaningPageProps) {
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'day' | 'list'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const reservations = [
    { id: 1, room: 'Salle de conférence principale', time: '9h-11h', status: 'confirmed', capacity: 50, department: 'Chorale' },
    { id: 2, room: 'Salle de réunion B', time: '14h-16h', status: 'pending', capacity: 12, department: 'Technique' },
    { id: 3, room: 'Auditorium', time: '18h-20h', status: 'confirmed', capacity: 200, department: 'Louange' },
    { id: 4, room: 'Salle de prière', time: '10h-12h', status: 'confirmed', capacity: 30, department: 'Intercession' },
  ];

  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-10 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-xl shadow-emerald-500/20 dark:shadow-emerald-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                Planning des réservations
              </h1>
              <p className="text-emerald-100 text-sm md:text-lg">
                Visualisez et gérez les réservations de salles en temps réel
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button
                variant="secondary"
                onClick={() => onNavigate('room_gallery')}
                leftIcon={<Users className="w-4 h-4 md:w-5 md:h-5" />}
                className="px-3 md:px-5 py-2 md:py-3 text-sm"
              >
                Voir les salles
              </Button>
              <Button
                variant="primary"
                onClick={() => onNavigate('reservation_form')}
                leftIcon={<Plus className="w-4 h-4 md:w-5 md:h-5" />}
                className="px-3 md:px-6 py-2 md:py-3 text-sm"
              >
                Nouvelle réservation
              </Button>
            </div>
          </div>

          {/* Date & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
            <div className="p-3 md:p-5 bg-white/20 rounded-xl md:rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-blue-100">Date actuelle</p>
                  <p className="font-semibold text-white text-sm md:text-lg">{today}</p>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-5 bg-white/20 rounded-xl md:rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-emerald-100">Réservations du jour</p>
                  <p className="font-semibold text-white text-sm md:text-lg">12 réservations</p>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-5 bg-white/20 rounded-xl md:rounded-2xl border border-white/30">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <BarChart className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-purple-100">Taux d'occupation</p>
                  <p className="font-semibold text-white text-sm md:text-lg">68%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contrôles du planning */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8 p-4 md:p-5 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
              <select className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg md:rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800">
                <option>Toutes les salles</option>
                <option>Salles disponibles</option>
                <option>Salles occupées</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400" />
              <input 
                type="date" 
                className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg md:rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* Sélecteur de vue */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg md:rounded-xl p-1">
              <Button
                variant={calendarView === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('day')}
                leftIcon={<Calendar className="w-3 h-3 md:w-4 md:h-4" />}
                className="px-2 md:px-3 text-xs"
              >
                Jour
              </Button>
              <Button
                variant={calendarView === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('week')}
                leftIcon={<CalendarDays className="w-3 h-3 md:w-4 md:h-4" />}
                className="px-2 md:px-3 text-xs"
              >
                Semaine
              </Button>
              <Button
                variant={calendarView === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('month')}
                leftIcon={<Grid className="w-3 h-3 md:w-4 md:h-4" />}
                className="px-2 md:px-3 text-xs"
              >
                Mois
              </Button>
              <Button
                variant={calendarView === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('list')}
                leftIcon={<List className="w-3 h-3 md:w-4 md:h-4" />}
                className="px-2 md:px-3 text-xs"
              >
                Liste
              </Button>
            </div>

            <Button
              variant="secondary"
              leftIcon={<Download className="w-3 h-3 md:w-4 md:h-4" />}
              className="px-3 md:px-4 py-2 text-xs md:text-sm"
            >
              Exporter
            </Button>
            <Button
              variant="primary"
              leftIcon={<RefreshCw className="w-3 h-3 md:w-4 md:h-4" />}
              className="px-3 md:px-4 py-2 text-xs md:text-sm"
            >
              Actualiser
            </Button>
          </div>
        </div>

        {/* Vue du calendrier */}
        <motion.div
          key={calendarView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <CalendarView />
        </motion.div>

        {/* Panneau latéral avec mes réservations (visible sur desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Vue du calendrier - prend 2/3 sur desktop */}
          <div className="lg:col-span-2">
            {/* Le calendrier est déjà affiché au-dessus, cette section est pour d'autres contenus si nécessaire */}
          </div>

          {/* Mes réservations - prend 1/3 sur desktop */}
          <div className="lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl shadow-blue-500/20 dark:shadow-blue-900/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 md:gap-3">
                  <Calendar className="w-4 h-4 md:w-6 md:h-6" />
                  Mes réservations
                </h3>
                <span className="px-2 md:px-3 py-1 text-xs md:text-sm font-bold bg-white/30 text-white rounded-full">
                  4 aujourd'hui
                </span>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {reservations.slice(0, 3).map(reservation => (
                  <motion.div
                    key={reservation.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all cursor-pointer group ${
                      reservation.status === 'confirmed' 
                        ? 'bg-white/30 border-white/30 hover:border-white/50' 
                        : 'bg-amber-500/30 border-amber-300/30 hover:border-amber-300/50'
                    }`}
                    onClick={() => onNavigate('my_reservations')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                          reservation.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        <h4 className="font-bold text-white text-sm md:text-base group-hover:text-emerald-200 transition-colors truncate">
                          {reservation.room}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 md:gap-2 text-white/90 text-xs md:text-sm">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{reservation.time}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 text-white/90 text-xs md:text-sm">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Capacité: {reservation.capacity} personnes</span>
                      </div>
                      <div className="text-xs px-2 md:px-3 py-1 bg-white/20 rounded border border-white/30 text-white truncate">
                        Département: {reservation.department}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button
                variant="secondary"
                onClick={() => onNavigate('my_reservations')}
                className="w-full mt-4 md:mt-6 py-2 md:py-3 text-sm md:text-base"
                fullWidth
              >
                Voir toutes mes réservations
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">
              Besoin d'aide ? Contactez l'administrateur à{' '}
              <a href="mailto:admin@compassion.org" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                admin@compassion.org
              </a>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-2">
              Les réservations doivent être approuvées par l'administrateur
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}