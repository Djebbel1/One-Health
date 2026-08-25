/**
 * Types & Schémas de Données pour ONE HEALTH KINDU
 * Plateforme intégrée de collecte, gestion, contrôle et visualisation des données sanitaires, environnementales et climatiques.
 * Recherche épidémiologique et modélisation spatio-temporelle (Kindu, Maniema, RDC)
 */

// 1. Navigation Modules
export type AppModule =
  | 'DASHBOARD'
  | 'MAP'
  | 'HEALTH'
  | 'CLIMATE'
  | 'ENV'
  | 'SURVEY'
  | 'QUALITY'
  | 'MODEL_BASE'
  | 'ACCUEIL'
  | 'TABLEAU_BORD'
  | 'ENQUETES_MENAGES'
  | 'OBSERVATIONS_ENV'
  | 'DONNEES_SANITAIRES'
  | 'DONNEES_CLIMATIQUES'
  | 'CARTOGRAPHIE'
  | 'CONTROLE_QUALITE'
  | 'BASE_MODELE'
  | 'SYNCHRONISATION'
  | 'IMPORT_EXPORT'
  | 'ADMINISTRATION'
  | 'CONTROLE_HARMONISATION'
  | 'HARMONISATION';

// 2. Rôles et Utilisateurs
export type UserRole =
  | 'ADMINISTRATEUR'
  | 'SUPERVISEUR'
  | 'ENQUÊTEUR'
  | 'ENQUETEUR_TERRAIN'
  | 'AGENT DE SAISIE'
  | 'ANALYSTE'
  | 'CHERCHEUR';

export interface UserSession {
  id: string; // e.g. "USR-001"
  name: string;
  role: UserRole;
  institution: string;
  email?: string;
  assignedZone?: string;
  assignedArea?: string;
  isActive: boolean;
}

// 3. Statuts de cycle de vie des enregistrements
export type RecordStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VALIDATED'
  | 'REJECTED'
  | 'CORRECTED';

// 4. Hiérarchie géographique Kindu
export type CommuneKindu = 'Kasuku' | 'Mikelenge' | 'Alunguli';

export interface HealthZone {
  id: string; // e.g. "ZS_KINDU", "ZS_ALUNGULI"
  name: string;
  code: string;
}

export interface HealthAreaInfo {
  id: string; // e.g. "AS_MIKELENGE"
  name: string;
  zoneId: string;
  commune: CommuneKindu;
  population: number;
  latitude?: number;
  longitude?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  bounds?: [number, number][];
  healthStructures: string[];
  floodRiskLevel: 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'TRES_ELEVE';
}

export interface NeighborhoodInfo {
  id: string; // e.g. "Q_BASOKO_PORT"
  name: string;
  healthAreaId: string;
  zoneId: string;
  streets: string[]; // Dependent Avenues/Rues
}

// 5. Position GPS et Précision
export interface GpsLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  capturedAtDate: string; // YYYY-MM-DD
  capturedAtTime: string; // HH:mm:ss
  isManualOverride?: boolean;
  overrideJustification?: string;
}

// 6. Photographie scientifique associée
export interface ScientificPhoto {
  id: string;
  associatedRecordId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  latitude: number;
  longitude: number;
  accuracy?: number;
  surveyorId: string;
  caption?: string;
  dataUrl: string; // Base64 image
}

// 7. ENQUÊTE MÉNAGE (Household Survey)
export type WaterSourceCode =
  | 1 // Réseau d'eau (REGIDESO)
  | 2 // Borne-fontaine
  | 3 // Forage
  | 4 // Puits
  | 5 // Source
  | 6 // Rivière/fleuve
  | 7 // Eau de pluie
  | 8 // Vendeur d'eau
  | 9 // Autre
  | 99; // Ne sait pas

export type WaterTreatmentMethod =
  | 'AUCUN'
  | 'EBULLITION'
  | 'CHLORE_AQUATABS'
  | 'FILTRATION'
  | 'DECANTE_SOLAIRE'
  | 'AUTRE';

export type LatrineType =
  | 'CHASSE_FOSSE_SEPTIQUE'
  | 'FOSSE_VIP_AMELIOREE'
  | 'FOSSE_SIMPLE_DALLE'
  | 'FOSSE_SANS_DALLE'
  | 'AUTRE';

export type StagnantWaterLevel = 'FAIBLE' | 'MODÉRÉ' | 'IMPORTANT';

export type WasteDistance = '<10 m' | '10–50 m' | '51–100 m' | '>100 m' | 'inconnue';
export type WasteDistanceCategory = WasteDistance;

export type WastewaterDisposal = 'CANIVEAU' | 'COUR_PARCELLE' | 'RUE' | 'FOSSE_PERDUE' | 'RIVIERE_FLEUVE' | string;

export interface HouseholdSurvey {
  // Identifiant strict (Généré automatiquement e.g. "MEN-000001")
  id: string; 
  household_id?: string; // Identifiant interne anonyme MEN-XXXXXX
  status: RecordStatus; // DRAFT | SUBMITTED | UNDER_REVIEW | VALIDATED | REJECTED
  sync_status?: 'PENDING' | 'SYNCING' | 'SYNCED' | 'ERROR';
  isDemoData?: boolean;

