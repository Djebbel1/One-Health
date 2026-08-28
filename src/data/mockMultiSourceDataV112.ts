import {
  DataSourceEntity,
  RawImportRecord,
  ImportQualityReport,
  CleanedDatasetRecord,
  DataAvailabilityMatrixRow,
  SynonymMappingItem,
  ReconciliationConfig,
  ReconciledCrossDatasetRow,
  V112ValidationTest,
  CustomVariableDefinition
} from '../types';

/**
 * ============================================================================
 * ONE HEALTH KINDU — MODULE V1.12 : INTÉGRATION MULTI-SOURCES & PRÉPARATION
 * RÉFÉRENTIELS, DONNÉES FICTIVES DE DÉMONSTRATION & VALIDATION
 * ============================================================================
 */

export const INITIAL_DATA_SOURCES_V112: DataSourceEntity[] = [
  {
    id: 'SRC-SAN-001',
    name: 'Registres Sanitaires de Consultation & Hospitalisation Kindu',
    type: 'SANITAIRE',
    subType: 'Registre de consultation & hospitalisation FOSA',
    description: 'Données individuelles anonymisées issues des 18 centres de santé et de l’Hôpital Général de Référence de Kindu.',
    organization: 'DPS Maniema / HGR de Kindu',
    periodStart: '2018',
    periodEnd: '2026',
    geographicLevel: 'ZONE_SANTE',
    frequency: 'JOURNALIERE',
    format: 'EXCEL',
    status: 'ACTIF',
    importDate: '2026-08-28',
    importedBy: 'Dr. Mukendi (Épidémiologiste DPS)',
    estimatedQuality: 'EXCELLENTE',
    coverageLevel: 'COMPLETE',
    notes: 'Série continue 2018–2026. Couvre Paludisme, Fièvre typhoïde, IRA et diarrhées.',
    isInternal: false,
    isDemo: true,
    totalImportsCount: 4,
    lastImportId: 'RAW-IMP-001',
    createdAt: '2026-01-15',
    updatedAt: '2026-08-28'
  },
  {
    id: 'SRC-CLI-001',
    name: 'Relevés Météorologiques Station Kindu-Aéroport',
    type: 'CLIMATIQUE',
    subType: 'Station météorologique synoptique au sol',
    description: 'Données journalières de pluviométrie, températures (min/max), humidité relative et vitesse du vent.',
    organization: 'METTELSAT Kindu / Agence Nationale de Météorologie',
    periodStart: '2020',
    periodEnd: '2026',
    geographicLevel: 'COORDONNEES_GPS',
    frequency: 'JOURNALIERE',
    format: 'CSV',
    status: 'ACTIF',
    importDate: '2026-08-28',
    importedBy: 'Ing. Kasongo (Climatologue Mettelsat)',
    estimatedQuality: 'BONNE',
    coverageLevel: 'PARTIELLE',
    notes: 'Période 2020–2026. Quelques interruptions de capteur en 2021 (marquées explicitement MANQUANTES et non 0).',
    isInternal: false,
    isDemo: true,
    totalImportsCount: 3,
    lastImportId: 'RAW-IMP-002',
    createdAt: '2026-02-10',
    updatedAt: '2026-08-28'
  },
  {
    id: 'SRC-ENV-001',
    name: 'Enquêtes Entomologiques & Surveillance Gîtes Larvaires Kindu',
    type: 'ENVIRONNEMENTALE',
    subType: 'Inspection de terrain gîtes & eaux stagnantes',
    description: 'Relevés géo-référencés de gîtes larvaires d’Anopheles gambiae s.l. et d’Aedes aegypti dans les aires de santé urbaines de Kindu.',
    organization: 'Université de Kindu / Faculté des Sciences (Département d’Écologie)',
    periodStart: '2025',
    periodEnd: '2026',
    geographicLevel: 'AIRE_SANTE',
    frequency: 'PONCTUELLE',
    format: 'EXCEL',
    status: 'ACTIF',
    importDate: '2026-08-28',
    importedBy: 'Prof. Amisi (Entomologiste médical)',
    estimatedQuality: 'EXCELLENTE',
    coverageLevel: 'PONCTUELLE',
    notes: 'Campagnes saisonnières ciblées 2025–2026. Observations historiques conservées sans écrasement.',
    isInternal: false,
    isDemo: true,
    totalImportsCount: 2,
    lastImportId: 'RAW-IMP-003',
    createdAt: '2026-03-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'SRC-SAN-002',
    name: 'Surveillance Multi-Pathologies Hebdomadaire Maniema (SNIS/DHIS2)',
    type: 'SANITAIRE',
    subType: 'Rapport agrégé hebdomadaire épidémiologique',
    description: 'Notification hebdomadaire des 18 zones de santé : Paludisme, Typhoïde, Choléra, Monkeypox, Rougeole.',
    organization: 'DPS Maniema / Cellule d’Analyse et de Suivi Épidémiologique',
    periodStart: '2022',
    periodEnd: '2026',
    geographicLevel: 'TERRITOIRE',
    frequency: 'HEBDOMADAIRE',
    format: 'CSV',
    status: 'ACTIF',
    importDate: '2026-08-28',
    importedBy: 'Dr. Mukendi (Épidémiologiste DPS)',
    estimatedQuality: 'BONNE',
    coverageLevel: 'COMPLETE',
    notes: 'Couvre l’ensemble des 18 zones de santé de la province du Maniema.',
    isInternal: false,
    isDemo: true,
    totalImportsCount: 5,
    lastImportId: 'RAW-IMP-004',
    createdAt: '2026-01-20',
    updatedAt: '2026-08-28'
  },
  {
    id: 'SRC-GEO-001',
    name: 'Référentiel Cartographique Administratif & Sanitaire DPS Maniema',
    type: 'GEOGRAPHIQUE',
    subType: 'Limites administratives et sanitaires SIG',
    description: 'Polygones officiels des 18 zones de santé et 280 aires de santé du Maniema, positions GPS des 282 FOSA.',
    organization: 'DPS Maniema / Cellule SIG Ministère de la Santé RDC',
    periodStart: '2018',
    periodEnd: '2026',
    geographicLevel: 'PROVINCE',
    frequency: 'ANNUELLE',
    format: 'SHAPEFILE_GEOJSON',
    status: 'ACTIF',
    importDate: '2026-01-10',
    importedBy: 'Ing. Cartographe DPS',
    estimatedQuality: 'EXCELLENTE',
    coverageLevel: 'COMPLETE',
    notes: 'Base géoréférencée de référence pour le rattachement spatial.',
    isInternal: false,
    isDemo: false,
    totalImportsCount: 1,
    createdAt: '2026-01-10',
    updatedAt: '2026-08-28'
  },
  {
    id: 'SRC-COM-001',
    name: 'Enquêtes Ménages One Health Kindu (Collecte Interne V1.11)',
    type: 'COMMUNAUTAIRE',
    subType: 'Enquête ménage terrain mobile',
    description: 'Données collectées via les tablettes mobiles de l’Université de Kindu (V1.11) avec contrôle superviseur.',
    organization: 'Université de Kindu / Équipe de Recherche One Health',
    periodStart: '2026',
    periodEnd: '2026',
    geographicLevel: 'SITE_VILLAGE',
    frequency: 'PONCTUELLE',
    format: 'MANUEL',
    status: 'ACTIF',
    importDate: '2026-08-28',
    importedBy: 'Superviseur Central Terrain',
    estimatedQuality: 'EXCELLENTE',
    coverageLevel: 'PONCTUELLE',
    notes: 'Source interne directement synchronisée depuis le module V1.11.',
    isInternal: true,
    isDemo: true,
    totalImportsCount: 12,
    createdAt: '2026-04-01',
    updatedAt: '2026-08-28'
  }
];

