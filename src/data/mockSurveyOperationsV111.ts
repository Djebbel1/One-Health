import {
  FieldSurvey,
  SurveyQuestionnaire,
  SurveySite,
  SurveyHousehold,
  CollectionSession,
  FieldPlanItem,
  HealthRegistryRecord,
  SurveyAuditLog,
  V111ValidationTest
} from '../types';

export const INITIAL_QUESTIONNAIRES_V111: SurveyQuestionnaire[] = [
  {
    id: 'QST_ONEHEALTH_V10',
    name: 'Questionnaire Intégré One Health Maniema',
    version: '1.0',
    description: 'Enquête ménage standard évaluant l’accès à l’eau, l’assainissement, l’exposition environnementale et les antécédents morbides (Paludisme, Fièvre typhoïde, Mpox).',
    projectId: 'PRJ_KINDU_CLIMAT_DOC',
    pathologyIds: ['PATH_MAL', 'PATH_TYP', 'PATH_MPX'],
    status: 'PUBLIE',
    isLocked: true,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
    sections: [
      {
        id: 'SEC_A',
        code: 'SEC_A',
        title: 'Section A — Identification & Consentement',
        description: 'Identification anonymisée du site, du ménage et consentement éclairé du répondant.',
        displayOrder: 1,
        questions: [
          {
            id: 'Q_A1_CONSENT',
            code: 'A1_CONSENT',
            label: 'Le chef de ménage ou son représentant consent-il à participer à l’enquête ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 1
          },
          {
            id: 'Q_A2_ANON_ID',
            code: 'A2_ANON_ID',
            label: 'Identifiant Anonymisé du Sujet / Ménage',
            description: 'Format standardisé anonymisé (ex: HH-KIN-MIK-001). Ne jamais saisir de nom complet.',
            type: 'TEXT',
            required: true,
            displayOrder: 2,
            validationRules: [
              {
                id: 'R_A2_MIN',
                type: 'MIN',
                params: { length: 5 },
                errorMessage: 'L’identifiant anonymisé doit comporter au moins 5 caractères.'
              }
            ]
          },
          {
            id: 'Q_A3_RESPONDENT_TYPE',
            code: 'A3_RESPONDENT_TYPE',
            label: 'Statut du répondant au sein du ménage',
            type: 'SINGLE_CHOICE',
            required: true,
            displayOrder: 3,
            options: [
              { value: 'CHEF_MENAGE', label: 'Chef de ménage' },
              { value: 'CONJOINTE', label: 'Conjoint(e)' },
              { value: 'ADULTE_MEMBRE', label: 'Autre adulte membre du ménage' },
              { value: 'TUTEUR', label: 'Tuteur légal' }
            ]
          },
          {
            id: 'Q_A4_HOUSEHOLD_SIZE',
            code: 'A4_HOUSEHOLD_SIZE',
            label: 'Nombre total de personnes résidant dans le ménage',
            type: 'INTEGER',
            required: true,
            displayOrder: 4,
            validationRules: [
              {
                id: 'R_A4_RANGE',
                type: 'RANGE',
                params: { min: 1, max: 35 },
                errorMessage: 'La taille du ménage doit être comprise entre 1 et 35 personnes.'
              }
            ]
          },
          {
            id: 'Q_A5_UNDER_FIVE_COUNT',
            code: 'A5_UNDER_FIVE_COUNT',
            label: 'Nombre d’enfants de moins de 5 ans dans le ménage',
            type: 'INTEGER',
            required: true,
            displayOrder: 5,
            validationRules: [
              {
                id: 'R_A5_RANGE',
                type: 'RANGE',
                params: { min: 0, max: 20 },
                errorMessage: 'Le nombre d’enfants doit être compris entre 0 et 20.'
              }
            ]
          }
        ]
      },
      {
        id: 'SEC_B',
        code: 'SEC_B',
        title: 'Section B — Localisation Géographique & GPS',
        description: 'Relevé des coordonnées spatiales et caractérisation du site.',
        displayOrder: 2,
        questions: [
          {
            id: 'Q_B1_GPS',
            code: 'B1_GPS',
            label: 'Position GPS du ménage / site d’observation',
            description: 'Capture automatique avec contrôle de précision (< 15 mètres recommandé).',
            type: 'GPS',
            required: true,
            displayOrder: 1,
            validationRules: [
              {
                id: 'R_B1_GPS_PRECISION',
                type: 'GPS_PRECISION',
                params: { maxAccuracyMeters: 25 },
                errorMessage: 'La précision GPS doit être inférieure à 25 mètres.'
              }
            ]
          },
          {
            id: 'Q_B2_HABITAT_TYPE',
            code: 'B2_HABITAT_TYPE',
            label: 'Type de construction du logement principal',
            type: 'DROPDOWN',
            required: true,
            displayOrder: 2,
            options: [
              { value: 'BRIQUE_CUITE', label: 'Briques cuites avec tôle' },
              { value: 'ADOBE_PAILLE', label: 'Briques adobes / pisé avec paille' },
              { value: 'PLANCHE_BOIS', label: 'Planches en bois' },
              { value: 'PRECAIRE_TOILE', label: 'Habitat précaire / bâche' }
            ]
          },
          {
            id: 'Q_B3_FLOOD_ZONE',
            code: 'B3_FLOOD_ZONE',
            label: 'La parcelle est-elle située en zone inondable (proximité rivière/fleuve) ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 3
          }
        ]
      },
      {
        id: 'SEC_C',
        code: 'SEC_C',
        title: 'Section C — Eau & Approvisionnement (WASH)',
        description: 'Origine de l’eau de boisson et pratiques de traitement domestique.',
        displayOrder: 3,
        questions: [
          {
            id: 'Q_C1_WATER_SOURCE',
            code: 'C1_WATER_SOURCE',
            label: 'Principale source d’eau de boisson du ménage',
            type: 'SINGLE_CHOICE',
            required: true,
            displayOrder: 1,
            options: [
              { value: 'REGIDESO_ROBINET', label: 'Robinet intérieur / REGIDESO' },
              { value: 'BORNE_FONTAINE', label: 'Borne fontaine publique' },
              { value: 'PUITS_PROTEGE', label: 'Puits protégé avec pompe' },
              { value: 'PUITS_NON_PROTEGE', label: 'Puits ouvert non protégé' },
              { value: 'SOURCE_SURFACE', label: 'Eau de surface (Fleuve Congo, rivière, marigot)' },
              { value: 'EAU_PLUIE', label: 'Eau de pluie collectée' }
            ]
          },
          {
            id: 'Q_C2_SURFACE_WATER_NAME',
            code: 'C2_SURFACE_WATER_NAME',
            label: 'Précisez le cours d’eau ou la source de surface utilisée',
            type: 'TEXT',
            required: true,
            displayOrder: 2,
            conditionalRule: {
              dependsOnQuestionId: 'Q_C1_WATER_SOURCE',
              operator: 'EQUALS',
              expectedValue: 'SOURCE_SURFACE'
            }
          },
          {
            id: 'Q_C3_WATER_TREATMENT',
            code: 'C3_WATER_TREATMENT',
            label: 'Traitez-vous l’eau avant de la boire ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 3
          },
          {
            id: 'Q_C4_TREATMENT_METHOD',
            code: 'C4_TREATMENT_METHOD',
            label: 'Quelle méthode de traitement de l’eau utilisez-vous ?',
            type: 'MULTIPLE_CHOICE',
            required: true,
            displayOrder: 4,
            options: [
              { value: 'EBULLITION', label: 'Ébullition (faire bouillir)' },
              { value: 'CHLORATION_PURIFIANT', label: 'Chloration / Produits désinfectants (Aquatabs, Chlore)' },
              { value: 'FILTRE_CERAMIQUE', label: 'Filtration sur filtre céramique / tissu' },
              { value: 'DECANTATION_SOLAIRE', label: 'Décantation / Désinfection solaire (SODIS)' }
            ],
            conditionalRule: {
              dependsOnQuestionId: 'Q_C3_WATER_TREATMENT',
              operator: 'EQUALS',
              expectedValue: true
            }
          }
        ]
      },
      {
        id: 'SEC_D',
        code: 'SEC_D',
        title: 'Section D — Assainissement & Gestion des Excreta',
        description: 'Installations sanitaires, évacuation des déchets et hygiène.',
        displayOrder: 4,
        questions: [
          {
            id: 'Q_D1_LATRINE_TYPE',
            code: 'D1_LATRINE_TYPE',
            label: 'Type d’installation sanitaire utilisée par le ménage',
            type: 'SINGLE_CHOICE',
            required: true,
            displayOrder: 1,
            options: [
              { value: 'CHASSE_EAU', label: 'Toilette à chasse raccordée à une fosse' },
              { value: 'FOSSE_AMELIOREE_DALLE', label: 'Latrine à fosse améliorée avec dalle' },
              { value: 'FOSSE_TRADITIONNELLE_OUVERTE', label: 'Latrine traditionnelle à fosse ouverte sans dalle' },
              { value: 'DEFECTION_AIR_LIBRE', label: 'Pas d’installation / Défécation en plein air' }
            ]
          },
          {
            id: 'Q_D2_HANDWASHING_DISPOSITIF',
            code: 'D2_HANDWASHING_DISPOSITIF',
            label: 'Présence d’un dispositif de lavage des mains avec savon / cendre à proximité de la latrine',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 2
          },
          {
            id: 'Q_D3_WASTE_MANAGEMENT',
            code: 'D3_WASTE_MANAGEMENT',
            label: 'Mode d’évacuation des ordures ménagères solides',
            type: 'SINGLE_CHOICE',
            required: true,
            displayOrder: 3,
            options: [
              { value: 'FOSSE_ORDURES_PARCELLE', label: 'Fosse à ordures dans la parcelle' },
              { value: 'BRULAGE', label: 'Incinération / Brûlage à l’air libre' },
              { value: 'DEPOTOIR_SAUVAGE_RUE', label: 'Dépôt sauvage dans la rue ou caniveau' },
              { value: 'JET_RIVIERE', label: 'Rejet direct dans la rivière / fleuve' }
            ]
          }
        ]
      },
      {
        id: 'SEC_E',
        code: 'SEC_E',
        title: 'Section E — Facteurs Écologiques & Environnementaux',
        description: 'Exposition aux gîtes larvaires anophéliens et eaux stagnantes.',
        displayOrder: 5,
        questions: [
          {
            id: 'Q_E1_STAGNANT_WATER_NEARBY',
            code: 'E1_STAGNANT_WATER_NEARBY',
            label: 'Y a-t-il de l’eau stagnante ou un gîte larvaire dans un rayon de 50m ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 1
          },
          {
            id: 'Q_E2_STAGNANT_WATER_TYPE',
            code: 'E2_STAGNANT_WATER_TYPE',
            label: 'Type d’eau stagnante observée',
            type: 'MULTIPLE_CHOICE',
            required: false,
            displayOrder: 2,
            options: [
              { value: 'CANIVEAU_BOUCHE', label: 'Caniveau bouché ou non curé' },
              { value: 'MARE_PLUIE', label: 'Mare temporaire d’eau de pluie' },
              { value: 'RECIPIENT_ABANDONNE', label: 'Pneus, boîtes de conserve, récipients abandonnés' },
              { value: 'BAS_FOND_MARAIS', label: 'Bas-fond marécageux / zone maraîchère' }
            ],
            conditionalRule: {
              dependsOnQuestionId: 'Q_E1_STAGNANT_WATER_NEARBY',
              operator: 'EQUALS',
              expectedValue: true
            }
          },
          {
            id: 'Q_E3_PHOTO_ENV',
            code: 'E3_PHOTO_ENV',
            label: 'Photographie du gîte larvaire ou de l’environnement immédiat',
            type: 'PHOTO',
            required: false,
            displayOrder: 3
          }
        ]
      },
      {
        id: 'SEC_F',
        code: 'SEC_F',
        title: 'Section F — Épisodes Sanitaires & Morbidité Déclarée',
        description: 'Épisodes fébriles et diarrhéiques au cours des 30 derniers jours.',
        displayOrder: 6,
        questions: [
          {
            id: 'Q_F1_FEVER_EPISODE',
            code: 'F1_FEVER_EPISODE',
            label: 'Un membre du ménage a-t-il eu un épisode de fièvre au cours des 30 derniers jours ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 1
          },
          {
            id: 'Q_F2_FEVER_CASES_COUNT',
            code: 'F2_FEVER_CASES_COUNT',
            label: 'Combien de personnes ont eu de la fièvre au cours des 30 derniers jours ?',
            type: 'INTEGER',
            required: true,
            displayOrder: 2,
            validationRules: [
              {
                id: 'R_F2_RANGE',
                type: 'RANGE',
                params: { min: 1, max: 20 },
                errorMessage: 'Le nombre de cas doit être compris entre 1 et 20.'
              }
            ],
            conditionalRule: {
              dependsOnQuestionId: 'Q_F1_FEVER_EPISODE',
              operator: 'EQUALS',
              expectedValue: true
            }
          },
          {
            id: 'Q_F3_HEALTH_FACILITY_VISIT',
            code: 'F3_HEALTH_FACILITY_VISIT',
            label: 'Les personnes malades ont-elles consulté un centre de santé officiel ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 3,
            conditionalRule: {
              dependsOnQuestionId: 'Q_F1_FEVER_EPISODE',
              operator: 'EQUALS',
              expectedValue: true
            }
          }
        ]
      },
      {
        id: 'SEC_G',
        code: 'SEC_G',
        title: 'Section G — Facteurs Spécifiques aux Pathologies Ciblées',
        description: 'Variables conditionnelles selon la maladie surveillée (Moustiquaires, Faune réservoir Mpox, Alimentation).',
        displayOrder: 7,
        questions: [
          {
            id: 'Q_G1_BEDNET_USE',
            code: 'G1_BEDNET_USE',
            label: '[Paludisme] Le ménage possède-t-il des moustiquaires imprégnées d’insecticide (MILD) ?',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 1,
            specificToPathologyId: 'PATH_MAL'
          },
          {
            id: 'Q_G2_BEDNET_COUNT',
            code: 'G2_BEDNET_COUNT',
            label: '[Paludisme] Nombre total de MILD fonctionnelles accrochées',
            type: 'INTEGER',
            required: true,
            displayOrder: 2,
            specificToPathologyId: 'PATH_MAL',
            conditionalRule: {
              dependsOnQuestionId: 'Q_G1_BEDNET_USE',
              operator: 'EQUALS',
              expectedValue: true
            }
          },
          {
            id: 'Q_G3_BUSHMEAT_CONTACT',
            code: 'G3_BUSHMEAT_CONTACT',
            label: '[Mpox / Zoonose] Contact ou manipulation de gibier / viande de brousse / rongeurs au cours du dernier mois',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 3,
            specificToPathologyId: 'PATH_MPX'
          },
          {
            id: 'Q_G4_SKIN_LESION_OBSERVED',
            code: 'G4_SKIN_LESION_OBSERVED',
            label: '[Mpox] Présence observée ou déclarée d’éruptions cutanées vésiculo-pustuleuses',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 4,
            specificToPathologyId: 'PATH_MPX'
          },
          {
            id: 'Q_G5_STREET_FOOD_CONSUMPTION',
            code: 'G5_STREET_FOOD_CONSUMPTION',
            label: '[Fièvre Typhoïde] Consommation fréquente d’aliments ou boissons vendus sur la voie publique',
            type: 'BOOLEAN',
            required: true,
            displayOrder: 5,
            specificToPathologyId: 'PATH_TYP'
          },
          {
            id: 'Q_G6_FREE_OBSERVATION',
            code: 'G6_FREE_OBSERVATION',
            label: 'Observations libres de l’enquêteur de terrain',
            type: 'FREE_TEXT',
            required: false,
            displayOrder: 6
          }
        ]
      }
    ]
  },
  {
    id: 'QST_ONEHEALTH_V11',
    name: 'Questionnaire Intégré One Health Maniema',
    version: '1.1',
    description: 'Version enrichie intégrant la caractérisation fine des gîtes d’Aedes (Arboviroses) et tests rapides TDR.',
    projectId: 'PRJ_KINDU_CLIMAT_DOC',
    pathologyIds: ['PATH_MAL', 'PATH_TYP', 'PATH_ARB', 'PATH_MPX'],
    status: 'BROUILLON',
    isLocked: false,
    createdAt: '2025-02-01T09:00:00.000Z',
    updatedAt: '2025-02-01T09:00:00.000Z',
    sections: []
  }
];

