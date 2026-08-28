import {
  VariableDiagnosticProfile,
  EnvironmentalHistoricityRecord,
  HistoricalProxyDeclaration,
  CaseDefinitionShiftAlert,
  GeographicBoundaryShiftAlert,
  DataTransformationLogEntry,
  AdaptiveAnalyticalDatasetConfig,
  SensitivityModelComparison,
  ScientificQuestionAnswer,
  V113ValidationTest
} from '../types';

/**
 * ============================================================================
 * ONE HEALTH MANIEMA — MODULE V1.13
 * DIAGNOSTIC SCIENTIFIQUE, DISPONIBILITÉ, QUALITÉ & PRÉPARATION ANALYTIQUE
 * ============================================================================
 */

export const MANIEMA_18_HEALTH_ZONES = [
  { id: 'ZS-KINDU', name: 'Kindu', territory: 'Ville de Kindu', isUrban: true, population: 215000 },
  { id: 'ZS-ALUNGULI', name: 'Alunguli', territory: 'Ville de Kindu', isUrban: true, population: 195000 },
  { id: 'ZS-KASONGO', name: 'Kasongo', territory: 'Kasongo', isUrban: false, population: 310000 },
  { id: 'ZS-KIBOMBO', name: 'Kibombo', territory: 'Kibombo', isUrban: false, population: 165000 },
  { id: 'ZS-PUNIA', name: 'Punia', territory: 'Punia', isUrban: false, population: 140000 },
  { id: 'ZS-PANGI', name: 'Pangi (Kampene)', territory: 'Pangi', isUrban: false, population: 190000 },
  { id: 'ZS-KALIMA', name: 'Kalima', territory: 'Pangi', isUrban: false, population: 175000 },
  { id: 'ZS-LUBUNDA', name: 'Lubunda', territory: 'Kasongo', isUrban: false, population: 120000 },
  { id: 'ZS-WAMBA', name: 'Wamba-Lwama', territory: 'Kasongo', isUrban: false, population: 145000 },
  { id: 'ZS-LUSANGI', name: 'Lusangi', territory: 'Kabambare', isUrban: false, population: 110000 },
  { id: 'ZS-KABAMBARE', name: 'Kabambare', territory: 'Kabambare', isUrban: false, population: 180000 },
  { id: 'ZS-SARAMABILA', name: 'Saramabila', territory: 'Kabambare', isUrban: false, population: 160000 },
  { id: 'ZS-KAILO', name: 'Kailo', territory: 'Kailo', isUrban: false, population: 155000 },
  { id: 'ZS-OBOKOTE', name: 'Obokote', territory: 'Punia', isUrban: false, population: 98000 },
  { id: 'ZS-FERA', name: 'Fera', territory: 'Punia', isUrban: false, population: 85000 },
  { id: 'ZS-KAMA', name: 'Kama', territory: 'Pangi', isUrban: false, population: 130000 },
  { id: 'ZS-SAMBA', name: 'Samba', territory: 'Kasongo', isUrban: false, population: 125000 },
  { id: 'ZS-TINGI', name: 'Tingi-Tingi', territory: 'Lubutu', isUrban: false, population: 115000 }
];

export const STUDY_YEARS_2018_2026 = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

/**
 * 1. PROFILS DIAGNOSTIQUES SCIENTIFIQUES DES VARIABLES CLÉS
 */
