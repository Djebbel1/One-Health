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
  | 'BASE_SPATIO_TEMPORELLE'
  | 'QUALITE_DONNEES'
  | 'DATA_QUALITY_V18'
  | 'SPATIOTEMPORAL_EXPLORATION_V19'
  | 'ANALYSE_SPATIO_TEMPORELLE'
  | 'EXPLORATION_SPATIO_TEMPORELLE'
  | 'SPATIO_TEMPORAL_EXPLORATION'
  | 'MANIEMA_MULTI_PATHOLOGY_V110'
  | 'GESTION_MANIEMA_PATHOLOGIES'
  | 'ONE_HEALTH_PLATFORM'
  | 'ENQUETES_OPERATIONNELLES_V111'
  | 'SUPERVISION_TERRAIN_V111'
  | 'SURVEY_OPERATIONS'
  | 'SOURCES_ET_IMPORTS_V112'
  | 'SOURCES_IMPORTS'
  | 'INTEGRATION_MULTI_SOURCES'
  | 'DIAGNOSTIC_SCIENTIFIQUE_V113'
  | 'DIAGNOSTIC_DONNEES'
  | 'DIAGNOSTIC_SCIENTIFIQUE'
  | 'LABORATOIRE_ANALYSE'
  | 'LABORATOIRE_ANALYSE_V114'
  | 'LAB_ANALYSE'
  | 'MODELISATION'
  | 'MODELISATION_STATISTIQUE'
  | 'MODELISATION_V115'
  | 'STATISTICAL_MODELING'
  | 'VALIDATION_SCIENTIFIQUE'
  | 'VALIDATION_SCIENTIFIQUE_V116'
  | 'SCIENTIFIC_VALIDATION'
  | 'SURVEILLANCE'
  | 'SURVEILLANCE_ONE_HEALTH'
  | 'SURVEILLANCE_ONE_HEALTH_V117'
  | 'SURVEILLANCE_V117'
  | 'SURVEILLANCE_MODULE'
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
  | 'SANITAIRE'
  | 'ENVIRONNEMENTALE'
  | 'CLIMATIQUE'
  | 'GEOGRAPHIQUE'
  | 'COMMUNAUTAIRE'
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

export type OneHealthDimension =
  | 'SANTE'
  | 'SANTE_HUMAINE'
  | 'SANTE_ANIMALE'
  | 'CLIMAT'
  | 'ENVIRONNEMENT'
  | 'WASH'
  | 'COMMUNAUTAIRE'
  | 'SOCIO_DEMOGRAPHIQUE'
  | 'GEOGRAPHIE'
  | 'DEMOGRAPHIE'
  | 'LABORATOIRE'
  | 'AUTRE';

export type DataFrequencyType = FrequencyType;
export type FileSourceFormat = FileFormatType;

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
export type QualitySeverity =
  | 'CRITIQUE'
  | 'AVERTISSEMENT'
  | 'INFO'
  | 'ERROR'
  | 'WARNING'
  | 'ERREUR'
  | 'INFORMATION';
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

// ============================================================================
// 16. TYPES V1.6 : CARTOGRAPHIE INTÉGRÉE SPATIO-TEMPORELLE
// ============================================================================

// 16.1. Identifiants des 8 Couches Principales
export type CartoLayerId =
  | 'LAYER_01_MENAGES'
  | 'LAYER_02_ENVIRONNEMENT'
  | 'LAYER_03_SANTE'
  | 'LAYER_04_CLIMAT'
  | 'LAYER_05_EAU'
  | 'LAYER_06_INONDATION'
  | 'LAYER_07_INFRASTRUCTURES_SANITAIRES'
  | 'LAYER_08_LIMITES_ADMINISTRATIVES';

export interface CartoLayerConfig {
  id: CartoLayerId;
  label: string;
  shortLabel: string;
  description: string;
  visible: boolean;
  opacity: number; // 0.0 to 1.0 (e.g. 0.5 = 50%)
  color: string;
  iconName: string;
  source: string;
  spatialResolution: SpatialResolutionLevel;
  temporalResolution: TemporalResolutionLevel;
  category: 'SANTE' | 'ENVIRONNEMENT' | 'CLIMAT' | 'MENAGES' | 'INFRASTRUCTURE';
  count?: number;
}

// 16.2. Sous-menus Cartographiques
export type CartoSubMenu =
  | 'VUE_GENERALE'
  | 'CARTE_SANTE'
  | 'CARTE_ENV'
  | 'CARTE_CLIMAT'
  | 'CARTE_MENAGES'
  | 'CARTE_INTEGREE'
  | 'ANALYSE_TEMPORELLE'
  | 'COMPARAISON_PERIODES'
  | 'COUCHES'
  | 'LEGENDE'
  | 'PROFIL_ZONE'
  | 'EXPORT_CARTO'
  | 'METHODOLOGIE'
  | 'LIMITES_DONNEES'
  | 'TESTS_VALIDATION';

// 16.3. Filtre Maladie
export type CartoDiseaseFilter = 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'LES_DEUX';

// 16.4. Type de visualisation Sanitaire
export type HealthVizType =
  | 'STRUCTURE_POINTS'
  | 'PROPORTIONAL_CIRCLES'
  | 'HEALTH_AREA_AGGREGATION'
  | 'HEALTH_ZONE_AGGREGATION'
  | 'CHOROPLETH'
  | 'DENSITY_HEATMAP';

// 16.5. Source d'eau spécifique cartographiée
export interface WaterPointItem {
  id: string; // e.g. "EAU-001"
  name: string;
  type: 'SOURCE' | 'PUITS' | 'FORAGE' | 'BORNE_FONTAINE' | 'RESEAU' | 'RIVIERE' | 'AUTRE';
  type_label: string;
  health_area_id: string;
  neighborhood_id?: string;
  latitude: number;
  longitude: number;
  observation_date: string;
  status: 'FONCTIONNEL' | 'DEGRADE' | 'ABANDONNE' | 'NON_PROTEGE' | 'PROTEGE';
  quality_info: QualityScoreCategory | string;
  source_data: string;
  is_protected: boolean;
  users_estimate?: number;
  notes?: string;
}

// 16.6. Donnée Inondation cartographiée
export interface FloodAreaItem {
  id: string;
  name: string;
  type: 'INONDATION_OBSERVEE' | 'ZONE_POTENTIELLEMENT_INONDABLE';
  health_area_id: string;
  neighborhood_id?: string;
  latitude: number;
  longitude: number;
  radius_meters?: number;
  observation_date?: string;
  water_level_cm?: number;
  duration_label?: string;
  proximity_stream?: string;
  source: string;
  notes?: string;
}

// 16.7. Mesure de distance géographique
export interface DistanceMeasurement {
  pointA: { lat: number; lng: number; label?: string } | null;
  pointB: { lat: number; lng: number; label?: string } | null;
  distanceMeters: number | null;
  distanceKm: number | null;
  isActive: boolean;
}

// 16.8. Changement environnemental / Comparaison
export type EnvironmentalChangeType =
  | 'NOUVEAU_FACTEUR'
  | 'FACTEUR_DISPARU'
  | 'FACTEUR_MAINTENU'
  | 'FACTEUR_MODIFIE';

export interface EnvironmentalChangeItem {
  site_id: string;
  site_name: string;
  latitude: number;
  longitude: number;
  health_area_id: string;
  factor_type: string;
  periodA_state: string;
  periodB_state: string;
  change_type: EnvironmentalChangeType;
  change_label: string;
  notes: string;
}

// 16.9. Test Cartographique Unitaire
export interface CartoValidationTest {
  id: number;
  title: string;
  description: string;
  category: 'AFFICHAGE' | 'FILTRAGE' | 'HISTORIQUE' | 'RESOLUTION' | 'DONNEES_MANQUANTES' | 'CONFIDENTIALITE' | 'PERFORMANCE';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  resultDetails: string;
  isCritical?: boolean;
}

// ============================================================================
// 17. MODULE V1.7 — BASE DE DONNÉES SPATIO-TEMPORELLE INTÉGRÉE
// ============================================================================

// 17.1. Table Centrale : SPATIOTEMPORAL_UNIT
export interface SpatiotemporalUnit {
  id: string; // e.g. "KINDU01-2025-01" or "AS_MIKELENGE-2025-01"
  zone_sante_id: string; // e.g. "ZS_KINDU"
  aire_sante_id: string; // e.g. "AS_MIKELENGE"
  quartier_id?: string;
  annee: number; // e.g. 2025
  mois: number; // 1 to 12
  date_debut: string; // YYYY-MM-01
  date_fin: string; // YYYY-MM-DD
  population: number; // e.g. 24500
  population_source: string; // e.g. "DPS Maniema / Recensement Sanitaire 2024"
  data_completeness: number; // 0 to 100 (%)
  created_at: string;
  updated_at: string;
}

// 17.2. Table Sanitaire : HEALTH_SPATIOTEMPORAL
export type DiseaseCode = 'MALARIA' | 'TYPHOID';
export type CaseClassificationType = 'CAS CONFIRME' | 'CAS PROBABLE' | 'CAS SUSPECT' | 'CAS NON CLASSIFIE' | 'NON DISPONIBLE';
export type ScientificDataQuality = 'EXCELLENTE' | 'BONNE' | 'MOYENNE' | 'FAIBLE' | 'INCONNUE';

export interface HealthSpatiotemporal {
  id: string;
  spatiotemporal_unit_id: string;
  disease: DiseaseCode;
  cases_total: number;
  cases_confirmed: number | null;
  cases_suspected: number | null;
  cases_probable?: number | null;
  cases_unclassified?: number | null;
  hospitalizations: number;
  deaths: number;
  population_at_risk: number;
  data_source: string;
  diagnostic_method: string; // e.g. "TDR / Goutte Épaisse", "Widal / Coproculture / Clinique", "NON DISPONIBLE"
  data_quality: ScientificDataQuality;
  data_completeness: number; // 0-100%
  incidence_per_1000?: number;
  created_at: string;
  updated_at: string;
}

// 17.3. Table Climatique : CLIMATE_SPATIOTEMPORAL
export interface ClimateSpatiotemporal {
  id: string;
  spatiotemporal_unit_id: string;
  source_id: string;
  year: number;
  month: number;
  temperature_mean: number | null;
  temperature_min: number | null;
  temperature_max: number | null;
  rainfall_mm: number | null;
  humidity_percent: number | null;
  rainy_days: number | null;
  extreme_rainfall: boolean | null;
  flood_event: boolean | null;
  spatial_resolution: 'VILLE' | 'STATION' | 'AIRE_SANTE';
  temporal_resolution: 'MOIS' | 'JOUR' | 'ANNEE';
  data_quality: ScientificDataQuality;
  missing_data: boolean;
  rainfall_lag_1?: number | null;
  rainfall_lag_2?: number | null;
  temperature_lag_1?: number | null;
  humidity_lag_1?: number | null;
  created_at: string;
  updated_at: string;
}

// 17.4. Table Environnementale : ENVIRONMENT_SPATIOTEMPORAL
export type SpatioEnvType =
  | 'EAU_STAGNANTE'
  | 'DEPOT_DE_DECHETS'
  | 'INONDATION'
  | 'ZONE_INONDABLE'
  | 'EAUX_USEES'
  | 'CANIVEAU'
  | 'VEGETATION'
  | 'HABITAT'
  | 'AUTRE';

export type SpatioEnvStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'DEGRADE'
  | 'CONSTRUIT'
  | 'RESOLU'
  | 'NON_OBSERVE';

export interface EnvironmentSpatiotemporal {
  id: string;
  spatiotemporal_unit_id: string;
  observation_id: string;
  environment_type: SpatioEnvType;
  status: SpatioEnvStatus;
  observation_date: string;
  valid_from: string; // YYYY-MM-DD
  valid_to: string; // YYYY-MM-DD
  latitude: number | null;
  longitude: number | null;
  quartier_id?: string;
  aire_sante_id: string;
  source: string;
  observation_quality: ScientificDataQuality;
  created_at: string;
  updated_at: string;
}

// 17.5. Table Eau & Assainissement : WASH_SPATIOTEMPORAL
export interface WashSpatiotemporal {
  id: string;
  spatiotemporal_unit_id: string;
  households_observed: number | null;
  safe_water_households: number | null;
  unsafe_water_households: number | null;
  water_treatment_households: number | null;
  latrine_available_households: number | null;
  handwashing_available_households: number | null;
  waste_management_households: number | null;
  data_source: string;
  sample_size: number | null;
  data_quality: ScientificDataQuality;
  created_at: string;
  updated_at: string;
}

// 17.6. Table Agrégée Ménages : HOUSEHOLD_AGGREGATE
export interface HouseholdAggregate {
  id: string;
  spatiotemporal_unit_id: string;
  survey_date: string;
  sample_size: number;
  water_access_rate: number | null; // 0-100%
  water_treatment_rate: number | null; // 0-100%
  latrine_rate: number | null; // 0-100%
  handwashing_rate: number | null; // 0-100%
  waste_management_rate: number | null; // 0-100%
  environmental_exposure_rate: number | null; // 0-100%
  data_quality: ScientificDataQuality;
}

// 17.7. Table Intégrée : INTEGRATED_SPATIOTEMPORAL_DATA
export interface IntegratedSpatiotemporalData {
  id: string;
  spatiotemporal_unit_id: string;
  year: number;
  month: number;
  zone_sante_id: string;
  aire_sante_id: string;
  aire_sante_name: string;
  population: number;
  
  // Health
  malaria_cases: number | null;
  malaria_confirmed: number | null;
  malaria_suspected: number | null;
  malaria_incidence_per_1000: number | null;
  
  typhoid_cases: number | null;
  typhoid_confirmed: number | null;
  typhoid_suspected: number | null;
  typhoid_incidence_per_1000: number | null;
  
  // Climate
  rainfall_mm: number | null;
  temperature_mean: number | null;
  temperature_min: number | null;
  temperature_max: number | null;
  humidity_percent: number | null;
  rainy_days: number | null;
  flood_events: number | null;
  
  // Lags
  rainfall_lag_1: number | null;
  rainfall_lag_2: number | null;
  temperature_lag_1: number | null;
  humidity_lag_1: number | null;
  
  // Environment (strictly 0 if observed absent, null if not documented)
  stagnant_water_count: number | null;
  waste_sites_count: number | null;
  water_sources_count: number | null;
  flooded_zones_count: number | null;
  environmental_obs_count: number | null;
  
  // WASH & Households
  surveyed_sample_size: number | null;
  unsafe_water_rate: number | null; // 0-100%
  water_treatment_rate: number | null; // 0-100%
  latrine_rate: number | null; // 0-100%
  handwashing_rate: number | null; // 0-100%
  waste_management_rate: number | null; // 0-100%
  bednet_coverage_rate: number | null; // 0-100%
  
  // Quality & Completeness
  data_completeness: number; // 0-100%
  data_quality: ScientificDataQuality;
  is_model_ready: boolean;
  notes?: string;
}

