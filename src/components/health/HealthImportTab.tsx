import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Layers,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Check,
  Building2,
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import {
  HealthRecord,
  DataSourceType,
  PeriodType,
  DiseaseType,
  CaseClassification,
  DiagnosticMethod,
  AgeGroup,
  SexCategory,
  DataQualityLevel,
  RecordStatus
} from '../../types';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_ZONES } from '../../data/kinduGeography';
import { checkForPII } from '../../utils/qualityControl';

interface ParsedRow {
  rowIndex: number;
  raw: { [key: string]: any };
  mapped: {
    facility_name: string;
    health_area_id: string;
    zone_id: string;
    year: number;
    month: number;
    period_type: PeriodType;
    record_date: string;
    disease: DiseaseType;
    case_classification: CaseClassification;
    diagnostic_method: DiagnosticMethod;
    age_group: AgeGroup;
    sex_category: SexCategory;
    cases: number;
    hospitalizations: number | 'UNKNOWN';
    deaths: number | 'UNKNOWN';
    source_name: string;
    source_reference: string;
    data_quality: DataQualityLevel;
    notes: string;
  };
  isValid: boolean;
  errors: string[];
  warnings: string[];
  isDuplicate: boolean;
}

export const HealthImportTab: React.FC<{ onImportSuccess?: () => void }> = ({ onImportSuccess }) => {
  const { healthRecords, bulkAddHealthRecords, healthFacilities, userSession } = useData();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<'UPLOAD' | 'MAPPING' | 'PREVIEW' | 'COMPLETE'>('UPLOAD');

  // Mapping state
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({
    facility_name: '',
    health_area_id: '',
    year: '',
    month: '',
    disease: '',
    cases: '',
    hospitalizations: '',
    deaths: '',
    case_classification: '',
    diagnostic_method: '',
    age_group: '',
    sex_category: '',
    source_reference: '',
    notes: '',
  });

  // Import options
  const [defaultStatus, setDefaultStatus] = useState<RecordStatus>('IMPORTED');
  const [duplicateHandling, setDuplicateHandling] = useState<'FLAG' | 'SKIP'>('FLAG');
  const [importedCount, setImportedCount] = useState<number>(0);

  // Template Download
  const downloadSampleTemplate = (format: 'xlsx' | 'csv') => {
    const sampleData = [
      {
        'Structure_Sante': 'Hôpital Général de Référence de Kindu',
        'Aire_Sante': 'AS_KASUKU',
        'Zone_Sante': 'ZS_KINDU',
        'Annee': 2024,
        'Mois': 4,
        'Pathologie': 'PALUDISME',
        'Classification': 'CONFIRME',
        'Methode_Diagnostic': 'TDR',
        'Groupe_Age': 'TOUS ÂGES',
        'Sexe': 'TOTAL',
        'Cas_Declares': 48,
        'Hospitalisations': 9,
        'Deces': 0,
        'Reference_Registre': 'Registre N°03, Page 12',
        'Qualite_Donnee': 'HIGH',
        'Observations': 'Surveillance sentinelle - Quartier Résidentiel Kasuku',
      },
      {
        'Structure_Sante': 'Centre de Santé Mikelenge',
        'Aire_Sante': 'AS_MIKELENGE',
        'Zone_Sante': 'ZS_KINDU',
        'Annee': 2024,
        'Mois': 4,
        'Pathologie': 'PALUDISME',
        'Classification': 'CONFIRME',
        'Methode_Diagnostic': 'TDR',
        'Groupe_Age': '<5 ANS',
        'Sexe': 'TOTAL',
        'Cas_Declares': 35,
        'Hospitalisations': 6,
        'Deces': 1,
        'Reference_Registre': 'Rapport Mensuel RMA-04/2024',
        'Qualite_Donnee': 'HIGH',
        'Observations': 'Pic saisonnier observé dans le bas-fond',
      },
      {
        'Structure_Sante': 'Centre de Santé Rive Gauche',
        'Aire_Sante': 'AS_ALUNGULI',
        'Zone_Sante': 'ZS_ALUNGULI',
        'Annee': 2024,
        'Mois': 4,
        'Pathologie': 'FIEVRE_TYPHOIDE',
        'Classification': 'CONFIRME',
        'Methode_Diagnostic': 'TEST_LABORATOIRE',
        'Groupe_Age': 'TOUS ÂGES',
        'Sexe': 'TOTAL',
        'Cas_Declares': 18,
        'Hospitalisations': 5,
        'Deces': 0,
        'Reference_Registre': 'Registre Labo Widal/Culture',
        'Qualite_Donnee': 'MEDIUM',
        'Observations': 'Cas groupés suite aux inondations du fleuve Congo',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Donnees_Sanitaires_Kindu');

    if (format === 'xlsx') {
      XLSX.writeFile(wb, 'modele_import_donnees_sanitaires_kindu.xlsx');
    } else {
      XLSX.writeFile(wb, 'modele_import_donnees_sanitaires_kindu.csv', { bookType: 'csv' });
    }
  };

  // Auto-detect mappings from column names
  const autoDetectMapping = (headers: string[]) => {
    const newMapping: { [key: string]: string } = { ...columnMapping };

    headers.forEach(h => {
      const lower = h.toLowerCase().trim();

      if (lower.includes('structure') || lower.includes('centre') || lower.includes('hopital') || lower.includes('facility')) {
        newMapping.facility_name = h;
      } else if (lower.includes('aire') || lower.includes('health_area') || lower.includes('as_')) {
        newMapping.health_area_id = h;
      } else if (lower === 'annee' || lower === 'year' || lower === 'ann') {
        newMapping.year = h;
      } else if (lower === 'mois' || lower === 'month' || lower === 'm') {
        newMapping.month = h;
      } else if (lower.includes('patho') || lower.includes('maladie') || lower.includes('disease')) {
        newMapping.disease = h;
      } else if (lower.includes('cas') || lower.includes('cases') || lower.includes('effectif') || lower.includes('total')) {
        newMapping.cases = h;
      } else if (lower.includes('hosp') || lower.includes('lit')) {
        newMapping.hospitalizations = h;
      } else if (lower.includes('deces') || lower.includes('mort') || lower.includes('death')) {
        newMapping.deaths = h;
      } else if (lower.includes('class') || lower.includes('statut_diag')) {
        newMapping.case_classification = h;
      } else if (lower.includes('methode') || lower.includes('diag') || lower.includes('tdr') || lower.includes('labo')) {
        newMapping.diagnostic_method = h;
      } else if (lower.includes('age') || lower.includes('groupe')) {
        newMapping.age_group = h;
      } else if (lower.includes('sexe') || lower.includes('genre') || lower.includes('sex')) {
        newMapping.sex_category = h;
      } else if (lower.includes('ref') || lower.includes('livre') || lower.includes('registre') || lower.includes('folio')) {
        newMapping.source_reference = h;
      } else if (lower.includes('obs') || lower.includes('note') || lower.includes('comm') || lower.includes('remarque')) {
        newMapping.notes = h;
      }
    });

    setColumnMapping(newMapping);
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          alert('Le fichier est vide ou ne contient aucune ligne de données.');
          setIsProcessing(false);
          return;
        }

        const headers = (jsonData[0] as string[]).map(h => String(h || '').trim()).filter(Boolean);
        setRawHeaders(headers);
        autoDetectMapping(headers);

        // Store rows for processing
        (window as any).__TEMP_IMPORT_ROWS = jsonData.slice(1).map((row, idx) => {
          const rowObj: { [key: string]: any } = {};
          headers.forEach((h, colIdx) => {
            rowObj[h] = row[colIdx];
          });
          return rowObj;
        });

        setIsProcessing(false);
        setStep('MAPPING');
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la lecture du fichier Excel/CSV. Vérifiez le format du fichier.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Perform validation on mapped rows
  const processMappedData = () => {
    const rawDataList: any[] = (window as any).__TEMP_IMPORT_ROWS || [];
    const today = new Date().toISOString().split('T')[0];

    const processed: ParsedRow[] = rawDataList.map((raw, idx) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Extract values with mapping
      const facilityRaw = String(raw[columnMapping.facility_name] || '').trim();
      const areaRaw = String(raw[columnMapping.health_area_id] || '').trim().toUpperCase();
      const yearRaw = Number(raw[columnMapping.year]) || 2024;
      const monthRaw = Number(raw[columnMapping.month]) || 4;
      const diseaseRaw = String(raw[columnMapping.disease] || 'PALUDISME').trim().toUpperCase();
      const casesRaw = raw[columnMapping.cases] !== undefined ? Number(raw[columnMapping.cases]) : 0;
      const hospRaw = raw[columnMapping.hospitalizations];
      const deathsRaw = raw[columnMapping.deaths];
      const classRaw = String(raw[columnMapping.case_classification] || 'CONFIRME').trim().toUpperCase();
      const methodRaw = String(raw[columnMapping.diagnostic_method] || (diseaseRaw.includes('TYPH') ? 'TEST_LABORATOIRE' : 'TDR')).trim().toUpperCase();
      const ageRaw = String(raw[columnMapping.age_group] || 'TOUS ÂGES').trim().toUpperCase();
      const sexRaw = String(raw[columnMapping.sex_category] || 'TOTAL').trim().toUpperCase();
      const refRaw = String(raw[columnMapping.source_reference] || '').trim();
      const notesRaw = String(raw[columnMapping.notes] || '').trim();

      // Normalize Area
      let matchedAreaId = 'AS_MIKELENGE';
      const foundArea = KINDU_HEALTH_AREAS.find(a =>
        a.id === areaRaw || a.id.replace('AS_', '') === areaRaw || a.name.toUpperCase().includes(areaRaw)
      );
      if (foundArea) {
        matchedAreaId = foundArea.id;
      } else if (facilityRaw) {
        const foundFac = healthFacilities.find(f =>
          f.facility_name.toUpperCase().includes(facilityRaw.toUpperCase())
        );
        if (foundFac) matchedAreaId = foundFac.health_area_id;
      }

      const matchedZoneId = matchedAreaId.includes('ALUNGULI') || matchedAreaId.includes('TCHABOBO')
        ? 'ZS_ALUNGULI'
        : 'ZS_KINDU';

      // Normalize Disease
      let finalDisease: DiseaseType = 'PALUDISME';
      if (diseaseRaw.includes('TYPH') || diseaseRaw.includes('SALMONELLA') || diseaseRaw.includes('WIDAL')) {
        finalDisease = 'FIEVRE_TYPHOIDE';
      }

      // Cases validation
      if (isNaN(casesRaw) || casesRaw < 0) {
        errors.push(`Nombre de cas invalide (${casesRaw}). Doit être >= 0.`);
      }

      // Hospitalizations validation
      let finalHosp: number | 'UNKNOWN' = 'UNKNOWN';
      if (hospRaw !== undefined && hospRaw !== '' && String(hospRaw).toUpperCase() !== 'INCONNU' && String(hospRaw).toUpperCase() !== 'UNKNOWN') {
        const numHosp = Number(hospRaw);
        if (isNaN(numHosp) || numHosp < 0) {
          errors.push(`Hospitalisations invalides (${hospRaw}).`);
        } else if (numHosp > casesRaw) {
          errors.push(`Hospitalisations (${numHosp}) > Cas déclarés (${casesRaw}).`);
        } else {
          finalHosp = numHosp;
        }
      }

      // Deaths validation
      let finalDeaths: number | 'UNKNOWN' = 'UNKNOWN';
      if (deathsRaw !== undefined && deathsRaw !== '' && String(deathsRaw).toUpperCase() !== 'INCONNU' && String(deathsRaw).toUpperCase() !== 'UNKNOWN') {
        const numDeaths = Number(deathsRaw);
        if (isNaN(numDeaths) || numDeaths < 0) {
          errors.push(`Décès invalides (${deathsRaw}).`);
        } else if (numDeaths > casesRaw) {
          errors.push(`Décès (${numDeaths}) > Cas déclarés (${casesRaw}).`);
        } else {
          finalDeaths = numDeaths;
        }
      }

      // Year validation
      if (yearRaw < 2010 || yearRaw > 2030) {
        errors.push(`Année ${yearRaw} hors limites (2010–2030).`);
      }

      // PII Check
      if (notesRaw) {
        const pii = checkForPII(notesRaw);
        if (pii.hasPII) {
          errors.push(`PII interdit : ${pii.reason}`);
        }
      }

      // Check structure name
      const finalFacName = facilityRaw || (foundArea ? foundArea.healthStructures[0] : 'Centre de Santé');

      // Duplicate check against existing healthRecords
      const monthStr = String(monthRaw).padStart(2, '0');
      const isDup = healthRecords.some(hr =>
        hr.health_area_id === matchedAreaId &&
        hr.year === yearRaw &&
        hr.month === monthRaw &&
        hr.disease === finalDisease &&
        (hr.facility_name || hr.structure_name || '').toLowerCase() === finalFacName.toLowerCase()
      );

      if (isDup) {
        warnings.push(`Doublon potentiel détecté avec une fiche déjà présente en base (${finalDisease}, ${matchedAreaId}, ${monthStr}/${yearRaw}).`);
      }

      return {
        rowIndex: idx + 1,
        raw,
        mapped: {
          facility_name: finalFacName,
          health_area_id: matchedAreaId,
          zone_id: matchedZoneId,
          year: yearRaw,
          month: monthRaw,
          period_type: 'MOIS',
          record_date: `${yearRaw}-${monthStr}-15`,
          disease: finalDisease,
          case_classification: classRaw.includes('PROB') ? 'PROBABLE' : classRaw.includes('SUSP') ? 'SUSPECT' : 'CONFIRME',
          diagnostic_method: methodRaw.includes('MICROS') ? 'MICROSCOPIE' : methodRaw.includes('CLIN') ? 'DIAGNOSTIC_CLINIQUE' : methodRaw.includes('LAB') ? 'TEST_LABORATOIRE' : 'TDR',
          age_group: ageRaw.includes('<5') ? '<5 ANS' : ageRaw.includes('5-14') ? '5–14 ANS' : ageRaw.includes('15-24') ? '15–24 ANS' : 'TOUS ÂGES',
          sex_category: sexRaw.includes('MASC') ? 'MASCULIN' : sexRaw.includes('FEM') ? 'FEMININ' : 'TOTAL',
          cases: casesRaw,
          hospitalizations: finalHosp,
          deaths: finalDeaths,
          source_name: 'Fichier importé : ' + fileName,
          source_reference: refRaw,
          data_quality: 'HIGH',
          notes: notesRaw,
        },
        isValid: errors.length === 0,
        errors,
        warnings,
        isDuplicate: isDup,
      };
    });

    setParsedRows(processed);
    setStep('PREVIEW');
  };

  // Perform Final Bulk Import
  const handleExecuteImport = () => {
    const validRows = parsedRows.filter(r => r.isValid && (!r.isDuplicate || duplicateHandling !== 'SKIP'));

    if (validRows.length === 0) {
      alert('Aucune ligne valide à importer selon vos critères de filtrage.');
      return;
    }

    const payload: (Omit<HealthRecord, 'createdAt' | 'updatedAt'> | HealthRecord)[] = validRows.map((r, idx) => {
      const m = r.mapped;
      const monthStr = String(m.month).padStart(2, '0');

      return {
        id: `SAN-IMP-${Date.now()}-${idx + 1}`,
        health_record_id: `SAN-IMP-${Date.now()}-${idx + 1}`,
        facility_id: `FAC_${m.health_area_id}`,
        facility_name: m.facility_name,
        structure_name: m.facility_name,
        zone_id: m.zone_id,
        health_area_id: m.health_area_id,
        date: m.record_date,
        record_date: m.record_date,
        year: m.year,
        month: m.month,
        period_type: m.period_type,
        disease: m.disease,
        case_classification: m.case_classification,
        diagnostic_status: m.case_classification === 'CONFIRME' ? 'CONFIRMED' : 'PROBABLE',
        diagnostic_method: m.diagnostic_method,
        age_group: m.age_group,
        sex_category: m.sex_category,
        cases: m.cases,
        hospitalizations: m.hospitalizations,
        deaths: m.deaths,
        data_source_type: 'IMPORT_EXCEL',
        data_source: 'IMPORT_EXCEL',
        source_name: m.source_name,
        source_reference: m.source_reference,
        source_period: `${monthStr}/${m.year}`,
        data_quality: m.data_quality,
        status: defaultStatus,
        isDemoData: false,
        notes: m.notes,
        comments: m.notes,
        isPotentialDuplicate: r.isDuplicate,
        duplicateFlagReason: r.isDuplicate ? r.warnings.join(' | ') : undefined,
        registered_by: userSession.name || 'Importateur Sanitaire',
        created_by: userSession.name || 'Importateur Sanitaire',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    bulkAddHealthRecords(payload);
    setImportedCount(payload.length);
    setStep('COMPLETE');

    if (onImportSuccess) {
      setTimeout(() => {
        onImportSuccess();
      }, 1500);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const invalidCount = parsedRows.filter(r => !r.isValid).length;
  const dupCount = parsedRows.filter(r => r.isDuplicate).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Module d'Importation Sécurisé des Données Sanitaires (Excel / CSV)
            </h2>
            <p className="text-xs text-slate-500">
              Intégration des registres des structures de santé et rapports mensuels DPS (Kindu V1.3)
            </p>
          </div>
        </div>

        {/* Download Template Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadSampleTemplate('xlsx')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Télécharger un modèle Excel complet avec exemples"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Modèle Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => downloadSampleTemplate('csv')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Télécharger un modèle CSV standardisé"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Modèle CSV (.csv)</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold">
        <div className={`flex items-center gap-2 ${step === 'UPLOAD' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 'UPLOAD' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>1</span>
          <span>1. Sélection du Fichier</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300" />

        <div className={`flex items-center gap-2 ${step === 'MAPPING' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 'MAPPING' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>2</span>
          <span>2. Correspondance des Colonnes</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300" />

        <div className={`flex items-center gap-2 ${step === 'PREVIEW' ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 'PREVIEW' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>3</span>
          <span>3. Contrôle & Validation Pré-import</span>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300" />

        <div className={`flex items-center gap-2 ${step === 'COMPLETE' ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            step === 'COMPLETE' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
          }`}>4</span>
          <span>4. Intégration Terminée</span>
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 'UPLOAD' && (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/20 rounded-2xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f);
              }}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className="p-4 bg-white rounded-full shadow-xs border border-slate-200 text-teal-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Glissez-déposez votre fichier de données sanitaires ici, ou cliquez pour parcourir
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Formats acceptés : Microsoft Excel (.xlsx, .xls) et CSV délimité (.csv) — Max 25 Mo
              </p>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Directives de Qualité & Conformité One Health Kindu V1.3</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-[11px] leading-relaxed">
              <li><strong>Règles temporelles strictes :</strong> Si le fichier contient une donnée mensuelle globale, ne créez pas de dates journalières fictives.</li>
              <li><strong>Pas de zéro par défaut :</strong> Si une structure n'a pas rapporté le nombre de décès ou d'hospitalisations, laissez la cellule vide ou indiquez « INCONNU ».</li>
              <li><strong>Sécurité & Confidentialité :</strong> Aucun nom de patient ni numéro de téléphone ne doit figurer dans les colonnes de remarques.</li>
            </ul>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {step === 'MAPPING' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">{fileName} ({fileSize})</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {rawHeaders.length} colonnes détectées dans le fichier
            </span>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Associer les Colonnes de Votre Fichier aux Variables One Health</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Structure */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Structure de Santé <span className="text-rose-600">*</span>
                </label>
                <select
                  value={columnMapping.facility_name}
                  onChange={(e) => setColumnMapping({ ...columnMapping, facility_name: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Aire de Santé */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aire de Santé</label>
                <select
                  value={columnMapping.health_area_id}
                  onChange={(e) => setColumnMapping({ ...columnMapping, health_area_id: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Année */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Année <span className="text-rose-600">*</span>
                </label>
                <select
                  value={columnMapping.year}
                  onChange={(e) => setColumnMapping({ ...columnMapping, year: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Mois */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mois</label>
                <select
                  value={columnMapping.month}
                  onChange={(e) => setColumnMapping({ ...columnMapping, month: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Pathologie */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pathologie (Paludisme / Typhoïde) <span className="text-rose-600">*</span>
                </label>
                <select
                  value={columnMapping.disease}
                  onChange={(e) => setColumnMapping({ ...columnMapping, disease: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Cas */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre de Cas Déclarés <span className="text-rose-600">*</span>
                </label>
                <select
                  value={columnMapping.cases}
                  onChange={(e) => setColumnMapping({ ...columnMapping, cases: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Hospitalisations */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hospitalisations</label>
                <select
                  value={columnMapping.hospitalizations}
                  onChange={(e) => setColumnMapping({ ...columnMapping, hospitalizations: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Non renseigné / Colonne vide --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Décès */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Décès</label>
                <select
                  value={columnMapping.deaths}
                  onChange={(e) => setColumnMapping({ ...columnMapping, deaths: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Non renseigné / Colonne vide --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Méthode / Classification */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classification / Diagnostic</label>
                <select
                  value={columnMapping.case_classification}
                  onChange={(e) => setColumnMapping({ ...columnMapping, case_classification: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Auto (Confirmé) --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* Observations */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observations / Remarques</label>
                <select
                  value={columnMapping.notes}
                  onChange={(e) => setColumnMapping({ ...columnMapping, notes: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                >
                  <option value="">-- Sélectionner la colonne --</option>
                  {rawHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep('UPLOAD')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Changer de fichier
            </button>

            <button
              onClick={processMappedData}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Check className="w-4 h-4" />
              <span>Valider le Mapping & Prévisualiser</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PREVIEW & QUALITY CHECKS */}
      {step === 'PREVIEW' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-xs font-bold uppercase">Lignes Valides</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-emerald-900">{validCount} / {parsedRows.length}</div>
              <p className="text-[11px] text-emerald-700 mt-1">Conformes aux règles sanitaires</p>
            </div>

            <div className={`p-4 rounded-xl border ${
              invalidCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex items-center justify-between mb-1 ${
                invalidCount > 0 ? 'text-rose-700' : 'text-slate-500'
              }`}>
                <span className="text-xs font-bold uppercase">Lignes Invalides</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className={`text-2xl font-black ${
                invalidCount > 0 ? 'text-rose-900' : 'text-slate-700'
              }`}>{invalidCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Exclues automatiquement</p>
            </div>

            <div className={`p-4 rounded-xl border ${
              dupCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex items-center justify-between mb-1 ${
                dupCount > 0 ? 'text-amber-700' : 'text-slate-500'
              }`}>
                <span className="text-xs font-bold uppercase">Doublons Potentiels</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className={`text-2xl font-black ${
                dupCount > 0 ? 'text-amber-900' : 'text-slate-700'
              }`}>{dupCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Déjà existants en base</p>
            </div>
          </div>

          {/* Import Options Configuration */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statut initial des fiches importées
              </label>
              <select
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value as RecordStatus)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="IMPORTED">IMPORTED (Importé brut - Nécessite revue)</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW (En cours d'examen superviseur)</option>
                <option value="VALIDATED">VALIDATED (Validé directement pour la matrice)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Traitement des doublons détectés
              </label>
              <select
                value={duplicateHandling}
                onChange={(e) => setDuplicateHandling(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="FLAG">Importer et marquer pour arbitrage dans « Données à contrôler »</option>
                <option value="SKIP">Ignorer et ne pas importer les lignes en doublon</option>
              </select>
            </div>
          </div>

          {/* Table Preview */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Ligne</th>
                    <th className="py-2.5 px-3">Structure & Aire</th>
                    <th className="py-2.5 px-3">Période</th>
                    <th className="py-2.5 px-3">Pathologie</th>
                    <th className="py-2.5 px-2 text-right">Cas</th>
                    <th className="py-2.5 px-2 text-right">Hosp</th>
                    <th className="py-2.5 px-2 text-right">Décès</th>
                    <th className="py-2.5 px-3">Contrôle Qualité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((r, idx) => (
                    <tr key={idx} className={r.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/40'}>
                      <td className="py-2 px-3 font-mono font-bold text-slate-500">#{r.rowIndex}</td>
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-800">{r.mapped.facility_name}</div>
                        <div className="text-[10px] text-slate-500">{r.mapped.health_area_id}</div>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {String(r.mapped.month).padStart(2, '0')}/{r.mapped.year}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.mapped.disease === 'PALUDISME' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {r.mapped.disease}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">{r.mapped.cases}</td>
                      <td className="py-2 px-2 text-right text-slate-600">
                        {r.mapped.hospitalizations === 'UNKNOWN' ? 'INCONNU' : r.mapped.hospitalizations}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-600">
                        {r.mapped.deaths === 'UNKNOWN' ? 'INCONNU' : r.mapped.deaths}
                      </td>
                      <td className="py-2 px-3">
                        {r.isValid ? (
                          r.isDuplicate ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertTriangle className="w-3 h-3" /> Doublon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Conforme
                            </span>
                          )
                        ) : (
                          <div className="text-[10px] text-rose-700 font-medium">
                            {r.errors.join(' | ')}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setStep('MAPPING')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Modifier le mapping
            </button>

            <button
              onClick={handleExecuteImport}
              disabled={validCount === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Confirmer l'Importation de {validCount} Fiches Sanitaires</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETE */}
      {step === 'COMPLETE' && (
        <div className="py-10 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Importation Réussie ({importedCount} enregistrements)
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Les données ont été intégrées avec succès dans le module Données Sanitaires avec le statut <strong>{defaultStatus}</strong>.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setParsedRows([]);
                setStep('UPLOAD');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Importer un autre fichier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
