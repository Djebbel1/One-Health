import React from 'react';
import {
  MOCK_SURVEILLANCE_TIMESERIES_2026
} from '../../data/mockSurveillanceDataV117';
import {
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  AlertTriangle,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ClimateSurveillanceTabProps {
  selectedZone: string;
}

export const ClimateSurveillanceTab: React.FC<ClimateSurveillanceTabProps> = ({
  selectedZone
}) => {
  const timeseries = MOCK_SURVEILLANCE_TIMESERIES_2026;

  return (
    <div className="space-y-6">
      {/* En-tête & Station Météo Kindu Aéro */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Surveillance Climatique &amp; Hydrologique
            </h2>
            <p className="text-xs text-slate-500">
              Station Kindu-Aérodrome (FZAG) &amp; Réanalyses ECMWF ERA5 — Suivi des anomalies et alertes météo
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-lg font-mono font-bold border border-indigo-200">
            Dernière sync météo : 29 Août 2026
          </span>
        </div>
      </div>

      {/* 3 Cartes de Variables Climatiques Majeures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Précipitations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Précipitations Cumulées
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              168 mm
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-mono">
              +88 mm vs normale (S29)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Excès pluviométrique précurseur de mise en eau des gîtes larvaires
          </p>
        </div>

        {/* Température Moyenne */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Température Moyenne
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              28.4°C
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-mono">
              +1.2°C vs historique
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Plage thermique optimale pour la sporogonie de <em>Plasmodium falciparum</em>
          </p>
        </div>

        {/* Humidité Relative */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Humidité Relative
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              84.2%
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-mono">
              Favorise la survie anophélienne
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Condition hygrométrique prolongeant la longévité des vecteurs adultes
          </p>
        </div>

      </div>

      {/* Tableau des Relevés et Anomalies Climatiques par Semaine */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Série Temporelle des Anomalies Climatiques (S25 - S34 2026)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Comparaison systématique aux normales de référence (2020-2025)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Période</th>
                <th className="p-3 font-bold">Précipitations Observées</th>
                <th className="p-3 font-bold">Normale Historique</th>
                <th className="p-3 font-bold">Anomalie Pluie</th>
                <th className="p-3 font-bold">Température Moyenne</th>
                <th className="p-3 font-bold">Impact Estimé (One Health)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeseries.map((pt) => {
                const diffRain = pt.rainfallMm - pt.rainfallNormalMm;
                return (
                  <tr key={pt.period} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold text-slate-900 font-mono">{pt.period}</td>
                    <td className="p-3 font-mono font-bold text-indigo-800">
                      {pt.rainfallMm} mm
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {pt.rainfallNormalMm} mm
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {diffRain > 20 ? (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          +{diffRain} mm (Excès fort)
                        </span>
                      ) : diffRain < -10 ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {diffRain} mm (Déficit)
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          +{diffRain} mm (Normal)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-700">{pt.temperatureC} °C</td>
                    <td className="p-3 text-[11px] text-slate-600">
                      {diffRain > 40
                        ? 'Formation massive de flaques & gîtes larvaires'
                        : 'Conditions climatiques moyennes'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Encadré d'Explication du Lag Climatique One Health */}
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            Principe de l&apos;Association Retardée (Lag 1 Mois) :
          </span>
          <p className="text-indigo-800 leading-relaxed">
            Le modèle statistique validé (V1.16) intègre un <strong>décalage de 4 semaines (Lag 1 mois)</strong> entre le pic des précipitations et l&apos;explosion du nombre de cas de paludisme. Ce délai correspond au cycle biologique : ponte larvaire (8-10j) &rarr; émergence des imagos (2j) &rarr; repas sanguin &amp; cycle extrinsèque sporogonique chez l&apos;anophèle (12-14j) &rarr; période d&apos;incubation chez l&apos;humain (10-14j).
          </p>
        </div>
      </div>
    </div>
  );
};
