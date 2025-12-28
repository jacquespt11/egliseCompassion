import type { User } from '../../types/user';

interface AdminDashboardProps {
  user: User | null;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="w-full max-w-6xl">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Tableau de bord Administrateur
            </h1>
            <p className="mt-2 text-white/60">
              Bienvenue, {user?.firstName || 'Admin'} {user?.lastName || ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/50">{user?.email}</p>
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mt-1">
              Administrateur Principal
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-6 rounded-2xl border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Salles</h3>
            <p className="text-3xl font-bold text-white">12</p>
            <p className="text-sm text-white/60 mt-2">Locaux disponibles</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-6 rounded-2xl border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Départements</h3>
            <p className="text-3xl font-bold text-white">15</p>
            <p className="text-sm text-white/60 mt-2">Départements actifs</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-2xl border border-green-500/20">
            <h3 className="text-xl font-semibold text-white mb-2">Réservations</h3>
            <p className="text-3xl font-bold text-white">47</p>
            <p className="text-sm text-white/60 mt-2">Cette semaine</p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-white/50">
            Interface de gestion des réservations en cours de développement...
          </p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            Accéder à la gestion complète
          </button>
        </div>
      </div>
    </div>
  );
}