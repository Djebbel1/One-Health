import {
  SecurityEnvironmentConfig,
  SecurityUserSession,
  ConnectedDevice,
  MFAConfiguration,
  RolePermissionMatrixEntry,
  GranularModulePermission,
  DataPrivacyRule,
  ExportSecurityPolicy,
  SecurityAuditLogEntry,
  BackupRecord,
  DisasterRecoveryPlan,
  RecycleBinItem,
  SystemHealthMetric,
  CentralSystemError,
  ProductionReadinessReport,
  FeatureFlag,
  MaintenanceConfig,
  DataRetentionPolicy,
  V120SecurityScenarioTest,
  UserRole
} from '../types';

export const DEFAULT_SECURITY_ENV_CONFIG: SecurityEnvironmentConfig = {
  activeEnvironment: 'DEVELOPMENT',
  bannerVisible: true,
  bannerMessage: 'Environnement de DÉVELOPPEMENT & DÉMONSTRATION — Données fictives et tests opérationnels One Health Maniema.',
  isStrictProductionMode: false,
  allowDemoDataInsertion: true,
  sslEnforced: true,
  rateLimitEnabled: true,
  rateLimitMaxRequestsPerMinute: 120,
  corsAllowedOrigins: ['https://uniki-onehealth.cd', 'https://dps-maniema.cd', 'http://localhost:3000'],
  sessionTimeoutMinutes: 60
};

export const MOCK_SECURITY_USER_SESSION: SecurityUserSession = {
  sessionId: 'SES-UNIKI-2026-0830-01',
  userId: 'USR_CHERCHEUR_01',
  userName: 'Pr. Dieudonné Kalonda',
  userEmail: 'd.kalonda@uniki.ac.cd',
  userRole: 'CHERCHEUR',
  institution: 'Université de Kindu / Lab Épidémiologie',
  assignedProjects: ['PRJ-KND-001', 'PRJ-KAS-002'],
  environment: 'DEVELOPMENT',
  tokenExpiresAt: '2026-08-30 18:48',
  lastActivityAt: '2026-08-30 08:48',
  sessionDurationMinutes: 60,
  mfaStatus: 'DISABLED',
  failedLoginAttempts: 0,
  isLockedOut: false,
  currentIp: '105.178.112.9 (VSAT UNIKI Kindu)',
  currentBrowser: 'Firefox 128.0.2 Quantum (ESR)',
  currentOs: 'Ubuntu Linux 24.04 LTS',
  deviceFingerprint: 'FP-UNIKI-7440-LINUX-9A4B2C'
};

export const INITIAL_CONNECTED_DEVICES: ConnectedDevice[] = [
  {
    deviceId: 'DEV-TAB-KND-01',
    userId: 'USR_ENQUETEUR_01',
    deviceName: 'Samsung Galaxy Tab Active 4 Pro (Kindu-Centre)',
    deviceType: 'TABLET',
    os: 'Android 13 OneUI 5.1 Enterprise',
    browser: 'Chrome Mobile 126.0 (PWA Offline)',
    ipAddress: '197.234.218.44 (Airtel RDC Maniema)',
    locationCity: 'Kindu, RDC',
    lastActive: '2026-08-30 08:35',
    environment: 'DEVELOPMENT',
    isCurrentDevice: false,
    isRevoked: false
  },
  {
    deviceId: 'DEV-LAP-UNIKI-01',
    userId: 'USR_CHERCHEUR_01',
    deviceName: 'Dell Latitude 7440 (UNIKI Lab Épidémiologie)',
    deviceType: 'DESKTOP',
    os: 'Ubuntu Linux 24.04 LTS (Kernel 6.8)',
    browser: 'Firefox 128.0.2 Quantum (ESR)',
    ipAddress: '105.178.112.9 (VSAT UNIKI Kindu)',
    locationCity: 'Kindu (Campus Universitaire)',
    lastActive: '2026-08-30 08:48',
    environment: 'DEVELOPMENT',
    isCurrentDevice: true,
    isRevoked: false
  },
  {
    deviceId: 'DEV-MOB-KAS-03',
    userId: 'USR_ENQUETEUR_02',
    deviceName: 'Nokia G22 Field Kit (Kasongo Rural)',
    deviceType: 'MOBILE',
    os: 'Android 12 Enterprise',
    browser: 'OneHealth Mobile Client v1.18',
    ipAddress: '197.234.220.12 (Vodacom RDC)',
    locationCity: 'Kasongo, RDC',
    lastActive: '2026-08-29 16:20',
    environment: 'DEVELOPMENT',
    isCurrentDevice: false,
    isRevoked: false
  },
  {
    deviceId: 'DEV-DESK-DPS-01',
    userId: 'USR_SUPERVISEUR_01',
    deviceName: 'HP EliteDesk 800 G9 (DPS Maniema Direction)',
    deviceType: 'DESKTOP',
    os: 'Windows 11 Pro Enterprise 23H2',
    browser: 'Microsoft Edge 126.0',
    ipAddress: '105.178.115.34 (Fibre Maniema Telco)',
    locationCity: 'Kindu, Maniema',
    lastActive: '2026-08-30 07:55',
    environment: 'DEVELOPMENT',
    isCurrentDevice: false,
    isRevoked: false
  }
];

export const DEFAULT_MFA_CONFIG: MFAConfiguration = {
  enabled: false,
  type: 'TOTP',
  maskedSecretKey: 'JBSWY3DPEHPK3PXP••••••••',
  backupCodesRemaining: 8,
  lastVerifiedAt: '2026-08-25 14:10',
  requiresExternalProviderNotice: true,
  externalProviderDocs: 'Intégration d authentification externe requise (ex: Firebase Auth, Keycloak ou Twilio Verify) pour l envoi réel de SMS ou vérification matérielle FIDO2.'
};

