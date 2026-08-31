import React, { useState } from 'react';
import {
  Cloud,
  Database,
  HardDrive,
  Cpu,
  Lock,
  Activity,
  FileCode,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Play,
  Layers,
  ArrowRight,
  ShieldCheck,
  Clock,
  Terminal,
  FileText,
  UploadCloud,
  Sliders
} from 'lucide-react';
import {
  CloudComponentReadinessV123,
  CloudReadinessStatusLevel,
  EnvironmentType,
  UserRole,
  SyncQueueItemV123,
  BackgroundJobV123,
  InfrastructureAsCodeArtifact,
  StructuredLogEntryV123,
  FileMetadataRecordV123
} from '../../types';
import {
  INITIAL_CLOUD_COMPONENTS_V123,
  TARGET_POSTGRES_CONFIG_V123,
  INITIAL_SYNC_QUEUE_V123,
  INITIAL_BACKGROUND_JOBS_V123,
  INITIAL_IAC_ARTIFACTS_V123,
  INITIAL_STRUCTURED_LOGS_V123
} from '../../data/mockCloudReadinessDataV123';
import { storageManager } from '../../services/storageProvider';

interface CloudReadinessV123TabProps {
  currentEnvironment: EnvironmentType;
  currentUserRole: UserRole;
}

