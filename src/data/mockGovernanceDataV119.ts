import {
  StudyProject,
  StudyProtocol,
  DataDictionaryVariable,
  ProjectFormVersion,
  GovernanceDataset,
  DatasetSnapshot,
  DataLineageNode,
  DataLineageEdge,
  ExternalDataSource,
  FileImportAudit,
  CaseDefinition,
  MultiLevelValidationRecord,
  ProjectUserPermission,
  ReproducibleModel,
  ReproducibleAnalysis,
  VersionDiffResult,
  GovernanceQualityScore,
  GovernanceAlert,
  CentralAuditLogEntry,
  V119GovernanceScenarioTest
} from '../types';

// ============================================================================
// 1. PROJETS D'ÉTUDE (Study Projects)
// ============================================================================

export const MOCK_STUDY_PROJECTS: StudyProject[] = [
  {
    id: 'PRJ-KIN-001',
    code: 'OH-MANIEMA-2026',
    name: 'Surveillance & Modélisation Éco-Épidémiologique One Health Maniema (2026–2029)',
    description: 'Projet centralisé de recherche épidémiologique intégrée combinant données sanitaires (paludisme, typhoïde), observations environnementales des gîtes larvaires et séries climatiques Mettelsat/CHIRPS sur les 3 zones de santé de Kindu.',
    leader: 'Dr. Jean-Pierre Mukendi',
    leaderRole: 'Coordinateur Scientifique Principal',
    territory: 'Kindu (Kasuku, Mikelenge, Alunguli) & Maniema, RDC',
    targetPathologies: ['Paludisme', 'Fièvre typhoïde', 'Diarrhées hydriques'],
    dimensions: {
      humanHealth: true,
      animalHealth: false,
      environment: true,
      climate: true,
      water: true,
      sanitation: true,
      ecosystem: true
    },
    status: 'ACTIF',
    version: 'v1.2.0',
    createdAt: '2026-01-15 08:30',
    startDate: '2026-02-01',
    endDate: '2029-12-31',
    metadata: {
      institution: 'Division Provinciale de la Santé (DPS) Maniema / Université de Kindu',
      ethicsApprovalNumber: 'CNES-RDC/DPS-MAN/2026/041-A',
      fundingSource: 'Fonds de Recherche Épidémiologique One Health & Partenaires',
      contactEmail: 'recherche.onehealth.maniema@dps-rdc.cd',
      keywords: ['One Health', 'Paludisme', 'Typhoïde', 'Kindu', 'Maniema', 'SIG', 'GAM', 'Vecteurs'],
      dataSharingPolicy: 'COLLABORATIVE',
      customMetadata: {
        totalTargetHouseholds: 3600,
        clusterSamplingMethod: 'Échantillonnage en grappes stratifié par aire de santé',
        geofenceRadiusKm: 25.0
      }
    },
    activeProtocolId: 'PROT-2026-001',
    campaignsCount: 3,
    datasetsCount: 5,
    modelsCount: 4,
    isArchived: false,
    isDemoData: true
  },
  {
    id: 'PRJ-KAS-002',
    code: 'SENTINEL-ZOONOSES-MAN-2027',
    name: 'Observatoire Sentinelle Zoonoses & Écosystèmes Forestiers Maniema Sud (Kasongo & Punia)',
    description: 'Projet sentinelle ciblant les zoonoses émergentes (Mpox, Fièvres hémorragiques, arboviroses) et les interactions faune sauvage/populations riveraines le long du fleuve Congo.',
    leader: 'Prof. Claire Kanyinda',
    leaderRole: 'Épidémiologiste Vétérinaire & Environnemental',
    territory: 'Kasongo, Punia & Sud-Maniema, RDC',
    targetPathologies: ['Mpox (Variole du Singe)', 'Fièvres Hémorragiques Virales', 'Zoonoses Fluviales'],
    dimensions: {
      humanHealth: true,
      animalHealth: true,
      environment: true,
      climate: true,
      water: true,
      sanitation: false,
      ecosystem: true
    },
    status: 'PREPARATION',
    version: 'v0.9.1',
    createdAt: '2026-04-10 11:00',
    startDate: '2027-01-01',
    endDate: '2029-12-31',
    metadata: {
      institution: 'Institut National de Recherche Biomédicale (INRB) / DPS Maniema',
      ethicsApprovalNumber: 'INRB-ETH-2026-089',
      fundingSource: 'Consortium International de Veille Zoonotique',
      contactEmail: 'sentinel.zoonoses@inrb.cd',
      keywords: ['Zoonoses', 'Mpox', 'Faune', 'Forêt tropicale', 'Maniema'],
      dataSharingPolicy: 'RESTRICTED'
    },
    activeProtocolId: 'PROT-2027-002',
    campaignsCount: 1,
    datasetsCount: 2,
    modelsCount: 1,
    isArchived: false,
    isDemoData: true
  },
  {
    id: 'PRJ-RETRO-003',
    code: 'RETRO-CLIM-2020-2025',
    name: 'Étude Rétrospective Climat, Inondations & Dynamique Vectorielle à Kindu (2020–2025)',
    description: 'Compilation et harmonisation rétrospective des séries temporelles pluviométriques et hydrologiques du fleuve Lualaba avec les registres de cas de paludisme.',
    leader: 'Dr. Marc Kasongo',
    leaderRole: 'Biostatisticien Senior',
    territory: 'Kindu (Maniema)',
    targetPathologies: ['Paludisme'],
    dimensions: {
      humanHealth: true,
      animalHealth: false,
      environment: true,
      climate: true,
      water: true,
      sanitation: true,
      ecosystem: false
    },
    status: 'ARCHIVE',
    version: 'v2.0.0-FINAL',
    createdAt: '2025-06-01 09:00',
    startDate: '2020-01-01',
    endDate: '2025-12-31',
    metadata: {
      institution: 'Mettelsat & DPS Maniema',
      ethicsApprovalNumber: 'DPS-RETRO-2025-012',
      fundingSource: 'Programme National de Lutte contre le Paludisme (PNLP)',
      contactEmail: 'archives.climat.palu@dps-rdc.cd',
      keywords: ['Rétrospectif', 'Mettelsat', 'Séries 2020-2025', 'Hydrologie'],
      dataSharingPolicy: 'OPEN_ACCESS'
    },
    activeProtocolId: 'PROT-2025-RETRO',
    campaignsCount: 2,
    datasetsCount: 3,
    modelsCount: 2,
    isArchived: true,
    isDemoData: true
  }
];

// ============================================================================
// 2. PROTOCOLES D'ÉTUDE VERSIONNÉS (Study Protocols & Version History)
// ============================================================================

export const MOCK_STUDY_PROTOCOLS: StudyProtocol[] = [
  {
    id: 'PROT-2026-001',
    projectId: 'PRJ-KIN-001',
    title: 'Protocole Intégré d Enquête Éco-Épidémiologique et de Surveillance Spatio-Temporelle One Health Kindu',
    currentVersion: 'V1.2',
    objectives: {
      primary: 'Quantifier l impact combiné des facteurs micro-climatiques (pluviométrie, température, humidité) et environnementaux (gîtes larvaires, proximité du fleuve Lualaba, inondations) sur l incidence spatiotemporelle du paludisme et de la fièvre typhoïde à Kindu.',
      secondary: [
        'Établir une cartographie haute résolution des gîtes anophéliens et points d eau non protégés.',
        'Développer et calibrer des modèles prédictifs GAM et SARIMA intégrant des retards temporels (lags de 0 à 8 semaines).',
        'Mettre en place un système d alerte précoce communautaire fondé sur des seuils statistiques robustes.'
      ]
    },
    targetPopulation: 'Ménages résidents dans les 18 aires de santé de Kindu (Kasuku, Mikelenge, Alunguli) et structures de soins sentinelles.',
    inclusionCriteria: [
      'Résidence continue dans la concession depuis au moins 3 mois.',
      'Consentement éclairé signé par le chef de ménage ou son représentant adulte.',
      'Présence d au moins un point d eau ou gîte potentiel dans un rayon de 500m.'
    ],
    exclusionCriteria: [
      'Refus explicite de participation ou absence répétée après 3 visites.',
      'Habitation temporaire de passage ou campement nomade.',
      'Données de géolocalisation inexploitables (précision > 100m).'
    ],
    samplingMethod: 'Échantillonnage aréolaire stratifié en grappes à deux degrés avec tirage aléatoire des concessions.',
    periods: [
      {
        seriesId: 'SERIE-2026-A',
        label: 'Série 1 : Grande Saison des Pluies (Fév–Mai 2026)',
        startDate: '2026-02-01',
        endDate: '2026-05-31',
        seasonsCovered: ['Grande Saison des Pluies']
      },
      {
        seriesId: 'SERIE-2026-B',
        label: 'Série 2 : Saison Sèche (Juin–Août 2026)',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        seasonsCovered: ['Saison Sèche']
      },
      {
        seriesId: 'SERIE-2027-A',
        label: 'Série 3 : Petite Saison des Pluies (Sept–Déc 2026 / 2027)',
        startDate: '2026-09-01',
        endDate: '2027-01-31',
        seasonsCovered: ['Petite Saison des Pluies']
      },
      {
        seriesId: 'SERIE-2027-2028',
        label: 'Série 4 : Cycle Pluriannuel de Validation (2027–2028)',
        startDate: '2027-02-01',
        endDate: '2028-12-31',
        seasonsCovered: ['Cycle Annuel Complet']
      }
    ],
    targetZones: ['ZS Kindu (Kasuku & Mikelenge)', 'ZS Alunguli'],
    keyVariables: [
      'cases_malaria_conf',
      'cases_typhoid_conf',
      'temp_mean_c',
      'precip_accum_mm',
      'water_source_type',
      'larval_site_present',
      'gps_coordinates'
    ],
    ethicsCommitteeRef: 'CNES-RDC-041/2026',
    integrityRules: [
      'Double saisie ou contrôle croisé sur 10% des fiches ménages.',
      'Contrôle de géofencing strict : coordonnées dans le polygone de l aire de santé assignée.',
      'Horodatage local immuable et calcul automatique du hash des observations validées.'
    ],
    author: 'Dr. Jean-Pierre Mukendi & Équipe Méthodologique One Health',
    createdAt: '2026-01-10 14:00',
    updatedAt: '2026-08-20 16:30',
    status: 'VALIDE',
    history: [
      {
        version: 'V1.0',
        date: '2026-01-10',
        author: 'Dr. Jean-Pierre Mukendi',
        changesSummary: 'Version initiale du protocole One Health Kindu axée principalement sur le paludisme et les gîtes larvaires.',
        justification: 'Dépôt initial auprès du comité d éthique de la DPS Maniema.',
        isMajorChange: false,
        status: 'VALIDE'
      },
      {
        version: 'V1.1',
        date: '2026-03-15',
        author: 'Dr. Marc Kasongo',
        changesSummary: 'Amendement majeur : Intégration systématique du module Fièvre Typhoïde et des critères Widal/Hémoculture.',
        justification: 'Recrudescence épidémique constatée à Alunguli nécessitant une surveillance conjointe eau/typhoïde.',
        isMajorChange: true,
        status: 'AMENDE'
      },
      {
        version: 'V1.2',
        date: '2026-08-20',
        author: 'Dr. Jean-Pierre Mukendi',
        changesSummary: 'Amendement méthodologique : Ajout de la station automatique Mettelsat Kindu Aérodrome et du proxy d indice NDWI satellite.',
        justification: 'Renforcement de la précision climatique et comblement des données manquantes de surface en eau.',
        isMajorChange: true,
        status: 'VALIDE'
      }
    ],
    isDemoData: true
  }
];

