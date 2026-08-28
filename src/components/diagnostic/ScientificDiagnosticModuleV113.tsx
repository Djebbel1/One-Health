import React, { useState } from 'react';
import {
  FileSearch,
  Layers,
  Award,
  AlertTriangle,
  BarChart3,
  Calendar,
  Database,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Download,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import {
  VariableDiagnosticProfile,
  EnvironmentalHistoricityRecord,
  HistoricalProxyDeclaration,
  ScientificQuestionAnswer,
  V113ValidationTest
} from '../../types';
import { globalDiagnosticEngine } from '../../utils/scientificDiagnosticEngineV113';

// Sub-components
import { OverviewDashboardTab } from './OverviewDashboardTab';
import { AvailabilityMatricesTab } from './AvailabilityMatricesTab';
import { QualityAndSourcesTab } from './QualityAndSourcesTab';
import { GapsAndBiasesTab } from './GapsAndBiasesTab';
import { UsabilityAndModelingTab } from './UsabilityAndModelingTab';
import { EnvironmentalHistoricityTab } from './EnvironmentalHistoricityTab';
import { AdaptiveDatasetsTab } from './AdaptiveDatasetsTab';
import { HistoricalCartographyTab } from './HistoricalCartographyTab';
import { TransformationAuditTab } from './TransformationAuditTab';
import { DiagnosticValidationTab } from './DiagnosticValidationTab';
import { DiagnosticExportModal } from './DiagnosticExportModal';

export const ScientificDiagnosticModuleV113: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'OVERVIEW'
    | 'MATRICES'
    | 'QUALITY'
    | 'GAPS_BIASES'
    | 'USABILITY'
    | 'HISTORICITE'
    | 'ADAPTIVE_DS'
    | 'CARTOGRAPHY'
    | 'TRANSFORMATIONS'
    | 'VALIDATION_TESTS'
  >('OVERVIEW');

  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Engine state bindings
  const [profiles, setProfiles] = useState<VariableDiagnosticProfile[]>(globalDiagnosticEngine.getProfiles());
  const [envHistory, setEnvHistory] = useState<EnvironmentalHistoricityRecord[]>(globalDiagnosticEngine.getEnvHistory());
  const [proxies, setProxies] = useState<HistoricalProxyDeclaration[]>(globalDiagnosticEngine.getProxies());
  const [questions, setQuestions] = useState<ScientificQuestionAnswer[]>(globalDiagnosticEngine.getQuestions());
  const [tests, setTests] = useState<V113ValidationTest[]>(globalDiagnosticEngine.getTests());
  const [adaptiveDatasets] = useState(globalDiagnosticEngine.getAdaptiveDatasets());
  const [sensitivityModel] = useState(globalDiagnosticEngine.getSensitivityModel());
  const [logs] = useState(globalDiagnosticEngine.getLogs());

  const handleRefreshData = () => {
    setProfiles([...globalDiagnosticEngine.getProfiles()]);
    setEnvHistory([...globalDiagnosticEngine.getEnvHistory()]);
    setProxies([...globalDiagnosticEngine.getProxies()]);
    setQuestions([...globalDiagnosticEngine.getQuestions()]);
    setTests([...globalDiagnosticEngine.getTests()]);
  };

  const navItems = [
    { id: 'OVERVIEW', label: 'Vue d’ensemble & 10 Questions', icon: HelpCircle },
    { id: 'MATRICES', label: 'Matrices Temporelle & Géo', icon: Layers },
    { id: 'QUALITY', label: 'Qualité & Fiabilité Sources', icon: Award },
    { id: 'GAPS_BIASES', label: 'Lacunes & Biais', icon: AlertTriangle },
    { id: 'USABILITY', label: 'Utilisabilité & Modélisation', icon: BarChart3 },
    { id: 'HISTORICITE', label: 'Historicité & Proxies', icon: Calendar },
    { id: 'ADAPTIVE_DS', label: 'Datasets Adaptatifs', icon: Database },
    { id: 'CARTOGRAPHY', label: 'Cartographie Historique', icon: MapPin },
    { id: 'TRANSFORMATIONS', label: 'Audit & Traçabilité', icon: ShieldCheck },
    { id: 'VALIDATION_TESTS', label: 'Validation V1.13', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-black shadow-md">
              <FileSearch className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                  MODULE V1.13 SCIENTIFIQUE
                </span>
                <span className="text-xs text-slate-500 font-semibold">Plateforme One Health Maniema</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Diagnostic Scientifique, Disponibilité & Préparation Analytique
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo / Real toggle */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
              <span className={isDemoMode ? 'text-amber-800' : 'text-slate-500'}>Démo</span>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`w-9 h-5 rounded-full transition relative ${
                  isDemoMode ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition transform absolute top-0.5 ${
                    isDemoMode ? 'left-0.5' : 'right-0.5'
                  }`}
                ></div>
              </button>
              <span className={!isDemoMode ? 'text-emerald-800' : 'text-slate-500'}>Réel</span>
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exporter Rapport</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex overflow-x-auto gap-1.5 mt-5 pt-3 border-t border-slate-100 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'OVERVIEW' && (
        <OverviewDashboardTab
          profiles={profiles}
          questions={questions}
          onNavigateTab={(tab) => setActiveSubTab(tab as any)}
          onOpenExport={() => setIsExportModalOpen(true)}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />
      )}

      {activeSubTab === 'MATRICES' && (
        <AvailabilityMatricesTab profiles={profiles} />
      )}

      {activeSubTab === 'QUALITY' && (
        <QualityAndSourcesTab profiles={profiles} />
      )}

      {activeSubTab === 'GAPS_BIASES' && (
        <GapsAndBiasesTab />
      )}

      {activeSubTab === 'USABILITY' && (
        <UsabilityAndModelingTab profiles={profiles} />
      )}

      {activeSubTab === 'HISTORICITE' && (
        <EnvironmentalHistoricityTab
          envHistory={envHistory}
          proxies={proxies}
          onRefreshData={handleRefreshData}
        />
      )}

      {activeSubTab === 'ADAPTIVE_DS' && (
        <AdaptiveDatasetsTab
          adaptiveDatasets={adaptiveDatasets}
          sensitivityModel={sensitivityModel}
        />
      )}

      {activeSubTab === 'CARTOGRAPHY' && (
        <HistoricalCartographyTab />
      )}

      {activeSubTab === 'TRANSFORMATIONS' && (
        <TransformationAuditTab logs={logs} />
      )}

      {activeSubTab === 'VALIDATION_TESTS' && (
        <DiagnosticValidationTab
          tests={tests}
          onRefreshTests={handleRefreshData}
        />
      )}

      {/* Export Modal */}
      <DiagnosticExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        profiles={profiles}
        questions={questions}
      />
    </div>
  );
};
