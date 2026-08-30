import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  Download,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCode,
  Lock,
  Clock,
  HardDrive,
  Copy,
  Check
} from 'lucide-react';
import {
  BackupRecord,
  EnvironmentType,
  UserRole
} from '../../types';

interface BackupCenterTabProps {
  backups: BackupRecord[];
  activeEnvironment: EnvironmentType;
  currentUserRole: UserRole;
  currentUserName: string;
  onCreateBackup: (name: string, type: BackupRecord['backupType']) => void;
  onVerifyBackupIntegrity: (backupId: string) => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const BackupCenterTab: React.FC<BackupCenterTabProps> = ({
  backups,
  activeEnvironment,
  currentUserRole,
  currentUserName,
  onCreateBackup,
  onVerifyBackupIntegrity,
  onAddSecurityLog
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBackupName, setNewBackupName] = useState('');
  const [newBackupType, setNewBackupType] = useState<BackupRecord['backupType']>('MANUAL');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedBackupForDetails, setSelectedBackupForDetails] = useState<BackupRecord | null>(null);

  const handleCreate = () => {
    if (!newBackupName.trim()) {
      alert('Veuillez spécifier un nom descriptif pour la sauvegarde.');
      return;
    }

    onCreateBackup(newBackupName, newBackupType);
    setShowCreateModal(false);
    setNewBackupName('');
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Snapshot Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Database className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Centre des Sauvegardes & Registre Cryptographique (SHA-256)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stratégie de sauvegarde 3-2-1, scellement des archives et vérification d intégrité (V1.20)
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            Créer un Snapshot Immédiat
          </button>
        </div>

        {/* 3-2-1 Strategy Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              1. Quotidien Automatique
            </span>
            <p className="text-slate-600 text-[11px]">
              Snapshot incrémental chaque nuit à 04h00 UTC+2. Rétention glissante de 30 jours.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              2. Hebdomadaire Consolidé
            </span>
            <p className="text-slate-600 text-[11px]">
              Archive complète hebdomadaire chaque dimanche. Rétention 90 jours avec signature SHA-256.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-600" />
              3. Chiffrement AES-256
            </span>
            <p className="text-slate-600 text-[11px]">
              Toutes les archives sont chiffrées au repos et testées dans l environnement STAGING.
            </p>
          </div>
        </div>
      </div>

      {/* Backups List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal-600" />
            Registre des Sauvegardes Disponibles ({backups.length})
          </h4>

          <span className="text-xs font-mono text-slate-500">
            Source : {activeEnvironment}
          </span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {backups.map((bkp) => {
            const isVerified = bkp.verificationStatus === 'PASSED';
            const sizeMb = (bkp.fileSizeBytes / (1024 * 1024)).toFixed(1);

            return (
              <div key={bkp.backupId} className="p-4 bg-white hover:bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                        {bkp.backupId}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          bkp.backupType === 'SCHEDULED_DAILY'
                            ? 'bg-sky-100 text-sky-800'
                            : bkp.backupType === 'SCHEDULED_WEEKLY'
                            ? 'bg-indigo-100 text-indigo-800'
                            : bkp.backupType === 'PRE_MIGRATION_SNAPSHOT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {bkp.backupType}
                      </span>
                      <strong className="text-xs text-slate-900">{bkp.name}</strong>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Créé le {bkp.createdAt} par <span className="font-medium text-slate-700">{bkp.createdBy}</span> • Taille : {sizeMb} MB • Rétention : {bkp.retentionDays}j
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                        isVerified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isVerified ? 'Intégrité SHA-256 Certifiée' : 'Non Vérifié'}
                    </span>

                    <button
                      onClick={() => onVerifyBackupIntegrity(bkp.backupId)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
                      title="Re-contrôler le SHA-256"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedBackupForDetails(bkp)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                    >
                      Détails Tables
                    </button>
                  </div>
                </div>

                {/* SHA-256 Hash Display */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[10px] font-mono flex items-center justify-between gap-2 text-slate-600">
                  <div className="truncate flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-700">SHA-256 :</span>
                    <span className="truncate">{bkp.sha256Hash}</span>
                  </div>

                  <button
                    onClick={() => handleCopyHash(bkp.sha256Hash)}
                    className="p-1 text-slate-500 hover:text-indigo-600 shrink-0"
                    title="Copier le hash"
                  >
                    {copiedHash === bkp.sha256Hash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" />
                Générer un Snapshot Immédiat
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nom du Snapshot :
                </label>
                <input
                  type="text"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                  placeholder="Ex: Snapshot Pré-Campagne Kindu 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Type de Sauvegarde :</label>
                <select
                  value={newBackupType}
                  onChange={(e) => setNewBackupType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                >
                  <option value="MANUAL">Sauvegarde Manuelle d Archive</option>
                  <option value="PRE_MIGRATION_SNAPSHOT">Snapshot Pré-Migration de Données</option>
                  <option value="SCHEDULED_DAILY">Sauvegarde Quotidienne</option>
                  <option value="SCHEDULED_WEEKLY">Sauvegarde Hebdomadaire</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Toutes les tables (projets, protocoles, enquêtes, dictionnaires, validations, modèles) seront scellées avec calcul d empreinte SHA-256.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-xs font-bold bg-teal-700 text-white rounded-xl hover:bg-teal-800"
              >
                Créer & Sceller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Backup Modal */}
      {selectedBackupForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-700" />
                Détail de l Archive : {selectedBackupForDetails.backupId}
              </h3>
              <button
                onClick={() => setSelectedBackupForDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Projets One Health</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.projects}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Datasets Analytiques</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.datasets}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Fiches d Enquêtes</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.surveys}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Modèles Validés</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.models}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Protocoles Scellés</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.protocols}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500">Validations Qualité</span>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedBackupForDetails.recordCounts.validations}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tables Incluses dans l Image :
                </label>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {selectedBackupForDetails.tablesIncluded.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBackupForDetails(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
