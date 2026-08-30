import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RotateCcw,
  Calendar,
  Layers,
  Database,
  History,
  Activity,
  Award,
  HelpCircle,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ReportTab: React.FC = () => {
  const {
    v19ExploratoryReport,
    v19ValidationTests,
    v19TestStats,
    runAutomatedValidationV19,
    analysisLogs,
    selectedDatasetVersion
  } = useData();

  const [activeSection, setActiveSection] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<'REPORT' | 'CANDIDATES' | 'TESTS' | 'LOGS'>('REPORT');

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(v19ExploratoryReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `RAPPORT_EXPLORATOIRE_V19_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportSummaryText = () => {
    let content = `RAPPORT D'ANALYSE EXPLORATOIRE SPATIO-TEMPORELLE (V1.9) - ONE HEALTH MANIEMA\n`;
    content += `Généré le : ${v19ExploratoryReport.generated_at}\n`;
    content += `Jeu de données : ${v19ExploratoryReport.dataset_version}\n`;
    content += `Avertissement : ${v19ExploratoryReport.causality_disclaimer}\n\n`;
    content += `1. RÉSUMÉ EXÉCUTIF\n${v19ExploratoryReport.executive_summary}\n\n`;
    content += `2. DESCRIPTION DU JEU DE DONNÉES\n${v19ExploratoryReport.dataset_description}\n\n`;
    content += `3. TENDANCES TEMPORELLES\n${v19ExploratoryReport.temporal_trends}\n\n`;
    content += `4. DISTRIBUTION SPATIALE\n${v19ExploratoryReport.spatial_distribution}\n\n`;
    content += `5. PROFILS SAISONNIERS\n${v19ExploratoryReport.seasonal_patterns}\n\n`;
    content += `6. RELATIONS CLIMAT-MALADIES\n${v19ExploratoryReport.climate_disease_relations}\n\n`;
    content += `7. DÉCALAGES TEMPORELS\n${v19ExploratoryReport.lag_analysis}\n\n`;
    content += `8. CLUSTERS SPATIAUX\n${v19ExploratoryReport.spatial_clusters}\n\n`;
    content += `9. LIMITES ET BIAIS\n${v19ExploratoryReport.limitations_and_biases}\n\n`;
    content += `10. RECOMMANDATIONS POUR LA MODÉLISATION FUTURE\n${v19ExploratoryReport.recommendations_for_modeling}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAPPORT_EXPLORATOIRE_V19_SYNTHESE.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="exploration-report-tab">
      {/* Barre de navigation interne du rapport */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
          <button
            onClick={() => setActiveSubTab('REPORT')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'REPORT' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📑 Rapport en 10 Sections
          </button>
          <button
            onClick={() => setActiveSubTab('CANDIDATES')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'CANDIDATES' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎯 Variables Candidates (Modélisation Future)
          </button>
          <button
            onClick={() => setActiveSubTab('TESTS')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'TESTS' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧪 Tests Automatisés V1.9 ({v19TestStats.passed}/{v19ValidationTests.length})
          </button>
          <button
            onClick={() => setActiveSubTab('LOGS')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'LOGS' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Journal des Analyses ({analysisLogs.length})
          </button>
        </div>

        {/* Boutons d'exportation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummaryText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exporter Texte (.txt)
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exporter JSON (.json)
          </button>
        </div>
      </div>

      {/* 1. SOUS-ONGLET : RAPPORT EN 10 SECTIONS */}
      {activeSubTab === 'REPORT' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sommaire interactif */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1 h-fit">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Sommaire Structuré (Section 46)
            </h4>
            {[
              { id: 1, title: "1. Résumé exécutif" },
              { id: 2, title: "2. Description du jeu de données" },
              { id: 3, title: "3. Tendances temporelles observées" },
              { id: 4, title: "4. Distribution spatiale" },
              { id: 5, title: "5. Profils saisonniers" },
              { id: 6, title: "6. Relations climat-maladies" },
              { id: 7, title: "7. Décalages temporels optimaux" },
              { id: 8, title: "8. Clusters spatiaux exploratoires" },
              { id: 9, title: "9. Limites et biais identifiés" },
              { id: 10, title: "10. Recommandations modélisation" },
            ].map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === sec.id
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Corps de la section sélectionnée */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Rapport Automatique V1.9 • Section {activeSection}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-0.5">
                  {activeSection === 1 && "1. Résumé Exécutif & Synthèse Exploratoire"}
                  {activeSection === 2 && "2. Description Structurée du Jeu de Données"}
                  {activeSection === 3 && "3. Tendances Temporelles & Évolution Chronologique"}
                  {activeSection === 4 && "4. Distribution Spatiale par Aire de Santé"}
                  {activeSection === 5 && "5. Profils & Rythmes Saisonniers"}
                  {activeSection === 6 && "6. Relations Statistiques Climat - Pathologies"}
                  {activeSection === 7 && "7. Décalages Temporels Optimaux (Lags)"}
                  {activeSection === 8 && "8. Analyse Exploratoire des Concentrations Spatiales"}
                  {activeSection === 9 && "9. Limites Méthodologiques, Biais & Incertitudes"}
                  {activeSection === 10 && "10. Recommandations pour la Modélisation Future"}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 px-3 py-1 bg-slate-800 rounded-lg border border-slate-700">
                Généré le {v19ExploratoryReport.generated_at.split('T')[0]}
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300">
              <p className="whitespace-pre-line">
                {activeSection === 1 && v19ExploratoryReport.executive_summary}
                {activeSection === 2 && v19ExploratoryReport.dataset_description}
                {activeSection === 3 && v19ExploratoryReport.temporal_trends}
                {activeSection === 4 && v19ExploratoryReport.spatial_distribution}
                {activeSection === 5 && v19ExploratoryReport.seasonal_patterns}
                {activeSection === 6 && v19ExploratoryReport.climate_disease_relations}
                {activeSection === 7 && v19ExploratoryReport.lag_analysis}
                {activeSection === 8 && v19ExploratoryReport.spatial_clusters}
                {activeSection === 9 && v19ExploratoryReport.limitations_and_biases}
                {activeSection === 10 && v19ExploratoryReport.recommendations_for_modeling}
              </p>
            </div>

            {/* Avertissement de bas de page de rapport */}
            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Avertissement permanent :</strong> {v19ExploratoryReport.causality_disclaimer}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. SOUS-ONGLET : VARIABLES CANDIDATES POUR LA MODÉLISATION */}
      {activeSubTab === 'CANDIDATES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <TargetIcon className="w-4 h-4 text-emerald-400" />
                Matrice des Variables Candidates pour la Modélisation Future
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Statut d'éligibilité pour les futures étapes de modélisation bayésienne et spatio-temporelle (Section 45).
              </p>
            </div>
            <span className="text-xs font-mono text-slate-300 px-3 py-1 bg-slate-800 rounded border border-slate-700">
              {v19ExploratoryReport.modeling_candidates.length} variables évaluées
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="p-3 font-semibold">Variable</th>
                  <th className="p-3 font-semibold">Rôle</th>
                  <th className="p-3 font-semibold text-center">Décalage suggéré</th>
                  <th className="p-3 font-semibold text-center">Forme</th>
                  <th className="p-3 font-semibold text-center">Statut d'éligibilité</th>
                  <th className="p-3 font-semibold">Justification scientifique & Précautions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {v19ExploratoryReport.modeling_candidates.map(cand => (
                  <tr key={cand.variable_name} className="hover:bg-slate-800/40">
                    <td className="p-3 font-sans font-bold text-slate-200">{cand.variable_name}</td>
                    <td className="p-3 font-sans text-slate-400">{cand.role}</td>
                    <td className="p-3 text-center text-slate-300">{cand.suggested_lag}</td>
                    <td className="p-3 text-center text-slate-300">{cand.suggested_form}</td>
                    <td className="p-3 text-center font-sans">
                      {cand.status === 'RECOMMENDED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          🟢 Recommandée
                        </span>
                      )}
                      {cand.status === 'WITH_CAUTION' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                          🟠 Avec précaution
                        </span>
                      )}
                      {cand.status === 'EXCLUDED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-950 text-red-300 border border-red-800">
                          🔴 À exclure
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-sans text-slate-400 text-[11px] leading-relaxed">
                      {cand.justification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SOUS-ONGLET : BANC DE TESTS AUTOMATISÉS V1.9 */}
      {activeSubTab === 'TESTS' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Banc de Tests Automatisés V1.9 (Sections 64 à 76) & Bilan Final (Section 80)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Vérification systématique de l'intégrité épistémique, de l'absence de fuite de données et du respect des contraintes scientifiques.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">
                  Succès : <strong className="text-emerald-400">{v19TestStats.passed}</strong> / {v19ValidationTests.length}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  {v19TestStats.verdict}
                </span>
              </div>
              <button
                onClick={runAutomatedValidationV19}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ré-exécuter les tests
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {v19ValidationTests.map(test => (
              <div
                key={test.test_id}
                className={`p-4 rounded-xl border transition-all ${
                  test.status === 'PASSED'
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-red-950/30 border-red-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {test.status === 'PASSED' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <strong className="text-xs font-semibold text-slate-200">
                      {test.test_name}
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {test.section_ref}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                  {test.details}
                </p>
                <div className="pl-6 pt-2 text-[10px] font-mono text-slate-500">
                  {test.test_id} • Exécuté le {test.executed_at.split('T')[1]?.slice(0, 8)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SOUS-ONGLET : JOURNAL DES ANALYSES (ANALYSIS_LOG) */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Journal des Analyses Réalisées (ANALYSIS_LOG)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Traçabilité rigoureuse de chaque exécution analytique pour assurer une reproductibilité scientifique absolue (Section 57).
              </p>
            </div>
            <span className="text-xs font-mono text-slate-300 px-3 py-1 bg-slate-800 rounded border border-slate-700">
              {analysisLogs.length} exécutions enregistrées
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700">
                  <th className="p-3 font-semibold">ID Analyse</th>
                  <th className="p-3 font-semibold">Type d'analyse</th>
                  <th className="p-3 font-semibold">Jeu de données</th>
                  <th className="p-3 font-semibold">Filtres & Périmètre</th>
                  <th className="p-3 font-semibold">Méthode</th>
                  <th className="p-3 font-semibold text-center">Obs. (N)</th>
                  <th className="p-3 font-semibold text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {analysisLogs.map(log => (
                  <tr key={log.analysis_id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-300 font-bold">{log.analysis_id}</td>
                    <td className="p-3 font-sans text-slate-200">{log.analysis_type}</td>
                    <td className="p-3 text-emerald-400">{log.dataset_version}</td>
                    <td className="p-3 font-sans text-slate-400 text-[11px]">{log.filters_summary}</td>
                    <td className="p-3 font-sans text-slate-300">{log.method}</td>
                    <td className="p-3 text-center text-slate-200">{log.observations_count}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {log.result_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const TargetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <circle cx="12" cy="12" r="6" strokeWidth="2" />
    <circle cx="12" cy="12" r="2" strokeWidth="2" />
  </svg>
);
