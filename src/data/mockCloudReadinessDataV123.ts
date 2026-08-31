/**
 * ONE HEALTH MANIEMA (V1.23) — DONNÉES & SCHÉMAS D'ADAPTATION CLOUD
 * 
 * Centralise l'état de préparation Cloud (GCP compatible), la configuration
 * PostgreSQL (Cloud SQL), le stockage objet, les modèles IaC et la résilience offline.
 */

import {
  CloudComponentReadinessV123,
  PostgreSqlConfigV123,
  SyncQueueItemV123,
  BackgroundJobV123,
  InfrastructureAsCodeArtifact,
  StructuredLogEntryV123
} from '../types';

export const INITIAL_CLOUD_COMPONENTS_V123: CloudComponentReadinessV123[] = [
  {
    id: 'CMP-01',
    category: 'COMPUTE',
    name: 'Conteneurisation d\'Exécution Web',
    gcpEquivalent: 'Google Cloud Run (Fully Managed Serverless)',
    status: 'READY',
    currentImplementation: 'Conteneur Node.js / Vite SPA + API Express (/health, port 3000)',
    cloudTargetConfig: 'Image dist/server.cjs sans état, autoscaling 1-10 instances, CPU 1-2 vCPU, RAM 1-2 GiB',
    region: 'africa-south1 (Johannesburg)',
    isBlocker: false,
    notes: 'Prêt pour exécution distribuée sans session mémoire liée.'
  },
  {
    id: 'CMP-02',
    category: 'DATABASE',
    name: 'Base de Données Relationnelle Principale',
    gcpEquivalent: 'Cloud SQL for PostgreSQL (v16 Enterprise)',
    status: 'PREPARED',
    currentImplementation: 'Couche d\'abstraction locale + migrations SQL versionnées (001_initial à 004_v123)',
    cloudTargetConfig: 'Instance PostgreSQL 16 dédiée, SSL require, pool max 20, backup quotidien, réplicat read-only',
    region: 'africa-south1 (Johannesburg)',
    isBlocker: true,
    notes: 'Instance réelle non provisionnée. Modèle de schéma et scripts de migration entièrement préparés.'
  },
  {
    id: 'CMP-03',
    category: 'STORAGE',
    name: 'Stockage d\'Objets (Photos, GeoTIFF, Exports)',
    gcpEquivalent: 'Google Cloud Storage (Standard Storage Class)',
    status: 'PREPARED',
    currentImplementation: 'Abstraction StorageProvider avec adaptateur local IndexedDB / Blobs en mémoire',
    cloudTargetConfig: 'Bucket multi-régional ou régional africa-south1, chiffrement AES-256 / CMEK, CORS restreint',
    region: 'africa-south1 (Johannesburg)',
    isBlocker: true,
    notes: 'Bucket réel non créé. Séparation des gros médias et métadonnées DB strictement opérationnelle.'
  },
  {
    id: 'CMP-04',
    category: 'SECRETS',
    name: 'Gestionnaire de Clés & Secrets',
    gcpEquivalent: 'Google Cloud Secret Manager',
    status: 'PREPARED',
    currentImplementation: 'Externalisation complète (.env.example, variables conteneur non injectées dans le code)',
    cloudTargetConfig: 'Injection au démarrage du conteneur via Service Account IAM sans stockage dans git',
    region: 'global / africa-south1',
    isBlocker: false,
    notes: 'Aucun mot de passe ni clé d\'API en dur dans le code client.'
  },
  {
    id: 'CMP-05',
    category: 'LOGGING',
    name: 'Journalisation Structurée & Audit',
    gcpEquivalent: 'Google Cloud Logging (Structured JSON logs)',
    status: 'READY',
    currentImplementation: 'Service de logs JSON avec request ID, timestamps ISO, assainissement strict des PII',
    cloudTargetConfig: 'Flux stdout/stderr collecté automatiquement par le runtime Cloud Run',
    region: 'africa-south1',
    isBlocker: false,
    notes: 'Format standardisé avec filtrage préventif des tokens et mots de passe.'
  },
  {
    id: 'CMP-06',
    category: 'MONITORING',
    name: 'Métriques, Alertes & Observabilité',
    gcpEquivalent: 'Google Cloud Monitoring & Alerting Policies',
    status: 'PREPARED',
    currentImplementation: 'Métriques internes in-app (requêtes, erreurs, jobs, synchro queue)',
    cloudTargetConfig: 'Sonde de disponibilité /health toutes les 60s, alerte P1 si taux d\'erreur > 1% pendant 5 min',
    region: 'africa-south1',
    isBlocker: false,
    notes: 'Sondes applicatives prêtes, agent APM externe en attente de déploiement réel.'
  },
  {
    id: 'CMP-07',
    category: 'NETWORKING',
    name: 'Réseau, Domaine & Certificat TLS',
    gcpEquivalent: 'Cloud Load Balancing + Cloud Armor + Certificat Managé',
    status: 'NOT_CONFIGURED',
    currentImplementation: 'URL de bac à sable AI Studio avec reverse-proxy TLS nginx',
    cloudTargetConfig: 'Domaine officiel (ex: app.onehealthmaniema.cd), redirection HTTPS forcée, HSTS, WAF',
    region: 'global',
    isBlocker: true,
    notes: 'Aucun domaine officiel acheté ou configuré sur les DNS de production.'
  },
  {
    id: 'CMP-08',
    category: 'OFFLINE_SYNC',
    name: 'Moteur de Résilience Terrain & Sync',
    gcpEquivalent: 'Moteur client-side résilient (IndexedDB + Queue Worker)',
    status: 'READY',
    currentImplementation: 'File d\'attente offline avec retry backoff exponentiel, clés d\'idempotence et gestion conflits',
    cloudTargetConfig: 'Endpoints de synchronisation en lot (/api/v1/sync/batch) avec déduplication stricte',
    region: 'Local + Edge',
    isBlocker: false,
    notes: 'Supporte le mode avion, le réseau 2G instable et les coupures prolongées sur le terrain.'
  },
  {
    id: 'CMP-09',
    category: 'CI_CD',
    name: 'Pipeline d\'Intégration & Déploiement',
    gcpEquivalent: 'Google Cloud Build + Artifact Registry + Release Gates',
    status: 'READY',
    currentImplementation: 'Pipeline formel en 7 étapes avec validation d\'approbation administrateur et rollback',
    cloudTargetConfig: 'Build automatisé des images de conteneur, signature de provenance, déploiement canary',
    region: 'africa-south1',
    isBlocker: false,
    notes: 'Validation manuelle requise avant passage en production.'
  }
];

