import {
  ScientificModelingProject,
  V115ValidationScenarioTest,
  ModelCovariateSelection
} from '../types';
import { MOCK_INITIAL_ANALYSES_V114 } from './mockScientificAnalysisDataV114';

export const MOCK_MODELING_COVARIATES_V115: ModelCovariateSelection[] = [
  {
    code: 'precipitations_mensuelles_mm',
    name: 'Précipitations mensuelles cumulées (mm)',
    dimension: 'CLIMAT',
    type: 'NUMERICAL',
    unit: 'mm',
    source: 'METTELSAT Station Synoptique Kindu / CHIRPS',
    temporalCoveragePct: 100,
    qualityLevel: 'A',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: true,
    lagMonths: 1,
    vifValue: 1.42,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'temperature_moyenne_c',
    name: 'Température moyenne mensuelle (°C)',
    dimension: 'CLIMAT',
    type: 'NUMERICAL',
    unit: '°C',
    source: 'METTELSAT Kindu / ERA5 Reanalysis',
    temporalCoveragePct: 100,
    qualityLevel: 'A',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    vifValue: 1.38,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'humidite_relative_pct',
    name: 'Humidité relative moyenne (%)',
    dimension: 'CLIMAT',
    type: 'NUMERICAL',
    unit: '%',
    source: 'METTELSAT Kindu',
    temporalCoveragePct: 97.5,
    qualityLevel: 'A',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    vifValue: 2.15,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'presence_decharge_sauvage',
    name: 'Présence décharge non contrôlée (Kasuku)',
    dimension: 'ENVIRONNEMENT',
    type: 'CATEGORICAL_BINARY',
    unit: '0/1',
    source: 'Inspections sanitaires municipales (2022-2026)',
    temporalCoveragePct: 92.0,
    qualityLevel: 'B',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    referenceCategory: 'Absence (0)',
    vifValue: 1.18,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'inondation_quartier',
    name: 'Épisode d inondation ou submersion',
    dimension: 'ENVIRONNEMENT',
    type: 'CATEGORICAL_BINARY',
    unit: '0/1',
    source: 'Protection Civile & DPS',
    temporalCoveragePct: 88.5,
    qualityLevel: 'B',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    referenceCategory: 'Non inondé (0)',
    vifValue: 1.65,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'couverture_latrines_hygieniques_pct',
    name: 'Taux de latrines hygiéniques conformes (%)',
    dimension: 'WASH',
    type: 'NUMERICAL',
    unit: '%',
    source: 'Enquêtes ménages V1.11 / DPS',
    temporalCoveragePct: 91.0,
    qualityLevel: 'A',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    vifValue: 1.82,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  },
  {
    code: 'acces_eau_potable_pct',
    name: 'Accès à l eau potable sécurisée (%)',
    dimension: 'WASH',
    type: 'NUMERICAL',
    unit: '%',
    source: 'Enquêtes ménages V1.11 / REGIDESO',
    temporalCoveragePct: 90.5,
    qualityLevel: 'A',
    status: 'OBSERVEE',
    isProxy: false,
    isLagged: false,
    lagMonths: 0,
    vifValue: 1.76,
    vifInterpretation: 'COLINEARITE_FAIBLE'
  }
];

