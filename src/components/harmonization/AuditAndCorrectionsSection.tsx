import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { DataCorrectionLog } from '../../types';
import {
  FileText,
  RotateCcw,
  CheckCircle2,
  Trash2,
  History,
  ShieldCheck,
  Search,
  User,
  Calendar,
  AlertTriangle,
  Activity,
  CloudSun,
  Layers,
  Home
} from 'lucide-react';

export const AuditAndCorrectionsSection: React.FC = () => {
  const {
    dataCorrections,
    auditLogs,
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    restoreDeletedRecord,
    userSession,
  } = useData();

  const [activeTab, setActiveTab] = useState<'CORRECTIONS' | 'DELETED_RECORDS' | 'AUDIT_TRAIL'>('CORRECTIONS');
  const [searchTerm, setSearchTerm] = useState('');

  // Deleted records aggregation
  const deletedRecords = useMemo(() => {
    const list: Array<{
      table: 'HEALTH' | 'CLIMATE' | 'ENV' | 'SURVEY';
      id: string;
      title: string;
      reason?: string;
      deletedAt?: string;
    }> = [];

    healthRecords.filter(r => r.is_deleted).forEach(h => {
      list.push({
        table: 'HEALTH',
        id: h.id,
        title: `Santé • ${h.disease_type} (${h.period_month}/${h.period_year}) - ${h.health_area}`,
        reason: 'Doublon ou invalidation clinique',
      });
    });

    climateRecords.filter(r => r.is_deleted).forEach(c => {
      list.push({
        table: 'CLIMATE',
        id: c.id,
        title: `Climat • ${c.station_name} (${c.month ?? 'Annuel'}/${c.year})`,
        reason: 'Série redondante',
      });
    });

    environmentalObs.filter(r => r.is_deleted).forEach(e => {
      list.push({
        table: 'ENV',
        id: e.id,
        title: `Environnement • ${e.site_name} (${e.observation_date})`,
        reason: 'Fiche obsolète',
      });
    });

    householdSurveys.filter(r => r.is_deleted).forEach(m => {
      list.push({
        table: 'SURVEY',
        id: m.id,
        title: `Ménage • ${m.household_code} (${m.survey_date})`,
        reason: 'Enquête doublon',
      });
    });

    return list;
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys]);

  const filteredCorrections = useMemo(() => {
    return dataCorrections.filter(c => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          c.record_id.toLowerCase().includes(q) ||
          c.field_name.toLowerCase().includes(q) ||
          c.table_name.toLowerCase().includes(q) ||
          c.reason.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dataCorrections, searchTerm]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(a => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          a.recordId.toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q) ||
          a.userName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Journal des Corrections & Traçabilité (Audit Log)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Historisation immuable de chaque modification, ancienne/nouvelle valeur, justification scientifique et restauration des fiches supprimées logiquement.
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('CORRECTIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'CORRECTIONS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Corrections Manuelles ({dataCorrections.length})
          </button>
          <button
            onClick={() => setActiveTab('DELETED_RECORDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'DELETED_RECORDS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Corbeille Logique / Archivés ({deletedRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'AUDIT_TRAIL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Journal Complet des Événements ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Corrections */}
      {activeTab === 'CORRECTIONS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Code Correction</th>
                    <th className="py-3 px-4">Table & Fiche</th>
                    <th className="py-3 px-4">Champ Modifié</th>
                    <th className="py-3 px-4">Ancienne Valeur</th>
                    <th className="py-3 px-4">Nouvelle Valeur</th>
                    <th className="py-3 px-4">Justification Scientifique</th>
                    <th className="py-3 px-4">Auteur & Date</th>
                    <th className="py-3 px-4 text-center">Version</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCorrections.map((corr) => (
                    <tr key={corr.correction_id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">
                        {corr.correction_id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block font-mono">{corr.record_id}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{corr.table_name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {corr.field_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-rose-600 bg-rose-50/50">
                        {corr.old_value !== null ? String(corr.old_value) : 'NULL'}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-600 bg-emerald-50/50 font-bold">
                        {corr.new_value !== null ? String(corr.new_value) : 'NULL'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {corr.reason}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span className="font-medium text-slate-800 block">{corr.corrected_by}</span>
                        <span className="text-[10px]">{new Date(corr.corrected_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                          v{corr.record_version}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Deleted records */}
      {activeTab === 'DELETED_RECORDS' && (
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div>
              <span className="font-bold block">Conservation et Suppression Logique (is_deleted = true)</span>
              <span>Les enregistrements supprimés ne sont jamais effacés physiquement et restent restaurables à tout moment.</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Identifiant Fiche</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Description & Contexte</th>
                    <th className="py-3 px-4">Motif de Désactivation</th>
                    <th className="py-3 px-4 text-right">Restauration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deletedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Aucun enregistrement archivé ou supprimé logiquement.
                      </td>
                    </tr>
                  ) : (
                    deletedRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-rose-700">
                          {item.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            {item.table}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {item.reason}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => restoreDeletedRecord(item.table, item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition border border-teal-200"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Restaurer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Global Audit Trail */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Horodatage</th>
                  <th className="py-3 px-4">Utilisateur & Rôle</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entité / Cible</th>
                  <th className="py-3 px-4">Détails / Motif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{log.userName}</span>
                      <span className="text-[10px] text-slate-400">{log.userRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.action === 'CREATE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'UPDATE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {log.recordIdentifier || log.recordId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.reason || 'Opération système'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
