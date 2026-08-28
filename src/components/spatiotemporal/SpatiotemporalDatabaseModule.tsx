import React, { useState } from 'react';
import {
  Database,
  Calendar,
  Layers,
  Activity,
  CloudRain,
  ShieldAlert,
  Sparkles,
  Download,
  ShieldCheck,
  FileCheck,
  Table as TableIcon,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { SpatiotemporalMatrixView } from './SpatiotemporalMatrixView';
import { ClimateHealthAssociationView } from './ClimateHealthAssociationView';
import { TableExplorerView } from './TableExplorerView';
import { ModelReadyDataView } from './ModelReadyDataView';
import { QualityAuditView } from './QualityAuditView';
import { ExportHubV17 } from './ExportHubV17';
import { ScientificValidationSuiteView } from './ScientificValidationSuiteView';
import { V17ReportSummaryView } from './V17ReportSummaryView';
import { useData } from '../../context/DataContext';
import { exportSpatiotemporalV17Excel } from '../../utils/exportUtils';

export type V17ModuleTab =
  | 'MATRICE_10X12'
  | 'ASSOCIATION_CLIMAT'
  | 'EXPLORATEUR_TABLES'
  | 'MODEL_READY'
  | 'CONTROLE_QUALITE'
  | 'HUB_EXPORT'
  | 'VALIDATION_SCIENTIFIQUE'
  | 'RAPPORT_SYNTHESE';

export const SpatiotemporalDatabaseModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<V17ModuleTab>('MATRICE_10X12');

  const {
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
    householdAggregates,
    integratedSpatiotemporalData,
    modelReadyData,
    dataQualityChecks,
    dataSources,
  } = useData();

  const handleQuickExportExcel = () => {
    exportSpatiotemporalV17Excel(
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      washSpatiotemporal,
      householdAggregates,
      integratedSpatiotemporalData,
      modelReadyData,
      dataQualityChecks,
      dataSources
    );
  };

  const navTabs = [
    { id: 'MATRICE_10X12' as V17ModuleTab, label: 'Matrice 10×12', icon: TableIcon, badge: 'Heatmap' },
    { id: 'ASSOCIATION_CLIMAT' as V17ModuleTab, label: 'Climat & Santé', icon: CloudRain, badge: 'Lags M-1, M-2' },
    { id: 'EXPLORATEUR_TABLES' as V17ModuleTab, label: 'Explorateur Tables', icon: Database, badge: '7 Tables' },
    { id: 'MODEL_READY' as V17ModuleTab, label: 'Base Modèle Y(s,t)', icon: Sparkles, badge: `${modelReadyData.length} Lignes` },
    { id: 'CONTROLE_QUALITE' as V17ModuleTab, label: 'Audit Qualité & Doublons', icon: ShieldAlert, badge: `${dataQualityChecks.length}` },
    { id: 'HUB_EXPORT' as V17ModuleTab, label: 'Centre d\'Exportation', icon: Download, badge: '.xlsx / CSV / JSON' },
    { id: 'VALIDATION_SCIENTIFIQUE' as V17ModuleTab, label: 'Tests Scientifiques', icon: ShieldCheck, badge: '10/10 OK' },
    { id: 'RAPPORT_SYNTHESE' as V17ModuleTab, label: 'Rapport Synthèse V1.7', icon: FileCheck, badge: 'Validée' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>MODULE V1.7 — BASE DE DONNÉES SPATIO-TEMPORELLE INTÉGRÉE</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Structure Multidimensionnelle Spatio-Temporelle One Health Kindu
            </h2>
            <p className="text-xs text-slate-500 max-w-4xl leading-relaxed">
              Agrégation harmonisée et normalisée : <strong>Espace (10 Aires de Santé) + Temps (Mois/Année) + Santé (Paludisme & Typhoïde) + Environnement (Gîtes, Déchets) + Climat (Pluie, Température, Humidité) + WASH & Ménages</strong>. Prêt pour la future modélisation spatio-temporelle sous R / INLA / GLMM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-quick-export-v17-excel"
              onClick={handleQuickExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter Classeur Complet V1.7 (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`nav-v17-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-800 text-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-150">
        {activeTab === 'MATRICE_10X12' && <SpatiotemporalMatrixView />}
        {activeTab === 'ASSOCIATION_CLIMAT' && <ClimateHealthAssociationView />}
        {activeTab === 'EXPLORATEUR_TABLES' && <TableExplorerView />}
        {activeTab === 'MODEL_READY' && <ModelReadyDataView />}
        {activeTab === 'CONTROLE_QUALITE' && <QualityAuditView />}
        {activeTab === 'HUB_EXPORT' && <ExportHubV17 />}
        {activeTab === 'VALIDATION_SCIENTIFIQUE' && <ScientificValidationSuiteView />}
        {activeTab === 'RAPPORT_SYNTHESE' && <V17ReportSummaryView />}
      </div>
    </div>
  );
};
