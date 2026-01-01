import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, FileText } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
// Utilisez la nouvelle version d'ApprovalQueue
import ApprovalQueue from '../components/admin/ApprovalQueue';

interface AdminApprovalPageProps {
  onNavigate: (page: string) => void;
}

export function AdminApprovalPage({ onNavigate }: AdminApprovalPageProps) {
  const {
    approvalRequests,
    loading,
    fetchApprovalRequests,
    approveRequest,
    rejectRequest
  } = useAdmin();

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Charger les demandes
  useEffect(() => {
    fetchApprovalRequests();
  }, [fetchApprovalRequests]);

  // Calculer les statistiques
  useEffect(() => {
    const pending = approvalRequests.filter(r => r.status === 'pending').length;
    const approved = approvalRequests.filter(r => r.status === 'approved').length;
    const rejected = approvalRequests.filter(r => r.status === 'rejected').length;
    
    setStats({ pending, approved, rejected });
  }, [approvalRequests]);

  const handleApprove = async (requestId: string, notes?: string) => {
    await approveRequest(requestId, notes);
    await fetchApprovalRequests(); // Rafraîchir la liste
  };

  const handleReject = async (requestId: string, reason: string) => {
    await rejectRequest(requestId, reason);
    await fetchApprovalRequests(); // Rafraîchir la liste
  };

  const handleBack = () => {
    onNavigate('admin_dashboard');
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au tableau de bord</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                  Gestion des approbations
                </h1>
                <p className="text-white/60 mt-1">
                  Validez ou refusez les demandes en attente
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-amber-300">{stats.pending}</p>
              <p className="text-sm text-white/60">En attente</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-emerald-300">{stats.approved}</p>
              <p className="text-sm text-white/60">Approuvées</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-2xl font-bold text-rose-300">{stats.rejected}</p>
              <p className="text-sm text-white/60">Refusées</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Guide d'approbation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Guide d'approbation</h3>
            <p className="text-white/60">
              Pour prendre une décision, vérifiez les informations suivantes :
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Vérifiez la disponibilité des salles pour les réservations</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Assurez-vous que les départements existent pour les nouvelles inscriptions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Vérifiez les conflits d'horaire pour les modifications de salles</span>
              </li>
            </ul>
          </div>
          <div className="md:w-48">
            <div className="p-4 bg-white/5 rounded-xl">
              <FileText className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-sm text-white/60">
                Toutes les décisions sont enregistrées dans le journal d'audit
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* File d'attente des approbations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <ApprovalQueue
            items={approvalRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </motion.div>
    </div>
  );
}