export const MOCK_VARIABLE_DIAGNOSTIC_PROFILES_V113: VariableDiagnosticProfile[] = [
  {
    id: 'VAR-DIAG-001',
    variableCode: 'cas_paludisme_mensuels',
    variableName: 'Incidence mensuelle du paludisme (Cas déclarés)',
    dimension: 'SANTE',
    category: 'Épidémiologie infectieuse',
    unit: 'Cas / mois',
    sourceId: 'SRC-SAN-001',
    sourceName: 'Registres FOSA & DHIS2 / DPS Maniema',
    sourceReliability: 'TRES_FIABLE',
    sourceReliabilityCriteria: [
      'Source institutionnelle officielle (Ministère de la Santé / DPS)',
      'Contrôle mensuel de complétude par les médecins chefs de zone',
      'Validation biologique TDR / Microscopie généralisée depuis 2022'
    ],
    temporalCoverage: {
      firstDateAvailable: '2018-01-01',
      lastDateAvailable: '2026-08-01',
      yearsCovered: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
      missingPeriods: [],
      coverageRatePercent: 96.5,
      precision: 'MOIS'
    },
    spatialCoverage: {
      coveredZonesCount: 18,
      totalZonesCount: 18,
      coveredZonesNames: MANIEMA_18_HEALTH_ZONES.map(z => z.name),
      uncoveredZonesNames: [],
      coverageRatePercent: 100,
      geographicLevel: 'ZONE_SANTE'
    },
    completenessScorePercent: 96.5,
    scientificQualityScore: 92,
    signal: 'VERT',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Série temporelle continue de 9 années consécutives sur les 18 zones de santé.'
    },
    statisticalUsability: {
      usable: 'OUI',
      justification: 'Volume d’observations suffisant pour tests d’hypothèses et corrélations robustes.',
      restrictions: 'Avertissement : changement de définition de cas en 2022 (Clinique vs Confirmé TDR).'
    },
    spatialTemporalModelingUsability: {
      usable: 'OUI',
      justification: 'Excellente couverture spatio-temporelle pour GLMM, INLA et séries temporelles SARIMA.'
    },
    biasRisks: {
      hasUrbanOnlyBias: false,
      hasTemporalAsymmetry: false,
      hasDefinitionChange: true,
      hasGeographicRezoning: true,
      isPointInTimeObservation: false,
      warningMessages: [
        'Attention : Transition de définition en 2022 (2018-2021 : clinique; 2022-2026 : TDR/GE).',
        'Scission administrative Kindu / Alunguli intervenue en 2021 (ancien découpage préservé).'
      ]
    },
    statusDistribution: {
      observedCount: 1860,
      importedCount: 1860,
      estimatedCount: 0,
      proxyCount: 0,
      missingCount: 68,
      zeroMeasuredCount: 12,
      unknownCount: 15,
      notApplicableCount: 0
    },
    isDemo: true
  },
  {
    id: 'VAR-DIAG-002',
    variableCode: 'cas_typhoide_mensuels',
    variableName: 'Cas de fièvre typhoïde (Présumés & Confirmés)',
    dimension: 'SANTE',
    category: 'Maladies à transmission hydrique',
    unit: 'Cas / mois',
    sourceId: 'SRC-SAN-001',
    sourceName: 'Registres Hospitaliers & FOSA Maniema',
    sourceReliability: 'FIABLE',
    sourceReliabilityCriteria: [
      'Registres cliniques d’hospitalisation et de consultation',
      'Disparité de confirmation selon la disponibilité des réactifs Widal et hémocultures'
    ],
    temporalCoverage: {
      firstDateAvailable: '2020-01-01',
      lastDateAvailable: '2026-08-01',
      yearsCovered: [2020, 2021, 2022, 2023, 2024, 2025, 2026],
      missingPeriods: ['2018', '2019'],
      coverageRatePercent: 84.2,
      precision: 'MOIS'
    },
    spatialCoverage: {
      coveredZonesCount: 14,
      totalZonesCount: 18,
      coveredZonesNames: MANIEMA_18_HEALTH_ZONES.slice(0, 14).map(z => z.name),
      uncoveredZonesNames: ['Fera', 'Obokote', 'Kama', 'Tingi-Tingi'],
      coverageRatePercent: 77.8,
      geographicLevel: 'ZONE_SANTE'
    },
    completenessScorePercent: 84.2,
    scientificQualityScore: 78,
    signal: 'VERT',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Données disponibles de 2020 à 2026 pour 14 zones de santé.'
    },
    statisticalUsability: {
      usable: 'OUI',
      justification: 'Analyse bivariée et régression logistique possibles sur la période 2020–2026.'
    },
    spatialTemporalModelingUsability: {
      usable: 'PARTIELLEMENT',
      justification: 'Modélisation spatio-temporelle possible uniquement sur les 14 zones couvertes (2020–2026).',
      reasonsForExclusion: ['4 zones rurales enclavées non documentées entre 2018 et 2019']
    },
    biasRisks: {
      hasUrbanOnlyBias: false,
      hasTemporalAsymmetry: true,
      hasDefinitionChange: true,
      hasGeographicRezoning: false,
      isPointInTimeObservation: false,
      warningMessages: [
        'Absence de données standardisées en 2018–2019 pour la typhoïde.',
        'Sous-notification possible dans les zones rurales sans laboratoire opérationnel.'
      ]
    },
    statusDistribution: {
      observedCount: 1120,
      importedCount: 1120,
      estimatedCount: 0,
      proxyCount: 0,
      missingCount: 210,
      zeroMeasuredCount: 45,
      unknownCount: 30,
      notApplicableCount: 0
    },
    isDemo: true
  },
  {
    id: 'VAR-DIAG-003',
    variableCode: 'pluviometrie_mensuelle_mm',
    variableName: 'Cumul pluviométrique mensuel',
    dimension: 'CLIMAT',
    category: 'Météorologie synoptique',
    unit: 'mm / mois',
    sourceId: 'SRC-CLI-001',
    sourceName: 'Station Météorologique METTELSAT Kindu-Aéroport',
    sourceReliability: 'TRES_FIABLE',
    sourceReliabilityCriteria: [
      'Station synoptique homologuée OMM (Organisation Météorologique Mondiale)',
      'Pluviomètres à augets basculeurs et contrôle manuel quotidien',
      'Mesures directes étalonnées'
    ],
    temporalCoverage: {
      firstDateAvailable: '2018-01-01',
      lastDateAvailable: '2026-08-01',
      yearsCovered: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
      missingPeriods: ['2021-04', '2021-05'],
      coverageRatePercent: 98.1,
      precision: 'JOUR'
    },
    spatialCoverage: {
      coveredZonesCount: 18,
      totalZonesCount: 18,
      coveredZonesNames: MANIEMA_18_HEALTH_ZONES.map(z => z.name),
      uncoveredZonesNames: [],
      coverageRatePercent: 100,
      geographicLevel: 'COORDONNEES_GPS'
    },
    completenessScorePercent: 98.1,
    scientificQualityScore: 96,
    signal: 'VERT',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Données climatiques journalières continues de 2018 à 2026.'
    },
    statisticalUsability: {
      usable: 'OUI',
      justification: 'Excellente variable prédictive pour l’analyse des corrélations et décalages temporels (lags).'
    },
    spatialTemporalModelingUsability: {
      usable: 'OUI',
      justification: 'Prête pour toute modélisation dynamique des risques hydriques et vectoriels.'
    },
    biasRisks: {
      hasUrbanOnlyBias: false,
      hasTemporalAsymmetry: false,
      hasDefinitionChange: false,
      hasGeographicRezoning: false,
      isPointInTimeObservation: false,
      warningMessages: [
        'Interruption technique de capteur en avril-mai 2021 (marqué NULL, non 0).'
      ]
    },
    statusDistribution: {
      observedCount: 3120,
      importedCount: 3120,
      estimatedCount: 0,
      proxyCount: 0,
      missingCount: 60,
      zeroMeasuredCount: 420, // Jours sans pluie réellement mesurés à 0
      unknownCount: 0,
      notApplicableCount: 0
    },
    isDemo: true
  },
  {
    id: 'VAR-DIAG-004',
    variableCode: 'presence_zone_dechets',
    variableName: 'Présence de décharges sauvages / amas de déchets',
    dimension: 'ENVIRONNEMENT',
    category: 'Salubrité & Gestion des déchets',
    unit: 'Binaire (OUI/NON)',
    sourceId: 'SRC-ENV-001',
    sourceName: 'Enquêtes environnementales de terrain & Inspection de salubrité',
    sourceReliability: 'ACCEPTABLE',
    sourceReliabilityCriteria: [
      'Inspections visuelles géoréférencées de terrain',
      'Données discontinues selon les campagnes annuelles d’assainissement'
    ],
    temporalCoverage: {
      firstDateAvailable: '2022-03-01',
      lastDateAvailable: '2026-06-30',
      yearsCovered: [2022, 2023, 2024, 2025, 2026],
      missingPeriods: ['2018', '2019', '2020', '2021'],
      coverageRatePercent: 52.0,
      precision: 'MOIS'
    },
    spatialCoverage: {
      coveredZonesCount: 6,
      totalZonesCount: 18,
      coveredZonesNames: ['Kindu', 'Alunguli', 'Kasongo', 'Kibombo', 'Kalima', 'Pangi (Kampene)'],
      uncoveredZonesNames: MANIEMA_18_HEALTH_ZONES.slice(6).map(z => z.name),
      coverageRatePercent: 33.3,
      geographicLevel: 'AIRE_SANTE'
    },
    completenessScorePercent: 42.5,
    scientificQualityScore: 68,
    signal: 'ORANGE',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Utilisable pour la description des zones documentées entre 2022 et 2026.',
      restrictions: 'Restreint aux 6 zones de santé documentées.'
    },
    statisticalUsability: {
      usable: 'PARTIELLEMENT',
      justification: 'Analyse transversale possible par année documentée. Ne pas moyenner sur 2018–2026 sans proxy explicite.'
    },
    spatialTemporalModelingUsability: {
      usable: 'PARTIELLEMENT',
      justification: 'Modélisation possible uniquement sur sous-ensemble 2022–2026 et zones urbaines/semi-urbaines.',
      reasonsForExclusion: [
        'Absence de données environnementales pour 2018–2021',
        'Couverture spatiale limitée à 33.3% des zones de santé'
      ]
    },
    biasRisks: {
      hasUrbanOnlyBias: true,
      hasTemporalAsymmetry: true,
      hasDefinitionChange: false,
      hasGeographicRezoning: false,
      isPointInTimeObservation: true,
      warningMessages: [
        'Biais urbain majeur : enquêtes concentrées sur Kindu, Alunguli et chefs-lieux.',
        'Observation ponctuelle : non représentative automatiquement des années antérieures 2018-2021.'
      ]
    },
    statusDistribution: {
      observedCount: 420,
      importedCount: 0,
      estimatedCount: 0,
      proxyCount: 35,
      missingCount: 510,
      zeroMeasuredCount: 180,
      unknownCount: 40,
      notApplicableCount: 0
    },
    isDemo: true
  },
  {
    id: 'VAR-DIAG-005',
    variableCode: 'gites_larvaires_anopheles',
    variableName: 'Densité de gîtes larvaires positifs à Anopheles',
    dimension: 'ENVIRONNEMENT',
    category: 'Entomologie vectorielle',
    unit: 'Gîtes / km²',
    sourceId: 'SRC-ENV-001',
    sourceName: 'Enquêtes Entomologiques Faculté des Sciences Kindu',
    sourceReliability: 'TRES_FIABLE',
    sourceReliabilityCriteria: [
      'Dipping standardisé selon le protocole OMS',
      'Identification morphologique et PCR des complexes An. gambiae',
      'Géo-référencement GPS de précision'
    ],
    temporalCoverage: {
      firstDateAvailable: '2025-02-01',
      lastDateAvailable: '2026-06-30',
      yearsCovered: [2025, 2026],
      missingPeriods: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      coverageRatePercent: 22.2,
      precision: 'JOUR'
    },
    spatialCoverage: {
      coveredZonesCount: 2,
      totalZonesCount: 18,
      coveredZonesNames: ['Kindu', 'Alunguli'],
      uncoveredZonesNames: MANIEMA_18_HEALTH_ZONES.slice(2).map(z => z.name),
      coverageRatePercent: 11.1,
      geographicLevel: 'COORDONNEES_GPS'
    },
    completenessScorePercent: 22.2,
    scientificQualityScore: 88,
    signal: 'ROUGE',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Excellente qualité descriptive pour les années 2025 et 2026 dans la ville de Kindu.'
    },
    statisticalUsability: {
      usable: 'NON',
      justification: 'Série temporelle trop courte (2 ans) et géographique restreinte (2 zones) pour des inférences provinciales.'
    },
    spatialTemporalModelingUsability: {
      usable: 'NON',
      justification: 'Insuffisant pour la modélisation provinciale 2018-2026. Utilisable uniquement en micro-modèle local Kindu 2025-2026.',
      reasonsForExclusion: [
        'Couverture temporelle inférieure à 3 ans (2025-2026 uniquement)',
        'Couverture géographique limitée à 11.1% (Kindu et Alunguli uniquement)',
        'Observation ponctuelle — interdiction absolue d’extrapolation automatique à 2018-2024'
      ]
    },
    biasRisks: {
      hasUrbanOnlyBias: true,
      hasTemporalAsymmetry: true,
      hasDefinitionChange: false,
      hasGeographicRezoning: false,
      isPointInTimeObservation: true,
      warningMessages: [
        'Observation ponctuelle 2025-2026 — non représentative des années antérieures.',
        'Concentration exclusive sur le milieu urbain de Kindu.'
      ]
    },
    statusDistribution: {
      observedCount: 180,
      importedCount: 0,
      estimatedCount: 0,
      proxyCount: 0,
      missingCount: 810,
      zeroMeasuredCount: 25,
      unknownCount: 10,
      notApplicableCount: 0
    },
    isDemo: true
  },
  {
    id: 'VAR-DIAG-006',
    variableCode: 'acces_eau_potable_pct',
    variableName: 'Taux de ménages avec accès à une source d’eau potable protégée',
    dimension: 'COMMUNAUTAIRE',
    category: 'WASH & Assainissement',
    unit: '%',
    sourceId: 'SRC-COM-001',
    sourceName: 'Enquêtes Ménages One Health & REGIDESO Maniema',
    sourceReliability: 'FIABLE',
    sourceReliabilityCriteria: [
      'Échantillonnage en grappes à deux degrés',
      'Vérification physique des points d’eau (bornes fontaines, forages, puits protégés)'
    ],
    temporalCoverage: {
      firstDateAvailable: '2024-01-01',
      lastDateAvailable: '2026-06-30',
      yearsCovered: [2024, 2025, 2026],
      missingPeriods: ['2018', '2019', '2020', '2021', '2022', '2023'],
      coverageRatePercent: 33.3,
      precision: 'MOIS'
    },
    spatialCoverage: {
      coveredZonesCount: 8,
      totalZonesCount: 18,
      coveredZonesNames: ['Kindu', 'Alunguli', 'Kasongo', 'Kibombo', 'Punia', 'Pangi (Kampene)', 'Kalima', 'Kabambare'],
      uncoveredZonesNames: MANIEMA_18_HEALTH_ZONES.slice(8).map(z => z.name),
      coverageRatePercent: 44.4,
      geographicLevel: 'AIRE_SANTE'
    },
    completenessScorePercent: 38.0,
    scientificQualityScore: 82,
    signal: 'ORANGE',
    descriptiveUsability: {
      usable: 'OUI',
      justification: 'Description fiable des conditions WASH pour la période 2024–2026 dans 8 zones.'
    },
    statisticalUsability: {
      usable: 'PARTIELLEMENT',
      justification: 'Corrélations transversales avec l’incidence de la typhoïde en 2024–2026 valides.'
    },
    spatialTemporalModelingUsability: {
      usable: 'PARTIELLEMENT',
      justification: 'Exclu du modèle global 2018–2026, mais inclus dans le modèle adaptatif typhoïde 2024–2026.',
      reasonsForExclusion: ['Données absentes avant 2024']
    },
    biasRisks: {
      hasUrbanOnlyBias: false,
      hasTemporalAsymmetry: true,
      hasDefinitionChange: false,
      hasGeographicRezoning: false,
      isPointInTimeObservation: true,
      warningMessages: [
        'Non représentatif de l’accès à l’eau avant 2024.'
      ]
    },
    statusDistribution: {
      observedCount: 650,
      importedCount: 0,
      estimatedCount: 0,
      proxyCount: 20,
      missingCount: 890,
      zeroMeasuredCount: 15,
      unknownCount: 30,
      notApplicableCount: 0
    },
    isDemo: true
  }
];

