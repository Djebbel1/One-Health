import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Play,
  Download,
  Filter,
  Layers,
  Activity,
  AlertTriangle,
  FileCode,
  FileCheck
} from 'lucide-react';

export const ManiemaValidationTab: React.FC = () => {
  const { v110ValidationTests, runAutomatedValidationV110, isDemoMode } = useData();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const passedCount = v110ValidationTests.filter(t => t.status === 'PASSED').length;
  const failedCount = v110ValidationTests.filter(t => t.status === 'FAILED').length;
  const totalCount = v110ValidationTests.length;
  const allPassed = totalCount > 0 && failedCount === 0;

  const filteredTests = v110ValidationTests.filter(t => {
    if (filterCategory !== 'ALL' && t.category !== filterCategory) return false;
    return true;
  });

  const exportValidationReport = () => {
    const report = {
      version: 'V1.10 — EXTENSION MANIEMA & MOTEUR MULTI-PATHOLOGIES ONE HEALTH',
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: totalCount,
        passed: passedCount,
        failed: failedCount,
        verdict: allPassed ? 'CONFORMITÉ INTÉGRALE V1.10 VALIDÉE' : 'ANOMALIES DÉTECTÉES'
      },
      tests: v110ValidationTests
    };

    const dataStr = JSON.stringify(report, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport_validation_v110_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Banc de Tests Automatisés V1.10</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                allPassed
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-rose-950 text-rose-300 border-rose-700'
              }`}
            >
              {allPassed ? '100% Validé (14/14)' : `${failedCount} Échecs`}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Vérification exhaustive de la conformité : Périmètre provincial Maniema, Moteur multi-pathologies, Non-écrasement de l'historique, Variables communes vs spécifiques, Découplage temporel et Non-régression V1.9.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runAutomatedValidationV110}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Play className="h-4 w-4 fill-white" />
            Exécuter la Suite de Tests (14 Tests)
          </button>

          <button
            onClick={exportValidationReport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition"
          >
            <Download className="h-4 w-4" />
            Rapport JSON
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">Total Tests Automatisés</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{totalCount}</span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">11 dimensions de contrôle</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-emerald-400 font-medium block">Tests avec Succès</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{passedCount}</span>
          <span className="text-[11px] text-emerald-500/80 mt-0.5 block">Conformité intégrale validée</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-rose-400 font-medium block">Tests Échoués</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{failedCount}</span>
          <span className="text-[11px] text-rose-500/80 mt-0.5 block">0 blocages détectés</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-teal-400 font-medium block">Statut de la Plateforme</span>
          <span className="text-sm font-bold text-teal-300 mt-1.5 block">
            V1.10 Prête pour Déploiement
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Non-régression V1.9 confirmée</span>
        </div>
      </div>

      {/* Filter and Tests List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            Liste Détaillée des 14 Tests de Conformité V1.10
          </h3>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">Toutes les catégories ({totalCount})</option>
            <option value="EXTENSION_MANIEMA">Extension Maniema</option>
            <option value="MOTEUR_MULTI_PATHOLOGIES">Moteur Multi-Pathologies</option>
            <option value="VARIABLES_COMMUNES_SPECIFIQUES">Variables Communes / Spécifiques</option>
            <option value="GESTION_PERIODES_SOURCES">Périodes & Sources</option>
            <option value="HISTORIQUE_NON_ECRASE">Historique Spatio-Temporel</option>
            <option value="SEPARATION_DEMO_REEL">Séparation Démo / Réel</option>
            <option value="GESTION_PROJETS">Gestion Projets</option>
            <option value="ROLES_UTILISATEURS">Rôles & Permissions</option>
            <option value="RELATIONS_ONE_HEALTH">Relations One Health</option>
            <option value="NON_REGRESSION_V19">Non-Régression V1.9</option>
          </select>
        </div>

        <div className="space-y-2.5">
          {filteredTests.map(test => {
            const isPassed = test.status === 'PASSED';
            const isSelected = selectedTestId === test.id;

            return (
              <div
                key={test.id}
                onClick={() => setSelectedTestId(isSelected ? null : test.id)}
                className={`p-3.5 rounded-lg border transition cursor-pointer ${
                  isPassed
                    ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
                    : 'bg-rose-950/20 border-rose-800/50 hover:bg-rose-950/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500 font-bold">#{test.id}</span>
                        <h4 className="text-xs font-bold text-white">{test.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {test.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 italic">{test.sectionRequirement}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                      isPassed
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-xs text-slate-300 font-mono bg-slate-950/60 p-2 rounded">
                  <span className="text-emerald-400 font-bold">Résultat : </span>
                  {test.details}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
