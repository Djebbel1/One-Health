import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { HomeModule } from './components/HomeModule';
import { DashboardModule } from './components/DashboardModule';
import { MapModule } from './components/MapModule';
import { HealthDataModule } from './components/HealthDataModule';
import { ClimateDataModule } from './components/ClimateDataModule';
import { EnvironmentalModule } from './components/EnvironmentalModule';
import { HouseholdSurveyModule } from './components/HouseholdSurveyModule';
import { QualityControlModule } from './components/QualityControlModule';
import { ModelBaseModule } from './components/ModelBaseModule';
import { HarmonizationModule } from './components/HarmonizationModule';
import { SpatiotemporalDatabaseModule } from './components/spatiotemporal/SpatiotemporalDatabaseModule';
import { DataQualityModule } from './components/quality/DataQualityModule';
import { ExplorationModule } from './components/exploration/ExplorationModule';
import { ManiemaPlatformDashboard } from './components/maniema/ManiemaPlatformDashboard';
import { SurveyOperationsModuleV111 } from './components/SurveyOperationsModuleV111';
import { MultiSourceHubModule } from './components/multisource/MultiSourceHubModule';
import { ScientificDiagnosticModuleV113 } from './components/diagnostic/ScientificDiagnosticModuleV113';
import { ScientificLaboratoryModuleV114 } from './components/laboratory/ScientificLaboratoryModuleV114';
import { StatisticalModelingModuleV115 } from './components/modeling/StatisticalModelingModuleV115';
import { ScientificValidationModuleV116 } from './components/validation/ScientificValidationModuleV116';
import { OneHealthSurveillanceModuleV117 } from './components/surveillance/OneHealthSurveillanceModuleV117';
import { TerrainModule } from './components/terrain/TerrainModule';
import { GovernanceModule } from './components/governance/GovernanceModule';
import { SecurityAndProductionModule } from './components/security/SecurityAndProductionModule';
import { DataExportModal } from './components/DataExportModal';
import { AuthModal } from './components/AuthModal';
import { AboutOneHealthManiemaModal } from './components/AboutOneHealthManiemaModal';
import { APP_CONFIG } from './config/appConfig';
import { AppModule, BackupRecord, FeatureFlag, MaintenanceConfig, MFAConfiguration, SecurityAuditLogEntry, SecurityEnvironmentConfig, CentralSystemError } from './types';
import {
  DEFAULT_SECURITY_ENV_CONFIG,
  INITIAL_CONNECTED_DEVICES,
  DEFAULT_MFA_CONFIG,
  DEFAULT_ROLE_PERMISSION_MATRIX,
  DEFAULT_DATA_PRIVACY_RULES,
  INITIAL_RECYCLE_BIN_ITEMS,
  DEFAULT_RETENTION_POLICIES,
  INITIAL_BACKUP_RECORDS,
  DEFAULT_DISASTER_RECOVERY_PLAN,
  INITIAL_SECURITY_LOGS,
  INITIAL_CENTRAL_ERRORS,
  DEFAULT_FEATURE_FLAGS,
  DEFAULT_MAINTENANCE_CONFIG,
  SYSTEM_HEALTH_METRICS_MOCK,
  MOCK_SECURITY_USER_SESSION
} from './data/mockSecurityDataV120';
import {
  LayoutDashboard,
  Map as MapIcon,
  Activity,
  CloudRain,
  Bug,
  Home,
  ShieldCheck,
  Database,
  Menu,
  X,
  Building2,
  Sparkles,
  Globe,
  ClipboardList,
  UploadCloud,
  Compass,
  FolderKanban,
  Shield
} from 'lucide-react';