/**
 * 2. HISTORICITÉ DES FACTEURS ENVIRONNEMENTAUX (SCÉNARIO OBLIGATOIRE DU PROMPT)
 * Exemple obligatoire :
 * 2022: Zone de déchets = OUI
 * 2023: Zone de déchets = OUI
 * 2024: Zone de déchets = NON
 * 2025: Construction = OUI
 * 2026: Zone de déchets = NON
 */
export const MOCK_ENVIRONMENTAL_HISTORICITY_V113: EnvironmentalHistoricityRecord[] = [
  // --- SITE OBLIGATOIRE TEST SCENARIO ---
  {
    id: 'ENV-HIST-001',
    siteId: 'SITE-KASUKU-01',
    siteName: 'Ancienne Décharge Kasuku - Av. du Port',
    zoneSanteId: 'ZS-KINDU',
    zoneSanteName: 'Kindu',
    factorCode: 'ZONE_DECHETS',
    factorLabel: 'Présence de décharge sauvage / déchets',
    year: 2022,
    exactDate: '2022-05-14',
    month: 5,
    validFrom: '2022-01-01',
    validTo: '2022-12-31',
    isApproximateDate: false,
    precision: 'MOIS',
    factorState: 'OUI',
    stateDescription: 'Décharge active à ciel ouvert (surface ~450 m²), accumulation de matières plastiques et organiques.',
    observationMethod: 'Inspection environnementale de terrain avec géo-repérage GPS',
    confidenceLevel: 'ELEVE',
    source: 'Rapport d’inspection salubrité DPS Maniema 2022',
    isHistoricalProxy: false,
    isDemo: true
  },
  {
    id: 'ENV-HIST-002',
    siteId: 'SITE-KASUKU-01',
    siteName: 'Ancienne Décharge Kasuku - Av. du Port',
    zoneSanteId: 'ZS-KINDU',
    zoneSanteName: 'Kindu',
    factorCode: 'ZONE_DECHETS',
    factorLabel: 'Présence de décharge sauvage / déchets',
    year: 2023,
    exactDate: '2023-06-20',
    month: 6,
    validFrom: '2023-01-01',
    validTo: '2023-12-31',
    isApproximateDate: false,
    precision: 'MOIS',
    factorState: 'OUI',
    stateDescription: 'Décharge persistante, écoulement d’eaux de lixiviat vers le ravin.',
    observationMethod: 'Inspection semestrielle de suivi environnemental',
    confidenceLevel: 'ELEVE',
    source: 'Faculté des Sciences / Département Écologie Kindu 2023',
    isHistoricalProxy: false,
    isDemo: true
  },
  {
    id: 'ENV-HIST-003',
    siteId: 'SITE-KASUKU-01',
    siteName: 'Ancienne Décharge Kasuku - Av. du Port',
    zoneSanteId: 'ZS-KINDU',
    zoneSanteName: 'Kindu',
    factorCode: 'ZONE_DECHETS',
    factorLabel: 'Présence de décharge sauvage / déchets',
    year: 2024,
    exactDate: '2024-03-10',
    month: 3,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isApproximateDate: false,
    precision: 'MOIS',
    factorState: 'NON',
    stateDescription: 'Décharge évacuée et nivelée suite à la campagne municipale « Salongo » de la Mairie de Kindu.',
    observationMethod: 'Constat visuel de réhabilitation et procès-verbal municipal',
    confidenceLevel: 'ELEVE',
    source: 'Service d’Assainissement Mairie de Kindu 2024',
    isHistoricalProxy: false,
    isDemo: true
  },
  {
    id: 'ENV-HIST-004',
    siteId: 'SITE-KASUKU-01',
    siteName: 'Ancienne Décharge Kasuku - Av. du Port',
    zoneSanteId: 'ZS-KINDU',
    zoneSanteName: 'Kindu',
    factorCode: 'CONSTRUCTION',
    factorLabel: 'Bâtiment / Construction permanente',
    year: 2025,
    exactDate: '2025-08-15',
    month: 8,
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    isApproximateDate: false,
    precision: 'MOIS',
    factorState: 'OUI',
    stateDescription: 'Édification d’un bâtiment commercial en dur et clôture en maçonnerie sur l’ancien site de décharge.',
    observationMethod: 'Levé cadastral et enquête de terrain One Health',
    confidenceLevel: 'ELEVE',
    source: 'Cadastre urbain Kindu / Projet One Health 2025',
    isHistoricalProxy: false,
    isDemo: true
  },
  {
    id: 'ENV-HIST-005',
    siteId: 'SITE-KASUKU-01',
    siteName: 'Ancienne Décharge Kasuku - Av. du Port',
    zoneSanteId: 'ZS-KINDU',
    zoneSanteName: 'Kindu',
    factorCode: 'ZONE_DECHETS',
    factorLabel: 'Présence de décharge sauvage / déchets',
    year: 2026,
    exactDate: '2026-04-18',
    month: 4,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    isApproximateDate: false,
    precision: 'MOIS',
    factorState: 'NON',
    stateDescription: 'Site entièrement bâti et entretenu. Absence totale de décharge sauvage.',
    observationMethod: 'Surveillance entomologique et cartographie SIG haute résolution',
    confidenceLevel: 'ELEVE',
    source: 'Enquête SIG One Health Maniema 2026',
    isHistoricalProxy: false,
    isDemo: true
  },

  // --- SITE 2 : Eaux stagnantes Alunguli (Validité temporelle restreinte) ---
  {
    id: 'ENV-HIST-006',
    siteId: 'SITE-ALUNGULI-BAS',
    siteName: 'Bas-fond inondable Alunguli Gare',
    zoneSanteId: 'ZS-ALUNGULI',
    zoneSanteName: 'Alunguli',
    factorCode: 'EAU_STAGNANTE',
    factorLabel: 'Eaux stagnantes / Gîtes anophéliens',
    year: 2024,
    exactDate: '2024-01-15',
    month: 1,
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    isApproximateDate: false,
    precision: 'TRIMESTRE',
    factorState: 'OUI',
    stateDescription: 'Mares d’eau temporaires post-crues du fleuve Congo, fortes densités larvaires anophéliennes.',
    observationMethod: 'Prospection entomologique dipping standard',
    confidenceLevel: 'ELEVE',
    source: 'Faculté des Sciences Kindu 2024',
    isHistoricalProxy: false,
    isDemo: true
  },
  {
    id: 'ENV-HIST-007',
    siteId: 'SITE-ALUNGULI-BAS',
    siteName: 'Bas-fond inondable Alunguli Gare',
    zoneSanteId: 'ZS-ALUNGULI',
    zoneSanteName: 'Alunguli',
    factorCode: 'EAU_STAGNANTE',
    factorLabel: 'Eaux stagnantes / Gîtes anophéliens',
    year: 2024,
    exactDate: '2024-07-20',
    month: 7,
    validFrom: '2024-06-01',
    validTo: '2024-08-31',
    isApproximateDate: false,
    precision: 'TRIMESTRE',
    factorState: 'NON',
    stateDescription: 'Assèchement complet du bas-fond durant la saison sèche.',
    observationMethod: 'Contrôle saisonnier de terrain',
    confidenceLevel: 'ELEVE',
    source: 'Faculté des Sciences Kindu 2024',
    isHistoricalProxy: false,
    isDemo: true
  }
];

