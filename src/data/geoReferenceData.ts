import { GeoReference } from '../types';

/**
 * Référentiel Géographique Officiel et Normalisé : GEO_REFERENCE
 * Application One Health Kindu (Maniema, RDC)
 * Standardise la nomenclature, les alias, les identifiants uniques et les coordonnées GPS.
 */

// Bounding box d'étude officielle pour la ville de Kindu et ses environs
export const KINDU_STUDY_BOUNDS = {
  minLat: -3.05,
  maxLat: -2.85,
  minLng: 25.85,
  maxLng: 26.05,
};

export function isWithinKinduBounds(lat: number | null, lng: number | null): boolean {
  if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return false;
  return (
    lat >= KINDU_STUDY_BOUNDS.minLat &&
    lat <= KINDU_STUDY_BOUNDS.maxLat &&
    lng >= KINDU_STUDY_BOUNDS.minLng &&
    lng <= KINDU_STUDY_BOUNDS.maxLng
  );
}

export const INITIAL_GEO_REFERENCES: GeoReference[] = [
  // 1. Niveau Province
  {
    id: 'GEO_PROV_MANIEMA',
    type: 'PROVINCE',
    official_name: 'Maniema',
    alternative_names: ['Province du Maniema', 'MANIEMA'],
    parent_id: null,
    latitude: -2.95,
    longitude: 25.95,
    geometry: null,
    source: 'DPS Maniema / Ministère de la Santé RDC',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },

  // 2. Niveau Ville
  {
    id: 'GEO_VILLE_KINDU',
    type: 'VILLE',
    official_name: 'Kindu',
    alternative_names: ['Ville de Kindu', 'KINDU', 'Kindu-Ville'],
    parent_id: 'GEO_PROV_MANIEMA',
    latitude: -2.9538,
    longitude: 25.9224,
    geometry: null,
    source: 'Mairie de Kindu / DPS Maniema',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },

  // 3. Niveau Zones de Santé (2 ZS)
  {
    id: 'GEO_ZS_KINDU',
    type: 'ZONE_SANTE',
    official_name: 'Zone de Santé de Kindu',
    alternative_names: ['ZS Kindu', 'ZS_KINDU', 'Kindu ZS'],
    parent_id: 'GEO_VILLE_KINDU',
    latitude: -2.9515,
    longitude: 25.923,
    geometry: null,
    source: 'DPS Maniema / Carte Sanitaire RDC',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_ZS_ALUNGULI',
    type: 'ZONE_SANTE',
    official_name: 'Zone de Santé d’Alunguli',
    alternative_names: ['ZS Alunguli', 'ZS_ALUNGULI', 'Alunguli ZS'],
    parent_id: 'GEO_VILLE_KINDU',
    latitude: -2.948,
    longitude: 25.938,
    geometry: null,
    source: 'DPS Maniema / Carte Sanitaire RDC',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },

  // 4. Niveau Aires de Santé (10 Aires de Santé)
  {
    id: 'GEO_AS_MIKELENGE',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Mikelenge',
    alternative_names: ['AS Mikelenge', 'AS_MIKELENGE', 'Mikelenge', 'AS-MIKELENGE', 'Mikelenge 1'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.9482,
    longitude: 25.9185,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_BASOKO',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Basoko',
    alternative_names: ['AS Basoko', 'AS_BASOKO', 'Basoko', 'AS Basoko Port', 'BASOKO'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.942,
    longitude: 25.924,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_TOKOLOTE',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Tokolote',
    alternative_names: ['AS Tokolote', 'AS_TOKOLOTE', 'Tokolote', 'TOKOLOTE'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.9615,
    longitude: 25.919,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_LUMBULUMBU',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Lumbulumbu',
    alternative_names: ['AS Lumbulumbu', 'AS_LUMBULUMBU', 'Lumbulumbu', 'Lumbu-Lumbu'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.955,
    longitude: 25.9295,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_KASUKU',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Kasuku',
    alternative_names: ['AS Kasuku', 'AS_KASUKU', 'Kasuku Centre', 'Kasuku I', 'KASUKU'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.951,
    longitude: 25.915,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_MAYELE',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Mayele',
    alternative_names: ['AS Mayele', 'AS_MAYELE', 'Mayele', 'MAYELE'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.937,
    longitude: 25.916,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_BRAZZA',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Brazza',
    alternative_names: ['AS Brazza', 'AS_BRAZZA', 'Brazzaville-Kindu', 'BRAZZA'],
    parent_id: 'GEO_ZS_KINDU',
    latitude: -2.968,
    longitude: 25.925,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_ALUNGULI_1',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Alunguli 1',
    alternative_names: ['AS Alunguli 1', 'AS_ALUNGULI_1', 'Alunguli I', 'Alunguli Centre', 'ALUNGULI-1'],
    parent_id: 'GEO_ZS_ALUNGULI',
    latitude: -2.945,
    longitude: 25.937,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_ALUNGULI_2',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Alunguli 2',
    alternative_names: ['AS Alunguli 2', 'AS_ALUNGULI_2', 'Alunguli II', 'ALUNGULI-2', 'Alunguli Sud'],
    parent_id: 'GEO_ZS_ALUNGULI',
    latitude: -2.952,
    longitude: 25.942,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_AS_RIVE_DROITE',
    type: 'AIRE_SANTE',
    official_name: 'Aire de Santé Rive Droite',
    alternative_names: ['AS Rive Droite', 'AS_RIVE_DROITE', 'Rive Droite Fleuve', 'RIVE_DROITE'],
    parent_id: 'GEO_ZS_ALUNGULI',
    latitude: -2.939,
    longitude: 25.946,
    geometry: null,
    source: 'Carte Sanitaire DPS Maniema 2023',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },

  // 5. Niveau Structures Sanitaires (Formations Sanitaires)
  {
    id: 'GEO_FS_HGR_KINDU',
    type: 'STRUCTURE_SANITAIRE',
    official_name: 'Hôpital Général de Référence de Kindu',
    alternative_names: ['HGR Kindu', 'Hôpital Général', 'HGR_KINDU'],
    parent_id: 'GEO_AS_KASUKU',
    latitude: -2.952,
    longitude: 25.921,
    geometry: null,
    source: 'DPS Maniema / Recensement FOSA',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_FS_CSR_MIKELENGE',
    type: 'STRUCTURE_SANITAIRE',
    official_name: 'Centre de Santé de Référence Mikelenge',
    alternative_names: ['CSR Mikelenge', 'CS Mikelenge', 'CSR_MIKELENGE'],
    parent_id: 'GEO_AS_MIKELENGE',
    latitude: -2.948,
    longitude: 25.918,
    geometry: null,
    source: 'DPS Maniema / Recensement FOSA',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_FS_CS_BASOKO',
    type: 'STRUCTURE_SANITAIRE',
    official_name: 'Centre de Santé Basoko',
    alternative_names: ['CS Basoko', 'Poste de Santé Basoko', 'CS_BASOKO'],
    parent_id: 'GEO_AS_BASOKO',
    latitude: -2.9415,
    longitude: 25.9235,
    geometry: null,
    source: 'DPS Maniema / Recensement FOSA',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_FS_HGR_ALUNGULI',
    type: 'STRUCTURE_SANITAIRE',
    official_name: 'Hôpital Général de Référence Alunguli',
    alternative_names: ['HGR Alunguli', 'HGR_ALUNGULI'],
    parent_id: 'GEO_AS_ALUNGULI_1',
    latitude: -2.946,
    longitude: 25.938,
    geometry: null,
    source: 'DPS Maniema / Recensement FOSA',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },

  // 6. Niveau Quartiers & Avenues Principales
  {
    id: 'GEO_Q_BASOKO_PORT',
    type: 'QUARTIER',
    official_name: 'Quartier Basoko-Port',
    alternative_names: ['Basoko Port', 'Port Kindu', 'Basoko-Beach'],
    parent_id: 'GEO_AS_BASOKO',
    latitude: -2.941,
    longitude: 25.926,
    geometry: null,
    source: 'Mairie de Kindu / Cadastre',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'MEDIUM',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_Q_COMMERCIAL',
    type: 'QUARTIER',
    official_name: 'Quartier Commercial Kasuku',
    alternative_names: ['Kasuku Commercial', 'Centre-Ville', 'Grand Marché'],
    parent_id: 'GEO_AS_KASUKU',
    latitude: -2.953,
    longitude: 25.921,
    geometry: null,
    source: 'Mairie de Kindu / Cadastre',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'HIGH',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_Q_MIKELENGE_NORD',
    type: 'QUARTIER',
    official_name: 'Quartier Mikelenge Nord',
    alternative_names: ['Mikelenge Nord', 'Bloc Scolaire'],
    parent_id: 'GEO_AS_MIKELENGE',
    latitude: -2.946,
    longitude: 25.917,
    geometry: null,
    source: 'Mairie de Kindu / Cadastre',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'MEDIUM',
    is_within_study_bounds: true,
  },
  {
    id: 'GEO_Q_RIVE_CONGO',
    type: 'QUARTIER',
    official_name: 'Quartier Rive du Fleuve Alunguli',
    alternative_names: ['Rive Fleuve', 'Alunguli Fleuve', 'Beach Alunguli'],
    parent_id: 'GEO_AS_ALUNGULI_1',
    latitude: -2.944,
    longitude: 25.935,
    geometry: null,
    source: 'Mairie de Kindu / Cadastre',
    valid_from: '2020-01-01',
    valid_to: null,
    gps_quality: 'MEDIUM',
    is_within_study_bounds: true,
  }
];

/**
 * Fonction de résolution d'alias géographique
 * Associe une chaîne brute ("Kindu I", "AS Kindu 1", "BASOKO", etc.) à son identifiant officiel GEO_REFERENCE
 */
export function resolveGeoReference(rawNameOrId: string): GeoReference | undefined {
  if (!rawNameOrId) return undefined;
  const clean = rawNameOrId.trim().toUpperCase();

  // 1. Direct ID match
  const byId = INITIAL_GEO_REFERENCES.find(g => g.id.toUpperCase() === clean);
  if (byId) return byId;

  // 2. Official name match
  const byOfficial = INITIAL_GEO_REFERENCES.find(g => g.official_name.toUpperCase() === clean);
  if (byOfficial) return byOfficial;

  // 3. Alternative names match
  const byAlias = INITIAL_GEO_REFERENCES.find(g =>
    g.alternative_names.some(alias => alias.toUpperCase() === clean || clean.includes(alias.toUpperCase()))
  );
  if (byAlias) return byAlias;

  // 4. Fuzzy / substring matching
  return INITIAL_GEO_REFERENCES.find(g =>
    g.official_name.toUpperCase().includes(clean) || clean.includes(g.official_name.toUpperCase())
  );
}
