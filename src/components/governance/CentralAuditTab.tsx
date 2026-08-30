import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  ShieldCheck,
  Hash,
  Sparkles,
  Layers
} from 'lucide-react';
import { AuditLogEntry, AuditActionType } from '../../types';

interface CentralAuditTabProps {
  logs: AuditLogEntry[];
  activeProjectId: string;
}

export const CentralAuditTab: React.FC<CentralAuditTabProps> = ({ logs, activeProjectId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('TOUS');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.logId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'TOUS' || log.actionType === selectedAction;
    return matchesSearch && matchesAction;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `journal_audit_gouvernance_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadgeColor = (action: AuditActionType) => {
    if (action.includes('CREATION') || action.includes('VALIDATION')) return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    if (action.includes('MODIFICATION') || action.includes('AMENDEMENT') || action.includes('CORRECTION')) return 'bg-amber-100 text-amber-900 border-amber-200';
    if (action.includes('REJET') || action.includes('SUPPRESSION') || action.includes('DOUBLON')) return 'bg-rose-100 text-rose-900 border-rose-200';
    return 'bg-teal-50 text-teal-800 border-teal-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <FileText className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Journal Central d Audit Immuable (Audit Trail)</h3>
            <p className="text-xs text-slate-500">
              Registre exhaustif et certifié de toutes les opérations scientifiques, techniques et administratives
            </p>
          </div>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all self-stretch md:self-auto"
        >
          <Download className="w-4 h-4" />
          Exporter le Journal (JSON)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer par description, utilisateur ou référence log..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
          <option value="TOUS">Toutes les Actions d Audit</option>
          <option value="CREATION_PROJET">Créations de Projets</option>
          <option value="AMENDEMENT_PROTOCOLE">Amendements Protocoles</option>
          <option value="CREATION_SNAPSHOT">Snapshots Immutables</option>
          <option value="VALIDATION_ETAPE">Validations Fiches</option>
          <option value="CORRECTION_VALEUR">Corrections de Données</option>
          <option value="REPRODUCTION_MODELE">Reproduction de Modèles</option>
          <option value="SUPPRESSION_LOGIQUE_FICHE">Suppressions Logiques</option>
        </select>
      </div>

      {/* Audit Logs List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Événements Enregistrés ({filteredLogs.length})
          </span>
          <span className="text-[11px] font-mono text-slate-400">Scellement Temporel Automatique</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Aucun événement ne correspond aux critères de filtre.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => (
              <div
                key={log.logId}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/70 transition-all rounded-xl border border-slate-200/80 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border">
                      {log.logId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getActionBadgeColor(log.actionType)}`}>
                      {log.actionType.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[10px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                      {log.projectId}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
                </div>

                <p className="text-slate-800 font-medium">
                  {log.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                  <span>Auteur : <strong>{log.userName}</strong> ({log.userRole})</span>
                  {log.details && (
                    <span className="font-mono text-[10px] text-slate-400">
                      Détails : {JSON.stringify(log.details)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
