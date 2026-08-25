import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Merge,
  ShieldCheck,
  Info,
  Calendar,
  MapPin,
  Thermometer,
  CloudRain,
  Droplets,
  RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ClimateRecord } from '../../types';

export const ClimateQualityTab: React.FC<{ onOpenEdit: (rec: ClimateRecord) => void }> = ({ onOpenEdit }) => {
  const {
    climateRecords,
    resolveClimateDuplicate,
    deleteClimateRecord,
    updateClimateRecord,
    recordClimateCorrection
  } = useData();

  const [activeSubSection, setActiveSubSection] = useState<'ANOMALIES' | 'DUPLICATES' | 'MISSING_CHECK'>('ANOMALIES');

  // Detect Physical Inconsistencies
  const anomalies = useMemo(() => {
    const list: { record: ClimateRecord; type: 'ERROR' | 'WARNING'; message: string }[] = [];

    climateRecords.forEach(r => {
      const tMean = r.temp_mean_c ?? r.temperature_mean;
      const tMin = r.temp_min_c ?? r.temperature_min;
      const tMax = r.temp_max_c ?? r.temperature_max;
      const rain = r.rainfall_mm;
      const hum = r.humidity_pct ?? r.humidity_percent;

      // Rainfall errors
      if (rain !== null && rain !== undefined) {
        if (rain < 0) {
          list.push({ record: r, type: 'ERROR', message: `Pluviométrie négative (${rain} mm) physiquement impossible.` });
        } else if (rain > 600 && r.period_type === 'JOUR') {
          list.push({ record: r, type: 'WARNING', message: `Pluviométrie journalière record (${rain} mm). À confirmer auprès de la station.` });
        }
      }

      // Temperatures errors
      if (tMin !== null && tMax !== null && tMin !== undefined && tMax !== undefined) {
        if (tMin > tMax) {
          list.push({ record: r, type: 'ERROR', message: `Tmin (${tMin}°C) strictement supérieure à Tmax (${tMax}°C).` });
        }
      }

      if (tMean !== null && tMin !== null && tMean !== undefined && tMin !== undefined) {
        if (tMean < tMin) {
          list.push({ record: r, type: 'ERROR', message: `Tmoyenne (${tMean}°C) inférieure à Tmin (${tMin}°C).` });
        }
      }

      if (tMean !== null && tMax !== null && tMean !== undefined && tMax !== undefined) {
        if (tMean > tMax) {
          list.push({ record: r, type: 'ERROR', message: `Tmoyenne (${tMean}°C) supérieure à Tmax (${tMax}°C).` });
        }
      }

      if (tMean !== null && tMean !== undefined && (tMean < 10 || tMean > 45)) {
        list.push({ record: r, type: 'WARNING', message: `Température moyenne (${tMean}°C) atypique pour le climat de Kindu (15°C - 38°C).` });
      }

      // Humidity errors
      if (hum !== null && hum !== undefined) {
        if (hum < 0 || hum > 100) {
          list.push({ record: r, type: 'ERROR', message: `Humidité (${hum}%) hors limites valides [0% - 100%].` });
        }
      }
    });

    return list;
  }, [climateRecords]);

  // Detect Potential Duplicates (Same period, station/location, source)
  const duplicateGroups = useMemo(() => {
    const groups: { key: string; records: ClimateRecord[] }[] = [];
    const map = new Map<string, ClimateRecord[]>();

    climateRecords.forEach(r => {
      const key = `${r.station_id || r.location_name}|${r.year}|${r.month || 0}|${r.record_date || ''}|${r.source_name || ''}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(r);
    });

    map.forEach((recs, k) => {
      if (recs.length > 1) {
        groups.push({ key: k, records: recs });
      }
    });

    return groups;
  }, [climateRecords]);

  // Missing Values (Null check vs zero)
  const missingValuesList = useMemo(() => {
    return climateRecords.filter(r => {
      return r.rainfall_mm === null || (r.temp_mean_c ?? r.temperature_mean) === null || (r.humidity_pct ?? r.humidity_percent) === null;
    });
  }, [climateRecords]);

  // Merge duplicates handler
  const handleMergeDuplicate = (keepId: string, removeId: string) => {
    const keep = climateRecords.find(r => r.id === keepId);
    const remove = climateRecords.find(r => r.id === removeId);
    if (!keep || !remove) return;

    const merged: ClimateRecord = {
      ...keep,
      rainfall_mm: keep.rainfall_mm ?? remove.rainfall_mm,
      temperature_mean: keep.temperature_mean ?? remove.temperature_mean,
      temp_mean_c: keep.temp_mean_c ?? remove.temp_mean_c,
      temperature_min: keep.temperature_min ?? remove.temperature_min,
      temp_min_c: keep.temp_min_c ?? remove.temp_min_c,
      temperature_max: keep.temperature_max ?? remove.temperature_max,
      temp_max_c: keep.temp_max_c ?? remove.temp_max_c,
      humidity_percent: keep.humidity_percent ?? remove.humidity_percent,
      humidity_pct: keep.humidity_pct ?? remove.humidity_pct,
      comments: `${keep.comments || ''} | Fusionné avec ${remove.climate_id || remove.id}`.trim(),
      notes: `${keep.notes || ''} | Fusionné avec ${remove.climate_id || remove.id}`.trim(),
      isPotentialDuplicate: false,
      status: 'VALIDATED'
    };

    updateClimateRecord(merged, `Fusion avec ${remove.climate_id || remove.id}`);
    deleteClimateRecord(removeId);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubSection('ANOMALIES')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 ${
            activeSubSection === 'ANOMALIES'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Anomalies & Incohérences ({anomalies.length})
        </button>

        <button
          onClick={() => setActiveSubSection('DUPLICATES')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 ${
            activeSubSection === 'DUPLICATES'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Copy className="w-4 h-4" />
          Doublons Potentiels ({duplicateGroups.length})
        </button>

        <button
          onClick={() => setActiveSubSection('MISSING_CHECK')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 ${
            activeSubSection === 'MISSING_CHECK'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Absence vs Zéro ({missingValuesList.length})
        </button>
      </div>

      {/* 1. Anomalies View */}
      {activeSubSection === 'ANOMALIES' && (
        <div className="space-y-4">
          {anomalies.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold">Aucune anomalie physique détectée</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Toutes les températures (Tmin ≤ Tmoy ≤ Tmax), pluviométries (≥ 0) et humidités (0-100%) respectent les lois physiques.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                    item.type === 'ERROR' ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        item.type === 'ERROR' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {item.type === 'ERROR' ? 'Erreur Bloquante' : 'Avertissement'}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {item.record.climate_id || item.record.id}
                      </span>
                      <span className="text-xs text-slate-500">• {item.record.location_name} ({item.record.year})</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{item.message}</p>
                    <p className="text-[11px] text-slate-600">
                      Pluie : {item.record.rainfall_mm ?? 'N/D'} mm | Temp : {item.record.temp_mean_c ?? item.record.temperature_mean ?? 'N/D'}°C (Min: {item.record.temp_min_c ?? item.record.temperature_min ?? 'N/D'}°C, Max: {item.record.temp_max_c ?? item.record.temperature_max ?? 'N/D'}°C)
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenEdit(item.record)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-sm whitespace-nowrap"
                  >
                    Corriger l'enregistrement
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Duplicates View */}
      {activeSubSection === 'DUPLICATES' && (
        <div className="space-y-4">
          {duplicateGroups.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold">Aucun conflit de doublons détecté</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Toutes les séries temporelles pour chaque station et source sont uniques.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicateGroups.map((group, gIdx) => (
                <div key={gIdx} className="bg-white border border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-2">
                      <Copy className="w-4 h-4 text-amber-600" />
                      Groupe en conflit : {group.records.length} relevés identifiés pour la même période
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Clé: {group.key}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.records.map((r, rIdx) => (
                      <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between font-mono font-bold">
                          <span>{r.climate_id || r.id}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                            {r.status}
                          </span>
                        </div>
                        <div className="text-slate-700">
                          <div><strong>Station :</strong> {r.location_name}</div>
                          <div><strong>Période :</strong> {r.record_date || `${r.month}/${r.year}`}</div>
                          <div><strong>Pluie :</strong> {r.rainfall_mm !== null ? `${r.rainfall_mm} mm` : 'N/D'}</div>
                          <div><strong>Tmoy :</strong> {r.temp_mean_c ?? r.temperature_mean ?? 'N/D'} °C</div>
                          <div><strong>Source :</strong> {r.source_name}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                          {rIdx === 0 && group.records[1] && (
                            <button
                              onClick={() => handleMergeDuplicate(r.id, group.records[1].id)}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] rounded inline-flex items-center gap-1"
                            >
                              <Merge className="w-3 h-3" />
                              Fusionner dans ce relevé
                            </button>
                          )}
                          <button
                            onClick={() => resolveClimateDuplicate(r.id, 'DISMISS')}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded border border-slate-200"
                          >
                            Conserver distinct
                          </button>
                          <button
                            onClick={() => deleteClimateRecord(r.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Supprimer ce doublon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Missing Values Check */}
      {activeSubSection === 'MISSING_CHECK' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-900 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Garantie Scientifique : Préservation des Données Manquantes (NULL $\neq$ 0)
            </div>
            <p className="text-sky-800">
              Dans la base V1.4, les valeurs ci-dessous sont explicitement stockées à <code className="bg-sky-200/60 px-1 py-0.5 rounded font-mono">null</code> pour éviter d'induire en erreur les futurs modèles épidémiologiques. Une absence de relevé pluviométrique n'est <strong>JAMAIS</strong> assimilée à 0 mm (absence de pluie).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
              {missingValuesList.length} relevés avec une ou plusieurs mesures non disponibles (N/D) :
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">ID Relevé</th>
                    <th className="px-3 py-2">Période</th>
                    <th className="px-3 py-2">Station</th>
                    <th className="px-3 py-2">Pluie</th>
                    <th className="px-3 py-2">Température Moyenne</th>
                    <th className="px-3 py-2">Humidité</th>
                    <th className="px-3 py-2">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {missingValuesList.slice(0, 15).map(r => (
                    <tr key={r.id}>
                      <td className="px-3 py-2 font-mono font-bold">{r.climate_id || r.id}</td>
                      <td className="px-3 py-2">{r.record_date || `${r.month}/${r.year}`}</td>
                      <td className="px-3 py-2">{r.location_name}</td>
                      <td className="px-3 py-2">
                        {r.rainfall_mm !== null ? `${r.rainfall_mm} mm` : <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">NULL (Non mesuré)</span>}
                      </td>
                      <td className="px-3 py-2">
                        {(r.temp_mean_c ?? r.temperature_mean) !== null ? `${r.temp_mean_c ?? r.temperature_mean} °C` : <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">NULL (Non mesuré)</span>}
                      </td>
                      <td className="px-3 py-2">
                        {(r.humidity_pct ?? r.humidity_percent) !== null ? `${r.humidity_pct ?? r.humidity_percent}%` : <span className="text-slate-400">NULL</span>}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{r.source_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
