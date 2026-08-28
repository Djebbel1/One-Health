import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  HealthRecord,
  HealthFacility,
  HealthRecordCorrection,
  ClimateRecord,
  ClimateStation,
  ClimateSource,
  ClimateRecordCorrection,
  EnvironmentalObservation,
  HouseholdSurvey,
  UserSession,
  QualityIssue,
  ModelMatrixRow,
  RecordStatus,
  SyncQueueItem,
  AuditLog,
  GeographicUnit,
  GeographicAlias,
  SeasonConfig,
  AnalysisPeriod,
  HealthEnvironmentLink,
  HealthClimateLink,
  ClimateEnvironmentLink,
  DataCorrectionLog,
  IntegratedDatasetRow,
  ReadinessScoreReport,
  SpatiotemporalUnit,
  HealthSpatiotemporal,
  ClimateSpatiotemporal,
  EnvironmentSpatiotemporal,
  WashSpatiotemporal,
  HouseholdAggregate,
  IntegratedSpatiotemporalData,
  DataQualityCheckRecord,
  DataSourceRecord,
  ModelReadyDataRow,
  SpatiotemporalValidationTest,
  V17ReportSummary,
  QualityCheckStatus,
  // V1.8 Module Qualité & Normalisation
  GeoReference,
  TransformationLogRecord,
  DuplicateCandidateV18,
  AnalysisDatasetRow,
  DatasetMetadata,
  VariableDictionaryEntry,
  ModelingFeasibilityReport,
  DataQualityOverview,
  V18ValidationTest,
  V18ReportSummary,
  ValidationStatus,
  // V1.9 Module Analyse Exploratoire Spatio-Temporelle
  ExplorationFilters,
  AnalysisLogRecord,
  V19ValidationTest,
  V19ExploratoryReport,
  // V1.10 Module Extension Maniema & Multi-Pathologies One Health
  GeographicUnitV110,
  PathologyConfig,
  OneHealthProject,
  TimePeriodConfig,
  DynamicObservationRecord,
  UserSessionV110,
  V110ValidationTest,
  // V1.11 Module Enquêtes Opérationnelles & Supervision
  FieldSurvey,
  SurveyQuestionnaire,
  SurveySite,
  SurveyHousehold,
  CollectionSession,
  FieldPlanItem,
  HealthRegistryRecord,
  SurveyAuditLog,
  V111ValidationTest,
  SupervisorComment,
} from '../types';
import {
  INITIAL_QUESTIONNAIRES_V111,
  INITIAL_FIELD_SURVEYS_V111,
  INITIAL_SITES_V111,
  INITIAL_HOUSEHOLDS_V111,
  INITIAL_COLLECTION_SESSIONS_V111,
  INITIAL_FIELD_PLANS_V111,
  INITIAL_HEALTH_REGISTRY_RECORDS_V111,
  INITIAL_SURVEY_AUDIT_LOGS_V111,
  INITIAL_V111_VALIDATION_TESTS,
} from '../data/mockSurveyOperationsV111';
import {
  calculateSurveyCompleteness,
  validateSessionQuality,
} from '../utils/surveyOperationsEngine';
import {
  INITIAL_MANIEMA_GEO_UNITS,
  INITIAL_PATHOLOGIES,
  INITIAL_ONE_HEALTH_PROJECTS,
  INITIAL_TIME_PERIOD_CONFIGS,
  INITIAL_USERS_V110,
  INITIAL_DYNAMIC_OBSERVATIONS
} from '../data/maniemaData';
import {
  runV110ValidationSuite,
  computePathologySummaries
} from '../utils/maniemaEngine';
import {
  INITIAL_GEO_REFERENCES,
} from '../data/geoReferenceData';
import {
  INITIAL_VARIABLE_DICTIONARY,
} from '../data/variableDictionaryData';
import {
  detectPotentialDuplicatesV18,
  generateAnalysisDatasetV18,
  generateModelingFeasibilityReport,
  calculateDataQualityOverview,
  runV18ValidationSuite,
} from '../utils/dataNormalizationEngine';
import {
  runV19ValidationSuite,
  generateV19ExploratoryReport,
} from '../utils/spatiotemporalExplorationEngine';
import {
  INITIAL_HEALTH_RECORDS,
  INITIAL_CLIMATE_RECORDS,
  INITIAL_CLIMATE_STATIONS,
  INITIAL_CLIMATE_SOURCES,
  INITIAL_ENVIRONMENTAL_OBS,
  INITIAL_HOUSEHOLD_SURVEYS,
  INITIAL_USER_SESSIONS
} from '../data/initialData';
import {
  INITIAL_GEOGRAPHIC_UNITS,
  INITIAL_GEOGRAPHIC_ALIASES,
  INITIAL_SEASONS,
  INITIAL_ANALYSIS_PERIODS,
  INITIAL_HEALTH_ENV_LINKS,
  INITIAL_HEALTH_CLIMATE_LINKS,
  INITIAL_CLIMATE_ENV_LINKS,
} from '../data/harmonizationData';
import {
  compileIntegratedDataset,
  calculateReadinessScore,
} from '../utils/harmonizationEngine';
import {
  auditHealthRecord,
  auditClimateRecord,
  auditEnvironmentalObservation,
  auditHouseholdSurvey,
  detectDuplicates
} from '../utils/qualityControl';
import { compileModelMatrix } from '../utils/modelMatrixCompiler';
import { calculateGPSDistance, KINDU_HEALTH_FACILITIES } from '../data/kinduGeography';
import {
  buildSpatiotemporalUnits,
  buildHealthSpatiotemporal,
  buildClimateSpatiotemporal,
  buildEnvironmentSpatiotemporal,
  buildWashAndHouseholdAggregate,
  buildIntegratedSpatiotemporalData,
  buildModelReadyData,
  runDataQualityChecks,
  runSpatiotemporalValidationTests,
  generateV17ReportSummary,
  OFFICIAL_DATA_SOURCES,
} from '../utils/spatiotemporalEngine';

interface DataContextType {
  // Session & Permissions
  userSession: UserSession;
  setUserSession: (session: UserSession) => void;
  availableUsers: UserSession[];
  
  // Datasets
  healthFacilities: HealthFacility[];
  addHealthFacility: (facility: HealthFacility) => void;
  healthRecords: HealthRecord[];
  climateRecords: ClimateRecord[];
  climateStations: ClimateStation[];
  climateSources: ClimateSource[];
  addClimateStation: (station: ClimateStation) => void;
  updateClimateStation: (station: ClimateStation) => void;
  deleteClimateStation: (stationId: string) => void;
  addClimateSource: (source: ClimateSource) => void;
  updateClimateSource: (source: ClimateSource) => void;
  environmentalObs: EnvironmentalObservation[];
  householdSurveys: HouseholdSurvey[];
  
  // ID Generators
  generateNextHouseholdId: () => string;
  generateNextEnvironmentalId: () => string;
  generateNextHealthId: () => string;
  generateNextClimateId: () => string;

  // Mutators - Household
  addHouseholdSurvey: (survey: Omit<HouseholdSurvey, 'createdAt' | 'updatedAt'>) => void;
  updateHouseholdSurvey: (survey: HouseholdSurvey, reason?: string) => void;
  deleteHouseholdSurvey: (id: string, reason?: string) => void;
  
  // Mutators - Environmental
  addEnvironmentalObservation: (obs: Omit<EnvironmentalObservation, 'createdAt' | 'updatedAt'>) => void;
  updateEnvironmentalObservation: (obs: EnvironmentalObservation, reason?: string) => void;
  deleteEnvironmentalObservation: (id: string, reason?: string) => void;

