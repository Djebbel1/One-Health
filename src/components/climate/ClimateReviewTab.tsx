import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  MapPin,
  Thermometer,
  CloudRain,
  Droplets,
  Layers,
  FileText,
  Clock,
  UserCheck,
  X,
  Save,
  CloudSun
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ClimateRecord, RecordStatus, ClimateDataQuality } from '../../types';
import * as XLSX from 'xlsx';

interface ClimateReviewTabProps {
  onEditRecord: (record: ClimateRecord) => void;
}

export const ClimateReviewTab: React.FC<ClimateReviewTabProps> = ({ onEditRecord }) => {
  const {
    climateRecords,
    deleteClimateRecord,
    recordClimateCorrection,
    climateStations,
    climateSources,
    userSession
  } = useData();

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterMonth, setFilterMonth] = useState<string>('ALL');
  const [filterStation, setFilterStation] = useState<string>('ALL');
  const [filterQuality, setFilterQuality] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal / Detail state
  const [detailRecord, setDetailRecord] = useState<ClimateRecord | null>(null);
  const [correctionRecord, setCorrectionRecord] = useState<ClimateRecord | null>(null);
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [corrRainfall, setCorrRainfall] = useState<string>('');
  const [corrTempMean, setCorrTempMean] = useState<string>('');
  const [corrHumidity, setCorrHumidity] = useState<string>('');

  // Filter logic
  const filteredRecords = useMemo(() => {
    return climateRecords.filter(r => {
      if (filterYear !== 'ALL' && r.year !== parseInt(filterYear, 10)) return false;
      if (filterMonth !== 'ALL' && r.month !== parseInt(filterMonth, 10)) return false;
      if (filterQuality !== 'ALL' && r.data_quality !== filterQuality) return false;
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      if (filterStation !== 'ALL') {
        const match = r.station_id === filterStation || r.location_name === filterStation || r.location_id === filterStation;
        if (!match) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${r.climate_id || r.id} ${r.location_name || ''} ${r.source_name || ''} ${r.comments || ''} ${r.notes || ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [climateRecords, filterYear, filterMonth, filterStation, filterQuality, filterStatus, searchQuery]);

  // Export filtered subset
  const handleExportData = (format: 'EXCEL' | 'CSV' | 'JSON') => {
    if (format === 'JSON') {
      const blob = new Blob([JSON.stringify(filteredRecords, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Donnees_Climatiques_Kindu_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      return;
    }

    const exportRows = filteredRecords.map(r => ({
      'ID_CLIMAT': r.climate_id || r.id,
      'RESOLUTION_TEMPORELLE': r.period_type || 'MOIS',
      'DATE_OBSERVATION': r.record_date || r.date,
      'ANNEE': r.year,
      'MOIS': r.month,
      'SEMAINE': r.week || '',
      'STATION_OU_LIEU': r.location_name,
      'LATITUDE': r.latitude,
      'LONGITUDE': r.longitude,
      'PLUVIOMETRIE_MM': r.rainfall_mm,
      'TEMPERATURE_MOYENNE_C': r.temp_mean_c ?? r.temperature_mean,
      'TEMPERATURE_MIN_C': r.temp_min_c ?? r.temperature_min,
      'TEMPERATURE_MAX_C': r.temp_max_c ?? r.temperature_max,
      'HUMIDITE_RELATIVE_POURCENT': r.humidity_pct ?? r.humidity_percent,
      'VITESSE_VENT_KMH': r.wind_speed_kmh,
      'NIVEAU_FLEUVE_M': r.river_level_m,
      'SOURCE_NOM': r.source_name,
      'SOURCE_TYPE': r.source_type,
      'SOURCE_REFERENCE': r.source_reference,
      'QUALITE': r.data_quality || 'HIGH',
      'STATUT': r.status,
      'ENREGISTRE_PAR': r.recorded_by || r.created_by,
      'DATE_CREATION': r.created_at || r.createdAt
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DONNEES_CLIMAT');

    if (format === 'EXCEL') {
      XLSX.writeFile(wb, `Donnees_Climatiques_Kindu_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      XLSX.writeFile(wb, `Donnees_Climatiques_Kindu_${new Date().toISOString().split('T')[0]}.csv`, { bookType: 'csv' });
    }
  };

  // Open correction modal
  const handleOpenCorrection = (r: ClimateRecord) => {
    setCorrectionRecord(r);
    setCorrRainfall(r.rainfall_mm !== null && r.rainfall_mm !== undefined ? String(r.rainfall_mm) : '');
    setCorrTempMean((r.temp_mean_c ?? r.temperature_mean) !== null ? String(r.temp_mean_c ?? r.temperature_mean) : '');
    setCorrHumidity((r.humidity_pct ?? r.humidity_percent) !== null ? String(r.humidity_pct ?? r.humidity_percent) : '');
    setCorrectionReason('');
  };

  const handleSaveCorrection = () => {
    if (!correctionRecord) return;
    if (!correctionReason.trim()) {
      alert('Veuillez indiquer un motif obligatoire pour justifier cette correction scientifique.');
      return;
    }

    const updates: Partial<ClimateRecord> = {
      rainfall_mm: corrRainfall !== '' ? parseFloat(corrRainfall) : null,
      temperature_mean: corrTempMean !== '' ? parseFloat(corrTempMean) : null,
      temp_mean_c: corrTempMean !== '' ? parseFloat(corrTempMean) : null,
      humidity_percent: corrHumidity !== '' ? parseFloat(corrHumidity) : null,
      humidity_pct: corrHumidity !== '' ? parseFloat(corrHumidity) : null,
      status: 'VALIDATED'
    };

    recordClimateCorrection(correctionRecord.id, updates, correctionReason);
    setCorrectionRecord(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par ID, station, source, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportData('EXCEL')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Excel
            </button>
            <button
              onClick={() => handleExportData('CSV')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Année</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="ALL">Toutes les années</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mois</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="ALL">Tous les mois</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m.toString()}>Mois {m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Station</label>
            <select
              value={filterStation}
              onChange={(e) => setFilterStation(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium truncate"
            >
              <option value="ALL">Toutes les stations</option>
              {climateStations.map(s => (
                <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qualité</label>
            <select
              value={filterQuality}
              onChange={(e) => setFilterQuality(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="ALL">Toutes qualités</option>
              <option value="HIGH">HIGH (Élevée)</option>
              <option value="MEDIUM">MEDIUM (Moyenne)</option>
              <option value="LOW">LOW (Faible)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="ALL">Tous statuts</option>
              <option value="VALIDATED">VALIDATED (Validé)</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW (À vérifier)</option>
              <option value="DRAFT">DRAFT (Brouillon)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            {filteredRecords.length} relevé(s) climatique(s) trouvé(s)
          </span>
          <span className="text-[11px] text-slate-500">
            Valeurs 'N/D' = Mesure manquante préservée
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-3">ID & Période</th>
                <th className="px-3.5 py-3">Station / Localisation</th>
                <th className="px-3.5 py-3">Pluie (mm)</th>
                <th className="px-3.5 py-3">Tmoy (°C)</th>
                <th className="px-3.5 py-3">Tmin / Tmax</th>
                <th className="px-3.5 py-3">Humidité</th>
                <th className="px-3.5 py-3">Source & Qualité</th>
                <th className="px-3.5 py-3">Statut</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.map(rec => {
                const tMean = rec.temp_mean_c ?? rec.temperature_mean;
                const tMin = rec.temp_min_c ?? rec.temperature_min;
                const tMax = rec.temp_max_c ?? rec.temperature_max;
                const hum = rec.humidity_pct ?? rec.humidity_percent;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-3.5 py-3">
                      <div className="font-mono font-bold text-slate-900">{rec.climate_id || rec.id}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {rec.record_date || `${rec.month ? String(rec.month).padStart(2, '0') + '/' : ''}${rec.year}`}
                      </div>
                    </td>

                    <td className="px-3.5 py-3">
                      <div className="font-medium text-slate-900 line-clamp-1">{rec.location_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {rec.latitude ? `${rec.latitude.toFixed(3)}°, ${rec.longitude?.toFixed(3)}°` : 'Coord. N/D'}
                      </div>
                    </td>

                    <td className="px-3.5 py-3">
                      {rec.rainfall_mm !== null && rec.rainfall_mm !== undefined ? (
                        <span className="font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {rec.rainfall_mm} mm
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">N/D</span>
                      )}
                    </td>

                    <td className="px-3.5 py-3">
                      {tMean !== null && tMean !== undefined ? (
                        <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {tMean} °C
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">N/D</span>
                      )}
                    </td>

                    <td className="px-3.5 py-3 text-slate-600 font-mono">
                      {tMin ?? '-'} / {tMax ?? '-'} °C
                    </td>

                    <td className="px-3.5 py-3">
                      {hum !== null && hum !== undefined ? `${hum}%` : <span className="text-slate-400">-</span>}
                    </td>

                    <td className="px-3.5 py-3">
                      <div className="line-clamp-1 text-slate-800 font-medium">{rec.source_name}</div>
                      <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        rec.data_quality === 'HIGH' ? 'bg-emerald-100 text-emerald-800' :
                        rec.data_quality === 'MEDIUM' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.data_quality || 'HIGH'}
                      </span>
                    </td>

                    <td className="px-3.5 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.status === 'VALIDATED' ? 'bg-emerald-100 text-emerald-800' :
                        rec.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rec.status === 'VALIDATED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {rec.status}
                      </span>
                    </td>

                    <td className="px-3.5 py-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setDetailRecord(rec)}
                        title="Voir détails complets"
                        className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenCorrection(rec)}
                        title="Corriger avec motif d'audit"
                        className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Confirmer la suppression du relevé ${rec.climate_id || rec.id} ?`)) {
                            deleteClimateRecord(rec.id);
                          }
                        }}
                        title="Supprimer"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Détail d'Observation Climatique : {detailRecord.climate_id || detailRecord.id}
                </h3>
              </div>
              <button
                onClick={() => setDetailRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Résolution & Période</span>
                <p className="font-semibold text-slate-800">
                  {detailRecord.period_type || 'MOIS'} • Année {detailRecord.year} {detailRecord.month ? `(Mois ${detailRecord.month})` : ''}
                </p>
                <p className="text-slate-600">Date : {detailRecord.record_date || detailRecord.date}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-500 uppercase text-[10px]">Localisation</span>
                <p className="font-semibold text-slate-800">{detailRecord.location_name}</p>
                <p className="text-slate-600 font-mono">
                  {detailRecord.latitude}° N, {detailRecord.longitude}° E
                </p>
              </div>

              <div className="bg-sky-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-sky-900 uppercase text-[10px]">Précipitations</span>
                <p className="text-lg font-black text-sky-950">
                  {detailRecord.rainfall_mm !== null && detailRecord.rainfall_mm !== undefined ? `${detailRecord.rainfall_mm} mm` : 'N/D'}
                </p>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 uppercase text-[10px]">Températures</span>
                <p className="text-lg font-black text-amber-950">
                  Moyenne : {detailRecord.temp_mean_c ?? detailRecord.temperature_mean ?? 'N/D'} °C
                </p>
                <p className="text-amber-800 text-[11px]">
                  Min: {detailRecord.temp_min_c ?? detailRecord.temperature_min ?? 'N/D'}°C • Max: {detailRecord.temp_max_c ?? detailRecord.temperature_max ?? 'N/D'}°C
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Métadonnées de Source & Traçabilité
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Source :</strong> {detailRecord.source_name}</div>
                <div><strong>Type :</strong> {detailRecord.source_type}</div>
                <div className="col-span-2"><strong>Référence :</strong> {detailRecord.source_reference || 'Non spécifiée'}</div>
                <div><strong>Qualité :</strong> {detailRecord.data_quality} ({detailRecord.quality_reason || 'Standard'})</div>
                <div><strong>Enregistré par :</strong> {detailRecord.recorded_by || detailRecord.created_by}</div>
              </div>
            </div>

            {/* Audit Corrections History */}
            {detailRecord.corrections_history && detailRecord.corrections_history.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Historique des Corrections Scientifiques ({detailRecord.corrections_history.length})
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {detailRecord.corrections_history.map(c => (
                    <div key={c.id} className="p-2 bg-white rounded border border-amber-200 text-[11px]">
                      <div className="font-semibold text-slate-800">
                        {c.corrected_by} • {new Date(c.corrected_at).toLocaleString('fr-FR')}
                      </div>
                      <div className="text-amber-900 mt-0.5">Motif : {c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setDetailRecord(null);
                  onEditRecord(detailRecord);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Modifier dans le formulaire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Modal with Mandatory Reason */}
      {correctionRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                Correction Traceable de la Donnée
              </h3>
              <button onClick={() => setCorrectionRecord(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pluviométrie (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={corrRainfall}
                  onChange={(e) => setCorrRainfall(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Température Moyenne (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={corrTempMean}
                  onChange={(e) => setCorrTempMean(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Humidité Relative (%)</label>
                <input
                  type="number"
                  step="1"
                  value={corrHumidity}
                  onChange={(e) => setCorrHumidity(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-950 mb-1">
                  Motif Scientifique de Correction <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  rows={3}
                  placeholder="Ex: Correction suite à vérification sur le registre manuscrit original de la station METTELSAT..."
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setCorrectionRecord(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Valider la correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