export const CloudReadinessV123Tab: React.FC<CloudReadinessV123TabProps> = ({
  currentEnvironment,
  currentUserRole
}) => {
  const [activeModule, setActiveModule] = useState<
    'MATRIX' | 'STORAGE' | 'SYNC_ENGINE' | 'POSTGRES' | 'IAC_TEMPLATES' | 'LOGS' | 'REPORT'
  >('MATRIX');

  const [components] = useState<CloudComponentReadinessV123[]>(INITIAL_CLOUD_COMPONENTS_V123);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItemV123[]>(INITIAL_SYNC_QUEUE_V123);
  const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJobV123[]>(INITIAL_BACKGROUND_JOBS_V123);
  const [iacArtifacts] = useState<InfrastructureAsCodeArtifact[]>(INITIAL_IAC_ARTIFACTS_V123);
  const [selectedIac, setSelectedIac] = useState<InfrastructureAsCodeArtifact>(INITIAL_IAC_ARTIFACTS_V123[0]);
  const [logs, setLogs] = useState<StructuredLogEntryV123[]>(INITIAL_STRUCTURED_LOGS_V123);
  const [logFilter, setLogFilter] = useState<string>('ALL');

  // Network Simulation State
  const [networkCondition, setNetworkCondition] = useState<
    'ONLINE_FAST' | 'OFFLINE_AIRPLANE' | 'WEAK_2G' | 'INTERMITTENT'
  >('ONLINE_FAST');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Files in local storage provider
  const [storedFiles, setStoredFiles] = useState<FileMetadataRecordV123[]>([]);
  const [isUploadingSample, setIsUploadingSample] = useState(false);

  // Copy feedback
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Dry run simulation
  const [isDryRunExecuting, setIsDryRunExecuting] = useState(false);
  const [dryRunReport, setDryRunReport] = useState<{
    timestamp: string;
    targetRegion: string;
    modulesValidated: number;
    warnings: string[];
    canDeploy: boolean;
  } | null>(null);

  // Initial load of files
  React.useEffect(() => {
    storageManager.getActiveProvider().listFiles().then(files => {
      setStoredFiles(files);
    });
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const getStatusBadge = (status: CloudReadinessStatusLevel) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            🟢 READY (Prêt)
          </span>
        );
      case 'PREPARED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            🟠 PREPARED (Préparé)
          </span>
        );
      case 'NOT_CONFIGURED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            🔴 NOT CONFIGURED (Non configuré)
          </span>
        );
    }
  };

  // Simulation: Test Upload a Field Photo into StorageProvider
  const handleSimulateFieldPhotoUpload迷 = async () => {
    setIsUploadingSample(true);
    const photoNumber = Math.floor(Math.random() * 900 + 100);
    const logicalPath = `/projects/PRJ-MANIEMA-2026/surveys/SRV-2026-001/media/observation_photo_${photoNumber}.jpg`;
    
    // Simulate dummy photo blob
    const dummyBlob = new Blob([`PHOTO_BINARY_DATA_${Date.now()}`], { type: 'image/jpeg' });
    
    const result = await storageManager.getActiveProvider().upload(dummyBlob, logicalPath, {
      category: 'SURVEY_PHOTO',
      uploadedBy: currentUserRole === 'ADMINISTRATEUR' ? 'Superviseur Terrain' : 'Enquêteur Mobile',
      projectId: 'PRJ-MANIEMA-2026',
      surveyId: 'SRV-2026-001',
      mimeType: 'image/jpeg',
      geoCoordinates: { latitude: -2.95 + (Math.random() * 0.05), longitude: 25.92 + (Math.random() * 0.05) }
    });

    const updatedFiles = await storageManager.getActiveProvider().listFiles();
    setStoredFiles(updatedFiles);

    // Also append log
    const newLog: StructuredLogEntryV123 = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'storage-provider',
      requestId: `REQ-${Date.now().toString(36).toUpperCase()}`,
      environment: currentEnvironment,
      message: `Upload photo terrain ${logicalPath} enregistré avec succès (${result.bytesTransferred} bytes)`,
      userId: 'USR-CURRENT',
      durationMs: result.latencyMs,
      metadata: {
        fileId: result.key,
        checksum: result.sha256Checksum || 'n/a',
        provider: result.provider
      }
    };
    setLogs(prev => [newLog, ...prev]);
    setIsUploadingSample(false);
  };

  // Simulation: Process Sync Queue
  const handleTriggerSyncQueue = () => {
    if (networkCondition === 'OFFLINE_AIRPLANE') {
      setSyncFeedback('Impossible de synchroniser en Mode Avion. Désactivez le mode avion pour reprendre.');
      setTimeout(() => setSyncFeedback(null), 3500);
      return;
    }

    setIsSyncingAll(true);
    setSyncFeedback('Traitement de la file d\'attente de synchronisation en cours...');

    setTimeout(() => {
      setSyncQueue(prev =>
        prev.map(item => {
          if (item.status === 'PENDING' || item.status === 'FAILED') {
            if (networkCondition === 'WEAK_2G' && Math.random() > 0.5) {
              return {
                ...item,
                status: 'FAILED',
                retryCount: item.retryCount + 1,
                backoffDelayMs: Math.min(item.backoffDelayMs * 2, 32000),
                lastAttemptAt: new Date().toISOString(),
                lastErrorMessage: 'CONN_RESET_2G: Coupure intermittente signal radio Maniema.'
              };
            }
            return {
              ...item,
              status: 'SYNCED',
              retryCount: item.retryCount + 1,
              lastAttemptAt: new Date().toISOString(),
              lastErrorMessage: undefined
            };
          }
          return item;
        })
      );
      setIsSyncingAll(false);
      setSyncFeedback('File de synchronisation mise à jour avec succès !');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 1200);
  };

  // Simulation: Run Dry Run Validation
  const handleRunDryRun = () => {
    setIsDryRunExecuting(true);
    setTimeout(() => {
      setDryRunReport({
        timestamp: new Date().toISOString(),
        targetRegion: 'africa-south1 (Johannesburg)',
        modulesValidated: 8,
        warnings: [
          'Le nom de domaine officiel (ex: app.onehealthmaniema.cd) doit être acheté et pointé sur Cloud DNS avant activation SSL de production.',
          'L\'instance Cloud SQL PostgreSQL doit être provisionnée en mode REGIONAL haute disponibilité pour la PRODUCTION.',
          'Le bucket Cloud Storage doit être configuré avec la rétention 3-2-1 et restriction CORS stricte.'
        ],
        canDeploy: false
      });
      setIsDryRunExecuting(false);
    }, 1000);
  };

  const readyCount = components.filter(c => c.status === 'READY').length;
  const preparedCount萃 = components.filter(c => c.status === 'PREPARED').length;
  const notConfiguredCount = components.filter(c => c.status === 'NOT_CONFIGURED').length;
  const blockers = components.filter(c => c.isBlocker && c.status !== 'READY');

  return (
    <div className="space-y-6">
      {/* Header Bannière V1.23 Adaptation Cloud */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500 text-white tracking-wide">
                ADAPTATION CLOUD V1.23
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400 text-slate-950 font-mono">
                GCP COMPATIBLE • RÉGION JOHANNESBURG
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-400" />
              ONE HEALTH MANIEMA — Adaptation à l'Architecture Cloud
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Préparation technique complète pour un déploiement futur sur Google Cloud (Cloud Run, Cloud SQL PostgreSQL, Cloud Storage, Secret Manager, Cloud Logging/Monitoring dans la région <strong>Johannesburg (africa-south1)</strong>).
              <strong className="text-amber-300 ml-1 font-medium">Principe de sécurité :</strong> Aucune ressource payante n'est créée automatiquement. L'application reste entièrement autonome en mode bac à sable et hors-ligne.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={handleRunDryRun}
              disabled={isDryRunExecuting}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 mr-2 ${isDryRunExecuting ? 'animate-spin' : ''}`} />
              {isDryRunExecuting ? 'Simulation DRY-RUN...' : 'Exécuter Validation DRY-RUN'}
            </button>
          </div>
        </div>

        {/* Rapport Dry-Run si exécuté */}
        {dryRunReport && (
          <div className="mt-4 p-4 rounded-lg bg-slate-800/90 border border-slate-700 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-200 border-b border-slate-700 pb-2">
              <span className="flex items-center gap-2 text-indigo-400 font-bold">
                <Terminal className="w-4 h-4" /> Rapport de Simulation DRY-RUN (Synthèse de Déploiement)
              </span>
              <span>Région cible : {dryRunReport.targetRegion}</span>
            </div>
            <div className="text-slate-300 space-y-1">
              <p>✔ {dryRunReport.modulesValidated}/8 modules d'architecture vérifiés (Conteneur, DB Schema, Storage, Secrets, Offline Sync, Logs, RBAC, CI/CD).</p>
              <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pré-requis avant déploiement réel :
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-300/90">
                  {dryRunReport.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
              <p className="text-emerald-400 font-bold">
                Statut : Simulation validée avec succès. Aucune ressource payante n'a été créée.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation des sous-modules V1.23 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveModule('MATRIX')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'MATRIX'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          1. Matrice Préparation Cloud ({readyCount} Prêts / {blockers.length} Bloquants)
        </button>

        <button
          onClick={() => setActiveModule('STORAGE')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'STORAGE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          2. Stockage Objets & Médias ({storedFiles.length} fichiers)
        </button>

        <button
          onClick={() => setActiveModule('SYNC_ENGINE')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'SYNC_ENGINE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wifi className="w-4 h-4" />
          3. Résilience Offline & Sync Queue
        </button>

        <button
          onClick={() => setActiveModule('POSTGRES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'POSTGRES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          4. Base PostgreSQL & Schémas
        </button>

        <button
          onClick={() => setActiveModule('IAC_TEMPLATES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'IAC_TEMPLATES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          5. Infrastructure as Code (IaC)
        </button>

        <button
          onClick={() => setActiveModule('LOGS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'LOGS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          6. Logs Structurés JSON ({logs.length})
        </button>

        <button
          onClick={() => setActiveModule('REPORT')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeModule === 'REPORT'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          7. Rapport V1.23 & Checklist
        </button>
      </div>

      {/* SOUS-MODULE 1: MATRICE CLOUD READINESS */}
      {activeModule === 'MATRIX' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs font-medium text-slate-500">Composants Totaux</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{components.length}</p>
              <span className="text-[11px] text-slate-400">Services analysés</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm">
              <span className="text-xs font-medium text-emerald-700">🟢 READY (Opérationnels)</span>
              <p className="text-2xl font-bold text-emerald-800 mt-1">{readyCount}</p>
              <span className="text-[11px] text-emerald-600">Autonomes & validés</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-sm">
              <span className="text-xs font-medium text-amber-700">🟠 PREPARED (Préparés)</span>
              <p className="text-2xl font-bold text-amber-800 mt-1">{preparedCount萃}</p>
              <span className="text-[11px] text-amber-600">Prêts pour connexion</span>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-sm">
              <span className="text-xs font-medium text-rose-700">🔴 Bloqueurs Production</span>
              <p className="text-2xl font-bold text-rose-800 mt-1">{blockers.length}</p>
              <span className="text-[11px] text-rose-600">Requièrent infra réelle</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Inventaire de Préparation Cloud (GCP Target)</h3>
                <p className="text-xs text-slate-500">Statut réel et spécifications d'interfaçage pour chaque composant</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-mono font-medium border border-indigo-200">
                Région : africa-south1
              </span>
            </div>

            <div className="divide-y divide-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Composant</th>
                    <th className="p-3">Service Cible GCP</th>
                    <th className="p-3">Statut Réel</th>
                    <th className="p-3">Implémentation Actuelle</th>
                    <th className="p-3">Configuration Cible</th>
                    <th className="p-3">Bloquant PROD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {components.map(comp => (
                    <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900">
                        <div className="flex flex-col">
                          <span>{comp.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{comp.category}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-indigo-900 bg-indigo-50/40">
                        {comp.gcpEquivalent}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {getStatusBadge(comp.status)}
                      </td>
                      <td className="p-3 max-w-xs text-slate-600">
                        {comp.currentImplementation}
                      </td>
                      <td className="p-3 max-w-xs text-slate-600 font-mono text-[11px]">
                        {comp.cloudTargetConfig}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {comp.isBlocker ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            OUI (Bloquant)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Non bloquant
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 2: STOCKAGE D'OBJETS & MÉDIAS */}
      {activeModule === 'STORAGE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-indigo-600" />
                  Séparation Données Relationnelles vs Stockage d'Objets
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Les gros fichiers (photos terrain, rasters géospatiaux, exports volumineux) sont isolés de la base de données relationnelle et gérés par l'interface <code>IStorageProvider</code>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateFieldPhotoUpload迷}
                  disabled={isUploadingSample}
                  className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                >
                  <UploadCloud className="w-4 h-4 mr-1.5" />
                  {isUploadingSample ? 'Simulation upload...' : 'Simuler Collecte Photo Terrain'}
                </button>
              </div>
            </div>

            {/* Schéma de nommage logique */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">📸 Photos d'Enquêtes Terrain</span>
                <p className="font-mono text-[11px] text-indigo-700 bg-white p-1.5 rounded border border-slate-200">
                  /projects/&#123;projectId&#125;/surveys/&#123;surveyId&#125;/media/
                </p>
                <span className="text-[10px] text-slate-500">Collecte offline + sync asynchrone</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">🗺️ Rasters & Fichiers GeoTIFF</span>
                <p className="font-mono text-[11px] text-indigo-700 bg-white p-1.5 rounded border border-slate-200">
                  /projects/&#123;projectId&#125;/geospatial/
                </p>
                <span className="text-[10px] text-slate-500">Couches climatiques, MNT, NDVI</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800">📦 Archives d'Exportation</span>
                <p className="font-mono text-[11px] text-indigo-700 bg-white p-1.5 rounded border border-slate-200">
                  /exports/
                </p>
                <span className="text-[10px] text-slate-500">Snapshots et packages reproductibilité</span>
              </div>
            </div>

            {/* Table des fichiers dans le StorageProvider */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-between">
                <span>Fichiers Actuellement Enregistrés ({storedFiles.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">Adaptateur actif : <strong>LOCAL_INDEXEDDB</strong> (GCS Prepared)</span>
              </div>
              <div className="divide-y divide-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2.5">ID & Chemin Logique</th>
                      <th className="p-2.5">Catégorie</th>
                      <th className="p-2.5">Taille</th>
                      <th className="p-2.5">Empreinte SHA-256</th>
                      <th className="p-2.5">Auteur / Projet</th>
                      <th className="p-2.5">Statut Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {storedFiles.map(file => (
                      <tr key={file.fileId} className="hover:bg-slate-50 font-mono text-[11px]">
                        <td className="p-2.5 text-slate-900">
                          <div className="font-bold text-indigo-900">{file.fileId}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-sm">{file.logicalPath}</div>
                        </td>
                        <td className="p-2.5 text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px]">
                            {file.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 whitespace-nowrap">
                          {(file.sizeBytes / 1024 / 1024).toFixed(2)} MB
                        </td>
                        <td className="p-2.5 text-slate-500 text-[10px] max-w-xs truncate" title={file.sha256Checksum}>
                          {file.sha256Checksum.slice(0, 20)}...
                        </td>
                        <td className="p-2.5 text-slate-700 font-sans text-xs">
                          {file.uploadedBy}
                        </td>
                        <td className="p-2.5 whitespace-nowrap font-sans">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {file.syncStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 3: RÉSILIENCE OFFLINE & SYNC QUEUE */}
      {activeModule === 'SYNC_ENGINE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-indigo-600" />
                  Moteur de Résilience Réseau & File d'Attente de Synchronisation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conçu pour le terrain isolé du Maniema : file d'attente locale (FIFO/priorités), retry avec backoff exponentiel, clés d'idempotence et détection de conflits.
                </p>
              </div>

              {/* Sélecteur de condition réseau */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[11px] font-medium text-slate-600 px-2 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Condition :
                </span>
                <button
                  onClick={() => setNetworkCondition('ONLINE_FAST')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    networkCondition === 'ONLINE_FAST'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🟢 En Ligne (4G/VSAT)
                </button>
                <button
                  onClick={() => setNetworkCondition('WEAK_2G')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    networkCondition === 'WEAK_2G'
                      ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🟠 Réseau Faible (2G)
                </button>
                <button
                  onClick={() => setNetworkCondition('OFFLINE_AIRPLANE')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    networkCondition === 'OFFLINE_AIRPLANE'
                      ? 'bg-white text-rose-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🔴 Mode Avion (Hors-ligne)
                </button>
              </div>
            </div>

            {/* Actions de synchronisation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100">
              <div className="text-xs text-indigo-950">
                <strong>Stratégie de synchronisation :</strong> Reprise automatique après reconnexion, déduplication stricte par clé <code>idempotencyKey</code> et politique de résolution configurable.
              </div>
              <button
                onClick={handleTriggerSyncQueue}
                disabled={isSyncingAll}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                {isSyncingAll ? 'Traitement en cours...' : 'Traiter la File de Synchronisation'}
              </button>
            </div>

            {syncFeedback && (
              <div className="p-3 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between animate-fade-in font-mono">
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Tableau de la file d'attente */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-between">
                <span>Éléments de la File d'Attente ({syncQueue.length})</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Retries Max : 5 • Backoff : x2 exponentiel (1s, 2s, 4s, 8s, 16s, 32s)
                </span>
              </div>
              <div className="divide-y divide-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2.5">ID & Type d'Entité</th>
                      <th className="p-2.5">Résumé du Payload</th>
                      <th className="p-2.5">Clé d'Idempotence</th>
                      <th className="p-2.5">Tentatives & Délai</th>
                      <th className="p-2.5">Stratégie Conflit</th>
                      <th className="p-2.5">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {syncQueue.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 font-mono text-[11px]">
                        <td className="p-2.5 text-slate-900">
                          <div className="font-bold text-slate-900">{item.id}</div>
                          <span className="text-[10px] text-indigo-700 font-sans font-medium">{item.entityType} ({item.action})</span>
                        </td>
                        <td className="p-2.5 text-slate-700 font-sans max-w-sm">
                          <div>{item.payloadSummary}</div>
                          {item.lastErrorMessage && (
                            <div className="text-[10px] text-rose-600 font-mono mt-0.5">{item.lastErrorMessage}</div>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-500 text-[10px]">
                          {item.idempotencyKey}
                        </td>
                        <td className="p-2.5 text-slate-600 whitespace-nowrap">
                          {item.retryCount}/{item.maxRetries} (délai: {item.backoffDelayMs}ms)
                        </td>
                        <td className="p-2.5 text-slate-700 font-sans text-xs">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px]">
                            {item.conflictStrategy}
                          </span>
                        </td>
                        <td className="p-2.5 whitespace-nowrap font-sans">
                          {item.status === 'SYNCED' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              SYNCED
                            </span>
                          )}
                          {item.status === 'PENDING' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              PENDING
                            </span>
                          )}
                          {item.status === 'FAILED' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              FAILED (Retry prévu)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 4: BASE POSTGRESQL & SCHÉMAS */}
      {activeModule === 'POSTGRES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Matrice des Configurations PostgreSQL par Environnement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Isolation stricte des instances. La production nécessite un chiffrement SSL obligatoire et un réplicat de lecture en lecture seule.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* DEVELOPMENT */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-xs">DEVELOPMENT</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    🟢 OPÉRATIONNEL
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono text-slate-600">
                  <p><strong>Hôte :</strong> {TARGET_POSTGRES_CONFIG_V123.development.host}:{TARGET_POSTGRES_CONFIG_V123.development.port}</p>
                  <p><strong>Base :</strong> {TARGET_POSTGRES_CONFIG_V123.development.database}</p>
                  <p><strong>Pool Max :</strong> {TARGET_POSTGRES_CONFIG_V123.development.maxPoolConnections}</p>
                  <p><strong>SSL :</strong> {TARGET_POSTGRES_CONFIG_V123.development.sslMode}</p>
                </div>
                <p className="text-[11px] text-slate-500 font-sans">{TARGET_POSTGRES_CONFIG_V123.development.notes}</p>
              </div>

              {/* STAGING */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold text-amber-950 text-xs">STAGING (Pré-production)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                    🟠 PRÉPARÉ
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono text-slate-700">
                  <p><strong>Hôte :</strong> {TARGET_POSTGRES_CONFIG_V123.staging.host}:{TARGET_POSTGRES_CONFIG_V123.staging.port}</p>
                  <p><strong>Base :</strong> {TARGET_POSTGRES_CONFIG_V123.staging.database}</p>
                  <p><strong>Pool Max :</strong> {TARGET_POSTGRES_CONFIG_V123.staging.maxPoolConnections}</p>
                  <p><strong>SSL :</strong> {TARGET_POSTGRES_CONFIG_V123.staging.sslMode}</p>
                  <p><strong>Région :</strong> {TARGET_POSTGRES_CONFIG_V123.staging.targetRegion}</p>
                </div>
                <p className="text-[11px] text-amber-800 font-sans">{TARGET_POSTGRES_CONFIG_V123.staging.notes}</p>
              </div>

              {/* PRODUCTION */}
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                  <span className="font-bold text-rose-950 text-xs">PRODUCTION</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900">
                    🔴 NON PROVISIONNÉ
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono text-slate-700">
                  <p><strong>Hôte :</strong> {TARGET_POSTGRES_CONFIG_V123.production.host}:{TARGET_POSTGRES_CONFIG_V123.production.port}</p>
                  <p><strong>Base :</strong> {TARGET_POSTGRES_CONFIG_V123.production.database}</p>
                  <p><strong>Pool Max :</strong> {TARGET_POSTGRES_CONFIG_V123.production.maxPoolConnections}</p>
                  <p><strong>SSL :</strong> {TARGET_POSTGRES_CONFIG_V123.production.sslMode}</p>
                  <p><strong>Région :</strong> {TARGET_POSTGRES_CONFIG_V123.production.targetRegion}</p>
                  <p><strong>Réplicat Read :</strong> {TARGET_POSTGRES_CONFIG_V123.production.readReplicaAvailable ? 'Requis' : 'Non'}</p>
                </div>
                <p className="text-[11px] text-rose-800 font-sans">{TARGET_POSTGRES_CONFIG_V123.production.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 5: INFRASTRUCTURE AS CODE (IAC) */}
      {activeModule === 'IAC_TEMPLATES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  Modèles d'Infrastructure as Code (IaC) — Mode DRY-RUN
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fichiers déclaratifs prêts pour conteneurisation Cloud Run et provisionnement Terraform sans secrets embarqués.
                </p>
              </div>

              {copyFeedback && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {copyFeedback}
                </span>
              )}
            </div>

            {/* Sélecteur de templates */}
            <div className="flex flex-wrap gap-2">
              {iacArtifacts.map(art => (
                <button
                  key={art.id}
                  onClick={() => setSelectedIac(art)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
                    selectedIac.id === art.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{art.filename}</span>
                  {art.isDryRunOnly && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">
                      DRY-RUN
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Affichage du code source du template sélectionné */}
            <div className="rounded-lg bg-slate-900 border border-slate-800 text-slate-100 p-4 font-mono text-xs overflow-x-auto relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                <span>{selectedIac.description}</span>
                <button
                  onClick={() => copyToClipboard(selectedIac.content, `Fichier ${selectedIac.filename} copié !`)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white transition-colors text-[10px]"
                >
                  <Copy className="w-3 h-3" /> Copier
                </button>
              </div>
              <pre className="text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {selectedIac.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 6: LOGS STRUCTURÉS JSON */}
      {activeModule === 'LOGS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-600" />
                  Journalisation Structurée JSON (Format Cloud Logging)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Format standardisé avec <code>requestId</code>, horodatage ISO, anonymisation des PII et exclusion stricte des secrets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={logFilter}
                  onChange={e => setLogFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="ALL">Tous les niveaux ({logs.length})</option>
                  <option value="INFO">INFO uniquement</option>
                  <option value="WARN">WARN uniquement</option>
                  <option value="ERROR">ERROR uniquement</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {logs
                .filter(l => logFilter === 'ALL' || l.level === logFilter)
                .map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-1 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.level === 'INFO'
                              ? 'bg-blue-900 text-blue-200'
                              : log.level === 'WARN'
                              ? 'bg-amber-900 text-amber-200'
                              : 'bg-rose-900 text-rose-200'
                          }`}
                        >
                          {log.level}
                        </span>
                        <span className="text-slate-400">{log.timestamp}</span>
                        <span className="text-indigo-400 font-semibold">{log.service}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">ReqID: {log.requestId}</span>
                    </div>
                    <p className="text-slate-100 font-sans text-xs">{log.message}</p>
                    {log.metadata && (
                      <div className="p-2 rounded bg-slate-950/80 text-[10px] text-slate-400">
                        {JSON.stringify(log.metadata)}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* SOUS-MODULE 7: RAPPORT OFFICIEL V1.23 */}
      {activeModule === 'REPORT' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  RAPPORT D'AUDIT TECHNIQUE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  V1.23 CLOUD READINESS REPORT — ONE HEALTH MANIEMA
                </h3>
                <p className="text-xs text-slate-500">
                  Évaluation exhaustive de la préparation technique pour le déploiement sur Google Cloud (Région Johannesburg / africa-south1).
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(JSON.stringify(components, null, 2), 'Rapport JSON copié !')}
                className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Exporter Rapport JSON
              </button>
            </div>

            {/* Checklist de déploiement */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Checklist d'Exploitation & Déploiement Cloud
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-medium text-emerald-950">1. Conteneurisation sans état & Health Check</span>
                  <span className="font-bold text-emerald-700">🟢 READY</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-medium text-emerald-950">2. Moteur de synchronisation résilient & Offline</span>
                  <span className="font-bold text-emerald-700">🟢 READY</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-medium text-emerald-950">3. Journalisation JSON structurée & Request IDs</span>
                  <span className="font-bold text-emerald-700">🟢 READY</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-medium text-amber-950">4. Schéma PostgreSQL 16 & Migrations</span>
                  <span className="font-bold text-amber-700">🟠 PREPARED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-medium text-amber-950">5. Abstraction Stockage Objets (StorageProvider)</span>
                  <span className="font-bold text-amber-700">🟠 PREPARED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-medium text-amber-950">6. Modèles Terraform & Dockerfile DRY-RUN</span>
                  <span className="font-bold text-amber-700">🟠 PREPARED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-medium text-rose-950">7. Nom de Domaine Officiel & Zone DNS</span>
                  <span className="font-bold text-rose-700">🔴 NON CONFIGURÉ</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-medium text-rose-950">8. Certificat SSL/TLS sur domaine officiel</span>
                  <span className="font-bold text-rose-700">🔴 NON CONFIGURÉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
