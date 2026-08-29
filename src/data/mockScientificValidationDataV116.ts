import {
  ScientificValidationProject,
  V116ValidationScenarioTest
} from '../types';

export const MOCK_INITIAL_VALIDATIONS_V116: ScientificValidationProject[] = [
  {
    id: 'VAL_PROJ_2026_001',
    code: 'VAL_2026_001',
    title: 'Validation Temporelle & Spatiale — Paludisme Urbain Kindu (Binomial Négatif V1.15)',
    modelId: 'MODEL_PROJ_2026_001',
    modelCode: 'MODEL_2026_001',
    modelTitle: 'Régression Binomiale Négative — Incubation & Précipitations Lag 1 (Paludisme Kindu)',
    datasetId: 'ANALYSIS_DATASET_001',
    datasetName: 'Dataset Analytique Paludisme Kindu (2020-2026)',
    pathology: 'PALUDISME',
    targetPathologiesList: ['PALUDISME'],
    territory: '3 Communes (Kasuku, Mikelenge, Alunguli) & ZS Kindu',
    periodRange: '2020–2026 (Entraînement: 2020–2024 | Test: 2025–2026)',
    primaryMethod: 'TIME_SPLIT',
    
    preValidationCheck: {
      status: 'POSSIBLE',
      canProceed: true,
      totalObservations: 252,
      totalHealthZones: 3,
      totalPeriods: 84,
      missingValuesPct: 0.0,
      outliersDetectedCount: 3,
      proxiesCount: 1,
      temporalCoveragePct: 100.0,
      spatialCoveragePct: 100.0,
      datasetStructureStatus: 'COHERENT',
      justifications: [
        'Échantillon temporel suffisant (84 mois consécutifs 2020-2026).',
        'Zéro imputation silencieuse appliquée sur la variable dépendante.',
        'Proxy environnemental "Kasuku Décharge" dûment tracé avec historicité.',
        'Présence de 3 outliers biomédicaux documentés (pics épidémiques post-inondation).'
      ],
      epistemicWarnings: [
        'Le jeu de test (2025-2026) présente une variabilité pluviométrique atypique.',
        'La station synoptique Alunguli utilise une extrapolation spatiale partielle.'
      ]
    },
    
    dataLeakageAudit: {
      overallStatus: 'CLEAR',
      isValidationBlocked: false,
      items: [
        {
          id: 'LEAK_001',
          riskType: 'TARGET_DERIVATIVE',
          title: 'Dérivation de la variable cible',
          detected: false,
          severity: 'CONFORME',
          details: 'Aucune covariable calculée à partir du taux d incidence observé ou du nombre de cas.',
          remedyAction: 'Aucune action requise.'
        },
        {
          id: 'LEAK_002',
          riskType: 'FUTURE_DATA_LEAK',
          title: 'Fuite d information future dans l entraînement',
          detected: false,
          severity: 'CONFORME',
          details: 'La coupure temporelle stricte à Décembre 2024 empêche tout flux d information 2025-2026.',
          remedyAction: 'Vérifié par audit des indices temporels.'
        },
        {
          id: 'LEAK_003',
          riskType: 'TEST_SET_STANDARDIZATION',
          title: 'Normalisation avec statistiques du jeu de test',
          detected: false,
          severity: 'CONFORME',
          details: 'Moyennes et écarts-types calculés exclusivement sur les observations 2020-2024.',
          remedyAction: 'Pipeline de standardisation découplé.'
        },
        {
          id: 'LEAK_004',
          riskType: 'PROXY_INDIRECT_LEAK',
          title: 'Fuite par proxy environnemental anachronique',
          detected: false,
          severity: 'CONFORME',
          details: 'L état de décharge Kasuku 2022 est isolé de l état réhabilité 2026.',
          remedyAction: 'Prise en compte de l historique des aménagements.'
        }
      ],
      auditSummary: 'Intégrité méthodologique validée : Aucune contamination croisée entre ensembles d apprentissage et de test.'
    },
    
    timeSplitResult: {
      trainPeriodLabel: '2020–2024 (60 mois)',
      testPeriodLabel: '2025–2026 (24 mois)',
      trainObsCount: 180,
      testObsCount: 72,
      trainMetrics: {
        mae: 6.84,
        rmse: 9.42,
        mse: 88.74,
        r2: 0.742,
        deviance: 198.4,
        logLikelihood: -482.1,
        aic: 978.2,
        bic: 997.4,
        dispersionRatio: 1.14
      },
      testMetrics: {
        mae: 7.92,
        rmse: 11.18,
        mse: 125.0,
        r2: 0.681,
        deviance: 84.6,
        logLikelihood: -201.8,
        aic: 417.6,
        bic: 431.2,
        dispersionRatio: 1.22
      },
      overfittingGapPercentage: 8.2,
      overfittingRiskTier: 'FAIBLE',
      overfittingInterpretation: 'Écart de performance modéré (ΔR² = 0.061, ΔMAE = +1.08 cas/1000). Le modèle conserve une bonne capacité de généralisation temporelle.',
      futureLeakagePrevented: true
    },
    
    rollingTimeResult: {
      folds: [
        {
          foldNumber: 1,
          trainPeriod: '2020–2022',
          testPeriod: '2023',
          trainObs: 108,
          testObs: 36,
          trainMse: 82.4,
          testMse: 106.2,
          testMae: 7.35,
          testR2: 0.718,
          driftStatus: 'STABLE'
        },
        {
          foldNumber: 2,
          trainPeriod: '2020–2023',
          testPeriod: '2024',
          trainObs: 144,
          testObs: 36,
          trainMse: 86.1,
          testMse: 114.8,
          testMae: 7.62,
          testR2: 0.695,
          driftStatus: 'STABLE'
        },
        {
          foldNumber: 3,
          trainPeriod: '2020–2024',
          testPeriod: '2025',
          trainObs: 180,
          testObs: 36,
          trainMse: 88.7,
          testMse: 128.4,
          testMae: 8.14,
          testR2: 0.672,
          driftStatus: 'DEGRADATION_LEGERE'
        }
      ],
      averageTestMae: 7.70,
      averageTestR2: 0.695,
      driftSummary: 'Stabilité temporelle confirmée sur les 3 fenêtres glissantes successives, avec légère atténuation lors du choc pluviométrique de 2025.'
    },
    
    spatialValidationResult: {
      trainZoneIds: ['ZS_KASUKU', 'ZS_MIKELENGE'],
      trainZoneNames: ['Kasuku (Centre urbain)', 'Mikelenge (Périurbain dense)'],
      testZoneIds: ['ZS_ALUNGULI'],
      testZoneNames: ['Alunguli (Rive droite fleuve Congo)'],
      trainObsCount: 168,
      testObsCount: 84,
      trainMetrics: {
        mae: 6.95,
        rmse: 9.61,
        mse: 92.35,
        r2: 0.738,
        deviance: 184.2,
        logLikelihood: -450.4,
        aic: 914.8,
        bic: 933.5,
        dispersionRatio: 1.12
      },
      testMetrics: {
        mae: 8.45,
        rmse: 11.92,
        mse: 142.1,
        r2: 0.645,
        deviance: 98.6,
        logLikelihood: -232.1,
        aic: 478.2,
        bic: 491.9,
        dispersionRatio: 1.28
      },
      moranIOnTestResiduals: 0.112,
      moranPValue: 0.185,
      spatialLeakagePrevented: true,
      spatialGeneralizationNote: 'Absence d autocorrélation spatiale résiduelle significative sur la zone test Alunguli (p = 0.185), démontrant que la structure spatiale a été adéquatement captée.'
    },
    
    crossValidationResult: {
      method: 'K_FOLD_CROSS_VALIDATION',
      kFolds: 5,
      folds: [
        { foldIndex: 1, trainSize: 201, valSize: 51, valMae: 7.12, valRmse: 9.85, valR2: 0.724, valAic: 965.4 },
        { foldIndex: 2, trainSize: 201, valSize: 51, valMae: 7.45, valRmse: 10.22, valR2: 0.710, valAic: 978.1 },
        { foldIndex: 3, trainSize: 202, valSize: 50, valMae: 6.98, valRmse: 9.64, valR2: 0.738, valAic: 954.2 },
        { foldIndex: 4, trainSize: 202, valSize: 50, valMae: 7.82, valRmse: 11.04, valR2: 0.684, valAic: 994.6 },
        { foldIndex: 5, trainSize: 202, valSize: 50, valMae: 7.28, valRmse: 10.15, valR2: 0.719, valAic: 971.0 }
      ],
      meanMae: 7.33,
      stdMae: 0.28,
      meanR2: 0.715,
      stdR2: 0.018,
      spatioTemporalDependenceAdvisory: 'Avertissement méthodologique : Le K-fold aléatoire standard ignore l autocorrélation temporelle et spatiale. Privilégier Time-Split ou Block-Spatial pour les inférences épidémiologiques.'
    },
    
    calibration: {
      bins: [
        { decile: 1, predictedRiskMean: 12.4, observedRiskMean: 13.1, sampleCount: 25, residualGap: 0.7 },
        { decile: 2, predictedRiskMean: 18.2, observedRiskMean: 17.8, sampleCount: 25, residualGap: -0.4 },
        { decile: 3, predictedRiskMean: 24.6, observedRiskMean: 25.4, sampleCount: 25, residualGap: 0.8 },
        { decile: 4, predictedRiskMean: 31.0, observedRiskMean: 30.2, sampleCount: 25, residualGap: -0.8 },
        { decile: 5, predictedRiskMean: 38.5, observedRiskMean: 39.1, sampleCount: 25, residualGap: 0.6 },
        { decile: 6, predictedRiskMean: 47.2, observedRiskMean: 46.5, sampleCount: 25, residualGap: -0.7 },
        { decile: 7, predictedRiskMean: 58.0, observedRiskMean: 59.8, sampleCount: 25, residualGap: 1.8 },
        { decile: 8, predictedRiskMean: 71.4, observedRiskMean: 69.9, sampleCount: 25, residualGap: -1.5 },
        { decile: 9, predictedRiskMean: 88.2, observedRiskMean: 91.5, sampleCount: 26, residualGap: 3.3 },
        { decile: 10, predictedRiskMean: 114.5, observedRiskMean: 118.2, sampleCount: 26, residualGap: 3.7 }
      ],
      calibrationSlope: 1.034,
      calibrationIntercept: -0.82,
      brierScore: 0.042,
      ece: 1.43,
      calibrationQuality: 'EXCELLENTE',
      interpretationNote: 'Pente de calibration proche de 1.0 (1.034) et ordonnée à l origine minime (-0.82), indiquant un risque prédit sans sous-estimation ni sur-estimation systématique.'
    },
    
    residuals: {
      points: [
        { id: 'RES_001', zoneId: 'ZS_KASUKU', zoneName: 'Kasuku', period: '2024-03', observed: 78.4, predicted: 74.2, residual: 4.2, standardizedResidual: 0.45, cooksDistance: 0.012, tier: 'CONFORME' },
        { id: 'RES_002', zoneId: 'ZS_KASUKU', zoneName: 'Kasuku', period: '2024-11', observed: 122.0, predicted: 104.5, residual: 17.5, standardizedResidual: 1.88, cooksDistance: 0.048, tier: 'SOUS_ESTIME' },
        { id: 'RES_003', zoneId: 'ZS_MIKELENGE', zoneName: 'Mikelenge', period: '2024-04', observed: 52.1, predicted: 56.4, residual: -4.3, standardizedResidual: -0.46, cooksDistance: 0.014, tier: 'CONFORME' },
        { id: 'RES_004', zoneId: 'ZS_ALUNGULI', zoneName: 'Alunguli', period: '2025-02', observed: 64.0, predicted: 75.8, residual: -11.8, standardizedResidual: -1.26, cooksDistance: 0.035, tier: 'SURESTIME' },
        { id: 'RES_005', zoneId: 'ZS_ALUNGULI', zoneName: 'Alunguli', period: '2025-10', observed: 88.5, predicted: 84.1, residual: 4.4, standardizedResidual: 0.47, cooksDistance: 0.016, tier: 'CONFORME' }
      ],
      distribution: {
        mean: 0.12,
        stdDev: 9.35,
        min: -24.8,
        q1: -5.4,
        median: 0.28,
        q3: 5.9,
        max: 28.6
      },
      temporalTrend: [
        { period: '2020', avgResidual: -0.45, count: 36 },
        { period: '2021', avgResidual: 0.32, count: 36 },
        { period: '2022', avgResidual: -0.18, count: 36 },
        { period: '2023', avgResidual: 0.54, count: 36 },
        { period: '2024', avgResidual: 0.21, count: 36 },
        { period: '2025', avgResidual: 0.85, count: 36 },
        { period: '2026', avgResidual: -0.52, count: 36 }
      ],
      spatialClustersCount: 0,
      extremeResidualsCount: 2
    },
    
    robustness: {
      scenarios: [
        {
          scenarioCode: 'SCENARIO_A',
          title: 'Scénario A — Modèle Complet (Toutes variables admissibles)',
          description: 'Précipitations Lag 1, Température, Humidité, Décharge sauvage Kasuku, Inondations, Latrines hygiéniques',
          sampleSize: 252,
          keyCoefficients: [
            { variable: 'Précipitations (Lag 1)', beta: 0.384, ci95Lower: 0.245, ci95Upper: 0.523, pValue: 0.0001, signFlipped: false },
            { variable: 'Décharge sauvage Kasuku', beta: 0.452, ci95Lower: 0.198, ci95Upper: 0.706, pValue: 0.0006, signFlipped: false },
            { variable: 'Couverture Latrines (%)', beta: -0.295, ci95Lower: -0.442, ci95Upper: -0.148, pValue: 0.0008, signFlipped: false }
          ],
          aic: 978.2,
          bic: 997.4,
          r2: 0.742,
          stabilityStatus: 'STABLE'
        },
        {
          scenarioCode: 'SCENARIO_B',
          title: 'Scénario B — Sans Proxies Environnementaux',
          description: 'Exclusion stricte de la variable proxy station synoptique Alunguli et des relevés interpolés',
          sampleSize: 216,
          keyCoefficients: [
            { variable: 'Précipitations (Lag 1)', beta: 0.362, ci95Lower: 0.218, ci95Upper: 0.506, pValue: 0.0002, signFlipped: false },
            { variable: 'Décharge sauvage Kasuku', beta: 0.478, ci95Lower: 0.212, ci95Upper: 0.744, pValue: 0.0004, signFlipped: false },
            { variable: 'Couverture Latrines (%)', beta: -0.278, ci95Lower: -0.435, ci95Upper: -0.121, pValue: 0.0012, signFlipped: false }
          ],
          aic: 852.1,
          bic: 869.8,
          r2: 0.735,
          stabilityStatus: 'STABLE'
        },
        {
          scenarioCode: 'SCENARIO_C',
          title: 'Scénario C — Variables Haute Qualité Uniquement (Score A)',
          description: 'Conservation exclusive des sources certifiées METTELSAT directes et enquêtes ménages standardisées',
          sampleSize: 252,
          keyCoefficients: [
            { variable: 'Précipitations (Lag 1)', beta: 0.391, ci95Lower: 0.252, ci95Upper: 0.530, pValue: 0.0001, signFlipped: false },
            { variable: 'Décharge sauvage Kasuku', beta: 0.435, ci95Lower: 0.175, ci95Upper: 0.695, pValue: 0.0011, signFlipped: false },
            { variable: 'Couverture Latrines (%)', beta: -0.312, ci95Lower: -0.465, ci95Upper: -0.159, pValue: 0.0005, signFlipped: false }
          ],
          aic: 981.4,
          bic: 998.6,
          r2: 0.738,
          stabilityStatus: 'STABLE'
        },
        {
          scenarioCode: 'SCENARIO_D',
          title: 'Scénario D — Période Restreinte (2022–2026)',
          description: 'Restriction aux 5 dernières années avec protocoles de surveillance renforcés',
          sampleSize: 180,
          keyCoefficients: [
            { variable: 'Précipitations (Lag 1)', beta: 0.370, ci95Lower: 0.215, ci95Upper: 0.525, pValue: 0.0003, signFlipped: false },
            { variable: 'Décharge sauvage Kasuku', beta: 0.461, ci95Lower: 0.189, ci95Upper: 0.733, pValue: 0.0009, signFlipped: false },
            { variable: 'Couverture Latrines (%)', beta: -0.285, ci95Lower: -0.450, ci95Upper: -0.120, pValue: 0.0015, signFlipped: false }
          ],
          aic: 712.5,
          bic: 728.9,
          r2: 0.729,
          stabilityStatus: 'STABLE'
        }
      ],
      signFlipAlerts: [],
      overallStabilityAssessment: 'RESULTATS_STABLES',
      scientificNote: 'Les coefficients des covariables clés conservent un signe constant (pluie β > 0, latrines β < 0) et une amplitude stable (variation < 8%) à travers tous les scénarios de sensibilité.'
    },
    
    lagsSensitivity: [
      { lagMonths: 0, betaValue: 0.142, ciLower: -0.015, ciUpper: 0.299, pValue: 0.0760, aic: 1042.5, obsCount: 252, biologicalPlausibilityNote: 'Lag 0 synchrone trop court pour le cycle d incubation anophélien (10-14j) + clinique.', isStatisticallyPreferred: false },
      { lagMonths: 1, betaValue: 0.384, ciLower: 0.245, ciUpper: 0.523, pValue: 0.0001, aic: 978.2, obsCount: 249, biologicalPlausibilityNote: 'Lag 1 mois optimal : correspond au délai biologique pluie → gîte larvaire → vecteur adulte → transmission.', isStatisticallyPreferred: true },
      { lagMonths: 2, betaValue: 0.265, ciLower: 0.118, ciUpper: 0.412, pValue: 0.0024, aic: 994.8, obsCount: 246, biologicalPlausibilityNote: 'Lag 2 mois plausible : persistance de transmission résiduelle post-saison des pluies.', isStatisticallyPreferred: false },
      { lagMonths: 3, betaValue: 0.088, ciLower: -0.065, ciUpper: 0.241, pValue: 0.2580, aic: 1060.1, obsCount: 243, biologicalPlausibilityNote: 'Lag 3 mois non significatif : déphasage excessif par rapport aux gîtes anophéliens actifs.', isStatisticallyPreferred: false },
      { lagMonths: 4, betaValue: -0.032, ciLower: -0.190, ciUpper: 0.126, pValue: 0.6890, aic: 1075.4, obsCount: 240, biologicalPlausibilityNote: 'Lag 4 mois sans fondement épidémiologique direct.', isStatisticallyPreferred: false }
    ],
    
    spatialReliabilityZones: [
      {
        zoneId: 'ZS_KASUKU',
        zoneName: 'Kasuku (Centre urbain & Commercial)',
        type: 'COMMUNE_URBAINE',
        obsCount: 84,
        dataQualityRating: 'A',
        coveragePct: 100.0,
        uncertaintyMargin: 7.2,
        localMae: 6.45,
        isProxy: false,
        reliabilityTier: 'FIABILITE_ELEVEE',
        reliabilityScore: 92,
        scoringCriteria: [
          '84/84 mois documentés sans interruption.',
          'Double source de validation clinique (HGR Kindu + DPS).',
          'Station météorologique synoptique sur site (zéro proxy pluviométrique).'
        ]
      },
      {
        zoneId: 'ZS_MIKELENGE',
        zoneName: 'Mikelenge (Quartiers périphériques & maraîchers)',
        type: 'COMMUNE_PERIURBAINE',
        obsCount: 84,
        dataQualityRating: 'A',
        coveragePct: 98.8,
        uncertaintyMargin: 8.5,
        localMae: 7.15,
        isProxy: false,
        reliabilityTier: 'FIABILITE_ELEVEE',
        reliabilityScore: 88,
        scoringCriteria: [
          '83/84 mois documentés.',
          'Données WASH validées par enquêtes ménages V1.11.',
          'Écart résiduel moyen < 8 cas/1000.'
        ]
      },
      {
        zoneId: 'ZS_ALUNGULI',
        zoneName: 'Alunguli (Rive droite du fleuve Congo)',
        type: 'COMMUNE_INSULAIRE_FLUVIO',
        obsCount: 84,
        dataQualityRating: 'B',
        coveragePct: 94.0,
        uncertaintyMargin: 13.8,
        localMae: 9.85,
        isProxy: true,
        proxyHistoricalNote: 'Données climatiques issues d interpolation krigée de la station Kasuku (distance 4.8 km à travers le fleuve).',
        reliabilityTier: 'FIABILITE_INTERMEDIAIRE',
        reliabilityScore: 68,
        scoringCriteria: [
          'Présence d un proxy pluviométrique inter-rives.',
          'Incertitude d estimation accrue (IC95% plus large de ±13.8 cas/1000).',
          'Sensibilité fluviale marquée non totalement captée par les covariables terrestres.'
        ]
      }
    ],
    
    validatedMapZones: [
      {
        zoneId: 'ZS_KASUKU',
        zoneName: 'Kasuku',
        lat: -2.9515,
        lng: 25.9284,
        sanitaryRiskTier: 'TRES_ELEVE',
        estimationReliabilityTier: 'FIABILITE_ELEVEE',
        predictedIncidence: 84.5,
        confidenceInterval95: [77.3, 91.7],
        predictionInterval95: [64.2, 104.8],
        uncertaintyMargin: 7.2,
        observedIncidence: 82.0,
        estimationError: 'CONFORME',
        residualGap: -2.5,
        historicalYear: 2026,
        environmentalStateText: 'Zone commerciale avec assainissement partiel et réhabilitation du site de décharge fin 2024.',
        isProxyHistorical: false
      },
      {
        zoneId: 'ZS_MIKELENGE',
        zoneName: 'Mikelenge',
        lat: -2.9380,
        lng: 25.9420,
        sanitaryRiskTier: 'ELEVE',
        estimationReliabilityTier: 'FIABILITE_ELEVEE',
        predictedIncidence: 62.4,
        confidenceInterval95: [55.1, 69.7],
        predictionInterval95: [43.8, 81.0],
        uncertaintyMargin: 7.3,
        observedIncidence: 65.1,
        estimationError: 'CONFORME',
        residualGap: 2.7,
        historicalYear: 2026,
        environmentalStateText: 'Zone maraîchère périurbaine dense avec cours d eau lents favorisant la prolifération larvaire.',
        isProxyHistorical: false
      },
      {
        zoneId: 'ZS_ALUNGULI',
        zoneName: 'Alunguli',
        lat: -2.9650,
        lng: 25.9120,
        sanitaryRiskTier: 'MODERE',
        estimationReliabilityTier: 'FIABILITE_INTERMEDIAIRE',
        predictedIncidence: 48.2,
        confidenceInterval95: [36.4, 60.0],
        predictionInterval95: [22.5, 73.9],
        uncertaintyMargin: 11.8,
        observedIncidence: 42.0,
        estimationError: 'SURESTIME',
        residualGap: -6.2,
        historicalYear: 2026,
        environmentalStateText: 'Rive droite isolée, berges sablonneuses avec microclimats humides influencés par le fleuve Congo.',
        isProxyHistorical: true,
        proxyHistoricalLabel: 'PROXY HISTORIQUE CLIMATIQUE'
      }
    ],
    
    decomposedRobustnessScore: {
      overallScore: 84,
      tier: 'ROBUSTE',
      components: [
        { name: 'Qualité & Complétude des Données (20%)', weightPct: 20, score: 92, details: '0% de données manquantes sur la cible, séries mensuelles complètes.' },
        { name: 'Validation Croisée & Écart Entraînement/Test (20%)', weightPct: 20, score: 86, details: 'Écart de performance faible (ΔMAE = 1.08, ΔR² = 0.061).' },
        { name: 'Stabilité Temporelle & Rolling Folds (20%)', weightPct: 20, score: 82, details: 'Consistance des métriques sur 3 fenêtres glissantes successives.' },
        { name: 'Qualité de la Calibration (15%)', weightPct: 15, score: 89, details: 'Pente de calibration = 1.034, ECE = 1.43.' },
        { name: 'Robustesse aux Scénarios & Signes β (15%)', weightPct: 15, score: 88, details: 'Zéro inversion de signe constatée sur les 4 scénarios de sensibilité.' },
        { name: 'Marge d Incertitude & Prédictibilité (10%)', weightPct: 10, score: 72, details: 'Intervalles de prédiction élargis sur Alunguli en raison du proxy.' }
      ],
      transparencyJustification: 'Score pondéré calculé selon la formule : (0.20×92) + (0.20×86) + (0.20×82) + (0.15×89) + (0.15×88) + (0.10×72) = 84.4/100.'
    },
    
    decomposedConfidenceScore: {
      overallConfidence: 81,
      confidenceTier: 'CONFIANCE_HAUTE',
      isDistinctFromSanitaryRisk: true,
      criteriaBreakdown: [
        { criterion: 'Précision de l estimation statistique', score: 85, description: 'Intervalles de confiance étroits sur Kasuku et Mikelenge.' },
        { criterion: 'Absence de fuite d information', score: 98, description: 'Découplage strict vérifié entre jeu d entraînement et jeu de test.' },
        { criterion: 'Plausibilité biologique One Health', score: 90, description: 'Lag pluviométrique 1 mois conforme au cycle d anophèles.' },
        { criterion: 'Poids des approximations / proxies', score: 65, description: 'Pénalité modérée due au proxy pluviométrique sur Alunguli.' }
      ],
      cautiousAdvisory: 'Ce score mesure la robustesse analytique et la fiabilité prédictive du modèle mathématique. Il ne doit pas être confondu avec la gravité clinique ou l urgence opérationnelle.'
    },
    
    reportDocument: {
      id: 'REP_VAL_2026_001',
      validationId: 'VAL_PROJ_2026_001',
      validationCode: 'VAL_2026_001',
      modelCode: 'MODEL_2026_001',
      modelTitle: 'Régression Binomiale Négative — Paludisme Urbain Kindu',
      pathology: 'Paludisme (Plasmodium falciparum)',
      datasetName: 'Dataset Analytique Paludisme Kindu (2020-2026)',
      author: 'Dr. Épidémiologiste One Health & Équipe Scientifique Kindu',
      generatedDate: '2026-08-29',
      sections: [
        { sectionNum: 1, title: 'Modèle Statistique Validé', content: 'Régression Binomiale Négative avec paramètre de dispersion alpha = 0.284 et offset logarithmique populationnel.' },
        { sectionNum: 2, title: 'Dataset Source & Intégrité', content: 'Dataset unifié 2020-2026 regroupant 252 observations mensuelles réparties sur les 3 communes de Kindu.' },
        { sectionNum: 3, title: 'Pathologie Cible', content: 'Paludisme clinique et biologique confirmé (GE/TDR) dans la zone de santé de Kindu.' },
        { sectionNum: 4, title: 'Périmètre Géographique', content: 'Communes de Kasuku, Mikelenge et Alunguli (Maniema, RDC).' },
        { sectionNum: 5, title: 'Fenêtres Temporelles & Coupure', content: 'Entraînement : 2020–2024 (60 mois). Test de validation prospective : 2025–2026 (24 mois).' },
        { sectionNum: 6, title: 'Méthode de Validation Principale', content: 'Validation temporelle prospective stricte (Time-Split) couplée à une validation spatiale hold-out (Alunguli).' },
        { sectionNum: 7, title: 'Covariables Incluses & Spécification', content: 'Précipitations mensuelles (Lag 1 mois), Température moyenne, Décharge sauvage Kasuku, Inondations, Latrines hygiéniques (%).' },
        { sectionNum: 8, title: 'Qualité des Données & Contrôles Préalables', content: 'Zéro imputation silencieuse. 100% de complétude sur les variables sanitaires clés. Proxies documentés.' },
        { sectionNum: 9, title: 'Audit de Fuite d Information (Data Leakage)', content: 'Statut : CONFORME. Aucun flux descendant d information du jeu de test vers le jeu d entraînement.' },
        { sectionNum: 10, title: 'Performance Prédictive (Train vs Test)', content: 'Entraînement : MAE = 6.84 cas/1000, R² = 0.742. Test : MAE = 7.92 cas/1000, R² = 0.681. Dégradation minime (8.2%).' },
        { sectionNum: 11, title: 'Analyse de Calibration & Brier Score', content: 'Pente de calibration = 1.034. Brier score = 0.042. Concordance étroite entre risques prédits et incidences observées.' },
        { sectionNum: 12, title: 'Audit des Résidus & Autocorrélation', content: 'Résidus centrés autour de 0 (moyenne = 0.12). Absence de structure spatiale anormale (Moran I sur test = 0.112, p = 0.185).' },
        { sectionNum: 13, title: 'Validation Temporelle Glissante (Walk-Forward)', content: '3 plis glissants démontrant une stabilité temporelle satisfaisante avec MAE moyenne de 7.70 cas/1000.' },
        { sectionNum: 14, title: 'Validation Spatiale Hors-Échantillon', content: 'Généralisation à Alunguli satisfaisante (R² test = 0.645) malgré l élargissement de l intervalle de prédiction.' },
        { sectionNum: 15, title: 'Analyse de Sensibilité & Multiscénarios', content: '4 scénarios (A: Complet, B: Sans proxy, C: Haute qualité, D: Période restreinte) confirment la robustesse des effets.' },
        { sectionNum: 16, title: 'Test de Robustesse & Stabilité des Signes', content: 'Zéro inversion de signe observée sur les variables climatiques et sanitaires majeures.' },
        { sectionNum: 17, title: 'Incertitude & Intervalles de Prédiction', content: 'Distinction rigoureuse entre intervalle de confiance à 95% (espérance) et intervalle de prédiction à 95% (variabilité individuelle).' },
        { sectionNum: 18, title: 'Limites Épistémologiques & Méthodologiques', content: 'Les données d Alunguli reposent partiellement sur une extrapolation pluviométrique inter-rives. Prudence sur les projections au-delà de 6 mois.' },
        { sectionNum: 19, title: 'Interprétation Prudente des Résultats', content: 'Le modèle offre une capacité prédictive solide pour anticiper les variations saisonnières sous réserve de la stabilité des déterminants environnementaux.' },
        { sectionNum: 20, title: 'Conclusion Scientifique & Recommandations', content: 'Modèle validé pour l aide à la décision et l alerte précoce One Health à Kindu. Réévaluation annuelle requise lors des modifications d aménagement urbain.' }
      ],
      causalityDistinctionNotice: 'RAPPEL ÉPISTÉMOLOGIQUE FONDAMENTAL : Une performance prédictive élevée ne démontre en aucun cas une relation causale directe. Les associations statistiques quantifient des covariations sous réserve d hypothèses formulées.',
      cautiousConclusion: 'Validation scientifique V1.16 conclue avec succès : Modèle classé ROBUSTE (Score global : 84/100) avec niveau de confiance élevé.'
    },
    
    rValidationScript: `# ==============================================================================
# SCRIPT DE REPRODUCTIBILITÉ SCIENTIFIQUE R — VALIDATION V1.16
# Projet : One Health Kindu (Maniema, RDC)
# Modèle : Binomial Négatif V1.15 — Paludisme
# Validation : Time-Split 2020-2024 (Train) / 2025-2026 (Test)
# ==============================================================================

library(MASS)
library(dplyr)
library(ggplot2)

# 1. Chargement et séparation temporelle stricte (Zéro fuite de données)
df <- read.csv("dataset_analytique_paludisme_kindu.csv")
df_train <- df %>% filter(annee <= 2024)
df_test  <- df %>% filter(annee >= 2025)

# 2. Ajustement du modèle sur l'échantillon d'apprentissage
mod_nb <- glm.nb(cas_paludisme ~ precipitations_lag1 + temperature_moy + 
                 decharge_kasuku + inondations + latrines_hyg_pct + 
                 offset(log(population_totale)), data = df_train)

summary(mod_nb)

# 3. Prédictions sur le jeu de test
pred_test <- predict(mod_nb, newdata = df_test, type = "response")
df_test$pred_cas <- pred_test
df_test$pred_incidence <- (df_test$pred_cas / df_test$population_totale) * 1000
df_test$obs_incidence <- (df_test$cas_paludisme / df_test$population_totale) * 1000

# 4. Métriques de validation
mae_test  <- mean(abs(df_test$obs_incidence - df_test$pred_incidence))
rmse_test <- sqrt(mean((df_test$obs_incidence - df_test$pred_incidence)^2))
cat(sprintf("Test MAE : %.2f cas/1000\\nTest RMSE : %.2f\\n", mae_test, rmse_test))
`,

    pythonValidationScript: `# ==============================================================================
# SCRIPT DE REPRODUCTIBILITÉ SCIENTIFIQUE PYTHON — VALIDATION V1.16
# Projet : One Health Kindu (Maniema, RDC)
# Modèle : Statsmodels GLM NegativeBinomial — Paludisme
# ==============================================================================

import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

# 1. Chargement et découpage temporel strict
df = pd.read_csv("dataset_analytique_paludisme_kindu.csv")
df_train = df[df["annee"] <= 2024].copy()
df_test = df[df["annee"] >= 2025].copy()

# 2. Ajustement du modèle binomial négatif
formula = "cas_paludisme ~ precipitations_lag1 + temperature_moy + decharge_kasuku + inondations + latrines_hyg_pct"
mod = smf.glm(formula=formula, data=df_train, offset=np.log(df_train["population_totale"]),
              family=sm.families.NegativeBinomial(alpha=0.284)).fit()

print(mod.summary())

# 3. Évaluation sur l'ensemble de test
pred_test = mod.predict(df_test, offset=np.log(df_test["population_totale"]))
df_test["pred_incidence"] = (pred_test / df_test["population_totale"]) * 1000
df_test["obs_incidence"] = (df_test["cas_paludisme"] / df_test["population_totale"]) * 1000

mae = np.mean(np.abs(df_test["obs_incidence"] - df_test["pred_incidence"]))
print(f"Validation Test MAE : {mae:.2f} cas/1000")
`,
    
    status: 'VALIDE',
    validatedAt: '2026-08-29 11:30',
    validatorName: 'Dr. Épidémiologiste Principal (DPS Maniema / Recherche)',
    isDemonstrationData: true
  },
  
  {
    id: 'VAL_PROJ_2026_002',
    code: 'VAL_2026_002',
    title: 'Validation de Robustesse & Sensibilité WASH — Fièvre Typhoïde (Poisson V1.15)',
    modelId: 'MODEL_PROJ_2026_002',
    modelCode: 'MODEL_2026_002',
    modelTitle: 'Régression de Poisson & Facteurs WASH (Fièvre Typhoïde Kindu)',
    datasetId: 'ANALYSIS_DATASET_002',
    datasetName: 'Dataset Analytique Fièvre Typhoïde (2020-2026)',
    pathology: 'FIEVRE_TYPHOIDE',
    targetPathologiesList: ['FIEVRE_TYPHOIDE'],
    territory: 'Kindu (Kasuku, Mikelenge)',
    periodRange: '2020–2026',
    primaryMethod: 'TIME_SPLIT',
    
    preValidationCheck: {
      status: 'POSSIBLE',
      canProceed: true,
      totalObservations: 168,
      totalHealthZones: 2,
      totalPeriods: 84,
      missingValuesPct: 0.0,
      outliersDetectedCount: 2,
      proxiesCount: 0,
      temporalCoveragePct: 100.0,
      spatialCoveragePct: 100.0,
      datasetStructureStatus: 'COHERENT',
      justifications: [
        'Données issues des registres HGR Kindu et Centre de Santé Mikelenge.',
        'Zéro donnée manquante après harmonisation V1.14.'
      ],
      epistemicWarnings: [
        'Dispersion de Poisson légèrement élevée (phi = 1.34) requérant une quasi-Poisson ou Binomiale Négative.'
      ]
    },
    
    dataLeakageAudit: {
      overallStatus: 'CLEAR',
      isValidationBlocked: false,
      items: [
        {
          id: 'LEAK_T01',
          riskType: 'TARGET_DERIVATIVE',
          title: 'Dérivation cible',
          detected: false,
          severity: 'CONFORME',
          details: 'Aucune covariable calculée à partir des cas de typhoïde.',
          remedyAction: 'Conforme'
        },
        {
          id: 'LEAK_T02',
          riskType: 'FUTURE_DATA_LEAK',
          title: 'Fuite temporelle future',
          detected: false,
          severity: 'CONFORME',
          details: 'Jeu d entraînement limité à 2020-2024.',
          remedyAction: 'Conforme'
        }
      ],
      auditSummary: 'Contrôle d étanchéité validé sans fuite d information.'
    },
    
    timeSplitResult: {
      trainPeriodLabel: '2020–2024',
      testPeriodLabel: '2025–2026',
      trainObsCount: 120,
      testObsCount: 48,
      trainMetrics: {
        mae: 3.42,
        rmse: 5.12,
        mse: 26.2,
        r2: 0.685,
        deviance: 124.5,
        logLikelihood: -312.4,
        aic: 636.8,
        bic: 651.2,
        dispersionRatio: 1.34
      },
      testMetrics: {
        mae: 4.15,
        rmse: 6.08,
        mse: 36.9,
        r2: 0.612,
        deviance: 58.2,
        logLikelihood: -142.1,
        aic: 296.2,
        bic: 305.4,
        dispersionRatio: 1.41
      },
      overfittingGapPercentage: 10.6,
      overfittingRiskTier: 'MODERE',
      overfittingInterpretation: 'Surdispersion résiduelle modérée entraînant un léger écart en prédiction prospective (ΔMAE = +0.73 cas/1000).',
      futureLeakagePrevented: true
    },
    
    calibration: {
      bins: [
        { decile: 1, predictedRiskMean: 5.2, observedRiskMean: 4.8, sampleCount: 17, residualGap: -0.4 },
        { decile: 2, predictedRiskMean: 8.4, observedRiskMean: 9.1, sampleCount: 17, residualGap: 0.7 },
        { decile: 3, predictedRiskMean: 12.8, observedRiskMean: 13.5, sampleCount: 17, residualGap: 0.7 },
        { decile: 4, predictedRiskMean: 18.0, observedRiskMean: 17.2, sampleCount: 17, residualGap: -0.8 },
        { decile: 5, predictedRiskMean: 24.5, observedRiskMean: 26.0, sampleCount: 17, residualGap: 1.5 }
      ],
      calibrationSlope: 0.965,
      calibrationIntercept: 0.42,
      brierScore: 0.038,
      ece: 1.65,
      calibrationQuality: 'ACCEPTABLE',
      interpretationNote: 'Calibration satisfaisante avec légère sous-estimation sur les déciles supérieurs lors des épisodes d inondation.'
    },
    
    residuals: {
      points: [
        { id: 'REST_001', zoneId: 'ZS_KASUKU', zoneName: 'Kasuku', period: '2024-06', observed: 18.5, predicted: 16.8, residual: 1.7, standardizedResidual: 0.32, cooksDistance: 0.009, tier: 'CONFORME' },
        { id: 'REST_002', zoneId: 'ZS_MIKELENGE', zoneName: 'Mikelenge', period: '2025-01', observed: 28.4, predicted: 22.1, residual: 6.3, standardizedResidual: 1.25, cooksDistance: 0.031, tier: 'SOUS_ESTIME' }
      ],
      distribution: {
        mean: 0.08,
        stdDev: 4.85,
        min: -14.2,
        q1: -2.8,
        median: 0.15,
        q3: 3.1,
        max: 16.8
      },
      temporalTrend: [
        { period: '2020', avgResidual: -0.15, count: 24 },
        { period: '2021', avgResidual: 0.22, count: 24 },
        { period: '2022', avgResidual: 0.05, count: 24 },
        { period: '2023', avgResidual: -0.12, count: 24 },
        { period: '2024', avgResidual: 0.18, count: 24 },
        { period: '2025', avgResidual: 0.42, count: 24 }
      ],
      spatialClustersCount: 0,
      extremeResidualsCount: 1
    },
    
    robustness: {
      scenarios: [
        {
          scenarioCode: 'SCEN_T_A',
          title: 'Scénario A — Modèle Complet',
          description: 'Eau potable, Latrines, Inondation, Décharge sauvage',
          sampleSize: 168,
          keyCoefficients: [
            { variable: 'Accès Eau Potable (%)', beta: -0.412, ci95Lower: -0.584, ci95Upper: -0.240, pValue: 0.0003, signFlipped: false },
            { variable: 'Inondation quartier', beta: 0.524, ci95Lower: 0.268, ci95Upper: 0.780, pValue: 0.0001, signFlipped: false }
          ],
          aic: 636.8,
          bic: 651.2,
          r2: 0.685,
          stabilityStatus: 'STABLE'
        },
        {
          scenarioCode: 'SCEN_T_B',
          title: 'Scénario B — Sans Décharge Sauvage',
          description: 'Évaluation des facteurs WASH purs',
          sampleSize: 168,
          keyCoefficients: [
            { variable: 'Accès Eau Potable (%)', beta: -0.435, ci95Lower: -0.605, ci95Upper: -0.265, pValue: 0.0002, signFlipped: false },
            { variable: 'Inondation quartier', beta: 0.548, ci95Lower: 0.290, ci95Upper: 0.806, pValue: 0.0001, signFlipped: false }
          ],
          aic: 642.1,
          bic: 654.8,
          r2: 0.672,
          stabilityStatus: 'STABLE'
        }
      ],
      signFlipAlerts: [],
      overallStabilityAssessment: 'RESULTATS_STABLES',
      scientificNote: 'L effet protecteur de l accès à l eau potable reste stable à travers tous les scénarios.'
    },
    
    lagsSensitivity: [
      { lagMonths: 0, betaValue: 0.485, ciLower: 0.280, ciUpper: 0.690, pValue: 0.0001, aic: 636.8, obsCount: 168, biologicalPlausibilityNote: 'Lag 0 synchrone cohérent avec la contamination hydrique directe (période d incubation 7-14j).', isStatisticallyPreferred: true },
      { lagMonths: 1, betaValue: 0.220, ciLower: 0.045, ciUpper: 0.395, pValue: 0.0140, aic: 658.4, obsCount: 166, biologicalPlausibilityNote: 'Lag 1 mois plausible : transmission secondaire inter-humaine.', isStatisticallyPreferred: false }
    ],
    
    spatialReliabilityZones: [
      {
        zoneId: 'ZS_KASUKU',
        zoneName: 'Kasuku',
        type: 'COMMUNE_URBAINE',
        obsCount: 84,
        dataQualityRating: 'A',
        coveragePct: 100.0,
        uncertaintyMargin: 4.8,
        localMae: 3.65,
        isProxy: false,
        reliabilityTier: 'FIABILITE_ELEVEE',
        reliabilityScore: 90,
        scoringCriteria: ['Données certifiées HGR', 'Surveillance sentinelle continue']
      },
      {
        zoneId: 'ZS_MIKELENGE',
        zoneName: 'Mikelenge',
        type: 'COMMUNE_PERIURBAINE',
        obsCount: 84,
        dataQualityRating: 'A',
        coveragePct: 97.6,
        uncertaintyMargin: 5.4,
        localMae: 4.22,
        isProxy: false,
        reliabilityTier: 'FIABILITE_ELEVEE',
        reliabilityScore: 86,
        scoringCriteria: ['Enquêtes WASH régulières', 'Couverture 97.6%']
      }
    ],
    
    validatedMapZones: [
      {
        zoneId: 'ZS_KASUKU',
        zoneName: 'Kasuku',
        lat: -2.9515,
        lng: 25.9284,
        sanitaryRiskTier: 'ELEVE',
        estimationReliabilityTier: 'FIABILITE_ELEVEE',
        predictedIncidence: 32.4,
        confidenceInterval95: [27.6, 37.2],
        predictionInterval95: [19.5, 45.3],
        uncertaintyMargin: 4.8,
        observedIncidence: 30.8,
        estimationError: 'CONFORME',
        residualGap: -1.6,
        historicalYear: 2026,
        environmentalStateText: 'Zone commerciale avec réseau d eau potable partiellement fonctionnel.',
        isProxyHistorical: false
      },
      {
        zoneId: 'ZS_MIKELENGE',
        zoneName: 'Mikelenge',
        lat: -2.9380,
        lng: 25.9420,
        sanitaryRiskTier: 'MODERE',
        estimationReliabilityTier: 'FIABILITE_ELEVEE',
        predictedIncidence: 21.8,
        confidenceInterval95: [16.4, 27.2],
        predictionInterval95: [10.2, 33.4],
        uncertaintyMargin: 5.4,
        observedIncidence: 23.5,
        estimationError: 'CONFORME',
        residualGap: 1.7,
        historicalYear: 2026,
        environmentalStateText: 'Zone périurbaine avec points d eau communautaires surveillés.',
        isProxyHistorical: false
      }
    ],
    
    decomposedRobustnessScore: {
      overallScore: 79,
      tier: 'ROBUSTE',
      components: [
        { name: 'Qualité des Données (20%)', weightPct: 20, score: 90, details: 'Bonne complétude des registres de laboratoire.' },
        { name: 'Validation Temporelle (20%)', weightPct: 20, score: 76, details: 'Dégradation modérée en prospective (ΔMAE = 0.73).' },
        { name: 'Surdispersion & Modélisation (20%)', weightPct: 20, score: 72, details: 'Surdispersion résiduelle modérée sous Poisson.' },
        { name: 'Calibration (15%)', weightPct: 15, score: 82, details: 'Pente = 0.965, bon accord global.' },
        { name: 'Stabilité des Signes β (15%)', weightPct: 15, score: 92, details: 'Signe stable du facteur eau potable.' },
        { name: 'Incertitude (10%)', weightPct: 10, score: 68, details: 'Intervalles sensibles aux pics épidémiques.' }
      ],
      transparencyJustification: 'Calcul pondéré transparent : Score 79/100 (Robuste).'
    },
    
    decomposedConfidenceScore: {
      overallConfidence: 77,
      confidenceTier: 'CONFIANCE_HAUTE',
      isDistinctFromSanitaryRisk: true,
      criteriaBreakdown: [
        { criterion: 'Précision de l estimation', score: 80, description: 'Intervalles de confiance étroits.' },
        { criterion: 'Qualité biologique du lag', score: 92, description: 'Lag 0 conforme à la transmission typhique directe.' },
        { criterion: 'Absence de proxy', score: 95, description: 'Données locales directes sans proxy.' }
      ],
      cautiousAdvisory: 'Mesure de confiance statistique distincte de l urgence sanitaire.'
    },
    
    reportDocument: {
      id: 'REP_VAL_2026_002',
      validationId: 'VAL_PROJ_2026_002',
      validationCode: 'VAL_2026_002',
      modelCode: 'MODEL_2026_002',
      modelTitle: 'Régression de Poisson — Fièvre Typhoïde Kindu',
      pathology: 'Fièvre Typhoïde (Salmonella enterica)',
      datasetName: 'Dataset Analytique Fièvre Typhoïde (2020-2026)',
      author: 'DPS Maniema & Cellule Recherche',
      generatedDate: '2026-08-29',
      sections: [
        { sectionNum: 1, title: 'Modèle Statistique Validé', content: 'Régression de Poisson avec offset populationnel logarithmique.' },
        { sectionNum: 2, title: 'Dataset Source', content: 'Registres sanitaires Kindu 2020-2026.' },
        { sectionNum: 3, title: 'Pathologie Cible', content: 'Fièvre typhoïde cliniquement et biologiquement confirmée (Widal / Coproculture).' },
        { sectionNum: 4, title: 'Périmètre Géographique', content: 'Kasuku et Mikelenge.' },
        { sectionNum: 5, title: 'Période & Découpage', content: 'Entraînement 2020-2024, test 2025-2026.' },
        { sectionNum: 6, title: 'Méthode', content: 'Time-Split prospectif.' },
        { sectionNum: 7, title: 'Covariables', content: 'Accès eau potable (%), Latrines hygiéniques (%), Inondations, Décharge.' },
        { sectionNum: 8, title: 'Qualité', content: 'Complétude 100%, 0 proxy.' },
        { sectionNum: 9, title: 'Fuite d information', content: 'Conforme, aucune fuite détectée.' },
        { sectionNum: 10, title: 'Performance', content: 'MAE Train = 3.42, MAE Test = 4.15 cas/1000.' },
        { sectionNum: 11, title: 'Calibration', content: 'Pente = 0.965, acceptable.' },
        { sectionNum: 12, title: 'Résidus', content: 'Moyenne résiduelle = 0.08.' },
        { sectionNum: 13, title: 'Validation temporelle', content: 'Comportement temporel régulier.' },
        { sectionNum: 14, title: 'Validation spatiale', content: 'Non applicable sur 2 zones, validation par blocs.' },
        { sectionNum: 15, title: 'Sensibilité', content: 'Stabilité confirmée avec exclusion de variables non WASH.' },
        { sectionNum: 16, title: 'Robustesse', content: 'Aucun changement de direction de coefficient.' },
        { sectionNum: 17, title: 'Incertitude', content: 'Intervalles de confiance 95% documentés.' },
        { sectionNum: 18, title: 'Limites', content: 'Légère surdispersion non totalement absorbée par Poisson standard.' },
        { sectionNum: 19, title: 'Interprétation', content: 'Effet protecteur fort de l eau potable (-41% de cas pour +10% d accès).' },
        { sectionNum: 20, title: 'Conclusion', content: 'Modèle robuste pour guider les investissements d infrastructures WASH.' }
      ],
      causalityDistinctionNotice: 'Association statistique démontrée entre couverture eau potable et réduction des cas, sous réserve d absence de facteurs confondants non mesurés.',
      cautiousConclusion: 'Validation validée : Modèle ROBUSTE (Score : 79/100).'
    },
    
    rValidationScript: `# Validation R Fièvre Typhoïde
df <- read.csv("dataset_typhoide_kindu.csv")
mod_pois <- glm(cas_typhoide ~ acces_eau_potable + latrines_hyg + inondations + offset(log(pop)), family=poisson, data=df[df$annee<=2024,])
summary(mod_pois)
`,
    pythonValidationScript: `# Validation Python Fièvre Typhoïde
import statsmodels.api as sm
# GLM Poisson
`,
    status: 'VALIDE',
    validatedAt: '2026-08-29 10:45',
    validatorName: 'Dr. Analyste Santé Publique',
    isDemonstrationData: true
  }
];

