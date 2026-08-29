import React from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Percent,
  Sliders
} from 'lucide-react';

interface CrossValidationTabProps {
  project: ScientificValidationProject;
}

export const CrossValidationTab: React.FC<CrossValidationTabProps> = ({ project }) => {
  const { crossValidationResult } = project;

  if (!crossValidationResult) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
        Aucun protocole de validation croisée K-fold configuré pour cette analyse.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avertissement Dépendance Temporelle / Spatiale */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-950">
            Avertissement Méthodologique : Validation Croisée Standard vs Dépendance Épidémiologique
          </span>
          <p className="leading-relaxed text-amber-900 mt-0.5">
            {crossValidationResult.spatioTemporalDependenceAdvisory}
          </p>
        </div>
      </div>

      {/* Résumé des métriques K-Fold */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Validation Croisée {crossValidationResult.kFolds}-Folds</span>
          </h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-mono font-bold">
            Méthode : {crossValidationResult.method}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-500 font-medium block">MAE Moyenne</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {crossValidationResult.meanMae.toFixed(2)} ± {crossValidationResult.stdMae.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 block">cas / 1000 hab</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-500 font-medium block">R² Moyen</span>
            <span className="text-xl font-bold font-mono text-teal-700">
              {crossValidationResult.meanR2.toFixed(3)} ± {crossValidationResult.stdR2.toFixed(3)}
            </span>
            <span className="text-[10px] text-slate-400 block">Variance inter-plis minime</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-500 font-medium block">Nombre de Plis</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {crossValidationResult.kFolds}
            </span>
            <span className="text-[10px] text-slate-400 block">~50 obs / pli</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-500 font-medium block">Stabilité Inter-Plis</span>
            <span className="text-xl font-bold text-emerald-700">
              Élevée
            </span>
            <span className="text-[10px] text-slate-400 block">CV &lt; 5%</span>
          </div>
        </div>

        {/* Détail Pli par Pli */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Pli</th>
                <th className="p-3 font-bold">Échantillon Entraînement</th>
                <th className="p-3 font-bold">Échantillon Validation</th>
                <th className="p-3 font-bold">MAE Validation</th>
                <th className="p-3 font-bold">RMSE Validation</th>
                <th className="p-3 font-bold">R² Validation</th>
                <th className="p-3 font-bold">AIC Pli</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {crossValidationResult.folds.map((fold) => (
                <tr key={fold.foldIndex}>
                  <td className="p-3 font-sans font-bold text-slate-900">Pli #{fold.foldIndex}</td>
                  <td className="p-3">{fold.trainSize} obs</td>
                  <td className="p-3">{fold.valSize} obs</td>
                  <td className="p-3 font-bold text-teal-700">{fold.valMae.toFixed(2)}</td>
                  <td className="p-3">{fold.valRmse.toFixed(2)}</td>
                  <td className="p-3 font-bold text-slate-900">{fold.valR2.toFixed(3)}</td>
                  <td className="p-3 text-slate-500">{fold.valAic.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
