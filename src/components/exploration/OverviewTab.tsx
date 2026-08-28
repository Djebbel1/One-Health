import React, { useMemo } from 'react';
import {
  Activity,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeTemporalSeries,
  computeSpatialAreaStats,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';
import { KINDU_HEALTH_AREAS } from '../../data/kinduData';

export const OverviewTab: React.FC = () => {
  const { analysisDataset, explorationFilters, selectedDatasetVersion } = useData();

  const temporalPoints = useMemo(() => {
    return computeTemporalSeries(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  const spatialStats = useMemo(() => {
    return computeSpatialAreaStats(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  // Agrégats Paludisme
  const malariaTotal = useMemo(() => {
    return spatialStats.reduce((sum, s) => sum + s.total_malaria_cases, 0);
  }, [spatialStats]);

  const malariaConfirmed = useMemo(() => {
    return spatialStats.reduce((sum, s) => sum + s.total_malaria_confirmed, 0);
  }, [spatialStats]);

  const malariaAreasCovered = useMemo(() => {
    return spatialStats.filter(s => s.total_malaria_cases > 0).length;
  }, [spatialStats]);

  // Agrégats Typhoïde
  const typhoidTotal = useMemo(() => {
    return spatialStats.reduce((sum, s) => sum + s.total_typhoid_cases, 0);
  }, [spatialStats]);

  const typhoidConfirmed = useMemo(() => {
    return spatialStats.reduce((sum, s) => sum + s.total_typhoid_confirmed, 0);
  }, [spatialStats]);

  const typhoidAreasCovered = useMemo(() => {
    return spatialStats.filter(s => s.total_typhoid_cases > 0).length;
  }, [spatialStats]);

  // Climat
  const climatePeriodsCount = temporalPoints.filter(p => p.rainfall_mm !== null).length;
  const climateObsCount = analysisDataset.filter(r => r.rainfall_mm !== null).length;

  // Qualité
  const overallCompleteness = useMemo(() => {
    if (analysisDataset.length === 0) return 0;
    const sum = analysisDataset.reduce((acc, r) => acc + r.data_completeness, 0);
    return Math.round(sum / analysisDataset.length);
  }, [analysisDataset]);

  const wellDocumentedAreas = spatialStats.filter(s => s.coverage_status === 'BONNE');
  const partialDocumentedAreas = spatialStats.filter(s => s.coverage_status === 'PARTIELLE');
  const poorlyDocumentedAreas = spatialStats.filter(s => s.coverage_status === 'FAIBLE' || s.coverage_status === 'ABSENTE');

  return (
    <div className="space-y-6" id="exploration-overview-tab">
      {/* Bannière d'Avertissement Scientifique Obligatoire (Section 3 & 47) */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold uppercase tracking-wider block mb-0.5">
            Principe Épistémologique & Avertissement Méthodologique (V1.9)
          </strong>
          {CAUSALITY_DISCLAIMER}
          <span className="block mt-1 text-amber-300/80 font-mono text-[11px]">
            Distinction stricte : OBSERVATION ≠ ASSOCIATION STATISTIQUE ≠ CAUSALITÉ. Aucune relation unilatérale n'est affirmée automatiquement.
          </span>
        </div>
      </div>

      {/* Grille des 4 Piliers One Health Kindu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PALUDISME */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-950/50 text-red-400 border border-red-800/50">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Paludisme (Malaria)</h3>
                <span className="text-[11px] text-slate-400 font-mono">Transmission vectorielle</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 font-medium">Y₁(s,t)</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total cas enregistrés :</span>
              <span className="font-bold text-slate-100 text-sm font-mono">{malariaTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cas confirmés (TDR/Goutte) :</span>
              <span className="font-semibold text-emerald-400 font-mono">{malariaConfirmed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Périodes mensuelles :</span>
              <span className="text-slate-200 font-mono">{temporalPoints.length} mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Aires de santé couvertes :</span>
              <span className="text-slate-200 font-mono">{malariaAreasCovered} / {KINDU_HEALTH_AREAS.length} AS</span>
            </div>
          </div>
        </div>

        {/* 2. FIÈVRE TYPHOÏDE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-950/50 text-amber-400 border border-amber-800/50">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Fièvre Typhoïde</h3>
                <span className="text-[11px] text-slate-400 font-mono">Péril fécal / hydrique</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-medium">Y₂(s,t)</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total cas enregistrés :</span>
              <span className="font-bold text-slate-100 text-sm font-mono">{typhoidTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cas confirmés (Widal/Culture) :</span>
              <span className="font-semibold text-emerald-400 font-mono">{typhoidConfirmed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Périodes mensuelles :</span>
              <span className="text-slate-200 font-mono">{temporalPoints.length} mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Aires de santé couvertes :</span>
              <span className="text-slate-200 font-mono">{typhoidAreasCovered} / {KINDU_HEALTH_AREAS.length} AS</span>
            </div>
          </div>
        </div>

        {/* 3. DONNÉES CLIMATIQUES */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-950/50 text-blue-400 border border-blue-800/50">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Données Climatiques</h3>
                <span className="text-[11px] text-slate-400 font-mono">Station Kindu & ERA5</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-medium">Covariables</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Période temporelle :</span>
              <span className="text-slate-200 font-mono">2023 - 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Observations climatiques :</span>
              <span className="font-bold text-slate-100 font-mono">{climateObsCount} enregistrements</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Périodes renseignées :</span>
              <span className="text-slate-200 font-mono">{climatePeriodsCount} mois continus</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Variables clés :</span>
              <span className="text-blue-300 font-medium">Pluie, T°(Moy/Max), Humidité</span>
            </div>
          </div>
        </div>

        {/* 4. QUALITÉ & COUVERTURE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Qualité & Couverture</h3>
                <span className="text-[11px] text-slate-400 font-mono">Rigueur épistémique</span>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-medium">
              {overallCompleteness}%
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Bien documentées :
              </span>
              <span className="font-semibold text-slate-200">{wellDocumentedAreas.length} AS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Partielles :
              </span>
              <span className="font-semibold text-slate-200">{partialDocumentedAreas.length} AS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Insuffisantes / Absentes :
              </span>
              <span className="font-semibold text-slate-200">{poorlyDocumentedAreas.length} AS</span>
            </div>
            <div className="pt-1 text-[11px] text-slate-400 italic">
              Traçabilité : {analysisDataset.length} unités spatio-temporelles
            </div>
          </div>
        </div>
      </div>

      {/* Tableau Synthétique de Documentation par Aire de Santé */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Répartition & Statut de Documentation des 10 Aires de Santé de Kindu
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Vue synthétique exploratoire combinant effectifs cumulés, incidences brutes et taux d'exhaustivité spatio-temporelle.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
            Source active : {selectedDatasetVersion}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="p-3 font-semibold">Aire de Santé</th>
                <th className="p-3 font-semibold">Zone</th>
                <th className="p-3 font-semibold text-right">Population</th>
                <th className="p-3 font-semibold text-right text-red-400">Paludisme (Cas)</th>
                <th className="p-3 font-semibold text-right text-red-300">Incidence (/1000)</th>
                <th className="p-3 font-semibold text-right text-amber-400">Typhoïde (Cas)</th>
                <th className="p-3 font-semibold text-right text-amber-300">Incidence (/1000)</th>
                <th className="p-3 font-semibold text-center">Périodes</th>
                <th className="p-3 font-semibold text-center">Couverture</th>
                <th className="p-3 font-semibold text-center">Statut Qualité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {spatialStats.map((as) => (
                <tr key={as.aire_sante_id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-sans font-medium text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    {as.aire_sante_name}
                  </td>
                  <td className="p-3 font-sans text-slate-400">{as.zone_sante_id === 'ZS_KINDU' ? 'Kindu' : 'Alunguli'}</td>
                  <td className="p-3 text-right text-slate-300">{as.population.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold text-red-400">{as.total_malaria_cases.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-300">{as.malaria_incidence_per_1000 !== null ? `${as.malaria_incidence_per_1000} ‰` : '—'}</td>
                  <td className="p-3 text-right font-semibold text-amber-400">{as.total_typhoid_cases.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-300">{as.typhoid_incidence_per_1000 !== null ? `${as.typhoid_incidence_per_1000} ‰` : '—'}</td>
                  <td className="p-3 text-center text-slate-400">{as.periods_covered} / {as.total_periods}</td>
                  <td className="p-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {as.coverage_percentage}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {as.coverage_status === 'BONNE' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        🟢 Suffisante
                      </span>
                    )}
                    {as.coverage_status === 'PARTIELLE' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        🟠 Partielle
                      </span>
                    )}
                    {(as.coverage_status === 'FAIBLE' || as.coverage_status === 'ABSENTE') && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                        🔴 Insuffisante
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
