import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  Clock,
  Activity,
  Droplets,
  HelpCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeClimateDiseaseCorrelation,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';
import { CorrelationTestResult } from '../../types';

export const LagsTab: React.FC = () => {
  const { analysisDataset } = useData();

  const [disease, setDisease] = useState<'MALARIA' | 'TYPHOID'>('MALARIA');
  const [climateVar, setClimateVar] = useState<'rainfall_mm' | 'temperature_mean' | 'temperature_max' | 'humidity_percent' | 'rainy_days'>('rainfall_mm');
  const [method, setMethod] = useState<'PEARSON' | 'SPEARMAN'>('PEARSON');
  const [correctionMethod, setCorrectionMethod] = useState<'BONFERRONI' | 'FDR' | 'NONE'>('BONFERRONI');

  // Calcul des corrélations pour Lags 0 à 6
  const lagResults: CorrelationTestResult[] = useMemo(() => {
    const lags = [0, 1, 2, 3, 4, 5, 6];
    const rawResults = lags.map(lag => {
      return computeClimateDiseaseCorrelation(
        analysisDataset,
        disease,
        climateVar,
        lag,
        method
      );
    });

    // Application de la correction des tests multiples
    const m = rawResults.length; // 7 tests
    return rawResults.map((res, idx) => {
      if (res.p_value === null) return res;

      let adjustedP = res.p_value;
      if (correctionMethod === 'BONFERRONI') {
        adjustedP = Math.min(1.0, Number((res.p_value * m).toFixed(4)));
      } else if (correctionMethod === 'FDR') {
        // Benjamini-Hochberg simplifié pour 7 tests
        const rank = idx + 1;
        adjustedP = Math.min(1.0, Number(((res.p_value * m) / rank).toFixed(4)));
      }

      return {
        ...res,
        p_value: adjustedP,
        significant: adjustedP < 0.05,
        interpretation: adjustedP < 0.05 ? res.interpretation : `${res.interpretation} (non significatif après correction)`
      };
    });
  }, [analysisDataset, disease, climateVar, method, correctionMethod]);

  // Détection du lag optimal (max |r| avec p < 0.05)
  const optimalLag = useMemo(() => {
    const valid = lagResults.filter(r => r.r !== null && r.significant);
    if (valid.length === 0) {
      // Aucun significatif, on prend le max absolu avec avertissement
      const allValid = lagResults.filter(r => r.r !== null);
      if (allValid.length === 0) return null;
      allValid.sort((a, b) => Math.abs(b.r || 0) - Math.abs(a.r || 0));
      return { ...allValid[0], optimalNote: 'Non significatif au seuil corrigé' };
    }
    valid.sort((a, b) => Math.abs(b.r || 0) - Math.abs(a.r || 0));
    return { ...valid[0], optimalNote: 'Association maximale statistiquement significative' };
  }, [lagResults]);

  // Données pour le bar chart
  const barData = useMemo(() => {
    return lagResults.map(r => ({
      lagLabel: `Lag ${r.lag_months} (${r.lag_months === 0 ? 'Synchrone' : `-${r.lag_months} mois`})`,
      lag: r.lag_months,
      r: r.r,
      significant: r.significant,
      p_value: r.p_value,
      n_obs: r.n_observations
    }));
  }, [lagResults]);

  const getClimateLabel = (v: string) => {
    switch (v) {
      case 'rainfall_mm': return 'Précipitations (mm)';
      case 'temperature_mean': return 'Température Moyenne (°C)';
      case 'temperature_max': return 'Température Maximale (°C)';
      case 'humidity_percent': return 'Humidité Relative (%)';
      case 'rainy_days': return 'Jours de pluie';
      default: return v;
    }
  };

  return (
    <div className="space-y-6" id="exploration-lags-tab">
      {/* Contrôles d'Analyse des Lags */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Pathologie :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setDisease('MALARIA')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                disease === 'MALARIA' ? 'bg-red-950 text-red-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme
            </button>
            <button
              onClick={() => setDisease('TYPHOID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                disease === 'TYPHOID' ? 'bg-amber-950 text-amber-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fièvre Typhoïde
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Variable Climat :</span>
          <select
            value={climateVar}
            onChange={(e) => setClimateVar(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="rainfall_mm">Précipitations (mm)</option>
            <option value="temperature_mean">Température Moyenne (°C)</option>
            <option value="temperature_max">Température Maximale (°C)</option>
            <option value="humidity_percent">Humidité Relative (%)</option>
            <option value="rainy_days">Jours de pluie</option>
          </select>
        </div>

        {/* Correction comparaisons multiples */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Correction Multi-tests :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setCorrectionMethod('BONFERRONI')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                correctionMethod === 'BONFERRONI' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bonferroni (Conservateur)
            </button>
            <button
              onClick={() => setCorrectionMethod('FDR')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                correctionMethod === 'FDR' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FDR (Benjamini-H.)
            </button>
            <button
              onClick={() => setCorrectionMethod('NONE')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                correctionMethod === 'NONE' ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Brute (Sans corr.)
            </button>
          </div>
        </div>
      </div>

      {/* Cartouche du Décalage Optimal Observé */}
      {optimalLag && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Décalage Temporel Optimal Détecté (Lags 0 à 6 mois)
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Lag {optimalLag.lag_months} mois
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-100">
              « Association maximale observée avec un décalage de {optimalLag.lag_months} mois (r = {optimalLag.r}, p = {optimalLag.p_value}) »
            </p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {optimalLag.scientific_warning}
            </p>
          </div>
        </div>
      )}

      {/* Graphique Comparatif des Coefficients de Corrélation par Lag */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Corrélogramme Temporel Décalé : {getClimateLabel(climateVar)} vs {disease === 'MALARIA' ? 'Paludisme' : 'Fièvre Typhoïde'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Évalue la force de l'association entre le climat au temps (t - k) et la morbidité observée au temps (t).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> p &lt; 0.05</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-600"></span> Non sign.</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="lagLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                domain={[-1, 1]}
                ticks={[-1, -0.5, 0, 0.5, 1]}
                label={{ value: 'Coefficient r', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
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
              <Bar dataKey="r" name="Coefficient de corrélation (r)" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.significant ? '#10b981' : '#475569'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tableau Récapitulatif des 7 Lags */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                <th className="p-2.5 font-semibold">Décalage (Lag k)</th>
                <th className="p-2.5 font-semibold text-right">Coefficient (r)</th>
                <th className="p-2.5 font-semibold text-right">p-value ({correctionMethod})</th>
                <th className="p-2.5 font-semibold text-center">Intervalle IC 95%</th>
                <th className="p-2.5 font-semibold text-center">Observations (N)</th>
                <th className="p-2.5 font-semibold">Interprétation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {lagResults.map(r => (
                <tr key={r.lag_months} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 text-slate-200 font-sans font-medium">
                    Lag {r.lag_months} mois {r.lag_months === 0 && '(Synchrone)'}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-100">
                    {r.r !== null ? (r.r > 0 ? `+${r.r}` : r.r) : '—'}
                  </td>
                  <td className="p-2.5 text-right">
                    <span className={r.significant ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {r.p_value !== null ? (r.p_value < 0.001 ? '< 0.001' : r.p_value) : '—'}
                    </span>
                  </td>
                  <td className="p-2.5 text-center text-slate-400">
                    {r.ci_95 ? `[${r.ci_95[0]} ; ${r.ci_95[1]}]` : '—'}
                  </td>
                  <td className="p-2.5 text-center text-slate-300">{r.n_observations}</td>
                  <td className="p-2.5 font-sans text-slate-400 text-[11px]">{r.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
