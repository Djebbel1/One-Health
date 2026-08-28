import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Info
} from 'lucide-react';
import { DataTransformationLogEntry } from '../../types';

interface TransformationAuditTabProps {
  logs: DataTransformationLogEntry[];
}

export const TransformationAuditTab: React.FC<TransformationAuditTabProps> = ({ logs }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(l => {
    const matchType = filterType === 'ALL' || l.transformationType === filterType;
    const matchSearch = l.originalVariable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.scientificJustification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.transformationDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Journal de Traçabilité & Audit des Transformations de Données
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Historique scellé de toutes les opérations appliquées aux données : agrégations temporelles, application de règles d'intégrité NULL strict, déclarations de proxies et exclusions motivées de modèles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Type d'opération :</span>
          {['ALL', 'AGREGATION_MENSUELLE', 'IMPUTATION_NULL_STRICT', 'DECLARATION_PROXY', 'EXCLUSION_MODELE'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                filterType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Toutes' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher dans le journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Événements de Transformation Enregistrés
          </h4>
          <span className="text-xs text-slate-500">{filteredLogs.length} entrée(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Horodatage</th>
                <th className="p-3">Type</th>
                <th className="p-3">Variable Source → Cible</th>
                <th className="p-3">Description de l'action</th>
                <th className="p-3">Justification Scientifique</th>
                <th className="p-3">Opérateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800 border">
                      {log.transformationType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{log.originalVariable}</div>
                    <div className="text-[10px] text-indigo-600 font-mono">→ {log.resultVariable}</div>
                  </td>
                  <td className="p-3 text-slate-700 max-w-xs">
                    {log.transformationDescription}
                  </td>
                  <td className="p-3 text-slate-700 max-w-sm italic">
                    « {log.scientificJustification} »
                  </td>
                  <td className="p-3 text-slate-600 font-medium whitespace-nowrap text-[11px]">
                    {log.performedBy}
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
