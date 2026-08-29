/**
 * Données de Démonstration & Paramètres pour le Module V1.17 :
 * SYSTÈME DE SURVEILLANCE ONE HEALTH & DÉTECTION DES SIGNAUX D'ALERTE (Kindu, Maniema, RDC)
 * 
 * TOUTES LES DONNÉES SONT CLAIREMENT ÉTIQUETÉES COMME FICTIF / DÉMONSTRATION SCIENTIFIQUE.
 */

import {
  SurveillanceSignal,
  SurveillanceAlert,
  ThresholdAuditEntry,
  SurveillanceReport17Sections,
  V117SurveillanceScenarioTest
} from '../types';

// ============================================================================
// 1. STATISTIQUES GLOBALES & TENDANCES DE SURVEILLANCE
// ============================================================================

export interface SurveillanceSummaryOverview {
  activeSignalsCount: number;
  criticalSignalsCount: number;
  activeAlertsCount: number;
  verifiedAlertsCount: number;
  averageTransmissionDelayDays: number;
  overallCompletenessRate: number;
  delayedFacilitiesCount: number;
  zonesMonitoredCount: number;
  pathologiesMonitoredCount: number;
}

export const MOCK_SURVEILLANCE_OVERVIEW_V117: SurveillanceSummaryOverview = {
  activeSignalsCount: 6,
  criticalSignalsCount: 2,
  activeAlertsCount: 3,
  verifiedAlertsCount: 5,
  averageTransmissionDelayDays: 3.8,
  overallCompletenessRate: 91.4,
  delayedFacilitiesCount: 4,
  zonesMonitoredCount: 3, // Kasuku, Mikelenge, Alunguli
  pathologiesMonitoredCount: 2 // Paludisme, Fièvre Typhoïde (+ extension Choléra)
};

// ============================================================================
// 2. SÉRIES CHRONOLOGIQUES OBSERVÉ vs ATTENDU (HEBDOMADAIRE 2026)
// ============================================================================

export interface TimeSeriesSurveillancePoint {
  period: string; // ex: "S24", "S25"
  dateLabel: string;
  observedMalariaCases: number;
  expectedMalariaCases: number;
  malariaLowerBound: number;
  malariaUpperBound: number;
  malariaThresholdAlert: number;
  
  observedTyphoidCases: number;
  expectedTyphoidCases: number;
  typhoidLowerBound: number;
  typhoidUpperBound: number;
  
  rainfallMm: number;
  rainfallNormalMm: number;
  temperatureC: number;
  stagnantWaterSitesIndex: number;
  turbidityNtu: number;
  
  isAnomalyMalaria: boolean;
  isAnomalyTyphoid: boolean;
  completenessPercent: number;
}