export const DEFAULT_ROLE_PERMISSION_MATRIX: RolePermissionMatrixEntry[] = [
  {
    role: 'ADMINISTRATEUR',
    roleDescription: 'Accès souverain total : sécurité, sauvegardes, restauration, audits, RBAC et déploiement.',
    projectAccessScope: 'ALL',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: true, canExportFull: true, canExportAnonymized: true, canAdminister: true }
    ]
  },
  {
    role: 'CHERCHEUR',
    roleDescription: 'Investigateur Principal : modélisation, validation scientifique, protocoles, analyse et exports complets autorisés.',
    projectAccessScope: 'ALL',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: true, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  },
  {
    role: 'SUPERVISEUR',
    roleDescription: 'Superviseur de Zone & Contrôle Qualité : validation de niveau 2/3, gestion des fiches terrain et alertes.',
    projectAccessScope: 'ASSIGNED_ONLY',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: true, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: true, canCreate: false, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: true, canCreate: true, canUpdate: false, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  },
  {
    role: 'ENQUETEUR_TERRAIN',
    roleDescription: 'Enquêteur Mobile Terrain : saisie, capture GPS, synchronisation hors-ligne. Moindre privilège strict.',
    projectAccessScope: 'ASSIGNED_ONLY',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  },
  {
    role: 'AGENT DE SAISIE',
    roleDescription: 'Agent de Saisie Stations Météo & Registres CS : saisie ciblée des relevés sans accès aux analyses avancées.',
    projectAccessScope: 'ASSIGNED_ONLY',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: true, canCreate: true, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  },
  {
    role: 'ANALYSTE',
    roleDescription: 'Statisticien & Modélisateur : accès lecture aux datasets CLEAN et ANALYTIC, modélisation et rapports.',
    projectAccessScope: 'ALL',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: true, canCreate: true, canUpdate: true, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: true, canCreate: true, canUpdate: true, canValidate: true, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: true, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: true, canCreate: true, canUpdate: true, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: true, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  },
  {
    role: 'ENQUÊTEUR',
    roleDescription: 'Variante de rôle Enquêteur pour compatibilité ascendante V1.0.',
    projectAccessScope: 'ASSIGNED_ONLY',
    modules: [
      { moduleKey: 'COLLECTE', moduleLabel: 'Collecte Mobile Terrain', canRead: true, canCreate: true, canUpdate: true, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'DONNEES', moduleLabel: 'Entrepôt RAW & CLEAN', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'QUALITE', moduleLabel: 'Contrôle & Validation 4-Niveaux', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ANALYSE', moduleLabel: 'Laboratoire & Exploration', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'MODELES', moduleLabel: 'Modélisation & Prédictions', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'SURVEILLANCE', moduleLabel: 'Surveillance & Alertes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'RAPPORTS', moduleLabel: 'Rapports & Synthèses', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false },
      { moduleKey: 'ADMINISTRATION', moduleLabel: 'Sécurité & Sauvegardes', canRead: false, canCreate: false, canUpdate: false, canValidate: false, canSoftDelete: false, canHardDelete: false, canExportFull: false, canExportAnonymized: false, canAdminister: false }
    ]
  }
];

export const DEFAULT_DATA_PRIVACY_RULES: DataPrivacyRule[] = [
  {
    fieldKey: 'respondentName',
    fieldLabel: 'Nom complet du répondant / Chef de ménage',
    category: 'IDENTITE',
    isPII: true,
    maskingStrategy: 'PSEUDONYMIZATION',
    pseudonymPrefix: 'PART-',
    allowedRolesForRaw: ['ADMINISTRATEUR', 'SUPERVISEUR'],
    description: 'Remplacé automatiquement par un identifiant anonyme structuré PART-XXXXXX pour les analyses scientifiques et exports publics.'
  },
  {
    fieldKey: 'gpsLatitudeLongitude',
    fieldLabel: 'Coordonnées GPS exactes (précision submétrique)',
    category: 'GEOLOCALISATION',
    isPII: true,
    maskingStrategy: 'GEO_JITTER',
    pseudonymPrefix: 'GEO-ZONE-',
    allowedRolesForRaw: ['ADMINISTRATEUR', 'SUPERVISEUR', 'CHERCHEUR'],
    description: 'Bruitage spatial contrôlé (jittering gaussien de 100 à 250m) lors des exports anonymisés pour protéger la vie privée des ménages.'
  },
  {
    fieldKey: 'phoneNumber',
    fieldLabel: 'Numéro de téléphone mobile du contact',
    category: 'CONTACT',
    isPII: true,
    maskingStrategy: 'REDACTION',
    allowedRolesForRaw: ['ADMINISTRATEUR'],
    description: 'Masqué complètement (+243 •••••••••) sur toutes les interfaces analytiques.'
  },
  {
    fieldKey: 'parcelNumber',
    fieldLabel: 'Numéro de parcelle et adresse cadastrale',
    category: 'GEOLOCALISATION',
    isPII: true,
    maskingStrategy: 'REDACTION',
    allowedRolesForRaw: ['ADMINISTRATEUR', 'SUPERVISEUR'],
    description: 'Non inclus dans les exports scientifiques afin d empêcher toute ré-identification.'
  },
  {
    fieldKey: 'clinicalNotes',
    fieldLabel: 'Observations cliniques libres du médecin',
    category: 'CLINIQUE',
    isPII: false,
    maskingStrategy: 'HASHING',
    allowedRolesForRaw: ['ADMINISTRATEUR', 'CHERCHEUR', 'SUPERVISEUR'],
    description: 'Vérification automatisée contre l inclusion de noms propres dans le texte libre.'
  }
];

export const INITIAL_SECURITY_AUDIT_LOGS: SecurityAuditLogEntry[] = [
  {
    id: 'SEC-LOG-2026-0830-01',
    timestamp: '2026-08-30 08:48',
    action: 'LOGIN_SUCCESS',
    severity: 'INFO',
    userId: 'USR_CHERCHEUR_01',
    userName: 'Pr. Dieudonné Kalonda',
    userRole: 'CHERCHEUR',
    ipAddress: '105.178.112.9 (VSAT UNIKI Kindu)',
    environment: 'DEVELOPMENT',
    resourceTarget: 'AUTH_SUBSYSTEM',
    details: 'Authentification réussie via jeton de session chiffré. Empreinte appareil validée.',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0830-02',
    timestamp: '2026-08-30 08:30',
    action: 'BACKUP_CREATED',
    severity: 'INFO',
    userId: 'USR-SYS-AUTOBACKUP',
    userName: 'Automated Backup Engine V1.20',
    userRole: 'ADMINISTRATEUR',
    ipAddress: '127.0.0.1 (Local Container)',
    environment: 'DEVELOPMENT',
    resourceTarget: 'BACKUP_CENTER',
    details: 'Snapshot complet quotidien généré : BKP-20260830-DAILY-01 (SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855).',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0830-03',
    timestamp: '2026-08-30 08:15',
    action: 'BACKUP_INTEGRITY_VERIFIED',
    severity: 'INFO',
    userId: 'USR-SYS-VERIFY',
    userName: 'Integrity Verification Subsystem',
    userRole: 'ADMINISTRATEUR',
    ipAddress: '127.0.0.1',
    environment: 'DEVELOPMENT',
    resourceTarget: 'BACKUP_STORAGE',
    details: 'Contrôle d intégrité réussi sur 4 archives de sauvegarde. Sommes de contrôle SHA-256 conformes.',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0829-04',
    timestamp: '2026-08-29 17:42',
    action: 'EXPORT_ANONYMIZED',
    severity: 'INFO',
    userId: 'USR_SUPERVISEUR_01',
    userName: 'Dr. Jeanne Mwamba',
    userRole: 'SUPERVISEUR',
    ipAddress: '105.178.115.34 (DPS Maniema)',
    environment: 'DEVELOPMENT',
    resourceTarget: 'DATASET: DS-CLEAN-2026',
    details: 'Export anonymisé validé pour analyse épidémiologique. 320 enregistrements (PII masquées).',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0829-05',
    timestamp: '2026-08-29 14:12',
    action: 'UNAUTHORIZED_ACCESS_BLOCKED',
    severity: 'WARNING',
    userId: 'USR_ENQUETEUR_01',
    userName: 'Jean-Pierre Amisi',
    userRole: 'ENQUETEUR_TERRAIN',
    ipAddress: '197.234.218.44',
    environment: 'DEVELOPMENT',
    resourceTarget: 'MODULE: MODELISATION_STATISTIQUE',
    details: 'Tentative d accès au module de modélisation bloquée par la politique RBAC (Moindre Privilège).',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0829-06',
    timestamp: '2026-08-29 11:05',
    action: 'SECRETS_INTEGRITY_CHECK',
    severity: 'INFO',
    userId: 'USR-SYS-AUDITOR',
    userName: 'Security Scanner Engine',
    userRole: 'ADMINISTRATEUR',
    ipAddress: '127.0.0.1',
    environment: 'DEVELOPMENT',
    resourceTarget: 'FRONTEND_BUNDLE_AND_LOGS',
    details: 'Scan de conformité : 0 clé API, 0 secret et 0 mot de passe en clair détectés dans les bundles publics.',
    isImmutable: true,
    isSanitized: true
  },
  {
    id: 'SEC-LOG-2026-0828-07',
    timestamp: '2026-08-28 16:30',
    action: 'STAGING_TEST_RESTORE',
    severity: 'INFO',
    userId: 'USR_ADMIN_01',
    userName: 'Ing. Patient Lukanga',
    userRole: 'ADMINISTRATEUR',
    ipAddress: '105.178.112.18',
    environment: 'STAGING',
    resourceTarget: 'RESTORE_PIPELINE',
    details: 'Test de restauration exécuté avec succès dans l environnement STAGING. Aucune perte de données.',
    isImmutable: true,
    isSanitized: true
  }
];

