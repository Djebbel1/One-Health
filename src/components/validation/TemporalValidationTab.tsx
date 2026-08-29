import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  RotateCcw,
  Layers,
  Activity
} from 'lucide-react';

interface TemporalValidationTabProps {
  project: ScientificValidationProject;
}

export const TemporalValidationTab: React.FC<TemporalValidationTabProps> = ({ project }) => {
  const { timeSplitResult, rollingTimeResult, residuals } = project;
  const [selectedFold, setSelectedFold] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* Règle d'étanchéité temporelle */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Règle d Étanchéité Temporelle Absolue (Anti-Fuite Future)
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            Les données futures ne sont <strong>jamais</strong> utilisées pour estimer les paramètres d un modèle évaluant le passé. Dans toute validation prospective, les statistiques descriptives, standardisations et coefficients sont calculés exclusivement sur la fenêtre d apprentissage antérieure.
          </p>
        </div>
      </div>

      {/* 1. Time-Split Validation Prospective */}
      {timeSplitResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Validation Temporelle Prospective (Time-Split)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Évaluation prospective sur données non vues chronologiquement
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold font-mono">
              Train: {timeSplitResult.trainPeriodLabel} → Test: {timeSplitResult.testPeriodLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-500 font-medium block">
                Performance Entraînement (Historique)
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {timeSplitResult.trainMetrics.mae.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">cas / 1000 hab</span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-200">
                <span>R² Entraînement :</span>
                <span className="font-mono font-bold">{timeSplitResult.trainMetrics.r2.toFixed(3)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
              <span className="text-[11px] text-teal-800 font-medium block">
                Performance Test Prospective (2025–2026)
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-teal-900">
                  {timeSplitResult.testMetrics.mae.toFixed(2)}
                </span>
                <span className="text-xs text-teal-700 font-medium">cas / 1000 hab</span>
              </div>
              <div className="text-[11px] text-teal-800 flex justify-between pt-1 border-t border-teal-200">
                <span>R² Test Prospectif :</span>
                <span className="font-mono font-bold">{timeSplitResult.testMetrics.r2.toFixed(3)}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] text-slate-500 font-medium block">
                Écart de Généralisation & Diagnostic
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  +{timeSplitResult.overfittingGapPercentage}%
                </span>
                <span className="text-xs text-slate-500 font-medium">Δ MAE</span>
              </div>
              <div className="text-[11px] text-slate-600 flex justify-between pt-1 border-t border-slate-200">
                <span>Risque Surapprentissage :</span>
                <span className="font-bold text-emerald-700">{timeSplitResult.overfittingRiskTier}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>Conclusion de l évaluation prospective :</strong> {timeSplitResult.overfittingInterpretation}
          </div>
        </div>
      )}

      {/* 2. Validation Temporelle Glissante (Walk-Forward / Rolling) */}
      {rollingTimeResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-teal-600" />
                <span>Validation Temporelle Glissante (Rolling / Walk-Forward)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Évaluation de la stabilité des performances à travers des horizons temporels successifs
              </p>
            </div>
            <span className="text-xs text-slate-600 font-medium">
              MAE Moyenne : <strong className="text-teal-700 font-mono">{rollingTimeResult.averageTestMae.toFixed(2)} cas/1000</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rollingTimeResult.folds.map((fold) => (
              <div
                key={fold.foldNumber}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-teal-400 transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    Plis {fold.foldNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {fold.driftStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Train :</span>
                    <span className="font-mono font-bold text-slate-800">{fold.trainPeriod}</span>
                  </div>
                  <div className="flex justify-between text-teal-800">
                    <span>Test :</span>
                    <span className="font-mono font-bold text-teal-700">{fold.testPeriod}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">MAE Test</span>
                    <span className="font-bold font-mono text-slate-800">{fold.testMae.toFixed(2)}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">R² Test</span>
                    <span className="font-bold font-mono text-teal-700">{fold.testR2.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>Analyse de dérive structurelle :</strong> {rollingTimeResult.driftSummary}
          </div>
        </div>
      )}

      {/* 3. Évolution des Résidus dans le Temps */}
      {residuals && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Évolution Annuelle des Résidus Moyens (Observé - Prédit)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Identification des périodes de sous-estimation (résidu &gt; 0) ou de sur-estimation (résidu &lt; 0)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
            {residuals.temporalTrend.map((t) => (
              <div
                key={t.period}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1"
              >
                <span className="text-xs font-bold text-slate-800 block">{t.period}</span>
                <span
                  className={`font-mono text-xs font-bold block ${
                    Math.abs(t.avgResidual) < 0.3
                      ? 'text-emerald-700'
                      : t.avgResidual > 0
                      ? 'text-amber-700'
                      : 'text-indigo-700'
                  }`}
                >
                  {t.avgResidual > 0 ? `+${t.avgResidual.toFixed(2)}` : t.avgResidual.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block">{t.count} obs</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