// 17.8. Table de Contrôle de Qualité : DATA_QUALITY_CHECK
export type QualityCheckType =
  | 'CONFLIT_TEMPOREL'
  | 'ERREUR_DATE'
  | 'ERREUR_GEOGRAPHIQUE'
  | 'DOUBLON_POTENTIEL'
  | 'DONNEE_MANQUANTE'
  | 'HORS_ZONE_ETUDE'
  | 'INCOHERENCE_RESOLUTION';

export type QualityCheckStatus = 'DETECTE' | 'EN_COURS' | 'VALIDE' | 'IGNORE' | 'CORRIGE';

export interface DataQualityCheckRecord {
  id: string;
  table_name: string;
  record_id: string;
  check_type: QualityCheckType;
  severity: QualitySeverity;
  message: string;
  status: QualityCheckStatus;
  suggested_action?: string;
  created_at: string;
}

// 17.9. Table des Sources : DATA_SOURCE
export interface DataSourceRecord {
  id: string;
  source_name: string;
  source_type: string;
  organization: string;
  collection_method: string;
  period_start: string;
  period_end: string;
  spatial_resolution: string;
  temporal_resolution: string;
  reliability_level: 'HAUTE' | 'MOYENNE' | 'A_VERIFIER';
  notes: string;
}

// 17.10. Vue Données Prêtes pour Modélisation : MODEL_READY_DATA
export interface ModelReadyDataRow {
  spatiotemporal_unit_id: string;
  aire_sante_id: string;
  aire_sante_name: string;
  year: number;
  month: number;
  population: number;
  
  // $Y(s,t)$ Outcomes
  malaria_cases: number | null;
  malaria_confirmed: number | null;
  malaria_incidence_per_1000: number | null;
  
  typhoid_cases: number | null;
  typhoid_confirmed: number | null;
  typhoid_incidence_per_1000: number | null;
  
  // Covariates
  rainfall_mm: number | null;
  temperature_mean: number | null;
  humidity_percent: number | null;
  
  // Historical Lags
  rainfall_lag_1: number | null;
  rainfall_lag_2: number | null;
  temperature_lag_1: number | null;
  humidity_lag_1: number | null;
  
  // Environmental & WASH
  stagnant_water_count: number | null;
  waste_sites_count: number | null;
  water_treatment_rate: number | null;
  latrine_rate: number | null;
  bednet_coverage_rate: number | null;
  
  // Completeness & Quality
  data_completeness: number;
  data_quality: ScientificDataQuality;
  inclusion_criteria_met: boolean;
}

// 17.11. Test Spatio-Temporel
export interface SpatiotemporalValidationTest {
  id: number;
  requirementNumber: number; // e.g. 51, 52, 53, etc.
  title: string;
  description: string;
  category: 'HISTORIQUE' | 'CLIMAT' | 'DONNEES_MANQUANTES' | 'SANTE' | 'NON_COUVERT' | 'RESOLUTION' | 'DOUBLON' | 'COHERENCE' | 'SECURITE';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  resultDetails: string;
  verifiedAt: string;
}

// 17.12. Rapport Final V1.7
export interface V17ReportSummary {
  structure: {
    tablesCreated: number;
    tablesModified: number;
    viewsCreated: number;
    relationsCreated: number;
  };
  donnees: {
    healthRecordsCount: number;
    envRecordsCount: number;
    climateRecordsCount: number;
    householdSurveysCount: number;
    spatiotemporalUnitsCount: number;
  };
  qualite: {
    averageCompleteness: number;
    potentialDuplicatesCount: number;
    conflictsCount: number;
    geoErrorsCount: number;
    temporalErrorsCount: number;
  };
  modelReady: {
    availableRows: number;
    incompleteRows: number;
    validatedRows: number;
  };
  tests: {
    total: number;
    passed: number;
    failed: number;
  };
  compatibilite: {
    v1_0: boolean;
    v1_1: boolean;
    v1_2: boolean;
    v1_3: boolean;
    v1_4: boolean;
    v1_5: boolean;
    v1_6: boolean;
  };
  verdict: 'V1.7 — VALIDÉE' | 'V1.7 — ERREURS À CORRIGER';
}

// =========================================================================
// 18. MODULE QUALITÉ DES DONNÉES & NORMALISATION V1.8
// =========================================================================

// 18.1. Statut Épistémologique de la Donnée
export type DataStatus =
  | 'OBSERVED'        // Donnée primaire observée ou mesurée
  | 'CALCULATED'      // Donnée issue d'un calcul déterministe (taux, proportion, somme)
  | 'ESTIMATED'       // Donnée estimée par un modèle ou ratio
  | 'IMPUTED'         // Donnée imputée statistiquement (avec méthode documentée)
  | 'MISSING'         // Donnée absente / non disponible
  | 'NOT_APPLICABLE';  // Non applicable dans ce contexte

// 18.2. Raison de Donnée Manquante (Strictement distinguée de Zéro)
export type MissingReason =
  | 'NON_COLLECTE'     // Pas d'enquête ou mesure programmée
  | 'NON_DISPONIBLE'   // Registre incomplet / non transmis
  | 'NON_APPLICABLE'   // Contexte non pertinent
  | 'PERDUE'           // Fiche détériorée ou perdue
  | 'INCONNUE'         // Raison non précisée
  | 'AUTRE';

// 18.3. Échelle de Complétude V1.8
export type CompletenessLevel =
  | 'EXCELLENTE' // ≥ 90 %
  | 'BONNE'      // 75–89 %
  | 'MOYENNE'    // 50–74 %
  | 'FAIBLE';    // < 50 %

// 18.4. Qualité GPS
export type GpsQuality = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

// 18.5. Statut de Validation
export type ValidationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'NEEDS_REVIEW';

// 18.6. Importance / Statut des Variables pour la Modélisation
export type VariableImportance =
  | 'ESSENTIELLE'
  | 'UTILE'
  | 'OPTIONNELLE'
  | 'INSUFFISANTE'
  | 'INUTILISABLE';

// 18.7. Représentativité de l'Échantillon
export type RepresentativenessStatus =
  | 'REPRESENTATIVE'
  | 'PARTIALLY_REPRESENTATIVE'
  | 'NOT_REPRESENTATIVE'
  | 'UNKNOWN';

// 18.8. Statut de Préparation à la Modélisation
export type ModelReadyStatus =
  | 'PRÊT'
  | 'PRÊT AVEC LIMITES'
  | 'INSUFFISANT'
  | 'NON PRÊT';

// 18.9. Référentiel Géographique Normalisé : GEO_REFERENCE
export interface GeoReference {
  id: string;
  type: 'PROVINCE' | 'VILLE' | 'ZONE_SANTE' | 'AIRE_SANTE' | 'QUARTIER' | 'AVENUE' | 'STRUCTURE_SANITAIRE';
  official_name: string;
  alternative_names: string[];
  parent_id: string | null;
  latitude: number | null;
  longitude: number | null;
  geometry: string | null;
  source: string;
  valid_from: string;
  valid_to: string | null;
  gps_quality: GpsQuality;
  is_within_study_bounds: boolean;
}

// 18.10. Journal des Transformations et Corrections : TRANSFORMATION_LOG
export interface TransformationLogRecord {
  id: string;
  source_record_id: string;
  transformation_type:
    | 'NORMALISATION_DATE'
    | 'NORMALISATION_GEO'
    | 'NORMALISATION_UNITE'
    | 'CALCUL_INCIDENCE'
    | 'CALCUL_LAG'
    | 'CALCUL_INDICATEUR_WASH'
    | 'AGREGATION_SPATIO_TEMPORELLE'
    | 'CORRECTION_MANUELLE'
    | 'DOUBLON_TRAITEMENT'
    | 'IMPUTATION_VALEUR';
  old_value: string | null;
  new_value: string | null;
  reason: string;
  correction_reason?: string;
  performed_by: string;
  performed_at: string;
  validation_status: ValidationStatus;
  is_reversible: boolean;
}

// 18.11. Candidat Doublon : POTENTIAL_DUPLICATE
export interface DuplicateCandidateV18 {
  id: string;
  table_name: 'HEALTH_RECORD' | 'CLIMATE_RECORD' | 'ENVIRONMENTAL_OBS' | 'HOUSEHOLD_SURVEY';
  record_ids: string[];
  match_criteria: string[];
  confidence_score: number; // 0-100%
  detected_reason: string;
  status: 'POTENTIAL_DUPLICATE' | 'MERGED' | 'CONFIRMED_SEPARATE' | 'RESOLVED';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
}

export type DuplicateCandidateV18Type = DuplicateCandidateV18;

// 18.12. Jeu de Données Analytique Versionné : ANALYSIS_DATASET
export interface AnalysisDatasetRow {
  id: string;
  dataset_version: string; // e.g. "ANALYSIS_DATASET_v1"
  spatiotemporal_unit_id: string;
  source_record_id?: string;
  transformation_id?: string;
  year: number;
  month: number;
  zone_sante_id: string;
  aire_sante_id: string;
  aire_sante_name: string;
  
  // Démographie
  population: number | null;
  
  // Données sanitaires
  malaria_cases: number | null;
  malaria_confirmed: number | null;
  malaria_incidence_per_1000: number | null; // Taux explicite / 1 000 hab
  typhoid_cases: number | null;
  typhoid_confirmed: number | null;
  typhoid_incidence_per_1000: number | null; // Taux explicite / 1 000 hab
  
  // Données climatiques synoptiques
  rainfall_mm: number | null;
  temperature_mean: number | null;
  temperature_min: number | null;
  temperature_max: number | null;
  humidity_percent: number | null;
  rainy_days: number | null;
  flood_events: number | null;
  
  // Décalages temporels (Lags)
  rainfall_lag_1: number | null;
  rainfall_lag_2: number | null;
  rainfall_lag_3: number | null;
  temperature_lag_1: number | null;
  humidity_lag_1: number | null;
  
  // Facteurs environnementaux (0 = absence observée, null = non documenté)
  stagnant_water_count: number | null;
  waste_site_count: number | null;
  water_source_count: number | null;
  wastewater_count: number | null;
  drainage_problem_count: number | null;
  
  // Indicateurs WASH
  water_safe_rate: number | null;        // 0-100%
  water_treatment_rate: number | null;   // 0-100%
  latrine_rate: number | null;           // 0-100%
  handwashing_rate: number | null;       // 0-100%
  waste_management_rate: number | null;  // 0-100%
  
  // Métadonnées de qualité & traçabilité
  data_completeness: number; // 0-100%
  data_quality: CompletenessLevel;
  validation_status: ValidationStatus;
  
  // Statuts épistémologiques champ par champ
  data_status_flags: Record<string, DataStatus>;
  missing_reasons: Record<string, MissingReason>;
}

// 18.13. Métadonnées du Jeu de Données Analytique
export interface DatasetMetadata {
  id: string;
  version: string; // e.g. "ANALYSIS_DATASET_v1", "ANALYSIS_DATASET_v2"
  generated_at: string;
  generated_by: string;
  units_count: number;
  variables_count: number;
  average_completeness: number;
  filters_applied: {
    years: number[];
    aires: string[];
    included_domains: string[];
  };
  variables_used: string[];
  variables_excluded: string[];
  transformations_applied: string[];
  sources_used: string[];
  modeling_readiness: ModelReadyStatus;
  reproducibility_hash: string;
  notes: string;
}

// 18.14. Entrée du Dictionnaire des Variables
export interface VariableDictionaryEntry {
  variable_name: string;
  label: string;
  definition: string;
  data_type: 'ENTIER' | 'DECIMAL' | 'TEXTE' | 'POURCENTAGE' | 'CATEGORIEL' | 'BOOLEEN';
  unit: string;
  source: string;
  calculation_method: string;
  spatial_level: 'AIRE_SANTE' | 'ZONE_SANTE' | 'VILLE' | 'POINT_GPS';
  temporal_level: 'MENSUEL' | 'ANNUEL' | 'OBSERVATION_PONCTUELLE';
  category: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'WASH' | 'DEMOGRAPHIE' | 'QUALITE';
  importance: VariableImportance;
  data_status: DataStatus;
  completeness_rate: number;
  quality_assessment: CompletenessLevel;
  is_usable_for_model: boolean;
  justification: string;
}

// 18.15. Rapport de Faisabilité de la Modélisation (12 sections)
export interface ModelingFeasibilityReport {
  period_covered: string;
  zones_covered: {
    health_zones: string[];
    health_areas: string[];
    neighborhoods_count: number;
  };
  total_data_counts: {
    raw_records: number;
    clean_records: number;
    analysis_units: number;
  };
  global_completeness: number;
  completeness_by_domain: {
    sante: number;
    climat: number;
    environnement: number;
    wash: number;
    demographie: number;
  };
  quality_overview: {
    valid_count: number;
    to_review_count: number;
    errors_count: number;
    duplicates_count: number;
  };
  available_variables: string[];
  missing_variables: string[];
  insufficient_variables: string[];
  inconsistencies: string[];
  duplicates: string[];
  methodological_limitations: string[];
  recommendations: string[];
  modeling_readiness_status: ModelReadyStatus;
}

// 18.16. Synthèse « État des Données » pour Dashboard & Navigation
export interface DataQualityOverview {
  totalRecords: number;
  validRecords: number;
  toReviewRecords: number;
  missingDataCount: number;
  errorsCount: number;
  potentialDuplicatesCount: number;
  coveredAreasCount: number;
  coveredMonthsCount: number;
  usableVariablesCount: number;
  globalCompleteness: number;
  completenessLevel: CompletenessLevel;
  modelReadyStatus: ModelReadyStatus;
}

// 18.17. Banc de Tests V1.8 (Sections 65-76)
export interface V18ValidationTest {
  id: number;
  sectionNumber: number; // 65, 66, 67...
  title: string;
  description: string;
  category:
    | 'HISTORIQUE'
    | 'DONNEE_MANQUANTE'
    | 'INCIDENCE'
    | 'POPULATION'
    | 'GPS'
    | 'PROPORTION'
    | 'LAG'
    | 'LAG_MANQUANT'
    | 'DOUBLON'
    | 'RESOLUTION'
    | 'TRACABILITE'
    | 'VERSIONNAGE';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  testInput: string;
  expectedResult: string;
  actualResult: string;
  verifiedAt: string;
}

// 18.18. Rapport Final Synthétique V1.8 (Section 80)
export interface V18ReportSummary {
  structure: {
    tablesCreated: number;
    tablesModified: number;
    viewsCreated: number;
  };
  qualite: {
    donneesTotales: number;
    donneesValides: number;
    donneesAVerifier: number;
    donneesManquantes: number;
    doublons: number;
    erreurs: number;
  };
  spatioTemporel: {
    airesCouvertes: number;
    periodesCouvertes: number;
    unitesAireMois: number;
    trousTemporels: number;
  };
  variables: {
    variablesDisponibles: number;
    variablesPartielles: number;
    variablesInsuffisantes: number;
    variablesExclues: number;
  };
  dataset: {
    version: string;
    nombreLignes: number;
    nombreVariables: number;
    completudeMoyenne: number;
  };
  modelisation: {
    etat: ModelReadyStatus;
  };
  tests: {
    testsRealises: number;
    testsReussis: number;
    testsEchoues: number;
    erreursRestantes: number;
  };
  verdict: 'V1.8 — VALIDÉE' | 'V1.8 — ERREURS À CORRIGER';
}