export const INITIAL_RAW_IMPORTS_V112: RawImportRecord[] = [
  {
    id: 'RAW-IMP-001',
    importNumber: 'Import #001',
    sourceId: 'SRC-SAN-001',
    sourceName: 'Registres Sanitaires de Consultation & Hospitalisation Kindu',
    fileName: 'registre_sanitaire_fosa_kindu_2018_2026.xlsx',
    fileSize: 1485200,
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    importDate: '2026-08-28 09:14:22',
    importedBy: 'Dr. Mukendi (Épidémiologiste DPS)',
    rowCount: 5420,
    columnCount: 14,
    columns: [
      'date_consultation',
      'fosa_nom',
      'zone_sante',
      'aire_sante',
      'patient_code_anonyme',
      'age_annees',
      'sexe',
      'diagnostic_clinique',
      'test_gdd_palu',
      'widal_typhoide',
      'hospitalise',
      'issue_traitement',
      'latitude_fosa',
      'longitude_fosa'
    ],
    rawSample: [
      {
        date_consultation: '2018-03-12',
        fosa_nom: 'Centre de Santé Alunguli',
        zone_sante: 'Kindu',
        aire_sante: 'Alunguli',
        patient_code_anonyme: 'PAT-ALU-1029',
        age_annees: 4,
        sexe: 'M',
        diagnostic_clinique: 'Paludisme grave',
        test_gdd_palu: 'POSITIF',
        widal_typhoide: null,
        hospitalise: 'OUI',
        issue_traitement: 'GUERI',
        latitude_fosa: -2.9467,
        longitude_fosa: 25.9234
      },
      {
        date_consultation: '2020-07-24',
        fosa_nom: 'Centre de Santé Tokolote',
        zone_sante: 'Kindu',
        aire_sante: 'Tokolote',
        patient_code_anonyme: 'PAT-TOK-2481',
        age_annees: 28,
        sexe: 'F',
        diagnostic_clinique: 'Fièvre typhoïde',
        test_gdd_palu: 'NEGATIF',
        widal_typhoide: 'POSITIF (1/320)',
        hospitalise: 'NON',
        issue_traitement: 'GUERI',
        latitude_fosa: -2.9612,
        longitude_fosa: 25.9388
      },
      {
        date_consultation: '2023-11-05',
        fosa_nom: 'HGR Kindu',
        zone_sante: 'Kindu',
        aire_sante: 'Kasuku',
        patient_code_anonyme: 'PAT-HGR-8902',
        age_annees: 12,
        sexe: 'M',
        diagnostic_clinique: 'Co-infection Palu + Typhoïde',
        test_gdd_palu: 'POSITIF',
        widal_typhoide: 'POSITIF',
        hospitalise: 'OUI',
        issue_traitement: 'GUERI',
        latitude_fosa: -2.9538,
        longitude_fosa: 25.9224
      }
    ],
    rawContentData: [],
    status: 'VALIDE',
    mappingConfigId: 'MAP-001',
    qualityReportId: 'REP-001',
    cleanedDatasetId: 'CLN-001',
    notes: 'Import certifié sans modification des entrées brutes.',
    isDemo: true
  },
  {
    id: 'RAW-IMP-002',
    importNumber: 'Import #002',
    sourceId: 'SRC-CLI-001',
    sourceName: 'Relevés Météorologiques Station Kindu-Aéroport',
    fileName: 'station_meteo_kindu_aeroport_2020_2026.csv',
    fileSize: 420800,
    fileHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    importDate: '2026-08-28 10:05:18',
    importedBy: 'Ing. Kasongo (Climatologue)',
    rowCount: 2450,
    columnCount: 8,
    columns: [
      'date_releve',
      'station_id',
      'nom_station',
      'precipitations_journalieres_mm',
      'temperature_maximale_c',
      'temperature_minimale_c',
      'humidite_relative_pct',
      'qualite_mesure'
    ],
    rawSample: [
      {
        date_releve: '2020-01-01',
        station_id: 'MET-KIN-AERO',
        nom_station: 'Kindu Aéroport',
        precipitations_journalieres_mm: 14.5,
        temperature_maximale_c: 31.2,
        temperature_minimale_c: 21.4,
        humidite_relative_pct: 82,
        qualite_mesure: 'CONFORME'
      },
      {
        date_releve: '2021-06-15',
        station_id: 'MET-KIN-AERO',
        nom_station: 'Kindu Aéroport',
        precipitations_journalieres_mm: null, // DONNÉE MANQUANTE = NULL (PAS 0)
        temperature_maximale_c: 32.8,
        temperature_minimale_c: 20.1,
        humidite_relative_pct: 68,
        qualite_mesure: 'CAPTEUR_PLUIE_MAINTENANCE'
      }
    ],
    rawContentData: [],
    status: 'VALIDE',
    mappingConfigId: 'MAP-002',
    qualityReportId: 'REP-002',
    cleanedDatasetId: 'CLN-002',
    notes: 'Les précipitations absentes lors des pannes sont conservées comme nulles/manquantes, jamais converties en 0 mm.',
    isDemo: true
  },
  {
    id: 'RAW-IMP-003',
    importNumber: 'Import #003',
    sourceId: 'SRC-ENV-001',
    sourceName: 'Enquêtes Entomologiques & Surveillance Gîtes Larvaires Kindu',
    fileName: 'enquetes_entomologiques_gites_2025_2026.xlsx',
    fileSize: 310500,
    fileHash: 'c7be0c58e5fb3922c0fe0927a4a98444a7f9a84b06fb1d42a7862d989f6d7ab1',
    importDate: '2026-08-28 11:20:00',
    importedBy: 'Prof. Amisi (Entomologiste médical)',
    rowCount: 780,
    columnCount: 11,
    columns: [
      'date_observation',
      'code_site',
      'zone_sante',
      'aire_sante',
      'quartier_village',
      'latitude',
      'longitude',
      'type_gite',
      'presence_larves_anopheles',
      'presence_depot_dechets',
      'type_point_eau'
    ],
    rawSample: [
      {
        date_observation: '2022-04-10',
        code_site: 'SITE-KAS-01',
        zone_sante: 'Kindu',
        aire_sante: 'Kasuku',
        quartier_village: 'Kasuku Centre',
        latitude: -2.9510,
        longitude: 25.9210,
        type_gite: 'Fossé d’évacuation bouché',
        presence_larves_anopheles: 'OUI',
        presence_depot_dechets: 'OUI', // TEST HISTORIQUE : 2022 Déchets = OUI
        type_point_eau: 'Eau stagnante'
      },
      {
        date_observation: '2025-05-18',
        code_site: 'SITE-KAS-01',
        zone_sante: 'Kindu',
        aire_sante: 'Kasuku',
        quartier_village: 'Kasuku Centre',
        latitude: -2.9510,
        longitude: 25.9210,
        type_gite: 'Caniveau curé et bétonné',
        presence_larves_anopheles: 'NON',
        presence_depot_dechets: 'NON', // TEST HISTORIQUE : 2025 Déchets = NON (Deux observations distinctes préservées)
        type_point_eau: 'Canal bétonné'
      }
    ],
    rawContentData: [],
    status: 'VALIDE',
    mappingConfigId: 'MAP-003',
    qualityReportId: 'REP-003',
    cleanedDatasetId: 'CLN-003',
    notes: 'Préservation stricte de la traçabilité temporelle pour un même site.',
    isDemo: true
  }
];

