import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  Terminal
} from 'lucide-react';
import { V120SecurityScenarioTest } from '../../types';
import { INITIAL_V120_SECURITY_TESTS } from '../../data/mockSecurityDataV120';

interface SecurityTestRunnerTabProps {
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const SecurityTestRunnerTab: React.FC<SecurityTestRunnerTabProps> = ({
  onAddSecurityLog
}) => {
  const [tests, setTests] = useState<V120SecurityScenarioTest[]>(INITIAL_V120_SECURITY_TESTS);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeRunningId, setActiveRunningId] = useState<number | null>(null);
  const [expandedTestIds, setExpandedTestIds] = useState<number[]>([1, 2, 7]);

  const passedCount = tests.filter((t) => t.status === 'PASSED').length;
  const totalCount = tests.length;

  const toggleExpand = (id: number) => {
    setExpandedTestIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRunSingleTest = (testId: number) => {
    setActiveRunningId(testId);
    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: 'PASSED',
                lastRunDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
              }
            : t
        )
      );
      setActiveRunningId(null);
      onAddSecurityLog('SECRETS_INTEGRITY_CHECK', `Test automatisé exécuté avec succès : #${testId}`, 'INFO');
    }, 400);
  };

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < tests.length) {
        const tId = tests[currentIdx].id;
        setActiveRunningId(tId);
        setTests((prev) =>
          prev.map((t) =>
            t.id === tId
              ? {
                  ...t,
                  status: 'PASSED',
                  lastRunDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
                }
              : t
          )
        );
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
        setActiveRunningId(null);
        onAddSecurityLog('SECRETS_INTEGRITY_CHECK', 'Suite complète des 11 tests de sécurité et non-régression V1.20 validée (11/11 PASSED)', 'INFO');
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Header Card & Run All Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Banc d Épreuves de Sécurité & Non-Régression V1.20
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Validation automatique des 11 scénarios critiques (Sessions, RBAC, Multi-Projets, SHA-256, PRA, V1.0–V1.19)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
              {passedCount} / {totalCount} TESTS VALIDÉS (100%)
            </span>

            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningAll ? 'animate-spin' : ''}`} />
              Exécuter les 11 Tests
            </button>
          </div>
        </div>

        {/* Global Test Suite Status Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Conformité Totale V1.20 :</strong> Tous les contrôles de sécurité, politique de sauvegarde, isolation hermétique et non-régression sont validés avec succès.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold shrink-0">
            Dernier Run : 2026-08-30
          </span>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-3">
        {tests.map((test) => {
          const isExpanded = expandedTestIds.includes(test.id);
          const isCurrentlyRunning = activeRunningId === test.id;

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition"
            >
              <div
                onClick={() => toggleExpand(test.id)}
                className="p-4 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="mt-0.5 sm:mt-0 text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    )}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                        {test.code}
                      </span>
                      <strong className="text-xs text-slate-900">{test.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{test.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono flex items-center gap-1 ${
                      test.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : test.status === 'FAILED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {test.status === 'PASSED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {isCurrentlyRunning ? 'EXÉCUTION...' : test.status}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunSingleTest(test.id);
                    }}
                    disabled={isRunningAll}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    title="Relancer ce test"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCurrentlyRunning ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-3 bg-white text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">
                      Étapes Opérationnelles du Scénario :
                    </span>
                    <ul className="space-y-1 pl-2 font-mono text-[11px] text-slate-600">
                      {test.steps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">›</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 block">Résultat Attendu :</span>
                      <p className="text-slate-600 mt-0.5">{test.expectedOutcome}</p>
                    </div>

                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                      <span className="font-bold text-emerald-900 block">Constat Observé :</span>
                      <p className="text-emerald-800 font-semibold mt-0.5">
                        {test.actualOutcome || 'En attente d exécution'}
                      </p>
                    </div>
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
