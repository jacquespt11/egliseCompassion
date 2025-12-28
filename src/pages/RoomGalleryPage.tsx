import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Users } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { Page } from '../types/user';

interface RoomGalleryPageProps {
  user: any;
  onNavigate: (page: Page) => void;
}

export function RoomGalleryPage({ user, onNavigate }: RoomGalleryPageProps) {
  const { rooms, loading } = useRooms();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
        >
          Galerie des salles
        </motion.h1>
        <p className="text-white/60">
          Découvrez et réservez les espaces disponibles pour vos activités
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une salle, un équipement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
            
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            {user?.role === 'ADMIN' && (
              <button className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                + Ajouter une salle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-white/60">
          {filteredRooms.length} salles trouvées
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-white/70">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-white/70">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Grille des salles */}
      {viewMode === 'grid' ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-5xl">🏢</div>
              </div>
              
              {/* Informations */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{room.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                    room.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {room.status === 'ACTIVE' ? 'Disponible' : 
                     room.status === 'MAINTENANCE' ? 'Maintenance' : 'Indisponible'}
                  </div>
                </div>
                
                <p className="text-white/70 text-sm mb-4 line-clamp-2">{room.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/40" />
                    <span className="text-white/60 text-sm">{room.capacity} personnes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-white/60 text-sm">4.8/5</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onNavigate('reservation_form')}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Réserver
                  </button>
                  <button 
                    onClick={() => {/* Détails */}}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Image */}
                <div className="md:w-64 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                  <div className="text-5xl">🏢</div>
                </div>
                
                {/* Informations */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{room.name}</h3>
                      <p className="text-white/70 mb-4">{room.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/40" />
                          <span className="text-white/60">{room.capacity} personnes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="text-white/60">4.8/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        room.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                        room.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-rose-500/20 text-rose-300'
                      }`}>
                        {room.status === 'ACTIVE' ? 'Disponible' : 
                         room.status === 'MAINTENANCE' ? 'Maintenance' : 'Indisponible'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('reservation_form')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Réserver
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all">
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {filteredRooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-white/30" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Aucune salle trouvée</h3>
          <p className="text-white/60 max-w-md mx-auto mb-8">
            Aucune salle ne correspond à votre recherche. Essayez de modifier vos critères.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setShowFilters(false);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      )}

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Salles totales', value: rooms.length },
            { label: 'Salles disponibles', value: rooms.filter(r => r.status === 'ACTIVE').length },
            { label: 'Capacité totale', value: rooms.reduce((acc, room) => acc + room.capacity, 0) },
            { label: 'Taux d\'occupation', value: '85%' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}