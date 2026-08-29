import React from 'react';
import { ScientificValidationProject } from '../../types';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Calendar,
  Layers,
  Scale,
  Percent,
  Sliders,
  Sparkles,
  Info,
  TrendingDown,
  Clock,
  Compass
} from 'lucide-react';

interface ModelValidationOverviewTabProps {
  project: ScientificValidationProject;
  onNavigateSubTab: (tabId: any) => void;
}

export const ModelValidationOverviewTab: React.FC<ModelValidationOverviewTabProps> = ({
  project,
  onNavigateSubTab
}) => {
  const {
    preValidationCheck,
    dataLeakageAudit,
    timeSplitResult,
    decomposedRobustnessScore,
    decomposedConfidenceScore,
    calibration
  } = project;

  return (
    <div className="space-y-6">
      {/* 1. Épistémologie & Alerte de non-causalité */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-950">
            Avertissement Épistémologique Fondamental sur la Validation Statistique
          </span>
          <p className="leading-relaxed text-amber-900">
            Une excellente performance prédictive ou une calibration optimale <strong>ne démontre en aucun cas une causalité biologique ou écologique directe</strong>. La validation atteste de la stabilité et de la généralisabilité des associations observées sous l hypothèse de stationnarité des processus.
          </p>
        </div>
      </div>

      {/* 2. Cartes de Score Synthétique Décomposé (Robustesse & Confiance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Score de Robustesse Décomposé */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Score Global de Robustesse du Modèle
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                decomposedRobustnessScore.tier === 'ROBUSTE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : decomposedRobustnessScore.tier === 'MODERE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              🟢 {decomposedRobustnessScore.tier} ({decomposedRobustnessScore.overallScore}/100)
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] text-slate-500 font-medium block">
              Décomposition transparente des 6 composantes (Zéro score opaque) :
            </span>
            {decomposedRobustnessScore.components.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{comp.name}</span>
                  <span className="font-mono font-bold text-slate-900">{comp.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      comp.score >= 80 ? 'bg-emerald-500' : comp.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{comp.details}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200">
            {decomposedRobustnessScore.transparencyJustification}
          </div>
        </div>

        {/* Score de Confiance Prédictive (Strictement distinct du risque) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Confiance dans la Prédiction Statistique
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                decomposedConfidenceScore.confidenceTier === 'CONFIANCE_HAUTE'
                  ? 'bg-indigo-100 text-indigo-800'
                  : decomposedConfidenceScore.confidenceTier === 'CONFIANCE_MOYENNE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {decomposedConfidenceScore.confidenceTier} ({decomposedConfidenceScore.overallConfidence}/100)
            </span>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950">
            <span className="font-bold block mb-1">Règle de Séparation Sémantique Stricte :</span>
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              {decomposedConfidenceScore.cautiousAdvisory}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] text-slate-500 font-medium block">
              Critères constitutifs de la confiance méthodologique :
            </span>
            {decomposedConfidenceScore.criteriaBreakdown.map((crit, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{crit.criterion}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{crit.description}</p>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shrink-0 ml-2">
                  {crit.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Ligne d audits préalables (Contrôle Préalable & Fuite de données) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contrôle Préalable */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Contrôle Préalable de Faisabilité (Pre-flight)</span>
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                preValidationCheck.status === 'POSSIBLE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : preValidationCheck.status === 'LIMITEE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              Validation {preValidationCheck.status}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Obs</span>
              <span className="font-bold text-slate-800">{preValidationCheck.totalObservations}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Zones</span>
              <span className="font-bold text-slate-800">{preValidationCheck.totalHealthZones}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Manquants</span>
              <span className="font-bold text-emerald-700">{preValidationCheck.missingValuesPct}%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Proxies</span>
              <span className="font-bold text-amber-700">{preValidationCheck.proxiesCount}</span>
            </div>
          </div>

          <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
            {preValidationCheck.justifications.map((j, i) => (
              <li key={i}>{j}</li>
            ))}
          </ul>
        </div>

        {/* Audit Fuite de Données */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Audit d Étanchéité (Data Leakage)</span>
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                dataLeakageAudit.overallStatus === 'CLEAR'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {dataLeakageAudit.overallStatus === 'CLEAR' ? 'CONFORME' : 'NON CONFORME'}
            </span>
          </div>

          <p className="text-xs text-slate-600">{dataLeakageAudit.auditSummary}</p>

          <div className="space-y-1.5">
            {dataLeakageAudit.items.slice(0, 3).map((item) => (
              <div key={item.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{item.title}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Tableau comparatif Entraînement vs Test (Overfitting Diagnostic) */}
      {timeSplitResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Diagnostic de Surapprentissage & Écart Train / Test</span>
              </h3>
              <p className="text-xs text-slate-500">
                Comparaison rigoureuse entre l ensemble d apprentissage ({timeSplitResult.trainPeriodLabel}) et le jeu de test prospectif ({timeSplitResult.testPeriodLabel})
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                timeSplitResult.overfittingRiskTier === 'FAIBLE'
                  ? 'bg-emerald-100 text-emerald-800'
                  : timeSplitResult.overfittingRiskTier === 'MODERE'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              Risque de Surapprentissage : {timeSplitResult.overfittingRiskTier}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-bold">Métrique Scientifique</th>
                  <th className="p-3 font-bold">Entraînement ({timeSplitResult.trainPeriodLabel})</th>
                  <th className="p-3 font-bold">Test Prospectif ({timeSplitResult.testPeriodLabel})</th>
                  <th className="p-3 font-bold">Écart / Dégradation</th>
                  <th className="p-3 font-bold">Interprétation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-900">MAE (Erreur Absolue Moyenne)</td>
                  <td className="p-3 font-bold">{timeSplitResult.trainMetrics.mae.toFixed(2)} cas/1000</td>
                  <td className="p-3 font-bold text-teal-700">{timeSplitResult.testMetrics.mae.toFixed(2)} cas/1000</td>
                  <td className="p-3 text-amber-700">+{timeSplitResult.overfittingGapPercentage}%</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">Écart modéré & acceptable</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-900">RMSE (Racine de l Erreur Quadratique)</td>
                  <td className="p-3">{timeSplitResult.trainMetrics.rmse.toFixed(2)}</td>
                  <td className="p-3">{timeSplitResult.testMetrics.rmse.toFixed(2)}</td>
                  <td className="p-3">+{(timeSplitResult.testMetrics.rmse - timeSplitResult.trainMetrics.rmse).toFixed(2)}</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">Pénalise les grands écarts</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-900">R² (Coefficient de Détermination)</td>
                  <td className="p-3 font-bold">{timeSplitResult.trainMetrics.r2.toFixed(3)}</td>
                  <td className="p-3 font-bold text-teal-700">{timeSplitResult.testMetrics.r2.toFixed(3)}</td>
                  <td className="p-3 text-slate-600">-{(timeSplitResult.trainMetrics.r2 - timeSplitResult.testMetrics.r2).toFixed(3)}</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">Capacité explicite résiduelle élevée</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-medium text-slate-900">Ratio de Surdispersion (Deviance/ddl)</td>
                  <td className="p-3">{timeSplitResult.trainMetrics.dispersionRatio.toFixed(2)}</td>
                  <td className="p-3">{timeSplitResult.testMetrics.dispersionRatio.toFixed(2)}</td>
                  <td className="p-3">+0.08</td>
                  <td className="p-3 font-sans text-slate-600 text-[11px]">Adéquation de la loi binomiale négative</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Interprétation prudente :</strong> {timeSplitResult.overfittingInterpretation}
          </p>
        </div>
      )}

      {/* 5. Liens rapides vers les sous-modules détaillés */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateSubTab('VALIDATION_TEMPORELLE')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm text-left transition group"
        >
          <Calendar className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition" />
          <span className="font-bold text-xs text-slate-900 block">Validation Temporelle</span>
          <span className="text-[10px] text-slate-500">Time-split & Rolling walk-forward</span>
        </button>

        <button
          onClick={() => onNavigateSubTab('CALIBRATION')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm text-left transition group"
        >
          <Activity className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition" />
          <span className="font-bold text-xs text-slate-900 block">Courbe de Calibration</span>
          <span className="text-[10px] text-slate-500">Pente, ECE & déciles de risque</span>
        </button>

        <button
          onClick={() => onNavigateSubTab('ROBUSTESSE')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm text-left transition group"
        >
          <Sliders className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition" />
          <span className="font-bold text-xs text-slate-900 block">Robustesse & Signes β</span>
          <span className="text-[10px] text-slate-500">Scénarios A/B/C/D & Sign-flips</span>
        </button>

        <button
          onClick={() => onNavigateSubTab('VALIDATION_CARTES')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-sm text-left transition group"
        >
          <Layers className="w-5 h-5 text-teal-600 mb-2 group-hover:scale-110 transition" />
          <span className="font-bold text-xs text-slate-900 block">Cartographie Validée</span>
          <span className="text-[10px] text-slate-500">Risque vs Fiabilité vs Incertitude</span>
        </button>
      </div>

    </div>
  );
};