export const MOCK_SURVEILLANCE_TIMESERIES_2026: TimeSeriesSurveillancePoint[] = [
  {
    period: 'S25 (Juin)',
    dateLabel: '15-21 Juin 2026',
    observedMalariaCases: 142,
    expectedMalariaCases: 138,
    malariaLowerBound: 115,
    malariaUpperBound: 160,
    malariaThresholdAlert: 185,
    observedTyphoidCases: 28,
    expectedTyphoidCases: 25,
    typhoidLowerBound: 18,
    typhoidUpperBound: 32,
    rainfallMm: 45,
    rainfallNormalMm: 50,
    temperatureC: 27.2,
    stagnantWaterSitesIndex: 18,
    turbidityNtu: 4.2,
    isAnomalyMalaria: false,
    isAnomalyTyphoid: false,
    completenessPercent: 96
  },
  {
    period: 'S26 (Juin)',
    dateLabel: '22-28 Juin 2026',
    observedMalariaCases: 150,
    expectedMalariaCases: 145,
    malariaLowerBound: 120,
    malariaUpperBound: 170,
    malariaThresholdAlert: 195,
    observedTyphoidCases: 31,
    expectedTyphoidCases: 27,
    typhoidLowerBound: 19,
    typhoidUpperBound: 35,
    rainfallMm: 62,
    rainfallNormalMm: 55,
    temperatureC: 27.5,
    stagnantWaterSitesIndex: 22,
    turbidityNtu: 4.8,
    isAnomalyMalaria: false,
    isAnomalyTyphoid: false,
    completenessPercent: 94
  },
  {
    period: 'S27 (Juil)',
    dateLabel: '29 Juin - 05 Juil 2026',
    observedMalariaCases: 165,
    expectedMalariaCases: 152,
    malariaLowerBound: 125,
    malariaUpperBound: 180,
    malariaThresholdAlert: 205,
    observedTyphoidCases: 34,
    expectedTyphoidCases: 29,
    typhoidLowerBound: 20,
    typhoidUpperBound: 38,
    rainfallMm: 88,
    rainfallNormalMm: 60,
    temperatureC: 28.1,
    stagnantWaterSitesIndex: 35,
    turbidityNtu: 6.5,
    isAnomalyMalaria: false,
    isAnomalyTyphoid: false,
    completenessPercent: 95
  },
  {
    period: 'S28 (Juil)',
    dateLabel: '06-12 Juil 2026',
    observedMalariaCases: 180,
    expectedMalariaCases: 158,
    malariaLowerBound: 130,
    malariaUpperBound: 185,
    malariaThresholdAlert: 215,
    observedTyphoidCases: 42,
    expectedTyphoidCases: 30,
    typhoidLowerBound: 21,
    typhoidUpperBound: 39,
    rainfallMm: 142,
    rainfallNormalMm: 75,
    temperatureC: 28.4,
    stagnantWaterSitesIndex: 58,
    turbidityNtu: 9.8,
    isAnomalyMalaria: false,
    isAnomalyTyphoid: true, // Début anomalie typhoïde suite pic turbidité
    completenessPercent: 92
  },
  {
    period: 'S29 (Juil)',
    dateLabel: '13-19 Juil 2026',
    observedMalariaCases: 210,
    expectedMalariaCases: 165,
    malariaLowerBound: 135,
    malariaUpperBound: 195,
    malariaThresholdAlert: 225,
    observedTyphoidCases: 56,
    expectedTyphoidCases: 32,
    typhoidLowerBound: 22,
    typhoidUpperBound: 42,
    rainfallMm: 168,
    rainfallNormalMm: 80,
    temperatureC: 28.0,
    stagnantWaterSitesIndex: 74,
    turbidityNtu: 14.2,
    isAnomalyMalaria: true,
    isAnomalyTyphoid: true,
    completenessPercent: 90
  },
  {
    period: 'S30 (Juil)',
    dateLabel: '20-26 Juil 2026',
    observedMalariaCases: 265,
    expectedMalariaCases: 172,
    malariaLowerBound: 140,
    malariaUpperBound: 205,
    malariaThresholdAlert: 235,
    observedTyphoidCases: 68,
    expectedTyphoidCases: 33,
    typhoidLowerBound: 23,
    typhoidUpperBound: 43,
    rainfallMm: 110,
    rainfallNormalMm: 70,
    temperatureC: 28.6,
    stagnantWaterSitesIndex: 82,
    turbidityNtu: 12.0,
    isAnomalyMalaria: true, // Signal critique persistant
    isAnomalyTyphoid: true,
    completenessPercent: 88
  },
  {
    period: 'S31 (Août)',
    dateLabel: '27 Juil - 02 Août 2026',
    observedMalariaCases: 298,
    expectedMalariaCases: 180,
    malariaLowerBound: 145,
    malariaUpperBound: 215,
    malariaThresholdAlert: 245,
    observedTyphoidCases: 62,
    expectedTyphoidCases: 35,
    typhoidLowerBound: 24,
    typhoidUpperBound: 46,
    rainfallMm: 95,
    rainfallNormalMm: 65,
    temperatureC: 28.8,
    stagnantWaterSitesIndex: 88,
    turbidityNtu: 8.5,
    isAnomalyMalaria: true,
    isAnomalyTyphoid: true,
    completenessPercent: 89
  },
  {
    period: 'S32 (Août)',
    dateLabel: '03-09 Août 2026',
    observedMalariaCases: 312,
    expectedMalariaCases: 185,
    malariaLowerBound: 150,
    malariaUpperBound: 220,
    malariaThresholdAlert: 250,
    observedTyphoidCases: 51,
    expectedTyphoidCases: 34,
    typhoidLowerBound: 23,
    typhoidUpperBound: 45,
    rainfallMm: 80,
    rainfallNormalMm: 60,
    temperatureC: 28.9,
    stagnantWaterSitesIndex: 79,
    turbidityNtu: 6.2,
    isAnomalyMalaria: true,
    isAnomalyTyphoid: true,
    completenessPercent: 91
  },
  {
    period: 'S33 (Août)',
    dateLabel: '10-16 Août 2026',
    observedMalariaCases: 285,
    expectedMalariaCases: 182,
    malariaLowerBound: 148,
    malariaUpperBound: 216,
    malariaThresholdAlert: 248,
    observedTyphoidCases: 44,
    expectedTyphoidCases: 33,
    typhoidLowerBound: 22,
    typhoidUpperBound: 44,
    rainfallMm: 65,
    rainfallNormalMm: 58,
    temperatureC: 28.5,
    stagnantWaterSitesIndex: 65,
    turbidityNtu: 5.1,
    isAnomalyMalaria: true,
    isAnomalyTyphoid: false,
    completenessPercent: 93
  },
  {
    period: 'S34 (Août)',
    dateLabel: '17-23 Août 2026',
    observedMalariaCases: 252,
    expectedMalariaCases: 178,
    malariaLowerBound: 145,
    malariaUpperBound: 211,
    malariaThresholdAlert: 242,
    observedTyphoidCases: 38,
    expectedTyphoidCases: 31,
    typhoidLowerBound: 21,
    typhoidUpperBound: 41,
    rainfallMm: 55,
    rainfallNormalMm: 55,
    temperatureC: 28.2,
    stagnantWaterSitesIndex: 52,
    turbidityNtu: 4.5,
    isAnomalyMalaria: true,
    isAnomalyTyphoid: false,
    completenessPercent: 94
  }
];

// ============================================================================
// 3. SIGNAUX SANITAIRES DÉTECTÉS (V1.17)
// ============================================================================

