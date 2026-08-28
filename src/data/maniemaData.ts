import {
  GeographicUnitV110,
  PathologyConfig,
  OneHealthProject,
  TimePeriodConfig,
  DynamicObservationRecord,
  UserSessionV110
} from '../types';

/**
 * RÉFÉRENTIEL GÉOGRAPHIQUE OFFICIEL DE LA PROVINCE DU MANIEMA (RDC)
 * Hiérarchie : Province -> Ville/Territoire -> Zone de Santé -> Aire de Santé -> Quartier/Village -> Avenue/Site
 */

export const INITIAL_MANIEMA_GEO_UNITS: GeographicUnitV110[] = [
  // 1. NIVEAU PROVINCE
  {
    id: 'GEO_PROV_MANIEMA',
    code: 'MAN',
    name: 'Province du Maniema',
    level: 'PROVINCE',
    parentId: null,
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.95, lng: 25.95 },
    population: 2680000,
    area_km2: 132250,
    status: 'ACTIF',
    source: 'Ministère de l’Intérieur & DPS Maniema (RDC)',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },

  // 2. NIVEAU VILLES & TERRITOIRES DU MANIEMA (8 Entités administratives)
  {
    id: 'GEO_TERR_KINDU',
    code: 'KIN',
    name: 'Ville de Kindu (Chef-lieu)',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9538, lng: 25.9224 },
    population: 410000,
    area_km2: 150,
    status: 'ACTIF',
    source: 'Mairie de Kindu / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_KASONGO',
    code: 'KAS',
    name: 'Territoire de Kasongo',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.4333, lng: 26.6667 },
    population: 580000,
    area_km2: 18174,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_KIBOMBO',
    code: 'KIB',
    name: 'Territoire de Kibombo',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -3.9500, lng: 25.9833 },
    population: 290000,
    area_km2: 17757,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_PUNIA',
    code: 'PUN',
    name: 'Territoire de Punia',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -1.4500, lng: 26.4167 },
    population: 240000,
    area_km2: 19805,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_PANGI',
    code: 'PAN',
    name: 'Territoire de Pangi (Kampene)',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -3.2833, lng: 27.2833 },
    population: 360000,
    area_km2: 14758,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_LUBUTU',
    code: 'LUB',
    name: 'Territoire de Lubutu',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -0.7333, lng: 26.5833 },
    population: 230000,
    area_km2: 14777,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_KAILO',
    code: 'KAI',
    name: 'Territoire de Kailo',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.6333, lng: 26.1167 },
    population: 220000,
    area_km2: 13745,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_TERR_KABAMBARE',
    code: 'KAB',
    name: 'Territoire de Kabambare',
    level: 'VILLE_TERRITOIRE',
    parentId: 'GEO_PROV_MANIEMA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.7000, lng: 27.7167 },
    population: 350000,
    area_km2: 15079,
    status: 'ACTIF',
    source: 'Administration Territoriale / DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },

  // 3. NIVEAU ZONES DE SANTÉ (18 Zones de Santé officielles du Maniema)
  {
    id: 'GEO_ZS_KINDU',
    code: 'ZS_KIN',
    name: 'Zone de Santé de Kindu',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9515, lng: 25.923 },
    population: 215000,
    area_km2: 65,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_ALUNGULI',
    code: 'ZS_ALU',
    name: 'Zone de Santé d’Alunguli',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.948, lng: 25.938 },
    population: 195000,
    area_km2: 85,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_KASONGO',
    code: 'ZS_KAS',
    name: 'Zone de Santé de Kasongo',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KASONGO',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.433, lng: 26.666 },
    population: 230000,
    area_km2: 4500,
    status: 'ACTIF',
    source: 'DPS Maniema / PNLP',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_SAMBA',
    code: 'ZS_SAM',
    name: 'Zone de Santé de Samba',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KASONGO',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.680, lng: 26.550 },
    population: 175000,
    area_km2: 4200,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_KIBOMBO',
    code: 'ZS_KIB',
    name: 'Zone de Santé de Kibombo',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KIBOMBO',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -3.950, lng: 25.983 },
    population: 220000,
    area_km2: 7800,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_PUNIA',
    code: 'ZS_PUN',
    name: 'Zone de Santé de Punia',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_PUNIA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -1.450, lng: 26.416 },
    population: 155000,
    area_km2: 9500,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_FEREKENI',
    code: 'ZS_FER',
    name: 'Zone de Santé de Ferekeni',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_PUNIA',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -1.820, lng: 26.250 },
    population: 85000,
    area_km2: 8200,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_KAMPENE',
    code: 'ZS_KAM',
    name: 'Zone de Santé de Kampene',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_PANGI',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -3.596, lng: 26.666 },
    population: 185000,
    area_km2: 5200,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_LUSANGI',
    code: 'ZS_LUS',
    name: 'Zone de Santé de Lusangi',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_PANGI',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -3.283, lng: 27.283 },
    population: 140000,
    area_km2: 6800,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_LUBUTU',
    code: 'ZS_LUB',
    name: 'Zone de Santé de Lubutu',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_LUBUTU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -0.733, lng: 26.583 },
    population: 145000,
    area_km2: 7400,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_OBOKOTE',
    code: 'ZS_OBO',
    name: 'Zone de Santé d’Obokote',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_LUBUTU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -0.450, lng: 26.900 },
    population: 85000,
    area_km2: 6900,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_KAILO',
    code: 'ZS_KAI',
    name: 'Zone de Santé de Kailo',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KAILO',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.633, lng: 26.116 },
    population: 165000,
    area_km2: 8900,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_KABAMBARE',
    code: 'ZS_KAB',
    name: 'Zone de Santé de Kabambare',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KABAMBARE',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.700, lng: 27.716 },
    population: 160000,
    area_km2: 6200,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_ZS_SARAMABILA',
    code: 'ZS_SAR',
    name: 'Zone de Santé de Saramabila',
    level: 'ZONE_SANTE',
    parentId: 'GEO_TERR_KABAMBARE',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -4.950, lng: 27.500 },
    population: 135000,
    area_km2: 5400,
    status: 'ACTIF',
    source: 'DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },

  // 4. NIVEAU AIRES DE SANTÉ (Aires de santé de Kindu & Alunguli et représentatives)
  {
    id: 'GEO_AS_MIKELENGE',
    code: 'AS_MIK',
    name: 'Aire de Santé Mikelenge',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9482, lng: 25.9185 },
    population: 24500,
    area_km2: 3.8,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_BASOKO',
    code: 'AS_BAS',
    name: 'Aire de Santé Basoko',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.942, lng: 25.924 },
    population: 22800,
    area_km2: 3.2,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_TOKOLOTE',
    code: 'AS_TOK',
    name: 'Aire de Santé Tokolote',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9615, lng: 25.919 },
    population: 26100,
    area_km2: 4.1,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_KASUKU',
    code: 'AS_KAS',
    name: 'Aire de Santé Kasuku',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.955, lng: 25.928 },
    population: 28500,
    area_km2: 4.5,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_LUMBULUMBU',
    code: 'AS_LUM',
    name: 'Aire de Santé Lumbulumbu',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.958, lng: 25.932 },
    population: 21400,
    area_km2: 3.5,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_MAYELE',
    code: 'AS_MAY',
    name: 'Aire de Santé Mayele',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_KINDU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.932, lng: 25.946 },
    population: 18900,
    area_km2: 3.1,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_ALUNGULI',
    code: 'AS_ALU_C',
    name: 'Aire de Santé Alunguli Centre',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_ALUNGULI',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.948, lng: 25.912 },
    population: 31200,
    area_km2: 5.2,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_AS_TCHABOBO',
    code: 'AS_TCH',
    name: 'Aire de Santé Tchabobo',
    level: 'AIRE_SANTE',
    parentId: 'GEO_ZS_ALUNGULI',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.968, lng: 25.901 },
    population: 19800,
    area_km2: 4.8,
    status: 'ACTIF',
    source: 'Carte Sanitaire DPS Maniema',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },

  // 5. NIVEAU QUARTIERS / SITES D'OBSERVATION (Exemples)
  {
    id: 'GEO_QRT_KASUKU_1',
    code: 'QRT_KAS1',
    name: 'Quartier Kasuku Centre',
    level: 'QUARTIER_VILLAGE',
    parentId: 'GEO_AS_KASUKU',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9545, lng: 25.9275 },
    population: 8500,
    status: 'ACTIF',
    source: 'Mairie de Kindu',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'GEO_SITE_PORT_BASOKO',
    code: 'SITE_PORT_BAS',
    name: 'Site Débarcadère Port Basoko (Fleuve Congo)',
    level: 'SITE',
    parentId: 'GEO_AS_BASOKO',
    provinceId: 'GEO_PROV_MANIEMA',
    coordinates: { lat: -2.9360, lng: 25.9290 },
    population: 0,
    status: 'ACTIF',
    source: 'Enquête Environnementale One Health',
    createdAt: '2023-01-15',
    updatedAt: '2026-08-28'
  }
];