// ==========================================
// 19. MODULE V1.9 — ANALYSE EXPLORATOIRE SPATIO-TEMPORELLE
// ==========================================

export type V19SubTab =
  | 'OVERVIEW'
  | 'TEMPORAL'
  | 'SPATIAL'
  | 'SEASONAL'
  | 'CLIMATE_DISEASE'
  | 'LAGS'
  | 'CLUSTERS'
  | 'COMPARISON'
  | 'QUALITY_COVERAGE'
  | 'REPORT';

export interface ExplorationFilters {
  disease: 'ALL' | 'MALARIA' | 'TYPHOID';
  year: number | 'ALL';
  month: number | 'ALL';
  quarter: number | 'ALL';
  zone_sante_id: string | 'ALL';
  aire_sante_id: string | 'ALL';
  climate_variable: 'rainfall_mm' | 'temperature_mean' | 'temperature_max' | 'humidity_percent' | 'rainy_days';
  data_source: string | 'ALL';
  movingAverageMonths: 0 | 3 | 6 | 12;
}

export interface TemporalPoint {
  periodKey: string; // "2023-01"
  year: number;
  month: number;
  quarter: number;
  label: string;
  malaria_cases: number | null;
  malaria_confirmed: number | null;
  malaria_incidence: number | null;
  typhoid_cases: number | null;
  typhoid_confirmed: number | null;
  typhoid_incidence: number | null;
  rainfall_mm: number | null;
  temperature_mean: number | null;
  temperature_max?: number | null;
  humidity_percent: number | null;
  rainy_days?: number | null;
  climate_value?: number | null;
  // Moving averages (Calculated variables)
  malaria_ma?: number | null;
  typhoid_ma?: number | null;
  rainfall_ma?: number | null;
  completeness: number;
  observations_count: number;
}

export interface SeasonalMonthlyProfile {
  month: number;
  monthName: string;
  isRainySeason: boolean; // Computed from climate data
  malaria_mean: number | null;
  malaria_median: number | null;
  malaria_min: number | null;
  malaria_max: number | null;
  malaria_std: number | null;
  typhoid_mean: number | null;
  typhoid_median: number | null;
  typhoid_min: number | null;
  typhoid_max: number | null;
  typhoid_std: number | null;
  rainfall_mean: number | null;
  temperature_mean: number | null;
  humidity_mean: number | null;
  n_years: number;
}

export interface YearlySeasonalCurve {
  year: number;
  months: {
    month: number;
    monthName: string;
    malaria_cases: number | null;
    typhoid_cases: number | null;
    rainfall_mm: number | null;
  }[];
}

export interface HealthAreaSpatialStat {
  aire_sante_id: string;
  aire_sante_name: string;
  zone_sante_id: string;
  population: number;
  area_km2?: number;
  lat: number;
  lng: number;
  total_malaria_cases: number;
  total_malaria_confirmed: number;
  malaria_incidence_per_1000: number | null;
  total_typhoid_cases: number;
  total_typhoid_confirmed: number;
  typhoid_incidence_per_1000: number | null;
  periods_covered: number;
  total_periods: number;
  coverage_percentage: number;
  coverage_status: 'BONNE' | 'PARTIELLE' | 'FAIBLE' | 'ABSENTE';
  avg_completeness: number;
  risk_density_score: number; // Density index [0-100]
  concentration_level: 'FORTE' | 'MOYENNE' | 'FAIBLE' | 'INDETERMINEE';
  // Limitations
  coverage_limitation_warning?: string;
}

export interface SpatialClusterResult {
  method: "Moran's I" | "Local Moran's I (LISA)" | "Getis-Ord Gi*";
  period: string;
  spatialUnit: string;
  nObservations: number;
  globalMoransI?: number;
  expectedI?: number;
  p_value?: number;
  z_score?: number;
  isStatisticallySignificant: boolean;
  scientificInterpretation: string; // Cautious phrasing
  conditionsMet: boolean;
  conditionMessage?: string;
  localClusters: {
    aire_sante_id: string;
    aire_sante_name: string;
    clusterType: 'CLUSTER_ELEVE' | 'CLUSTER_FAIBLE' | 'AGREGATION_SPATIALE' | 'NON_SIGNIFICATIF' | 'INDETERMINE';
    zScore: number;
    pValue: number;
    localI: number;
    cautiousLabel: string;
  }[];
}

export interface CorrelationTestResult {
  disease: 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MALARIA' | 'TYPHOID';
  climateVariable?: string;
  climateVariableLabel?: string;
  climate_variable?: string;
  lagMonths?: number;
  lag_months?: number;
  pearsonR?: number | null;
  pearsonPValue?: number | null;
  spearmanRho?: number | null;
  spearmanPValue?: number | null;
  r?: number | null;
  p_value?: number | null;
  ci_95?: [number, number];
  nObservations?: number;
  n_observations?: number;
  n?: number;
  missingPercentage?: number;
  missing_percentage?: number;
  missingPct?: number;
  periodAnalyzed?: string;
  period_analyzed?: string;
  interpretationCautious?: string;
  interpretation?: string;
  significant?: boolean;
  isSignificantBonferroni?: boolean;
  isSignificantFDR?: boolean;
  method?: string;
  disclaimer?: string;
  optimalNote?: string;
}

export interface LagCorrelationMatrixCell {
  climateVariable: string;
  climateVariableLabel: string;
  disease: 'PALUDISME' | 'FIEVRE_TYPHOIDE';
  lag: number; // 0 to 6
  r: number | null;
  pValue: number | null;
  n: number;
  missingPct: number;
  status: 'SUFFICIENT' | 'LIMITED' | 'INSUFFICIENT';
}

export interface JointDiseaseComparisonRow {
  unitId: string;
  aire_sante_id: string;
  aire_sante_name: string;
  periodKey: string;
  malaria_cases: number | null;
  malaria_incidence: number | null;
  malaria_level: 'ELEVE' | 'FAIBLE' | 'INDETERMINE';
  typhoid_cases: number | null;
  typhoid_incidence: number | null;
  typhoid_level: 'ELEVE' | 'FAIBLE' | 'INDETERMINE';
  jointSituation: 'ELEVE_ELEVE' | 'ELEVE_FAIBLE' | 'FAIBLE_ELEVE' | 'FAIBLE_FAIBLE' | 'INDETERMINE';
  jointLabel: string; // "Concentration conjointe observée", "Prédominance paludisme", etc.
  data_coverage: 'BONNE' | 'PARTIELLE' | 'FAIBLE' | 'ABSENTE';
}

export interface EnvironmentalHistoryPoint {
  id: string;
  siteName: string;
  siteType: string;
  aire_sante_id: string;
  valid_from: string;
  valid_to: string | null;
  status_in_selected_period: 'PRESENT' | 'ABSENT' | 'HISTORIQUE_INCONNU';
  riskScore: number;
  details: string;
}

export interface ModelingCandidateVariable {
  id: string;
  variableName: string;
  category: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'WASH' | 'DEMOGRAPHIE';
  completenessPercentage: number;
  spatialResolution: string; // e.g. "AS × mois", "Ville × mois", "Point terrain"
  temporalResolution: string; // e.g. "Mensuel", "Annuel", "Ponctuel"
  exploratoryAssociation: string;
  qualityGrade: '🟢 Suffisante' | '🟠 Limitée' | '🔴 Insuffisante' | '⚪ Inconnue';
  status: 'ESSENTIELLE' | 'CANDIDATE' | 'A_EVALUER' | 'INSUFFISANTE' | 'EXCLUE';
  notes: string;
}

export interface AnalysisLogRecord {
  analysis_id: string;
  analysis_type: string;
  dataset_version: string;
  date: string;
  user: string;
  filters_summary: string;
  variables_analyzed: string[];
  method: string;
  observations_count: number;
  result_status: 'SUCCESS' | 'WARNING_LIMITED_DATA' | 'ABORTED_INSUFFICIENT_DATA';
  scientific_notes: string;
}

export interface V19ValidationTest {
  id: number;
  sectionNumber: number; // 64 to 76
  title: string;
  description: string;
  category:
    | 'TEMPOREL'
    | 'DONNEE_MANQUANTE'
    | 'CLIMAT'
    | 'LAG'
    | 'COUVERTURE'
    | 'HISTORIQUE_ENV'
    | 'ZERO_VS_NULL'
    | 'CLUSTER'
    | 'CAUSALITE'
    | 'COMPARAISONS_MULTIPLES'
    | 'RESOLUTION';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  testInput: string;
  expectedResult: string;
  actualResult: string;
  verifiedAt: string;
}

export interface V19ExploratoryReport {
  metadata: {
    generatedAt: string;
    author: string;
    datasetVersion: string;
    periodAnalyzed: string;
    spatialScope: string;
    totalObservations: number;
    scientificDisclaimer: string;
  };
  section1_DataOverview: {
    period: string;
    healthAreasCount: number;
    observationsCount: number;
    sources: string[];
    completeness: number;
  };
  section2_Malaria: {
    totalCases: number;
    confirmedCases: number;
    temporalTrend: 'AUGMENTATION' | 'DIMINUTION' | 'STABLE' | 'INDETERMINEE';
    seasonalityPattern: string;
    spatialConcentration: string;
    potentialClusters: string;
  };
  section3_Typhoid: {
    totalCases: number;
    confirmedCases: number;
    temporalTrend: 'AUGMENTATION' | 'DIMINUTION' | 'STABLE' | 'INDETERMINEE';
    seasonalityPattern: string;
    spatialConcentration: string;
    potentialClusters: string;
  };
  section4_Climate: {
    availableVariables: string[];
    exploratoryAssociations: string[];
  };
  section5_Lags: {
    testedVariables: string[];
    lagsTested: number[];
    notableFindings: string[];
    multipleComparisonsWarning: string;
  };
  section6_Environment: {
    availableFactors: string[];
    historicalObservationsCount: number;
    exploratoryAssociations: string[];
  };
  section7_Quality: {
    missingDataPercentage: number;
    wellDocumentedAreas: string[];
    partiallyDocumentedAreas: string[];
    insufficientlyDocumentedAreas: string[];
    mainLimitations: string[];
  };
  section8_Conclusions: {
    summary: string;
    cautiousObservations: string[];
  };
  section9_RecommendedModelingCandidates: ModelingCandidateVariable[];
  section10_VariablesToImprove: ModelingCandidateVariable[];
  validationStatus: 'V1.9 — ANALYSE EXPLORATOIRE SPATIO-TEMPORELLE VALIDÉE' | 'V1.9 — ERREURS À CORRIGER';
}

// ============================================================================
// 10. V1.10 — EXTENSION MANIEMA & MOTEUR MULTI-PATHOLOGIES ONE HEALTH
// ============================================================================

export type GeographicLevel =
  | 'PROVINCE'
  | 'VILLE_TERRITOIRE'
  | 'ZONE_SANTE'
  | 'AIRE_SANTE'
  | 'QUARTIER_VILLAGE'
  | 'AVENUE_RUE'
  | 'SITE'
  | 'MENAGE_POINT'
  | 'MANIEMA_ENTIER'
  | 'VILLE_KINDU'
  | 'QUARTIER'
  | 'AVENUE';

export type ScientificDataStatus =
  | 'PRESENTE'
  | 'OBSERVEE'
  | 'IMPORTEE'
  | 'MANQUANTE_NULL'
  | 'ZERO_MESURE'
  | 'PROXY'
  | 'ESTIMEE'
  | 'NON_APPLICABLE';