export const MOCK_SURVEILLANCE_SIGNALS_V117: SurveillanceSignal[] = [
  {
    id: 'SIG_2026_001',
    code: 'SIG-2026-084',
    pathology: 'PALUDISME',
    pathologyName: 'Paludisme simple et grave',
    healthZone: 'Kasuku',
    healthArea: 'Basoko',
    period: '2026-S34 (17-23 Août 2026)',
    dateIso: '2026-08-23',
    indicator: 'Incidence hebdomadaire (/1000 hab)',
    unit: 'cas / 1000 hab',
    observedValue: 48.6,
    expectedValue: 31.2,
    differenceValue: 17.4,
    differencePercent: 55.8,
    thresholdApplied: 40.0,
    thresholdDescription: 'Moyenne historique + 1.96 écart-type (P95 de référence saisonnière)',
    method: 'MODELE_GLM_NB_VALIDE_V116',
    level: 'SIGNAL_CRITIQUE',
    confidenceScore: 88,
    confidenceRating: 'ELEVEE',
    dataQuality: {
      completenessRate: 95.0,
      transmissionDelayDays: 2.1,
      delayedFacilitiesCount: 0,
      hasOutliers: false,
      definitionChanged: false,
      coverageExpanded: false,
      isProxyData: false,
      historicalYearsAvailable: 6,
      isHistoricalReferenceLimited: false
    },
    status: 'CONVERTI_EN_ALERTE',
    persistence: {
      firstDetectedPeriod: '2026-S30',
      consecutivePeriodsCount: 5,
      isPersistent: true,
      trend: 'HAUSSE'
    },
    spatialExtension: {
      isCluster: true,
      neighboringZonesAffected: ['Lwama', 'Mikelenge-Centre'],
      isSpatialSpread: true
    },
    oneHealthDrivers: {
      rainfallAnomalyMm: +42.0,
      temperatureAnomalyC: +1.4,
      relativeHumidityAnomaly: +12.0,
      stagnantWaterRiskIndex: 82.0,
      unmanagedWasteSites: 14,
      washAccessDeficitPercent: 44.0,
      appliedLagMonths: 1,
      lagAssociationDescription: 'Lag 1 mois validé scientifiquement dans V1.15/V1.16 : Précipitations intenses de juillet corrélées au pic de transmission en août.'
    },
    isDemonstrationData: true
  },
  {
    id: 'SIG_2026_002',
    code: 'SIG-2026-085',
    pathology: 'FIEVRE_TYPHOIDE',
    pathologyName: 'Fièvre Typhoïde (Syndrome fébrile digestif)',
    healthZone: 'Mikelenge',
    healthArea: 'Mikelenge-Centre',
    period: '2026-S34 (17-23 Août 2026)',
    dateIso: '2026-08-23',
    indicator: 'Nombre de cas hebdomadaires confirmés Widal/Hémoculture',
    unit: 'cas',
    observedValue: 24,
    expectedValue: 11,
    differenceValue: 13,
    differencePercent: 118.2,
    thresholdApplied: 18,
    thresholdDescription: 'Seuil épidémique local (médiane saisonnière x 2.0)',
    method: 'MEDIANE_SAISONNIERE',
    level: 'SIGNAL_IMPORTANT',
    confidenceScore: 74,
    confidenceRating: 'INTERMEDIAIRE',
    dataQuality: {
      completenessRate: 88.5,
      transmissionDelayDays: 4.8,
      delayedFacilitiesCount: 2,
      hasOutliers: false,
      definitionChanged: false,
      coverageExpanded: false,
      isProxyData: true,
      proxyWarningNote: 'Signal basé partiellement sur une donnée proxy : turbidité mesurée au point de captage fluvial.',
      historicalYearsAvailable: 4,
      isHistoricalReferenceLimited: false
    },
    status: 'EN_EVALUATION',
    persistence: {
      firstDetectedPeriod: '2026-S32',
      consecutivePeriodsCount: 3,
      isPersistent: true,
      trend: 'HAUSSE'
    },
    spatialExtension: {
      isCluster: false,
      neighboringZonesAffected: ['Kasuku'],
      isSpatialSpread: true
    },
    oneHealthDrivers: {
      rainfallAnomalyMm: +35.0,
      temperatureAnomalyC: +0.8,
      relativeHumidityAnomaly: +8.0,
      stagnantWaterRiskIndex: 65.0,
      unmanagedWasteSites: 22,
      washAccessDeficitPercent: 58.0,
      appliedLagMonths: 0,
      lagAssociationDescription: 'Lag 0 à 1 semaine : Débordement d égouts et contamination des forages suite aux pluies d orage.'
    },
    isDemonstrationData: true
  },
  {
    id: 'SIG_2026_003',
    code: 'SIG-2026-086',
    pathology: 'PALUDISME',
    pathologyName: 'Paludisme simple et grave',
    healthZone: 'Alunguli',
    healthArea: 'Kimbombo',
    period: '2026-S34 (17-23 Août 2026)',
    dateIso: '2026-08-23',
    indicator: 'Taux de positivité TDR (%)',
    unit: '%',
    observedValue: 62.4,
    expectedValue: 48.0,
    differenceValue: 14.4,
    differencePercent: 30.0,
    thresholdApplied: 55.0,
    thresholdDescription: 'Seuil d alerte opérationnel (TDR > 55%)',
    method: 'MOYENNE_HISTORIQUE',
    level: 'VIGILANCE',
    confidenceScore: 62,
    confidenceRating: 'INTERMEDIAIRE',
    dataQuality: {
      completenessRate: 72.0,
      transmissionDelayDays: 6.5,
      delayedFacilitiesCount: 3,
      hasOutliers: false,
      definitionChanged: false,
      coverageExpanded: true,
      coverageExpansionNote: 'Signal potentiellement affecté par l ouverture récente de 2 nouveaux postes de santé.',
      isProxyData: false,
      historicalYearsAvailable: 3,
      isHistoricalReferenceLimited: true
    },
    status: 'ACTIF',
    persistence: {
      firstDetectedPeriod: '2026-S34',
      consecutivePeriodsCount: 1,
      isPersistent: false,
      trend: 'STABLE'
    },
    spatialExtension: {
      isCluster: false,
      neighboringZonesAffected: [],
      isSpatialSpread: false
    },
    oneHealthDrivers: {
      rainfallAnomalyMm: +18.0,
      temperatureAnomalyC: +0.4,
      relativeHumidityAnomaly: +5.0,
      stagnantWaterRiskIndex: 45.0,
      unmanagedWasteSites: 8,
      washAccessDeficitPercent: 32.0,
      appliedLagMonths: 1,
      lagAssociationDescription: 'Lag 1 mois standard anophélien.'
    },
    isDemonstrationData: true
  },
  {
    id: 'SIG_2026_004',
    code: 'SIG-2026-087',
    pathology: 'FIEVRE_TYPHOIDE',
    pathologyName: 'Fièvre Typhoïde',
    healthZone: 'Kasuku',
    healthArea: 'Mayele',
    period: '2026-S34 (17-23 Août 2026)',
    dateIso: '2026-08-23',
    indicator: 'Incidence pour 1000 hab',
    unit: 'cas / 1000 hab',
    observedValue: 6.2,
    expectedValue: 3.1,
    differenceValue: 3.1,
    differencePercent: 100.0,
    thresholdApplied: 5.0,
    thresholdDescription: 'Double de l incidence de base',
    method: 'TENDANCE_LINEAIRE',
    level: 'VIGILANCE',
    confidenceScore: 58,
    confidenceRating: 'FAIBLE_LIMITEE',
    dataQuality: {
      completenessRate: 64.0,
      transmissionDelayDays: 8.2,
      delayedFacilitiesCount: 4,
      hasOutliers: true,
      definitionChanged: true,
      definitionChangeNote: 'Rupture potentielle de série : nouveau kit TDR Typhoïde introduit en S32.',
      coverageExpanded: false,
      isProxyData: false,
      historicalYearsAvailable: 2,
      isHistoricalReferenceLimited: true
    },
    status: 'CLASSE_SANS_SUITE',
    persistence: {
      firstDetectedPeriod: '2026-S34',
      consecutivePeriodsCount: 1,
      isPersistent: false,
      trend: 'STABLE'
    },
    spatialExtension: {
      isCluster: false,
      neighboringZonesAffected: [],
      isSpatialSpread: false
    },
    oneHealthDrivers: {
      rainfallAnomalyMm: +12.0,
      temperatureAnomalyC: +0.2,
      relativeHumidityAnomaly: +4.0,
      stagnantWaterRiskIndex: 30.0,
      unmanagedWasteSites: 10,
      washAccessDeficitPercent: 25.0,
      appliedLagMonths: 0,
      lagAssociationDescription: 'Pas de corrélation climatique directe observée.'
    },
    isDemonstrationData: true
  }
];