export const INITIAL_BACKUP_RECORDS: BackupRecord[] = [
  {
    backupId: 'BKP-20260830-DAILY-01',
    name: 'Sauvegarde Quotidienne Automatique (Maniema One Health)',
    backupType: 'SCHEDULED_DAILY',
    createdAt: '2026-08-30 04:00',
    createdBy: 'Système Planifié (Cron Daily)',
    environmentSource: 'DEVELOPMENT',
    fileSizeBytes: 14857600, // ~14.1 MB
    sha256Hash: 'a8f5c9e2b1d43768e14298fc1c149afbf4c8996fb92427ae41e4649b934ca495',
    tablesIncluded: [
      'study_projects',
      'study_protocols',
      'data_dictionary',
      'household_surveys',
      'health_records',
      'climate_records',
      'environmental_obs',
      'multilevel_validations',
      'reproducible_models',
      'central_audit_log'
    ],
    recordCounts: {
      projects: 3,
      datasets: 6,
      surveys: 124,
      models: 4,
      protocols: 3,
      validations: 18
    },
    status: 'VERIFIED',
    verifiedAt: '2026-08-30 04:05',
    verificationStatus: 'PASSED',
    retentionDays: 30,
    isEncrypted: true,
    downloadUrlMasked: 'https://secure-backup.onehealth.cd/archives/2026/08/BKP-20260830-DAILY-01.enc'
  },
  {
    backupId: 'BKP-20260824-WEEKLY-01',
    name: 'Sauvegarde Hebdomadaire Consolidée (Semaine 34)',
    backupType: 'SCHEDULED_WEEKLY',
    createdAt: '2026-08-24 02:00',
    createdBy: 'Système Planifié (Cron Weekly)',
    environmentSource: 'DEVELOPMENT',
    fileSizeBytes: 13980000,
    sha256Hash: '7b23c84f1a23e49afbf4c8996fb92427ae41e4649b934ca495991b7852ff119e',
    tablesIncluded: [
      'study_projects',
      'study_protocols',
      'data_dictionary',
      'household_surveys',
      'health_records',
      'climate_records',
      'environmental_obs',
      'multilevel_validations',
      'reproducible_models'
    ],
    recordCounts: {
      projects: 3,
      datasets: 5,
      surveys: 110,
      models: 3,
      protocols: 3,
      validations: 14
    },
    status: 'VERIFIED',
    verifiedAt: '2026-08-24 02:10',
    verificationStatus: 'PASSED',
    retentionDays: 90,
    isEncrypted: true,
    downloadUrlMasked: 'https://secure-backup.onehealth.cd/archives/2026/08/BKP-20260824-WEEKLY-01.enc'
  },
  {
    backupId: 'BKP-20260820-PREMIG-V119',
    name: 'Point de Restauration Pré-Migration V1.19 (Gouvernance & Dictionnaire)',
    backupType: 'PRE_MIGRATION_SNAPSHOT',
    createdAt: '2026-08-20 18:30',
    createdBy: 'Ing. Patient Lukanga',
    environmentSource: 'DEVELOPMENT',
    fileSizeBytes: 12450000,
    sha256Hash: '3a495991b7852ff119ea8f5c9e2b1d43768e14298fc1c149afbf4c8996fb9242',
    tablesIncluded: [
      'study_projects',
      'study_protocols',
      'data_dictionary',
      'household_surveys',
      'health_records',
      'climate_records',
      'environmental_obs'
    ],
    recordCounts: {
      projects: 2,
      datasets: 4,
      surveys: 95,
      models: 2,
      protocols: 2,
      validations: 8
    },
    status: 'VERIFIED',
    verifiedAt: '2026-08-20 18:35',
    verificationStatus: 'PASSED',
    retentionDays: 180,
    isEncrypted: true,
    downloadUrlMasked: 'https://secure-backup.onehealth.cd/archives/2026/08/BKP-20260820-PREMIG-V119.enc'
  },
  {
    backupId: 'BKP-20260810-MANUAL-FULL',
    name: 'Sauvegarde Manuelle d Archive Trimestrielle',
    backupType: 'MANUAL',
    createdAt: '2026-08-10 10:15',
    createdBy: 'Pr. Dieudonné Kalonda',
    environmentSource: 'DEVELOPMENT',
    fileSizeBytes: 11800000,
    sha256Hash: '9afbf4c8996fb92427ae41e4649b934ca495991b7852ff119ea8f5c9e2b1d437',
    tablesIncluded: [
      'household_surveys',
      'health_records',
      'climate_records',
      'environmental_obs'
    ],
    recordCounts: {
      projects: 2,
      datasets: 3,
      surveys: 80,
      models: 2,
      protocols: 1,
      validations: 5
    },
    status: 'VERIFIED',
    verifiedAt: '2026-08-10 10:20',
    verificationStatus: 'PASSED',
    retentionDays: 365,
    isEncrypted: true,
    downloadUrlMasked: 'https://secure-backup.onehealth.cd/archives/2026/08/BKP-20260810-MANUAL-FULL.enc'
  }
];

