import React, { useState } from 'react';
import { FieldAuditLogEntry } from '../../types';
import {
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface FieldAuditTabProps {
  auditLogs: FieldAuditLogEntry[];
}

export const FieldAuditTab: React.FC<FieldAuditTabProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.localId && log.localId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEvent = eventTypeFilter === 'ALL' || log.eventType === eventTypeFilter;

    return matchesSearch && matchesEvent;
  });

  const handleExportCSV = () => {
    const headers = ['ID,Horodatage,Type_Evenement,Entite,ID_Entite,ID_Local,Utilisateur,Role,Description'];
    const rows = filteredLogs.map((l) =>
      `"${l.id}","${l.timestamp}","${l.eventType}","${l.entityType}","${l.entityId}","${l.localId || ''}","${l.userName}","${l.userRole}","${l.description.replace(/"/g, '""')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `journal_audit_terrain_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'VERROUILLAGE':
        return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">🔒 Verrouillage</span>;
      case 'DEVERROUILLAGE':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">🔓 Déverrouillage</span>;
      case 'VALIDATION_SUPERVISEUR':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">✅ Validation</span>;
      case 'SYNCHRONISATION_REUSSIE':
        return <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded">🔄 Synchro OK</span>;
      case 'DETECTION_CONFLIT':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">⚠️ Conflit</span>;
      case 'ERREUR_SYNCHRONISATION':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">🔴 Erreur Synchro</span>;
      case 'CONTROLE_QUALITE':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">🔬 Contrôle Qualité</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Barre d'Action */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Audit &amp; Traçabilité
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Journal Immuable des Événements Terrain</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Journal d Audit &amp; Historique des Opérations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Traçabilité intégrale : créations, captures GPS, tentatives de synchronisation, arbitrages et déverrouillages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher dans l audit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 w-52"
            />
          </div>

          {/* Filtre Type */}
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="ALL">Tous les événements</option>
            <option value="VERROUILLAGE">Verrouillages</option>
            <option value="DEVERROUILLAGE">Déverrouillages</option>
            <option value="VALIDATION_SUPERVISEUR">Validations</option>
            <option value="SYNCHRONISATION_REUSSIE">Synchro Réussie</option>
            <option value="DETECTION_CONFLIT">Conflits</option>
            <option value="CONTROLE_QUALITE">Contrôles Qualité</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tableau Journal d'Audit */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Horodatage</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Événement</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Entité / ID</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Auteur &amp; Rôle</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Description &amp; Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    {getEventBadge(log.eventType)}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-teal-900">
                    {log.localId || log.entityId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 block">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.userRole}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 leading-relaxed max-w-md">
                    {log.description}
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