export const TARGET_POSTGRES_CONFIG_V123: {
  development: PostgreSqlConfigV123;
  staging: PostgreSqlConfigV123;
  production: PostgreSqlConfigV123;
} = {
  development: {
    host: '127.0.0.1',
    port: 5432,
    database: 'onehealth_maniema_dev',
    sslMode: 'disable',
    maxPoolConnections: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    targetRegion: 'local',
    isConfigured: true,
    readReplicaAvailable: false,
    notes: 'Base locale / Bac à sable de développement avec fixtures scientifiques initiales.'
  },
  staging: {
    host: '10.128.0.15', // IP privée VPC préparée
    port: 5432,
    database: 'onehealth_maniema_staging',
    sslMode: 'require',
    maxPoolConnections: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    targetRegion: 'africa-south1 (Johannesburg)',
    isConfigured: false,
    readReplicaAvailable: false,
    notes: 'Préparé pour Cloud SQL Staging avec jeux de données anonymisés de test.'
  },
  production: {
    host: '10.128.1.20', // IP privée VPC préparée
    port: 5432,
    database: 'onehealth_maniema_prod',
    sslMode: 'verify-full',
    maxPoolConnections: 25,
    idleTimeoutMillis: 15000,
    connectionTimeoutMillis: 10000,
    targetRegion: 'africa-south1 (Johannesburg)',
    isConfigured: false,
    readReplicaAvailable: true,
    notes: 'En attente de provisionnement réel Cloud SQL Haute Disponibilité avec réplicat de lecture.'
  }
};

