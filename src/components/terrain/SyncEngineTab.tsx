import React, { useState } from 'react';
import { SyncQueueItem, FieldDataConflict } from '../../types';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface SyncEngineTabProps {
  queue: SyncQueueItem[];
  conflicts: FieldDataConflict[];
  isOfflineMode: boolean;
  onExecuteSync: (simulateInterruption?: boolean) => Promise<{ successCount: number; errorCount: number; conflictCount: number }>;
  onOpenConflictResolver: (conflictId: string) => void;
  onRetryErrors: () => void;
}

export const SyncEngineTab: React.FC<SyncEngineTabProps> = ({
  queue,
  conflicts,
  isOfflineMode,
  onExecuteSync,
  onOpenConflictResolver,
  onRetryErrors
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncResult, setLastSyncResult] = useState<{
    successCount: number;
    errorCount: number;
    conflictCount: number;
    interrupted?: boolean;
  } | null>(null);

  const pendingCount = queue.filter((q) => q.status === 'PENDING').length;
  const errorCount = queue.filter((q) => q.status === 'ERROR').length;
  const conflictCount = queue.filter((q) => q.status === 'CONFLICT').length;

  const handleStartSync = async (simulateInterruption = false) => {
    setIsSyncing(true);
    setSyncProgress(20);
    setLastSyncResult(null);

    // Simulated progress steps
    setTimeout(() => setSyncProgress(60), 400);

    const result = await onExecuteSync(simulateInterruption);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setLastSyncResult({ ...result, interrupted: simulateInterruption });
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Cockpit de Synchronisation */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Synchronisation
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Traitement par Lots, Idempotence &amp; Zéro Perte</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Moteur de Synchronisation Sécurisée
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Transmission incrémentale montante des formulaires locaux vers la base centrale avec arbitrage des divergences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleStartSync(true)}
            disabled={isSyncing || isOfflineMode}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            title="Tester la résilience en cas de coupure soudaine de réseau"
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            <span>Simuler Coupure Réseau</span>
          </button>

          <button
            onClick={() => handleStartSync(false)}
            disabled={isSyncing || isOfflineMode}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser Maintenant'}</span>
          </button>
        </div>
      </div>

      {/* Cartes Métriques de la File d'Attente */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              En Attente d Envoi
            </span>
            <span className="text-xl font-mono font-bold text-blue-900 block">
              {pendingCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Synchronisés Serveur
            </span>
            <span className="text-xl font-mono font-bold text-emerald-900 block">
              {queue.filter((q) => q.status === 'SUCCESS').length + 2}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Conflits à Arbitrer
            </span>
            <span className="text-xl font-mono font-bold text-amber-900 block">
              {conflictCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Échecs Réseau
            </span>
            <span className="text-xl font-mono font-bold text-rose-900 block">
              {errorCount}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de Progression Synchronisation */}
      {isSyncing && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-3xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-teal-900">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-700" />
              <span>Transfert chiffré par lots de 50 éléments en cours...</span>
            </div>
            <span className="font-mono">{syncProgress}%</span>
          </div>
          <div className="w-full h-2 bg-teal-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-300 rounded-full"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Résultat Détaillé Récent (Rapport Partiel Conforme) */}
      {lastSyncResult && (
        <div className={`p-4 rounded-3xl border text-xs space-y-2 ${
          lastSyncResult.interrupted
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center justify-between">
            <strong className="font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lastSyncResult.interrupted
                  ? '⚠️ Synchronisation Partiellement Interrompue (Reprise Garantie)'
                  : '✅ Bilan de la Dernière Synchronisation :'}
              </span>
            </strong>
            <span className="text-[10px] font-mono text-slate-500">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          <p className="text-[11px] leading-relaxed">
            {lastSyncResult.successCount} formulaires confirmés sur le serveur central • {lastSyncResult.conflictCount} conflit(s) détecté(s) • {lastSyncResult.errorCount} reporté(s) pour la prochaine session.
          </p>
        </div>
      )}

      {/* Tableau de la File d'Attente de Synchronisation */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            File d Attente Active ({queue.length} éléments)
          </h3>
          {errorCount > 0 && (
            <button
              onClick={onRetryErrors}
              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition"
            >
              Réessayer les erreurs ({errorCount})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">ID Local</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Enquêteur</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Horodatage</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Statut Synchro</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Détails / Diagnostic</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 font-mono font-bold text-teal-900">
                    {item.localId}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {item.enumeratorId}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {item.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    {item.status === 'PENDING' && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">
                        En Attente
                      </span>
                    )}
                    {item.status === 'SUCCESS' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                        Synchronisé
                      </span>
                    )}
                    {item.status === 'CONFLICT' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                        Conflit Détecté
                      </span>
                    )}
                    {item.status === 'ERROR' && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded">
                        Échec Réseau
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-500 max-w-xs truncate">
                    {item.errorReason || `Lot prêt (~${item.payloadSizeKb} KB)`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.status === 'CONFLICT' && (
                      <button
                        onClick={() => onOpenConflictResolver(item.localId)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
                      >
                        Résoudre Conflit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
