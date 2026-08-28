import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Calendar,
  CloudRain,
  Sun,
  Activity,
  Droplets,
  Layers,
  Info,
  TrendingUp
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeSeasonalMonthlyProfiles,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';
import { SeasonalMonthlyProfile } from '../../types';

export const SeasonalTab: React.FC = () => {
  const { analysisDataset, explorationFilters } = useData();

  const [diseaseChoice, setDiseaseChoice] = useState<'MALARIA' | 'TYPHOID'>('MALARIA');
  const [viewMode, setViewMode] = useState<'AVERAGE' | 'MULTI_YEAR'>('AVERAGE');

  const monthlyProfiles = useMemo(() => {
    return computeSeasonalMonthlyProfiles(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  // Données pour superposition multi-années
  const multiYearData = useMemo(() => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    return months.map(m => {
      const getYearVal = (yr: number) => {
        const rows = analysisDataset.filter(r => r.year === yr && r.month === m);
        if (rows.length === 0) return null;
        if (diseaseChoice === 'MALARIA') {
          const valid = rows.filter(r => r.malaria_cases !== null);
          return valid.length > 0 ? valid.reduce((s, r) => s + (r.malaria_cases || 0), 0) : null;
        } else {
          const valid = rows.filter(r => r.typhoid_cases !== null);
          return valid.length > 0 ? valid.reduce((s, r) => s + (r.typhoid_cases || 0), 0) : null;
        }
      };

      const prof = monthlyProfiles.find(p => p.month === m);

      return {
        month: m,
        monthName: monthLabels[m - 1],
        season: prof?.season || 'Saison des pluies',
        avg: diseaseChoice === 'MALARIA' ? prof?.avg_malaria_cases : prof?.avg_typhoid_cases,
        y2023: getYearVal(2023),
        y2024: getYearVal(2024),
        y2025: getYearVal(2025),
        rainfall: prof?.avg_rainfall_mm,
      };
    });
  }, [analysisDataset, monthlyProfiles, diseaseChoice]);

  // Identification des mois de pic et de creux
  const statsSummary = useMemo(() => {
    const valid = monthlyProfiles.filter(p => (diseaseChoice === 'MALARIA' ? p.avg_malaria_cases : p.avg_typhoid_cases) !== null);
    if (valid.length === 0) return { peakMonth: '—', troughMonth: '—', peakVal: 0, troughVal: 0 };

    const sorted = [...valid].sort((a, b) => {
      const valA = diseaseChoice === 'MALARIA' ? (a.avg_malaria_cases || 0) : (a.avg_typhoid_cases || 0);
      const valB = diseaseChoice === 'MALARIA' ? (b.avg_malaria_cases || 0) : (b.avg_typhoid_cases || 0);
      return valB - valA;
    });

    const peak = sorted[0];
    const trough = sorted[sorted.length - 1];

    return {
      peakMonth: peak.monthName,
      peakVal: diseaseChoice === 'MALARIA' ? peak.avg_malaria_cases : peak.avg_typhoid_cases,
      troughMonth: trough.monthName,
      troughVal: diseaseChoice === 'MALARIA' ? trough.avg_malaria_cases : trough.avg_typhoid_cases
    };
  }, [monthlyProfiles, diseaseChoice]);

  return (
    <div className="space-y-6" id="exploration-seasonal-tab">
      {/* Contrôles Saisonniers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Pathologie :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setDiseaseChoice('MALARIA')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'MALARIA' ? 'bg-red-950 text-red-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme (Vectoriel)
            </button>
            <button
              onClick={() => setDiseaseChoice('TYPHOID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'TYPHOID' ? 'bg-amber-950 text-amber-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fièvre Typhoïde (Hydrique)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Type de visualisation :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setViewMode('AVERAGE')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'AVERAGE' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Profil Moyen Annuel (Jan-Déc)
            </button>
            <button
              onClick={() => setViewMode('MULTI_YEAR')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'MULTI_YEAR' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Superposition Interannuelle (2023-2025)
            </button>
          </div>
        </div>
      </div>

      {/* Cartouches Saisonniers Synthétiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/50">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Saison des Pluies (Kindu)</span>
            <strong className="text-sm font-semibold text-slate-100">Septembre – Mai</strong>
            <span className="text-[11px] text-blue-300 block">Précipitations &gt; 150 mm / mois</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/50">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Saison Sèche (Kindu)</span>
            <strong className="text-sm font-semibold text-slate-100">Juin – Août</strong>
            <span className="text-[11px] text-amber-300 block">Baisse hydrologique & étiage</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Extrema Observés ({diseaseChoice === 'MALARIA' ? 'Paludisme' : 'Typhoïde'})</span>
            <span className="text-xs font-semibold text-slate-200 block">
              Pic : <strong className="text-red-400 font-mono">{statsSummary.peakMonth}</strong> (~{statsSummary.peakVal} cas)
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Creux : {statsSummary.troughMonth} (~{statsSummary.troughVal} cas)
            </span>
          </div>
        </div>
      </div>

      {/* Graphique Profil Saisonnier */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {viewMode === 'AVERAGE'
                ? `Profil Saisonnier Moyen Mensuel (Janvier à Décembre) — ${diseaseChoice === 'MALARIA' ? 'Paludisme' : 'Fièvre Typhoïde'}`
                : `Comparaison Interannuelle des Courbes Mensuelles (2023 vs 2024 vs 2025)`}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'AVERAGE'
                ? 'Moyenne arithmétique multi-années des cas observés superposée aux précipitations mensuelles moyennes (Kindu).'
                : 'Tracé superposé des années civiles pour détecter la reproductibilité des pics et creux saisonniers.'}
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
            Profil calculé
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'AVERAGE' ? (
              <BarChart data={multiYearData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="monthName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Cas moyens', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#60a5fa"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Pluie (mm)', angle: 90, position: 'insideRight', fill: '#60a5fa', fontSize: 11 }}
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
                <Bar
                  yAxisId="left"
                  dataKey="avg"
                  name={diseaseChoice === 'MALARIA' ? 'Paludisme (Moyenne mensuelle)' : 'Typhoïde (Moyenne mensuelle)'}
                  fill={diseaseChoice === 'MALARIA' ? '#ef4444' : '#f59e0b'}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  name="Précipitations moyennes (mm)"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </BarChart>
            ) : (
              <LineChart data={multiYearData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="monthName" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
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
                <Line type="monotone" dataKey="y2023" name="Année 2023" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="y2024" name="Année 2024" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="y2025" name="Année 2025" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="3 3" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            Principe méthodologique : Les profils saisonniers sont des agrégats descriptifs et ne constituent pas une prévision déterministe.
          </span>
          <span className="font-mono text-slate-300">12 mois de référence (Jan-Déc)</span>
        </div>
      </div>
    </div>
  );
};