/**
 * 3. PROXIES HISTORIQUES AVEC JUSTIFICATION SCIENTIFIQUE OBLIGATOIRE
 */
export const MOCK_HISTORICAL_PROXIES_V113: HistoricalProxyDeclaration[] = [
  {
    id: 'PRX-001',
    variableCode: 'presence_zone_dechets',
    variableName: 'Présence de décharges sauvages',
    siteOrZoneId: 'ZS-KASONGO',
    siteOrZoneName: 'Zone de Santé de Kasongo',
    sourceObservationYear: 2026,
    targetProxyYear: 2025,
    sourceValue: 'OUI',
    confidenceLevel: 'MODERE',
    scientificJustification: 'La structure spatiale et l’absence de service de voirie municipale à Kasongo sont restées stables entre 2025 et 2026 selon les rapports des chefs de quartier.',
    declaredBy: 'Dr. Mukendi (Épidémiologiste)',
    declaredAt: '2026-08-28 10:15',
    status: 'VALIDE',
    peerReviewNotes: 'Validé pour analyse de sensibilité Modèle C, mais exclu du Modèle A de référence.'
  },
  {
    id: 'PRX-002',
    variableCode: 'acces_eau_potable_pct',
    variableName: 'Accès eau potable protégée',
    siteOrZoneId: 'ZS-PANGI',
    siteOrZoneName: 'Zone de Santé de Pangi (Kampene)',
    sourceObservationYear: 2025,
    targetProxyYear: 2024,
    sourceValue: 32.5,
    confidenceLevel: 'FAIBLE',
    scientificJustification: 'Le réseau gravitaire communautaire installé fin 2023 n’a pas connu d’extension en 2024-2025.',
    declaredBy: 'Ing. Kasongo (Hydrologue)',
    declaredAt: '2026-08-28 11:30',
    status: 'VALIDE',
    peerReviewNotes: 'Réservé aux analyses exploratoires avec mention explicite du niveau de confiance faible.'
  }
];

