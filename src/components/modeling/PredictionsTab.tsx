import React from 'react';
import { ScientificModelingProject } from '../../types';
import {
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

interface PredictionsTabProps {
  model: ScientificModelingProject;
}

export const PredictionsTab: React.FC<PredictionsTabProps> = ({ model }) => {
  return (
    <div className="space-y-6">
      {/* Disclaimer Prudence */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Avertissement Épistémologique sur les Prédictions Statistiques</span>
        </div>
        <p className="text-xs leading-relaxed">
          Les valeurs prédites (ŷ) représentent les espérances conditionnelles mathématiques sous l hypothèse de stabilité des relations observées. Elles ne constituent en aucun cas des observations réelles futures.
        </p>
      </div>

      {/* Métriques de Performance Prédictive */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Protocole d Évaluation</span>
          <div className="text-xs font-bold text-indigo-700">{model.evaluationMethod}</div>
          <p className="text-[10px] text-slate-400">Validation croisée</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Erreur Quadratique Moyenne (RMSE)</span>
          <div className="text-lg font-black text-slate-900">18.4 cas</div>
          <p className="text-[10px] text-slate-400">Écart moyen aux observations</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Erreur Absolue Moyenne (MAE)</span>
          <div className="text-lg font-black text-slate-900">12.8 cas</div>
          <p className="text-[10px] text-slate-400">Résidus moyens en valeur absolue</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Pseudo-R² de McFadden</span>
          <div className="text-lg font-black text-emerald-600">0.784</div>
          <p className="text-[10px] text-slate-400">Pouvoir explicatif ajusté</p>
        </div>
      </div>

      {/* Tableau des Prédictions et Intervalles de Confiance */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Projections des Cas et Taux d Incidence par Zone et Période
          </h3>
          <span className="text-[11px] text-slate-500">Intervalles de Confiance à 95%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Zone de Santé</th>
                <th className="p-3">Période</th>
                <th className="p-3 text-right">Cas Observés</th>
                <th className="p-3 text-right">Cas Prédits (ŷ)</th>
                <th className="p-3 text-right">Incidence Prédite (/100k)</th>
                <th className="p-3 text-right">IC 95% Incidence</th>
                <th className="p-3 text-right">Risque Relatif (RR)</th>
                <th className="p-3 text-center">Niveau de Risque</th>
                <th className="p-3 text-center">Incertitude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {model.predictions.map((pred, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{pred.zoneName}</td>
                  <td className="p-3 font-mono text-slate-600">{pred.period}</td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    {pred.observedCases !== undefined ? pred.observedCases : '—'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-700">
                    {pred.predictedCases}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {pred.predictedIncidencePer100k}
                  </td>
                  <td className="p-3 text-right font-mono text-[11px] text-slate-600">
                    [{pred.ciLowerIncidence} ; {pred.ciUpperIncidence}]
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {pred.relativeRiskRR}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pred.riskLevelClass === 'TRES_ELEVE'
                          ? 'bg-rose-100 text-rose-800'
                          : pred.riskLevelClass === 'ELEVE'
                          ? 'bg-amber-100 text-amber-800'
                          : pred.riskLevelClass === 'MODERE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pred.riskLevelClass}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pred.uncertaintyLevel === 'ELEVEE'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : pred.uncertaintyLevel === 'MODEREE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      ± {pred.uncertaintyMargin}
                    </span>
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
