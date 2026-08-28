import React, { useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Info,
  Layers,
  MapPin
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { computeSpatialAreaStats, CAUSALITY_DISCLAIMER } from '../../utils/spatiotemporalExplorationEngine';
import { KINDU_HEALTH_AREAS } from '../../data/kinduData';

export const QualityCoverageTab: React.FC = () => {
  const { analysisDataset, explorationFilters, selectedDatasetVersion } = useData();

  const spatialStats = useMemo(() => {
    return computeSpatialAreaStats(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  // Statistiques de complétude par variable
  const variableCompleteness = useMemo(() => {
    if (analysisDataset.length === 0) return [];
    const total = analysisDataset.length;

    const computeRate = (fn: (r: any) => boolean) => {
      const valid = analysisDataset.filter(fn).length;
      return {
        count: valid,
        total,
        rate: Math.round((valid / total) * 100)
      };
    };

    return [
      { name: 'Paludisme - Total des cas', category: 'Santé (DHIS2)', ...computeRate(r => r.malaria_cases !== null) },
      { name: 'Paludisme - Cas confirmés (TDR)', category: 'Santé (DHIS2)', ...computeRate(r => r.malaria_confirmed !== null) },
      { name: 'Fièvre Typhoïde - Total des cas', category: 'Santé (DHIS2)', ...computeRate(r => r.typhoid_cases !== null) },
      { name: 'Fièvre Typhoïde - Cas confirmés', category: 'Santé (DHIS2)', ...computeRate(r => r.typhoid_confirmed !== null) },
      { name: 'Précipitations mensuelles (mm)', category: 'Climat (Kindu/ERA5)', ...computeRate(r => r.rainfall_mm !== null) },
      { name: 'Température moyenne (°C)', category: 'Climat (Kindu/ERA5)', ...computeRate(r => r.temperature_mean !== null) },
      { name: 'Température maximale (°C)', category: 'Climat (Kindu/ERA5)', ...computeRate(r => r.temperature_max !== null) },
      { name: 'Humidité relative (%)', category: 'Climat (Kindu/ERA5)', ...computeRate(r => r.humidity_percent !== null) },
      { name: 'Couverture Eau Potable (WASH %)', category: 'Enquêtes / Terrain', ...computeRate(r => r.water_access_percent !== null) },
      { name: 'Accès Assainissement (% latrines)', category: 'Enquêtes / Terrain', ...computeRate(r => r.sanitation_access_percent !== null) },
    ];
  }, [analysisDataset]);

  return (
    <div className="space-y-6" id="exploration-quality-tab">
      {/* Avertissement de Biais Épidémiologique */}
      <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold uppercase tracking-wider block mb-0.5">
            Avertissement sur les Biais de Couverture & de Déclaration
          </strong>
          Une absence de cas observés ou une faible incidence apparente ne signifie pas nécessairement une absence réelle de transmission si le taux de complétude des structures de soins locales est bas. Toute interprétation doit être pondérée par la qualité et la continuité des données.
        </div>
      </div>

      {/* Grille des Taux de Complétude par Variable */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Taux de Complétude par Variable Analytique
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Proportion d'enregistrements valides (non NULL) dans le jeu de données actif ({selectedDatasetVersion}).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-300 px-3 py-1 bg-slate-800 rounded border border-slate-700">
            N = {analysisDataset.length} unités spatio-temporelles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variableCompleteness.map(v => (
            <div key={v.name} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">{v.name}</span>
                <span className="font-mono font-bold text-slate-100">{v.rate}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    v.rate >= 90 ? 'bg-emerald-500' : v.rate >= 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${v.rate}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>{v.category}</span>
                <span>{v.count} / {v.total} valides</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matrice de Couverture des 10 Aires de Santé */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Matrice de Couverture Temporelle par Aire de Santé (36 Mois)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Évaluation de la continuité temporelle des déclarations sanitaires (2023 - 2025).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="p-3 font-semibold">Aire de Santé</th>
                <th className="p-3 font-semibold">Zone</th>
                <th className="p-3 font-semibold text-center">Mois Renseignés</th>
                <th className="p-3 font-semibold text-center">Mois Manquants</th>
                <th className="p-3 font-semibold text-center">Taux de Couverture</th>
                <th className="p-3 font-semibold text-center">Évaluation Statistique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {spatialStats.map(as => {
                const missing = as.total_periods - as.periods_covered;
                return (
                  <tr key={as.aire_sante_id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-medium text-slate-200">{as.aire_sante_name}</td>
                    <td className="p-3 font-sans text-slate-400">{as.zone_sante_id === 'ZS_KINDU' ? 'Kindu' : 'Alunguli'}</td>
                    <td className="p-3 text-center text-slate-200 font-semibold">{as.periods_covered} mois</td>
                    <td className="p-3 text-center text-amber-400">{missing > 0 ? `${missing} mois` : '0 (Complet)'}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded font-bold ${
                        as.coverage_percentage >= 85 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        as.coverage_percentage >= 60 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-red-950 text-red-300 border border-red-800'
                      }`}>
                        {as.coverage_percentage}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-sans text-[11px]">
                      {as.coverage_status === 'BONNE' && <span className="text-emerald-400 font-medium">Éligible à la modélisation statistique avancée</span>}
                      {as.coverage_status === 'PARTIELLE' && <span className="text-amber-400 font-medium">Interprétation prudente requise</span>}
                      {(as.coverage_status === 'FAIBLE' || as.coverage_status === 'ABSENTE') && <span className="text-red-400 font-medium">Biais de sous-déclaration majeur</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
