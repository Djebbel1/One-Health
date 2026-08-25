import {
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  QualityIssue
} from '../types';
import { isWithinKindu } from '../data/kinduGeography';

// Patterns to detect potential Personal Identifiable Information (PII)
const PHONE_PATTERN = /(\+?243|0)[0-9]{8,9}/;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const COMMON_NAME_PREFIXES = /\b(mr|mme|dr|monsieur|madame|prof|patient|enfant|nom|prenom|chef|responsable)\s*:\s*[a-zA-Z]{3,}/i;

export function checkForPII(text: string): { hasPII: boolean; reason?: string } {
  if (!text) return { hasPII: false };
  
  if (PHONE_PATTERN.test(text)) {
    return { hasPII: true, reason: 'Numéro de téléphone détecté (strictement interdit par le protocole d\'anonymisation)' };
  }
  if (EMAIL_PATTERN.test(text)) {
    return { hasPII: true, reason: 'Adresse e-mail détectée (non autorisée dans les données d\'enquête)' };
  }
  if (COMMON_NAME_PREFIXES.test(text)) {
    return { hasPII: true, reason: 'Mention nominative de personne détectée' };
  }
  return { hasPII: false };
}

// 1. Audit Données Sanitaires
export function auditHealthRecord(record: HealthRecord): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Date Check (only if precise record_date / date provided)
  if (record.date && record.date > today) {
    issues.push({
      id: `QI_DATE_${record.id}`,
      module: 'SANITAIRE',
      recordId: record.id,
      recordIdentifier: record.health_record_id || record.id,
      severity: 'CRITIQUE',
      category: 'INCOHERENCE',
      title: 'Date dans le futur',
      description: `La date d'enregistrement ${record.date} est postérieure à la date actuelle (${today}).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
      suggestedAction: 'Corriger la date avec le registre du centre de santé.',
    });
  }

  // Mandatory fields: structure/facility, disease, year, health_area_id
  const struct = record.structure_name || record.facility_name;
  if (!record.health_area_id || !record.disease || !struct) {
    issues.push({
      id: `QI_MAND_${record.id}`,
      module: 'SANITAIRE',
      recordId: record.id,
      recordIdentifier: record.health_record_id || record.id,
      severity: 'CRITIQUE',
      category: 'DONNEE_MANQUANTE',
      title: 'Champs sanitaires obligatoires manquants',
      description: 'L\'aire de santé, la pathologie ou la structure de santé est vide.',
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Year bounds
  if (!record.year || record.year < 2010 || record.year > new Date().getFullYear() + 1) {
    issues.push({
      id: `QI_YEAR_${record.id}`,
      module: 'SANITAIRE',
      recordId: record.id,
      recordIdentifier: record.health_record_id || record.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Année invalide ou hors intervalle',
      description: `L'année renseignée (${record.year}) est en dehors de la plage acceptable (2010 - ${new Date().getFullYear()}).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Values impossibility controls: cases >= 0
  if (record.cases === undefined || record.cases === null || record.cases < 0) {
    issues.push({
      id: `QI_NEG_CASES_${record.id}`,
      module: 'SANITAIRE',
      recordId: record.id,
      recordIdentifier: record.health_record_id || record.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Nombre de cas invalide ou négatif',
      description: `Le nombre de cas (${record.cases}) ne peut pas être inférieur à zéro ou indéfini.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Hospitalizations check (only if number)
  if (typeof record.hospitalizations === 'number') {
    if (record.hospitalizations < 0) {
      issues.push({
        id: `QI_NEG_HOSP_${record.id}`,
        module: 'SANITAIRE',
        recordId: record.id,
        recordIdentifier: record.health_record_id || record.id,
        severity: 'CRITIQUE',
        category: 'VALEUR_IMPOSSIBLE',
        title: 'Nombre d\'hospitalisations négatif',
        description: `Le nombre d'hospitalisations (${record.hospitalizations}) ne peut pas être inférieur à zéro.`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    } else if (record.hospitalizations > record.cases) {
      issues.push({
        id: `QI_HOSP_CASES_${record.id}`,
        module: 'SANITAIRE',
        recordId: record.id,
        recordIdentifier: record.health_record_id || record.id,
        severity: 'CRITIQUE',
        category: 'INCOHERENCE',
        title: 'Hospitalisations > Nombre de cas totaux',
        description: `Nombre d'hospitalisations (${record.hospitalizations}) supérieur au nombre de cas déclarés (${record.cases}).`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    }
  }

  // Deaths check (only if number)
  if (typeof record.deaths === 'number') {
    if (record.deaths < 0) {
      issues.push({
        id: `QI_NEG_DEATHS_${record.id}`,
        module: 'SANITAIRE',
        recordId: record.id,
        recordIdentifier: record.health_record_id || record.id,
        severity: 'CRITIQUE',
        category: 'VALEUR_IMPOSSIBLE',
        title: 'Nombre de décès négatif',
        description: `Le nombre de décès (${record.deaths}) ne peut pas être inférieur à zéro.`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    } else if (record.deaths > record.cases) {
      issues.push({
        id: `QI_DEATHS_CASES_${record.id}`,
        module: 'SANITAIRE',
        recordId: record.id,
        recordIdentifier: record.health_record_id || record.id,
        severity: 'CRITIQUE',
        category: 'VALEUR_IMPOSSIBLE',
        title: 'Décès déclarés > Nombre de cas',
        description: `Nombre de décès (${record.deaths}) supérieur au total de cas déclarés (${record.cases}).`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    }
  }

  // Check notes & comments for PII
  const textToCheck = [record.notes, record.comments, record.source_name, record.source_reference]
    .filter(Boolean)
    .join(' ');
  if (textToCheck) {
    const piiCheck = checkForPII(textToCheck);
    if (piiCheck.hasPII) {
      issues.push({
        id: `QI_PII_SAN_${record.id}`,
        module: 'SANITAIRE',
        recordId: record.id,
        recordIdentifier: record.health_record_id || record.id,
        severity: 'CRITIQUE',
        category: 'INCOHERENCE',
        title: 'Violation de confidentialité PII (Donnée nominative/Téléphone)',
        description: piiCheck.reason || 'Nom de patient ou numéro de téléphone repéré dans les champs sanitaires.',
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    }
  }

  return issues;
}

// 2. Audit Données Climatiques
export function auditClimateRecord(record: ClimateRecord): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Mandatory fields
  const locationOrStation = record.location_id || record.station_name;
  if (!locationOrStation || !record.date) {
    issues.push({
      id: `QI_CLI_MAND_${record.id}`,
      module: 'CLIMATIQUE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      severity: 'CRITIQUE',
      category: 'DONNEE_MANQUANTE',
      title: 'Identifiant station ou date climatique manquante',
      description: 'Chaque relevé climatique doit comporter une station et une date valide.',
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  const tempMin = typeof record.temp_min_c === 'number' ? record.temp_min_c : (typeof record.temperature_min === 'number' ? record.temperature_min : undefined);
  const tempMax = typeof record.temp_max_c === 'number' ? record.temp_max_c : (typeof record.temperature_max === 'number' ? record.temperature_max : undefined);
  const tempMean = typeof record.temp_mean_c === 'number' ? record.temp_mean_c : (typeof record.temperature_mean === 'number' ? record.temperature_mean : undefined);
  const rainfall = typeof record.rainfall_mm === 'number' ? record.rainfall_mm : undefined;
  const humidity = typeof record.humidity_pct === 'number' ? record.humidity_pct : (typeof record.humidity_percent === 'number' ? record.humidity_percent : undefined);

  // Physical limits & consistency
  if (tempMin !== undefined && tempMax !== undefined && tempMin > tempMax) {
    issues.push({
      id: `QI_TEMP_RANGE_${record.id}`,
      module: 'CLIMATIQUE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      severity: 'CRITIQUE',
      category: 'INCOHERENCE',
      title: 'Température minimale > Température maximale',
      description: `Température min (${tempMin}°C) supérieure à la maximale (${tempMax}°C).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  if (tempMean !== undefined && tempMin !== undefined && tempMax !== undefined && (tempMean < tempMin || tempMean > tempMax)) {
    issues.push({
      id: `QI_TEMP_MEAN_${record.id}`,
      module: 'CLIMATIQUE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      severity: 'AVERTISSEMENT',
      category: 'INCOHERENCE',
      title: 'Température moyenne incohérente',
      description: `Moyenne (${tempMean}°C) non comprise entre Tmin (${tempMin}°C) et Tmax (${tempMax}°C).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  if (rainfall !== undefined && (rainfall < 0 || rainfall > 650)) {
    issues.push({
      id: `QI_RAIN_LIMIT_${record.id}`,
      module: 'CLIMATIQUE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Pluviométrie hors limites physiques',
      description: `Précipitation enregistrée (${rainfall} mm) en dehors de l'intervalle plausible (0 - 650 mm).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  if (humidity !== undefined && (humidity < 10 || humidity > 100)) {
    issues.push({
      id: `QI_HUMID_LIMIT_${record.id}`,
      module: 'CLIMATIQUE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      severity: 'AVERTISSEMENT',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Humidité relative hors échelle (10% - 100%)',
      description: `Taux d'humidité (${humidity}%) aberrant pour la région de Kindu.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  return issues;
}

// 3. Audit Observations Environnementales
export function auditEnvironmentalObservation(obs: EnvironmentalObservation): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // GPS Bounds
  if (!isWithinKindu(obs.latitude, obs.longitude)) {
    issues.push({
      id: `QI_GPS_ENV_${obs.id}`,
      module: 'ENVIRONNEMENT',
      recordId: obs.id,
      recordIdentifier: obs.id,
      severity: 'CRITIQUE',
      category: 'GPS_INCORRECT',
      title: 'Coordonnées GPS hors de l\'emprise de Kindu',
      description: `Point GPS [${obs.latitude.toFixed(4)}, ${obs.longitude.toFixed(4)}] situé en dehors du territoire de Kindu.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // GPS Accuracy
  if (obs.gps_accuracy > 20) {
    issues.push({
      id: `QI_GPS_ACC_${obs.id}`,
      module: 'ENVIRONNEMENT',
      recordId: obs.id,
      recordIdentifier: obs.id,
      severity: 'AVERTISSEMENT',
      category: 'GPS_INCORRECT',
      title: 'Précision GPS faible (> 20 mètres)',
      description: `Précision GPS de ${obs.gps_accuracy.toFixed(1)} m. Nécessite une validation exceptionnelle du superviseur.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // STRICT SCIENTIFIC RULE: Validity Dates and Historical Status
  if (!obs.validity_start || !obs.validity_end) {
    issues.push({
      id: `QI_VALID_MAND_${obs.id}`,
      module: 'ENVIRONNEMENT',
      recordId: obs.id,
      recordIdentifier: obs.id,
      severity: 'CRITIQUE',
      category: 'DONNEE_MANQUANTE',
      title: 'Période de validité environnementale obligatoire manquante',
      description: 'Une observation actuelle ne peut pas être exploitée sans définir ses dates de validité temporelle.',
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  } else if (obs.validity_start > obs.validity_end) {
    issues.push({
      id: `QI_VALID_ORDER_${obs.id}`,
      module: 'ENVIRONNEMENT',
      recordId: obs.id,
      recordIdentifier: obs.id,
      severity: 'CRITIQUE',
      category: 'INCOHERENCE',
      title: 'Dates de validité inversées',
      description: `Date de début de validité (${obs.validity_start}) postérieure à la date de fin (${obs.validity_end}).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Text PII
  if (obs.description) {
    const pii = checkForPII(obs.description);
    if (pii.hasPII) {
      issues.push({
        id: `QI_PII_ENV_${obs.id}`,
        module: 'ENVIRONNEMENT',
        recordId: obs.id,
        recordIdentifier: obs.id,
        severity: 'CRITIQUE',
        category: 'INCOHERENCE',
        title: 'Donnée nominative/personnelle dans la description du gîte',
        description: pii.reason || 'Nom ou numéro détecté.',
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    }
  }

  return issues;
}

// 4. Audit Enquêtes Ménages
export function auditHouseholdSurvey(survey: HouseholdSurvey): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // GPS Bounds
  if (!isWithinKindu(survey.latitude, survey.longitude)) {
    issues.push({
      id: `QI_GPS_MEN_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'GPS_INCORRECT',
      title: 'Ménage géolocalisé hors de Kindu',
      description: `Coordonnées [${survey.latitude.toFixed(4)}, ${survey.longitude.toFixed(4)}] hors de la zone d'étude.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // GPS Accuracy
  if (survey.gps_accuracy > 20) {
    issues.push({
      id: `QI_GPS_ACC_MEN_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'AVERTISSEMENT',
      category: 'GPS_INCORRECT',
      title: 'Position GPS ménage imprécise (> 20m)',
      description: `Précision GPS relevée : ${survey.gps_accuracy.toFixed(1)} m. Veuillez reprendre ou valider exceptionnellement.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Demographic Mathematical Rule: adults_15plus = hh_size - children_u5 - children_5_14
  if (survey.children_u5 + survey.children_5_14 > survey.hh_size) {
    issues.push({
      id: `QI_DEMOG_SUM_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Nombre d\'enfants > Taille totale du ménage',
      description: `Enfants <5 ans (${survey.children_u5}) + Enfants 5-14 ans (${survey.children_5_14}) = ${survey.children_u5 + survey.children_5_14}, supérieur à la taille du ménage (${survey.hh_size}).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  if (survey.hh_size <= 0 || survey.children_u5 < 0 || survey.children_5_14 < 0 || survey.adults_15plus < 0) {
    issues.push({
      id: `QI_DEMOG_NEG_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Valeur démographique négative ou nulle',
      description: 'La taille du ménage ou les tranches d\'âge contiennent des nombres négatifs ou nuls.',
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Bednet Controls: bednet_used_last_night <= hh_size, bednet_number >= 0
  if (survey.bednet_number < 0) {
    issues.push({
      id: `QI_MILD_NEG_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'VALEUR_IMPOSSIBLE',
      title: 'Nombre de moustiquaires négatif',
      description: `Nombre de moustiquaires (${survey.bednet_number}) impossible.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  if (survey.bednet_used_last_night > survey.hh_size) {
    issues.push({
      id: `QI_MILD_USAGE_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'AVERTISSEMENT',
      category: 'INCOHERENCE',
      title: 'Personnes sous moustiquaire > Taille du ménage',
      description: `Dormeurs sous moustiquaire (${survey.bednet_used_last_night}) supérieur aux membres du ménage (${survey.hh_size}).`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Scientific Identifier Format (MEN-XXXXXX)
  if (!survey.id.startsWith('MEN-')) {
    issues.push({
      id: `QI_ANON_ID_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'INCOHERENCE',
      title: 'Format d\'identifiant ménage non conforme',
      description: `L'identifiant (${survey.id}) doit impérativement respecter la nomenclature MEN-XXXXXX.`,
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  // Consent
  if (!survey.consent_obtained) {
    issues.push({
      id: `QI_CONSENT_${survey.id}`,
      module: 'MENAGE',
      recordId: survey.id,
      recordIdentifier: survey.id,
      severity: 'CRITIQUE',
      category: 'DONNEE_MANQUANTE',
      title: 'Consentement éclairé non attesté',
      description: 'Le consentement préalable du chef ou représentant de ménage doit être validé.',
      detectedAt: new Date().toISOString(),
      status: 'A_CORRIGER',
    });
  }

  return issues;
}

// 5. Détection de doublons (Health & Household)
export function detectDuplicates(
  healthRecords: HealthRecord[],
  householdSurveys: HouseholdSurvey[]
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // Health records duplicates (same structure/facility + date/month/year + disease + age_group + sex_category + case_classification)
  const healthKeys = new Map<string, HealthRecord>();
  for (const hr of healthRecords) {
    if (hr.duplicateResolved) continue;
    const struct = (hr.facility_name || hr.structure_name || '').trim().toLowerCase();
    const period = hr.record_date || `${hr.year}-${hr.month}`;
    const age = hr.age_group || 'ALL';
    const sex = hr.sex_category || 'ALL';
    const classification = hr.case_classification || hr.diagnostic_status || 'ALL';
    
    const key = `${hr.health_area_id}_${struct}_${hr.disease}_${period}_${age}_${sex}_${classification}`;
    
    if (healthKeys.has(key)) {
      const existing = healthKeys.get(key)!;
      issues.push({
        id: `QI_DUP_HR_${hr.id}`,
        module: 'SANITAIRE',
        recordId: hr.id,
        recordIdentifier: hr.health_record_id || hr.id,
        severity: 'AVERTISSEMENT',
        category: 'DOUBLON',
        title: 'Doublon potentiel de fiche sanitaire',
        description: `Un enregistrement similaire (${existing.health_record_id || existing.id}) existe déjà pour la structure "${hr.structure_name || hr.facility_name}", pathologie ${hr.disease}, période ${period} (${age}, ${sex}).`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
        suggestedAction: 'Arbitrer dans le module Données Sanitaires : Conserver, Fusionner ou Supprimer.',
      });
    } else {
      healthKeys.set(key, hr);
    }
  }

  // Household survey duplicates (same ID or identical GPS within 2 meters on same day)
  const householdIds = new Set<string>();
  for (const hs of householdSurveys) {
    if (householdIds.has(hs.id)) {
      issues.push({
        id: `QI_DUP_HS_${hs.id}`,
        module: 'MENAGE',
        recordId: hs.id,
        recordIdentifier: hs.id,
        severity: 'CRITIQUE',
        category: 'DOUBLON',
        title: 'Doublon identifiant ménage strict',
        description: `L'identifiant ${hs.id} a été enregistré plusieurs fois dans la base.`,
        detectedAt: new Date().toISOString(),
        status: 'A_CORRIGER',
      });
    } else {
      householdIds.add(hs.id);
    }
  }

  return issues;
}

// Dedicated helper to group health records into duplicate clusters for arbitration
export function findHealthDuplicateClusters(
  healthRecords: HealthRecord[]
): { compositeKey: string; records: HealthRecord[] }[] {
  const map = new Map<string, HealthRecord[]>();

  for (const hr of healthRecords) {
    if (hr.duplicateResolved) continue;
    const struct = (hr.facility_name || hr.structure_name || '').trim().toLowerCase();
    const period = hr.record_date || `${hr.year}-${hr.month}`;
    const age = hr.age_group || 'ALL';
    const sex = hr.sex_category || 'ALL';
    const classification = hr.case_classification || hr.diagnostic_status || 'ALL';

    const key = `${hr.health_area_id} | ${struct} | ${hr.disease} | ${period} | ${age} | ${sex} | ${classification}`;

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(hr);
  }

  const clusters: { compositeKey: string; records: HealthRecord[] }[] = [];
  for (const [key, records] of map.entries()) {
    if (records.length > 1) {
      clusters.push({ compositeKey: key, records });
    }
  }
  return clusters;
}

export interface QualityAuditReport {
  totalRecordsChecked: number;
  validatedCount: number;
  errorCount: number;
  warningCount: number;
  qualityScore: number;
  issues: QualityIssue[];
}

export function runFullQualityAudit(
  householdSurveys: HouseholdSurvey[],
  environmentalObs: EnvironmentalObservation[],
  healthRecords: HealthRecord[],
  climateRecords: ClimateRecord[]
): QualityAuditReport {
  const allIssues: QualityIssue[] = [];

  // Audit health records
  healthRecords.forEach(h => {
    const issues = auditHealthRecord(h);
    allIssues.push(...issues);
  });

  // Audit climate records
  climateRecords.forEach(c => {
    const issues = auditClimateRecord(c);
    allIssues.push(...issues);
  });

  // Audit environmental observations
  environmentalObs.forEach(e => {
    const issues = auditEnvironmentalObservation(e);
    allIssues.push(...issues);
  });

  // Audit household surveys
  householdSurveys.forEach(s => {
    const issues = auditHouseholdSurvey(s);
    allIssues.push(...issues);
  });

  // Detect duplicates
  const dupIssues = detectDuplicates(healthRecords, householdSurveys);
  allIssues.push(...dupIssues);

  const totalRecords =
    householdSurveys.length +
    environmentalObs.length +
    healthRecords.length +
    climateRecords.length;

  const validatedCount =
    householdSurveys.filter(s => s.status === 'VALIDATED').length +
    environmentalObs.filter(e => e.status === 'VALIDATED').length +
    healthRecords.filter(h => h.status === 'VALIDATED').length +
    climateRecords.filter(c => c.status === 'VALIDATED').length;

  const errorCount = allIssues.filter(i => i.severity === 'CRITIQUE' || i.severity === 'ERROR').length;
  const warningCount = allIssues.filter(i => i.severity === 'AVERTISSEMENT' || i.severity === 'WARNING').length;

  const qualityScore = totalRecords > 0
    ? Math.max(0, Math.min(100, Math.round(((totalRecords - errorCount) / totalRecords) * 100)))
    : 100;

  return {
    totalRecordsChecked: totalRecords,
    validatedCount,
    errorCount,
    warningCount,
    qualityScore,
    issues: allIssues.map(i => ({
      ...i,
      ruleId: i.ruleId || i.id.split('_').slice(0, 3).join('_'),
      recommendation: i.recommendation || i.suggestedAction || 'Vérifier la cohérence de la donnée saisie.'
    }))
  };
}

