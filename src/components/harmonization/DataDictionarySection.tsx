import React, { useState, useMemo } from 'react';
import { GLOBAL_DATA_DICTIONARY } from '../../data/harmonizationData';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Tag,
  Layers,
  Activity,
  CloudSun,
  Home,
  MapPin,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

export const DataDictionarySection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = useMemo(() => {
    return GLOBAL_DATA_DICTIONARY.filter(item => {
      if (selectedDomain !== 'ALL') {
        const tableUpper = item.table.toUpperCase();
        if (selectedDomain === 'SANTE' && !tableUpper.includes('HEALTH')) return false;
        if (selectedDomain === 'CLIMAT' && !tableUpper.includes('CLIMATE')) return false;
        if (selectedDomain === 'ENVIRONNEMENT' && !tableUpper.includes('ENVIRON')) return false;
        if (selectedDomain === 'MENAGE' && !tableUpper.includes('HOUSEHOLD')) return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchVar = item.variable_name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchType = item.type.toLowerCase().includes(q);
        if (!matchVar && !matchDesc && !matchType) return false;
      }
      return true;
    });
  }, [selectedDomain, searchTerm]);

  const getDomainIcon = (table: string) => {
    const t = table.toLowerCase();
    if (t.includes('health')) return <Activity className="w-4 h-4 text-rose-600" />;
    if (t.includes('climate')) return <CloudSun className="w-4 h-4 text-cyan-600" />;
    if (t.includes('environ')) return <Layers className="w-4 h-4 text-emerald-600" />;
    if (t.includes('household') || t.includes('survey')) return <Home className="w-4 h-4 text-blue-600" />;
    return <BookOpen className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Dictionnaire Global des Variables (V1.5 One Health Kindu)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Nomenclature standardisée, définitions scientifiques, types de données, unités de mesure et résolutions spatio-temporelles des 4 familles de données.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          {[
            { id: 'ALL', label: 'Toutes les variables', count: GLOBAL_DATA_DICTIONARY.length },
            { id: 'SANTE', label: 'Santé', count: GLOBAL_DATA_DICTIONARY.filter(d => d.table.includes('health')).length },
            { id: 'CLIMAT', label: 'Climat', count: GLOBAL_DATA_DICTIONARY.filter(d => d.table.includes('climate')).length },
            { id: 'ENVIRONNEMENT', label: 'Environnement', count: GLOBAL_DATA_DICTIONARY.filter(d => d.table.includes('environ')).length },
            { id: 'MENAGE', label: 'Ménages', count: GLOBAL_DATA_DICTIONARY.filter(d => d.table.includes('household')).length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDomain === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex justify-between items-center">
        <span className="text-xs text-slate-500">
          Affichage de <strong>{filteredItems.length}</strong> variables documentées
        </span>
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher nom, type ou définition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Dictionary Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Table / Domaine</th>
                <th className="py-3 px-4">Nom de la Variable</th>
                <th className="py-3 px-4">Définition & Rôle Scientifique</th>
                <th className="py-3 px-4">Type & Format</th>
                <th className="py-3 px-4">Unité / Valeurs Admissibles</th>
                <th className="py-3 px-4">Résolution Spatiale & Temporelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, idx) => (
                <tr key={`${item.table}-${item.variable_name}-${idx}`} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getDomainIcon(item.table)}
                      <span className="font-bold text-slate-800 text-[11px] uppercase font-mono">{item.table.replace('_records', '').replace('_surveys', '')}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {item.variable_name}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-xs leading-relaxed">
                    {item.description}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {item.unit || item.allowed_values || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {item.spatial_resolution} &bull; {item.temporal_resolution}
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