  // Étape 1 : Localisation dépendante
  zone_id: string;
  health_area_id: string;
  neighborhood_id: string;
  street_name?: string;
  
  // Géolocalisation
  latitude: number;
  longitude: number;
  gps_accuracy: number;
  gps_date?: string;
  gps_time?: string;
  gps_justification?: string; // Justification obligatoire si gps_accuracy > 20m
  duplicate_justification?: string; // Justification si doublon potentiel accepté

  // Date et Heure
  survey_date: string; // YYYY-MM-DD
  survey_time?: string; // HH:MM:SS
  enumerator_id?: string;
  surveyor_id: string; // Compatible
  consent_obtained: boolean;

  // Étape 2 : Caractéristiques du ménage
  hh_size: number;
  children_u5: number;
  children_5_14: number;
  adults_15plus: number; // Auto: hh_size - children_u5 - children_5_14
  head_gender?: 'M' | 'F';

  // Habitat (Optionnel)
  roof_material?: string;
  wall_material?: string;
  floor_material?: string;
  parcel_cleanliness?: string;
  tall_grass_near?: boolean;

  // Étape 3 : Eau
  water_source: WaterSourceCode | string | number;
  water_source_label?: string;
  water_source_other?: string;
  water_source_details?: string;
  water_nearby?: boolean | 'OUI' | 'NON' | string; // Source dans la parcelle ou < 5 min
  water_collection_time?: number | string; // '<5 minutes' | '5–15 minutes' | '16–30 minutes' | '>30 minutes' | 'Ne sait pas'
  water_treatment?: boolean;
  water_treatment_frequency?: 'Toujours' | 'Souvent' | 'Parfois' | 'Jamais' | 'Ne sait pas' | 'TOUJOURS' | 'SOUVENT' | 'PARFOIS' | 'JAMAIS' | string;
  water_treatment_method?: WaterTreatmentMethod | string[] | string;
  water_treatment_other?: string;
  water_storage_type?: 'Récipient fermé' | 'Récipient couvert' | 'Récipient ouvert' | 'Autre' | 'Ne sait pas' | 'BIDON_FERME' | 'FUT_COUVERT' | 'SEAU_OUVERT' | 'CALEBASSE_POT' | string;
  water_container_clean?: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;

  // Étape 4 : Assainissement (conditionnel)
  latrine_available: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  latrine_type?: 'traditionnelle' | 'améliorée' | 'toilette avec chasse' | 'autre' | LatrineType | string;
  latrine_shared?: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  latrine_sharing_households?: number;
  latrine_condition?: 'Bonne' | 'Moyenne' | 'Mauvaise' | 'PROPRE_ENTRETENUE' | 'MOYENNE' | 'DEGRADEE_INONDEE' | 'PLEINE' | string;

  // Étape 5 : Eaux usées
  wastewater_disposal: "Canalisation" | "Caniveau" | "Infiltration dans le sol" | "Rejet dans la rue" | "Rejet dans un cours d'eau" | "Autre" | "Ne sait pas" | WastewaterDisposal | string;
  stagnant_water_near: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  stagnant_water_type?: string;
  stagnant_water_level?: 'Faible' | 'Modérée' | 'Importante' | StagnantWaterLevel | string;
  stagnant_water_duration?: '<1 semaine' | '1–4 semaines' | '>1 mois' | 'Inconnue' | 'TEMPORAIRE_PLUIE' | 'PERMANENT' | 'SAISONNIER' | string;

  // Étape 6 : Déchets
  waste_disposal_method: 'Collecte organisée' | 'Dépôt contrôlé' | 'Fosse' | 'Enfouissement' | 'Brûlage' | 'Dépôt sauvage' | 'Autre' | 'Ne sait pas' | 'POUBELLE_COLLECTEE' | 'FOSSE_BRULEE_ENTERREE' | 'DECHARGE_SAUVAGE_RUE' | 'JET_RIVIERE_FLEUVE' | string;
  waste_near_house?: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  waste_distance?: '<10 m' | '10–50 m' | '51–100 m' | '>100 m' | 'Inconnue' | WasteDistance;
  waste_disposal_distance?: string;

  // Étape 7 : Paludisme & Santé rétrospective
  bednet_available: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  bednet_number: number; // >= 0
  bednet_used_last_night: number; // <= hh_size
  stagnant_water_distance?: '<10 m' | '10–50 m' | '51–100 m' | '>100 m' | 'Inconnue' | 'aucune' | string;
  vegetation_dense?: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string;
  water_body_near?: 'Oui' | 'Non' | 'Ne sait pas' | boolean | string; // Fleuve ou cours d'eau proche
  history_typhoid_fever_6m?: boolean;
  history_malaria_episodes_1m?: number;

  // Étape 8 : Observations directes de l'enquêteur
  obs_stagnant_water?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_visible_waste?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_blocked_drain?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_flooding?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_dense_vegetation?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_water_body_near?: 'Oui' | 'Non' | 'Non observable' | string;
  obs_general_sanitation?: 'Oui' | 'Non' | 'Non observable' | string;