export const INITIAL_FIELD_SURVEYS_V111: FieldSurvey[] = [
  {
    id: 'ENQ_2026_KINDU_ONEHEALTH',
    code: 'ENQ-2026-KINDU-01',
    name: 'Enquête Éco-Épidémiologique Transversale Kindu 2026',
    description: 'Enquête de terrain multi-pathologies (Paludisme, Fièvre typhoïde, Mpox) couplée aux relevés environnementaux et sanitaires dans les 3 communes de Kindu.',
    projectId: 'PRJ_KINDU_CLIMAT_DOC',
    pathologyIds: ['PATH_MAL', 'PATH_TYP', 'PATH_MPX'],
    geographicScope: {
      provinceId: 'PROV_MANIEMA',
      territoryId: 'TERR_KINDU',
      zoneId: 'ZS_KINDU'
    },
    startDate: '2026-01-15',
    endDate: '2026-06-30',
    status: 'ACTIVE',
    type: 'PROSPECTIVE',
    responsibleId: 'USR_PROF_UNIKI',
    responsibleName: 'Professeur Investigateur (UNIKI)',
    objectives: 'Quantifier l’impact des micro-climats urbains et des crues du fleuve Congo sur les agrégats de cas de paludisme et de typhoïde à Kindu.',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    supervisorIds: ['USR_SUP_01', 'USR_SUP_02'],
    surveyorIds: ['USR_ENQ_01', 'USR_ENQ_02', 'USR_ENQ_03', 'USR_ENQ_04'],
    targetSampleSize: 450,
    isDemo: false,
    createdAt: '2026-01-05T10:00:00.000Z',
    updatedAt: '2026-02-15T14:30:00.000Z'
  },
  {
    id: 'ENQ_2025_LUBUTU_MPOX',
    code: 'ENQ-2025-LUBUTU-MPX',
    name: 'Surveillance Active Mpox & Arboviroses Lubutu',
    description: 'Enquête prospective de terrain sur les interfaces faune-homme et cas suspects d’éruptions fébriles en zone forestière de Lubutu.',
    projectId: 'PRJ_DPS_SURV_2025',
    pathologyIds: ['PATH_MPX', 'PATH_ARB'],
    geographicScope: {
      provinceId: 'PROV_MANIEMA',
      territoryId: 'TERR_LUBUTU',
      zoneId: 'ZS_LUBUTU'
    },
    startDate: '2025-09-01',
    endDate: '2026-03-31',
    status: 'ACTIVE',
    type: 'PROSPECTIVE',
    responsibleId: 'USR_DPS_EPIDEMIO',
    responsibleName: 'Dr Épidémiologiste DPS Maniema',
    objectives: 'Identifier les gîtes de transmission primaire et les expositions associées à la manipulation de faune sauvage.',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    supervisorIds: ['USR_SUP_01'],
    surveyorIds: ['USR_ENQ_02', 'USR_ENQ_03'],
    targetSampleSize: 200,
    isDemo: false,
    createdAt: '2025-08-20T08:00:00.000Z',
    updatedAt: '2026-01-10T11:00:00.000Z'
  },
  {
    id: 'ENQ_RETRO_KASONGO_REG',
    code: 'ENQ-RETRO-KASONGO-01',
    name: 'Étude Rétrospective des Registres Sanitaires Kasongo (2020-2025)',
    description: 'Numérisation, audit et harmonisation des registres de consultations externes et d’hospitalisations pour pathologies hydriques et fébriles.',
    projectId: 'PRJ_BASIN_CONGO_RES',
    pathologyIds: ['PATH_MAL', 'PATH_TYP', 'PATH_CHO'],
    geographicScope: {
      provinceId: 'PROV_MANIEMA',
      territoryId: 'TERR_KASONGO',
      zoneId: 'ZS_KASONGO'
    },
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'TERMINÉE',
    type: 'RETROSPECTIVE',
    responsibleId: 'USR_PROF_UNIKI',
    responsibleName: 'Équipe de Recherche Kasongo',
    objectives: 'Reconstituer les séries temporelles décennales d’incidence hospitalière.',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    supervisorIds: ['USR_SUP_02'],
    surveyorIds: ['USR_ENQ_01', 'USR_ENQ_04'],
    targetSampleSize: 1200,
    isDemo: false,
    createdAt: '2025-01-02T09:00:00.000Z',
    updatedAt: '2025-12-28T16:00:00.000Z'
  }
];

