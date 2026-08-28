import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Sparkles,
  Info,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ScientificValidationSuiteView: React.FC = () => {
  const { spatiotemporalValidationTests, runSpatiotemporalTests } = useData();

  const totalTests = spatiotemporalValidationTests.length;
  const passedTests = spatiotemporalValidationTests.filter(t => t.status === 'PASSED').length;
  const failedTests = spatiotemporalValidationTests.filter(t => t.status === 'FAILED').length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              Banc de Tests de Validation Méthodologique & Scientifique V1.7
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Exécution automatisée de la suite des 10 tests unitaires et d'intégration épidémiologique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Taux de Conformité</span>
            <span className="text-xl font-bold font-mono text-emerald-700">{passRate}% Réussi</span>
          </div>

          <button
            id="btn-run-validation-tests"
            onClick={runSpatiotemporalTests}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <RotateCw className="w-4 h-4" />
            <span>Réexécuter Tous les Tests</span>
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spatiotemporalValidationTests.map(test => {
          const isPassed = test.status === 'PASSED';

          return (
            <div
              key={test.id}
              className={`rounded-xl border p-5 shadow-xs transition flex flex-col justify-between space-y-3 ${
                isPassed
                  ? 'bg-white border-slate-200 hover:border-emerald-300'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                      REQ #{test.requirementNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                      {test.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPassed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SUCCÈS</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ÉCHEC</span>
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{test.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {test.description}
                </p>
              </div>

              {/* Diagnostic Output */}
              <div className={`p-3 rounded-lg text-xs font-mono leading-relaxed border ${
                isPassed
                  ? 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                  : 'bg-rose-100/50 border-rose-200 text-rose-950'
              }`}>
                {test.resultDetails}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
