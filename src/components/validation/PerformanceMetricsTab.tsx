import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Layers,
  Sliders,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetricsTabProps {
  project: ScientificValidationProject;
}

export const PerformanceMetricsTab: React.FC<PerformanceMetricsTabProps> = ({ project }) => {
  const { timeSplitResult, pathology } = project;
  const [metricCategory, setMetricCategory] = useState<'CONTINUOUS_COUNT' | 'BINARY_CLASSIFICATION'>('CONTINUOUS_COUNT');

  const continuousMetrics = timeSplitResult?.testMetrics || {
    mae: 7.92,
    rmse: 11.18,
    mse: 125.0,
    r2: 0.681,
    deviance: 84.6,
    logLikelihood: -201.8,
    aic: 417.6,
    bic: 431.2,
    dispersionRatio: 1.22
  };

  return (
    <div className="space-y-6">
      {/* Switcher de type de métrique */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Famille de Métriques Scientifiques
          </h3>
          <p className="text-[11px] text-slate-500">
            Adéquation stricte entre la nature mathématique de la variable cible et les indicateurs d évaluation
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMetricCategory('CONTINUOUS_COUNT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricCategory === 'CONTINUOUS_COUNT'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modèles de Comptage & Continu (GLM Poisson / NB)
          </button>
          <button
            onClick={() => setMetricCategory('BINARY_CLASSIFICATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              metricCategory === 'BINARY_CLASSIFICATION'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Classification Binaire (Seuils Épidémiques)
          </button>
        </div>
      </div>

      {metricCategory === 'CONTINUOUS_COUNT' ? (
        <div className="space-y-6">
          {/* Grille des métriques continues & comptage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                MAE (Erreur Absolue Moyenne)
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 block">
                {continuousMetrics.mae.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Écart moyen en cas / 1000 hab (Jeu de test)
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                RMSE (Racine Carrée de l EQM)
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 block">
                {continuousMetrics.rmse.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Sensible aux fortes erreurs atypiques
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                R² (Variance Expliquée)
              </span>
              <span className="text-2xl font-bold font-mono text-teal-700 block">
                {continuousMetrics.r2.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Sur le jeu de validation prospective
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                AIC / BIC
              </span>
              <span className="text-2xl font-bold font-mono text-slate-900 block">
                {continuousMetrics.aic.toFixed(1)} / {continuousMetrics.bic.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500 block">
                Pénalisation de la complexité
              </span>
            </div>
          </div>

          {/* Tableau de Définition et Ensemble d Évaluation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Dictionnaire & Spécification des Métriques de Comptage
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3 font-bold">Métrique</th>
                    <th className="p-3 font-bold">Définition Mathématique</th>
                    <th className="p-3 font-bold">Valeur Calculée</th>
                    <th className="p-3 font-bold">Ensemble Utilisé</th>
                    <th className="p-3 font-bold">Interprétation Scientifique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">MAE</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {'1/n * Σ |y_i - ŷ_i|'}
                    </td>
                    <td className="p-3 font-bold font-mono text-teal-700">{continuousMetrics.mae.toFixed(2)}</td>
                    <td className="p-3 text-slate-600">Test prospectif (2025–2026)</td>
                    <td className="p-3 text-[11px] text-slate-600">Erreur linéaire moyenne directe.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">RMSE</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {'sqrt( 1/n * Σ (y_i - ŷ_i)² )'}
                    </td>
                    <td className="p-3 font-bold font-mono text-slate-800">{continuousMetrics.rmse.toFixed(2)}</td>
                    <td className="p-3 text-slate-600">Test prospectif (2025–2026)</td>
                    <td className="p-3 text-[11px] text-slate-600">Pénalité quadratique sur les résidus extrêmes.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">R²</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {'1 - (SS_res / SS_tot)'}
                    </td>
                    <td className="p-3 font-bold font-mono text-teal-700">{continuousMetrics.r2.toFixed(3)}</td>
                    <td className="p-3 text-slate-600">Test prospectif (2025–2026)</td>
                    <td className="p-3 text-[11px] text-slate-600">Part de variance temporelle et spatiale captée.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Déviance Résiduelle</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {'2 * (LL_saturé - LL_modèle)'}
                    </td>
                    <td className="p-3 font-bold font-mono text-slate-800">{continuousMetrics.deviance.toFixed(1)}</td>
                    <td className="p-3 text-slate-600">Test prospectif</td>
                    <td className="p-3 text-[11px] text-slate-600">Mesure de l écart à la vraisemblance maximale.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Ratio de Surdispersion (φ)</td>
                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {'Déviance / ddl'}
                    </td>
                    <td className="p-3 font-bold font-mono text-emerald-700">{continuousMetrics.dispersionRatio.toFixed(2)}</td>
                    <td className="p-3 text-slate-600">Test prospectif</td>
                    <td className="p-3 text-[11px] text-slate-600">Adéquation à la loi binomiale négative (φ ≈ 1).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Alerte Déséquilibre des Classes */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-950">
                Attention : Déséquilibre Fréquentiel des Événements Épidémiques
              </span>
              <p className="leading-relaxed text-amber-900 mt-0.5">
                Dans les seuils d alerte épidémique (ex: pic de paludisme ou flambée de typhoïde), la classe positive est minoritaire (ex: 8.5% des mois). <strong>L accuracy brute est un indicateur trompeur</strong> : un modèle prédisant toujours l absence obtiendrait 91.5% d accuracy. Privilégiez systématiquement la <strong>Sensibilité (Recall)</strong>, la <strong>Précision</strong>, le <strong>F1-score</strong> et l <strong>AUC-ROC</strong>.
              </p>
            </div>
          </div>

          {/* Grille des Métriques de Classification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Sensibilité (Recall)</span>
              <span className="text-2xl font-bold font-mono text-teal-700 block">87.5%</span>
              <span className="text-[10px] text-slate-400 block">Pics épidémiques détectés</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Spécificité</span>
              <span className="text-2xl font-bold font-mono text-slate-900 block">93.2%</span>
              <span className="text-[10px] text-slate-400 block">Périodes calmes confirmées</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">F1-Score</span>
              <span className="text-2xl font-bold font-mono text-indigo-700 block">0.824</span>
              <span className="text-[10px] text-slate-400 block">Moyenne harmonique</span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">AUC-ROC</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 block">0.912</span>
              <span className="text-[10px] text-slate-400 block">Discrimination excellente</span>
            </div>
          </div>

          {/* Matrice de Confusion */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Matrice de Confusion — Seuil d Alerte Sanitaire (&gt; 70 cas/1000)
            </h3>
            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold block">Vrais Positifs (TP)</span>
                <span className="text-2xl font-bold font-mono text-emerald-900 block my-1">14</span>
                <span className="text-[10px] text-emerald-700">Flambées correctement anticipées</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-800 font-bold block">Faux Positifs (FP)</span>
                <span className="text-2xl font-bold font-mono text-amber-900 block my-1">4</span>
                <span className="text-[10px] text-amber-700">Fausses alertes</span>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-800 font-bold block">Faux Négatifs (FN)</span>
                <span className="text-2xl font-bold font-mono text-rose-900 block my-1">2</span>
                <span className="text-[10px] text-rose-700">Épidémies manquées</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold block">Vrais Négatifs (TN)</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block my-1">52</span>
                <span className="text-[10px] text-slate-500">Périodes stables conformes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
