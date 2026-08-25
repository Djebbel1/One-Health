import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  ShieldAlert,
  Info,
  Clock,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  HealthRecord,
  RecordStatus,
  DiseaseType,
  DiagnosticStatus,
  DataSourceType,
  PeriodType,
  CaseClassification,
  DiagnosticMethod,
  AgeGroup,
  SexCategory,
  DataQualityLevel,
  HealthFacility
} from '../../types';
import { KINDU_HEALTH_ZONES, KINDU_HEALTH_AREAS, getHealthAreasByZone } from '../../data/kinduGeography';
import { checkForPII } from '../../utils/qualityControl';

interface HealthFormTabProps {
  initialRecord?: HealthRecord | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const HealthFormTab: React.FC<HealthFormTabProps> = ({
  initialRecord,
  onSuccess,
  onCancel,
}) => {
  const {
    healthFacilities,
    addHealthRecord,
    updateHealthRecord,
    generateNextHealthId,
    userSession
  } = useData();

  // Mode Edit vs New
  const isEditing = Boolean(initialRecord);

  // Form States
  const [formId, setFormId] = useState<string>('');
  const [status, setStatus] = useState<RecordStatus>('DRAFT');

  // Source & Structure
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>('REGISTRE_STRUCTURE_SANTE');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('FAC_HGR_KINDU');
  const [facilityName, setFacilityName] = useState<string>('Hôpital Général de Référence de Kindu');
  const [zoneId, setZoneId] = useState<string>('ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>('AS_KASUKU');

  // Période temporelle
  const [periodType, setPeriodType] = useState<PeriodType>('MOIS');
  const [recordDate, setRecordDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [year, setYear] = useState<number>(2024);
  const [month, setMonth] = useState<number>(4);
  const [week, setWeek] = useState<number>(15);

  // Pathologie & Diagnostic
  const [disease, setDisease] = useState<DiseaseType>('PALUDISME');
  const [caseClassification, setCaseClassification] = useState<CaseClassification>('CONFIRME');
  const [diagnosticMethod, setDiagnosticMethod] = useState<DiagnosticMethod>('TDR');

  // Démographie
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('TOUS ÂGES');
  const [sexCategory, setSexCategory] = useState<SexCategory>('TOTAL');

  // Cas, Hosp, Décès
  const [cases, setCases] = useState<number>(25);
  const [isHospUnknown, setIsHospUnknown] = useState<boolean>(false);
  const [hospitalizations, setHospitalizations] = useState<number>(4);
  const [isDeathsUnknown, setIsDeathsUnknown] = useState<boolean>(false);
  const [deaths, setDeaths] = useState<number>(0);

  // Traçabilité & Qualité
  const [sourceName, setSourceName] = useState<string>('Registre des consultations curatives');
  const [sourceReference, setSourceReference] = useState<string>('Livre N°4 - Folio 128');
  const [dataQuality, setDataQuality] = useState<DataQualityLevel>('HIGH');
  const [notes, setNotes] = useState<string>('');

  // Validation feedback
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [piiWarning, setPiiWarning] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Initialize or reset form
  useEffect(() => {
    if (initialRecord) {
      setFormId(initialRecord.id);
      setStatus(initialRecord.status);
      setDataSourceType(initialRecord.data_source_type || 'REGISTRE_STRUCTURE_SANTE');
      setSelectedFacilityId(initialRecord.facility_id || 'FAC_HGR_KINDU');
      setFacilityName(initialRecord.facility_name || initialRecord.structure_name || '');
      setZoneId(initialRecord.zone_id);
      setHealthAreaId(initialRecord.health_area_id);
      setPeriodType(initialRecord.period_type || 'MOIS');
      setRecordDate(initialRecord.record_date || initialRecord.date || new Date().toISOString().split('T')[0]);
      setYear(initialRecord.year || 2024);
      setMonth(initialRecord.month || 4);
      setWeek(initialRecord.week || 15);
      setDisease(initialRecord.disease);
      setCaseClassification(initialRecord.case_classification || (initialRecord.diagnostic_status === 'CONFIRMED' ? 'CONFIRME' : 'PROBABLE'));
      setDiagnosticMethod(initialRecord.diagnostic_method || (initialRecord.disease === 'PALUDISME' ? 'TDR' : 'TEST_LABORATOIRE'));
      setAgeGroup(initialRecord.age_group || 'TOUS ÂGES');
      setSexCategory(initialRecord.sex_category || 'TOTAL');
      setCases(initialRecord.cases || 0);

      if (initialRecord.hospitalizations === 'UNKNOWN') {
        setIsHospUnknown(true);
        setHospitalizations(0);
      } else {
        setIsHospUnknown(false);
        setHospitalizations(typeof initialRecord.hospitalizations === 'number' ? initialRecord.hospitalizations : 0);
      }

      if (initialRecord.deaths === 'UNKNOWN') {
        setIsDeathsUnknown(true);
        setDeaths(0);
      } else {
        setIsDeathsUnknown(false);
        setDeaths(typeof initialRecord.deaths === 'number' ? initialRecord.deaths : 0);
      }

      setSourceName(initialRecord.source_name || '');
      setSourceReference(initialRecord.source_reference || '');
      setDataQuality(initialRecord.data_quality || 'HIGH');
      setNotes(initialRecord.notes || initialRecord.comments || '');
    } else {
      const nextId = generateNextHealthId();
      setFormId(nextId);
      setStatus('DRAFT');
      setDataSourceType('REGISTRE_STRUCTURE_SANTE');
      const defaultFac = healthFacilities[0];
      if (defaultFac) {
        setSelectedFacilityId(defaultFac.facility_id);
        setFacilityName(defaultFac.facility_name);
        setZoneId(defaultFac.zone_id);
        setHealthAreaId(defaultFac.health_area_id);
      }
      setPeriodType('MOIS');
      const today = new Date().toISOString().split('T')[0];
      setRecordDate(today);
      setYear(2024);
      setMonth(4);
      setWeek(15);
      setDisease('PALUDISME');
      setCaseClassification('CONFIRME');
      setDiagnosticMethod('TDR');
      setAgeGroup('TOUS ÂGES');
      setSexCategory('TOTAL');
      setCases(25);
      setIsHospUnknown(false);
      setHospitalizations(4);
      setIsDeathsUnknown(false);
      setDeaths(0);
      setSourceName('Registre de consultation externe');
      setSourceReference('');
      setDataQuality('HIGH');
      setNotes('');
    }
  }, [initialRecord, healthFacilities]);

  // Sync Facility selection
  const handleFacilityChange = (facId: string) => {
    setSelectedFacilityId(facId);
    const found = healthFacilities.find(f => f.facility_id === facId);
    if (found) {
      setFacilityName(found.facility_name);
      setZoneId(found.zone_id);
      setHealthAreaId(found.health_area_id);
    }
  };

  // Notes PII check
  useEffect(() => {
    if (notes.trim()) {
      const pii = checkForPII(notes);
      if (pii.hasPII) {
        setPiiWarning(pii.reason || 'Donnée nominative ou numéro de téléphone interdit.');
      } else {
        setPiiWarning(null);
      }
    } else {
      setPiiWarning(null);
    }
  }, [notes]);

  // Validation
  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!formId.trim()) errs.formId = 'Identifiant requis (SAN-XXXXXX).';
    if (!facilityName.trim()) errs.facilityName = 'Structure de santé requise.';
    if (!healthAreaId) errs.healthAreaId = 'Aire de santé requise.';
    if (!year || year < 2010 || year > 2030) errs.year = 'Année invalide (2010–2030).';

    if (cases < 0 || isNaN(cases)) errs.cases = 'Le nombre de cas doit être supérieur ou égal à 0.';

    if (!isHospUnknown) {
      if (hospitalizations < 0 || isNaN(hospitalizations)) {
        errs.hospitalizations = 'Le nombre d\'hospitalisations doit être supérieur ou égal à 0.';
      } else if (hospitalizations > cases) {
        errs.hospitalizations = `Hospitalisations (${hospitalizations}) > Cas déclarés (${cases}).`;
      }
    }

    if (!isDeathsUnknown) {
      if (deaths < 0 || isNaN(deaths)) {
        errs.deaths = 'Le nombre de décès doit être supérieur ou égal à 0.';
      } else if (deaths > cases) {
        errs.deaths = `Décès (${deaths}) > Cas déclarés (${cases}).`;
      }
    }

    if (piiWarning) {
      errs.notes = piiWarning;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save handler
  const handleSave = (targetStatus: RecordStatus) => {
    if (!validate()) {
      return;
    }

    const computedDiagStatus: DiagnosticStatus =
      caseClassification === 'CONFIRME'
        ? 'CONFIRMED'
        : caseClassification === 'PROBABLE'
        ? 'PROBABLE'
        : caseClassification === 'SUSPECT'
        ? 'SUSPECT'
        : 'UNKNOWN';

    const monthStr = String(month).padStart(2, '0');
    const compDate = periodType === 'JOUR' ? recordDate : `${year}-${monthStr}-15`;

    const recordPayload: HealthRecord = {
      id: formId,
      health_record_id: formId,
      facility_id: selectedFacilityId,
      facility_name: facilityName,
      structure_name: facilityName,
      zone_id: zoneId,
      health_area_id: healthAreaId,
      date: compDate,
      record_date: compDate,
      year: Number(year),
      month: Number(month),
      week: periodType === 'SEMAINE' ? Number(week) : undefined,
      period_type: periodType,
      disease,
      case_classification: caseClassification,
      diagnostic_status: computedDiagStatus,
      diagnostic_method: diagnosticMethod,
      age_group: ageGroup,
      sex_category: sexCategory,
      cases: Number(cases),
      hospitalizations: isHospUnknown ? 'UNKNOWN' : Number(hospitalizations),
      deaths: isDeathsUnknown ? 'UNKNOWN' : Number(deaths),
      data_source_type: dataSourceType,
      data_source: dataSourceType,
      source_name: sourceName,
      source_reference: sourceReference,
      source_period: `${monthStr}/${year}`,
      data_quality: dataQuality,
      status: targetStatus,
      isDemoData: false,
      notes,
      comments: notes,
      registered_by: userSession.name || 'Enquêteur Sanitaire',
      created_by: userSession.name || 'Enquêteur Sanitaire',
      createdAt: initialRecord?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      updateHealthRecord(recordPayload, `Mise à jour fiche sanitaire ${formId} (Statut: ${targetStatus})`);
    } else {
      addHealthRecord(recordPayload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? `Modifier la Fiche Sanitaire (${formId})` : 'Saisie d\'un Nouveau Rapport Sanitaire'}
            </h2>
            <p className="text-xs text-slate-500">
              Protocole One Health Kindu V1.3 — Paludisme & Fièvre Typhoïde
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold">
            {formId}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Fiche sanitaire enregistrée avec succès dans la base de données locale.</span>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        {/* SECTION 1: SOURCE ET STRUCTURE DE SANTÉ */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>1. Structure Sanitaire & Origine de la Donnée</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de Source <span className="text-rose-600">*</span>
              </label>
              <select
                value={dataSourceType}
                onChange={(e) => setDataSourceType(e.target.value as DataSourceType)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="REGISTRE_STRUCTURE_SANTE">Registre de structure de santé</option>
                <option value="RAPPORT_MENSUEL">Rapport mensuel d'activité (RMA / SNIS)</option>
                <option value="RAPPORT_HEBDOMADAIRE">Rapport hebdomadaire épidémiologique</option>
                <option value="BASE_EXISTANTE">Base de données sanitaire existante</option>
                <option value="IMPORT_EXCEL">Import fichier Excel</option>
                <option value="IMPORT_CSV">Import fichier CSV</option>
                <option value="DHIS2_SURVEILLANCE">Extraction DHIS2</option>
                <option value="AUTRE">Autre source documentée</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Structure de Santé Référencée (Kindu & Alunguli) <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedFacilityId}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                {healthFacilities.map(f => (
                  <option key={f.facility_id} value={f.facility_id}>
                    {f.facility_name} ({f.facility_type}) — Aire : {f.health_area_id.replace('AS_', '')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Zone de Santé</label>
              <input
                type="text"
                disabled
                value={zoneId === 'ZS_KINDU' ? 'Zone de Santé de Kindu (Rive Droite)' : 'Zone de Santé d\'Alunguli (Rive Gauche)'}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aire de Santé Rattachée</label>
              <input
                type="text"
                disabled
                value={KINDU_HEALTH_AREAS.find(a => a.id === healthAreaId)?.name || healthAreaId}
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Référence Source / Registre
              </label>
              <input
                type="text"
                placeholder="Ex: Registre N°02, page 44"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PÉRIODE TEMPORELLE */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>2. Période & Échelle Temporelle</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Période</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="MOIS">Mensuelle (Format standard DPS)</option>
                <option value="JOUR">Journalière (Date précise)</option>
                <option value="SEMAINE">Hebdomadaire (Semaine épidémiologique)</option>
                <option value="TRIMESTRE">Trimestrielle</option>
                <option value="ANNÉE">Annuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Année <span className="text-rose-600">*</span></label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
                <option value={2020}>2020</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mois</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                {[
                  { m: 1, name: '01 - Janvier' },
                  { m: 2, name: '02 - Février' },
                  { m: 3, name: '03 - Mars' },
                  { m: 4, name: '04 - Avril' },
                  { m: 5, name: '05 - Mai' },
                  { m: 6, name: '06 - Juin' },
                  { m: 7, name: '07 - Juillet' },
                  { m: 8, name: '08 - Août' },
                  { m: 9, name: '09 - Septembre' },
                  { m: 10, name: '10 - Octobre' },
                  { m: 11, name: '11 - Novembre' },
                  { m: 12, name: '12 - Décembre' },
                ].map(item => (
                  <option key={item.m} value={item.m}>{item.name}</option>
                ))}
              </select>
            </div>

            {periodType === 'JOUR' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date exacte</label>
                <input
                  type="date"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                />
              </div>
            ) : periodType === 'SEMAINE' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Semaine épidém. (1–52)</label>
                <input
                  type="number"
                  min="1"
                  max="53"
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                />
              </div>
            ) : (
              <div className="flex items-center text-slate-500 text-[11px] pt-6">
                <span>Agrégation sur le mois entier</span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: PATHOLOGIE & CLASSIFICATION */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            <span>3. Pathologie Surveillée & Méthode de Diagnostic</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pathologie <span className="text-rose-600">*</span>
              </label>
              <select
                value={disease}
                onChange={(e) => {
                  const val = e.target.value as DiseaseType;
                  setDisease(val);
                  if (val === 'PALUDISME') setDiagnosticMethod('TDR');
                  else setDiagnosticMethod('TEST_LABORATOIRE');
                }}
                className="w-full text-xs bg-rose-50 border border-rose-300 text-rose-900 rounded-lg p-2.5 font-bold"
              >
                <option value="PALUDISME">Paludisme (Plasmodium falciparum)</option>
                <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde (Salmonella Typhi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Classification du Cas</label>
              <select
                value={caseClassification}
                onChange={(e) => setCaseClassification(e.target.value as CaseClassification)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="CONFIRME">Confirmé biologiquement (Labo / TDR)</option>
                <option value="PROBABLE">Probable (Critères cliniques + épidémiologiques)</option>
                <option value="SUSPECT">Suspect (Signes cliniques évocateurs)</option>
                <option value="INCONNU">Inconnu / Non spécifié dans le registre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Méthode de Diagnostic</label>
              <select
                value={diagnosticMethod}
                onChange={(e) => setDiagnosticMethod(e.target.value as DiagnosticMethod)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                {disease === 'PALUDISME' ? (
                  <>
                    <option value="TDR">Test de Diagnostic Rapide (TDR)</option>
                    <option value="MICROSCOPIE">Goutte Épaisse / Frottis Mince (Microscopie)</option>
                    <option value="DIAGNOSTIC_CLINIQUE">Diagnostic purement clinique</option>
                    <option value="AUTRE">Autre méthode</option>
                    <option value="INCONNU">Inconnu</option>
                  </>
                ) : (
                  <>
                    <option value="TEST_LABORATOIRE">Test de Laboratoire (Widal / Culture)</option>
                    <option value="DIAGNOSTIC_CLINIQUE">Diagnostic clinique (Fièvre continue + signes digestifs)</option>
                    <option value="AUTRE">Autre méthode biologique</option>
                    <option value="INCONNU">Inconnu</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: VENTILATION DÉMOGRAPHIQUE & VOLUMÉTRIE */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>4. Ventilation & Nombre de Cas (Obligatoires & Rigoureux)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Groupe d'Âge</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="TOUS ÂGES">Tous âges confondus</option>
                <option value="<5 ANS">&lt; 5 ans (Nourrissons / Jeunes enfants)</option>
                <option value="5–14 ANS">5 à 14 ans (Scolaires)</option>
                <option value="15–24 ANS">15 à 24 ans (Ados / Jeunes)</option>
                <option value="25–44 ANS">25 à 44 ans (Adultes actifs)</option>
                <option value="45–64 ANS">45 à 64 ans</option>
                <option value="65 ANS ET PLUS">65 ans et plus</option>
                <option value="INCONNU">Inconnu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sexe</label>
              <select
                value={sexCategory}
                onChange={(e) => setSexCategory(e.target.value as SexCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="TOTAL">Total (Masculin + Féminin)</option>
                <option value="MASCULIN">Masculin</option>
                <option value="FEMININ">Féminin</option>
                <option value="INCONNU">Inconnu</option>
              </select>
            </div>

            {/* CAS */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de Cas Déclarés <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={cases}
                onChange={(e) => setCases(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
              />
              {errors.cases && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.cases}</p>}
            </div>

            {/* HOSPITALISATIONS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Hospitalisations</label>
                <label className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHospUnknown}
                    onChange={(e) => setIsHospUnknown(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3 h-3"
                  />
                  <span>Non renseigné</span>
                </label>
              </div>

              {isHospUnknown ? (
                <div className="p-2 bg-slate-100 rounded-lg text-[11px] text-slate-500 font-medium italic border border-slate-200">
                  Non renseigné (INCONNU)
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={cases}
                  value={hospitalizations}
                  onChange={(e) => setHospitalizations(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                />
              )}
              {errors.hospitalizations && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.hospitalizations}</p>}
            </div>

            {/* DÉCÈS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Décès Déclarés</label>
                <label className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeathsUnknown}
                    onChange={(e) => setIsDeathsUnknown(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3 h-3"
                  />
                  <span>Non renseigné</span>
                </label>
              </div>

              {isDeathsUnknown ? (
                <div className="p-2 bg-slate-100 rounded-lg text-[11px] text-slate-500 font-medium italic border border-slate-200">
                  Non renseigné (INCONNU)
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  max={cases}
                  value={deaths}
                  onChange={(e) => setDeaths(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-semibold text-slate-900"
                />
              )}
              {errors.deaths && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.deaths}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 5: QUALITÉ & OBSERVATIONS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>5. Niveau de Qualité & Remarques (Sans PII)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualité de la Donnée Source</label>
              <select
                value={dataQuality}
                onChange={(e) => setDataQuality(e.target.value as DataQualityLevel)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="HIGH">Élevée (Registre complet, validé par le médecin/IT)</option>
                <option value="MEDIUM">Moyenne (Registre partiel ou lisibilité moyenne)</option>
                <option value="LOW">Faible (Rapport incomplet ou douteux)</option>
                <option value="UNKNOWN">Non évaluée</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Remarques / Contexte Épidémiologique (Aucun nom de patient ni téléphone)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Pic épidémique constaté suite aux crues du fleuve Congo en avril..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full text-xs bg-slate-50 border rounded-lg p-2.5 ${
                  piiWarning ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 focus:ring-rose-500'
                }`}
              />
              {piiWarning && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[11px] font-semibold flex items-center gap-1.5 mt-1">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{piiWarning}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Annuler
          </button>
        )}

        <div className="flex items-center gap-3 ml-auto">
          <button
            id="btn-save-draft-health"
            type="button"
            onClick={() => handleSave('DRAFT')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Enregistrer Brouillon</span>
          </button>

          <button
            id="btn-submit-review-health"
            type="button"
            onClick={() => handleSave('UNDER_REVIEW')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition"
          >
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Soumettre pour Contrôle</span>
          </button>

          {userSession.role === 'ADMINISTRATEUR' || userSession.role === 'SUPERVISEUR' ? (
            <button
              id="btn-validate-direct-health"
              type="button"
              onClick={() => handleSave('VALIDATED')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 shadow-xs rounded-lg transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider Directement</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
