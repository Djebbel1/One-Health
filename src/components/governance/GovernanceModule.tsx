import React, { useState } from 'react';
import {
  FolderKanban,
  BookOpen,
  FileCode,
  Layers,
  Globe,
  FileBadge,
  ShieldCheck,
  Users,
  Cpu,
  GitCompare,
  FileText,
  Award,
  Sparkles,
  ChevronDown,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  MOCK_STUDY_PROJECTS_V119,
  MOCK_STUDY_PROTOCOLS_V119,
  MOCK_DATA_DICTIONARY_V119,
  MOCK_FORM_VERSIONS_V119,
  MOCK_GOVERNANCE_DATASETS_V119,
  MOCK_DATA_LINEAGE_NODES_V119,
  MOCK_DATA_LINEAGE_EDGES_V119,
  MOCK_EXTERNAL_SOURCES_V119,
  MOCK_FILE_IMPORT_AUDITS_V119,
  MOCK_CASE_DEFINITIONS_V119,
  MOCK_RECORD_VALIDATIONS_V119,
  MOCK_USER_PERMISSIONS_V119,
  MOCK_REPRODUCIBLE_MODELS_V119,
  MOCK_VERSION_DIFFS_V119,
  MOCK_GOVERNANCE_ALERTS_V119,
  MOCK_AUDIT_LOGS_V119,
  calculateQualityScoreV119
} from '../../data/mockGovernanceDataV119';

import {
  StudyProject,
  StudyProtocol,
  DataDictionaryVariable,
  ProjectFormVersion,
  GovernanceDataset,
  DatasetSnapshot,
  FileImportAudit,
  RecordValidationWorkflow,
  RecordLifecycleStatus,
  RecordCorrectionEntry,
  UserProjectPermission,
  ReproducibleModel,
  AuditLogEntry,
  AuditActionType
} from '../../types';

// Tab sub-components
import { GovernanceDashboardTab } from './GovernanceDashboardTab';
import { ProjectsAndProtocolsTab } from './ProjectsAndProtocolsTab';
import { DataDictionaryTab } from './DataDictionaryTab';
import { FormsVersioningTab } from './FormsVersioningTab';
import { DatasetsAndLineageTab } from './DatasetsAndLineageTab';
import { ExternalSourcesTab } from './ExternalSourcesTab';
import { ScientificMetadataTab } from './ScientificMetadataTab';
import { MultiLevelValidationTab } from './MultiLevelValidationTab';
import { ProjectPermissionsTab } from './ProjectPermissionsTab';
import { ReproducibleModelsTab } from './ReproducibleModelsTab';
import { VersionDiffViewerTab } from './VersionDiffViewerTab';
import { CentralAuditTab } from './CentralAuditTab';
import { GovernanceTestSuiteV119Tab } from './GovernanceTestSuiteV119Tab';

export type GovernanceTabKey =
  | 'DASHBOARD'
  | 'PROJETS_PROTOCOLES'
  | 'DICTIONNAIRE'
  | 'FORMULAIRES_VERSIONS'
  | 'DATASETS_LINEAGE'
  | 'SOURCES_EXTERNES'
  | 'METADONNEES_SCIENTIFIQUES'
  | 'VALIDATION_MULTINIVEAUX'
  | 'PERMISSIONS_PROJET'
  | 'MODELES_REPRODUCTIBLES'
  | 'DIFF_VIEWER'
  | 'JOURNAL_AUDIT'
  | 'TESTS_CONFORMITE';