// ============================================================================
// 3. DICTIONNAIRE DES VARIABLES (Data Dictionary)
// ============================================================================

export const MOCK_DATA_DICTIONARY: DataDictionaryVariable[] = [
  {
    variableId: 'VAR-001',
    name: 'cases_malaria_conf',
    label: 'Nombre de cas confirmés de paludisme (TDR / GE+)',
    description: 'Nombre total de cas de paludisme confirmés biologiquement par Test de Diagnostic Rapide (TDR) ou Goutte Épaisse (GE) positive au cours de la période dans l unité de déclaration.',
    type: 'ENTIER',
    unit: 'cas',
    precision: 0,
    acceptableRange: { min: 0, max: 2500 },
    domain: 'SANTE_HUMAINE',
    obligation: 'OBLIGATOIRE',
    source: 'REGISTRE',
    isProxy: false,
    aggregationLevel: 'AIRE_SANTE',
    scientificMeaning: 'Indicateur épidémiologique clé de morbidité palustre confirmée.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-002',
    name: 'cases_typhoid_conf',
    label: 'Nombre de cas de fièvre typhoïde (Widal / Hémoculture)',
    description: 'Nombre de cas suspects de fièvre typhoïde avec confirmation sérologique (Widal TO/TH ≥ 1/160) ou bactériologique (hémoculture positive à Salmonella Typhi).',
    type: 'ENTIER',
    unit: 'cas',
    precision: 0,
    acceptableRange: { min: 0, max: 500 },
    domain: 'SANTE_HUMAINE',
    obligation: 'OBLIGATOIRE',
    source: 'REGISTRE',
    isProxy: false,
    aggregationLevel: 'AIRE_SANTE',
    scientificMeaning: 'Indicateur de contamination fécale-orale des réseaux d eau et d assainissement.',
    version: 'V1.1',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-003',
    name: 'temp_mean_c',
    label: 'Température moyenne journalière / mensuelle (°C)',
    description: 'Moyenne arithmétique des températures enregistrées sur l intervalle temporel de référence.',
    type: 'DECIMAL',
    unit: '°C',
    precision: 1,
    acceptableRange: { min: 16.0, max: 42.0 },
    domain: 'CLIMAT',
    obligation: 'OBLIGATOIRE',
    source: 'STATION_METEO',
    isProxy: false,
    aggregationLevel: 'SITE',
    scientificMeaning: 'Facteur cinétique direct de la sporogonie anophélienne (Plasm. falciparum) et du taux de reproduction bactérienne.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-004',
    name: 'precip_accum_mm',
    label: 'Précipitations cumulées (mm)',
    description: 'Hauteur cumulée d eau de pluie mesurée au pluviomètre ou estimée par produit satellite CHIRPS v2.0.',
    type: 'DECIMAL',
    unit: 'mm',
    precision: 1,
    acceptableRange: { min: 0.0, max: 800.0 },
    domain: 'CLIMAT',
    obligation: 'OBLIGATOIRE',
    source: 'STATION_METEO',
    isProxy: false,
    aggregationLevel: 'SITE',
    scientificMeaning: 'Moteur de création des collections d eau stagnante et du débordement des caniveaux.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-005',
    name: 'inondation_obs',
    label: 'Observation d inondation ou stagnation majeure',
    description: 'Indicateur binaire de survenue d un épisode d inondation sur la zone ou dans la concession lors de la visite.',
    type: 'BOOLEEN',
    domain: 'ENVIRONNEMENT',
    obligation: 'OBLIGATOIRE',
    source: 'ENQUETE',
    isProxy: false,
    aggregationLevel: 'MENAGE',
    scientificMeaning: 'Exposition physique aux eaux de crue et ruissellements contaminés.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-006',
    name: 'type_inondation',
    label: 'Type et gravité de l inondation observée',
    description: 'Catégorisation qualitative du type d inondation (débordement fluvial, stagnation pluviale, refoulement caniveau).',
    type: 'CATEGORIE',
    domain: 'ENVIRONNEMENT',
    categories: [
      { code: 'DEBORDEMENT_FLEUVE', label: 'Débordement direct du fleuve Lualaba' },
      { code: 'STAGNATION_PLUVIALE', label: 'Stagnation pluviale sur terrain argileux' },
      { code: 'REFOULEMENT_CANIVEAUX', label: 'Refoulement de caniveaux obstrués par déchets' },
      { code: 'AUCUNE', label: 'Aucune inondation' }
    ],
    obligation: 'CONDITIONNEL',
    conditionRule: 'OBLIGATOIRE SI inondation_obs == VRAI, FACULTATIF SINON',
    source: 'ENQUETE',
    isProxy: false,
    aggregationLevel: 'MENAGE',
    scientificMeaning: 'Distingue l étiologie hydro-environnementale des inondations urbaines.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-007',
    name: 'prox_ndwi_water',
    label: 'Indice NDWI satellite Sentinel-2 (Proxy d humidité de surface)',
    description: 'Indice Normalisé Différentiel d Eau (Normalized Difference Water Index) calculé à partir des bandes Green et NIR du capteur MSI Sentinel-2.',
    type: 'DECIMAL',
    unit: 'indice [-1; +1]',
    precision: 3,
    acceptableRange: { min: -1.0, max: 1.0 },
    domain: 'ENVIRONNEMENT',
    obligation: 'FACULTATIF',
    source: 'PROXY',
    isProxy: true,
    proxyDetails: {
      originalVariable: 'Surface mesurée in situ des gîtes larvaires permanents',
      justification: 'Absence de mesures in situ exhaustives quotidiennes dans les zones marécageuses inaccessibles d Alunguli.',
      sourceName: 'Sentinel-2 Level-2A (ESA / Copernicus)',
      scientificLimitation: 'Résolution spatiale de 10m masquant les petites collections d eau (< 1m²) sous canopée dense.'
    },
    aggregationLevel: 'AIRE_SANTE',
    scientificMeaning: 'Proxy de détection continue des surfaces en eau et zones marécageuses péri-urbaines.',
    version: 'V1.2',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-008',
    name: 'water_source_category',
    label: 'Source principale d approvisionnement en eau du ménage',
    description: 'Type de point d eau utilisé en priorité pour la boisson et la cuisson par le ménage enquêté.',
    type: 'CATEGORIE',
    domain: 'EAU_ASSAINISSEMENT',
    categories: [
      { code: 'REGIDESO_DOMICILE', label: 'Robinet REGIDESO raccordé dans la parcelle' },
      { code: 'BORNE_FONTAINE', label: 'Borne fontaine publique / Kiosque' },
      { code: 'FORAGE_MANUEL', label: 'Forage avec pompe manuelle protégée' },
      { code: 'PUITS_NON_PROTEGE', label: 'Puits ouvert non maçonné ni couvert' },
      { code: 'SOURCE_NATURELLE', label: 'Source naturelle aménagée ou non' },
      { code: 'FLEUVE_RIVIERE', label: 'Fleuve Lualaba ou rivière directe' }
    ],
    obligation: 'OBLIGATOIRE',
    source: 'ENQUETE',
    isProxy: false,
    aggregationLevel: 'MENAGE',
    scientificMeaning: 'Déterminant majeur de la qualité microbiologique de l eau ingérée (transmission typhoïde/diarrhées).',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  },
  {
    variableId: 'VAR-009',
    name: 'gps_coords',
    label: 'Coordonnées géographiques WGS84 (Lat, Lng, Précision)',
    description: 'Latitude, longitude et précision en mètres capturées par le récepteur GNSS du terminal enquêteur.',
    type: 'GPS',
    domain: 'SPATIAL',
    obligation: 'OBLIGATOIRE',
    source: 'ENQUETE',
    isProxy: false,
    aggregationLevel: 'MENAGE',
    scientificMeaning: 'Ancrage spatial rigoureux permettant l interpolation krigeage et les régressions spatiales.',
    version: 'V1.0',
    projectId: 'PRJ-KIN-001',
    isDemoData: true
  }
];

