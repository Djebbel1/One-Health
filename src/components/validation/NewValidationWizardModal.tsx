import React, { useState } from 'react';
import {
  ScientificValidationProject,
  ScientificModelingProject
} from '../../types';
import {
  runPreValidationCheck,
  auditDataLeakage,
  computeTimeSplitValidation,
  computeDecomposedRobustnessScore,
  computeDecomposedConfidenceScore,
  generateValidationReport20Sections,
  generateRValidationScript,
  generatePythonValidationScript
} from '../../utils/scientificValidationEngineV116';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  Activity,
  Layers,
  FileText,
  Sliders,
  Database,
  X
} from 'lucide-react';

interface NewValidationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableModels: ScientificModelingProject[];
  onValidationCreated: (newValidation: ScientificValidationProject) => void;
}

export const NewValidationWizardModal: React.FC<NewValidationWizardModalProps> = ({
  isOpen,
  onClose,
  availableModels,
  onValidationCreated
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    availableModels[0]?.id || 'MODEL_PROJ_2026_001'
  );
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('ANALYSIS_DATASET_001');
  const [selectedPathology, setSelectedPathology] = useState<'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE'>('PALUDISME');
  
  // Validation method & time/space configuration
  const [validationMethod, setValidationMethod] = useState<'TIME_SPLIT' | 'ROLLING_WALK_FORWARD' | 'SPATIAL_HOLD_OUT' | 'K_FOLD_CROSS_VALIDATION'>('TIME_SPLIT');
  const [trainCutoffYear, setTrainCutoffYear] = useState<number>(2024);
  const [testEndYear, setTestEndYear] = useState<number>(2026);
  const [holdOutZone, setHoldOutZone] = useState<string>('ZS_ALUNGULI');
  const [kFoldsCount, setKFoldsCount] = useState<number>(5);
  
  // Testing intentional anomalies
  const [injectDataLeakage, setInjectDataLeakage] = useState<boolean>(false);
  const [injectOverfitting, setInjectOverfitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentModel = availableModels.find(m => m.id === selectedModelId) || availableModels[0];

  // Pre-flight check execution
  const preCheck = runPreValidationCheck(
    currentModel || null,
    252,
    3,
    84,
    0.0,
    1
  );

  // Leakage audit
  const leakageAudit = auditDataLeakage(
    injectDataLeakage,
    false,
    false,
    false
  );

  const handleLaunchValidation = () => {
    if (leakageAudit.isValidationBlocked) {
      alert('Validation bloquée par l audit de fuite de données.');
      return;
    }

    const timeResult = computeTimeSplitValidation(
      `2020–${trainCutoffYear}`,
      `${trainCutoffYear + 1}–${testEndYear}`,
      180,
      72,
      injectOverfitting ? 4.2 : 6.84,
      injectOverfitting ? 0.94 : 0.742,
      injectOverfitting ? 2.4 : 1.15
    );

    const robustnessScore = computeDecomposedRobustnessScore(
      92,
      injectOverfitting ? 45 : 86,
      82,
      89,
      88,
      72
    );

    const confidenceScore = computeDecomposedConfidenceScore(
      85,
      injectDataLeakage ? 20 : 98,
      90,
      65
    );

    const newProj: ScientificValidationProject = {
      id: `VAL_PROJ_${Date.now()}`,
      code: `VAL_2026_${Math.floor(100 + Math.random() * 900)}`,
      title: `Validation ${validationMethod} — ${currentModel?.title || 'Modèle Personnalisé'}`,
      modelId: currentModel?.id || 'MODEL_CUSTOM',
      modelCode: currentModel?.code || 'MODEL_CUSTOM',
      modelTitle: currentModel?.title || 'Modèle de Recherche',
      datasetId: selectedDatasetId,
      datasetName: selectedDatasetId === 'ANALYSIS_DATASET_001' ? 'Dataset Analytique Paludisme Kindu (2020-2026)' : 'Dataset Analytique Fièvre Typhoïde (2020-2026)',
      pathology: selectedPathology,
      targetPathologiesList: [selectedPathology],
      territory: 'Kindu (Kasuku, Mikelenge, Alunguli)',
      periodRange: `2020–${testEndYear} (Coupure Train: ${trainCutoffYear})`,
      primaryMethod: validationMethod,
      preValidationCheck: preCheck,
      dataLeakageAudit: leakageAudit,
      timeSplitResult: timeResult,
      calibration: {
        bins: [
          { decile: 1, predictedRiskMean: 12.4, observedRiskMean: 13.1, sampleCount: 25, residualGap: 0.7 },
          { decile: 2, predictedRiskMean: 18.2, observedRiskMean: 17.8, sampleCount: 25, residualGap: -0.4 },
          { decile: 3, predictedRiskMean: 24.6, observedRiskMean: 25.4, sampleCount: 25, residualGap: 0.8 },
          { decile: 4, predictedRiskMean: 31.0, observedRiskMean: 30.2, sampleCount: 25, residualGap: -0.8 },
          { decile: 5, predictedRiskMean: 38.5, observedRiskMean: 39.1, sampleCount: 25, residualGap: 0.6 },
          { decile: 6, predictedRiskMean: 47.2, observedRiskMean: 46.5, sampleCount: 25, residualGap: -0.7 },
          { decile: 7, predictedRiskMean: 58.0, observedRiskMean: 59.8, sampleCount: 25, residualGap: 1.8 },
          { decile: 8, predictedRiskMean: 71.4, observedRiskMean: 69.9, sampleCount: 25, residualGap: -1.5 },
          { decile: 9, predictedRiskMean: 88.2, observedRiskMean: 91.5, sampleCount: 26, residualGap: 3.3 },
          { decile: 10, predictedRiskMean: 114.5, observedRiskMean: 118.2, sampleCount: 26, residualGap: 3.7 }
        ],
        calibrationSlope: 1.034,
        calibrationIntercept: -0.82,
        brierScore: 0.042,
        ece: 1.43,
        calibrationQuality: 'EXCELLENTE',
        interpretationNote: 'Pente de calibration proche de 1.0.'
      },
      residuals: {
        points: [
          { id: 'R1', zoneId: 'ZS_KASUKU', zoneName: 'Kasuku', period: '2024-03', observed: 78.4, predicted: 74.2, residual: 4.2, standardizedResidual: 0.45, cooksDistance: 0.012, tier: 'CONFORME' },
          { id: 'R2', zoneId: 'ZS_MIKELENGE', zoneName: 'Mikelenge', period: '2024-04', observed: 52.1, predicted: 56.4, residual: -4.3, standardizedResidual: -0.46, cooksDistance: 0.014, tier: 'CONFORME' },
          { id: 'R3', zoneId: 'ZS_ALUNGULI', zoneName: 'Alunguli', period: '2025-02', observed: 64.0, predicted: 75.8, residual: -11.8, standardizedResidual: -1.26, cooksDistance: 0.035, tier: 'SURESTIME' }
        ],
        distribution: { mean: 0.12, stdDev: 9.35, min: -24.8, q1: -5.4, median: 0.28, q3: 5.9, max: 28.6 },
        temporalTrend: [
          { period: '2020', avgResidual: -0.45, count: 36 },
          { period: '2021', avgResidual: 0.32, count: 36 },
          { period: '2022', avgResidual: -0.18, count: 36 },
          { period: '2023', avgResidual: 0.54, count: 36 },
          { period: '2024', avgResidual: 0.21, count: 36 },
          { period: '2025', avgResidual: 0.85, count: 36 },
          { period: '2026', avgResidual: -0.52, count: 36 }
        ],
        spatialClustersCount: 0,
        extremeResidualsCount: 2
      },
      robustness: {
        scenarios: [
          {
            scenarioCode: 'SCENARIO_A',
            title: 'Scénario A — Modèle Complet',
            description: 'Toutes les covariables admissibles',
            sampleSize: 252,
            keyCoefficients: [
              { variable: 'Précipitations (Lag 1)', beta: 0.384, ci95Lower: 0.245, ci95Upper: 0.523, pValue: 0.0001, signFlipped: false },
              { variable: 'Couverture Latrines (%)', beta: -0.295, ci95Lower: -0.442, ci95Upper: -0.148, pValue: 0.0008, signFlipped: false }
            ],
            aic: 978.2,
            bic: 997.4,
            r2: 0.742,
            stabilityStatus: 'STABLE'
          }
        ],
        signFlipAlerts: [],
        overallStabilityAssessment: 'RESULTATS_STABLES',
        scientificNote: 'Coefficients stables sans inversion de signe.'
      },
      lagsSensitivity: [
        { lagMonths: 0, betaValue: 0.142, ciLower: -0.015, ciUpper: 0.299, pValue: 0.0760, aic: 1042.5, obsCount: 252, biologicalPlausibilityNote: 'Lag 0 synchrone trop court pour l incubation.', isStatisticallyPreferred: false },
        { lagMonths: 1, betaValue: 0.384, ciLower: 0.245, ciUpper: 0.523, pValue: 0.0001, aic: 978.2, obsCount: 249, biologicalPlausibilityNote: 'Lag 1 mois optimal pour le cycle anophélien.', isStatisticallyPreferred: true }
      ],
      spatialReliabilityZones: [
        {
          zoneId: 'ZS_KASUKU',
          zoneName: 'Kasuku (Centre)',
          type: 'COMMUNE_URBAINE',
          obsCount: 84,
          dataQualityRating: 'A',
          coveragePct: 100.0,
          uncertaintyMargin: 7.2,
          localMae: 6.45,
          isProxy: false,
          reliabilityTier: 'FIABILITE_ELEVEE',
          reliabilityScore: 92,
          scoringCriteria: ['84 mois complets', 'Zéro proxy']
        },
        {
          zoneId: 'ZS_ALUNGULI',
          zoneName: 'Alunguli (Rive droite)',
          type: 'COMMUNE_FLUVIO',
          obsCount: 84,
          dataQualityRating: 'B',
          coveragePct: 94.0,
          uncertaintyMargin: 13.8,
          localMae: 9.85,
          isProxy: true,
          proxyHistoricalNote: 'Interpolation pluviométrique inter-rives.',
          reliabilityTier: 'FIABILITE_INTERMEDIAIRE',
          reliabilityScore: 68,
          scoringCriteria: ['Proxy pluviométrique', 'Incertitude élargie']
        }
      ],
      validatedMapZones: [
        {
          zoneId: 'ZS_KASUKU',
          zoneName: 'Kasuku',
          lat: -2.9515,
          lng: 25.9284,
          sanitaryRiskTier: 'TRES_ELEVE',
          estimationReliabilityTier: 'FIABILITE_ELEVEE',
          predictedIncidence: 84.5,
          confidenceInterval95: [77.3, 91.7],
          predictionInterval95: [64.2, 104.8],
          uncertaintyMargin: 7.2,
          observedIncidence: 82.0,
          estimationError: 'CONFORME',
          residualGap: -2.5,
          historicalYear: 2026,
          environmentalStateText: 'Site de décharge réhabilité fin 2024.',
          isProxyHistorical: false
        },
        {
          zoneId: 'ZS_ALUNGULI',
          zoneName: 'Alunguli',
          lat: -2.9650,
          lng: 25.9120,
          sanitaryRiskTier: 'MODERE',
          estimationReliabilityTier: 'FIABILITE_INTERMEDIAIRE',
          predictedIncidence: 48.2,
          confidenceInterval95: [36.4, 60.0],
          predictionInterval95: [22.5, 73.9],
          uncertaintyMargin: 11.8,
          observedIncidence: 42.0,
          estimationError: 'SURESTIME',
          residualGap: -6.2,
          historicalYear: 2026,
          environmentalStateText: 'Rive droite isolée avec proxy climatique.',
          isProxyHistorical: true,
          proxyHistoricalLabel: 'PROXY HISTORIQUE CLIMATIQUE'
        }
      ],
      decomposedRobustnessScore: robustnessScore,
      decomposedConfidenceScore: confidenceScore,
      reportDocument: {} as any,
      rValidationScript: '',
      pythonValidationScript: '',
      status: 'VALIDE',
      validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      validatorName: 'Dr. Épidémiologiste One Health (Session Courante)',
      isDemonstrationData: true
    };

    newProj.reportDocument = generateValidationReport20Sections(newProj);
    newProj.rValidationScript = generateRValidationScript(newProj);
    newProj.pythonValidationScript = generatePythonValidationScript(newProj);

    onValidationCreated(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Protocole de Validation Scientifique & Robustesse</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-teal-500/30 text-teal-200 border border-teal-400/40">
                  V1.16
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Évaluation de l étanchéité temporelle, spatiale, calibration et analyse de surapprentissage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          {[
            { num: 1, label: '1. Modèle & Dataset' },
            { num: 2, label: '2. Méthode de Validation' },
            { num: 3, label: '3. Contrôle & Audit Fuite' },
            { num: 4, label: '4. Synthèse & Exécution' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center space-x-2 font-medium ${
                currentStep === s.num
                  ? 'text-teal-700 font-bold'
                  : currentStep > s.num
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === s.num
                    ? 'bg-teal-600 text-white'
                    : currentStep > s.num
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Sélectionner le modèle statistique à valider
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableModels.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                        selectedModelId === m.id
                          ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {m.code}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{m.title}</span>
                        </div>
                        <p className="text-xs text-slate-500">{m.researchHypothesis}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-600 pt-1">
                          <span className="flex items-center space-x-1">
                            <Activity className="w-3.5 h-3.5 text-teal-600" />
                            <span>Famille : {m.modelType}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>Périmètre : Kindu (3 communes)</span>
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={selectedModelId === m.id}
                        onChange={() => setSelectedModelId(m.id)}
                        className="mt-1 text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Dataset Analytique Source
                  </label>
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="ANALYSIS_DATASET_001">Dataset Analytique Paludisme Kindu (2020-2026, 252 obs)</option>
                    <option value="ANALYSIS_DATASET_002">Dataset Analytique Fièvre Typhoïde (2020-2026, 168 obs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Pathologie Cible
                  </label>
                  <select
                    value={selectedPathology}
                    onChange={(e) => setSelectedPathology(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="PALUDISME">Paludisme (Plasmodium falciparum)</option>
                    <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde (Salmonella enterica)</option>
                    <option value="MULTI_PATHOLOGIE">Multi-Pathologies (Surveillance syndromique)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sélectionner le protocole méthodologique de validation
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'TIME_SPLIT',
                      title: 'Time-Split Validation (Prospective)',
                      desc: 'Division chronologique stricte. Aucune donnée future dans l entraînement.',
                      recommended: true
                    },
                    {
                      id: 'ROLLING_WALK_FORWARD',
                      title: 'Rolling / Walk-Forward Validation',
                      desc: 'Fenêtres glissantes successives (2020-22 → 23, 2020-23 → 24, etc.).',
                      recommended: false
                    },
                    {
                      id: 'SPATIAL_HOLD_OUT',
                      title: 'Spatial Hold-Out (Hors-échantillon)',
                      desc: 'Réservation d une zone géographique entière (ex: Alunguli) pour le test.',
                      recommended: false
                    },
                    {
                      id: 'K_FOLD_CROSS_VALIDATION',
                      title: 'K-Fold Cross-Validation (5 Plis)',
                      desc: 'Division aléatoire standard avec avertissement d autocorrélation spatio-temporelle.',
                      recommended: false
                    }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setValidationMethod(m.id as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        validationMethod === m.id
                          ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{m.title}</span>
                        {m.recommended && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-100 text-teal-800 rounded">
                            Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paramètres selon la méthode */}
              {validationMethod === 'TIME_SPLIT' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Configuration de la coupure temporelle</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Fin de l entraînement (Train Cutoff)</label>
                      <select
                        value={trainCutoffYear}
                        onChange={(e) => setTrainCutoffYear(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      >
                        <option value={2023}>2023 (Entraînement : 2020–2023 | 48 mois)</option>
                        <option value={2024}>2024 (Entraînement : 2020–2024 | 60 mois) [Standard]</option>
                        <option value={2025}>2025 (Entraînement : 2020–2025 | 72 mois)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Fin du test prospectif</label>
                      <select
                        value={testEndYear}
                        onChange={(e) => setTestEndYear(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                      >
                        <option value={2026}>2026 (Période test : {trainCutoffYear + 1}–2026)</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded border border-teal-200 flex items-start space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      Règle absolue vérifiée : Aucune donnée future ({trainCutoffYear + 1}–{testEndYear}) ne sera injectée dans le calcul des moyennes, écarts-types ou coefficients du jeu d entraînement.
                    </span>
                  </p>
                </div>
              )}

              {validationMethod === 'SPATIAL_HOLD_OUT' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>Zone réservée pour le test hors-échantillon</span>
                  </h4>
                  <select
                    value={holdOutZone}
                    onChange={(e) => setHoldOutZone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  >
                    <option value="ZS_ALUNGULI">Alunguli (Commune insulaire / rive droite - 84 obs de test)</option>
                    <option value="ZS_MIKELENGE">Mikelenge (Commune maraîchère périurbaine - 84 obs de test)</option>
                  </select>
                </div>
              )}

              {/* Options de simulation d anomalies (pour banc de test) */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  Banc d épreuve / Simulation d anomalies (Mode Démonstration)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={injectDataLeakage}
                      onChange={(e) => setInjectDataLeakage(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-amber-900">Simuler une Fuite de Données (Data Leakage)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={injectOverfitting}
                      onChange={(e) => setInjectOverfitting(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-amber-900">Simuler un Surapprentissage Sévère (Overfitting)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Contrôle préalable */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Contrôle Préalable du Dataset & Structure</span>
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      preCheck.status === 'POSSIBLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : preCheck.status === 'LIMITEE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Validation {preCheck.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-500">Observations</span>
                    <span className="font-bold text-slate-800">{preCheck.totalObservations}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-500">Zones couvertes</span>
                    <span className="font-bold text-slate-800">{preCheck.totalHealthZones}</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-500">Données manquantes</span>
                    <span className="font-bold text-emerald-700">{preCheck.missingValuesPct.toFixed(1)}%</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="block text-[10px] text-slate-500">Proxies documentés</span>
                    <span className="font-bold text-amber-700">{preCheck.proxiesCount}</span>
                  </div>
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                  {preCheck.justifications.map((j, i) => (
                    <li key={i}>{j}</li>
                  ))}
                </ul>
              </div>

              {/* Audit de fuite de données */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  leakageAudit.overallStatus === 'CLEAR'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : leakageAudit.overallStatus === 'WARNING'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        leakageAudit.overallStatus === 'CLEAR'
                          ? 'text-emerald-600'
                          : leakageAudit.overallStatus === 'WARNING'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    />
                    <h4 className="text-xs font-bold text-slate-900">
                      Audit Automatique de Fuite d Information (Data Leakage)
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      leakageAudit.overallStatus === 'CLEAR'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leakageAudit.overallStatus === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {leakageAudit.overallStatus === 'CLEAR'
                      ? 'CONFORME'
                      : leakageAudit.overallStatus === 'WARNING'
                      ? 'AVERTISSEMENT'
                      : 'VALIDATION BLOQUÉE'}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{leakageAudit.auditSummary}</p>
                <div className="space-y-1.5">
                  {leakageAudit.items.map((it) => (
                    <div
                      key={it.id}
                      className="bg-white p-2.5 rounded border border-slate-200 flex items-start justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{it.title} : </span>
                        <span className="text-slate-600">{it.details}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ml-2 ${
                          it.severity === 'CONFORME'
                            ? 'bg-emerald-50 text-emerald-700'
                            : it.severity === 'AVERTISSEMENT'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {it.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Récapitulatif du Protocole de Validation V1.16
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Modèle cible</span>
                    <span className="font-bold">{currentModel?.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Méthode principale</span>
                    <span className="font-bold text-teal-300">{validationMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Échantillon Train</span>
                    <span>2020–{trainCutoffYear} (180 observations)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Échantillon Test</span>
                    <span>{trainCutoffYear + 1}–{testEndYear} (72 observations)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-2 text-teal-900">
                <p className="font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Génération automatique des 10 modules de validation scientifique</span>
                </p>
                <p className="text-[11px] leading-relaxed text-teal-800">
                  L exécution produira : l audit de surapprentissage (Train vs Test), la courbe de calibration, l analyse des résidus spatio-temporels, la matrice de robustesse multi-scénarios, les scores décomposés (Robustesse & Confiance), les scripts reproductibles R/Python et le rapport scientifique de 20 sections.
                </p>
              </div>

              {leakageAudit.isValidationBlocked && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Validation bloquée par l audit d intégrité</span>
                    <span>Une fuite de données critique empêche la validation scientifique de ce modèle.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-40 flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Annuler
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm flex items-center space-x-1.5 transition"
              >
                <span>Suivant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleLaunchValidation}
                disabled={leakageAudit.isValidationBlocked}
                className="px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 rounded-lg shadow-md flex items-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Exécuter la Validation Scientifique</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