/**
 * CATALOGUE DES PATHOLOGIES DU MOTEUR ONE HEALTH V1.10
 * Paludisme, Fièvre typhoïde, Choléra, Diarrhées Aiguës, Arboviroses, Mpox/Zoonoses
 */
export const INITIAL_PATHOLOGIES: PathologyConfig[] = [
  {
    id: 'PATH_PALUDISME',
    code: 'MAL',
    name: 'Paludisme',
    scientificName: 'Plasmodium falciparum / vivax',
    category: 'VECTORIELLE',
    transmissionMode: 'MOUSTIQUE_ANOPHELE',
    description: 'Infection parasitaire transmise par les piqûres de moustiques femelles Anopheles gambiae s.l. dans les gîtes d’eau douce stagnante.',
    isActive: true,
    icon: 'Bug',
    color: '#0d9488', // teal-600
    oneHealthDimension: 'SANTE_HUMAINE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_MAL_DIAGNOSTIC',
        code: 'MAL_DIAG',
        label: 'Type de test diagnostique',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: true,
        options: [
          { value: 'TDR_PF_PAN', label: 'TDR rapide (Pf/Pan)' },
          { value: 'GOUTTE_EPAISSE', label: 'Microscopie (Goutte Épaisse)' },
          { value: 'FROTTIS_MINCE', label: 'Frottis mince sanguin' },
          { value: 'CLINIQUE_PRESOMPTIF', label: 'Présomptif clinique seul' }
        ],
        description: 'Méthode de confirmation biologique utilisée lors de la consultation.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_MAL_MILDA',
        code: 'MAL_MILDA',
        label: 'Utilisation moustiquaire imprégnée (MILDA)',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Dormir sous moustiquaire imprégnée d’insecticide longue durée la nuit précédant la fièvre.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_MAL_EAU_STAGNANTE',
        code: 'MAL_EAU_STAG',
        label: 'Présence de gîtes d’eau stagnante (<100m)',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Gîte larvaire potentiel identifié à proximité immédiate de l’habitation.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_MAL_GROUPE_VULNERABLE',
        code: 'MAL_VULN',
        label: 'Groupe vulnérable spécifique',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: false,
        options: [
          { value: 'ENFANT_MOINS_5_ANS', label: 'Enfant de moins de 5 ans' },
          { value: 'FEMME_ENCEINTE', label: 'Femme enceinte' },
          { value: 'ADULTE_TOUT_VENANT', label: 'Adulte / Autre' }
        ],
        description: 'Catégorisation épidémiologique à risque accru.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_MAL_INCIDENCE',
        name: 'Incidence mensuelle du paludisme (/1 000 hab)',
        formulaDescription: '(Cas confirmés / Population AS) × 1 000',
        unit: 'pour 1 000 hab'
      },
      {
        id: 'IND_MAL_POSITIVITE',
        name: 'Taux de positivité TDR / Microscopie (%)',
        formulaDescription: '(Cas confirmés / Total tests réalisés) × 100',
        unit: '%'
      }
    ],
    dataSources: ['SRC_DHIS2_SNIS', 'SRC_ENQUETE_MENAGE', 'SRC_OBS_GITES'],
    collectionFrequency: 'MENSUEL',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'PATH_TYPHOIDE',
    code: 'TYP',
    name: 'Fièvre typhoïde',
    scientificName: 'Salmonella enterica serovar Typhi',
    category: 'HYDRIQUE_ALIMENTAIRE',
    transmissionMode: 'EAU_ALIMENT_CONTAMINE',
    description: 'Infection bactérienne systémique transmise par ingestion d’eau ou d’aliments contaminés par des matières fécales (circuit oro-fécal et défaillance WASH).',
    isActive: true,
    icon: 'Activity',
    color: '#ea580c', // orange-600
    oneHealthDimension: 'SANTE_HUMAINE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_TYP_EAU_SOURCE',
        code: 'TYP_EAU_SRC',
        label: 'Source principale d’eau de boisson',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: true,
        options: [
          { value: 'ROBINET_REGIDESO', label: 'Régie des Eaux (REGIDESO)' },
          { value: 'PUITS_PROTEGE', label: 'Puits ou forage protégé' },
          { value: 'PUITS_NON_PROTEGE', label: 'Puits ouvert non protégé' },
          { value: 'SOURCE_NATURELLE', label: 'Source naturelle / Rivière' },
          { value: 'EAU_PLUIE', label: 'Eau de pluie stockée' }
        ],
        description: 'Origine de l’eau consommée quotidiennement.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_TYP_EAU_TRAITEMENT',
        code: 'TYP_TRAIT',
        label: 'Traitement de l’eau à domicile',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: false,
        options: [
          { value: 'CHLORE_AQUATABS', label: 'Chlore / Aquatabs / Solution hydro-chlorée' },
          { value: 'EBULLITION', label: 'Ébullition prolongée' },
          { value: 'FILTRATION', label: 'Filtration céramique/sable' },
          { value: 'AUCUN', label: 'Aucun traitement (eau brute)' }
        ],
        description: 'Mesure de désinfection appliquée à domicile.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_TYP_LATRINE',
        code: 'TYP_LAT',
        label: 'Type de latrine / assainissement',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: false,
        options: [
          { value: 'CHASSE_FOSSE_SEPTIQUE', label: 'Chasse avec fosse septique étanche' },
          { value: 'LATRINE_FOSSE_AMELIOREE', label: 'Latrine à fosse couverte / dalle lavable' },
          { value: 'LATRINE_FOSSE_OUVERTE', label: 'Fosse simple non couverte' },
          { value: 'DEFECTION_AIR_LIBRE', label: 'Défécation à l’air libre / dans cours d’eau' }
        ],
        description: 'Dispositif sanitaire de défécation.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_TYP_INONDATION',
        code: 'TYP_INOND',
        label: 'Inondation ou remontée des eaux récentes',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Exposition récente à une inondation par le fleuve Congo ou ruissellement urbain.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_TYP_INCIDENCE',
        name: 'Incidence de la fièvre typhoïde (/1 000 hab)',
        formulaDescription: '(Cas suspects & confirmés / Population AS) × 1 000',
        unit: 'pour 1 000 hab'
      },
      {
        id: 'IND_TYP_WIDAL_CONF',
        name: 'Taux de confirmation sérologique (Widal / Hémoculture)',
        formulaDescription: '(Confirmés bio / Cas totaux) × 100',
        unit: '%'
      }
    ],
    dataSources: ['SRC_DHIS2_SNIS', 'SRC_ENQUETE_MENAGE', 'SRC_LABO_PROVINCIAL'],
    collectionFrequency: 'MENSUEL',
    createdAt: '2020-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'PATH_CHOLERA',
    code: 'CHO',
    name: 'Choléra',
    scientificName: 'Vibrio cholerae O1 / O139',
    category: 'HYDRIQUE_ALIMENTAIRE',
    transmissionMode: 'EAU_ALIMENT_CONTAMINE',
    description: 'Maladie diarrhéique aiguë sévère hautement contagieuse, à potentiel épidémique foudroyant liée à la contamination fécale des eaux du fleuve Congo et des rivières.',
    isActive: true,
    icon: 'ShieldAlert',
    color: '#e11d48', // rose-600
    oneHealthDimension: 'SANTE_HUMAINE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_CHO_DESHYDRATATION',
        code: 'CHO_DESHYDR',
        label: 'Degré de déshydratation clinique',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: true,
        options: [
          { value: 'SEVER_PLAN_C', label: 'Sévère (Plan C de réhydratation IV)' },
          { value: 'MODEREE_PLAN_B', label: 'Modérée (Plan B SRO)' },
          { value: 'LEGERE_PLAN_A', label: 'Légère / Sans déshydratation' }
        ],
        description: 'Évaluation clinique immédiate du patient.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_CHO_ORIGINE_EAU_FLEUVE',
        code: 'CHO_FLEUVE',
        label: 'Consommation directe d’eau du Fleuve Congo',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Utilisation d’eau brute du fleuve pour boire ou laver les aliments.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_CHO_LETALITE',
        name: 'Taux de létalité du choléra (%)',
        formulaDescription: '(Décès choléra / Total cas) × 100',
        unit: '%'
      }
    ],
    dataSources: ['SRC_SURVEILLANCE_EPIDEMIO', 'SRC_LABO_PROVINCIAL', 'SRC_CTC_KINDU'],
    collectionFrequency: 'HEBDOMADAIRE',
    createdAt: '2024-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'PATH_DIARRHEES',
    code: 'DIA',
    name: 'Diarrhées aiguës fébriles',
    scientificName: 'Rotavirus / Shigella / E. coli entéropathogènes',
    category: 'HYDRIQUE_ALIMENTAIRE',
    transmissionMode: 'CONTACT_ORAL_FECAL',
    description: 'Entéropathies infectieuses aiguës touchant préférentiellement les enfants de moins de 5 ans.',
    isActive: true,
    icon: 'AlertCircle',
    color: '#d97706', // amber-600
    oneHealthDimension: 'SANTE_HUMAINE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_DIA_LAVAGE_MAINS',
        code: 'DIA_LAVAGE',
        label: 'Dispositif de lavage des mains avec savon',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Présence d’eau et de savon au point de lavage des mains.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_DIA_INCIDENCE_U5',
        name: 'Incidence diarrhées aiguës (<5 ans) (/1 000)',
        formulaDescription: '(Cas diarrhée <5ans / Pop <5ans) × 1 000',
        unit: 'pour 1 000 hab'
      }
    ],
    dataSources: ['SRC_DHIS2_SNIS', 'SRC_ENQUETE_MENAGE'],
    collectionFrequency: 'MENSUEL',
    createdAt: '2024-01-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'PATH_ARBOVIROSES',
    code: 'ARB',
    name: 'Arboviroses (Dengue, Chikungunya, Fièvre Jaune)',
    scientificName: 'Flavivirus / Alphavirus (Vecteur: Aedes aegypti / albopictus)',
    category: 'VECTORIELLE',
    transmissionMode: 'MOUSTIQUE_AEDES',
    description: 'Maladies virales transmises par les piqûres de moustiques du genre Aedes proliférant dans les petits récipients d’eau propre artificielle et dépôts de pneus.',
    isActive: true,
    icon: 'Sparkles',
    color: '#8b5cf6', // purple-600
    oneHealthDimension: 'SANTE_HUMAINE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_ARB_DECHETS_PNEUS',
        code: 'ARB_PNEUS',
        label: 'Présence de récipients / pneus abandonnés (<50m)',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: false,
        description: 'Gîtes larvaires typiques pour Aedes sp.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_ARB_CAS_SUSPECTS',
        name: 'Total cas suspects fébriles avec arthralgies',
        formulaDescription: 'Somme des cas suspects notifiés',
        unit: 'cas'
      }
    ],
    dataSources: ['SRC_SURVEILLANCE_EPIDEMIO', 'SRC_INRB_KINSHASA'],
    collectionFrequency: 'MENSUEL',
    createdAt: '2024-06-01',
    updatedAt: '2026-08-28'
  },
  {
    id: 'PATH_MPOX_ZOONOSE',
    code: 'MPX',
    name: 'Mpox & Zoonoses émergentes',
    scientificName: 'Monkeypox virus (Clade I - Bassin du Congo)',
    category: 'ZOONOTIQUE',
    transmissionMode: 'CONTACT_DIRECT_ANIMAL',
    description: 'Infection zoonotique virale transmise par contact direct avec les animaux sauvages infectés (rongeurs, écureuils, primates) et transmission interhumaine secondaire.',
    isActive: true,
    icon: 'Bug',
    color: '#be185d', // pink-700
    oneHealthDimension: 'SANTE_ANIMALE',
    commonVariables: ['VAR_CAS_TOTAL', 'VAR_CAS_CONFIRMES', 'VAR_HOSPITALISATIONS', 'VAR_DECES'],
    specificVariables: [
      {
        id: 'VAR_MPX_CONTACT_ANIMAL',
        code: 'MPX_ANIMAL',
        label: 'Contact avec faune sauvage ou viande de brousse (<21 jours)',
        type: 'BOOLEAN',
        category: 'SPECIFIQUE',
        required: true,
        description: 'Chasse, dépeçage ou consommation de gibier sauvage.',
        availabilityStatus: 'DISPONIBLE'
      },
      {
        id: 'VAR_MPX_LESIONS',
        code: 'MPX_LESIONS',
        label: 'Type et stade des éruptions cutanées',
        type: 'CATEGORICAL',
        category: 'SPECIFIQUE',
        required: true,
        options: [
          { value: 'VESICULES_PUSTULES', label: 'Vésicules / Pustules ombiliquées' },
          { value: 'CROUTES', label: 'Stade de desquamation / croûtes' },
          { value: 'MACULES_PAPULES', label: 'Macules / Papules précoces' }
        ],
        description: 'Examen dermatologique des lésions.',
        availabilityStatus: 'DISPONIBLE'
      }
    ],
    indicators: [
      {
        id: 'IND_MPX_INCIDENCE',
        name: 'Cas notifiés Mpox dans la zone',
        formulaDescription: 'Nombre absolu de cas testés PCR + cliniques',
        unit: 'cas'
      }
    ],
    dataSources: ['SRC_SURVEILLANCE_EPIDEMIO', 'SRC_INRB_KINSHASA', 'SRC_VETERINAIRE_MANIEMA'],
    collectionFrequency: 'HEBDOMADAIRE',
    createdAt: '2024-01-01',
    updatedAt: '2026-08-28'
  }
];

