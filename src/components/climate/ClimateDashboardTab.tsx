import React, { useMemo, useState } from 'react';
import {
  CloudSun,
  Thermometer,
  CloudRain,
  Droplets,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle,
  Database,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import { useData } from '../../context/DataContext';
import { ClimateRecord } from '../../types';

export const ClimateDashboardTab: React.FC<{ onNavigateToTab: (tab: string) => void }> = ({ onNavigateToTab }) => {
  const { climateRecords, climateStations, climateSources } = useData();

  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<string>('ALL');

  // Filter records
  const filteredRecords = useMemo(() => {
    return climateRecords.filter(rec => {
      if (selectedYear !== 'ALL' && rec.year !== parseInt(selectedYear, 10)) return false;
      if (selectedStation !== 'ALL') {
        const stationMatch = rec.station_id === selectedStation || rec.location_name === selectedStation || rec.location_id === selectedStation;
        if (!stationMatch) return false;
      }
      return true;
    });
  }, [climateRecords, selectedYear, selectedStation]);

  // Available Years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(climateRecords.map(r => r.year))).filter((y): y is number => typeof y === 'number' && !isNaN(y)).sort((a, b) => a - b);
    return years.length > 0 ? years : [2023, 2024];
  }, [climateRecords]);

  // Statistics Summary
  const stats = useMemo(() => {
    let rainSum = 0;
    let rainCount = 0;
    let tempSum = 0;
    let tempCount = 0;
    let humiditySum = 0;
    let humidityCount = 0;
    let minTempRecorded: number | null = null;
    let maxTempRecorded: number | null = null;
    let missingRainCount = 0;
    let missingTempCount = 0;

    filteredRecords.forEach(r => {
      // Rainfall (0 is valid rainfall; null is missing)
      if (r.rainfall_mm !== null && r.rainfall_mm !== undefined) {
        rainSum += r.rainfall_mm;
        rainCount++;
      } else {
        missingRainCount++;
      }

      // Temp Mean
      const tMean = r.temp_mean_c ?? r.temperature_mean;
      if (tMean !== null && tMean !== undefined) {
        tempSum += tMean;
        tempCount++;
      } else {
        missingTempCount++;
      }

      // Temp Min & Max
      const tMin = r.temp_min_c ?? r.temperature_min;
      if (tMin !== null && tMin !== undefined) {
        if (minTempRecorded === null || tMin < minTempRecorded) minTempRecorded = tMin;
      }
      const tMax = r.temp_max_c ?? r.temperature_max;
      if (tMax !== null && tMax !== undefined) {
        if (maxTempRecorded === null || tMax > maxTempRecorded) maxTempRecorded = tMax;
      }

      // Humidity
      const hum = r.humidity_pct ?? r.humidity_percent;
      if (hum !== null && hum !== undefined) {
        humiditySum += hum;
        humidityCount++;
      }
    });

    return {
      totalRecords: filteredRecords.length,
      totalRainfall: rainSum,
      avgRainfallPerRecord: rainCount > 0 ? Math.round((rainSum / rainCount) * 10) / 10 : null,
      avgTemp: tempCount > 0 ? Math.round((tempSum / tempCount) * 10) / 10 : null,
      minTemp: minTempRecorded,
      maxTemp: maxTempRecorded,
      avgHumidity: humidityCount > 0 ? Math.round(humiditySum / humidityCount) : null,
      missingRainCount,
      missingTempCount,
      completenessRate: filteredRecords.length > 0 
        ? Math.round(((filteredRecords.length * 2 - missingRainCount - missingTempCount) / (filteredRecords.length * 2)) * 100) 
        : 100
    };
  }, [filteredRecords]);

  // Monthly Aggregated Chronological Series
  const monthlySeries = useMemo(() => {
    const months = [
      { num: 1, name: 'Jan' }, { num: 2, name: 'Fév' }, { num: 3, name: 'Mar' },
      { num: 4, name: 'Avr' }, { num: 5, name: 'Mai' }, { num: 6, name: 'Juin' },
      { num: 7, name: 'Juil' }, { num: 8, name: 'Août' }, { num: 9, name: 'Sept' },
      { num: 10, name: 'Oct' }, { num: 11, name: 'Nov' }, { num: 12, name: 'Déc' }
    ];

    if (selectedYear !== 'ALL') {
      const yr = parseInt(selectedYear, 10);
      return months.map(m => {
        const matches = filteredRecords.filter(r => r.year === yr && r.month === m.num);
        const rainRecords = matches.filter(r => r.rainfall_mm !== null && r.rainfall_mm !== undefined);
        const rain = rainRecords.length > 0 
          ? Math.round(rainRecords.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0) * 10) / 10 
          : null;

        const tempRecords = matches.filter(r => (r.temp_mean_c ?? r.temperature_mean) !== null && (r.temp_mean_c ?? r.temperature_mean) !== undefined);
        const tempMean = tempRecords.length > 0
          ? Math.round((tempRecords.reduce((acc, c) => acc + (c.temp_mean_c ?? c.temperature_mean ?? 0), 0) / tempRecords.length) * 10) / 10
          : null;

        const tempMinRecords = matches.filter(r => (r.temp_min_c ?? r.temperature_min) !== null);
        const tempMin = tempMinRecords.length > 0
          ? Math.min(...tempMinRecords.map(r => (r.temp_min_c ?? r.temperature_min)!))
          : null;

        const tempMaxRecords = matches.filter(r => (r.temp_max_c ?? r.temperature_max) !== null);
        const tempMax = tempMaxRecords.length > 0
          ? Math.max(...tempMaxRecords.map(r => (r.temp_max_c ?? r.temperature_max)!))
          : null;

        const humRecords = matches.filter(r => (r.humidity_pct ?? r.humidity_percent) !== null);
        const humidity = humRecords.length > 0
          ? Math.round(humRecords.reduce((acc, c) => acc + (c.humidity_pct ?? c.humidity_percent ?? 0), 0) / humRecords.length)
          : null;

        return {
          period: `${m.name}`,
          fullPeriod: `${m.name} ${yr}`,
          pluviometrie: rain,
          tempMoyenne: tempMean,
          tempMin,
          tempMax,
          humidite: humidity,
          nbReleves: matches.length
        };
      });
    }

    // Chronological across all years
    const timeline: any[] = [];
    availableYears.forEach(yr => {
      months.forEach(m => {
        const matches = filteredRecords.filter(r => r.year === yr && r.month === m.num);
        if (matches.length === 0) return;

        const rainRecords = matches.filter(r => r.rainfall_mm !== null && r.rainfall_mm !== undefined);
        const rain = rainRecords.length > 0 
          ? Math.round(rainRecords.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0) * 10) / 10 
          : null;

        const tempRecords = matches.filter(r => (r.temp_mean_c ?? r.temperature_mean) !== null);
        const tempMean = tempRecords.length > 0
          ? Math.round((tempRecords.reduce((acc, c) => acc + (c.temp_mean_c ?? c.temperature_mean ?? 0), 0) / tempRecords.length) * 10) / 10
          : null;

        timeline.push({
          period: `${m.name} ${String(yr).slice(-2)}`,
          fullPeriod: `${m.name} ${yr}`,
          pluviometrie: rain,
          tempMoyenne: tempMean,
          nbReleves: matches.length
        });
      });
    });

    return timeline;
  }, [filteredRecords, selectedYear, availableYears]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Scientific Protocol Rules */}
      <div className="bg-gradient-to-r from-sky-900 via-cyan-900 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-sky-500/20 text-sky-200 text-xs px-2.5 py-0.5 rounded-full border border-sky-400/30 font-medium">
                V1.4 • Climatologie Fondamentale
              </span>
              <span className="bg-amber-500/20 text-amber-200 text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30 font-medium">
                Absence ≠ Zéro • Traçabilité Totale
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white">
              Gestion & Contrôle des Données Climatiques de Kindu
            </h2>
            <p className="text-sm text-sky-100/80 max-w-3xl mt-1 leading-relaxed">
              Consolidation rigoureuse des observations météorologiques (stations synoptiques METTELSAT, postes pluviométriques locaux, satellites CHIRPS et réanalyses ERA5) pour la recherche épidémiologique.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateToTab('IMPORT')}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl shadow transition inline-flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              Importer Excel / CSV
            </button>
            <button
              onClick={() => onNavigateToTab('FORM')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition inline-flex items-center gap-1.5"
            >
              <CloudSun className="w-4 h-4" />
              Nouveau Relevé
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Année d'observation
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">Toutes les années ({climateRecords.length} relevés)</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr.toString()}>Année {yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Station / Source
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500 max-w-xs truncate"
            >
              <option value="ALL">Toutes les stations & sources</option>
              {climateStations.map(st => (
                <option key={st.station_id} value={st.station_id}>
                  {st.station_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToTab('QUALITY')}
            className="px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition inline-flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Audit Qualité
          </button>
          <button
            onClick={() => onNavigateToTab('SOURCES')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition inline-flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            {climateStations.length} Stations • {climateSources.length} Sources
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative Rainfall */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Précipitations Cumulées
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {stats.totalRainfall.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-sky-700">mm</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Moyenne : {stats.avgRainfallPerRecord !== null ? `${stats.avgRainfallPerRecord} mm/période` : 'N/D'}</span>
            <span className="text-emerald-600 font-medium">{stats.totalRecords - stats.missingRainCount} relevés</span>
          </div>
        </div>

        {/* Temperature Range */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Température Moyenne
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {stats.avgTemp !== null ? `${stats.avgTemp}` : 'N/D'}
            </span>
            <span className="text-xs font-bold text-amber-700">°C</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Min : {stats.minTemp !== null ? `${stats.minTemp}°C` : 'N/D'}</span>
            <span>Max : {stats.maxTemp !== null ? `${stats.maxTemp}°C` : 'N/D'}</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Humidité Relative
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {stats.avgHumidity !== null ? `${stats.avgHumidity}` : 'N/D'}
            </span>
            <span className="text-xs font-bold text-teal-700">%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>Climat tropical humide équatorial</span>
          </div>
        </div>

        {/* Quality & Completeness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Complétude des Données
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {stats.completenessRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-700">Validé</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            <span>{stats.missingRainCount + stats.missingTempCount} valeurs N/D préservées</span>
          </div>
        </div>
      </div>

      {/* Main Climate Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              Diagramme Ombrothermique & Évolution Thermique de Kindu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Précipitations mensuelles (barres en mm) et température moyenne de l'air (courbe en °C)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-3 h-3 bg-sky-500 rounded-sm"></div>
              <span>Pluie (mm)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <div className="w-3 h-1 bg-amber-500"></div>
              <span>Température (°C)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlySeries} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="period" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#CBD5E1' }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fill: '#0284C7', fontSize: 11 }}
                axisLine={{ stroke: '#0284C7' }}
                unit=" mm"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[18, 36]}
                tick={{ fill: '#D97706', fontSize: 11 }}
                axisLine={{ stroke: '#D97706' }}
                unit=" °C"
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '8px', color: '#F8FAFC', fontSize: '12px' }}
                formatter={(value: any, name: string) => {
                  if (value === null || value === undefined) return ['Non disponible (N/D)', name];
                  if (name === 'pluviometrie') return [`${value} mm`, 'Pluviométrie'];
                  if (name === 'tempMoyenne') return [`${value} °C`, 'Température Moyenne'];
                  if (name === 'tempMin') return [`${value} °C`, 'Température Min'];
                  if (name === 'tempMax') return [`${value} °C`, 'Température Max'];
                  if (name === 'humidite') return [`${value} %`, 'Humidité Relative'];
                  return [value, name];
                }}
                labelFormatter={(label) => `Période : ${label}`}
              />
              <Bar yAxisId="left" dataKey="pluviometrie" name="pluviometrie" fill="#0284C7" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="tempMoyenne" name="tempMoyenne" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4, fill: '#D97706' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stations Overview Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Réseau Météorologique & Sources Enregistrées ({climateStations.length} stations)
          </h3>
          <button
            onClick={() => onNavigateToTab('SOURCES')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800"
          >
            Gérer le catalogue complet &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="px-3 py-2.5">Code Station</th>
                <th className="px-3 py-2.5">Nom de la Station</th>
                <th className="px-3 py-2.5">Coordonnées (GPS)</th>
                <th className="px-3 py-2.5">Opérateur / Institution</th>
                <th className="px-3 py-2.5">Statut</th>
                <th className="px-3 py-2.5 text-right">Relevés Associés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {climateStations.map(st => {
                const count = climateRecords.filter(r => r.station_id === st.station_id || r.location_id === st.station_id).length;
                return (
                  <tr key={st.station_id} className="hover:bg-slate-50/80 transition">
                    <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{st.station_id}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">{st.station_name}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500">
                      {st.latitude.toFixed(4)}°, {st.longitude.toFixed(4)}° {st.altitude ? `(${st.altitude}m)` : ''}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{st.operator}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-sky-700">{count} relevés</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
