import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  CloudSun,
  Thermometer,
  CloudRain,
  Droplets,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  ClimateRecord,
  PeriodType,
  SpatialResolution,
  ClimateSourceType,
  ClimateDataQuality,
  RecordStatus
} from '../../types';
import { KINDU_HEALTH_ZONES, KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

interface ClimateFormTabProps {
  initialRecord?: ClimateRecord | null;
  onSaved: () => void;
  onCancel: () => void;
}

export const ClimateFormTab: React.FC<ClimateFormTabProps> = ({
  initialRecord,
  onSaved,
  onCancel
}) => {
  const {
    addClimateRecord,
    updateClimateRecord,
    generateNextClimateId,
    climateStations,
    climateSources,
    userSession
  } = useData();

  const isEditing = !!initialRecord;

  // 1. Période & Résolution Temporelle
  const [periodType, setPeriodType] = useState<PeriodType>(initialRecord?.period_type || 'MOIS');
  const [recordDate, setRecordDate] = useState<string>(initialRecord?.record_date || '');
  const [year, setYear] = useState<number>(initialRecord?.year || 2024);
  const [month, setMonth] = useState<string>(initialRecord?.month ? String(initialRecord.month) : '4');
  const [week, setWeek] = useState<string>(initialRecord?.week ? String(initialRecord.week) : '');

  // 2. Localisation & Résolution Spatiale
  const [spatialResolution, setSpatialResolution] = useState<SpatialResolution>(initialRecord?.spatial_resolution || 'STATION');
  const [stationId, setStationId] = useState<string>(initialRecord?.station_id || (climateStations[0]?.station_id || ''));
  const [locationName, setLocationName] = useState<string>(initialRecord?.location_name || 'Station Synoptique Kindu-Aéroport (FZOA / METTELSAT)');
  const [latitude, setLatitude] = useState<string>(initialRecord?.latitude !== undefined && initialRecord?.latitude !== null ? String(initialRecord.latitude) : '-2.9197');
  const [longitude, setLongitude] = useState<string>(initialRecord?.longitude !== undefined && initialRecord?.longitude !== null ? String(initialRecord.longitude) : '25.9150');
  const [healthZoneId, setHealthZoneId] = useState<string>(initialRecord?.health_zone_id || 'ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>(initialRecord?.health_area_id || '');

  // 3. Variables Climatiques (String state to support empty / NULL without forcing 0)
  const [rainfallMm, setRainfallMm] = useState<string>(
    initialRecord?.rainfall_mm !== null && initialRecord?.rainfall_mm !== undefined ? String(initialRecord.rainfall_mm) : ''
  );
  const [tempMean, setTempMean] = useState<string>(
    (initialRecord?.temp_mean_c ?? initialRecord?.temperature_mean) !== null && (initialRecord?.temp_mean_c ?? initialRecord?.temperature_mean) !== undefined
      ? String(initialRecord?.temp_mean_c ?? initialRecord?.temperature_mean)
      : ''
  );
  const [tempMin, setTempMin] = useState<string>(
    (initialRecord?.temp_min_c ?? initialRecord?.temperature_min) !== null && (initialRecord?.temp_min_c ?? initialRecord?.temperature_min) !== undefined
      ? String(initialRecord?.temp_min_c ?? initialRecord?.temperature_min)
      : ''
  );
  const [tempMax, setTempMax] = useState<string>(
    (initialRecord?.temp_max_c ?? initialRecord?.temperature_max) !== null && (initialRecord?.temp_max_c ?? initialRecord?.temperature_max) !== undefined
      ? String(initialRecord?.temp_max_c ?? initialRecord?.temperature_max)
      : ''
  );
  const [humidity, setHumidity] = useState<string>(
    (initialRecord?.humidity_pct ?? initialRecord?.humidity_percent) !== null && (initialRecord?.humidity_pct ?? initialRecord?.humidity_percent) !== undefined
      ? String(initialRecord?.humidity_pct ?? initialRecord?.humidity_percent)
      : ''
  );
  const [windSpeed, setWindSpeed] = useState<string>(
    initialRecord?.wind_speed_kmh !== null && initialRecord?.wind_speed_kmh !== undefined ? String(initialRecord.wind_speed_kmh) : ''
  );
  const [pressureHpa, setPressureHpa] = useState<string>(
    initialRecord?.atmospheric_pressure_hpa !== null && initialRecord?.atmospheric_pressure_hpa !== undefined ? String(initialRecord.atmospheric_pressure_hpa) : ''
  );
  const [riverLevel, setRiverLevel] = useState<string>(
    initialRecord?.river_level_m !== null && initialRecord?.river_level_m !== undefined ? String(initialRecord.river_level_m) : ''
  );
  const [floodingObserved, setFloodingObserved] = useState<boolean>(initialRecord?.flooding_observed || false);

  // 4. Source de Données
  const [sourceType, setSourceType] = useState<ClimateSourceType>(initialRecord?.source_type || 'STATION_METEOROLOGIQUE');
  const [sourceName, setSourceName] = useState<string>(initialRecord?.source_name || (climateSources[0]?.source_name || 'METTELSAT RDC - Station Synoptique FZOA Kindu'));
  const [sourceReference, setSourceReference] = useState<string>(initialRecord?.source_reference || '');
  const [sourceUrl, setSourceUrl] = useState<string>(initialRecord?.source_url || '');

  // 5. Qualité & Audit
  const [dataQuality, setDataQuality] = useState<ClimateDataQuality>(initialRecord?.data_quality || 'HIGH');
  const [qualityReason, setQualityReason] = useState<string>(initialRecord?.quality_reason || 'Station météorologique directe');
  const [comments, setComments] = useState<string>(initialRecord?.comments || initialRecord?.notes || '');
  const [status, setStatus] = useState<RecordStatus>(initialRecord?.status || 'VALIDATED');

  // Validation feedback
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [warnings, setWarnings] = useState<string[]>([]);

  // Station sync helper
  const handleStationChange = (id: string) => {
    setStationId(id);
    const found = climateStations.find(s => s.station_id === id);
    if (found) {
      setLocationName(found.station_name);
      setLatitude(String(found.latitude));
      setLongitude(String(found.longitude));
      if (found.health_zone_id) setHealthZoneId(found.health_zone_id);
      if (found.health_area_id) setHealthAreaId(found.health_area_id);
    }
  };

  // Source sync helper
  const handleSourceSelect = (srcId: string) => {
    const found = climateSources.find(s => s.source_id === srcId);
    if (found) {
      setSourceName(found.source_name);
      setSourceType(found.source_type);
      setSourceReference(found.reference || '');
      setSourceUrl(found.url || '');
    }
  };

  // Real-time Validation Check
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    const newWarnings: string[] = [];

    // Mandatory
    if (!year || isNaN(year) || year < 1980 || year > 2030) {
      newErrors.year = 'Année requise entre 1980 et 2030.';
    }
    if (!locationName.trim()) {
      newErrors.locationName = 'Nom de la localisation ou station requis.';
    }
    if (!sourceName.trim()) {
      newErrors.sourceName = 'Nom de la source requis.';
    }

    if (periodType === 'JOUR' && !recordDate) {
      newErrors.recordDate = 'Date exacte requise pour une résolution journalière.';
    }
    if (periodType === 'MOIS' && (!month || parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
      newErrors.month = 'Mois requis (1-12) pour une résolution mensuelle.';
    }

    // Number conversion checks
    const rVal = rainfallMm !== '' ? parseFloat(rainfallMm) : null;
    const tMeanVal = tempMean !== '' ? parseFloat(tempMean) : null;
    const tMinVal = tempMin !== '' ? parseFloat(tempMin) : null;
    const tMaxVal = tempMax !== '' ? parseFloat(tempMax) : null;
    const humVal = humidity !== '' ? parseFloat(humidity) : null;

    if (rVal !== null) {
      if (isNaN(rVal) || rVal < 0) {
        newErrors.rainfall = 'La pluviométrie doit être supérieure ou égale à 0 mm (ou vide si non mesurée).';
      } else if (rVal > 800) {
        newWarnings.push(`⚠️ Pluviométrie très élevée (${rVal} mm). Vérifiez s'il s'agit d'un cumul saisonnier ou d'une anomalie.`);
      }
    }

    if (humVal !== null) {
      if (isNaN(humVal) || humVal < 0 || humVal > 100) {
        newErrors.humidity = "L'humidité relative doit être comprise entre 0% et 100%.";
      }
    }

    if (tMinVal !== null && tMaxVal !== null) {
      if (tMinVal > tMaxVal) {
        newErrors.tempRange = `Incohérence physique : Température minimale (${tMinVal}°C) supérieure à la maximale (${tMaxVal}°C).`;
      }
    }

    if (tMeanVal !== null && tMinVal !== null && tMeanVal < tMinVal) {
      newErrors.tempMeanMin = `Incohérence : Température moyenne (${tMeanVal}°C) inférieure à la minimale (${tMinVal}°C).`;
    }

    if (tMeanVal !== null && tMaxVal !== null && tMeanVal > tMaxVal) {
      newErrors.tempMeanMax = `Incohérence : Température moyenne (${tMeanVal}°C) supérieure à la maximale (${tMaxVal}°C).`;
    }

    // Absence check notification
    if (rVal === null && tMeanVal === null && tMinVal === null && tMaxVal === null) {
      newWarnings.push("ℹ️ Aucune variable météorologique principale renseignée. Le système conservera ces valeurs à NULL (Absence ≠ Zéro).");
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
  }, [
    periodType, recordDate, year, month, locationName, sourceName,
    rainfallMm, tempMean, tempMin, tempMax, humidity
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const rVal = rainfallMm !== '' ? parseFloat(rainfallMm) : null;
    const tMeanVal = tempMean !== '' ? parseFloat(tempMean) : null;
    const tMinVal = tempMin !== '' ? parseFloat(tempMin) : null;
    const tMaxVal = tempMax !== '' ? parseFloat(tempMax) : null;
    const humVal = humidity !== '' ? parseFloat(humidity) : null;
    const latVal = latitude !== '' ? parseFloat(latitude) : null;
    const lngVal = longitude !== '' ? parseFloat(longitude) : null;
    const windVal = windSpeed !== '' ? parseFloat(windSpeed) : null;
    const pressVal = pressureHpa !== '' ? parseFloat(pressureHpa) : null;
    const riverVal = riverLevel !== '' ? parseFloat(riverLevel) : null;

    const mVal = month !== '' ? parseInt(month, 10) : null;
    const wVal = week !== '' ? parseInt(week, 10) : null;

    const now = new Date().toISOString();

    if (isEditing && initialRecord) {
      const updated: ClimateRecord = {
        ...initialRecord,
        period_type: periodType,
        record_date: recordDate || null,
        date: recordDate || `${year}-${String(mVal || 1).padStart(2, '0')}-01`,
        year,
        month: mVal,
        week: wVal,
        spatial_resolution: spatialResolution,
        station_id: stationId || null,
        location_id: stationId || null,
        location_name: locationName,
        latitude: latVal,
        longitude: lngVal,
        health_zone_id: healthZoneId || null,
        health_area_id: healthAreaId || null,
        rainfall_mm: rVal,
        temperature_mean: tMeanVal,
        temp_mean_c: tMeanVal,
        temperature_min: tMinVal,
        temp_min_c: tMinVal,
        temperature_max: tMaxVal,
        temp_max_c: tMaxVal,
        humidity_percent: humVal,
        humidity_pct: humVal,
        wind_speed_kmh: windVal,
        atmospheric_pressure_hpa: pressVal,
        river_level_m: riverVal,
        flooding_observed: floodingObserved,
        source_type: sourceType,
        source_name: sourceName,
        source_reference: sourceReference || null,
        source_url: sourceUrl || null,
        data_quality: dataQuality,
        quality_reason: qualityReason || null,
        comments: comments || null,
        notes: comments || '',
        status,
        updated_by: userSession.name,
        updated_at: now,
        updatedAt: now,
      };

      updateClimateRecord(updated, `Modification du relevé climatique ${updated.climate_id}`);
    } else {
      const newId = generateNextClimateId();
      const newRecord: ClimateRecord = {
        id: newId,
        climate_id: newId,
        period_type: periodType,
        record_date: recordDate || null,
        date: recordDate || `${year}-${String(mVal || 1).padStart(2, '0')}-01`,
        year,
        month: mVal,
        week: wVal,
        spatial_resolution: spatialResolution,
        station_id: stationId || null,
        location_id: stationId || null,
        location_name: locationName,
        latitude: latVal,
        longitude: lngVal,
        health_zone_id: healthZoneId || null,
        health_area_id: healthAreaId || null,
        rainfall_mm: rVal,
        temperature_mean: tMeanVal,
        temp_mean_c: tMeanVal,
        temperature_min: tMinVal,
        temp_min_c: tMinVal,
        temperature_max: tMaxVal,
        temp_max_c: tMaxVal,
        humidity_percent: humVal,
        humidity_pct: humVal,
        wind_speed_kmh: windVal,
        atmospheric_pressure_hpa: pressVal,
        river_level_m: riverVal,
        flooding_observed: floodingObserved,
        source_type: sourceType,
        source_name: sourceName,
        source_reference: sourceReference || null,
        source_url: sourceUrl || null,
        data_quality: dataQuality,
        quality_reason: qualityReason || null,
        comments: comments || null,
        notes: comments || '',
        status,
        is_demo: false,
        isDemoData: false,
        created_by: userSession.name,
        recorded_by: userSession.name,
        created_at: now,
        createdAt: now,
        updated_by: userSession.name,
        updated_at: now,
        updatedAt: now,
      };

      addClimateRecord(newRecord);
    }

    onSaved();
  };

  const filteredAreas = KINDU_HEALTH_AREAS.filter(a => !healthZoneId || a.zoneId === healthZoneId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-sky-600" />
              {isEditing ? `Modifier le Relevé Climatique ${initialRecord?.climate_id || initialRecord?.id}` : 'Nouvelle Donnée Climatique'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enregistrement strict sans interpolation • Sauvegarde de la résolution et de la source originale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Enregistrer les Modifications' : 'Valider & Enregistrer'}
          </button>
        </div>
      </div>

      {/* Errors / Warnings Bar */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Veuillez corriger les erreurs de validation suivantes :
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2">
            {Object.entries(errors).map(([k, err]) => (
              <li key={k}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <Info className="w-4 h-4 text-amber-600" />
            Informations & Avertissements méthodologiques :
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-2">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. Temporal Resolution & Period */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-4 h-4 text-sky-600" />
          1. Résolution Temporelle & Période d'Observation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type de Période <span className="text-rose-500">*</span>
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as PeriodType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="JOUR">Jour (Quotidien)</option>
              <option value="SEMAINE">Semaine Épidémiologique</option>
              <option value="MOIS">Mois (Mensuel)</option>
              <option value="SAISON">Saison (Pluvieuse / Sèche)</option>
              <option value="ANNEE">Année (Consolidé Annuel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Année <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              min={1980}
              max={2030}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {periodType === 'JOUR' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Précise (AAAA-MM-JJ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => {
                  setRecordDate(e.target.value);
                  if (e.target.value) {
                    const d = new Date(e.target.value);
                    if (!isNaN(d.getTime())) {
                      setYear(d.getFullYear());
                      setMonth(String(d.getMonth() + 1));
                    }
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

          {(periodType === 'MOIS' || periodType === 'JOUR') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mois
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
              >
                <option value="1">Janvier</option>
                <option value="2">Février</option>
                <option value="3">Mars</option>
                <option value="4">Avril</option>
                <option value="5">Mai</option>
                <option value="6">Juin</option>
                <option value="7">Juillet</option>
                <option value="8">Août</option>
                <option value="9">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
          )}

          {periodType === 'SEMAINE' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semaine Épidémiologique (1-53)
              </label>
              <input
                type="number"
                min={1}
                max={53}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="Ex: 14"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. Spatial Resolution & Location */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="w-4 h-4 text-emerald-600" />
          2. Localisation & Résolution Spatiale
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Résolution Spatiale <span className="text-rose-500">*</span>
            </label>
            <select
              value={spatialResolution}
              onChange={(e) => setSpatialResolution(e.target.value as SpatialResolution)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="STATION">Station Météorologique (Point Sol)</option>
              <option value="POINT">Point GPS Spécifique</option>
              <option value="ZONE">Zone de Santé</option>
              <option value="GRID">Pixel / Grille Satellitaire</option>
              <option value="VILLE">Ville de Kindu (Global)</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Station Prédéfinie
            </label>
            <select
              value={stationId}
              onChange={(e) => handleStationChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Sélectionner une station --</option>
              {climateStations.map(s => (
                <option key={s.station_id} value={s.station_id}>
                  {s.station_id} - {s.station_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom du Site / Localisation <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ex: Station Synoptique Kindu-Aéroport"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Latitude (° décimaux)
            </label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Ex: -2.9197"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Longitude (° décimaux)
            </label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Ex: 25.9150"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Zone de Santé de Rattachement
            </label>
            <select
              value={healthZoneId}
              onChange={(e) => {
                setHealthZoneId(e.target.value);
                setHealthAreaId('');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              {KINDU_HEALTH_ZONES.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aire de Santé (Optionnel)
            </label>
            <select
              value={healthAreaId}
              onChange={(e) => setHealthAreaId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Toute la zone --</option>
              {filteredAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Climate Variables */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-600" />
            3. Mesures Météorologiques (Laisser vide si non disponible)
          </h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Règle : Champ vide = NULL (Donnée manquante)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rainfall */}
          <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl">
            <label className="block text-xs font-bold text-sky-900 mb-1 flex items-center justify-between">
              <span>Pluviométrie (mm)</span>
              <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(e.target.value)}
              placeholder="Ex: 145.2 (0 = pas de pluie)"
              className="w-full px-3 py-2 bg-white border border-sky-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
            />
            <span className="text-[10px] text-sky-700 mt-1 block">0 = Jour sans pluie • Vide = Non mesuré</span>
          </div>

          {/* Temp Mean */}
          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center justify-between">
              <span>Température Moyenne (°C)</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            </label>
            <input
              type="number"
              step="0.1"
              value={tempMean}
              onChange={(e) => setTempMean(e.target.value)}
              placeholder="Ex: 26.5"
              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-amber-700 mt-1 block">Tmin ≤ Tmoy ≤ Tmax</span>
          </div>

          {/* Temp Min */}
          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Température Minimale (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={tempMin}
              onChange={(e) => setTempMin(e.target.value)}
              placeholder="Ex: 21.4"
              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-amber-700 mt-1 block">Thermographe min nocturne</span>
          </div>

          {/* Temp Max */}
          <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Température Maximale (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={tempMax}
              onChange={(e) => setTempMax(e.target.value)}
              placeholder="Ex: 32.1"
              className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-amber-700 mt-1 block">Thermographe max diurne</span>
          </div>

          {/* Humidity */}
          <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl">
            <label className="block text-xs font-bold text-teal-900 mb-1 flex items-center justify-between">
              <span>Humidité Relative (%)</span>
              <Droplets className="w-3.5 h-3.5 text-teal-600" />
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              placeholder="Ex: 82 (0 à 100%)"
              className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Wind speed */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vitesse du Vent (km/h)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              placeholder="Ex: 8.5"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* River level */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Niveau Fleuve Congo (m)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={riverLevel}
              onChange={(e) => setRiverLevel(e.target.value)}
              placeholder="Ex: 4.8"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Flooding */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Inondation Constatée
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                checked={floodingObserved}
                onChange={(e) => setFloodingObserved(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Inondation locale enregistrée</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Data Source Details */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-indigo-600" />
          4. Source de Données & Référence Scientifique
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catalogue des Sources
            </label>
            <select
              onChange={(e) => handleSourceSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="">-- Choisir une source enregistrée --</option>
              {climateSources.map(s => (
                <option key={s.source_id} value={s.source_id}>
                  {s.source_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type de Source <span className="text-rose-500">*</span>
            </label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as ClimateSourceType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="STATION_METEOROLOGIQUE">Station Météorologique au Sol</option>
              <option value="SERVICE_METEOROLOGIQUE">Service Météorologique / Santé</option>
              <option value="BASE_SATELLITAIRE">Produit Satellitaire (CHIRPS, NASA)</option>
              <option value="BASE_CLIMATIQUE">Réanalyse Climatique (ERA5-Land)</option>
              <option value="IMPORT_EXCEL">Import Fichier Excel</option>
              <option value="IMPORT_CSV">Import Fichier CSV</option>
              <option value="RAPPORT">Rapport / Bulletin Officiel</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nom de la Source / Fournisseur <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="Ex: METTELSAT RDC - Station FZOA"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Référence Bibliographique / Protocole
            </label>
            <input
              type="text"
              value={sourceReference}
              onChange={(e) => setSourceReference(e.target.value)}
              placeholder="Ex: Relevé journalier registre météo synoptique WMO #64247"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lien Web / DOI (Optionnel)
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* 5. Quality & Audit */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          5. Évaluation de la Qualité & Traçabilité
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Niveau de Qualité
            </label>
            <select
              value={dataQuality}
              onChange={(e) => setDataQuality(e.target.value as ClimateDataQuality)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="HIGH">Élevée (HIGH) - Station officielle vérifiée</option>
              <option value="MEDIUM">Moyenne (MEDIUM) - Estimation satellitaire / Reanalyse</option>
              <option value="LOW">Faible (LOW) - Relevé manuel sentinelle non calibré</option>
              <option value="UNKNOWN">Inconnue (UNKNOWN)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Statut de Validation
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RecordStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="VALIDATED">Validé pour l'analyse</option>
              <option value="DRAFT">Brouillon (DRAFT)</option>
              <option value="UNDER_REVIEW">En cours de vérification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Justification de la Qualité
            </label>
            <input
              type="text"
              value={qualityReason}
              onChange={(e) => setQualityReason(e.target.value)}
              placeholder="Ex: Station synoptique étalonnée"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes & Commentaires d'Observation
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={2}
              placeholder="Observations particulières, coupure de courant sur pluviomètre automatique, crue du fleuve..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Enregistrer les Modifications' : 'Enregistrer le Relevé'}
        </button>
      </div>
    </form>
  );
};
