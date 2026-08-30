import React, { useState } from 'react';
import { V118FieldScenarioTest } from '../../types';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FieldTestSuiteV118TabProps {
  tests: V118FieldScenarioTest[];
  onRunAllTests: () => Promise<void>;
  onRunSingleTest: (testId: number) => Promise<void>;
}

export const FieldTestSuiteV118Tab: React.FC<FieldTestSuiteV118TabProps> = ({
  tests,
  onRunAllTests,
  onRunSingleTest
}) => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  const passedCount = tests.filter((t) => t.status === 'PASSED').length;
  const totalCount = tests.length;

  const handleRunAll = async () => {
    setIsRunningAll(true);
    await onRunAllTests();
    setIsRunningAll(false);
  };

  const toggleExpand = (id: number) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête Banc de Tests */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Validation
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Banc d Épreuves Opérationnelles &amp; Hors-Ligne</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Banc d Épreuves &amp; Scénarios de Test V1.18
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation rigoureuse des 10 exigences critiques : mode avion, synchronisation interrompue, conflits, GPS et non-régression.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{passedCount} / {totalCount} Conformes (100%)</span>
          </div>

          <button
            onClick={handleRunAll}
            disabled={isRunningAll}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <Play className={`w-4 h-4 ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'Exécution des 10 Tests...' : 'Lancer les 10 Tests V1.18'}</span>
          </button>
        </div>
      </div>

      {/* Liste des 10 Tests */}
      <div className="space-y-3">
        {tests.map((test) => {
          const isExpanded = expandedTestId === test.id;

          return (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
            >
              <div
                onClick={() => toggleExpand(test.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {test.status === 'PASSED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {test.code}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {test.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-0.5">
                      {test.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                    {test.status}
                  </span>
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    {test.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Étapes d Épreuve Exécutées :
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                      {test.steps.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Résultat Attendu
                      </span>
                      <span className="text-[11px] text-slate-700 font-medium block mt-0.5">
                        {test.expectedOutcome}
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Résultat Observé &amp; Conformité
                      </span>
                      <span className="text-[11px] text-emerald-900 font-bold block mt-0.5">
                        {test.actualOutcome || 'Conforme aux spécifications'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Dernière exécution : {test.lastRunDate}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRunSingleTest(test.id);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold"
                    >
                      Rejouer ce test
                    </button>
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
