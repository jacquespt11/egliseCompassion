// src/pages/AdminApprovalPage.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Calendar, RefreshCw, Download } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
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
    rejected: 0,
    today: 0,
    avgTime: '2h'
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
    const today = approvalRequests.filter(r => 
      new Date(r.createdAt).toDateString() === new Date().toDateString()
    ).length;
    
    setStats({ pending, approved, rejected, today, avgTime: '2h' });
  }, [approvalRequests]);

  const handleApprove = async (requestId: string, notes?: string) => {
    await approveRequest(requestId, notes);
    await fetchApprovalRequests();
  };

  const handleReject = async (requestId: string, reason: string) => {
    await rejectRequest(requestId, reason);
    await fetchApprovalRequests();
  };

  const handleBack = () => {
    onNavigate('admin_dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/10">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header avec gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-2xl shadow-amber-500/20 dark:shadow-amber-900/30"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl border border-amber-500 hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Gestion des approbations
                </h1>
                <p className="text-amber-100 text-lg">
                  Validez ou refusez les demandes en attente
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => fetchApprovalRequests()}
                className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all border border-amber-500 shadow-lg flex items-center gap-2 hover:shadow-amber-500/30"
              >
                <RefreshCw className="w-5 h-5" />
                Actualiser
              </button>
              <button className="px-5 py-3 bg-gradient-to-r from-white to-amber-50 text-amber-700 rounded-xl font-semibold hover:from-amber-50 hover:to-amber-100 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl shadow-amber-900/30 border border-amber-200">
                <Download className="w-5 h-5" />
                Exporter
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div className="p-5 bg-gradient-to-r from-amber-600/80 to-amber-700/80 rounded-2xl border border-amber-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-100">En attente</p>
                  <p className="font-semibold text-white text-2xl">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 rounded-2xl border border-emerald-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-100">Approuvées</p>
                  <p className="font-semibold text-white text-2xl">{stats.approved}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-rose-600/80 to-rose-700/80 rounded-2xl border border-rose-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-rose-100">Refusées</p>
                  <p className="font-semibold text-white text-2xl">{stats.rejected}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-blue-600/80 to-blue-700/80 rounded-2xl border border-blue-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-100">Aujourd'hui</p>
                  <p className="font-semibold text-white text-2xl">{stats.today}</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-r from-purple-600/80 to-purple-700/80 rounded-2xl border border-purple-500/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Temps moyen</p>
                  <p className="font-semibold text-white text-2xl">{stats.avgTime}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Le reste du code reste inchangé */}
        {/* Guide d'approbation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Guide d'approbation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pour prendre une décision, vérifiez les informations suivantes :
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-gray-900 dark:text-white">Disponibilité</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vérifiez la disponibilité des salles pour les réservations
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-bold text-gray-900 dark:text-white">Départements</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assurez-vous que les départements existent pour les nouvelles inscriptions
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="font-bold text-gray-900 dark:text-white">Conflits</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vérifiez les conflits d'horaire pour les modifications de salles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-80">
              <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-white" />
                  <h4 className="text-lg font-bold text-white">Journal d'audit</h4>
                </div>
                <p className="text-blue-100 mb-4">
                  Toutes les décisions sont enregistrées dans le journal d'audit avec les détails complets.
                </p>
                <button 
                  onClick={() => onNavigate('admin_audit')}
                  className="w-full px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                >
                  Voir le journal
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* File d'attente des approbations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Demandes en attente</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {stats.pending} demandes nécessitent votre attention
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-700 dark:text-gray-400">Approuver</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-gray-700 dark:text-gray-400">Refuser</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-16 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Chargement des demandes...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              <ApprovalQueue
                items={approvalRequests}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          )}
        </motion.div>

        {/* Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300 dark:border-gray-700"
        >
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Les décisions d'approbation sont finales. Pour annuler une décision, contactez le support technique.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Les utilisateurs seront notifiés par email de votre décision
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}