  // Legacy direct obs fields
  direct_obs_stagnant_water?: boolean;
  direct_obs_visible_waste?: boolean;
  direct_obs_clogged_gutter?: boolean;
  direct_obs_flooding_sign?: boolean;
  direct_obs_insalubrious_latrine?: boolean;
  direct_obs_dense_vegetation?: boolean;
  direct_obs_nearby_stream?: boolean;
  general_sanitation_condition?: 'BON' | 'MOYEN' | 'MAUVAIS' | 'CRITIQUE' | string;

  // Étape 9 : Photographie & Commentaires
  photo_id?: string;
  photo_ids?: string[];
  photo_url?: string;
  photo_metadata?: {
    photo_id: string;
    household_id: string;
    latitude: number;
    longitude: number;
    date: string;
    time: string;
    enumerator_id: string;
  };
  enumerator_comment?: string;
  supervisor_notes?: string;
  interviewer_notes?: string;

  // Métadonnées & Audit
  created_at?: string;
  updated_at?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// 8. OBSERVATIONS ENVIRONNEMENTALES (Environmental Observations V1.2)
export type EnvironmentalFactorType =
  | 'EAU_STAGNANTE'
  | 'DECHETS'
  | 'CANIVEAU'
  | 'EAUX_USEES'
  | 'INONDATION'
  | 'POINT_EAU'
  | 'COURS_EAU'
  | 'VEGETATION'
  | 'HABITAT_VECTEURS'
  | 'AUTRE'
  // Compatibilité rétroactive:
  | 'DECHETS_VISIBLES'
  | 'CANIVEAU_OBSTRUE'
  | 'LATRINE'
  | 'VEGETATION_DENSE'
  | 'COURS_D_EAU_PROCHE'
  | 'POINT_EAU_NON_PROTEGE'
  | 'AUTRE_FACTEUR'
  | 'CONDITIONS_GENERALES_ASSAINISSEMENT';

export type HistoricalStatus =
  | 'CURRENT'
  | 'HISTORICAL_DOCUMENTED'
  | 'HISTORICAL_REPORTED_UNVERIFIED'
  | 'UNKNOWN';

export type HistoricalSource =
  | 'Observation directe'
  | 'Ménage'
  | 'Chef local'
  | 'Agent de santé'
  | 'Document'
  | 'Photo ancienne'
  | 'Rapport'
  | 'Autre';

export type ValidityPeriodType = 'TEMPORAIRE' | 'SAISONNIER' | 'PERMANENT' | 'TEMPORAIRE_SAISONNIER';

export interface EnvironmentalPhoto {
  photo_id: string; // e.g. "PHT-ENV-000001-01"
  observation_id: string;
  file_reference?: string;
  dataUrl?: string; // base64 or URL
  latitude: number;
  longitude: number;
  photo_date: string; // YYYY-MM-DD
  photo_time: string; // HH:mm:ss
  user_id: string;
  caption?: string;
}

export interface EnvironmentalObservation {
  id: string; // e.g. "ENV-000001"
  observation_id?: string;
  household_id?: string; // Facultatif : association à un ménage existant
  calculated_household_distance_m?: number; // Calcul automatique non modifiable en mètres
  status: RecordStatus;
  sync_status?: 'PENDING' | 'SYNCING' | 'SYNCED' | 'ERROR';
  isDemoData?: boolean;

  // Localisation
  zone_id: string;
  health_area_id: string;
  neighborhood_id: string;
  street_name?: string;

  // Géolocalisation & Contrôle GPS
  latitude: number;
  longitude: number;
  gps_accuracy: number;
  gps_status?: 'VALID' | 'WARNING' | 'NO_GPS';
  gps_justification?: string;
  gps_date?: string;
  gps_time?: string;
  gps_user?: string;

  // Type & Facteur principal
  factor_type: EnvironmentalFactorType;
  presence?: 'Oui' | 'Non' | boolean | string;
  extent?: 'Très petite' | 'Petite' | 'Moyenne' | 'Grande' | string;
  severity?: string;

  // Détails par type
  // 1. Eau stagnante
  stagnant_extent?: string;
  stagnant_duration?: '< 3 jours' | '3–7 jours' | '1–4 semaines' | '> 1 mois' | 'Inconnue' | string;
  stagnant_origin?: 'Pluie' | 'Fuite d\'eau' | 'Caniveau' | 'Inondation' | 'Autre' | 'Inconnue' | string;
  housing_proximity?: '< 10 m' | '10–50 m' | '50–100 m' | '> 100 m' | string;

  // 2. Déchets
  waste_presence?: 'Oui' | 'Non' | boolean | string;
  waste_extent?: 'Très petite' | 'Petite' | 'Moyenne' | 'Grande' | string;
  waste_housing_distance?: '< 10 m' | '10–50 m' | '50–100 m' | '> 100 m' | string;
  waste_type?: 'Déchets ménagers' | 'Déchets organiques' | 'Déchets plastiques' | 'Déchets médicaux' | 'Déchets mélangés' | 'Autre' | 'Inconnu' | string;
  waste_estimated_age?: '< 1 semaine' | '1–4 semaines' | '1–6 mois' | '> 6 mois' | 'Inconnue' | string;

  // 3. Caniveau
  gutter_condition?: 'Bon' | 'Partiellement obstrué' | 'Fortement obstrué' | 'Détruit' | 'Absent' | string;
  gutter_water_present?: 'Oui' | 'Non' | 'Inconnu' | string;

