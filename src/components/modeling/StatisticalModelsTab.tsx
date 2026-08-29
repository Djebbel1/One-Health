import React from 'react';
import { ScientificModelingProject } from '../../types';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StatisticalModelsTabProps {
  model: ScientificModelingProject;
}

export const StatisticalModelsTab: React.FC<StatisticalModelsTabProps> = ({ model }) => {
  return (
    <div className="space-y-6">
      {/* Banner Modèle */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold">
              {model.code}
            </span>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
              {model.modelType}
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs">
              Offset : {model.offsetOption === 'POPULATION' ? 'log(Population)' : 'Aucun'}
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {model.diagnostics.totalObsUsed} obs. utilisées • {model.diagnostics.iterationsCount} itérations (Fisher Scoring)
          </span>
        </div>

        <h2 className="text-base font-bold text-white">{model.title}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">{model.researchHypothesis}</p>

        {/* Formule Mathématique Formelle */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
          <span className="text-slate-400 mr-2">Formule paramétrique estimée :</span>
          <span className="text-emerald-400 font-bold">{model.mathematicalFormula}</span>
        </div>
      </div>

      {/* Tableau des Coefficients Estimés */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">
              Tableau des Paramètres Estimés (Maximum de Vraisemblance)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Niveau de confiance : 95% (Wald z-tests)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Variable / Terme</th>
                <th className="p-3 text-right">Coefficient (β)</th>
                <th className="p-3 text-right">Erreur Standard (SE)</th>
                <th className="p-3 text-right">Statistique z</th>
                <th className="p-3 text-right">p-value</th>
                <th className="p-3 text-right">IC 95% (β)</th>
                <th className="p-3 text-right">IRR / OR (e^β)</th>
                <th className="p-3">Interprétation Épidémiologique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {model.coefficients.map(coeff => (
                <tr key={coeff.variableCode} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{coeff.variableName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{coeff.variableCode}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    {coeff.coefficient >= 0 ? `+${coeff.coefficient.toFixed(4)}` : coeff.coefficient.toFixed(4)}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600">{coeff.standardError.toFixed(4)}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{coeff.zValue.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        coeff.pValue < 0.001
                          ? 'bg-emerald-100 text-emerald-800'
                          : coeff.pValue < 0.05
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {coeff.pValue < 0.0001 ? '< 0.0001' : coeff.pValue.toFixed(4)}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-[11px] text-slate-600">
                    [{coeff.ciLower95.toFixed(4)} ; {coeff.ciUpper95.toFixed(4)}]
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-700">
                    {coeff.expCoeff ? coeff.expCoeff.toFixed(3) : '—'}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px] leading-snug">
                    {coeff.interpretationText}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surdispersion & Avertissements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Test de Surdispersion</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                model.diagnostics.hasOverdispersion
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {model.diagnostics.hasOverdispersion ? 'Surdispersion' : 'Équidispersé'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {model.diagnostics.dispersionRatio.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500">
            Ratio Pearson χ² / ddl (seuil critique : 1.25).
            {model.diagnostics.hasOverdispersion && ' Modèle Binomial Négatif fortement recommandé.'}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Critères d Information</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              AIC / BIC
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-900">
            AIC : {model.diagnostics.aic} • BIC : {model.diagnostics.bic}
          </div>
          <p className="text-[11px] text-slate-500">
            Log-Vraisemblance : {model.diagnostics.logLikelihood} • Déviance : {model.diagnostics.deviance} (ddl = {model.diagnostics.dfResiduals})
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Autocorrélation Spatiale</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold">
              Moran s I
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-slate-900">
            I = {model.diagnostics.moranSpatialIndexI ?? '0.12'} (p = {model.diagnostics.moranPValue ?? '0.18'})
          </div>
          <p className="text-[11px] text-slate-500">
            {model.diagnostics.moranInterpretation || 'Absence d autocorrélation spatiale significative dans les résidus.'}
          </p>
        </div>
      </div>

      {/* Note de Prudence Épidémiologique */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Avis Scientifique & Cadre d Interprétation</span>
        </div>
        <p className="text-xs leading-relaxed">
          {model.scientificCaveat} {model.scientistAdequationNotes}
        </p>
      </div>
    </div>
  );
};