export const DEFAULT_DISASTER_RECOVERY_PLAN: DisasterRecoveryPlan = {
  rpoTargetMinutes: 60,
  rpoEstimatedMinutes: 45,
  rtoTargetMinutes: 30,
  rtoEstimatedMinutes: 20,
  lastDrTestDate: '2026-08-28 16:30',
  drTestResult: 'SUCCESS',
  responsibleTeam: 'Cellule Technique Informatique & Épidémiologie (UNIKI / DPS Maniema)',
  emergencyHotline: '+243 81 000 0000 (Astreinte 24/7)',
  procedures: [
    {
      stepNumber: 1,
      title: 'Détection & Qualification de l Incident Majeur',
      roleResponsible: 'Administrateur Système / Astreinte',
      expectedDurationMinutes: 3,
      instructions: 'Vérifier les sondes de santé système. Si la base de données ou le conteneur est inaccessible depuis plus de 5 minutes, déclarer l état d incident et basculer en mode lecture seule ou page de maintenance.',
      verificationCriteria: 'Status incident notifié aux membres du comité de gouvernance et journalisé dans le Security Audit Log.'
    },
    {
      stepNumber: 2,
      title: 'Isolement & Préservation des Données Locales / Offline',
      roleResponsible: 'Superviseur Technique',
      expectedDurationMinutes: 4,
      instructions: 'Envoyer une consigne automatique aux tablettes terrain pour figer les synchronisations sortantes et préserver le cache local IndexedDB sans écrasement.',
      verificationCriteria: 'Toutes les files de synchronisation locales sont verrouillées en mode sécurisé.'
    },
    {
      stepNumber: 3,
      title: 'Sélection & Validation du Dernier Snapshot Fiable (SHA-256)',
      roleResponsible: 'Responsable Données / Chercheur Principal',
      expectedDurationMinutes: 3,
      instructions: 'Identifier la sauvegarde la plus récente ayant le statut "PASSED". Contrôler l empreinte SHA-256 contre le registre immuable.',
      verificationCriteria: 'Checksum vérifié à 100% avec signature cryptographique valide.'
    },
    {
      stepNumber: 4,
      title: 'Restauration Sécurisée en Environnement de Qualification (STAGING)',
      roleResponsible: 'Ingénieur Base de Données',
      expectedDurationMinutes: 6,
      instructions: 'Injecter l archive dans l instance STAGING. Vérifier le décompte des tables (projets, protocoles, enquêtes, modèles, validations). Exécuter les tests automatiques de non-régression.',
      verificationCriteria: '100% des tests de cohérence relationnelle et décomptes validés sans corruption.'
    },
    {
      stepNumber: 5,
      title: 'Bascule vers la Production & Réouverture Contrôlée',
      roleResponsible: 'Comité de Gouvernance One Health',
      expectedDurationMinutes: 4,
      instructions: 'Appliquer la restauration sur l environnement de Production. Lever le mode maintenance. Réactiver la synchronisation bidirectionnelle des tablettes de terrain.',
      verificationCriteria: 'Plateforme opérationnelle, indicateur 🟢 Opérationnel, synchronisation des données rétablie.'
    }
  ],
  contingencyContacts: [
    { role: 'Chercheur Principal & Coordinateur One Health', name: 'Pr. Dieudonné Kalonda', contact: 'd.kalonda@uniki.ac.cd | +243 81 234 5678', escalationTier: 1 },
    { role: 'Médecin Chef de Zone / DPS Maniema', name: 'Dr. Jeanne Mwamba', contact: 'j.mwamba@sante.gouv.cd | +243 82 345 6789', escalationTier: 1 },
    { role: 'Administrateur Systèmes & Sécurité', name: 'Ing. Patient Lukanga', contact: 'p.lukanga@uniki.ac.cd | +243 89 456 7890', escalationTier: 2 },
    { role: 'Support Infrastructure & Réseau VSAT', name: 'Astreinte Télécoms Kindu', contact: 'support@telecom-maniema.cd | +243 84 567 8901', escalationTier: 3 }
  ]
};

export const INITIAL_RECYCLE_BIN_ITEMS: RecycleBinItem[] = [
  {
    itemId: 'REC-SRV-2026-0091',
    itemType: 'SURVEY_RECORD',
    title: 'Fiche Enquête Ménage #0091 (Kasongo Rural - Doublon de test)',
    deletedBy: 'Dr. Jeanne Mwamba (Superviseur)',
    deletedAt: '2026-08-29 15:30',
    reason: 'Doublon technique saisi lors d un entraînement terrain à Kasongo. Données de test à exclure du dataset analytique.',
    projectId: 'PRJ-KAS-002',
    originalData: {
      surveyId: 'SRV-KAS-0091',
      householdCode: 'KAS-RUR-091',
      respondent: 'Test Démo Enquêteur',
      recordedCases: 0
    },
    isPermanentDeletable: false,
    expiresAt: '2026-09-28 15:30'
  },
  {
    itemId: 'REC-VAR-2026-0014',
    itemType: 'DATASET_ROW',
    title: 'Variable Expérimentale Provisoire : temp_surface_kest (Obsolète)',
    deletedBy: 'Pr. Dieudonné Kalonda (Chercheur)',
    deletedAt: '2026-08-28 11:20',
    reason: 'Remplacée officiellement par la variable normalisée VAR-ENV-001 (Température de surface ERA5-Land).',
    projectId: 'PRJ-KND-001',
    originalData: {
      varCode: 'temp_surface_kest',
      formula: 'raw_kest_kelvin - 273.15',
      replacedBy: 'VAR-ENV-001'
    },
    isPermanentDeletable: true,
    expiresAt: '2026-09-27 11:20'
  },
  {
    itemId: 'REC-MDL-2026-0003',
    itemType: 'MODEL_CONFIG',
    title: 'Itération Modèle GAM #3 (Hyperparamètres non convergents)',
    deletedBy: 'Pr. Dieudonné Kalonda (Chercheur)',
    deletedAt: '2026-08-27 09:40',
    reason: 'Divergence des splines sur les données hebdomadaires 2025. Archive supprimée logiquement au profit du modèle scellé MOD-GAM-2026-01.',
    projectId: 'PRJ-KND-001',
    originalData: {
      modelId: 'MOD-GAM-EXP-03',
      family: 'nb',
      convergence: false
    },
    isPermanentDeletable: true,
    expiresAt: '2026-09-26 09:40'
  }
];

export const INITIAL_SYSTEM_HEALTH_METRIC: SystemHealthMetric = {
  status: 'OPERATIONAL',
  uptimePercentage: 99.85,
  backendApiLatencyMs: 42,
  dbConnectionStatus: 'CONNECTED',
  storageUsedMb: 342.8,
  storageTotalMb: 2048.0,
  storageWarningThresholdMb: 1740.0, // 85%
  isStorageLow: false,
  syncQueuePendingCount: 0,
  syncFailureRatePercent: 0.2,
  offlineCacheSizeMb: 18.4,
  lastSuccessfulSync: '2026-08-30 08:35 (DEV-TAB-KND-01)',
  activeErrorsCount: 0,
  serverClockSyncOffsetMs: 12
};

