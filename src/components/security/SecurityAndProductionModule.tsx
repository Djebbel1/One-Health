import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Key,
  Lock,
  Trash2,
  Database,
  LifeBuoy,
  FileText,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Terminal
} from 'lucide-react';
import {
  SecurityEnvironmentConfig,
  SecurityUserSession,
  ConnectedDevice,
  MFAConfiguration,
  RolePermissionMatrixEntry,
  DataPrivacyRule,
  RecycleBinItem,
  DataRetentionPolicy,
  BackupRecord,
  DisasterRecoveryPlan,
  SecurityAuditLogEntry,
  CentralSystemError,
  FeatureFlag,
  MaintenanceConfig,
  UserRole,
  OneHealthProject
} from '../../types';
import { EnvironmentStatusTab } from './EnvironmentStatusTab';
import { AuthAndSessionsTab } from './AuthAndSessionsTab';
import { RbacAndPermissionsTab } from './RbacAndPermissionsTab';
import { PrivacyAndRecycleBinTab } from './PrivacyAndRecycleBinTab';
import { BackupCenterTab } from './BackupCenterTab';
import { DisasterRecoveryTab } from './DisasterRecoveryTab';
import { SecurityLogsAndErrorsTab } from './SecurityLogsAndErrorsTab';
import { ProductionReadinessTab } from './ProductionReadinessTab';
import { SecurityTestRunnerTab } from './SecurityTestRunnerTab';

export type SecurityTabKey =
  | 'ENV_STATUS'
  | 'AUTH_SESSIONS'
  | 'RBAC_PERMISSIONS'
  | 'PRIVACY_RECYCLE'
  | 'BACKUP_CENTER'
  | 'DISASTER_RECOVERY'
  | 'LOGS_ERRORS'
  | 'READINESS_FLAGS'
  | 'TESTS_RUNNER';

