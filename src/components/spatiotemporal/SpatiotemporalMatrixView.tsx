import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Layers,
  Activity,
  Info,
  ChevronDown,
  TrendingUp,
  MapPin,
  Eye,
  SlidersHorizontal,
  Table as TableIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';
import { DiseaseCode } from '../../types';

export const SpatiotemporalMatrixView: React.FC = () => {
  const { spatiotemporalUnits, healthSpatiotemporal, climateSpatiotemporal } = useData();

  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseCode | 'COMPARE'>('MALARIA');
  const [hoveredCell, setHoveredCell] = useState<{
    areaId: string;
    month: number;
    areaName: string;
    cases: number | null;
    confirmed: number | null;
    suspected: number | null;
    incidence: number | null;
    population: number;
    rain: number | null;
    temp: number | null;
  } | null>(null);

  const months = [
    { num: 1, name: 'Jan', full: 'Janvier' },
    { num: 2, name: 'Fév', full: 'Février' },
    { num: 3, name: 'Mar', full: 'Mars' },
    { num: 4, name: 'Avr', full: 'Avril' },
    { num: 5, name: 'Mai', full: 'Mai' },
    { num: 6, name: 'Juin', full: 'Juin' },
    { num: 7, name: 'Juil', full: 'Juillet' },
    { num: 8, name: 'Août', full: 'Août' },
    { num: 9, name: 'Sep', full: 'Septembre' },
    { num: 10, name: 'Oct', full: 'Octobre' },
    { num: 11, name: 'Nov', full: 'Novembre' },
    { num: 12, name: 'Déc', full: 'Décembre' },
  ];

  // Map health data for quick lookup: [areaId-year-month-disease] -> HealthSpatiotemporal
  const healthDataMap = useMemo(() => {
    const map = new Map<string, typeof healthSpatiotemporal[0]>();
    for (const h of healthSpatiotemporal) {
      map.set(`${h.spatiotemporal_unit_id}-${h.disease}`, h);
    }
    return map;
  }, [healthSpatiotemporal]);

  // Map climate data by year-month
  const climateMap = useMemo(() => {
    const map = new Map<string, typeof climateSpatiotemporal[0]>();
    for (const c of climateSpatiotemporal) {
      map.set(`${c.year}-${c.month}`, c);
    }
    return map;
  }, [climateSpatiotemporal]);

  // Determine max cases for heat color intensity
  const maxCases = useMemo(() => {
    let max = 1;
    for (const h of healthSpatiotemporal) {
      if (h.cases_total > max) max = h.cases_total;
    }
    return max;
  }, [healthSpatiotemporal]);

  // Color generator for heatmap cells
  const getCellBgColor = (cases: number | null, disease: DiseaseCode) => {
    if (cases === null || cases === undefined) return 'bg-slate-100 text-slate-400';
    if (cases === 0) return 'bg-emerald-50 text-emerald-700 font-medium';
    
    const intensity = Math.min(Math.max(cases / (disease === 'MALARIA' ? 250 : 80), 0.1), 1);
    
    if (disease === 'MALARIA') {
      if (intensity > 0.7) return 'bg-rose-600 text-white font-bold';
      if (intensity > 0.4) return 'bg-amber-500 text-white font-semibold';
      if (intensity > 0.2) return 'bg-amber-200 text-amber-900 font-medium';
      return 'bg-amber-100 text-amber-800 font-medium';
    } else {
      if (intensity > 0.7) return 'bg-indigo-600 text-white font-bold';
      if (intensity > 0.4) return 'bg-blue-500 text-white font-semibold';
      if (intensity > 0.2) return 'bg-blue-200 text-blue-900 font-medium';
      return 'bg-blue-100 text-blue-800 font-medium';
    }
  };

  // Monthly totals across all 10 health areas
  const monthlyTotals = useMemo(() => {
    return months.map(m => {
      let malSum = 0;
      let typSum = 0;
      for (const area of KINDU_HEALTH_AREAS) {
        const unitId = `${area.id}-${selectedYear}-${String(m.num).padStart(2, '0')}`;
        const malRecord = healthDataMap.get(`${unitId}-MALARIA`);
        const typRecord = healthDataMap.get(`${unitId}-TYPHOID`);
        if (malRecord?.cases_total) malSum += malRecord.cases_total;
        if (typRecord?.cases_total) typSum += typRecord.cases_total;
      }
      const clim = climateMap.get(`${selectedYear}-${m.num}`);
      return {
        month: m.num,
        monthName: m.name,
        malaria: malSum,
        typhoid: typSum,
        rain: clim?.rainfall_mm ?? null,
        temp: clim?.temperature_mean ?? null,
      };
    });
  }, [months, selectedYear, healthDataMap, climateMap]);

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Année :</label>
            <select
              id="select-matrix-year"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Pathologie :</label>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                id="btn-matrix-malaria"
                onClick={() => setSelectedDisease('MALARIA')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  selectedDisease === 'MALARIA'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paludisme
              </button>
              <button
                id="btn-matrix-typhoid"
                onClick={() => setSelectedDisease('TYPHOID')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  selectedDisease === 'TYPHOID'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fièvre Typhoïde
              </button>
              <button
                id="btn-matrix-compare"
                onClick={() => setSelectedDisease('COMPARE')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  selectedDisease === 'COMPARE'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Comparaison
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-medium">Intensité :</span>
          <span className="inline-block w-4 h-4 rounded-sm bg-emerald-50 border border-emerald-200 text-center text-[10px] leading-4 text-emerald-800">0</span>
          <span className="inline-block w-4 h-4 rounded-sm bg-amber-200 text-center text-[10px] leading-4 text-amber-900">Faible</span>
          <span className="inline-block w-4 h-4 rounded-sm bg-amber-500 text-center text-[10px] leading-4 text-white">Moyen</span>
          <span className="inline-block w-4 h-4 rounded-sm bg-rose-600 text-center text-[10px] leading-4 text-white font-bold">Élevé</span>
          <span className="inline-block w-4 h-4 rounded-sm bg-slate-100 text-center text-[10px] leading-4 text-slate-400">ND</span>
        </div>
      </div>

      {/* Main Spatio-Temporal Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Matrice Spatio-Temporelle : 10 Aires de Santé × 12 Mois ({selectedYear})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Unité primaire d'agrégation : Aire de Santé / Mois
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-3 px-3 min-w-[170px] sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                  Aire de Santé (Zone)
                </th>
                <th className="py-3 px-2 text-right text-[11px] min-w-[75px] border-r border-slate-200">
                  Pop. 2024
                </th>
                {months.map(m => (
                  <th key={m.num} className="py-3 px-2 text-center min-w-[62px] border-r border-slate-200">
                    <span className="block font-bold">{m.name}</span>
                    <span className="text-[10px] font-normal text-slate-500">M{m.num}</span>
                  </th>
                ))}
                <th className="py-3 px-3 text-right min-w-[85px] bg-slate-100 font-bold">
                  Total An
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {KINDU_HEALTH_AREAS.map(area => {
                let areaYearTotal = 0;

                return (
                  <tr key={area.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Health Area name & zone */}
                    <td className="py-2.5 px-3 font-semibold sticky left-0 bg-white z-10 border-r border-slate-200 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="flex flex-col">
                        <span className="text-slate-900">{area.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {area.zoneId === 'ZS_KINDU' ? 'ZS Kindu' : 'ZS Alunguli'} • {area.commune}
                        </span>
                      </div>
                    </td>

                    {/* Population */}
                    <td className="py-2.5 px-2 text-right font-mono text-slate-600 border-r border-slate-200">
                      {area.population.toLocaleString('fr-FR')}
                    </td>

                    {/* 12 Months Cells */}
                    {months.map(m => {
                      const unitId = `${area.id}-${selectedYear}-${String(m.num).padStart(2, '0')}`;
                      const malRecord = healthDataMap.get(`${unitId}-MALARIA`);
                      const typRecord = healthDataMap.get(`${unitId}-TYPHOID`);
                      const clim = climateMap.get(`${selectedYear}-${m.num}`);

                      const activeRecord = selectedDisease === 'TYPHOID' ? typRecord : malRecord;
                      const cases = activeRecord?.cases_total ?? null;
                      if (cases !== null) areaYearTotal += cases;

                      return (
                        <td
                          key={m.num}
                          onMouseEnter={() => {
                            setHoveredCell({
                              areaId: area.id,
                              areaName: area.name,
                              month: m.num,
                              cases: activeRecord?.cases_total ?? null,
                              confirmed: activeRecord?.cases_confirmed ?? null,
                              suspected: activeRecord?.cases_suspected ?? null,
                              incidence: activeRecord?.incidence_per_1000 ?? null,
                              population: area.population,
                              rain: clim?.rainfall_mm ?? null,
                              temp: clim?.temperature_mean ?? null,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          className="py-1.5 px-1.5 text-center border-r border-slate-100 cursor-pointer"
                        >
                          {selectedDisease === 'COMPARE' ? (
                            <div className="flex flex-col gap-0.5 text-[10px] leading-tight">
                              <span className={`px-1 py-0.5 rounded-xs ${getCellBgColor(malRecord?.cases_total ?? null, 'MALARIA')}`}>
                                M: {malRecord?.cases_total ?? 'ND'}
                              </span>
                              <span className={`px-1 py-0.5 rounded-xs ${getCellBgColor(typRecord?.cases_total ?? null, 'TYPHOID')}`}>
                                T: {typRecord?.cases_total ?? 'ND'}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={`py-1.5 px-1 rounded-md text-xs transition-transform hover:scale-105 ${getCellBgColor(
                                cases,
                                selectedDisease as DiseaseCode
                              )}`}
                            >
                              {cases !== null ? cases : 'ND'}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Total column */}
                    <td className="py-2.5 px-3 text-right font-mono font-bold bg-slate-50 text-slate-900">
                      {areaYearTotal.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                );
              })}

              {/* Monthly Totals Footer */}
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-3 sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                  Total Agglomération Kindu
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-700 border-r border-slate-200">
                  {KINDU_HEALTH_AREAS.reduce((acc, a) => acc + a.population, 0).toLocaleString('fr-FR')}
                </td>
                {monthlyTotals.map(mt => (
                  <td key={mt.month} className="py-3 px-1.5 text-center border-r border-slate-200 font-mono">
                    {selectedDisease === 'TYPHOID' ? mt.typhoid : mt.malaria}
                  </td>
                ))}
                <td className="py-3 px-3 text-right font-mono text-emerald-800">
                  {selectedDisease === 'TYPHOID'
                    ? monthlyTotals.reduce((acc, m) => acc + m.typhoid, 0).toLocaleString('fr-FR')
                    : monthlyTotals.reduce((acc, m) => acc + m.malaria, 0).toLocaleString('fr-FR')}
                </td>
              </tr>

              {/* Climate Context Line */}
              <tr className="bg-sky-50/70 text-[11px] text-sky-900 font-medium border-t border-sky-200">
                <td className="py-2 px-3 sticky left-0 bg-sky-50 z-10 border-r border-sky-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
                  <span>Précipitations (mm / Mois)</span>
                </td>
                <td className="py-2 px-2 text-right font-mono text-sky-700 border-r border-sky-200">
                  Station
                </td>
                {monthlyTotals.map(mt => (
                  <td key={mt.month} className="py-2 px-1 text-center font-mono border-r border-sky-200">
                    {mt.rain !== null ? `${mt.rain}` : 'ND'}
                  </td>
                ))}
                <td className="py-2 px-3 text-right font-mono text-sky-900 font-bold">
                  {monthlyTotals.reduce((acc, m) => acc + (m.rain ?? 0), 0)} mm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      {hoveredCell && (
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-300">
                Fiche Unité Spatio-Temporelle : <span className="text-white font-bold">{hoveredCell.areaName}</span> • Mois {hoveredCell.month}/{selectedYear}
              </div>
              <div className="text-[11px] text-slate-400">
                Population de référence : {hoveredCell.population.toLocaleString('fr-FR')} habitants
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Cas Enregistrés</span>
              <span className="font-bold text-emerald-400 text-sm">{hoveredCell.cases ?? 'Non disponible'}</span>
            </div>

            <div className="bg-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Taux d'Incidence</span>
              <span className="font-bold text-amber-400 text-sm">
                {hoveredCell.incidence !== null ? `${hoveredCell.incidence} / 1 000 hab.` : 'ND'}
              </span>
            </div>

            <div className="bg-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400 block text-[10px]">Précipitations Ville</span>
              <span className="font-bold text-sky-400 text-sm">{hoveredCell.rain !== null ? `${hoveredCell.rain} mm` : 'ND'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