  // 4. Eaux usées
  wastewater_flow_type?: 'Stagnant' | 'Écoulement continu' | 'Écoulement intermittent' | string;
  wastewater_source?: 'Domestique' | 'Artisanale/Commerciale' | 'Autre' | string;

  // 5. Inondation
  is_current_flood?: 'Oui' | 'Non' | boolean | string;
  flood_depth?: '< 20 cm' | '20–50 cm' | '> 50 cm' | string;
  flood_duration?: '< 3 jours' | '3–7 jours' | '1–4 semaines' | '> 1 mois' | 'Inconnue' | string;
  is_historical_flood?: boolean | string;

  // 6. Point d'eau
  water_point_type?: 'Forage' | 'Puits' | 'Source' | 'Borne-fontaine' | 'Réseau' | 'Rivière' | 'Fleuve' | 'Autre' | string;
  water_point_usage?: string;
  water_point_accessibility?: string;
  water_point_condition?: string;
  water_point_protection?: string;
  microbiological_quality?: 'NON_ANALYSEE' | string;

  // 7. Cours d'eau
  watercourse_name?: string;
  watercourse_bank_condition?: string;
  watercourse_speed?: string;

  // 8. Végétation
  vegetation_density?: 'Faible' | 'Moyenne' | 'Dense' | 'Très dense' | string;
  vegetation_type?: string;
  vegetation_proximity?: '< 10 m' | '10–50 m' | '50–100 m' | '> 100 m' | string;

  // 9. Habitat vecteurs
  vector_habitat_type?: string;
  larval_presence?: boolean | string;
  larval_density?: 'FAIBLE' | 'MOYENNE' | 'FORTE' | 'NULLE' | 'Faible' | 'Moyenne' | 'Forte' | string;
  water_turbidity?: 'CLAIRE' | 'TROUBLE' | 'STAGNANTE_ORGANIQUE' | 'TRES_POLLUEE' | string;
  sun_exposure?: 'ENSOLEILLE' | 'OMBRE_PARTIELLE' | 'OMBRE_TOTALE' | 'SOLEIL' | string;

  // 10. Autre
  other_factor_label?: string;

  // Descriptions & Commentaires
  description: string; // Factual descriptive
  enumerator_comment?: string; // Notes de l'enquêteur

  // DIMENSION TEMPORELLE (RÈGLE SCIENTIFIQUE FONDAMENTALE)
  observation_date: string; // YYYY-MM-DD
  observation_time?: string; // HH:mm:ss
  historical_status: HistoricalStatus; // CURRENT | HISTORICAL_DOCUMENTED | HISTORICAL_REPORTED_UNVERIFIED | UNKNOWN
  validity_start?: string; // YYYY-MM-DD
  validity_end?: string; // YYYY-MM-DD
  validity_period_type?: ValidityPeriodType;
  historical_source?: HistoricalSource | string;

  // Photographies & Métadonnées
  photo_url?: string;
  photos?: EnvironmentalPhoto[];
  photo_ids?: string[];

  // Traçabilité & Audit
  surveyor_id: string;
  enumerator_id?: string;
  supervisor_notes?: string;
  rejection_reason?: string;
  rejected_by?: string;
  rejected_at?: string;

  createdAt: string;
  updatedAt: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// 9. DONNÉES SANITAIRES (Health Records & Facilities - Module V1.3)
export type DiseaseType = 'PALUDISME' | 'FIEVRE_TYPHOIDE' | string;
export type DiagnosticStatus = 'CONFIRMED' | 'PROBABLE' | 'SUSPECT' | 'UNKNOWN';

export type HealthFacilityType =
  | 'Hôpital'
  | 'Centre de santé'
  | 'Poste de santé'
  | 'HGR'
  | 'CENTRE_SANTE'
  | 'POSTE_SANTE'
  | 'CLINIQUE'
  | 'CABINET_MEDICAL'
  | 'Autre'
  | string;
export type HealthFacilityStatus = 'ACTIF' | 'INACTIF';

export interface HealthFacility {
  facility_id: string; // e.g. "FAC_HGR_KINDU", "FAC_CS_MIKELENGE"
  facility_name: string;
  facility_type: HealthFacilityType;
  zone_id: string;
  health_area_id: string;
  latitude: number;
  longitude: number;
  address?: string;
  contact_person?: string;
  status: HealthFacilityStatus;
}

export type DataSourceType =
  | 'REGISTRE_STRUCTURE_SANTE'
  | 'REGISTRE_CENTRE_SANTE'
  | 'RAPPORT_MENSUEL'
  | 'RAPPORT_HEBDOMADAIRE'
  | 'BASE_EXISTANTE'
  | 'IMPORT_EXCEL'
  | 'IMPORT_CSV'
  | 'DHIS2_SURVEILLANCE'
  | 'ENQUETE_ACTIVE'
  | 'HOSPITALISATION'
  | 'AUTRE';

export type PeriodType = 'JOUR' | 'SEMAINE' | 'MOIS' | 'TRIMESTRE' | 'ANNÉE' | 'AUTRE';

export type CaseClassification = 'SUSPECT' | 'PROBABLE' | 'CONFIRME' | 'INCONNU';

export type DiagnosticMethod =
  // Paludisme
  | 'TDR'
  | 'MICROSCOPIE'
  | 'DIAGNOSTIC_CLINIQUE'
  // Fièvre Typhoïde
  | 'TEST_LABORATOIRE'
  // Standard/Unknown
  | 'AUTRE'
  | 'INCONNU';

export type AgeGroup =
  | '<5 ANS'
  | '5–14 ANS'
  | '15–24 ANS'
  | '25–44 ANS'
  | '45–64 ANS'
  | '65 ANS ET PLUS'
  | 'INCONNU'
  | 'TOUS ÂGES';

export type SexCategory = 'MASCULIN' | 'FEMININ' | 'INCONNU' | 'TOTAL';

export type DataQualityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type HealthRecordStatus =
  | 'DRAFT'
  | 'IMPORTED'
  | 'UNDER_REVIEW'
  | 'VALIDATED'
  | 'REJECTED'
  | 'CORRECTED';

export interface HealthRecordCorrection {
  id: string;
  record_id: string;
  field_name: string;
  original_value: string | number | null;
  corrected_value: string | number | null;
  correction_reason: string;
  corrected_by: string;
  corrected_at: string;
}

export interface HealthRecord {
  id: string; // e.g. "SAN-000001"
  health_record_id: string; // Identifier
  