// ============================================================================
// 4. ALERTES POTENTIELLES & VÉRIFICATION HUMAINE (V1.17)
// ============================================================================

export const MOCK_SURVEILLANCE_ALERTS_V117: SurveillanceAlert[] = [
  {
    id: 'ALT_2026_001',
    code: 'ALT-2026-012',
    title: 'Alerte Paludisme — Flambée Épidémique Spatiale Zone Kasuku / Basoko',
    pathology: 'PALUDISME',
    pathologyName: 'Paludisme simple et grave',
    healthZone: 'Kasuku',
    healthAreas: ['Basoko', 'Lwama', 'Mikelenge-Est'],
    triggerDate: '2026-08-20',
    period: '2026-S34',
    level: 'NIVEAU_2_ALERTE',
    status: 'EN_VERIFICATION',
    triggerSignalIds: ['SIG_2026_001'],
    multiCriteriaRule: {
      ruleName: 'Règle Multi-Critères Standard One Health Paludisme',
      caseIncreaseConfirmed: true,
      deviationOverExpectedPercent: 55.8,
      persistenceWeeks: 5,
      spatialZonesCount: 3,
      climaticFactorTriggered: true,
      environmentalFactorTriggered: true,
      dataQualitySufficient: true,
      ruleSummary: 'Cas observés > +50% attendu ET persistance ≥ 3 semaines ET cluster spatial actif ET excès pluviométrique à Lag-1 validé.'
    },
    confidenceScore: 88,
    predictedRiskScore: 92, // Risque modélisé élevé cohérent avec l'anomalie
    humanVerification: {
      actionTaken: 'METTRE_EN_OBSERVATION',
      verifiedBy: 'Dr. Jean-Paul KASONGO',
      verifierRole: 'SUPERVISEUR',
      verifiedAt: '2026-08-21 14:30',
      mandatoryJustification: 'Signal renforcé confirmé sur le terrain par l équipe cadre de la Zone de Santé Kasuku. TDR disponibles, mais stock d ACT limité. Investigation entomologique en cours sur les gîtes larvaires de Basoko.',
      reviewerNotes: 'Déploiement recommandé de moustiquaires imprégnées d insecticide et renforcement des stocks d artémisinine.',
      additionalDataRequested: ['Rapport entomologique de terrain', 'Relevé journalier des admissions pédiatriques']
    },
    historyTimeline: [
      {
        date: '2026-08-20 09:15',
        user: 'Système Algorithmique V1.17',
        role: 'AUTOMATIQUE',
        action: 'Génération automatique de l alerte potentielle',
        newStatus: 'NOUVELLE',
        comment: 'Détection de signal critique persistant SIG-2026-084 avec cluster spatial.'
      },
      {
        date: '2026-08-21 14:30',
        user: 'Dr. Jean-Paul KASONGO',
        role: 'SUPERVISEUR',
        action: 'Mise en observation & vérification humaine',
        previousStatus: 'NOUVELLE',
        newStatus: 'EN_VERIFICATION',
        comment: 'Validation des données cliniques avec l hôpital général de référence de Kindu.'
      }
    ],
    isDemonstrationData: true
  },
  {
    id: 'ALT_2026_002',
    code: 'ALT-2026-013',
    title: 'Alerte Typhoïde / WASH — Suspicion de Contamination Hydrique Mikelenge',
    pathology: 'FIEVRE_TYPHOIDE',
    pathologyName: 'Fièvre Typhoïde',
    healthZone: 'Mikelenge',
    healthAreas: ['Mikelenge-Centre'],
    triggerDate: '2026-08-22',
    period: '2026-S34',
    level: 'NIVEAU_1_VIGILANCE',
    status: 'NOUVELLE',
    triggerSignalIds: ['SIG_2026_002'],
    multiCriteriaRule: {
      ruleName: 'Règle Multi-Critères Hydrique & Entérique',
      caseIncreaseConfirmed: true,
      deviationOverExpectedPercent: 118.2,
      persistenceWeeks: 3,
      spatialZonesCount: 1,
      climaticFactorTriggered: true,
      environmentalFactorTriggered: true,
      dataQualitySufficient: true,
      ruleSummary: 'Doublement des cas sur 3 semaines ET pic de turbidité fluviale ET déficit d assainissement localisé.'
    },
    confidenceScore: 74,
    predictedRiskScore: 78,
    humanVerification: {},
    historyTimeline: [
      {
        date: '2026-08-22 11:00',
        user: 'Système Algorithmique V1.17',
        role: 'AUTOMATIQUE',
        action: 'Déclenchement du signal de vigilance',
        newStatus: 'NOUVELLE',
        comment: 'Hausse continue des consultations pour syndrome fébrile digestif.'
      }
    ],
    isDemonstrationData: true
  },
  {
    id: 'ALT_2026_003',
    code: 'ALT-2026-010',
    title: 'Alerte Résolue — Pic de Cas Palustres Alunguli Juillet 2026',
    pathology: 'PALUDISME',
    pathologyName: 'Paludisme',
    healthZone: 'Alunguli',
    healthAreas: ['Kimbombo', 'Alunguli-Fleuve'],
    triggerDate: '2026-07-15',
    period: '2026-S29',
    level: 'NIVEAU_2_ALERTE',
    status: 'CLOTUREE',
    triggerSignalIds: [],
    multiCriteriaRule: {
      ruleName: 'Règle Épidémique Saisonnière',
      caseIncreaseConfirmed: true,
      deviationOverExpectedPercent: 60.0,
      persistenceWeeks: 4,
      spatialZonesCount: 2,
      climaticFactorTriggered: true,
      environmentalFactorTriggered: true,
      dataQualitySufficient: true,
      ruleSummary: 'Pic post-inondation fluviale résorbé après distribution ciblée de MILDA.'
    },
    confidenceScore: 85,
    predictedRiskScore: 65,
    humanVerification: {
      actionTaken: 'CONFIRMER',
      verifiedBy: 'Prof. Dieudonné AMISI',
      verifierRole: 'CHERCHEUR',
      verifiedAt: '2026-07-18 10:00',
      mandatoryJustification: 'Campagne de pulvérisation intra-domiciliaire et distribution de masse de moustiquaires réalisées avec succès. Normalisation confirmée en S32.',
      reviewerNotes: 'Situation sous contrôle épidémiologique.'
    },
    historyTimeline: [
      {
        date: '2026-07-15 08:30',
        user: 'Système Algorithmique V1.17',
        role: 'AUTOMATIQUE',
        action: 'Déclenchement de l alerte',
        newStatus: 'NOUVELLE',
        comment: 'Anomalie de transmission post-pluies.'
      },
      {
        date: '2026-07-18 10:00',
        user: 'Prof. Dieudonné AMISI',
        role: 'CHERCHEUR',
        action: 'Confirmation & plan de riposte',
        previousStatus: 'NOUVELLE',
        newStatus: 'CONFIRMEE',
        comment: 'Riposte vectorielle déclenchée.'
      },
      {
        date: '2026-08-10 16:00',
        user: 'Dr. Jean-Paul KASONGO',
        role: 'SUPERVISEUR',
        action: 'Clôture de l alerte',
        previousStatus: 'CONFIRMEE',
        newStatus: 'CLOTUREE',
        comment: 'Incidence revenue dans les intervalles de confiance attendus.'
      }
    ],
    isDemonstrationData: true
  }
];

