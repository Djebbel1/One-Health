import React, { useState } from 'react';
import {
  FieldTeam,
  FieldEnumerator,
  FieldFormRecord,
  FieldAssignment
} from '../../types';
import {
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Eye,
  Layers,
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';

interface SupervisionTabProps {
  teams: FieldTeam[];
  enumerators: FieldEnumerator[];
  forms: FieldFormRecord[];
  assignments: FieldAssignment[];
  onSelectFormForReview?: (form: FieldFormRecord) => void;
}

export const SupervisionTab: React.FC<SupervisionTabProps> = ({
  teams,
  enumerators,
  forms,
  assignments,
  onSelectFormForReview
}) => {
  const [selectedMapFilter, setSelectedMapFilter] = useState<'ALL' | 'VALIDE' | 'EN_CONTROLE' | 'PENDING'>('ALL');

  // Enquêteurs en retard de synchronisation (> 2 formulaires en attente ou déconnectés)
  const delayedEnumerators = enumerators.filter(
    (e) => e.pendingSyncCount >= 3 || e.connectionState === 'OFFLINE'
  );

  // Formulaires nécessitant une attention du superviseur
  const flaggedForms = forms.filter(
    (f) => f.qualityChecks.hasInconsistencies || f.status === 'EN_CONTROLE' || f.syncStatus === 'CONFLICT'
  );

  const filteredMapForms = forms.filter((f) => {
    if (selectedMapFilter === 'VALIDE') return f.status === 'VALIDE' || f.status === 'VERROUILLE';
    if (selectedMapFilter === 'EN_CONTROLE') return f.status === 'EN_CONTROLE';
    if (selectedMapFilter === 'PENDING') return f.syncStatus === 'PENDING';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* En-tête Cockpit */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Supervision
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Cockpit en Temps Réel &amp; Suivi Territorial</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Cockpit de Supervision &amp; Monitoring Terrain
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des brigades, détection des retards de transmission et contrôle de complétude par secteur.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-800">
              {enumerators.filter((e) => e.connectionState === 'ONLINE').length} Agents en Ligne
            </span>
          </div>
        </div>
      </div>

      {/* Alertes Supervision & Retards */}
      {delayedEnumerators.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <strong className="text-xs font-bold text-amber-900">
                Alertes Retard de Synchronisation / Enquêteurs Isolés ({delayedEnumerators.length})
              </strong>
            </div>
            <span className="text-[10px] text-amber-700 font-medium">
              Vérifier la connectivité locale à Kindu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {delayedEnumerators.map((enq) => (
              <div
                key={enq.id}
                className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{enq.displayName}</span>
                  <span className="text-[10px] text-slate-500">
                    {enq.teamName} • Zone : {enq.assignedZones.join(', ')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono font-bold rounded text-[10px] block">
                    {enq.pendingSyncCount} non sync
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Dernière : {enq.lastSyncTimestamp || 'Inconnue'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carte Visuelle Interactive des Points de Collecte (Kindu / Maniema) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Cartographie Interactive des Enquêtes Géocodées (Kindu - Fleuve Congo)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Affichage des coordonnées réelles capturées par les terminaux des enquêteurs
            </p>
          </div>

          {/* Filtres de Carte */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setSelectedMapFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedMapFilter === 'ALL'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tous ({forms.length})
            </button>
            <button
              onClick={() => setSelectedMapFilter('VALIDE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedMapFilter === 'VALIDE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Validés 🟢
            </button>
            <button
              onClick={() => setSelectedMapFilter('EN_CONTROLE')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedMapFilter === 'EN_CONTROLE'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              En Contrôle 🟠
            </button>
          </div>
        </div>

        {/* Visualiseur Cartographique Styled */}
        <div className="h-64 w-full bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center p-4 border border-slate-800">
          
          {/* Grille de fond cartographique */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Fleuve Congo Stylisé */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
            <path
              d="M 100,0 Q 250,120 400,100 T 700,200 T 1000,260"
              fill="none"
              stroke="#0284c7"
              strokeWidth="18"
            />
          </svg>

          <div className="absolute top-3 left-3 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] text-slate-300 font-mono">
            Territoire : Kindu (Kasuku, Tokolote, Mikelenge, Alunguli)
          </div>

          {/* Points de Collecte Positionnés */}
          <div className="relative w-full h-full flex items-center justify-around">
            {filteredMapForms.map((f, idx) => {
              const isGreen = f.status === 'VALIDE' || f.status === 'VERROUILLE';
              const isAmber = f.status === 'EN_CONTROLE' || f.syncStatus === 'CONFLICT';
              const isRed = f.syncStatus === 'ERROR';

              return (
                <div
                  key={f.localId}
                  className="group relative cursor-pointer transform hover:scale-125 transition duration-200"
                  onClick={() => onSelectFormForReview && onSelectFormForReview(f)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      isGreen ? 'bg-emerald-500' : isAmber ? 'bg-amber-500 animate-pulse' : isRed ? 'bg-rose-500' : 'bg-teal-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Tooltip Hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:block z-20 bg-slate-900 text-white text-[10px] p-2 rounded-xl border border-slate-700 shadow-xl whitespace-nowrap">
                    <span className="font-bold text-teal-400 block">{f.householdCode || f.localId}</span>
                    <span>{f.healthArea} • {f.enumeratorName}</span>
                    <span className="text-slate-400 block mt-0.5">Paludisme : {f.formData.casesCountMalaria} | Typhoïde : {f.formData.casesCountTyphoid}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-[10px] text-slate-300 flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Validé</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>En Contrôle</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>En Attente Sync</span>
            </span>
          </div>
        </div>
      </div>

      {/* Formulaires Nécessitant Révision */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Questionnaires en Attente d Arbitrage ou Anomalies ({flaggedForms.length})
          </h3>
          <span className="text-[11px] text-slate-400">Revue Qualité Prioritaire</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {flaggedForms.map((f) => (
            <div
              key={f.localId}
              className="p-4 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-teal-900">{f.localId}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-slate-800">{f.householdCode || 'Sans code'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{f.enumeratorName}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {f.qualityChecks.auditReason || f.qualityChecks.inconsistencyList.join(' | ')}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                  {f.status}
                </span>
                {onSelectFormForReview && (
                  <button
                    onClick={() => onSelectFormForReview(f)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl text-xs transition"
                  >
                    Examiner
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