export const INITIAL_CENTRAL_ERRORS: CentralSystemError[] = [
  {
    errorId: 'ERR-NET-2026-0829-01',
    timestamp: '2026-08-29 16:18',
    module: 'SYNCHRONISATION_TERRAIN',
    severity: 'WARNING',
    userMessage: 'Réseau mobile instable lors de la synchronisation de la fiche SRV-KAS-0089. La fiche a été conservée en sécurité dans la mémoire locale hors-ligne et sera retransmise au retour du signal.',
    sanitizedTechnicalCode: 'NETWORK_TIMEOUT_AIRTEL_MANIEMA_HTTP_504_RETRIED_LOCALLY',
    resolutionStatus: 'RESOLVED',
    reportedBy: 'DEV-MOB-KAS-03',
    remedyAction: 'Retransmission automatique réussie lors de la reconnexion à 16:22.'
  },
  {
    errorId: 'ERR-VAL-2026-0828-02',
    timestamp: '2026-08-28 14:05',
    module: 'CONTROLE_INTEGRITE_IMPORT',
    severity: 'INFO',
    userMessage: 'Un fichier de relevés pluviométriques a été rejeté car son empreinte SHA-256 existait déjà dans l entrepôt RAW.',
    sanitizedTechnicalCode: 'DUPLICATE_FILE_SHA256_MATCH_REJECTED',
    resolutionStatus: 'RESOLVED',
    reportedBy: 'INGESTION_PIPELINE',
    remedyAction: 'Notification affichée au superviseur, aucune corruption ni écrasement.'
  }
];

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: 'STAGING_AUTO_DIFF_CHECK',
    label: 'Comparateur Diff Automatique avant Migration',
    description: 'Calcule et affiche le delta structurel exact avant toute migration de schéma ou de protocole.',
    isEnabled: true,
    isExperimental: false,
    category: 'SYNC',
    impactRisk: 'FAIBLE'
  },
  {
    key: 'OFFLINE_LOCAL_ENCRYPTION_V2',
    label: 'Chiffrement Local du Cache IndexedDB (AES-GCM)',
    description: 'Chiffre les fiches en attente de synchronisation sur les tablettes Android hors-ligne.',
    isEnabled: true,
    isExperimental: false,
    category: 'SYNC',
    impactRisk: 'FAIBLE'
  },
  {
    key: 'EARLY_WARNING_SAT_PRECIPITATION',
    label: 'Algorithme d Alerte Précoce Pluviométrie CHIRPS',
    description: 'Déclenche des pré-alertes de risque d inondation et prolifération vectorielle dès J-7.',
    isEnabled: true,
    isExperimental: false,
    category: 'SURVEILLANCE',
    impactRisk: 'MOYEN'
  },
  {
    key: 'EXPERIMENTAL_GAM_SPATIAL_INTERACTION',
    label: 'Modèle Expérimental Interaction Espace-Climat (BETA)',
    description: 'Modélisation non-linéaire des interactions température x gîtes larvaires. Marquée BETA.',
    isEnabled: false,
    isExperimental: true,
    category: 'MODELISATION',
    impactRisk: 'ELEVE'
  },
  {
    key: 'HIGH_DENSITY_SURVEY_COMPRESSION',
    label: 'Compression Haute Densité des Fiches Ménages',
    description: 'Compresse les données géospatiales pour réduire de 60% l utilisation de la bande passante 2G/3G.',
    isEnabled: true,
    isExperimental: false,
    category: 'GEO_ANALYTICS',
    impactRisk: 'FAIBLE'
  }
];

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isMaintenanceActive: false,
  reason: 'Maintenance préventive programmée : optimisation des index spatiotemporels et sauvegarde trimestrielle.',
  scheduledStart: '2026-09-05 23:00',
  scheduledEnd: '2026-09-06 01:00',
  allowedBypassRoles: ['ADMINISTRATEUR'],
  noticeBannerText: 'Une fenêtre de maintenance système est planifiée le samedi 5 septembre de 23h00 à 01h00 UTC+2.'
};

export const DEFAULT_DATA_RETENTION_POLICIES: DataRetentionPolicy[] = [
  {
    policyId: 'RET-POL-RAW',
    dataType: 'Données Brutes de Collecte (RAW Datasets)',
    retentionPeriodDays: 3650, // 10 ans (Standard recherche épidémiologique RDC)
    autoArchive: true,
    purgePolicy: 'NEVER_PURGE',
    lastExecution: '2026-08-01',
    nextScheduledRun: '2026-09-01'
  },
  {
    policyId: 'RET-POL-AUDIT',
    dataType: 'Journaux d Audit Central & Sécurité',
    retentionPeriodDays: 1825, // 5 ans (Conformité réglementaire)
    autoArchive: true,
    purgePolicy: 'NEVER_PURGE',
    lastExecution: '2026-08-01',
    nextScheduledRun: '2026-09-01'
  },
  {
    policyId: 'RET-POL-EXPORTS',
    dataType: 'Fichiers d Exportation Téléchargés (Excel/CSV temporaires)',
    retentionPeriodDays: 30, // 30 jours
    autoArchive: false,
    purgePolicy: 'SOFT_DELETE_ONLY',
    lastExecution: '2026-08-25',
    nextScheduledRun: '2026-09-01'
  },
  {
    policyId: 'RET-POL-RECYCLE',
    dataType: 'Éléments de la Corbeille (Suppressions Logiques)',
    retentionPeriodDays: 60, // 60 jours avant archivage froid
    autoArchive: true,
    purgePolicy: 'SOFT_DELETE_ONLY',
    lastExecution: '2026-08-20',
    nextScheduledRun: '2026-09-01'
  }
];

