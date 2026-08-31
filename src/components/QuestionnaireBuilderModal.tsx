import React, { useState, useEffect } from 'react';
import {
  SurveyQuestionnaire,
  SurveySection,
  SurveyQuestion,
  SurveyQuestionType,
  PathologyConfig
} from '../types';
import {
  FileText,
  Plus,
  Trash2,
  Lock,
  CheckCircle,
  Copy,
  Layers,
  HelpCircle,
  Sparkles,
  Sliders,
  X,
  AlertTriangle
} from 'lucide-react';

interface Props {
  questionnaire: SurveyQuestionnaire;
  pathologies: PathologyConfig[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SurveyQuestionnaire) => void;
  onPublish: (id: string) => void;
  onCreateNewVersion: (id: string, newVersion: string) => void;
}

const QUESTION_TYPES: { type: SurveyQuestionType; label: string; icon: string }[] = [
  { type: 'TEXT', label: 'Texte court', icon: 'Aa' },
  { type: 'TEXTAREA', label: 'Texte long / Notes', icon: '¶' },
  { type: 'NUMBER', label: 'Nombre entier', icon: '123' },
  { type: 'DECIMAL', label: 'Décimal / Mesure', icon: '0.0' },
  { type: 'SINGLE_CHOICE', label: 'Choix unique (Radio)', icon: '◉' },
  { type: 'MULTIPLE_CHOICE', label: 'Choix multiples (Cases)', icon: '☑' },
  { type: 'DATE', label: 'Date', icon: '📅' },
  { type: 'GPS', label: 'Coordonnées GPS', icon: '📍' },
  { type: 'BOOLEAN', label: 'Oui / Non (Binaire)', icon: '◐' },
  { type: 'PHOTO', label: 'Prise de photo', icon: '📷' },
  { type: 'AUDIO', label: 'Enregistrement vocal', icon: '🎙️' },
  { type: 'SCALE', label: 'Échelle d’évaluation', icon: '⭐' },
  { type: 'WATER_SOURCE', label: 'Source d’eau (WASH)', icon: '💧' },
  { type: 'MOSQUITO_NET', label: 'Moustiquaire MILD', icon: '🛡️' },
  { type: 'SYMPTOMS_CHECKLIST', label: 'Checklist des symptômes', icon: '🩺' }
];

