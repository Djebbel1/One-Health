import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { analyzeMissingData } from '../../utils/harmonizationEngine';
import { MissingDataAnalysisRow } from '../../types';
import {
  HelpCircle,
  AlertTriangle,
  Activity,
  CloudSun,
  Layers,
  Home,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Info,
  Scale
} from 'lucide-react';

export const MissingDataSection: React.FC = () => {
  const {
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
  } = useData();

  const [selectedTable, setSelectedTable] = useState<'ALL' | 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const missingRows = useMemo(() => {
    return analyzeMissingData(
      healthRecords,
      climateRecords,
      environmentalObs,
      householdSurveys
    );
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys]);

  const filteredRows = useMemo(() => {
    return missingRows.filter(row => {
      if (selectedTable !== 'ALL' && row.table_name !== selectedTable) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchVar = row.variable_name.toLowerCase().includes(q);
        const matchTable = row.table_name.toLowerCase().includes(q);
        if (!matchVar && !matchTable) return false;
      }
      return true;
    });
  }, [missingRows, selectedTable, searchTerm]);

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'SANTE': return <Activity className="w-4 h-4 text-rose-600" />;
      case 'CLIMAT': return <CloudSun className="w-4 h-4 text-cyan-600" />;
      case 'ENVIRONNEMENT': return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'MENAGE': return <Home className="w-4 h-4 text-blue-600" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRateBadge = (rate: number) => {
    if (rate === 0) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">0% • Complet</span>;
    } else if (rate < 15) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">{rate}% • Faible</span>;
    } else if (rate < 40) {
      return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{rate}% • Modéré</span>;
    } else {
      return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">{rate}% • Élevé</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Analyse Scientifique des Données Manquantes
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Cartographie des lacunes par variable, identification des causes sous-jacentes et respect absolu de la règle de <strong>non-remplacement automatisé par zéro</strong>.
            </p>
          </div>
        </div>

        {/* Scientific Rule Reminder Box */}
        <div className="mt-4 p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Directive Méthodologique Fondamentale (V1.5) :</span>
            <p className="leading-relaxed">
              Une valeur absente pour la pluviométrie, un cas sanitaire ou un paramètre d assainissement correspond à une absence de mesure ou de déclaration, et <strong>ne doit jamais être convertie en valeur nulle (0)</strong>. La base intégrée préserve explicitement la valeur <code className="bg-amber-100 px-1 py-0.5 rounded">NULL</code>.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedTable('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedTable === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes les tables ({missingRows.length})
          </button>
          <button
            onClick={() => setSelectedTable('SANTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'SANTE' ? 'bg-rose-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Santé
          </button>
          <button
            onClick={() => setSelectedTable('CLIMAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'CLIMAT' ? 'bg-cyan-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            Climat
          </button>
          <button
            onClick={() => setSelectedTable('ENVIRONNEMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'ENVIRONNEMENT' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Environnement
          </button>
          <button
            onClick={() => setSelectedTable('MENAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'MENAGE' ? 'bg-blue-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Ménages
          </button>
        </div>
      </div>

      {/* Missing Analysis Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Variable Analysée</th>
                <th className="py-3 px-4 text-center">Effectif Total</th>
                <th className="py-3 px-4 text-center">Valeurs Manquantes</th>
                <th className="py-3 px-4 text-center">Taux Manquant</th>
                <th className="py-3 px-4">Raison Principale</th>
                <th className="py-3 px-4">Zone / Période Affectée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, idx) => (
                <tr key={`${row.table_name}-${row.variable_name}-${idx}`} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getTableIcon(row.table_name)}
                      <span className="font-semibold text-slate-800">{row.table_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {row.variable_name}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {row.total_records}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {row.missing_count}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getRateBadge(row.missing_rate_pct)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {row.primary_reason}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {row.affected_areas_or_periods || 'Non spécifié'}
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