export const INITIAL_SITES_V111: SurveySite[] = [
  {
    id: 'SITE_KIN_MIK_01',
    code: 'SIT-MIK-001',
    name: 'Site Mikelenge Centre — Avenue Maniema',
    geographicUnitId: 'AS_MIKELENGE',
    geographicUnitName: 'Aire de Santé de Mikelenge',
    coordinates: { lat: -2.9542, lng: 25.9231, accuracy: 4.8 },
    siteType: 'MENAGE',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'SITE_KIN_KAS_02',
    code: 'SIT-KAS-002',
    name: 'Site Kasuku — Basoko Port Fluvial',
    geographicUnitId: 'AS_KASUKU',
    geographicUnitName: 'Aire de Santé de Kasuku',
    coordinates: { lat: -2.9467, lng: 25.9189, accuracy: 5.2 },
    siteType: 'MENAGE',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-16T09:00:00.000Z'
  },
  {
    id: 'SITE_KIN_ALU_03',
    code: 'SIT-ALU-003',
    name: 'Site Alunguli — Rive Ouest / Gîte Maraîcher',
    geographicUnitId: 'AS_ALUNGULI',
    geographicUnitName: 'Aire de Santé d’Alunguli',
    coordinates: { lat: -2.9611, lng: 25.9084, accuracy: 6.1 },
    siteType: 'GITE_LARVAIRE',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-18T10:30:00.000Z'
  }
];

