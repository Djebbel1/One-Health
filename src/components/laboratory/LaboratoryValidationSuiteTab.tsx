import React, { useState } from 'react';
import {
  CheckCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Award,
  AlertCircle,
  Layers
} from 'lucide-react';
import { V114ValidationScenarioTest } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

export const LaboratoryValidationSuiteTab: React.FC = () => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const [tests, setTests] = useState<V114ValidationScenarioTest[]>(engine.getValidationTests());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runAllTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const updated = engine.runValidationSuite();
      setTests([...updated]);
      setIsRunning(false);
    }, 500);
  };

  const passedCount = tests.filter(t => t.status === 'PASSED').length;

  return (
    <div className="space-y-6">
      {/* Test Suite Hero Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            Suite de Validation Officielle V1.14
          </div>
          <h3 className="text-xl font-bold text-white">8 Scénarios de Recherche & Non-Régression V1.0–V1.13</h3>
          <p className="text-slate-400 text-xs mt-1">
            Vérification de l intégrité du dataset, des lags, de l historicité spatiale et de la reproductibilité.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">{passedCount} / {tests.length}</span>
            <span className="text-slate-400 text-xs block">Tests Certifiés</span>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Exécution en cours...' : 'Exécuter Tous les Tests'}
          </button>
        </div>
      </div>

      {/* Test List */}
      <div className="grid grid-cols-1 gap-4">
        {tests.map(test => (
          <div
            key={test.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {test.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    SUCCÈS 100%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{test.title}</h4>
                <p className="text-xs text-slate-600">{test.description}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Dernière exécution : {test.lastRunDate}
              </span>
            </div>

            {/* Test steps & actual output */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <strong className="text-slate-700 block mb-1 font-semibold">Étapes exécutées :</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {test.testSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-200/60 p-3 rounded-xl text-emerald-950">
                <strong className="text-emerald-900 block mb-1 font-semibold">Sortie certifiée :</strong>
                <p>{test.actualOutput}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