export interface GeographicUnitV110 {
  id: string;
  code: string;
  name: string;
  level: GeographicLevel;
  parentId: string | null;
  provinceId: string;
  coordinates: { lat: number; lng: number } | null;
  population: number;
  area_km2?: number;
  status: 'ACTIF' | 'INACTIF' | 'EN_ATTENTE';
  source: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type PathologyCategory =
  | 'VECTORIELLE'
  | 'HYDRIQUE_ALIMENTAIRE'
  | 'ZOONOTIQUE'
  | 'RESPIRATOIRE'
  | 'AUTRE_INFECTIEUSE';

export type TransmissionMode =
  | 'MOUSTIQUE_ANOPHELE'
  | 'MOUSTIQUE_AEDES'
  | 'EAU_ALIMENT_CONTAMINE'
  | 'CONTACT_DIRECT_ANIMAL'
  | 'GOUTTELETTES_AERIENNES'
  | 'CONTACT_ORAL_FECAL';

export type VariableAvailabilityStatus =
  | 'DISPONIBLE'
  | 'INDISPONIBLE'
  | 'NON_APPLICABLE';

export interface PathologyVariableDefinition {
  id: string;
  code: string;
  label: string;
  type: 'INTEGER' | 'DECIMAL' | 'BOOLEAN' | 'CATEGORICAL' | 'TEXT' | 'DATE' | 'GPS';
  category: 'COMMUNE' | 'SPECIFIQUE';
  required: boolean;
  options?: { value: string; label: string }[];
  unit?: string;
  description: string;
  availabilityStatus: VariableAvailabilityStatus;
}

export interface PathologyIndicator {
  id: string;
  name: string;
  formulaDescription: string;
  unit: string;
  targetThreshold?: number;
}

export interface PathologyConfig {
  id: string;
  code: string;
  name: string;
  scientificName: string;
  category: PathologyCategory;
  transmissionMode: TransmissionMode;
  description: string;
  isActive: boolean;
  icon: string;
  color: string;
  commonVariables: string[];
  specificVariables: PathologyVariableDefinition[];
  indicators: PathologyIndicator[];
  dataSources: string[];
  collectionFrequency: 'QUOTIDIEN' | 'HEBDOMADAIRE' | 'MENSUEL' | 'TRIMESTRIEL' | 'ANNUEL';
  oneHealthDimension: 'SANTE_HUMAINE' | 'ENVIRONNEMENT' | 'CLIMAT' | 'SANTE_ANIMALE';
  createdAt: string;
  updatedAt: string;
}

export type DataSourceTypeV110 =
  | 'REGISTRE_SANITAIRE'
  | 'ENQUETE_MENAGE'
  | 'OBSERVATION_TERRAIN'
  | 'SERVICE_SANTE'
  | 'DONNEES_CLIMATIQUES'
  | 'DONNEES_SATELLITAIRES'
  | 'LABORATOIRE'
  | 'SURVEILLANCE_EPIDEMIO'
  | 'VETERINAIRE'
  | 'AUTRE_SOURCE';

export interface TimePeriodConfig {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: DataSourceTypeV110;
  startDate: string;
  endDate: string;
  totalYears: number;
  temporalResolution: 'JOUR' | 'SEMAINE' | 'MOIS' | 'ANNEE';
  geographicLevel: GeographicLevel;
  reliability: 'HAUTE' | 'MOYENNE' | 'VARIABLE';
  lastImportDate: string;
}

export interface OneHealthProject {
  id: string;
  code: string;
  name: string;
  description: string;
  principalInvestigator: string;
  institution: string;
  pathologyIds: string[];
  geographicUnitIds: string[];
  startDate: string;
  endDate: string | null;
  status: 'ACTIF' | 'CLOTURE' | 'EN_PREPARATION';
  isDemoAllowed: boolean;
  assignedUsers: { userId: string; role: UserRoleV110 }[];
  createdAt: string;
}

export type UserRoleV110 =
  | 'ADMINISTRATEUR'
  | 'RESPONSABLE_PROVINCIAL'
  | 'RESPONSABLE_PROJET'
  | 'SUPERVISEUR'
  | 'ENQUETEUR';

export interface UserSessionV110 {
  id: string;
  name: string;
  role: UserRoleV110;
  institution: string;
  email?: string;
  assignedTerritoryId?: string;
  assignedZoneId?: string;
  assignedAreaId?: string;
  isActive: boolean;
}

export interface DynamicObservationRecord {
  id: string;
  projectId: string;
  pathologyId: string;
  pathologyCode: string;
  date: string;
  year: number;
  month: number;
  provinceId: string;
  geographicUnitId: string;
  geographicLevel: GeographicLevel;
  sourceId: string;
  sourceType: DataSourceTypeV110;
  investigatorId: string;
  investigatorName: string;
  coordinates: { lat: number; lng: number } | null;
  validationStatus: RecordStatus;
  dataQuality: 'VALIDE' | 'SUSPECT' | 'INCOMPLET' | 'REJETE';
  isDemo: boolean; // Séparation stricte démo vs réel
  commonData: {
    cases_total?: number | null;
    cases_confirmed?: number | null;
    hospitalized?: number | null;
    deaths?: number | null;
    notes?: string;
  };
  specificData: Record<string, any>;
  variableAvailability: Record<string, VariableAvailabilityStatus>;
  createdAt: string;
  updatedAt: string;
}

export interface V110ValidationTest {
  id: number;
  title: string;
  sectionRequirement: string;
  category:
    | 'EXTENSION_MANIEMA'
    | 'MOTEUR_MULTI_PATHOLOGIES'
    | 'FORMULAIRES_DYNAMIQUES'
    | 'VARIABLES_COMMUNES_SPECIFIQUES'
    | 'GESTION_PERIODES_SOURCES'
    | 'HISTORIQUE_NON_ECRASE'
    | 'SEPARATION_DEMO_REEL'
    | 'GESTION_PROJETS'
    | 'ROLES_UTILISATEURS'
    | 'RELATIONS_ONE_HEALTH'
    | 'NON_REGRESSION_V19';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  details: string;
  verifiedAt: string;
}

// ============================================================================
// 11. V1.11 — MODULE D'ENQUÊTE OPÉRATIONNELLE ET SUPERVISION DE TERRAIN
// ============================================================================

export type SurveyStatusV111 =
  | 'BROUILLON'
  | 'PREPARATION'
  | 'PLANIFIEE'
  | 'ACTIVE'
  | 'EN_COURS'
  | 'SUSPENDUE'
  | 'TERMINÉE'
  | 'CLOTUREE'
  | 'ARCHIVÉE';

export type SurveyTypeV111 =
  | 'PROSPECTIVE'
  | 'RETROSPECTIVE'
  | 'OBSERVATION_TERRAIN';

export interface FieldSurvey {
  id: string;
  code: string; // e.g. "ENQ-2026-MAL-01"
  name: string;
  description?: string;
  projectId: string;
  pathologyIds: string[];
  geographicScope?: {
    provinceId: string;
    territoryId?: string;
    zoneId?: string;
    areaId?: string;
    villageId?: string;
  } | string;
  geographicUnitIds?: string[];
  targetType?: string;
  startDate: string;
  endDate: string | null;
  status: SurveyStatusV111;
  type: SurveyTypeV111;
  responsibleId?: string;
  responsibleName?: string;
  leadSupervisorName?: string;
  assignedSurveyorNames?: string[];
  objectives?: string;
  questionnaireId: string;
  questionnaireVersion: string;
  supervisorIds?: string[];
  surveyorIds?: string[];
  targetSampleSize?: number;
  targetSampleCount?: number;
  completedSampleCount?: number;
  validatedSampleCount?: number;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QuestionnaireStatus = 'BROUILLON' | 'PUBLIE' | 'ARCHIVE';

export type QuestionType =
  | 'TEXT'
  | 'INTEGER'
  | 'NUMBER'
  | 'DECIMAL'
  | 'DATE'
  | 'TIME'
  | 'BOOLEAN'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'WATER_SOURCE'
  | 'MOSQUITO_NET'
  | 'SYMPTOMS_CHECKLIST'
  | 'TEXTAREA'
  | 'DROPDOWN'
  | 'GPS'
  | 'PHOTO'
  | 'AUDIO'
  | 'SCALE'
  | 'FREE_TEXT';

export type SurveyQuestionType = QuestionType;

export interface ValidationRule {
  id: string;
  type: 'MIN' | 'MAX' | 'RANGE' | 'REGEX' | 'GPS_PRECISION' | 'REQUIRED_IF';
  params: Record<string, any>;
  errorMessage: string;
}

export interface ConditionalRule {
  dependsOnQuestionId: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'IN';
  expectedValue: any;
}

export interface SurveyQuestion {
  id: string;
  code: string;
  label: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  choices?: { id?: string; code: string; label: string }[];
  unit?: string;
  displayOrder: number;
  conditionalRule?: ConditionalRule;
  validationRules?: ValidationRule[];
  specificToPathologyId?: string;
}

export interface QuestionnaireSection {
  id: string;
  code: string; // e.g. "SEC_A", "SEC_B"
  title: string;
  description?: string;
  displayOrder: number;
  order?: number;
  questions: SurveyQuestion[];
}

export type SurveySection = QuestionnaireSection;

export interface SurveyQuestionnaire {
  id: string;
  name: string;
  version: string; // "1.0", "1.1", "2.0"
  description: string;
  projectId: string;
  pathologyIds: string[];
  status: QuestionnaireStatus;
  sections: QuestionnaireSection[];
  isLocked: boolean; // Locked once used in live collections
  createdAt: string;
  updatedAt: string;
}

export interface SurveySite {
  id: string;
  code: string;
  name: string;
  geographicUnitId: string;
  geographicUnitName?: string;
  coordinates: { lat: number; lng: number; accuracy?: number } | null;
  siteType: 'MENAGE' | 'GITE_LARVAIRE' | 'POINT_EAU' | 'CENTRE_SANTE' | 'MARCHE' | 'SITE_AGRICOLE' | 'AUTRE';
  status: 'ACTIF' | 'INACTIF';
  isDemo: boolean;
  createdAt: string;
}

export type SurveyTargetType = 'MENAGE' | 'GITE_LARVAIRE' | 'POINT_EAU' | 'CENTRE_SANTE' | 'MARCHE' | 'SITE_AGRICOLE' | 'AUTRE';
export type SurveyType = SurveyTypeV111;

export interface SurveyHousehold {
  id: string;
  anonymousCode: string; // Code anonymisé sans noms de famille complets
  siteId: string;
  geographicUnitId: string;
  firstObservationDate: string;
  status: 'ACTIF' | 'INACTIF' | 'REFUS';
  isDemo: boolean;
  createdAt: string;
}

export type CollectionSessionStatus =
  | 'EN_COURS'
  | 'BROUILLON'
  | 'SOUMISE'
  | 'A_CORRIGER'
  | 'VALIDEE'
  | 'REJETEE';

export type SessionStatus = CollectionSessionStatus;

export interface AttachedPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
  time: string;
  surveyId: string;
  siteId?: string;
  surveyorId: string;
  isValidated: boolean;
}

export interface SupervisorComment {
  id: string;
  sessionId: string;
  supervisorId: string;
  supervisorName: string;
  date: string;
  commentType: 'GENERAL' | 'QUESTION' | 'LOCATION' | 'DEMANDE_CORRECTION';
  targetQuestionId?: string;
  message: string;
  resolved: boolean;
}

export interface CollectionSession {
  id: string;
  surveyId: string;
  surveyName: string;
  surveyType?: string;
  surveyorId: string;
  surveyorName: string;
  siteId?: string;
  householdId?: string;
  anonymousSubjectId: string;
  questionnaireId: string;
  questionnaireVersion: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status: CollectionSessionStatus;
  gps: {
    lat: number;
    lng: number;
    accuracy: number;
    altitude?: number;
    timestamp?: string;
    source: 'DEVICE_GPS' | 'MANUAL_MAP' | 'ESTIMATED' | 'GPS_CAPTEUR_DIRECT' | 'MANUEL' | 'APPROXIME_CENTRE_VILLAGE';
    warningAccuracy?: boolean;
  } | null;
  answers: Record<string, any>;
  previousAnswersHistory?: {
    versionNumber: number;
    answers: Record<string, any>;
    modifiedAt: string;
    modifiedBy: string;
    correctionReason: string;
  }[];
  photos?: AttachedPhoto[];
  supervisorComments?: SupervisorComment[];
  completenessScore: number; // 0 - 100%
  missingRequiredQuestions: string[];
  missingOptionalQuestions: string[];
  notApplicableQuestions: string[];
  dataQualityStatus: 'BONNE_QUALITE' | 'A_VERIFIER' | 'PROBLEMATIQUE';
  qualityErrors: string[];
  dataTier: 'RAW' | 'CLEANED' | 'ANALYSIS';
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FieldPlanItem {
  id: string;
  surveyId: string;
  geographicUnitId: string;
  geographicUnitName: string;
  plannedObservations: number;
  inProgressObservations: number;
  completedObservations: number;
  validatedObservations?: number;
  remainingObservations: number;
  assignedSurveyorId: string;
  assignedSupervisorId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: 'NON_COMMENCE' | 'EN_COURS' | 'TERMINE' | 'EN_RETARD';
}

export interface HealthRegistryRecord {
  id: string;
  surveyId: string;
  registerCode?: string;
  consultationDate: string;
  pathologyId?: string;
  pathologyCode: string;
  patientAnonymousId: string;
  ageYears: number | null;
  ageMonths?: number | null;
  gender: 'M' | 'F' | 'INCONNU';
  healthStructureName?: string;
  healthFacilityName?: string;
  healthFacilityId?: string;
  geographicUnitId: string;
  geographicUnitName?: string;
  clinicalDiagnosis?: string;
  diagnosisType?: string;
  labTestType?: string;
  labResult?: 'POSITIF' | 'NEGATIF' | 'DOUTEUX' | 'NON_FAIT';
  hospitalized?: boolean;
  outcome: 'GUERI' | 'TRANSFERE' | 'DECEDE' | 'EN_SOINS' | 'EN_COURS' | 'INCONNU';
  dataQualityCheck?: string;
  isDemo: boolean;
  dataTier?: 'RAW' | 'CLEANED' | 'ANALYSIS';
  createdAt: string;
}

export interface SurveyAuditLog {
  id: string;
  surveyId: string;
  sessionId?: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  action:
    | 'CREATION'
    | 'MODIFICATION'
    | 'SOUMISSION'
    | 'VALIDATION'
    | 'DEMANDE_CORRECTION'
    | 'CORRECTION'
    | 'REJET'
    | 'EXPORT';
  entity: 'ENQUETE' | 'QUESTIONNAIRE' | 'SESSION' | 'PLAN' | 'REGISTRE' | 'SITE';
  fieldName?: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
}

export interface V111ValidationTest {
  id: number;
  title: string;
  name?: string;
  description?: string;
  category:
    | 'CREATION_ENQUETE'
    | 'CREATION_QUESTIONNAIRE'
    | 'VERSIONNEMENT_QUESTIONNAIRE'
    | 'AFFECTATION_EQUIPE'
    | 'CREATION_SESSION'
    | 'REMPLISSAGE_LOGIQUE_CONDITIONNELLE'
    | 'SAUVEGARDE_PROGRESSIVE'
    | 'SOUMISSION_SESSION'
    | 'CONTROLE_SUPERVISEUR'
    | 'DEMANDE_CORRECTION'
    | 'CORRECTION_PRESERVATION_HISTORIQUE'
    | 'NOUVELLE_VALIDATION'
    | 'JOURNAL_AUDIT'
    | 'CALCUL_COMPLETUDE'
    | 'EXPORT_DONNEES'
    | 'NON_REGRESSION_V110';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  details: string;
  verifiedAt: string;
}

// ============================================================================
// V1.12 — INTÉGRATION MULTI-SOURCES ET PRÉPARATION DES DONNÉES
// ============================================================================

export type GeographicLevelType =
  | 'PROVINCE'
  | 'TERRITOIRE'
  | 'ZONE_SANTE'
  | 'AIRE_SANTE'
  | 'SITE_VILLAGE'
  | 'COORDONNEES_GPS';

export type FrequencyType =
  | 'HORAIRE'
  | 'JOURNALIERE'
  | 'HEBDOMADAIRE'
  | 'MENSUELLE'
  | 'ANNUELLE'
  | 'PONCTUELLE';

export type FileFormatType =
  | 'EXCEL'
  | 'CSV'
  | 'JSON'
  | 'SHAPEFILE_GEOJSON'
  | 'API'
  | 'MANUEL';

export type SourceStatusType =
  | 'ACTIF'
  | 'EN_ATTENTE_VALIDATION'
  | 'OBSOLETE'
  | 'ARCHIVE';

export type QualityEstimateType =
  | 'EXCELLENTE'
  | 'BONNE'
  | 'MOYENNE'
  | 'FAIBLE'
  | 'A_EVALUER';

export type CoverageLevelType =
  | 'COMPLETE'
  | 'PARTIELLE'
  | 'PONCTUELLE'
  | 'DISCONTINUE';

export type ImportStatusType =
  | 'PREPARE'
  | 'ANALYSE'
  | 'EN_ATTENTE_VALIDATION'
  | 'VALIDE'
  | 'PARTIELLEMENT_INTEGRE'
  | 'REJETE'
  | 'ARCHIVE';

export type DuplicateResolutionType =
  | 'CONSERVER'
  | 'FUSIONNER'
  | 'EXCLURE'
  | 'MARQUER_DOUBLON';

export type AvailabilityStatus =
  | 'DISPONIBLE'
  | 'PARTIEL'
  | 'ABSENT'
  | 'NON_APPLICABLE';

export type ReconciliationKeyType =
  | 'DATE_ZONE_SANTE'
  | 'DATE_SITE_ID'
  | 'COORDONNEES_PERIODE'
  | 'ANNEE_MOIS_AIRE_SANTE'
  | 'CUSTOM';

export interface DataSourceEntity {
  id: string; // e.g. "SRC-SAN-001"
  name: string;
  type: DataSourceType;
  subType: string;
  description: string;
  organization: string; // Organisme / Source productrice
  periodStart: string; // e.g. "2018"
  periodEnd: string; // e.g. "2026"
  geographicLevel: GeographicLevelType;
  frequency: FrequencyType;
  format: FileFormatType;
  status: SourceStatusType;
  importDate: string;
  importedBy: string;
  estimatedQuality: QualityEstimateType;
  coverageLevel: CoverageLevelType;
  notes?: string;
  isInternal: boolean; // True for internal surveys (V1.11), False for external imports
  isDemo: boolean; // Strict demo flag
  totalImportsCount: number;
  lastImportId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawImportRecord {
  id: string; // e.g. "RAW-IMP-001"
  importNumber: string; // e.g. "Import #001"
  sourceId: string;
  sourceName: string;
  fileName: string;
  fileSize: number; // bytes
  fileHash: string; // SHA256 simulation / content hash
  importDate: string;
  importedBy: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  rawSample: Record<string, any>[]; // First rows preview
  rawContentData: Record<string, any>[]; // Immutable full verbatim raw dataset
  status: ImportStatusType;
  mappingConfigId?: string;
  qualityReportId?: string;
  cleanedDatasetId?: string;
  notes?: string;
  isDemo: boolean;
}

export interface ColumnMappingItem {
  id: string;
  sourceColumn: string;
  targetVariableCode: string; // e.g. "date_observation", "zone_sante", "pathology_code", "sexe", "age", "pluviometrie_mm", "gites_larvaires"
  targetVariableName: string;
  targetDimension: OneHealthDimension;
  targetType: 'DATE' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'GPS_LAT' | 'GPS_LNG' | 'PATHOLOGY_CODE' | 'ZONE_SANTE_CODE';
  unit?: string;
  transformation?: 'DIRECT' | 'TO_UPPERCASE' | 'PARSE_DATE' | 'SYNONYM_REPLACE' | 'NUMERIC_PARSE' | 'KEEP_MISSING_AS_NULL';
  isAutoDetected: boolean;
  confidenceScore: number; // 0.0 - 1.0
  isUserConfirmed: boolean;
  isCustomVariable?: boolean;
  customVariableDetails?: CustomVariableDefinition;
  status: 'ASSOCIE' | 'IGNORE' | 'NOUVELLE_VARIABLE' | 'CONSERVE_SOURCE' | 'AMBIGU';
}

export interface CustomVariableDefinition {
  code: string;
  name: string;
  description: string;
  type: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'DATE' | 'CATEGORICAL';
  unit?: string;
  category: string;
  pathologyConcerned?: string;
  oneHealthDimension: OneHealthDimension;
}

export interface ImportMappingConfig {
  id: string;
  rawImportId: string;
  sourceId: string;
  mappings: ColumnMappingItem[];
  unmappedColumns: string[];
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
}

export interface DetectedDuplicate {
  id: string;
  rowIndices: number[]; // e.g. [12, 45]
  keyValues: Record<string, any>;
  similarityScore: number; // 0.0 - 1.0
  resolution: DuplicateResolutionType;
  justification?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface OutlierRecord {
  rowIndex: number;
  column: string;
  value: any;
  reason: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface ImportQualityReport {
  id: string;
  rawImportId: string;
  sourceId: string;
  totalRows: number;
  totalColumns: number;
  validDatesCount: number;
  missingDatesCount: number; // Missing is NOT 0
  invalidDatesCount: number;
  outOfStudyDatesCount: number; // e.g. 2012 for a 2020-2026 study
  validGpsCount: number;
  missingGpsCount: number; // Missing GPS is NOT 0,0
  outOfBoundsGpsCount: number; // GPS coordinates outside Maniema bounding box
  duplicateRowsCount: number;
  detectedDuplicates: DetectedDuplicate[];
  outliersCount: number;
  outliers: OutlierRecord[];
  recognizedVariablesCount: number;
  unknownVariablesCount: number;
  blockingErrors: string[];
  warnings: string[];
  canImport: boolean; // True if blockingErrors.length === 0
  calculatedScore: number; // 0 - 100%
  generatedAt: string;
}

export interface DataLineageTrace {
  id: string;
  sourceId: string;
  sourceName: string;
  rawImportId: string;
  importNumber: string;
  fileName: string;
  rowIndex: number;
  originalColumn: string;
  originalValue: any;
  normalizedVariable: string;
  normalizedValue: any;
  transformationApplied: string;
  timestamp: string;
  operator: string;
}

export interface CleanedDatasetRecord {
  id: string;
  rawImportId: string;
  sourceId: string;
  sourceType: DataSourceType;
  sourceName: string;
  originalRowIndex: number;
  normalizedDate: string | null; // Null if missing, never invented
  normalizedYear: number | null;
  normalizedMonth: number | null;
  geographicLevel: GeographicLevelType;
  zoneSanteId: string | null;
  zoneSanteName: string | null;
  aireSanteId: string | null;
  aireSanteName: string | null;
  siteVillageName: string | null;
  latitude: number | null; // Null if missing, never 0.0
  longitude: number | null; // Null if missing, never 0.0
  pathologyCode: string | null;
  pathologyName: string | null;
  dataTier: 'CLEANED' | 'ANALYSIS';
  values: Record<string, any>; // Missing values are explicitly null / undefined, NEVER 0
  missingFieldCodes: string[];
  isDuplicateResolved: boolean;
  duplicateResolutionType?: DuplicateResolutionType;
  dataQualityFlag: 'VALIDE' | 'AVERTISSEMENT' | 'DONNEE_MANQUANTE_PRESERVEE';
  isDemo: boolean;
  createdAt: string;
}

export interface DataAvailabilityMatrixRow {
  variableOrPathologyId: string;
  variableName: string;
  dimension: 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'COMMUNAUTAIRE' | 'LABORATOIRE';
  category: string;
  unit?: string;
  sourceIds: string[];
  sourceNames: string[];
  yearlyStatus: Record<number, {
    status: AvailabilityStatus;
    observationsCount: number;
    coveragePercentage: number;
    sources: string[];
    isMissingNotZero: boolean;
  }>;
}

export interface SynonymMappingItem {
  id: string;
  category: 'ZONE_SANTE' | 'PATHOLOGIE' | 'AIRE_SANTE' | 'UNITE_MESURE';
  sourceVariant: string; // e.g. "Kindu", "Ville de Kindu", "ZS Kindu", "Malaria", "MAL"
  standardTarget: string; // e.g. "GEO_ZS_KINDU" or "PALUDISME"
  standardLabel: string; // e.g. "Zone de Santé de Kindu" or "Paludisme"
  confidence: number;
  isConfirmed: boolean;
}

export interface ReconciliationConfig {
  id: string;
  name: string;
  primarySourceId: string;
  secondarySourceIds: string[];
  keyType: ReconciliationKeyType;
  customKeyFields?: string[];
  toleranceDays?: number; // e.g. 0 for exact date, 30 for monthly match
  allowPartialMatches: boolean;
  synonymMappings: SynonymMappingItem[];
  isDemo: boolean;
  createdAt: string;
}

export interface ReconciledCrossDatasetRow {
  id?: string;
  reconciliationKey?: string;
  compositeKey?: string;
  dateKey?: string;
  year?: number;
  month?: number;
  periodYear?: number;
  periodMonth?: number;
  zoneSanteId: string;
  zoneSanteName: string;
  // Health Source Data
  healthRecordsCount?: number;
  pathologyCases?: Record<string, number | null>; // Missing is null, not 0
  healthIncidence?: {
    malariaCases?: number | null;
    typhoidCases?: number | null;
    choleraCases?: number | null;
    mpoxCases?: number | null;
    [key: string]: number | null | undefined;
  };
  // Climate Source Data (e.g. Rainfall, Temp, Humidity)
  rainfall_mm?: number | null; // Missing is null, not 0
  temperature_celsius?: number | null;
  humidity_percent?: number | null;
  climateFactors?: {
    monthlyRainfallMm?: number | null;
    meanTemperatureC?: number | null;
    meanHumidityPct?: number | null;
    [key: string]: any;
  };
  // Environmental Source Data (e.g. Larval sites, waste, stagnant water)
  larval_sites_positive_count?: number | null;
  waste_presence?: boolean | null; // e.g. 2022: true, 2025: false preserved
  stagnant_water_presence?: boolean | null;
  environmentalFactors?: {
    larvalSitesCount?: number | null;
    wasteDumpPresent?: boolean | null;
    dominantWaterSource?: string | null;
    [key: string]: any;
  };
  sourcesContributing?: string[];
  sourcesParticipating?: string[];
  crossCompletenessScore?: number;
  missingDataNotes?: string[];
  missingDimensionsNotes?: string[];
}

export interface V112ValidationTest {
  id: number;
  title: string;
  name?: string;
  description?: string;
  category:
    | 'REFERENTIEL_SOURCES'
    | 'IMPORTATION_EXCEL_CSV'
    | 'APERÇU_PRE_IMPORT'
    | 'MAPPING_COLONNES'
    | 'VARIABLES_NON_RECONNUES'
    | 'CREATION_VARIABLE'
    | 'NORMALISATION_PIPELINE'
    | 'RAW_IMMUABLE'
    | 'RAPPORT_QUALITE'
    | 'GESTION_DOUBLONS'
    | 'VALIDATION_DATES_GPS'
    | 'RECONCILIATION_PATHOLOGIES'
    | 'PERIODES_HETEROGENES'
    | 'MATRICE_DISPONIBILITE'
    | 'RAPPROCHEMENT_SOURCES'
    | 'NON_REGRESSION_V111';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  details: string;
  verifiedAt: string;
}

// ============================================================================
// V1.13 — DIAGNOSTIC SCIENTIFIQUE, DISPONIBILITÉ, QUALITÉ ET PRÉPARATION
// ============================================================================

/**
 * 7 Catégories fondamentales de statut de la donnée scientifique
 */
export type DataNatureStatus =
  | 'DONNEE_OBSERVEE'       // Mesure directe de terrain
  | 'DONNEE_IMPORTEE'        // Donnée issue d'un registre ou base officielle (SNIS/DHIS2/METTELSAT)
  | 'DONNEE_ESTIMEE'         // Donnée calculée / interpolée avec méthode documentée
  | 'DONNEE_PROXY'           // Donnée transposée dans le temps avec justification explicite
  | 'DONNEE_MANQUANTE'       // Donnée absente (période/cellule sans relevé - STRICTEMENT DISTINGUÉ DE ZERO)
  | 'DONNEE_INCONNUE'        // Phénomène potentiellement existant mais valeur non connue
  | 'DONNEE_NON_APPLICABLE'; // Variable sans objet pour l'observation

/**
 * Statut de disponibilité dans les matrices
 */
export type ScientificAvailabilityState =
  | 'DISPONIBLE'  // ✓
  | 'PARTIEL'     // △
  | 'INCONNU'     // ?
  | 'ABSENT';     // ✗

/**
 * Niveaux de fiabilité des sources
 */
export type SourceReliabilityLevel =
  | 'TRES_FIABLE'
  | 'FIABLE'
  | 'ACCEPTABLE'
  | 'LIMITEE'
  | 'INCONNUE';

/**
 * Système de signalisation tricolore
 */
export type TrafficLightSignal =
  | 'VERT'    // Données suffisamment disponibles / exploitables
  | 'ORANGE'  // Données utilisables avec précautions / restrictions
  | 'ROUGE';  // Données insuffisantes pour l'analyse envisagée

export type UsabilityVerdict = 'OUI' | 'NON' | 'PARTIELLEMENT';

export type TemporalPrecisionType =
  | 'JOUR'
  | 'SEMAINE'
  | 'MOIS'
  | 'TRIMESTRE'
  | 'ANNEE'
  | 'PERIODE_INDETERMINEE';

export type ConfidenceLevel = 'ELEVE' | 'MODERE' | 'FAIBLE' | 'INCONNU';

/**
 * Réponse structurée aux 10 Questions Scientifiques Fondamentales
 */
export interface ScientificQuestionAnswer {
  questionNumber: number;
  question: string;
  shortSummary: string;
  details: string[];
  metrics?: Record<string, string | number>;
  statusSignal: TrafficLightSignal;
  scientificRecommendations: string[];
}

/**
 * Profil diagnostique complet d'une variable
 */
export interface VariableDiagnosticProfile {
  id: string;
  variableCode: string;
  variableName: string;
  dimension: OneHealthDimension;
  category: string;
  unit?: string;
  sourceId: string;
  sourceName: string;
  sourceReliability: SourceReliabilityLevel;
  sourceReliabilityCriteria: string[];
  
  // Couverture temporelle
  temporalCoverage: {
    firstDateAvailable: string;
    lastDateAvailable: string;
    yearsCovered: number[];
    missingPeriods: string[];
    coverageRatePercent: number;
    precision: TemporalPrecisionType;
  };

  // Couverture géographique
  spatialCoverage: {
    coveredZonesCount: number;
    totalZonesCount: number; // 18 pour Maniema
    coveredZonesNames: string[];
    uncoveredZonesNames: string[];
    coverageRatePercent: number;
    geographicLevel: GeographicLevelType;
  };

  // Scores
  completenessScorePercent: number; // Taux de remplissage (sans préjuger de la validité)
  scientificQualityScore: number; // 0-100 (qualité, cohérence, traçabilité, précision)
  signal: TrafficLightSignal;

  // Utilisabilité analytique
  descriptiveUsability: {
    usable: 'OUI' | 'NON';
    justification: string;
    restrictions?: string;
  };
  statisticalUsability: {
    usable: UsabilityVerdict;
    justification: string;
    restrictions?: string;
  };
  spatialTemporalModelingUsability: {
    usable: UsabilityVerdict;
    justification: string;
    reasonsForExclusion?: string[];
  };

  // Risques de biais
  biasRisks: {
    hasUrbanOnlyBias: boolean;
    hasTemporalAsymmetry: boolean;
    hasDefinitionChange: boolean;
    hasGeographicRezoning: boolean;
    isPointInTimeObservation: boolean;
    warningMessages: string[];
  };

  // Décompte des statuts
  statusDistribution: {
    observedCount: number;
    importedCount: number;
    estimatedCount: number;
    proxyCount: number;
    missingCount: number;
    zeroMeasuredCount: number;
    unknownCount: number;
    notApplicableCount: number;
  };

  isDemo: boolean;
}

/**
 * Historique temporel d'un facteur environnemental (ex: Déchets 2022-2026)
 */
export interface EnvironmentalHistoricityRecord {
  id: string;
  siteId: string;
  siteName: string;
  zoneSanteId: string;
  zoneSanteName: string;
  factorCode: string; // e.g. "ZONE_DECHETS", "EAU_STAGNANTE", "CONSTRUCTION"
  factorLabel: string;
  year: number;
  exactDate?: string;
  month?: number;
  validFrom?: string;
  validTo?: string;
  isApproximateDate: boolean;
  precision: TemporalPrecisionType;
  factorState: 'OUI' | 'NON' | 'INCONNU' | 'MODIFIE';
  stateDescription: string;
  observationMethod: string;
  confidenceLevel: ConfidenceLevel;
  source: string;
  isHistoricalProxy: boolean;
  proxyJustification?: string;
  isDemo: boolean;
}

/**
 * Déclaration explicite de Proxy Historique avec justification scientifique obligatoire
 */
export interface HistoricalProxyDeclaration {
  id: string;
  variableCode: string;
  variableName: string;
  siteOrZoneId: string;
  siteOrZoneName: string;
  sourceObservationYear: number;
  targetProxyYear: number;
  sourceValue: any;
  confidenceLevel: ConfidenceLevel;
  scientificJustification: string; // OBLIGATOIRE
  declaredBy: string;
  declaredAt: string;
  status: 'VALIDE' | 'EN_REVISION' | 'REJETE';
  peerReviewNotes?: string;
}

/**
 * Changement de définition de cas épidémiologique
 */
export interface CaseDefinitionShiftAlert {
  id: string;
  pathologyCode: string;
  pathologyName: string;
  periodStart: string;
  periodEnd: string;
  formerDefinition: string; // e.g. "Cas clinique présumé sans TDR"
  newDefinition: string;    // e.g. "Cas confirmé par TDR / Goutte épaisse"
  yearOfShift: number;
  impactOnTrendAnalysis: string;
  warningNotice: string;
}

/**
 * Changement de découpage géographique
 */
export interface GeographicBoundaryShiftAlert {
  id: string;
  zoneSanteCode: string;
  zoneSanteName: string;
  yearOfShift: number;
  formerBoundaryDescription: string;
  newBoundaryDescription: string;
  affectedAiresSante: string[];
  recommendation: string;
}

/**
 * Journal des transformations des données (Audit Trail)
 */
export interface DataTransformationLogEntry {
  id: string;
  timestamp: string;
  sourceDatasetId?: string;
  originalVariable: string;
  transformationType:
    | 'AGREGATION_MENSUELLE'
    | 'IMPUTATION_NULL_STRICT'
    | 'DECLARATION_PROXY'
    | 'NORMALISATION_SYNONYME'
    | 'FILTRAGE_QUALITE'
    | 'EXCLUSION_MODELE'
    | 'CONVERSION_UNITE';
  transformationDescription: string;
  scientificJustification: string;
  resultVariable: string;
  recordsAffectedCount: number;
  performedBy: string;
}

/**
 * Configuration de Dataset Analytique Adaptatif
 */
export interface AdaptiveAnalyticalDatasetConfig {
  id: string;
  name: string;
  targetPathology: string;
  timeRange: {
    startYear: number;
    endYear: number;
  };
  includedVariables: {
    variableCode: string;
    variableName: string;
    dimension: OneHealthDimension;
    isProxyIncluded: boolean;
    coveragePct: number;
  }[];
  excludedVariables: {
    variableCode: string;
    variableName: string;
    dimension: OneHealthDimension;
    reasonForExclusion: string;
  }[];
  status: 'PRET_POUR_ANALYSE' | 'RESTRICTIONS' | 'INSUFFISANT';
  signal: TrafficLightSignal;
  totalRecordsCount: number;
  notes: string;
  createdAt: string;
}

/**
 * Modèle de Sensibilité pour comparer l'impact des données
 */
export interface SensitivityModelComparison {
  id: string;
  pathology: string;
  period: string;
  modelA_Complete: {
    name: string;
    description: string;
    variablesCount: number;
    rSquaredOrFitScore: number;
    keyFindings: string;
  };
  modelB_NoEnvironmental: {
    name: string;
    description: string;
    variablesCount: number;
    rSquaredOrFitScore: number;
    deviationFromModelA: string;
    keyFindings: string;
  };
  modelC_WithProxies: {
    name: string;
    description: string;
    variablesCount: number;
    rSquaredOrFitScore: number;
    deviationFromModelA: string;
    keyFindings: string;
  };
  scientificConclusion: string;
}

/**
 * Tests de validation et non-régression V1.13
 */
export interface V113ValidationTest {
  id: number;
  code: string;
  title: string;
  category:
    | 'DONNEES_COMPLETES'
    | 'DONNEES_PARTIELLES'
    | 'DONNEES_PONCTUELLES'
    | 'DONNEES_MANQUANTES'
    | 'VALEUR_ZERO'
    | 'VALEUR_INCONNUE'
    | 'HISTORICITE_ENV'
    | 'PROXY_HISTORIQUE'
    | 'CHANGEMENT_DEFINITION'
    | 'CHANGEMENT_GEOGRAPHIQUE'
    | 'NON_REGRESSION_V1_V12';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  expectedBehavior: string;
  actualResult: string;
  verifiedAt: string;
}

/**
 * ============================================================================
 * V1.14 — LABORATOIRE D’ANALYSE SCIENTIFIQUE ET DATASET ANALYTIQUE
 * ============================================================================
 */

export type LabSubMenu =
  | 'NOUVELLE_ANALYSE'
  | 'MES_DONNEES'
  | 'DATASET_ANALYTIQUE'
  | 'ANALYSE_DESCRIPTIVE'
  | 'ANALYSE_TEMPORELLE'
  | 'ANALYSE_SPATIALE'
  | 'ANALYSE_ASSOCIATIONS'
  | 'LAGS'
  | 'COMPARAISON_ZONES'
  | 'ONE_HEALTH_INTEGREE'
  | 'SENSIBILITE_DATASETS'
  | 'RAPPORTS'
  | 'HISTORIQUE_ANALYSES'
  | 'SUITE_TESTS_V114';

export type AnalysisStatus =
  | 'BROUILLON'
  | 'DATASET_GENERE'
  | 'EN_COURS_ANALYSE'
  | 'FINALISE'
  | 'ARCHIVE';

export type FeasibilitySignal = 'VERT' | 'ORANGE' | 'ROUGE';

export interface AnalysisVariableSelection {
  code: string;
  name: string;
  dimension: OneHealthDimension;
  sourceCategory: 'SANITAIRE' | 'CLIMATIQUE' | 'ENVIRONNEMENTALE' | 'EAU_ASSAINISSEMENT' | 'SOCIO_DEMO';
  sourceName: string;
  temporalCoveragePct: number;
  spatialCoveragePct: number;
  missingDataPct: number;
  isProxy: boolean;
  proxyDetails?: {
    originalYear: number;
    targetYear: number;
    justification: string;
    confidence: 'ELEVE' | 'MOYEN' | 'FAIBLE';
  };
  isExcluded: boolean;
  exclusionReason?: string;
}

export interface AnalysisTransformationItem {
  id: string;
  type:
    | 'TEMPORAL_AGGREGATION'
    | 'INCIDENCE_CALCULATION'
    | 'LOG_TRANSFORM'
    | 'STANDARDIZATION'
    | 'NORMALIZATION'
    | 'RATIO_CALCULATION';
  title: string;
  description: string;
  formulaText: string;
  parameters: Record<string, any>;
  appliedAt: string;
  appliedBy: string;
}

export interface AnalysisFeasibilityReport {
  pathologyText: string;
  periodText: string;
  zonesCount: number;
  observationsEstimatedCount: number;
  variablesCount: number;
  globalCompletenessPct: number;
  qualityLevel: 'Excellente' | 'Bonne' | 'Modérée' | 'Faible' | 'Critique';
  variablesWithRestrictionsCount: number;
  criticalIssuesCount: number;
  criticalIssuesList: string[];
  modelingReadinessScore: 'BONNE' | 'MODEREE' | 'INSUFFISANTE';
  statusSignal: FeasibilitySignal;
  statusLabel: 'ANALYSE POSSIBLE' | 'ANALYSE POSSIBLE AVEC PRÉCAUTIONS' | 'DONNÉES INSUFFISANTES';
  generatedAt: string;
}

export interface AnalysisDatasetRecord {
  recordId: string;
  analysisId: string;
  dateStr: string; // YYYY-MM or YYYY-MM-DD
  year: number;
  month?: number;
  week?: number;
  zoneId: string;
  zoneName: string;
  healthAreaId?: string;
  healthAreaName?: string;
  pathology: string; // e.g. "PALUDISME", "TYPHOIDE"
  
  // Numerical & categorical values
  newCases: number;
  populationAtRisk?: number;
  incidencePer100k?: number | null;
  incidencePer10k?: number | null;
  incidencePer1k?: number | null;
  hospitalizations?: number;
  deaths?: number;
  ageMean?: number;
  sexRatioMtoF?: number;
  
  rainfallMm?: number | null;
  temperatureC?: number | null;
  humidityPct?: number | null;
  
  wasteDumpPresent?: boolean | null;
  standingWaterPoints?: number | null;
  floodingOccurred?: boolean | null;
  vegetationIndexNdvi?: number | null;
  
  protectedWaterAccessPct?: number | null;
  adequateLatrinesPct?: number | null;
  handwashingStationPct?: number | null;
  
  householdDensityKm2?: number | null;
  
  // Meta data
  dataSource: string;
  qualityScore: number;
  dataStatus: ScientificDataStatus; // PRESENTE, MANQUANTE_NULL, ZERO_MESURE, PROXY, etc.
  isProxy: boolean;
  proxyNote?: string;
}

export interface DescriptiveStatsSummary {
  variableCode: string;
  variableName: string;
  dimension: OneHealthDimension;
  countNonMissing: number;
  countMissing: number;
  missingPercentage: number;
  
  // For numeric variables
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  stdDev?: number;
  q1?: number;
  q3?: number;
  
  // For categorical
  categories?: { category: string; count: number; percentage: number }[];
}

export interface CorrelationAnalysisPair {
  varXCode: string;
  varXName: string;
  varYCode: string;
  varYName: string;
  pearsonR: number;
  pearsonPValue: number;
  spearmanRho: number;
  spearmanPValue: number;
  sampleSizeN: number;
  interpretationText: string;
  isSignificant: boolean;
}

export interface LagAnalysisResult {
  climaticVar: string;
  diseaseVar: string;
  lags: {
    lagMonths: number;
    correlationR: number;
    pValue: number;
    sampleSizeN: number;
    interpretation: string;
  }[];
  optimalLagMonths: number;
  summaryNote: string;
}

export interface ScientificAnalysisProject {
  id: string;
  code: string; // e.g. "ANALYSIS_DATASET_2026_001"
  name: string; // e.g. "Paludisme à Kindu — 2020–2026"
  description: string;
  targetPathologies: ('PALUDISME' | 'FIEVRE_TYPHOIDE' | 'AUTRE')[];
  isMultiPathology: boolean;
  timeRange: {
    startYear: number;
    endYear: number;
    temporalResolution: 'JOUR' | 'SEMAINE' | 'MOIS' | 'TRIMESTRE' | 'ANNEE';
  };
  geographicScope: {
    level: GeographicLevel;
    selectedZones: string[]; // IDs of health zones / areas
    selectedZoneNames: string[];
  };
  selectedSources: string[];
  selectedVariables: AnalysisVariableSelection[];
  excludedVariables: {
    code: string;
    name: string;
    dimension: OneHealthDimension;
    reason: string;
  }[];
  feasibilityReport: AnalysisFeasibilityReport;
  transformations: AnalysisTransformationItem[];
  datasetMetadata: {
    datasetName: string;
    totalRows: number;
    columnsCount: number;
    createdAt: string;
    lastCalculatedAt: string;
    isCleanedIntact: boolean;
    isRawIntact: boolean;
  };
  createdAt: string;
  updatedAt: string;
  author: string;
  status: AnalysisStatus;
  isDemoData: boolean;
  
  // Statistical results cached
  descriptiveStats?: DescriptiveStatsSummary[];
  correlations?: CorrelationAnalysisPair[];
  lagResults?: LagAnalysisResult[];
  
  // Auto-generated 17-section report content
  reportDocument?: ScientificAnalysisReportDocument;
}

export interface ScientificAnalysisReportDocument {
  id: string;
  analysisId: string;
  analysisTitle: string;
  author: string;
  generatedDate: string;
  isDraft: boolean;
  sections: {
    sectionNum: number;
    title: string;
    content: string;
    dataHighlights?: { label: string; value: string | number }[];
  }[];
  scientificCaveat: string;
}

export interface V114ValidationScenarioTest {
  id: number;
  code: string;
  title: string;
  description: string;
  category:
    | 'TEST_1_PALUDISME'
    | 'TEST_2_TYPHOIDE'
    | 'TEST_3_HISTORICITE_ENV'
    | 'TEST_4_DONNEE_MANQUANTE'
    | 'TEST_5_PROXY_JUSTIFIE'
    | 'TEST_6_DONNEES_INSUFFISANTES'
    | 'TEST_7_MULTI_PATHOLOGIES'
    | 'TEST_8_REPRODUCTIBILITE'
    | 'NON_REGRESSION_V1_V13';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  testSteps: string[];
  expectedOutput: string;
  actualOutput: string;
  lastRunDate: string;
}

// ==========================================
// V1.15 — MOTEUR DE MODÉLISATION STATISTIQUE & SPATIO-TEMPORELLE
// ==========================================

export type ModelingSubTab =
  | 'NOUVELLE_MODELISATION'
  | 'MODELES_STATISTIQUES'
  | 'MODELES_SPATIO_TEMPORELS'
  | 'VARIABLES_ET_DIAGNOSTIC'
  | 'DIAGNOSTICS_COMPLETS'
  | 'COMPARAISON_MODELES'
  | 'PREDICTIONS'
  | 'CARTOGRAPHIE_RISQUE'
  | 'RISQUE_INTEGRE_ET_SENSIBILITE'
  | 'HISTORIQUE_ET_REPRODUCTIBILITE'
  | 'RAPPORTS_AUTOMATISES'
  | 'SUITE_TESTS_V115';

export type StatisticalModelType =
  | 'POISSON'
  | 'NEGATIVE_BINOMIAL'
  | 'LOGISTIC'
  | 'SPATIO_TEMPORAL_FIXED'
  | 'SPATIO_TEMPORAL_RANDOM'
  | 'MIXED_HIERARCHICAL';

export type DependentVariableType =
  | 'COUNT_CASES'
  | 'INCIDENCE_RATE'
  | 'BINARY_PRESENCE'
  | 'MORTALITY_COUNT'
  | 'HOSPITALIZATIONS_COUNT';

export type OffsetOption = 'POPULATION' | 'NONE' | 'SURFACE_AREA' | 'CUSTOM_EXPOSURE';

export type SpatialEffectType = 'NONE' | 'ZONE_FIXED' | 'ZONE_RANDOM';
export type TemporalEffectType = 'NONE' | 'YEAR_FIXED' | 'MONTH_FIXED' | 'LINEAR_TREND' | 'SEASONAL_HARMONIC';

export interface ModelCovariateSelection {
  code: string;
  name: string;
  dimension: OneHealthDimension;
  type: 'NUMERICAL' | 'CATEGORICAL_BINARY' | 'CATEGORICAL_NOMINAL' | 'CATEGORICAL_ORDINAL';
  unit: string;
  source: string;
  temporalCoveragePct: number;
  qualityLevel: string;
  status: ScientificDataStatus;
  isProxy: boolean;
  proxyNote?: string;
  isLagged: boolean;
  lagMonths: number; // 0, 1, 2, 3, 4
  referenceCategory?: string;
  vifValue?: number;
  vifInterpretation?: 'COLINEARITE_FAIBLE' | 'COLINEARITE_MODEREE' | 'COLINEARITE_ELEVEE';
  isExcludedFromFit?: boolean;
  exclusionReason?: string;
}

export interface ModelInteractionTerm {
  id: string;
  var1Code: string;
  var1Name: string;
  var2Code: string;
  var2Name: string;
  label: string;
}

export interface SpatioTemporalEffectsConfig {
  spatialUnit: string; // e.g. "Zone × Mois"
  spatialEffect: SpatialEffectType;
  temporalEffect: TemporalEffectType;
  hierarchicalStructure?: 'MANIEMA_TO_ZS' | 'ZS_TO_AS' | 'AS_TO_QUARTIER';
  includeSeasonalHarmonic: boolean;
  includeLinearTrend: boolean;
}

export interface PreModelingCheckResult {
  isBlocked: boolean;
  statusSignal: 'VERT' | 'ORANGE' | 'ROUGE';
  statusLabel: 'MODELISATION_AUTORISEE' | 'MODELISATION_AVEC_PRECAUTIONS' | 'MODELISATION_BLOQUEE';
  sampleSizeTotal: number;
  sampleSizeValid: number;
  excludedCount: number;
  missingDataPct: number;
  temporalSpanYears: number;
  spatialZonesCount: number;
  blockingReasons: string[];
  warnings: string[];
  zeroVarianceVariables: string[];
  highMissingVariables: string[];
  proxyCount: number;
  checkedAt: string;
}

export interface ModelCoefficientResult {
  variableCode: string;
  variableName: string;
  categoryModalite?: string;
  coefficient: number;
  standardError: number;
  zValue: number;
  pValue: number;
  ciLower95: number;
  ciUpper95: number;
  expCoeff?: number; // Rate Ratio (IRR) or Odds Ratio (OR)
  expCiLower95?: number;
  expCiUpper95?: number;
  isSignificant: boolean;
  interpretationText: string;
}

export interface ModelDiagnosticsSummary {
  convergenceReached: boolean;
  iterationsCount: number;
  totalObsInitial: number;
  totalObsUsed: number;
  totalObsExcluded: number;
  exclusionBreakdown: { reason: string; count: number }[];
  aic: number;
  bic: number;
  logLikelihood: number;
  deviance: number;
  dfResiduals: number;
  dispersionRatio: number; // Pearson Chi2 / df
  hasOverdispersion: boolean;
  suggestedAlternativeModel?: string;
  moranSpatialIndexI?: number;
  moranPValue?: number;
  moranInterpretation?: string;
  temporalAutocorrelationAr1?: number;
  temporalAr1PValue?: number;
  temporalAr1Warning?: string;
  influentialObservations: {
    recordId: string;
    zoneName: string;
    dateStr: string;
    cooksDistance: number;
    leverageHii: number;
    standardizedResidual: number;
    isInfluential: boolean;
    scientificNote: string;
  }[];
  residualsDistribution: {
    min: number;
    q1: number;
    median: number;
    mean: number;
    q3: number;
    max: number;
    stdDev: number;
  };
}

export interface SpatialRiskPredictionZone {
  zoneId: string;
  zoneName: string;
  period: string;
  year: number;
  month?: number;
  observedCases?: number;
  predictedCases: number;
  predictedIncidencePer100k: number;
  ciLowerIncidence: number;
  ciUpperIncidence: number;
  relativeRiskRR: number;
  riskLevelClass: 'TRES_FAIBLE' | 'FAIBLE' | 'MODERE' | 'ELEVE' | 'TRES_ELEVE';
  uncertaintyMargin: number; // CI upper - CI lower
  uncertaintyLevel: 'FAIBLE' | 'MODEREE' | 'ELEVEE';
  isHistoricProxy: boolean;
  proxyLabel?: string;
  dataSourceStatus: ScientificDataStatus;
  environmentalFactorsSummary?: string;
}

export interface SensitivityAnalysisComparison {
  fullModelTitle: string;
  restrictedModelTitle: string;
  noProxyModelTitle: string;
  metrics: {
    modelType: string;
    aic: number;
    bic: number;
    logLik: number;
    sampleSize: number;
    dispersion: number;
  }[];
  coefficientsComparison: {
    variable: string;
    fullBeta: number;
    fullPVal: number;
    restrictedBeta: number;
    restrictedPVal: number;
    noProxyBeta: number;
    noProxyPVal: number;
    stabilityNote: string;
  }[];
  conclusionNote: string;
}

export interface OneHealthIntegratedIndex {
  indexName: string;
  formulaDescription: string;
  weights: { dimension: OneHealthDimension; variableCode: string; weight: number; standardizedMethod: string }[];
  scoresByZone: {
    zoneId: string;
    zoneName: string;
    period: string;
    integratedRiskScore: number; // 0 - 100
    healthComponent: number;
    climaticComponent: number;
    environmentalComponent: number;
    washComponent: number;
    riskTier: 'TRES_FAIBLE' | 'FAIBLE' | 'MODERE' | 'ELEVE' | 'TRES_ELEVE';
    uncertaintyScore: number;
  }[];
  methodJustification: string;
}

export interface ScientificModelingProject {
  id: string;
  code: string; // e.g. "MODEL_2026_001"
  title: string;
  researchHypothesis: string;
  sourceDatasetId: string; // Reference to ANALYSIS_DATASET_XXXX
  sourceDatasetCode: string;
  sourceDatasetName: string;
  pathology: 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE' | 'AUTRE';
  targetPathologiesList: string[];
  timeRange: {
    startYear: number;
    endYear: number;
    temporalResolution: 'JOUR' | 'SEMAINE' | 'MOIS' | 'TRIMESTRE' | 'ANNEE';
  };
  geographicScope: {
    level: GeographicLevel;
    selectedZones: string[];
    selectedZoneNames: string[];
  };
  dependentVariable: DependentVariableType;
  dependentVariableName: string;
  dependentVariableColumn: string;
  modelType: StatisticalModelType;
  offsetOption: OffsetOption;
  offsetColumnName?: string;
  selectedCovariates: ModelCovariateSelection[];
  interactionTerms: ModelInteractionTerm[];
  spatioTemporalConfig: SpatioTemporalEffectsConfig;
  evaluationMethod: 'INTERNAL_RESIDUALS' | 'TRAIN_TEST_SPLIT' | 'TEMPORAL_BLOCK_SPLIT' | 'SPATIAL_LEAVE_ONE_OUT';
  
  preFlightCheck: PreModelingCheckResult;
  coefficients: ModelCoefficientResult[];
  diagnostics: ModelDiagnosticsSummary;
  predictions: SpatialRiskPredictionZone[];
  correlationMatrix?: {
    variables: string[];
    matrix: { varX: string; varY: string; r: number; pValue: number }[];
  };
  sensitivityAnalysis?: SensitivityAnalysisComparison;
  integratedOneHealthIndex?: OneHealthIntegratedIndex;
  
  mathematicalFormula: string;
  scientificCaveat: string; // "Association statistique ≠ Causalité"
  scientistAdequationNotes: string;
  isDemonstrationData: boolean;
  rCodeEquivalent: string;
  pythonCodeEquivalent: string;
  status: 'ESTIME' | 'EN_COURS' | 'BROUILLON' | 'BLOQUE';
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface AutomatedModelingReportDocument {
  id: string;
  modelId: string;
  modelCode: string;
  modelTitle: string;
  author: string;
  generatedDate: string;
  sections: {
    sectionNum: number;
    title: string;
    content: string;
    bulletPoints?: string[];
    tableData?: { headers: string[]; rows: (string | number)[][] };
    caveatBox?: string;
  }[];
  formalScientificCaveat: string;
  cautiousConclusionText: string;
}

export interface V115ValidationScenarioTest {
  id: number;
  code: string;
  title: string;
  category:
    | 'TEST_POISSON'
    | 'TEST_BINOMIAL_NEGATIF'
    | 'TEST_LOGISTIQUE'
    | 'TEST_SPATIO_TEMPOREL'
    | 'TEST_LAG'
    | 'TEST_HISTORIQUE_ENV'
    | 'TEST_PROXY'
    | 'TEST_DONNEES_MANQUANTES'
    | 'TEST_MULTICOLINEARITE'
    | 'TEST_CARTOGRAPHIE'
    | 'TEST_REPRODUCTIBILITE'
    | 'TEST_NON_REGRESSION_V1_V14';
  description: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  testSteps: string[];
  expectedOutput: string;
  actualOutput: string;
  lastRunDate: string;
}

// ==========================================
// V1.16 — TYPES VALIDATION SCIENTIFIQUE, ROBUSTESSE & FIABILITÉ
// ==========================================

export type ValidationSubTab =
  | 'VUE_ENSEMBLE'
  | 'VALIDATION_MODELE'
  | 'VALIDATION_TEMPORELLE'
  | 'VALIDATION_SPATIALE'
  | 'VALIDATION_CROISEE'
  | 'CALIBRATION'
  | 'METRIQUES'
  | 'PERFORMANCE'
  | 'RESIDUS'
  | 'ROBUSTESSE'
  | 'SENSIBILITE'
  | 'INCERTITUDE'
  | 'VALIDATION_CARTES'
  | 'RAPPORT_20_SECTIONS'
  | 'RAPPORT_VALIDATION'
  | 'REPRODUCTIBILITE'
  | 'HISTORIQUE_VALIDATION'
  | 'BANC_DE_TESTS'
  | 'SUITE_TESTS_V116';

export type ValidationSubTabId = ValidationSubTab;

export type ValidationMethodType =
  | 'TIME_SPLIT'
  | 'ROLLING_WALK_FORWARD'
  | 'SPATIAL_HOLD_OUT'
  | 'SPATIO_TEMPORAL_SPLIT'
  | 'K_FOLD_CROSS_VALIDATION'
  | 'STRATIFIED_K_FOLD'
  | 'LEAVE_ONE_OUT'
  | 'BOOTSTRAP_RESAMPLING';

export type PreValidationStatus = 'POSSIBLE' | 'LIMITEE' | 'IMPOSSIBLE';

export interface PreValidationCheckResult {
  status: PreValidationStatus;
  canProceed: boolean;
  totalObservations: number;
  totalHealthZones: number;
  totalPeriods: number;
  missingValuesPct: number;
  outliersDetectedCount: number;
  proxiesCount: number;
  temporalCoveragePct: number;
  spatialCoveragePct: number;
  datasetStructureStatus: 'COHERENT' | 'IRREGULIER' | 'FRAGMENTE';
  justifications: string[];
  epistemicWarnings: string[];
}

export type DataLeakageAuditStatus = 'CLEAR' | 'WARNING' | 'BLOCKED';

export interface DataLeakageAuditItem {
  id: string;
  riskType: 'TARGET_DERIVATIVE' | 'FUTURE_DATA_LEAK' | 'TEST_SET_AGGREGATION' | 'TEST_SET_STANDARDIZATION' | 'PROXY_INDIRECT_LEAK';
  title: string;
  detected: boolean;
  severity: 'CRITIQUE' | 'AVERTISSEMENT' | 'CONFORME';
  details: string;
  remedyAction: string;
}

export interface DataLeakageAuditResult {
  overallStatus: DataLeakageAuditStatus;
  isValidationBlocked: boolean;
  items: DataLeakageAuditItem[];
  auditSummary: string;
}

export interface ContinuousMetrics {
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Squared Error
  mse: number; // Mean Squared Error
  r2: number; // Coefficient de détermination
  deviance: number;
  logLikelihood: number;
  aic: number;
  bic: number;
  dispersionRatio: number;
}

export interface ClassificationMetrics {
  accuracy: number;
  sensitivity: number; // Recall
  specificity: number;
  precision: number;
  f1Score: number;
  aucRoc: number;
  hasImbalance: boolean;
  imbalanceRatioText: string;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
}

export interface TimeSplitValidationResult {
  trainPeriodLabel: string; // e.g. "2020-2024"
  testPeriodLabel: string; // e.g. "2025-2026"
  trainObsCount: number;
  testObsCount: number;
  trainMetrics: ContinuousMetrics;
  testMetrics: ContinuousMetrics;
  overfittingGapPercentage: number; // e.g. 14.8%
  overfittingRiskTier: 'FAIBLE' | 'MODERE' | 'ELEVE';
  overfittingInterpretation: string;
  futureLeakagePrevented: boolean;
}

export interface RollingFoldResult {
  foldNumber: number;
  trainPeriod: string;
  testPeriod: string;
  trainObs: number;
  testObs: number;
  trainMse: number;
  testMse: number;
  testMae: number;
  testR2: number;
  driftStatus: 'STABLE' | 'DEGRADATION_LEGERE' | 'RUPTURE_STRUCTURELLE';
}

export interface RollingTimeValidationResult {
  folds: RollingFoldResult[];
  averageTestMae: number;
  averageTestR2: number;
  driftSummary: string;
}

export interface SpatialHoldOutResult {
  trainZoneIds: string[];
  trainZoneNames: string[];
  testZoneIds: string[];
  testZoneNames: string[];
  trainObsCount: number;
  testObsCount: number;
  trainMetrics: ContinuousMetrics;
  testMetrics: ContinuousMetrics;
  moranIOnTestResiduals: number;
  moranPValue: number;
  spatialLeakagePrevented: boolean;
  spatialGeneralizationNote: string;
}

export interface CrossValidationFold {
  foldIndex: number;
  trainSize: number;
  valSize: number;
  valMae: number;
  valRmse: number;
  valR2: number;
  valAic: number;
}

export interface CrossValidationResult {
  method: ValidationMethodType;
  kFolds: number;
  folds: CrossValidationFold[];
  meanMae: number;
  stdMae: number;
  meanR2: number;
  stdR2: number;
  spatioTemporalDependenceAdvisory: string;
}

export interface CalibrationBin {
  decile: number;
  predictedRiskMean: number;
  observedRiskMean: number;
  sampleCount: number;
  residualGap: number;
}

export interface CalibrationAnalysis {
  bins: CalibrationBin[];
  calibrationSlope: number; // idéal = 1.0
  calibrationIntercept: number; // idéal = 0.0
  brierScore: number; // pour classification / probabilités
  ece: number; // Expected Calibration Error
  calibrationQuality: 'EXCELLENTE' | 'ACCEPTABLE' | 'SOUS_CALIBREE' | 'SUR_CALIBREE';
  interpretationNote: string;
}

export interface ResidualPoint {
  id: string;
  zoneId: string;
  zoneName: string;
  period: string;
  observed: number;
  predicted: number;
  residual: number; // Obs - Pred
  standardizedResidual: number;
  cooksDistance: number;
  tier: 'SURESTIME' | 'CONFORME' | 'SOUS_ESTIME';
}

export interface ResidualsAnalysis {
  points: ResidualPoint[];
  distribution: {
    mean: number;
    stdDev: number;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
  };
  temporalTrend: { period: string; avgResidual: number; count: number }[];
  spatialClustersCount: number;
  extremeResidualsCount: number;
}

export interface RobustnessScenarioResult {
  scenarioCode: string;
  title: string;
  description: string;
  sampleSize: number;
  keyCoefficients: {
    variable: string;
    beta: number;
    ci95Lower: number;
    ci95Upper: number;
    pValue: number;
    signFlipped: boolean;
  }[];
  aic: number;
  bic: number;
  r2: number;
  stabilityStatus: 'STABLE' | 'SENSIBLE_AUX_HYPOTHESES' | 'RUPTURE_DE_SIGNE';
}

export interface RobustnessAnalysis {
  scenarios: RobustnessScenarioResult[];
  signFlipAlerts: {
    variable: string;
    fromScenario: string;
    toScenario: string;
    oldBeta: number;
    newBeta: number;
    message: string;
  }[];
  overallStabilityAssessment: 'RESULTATS_STABLES' | 'RESULTATS_SENSIBLES_AUX_HYPOTHESES';
  scientificNote: string;
}

export interface LagSensitivityEntry {
  lagMonths: number;
  betaValue: number;
  ciLower: number;
  ciUpper: number;
  pValue: number;
  aic: number;
  obsCount: number;
  biologicalPlausibilityNote: string;
  isStatisticallyPreferred: boolean;
}

export interface SpatialReliabilityZone {
  zoneId: string;
  zoneName: string;
  type: string;
  obsCount: number;
  dataQualityRating: 'A' | 'B' | 'C';
  coveragePct: number;
  uncertaintyMargin: number;
  localMae: number;
  isProxy: boolean;
  proxyHistoricalNote?: string;
  reliabilityTier: 'FIABILITE_ELEVEE' | 'FIABILITE_INTERMEDIAIRE' | 'FIABILITE_FAIBLE';
  reliabilityScore: number; // 0-100
  scoringCriteria: string[];
}

export interface ValidatedRiskMapZone {
  zoneId: string;
  zoneName: string;
  lat: number;
  lng: number;
  
  // SÉPARATION STRICTE
  sanitaryRiskTier: 'TRES_FAIBLE' | 'FAIBLE' | 'MODERE' | 'ELEVE' | 'TRES_ELEVE';
  estimationReliabilityTier: 'FIABILITE_ELEVEE' | 'FIABILITE_INTERMEDIAIRE' | 'FIABILITE_FAIBLE';
  
  predictedIncidence: number;
  confidenceInterval95: [number, number];
  predictionInterval95: [number, number];
  uncertaintyMargin: number;
  
  observedIncidence?: number;
  estimationError: 'CONFORME' | 'SURESTIME' | 'SOUS_ESTIME';
  residualGap?: number;
  
  historicalYear: number;
  environmentalStateText: string;
  isProxyHistorical: boolean;
  proxyHistoricalLabel?: string;
}

export interface DecomposedRobustnessScore {
  overallScore: number; // 0-100
  tier: 'ROBUSTE' | 'MODERE' | 'FAIBLE';
  components: {
    name: string;
    weightPct: number;
    score: number; // 0-100
    details: string;
  }[];
  transparencyJustification: string;
}

export interface DecomposedConfidenceScore {
  overallConfidence: number; // 0-100
  confidenceTier: 'CONFIANCE_HAUTE' | 'CONFIANCE_MOYENNE' | 'CONFIANCE_REDUITE';
  isDistinctFromSanitaryRisk: boolean;
  criteriaBreakdown: {
    criterion: string;
    score: number;
    description: string;
  }[];
  cautiousAdvisory: string;
}

export interface AutomatedValidationReportDocument {
  id: string;
  validationId: string;
  validationCode: string;
  modelCode: string;
  modelTitle: string;
  pathology: string;
  datasetName: string;
  author: string;
  generatedDate: string;
  sections: {
    sectionNum: number;
    title: string;
    content: string;
    bulletPoints?: string[];
    tableData?: { headers: string[]; rows: (string | number)[][] };
    caveatBox?: string;
  }[];
  causalityDistinctionNotice: string;
  cautiousConclusion: string;
}

export interface ScientificValidationProject {
  id: string;
  code: string; // e.g. "VAL_2026_001"
  title: string;
  modelId: string;
  modelCode: string;
  modelTitle: string;
  datasetId: string;
  datasetName: string;
  pathology: 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE' | 'AUTRE';
  targetPathologiesList: string[];
  territory: string;
  periodRange: string;
  primaryMethod: ValidationMethodType;
  
  preValidationCheck: PreValidationCheckResult;
  dataLeakageAudit: DataLeakageAuditResult;
  
  timeSplitResult?: TimeSplitValidationResult;
  rollingTimeResult?: RollingTimeValidationResult;
  spatialValidationResult?: SpatialHoldOutResult;
  crossValidationResult?: CrossValidationResult;
  
  calibration: CalibrationAnalysis;
  residuals: ResidualsAnalysis;
  robustness: RobustnessAnalysis;
  lagsSensitivity: LagSensitivityEntry[];
  
  spatialReliabilityZones: SpatialReliabilityZone[];
  validatedMapZones: ValidatedRiskMapZone[];
  
  decomposedRobustnessScore: DecomposedRobustnessScore;
  decomposedConfidenceScore: DecomposedConfidenceScore;
  
  reportDocument: AutomatedValidationReportDocument;
  
  rValidationScript: string;
  pythonValidationScript: string;
  
  status: 'VALIDE' | 'VALIDATION_PARTIELLE' | 'BLOQUE' | 'EN_COURS';
  validatedAt: string;
  validatorName: string;
  isDemonstrationData: boolean;
}

export interface V116ValidationScenarioTest {
  id: number;
  code: string;
  title: string;
  category:
    | 'TEST_SURAPPRENTISSAGE'
    | 'TEST_FUITE_INFORMATION'
    | 'TEST_VALIDATION_TEMPORELLE'
    | 'TEST_VALIDATION_SPATIALE'
    | 'TEST_CALIBRATION'
    | 'TEST_INCERTITUDE_INTERVALLES'
    | 'TEST_ROBUSTESSE_SCENARIOS'
    | 'TEST_HISTORICITE_ENV'
    | 'TEST_MULTI_PATHOLOGIES'
    | 'TEST_SEPARATION_RISQUE_FIABILITE'
    | 'TEST_REPRODUCTIBILITE_SCRIPTS'
    | 'TEST_NON_REGRESSION_V1_V15';
  description: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  testSteps: string[];
  expectedOutput: string;
  actualOutput: string;
  lastRunDate: string;
}

// ============================================================================
// V1.17 — SYSTÈME DE SURVEILLANCE ONE HEALTH & DÉTECTION DES SIGNAUX D'ALERTE
// ============================================================================

export type SurveillanceSubTabId =
  | 'TABLEAU_BORD'
  | 'SURVEILLANCE_SANITAIRE'
  | 'SURVEILLANCE_CLIMATIQUE'
  | 'SURVEILLANCE_ENVIRONNEMENTALE'
  | 'SURVEILLANCE_WASH'
  | 'SIGNAUX'
  | 'ALERTES'
  | 'CARTOGRAPHIE'
  | 'TENDANCES'
  | 'HISTORIQUE'
  | 'RAPPORTS'
  | 'BANC_TESTS_V117';

export type SurveillanceSignalLevel =
  | 'NORMAL'           // 🟢 Normal
  | 'VIGILANCE'        // 🟡 Vigilance
  | 'SIGNAL_IMPORTANT' // 🟠 Signal important
  | 'SIGNAL_CRITIQUE'; // 🔴 Signal critique

export type SurveillanceAlertLevel =
  | 'NIVEAU_0_NORMAL'    // Niveau 0 - Normal
  | 'NIVEAU_1_VIGILANCE' // Niveau 1 - Vigilance
  | 'NIVEAU_2_ALERTE'    // Niveau 2 - Alerte
  | 'NIVEAU_3_MAJEURE';  // Niveau 3 - Alerte majeure

export type SurveillanceAlertStatus =
  | 'NOUVELLE'
  | 'EN_VERIFICATION'
  | 'CONFIRMEE'
  | 'REJETEE'
  | 'CLOTUREE';

export type ExpectedLevelMethod =
  | 'MOYENNE_HISTORIQUE'
  | 'TENDANCE_LINEAIRE'
  | 'MEDIANE_SAISONNIERE'
  | 'MODELE_GLM_NB_VALIDE_V116'
  | 'SERIE_TEMPORELLE_ARIMA';

export type SignalVerificationAction =
  | 'CONFIRMER'
  | 'REJETER'
  | 'METTRE_EN_OBSERVATION'
  | 'DEMANDER_DONNEES_SUPPLEMENTAIRES';

export type UserSurveillanceRole =
  | 'ADMINISTRATEUR' // Configuration, seuils, modèles
  | 'CHERCHEUR'      // Analyse, modélisation
  | 'SUPERVISEUR'    // Vérification & validation des alertes
  | 'COLLECTEUR'     // Saisie & transmission des données
  | 'OBSERVATEUR'    // Consultation seule
  | 'ANALYSTE'
  | 'LECTEUR';

export interface SurveillanceDataQualityAudit {
  completenessRate: number; // 0 à 100%
  transmissionDelayDays: number; // ex: 5 jours (J+5)
  delayedFacilitiesCount: number;
  hasOutliers: boolean;
  definitionChanged: boolean;
  definitionChangeNote?: string;
  coverageExpanded: boolean;
  coverageExpansionNote?: string;
  isProxyData: boolean;
  proxyWarningNote?: string;
  historicalYearsAvailable: number;
  isHistoricalReferenceLimited: boolean;
}

export interface SurveillanceSignal {
  id: string;
  code: string; // ex: "SIG-2026-084"
  pathology: 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE' | 'CHOLERA' | 'AUTRE';
  pathologyName: string;
  healthZone: string; // ex: "Kasuku", "Mikelenge", "Alunguli"
  healthArea: string;
  period: string; // ex: "2026-S34 (Août 2026)"
  dateIso: string;
  indicator: string; // ex: "Incidence hebdomadaire (/1000 hab)"
  unit: string;
  observedValue: number;
  expectedValue: number;
  differenceValue: number;
  differencePercent: number; // ex: +42.5%
  thresholdApplied: number;
  thresholdDescription: string;
  method: ExpectedLevelMethod;
  level: SurveillanceSignalLevel;
  confidenceScore: number; // 0 à 100%
  confidenceRating: 'ELEVEE' | 'INTERMEDIAIRE' | 'FAIBLE_LIMITEE';
  dataQuality: SurveillanceDataQualityAudit;
  status: 'ACTIF' | 'EN_EVALUATION' | 'CONVERTI_EN_ALERTE' | 'CLASSE_SANS_SUITE';
  persistence: {
    firstDetectedPeriod: string;
    consecutivePeriodsCount: number;
    isPersistent: boolean;
    trend: 'HAUSSE' | 'STABLE' | 'BAISSE';
  };
  spatialExtension: {
    isCluster: boolean;
    neighboringZonesAffected: string[];
    isSpatialSpread: boolean;
  };
  oneHealthDrivers: {
    rainfallAnomalyMm: number;
    temperatureAnomalyC: number;
    relativeHumidityAnomaly: number;
    stagnantWaterRiskIndex: number;
    unmanagedWasteSites: number;
    washAccessDeficitPercent: number;
    appliedLagMonths: number;
    lagAssociationDescription: string;
  };
  isDemonstrationData: boolean;
}

export interface SurveillanceAlert {
  id: string;
  code: string; // ex: "ALT-2026-012"
  title: string;
  pathology: 'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE' | 'AUTRE';
  pathologyName: string;
  healthZone: string;
  healthAreas: string[];
  triggerDate: string;
  period: string;
  level: SurveillanceAlertLevel;
  status: SurveillanceAlertStatus;
  triggerSignalIds: string[];
  multiCriteriaRule: {
    ruleName: string;
    caseIncreaseConfirmed: boolean;
    deviationOverExpectedPercent: number;
    persistenceWeeks: number;
    spatialZonesCount: number;
    climaticFactorTriggered: boolean;
    environmentalFactorTriggered: boolean;
    dataQualitySufficient: boolean;
    ruleSummary: string;
  };
  confidenceScore: number;
  predictedRiskScore: number; // 0-100% (ex: 82% vs alerte réelle)
  humanVerification: {
    actionTaken?: SignalVerificationAction;
    verifiedBy?: string;
    verifierRole?: UserSurveillanceRole;
    verifiedAt?: string;
    mandatoryJustification?: string;
    reviewerNotes?: string;
    additionalDataRequested?: string[];
  };
  historyTimeline: {
    date: string;
    user: string;
    role: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    comment: string;
  }[];
  isDemonstrationData: boolean;
}

export interface ThresholdAuditEntry {
  id: string;
  pathology: string;
  indicator: string;
  previousThreshold: number;
  newThreshold: number;
  modifiedBy: string;
  userRole: UserSurveillanceRole;
  modifiedAt: string;
  mandatoryJustification: string;
}

export interface SurveillanceReport17Sections {
  metadata: {
    reportId: string;
    generatedAt: string;
    periodCovered: string;
    territory: string;
    authorName: string;
    authorRole: string;
  };
  sections: {
    sectionNumber: number;
    title: string;
    summary: string;
    keyPoints: string[];
    metrics?: { label: string; value: string | number; badge?: string }[];
    warnings?: string[];
  }[];
  cautiousConclusionNotice: string;
}

export interface V117SurveillanceScenarioTest {
  id: number;
  code: string;
  title: string;
  category:
    | 'TEST_ANOMALIE_SANITAIRE'
    | 'TEST_SAISONNALITE'
    | 'TEST_DONNEES_INCOMPLETES'
    | 'TEST_EXTENSION_SPATIALE'
    | 'TEST_DONNEES_FUTURES'
    | 'TEST_PROXY_ENVIRONNEMENTAL'
    | 'TEST_RETARD_TRANSMISSION'
    | 'TEST_CHANGEMENT_DEFINITION'
    | 'TEST_MULTI_PATHOLOGIES_ONE_HEALTH'
    | 'TEST_INTERACTION_ONE_HEALTH_LAGS';
  description: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  steps: string[];
  expectedOutcome: string;
  actualOutcome?: string;
  lastRunDate: string;
}