export const INITIAL_SYNC_QUEUE_V123: SyncQueueItemV123[] = [
  {
    id: 'SYNC-Q-001',
    entityType: 'SURVEY_OBSERVATION',
    entityId: 'OBS-SRV-2026-088',
    action: 'CREATE',
    payloadSummary: 'Enquête ménage Kasongo - Suspicion co-infection paludisme/typhoïde (GPS: -4.432, 26.654)',
    status: 'SYNCED',
    retryCount: 0,
    maxRetries: 5,
    backoffDelayMs: 1000,
    lastAttemptAt: '2026-08-30T11:45:00Z',
    conflictStrategy: 'SERVER_WINS',
    idempotencyKey: 'IDEMP-OBS-088-KAS-2026',
    createdAt: '2026-08-30T11:40:00Z'
  },
  {
    id: 'SYNC-Q-002',
    entityType: 'MEDIA_PHOTO',
    entityId: 'FILE-MED-001',
    action: 'CREATE',
    payloadSummary: 'Photo gîte larvaire anophélien secteur Kindu-Nord (1.8 MB)',
    status: 'SYNCED',
    retryCount: 1,
    maxRetries: 5,
    backoffDelayMs: 2000,
    lastAttemptAt: '2026-08-30T11:50:00Z',
    conflictStrategy: 'SERVER_WINS',
    idempotencyKey: 'IDEMP-FILE-MED-001-KND',
    createdAt: '2026-08-30T11:30:00Z'
  },
  {
    id: 'SYNC-Q-003',
    entityType: 'CLIMATE_MEASURE',
    entityId: 'CLM-2026-WK34-PUNIA',
    action: 'UPDATE',
    payloadSummary: 'Pluviométrie hebdomadaire Punia (94.2 mm) + température moyenne (27.8°C)',
    status: 'PENDING',
    retryCount: 0,
    maxRetries: 5,
    backoffDelayMs: 1000,
    conflictStrategy: 'CLIENT_WINS',
    idempotencyKey: 'IDEMP-CLM-PUN-WK34',
    createdAt: '2026-08-30T12:05:00Z'
  },
  {
    id: 'SYNC-Q-004',
    entityType: 'ANIMAL_HEALTH_REPORT',
    entityId: 'VET-KAB-2026-012',
    action: 'CREATE',
    payloadSummary: 'Notification mortalité aviaire Kabambare - Échantillons envoyés pour analyse',
    status: 'FAILED',
    retryCount: 3,
    maxRetries: 5,
    backoffDelayMs: 8000,
    lastAttemptAt: '2026-08-30T12:10:00Z',
    lastErrorMessage: 'NETWORK_TIMEOUT_30S: Coupure réseau relais VSAT Kindu pendant l\'upload',
    conflictStrategy: 'MANUAL_MERGE',
    idempotencyKey: 'IDEMP-VET-KAB-012-MORT',
    createdAt: '2026-08-30T11:15:00Z'
  }
];

export const INITIAL_BACKGROUND_JOBS_V123: BackgroundJobV123[] = [
  {
    jobId: 'JOB-2026-0801',
    type: 'GEO_RASTER_COMPUTE',
    status: 'COMPLETED',
    progressPercent: 100,
    startedAt: '2026-08-30T08:00:00Z',
    completedAt: '2026-08-30T08:04:30Z',
    durationMs: 270000,
    triggeredBy: 'Analyste SIG Maniema',
    payloadSummary: 'Interpolation IDW des précipitations mensuelles Province du Maniema (Grille 500m)',
    outputArtifactUrl: '/projects/PRJ-MANIEMA-2026/geospatial/maniema_idw_pluvio_aug2026.tif'
  },
  {
    jobId: 'JOB-2026-0802',
    type: 'SEIR_SIMULATION_MULTI_ZONE',
    status: 'COMPLETED',
    progressPercent: 100,
    startedAt: '2026-08-30T09:15:00Z',
    completedAt: '2026-08-30T09:16:45Z',
    durationMs: 105000,
    triggeredBy: 'Épidémiologiste Modélisateur',
    payloadSummary: 'Simulation stochastique transmission Paludisme 180 jours avec pic des pluies',
    outputArtifactUrl: '/exports/simulation_seir_palu_maniema_2026.json'
  },
  {
    jobId: 'JOB-2026-0803',
    type: 'MASSIVE_EXPORT_JSON_CSV',
    status: 'QUEUED',
    progressPercent: 0,
    startedAt: '2026-08-30T12:15:00Z',
    triggeredBy: 'Administrateur Système',
    payloadSummary: 'Export intégral Package de Reproductibilité Scientifique V1.23 avec Checksums SHA-256'
  }
];

