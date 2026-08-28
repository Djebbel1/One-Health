import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  SurveyCreationWizard
} from './SurveyCreationWizard';
import {
  QuestionnaireBuilderModal
} from './QuestionnaireBuilderModal';
import {
  MobileFieldFormModal
} from './MobileFieldFormModal';
import {
  SupervisionDashboard
} from './SupervisionDashboard';
import {
  HealthRegistriesModule
} from './HealthRegistriesModule';
import {
  ClipboardList,
  Smartphone,
  UserCheck,
  FileCode2,
  Stethoscope,
  History,
  ShieldCheck,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { FieldSurvey, SurveyQuestionnaire } from '../types';

export const SurveyOperationsModuleV111: React.FC = () => {
  const {
    fieldSurveys,
    addFieldSurvey,
    updateFieldSurvey,
    deleteFieldSurvey,
    surveyQuestionnaires,
    addSurveyQuestionnaire,
    updateSurveyQuestionnaire,
    publishQuestionnaireVersion,
    createNextQuestionnaireVersion,
    collectionSessions,
    addCollectionSession,
    updateCollectionSession,
    submitCollectionSession,
    validateCollectionSession,
    requestCorrectionCollectionSession,
    rejectCollectionSession,
    addSupervisorCommentToSession,
    fieldPlanItems,
    healthRegistryRecords,
    addHealthRegistryRecord,
    bulkAddHealthRegistryRecords,
    surveyAuditLogs,
    v111ValidationTests,
    runAutomatedValidationV111,
    maniemaGeoUnits,
    pathologies,
    oneHealthProjects,
    userSession,
    isDemoMode
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<
    | 'CAMPAIGNS'
    | 'COLLECTION_MOBILE'
    | 'SUPERVISION'
    | 'QUESTIONNAIRES'
    | 'REGISTRIES'
    | 'AUDIT'
    | 'VALIDATION_TESTS'
  >('CAMPAIGNS');

  // Modals state
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [showBuilderModal, setShowBuilderModal] = useState<boolean>(false);
  const [selectedQuestionnaireForBuilder, setSelectedQuestionnaireForBuilder] = useState<SurveyQuestionnaire | null>(null);
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
  const [selectedSurveyForCollection, setSelectedSurveyForCollection] = useState<FieldSurvey | null>(null);

  const testsPassed = v111ValidationTests.filter(t => t.status === 'PASSED').length;
  const testsFailed = v111ValidationTests.filter(t => t.status === 'FAILED').length;

  const handleOpenMobileForm = (survey: FieldSurvey) => {
    setSelectedSurveyForCollection(survey);
    setShowMobileModal(true);
  };

  const handleOpenBuilder = (q: SurveyQuestionnaire) => {
    setSelectedQuestionnaireForBuilder(q);
    setShowBuilderModal(true);
  };

  return (
    <div id="survey-operations-module-v111" className="flex flex-col gap-6">
      
      {/* Top Banner with Version Badge */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold rounded-full border border-emerald-500/40">
              MODULE V1.11 — OPÉRATIONS DE TERRAIN & SUPERVISION
            </span>
            {isDemoMode ? (
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded border border-amber-500/30">
                Mode Démonstration Actif
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded border border-emerald-500/30">
                Données Réelles de Recherche
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            Système Opérationnel d’Enquêtes & Double Supervision One Health
          </h1>
          <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
            Gestion du cycle complet des enquêtes : questionnaires versionnés (7 sections standardisées), logique de saut conditionnelle, collecte mobile/tablette géolocalisée, et poste de supervision avec conservation intégrale de l’historique des corrections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-open-survey-wizard"
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Nouvelle Enquête
          </button>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'CAMPAIGNS', label: 'Enquêtes & Campagnes', icon: ClipboardList, count: fieldSurveys.length },
          { id: 'COLLECTION_MOBILE', label: 'Collecte Mobile / Tablette', icon: Smartphone },
          { id: 'SUPERVISION', label: 'Supervision & Contrôle', icon: UserCheck, count: collectionSessions.filter(s => s.status === 'SOUMISE').length },
          { id: 'QUESTIONNAIRES', label: 'Questionnaires & Versions', icon: FileCode2, count: surveyQuestionnaires.length },
          { id: 'REGISTRIES', label: 'Registres FOSA', icon: Stethoscope, count: healthRegistryRecords.length },
          { id: 'AUDIT', label: 'Journal d’Audit', icon: History, count: surveyAuditLogs.length },
          { id: 'VALIDATION_TESTS', label: 'Banc de 15 Tests V1.11', icon: ShieldCheck, badge: `${testsPassed}/15` }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-v111-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: Enquêtes & Campagnes */}
      {activeSubTab === 'CAMPAIGNS' && (
        <div className="flex flex-col gap-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fieldSurveys.map(survey => {
              const matchedQ = surveyQuestionnaires.find(q => q.id === survey.questionnaireId);
              const progressPct =
                survey.targetSampleCount > 0
                  ? Math.min(100, Math.round((survey.completedSampleCount / survey.targetSampleCount) * 100))
                  : 0;

              return (
                <div
                  key={survey.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between gap-4 hover:border-emerald-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {survey.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          survey.status === 'EN_COURS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : survey.status === 'PLANIFIEE'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {survey.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {survey.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                        {survey.type}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200">
                        Questionnaire v{survey.questionnaireVersion}
                      </span>
                      {survey.isDemo && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-semibold border border-amber-200">
                          🧪 Démo
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Période :</span>
                        <strong>{survey.startDate} au {survey.endDate}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Superviseur :</span>
                        <strong>{survey.leadSupervisorName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Aires de santé :</span>
                        <strong>{survey.geographicUnitIds.length} ciblées</strong>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-semibold">Progression collecte</span>
                        <span className="font-bold text-slate-800">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>Complété : {survey.completedSampleCount} / {survey.targetSampleCount}</span>
                        <span>Validé : {survey.validatedSampleCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenMobileForm(survey)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Saisir sur le terrain
                    </button>

                    {matchedQ && (
                      <button
                        type="button"
                        onClick={() => handleOpenBuilder(matchedQ)}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Consulter le questionnaire"
                      >
                        <FileCode2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Collecte Mobile / Tablette Quick Launcher */}
      {activeSubTab === 'COLLECTION_MOBILE' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center gap-4 animate-in fade-in">
          <div className="p-4 bg-emerald-100 text-emerald-800 rounded-3xl">
            <Smartphone className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Interface Mobile & Tablette de Collecte Terrain
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1">
              Boutons tactiles agrandis (&gt; 44px), acquisition GPS temps réel, affichage conditionnel automatique et sauvegarde progressive.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            {fieldSurveys.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleOpenMobileForm(s)}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Play className="w-4 h-4" /> Lancer le formulaire : {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Supervision & Contrôle Qualité */}
      {activeSubTab === 'SUPERVISION' && (
        <SupervisionDashboard
          sessions={collectionSessions}
          surveys={fieldSurveys}
          questionnaires={surveyQuestionnaires}
          fieldPlans={fieldPlanItems}
          healthRegistries={healthRegistryRecords}
          auditLogs={surveyAuditLogs}
          onValidateSession={validateCollectionSession}
          onRequestCorrection={requestCorrectionCollectionSession}
          onRejectSession={rejectCollectionSession}
          onAddComment={addSupervisorCommentToSession}
          currentUserId={userSession.id}
          currentUserName={userSession.name}
        />
      )}

      {/* SUB-TAB 4: Questionnaires & Versions */}
      {activeSubTab === 'QUESTIONNAIRES' && (
        <div className="flex flex-col gap-6 animate-in fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Répertoire des Questionnaires Standardisés
              </h3>
              <p className="text-xs text-slate-500">
                Structure en 7 sections One Health avec traçabilité intégrale des versions publiées.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (surveyQuestionnaires[0]) handleOpenBuilder(surveyQuestionnaires[0]);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" /> Ouvrir le Concepteur
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveyQuestionnaires.map(q => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{q.name}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-300">
                        v{q.version}
                      </span>
                    </div>

                    {q.isLocked ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-semibold">
                        <Lock className="w-3 h-3" /> Verrouillé (Publié)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded text-[11px] font-semibold">
                        Brouillon
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">{q.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>Sections : <strong>{q.sections.length}</strong></div>
                    <div>Questions : <strong>{q.sections.reduce((acc, s) => acc + s.questions.length, 0)}</strong></div>
                    <div>Statut : <strong>{q.status}</strong></div>
                    <div>Mise à jour : <strong>{new Date(q.updatedAt).toLocaleDateString()}</strong></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleOpenBuilder(q)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    <FileCode2 className="w-3.5 h-3.5" /> Explorer & Gérer Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Registres FOSA */}
      {activeSubTab === 'REGISTRIES' && (
        <HealthRegistriesModule
          records={healthRegistryRecords}
          surveys={fieldSurveys}
          pathologies={pathologies}
          geoUnits={maniemaGeoUnits}
          onAddRecord={addHealthRegistryRecord}
          onBulkAdd={bulkAddHealthRegistryRecords}
          isDemoMode={isDemoMode}
        />
      )}

      {/* SUB-TAB 6: Journal d'Audit & Traçabilité */}
      {activeSubTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Journal d’Audit & Traçabilité des Opérations de Terrain (V1.11)
              </h3>
              <p className="text-xs text-slate-500">
                Historisation chronologique et non altérable de chaque action (création, soumission, correction, validation).
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {surveyAuditLogs.length} logs enregistrés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date & Heure</th>
                  <th className="py-2.5 px-3">Utilisateur</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entité</th>
                  <th className="py-2.5 px-3">Détails / Motif Scientifique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {surveyAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold">
                      {log.userName} ({log.userRole})
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action === 'VALIDATION'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'DEMANDE_CORRECTION'
                            ? 'bg-amber-100 text-amber-800'
                            : log.action === 'SOUMISSION'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                      {log.entity}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Banc de 15 Tests V1.11 */}
      {activeSubTab === 'VALIDATION_TESTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Banc d'Épreuve & Validation Automatisée V1.11 (15 Tests)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Conformité stricte : questionnaires 7 sections, logique de saut, calcul de complétude sans pénalité conditionnelle, double contrôle superviseur, et traçabilité sans écrasement d'historique.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg">
                  {testsPassed} Succès
                </span>
                {testsFailed > 0 && (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 font-bold text-xs rounded-lg">
                    {testsFailed} Échecs
                  </span>
                )}
              </div>

              <button
                type="button"
                id="btn-run-tests-v111"
                onClick={runAutomatedValidationV111}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réexécuter la Suite
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {v111ValidationTests.map(test => (
              <div
                key={test.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      TEST #{test.id} — {test.category}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {test.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-1">{test.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Détails : <strong>{test.details}</strong></span>
                  <span>Vérifié : {new Date(test.verifiedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WIZARD MODAL */}
      <SurveyCreationWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSubmit={addFieldSurvey}
        geoUnits={maniemaGeoUnits}
        pathologies={pathologies}
        projects={oneHealthProjects}
        questionnaires={surveyQuestionnaires}
        defaultIsDemo={isDemoMode}
      />

      {/* QUESTIONNAIRE BUILDER MODAL */}
      {selectedQuestionnaireForBuilder && (
        <QuestionnaireBuilderModal
          questionnaire={selectedQuestionnaireForBuilder}
          pathologies={pathologies}
          isOpen={showBuilderModal}
          onClose={() => setShowBuilderModal(false)}
          onSave={updateSurveyQuestionnaire}
          onPublish={publishQuestionnaireVersion}
          onCreateNewVersion={createNextQuestionnaireVersion}
        />
      )}

      {/* MOBILE FIELD FORM MODAL */}
      {selectedSurveyForCollection && (
        <MobileFieldFormModal
          survey={selectedSurveyForCollection}
          questionnaire={
            surveyQuestionnaires.find(q => q.id === selectedSurveyForCollection.questionnaireId) ||
            surveyQuestionnaires[0]
          }
          geoUnits={maniemaGeoUnits}
          isOpen={showMobileModal}
          onClose={() => setShowMobileModal(false)}
          onSaveDraft={addCollectionSession}
          onSubmitSession={session => {
            addCollectionSession(session);
            // Auto submit
            submitCollectionSession(session.id || 'NEW');
          }}
          currentSurveyorName={userSession.name}
        />
      )}
    </div>
  );
};
