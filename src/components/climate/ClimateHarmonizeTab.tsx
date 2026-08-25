import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  MapPin,
  Database,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ClimateRecord } from '../../types';
import * as XLSX from 'xlsx';

export const ClimateHarmonizeTab: React.FC = () => {
  const { climateRecords, climateStations, bulkAddClimateRecords, userSession } = useData();

  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [targetYear, setTargetYear] = useState<number>(2024);
  const [harmonizing, setHarmonizing] = useState<boolean>(false);

  // Daily records available for aggregation
  const dailyRecords = useMemo(() => {
    return climateRecords.filter(r => r.period_type === 'JOUR');
  }, [climateRecords]);

  // Matrix of Monthly Coverage per station from 2022 to 2024
  const coverageMatrix = useMemo(() => {
    const years = [2022, 2023, 2024];
    return climateStations.map(st => {
      const yearStats = years.map(y => {
        const matches = climateRecords.filter(r => 
          (r.station_id === st.station_id || r.location_id === st.station_id || r.location_name === st.station_name) &&
          r.year === y
        );
        const uniqueMonths = new Set(matches.map(r => r.month).filter(Boolean));
        return {
          year: y,
          recordsCount: matches.length,
          monthsCount: uniqueMonths.size,
          complete: uniqueMonths.size === 12
        };
      });

      return {
        station: st,
        stats: yearStats
      };
    });
  }, [climateStations, climateRecords]);

  // Aggregate daily records into monthly summary records
  const handleHarmonizeDailyToMonthly = () => {
    if (dailyRecords.length === 0) {
      alert('Aucune donnée journalière brute détectée à harmoniser en mensuel.');
      return;
    }

    setHarmonizing(true);
    const newMonthlyRecords: ClimateRecord[] = [];
    const now = new Date().toISOString();

    // Group daily by (station, year, month)
    const groups = new Map<string, ClimateRecord[]>();
    dailyRecords.forEach(r => {
      if (!r.month || !r.year) return;
      const key = `${r.station_id || r.location_name}|${r.year}|${r.month}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(r);
    });

    groups.forEach((recs, k) => {
      const first = recs[0];
      const rainRecs = recs.filter(r => r.rainfall_mm !== null && r.rainfall_mm !== undefined);
      const sumRain = rainRecs.length > 0 ? Math.round(rainRecs.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0) * 10) / 10 : null;

      const tempRecs = recs.filter(r => (r.temp_mean_c ?? r.temperature_mean) !== null);
      const avgTemp = tempRecs.length > 0 
        ? Math.round((tempRecs.reduce((acc, c) => acc + (c.temp_mean_c ?? c.temperature_mean ?? 0), 0) / tempRecs.length) * 10) / 10 
        : null;

      const humRecs = recs.filter(r => (r.humidity_pct ?? r.humidity_percent) !== null);
      const avgHum = humRecs.length > 0 
        ? Math.round(humRecs.reduce((acc, c) => acc + (c.humidity_pct ?? c.humidity_percent ?? 0), 0) / humRecs.length) 
        : null;

      const id = `CLI-HARMONIZED-${Date.now()}-${first.year}-${String(first.month).padStart(2, '0')}`;

      newMonthlyRecords.push({
        id,
        climate_id: id,
        period_type: 'MOIS',
        date: `${first.year}-${String(first.month).padStart(2, '0')}-01`,
        record_date: null,
        year: first.year,
        month: first.month,
        spatial_resolution: first.spatial_resolution,
        station_id: first.station_id,
        location_id: first.location_id,
        location_name: first.location_name,
        latitude: first.latitude,
        longitude: first.longitude,
        health_zone_id: first.health_zone_id,
        health_area_id: first.health_area_id,
        rainfall_mm: sumRain,
        temperature_mean: avgTemp,
        temp_mean_c: avgTemp,
        humidity_percent: avgHum,
        humidity_pct: avgHum,
        source_type: first.source_type,
        source_name: `${first.source_name} (Harmonisé Journalier -> Mensuel)`,
        source_reference: `Calculé par consolidation de ${recs.length} relevés journaliers`,
        data_quality: 'HIGH',
        quality_reason: `Agrégation de ${recs.length} observations journalières complètes`,
        status: 'VALIDATED',
        is_demo: false,
        isDemoData: false,
        comments: `Harmonisation automatique pour analyse épidémiologique spatio-temporelle`,
        notes: `Harmonisation automatique pour analyse épidémiologique spatio-temporelle`,
        created_by: userSession.name,
        recorded_by: userSession.name,
        created_at: now,
        createdAt: now,
        updated_by: userSession.name,
        updated_at: now,
        updatedAt: now,
      });
    });

    if (newMonthlyRecords.length > 0) {
      bulkAddClimateRecords(newMonthlyRecords);
      alert(`Harmonisation terminée avec succès ! ${newMonthlyRecords.length} séries mensuelles créées sans écraser les données journalières d'origine.`);
    } else {
      alert('Aucune nouvelle série mensuelle à créer.');
    }
    setHarmonizing(false);
  };

  // Export Matrix
  const handleExportCoverage = () => {
    const rows: any[] = [];
    coverageMatrix.forEach(item => {
      item.stats.forEach(st => {
        rows.push({
          'STATION_ID': item.station.station_id,
          'STATION_NAME': item.station.station_name,
          'ANNEE': st.year,
          'MOIS_COUVRES': `${st.monthsCount} / 12`,
          'NB_RELEVES': st.recordsCount,
          'STATUT_SERIE': st.complete ? 'COMPLETE (100%)' : 'PARTIELLE'
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'COUVERTURE_TEMPORELLE');
    XLSX.writeFile(wb, `Couverture_Climatique_Kindu_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="bg-sky-500/20 text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-sky-400/30">
            Harmonisation Spatio-Temporelle
          </span>
          <h2 className="text-base font-bold text-white mt-1">
            Standardisation & Préparation pour la future Liaison Épidémiologique
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Agrégation des résolutions temporelles (Journalier &rarr; Mensuel) avec conservation stricte des séries brutes.
          </p>
        </div>

        <button
          onClick={handleHarmonizeDailyToMonthly}
          disabled={harmonizing || dailyRecords.length === 0}
          className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow transition inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${harmonizing ? 'animate-spin' : ''}`} />
          Harmoniser {dailyRecords.length} Relevés Journaliers
        </button>
      </div>

      {/* Coverage Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Matrice de Couverture Temporelle Continue (2022 - 2024)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Évaluation de l'exhaustivité des séries historiques par station et par année
            </p>
          </div>

          <button
            onClick={handleExportCoverage}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Exporter la Matrice
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Code</th>
                <th className="px-3.5 py-2.5">Nom de la Station</th>
                <th className="px-3.5 py-2.5 text-center">Année 2022</th>
                <th className="px-3.5 py-2.5 text-center">Année 2023</th>
                <th className="px-3.5 py-2.5 text-center">Année 2024</th>
                <th className="px-3.5 py-2.5 text-right">Complétude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {coverageMatrix.map((item) => {
                const totalMonths = item.stats.reduce((acc, c) => acc + c.monthsCount, 0);
                const pct = Math.round((totalMonths / (3 * 12)) * 100);

                return (
                  <tr key={item.station.station_id} className="hover:bg-slate-50 transition">
                    <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">{item.station.station_id}</td>
                    <td className="px-3.5 py-2.5 font-medium text-slate-800">{item.station.station_name}</td>
                    {item.stats.map(s => (
                      <td key={s.year} className="px-3.5 py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          s.complete ? 'bg-emerald-100 text-emerald-800' :
                          s.monthsCount > 0 ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {s.monthsCount} / 12 mois
                        </span>
                      </td>
                    ))}
                    <td className="px-3.5 py-2.5 text-right font-bold text-slate-900">
                      <span className={`${pct >= 80 ? 'text-emerald-700' : pct >= 40 ? 'text-sky-700' : 'text-amber-700'}`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Framework Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Intégrité Scientifique One Health Kindu :</span>
          <p className="text-emerald-800 leading-relaxed">
            Les règles d'harmonisation conservent séparément les séries brutes des séries calculées. Aucune extrapolation spatiale automatique n'est appliquée sans validation préalable des coordonnées géographiques.
          </p>
        </div>
      </div>
    </div>
  );
};
