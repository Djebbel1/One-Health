import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  BarChart2,
  Calendar,
  MapPin,
  Activity,
  Clock,
  ArrowRightLeft,
  FileText,
  History,
  CheckCircle,
  Layers,
  ShieldCheck,
  Plus,
  ArrowRight
} from 'lucide-react';
import { LabSubMenu, ScientificAnalysisProject } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';
import { NewAnalysisWizard } from './NewAnalysisWizard';
import { DatasetAnalytiqueTab } from './DatasetAnalytiqueTab';
import { DescriptiveAnalysisTab } from './DescriptiveAnalysisTab';
import { AssociationsAnalysisTab } from './AssociationsAnalysisTab';
import { LagsAnalysisTab } from './LagsAnalysisTab';
import { SpatialTemporalAnalysisTab } from './SpatialTemporalAnalysisTab';
import { AutomatedReportTab } from './AutomatedReportTab';
import { AnalysisHistoryTab } from './AnalysisHistoryTab';
import { LaboratoryValidationSuiteTab } from './LaboratoryValidationSuiteTab';

export const ScientificLaboratoryModuleV114: React.FC = () => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const [analyses, setAnalyses] = useState<ScientificAnalysisProject[]>(engine.getAllAnalyses());
  const [activeAnalysisId, setActiveAnalysisId] = useState<string>(analyses[0]?.id || 'ANALYSIS-001');
  const [currentSubMenu, setCurrentSubMenu] = useState<LabSubMenu>('DATASET_ANALYTIQUE');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  const activeAnalysis = analyses.find(a => a.id === activeAnalysisId) || analyses[0];

  const handleAnalysisCreated = (newProj: ScientificAnalysisProject) => {
    setAnalyses([newProj, ...engine.getAllAnalyses().filter(a => a.id !== newProj.id)]);
    setActiveAnalysisId(newProj.id);
    setIsCreatingNew(false);
    setCurrentSubMenu('DATASET_ANALYTIQUE');
  };

  const navItems: { id: LabSubMenu; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'DATASET_ANALYTIQUE', label: 'Dataset Analytique', icon: Database },
    { id: 'ANALYSE_DESCRIPTIVE', label: 'Analyse Descriptive', icon: BarChart2 },
    { id: 'ANALYSE_TEMPORELLE', label: 'Analyse Temporelle', icon: Calendar },
    { id: 'ANALYSE_SPATIALE', label: 'Analyse Spatiale', icon: MapPin },
    { id: 'ANALYSE_ASSOCIATIONS', label: 'Analyse des Associations', icon: Activity },
    { id: 'LAGS', label: 'Lags Temporels', icon: Clock },
    { id: 'COMPARAISON_ZONES', label: 'Comparaison des Zones', icon: ArrowRightLeft },
    { id: 'RAPPORTS', label: 'Rapports (17 Sections)', icon: FileText },
    { id: 'HISTORIQUE_ANALYSES', label: 'Historique des Analyses', icon: History },
    { id: 'SUITE_TESTS_V114', label: 'Tests V1.14 & Qualité', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900/60 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                MODULE V1.14
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                PASSERELLE VERS LA MODÉLISATION
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Laboratoire d Analyse Scientifique & Dataset Analytique
            </h1>
            <p className="text-slate-300 text-xs max-w-3xl leading-relaxed">
              Sélection de variables One Health, création de vues contrôlées sans altération du RAW/CLEANED, exploration statistique descriptive, associations climatiques, lags biologiques et validation de faisabilité.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              + Nouvelle Analyse
            </button>
          </div>
        </div>

        {/* Current Active Analysis Selector Strip */}
        {activeAnalysis && !isCreatingNew && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Analyse active :</span>
              <strong className="text-indigo-300 font-bold">{activeAnalysis.name}</strong>
              <span className="text-slate-400 font-mono text-[11px]">({activeAnalysis.code})</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-[11px]">
              <span>Période : <strong>{activeAnalysis.timeRange.startYear}–{activeAnalysis.timeRange.endYear}</strong></span>
              <span>Zones : <strong>{activeAnalysis.geographicScope.selectedZoneNames.join(', ')}</strong></span>
              <span>Statut : <strong className="text-emerald-400">{activeAnalysis.status}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {isCreatingNew ? (
        <NewAnalysisWizard
          onAnalysisCreated={handleAnalysisCreated}
          onCancel={() => setIsCreatingNew(false)}
        />
      ) : (
        <div className="space-y-6">
          {/* Sub-menu navigation bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const isSelected = currentSubMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSubMenu(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Sub-menu view dispatch */}
          {currentSubMenu === 'DATASET_ANALYTIQUE' && (
            <DatasetAnalytiqueTab activeAnalysis={activeAnalysis} />
          )}

          {currentSubMenu === 'ANALYSE_DESCRIPTIVE' && (
            <DescriptiveAnalysisTab activeAnalysis={activeAnalysis} />
          )}

          {currentSubMenu === 'ANALYSE_TEMPORELLE' && (
            <SpatialTemporalAnalysisTab activeAnalysis={activeAnalysis} defaultSubTab="TEMPORELLE" />
          )}

          {currentSubMenu === 'ANALYSE_SPATIALE' && (
            <SpatialTemporalAnalysisTab activeAnalysis={activeAnalysis} defaultSubTab="SPATIALE" />
          )}

          {currentSubMenu === 'ANALYSE_ASSOCIATIONS' && (
            <AssociationsAnalysisTab activeAnalysis={activeAnalysis} />
          )}

          {currentSubMenu === 'LAGS' && (
            <LagsAnalysisTab activeAnalysis={activeAnalysis} />
          )}

          {currentSubMenu === 'COMPARAISON_ZONES' && (
            <SpatialTemporalAnalysisTab activeAnalysis={activeAnalysis} defaultSubTab="COMPARAISON_ZONES" />
          )}

          {currentSubMenu === 'RAPPORTS' && (
            <AutomatedReportTab activeAnalysis={activeAnalysis} />
          )}

          {currentSubMenu === 'HISTORIQUE_ANALYSES' && (
            <AnalysisHistoryTab
              analyses={analyses}
              activeAnalysisId={activeAnalysisId}
              onSelectAnalysis={proj => {
                setActiveAnalysisId(proj.id);
                setCurrentSubMenu('DATASET_ANALYTIQUE');
              }}
              onNewAnalysisClick={() => setIsCreatingNew(true)}
            />
          )}

          {currentSubMenu === 'SUITE_TESTS_V114' && (
            <LaboratoryValidationSuiteTab />
          )}
        </div>
      )}
    </div>
  );
};