export const MOCK_INITIAL_MODELS_V115: ScientificModelingProject[] = [
  {
    id: 'MODEL-001',
    code: 'MODEL_PALUDISME_KINDU_2026_001',
    title: 'Modèle Spatio-Temporel Paludisme & Déterminants One Health (Kindu 2020–2026)',
    researchHypothesis:
      'L incidence mensuelle du paludisme est amplifiée par les précipitations à décalage de 1 mois et modulée par la présence de dépôts sauvages non assainis.',
    sourceDatasetId: 'ANALYSIS-001',
    sourceDatasetCode: 'ANALYSIS_DATASET_2026_001',
    sourceDatasetName: 'Paludisme à Kindu — Dynamique Temporelle & Climat (2020–2026)',
    pathology: 'PALUDISME',
    targetPathologiesList: ['PALUDISME'],
    timeRange: {
      startYear: 2020,
      endYear: 2026,
      temporalResolution: 'MOIS'
    },
    geographicScope: {
      level: 'VILLE_KINDU',
      selectedZones: ['ZS-KINDU', 'ZS-ALUNGULI'],
      selectedZoneNames: ['Kindu', 'Alunguli']
    },
    dependentVariable: 'COUNT_CASES',
    dependentVariableName: 'Nouveaux cas confirmés de paludisme (TDR/GE)',
    dependentVariableColumn: 'cas_paludisme_confirmes',
    modelType: 'NEGATIVE_BINOMIAL',
    offsetOption: 'POPULATION',
    offsetColumnName: 'population_at_risk',
    selectedCovariates: MOCK_MODELING_COVARIATES_V115.slice(0, 4),
    interactionTerms: [
      {
        id: 'INT-01',
        var1Code: 'precipitations_mensuelles_mm',
        var1Name: 'Précipitations (Lag 1)',
        var2Code: 'presence_decharge_sauvage',
        var2Name: 'Décharge Kasuku',
        label: 'Pluie(Lag1) × Décharge'
      }
    ],
    spatioTemporalConfig: {
      spatialUnit: 'Zone de Santé × Mois',
      spatialEffect: 'ZONE_FIXED',
      temporalEffect: 'SEASONAL_HARMONIC',
      includeSeasonalHarmonic: true,
      includeLinearTrend: true
    },
    evaluationMethod: 'TRAIN_TEST_SPLIT',
    preFlightCheck: {
      isBlocked: false,
      statusSignal: 'VERT',
      statusLabel: 'MODELISATION_AUTORISEE',
      sampleSizeTotal: 168,
      sampleSizeValid: 168,
      excludedCount: 0,
      missingDataPct: 0.0,
      temporalSpanYears: 7,
      spatialZonesCount: 2,
      blockingReasons: [],
      warnings: [
        'Surdispersion significative détectée dans le modèle Poisson initial (Ratio = 2.45). Passage recommandé au modèle Binomial Négatif.'
      ],
      zeroVarianceVariables: [],
      highMissingVariables: [],
      proxyCount: 0,
      checkedAt: '2026-08-28 14:10'
    },
    coefficients: [
      {
        variableCode: '(Intercept)',
        variableName: 'Constante (β₀)',
        coefficient: -7.142,
        standardError: 0.092,
        zValue: -77.63,
        pValue: 0.0001,
        ciLower95: -7.322,
        ciUpper95: -6.962,
        expCoeff: 0.0008,
        isSignificant: true,
        interpretationText: 'Taux d incidence de base estimé à 78.8 pour 100 000 personnes-mois.'
      },
      {
        variableCode: 'precipitations_mensuelles_mm_lag1',
        variableName: 'Précipitations mensuelles (Lag 1 mois)',
        coefficient: 0.0038,
        standardError: 0.0006,
        zValue: 6.33,
        pValue: 0.0001,
        ciLower95: 0.0026,
        ciUpper95: 0.0050,
        expCoeff: 1.0038,
        expCiLower95: 1.0026,
        expCiUpper95: 1.0050,
        isSignificant: true,
        interpretationText: 'Chaque hausse de 50 mm de pluie à M-1 augmente le taux d incidence de 20.9% (RR = 1.209).'
      },
      {
        variableCode: 'temperature_moyenne_c',
        variableName: 'Température moyenne (°C)',
        coefficient: 0.0620,
        standardError: 0.0185,
        zValue: 3.35,
        pValue: 0.0008,
        ciLower95: 0.0257,
        ciUpper95: 0.0983,
        expCoeff: 1.0640,
        expCiLower95: 1.0260,
        expCiUpper95: 1.1033,
        isSignificant: true,
        interpretationText: 'Une hausse de 1°C est associée à une hausse relative de 6.4% de l incidence.'
      },
      {
        variableCode: 'presence_decharge_sauvage',
        variableName: 'Décharge Kasuku active (1 vs 0)',
        coefficient: 0.3120,
        standardError: 0.0840,
        zValue: 3.71,
        pValue: 0.0002,
        ciLower95: 0.1474,
        ciUpper95: 0.4766,
        expCoeff: 1.3662,
        expCiLower95: 1.1588,
        expCiUpper95: 1.6106,
        isSignificant: true,
        interpretationText: 'Sur-risque de 36.6% dans les aires de santé adjacentes aux dépôts non traités.'
      },
      {
        variableCode: 'zone_alunguli_fixed',
        variableName: 'Effet fixe de Zone : Alunguli (vs Kindu)',
        coefficient: 0.1850,
        standardError: 0.0540,
        zValue: 3.43,
        pValue: 0.0006,
        ciLower95: 0.0792,
        ciUpper95: 0.2908,
        expCoeff: 1.2032,
        expCiLower95: 1.0824,
        expCiUpper95: 1.3375,
        isSignificant: true,
        interpretationText: 'Taux d incidence 20.3% plus élevé en Zone d Alunguli (rive droite).'
      },
      {
        variableCode: 'sin_seasonal_harmonic',
        variableName: 'Harmonique Saisonnier sin(2π t / 12)',
        coefficient: 0.2450,
        standardError: 0.0410,
        zValue: 5.98,
        pValue: 0.0001,
        ciLower95: 0.1646,
        ciUpper95: 0.3254,
        expCoeff: 1.2776,
        expCiLower95: 1.1789,
        expCiUpper95: 1.3846,
        isSignificant: true,
        interpretationText: 'Cyclicité bimodal annuelle capturée indépendamment des anomalies locales.'
      }
    ],
    diagnostics: {
      convergenceReached: true,
      iterationsCount: 7,
      totalObsInitial: 168,
      totalObsUsed: 168,
      totalObsExcluded: 0,
      exclusionBreakdown: [],
      aic: 1412.4,
      bic: 1438.2,
      logLikelihood: -699.2,
      deviance: 174.6,
      dfResiduals: 162,
      dispersionRatio: 1.08,
      hasOverdispersion: false,
      moranSpatialIndexI: 0.12,
      moranPValue: 0.184,
      moranInterpretation: 'Absence d autocorrélation spatiale résiduelle significative après inclusion des effets de zone.',
      temporalAutocorrelationAr1: 0.14,
      temporalAr1PValue: 0.122,
      influentialObservations: [
        {
          recordId: 'REC-2023-11-KINDU',
          zoneName: 'Kindu',
          dateStr: '2023-11',
          cooksDistance: 0.21,
          leverageHii: 0.09,
          standardizedResidual: 2.85,
          isInfluential: false,
          scientificNote: 'Pic de crue historique du fleuve Congo en novembre 2023.'
        }
      ],
      residualsDistribution: {
        min: -2.14,
        q1: -0.58,
        median: 0.02,
        mean: 0.01,
        q3: 0.64,
        max: 2.85,
        stdDev: 0.98
      }
    },
    predictions: [
      {
        zoneId: 'ZS-KINDU',
        zoneName: 'Kindu (Centre-Ville)',
        period: '2026-03',
        year: 2026,
        month: 3,
        observedCases: 412,
        predictedCases: 398,
        predictedIncidencePer100k: 185.1,
        ciLowerIncidence: 162.4,
        ciUpperIncidence: 207.8,
        relativeRiskRR: 1.04,
        riskLevelClass: 'MODERE',
        uncertaintyMargin: 45.4,
        uncertaintyLevel: 'FAIBLE',
        isHistoricProxy: false,
        dataSourceStatus: 'OBSERVEE',
        environmentalFactorsSummary: 'Salubrité moyenne, décharge réhabilitée'
      },
      {
        zoneId: 'ZS-ALUNGULI',
        zoneName: 'Alunguli (Rive Droite)',
        period: '2026-03',
        year: 2026,
        month: 3,
        observedCases: 520,
        predictedCases: 495,
        predictedIncidencePer100k: 253.8,
        ciLowerIncidence: 218.2,
        ciUpperIncidence: 289.4,
        relativeRiskRR: 1.42,
        riskLevelClass: 'ELEVE',
        uncertaintyMargin: 71.2,
        uncertaintyLevel: 'MODEREE',
        isHistoricProxy: false,
        dataSourceStatus: 'OBSERVEE',
        environmentalFactorsSummary: 'Zones marécageuses péri-urbaines actives'
      }
    ],
    mathematicalFormula:
      'log(E[Cas]) = log(Pop) - 7.142 + 0.0038·Pluie_Lag1 + 0.0620·Temp + 0.3120·Decharge + 0.1850·Alunguli + 0.2450·HarmoniqueSaisonnier',
    scientificCaveat:
      'Association statistique ≠ Causalité. Les résultats quantifient la corrélation spatio-temporelle ajustée et ne sauraient remplacer des investigations entomologiques directes.',
    scientistAdequationNotes:
      'Spécification Binomiale Négative scientifiquement préférée au Poisson simple en raison de la variance empirique de 2.45 fois supérieure à l espérance. L inclusion du Lag 1 mois est biologiquement cohérente avec la sporogonie de Plasmodium falciparum et l émersion des anophèles.',
    isDemonstrationData: true,
    rCodeEquivalent: `# Modèle R équivalent
library(MASS)
fit <- glm.nb(cas_paludisme ~ offset(log(pop)) + pluie_lag1 + temperature + decharge + zone + sin_harm, data = dataset_2026)`,
    pythonCodeEquivalent: `# Modèle Python Statsmodels
import statsmodels.formula.api as smf
fit = smf.negativebinomial("cas_paludisme ~ pluie_lag1 + temp + decharge + zone + sin_harm", offset=np.log(df['pop']), data=df).fit()`,
    status: 'ESTIME',
    createdAt: '2026-08-28 14:15',
    updatedAt: '2026-08-28 14:30',
    author: 'Dr. Épidémiologiste One Health Maniema'
  },
  {
    id: 'MODEL-002',
    code: 'MODEL_TYPHOIDE_WASH_2026_002',
    title: 'Modèle Spatio-Temporel Fièvre Typhoïde & Inondations/WASH (2022–2026)',
    researchHypothesis:
      'Les flambées de fièvre typhoïde à Kindu sont fortement associées aux épisodes de crue et au défaut d assainissement hygiénique.',
    sourceDatasetId: 'ANALYSIS-002',
    sourceDatasetCode: 'ANALYSIS_DATASET_2026_002',
    sourceDatasetName: 'Fièvre Typhoïde & Eau/Assainissement à Kindu (2022–2026)',
    pathology: 'FIEVRE_TYPHOIDE',
    targetPathologiesList: ['FIEVRE_TYPHOIDE'],
    timeRange: {
      startYear: 2022,
      endYear: 2026,
      temporalResolution: 'MOIS'
    },
    geographicScope: {
      level: 'VILLE_KINDU',
      selectedZones: ['ZS-KINDU'],
      selectedZoneNames: ['Kindu']
    },
    dependentVariable: 'INCIDENCE_RATE',
    dependentVariableName: 'Incidence pour 10 000 habitants',
    dependentVariableColumn: 'incidence_typhoide_10k',
    modelType: 'SPATIO_TEMPORAL_FIXED',
    offsetOption: 'NONE',
    selectedCovariates: MOCK_MODELING_COVARIATES_V115.filter(c => ['inondation_quartier', 'couverture_latrines_hygieniques_pct', 'acces_eau_potable_pct'].includes(c.code)),
    interactionTerms: [],
    spatioTemporalConfig: {
      spatialUnit: 'Aire de Santé × Mois',
      spatialEffect: 'ZONE_FIXED',
      temporalEffect: 'MONTH_FIXED',
      includeSeasonalHarmonic: false,
      includeLinearTrend: true
    },
    evaluationMethod: 'INTERNAL_RESIDUALS',
    preFlightCheck: {
      isBlocked: false,
      statusSignal: 'VERT',
      statusLabel: 'MODELISATION_AUTORISEE',
      sampleSizeTotal: 60,
      sampleSizeValid: 60,
      excludedCount: 0,
      missingDataPct: 0.0,
      temporalSpanYears: 5,
      spatialZonesCount: 1,
      blockingReasons: [],
      warnings: [],
      zeroVarianceVariables: [],
      highMissingVariables: [],
      proxyCount: 0,
      checkedAt: '2026-08-28 15:00'
    },
    coefficients: [
      {
        variableCode: '(Intercept)',
        variableName: 'Constante (β₀)',
        coefficient: 2.84,
        standardError: 0.35,
        zValue: 8.11,
        pValue: 0.0001,
        ciLower95: 2.15,
        ciUpper95: 3.53,
        expCoeff: 17.11,
        isSignificant: true,
        interpretationText: 'Incidence de référence estimée en conditions optimales.'
      },
      {
        variableCode: 'inondation_quartier',
        variableName: 'Épisode d inondation locale (1 vs 0)',
        coefficient: 0.524,
        standardError: 0.118,
        zValue: 4.44,
        pValue: 0.0001,
        ciLower95: 0.293,
        ciUpper95: 0.755,
        expCoeff: 1.688,
        expCiLower95: 1.340,
        expCiUpper95: 2.127,
        isSignificant: true,
        interpretationText: 'Sur-risque de 68.8% d incidence typhoïdique en période d inondation.'
      },
      {
        variableCode: 'couverture_latrines_hygieniques_pct',
        variableName: 'Couverture en latrines conformes (%)',
        coefficient: -0.0182,
        standardError: 0.0041,
        zValue: -4.44,
        pValue: 0.0001,
        ciLower95: -0.0262,
        ciUpper95: -0.0102,
        expCoeff: 0.9820,
        expCiLower95: 0.9741,
        expCiUpper95: 0.9898,
        isSignificant: true,
        interpretationText: 'Chaque tranche de 10% d amélioration des latrines réduit l incidence de 16.7%.'
      }
    ],
    diagnostics: {
      convergenceReached: true,
      iterationsCount: 5,
      totalObsInitial: 60,
      totalObsUsed: 60,
      totalObsExcluded: 0,
      exclusionBreakdown: [],
      aic: 388.2,
      bic: 402.1,
      logLikelihood: -190.1,
      deviance: 62.4,
      dfResiduals: 56,
      dispersionRatio: 1.11,
      hasOverdispersion: false,
      moranSpatialIndexI: 0.08,
      moranPValue: 0.32,
      temporalAutocorrelationAr1: 0.18,
      temporalAr1PValue: 0.09,
      influentialObservations: [],
      residualsDistribution: {
        min: -1.82,
        q1: -0.45,
        median: 0.01,
        mean: 0.00,
        q3: 0.52,
        max: 2.15,
        stdDev: 0.94
      }
    },
    predictions: [],
    mathematicalFormula:
      'log(Incidence_10k) = 2.840 + 0.524·Inondation - 0.0182·Latrines_Pct',
    scientificCaveat:
      'Association statistique ≠ Causalité. Les variations de diagnostic microbiologique hospitalier peuvent induire des fluctuations résiduelles.',
    scientistAdequationNotes:
      'Modèle cohérent avec le mode de transmission féco-oral oro-fécal et les contaminations de nappes phréatiques lors des crues fluviales de Kindu.',
    isDemonstrationData: true,
    rCodeEquivalent: `# R Code
fit_typ <- glm(incidence_typhoide ~ inondation + latrines_pct, data = df_typ)`,
    pythonCodeEquivalent: `# Python Code
fit_typ = smf.glm("incidence_typhoide ~ inondation + latrines_pct", data=df_typ).fit()`,
    status: 'ESTIME',
    createdAt: '2026-08-28 15:10',
    updatedAt: '2026-08-28 15:20',
    author: 'Microbiologiste & Épidémiologiste One Health'
  }
];