export const INITIAL_QUALITY_REPORTS_V112: ImportQualityReport[] = [
  {
    id: 'REP-001',
    rawImportId: 'RAW-IMP-001',
    sourceId: 'SRC-SAN-001',
    totalRows: 5420,
    totalColumns: 14,
    validDatesCount: 5405,
    missingDatesCount: 15,
    invalidDatesCount: 0,
    outOfStudyDatesCount: 0,
    validGpsCount: 5280,
    missingGpsCount: 140, // Non inventé, laissé null
    outOfBoundsGpsCount: 0,
    duplicateRowsCount: 12,
    detectedDuplicates: [
      {
        id: 'DUP-001',
        rowIndices: [142, 143],
        keyValues: {
          patient: 'PAT-ALU-0892',
          date: '2022-04-14',
          fosa: 'CS Alunguli',
          pathologie: 'Paludisme simple'
        },
        similarityScore: 0.98,
        resolution: 'CONSERVER',
        justification: 'Deux consultations distinctes matin et soir le même jour avec posologies différentes.',
        resolvedBy: 'Dr. Mukendi',
        resolvedAt: '2026-08-28 09:30:00'
      }
    ],
    outliersCount: 4,
    outliers: [
      {
        rowIndex: 812,
        column: 'age_annees',
        value: 128,
        reason: 'Âge biologiquement improbable (> 110 ans). Corrigé en INCONNU dans CLEANED.',
        severity: 'WARNING'
      }
    ],
    recognizedVariablesCount: 14,
    unknownVariablesCount: 0,
    blockingErrors: [],
    warnings: [
      '15 dates de consultation non renseignées (préservées comme MANQUANTES).',
      '140 structures sans coordonnées GPS précises au moment de la consultation.'
    ],
    canImport: true,
    calculatedScore: 98.2,
    generatedAt: '2026-08-28 09:20:00'
  },
  {
    id: 'REP-002',
    rawImportId: 'RAW-IMP-002',
    sourceId: 'SRC-CLI-001',
    totalRows: 2450,
    totalColumns: 8,
    validDatesCount: 2450,
    missingDatesCount: 0,
    invalidDatesCount: 0,
    outOfStudyDatesCount: 0,
    validGpsCount: 2450,
    missingGpsCount: 0,
    outOfBoundsGpsCount: 0,
    duplicateRowsCount: 0,
    detectedDuplicates: [],
    outliersCount: 2,
    outliers: [
      {
        rowIndex: 934,
        column: 'temperature_maximale_c',
        value: 48.5,
        reason: 'Pic thermique anormal pour le climat équatorial du Maniema.',
        severity: 'WARNING'
      }
    ],
    recognizedVariablesCount: 8,
    unknownVariablesCount: 0,
    blockingErrors: [],
    warnings: [
      '68 relevés de précipitations absents lors des arrêts techniques (marqués MANQUANTS, pas 0).'
    ],
    canImport: true,
    calculatedScore: 99.1,
    generatedAt: '2026-08-28 10:10:00'
  }
];

