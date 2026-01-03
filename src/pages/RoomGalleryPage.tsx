// src/pages/RoomGalleryPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Star, Users, Calendar, Building, Plus, ChevronRight } from 'lucide-react';
import { useRooms } from '../hooks/useRooms';
import type { Page } from '../types/common';

interface RoomGalleryPageProps {
  user: any;
  onNavigate: (page: Page) => void;
}

export function RoomGalleryPage({ user, onNavigate }: RoomGalleryPageProps) {
  const { rooms, loading } = useRooms();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const availableRooms = rooms.filter(r => r.status === 'ACTIVE').length;
  const totalCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 shadow-2xl shadow-purple-500/20 dark:shadow-purple-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Galerie des salles
              </h1>
              <p className="text-purple-100 text-lg">
                Découvrez et réservez les espaces disponibles pour vos activités
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate('planing')}
                className="px-5 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all border border-white/30 shadow-lg flex items-center gap-2 hover:shadow-white/20"
              >
                <Calendar className="w-5 h-5" />
                Voir le planning
              </button>
              {user?.role === 'ADMIN' && (
                <button className="px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-purple-900/30">
                  <Plus className="w-5 h-5" />
                  Ajouter une salle
                </button>
              )}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Salles totales</p>
                  <p className="font-semibold text-white text-lg">{rooms.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/30">
                  <Users className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Salles disponibles</p>
                  <p className="font-semibold text-white text-lg">{availableRooms}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/30">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Capacité totale</p>
                  <p className="font-semibold text-white text-lg">{totalCapacity} places</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/20 rounded-2xl border border-white/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/30">
                  <Star className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Note moyenne</p>
                  <p className="font-semibold text-white text-lg">4.8/5</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barre de recherche et filtres */}
        <div className="mb-8 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher une salle, un équipement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-xl pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-3">
              {/* Filtres de statut */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 border-2 border-gray-200 dark:border-gray-600">
                {[
                  { id: 'all', label: 'Toutes', color: 'bg-gray-500' },
                  { id: 'ACTIVE', label: 'Disponible', color: 'bg-emerald-500' },
                  { id: 'MAINTENANCE', label: 'Maintenance', color: 'bg-amber-500' },
                  { id: 'UNAVAILABLE', label: 'Indisponible', color: 'bg-rose-500' },
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedStatus(filter.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === filter.id
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
              
              {/* Boutons de vue */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 border-2 border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats et statistiques */}
        <div className="mb-6 flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800/30">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-300">
              {filteredRooms.length} salles trouvées
              <span className="text-gray-600 dark:text-gray-400 text-sm font-normal ml-2">
                sur {rooms.length} salles totales
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-700 dark:text-gray-400">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-gray-700 dark:text-gray-400">Maintenance</span>
            </div>
          </div>
        </div>

        {/* Grille des salles */}
        {viewMode === 'grid' ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group"
              >
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <div className="text-5xl">🏢</div>
                </div>
                
                {/* Informations */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {room.capacity} personnes
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      room.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800' :
                      room.status === 'MAINTENANCE' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800' :
                      'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800'
                    }`}>
                      {room.status === 'ACTIVE' ? 'Disponible' : 
                       room.status === 'MAINTENANCE' ? 'Maintenance' : 'Indisponible'}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">4.8/5</span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">(12 avis)</span>
                    </div>
                    <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">
                      {room.equipment?.length || 5} équipements
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onNavigate('reservation_form')}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-purple-500/30"
                    >
                      Réserver
                    </button>
                    <button 
                      onClick={() => {/* Détails */}}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg font-medium transition-all border-2 border-gray-200 dark:border-gray-600 flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="space-y-4 mb-12">
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Image */}
                  <div className="md:w-64 h-48 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="text-5xl">🏢</div>
                  </div>
                  
                  {/* Informations */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {room.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">{room.description}</p>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            room.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800' :
                            room.status === 'MAINTENANCE' ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-800' :
                            'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800'
                          }`}>
                            {room.status === 'ACTIVE' ? 'Disponible' : 
                             room.status === 'MAINTENANCE' ? 'Maintenance' : 'Indisponible'}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{room.capacity} personnes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">4.8/5</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">(12 avis)</span>
                          </div>
                          <div className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600">
                            {room.equipment?.length || 5} équipements
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => onNavigate('reservation_form')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 flex items-center gap-2"
                      >
                        Réserver maintenant
                      </button>
                      <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg font-medium transition-all border-2 border-gray-200 dark:border-gray-600">
                        Voir les détails
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
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-12"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Aucune salle trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Aucune salle ne correspond à votre recherche. Essayez de modifier vos critères.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-purple-500/30"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Pour réserver une salle, sélectionnez-la et remplissez le formulaire de réservation.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Toutes les réservations sont soumises à l'approbation de l'administrateur.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}