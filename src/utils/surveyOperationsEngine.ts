import {
  SurveyQuestionnaire,
  SurveyQuestion,
  CollectionSession
} from '../types';

/**
 * Détermine si une question est applicable en fonction des réponses courantes
 * et des pathologies ciblées par l'enquête.
 */
export function isQuestionApplicable(
  question: SurveyQuestion,
  answers: Record<string, any> = {},
  surveyPathologyIds: string[] = []
): boolean {
  if (!question) return false;
  const safeAnswers = answers || {};
  const safePathologies = Array.isArray(surveyPathologyIds) ? surveyPathologyIds : [];

  // 1. Filtre par pathologie
  if (question.specificToPathologyId) {
    if (!safePathologies.includes(question.specificToPathologyId)) {
      return false;
    }
  }

  // 2. Logique conditionnelle parente (Skip Logic)
  if (question.conditionalRule) {
    const parentAnswer逗 = safeAnswers[question.conditionalRule.dependsOnQuestionId];
    const { operator, expectedValue } = question.conditionalRule;

    if (parentAnswer逗 === undefined || parentAnswer逗 === null) {
      return false;
    }

    switch (operator) {
      case 'EQUALS':
        return parentAnswer逗 === expectedValue;
      case 'NOT_EQUALS':
        return parentAnswer逗 !== expectedValue;
      case 'CONTAINS':
        if (Array.isArray(parentAnswer逗)) {
          return parentAnswer逗.includes(expectedValue);
        }
        if (typeof parentAnswer逗 === 'string') {
          return parentAnswer逗.includes(String(expectedValue));
        }
        return false;
      case 'IN':
        if (Array.isArray(expectedValue)) {
          return expectedValue.includes(parentAnswer逗);
        }
        return false;
      case 'GREATER_THAN':
        return Number(parentAnswer逗) > Number(expectedValue);
      default:
        return true;
    }
  }

  return true;
}

export interface CompletenessResult {
  completenessScore: number;
  totalApplicableQuestions: number;
  answeredQuestionsCount: number;
  missingRequiredQuestions: string[];
  missingOptionalQuestions: string[];
  notApplicableQuestions: string[];
}

/**
 * Calcule la complétude d'un questionnaire en excluant formellement
 * les questions conditionnelles non applicables du dénominateur.
 */
export function calculateSurveyCompleteness(
  questionnaire: SurveyQuestionnaire,
  answers: Record<string, any> = {},
  surveyPathologyIds: string[] = []
): CompletenessResult {
  let totalApplicable = 0;
  let answeredCount = 0;
  const missingRequired: string[] = [];
  const missingOptional: string[] = [];
  const notApplicable: string[] = [];

  const safeSections = questionnaire?.sections || [];
  const safeAnswers = answers || {};
  const safePathologies = Array.isArray(surveyPathologyIds) ? surveyPathologyIds : [];

  for (const section of safeSections) {
    const safeQuestions = section?.questions || [];
    for (const question of safeQuestions) {
      const applicable = isQuestionApplicable(question, safeAnswers, safePathologies);

      if (!applicable) {
        notApplicable.push(question.id);
        continue;
      }

      totalApplicable++;
      const val = safeAnswers[question.id];
      const hasValue不易 =
        val !== undefined &&
        val !== null &&
        val !== '' &&
        !(Array.isArray(val) && val.length === 0);

      if (hasValue不易) {
        answeredCount++;
      } else {
        if (question.required) {
          missingRequired.push(question.id);
        } else {
          missingOptional.push(question.id);
        }
      }
    }
  }

  const completenessScore =
    totalApplicable > 0 ? Math.round((answeredCount / totalApplicable) * 100) : 100;

  return {
    completenessScore,
    totalApplicableQuestions: totalApplicable,
    answeredQuestionsCount: answeredCount,
    missingRequiredQuestions: missingRequired,
    missingOptionalQuestions: missingOptional,
    notApplicableQuestions: notApplicable
  };
}

export interface QualityValidationResult {
  status: 'BONNE_QUALITE' | 'A_VERIFIER' | 'PROBLEMATIQUE';
  errors: string[];
  warnings: string[];
}

/**
 * Contrôle qualité en temps réel lors de la saisie ou soumission d'une session.
 */