/**
 * 4. ALERTES DE CHANGEMENT DE DÉFINITION DE CAS
 */
export const MOCK_CASE_DEFINITION_SHIFTS_V113: CaseDefinitionShiftAlert[] = [
  {
    id: 'DEF-SHIFT-001',
    pathologyCode: 'PALUDISME',
    pathologyName: 'Paludisme (Malaria)',
    periodStart: '2018',
    periodEnd: '2021',
    formerDefinition: 'Cas clinique présumé basé sur fièvre/céphalées sans test biologique obligatoire',
    newDefinition: 'Cas confirmé obligatoirement par Test de Diagnostic Rapide (TDR) ou Goutte Épaisse (Microscopie)',
    yearOfShift: 2022,
    impactOnTrendAnalysis: 'Baisse artificielle de l’incidence apparente de 28% en 2022 due à l’élimination des faux positifs cliniques.',
    warningNotice: 'NE PAS interpréter la baisse 2021->2022 comme un succès d’intervention sans ajustement méthodologique.'
  },
  {
    id: 'DEF-SHIFT-002',
    pathologyCode: 'FIEVRE_TYPHOIDE',
    pathologyName: 'Fièvre typhoïde',
    periodStart: '2018',
    periodEnd: '2022',
    formerDefinition: 'Diagnostic sérologique par Test de Widal-Félix (forte réactivité croisée)',
    newDefinition: 'Hémoculture positive ou TDR spécifique IgM / Tubidimétrie standardisée',
    yearOfShift: 2023,
    impactOnTrendAnalysis: 'Réduction des cas rapportés de 45% suite à l’abandon progressif du test de Widal non spécifique.',
    warningNotice: 'Les données 2018–2022 ne sont pas directement comparables en valeur absolue avec 2023–2026.'
  }
];

/**
 * 5. ALERTES DE CHANGEMENT DE DÉCOUPAGE GÉOGRAPHIQUE
 */
export const MOCK_GEOGRAPHIC_BOUNDARY_SHIFTS_V113: GeographicBoundaryShiftAlert[] = [
  {
    id: 'GEO-SHIFT-001',
    zoneSanteCode: 'ZS-KINDU-HIST',
    zoneSanteName: 'Ancienne Zone Unique de Kindu (2018-2020)',
    yearOfShift: 2021,
    formerBoundaryDescription: 'Zone sanitaire unique englobant les deux rives du fleuve Congo (Kindu Rive Droite et Rive Gauche).',
    newBoundaryDescription: 'Scission officielle en deux Zones de Santé distinctes : Kindu (Rive Droite) et Alunguli (Rive Gauche).',
    affectedAiresSante: ['Alunguli 1', 'Alunguli 2', 'Gare', 'Kimbombo', 'Bas-Congo', 'Kasuku', 'Maniema'],
    recommendation: 'Pour les analyses temporelles 2018–2026, agréger Kindu et Alunguli ou analyser séparément à partir de 2021. Ne pas fusionner silencieusement.'
  }
];

/**
 * 6. JOURNAL DES TRANSFORMATIONS DES DONNÉES (AUDIT TRAIL)
 */
export const MOCK_DATA_TRANSFORMATION_LOGS_V113: DataTransformationLogEntry[] = [
  {
    id: 'LOG-TRF-001',
    timestamp: '2026-08-28 09:12:00',
    sourceDatasetId: 'RAW-IMP-001',
    originalVariable: 'pluie_journaliere_mm',
    transformationType: 'AGREGATION_MENSUELLE',
    transformationDescription: 'Somme mensuelle des précipitations journalières par station',
    scientificJustification: 'Harmonisation temporelle avec la résolution mensuelle des cas de paludisme FOSA',
    resultVariable: 'pluviometrie_mensuelle_mm',
    recordsAffectedCount: 3120,
    performedBy: 'Pipeline ETL Automatisé V1.12'
  },
  {
    id: 'LOG-TRF-002',
    timestamp: '2026-08-28 09:14:30',
    sourceDatasetId: 'RAW-IMP-002',
    originalVariable: 'dechets_terrain_2026',
    transformationType: 'DECLARATION_PROXY',
    transformationDescription: 'Attribution de la valeur 2026 comme proxy pour 2025 sur Kasongo',
    scientificJustification: 'Stabilité documentée du site de dépôt selon le chef de quartier Kasongo-Centre',
    resultVariable: 'presence_zone_dechets_proxy2025',
    recordsAffectedCount: 1,
    performedBy: 'Dr. Mukendi (Épidémiologiste)'
  },
  {
    id: 'LOG-TRF-003',
    timestamp: '2026-08-28 09:15:00',
    sourceDatasetId: 'RAW-IMP-001',
    originalVariable: 'palu_cases_missing',
    transformationType: 'IMPUTATION_NULL_STRICT',
    transformationDescription: 'Maintien strict de la valeur NULL pour les mois sans rapport FOSA (exclusion de la conversion à 0)',
    scientificJustification: 'Règle absolue V1.12/V1.13 : Donnée absente != Zéro mesuré',
    resultVariable: 'cas_paludisme_mensuels',
    recordsAffectedCount: 68,
    performedBy: 'Système Intégrité Scientifique'
  },
  {
    id: 'LOG-TRF-004',
    timestamp: '2026-08-28 09:16:20',
    sourceDatasetId: 'CLEAN-DS-001',
    originalVariable: 'gites_larvaires_anopheles',
    transformationType: 'EXCLUSION_MODELE',
    transformationDescription: 'Exclusion automatique de la variable du modèle spatio-temporel provincial 2018-2026',
    scientificJustification: 'Couverture temporelle insuffisante (2025-2026 uniquement) et biais urbain Kindu',
    resultVariable: 'gites_larvaires_exclus_modele_global',
    recordsAffectedCount: 180,
    performedBy: 'Module Diagnostic Scientifique V1.13'
  }
];

/**
 * 7. CONFIGURATIONS DE DATASETS ANALYTIQUES ADAPTATIFS
 */
