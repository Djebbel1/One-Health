import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Filter,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Activity,
  Search,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportToCSV } from '../../utils/exportUtils';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

export const ModelReadyDataView: React.FC = () => {
  const { modelReadyData, integratedSpatiotemporalData } = useData();

  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRows = useMemo(() => {
    return modelReadyData.filter(row => {
      if (filterYear !== 'ALL' && String(row.year) !== filterYear) return false;
      if (filterArea !== 'ALL' && row.aire_sante_id !== filterArea) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !row.spatiotemporal_unit_id.toLowerCase().includes(q) &&
          !row.aire_sante_name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [modelReadyData, filterYear, filterArea, searchQuery]);

  const handleExportCsv = () => {
    exportToCSV(modelReadyData, 'MODEL_READY_DATA_ONE_HEALTH_KINDU');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining the Model Ready Concept */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vue Biostatistique Validée : MODEL_READY_DATA</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Matrice de Données Prêtes pour la Modélisation Spatio-Temporelle Y(s,t)
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Cette vue consolide exclusivement les unités spatio-temporelles ayant satisfait aux <strong>critères d'inclusion méthodologiques stricts</strong> : unité spatiale officielle validée, période calendaire régulière, séparation stricte des pathologies, préservation des valeurs manquantes (NULL) et absence de conflits non résolus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-model-ready-csv"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-950 rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Download className="w-4 h-4 text-emerald-800" />
              <span>Télécharger CSV R / Python ({modelReadyData.length} lignes)</span>
            </button>
          </div>
        </div>

        {/* Inclusion Criteria Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-emerald-800/70">
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Unités spatiales validées</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Facteurs temporels non rétro-propagés</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zéro vs NULL strictement distingués</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Lags climatiques (M-1, M-2) compilés</span>
          </div>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer aire / code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={filterYear}
              onChange={e => setFilterYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Toutes Années</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <select
              value={filterArea}
              onChange={e => setFilterArea(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Toutes les 10 Aires</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-medium">
          <span className="text-emerald-800 font-bold font-mono">{filteredRows.length}</span> lignes validées sur <span className="font-mono">{integratedSpatiotemporalData.length}</span> unités totales
        </div>
      </div>

      {/* Model Ready Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 min-w-[140px]">Unité Spatio-Temp.</th>
                <th className="py-3 px-3 min-w-[120px]">Aire de Santé</th>
                <th className="py-3 px-2 text-center">Année</th>
                <th className="py-3 px-2 text-center">Mois</th>
                <th className="py-3 px-2 text-right">Population</th>
                
                {/* Y(s,t) Outcomes */}
                <th className="py-3 px-2 text-right text-amber-900 bg-amber-50/50">Paludisme (Cas)</th>
                <th className="py-3 px-2 text-right text-amber-800 bg-amber-50/50">Incidence Palu</th>
                <th className="py-3 px-2 text-right text-blue-900 bg-blue-50/50">Typhoïde (Cas)</th>
                <th className="py-3 px-2 text-right text-blue-800 bg-blue-50/50">Incidence Typh.</th>
                
                {/* Covariates */}
                <th className="py-3 px-2 text-right text-sky-900 bg-sky-50/50">Pluie (mm)</th>
                <th className="py-3 px-2 text-right text-sky-800 bg-sky-50/50">Lag M-1 (mm)</th>
                <th className="py-3 px-2 text-right text-sky-700 bg-sky-50/50">Lag M-2 (mm)</th>
                <th className="py-3 px-2 text-right">Temp (°C)</th>
                <th className="py-3 px-2 text-right">Humidité (%)</th>
                <th className="py-3 px-2 text-center">Gîtes Eaux</th>
                <th className="py-3 px-2 text-center">Sites Déchets</th>
                <th className="py-3 px-2 text-right">Complétude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, idx) => (
                  <tr key={row.spatiotemporal_unit_id || idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {row.spatiotemporal_unit_id}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-800 whitespace-nowrap">
                      {row.aire_sante_name}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{row.year}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">M{row.month}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">{row.population.toLocaleString('fr-FR')}</td>

                    {/* Paludisme */}
                    <td className="py-2.5 px-2 text-right font-bold text-amber-900 bg-amber-50/30">
                      {row.malaria_cases ?? <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-amber-800 bg-amber-50/30">
                      {row.malaria_incidence_per_1000 !== null ? `${row.malaria_incidence_per_1000}‰` : 'NULL'}
                    </td>

                    {/* Typhoïde */}
                    <td className="py-2.5 px-2 text-right font-bold text-blue-900 bg-blue-50/30">
                      {row.typhoid_cases ?? <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-blue-800 bg-blue-50/30">
                      {row.typhoid_incidence_per_1000 !== null ? `${row.typhoid_incidence_per_1000}‰` : 'NULL'}
                    </td>

                    {/* Climat */}
                    <td className="py-2.5 px-2 text-right text-sky-900 bg-sky-50/30">
                      {row.rainfall_mm !== null ? `${row.rainfall_mm}` : <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-sky-800 bg-sky-50/30">
                      {row.rainfall_lag_1 !== null ? `${row.rainfall_lag_1}` : <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-sky-700 bg-sky-50/30">
                      {row.rainfall_lag_2 !== null ? `${row.rainfall_lag_2}` : <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {row.temperature_mean !== null ? `${row.temperature_mean}` : <span className="text-slate-400">NULL</span>}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {row.humidity_percent !== null ? `${row.humidity_percent}` : <span className="text-slate-400">NULL</span>}
                    </td>

                    {/* Environnement */}
                    <td className="py-2.5 px-2 text-center">
                      {row.stagnant_water_count !== null ? (
                        row.stagnant_water_count === 0 ? (
                          <span className="text-emerald-700 font-bold">0</span>
                        ) : (
                          <span className="text-amber-800 font-bold">{row.stagnant_water_count}</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[10px]">ND</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {row.waste_sites_count !== null ? (
                        row.waste_sites_count === 0 ? (
                          <span className="text-emerald-700 font-bold">0</span>
                        ) : (
                          <span className="text-amber-800 font-bold">{row.waste_sites_count}</span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[10px]">ND</span>
                      )}
                    </td>

                    {/* Complétude */}
                    <td className="py-2.5 px-2 text-right font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.data_completeness >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.data_completeness}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={17} className="py-8 text-center text-slate-500 font-sans">
                    Aucune ligne ne correspond aux filtres appliqués.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
