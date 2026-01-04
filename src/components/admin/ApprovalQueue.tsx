// src/components/admin/ApprovalQueue.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Building2, 
  Clock, 
  Check, 
  X, 
  Eye,
  AlertCircle,
  Mail,
  Users,
  Target,
  ChevronRight,
  FileText,
  Shield,
  Zap
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { TimeDisplay } from '../shared/TimeDisplay';
import type { ApprovalRequest } from '../../types/admin';

interface ApprovalQueueProps {
  items: ApprovalRequest[];
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
}

type ApprovalType = 'ALL' | 'USER_REGISTRATION' | 'RESERVATION' | 'ROOM_MODIFICATION';

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ 
  items, 
  onApprove, 
  onReject
}) => {
  const [filter, setFilter] = useState<ApprovalType>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [loadingRequestId, setLoadingRequestId] = useState<string | null>(null);

  const filteredItems = filter === 'ALL' 
    ? items 
    : items.filter(item => item.type === filter);

  const pendingItems = filteredItems.filter(item => item.status === 'pending');
  const processedItems = filteredItems.filter(item => item.status !== 'pending');

  const getRequestIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'USER_REGISTRATION':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'RESERVATION':
        return <Calendar className="w-5 h-5 text-emerald-500" />;
      case 'ROOM_MODIFICATION':
        return <Building2 className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRequestTypeLabel = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'USER_REGISTRATION':
        return 'Inscription Utilisateur';
      case 'RESERVATION':
        return 'Demande de Réservation';
      case 'ROOM_MODIFICATION':
        return 'Modification de Salle';
      default:
        return 'Demande';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  const handleApprove = async (request: ApprovalRequest) => {
    setLoadingRequestId(request.id);
    try {
      await onApprove(request.id, approvalNotes || undefined);
      setApprovalNotes('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    } finally {
      setLoadingRequestId(null);
    }
  };

  const handleReject = async (request: ApprovalRequest) => {
    if (!rejectReason.trim()) {
      alert('Veuillez indiquer une raison pour le refus');
      return;
    }
    
    setLoadingRequestId(request.id);
    try {
      await onReject(request.id, rejectReason);
      setRejectReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erreur lors du refus:', error);
    } finally {
      setLoadingRequestId(null);
    }
  };

  const handleViewDetails = (request: ApprovalRequest) => {
    setSelectedRequest(request);
  };

  return (
    <div className="space-y-8">
      {/* Header avec filtres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File d'attente des approbations</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {pendingItems.length} demande(s) en attente • {processedItems.length} traitée(s)
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 border-2 border-gray-300 dark:border-gray-600">
            {(['ALL', 'USER_REGISTRATION', 'RESERVATION', 'ROOM_MODIFICATION'] as ApprovalType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {type === 'ALL' ? 'Tous' : 
                 type === 'USER_REGISTRATION' ? 'Inscriptions' :
                 type === 'RESERVATION' ? 'Réservations' : 'Salles'}
              </button>
            ))}
          </div>
          <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </div>
      </div>

      {/* Liste des demandes en attente */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-900/20">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  En attente de validation ({pendingItems.length})
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Demandes nécessitant votre attention immédiate
                </p>
              </div>
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
          
          {pendingItems.length === 0 ? (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800 text-center">
              <Check className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune demande en attente</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Toutes les demandes ont été traitées. Bon travail !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingItems.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="space-y-6">
                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          request.type === 'USER_REGISTRATION' ? 'bg-blue-100 dark:bg-blue-900' :
                          request.type === 'RESERVATION' ? 'bg-emerald-100 dark:bg-emerald-900' :
                          'bg-purple-100 dark:bg-purple-900'
                        }`}>
                          {getRequestIcon(request.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {getRequestTypeLabel(request.type)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              <TimeDisplay 
                                date={request.submittedAt} 
                                showIcon={false}
                                className="text-sm"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold border-2 border-amber-200 dark:border-amber-800">
                        En attente
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-4">
                      {/* Informations utilisateur */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Demandeur</p>
                            <p className="font-medium text-gray-900 dark:text-white">{request.userName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                          <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Département</p>
                            <p className="font-medium text-gray-900 dark:text-white">{request.department}</p>
                          </div>
                        </div>
                      </div>

                      {/* Informations spécifiques au type */}
                      {request.type === 'RESERVATION' && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-gray-900 dark:text-white">Salle: {request.roomName}</span>
                            </div>
                            {request.date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">Date: {request.date}</span>
                              </div>
                            )}
                            {request.startTime && request.endTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  Heure: {request.startTime} - {request.endTime}
                                </span>
                              </div>
                            )}
                            {request.purpose && (
                              <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span className="font-medium text-gray-900 dark:text-white">Motif:</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 pl-6">{request.purpose}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {request.userEmail && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{request.userEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-xl font-medium transition-all border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Voir détails</span>
                      </button>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(request)}
                          disabled={loadingRequestId === request.id}
                          className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                            loadingRequestId === request.id
                              ? 'bg-emerald-500/50 cursor-not-allowed'
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30'
                          }`}
                        >
                          {loadingRequestId === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Approuver</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectReason('');
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-rose-500/30 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Refuser</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Demandes traitées */}
        {processedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Demandes traitées</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Historique des décisions d'approbation
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Type</th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Utilisateur</th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Département</th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Soumission</th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Statut</th>
                      <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-400 font-bold text-sm">Traité le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedItems.map((request, index) => (
                      <tr 
                        key={request.id} 
                        className={`${
                          index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/30'
                        } hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              request.type === 'USER_REGISTRATION' ? 'bg-blue-100 dark:bg-blue-900' :
                              request.type === 'RESERVATION' ? 'bg-emerald-100 dark:bg-emerald-900' :
                              'bg-purple-100 dark:bg-purple-900'
                            }`}>
                              {getRequestIcon(request.type)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {getRequestTypeLabel(request.type)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{request.userName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{request.userEmail}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{request.department}</td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <TimeDisplay 
                              date={request.submittedAt} 
                              showIcon={false}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            request.status === 'approved' 
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800'
                          }`}>
                            {getStatusLabel(request.status)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {request.reviewedAt ? (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <TimeDisplay 
                                date={request.reviewedAt} 
                                showIcon={false}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de refus */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedRequest(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-300 dark:border-gray-700 shadow-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-900/20">
                    <X className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Refuser la demande</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Veuillez indiquer la raison du refus. Cette raison sera communiquée à l'utilisateur.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                    Raison du refus *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-800 resize-none"
                    placeholder="Expliquez pourquoi cette demande est refusée..."
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Minimum 10 caractères. Cette explication sera envoyée par email à l'utilisateur.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-xl font-bold transition-all border-2 border-gray-300 dark:border-gray-600"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    disabled={!rejectReason.trim() || rejectReason.length < 10}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                      !rejectReason.trim() || rejectReason.length < 10
                        ? 'bg-rose-500/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-rose-500/30'
                    }`}
                  >
                    Confirmer le refus
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovalQueue;