import React, { useState } from 'react';
import {
  HeartPulse,
  LayoutDashboard,
  PlusCircle,
  UploadCloud,
  ShieldAlert,
  Building2,
  Map as MapIcon,
  Download,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  GitMerge
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { HealthDashboardTab } from './health/HealthDashboardTab';
import { HealthFormTab } from './health/HealthFormTab';
import { HealthImportTab } from './health/HealthImportTab';
import { HealthReviewTab } from './health/HealthReviewTab';
import { HealthFacilitiesTab } from './health/HealthFacilitiesTab';
import { HealthMapTab } from './health/HealthMapTab';
import { HealthExportTab } from './health/HealthExportTab';
import { HealthRecord } from '../types';

export type HealthTabType = 'DASHBOARD' | 'FORM' | 'IMPORT' | 'REVIEW' | 'FACILITIES' | 'MAP' | 'EXPORT';

export const HealthDataModule: React.FC = () => {
  const { healthRecords, healthFacilities } = useData();

  const [activeTab, setActiveTab] = useState<HealthTabType>('DASHBOARD');
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);

  // Indicators for tab badges
  const pendingReviewCount = healthRecords.filter(r => r.status === 'UNDER_REVIEW' || r.status === 'IMPORTED').length;
  const draftCount = healthRecords.filter(r => r.status === 'DRAFT').length;

  const handleOpenNewForm = () => {
    setEditingRecord(null);
    setActiveTab('FORM');
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Header & Sub-Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Module Données Sanitaires
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                  VERSION V1.3
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Collecte sentinelle, importation Excel/CSV, contrôle qualité & surveillance épidémiologique à Kindu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-health-new-entry"
              onClick={handleOpenNewForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nouvelle Donnée</span>
            </button>
          </div>
        </div>

        {/* 7 Sub-tabs bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          <button
            id="tab-health-dashboard"
            onClick={() => setActiveTab('DASHBOARD')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'DASHBOARD'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Tableau de bord sanitaire</span>
          </button>

          <button
            id="tab-health-form"
            onClick={() => {
              setEditingRecord(null);
              setActiveTab('FORM');
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'FORM'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouvelle donnée</span>
          </button>

          <button
            id="tab-health-import"
            onClick={() => setActiveTab('IMPORT')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'IMPORT'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Excel / CSV</span>
          </button>

          <button
            id="tab-health-review"
            onClick={() => setActiveTab('REVIEW')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'REVIEW'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Données à contrôler</span>
            {pendingReviewCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeTab === 'REVIEW' ? 'bg-rose-900 text-rose-100' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingReviewCount}
              </span>
            )}
          </button>

          <button
            id="tab-health-facilities"
            onClick={() => setActiveTab('FACILITIES')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'FACILITIES'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Structures de santé ({healthFacilities.length})</span>
          </button>

          <button
            id="tab-health-map"
            onClick={() => setActiveTab('MAP')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'MAP'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Cartographie sanitaire</span>
          </button>

          <button
            id="tab-health-export"
            onClick={() => setActiveTab('EXPORT')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'EXPORT'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export des données</span>
          </button>
        </div>
      </div>

      {/* 2. Active Tab Content Rendering */}
      {activeTab === 'DASHBOARD' && <HealthDashboardTab />}

      {activeTab === 'FORM' && (
        <HealthFormTab
          initialRecord={editingRecord}
          onSuccess={() => setActiveTab('DASHBOARD')}
          onCancel={() => setActiveTab('DASHBOARD')}
        />
      )}

      {activeTab === 'IMPORT' && (
        <HealthImportTab
          onImportSuccess={() => setActiveTab('REVIEW')}
        />
      )}

      {activeTab === 'REVIEW' && <HealthReviewTab />}

      {activeTab === 'FACILITIES' && <HealthFacilitiesTab />}

      {activeTab === 'MAP' && <HealthMapTab />}

      {activeTab === 'EXPORT' && <HealthExportTab />}
    </div>
  );
};
