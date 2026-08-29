import React from 'react';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  HelpCircle,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { ScientificAnalysisProject } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

interface Props {
  activeAnalysis: ScientificAnalysisProject;
}

export const DescriptiveAnalysisTab: React.FC<Props> = ({ activeAnalysis }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const records = engine.getRecordsByAnalysisId(activeAnalysis.id);
  const stats = activeAnalysis.descriptiveStats || engine.calculateDescriptiveStats(records, activeAnalysis.selectedVariables);

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Statistiques Descriptives & Distribution des Données</h3>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs de position, dispersion, quartiles et répartition des données manquantes.
          </p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-black">
            {records.length} observations auditées
          </span>
        </div>
      </div>

      {/* Numerical Variables Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Variables Numériques Continues
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Règle : Absence de conversion automatique des valeurs NULL en zéro
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Variable</th>
                <th className="p-3">Dimension</th>
                <th className="p-3 text-right">N Valides</th>
                <th className="p-3 text-right">Manquants (%)</th>
                <th className="p-3 text-right font-bold text-indigo-700">Moyenne</th>
                <th className="p-3 text-right">Médiane</th>
                <th className="p-3 text-right">Écart-Type (σ)</th>
                <th className="p-3 text-right">Min – Max</th>
                <th className="p-3 text-right">Q1 – Q3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {stats.filter(s => s.mean !== undefined).map(s => (
                <tr key={s.variableCode} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-semibold text-slate-900">{s.variableName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      {s.dimension}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">{s.countNonMissing}</td>
                  <td className="p-3 text-right">
                    {s.missingPercentage > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {s.missingPercentage}% ({s.countMissing})
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">0%</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-bold text-indigo-700 font-mono">{s.mean}</td>
                  <td className="p-3 text-right font-mono">{s.median}</td>
                  <td className="p-3 text-right font-mono text-slate-600">± {s.stdDev}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{s.min} – {s.max}</td>
                  <td className="p-3 text-right font-mono text-slate-600">
                    [{s.q1 ?? '—'} ; {s.q3 ?? '—'}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categorical Variables & Missing Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              Répartition des Facteurs Environnementaux (Ex: Déchets Kasuku)
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            {stats.find(s => s.categories)?.categories?.map(cat => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>{cat.category}</span>
                  <span className="font-bold">{cat.count} obs ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.category.includes('OUI')
                        ? 'bg-red-500'
                        : cat.category.includes('NON')
                        ? 'bg-emerald-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Garde-Fous Données Manquantes & Biais
            </h4>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <strong className="block font-bold text-amber-950 mb-1">Règle de Traitement Zéro vs NULL :</strong>
              Une observation non réalisée (NULL) n a pas été convertie en 0. Le zéro est exclusivement réservé aux situations où le phénomène a été activement mesuré et quantifié à zéro.
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
              <strong className="block font-bold text-indigo-950 mb-1">Traçabilité des Proxies :</strong>
              Toute donnée extrapolée d une période à une autre (ex: Kasuku 2026 vers 2025) fait l objet d un scellage méthodologique strict avec étiquette PROXY.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