  // Structure sanitaire
  facility_id?: string;
  facility_name?: string;
  structure_name: string; // compatibility
  
  // Géographie
  zone_id: string;
  health_area_id: string;
  neighborhood_id?: string;
  
  // Période (Temporelle)
  record_date?: string; // YYYY-MM-DD
  date: string; // compatibility (e.g. YYYY-MM-DD or YYYY-MM-15)
  year: number;
  month: number;
  week?: number;
  period_type?: PeriodType;
  
  // Maladie & Diagnostic
  disease: DiseaseType;
  case_classification?: CaseClassification;
  diagnostic_status: DiagnosticStatus;
  diagnostic_method?: DiagnosticMethod;
  
  // Démographie
  age_group?: AgeGroup;
  sex_category?: SexCategory;
  
  // Cas, Hospitalisations, Décès
  cases: number; // >= 0
  hospitalizations: number | 'UNKNOWN'; // <= cases or 'UNKNOWN'
  deaths: number | 'UNKNOWN'; // <= cases or 'UNKNOWN'
  
  // Source
  data_source_type?: DataSourceType;
  data_source: string; // compatibility
  source_name?: string;
  source_reference?: string;
  source_period?: string;
  
  // Qualité
  data_quality?: DataQualityLevel;
  quality_reason?: string;
  
  // Statut & Audit
  status: RecordStatus;
  isDemoData?: boolean;
  notes?: string;
  comments?: string;
  registered_by?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  createdAt: string;
  updatedAt: string;
  
  // Doublons & Corrections
  isPotentialDuplicate?: boolean;
  duplicateFlagReason?: string;
  duplicateResolved?: boolean;
  duplicateActionTaken?: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED';
  corrections?: HealthRecordCorrection[];
  
  [key: string]: any;
}

// 10. DONNÉES CLIMATIQUES (Climate Records V1.4)
export type ClimatePeriodType = 'JOUR' | 'SEMAINE' | 'MOIS' | 'SAISON' | 'ANNEE';
export type SpatialResolution = 'STATION' | 'POINT' | 'ZONE' | 'GRID' | 'VILLE' | 'AUTRE';
export type ClimateSourceType =
  | 'STATION_METEOROLOGIQUE'
  | 'SERVICE_METEOROLOGIQUE'
  | 'BASE_SATELLITAIRE'
  | 'BASE_CLIMATIQUE'
  | 'IMPORT_EXCEL'
  | 'IMPORT_CSV'
  | 'RAPPORT'
  | 'AUTRE';

export type ClimateDataQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN' | 'VERIFIEE_METTELSAT' | 'BRUTE_STATION' | 'ESTIMATION_SATELLITE' | 'RECONSTITUEE';

export type ClimateStationType =
  | 'SYNOPTIQUE'
  | 'AGROMETEOROLOGIQUE'
  | 'PLUVIOMETRIQUE_MANUELLE'
  | 'STATION_AUTOMATIQUE'
  | 'METEOROLOGIE_NATIONALE_METELSAT'
  | 'STATION_METEO_LOCALE'
  | 'SATELLITE_CHIRPS'
  | 'SATELLITE_ERA5'
  | 'CAPTEUR_AUTOMATIQUE';

export interface ClimateStation {
  station_id: string; // e.g. "ST-FZOA-01"
  station_name: string;
  station_type?: ClimateStationType;
  latitude: number;
  longitude: number;
  altitude?: number | null;
  operator: string;
  source?: string;
  status: 'ACTIF' | 'INACTIF' | 'HISTORIQUE' | 'OCCASIONNEL';
  health_zone_id?: string;
  health_area_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClimateSource {
  source_id: string; // e.g. "SRC-METTELSAT-FZOA"
  source_name: string;
  source_type: ClimateSourceType;
  provider: string;
  reference?: string;
  url?: string;
  resolution?: string;
  spatial_resolution?: string;
  temporal_resolution?: string;
  coverage_period?: string;
  variables_provided?: string[];
  contact?: string;
  description?: string;
}

export interface ClimateRecordCorrection {
  id: string;
  fieldName: string;
  originalValue: any;
  correctedValue: any;
  reason: string;
  correctedBy: string;
  correctedAt: string;
}

export interface ClimateRecord {
  id: string; // e.g. "CLI-000001"
  climate_id: string; // e.g. "CLI-000001"

