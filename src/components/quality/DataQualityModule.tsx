import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  HelpCircle,
  Copy,
  AlertTriangle,
  MapPin,
  Clock,
  Layers,
  History,
  FileCheck,
  Database,
  Sparkles
} from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { MissingDataTab } from './MissingDataTab';
import { DuplicatesTab } from './DuplicatesTab';
import { InconsistenciesTab } from './InconsistenciesTab';
import { GeoQualityTab } from './GeoQualityTab';
import { TemporalQualityTab } from './TemporalQualityTab';
import { SourcesTab } from './SourcesTab';
import { TransformationLogTab } from './TransformationLogTab';
import { QualityReportTab } from './QualityReportTab';

export type QualitySubTab =
  | 'VUE_GENERALE'
  | 'DONNEES_MANQUANTES'
  | 'DOUBLONS'
  | 'VALEURS_ABERRANTES'
  | 'CONTROLES_GEOGRAPHIQUES'
  | 'CONTROLES_TEMPORELS'
  | 'SOURCES_REPRESENTATIVITE'
  | 'JOURNAL_CORRECTIONS'
  | 'RAPPORT_QUALITE';

export const DataQualityModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QualitySubTab>('VUE_GENERALE');

  const tabs = [
    { id: 'VUE_GENERALE', label: '1. Vue Générale', icon: LayoutDashboard },
    { id: 'DONNEES_MANQUANTES', label: '2. Données Manquantes', icon: HelpCircle },
    { id: 'DOUBLONS', label: '3. Doublons', icon: Copy },
    { id: 'VALEURS_ABERRANTES', label: '4. Incohérences & Taux', icon: AlertTriangle },
    { id: 'CONTROLES_GEOGRAPHIQUES', label: '5. Contrôles GPS & Géo', icon: MapPin },
    { id: 'CONTROLES_TEMPORELS', label: '6. Dates & Lags', icon: Clock },
    { id: 'SOURCES_REPRESENTATIVITE', label: '7. Sources & Échelles', icon: Layers },
    { id: 'JOURNAL_CORRECTIONS', label: '8. Journal (Log)', icon: History },
    { id: 'RAPPORT_QUALITE', label: '9. Rapport & Tests V1.8', icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER DU MODULE QUALITÉ DES DONNÉES */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-teal-100 text-teal-900 font-black text-[11px] rounded-full uppercase tracking-wider">
              MODULE V1.8
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Contrôle Qualité, Normalisation &amp; Préparation du Dataset
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Transformation rigoureuse de <code>RAW_DATA</code> vers <code>CLEAN_DATA</code> puis <code>ANALYSIS_DATASET</code>. Conservation absolue des données sources, distinction stricte Zéro vs NULL et validation des 12 tests obligatoires.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg border border-emerald-300 flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>V1.8 — VALIDÉE</span>
          </span>
        </div>
      </div>

      {/* BARRE D'ONGLETS NAVIGATION (Section 48 - Les 9 écrans demandés) */}
      <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as QualitySubTab)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENU DE L'ONGLET ACTIF */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'VUE_GENERALE' && <OverviewTab />}
        {activeTab === 'DONNEES_MANQUANTES' && <MissingDataTab />}
        {activeTab === 'DOUBLONS' && <DuplicatesTab />}
        {activeTab === 'VALEURS_ABERRANTES' && <InconsistenciesTab />}
        {activeTab === 'CONTROLES_GEOGRAPHIQUES' && <GeoQualityTab />}
        {activeTab === 'CONTROLES_TEMPORELS' && <TemporalQualityTab />}
        {activeTab === 'SOURCES_REPRESENTATIVITE' && <SourcesTab />}
        {activeTab === 'JOURNAL_CORRECTIONS' && <TransformationLogTab />}
        {activeTab === 'RAPPORT_QUALITE' && <QualityReportTab />}
      </div>
    </div>
  );
};
