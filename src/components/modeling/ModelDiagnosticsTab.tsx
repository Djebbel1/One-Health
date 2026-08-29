import React from 'react';
import { ScientificModelingProject } from '../../types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface ModelDiagnosticsTabProps {
  model: ScientificModelingProject;
}

export const ModelDiagnosticsTab: React.FC<ModelDiagnosticsTabProps> = ({ model }) => {
  const diag = model.diagnostics;

  return (
    <div className="space-y-6">
      {/* Résumé de Convergence & Échantillon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Convergence de l Algorithme</span>
          <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Atteinte ({diag.iterationsCount} itérations)
          </div>
          <p className="text-[10px] text-slate-400">Fisher Scoring / IRLS</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Observations Utilisées</span>
          <div className="text-lg font-black text-slate-900">
            {diag.totalObsUsed} / {diag.totalObsInitial}
          </div>
          <p className="text-[10px] text-slate-400">
            {diag.totalObsExcluded} exclues (données manquantes légitimes)
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Déviance Résiduelle</span>
          <div className="text-lg font-black text-slate-900">
            {diag.deviance}
          </div>
          <p className="text-[10px] text-slate-400">ddl = {diag.dfResiduals}</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500">Ratio de Dispersion</span>
          <div className="text-lg font-black text-indigo-700">
            {diag.dispersionRatio}
          </div>
          <p className="text-[10px] text-slate-400">
            {diag.hasOverdispersion ? '⚠️ Surdispersion' : '✅ Modèle équilibré'}
          </p>
        </div>
      </div>

      {/* Distribution des Résidus */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Distribution des Résidus de Pearson Standardisés
          </h3>
          <span className="text-[11px] text-slate-500">Moyenne : {diag.residualsDistribution.mean} • Écart-type : {diag.residualsDistribution.stdDev}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400">Minimum</span>
            <div className="text-xs font-mono font-bold text-slate-800">{diag.residualsDistribution.min}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400">1er Quartile (Q1)</span>
            <div className="text-xs font-mono font-bold text-slate-800">{diag.residualsDistribution.q1}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400">Médiane</span>
            <div className="text-xs font-mono font-bold text-slate-800">{diag.residualsDistribution.median}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400">3ème Quartile (Q3)</span>
            <div className="text-xs font-mono font-bold text-slate-800">{diag.residualsDistribution.q3}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400">Maximum</span>
            <div className="text-xs font-mono font-bold text-slate-800">{diag.residualsDistribution.max}</div>
          </div>
        </div>
      </div>

      {/* Observations Influentes et Effet de Levier */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Audit des Observations Influentes (Distance de Cook & Effet de Levier h_ii)
          </h3>
          <span className="text-[11px] text-slate-500">Identification sans suppression automatique</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">ID Enregistrement</th>
                <th className="p-3">Zone de Santé</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Distance de Cook (D)</th>
                <th className="p-3 text-right">Effet Levier (h)</th>
                <th className="p-3 text-right">Résidu Standardisé</th>
                <th className="p-3">Statut & Note Scientifique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {diag.influentialObservations.map(obs => (
                <tr key={obs.recordId} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-800">{obs.recordId}</td>
                  <td className="p-3 text-slate-700">{obs.zoneName}</td>
                  <td className="p-3 font-mono text-slate-600">{obs.dateStr}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">{obs.cooksDistance}</td>
                  <td className="p-3 text-right font-mono text-slate-600">{obs.leverageHii}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{obs.standardizedResidual}</td>
                  <td className="p-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          obs.isInfluential ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {obs.isInfluential ? 'Observation Pivotale' : 'Normal'}
                      </span>
                      <span>{obs.scientificNote}</span>
                    </div>
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