  // Mutators - Health (V1.3)
  addHealthRecord: (record: Omit<HealthRecord, 'createdAt' | 'updatedAt'> | HealthRecord) => void;
  updateHealthRecord: (record: HealthRecord, reason?: string) => void;
  bulkAddHealthRecords: (records: (Omit<HealthRecord, 'createdAt' | 'updatedAt'> | HealthRecord)[]) => void;
  recordHealthCorrection: (
    recordId: string,
    fieldName: string,
    originalValue: any,
    correctedValue: any,
    reason: string
  ) => void;
  resolveHealthDuplicate: (recordId: string, action: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED') => void;
  deleteHealthRecord: (id: string, reason?: string) => void;
  
  // Mutators - Climate (V1.4)
  addClimateRecord: (record: Omit<ClimateRecord, 'createdAt' | 'updatedAt'> | ClimateRecord) => void;
  updateClimateRecord: (record: ClimateRecord, reason?: string) => void;
  bulkAddClimateRecords: (records: (Omit<ClimateRecord, 'id' | 'createdAt' | 'updatedAt'> | ClimateRecord)[]) => void;
  recordClimateCorrection: (
    recordId: string,
    fieldName: string,
    originalValue: any,
    correctedValue: any,
    reason: string
  ) => void;
  resolveClimateDuplicate: (recordId: string, action: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED') => void;
  deleteClimateRecord: (id: string, reason?: string) => void;

  // Validation Workflow (Supervisor / Admin)
  updateRecordStatus: (
    module: 'HOUSEHOLD' | 'ENVIRONMENTAL' | 'HEALTH' | 'CLIMATE',
    id: string,
    status: RecordStatus,
    supervisorNotes?: string
  ) => void;

  // Sync Queue & Offline
  syncQueue: SyncQueueItem[];
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
  syncAllPending: () => Promise<void>;
  pendingSyncCount: number;
  lastSyncTime: Date;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;

  // Matrix & Quality
  modelMatrix: ModelMatrixRow[];
  qualityIssues: QualityIssue[];
  resolveQualityIssue: (id: string) => void;
  
  // Global Filters
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedHealthAreaId: string;
  setSelectedHealthAreaId: (id: string) => void;
  selectedDisease: 'TOUS' | 'PALUDISME' | 'FIEVRE_TYPHOIDE';
  setSelectedDisease: (d: 'TOUS' | 'PALUDISME' | 'FIEVRE_TYPHOIDE') => void;
  
  // Demo Data vs Real Data Management
  clearDemoData: () => void;
  resetToInitialDemo: () => void;

  // V1.5 Harmonisation & Relations
  geographicUnits: GeographicUnit[];
  setGeographicUnits: React.Dispatch<React.SetStateAction<GeographicUnit[]>>;
  addGeographicUnit: (unit: GeographicUnit) => void;
  updateGeographicUnit: (unit: GeographicUnit) => void;
  geographicAliases: GeographicAlias[];
  addGeographicAlias: (alias: GeographicAlias) => void;
  seasons: SeasonConfig[];
  updateSeason: (season: SeasonConfig) => void;
  analysisPeriods: AnalysisPeriod[];
  healthEnvLinks: HealthEnvironmentLink[];
  addHealthEnvLink: (link: HealthEnvironmentLink) => void;
  deleteHealthEnvLink: (linkId: string) => void;
  healthClimateLinks: HealthClimateLink[];
  addHealthClimateLink: (link: HealthClimateLink) => void;
  deleteHealthClimateLink: (linkId: string) => void;
  climateEnvLinks: ClimateEnvironmentLink[];
  addClimateEnvLink: (link: ClimateEnvironmentLink) => void;
  deleteClimateEnvLink: (linkId: string) => void;
  dataCorrections: DataCorrectionLog[];
  addDataCorrection: (correction: Omit<DataCorrectionLog, 'correction_id' | 'corrected_at' | 'corrected_by'>) => void;
  restoreDeletedRecord: (table: 'HEALTH' | 'CLIMATE' | 'ENV' | 'SURVEY', id: string) => void;
  integratedDataset: IntegratedDatasetRow[];
  readinessReport: ReadinessScoreReport;

  // V1.7 Base Spatio-Temporelle Intégrée
  spatiotemporalUnits: SpatiotemporalUnit[];
  healthSpatiotemporal: HealthSpatiotemporal[];
  climateSpatiotemporal: ClimateSpatiotemporal[];
  environmentSpatiotemporal: EnvironmentSpatiotemporal[];
  washSpatiotemporal: WashSpatiotemporal[];
  householdAggregates: HouseholdAggregate[];
  integratedSpatiotemporalData: IntegratedSpatiotemporalData[];
  modelReadyData: ModelReadyDataRow[];
  dataQualityChecks: DataQualityCheckRecord[];
  dataSources: DataSourceRecord[];
  spatiotemporalValidationTests: SpatiotemporalValidationTest[];
  v17ReportSummary: V17ReportSummary;
  resolveQualityCheck: (id: string, status: QualityCheckStatus) => void;
  runSpatiotemporalTests: () => void;

  // V1.8 Module Qualité des Données & Normalisation
  geoReferences: GeoReference[];
  duplicateCandidates: DuplicateCandidateV18[];
  transformationLogs: TransformationLogRecord[];
  analysisDataset: AnalysisDatasetRow[];
  datasetMetadataList: DatasetMetadata[];
  selectedDatasetVersion: string;
  setSelectedDatasetVersion: (version: string) => void;
  dataQualityOverview: DataQualityOverview;
  modelingFeasibilityReport: ModelingFeasibilityReport;
  v18ValidationTests: V18ValidationTest[];
  v18ReportSummary: V18ReportSummary;
  resolveDuplicate: (candidateId: string, action: 'MERGED' | 'CONFIRMED_SEPARATE' | 'RESOLVED', notes?: string) => void;
  generateNewAnalysisDataset: (versionName: string, options?: { selectedYears?: number[]; selectedAires?: string[] }) => void;
  runAutomatedValidationV18: () => void;

  // V1.9 Module Analyse Exploratoire Spatio-Temporelle
  explorationFilters: ExplorationFilters;
  setExplorationFilters: React.Dispatch<React.SetStateAction<ExplorationFilters>>;
  resetExplorationFilters: () => void;
  analysisLogs: AnalysisLogRecord[];
  addAnalysisLog: (log: Omit<AnalysisLogRecord, 'analysis_id' | 'date'>) => void;
  v19ValidationTests: V19ValidationTest[];
  v19ExploratoryReport: V19ExploratoryReport;
  v19TestStats: { passed: number; failed: number; verdict: string };
  runAutomatedValidationV19: () => void;

  // V1.10 Extension Maniema & Multi-Pathologies One Health
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  maniemaGeoUnits: GeographicUnitV110[];
  setManiemaGeoUnits: React.Dispatch<React.SetStateAction<GeographicUnitV110[]>>;
  addManiemaGeoUnit: (unit: GeographicUnitV110) => void;
  updateManiemaGeoUnit: (unit: GeographicUnitV110) => void;
  toggleManiemaGeoUnitStatus: (id: string) => void;
  pathologies: PathologyConfig[];
  setPathologies: React.Dispatch<React.SetStateAction<PathologyConfig[]>>;
  addPathology: (pathology: PathologyConfig) => void;
  updatePathology: (pathology: PathologyConfig) => void;
  togglePathologyActive: (id: string) => void;
  oneHealthProjects: OneHealthProject[];
  setOneHealthProjects: React.Dispatch<React.SetStateAction<OneHealthProject[]>>;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  addOneHealthProject: (project: OneHealthProject) => void;
  updateOneHealthProject: (project: OneHealthProject) => void;
  timePeriodConfigs: TimePeriodConfig[];
  setTimePeriodConfigs: React.Dispatch<React.SetStateAction<TimePeriodConfig[]>>;
  addTimePeriodConfig: (config: TimePeriodConfig) => void;
  updateTimePeriodConfig: (config: TimePeriodConfig) => void;
  usersV110: UserSessionV110[];
  dynamicObservations: DynamicObservationRecord[];
  setDynamicObservations: React.Dispatch<React.SetStateAction<DynamicObservationRecord[]>>;
  addDynamicObservation: (obs: Omit<DynamicObservationRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDynamicObservation: (obs: DynamicObservationRecord) => void;
  deleteDynamicObservation: (id: string) => void;
  v110ValidationTests: V110ValidationTest[];
  runAutomatedValidationV110: () => void;

  // V1.11 Module Enquêtes Opérationnelles & Supervision
  fieldSurveys: FieldSurvey[];
  setFieldSurveys: React.Dispatch<React.SetStateAction<FieldSurvey[]>>;
  addFieldSurvey: (survey: Omit<FieldSurvey, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFieldSurvey: (survey: FieldSurvey) => void;
  deleteFieldSurvey: (id: string) => void;
  
  surveyQuestionnaires: SurveyQuestionnaire[];
  setSurveyQuestionnaires: React.Dispatch<React.SetStateAction<SurveyQuestionnaire[]>>;
  addSurveyQuestionnaire: (q: Omit<SurveyQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSurveyQuestionnaire: (q: SurveyQuestionnaire) => void;
  publishQuestionnaireVersion: (id: string) => void;
  createNextQuestionnaireVersion: (id: string, newVersion: string) => void;
  
  surveySites: SurveySite[];
  addSurveySite: (site: Omit<SurveySite, 'id' | 'createdAt'>) => void;
  updateSurveySite: (site: SurveySite) => void;
  
  surveyHouseholds: SurveyHousehold[];
  addSurveyHousehold: (hh: Omit<SurveyHousehold, 'id' | 'createdAt'>) => void;
  
  collectionSessions: CollectionSession[];
  setCollectionSessions: React.Dispatch<React.SetStateAction<CollectionSession[]>>;
  addCollectionSession: (session: Omit<CollectionSession, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollectionSession: (session: CollectionSession) => void;
  submitCollectionSession: (sessionId: string) => void;
  validateCollectionSession: (sessionId: string, supervisorNotes?: string) => void;
  requestCorrectionCollectionSession: (sessionId: string, correctionReason: string, targetQuestionId?: string) => void;
  rejectCollectionSession: (sessionId: string, reason: string) => void;
  addSupervisorCommentToSession: (
    sessionId: string,
    comment: Omit<SupervisorComment, 'id' | 'date' | 'supervisorId' | 'supervisorName'>
  ) => void;
  
  fieldPlanItems: FieldPlanItem[];
  setFieldPlanItems: React.Dispatch<React.SetStateAction<FieldPlanItem[]>>;
  updateFieldPlanItem: (item: FieldPlanItem) => void;
  
  healthRegistryRecords: HealthRegistryRecord[];
  addHealthRegistryRecord: (record: Omit<HealthRegistryRecord, 'id' | 'createdAt'>) => void;
  bulkAddHealthRegistryRecords: (records: Omit<HealthRegistryRecord, 'id' | 'createdAt'>[]) => void;
  
  surveyAuditLogs: SurveyAuditLog[];
  addSurveyAuditLog: (log: Omit<SurveyAuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;
  
  v111ValidationTests: V111ValidationTest[];
  runAutomatedValidationV111: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HEALTH: 'onehealth_kindu_health_v2',
  FACILITIES: 'onehealth_kindu_facilities_v2',
  CLIMATE: 'onehealth_kindu_climate_v2',
  CLIMATE_STATIONS: 'onehealth_kindu_climate_stations_v14',
  CLIMATE_SOURCES: 'onehealth_kindu_climate_sources_v14',
  ENV: 'onehealth_kindu_env_v2',
  SURVEYS: 'onehealth_kindu_surveys_v2',
  USER: 'onehealth_kindu_user_v2',
  SYNC_QUEUE: 'onehealth_kindu_sync_queue_v2',
  AUDIT: 'onehealth_kindu_audit_v2',
  GEO_UNITS: 'onehealth_kindu_geo_units_v15',
  GEO_ALIASES: 'onehealth_kindu_geo_aliases_v15',
  SEASONS: 'onehealth_kindu_seasons_v15',
  HE_LINKS: 'onehealth_kindu_he_links_v15',
  HC_LINKS: 'onehealth_kindu_hc_links_v15',
  CE_LINKS: 'onehealth_kindu_ce_links_v15',
  CORRECTIONS: 'onehealth_kindu_corrections_v15',
  MANIEMA_GEO: 'onehealth_maniema_geo_v110',
  PATHOLOGIES: 'onehealth_pathologies_v110',
  PROJECTS: 'onehealth_projects_v110',
  TIME_PERIODS: 'onehealth_time_periods_v110',
  DYNAMIC_OBS: 'onehealth_dynamic_obs_v110',
  IS_DEMO: 'onehealth_is_demo_mode_v110',
  // V1.11 Keys
  FIELD_SURVEYS: 'onehealth_field_surveys_v111',
  QUESTIONNAIRES_V111: 'onehealth_questionnaires_v111',
  SITES_V111: 'onehealth_sites_v111',
  HOUSEHOLDS_V111: 'onehealth_households_v111',
  COLLECTION_SESSIONS: 'onehealth_collection_sessions_v111',
  FIELD_PLANS: 'onehealth_field_plans_v111',
  HEALTH_REGISTRIES: 'onehealth_health_registries_v111',
  SURVEY_AUDIT_LOGS: 'onehealth_survey_audit_logs_v111',
};

function normalizeClimateRecord(c: any): ClimateRecord {
  const tempMean = typeof c.temperature_mean === 'number' ? c.temperature_mean : (typeof c.temp_mean_c === 'number' ? c.temp_mean_c : null);
  const tempMin = typeof c.temperature_min === 'number' ? c.temperature_min : (typeof c.temp_min_c === 'number' ? c.temp_min_c : null);
  const tempMax = typeof c.temperature_max === 'number' ? c.temperature_max : (typeof c.temp_max_c === 'number' ? c.temp_max_c : null);
  const humidity = typeof c.humidity_percent === 'number' ? c.humidity_percent : (typeof c.humidity_pct === 'number' ? c.humidity_pct : null);
  const rain = typeof c.rainfall_mm === 'number' ? c.rainfall_mm : null;

  const year = typeof c.year === 'number' ? c.year : (c.date ? parseInt(c.date.split('-')[0], 10) : 2024);
  const month = typeof c.month === 'number' ? c.month : (c.date && c.date.split('-')[1] ? parseInt(c.date.split('-')[1], 10) : null);
  const id = c.id || c.climate_id || `CLI-${Math.floor(Math.random() * 900000 + 100000)}`;

  return {
    ...c,
    id,
    climate_id: c.climate_id || id,
    year,
    month,
    period_type: c.period_type || (c.record_date ? 'JOUR' : (month ? 'MOIS' : 'ANNEE')),
    spatial_resolution: c.spatial_resolution || 'STATION',
    location_name: c.location_name || c.station_name || 'Station Météorologique Kindu',
    rainfall_mm: rain,
    temperature_mean: tempMean,
    temp_mean_c: tempMean,
    temperature_min: tempMin,
    temp_min_c: tempMin,
    temperature_max: tempMax,
    temp_max_c: tempMax,
    humidity_percent: humidity,
    humidity_pct: humidity,
    source_type: c.source_type || 'STATION_METEOROLOGIQUE',
    source_name: c.source_name || c.source || 'Station Météorologique FZOA Kindu',
    data_quality: c.data_quality || 'HIGH',
    quality_reason: c.quality_reason || 'Station météorologique directe',
    status: c.status || 'VALIDATED',
    station_name: c.station_name || c.location_name || 'Station Synoptique Kindu-Aéroport (FZOA)',
    station_type: c.station_type || 'SYNOPTIQUE',
    is_demo: c.is_demo ?? c.isDemoData ?? false,
    isDemoData: c.isDemoData ?? c.is_demo ?? false,
    created_at: c.created_at || c.createdAt || new Date().toISOString(),
    updated_at: c.updated_at || c.updatedAt || new Date().toISOString(),
  };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Session
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_USER_SESSIONS[0]; // Admin by default
  });

  // 2. Main Datasets
  const [healthFacilities, setHealthFacilities] = useState<HealthFacility[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACILITIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return KINDU_HEALTH_FACILITIES;
  });

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HEALTH);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_HEALTH_RECORDS;
  });

  const [climateRecords, setClimateRecords] = useState<ClimateRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIMATE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeClimateRecord);
        }
      } catch (e) { /* fallback */ }
    }
    return INITIAL_CLIMATE_RECORDS.map(normalizeClimateRecord);
  });

  const [climateStations, setClimateStations] = useState<ClimateStation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIMATE_STATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_CLIMATE_STATIONS;
  });

  const [climateSources, setClimateSources] = useState<ClimateSource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIMATE_SOURCES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_CLIMATE_SOURCES;
  });

  const [environmentalObs, setEnvironmentalObs] = useState<EnvironmentalObservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENV);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ENVIRONMENTAL_OBS;
  });

  const [householdSurveys, setHouseholdSurveys] = useState<HouseholdSurvey[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_HOUSEHOLD_SURVEYS;
  });

  // 3. Offline Sync Queue
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  // 4. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: 'AUD-0001',
        entityType: 'HOUSEHOLD',
        recordId: 'MEN-000001',
        recordIdentifier: 'MEN-000001',
        action: 'CREATE',
        userId: 'USR-003',
        userName: 'Alain Tambwe',
        userRole: 'ENQUÊTEUR',
        timestamp: '2024-04-12T10:00:00Z',
        reason: 'Saisie initiale sur le terrain (Quartier Port Alunguli)',
      },
    ];
  });

  // 5. V1.5 Harmonisation Datasets & Relations
  const [geographicUnits, setGeographicUnits] = useState<GeographicUnit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GEO_UNITS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_GEOGRAPHIC_UNITS;
  });

  const [geographicAliases, setGeographicAliases] = useState<GeographicAlias[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GEO_ALIASES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_GEOGRAPHIC_ALIASES;
  });

  const [seasons, setSeasons] = useState<SeasonConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEASONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_SEASONS;
  });

  const [analysisPeriods] = useState<AnalysisPeriod[]>(INITIAL_ANALYSIS_PERIODS);

  const [healthEnvLinks, setHealthEnvLinks] = useState<HealthEnvironmentLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HE_LINKS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_HEALTH_ENV_LINKS;
  });

  const [healthClimateLinks, setHealthClimateLinks] = useState<HealthClimateLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HC_LINKS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_HEALTH_CLIMATE_LINKS;
  });

  const [climateEnvLinks, setClimateEnvLinks] = useState<ClimateEnvironmentLink[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CE_LINKS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return INITIAL_CLIMATE_ENV_LINKS;
  });

  const [dataCorrections, setDataCorrections] = useState<DataCorrectionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CORRECTIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return [
      {
        correction_id: 'CORR-001',
        table_name: 'SANTE',
        record_id: 'SAN-000001',
        field_name: 'confirmed_cases',
        old_value: null,
        new_value: 42,
        reason: 'Rapprochement avec le registre de laboratoire CS Mikelenge',
        corrected_by: 'Dr. Jean Mukendi',
        corrected_at: '2024-04-15T14:30:00Z',
        record_version: 2,
      },
    ];
  });

  // Network state & offline simulation
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [resolvedIssueIds, setResolvedIssueIds] = useState<Set<string>>(new Set());

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Filters
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(4); // Avril 2024
  const [selectedHealthAreaId, setSelectedHealthAreaId] = useState<string>('ALL');
  const [selectedDisease, setSelectedDisease] = useState<'TOUS' | 'PALUDISME' | 'FIEVRE_TYPHOIDE'>('TOUS');

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(healthFacilities));
  }, [healthFacilities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(healthRecords));
  }, [healthRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIMATE, JSON.stringify(climateRecords));
  }, [climateRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIMATE_STATIONS, JSON.stringify(climateStations));
  }, [climateStations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIMATE_SOURCES, JSON.stringify(climateSources));
  }, [climateSources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENV, JSON.stringify(environmentalObs));
  }, [environmentalObs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(householdSurveys));
  }, [householdSurveys]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userSession));
  }, [userSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(syncQueue));
  }, [syncQueue]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEO_UNITS, JSON.stringify(geographicUnits));
  }, [geographicUnits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GEO_ALIASES, JSON.stringify(geographicAliases));
  }, [geographicAliases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons));
  }, [seasons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HE_LINKS, JSON.stringify(healthEnvLinks));
  }, [healthEnvLinks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HC_LINKS, JSON.stringify(healthClimateLinks));
  }, [healthClimateLinks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CE_LINKS, JSON.stringify(climateEnvLinks));
  }, [climateEnvLinks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CORRECTIONS, JSON.stringify(dataCorrections));
  }, [dataCorrections]);

  // V1.5 Mutator helpers
  const addGeographicUnit = (unit: GeographicUnit) => {
    setGeographicUnits(prev => [unit, ...prev]);
    addAuditLog({
      entityType: 'ZONE',
      recordId: unit.geo_id,
      recordIdentifier: unit.geo_name,
      action: 'CREATE',
      reason: `Création de l'unité géographique ${unit.geo_name} (${unit.geo_type})`,
    });
  };

  const updateGeographicUnit = (unit: GeographicUnit) => {
    setGeographicUnits(prev => prev.map(u => u.geo_id === unit.geo_id ? unit : u));
    addAuditLog({
      entityType: 'ZONE',
      recordId: unit.geo_id,
      recordIdentifier: unit.geo_name,
      action: 'UPDATE',
      reason: `Mise à jour de l'unité géographique ${unit.geo_name}`,
    });
  };

  const addGeographicAlias = (alias: GeographicAlias) => {
    setGeographicAliases(prev => [alias, ...prev]);
    addAuditLog({
      entityType: 'ZONE',
      recordId: alias.geo_id,
      recordIdentifier: alias.alias_name,
      action: 'CREATE',
      reason: `Ajout de l'alias toponymique "${alias.alias_name}" pour l'entité ${alias.geo_id}`,
    });
  };

  const updateSeason = (season: SeasonConfig) => {
    setSeasons(prev => prev.map(s => s.season_id === season.season_id ? season : s));
  };

  const addHealthEnvLink = (link: HealthEnvironmentLink) => {
    setHealthEnvLinks(prev => [link, ...prev]);
  };

  const deleteHealthEnvLink = (linkId: string) => {
    setHealthEnvLinks(prev => prev.filter(l => l.link_id !== linkId));
  };

  const addHealthClimateLink = (link: HealthClimateLink) => {
    setHealthClimateLinks(prev => [link, ...prev]);
  };

  const deleteHealthClimateLink = (linkId: string) => {
    setHealthClimateLinks(prev => prev.filter(l => l.link_id !== linkId));
  };

  const addClimateEnvLink = (link: ClimateEnvironmentLink) => {
    setClimateEnvLinks(prev => [link, ...prev]);
  };

  const deleteClimateEnvLink = (linkId: string) => {
    setClimateEnvLinks(prev => prev.filter(l => l.link_id !== linkId));
  };

  const addDataCorrection = (corr: Omit<DataCorrectionLog, 'correction_id' | 'corrected_at' | 'corrected_by'>) => {
    const newCorr: DataCorrectionLog = {
      ...corr,
      correction_id: `CORR-${Date.now().toString().slice(-6)}`,
      corrected_at: new Date().toISOString(),
      corrected_by: userSession.name,
    };
    setDataCorrections(prev => [newCorr, ...prev]);
    addAuditLog({
      entityType: corr.table_name === 'SANTE' ? 'HEALTH' : corr.table_name === 'CLIMAT' ? 'CLIMATE' : corr.table_name === 'ENVIRONNEMENT' ? 'ENVIRONMENTAL' : 'HOUSEHOLD',
      recordId: corr.record_id,
      recordIdentifier: corr.field_name,
      action: 'UPDATE',
      fieldName: corr.field_name,
      oldValue: String(corr.old_value ?? ''),
      newValue: String(corr.new_value ?? ''),
      reason: corr.reason,
    });
  };

  const restoreDeletedRecord = (table: 'HEALTH' | 'CLIMATE' | 'ENV' | 'SURVEY', id: string) => {
    if (table === 'HEALTH') {
      setHealthRecords(prev => prev.map(r => r.id === id ? { ...r, is_deleted: false } : r));
    } else if (table === 'CLIMATE') {
      setClimateRecords(prev => prev.map(r => r.id === id ? { ...r, is_deleted: false } : r));
    } else if (table === 'ENV') {
      setEnvironmentalObs(prev => prev.map(r => r.id === id ? { ...r, is_deleted: false } : r));
    } else if (table === 'SURVEY') {
      setHouseholdSurveys(prev => prev.map(r => r.id === id ? { ...r, is_deleted: false } : r));
    }
    addAuditLog({
      entityType: table === 'HEALTH' ? 'HEALTH' : table === 'CLIMATE' ? 'CLIMATE' : table === 'ENV' ? 'ENVIRONMENTAL' : 'HOUSEHOLD',
      recordId: id,
      recordIdentifier: id,
      action: 'UPDATE',
      reason: `Restauration logique de l'enregistrement supprimé (${table})`,
    });
  };

  // V1.5 Base Intégrée & Rapport de Préparation
  const integratedDataset = useMemo(() => {
    return compileIntegratedDataset(
      healthRecords,
      climateRecords,
      environmentalObs,
      householdSurveys,
      geographicUnits,
      analysisPeriods
    );
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys, geographicUnits, analysisPeriods]);

  const readinessReport = useMemo(() => {
    return calculateReadinessScore(
      healthRecords,
      climateRecords,
      environmentalObs,
      householdSurveys,
      geographicUnits,
      seasons,
      analysisPeriods
    );
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys, geographicUnits, seasons, analysisPeriods]);

  // ID Generators
  const generateNextHouseholdId = () => {
    const numbers = householdSurveys
      .map(s => {
        const match = s.id.match(/^MEN-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `MEN-${String(max + 1).padStart(6, '0')}`;
  };

  const generateNextEnvironmentalId = () => {
    const numbers = environmentalObs
      .map(e => {
        const match = e.id.match(/^ENV-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `ENV-${String(max + 1).padStart(6, '0')}`;
  };

  const generateNextHealthId = () => {
    const numbers = healthRecords
      .map(h => {
        const match = h.id.match(/^SAN-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `SAN-${String(max + 1).padStart(6, '0')}`;
  };

  const generateNextClimateId = () => {
    const numbers = climateRecords
      .map(c => {
        const match = c.id.match(/^CLI-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `CLI-${String(max + 1).padStart(6, '0')}`;
  };

  // Helper to add audit entry
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => {
    const newEntry: AuditLog = {
      ...log,
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userId: userSession.id,
      userName: userSession.name,
      userRole: userSession.role,
    };
    setAuditLogs(prev => [newEntry, ...prev.slice(0, 199)]); // Keep last 200 logs
  };

  // Mutators - Household
  const addHouseholdSurvey = (survey: Omit<HouseholdSurvey, 'createdAt' | 'updatedAt'> | HouseholdSurvey) => {
    const now = new Date().toISOString();
    const newSurvey: HouseholdSurvey = {
      ...survey,
      createdAt: (survey as HouseholdSurvey).createdAt || now,
      updatedAt: now,
    } as HouseholdSurvey;

    setHouseholdSurveys(prev => [newSurvey, ...prev]);

    // If offline, add to sync queue
    if (isOffline) {
      setSyncQueue(prev => [
        ...prev,
        {
          id: `SYNC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entity: 'HOUSEHOLD',
          operation: 'CREATE',
          localId: newSurvey.id,
          recordIdentifier: newSurvey.id,
          payload: newSurvey,
          timestamp: now,
          retryCount: 0,
          status: 'PENDING',
        },
      ]);
    }

    addAuditLog({
      entityType: 'HOUSEHOLD',
      recordId: newSurvey.id,
      recordIdentifier: newSurvey.id,
      action: 'CREATE',
      reason: 'Enregistrement d\'une nouvelle enquête ménage sur le terrain',
    });

    setLastSyncTime(new Date());
  };

  const updateHouseholdSurvey = (survey: HouseholdSurvey, reason?: string) => {
    const now = new Date().toISOString();
    const updated = { ...survey, updatedAt: now };

    setHouseholdSurveys(prev => prev.map(s => s.id === survey.id ? updated : s));

    if (isOffline) {
      setSyncQueue(prev => [
        ...prev,
        {
          id: `SYNC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entity: 'HOUSEHOLD',
          operation: 'UPDATE',
          localId: survey.id,
          recordIdentifier: survey.id,
          payload: updated,
          timestamp: now,
          retryCount: 0,
          status: 'PENDING',
        },
      ]);
    }

    addAuditLog({
      entityType: 'HOUSEHOLD',
      recordId: survey.id,
      recordIdentifier: survey.id,
      action: 'UPDATE',
      reason: reason || 'Mise à jour des informations ménage',
    });

    setLastSyncTime(new Date());
  };

  const deleteHouseholdSurvey = (id: string, reason?: string) => {
    const target = householdSurveys.find(s => s.id === id);
    if (!target) return;

    setHouseholdSurveys(prev => prev.filter(s => s.id !== id));

    addAuditLog({
      entityType: 'HOUSEHOLD',
      recordId: id,
      recordIdentifier: id,
      action: 'DELETE',
      reason: reason || 'Suppression scientifique justifiée de l\'enquête',
    });

    setLastSyncTime(new Date());
  };

  // Mutators - Environmental
  const addEnvironmentalObservation = (obs: Omit<EnvironmentalObservation, 'createdAt' | 'updatedAt'> | EnvironmentalObservation) => {
    const now = new Date().toISOString();
    
    // Auto-calculate distance to household if linked
    let calculatedDist: number | undefined = obs.calculated_household_distance_m;
    if (obs.household_id && obs.latitude && obs.longitude) {
      const linkedHh = householdSurveys.find(h => h.id === obs.household_id || h.household_id === obs.household_id);
      if (linkedHh && linkedHh.latitude && linkedHh.longitude) {
        calculatedDist = Math.round(calculateGPSDistance(obs.latitude, obs.longitude, linkedHh.latitude, linkedHh.longitude));
      }
    }

    // Auto-assign GPS status
    let gpsStatus = obs.gps_status;
    if (!gpsStatus) {
      if (!obs.latitude || !obs.longitude || (obs.latitude === 0 && obs.longitude === 0)) {
        gpsStatus = 'NO_GPS';
      } else if (obs.gps_accuracy && obs.gps_accuracy <= 20) {
        gpsStatus = 'VALID';
      } else {
        gpsStatus = 'WARNING';
      }
    }

    const newObs: EnvironmentalObservation = {
      ...obs,
      observation_id: obs.observation_id || obs.id,
      calculated_household_distance_m: calculatedDist,
      gps_status: gpsStatus,
      sync_status: isOffline ? 'PENDING' : (obs.sync_status || 'SYNCED'),
      createdAt: (obs as EnvironmentalObservation).createdAt || now,
      updatedAt: now,
    } as EnvironmentalObservation;

    setEnvironmentalObs(prev => [newObs, ...prev]);

    if (isOffline) {
      setSyncQueue(prev => [
        ...prev,
        {
          id: `SYNC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entity: 'ENVIRONMENTAL',
          operation: 'CREATE',
          localId: newObs.id,
          recordIdentifier: newObs.id,
          payload: newObs,
          timestamp: now,
          retryCount: 0,
          status: 'PENDING',
        },
      ]);
    }

    addAuditLog({
      entityType: 'ENVIRONMENTAL',
      recordId: newObs.id,
      recordIdentifier: newObs.id,
      action: 'CREATE',
      reason: 'Constat visuel et géolocalisé d\'un facteur environnemental',
    });

    setLastSyncTime(new Date());
  };

  const updateEnvironmentalObservation = (obs: EnvironmentalObservation, reason?: string) => {
    const now = new Date().toISOString();

    // Auto-calculate distance to household if linked
    let calculatedDist: number | undefined = obs.calculated_household_distance_m;
    if (obs.household_id && obs.latitude && obs.longitude) {
      const linkedHh = householdSurveys.find(h => h.id === obs.household_id || h.household_id === obs.household_id);
      if (linkedHh && linkedHh.latitude && linkedHh.longitude) {
        calculatedDist = Math.round(calculateGPSDistance(obs.latitude, obs.longitude, linkedHh.latitude, linkedHh.longitude));
      }
    }

    const updated: EnvironmentalObservation = { 
      ...obs, 
      observation_id: obs.observation_id || obs.id,
      calculated_household_distance_m: calculatedDist,
      sync_status: isOffline ? 'PENDING' : (obs.sync_status || 'SYNCED'),
      updatedAt: now 
    };

    setEnvironmentalObs(prev => prev.map(o => o.id === obs.id ? updated : o));

    if (isOffline) {
      setSyncQueue(prev => [
        ...prev,
        {
          id: `SYNC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          entity: 'ENVIRONMENTAL',
          operation: 'UPDATE',
          localId: obs.id,
          recordIdentifier: obs.id,
          payload: updated,
          timestamp: now,
          retryCount: 0,
          status: 'PENDING',
        },
      ]);
    }

    addAuditLog({
      entityType: 'ENVIRONMENTAL',
      recordId: obs.id,
      recordIdentifier: obs.id,
      action: 'UPDATE',
      reason: reason || 'Mise à jour des paramètres du facteur environnemental',
    });

    setLastSyncTime(new Date());
  };

  const deleteEnvironmentalObservation = (id: string, reason?: string) => {
    setEnvironmentalObs(prev => prev.filter(o => o.id !== id));

    addAuditLog({
      entityType: 'ENVIRONMENTAL',
      recordId: id,
      recordIdentifier: id,
      action: 'DELETE',
      reason: reason || 'Suppression d\'une observation environnementale',
    });

    setLastSyncTime(new Date());
  };

  // Mutators - Health Facilities
  const addHealthFacility = (facility: HealthFacility) => {
    setHealthFacilities(prev => {
      const exists = prev.some(f => f.facility_id === facility.facility_id);
      if (exists) {
        return prev.map(f => f.facility_id === facility.facility_id ? facility : f);
      }
      return [...prev, facility];
    });

    addAuditLog({
      entityType: 'HEALTH',
      recordId: facility.facility_id,
      recordIdentifier: facility.facility_name,
      action: 'CREATE',
      reason: `Enregistrement / actualisation de la structure sanitaire : ${facility.facility_name}`,
    });

    setLastSyncTime(new Date());
  };

  // Mutators - Health
  const addHealthRecord = (record: Omit<HealthRecord, 'createdAt' | 'updatedAt'> | HealthRecord) => {
    const now = new Date().toISOString();
    const id = (record as HealthRecord).id || generateNextHealthId();
    const newRecord: HealthRecord = {
      ...record,
      id,
      health_record_id: (record as HealthRecord).health_record_id || id,
      structure_name: record.structure_name || record.facility_name || 'Centre de Santé',
      createdAt: (record as HealthRecord).createdAt || now,
      updatedAt: now,
    } as HealthRecord;

    setHealthRecords(prev => [newRecord, ...prev]);

    addAuditLog({
      entityType: 'HEALTH',
      recordId: newRecord.id,
      recordIdentifier: newRecord.health_record_id || newRecord.id,
      action: 'CREATE',
      reason: `Saisie des données sanitaires ${record.disease} (${newRecord.structure_name})`,
    });

    setLastSyncTime(new Date());
  };

  const bulkAddHealthRecords = (records: (Omit<HealthRecord, 'createdAt' | 'updatedAt'> | HealthRecord)[]) => {
    const now = new Date().toISOString();
    let counter = healthRecords.length + 1;

    const formatted: HealthRecord[] = records.map(r => {
      const id = (r as HealthRecord).id || `SAN-${String(counter++).padStart(6, '0')}`;
      return {
        ...r,
        id,
        health_record_id: (r as HealthRecord).health_record_id || id,
        structure_name: r.structure_name || r.facility_name || 'Structure sanitaire',
        createdAt: (r as HealthRecord).createdAt || now,
        updatedAt: now,
      } as HealthRecord;
    });

    setHealthRecords(prev => [...formatted, ...prev]);

    addAuditLog({
      entityType: 'HEALTH',
      recordId: 'BULK_IMPORT_HEALTH',
      recordIdentifier: `${records.length} fiches`,
      action: 'CREATE',
      reason: `Importation / Saisie en lot de ${records.length} enregistrements sanitaires`,
    });

    setLastSyncTime(new Date());
  };

  const recordHealthCorrection = (
    recordId: string,
    fieldName: string,
    originalValue: any,
    correctedValue: any,
    reason: string
  ) => {
    const now = new Date().toISOString();
    const correction: HealthRecordCorrection = {
      id: `COR-${Date.now().toString().slice(-6)}`,
      record_id: recordId,
      field_name: fieldName,
      original_value: originalValue !== undefined ? String(originalValue) : null,
      corrected_value: correctedValue !== undefined ? String(correctedValue) : null,
      correction_reason: reason,
      corrected_by: userSession.name || userSession.id,
      corrected_at: now,
    };

    setHealthRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          const corrections = r.corrections || [];
          return {
            ...r,
            [fieldName]: correctedValue,
            status: 'CORRECTED',
            corrections: [correction, ...corrections],
            updatedAt: now,
          };
        }
        return r;
      })
    );

    addAuditLog({
      entityType: 'HEALTH',
      recordId: recordId,
      recordIdentifier: recordId,
      action: 'UPDATE',
      reason: `Correction du champ "${fieldName}" : "${originalValue}" -> "${correctedValue}". Motif : ${reason}`,
    });

    setLastSyncTime(new Date());
  };

  const resolveHealthDuplicate = (
    recordId: string,
    action: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED'
  ) => {
    const now = new Date().toISOString();
    if (action === 'DELETED') {
      deleteHealthRecord(recordId, 'Suppression suite à arbitrage de doublon');
      return;
    }

    setHealthRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            duplicateResolved: true,
            duplicateActionTaken: action,
            updatedAt: now,
          };
        }
        return r;
      })
    );

    addAuditLog({
      entityType: 'HEALTH',
      recordId: recordId,
      recordIdentifier: recordId,
      action: 'UPDATE',
      reason: `Arbitrage doublon sanitaire : action "${action}" appliquée.`,
    });

    setLastSyncTime(new Date());
  };

  const updateHealthRecord = (record: HealthRecord, reason?: string) => {
    const now = new Date().toISOString();
    const updated = { ...record, updatedAt: now };

    setHealthRecords(prev => prev.map(r => r.id === record.id ? updated : r));

    addAuditLog({
      entityType: 'HEALTH',
      recordId: record.id,
      recordIdentifier: record.health_record_id || record.id,
      action: 'UPDATE',
      reason: reason || 'Correction autorisée de la fiche sanitaire',
    });

    setLastSyncTime(new Date());
  };

  const deleteHealthRecord = (id: string, reason?: string) => {
    setHealthRecords(prev => prev.filter(r => r.id !== id));

    addAuditLog({
      entityType: 'HEALTH',
      recordId: id,
      recordIdentifier: id,
      action: 'DELETE',
      reason: reason || 'Suppression d\'un enregistrement sanitaire',
    });

    setLastSyncTime(new Date());
  };

  // Mutators - Climate
  const addClimateRecord = (record: Omit<ClimateRecord, 'createdAt' | 'updatedAt'> | ClimateRecord) => {
    const now = new Date().toISOString();
    const newRecord: ClimateRecord = normalizeClimateRecord({
      ...record,
      createdAt: (record as ClimateRecord).createdAt || now,
      updatedAt: now,
    });

    setClimateRecords(prev => [newRecord, ...prev]);

    addAuditLog({
      entityType: 'CLIMATE',
      recordId: newRecord.id,
      recordIdentifier: newRecord.climate_id || newRecord.id,
      action: 'CREATE',
      reason: `Enregistrement relevé météo ${record.date} (${record.location_id || record.station_name})`,
    });

    setLastSyncTime(new Date());
  };

  const updateClimateRecord = (record: ClimateRecord, reason?: string) => {
    const now = new Date().toISOString();
    const updated = normalizeClimateRecord({ ...record, updatedAt: now });

    setClimateRecords(prev => prev.map(c => c.id === record.id ? updated : c));

    addAuditLog({
      entityType: 'CLIMATE',
      recordId: record.id,
      recordIdentifier: record.climate_id || record.id,
      action: 'UPDATE',
      reason: reason || 'Correction d\'un relevé climatique',
    });

    setLastSyncTime(new Date());
  };

  const bulkAddClimateRecords = (records: (Omit<ClimateRecord, 'id' | 'createdAt' | 'updatedAt'> | ClimateRecord)[]) => {
    const now = new Date().toISOString();
    let counter = climateRecords.length + 1;

    const formatted: ClimateRecord[] = records.map(r => {
      const id = (r as ClimateRecord).id || `CLI-${String(counter++).padStart(6, '0')}`;
      return normalizeClimateRecord({
        ...r,
        id,
        climate_id: (r as ClimateRecord).climate_id || id,
        createdAt: (r as ClimateRecord).createdAt || now,
        updatedAt: now,
      });
    });

    setClimateRecords(prev => [...formatted, ...prev]);

    addAuditLog({
      entityType: 'CLIMATE',
      recordId: 'BULK_IMPORT',
      recordIdentifier: `${records.length} relevés`,
      action: 'CREATE',
      reason: `Importation en masse de ${records.length} séries climatiques`,
    });

    setLastSyncTime(new Date());
  };

  const deleteClimateRecord = (id: string, reason?: string) => {
    setClimateRecords(prev => prev.filter(c => c.id !== id));

    addAuditLog({
      entityType: 'CLIMATE',
      recordId: id,
      recordIdentifier: id,
      action: 'DELETE',
      reason: reason || 'Suppression d\'un relevé climatique',
    });

    setLastSyncTime(new Date());
  };

  const recordClimateCorrection = (
    recordId: string,
    fieldName: string,
    originalValue: any,
    correctedValue: any,
    reason: string
  ) => {
    const now = new Date().toISOString();
    const correction: ClimateRecordCorrection = {
      id: `CORR-CLI-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fieldName,
      originalValue,
      correctedValue,
      reason,
      correctedBy: userSession.name,
      correctedAt: now,
    };

    setClimateRecords(prev =>
      prev.map(rec => {
        if (rec.id !== recordId) return rec;
        const updated = {
          ...rec,
          [fieldName]: correctedValue,
          status: 'CORRECTED' as RecordStatus,
          updated_by: userSession.name,
          updated_at: now,
          corrections: [...(rec.corrections || []), correction],
        };
        return normalizeClimateRecord(updated);
      })
    );

    addAuditLog({
      entityType: 'CLIMATE',
      recordId,
      recordIdentifier: recordId,
      action: 'UPDATE',
      reason: `Correction scientifique [${fieldName}] : ${reason}`,
    });

    setLastSyncTime(new Date());
  };

  const resolveClimateDuplicate = (recordId: string, action: 'IGNORED' | 'MERGED' | 'RESOLVED' | 'DELETED') => {
    if (action === 'DELETED') {
      deleteClimateRecord(recordId, 'Doublon climatique supprimé');
      return;
    }
    setClimateRecords(prev =>
      prev.map(rec => {
        if (rec.id !== recordId) return rec;
        return {
          ...rec,
          isPotentialDuplicate: false,
          duplicateResolved: true,
          duplicateActionTaken: action,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const addClimateStation = (station: ClimateStation) => {
    setClimateStations(prev => [station, ...prev]);
    addAuditLog({
      entityType: 'CLIMATE',
      recordId: station.station_id,
      recordIdentifier: station.station_name,
      action: 'CREATE',
      reason: `Ajout station météo : ${station.station_name}`,
    });
  };

  const updateClimateStation = (station: ClimateStation) => {
    setClimateStations(prev => prev.map(s => s.station_id === station.station_id ? station : s));
    addAuditLog({
      entityType: 'CLIMATE',
      recordId: station.station_id,
      recordIdentifier: station.station_name,
      action: 'UPDATE',
      reason: `Mise à jour station météo : ${station.station_name}`,
    });
  };

  const deleteClimateStation = (stationId: string) => {
    setClimateStations(prev => prev.filter(s => s.station_id !== stationId));
  };

  const addClimateSource = (source: ClimateSource) => {
    setClimateSources(prev => [source, ...prev]);
    addAuditLog({
      entityType: 'CLIMATE',
      recordId: source.source_id,
      recordIdentifier: source.source_name,
      action: 'CREATE',
      reason: `Ajout source climatique : ${source.source_name}`,
    });
  };

  const updateClimateSource = (source: ClimateSource) => {
    setClimateSources(prev => prev.map(s => s.source_id === source.source_id ? source : s));
    addAuditLog({
      entityType: 'CLIMATE',
      recordId: source.source_id,
      recordIdentifier: source.source_name,
      action: 'UPDATE',
      reason: `Mise à jour source climatique : ${source.source_name}`,
    });
  };

  // Validation Workflow (Supervisor / Admin)
  const updateRecordStatus = (
    module: 'HOUSEHOLD' | 'ENVIRONMENTAL' | 'HEALTH' | 'CLIMATE',
    id: string,
    status: RecordStatus,
    supervisorNotes?: string
  ) => {
    const now = new Date().toISOString();

    if (module === 'HOUSEHOLD') {
      setHouseholdSurveys(prev =>
        prev.map(s => (s.id === id ? { 
          ...s, 
          status, 
          supervisor_notes: supervisorNotes, 
          rejection_reason: status === 'REJECTED' ? supervisorNotes : s.rejection_reason,
          rejected_by: status === 'REJECTED' ? (userSession.name || userSession.id) : s.rejected_by,
          rejected_at: status === 'REJECTED' ? now : s.rejected_at,
          updatedAt: now 
        } : s))
      );
    } else if (module === 'ENVIRONMENTAL') {
      setEnvironmentalObs(prev =>
        prev.map(o => (o.id === id ? { 
          ...o, 
          status, 
          supervisor_notes: supervisorNotes, 
          rejection_reason: status === 'REJECTED' ? supervisorNotes : o.rejection_reason,
          rejected_by: status === 'REJECTED' ? (userSession.name || userSession.id) : o.rejected_by,
          rejected_at: status === 'REJECTED' ? now : o.rejected_at,
          updatedAt: now 
        } : o))
      );
    } else if (module === 'HEALTH') {
      setHealthRecords(prev =>
        prev.map(h => (h.id === id ? { ...h, status, notes: supervisorNotes || h.notes, updatedAt: now } : h))
      );
    } else if (module === 'CLIMATE') {
      setClimateRecords(prev =>
        prev.map(c => (c.id === id ? { ...c, status, notes: supervisorNotes || c.notes, updatedAt: now } : c))
      );
    }

    addAuditLog({
      entityType: module,
      recordId: id,
      recordIdentifier: id,
      action: status === 'VALIDATED' ? 'VALIDATE' : status === 'REJECTED' ? 'REJECT' : 'UPDATE',
      reason: `Changement de statut vers ${status}. Motif / Note : ${supervisorNotes || 'Sans remarque particulière'}`,
    });

    setLastSyncTime(new Date());
  };

  // Synchronize all pending offline items
  const syncAllPending = async () => {
    if (syncQueue.length === 0) return;

    // Mark in-flight sync
    setEnvironmentalObs(prev => prev.map(o => o.sync_status === 'PENDING' ? { ...o, sync_status: 'SYNCED' } : o));
    setHouseholdSurveys(prev => prev.map(s => s.sync_status === 'PENDING' ? { ...s, sync_status: 'SYNCED' } : s));

    // Simulate reliable sync commit
    await new Promise(resolve => setTimeout(resolve, 600));

    setSyncQueue([]);
    setLastSyncTime(new Date());
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline && syncQueue.length > 0) {
      syncAllPending();
    }
  }, [isOffline]);

  // Model Matrix Compilation
  const modelMatrix = useMemo(() => {
    return compileModelMatrix(healthRecords, climateRecords, environmentalObs, householdSurveys);
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys]);

  // Quality Issues Engine
  const qualityIssues = useMemo(() => {
    const issues: QualityIssue[] = [];

    // Health Records Audit
    healthRecords.forEach(hr => issues.push(...auditHealthRecord(hr)));

    // Climate Records Audit
    climateRecords.forEach(cr => issues.push(...auditClimateRecord(cr)));

    // Environmental Obs Audit
    environmentalObs.forEach(obs => issues.push(...auditEnvironmentalObservation(obs)));

    // Household Surveys Audit
    householdSurveys.forEach(hs => issues.push(...auditHouseholdSurvey(hs)));

    // Duplicates Audit
    issues.push(...detectDuplicates(healthRecords, householdSurveys));

    // Filter resolved issues
    return issues.map(issue => ({
      ...issue,
      status: resolvedIssueIds.has(issue.id) ? 'RESOLU' : issue.status,
    }));
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys, resolvedIssueIds]);

  const resolveQualityIssue = (id: string) => {
    setResolvedIssueIds(prev => new Set(prev).add(id));
  };

  // Clear demo data (strict research protocol requirement)
  const clearDemoData = () => {
    setHouseholdSurveys(prev => prev.filter(s => !s.isDemoData));
    setEnvironmentalObs(prev => prev.filter(o => !o.isDemoData));
    setHealthRecords(prev => prev.filter(h => !h.isDemoData));
    setClimateRecords(prev => prev.filter(c => !c.isDemoData));

    addAuditLog({
      entityType: 'HOUSEHOLD',
      recordId: 'ALL_DEMO',
      recordIdentifier: 'PURGE_DEMO',
      action: 'DELETE',
      reason: 'Purge des données de démonstration pour initialiser la collecte réelle de recherche',
    });

    setLastSyncTime(new Date());
  };

  // Reset to initial demo data
  const resetToInitialDemo = () => {
    setHealthRecords(INITIAL_HEALTH_RECORDS);
    setClimateRecords(INITIAL_CLIMATE_RECORDS);
    setClimateStations(INITIAL_CLIMATE_STATIONS);
    setClimateSources(INITIAL_CLIMATE_SOURCES);
    setEnvironmentalObs(INITIAL_ENVIRONMENTAL_OBS);
    setHouseholdSurveys(INITIAL_HOUSEHOLD_SURVEYS);
    setResolvedIssueIds(new Set());
    setSyncQueue([]);
    setLastSyncTime(new Date());
  };

  // ============================================================================
  // V1.7 BASE DE DONNÉES SPATIO-TEMPORELLE INTÉGRÉE
  // ============================================================================
  const [resolvedChecks, setResolvedChecks] = useState<Map<string, QualityCheckStatus>>(new Map());
  const [testExecutionCounter, setTestExecutionCounter] = useState(0);

  // 1. Spatiotemporal Units (360 units: 10 health areas x 12 months x 3 years)
  const spatiotemporalUnits = useMemo(() => {
    return buildSpatiotemporalUnits([2023, 2024, 2025]);
  }, []);

  // 2. Health Spatiotemporal Table
  const healthSpatiotemporal = useMemo(() => {
    return buildHealthSpatiotemporal(spatiotemporalUnits, healthRecords);
  }, [spatiotemporalUnits, healthRecords]);

  // 3. Climate Spatiotemporal Table
  const climateSpatiotemporal = useMemo(() => {
    return buildClimateSpatiotemporal(spatiotemporalUnits, climateRecords);
  }, [spatiotemporalUnits, climateRecords]);

  // 4. Environment Spatiotemporal Table
  const environmentSpatiotemporal = useMemo(() => {
    return buildEnvironmentSpatiotemporal(spatiotemporalUnits, environmentalObs);
  }, [spatiotemporalUnits, environmentalObs]);

  // 5. WASH & Household Aggregates
  const { washList: washSpatiotemporal, hhAggregates: householdAggregates } = useMemo(() => {
    return buildWashAndHouseholdAggregate(spatiotemporalUnits, householdSurveys);
  }, [spatiotemporalUnits, householdSurveys]);

  // 6. Integrated Spatiotemporal Data Table
  const integratedSpatiotemporalData = useMemo(() => {
    return buildIntegratedSpatiotemporalData(
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      washSpatiotemporal,
      householdAggregates,
      householdSurveys
    );
  }, [
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
    householdAggregates,
    householdSurveys,
  ]);

  // 7. Model Ready Data View
  const modelReadyData = useMemo(() => {
    return buildModelReadyData(integratedSpatiotemporalData);
  }, [integratedSpatiotemporalData]);

  // 8. Quality Checks & Audits Table
  const dataQualityChecks = useMemo(() => {
    const base = runDataQualityChecks(spatiotemporalUnits, healthRecords, climateRecords, environmentalObs);
    return base.map(c => {
      if (resolvedChecks.has(c.id)) {
        return { ...c, status: resolvedChecks.get(c.id)! };
      }
      return c;
    });
  }, [spatiotemporalUnits, healthRecords, climateRecords, environmentalObs, resolvedChecks]);

  // 9. Official Data Sources
  const dataSources = useMemo(() => OFFICIAL_DATA_SOURCES, []);

  // 10. Automated Validation Tests Suite
  const spatiotemporalValidationTests = useMemo(() => {
    return runSpatiotemporalValidationTests(
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      integratedSpatiotemporalData,
      dataQualityChecks
    );
  }, [
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    integratedSpatiotemporalData,
    dataQualityChecks,
    testExecutionCounter,
  ]);

  // 11. V1.7 Final Report Summary (Section 63)
  const v17ReportSummary = useMemo(() => {
    return generateV17ReportSummary(
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      householdSurveys,
      integratedSpatiotemporalData,
      modelReadyData,
      dataQualityChecks,
      spatiotemporalValidationTests
    );
  }, [
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    householdSurveys,
    integratedSpatiotemporalData,
    modelReadyData,
    dataQualityChecks,
    spatiotemporalValidationTests,
  ]);

  const resolveQualityCheck = (id: string, status: QualityCheckStatus) => {
    setResolvedChecks(prev => new Map(prev).set(id, status));
  };

  const runSpatiotemporalTests = () => {
    setTestExecutionCounter(prev => prev + 1);
  };

  // =========================================================================
  // 12. V1.8 MODULE QUALITÉ DES DONNÉES & NORMALISATION DU DATASET
  // =========================================================================

  // 12.1. Référentiel Géographique Normalisé (GEO_REFERENCE)
  const [geoReferences] = useState<GeoReference[]>(INITIAL_GEO_REFERENCES);

  // 12.2. Journal des Transformations (TRANSFORMATION_LOG)
  const [transformationLogs, setTransformationLogs] = useState<TransformationLogRecord[]>([
    {
      id: 'LOG_INIT_001',
      source_record_id: 'GEO_SYSTEM',
      transformation_type: 'NORMALISATION_GEO',
      old_value: 'Nomenclatures disparates',
      new_value: '10 Aires de Santé Kindu harmonisées',
      reason: 'Standardisation via GEO_REFERENCE officielle DPS',
      performed_by: 'Administrateur One Health',
      performed_at: '2026-08-27 10:00:00',
      validation_status: 'VALIDATED',
      is_reversible: true,
    },
    {
      id: 'LOG_INIT_002',
      source_record_id: 'METTELSAT_KINDU',
      transformation_type: 'CALCUL_LAG',
      old_value: null,
      new_value: 'rainfall_lag_1 & rainfall_lag_2 calculés sans extrapolation',
      reason: 'Modélisation du délai biologique vectoriel M-1 et M-2',
      performed_by: 'Moteur Spatio-Temporel V1.8',
      performed_at: '2026-08-27 10:05:00',
      validation_status: 'VALIDATED',
      is_reversible: true,
    },
    {
      id: 'LOG_INIT_003',
      source_record_id: 'HEALTH_SNIS_ALL',
      transformation_type: 'CALCUL_INCIDENCE',
      old_value: null,
      new_value: 'Taux incidence calculé (cas / pop × 1 000 hab)',
      reason: 'Standardisation épidémiologique de la morbidité',
      performed_by: 'Moteur Spatio-Temporel V1.8',
      performed_at: '2026-08-27 10:10:00',
      validation_status: 'VALIDATED',
      is_reversible: true,
    }
  ]);

  // 12.3. Détection des Candidats Doublons (POTENTIAL_DUPLICATE) sans suppression auto
  const [duplicateCandidates, setDuplicateCandidates] = useState<DuplicateCandidateV18[]>(() => {
    return detectPotentialDuplicatesV18(
      healthRecords,
      climateRecords,
      environmentalObs,
      householdSurveys
    );
  });

  const resolveDuplicate = (
    candidateId: string,
    action: 'MERGED' | 'CONFIRMED_SEPARATE' | 'RESOLVED',
    notes?: string
  ) => {
    setDuplicateCandidates(prev =>
      prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: action === 'MERGED' ? 'MERGED' : 'CONFIRMED_SEPARATE',
            resolution_notes: notes || `Arbitrage validé : ${action}`,
            resolved_by: userSession.name,
            resolved_at: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Journaliser dans TRANSFORMATION_LOG
    setTransformationLogs(prev => [
      {
        id: `LOG_DUP_${Date.now()}`,
        source_record_id: candidateId,
        transformation_type: 'DOUBLON_TRAITEMENT',
        old_value: 'POTENTIAL_DUPLICATE',
        new_value: action,
        reason: notes || `Arbitrage de doublon : ${action}`,
        performed_by: userSession.name,
        performed_at: new Date().toISOString(),
        validation_status: 'VALIDATED',
        is_reversible: true,
      },
      ...prev,
    ]);
  };

  // 12.4. Génération & Versionnage du Jeu de Données Analytique (ANALYSIS_DATASET)
  const [datasetMetadataList, setDatasetMetadataList] = useState<DatasetMetadata[]>([]);
  const [datasetsMap, setDatasetsMap] = useState<Map<string, AnalysisDatasetRow[]>>(new Map());
  const [selectedDatasetVersion, setSelectedDatasetVersion] = useState<string>('ANALYSIS_DATASET_v1');

  // Initialisation du premier jeu de données V1
  useEffect(() => {
    if (spatiotemporalUnits.length > 0 && !datasetsMap.has('ANALYSIS_DATASET_v1')) {
      const { dataset, metadata } = generateAnalysisDatasetV18(
        'ANALYSIS_DATASET_v1',
        spatiotemporalUnits,
        healthSpatiotemporal,
        climateSpatiotemporal,
        environmentSpatiotemporal,
        washSpatiotemporal
      );
      setDatasetsMap(new Map().set('ANALYSIS_DATASET_v1', dataset));
      setDatasetMetadataList([metadata]);
    }
  }, [
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
  ]);

  const generateNewAnalysisDataset = (
    versionName: string,
    options?: { selectedYears?: number[]; selectedAires?: string[] }
  ) => {
    const { dataset, metadata } = generateAnalysisDatasetV18(
      versionName,
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      washSpatiotemporal,
      options
    );

    setDatasetsMap(prev => new Map(prev).set(versionName, dataset));
    setDatasetMetadataList(prev => [metadata, ...prev]);
    setSelectedDatasetVersion(versionName);

    setTransformationLogs(prev => [
      {
        id: `LOG_GEN_${Date.now()}`,
        source_record_id: versionName,
        transformation_type: 'AGREGATION_SPATIO_TEMPORELLE',
        old_value: null,
        new_value: `${dataset.length} unités générées`,
        reason: `Génération du jeu de données versionné ${versionName}`,
        performed_by: userSession.name,
        performed_at: new Date().toISOString(),
        validation_status: 'VALIDATED',
        is_reversible: true,
      },
      ...prev,
    ]);
  };

  const currentAnalysisDataset = useMemo(() => {
    return datasetsMap.get(selectedDatasetVersion) || [];
  }, [datasetsMap, selectedDatasetVersion]);

  // 12.5. Rapport de Faisabilité de la Modélisation (12 sections)
  const modelingFeasibilityReport = useMemo(() => {
    return generateModelingFeasibilityReport(currentAnalysisDataset, duplicateCandidates);
  }, [currentAnalysisDataset, duplicateCandidates]);

  // 12.6. Vue d'Ensemble de la Qualité des Données (Synthèse Dashboard)
  const dataQualityOverview = useMemo(() => {
    return calculateDataQualityOverview(
      healthRecords,
      climateRecords,
      environmentalObs,
      householdSurveys,
      currentAnalysisDataset,
      duplicateCandidates
    );
  }, [
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    currentAnalysisDataset,
    duplicateCandidates,
  ]);

  // 12.7. Banc de Tests Automatisés V1.8 (Sections 65-76) & Bilan Final (Section 80)
  const [v18TestCounter, setV18TestCounter] = useState(0);

  const { tests: v18ValidationTests, summary: v18ReportSummary } = useMemo(() => {
    return runV18ValidationSuite(
      currentAnalysisDataset,
      duplicateCandidates,
      transformationLogs
    );
  }, [currentAnalysisDataset, duplicateCandidates, transformationLogs, v18TestCounter]);

  const runAutomatedValidationV18 = () => {
    setV18TestCounter(prev => prev + 1);
  };

  // =========================================================================
  // 13. V1.9 MODULE ANALYSE EXPLORATOIRE SPATIO-TEMPORELLE
  // =========================================================================

  const initialExplorationFilters: ExplorationFilters = {
    disease: 'ALL',
    year: 'ALL',
    month: 'ALL',
    quarter: 'ALL',
    zone_sante_id: 'ALL',
    aire_sante_id: 'ALL',
    climate_variable: 'rainfall_mm',
    data_source: 'ALL',
    movingAverageMonths: 0
  };

  const [explorationFilters, setExplorationFilters] = useState<ExplorationFilters>(initialExplorationFilters);

  const resetExplorationFilters = () => {
    setExplorationFilters(initialExplorationFilters);
  };

  // Journal des Analyses (ANALYSIS_LOG) - Section 57
  const [analysisLogs, setAnalysisLogs] = useState<AnalysisLogRecord[]>([
    {
      analysis_id: 'LOG_ANL_INIT_001',
      analysis_type: 'EXPLORATION_TEMPORELLE_MENSUELLE',
      dataset_version: 'ANALYSIS_DATASET_v1',
      date: new Date().toISOString(),
      user: 'Système One Health Kindu',
      filters_summary: 'Période 2023-2025 | Toutes les 10 Aires de Santé | Paludisme & Typhoïde',
      variables_analyzed: ['malaria_cases', 'typhoid_cases', 'rainfall_mm', 'temperature_mean'],
      method: 'Séries chronologiques & Moyennes mobiles centrées',
      observations_count: currentAnalysisDataset.length,
      result_status: 'SUCCESS',
      scientific_notes: 'Initialisation de l’analyse exploratoire spatio-temporelle V1.9.'
    }
  ]);

  const addAnalysisLog = (log: Omit<AnalysisLogRecord, 'analysis_id' | 'date'>) => {
    const newLog: AnalysisLogRecord = {
      ...log,
      analysis_id: `LOG_ANL_${Date.now()}`,
      date: new Date().toISOString()
    };
    setAnalysisLogs(prev => [newLog, ...prev]);
  };

  // Rapport Automatique d'Analyse Exploratoire V1.9 (10 Sections)
  const v19ExploratoryReport = useMemo(() => {
    return generateV19ExploratoryReport(
      currentAnalysisDataset,
      selectedDatasetVersion,
      environmentalObs
    );
  }, [currentAnalysisDataset, selectedDatasetVersion, environmentalObs]);

  // Banc de Tests Automatisés V1.9 (Sections 64 à 76)
  const [v19TestCounter, setV19TestCounter] = useState(0);

  const { tests: v19ValidationTests, passedCount: v19Passed, failedCount: v19Failed, verdict: v19Verdict } = useMemo(() => {
    return runV19ValidationSuite(currentAnalysisDataset, environmentalObs);
  }, [currentAnalysisDataset, environmentalObs, v19TestCounter]);

  const runAutomatedValidationV19 = () => {
    setV19TestCounter(prev => prev + 1);
  };

  // =========================================================================
  // 14. V1.10 EXTENSION MANIEMA & MOTEUR MULTI-PATHOLOGIES ONE HEALTH
  // =========================================================================

  // Mode Démonstration vs Réel
  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    return saved !== null ? saved === 'true' : true;
  });

  const setIsDemoMode = (demo: boolean) => {
    setIsDemoModeState(demo);
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, demo ? 'true' : 'false');
  };

  // Unités Géographiques Maniema (Province -> Territoire -> ZS -> AS -> Site)
  const [maniemaGeoUnits, setManiemaGeoUnits] = useState<GeographicUnitV110[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MANIEMA_GEO);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement maniemaGeoUnits', e);
      }
    }
    return INITIAL_MANIEMA_GEO_UNITS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANIEMA_GEO, JSON.stringify(maniemaGeoUnits));
  }, [maniemaGeoUnits]);

  const addManiemaGeoUnit = (unit: GeographicUnitV110) => {
    setManiemaGeoUnits(prev => [unit, ...prev]);
    addAuditLog({
      entityType: 'ZONE',
      recordId: unit.id,
      recordIdentifier: unit.name,
      action: 'CREATE',
      reason: `Ajout de l'unité spatiale ${unit.name} (${unit.level})`,
    });
  };

  const updateManiemaGeoUnit = (unit: GeographicUnitV110) => {
    setManiemaGeoUnits(prev => prev.map(u => (u.id === unit.id ? { ...unit, updatedAt: new Date().toISOString() } : u)));
    addAuditLog({
      entityType: 'ZONE',
      recordId: unit.id,
      recordIdentifier: unit.name,
      action: 'UPDATE',
      reason: `Mise à jour de l'unité spatiale ${unit.name}`,
    });
  };

  const toggleManiemaGeoUnitStatus = (id: string) => {
    setManiemaGeoUnits(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'ACTIF' ? 'INACTIF' : 'ACTIF', updatedAt: new Date().toISOString() } : u))
    );
  };

  // Catalogue des Pathologies Configurables
  const [pathologies, setPathologies] = useState<PathologyConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATHOLOGIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement pathologies', e);
      }
    }
    return INITIAL_PATHOLOGIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATHOLOGIES, JSON.stringify(pathologies));
  }, [pathologies]);

  const addPathology = (pathology: PathologyConfig) => {
    setPathologies(prev => [pathology, ...prev]);
    addAuditLog({
      entityType: 'HEALTH',
      recordId: pathology.id,
      recordIdentifier: pathology.name,
      action: 'CREATE',
      reason: `Ajout de la pathologie ${pathology.name} (${pathology.code})`,
    });
  };

  const updatePathology = (pathology: PathologyConfig) => {
    setPathologies(prev => prev.map(p => (p.id === pathology.id ? { ...pathology, updatedAt: new Date().toISOString() } : p)));
    addAuditLog({
      entityType: 'HEALTH',
      recordId: pathology.id,
      recordIdentifier: pathology.name,
      action: 'UPDATE',
      reason: `Mise à jour de la pathologie ${pathology.name}`,
    });
  };

  const togglePathologyActive = (id: string) => {
    setPathologies(prev =>
      prev.map(p => (p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() } : p))
    );
  };

  // Projets One Health
  const [oneHealthProjects, setOneHealthProjects] = useState<OneHealthProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement projects', e);
      }
    }
    return INITIAL_ONE_HEALTH_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(oneHealthProjects));
  }, [oneHealthProjects]);

  const [activeProjectId, setActiveProjectId] = useState<string>('PRJ_KINDU_CLIMAT');

  const addOneHealthProject = (project: OneHealthProject) => {
    setOneHealthProjects(prev => [project, ...prev]);
    addAuditLog({
      entityType: 'HEALTH',
      recordId: project.id,
      recordIdentifier: project.name,
      action: 'CREATE',
      reason: `Création du projet One Health ${project.name} (${project.code})`,
    });
  };

  const updateOneHealthProject = (project: OneHealthProject) => {
    setOneHealthProjects(prev => prev.map(p => (p.id === project.id ? project : p)));
    addAuditLog({
      entityType: 'HEALTH',
      recordId: project.id,
      recordIdentifier: project.name,
      action: 'UPDATE',
      reason: `Mise à jour du projet ${project.name}`,
    });
  };

  // Configurations des Périodes & Sources Temporelles
  const [timePeriodConfigs, setTimePeriodConfigs] = useState<TimePeriodConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIME_PERIODS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement timePeriods', e);
      }
    }
    return INITIAL_TIME_PERIOD_CONFIGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_PERIODS, JSON.stringify(timePeriodConfigs));
  }, [timePeriodConfigs]);

  const addTimePeriodConfig = (config: TimePeriodConfig) => {
    setTimePeriodConfigs(prev => [config, ...prev]);
  };

  const updateTimePeriodConfig = (config: TimePeriodConfig) => {
    setTimePeriodConfigs(prev => prev.map(c => (c.id === config.id ? config : c)));
  };

  // Rôles Utilisateurs V1.10
  const [usersV110] = useState<UserSessionV110[]>(INITIAL_USERS_V110);

  // Observations Dynamiques Multi-Pathologies
  const [dynamicObservations, setDynamicObservations] = useState<DynamicObservationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DYNAMIC_OBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement dynamicObs', e);
      }
    }
    return INITIAL_DYNAMIC_OBSERVATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DYNAMIC_OBS, JSON.stringify(dynamicObservations));
  }, [dynamicObservations]);

  const addDynamicObservation = (obs: Omit<DynamicObservationRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecord: DynamicObservationRecord = {
      ...obs,
      id: `OBS_DYN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDynamicObservations(prev => [newRecord, ...prev]);
    addAuditLog({
      entityType: 'HEALTH',
      recordId: newRecord.id,
      recordIdentifier: `${obs.pathologyCode} - ${obs.geographicUnitId}`,
      action: 'CREATE',
      reason: `Observation enregistrée pour ${obs.pathologyCode} (${obs.date})`,
    });
  };

  const updateDynamicObservation = (obs: DynamicObservationRecord) => {
    setDynamicObservations(prev =>
      prev.map(o => (o.id === obs.id ? { ...obs, updatedAt: new Date().toISOString() } : o))
    );
    addAuditLog({
      entityType: 'HEALTH',
      recordId: obs.id,
      recordIdentifier: `${obs.pathologyCode} - ${obs.geographicUnitId}`,
      action: 'UPDATE',
      reason: `Observation ${obs.id} mise à jour`,
    });
  };

  const deleteDynamicObservation = (id: string) => {
    setDynamicObservations(prev => prev.filter(o => o.id !== id));
    addAuditLog({
      entityType: 'HEALTH',
      recordId: id,
      recordIdentifier: id,
      action: 'DELETE',
      reason: `Observation ${id} supprimée`,
    });
  };

  // Banc de Tests de Validation Automatisée V1.10 (14 Tests)
  const [v110TestCounter, setV110TestCounter] = useState(0);

  const v110ValidationTests = useMemo(() => {
    return runV110ValidationSuite(
      maniemaGeoUnits,
      pathologies,
      oneHealthProjects,
      timePeriodConfigs,
      dynamicObservations
    );
  }, [maniemaGeoUnits, pathologies, oneHealthProjects, timePeriodConfigs, dynamicObservations, v110TestCounter]);

  const runAutomatedValidationV110 = () => {
    setV110TestCounter(prev => prev + 1);
  };

  // ==========================================================================
  // V1.11 MODULE D'ENQUÊTE OPÉRATIONNELLE ET SUPERVISION DE TERRAIN
  // ==========================================================================

  // 1. Enquêtes Opérationnelles
  const [fieldSurveys, setFieldSurveys] = useState<FieldSurvey[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIELD_SURVEYS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement fieldSurveys', e); }
    }
    return INITIAL_FIELD_SURVEYS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FIELD_SURVEYS, JSON.stringify(fieldSurveys));
  }, [fieldSurveys]);

  const addFieldSurvey = (survey: Omit<FieldSurvey, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSurvey: FieldSurvey = {
      ...survey,
      id: `ENQ_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFieldSurveys(prev => [newSurvey, ...prev]);
    addSurveyAuditLog({
      surveyId: newSurvey.id,
      action: 'CREATION',
      entity: 'ENQUETE',
      fieldName: 'survey',
      newValue: newSurvey.name,
      reason: `Création de l'enquête opérationnelle ${newSurvey.name} (${newSurvey.code})`
    });
  };

  const updateFieldSurvey = (survey: FieldSurvey) => {
    const updated = { ...survey, updatedAt: new Date().toISOString() };
    setFieldSurveys(prev => prev.map(s => (s.id === survey.id ? updated : s)));
    addSurveyAuditLog({
      surveyId: survey.id,
      action: 'MODIFICATION',
      entity: 'ENQUETE',
      fieldName: 'status/params',
      newValue: survey.status,
      reason: `Mise à jour de l'enquête ${survey.name} (Statut: ${survey.status})`
    });
  };

  const deleteFieldSurvey = (id: string) => {
    const target = fieldSurveys.find(s => s.id === id);
    setFieldSurveys(prev => prev.filter(s => s.id !== id));
    if (target) {
      addSurveyAuditLog({
        surveyId: id,
        action: 'MODIFICATION',
        entity: 'ENQUETE',
        previousValue: target.name,
        newValue: 'DELETED',
        reason: `Suppression de l'enquête ${target.name}`
      });
    }
  };

  // 2. Questionnaires & Versionnement
  const [surveyQuestionnaires, setSurveyQuestionnaires] = useState<SurveyQuestionnaire[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES_V111);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement questionnaires', e); }
    }
    return INITIAL_QUESTIONNAIRES_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES_V111, JSON.stringify(surveyQuestionnaires));
  }, [surveyQuestionnaires]);

  const addSurveyQuestionnaire = (q: Omit<SurveyQuestionnaire, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newQ: SurveyQuestionnaire = {
      ...q,
      id: `QST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSurveyQuestionnaires(prev => [newQ, ...prev]);
    addSurveyAuditLog({
      surveyId: 'GLOBAL',
      action: 'CREATION',
      entity: 'QUESTIONNAIRE',
      fieldName: 'questionnaire',
      newValue: `${newQ.name} v${newQ.version}`,
      reason: `Création du questionnaire ${newQ.name} v${newQ.version}`
    });
  };

  const updateSurveyQuestionnaire = (q: SurveyQuestionnaire) => {
    const updated = { ...q, updatedAt: new Date().toISOString() };
    setSurveyQuestionnaires(prev => prev.map(item => (item.id === q.id ? updated : item)));
    addSurveyAuditLog({
      surveyId: 'GLOBAL',
      action: 'MODIFICATION',
      entity: 'QUESTIONNAIRE',
      fieldName: 'sections/questions',
      newValue: q.version,
      reason: `Mise à jour du questionnaire ${q.name} v${q.version}`
    });
  };

  const publishQuestionnaireVersion = (id: string) => {
    setSurveyQuestionnaires(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'PUBLIE', isLocked: true, updatedAt: new Date().toISOString() } : q))
    );
    addSurveyAuditLog({
      surveyId: 'GLOBAL',
      action: 'VALIDATION',
      entity: 'QUESTIONNAIRE',
      previousValue: 'BROUILLON',
      newValue: 'PUBLIE',
      reason: `Publication officielle et verrouillage structurel du questionnaire ${id}`
    });
  };

  const createNextQuestionnaireVersion = (id: string, newVersion: string) => {
    const current = surveyQuestionnaires.find(q => q.id === id);
    if (!current) return;

    const newQ: SurveyQuestionnaire = {
      ...current,
      id: `QST_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      version: newVersion,
      status: 'BROUILLON',
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSurveyQuestionnaires(prev => [newQ, ...prev]);
    addSurveyAuditLog({
      surveyId: 'GLOBAL',
      action: 'CREATION',
      entity: 'QUESTIONNAIRE',
      previousValue: current.version,
      newValue: newVersion,
      reason: `Incrémentation de version vers v${newVersion} pour le questionnaire ${current.name}`
    });
  };

  // 3. Sites & Ménages
  const [surveySites, setSurveySites] = useState<SurveySite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SITES_V111);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement surveySites', e); }
    }
    return INITIAL_SITES_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITES_V111, JSON.stringify(surveySites));
  }, [surveySites]);

  const addSurveySite = (site: Omit<SurveySite, 'id' | 'createdAt'>) => {
    const newSite: SurveySite = {
      ...site,
      id: `SIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    setSurveySites(prev => [newSite, ...prev]);
    addSurveyAuditLog({
      surveyId: 'GLOBAL',
      action: 'CREATION',
      entity: 'SITE',
      newValue: newSite.name,
      reason: `Création du site d'observation ${newSite.name} (${newSite.code})`
    });
  };

  const updateSurveySite = (site: SurveySite) => {
    setSurveySites(prev => prev.map(s => (s.id === site.id ? site : s)));
  };

  const [surveyHouseholds, setSurveyHouseholds] = useState<SurveyHousehold[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS_V111);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement surveyHouseholds', e); }
    }
    return INITIAL_HOUSEHOLDS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS_V111, JSON.stringify(surveyHouseholds));
  }, [surveyHouseholds]);

  const addSurveyHousehold = (hh: Omit<SurveyHousehold, 'id' | 'createdAt'>) => {
    const newHh: SurveyHousehold = {
      ...hh,
      id: `HH_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    setSurveyHouseholds(prev => [newHh, ...prev]);
  };

  // 4. Sessions de Collecte
  const [collectionSessions, setCollectionSessions] = useState<CollectionSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTION_SESSIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement collectionSessions', e); }
    }
    return INITIAL_COLLECTION_SESSIONS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTION_SESSIONS, JSON.stringify(collectionSessions));
  }, [collectionSessions]);

  const addCollectionSession = (session: Omit<CollectionSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: CollectionSession = {
      ...session,
      id: `SES_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCollectionSessions(prev => [newSession, ...prev]);
    addSurveyAuditLog({
      surveyId: session.surveyId,
      sessionId: newSession.id,
      action: 'CREATION',
      entity: 'SESSION',
      newValue: newSession.id,
      reason: `Nouvelle session de collecte initialisée par ${session.surveyorName}`
    });
  };

  const updateCollectionSession = (session: CollectionSession) => {
    const updated: CollectionSession = {
      ...session,
      updatedAt: new Date().toISOString()
    };
    setCollectionSessions(prev => prev.map(s => (s.id === session.id ? updated : s)));
  };

  const submitCollectionSession = (sessionId: string) => {
    setCollectionSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;

        // Auto quality calculation
        const questionnaire = surveyQuestionnaires.find(q => q.id === s.questionnaireId) || INITIAL_QUESTIONNAIRES_V111[0];
        const survey = fieldSurveys.find(surv => surv.id === s.surveyId);
        const pathologyIds = survey?.pathologyIds || ['PATH_MAL', 'PATH_TYP'];
        
        const comp = calculateSurveyCompleteness(questionnaire, s.answers, pathologyIds);
        const qual = validateSessionQuality(questionnaire, s.answers, pathologyIds, s.gps);

        return {
          ...s,
          status: 'SOUMISE',
          completenessScore: comp.completenessScore,
          missingRequiredQuestions: comp.missingRequiredQuestions,
          missingOptionalQuestions: comp.missingOptionalQuestions,
          notApplicableQuestions: comp.notApplicableQuestions,
          dataQualityStatus: qual.status,
          qualityErrors: qual.errors,
          dataTier: 'RAW',
          updatedAt: new Date().toISOString()
        };
      })
    );
    addSurveyAuditLog({
      surveyId: 'SESSION_SUBMIT',
      sessionId: sessionId,
      action: 'SOUMISSION',
      entity: 'SESSION',
      previousValue: 'BROUILLON',
      newValue: 'SOUMISE',
      reason: `Soumission de la session ${sessionId} pour contrôle superviseur`
    });
  };

  const validateCollectionSession = (sessionId: string, supervisorNotes?: string) => {
    setCollectionSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;
        const newComments = supervisorNotes
          ? [
              ...s.supervisorComments,
              {
                id: `COM_${Date.now()}`,
                sessionId: s.id,
                supervisorId: userSession.id,
                supervisorName: userSession.name,
                date: new Date().toISOString(),
                commentType: 'GENERAL' as const,
                message: supervisorNotes,
                resolved: true
              }
            ]
          : s.supervisorComments;

        return {
          ...s,
          status: 'VALIDEE',
          dataTier: 'CLEANED',
          supervisorComments: newComments,
          updatedAt: new Date().toISOString()
        };
      })
    );
    addSurveyAuditLog({
      surveyId: 'SESSION_VALIDATE',
      sessionId: sessionId,
      action: 'VALIDATION',
      entity: 'SESSION',
      previousValue: 'SOUMISE',
      newValue: 'VALIDEE',
      reason: supervisorNotes || 'Validation de conformité terrain effectuée par le superviseur'
    });
  };

  const requestCorrectionCollectionSession = (
    sessionId: string,
    correctionReason: string,
    targetQuestionId?: string
  ) => {
    setCollectionSessions(prev =>
      prev.map(s => {
        if (s.id !== sessionId) return s;

        // Conserver la version précédente sans écrasement
        const currentVersionNumber = (s.previousAnswersHistory?.length || 0) + 1;
        const historyEntry = {
          versionNumber: currentVersionNumber,
          answers: { ...s.answers },
          modifiedAt: new Date().toISOString(),
          modifiedBy: userSession.id,
          correctionReason
        };

        const newComment: SupervisorComment = {
          id: `COM_${Date.now()}`,
          sessionId: s.id,
          supervisorId: userSession.id,
          supervisorName: userSession.name,
          date: new Date().toISOString(),
          commentType: 'DEMANDE_CORRECTION',
          targetQuestionId,
          message: correctionReason,
          resolved: false
        };

        return {
          ...s,
          status: 'A_CORRIGER',
          previousAnswersHistory: [...(s.previousAnswersHistory || []), historyEntry],
          supervisorComments: [...s.supervisorComments, newComment],
          updatedAt: new Date().toISOString()
        };
      })
    );

    addSurveyAuditLog({
      surveyId: 'SESSION_CORRECTION_REQ',
      sessionId: sessionId,
      action: 'DEMANDE_CORRECTION',
      entity: 'SESSION',
      previousValue: 'SOUMISE',
      newValue: 'A_CORRIGER',
      reason: correctionReason
    });
  };

  const rejectCollectionSession = (sessionId: string, reason: string) => {
    setCollectionSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, status: 'REJETEE', updatedAt: new Date().toISOString() } : s))
    );
    addSurveyAuditLog({
      surveyId: 'SESSION_REJECT',
      sessionId: sessionId,
      action: 'REJET',
      entity: 'SESSION',
      previousValue: 'SOUMISE',
      newValue: 'REJETEE',
      reason
    });
  };

  const addSupervisorCommentToSession = (
    sessionId: string,
    comment: Omit<SupervisorComment, 'id' | 'date' | 'supervisorId' | 'supervisorName'>
  ) => {
    const fullComment: SupervisorComment = {
      ...comment,
      id: `COM_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sessionId,
      supervisorId: userSession.id,
      supervisorName: userSession.name,
      date: new Date().toISOString()
    };
    setCollectionSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, supervisorComments: [...s.supervisorComments, fullComment] } : s))
    );
  };

  // 5. Plan de Collecte de Terrain
  const [fieldPlanItems, setFieldPlanItems] = useState<FieldPlanItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIELD_PLANS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement fieldPlans', e); }
    }
    return INITIAL_FIELD_PLANS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FIELD_PLANS, JSON.stringify(fieldPlanItems));
  }, [fieldPlanItems]);

  const updateFieldPlanItem = (item: FieldPlanItem) => {
    setFieldPlanItems(prev => prev.map(p => (p.id === item.id ? item : p)));
    addSurveyAuditLog({
      surveyId: item.surveyId,
      action: 'MODIFICATION',
      entity: 'PLAN',
      newValue: `${item.completedObservations}/${item.plannedObservations}`,
      reason: `Mise à jour de progression du plan de collecte pour ${item.geographicUnitName}`
    });
  };

  // 6. Registres Sanitaires Rétrospectifs
  const [healthRegistryRecords, setHealthRegistryRecords] = useState<HealthRegistryRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HEALTH_REGISTRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement healthRegistries', e); }
    }
    return INITIAL_HEALTH_REGISTRY_RECORDS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH_REGISTRIES, JSON.stringify(healthRegistryRecords));
  }, [healthRegistryRecords]);

  const addHealthRegistryRecord = (record: Omit<HealthRegistryRecord, 'id' | 'createdAt'>) => {
    const newRecord: HealthRegistryRecord = {
      ...record,
      id: `REG_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    setHealthRegistryRecords(prev => [newRecord, ...prev]);
    addSurveyAuditLog({
      surveyId: record.surveyId,
      action: 'CREATION',
      entity: 'REGISTRE',
      newValue: newRecord.patientAnonymousId,
      reason: `Enregistrement rétrospectif saisi pour ${record.patientAnonymousId} (${record.pathologyCode})`
    });
  };

  const bulkAddHealthRegistryRecords = (records: Omit<HealthRegistryRecord, 'id' | 'createdAt'>[]) => {
    const stamped = records.map((r, i) => ({
      ...r,
      id: `REG_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    }));
    setHealthRegistryRecords(prev => [...stamped, ...prev]);
    addSurveyAuditLog({
      surveyId: records[0]?.surveyId || 'BULK_IMPORT',
      action: 'CREATION',
      entity: 'REGISTRE',
      newValue: `${records.length} lignes`,
      reason: `Importation groupée de ${records.length} dossiers de registres sanitaires`
    });
  };

  // 7. Journal d'Audit Spécifique Enquêtes
  const [surveyAuditLogs, setSurveyAuditLogs] = useState<SurveyAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SURVEY_AUDIT_LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error('Erreur chargement surveyAuditLogs', e); }
    }
    return INITIAL_SURVEY_AUDIT_LOGS_V111;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SURVEY_AUDIT_LOGS, JSON.stringify(surveyAuditLogs));
  }, [surveyAuditLogs]);

  const addSurveyAuditLog = (
    log: Omit<SurveyAuditLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>
  ) => {
    const newLog: SurveyAuditLog = {
      ...log,
      id: `AUD_V111_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: userSession.id,
      userName: userSession.name,
      userRole: userSession.role,
      timestamp: new Date().toISOString()
    };
    setSurveyAuditLogs(prev => [newLog, ...prev]);
  };

  // 8. Banc de 15 Tests de Validation Automatisée V1.11
  const [v111TestCounter, setV111TestCounter] = useState(0);

  const v111ValidationTests = useMemo(() => {
    return INITIAL_V111_VALIDATION_TESTS.map(t => {
      // Dynamic test evaluations
      if (t.id === 1) {
        const count = fieldSurveys.length;
        return {
          ...t,
          status: count > 0 ? ('PASSED' as const) : ('FAILED' as const),
          details: `${count} enquête(s) opérationnelle(s) active(s) ou configurée(s).`,
          verifiedAt: new Date().toISOString()
        };
      }
      if (t.id === 2) {
        const qCount = surveyQuestionnaires.length;
        const totalSections = surveyQuestionnaires.reduce((acc, q) => acc + q.sections.length, 0);
        return {
          ...t,
          status: qCount > 0 && totalSections >= 7 ? ('PASSED' as const) : ('FAILED' as const),
          details: `${qCount} questionnaire(s) avec ${totalSections} sections configurées.`,
          verifiedAt: new Date().toISOString()
        };
      }
      if (t.id === 3) {
        const hasLocked = surveyQuestionnaires.some(q => q.isLocked && q.status === 'PUBLIE');
        return {
          ...t,
          status: hasLocked ? ('PASSED' as const) : ('FAILED' as const),
          details: `Verrouillage structurel des versions publiées vérifié (ex: v1.0).`,
          verifiedAt: new Date().toISOString()
        };
      }
      if (t.id === 5) {
        const plans = fieldPlanItems.length;
        return {
          ...t,
          status: plans > 0 ? ('PASSED' as const) : ('FAILED' as const),
          details: `${plans} zone(s) de collecte planifiée(s) avec métriques Prévu/En cours/Réalisé.`,
          verifiedAt: new Date().toISOString()
        };
      }
      if (t.id === 13) {
        const logs = surveyAuditLogs.length;
        return {
          ...t,
          status: logs > 0 ? ('PASSED' as const) : ('FAILED' as const),
          details: `${logs} événement(s) de traçabilité et d’audit enregistrés.`,
          verifiedAt: new Date().toISOString()
        };
      }
      if (t.id === 14) {
        const reg = healthRegistryRecords.length;
        return {
          ...t,
          status: reg > 0 ? ('PASSED' as const) : ('FAILED' as const),
          details: `${reg} dossier(s) de registres sanitaires rétrospectifs structurés.`,
          verifiedAt: new Date().toISOString()
        };
      }
      return {
        ...t,
        verifiedAt: new Date().toISOString()
      };
    });
  }, [
    fieldSurveys,
    surveyQuestionnaires,
    collectionSessions,
    fieldPlanItems,
    healthRegistryRecords,
    surveyAuditLogs,
    v111TestCounter
  ]);

  const runAutomatedValidationV111 = () => {
    setV111TestCounter(prev => prev + 1);
  };

  return (
    <DataContext.Provider
      value={{
        userSession,
        setUserSession,
        availableUsers: INITIAL_USER_SESSIONS,
        healthFacilities,
        addHealthFacility,
        healthRecords,
        climateRecords,
        climateStations,
        climateSources,
        addClimateStation,
        updateClimateStation,
        deleteClimateStation,
        addClimateSource,
        updateClimateSource,
        environmentalObs,
        householdSurveys,
        generateNextHouseholdId,
        generateNextEnvironmentalId,
        generateNextHealthId,
        generateNextClimateId,
        addHouseholdSurvey,
        updateHouseholdSurvey,
        deleteHouseholdSurvey,
        addEnvironmentalObservation,
        updateEnvironmentalObservation,
        deleteEnvironmentalObservation,
        addHealthRecord,
        updateHealthRecord,
        bulkAddHealthRecords,
        recordHealthCorrection,
        resolveHealthDuplicate,
        deleteHealthRecord,
        addClimateRecord,
        updateClimateRecord,
        bulkAddClimateRecords,
        recordClimateCorrection,
        resolveClimateDuplicate,
        deleteClimateRecord,
        updateRecordStatus,
        syncQueue,
        isOffline,
        setIsOffline,
        syncAllPending,
        pendingSyncCount: syncQueue.length,
        lastSyncTime,
        auditLogs,
        addAuditLog,
        modelMatrix,
        qualityIssues,
        resolveQualityIssue,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        selectedHealthAreaId,
        setSelectedHealthAreaId,
        selectedDisease,
        setSelectedDisease,
        clearDemoData,
        resetToInitialDemo,
        // V1.5 Harmonisation & Relations
        geographicUnits,
        setGeographicUnits,
        addGeographicUnit,
        updateGeographicUnit,
        geographicAliases,
        addGeographicAlias,
        seasons,
        updateSeason,
        analysisPeriods,
        healthEnvLinks,
        addHealthEnvLink,
        deleteHealthEnvLink,
        healthClimateLinks,
        addHealthClimateLink,
        deleteHealthClimateLink,
        climateEnvLinks,
        addClimateEnvLink,
        deleteClimateEnvLink,
        dataCorrections,
        addDataCorrection,
        restoreDeletedRecord,
        integratedDataset,
        readinessReport,
        // V1.7 Base Spatio-Temporelle Intégrée
        spatiotemporalUnits,
        healthSpatiotemporal,
        climateSpatiotemporal,
        environmentSpatiotemporal,
        washSpatiotemporal,
        householdAggregates,
        integratedSpatiotemporalData,
        modelReadyData,
        dataQualityChecks,
        dataSources,
        spatiotemporalValidationTests,
        v17ReportSummary,
        resolveQualityCheck,
        runSpatiotemporalTests,
        // V1.8 Module Qualité des Données & Normalisation
        geoReferences,
        duplicateCandidates,
        transformationLogs,
        analysisDataset: currentAnalysisDataset,
        datasetMetadataList,
        selectedDatasetVersion,
        setSelectedDatasetVersion,
        dataQualityOverview,
        modelingFeasibilityReport,
        v18ValidationTests,
        v18ReportSummary,
        resolveDuplicate,
        generateNewAnalysisDataset,
        runAutomatedValidationV18,
        // V1.9 Module Analyse Exploratoire Spatio-Temporelle
        explorationFilters,
        setExplorationFilters,
        resetExplorationFilters,
        analysisLogs,
        addAnalysisLog,
        v19ValidationTests,
        v19ExploratoryReport,
        v19TestStats: { passed: v19Passed, failed: v19Failed, verdict: v19Verdict },
        runAutomatedValidationV19,
        // V1.10 Extension Maniema & Multi-Pathologies One Health
        isDemoMode,
        setIsDemoMode,
        maniemaGeoUnits,
        setManiemaGeoUnits,
        addManiemaGeoUnit,
        updateManiemaGeoUnit,
        toggleManiemaGeoUnitStatus,
        pathologies,
        setPathologies,
        addPathology,
        updatePathology,
        togglePathologyActive,
        oneHealthProjects,
        setOneHealthProjects,
        activeProjectId,
        setActiveProjectId,
        addOneHealthProject,
        updateOneHealthProject,
        timePeriodConfigs,
        setTimePeriodConfigs,
        addTimePeriodConfig,
        updateTimePeriodConfig,
        usersV110,
        dynamicObservations,
        setDynamicObservations,
        addDynamicObservation,
        updateDynamicObservation,
        deleteDynamicObservation,
        v110ValidationTests,
        runAutomatedValidationV110,
        // V1.11 Module Enquêtes Opérationnelles & Supervision
        fieldSurveys,
        setFieldSurveys,
        addFieldSurvey,
        updateFieldSurvey,
        deleteFieldSurvey,
        surveyQuestionnaires,
        setSurveyQuestionnaires,
        addSurveyQuestionnaire,
        updateSurveyQuestionnaire,
        publishQuestionnaireVersion,
        createNextQuestionnaireVersion,
        surveySites,
        addSurveySite,
        updateSurveySite,
        surveyHouseholds,
        addSurveyHousehold,
        collectionSessions,
        setCollectionSessions,
        addCollectionSession,
        updateCollectionSession,
        submitCollectionSession,
        validateCollectionSession,
        requestCorrectionCollectionSession,
        rejectCollectionSession,
        addSupervisorCommentToSession,
        fieldPlanItems,
        setFieldPlanItems,
        updateFieldPlanItem,
        healthRegistryRecords,
        addHealthRegistryRecord,
        bulkAddHealthRegistryRecords,
        surveyAuditLogs,
        addSurveyAuditLog,
        v111ValidationTests,
        runAutomatedValidationV111,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
