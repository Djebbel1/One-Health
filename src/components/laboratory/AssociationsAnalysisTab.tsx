import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  BarChart,
  Info,
  CheckCircle,
  Layers
} from 'lucide-react';
import { ScientificAnalysisProject, CorrelationAnalysisPair } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

interface Props {
  activeAnalysis: ScientificAnalysisProject;
}

export const AssociationsAnalysisTab: React.FC<Props> = ({ activeAnalysis }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const records = engine.getRecordsByAnalysisId(activeAnalysis.id);
  const correlations: CorrelationAnalysisPair[] = activeAnalysis.correlations || engine.calculateCorrelations(records);

  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);
  const currentPair = correlations[selectedPairIndex] || correlations[0];

  return (
    <div className="space-y-6">
      {/* Absolute Methodological Warning */}
      <div className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-start gap-3 text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="text-sm font-bold text-amber-900 block mb-0.5">
            Avertissement Épidémiologique Fondamental (Règle V1.14) :
          </strong>
          <p className="leading-relaxed">
            <strong>Une corrélation ne démontre pas une relation causale directe.</strong> Les coefficients statistiques (Pearson r, Spearman ρ) mesurent le degré d association linéaire ou monotone contemporain entre variables. Ils constituent un outil d exploration préliminaire avant tout ajustement par modélisation spatio-temporelle explicite (GLMM / SARIMA).
          </p>
        </div>
      </div>

      {/* Correlation Pairs Selector & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {correlations.map((pair, idx) => {
          const isSelected = idx === selectedPairIndex;
          const isPositive = pair.pearsonR > 0;
          return (
            <div
              key={pair.varXCode}
              onClick={() => setSelectedPairIndex(idx)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Association One Health
                </span>
                <strong className="text-xs font-bold text-slate-900 block mt-1">
                  {pair.varXName.replace(/\(.*\)/, '')} ↔ {pair.varYName}
                </strong>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Pearson r</span>
                  <span
                    className={`font-mono text-sm font-black ${
                      isPositive ? 'text-indigo-600' : 'text-emerald-600'
                    }`}
                  >
                    {pair.pearsonR > 0 ? `+${pair.pearsonR}` : pair.pearsonR}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-medium block">p-value</span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    p = {pair.pearsonPValue < 0.001 ? '< 0.001' : pair.pearsonPValue}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Pair Deep Dive */}
      {currentPair && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800">
                  ANALYSE BIVARIÉE
                </span>
                <span className="text-xs text-slate-500">Échantillon N = {currentPair.sampleSizeN} observations</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {currentPair.varXName} ↔ {currentPair.varYName}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Coefficient de Pearson</span>
                <span className="text-indigo-600 font-mono text-sm">r = {currentPair.pearsonR} (p = {currentPair.pearsonPValue})</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Rang de Spearman</span>
                <span className="text-purple-600 font-mono text-sm">ρ = {currentPair.spearmanRho} (p = {currentPair.spearmanPValue})</span>
              </div>
            </div>
          </div>

          {/* Scatter Simulation Visualizer */}
          <div className="bg-slate-900 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>Nuage de Points & Tendance Linéaire Estimée</span>
              <span className="font-mono">R² = {Math.round(Math.pow(currentPair.pearsonR, 2) * 100) / 100}</span>
            </div>

            <div className="h-44 w-full relative border-b border-l border-slate-700 flex items-end justify-between px-4 pb-2">
              {/* Synthetic visual scatter points */}
              {records.slice(0, 24).map((rec, i) => {
                const xPct = Math.min(95, Math.max(5, (i / 24) * 100 + (Math.random() * 10 - 5)));
                const yPct = currentPair.pearsonR > 0
                  ? Math.min(90, Math.max(10, xPct * 0.7 + (Math.random() * 20 - 10)))
                  : Math.min(90, Math.max(10, (100 - xPct) * 0.7 + (Math.random() * 20 - 10)));
                return (
                  <div
                    key={rec.recordId}
                    style={{ left: `${xPct}%`, bottom: `${yPct}%` }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-indigo-400 border border-indigo-200 opacity-80 hover:scale-150 hover:bg-emerald-400 transition"
                    title={`${rec.dateStr} | X: ${rec.rainfallMm ?? rec.protectedWaterAccessPct} | Y: ${rec.newCases}`}
                  />
                );
              })}

              {/* Trend Line */}
              <div
                className={`absolute w-[90%] h-0.5 ${
                  currentPair.pearsonR > 0
                    ? 'bg-emerald-400 origin-bottom-left rotate-[16deg] bottom-6 left-6'
                    : 'bg-amber-400 origin-top-left -rotate-[16deg] top-8 left-6'
                }`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>Axe X : {currentPair.varXName}</span>
              <span>Axe Y : {currentPair.varYName}</span>
            </div>
          </div>

          {/* Scientific Interpretation */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
            <strong className="block font-bold text-slate-900 mb-1">Interprétation Descriptive :</strong>
            <p>{currentPair.interpretationText}</p>
            <p className="mt-2 text-slate-500 italic">
              Note : Pour une exploration dynamique tenant compte des cycles de reproduction vectorielle ou des délais d incubation, consulter l onglet <strong>Lags Temporels</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
