import { HealthZone, HealthAreaInfo, NeighborhoodInfo, HealthFacility } from '../types';

export const KINDU_BOUNDS = {
  minLat: -3.05,
  maxLat: -2.87,
  minLng: 25.86,
  maxLng: 26.02,
  centerLat: -2.9535,
  centerLng: 25.9350,
};

export function isWithinKindu(lat: number, lng: number): boolean {
  return (
    lat >= KINDU_BOUNDS.minLat &&
    lat <= KINDU_BOUNDS.maxLat &&
    lng >= KINDU_BOUNDS.minLng &&
    lng <= KINDU_BOUNDS.maxLng
  );
}

// 0. Structures Sanitaires Référencées (Kindu & Alunguli)
export const KINDU_HEALTH_FACILITIES: HealthFacility[] = [
  {
    facility_id: 'FAC_HGR_KINDU',
    facility_name: 'Hôpital Général de Référence de Kindu',
    facility_type: 'Hôpital',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_KASUKU',
    latitude: -2.9515,
    longitude: 25.9305,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_HGR_ALUNGULI',
    facility_name: 'Hôpital Général de Référence Alunguli',
    facility_type: 'Hôpital',
    zone_id: 'ZS_ALUNGULI',
    health_area_id: 'AS_ALUNGULI',
    latitude: -2.9525,
    longitude: 25.9085,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_MIKELENGE',
    facility_name: 'Centre de Santé Mikelenge',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_MIKELENGE',
    latitude: -2.9640,
    longitude: 25.9420,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_PS_MANIEMA',
    facility_name: 'Poste de Santé Maniema',
    facility_type: 'Poste de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_MIKELENGE',
    latitude: -2.9690,
    longitude: 25.9470,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_TOKOLOTE',
    facility_name: 'Centre de Santé Tokolote',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_TOKOLOTE',
    latitude: -2.9460,
    longitude: 25.9440,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_POLY_CINQ',
    facility_name: 'Polyclinique du Cinquantenaire',
    facility_type: 'Autre',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_TOKOLOTE',
    latitude: -2.9490,
    longitude: 25.9410,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CSR_BASOKO',
    facility_name: 'Centre de Santé de Référence Basoko',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_BASOKO',
    latitude: -2.9400,
    longitude: 25.9320,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_PS_PORT_BASOKO',
    facility_name: 'Poste de Santé Port Basoko',
    facility_type: 'Poste de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_BASOKO',
    latitude: -2.9360,
    longitude: 25.9290,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CMC_KASUKU',
    facility_name: 'Centre Médical Central Kasuku',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_KASUKU',
    latitude: -2.9540,
    longitude: 25.9280,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_RIVE_GAUCHE',
    facility_name: 'Centre de Santé Rive Gauche',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_ALUNGULI',
    health_area_id: 'AS_ALUNGULI',
    latitude: -2.9480,
    longitude: 25.9120,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_TCHABOBO',
    facility_name: 'Centre de Santé Tchabobo',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_ALUNGULI',
    health_area_id: 'AS_TCHABOBO',
    latitude: -2.9680,
    longitude: 25.9010,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CMU_UNIKI',
    facility_name: 'Centre Médical Universitaire UNIKI',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_CAMPUS_UNIKI',
    latitude: -2.9780,
    longitude: 25.9480,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_PS_LWAMA_EST',
    facility_name: 'Poste de Santé Lwama Est',
    facility_type: 'Poste de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_CAMPUS_UNIKI',
    latitude: -2.9810,
    longitude: 25.9520,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_LWAMA',
    facility_name: 'Centre de Santé Lwama',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_LWAMA',
    latitude: -2.9850,
    longitude: 25.9350,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_MAYELE',
    facility_name: 'Centre de Santé Mayele',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_MAYELE',
    latitude: -2.9320,
    longitude: 25.9460,
    status: 'ACTIF',
  },
  {
    facility_id: 'FAC_CS_SALAMA',
    facility_name: 'Centre de Santé Salama',
    facility_type: 'Centre de santé',
    zone_id: 'ZS_KINDU',
    health_area_id: 'AS_SALAMA',
    latitude: -2.9600,
    longitude: 25.9600,
    status: 'ACTIF',
  },
];

// 1. Zones de Santé
export const KINDU_HEALTH_ZONES: HealthZone[] = [
  { id: 'ZS_KINDU', name: 'Zone de Santé de Kindu (Rive Droite)', code: 'ZS-KIN' },
  { id: 'ZS_ALUNGULI', name: 'Zone de Santé d\'Alunguli (Rive Gauche)', code: 'ZS-ALU' },
];