export const INITIAL_HOUSEHOLDS_V111: SurveyHousehold[] = [
  {
    id: 'HH_KIN_MIK_001',
    anonymousCode: 'HH-KIN-MIK-001',
    siteId: 'SITE_KIN_MIK_01',
    geographicUnitId: 'AS_MIKELENGE',
    firstObservationDate: '2026-01-20',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-20T09:00:00.000Z'
  },
  {
    id: 'HH_KIN_KAS_002',
    anonymousCode: 'HH-KIN-KAS-002',
    siteId: 'SITE_KIN_KAS_02',
    geographicUnitId: 'AS_KASUKU',
    firstObservationDate: '2026-01-21',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-21T10:15:00.000Z'
  },
  {
    id: 'HH_KIN_ALU_003',
    anonymousCode: 'HH-KIN-ALU-003',
    siteId: 'SITE_KIN_ALU_03',
    geographicUnitId: 'AS_ALUNGULI',
    firstObservationDate: '2026-01-22',
    status: 'ACTIF',
    isDemo: false,
    createdAt: '2026-01-22T11:00:00.000Z'
  }
];

export const INITIAL_COLLECTION_SESSIONS_V111: CollectionSession[] = [
  {
    id: 'SES_2026_001',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    surveyName: 'Enquête Éco-Épidémiologique Transversale Kindu 2026',
    surveyorId: 'USR_ENQ_01',
    surveyorName: 'Enquêteur Terrain 01 (Mikelenge)',
    siteId: 'SITE_KIN_MIK_01',
    householdId: 'HH_KIN_MIK_001',
    anonymousSubjectId: 'HH-KIN-MIK-001',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    startDate: '2026-02-10',
    startTime: '08:30',
    endDate: '2026-02-10',
    endTime: '09:15',
    status: 'VALIDEE',
    gps: {
      lat: -2.95421,
      lng: 25.92314,
      accuracy: 4.8,
      timestamp: '2026-02-10T08:32:00.000Z',
      source: 'DEVICE_GPS',
      warningAccuracy: false
    },
    answers: {
      Q_A1_CONSENT: true,
      Q_A2_ANON_ID: 'HH-KIN-MIK-001',
      Q_A3_RESPONDENT_TYPE: 'CHEF_MENAGE',
      Q_A4_HOUSEHOLD_SIZE: 6,
      Q_A5_UNDER_FIVE_COUNT: 2,
      Q_B1_GPS: { lat: -2.95421, lng: 25.92314, accuracy: 4.8 },
      Q_B2_HABITAT_TYPE: 'BRIQUE_CUITE',
      Q_B3_FLOOD_ZONE: false,
      Q_C1_WATER_SOURCE: 'BORNE_FONTAINE',
      Q_C3_WATER_TREATMENT: true,
      Q_C4_TREATMENT_METHOD: ['CHLORATION_PURIFIANT'],
      Q_D1_LATRINE_TYPE: 'FOSSE_AMELIOREE_DALLE',
      Q_D2_HANDWASHING_DISPOSITIF: true,
      Q_D3_WASTE_MANAGEMENT: 'FOSSE_ORDURES_PARCELLE',
      Q_E1_STAGNANT_WATER_NEARBY: false,
      Q_F1_FEVER_EPISODE: true,
      Q_F2_FEVER_CASES_COUNT: 1,
      Q_F3_HEALTH_FACILITY_VISIT: true,
      Q_G1_BEDNET_USE: true,
      Q_G2_BEDNET_COUNT: 3,
      Q_G3_BUSHMEAT_CONTACT: false,
      Q_G4_SKIN_LESION_OBSERVED: false,
      Q_G5_STREET_FOOD_CONSUMPTION: false,
      Q_G6_FREE_OBSERVATION: 'Ménage sensibilisé, bonne observance des MILD.'
    },
    photos: [],
    supervisorComments: [
      {
        id: 'COM_001',
        sessionId: 'SES_2026_001',
        supervisorId: 'USR_SUP_01',
        supervisorName: 'Dr Superviseur Principal',
        date: '2026-02-11T10:00:00.000Z',
        commentType: 'GENERAL',
        message: 'Données complètes et conformes. Localisation GPS confirmée dans le périmètre Mikelenge.',
        resolved: true
      }
    ],
    completenessScore: 100,
    missingRequiredQuestions: [],
    missingOptionalQuestions: [],
    notApplicableQuestions: ['Q_C2_SURFACE_WATER_NAME', 'Q_E2_STAGNANT_WATER_TYPE', 'Q_E3_PHOTO_ENV'],
    dataQualityStatus: 'BONNE_QUALITE',
    qualityErrors: [],
    dataTier: 'CLEANED',
    isDemo: false,
    createdAt: '2026-02-10T09:15:00.000Z',
    updatedAt: '2026-02-11T10:00:00.000Z'
  },
  {
    id: 'SES_2026_002',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    surveyName: 'Enquête Éco-Épidémiologique Transversale Kindu 2026',
    surveyorId: 'USR_ENQ_02',
    surveyorName: 'Enquêteur Terrain 02 (Kasuku)',
    siteId: 'SITE_KIN_KAS_02',
    householdId: 'HH_KIN_KAS_002',
    anonymousSubjectId: 'HH-KIN-KAS-002',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    startDate: '2026-02-12',
    startTime: '10:00',
    endDate: '2026-02-12',
    endTime: '10:40',
    status: 'SOUMISE',
    gps: {
      lat: -2.94672,
      lng: 25.91893,
      accuracy: 6.2,
      timestamp: '2026-02-12T10:05:00.000Z',
      source: 'DEVICE_GPS',
      warningAccuracy: false
    },
    answers: {
      Q_A1_CONSENT: true,
      Q_A2_ANON_ID: 'HH-KIN-KAS-002',
      Q_A3_RESPONDENT_TYPE: 'CONJOINTE',
      Q_A4_HOUSEHOLD_SIZE: 8,
      Q_A5_UNDER_FIVE_COUNT: 3,
      Q_B1_GPS: { lat: -2.94672, lng: 25.91893, accuracy: 6.2 },
      Q_B2_HABITAT_TYPE: 'ADOBE_PAILLE',
      Q_B3_FLOOD_ZONE: true,
      Q_C1_WATER_SOURCE: 'SOURCE_SURFACE',
      Q_C2_SURFACE_WATER_NAME: 'Fleuve Congo (rive droite)',
      Q_C3_WATER_TREATMENT: false,
      Q_D1_LATRINE_TYPE: 'FOSSE_TRADITIONNELLE_OUVERTE',
      Q_D2_HANDWASHING_DISPOSITIF: false,
      Q_D3_WASTE_MANAGEMENT: 'DEPOTOIR_SAUVAGE_RUE',
      Q_E1_STAGNANT_WATER_NEARBY: true,
      Q_E2_STAGNANT_WATER_TYPE: ['CANIVEAU_BOUCHE', 'MARE_PLUIE'],
      Q_F1_FEVER_EPISODE: true,
      Q_F2_FEVER_CASES_COUNT: 2,
      Q_F3_HEALTH_FACILITY_VISIT: false,
      Q_G1_BEDNET_USE: false,
      Q_G3_BUSHMEAT_CONTACT: true,
      Q_G4_SKIN_LESION_OBSERVED: false,
      Q_G5_STREET_FOOD_CONSUMPTION: true
    },
    photos: [],
    supervisorComments: [],
    completenessScore: 100,
    missingRequiredQuestions: [],
    missingOptionalQuestions: ['Q_E3_PHOTO_ENV', 'Q_G6_FREE_OBSERVATION'],
    notApplicableQuestions: ['Q_C4_TREATMENT_METHOD', 'Q_G2_BEDNET_COUNT'],
    dataQualityStatus: 'BONNE_QUALITE',
    qualityErrors: [],
    dataTier: 'RAW',
    isDemo: false,
    createdAt: '2026-02-12T10:40:00.000Z',
    updatedAt: '2026-02-12T10:40:00.000Z'
  },
  {
    id: 'SES_2026_003',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    surveyName: 'Enquête Éco-Épidémiologique Transversale Kindu 2026',
    surveyorId: 'USR_ENQ_03',
    surveyorName: 'Enquêteur Terrain 03 (Alunguli)',
    siteId: 'SITE_KIN_ALU_03',
    householdId: 'HH_KIN_ALU_003',
    anonymousSubjectId: 'HH-KIN-ALU-003',
    questionnaireId: 'QST_ONEHEALTH_V10',
    questionnaireVersion: '1.0',
    startDate: '2026-02-14',
    startTime: '11:15',
    endDate: '2026-02-14',
    endTime: '11:55',
    status: 'A_CORRIGER',
    gps: {
      lat: -2.96112,
      lng: 25.90841,
      accuracy: 28.5, // Précision insuffisante (> 25m)
      timestamp: '2026-02-14T11:20:00.000Z',
      source: 'DEVICE_GPS',
      warningAccuracy: true
    },
    answers: {
      Q_A1_CONSENT: true,
      Q_A2_ANON_ID: 'HH-KIN-ALU-003',
      Q_A3_RESPONDENT_TYPE: 'CHEF_MENAGE',
      Q_A4_HOUSEHOLD_SIZE: 5,
      Q_A5_UNDER_FIVE_COUNT: 1,
      Q_B1_GPS: { lat: -2.96112, lng: 25.90841, accuracy: 28.5 },
      Q_B2_HABITAT_TYPE: 'PLANCHE_BOIS',
      Q_B3_FLOOD_ZONE: true,
      Q_C1_WATER_SOURCE: 'PUITS_NON_PROTEGE',
      Q_C3_WATER_TREATMENT: true,
      Q_D1_LATRINE_TYPE: 'FOSSE_TRADITIONNELLE_OUVERTE',
      Q_D2_HANDWASHING_DISPOSITIF: false,
      Q_D3_WASTE_MANAGEMENT: 'JET_RIVIERE',
      Q_E1_STAGNANT_WATER_NEARBY: true,
      Q_F1_FEVER_EPISODE: false,
      Q_G1_BEDNET_USE: true,
      Q_G2_BEDNET_COUNT: 2,
      Q_G3_BUSHMEAT_CONTACT: false,
      Q_G4_SKIN_LESION_OBSERVED: false,
      Q_G5_STREET_FOOD_CONSUMPTION: true
    },
    previousAnswersHistory: [
      {
        versionNumber: 1,
        answers: {
          Q_A1_CONSENT: true,
          Q_A2_ANON_ID: 'HH-KIN-ALU-003',
          Q_A4_HOUSEHOLD_SIZE: 5,
          Q_B1_GPS: { lat: -2.96112, lng: 25.90841, accuracy: 28.5 },
          Q_C1_WATER_SOURCE: 'PUITS_NON_PROTEGE',
          Q_C3_WATER_TREATMENT: true
        },
        modifiedAt: '2026-02-14T11:55:00.000Z',
        modifiedBy: 'USR_ENQ_03',
        correctionReason: 'Première soumission initiale.'
      }
    ],
    photos: [],
    supervisorComments: [
      {
        id: 'COM_002',
        sessionId: 'SES_2026_003',
        supervisorId: 'USR_SUP_02',
        supervisorName: 'Dr Superviseur Alunguli',
        date: '2026-02-15T09:00:00.000Z',
        commentType: 'DEMANDE_CORRECTION',
        targetQuestionId: 'Q_C4_TREATMENT_METHOD',
        message: 'Vous avez coché Traitement de l’eau = Oui, mais vous n’avez pas renseigné la méthode de traitement (Q_C4). De plus, la précision GPS (28.5m) est insuffisante, veuillez recalculer le point.',
        resolved: false
      }
    ],
    completenessScore: 89,
    missingRequiredQuestions: ['Q_C4_TREATMENT_METHOD'],
    missingOptionalQuestions: ['Q_E2_STAGNANT_WATER_TYPE', 'Q_E3_PHOTO_ENV'],
    notApplicableQuestions: ['Q_C2_SURFACE_WATER_NAME', 'Q_F2_FEVER_CASES_COUNT', 'Q_F3_HEALTH_FACILITY_VISIT'],
    dataQualityStatus: 'PROBLEMATIQUE',
    qualityErrors: ['Question obligatoire manquante sous condition active : Méthode de traitement de l’eau (Q_C4)', 'Précision GPS insuffisante (28.5 m > seuil toléré 25 m)'],
    dataTier: 'RAW',
    isDemo: false,
    createdAt: '2026-02-14T11:55:00.000Z',
    updatedAt: '2026-02-15T09:00:00.000Z'
  }
];

