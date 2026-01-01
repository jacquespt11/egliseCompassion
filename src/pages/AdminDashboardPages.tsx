import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';
import AdminDashboard from '../components/admin/AdminDashboard';

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
    fetchApprovalRequests,
    fetchAuditLogs
  } = useAdmin();

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSystemStats(),
        fetchNotifications(),
        fetchDepartments(),
        fetchApprovalRequests(),
        fetchAuditLogs()
      ]);
    };
    
    loadData();
  }, [fetchSystemStats, fetchNotifications, fetchDepartments, fetchApprovalRequests, fetchAuditLogs]);

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

  const handleExportData = () => {
    // Logique d'export des données
    console.log('Exporting dashboard data...');
    // Dans une application réelle, vous pourriez appeler une API pour générer un rapport
    alert('Export des données démarré...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <AdminDashboard
        stats={systemStats}
        notifications={notifications}
        departments={departments}
        pendingApprovals={pendingApprovalsCount}
        loading={loading}
        onViewApprovals={handleViewApprovals}
        onViewUsers={handleViewUsers}
        onViewRooms={handleViewRooms}
        onViewAuditLog={handleViewAuditLog}
        onExportData={handleExportData}
      />

      {/* Pied de page du tableau de bord */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Système de Gestion Église la Compassion</h4>
              <p className="text-white/70 text-sm">
                Version 1.0.0 • Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-white/70">Système en ligne</span>
              </div>
              <div className="text-sm text-white/50">
                © {new Date().getFullYear()} Église la Compassion. Tous droits réservés.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}