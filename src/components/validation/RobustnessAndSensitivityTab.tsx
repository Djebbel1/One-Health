import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';

interface RobustnessAndSensitivityTabProps {
  project: ScientificValidationProject;
}

export const RobustnessAndSensitivityTab: React.FC<RobustnessAndSensitivityTabProps> = ({ project }) => {
  const { robustness, lagsSensitivity } = project;
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  const currentScenario = robustness.scenarios[selectedScenarioIndex] || robustness.scenarios[0];

  return (
    <div className="space-y-6">
      {/* Disclaimer méthodologique sur les tests de sensibilité */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <Sliders className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Analyse de Robustesse & Stabilité des Estimations (Multi-Scénarios)
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            Un modèle scientifiquement robuste maintient la cohérence de ses estimations et la direction de ses effets ($\beta$) face aux variations d échantillonnage, à l exclusion des données imputées/proxies et aux changements de fenêtres de décalage temporel (lags).
          </p>
        </div>
      </div>

      {/* Alerte Sign-Flip (si présente) */}
      {robustness.signFlipAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs text-rose-900">
          <div className="flex items-center space-x-2 font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>ALERTE SCIENTIFIQUE : Inversion de Signe Détectée (Sign-Flip)</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {robustness.signFlipAlerts.map((sf, i) => (
              <li key={i}>{sf}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. Comparaison Multi-Scénarios (A, B, C, D) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Scénarios de Sensibilité Structurelle
            </h3>
            <p className="text-xs text-slate-500">
              Évaluation de la sensibilité aux sous-ensembles de données et exclusions méthodologiques
            </p>
          </div>
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
            {robustness.scenarios.map((sc, idx) => (
              <button
                key={sc.scenarioCode}
                onClick={() => setSelectedScenarioIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedScenarioIndex === idx
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sc.scenarioCode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Détail du scénario sélectionné */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">{currentScenario.title}</span>
              <span className="text-[11px] text-slate-500">{currentScenario.description}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-600">Échantillon : <strong>{currentScenario.sampleSize} obs</strong></span>
              <span className="text-slate-600">AIC : <strong>{currentScenario.aic.toFixed(1)}</strong></span>
              <span className="text-teal-700 font-bold">R² : <strong>{currentScenario.r2.toFixed(3)}</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-white rounded-lg overflow-hidden border border-slate-200">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-bold">Covariable</th>
                  <th className="p-2.5 font-bold">Coefficient ($\beta$)</th>
                  <th className="p-2.5 font-bold">IC 95%</th>
                  <th className="p-2.5 font-bold">p-value</th>
                  <th className="p-2.5 font-bold">Stabilité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                {currentScenario.keyCoefficients.map((coef, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-sans font-medium text-slate-900">{coef.variable}</td>
                    <td className="p-2.5 font-bold">{coef.beta > 0 ? `+${coef.beta.toFixed(3)}` : coef.beta.toFixed(3)}</td>
                    <td className="p-2.5 text-slate-600">[{coef.ci95Lower.toFixed(3)} ; {coef.ci95Upper.toFixed(3)}]</td>
                    <td className="p-2.5 text-teal-700 font-bold">p = {coef.pValue.toFixed(4)}</td>
                    <td className="p-2.5 font-sans">
                      {coef.signFlipped ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          INVERSION DE SIGNE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          STABLE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
          <strong>Synthèse de stabilité globale :</strong> {robustness.scientificNote}
        </div>
      </div>

      {/* 2. Analyse de Sensibilité aux Décalages Temporels (Lags 0 à 4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Sensibilité aux Décalages Temporels (Lags 0 à 4 Mois)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Comparaison systématique de la force du coefficient et de la plausibilité éco-épidémiologique
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Lag (Mois)</th>
                <th className="p-3 font-bold">Coefficient ($\beta$)</th>
                <th className="p-3 font-bold">IC 95%</th>
                <th className="p-3 font-bold">p-value</th>
                <th className="p-3 font-bold">Critère AIC</th>
                <th className="p-3 font-bold">Plausibilité Biologique & Écologique</th>
                <th className="p-3 font-bold">Statut Retenu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {lagsSensitivity.map((lag) => (
                <tr key={lag.lagMonths} className={lag.isStatisticallyPreferred ? 'bg-teal-50/40' : ''}>
                  <td className="p-3 font-sans font-bold text-slate-900">Lag {lag.lagMonths} mois</td>
                  <td className="p-3 font-bold">{lag.betaValue > 0 ? `+${lag.betaValue.toFixed(3)}` : lag.betaValue.toFixed(3)}</td>
                  <td className="p-3 text-slate-600">[{lag.ciLower.toFixed(3)} ; {lag.ciUpper.toFixed(3)}]</td>
                  <td className="p-3 text-teal-700">p = {lag.pValue.toFixed(4)}</td>
                  <td className="p-3">{lag.aic.toFixed(1)}</td>
                  <td className="p-3 font-sans text-[11px] text-slate-600">{lag.biologicalPlausibilityNote}</td>
                  <td className="p-3 font-sans">
                    {lag.isStatisticallyPreferred ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        RETENU (OPTIMAL)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Secondaire</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