  // Période & Résolution Temporelle
  record_date?: string | null; // YYYY-MM-DD (null for monthly/seasonal/annual without day)
  year: number;
  month?: number | null; // 1-12
  week?: number | null; // 1-53
  period_type: PeriodType;

  // Localisation & Résolution Spatiale
  station_id?: string | null;
  location_id?: string | null; // e.g. "STATION_FZOA_AEROPORT_KINDU"
  location_name: string;
  latitude?: number | null;
  longitude?: number | null;
  spatial_resolution: SpatialResolution;
  health_zone_id?: string | null;
  health_area_id?: string | null;

  // Variables Climat (NULL = Non disponible, 0 = Pluie réelle de 0mm)
  temperature_mean?: number | null; // °C
  temperature_min?: number | null; // °C
  temperature_max?: number | null; // °C
  rainfall_mm?: number | null; // mm (>= 0)
  humidity_percent?: number | null; // 0 - 100%

  // Alias compatibility
  temp_mean_c?: number | null;
  temp_min_c?: number | null;
  temp_max_c?: number | null;
  humidity_pct?: number | null;
  date?: string; // fallback alias

  // Variables complémentaires futures (extensibilité V1.4)
  wind_speed_kmh?: number | null;
  atmospheric_pressure_hpa?: number | null;
  solar_radiation_wm2?: number | null;
  evapotranspiration_mm?: number | null;
  climate_index?: string | null;
  river_level_m?: number | null;
  flooding_observed?: boolean | null;

  // Station info
  station_name?: string;
  station_type?: ClimateStationType;

  // Source
  source_type: ClimateSourceType;
  source_name: string;
  source_reference?: string | null;
  source_url?: string | null;
  source_period?: string | null;
  source_resolution?: string | null;
  source?: string; // alias
  data_source?: string; // alias

  // Qualité des données
  data_quality: ClimateDataQuality;
  quality_reason?: string | null;
  validation_errors?: string[];

  // Gestion des doublons
  isPotentialDuplicate?: boolean;
  duplicateFlagReason?: string;
  duplicateResolved?: boolean;
  duplicateActionTaken?: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED';

  // Audit & Traçabilité
  corrections?: ClimateRecordCorrection[];
  comments?: string | null;
  notes?: string; // alias
  status: RecordStatus; // 'DRAFT' | 'IMPORTED' | 'UNDER_REVIEW' | 'VALIDATED' | 'REJECTED' | 'CORRECTED'
  is_demo?: boolean; // DEMO_DATA = TRUE clearly flagged
  isDemoData?: boolean; // alias

  created_by?: string;
  recorded_by?: string; // alias
  created_at: string;
  createdAt?: string; // alias
  updated_by?: string;
  updated_at: string;
  updatedAt?: string; // alias

  [key: string]: any;
}

// 11. CONTRÔLE QUALITÉ (Quality Control)
export type QualitySeverity = 'CRITIQUE' | 'AVERTISSEMENT' | 'INFO' | 'ERROR' | 'WARNING';
export type QualityCategory =
  | 'DONNEE_MANQUANTE'
  | 'VALEUR_IMPOSSIBLE'
  | 'INCOHERENCE'
  | 'DOUBLON'
  | 'GPS_INCORRECT'
  | 'HISTORIQUE_EXTRAPOLATION_INTERDITE'
  | 'NON_SYNCHRONISE';

export interface QualityIssue {
  id: string;
  module: 'MENAGE' | 'ENVIRONNEMENT' | 'SANITAIRE' | 'CLIMATIQUE' | 'HOUSEHOLD' | 'ENVIRONMENT' | 'HEALTH' | 'CLIMATE';
  recordId: string;
  recordIdentifier: string; // e.g. "MEN-000001"
  severity: QualitySeverity;
  category: QualityCategory;
  title: string;
  description: string;
  detectedAt: string;
  status: 'A_CORRIGER' | 'IGNORE' | 'RESOLU';
  suggestedAction?: string;
  ruleId?: string;
  currentValue?: string;
  expectedValue?: string;
  recommendation?: string;
}

export type AuditIssue = QualityIssue;

// 12. FILE DE SYNCHRONISATION (Sync Queue)
export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncEntity = 'HOUSEHOLD' | 'ENVIRONMENTAL' | 'HEALTH' | 'CLIMATE' | 'PHOTO';

export interface SyncQueueItem {
  id: string;
  entity: SyncEntity;
  operation: SyncOperation;
  localId: string;
  recordIdentifier: string;
  payload: any;
  timestamp: string;
  retryCount: number;
  lastError?: string;
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'ERROR';
}

// 13. JOURNAL D'AUDIT (Audit Logs)
export interface AuditLog {
  id: string;
  entityType: 'HOUSEHOLD' | 'ENVIRONMENTAL' | 'HEALTH' | 'CLIMATE' | 'USER' | 'ZONE';
  recordId: string;
  recordIdentifier: string;
  action: 'CREATE' | 'UPDATE' | 'VALIDATE' | 'REJECT' | 'DELETE' | 'EXPORT';
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  fieldName?: string;
  oldValue?: string | number | boolean | null;
  newValue?: string | number | boolean | null;
  reason?: string;
}

// 14. MATRICE SPATIO-TEMPORELLE (Base Modèle compilée AS x Année x Mois)
export interface ModelMatrixRow {
  id: string; // AS_CODE_YYYY_MM
  health_area_id: string;
  health_area_name: string;
  zone_name: string;
  commune: CommuneKindu;
  year: number;
  month: number;
  month_label: string;
  population: number;

