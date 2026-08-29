import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_SIGNALS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  SurveillanceSignal,
  SurveillanceSignalLevel
} from '../../types';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Info,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  CloudRain,
  Droplets,
  AlertCircle,
  Eye,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SignalsDetectionTabProps {
  selectedZone: string;
  selectedPathology: string;
  onSelectSignalForAlert?: (signal: SurveillanceSignal) => void;
}

export const SignalsDetectionTab: React.FC<SignalsDetectionTabProps> = ({
  selectedZone,
  selectedPathology,
  onSelectSignalForAlert
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<SurveillanceSignal | null>(
    MOCK_SURVEILLANCE_SIGNALS_V117[0] || null
  );

  const filteredSignals = MOCK_SURVEILLANCE_SIGNALS_V117.filter((sig) => {
    if (filterLevel !== 'ALL' && sig.level !== filterLevel) return false;
    if (filterStatus !== 'ALL' && sig.status !== filterStatus) return false;
    return true;
  });

  const getSignalBadge = (level: SurveillanceSignalLevel) => {
    switch (level) {
      case 'SIGNAL_CRITIQUE':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-mono font-bold text-[10px] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>🔴 Signal Critique</span>
          </span>
        );
      case 'SIGNAL_IMPORTANT':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-mono font-bold text-[10px] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>🟠 Signal Important</span>
          </span>
        );
      case 'VIGILANCE':
        return (
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full font-mono font-bold text-[10px] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>🟡 Vigilance</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono font-bold text-[10px] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>🟢 Normal</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête & Filtres */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Détection &amp; Évaluation des Signaux d&apos;Alerte
              </h2>
              <p className="text-xs text-slate-500">
                Surveillance continue par comparaison des observations aux niveaux de base attendus
              </p>
            </div>
          </div>

          {/* Filtres Rapides */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="bg-transparent font-medium text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">Tous les niveaux</option>
                <option value="SIGNAL_CRITIQUE">🔴 Critique</option>
                <option value="SIGNAL_IMPORTANT">🟠 Important</option>
                <option value="VIGILANCE">🟡 Vigilance</option>
                <option value="NORMAL">🟢 Normal</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent font-medium text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="CONVERTI_EN_ALERTE">Converti en Alerte</option>
                <option value="EN_EVALUATION">En Évaluation</option>
                <option value="ACTIF">Actif</option>
                <option value="CLASSE_SANS_SUITE">Classé sans suite</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vue 2 Colonnes : Liste des Signaux (Gauche) + Fiche d'Évaluation Détaillée (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Liste (5/12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Signaux Identifiés ({filteredSignals.length})
          </div>

          <div className="space-y-2.5">
            {filteredSignals.map((sig) => {
              const isSelected = selectedSignal?.id === sig.id;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignal(sig)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {sig.code}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">
                        {sig.pathologyName}
                      </h3>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>Zone {sig.healthZone} ({sig.healthArea})</span>
                      </div>
                    </div>
                    {getSignalBadge(sig.level)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Observé vs Attendu</span>
                      <span className="font-mono font-bold text-slate-800">
                        {sig.observedValue} <span className="text-slate-400 font-normal">vs</span> {sig.expectedValue}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Écart calculé</span>
                      <span className="font-mono font-bold text-rose-700">
                        +{sig.differencePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Confiance : <strong>{sig.confidenceScore}%</strong></span>
                    <span className="text-teal-700 font-bold flex items-center">
                      Détails <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Détail du Signal (7/12) */}
        <div className="lg:col-span-7">
          {selectedSignal ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              
              {/* En-tête fiche signal */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {selectedSignal.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {selectedSignal.period}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedSignal.pathologyName} — {selectedSignal.healthZone} ({selectedSignal.healthArea})
                  </h3>
                </div>
                {getSignalBadge(selectedSignal.level)}
              </div>

              {/* Comparaison Observé vs Attendu & Méthode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Valeur Observée (y)
                  </span>
                  <span className="text-lg font-black font-mono text-teal-900">
                    {selectedSignal.observedValue} <span className="text-xs font-normal text-slate-500">{selectedSignal.unit}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Niveau Attendu (ŷ)
                  </span>
                  <span className="text-lg font-black font-mono text-slate-700">
                    {selectedSignal.expectedValue} <span className="text-xs font-normal text-slate-500">{selectedSignal.unit}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Écart Relatif
                  </span>
                  <span className="text-lg font-black font-mono text-rose-700">
                    +{selectedSignal.differencePercent}%
                  </span>
                </div>
              </div>

              {/* Justification de la Méthode et du Seuil */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Méthode de calcul du niveau de référence : </strong>
                    <span className="text-slate-600 font-mono">{selectedSignal.method}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Seuil d&apos;alerte appliqué : </strong>
                    <span className="text-slate-600">{selectedSignal.thresholdDescription}</span>
                  </div>
                </div>
              </div>

              {/* Audit Qualité des Données & Biais Potentiels */}
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Audit de Qualité des Données &amp; Traçabilité</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Complétude</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedSignal.dataQuality.completenessRate}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Délai Transmission</span>
                    <span className="font-mono font-bold text-slate-800">
                      J+{selectedSignal.dataQuality.transmissionDelayDays}j
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Historique Dispo</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedSignal.dataQuality.historicalYearsAvailable} ans
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Confiance Signal</span>
                    <span className="font-mono font-bold text-teal-700">
                      {selectedSignal.confidenceScore}% ({selectedSignal.confidenceRating})
                    </span>
                  </div>
                </div>

                {selectedSignal.dataQuality.isProxyData && (
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 font-medium">
                    {selectedSignal.dataQuality.proxyWarningNote}
                  </div>
                )}

                {selectedSignal.dataQuality.definitionChanged && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium">
                    {selectedSignal.dataQuality.definitionChangeNote}
                  </div>
                )}
              </div>

              {/* Drivers One Health & Persistance Spatio-Temporelle */}
              <div className="space-y-3 p-4 bg-teal-50/40 rounded-xl border border-teal-200">
                <h4 className="text-xs font-bold text-teal-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-teal-700" />
                  <span>Convergence One Health &amp; Persistance</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium block">Persistance Temporelle :</span>
                    <span className="font-bold text-slate-900">
                      {selectedSignal.persistence.consecutivePeriodsCount} semaines consécutives (Depuis {selectedSignal.persistence.firstDetectedPeriod})
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-medium block">Extension Spatiale :</span>
                    <span className="font-bold text-slate-900">
                      {selectedSignal.spatialExtension.isCluster
                        ? `Cluster actif (touchant ${selectedSignal.spatialExtension.neighboringZonesAffected.join(', ')})`
                        : 'Signal localisé non étendu'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-teal-100 text-[11px] text-teal-900">
                  <strong>Association Lag : </strong>
                  <span>{selectedSignal.oneHealthDrivers.lagAssociationDescription}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Sélectionnez un signal dans la liste pour afficher ses détails d&apos;évaluation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