// ============================================================================
// 4. FORMULAIRES & VERSIONNEMENT (Forms Versioning & Migration Rules)
// ============================================================================

export const MOCK_PROJECT_FORM_VERSIONS: ProjectFormVersion[] = [
  {
    formId: 'FRM-OH-01-V10',
    projectId: 'PRJ-KIN-001',
    protocolId: 'PROT-2026-001',
    name: 'Questionnaire Ménage & Environnement One Health (V1.0 Initiale)',
    version: 'V1.0',
    releaseDate: '2026-01-20',
    author: 'Dr. Jean-Pierre Mukendi',
    questionsCount: 28,
    associatedVariables: ['cases_malaria_conf', 'temp_mean_c', 'precip_accum_mm', 'inondation_obs', 'water_source_category', 'gps_coords'],
    compatibleDatasetTypes: ['RAW', 'CLEAN'],
    changeLog: ['Création initiale du formulaire mobile pour la campagne pilote.'],
    status: 'OBSOLETE',
    isDemoData: true
  },
  {
    formId: 'FRM-OH-01-V11',
    projectId: 'PRJ-KIN-001',
    protocolId: 'PROT-2026-001',
    name: 'Questionnaire Intégré Palu–Typhoïde–Environnement (V1.1 Amendée)',
    version: 'V1.1',
    releaseDate: '2026-03-25',
    author: 'Dr. Marc Kasongo',
    questionsCount: 36,
    associatedVariables: [
      'cases_malaria_conf',
      'cases_typhoid_conf',
      'temp_mean_c',
      'precip_accum_mm',
      'inondation_obs',
      'type_inondation',
      'water_source_category',
      'gps_coords'
    ],
    compatibleDatasetTypes: ['RAW', 'CLEAN', 'ANALYTIC'],
    migrationRules: [
      {
        fromVariable: 'age_tranche',
        toVariable: 'age_annees_exact',
        transformationType: 'CAST_TYPE',
        formulaOrRule: 'age_annees_exact = mediane_tranche(age_tranche)',
        description: 'Conversion de la tranche d âge qualitative vers l âge numérique continu pour affiner la modélisation GAM.',
        effectiveFromVersion: 'V1.1'
      },
      {
        fromVariable: 'source_eau_brute',
        toVariable: 'water_source_category',
        transformationType: 'LOOKUP_MAP',
        formulaOrRule: 'Mapping des 4 anciennes modalités vers les 6 codes normalisés OMS/UNICEF JMP.',
        description: 'Harmonisation internationale des types de points d eau.',
        effectiveFromVersion: 'V1.1'
      }
    ],
    changeLog: [
      'Ajout des questions 29 à 36 relatives aux antécédents et diagnostics de fièvre typhoïde.',
      'Intégration du sous-menu conditionnel type d inondation.',
      'Activation du calcul de hash SHA-256 local à la soumission.'
    ],
    status: 'ACTIF',
    isDemoData: true
  }
];

// ============================================================================
// 5. DATASETS, SNAPSHOTS & DATA LINEAGE
// ============================================================================

export const MOCK_GOVERNANCE_DATASETS: GovernanceDataset[] = [
  {
    id: 'DS-RAW-2026',
    projectId: 'PRJ-KIN-001',
    name: 'Dataset Brut Terrain & Sources Externes (RAW)',
    type: 'RAW',
    version: 'V1.1',
    description: 'Ensemble immuable des observations de terrain brutes sans filtrage, incluant les doublons résolus et les fiches en contrôle.',
    recordsCount: 4250,
    variablesCount: 42,
    variables: ['cases_malaria_conf', 'cases_typhoid_conf', 'temp_mean_c', 'precip_accum_mm', 'inondation_obs', 'water_source_category', 'gps_coords'],
    createdAt: '2026-02-05 10:00',
    updatedAt: '2026-08-28 17:45',
    createdBy: 'Système de Synchronisation Terrain V1.18',
    isImmutable: false,
    sourceDataOrigin: 'Enquêtes mobiles locales + Registres SNIS-RDC + Mettelsat',
    appliedTransformations: ['Ingestion horodatée', 'Attribution local_id et server_id'],
    validationStatus: 'EN_CONTROLE',
    snapshots: [
      {
        snapshotId: 'SNP-RAW-2026-04-30',
        datasetId: 'DS-RAW-2026',
        name: 'Instantané RAW Fin Série 1 (Avril 2026)',
        createdAt: '2026-04-30 23:59',
        createdBy: 'Dr. Jean-Pierre Mukendi',
        rowsCount: 2120,
        columnsCount: 42,
        sha256Hash: 'a89f4b732d8c11e49afbf4c8996fb92427ae41e4649b934ca495991b7852a101',
        isImmutable: true,
        notes: 'Snapshot clôturant la première phase de collecte de la saison des pluies.'
      }
    ],
    sha256Hash: 'b71e89f4122d11e49afbf4c8996fb92427ae41e4649b934ca495991b7852c302',
    isDemoData: true
  },
  {
    id: 'DS-CLEAN-2026',
    projectId: 'PRJ-KIN-001',
    name: 'Dataset Nettoyé & Harmonisé (CLEAN)',
    type: 'CLEAN',
    version: 'V1.1',
    description: 'Données après application des contrôles de cohérence, détection des doublons, imputation des proxies et validation Niveau 2.',
    recordsCount: 4180,
    variablesCount: 40,
    variables: ['cases_malaria_conf', 'cases_typhoid_conf', 'temp_mean_c', 'precip_accum_mm', 'inondation_obs', 'type_inondation', 'water_source_category', 'gps_coords'],
    createdAt: '2026-03-01 14:00',
    updatedAt: '2026-08-29 11:20',
    createdBy: 'Module Nettoyage & Harmonisation V1.5 / V1.8',
    isImmutable: false,
    sourceDataOrigin: 'DS-RAW-2026 après pipeline de filtrage et normalisation spatio-temporelle',
    appliedTransformations: [
      'Suppression logique des doublons avérés avec traçabilité',
      'Normalisation des identifiants d aires de santé',
      'Harmonisation des unités de température (°C) et pluie (mm)'
    ],
    validationStatus: 'VALIDE',
    snapshots: [],
    sha256Hash: 'c92d88f4133e11e49afbf4c8996fb92427ae41e4649b934ca495991b7852d403',
    isDemoData: true
  },
  {
    id: 'DS-ANALYTIC-2026-V12',
    projectId: 'PRJ-KIN-001',
    name: 'Dataset Analytique Spatio-Temporel Intégré (ANALYTIC)',
    type: 'ANALYTIC',
    version: 'V1.2',
    description: 'Matrice analytique agrégée au niveau Aire de Santé × Mois / Semaine, avec calcul des lags temporels (0 à 8 semaines) et indices composites One Health.',
    recordsCount: 324,
    variablesCount: 28,
    variables: ['cases_malaria_conf', 'cases_typhoid_conf', 'temp_mean_c', 'precip_accum_mm', 'prox_ndwi_water', 'inondation_obs', 'water_source_category'],
    createdAt: '2026-04-15 16:30',
    updatedAt: '2026-08-29 18:00',
    createdBy: 'Laboratoire d Analyse V1.14 & Base Modèle V1.7',
    isImmutable: true,
    sourceDataOrigin: 'DS-CLEAN-2026 + Stations Mettelsat + Sentinel-2 NDWI',
    appliedTransformations: [
      'Agrégation spatiotemporelle mensuelle et hebdomadaire',
      'Calcul des lags pluviométriques (lag_1, lag_2, lag_4)',
      'Calcul de l indice composite de risque hydrique One Health'
    ],
    validationStatus: 'VALIDE',
    snapshots: [
      {
        snapshotId: 'SNP-ANALYTIC-2026-08-29',
        datasetId: 'DS-ANALYTIC-2026-V12',
        name: 'Snapshot Officiel Certification Validation V1.16',
        createdAt: '2026-08-29 18:30',
        createdBy: 'Comité Scientifique One Health Maniema',
        rowsCount: 324,
        columnsCount: 28,
        sha256Hash: 'f45a19c8322e11e49afbf4c8996fb92427ae41e4649b934ca495991b7852e904',
        isImmutable: true,
        notes: 'Snapshot certifié pour l entraînement des modèles GAM et la validation scientifique V1.16.'
      }
    ],
    sha256Hash: 'f45a19c8322e11e49afbf4c8996fb92427ae41e4649b934ca495991b7852e904',
    isDemoData: true
  }
];

// ============================================================================
// 6. GRAPH DE DATA LINEAGE (Source ➔ Raw ➔ Clean ➔ Analytic ➔ Model ➔ Report)
// ============================================================================

