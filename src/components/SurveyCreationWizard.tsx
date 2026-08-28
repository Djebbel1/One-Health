import React, { useState } from 'react';
import {
  FieldSurvey,
  SurveyType,
  GeographicUnitV110,
  PathologyConfig,
  OneHealthProject,
  SurveyQuestionnaire,
  SurveyTargetType
} from '../types';
import {
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (survey: Omit<FieldSurvey, 'id' | 'createdAt' | 'updatedAt'>) => void;
  geoUnits: GeographicUnitV110[];
  pathologies: PathologyConfig[];
  projects: OneHealthProject[];
  questionnaires: SurveyQuestionnaire[];
  defaultIsDemo: boolean;
}

export const SurveyCreationWizard: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  geoUnits,
  pathologies,
  projects,
  questionnaires,
  defaultIsDemo
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>('Enquête Saison des Pluies - Kindu 2026');
  const [code, setCode] = useState<string>('ENQ-PLUIE-2026');
  const [type, setType] = useState<SurveyType>('PROSPECTIVE_MENAGE');
  const [targetType, setTargetType] = useState<SurveyTargetType>('MENAGE');
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || 'PRJ_KINDU_ONEHEALTH_01');
  const [selectedGeoIds, setSelectedGeoIds] = useState<string[]>(['AS_ALUNGULI', 'AS_KASUKU']);
  const [selectedPathologyIds, setSelectedPathologyIds] = useState<string[]>(['PATH_MAL', 'PATH_TYP']);
  const [startDate, setStartDate] = useState<string>('2026-03-01');
  const [endDate, setEndDate] = useState<string>('2026-04-30');
  const [targetSampleCount, setTargetSampleCount] = useState<number>(150);
  const [supervisorName, setSupervisorName] = useState<string>('Dr. Dieudonné Radjabu');
  const [assignedSurveyors, setAssignedSurveyors] = useState<string>('Patrick Kasongo, Solange Mwamba, Eric Kabala');
  const [questionnaireId, setQuestionnaireId] = useState<string>(questionnaires[0]?.id || 'QST_ONEHEALTH_V10');
  const [isDemo, setIsDemo] = useState<boolean>(defaultIsDemo);

  if (!isOpen) return null;

  const toggleGeo = (id: string) => {
    setSelectedGeoIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePathology = (id: string) => {
    setSelectedPathologyIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const surveyorsList = assignedSurveyors.split(',').map(s => s.trim()).filter(Boolean);
    const selectedQ = questionnaires.find(q => q.id === questionnaireId);

    const payload: Omit<FieldSurvey, 'id' | 'createdAt' | 'updatedAt'> = {
      code,
      name,
      type,
      targetType,
      projectId,
      geographicScope: 'MANIEMA',
      geographicUnitIds: selectedGeoIds,
      pathologyIds: selectedPathologyIds,
      questionnaireId,
      questionnaireVersion: selectedQ?.version || '1.0',
      startDate,
      endDate,
      targetSampleCount,
      completedSampleCount: 0,
      validatedSampleCount: 0,
      status: 'PLANIFIEE',
      leadSupervisorName: supervisorName,
      assignedSurveyorNames: surveyorsList,
      isDemo
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div id="survey-creation-wizard" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Nouvelle Enquête Opérationnelle de Terrain
              </h2>
              <p className="text-xs text-slate-500">
                Assistant de paramétrage standardisé en 7 étapes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper progress */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { n: 1, label: 'Type' },
            { n: 2, label: 'Pathologies' },
            { n: 3, label: 'Période & Équipe' },
            { n: 4, label: 'Sites & Cible' },
            { n: 5, label: 'Questionnaire' },
            { n: 6, label: 'Démo / Réel' },
            { n: 7, label: 'Lancement' }
          ].map(s => (
            <div
              key={s.n}
              className={`flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
                step === s.n
                  ? 'text-emerald-700 font-bold'
                  : step > s.n
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
              onClick={() => setStep(s.n)}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step === s.n
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : step > s.n
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > s.n ? '✓' : s.n}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30">
          {/* STEP 1: Type & Périmètre */}
          {step === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Intitulé officiel de l’enquête
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  placeholder="ex: Enquête Saison des Pluies - Kindu 2026"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Code d’enquête unique
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Projet de rattachement
                  </label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Typologie méthodologique d'enquête
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'PROSPECTIVE_MENAGE',
                      label: 'Prospective Ménage',
                      desc: 'Visite directe de terrain, géolocalisation et questionnaire ménage complet'
                    },
                    {
                      id: 'RETROSPECTIVE_FOSA',
                      label: 'Rétrospective FOSA',
                      desc: 'Extraction et contrôle qualité des registres des centres de santé'
                    },
                    {
                      id: 'MIXTE',
                      label: 'Enquête Mixte',
                      desc: 'Couplage simultané ménage et registres sanitaires'
                    }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id as SurveyType)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        type === item.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold mb-1">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pathologies */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  Sélection des pathologies ciblées (One Health)
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Les modules cliniques et diagnostics spécifiques du questionnaire s’activeront selon ces pathologies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pathologies.map(p => {
                  const isChecked = selectedPathologyIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => togglePathology(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-start justify-between ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{p.code}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Saison: {p.seasonality}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 mt-0.5"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Période & Équipe */}
          {step === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date de début de collecte
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date de fin de collecte
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Superviseur principal responsable
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={e => setSupervisorName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                  placeholder="ex: Dr. Dieudonné Radjabu"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enquêteurs assignés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={assignedSurveyors}
                  onChange={e => setAssignedSurveyors(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                  placeholder="Patrick Kasongo, Solange Mwamba, Eric Kabala"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Sites & Échantillonnage */}
          {step === 4 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Taille totale de l'échantillon visé (Ménages / Sujets)
                </label>
                <input
                  type="number"
                  value={targetSampleCount}
                  onChange={e => setTargetSampleCount(Number(e.target.value))}
                  className="w-full max-w-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Aires de santé / Sites d'observation ciblés au Maniema ({selectedGeoIds.length} sélectionnés)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {geoUnits
                    .filter(g => g.level === 'AIRE_DE_SANTE')
                    .map(g => {
                      const isChecked = selectedGeoIds.includes(g.id);
                      return (
                        <div
                          key={g.id}
                          onClick={() => toggleGeo(g.id)}
                          className={`p-2.5 rounded-lg border cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div>{g.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">Pop: {g.populationTotal.toLocaleString()}</div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Questionnaire */}
          {step === 5 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Choix du questionnaire opérationnel
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {questionnaires.map(q => (
                  <div
                    key={q.id}
                    onClick={() => setQuestionnaireId(q.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      questionnaireId === q.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{q.name}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                          v{q.version}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                        {q.sections.length} sections / {q.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{q.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Démo vs Réel */}
          {step === 6 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                Séparation stricte : Données de Démonstration vs Données Réelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setIsDemo(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isDemo
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm mb-1 flex items-center justify-between">
                    <span>🧪 Mode Démonstration / Formation</span>
                    {isDemo && <span className="text-amber-600 text-xs">Actif</span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les données collectées seront étiquetées comme démonstration. Elles n’altèrent pas la base de recherche épidémiologique officielle.
                  </p>
                </div>

                <div
                  onClick={() => setIsDemo(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    !isDemo
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm mb-1 flex items-center justify-between">
                    <span>🔬 Données Réelles de Recherche</span>
                    {!isDemo && <span className="text-emerald-700 text-xs font-bold">Actif</span>}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Données collectées sur le terrain avec traçabilité intégrale, soumises au protocole de double contrôle et audit One Health.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Récapitulatif & Lancement */}
          {step === 7 && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Récapitulatif de configuration de l'enquête
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-emerald-950">
                  <div><strong>Intitulé :</strong> {name} ({code})</div>
                  <div><strong>Typologie :</strong> {type}</div>
                  <div><strong>Période :</strong> {startDate} au {endDate}</div>
                  <div><strong>Échantillon visé :</strong> {targetSampleCount} ménages</div>
                  <div><strong>Superviseur :</strong> {supervisorName}</div>
                  <div><strong>Sites :</strong> {selectedGeoIds.length} aires de santé</div>
                  <div><strong>Pathologies :</strong> {selectedPathologyIds.join(', ')}</div>
                  <div><strong>Régime de données :</strong> {isDemo ? '🧪 Démo' : '🔬 Réel'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => prev - 1)}
            className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Précédent
          </button>

          <div className="flex items-center gap-2">
            {step < 7 ? (
              <button
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-launch-survey"
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-md transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Lancer officiellement l’enquête
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