/**
 * GESTION MULTI-PROJETS ONE HEALTH V1.10
 */
export const INITIAL_ONE_HEALTH_PROJECTS: OneHealthProject[] = [
  {
    id: 'PRJ_ONEHEALTH_KINDU',
    code: 'PRJ-KIN-01',
    name: 'Étude Spatio-Temporelle Paludisme, Typhoïde & Climat — Kindu',
    description: 'Projet universitaire One Health originel centré sur la modélisation des risques climatiques et hydriques à Kindu.',
    principalInvestigator: 'Équipe de Recherche One Health UNIKI / DPS Maniema',
    institution: 'Université de Kindu (UNIKI) & DPS Maniema',
    pathologyIds: ['PATH_PALUDISME', 'PATH_TYPHOIDE'],
    geographicUnitIds: ['GEO_TERR_KINDU', 'GEO_ZS_KINDU', 'GEO_ZS_ALUNGULI'],
    startDate: '2020-01-01',
    endDate: '2026-12-31',
    status: 'ACTIF',
    isDemoAllowed: true,
    assignedUsers: [
      { userId: 'USR-001', role: 'ADMINISTRATEUR' },
      { userId: 'USR-002', role: 'RESPONSABLE_PROJET' }
    ],
    createdAt: '2020-01-01'
  },
  {
    id: 'PRJ_MANIEMA_SURVEILLANCE',
    code: 'PRJ-MAN-02',
    name: 'Plateforme Provinciale de Surveillance Épidémiologique — Maniema',
    description: 'Extension provinciale multi-pathologies One Health couvrant les 18 zones de santé du Maniema (surveillance intégrée).',
    principalInvestigator: 'Division Provinciale de la Santé (DPS) Maniema',
    institution: 'DPS Maniema / Ministère de la Santé Publique RDC',
    pathologyIds: ['PATH_PALUDISME', 'PATH_TYPHOIDE', 'PATH_CHOLERA', 'PATH_DIARRHEES', 'PATH_ARBOVIROSES', 'PATH_MPOX_ZOONOSE'],
    geographicUnitIds: ['GEO_PROV_MANIEMA', 'GEO_TERR_KINDU', 'GEO_TERR_KASONGO', 'GEO_TERR_KIBOMBO', 'GEO_TERR_PUNIA', 'GEO_TERR_PANGI', 'GEO_TERR_LUBUTU', 'GEO_TERR_KAILO', 'GEO_TERR_KABAMBARE'],
    startDate: '2023-01-01',
    endDate: '2028-12-31',
    status: 'ACTIF',
    isDemoAllowed: true,
    assignedUsers: [
      { userId: 'USR-001', role: 'ADMINISTRATEUR' },
      { userId: 'USR-003', role: 'RESPONSABLE_PROVINCIAL' }
    ],
    createdAt: '2023-01-01'
  },
  {
    id: 'PRJ_CHOLERA_FLEUVE',
    code: 'PRJ-CHO-03',
    name: 'Surveillance Spécifique Choléra & Risques Hydriques — Axe Fleuve Congo',
    description: 'Suivi sentinelle des points d’eau, débarcadères et zones inondables le long du fleuve Congo à Kindu, Kasongo et Kibombo.',
    principalInvestigator: 'Coordination provinciale WASH & Épidémies',
    institution: 'DPS Maniema / Partenaires WASH One Health',
    pathologyIds: ['PATH_CHOLERA', 'PATH_TYPHOIDE', 'PATH_DIARRHEES'],
    geographicUnitIds: ['GEO_TERR_KINDU', 'GEO_TERR_KIBOMBO', 'GEO_TERR_KASONGO'],
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    status: 'ACTIF',
    isDemoAllowed: true,
    assignedUsers: [
      { userId: 'USR-001', role: 'ADMINISTRATEUR' },
      { userId: 'USR-004', role: 'SUPERVISEUR' }
    ],
    createdAt: '2024-01-01'
  }
];