interface SecurityAndProductionModuleProps {
  envConfig: SecurityEnvironmentConfig;
  onUpdateEnvConfig: (updates: Partial<SecurityEnvironmentConfig>) => void;
  systemHealth: any;
  currentSession: SecurityUserSession;
  connectedDevices: ConnectedDevice[];
  mfaConfig: MFAConfiguration;
  permissionMatrix: RolePermissionMatrixEntry[];
  privacyRules: DataPrivacyRule[];
  recycleBinItems: RecycleBinItem[];
  retentionPolicies: DataRetentionPolicy[];
  backups: BackupRecord[];
  drPlan: DisasterRecoveryPlan;
  securityLogs: SecurityAuditLogEntry[];
  centralErrors: CentralSystemError[];
  featureFlags: FeatureFlag[];
  maintenanceConfig: MaintenanceConfig;
  projects: OneHealthProject[];
  currentUserRole: UserRole;
  currentUserName: string;
  pendingSyncCount: number;
  onRefreshHealth: () => void;
  onRevokeDevice: (deviceId: string) => void;
  onUpdateMfaConfig: (updates: Partial<MFAConfiguration>) => void;
  onResetFailedAttempts: () => void;
  onSimulateFailedLogin: () => void;
  onSafeLogout: () => void;
  onRestoreRecycleItem: (itemId: string) => void;
  onPermanentDeleteRecycleItem: (itemId: string) => void;
  onCreateBackup: (name: string, type: BackupRecord['backupType']) => void;
  onVerifyBackupIntegrity: (backupId: string) => void;
  onRunStagingTestRestore: (backupId: string) => void;
  onToggleFeatureFlag: (flagKey: string) => void;
  onUpdateMaintenanceConfig: (updates: Partial<MaintenanceConfig>) => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const SecurityAndProductionModule: React.FC<SecurityAndProductionModuleProps> = ({
  envConfig,
  onUpdateEnvConfig,
  systemHealth,
  currentSession,
  connectedDevices,
  mfaConfig,
  permissionMatrix,
  privacyRules,
  recycleBinItems,
  retentionPolicies,
  backups,
  drPlan,
  securityLogs,
  centralErrors,
  featureFlags,
  maintenanceConfig,
  projects,
  currentUserRole,
  currentUserName,
  pendingSyncCount,
  onRefreshHealth,
  onRevokeDevice,
  onUpdateMfaConfig,
  onResetFailedAttempts,
  onSimulateFailedLogin,
  onSafeLogout,
  onRestoreRecycleItem,
  onPermanentDeleteRecycleItem,
  onCreateBackup,
  onVerifyBackupIntegrity,
  onRunStagingTestRestore,
  onToggleFeatureFlag,
  onUpdateMaintenanceConfig,
  onAddSecurityLog
}) => {
  const [activeTab, setActiveTab] = useState<SecurityTabKey>('ENV_STATUS');

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Module Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-teal-800 text-white shadow-xs">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Sécurité, Sauvegardes, PCA & Préparation Production (V1.20)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Plateforme One Health Maniema • RDC • Souveraineté des données, intégrité SHA-256 & résilience opérationnelle
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
              envConfig.activeEnvironment === 'PRODUCTION'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : envConfig.activeEnvironment === 'STAGING'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-sky-100 text-sky-900 border-sky-300'
            }`}
          >
            ENV : {envConfig.activeEnvironment}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            Rôle : {currentUserRole}
          </span>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab('ENV_STATUS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'ENV_STATUS'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Layers className="w-4 h-4 text-teal-700" />
          Environnements & Santé
        </button>

        <button
          onClick={() => setActiveTab('AUTH_SESSIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'AUTH_SESSIONS'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Key className="w-4 h-4 text-indigo-600" />
          Authentification & MFA
        </button>

        <button
          onClick={() => setActiveTab('RBAC_PERMISSIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'RBAC_PERMISSIONS'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Lock className="w-4 h-4 text-indigo-600" />
          Matrice RBAC
        </button>

        <button
          onClick={() => setActiveTab('PRIVACY_RECYCLE')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'PRIVACY_RECYCLE'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          Protection PII & Corbeille
        </button>

        <button
          onClick={() => setActiveTab('BACKUP_CENTER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'BACKUP_CENTER'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Database className="w-4 h-4 text-teal-700" />
          Sauvegardes (SHA-256)
        </button>

        <button
          onClick={() => setActiveTab('DISASTER_RECOVERY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'DISASTER_RECOVERY'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <LifeBuoy className="w-4 h-4 text-rose-600" />
          Plan Sinistre (PRA)
        </button>

        <button
          onClick={() => setActiveTab('LOGS_ERRORS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'LOGS_ERRORS'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Terminal className="w-4 h-4 text-slate-700" />
          Logs & Erreurs
        </button>

        <button
          onClick={() => setActiveTab('READINESS_FLAGS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'READINESS_FLAGS'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Checklist Production
        </button>

        <button
          onClick={() => setActiveTab('TESTS_RUNNER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'TESTS_RUNNER'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-700" />
          Tests V1.20 (11/11)
        </button>
      </div>

      {/* Render Active Sub-Tab */}
      {activeTab === 'ENV_STATUS' && (
        <EnvironmentStatusTab
          envConfig={envConfig}
          onUpdateEnvConfig={onUpdateEnvConfig}
          systemHealth={systemHealth}
          currentSession={currentSession}
          backups={backups}
          onRefreshHealth={onRefreshHealth}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'AUTH_SESSIONS' && (
        <AuthAndSessionsTab
          currentSession={currentSession}
          connectedDevices={connectedDevices}
          mfaConfig={mfaConfig}
          envConfig={envConfig}
          onRevokeDevice={onRevokeDevice}
          onUpdateMfaConfig={onUpdateMfaConfig}
          onResetFailedAttempts={onResetFailedAttempts}
          onAddSecurityLog={onAddSecurityLog}
          onSimulateFailedLogin={onSimulateFailedLogin}
          onSafeLogout={onSafeLogout}
          pendingSyncCount={pendingSyncCount}
        />
      )}

      {activeTab === 'RBAC_PERMISSIONS' && (
        <RbacAndPermissionsTab
          permissionMatrix={permissionMatrix}
          currentRole={currentUserRole}
          projects={projects}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'PRIVACY_RECYCLE' && (
        <PrivacyAndRecycleBinTab
          privacyRules={privacyRules}
          recycleBinItems={recycleBinItems}
          retentionPolicies={retentionPolicies}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
          onRestoreItem={onRestoreRecycleItem}
          onPermanentDeleteItem={onPermanentDeleteRecycleItem}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'BACKUP_CENTER' && (
        <BackupCenterTab
          backups={backups}
          activeEnvironment={envConfig.activeEnvironment}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
          onCreateBackup={onCreateBackup}
          onVerifyBackupIntegrity={onVerifyBackupIntegrity}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'DISASTER_RECOVERY' && (
        <DisasterRecoveryTab
          drPlan={drPlan}
          backups={backups}
          activeEnvironment={envConfig.activeEnvironment}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
          onRunStagingTestRestore={onRunStagingTestRestore}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'LOGS_ERRORS' && (
        <SecurityLogsAndErrorsTab
          securityLogs={securityLogs}
          centralErrors={centralErrors}
          currentUserRole={currentUserRole}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'READINESS_FLAGS' && (
        <ProductionReadinessTab
          featureFlags={featureFlags}
          maintenanceConfig={maintenanceConfig}
          currentUserRole={currentUserRole}
          onToggleFeatureFlag={onToggleFeatureFlag}
          onUpdateMaintenanceConfig={onUpdateMaintenanceConfig}
          onAddSecurityLog={onAddSecurityLog}
        />
      )}

      {activeTab === 'TESTS_RUNNER' && (
        <SecurityTestRunnerTab onAddSecurityLog={onAddSecurityLog} />
      )}
    </div>
  );
};