const NAV_ITEMS: { id: AppModule; label: string; shortLabel: string; icon: any }[] = [
  { id: 'ACCUEIL', label: 'Accueil', shortLabel: 'Accueil', icon: Building2 },
  { id: 'SECURITE_PRODUCTION', label: '🛡️ Sécurité & Prod V1.20', shortLabel: 'V1.20 Sec', icon: Shield },
  { id: 'PROJETS_GOUVERNANCE', label: '🏛️ Projets & Gouvernance V1.19', shortLabel: 'V1.19 Gouv.', icon: FolderKanban },
  { id: 'TERRAIN', label: '🧭 Opérations Terrain V1.18', shortLabel: 'V1.18 Terrain', icon: Compass },
  { id: 'SURVEILLANCE_ONE_HEALTH_V117', label: '🚨 Surveillance One Health V1.17', shortLabel: 'V1.17 Veille', icon: Activity },
  { id: 'VALIDATION_SCIENTIFIQUE', label: '🛡️ Validation Scientifique V1.16', shortLabel: 'V1.16 Valid.', icon: ShieldCheck },
  { id: 'MODELISATION', label: '📊 Modélisation Statistique V1.15', shortLabel: 'V1.15 Modèle', icon: Sparkles },
  { id: 'LABORATOIRE_ANALYSE', label: '🧪 Laboratoire d Analyse V1.14', shortLabel: 'V1.14 Lab', icon: Sparkles },
  { id: 'DIAGNOSTIC_SCIENTIFIQUE', label: '🔬 Diagnostic Scientifique V1.13', shortLabel: 'V1.13 Diag.', icon: Sparkles },
  { id: 'SOURCES_ET_IMPORTS_V112', label: '📥 Sources & Imports V1.12', shortLabel: 'V1.12 Sources', icon: UploadCloud },
  { id: 'ENQUETES_OPERATIONNELLES_V111', label: '📋 Enquêtes & Supervision V1.11', shortLabel: 'V1.11 Enquêtes', icon: ClipboardList },
  { id: 'MANIEMA_MULTI_PATHOLOGY_V110', label: '🌍 Extension Maniema V1.10', shortLabel: 'V1.10 Maniema', icon: Globe },
  { id: 'SURVEY', label: 'Enquêtes ménages', shortLabel: 'Ménages', icon: Home },
  { id: 'ENV', label: 'Observations env.', shortLabel: 'Gîtes/Env', icon: Bug },
  { id: 'HEALTH', label: 'Données sanitaires', shortLabel: 'Sanitaire', icon: Activity },
  { id: 'CLIMATE', label: 'Données climatiques', shortLabel: 'Climat', icon: CloudRain },
  { id: 'CONTROLE_HARMONISATION', label: 'Contrôle & Harmonisation V1.5', shortLabel: 'Harmonisation', icon: ShieldCheck },
  { id: 'BASE_SPATIO_TEMPORELLE', label: 'Base Spatio-Temporelle V1.7', shortLabel: 'V1.7 Base', icon: Sparkles },
  { id: 'DATA_QUALITY_V18', label: 'Qualité & Dataset V1.8', shortLabel: 'V1.8 Qualité', icon: ShieldCheck },
  { id: 'SPATIOTEMPORAL_EXPLORATION_V19', label: '🔬 Analyse Spatio-Temporelle V1.9', shortLabel: 'V1.9 Analyse', icon: Sparkles },
  { id: 'MAP', label: 'Cartographie SIG', shortLabel: 'Carte', icon: MapIcon },
  { id: 'QUALITY', label: 'Contrôle qualité V1', shortLabel: 'Qualité', icon: ShieldCheck },
  { id: 'MODEL_BASE', label: 'Base modèle (AS×Mois)', shortLabel: 'Matrice', icon: Database },
];

const MainContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AppModule>('ACCUEIL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { qualityIssues, userSession, setUserSession, oneHealthProjects, pendingSyncCount } = useData();

  // V1.20 Security & Production State
  const [envConfig, setEnvConfig] = useState<SecurityEnvironmentConfig>(DEFAULT_SECURITY_ENV_CONFIG);
  const [connectedDevices, setConnectedDevices] = useState(INITIAL_CONNECTED_DEVICES);
  const [mfaConfig, setMfaConfig] = useState<MFAConfiguration>(DEFAULT_MFA_CONFIG);
  const [permissionMatrix, setPermissionMatrix] = useState(DEFAULT_ROLE_PERMISSION_MATRIX);
  const [privacyRules, setPrivacyRules] = useState(DEFAULT_DATA_PRIVACY_RULES);
  const [recycleBinItems, setRecycleBinItems] = useState(INITIAL_RECYCLE_BIN_ITEMS);
  const [retentionPolicies, setRetentionPolicies] = useState(DEFAULT_RETENTION_POLICIES);
  const [backups, setBackups] = useState<BackupRecord[]>(INITIAL_BACKUP_RECORDS);
  const [drPlan, setDrPlan] = useState(DEFAULT_DISASTER_RECOVERY_PLAN);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLogEntry[]>(INITIAL_SECURITY_LOGS);
  const [centralErrors, setCentralErrors] = useState<CentralSystemError[]>(INITIAL_CENTRAL_ERRORS);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(DEFAULT_FEATURE_FLAGS);
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>(DEFAULT_MAINTENANCE_CONFIG);
  const [systemHealth, setSystemHealth] = useState(SYSTEM_HEALTH_METRICS_MOCK);
  const [currentSecuritySession, setCurrentSecuritySession] = useState(MOCK_SECURITY_USER_SESSION);

  const pendingIssuesCount = qualityIssues.filter(q => q.status === 'A_CORRIGER').length;

  const handleAddSecurityLog = (
    action: SecurityAuditLogEntry['action'],
    details: string,
    severity: SecurityAuditLogEntry['severity'] = 'INFO'
  ) => {
    const newLog: SecurityAuditLogEntry = {
      id: `SEC-LOG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: userSession.id,
      userName: userSession.name,
      userRole: userSession.role as any,
      ipAddress: '105.178.112.9 (Kindu)',
      action,
      resource: 'SYSTEM',
      status: 'SUCCESS',
      severity,
      details,
      environment: envConfig.activeEnvironment
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  const handleCreateBackup = (name: string, backupType: BackupRecord['backupType']) => {
    const newBackup: BackupRecord = {
      backupId: `BKP-${Date.now().toString(36).toUpperCase()}`,
      name,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      createdBy: userSession.name,
      environmentSource: envConfig.activeEnvironment,
      fileSizeBytes: Math.floor(Math.random() * 4000000) + 12000000,
      sha256Hash: `a8f5c9e2b1d43768e14298fc1c149afbf4c8996fb92427ae41e4649b934ca495`,
      backupType,
      tablesIncluded: [
        'study_projects',
        'study_protocols',
        'data_dictionary',
        'household_surveys',
        'health_records',
        'climate_records',
        'environmental_obs',
        'multilevel_validations',
        'reproducible_models',
        'central_audit_log'
      ],
      recordCounts: {
        projects: oneHealthProjects.length,
        datasets: 6,
        surveys: 150,
        models: 3,
        protocols: 3,
        validations: 18
      },
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verificationStatus: 'PASSED',
      retentionDays: backupType === 'SCHEDULED_WEEKLY' ? 90 : 30,
      isEncrypted: true,
      downloadUrlMasked: `https://secure-backup.onehealth.cd/archives/2026/08/BKP-SNAPSHOT-${Date.now()}.enc`
    };
    setBackups(prev => [newBackup, ...prev]);
    handleAddSecurityLog('BACKUP_CREATED', `Sauvegarde ${name} (${backupType}) créée et chiffrée avec succès.`, 'INFO');
  };

  const handleVerifyBackupIntegrity = (backupId: string) => {
    setBackups(prev =>
      prev.map(b => (b.backupId === backupId ? { ...b, status: 'VERIFIED' as const, verificationStatus: 'PASSED' as const, verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : b))
    );
    handleAddSecurityLog('BACKUP_INTEGRITY_VERIFIED', `Contrôle d'intégrité SHA-256 validé pour la sauvegarde ${backupId}.`, 'INFO');
  };

  const handleRunStagingTestRestore = (backupId: string) => {
    handleAddSecurityLog('RESTORE_COMPLETED', `Restauration de test exécutée avec succès en environnement STAGING pour la sauvegarde ${backupId}. Aucun impact sur la base de production.`, 'WARNING');
  };

  const handleToggleFeatureFlag = (flagKey: string) => {
    setFeatureFlags(prev =>
      prev.map(f => {
        if (f.key === flagKey) {
          const next = !f.isEnabled;
          handleAddSecurityLog('CONFIG_CHANGED', `Feature Flag ${f.label} modifié : ${next ? 'ACTIVÉ' : 'DÉSACTIVÉ'}.`, 'WARNING');
          return { ...f, isEnabled: next };
        }
        return f;
      })
    );
  };

  const handleUpdateEnvConfig = (updates: Partial<SecurityEnvironmentConfig>) => {
    setEnvConfig(prev => ({ ...prev, ...updates }));
    handleAddSecurityLog('CONFIG_CHANGED', `Configuration environnement modifiée : ${JSON.stringify(updates)}`, 'WARNING');
  };

  const handleRevokeDevice = (deviceId: string) => {
    setConnectedDevices(prev =>
      prev.map(d => (d.deviceId === deviceId ? { ...d, isRevoked: true } : d))
    );
    handleAddSecurityLog('SESSION_REVOKED', `Appareil ${deviceId} révoqué par ${userSession.name}`, 'WARNING');
  };

  const handleRestoreRecycleItem = (itemId: string) => {
    setRecycleBinItems(prev => prev.filter(i => i.itemId !== itemId));
    handleAddSecurityLog('RECYCLE_RESTORED', `Élément restauré depuis la corbeille : ${itemId}`, 'INFO');
  };

  const handlePermanentDeleteRecycleItem = (itemId: string) => {
    setRecycleBinItems(prev => prev.filter(i => i.itemId !== itemId));
    handleAddSecurityLog('DATA_PURGED', `Purge définitive autorisée par l'administrateur pour : ${itemId}`, 'CRITICAL');
  };

  const isModuleActive = (itemModule: AppModule, current: AppModule) => {
    if (itemModule === current) return true;
    if ((itemModule === 'SECURITE_PRODUCTION' || itemModule === 'SECURITE_PRODUCTION_V120') && (current === 'SECURITE_PRODUCTION' || current === 'SECURITE_PRODUCTION_V120')) return true;
    if ((itemModule === 'PROJETS_GOUVERNANCE' || itemModule === 'GOUVERNANCE_DONNEES' || itemModule === 'PROJETS_ETUDES' || itemModule === 'DICTIONNAIRE_VARIABLES' || itemModule === 'DATA_LINEAGE_V119' || itemModule === 'REPRODUCTIBILITE_V119') && (current === 'PROJETS_GOUVERNANCE' || current === 'GOUVERNANCE_DONNEES' || current === 'PROJETS_ETUDES' || current === 'DICTIONNAIRE_VARIABLES' || current === 'DATA_LINEAGE_V119' || current === 'REPRODUCTIBILITE_V119')) return true;
    if ((itemModule === 'TERRAIN' || itemModule === 'GESTION_TERRAIN_V118' || itemModule === 'TERRAIN_V118' || itemModule === 'CAMPAGNES_TERRAIN' || itemModule === 'ENQUETES_TERRAIN' || itemModule === 'COLLECTE_OFFLINE') && (current === 'TERRAIN' || current === 'GESTION_TERRAIN_V118' || current === 'TERRAIN_V118' || current === 'CAMPAGNES_TERRAIN' || current === 'ENQUETES_TERRAIN' || current === 'COLLECTE_OFFLINE')) return true;
    if ((itemModule === 'SURVEILLANCE_ONE_HEALTH_V117' || itemModule === 'SURVEILLANCE' || itemModule === 'SURVEILLANCE_MODULE') && (current === 'SURVEILLANCE_ONE_HEALTH_V117' || current === 'SURVEILLANCE' || current === 'SURVEILLANCE_MODULE')) return true;
    if ((itemModule === 'VALIDATION_SCIENTIFIQUE' || itemModule === 'SCIENTIFIC_VALIDATION') && (current === 'VALIDATION_SCIENTIFIQUE' || current === 'SCIENTIFIC_VALIDATION')) return true;
    if ((itemModule === 'MODELISATION' || itemModule === 'MODELISATION_STATISTIQUE' || itemModule === 'MODELISATION_V115' || itemModule === 'STATISTICAL_MODELING') && (current === 'MODELISATION' || current === 'MODELISATION_STATISTIQUE' || current === 'MODELISATION_V115' || current === 'STATISTICAL_MODELING')) return true;
    if ((itemModule === 'LABORATOIRE_ANALYSE' || itemModule === 'LABORATOIRE_ANALYSE_V114' || itemModule === 'LAB_ANALYSE') && (current === 'LABORATOIRE_ANALYSE' || current === 'LABORATOIRE_ANALYSE_V114' || current === 'LAB_ANALYSE')) return true;
    if ((itemModule === 'DIAGNOSTIC_SCIENTIFIQUE' || itemModule === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || itemModule === 'DIAGNOSTIC_DONNEES') && (current === 'DIAGNOSTIC_SCIENTIFIQUE' || current === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || current === 'DIAGNOSTIC_DONNEES')) return true;
    if ((itemModule === 'DASHBOARD' || itemModule === 'TABLEAU_BORD') && (current === 'DASHBOARD' || current === 'TABLEAU_BORD')) return true;
    if ((itemModule === 'SURVEY' || itemModule === 'ENQUETES_MENAGES') && (current === 'SURVEY' || current === 'ENQUETES_MENAGES' || current === 'SYNCHRONISATION')) return true;
    if ((itemModule === 'ENV' || itemModule === 'OBSERVATIONS_ENV') && (current === 'ENV' || current === 'OBSERVATIONS_ENV')) return true;
    if ((itemModule === 'HEALTH' || itemModule === 'DONNEES_SANITAIRES') && (current === 'HEALTH' || current === 'DONNEES_SANITAIRES')) return true;
    if ((itemModule === 'CLIMATE' || itemModule === 'DONNEES_CLIMATIQUES') && (current === 'CLIMATE' || current === 'DONNEES_CLIMATIQUES')) return true;
    if ((itemModule === 'MAP' || itemModule === 'CARTOGRAPHIE') && (current === 'MAP' || current === 'CARTOGRAPHIE')) return true;
    if ((itemModule === 'QUALITY' || itemModule === 'CONTROLE_QUALITE') && (current === 'QUALITY' || current === 'CONTROLE_QUALITE')) return true;
    if ((itemModule === 'CONTROLE_HARMONISATION' || itemModule === 'HARMONISATION') && (current === 'CONTROLE_HARMONISATION' || current === 'HARMONISATION')) return true;
    if (itemModule === 'BASE_SPATIO_TEMPORELLE' && current === 'BASE_SPATIO_TEMPORELLE') return true;
    if ((itemModule === 'DATA_QUALITY_V18' || itemModule === 'QUALITE_DONNEES') && (current === 'DATA_QUALITY_V18' || current === 'QUALITE_DONNEES')) return true;
    if ((itemModule === 'SPATIOTEMPORAL_EXPLORATION_V19' || itemModule === 'ANALYSE_SPATIO_TEMPORELLE') && (current === 'SPATIOTEMPORAL_EXPLORATION_V19' || current === 'ANALYSE_SPATIO_TEMPORELLE')) return true;
    if ((itemModule === 'SOURCES_ET_IMPORTS_V112' || itemModule === 'SOURCES_IMPORTS' || itemModule === 'INTEGRATION_MULTI_SOURCES') && (current === 'SOURCES_ET_IMPORTS_V112' || current === 'SOURCES_IMPORTS' || current === 'INTEGRATION_MULTI_SOURCES')) return true;
    if ((itemModule === 'ENQUETES_OPERATIONNELLES_V111' || itemModule === 'SUPERVISION_TERRAIN_V111' || itemModule === 'SURVEY_OPERATIONS') && (current === 'ENQUETES_OPERATIONNELLES_V111' || current === 'SUPERVISION_TERRAIN_V111' || current === 'SURVEY_OPERATIONS')) return true;
    if ((itemModule === 'MANIEMA_MULTI_PATHOLOGY_V110' || itemModule === 'GESTION_MANIEMA_PATHOLOGIES' || itemModule === 'ONE_HEALTH_PLATFORM') && (current === 'MANIEMA_MULTI_PATHOLOGY_V110' || current === 'GESTION_MANIEMA_PATHOLOGIES' || current === 'ONE_HEALTH_PLATFORM')) return true;
    if ((itemModule === 'MODEL_BASE' || itemModule === 'BASE_MODELE') && (current === 'MODEL_BASE' || current === 'BASE_MODELE')) return true;
    return false;
  };

  const handleNavigate = (module: AppModule) => {
    if (module === 'IMPORT_EXPORT') {
      setIsExportModalOpen(true);
    } else if (module === 'ADMINISTRATION') {
      setIsAuthModalOpen(true);
    } else {
      setActiveModule(module);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
      <Header
        currentModule={activeModule}
        setCurrentModule={handleNavigate}
        activeModule={activeModule}
        setActiveModule={handleNavigate}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        activeEnvironment={envConfig.activeEnvironment}
        maintenanceNotice={maintenanceConfig.active ? maintenanceConfig.message : null}
      />

      {/* Mobile Top Navigation Trigger */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-[57px] z-20">
        <div className="flex items-center gap-2">
          {(() => {
            const current = NAV_ITEMS.find(n => isModuleActive(n.id, activeModule)) || NAV_ITEMS[0];
            const Icon = current?.icon || LayoutDashboard;
            return (
              <>
                <Icon className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-800">{current?.label}</span>
              </>
            );
          })()}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[102px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 shadow-xl space-y-1 animate-in slide-in-from-top-2 duration-150">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isModuleActive(item.id, activeModule);

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'QUALITY' && pendingIssuesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingIssuesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === 'ACCUEIL' && <HomeModule onNavigate={handleNavigate} />}
        {(activeModule === 'SECURITE_PRODUCTION' || activeModule === 'SECURITE_PRODUCTION_V120') && (
          <SecurityAndProductionModule
            envConfig={envConfig}
            onUpdateEnvConfig={handleUpdateEnvConfig}
            systemHealth={systemHealth}
            currentSession={currentSecuritySession}
            connectedDevices={connectedDevices}
            mfaConfig={mfaConfig}
            permissionMatrix={permissionMatrix}
            privacyRules={privacyRules}
            recycleBinItems={recycleBinItems}
            retentionPolicies={retentionPolicies}
            backups={backups}
            drPlan={drPlan}
            securityLogs={securityLogs}
            centralErrors={centralErrors}
            featureFlags={featureFlags}
            maintenanceConfig={maintenanceConfig}
            projects={oneHealthProjects}
            currentUserRole={userSession.role as any}
            currentUserName={userSession.name}
            pendingSyncCount={pendingSyncCount}
            onRefreshHealth={() => {
              setSystemHealth({ ...systemHealth, lastCheckedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) });
              handleAddSecurityLog('SYSTEM_HEALTH_CHECK', 'Vérification proactive des métriques système et de la base IDB.', 'INFO');
            }}
            onRevokeDevice={handleRevokeDevice}
            onUpdateMfaConfig={(updates) => {
              setMfaConfig(prev => ({ ...prev, ...updates }));
              handleAddSecurityLog('MFA_CHALLENGE_ISSUED', `Paramètres MFA mis à jour : ${updates.enabled ? 'Activé' : 'Désactivé'}`, 'WARNING');
            }}
            onResetFailedAttempts={() => {
              setCurrentSecuritySession(prev => ({ ...prev, failedConsecutiveAttempts: 0 }));
              handleAddSecurityLog('CONFIG_CHANGED', 'Compteur de tentatives échouées réinitialisé.', 'INFO');
            }}
            onSimulateFailedLogin={() => {
              setCurrentSecuritySession(prev => {
                const nextCount = prev.failedConsecutiveAttempts + 1;
                if (nextCount >= 5) {
                  handleAddSecurityLog('ACCOUNT_LOCKED', `Compte temporairement verrouillé après ${nextCount} tentatives infructueuses.`, 'CRITICAL');
                } else {
                  handleAddSecurityLog('AUTH_LOGIN_FAILED', `Échec d'authentification simulé (Tentative ${nextCount}/5)`, 'WARNING');
                }
                return { ...prev, failedConsecutiveAttempts: nextCount };
              });
            }}
            onSafeLogout={() => {
              handleAddSecurityLog('AUTH_LOGOUT', `Déconnexion sécurisée effectuée pour ${userSession.name}`, 'INFO');
              setIsAuthModalOpen(true);
            }}
            onRestoreRecycleItem={handleRestoreRecycleItem}
            onPermanentDeleteRecycleItem={handlePermanentDeleteRecycleItem}
            onCreateBackup={handleCreateBackup}
            onVerifyBackupIntegrity={handleVerifyBackupIntegrity}
            onRunStagingTestRestore={handleRunStagingTestRestore}
            onToggleFeatureFlag={handleToggleFeatureFlag}
            onUpdateMaintenanceConfig={(updates) => {
              setMaintenanceConfig(prev => ({ ...prev, ...updates }));
              handleAddSecurityLog('CONFIG_CHANGED', `Mode maintenance : ${updates.active ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`, 'WARNING');
            }}
            onAddSecurityLog={handleAddSecurityLog}
          />
        )}
        {(activeModule === 'PROJETS_GOUVERNANCE' || activeModule === 'GOUVERNANCE_DONNEES' || activeModule === 'PROJETS_ETUDES' || activeModule === 'DICTIONNAIRE_VARIABLES' || activeModule === 'DATA_LINEAGE_V119' || activeModule === 'REPRODUCTIBILITE_V119') && (
          <GovernanceModule />
        )}
        {(activeModule === 'TERRAIN' || activeModule === 'GESTION_TERRAIN_V118' || activeModule === 'TERRAIN_V118' || activeModule === 'CAMPAGNES_TERRAIN' || activeModule === 'ENQUETES_TERRAIN' || activeModule === 'COLLECTE_OFFLINE') && (
          <TerrainModule />
        )}
        {(activeModule === 'SURVEILLANCE_ONE_HEALTH_V117' || activeModule === 'SURVEILLANCE' || activeModule === 'SURVEILLANCE_MODULE') && (
          <OneHealthSurveillanceModuleV117 />
        )}
        {(activeModule === 'VALIDATION_SCIENTIFIQUE' || activeModule === 'SCIENTIFIC_VALIDATION') && (
          <ScientificValidationModuleV116 />
        )}
        {(activeModule === 'MODELISATION' || activeModule === 'MODELISATION_STATISTIQUE' || activeModule === 'MODELISATION_V115' || activeModule === 'STATISTICAL_MODELING') && (
          <StatisticalModelingModuleV115 />
        )}
        {(activeModule === 'LABORATOIRE_ANALYSE' || activeModule === 'LABORATOIRE_ANALYSE_V114' || activeModule === 'LAB_ANALYSE') && (
          <ScientificLaboratoryModuleV114 />
        )}
        {(activeModule === 'DIAGNOSTIC_SCIENTIFIQUE' || activeModule === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || activeModule === 'DIAGNOSTIC_DONNEES') && (
          <ScientificDiagnosticModuleV113 />
        )}
        {(activeModule === 'DASHBOARD' || activeModule === 'TABLEAU_BORD') && <DashboardModule />}
        {(activeModule === 'MAP' || activeModule === 'CARTOGRAPHIE') && <MapModule />}
        {(activeModule === 'HEALTH' || activeModule === 'DONNEES_SANITAIRES') && <HealthDataModule />}
        {(activeModule === 'CLIMATE' || activeModule === 'DONNEES_CLIMATIQUES') && <ClimateDataModule />}
        {(activeModule === 'ENV' || activeModule === 'OBSERVATIONS_ENV') && <EnvironmentalModule />}
        {(activeModule === 'SURVEY' || activeModule === 'ENQUETES_MENAGES' || activeModule === 'SYNCHRONISATION') && (
          <HouseholdSurveyModule />
        )}
        {(activeModule === 'CONTROLE_HARMONISATION' || activeModule === 'HARMONISATION') && (
          <HarmonizationModule />
        )}
        {activeModule === 'BASE_SPATIO_TEMPORELLE' && <SpatiotemporalDatabaseModule />}
        {(activeModule === 'DATA_QUALITY_V18' || activeModule === 'QUALITE_DONNEES') && <DataQualityModule />}
        {(activeModule === 'SPATIOTEMPORAL_EXPLORATION_V19' || activeModule === 'ANALYSE_SPATIO_TEMPORELLE') && (
          <ExplorationModule />
        )}
        {(activeModule === 'SOURCES_ET_IMPORTS_V112' || activeModule === 'SOURCES_IMPORTS' || activeModule === 'INTEGRATION_MULTI_SOURCES') && (
          <MultiSourceHubModule onNavigateToAnalysis={() => setActiveModule('SPATIOTEMPORAL_EXPLORATION_V19')} />
        )}
        {(activeModule === 'ENQUETES_OPERATIONNELLES_V111' || activeModule === 'SUPERVISION_TERRAIN_V111' || activeModule === 'SURVEY_OPERATIONS') && (
          <SurveyOperationsModuleV111 />
        )}
        {(activeModule === 'MANIEMA_MULTI_PATHOLOGY_V110' || activeModule === 'GESTION_MANIEMA_PATHOLOGIES' || activeModule === 'ONE_HEALTH_PLATFORM') && (
          <ManiemaPlatformDashboard />
        )}
        {(activeModule === 'QUALITY' || activeModule === 'CONTROLE_QUALITE') && <QualityControlModule />}
        {(activeModule === 'MODEL_BASE' || activeModule === 'BASE_MODELE') && <ModelBaseModule />}
      </main>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex justify-around z-30 shadow-lg">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = isModuleActive(item.id, activeModule);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <AboutOneHealthManiemaModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        activeEnvironment={envConfig.activeEnvironment}
      />

      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={userSession.role}
        currentName={userSession.name}
        onSelectUser={(u) => {
          setUserSession({
            id: u.id,
            name: u.name,
            role: u.role,
            institution: 'Université de Kindu / DPS Maniema',
            assignedArea: u.healthAreaId,
            isActive: true,
          });
          setIsAuthModalOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            {APP_CONFIG.name} ({APP_CONFIG.version}) • {APP_CONFIG.tagline}
          </p>
          <p className="text-[11px] text-slate-400">
            {APP_CONFIG.primaryRegion} (RDC) • Anonymisation stricte (No PII) • Non-extrapolation temporelle
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
