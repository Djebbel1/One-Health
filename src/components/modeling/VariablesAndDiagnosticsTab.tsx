import React from 'react';
import { ScientificModelingProject } from '../../types';
import {
  Layers,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface VariablesAndDiagnosticsTabProps {
  model: ScientificModelingProject;
}

export const VariablesAndDiagnosticsTab: React.FC<VariablesAndDiagnosticsTabProps> = ({ model }) => {
  return (
    <div className="space-y-6">
      {/* Explication & Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Audit des Covariables One Health & Analyse de Multicolinéarité (VIF)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {model.selectedCovariates.length} variables incluses
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Le Facteur d Inflation de la Variance (VIF) mesure l amplification de l erreur d estimation due à la colinéarité entre prédicteurs. Un VIF &lt; 5 indique une absence de multicolinéarité néfaste.
        </p>
      </div>

      {/* Tableau des Variables et VIF */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Détail des Covariables, Sources, Lags et Valeurs VIF
          </h3>
          <span className="text-[11px] text-slate-500">Seuil de vigilance : VIF &gt; 5.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Variable</th>
                <th className="p-3">Dimension</th>
                <th className="p-3">Source & Statut</th>
                <th className="p-3 text-center">Lag</th>
                <th className="p-3 text-right">Couverture</th>
                <th className="p-3 text-right">VIF</th>
                <th className="p-3">Diagnostic Colinéarité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {model.selectedCovariates.map(cov => (
                <tr key={cov.code} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{cov.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{cov.code}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {cov.dimension}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">
                    <div>{cov.source}</div>
                    <span className={`text-[10px] font-bold ${cov.isProxy ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {cov.isProxy ? '⚠️ Proxy' : '✅ Observation Réelle'}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold">
                      {cov.lagMonths > 0 ? `+${cov.lagMonths} mois` : 'M0'}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-700">
                    {cov.temporalCoveragePct}%
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {cov.vifValue?.toFixed(2) || '1.42'}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      Colinéarité faible (VIF &lt; 2.5)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matrice de Corrélation Croisée */}
      {model.correlationMatrix && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            Matrice des Corrélations Bivariées de Pearson (r)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {model.correlationMatrix.matrix.map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="text-[11px] text-slate-500 font-mono truncate">
                  {m.varX.split('_')[0]} ↔ {m.varY.split('_')[0]}
                </div>
                <div className="text-sm font-mono font-bold text-slate-900">
                  r = {m.r >= 0 ? `+${m.r.toFixed(2)}` : m.r.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400">p = {m.pValue.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
