import React, { useState } from 'react';
import { AlertTriangle, X, Send, ShieldAlert } from 'lucide-react';
import { EnvironmentalObservation } from '../../types';
import { useData } from '../../context/DataContext';

interface EnvironmentalRejectModalProps {
  observation: EnvironmentalObservation | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (obsId: string, reason: string) => void;
}

export const EnvironmentalRejectModal: React.FC<EnvironmentalRejectModalProps> = ({
  observation,
  isOpen,
  onClose,
  onConfirmReject
}) => {
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen || !observation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Le motif du rejet est obligatoire pour assurer la traçabilité scientifique.');
      return;
    }
    onConfirmReject(observation.id, reason.trim());
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 text-rose-700">
            <div className="p-2 rounded-xl bg-rose-100">
              <ShieldAlert className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Rejeter l'observation {observation.id}
              </h3>
              <p className="text-xs text-slate-500">
                Action réservée aux superviseurs scientifiques
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Observation Summary */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Facteur observé :</span>
            <strong className="text-slate-900">{observation.factor_type}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Localisation :</span>
            <span className="text-slate-700">{observation.health_area_id} • {observation.neighborhood_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Enquêteur :</span>
            <span className="text-slate-700">{observation.surveyor_id}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Motif argumenté du rejet <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Précisez la non-conformité : imprécision GPS excessive non justifiée, incohérence temporelle, description ambiguë, etc."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-hidden"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Cette mention sera archivée dans le journal d'audit avec la date et votre identifiant.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirmer le rejet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
