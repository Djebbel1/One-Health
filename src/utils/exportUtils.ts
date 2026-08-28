import * as XLSX from 'xlsx';
import {
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  ModelMatrixRow
} from '../types';

/**
 * Technical Variable Dictionary for Epidemiology, Statistics & GIS (R, Python, SPSS, Stata, QGIS)
 */
export const DATA_DICTIONARY = [
  // Households
  { table: 'households', variable: 'id', type: 'VARCHAR(20)', description: 'Identifiant anonyme strict du ménage (ex: MEN-000001)', values: 'MEN-[0-9]{6}' },
  { table: 'households', variable: 'status', type: 'VARCHAR(15)', description: 'Statut de validation du formulaire', values: 'DRAFT | SUBMITTED | UNDER_REVIEW | VALIDATED | REJECTED | CORRECTED' },
  { table: 'households', variable: 'zone_id', type: 'VARCHAR(20)', description: 'Identifiant de la zone de santé', values: 'ZS_KINDU, ZS_ALUNGULI' },
  { table: 'households', variable: 'health_area_id', type: 'VARCHAR(30)', description: 'Identifiant de l\'aire de santé de Kindu', values: 'AS_MIKELENGE, AS_TOKOLOTE, AS_BASOKO, etc.' },
  { table: 'households', variable: 'neighborhood_id', type: 'VARCHAR(30)', description: 'Identifiant du quartier', values: 'Q_ALU_PORT, Q_BASOKO_PORT, etc.' },
  { table: 'households', variable: 'street_name', type: 'VARCHAR(80)', description: 'Nom de l\'avenue ou rue', values: 'Texte libre' },
  { table: 'households', variable: 'latitude', type: 'DECIMAL(9,6)', description: 'Latitude WGS84 capturée par GPS', values: '-3.05 à -2.87' },
  { table: 'households', variable: 'longitude', type: 'DECIMAL(9,6)', description: 'Longitude WGS84 capturée par GPS', values: '25.86 à 26.02' },
  { table: 'households', variable: 'gps_accuracy', type: 'DECIMAL(4,1)', description: 'Précision de la mesure GPS en mètres', values: '>= 0.0' },
  { table: 'households', variable: 'hh_size', type: 'INTEGER', description: 'Nombre total de personnes résidant dans le ménage', values: '>= 1' },
  { table: 'households', variable: 'children_u5', type: 'INTEGER', description: 'Nombre d\'enfants de moins de 5 ans', values: '>= 0' },
  { table: 'households', variable: 'children_5_14', type: 'INTEGER', description: 'Nombre d\'enfants âgés de 5 à 14 ans', values: '>= 0' },
  { table: 'households', variable: 'adults_15plus', type: 'INTEGER', description: 'Calcul automatique : hh_size - children_u5 - children_5_14', values: '>= 0' },
  { table: 'households', variable: 'water_source', type: 'INTEGER', description: 'Source principale d\'approvisionnement en eau', values: '1=Réseau, 2=Borne-fontaine, 3=Forage, 4=Puits, 5=Source, 6=Fleuve/Rivière, 7=Pluie, 8=Vendeur, 9=Autre, 99=Ne sait pas' },
  { table: 'households', variable: 'water_treatment_method', type: 'VARCHAR(30)', description: 'Méthode de traitement de l\'eau de boisson', values: 'AUCUN, EBULLITION, CHLORE_AQUATABS, FILTRATION' },
  { table: 'households', variable: 'latrine_available', type: 'BOOLEAN', description: 'Disponibilité d\'une latrine au sein de la parcelle', values: 'TRUE / FALSE' },
  { table: 'households', variable: 'latrine_type', type: 'VARCHAR(40)', description: 'Type technique de la latrine si disponible', values: 'CHASSE_FOSSE_SEPTIQUE, FOSSE_VIP_AMELIOREE, FOSSE_SIMPLE_DALLE, FOSSE_SANS_DALLE' },
  { table: 'households', variable: 'bednet_number', type: 'INTEGER', description: 'Nombre de moustiquaires imprégnées disponibles', values: '>= 0' },
  { table: 'households', variable: 'bednet_used_last_night', type: 'INTEGER', description: 'Nombre de personnes ayant dormi sous MILD la veille', values: '<= hh_size' },
  { table: 'households', variable: 'stagnant_water_near', type: 'BOOLEAN', description: 'Présence d\'eau stagnante à moins de 50 m du domicile', values: 'TRUE / FALSE' },

  // Environmental Observations
  { table: 'environmental_observations', variable: 'id', type: 'VARCHAR(20)', description: 'Identifiant strict de l\'observation (ex: ENV-000001)', values: 'ENV-[0-9]{6}' },
  { table: 'environmental_observations', variable: 'factor_type', type: 'VARCHAR(40)', description: 'Catégorie du facteur environnemental documenté', values: 'EAU_STAGNANTE, DECHETS_VISIBLES, CANIVEAU_OBSTRUE, INONDATION, LATRINE, VEGETATION_DENSE, COURS_D_EAU_PROCHE' },
  { table: 'environmental_observations', variable: 'observation_date', type: 'DATE', description: 'Date de constat de visu sur le terrain', values: 'YYYY-MM-DD' },
  { table: 'environmental_observations', variable: 'validity_start', type: 'DATE', description: 'Date de début de validité spatio-temporelle du facteur', values: 'YYYY-MM-DD' },
  { table: 'environmental_observations', variable: 'validity_end', type: 'DATE', description: 'Date de fin de validité spatio-temporelle du facteur', values: 'YYYY-MM-DD' },
  { table: 'environmental_observations', variable: 'historical_status', type: 'VARCHAR(35)', description: 'Statut de documentation historique (Règle anti-extrapolation)', values: 'CURRENT | HISTORICAL_DOCUMENTED | HISTORICAL_REPORTED_UNVERIFIED | UNKNOWN' },
  { table: 'environmental_observations', variable: 'larval_presence', type: 'BOOLEAN', description: 'Présence effective de larves de moustiques', values: 'TRUE / FALSE' },

  // Health Records
  { table: 'health_records', variable: 'id', type: 'VARCHAR(20)', description: 'Identifiant du rapport sanitaire (ex: SAN-000001)', values: 'SAN-[0-9]{6}' },
  { table: 'health_records', variable: 'disease', type: 'VARCHAR(20)', description: 'Pathologie surveillée', values: 'PALUDISME, FIEVRE_TYPHOIDE' },
  { table: 'health_records', variable: 'cases', type: 'INTEGER', description: 'Nombre de cas notifiés', values: '>= 0' },
  { table: 'health_records', variable: 'hospitalizations', type: 'INTEGER', description: 'Nombre de patients hospitalisés (<= cases)', values: '>= 0' },
  { table: 'health_records', variable: 'deaths', type: 'INTEGER', description: 'Nombre de décès enregistrés (<= cases)', values: '>= 0' },
  { table: 'health_records', variable: 'diagnostic_status', type: 'VARCHAR(20)', description: 'Degré de confirmation biologique', values: 'CONFIRMED, PROBABLE, SUSPECT, UNKNOWN' },

  // Climate Records
  { table: 'climate_records', variable: 'id', type: 'VARCHAR(20)', description: 'Identifiant du relevé climatique (ex: CLI-000001)', values: 'CLI-[0-9]{6}' },
  { table: 'climate_records', variable: 'rainfall_mm', type: 'DECIMAL(6,1)', description: 'Précipitations mensuelles cumulées en millimètres', values: '>= 0.0 mm' },
  { table: 'climate_records', variable: 'temperature_mean', type: 'DECIMAL(4,1)', description: 'Température moyenne mensuelle (°C)', values: '15.0 - 45.0 °C' },
  { table: 'climate_records', variable: 'humidity_percent', type: 'INTEGER', description: 'Humidité relative moyenne (%)', values: '0 - 100%' },
];