export const MOCK_VALIDATION_SCENARIOS_V115: V115ValidationScenarioTest[] = [
  {
    id: 1,
    code: 'TEST_POISSON',
    title: 'Test 1 — Modèle de Poisson, Coefficients & Test de Surdispersion',
    category: 'TEST_POISSON',
    description: 'Ajuster une régression de Poisson sur les données de comptage. Vérifier le ratio de surdispersion Pearson Chi2/df et l affichage du message d avertissement si dispersion > 1.25.',
    status: 'PASSED',
    testSteps: [
      'Sélection du dataset de comptage Paludisme Kindu (168 observations)',
      'Ajustement GLM Poisson avec lien log et offset de population',
      'Calcul du ratio de déviance/degrés de liberté (Ratio = 2.45)',
      'Déclenchement automatique de l avertissement "Attention : surdispersion potentielle"',
      'Suggestion explicite de la régression binomiale négative'
    ],
    expectedOutput: 'Ratio de surdispersion calculé, avertissement affiché, proposition non imposée du modèle alternatif.',
    actualOutput: 'Conforme. Surdispersion (2.45) détectée et documentée avec proposition alternative.',
    lastRunDate: '2026-08-28 16:00'
  },
  {
    id: 2,
    code: 'TEST_BINOMIAL_NEGATIF',
    title: 'Test 2 — Régression Binomiale Négative & Comparaison AIC',
    category: 'TEST_BINOMIAL_NEGATIF',
    description: 'Ajuster un modèle Binomial Négatif sur les données surdispersées. Comparer AIC/BIC et erreurs-types asymptotiques.',
    status: 'PASSED',
    testSteps: [
      'Estimation du paramètre de dispersion alpha',
      'Ajustement des erreurs-types des coefficients',
      'Comparaison du gain en AIC (1412.4 vs 1588.6 en Poisson standard)',
      'Confirmation de l adéquation scientifique'
    ],
    expectedOutput: 'AIC plus faible pour la Binomiale Négative, résidus standardisés recentrés.',
    actualOutput: 'Modèle estimé avec succès. Réduction de l AIC de 176.2 points.',
    lastRunDate: '2026-08-28 16:02'
  },
  {
    id: 3,
    code: 'TEST_LOGISTIQUE',
    title: 'Test 3 — Régression Logistique sur Variable Binaire (0/1)',
    category: 'TEST_LOGISTIQUE',
    description: 'Vérifier que la régression logistique est restreinte aux variables binaires (présence/absence d épidémie ou hospitalisation grave).',
    status: 'PASSED',
    testSteps: [
      'Vérification de la variable dépendante binaire (0/1)',
      'Blocage de la régression logistique sur simple nombre de cas bruts continus',
      'Calcul des Odds Ratios exponentiés et IC 95%'
    ],
    expectedOutput: 'Contrôle de compatibilité strict, affichage des OR et de la fonction logit.',
    actualOutput: 'Vérification validée. Lien logit conforme et interdiction de cible continue.',
    lastRunDate: '2026-08-28 16:05'
  },
  {
    id: 4,
    code: 'TEST_SPATIO_TEMPOREL',
    title: 'Test 4 — Modélisation Spatio-Temporelle (10 Zones × 24 Mois)',
    category: 'TEST_SPATIO_TEMPOREL',
    description: 'Créer une matrice spatio-temporelle de 10 zones sur 24 mois. Tester les effets fixes de zone et la composante temporelle saisonnière.',
    status: 'PASSED',
    testSteps: [
      'Génération de la matrice Zone × Mois (240 unités spatio-temporelles)',
      'Inclusion des effets de site et de l harmonique saisonnier sin(2πt/12)',
      'Calcul du Moran s I sur les résidus spatiaux',
      'Calcul de l autocorrélation temporelle AR(1)'
    ],
    expectedOutput: 'Modèle convergent, coefficients spatiaux identifiés, dépendance temporelle quantifiée.',
    actualOutput: '240 observations traitées en 8 itérations. Moran I = 0.12 (non significatif).',
    lastRunDate: '2026-08-28 16:10'
  },
  {
    id: 5,
    code: 'TEST_LAG',
    title: 'Test 5 — Intégration des Lags Temporels (Pluie Lag 1 vs Lag 2)',
    category: 'TEST_LAG',
    description: 'Tester l intégration explicite des variables décalées dans le modèle GLM.',
    status: 'PASSED',
    testSteps: [
      'Sélection de la variable pluie_lag1',
      'Vérification de la formule log(E[Y]) = ... + β·pluie_lag1',
      'Comparaison du coefficient β (0.0038 à Lag 1 vs 0.0018 à Lag 0)'
    ],
    expectedOutput: 'Gain de significativité à Lag 1 documenté sans confusion temporelle.',
    actualOutput: 'Lag 1 mois validé biologiquement et statistiquement (p < 0.0001).',
    lastRunDate: '2026-08-28 16:12'
  },
  {
    id: 6,
    code: 'TEST_HISTORIQUE_ENV',
    title: 'Test 6 — Historicité Environnementale Stricte (Kasuku 2022 vs 2026)',
    category: 'TEST_HISTORIQUE_ENV',
    description: 'Vérifier que l état environnemental d une zone est évalué à l année exacte (2022: décharge active, 2026: site assaini).',
    status: 'PASSED',
    testSteps: [
      'Audit des observations historiques Kasuku (2022: 1, 2026: 0)',
      'Contrôle qu aucune valeur de 2026 n est rétro-appliquée silencieusement en 2022',
      'Calcul des prédictions de risque distinctes pour 2022 et 2026'
    ],
    expectedOutput: 'Risque élevé en 2022, risque modéré en 2026 avec historique tracé.',
    actualOutput: 'Historicité scellée respectée. Aucun écrasement anachronique.',
    lastRunDate: '2026-08-28 16:15'
  },
  {
    id: 7,
    code: 'TEST_PROXY',
    title: 'Test 7 — Traçabilité des Proxies & Étiquetage Cartographique',
    category: 'TEST_PROXY',
    description: 'Utiliser une observation proxy et vérifier la présence de l avertissement et de l étiquette "PROXY HISTORIQUE".',
    status: 'PASSED',
    testSteps: [
      'Injection d une variable marquée comme proxy',
      'Vérification de l affichage de la justification et de l incertitude accrue',
      'Présence du badge "PROXY HISTORIQUE" sur les cartes et rapports'
    ],
    expectedOutput: 'Avertissement visible, traçabilité complète dans la fiche de reproduction.',
    actualOutput: 'Marquage proxy conforme et visible sur l ensemble des sorties analytiques.',
    lastRunDate: '2026-08-28 16:18'
  },
  {
    id: 8,
    code: 'TEST_DONNEES_MANQUANTES',
    title: 'Test 8 — Gestion des Manquants (NULL non convertis en Zéro)',
    category: 'TEST_DONNEES_MANQUANTES',
    description: 'Introduire des valeurs NULL et vérifier que le modèle les exclut légitimement sans les forcer à 0.',
    status: 'PASSED',
    testSteps: [
      'Injection de 12 valeurs NULL sur la variable dépendante',
      'Vérification du comptage total (168) vs utilisé (156) vs exclu (12)',
      'Vérification que la moyenne et la déviance ne sont pas faussées par des zéros artificiels'
    ],
    expectedOutput: '12 observations signalées exclues, diagnostic documentant le motif exact.',
    actualOutput: 'Règle absolue respectée : aucun NULL n a été écrasé ou imputé silencieusement.',
    lastRunDate: '2026-08-28 16:20'
  },
  {
    id: 9,
    code: 'TEST_MULTICOLINEARITE',
    title: 'Test 9 — Détection de Multicolinéarité & Facteur VIF',
    category: 'TEST_MULTICOLINEARITE',
    description: 'Tester deux covariables fortement corrélées (pluie et humidité) et vérifier le calcul du VIF.',
    status: 'PASSED',
    testSteps: [
      'Calcul de la matrice de corrélation de Pearson',
      'Calcul des VIF pour chaque covariable',
      'Affichage d une alerte en cas de VIF supérieur à 5'
    ],
    expectedOutput: 'Tableau des VIF affiché, alerte documentée sans suppression unilatérale.',
    actualOutput: 'Matrice calculée. VIF = 2.15 (acceptable). Information transparente affichée.',
    lastRunDate: '2026-08-28 16:22'
  },
  {
    id: 10,
    code: 'TEST_CARTOGRAPHIE',
    title: 'Test 10 — Cartographie du Risque Prédit & Incertitude Associée',
    category: 'TEST_CARTOGRAPHIE',
    description: 'Produire la carte des risques en 5 classes avec bornes d incertitude (IC 95%).',
    status: 'PASSED',
    testSteps: [
      'Génération des prédictions d incidence pour les zones du Maniema',
      'Classification en 5 strates (Très faible à Très élevé)',
      'Affichage des intervalles d incertitude [Borne inférieure ; Borne supérieure]',
      'Distinction des zones à incertitude élevée'
    ],
    expectedOutput: 'Carte interactive avec infobulles détaillant estimation, incertitude et statut des sources.',
    actualOutput: 'Cartographie générée conforme avec affichage explicite de l incertitude.',
    lastRunDate: '2026-08-28 16:25'
  },
  {
    id: 11,
    code: 'TEST_REPRODUCTIBILITE',
    title: 'Test 11 — Fiche de Reproduction Intégrale & Scripts R/Python',
    category: 'TEST_REPRODUCTIBILITE',
    description: 'Vérifier la conservation de tous les hyper-paramètres et la génération des scripts équivalents R/Python.',
    status: 'PASSED',
    testSteps: [
      'Génération de la fiche de reproduction',
      'Audit des métadonnées (dataset source, filtres, formule, exclusions)',
      'Export des scripts R (MASS::glm.nb) et Python (statsmodels)'
    ],
    expectedOutput: 'Scripts R et Python fonctionnels et reproductibles à 100%.',
    actualOutput: 'Fiche générée avec formule mathématique et scripts exportables.',
    lastRunDate: '2026-08-28 16:28'
  },
  {
    id: 12,
    code: 'TEST_NON_REGRESSION_V1_V14',
    title: 'Test 12 — Non-Régression Intégrale V1.0 à V1.14',
    category: 'TEST_NON_REGRESSION_V1_V14',
    description: 'Vérifier que toutes les fonctionnalités des versions V1.0 à V1.14 demeurent intactes et opérationnelles.',
    status: 'PASSED',
    testSteps: [
      'Vérification des modules de collecte et enquêtes ménages (V1.0 - V1.11)',
      'Vérification de l intégration multi-sources (V1.12)',
      'Vérification du diagnostic scientifique de disponibilité (V1.13)',
      'Vérification du laboratoire d analyse et datasets analytiques (V1.14)'
    ],
    expectedOutput: '100% des modules existants fonctionnels sans régression ni modification de schéma.',
    actualOutput: 'Non-régression confirmée sur l ensemble des 14 versions antérieures.',
    lastRunDate: '2026-08-28 16:30'
  }
];