export const GovernanceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GovernanceTabKey>('DASHBOARD');

  // Core Governance Reactive States
  const [projects, setProjects] = useState<StudyProject[]>(MOCK_STUDY_PROJECTS_V119);
  const [selectedProject, setSelectedProject] = useState<StudyProject>(MOCK_STUDY_PROJECTS_V119[0]);
  const [protocols, setProtocols] = useState<StudyProtocol[]>(MOCK_STUDY_PROTOCOLS_V119);
  const [variables, setVariables] = useState<DataDictionaryVariable[]>(MOCK_DATA_DICTIONARY_V119);
  const [forms, setForms] = useState<ProjectFormVersion[]>(MOCK_FORM_VERSIONS_V119);
  const [datasets, setDatasets] = useState<GovernanceDataset[]>(MOCK_GOVERNANCE_DATASETS_V119);
  const [fileImports, setFileImports] = useState<FileImportAudit[]>(MOCK_FILE_IMPORT_AUDITS_V119);
  const [records, setRecords] = useState<RecordValidationWorkflow[]>(MOCK_RECORD_VALIDATIONS_V119);
  const [userPermissions, setUserPermissions] = useState<UserProjectPermission[]>(MOCK_USER_PERMISSIONS_V119);
  const [models, setModels] = useState<ReproducibleModel[]>(MOCK_REPRODUCIBLE_MODELS_V119);
  const [alerts, setAlerts] = useState(MOCK_GOVERNANCE_ALERTS_V119);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS_V119);

  // Dynamic Quality Score Calculation
  const qualityScore = calculateQualityScoreV119(datasets, variables, protocols, models);

  // Audit Logger Helper
  const handleAddAuditLog = (actionType: AuditActionType, description: string, details?: any) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: 'USR-MUKENDI-01',
      userName: 'Dr. Jean-Pierre Mukendi',
      userRole: 'ADMINISTRATEUR',
      actionType,
      entityType: 'PROJET',
      entityId: selectedProject.id,
      projectId: selectedProject.id,
      description,
      details,
      isImmutable: true,
      isDemoData: true
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Updaters
  const handleUpdateProject = (updated: StudyProject) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    if (selectedProject.id === updated.id) setSelectedProject(updated);
  };

  const handleUpdateProtocol = (updated: StudyProtocol) => {
    setProtocols(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleAddVariable = (newVar: DataDictionaryVariable) => {
    setVariables(prev => [newVar, ...prev]);
  };

  const handleUpdateVariable = (updated: DataDictionaryVariable) => {
    setVariables(prev => prev.map(v => (v.variableId === updated.variableId ? updated : v)));
  };

  const handleUpdateForm = (updated: ProjectFormVersion) => {
    setForms(prev => prev.map(f => (f.formId === updated.formId ? updated : f)));
  };

  const handleAddSnapshot = (datasetId: string, snapshot: DatasetSnapshot) => {
    setDatasets(prev =>
      prev.map(d => (d.id === datasetId ? { ...d, snapshots: [snapshot, ...d.snapshots] } : d))
    );
  };

  const handleAddFileImport = (audit: FileImportAudit) => {
    setFileImports(prev => [audit, ...prev]);
  };

  const handleUpdateRecordStatus = (
    recordId: string,
    status: RecordLifecycleStatus,
    level?: number,
    reason?: string
  ) => {
    setRecords(prev =>
      prev.map(r => {
        if (r.recordId !== recordId) return r;
        const updatedLevels = r.levels.map(l =>
          level && l.level === level
            ? {
                ...l,
                validated: true,
                validatedBy: 'Dr. Jean-Pierre Mukendi',
                validatedAt: new Date().toISOString().slice(0, 10),
                notes: reason || 'Validation conforme aux règles de protocole.'
              }
            : l
        );
        return {
          ...r,
          status,
          currentValidationLevel: level || r.currentValidationLevel,
          levels: updatedLevels
        };
      })
    );
  };

  const handleAddCorrection = (recordId: string, correction: RecordCorrectionEntry) => {
    setRecords(prev =>
      prev.map(r =>
        r.recordId === recordId
          ? {
              ...r,
              status: 'CORRIGEE',
              correctionHistory: [correction, ...r.correctionHistory]
            }
          : r
      )
    );
  };

  const handleToggleLogicalDelete = (recordId: string, reason: string) => {
    setRecords(prev =>
      prev.map(r =>
        r.recordId === recordId
          ? {
              ...r,
              isLogicallyDeleted: !r.isLogicallyDeleted,
              deletionReason: !r.isLogicallyDeleted ? reason : undefined
            }
          : r
      )
    );
  };

  const handleUpdatePermission = (
    userId: string,
    projectId: string,
    permKey: keyof UserProjectPermission,
    val: boolean
  ) => {
    setUserPermissions(prev =>
      prev.map(p =>
        p.userId === userId && p.projectId === projectId
          ? { ...p, [permKey]: val }
          : p
      )
    );
  };

  const handleUpdateModelStatus = (modelId: string, status: ReproducibleModel['governanceStatus']) => {
    setModels(prev => prev.map(m => (m.modelId === modelId ? { ...m, governanceStatus: status } : m)));
    handleAddAuditLog('STATUT_MODELE_MODIFIE', `Changement de statut du modèle ${modelId} vers ${status}`);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
    handleAddAuditLog('ALERTE_GOUVERNANCE_RESOLUE', `Alerte de gouvernance ${alertId} marquée comme résolue`);
  };

  // Nav Items Configuration
  const NAV_TABS = [
    { key: 'DASHBOARD' as const, label: 'Tableau de Bord', icon: Award, badge: `${qualityScore.totalScore}%` },
    { key: 'PROJETS_PROTOCOLES' as const, label: 'Projets & Protocoles', icon: FolderKanban, badge: `${projects.length}` },
    { key: 'DICTIONNAIRE' as const, label: 'Dictionnaire & Proxies', icon: BookOpen, badge: `${variables.length}` },
    { key: 'FORMULAIRES_VERSIONS' as const, label: 'Formulaires & Migrations', icon: FileCode },
    { key: 'DATASETS_LINEAGE' as const, label: 'Datasets & Lineage', icon: Layers },
    { key: 'SOURCES_EXTERNES' as const, label: 'Sources & Doublons', icon: Globe },
    { key: 'METADONNEES_SCIENTIFIQUES' as const, label: 'Définitions de Cas', icon: FileBadge },
    { key: 'VALIDATION_MULTINIVEAUX' as const, label: 'Validation 4-Niveaux', icon: ShieldCheck, badge: `${records.filter(r => r.currentStatus === 'RAW' || r.currentStatus === 'EN_CONTROLE').length}` },
    { key: 'PERMISSIONS_PROJET' as const, label: 'Permissions & RBAC', icon: Users },
    { key: 'MODELES_REPRODUCTIBLES' as const, label: 'Modèles & Reproductibilité', icon: Cpu },
    { key: 'DIFF_VIEWER' as const, label: 'Comparateur Diff', icon: GitCompare },
    { key: 'JOURNAL_AUDIT' as const, label: 'Journal d Audit', icon: FileText, badge: `${auditLogs.length}` },
    { key: 'TESTS_CONFORMITE' as const, label: 'Banc de Tests (10)', icon: Sparkles, badge: '10/10' }
  ];

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Multi-Project Global Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-teal-800 text-white font-bold text-xs tracking-wide">
              V1.19
            </span>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Projet d'Étude Actif :
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedProject.id}
                  onChange={(e) => {
                    const found = projects.find(p => p.id === e.target.value);
                    if (found) {
                      setSelectedProject(found);
                      handleAddAuditLog('SELECTION_PROJET', `Basculement vers le projet d'étude ${found.code} (${found.name})`);
                    }
                  }}
                  className="font-bold text-sm sm:text-base text-slate-900 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer pr-6 font-mono"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Global Context Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 font-medium border border-teal-200/60">
            Protocole : <strong>{protocols.find(p => p.projectId === selectedProject.id)?.currentVersion || 'V1.0'}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
            Qualité Globale : {qualityScore.totalScore}%
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
            {selectedProject.geographicalScope?.territories?.join(', ') || 'Maniema, RDC'}
          </span>
        </div>
      </div>

      {/* Horizontal Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${
                      isActive ? 'bg-teal-800/80 text-teal-100' : 'bg-slate-100 text-slate-600'
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

      {/* TAB CONTENTS RENDERING */}
      {activeTab === 'DASHBOARD' && (
        <GovernanceDashboardTab
          score={qualityScore}
          projects={projects}
          protocols={protocols}
          datasets={datasets}
          models={models}
          alerts={alerts}
          onResolveAlert={handleResolveAlert}
          onNavigateTab={(tabKey) => setActiveTab(tabKey)}
        />
      )}

      {activeTab === 'PROJETS_PROTOCOLES' && (
        <ProjectsAndProtocolsTab
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={(p) => setSelectedProject(p)}
          protocols={protocols}
          onUpdateProject={handleUpdateProject}
          onUpdateProtocol={handleUpdateProtocol}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'DICTIONNAIRE' && (
        <DataDictionaryTab
          variables={variables}
          onAddVariable={handleAddVariable}
          onUpdateVariable={handleUpdateVariable}
          onAddAuditLog={handleAddAuditLog}
          activeProjectId={selectedProject.id}
        />
      )}

      {activeTab === 'FORMULAIRES_VERSIONS' && (
        <FormsVersioningTab
          forms={forms}
          onUpdateForm={handleUpdateForm}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'DATASETS_LINEAGE' && (
        <DatasetsAndLineageTab
          datasets={datasets}
          lineageNodes={MOCK_DATA_LINEAGE_NODES_V119}
          lineageEdges={MOCK_DATA_LINEAGE_EDGES_V119}
          onAddSnapshot={handleAddSnapshot}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'SOURCES_EXTERNES' && (
        <ExternalSourcesTab
          sources={MOCK_EXTERNAL_SOURCES_V119}
          fileImports={fileImports}
          onAddFileImport={handleAddFileImport}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'METADONNEES_SCIENTIFIQUES' && (
        <ScientificMetadataTab
          caseDefinitions={MOCK_CASE_DEFINITIONS_V119}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'VALIDATION_MULTINIVEAUX' && (
        <MultiLevelValidationTab
          records={records}
          onUpdateRecordStatus={handleUpdateRecordStatus}
          onAddCorrection={handleAddCorrection}
          onToggleLogicalDelete={handleToggleLogicalDelete}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'PERMISSIONS_PROJET' && (
        <ProjectPermissionsTab
          permissions={userPermissions}
          projects={projects}
          onUpdatePermission={handleUpdatePermission}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'MODELES_REPRODUCTIBLES' && (
        <ReproducibleModelsTab
          models={models}
          onUpdateModelStatus={handleUpdateModelStatus}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

      {activeTab === 'DIFF_VIEWER' && (
        <VersionDiffViewerTab diffs={MOCK_VERSION_DIFFS_V119} />
      )}

      {activeTab === 'JOURNAL_AUDIT' && (
        <CentralAuditTab logs={auditLogs} activeProjectId={selectedProject.id} />
      )}

      {activeTab === 'TESTS_CONFORMITE' && (
        <GovernanceTestSuiteV119Tab onAddAuditLog={handleAddAuditLog} />
      )}
    </div>
  );
};