  // Données sanitaires agrégées
  malaria_cases: number;
  malaria_incidence_per_1000: number;
  malaria_hospitalizations: number;
  malaria_deaths: number;

  typhoid_cases: number;
  typhoid_incidence_per_1000: number;
  typhoid_hospitalizations: number;
  typhoid_deaths: number;

  // Données climatiques
  rainfall_mm: number;
  temp_mean: number;
  temp_min: number;
  temp_max: number;
  humidity_percent: number;
  temp_mean_c?: number;
  temp_min_c?: number;
  temp_max_c?: number;
  humidity_pct?: number;

  // Lags spatio-temporels (mois M-1)
  rainfall_lag1_mm: number;
  temp_lag1_mean: number;

  // Facteurs environnementaux vérifiés (strictement valides sur le mois M)
  valid_stagnant_water_obs: number;
  valid_waste_obs: number;
  valid_clogged_gutters: number;
  active_breeding_sites_count?: number;
  flood_presence?: boolean;

  // Indicateurs descriptifs ménages
  surveyed_households_count: number;
  pct_water_improved: number; // Proportion source améliorée
  pct_latrine_improved: number; // Proportion latrine hygiénique
  pct_bednet_usage: number; // Proportion utilisation MILD
  pct_exposed_stagnant_water: number; // Proportion exposée eau stagnante
  bednet_coverage_rate?: number;
  protected_water_access_rate?: number;

  // Score de complétude
  data_completeness_pct: number;
}

// ==========================================
// 15. TYPES V1.5 : CONTRÔLE & HARMONISATION
// ==========================================

// 15.1. Score de Qualité Documentaire (0 - 100)
export type QualityScoreCategory =
  | 'EXCELLENTE'   // 90–100
  | 'BONNE'        // 75–89
  | 'MOYENNE'      // 50–74
  | 'FAIBLE'       // 25–49
  | 'TRES_FAIBLE'; // 0–24

export interface QualityScoreDetails {
  total_score: number; // 0 à 100
  source_score: number; // +20
  period_score: number; // +20
  location_score: number; // +20
  variables_score: number; // +20
  consistency_score: number; // +20
  category: QualityScoreCategory;
  breakdown_notes: string[];
}

// 15.2. Classification des Données Manquantes
export type MissingDataReason =
  | 'NON_COLLECTE'
  | 'NON_DISPONIBLE'
  | 'NON_RENSEIGNE'
  | 'SOURCE_INCOMPLETE'
  | 'ERREUR_IMPORTATION'
  | 'INCONNU'
  | 'AUTRE';

export interface MissingDataAnalysisRow {
  table: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE';
  variable_name: string;
  total_records: number;
  missing_count: number;
  missing_pct: number;
  affected_periods: string[];
  affected_locations: string[];
  primary_reason?: MissingDataReason;
}

// 15.3. Détection et Gestion des Doublons
export type DuplicateStatus =
  | 'DOUBLON_CERTAIN'
  | 'DOUBLON_POTENTIEL'
  | 'NON_DOUBLON';

export type DuplicateResolutionAction =
  | 'CONSERVER'
  | 'FUSIONNER'
  | 'IGNORER'
  | 'MARQUER_DOUBLON';

export interface DuplicateCandidate<T = any> {
  id: string;
  table: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE';
  duplicate_status: DuplicateStatus;
  logical_key: string;
  records: T[];
  differences: string[];
  confidence_score: number; // 0 - 100%
  resolution_action?: DuplicateResolutionAction;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

// 15.4. Harmonisation Géographique & Unités Spatiales
export type GeographicUnitType =
  | 'PROVINCE'
  | 'VILLE'
  | 'ZONE_DE_SANTE'
  | 'AIRE_DE_SANTE'
  | 'QUARTIER'
  | 'AVENUE'
  | 'SITE_POINT';

export interface GeographicUnit {
  geo_id: string; // e.g. "PROV-MNM", "CITY-KND", "ZS-001", "AS-001", "Q-001", "AV-001", "SITE-001"
  geo_type: GeographicUnitType;
  geo_name: string;
  parent_geo_id: string | null;
  latitude?: number;
  longitude?: number;
  geometry?: string; // GeoJSON string or polygon bounding box
  source: string;
  status: 'ACTIF' | 'HISTORIQUE' | 'OBSOLETE';
  population?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GeographicAlias {
  alias_id: string;
  geo_id: string;
  alias_name: string;
  source: string;
  notes?: string;
}

// 15.5. Résolutions Spatiales & Temporelles
export type SpatialResolutionLevel =
  | 'PATIENT'
  | 'MENAGE'
  | 'SITE'
  | 'AVENUE'
  | 'QUARTIER'
  | 'AIRE_DE_SANTE'
  | 'ZONE_DE_SANTE'
  | 'VILLE'
  | 'STATION'
  | 'GRID'
  | 'AUTRE';

export type TemporalResolutionLevel =
  | 'JOUR'
  | 'SEMAINE'
  | 'MOIS'
  | 'TRIMESTRE'
  | 'SAISON'
  | 'ANNEE';

export type DataCompatibilityStatus =
  | 'COMPATIBLE'
  | 'PARTIELLEMENT_COMPATIBLE'
  | 'INCOMPATIBLE'
  | 'NON_DETERMINE';

// 15.6. Périodes d'Analyse & Saisons Configurables
export interface AnalysisPeriod {
  period_id: string; // e.g. "PER-2024-M03"
  year: number;
  month?: number;
  quarter?: number;
  season?: string;
  period_type: TemporalResolutionLevel;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  label: string;
}

export interface SeasonConfig {
  season_id: string;
  season_name: string;
  start_month: number; // 1 to 12
  end_month: number;   // 1 to 12
  description: string;
  source: string;
  status: 'ACTIF' | 'PROPOSITION' | 'ARCHIVE';
}

// 15.7. Relations Multi-Domaines (Links)
export interface HealthEnvironmentLink {
  link_id: string;
  health_area_id: string;
  neighborhood_id?: string;
  period_id: string;
  health_record_reference: string;
  environment_record_reference: string;
  link_quality: 'EXCELLENT' | 'BON' | 'APPROXIMATIF' | 'INCERTAIN';
  notes: string;
}

export interface HealthClimateLink {
  link_id: string;
  health_area_id: string;
  period_id: string;
  health_record_reference: string;
  climate_record_reference: string;
  temporal_lag: 0 | 1 | 2 | 3; // Lag en mois (0, 1, 2, 3)
  link_quality: 'EXCELLENT' | 'BON' | 'APPROXIMATIF' | 'INCERTAIN';
  notes: string;
}

export interface ClimateEnvironmentLink {
  link_id: string;
  location_id: string;
  period_id: string;
  climate_reference: string;
  environment_reference: string;
  link_quality: 'EXCELLENT' | 'BON' | 'APPROXIMATIF' | 'INCERTAIN';
  notes: string;
}

// 15.8. Base Intégrée (Vue Spatio-Temporelle Préparatoire)
export interface IntegratedDatasetRow {
  id: string; // e.g. "INT-AS_KASUKU-2024-03"
  geo_id: string;
  geo_name: string;
  geo_type: SpatialResolutionLevel;
  year: number;
  month: number;
  period_id: string;