// ============================================================================
// 5. AUDIT DES MODIFICATIONS DE SEUILS & RÈGLES
// ============================================================================

export const MOCK_THRESHOLD_AUDIT_LOG_V117: ThresholdAuditEntry[] = [
  {
    id: 'AUD_001',
    pathology: 'Paludisme',
    indicator: 'Incidence hebdomadaire (/1000 hab)',
    previousThreshold: 35.0,
    newThreshold: 40.0,
    modifiedBy: 'Dr. Jean-Paul KASONGO',
    userRole: 'ADMINISTRATEUR',
    modifiedAt: '2026-07-01 09:30',
    mandatoryJustification: 'Ajustement méthodologique suite à la mise à jour des données démographiques de recensement 2025 et recalibration du modèle GLM-NB V1.16.'
  },
  {
    id: 'AUD_002',
    pathology: 'Fièvre Typhoïde',
    indicator: 'Cas confirmés par semaine',
    previousThreshold: 15,
    newThreshold: 18,
    modifiedBy: 'Prof. Dieudonné AMISI',
    userRole: 'CHERCHEUR',
    modifiedAt: '2026-07-15 14:15',
    mandatoryJustification: 'Prise en compte de l augmentation de la capacité diagnostique par hémoculture dans les 3 structures pilotes de Mikelenge.'
  }
];

// ============================================================================
// 6. SUITE DES 10 TESTS MÉTHODOLOGIQUES SPÉCIFIQUES V1.17
// ============================================================================

