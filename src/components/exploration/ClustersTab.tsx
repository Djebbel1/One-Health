import React, { useState, useMemo } from 'react';
import {
  Layers,
  MapPin,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Info,
  Flame,
  Snowflake,
  BarChart2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeSpatialClusters,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';
import { KINDU_HEALTH_AREAS } from '../../data/kinduData';

export const ClustersTab: React.FC = () => {
  const { analysisDataset, explorationFilters } = useData();

  const [diseaseChoice, setDiseaseChoice] = useState<'MALARIA' | 'TYPHOID'>('MALARIA');

  const clusterResult = useMemo(() => {
    return computeSpatialClusters(analysisDataset, diseaseChoice, explorationFilters);
  }, [analysisDataset, diseaseChoice, explorationFilters]);

  return (
    <div className="space-y-6" id="exploration-clusters-tab">
      {/* Contrôles d'Analyse des Clusters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Pathologie analysée :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setDiseaseChoice('MALARIA')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'MALARIA' ? 'bg-red-950 text-red-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme (Taux d'Incidence)
            </button>
            <button
              onClick={() => setDiseaseChoice('TYPHOID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'TYPHOID' ? 'bg-amber-950 text-amber-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fièvre Typhoïde (Taux d'Incidence)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Méthodes : Moran's I Global • LISA Local • Getis-Ord Gi*</span>
        </div>
      </div>

      {/* Vérification des Conditions Préalables Rigoureuses (Section 31) */}
      {!clusterResult.conditions_met ? (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
            Conditions Statistiques Non Réunies
          </h3>
          <p className="text-xs text-amber-200/90 max-w-xl mx-auto leading-relaxed">
            {clusterResult.error_message || 'Le nombre d’unités spatiales avec données complètes est insuffisant (N < 4) pour calculer un indice spatialement valide.'}
          </p>
          <div className="text-[11px] text-amber-400/80 font-mono">
            Règle de précaution : Aucun calcul forcé ni interpolation artificielle pour éviter la génération de clusters fantômes.
          </div>
        </div>
      ) : (
        <>
          {/* Cartouches Moran's I Global */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Indice de Moran Global (I)</span>
              <strong className="text-2xl font-bold font-mono text-emerald-400">
                {clusterResult.morans_i !== null ? (clusterResult.morans_i > 0 ? `+${clusterResult.morans_i}` : clusterResult.morans_i) : '—'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">
                Autocorrélation spatiale globale
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Score Z (Normalisé)</span>
              <strong className="text-2xl font-bold font-mono text-slate-100">
                {clusterResult.z_score !== null ? clusterResult.z_score : '—'}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">
                Écart à l'hypothèse nulle (aléatoire)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">p-value</span>
              <strong className={`text-2xl font-bold font-mono ${clusterResult.p_value !== null && clusterResult.p_value < 0.05 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {clusterResult.p_value !== null ? (clusterResult.p_value < 0.001 ? '< 0.001' : clusterResult.p_value) : '—'}
              </strong>
              <span className="text-[11px] text-slate-400 block mt-1">
                {clusterResult.p_value !== null && clusterResult.p_value < 0.05 ? '🟢 Significatif (α = 0.05)' : '⚪ Non significatif'}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-slate-400 block mb-1">Structure Spatiale Détectée</span>
              <strong className="text-sm font-semibold text-slate-200 block pt-1">
                {clusterResult.global_interpretation}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">
                N = {clusterResult.units_count} aires de santé
              </span>
            </div>
          </div>

          {/* Tableau Détaillé des Indicateurs Locaux (LISA & Getis-Ord Gi*) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Typologie Spatiale Locale par Aire de Santé (LISA & Getis-Ord Gi*)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Identification des concentrations locales observées (Points chauds / Points froids).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-red-400">
                  <Flame className="w-3.5 h-3.5" /> High-High (Hotspot)
                </span>
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Snowflake className="w-3.5 h-3.5" /> Low-Low (Coldspot)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                    <th className="p-3 font-semibold">Aire de Santé</th>
                    <th className="p-3 font-semibold">Zone</th>
                    <th className="p-3 font-semibold text-right">Incidence (/1000)</th>
                    <th className="p-3 font-semibold text-center">Score LISA (Ii)</th>
                    <th className="p-3 font-semibold text-center">Typologie LISA</th>
                    <th className="p-3 font-semibold text-center">Score Gi* (Getis-Ord)</th>
                    <th className="p-3 font-semibold text-center">Statut Observé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {clusterResult.local_clusters.map(loc => (
                    <tr key={loc.aire_sante_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans font-medium text-slate-200">{loc.aire_sante_name}</td>
                      <td className="p-3 font-sans text-slate-400">{loc.zone_sante_id === 'ZS_KINDU' ? 'Kindu' : 'Alunguli'}</td>
                      <td className="p-3 text-right font-bold text-slate-200">{loc.incidence_val !== null ? `${loc.incidence_val} ‰` : '—'}</td>
                      <td className="p-3 text-center text-slate-300">{loc.lisa_i !== null ? loc.lisa_i : '—'}</td>
                      <td className="p-3 text-center">
                        {loc.cluster_type === 'HIGH_HIGH' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-950/80 text-red-300 border border-red-800/60">
                            <Flame className="w-3 h-3 text-red-400" /> High-High (Concentration forte)
                          </span>
                        )}
                        {loc.cluster_type === 'LOW_LOW' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                            <Snowflake className="w-3 h-3 text-blue-400" /> Low-Low (Concentration faible)
                          </span>
                        )}
                        {loc.cluster_type === 'HIGH_LOW' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                            High-Low (Isolat élevé)
                          </span>
                        )}
                        {loc.cluster_type === 'LOW_HIGH' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                            Low-High (Isolat bas)
                          </span>
                        )}
                        {loc.cluster_type === 'NOT_SIGNIFICANT' && (
                          <span className="text-slate-500 text-[11px]">Pas de regroupement significatif</span>
                        )}
                        {loc.cluster_type === 'INSUFFICIENT_DATA' && (
                          <span className="text-amber-500/80 text-[11px]">Données insuffisantes</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-slate-300">
                        {loc.getis_ord_gi !== null ? loc.getis_ord_gi : '—'}
                      </td>
                      <td className="p-3 text-center font-sans text-[11px] text-slate-300">
                        {loc.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note épistémique obligatoire */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Prudence épistémologique :</strong> {clusterResult.scientific_warning}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