/**
 * PÉRIODES ET TRAÇABILITÉ DES SOURCES DE DONNÉES V1.10
 */
export const INITIAL_TIME_PERIOD_CONFIGS: TimePeriodConfig[] = [
  {
    id: 'TP_SANTE_DHIS2',
    sourceId: 'SRC_DHIS2_SNIS',
    sourceName: 'Registres Sanitaires Mensuels DHIS2 / SNIS RDC',
    sourceType: 'REGISTRE_SANITAIRE',
    startDate: '2018-01-01',
    endDate: '2026-12-31',
    totalYears: 9,
    temporalResolution: 'MOIS',
    geographicLevel: 'AIRE_SANTE',
    reliability: 'HAUTE',
    lastImportDate: '2026-08-25'
  },
  {
    id: 'TP_CLIMAT_AERO',
    sourceId: 'SRC_METEO_KINDU',
    sourceName: 'Station Météorologique Synoptique de Kindu Aéro',
    sourceType: 'DONNEES_CLIMATIQUES',
    startDate: '2010-01-01',
    endDate: '2026-12-31',
    totalYears: 17,
    temporalResolution: 'JOUR',
    geographicLevel: 'VILLE_TERRITOIRE',
    reliability: 'HAUTE',
    lastImportDate: '2026-08-20'
  },
  {
    id: 'TP_ENV_TERRAIN',
    sourceId: 'SRC_OBS_GITES',
    sourceName: 'Observations de Terrain Gîtes Larvaires & WASH',
    sourceType: 'OBSERVATION_TERRAIN',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    totalYears: 4,
    temporalResolution: 'MOIS',
    geographicLevel: 'SITE',
    reliability: 'HAUTE',
    lastImportDate: '2026-08-28'
  },
  {
    id: 'TP_ENQUETE_MENAGE',
    sourceId: 'SRC_ENQUETE_MENAGE',
    sourceName: 'Enquêtes Ménages et Comportements Préventifs',
    sourceType: 'ENQUETE_MENAGE',
    startDate: '2023-01-01',
    endDate: '2026-12-31',
    totalYears: 4,
    temporalResolution: 'JOUR',
    geographicLevel: 'MENAGE_POINT',
    reliability: 'HAUTE',
    lastImportDate: '2026-08-28'
  },
  {
    id: 'TP_SATELLITE_CHIRPS',
    sourceId: 'SRC_CHIRPS_ERA5',
    sourceName: 'Données Satellitaires Précipitations & Température (CHIRPS / ERA5-Land)',
    sourceType: 'DONNEES_SATELLITAIRES',
    startDate: '2010-01-01',
    endDate: '2026-12-31',
    totalYears: 17,
    temporalResolution: 'MOIS',
    geographicLevel: 'PROVINCE',
    reliability: 'HAUTE',
    lastImportDate: '2026-08-15'
  }
];