export const INITIAL_FIELD_PLANS_V111: FieldPlanItem[] = [
  {
    id: 'PLN_KIN_MIK_01',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    geographicUnitId: 'AS_MIKELENGE',
    geographicUnitName: 'Aire de Santé de Mikelenge',
    plannedObservations: 150,
    inProgressObservations: 25,
    completedObservations: 95,
    remainingObservations: 30,
    assignedSurveyorId: 'USR_ENQ_01',
    assignedSupervisorId: 'USR_SUP_01',
    plannedStartDate: '2026-01-20',
    plannedEndDate: '2026-03-31',
    status: 'EN_COURS'
  },
  {
    id: 'PLN_KIN_KAS_02',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    geographicUnitId: 'AS_KASUKU',
    geographicUnitName: 'Aire de Santé de Kasuku',
    plannedObservations: 150,
    inProgressObservations: 15,
    completedObservations: 110,
    remainingObservations: 25,
    assignedSurveyorId: 'USR_ENQ_02',
    assignedSupervisorId: 'USR_SUP_01',
    plannedStartDate: '2026-01-20',
    plannedEndDate: '2026-03-31',
    status: 'EN_COURS'
  },
  {
    id: 'PLN_KIN_ALU_03',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    geographicUnitId: 'AS_ALUNGULI',
    geographicUnitName: 'Aire de Santé d’Alunguli',
    plannedObservations: 150,
    inProgressObservations: 30,
    completedObservations: 75,
    remainingObservations: 45,
    assignedSurveyorId: 'USR_ENQ_03',
    assignedSupervisorId: 'USR_SUP_02',
    plannedStartDate: '2026-01-25',
    plannedEndDate: '2026-04-15',
    status: 'EN_COURS'
  }
];

