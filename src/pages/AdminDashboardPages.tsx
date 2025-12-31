import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';


interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const {
    systemStats,
    notifications,
    departments,
    loading,
    fetchSystemStats,
    fetchNotifications,
    fetchDepartments,
    fetchApprovalRequests
  } = useAdmin();

  // Charger les données au montage
  useEffect(() => {
    fetchSystemStats();
    fetchNotifications();
    fetchDepartments();
    fetchApprovalRequests();
  }, [fetchSystemStats, fetchNotifications, fetchDepartments, fetchApprovalRequests]);

  // Calculer les approbations en attente
  const pendingApprovalsCount = systemStats?.pendingApprovals || 0;

  // Gestionnaires de navigation
  const handleViewApprovals = () => {
    onNavigate('admin_approvals');
  };

  const handleViewUsers = () => {
    onNavigate('admin_users');
  };

  const handleViewRooms = () => {
    onNavigate('room_gallery');
  };

  const handleViewAuditLog = () => {
    onNavigate('admin_audit');
  };

  if (loading && !systemStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AdminDashboard
          stats={systemStats}
          notifications={notifications}
          departments={departments}
          pendingApprovals={pendingApprovalsCount}
          onViewApprovals={handleViewApprovals}
          onViewUsers={handleViewUsers}
          onViewRooms={handleViewRooms}
          onViewAuditLog={handleViewAuditLog}
        />
      </motion.div>

      {/* Information système */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Statut du système</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-white/70">Système opérationnel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-white/70">Base de données connectée</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-white/50">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}