export const MOCK_ADAPTIVE_DATASET_CONFIGS_V113: AdaptiveAnalyticalDatasetConfig[] = [
  {
    id: 'DS-ADAPT-PALU-2020-2026',
    name: 'Dataset Adaptatif Paludisme & Climat (2020–2026)',
    targetPathology: 'Paludisme',
    timeRange: {
      startYear: 2020,
      endYear: 2026
    },
    includedVariables: [
      { variableCode: 'cas_paludisme_mensuels', variableName: 'Incidence paludisme', dimension: 'SANTE', isProxyIncluded: false, coveragePct: 97.2 },
      { variableCode: 'pluviometrie_mensuelle_mm', variableName: 'Pluviométrie mensuelle', dimension: 'CLIMAT', isProxyIncluded: false, coveragePct: 98.5 },
      { variableCode: 'temperature_moyenne_c', variableName: 'Température moyenne', dimension: 'CLIMAT', isProxyIncluded: false, coveragePct: 96.0 },
      { variableCode: 'humidite_relative_pct', variableName: 'Humidité relative', dimension: 'CLIMAT', isProxyIncluded: false, coveragePct: 94.8 }
    ],
    excludedVariables: [
      { variableCode: 'gites_larvaires_anopheles', variableName: 'Gîtes larvaires anophéliens', dimension: 'ENVIRONNEMENT', reasonForExclusion: 'Données absentes avant 2025 et restreintes à Kindu/Alunguli.' },
      { variableCode: 'presence_zone_dechets', variableName: 'Décharges sauvages', dimension: 'ENVIRONNEMENT', reasonForExclusion: 'Couverture géographique trop faible sur l’ensemble des 18 zones.' }
    ],
    status: 'PRET_POUR_ANALYSE',
    signal: 'VERT',
    totalRecordsCount: 1512,
    notes: 'Dataset optimisé pour la modélisation des décalages temporels (lags climatiques 1 à 3 mois) et séries chronologiques SARIMA.',
    createdAt: '2026-08-28'
  },
  {
    id: 'DS-ADAPT-TYPH-2022-2026',
    name: 'Dataset Adaptatif Fièvre Typhoïde & Facteurs Hydriques (2022–2026)',
    targetPathology: 'Fièvre typhoïde',
    timeRange: {
      startYear: 2022,
      endYear: 2026
    },
    includedVariables: [
      { variableCode: 'cas_typhoide_mensuels', variableName: 'Cas typhoïde confirmés', dimension: 'SANTE', isProxyIncluded: false, coveragePct: 88.4 },
      { variableCode: 'pluviometrie_mensuelle_mm', variableName: 'Précipitations', dimension: 'CLIMAT', isProxyIncluded: false, coveragePct: 98.5 },
      { variableCode: 'acces_eau_potable_pct', variableName: 'Accès eau potable', dimension: 'COMMUNAUTAIRE', isProxyIncluded: true, coveragePct: 75.0 },
      { variableCode: 'presence_zone_dechets', variableName: 'Décharges & Insalubrité', dimension: 'ENVIRONNEMENT', isProxyIncluded: true, coveragePct: 68.2 }
    ],
    excludedVariables: [
      { variableCode: 'qualite_microbiologique_eau', variableName: 'E. coli dans les forages', dimension: 'ENVIRONNEMENT', reasonForExclusion: 'Non mesuré systématiquement (lacune critique identifiée).' }
    ],
    status: 'RESTRICTIONS',
    signal: 'ORANGE',
    totalRecordsCount: 780,
    notes: 'Inclusion de proxies historiques justifiés pour les variables environnementales. Nécessite une analyse de sensibilité.',
    createdAt: '2026-08-28'
  }
];

/**
 * 8. COMPARAISON DE MODÈLES DE SENSIBILITÉ (A / B / C)
 */
export const MOCK_SENSITIVITY_COMPARISONS_V113: SensitivityModelComparison = {
  id: 'SENS-COMP-001',
  pathology: 'Fièvre typhoïde (Maniema)',
  period: '2022–2026 (14 Zones documentées)',
  modelA_Complete: {
    name: 'Modèle A — Données Réelles Complètes',
    description: 'Modèle n’utilisant strictement que les observations directes vérifiées (aucun proxy).',
    variablesCount: 3,
    rSquaredOrFitScore: 0.64,
    keyFindings: 'La pluviométrie forte (+2 mois) est significativement associée à la hausse des cas (p < 0.001).'
  },
  modelB_NoEnvironmental: {
    name: 'Modèle B — Sans Variables Environnementales',
    description: 'Modèle restreint aux seules variables climatiques et sanitaires (exclusion totale des déchets et eau).',
    variablesCount: 2,
    rSquaredOrFitScore: 0.51,
    deviationFromModelA: 'Perte de 13% de pouvoir explicatif (R² passe de 0.64 à 0.51).',
    keyFindings: 'Sous-estimation de l’effet d’accumulation du risque dans les quartiers denses non assainis.'
  },
  modelC_WithProxies: {
    name: 'Modèle C — Avec Variables Proxies Incluses',
    description: 'Modèle intégrant les estimations et proxies historiques validés avec justification scientifique.',
    variablesCount: 5,
    rSquaredOrFitScore: 0.72,
    deviationFromModelA: 'Gain de 8% de variance expliquée par rapport au Modèle A.',
    keyFindings: 'Confirmation de la synergie Pluie × Décharges × Eau non protégée, avec intervalles de confiance légèrement élargis.'
  },
  scientificConclusion: 'L’inclusion des proxies environnementaux stabilise les coefficients de risque sans altérer la direction des effets. Recommandation : présenter le Modèle A en résultat primaire et le Modèle C en analyse de sensibilité de robustesse.'
};

/**
 * 9. RÉPONSES STRUCTURÉES AUX 10 QUESTIONS SCIENTIFIQUES FONDAMENTALES
 */