export const MOCK_SURVEILLANCE_TESTS_V117: V117SurveillanceScenarioTest[] = [
  {
    id: 1,
    code: 'TEST_01_ANOMALIE_SANITAIRE',
    title: 'Test 1 — Détection d Anomalie Sanitaire vs Niveau Attendu',
    category: 'TEST_ANOMALIE_SANITAIRE',
    description: 'Vérifier qu une augmentation anormale des cas au-delà du seuil calculé (moyenne historique + 1.96 SD ou modèle GLM-NB) génère un signal d alerte avec justification mathématique explicite.',
    status: 'PASSED',
    steps: [
      'Injection d une hausse fictive de +55.8% d incidence paludisme en S34 à Kasuku.',
      'Comparaison automatique de la valeur observée (48.6) à l attendu modélisé (31.2).',
      'Vérification du franchissement du seuil d alerte (40.0).',
      'Contrôle de la mention explicite "Signal à vérifier par expertise humaine".'
    ],
    expectedOutcome: 'Génération réussie du signal SIG-2026-084 classé SIGNAL CRITIQUE, affichage transparent de la méthode GLM-NB V1.16 et de l écart (+55.8%).',
    actualOutcome: 'Signal généré avec succès, intervalle de confiance affiché, aucune confirmation automatique d épidémie.',
    lastRunDate: '2026-08-29 11:45'
  },
  {
    id: 2,
    code: 'TEST_02_SAISONNALITE',
    title: 'Test 2 — Prise en Compte de la Dynamique Saisonnière',
    category: 'TEST_SAISONNALITE',
    description: 'Vérifier qu une hausse saisonnière prévisible pendant la saison des pluies ne déclenche pas une fausse alerte majeure si elle reste dans l enveloppe historique attendue.',
    status: 'PASSED',
    steps: [
      'Simulation d une hausse attendue de +25% des cas en novembre (saison pluvieuse normale).',
      'Calcul du quantile P95 historique pour le mois de novembre.',
      'Vérification que l observation reste comprise dans l intervalle de confiance attendu.'
    ],
    expectedOutcome: 'Statut classé "NORMAL / ATTENDU SAISONNIER", absence d alerte intempestive, mention "Hausse conforme au cycle pluviométrique annuel".',
    actualOutcome: 'Validé : pas de déclenchement d alerte indue.',
    lastRunDate: '2026-08-29 11:46'
  },
  {
    id: 3,
    code: 'TEST_03_DONNEES_INCOMPLETES',
    title: 'Test 3 — Dégradation de la Confiance sur Données Incomplètes',
    category: 'TEST_DONNEES_INCOMPLETES',
    description: 'Vérifier que si une hausse brutale survient avec un taux de complétude faible (<75%), le système abaisse le score de confiance et affiche un avertissement sans gonfler l alerte.',
    status: 'PASSED',
    steps: [
      'Injection d une hausse apparente avec complétude dégradée à 62% (Alunguli).',
      'Calcul du score de confiance composite.',
      'Vérification de l affichage de l avertissement "Signal potentiellement affecté par une insuffisance de données".'
    ],
    expectedOutcome: 'Score de confiance abaissé à "FAIBLE / LIMITÉE", alerte maintenue en VIGILANCE sans surclassement automatique.',
    actualOutcome: 'Validé : avertissement clairement visible, niveau d alerte bridé à VIGILANCE.',
    lastRunDate: '2026-08-29 11:47'
  },
  {
    id: 4,
    code: 'TEST_04_EXTENSION_SPATIALE',
    title: 'Test 4 — Détection de l Extension Spatiale & Agrégation en Cluster',
    category: 'TEST_EXTENSION_SPATIALE',
    description: 'Vérifier que la détection simultanée de signaux dans plusieurs aires adjacentes (Kasuku, Lwama, Basoko) active l indicateur d extension spatiale.',
    status: 'PASSED',
    steps: [
      'Création simultanée de signaux dans 3 aires contiguës.',
      'Vérification de la matrice spatiale d adjacence.',
      'Affichage de la mention "Extension spatiale du signal / Cluster actif".'
    ],
    expectedOutcome: 'Flag isSpatialSpread activé, couches cartographiques synchronisées.',
    actualOutcome: 'Validé : cluster spatial identifié et surligné sur la carte.',
    lastRunDate: '2026-08-29 11:48'
  },
  {
    id: 5,
    code: 'TEST_05_DONNEES_FUTURES',
    title: 'Test 5 — Étanchéité Temporelle & Anti-Données Futures',
    category: 'TEST_DONNEES_FUTURES',
    description: 'Vérifier qu aucune donnée d observation postérieure à la date d évaluation (T) n est accessible ou utilisée pour calculer le signal au temps T.',
    status: 'PASSED',
    steps: [
      'Tentative d évaluation de la période S28 avec accès aux données de S30.',
      'Vérification du filtrage temporel strict (t <= t_eval).',
      'Audit du journal de calcul.'
    ],
    expectedOutcome: 'Étanchéité temporelle 100% garantie, zéro fuite d information vers le passé.',
    actualOutcome: 'Validé : isolation temporelle rigoureusement respectée.',
    lastRunDate: '2026-08-29 11:49'
  },
  {
    id: 6,
    code: 'TEST_06_PROXY_ENVIRONNEMENTAL',
    title: 'Test 6 — Traçabilité des Proxies Environnementaux',
    category: 'TEST_PROXY_ENVIRONNEMENTAL',
    description: 'Vérifier que tout signal alimenté par une covariable proxy (ex: turbidité capteur distant ou décharge historique) porte l étiquette d avertissement obligatoire.',
    status: 'PASSED',
    steps: [
      'Génération d un signal typhoïde utilisant une mesure proxy de turbidité.',
      'Vérification du badge "Donnée Proxy".',
      'Contrôle de la note explicative associée.'
    ],
    expectedOutcome: 'Mention "Signal basé partiellement sur une donnée proxy" affichée en tête de fiche de signal.',
    actualOutcome: 'Validé : traçabilité proxy totale, aucune dissimulation.',
    lastRunDate: '2026-08-29 11:50'
  },
  {
    id: 7,
    code: 'TEST_07_RETARD_TRANSMISSION',
    title: 'Test 7 — Impact du Retard de Transmission (J+N)',
    category: 'TEST_RETARD_TRANSMISSION',
    description: 'Vérifier que le délai moyen de transmission des structures périphériques (J+5 à J+8) est quantifié et affiché dans les métadonnées de qualité.',
    status: 'PASSED',
    steps: [
      'Simulation de 4 structures avec rapport transmis à J+8.',
      'Calcul du délai moyen de consolidation (3.8 jours).',
      'Vérification du tableau des structures en retard.'
    ],
    expectedOutcome: 'Indicateur de délai moyen affiché sur le tableau de bord avec liste nominative des structures.',
    actualOutcome: 'Validé : délai moyen J+3.8j calculé avec précision.',
    lastRunDate: '2026-08-29 11:51'
  },
  {
    id: 8,
    code: 'TEST_08_CHANGEMENT_DEFINITION',
    title: 'Test 8 — Détection de Rupture de Série / Changement de Définition',
    category: 'TEST_CHANGEMENT_DEFINITION',
    description: 'Vérifier qu un changement de définition de cas ou de kit diagnostique est signalé comme "Rupture potentielle de série" et non comme une flambée épidémique réelle.',
    status: 'PASSED',
    steps: [
      'Introduction d un nouveau protocole de test TDR en S32.',
      'Vérification de l alerte méthodologique "Rupture potentielle de série".',
      'Blocage de l escalade automatique en alerte majeure.'
    ],
    expectedOutcome: 'Avertissement méthodologique affiché, signal maintenu au niveau VIGILANCE avec mention explicative.',
    actualOutcome: 'Validé : fausse flambée évitée, rupture documentée.',
    lastRunDate: '2026-08-29 11:52'
  },
  {
    id: 9,
    code: 'TEST_09_MULTI_PATHOLOGIES_ONE_HEALTH',
    title: 'Test 9 — Séparation Stricte des Signaux Multi-Pathologies',
    category: 'TEST_MULTI_PATHOLOGIES_ONE_HEALTH',
    description: 'Vérifier que les flux de données et signaux pour le Paludisme et la Fièvre Typhoïde restent distincts et étanches tout en permettant une visualisation One Health intégrée.',
    status: 'PASSED',
    steps: [
      'Génération simultanée d un signal Paludisme et d un signal Typhoïde dans la même zone.',
      'Vérification de l étanchéité des datasets et des fiches d alerte.',
      'Affichage de la vue de comparaison One Health conjointe.'
    ],
    expectedOutcome: 'Deux fiches de signaux indépendantes générées, sans mélange des indicateurs cliniques.',
    actualOutcome: 'Validé : séparation parfaite des données pathologiques.',
    lastRunDate: '2026-08-29 11:53'
  },
  {
    id: 10,
    code: 'TEST_10_INTERACTION_ONE_HEALTH_LAGS',
    title: 'Test 10 — Intégration One Health Climat-Environnement & Lags Validés',
    category: 'TEST_INTERACTION_ONE_HEALTH_LAGS',
    description: 'Vérifier que la convergence d anomalies climatiques (pluie +42mm), environnementales (82 gîtes larvaires) et d une hausse du paludisme avec Lag 1 mois est documentée sans affirmation causale péremptoire.',
    status: 'PASSED',
    steps: [
      'Superposition des séries temporelles Pluie (Lag -1 mois), Gîtes larvaires et Incidence Palustre.',
      'Vérification de la mention explicite "Association retardée identifiée dans le modèle validé V1.16".',
      'Contrôle de l avertissement d absence de causalité automatique.'
    ],
    expectedOutcome: 'Vue One Health tri-dimensionnelle claire, mention de prudence scientifique affichée.',
    actualOutcome: 'Validé : formulation prudente respectant les standards de l épidémiologie moderne.',
    lastRunDate: '2026-08-29 11:54'
  }
];