export const INITIAL_PRODUCTION_CHECK_ITEMS = [
  // 1. SÉCURITÉ
  {
    id: 'CHK-SEC-01',
    category: 'SECURITY' as const,
    title: 'Authentification Renforcée & Sessions Chiffrées',
    description: 'Gestion des sessions actives, expiration automatique et invalidation propre à la déconnexion.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Sessions gérées avec jetons signés, délai d expiration de 60 min et révocation multi-appareils active.'
  },
  {
    id: 'CHK-SEC-02',
    category: 'SECURITY' as const,
    title: 'Principe du Moindre Privilège & Matrice RBAC Granulaire',
    description: 'Chaque rôle opérationnel dispose strictement des accès nécessaires. Contrôles appliqués au niveau des services.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Matrice de 8 domaines de permissions avec isolation hermétique des projets non assignés.'
  },
  {
    id: 'CHK-SEC-03',
    category: 'SECURITY' as const,
    title: 'Protection Absolue des Secrets & Clés API Frontend',
    description: 'Aucune clé API, mot de passe ou credential d infrastructure n est exposé dans le code client ou les logs.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Vérifié par scan statique : 0 clé Gemini ou token dans les bundles publics. Utilisation des variables d environnement.'
  },
  {
    id: 'CHK-SEC-04',
    category: 'SECURITY' as const,
    title: 'Journal de Sécurité Dédié & Immuabilité des Logs',
    description: 'Traçabilité des connexions, modifications de privilèges, exports de données et tentatives d accès refusées.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Security Audit Log actif avec sanitisation des données personnelles et chaînage chronologique.'
  },

  // 2. DONNÉES & SAUVEGARDES
  {
    id: 'CHK-DAT-01',
    category: 'DATA' as const,
    title: 'Sauvegardes Automatiques Quotidiennes & Hebdomadaires',
    description: 'Génération programmée de snapshots complets avec métadonnées et horodatage certifié.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Stratégie de sauvegarde active : snapshots quotidiens + hebdomadaires chiffrés avec rétention 30/90 jours.'
  },
  {
    id: 'CHK-DAT-02',
    category: 'DATA' as const,
    title: 'Contrôle d Intégrité Cryptographique (SHA-256)',
    description: 'Toutes les archives de sauvegarde sont scellées et vérifiées par empreinte SHA-256.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Checksums SHA-256 générés et vérifiés avec succès sur 100% des archives existantes.'
  },
  {
    id: 'CHK-DAT-03',
    category: 'DATA' as const,
    title: 'Test de Restauration Réussi en Environnement STAGING',
    description: 'Une sauvegarde doit être formellement restaurée et vérifiée dans STAGING avant d être déclarée fiable.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Test de restauration exécuté avec succès le 2026-08-28. Cohérence relationnelle vérifiée.'
  },
  {
    id: 'CHK-DAT-04',
    category: 'DATA' as const,
    title: 'Corbeille des Suppressions Logiques & Double Confirmation',
    description: 'Aucune donnée scientifique n est supprimée physiquement sans passage en corbeille et autorisation élevée.',
    isSatisfied: true,
    blocker: false,
    verificationDetails: 'Corbeille active avec motif obligatoire et restauration instantanée possible.'
  },

  // 3. TECHNIQUE & MONITORING
  {
    id: 'CHK-TEC-01',
    category: 'TECHNICAL' as const,
    title: 'Supervision Technique de Santé Système (System Health)',
    description: 'Monitoring continu de la disponibilité, de la latence API, de l état de la base et du stockage.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Dashboard de santé actif (Disponibilité 99.85%, latence 42ms, stockage 16.7% utilisé).'
  },
  {
    id: 'CHK-TEC-02',
    category: 'TECHNICAL' as const,
    title: 'Gestion Centralisée et Sanitisée des Erreurs',
    description: 'Messages utilisateurs explicites et sécurisés, sans fuite de stack trace ou d informations sensibles.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Registre des erreurs centralisé avec codes techniques sanitisés et niveaux de gravité (INFO à CRITICAL).'
  },
  {
    id: 'CHK-TEC-03',
    category: 'TECHNICAL' as const,
    title: 'Résilience Hors-Ligne V1.18 & Surveillance de Synchronisation',
    description: 'Maintien de la collecte mobile sans connexion et indicateur visuel de file de synchronisation.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Mode hors-ligne validé : stockage local IndexedDB préservé et alerte en cas de déconnexion avec fiches en attente.'
  },

  // 4. SCIENTIFIQUE & GOUVERNANCE
  {
    id: 'CHK-SCI-01',
    category: 'SCIENTIFIC' as const,
    title: 'Datasets et Protocoles Scellés par Version V1.19',
    description: 'Isolation des projets, historique des amendements éthiques et traçabilité des variables.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: '3 projets isolés (Kindu, Kasongo, Punia) avec protocoles certifiés et dictionnaire de 16 variables.'
  },
  {
    id: 'CHK-SCI-02',
    category: 'SCIENTIFIC' as const,
    title: 'Validation Formelle des Modèles Avant Utilisation Décisionnelle',
    description: 'Séparation stricte des modèles EXPÉRIMENTAUX (interdits d alertes) et MODÈLES VALIDES.',
    isSatisfied: true,
    blocker: true,
    verificationDetails: 'Garde-fous opérationnels actifs : seuls les modèles validés alimentent les alertes de surveillance.'
  },
  {
    id: 'CHK-SCI-03',
    category: 'SCIENTIFIC' as const,
    title: 'Export Anonymisé & Pseudonymisation Automatique',
    description: 'Protection de la vie privée des participants de recherche selon les normes éthiques nationales.',
    isSatisfied: true,
    blocker: false,
    verificationDetails: 'Moteur d anonymisation et masquage PII (PART-XXXXXX, jittering GPS) actif lors des exports.'
  }
];

export function calculateProductionReadinessReport(checkItems = INITIAL_PRODUCTION_CHECK_ITEMS): ProductionReadinessReport {
  const satisfiedCount = checkItems.filter(c => c.isSatisfied).length;
  const totalCount = checkItems.length;
  const overallScore = Number(((satisfiedCount / totalCount) * 100).toFixed(1));

  const blockingIssues = checkItems.filter(c => !c.isSatisfied && c.blocker);
  const isProductionReady = blockingIssues.length === 0 && overallScore >= 90;

  const categoriesMap: Record<string, { label: string; items: typeof checkItems }> = {
    SECURITY: { label: 'Sécurité & Authentification', items: [] },
    DATA: { label: 'Intégrité des Données & Sauvegardes', items: [] },
    TECHNICAL: { label: 'Monitoring Technique & Résilience', items: [] },
    SCIENTIFIC: { label: 'Gouvernance Scientifique & Modèles', items: [] }
  };

  checkItems.forEach(item => {
    if (categoriesMap[item.category]) {
      categoriesMap[item.category].items.push(item);
    }
  });

  const categories = Object.entries(categoriesMap).map(([catKey, val]) => {
    const sat = val.items.filter(i => i.isSatisfied).length;
    const tot = val.items.length;
    const catScore = tot > 0 ? Number(((sat / tot) * 100).toFixed(1)) : 100;
    return {
      category: catKey as any,
      label: val.label,
      score: catScore,
      items: val.items
    };
  });

  const verdictExplanation: string[] = [];
  if (isProductionReady) {
    verdictExplanation.push(`✓ PRÊT POUR DÉPLOIEMENT EN PRODUCTION (Score : ${overallScore}%)`);
    verdictExplanation.push('Toutes les exigences critiques de sécurité, intégrité, sauvegarde, monitoring et gouvernance scientifique sont satisfaites.');
    verdictExplanation.push('Les environnements sont hermétiquement séparés (DEVELOPMENT / STAGING / PRODUCTION) avec traçabilité complète.');
  } else {
    verdictExplanation.push(`⚠️ NON PRÊT POUR LA PRODUCTION (${blockingIssues.length} point(s) bloquant(s))`);
    blockingIssues.forEach(b => {
      verdictExplanation.push(`• Bloquant : ${b.title} (${b.description})`);
    });
  }

  return {
    overallScore,
    isProductionReady,
    blockingIssuesCount: blockingIssues.length,
    categories,
    verdictExplanation
  };
}

