import React from 'react';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  Database,
  Activity,
  CloudSun,
  Home,
  CheckCircle2,
  Calendar,
  MapPin,
  TrendingUp,
  Info,
  Scale,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';

interface HarmonizationDashboardProps {
  onSelectTab: (tabId: string) => void;
}

export const HarmonizationDashboard: React.FC<HarmonizationDashboardProps> = ({ onSelectTab }) => {
  const {
    householdSurveys,
    environmentalObs,
    healthRecords,
    climateRecords,
    geographicUnits,
    analysisPeriods,
    seasons,
    readinessReport,
    integratedDataset,
    dataCorrections,
    auditLogs
  } = useData();

  const activeHealth = healthRecords.filter(r => !r.is_deleted);
  const activeClimate = climateRecords.filter(r => !r.is_deleted);
  const activeEnv = environmentalObs.filter(r => !r.is_deleted);
  const activeHH = householdSurveys.filter(r => !r.is_deleted);

  const deletedTotal =
    healthRecords.filter(r => r.is_deleted).length +
    climateRecords.filter(r => r.is_deleted).length +
    environmentalObs.filter(r => r.is_deleted).length +
    householdSurveys.filter(r => r.is_deleted).length;

  const healthAreas = geographicUnits.filter(g => g.geo_type === 'AIRE_DE_SANTE');
  const healthZones = geographicUnits.filter(g => g.geo_type === 'ZONE_DE_SANTE');

  return (
    <div className="space-y-6">
      {/* 1. Scientific Preparation Mission Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Phase Scientifique V1.5 — Contrôle, Nettoyage & Harmonisation
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Préparation et Alignement des 4 Familles de Données
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Consolidation rigoureuse des données des <strong className="text-white">Ménages</strong>, <strong className="text-white">Environnement</strong>, <strong className="text-white">Santé</strong> et <strong className="text-white">Climat</strong> à Kindu. Structuration spatio-temporelle préliminaire sans modélisation causale prématurée.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectTab('INTEGRATED_DATASET')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs sm:text-sm shadow-sm transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Consulter la Base Intégrée
            </button>
            <button
              onClick={() => onSelectTab('GEO_HARMONIZATION')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm border border-slate-700 transition"
            >
              <MapPin className="w-4 h-4" />
              Unités Géographiques
            </button>
          </div>
        </div>
      </div>

      {/* 2. Readiness Score Indicator & Scientific Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Score Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Indicateur d État de Préparation (Readiness Score)</h3>
                <p className="text-xs text-slate-500">Validation scientifique avant intégration analytique spatio-temporelle</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                readinessReport.status === 'PRET'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : readinessReport.status === 'PARTIELLEMENT_PRET'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {readinessReport.status === 'PRET'
                ? 'PRÊT POUR INTÉGRATION'
                : readinessReport.status === 'PARTIELLEMENT_PRET'
                ? 'PARTIELLEMENT PRÊT'
                : 'NON PRÊT'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-slate-900">{readinessReport.total_score}</span>
            <span className="text-sm font-semibold text-slate-400">/ 100 points</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${
                readinessReport.total_score >= 80 ? 'bg-emerald-500' : readinessReport.total_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${readinessReport.total_score}%` }}
            />
          </div>

          {/* Score Decomposition Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1">Présence Données</span>
              <span className="text-sm font-bold text-slate-800">{readinessReport.data_presence_score} / 25</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1">Harmonisation Temp.</span>
              <span className="text-sm font-bold text-slate-800">{readinessReport.temporal_harmonization_score} / 20</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1">Harmonisation Spat.</span>
              <span className="text-sm font-bold text-slate-800">{readinessReport.spatial_harmonization_score} / 20</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1">Contrôle Qualité</span>
              <span className="text-sm font-bold text-slate-800">{readinessReport.quality_controlled_score} / 20</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-1">Liaisons Possibles</span>
              <span className="text-sm font-bold text-slate-800">{readinessReport.cross_linkable_score} / 15</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-teal-50/70 p-3 rounded-xl border border-teal-100">
            <strong>Synthèse :</strong> {readinessReport.summary}
          </p>
        </div>

        {/* Scientific Guardrails Notice */}
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200/80 text-amber-950 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>Garde-fous Scientifiques Impératifs (V1.5)</span>
          </div>
          <ul className="text-xs space-y-2 text-amber-900/90 leading-relaxed list-disc list-inside">
            <li>
              <strong>Non-remplacement par 0 :</strong> Les données climatiques ou sanitaires absentes demeurent strictement <code className="bg-amber-100 px-1 py-0.5 rounded">NULL</code>.
            </li>
            <li>
              <strong>Traçabilité des suppressions :</strong> Aucune suppression physique ; usage strict du flag <code className="bg-amber-100 px-1 py-0.5 rounded">is_deleted = true</code>.
            </li>
            <li>
              <strong>Contextualisation spatio-temporelle :</strong> Interdiction formelle d appliquer un état environnemental actuel à des données historiques.
            </li>
            <li>
              <strong>Prudence causale :</strong> Pas de calcul d indice de risque synthétique ni d affirmation de causalité à ce stade.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. The 4 Data Families Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ménages */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-teal-300 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Résol. Ménage (GPS)
            </span>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{activeHH.length}</span>
            <h4 className="text-xs font-bold text-slate-700 mt-0.5">Enquêtes Ménages</h4>
            <p className="text-[11px] text-slate-500 mt-1">Eau, assainissement, moustiquaires et antécédents</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Score Qualité Moyen</span>
            <span className="font-bold text-emerald-600">86/100</span>
          </div>
        </div>

        {/* Environnement */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-teal-300 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Résol. Site (GPS)
            </span>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{activeEnv.length}</span>
            <h4 className="text-xs font-bold text-slate-700 mt-0.5">Observations Environnementales</h4>
            <p className="text-[11px] text-slate-500 mt-1">Eaux stagnantes, déchets, caniveaux et inondations</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Sites Validés</span>
            <span className="font-bold text-emerald-600">{activeEnv.filter(e => e.status === 'VALIDATED').length}</span>
          </div>
        </div>

        {/* Santé */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-teal-300 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              Résol. Aire de Santé / Mois
            </span>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{activeHealth.length}</span>
            <h4 className="text-xs font-bold text-slate-700 mt-0.5">Enregistrements Sanitaires</h4>
            <p className="text-[11px] text-slate-500 mt-1">Paludisme et Fièvre Typhoïde (CS & HGR Kindu)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Cas Confirmés Doc.</span>
            <span className="font-bold text-emerald-600">
              {activeHealth.reduce((sum, h) => sum + (h.confirmed_cases || 0), 0)} cas
            </span>
          </div>
        </div>

        {/* Climat */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 hover:border-teal-300 transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <CloudSun className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Résol. Station / Mois
            </span>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">{activeClimate.length}</span>
            <h4 className="text-xs font-bold text-slate-700 mt-0.5">Séries Climatiques</h4>
            <p className="text-[11px] text-slate-500 mt-1">Pluviométrie, température moyenne, min, max et humidité</p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Période Couverte</span>
            <span className="font-bold text-cyan-700">2023 – 2025</span>
          </div>
        </div>
      </div>

      {/* 4. Spatial & Temporal Coverage Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Geographic Hierarchy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              Couverture Géographique Standard
            </h4>
            <button
              onClick={() => onSelectTab('GEO_HARMONIZATION')}
              className="text-xs text-teal-600 font-semibold hover:underline"
            >
              Gérer
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ville cible</span>
              <span className="font-bold text-slate-800">Kindu (Maniema, RDC)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Zones de santé</span>
              <span className="font-bold text-slate-800">{healthZones.length} (Kindu RD & Alunguli RG)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Aires de santé référencées</span>
              <span className="font-bold text-slate-800">{healthAreas.length} aires</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Unités Spatiales totales</span>
              <span className="font-bold text-slate-800">{geographicUnits.length} unités</span>
            </div>
          </div>
        </div>

        {/* Temporal Periods */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Périodes d Analyse et Saisons
            </h4>
            <button
              onClick={() => onSelectTab('TEMPORAL_HARMONIZATION')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Gérer
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Fenêtre temporelle d étude</span>
              <span className="font-bold text-slate-800">2023 à 2025</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Périodes mensuelles</span>
              <span className="font-bold text-slate-800">{analysisPeriods.length} mois standardisés</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Saisons climatiques</span>
              <span className="font-bold text-slate-800">{seasons.length} saisons configurées</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Évolution de site (ENV-001)</span>
              <span className="font-bold text-emerald-600">Test temporel actif</span>
            </div>
          </div>
        </div>

        {/* Quality, Duplicates & Corrections */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Qualité, Doublons & Audit
            </h4>
            <button
              onClick={() => onSelectTab('AUDIT_CORRECTIONS')}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Journal
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Score de Qualité moyen</span>
              <span className="font-bold text-emerald-700">84/100 (Bonne)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Corrections enregistrées</span>
              <span className="font-bold text-slate-800">{dataCorrections.length} modifications</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Suppressions logiques actives</span>
              <span className="font-bold text-slate-800">{deletedTotal} fiches archivées</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Lignes Base Intégrée</span>
              <span className="font-bold text-teal-700">{integratedDataset.length} lignes générées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
