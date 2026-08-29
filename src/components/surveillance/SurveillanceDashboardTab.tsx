import React from 'react';
import {
  SurveillanceSummaryOverview,
  TimeSeriesSurveillancePoint,
  MOCK_SURVEILLANCE_OVERVIEW_V117,
  MOCK_SURVEILLANCE_TIMESERIES_2026,
  MOCK_SURVEILLANCE_SIGNALS_V117,
  MOCK_SURVEILLANCE_ALERTS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  TrendingUp,
  CloudRain,
  Droplets,
  Layers,
  FileText,
  Eye,
  Info,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SurveillanceDashboardTabProps {
  onNavigateTab: (tabId: any) => void;
  selectedZone: string;
  selectedPathology: string;
}

export const SurveillanceDashboardTab: React.FC<SurveillanceDashboardTabProps> = ({
  onNavigateTab,
  selectedZone,
  selectedPathology
}) => {
  const overview = MOCK_SURVEILLANCE_OVERVIEW_V117;
  const recentPoints = MOCK_SURVEILLANCE_TIMESERIES_2026.slice(-5);
  const activeSignals = MOCK_SURVEILLANCE_SIGNALS_V117.filter(
    (s) => s.status === 'ACTIF' || s.status === 'EN_EVALUATION' || s.status === 'CONVERTI_EN_ALERTE'
  );
  const activeAlerts = MOCK_SURVEILLANCE_ALERTS_V117.filter(
    (a) => a.status === 'NOUVELLE' || a.status === 'EN_VERIFICATION' || a.status === 'CONFIRMEE'
  );

  return (
    <div className="space-y-6">
      {/* 1. Bandeau de Prudence & Déclaration Éthique */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">
            AVERTISSEMENT SCIENTIFIQUE & RÈGLE DE NON-SUBSTITUTION :
          </p>
          <p className="text-amber-800 leading-relaxed">
            Ce module est un <strong>outil d&apos;aide à la veille et à la décision</strong>. Il ne constitue ni une déclaration officielle d&apos;épidémie, ni un diagnostic médical, ni un remplacement du système national de surveillance épidémiologique de la RDC. Tout signal algorithmique représente un <strong>signal à vérifier par expertise humaine de terrain</strong>.
          </p>
        </div>
      </div>

      {/* 2. Cartes d'Indicateurs Synthétiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Signaux Détectés */}
        <div
          onClick={() => onNavigateTab('SIGNAUX')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Signaux Actifs
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {overview.activeSignalsCount}
            </span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {overview.criticalSignalsCount} critiques
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Détection d&apos;écarts anormaux vs attendus modélisés
          </p>
        </div>

        {/* Alertes en Cours */}
        <div
          onClick={() => onNavigateTab('ALERTES')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alertes Potentielles
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {overview.activeAlertsCount}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              En vérification humaine
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Règles multi-critères : persistance &amp; extension
          </p>
        </div>

        {/* Qualité & Complétude des Données */}
        <div
          onClick={() => onNavigateTab('TENDANCES')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Complétude Globale
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {overview.overallCompletenessRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Satisfaisante
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Couverture sur 36 structures de santé enregistrées
          </p>
        </div>

        {/* Délai de Transmission J+N */}
        <div
          onClick={() => onNavigateTab('HISTORIQUE')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md cursor-pointer transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Délai de Transmission
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              J+{overview.averageTransmissionDelayDays}j
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {overview.delayedFacilitiesCount} structures en retard
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Délai moyen de consolidation des rapports
          </p>
        </div>

      </div>

      {/* 3. Vue Conjointe : Alertes Prioritaires & Tendance Hebdomadaire One Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Colonne Gauche (2/3) : Tendance Récente One Health (Observé vs Attendu + Climat) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Surveillance Récente : Observé vs Attendu &amp; Pluviométrie</span>
              </h3>
              <p className="text-xs text-slate-500">
                Séries hebdomadaires (S25 à S34 2026) avec bande de prédiction et lag pluviométrique
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('TENDANCES')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
            >
              <span>Voir tendances complètes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tableau Visuel d'Évolution */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-bold">Période</th>
                  <th className="p-3 font-bold">Paludisme Observé</th>
                  <th className="p-3 font-bold">Attendu Modélisé</th>
                  <th className="p-3 font-bold">Écart / Anomalie</th>
                  <th className="p-3 font-bold">Typhoïde Obs.</th>
                  <th className="p-3 font-bold">Pluie (mm)</th>
                  <th className="p-3 font-bold">Gîtes Larvaires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPoints.map((pt) => {
                  const diff = pt.observedMalariaCases - pt.expectedMalariaCases;
                  const pct = ((diff / pt.expectedMalariaCases) * 100).toFixed(1);
                  return (
                    <tr key={pt.period} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 font-bold text-slate-900">{pt.period}</td>
                      <td className="p-3 font-mono font-bold text-teal-800">
                        {pt.observedMalariaCases} cas
                      </td>
                      <td className="p-3 font-mono text-slate-600">
                        {pt.expectedMalariaCases} cas
                      </td>
                      <td className="p-3">
                        {pt.isAnomalyMalaria ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-mono font-bold text-[10px] rounded-full flex items-center space-x-1 w-max">
                            <AlertTriangle className="w-3 h-3" />
                            <span>+{pct}% (Anomalie)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] rounded-full w-max">
                            {diff >= 0 ? `+${pct}%` : `${pct}%`} (Normal)
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {pt.observedTyphoidCases} cas
                      </td>
                      <td className="p-3 font-mono text-indigo-700">
                        {pt.rainfallMm} mm
                      </td>
                      <td className="p-3 font-mono text-amber-700">
                        {pt.stagnantWaterSitesIndex} sites
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CloudRain className="w-4 h-4 text-indigo-600" />
              <span>Pluies intenses de S28-S29 corrélées avec l&apos;augmentation palustre observée en S31-S33 (Lag 1 mois validé).</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              MODÈLE GLM-NB V1.16
            </span>
          </div>
        </div>

        {/* Colonne Droite (1/3) : Alertes Actives & Vérification Humaine Requise */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Alertes Potentielles ({activeAlerts.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                VÉRIFICATION REQUISE
              </span>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onNavigateTab('ALERTES')}
                  className="p-3.5 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-200 hover:border-teal-300 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {alert.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {alert.title}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.level === 'NIVEAU_2_ALERTE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.level === 'NIVEAU_2_ALERTE' ? 'Niveau 2 (Alerte)' : 'Niveau 1 (Vigilance)'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {alert.multiCriteriaRule.ruleSummary}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Statut : <strong className="text-slate-800">{alert.status}</strong></span>
                    <span className="text-teal-700 font-bold hover:underline">Examiner &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('ALERTES')}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Consulter le Tableau des Alertes</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Raccourcis Rapides vers les 4 Sous-Surveillances One Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => onNavigateTab('SURVEILLANCE_SANITAIRE')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-teal-700">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-900">Surveillance Sanitaire</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Cas, incidences, seuils épidémiques &amp; ruptures de définition
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('SURVEILLANCE_CLIMATIQUE')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-indigo-700">
            <CloudRain className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-900">Surveillance Climatique</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Pluies, températures, anomalies thermiques &amp; alertes météo
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('SURVEILLANCE_ENVIRONNEMENTALE')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-emerald-700">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-900">Surveillance Environnement</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Gîtes larvaires anophéliens, décharges &amp; zones inondables
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('SURVEILLANCE_WASH')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-400 hover:shadow-xs transition cursor-pointer space-y-2"
        >
          <div className="flex items-center space-x-2 text-cyan-700">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-900">Surveillance WASH</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Qualité eau, turbidité, latrines &amp; hygiène fécale/orale
          </p>
        </div>

      </div>

    </div>
  );
};
