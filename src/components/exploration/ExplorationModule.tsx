import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
  Thermometer,
  Clock,
  Layers,
  GitCompare,
  ShieldCheck,
  FileText,
  Download,
  AlertTriangle,
  Database,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ExplorationFiltersBar } from './ExplorationFiltersBar';
import { OverviewTab } from './OverviewTab';
import { TemporalTab } from './TemporalTab';
import { SpatialTab } from './SpatialTab';
import { SeasonalTab } from './SeasonalTab';
import { ClimateDiseaseTab } from './ClimateDiseaseTab';
import { LagsTab } from './LagsTab';
import { ClustersTab } from './ClustersTab';
import { ComparisonTab } from './ComparisonTab';
import { QualityCoverageTab } from './QualityCoverageTab';
import { ReportTab } from './ReportTab';

export type ExplorationSubTab =
  | 'OVERVIEW'
  | 'TEMPORAL'
  | 'SPATIAL'
  | 'SEASONAL'
  | 'CLIMATE_DISEASE'
  | 'LAGS'
  | 'CLUSTERS'
  | 'COMPARISON'
  | 'QUALITY_COVERAGE'
  | 'REPORT';

export const ExplorationModule: React.FC = () => {
  const { selectedDatasetVersion, analysisDataset } = useData();
  const [activeTab, setActiveTab] = useState<ExplorationSubTab>('OVERVIEW');

  const subTabs = [
    { id: 'OVERVIEW', label: 'Vue générale', icon: Activity },
    { id: 'TEMPORAL', label: 'Analyse temporelle', icon: TrendingUp },
    { id: 'SPATIAL', label: 'Analyse spatiale', icon: MapPin },
    { id: 'SEASONAL', label: 'Analyse saisonnière', icon: Calendar },
    { id: 'CLIMATE_DISEASE', label: 'Climat-maladie', icon: Thermometer },
    { id: 'LAGS', label: 'Décalages temporels', icon: Clock },
    { id: 'CLUSTERS', label: 'Clusters', icon: Layers },
    { id: 'COMPARISON', label: 'Comparaison Palu / Typhoïde', icon: GitCompare },
    { id: 'QUALITY_COVERAGE', label: 'Qualité & couverture', icon: ShieldCheck },
    { id: 'REPORT', label: 'Rapport analytique', icon: FileText },
  ];

  return (
    <div className="space-y-6" id="module-exploration-spatiotemporelle">
      {/* Header Principal du Module V1.9 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                Module V1.9 Validé
              </span>
              <span className="text-xs font-mono text-slate-400">
                One Health Maniema • Province du Maniema, RDC
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>🔬 ANALYSE EXPLORATOIRE SPATIO-TEMPORELLE</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Exploration rigoureuse des dynamiques spatio-temporelles du paludisme et de la fièvre typhoïde à Kindu (2023-2025). Caractérisation des tendances chronologiques, des patrons saisonniers, des associations climatiques décalées et des concentrations spatiales locales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-mono">Dataset source actif</span>
              <span className="text-xs font-bold text-emerald-400 font-mono bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 block">
                {selectedDatasetVersion} ({analysisDataset.length} lignes)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de Filtres Spatio-Temporels Globale */}
      <ExplorationFiltersBar />

      {/* Barre d'Onglets des 10 Sous-Menus */}
      <div className="border-b border-slate-800 pb-1 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExplorationSubTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu Actif du Sous-Menu */}
      <div>
        {activeTab === 'OVERVIEW' && <OverviewTab />}
        {activeTab === 'TEMPORAL' && <TemporalTab />}
        {activeTab === 'SPATIAL' && <SpatialTab />}
        {activeTab === 'SEASONAL' && <SeasonalTab />}
        {activeTab === 'CLIMATE_DISEASE' && <ClimateDiseaseTab />}
        {activeTab === 'LAGS' && <LagsTab />}
        {activeTab === 'CLUSTERS' && <ClustersTab />}
        {activeTab === 'COMPARISON' && <ComparisonTab />}
        {activeTab === 'QUALITY_COVERAGE' && <QualityCoverageTab />}
        {activeTab === 'REPORT' && <ReportTab />}
      </div>
    </div>
  );
};