export const MOCK_DATA_LINEAGE_NODES: DataLineageNode[] = [
  {
    id: 'NODE-SRC-01',
    label: 'Enquêtes Mobiles Terrain V1.18',
    type: 'SOURCE',
    version: 'V1.1',
    date: '2026-08-28',
    details: '6 enquêteurs mobiles, géolocalisation GNSS, 3 850 fiches ménages collectées.',
    recordsCount: 3850,
    validationStatus: 'ACTIF'
  },
  {
    id: 'NODE-SRC-02',
    label: 'Station Mettelsat Kindu Aérodrome',
    type: 'SOURCE',
    version: 'V1.0',
    date: '2026-08-28',
    details: 'Relevés quotidiens température min/max et pluviométrie manuelle/automatique.',
    recordsCount: 960,
    validationStatus: 'CERTIFIE'
  },
  {
    id: 'NODE-SRC-03',
    label: 'Registres Sentinelles SNIS-RDC',
    type: 'SOURCE',
    version: 'V1.0',
    date: '2026-08-25',
    details: 'Rapports mensuels DHIS2 des 18 aires de santé (cas TDR+ et Widal+).',
    recordsCount: 324,
    validationStatus: 'VALIDE_DPS'
  },
  {
    id: 'NODE-RAW',
    label: 'DS-RAW-2026 (Dataset Brut)',
    type: 'RAW',
    version: 'V1.1',
    date: '2026-08-28',
    details: 'Centralisation des flux bruts avec horodatage immuable et hash SHA-256.',
    recordsCount: 4250,
    validationStatus: 'EN_CONTROLE'
  },
  {
    id: 'NODE-CLEAN',
    label: 'DS-CLEAN-2026 (Dataset Nettoyé)',
    type: 'CLEAN',
    version: 'V1.1',
    date: '2026-08-29',
    details: 'Suppression logique des doublons, imputation des proxies et validation Niveau 2.',
    recordsCount: 4180,
    validationStatus: 'VALIDE'
  },
  {
    id: 'NODE-ANALYTIC',
    label: 'DS-ANALYTIC-2026 (Matrice Intégrée)',
    type: 'ANALYTIC',
    version: 'V1.2',
    date: '2026-08-29',
    details: 'Matrice Aire de Santé × Mois, calcul des lags 0 à 8 semaines et indices One Health.',
    recordsCount: 324,
    validationStatus: 'CERTIFIE_IMMUTABLE'
  },
  {
    id: 'NODE-MODEL',
    label: 'MOD-GAM-PALU-01 (Modèle GAM Splines)',
    type: 'MODEL',
    version: 'V1.15',
    date: '2026-08-29',
    details: 'Modèle additif généralisé avec splines pénalisées sur température, lag-pluie et distance fleuve.',
    recordsCount: 1,
    validationStatus: 'VALIDE_SCIENTIFIQUE'
  },
  {
    id: 'NODE-PREDICTION',
    label: 'Cartographie Prédictive du Risque S2-2026',
    type: 'PREDICTION',
    version: 'V1.16',
    date: '2026-08-29',
    details: 'Prédiction spatiale haute résolution des foyers à haut risque à Kasuku et Alunguli.',
    recordsCount: 18,
    validationStatus: 'CALIBRE'
  },
  {
    id: 'NODE-SURVEILLANCE',
    label: 'Moteur de Signaux & Alertes V1.17',
    type: 'SURVEILLANCE',
    version: 'V1.17',
    date: '2026-08-30',
    details: 'Algorithme C-SUM / Farrington et détection des dépassements de seuils épidémiques.',
    recordsCount: 7,
    validationStatus: 'OPERATIONNEL'
  },
  {
    id: 'NODE-REPORT',
    label: 'Rapport Épidémiologique Certifié DPS-MAN-2026-Q3',
    type: 'REPORT',
    version: 'V1.0',
    date: '2026-08-30',
    details: 'Rapport complet consolidé avec métadonnées méthodologiques et traçabilité de provenance.',
    recordsCount: 1,
    validationStatus: 'PUBLIE'
  }
];

export const MOCK_DATA_LINEAGE_EDGES: DataLineageEdge[] = [
  { from: 'NODE-SRC-01', to: 'NODE-RAW', transformation: 'Ingestion Terrain', rule: 'Attribution local_id, server_id, vérification géofencing' },
  { from: 'NODE-SRC-02', to: 'NODE-RAW', transformation: 'Importation Météo', rule: 'Validation format CSV Mettelsat et calcul de hash' },
  { from: 'NODE-SRC-03', to: 'NODE-RAW', transformation: 'Intégration SNIS', rule: 'Contrôle concordance des codes aires de santé' },
  { from: 'NODE-RAW', to: 'NODE-CLEAN', transformation: 'Pipeline Nettoyage V1.5/V1.8', rule: 'Suppression logique doublons, correction valeurs aberrantes, validation N2' },
  { from: 'NODE-CLEAN', to: 'NODE-ANALYTIC', transformation: 'Agrégation Spatio-Temporelle', rule: 'Groupement par AS×Mois, calcul des retards temporels (lags 1 à 8)' },
  { from: 'NODE-ANALYTIC', to: 'NODE-MODEL', transformation: 'Apprentissage Statistique', rule: 'Calibrage GAM (Splines pénalisées, k=5, famille quasi-Poisson)' },
  { from: 'NODE-MODEL', to: 'NODE-PREDICTION', transformation: 'Inférence Spatiale V1.16', rule: 'Projection prédictive sur maillage SIG et calcul IC 95%' },
  { from: 'NODE-PREDICTION', to: 'NODE-SURVEILLANCE', transformation: 'Surveillance Dynamique V1.17', rule: 'Comparaison seuils alertes C-SUM vs incidence prédite' },
  { from: 'NODE-SURVEILLANCE', to: 'NODE-REPORT', transformation: 'Génération Rapport', rule: 'Consolidation avec métadonnées complètes et traçabilité ascendante' }
];

// ============================================================================
// 7. SOURCES EXTERNES & AUDIT D'IMPORT AVEC HASH
// ============================================================================

export const MOCK_EXTERNAL_SOURCES: ExternalDataSource[] = [
  {
    id: 'SRC-EXT-METTELSAT',
    name: 'Agence Nationale de Météorologie et de Télédétection par Satellite (METTELSAT RDC)',
    organization: 'Ministère des Transports, RDC',
    type: 'CLIMAT',
    coveragePeriod: '2020–2026 (Mensuel & Journalier)',
    spatialResolution: 'Station ponctuelle Kindu Aérodrome (Lat -2.95, Lng 25.91)',
    temporalResolution: 'Journalière / Mensuelle',
    accessMethod: 'IMPORT_EXCEL_CSV',
    lastAccessedDate: '2026-08-20',
    scientificReference: 'Bulletins Agrométéorologiques Décadaires METTELSAT Maniema (2020-2026)',
    providedVariables: ['temp_mean_c', 'precip_accum_mm', 'humidity_rel_pct'],
    reliabilityScore: 94,
    notes: 'Source officielle primaire pour les données météorologiques in situ de Kindu.',
    isDemoData: true
  },
  {
    id: 'SRC-EXT-CHIRPS',
    name: 'Climate Hazards Center InfraRed Precipitation with Station data (CHIRPS v2.0)',
    organization: 'USGS / Earth Resources Observation and Science (EROS) Center & UCSB',
    type: 'CLIMAT',
    coveragePeriod: '2020–2026 (Quotidien / Pentades)',
    spatialResolution: 'Grille satellite 0.05° (~5.3 km sur Kindu)',
    temporalResolution: 'Décadaire / Mensuelle',
    accessMethod: 'API',
    lastAccessedDate: '2026-08-25',
    scientificReference: 'Funk et al., 2015. The climate hazards infrared precipitation with stations.',
    providedVariables: ['precip_accum_mm', 'rainfall_anomalies_zscore'],
    reliabilityScore: 91,
    notes: 'Utilisé pour combler les interruptions ponctuelles du pluviomètre physique.',
    isDemoData: true
  },
  {
    id: 'SRC-EXT-SENTINEL2',
    name: 'Copernicus Sentinel-2 Level-2A Surface Reflectance',
    organization: 'Agence Spatiale Européenne (ESA)',
    type: 'ENVIRONNEMENT_SATELLITE',
    coveragePeriod: '2025–2026 (Passage tous les 5 jours)',
    spatialResolution: 'Pixels 10m × 10m',
    temporalResolution: 'Décadaire (composite sans nuages)',
    accessMethod: 'API',
    lastAccessedDate: '2026-08-27',
    scientificReference: 'ESA Copernicus Open Access Hub & Planetary Computer',
    providedVariables: ['prox_ndwi_water', 'ndvi_vegetation_index'],
    reliabilityScore: 89,
    notes: 'Proxy d humidité et de présence d eau stagnante péri-urbaine.',
    isDemoData: true
  }
];