  // Sanitaire (null si absent)
  paludisme_cases: number | null;
  typhoid_cases: number | null;

  // Climat (null si absent)
  temperature_mean: number | null;
  temperature_min: number | null;
  temperature_max: number | null;
  rainfall_mm: number | null;
  humidity_percent: number | null;

  // Scores Environnement / Ménages (null si non observé)
  water_access_score: number | null;
  sanitation_score: number | null;
  environment_score: number | null;

  // Présences environnementales
  flooding: boolean | null;
  stagnant_water: boolean | null;
  waste_presence: boolean | null;

  // Démographie
  population_estimate: number | null;

  // Métadonnées de Traçabilité
  data_quality: QualityScoreCategory;
  spatial_scale_warning?: string;
  temporal_scale_warning?: string;
}

// 15.9. Traçabilité des Corrections & Audit
export interface DataCorrectionLog {
  correction_id: string;
  table_name: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE' | 'GEOGRAPHIE' | 'SAISON';
  record_id: string;
  field_name: string;
  old_value: any;
  new_value: any;
  reason: string;
  corrected_by: string;
  corrected_at: string;
  record_version?: number;
}

// 15.10. Dictionnaire Global des Données
export interface GlobalDataDictionaryItem {
  variable_name: string;
  table: string;
  description: string;
  type: string;
  unit?: string;
  allowed_values?: string;
  source: string;
  spatial_resolution: SpatialResolutionLevel;
  temporal_resolution: TemporalResolutionLevel;
  missing_allowed: boolean;
  notes?: string;
}

// 15.11. Indicateur et Rapport de Préparation (Readiness Score)
export interface ReadinessScoreReport {
  total_score: number; // 0 à 100
  data_presence_score: number; // 0 - 25
  temporal_harmonization_score: number; // 0 - 20
  spatial_harmonization_score: number; // 0 - 20
  quality_controlled_score: number; // 0 - 20
  cross_linkable_score: number; // 0 - 15
  status: 'PRET' | 'PARTIELLEMENT_PRET' | 'NON_PRET';
  summary: string;
  details: {
    period_coverage: string;
    zones_covered: string[];
    health_count: number;
    climate_count: number;
    env_count: number;
    household_count: number;
    missing_rate_overall: number;
    duplicates_count: number;
    inconsistencies_count: number;
    spatial_incompatibilities: string[];
    temporal_incompatibilities: string[];
    sources_used: string[];
    overall_quality_avg: number;
  };
}

