import {
  GeographicUnit,
  GeographicAlias,
  SeasonConfig,
  AnalysisPeriod,
  GlobalDataDictionaryItem,
  HealthEnvironmentLink,
  HealthClimateLink,
  ClimateEnvironmentLink,
} from '../types';

// ============================================================================
// 1. UNITÉS GÉOGRAPHIQUES HIÉRARCHISÉES (Kindu, Maniema)
// ============================================================================
export const INITIAL_GEOGRAPHIC_UNITS: GeographicUnit[] = [
  // 1.1. Province
  {
    geo_id: 'PROV-MNM',
    geo_type: 'PROVINCE',
    geo_name: 'Maniema',
    parent_geo_id: null,
    latitude: -2.9535,
    longitude: 25.9350,
    source: 'Division Provinciale de la Santé (DPS) Maniema',
    status: 'ACTIF',
  },
  // 1.2. Ville
  {
    geo_id: 'CITY-KND',
    geo_type: 'VILLE',
    geo_name: 'Ville de Kindu',
    parent_geo_id: 'PROV-MNM',
    latitude: -2.9535,
    longitude: 25.9350,
    population: 220000,
    source: 'Mairie de Kindu / DPS Maniema',
    status: 'ACTIF',
  },
  // 1.3. Zones de Santé
  {
    geo_id: 'ZS-001',
    geo_type: 'ZONE_DE_SANTE',
    geo_name: 'Zone de Santé de Kindu (Rive Droite)',
    parent_geo_id: 'CITY-KND',
    latitude: -2.9540,
    longitude: 25.9380,
    population: 154000,
    source: 'DPS Maniema / Carte Sanitaire RDC',
    status: 'ACTIF',
  },
  {
    geo_id: 'ZS-002',
    geo_type: 'ZONE_DE_SANTE',
    geo_name: "Zone de Santé d'Alunguli (Rive Gauche)",
    parent_geo_id: 'CITY-KND',
    latitude: -2.9550,
    longitude: 25.9050,
    population: 66000,
    source: 'DPS Maniema / Carte Sanitaire RDC',
    status: 'ACTIF',
  },
  // 1.4. Aires de Santé (Kindu)
  {
    geo_id: 'AS-001',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Kasuku Centre',
    parent_geo_id: 'ZS-001',
    latitude: -2.9510,
    longitude: 25.9300,
    population: 31200,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-002',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Mikelenge',
    parent_geo_id: 'ZS-001',
    latitude: -2.9640,
    longitude: 25.9420,
    population: 24500,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-003',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Basoko',
    parent_geo_id: 'ZS-001',
    latitude: -2.9400,
    longitude: 25.9320,
    population: 22100,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-004',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Tokolote',
    parent_geo_id: 'ZS-001',
    latitude: -2.9460,
    longitude: 25.9440,
    population: 19800,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-005',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Campus UNIKI',
    parent_geo_id: 'ZS-001',
    latitude: -2.9780,
    longitude: 25.9480,
    population: 14200,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-006',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Lwama',
    parent_geo_id: 'ZS-001',
    latitude: -2.9850,
    longitude: 25.9350,
    population: 18500,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-007',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Mayele',
    parent_geo_id: 'ZS-001',
    latitude: -2.9320,
    longitude: 25.9460,
    population: 15900,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-008',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Salama',
    parent_geo_id: 'ZS-001',
    latitude: -2.9600,
    longitude: 25.9600,
    population: 17300,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  // 1.5. Aires de Santé (Alunguli)
  {
    geo_id: 'AS-009',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Alunguli Centre',
    parent_geo_id: 'ZS-002',
    latitude: -2.9520,
    longitude: 25.9080,
    population: 28400,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  {
    geo_id: 'AS-010',
    geo_type: 'AIRE_DE_SANTE',
    geo_name: 'Tchabobo',
    parent_geo_id: 'ZS-002',
    latitude: -2.9680,
    longitude: 25.9010,
    population: 16700,
    source: 'DPS Maniema',
    status: 'ACTIF',
  },
  // 1.6. Quartiers
  {
    geo_id: 'Q-001',
    geo_type: 'QUARTIER',
    geo_name: 'Quartier Kasuku',
    parent_geo_id: 'AS-001',
    latitude: -2.9515,
    longitude: 25.9310,
    source: 'Mairie de Kindu',
    status: 'ACTIF',
  },
  {
    geo_id: 'Q-002',
    geo_type: 'QUARTIER',
    geo_name: 'Quartier Mikelenge 1',
    parent_geo_id: 'AS-002',
    latitude: -2.9640,
    longitude: 25.9420,
    source: 'Mairie de Kindu',
    status: 'ACTIF',
  },
  {
    geo_id: 'Q-003',
    geo_type: 'QUARTIER',
    geo_name: 'Quartier Basoko Port',
    parent_geo_id: 'AS-003',
    latitude: -2.9400,
    longitude: 25.9320,
    source: 'Mairie de Kindu',
    status: 'ACTIF',
  },
  {
    geo_id: 'Q-004',
    geo_type: 'QUARTIER',
    geo_name: 'Quartier Tokolote',
    parent_geo_id: 'AS-004',
    latitude: -2.9460,
    longitude: 25.9440,
    source: 'Mairie de Kindu',
    status: 'ACTIF',
  },
  {
    geo_id: 'Q-005',
    geo_type: 'QUARTIER',
    geo_name: 'Quartier Alunguli Rive',
    parent_geo_id: 'AS-009',
    latitude: -2.9520,
    longitude: 25.9080,
    source: 'Mairie de Kindu',
    status: 'ACTIF',
  },
  // 1.7. Avenues
  {
    geo_id: 'AV-001',
    geo_type: 'AVENUE',
    geo_name: 'Avenue du 4 Janvier',
    parent_geo_id: 'Q-001',
    latitude: -2.9520,
    longitude: 25.9305,
    source: 'Enquêtes de terrain One Health',
    status: 'ACTIF',
  },
  {
    geo_id: 'AV-002',
    geo_type: 'AVENUE',
    geo_name: 'Avenue Lumumba',
    parent_geo_id: 'Q-001',
    latitude: -2.9505,
    longitude: 25.9330,
    source: 'Enquêtes de terrain One Health',
    status: 'ACTIF',
  },
  {
    geo_id: 'AV-003',
    geo_type: 'AVENUE',
    geo_name: 'Avenue du Port',
    parent_geo_id: 'Q-003',
    latitude: -2.9390,
    longitude: 25.9315,
    source: 'Enquêtes de terrain One Health',
    status: 'ACTIF',
  },
  {
    geo_id: 'AV-004',
    geo_type: 'AVENUE',
    geo_name: 'Avenue Maniema',
    parent_geo_id: 'Q-002',
    latitude: -2.9650,
    longitude: 25.9430,
    source: 'Enquêtes de terrain One Health',
    status: 'ACTIF',
  },
  // 1.8. Sites Clés et Points d'Intérêt
  {
    geo_id: 'SITE-ENV-001',
    geo_type: 'SITE_POINT',
    geo_name: 'Site Décharge / Construction Mikelenge (ENV-001)',
    parent_geo_id: 'AV-004',
    latitude: -2.9645,
    longitude: 25.9425,
    source: 'Suivi longitudinal One Health Kindu',
    status: 'ACTIF',
  },
  {
    geo_id: 'SITE-MET-001',
    geo_type: 'SITE_POINT',
    geo_name: 'Station Météorologique Aéroport Kindu',
    parent_geo_id: 'AS-004',
    latitude: -2.9248,
    longitude: 25.9152,
    source: 'METTELSAT Kindu',
    status: 'ACTIF',
  },
];

// ============================================================================
// 2. ALIAS GÉOGRAPHIQUES (Table de correspondance toponymique)
// ============================================================================
export const INITIAL_GEOGRAPHIC_ALIASES: GeographicAlias[] = [
  {
    alias_id: 'ALIAS-001',
    geo_id: 'AS-001',
    alias_name: 'Kasuku',
    source: 'Registres hospitaliers DHIS2',
    notes: 'Fréquemment noté sans le suffixe Centre',
  },
  {
    alias_id: 'ALIAS-002',
    geo_id: 'AS-001',
    alias_name: 'Kasuku-Ville',
    source: 'Fiches de surveillance épidémiologique',
    notes: 'Utilisé par les relais communautaires',
  },
  {
    alias_id: 'ALIAS-003',
    geo_id: 'AS-003',
    alias_name: 'Basoko Port',
    source: 'Fiches CS Basoko',
    notes: 'Désigne l aire de santé de Basoko',
  },
  {
    alias_id: 'ALIAS-004',
    geo_id: 'AS-005',
    alias_name: 'UNIKI Campus',
    source: 'Enquêtes ménages étudiants',
    notes: 'Désigne le campus et cités universitaires',
  },
  {
    alias_id: 'ALIAS-005',
    geo_id: 'AS-009',
    alias_name: 'Alunguli RG',
    source: 'Fiches de transfert HGR Alunguli',
    notes: 'Rive Gauche / Alunguli Centre',
  },
  {
    alias_id: 'ALIAS-006',
    geo_id: 'AS-002',
    alias_name: 'Mikelenge Centre',
    source: 'Rapports SNIS',
    notes: 'Mikelenge aire de santé',
  },
  {
    alias_id: 'ALIAS-007',
    geo_id: 'ZS-001',
    alias_name: 'Kindu Rive Droite',
    source: 'DPS Maniema',
    notes: 'Zone de santé Kindu',
  },
  {
    alias_id: 'ALIAS-008',
    geo_id: 'ZS-002',
    alias_name: 'Alunguli Rive Gauche',
    source: 'DPS Maniema',
    notes: 'Zone de santé Alunguli',
  },
];

// ============================================================================
// 3. SAISONS CONFIGURABLES (Climatologie tropicale de Kindu)
// ============================================================================
export const INITIAL_SEASONS: SeasonConfig[] = [
  {
    season_id: 'SEA-PLUIE-1',
    season_name: 'Grande Saison des Pluies',
    start_month: 9,
    end_month: 12,
    description: 'Précipitations abondantes (>180 mm/mois), crues du fleuve Congo et saturation des sols.',
    source: 'Météorologie Nationale / Station Météo Kindu & DPS',
    status: 'ACTIF',
  },
  {
    season_id: 'SEA-SECHE-1',
    season_name: 'Petite Saison Sèche',
    start_month: 1,
    end_month: 2,
    description: 'Baisse relative des pluies, fortes chaleurs et persistance de poches de stagnation hydrique.',
    source: 'Station Météo Kindu & DPS',
    status: 'ACTIF',
  },
  {
    season_id: 'SEA-PLUIE-2',
    season_name: 'Petite Saison des Pluies',
    start_month: 3,
    end_month: 5,
    description: 'Reprise des fortes averses orageuses tropicales et prolifération vectorielle anophélienne.',
    source: 'Station Météo Kindu & DPS',
    status: 'ACTIF',
  },
  {
    season_id: 'SEA-SECHE-2',
    season_name: 'Grande Saison Sèche',
    start_month: 6,
    end_month: 8,
    description: 'Pluviométrie minimale (<40 mm/mois), baisse du niveau fluvial et assèchement partiel des caniveaux.',
    source: 'Station Météo Kindu & DPS',
    status: 'ACTIF',
  },
];

// ============================================================================
// 4. PÉRIODES D'ANALYSE HARMONISÉES (2023 - 2025)
// ============================================================================
export function generateAnalysisPeriods(): AnalysisPeriod[] {
  const periods: AnalysisPeriod[] = [];
  const years = [2023, 2024, 2025];
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  years.forEach((y) => {
    for (let m = 1; m <= 12; m++) {
      const padM = m.toString().padStart(2, '0');
      const lastDay = new Date(y, m, 0).getDate();
      const quarter = Math.ceil(m / 3);

      let seasonId = 'SEA-PLUIE-1';
      if (m >= 1 && m <= 2) seasonId = 'SEA-SECHE-1';
      else if (m >= 3 && m <= 5) seasonId = 'SEA-PLUIE-2';
      else if (m >= 6 && m <= 8) seasonId = 'SEA-SECHE-2';
      else seasonId = 'SEA-PLUIE-1';

      periods.push({
        period_id: `PER-${y}-M${padM}`,
        year: y,
        month: m,
        quarter,
        season: seasonId,
        period_type: 'MOIS',
        start_date: `${y}-${padM}-01`,
        end_date: `${y}-${padM}-${lastDay.toString().padStart(2, '0')}`,
        label: `${monthNames[m - 1]} ${y}`,
      });
    }
  });

  return periods;
}

export const INITIAL_ANALYSIS_PERIODS = generateAnalysisPeriods();

// ============================================================================
// 5. TEST SPÉCIFIQUE OBLIGATOIRE : ÉVOLUTION D'UN SITE LONGITUDINAL (ENV-001)
// ============================================================================
export interface SiteEvolutionObservation {
  site_id: string;
  site_name: string;
  year: number;
  temporal_valid_from: string;
  temporal_valid_to: string;
  observation_date: string;
  waste_presence: boolean;
  construction_presence: boolean;
  status_label: string;
  notes: string;
  photo_ref?: string;
}

export const MANDATORY_SITE_EVOLUTION_TEST: SiteEvolutionObservation[] = [
  {
    site_id: 'ENV-001',
    site_name: 'Site Décharge Mikelenge Ouest',
    year: 2023,
    temporal_valid_from: '2023-01-01',
    temporal_valid_to: '2023-12-31',
    observation_date: '2023-05-15',
    waste_presence: true,
    construction_presence: false,
    status_label: 'Dépôt de déchets = PRÉSENT, Construction = ABSENTE',
    notes: 'Dépôt d ordures sauvages actif et stagnation d eaux pluviales à proximité immédiate.',
  },
  {
    site_id: 'ENV-001',
    site_name: 'Site Décharge Mikelenge Ouest',
    year: 2024,
    temporal_valid_from: '2024-01-01',
    temporal_valid_to: '2024-12-31',
    observation_date: '2024-06-20',
    waste_presence: true,
    construction_presence: false,
    status_label: 'Dépôt de déchets = PRÉSENT, Construction = ABSENTE',
    notes: 'Dépôt toujours présent avec extension vers le caniveau non bétonné.',
  },
  {
    site_id: 'ENV-001',
    site_name: 'Site Décharge Mikelenge Ouest',
    year: 2025,
    temporal_valid_from: '2025-01-01',
    temporal_valid_to: '2025-12-31',
    observation_date: '2025-02-10',
    waste_presence: false,
    construction_presence: true,
    status_label: 'Dépôt de déchets = ABSENT, Construction = PRÉSENTE',
    notes: 'Travaux de terrassement et nouvelle construction résidentielle. Dépôt de déchets entièrement évacué.',
  },
];

// ============================================================================
// 6. RELATIONS INTER-DOMAINES INITIALES (Links)
// ============================================================================
export const INITIAL_HEALTH_ENV_LINKS: HealthEnvironmentLink[] = [
  {
    link_id: 'LNK-HE-001',
    health_area_id: 'AS-002', // Mikelenge
    neighborhood_id: 'Q-002',
    period_id: 'PER-2024-M03',
    health_record_reference: 'REC-HLT-2024-03-MIK',
    environment_record_reference: 'ENV-000001',
    link_quality: 'EXCELLENT',
    notes: 'Liaison spatiale et temporelle directe au niveau de l aire de santé Mikelenge (Mars 2024).',
  },
  {
    link_id: 'LNK-HE-002',
    health_area_id: 'AS-003', // Basoko
    neighborhood_id: 'Q-003',
    period_id: 'PER-2024-M04',
    health_record_reference: 'REC-HLT-2024-04-BAS',
    environment_record_reference: 'ENV-000003',
    link_quality: 'BON',
    notes: 'Liaison proximale zone portuaire et inondations bord fleuve.',
  },
];

export const INITIAL_HEALTH_CLIMATE_LINKS: HealthClimateLink[] = [
  {
    link_id: 'LNK-HC-001',
    health_area_id: 'AS-001',
    period_id: 'PER-2024-M04',
    health_record_reference: 'REC-HLT-2024-04-KAS',
    climate_record_reference: 'CLI-2024-03',
    temporal_lag: 1, // Lag 1 mois
    link_quality: 'EXCELLENT',
    notes: 'Association cas paludisme Avril 2024 avec pluviométrie Mars 2024 (décalage biologique de reproduction anophélienne).',
  },
  {
    link_id: 'LNK-HC-002',
    health_area_id: 'AS-002',
    period_id: 'PER-2024-M05',
    health_record_reference: 'REC-HLT-2024-05-MIK',
    climate_record_reference: 'CLI-2024-04',
    temporal_lag: 1,
    link_quality: 'EXCELLENT',
    notes: 'Association cas de fièvre typhoïde Mai 2024 avec précipitations et inondations d Avril 2024.',
  },
];

export const INITIAL_CLIMATE_ENV_LINKS: ClimateEnvironmentLink[] = [
  {
    link_id: 'LNK-CE-001',
    location_id: 'CITY-KND',
    period_id: 'PER-2024-M03',
    climate_reference: 'CLI-2024-03',
    environment_reference: 'ENV-000001',
    link_quality: 'BON',
    notes: 'Corrélation entre pic pluviométrique (>200 mm) et augmentation des poches de stagnation observées.',
  },
];

// ============================================================================
// 7. DICTIONNAIRE GLOBAL DES DONNÉES (Metadata standardisées)
// ============================================================================
export const GLOBAL_DATA_DICTIONARY: GlobalDataDictionaryItem[] = [
  // SANITAIRE
  {
    variable_name: 'cases_total',
    table: 'health_records',
    description: 'Nombre total de cas de maladie enregistrés sur la période',
    type: 'integer',
    unit: 'cas',
    allowed_values: '>= 0',
    source: 'DHIS2 / Registres CS & HGR Kindu',
    spatial_resolution: 'AIRE_DE_SANTE',
    temporal_resolution: 'MOIS',
    missing_allowed: false,
    notes: 'Inclut cas suspects et confirmés selon la classification',
  },
  {
    variable_name: 'confirmed_cases',
    table: 'health_records',
    description: 'Nombre de cas confirmés biologiquement (TDR+, Goutte Épaisse, Widal/Culture)',
    type: 'integer',
    unit: 'cas',
    allowed_values: '>= 0',
    source: 'Laboratoire CS / HGR',
    spatial_resolution: 'AIRE_DE_SANTE',
    temporal_resolution: 'MOIS',
    missing_allowed: false,
    notes: 'Ne jamais assimiler cas suspects et cas confirmés',
  },
  {
    variable_name: 'severe_cases',
    table: 'health_records',
    description: 'Nombre de cas graves hospitalisés',
    type: 'integer',
    unit: 'cas',
    allowed_values: '>= 0',
    source: 'Registres d hospitalisation HGR Kindu / Alunguli',
    spatial_resolution: 'AIRE_DE_SANTE',
    temporal_resolution: 'MOIS',
    missing_allowed: false,
  },
  {
    variable_name: 'deaths',
    table: 'health_records',
    description: 'Nombre de décès attribués à la pathologie',
    type: 'integer',
    unit: 'décès',
    allowed_values: '>= 0',
    source: 'Rapports SNIS mensuels',
    spatial_resolution: 'AIRE_DE_SANTE',
    temporal_resolution: 'MOIS',
    missing_allowed: false,
  },

  // CLIMAT
  {
    variable_name: 'rainfall_mm',
    table: 'climate_records',
    description: 'Cumul pluviométrique sur la période standardisée',
    type: 'float',
    unit: 'mm',
    allowed_values: '0 à 800 mm',
    source: 'Station Météo Kindu Aérodrome / METTELSAT / ERA5',
    spatial_resolution: 'STATION',
    temporal_resolution: 'MOIS',
    missing_allowed: true,
    notes: 'Ne jamais remplacer les valeurs manquantes par 0',
  },
  {
    variable_name: 'temperature_mean',
    table: 'climate_records',
    description: 'Température moyenne de l air',
    type: 'float',
    unit: '°C',
    allowed_values: '15.0 à 45.0 °C',
    source: 'Station Météo Kindu / METTELSAT',
    spatial_resolution: 'STATION',
    temporal_resolution: 'MOIS',
    missing_allowed: true,
  },
  {
    variable_name: 'humidity_percent',
    table: 'climate_records',
    description: 'Humidité relative moyenne',
    type: 'float',
    unit: '%',
    allowed_values: '10 à 100 %',
    source: 'Station Météo Kindu / METTELSAT',
    spatial_resolution: 'STATION',
    temporal_resolution: 'MOIS',
    missing_allowed: true,
  },

  // ENVIRONNEMENT
  {
    variable_name: 'factor_type',
    table: 'environmental_observations',
    description: 'Catégorie principale du facteur environnemental observé',
    type: 'string',
    allowed_values: 'EAU_STAGNANTE, DECHETS, CANIVEAU, EAUX_USEES, INONDATION, POINT_EAU, VEGETATION, HABITAT_VECTEURS',
    source: 'Enquêtes directes de terrain One Health',
    spatial_resolution: 'SITE',
    temporal_resolution: 'JOUR',
    missing_allowed: false,
    notes: 'Documenté avec coordonnées GPS et photo horodatée',
  },
  {
    variable_name: 'temporal_valid_from',
    table: 'environmental_observations',
    description: 'Date de début de validité de l observation du site',
    type: 'date',
    unit: 'YYYY-MM-DD',
    source: 'Recherche épidémiologique One Health',
    spatial_resolution: 'SITE',
    temporal_resolution: 'JOUR',
    missing_allowed: false,
    notes: 'Empêche l application rétrospective erronée d un état actuel',
  },

  // MÉNAGES
  {
    variable_name: 'water_source',
    table: 'household_surveys',
    description: 'Source principale d approvisionnement en eau du ménage',
    type: 'string',
    allowed_values: 'REGIDESO_DOMICILE, FORAGE_MANUEL, PUITS_PROTEGE, SOURCE_NON_PROTEGEE, FLEUVE_RIVIERE',
    source: 'Enquêtes ménages One Health Kindu',
    spatial_resolution: 'MENAGE',
    temporal_resolution: 'JOUR',
    missing_allowed: false,
  },
  {
    variable_name: 'bednet_used_last_night',
    table: 'household_surveys',
    description: 'Nombre de personnes ayant dormi sous moustiquaire imprégnée la nuit précédente',
    type: 'integer',
    unit: 'personnes',
    allowed_values: '0 à taille du ménage',
    source: 'Enquêtes ménages One Health Kindu',
    spatial_resolution: 'MENAGE',
    temporal_resolution: 'JOUR',
    missing_allowed: false,
  },
];

// ============================================================================
// 8. MATRICES DE COMPATIBILITÉ SPATIALE & TEMPORELLE
// ============================================================================
export const SPATIAL_COMPATIBILITY_MATRIX = [
  {
    source_resolution: 'MENAGE',
    target_resolution: 'AIRE_DE_SANTE',
    is_compatible: true,
    method: 'Agrégation statistique (moyenne, médiane, pourcentage) par emboîtement',
    condition: 'Taille d échantillon minimale (n >= 15 ménages par aire de santé)',
  },
  {
    source_resolution: 'SITE',
    target_resolution: 'AIRE_DE_SANTE',
    is_compatible: true,
    method: 'Comptage pondéré et calcul de densité surfacique / proximité spatiale',
    condition: 'Site géoréférencé avec précision < 20m situé dans les limites du polygone',
  },
  {
    source_resolution: 'AVENUE / QUARTIER',
    target_resolution: 'AIRE_DE_SANTE',
    is_compatible: true,
    method: 'Agrégation hiérarchique directe',
    condition: 'Vérification de la table des alias toponymiques',
  },
  {
    source_resolution: 'STATION_METEO',
    target_resolution: 'AIRE_DE_SANTE',
    is_compatible: true,
    method: 'Valeur proxy urbaine ou interpolation spatiale (Kriging / IDW)',
    condition: 'Mention explicite de proxy d échelle macro-urbaine sans variation infra-communale',
  },
  {
    source_resolution: 'ZONE_DE_SANTE',
    target_resolution: 'MENAGE',
    is_compatible: false,
    method: 'Désagrégation impossible sans biais écologique majeur',
    condition: 'Interdit : Ne jamais imputer une moyenne de zone à un ménage individuel',
  },
];

export const TEMPORAL_COMPATIBILITY_MATRIX = [
  {
    source_resolution: 'JOUR',
    target_resolution: 'MOIS',
    is_compatible: true,
    method: 'Somme cumulée (pluviométrie, cas) ou moyenne (température)',
    condition: 'Taux de complétude journalière > 80% sur le mois',
  },
  {
    source_resolution: 'SEMAINE_EPIDEMIO',
    target_resolution: 'MOIS',
    is_compatible: true,
    method: 'Attribution selon la règle ISO des semaines majoritaires',
    condition: 'Conserver la correspondance semaine-mois documentée',
  },
  {
    source_resolution: 'MOIS',
    target_resolution: 'SAISON',
    is_compatible: true,
    method: 'Agrégation selon le calendrier des 4 saisons tropicales de Kindu',
    condition: 'Les 3 ou 4 mois de la saison doivent être renseignés',
  },
  {
    source_resolution: 'ANNEE',
    target_resolution: 'MOIS',
    is_compatible: false,
    method: 'Désagrégation uniforme impossible (perte de la dynamique épidémique)',
    condition: 'Interdit : Ne jamais diviser un total annuel par 12',
  },
];

export const KINDU_SITE_EVOLUTION_DEMO = [
  {
    year: 2023 as const,
    date: '2023-04-12',
    waste_present: true,
    construction_present: false,
    description: 'Dépotoir d ordures actif non contrôlé avec eaux stagnantes en contrebas.',
  },
  {
    year: 2024 as const,
    date: '2024-05-18',
    waste_present: true,
    construction_present: false,
    description: 'Persistance du dépôt de déchets, extension des zones inondables adjacentes.',
  },
  {
    year: 2025 as const,
    date: '2025-02-10',
    waste_present: false,
    construction_present: true,
    description: 'Dépôt assaini et évacué par la mairie ; nouvelle construction résidentielle en briques.',
  },
];