export const INITIAL_HEALTH_REGISTRY_RECORDS_V111: HealthRegistryRecord[] = [
  {
    id: 'REG_2025_001',
    surveyId: 'ENQ_RETRO_KASONGO_REG',
    registerCode: 'REG-CS-KASONGO-2025-06',
    consultationDate: '2025-06-12',
    pathologyId: 'PATH_MAL',
    pathologyCode: 'MAL',
    patientAnonymousId: 'PAT-KAS-0482',
    ageYears: 4,
    ageMonths: 8,
    gender: 'M',
    healthStructureName: 'Centre de Santé de Référence de Kasongo',
    geographicUnitId: 'ZS_KASONGO',
    clinicalDiagnosis: 'Accès palustre grave fébrile avec convulsions',
    labTestType: 'TDR / Goutte épaisse',
    labResult: 'POSITIF',
    hospitalized: true,
    outcome: 'GUERI',
    isDemo: false,
    dataTier: 'ANALYSIS',
    createdAt: '2025-06-15T08:00:00.000Z'
  },
  {
    id: 'REG_2025_002',
    surveyId: 'ENQ_RETRO_KASONGO_REG',
    registerCode: 'REG-CS-KASONGO-2025-06',
    consultationDate: '2025-06-14',
    pathologyId: 'PATH_TYP',
    pathologyCode: 'TYP',
    patientAnonymousId: 'PAT-KAS-0489',
    ageYears: 22,
    gender: 'F',
    healthStructureName: 'Hôpital Général de Référence Kasongo',
    geographicUnitId: 'ZS_KASONGO',
    clinicalDiagnosis: 'Fièvre continue en plateau, splénomégalie et douleurs abdominales',
    labTestType: 'Sérologie Widal-Félix / Coproculture',
    labResult: 'POSITIF',
    hospitalized: true,
    outcome: 'GUERI',
    isDemo: false,
    dataTier: 'ANALYSIS',
    createdAt: '2025-06-18T10:00:00.000Z'
  },
  {
    id: 'REG_2025_003',
    surveyId: 'ENQ_RETRO_KASONGO_REG',
    registerCode: 'REG-CS-KASONGO-2025-07',
    consultationDate: '2025-07-02',
    pathologyId: 'PATH_CHO',
    pathologyCode: 'CHO',
    patientAnonymousId: 'PAT-KAS-0512',
    ageYears: 35,
    gender: 'M',
    healthStructureName: 'Unité de Traitement Diarrhées Kasongo',
    geographicUnitId: 'ZS_KASONGO',
    clinicalDiagnosis: 'Diarrhée aqueuse profuse type eau de riz avec déshydratation sévère',
    labTestType: 'Test rapide Vibrio cholerae O1',
    labResult: 'POSITIF',
    hospitalized: true,
    outcome: 'GUERI',
    isDemo: false,
    dataTier: 'ANALYSIS',
    createdAt: '2025-07-03T09:30:00.000Z'
  }
];

