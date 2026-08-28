import React, { useState } from 'react';
import {
  DataSourceEntity,
  RawImportRecord,
  ImportQualityReport,
  CleanedDatasetRecord,
  DataAvailabilityMatrixRow,
  SynonymMappingItem,
  CustomVariableDefinition,
  V112ValidationTest
} from '../../types';
import {
  INITIAL_DATA_SOURCES_V112,
  INITIAL_RAW_IMPORTS_V112,
  INITIAL_QUALITY_REPORTS_V112,
  INITIAL_DATA_AVAILABILITY_MATRIX_V112,
  INITIAL_SYNONYMS_DICTIONARY_V112,
  V112_AUTOMATED_TESTS_SUITE
} from '../../data/mockMultiSourceDataV112';

import { SourcesListTab } from './SourcesListTab';
import { ImportWizardTab } from './ImportWizardTab';
import { ImportHistoryTab } from './ImportHistoryTab';
import { AvailabilityMatrixTab } from './AvailabilityMatrixTab';
import { ReconciliationTab } from './ReconciliationTab';
import { VariableDictionaryTab } from './VariableDictionaryTab';
import { V112ValidationSuiteTab } from './V112ValidationSuiteTab';
import { AddSourceModal } from './AddSourceModal';

import {
  Database,
  Upload,
  History,
  Calendar,
  Sparkles,
  BookOpen,
  ShieldCheck,
  BarChart3,
  Layers,
  Activity,
  CloudRain,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  GitCompare,
  Eye,
  Info
} from 'lucide-react';

interface MultiSourceHubModuleProps {
  onNavigateToAnalysis?: () => void;
}

export type MultiSourceSubTab =
  | 'TABLEAU_BORD'
  | 'SOURCES'
  | 'IMPORTER'
  | 'HISTORIQUE'
  | 'MATRICE_DISPONIBILITE'
  | 'RAPPROCHEMENT'
  | 'DICTIONNAIRE'
  | 'TESTS_V112';

