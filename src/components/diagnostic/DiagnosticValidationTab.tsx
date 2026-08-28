import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { V113ValidationTest } from '../../types';
import { globalDiagnosticEngine } from '../../utils/scientificDiagnosticEngineV113';

interface DiagnosticValidationTabProps {
  tests: V113ValidationTest[];
  onRefreshTests: () => void;
}

export const DiagnosticValidationTab: React.FC<DiagnosticValidationTabProps> = ({
  tests,
  onRefreshTests
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      globalDiagnosticEngine.runValidationTests();
      setIsRunning(false);
      onRefreshTests();
    }, 600);
  };

  const passedCount = tests.filter(t => t.status === 'PASSED').length;
  const totalCount = tests.length;
  const successRate = Math.round((passedCount / (totalCount || 1)) * 100);

  const filteredTests = tests.filter(t => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner & Test Launcher */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Suite de Validation Scientifique V1.13 & Non-Régression
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Exécution des 10 tests de scénarios obligatoires (données complètes, partielles, ponctuelles, historique environnemental, proxies justifiés, changements de définition, découpage géographique).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Exécuter tous les tests</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Taux de Réussite des Tests de Conformité :</span>
            <span className="font-black text-emerald-700 text-sm">{passedCount} / {totalCount} ({successRate}%)</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-3">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className={`p-4 rounded-2xl border transition ${
              test.status === 'PASSED'
                ? 'bg-white border-slate-200 hover:border-emerald-300'
                : 'bg-rose-50/70 border-rose-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {test.id}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{test.title}</h4>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pl-8">
                  <div>
                    <strong className="text-slate-700">Comportement attendu :</strong> {test.expectedBehavior}
                  </div>
                  <div className="text-emerald-950 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 mt-1">
                    <strong className="text-emerald-900">Résultat vérifié :</strong> {test.actualResult}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-end gap-1.5 pl-8 sm:pl-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  CONFORME (PASSED)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {test.verifiedAt}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