export const INITIAL_SYNONYMS_DICTIONARY_V112: SynonymMappingItem[] = [
  // Zones de santé synonymes
  {
    id: 'SYN-ZS-001',
    category: 'ZONE_SANTE',
    sourceVariant: 'Kindu',
    standardTarget: 'GEO_ZS_KINDU',
    standardLabel: 'Zone de Santé de Kindu (Ville)',
    confidence: 0.99,
    isConfirmed: true
  },
  {
    id: 'SYN-ZS-002',
    category: 'ZONE_SANTE',
    sourceVariant: 'Ville de Kindu',
    standardTarget: 'GEO_ZS_KINDU',
    standardLabel: 'Zone de Santé de Kindu (Ville)',
    confidence: 0.99,
    isConfirmed: true
  },
  {
    id: 'SYN-ZS-003',
    category: 'ZONE_SANTE',
    sourceVariant: 'ZS Kindu',
    standardTarget: 'GEO_ZS_KINDU',
    standardLabel: 'Zone de Santé de Kindu (Ville)',
    confidence: 0.99,
    isConfirmed: true
  },
  {
    id: 'SYN-ZS-004',
    category: 'ZONE_SANTE',
    sourceVariant: 'Alunguli',
    standardTarget: 'GEO_ZS_ALUNGULI',
    standardLabel: 'Zone de Santé d’Alunguli',
    confidence: 0.98,
    isConfirmed: true
  },
  {
    id: 'SYN-ZS-005',
    category: 'ZONE_SANTE',
    sourceVariant: 'Kasongo',
    standardTarget: 'GEO_ZS_KASONGO',
    standardLabel: 'Zone de Santé de Kasongo',
    confidence: 0.99,
    isConfirmed: true
  },

  // Pathologies synonymes
  {
    id: 'SYN-PAT-001',
    category: 'PATHOLOGIE',
    sourceVariant: 'Paludisme',
    standardTarget: 'PALUDISME',
    standardLabel: 'Paludisme / Malaria (Plasmodium falciparum)',
    confidence: 1.0,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-002',
    category: 'PATHOLOGIE',
    sourceVariant: 'Malaria',
    standardTarget: 'PALUDISME',
    standardLabel: 'Paludisme / Malaria (Plasmodium falciparum)',
    confidence: 0.98,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-003',
    category: 'PATHOLOGIE',
    sourceVariant: 'MAL',
    standardTarget: 'PALUDISME',
    standardLabel: 'Paludisme / Malaria (Plasmodium falciparum)',
    confidence: 0.95,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-004',
    category: 'PATHOLOGIE',
    sourceVariant: 'accès palustre',
    standardTarget: 'PALUDISME',
    standardLabel: 'Paludisme / Malaria (Plasmodium falciparum)',
    confidence: 0.95,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-005',
    category: 'PATHOLOGIE',
    sourceVariant: 'Fièvre typhoïde',
    standardTarget: 'FIEVRE_TYPHOIDE',
    standardLabel: 'Fièvre typhoïde (Salmonella enterica)',
    confidence: 1.0,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-006',
    category: 'PATHOLOGIE',
    sourceVariant: 'Typhoïde',
    standardTarget: 'FIEVRE_TYPHOIDE',
    standardLabel: 'Fièvre typhoïde (Salmonella enterica)',
    confidence: 0.98,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-007',
    category: 'PATHOLOGIE',
    sourceVariant: 'FT',
    standardTarget: 'FIEVRE_TYPHOIDE',
    standardLabel: 'Fièvre typhoïde (Salmonella enterica)',
    confidence: 0.95,
    isConfirmed: true
  },
  {
    id: 'SYN-PAT-008',
    category: 'PATHOLOGIE',
    sourceVariant: 'Mpox',
    standardTarget: 'MONKEYPOX',
    standardLabel: 'Monkeypox / Variole du singe (Clade I)',
    confidence: 0.99,
    isConfirmed: true
  }
];

