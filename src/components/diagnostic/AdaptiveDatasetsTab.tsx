import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Database,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Filter,
  Check,
  TrendingUp,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import {
  AdaptiveAnalyticalDatasetConfig,
  SensitivityModelComparison
} from '../../types';
import {
  MOCK_ADAPTIVE_DATASET_CONFIGS_V113,
  MOCK_SENSITIVITY_COMPARISONS_V113
} from '../../data/mockScientificDiagnosticDataV113';

interface AdaptiveDatasetsTabProps {
  adaptiveDatasets: AdaptiveAnalyticalDatasetConfig[];
  sensitivityModel: SensitivityModelComparison;
}

export const AdaptiveDatasetsTab: React.FC<AdaptiveDatasetsTabProps> = ({
  adaptiveDatasets,
  sensitivityModel
}) => {
  const [selectedDataset, setSelectedDataset] = useState<AdaptiveAnalyticalDatasetConfig>(adaptiveDatasets[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Préparation Analytique & Datasets Adaptatifs (2018–2026)
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Génération de jeux de données optimisés pour chaque question de recherche, avec exclusion raisonnée des variables incomplètes et intégration contrôlée des proxies historiques.
        </p>
      </div>

      {/* Adaptive Datasets Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dataset List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm">Datasets Adaptatifs Prêts</h4>
            <span className="text-xs text-slate-500">{adaptiveDatasets.length} configurations certifiées</span>
          </div>

          <div className="space-y-2.5">
            {adaptiveDatasets.map(ds => {
              const isSelected = selectedDataset.id === ds.id;
              return (
                <div
                  key={ds.id}
                  onClick={() => setSelectedDataset(ds)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{ds.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      ds.signal === 'VERT'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {ds.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {ds.timeRange.startYear}–{ds.timeRange.endYear}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-800">{ds.totalRecordsCount} lignes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dataset Detail (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Composition Analytique du Dataset
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-0.5">{selectedDataset.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{selectedDataset.notes}</p>
            </div>
            <span className="px-3 py-1 bg-slate-900 text-white font-bold rounded-xl text-xs">
              {selectedDataset.targetPathology}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Included Variables */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase block">
                Variables Incluses ({selectedDataset.includedVariables.length})
              </span>
              <div className="space-y-1.5">
                {selectedDataset.includedVariables.map(v => (
                  <div key={v.variableCode} className="p-2 bg-white/90 rounded-lg border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{v.variableName}</div>
                      <span className="text-[10px] text-slate-500">[{v.dimension}]</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">{v.coveragePct}%</span>
                      {v.isProxyIncluded && (
                        <span className="block text-[9px] font-black text-amber-700">AVEC PROXY</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded Variables with Rationale */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 uppercase block">
                Variables Exclues Raisonnées ({selectedDataset.excludedVariables.length})
              </span>
              <div className="space-y-1.5">
                {selectedDataset.excludedVariables.map(v => (
                  <div key={v.variableCode} className="p-2 bg-white/90 rounded-lg border border-rose-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{v.variableName}</div>
                    <p className="text-[11px] text-rose-900 font-medium leading-tight">
                      Motif : {v.reasonForExclusion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Analysis Comparison (Model A vs Model B vs Model C) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Analyse de Sensibilité & Robustesse des Modèles (A vs B vs C)
            </h4>
            <p className="text-xs text-slate-500">
              Comparaison de l'effet de l'inclusion ou de l'exclusion des proxies environnementaux sur les résultats de régression.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Pathologie cible : {sensitivityModel.pathology}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Model A: Complete real data */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Modèle A (Référence)</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 font-black text-xs text-slate-800">R² = 0.64</span>
              </div>
              <h5 className="font-bold text-slate-800 text-xs mt-1">{sensitivityModel.modelA_Complete.name}</h5>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {sensitivityModel.modelA_Complete.description}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 text-xs font-medium text-slate-800">
              {sensitivityModel.modelA_Complete.keyFindings}
            </div>
          </div>

          {/* Model B: No environmental variables */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase">Modèle B (Sans Env.)</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 font-black text-xs text-amber-900">R² = 0.51</span>
              </div>
              <h5 className="font-bold text-amber-950 text-xs mt-1">{sensitivityModel.modelB_NoEnvironmental.name}</h5>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {sensitivityModel.modelB_NoEnvironmental.description}
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200 text-xs font-medium text-amber-950">
              {sensitivityModel.modelB_NoEnvironmental.deviationFromModelA}
            </div>
          </div>

          {/* Model C: With historical proxies */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase">Modèle C (Avec Proxies)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 font-black text-xs text-emerald-900">R² = 0.72</span>
              </div>
              <h5 className="font-bold text-emerald-950 text-xs mt-1">{sensitivityModel.modelC_WithProxies.name}</h5>
              <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                {sensitivityModel.modelC_WithProxies.description}
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200 text-xs font-medium text-emerald-950">
              {sensitivityModel.modelC_WithProxies.deviationFromModelA}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
          <strong className="font-bold block">Conclusion Scientifique & Recommandation One Health :</strong>
          <p className="leading-relaxed">
            {sensitivityModel.scientificConclusion}
          </p>
        </div>
      </div>
    </div>
  );
};
