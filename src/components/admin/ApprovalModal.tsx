// src/components/admin/ApprovalModal.tsx
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, Calendar, User } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  type: 'approve' | 'reject';
  title: string;
  description: string;
  requestType?: string;
}

export function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  requestType
}: ApprovalModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(notes);
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setNotes('');
  };

  const getRequestTypeIcon = () => {
    switch(requestType) {
      case 'reservation': return <Calendar className="w-5 h-5" />;
      case 'registration': return <User className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={handleCancel}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              type === 'approve' 
                ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-900/20' 
                : 'bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-900/20'
            }`}>
              {type === 'approve' 
                ? <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                : <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              }
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Notes input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              {type === 'approve' ? 'Notes (optionnel)' : 'Raison du refus'}
              {type === 'reject' && <span className="text-rose-500 ml-1">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 resize-none"
              placeholder={type === 'approve' 
                ? 'Ajoutez des notes pour cette approbation...' 
                : 'Expliquez la raison du refus...'
              }
              required={type === 'reject'}
            />
            {type === 'reject' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Cette raison sera communiquée à l'utilisateur
              </p>
            )}
          </div>

          {/* Request type info */}
          {requestType && (
            <div className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  {getRequestTypeIcon()}
                </div>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">Type de demande</p>
                  <p className="font-medium text-blue-900 dark:text-blue-200">
                    {requestType === 'reservation' ? 'Réservation de salle' :
                     requestType === 'registration' ? 'Inscription utilisateur' : 'Modification'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning message for reject */}
          {type === 'reject' && (
            <div className="p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Attention
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    Le refus d'une demande est définitif. L'utilisateur en sera notifié par email.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t-2 border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-xl font-bold transition-all border-2 border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={(type === 'reject' && !notes.trim()) || isSubmitting}
            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
              type === 'approve'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/30'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-rose-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {type === 'approve' ? 'Approbation...' : 'Refus...'}
              </span>
            ) : (
              type === 'approve' ? 'Approuver' : 'Refuser'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}