/**
 * UTILISATEURS ET RÔLES V1.10
 */
export const INITIAL_USERS_V110: UserSessionV110[] = [
  {
    id: 'USR-001',
    name: 'Prof. Dr. Kasuku Jean-Paul',
    role: 'ADMINISTRATEUR',
    institution: 'Université de Kindu / DPS Maniema',
    email: 'admin.onehealth@uniki.ac.cd',
    assignedTerritoryId: 'GEO_PROV_MANIEMA',
    assignedZoneId: 'GEO_ZS_KINDU',
    assignedAreaId: 'GEO_AS_KASUKU',
    isActive: true
  },
  {
    id: 'USR-002',
    name: 'Dr. Amisi Pierre',
    role: 'RESPONSABLE_PROVINCIAL',
    institution: 'Direction Provinciale de la Santé (DPS Maniema)',
    email: 'dps.epidemiologie@maniema.gouv.cd',
    assignedTerritoryId: 'GEO_PROV_MANIEMA',
    isActive: true
  },
  {
    id: 'USR-003',
    name: 'Dr. Fatuma Madeleine',
    role: 'RESPONSABLE_PROJET',
    institution: 'Faculté de Médecine UNIKI',
    email: 'fatuma.m@uniki.ac.cd',
    assignedTerritoryId: 'GEO_TERR_KINDU',
    assignedZoneId: 'GEO_ZS_KINDU',
    isActive: true
  },
  {
    id: 'USR-004',
    name: 'M. Tambwe Michel',
    role: 'SUPERVISEUR',
    institution: 'Zone de Santé de Kindu (Rive Droite)',
    email: 'tambwe.superviseur@zs-kindu.cd',
    assignedTerritoryId: 'GEO_TERR_KINDU',
    assignedZoneId: 'GEO_ZS_KINDU',
    isActive: true
  },
  {
    id: 'USR-005',
    name: 'Mlle. Kitenge Sarah',
    role: 'ENQUETEUR',
    institution: 'Équipe Terrain One Health Maniema',
    email: 'kitenge.enquete@onehealth.cd',
    assignedTerritoryId: 'GEO_TERR_KINDU',
    assignedZoneId: 'GEO_ZS_KINDU',
    assignedAreaId: 'GEO_AS_MIKELENGE',
    isActive: true
  }
];