// 2. Aires de Santé
export const KINDU_HEALTH_AREAS: HealthAreaInfo[] = [
  {
    id: 'AS_MIKELENGE',
    name: 'Mikelenge',
    zoneId: 'ZS_KINDU',
    commune: 'Mikelenge',
    population: 24500,
    coordinates: { lat: -2.9640, lng: 25.9420 },
    bounds: [
      [-2.9550, 25.9350],
      [-2.9580, 25.9520],
      [-2.9720, 25.9550],
      [-2.9750, 25.9380],
    ],
    healthStructures: ['Centre de Santé Mikelenge', 'Poste de Santé Maniema'],
    floodRiskLevel: 'MOYEN',
  },
  {
    id: 'AS_TOKOLOTE',
    name: 'Tokolote',
    zoneId: 'ZS_KINDU',
    commune: 'Kasuku',
    population: 19800,
    coordinates: { lat: -2.9460, lng: 25.9440 },
    bounds: [
      [-2.9380, 25.9380],
      [-2.9420, 25.9550],
      [-2.9540, 25.9520],
      [-2.9500, 25.9350],
    ],
    healthStructures: ['Centre de Santé Tokolote', 'Polyclinique du Cinquantenaire'],
    floodRiskLevel: 'ELEVE',
  },
  {
    id: 'AS_BASOKO',
    name: 'Basoko',
    zoneId: 'ZS_KINDU',
    commune: 'Kasuku',
    population: 22100,
    coordinates: { lat: -2.9400, lng: 25.9320 },
    bounds: [
      [-2.9300, 25.9250],
      [-2.9350, 25.9400],
      [-2.9480, 25.9380],
      [-2.9430, 25.9220],
    ],
    healthStructures: ['Centre de Santé de Référence Basoko', 'Poste de Santé Port'],
    floodRiskLevel: 'ELEVE',
  },
  {
    id: 'AS_KASUKU',
    name: 'Kasuku Centre',
    zoneId: 'ZS_KINDU',
    commune: 'Kasuku',
    population: 31200,
    coordinates: { lat: -2.9510, lng: 25.9300 },
    bounds: [
      [-2.9430, 25.9220],
      [-2.9480, 25.9380],
      [-2.9580, 25.9360],
      [-2.9550, 25.9200],
    ],
    healthStructures: ['Hôpital Général de Référence de Kindu', 'Centre Médical Central Kasuku'],
    floodRiskLevel: 'MOYEN',
  },
  {
    id: 'AS_ALUNGULI',
    name: 'Alunguli Centre (Rive Gauche)',
    zoneId: 'ZS_ALUNGULI',
    commune: 'Alunguli',
    population: 28400,
    coordinates: { lat: -2.9520, lng: 25.9080 },
    bounds: [
      [-2.9400, 25.8950],
      [-2.9430, 25.9180],
      [-2.9650, 25.9170],
      [-2.9620, 25.8920],
    ],
    healthStructures: ['Hôpital Général de Référence Alunguli', 'Centre de Santé Rive Gauche'],
    floodRiskLevel: 'TRES_ELEVE',
  },
  {
    id: 'AS_TCHABOBO',
    name: 'Tchabobo',
    zoneId: 'ZS_ALUNGULI',
    commune: 'Alunguli',
    population: 16700,
    coordinates: { lat: -2.9680, lng: 25.9010 },
    bounds: [
      [-2.9620, 25.8920],
      [-2.9650, 25.9170],
      [-2.9800, 25.9120],
      [-2.9780, 25.8880],
    ],
    healthStructures: ['Centre de Santé Tchabobo'],
    floodRiskLevel: 'TRES_ELEVE',
  },
  {
    id: 'AS_CAMPUS_UNIKI',
    name: 'Campus Universitaire (UNIKI)',
    zoneId: 'ZS_KINDU',
    commune: 'Mikelenge',
    population: 14200,
    coordinates: { lat: -2.9780, lng: 25.9480 },
    bounds: [
      [-2.9720, 25.9380],
      [-2.9720, 25.9550],
      [-2.9890, 25.9580],
      [-2.9880, 25.9350],
    ],
    healthStructures: ['Centre Médical Universitaire UNIKI', 'Poste de Santé Lwama Est'],
    floodRiskLevel: 'FAIBLE',
  },
  {
    id: 'AS_LWAMA',
    name: 'Lwama',
    zoneId: 'ZS_KINDU',
    commune: 'Mikelenge',
    population: 18500,
    coordinates: { lat: -2.9850, lng: 25.9350 },
    bounds: [
      [-2.9750, 25.9250],
      [-2.9780, 25.9380],
      [-2.9960, 25.9400],
      [-2.9930, 25.9200],
    ],
    healthStructures: ['Centre de Santé Lwama'],
    floodRiskLevel: 'FAIBLE',
  },
  {
    id: 'AS_MAYELE',
    name: 'Mayele',
    zoneId: 'ZS_KINDU',
    commune: 'Kasuku',
    population: 15900,
    coordinates: { lat: -2.9320, lng: 25.9460 },
    bounds: [
      [-2.9220, 25.9380],
      [-2.9250, 25.9580],
      [-2.9420, 25.9550],
      [-2.9380, 25.9380],
    ],
    healthStructures: ['Centre de Santé Mayele'],
    floodRiskLevel: 'MOYEN',
  },
  {
    id: 'AS_SALAMA',
    name: 'Salama',
    zoneId: 'ZS_KINDU',
    commune: 'Mikelenge',
    population: 17300,
    coordinates: { lat: -2.9600, lng: 25.9600 },
    bounds: [
      [-2.9500, 25.9520],
      [-2.9520, 25.9720],
      [-2.9680, 25.9700],
      [-2.9650, 25.9500],
    ],
    healthStructures: ['Centre de Santé Salama'],
    floodRiskLevel: 'FAIBLE',
  },
];