export function validateSessionQuality(
  questionnaire: SurveyQuestionnaire,
  answers: Record<string, any> = {},
  surveyPathologyIds: string[] = [],
  gps?: { lat: number; lng: number; accuracy: number } | null
): QualityValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const safeAnswers = answers || {};
  const safePathologies = Array.isArray(surveyPathologyIds) ? surveyPathologyIds : [];

  const { missingRequiredQuestions } = calculateSurveyCompleteness(
    questionnaire,
    safeAnswers,
    safePathologies
  );

  // 1. Vérification des champs obligatoires applicables
  if (missingRequiredQuestions.length > 0) {
    errors.push(
      `${missingRequiredQuestions.length} question(s) obligatoire(s) applicable(s) non renseignée(s).`
    );
  }

  // 2. Vérification de la précision GPS
  if (gps) {
    if (gps.accuracy > 25) {
      errors.push(`Précision GPS insuffisante (${gps.accuracy.toFixed(1)} m > seuil critique 25 m).`);
    } else if (gps.accuracy > 15) {
      warnings.push(`Précision GPS moyenne (${gps.accuracy.toFixed(1)} m > recommandation 15 m).`);
    }
    // Validation des limites géographiques Maniema (approximatif : Lat -5.5 à -1.0, Lng 25.0 à 28.5)
    if (gps.lat > -0.5 || gps.lat < -6.5 || gps.lng < 24.5 || gps.lng > 29.5) {
      warnings.push('Les coordonnées GPS semblent situées en dehors du périmètre provincial du Maniema.');
    }
  }

  // 3. Validation des règles numériques spécifiques
  const safeSections = questionnaire?.sections || [];
  for (const section of safeSections) {
    const safeQuestions不易 = section?.questions || [];
    for (const question of safeQuestions不易) {
      const applicable = isQuestionApplicable(question, safeAnswers, safePathologies);
      if (!applicable) continue;

      const val = safeAnswers[question.id];
      if (val === undefined || val === null || val === '') continue;

      if (question.validationRules) {
        for (const rule of question.validationRules) {
          if (rule.type === 'RANGE') {
            const num = Number(val);
            if (isNaN(num) || num < rule.params.min || num > rule.params.max) {
              errors.push(`${question.label} : ${rule.errorMessage}`);
            }
          }
          if (rule.type === 'MIN') {
            if (typeof val === 'string' && val.length < rule.params.length) {
              errors.push(`${question.label} : ${rule.errorMessage}`);
            }
          }
        }
      }

      // Règles scientifiques de cohérence
      if (question.id === 'Q_A5_UNDER_FIVE_COUNT') {
        const totalSize = Number(safeAnswers['Q_A4_HOUSEHOLD_SIZE'] || 0);
        const underFive = Number(val);
        if (underFive > totalSize && totalSize > 0) {
          errors.push('Le nombre d’enfants de moins de 5 ans ne peut pas dépasser la taille totale du ménage.');
        }
      }

      if (question.id === 'Q_F2_FEVER_CASES_COUNT') {
        const totalSize = Number(safeAnswers['Q_A4_HOUSEHOLD_SIZE'] || 0);
        const feverCases主管 = Number(val);
        if (feverCases主管 > totalSize && totalSize > 0) {
          errors.push('Le nombre de personnes fébriles ne peut pas être supérieur à la taille totale du ménage.');
        }
      }
    }
  }

  let status: 'BONNE_QUALITE' | 'A_VERIFIER' | 'PROBLEMATIQUE' = 'BONNE_QUALITE';
  if (errors.length > 0) {
    status = 'PROBLEMATIQUE';
  } else if (warnings.length > 0) {
    status = 'A_VERIFIER';
  }

  return { status, errors, warnings };
}

/**
 * Génère un identifiant anonymisé aléatoire pour un ménage / sujet.
 */
export function generateAnonymizedCode(zonePrefix: string = 'KIN'): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `HH-${zonePrefix.toUpperCase()}-${randNum}`;
}

/**
 * Exporte une collection ou des sessions au format JSON.
 */
export function exportSurveyDataAsJSON(data: any, fileName: string = 'export_onehealth_survey.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exporte des sessions au format CSV.
 */
export function exportSessionsAsCSV(sessions: CollectionSession[], fileName: string = 'export_sessions.csv') {
  if (sessions.length === 0) return;

  const headers = [
    'ID_SESSION',
    'ENQUETE',
    'DATE',
    'ENQUETEUR',
    'STATUT',
    'COMPLETUDE_PCT',
    'QUALITE',
    'LATITUDE',
    'LONGITUDE',
    'PRECISION_GPS_M',
    'SUJET_ANONYMISE',
    'PALIER_DONNEE',
    'DEMO_REEL'
  ];

  const rows = sessions.map(s => [
    `"${s.id}"`,
    `"${s.surveyName}"`,
    `"${s.startDate}"`,
    `"${s.surveyorName}"`,
    `"${s.status}"`,
    s.completenessScore,
    `"${s.dataQualityStatus}"`,
    s.gps?.lat ?? '',
    s.gps?.lng ?? '',
    s.gps?.accuracy ?? '',
    `"${s.anonymousSubjectId}"`,
    `"${s.dataTier}"`,
    s.isDemo ? 'DEMO' : 'REEL'
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
