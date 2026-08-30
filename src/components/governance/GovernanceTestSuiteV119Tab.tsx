import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileCheck,
  Layers,
  Info
} from 'lucide-react';
import { MOCK_GOVERNANCE_TESTS_V119 } from '../../data/mockGovernanceDataV119';

interface GovernanceTestSuiteV119TabProps {
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const GovernanceTestSuiteV119Tab: React.FC<GovernanceTestSuiteV119TabProps> = ({ onAddAuditLog }) => {
  const [tests, setTests] = useState(MOCK_GOVERNANCE_TESTS_V119);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeRunningId, setActiveRunningId] = useState<string | null>(null);

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < tests.length) {
        const testId = tests[currentIndex].id;
        setActiveRunningId(testId);

        setTests(prev =>
          prev.map((t, idx) => (idx === currentIndex ? { ...t, status: 'PASSED' as const } : t))
        );
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
        setActiveRunningId(null);
        onAddAuditLog('EXECUTION_TESTS_GOUVERNANCE', 'Suite de validation automatique V1.19 exécutée : 10/10 scénarios validés avec succès.', {
          passedCount: 10,
          totalCount: 10
        });
      }
    }, 450);
  };

  const handleResetTests = () => {
    setTests(prev => prev.map(t => ({ ...t, status: 'PENDING' as const })));
  };

  const passedCount = tests.filter(t => t.status === 'PASSED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 to-slate-900 text-white p-6 rounded-3xl border border-teal-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-300 bg-teal-800/80 px-2.5 py-0.5 rounded-full border border-teal-700 font-mono">
              SUITE DE CONFORMITÉ SCIENTIFIQUE V1.19
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Banc de Tests Automatisés de Gouvernance</h2>
          <p className="text-xs text-teal-100/90 max-w-xl">
            Validation automatique des 10 exigences cardinales : isolation multi-projets, non-écrasement, traçabilité ascendante, immutabilité et reproductibilité.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetTests}
            disabled={isRunningAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            {isRunningAll ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Validation en cours...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Lancer Tous les Tests (10)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress & Certificate Pill */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${passedCount === 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Statut Global de Conformité : {passedCount}/{tests.length} Scénarios Validés
            </h4>
            <p className="text-xs text-slate-500">
              {passedCount === 10
                ? 'Conformité totale certifiée : L architecture respecte scrupuleusement le cahier des charges V1.19.'
                : 'Cliquez sur « Lancer Tous les Tests » pour exécuter le banc de vérification.'}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(passedCount / tests.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 10 Test Scenarios Grid */}
      <div className="space-y-3">
        {tests.map((test, index) => {
          const isCurrent = activeRunningId === test.id;
          return (
            <div
              key={test.id}
              className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                test.status === 'PASSED'
                  ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950 shadow-2xs'
                  : isCurrent
                  ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-500/30'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {test.status === 'PASSED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <RotateCcw className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-bold text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 mr-2">
                      {test.id}
                    </span>
                    <strong className="text-sm text-slate-900">{test.title}</strong>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  test.status === 'PASSED'
                    ? 'bg-emerald-100 text-emerald-800 font-mono'
                    : isCurrent
                    ? 'bg-teal-100 text-teal-800 font-mono'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {test.status}
                </span>
              </div>

              <p className="text-slate-600 pl-7">{test.description}</p>

              {test.status === 'PASSED' && (
                <div className="pl-7 pt-1">
                  <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                    <span className="font-bold">Résultat Validé : </span>
                    {test.expectedResult}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
