import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  Database,
  Calendar,
  MapPin,
  Thermometer,
  CloudRain
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
import * as XLSX from 'xlsx';

interface ClimateImportTabProps {
  onImportSuccess: () => void;
}

interface ColumnMapping {
  date: string;
  year: string;
  month: string;
  week: string;
  locationName: string;
  rainfall: string;
  tempMean: string;
  tempMin: string;
  tempMax: string;
  humidity: string;
  windSpeed: string;
  pressure: string;
  riverLevel: string;
  notes: string;
}

export const ClimateImportTab: React.FC<ClimateImportTabProps> = ({ onImportSuccess }) => {
  const {
    bulkAddClimateRecords,
    climateStations,
    climateSources,
    climateRecords,
    userSession
  } = useData();

  // Multi-step Wizard
  const [step, setStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Metadata configuration (Steps 1-4)
  const [formatType, setFormatType] = useState<'EXCEL' | 'CSV'>('EXCEL');
  const [sourceType, setSourceType] = useState<ClimateSourceType>('STATION_METEOROLOGIQUE');
  const [sourceName, setSourceName] = useState<string>('Station Synoptique Kindu (METTELSAT)');
  const [sourceReference, setSourceReference] = useState<string>('Relevé instrumental météo officiel');
  const [sourceUrl, setSourceUrl] = useState<string>('');
  
  const [periodType, setPeriodType] = useState<PeriodType>('MOIS');
  const [spatialResolution, setSpatialResolution] = useState<SpatialResolution>('STATION');
  const [defaultStationId, setDefaultStationId] = useState<string>(climateStations[0]?.station_id || '');
  const [defaultLocationName, setDefaultLocationName] = useState<string>(climateStations[0]?.station_name || 'Station Synoptique Kindu-Aéroport');

  // Units configuration (Step 7)
  const [tempUnit, setTempUnit] = useState<'CELSIUS' | 'FAHRENHEIT' | 'KELVIN'>('CELSIUS');
  const [rainUnit, setRainUnit] = useState<'MM' | 'INCHES'>('MM');

  // File & Parsing state (Step 5-6)
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    year: '',
    month: '',
    week: '',
    locationName: '',
    rainfall: '',
    tempMean: '',
    tempMin: '',
    tempMax: '',
    humidity: '',
    windSpeed: '',
    pressure: '',
    riverLevel: '',
    notes: '',
  });

  // Validation report (Step 8-9)
  const [parsedRecords, setParsedRecords] = useState<ClimateRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; msg: string }[]>([]);
  const [potentialDuplicates, setPotentialDuplicates] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Download official template with 2 sheets
  const handleDownloadTemplate = () => {
    const dataTemplate = [
      {
        'DATE_OBSERVATION (AAAA-MM-JJ)': '2024-04-01',
        'ANNEE': 2024,
        'MOIS (1-12)': 4,
        'SEMAINE (1-53)': '',
        'STATION_OU_LIEU': 'Station Synoptique Kindu-Aéroport',
        'PRECIPITATIONS_MM': 185.5,
        'TEMPERATURE_MOYENNE_C': 26.4,
        'TEMPERATURE_MIN_C': 21.8,
        'TEMPERATURE_MAX_C': 31.9,
        'HUMIDITE_RELATIVE_POURCENT': 84,
        'VITESSE_VENT_KMH': 9.2,
        'PRESSION_HPA': 1012.5,
        'NIVEAU_FLEUVE_M': 4.5,
        'NOTES_OBSERVATION': 'Donnée mensuelle vérifiée METTELSAT'
      },
      {
        'DATE_OBSERVATION (AAAA-MM-JJ)': '2024-05-01',
        'ANNEE': 2024,
        'MOIS (1-12)': 5,
        'SEMAINE (1-53)': '',
        'STATION_OU_LIEU': 'Station Synoptique Kindu-Aéroport',
        'PRECIPITATIONS_MM': 138.0,
        'TEMPERATURE_MOYENNE_C': 26.1,
        'TEMPERATURE_MIN_C': 21.5,
        'TEMPERATURE_MAX_C': 31.2,
        'HUMIDITE_RELATIVE_POURCENT': 79,
        'VITESSE_VENT_KMH': 8.0,
        'PRESSION_HPA': 1013.0,
        'NIVEAU_FLEUVE_M': 4.1,
        'NOTES_OBSERVATION': 'Fin de la saison des pluies'
      }
    ];

    const dictionary = [
      {
        'NOM_COLONNE': 'DATE_OBSERVATION',
        'TYPE': 'Date (AAAA-MM-JJ)',
        'OBLIGATOIRE': 'Oui si Journalier, sinon laisser vide',
        'DESCRIPTION': 'Date précise de relevé météorologique'
      },
      {
        'NOM_COLONNE': 'ANNEE',
        'TYPE': 'Entier (1980 - 2030)',
        'OBLIGATOIRE': 'OUI',
        'DESCRIPTION': 'Année de la mesure'
      },
      {
        'NOM_COLONNE': 'MOIS',
        'TYPE': 'Entier (1 - 12)',
        'OBLIGATOIRE': 'Oui si Mensuel',
        'DESCRIPTION': 'Mois de l’observation (1=Janvier, 12=Décembre)'
      },
      {
        'NOM_COLONNE': 'PRECIPITATIONS_MM',
        'TYPE': 'Décimal >= 0',
        'OBLIGATOIRE': 'NON (laisser vide si manquant)',
        'DESCRIPTION': 'Précipitation totale en millimètres. 0 = aucun pluie. Vide = non mesuré.'
      },
      {
        'NOM_COLONNE': 'TEMPERATURE_MOYENNE_C',
        'TYPE': 'Décimal',
        'OBLIGATOIRE': 'NON (laisser vide si manquant)',
        'DESCRIPTION': 'Température moyenne de l’air en degrés Celsius.'
      },
      {
        'NOM_COLONNE': 'TEMPERATURE_MIN_C',
        'TYPE': 'Décimal',
        'OBLIGATOIRE': 'NON',
        'DESCRIPTION': 'Température minimale observée (doit être <= Température Moyenne)'
      },
      {
        'NOM_COLONNE': 'TEMPERATURE_MAX_C',
        'TYPE': 'Décimal',
        'OBLIGATOIRE': 'NON',
        'DESCRIPTION': 'Température maximale observée (doit être >= Température Moyenne)'
      },
      {
        'NOM_COLONNE': 'HUMIDITE_RELATIVE_POURCENT',
        'TYPE': 'Entier (0 - 100)',
        'OBLIGATOIRE': 'NON',
        'DESCRIPTION': 'Pourcentage d’humidité relative de l’air.'
      },
      {
        'NOM_COLONNE': 'STATION_OU_LIEU',
        'TYPE': 'Texte',
        'OBLIGATOIRE': 'OUI',
        'DESCRIPTION': 'Nom du poste de mesure ou de la station synoptique'
      }
    ];

    const wb = XLSX.utils.book_new();
    const wsData = XLSX.utils.json_to_sheet(dataTemplate);
    const wsDict = XLSX.utils.json_to_sheet(dictionary);

    XLSX.utils.book_append_sheet(wb, wsData, 'MODELE_DONNEES_CLIMAT');
    XLSX.utils.book_append_sheet(wb, wsDict, 'DICTIONNAIRE_VARIABLES');

    XLSX.writeFile(wb, 'OneHealth_Kindu_Modele_Climat_V1.4.xlsx');
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (json.length === 0) {
          alert('Le fichier sélectionné est vide.');
          return;
        }

        const cols = Object.keys(json[0]);
        setHeaders(cols);
        setRawRows(json);

        // Auto-guess mapping based on column names
        const autoMap: ColumnMapping = {
          date: cols.find(c => /date|jour|period/i.test(c)) || '',
          year: cols.find(c => /annee|year|yr/i.test(c)) || '',
          month: cols.find(c => /mois|month/i.test(c)) || '',
          week: cols.find(c => /semaine|week|epi/i.test(c)) || '',
          locationName: cols.find(c => /station|site|lieu|location|nom/i.test(c)) || '',
          rainfall: cols.find(c => /pluie|rain|precip|rr/i.test(c)) || '',
          tempMean: cols.find(c => /temp.*moy|temp.*mean|tmean|temperature$/i.test(c)) || '',
          tempMin: cols.find(c => /temp.*min|tmin/i.test(c)) || '',
          tempMax: cols.find(c => /temp.*max|tmax/i.test(c)) || '',
          humidity: cols.find(c => /humid|rh|hr/i.test(c)) || '',
          windSpeed: cols.find(c => /vent|wind/i.test(c)) || '',
          pressure: cols.find(c => /press|pression/i.test(c)) || '',
          riverLevel: cols.find(c => /fleuve|river|niveau/i.test(c)) || '',
          notes: cols.find(c => /note|comment|remarque/i.test(c)) || '',
        };

        setMapping(autoMap);
        setStep(2);
      } catch (err) {
        console.error('Error reading file:', err);
        alert('Erreur lors de la lecture du fichier. Veuillez vérifier le format.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Convert and Validate Rows
  const handleValidateMapping = () => {
    setIsProcessing(true);
    const records: ClimateRecord[] = [];
    const errors: { row: number; msg: string }[] = [];
    let duplicates = 0;

    const now = new Date().toISOString();

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2; // Excel row numbering
      
      // Year & Date resolution
      let yVal: number = NaN;
      if (mapping.year && row[mapping.year] !== '') {
        yVal = parseInt(String(row[mapping.year]).trim(), 10);
      }

      let mVal: number | null = null;
      if (mapping.month && row[mapping.month] !== '') {
        mVal = parseInt(String(row[mapping.month]).trim(), 10);
      }

      let dateVal: string | null = null;
      if (mapping.date && row[mapping.date] !== '') {
        dateVal = String(row[mapping.date]).trim();
        if (isNaN(yVal) && dateVal.includes('-')) {
          yVal = parseInt(dateVal.split('-')[0], 10);
        }
        if (mVal === null && dateVal.includes('-')) {
          mVal = parseInt(dateVal.split('-')[1], 10);
        }
      }

      if (isNaN(yVal)) {
        yVal = 2024; // fallback
      }

      // Location
      let loc = defaultLocationName;
      if (mapping.locationName && row[mapping.locationName] !== '') {
        loc = String(row[mapping.locationName]).trim();
      }

      // Rainfall conversion
      let rain: number | null = null;
      if (mapping.rainfall && row[mapping.rainfall] !== '' && row[mapping.rainfall] !== null) {
        let rRaw = parseFloat(String(row[mapping.rainfall]).replace(',', '.'));
        if (!isNaN(rRaw)) {
          if (rainUnit === 'INCHES') rRaw = rRaw * 25.4;
          if (rRaw < 0) {
            errors.push({ row: rowNum, msg: `Pluviométrie négative (${rRaw} mm) invalide.` });
          } else {
            rain = Math.round(rRaw * 10) / 10;
          }
        }
      }

      // Temperatures conversion
      const convertTemp = (raw: any): number | null => {
        if (raw === '' || raw === null || raw === undefined) return null;
        let t = parseFloat(String(raw).replace(',', '.'));
        if (isNaN(t)) return null;
        if (tempUnit === 'FAHRENHEIT') t = ((t - 32) * 5) / 9;
        if (tempUnit === 'KELVIN') t = t - 273.15;
        return Math.round(t * 10) / 10;
      };

      let tMean = mapping.tempMean ? convertTemp(row[mapping.tempMean]) : null;
      let tMin = mapping.tempMin ? convertTemp(row[mapping.tempMin]) : null;
      let tMax = mapping.tempMax ? convertTemp(row[mapping.tempMax]) : null;

      // Inconsistency Checks
      if (tMin !== null && tMax !== null && tMin > tMax) {
        errors.push({ row: rowNum, msg: `Incohérence Tmin (${tMin}°C) > Tmax (${tMax}°C).` });
      }
      if (tMean !== null && tMin !== null && tMean < tMin) {
        errors.push({ row: rowNum, msg: `Incohérence Tmoy (${tMean}°C) < Tmin (${tMin}°C).` });
      }
      if (tMean !== null && tMax !== null && tMean > tMax) {
        errors.push({ row: rowNum, msg: `Incohérence Tmoy (${tMean}°C) > Tmax (${tMax}°C).` });
      }

      // Humidity
      let hum: number | null = null;
      if (mapping.humidity && row[mapping.humidity] !== '' && row[mapping.humidity] !== null) {
        const h = parseFloat(String(row[mapping.humidity]).replace(',', '.'));
        if (!isNaN(h)) {
          if (h < 0 || h > 100) {
            errors.push({ row: rowNum, msg: `Humidité (${h}%) hors limites [0 - 100%].` });
          } else {
            hum = Math.round(h);
          }
        }
      }

      // Check existing duplicate in context database
      const isDup = climateRecords.some(ex => 
        (ex.source_name === sourceName || ex.source_type === sourceType) &&
        (ex.station_id === defaultStationId || ex.location_name === loc) &&
        ex.year === yVal &&
        (periodType === 'JOUR' ? ex.record_date === dateVal : ex.month === mVal)
      );

      if (isDup) {
        duplicates++;
      }

      const recId = `CLI-IMP-${Date.now()}-${String(idx + 1).padStart(4, '0')}`;
      records.push({
        id: recId,
        climate_id: recId,
        period_type: periodType,
        record_date: dateVal,
        date: dateVal || `${yVal}-${String(mVal || 1).padStart(2, '0')}-01`,
        year: yVal,
        month: mVal,
        week: mapping.week && row[mapping.week] ? parseInt(String(row[mapping.week]), 10) : null,
        spatial_resolution: spatialResolution,
        station_id: defaultStationId || null,
        location_id: defaultStationId || null,
        location_name: loc,
        rainfall_mm: rain,
        temperature_mean: tMean,
        temp_mean_c: tMean,
        temperature_min: tMin,
        temp_min_c: tMin,
        temperature_max: tMax,
        temp_max_c: tMax,
        humidity_percent: hum,
        humidity_pct: hum,
        source_type: sourceType,
        source_name: sourceName,
        source_reference: sourceReference || null,
        source_url: sourceUrl || null,
        data_quality: sourceType === 'STATION_METEOROLOGIQUE' ? 'HIGH' : 'MEDIUM',
        quality_reason: `Import de fichier ${fileName}`,
        isPotentialDuplicate: isDup,
        duplicateFlagReason: isDup ? 'Doublon potentiel détecté (même station, période et source)' : undefined,
        status: isDup ? 'UNDER_REVIEW' : 'VALIDATED',
        is_demo: false,
        isDemoData: false,
        comments: mapping.notes && row[mapping.notes] ? String(row[mapping.notes]) : `Importé depuis ${fileName}`,
        notes: mapping.notes && row[mapping.notes] ? String(row[mapping.notes]) : `Importé depuis ${fileName}`,
        created_by: userSession.name,
        recorded_by: userSession.name,
        created_at: now,
        createdAt: now,
        updated_by: userSession.name,
        updated_at: now,
        updatedAt: now,
      });
    });

    setParsedRecords(records);
    setValidationErrors(errors);
    setPotentialDuplicates(duplicates);
    setIsProcessing(false);
    setStep(3);
  };

  // Final Confirmation
  const handleConfirmImport = () => {
    if (parsedRecords.length === 0) return;
    bulkAddClimateRecords(parsedRecords);
    alert(`Importation réussie : ${parsedRecords.length} relevés climatiques enregistrés avec succès !`);
    onImportSuccess();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      {/* Wizard Step Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" />
            Importation Normalisée de Séries Climatiques (Excel / CSV)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Processus méthodique en 10 étapes • Préservation des résolutions et traçabilité de source
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition inline-flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-slate-600" />
          Télécharger Modèle Type (.xlsx)
        </button>
      </div>

      {/* Step Progress Indicators */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`p-2.5 rounded-lg border text-center transition ${
          step === 1 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500 text-xs'
        }`}>
          1. Métadonnées & Fichier
        </div>
        <div className={`p-2.5 rounded-lg border text-center transition ${
          step === 2 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500 text-xs'
        }`}>
          2. Mapping & Unités
        </div>
        <div className={`p-2.5 rounded-lg border text-center transition ${
          step === 3 ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-500 text-xs'
        }`}>
          3. Validation & Intégration
        </div>
      </div>

      {/* STEP 1: Metadata & Upload */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de Source <span className="text-rose-500">*</span>
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as ClimateSourceType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="STATION_METEOROLOGIQUE">Station Météorologique au Sol</option>
                <option value="SERVICE_METEOROLOGIQUE">Service Météorologique National</option>
                <option value="BASE_SATELLITAIRE">Produit Satellitaire (CHIRPS, NASA POWER)</option>
                <option value="BASE_CLIMATIQUE">Réanalyse ERA5-Land (ECMWF)</option>
                <option value="IMPORT_EXCEL">Fichier Relevé Excel</option>
                <option value="IMPORT_CSV">Fichier Export CSV</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom de la Source <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Résolution Temporelle <span className="text-rose-500">*</span>
              </label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="JOUR">Journalière (Jour par jour)</option>
                <option value="SEMAINE">Semaine Épidémiologique</option>
                <option value="MOIS">Mensuelle (Mois par mois)</option>
                <option value="SAISON">Saisonnière</option>
                <option value="ANNEE">Annuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Résolution Spatiale
              </label>
              <select
                value={spatialResolution}
                onChange={(e) => setSpatialResolution(e.target.value as SpatialResolution)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                <option value="STATION">Station Météo (Point au sol)</option>
                <option value="GRID">Pixel / Grille Satellitaire</option>
                <option value="ZONE">Zone de Santé</option>
                <option value="VILLE">Ville de Kindu (Entière)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Station / Site par défaut
              </label>
              <select
                value={defaultStationId}
                onChange={(e) => {
                  setDefaultStationId(e.target.value);
                  const st = climateStations.find(s => s.station_id === e.target.value);
                  if (st) setDefaultLocationName(st.station_name);
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
              >
                {climateStations.map(s => (
                  <option key={s.station_id} value={s.station_id}>
                    {s.station_id} - {s.station_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30 rounded-2xl p-8 text-center cursor-pointer transition"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Cliquez pour sélectionner ou glissez votre fichier Excel / CSV
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Formats supportés : .xlsx, .xls, .csv (encodage UTF-8 recommandé)
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Column Mapping & Units Conversion */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span>Fichier chargé : <strong className="text-slate-800">{fileName}</strong> ({rawRows.length} lignes détectées)</span>
            <button
              onClick={() => setStep(1)}
              className="text-sky-700 hover:underline font-semibold"
            >
              Changer de fichier
            </button>
          </div>

          {/* Units Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 border border-amber-200 p-4 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-700" />
                Unité des Températures dans le fichier
              </label>
              <select
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="CELSIUS">Degrés Celsius (°C) - Standard</option>
                <option value="FAHRENHEIT">Degrés Fahrenheit (°F) [Conversion automatique en °C]</option>
                <option value="KELVIN">Kelvin (K) [Conversion automatique en °C]</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-sky-700" />
                Unité des Précipitations dans le fichier
              </label>
              <select
                value={rainUnit}
                onChange={(e) => setRainUnit(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="MM">Millimètres (mm) - Standard</option>
                <option value="INCHES">Pouces (Inches / in) [Conversion automatique en mm]</option>
              </select>
            </div>
          </div>

          {/* Mapping Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Correspondance des Colonnes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Date (AAAA-MM-JJ)</label>
                <select
                  value={mapping.date}
                  onChange={(e) => setMapping({ ...mapping, date: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Ignorer / Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Année</label>
                <select
                  value={mapping.year}
                  onChange={(e) => setMapping({ ...mapping, year: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Déduire de la date --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Mois (1 - 12)</label>
                <select
                  value={mapping.month}
                  onChange={(e) => setMapping({ ...mapping, month: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Déduire de la date --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Précipitations (Pluie)</label>
                <select
                  value={mapping.rainfall}
                  onChange={(e) => setMapping({ ...mapping, rainfall: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Température Moyenne</label>
                <select
                  value={mapping.tempMean}
                  onChange={(e) => setMapping({ ...mapping, tempMean: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Température Minimale</label>
                <select
                  value={mapping.tempMin}
                  onChange={(e) => setMapping({ ...mapping, tempMin: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Température Maximale</label>
                <select
                  value={mapping.tempMax}
                  onChange={(e) => setMapping({ ...mapping, tempMax: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Humidité Relative (%)</label>
                <select
                  value={mapping.humidity}
                  onChange={(e) => setMapping({ ...mapping, humidity: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Non présent --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Nom Station / Lieu</label>
                <select
                  value={mapping.locationName}
                  onChange={(e) => setMapping({ ...mapping, locationName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="">-- Utiliser site par défaut --</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              &larr; Retour
            </button>
            <button
              onClick={handleValidateMapping}
              disabled={isProcessing}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow inline-flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Vérifier & Pré-valider les données
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Validation Report & Integration */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 uppercase">Lignes Prêtes</span>
              <div className="text-2xl font-black text-emerald-900 mt-1">{parsedRecords.length}</div>
              <span className="text-[11px] text-emerald-700">Enregistrements structurés</span>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-xs font-bold text-amber-800 uppercase">Doublons Potentiels</span>
              <div className="text-2xl font-black text-amber-900 mt-1">{potentialDuplicates}</div>
              <span className="text-[11px] text-amber-700">Marqués pour vérification</span>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="text-xs font-bold text-rose-800 uppercase">Anomalies Détectées</span>
              <div className="text-2xl font-black text-rose-900 mt-1">{validationErrors.length}</div>
              <span className="text-[11px] text-rose-700">Incohérences physiques</span>
            </div>
          </div>

          {/* Preview Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-bold text-xs text-slate-800">
              Aperçu des 5 premières lignes converties :
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-3 py-2">Période</th>
                    <th className="px-3 py-2">Station</th>
                    <th className="px-3 py-2">Pluie (mm)</th>
                    <th className="px-3 py-2">Tmoy (°C)</th>
                    <th className="px-3 py-2">Tmin / Tmax</th>
                    <th className="px-3 py-2">Humidité (%)</th>
                    <th className="px-3 py-2">Qualité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {parsedRecords.slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td className="px-3 py-2 font-mono">{r.record_date || `${r.month}/${r.year}`}</td>
                      <td className="px-3 py-2">{r.location_name}</td>
                      <td className="px-3 py-2 font-bold text-sky-700">
                        {r.rainfall_mm !== null ? `${r.rainfall_mm} mm` : <span className="text-slate-400">N/D</span>}
                      </td>
                      <td className="px-3 py-2 font-bold text-amber-700">
                        {r.temperature_mean !== null ? `${r.temperature_mean} °C` : <span className="text-slate-400">N/D</span>}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {r.temperature_min ?? '-'} / {r.temperature_max ?? '-'}
                      </td>
                      <td className="px-3 py-2">
                        {r.humidity_percent !== null ? `${r.humidity_percent}%` : '-'}
                      </td>
                      <td className="px-3 py-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {r.data_quality}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              &larr; Revoir le Mapping
            </button>
            <button
              onClick={handleConfirmImport}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              Confirmer & Intégrer les {parsedRecords.length} Relevés
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
