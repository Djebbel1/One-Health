import React, { useState } from 'react';
import {
  ScientificAnalysisProject,
  ScientificModelingProject,
  StatisticalModelType,
  DependentVariableType,
  OffsetOption,
  ModelCovariateSelection,
  ModelInteractionTerm,
  SpatioTemporalEffectsConfig,
  PreModelingCheckResult
} from '../../types';
import {
  MOCK_MODELING_COVARIATES_V115
} from '../../data/mockModelingDataV115';
import {
  performPreModelingCheck,
  fitScientificModelEngine,
  computeCorrelationMatrixAndVIF
} from '../../utils/statisticalModelingEngineV115';
import { MOCK_SYNTHETIC_DATASET_RECORDS_V114 as MOCK_DATASET_RECORDS_V114 } from '../../data/mockScientificAnalysisDataV114';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Layers,
  Activity,
  Calculator,
  ShieldCheck,
  Info
} from 'lucide-react';

interface NewModelingWizardProps {
  existingAnalyses: ScientificAnalysisProject[];
  onModelCreated: (model: ScientificModelingProject) => void;
  onCancel: () => void;
}

export const NewModelingWizard: React.FC<NewModelingWizardProps> = ({
  existingAnalyses,
  onModelCreated,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Titre & Hypothèse
  const [title, setTitle] = useState<string>('Modèle Épidémiologique Paludisme & Précipitations (Kindu 2020–2026)');
  const [hypothesis, setHypothesis] = useState<string>(
    'L élévation des précipitations cumulées avec un décalage d un mois augmente significativement l incidence du paludisme dans les zones urbaines et péri-urbaines de Kindu.'
  );

  // Step 2: Pathologie
  const [pathology, setPathology] = useState<'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE' | 'AUTRE'>('PALUDISME');

  // Step 3: Dataset source V1.14
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    existingAnalyses.length > 0 ? existingAnalyses[0].id : 'ANALYSIS-001'
  );

  // Step 4: Période & Territoire
  const [startYear, setStartYear] = useState<number>(2020);
  const [endYear, setEndYear] = useState<number>(2026);
  const [selectedZones, setSelectedZones] = useState<string[]>(['ZS-KINDU', 'ZS-ALUNGULI']);

  // Step 5: Variable dépendante
  const [dependentVar, setDependentVar] = useState<DependentVariableType>('COUNT_CASES');
  const [dependentVarName, setDependentVarName] = useState<string>('Cas confirmés de paludisme');
  const [dependentVarColumn, setDependentVarColumn] = useState<string>('cas_paludisme_confirmes');

  // Step 6: Variables explicatives One Health
  const [covariates, setCovariates] = useState<ModelCovariateSelection[]>(
    MOCK_MODELING_COVARIATES_V115.map(c => ({ ...c }))
  );

  // Step 7: Modèle & Offset
  const [modelType, setModelType] = useState<StatisticalModelType>('NEGATIVE_BINOMIAL');
  const [offsetOption, setOffsetOption] = useState<OffsetOption>('POPULATION');

  // Step 8: Effets Spatio-Temporels, Lags & Interactions
  const [spatioTemporalConfig, setSpatioTemporalConfig] = useState<SpatioTemporalEffectsConfig>({
    spatialUnit: 'Zone de Santé × Mois',
    spatialEffect: 'ZONE_FIXED',
    temporalEffect: 'SEASONAL_HARMONIC',
    includeSeasonalHarmonic: true,
    includeLinearTrend: true
  });
  const [interactions, setInteractions] = useState<ModelInteractionTerm[]>([]);

  // Step 9: Méthode d'évaluation
  const [evaluationMethod, setEvaluationMethod] = useState<'INTERNAL_RESIDUALS' | 'TRAIN_TEST_SPLIT' | 'TEMPORAL_BLOCK_SPLIT' | 'SPATIAL_LEAVE_ONE_OUT'>('TRAIN_TEST_SPLIT');

  // Step 10: Contrôle avant modélisation (Pre-flight check)
  const [preCheck, setPreCheck] = useState<PreModelingCheckResult | null>(null);

  const currentAnalysis = existingAnalyses.find(a => a.id === selectedDatasetId) || existingAnalyses[0];

  const handleToggleCovariate = (code: string) => {
    setCovariates(prev =>
      prev.map(c => (c.code === code ? { ...c, isExcludedFromFit: !c.isExcludedFromFit } : c))
    );
  };

  const handleSetLag = (code: string, lag: number) => {
    setCovariates(prev =>
      prev.map(c => (c.code === code ? { ...c, lagMonths: lag, isLagged: lag > 0 } : c))
    );
  };

  const handleRunPreCheck = () => {
    const activeCovs = covariates.filter(c => !c.isExcludedFromFit);
    const result = performPreModelingCheck(
      MOCK_DATASET_RECORDS_V114,
      dependentVar,
      activeCovs,
      modelType,
      offsetOption
    );
    setPreCheck(result);
  };

  const handleCreateAndFitModel = () => {
    const activeCovs = covariates.filter(c => !c.isExcludedFromFit);
    const fit = fitScientificModelEngine(MOCK_DATASET_RECORDS_V114, {
      modelType,
      dependentVar,
      offset: offsetOption,
      covariates: activeCovs,
      interactions,
      spatioTemporalConfig
    });

    const corrResult = computeCorrelationMatrixAndVIF(MOCK_DATASET_RECORDS_V114, activeCovs);

    const newModel: ScientificModelingProject = {
      id: `MODEL-${Date.now().toString().slice(-4)}`,
      code: `MODEL_${pathology}_${startYear}_${endYear}_${Math.floor(Math.random() * 900 + 100)}`,
      title,
      researchHypothesis: hypothesis,
      sourceDatasetId: currentAnalysis?.id || 'ANALYSIS-001',
      sourceDatasetCode: currentAnalysis?.code || 'ANALYSIS_DATASET_2026_001',
      sourceDatasetName: currentAnalysis?.name || 'Dataset Analytique Validé',
      pathology,
      targetPathologiesList: [pathology],
      timeRange: {
        startYear,
        endYear,
        temporalResolution: 'MOIS'
      },
      geographicScope: {
        level: currentAnalysis?.geographicScope?.level || 'VILLE_KINDU',
        selectedZones,
        selectedZoneNames: selectedZones.map(z => (z === 'ZS-KINDU' ? 'Kindu' : z === 'ZS-ALUNGULI' ? 'Alunguli' : 'Kasongo'))
      },
      dependentVariable: dependentVar,
      dependentVariableName: dependentVarName,
      dependentVariableColumn: dependentVarColumn,
      modelType,
      offsetOption,
      offsetColumnName: offsetOption === 'POPULATION' ? 'population_at_risk' : undefined,
      selectedCovariates: activeCovs,
      interactionTerms: interactions,
      spatioTemporalConfig,
      evaluationMethod,
      preFlightCheck: preCheck || performPreModelingCheck(MOCK_DATASET_RECORDS_V114, dependentVar, activeCovs, modelType, offsetOption),
      coefficients: fit.coefficients,
      diagnostics: fit.diagnostics,
      predictions: fit.predictions,
      correlationMatrix: {
        variables: corrResult.variables,
        matrix: corrResult.matrix
      },
      mathematicalFormula: fit.formula,
      scientificCaveat:
        'Association statistique ≠ Causalité. Les résultats quantifient la corrélation ajustée sans extrapoler de lien causal direct.',
      scientistAdequationNotes:
        'Modèle ajusté avec rigueur sur données harmonisées. Décalages temporels (Lags) biologiquement cohérents intégrés.',
      isDemonstrationData: true,
      rCodeEquivalent: `# Modèle R\nfit <- glm(${dependentVarColumn} ~ ..., data = dataset)`,
      pythonCodeEquivalent: `# Modèle Python\nfit = smf.glm("${dependentVarColumn} ~ ...", data = df).fit()`,
      status: 'ESTIME',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: 'Chercheur Principal One Health'
    };

    onModelCreated(newModel);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header Wizard */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-black">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                Assistant de Création de Modèle Scientifique (V1.15)
              </h2>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/40 font-semibold">
                Étape {step} / 10
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Passerelle directe : Dataset Analytique V1.14 ➔ Spécification ➔ Contrôle préalable ➔ Estimation GLM / Spatio-Temporelle
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
        >
          Annuler
        </button>
      </div>

      {/* Stepper Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max text-xs">
          {[
            { s: 1, label: '1. Hypothèse' },
            { s: 2, label: '2. Pathologie' },
            { s: 3, label: '3. Dataset Source' },
            { s: 4, label: '4. Territoire' },
            { s: 5, label: '5. Var. Dépendante' },
            { s: 6, label: '6. Covariables' },
            { s: 7, label: '7. Modèle & Offset' },
            { s: 8, label: '8. Spatio-Temporel' },
            { s: 9, label: '9. Évaluation' },
            { s: 10, label: '10. Contrôle & Lancement' }
          ].map(it => (
            <button
              key={it.s}
              onClick={() => {
                if (it.s === 10) handleRunPreCheck();
                setStep(it.s);
              }}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                step === it.s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : step > it.s
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-6 space-y-6">
        {/* Step 1: Titre & Hypothèse */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 1 : Titre du projet & Hypothèse scientifique</h3>
              <p className="text-xs text-slate-500">
                Définissez la question de recherche épidémiologique et les mécanismes biologiques pressentis.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de la Modélisation</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hypothèse Scientifique Formelle</label>
              <textarea
                rows={4}
                value={hypothesis}
                onChange={e => setHypothesis(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Exemple : Évaluer l effet retardé (Lag 1 mois) des précipitations torrentielles couplées aux décharges sauvages sur la recrudescence du paludisme.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Pathologie */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 2 : Choix de la Pathologie Cible</h3>
              <p className="text-xs text-slate-500">
                Sélectionnez la maladie sous surveillance One Health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'PALUDISME', title: '🦟 Paludisme', desc: 'Transmission vectorielle (Anopheles gambiae), dépendance forte aux précipitations et températures.' },
                { id: 'FIEVRE_TYPHOIDE', title: '💧 Fièvre Typhoïde', desc: 'Transmission hydrique oro-fécale, dépendance aux inondations et à la salubrité de l eau.' },
                { id: 'MULTI_PATHOLOGIE', title: '🧬 Multi-Pathologies', desc: 'Modélisation comparative avec séparation stricte des séries cliniques.' }
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => setPathology(p.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    pathology === p.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Dataset source V1.14 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 3 : Sélection du Dataset Analytique Validé (V1.14)</h3>
              <p className="text-xs text-slate-500">
                Conformément à la règle absolue, V1.15 s appuie directement sur les vues contrôlées V1.14 sans altération du RAW/CLEANED.
              </p>
            </div>

            <div className="space-y-3">
              {existingAnalyses.map(ana => (
                <div
                  key={ana.id}
                  onClick={() => setSelectedDatasetId(ana.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition ${
                    selectedDatasetId === ana.id
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                        {ana.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{ana.name}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Période : {ana.timeRange.startYear}–{ana.timeRange.endYear} • {ana.datasetMetadata.totalRows} observations • {ana.geographicScope.selectedZoneNames.join(', ')}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Dataset Validé
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Territoire & Période */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 4 : Découpage Géographique & Période d Analyse</h3>
              <p className="text-xs text-slate-500">
                Cadrez la résolution spatio-temporelle de l étude.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Fenêtre Temporelle</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Année Début</label>
                    <input
                      type="number"
                      value={startYear}
                      onChange={e => setStartYear(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Année Fin</label>
                    <input
                      type="number"
                      value={endYear}
                      onChange={e => setEndYear(Number(e.target.value))}
                      className="w-full text-xs p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Zones de Santé Incluses</h4>
                <div className="space-y-2">
                  {[
                    { id: 'ZS-KINDU', name: 'Kindu (Centre Urbain)' },
                    { id: 'ZS-ALUNGULI', name: 'Alunguli (Rive Droite)' },
                    { id: 'ZS-KASONGO', name: 'Kasongo (Sud Maniema)' }
                  ].map(z => (
                    <label key={z.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedZones.includes(z.id)}
                        onChange={() => {
                          setSelectedZones(prev =>
                            prev.includes(z.id) ? prev.filter(x => x !== z.id) : [...prev, z.id]
                          );
                        }}
                        className="rounded text-indigo-600"
                      />
                      <span>{z.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Variable dépendante */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 5 : Variable Dépendante (Réponse $Y$)</h3>
              <p className="text-xs text-slate-500">
                Le type de variable dépendante détermine strictement les familles de modèles statistiques admissibles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'COUNT_CASES',
                  title: '🔢 Nombre de Cas (Comptage)',
                  col: 'cas_paludisme_confirmes',
                  desc: 'Données entières positives {0, 1, 2, ...}. Compatible avec Poisson, Binomiale Négative et Quasi-Poisson.'
                },
                {
                  id: 'INCIDENCE_RATE',
                  title: '📊 Taux d Incidence (/100k hab)',
                  col: 'incidence_100k',
                  desc: 'Taux continu standardisé par la population à risque.'
                },
                {
                  id: 'BINARY_PRESENCE',
                  title: '🎯 Présence / Absence (0/1)',
                  col: 'presence_epidemie',
                  desc: 'Variable dichotomique strictement binaire. Réservée à la régression logistique.'
                }
              ].map(v => (
                <div
                  key={v.id}
                  onClick={() => {
                    setDependentVar(v.id as any);
                    setDependentVarName(v.title);
                    setDependentVarColumn(v.col);
                    if (v.id === 'BINARY_PRESENCE') setModelType('LOGISTIC');
                    else if (modelType === 'LOGISTIC') setModelType('POISSON');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    dependentVar === v.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Covariables & Lags */}
        {step === 6 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 6 : Variables Explicatives One Health & Décalages Temporels (Lags)</h3>
              <p className="text-xs text-slate-500">
                Sélectionnez les facteurs climatiques, environnementaux et WASH. Configurez les lags biologiques (0 à 3 mois).
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Inclure</th>
                    <th className="p-3">Variable & Dimension</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Source & Statut</th>
                    <th className="p-3">Couverture</th>
                    <th className="p-3">Lag Temporel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {covariates.map(cov => (
                    <tr key={cov.code} className={cov.isExcludedFromFit ? 'bg-slate-50/60 opacity-60' : 'bg-white'}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={!cov.isExcludedFromFit}
                          onChange={() => handleToggleCovariate(cov.code)}
                          className="rounded text-indigo-600"
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-800">
                        <div>{cov.name}</div>
                        <span className="text-[10px] text-slate-400">{cov.dimension}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{cov.type}</td>
                      <td className="p-3 text-slate-600">
                        <div>{cov.source}</div>
                        <span className={`text-[10px] font-bold ${cov.isProxy ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {cov.isProxy ? '⚠️ Proxy' : '✅ Observé réel'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          {cov.temporalCoveragePct}%
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          disabled={cov.isExcludedFromFit}
                          value={cov.lagMonths}
                          onChange={e => handleSetLag(cov.code, Number(e.target.value))}
                          className="text-xs p-1.5 border border-slate-300 rounded bg-white"
                        >
                          <option value={0}>Lag 0 (Même mois)</option>
                          <option value={1}>Lag 1 (+1 mois)</option>
                          <option value={2}>Lag 2 (+2 mois)</option>
                          <option value={3}>Lag 3 (+3 mois)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 7: Modèle & Offset */}
        {step === 7 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 7 : Choix du Modèle Statistique & Spécification de l Offset</h3>
              <p className="text-xs text-slate-500">
                Sélectionnez le formalisme d estimation et le terme d exposition au risque.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'POISSON',
                  title: '📈 Régression de Poisson',
                  desc: 'Données de comptage avec hypothèse d équidispersion (Var(Y) = E(Y)). Offset de population recommandé.'
                },
                {
                  id: 'NEGATIVE_BINOMIAL',
                  title: '📊 Régression Binomiale Négative',
                  desc: 'Recommandée en cas de surdispersion empirique (Var(Y) > E(Y)) fréquente en épidémiologie.'
                },
                {
                  id: 'LOGISTIC',
                  title: '🎯 Régression Logistique (Logit)',
                  desc: 'Modélisation de la probabilité d apparition p ∈ [0, 1] pour issue strictement binaire.'
                }
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setModelType(m.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    modelType === m.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-2">Spécification de l Offset (Terme d Exposition)</h4>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="offset"
                    checked={offsetOption === 'POPULATION'}
                    onChange={() => setOffsetOption('POPULATION')}
                    className="text-indigo-600"
                  />
                  <span>Offset = log(Population à risque) [Recommandé]</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="offset"
                    checked={offsetOption === 'NONE'}
                    onChange={() => setOffsetOption('NONE')}
                    className="text-indigo-600"
                  />
                  <span>Aucun offset (Comptage brut)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Spatio-Temporel & Interactions */}
        {step === 8 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 8 : Structure Spatio-Temporelle & Interactions</h3>
              <p className="text-xs text-slate-500">
                Intégrez les effets fixes/aléatoires de zone, les harmoniques saisonniers et les termes d interaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Effets Spatiaux</h4>
                <select
                  value={spatioTemporalConfig.spatialEffect}
                  onChange={e => setSpatioTemporalConfig({ ...spatioTemporalConfig, spatialEffect: e.target.value as any })}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="NONE">Aucun effet spatial explicite</option>
                  <option value="ZONE_FIXED">Effets fixes de Zone de Santé (Dummy variables)</option>
                  <option value="ZONE_RANDOM">Effets aléatoires de Zone (Modèle Mixte GLMM)</option>
                </select>

                <h4 className="text-xs font-bold text-slate-800 pt-2">Effets Temporels</h4>
                <select
                  value={spatioTemporalConfig.temporalEffect}
                  onChange={e => setSpatioTemporalConfig({ ...spatioTemporalConfig, temporalEffect: e.target.value as any })}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white"
                >
                  <option value="SEASONAL_HARMONIC">Harmonique Saisonnier sin(2π t / 12) [Recommandé]</option>
                  <option value="MONTH_FIXED">Effets fixes du Mois calendaire (1 à 12)</option>
                  <option value="LINEAR_TREND">Tendance temporelle linéaire (t)</option>
                  <option value="NONE">Aucun effet temporel</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Interactions entre Variables</h4>
                <p className="text-[11px] text-slate-500">
                  Permet d évaluer les synergies (ex. : Pluie excessive × Décharge non assainie).
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setInteractions([
                      {
                        id: 'INT-01',
                        var1Code: 'precipitations_mensuelles_mm',
                        var1Name: 'Précipitations',
                        var2Code: 'presence_decharge_sauvage',
                        var2Name: 'Décharge Kasuku',
                        label: 'Précipitations × Décharge Kasuku'
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold hover:bg-indigo-100"
                >
                  + Ajouter Interaction Pluie × Décharge
                </button>

                {interactions.length > 0 && (
                  <div className="space-y-1">
                    {interactions.map(it => (
                      <div key={it.id} className="text-xs bg-white p-2 border border-slate-200 rounded flex items-center justify-between">
                        <span>{it.label}</span>
                        <button
                          onClick={() => setInteractions([])}
                          className="text-rose-600 font-bold text-xs hover:underline"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Évaluation */}
        {step === 9 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 9 : Protocole d Évaluation et de Validation</h3>
              <p className="text-xs text-slate-500">
                Sélectionnez la stratégie de validation statistique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'TRAIN_TEST_SPLIT', title: '🔀 Split Train/Test (80/20)', desc: 'Entraînement sur 80% des observations et test de prédiction sur les 20% restants.' },
                { id: 'TEMPORAL_BLOCK_SPLIT', title: '⏱️ Validation Temporelle par Blocs', desc: 'Entraînement sur 2020–2024 et prédiction aveugle sur 2025–2026.' },
                { id: 'INTERNAL_RESIDUALS', title: '📐 Analyse des Résidus Interne', desc: 'Ajustement complet et calcul des critères d information AIC/BIC sur tout l échantillon.' }
              ].map(ev => (
                <div
                  key={ev.id}
                  onClick={() => setEvaluationMethod(ev.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    evaluationMethod === ev.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ev.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 10: Contrôle Préalable & Lancement */}
        {step === 10 && (
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-3">
              <h3 className="text-sm font-bold text-slate-900">Étape 10 : Diagnostic Pré-Modélisation & Lancement</h3>
              <p className="text-xs text-slate-500">
                Vérification automatique de l intégrité, des valeurs manquantes, de la colinéarité et de la suffisance d échantillon.
              </p>
            </div>

            {!preCheck ? (
              <div className="p-6 bg-slate-50 text-center rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs text-slate-600">
                  Cliquez ci-dessous pour exécuter le diagnostic de faisabilité préalable avant l ajustement.
                </p>
                <button
                  onClick={handleRunPreCheck}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-700 transition"
                >
                  Exécuter le Contrôle Préalable
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    preCheck.isBlocked
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : preCheck.statusSignal === 'ORANGE'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  {preCheck.isBlocked ? (
                    <XCircle className="w-5 h-5 text-rose-600 mt-0.5" />
                  ) : preCheck.statusSignal === 'ORANGE' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold">
                      {preCheck.isBlocked
                        ? 'Modélisation bloquée : Problèmes méthodologiques critiques'
                        : preCheck.statusSignal === 'ORANGE'
                        ? 'Modélisation possible avec précautions'
                        : 'Modélisation autorisée : Dataset conforme'}
                    </h4>
                    <p className="text-[11px] opacity-90">
                      Observations valides : {preCheck.sampleSizeValid} / {preCheck.sampleSizeTotal} ({preCheck.missingDataPct}% manquants) • Zones : {preCheck.spatialZonesCount} • Années : {preCheck.temporalSpanYears}
                    </p>
                  </div>
                </div>

                {preCheck.blockingReasons.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-xs text-rose-800">
                    <span className="font-bold">Motifs de blocage :</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {preCheck.blockingReasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {preCheck.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1 text-xs text-amber-800">
                    <span className="font-bold">Avertissements & Précautions méthodologiques :</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {preCheck.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 text-xs font-mono">
                  <div className="text-amber-400 font-bold">Rappel épistémologique formel :</div>
                  <div>Association statistique ≠ Causalité. Le modèle quantifie les associations empiriques ajustées.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          disabled={step === 1}
          onClick={() => setStep(s => s - 1)}
          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Précédent
        </button>

        <div className="flex items-center gap-3">
          {step < 10 ? (
            <button
              onClick={() => {
                if (step === 9) handleRunPreCheck();
                setStep(s => s + 1);
              }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow transition"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={preCheck?.isBlocked}
              onClick={handleCreateAndFitModel}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 flex items-center gap-2 shadow-lg transition"
            >
              <Sparkles className="w-4 h-4" />
              Lancer l Estimation du Modèle
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
