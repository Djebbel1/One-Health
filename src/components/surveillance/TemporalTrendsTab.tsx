import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_TIMESERIES_2026
} from '../../data/mockSurveillanceDataV117';
import {
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface TemporalTrendsTabProps {
  selectedZone: string;
}

export const TemporalTrendsTab: React.FC<TemporalTrendsTabProps> = ({
  selectedZone
}) => {
  const [windowSize, setWindowSize] = useState<number>(3);
  const timeseries = MOCK_SURVEILLANCE_TIMESERIES_2026;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tendances Temporelles &amp; Délais de Transmission
            </h2>
            <p className="text-xs text-slate-500">
              Lissage par moyennes mobiles, analyse de persistance et ajustement des retards de déclaration J+N
            </p>
          </div>
        </div>

        {/* Sélecteur de Fenêtre Glissante */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-600 font-medium">Moyenne mobile glissante :</span>
          <select
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-800 text-xs"
          >
            <option value={2}>2 Semaines</option>
            <option value={3}>3 Semaines (Standard)</option>
            <option value={4}>4 Semaines (Mensuel)</option>
          </select>
        </div>
      </div>

      {/* Cartes d'Analyse Temporelle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tendance Hebdomadaire
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-rose-700 font-mono">+14.2%</span>
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">
              Hausse soutenue (3 sem.)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Augmentation progressive dépassant le rythme de variabilité attendu
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Délai Moyen de Transmission
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">J+3.4j</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Dans la cible (&lt;5j)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Ajustement automatique pour ne pas sous-estimer les semaines incomplètes
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Stabilité Historique
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">6 Ans</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              2020 - 2026
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Profondeur historique suffisante pour le calcul des médianes saisonnières
          </p>
        </div>
      </div>

      {/* Tableau d'Analyse Chronologique et Lissage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Série Épidémiologique &amp; Lissage Temporel (Kindu 2026)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Semaine</th>
                <th className="p-3 font-bold">Dates</th>
                <th className="p-3 font-bold">Cas Bruts</th>
                <th className="p-3 font-bold">Moyenne Mobile ({windowSize}s)</th>
                <th className="p-3 font-bold">Attendu Modèle</th>
                <th className="p-3 font-bold">Délai Transmission</th>
                <th className="p-3 font-bold">Complétude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeseries.map((pt, idx) => {
                // Calcul simple de moyenne mobile
                const start = Math.max(0, idx - windowSize + 1);
                const subset = timeseries.slice(start, idx + 1);
                const avg = Math.round(
                  subset.reduce((acc, curr) => acc + curr.observedMalariaCases, 0) / subset.length
                );

                return (
                  <tr key={pt.period} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold font-mono text-slate-900">{pt.period}</td>
                    <td className="p-3 text-slate-500">{pt.dateLabel}</td>
                    <td className="p-3 font-mono font-bold text-teal-900">{pt.observedMalariaCases} cas</td>
                    <td className="p-3 font-mono font-bold text-indigo-700">{avg} cas</td>
                    <td className="p-3 font-mono text-slate-600">{pt.expectedMalariaCases} cas</td>
                    <td className="p-3 font-mono text-slate-600">J+3j</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">{pt.completenessPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Avertissement sur les Données Récentes (Effet de Délai) */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            Prise en Compte des Données Non Consolidées (Semaine en cours S34) :
          </span>
          <p className="text-amber-800 leading-relaxed">
            Les données de la dernière semaine épidémiologique peuvent sembler artificiellement basses en raison des délais de transmission des centres de santé isolés. Le système applique automatiquement un <strong>coefficient correcteur de complétude</strong> pour éviter les fausses chutes d&apos;incidence.
          </p>
        </div>
      </div>
    </div>
  );
};
