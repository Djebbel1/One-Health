/**
 * ONE HEALTH MANIEMA — Hiérarchie Géographique Extensible (V1.21)
 * 
 * Ce module formalise la structure géographique administrative et sanitaire :
 * Niveau 1 : Province (Maniema par défaut)
 * Niveau 2 : Territoire ou Ville (ex: Kindu Ville, Kasongo, Kailo, Pangi, etc.)
 * Niveau 3 : Zone de Santé (ex: Alunguli, Kasuku, Mikelenge, etc.)
 * Niveau 4 : Aire de Santé (ex: Basoko, Lwama, Tokolote, etc.)
 * Niveau 5 : Quartier / Village / Localité & Coordonnées GPS
 * 
 * RÈGLE FONDAMENTALE V1.21 :
 * - Maniema est la Province.
 * - Kindu est la Ville (chef-lieu de province) et le site pilote historique.
 * - L'architecture est totalement extensible à d'autres provinces de la RDC.
 */

export interface HealthAreaInfo {
  id: string;
  name: string;
  type: 'URBAINE' | 'PERIURBAINE' | 'RURALE';
  estimatedPopulation?: number;
  latitude: number;
  longitude: number;
}

export interface HealthZoneInfo {
  id: string;
  name: string;
  code: string;
  territoryOrCityId: string;
  healthAreas: HealthAreaInfo[];
}

export interface TerritoryOrCityInfo {
  id: string;
  name: string;
  type: 'VILLE' | 'TERRITOIRE';
  provinceId: string;
  healthZones: HealthZoneInfo[];
}

export interface ProvinceInfo {
  id: string;
  name: string;
  country: string;
  isDefaultActive: boolean;
  territories: TerritoryOrCityInfo[];
}

