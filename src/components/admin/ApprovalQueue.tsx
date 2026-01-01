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
  Target
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
        return <User className="w-5 h-5 text-blue-400" />;
      case 'RESERVATION':
        return <Calendar className="w-5 h-5 text-emerald-400" />;
      case 'ROOM_MODIFICATION':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">File d'attente des approbations</h2>
          <p className="text-white/60 mt-1">
            {pendingItems.length} demande(s) en attente • {processedItems.length} traitée(s)
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-white/40" />
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {(['ALL', 'USER_REGISTRATION', 'RESERVATION', 'ROOM_MODIFICATION'] as ApprovalType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === type
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {type === 'ALL' ? 'Tous' : 
                 type === 'USER_REGISTRATION' ? 'Inscriptions' :
                 type === 'RESERVATION' ? 'Réservations' : 'Salles'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Liste des demandes en attente */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            En attente de validation ({pendingItems.length})
          </h3>
          
          {pendingItems.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center">
              <Check className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Aucune demande en attente</h4>
              <p className="text-white/60">
                Toutes les demandes ont été traitées. Bon travail !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingItems.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="space-y-4">
                    {/* En-tête */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                          {getRequestIcon(request.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {getRequestTypeLabel(request.type)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-white/40" />
                            <TimeDisplay 
                              date={request.submittedAt} 
                              showIcon={false}
                              className="text-sm text-white/50"
                            />
                          </div>
                        </div>
                      </div>
                      <StatusBadge 
                        status="pending" 
                        label="En attente"
                        size="sm"
                      />
                    </div>

                    {/* Détails */}
                    <div className="space-y-3">
                      {/* Informations utilisateur */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-white/60" />
                          <span className="text-white">{request.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/60" />
                          <span className="text-white/70 text-sm">{request.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-white/60" />
                          <span className="text-white/70 text-sm">{request.department}</span>
                        </div>
                      </div>

                      {/* Informations spécifiques au type */}
                      {request.type === 'RESERVATION' && (
                        <div className="p-3 bg-white/5 rounded-xl space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-white/60" />
                            <span className="text-white/70 text-sm">Salle: {request.roomName}</span>
                          </div>
                          {request.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-white/60" />
                              <span className="text-white/70 text-sm">Date: {request.date}</span>
                            </div>
                          )}
                          {request.startTime && request.endTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-white/60" />
                              <span className="text-white/70 text-sm">
                                Heure: {request.startTime} - {request.endTime}
                              </span>
                            </div>
                          )}
                          {request.purpose && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-white/60" />
                                <span className="text-white/60 text-sm">Motif:</span>
                              </div>
                              <p className="text-white/70 text-sm pl-6">{request.purpose}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Détails</span>
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request)}
                          disabled={loadingRequestId === request.id}
                          className={`px-4 py-2 ${
                            loadingRequestId === request.id
                              ? 'bg-emerald-500/30 cursor-not-allowed'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30'
                          } text-emerald-300 border border-emerald-500/30 rounded-lg font-medium transition-all flex items-center gap-2`}
                        >
                          {loadingRequestId === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-300"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="hidden sm:inline">Approuver</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectReason('');
                          }}
                          className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg font-medium transition-all flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span className="hidden sm:inline">Refuser</span>
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
            <h3 className="text-lg font-semibold text-white mb-4">Demandes traitées</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Département</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Date soumission</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Statut</th>
                    <th className="text-left py-3 px-4 text-white/60 font-medium">Traité le</th>
                  </tr>
                </thead>
                <tbody>
                  {processedItems.map((request) => (
                    <tr key={request.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getRequestIcon(request.type)}
                          <span className="text-white">{getRequestTypeLabel(request.type)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white">{request.userName}</p>
                          <p className="text-sm text-white/50">{request.userEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/70">{request.department}</td>
                      <td className="py-3 px-4">
                        <TimeDisplay 
                          date={request.submittedAt} 
                          showIcon={false}
                          className="text-sm text-white/50"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge 
                          status={request.status === 'approved' ? 'success' : 'error'}
                          label={getStatusLabel(request.status)}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {request.reviewedAt ? (
                          <TimeDisplay 
                            date={request.reviewedAt} 
                            showIcon={false}
                            className="text-sm text-white/50"
                          />
                        ) : (
                          <span className="text-sm text-white/50">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de refus */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSelectedRequest(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-rose-500/20">
                    <X className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Refuser la demande</h3>
                    <p className="text-white/60 text-sm">Veuillez indiquer la raison du refus</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Raison du refus *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30"
                    placeholder="Expliquez pourquoi cette demande est refusée..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    disabled={!rejectReason.trim()}
                    className={`flex-1 py-3 ${
                      !rejectReason.trim()
                        ? 'bg-rose-500/30 cursor-not-allowed'
                        : 'bg-rose-500 hover:bg-rose-600'
                    } text-white rounded-xl font-medium transition-all`}
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