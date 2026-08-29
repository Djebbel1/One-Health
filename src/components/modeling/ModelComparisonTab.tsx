import React, { useState } from 'react';
import { ScientificModelingProject } from '../../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator
} from 'lucide-react';

interface ModelComparisonTabProps {
  currentModel: ScientificModelingProject;
  allModels: ScientificModelingProject[];
}

export const ModelComparisonTab: React.FC<ModelComparisonTabProps> = ({
  currentModel,
  allModels
}) => {
  const [researcherNotes, setResearcherNotes] = useState<string>(
    'Le modèle Binomial Négatif intégrant le Lag 1 mois sur les précipitations offre le meilleur compromis statistique (AIC = 1412.4 vs 1588.6 en Poisson) et biologique (temps d incubation extrinsèque).'
  );

  return (
    <div className="space-y-6">
      {/* Intro Comparaison */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Confrontation des Modèles et Spécifications Alternatives
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {allModels.length} modèles disponibles
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          La sélection du modèle optimal ne repose pas uniquement sur les critères d information (AIC/BIC), mais également sur la plausibilité biologique, la parcimonie et la sensibilité aux données manquantes.
        </p>
      </div>

      {/* Tableau Comparatif Multi-Modèles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-900">
            Tableau Comparatif des Performances et Critères d Information
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Spécification du Modèle</th>
                <th className="p-3">Famille / Lien</th>
                <th className="p-3 text-right">ddl Résiduels</th>
                <th className="p-3 text-right">Log-Vraisemblance</th>
                <th className="p-3 text-right">AIC</th>
                <th className="p-3 text-right">BIC</th>
                <th className="p-3 text-right">Dispersion</th>
                <th className="p-3">Appréciation Scientifique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allModels.map(m => (
                <tr
                  key={m.id}
                  className={m.id === currentModel.id ? 'bg-indigo-50/40 font-semibold' : 'hover:bg-slate-50'}
                >
                  <td className="p-3">
                    <div className="text-slate-900 font-bold">{m.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.code}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-700">{m.modelType}</td>
                  <td className="p-3 text-right font-mono">{m.diagnostics.dfResiduals}</td>
                  <td className="p-3 text-right font-mono">{m.diagnostics.logLikelihood}</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-700">
                    {m.diagnostics.aic}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {m.diagnostics.bic}
                  </td>
                  <td className="p-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        m.diagnostics.dispersionRatio > 1.3
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {m.diagnostics.dispersionRatio}
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-600">
                    {m.id === currentModel.id ? (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                        Modèle Actuel
                      </span>
                    ) : (
                      'Spécification alternative'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadre de Justification du Chercheur */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900">
          Justification Scientifique du Choix Final du Modèle
        </h3>
        <textarea
          rows={3}
          value={researcherNotes}
          onChange={e => setResearcherNotes(e.target.value)}
          className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
          placeholder="Saisissez la justification épidémiologique et statistique du choix du modèle..."
        />
        <div className="flex justify-end">
          <button
            onClick={() => alert('Justification enregistrée dans la fiche de reproduction.')}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
          >
            Enregistrer l Appréciation
          </button>
        </div>
      </div>
    </div>
  );
};