// 3. Quartiers dépendants par Aire de Santé avec leurs Avenues
export const KINDU_NEIGHBORHOODS: NeighborhoodInfo[] = [
  // Alunguli
  {
    id: 'Q_ALU_PORT',
    name: 'Quartier Port Alunguli',
    healthAreaId: 'AS_ALUNGULI',
    zoneId: 'ZS_ALUNGULI',
    streets: ['Avenue du Port', 'Avenue du Fleuve', 'Avenue Piroguiers', 'Rue des Marais', 'Avenue Lumumba Ouest'],
  },
  {
    id: 'Q_ALU_CENTRE',
    name: 'Quartier Alunguli Centre',
    healthAreaId: 'AS_ALUNGULI',
    zoneId: 'ZS_ALUNGULI',
    streets: ['Avenue de l\'Église', 'Avenue du Marché Alunguli', 'Avenue de l\'Hôpital', 'Rue des Écoles', 'Avenue Dispensaire'],
  },
  // Tchabobo
  {
    id: 'Q_TCHABOBO_RIVE',
    name: 'Quartier Tchabobo Rive',
    healthAreaId: 'AS_TCHABOBO',
    zoneId: 'ZS_ALUNGULI',
    streets: ['Avenue des Pêcheurs', 'Avenue Rive Sud', 'Avenue de la Plage', 'Sentier des Riziers'],
  },
  // Basoko
  {
    id: 'Q_BASOKO_PORT',
    name: 'Quartier Port Basoko',
    healthAreaId: 'AS_BASOKO',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue du Débarcadère', 'Avenue du Commerce', 'Rue de la Douane', 'Avenue Capitaine Nemo'],
  },
  {
    id: 'Q_BASOKO_CENTRE',
    name: 'Quartier Basoko Résidentiel',
    healthAreaId: 'AS_BASOKO',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue Sendwe', 'Avenue des Huileries', 'Rue de la Mission', 'Avenue de la Paix'],
  },
  // Tokolote
  {
    id: 'Q_TOKOLOTE_MARCHE',
    name: 'Quartier Marché Tokolote',
    healthAreaId: 'AS_TOKOLOTE',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue du Grand Marché', 'Avenue Maniema', 'Avenue Commerciale', 'Rue des Artisans', 'Avenue 30 Juin'],
  },
  {
    id: 'Q_TOKOLOTE_EST',
    name: 'Quartier Tokolote Est',
    healthAreaId: 'AS_TOKOLOTE',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue du Cinquantenaire', 'Avenue de l\'Aviation', 'Avenue Kimbangu', 'Rue des Palmiers'],
  },
  // Kasuku Centre
  {
    id: 'Q_KASUKU_ADMIN',
    name: 'Quartier Administratif Kasuku',
    healthAreaId: 'AS_KASUKU',
    zoneId: 'ZS_KINDU',
    streets: ['Boulevard Joseph Kabila', 'Avenue du Gouvernorat', 'Avenue des Tribunaux', 'Avenue de la Poste'],
  },
  {
    id: 'Q_KASUKU_RESIDENCE',
    name: 'Quartier Résidentiel Kasuku',
    healthAreaId: 'AS_KASUKU',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue Mobutu', 'Avenue du Stade', 'Avenue Mgr Kasuku', 'Rue de l\'Hôpital Général'],
  },
  // Mikelenge
  {
    id: 'Q_MIKELENGE_BLOC1',
    name: 'Quartier Mikelenge Bloc 1',
    healthAreaId: 'AS_MIKELENGE',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue de l\'Unité', 'Avenue Lwama', 'Rue de la Colline', 'Avenue de la Victoire'],
  },
  {
    id: 'Q_MIKELENGE_BASFOND',
    name: 'Quartier Mikelenge Bas-fond',
    healthAreaId: 'AS_MIKELENGE',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue des Maraîchers', 'Avenue du Ruisseau', 'Rue Inondable', 'Avenue Pépinière'],
  },
  // Campus UNIKI
  {
    id: 'Q_CAMPUS_CITE',
    name: 'Cité Universitaire UNIKI',
    healthAreaId: 'AS_CAMPUS_UNIKI',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue des Professeurs', 'Avenue des Étudiants', 'Allée du Rectorat', 'Avenue Faculté Médecine'],
  },
  // Lwama
  {
    id: 'Q_LWAMA_CENTRE',
    name: 'Quartier Lwama Centre',
    healthAreaId: 'AS_LWAMA',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue de la Gare SNCC', 'Avenue du Rail', 'Avenue Lwama Sud', 'Rue des Ateliers'],
  },
  // Mayele
  {
    id: 'Q_MAYELE_NORD',
    name: 'Quartier Mayele Nord',
    healthAreaId: 'AS_MAYELE',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue Mayele 1', 'Avenue Mayele 2', 'Rue des Manguiers', 'Avenue de l\'Aérodrome'],
  },
  // Salama
  {
    id: 'Q_SALAMA_EST',
    name: 'Quartier Salama',
    healthAreaId: 'AS_SALAMA',
    zoneId: 'ZS_KINDU',
    streets: ['Avenue Salama', 'Avenue de la Fraternité', 'Rue de la Source', 'Avenue de la Jeunesse'],
  },
];

