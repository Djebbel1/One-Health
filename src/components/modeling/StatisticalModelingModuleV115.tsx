import React, { useState } from 'react';
import {
  ModelingSubTab,
  ScientificModelingProject,
  ScientificAnalysisProject
} from '../../types';
import { MOCK_INITIAL_MODELS_V115 } from '../../data/mockModelingDataV115';
import { MOCK_INITIAL_ANALYSES_V114 } from '../../data/mockScientificAnalysisDataV114';
import { NewModelingWizard } from './NewModelingWizard';
import { StatisticalModelsTab } from './StatisticalModelsTab';
import { SpatioTemporalModelsTab } from './SpatioTemporalModelsTab';
import { VariablesAndDiagnosticsTab } from './VariablesAndDiagnosticsTab';
import { ModelDiagnosticsTab } from './ModelDiagnosticsTab';
import { ModelComparisonTab } from './ModelComparisonTab';
import { PredictionsTab } from './PredictionsTab';
import { RiskMappingTab } from './RiskMappingTab';
import { SensitivityAndOneHealthTab } from './SensitivityAndOneHealthTab';
import { HistoryAndReproducibilityTab } from './HistoryAndReproducibilityTab';
import { AutomatedModelingReportTab } from './AutomatedModelingReportTab';
import { ModelingValidationSuiteTab } from './ModelingValidationSuiteTab';
import {
  Calculator,
  Plus,
  Layers,
  MapPin,
  Activity,
  Sliders,
  TrendingUp,
  GitCompare,
  FileText,
  ShieldCheck,
  History,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';

interface StatisticalModelingModuleV115Props {
  existingAnalyses?: ScientificAnalysisProject[];
}

export const StatisticalModelingModuleV115: React.FC<StatisticalModelingModuleV115Props> = ({
  existingAnalyses = MOCK_INITIAL_ANALYSES_V114
}) => {
  const [models, setModels] = useState<ScientificModelingProject[]>(MOCK_INITIAL_MODELS_V115);
  const [activeModelId, setActiveModelId] = useState<string>(
    MOCK_INITIAL_MODELS_V115.length > 0 ? MOCK_INITIAL_MODELS_V115[0].id : 'MODEL-001'
  );
  const [activeSubTab, setActiveSubTab] = useState<ModelingSubTab>('MODELES_STATISTIQUES');
  const [isCreatingModel, setIsCreatingModel] = useState<boolean>(false);

  const currentModel = models.find(m => m.id === activeModelId) || models[0];

  const handleModelCreated = (newModel: ScientificModelingProject) => {
    setModels(prev => [newModel, ...prev]);
    setActiveModelId(newModel.id);
    setIsCreatingModel(false);
    setActiveSubTab('MODELES_STATISTIQUES');
  };

  const navTabs: { id: ModelingSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'MODELES_STATISTIQUES', label: '1. Modèles & GLM', icon: <Calculator className="w-4 h-4" /> },
    { id: 'MODELES_SPATIO_TEMPORELS', label: '2. Spatio-Temporel', icon: <Layers className="w-4 h-4" /> },
    { id: 'VARIABLES_ET_DIAGNOSTIC', label: '3. Variables & VIF', icon: <Sliders className="w-4 h-4" /> },
    { id: 'DIAGNOSTICS_COMPLETS', label: '4. Diagnostics Résidus', icon: <Activity className="w-4 h-4" /> },
    { id: 'COMPARAISON_MODELES', label: '5. Comparaison Modèles', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'PREDICTIONS', label: '6. Prédictions', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'CARTOGRAPHIE_RISQUE', label: '7. Carte du Risque', icon: <MapPin className="w-4 h-4" /> },
    { id: 'RISQUE_INTEGRE_ET_SENSIBILITE', label: '8. Sensibilité & One Health', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'HISTORIQUE_ET_REPRODUCTIBILITE', label: '9. Reproductibilité R/Python', icon: <History className="w-4 h-4" /> },
    { id: 'RAPPORTS_AUTOMATISES', label: '10. Rapport Scientifique (20 Sec)', icon: <FileText className="w-4 h-4" /> },
    { id: 'SUITE_TESTS_V115', label: '11. Suite de Tests (12 Tests)', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Module */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                V1.15 — Module de Recherche Opérationnelle
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold">
                Passerelle Directe V1.14 ➔ V1.15
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Moteur de Modélisation Statistique et Spatio-Temporelle
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ajustement de régressions de Poisson, Binomiale Négative et Logistique, intégration des décalages temporels (Lags), contrôle de surdispersion, multicolinéarité (VIF), diagnostic spatial de Moran et cartographie prédictive du risque One Health.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sélecteur de Modèle Estimé */}
            <div className="bg-slate-800/80 border border-slate-700/80 p-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-semibold px-2">Étude active :</span>
              <select
                value={activeModelId}
                onChange={e => {
                  setActiveModelId(e.target.value);
                  setIsCreatingModel(false);
                }}
                className="bg-slate-900 text-white text-xs font-semibold p-2 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.code} — {m.pathology} ({m.modelType})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsCreatingModel(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Modélisation
            </button>
          </div>
        </div>

        {/* Rappel Épistémologique Permanent */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <strong className="text-amber-300">Règle Épistémologique Fondamentale :</strong>
            <span>Association statistique ≠ Causalité directe.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {models.length} modèle(s) estimé(s) • Zéro conversion de NULL en 0
          </span>
        </div>
      </div>

      {/* Mode Assistant / Wizard de Nouvelle Modélisation */}
      {isCreatingModel ? (
        <NewModelingWizard
          existingAnalyses={existingAnalyses}
          onModelCreated={handleModelCreated}
          onCancel={() => setIsCreatingModel(false)}
        />
      ) : (
        <>
          {/* Navigation Sub-Tabs Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 overflow-x-auto">
            <div className="flex items-center gap-1 min-w-max text-xs">
              {navTabs.map(tab => {
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`px-3 py-2 rounded-xl font-bold flex items-center gap-2 transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Router */}
          <div className="transition-all duration-200">
            {activeSubTab === 'MODELES_STATISTIQUES' && currentModel && (
              <StatisticalModelsTab model={currentModel} />
            )}

            {activeSubTab === 'MODELES_SPATIO_TEMPORELS' && currentModel && (
              <SpatioTemporalModelsTab model={currentModel} />
            )}

            {activeSubTab === 'VARIABLES_ET_DIAGNOSTIC' && currentModel && (
              <VariablesAndDiagnosticsTab model={currentModel} />
            )}

            {activeSubTab === 'DIAGNOSTICS_COMPLETS' && currentModel && (
              <ModelDiagnosticsTab model={currentModel} />
            )}

            {activeSubTab === 'COMPARAISON_MODELES' && currentModel && (
              <ModelComparisonTab currentModel={currentModel} allModels={models} />
            )}

            {activeSubTab === 'PREDICTIONS' && currentModel && (
              <PredictionsTab model={currentModel} />
            )}

            {activeSubTab === 'CARTOGRAPHIE_RISQUE' && currentModel && (
              <RiskMappingTab model={currentModel} />
            )}

            {activeSubTab === 'RISQUE_INTEGRE_ET_SENSIBILITE' && currentModel && (
              <SensitivityAndOneHealthTab model={currentModel} />
            )}

            {activeSubTab === 'HISTORIQUE_ET_REPRODUCTIBILITE' && currentModel && (
              <HistoryAndReproducibilityTab model={currentModel} />
            )}

            {activeSubTab === 'RAPPORTS_AUTOMATISES' && currentModel && (
              <AutomatedModelingReportTab model={currentModel} />
            )}

            {activeSubTab === 'SUITE_TESTS_V115' && (
              <ModelingValidationSuiteTab />
            )}
          </div>
        </>
      )}
    </div>
  );
};
