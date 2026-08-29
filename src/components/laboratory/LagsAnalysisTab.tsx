import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sliders,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ScientificAnalysisProject, LagAnalysisResult } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

interface Props {
  activeAnalysis: ScientificAnalysisProject;
}

export const LagsAnalysisTab: React.FC<Props> = ({ activeAnalysis }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const records = engine.getRecordsByAnalysisId(activeAnalysis.id);
  const lagResults: LagAnalysisResult[] = activeAnalysis.lagResults || engine.calculateLags(records);

  const [selectedLagResultIdx, setSelectedLagResultIdx] = useState<number>(0);
  const [maxConfigurableLag, setMaxConfigurableLag] = useState<number>(4);

  const currentResult = lagResults[selectedLagResultIdx] || lagResults[0];

  return (
    <div className="space-y-6">
      {/* Header with lag configurator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800">
              EXPLORATION DÉCALAGES TEMPORELS
            </span>
            <span className="text-xs text-slate-500 font-medium">Structure AR / DLNM préparatoire</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Analyse des Décalages Temporels (Lags 0 à {maxConfigurableLag} Mois)
          </h3>
          <p className="text-xs text-slate-500">
            Évaluation des fenêtres de latence biologique entre survenue des pluies et enregistrement des cas cliniques.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-700">Lag Maximum :</span>
          <select
            value={maxConfigurableLag}
            onChange={e => setMaxConfigurableLag(Number(e.target.value))}
            className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-slate-800"
          >
            {[2, 3, 4, 5, 6].map(l => (
              <option key={l} value={l}>{l} mois</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lag Result Selector (Paludisme vs Typhoïde) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lagResults.map((lr, idx) => {
          const isSel = idx === selectedLagResultIdx;
          return (
            <div
              key={lr.diseaseVar}
              onClick={() => setSelectedLagResultIdx(idx)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                isSel
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Relation Climat ↔ Pathologie
                </span>
                <strong className="text-sm font-bold text-slate-900 block">
                  {lr.climaticVar} → {lr.diseaseVar}
                </strong>
                <span className="text-xs text-indigo-700 font-semibold block">
                  Lag Optimal Détecté : <strong>Lag {lr.optimalLagMonths} mois</strong>
                </span>
              </div>
              <div className="p-3 rounded-full bg-white border border-slate-200 text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lag Table & Biological Interpretation */}
      {currentResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Coefficients de Corrélation Croisée ({currentResult.climaticVar} vs {currentResult.diseaseVar})
            </span>
            <span className="text-[11px] text-slate-500">
              Décalage mensuel glissant
            </span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Décalage (Lag)</th>
                  <th className="p-3">Exemple Concret</th>
                  <th className="p-3 text-right">Observations N</th>
                  <th className="p-3 text-right font-bold text-indigo-700">Corrélation r</th>
                  <th className="p-3 text-right">Significativité</th>
                  <th className="p-3">Interprétation Épidémiologique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {currentResult.lags.filter(l => l.lagMonths <= maxConfigurableLag).map(lag => {
                  const isOptimal = lag.lagMonths === currentResult.optimalLagMonths;
                  return (
                    <tr
                      key={lag.lagMonths}
                      className={isOptimal ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-black text-[11px] font-mono ${
                            isOptimal ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            Lag {lag.lagMonths} {lag.lagMonths === 0 ? '(Contemporain)' : lag.lagMonths === 1 ? 'mois' : 'mois'}
                          </span>
                          {isOptimal && (
                            <span className="text-[10px] text-indigo-700 font-black flex items-center gap-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              OPTIMAL
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">
                        {lag.lagMonths === 0
                          ? 'Pluie Janvier → Cas Janvier'
                          : lag.lagMonths === 1
                          ? 'Pluie Janvier → Cas Février'
                          : `Pluie Janvier → Cas Mois +${lag.lagMonths}`}
                      </td>
                      <td className="p-3 text-right font-mono">{lag.sampleSizeN}</td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-600 text-sm">
                        +{lag.correlationR}
                      </td>
                      <td className="p-3 text-right font-mono">
                        {lag.pValue < 0.001 ? 'p < 0.001' : `p = ${lag.pValue}`}
                      </td>
                      <td className="p-3 text-slate-700">
                        {lag.interpretation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong className="block font-bold text-slate-900 mb-1">Synthèse & Cohérence Biologique :</strong>
            <p>{currentResult.summaryNote}</p>
            <p className="mt-2 text-slate-500 italic">
              Règle scientifique : Ne jamais imposer qu un lag existe a priori. L absence de lag significatif (ex: association contemporaine directe pour la contamination hydrique de surface) constitue un résultat scientifique valide.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