// 4. Tracé du Fleuve Congo à Kindu
export const CONGO_RIVER_PATH: [number, number][] = [
  [-2.9950, 25.9180],
  [-2.9800, 25.9190],
  [-2.9650, 25.9220],
  [-2.9550, 25.9240], // Centre Kindu
  [-2.9450, 25.9270],
  [-2.9300, 25.9310],
  [-2.9150, 25.9350],
  [-2.9000, 25.9380],
];

// Helper functions for dependent dropdowns
export function getHealthAreasByZone(zoneId: string): HealthAreaInfo[] {
  return KINDU_HEALTH_AREAS.filter(a => a.zoneId === zoneId);
}

export function getNeighborhoodsByHealthArea(healthAreaId: string): NeighborhoodInfo[] {
  return KINDU_NEIGHBORHOODS.filter(n => n.healthAreaId === healthAreaId);
}

export function getStreetsByNeighborhood(neighborhoodId: string): string[] {
  const neighborhood = KINDU_NEIGHBORHOODS.find(n => n.id === neighborhoodId);
  return neighborhood ? neighborhood.streets : [];
}

// Calculate Haversine distance in meters between two GPS coordinates
export function calculateGPSDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Coordinates representing the Congo River crossing Kindu (South-North)
export const CONGO_RIVER_COORDINATES = [
  { lat: -2.9900, lng: 25.9220 },
  { lat: -2.9750, lng: 25.9240 },
  { lat: -2.9600, lng: 25.9270 },
  { lat: -2.9520, lng: 25.9280 },
  { lat: -2.9450, lng: 25.9290 },
  { lat: -2.9350, lng: 25.9300 },
  { lat: -2.9200, lng: 25.9310 },
];

// Find potential duplicate household by proximity (< 25m) and identical health area/neighborhood
export function findPotentialDuplicateHousehold<T extends { id?: string; latitude: number; longitude: number; health_area_id?: string; neighborhood_id?: string }>(
  target: { id?: string; latitude: number; longitude: number; health_area_id?: string; neighborhood_id?: string },
  existingSurveys: T[],
  maxDistanceMeters: number = 25
): T | undefined {
  if (!target.latitude || !target.longitude) return undefined;
  
  return existingSurveys.find(s => {
    if (target.id && s.id === target.id) return false;
    // Check if in same area / neighborhood if specified
    if (target.health_area_id && s.health_area_id && target.health_area_id !== s.health_area_id) {
      return false;
    }
    if (target.neighborhood_id && s.neighborhood_id && target.neighborhood_id !== s.neighborhood_id) {
      return false;
    }
    const dist = calculateGPSDistance(target.latitude, target.longitude, s.latitude, s.longitude);
    return dist <= maxDistanceMeters;
  });
}


