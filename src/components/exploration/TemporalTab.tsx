import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Droplets,
  Calendar,
  Layers,
  HelpCircle,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { computeTemporalSeries, CAUSALITY_DISCLAIMER } from '../../utils/spatiotemporalExplorationEngine';
import { TemporalPoint } from '../../types';

export const TemporalTab: React.FC = () => {
  const { analysisDataset, explorationFilters, setExplorationFilters } = useData();

  // Mode d'affichage maladie
  const [diseaseView, setDiseaseView] = useState<'BOTH' | 'MALARIA' | 'TYPHOID'>('BOTH');
  // Granularité temporelle : Mensuelle, Trimestrielle, Annuelle
  const [granularity, setGranularity] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');
  // Afficher cas confirmés vs totaux
  const [showConfirmed, setShowConfirmed] = useState<boolean>(true);
  // Afficher incidence populationnelle vs cas bruts
  const [metricMode, setMetricMode] = useState<'CASES' | 'INCIDENCE'>('CASES');

  const temporalSeries = useMemo(() => {
    return computeTemporalSeries(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  // Agrégation selon granularité
  const chartData = useMemo(() => {
    if (granularity === 'MONTHLY') {
      return temporalSeries.map(p => ({
        ...p,
        displayLabel: p.label,
        malaria_val: metricMode === 'CASES' ? p.malaria_cases : p.malaria_incidence,
        malaria_conf_val: metricMode === 'CASES' ? p.malaria_confirmed : null,
        malaria_ma_val: p.malaria_ma,
        typhoid_val: metricMode === 'CASES' ? p.typhoid_cases : p.typhoid_incidence,
        typhoid_conf_val: metricMode === 'CASES' ? p.typhoid_confirmed : null,
        typhoid_ma_val: p.typhoid_ma,
      }));
    }

    if (granularity === 'QUARTERLY') {
      const qMap = new Map<string, {
        year: number;
        quarter: number;
        malSum: number;
        malConf: number;
        typSum: number;
        typConf: number;
        popSum: number;
        count: number;
      }>();

      for (const p of temporalSeries) {
        const qKey = `${p.year}-T${p.quarter}`;
        if (!qMap.has(qKey)) {
          qMap.set(qKey, {
            year: p.year,
            quarter: p.quarter,
            malSum: 0,
            malConf: 0,
            typSum: 0,
            typConf: 0,
            popSum: 0,
            count: 0
          });
        }
        const obj = qMap.get(qKey)!;
        if (p.malaria_cases !== null) obj.malSum += p.malaria_cases;
        if (p.malaria_confirmed !== null) obj.malConf += p.malaria_confirmed;
        if (p.typhoid_cases !== null) obj.typSum += p.typhoid_cases;
        if (p.typhoid_confirmed !== null) obj.typConf += p.typhoid_confirmed;
        obj.count++;
      }

      return Array.from(qMap.entries()).map(([k, v]) => ({
        displayLabel: `${v.year} T${v.quarter}`,
        malaria_val: v.malSum,
        malaria_conf_val: v.malConf,
        typhoid_val: v.typSum,
        typhoid_conf_val: v.typConf,
        observations_count: v.count
      }));
    }

    // YEARLY
    const yMap = new Map<number, {
      malSum: number;
      malConf: number;
      typSum: number;
      typConf: number;
      count: number;
    }>();

    for (const p of temporalSeries) {
      if (!yMap.has(p.year)) {
        yMap.set(p.year, { malSum: 0, malConf: 0, typSum: 0, typConf: 0, count: 0 });
      }
      const obj = yMap.get(p.year)!;
      if (p.malaria_cases !== null) obj.malSum += p.malaria_cases;
      if (p.malaria_confirmed !== null) obj.malConf += p.malaria_confirmed;
      if (p.typhoid_cases !== null) obj.typSum += p.typhoid_cases;
      if (p.typhoid_confirmed !== null) obj.typConf += p.typhoid_confirmed;
      obj.count++;
    }

    return Array.from(yMap.entries()).map(([y, v]) => ({
      displayLabel: `Année ${y}`,
      malaria_val: v.malSum,
      malaria_conf_val: v.malConf,
      typhoid_val: v.typSum,
      typhoid_conf_val: v.typConf,
      observations_count: v.count
    }));
  }, [temporalSeries, granularity, metricMode]);

  // Évaluation automatique de la tendance temporelle
  const trendEvaluation = useMemo(() => {
    if (temporalSeries.length < 6) return { status: 'INDETERMINEE', text: 'Couverture temporelle insuffisante pour estimer une tendance.' };
    const firstHalf = temporalSeries.slice(0, Math.floor(temporalSeries.length / 2));
    const secondHalf = temporalSeries.slice(Math.floor(temporalSeries.length / 2));

    const mean1 = firstHalf.reduce((s, p) => s + (p.malaria_cases || 0), 0) / firstHalf.length;
    const mean2 = secondHalf.reduce((s, p) => s + (p.malaria_cases || 0), 0) / secondHalf.length;

    const diff = mean2 - mean1;
    if (Math.abs(diff) / (mean1 || 1) < 0.1) {
      return { status: 'STABLE', text: 'Tendance globale stable sur la période observée (variation < 10%).' };
    }
    return diff > 0
      ? { status: 'AUGMENTATION', text: 'Tendance exploratoire à la hausse entre la première et seconde moitié de la série.' }
      : { status: 'DIMINUTION', text: 'Tendance exploratoire à la baisse observée sur la seconde moitié de la série.' };
  }, [temporalSeries]);

  return (
    <div className="space-y-6" id="exploration-temporal-tab">
      {/* Contrôles de la Série Temporelle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Sélecteur de maladie */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Pathologies affichées :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setDiseaseView('BOTH')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseView === 'BOTH' ? 'bg-slate-700 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme & Typhoïde
            </button>
            <button
              onClick={() => setDiseaseView('MALARIA')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseView === 'MALARIA' ? 'bg-red-950 text-red-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme seul
            </button>
            <button
              onClick={() => setDiseaseView('TYPHOID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseView === 'TYPHOID' ? 'bg-amber-950 text-amber-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Typhoïde seule
            </button>
          </div>
        </div>

        {/* Granularité */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Échelle de temps :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setGranularity('MONTHLY')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                granularity === 'MONTHLY' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setGranularity('QUARTERLY')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                granularity === 'QUARTERLY' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setGranularity('YEARLY')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                granularity === 'YEARLY' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Année
            </button>
          </div>
        </div>

        {/* Métrique */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Métrique :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setMetricMode('CASES')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                metricMode === 'CASES' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cas Enregistrés
            </button>
            <button
              onClick={() => setMetricMode('INCIDENCE')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                metricMode === 'INCIDENCE' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Incidence (/1 000 hab.)
            </button>
          </div>
        </div>

        {/* Option cas confirmés */}
        {metricMode === 'CASES' && (
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showConfirmed}
              onChange={(e) => setShowConfirmed(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
            />
            Afficher sous-courbe cas confirmés
          </label>
        )}
      </div>

      {/* Graphique d'Évolution Temporelle Principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Évolution Chronologique des Maladies Infectieuses (Kindu, 2023-2025)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {metricMode === 'CASES' ? 'Nombre absolu de cas observés par pas temporel' : 'Taux d’incidence mensuel estimé pour 1 000 habitants'}
              {explorationFilters.movingAverageMonths > 0 && (
                <span className="ml-2 font-mono text-emerald-400 font-medium">
                  • Moyenne Mobile {explorationFilters.movingAverageMonths} Mois (VARIABLE CALCULÉE)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>N = {chartData.length} périodes</span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="displayLabel"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={granularity === 'MONTHLY' ? 2 : 0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                domain={[0, 'auto']}
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

              {/* PALUDISME */}
              {(diseaseView === 'BOTH' || diseaseView === 'MALARIA') && (
                <Line
                  type="monotone"
                  dataKey="malaria_val"
                  name={metricMode === 'CASES' ? 'Paludisme (Total cas)' : 'Paludisme (Incidence /1000)'}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ef4444' }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              )}

              {/* PALUDISME CONFIRMÉ */}
              {(diseaseView === 'BOTH' || diseaseView === 'MALARIA') && showConfirmed && metricMode === 'CASES' && (
                <Line
                  type="monotone"
                  dataKey="malaria_conf_val"
                  name="Paludisme (Confirmés TDR)"
                  stroke="#f87171"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls={false}
                />
              )}

              {/* MOYENNE MOBILE PALUDISME */}
              {(diseaseView === 'BOTH' || diseaseView === 'MALARIA') && explorationFilters.movingAverageMonths > 0 && granularity === 'MONTHLY' && (
                <Line
                  type="monotone"
                  dataKey="malaria_ma_val"
                  name={`Paludisme (Moy. Mob. ${explorationFilters.movingAverageMonths}M)`}
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={false}
                />
              )}

              {/* TYPHOÏDE */}
              {(diseaseView === 'BOTH' || diseaseView === 'TYPHOID') && (
                <Line
                  type="monotone"
                  dataKey="typhoid_val"
                  name={metricMode === 'CASES' ? 'Fièvre Typhoïde (Total cas)' : 'Typhoïde (Incidence /1000)'}
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f59e0b' }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
              )}

              {/* TYPHOÏDE CONFIRMÉE */}
              {(diseaseView === 'BOTH' || diseaseView === 'TYPHOID') && showConfirmed && metricMode === 'CASES' && (
                <Line
                  type="monotone"
                  dataKey="typhoid_conf_val"
                  name="Typhoïde (Confirmés)"
                  stroke="#fbbf24"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls={false}
                />
              )}

              {/* MOYENNE MOBILE TYPHOÏDE */}
              {(diseaseView === 'BOTH' || diseaseView === 'TYPHOID') && explorationFilters.movingAverageMonths > 0 && granularity === 'MONTHLY' && (
                <Line
                  type="monotone"
                  dataKey="typhoid_ma_val"
                  name={`Typhoïde (Moy. Mob. ${explorationFilters.movingAverageMonths}M)`}
                  stroke="#d97706"
                  strokeWidth={3}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Note méthodologique sous graphique */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            Règle V1.9 : Les pathologies sont toujours tracées sous des courbes indépendantes (jamais additionnées en une entité artificielle).
          </span>
          <span className="font-mono text-slate-300">
            Tendance estimée : <strong className="text-emerald-400">{trendEvaluation.status}</strong>
          </span>
        </div>
      </div>

      {/* Bilan des Tendances & Données Manquantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Analyse Exploratoire des Tendances
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {trendEvaluation.text}
          </p>
          <div className="mt-3 text-[11px] text-slate-500 italic">
            Les tendances observées doivent être confrontées aux variations de complétude de déclaration des structures de soins.
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Gestion des Données Irrégulières & Discontinuités
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Les mois sans déclaration ne sont pas remplacés par des zéros arbitraires. La courbe préserve les ruptures temporelles (points NULL) pour garantir l'intégrité scientifique.
          </p>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            {temporalSeries.filter(p => p.malaria_cases === null).length} périodes sans données de paludisme documentées.
          </div>
        </div>
      </div>
    </div>
  );
};