export const MOCK_FILE_IMPORT_AUDITS: FileImportAudit[] = [
  {
    importId: 'IMP-2026-08-20-001',
    fileName: 'METTELSAT_KINDU_SERIES_2026_Q1_Q2.xlsx',
    fileFormat: 'EXCEL',
    fileSizeBytes: 458200,
    sha256Hash: '9e7b23c84f1a23e49afbf4c8996fb92427ae41e4649b934ca495991b7852ff11',
    importDate: '2026-08-20 14:15',
    importedBy: 'Dr. Marc Kasongo',
    projectId: 'PRJ-KIN-001',
    campaignId: 'CAMP-2026-01',
    rowsDetected: 182,
    columnsDetected: 12,
    importedSuccessfully: 182,
    errorsCount: 0,
    isPotentialDuplicate: false,
    destinationDatasetId: 'DS-RAW-2026',
    isDemoData: true
  },
  {
    importId: 'IMP-2026-08-25-002',
    fileName: 'METTELSAT_KINDU_SERIES_2026_Q1_Q2_COPY.xlsx',
    fileFormat: 'EXCEL',
    fileSizeBytes: 458200,
    sha256Hash: '9e7b23c84f1a23e49afbf4c8996fb92427ae41e4649b934ca495991b7852ff11',
    importDate: '2026-08-25 09:30',
    importedBy: 'Assistant Saisie Paulin',
    projectId: 'PRJ-KIN-001',
    campaignId: 'CAMP-2026-01',
    rowsDetected: 182,
    columnsDetected: 12,
    importedSuccessfully: 0,
    errorsCount: 1,
    isPotentialDuplicate: true,
    duplicateOfImportId: 'IMP-2026-08-20-001',
    destinationDatasetId: 'DS-RAW-2026',
    isDemoData: true
  }
];

// ============================================================================
// 8. DÉFINITIONS OPÉRATIONNELLES DE CAS & RUPTURES DE COMPARABILITÉ
// ============================================================================

export const MOCK_CASE_DEFINITIONS: CaseDefinition[] = [
  {
    id: 'DEF-PALU-V11',
    pathology: 'Paludisme',
    version: 'V1.1',
    suspectedCaseCriteria: [
      'Fièvre actuelle (température axillaire ≥ 37.5°C) ou antécédent de fièvre dans les 48 dernières heures',
      'Céphalées, courbatures, frissons ou sueurs inexpliquées chez un résident de Kindu'
    ],
    probableCaseCriteria: [
      'Cas suspect traité présomptivement par antipaludique (CTA) en l absence temporaire de test biologique'
    ],
    confirmedCaseCriteria: [
      'Cas suspect avec confirmation biologique positive par Test de Diagnostic Rapide (TDR Pf/Pan) OU examen microscopique (Goutte Épaisse / Frottis sanguin positif)'
    ],
    laboratoryConfirmationMethods: [
      'TDR SD Bioline Malaria Ag P.f/Pan',
      'Microscopie optique à immersion (Goutte Épaisse colorée au Giemsa 10%)'
    ],
    effectiveDate: '2026-01-01',
    isComparabilityBroken: false,
    scientificAuthor: 'Programme National de Lutte contre le Paludisme (PNLP RDC) & DPS Maniema',
    status: 'ACTIF',
    isDemoData: true
  },
  {
    id: 'DEF-TYPHOID-V11',
    pathology: 'Fièvre Typhoïde',
    version: 'V1.1',
    suspectedCaseCriteria: [
      'Fièvre prolongée inexpliquée continue (≥ 3 jours) avec céphalées intenses, asthénie et troubles digestifs (douleurs abdominales, diarrhée ou constipation)',
      'Dissociation pouls-température ou tuphos'
    ],
    probableCaseCriteria: [
      'Cas suspect avec sérologie de Widal positive (Titre Anticorps anti-O ≥ 1/160 et anti-H ≥ 1/160)'
    ],
    confirmedCaseCriteria: [
      'Isolement bactériologique de Salmonella enterica sérotype Typhi à l hémoculture, coproculture ou culture de moelle osseuse'
    ],
    laboratoryConfirmationMethods: [
      'Hémoculture automatisée / manuelle sur milieu sélectif SS/MacConkey',
      'Séro-agglutination de Widal-Félix (critère probable sous réserve des faux-positifs)'
    ],
    effectiveDate: '2026-03-15',
    isComparabilityBroken: true,
    comparabilityWarning: 'Rupture méthodologique V1.1 : L introduction du seuil strict Widal ≥ 1/160 couplé à l hémoculture réduit les faux-positifs de 34% par rapport aux déclarations cliniques antérieures à mars 2026.',
    scientificAuthor: 'Comité d Épidémiologie et Surveillance des Maladies Entériques (DPS Maniema)',
    status: 'ACTIF',
    isDemoData: true
  }
];

// ============================================================================
// 9. VALIDATION MULTI-NIVEAUX & STATUTS DES DONNÉES
// ============================================================================

export const MOCK_MULTILEVEL_VALIDATIONS: MultiLevelValidationRecord[] = [
  {
    id: 'VAL-REC-001',
    projectId: 'PRJ-KIN-001',
    entityType: 'OBSERVATION_INDIVIDUELLE',
    entityIdentifier: 'LOCAL-2027-000001 (Kasuku-Basoko)',
    currentStatus: 'VALIDEE',
    isLogicallyDeleted: false,
    validationSteps: [
      {
        level: 'NIVEAU_1_TECHNIQUE',
        passed: true,
        validatedBy: 'Sync Engine Automatique',
        validatedAt: '2026-08-28 10:15',
        comment: 'Format JSON conforme, coordonnées GPS dans l aire de santé, aucun champ requis manquant.'
      },
      {
        level: 'NIVEAU_2_QUALITE',
        passed: true,
        validatedBy: 'Superviseur Papa Léon',
        validatedAt: '2026-08-28 14:00',
        comment: 'Cohérence vérifiée (âge 34 ans, TDR+ concordant avec le registre du centre de santé).'
      },
      {
        level: 'NIVEAU_3_SCIENTIFIQUE',
        passed: true,
        validatedBy: 'Dr. Marc Kasongo',
        validatedAt: '2026-08-29 09:30',
        comment: 'Concordance avec la définition de cas standard V1.1 PNLP.'
      },
      {
        level: 'NIVEAU_4_FINALE',
        passed: true,
        validatedBy: 'Dr. Jean-Pierre Mukendi',
        validatedAt: '2026-08-29 17:00',
        comment: 'Approbation finale pour injection dans le dataset analytique DS-ANALYTIC-2026-V12.'
      }
    ],
    correctionsHistory: [],
    isDemoData: true
  },
  {
    id: 'VAL-REC-002',
    projectId: 'PRJ-KIN-001',
    entityType: 'OBSERVATION_INDIVIDUELLE',
    entityIdentifier: 'LOCAL-2027-000004 (Alunguli-Fleuve)',
    currentStatus: 'CORRIGEE',
    isLogicallyDeleted: false,
    validationSteps: [
      {
        level: 'NIVEAU_1_TECHNIQUE',
        passed: true,
        validatedBy: 'Sync Engine Automatique',
        validatedAt: '2026-08-28 11:00',
        comment: 'Format intègre.'
      },
      {
        level: 'NIVEAU_2_QUALITE',
        passed: false,
        validatedBy: 'Superviseur Maman Jeanne',
        validatedAt: '2026-08-28 15:30',
        comment: 'Incohérence détectée : Nombre de moustiquaires déclarées (120) disproportionné pour un ménage de 4 personnes.'
      }
    ],
    correctionsHistory: [
      {
        field: 'nb_moustiquaires_impregnees',
        oldValue: 120,
        newValue: 2,
        reason: 'Erreur de frappe terminal mobile (saisie double zéro accidentelle) corrigée après vérification auprès de l enquêteur.',
        user: 'Superviseur Maman Jeanne',
        timestamp: '2026-08-28 16:00'
      }
    ],
    isDemoData: true
  },
  {
    id: 'VAL-REC-003',
    projectId: 'PRJ-KIN-001',
    entityType: 'OBSERVATION_INDIVIDUELLE',
    entityIdentifier: 'LOCAL-2027-000007 (Doublon Test)',
    currentStatus: 'REJETEE',
    isLogicallyDeleted: true,
    deletionReason: 'Doublon strict de transmission envoyé 2 fois suite à coupure réseau 3G, marqué pour suppression logique.',
    deletedBy: 'Dr. Marc Kasongo',
    deletedAt: '2026-08-29 10:00',
    validationSteps: [
      {
        level: 'NIVEAU_1_TECHNIQUE',
        passed: false,
        validatedBy: 'Détecteur de Doublons V1.18',
        validatedAt: '2026-08-28 18:00',
        comment: 'Empreinte de contenu identique à LOCAL-2027-000006 à 100%.'
      }
    ],
    rejectionReason: 'Doublon technique résolu sans suppression physique de la base d audit.',
    correctionsHistory: [],
    isDemoData: true
  }
];

// ============================================================================
// 10. PERMISSIONS PAR PROJET & RBAC
// ============================================================================

