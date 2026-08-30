import React, { useState } from 'react';
import { FieldDataConflict } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface ConflictResolverModalProps {
  conflict: FieldDataConflict | null;
  onClose: () => void;
  onResolve: (conflictId: string, choice: 'LOCAL' | 'SERVER' | 'MERGE', justification: string) => void;
}

export const ConflictResolverModal: React.FC<ConflictResolverModalProps> = ({
  conflict,
  onClose,
  onResolve
}) => {
  const [justification, setJustification] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<'LOCAL' | 'SERVER' | 'MERGE'>('LOCAL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!conflict) return null;

  const handleApplyResolution = () => {
    if (!justification.trim()) {
      setErrorMsg('Veuillez renseigner une justification obligatoire pour la traçabilité de l audit.');
      return;
    }
    onResolve(conflict.id, selectedResolution, justification);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md">
                  CONFLIT DE SYNCHRONISATION
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {conflict.localId} ↔ {conflict.serverId}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Résolution des Divergences de Données
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Déontologique & Anti-Perte */}
        <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-1">
          <strong className="block font-bold">
            🛡️ Règle Fondamentale de Non-Perte des Données Terrain :
          </strong>
          <p className="leading-relaxed text-[11px] text-teal-800">
            Ce questionnaire a été modifié simultanément sur le terminal hors-ligne de l enquêteur (<strong>{conflict.enumeratorName}</strong>) et sur le serveur central. Aucune donnée ne sera supprimée silencieusement.
          </p>
        </div>

        {/* Tableau Comparatif Champ par Champ */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Champs Divergents Détectés ({conflict.conflictingFields.length})
          </span>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-bold text-slate-600">Variable</th>
                  <th className="px-3.5 py-2.5 text-left font-bold text-teal-800 bg-teal-50/50">
                    Version Terminal Local (Hors-Ligne)
                  </th>
                  <th className="px-3.5 py-2.5 text-left font-bold text-blue-800 bg-blue-50/50">
                    Version Serveur Central
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {conflict.conflictingFields.map((cf, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3.5 py-2.5 font-medium text-slate-700">
                      {cf.label}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-teal-900 bg-teal-50/20">
                      {String(cf.localValue)}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-blue-900 bg-blue-50/20">
                      {String(cf.serverValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Choix de la Résolution */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Stratégie d Arbitrage :
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setSelectedResolution('LOCAL')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                selectedResolution === 'LOCAL'
                  ? 'border-teal-500 bg-teal-50/80 ring-2 ring-teal-500/20 text-teal-950'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">1. Conserver Version Locale</span>
                <span className="w-3 h-3 rounded-full border border-teal-600 flex items-center justify-center">
                  {selectedResolution === 'LOCAL' && <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Écrase le serveur avec la dernière saisie de terrain de l enquêteur.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedResolution('SERVER')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                selectedResolution === 'SERVER'
                  ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-950'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">2. Conserver Version Serveur</span>
                <span className="w-3 h-3 rounded-full border border-blue-600 flex items-center justify-center">
                  {selectedResolution === 'SERVER' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Restaure la version validée sur le serveur et annule la modification locale.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedResolution('MERGE')}
              className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                selectedResolution === 'MERGE'
                  ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-950'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">3. Fusion Manuelle</span>
                <span className="w-3 h-3 rounded-full border border-indigo-600 flex items-center justify-center">
                  {selectedResolution === 'MERGE' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Combine les observations les plus complètes avec traçabilité d audit.
              </p>
            </button>
          </div>
        </div>

        {/* Justification Obligatoire */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Motif &amp; Justification Scientifique de l Arbitrage (Obligatoire) *</span>
            <span className="text-[10px] text-slate-400">Enregistré dans le journal d audit</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => {
              setJustification(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="Ex : Validation après appel téléphonique direct avec l enquêteur confirmant 3 cas au TDR..."
            rows={2}
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
          {errorMsg && (
            <p className="text-[11px] text-rose-600 font-bold">{errorMsg}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleApplyResolution}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Appliquer &amp; Synchroniser</span>
          </button>
        </div>

      </div>
    </div>
  );
};