export const INITIAL_V120_SECURITY_TESTS: V120SecurityScenarioTest[] = [
  {
    id: 1,
    code: 'SEC-TEST-01',
    title: 'Protection contre les Tentatives d Authentification Répétées (Brute-Force)',
    category: 'TEST_AUTHENTIFICATION_BRUTE_FORCE',
    description: 'Vérifier que 5 tentatives consécutives de mot de passe erroné entraînent un verrouillage temporaire de session avec journalisation de sécurité.',
    status: 'PASSED',
    steps: [
      '1. Simuler 5 tentatives d authentification avec mot de passe invalide.',
      '2. Constater l activation du blocage anti-brute-force (lockout temporaire).',
      '3. Vérifier l émission d un événement de sécurité "LOGIN_FAILED" sévérité WARNING dans le Security Log.'
    ],
    expectedOutcome: 'Le compte est temporairement suspendu et l incident est consigné avec IP et horodatage.',
    actualOutcome: '✓ Verrouillage anti-brute-force déclenché après 5 échecs. Log SEC-LOG-01 enregistré.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 2,
    code: 'SEC-TEST-02',
    title: 'Expiration Automatique de Session & Révocation d Appareils Connectés',
    category: 'TEST_SESSION_EXPIRATION_REVOCATION',
    description: 'Tester l expiration automatique après dépassement du timeout de 60 min et la révocation à distance d une session mobile compromise.',
    status: 'PASSED',
    steps: [
      '1. Avancer artificiellement l horloge de session au-delà de 60 minutes d inactivité.',
      '2. Constater le refus d accès automatique et la redirection vers la connexion sécurisée.',
      '3. Tester la révocation manuelle d un appareil connecté dans la liste des sessions actives.'
    ],
    expectedOutcome: 'La session est invalidée proprement côté client et serveur, l appareil révoqué est déconnecté.',
    actualOutcome: '✓ Expiration validée. Révocation de session mobile exécutée avec succès.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 3,
    code: 'SEC-TEST-03',
    title: 'Principe du Moindre Privilège & Contrôle RBAC Granulaire',
    category: 'TEST_RBAC_MOINDRE_PRIVILEGE',
    description: 'Vérifier qu un profil ENQUETEUR_TERRAIN ne peut ni modifier les modèles statistiques, ni altérer les seuils de surveillance, ni exporter des données brutes.',
    status: 'PASSED',
    steps: [
      '1. Connecter l utilisateur sous le rôle ENQUETEUR_TERRAIN.',
      '2. Tenter d exécuter une requête vers le module de modélisation ou de surveillance.',
      '3. Vérifier le blocage d accès ("ACCÈS REFUSÉ") et l enregistrement de l événement d audit de sécurité.'
    ],
    expectedOutcome: 'Accès refusé sans exposition des contrôles privilégiés ni fuite d informations internes.',
    actualOutcome: '✓ Accès refusé systématiquement pour les modules hors périmètre de collecte terrain.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 4,
    code: 'SEC-TEST-04',
    title: 'Isolation Hermétique Inter-Projets (Multi-Tenant One Health)',
    category: 'TEST_ISOLATION_PROJETS_SEPARATION',
    description: 'Vérifier qu un enquêteur affecté au Projet Kasongo (PRJ-KAS-002) ne peut accéder à aucun enregistrement du Projet Kindu (PRJ-KND-001).',
    status: 'PASSED',
    steps: [
      '1. Sélectionner un utilisateur avec permission exclusive sur PRJ-KAS-002.',
      '2. Tenter d interroger les datasets et formulaires du projet PRJ-KND-001.',
      '3. Confirmer le filtrage hermétique côté application et backend.'
    ],
    expectedOutcome: 'Aucune donnée ni métadonnée du projet non autorisé n est transmise ou visualisable.',
    actualOutcome: '✓ Isolation inter-projets 100% étanche. Séparation confirmée.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 5,
    code: 'SEC-TEST-05',
    title: 'Absence Totale de Secrets et Clés API dans le Frontend Public',
    category: 'TEST_PROTECTION_SECRETS_FRONTEND',
    description: 'Vérifier que les clés API Gemini, mots de passe et credentials restent strictement confinés aux routes serveur sans fuite dans le navigateur.',
    status: 'PASSED',
    steps: [
      '1. Inspecter le code source client et les objets d état pour détecter d éventuelles chaînes de secrets.',
      '2. Vérifier que les variables d environnement sensibles utilisent process.env serveur.',
      '3. Confirmer le masquage systématique des tokens dans les interfaces et logs d audit.'
    ],
    expectedOutcome: '0 clé API ou secret en clair dans le code client.',
    actualOutcome: '✓ 0 secret exposé. Architecture conforme aux standards de sécurité.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 6,
    code: 'SEC-TEST-06',
    title: 'Anonymisation Automatique des Données Personnelles lors des Exports',
    category: 'TEST_ANONYMISATION_EXPORT',
    description: 'Tester l export anonymisé : remplacement des noms par PART-XXXXXX, masquage des téléphones et bruitage spatial des coordonnées GPS.',
    status: 'PASSED',
    steps: [
      '1. Sélectionner un dataset contenant des données d enquêtes ménages.',
      '2. Déclencher un export en mode "ANONYMISÉ".',
      '3. Analyser la structure du fichier généré : vérifier l absence de PII et la pseudonymisation des identifiants.'
    ],
    expectedOutcome: 'Le fichier exporté est certifié conforme pour la recherche sans ré-identification possible.',
    actualOutcome: '✓ Noms pseudonymisés en PART-XXXXXX, numéros masqués, coordonnées bruitées avec succès.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 7,
    code: 'SEC-TEST-07',
    title: 'Création de Sauvegarde & Vérification de l Empreinte SHA-256',
    category: 'TEST_SAUVEGARDE_INTEGRITE_SHA256',
    description: 'Générer un snapshot de sauvegarde complet et vérifier la cohérence cryptographique de son empreinte SHA-256.',
    status: 'PASSED',
    steps: [
      '1. Déclencher une sauvegarde manuelle complète de tous les modules V1.0–V1.20.',
      '2. Calculer le hash SHA-256 de l archive et l inscrire dans le registre immuable.',
      '3. Re-calculer le hash et comparer avec le registre pour valider l intégrité.'
    ],
    expectedOutcome: 'Sauvegarde créée avec succès, empreinte SHA-256 vérifiée et validée sans anomalie.',
    actualOutcome: '✓ Snapshot BKP-20260830-DAILY-01 vérifié avec succès. Intégrité 100%.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 8,
    code: 'SEC-TEST-08',
    title: 'Restauration Sécurisée en Environnement STAGING & Comparaison d Intégrité',
    category: 'TEST_RESTAURATION_STAGING',
    description: 'Simuler une procédure de reprise après sinistre : restauration dans STAGING et comparaison rigoureuse du nombre de projets, datasets et modèles.',
    status: 'PASSED',
    steps: [
      '1. Sélectionner une archive de sauvegarde certifiée.',
      '2. Exécuter la restauration dans l espace de qualification STAGING.',
      '3. Comparer le décompte des entités avant/après : projets (3), protocoles (3), datasets (6), fiches (124).'
    ],
    expectedOutcome: 'Toutes les tables et relations sont restituées à l identique sans régression.',
    actualOutcome: '✓ Restauration STAGING conforme à 100%. Aucune altération constatée.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 9,
    code: 'SEC-TEST-09',
    title: 'Suppression Logique, Corbeille et Restauration avec Justification',
    category: 'TEST_CORBEILLE_SUPPRESSION_LOGIQUE',
    description: 'Vérifier qu un enregistrement supprimé bascule en corbeille avec motif obligatoire et peut être restauré sans perte d information.',
    status: 'PASSED',
    steps: [
      '1. Supprimer logiquement une fiche enquête avec saisie d une justification obligatoire.',
      '2. Constater sa disparition des vues opérationnelles et sa présence dans la Corbeille.',
      '3. Exécuter l action "Restaurer" et vérifier la réintégration immédiate avec journalisation.'
    ],
    expectedOutcome: 'Suppression non-destructive avec traçabilité complète et possibilité de restauration.',
    actualOutcome: '✓ Cycle suppression logique ➔ corbeille ➔ restauration validé avec succès.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 10,
    code: 'SEC-TEST-10',
    title: 'Monitoring de Santé Système & Gestion Centralisée des Erreurs',
    category: 'TEST_MONITORING_SANTE_ERREURS',
    description: 'Vérifier le fonctionnement du tableau de bord de santé système, le calcul des seuils de stockage et la sanitisation des erreurs.',
    status: 'PASSED',
    steps: [
      '1. Interroger l état des sondes système (Disponibilité, API, DB, Stockage, Synchronisation).',
      '2. Simuler une erreur de connectivité et vérifier que le message utilisateur est compréhensible et exempt de fuites.',
      '3. Vérifier l émission d alertes en cas de stockage approchant le seuil critique (85%).'
    ],
    expectedOutcome: 'Indicateurs clairs (🟢 Opérationnel), alertes proactives et erreurs sanitisées.',
    actualOutcome: '✓ Métriques de santé calculées en temps réel. Messages d erreurs sécurisés.',
    lastRunDate: '2026-08-30 08:50'
  },
  {
    id: 11,
    code: 'SEC-TEST-11',
    title: 'Non-Régression Complète sur les Fonctionnalités V1.0 à V1.19',
    category: 'TEST_NON_REGRESSION_OFFLINE_V1_V19',
    description: 'S assurer que toutes les fonctionnalités des versions antérieures (collecte hors-ligne, GPS, synchronisation V1.18, gouvernance V1.19, modélisation V1.15, etc.) restent 100% opérationnelles.',
    status: 'PASSED',
    steps: [
      '1. Vérifier le fonctionnement du mode hors-ligne et de la file de synchronisation V1.18.',
      '2. Vérifier l intégrité du dictionnaire de variables et des protocoles V1.19.',
      '3. Vérifier le calcul des modèles statistiques V1.15 et des alertes de surveillance V1.17.',
      '4. Confirmer la non-altération des données de démonstration et des structures historiques.'
    ],
    expectedOutcome: 'Aucune régression fonctionnelle ni perte de données sur l ensemble des 19 modules.',
    actualOutcome: '✓ 100% des modules V1.0 à V1.19 opérationnels sans aucune rupture.',
    lastRunDate: '2026-08-30 08:50'
  }
];