export const MOCK_SCIENTIFIC_QUESTIONS_V113: ScientificQuestionAnswer[] = [
  {
    questionNumber: 1,
    question: 'Quelles données avons-nous ?',
    shortSummary: 'Données sanitaires FOSA/DHIS2, relevés météorologiques METTELSAT, enquêtes entomologiques, enquêtes ménages WASH et SIG.',
    details: [
      'Données sanitaires : 6 pathologies (Paludisme, Fièvre typhoïde, Choléra, Mpox, IRA, Diarrhées).',
      'Données climatiques : Pluviométrie (mm), Températures min/max/moyenne (°C), Humidité relative (%), Vitesse du vent.',
      'Données environnementales : Gîtes larvaires Anopheles, Décharges de déchets, Points d’eau stagnante.',
      'Données communautaires & SIG : Enquêtes ménages, coordonnées GPS des 18 zones et 142 aires de santé.'
    ],
    metrics: { 'Sources actives': 6, 'Variables cataloguées': 38, 'Enregistrements consolidés': 18450 },
    statusSignal: 'VERT',
    scientificRecommendations: ['Consolider la régularité des données environnementales de terrain.']
  },
  {
    questionNumber: 2,
    question: 'Pour quelles années ?',
    shortSummary: 'Couverture globale de 2018 à 2026 (9 années), avec disparités selon les dimensions One Health.',
    details: [
      '2018–2026 (100% couverture) : Paludisme et Pluviométrie synoptique.',
      '2020–2026 (78% couverture) : Fièvre typhoïde, Températures et Humidité relative.',
      '2022–2026 (56% couverture) : Déchets et Salubrité urbaine.',
      '2025–2026 (22% couverture) : Enquêtes entomologiques de gîtes larvaires (Strictement ponctuelles).'
    ],
    metrics: { 'Période totale': '2018–2026 (9 ans)', 'Années complètes santé': 9, 'Années complètes env': 2 },
    statusSignal: 'VERT',
    scientificRecommendations: ['Ne jamais projeter les observations 2025-2026 sur la période 2018-2024 sans proxy explicite.']
  },
  {
    questionNumber: 3,
    question: 'Pour quelles zones ?',
    shortSummary: '18 Zones de santé du Maniema couvertes pour la santé et le climat; concentration urbaine pour l’environnement.',
    details: [
      '18 zones sur 18 (100%) : Surveillance épidémiologique du paludisme et modèle climatique provincial.',
      '14 zones sur 18 (77.8%) : Surveillance de la fièvre typhoïde.',
      '6 zones sur 18 (33.3%) : Données de salubrité et décharges.',
      '2 zones sur 18 (11.1%) : Inspections entomologiques larvaires (Kindu et Alunguli).'
    ],
    metrics: { 'Zones totales': 18, 'Couverture santé': '100%', 'Couverture env': '33.3%' },
    statusSignal: 'ORANGE',
    scientificRecommendations: ['Étendre les enquêtes environnementales aux zones sanitaires rurales (Punia, Kasongo, Kabambare).']
  },
  {
    questionNumber: 4,
    question: 'Pour quelles pathologies ?',
    shortSummary: 'Paludisme (Excellente disponibilité), Fièvre typhoïde (Bonne), Choléra & Mpox (Épidémique/Partiel).',
    details: [
      'Paludisme : Données mensuelles 2018–2026 continues dans les 18 zones.',
      'Fièvre typhoïde : Données mensuelles 2020–2026 dans 14 zones.',
      'Choléra : Relevés épidémiques événementiels (flambées documentées le long du fleuve).',
      'Mpox : Données de surveillance renforcée disponibles 2023–2026.'
    ],
    metrics: { 'Paludisme': '96.5% complétude', 'Typhoïde': '84.2% complétude', 'Choléra/Mpox': 'Séries événementielles' },
    statusSignal: 'VERT',
    scientificRecommendations: ['Modéliser le paludisme et la typhoïde en priorité; traiter le choléra en modèle d’alerte précoce.']
  },
  {
    questionNumber: 5,
    question: 'Quelle est leur qualité ?',
    shortSummary: 'Score de qualité scientifique global de 86/100, avec une traçabilité complète et intégrité RAW scellée.',
    details: [
      'Sources certifiées : DPS Maniema, METTELSAT Kindu, Université de Kindu.',
      'Précision spatiale : GPS vérifié pour 92.4% des observations de terrain.',
      'Règle stricte : Donnée absente maintenue en NULL (zéro faux éliminé).',
      'Contrôle de cohérence : Aucune valeur hors limites (températures, coordonnées Maniema).'
    ],
    metrics: { 'Score Qualité': '86 / 100', 'Fiabilité des sources': 'Très bonne', 'GPS validés': '92.4%' },
    statusSignal: 'VERT',
    scientificRecommendations: ['Maintenir le protocole de vérification d’intégrité à chaque import.']
  },
  {
    questionNumber: 6,
    question: 'Quelles sont les lacunes ?',
    shortSummary: '3 Lacunes majeures : Absence de données env. avant 2022, qualité microbienne de l’eau non testée, 4 zones rurales sous-documentées en labo.',
    details: [
      'Lacune 1 : Absence de séries environnementales continues 2018–2021.',
      'Lacune 2 : Analyse microbiologique de l’eau (E. coli, coliformes fécaux) non disponible en routine.',
      'Lacune 3 : Coordonnées GPS absentes pour 7.6% des structures sanitaires secondaires reculées.',
      'Lacune 4 : Interruption de capteur météo en avril–mai 2021 (marqué NULL).'
    ],
    metrics: { 'Lacunes critiques': 3, 'Zones sans labo confirmé': 4, 'Variables manquantes clés': 2 },
    statusSignal: 'ORANGE',
    scientificRecommendations: ['Prioriser un plan d’échantillonnage de la qualité de l’eau dans les 18 zones.']
  },
  {
    questionNumber: 7,
    question: 'Quelles variables peuvent être utilisées pour la modélisation ?',
    shortSummary: 'Paludisme, Fièvre typhoïde, Pluviométrie, Température moyenne, Humidité relative et Relief/Altitude.',
    details: [
      'Incidence du paludisme 2018–2026 (avec prise en compte du changement de définition 2022).',
      'Incidence de la typhoïde 2020–2026 sur les 14 zones documentées.',
      'Cumul pluviométrique mensuel METTELSAT (2018–2026).',
      'Températures et humidité relative (2020–2026).',
      'Variables géographiques statiques : Altitude MNT, densité de population, hydrographie.'
    ],
    metrics: { 'Variables modélisables sans restriction': 6, 'Horizon temporel optimal': '2020–2026' },
    statusSignal: 'VERT',
    scientificRecommendations: ['Utiliser les modèles additifs généralisés (GAM) et GLMM spatio-temporels.']
  },
  {
    questionNumber: 8,
    question: 'Quelles variables doivent être utilisées avec prudence ?',
    shortSummary: 'Décharges sauvages, Eaux stagnantes temporaires, Définition de cas pré-2022 et Découpage Kindu/Alunguli.',
    details: [
      'Déchets et salubrité : utilisables uniquement avec restriction spatiale (6 zones) ou proxies justifiés.',
      'Paludisme 2018–2021 : présence de biais de classification clinique (sur-déclaration présumée).',
      'Fièvre typhoïde 2018–2022 : forte proportion de sérologies Widal non spécifiques.',
      'Zone sanitaire de Kindu : scission 2021 nécessitant une harmonisation géographique explicite.'
    ],
    metrics: { 'Variables sous restriction': 4, 'Biais identifiés': 3 },
    statusSignal: 'ORANGE',
    scientificRecommendations: ['Toujours exécuter une analyse de sensibilité (Modèle A vs Modèle C) pour ces variables.']
  },
  {
    questionNumber: 9,
    question: 'Quelles variables sont insuffisantes ?',
    shortSummary: 'Gîtes larvaires anophéliens (pour modèle provincial), Qualité microbienne de l’eau et Résistance aux insecticides.',
    details: [
      'Gîtes larvaires : Restreints à Kindu/Alunguli 2025–2026 -> EXCLUS du modèle macro-provincial 2018–2026.',
      'Qualité microbiologique de l’eau : non échantillonnée de manière standardisée -> NON MODÉLISABLE.',
      'Bio-essais de résistance vectorielle : données sporadiques -> NON MODÉLISABLE à l’échelle du Maniema.'
    ],
    metrics: { 'Variables exclues d’office': 3, 'Raison principale': 'Couverture spatio-temporelle insuffisante' },
    statusSignal: 'ROUGE',
    scientificRecommendations: ['Maintenir ces variables en base descriptive sans les forcer dans les régressions globales.']
  },
  {
    questionNumber: 10,
    question: 'Quelle partie du risque peut réellement être cartographiée avec les données disponibles ?',
    shortSummary: 'Le risque éco-épidémiologique complet est cartographiable sur Kindu et Alunguli; le risque hydro-climatique sur les 18 zones.',
    details: [
      'Cartographie provinciale globale (18 zones) : Risque hydro-climatique et incidence brute (Paludisme & Typhoïde).',
      'Cartographie haute résolution micro-locale (Kindu & Alunguli) : Risque One Health intégré (Vecteurs + Déchets + Crues + Cas FOSA).',
      'Historique cartographique : Les cartes 2022 affichent la situation 2022; les cartes 2026 affichent la situation 2026 sans écrasement rétroactif.'
    ],
    metrics: { 'Couverture risque macro (18 ZS)': '100%', 'Couverture risque micro-local': 'Kindu urbain', 'Intégrité temporelle': '100%' },
    statusSignal: 'VERT',
    scientificRecommendations: ['Toujours apposer sur les cartes la légende mentionnant la date des observations et les éventuels proxies.']
  }
];

