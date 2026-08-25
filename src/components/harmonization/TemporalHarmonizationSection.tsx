import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TEMPORAL_COMPATIBILITY_MATRIX, KINDU_SITE_EVOLUTION_DEMO } from '../../data/harmonizationData';
import {
  Calendar,
  Clock,
  CloudRain,
  Sun,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Info,
  CalendarRange
} from 'lucide-react';

export const TemporalHarmonizationSection: React.FC = () => {
  const {
    analysisPeriods,
    seasons,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'PERIODS' | 'SEASONS' | 'COMPATIBILITY' | 'SITE_EVOLUTION_TEST'>('SITE_EVOLUTION_TEST');
  const [selectedDemoYear, setSelectedDemoYear] = useState<2023 | 2024 | 2025>(2025);

  const currentEvolutionState = KINDU_SITE_EVOLUTION_DEMO.find(e => e.year === selectedDemoYear)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Harmonisation Temporelle & Calendrier des Saisons
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Standardisation des pas de temps (Mois calendaire, Semaine épidémiologique, Saison tropicale) et validation dynamique de l évolution temporelle des sites environnementaux (2023 – 2025).
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveSubTab('SITE_EVOLUTION_TEST')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSubTab === 'SITE_EVOLUTION_TEST' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Test d Évolution de Site (ENV-001)
          </button>
          <button
            onClick={() => setActiveSubTab('PERIODS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'PERIODS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Périodes Standard ({analysisPeriods.length} mois)
          </button>
          <button
            onClick={() => setActiveSubTab('SEASONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'SEASONS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Configuration des Saisons ({seasons.length})
          </button>
          <button
            onClick={() => setActiveSubTab('COMPATIBILITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'COMPATIBILITY' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Matrice de Compatibilité Temporelle
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Site Evolution Test (ENV-001) */}
      {activeSubTab === 'SITE_EVOLUTION_TEST' && (
        <div className="space-y-6">
          {/* Scientific Context */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-6 text-white space-y-3">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              Démonstrateur Temporel Obligatoire V1.5
            </div>
            <h4 className="text-lg font-bold">
              Évolution Temporelle du Site ENV-001 (Quartier Mikelenge, Kindu)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              <strong>Règle scientifique :</strong> Un site environnemental évolue dans le temps. L état observé en 2025 (ex: assainissement, construction) ne doit <strong>jamais être rétro-appliqué</strong> aux données sanitaires de 2023 ou 2024. Le sélecteur ci-dessous démontre le filtrage dynamique.
            </p>

            {/* Year Selector */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-teal-200">Sélectionner l Année d Analyse :</span>
              <div className="flex gap-2">
                {([2023, 2024, 2025] as const).map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedDemoYear(year)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                      selectedDemoYear === year
                        ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Année {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Evolution Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 block">SITE-ENV-001 • Mikelenge</span>
                <h5 className="font-bold text-slate-900 text-base">
                  État Environnemental Actif pour l Année {selectedDemoYear}
                </h5>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Date de relevé : {currentEvolutionState.date}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Waste Deposit Status */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentEvolutionState.waste_present
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">Dépôt Sauvage de Déchets</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentEvolutionState.waste_present
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {currentEvolutionState.waste_present ? 'PRÉSENT' : 'ABSENT (NETTOYÉ)'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {currentEvolutionState.waste_present
                    ? 'Présence de dépotoir incontrôlé favorisant la prolifération vectorielle et la contamination hydrique.'
                    : 'Le dépôt d ordures a été complètement évacué par la voirie urbaine lors des travaux d aménagement 2025.'}
                </p>
              </div>

              {/* Construction Status */}
              <div
                className={`p-4 rounded-xl border transition ${
                  currentEvolutionState.construction_present
                    ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs">Nouvelle Construction / Habitation</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentEvolutionState.construction_present
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {currentEvolutionState.construction_present ? 'PRÉSENTE (BÂTI)' : 'AUCUNE (TERRAIN NU)'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {currentEvolutionState.construction_present
                    ? 'Édification d un bâtiment résidentiel avec canalisation raccordée modifiant la typologie du sol.'
                    : 'Zone non bâtie durant cette période.'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600">
                <strong>Description du relevé :</strong> {currentEvolutionState.description}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Observateur : Dr. Jean Mukendi</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Standard Periods */}
      {activeSubTab === 'PERIODS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Code Période</th>
                  <th className="py-3 px-4">Mois & Année</th>
                  <th className="py-3 px-4">Date Début</th>
                  <th className="py-3 px-4">Date Fin</th>
                  <th className="py-3 px-4">Saison Tropicale</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analysisPeriods.map((p) => {
                  const season = seasons.find(s => s.season_id === p.season_id);
                  return (
                    <tr key={p.period_id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">
                        {p.period_id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.label}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {p.start_date}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">
                        {p.end_date}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {season?.name || p.season_id}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          CONFORME
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Seasons Configuration */}
      {activeSubTab === 'SEASONS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {seasons.map((s) => (
            <div
              key={s.season_id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    {s.season_type === 'PLUIE' ? <CloudRain className="w-4 h-4 text-cyan-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{s.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{s.season_id}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    s.season_type === 'PLUIE'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {s.season_type === 'PLUIE' ? 'PLUVIEUX' : 'SEC'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mois inclus :</span>
                  <span className="font-bold text-slate-800">{s.months_included.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Précipitations typiques :</span>
                  <span className="font-semibold text-slate-700">{s.typical_rainfall_mm_range}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 4: Compatibility Matrix */}
      {activeSubTab === 'COMPATIBILITY' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Résolution Source</th>
                  <th className="py-3 px-4">Résolution Cible</th>
                  <th className="py-3 px-4 text-center">Faisabilité</th>
                  <th className="py-3 px-4">Méthode d Agrégation / Harmonisation</th>
                  <th className="py-3 px-4">Condition Temporelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TEMPORAL_COMPATIBILITY_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {row.source_resolution}
                    </td>
                    <td className="py-3 px-4 font-semibold text-teal-800">
                      {row.target_resolution}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.is_compatible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {row.is_compatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {row.method}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {row.condition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
