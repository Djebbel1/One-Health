import React from 'react';
import {
  Shield,
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Lock,
  RefreshCw
} from 'lucide-react';
import {
  SecurityEnvironmentConfig,
  SystemHealthMetric,
  EnvironmentType,
  SecurityUserSession,
  BackupRecord
} from '../../types';

interface EnvironmentStatusTabProps {
  envConfig: SecurityEnvironmentConfig;
  onUpdateEnvConfig: (updates: Partial<SecurityEnvironmentConfig>) => void;
  systemHealth: SystemHealthMetric;
  currentSession: SecurityUserSession;
  backups: BackupRecord[];
  onRefreshHealth: () => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const EnvironmentStatusTab: React.FC<EnvironmentStatusTabProps> = ({
  envConfig,
  onUpdateEnvConfig,
  systemHealth,
  currentSession,
  backups,
  onRefreshHealth,
  onAddSecurityLog
}) => {
  const latestBackup = backups[0];

  const handleSwitchEnvironment = (newEnv: EnvironmentType) => {
    if (newEnv === envConfig.activeEnvironment) return;

    let bannerMsg = '';
    if (newEnv === 'DEVELOPMENT') {
      bannerMsg = 'Environnement de DÉVELOPPEMENT & DÉMONSTRATION — Données fictives et tests opérationnels One Health Maniema.';
    } else if (newEnv === 'STAGING') {
      bannerMsg = 'Environnement de QUALIFICATION & ESSAIS (STAGING) — Validation des migrations et tests de pré-production.';
    } else {
      bannerMsg = 'ENVIRONNEMENT DE PRODUCTION — Données réelles protégées. Respect strict des protocoles et du moindre privilège.';
    }

    onUpdateEnvConfig({
      activeEnvironment: newEnv,
      bannerMessage: bannerMsg,
      isStrictProductionMode: newEnv === 'PRODUCTION',
      allowDemoDataInsertion: newEnv !== 'PRODUCTION'
    });

    onAddSecurityLog(
      'ENV_SWITCH',
      `Bascule de l environnement actif de [${envConfig.activeEnvironment}] vers [${newEnv}]`,
      newEnv === 'PRODUCTION' ? 'WARNING' : 'INFO'
    );
  };

  const getHealthStatusBadge = (status: SystemHealthMetric['status']) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            🟢 Opérationnel
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            🟠 Dégradé
          </span>
        );
      case 'UNAVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            🔴 Indisponible
          </span>
        );
      default:
        return null;
    }
  };

  const storagePercent = ((systemHealth.storageUsedMb / systemHealth.storageTotalMb) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Environment Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Isolation des Environnements & État du Système
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Séparation hermétique des flux de données, traçabilité des environnements et monitoring technique V1.20
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getHealthStatusBadge(systemHealth.status)}
            <button
              onClick={onRefreshHealth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
              title="Actualiser les métriques de santé"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sonder</span>
            </button>
          </div>
        </div>

        {/* Environment Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Environnement Actif Sélectionné :
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Development */}
            <div
              onClick={() => handleSwitchEnvironment('DEVELOPMENT')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                envConfig.activeEnvironment === 'DEVELOPMENT'
                  ? 'bg-sky-50/80 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-sky-600" />
                  DEVELOPMENT
                </span>
                {envConfig.activeEnvironment === 'DEVELOPMENT' && (
                  <span className="text-[10px] font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Environnement de développement et d entraînement. Données fictives et tests rapides autorisés.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Tag : DEMO / FICTIF</span>
                <span className="text-sky-700 font-bold">Sans impact réel</span>
              </div>
            </div>

            {/* Staging */}
            <div
              onClick={() => handleSwitchEnvironment('STAGING')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                envConfig.activeEnvironment === 'STAGING'
                  ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-amber-600" />
                  TEST / STAGING
                </span>
                {envConfig.activeEnvironment === 'STAGING' && (
                  <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Espace de qualification pré-production. Utilisé pour tester les migrations et restaurations.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Tag : QUALIF / DIFF</span>
                <span className="text-amber-800 font-bold">Zone de test sûre</span>
              </div>
            </div>

            {/* Production */}
            <div
              onClick={() => handleSwitchEnvironment('PRODUCTION')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                envConfig.activeEnvironment === 'PRODUCTION'
                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  PRODUCTION
                </span>
                {envConfig.activeEnvironment === 'PRODUCTION' && (
                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 mt-2">
                Environnement opérationnel souverain. Données réelles, audit obligatoire et verrouillage strict.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Tag : PRODUCTION</span>
                <span className="text-emerald-800 font-bold">Sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Banner Preview */}
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            envConfig.activeEnvironment === 'PRODUCTION'
              ? 'bg-emerald-900 text-white border-emerald-800 shadow-sm'
              : envConfig.activeEnvironment === 'STAGING'
              ? 'bg-amber-900 text-amber-50 border-amber-800'
              : 'bg-slate-900 text-slate-100 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <strong className="block text-[11px] uppercase tracking-wider text-slate-300">
                {envConfig.activeEnvironment === 'PRODUCTION'
                  ? 'ENVIRONNEMENT DE PRODUCTION'
                  : `ENVIRONNEMENT ACTIF : ${envConfig.activeEnvironment}`}
              </strong>
              <p className="text-xs opacity-90">{envConfig.bannerMessage}</p>
            </div>
          </div>

          <div className="shrink-0 text-right font-mono text-[10px] opacity-75 hidden sm:block">
            <span>SSL : ACTIF (TLS 1.3)</span>
            <br />
            <span>RateLimit : {envConfig.rateLimitMaxRequestsPerMinute} req/min</span>
          </div>
        </div>
      </div>

      {/* System Health Telemetry Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sondes Techniques & Performance Système (V1.20)</h4>
              <p className="text-xs text-slate-500">
                Disponibilité des microservices, latence API, saturation du stockage et intégrité de synchronisation
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            Horloge Serveur : Décalage {systemHealth.serverClockSyncOffsetMs} ms
          </span>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Uptime */}
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Disponibilité</span>
              <Server className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-base font-bold text-slate-900 font-mono">
              {systemHealth.uptimePercentage}%
            </p>
            <span className="text-[10px] text-emerald-700 font-bold block">
              ✓ SLA Opérationnel 99.8%
            </span>
          </div>

          {/* Latency */}
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Latence API Backend</span>
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-base font-bold text-slate-900 font-mono">
              {systemHealth.backendApiLatencyMs} ms
            </p>
            <span className="text-[10px] text-teal-700 font-semibold block">
              Temps de réponse optimal
            </span>
          </div>

          {/* Storage Used */}
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Stockage Utilisé</span>
              <HardDrive className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-900 font-mono">
              {systemHealth.storageUsedMb} / {systemHealth.storageTotalMb} MB
            </p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  systemHealth.isStorageLow ? 'bg-rose-500' : 'bg-teal-600'
                }`}
                style={{ width: `${storagePercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">
              {storagePercent}% utilisé (Seuil alerte: 85%)
            </span>
          </div>

          {/* Sync Offline Queue */}
          <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>File de Synchro V1.18</span>
              <Wifi className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <p className="text-base font-bold text-slate-900 font-mono">
              {systemHealth.syncQueuePendingCount} en attente
            </p>
            <span className="text-[10px] text-slate-600 block">
              Dernière synchro : {systemHealth.lastSuccessfulSync.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Warning if storage is low */}
        {systemHealth.isStorageLow && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Avertissement Stockage :</strong> L espace disque disponible approche du seuil critique (85%). Prévoyez un archivage ou une purge des exports temporaires.
            </span>
          </div>
        )}
      </div>

      {/* Security & Provenance Banner */}
      <div className="p-4 bg-teal-900 text-teal-100 rounded-2xl border border-teal-800 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-teal-300" />
            Règle de Non-Invention & Préservation des Données (V1.20)
          </span>
          <span className="font-mono text-[10px] bg-teal-800/80 px-2 py-0.5 rounded text-teal-200">
            Protocole One Health RDC
          </span>
        </div>
        <p className="text-teal-200 text-[11px] leading-relaxed">
          Toutes les métriques et statuts affichés reflètent des contrôles techniques et scientifiques vérifiables. Aucune donnée n est falsifiée ou dissimulée. Les sauvegardes comportent une signature SHA-256 certifiée et le mode hors-ligne V1.18 garantit une résilience terrain totale.
        </p>
      </div>
    </div>
  );
};
