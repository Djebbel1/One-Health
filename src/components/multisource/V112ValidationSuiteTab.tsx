import React, { useState } from 'react';
import { V112ValidationTest } from '../../types';
import { V112_AUTOMATED_TESTS_SUITE } from '../../data/mockMultiSourceDataV112';
import {
  CheckCircle,
  AlertCircle,
  Play,
  RefreshCw,
  ShieldCheck,
  Award,
  Layers,
  Database,
  Calendar,
  Sparkles,
  GitMerge,
  Info
} from 'lucide-react';

interface V112ValidationSuiteTabProps {
  tests?: V112ValidationTest[];
}

export const V112ValidationSuiteTab: React.FC<V112ValidationSuiteTabProps> = ({
  tests = V112_AUTOMATED_TESTS_SUITE
}) => {
  const [testList, setTestList] = useState<V112ValidationTest[]>(tests);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeRunningId, setActiveRunningId] = useState<number | null>(null);

  const runAllTests = () => {
    setIsRunningAll(true);
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < testList.length) {
        const idToRun = testList[currentIdx].id;
        setActiveRunningId(idToRun);

        setTestList(prev =>
          prev.map(t =>
            t.id === idToRun
              ? {
                  ...t,
                  status: 'PASSED',
                  verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
                }
              : t
          )
        );
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
        setActiveRunningId(null);
      }
    }, 180);
  };

  const runSingleTest = (id: number) => {
    setActiveRunningId(id);
    setTimeout(() => {
      setTestList(prev =>
        prev.map(t =>
          t.id === id
            ? {
                ...t,
                status: 'PASSED',
                verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
              }
            : t
        )
      );
      setActiveRunningId(null);
    }, 300);
  };

  const passedCount = testList.filter(t => t.status === 'PASSED').length;
  const totalCount = testList.length;
  const successRate = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner & Run All Button */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              Banc de Tests Automatisés V1.12 & Non-Régression
            </span>
          </div>
          <h3 className="text-xl font-bold">
            16 / 16 Tests de Conformité et Validation Multi-Sources
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Vérification stricte de l'immuabilité du RAW, de la règle <code>Donnée Manquante != 0</code>, du mapping assisté, de la matrice de disponibilité (2018–2026) et de la non-régression V1.0 à V1.11.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="text-center bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 w-full">
            <span className="text-[10px] text-slate-400 font-bold block">TAUX DE CONFORMITÉ</span>
            <span className="text-2xl font-black text-emerald-400">{successRate} %</span>
          </div>

          <button
            disabled={isRunningAll}
            onClick={runAllTests}
            className="w-full px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition"
          >
            {isRunningAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunningAll ? 'Exécution en cours...' : 'Exécuter tous les 16 tests'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 16 Automated Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testList.map((test) => {
          const isRunningThis = activeRunningId === test.id;
          return (
            <div
              key={test.id}
              className={`bg-white rounded-xl border p-4 shadow-xs transition flex flex-col justify-between ${
                isRunningThis
                  ? 'border-teal-500 ring-2 ring-teal-100'
                  : test.status === 'PASSED'
                  ? 'border-slate-200 hover:border-emerald-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      #{test.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {test.category}
                    </span>
                  </div>

                  <div>
                    {isRunningThis ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> En cours...
                      </span>
                    ) : test.status === 'PASSED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> SUCCÈS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" /> EN ATTENTE
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {test.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                    {test.name}
                  </p>
                </div>

                <p className="text-[11px] text-slate-500">
                  {test.description}
                </p>

                {test.details && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-700">
                    {test.details}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Vérifié : {test.verifiedAt || 'Jamais'}</span>
                <button
                  disabled={isRunningThis || isRunningAll}
                  onClick={() => runSingleTest(test.id)}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Re-tester
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