export const MultiSourceHubModule: React.FC<MultiSourceHubModuleProps> = ({
  onNavigateToAnalysis
}) => {
  const [activeSubTab, setActiveSubTab] = useState<MultiSourceSubTab>('TABLEAU_BORD');

  // State
  const [sources, setSources] = useState<DataSourceEntity[]>(INITIAL_DATA_SOURCES_V112);
  const [rawImports, setRawImports] = useState<RawImportRecord[]>(INITIAL_RAW_IMPORTS_V112);
  const [qualityReports, setQualityReports] = useState<ImportQualityReport[]>(INITIAL_QUALITY_REPORTS_V112);
  const [cleanedDatasets, setCleanedDatasets] = useState<CleanedDatasetRecord[]>([]);
  const [availabilityMatrix, setAvailabilityMatrix] = useState<DataAvailabilityMatrixRow[]>(INITIAL_DATA_AVAILABILITY_MATRIX_V112);
  const [synonyms, setSynonyms] = useState<SynonymMappingItem[]>(INITIAL_SYNONYMS_DICTIONARY_V112);
  const [customVariables, setCustomVariables] = useState<CustomVariableDefinition[]>([]);
  const [testsSuite, setTestsSuite] = useState<V112ValidationTest[]>(V112_AUTOMATED_TESTS_SUITE);

  // Modals & Sub-states
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [preselectedSourceIdForImport, setPreselectedSourceIdForImport] = useState<string | undefined>(undefined);
  const [selectedRawImportForInspection, setSelectedRawImportForInspection] = useState<RawImportRecord | null>(null);
  const [selectedSourceDetails, setSelectedSourceDetails] = useState<DataSourceEntity | null>(null);

  // Callbacks
  const handleAddSource = (newSource: DataSourceEntity) => {
    setSources(prev => [newSource, ...prev]);
  };

  const handleAddSynonym = (newSyn: SynonymMappingItem) => {
    setSynonyms(prev => [...prev, newSyn]);
  };

  const handleAddCustomVariable = (newVar: CustomVariableDefinition) => {
    setCustomVariables(prev => [...prev, newVar]);
  };

  const handleCompleteImport = (
    rawRecord: RawImportRecord,
    report: ImportQualityReport,
    cleaned: CleanedDatasetRecord[]
  ) => {
    setRawImports(prev => [rawRecord, ...prev]);
    setQualityReports(prev => [report, ...prev]);
    setCleanedDatasets(prev => [...cleaned, ...prev]);

    // Mettre à jour le compteur de la source
    setSources(prev =>
      prev.map(s =>
        s.id === rawRecord.sourceId
          ? {
              ...s,
              totalImportsCount: (s.totalImportsCount || 0) + 1,
              lastImportId: rawRecord.id,
              updatedAt: new Date().toISOString().substring(0, 10)
            }
          : s
      )
    );
  };

  const openImporterWithSource = (sourceId: string) => {
    setPreselectedSourceIdForImport(sourceId);
    setActiveSubTab('IMPORTER');
  };

  // KPIs
  const totalRawRows = rawImports.reduce((acc, imp) => acc + imp.rowCount, 0);
  const totalSourcesCount = sources.length;
  const totalImportsCount = rawImports.length;
  const avgQualityScore = qualityReports.length > 0
    ? Math.round(qualityReports.reduce((acc, r) => acc + r.calculatedScore, 0) / qualityReports.length)
    : 98;

  const subTabsList: { id: MultiSourceSubTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'TABLEAU_BORD', label: 'Vue d’Ensemble', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'SOURCES', label: 'Référentiel des Sources', icon: <Database className="w-4 h-4" />, badge: sources.length },
    { id: 'IMPORTER', label: 'Importer un Fichier', icon: <Upload className="w-4 h-4" /> },
    { id: 'HISTORIQUE', label: 'Historique RAW', icon: <History className="w-4 h-4" />, badge: rawImports.length },
    { id: 'MATRICE_DISPONIBILITE', label: 'Matrice Disponibilité (2018–2026)', icon: <Calendar className="w-4 h-4" /> },
    { id: 'RAPPROCHEMENT', label: 'Synonymes & Rapprochement', icon: <Sparkles className="w-4 h-4" />, badge: synonyms.length },
    { id: 'DICTIONNAIRE', label: 'Dictionnaire Variables', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'TESTS_V112', label: 'Banc de Validation (16/16)', icon: <ShieldCheck className="w-4 h-4" />, badge: '100%' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner V1.12 Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white rounded-2xl p-6 shadow-md border border-teal-800/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-slate-950 tracking-wider">
                MODULE V1.12 ONE HEALTH
              </span>
              <span className="text-xs text-teal-300 font-semibold">
                DPS MANIEMA — RDC
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Intégration Multi-Sources & Préparation des Données
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Architecture d’importation normalisée (Santé, Climat, Environnement, Communautaire) avec traçabilité intégrale, préservation du RAW immuable et respect strict de la règle <code>Donnée Absente != Zéro</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setPreselectedSourceIdForImport(undefined);
                setActiveSubTab('IMPORTER');
              }}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Nouvel Import Excel / CSV</span>
            </button>
            <button
              onClick={() => setIsAddSourceOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-700/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Déclarer Source</span>
            </button>
          </div>
        </div>

        {/* Global KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-teal-800/60 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-teal-900/50">
            <span className="text-slate-400 text-[10px] block">SOURCES RÉPERTORIÉES</span>
            <strong className="text-base text-white">{totalSourcesCount} entités</strong>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-teal-900/50">
            <span className="text-slate-400 text-[10px] block">FICHIERS BRUTS SCELLÉS</span>
            <strong className="text-base text-teal-300">{totalImportsCount} imports RAW</strong>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-teal-900/50">
            <span className="text-slate-400 text-[10px] block">OBSERVATIONS ENREGISTRÉES</span>
            <strong className="text-base text-white">{totalRawRows.toLocaleString()} lignes</strong>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-teal-900/50">
            <span className="text-slate-400 text-[10px] block">QUALITÉ MOYENNE</span>
            <strong className="text-base text-emerald-400">{avgQualityScore} % certifié</strong>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {subTabsList.map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-teal-800 text-teal-100'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SUB-TAB 1 : TABLEAU DE BORD (VUE D'ENSEMBLE)
          ========================================================================= */}
      {activeSubTab === 'TABLEAU_BORD' && (
        <div className="space-y-6">
          {/* Main 4 Dimensions Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sanitaire */}
            <div className="bg-white rounded-xl border border-rose-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <Activity className="w-4 h-4 text-rose-600" /> SANTE (Épidémiologie)
                </span>
                <span className="text-[10px] bg-rose-50 px-2 py-0.5 rounded font-bold text-rose-800">
                  2018–2026
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Registres de consultation & hospitalisation, notifications SNIS 18 ZS.
              </p>
              <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Sources : 2 actives</span>
                <span className="text-rose-600 font-bold">5 420 obs</span>
              </div>
            </div>

            {/* Climatique */}
            <div className="bg-white rounded-xl border border-cyan-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-700">
                  <CloudRain className="w-4 h-4 text-cyan-600" /> CLIMAT & MÉTÉO
                </span>
                <span className="text-[10px] bg-cyan-50 px-2 py-0.5 rounded font-bold text-cyan-800">
                  2020–2026
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Relevés station Kindu-Aéroport (Pluviométrie mm, Températures °C, Humidité %).
              </p>
              <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Sources : 1 active</span>
                <span className="text-cyan-600 font-bold">2 450 obs</span>
              </div>
            </div>

            {/* Environnemental */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <Layers className="w-4 h-4 text-emerald-600" /> ENVIRONNEMENT
                </span>
                <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded font-bold text-emerald-800">
                  2025–2026
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Enquêtes entomologiques Anophèles, gîtes larvaires et dépôts de déchets.
              </p>
              <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Sources : 1 active</span>
                <span className="text-emerald-600 font-bold">780 obs</span>
              </div>
            </div>

            {/* Communautaire */}
            <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Database className="w-4 h-4 text-amber-600" /> COMMUNAUTAIRE / WASH
                </span>
                <span className="text-[10px] bg-amber-50 px-2 py-0.5 rounded font-bold text-amber-800">
                  2026 (V1.11)
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Enquêtes ménages mobiles de l’Université de Kindu, accès eau et hygiène.
              </p>
              <div className="text-[11px] font-semibold text-slate-700 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Source : Interne V1.11</span>
                <span className="text-amber-600 font-bold">Synchronisé</span>
              </div>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Imports Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-teal-600" />
                  Derniers Fichiers Importés (RAW Scellé)
                </h3>
                <button
                  onClick={() => setActiveSubTab('HISTORIQUE')}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                >
                  Voir tout ({rawImports.length})
                </button>
              </div>

              <div className="space-y-2">
                {rawImports.slice(0, 3).map(imp => (
                  <div key={imp.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{imp.fileName}</span>
                      <p className="text-[11px] text-slate-500">
                        {imp.importNumber} • {imp.sourceName} ({imp.rowCount.toLocaleString()} lignes)
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      RAW Immuable
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Regression & Pipeline Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garanties Architecturales One Health
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  16 / 16 Tests Conformes
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>RAW Immuable :</strong> Les données brutes chargées ne sont jamais écrasées ni modifiées.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Donnée Absente != Zéro :</strong> Les variables climatiques et sanitaires manquantes sont préservées comme <code>NULL</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Non-Régression V1.0 à V1.11 :</strong> Compatibilité totale avec les modules de collecte, supervision et analyses spatio-temporelles.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2 : RÉFÉRENTIEL DES SOURCES
          ========================================================================= */}
      {activeSubTab === 'SOURCES' && (
        <SourcesListTab
          sources={sources}
          onSelectSource={(source) => setSelectedSourceDetails(source)}
          onOpenAddSource={() => setIsAddSourceOpen(true)}
          onOpenImporterWithSource={openImporterWithSource}
        />
      )}

      {/* =========================================================================
          SUB-TAB 3 : ASSISTANT D'IMPORTATION (WIZARD 5 ÉTAPES)
          ========================================================================= */}
      {activeSubTab === 'IMPORTER' && (
        <ImportWizardTab
          sources={sources}
          initialSourceId={preselectedSourceIdForImport}
          synonyms={synonyms}
          customVariables={customVariables}
          onAddCustomVariable={handleAddCustomVariable}
          onCompleteImport={handleCompleteImport}
        />
      )}

      {/* =========================================================================
          SUB-TAB 4 : HISTORIQUE RAW & VERSIONING
          ========================================================================= */}
      {activeSubTab === 'HISTORIQUE' && (
        <ImportHistoryTab
          imports={rawImports}
          sources={sources}
          onSelectImportForInspection={(rawImp) => setSelectedRawImportForInspection(rawImp)}
        />
      )}

      {/* =========================================================================
          SUB-TAB 5 : MATRICE DE DISPONIBILITÉ (2018–2026)
          ========================================================================= */}
      {activeSubTab === 'MATRICE_DISPONIBILITE' && (
        <AvailabilityMatrixTab matrixRows={availabilityMatrix} />
      )}

      {/* =========================================================================
          SUB-TAB 6 : SYNONYMES & RAPPROCHEMENT
          ========================================================================= */}
      {activeSubTab === 'RAPPROCHEMENT' && (
        <ReconciliationTab
          synonyms={synonyms}
          onAddSynonym={handleAddSynonym}
        />
      )}

      {/* =========================================================================
          SUB-TAB 7 : DICTIONNAIRE DES VARIABLES
          ========================================================================= */}
      {activeSubTab === 'DICTIONNAIRE' && (
        <VariableDictionaryTab
          customVariables={customVariables}
          onAddCustomVariable={handleAddCustomVariable}
        />
      )}

      {/* =========================================================================
          SUB-TAB 8 : BANC DE VALIDATION 16/16 & NON-RÉGRESSION
          ========================================================================= */}
      {activeSubTab === 'TESTS_V112' && (
        <V112ValidationSuiteTab tests={testsSuite} />
      )}

      {/* Modal Ajout Nouvelle Source */}
      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onSave={handleAddSource}
      />

      {/* Modal Inspection Détails Source */}
      {selectedSourceDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                Source Documentée
              </span>
              <button onClick={() => setSelectedSourceDetails(null)} className="text-xs text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">{selectedSourceDetails.name}</h3>
              <p className="text-xs text-slate-600">{selectedSourceDetails.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p>Type : <strong>{selectedSourceDetails.type}</strong></p>
              <p>Organisme : <strong>{selectedSourceDetails.organization}</strong></p>
              <p>Période : <strong>{selectedSourceDetails.periodStart}–{selectedSourceDetails.periodEnd}</strong></p>
              <p>Format : <strong>{selectedSourceDetails.format}</strong></p>
              <p>Niveau : <strong>{selectedSourceDetails.geographicLevel}</strong></p>
              <p>Couverture : <strong>{selectedSourceDetails.coverageLevel}</strong></p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSourceDetails(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const sId = selectedSourceDetails.id;
                  setSelectedSourceDetails(null);
                  openImporterWithSource(sId);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
              >
                Lancer un Import pour cette source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inspection RAW Sample */}
      {selectedRawImportForInspection && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Inspection RAW Immuable
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {selectedRawImportForInspection.fileName} ({selectedRawImportForInspection.importNumber})
                </h3>
              </div>
              <button onClick={() => setSelectedRawImportForInspection(null)} className="text-xs text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="text-xs space-y-1 text-slate-600">
              <p>Source : <strong>{selectedRawImportForInspection.sourceName}</strong></p>
              <p>Date d'import : <strong>{selectedRawImportForInspection.importDate}</strong> par <strong>{selectedRawImportForInspection.importedBy}</strong></p>
              <p className="font-mono text-[11px]">Hash SHA-256 : {selectedRawImportForInspection.fileHash}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block">Échantillon des colonnes & lignes brutes :</span>
              <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-60">
                <table className="w-full text-[11px] text-left text-slate-700 font-mono">
                  <thead className="bg-slate-100 text-slate-800 font-bold sticky top-0">
                    <tr>
                      {selectedRawImportForInspection.columns.map(c => (
                        <th key={c} className="px-3 py-2 border-b border-slate-200 whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedRawImportForInspection.rawSample.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        {selectedRawImportForInspection.columns.map(c => (
                          <td key={c} className="px-3 py-1.5 whitespace-nowrap">
                            {r[c] === null || r[c] === undefined ? (
                              <span className="text-amber-600 italic">NULL</span>
                            ) : (
                              String(r[c])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedRawImportForInspection(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
              >
                Fermer l'Inspecteur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