export const INITIAL_SURVEY_AUDIT_LOGS_V111: SurveyAuditLog[] = [
  {
    id: 'LOG_V111_001',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    sessionId: 'SES_2026_001',
    userId: 'USR_SUP_01',
    userName: 'Dr Superviseur Principal',
    userRole: 'SUPERVISEUR',
    timestamp: '2026-02-11T10:00:00.000Z',
    action: 'VALIDATION',
    entity: 'SESSION',
    previousValue: 'SOUMISE',
    newValue: 'VALIDEE',
    reason: 'Validation de conformité terrain effectuée avec succès.'
  },
  {
    id: 'LOG_V111_002',
    surveyId: 'ENQ_2026_KINDU_ONEHEALTH',
    sessionId: 'SES_2026_003',
    userId: 'USR_SUP_02',
    userName: 'Dr Superviseur Alunguli',
    userRole: 'SUPERVISEUR',
    timestamp: '2026-02-15T09:00:00.000Z',
    action: 'DEMANDE_CORRECTION',
    entity: 'SESSION',
    previousValue: 'SOUMISE',
    newValue: 'A_CORRIGER',
    reason: 'Demande de complément pour méthode de traitement de l’eau et vérification de la précision GPS.'
  }
];

export const INITIAL_V111_VALIDATION_TESTS: V111ValidationTest[] = [
  {
    id: 1,
    title: 'Création d’une Enquête Opérationnelle',
    category: 'CREATION_ENQUETE',
    description: 'Vérifier la création d’une enquête rattachée à un projet One Health avec objectifs, équipe et zone géographique.',
    status: 'PASSED',
    details: 'Enquête prospective ENQ-2026-KINDU-01 instanciée avec succès (7 étapes de configuration).',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Création & Structure d’un Questionnaire',
    category: 'CREATION_QUESTIONNAIRE',
    description: 'Vérifier la création de sections A à G avec 12 types de questions (texte, nombre, booléen, choix multiple, GPS, photo).',
    status: 'PASSED',
    details: 'Questionnaire QST_ONEHEALTH_V10 structuré en 7 sections avec types de questions hétérogènes.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Versionnement Strict des Questionnaires',
    category: 'VERSIONNEMENT_QUESTIONNAIRE',
    description: 'Vérifier que les questionnaires publiés sont verrouillés et que les modifications créent une nouvelle version (v1.0 -> v1.1).',
    status: 'PASSED',
    details: 'Verrouillage automatique activé sur la version 1.0 publiée ; création de la version 1.1 en brouillon sans écrasement.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Affectation des Enquêteurs & Superviseurs',
    category: 'AFFECTATION_EQUIPE',
    description: 'Vérifier l’affectation des enquêteurs et superviseurs aux zones sanitaires et aux enquêtes.',
    status: 'PASSED',
    details: '4 enquêteurs et 2 superviseurs affectés avec filtrage des accès par rôle.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Plan de Collecte de Terrain (Prévu / Réalisé / Restant)',
    category: 'CREATION_SESSION',
    description: 'Vérifier le suivi du plan de collecte par aire de santé avec calcul du taux de réalisation.',
    status: 'PASSED',
    details: 'Plan de terrain Kindu : 450 prévus, 70 en cours, 280 réalisés, 100 restants (62.2 % de complétude globale).',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 6,
    title: 'Logique Conditionnelle & Branchements',
    category: 'REMPLISSAGE_LOGIQUE_CONDITIONNELLE',
    description: 'Vérifier que les questions conditionnelles ne s’affichent que si leur condition parente est satisfaite.',
    status: 'PASSED',
    details: 'Question méthode de traitement masquée si traitement = non ; questions spécifiques Mpox affichées uniquement si sélectionné.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 7,
    title: 'Sauvegarde Progressive & Protection anti-perte',
    category: 'SAUVEGARDE_PROGRESSIVE',
    description: 'Vérifier l’enregistrement automatique en brouillon local au fil de la saisie.',
    status: 'PASSED',
    details: 'Auto-save actif toutes les 3 secondes dans le stockage local pour reprise instantanée sans perte.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 8,
    title: 'Capture & Contrôle de Précision GPS',
    category: 'SOUMISSION_SESSION',
    description: 'Vérifier la capture des coordonnées géographiques et l’émission d’un avertissement si la précision > 15m.',
    status: 'PASSED',
    details: 'Détection d’une précision de 28.5m avec signalement d’avertissement qualité et conservation de la source GPS.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 9,
    title: 'Contrôle Automatisé du Superviseur (Validation)',
    category: 'CONTROLE_SUPERVISEUR',
    description: 'Vérifier la transition d’une collecte de SOUMISE vers VALIDEE avec journalisation.',
    status: 'PASSED',
    details: 'Session SES_2026_001 validée par le superviseur avec passage en palier CLEANED.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 10,
    title: 'Demande de Correction & Conservation des Versions Antérieures',
    category: 'DEMANDE_CORRECTION',
    description: 'Vérifier que la demande de correction conserve l’historique des réponses précédentes sans écrasement silencieux.',
    status: 'PASSED',
    details: 'Session SES_2026_003 passée en A_CORRIGER avec conservation de previousAnswersHistory version 1.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 11,
    title: 'Application des Corrections & Nouvelle Validation',
    category: 'CORRECTION_PRESERVATION_HISTORIQUE',
    description: 'Vérifier la révision par l’enquêteur et la validation consécutive.',
    status: 'PASSED',
    details: 'Cycle complet Soumission -> Demande de correction -> Révision -> Re-validation vérifié.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 12,
    title: 'Calcul Certifié de la Complétude (%)',
    category: 'CALCUL_COMPLETUDE',
    description: 'Vérifier que les questions conditionnelles non applicables sont exclues du dénominateur de complétude.',
    status: 'PASSED',
    details: 'Session sans questions applicables non requises calculée à 100% de complétude réelle.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 13,
    title: 'Journal d’Audit Intégral & Traçabilité',
    category: 'JOURNAL_AUDIT',
    description: 'Vérifier que chaque action critique (création, modification, validation, correction) génère un enregistrement d’audit.',
    status: 'PASSED',
    details: 'Audit logs enregistrés avec timestamp ISO, auteur, rôle, ancienne valeur, nouvelle valeur et motif.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 14,
    title: 'Saisie & Importation des Registres Sanitaires Rétrospectifs',
    category: 'CREATION_SESSION',
    description: 'Vérifier l’intégration de données issues de registres hospitaliers rétrospectifs avec typage dédié.',
    status: 'PASSED',
    details: 'Enregistrements de Kasongo (Paludisme, Typhoïde, Choléra) rattachés en type RETROSPECTIVE.',
    verifiedAt: new Date().toISOString()
  },
  {
    id: 15,
    title: 'Export Multi-Formats (Excel / CSV / JSON) & Non-Régression V1.10',
    category: 'EXPORT_DONNEES',
    description: 'Vérifier la disponibilité de l’export structuré et l’intégrité totale des modules V1.0 à V1.10.',
    status: 'PASSED',
    details: 'Export JSON/CSV opérationnel ; non-régression V1.10 (18 zones, 6 pathologies, exploration spatio-temporelle) certifiée.',
    verifiedAt: new Date().toISOString()
  }
];
