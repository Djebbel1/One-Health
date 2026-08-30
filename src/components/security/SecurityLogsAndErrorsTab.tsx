import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Download,
  Clock,
  Eye,
  RefreshCw,
  Terminal,
  Activity
} from 'lucide-react';
import {
  SecurityAuditLogEntry,
  CentralSystemError,
  UserRole
} from '../../types';

interface SecurityLogsAndErrorsTabProps {
  securityLogs: SecurityAuditLogEntry[];
  centralErrors: CentralSystemError[];
  currentUserRole: UserRole;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const SecurityLogsAndErrorsTab: React.FC<SecurityLogsAndErrorsTabProps> = ({
  securityLogs,
  centralErrors,
  currentUserRole,
  onAddSecurityLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'LOGS' | 'ERRORS'>('LOGS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredLogs = securityLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (sev: SecurityAuditLogEntry['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 font-mono">
            CRITIQUE
          </span>
        );
      case 'ERROR':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            ERREUR
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
            AVERTISSEMENT
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/90 rounded-2xl max-w-md border border-slate-200">
        <button
          onClick={() => setActiveSubTab('LOGS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'LOGS'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
          Journal de Sécurité Dédié ({securityLogs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('ERRORS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ERRORS'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-500" />
          Incidents & Erreurs Sanitisées ({centralErrors.length})
        </button>
      </div>

      {/* SubTab 1: Security Audit Logs */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                Journal d Événements de Sécurité (SECURITY_LOG)
              </h3>
              <p className="text-xs text-slate-500">
                Traçabilité immuable des connexions, privilèges, exports et sauvegardes (V1.20)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Sanitisation Active (0 Secret Exposé)
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par action, utilisateur, IP, cible..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
            >
              <option value="ALL">Toutes les sévérités</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">AVERTISSEMENT</option>
              <option value="ERROR">ERREUR</option>
              <option value="CRITICAL">CRITIQUE</option>
            </select>
          </div>

          {/* Logs List */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden font-mono text-xs">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-sans">
                Aucun événement de sécurité ne correspond aux filtres.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-3.5 bg-white hover:bg-slate-50 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(log.severity)}
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-400">({log.resourceTarget})</span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-sans">
                      {log.timestamp} • <strong className="text-slate-700">{log.userName}</strong> ({log.userRole})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                    {log.details}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>IP : {log.ipAddress} • Env : {log.environment}</span>
                    <span className="text-emerald-700 font-bold">✓ Immuable & Sanitisé</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SubTab 2: Central Errors & Incidents Registry */}
      {activeSubTab === 'ERRORS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                Registre Centralisé des Incidents & Codes Erreurs Sanitisés
              </h3>
              <p className="text-xs text-slate-500">
                Messages utilisateurs explicites sans fuite de stack trace technique (V1.20)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {centralErrors.map((err) => (
              <div
                key={err.errorId}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {err.errorId}
                    </span>
                    {getSeverityBadge(err.severity)}
                    <strong className="text-slate-900">{err.module}</strong>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      err.resolutionStatus === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {err.resolutionStatus === 'RESOLVED' ? '✓ Résolu' : 'En cours d analyse'}
                  </span>
                </div>

                <p className="text-slate-800 font-medium text-[11px] leading-relaxed">
                  {err.userMessage}
                </p>

                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600 flex items-center justify-between">
                  <span>Code Sanitisé : {err.sanitizedTechnicalCode}</span>
                  {err.reportedBy && <span>Source : {err.reportedBy}</span>}
                </div>

                {err.remedyAction && (
                  <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Action Corrective : {err.remedyAction}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