/**
 * EXEMPLES D'OBSERVATIONS DYNAMIQUES DE DÉMONSTRATION V1.10 (CLAIREMENT MARQUÉES isDemo: true)
 */
export const INITIAL_DYNAMIC_OBSERVATIONS: DynamicObservationRecord[] = [
  {
    id: 'OBS_DYN_001',
    projectId: 'PRJ_ONEHEALTH_KINDU',
    pathologyId: 'PATH_PALUDISME',
    pathologyCode: 'MAL',
    date: '2024-03-15',
    year: 2024,
    month: 3,
    provinceId: 'GEO_PROV_MANIEMA',
    geographicUnitId: 'GEO_AS_MIKELENGE',
    geographicLevel: 'AIRE_SANTE',
    sourceId: 'SRC_DHIS2_SNIS',
    sourceType: 'REGISTRE_SANITAIRE',
    investigatorId: 'USR-005',
    investigatorName: 'Kitenge Sarah',
    coordinates: { lat: -2.9482, lng: 25.9185 },
    validationStatus: 'VALIDATED',
    dataQuality: 'VALIDE',
    isDemo: true,
    commonData: {
      cases_total: 142,
      cases_confirmed: 128,
      hospitalized: 18,
      deaths: 1,
      notes: 'Pic saisonnier observé suite aux pluies d’avril-mars.'
    },
    specificData: {
      MAL_DIAG: 'TDR_PF_PAN',
      MAL_MILDA: true,
      MAL_EAU_STAG: true,
      MAL_VULN: 'ENFANT_MOINS_5_ANS'
    },
    variableAvailability: {
      MAL_DIAG: 'DISPONIBLE',
      MAL_MILDA: 'DISPONIBLE',
      MAL_EAU_STAG: 'DISPONIBLE',
      MAL_VULN: 'DISPONIBLE'
    },
    createdAt: '2024-03-16T08:30:00Z',
    updatedAt: '2024-03-16T08:30:00Z'
  },
  {
    id: 'OBS_DYN_002',
    projectId: 'PRJ_ONEHEALTH_KINDU',
    pathologyId: 'PATH_TYPHOIDE',
    pathologyCode: 'TYP',
    date: '2024-03-18',
    year: 2024,
    month: 3,
    provinceId: 'GEO_PROV_MANIEMA',
    geographicUnitId: 'GEO_AS_BASOKO',
    geographicLevel: 'AIRE_SANTE',
    sourceId: 'SRC_DHIS2_SNIS',
    sourceType: 'REGISTRE_SANITAIRE',
    investigatorId: 'USR-005',
    investigatorName: 'Kitenge Sarah',
    coordinates: { lat: -2.942, lng: 25.924 },
    validationStatus: 'VALIDATED',
    dataQuality: 'VALIDE',
    isDemo: true,
    commonData: {
      cases_total: 48,
      cases_confirmed: 35,
      hospitalized: 9,
      deaths: 0,
      notes: 'Cas groupés près du quartier portuaire.'
    },
    specificData: {
      TYP_EAU_SRC: 'PUITS_NON_PROTEGE',
      TYP_TRAIT: 'AUCUN',
      TYP_LAT: 'LATRINE_FOSSE_OUVERTE',
      TYP_INOND: true
    },
    variableAvailability: {
      TYP_EAU_SRC: 'DISPONIBLE',
      TYP_TRAIT: 'DISPONIBLE',
      TYP_LAT: 'DISPONIBLE',
      TYP_INOND: 'DISPONIBLE'
    },
    createdAt: '2024-03-19T09:15:00Z',
    updatedAt: '2024-03-19T09:15:00Z'
  },
  {
    id: 'OBS_DYN_003',
    projectId: 'PRJ_CHOLERA_FLEUVE',
    pathologyId: 'PATH_CHOLERA',
    pathologyCode: 'CHO',
    date: '2024-04-02',
    year: 2024,
    month: 4,
    provinceId: 'GEO_PROV_MANIEMA',
    geographicUnitId: 'GEO_SITE_PORT_BASOKO',
    geographicLevel: 'SITE',
    sourceId: 'SRC_CTC_KINDU',
    sourceType: 'OBSERVATION_TERRAIN',
    investigatorId: 'USR-004',
    investigatorName: 'Tambwe Michel',
    coordinates: { lat: -2.9360, lng: 25.9290 },
    validationStatus: 'VALIDATED',
    dataQuality: 'VALIDE',
    isDemo: true,
    commonData: {
      cases_total: 12,
      cases_confirmed: 8,
      hospitalized: 12,
      deaths: 1,
      notes: 'Alerte précoce au point de débarquement fluvial.'
    },
    specificData: {
      CHO_DESHYDR: 'SEVER_PLAN_C',
      CHO_FLEUVE: true
    },
    variableAvailability: {
      CHO_DESHYDR: 'DISPONIBLE',
      CHO_FLEUVE: 'DISPONIBLE'
    },
    createdAt: '2024-04-02T14:00:00Z',
    updatedAt: '2024-04-02T14:00:00Z'
  }
];
