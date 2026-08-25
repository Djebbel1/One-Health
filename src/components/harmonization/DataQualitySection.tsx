import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { calculateRecordQualityScore } from '../../utils/harmonizationEngine';
import { QualityScoreDetails } from '../../types';
import {
  ShieldCheck,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Activity,
  CloudSun,
  Layers,
  Home,
  ChevronRight,
  Sparkles,
  Info,
  X
} from 'lucide-react';

export const DataQualitySection: React.FC = () => {
  const {
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
  } = useData();

  const [selectedTable, setSelectedTable] = useState<'ALL' | 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectedRecord, setInspectedRecord] = useState<{
    table: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE';
    record: any;
    score: QualityScoreDetails;
  } | null>(null);

  // Compute all scores
  const allScoredRecords = useMemo(() => {
    const list: Array<{
      id: string;
      table: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE';
      title: string;
      subtitle: string;
      record: any;
      score: QualityScoreDetails;
    }> = [];

    // Health
    healthRecords.filter(r => !r.is_deleted).forEach(h => {
      const score = calculateRecordQualityScore('SANTE', h);
      list.push({
        id: h.id,
        table: 'SANTE',
        title: `${h.health_area || 'Kindu'} • ${h.disease_type}`,
        subtitle: `${h.period_month}/${h.period_year} — ${h.facility_name || 'CS'} (${h.confirmed_cases ?? 'N/A'} cas)`,
        record: h,
        score,
      });
    });

    // Climate
    climateRecords.filter(r => !r.is_deleted).forEach(c => {
      const score = calculateRecordQualityScore('CLIMAT', c);
      list.push({
        id: c.id,
        table: 'CLIMAT',
        title: `${c.station_name || c.location_name || 'Station Kindu'}`,
        subtitle: `${c.month ?? 'Annuel'}/${c.year} — Pluie: ${c.rainfall_mm ?? 'NULL'} mm, Temp: ${c.temperature_mean ?? c.temp_mean_c ?? 'NULL'}°C`,
        record: c,
        score,
      });
    });

    // Environmental
    environmentalObs.filter(r => !r.is_deleted).forEach(e => {
      const score = calculateRecordQualityScore('ENVIRONNEMENT', e);
      list.push({
        id: e.id,
        table: 'ENVIRONNEMENT',
        title: `${e.site_name || 'Site'} • ${e.site_type || 'Observation'}`,
        subtitle: `${e.health_area} • ${e.observation_date} — Statut: ${e.status}`,
        record: e,
        score,
      });
    });

    // Household
    householdSurveys.filter(r => !r.is_deleted).forEach(m => {
      const score = calculateRecordQualityScore('MENAGE', m);
      list.push({
        id: m.id,
        table: 'MENAGE',
        title: `Ménage ${m.household_code || m.id} • ${m.avenue || m.neighborhood}`,
        subtitle: `${m.health_area} • ${m.survey_date} — Eau: ${m.water_source_type}`,
        record: m,
        score,
      });
    });

    return list;
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return allScoredRecords.filter(item => {
      if (selectedTable !== 'ALL' && item.table !== selectedTable) return false;
      if (selectedCategory !== 'ALL' && item.score.category !== selectedCategory) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchId = item.id.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = item.subtitle.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchSub) return false;
      }
      return true;
    });
  }, [allScoredRecords, selectedTable, selectedCategory, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = allScoredRecords.length;
    const excellents = allScoredRecords.filter(r => r.score.category === 'EXCELLENTE').length;
    const bonnes = allScoredRecords.filter(r => r.score.category === 'BONNE').length;
    const moyennes = allScoredRecords.filter(r => r.score.category === 'MOYENNE').length;
    const faibles = allScoredRecords.filter(r => r.score.category === 'FAIBLE' || r.score.category === 'TRES_FAIBLE').length;
    const avgScore = total > 0 ? Math.round(allScoredRecords.reduce((s, r) => s + r.score.total_score, 0) / total) : 0;

    return { total, excellents, bonnes, moyennes, faibles, avgScore };
  }, [allScoredRecords]);

  const getScoreBadge = (score: QualityScoreDetails) => {
    switch (score.category) {
      case 'EXCELLENTE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">90-100 • Excellente</span>;
      case 'BONNE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">75-89 • Bonne</span>;
      case 'MOYENNE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">50-74 • Moyenne</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">&lt; 50 • Faible</span>;
    }
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'SANTE':
        return <Activity className="w-4 h-4 text-rose-600" />;
      case 'CLIMAT':
        return <CloudSun className="w-4 h-4 text-cyan-600" />;
      case 'ENVIRONNEMENT':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'MENAGE':
        return <Home className="w-4 h-4 text-blue-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Scientific Principle */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Évaluation et Score de Qualité des Données (0 – 100)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Chaque enregistrement fait l objet d une notation scientifique standardisée sur 5 dimensions fondamentales : <strong>Source (+20)</strong>, <strong>Période (+20)</strong>, <strong>Localisation (+20)</strong>, <strong>Variables clés (+20)</strong> et <strong>Cohérence interne (+20)</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Score Global Moyen</span>
              <span className="text-xl font-extrabold text-teal-700">{stats.avgScore} / 100</span>
            </div>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'EXCELLENTE' ? 'ALL' : 'EXCELLENTE')}
            className={`p-3 rounded-xl border text-left transition ${
              selectedCategory === 'EXCELLENTE' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Excellente (90-100)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.excellents}</span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'BONNE' ? 'ALL' : 'BONNE')}
            className={`p-3 rounded-xl border text-left transition ${
              selectedCategory === 'BONNE' ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-400/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Bonne (75-89)</span>
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.bonnes}</span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'MOYENNE' ? 'ALL' : 'MOYENNE')}
            className={`p-3 rounded-xl border text-left transition ${
              selectedCategory === 'MOYENNE' ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Moyenne (50-74)</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.moyennes}</span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'FAIBLE' ? 'ALL' : 'FAIBLE')}
            className={`p-3 rounded-xl border text-left transition ${
              selectedCategory === 'FAIBLE' ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-400/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
              <span>Faible / À corriger</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <span className="text-lg font-bold text-slate-900">{stats.faibles}</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Table Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedTable('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedTable === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes les tables ({allScoredRecords.length})
          </button>
          <button
            onClick={() => setSelectedTable('SANTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'SANTE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Santé ({allScoredRecords.filter(r => r.table === 'SANTE').length})
          </button>
          <button
            onClick={() => setSelectedTable('CLIMAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'CLIMAT' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            Climat ({allScoredRecords.filter(r => r.table === 'CLIMAT').length})
          </button>
          <button
            onClick={() => setSelectedTable('ENVIRONNEMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'ENVIRONNEMENT' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Environnement ({allScoredRecords.filter(r => r.table === 'ENVIRONNEMENT').length})
          </button>
          <button
            onClick={() => setSelectedTable('MENAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'MENAGE' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Ménages ({allScoredRecords.filter(r => r.table === 'MENAGE').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher identifiant, lieu, variable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Record List & Inspection Modal */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Identifiant & Table</th>
                <th className="py-3 px-4">Entité / Contexte</th>
                <th className="py-3 px-4">Détails & Période</th>
                <th className="py-3 px-4 text-center">Score Total</th>
                <th className="py-3 px-4 text-center">Catégorie</th>
                <th className="py-3 px-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Aucun enregistrement ne correspond aux critères sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr
                    key={`${item.table}-${item.id}`}
                    onClick={() => setInspectedRecord(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTableIcon(item.table)}
                        <div>
                          <span className="font-bold text-slate-900 block font-mono">{item.id}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{item.table}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.title}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.subtitle}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {item.score.total_score}
                      </span>
                      <span className="text-slate-400 text-[10px]"> / 100</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getScoreBadge(item.score)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  {getTableIcon(inspectedRecord.table)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    Fiche {inspectedRecord.record.id}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      {inspectedRecord.table}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">Audit scientifique de qualité des données</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Score de Qualité Global</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">
                    {inspectedRecord.score.total_score}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
              </div>
              <div>{getScoreBadge(inspectedRecord.score)}</div>
            </div>

            {/* 5 Components Breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Décomposition des 5 critères de qualité
              </h4>
              <div className="space-y-2 text-xs">
                {/* 1. Source */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">1. Traçabilité de la Source (+20 max)</span>
                    <span className="text-slate-500 text-[11px]">
                      Source documentaire, agent identifié ou station officielle
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">
                    {inspectedRecord.score.source_score} / 20
                  </span>
                </div>

                {/* 2. Temporal */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">2. Résolution Temporelle (+20 max)</span>
                    <span className="text-slate-500 text-[11px]">
                      Date complète ou mois/année conforme au calendrier standard
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">
                    {inspectedRecord.score.temporal_score} / 20
                  </span>
                </div>

                {/* 3. Spatial */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">3. Localisation Géographique (+20 max)</span>
                    <span className="text-slate-500 text-[11px]">
                      Aire de santé Kindu rattachée ou coordonnées GPS valides
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">
                    {inspectedRecord.score.spatial_score} / 20
                  </span>
                </div>

                {/* 4. Variables */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">4. Complétude des Variables Clés (+20 max)</span>
                    <span className="text-slate-500 text-[11px]">
                      Présence des variables critiques nécessaires à l analyse
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">
                    {inspectedRecord.score.variable_score} / 20
                  </span>
                </div>

                {/* 5. Consistency */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">5. Cohérence Interne (+20 max)</span>
                    <span className="text-slate-500 text-[11px]">
                      Plages de valeurs réalistes pour le contexte de Kindu
                    </span>
                  </div>
                  <span className="font-bold text-teal-700 text-sm">
                    {inspectedRecord.score.consistency_score} / 20
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings or Recommendations */}
            {inspectedRecord.score.warnings.length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Anomalies et Avertissements Détectés</span>
                </div>
                <ul className="list-disc list-inside text-amber-800 space-y-1">
                  {inspectedRecord.score.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Aucune anomalie critique détectée sur cet enregistrement.</span>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Recommandation Scientifique</span>
              <p className="text-slate-600">{inspectedRecord.score.recommendation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Fermer l audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