// Helper: Check Access
export function checkUserAccessToModule(
  userRole: UserRole,
  moduleKey: string,
  action: keyof Omit<GranularModulePermission, 'moduleKey' | 'moduleLabel'>,
  permissionMatrix = DEFAULT_ROLE_PERMISSION_MATRIX
): boolean {
  const roleEntry = permissionMatrix.find(r => r.role === userRole);
  if (!roleEntry) return false;

  const modEntry = roleEntry.modules.find(m => m.moduleKey === moduleKey);
  if (!modEntry) return false;

  return Boolean(modEntry[action]);
}

export function checkUserAccessToProject(
  userRole: UserRole,
  userAssignedProjects: string[],
  targetProjectId: string
): boolean {
  if (userRole === 'ADMINISTRATEUR' || userRole === 'CHERCHEUR') {
    return true;
  }
  return userAssignedProjects.includes(targetProjectId);
}

export function sanitizeDataForExport<T extends Record<string, any>>(
  records: T[],
  privacyRules = DEFAULT_DATA_PRIVACY_RULES,
  exportType: 'FULL' | 'ANONYMIZED' | 'PSEUDONYMIZED' = 'ANONYMIZED'
): T[] {
  if (exportType === 'FULL') {
    return records;
  }

  return records.map((rec, idx) => {
    const cleanRec: any = { ...rec };

    // Apply privacy masking
    privacyRules.forEach(rule => {
      if (cleanRec[rule.fieldKey] !== undefined) {
        if (rule.maskingStrategy === 'PSEUDONYMIZATION') {
          cleanRec[rule.fieldKey] = `${rule.pseudonymPrefix || 'PART-'}${String(idx + 1).padStart(6, '0')}`;
        } else if (rule.maskingStrategy === 'REDACTION') {
          cleanRec[rule.fieldKey] = '[CONFIDENTIEL - MASQUÉ CONFORMÉMENT AUX RÈGLES DE CONFIDENTIALITÉ]';
        } else if (rule.maskingStrategy === 'GEO_JITTER') {
          if (typeof cleanRec[rule.fieldKey] === 'number') {
            // Apply slight random offset (+- 0.002 deg ~= 200m)
            const jitter = (Math.sin(idx + 1) * 0.002);
            cleanRec[rule.fieldKey] = Number((cleanRec[rule.fieldKey] + jitter).toFixed(5));
          }
        }
      }
    });

    // Also mask generic names / phone fields if found
    if (cleanRec.nomChefMenage) cleanRec.nomChefMenage = `PART-${String(idx + 1).padStart(6, '0')}`;
    if (cleanRec.telephone) cleanRec.telephone = '+243 •••••••••';
    if (cleanRec.nomEnqueteur && exportType === 'ANONYMIZED') cleanRec.nomEnqueteur = 'ENQUETEUR_ANONYME';

    return cleanRec as T;
  });
}

// Aliases for compatibility
export const SYSTEM_HEALTH_METRICS_MOCK = INITIAL_SYSTEM_HEALTH_METRIC;
export const DEFAULT_RETENTION_POLICIES = DEFAULT_DATA_RETENTION_POLICIES;
export const INITIAL_SECURITY_LOGS = INITIAL_SECURITY_AUDIT_LOGS;