export const MOCK_PROJECT_PERMISSIONS: ProjectUserPermission[] = [
  {
    userId: 'USR-001',
    userName: 'Dr. Jean-Pierre Mukendi',
    userRole: 'ADMINISTRATEUR',
    projectId: 'PRJ-KIN-001',
    canCollect: true,
    canAccessData: true,
    canAnalyze: true,
    canModel: true,
    canSurveil: true,
    canExport: true,
    canAdminister: true,
    grantedBy: 'Système Central DPS',
    grantedAt: '2026-01-15 08:30'
  },
  {
    userId: 'USR-002',
    userName: 'Dr. Marc Kasongo',
    userRole: 'RESPONSABLE_CAMPAGNE',
    projectId: 'PRJ-KIN-001',
    canCollect: true,
    canAccessData: true,
    canAnalyze: true,
    canModel: true,
    canSurveil: true,
    canExport: true,
    canAdminister: false,
    grantedBy: 'Dr. Jean-Pierre Mukendi',
    grantedAt: '2026-01-16 10:00'
  },
  {
    userId: 'USR-003',
    userName: 'Léon Kalema (Superviseur Kasuku)',
    userRole: 'SUPERVISEUR',
    projectId: 'PRJ-KIN-001',
    canCollect: true,
    canAccessData: true,
    canAnalyze: false,
    canModel: false,
    canSurveil: true,
    canExport: false,
    canAdminister: false,
    grantedBy: 'Dr. Marc Kasongo',
    grantedAt: '2026-01-20 09:00'
  },
  {
    userId: 'USR-004',
    userName: 'Amisi Lumumba (Enquêteur ENQ-0001)',
    userRole: 'ENQUETEUR',
    projectId: 'PRJ-KIN-001',
    canCollect: true,
    canAccessData: false,
    canAnalyze: false,
    canModel: false,
    canSurveil: false,
    canExport: false,
    canAdminister: false,
    grantedBy: 'Léon Kalema',
    grantedAt: '2026-02-01 07:30'
  },
  {
    userId: 'USR-005',
    userName: 'Dr. Chantal Yuma (Contrôleur Qualité)',
    userRole: 'CONTROLEUR_QUALITE',
    projectId: 'PRJ-KIN-001',
    canCollect: false,
    canAccessData: true,
    canAnalyze: true,
    canModel: false,
    canSurveil: true,
    canExport: true,
    canAdminister: false,
    grantedBy: 'Dr. Jean-Pierre Mukendi',
    grantedAt: '2026-01-25 11:00'
  },
  {
    userId: 'USR-006',
    userName: 'Observateur Partenaire OMS / CDC',
    userRole: 'OBSERVATEUR',
    projectId: 'PRJ-KIN-001',
    canCollect: false,
    canAccessData: true,
    canAnalyze: true,
    canModel: false,
    canSurveil: true,
    canExport: false,
    canAdminister: false,
    grantedBy: 'Dr. Jean-Pierre Mukendi',
    grantedAt: '2026-03-01 14:00'
  }
];

// ============================================================================
// 11. MODÈLES & ANALYSES REPRODUCTIBLES
// ============================================================================

export const MOCK_REPRODUCIBLE_MODELS: ReproducibleModel[] = [
  {
    modelId: 'MOD-GAM-PALU-01',
    projectId: 'PRJ-KIN-001',
    name: 'Modèle Additif Généralisé (GAM) Paludisme Kindu V1.15',
    algorithmType: 'GAM_SPLINES',
    version: 'V1.15',
    sourceDatasetId: 'DS-ANALYTIC-2026-V12',
    sourceDatasetVersion: 'V1.2',
    dependentVariable: 'cases_malaria_conf',
    independentVariables: ['temp_mean_c', 'precip_accum_mm (lag 2)', 'dist_water_body_m', 'prox_ndwi_water'],
    hyperparameters: {
      family: 'Quasi-Poisson (log-link)',
      splineBasis: 'Thin Plate Regression Splines',
      basisDimension_k: 5,
      smoothingParameterEstimation: 'REML',
      dispersionParameter: 1.84
    },
    performanceMetrics: {
      r_squared: 0.824,
      aic: 894.2,
      bic: 922.6,
      mae: 4.82,
      rmse: 6.95,
      sensitivity: 0.88,
      specificity: 0.91
    },
    author: 'Dr. Jean-Pierre Mukendi & Laboratoire de Biostatistique',
    trainingDate: '2026-08-29 16:30',
    governanceStatus: 'VALIDE',
    allowedForOperationalAlerts: true,
    reproducibilityScriptSnippet: `library(mgcv)\ngam_model <- gam(cases_malaria_conf ~ s(temp_mean_c, k=5) + s(precip_lag2, k=5) + s(dist_water_m, k=5), family=quasipoisson(link="log"), data=ds_analytic_v12, method="REML")\nsummary(gam_model)`,
    isDemoData: true
  },
  {
    modelId: 'MOD-RF-TYPH-EXP',
    projectId: 'PRJ-KIN-001',
    name: 'Forêt Aléatoire Prédictive Typhoïde (Expérimental)',
    algorithmType: 'RANDOM_FOREST',
    version: 'V0.8-EXP',
    sourceDatasetId: 'DS-ANALYTIC-2026-V12',
    sourceDatasetVersion: 'V1.2',
    dependentVariable: 'cases_typhoid_conf',
    independentVariables: ['inondation_obs', 'water_source_category', 'precip_accum_mm', 'density_latrines'],
    hyperparameters: {
      n_estimators: 300,
      max_depth: 8,
      min_samples_split: 4,
      criterion: 'gini'
    },
    performanceMetrics: {
      auc_roc: 0.762,
      sensitivity: 0.72,
      specificity: 0.79
    },
    author: 'Stagiaire Statisticien Alain',
    trainingDate: '2026-08-30 08:00',
    governanceStatus: 'EXPERIMENTAL',
    allowedForOperationalAlerts: false, // INTERDICTION STRICTE D'ALIMENTER LES ALERTES
    reproducibilityScriptSnippet: `from sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=300, max_depth=8, random_state=42)\nrf.fit(X_train, y_train)`,
    isDemoData: true
  }
];

export const MOCK_REPRODUCIBLE_ANALYSES: ReproducibleAnalysis[] = [
  {
    analysisId: 'ANA-2026-001',
    projectId: 'PRJ-KIN-001',
    title: 'Analyse des Corrélations Croisées et Lags Pluviométrie vs Paludisme (0 à 8 semaines)',
    method: 'Cross-Correlation Function (CCF) avec désaisonnalisation préalable',
    datasetId: 'DS-ANALYTIC-2026-V12',
    datasetVersion: 'V1.2',
    variables: ['precip_accum_mm', 'cases_malaria_conf'],
    parameters: {
      maxLagWeeks: 8,
      detrendMethod: 'Différenciation première',
      significanceLevel: 0.05
    },
    executedBy: 'Dr. Marc Kasongo',
    executedAt: '2026-08-29 17:15',
    softwareVersion: 'R 4.3.3 / One Health Analytics Core v1.14',
    resultsSummary: {
      peakLagWeek: 2,
      peakCorrelationCoefficient: 0.742,
      pValue: 0.00018,
      interpretation: 'Pic de corrélation hautement significatif à lag = 2 semaines après les précipitations fortes.'
    },
    isReproducedSuccessfully: true,
    reproductionNotes: 'Test de reproductibilité exécuté avec succès le 30/08/2026 : coefficients rigoureusement identiques à 10^-6.',
    isDemoData: true
  }
];

// ============================================================================
// 12. COMPARATEUR DE VERSIONS (Diff Viewer)
// ============================================================================

export const MOCK_VERSION_DIFFS: VersionDiffResult[] = [
  {
    entityType: 'DATASET',
    versionA: 'DS-ANALYTIC-V1.0',
    versionB: 'DS-ANALYTIC-V1.2',
    differences: [
      {
        category: 'AJOUT',
        item: 'Variable `cases_typhoid_conf`',
        details: 'Intégration des cas confirmés de typhoïde suite à l amendement du protocole.'
      },
      {
        category: 'AJOUT',
        item: 'Variable `prox_ndwi_water`',
        details: 'Ajout du proxy Sentinel-2 pour les surfaces en eau.'
      },
      {
        category: 'MODIFICATION',
        item: 'Période couverte',
        details: 'Extension de la série temporelle : passage de 4 mois (Fév–Mai 2026) à 7 mois (Fév–Août 2026).'
      }
    ],
    isCompatible: true,
    migrationActionRequired: 'Aucune action bloquante : compatibilité ascendante rétroactive préservée.'
  },
  {
    entityType: 'FORMULAIRE',
    versionA: 'FRM-OH-01-V1.0',
    versionB: 'FRM-OH-01-V1.1',
    differences: [
      {
        category: 'AJOUT',
        item: 'Questions 29 à 36 (Typhoïde & Eau)',
        details: '8 nouvelles questions d enquête sur la qualité de l eau de boisson et antécédents fébriles.'
      },
      {
        category: 'MODIFICATION',
        item: 'Question 14 (Type de point d eau)',
        details: 'Passage de 4 modalités simples à 6 catégories standardisées OMS/JMP.'
      }
    ],
    isCompatible: true,
    migrationActionRequired: 'Règle de migration automatique appliquée via la table de correspondance lookup.'
  },
  {
    entityType: 'PROTOCOLE',
    versionA: 'PROT-2026-V1.0',
    versionB: 'PROT-2026-V1.2',
    differences: [
      {
        category: 'MODIFICATION',
        item: 'Objectif Principal',
        details: 'Intégration conjointe du paludisme ET de la fièvre typhoïde (approche multi-pathologies One Health).'
      },
      {
        category: 'AJOUT',
        item: 'Source Climat Mettelsat',
        details: 'Convention de partenariat formelle intégrant la station automatique de Kindu Aérodrome.'
      }
    ],
    isCompatible: true
  }
];

// ============================================================================
// 13. DASHBOARD GOUVERNANCE & SCORE DE QUALITÉ EXPLICABLE
// ============================================================================

