import React, { useState } from 'react';
import {
  ScientificValidationProject,
  ScientificModelingProject,
  ValidationSubTabId
} from '../../types';
import {
  initialValidationProjectsV116,
  initialValidationScenariosV116
} from '../../data/mockScientificValidationDataV116';
import { ModelValidationOverviewTab } from './ModelValidationOverviewTab';
import { TemporalValidationTab } from './TemporalValidationTab';
import { SpatialValidationTab } from './SpatialValidationTab';
import { CrossValidationTab } from './CrossValidationTab';
import { CalibrationTab } from './CalibrationTab';
import { PerformanceMetricsTab } from './PerformanceMetricsTab';
import { ResidualsAnalysisTab } from './ResidualsAnalysisTab';
import { RobustnessAndSensitivityTab } from './RobustnessAndSensitivityTab';
import { UncertaintyAndIntervalsTab } from './UncertaintyAndIntervalsTab';
import { ValidatedRiskMappingTab } from './ValidatedRiskMappingTab';
import { ValidationReport20SectionsTab } from './ValidationReport20SectionsTab';
import { ReproducibilityAndHistoryTab } from './ReproducibilityAndHistoryTab';
import { ValidationSuiteV116Tab } from './ValidationSuiteV116Tab';
import { NewValidationWizardModal } from './NewValidationWizardModal';

import {
  ShieldCheck,
  Calendar,
  MapPin,
  Layers,
  Scale,
  Activity,
  Sliders,
  HelpCircle,
  FileText,
  Code,
  FlaskConical,
  Plus,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';

interface ScientificValidationModuleV116Props {
  availableModelingProjects?: ScientificModelingProject[];
}

export const ScientificValidationModuleV116: React.FC<ScientificValidationModuleV116Props> = ({
  availableModelingProjects = []
}) => {
  const [projects, setProjects] = useState<ScientificValidationProject[]>(initialValidationProjectsV116);
  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialValidationProjectsV116[0]?.id || 'VAL_PROJ_2026_001'
  );
  const [activeSubTab, setActiveSubTab] = useState<ValidationSubTabId>('VUE_ENSEMBLE');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  const currentProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || initialValidationProjectsV116[0];

  const handleValidationCreated = (newValidation: ScientificValidationProject) => {
    setProjects((prev) => [newValidation, ...prev]);
    setActiveProjectId(newValidation.id);
    setActiveSubTab('VUE_ENSEMBLE');
  };

  const navTabs: { id: ValidationSubTabId; label: string; icon: any }[] = [
    { id: 'VUE_ENSEMBLE', label: 'Vue d Ensemble', icon: ShieldCheck },
    { id: 'VALIDATION_TEMPORELLE', label: 'Temporelle', icon: Calendar },
    { id: 'VALIDATION_SPATIALE', label: 'Spatiale', icon: MapPin },
    { id: 'VALIDATION_CROISEE', label: 'Validation Croisée', icon: Layers },
    { id: 'CALIBRATION', label: 'Calibration', icon: Scale },
    { id: 'METRIQUES', label: 'Métriques', icon: Activity },
    { id: 'RESIDUS', label: 'Résidus', icon: Sliders },
    { id: 'ROBUSTESSE', label: 'Robustesse', icon: Sliders },
    { id: 'INCERTITUDE', label: 'Incertitude & Intervalles', icon: HelpCircle },
    { id: 'VALIDATION_CARTES', label: 'Cartes Validées', icon: MapPin },
    { id: 'RAPPORT_20_SECTIONS', label: 'Rapport 20 Sections', icon: FileText },
    { id: 'REPRODUCTIBILITE', label: 'Code R/Python', icon: Code },
    { id: 'BANC_DE_TESTS', label: 'Banc de Tests V1.16', icon: FlaskConical }
  ];

  return (
    <div className="min-h-screen bg-slate-900/5 pb-16 space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Global & Sélecteur de Projet de Validation */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    Validation Scientifique, Robustesse & Fiabilité des Modèles
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    MODULE V1.16
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Plateforme One Health Maniema — Évaluation rigoureuse hors-échantillon, calibration, étanchéité & reproductibilité
                </p>
              </div>
            </div>
          </div>

          {/* Actions & Sélecteur de Projet */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sélecteur de projet */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-medium">Projet actif :</span>
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.title} ({p.pathology})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Validation</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Barre de Navigation des 13 Sous-Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 overflow-x-auto flex items-center space-x-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Contenu Dynamique du Sous-Module Actif */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeSubTab === 'VUE_ENSEMBLE' && (
          <ModelValidationOverviewTab
            project={currentProject}
            onNavigateSubTab={(tabId) => setActiveSubTab(tabId)}
          />
        )}

        {activeSubTab === 'VALIDATION_TEMPORELLE' && (
          <TemporalValidationTab project={currentProject} />
        )}

        {activeSubTab === 'VALIDATION_SPATIALE' && (
          <SpatialValidationTab project={currentProject} />
        )}

        {activeSubTab === 'VALIDATION_CROISEE' && (
          <CrossValidationTab project={currentProject} />
        )}

        {activeSubTab === 'CALIBRATION' && (
          <CalibrationTab project={currentProject} />
        )}

        {activeSubTab === 'METRIQUES' && (
          <PerformanceMetricsTab project={currentProject} />
        )}

        {activeSubTab === 'RESIDUS' && (
          <ResidualsAnalysisTab project={currentProject} />
        )}

        {activeSubTab === 'ROBUSTESSE' && (
          <RobustnessAndSensitivityTab project={currentProject} />
        )}

        {activeSubTab === 'INCERTITUDE' && (
          <UncertaintyAndIntervalsTab project={currentProject} />
        )}

        {activeSubTab === 'VALIDATION_CARTES' && (
          <ValidatedRiskMappingTab project={currentProject} />
        )}

        {activeSubTab === 'RAPPORT_20_SECTIONS' && (
          <ValidationReport20SectionsTab project={currentProject} />
        )}

        {activeSubTab === 'REPRODUCTIBILITE' && (
          <ReproducibilityAndHistoryTab project={currentProject} />
        )}

        {activeSubTab === 'BANC_DE_TESTS' && (
          <ValidationSuiteV116Tab initialScenarios={initialValidationScenariosV116} />
        )}
      </div>

      {/* 4. Wizard Modal pour Nouvelle Validation */}
      <NewValidationWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        availableModels={availableModelingProjects}
        onValidationCreated={handleValidationCreated}
      />

    </div>
  );
};
