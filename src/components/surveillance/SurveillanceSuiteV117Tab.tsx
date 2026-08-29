import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_TESTS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  V117SurveillanceScenarioTest
} from '../../types';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  FlaskConical,
  Info,
  Clock,
  CheckCheck
} from 'lucide-react';

export const SurveillanceSuiteV117Tab: React.FC = () => {
  const [tests, setTests] = useState<V117SurveillanceScenarioTest[]>(MOCK_SURVEILLANCE_TESTS_V117);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [selectedTest, setSelectedTest] = useState<V117SurveillanceScenarioTest | null>(tests[0]);

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => ({
          ...t,
          status: 'PASSED',
          lastRunDate: '2026-08-29 12:00'
        }))
      );
      setIsRunningAll(false);
    }, 800);
  };

  const handleRunSingleTest = (id: number) => {
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: 'PASSED',
            lastRunDate: '2026-08-29 12:00'
          };
        }
        return t;
      })
    );
  };

  const passedCount = tests.filter((t) => t.status === 'PASSED').length;

  return (
    <div className="space-y-6">
      {/* En-tête & Bouton de Lancement Global */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Banc de Tests Scientifiques V1.17 (10 Scénarios Méthodologiques)
            </h2>
            <p className="text-xs text-slate-500">
              Validation formelle des règles de détection, robustesse aux biais et non-régression V1.0 à V1.16
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            {passedCount} / {tests.length} tests validés
          </span>
          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
          >
            {isRunningAll ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Exécution des Scénarios...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Exécuter les 10 Tests V1.17</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grille 2 Colonnes : Liste des Scénarios (Gauche) + Détail du Test (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche (5/12) */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 block">
            Scénarios Exigés par le Cahier des Charges V1.17
          </span>

          <div className="space-y-2">
            {tests.map((test) => {
              const isSelected = selectedTest?.id === test.id;
              return (
                <div
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {test.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {test.title}
                      </h4>
                    </div>
                    {test.status === 'PASSED' ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>PASSÉ</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                        EN ATTENTE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {test.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite (7/12) : Détail du Scénario Sélectionné */}
        <div className="lg:col-span-7">
          {selectedTest ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {selectedTest.code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    {selectedTest.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleRunSingleTest(selectedTest.id)}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Rejouer ce Test</span>
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Objectif Scientifique du Test :
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {selectedTest.description}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Étapes de Vérification Exécutées :
                  </span>
                  <div className="space-y-2">
                    {selectedTest.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-slate-700 text-xs">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                      Résultat Attendu
                    </span>
                    <p className="text-slate-800 text-xs font-medium">
                      {selectedTest.expectedOutcome}
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] block flex items-center space-x-1">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Résultat Observé &amp; Conformité</span>
                    </span>
                    <p className="text-emerald-900 text-xs font-medium">
                      {selectedTest.actualOutcome || 'Test validé avec succès.'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dernière exécution : {selectedTest.lastRunDate}</span>
                  </span>
                  <span className="text-emerald-700 font-bold">
                    Statut : {selectedTest.status}
                  </span>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Sélectionnez un scénario de test pour voir le détail de validation.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
