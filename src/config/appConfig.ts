/**
 * ONE HEALTH MANIEMA — Configuration Centrale de Marque et d'Identité (V1.21)
 * 
 * Ce fichier centralise l'identité officielle, le slogan, la portée territoriale,
 * la version et les métadonnées de la plateforme afin d'éviter la dispersion
 * des chaînes de caractères en dur dans les composants.
 */

export interface OneHealthPillar {
  id: 'HUMAN' | 'ANIMAL' | 'ENVIRONMENT' | 'CLIMATE' | 'WASH' | 'ECOSYSTEM';
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
  description: string;
  indicatorsSample: string[];
}

export interface BrandVersionHistoryEntry {
  version: string;
  releaseDate: string;
  name: string;
  tagline: string;
  primaryRegion: string;
  changesSummary: string;
  author: string;
}

export interface AppBrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  primaryRegion: string;
  primaryCity: string;
  country: string;
  approach: string;
  version: string;
  releaseDate: string;
  demoNotice: string;
  logoPlaceholderText: string;
  officialLogoProvided: boolean;
  pillars: OneHealthPillar[];
  supportedPathologies: string[];
  versionHistory: BrandVersionHistoryEntry[];
}

export const APP_CONFIG: AppBrandConfig = {
  name: 'ONE HEALTH MANIEMA',
  shortName: 'OH-MANIEMA',
  tagline: 'Plateforme intégrée de données, recherche, analyse et surveillance One Health',
  description: 'Plateforme numérique scientifique et institutionnelle de collecte géoréférencée, gestion de données, analyse spatio-temporelle, modélisation épidémiologique et surveillance intégrée selon l\'approche One Health en Province du Maniema (République Démocratique du Congo).',
  primaryRegion: 'Maniema',
  primaryCity: 'Kindu',
  country: 'République Démocratique du Congo',
  approach: 'One Health (Santé Humaine, Santé Animale, Environnement, Climat)',
  version: 'V1.23',
  releaseDate: '2026-08-30',
  demoNotice: 'Données scientifiques & opérationnelles — Environnement de Démonstration et Recherche Pilote',
  logoPlaceholderText: 'LOGO ONE HEALTH — Emplacement réservé pour fichier officiel',
  officialLogoProvided: false, // Flag conforme : aucun faux logo officiel inventé
  pillars: [
    {
      id: 'HUMAN',
      label: 'Santé Humaine',
      shortLabel: 'Humain',
      iconName: 'UserCheck',
      color: 'rose',
      description: 'Épidémiologie humaine, morbidité, registres cliniques, consultations et enquêtes ménages.',
      indicatorsSample: ['Cas suspects/confirmés paludisme', 'Incidence fièvre typhoïde', 'Admissions pédiatriques', 'Pratiques de soins']
    },
    {
      id: 'ANIMAL',
      label: 'Santé Animale & Faune',
      shortLabel: 'Animal',
      iconName: 'PawPrint',
      color: 'amber',
      description: 'Surveillance des zoonoses, bétail, animaux de compagnie, réservoirs sauvages et vecteurs.',
      indicatorsSample: ['Densité vectorielle Anopheles', 'Mortalité aviaire/porcine', 'Contacts faune sauvage', 'Exposition morsures']
    },
    {
      id: 'ENVIRONMENT',
      label: 'Environnement & Écosystèmes',
      shortLabel: 'Environnement',
      iconName: 'Trees',
      color: 'emerald',
      description: 'Gîtes larvaires, déforestation, dynamique fluviale du fleuve Congo, végétation et sols.',
      indicatorsSample: ['Typologie gîtes larvaires', 'Indice NDVI', 'Proximité eaux stagnantes', 'Pressions anthropiques']
    },
    {
      id: 'CLIMATE',
      label: 'Climat & Météorologie',
      shortLabel: 'Climat',
      iconName: 'CloudRain',
      color: 'cyan',
      description: 'Précipitations, températures de surface, humidité relative, saisons des pluies et crues.',
      indicatorsSample: ['Cumul mensuel pluie (mm)', 'Température moyenne (°C)', 'Humidité (%)', 'Anomalies climatiques']
    },
    {
      id: 'WASH',
      label: 'Eau, Assainissement & Hygiène',
      shortLabel: 'EAH / WASH',
      iconName: 'Droplets',
      color: 'teal',
      description: 'Accès à l\'eau de boisson, traitement à domicile, types d\'ouvrages d\'assainissement.',
      indicatorsSample: ['Source d\'eau potable principale', 'Évacuation des eaux usées', 'Type de latrine', 'Gestion des déchets']
    }
  ],
  supportedPathologies: [
    'Paludisme (Malaria à Plasmodium falciparum)',
    'Fièvre Typhoïde (Salmonella enterica serovar Typhi)',
    'Diarrhées aiguës et maladies d\'origine hydrique',
    'Zoonoses émergentes et arboviroses',
    'Surveillance des co-infections fébriles'
  ],
  versionHistory: [
    {
      version: 'V1.23',
      releaseDate: '2026-08-30',
      name: 'ONE HEALTH MANIEMA',
      tagline: 'Plateforme intégrée de données, recherche, analyse et surveillance One Health',
      primaryRegion: 'Maniema (RDC)',
      changesSummary: 'Adaptation à l\'architecture Cloud (Google Cloud Run, Cloud SQL PostgreSQL, Cloud Storage, Secret Manager, Cloud Logging/Monitoring région Johannesburg africa-south1) : abstraction StorageProvider, isolation des gros fichiers (photos/rasters), moteur de synchronisation résilient avec retry backoff exponentiel & gestion des conflits, audit de sécurité Cloud Readiness, générateur IaC (Dockerfile, Terraform DRY-RUN) et journalisation JSON structurée.',
      author: 'Équipe Architecture Cloud & Systèmes Distribués One Health Maniema'
    },
    {
      version: 'V1.22',
      releaseDate: '2026-08-30',
      name: 'ONE HEALTH MANIEMA',
      tagline: 'Plateforme intégrée de données, recherche, analyse et surveillance One Health',
      primaryRegion: 'Maniema (RDC)',
      changesSummary: 'Architecture d\'exploitation & préparation au déploiement réel : isolation stricte DEV/STAGING/PROD, pipeline CI/CD de déploiement, migrations de schémas DB avec rollback, incident center (INC-2026-XXXX), health & readiness checks (/health), matrice de responsabilités, guide d\'exploitation et inventaire infrastructure réel.',
      author: 'Équipe Architecture Système & Déploiement One Health Maniema'
    },
    {
      version: 'V1.21',
      releaseDate: '2026-08-30',
      name: 'ONE HEALTH MANIEMA',
      tagline: 'Plateforme intégrée de données, recherche, analyse et surveillance One Health',
      primaryRegion: 'Maniema (RDC)',
      changesSummary: 'Nouvelle identité générale unifiée "ONE HEALTH MANIEMA", harmonisation géographique (Maniema = Province, Kindu = Ville/Zone pilote), intégration du composant One Health Logo normé, configuration centralisée de marque et mise à jour des rapports/exports.',
      author: 'Comité Scientifique & Technique One Health Maniema'
    },
    {
      version: 'V1.20',
      releaseDate: '2026-08-30',
      name: 'One Health Kindu',
      tagline: 'Sécurité, Sauvegardes, Récupération & Préparation à la Production',
      primaryRegion: 'Maniema (Kindu)',
      changesSummary: 'Durcissement opérationnel, isolation DEV/STAGING/PROD, chiffrement SHA-256 des backups, plan de reprise après sinistre (PRA/DRP) et corbeille de restauration.',
      author: 'Équipe Système & Sécurité'
    },
    {
      version: 'V1.19',
      releaseDate: '2026-08-29',
      name: 'One Health Kindu',
      tagline: 'Gouvernance des Projets, Lignage des Données & Reproductibilité',
      primaryRegion: 'Maniema (Kindu)',
      changesSummary: 'Gestion des projets d\'études, protocoles éthiques, dictionnaire unifié de 150+ variables, traçabilité RAW/CLEAN/ANALYTIC et export de packages de reproductibilité.',
      author: 'Pôle Recherche UNIKI'
    }
  ]
};
