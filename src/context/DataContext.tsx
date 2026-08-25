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
} from '../types';
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