/**
 * 10. SUITE DE TESTS SCIENTIFIQUES V1.13 & NON-RÉGRESSION
 */
export const INITIAL_V113_VALIDATION_TESTS: V113ValidationTest[] = [
  {
    id: 1,
    code: 'TEST-01-COMPLETES',
    title: 'TEST 1 — Données complètes (2018–2026)',
    category: 'DONNEES_COMPLETES',
    status: 'PASSED',
    expectedBehavior: 'Identifier et valider la série continue 2018–2026 pour le paludisme et la pluviométrie.',
    actualResult: 'Paludisme (96.5%) et Pluviométrie (98.1%) détectés comme séries continues complètes 2018–2026.',
    verifiedAt: '2026-08-28 14:00'
  },
  {
    id: 2,
    code: 'TEST-02-PARTIELLES',
    title: 'TEST 2 — Données partielles (2022–2026)',
    category: 'DONNEES_PARTIELLES',
    status: 'PASSED',
    expectedBehavior: 'Signaler la disponibilité partielle de la typhoïde et des déchets entre 2022 et 2026 avec badge orange.',
    actualResult: 'Disponibilité 2022–2026 détectée; signal ORANGE et proposition de dataset adaptatif.',
    verifiedAt: '2026-08-28 14:02'
  },
  {
    id: 3,
    code: 'TEST-03-PONCTUELLES',
    title: 'TEST 3 — Données ponctuelles (Environnement 2026 uniquement)',
    category: 'DONNEES_PONCTUELLES',
    status: 'PASSED',
    expectedBehavior: 'Afficher « Observation ponctuelle — non représentative automatiquement des années antérieures ».',
    actualResult: 'Alerte ponctuelle active sur les gîtes larvaires 2025–2026; interdiction d’extrapolation rétroactive validée.',
    verifiedAt: '2026-08-28 14:04'
  },
  {
    id: 4,
    code: 'TEST-04-MANQUANTES',
    title: 'TEST 4 — Données manquantes (Années/Périodes absentes)',
    category: 'DONNEES_MANQUANTES',
    status: 'PASSED',
    expectedBehavior: 'Conserver strictement NULL pour les mois/années absents sans convertir à 0.',
    actualResult: '68 mois manquants sanitaires et avril-mai 2021 météo conservés en NULL strict.',
    verifiedAt: '2026-08-28 14:06'
  },
  {
    id: 5,
    code: 'TEST-05-VALEUR-ZERO',
    title: 'TEST 5 — Valeur zéro (Phénomène réellement mesuré à 0)',
    category: 'VALEUR_ZERO',
    status: 'PASSED',
    expectedBehavior: 'Distinguer une mesure réelle de 0 mm de pluie ou 0 cas d’une absence de relevé.',
    actualResult: '420 jours de pluie mesurés à 0 mm encodés avec statut « DONNEE_OBSERVEE (Valeur 0) » distinct de NULL.',
    verifiedAt: '2026-08-28 14:08'
  },
  {
    id: 6,
    code: 'TEST-06-INCONNUE',
    title: 'TEST 6 — Valeur inconnue vs Non applicable',
    category: 'VALEUR_INCONNUE',
    status: 'PASSED',
    expectedBehavior: 'Distinguer statut DONNEE_INCONNUE (?) de DONNEE_NON_APPLICABLE.',
    actualResult: 'Variables d’eaux stagnantes non inspectées classées en DONNEE_INCONNUE (?); filtres N/A distincts.',
    verifiedAt: '2026-08-28 14:10'
  },
  {
    id: 7,
    code: 'TEST-07-HISTORICITE-ENV',
    title: 'TEST 7 — Historique environnemental (Déchets 2022–2026, 5 états)',
    category: 'HISTORICITE_ENV',
    status: 'PASSED',
    expectedBehavior: 'Conserver les 5 états distincts : 2022=OUI, 2023=OUI, 2024=NON, 2025=CONSTRUCTION, 2026=NON.',
    actualResult: 'Les 5 états chronologiques du site Kasuku sont fidèlement conservés sans écrasement rétrospectif.',
    verifiedAt: '2026-08-28 14:12'
  },
  {
    id: 8,
    code: 'TEST-08-PROXY',
    title: 'TEST 8 — Proxy historique (Déclaration explicite + Justification)',
    category: 'PROXY_HISTORIQUE',
    status: 'PASSED',
    expectedBehavior: 'Exiger la saisie d’une justification scientifique et étiqueter « DONNEE_PROXY » avec confiance.',
    actualResult: 'Proxy PRX-001 validé avec justification obligatoire « Stabilité spatiale » et confiance Modérée.',
    verifiedAt: '2026-08-28 14:14'
  },
  {
    id: 9,
    code: 'TEST-09-DEFINITION-SHIFT',
    title: 'TEST 9 — Changement de définition (Cas clinique vs Confirmé)',
    category: 'CHANGEMENT_DEFINITION',
    status: 'PASSED',
    expectedBehavior: 'Avertir lors de l’analyse temporelle de la transition 2022 (Clinique 2018–2021 vs TDR 2022–2026).',
    actualResult: 'Alerte épidémiologique DEF-SHIFT-001 affichée sur la courbe de tendance temporelle.',
    verifiedAt: '2026-08-28 14:16'
  },
  {
    id: 10,
    code: 'TEST-10-REZONING',
    title: 'TEST 10 — Changement géographique (Scission Kindu/Alunguli 2021)',
    category: 'CHANGEMENT_GEOGRAPHIQUE',
    status: 'PASSED',
    expectedBehavior: 'Conserver l’ancien découpage sans fusionner automatiquement les entités.',
    actualResult: 'Ancien découpage sanitaire Kindu 2018–2020 préservé avec avertissement méthodologique.',
    verifiedAt: '2026-08-28 14:18'
  },
  {
    id: 11,
    code: 'TEST-11-NON-REGRESSION',
    title: 'TEST 11 — Non-régression V1.0 à V1.12',
    category: 'NON_REGRESSION_V1_V12',
    status: 'PASSED',
    expectedBehavior: 'Garantir le bon fonctionnement de tous les modules antérieurs (Enquêtes, Supervision, Imports RAW, etc.).',
    actualResult: 'Tous les modules V1.0 à V1.12 restent opérationnels et intègres.',
    verifiedAt: '2026-08-28 14:20'
  }
];
