import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Layers,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  FileSpreadsheet,
  ChevronRight,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';
import { exportToCSV } from '../../utils/exportUtils';

export const TableExplorerView: React.FC = () => {
  const {
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
    householdAggregates,
    integratedSpatiotemporalData,
    dataSources,
  } = useData();

  type TableKey =
    | 'SPATIOTEMPORAL_UNIT'
    | 'HEALTH_SPATIOTEMPORAL'
    | 'CLIMATE_SPATIOTEMPORAL'
    | 'ENVIRONMENT_SPATIOTEMPORAL'
    | 'WASH_SPATIOTEMPORAL'
    | 'HOUSEHOLD_AGGREGATE'
    | 'INTEGRATED_SPATIOTEMPORAL_DATA'
    | 'DATA_SOURCE';

  const [activeTable, setActiveTable] = useState<TableKey>('SPATIOTEMPORAL_UNIT');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Table options definition
  const tableDefinitions = [
    { key: 'SPATIOTEMPORAL_UNIT' as TableKey, label: 'SPATIOTEMPORAL_UNIT', count: spatiotemporalUnits.length, desc: 'Unités primaires d\'agrégation (Aire × Mois)' },
    { key: 'HEALTH_SPATIOTEMPORAL' as TableKey, label: 'HEALTH_SPATIOTEMPORAL', count: healthSpatiotemporal.length, desc: 'Cas agrégés distincts Paludisme / Typhoïde' },
    { key: 'CLIMATE_SPATIOTEMPORAL' as TableKey, label: 'CLIMATE_SPATIOTEMPORAL', count: climateSpatiotemporal.length, desc: 'Relevés météo synoptiques & Lags M-1, M-2' },
    { key: 'ENVIRONMENT_SPATIOTEMPORAL' as TableKey, label: 'ENVIRONMENT_SPATIOTEMPORAL', count: environmentSpatiotemporal.length, desc: 'Observations diachroniques avec fenêtres de validité' },
    { key: 'WASH_SPATIOTEMPORAL' as TableKey, label: 'WASH_SPATIOTEMPORAL', count: washSpatiotemporal.length, desc: 'Indicateurs Eau & Assainissement par unité' },
    { key: 'HOUSEHOLD_AGGREGATE' as TableKey, label: 'HOUSEHOLD_AGGREGATE', count: householdAggregates.length, desc: 'Taux agrégés des enquêtes ménages' },
    { key: 'INTEGRATED_SPATIOTEMPORAL_DATA' as TableKey, label: 'INTEGRATED_SPATIOTEMPORAL_DATA', count: integratedSpatiotemporalData.length, desc: 'Matrice multidimensionnelle intégrée Y(s,t)' },
    { key: 'DATA_SOURCE' as TableKey, label: 'DATA_SOURCE', count: dataSources.length, desc: 'Répertoire et traçabilité des sources officielles' },
  ];

  // Get active raw data
  const currentTableData = useMemo(() => {
    switch (activeTable) {
      case 'SPATIOTEMPORAL_UNIT': return spatiotemporalUnits;
      case 'HEALTH_SPATIOTEMPORAL': return healthSpatiotemporal;
      case 'CLIMATE_SPATIOTEMPORAL': return climateSpatiotemporal;
      case 'ENVIRONMENT_SPATIOTEMPORAL': return environmentSpatiotemporal;
      case 'WASH_SPATIOTEMPORAL': return washSpatiotemporal;
      case 'HOUSEHOLD_AGGREGATE': return householdAggregates;
      case 'INTEGRATED_SPATIOTEMPORAL_DATA': return integratedSpatiotemporalData;
      case 'DATA_SOURCE': return dataSources;
      default: return [];
    }
  }, [
    activeTable,
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
    householdAggregates,
    integratedSpatiotemporalData,
    dataSources,
  ]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return currentTableData.filter((row: any) => {
      // Filter year
      if (filterYear !== 'ALL') {
        const yearVal = row.year ?? row.annee ?? (row.spatiotemporal_unit_id ? row.spatiotemporal_unit_id.split('-')[1] : null);
        if (yearVal && String(yearVal) !== filterYear) return false;
      }

      // Filter area
      if (filterArea !== 'ALL') {
        const areaVal = row.aire_sante_id ?? (row.spatiotemporal_unit_id ? row.spatiotemporal_unit_id.split('-')[0] : null);
        if (areaVal && areaVal !== filterArea) return false;
      }

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const jsonStr = JSON.stringify(row).toLowerCase();
        if (!jsonStr.includes(query)) return false;
      }

      return true;
    });
  }, [currentTableData, filterYear, filterArea, searchQuery]);

  // Dynamic table columns based on the current table
  const columns = useMemo(() => {
    if (filteredData.length === 0) return [];
    return Object.keys(filteredData[0]).filter(k => k !== 'id' && !k.startsWith('_'));
  }, [filteredData]);

  const handleExportCsv = () => {
    exportToCSV(filteredData, `ONE_HEALTH_KINDU_${activeTable}`);
  };

  return (
    <div className="space-y-6">
      {/* Table Selector Pills */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {tableDefinitions.map(t => (
            <button
              key={t.key}
              id={`tab-table-${t.key}`}
              onClick={() => {
                setActiveTable(t.key);
                setSelectedRecord(null);
              }}
              className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                activeTable === t.key
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{t.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTable === t.key ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] max-w-md flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-table"
              type="text"
              placeholder="Rechercher dans les colonnes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Year Filter */}
          {activeTable !== 'DATA_SOURCE' && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                id="select-table-year"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="ALL">Toutes Années</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          )}

          {/* Area Filter */}
          {activeTable !== 'DATA_SOURCE' && activeTable !== 'CLIMATE_SPATIOTEMPORAL' && (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <select
                id="select-table-area"
                value={filterArea}
                onChange={e => setFilterArea(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="ALL">Toutes les Aires</option>
                {KINDU_HEALTH_AREAS.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Export Table CSV button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-table-csv"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exporter CSV ({filteredData.length})</span>
          </button>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-900">{activeTable}</span>
            <span className="text-[11px] text-slate-500">
              — {tableDefinitions.find(t => t.key === activeTable)?.desc}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-mono font-medium">
            {filteredData.length} enregistrements affichés
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3"># ID</th>
                {columns.slice(0, 10).map(col => (
                  <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                    {col.toUpperCase()}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredData.length > 0 ? (
                filteredData.slice(0, 100).map((row: any, idx: number) => (
                  <tr
                    key={row.id || idx}
                    onClick={() => setSelectedRecord(row)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-2 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.id || row.spatiotemporal_unit_id || `ROW-${idx + 1}`}
                    </td>
                    {columns.slice(0, 10).map(col => {
                      const val = row[col];
                      return (
                        <td key={col} className="py-2 px-3 whitespace-nowrap">
                          {val === null || val === undefined ? (
                            <span className="inline-block px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-400 font-mono text-[10px]">
                              NULL
                            </span>
                          ) : typeof val === 'boolean' ? (
                            val ? (
                              <span className="text-emerald-700 font-semibold">VRAI</span>
                            ) : (
                              <span className="text-slate-400">FAUX</span>
                            )
                          ) : typeof val === 'number' && val === 0 ? (
                            <span className="inline-block px-1.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 font-mono font-bold text-[10px]">
                              0 (Absence)
                            </span>
                          ) : typeof val === 'string' && val.length > 35 ? (
                            `${val.slice(0, 35)}...`
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-right">
                      <button className="text-emerald-700 hover:text-emerald-900 font-medium inline-flex items-center gap-1">
                        <span>Détails</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="py-8 text-center text-slate-500">
                    Aucun enregistrement ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 100 && (
          <div className="p-2.5 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-200">
            Affichage des 100 premières lignes sur {filteredData.length}. Utilisez l'export CSV pour obtenir l'intégralité.
          </div>
        )}
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Enregistrement : {selectedRecord.id || selectedRecord.spatiotemporal_unit_id}
                </h3>
                <p className="text-xs text-slate-500">Table : {activeTable}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 text-xs">
              {Object.entries(selectedRecord).map(([key, val]) => (
                <div key={key} className="py-2 flex items-start justify-between gap-4">
                  <span className="font-semibold text-slate-700 font-mono">{key}</span>
                  <span className="text-slate-900 text-right max-w-sm break-words">
                    {val === null || val === undefined ? (
                      <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 text-slate-400 font-mono text-[10px]">
                        NULL (Non disponible)
                      </span>
                    ) : typeof val === 'object' ? (
                      JSON.stringify(val)
                    ) : (
                      String(val)
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
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
