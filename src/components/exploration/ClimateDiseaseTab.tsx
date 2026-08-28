import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Thermometer,
  CloudRain,
  Activity,
  Droplets,
  HelpCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeClimateDiseaseCorrelation,
  computeTemporalSeries,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';

export const ClimateDiseaseTab: React.FC = () => {
  const { analysisDataset, explorationFilters, setExplorationFilters } = useData();

  const [disease, setDisease] = useState<'MALARIA' | 'TYPHOID'>('MALARIA');
  const [climateVar, setClimateVar] = useState<'rainfall_mm' | 'temperature_mean' | 'temperature_max' | 'humidity_percent' | 'rainy_days'>('rainfall_mm');
  const [method, setMethod] = useState<'PEARSON' | 'SPEARMAN'>('PEARSON');

  const correlationResult = useMemo(() => {
    return computeClimateDiseaseCorrelation(
      analysisDataset,
      disease,
      climateVar,
      0, // Lag 0
      method
    );
  }, [analysisDataset, disease, climateVar, method]);

  // Données pour le Scatter Plot (Nuage de points)
  const temporalPoints = useMemo(() => {
    return computeTemporalSeries(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  const scatterData = useMemo(() => {
    return temporalPoints
      .map(p => {
        const yVal = disease === 'MALARIA' ? p.malaria_cases : p.typhoid_cases;
        let xVal: number | null = null;
        if (climateVar === 'rainfall_mm') xVal = p.rainfall_mm;
        else if (climateVar === 'temperature_mean') xVal = p.temperature_mean;
        else if (climateVar === 'temperature_max') xVal = p.temperature_max;
        else if (climateVar === 'humidity_percent') xVal = p.humidity_percent;
        else if (climateVar === 'rainy_days') xVal = p.rainy_days;

        if (yVal === null || xVal === null) return null;

        return {
          period: p.label,
          x: xVal,
          y: yVal,
          year: p.year,
          month: p.month,
        };
      })
      .filter((d): d is { period: string; x: number; y: number; year: number; month: number } => d !== null);
  }, [temporalPoints, disease, climateVar]);

  // Libellés clairs
  const getClimateLabel = (v: string) => {
    switch (v) {
      case 'rainfall_mm': return 'Précipitations (mm / mois)';
      case 'temperature_mean': return 'Température Moyenne (°C)';
      case 'temperature_max': return 'Température Maximale (°C)';
      case 'humidity_percent': return 'Humidité Relative (%)';
      case 'rainy_days': return 'Nombre de jours de pluie';
      default: return v;
    }
  };

  return (
    <div className="space-y-6" id="exploration-climate-disease-tab">
      {/* Contrôles du Test de Corrélation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Choix Maladie */}
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

        {/* Choix Variable Climatique */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Variable Climatique (X) :</span>
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

        {/* Choix Méthode Statistique */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Méthode :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setMethod('PEARSON')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                method === 'PEARSON' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pearson (r)
            </button>
            <button
              onClick={() => setMethod('SPEARMAN')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                method === 'SPEARMAN' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Spearman (ρ)
            </button>
          </div>
        </div>
      </div>

      {/* Cartouche des Résultats Statistiques Rigoureux (Sections 21-25) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Coefficient */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">
            Coefficient {method === 'PEARSON' ? 'de Pearson (r)' : 'de Spearman (ρ)'}
          </span>
          <strong className="text-2xl font-bold font-mono text-emerald-400">
            {correlationResult.r !== null ? (correlationResult.r > 0 ? `+${correlationResult.r}` : correlationResult.r) : '—'}
          </strong>
          <span className="text-[11px] text-slate-500 block mt-1">
            Intensité : {correlationResult.interpretation}
          </span>
        </div>

        {/* Significativité (p-value) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Significativité Statistique</span>
          <strong className={`text-2xl font-bold font-mono ${correlationResult.significant ? 'text-emerald-400' : 'text-slate-400'}`}>
            {correlationResult.p_value !== null ? (correlationResult.p_value < 0.001 ? 'p < 0.001' : `p = ${correlationResult.p_value}`) : '—'}
          </strong>
          <span className="text-[11px] text-slate-400 block mt-1">
            {correlationResult.significant ? '🟢 Significatif au seuil α = 0.05' : '⚪ Non statistiquement significatif'}
          </span>
        </div>

        {/* Intervalle de Confiance 95% */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Intervalle de Confiance (95%)</span>
          <strong className="text-sm font-bold font-mono text-slate-200 block pt-1">
            {correlationResult.ci_95
              ? `[ ${correlationResult.ci_95[0]} ; ${correlationResult.ci_95[1]} ]`
              : 'Non calculable (N insuffisant)'}
          </strong>
          <span className="text-[11px] text-slate-500 block mt-1">
            Précision de l'estimation statistique
          </span>
        </div>

        {/* Taille de l'échantillon N */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">Nombre d'Observations (N)</span>
          <strong className="text-2xl font-bold font-mono text-slate-100">
            {correlationResult.n_observations}
          </strong>
          <span className="text-[11px] text-slate-500 block mt-1">
            Paires appariées spatio-temporelles
          </span>
        </div>
      </div>

      {/* Nuage de Points (Scatter Plot) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              Nuage de Points : {getClimateLabel(climateVar)} vs {disease === 'MALARIA' ? 'Paludisme' : 'Fièvre Typhoïde'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chaque point représente une période mensuelle observée à Kindu.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
            Lag temporel : 0 mois (Synchrone)
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                type="number"
                dataKey="x"
                name={getClimateLabel(climateVar)}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                label={{ value: getClimateLabel(climateVar), position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={disease === 'MALARIA' ? 'Cas de Paludisme' : 'Cas de Typhoïde'}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                label={{ value: disease === 'MALARIA' ? 'Cas de Paludisme' : 'Cas de Typhoïde', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-xs shadow-xl space-y-1">
                        <div className="font-semibold text-emerald-400">{data.period}</div>
                        <div className="text-slate-300">
                          {getClimateLabel(climateVar)} : <strong className="font-mono text-white">{data.x}</strong>
                        </div>
                        <div className="text-slate-300">
                          {disease === 'MALARIA' ? 'Paludisme' : 'Typhoïde'} : <strong className="font-mono text-white">{data.y} cas</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Observations mensuelles"
                data={scatterData}
                fill={disease === 'MALARIA' ? '#ef4444' : '#f59e0b'}
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Rappel épistémique sous graphique */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Rappel scientifique obligatoire :</strong> {correlationResult.scientific_warning}
          </span>
        </div>
      </div>
    </div>
  );
};
