import React, { useState } from 'react';
import {
  CloudSun,
  PlusCircle,
  FileSpreadsheet,
  Database,
  AlertTriangle,
  MapPin,
  Layers,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { ClimateDashboardTab } from './climate/ClimateDashboardTab';
import { ClimateFormTab } from './climate/ClimateFormTab';
import { ClimateImportTab } from './climate/ClimateImportTab';
import { ClimateReviewTab } from './climate/ClimateReviewTab';
import { ClimateQualityTab } from './climate/ClimateQualityTab';
import { ClimateMapTab } from './climate/ClimateMapTab';
import { ClimateSourcesTab } from './climate/ClimateSourcesTab';
import { ClimateHarmonizeTab } from './climate/ClimateHarmonizeTab';
import { ClimateRecord } from '../types';
import { useData } from '../context/DataContext';

export const ClimateDataModule: React.FC = () => {
  const { climateRecords, climateStations, climateSources } = useData();

  const [activeTab, setActiveTab] = useState<string>('DASHBOARD');
  const [editingRecord, setEditingRecord] = useState<ClimateRecord | null>(null);

  const handleOpenNew = () => {
    setEditingRecord(null);
    setActiveTab('FORM');
  };

  const handleEditRecord = (record: ClimateRecord) => {
    setEditingRecord(record);
    setActiveTab('FORM');
  };

  const handleFormSaved = () => {
    setEditingRecord(null);
    setActiveTab('REVIEW');
  };

  const handleFormCancel = () => {
    setEditingRecord(null);
    setActiveTab('REVIEW');
  };

  const tabs = [
    { id: 'DASHBOARD', label: 'Indicateurs & Climat', icon: BarChart3 },
    { id: 'FORM', label: editingRecord ? 'Modifier la Donnée' : 'Nouvelle Donnée', icon: PlusCircle },
    { id: 'IMPORT', label: 'Import Excel / CSV', icon: FileSpreadsheet },
    { id: 'REVIEW', label: 'Données Climatiques', icon: Database, badge: climateRecords.length },
    { id: 'QUALITY', label: 'Contrôle Qualité', icon: AlertTriangle },
    { id: 'MAP', label: 'Carte Climatique', icon: MapPin },
    { id: 'SOURCES', label: 'Sources & Stations', icon: Layers, badge: climateStations.length },
    { id: 'HARMONIZE', label: 'Harmonisation', icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'FORM' && !editingRecord) {
                    setEditingRecord(null);
                  }
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-2 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'DASHBOARD' && (
        <ClimateDashboardTab onNavigateToTab={(t) => setActiveTab(t)} />
      )}

      {activeTab === 'FORM' && (
        <ClimateFormTab
          initialRecord={editingRecord}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}

      {activeTab === 'IMPORT' && (
        <ClimateImportTab onImportSuccess={() => setActiveTab('REVIEW')} />
      )}

      {activeTab === 'REVIEW' && (
        <ClimateReviewTab onEditRecord={handleEditRecord} />
      )}

      {activeTab === 'QUALITY' && (
        <ClimateQualityTab onOpenEdit={handleEditRecord} />
      )}

      {activeTab === 'MAP' && (
        <ClimateMapTab />
      )}

      {activeTab === 'SOURCES' && (
        <ClimateSourcesTab />
      )}

      {activeTab === 'HARMONIZE' && (
        <ClimateHarmonizeTab />
      )}
    </div>
  );
};