export const MOCK_GOVERNANCE_QUALITY_SCORE: GovernanceQualityScore = {
  totalScore: 88.4,
  breakdown: {
    completeness: 92.0, // Taux de complétude des variables clés requises
    consistency: 89.5, // Conformité aux règles de cohérence et plages
    traceability: 96.0, // Data lineage complet de la source au rapport
    documentation: 82.0, // Métadonnées scientifiques et dictionnaires renseignés
    validationCoverage: 82.5 // Taux de validation multi-niveaux (N1 à N4)
  },
  grade: 'EXCELLENT',
  explanation: [
    'Complétude (92.0%) : Moins de 3.2% de valeurs manquantes sur les variables cliniques et climatiques prioritaires.',
    'Cohérence (89.5%) : 98.4% des règles d intégrité validées sans contradiction logique.',
    'Traçabilité (96.0%) : 100% des datasets et modèles disposent d un arbre de provenance certifié avec hash SHA-256.',
    'Documentation (82.0%) : Toutes les variables du dictionnaire possèdent une définition scientifique et une unité explicite.',
    'Validation (82.5%) : 4 180 enregistrements validés aux Niveaux 1 & 2, 324 enregistrements agrégés certifiés Niveaux 3 & 4.'
  ]
};

export const MOCK_GOVERNANCE_ALERTS: GovernanceAlert[] = [
  {
    id: 'ALT-GOV-001',
    severity: 'AVERTISSEMENT',
    category: 'MODELE_NON_VALIDE_ALERTE',
    title: 'Modèle Expérimental Détecté Hors Alerte Opérationnelle',
    description: 'Le modèle Forêt Aléatoire `MOD-RF-TYPH-EXP` possède le statut EXPERIMENTAL. Il est strictement isolé et interdit d alimentation automatique du module d alerte précoce.',
    affectedResource: 'MOD-RF-TYPH-EXP (Typhoïde)',
    suggestedAction: 'Finaliser la validation scientifique Niveau 3 avant de solliciter l autorisation opérationnelle.',
    isResolved: false
  },
  {
    id: 'ALT-GOV-002',
    severity: 'INFO',
    category: 'PROTOCOLE_AMENDE_SANS_VERSION',
    title: 'Rupture de Comparabilité Documentée sur la Typhoïde (V1.1)',
    description: 'La définition de cas de fièvre typhoïde amendée en mars 2026 introduit le critère Widal ≥ 1/160. L avertissement de rupture temporelle est actif pour les graphiques rétrospectifs.',
    affectedResource: 'DEF-TYPHOID-V11',
    suggestedAction: 'Maintenir la note méthodologique visible sur les exports et rapports officiels.',
    isResolved: true
  }
];

// ============================================================================
// 14. JOURNAL D'AUDIT CENTRALISÉ RENFORCÉ (IMMUTABLE)
// ============================================================================

export const MOCK_CENTRAL_AUDIT_LOG: CentralAuditLogEntry[] = [
  {
    id: 'AUD-GOV-001',
    timestamp: '2026-08-30 08:15:22',
    projectId: 'PRJ-KIN-001',
    userId: 'USR-001',
    userName: 'Dr. Jean-Pierre Mukendi',
    userRole: 'ADMINISTRATEUR',
    actionType: 'CREATION_SNAPSHOT',
    entityType: 'SNAPSHOT',
    entityId: 'SNP-ANALYTIC-2026-08-29',
    description: 'Génération et scellement cryptographique du Snapshot officiel DS-ANALYTIC-2026-V12 (Hash SHA-256 certifié).',
    details: { rowsCount: 324, sha256: 'f45a19c8322e11e49afbf4c8996fb92427ae41e4649b934ca495991b7852e904' },
    ipOrDeviceId: '197.234.218.44 (Kindu-DPS-LAN)',
    isImmutable: true,
    isDemoData: true
  },
  {
    id: 'AUD-GOV-002',
    timestamp: '2026-08-29 17:15:00',
    projectId: 'PRJ-KIN-001',
    userId: 'USR-002',
    userName: 'Dr. Marc Kasongo',
    userRole: 'RESPONSABLE_CAMPAGNE',
    actionType: 'REPRODUCTION_ANALYSE',
    entityType: 'ANALYSE',
    entityId: 'ANA-2026-001',
    description: 'Exécution du test automatisé de reproductibilité de l analyse des lags pluviométriques.',
    details: { resultMatches: true, deltaTolerance: 0.0 },
    ipOrDeviceId: '197.234.218.48',
    isImmutable: true,
    isDemoData: true
  },
  {
    id: 'AUD-GOV-003',
    timestamp: '2026-08-29 10:00:14',
    projectId: 'PRJ-KIN-001',
    userId: 'USR-002',
    userName: 'Dr. Marc Kasongo',
    userRole: 'RESPONSABLE_CAMPAGNE',
    actionType: 'SUPPRESSION_LOGIQUE',
    entityType: 'DATASET',
    entityId: 'LOCAL-2027-000007',
    description: 'Suppression logique d un doublon avéré avec conservation intégrale dans l historique d audit.',
    details: { reason: 'Doublon technique 100% de LOCAL-2027-000006' },
    ipOrDeviceId: '197.234.218.48',
    isImmutable: true,
    isDemoData: true
  },
  {
    id: 'AUD-GOV-004',
    timestamp: '2026-08-25 09:30:45',
    projectId: 'PRJ-KIN-001',
    userId: 'USR-004',
    userName: 'Assistant Saisie Paulin',
    userRole: 'ENQUETEUR',
    actionType: 'IMPORT_FICHIER',
    entityType: 'IMPORT',
    entityId: 'IMP-2026-08-25-002',
    description: 'Alerte doublon fichier détectée lors de l import du fichier METTELSAT_KINDU_SERIES_2026_Q1_Q2_COPY.xlsx.',
    details: { sha256DuplicateWith: 'IMP-2026-08-20-001', action: 'Import bloqué sans écrasement' },
    ipOrDeviceId: '105.235.112.19',
    isImmutable: true,
    isDemoData: true
  }
];

// ============================================================================
// 15. BANC D'ESSAI DE 10 SCÉNARIOS DE TEST AUTOMATISÉS V1.19
// ============================================================================

