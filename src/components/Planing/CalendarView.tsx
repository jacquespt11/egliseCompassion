// src/components/planing/CalendarView.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List, CalendarDays } from 'lucide-react';
import { Button } from '../shared/Button';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('week');

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    switch (view) {
      case 'day':
        return currentDate.toLocaleDateString('fr-FR', { 
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      case 'week': {
        const start = new Date(currentDate);
        start.setDate(start.getDate() - start.getDay());
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `Semaine du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      }
      case 'month':
        return currentDate.toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        });
      default:
        return currentDate.toLocaleDateString('fr-FR');
    }
  };

  // Données de démonstration
  const mockReservations = [
    { id: 1, title: 'Réunion équipe', room: 'Salle A', start: '09:00', end: '10:30', status: 'confirmed' },
    { id: 2, title: 'Formation', room: 'Salle B', start: '14:00', end: '17:00', status: 'pending' },
    { id: 3, title: 'Préparation culte', room: 'Salle C', start: '18:00', end: '20:00', status: 'confirmed' },
  ];

  return (
    <div className="space-y-6">
      {/* Contrôles du calendrier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => navigateDate('prev')} 
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Préc
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-2">
            <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <h2 className="text-sm md:text-lg font-semibold">{formatDateRange()}</h2>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigateDate('next')} 
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Suiv
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={() => setCurrentDate(new Date())}
            className="hidden sm:inline-flex"
          >
            Aujourd'hui
          </Button>
        </div>

        {/* Sélecteur de vue */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={view === 'day' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('day')}
            className="px-2 md:px-3"
            leftIcon={<CalendarIcon className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Jour</span>
          </Button>
          
          <Button
            variant={view === 'week' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="px-2 md:px-3"
            leftIcon={<CalendarDays className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Semaine</span>
          </Button>
          
          <Button
            variant={view === 'month' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="px-2 md:px-3"
            leftIcon={<Grid className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Mois</span>
          </Button>
          
          <Button
            variant={view === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setView('list')}
            className="px-2 md:px-3"
            leftIcon={<List className="w-3 h-3" />}
          >
            <span className="hidden sm:inline">Liste</span>
          </Button>
        </div>
      </div>

      {/* Affichage du calendrier selon la vue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {view === 'week' && <WeekView date={currentDate} reservations={mockReservations} />}
        {view === 'month' && <MonthView date={currentDate} reservations={mockReservations} />}
        {view === 'day' && <DayView date={currentDate} reservations={mockReservations} />}
        {view === 'list' && <ListView reservations={mockReservations} />}
      </div>
    </div>
  );
}

// Composants de vue individuels
function WeekView({ date, reservations }: { date: Date; reservations: any[] }) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 20h

  return (
    <div className="p-2 md:p-4 overflow-x-auto">
      <div className="grid grid-cols-8 gap-1 min-w-[800px]">
        {/* En-tête vide pour la colonne des heures */}
        <div className="p-2"></div>
        
        {/* En-têtes des jours */}
        {days.map(day => (
          <div key={day} className="text-center font-medium p-2 border-b text-sm md:text-base">
            {day}
          </div>
        ))}

        {/* Lignes des heures */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="p-2 text-xs md:text-sm text-gray-500 border-r">
              {hour}:00
            </div>
            {days.map(day => (
              <div key={`${day}-${hour}`} className="border border-gray-100 dark:border-gray-700 min-h-[50px] md:min-h-[60px] p-1">
                {/* Réservations pour cette cellule */}
                {reservations
                  .filter(r => r.start.startsWith(`${hour.toString().padStart(2, '0')}:`))
                  .map(res => (
                    <div key={res.id} className="text-xs p-1 mb-1 bg-blue-100 dark:bg-blue-900/30 rounded truncate">
                      {res.title}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function MonthView({ date, reservations }: { date: Date; reservations: any[] }) {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-2 md:p-4">
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* En-têtes des jours */}
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center font-medium p-2 text-sm md:text-base">
            {day}
          </div>
        ))}

        {/* Cases vides pour le début du mois */}
        {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 md:h-24 border border-gray-100 dark:border-gray-700 rounded"></div>
        ))}

        {/* Jours du mois */}
        {days.map(day => (
          <div key={day} className="h-16 md:h-24 border border-gray-100 dark:border-gray-700 rounded p-1 overflow-hidden">
            <div className="text-xs md:text-sm font-medium">{day}</div>
            {/* Réservations pour ce jour */}
            {reservations.slice(0, 2).map(res => (
              <div key={res.id} className="text-xs p-1 mt-1 bg-green-100 dark:bg-green-900/30 rounded truncate">
                {res.title}
              </div>
            ))}
            {reservations.length > 2 && (
              <div className="text-xs text-gray-500 mt-1">+{reservations.length - 2} autres</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ date, reservations }: { date: Date; reservations: any[] }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  return (
    <div className="p-2 md:p-4">
      <div className="text-center text-base md:text-lg font-semibold mb-4">
        {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <div className="space-y-2">
        {hours.map(hour => (
          <div key={hour} className="flex items-start">
            <div className="w-12 md:w-16 text-xs md:text-sm text-gray-500 pt-2">
              {hour}:00 - {hour + 1}:00
            </div>
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded p-2 min-h-[50px] md:min-h-[60px]">
              {reservations
                .filter(r => r.start.startsWith(`${hour.toString().padStart(2, '0')}:`))
                .map(res => (
                  <div key={res.id} className="mb-2 last:mb-0">
                    <div className="font-medium text-sm md:text-base">{res.title}</div>
                    <div className="text-xs md:text-sm text-gray-500">{res.room} • {res.start}-{res.end}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListView({ reservations }: { reservations: any[] }) {
  return (
    <div className="p-2 md:p-4">
      <div className="space-y-2">
        {reservations.map(res => (
          <div key={res.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div>
              <div className="font-medium text-sm md:text-base">{res.title}</div>
              <div className="text-xs md:text-sm text-gray-500">{res.room} • {res.start} - {res.end}</div>
            </div>
            <div className={`px-2 py-1 text-xs rounded-full ${
              res.status === 'confirmed' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
            }`}>
              {res.status === 'confirmed' ? 'Confirmée' : 'En attente'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}