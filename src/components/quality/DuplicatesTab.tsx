import React, { useState } from 'react';
import {
  Copy,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  Eye,
  ShieldAlert,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DuplicateCandidateV18 } from '../../types';

export const DuplicatesTab: React.FC = () => {
  const { duplicateCandidates, resolveDuplicate } = useData();
  const [selectedCandidate, setSelectedCandidate] = useState<DuplicateCandidateV18 | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const pendingDuplicates = duplicateCandidates.filter(d => d.status === 'POTENTIAL_DUPLICATE');
  const resolvedDuplicates = duplicateCandidates.filter(d => d.status !== 'POTENTIAL_DUPLICATE');

  const handleAction = (status: 'MERGED' | 'CONFIRMED_SEPARATE') => {
    if (!selectedCandidate) return;
    resolveDuplicate(
      selectedCandidate.id,
      status,
      resolutionNotes || (status === 'MERGED' ? 'Fusion validée par le superviseur' : 'Confirmé comme enregistrement distinct légitime')
    );
    setSelectedCandidate(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* DIRECTIVE SCIENTIFIQUE : ZÉRO SUPPRESSION AUTOMATIQUE (Section 9, 10) */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block text-sm mb-0.5">⚠️ Règle de Non-Suppression Automatique des Doublons (V1.8)</span>
          Un enregistrement en doublon potentiel ne doit <strong>jamais être supprimé automatiquement</strong> de la table brute <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">RAW_DATA</code>. Il est isolé sous le statut <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">POTENTIAL_DUPLICATE</code> pour être soumis à l’arbitrage humain d’un épidémiologiste ou gestionnaire de données.
        </div>
      </div>

      {/* STATUTS & CRITÈRES DE DÉTECTION (Section 11) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Santé
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Même aire de santé + même mois/année + même pathologie + même FOSA.</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Climat
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Même station synoptique + même mois/année.</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Environnement
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Même position GPS (&plusmn;5m) + même type de facteur de risque.</p>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Enquêtes Ménages
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Même aire + même nom de chef de ménage + même quartier.</p>
        </div>
      </div>

      {/* LISTE DES DOUBLONS POTENTIELS EN ATTENTE */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Copy className="w-4 h-4 text-amber-600" />
              <span>Candidats Doublons en Attente d'Arbitrage ({pendingDuplicates.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ces enregistrements ont été isolés pour arbitrage sans altérer la table source.
            </p>
          </div>
        </div>

        {pendingDuplicates.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-500 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            Aucun doublon en attente. Tous les enregistrements vérifiés sont uniques ou déjà arbitrés.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
            {pendingDuplicates.map(candidate => (
              <div key={candidate.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                      {candidate.table_name}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{candidate.id}</span>
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                      Score : {candidate.confidence_score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{candidate.detected_reason}</p>
                  <div className="text-[10px] text-slate-500 font-mono">
                    IDs impactés : {candidate.record_ids.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Examiner & Arbitrer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL / PANNEAU D'ARBITRAGE DU DOUBLON */}
      {selectedCandidate && (
        <div className="p-5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
              <GitMerge className="w-4 h-4" />
              <span>Arbitrage Épidémiologique : {selectedCandidate.id}</span>
            </h4>
            <button
              onClick={() => setSelectedCandidate(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Fermer &times;
            </button>
          </div>

          <div className="bg-slate-800 p-3.5 rounded-lg text-xs space-y-2 border border-slate-700">
            <div className="text-slate-300">
              <strong className="text-white">Table source :</strong> {selectedCandidate.table_name}
            </div>
            <div className="text-slate-300">
              <strong className="text-white">Critères de concordance :</strong> {selectedCandidate.match_criteria.join(', ')}
            </div>
            <div className="text-slate-300">
              <strong className="text-white">Enregistrements concernés :</strong> {selectedCandidate.record_ids.join(', ')}
            </div>
            <div className="text-slate-300">
              <strong className="text-white">Diagnostic du moteur :</strong> {selectedCandidate.detected_reason}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Justification / Note d'arbitrage (consignée dans TRANSFORMATION_LOG) :
            </label>
            <input
              type="text"
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="Ex: Fusion confirmée après contrôle du registre papier FOSA / ou 2 patients homonymes distincts"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => handleAction('CONFIRMED_SEPARATE')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Confirmer Séparation Légitime
            </button>
            <button
              onClick={() => handleAction('MERGED')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Valider Fusion (Sans écraser RAW)</span>
            </button>
          </div>
        </div>
      )}

      {/* HISTORIQUE DES ARBITRAGES RÉALISÉS */}
      {resolvedDuplicates.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Historique des Doublons Arbitrés ({resolvedDuplicates.length})
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            {resolvedDuplicates.map(res => (
              <div key={res.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{res.id}</span> —{' '}
                  <span className="text-slate-600">{res.resolution_notes}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