export const QuestionnaireBuilderModal: React.FC<Props> = ({
  questionnaire,
  pathologies = [],
  isOpen,
  onClose,
  onSave,
  onPublish,
  onCreateNewVersion
}) => {
  const [currentQ, setCurrentQ] = useState<SurveyQuestionnaire>(() => questionnaire ? { ...questionnaire } : ({} as any));
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [newVersionInput, setNewVersionInput] = useState<string>('1.2');
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);

  useEffect(() => {
    if (questionnaire) {
      setCurrentQ({ ...questionnaire, sections: questionnaire.sections || [] });
    }
  }, [questionnaire]);

  if (!isOpen || !currentQ || !currentQ.sections) return null;

  const currentSection = (currentQ.sections || [])[selectedSectionIndex] || (currentQ.sections || [])[0];

  const handleUpdateQuestion = (qIndex: number, updatedQuestion: Partial<SurveyQuestion>) => {
    if (currentQ.isLocked) return;
    const updatedSections = [...currentQ.sections];
    const targetQ = updatedSections[selectedSectionIndex].questions[qIndex];
    updatedSections[selectedSectionIndex].questions[qIndex] = {
      ...targetQ,
      ...updatedQuestion
    };
    setCurrentQ({ ...currentQ, sections: updatedSections });
  };

  const handleAddQuestion = () => {
    if (currentQ.isLocked) return;
    const updatedSections = [...currentQ.sections];
    const newId = `Q_${Date.now()}`;
    const newQuestion: SurveyQuestion = {
      id: newId,
      code: `Q_${updatedSections[selectedSectionIndex].questions.length + 1}`,
      label: 'Nouvelle question de collecte',
      type: 'TEXT',
      required: true,
      displayOrder: updatedSections[selectedSectionIndex].questions.length + 1
    };
    updatedSections[selectedSectionIndex].questions.push(newQuestion);
    setCurrentQ({ ...currentQ, sections: updatedSections });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (currentQ.isLocked) return;
    const updatedSections = [...currentQ.sections];
    updatedSections[selectedSectionIndex].questions.splice(qIndex, 1);
    setCurrentQ({ ...currentQ, sections: updatedSections });
  };

  const handleSave = () => {
    onSave(currentQ);
    onClose();
  };

  return (
    <div id="questionnaire-builder-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">{currentQ.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  v{currentQ.version}
                </span>
                {currentQ.isLocked ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    <Lock className="w-3 h-3" /> Verrouillé (Publié)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                    Brouillon Modifiable
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentQ.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentQ.isLocked ? (
              <button
                type="button"
                id="btn-create-next-version"
                onClick={() => setShowVersionModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg border border-indigo-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Créer nouvelle version
              </button>
            ) : (
              <button
                type="button"
                id="btn-publish-questionnaire"
                onClick={() => {
                  onPublish(currentQ.id);
                  setCurrentQ({ ...currentQ, status: 'PUBLIE', isLocked: true });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Publier & Verrouiller
              </button>
            )}

            <button
              type="button"
              id="btn-close-modal"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice if locked */}
        {currentQ.isLocked && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Mode Lecture Seule :</strong> Ce questionnaire est publié et verrouillé pour garantir la comparabilité scientifique des données déjà collectées. Pour le modifier, générez une nouvelle version incrémentale (ex: v1.2).
              </span>
            </div>
          </div>
        )}

        {/* Body 2-col layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Sections List */}
          <div className="w-72 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                7 Sections Standardisées
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                {currentQ.sections.length} sections
              </span>
            </div>

            {currentQ.sections.map((section, idx) => (
              <button
                key={section.id}
                type="button"
                id={`btn-section-tab-${section.id}`}
                onClick={() => setSelectedSectionIndex(idx)}
                className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start justify-between ${
                  selectedSectionIndex === idx
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {section.order}. {section.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {section.description}
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold">
                  {section.questions.length} Q
                </span>
              </button>
            ))}
          </div>

          {/* Right: Section Questions Editor */}
          <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col gap-5">
            {currentSection && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
                      Section {currentSection.order} : {currentSection.title}
                    </h3>
                    <p className="text-xs text-slate-500">{currentSection.description}</p>
                  </div>
                  {!currentQ.isLocked && (
                    <button
                      type="button"
                      id="btn-add-question"
                      onClick={handleAddQuestion}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ajouter une question
                    </button>
                  )}
                </div>

                {/* Questions List */}
                <div className="flex flex-col gap-4">
                  {currentSection.questions.map((question, qIdx) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 transition-colors flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-bold rounded">
                            {question.code}
                          </span>
                          {currentQ.isLocked ? (
                            <span className="text-sm font-semibold text-slate-800">
                              {question.label}
                            </span>
                          ) : (
                            <input
                              type="text"
                              value={question.label}
                              onChange={e => handleUpdateQuestion(qIdx, { label: e.target.value })}
                              className="text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded px-2.5 py-1 w-full focus:ring-1 focus:ring-emerald-500"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold rounded">
                            {QUESTION_TYPES.find(t => t.type === question.type)?.label || question.type}
                          </span>
                          {question.required && (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded">
                              Requis
                            </span>
                          )}
                          {!currentQ.isLocked && (
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(qIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Supprimer la question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question meta details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200/60">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                            Type de saisie
                          </label>
                          {currentQ.isLocked ? (
                            <span className="text-slate-700">{question.type}</span>
                          ) : (
                            <select
                              value={question.type}
                              onChange={e =>
                                handleUpdateQuestion(qIdx, {
                                  type: e.target.value as SurveyQuestionType
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                            >
                              {QUESTION_TYPES.map(t => (
                                <option key={t.type} value={t.type}>
                                  {t.icon} {t.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                            Spécifique à une pathologie
                          </label>
                          {currentQ.isLocked ? (
                            <span className="text-slate-700">
                              {question.specificToPathologyId || 'Toutes (One Health)'}
                            </span>
                          ) : (
                            <select
                              value={question.specificToPathologyId || ''}
                              onChange={e =>
                                handleUpdateQuestion(qIdx, {
                                  specificToPathologyId: e.target.value || undefined
                                })
                              }
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                            >
                              <option value="">Transversal (Toutes)</option>
                              {pathologies.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.code} - {p.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                            Logique de saut conditionnelle
                          </label>
                          <span className="text-slate-600 block truncate">
                            {question.conditionalRule
                              ? `Afficher si [${question.conditionalRule.dependsOnQuestionId}] = "${question.conditionalRule.expectedValue}"`
                              : 'Toujours affichée'}
                          </span>
                        </div>
                      </div>

                      {/* Choices preview if choice question */}
                      {question.choices && question.choices.length > 0 && (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Options de réponse ({question.choices.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {question.choices.map(c => (
                              <span
                                key={c.id}
                                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] border border-slate-200"
                              >
                                {c.code}: {c.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total questions dans le questionnaire :{' '}
            <strong className="text-slate-800">
              {currentQ.sections.reduce((sum, s) => sum + s.questions.length, 0)}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors"
            >
              Fermer
            </button>
            {!currentQ.isLocked && (
              <button
                type="button"
                id="btn-save-questionnaire"
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors"
              >
                Enregistrer les modifications
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Incremental Version Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-5 max-w-sm w-full animate-in fade-in">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Créer une nouvelle version</h4>
            <p className="text-xs text-slate-500 mb-4">
              Duplique la structure de la v{currentQ.version} dans un nouveau brouillon sans altérer les sessions existantes.
            </p>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Numéro de version
            </label>
            <input
              type="text"
              value={newVersionInput}
              onChange={e => setNewVersionInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-slate-800 mb-4 focus:ring-1 focus:ring-emerald-500"
              placeholder="ex: 1.2"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onCreateNewVersion(currentQ.id, newVersionInput);
                  setShowVersionModal(false);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Générer v{newVersionInput}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