export const INITIAL_IAC_ARTIFACTS_V123: InfrastructureAsCodeArtifact[] = [
  {
    id: 'IAC-DOCKER',
    filename: 'Dockerfile',
    language: 'dockerfile',
    description: 'Image de conteneur de production multi-stage, sans secrets, compatible Google Cloud Run.',
    category: 'CONTAINER',
    isDryRunOnly: true,
    content: `# ==============================================================================
# ONE HEALTH MANIEMA — DOCKERFILE PRODUCTION MULTI-STAGE (V1.23)
# ==============================================================================
# Ce conteneur compile le frontend Vite et le serveur Express autonome
# sans embarquer aucun secret dans l'image.

# Stage 1: Construction de l'application
FROM node:20-alpine AS builder
WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Code source
COPY . .

# Construction du bundle client et compilation du serveur dist/server.cjs
RUN npm run build

# Stage 2: Image d'exécution minimale de production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodeuser -u 1001 -G nodejs

# Copie des artefacts compilés
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./

# Installation minimale de production (sans dépendances de dev)
RUN npm ci --only=production --ignore-scripts && \\
    npm cache clean --force

USER nodeuser

EXPOSE 3000

# Endpoint Healthcheck pour Cloud Run
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.cjs"]
`
  },
  {
    id: 'IAC-TF-MAIN',
    filename: 'infra/terraform/main.tf',
    language: 'terraform',
    description: 'Blueprint Terraform pour Google Cloud Run, Cloud SQL PostgreSQL et Cloud Storage (Johannesburg).',
    category: 'TERRAFORM_GCP',
    isDryRunOnly: true,
    content: `# ==============================================================================
# ONE HEALTH MANIEMA — BLUEPRINT TERRAFORM GCP (V1.23 DRY-RUN)
# Région : africa-south1 (Johannesburg)
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Bucket Google Cloud Storage pour Médias & Rasters
resource "google_storage_bucket" "media_bucket" {
  name                     = "onehealth-maniema-media-\${var.environment}"
  location                 = var.region
  storage_class            = "STANDARD"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  cors {
    origin          = [var.app_domain]
    method          = ["GET", "PUT", "POST", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 2. Instance Cloud SQL PostgreSQL 16 Enterprise
resource "google_sql_database_instance" "postgres_instance" {
  name             = "onehealth-maniema-pg-\${var.environment}"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.db_tier # ex: db-custom-2-7680
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_size         = 50 # Go autoscaling
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.environment == "production" ? true : false
      start_time                     = "02:00"
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_network_id
      require_ssl     = true
    }
  }

  deletion_protection = var.environment == "production" ? true : false
}

# 3. Service Google Cloud Run
resource "google_cloud_run_v2_service" "app_service" {
  name     = "onehealth-maniema-\${var.environment}"
  location = var.region

  template {
    scaling {
      min_instance_count = var.environment == "production" ? 2 : 0
      max_instance_count = 10
    }

    containers {
      image = "africa-south1-docker.pkg.dev/\${var.project_id}/app/onehealth-maniema:v1.23"

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }

      env {
        name  = "APP_ENV"
        value = var.environment
      }
      env {
        name  = "STORAGE_PROVIDER"
        value = "GOOGLE_CLOUD_STORAGE"
      }
      env {
        name  = "STORAGE_BUCKET"
        value = google_storage_bucket.media_bucket.name
      }
    }
  }
}
`
  },
  {
    id: 'IAC-HEALTH',
    filename: 'server/health.ts',
    language: 'shell',
    description: 'Spécification et implémentation des sondes Liveness & Readiness (/health).',
    category: 'HEALTH_CHECK',
    isDryRunOnly: false,
    content: `// Endpoints exposés sur l'API Express :
// GET /health  -> Sonde Liveness minimale (réponse immédiate 200 OK {"status":"ok","version":"V1.23"})
// GET /ready   -> Sonde Readiness vérifiant l'état de l'application et du moteur local
`
  }
];

export const INITIAL_STRUCTURED_LOGS_V123: StructuredLogEntryV123[] = [
  {
    timestamp: '2026-08-30T12:15:30.120Z',
    level: 'INFO',
    service: 'api-gateway',
    requestId: 'REQ-20260830-9A1F',
    environment: 'DEVELOPMENT',
    message: 'Health probe /health reçue - Statut OK',
    httpStatus: 200,
    durationMs: 1.8
  },
  {
    timestamp: '2026-08-30T12:16:10.450Z',
    level: 'INFO',
    service: 'storage-manager',
    requestId: 'REQ-20260830-B4C2',
    environment: 'DEVELOPMENT',
    message: 'Upload fichier photo gîte larvaire SRV-2026-001 validé et persisté',
    userId: 'USR-ENQ-01',
    durationMs: 42.5,
    metadata: {
      fileId: 'FILE-MED-001',
      sizeBytes: 1845200,
      mimeType: 'image/jpeg',
      provider: 'LOCAL_INDEXEDDB'
    }
  },
  {
    timestamp: '2026-08-30T12:17:02.890Z',
    level: 'WARN',
    service: 'sync-queue-worker',
    requestId: 'REQ-20260830-E7D9',
    environment: 'DEVELOPMENT',
    message: 'Échec temporaire de synchronisation pour VET-KAB-2026-012 (tentative 3/5) - Planification retry backoff 8000ms',
    userId: 'USR-VET-02',
    metadata: {
      retryCount: 3,
      backoffMs: 8000,
      cause: 'NETWORK_TIMEOUT_30S'
    }
  }
];