export const MANIEMA_PROVINCE_DATA: ProvinceInfo = {
  id: 'PRV-MANIEMA',
  name: 'Maniema',
  country: 'République Démocratique du Congo',
  isDefaultActive: true,
  territories: [
    {
      id: 'TER-KINDU-VILLE',
      name: 'Kindu (Ville)',
      type: 'VILLE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-ALUNGULI',
          name: 'Alunguli',
          code: 'ZS-ALU',
          territoryOrCityId: 'TER-KINDU-VILLE',
          healthAreas: [
            { id: 'AS-ALU-BASOKO', name: 'Basoko', type: 'URBAINE', estimatedPopulation: 14200, latitude: -2.9465, longitude: 25.9234 },
            { id: 'AS-ALU-KANDOLO', name: 'Kandolo', type: 'URBAINE', estimatedPopulation: 11800, latitude: -2.9512, longitude: 25.9189 },
            { id: 'AS-ALU-LWAMA', name: 'Lwama', type: 'PERIURBAINE', estimatedPopulation: 16500, latitude: -2.9620, longitude: 25.9310 },
            { id: 'AS-ALU-RIVE-GAUCHE', name: 'Rive Gauche', type: 'URBAINE', estimatedPopulation: 9800, latitude: -2.9410, longitude: 25.9280 }
          ]
        },
        {
          id: 'ZS-KASUKU',
          name: 'Kasuku',
          code: 'ZS-KAS',
          territoryOrCityId: 'TER-KINDU-VILLE',
          healthAreas: [
            { id: 'AS-KAS-CENTRE-VILLE', name: 'Centre-Ville', type: 'URBAINE', estimatedPopulation: 22000, latitude: -2.9500, longitude: 25.9333 },
            { id: 'AS-KAS-TOKOLOTE', name: 'Tokolote', type: 'URBAINE', estimatedPopulation: 15400, latitude: -2.9380, longitude: 25.9410 },
            { id: 'AS-KAS-MANYANGA', name: 'Manyanga', type: 'URBAINE', estimatedPopulation: 13900, latitude: -2.9560, longitude: 25.9390 },
            { id: 'AS-KAS-RVA', name: 'RVA / Aéroport', type: 'PERIURBAINE', estimatedPopulation: 8500, latitude: -2.9220, longitude: 25.9150 }
          ]
        },
        {
          id: 'ZS-MIKELENGE',
          name: 'Mikelenge',
          code: 'ZS-MIK',
          territoryOrCityId: 'TER-KINDU-VILLE',
          healthAreas: [
            { id: 'AS-MIK-CAMP-UNIKI', name: 'Campus UNIKI / Kasuku Sud', type: 'URBAINE', estimatedPopulation: 12500, latitude: -2.9680, longitude: 25.9450 },
            { id: 'AS-MIK-MIKELENGE-CENTRE', name: 'Mikelenge Centre', type: 'URBAINE', estimatedPopulation: 18200, latitude: -2.9720, longitude: 25.9520 },
            { id: 'AS-MIK-SONGOLOLO', name: 'Songololo', type: 'PERIURBAINE', estimatedPopulation: 10400, latitude: -2.9810, longitude: 25.9600 }
          ]
        }
      ]
    },
    {
      id: 'TER-KASONGO',
      name: 'Kasongo',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-KASONGO',
          name: 'Kasongo',
          code: 'ZS-KSG',
          territoryOrCityId: 'TER-KASONGO',
          healthAreas: [
            { id: 'AS-KSG-CENTRE', name: 'Kasongo Centre', type: 'PERIURBAINE', estimatedPopulation: 19000, latitude: -4.4300, longitude: 26.6667 },
            { id: 'AS-KSG-MUSONGI', name: 'Musongi', type: 'RURALE', estimatedPopulation: 9500, latitude: -4.4800, longitude: 26.7100 }
          ]
        },
        {
          id: 'ZS-KUNDA',
          name: 'Kunda',
          code: 'ZS-KND',
          territoryOrCityId: 'TER-KASONGO',
          healthAreas: [
            { id: 'AS-KND-CENTRE', name: 'Kunda Centre', type: 'RURALE', estimatedPopulation: 8200, latitude: -4.2100, longitude: 26.4500 }
          ]
        }
      ]
    },
    {
      id: 'TER-KAILO',
      name: 'Kailo',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-KAILO',
          name: 'Kailo',
          code: 'ZS-KAI',
          territoryOrCityId: 'TER-KAILO',
          healthAreas: [
            { id: 'AS-KAI-CENTRE', name: 'Kailo Centre', type: 'RURALE', estimatedPopulation: 7600, latitude: -2.6300, longitude: 26.1200 }
          ]
        }
      ]
    },
    {
      id: 'TER-PANGI',
      name: 'Pangi',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-PANGI',
          name: 'Pangi',
          code: 'ZS-PNG',
          territoryOrCityId: 'TER-PANGI',
          healthAreas: [
            { id: 'AS-PNG-CENTRE', name: 'Pangi Centre', type: 'RURALE', estimatedPopulation: 11200, latitude: -3.2800, longitude: 26.7200 }
          ]
        },
        {
          id: 'ZS-KAMPENE',
          name: 'Kampene',
          code: 'ZS-KMP',
          territoryOrCityId: 'TER-PANGI',
          healthAreas: [
            { id: 'AS-KMP-MINIERE', name: 'Kampene Cité Minière', type: 'PERIURBAINE', estimatedPopulation: 23000, latitude: -3.5900, longitude: 26.6600 }
          ]
        }
      ]
    },
    {
      id: 'TER-PUNIA',
      name: 'Punia',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-PUNIA',
          name: 'Punia',
          code: 'ZS-PUN',
          territoryOrCityId: 'TER-PUNIA',
          healthAreas: [
            { id: 'AS-PUN-CENTRE', name: 'Punia Centre', type: 'RURALE', estimatedPopulation: 14000, latitude: -1.4800, longitude: 26.4200 }
          ]
        }
      ]
    },
    {
      id: 'TER-LUBUTU',
      name: 'Lubutu',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-LUBUTU',
          name: 'Lubutu',
          code: 'ZS-LUB',
          territoryOrCityId: 'TER-LUBUTU',
          healthAreas: [
            { id: 'AS-LUB-CENTRE', name: 'Lubutu Centre', type: 'RURALE', estimatedPopulation: 16800, latitude: -0.7300, longitude: 26.5800 }
          ]
        }
      ]
    },
    {
      id: 'TER-KIBOMBO',
      name: 'Kibombo',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-KIBOMBO',
          name: 'Kibombo',
          code: 'ZS-KIB',
          territoryOrCityId: 'TER-KIBOMBO',
          healthAreas: [
            { id: 'AS-KIB-CENTRE', name: 'Kibombo Centre', type: 'RURALE', estimatedPopulation: 12100, latitude: -3.9500, longitude: 25.9800 }
          ]
        }
      ]
    },
    {
      id: 'TER-KABAMBARE',
      name: 'Kabambare',
      type: 'TERRITOIRE',
      provinceId: 'PRV-MANIEMA',
      healthZones: [
        {
          id: 'ZS-KABAMBARE',
          name: 'Kabambare',
          code: 'ZS-KBB',
          territoryOrCityId: 'TER-KABAMBARE',
          healthAreas: [
            { id: 'AS-KBB-CENTRE', name: 'Kabambare Centre', type: 'RURALE', estimatedPopulation: 15300, latitude: -4.7000, longitude: 27.7200 }
          ]
        },
        {
          id: 'ZS-SALAMABILA',
          name: 'Salamabila',
          code: 'ZS-SLM',
          territoryOrCityId: 'TER-KABAMBARE',
          healthAreas: [
            { id: 'AS-SLM-CITÉ', name: 'Salamabila Cité', type: 'PERIURBAINE', estimatedPopulation: 28000, latitude: -4.5100, longitude: 27.8800 }
          ]
        }
      ]
    }
  ]
};

/**
 * Registre des Provinces (Structure Extensible)
 */
export const SUPPORTED_PROVINCES_REGISTRY: ProvinceInfo[] = [
  MANIEMA_PROVINCE_DATA
  // Les provinces futures (ex: Tshopo, Sud-Kivu, Sankuru, Kinshasa) pourront être enregistrées ici
  // sans modifier la logique applicative sous-jacente.
];

export const DEFAULT_TERRITORY_STRING = 'Maniema, RDC';
export const DEFAULT_PROVINCE_NAME = 'Maniema';
export const DEFAULT_COUNTRY_NAME = 'République Démocratique du Congo';