export const initialValidationProjectsV116 = MOCK_INITIAL_VALIDATIONS_V116;

export const MOCK_V116_TEST_SCENARIOS: V116ValidationScenarioTest[] = [
  {
    id: 1,
    code: 'TEST_01_OVERFITTING',
    title: 'Test 1 — Détection du Surapprentissage (Overfitting)',
    category: 'TEST_SURAPPRENTISSAGE',
    description: 'Ajuster un modèle volontairement sur-paramétré (polynôme degré 5 + 18 interactions) et vérifier que le système détecte un écart d entraînement/test excessif (ΔMAE > 35%, Risque ÉLEVÉ).',
    status: 'PASSED',
    testSteps: [
      'Création d un modèle saturé avec 22 paramètres sur 180 observations d entraînement.',
      'Calcul du R² d entraînement (0.942) vs R² de test (0.318).',
      'Calcul du ratio d écart de surapprentissage (66.2%).',
      'Vérification de l affichage automatique du statut "Risque de surapprentissage ÉLEVÉ".'
    ],
    expectedOutput: 'Classification automatique en Risque ÉLEVÉ avec recommandation de régularisation ou simplification.',
    actualOutput: 'Risque ÉLEVÉ détecté. Écart d entraînement/test = 66.2%. Alerte méthodologique émise.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 2,
    code: 'TEST_02_DATA_LEAKAGE',
    title: 'Test 2 — Détection de Fuite d Information (Data Leakage)',
    category: 'TEST_FUITE_INFORMATION',
    description: 'Introduire volontairement une covariable dérivée de la cible (ex: taux de positivité TDR calculé avec les cas futurs) et vérifier le blocage automatique.',
    status: 'PASSED',
    testSteps: [
      'Injection de la variable "taux_cas_normalise_futur" dans le jeu de test et d entraînement.',
      'Exécution de l audit de fuite d information.',
      'Vérification du déclenchement du statut "VALIDATION BLOQUÉE" ou "AVERTISSEMENT CRITIQUE".'
    ],
    expectedOutput: 'Statut BLOCKED ou AVERTISSEMENT CRITIQUE avec désignation de la variable fautive.',
    actualOutput: 'Fuite détectée : Variable "taux_cas_normalise_futur" corrélée à r=0.98 avec la cible test. Validation bloquée avec succès.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 3,
    code: 'TEST_03_TIME_SPLIT',
    title: 'Test 3 — Validation Temporelle Prospective (Time-Split)',
    category: 'TEST_VALIDATION_TEMPORELLE',
    description: 'Entraînement sur 2020-2024 et test sur 2025-2026. Vérifier l étanchéité temporelle absolue (zéro donnée future dans l apprentissage).',
    status: 'PASSED',
    testSteps: [
      'Partition stricte selon max(date_train) < min(date_test).',
      'Vérification de l absence de recalcul des statistiques avec le jeu de test.',
      'Évaluation prospective sur les 24 mois de test.'
    ],
    expectedOutput: 'Évaluation prospective valide, MAE train 6.84 vs test 7.92 cas/1000.',
    actualOutput: 'Étanchéité temporelle garantie. Zéro point de test dans l ajustement des paramètres.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 4,
    code: 'TEST_04_SPATIAL_VALIDATION',
    title: 'Test 4 — Validation Spatiale Hors-Échantillon (Spatial Hold-Out)',
    category: 'TEST_VALIDATION_SPATIALE',
    description: 'Réserver la commune d Alunguli pour le test et entraîner sur Kasuku + Mikelenge.',
    status: 'PASSED',
    testSteps: [
      'Sélection de zones d entraînement disjointes des zones de test.',
      'Ajustement des effets fixes et calcul des résidus sur Alunguli.',
      'Test d autocorrélation spatiale de Moran sur les résidus de test.'
    ],
    expectedOutput: 'Moran I résiduel non significatif (p > 0.05), indiquant une bonne généralisation spatiale.',
    actualOutput: 'Moran I = 0.112 (p = 0.185). Généralisation spatiale validée.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 5,
    code: 'TEST_05_CALIBRATION',
    title: 'Test 5 — Calibration du Risque Prédit vs Observé',
    category: 'TEST_CALIBRATION',
    description: 'Découper les prédictions en 10 déciles et comparer le risque moyen prédit à l incidence observée.',
    status: 'PASSED',
    testSteps: [
      'Calcul des déciles de risque.',
      'Calcul de la pente de calibration (cible = 1.0) et de l ordonnée (cible = 0.0).',
      'Calcul de l ECE (Expected Calibration Error).'
    ],
    expectedOutput: 'Pente de calibration comprise entre 0.90 et 1.10. ECE < 3.0.',
    actualOutput: 'Pente = 1.034, Ordonnée = -0.82, ECE = 1.43. Calibration EXCELLENTE.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 6,
    code: 'TEST_06_UNCERTAINTY_INTERVALS',
    title: 'Test 6 — Distinction Intervalle de Confiance vs Prédiction',
    category: 'TEST_INCERTITUDE_INTERVALLES',
    description: 'Vérifier que l intervalle de confiance à 95% (espérance) est strictement plus étroit que l intervalle de prédiction à 95% (variabilité individuelle + erreur résiduelle).',
    status: 'PASSED',
    testSteps: [
      'Calcul de l IC95% (ex: [77.3, 91.7]).',
      'Calcul de l IP95% (ex: [64.2, 104.8]).',
      'Vérification de la règle d inclusion mathématique : Largeur(IP) > Largeur(IC).'
    ],
    expectedOutput: 'Largeur IP95% > Largeur IC95%. Distinction conceptuelle explicite dans l interface.',
    actualOutput: 'Largeur IC = 14.4 vs Largeur IP = 40.6. Règle mathématique et séparation visuelle validées.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 7,
    code: 'TEST_07_ROBUSTNESS_SCENARIOS',
    title: 'Test 7 — Robustesse Multi-Scénarios & Changement de Signe',
    category: 'TEST_ROBUSTESSE_SCENARIOS',
    description: 'Comparer les coefficients sur 4 scénarios et vérifier la détection d inversion de signe (β > 0 -> β < 0).',
    status: 'PASSED',
    testSteps: [
      'Exécution Scénarios A, B, C, D.',
      'Contrôle automatique du signe de chaque paramètre.',
      'Alerte si inversion de direction de l association.'
    ],
    expectedOutput: 'Aucune inversion de signe sur les variables sanitaires clés.',
    actualOutput: 'Signe stable constaté pour Pluie (β > 0) et Latrines (β < 0) à travers tous les scénarios.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 8,
    code: 'TEST_08_HISTORICITY_ENV',
    title: 'Test 8 — Respect Strict de l Historicité Environnementale & Proxies',
    category: 'TEST_HISTORICITE_ENV',
    description: 'Tester l état Kasuku 2022 (décharge active) vs 2026 (site réhabilité) et vérifier que l état 2026 n est pas projeté rétroactivement sur 2022.',
    status: 'PASSED',
    testSteps: [
      'Vérification de l indexation temporelle des covariables environnementales.',
      'Contrôle de l affichage de l étiquette PROXY HISTORIQUE sur les séries interpolées.',
      'Audit de non-rétroaction.'
    ],
    expectedOutput: 'Historicité respectée. Présence de l étiquette PROXY HISTORIQUE.',
    actualOutput: 'État 2022 préservé comme décharge active (0/1 = 1). État 2026 = 0. Étiquette proxy affichée.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 9,
    code: 'TEST_09_MULTI_PATHOLOGY',
    title: 'Test 9 — Validation Séparée Multi-Pathologies',
    category: 'TEST_MULTI_PATHOLOGIES',
    description: 'Valider séparément le paludisme (Binomial Négatif, Lag 1) et la fièvre typhoïde (Poisson, Lag 0) sans mélange de métriques.',
    status: 'PASSED',
    testSteps: [
      'Calcul indépendant des métriques pour Paludisme et Typhoïde.',
      'Vérification de l étanchéité des datasets analytiques distincts.'
    ],
    expectedOutput: 'Métriques strictement dissociées.',
    actualOutput: 'Séparation complète validée.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 10,
    code: 'TEST_10_SEPARATION_RISK_RELIABILITY',
    title: 'Test 10 — Séparation Stricte : Niveau de Risque vs Fiabilité de l Estimation',
    category: 'TEST_SEPARATION_RISQUE_FIABILITE',
    description: 'Vérifier qu une zone à risque ÉLEVÉ peut avoir une fiabilité FAIBLE (ex: zone reculée avec proxy) et inversement, sans confusion sémantique.',
    status: 'PASSED',
    testSteps: [
      'Génération d une zone de test (Risque = ÉLEVÉ, Fiabilité = FAIBLE due à 1 seul relevé et proxy).',
      'Vérification de la séparation en 2 couches cartographiques indépendantes.',
      'Contrôle de non-fusion des scores.'
    ],
    expectedOutput: 'Deux couches cartographiques distinctes : "Niveau de risque" et "Fiabilité spatiale".',
    actualOutput: 'Séparation rigoureuse respectée sur les couches et infobulles cartographiques.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 11,
    code: 'TEST_11_REPRODUCIBILITY',
    title: 'Test 11 — Reproductibilité Complète R & Python',
    category: 'TEST_REPRODUCTIBILITE_SCRIPTS',
    description: 'Générer les scripts R (MASS) et Python (Statsmodels) exécutables reproduisant exactement le protocole de validation.',
    status: 'PASSED',
    testSteps: [
      'Génération automatique du script R.',
      'Génération automatique du script Python.',
      'Vérification de la présence des fonctions glm.nb et GLM NegativeBinomial.'
    ],
    expectedOutput: 'Scripts R et Python complets, commentés, avec gestion de l offset et des découpages.',
    actualOutput: 'Scripts R et Python générés et syntaxiquement conformes.',
    lastRunDate: '2026-08-29 11:40'
  },
  {
    id: 12,
    code: 'TEST_12_NON_REGRESSION',
    title: 'Test 12 — Test de Non-Régression V1.0 à V1.15',
    category: 'TEST_NON_REGRESSION_V1_V15',
    description: 'Vérifier la préservation intégrale de tous les modules antérieurs : Collecte V1.0-V1.7, Contrôle Qualité V1.8, Exploration Spatio-Temporelle V1.9, Multi-Pathologies V1.10, Opérations de Terrain V1.11, Multi-Sources V1.12, Diagnostic Scientifique V1.13, Laboratoire d Analyse V1.14 et Modélisation Statistique V1.15.',
    status: 'PASSED',
    testSteps: [
      'Audit de présence des routes et types V1.0 à V1.15.',
      'Vérification de la persistance des 10 modèles V1.15 et des datasets V1.14.',
      'Contrôle de l intégrité des règles de non-imputation silencieuse et traçabilité des proxies.'
    ],
    expectedOutput: '100% des modules antérieurs fonctionnels et intègres.',
    actualOutput: 'Tous les modules et datasets V1.0–V1.15 sont parfaitement préservés et interconnectés.',
    lastRunDate: '2026-08-29 11:40'
  }
];

export const initialValidationScenariosV116 = MOCK_V116_TEST_SCENARIOS;

