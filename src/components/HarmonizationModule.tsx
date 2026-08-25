import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { HarmonizationDashboard } from './harmonization/HarmonizationDashboard';
import { DataQualitySection } from './harmonization/DataQualitySection';
import { DuplicateManagementSection } from './harmonization/DuplicateManagementSection';
import { MissingDataSection } from './harmonization/MissingDataSection';
import { GeographicHarmonizationSection } from './harmonization/GeographicHarmonizationSection';
import { TemporalHarmonizationSection } from './harmonization/TemporalHarmonizationSection';
import { CrossDomainRelationsSection } from './harmonization/CrossDomainRelationsSection';
import { AuditAndCorrectionsSection } from './harmonization/AuditAndCorrectionsSection';
import { IntegratedDatasetSection } from './harmonization/IntegratedDatasetSection';
import { DataDictionarySection } from './harmonization/DataDictionarySection';
import {
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  Copy,
  HelpCircle,
  MapPin,
  Calendar,
  Link2,
  History,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';

export const HarmonizationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');

  const tabs = [
    { id: 'DASHBOARD', label: 'Tableau de Contrôle', icon: LayoutDashboard },
    { id: 'QUALITY', label: 'Score de Qualité (0-100)', icon: CheckCircle2 },
    { id: 'DUPLICATES', label: 'Doublons & Collisions', icon: Copy },
    { id: 'MISSING_DATA', label: 'Données Manquantes', icon: HelpCircle },
    { id: 'GEO_HARMONIZATION', label: 'Harmonisation Spatiale', icon: MapPin },
    { id: 'TEMPORAL_HARMONIZATION', label: 'Harmonisation Temporelle', icon: Calendar },
    { id: 'DATA_RELATIONS', label: 'Relations & Lags', icon: Link2 },
    { id: 'AUDIT_CORRECTIONS', label: 'Corrections & Audit', icon: History },
    { id: 'INTEGRATED_DATASET', label: 'Base Intégrée V1.5', icon: FileSpreadsheet },
    { id: 'DICTIONARY', label: 'Dictionnaire des Variables', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'DASHBOARD' && (
        <HarmonizationDashboard onSelectTab={setActiveTab} />
      )}
      {activeTab === 'QUALITY' && <DataQualitySection />}
      {activeTab === 'DUPLICATES' && <DuplicateManagementSection />}
      {activeTab === 'MISSING_DATA' && <MissingDataSection />}
      {activeTab === 'GEO_HARMONIZATION' && <GeographicHarmonizationSection />}
      {activeTab === 'TEMPORAL_HARMONIZATION' && <TemporalHarmonizationSection />}
      {activeTab === 'DATA_RELATIONS' && <CrossDomainRelationsSection />}
      {activeTab === 'AUDIT_CORRECTIONS' && <AuditAndCorrectionsSection />}
      {activeTab === 'INTEGRATED_DATASET' && <IntegratedDatasetSection />}
      {activeTab === 'DICTIONARY' && <DataDictionarySection />}
    </div>
  );
};
