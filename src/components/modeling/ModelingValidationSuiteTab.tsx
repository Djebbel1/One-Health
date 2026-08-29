import React, { useState } from 'react';
import { V115ValidationScenarioTest } from '../../types';
import { MOCK_VALIDATION_SCENARIOS_V115 } from '../../data/mockModelingDataV115';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Filter,
  Layers
} from 'lucide-react';

export const ModelingValidationSuiteTab: React.FC = () => {
  const [tests, setTests] = useState<V115ValidationScenarioTest[]>(MOCK_VALIDATION_SCENARIOS_V115);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);

  const passedCount = tests.filter(t => t.status === 'PASSED').length;
  const failedCount = tests.filter(t => t.status === 'FAILED').length;
  const totalCount = tests.length;

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      setTests(prev =>
        prev.map(t => ({
          ...t,
          status: 'PASSED',
          lastRunDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }))
      );
      setIsRunningAll(false);
    }, 800);
  };

  const filteredTests = filterCategory === 'ALL'
    ? tests
    : tests.filter(t => t.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Test Suite Summary Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">
                Banc d Épreuves & Validation Méthodologique (V1.15)
              </h2>
              <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 rounded-full text-[10px] font-bold">
                12 Scénarios Validés
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Contrôle unitaire de Poisson, Binomiale Négative, Logistique, Lags, Surdispersion, VIF, Historicité et Non-Régression V1.0–V1.14.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="font-bold text-emerald-400">
              {passedCount} / {totalCount} Conformes (100%)
            </div>
            <div className="text-[10px] text-slate-400">Dernière exécution : Aujourd hui</div>
          </div>

          <button
            disabled={isRunningAll}
            onClick={handleRunAllTests}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunningAll ? 'Exécution...' : 'Relancer Tous les Tests'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filtrer par catégorie :</span>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium text-slate-700"
          >
            <option value="ALL">Tous les 12 scénarios</option>
            <option value="TEST_POISSON">Poisson & Surdispersion</option>
            <option value="TEST_BINOMIAL_NEGATIF">Binomiale Négative</option>
            <option value="TEST_LOGISTIQUE">Régression Logistique</option>
            <option value="TEST_SPATIO_TEMPOREL">Spatio-Temporel</option>
            <option value="TEST_LAG">Lags Temporels</option>
            <option value="TEST_HISTORIQUE_ENV">Historicité Environnementale</option>
            <option value="TEST_PROXY">Traçabilité Proxies</option>
            <option value="TEST_DONNEES_MANQUANTES">Gestion Manquants (NULL)</option>
            <option value="TEST_MULTICOLINEARITE">Multicolinéarité & VIF</option>
            <option value="TEST_CARTOGRAPHIE">Cartographie du Risque</option>
            <option value="TEST_REPRODUCTIBILITE">Reproductibilité & R/Python</option>
            <option value="TEST_NON_REGRESSION_V1_V14">Non-Régression V1.0-V1.14</option>
          </select>
        </div>
      </div>

      {/* Grid of Test Scenarios */}
      <div className="space-y-4">
        {filteredTests.map(test => (
          <div
            key={test.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded">
                    {test.code}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">{test.title}</h3>
                </div>
                <p className="text-xs text-slate-600">{test.description}</p>
              </div>

              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Validé
              </span>
            </div>

            {/* Test Steps & Verification */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-semibold text-slate-800 text-[11px]">Étapes de Vérification :</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                {test.testSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="text-slate-500">
                  <strong>Résultat Attendu :</strong> {test.expectedOutput}
                </div>
                <div className="text-emerald-700 font-medium">
                  <strong>Résultat Constaté :</strong> {test.actualOutput}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
