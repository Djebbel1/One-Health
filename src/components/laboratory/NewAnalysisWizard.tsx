import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Calendar,
  MapPin,
  Layers,
  Activity,
  Info,
  ShieldCheck
} from 'lucide-react';
import {
  AnalysisVariableSelection,
  GeographicLevel,
  ScientificAnalysisProject
} from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';
import { ZONES_SANTE_MANIEMA } from '../../data/maniemaData';

interface Props {
  onAnalysisCreated: (analysis: ScientificAnalysisProject) => void;
  onCancel: () => void;
}

export const NewAnalysisWizard: React.FC<Props> = ({ onAnalysisCreated, onCancel }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const availableVars = engine.getAvailableVariables();

  // Wizard state (7 steps)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Name & Description
  const [name, setName] = useState<string>('Paludisme à Kindu — Dynamique 2020–2026');
  const [description, setDescription] = useState<string>(
    'Étude des corrélations spatiotemporelles entre précipitations et incidence du paludisme en milieu urbain.'
  );

  // Step 2: Pathology
  const [targetPathologies, setTargetPathologies] = useState<('PALUDISME' | 'FIEVRE_TYPHOIDE' | 'AUTRE')[]>(['PALUDISME']);

  // Step 3: Period
  const [startYear, setStartYear] = useState<number>(2020);
  const [endYear, setEndYear] = useState<number>(2026);
  const [temporalResolution, setTemporalResolution] = useState<'JOUR' | 'SEMAINE' | 'MOIS' | 'TRIMESTRE' | 'ANNEE'>('MOIS');

  // Step 4: Geographic scope
  const [geoLevel, setGeoLevel] = useState<GeographicLevel>('VILLE_KINDU');
  const [selectedZones, setSelectedZones] = useState<string[]>(['ZS-KINDU', 'ZS-ALUNGULI']);

  // Step 5: Variables selection
  const [selectedVars, setSelectedVars] = useState<AnalysisVariableSelection[]>(
    availableVars.filter(v => ['cas_paludisme_confirmes', 'precipitations_mensuelles_mm', 'temperature_moyenne_c', 'humidite_relative_pct'].includes(v.code))
  );

  // Step 6: Sources
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'DPS Maniema / DHIS2 - Registres FOSA',
    'METTELSAT Station Synoptique Kindu / CHIRPS',
    'Inspections Municipales de Salubrité (2022-2026)'
  ]);

  // Step 7: Method & Feasibility
  const [method, setMethod] = useState<'EXPLORATOIRE_ET_LAGS' | 'CORRELATIONS_SIMPLES' | 'COMPARAISON_ZONES' | 'ONE_HEALTH_COMPLETE'>('EXPLORATOIRE_ET_LAGS');

  // Evaluate feasibility dynamically
  const feasibility = engine.evaluateFeasibility({
    pathologies: targetPathologies,
    startYear,
    endYear,
    selectedZones,
    selectedVariables: selectedVars
  });

  const toggleVariable = (v: AnalysisVariableSelection) => {
    if (selectedVars.some(sv => sv.code === v.code)) {
      setSelectedVars(selectedVars.filter(sv => sv.code !== v.code));
    } else {
      setSelectedVars([...selectedVars, v]);
    }
  };

  const handleFinish = () => {
    const selectedZoneNames = selectedZones.map(id => {
      const found = ZONES_SANTE_MANIEMA.find(z => z.id === id);
      return found ? found.nom : id;
    });

    const newAnalysis = engine.createAnalysisProject({
      name,
      description,
      targetPathologies,
      timeRange: {
        startYear,
        endYear,
        temporalResolution
      },
      geographicScope: {
        level: geoLevel,
        selectedZones,
        selectedZoneNames
      },
      selectedSources,
      selectedVariables: selectedVars,
      feasibilityReport: feasibility,
      author: 'Chercheur Principal One Health'
    });

    onAnalysisCreated(newAnalysis);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Wizard */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Laboratoire d Analyse Scientifique V1.14
            </div>
            <h2 className="text-xl font-bold text-white">Créer une Nouvelle Analyse & Dataset Analytique</h2>
            <p className="text-slate-400 text-xs mt-1">
              Assistant guidé en 7 étapes : de la sélection des variables au contrôle automatique de faisabilité.
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-black">
              Étape {currentStep} / 7
            </span>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-7 gap-2 mt-6">
          {[
            '1. Nom',
            '2. Pathologie',
            '3. Période',
            '4. Territoire',
            '5. Variables',
            '6. Sources',
            '7. Faisabilité'
          ].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div
                key={label}
                onClick={() => setCurrentStep(stepNum)}
                className={`text-center cursor-pointer transition py-1.5 px-1 rounded ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : isDone
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'bg-slate-800/40 text-slate-500'
                }`}
              >
                <div className="text-[10px] truncate">{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Content Body */}
      <div className="p-6">
        {/* Étape 1 : Nom de l'analyse */}
        {currentStep === 1 && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nom de l Analyse Scientifique <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Ex: Paludisme à Kindu — 2020–2026"
              />
              <p className="text-slate-500 text-xs mt-1.5">
                Donnez un titre descriptif et précis incluant la pathologie, la zone et la période d étude.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description & Hypothèse de Recherche
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Décrivez l objectif général de cette analyse scientifique..."
              />
            </div>
          </div>
        )}

        {/* Étape 2 : Pathologie */}
        {currentStep === 2 && (
          <div className="space-y-4 max-w-2xl">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sélection de la ou des Pathologies <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  if (targetPathologies.includes('PALUDISME')) {
                    if (targetPathologies.length > 1) {
                      setTargetPathologies(targetPathologies.filter(p => p !== 'PALUDISME'));
                    }
                  } else {
                    setTargetPathologies([...targetPathologies, 'PALUDISME']);
                  }
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                  targetPathologies.includes('PALUDISME')
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Paludisme (Plasmodium falciparum)</span>
                  {targetPathologies.includes('PALUDISME') && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Transmission vectorielle (Anopheles gambiae s.l.). Données SNIS FOSA 2018–2026.
                </p>
              </div>

              <div
                onClick={() => {
                  if (targetPathologies.includes('FIEVRE_TYPHOIDE')) {
                    if (targetPathologies.length > 1) {
                      setTargetPathologies(targetPathologies.filter(p => p !== 'FIEVRE_TYPHOIDE'));
                    }
                  } else {
                    setTargetPathologies([...targetPathologies, 'FIEVRE_TYPHOIDE']);
                  }
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                  targetPathologies.includes('FIEVRE_TYPHOIDE')
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Fièvre Typhoïde (Salmonella Typhi)</span>
                  {targetPathologies.includes('FIEVRE_TYPHOIDE') && <CheckCircle className="w-5 h-5 text-amber-600" />}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Transmission hydrique & péril fécal. Standardisation hémoculture post-2022.
                </p>
              </div>
            </div>

            {targetPathologies.length > 1 && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2 text-indigo-900 text-xs font-semibold">
                <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>
                  Option Multi-Pathologies active : Les indicateurs et cas seront calculés et visualisés de manière strictement séparée sans fusion de dénominateurs.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Étape 3 : Période dynamique */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Période d Étude Dynamique (Années)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Année Début</span>
                  <select
                    value={startYear}
                    onChange={e => setStartYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  >
                    {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block mb-1">Année Fin</span>
                  <select
                    value={endYear}
                    onChange={e => setEndYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold"
                  >
                    {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].filter(y => y >= startYear).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Résolution Temporelle d Agrégation
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['JOUR', 'SEMAINE', 'MOIS', 'TRIMESTRE', 'ANNEE'] as const).map(res => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setTemporalResolution(res)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                      temporalResolution === res
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Recommandé pour l étude des lags climatiques : <strong>MOIS</strong> ou <strong>SEMAINE</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Étape 4 : Sélection géographique */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Niveau Géographique
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['MANIEMA_ENTIER', 'VILLE_KINDU', 'ZONE_SANTE', 'AIRE_SANTE'] as GeographicLevel[]).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setGeoLevel(lvl)}
                    className={`p-2.5 rounded-lg text-xs font-bold border transition text-left ${
                      geoLevel === lvl
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Zones de Santé Incluses ({selectedZones.length} sélectionnée(s))
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                {ZONES_SANTE_MANIEMA.map(z => {
                  const isSel = selectedZones.includes(z.id);
                  return (
                    <div
                      key={z.id}
                      onClick={() => {
                        if (isSel) {
                          if (selectedZones.length > 1) {
                            setSelectedZones(selectedZones.filter(id => id !== z.id));
                          }
                        } else {
                          setSelectedZones([...selectedZones, z.id]);
                        }
                      }}
                      className={`p-2 rounded-lg text-xs font-semibold cursor-pointer border transition text-center truncate ${
                        isSel
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {z.nom}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Étape 5 : Sélection des variables */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Variables Disponibles par Dimension One Health ({selectedVars.length} retenue(s))
              </label>
              <button
                type="button"
                onClick={() => setSelectedVars([...availableVars])}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Tout sélectionner
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {availableVars.map(v => {
                const isSelected = selectedVars.some(sv => sv.code === v.code);
                return (
                  <div
                    key={v.code}
                    onClick={() => toggleVariable(v)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{v.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-200 text-slate-700">
                          {v.dimension}
                        </span>
                        {v.isProxy && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 border border-purple-300">
                            PROXY
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-4">
                        <span>Source: {v.sourceName}</span>
                        <span>Couverture temporelle: {v.temporalCoveragePct}%</span>
                        <span>Manquants: {v.missingDataPct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Étape 6 : Sélection des sources */}
        {currentStep === 6 && (
          <div className="space-y-4 max-w-2xl">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sources de Données Auditées
            </label>
            {[
              'DPS Maniema / DHIS2 - Registres FOSA',
              'METTELSAT Station Synoptique Kindu / CHIRPS',
              'Inspections Municipales de Salubrité (2022-2026)',
              'Enquêtes ménages géoréférencées V1.11',
              'Protection Civile & Inondations',
              'Copernicus Sentinel-2 (NDVI)'
            ].map(src => {
              const isSel = selectedSources.includes(src);
              return (
                <div
                  key={src}
                  onClick={() => {
                    if (isSel) {
                      if (selectedSources.length > 1) {
                        setSelectedSources(selectedSources.filter(s => s !== src));
                      }
                    } else {
                      setSelectedSources([...selectedSources, src]);
                    }
                  }}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                    isSel
                      ? 'border-emerald-500 bg-emerald-50/40'
                      : 'border-slate-200 hover:border-slate-300 opacity-60'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{src}</span>
                  {isSel ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Étape 7 : Faisabilité & Validation */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border bg-slate-900 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                    Rapport Automatique de Faisabilité
                  </span>
                  <h3 className="text-lg font-bold text-white">Bilan Préalable à la Création du Dataset</h3>
                </div>
                <div
                  className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${
                    feasibility.statusSignal === 'VERT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : feasibility.statusSignal === 'ORANGE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  {feasibility.statusSignal === 'VERT' && <CheckCircle className="w-4 h-4" />}
                  {feasibility.statusSignal === 'ORANGE' && <AlertTriangle className="w-4 h-4" />}
                  {feasibility.statusSignal === 'ROUGE' && <XCircle className="w-4 h-4" />}
                  <span>{feasibility.statusLabel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block">Pathologie & Période</span>
                  <strong className="text-white text-sm block mt-1">{feasibility.pathologyText}</strong>
                  <span className="text-slate-400 text-[11px]">{feasibility.periodText}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block">Observations Estimées</span>
                  <strong className="text-indigo-300 text-base block mt-1">{feasibility.observationsEstimatedCount}</strong>
                  <span className="text-slate-400 text-[11px]">{feasibility.zonesCount} zone(s) de santé</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block">Complétude Globale</span>
                  <strong className="text-emerald-400 text-base block mt-1">{feasibility.globalCompletenessPct}%</strong>
                  <span className="text-slate-400 text-[11px]">{feasibility.variablesCount} variables</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-slate-400 block">Score Modélisation</span>
                  <strong className="text-amber-300 text-sm block mt-1">{feasibility.modelingReadinessScore}</strong>
                  <span className="text-slate-400 text-[11px]">Indicateur technique V1.14</span>
                </div>
              </div>

              {feasibility.criticalIssuesCount > 0 && (
                <div className="mt-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">
                  <strong className="block font-bold text-red-100 mb-1">Avis méthodologiques :</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {feasibility.criticalIssuesList.map((iss, i) => (
                      <li key={i}>{iss}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>
                  <strong>Garantie d intégrité :</strong> La création de ce dataset analytique créera une vue contrôlée.
                  Les données <strong>RAW</strong> et <strong>CLEANED</strong> resteront strictement intactes.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1);
            else onCancel();
          }}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 1 ? 'Annuler' : 'Étape Précédente'}
        </button>

        <div className="flex items-center gap-3">
          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
            >
              Étape Suivante
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={feasibility.statusSignal === 'ROUGE'}
              className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl transition flex items-center gap-2 shadow ${
                feasibility.statusSignal === 'ROUGE'
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Générer le Dataset Analytique (V1.14)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
