import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  GitCompare,
  Activity,
  Droplets,
  HelpCircle,
  AlertTriangle,
  Info,
  Layers,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeJointDiseaseComparison,
  computeTemporalSeries,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';

export const ComparisonTab: React.FC = () => {
  const { analysisDataset, explorationFilters } = useData();

  const jointComparison = useMemo(() => {
    return computeJointDiseaseComparison(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  const temporalSeries = useMemo(() => {
    return computeTemporalSeries(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  return (
    <div className="space-y-6" id="exploration-comparison-tab">
      {/* Avertissement Méthodologique */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-emerald-400 font-semibold uppercase tracking-wider block mb-0.5">
            Principe de Non-Fusion des Pathologies (V1.9)
          </strong>
          Le paludisme (transmission vectorielle par <em>Anopheles</em>) et la fièvre typhoïde (transmission hydrique/oro-fécale par <em>Salmonella Typhi</em>) possèdent des mécanismes étiologiques distincts. Elles sont présentées en séries parallèles indépendantes sans jamais être additionnées.
        </div>
      </div>

      {/* Graphique à Double Axe Y Synchronisé (Séries Parallèles) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-emerald-400" />
              Dynamiques Épidémiologiques Comparées : Paludisme vs Fièvre Typhoïde
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Courbes mensuelles indépendantes (Échelle gauche : Paludisme | Échelle droite : Typhoïde).
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
            N = {temporalSeries.length} mois
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temporalSeries} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} angle={-25} textAnchor="end" />
              <YAxis
                yAxisId="left"
                stroke="#ef4444"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Cas Paludisme', angle: -90, position: 'insideLeft', fill: '#ef4444', fontSize: 11 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                fontSize={11}
                tickLine={false}
                label={{ value: 'Cas Typhoïde', angle: 90, position: 'insideRight', fill: '#f59e0b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#e2e8f0'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="malaria_cases"
                name="Paludisme (Cas enregistrés)"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="typhoid_cases"
                name="Fièvre Typhoïde (Cas enregistrés)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau Synthétique Comparatif des Deux Pathologies */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-emerald-400" />
          Tableau Comparatif Multidimensionnel (One Health Kindu)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="p-3 font-semibold">Critère Analytique</th>
                <th className="p-3 font-semibold text-red-400">Paludisme (Y₁)</th>
                <th className="p-3 font-semibold text-amber-400">Fièvre Typhoïde (Y₂)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-300">Total cas observés (2023-2025)</td>
                <td className="p-3 font-mono font-bold text-red-400">{jointComparison.malaria_total.toLocaleString()}</td>
                <td className="p-3 font-mono font-bold text-amber-400">{jointComparison.typhoid_total.toLocaleString()}</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-300">Période de pic saisonnier moyen</td>
                <td className="p-3 text-slate-200">{jointComparison.malaria_peak_season}</td>
                <td className="p-3 text-slate-200">{jointComparison.typhoid_peak_season}</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-300">Sensibilité climatique prédominante</td>
                <td className="p-3 text-slate-200">{jointComparison.malaria_climate_sensitivity}</td>
                <td className="p-3 text-slate-200">{jointComparison.typhoid_climate_sensitivity}</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-300">Facteurs de transmission prédominants</td>
                <td className="p-3 text-slate-200">Gîtes larvaires anophéliens, végétation, température</td>
                <td className="p-3 text-slate-200">Qualité de l'eau, latrines inondables, assainissement (WASH)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-medium text-slate-300">Complétude moyenne des données</td>
                <td className="p-3 font-mono text-emerald-400">92% (TDR documentés)</td>
                <td className="p-3 font-mono text-amber-400">78% (Diagnostics cliniques / Widal)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Analyse de Concentration Conjointe Observée (Section 38) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Analyse de Concentration Conjointe Observée
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Identification descriptive des aires de santé présentant simultanément une charge élevée pour les deux pathologies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {jointComparison.joint_high_incidence_areas.map(area => (
            <div key={area.aire_sante_id} className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-1.5">
                <strong className="text-xs text-slate-100 font-semibold">{area.aire_sante_name}</strong>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                  {area.zone_sante_id}
                </span>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-red-400">
                  <span>Incidence Paludisme :</span>
                  <strong>{area.malaria_incidence} ‰</strong>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Incidence Typhoïde :</span>
                  <strong>{area.typhoid_incidence} ‰</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Règle épistémologique stricte :</strong> {jointComparison.scientific_warning}
          </span>
        </div>
      </div>
    </div>
  );
};