// ============================================================================
// 7. RAPPORT SCIENTIFIQUE DE SURVEILLANCE ONE HEALTH (17 SECTIONS)
// ============================================================================

export const MOCK_SURVEILLANCE_REPORT_17_SECTIONS: SurveillanceReport17Sections = {
  metadata: {
    reportId: 'RAP-SURV-2026-08',
    generatedAt: '2026-08-29 12:00:00 (Fuseau RDC / Kindu)',
    periodCovered: 'Août 2026 (Semaines Épidémiologiques 31 à 34)',
    territory: 'Ville de Kindu & Territoires Pilotes (Kasuku, Mikelenge, Alunguli), Province du Maniema, RDC',
    authorName: 'Cellule Scientifique One Health Maniema (Dr. J.P. Kasongo, Prof. D. Amisi)',
    authorRole: 'Superviseurs Épidémiologiques & Chercheurs'
  },
  sections: [
    {
      sectionNumber: 1,
      title: 'Période & Contexte Géographique Surveillé',
      summary: 'Surveillance spatio-temporelle continue sur les 3 zones de santé urbaines et périurbaines de Kindu au cours du mois d août 2026.',
      keyPoints: [
        'Zones couvertes : Kasuku (145 000 hab), Mikelenge (112 000 hab), Alunguli (88 000 hab).',
        'Période d observation active : S31 à S34 (août 2026).'
      ]
    },
    {
      sectionNumber: 2,
      title: 'Territoire & Population Couverte',
      summary: 'Bassin de population total de 345 000 habitants desservis par 36 structures de santé enregistrées.',
      keyPoints: [
        '36 formations sanitaires intégrées au réseau de surveillance continue.',
        '4 structures périphériques signalées avec un léger retard de transmission.'
      ]
    },
    {
      sectionNumber: 3,
      title: 'Pathologies sous Surveillance Épidémiologique',
      summary: 'Suivi dual indépendant : Paludisme (vecteur anophélien) et Fièvre Typhoïde (transmission hydrique/féco-orale).',
      keyPoints: [
        'Paludisme : Cas simples, graves et taux de positivité TDR.',
        'Fièvre Typhoïde : Cas fébriles suspects et confirmations sérologiques/bactériologiques.'
      ]
    },
    {
      sectionNumber: 4,
      title: 'Données Disponibles & Complétude du Réseau',
      summary: 'Niveau global de complétude des rapports hebdomadaires évalué à 91.4%.',
      keyPoints: [
        'Kasuku : 95.0% de complétude.',
        'Mikelenge : 88.5% de complétude.',
        'Alunguli : 72.0% (complétude dégradée sur les aires fluviales).'
      ],
      metrics: [
        { label: 'Complétude Globale', value: '91.4%', badge: 'bg-emerald-100 text-emerald-800' },
        { label: 'Délai Moyen Transmission', value: '3.8 jours', badge: 'bg-slate-100 text-slate-800' }
      ]
    },
    {
      sectionNumber: 5,
      title: 'Contrôle Qualité & Délais de Transmission',
      summary: 'Évaluation systématique des biais de déclaration, des retards de notification et des valeurs aberrantes.',
      keyPoints: [
        'Délai médian de consolidation : J+3.8 jours après la clôture de la semaine épidémiologique.',
        'Aucune valeur aberrante extrême non investiguée sur les séries principales.'
      ]
    },
    {
      sectionNumber: 6,
      title: 'Tendances Observées & Évolutions Récentes',
      summary: 'Progression de l incidence palustre observée en S31-S33 suivie d un début de plateau en S34.',
      keyPoints: [
        'Incidence moyenne provinciale paludisme : 38.2 cas / 1000 hab.',
        'Incidence moyenne typhoïde : 4.8 cas / 1000 hab.'
      ]
    },
    {
      sectionNumber: 7,
      title: 'Détection des Anomalies vs Niveau Attendu',
      summary: 'Comparaison des valeurs observées aux niveaux de base attendus (modèle GLM-NB V1.16 et médianes historiques).',
      keyPoints: [
        'Anomalie statistiquement significative identifiée à Basoko (+55.8% vs attendu).',
        'Anomalie hydrique identifiée à Mikelenge-Centre (+118.2% vs attendu).'
      ]
    },
    {
      sectionNumber: 8,
      title: 'Signaux Sanitaires Générés & Niveaux de Vigilance',
      summary: '4 signaux algorithmiques enregistrés au cours de la période : 1 critique, 1 important, 2 vigilances.',
      keyPoints: [
        'SIG-2026-084 (Kasuku / Basoko) : Signal critique (Paludisme).',
        'SIG-2026-085 (Mikelenge-Centre) : Signal important (Typhoïde).'
      ]
    },
    {
      sectionNumber: 9,
      title: 'Surveillance & Facteurs Climatiques (Kindu Aéro / ECMWF)',
      summary: 'Excès pluviométrique cumulé en juillet (+42mm vs normale) ayant favorisé la mise en eau des gîtes larvaires.',
      keyPoints: [
        'Précipitations mensuelles cumulées : 142 mm (normale saisonnière : 100 mm).',
        'Température moyenne : 28.4°C (+1.2°C vs historique).'
      ]
    },
    {
      sectionNumber: 10,
      title: 'Surveillance Environnementale (Gîtes Larvaires & Déchets)',
      summary: 'Cartographie de 82 gîtes larvaires anophéliens actifs et 36 sites de décharges sauvages non assainies.',
      keyPoints: [
        'Forte concentration de gîtes le long des bas-fonds de la rivière Kasuku.',
        'Impact direct sur la prolifération vectorielle.'
      ]
    },
    {
      sectionNumber: 11,
      title: 'Surveillance Eau, Assainissement & Hygiène (WASH)',
      summary: 'Déficit d accès à l eau potable sécurisée dans 44% des ménages enquêtés de Mikelenge.',
      keyPoints: [
        'Turbidité moyenne des eaux de puits : 9.8 NTU (normale OMS < 5 NTU).',
        'Facteur de vulnérabilité majeur pour la transmission typhoïdique.'
      ]
    },
    {
      sectionNumber: 12,
      title: 'Cartographie Spatiale des Signaux One Health',
      summary: 'Superposition des couches de signaux, des densités environnementales et de l hydrographie.',
      keyPoints: [
        'Localisation précise du cluster de Kasuku-Basoko.',
        'Contrôle indépendant des couches de données disponible dans l interface.'
      ]
    },
    {
      sectionNumber: 13,
      title: 'Comparaison avec les Risques Prédits par les Modèles V1.16',
      summary: 'Distinction stricte entre le risque théorique prédit à long terme et l anomalie de surveillance à court terme.',
      keyPoints: [
        'Risque prédit élevé (88%) corrélé avec le signal critique réel à Basoko.',
        'Zone Alunguli-Nord : Risque prédit modéré mais aucune anomalie de surveillance active.'
      ]
    },
    {
      sectionNumber: 14,
      title: 'Analyse d Incertitude & Intervalles de Prédiction',
      summary: 'Prise en compte des intervalles de prédiction IP 95% pour éviter les faux positifs algorithmiques.',
      keyPoints: [
        'Largeur de l IP 95% pour Basoko : [24.5 - 38.0 cas/1000].',
        'La valeur observée (48.6) dépasse strictement la borne supérieure de l IP.'
      ]
    },
    {
      sectionNumber: 15,
      title: 'Alertes Potentielles & Règles Multi-Critères',
      summary: 'Synthèse des alertes formulées par combinaison d indicateurs cliniques, temporels, spatiaux et environnementaux.',
      keyPoints: [
        'ALT-2026-012 : Alerte de Niveau 2 active sur Kasuku.',
        'ALT-2026-013 : Vigilance Niveau 1 sur Mikelenge.'
      ]
    },
    {
      sectionNumber: 16,
      title: 'Vérifications Humaines & Décisions de Supervision',
      summary: 'Traçabilité complète des validations par les médecins superviseurs et épidémiologistes de terrain.',
      keyPoints: [
        'Alerte ALT-2026-012 mise en observation par le Dr. J.P. Kasongo avec demande d intrants complémentaires.',
        'Toutes les actions sont consignées dans le journal d audit immuable.'
      ]
    },
    {
      sectionNumber: 17,
      title: 'Limites Méthodologiques, Proxies & Précautions d Interprétation',
      summary: 'Rappel fondamental du rôle d aide à la décision du système, qui ne constitue en aucun cas une déclaration épidémique officielle.',
      keyPoints: [
        'Les données de turbidité fluviale reposent partiellement sur des proxies environnementaux.',
        'Tout signal informatique doit impérativement faire l objet d une validation clinique et biologique de terrain.'
      ]
    }
  ],
  cautiousConclusionNotice: 'AVERTISSEMENT MÉTHODOLOGIQUE : Ce rapport est un instrument de veille scientifique et d aide à la décision. Il ne se substitue pas aux canaux officiels de notification de la Division Provinciale de la Santé (DPS Maniema) ni au système national de surveillance épidémiologique de la RDC.'
};