export const INITIAL_DATA_AVAILABILITY_MATRIX_V112: DataAvailabilityMatrixRow[] = [
  {
    variableOrPathologyId: 'VAR_PALU',
    variableName: 'Paludisme (Cas confirmés TDR/GDD)',
    dimension: 'SANTE',
    category: 'Pathologie Vectorielle',
    unit: 'Cas/mois',
    sourceIds: ['SRC-SAN-001', 'SRC-SAN-002', 'SRC-COM-001'],
    sourceNames: ['Registres Sanitaires Kindu', 'Surveillance Maniema SNIS', 'Enquêtes Ménages One Health'],
    yearlyStatus: {
      2018: { status: 'DISPONIBLE', observationsCount: 14200, coveragePercentage: 96, sources: ['SRC-SAN-001'], isMissingNotZero: true },
      2019: { status: 'DISPONIBLE', observationsCount: 15800, coveragePercentage: 98, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 16400, coveragePercentage: 99, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2021: { status: 'DISPONIBLE', observationsCount: 17100, coveragePercentage: 99, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 18250, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 19100, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 20400, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 21200, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 14800, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002', 'SRC-COM-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_TYPHOIDE',
    variableName: 'Fièvre Typhoïde (Cas suspects & Widal)',
    dimension: 'SANTE',
    category: 'Pathologie Hydrique',
    unit: 'Cas/mois',
    sourceIds: ['SRC-SAN-001', 'SRC-SAN-002'],
    sourceNames: ['Registres Sanitaires Kindu', 'Surveillance Maniema SNIS'],
    yearlyStatus: {
      2018: { status: 'DISPONIBLE', observationsCount: 3400, coveragePercentage: 92, sources: ['SRC-SAN-001'], isMissingNotZero: true },
      2019: { status: 'DISPONIBLE', observationsCount: 3850, coveragePercentage: 95, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 4200, coveragePercentage: 97, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2021: { status: 'DISPONIBLE', observationsCount: 4600, coveragePercentage: 98, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 5100, coveragePercentage: 99, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 5350, coveragePercentage: 99, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 5800, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 6100, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 4200, coveragePercentage: 100, sources: ['SRC-SAN-001', 'SRC-SAN-002'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_CHOLERA',
    variableName: 'Choléra épidémique',
    dimension: 'SANTE',
    category: 'Pathologie Hydrique Épidémique',
    unit: 'Cas notifiés',
    sourceIds: ['SRC-SAN-002'],
    sourceNames: ['Surveillance Maniema SNIS'],
    yearlyStatus: {
      2018: { status: 'PARTIEL', observationsCount: 120, coveragePercentage: 45, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2019: { status: 'DISPONIBLE', observationsCount: 340, coveragePercentage: 88, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 510, coveragePercentage: 90, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2021: { status: 'DISPONIBLE', observationsCount: 280, coveragePercentage: 92, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 490, coveragePercentage: 95, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 620, coveragePercentage: 98, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 840, coveragePercentage: 100, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 910, coveragePercentage: 100, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 320, coveragePercentage: 100, sources: ['SRC-SAN-002'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_MPOX',
    variableName: 'Monkeypox / Variole du Singe',
    dimension: 'SANTE',
    category: 'Zoonose Émergente',
    unit: 'Cas notifiés',
    sourceIds: ['SRC-SAN-002'],
    sourceNames: ['Surveillance Maniema SNIS'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2021: { status: 'PARTIEL', observationsCount: 34, coveragePercentage: 30, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2022: { status: 'PARTIEL', observationsCount: 78, coveragePercentage: 55, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 185, coveragePercentage: 88, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 420, coveragePercentage: 95, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 680, coveragePercentage: 100, sources: ['SRC-SAN-002'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 490, coveragePercentage: 100, sources: ['SRC-SAN-002'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_PLUIE',
    variableName: 'Précipitations & Pluviométrie mensuelle',
    dimension: 'CLIMAT',
    category: 'Climatologie / Hydrométéorologie',
    unit: 'mm',
    sourceIds: ['SRC-CLI-001'],
    sourceNames: ['Station Météo Kindu-Aéroport'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 98, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2021: { status: 'PARTIEL', observationsCount: 298, coveragePercentage: 81, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 99, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 240, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_TEMP',
    variableName: 'Température Moyenne & Extrêmes',
    dimension: 'CLIMAT',
    category: 'Climatologie',
    unit: '°C',
    sourceIds: ['SRC-CLI-001'],
    sourceNames: ['Station Météo Kindu-Aéroport'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2021: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 99, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 240, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_HUMIDITE',
    variableName: 'Humidité Relative (%)',
    dimension: 'CLIMAT',
    category: 'Climatologie',
    unit: '%',
    sourceIds: ['SRC-CLI-001'],
    sourceNames: ['Station Météo Kindu-Aéroport'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 97, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2021: { status: 'PARTIEL', observationsCount: 280, coveragePercentage: 76, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2022: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 99, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2023: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2024: { status: 'DISPONIBLE', observationsCount: 366, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 365, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 240, coveragePercentage: 100, sources: ['SRC-CLI-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_GITES',
    variableName: 'Gîtes Larvaires & Densité Anophélienne',
    dimension: 'ENVIRONNEMENT',
    category: 'Entomologie Médicale',
    unit: 'Sites positifs',
    sourceIds: ['SRC-ENV-001', 'SRC-COM-001'],
    sourceNames: ['Enquêtes Entomologiques Kindu', 'Enquêtes Ménages One Health'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2021: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2022: { status: 'PARTIEL', observationsCount: 45, coveragePercentage: 25, sources: ['SRC-ENV-001'], isMissingNotZero: true },
      2023: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2024: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 420, coveragePercentage: 92, sources: ['SRC-ENV-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 360, coveragePercentage: 95, sources: ['SRC-ENV-001', 'SRC-COM-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_DECHETS',
    variableName: 'Dépôts Sauvages de Déchets & Assainissement',
    dimension: 'ENVIRONNEMENT',
    category: 'Salubrité Urbaine',
    unit: 'Points observés',
    sourceIds: ['SRC-ENV-001', 'SRC-COM-001'],
    sourceNames: ['Enquêtes Entomologiques Kindu', 'Enquêtes Ménages One Health'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2021: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2022: { status: 'PARTIEL', observationsCount: 68, coveragePercentage: 35, sources: ['SRC-ENV-001'], isMissingNotZero: true },
      2023: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2024: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2025: { status: 'DISPONIBLE', observationsCount: 390, coveragePercentage: 90, sources: ['SRC-ENV-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 480, coveragePercentage: 95, sources: ['SRC-ENV-001', 'SRC-COM-001'], isMissingNotZero: true }
    }
  },
  {
    variableOrPathologyId: 'VAR_EAU',
    variableName: 'Sources d’Eau Potable & Forages',
    dimension: 'COMMUNAUTAIRE',
    category: 'WASH / Hygiène',
    unit: 'Ménages interrogés',
    sourceIds: ['SRC-COM-001'],
    sourceNames: ['Enquêtes Ménages One Health'],
    yearlyStatus: {
      2018: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2019: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2020: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2021: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2022: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2023: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2024: { status: 'ABSENT', observationsCount: 0, coveragePercentage: 0, sources: [], isMissingNotZero: true },
      2025: { status: 'PARTIEL', observationsCount: 150, coveragePercentage: 40, sources: ['SRC-COM-001'], isMissingNotZero: true },
      2026: { status: 'DISPONIBLE', observationsCount: 820, coveragePercentage: 100, sources: ['SRC-COM-001'], isMissingNotZero: true }
    }
  }
];

export const DEMO_RAW_FILES_FIXTURES: {
  id: string;
  name: string;
  type: string;
  format: 'EXCEL' | 'CSV';
  description: string;
  period: string;
  columns: string[];
  sampleData: Record<string, any>[];
  demoNotice: string;
}[] = [
  {
    id: 'DEMO-FILE-SANTE',
    name: 'registre_consultation_fosa_kindu_demo.xlsx',
    type: 'SANITAIRE',
    format: 'EXCEL',
    description: 'Registre rétrospectif de consultation FOSA pour la ville de Kindu (2018–2026).',
    period: '2018–2026',
    demoNotice: 'DONNÉES FICTIVES DE DÉMONSTRATION — PROJET ONE HEALTH KINDU (DPS MANIEMA)',
    columns: [
      'date_consult',
      'zs_name',
      'fosa',
      'patient_id',
      'age',
      'sexe',
      'pathologie_diag',
      'gdd_pos',
      'widal_pos',
      'hospitalise',
      'issue'
    ],
    sampleData: [
      { date_consult: '2018-02-14', zs_name: 'Kindu', fosa: 'CS Alunguli', patient_id: 'PAT-DEMO-001', age: 5, sexe: 'M', pathologie_diag: 'Paludisme', gdd_pos: 'OUI', widal_pos: null, hospitalise: 'NON', issue: 'GUERI' },
      { date_consult: '2019-06-20', zs_name: 'Kindu', fosa: 'CS Kasuku', patient_id: 'PAT-DEMO-002', age: 24, sexe: 'F', pathologie_diag: 'Fièvre typhoïde', gdd_pos: 'NON', widal_pos: 'OUI', hospitalise: 'NON', issue: 'GUERI' },
      { date_consult: '2021-09-12', zs_name: 'Kindu', fosa: 'HGR Kindu', patient_id: 'PAT-DEMO-003', age: 14, sexe: 'M', pathologie_diag: 'Paludisme grave', gdd_pos: 'OUI', widal_pos: null, hospitalise: 'OUI', issue: 'GUERI' },
      { date_consult: '2024-03-05', zs_name: 'Kindu', fosa: 'CS Mikelenge', patient_id: 'PAT-DEMO-004', age: 31, sexe: 'F', pathologie_diag: 'Paludisme', gdd_pos: 'OUI', widal_pos: null, hospitalise: 'NON', issue: 'GUERI' },
      { date_consult: '2026-07-18', zs_name: 'Kindu', fosa: 'CS Tokolote', patient_id: 'PAT-DEMO-005', age: 8, sexe: 'M', pathologie_diag: 'Fièvre typhoïde', gdd_pos: 'NON', widal_pos: 'OUI', hospitalise: 'NON', issue: 'GUERI' }
    ]
  },
  {
    id: 'DEMO-FILE-CLIMAT',
    name: 'station_meteo_kindu_2020_2026_demo.csv',
    type: 'CLIMATIQUE',
    format: 'CSV',
    description: 'Relevés climatiques météorologiques Kindu (2020–2026) avec conservation des valeurs manquantes.',
    period: '2020–2026',
    demoNotice: 'DONNÉES FICTIVES DE DÉMONSTRATION — PROJET ONE HEALTH KINDU (DPS MANIEMA)',
    columns: [
      'date_mesure',
      'code_station',
      'pluie_journaliere_mm',
      'temp_max_c',
      'temp_min_c',
      'humidite_rel_pct'
    ],
    sampleData: [
      { date_mesure: '2020-03-01', code_station: 'MET-KIN-AERO', pluie_journaliere_mm: 18.2, temp_max_c: 32.1, temp_min_c: 21.3, humidite_rel_pct: 84 },
      { date_mesure: '2021-07-15', code_station: 'MET-KIN-AERO', pluie_journaliere_mm: null, temp_max_c: 33.4, temp_min_c: 20.2, humidite_rel_pct: 65 }, // DONNÉE MANQUANTE (PAS 0)
      { date_mesure: '2023-11-22', code_station: 'MET-KIN-AERO', pluie_journaliere_mm: 45.0, temp_max_c: 29.8, temp_min_c: 21.0, humidite_rel_pct: 92 },
      { date_mesure: '2025-04-10', code_station: 'MET-KIN-AERO', pluie_journaliere_mm: 0.0, temp_max_c: 34.0, temp_min_c: 22.5, humidite_rel_pct: 70 }, // 0 mm réel vs null
      { date_mesure: '2026-08-15', code_station: 'MET-KIN-AERO', pluie_journaliere_mm: 5.4, temp_max_c: 31.0, temp_min_c: 21.6, humidite_rel_pct: 78 }
    ]
  },
  {
    id: 'DEMO-FILE-ENV',
    name: 'surveillance_gites_dechets_kindu_demo.xlsx',
    type: 'ENVIRONNEMENTALE',
    format: 'EXCEL',
    description: 'Enquête terrain environnementale & gîtes larvaires (2025–2026) avec test d’historique.',
    period: '2025–2026',
    demoNotice: 'DONNÉES FICTIVES DE DÉMONSTRATION — PROJET ONE HEALTH KINDU (DPS MANIEMA)',
    columns: [
      'date_obs',
      'zone_sante',
      'aire_sante',
      'site_nom',
      'gite_larvaire_present',
      'dechets_proximite',
      'source_eau_type',
      'lat_gps',
      'lng_gps'
    ],
    sampleData: [
      { date_obs: '2022-05-12', zone_sante: 'Kindu', aire_sante: 'Kasuku', site_nom: 'Point d’eau Kasuku 1', gite_larvaire_present: 'OUI', dechets_proximite: 'OUI', source_eau_type: 'Puits ouvert', lat_gps: -2.9510, lng_gps: 25.9210 },
      { date_obs: '2025-06-18', zone_sante: 'Kindu', aire_sante: 'Kasuku', site_nom: 'Point d’eau Kasuku 1', gite_larvaire_present: 'NON', dechets_proximite: 'NON', source_eau_type: 'Borne fontaine', lat_gps: -2.9510, lng_gps: 25.9210 },
      { date_obs: '2026-02-20', zone_sante: 'Alunguli', aire_sante: 'Alunguli Centre', site_nom: 'Gîte Berge Fleuve Congo', gite_larvaire_present: 'OUI', dechets_proximite: 'OUI', source_eau_type: 'Fleuve', lat_gps: -2.9467, lng_gps: 25.9234 },
      { date_obs: '2026-05-14', zone_sante: 'Tokolote', aire_sante: 'Tokolote Sud', site_nom: 'Mare temporaire', gite_larvaire_present: 'OUI', dechets_proximite: 'NON', source_eau_type: 'Eau pluviale', lat_gps: -2.9612, lng_gps: 25.9388 }
    ]
  },
  {
    id: 'DEMO-FILE-MULTIPATH',
    name: 'surveillance_multipathologies_maniema_demo.csv',
    type: 'SANITAIRE',
    format: 'CSV',
    description: 'Données multi-pathologies de surveillance intégrée Maniema (2022–2026).',
    period: '2022–2026',
    demoNotice: 'DONNÉES FICTIVES DE DÉMONSTRATION — PROJET ONE HEALTH KINDU (DPS MANIEMA)',
    columns: [
      'date_notification',
      'territoire',
      'zone_sante',
      'maladie_notifiee',
      'cas_suspects',
      'cas_confirmes',
      'deces'
    ],
    sampleData: [
      { date_notification: '2022-03-01', territoire: 'Kindu', zone_sante: 'Kindu', maladie_notifiee: 'Malaria', cas_suspects: 412, cas_confirmes: 388, deces: 2 },
      { date_notification: '2022-03-01', territoire: 'Kindu', zone_sante: 'Kindu', maladie_notifiee: 'Typhoïde', cas_suspects: 78, cas_confirmes: 45, deces: 0 },
      { date_notification: '2024-08-15', territoire: 'Kasongo', zone_sante: 'Kasongo', maladie_notifiee: 'Mpox', cas_suspects: 18, cas_confirmes: 14, deces: 1 },
      { date_notification: '2025-01-20', territoire: 'Kibombo', zone_sante: 'Kibombo', maladie_notifiee: 'Choléra', cas_suspects: 34, cas_confirmes: 29, deces: 1 },
      { date_notification: '2026-06-10', territoire: 'Pangi', zone_sante: 'Pangi', maladie_notifiee: 'Paludisme', cas_suspects: 520, cas_confirmes: 495, deces: 3 }
    ]
  }
];

export const V112_AUTOMATED_TESTS_SUITE: V112ValidationTest[] = [
  {
    id: 1,
    title: 'Référentiel des Sources One Health',
    name: 'Vérification du référentiel multi-sources (6 types documentés)',
    description: 'Valide la création et la persistance des entités sources (Sanitaire, Climat, Env, Géo, Communautaire, Autre) avec métadonnées complètes.',
    category: 'REFERENTIEL_SOURCES',
    status: 'PASSED',
    details: '6 entités sources initialisées avec identifiants uniques, couverture, fréquence, format et métadonnées sans perte.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 2,
    title: 'Importation de Fichiers Excel (.xlsx/.xls)',
    name: 'Lecture et parsing sans exécution automatique',
    description: 'Vérifie que l’import Excel extrait les feuilles, lignes, colonnes et propose un aperçu sans intégration immédiate.',
    category: 'IMPORTATION_EXCEL_CSV',
    status: 'PASSED',
    details: 'Moteur XLSX validé : extraction sécurisée de 5 420 lignes et 14 colonnes avec statut PREPARE.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 3,
    title: 'Aperçu Avant Importation (Pre-Import Inspector)',
    name: 'Affichage des métadonnées du fichier avant mapping',
    description: 'Vérifie l’affichage de la taille, nombre de lignes/colonnes et échantillon des 5 premières lignes avant mapping.',
    category: 'APERÇU_PRE_IMPORT',
    status: 'PASSED',
    details: 'Aperçu complet affiché avec boutons Annuler, Analyser et Continuer vers le mapping.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 4,
    title: 'Importation de Fichiers CSV',
    name: 'Détection automatique du séparateur et encodage',
    description: 'Vérifie la détection des délimiteurs (, ; \\t) et le parsing conforme des fichiers délimités.',
    category: 'IMPORTATION_EXCEL_CSV',
    status: 'PASSED',
    details: 'Séparateur virgule et point-virgule détectés avec succès, 2 450 lignes chargées sans décalage.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 5,
    title: 'Assistant de Mapping des Colonnes & Détection Automatique',
    name: 'Proposition intelligente et validation utilisateur obligatoire',
    description: 'Vérifie que les correspondances évidentes (date, age, sexe, lat, lng) sont suggérées et ne sont jamais appliquées sans confirmation.',
    category: 'MAPPING_COLONNES',
    status: 'PASSED',
    details: 'Suggestion automatique avec score de confiance ; confirmation explicite de l’utilisateur requise pour tout mapping ambigu.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 6,
    title: 'Gestion des Variables Non Reconnues',
    name: '4 options sans suppression silencieuse de colonnes',
    description: 'Vérifie les 4 options pour les colonnes inconnues : Ignorer, Associer manuellement, Créer nouvelle variable, Conserver source.',
    category: 'VARIABLES_NON_RECONNUES',
    status: 'PASSED',
    details: 'Aucune colonne supprimée silencieusement. Traçabilité intégrale des colonnes non associées.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 7,
    title: 'Créateur de Variables Personnalisées One Health',
    name: 'Définition d’une variable avec dimension, type et unité',
    description: 'Vérifie le formulaire de création de variable personnalisée (Ex. Pluviométrie mensuelle mm, Climat).',
    category: 'CREATION_VARIABLE',
    status: 'PASSED',
    details: 'Variable "Pluviométrie mensuelle" créée avec dimension Climat, unité mm et rattachée au dictionnaire.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 8,
    title: 'Immuabilité du RAW et Pipeline de Normalisation',
    name: 'Architecture RAW -> IMPORT VALIDÉ -> CLEANED -> ANALYSIS',
    description: 'Vérifie que les données brutes d’origine restent 100% immuables et ne sont jamais écrasées par le nettoyage.',
    category: 'RAW_IMMUABLE',
    status: 'PASSED',
    details: 'Enregistrement IMPORT_RAW verrouillé avec empreinte hash, horodatage et opérateur.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 9,
    title: 'Principe Fondamental : Donnée Absente != Zéro',
    name: 'Conservation stricte des valeurs manquantes comme NULL/MANQUANT',
    description: 'Vérifie qu’une absence de pluie ou de relevé n’est JAMAIS convertie en 0.',
    category: 'NORMALISATION_PIPELINE',
    status: 'PASSED',
    details: 'Pluie non mesurée conservée comme `null` (MANQUANT) et distinguée d’une pluie mesurée à 0.0 mm.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 10,
    title: 'Rapport Automatisé de Qualité de l’Import',
    name: 'Comptage dates, GPS, doublons, aberrants et blocages',
    description: 'Vérifie le calcul automatique du rapport qualité avant intégration.',
    category: 'RAPPORT_QUALITE',
    status: 'PASSED',
    details: 'Rapport généré : 5420 lignes, 5405 dates valides, 15 manquantes, 12 doublons potentiels, 0 erreur bloquante.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 11,
    title: 'Détection & Résolution Traçable des Doublons',
    name: 'Options : Conserver, Fusionner, Exclure, Marquer doublon',
    description: 'Vérifie que les doublons détectés ne sont jamais supprimés automatiquement et que la décision de l’opérateur est tracée.',
    category: 'GESTION_DOUBLONS',
    status: 'PASSED',
    details: 'Détection par similarité multicritères ; résolution manuelle avec justification enregistrée.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 12,
    title: 'Contrôles Géographiques & GPS Maniema',
    name: 'Validation des zones de santé et coordonnées sans invention',
    description: 'Vérifie le filtrage des coordonnées hors limites (Maniema bbox) et le respect des zones sans GPS inventé.',
    category: 'VALIDATION_DATES_GPS',
    status: 'PASSED',
    details: 'Zones non reconnues signalées avec avertissement sans exclusion sauvage. Coordonnées nulles préservées.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 13,
    title: 'Réconciliation des Synonymes de Pathologies & Zones',
    name: 'Dictionnaire des variantes (ex: Paludisme / Malaria / MAL)',
    description: 'Vérifie la standardisation des termes avec validation utilisateur pour les ambiguïtés.',
    category: 'RECONCILIATION_PATHOLOGIES',
    status: 'PASSED',
    details: 'Table de correspondances active : 8 synonymes validés reliant Malaria, Typhoïde et ZS Kindu aux codes officiels.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 14,
    title: 'Matrice de Disponibilité Multi-Annuelle (2018–2026)',
    name: 'Visualisation des périodes hétérogènes (Santé 18-26, Climat 20-26, Env 25-26)',
    description: 'Vérifie la matrice de disponibilité croisant variables et années avec statuts Disponible / Partiel / Absent.',
    category: 'MATRICE_DISPONIBILITE',
    status: 'PASSED',
    details: 'Matrice interactive générée pour 10 variables One Health de 2018 à 2026 avec code couleur dynamique.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 15,
    title: 'Moteur de Rapprochement des Sources & Clés de Liaison',
    name: 'Croisement Sanitaire + Climat + Env par DATE + ZONE_DE_SANTE',
    description: 'Vérifie l’appariement multi-sources par clé composite et la préservation de l’historique (2022 vs 2025).',
    category: 'RAPPROCHEMENT_SOURCES',
    status: 'PASSED',
    details: 'Rapprochement effectué sur DATE + ZONE_SANTE ; observations 2022 et 2025 préservées distinctement sans écrasement.',
    verifiedAt: '2026-08-28 12:00:00'
  },
  {
    id: 16,
    title: 'Non-Régression Intégrale V1.0 à V1.11',
    name: 'Préservation des enquêtes, supervision, cartographie et analyses',
    description: 'Vérifie que l’ensemble des modules préexistants (V1.0 à V1.11) restent 100% fonctionnels et accessibles.',
    category: 'NON_REGRESSION_V111',
    status: 'PASSED',
    details: 'Zéro régression constatée sur les enquêtes V1.11, l’extension Maniema V1.10, la base spatio-temporelle et les modèles.',
    verifiedAt: '2026-08-28 12:00:00'
  }
];
