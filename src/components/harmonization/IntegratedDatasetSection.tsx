import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { IntegratedDatasetRow } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  Activity,
  CloudSun,
  Layers,
  Home
} from 'lucide-react';

export const IntegratedDatasetSection: React.FC = () => {
  const {
    integratedDataset,
    geographicUnits,
    analysisPeriods,
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    dataCorrections,
    auditLogs,
  } = useData();

  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedGeoId, setSelectedGeoId] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const healthAreas = geographicUnits.filter(u => u.geo_type === 'AIRE_DE_SANTE');

  const filteredData = useMemo(() => {
    return integratedDataset.filter(row => {
      if (selectedYear !== 'ALL' && String(row.year) !== selectedYear) return false;
      if (selectedMonth !== 'ALL' && String(row.month) !== selectedMonth) return false;
      if (selectedGeoId !== 'ALL' && row.geo_id !== selectedGeoId) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchArea = row.health_area_name.toLowerCase().includes(q);
        const matchCode = row.geo_id.toLowerCase().includes(q);
        if (!matchArea && !matchCode) return false;
      }
      return true;
    });
  }, [integratedDataset, selectedYear, selectedMonth, selectedGeoId, searchTerm]);

  // Export handler
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'Row_ID',
      'Code_Geo',
      'Aire_de_Sante',
      'Zone_de_Sante',
      'Annee',
      'Mois',
      'Saison',
      'Paludisme_Cas',
      'Typhoide_Cas',
      'Pluie_mm',
      'Temp_Moyenne_C',
      'Humidite_Pct',
      'Sites_Eau_Stagnante',
      'Sites_Dechets',
      'Menages_Enquetes',
      'Menages_Eau_Amelioree_Pct',
      'Score_Completude'
    ];

    const rows = filteredData.map(r => [
      r.integrated_row_id,
      r.geo_id,
      `"${r.health_area_name}"`,
      `"${r.health_zone_name}"`,
      r.year,
      r.month,
      `"${r.season_name}"`,
      r.malaria_cases !== null ? r.malaria_cases : '',
      r.typhoid_cases !== null ? r.typhoid_cases : '',
      r.climate_rainfall_mm !== null ? r.climate_rainfall_mm : '',
      r.climate_temp_mean_c !== null ? r.climate_temp_mean_c : '',
      r.climate_humidity_pct !== null ? r.climate_humidity_pct : '',
      r.stagnant_water_sites_count,
      r.waste_dump_sites_count,
      r.surveyed_households_count,
      r.households_with_improved_water_pct !== null ? r.households_with_improved_water_pct : '',
      r.completeness_score
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ONE_HEALTH_KINDU_BASE_INTEGREE_V1.5_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Base Intégrée Spatio-Temporelle (Matrice Harmonisée V1.5)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Consolidation multidimensionnelle unifiée à l échelle <strong>Aire de Santé &times; Mois</strong> reliant les 4 piliers One Health sans extrapolation causale artificielle.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Exporter la Base (CSV UTF-8)
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Année</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">Toutes les années</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Mois</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">Tous les mois</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Mois {m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Aire de Santé</label>
            <select
              value={selectedGeoId}
              onChange={(e) => setSelectedGeoId(e.target.value)}
              className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-medium"
            >
              <option value="ALL">Toutes les aires ({healthAreas.length})</option>
              {healthAreas.map(a => (
                <option key={a.geo_id} value={a.geo_id}>{a.geo_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Recherche</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer aire ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Integrated Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                <th colSpan={3} className="py-2.5 px-3 border-r border-slate-800 bg-slate-950 text-teal-300">
                  Cadre Spatio-Temporel
                </th>
                <th colSpan={2} className="py-2.5 px-3 border-r border-slate-800 bg-rose-950/80 text-rose-300 text-center">
                  Santé
                </th>
                <th colSpan={3} className="py-2.5 px-3 border-r border-slate-800 bg-cyan-950/80 text-cyan-300 text-center">
                  Climat
                </th>
                <th colSpan={2} className="py-2.5 px-3 border-r border-slate-800 bg-emerald-950/80 text-emerald-300 text-center">
                  Environnement
                </th>
                <th colSpan={2} className="py-2.5 px-3 bg-blue-950/80 text-blue-300 text-center">
                  Ménages & Eau
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[10px] uppercase">
                <th className="py-2.5 px-3">Aire de Santé</th>
                <th className="py-2.5 px-3">Période</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Saison</th>
                <th className="py-2.5 px-3 text-center">Paludisme</th>
                <th className="py-2.5 px-3 text-center border-r border-slate-200">Typhoïde</th>
                <th className="py-2.5 px-3 text-center">Pluie</th>
                <th className="py-2.5 px-3 text-center">Temp.</th>
                <th className="py-2.5 px-3 text-center border-r border-slate-200">Humidité</th>
                <th className="py-2.5 px-3 text-center">Eaux Stagn.</th>
                <th className="py-2.5 px-3 text-center border-r border-slate-200">Dépôts Déchets</th>
                <th className="py-2.5 px-3 text-center">Ménages</th>
                <th className="py-2.5 px-3 text-center">Eau Amél. %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    Aucune ligne ne correspond aux filtres temporels et géographiques.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.integrated_row_id} className="hover:bg-slate-50/90 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {row.health_area_name}
                      <span className="text-[10px] text-slate-400 font-mono block">{row.geo_id}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {row.month < 10 ? `0${row.month}` : row.month}/{row.year}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 border-r border-slate-100 text-[11px]">
                      {row.season_name}
                    </td>

                    {/* Health */}
                    <td className="py-2.5 px-3 text-center font-bold text-rose-700">
                      {row.malaria_cases !== null ? row.malaria_cases : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-900 border-r border-slate-100">
                      {row.typhoid_cases !== null ? row.typhoid_cases : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>

                    {/* Climate */}
                    <td className="py-2.5 px-3 text-center text-cyan-800 font-mono">
                      {row.climate_rainfall_mm !== null ? `${row.climate_rainfall_mm} mm` : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center text-cyan-900 font-mono">
                      {row.climate_temp_mean_c !== null ? `${row.climate_temp_mean_c}°C` : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center text-cyan-700 font-mono border-r border-slate-100">
                      {row.climate_humidity_pct !== null ? `${row.climate_humidity_pct}%` : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>

                    {/* Environment */}
                    <td className="py-2.5 px-3 text-center text-emerald-800 font-semibold">
                      {row.stagnant_water_sites_count}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-900 font-semibold border-r border-slate-100">
                      {row.waste_dump_sites_count}
                    </td>

                    {/* Household */}
                    <td className="py-2.5 px-3 text-center text-blue-800 font-semibold">
                      {row.surveyed_households_count}
                    </td>
                    <td className="py-2.5 px-3 text-center text-blue-900 font-bold">
                      {row.households_with_improved_water_pct !== null ? `${row.households_with_improved_water_pct}%` : <span className="text-slate-300 font-normal">NULL</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