/**
 * Universal Multi-Tab Excel (.xlsx) Export
 */
export function exportToFullExcel(
  householdSurveys: HouseholdSurvey[],
  environmentalObs: EnvironmentalObservation[],
  healthRecords: HealthRecord[],
  climateRecords: ClimateRecord[],
  modelMatrix: ModelMatrixRow[] = [],
  onlyValidated: boolean = false
) {
  const wb = XLSX.utils.book_new();

  // Filter if requested
  const filteredSurveys = onlyValidated ? householdSurveys.filter(s => s.status === 'VALIDATED') : householdSurveys;
  const filteredEnv = onlyValidated ? environmentalObs.filter(e => e.status === 'VALIDATED') : environmentalObs;
  const filteredHealth = onlyValidated ? healthRecords.filter(h => h.status === 'VALIDATED') : healthRecords;
  const filteredClimate = onlyValidated ? climateRecords.filter(c => c.status === 'VALIDATED') : climateRecords;

  // 1. Dictionnaire des variables
  const wsDict = XLSX.utils.json_to_sheet(DATA_DICTIONARY);
  XLSX.utils.book_append_sheet(wb, wsDict, 'Dictionnaire_Variables');

  // 2. Matrice Spatio-Temporelle compilée (Prête pour R / Python / GLMM / INLA)
  if (modelMatrix.length > 0) {
    const wsMatrix = XLSX.utils.json_to_sheet(modelMatrix);
    XLSX.utils.book_append_sheet(wb, wsMatrix, 'Base_Modele_AS_Mois');
  }

  // 3. Enquêtes Ménages
  const wsSurveys = XLSX.utils.json_to_sheet(
    filteredSurveys.map(s => ({
      id: s.id,
      statut: s.status,
      zone_id: s.zone_id,
      aire_sante: s.health_area_id,
      quartier: s.neighborhood_id,
      avenue: s.street_name,
      date_enquete: s.survey_date,
      latitude: s.latitude,
      longitude: s.longitude,
      precision_gps_m: s.gps_accuracy,
      taille_menage: s.hh_size,
      enfants_u5: s.children_u5,
      enfants_5_14: s.children_5_14,
      adultes_15plus: s.adults_15plus,
      code_source_eau: s.water_source,
      label_source_eau: s.water_source_label || s.water_source_details,
      traitement_eau: s.water_treatment_method,
      latrine_presente: s.latrine_available ? 'OUI' : 'NON',
      type_latrine: s.latrine_type || 'AUCUNE',
      nb_moustiquaires: s.bednet_number,
      nb_dormeurs_mild: s.bednet_used_last_night,
      eau_stagnante_proche: s.stagnant_water_near ? 'OUI' : 'NON',
      enqueteur: s.surveyor_id,
      est_donnee_demo: s.isDemoData ? 'OUI' : 'NON',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsSurveys, 'Enquetes_Menages');

  // 4. Observations Environnementales
  const wsEnv = XLSX.utils.json_to_sheet(
    filteredEnv.map(e => ({
      id: e.observation_id || e.id,
      statut: e.status,
      menage_lie: e.household_id || 'NON_LIE',
      distance_menage_calculee_m: e.calculated_household_distance_m !== undefined ? e.calculated_household_distance_m : 'N/A',
      zone_id: e.zone_id,
      aire_sante: e.health_area_id,
      quartier: e.neighborhood_id,
      avenue: e.street_name || 'N/A',
      type_facteur: e.factor_type,
      presence: e.presence || 'Oui',
      description: e.description,
      commentaires_enqueteur: e.enumerator_comment || 'N/A',
      date_observation: e.observation_date,
      heure_observation: e.observation_time || 'N/A',
      statut_historique: e.historical_status || 'CURRENT',
      source_historique: e.historical_source || 'Observation directe',
      debut_validite: e.validity_start || 'N/A',
      fin_validite: e.validity_end || 'N/A',
      latitude: e.latitude,
      longitude: e.longitude,
      precision_gps_m: e.gps_accuracy,
      statut_gps: e.gps_status || 'VALID',
      justification_gps: e.gps_justification || 'N/A',
      qualite_microbiologique: e.factor_type === 'POINT_EAU' ? 'NON_ANALYSEE' : 'N/A',
      rejet_motif: e.rejection_reason || 'N/A',
      rejete_par: e.rejected_by || 'N/A',
      statut_synchro: e.sync_status || 'SYNCED',
      enqueteur: e.surveyor_id,
      est_donnee_demo: e.isDemoData ? 'OUI' : 'NON',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsEnv, 'Observations_Env');

  // 5. Données Sanitaires (V1.3 étendu)
  const wsHealth = XLSX.utils.json_to_sheet(
    filteredHealth.map(h => ({
      id: h.health_record_id || h.id,
      statut: h.status,
      date: h.record_date || h.date,
      annee: h.year,
      mois: h.month,
      semaine: h.week || 'N/A',
      periode_type: h.period_type || 'MOIS',
      zone_id: h.zone_id,
      aire_sante: h.health_area_id,
      structure: h.facility_name || h.structure_name,
      maladie: h.disease,
      classification_cas: h.case_classification || (h.diagnostic_status === 'CONFIRMED' ? 'CONFIRME' : 'PROBABLE'),
      methode_diagnostic: h.diagnostic_method || 'TDR',
      statut_diagnostic: h.diagnostic_status,
      groupe_age: h.age_group || 'TOUS ÂGES',
      sexe: h.sex_category || 'TOTAL',
      cas_notifies: h.cases,
      hospitalisations: h.hospitalizations === 'UNKNOWN' ? 'INCONNU' : h.hospitalizations,
      deces: h.deaths === 'UNKNOWN' ? 'INCONNU' : h.deaths,
      type_source: h.data_source_type || h.data_source,
      source_reference: h.source_reference || '',
      qualite_donnee: h.data_quality || 'HIGH',
      enregistre_par: h.registered_by || h.created_by || 'Enquêteur',
      valide_par: h.validated_by || '',
      est_donnee_demo: h.isDemoData ? 'OUI' : 'NON',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsHealth, 'Donnees_Sanitaires');

  // 6. Données Climatiques
  const wsClimate = XLSX.utils.json_to_sheet(
    filteredClimate.map(c => ({
      id: c.climate_id || c.id,
      statut: c.status,
      date: c.date,
      annee: c.year,
      mois: c.month,
      station: c.station_name || c.location_id,
      pluie_mm: c.rainfall_mm,
      temp_moyenne: c.temp_mean_c ?? c.temperature_mean,
      temp_min: c.temp_min_c ?? c.temperature_min,
      temp_max: c.temp_max_c ?? c.temperature_max,
      humidite_pct: c.humidity_pct ?? c.humidity_percent,
      source: c.data_source || c.source,
      qualite_donnee: c.data_quality,
      est_donnee_demo: c.isDemoData ? 'OUI' : 'NON',
    }))
  );
  XLSX.utils.book_append_sheet(wb, wsClimate, 'Donnees_Climatiques');

  const filename = `ONE_HEALTH_KINDU_EXPORT_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export const exportFullExcelWorkbook = exportToFullExcel;
export const exportToExcel = exportToFullExcel;

/**
 * Custom Multi-Sheet Excel Exporter
 */
export function exportCustomSheetsToExcel(
  sheets: { sheetName: string; data: any[] }[],
  filename: string = 'export.xlsx'
) {
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    if (sheet.data && sheet.data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName.slice(0, 31));
    }
  }
  XLSX.writeFile(wb, filename);
}

/**
 * Universal CSV Exporter
 */
export function exportToCSV(data: any[], filename: string = 'export') {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.join(';'));

  // Data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '';
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    });
    csvRows.push(values.join(';'));
  }

  const csvContent = '\uFEFF' + csvRows.join('\n'); // Add UTF-8 BOM
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportCsv = exportToCSV;

/**
 * GeoJSON Exporter for GIS (QGIS, ArcGIS, Mapbox)
 */
export function exportToGeoJSON(
  data: any[],
  filename: string = 'ONE_HEALTH_KINDU_GIS'
) {
  const features: any[] = [];

  for (const item of data) {
    if (item.latitude && item.longitude) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.longitude, item.latitude],
        },
        properties: { ...item },
      });
    }
  }

  const geoJsonObj = {
    type: 'FeatureCollection',
    name: 'OneHealth_Kindu_SpatialData',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features,
  };

  const str = JSON.stringify(geoJsonObj, null, 2);
  const blob = new Blob([str], { type: 'application/geo+json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.geojson`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportGeoJson = exportToGeoJSON;

export function exportVariablesCodebook() {
  exportToCSV(DATA_DICTIONARY, 'OneHealth_Kindu_Dictionnaire_Variables');
}

/**
 * V1.7 Full Multi-Tab Spatiotemporal Database Excel Export
 */
export function exportSpatiotemporalV17Excel(
  units: any[],
  healthData: any[],
  climateData: any[],
  envData: any[],
  washData: any[],
  hhAggregates: any[],
  integratedData: any[],
  modelReadyRows: any[],
  qualityChecks: any[],
  dataSources: any[]
) {
  const wb = XLSX.utils.book_new();

  // 1. MODEL_READY_DATA (Prioritaire pour les biostatisticiens)
  if (modelReadyRows && modelReadyRows.length > 0) {
    const ws = XLSX.utils.json_to_sheet(modelReadyRows);
    XLSX.utils.book_append_sheet(wb, ws, 'MODEL_READY_DATA');
  }

  // 2. INTEGRATED_SPATIOTEMPORAL_DATA
  if (integratedData && integratedData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(integratedData);
    XLSX.utils.book_append_sheet(wb, ws, 'BASE_INTEGREE');
  }

  // 3. SPATIOTEMPORAL_UNIT
  if (units && units.length > 0) {
    const ws = XLSX.utils.json_to_sheet(units);
    XLSX.utils.book_append_sheet(wb, ws, 'UNITES_SPATIOTEMPORELLES');
  }

  // 4. HEALTH_SPATIOTEMPORAL
  if (healthData && healthData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(healthData);
    XLSX.utils.book_append_sheet(wb, ws, 'SANTE_SPATIOTEMPOREL');
  }

  // 5. CLIMATE_SPATIOTEMPORAL
  if (climateData && climateData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(climateData);
    XLSX.utils.book_append_sheet(wb, ws, 'CLIMAT_SPATIOTEMPOREL');
  }

  // 6. ENVIRONMENT_SPATIOTEMPORAL
  if (envData && envData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(envData);
    XLSX.utils.book_append_sheet(wb, ws, 'ENVIRONNEMENT_SPATIO');
  }

  // 7. WASH & HOUSEHOLD_AGGREGATE
  if (washData && washData.length > 0) {
    const ws = XLSX.utils.json_to_sheet(washData);
    XLSX.utils.book_append_sheet(wb, ws, 'EAU_ASSAINISSEMENT');
  }

  if (hhAggregates && hhAggregates.length > 0) {
    const ws = XLSX.utils.json_to_sheet(hhAggregates);
    XLSX.utils.book_append_sheet(wb, ws, 'MENAGES_AGREGES');
  }

  // 8. DATA_QUALITY_CHECK
  if (qualityChecks && qualityChecks.length > 0) {
    const ws = XLSX.utils.json_to_sheet(qualityChecks);
    XLSX.utils.book_append_sheet(wb, ws, 'CONTROLES_QUALITE');
  }

  // 9. DATA_SOURCE
  if (dataSources && dataSources.length > 0) {
    const ws = XLSX.utils.json_to_sheet(dataSources);
    XLSX.utils.book_append_sheet(wb, ws, 'SOURCES_DONNEES');
  }

  const filename = `ONE_HEALTH_KINDU_V17_BASE_SPATIOTEMPORELLE_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * V1.7 JSON Exporter for Spatiotemporal Database
 */
export function exportSpatiotemporalV17Json(payload: any, filename: string = 'ONE_HEALTH_KINDU_V17_DATABASE') {
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