export const MOCK_GOVERNANCE_TESTS_V119: V119GovernanceScenarioTest[] = [
  {
    id: 1,
    code: 'TEST-GOV-01',
    title: 'Isolation Stricte Inter-Projets (Projet A vs Projet B)',
    category: 'TEST_ISOLATION_MULTI_PROJETS',
    description: 'Vérifier que les données, protocoles, formulaires et modèles du Projet Pilote Kindu (PRJ-KIN-001) ne sont jamais mélangés avec ceux du Projet Zoonoses (PRJ-KAS-002).',
    status: 'PASSED',
    steps: [
      'Sélectionner le Projet Pilote Kindu (PRJ-KIN-001) et lister ses 5 datasets.',
      'Basculer vers le Projet Sentinelle Zoonoses (PRJ-KAS-002).',
      'Vérifier que seuls les 2 datasets et protocoles propres à Kasongo sont affichés.',
      'Tenter une requête transversale non autorisée et vérifier le blocage de sécurité.'
    ],
    expectedOutcome: 'Isolation hermétique 100% : aucune fuite de données inter-projets sans accord explicite.',
    actualOutcome: 'Validé : cloisonnement strict des contextes d état et des identifiants de projet.',
    lastRunDate: '2026-08-30 08:30'
  },
  {
    id: 2,
    code: 'TEST-GOV-02',
    title: 'Versionnement des Datasets & Snapshots Immutables',
    category: 'TEST_VERSIONNEMENT_DATASETS',
    description: 'Créer un Snapshot du dataset analytique et vérifier qu une modification ultérieure crée une nouvelle version (V1.2 -> V1.3) sans altérer le snapshot antérieur.',
    status: 'PASSED',
    steps: [
      'Générer un Snapshot certifié du dataset analytique avec hash SHA-256.',
      'Effectuer une mise à jour d observation sur le dataset source.',
      'Vérifier que le Snapshot historique reste rigoureusement inchangé.',
      'Confirmer l incrémentation de la version du dataset en V1.3.'
    ],
    expectedOutcome: 'Immutabilité absolue des snapshots validés et traçabilité des incréments de version.',
    actualOutcome: 'Validé : hash SHA-256 certifié préservé sans régression.',
    lastRunDate: '2026-08-30 08:32'
  },
  {
    id: 3,
    code: 'TEST-GOV-03',
    title: 'Versionnement des Formulaires & Règles de Migration',
    category: 'TEST_VERSIONNEMENT_FORMULAIRES',
    description: 'Vérifier la compatibilité ascendante entre Formulaire V1.0 et V1.1 avec application de la règle de migration de tranche d âge vers âge numérique continu.',
    status: 'PASSED',
    steps: [
      'Charger une observation collectée avec le formulaire V1.0.',
      'Appliquer le moteur de migration vers le schéma V1.1.',
      'Vérifier la conversion automatique de la variable sans perte d information.',
      'Conserver la trace de la transformation dans les métadonnées.'
    ],
    expectedOutcome: 'Migration réussie sans altération de l historique source.',
    actualOutcome: 'Validé : compatibilité multi-versions opérationnelle.',
    lastRunDate: '2026-08-30 08:35'
  },
  {
    id: 4,
    code: 'TEST-GOV-04',
    title: 'Amendement Majeur de Protocole & Versionnement V1.0 ➔ V1.2',
    category: 'TEST_AMENDEMENT_PROTOCOLE',
    description: 'Modifier la population cible et les critères d inclusion d un protocole et vérifier que le système génère obligatoirement une nouvelle version V1.2 avec justification.',
    status: 'PASSED',
    steps: [
      'Soumettre une modification de critère épidémiologique sur le protocole.',
      'Détecter le flag isMajorChange = true.',
      'Exiger la saisie d une justification scientifique obligatoire.',
      'Générer l entrée V1.2 dans l historique immuable du protocole.'
    ],
    expectedOutcome: 'Interdiction de modification silencieuse ; traçabilité totale des amendements majeurs.',
    actualOutcome: 'Validé : historique chronologique scellé avec auteur et motif.',
    lastRunDate: '2026-08-30 08:37'
  },
  {
    id: 5,
    code: 'TEST-GOV-05',
    title: 'Traçabilité Ascendante & Graphe de Data Lineage',
    category: 'TEST_PROVENANCE_DATA_LINEAGE',
    description: 'Partir d un résultat dans le rapport scientifique final et remonter récursivement jusqu à la station météo source et aux fiches d enquêtes initiales.',
    status: 'PASSED',
    steps: [
      'Sélectionner le Rapport DPS-MAN-2026-Q3.',
      'Naviguer dans le graphe de lignage : Rapport -> Surveillance -> Modèle GAM -> Dataset Analytique -> Nettoyage -> RAW -> Enquêtes & Mettelsat.',
      'Inspecter les règles de transformation à chaque étape.'
    ],
    expectedOutcome: 'Traçabilité complète 10/10 nœuds sans rupture de chaîne de provenance.',
    actualOutcome: 'Validé : arbre de lignage interactif conforme aux standards FAIR.',
    lastRunDate: '2026-08-30 08:40'
  },
  {
    id: 6,
    code: 'TEST-GOV-06',
    title: 'Reproductibilité des Analyses Statistiques & Modèles',
    category: 'TEST_REPRODUCTIBILITE_ANALYSE',
    description: 'Cliquer sur « Reproduire l analyse » et vérifier que les calculs de corrélation et modèles GAM sont réexécutés à l identique avec les mêmes paramètres et versions.',
    status: 'PASSED',
    steps: [
      'Déclencher la reproduction de l analyse ANA-2026-001 (Lags pluviométriques).',
      'Recharger le dataset snapshot exact utilisé lors de l analyse initiale.',
      'Recalculer les coefficients de corrélation croisée CCF.',
      'Comparer les résultats avec l empreinte d origine.'
    ],
    expectedOutcome: 'Reproductibilité stricte : écart relatif = 0.0000%.',
    actualOutcome: 'Validé : résultat parfaitement déterministe et reproductible.',
    lastRunDate: '2026-08-30 08:42'
  },
  {
    id: 7,
    code: 'TEST-GOV-07',
    title: 'Séparation des Privilèges RBAC & Isolation par Projet',
    category: 'TEST_PERMISSIONS_RBAC_PROJET',
    description: 'Vérifier que le profil Enquêteur (USR-004) ne peut pas modifier un protocole ni exporter des datasets bruts, tandis que l Administrateur dispose des accès complets.',
    status: 'PASSED',
    steps: [
      'Simuler la session de l enquêteur Amisi Lumumba.',
      'Tenter d accéder au formulaire d amendement de protocole -> accès refusé.',
      'Tenter d exporter la base brute non anonymisée -> bouton désactivé.',
      'Basculer sur le compte Administrateur Dr. Mukendi -> validation autorisée.'
    ],
    expectedOutcome: 'Application rigoureuse de la matrice des 6 rôles de gouvernance.',
    actualOutcome: 'Validé : contrôles d habilitation actifs sur chaque composant.',
    lastRunDate: '2026-08-30 08:45'
  },
  {
    id: 8,
    code: 'TEST-GOV-08',
    title: 'Immutabilité du Journal d Audit & Suppressions Logiques',
    category: 'TEST_IMMUTABILITE_AUDIT_LOGIQUE',
    description: 'Effectuer une suppression de données et vérifier qu il s agit d une suppression logique (marquage) traçable dans l audit sans destruction physique silencieuse.',
    status: 'PASSED',
    steps: [
      'Marquer un enregistrement doublon pour suppression.',
      'Consulter le journal d audit centralisé.',
      'Vérifier la création immédiate de l événement SUPPRESSION_LOGIQUE avec identifiant utilisateur, motif et horodatage.',
      'Tester la restauration par un utilisateur autorisé.'
    ],
    expectedOutcome: 'Zéro suppression silencieuse ; audit inaltérable.',
    actualOutcome: 'Validé : traçabilité légale et scientifique respectée.',
    lastRunDate: '2026-08-30 08:47'
  },
  {
    id: 9,
    code: 'TEST-GOV-09',
    title: 'Archivage & Restauration Sécurisée d un Projet',
    category: 'TEST_ARCHIVAGE_RESTAURATION',
    description: 'Archiver le projet rétrospectif PRJ-RETRO-003, vérifier le passage en lecture seule et tester la restauration par un administrateur.',
    status: 'PASSED',
    steps: [
      'Passer le statut du projet en ARCHIVE.',
      'Vérifier que toutes les actions d édition de données sont verrouillées.',
      'Consulter les datasets archivés en mode consultation sécurisée.',
      'Déclencher la restauration par l Administrateur avec inscription au journal d audit.'
    ],
    expectedOutcome: 'Projet archivé préservé sans perte de données et restauration contrôlée.',
    actualOutcome: 'Validé : cycle de vie complet du projet opérationnel.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 10,
    code: 'TEST-GOV-10',
    title: 'Non-Régression Globale V1.0 à V1.18',
    category: 'TEST_NON_REGRESSION_V1_V18',
    description: 'Vérifier que l intégration de la gouvernance V1.19 ne perturbe aucun des modules antérieurs : Collecte terrain V1.18, Surveillance V1.17, Validation V1.16, Modélisation V1.15, Lab V1.14, Diag V1.13, Imports V1.12, Enquêtes V1.11, etc.',
    status: 'PASSED',
    steps: [
      'Vérifier la persistance du mode hors ligne et de la synchronisation terrain V1.18.',
      'Contrôler les signaux d alerte de surveillance épidémiologique V1.17.',
      'Vérifier le module de validation scientifique V1.16 et modélisation GAM V1.15.',
      'Confirmer le bon fonctionnement des formulaires dynamiques et exports Excel/CSV.'
    ],
    expectedOutcome: 'Non-régression totale 100% fonctionnelle.',
    actualOutcome: 'Validé : compatibilité ascendante et stabilité globale certifiée.',
    lastRunDate: '2026-08-30 08:52'
  }
];

// Aliases for compatibility
export const MOCK_STUDY_PROJECTS_V119 = MOCK_STUDY_PROJECTS;
export const MOCK_STUDY_PROTOCOLS_V119 = MOCK_STUDY_PROTOCOLS;
export const MOCK_DATA_DICTIONARY_V119 = MOCK_DATA_DICTIONARY;
export const MOCK_FORM_VERSIONS_V119 = MOCK_PROJECT_FORM_VERSIONS;
export const MOCK_GOVERNANCE_DATASETS_V119 = MOCK_GOVERNANCE_DATASETS;
export const MOCK_DATA_LINEAGE_NODES_V119 = MOCK_DATA_LINEAGE_NODES;
export const MOCK_DATA_LINEAGE_EDGES_V119 = MOCK_DATA_LINEAGE_EDGES;
export const MOCK_EXTERNAL_SOURCES_V119 = MOCK_EXTERNAL_SOURCES;
export const MOCK_FILE_IMPORT_AUDITS_V119 = MOCK_FILE_IMPORT_AUDITS;
export const MOCK_CASE_DEFINITIONS_V119 = MOCK_CASE_DEFINITIONS;
export const MOCK_RECORD_VALIDATIONS_V119 = MOCK_MULTILEVEL_VALIDATIONS;
export const MOCK_USER_PERMISSIONS_V119 = MOCK_PROJECT_PERMISSIONS;
export const MOCK_REPRODUCIBLE_MODELS_V119 = MOCK_REPRODUCIBLE_MODELS;
export const MOCK_REPRODUCIBLE_ANALYSES_V119 = MOCK_REPRODUCIBLE_ANALYSES;
export const MOCK_VERSION_DIFFS_V119 = MOCK_VERSION_DIFFS;
export const MOCK_GOVERNANCE_ALERTS_V119 = MOCK_GOVERNANCE_ALERTS;
export const MOCK_AUDIT_LOGS_V119 = MOCK_CENTRAL_AUDIT_LOG;

export function calculateQualityScoreV119(
  datasets: GovernanceDataset[],
  variables: DataDictionaryVariable[],
  protocols: StudyProtocol[],
  models: ReproducibleModel[]
): GovernanceQualityScore {
  const completeness = 92.0;
  const consistency = 89.5;
  const traceability = 96.0;
  const documentation = 84.0;
  const validationCoverage = 85.0;

  const totalScore = Number(
    (
      completeness * 0.25 +
      consistency * 0.25 +
      traceability * 0.2 +
      documentation * 0.15 +
      validationCoverage * 0.15
    ).toFixed(1)
  );

  return {
    totalScore,
    breakdown: {
      completeness,
      consistency,
      traceability,
      documentation,
      validationCoverage
    },
    grade: totalScore >= 85 ? 'EXCELLENT' : totalScore >= 70 ? 'BON' : 'ACCEPTABLE',
    explanation: [
      `Complétude (${completeness}%) : Données cliniques et climatiques conformes avec taux d'exhaustivité élevé.`,
      `Cohérence (${consistency}%) : Règle d'intégrité respectée sans contradiction logique.`,
      `Traçabilité (${traceability}%) : Datasets et modèles traçables avec arbre de lignage complet et SHA-256.`,
      `Documentation (${documentation}%) : Dictionnaire de ${variables.length} variables scientifiques complété.`,
      `Validation (${validationCoverage}%) : Pipeline 4-niveaux actif.`
    ]
  };
}
