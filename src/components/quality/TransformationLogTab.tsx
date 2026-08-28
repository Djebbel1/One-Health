import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  FileCode,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const TransformationLogTab: React.FC = () => {
  const { transformationLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredLogs = transformationLogs.filter(log => {
    const matchesSearch =
      log.source_record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'ALL' || log.transformation_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* DIRECTIVE D'IMMUTABILITÉ & TRAÇABILITÉ (Sections 43, 44, 45, 75) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Principe d'Immuabilité de RAW_DATA &amp; Journalisation Complète</span>
          </h3>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
            Audit Trail Intégral V1.8
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          La table brute <code className="font-mono bg-slate-800 text-teal-300 px-1 py-0.5 rounded">RAW_DATA</code> ne subit jamais de mise à jour destructrice directe. Chaque étape de normalisation, de recalcul d'incidence, d'arbitrage de doublon ou de standardisation spatiale génère un enregistrement dans <code className="font-mono bg-slate-800 text-teal-300 px-1 py-0.5 rounded">TRANSFORMATION_LOG</code> contenant l'ancienne valeur, la nouvelle valeur, l'auteur, l'horodatage et le statut de réversibilité.
        </p>
      </div>

      {/* RECHERCHE ET FILTRES DU JOURNAL */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-teal-600" />
              <span>Journal des Transformations (TRANSFORMATION_LOG) ({filteredLogs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historique inaltérable de tous les traitements appliqués pour construire CLEAN_DATA et ANALYSIS_DATASET.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrer par motif, ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="ALL">Tous les types de transformation</option>
              <option value="NORMALISATION_GEO">NORMALISATION_GEO</option>
              <option value="NORMALISATION_DATE">NORMALISATION_DATE</option>
              <option value="CALCUL_INCIDENCE">CALCUL_INCIDENCE</option>
              <option value="CALCUL_LAG">CALCUL_LAG</option>
              <option value="DOUBLON_TRAITEMENT">DOUBLON_TRAITEMENT</option>
              <option value="AGREGATION_SPATIO_TEMPORELLE">AGREGATION_SPATIO_TEMPORELLE</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">ID Log</th>
                <th className="p-2.5 font-bold">ID Enreg. Source</th>
                <th className="p-2.5 font-bold">Type d'Opération</th>
                <th className="p-2.5 font-bold">Ancienne Valeur</th>
                <th className="p-2.5 font-bold">Nouvelle Valeur</th>
                <th className="p-2.5 font-bold">Motif / Justification</th>
                <th className="p-2.5 font-bold">Opérateur &amp; Date</th>
                <th className="p-2.5 font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log, idx) => (
                <tr key={log.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2.5 font-mono text-[10px] font-bold text-slate-900">{log.id}</td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-600">{log.source_record_id}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                      {log.transformation_type}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-rose-700 bg-rose-50/50">
                    {log.old_value || 'NULL'}
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-emerald-700 bg-emerald-50/50">
                    {log.new_value || 'NULL'}
                  </td>
                  <td className="p-2.5 text-slate-700 text-[11px]">{log.reason}</td>
                  <td className="p-2.5 text-slate-500 text-[10px]">
                    <div>{log.performed_by}</div>
                    <div>{log.performed_at}</div>
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      {log.validation_status}
                    </span>
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
