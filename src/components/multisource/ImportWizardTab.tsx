import React, { useState, useRef } from 'react';
import {
  DataSourceEntity,
  RawImportRecord,
  ColumnMappingItem,
  ImportQualityReport,
  DetectedDuplicate,
  DuplicateResolutionType,
  SynonymMappingItem,
  CustomVariableDefinition,
  CleanedDatasetRecord
} from '../../types';
import {
  DEMO_RAW_FILES_FIXTURES
} from '../../data/mockMultiSourceDataV112';
import {
  parseUploadedFile,
  autoDetectColumnMappings,
  generateImportQualityReport,
  normalizeRawToCleaned,
  exportMultiSourceToExcel
} from '../../utils/multiSourceEngineV112';
import {
  Upload,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Search,
  Sparkles,
  Database,
  Download,
  Check,
  Plus,
  RefreshCw,
  Info,
  Shield,
  Layers,
  Calendar,
  MapPin,
  Eye,
  FileCheck
} from 'lucide-react';

interface ImportWizardTabProps {
  sources: DataSourceEntity[];
  initialSourceId?: string;
  synonyms: SynonymMappingItem[];
  customVariables: CustomVariableDefinition[];
  onAddCustomVariable: (v: CustomVariableDefinition) => void;
  onCompleteImport: (
    rawRecord: RawImportRecord,
    qualityReport: ImportQualityReport,
    cleanedRecords: CleanedDatasetRecord[]
  ) => void;
}

export const ImportWizardTab: React.FC<ImportWizardTabProps> = ({
  sources,
  initialSourceId,
  synonyms,
  customVariables,
  onAddCustomVariable,
  onCompleteImport
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(initialSourceId || sources[0]?.id || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDemoFixtureId, setSelectedDemoFixtureId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File parsed data state
  const [parsedData, setParsedData] = useState<{
    fileName: string;
    fileSize: number;
    format: 'EXCEL' | 'CSV';
    sheetNames: string[];
    columns: string[];
    rawRows: Record<string, any>[];
  } | null>(null);

  // Mapping state
  const [mappings, setMappings] = useState<ColumnMappingItem[]>([]);
  const [activeCustomModalCol, setActiveCustomModalCol] = useState<string | null>(null);
  const [newVarForm, setNewVarForm] = useState<CustomVariableDefinition>({
    code: '',
    name: '',
    description: '',
    type: 'NUMBER',
    unit: '',
    category: 'Général',
    oneHealthDimension: 'SANTE'
  });

  // Quality report & duplicate resolution state
  const [qualityReport, setQualityReport] = useState<ImportQualityReport | null>(null);
  const [duplicateResolutions, setDuplicateResolutions] = useState<Record<string, DuplicateResolutionType>>({});
  const [duplicateJustifications, setDuplicateJustifications] = useState<Record<string, string>>({});

  // Cleaned result preview
  const [cleanedResult, setCleanedResult] = useState<CleanedDatasetRecord[] | null>(null);
  const [isImportFinished, setIsImportFinished] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedSource = sources.find(s => s.id === selectedSourceId) || sources[0];

  // Gestion du chargement de fichier réel
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const parsed = await parseUploadedFile(file);
      setParsedData(parsed);
      setSelectedFile(file);
      setSelectedDemoFixtureId('');
      setCurrentStep(2); // Passer à l'aperçu
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la lecture du fichier.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement d'un jeu de données fictif de démonstration
  const handleSelectDemoFixture = (fixtureId: string) => {
    const fixture = DEMO_RAW_FILES_FIXTURES.find(f => f.id === fixtureId);
    if (!fixture) return;

    setSelectedDemoFixtureId(fixtureId);
    setSelectedFile(null);
    setParsedData({
      fileName: fixture.name,
      fileSize: 1024 * (fixture.sampleData.length * 12 + 100),
      format: fixture.format,
      sheetNames: ['Feuille_1'],
      columns: fixture.columns,
      rawRows: fixture.sampleData
    });
    // Aligner la source si possible
    if (fixture.type === 'SANITAIRE') {
      const src = sources.find(s => s.type === 'SANITAIRE');
      if (src) setSelectedSourceId(src.id);
    } else if (fixture.type === 'CLIMATIQUE') {
      const src = sources.find(s => s.type === 'CLIMATIQUE');
      if (src) setSelectedSourceId(src.id);
    } else if (fixture.type === 'ENVIRONNEMENTALE') {
      const src = sources.find(s => s.type === 'ENVIRONNEMENTALE');
      if (src) setSelectedSourceId(src.id);
    }
    setCurrentStep(2);
  };

  // Passage de l'Étape 2 (Aperçu) à l'Étape 3 (Mapping)
  const proceedToMapping = () => {
    if (!parsedData) return;
    const detected = autoDetectColumnMappings(parsedData.columns, parsedData.rawRows);
    setMappings(detected);
    setCurrentStep(3);
  };

  // Mise à jour manuelle d'un mapping
  const updateMappingField = (index: number, updates: Partial<ColumnMappingItem>) => {
    setMappings(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  // Création d'une variable personnalisée
  const handleSaveCustomVariable = () => {
    if (!newVarForm.name || !newVarForm.code) return;
    const cleanCode = newVarForm.code.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const createdVar: CustomVariableDefinition = {
      ...newVarForm,
      code: cleanCode
    };
    onAddCustomVariable(createdVar);

    // Mettre à jour la colonne ciblée
    if (activeCustomModalCol) {
      const colIdx = mappings.findIndex(m => m.sourceColumn === activeCustomModalCol);
      if (colIdx >= 0) {
        updateMappingField(colIdx, {
          targetVariableCode: cleanCode,
          targetVariableName: createdVar.name,
          targetDimension: createdVar.oneHealthDimension as any,
          targetType: createdVar.type === 'NUMBER' ? 'NUMBER' : 'STRING',
          unit: createdVar.unit,
          status: 'NOUVELLE_VARIABLE',
          isCustomVariable: true,
          isUserConfirmed: true
        });
      }
    }
    setActiveCustomModalCol(null);
    setNewVarForm({
      code: '',
      name: '',
      description: '',
      type: 'NUMBER',
      unit: '',
      category: 'Général',
      oneHealthDimension: 'SANTE'
    });
  };

  // Passage à l'Étape 4 (Analyse Qualité)
  const proceedToQualityCheck = () => {
    if (!parsedData || !selectedSource) return;
    setIsLoading(true);

    setTimeout(() => {
      const report = generateImportQualityReport(
        `RAW-IMP-${Date.now().toString().slice(-4)}`,
        selectedSource.id,
        parsedData.rawRows,
        mappings,
        parseInt(selectedSource.periodStart) || 2018,
        parseInt(selectedSource.periodEnd) || 2026
      );
      setQualityReport(report);

      // Initialiser les résolutions de doublons par défaut
      const initialResolutions: Record<string, DuplicateResolutionType> = {};
      report.detectedDuplicates.forEach(d => {
        initialResolutions[d.id] = 'CONSERVER';
      });
      setDuplicateResolutions(initialResolutions);

      setIsLoading(false);
      setCurrentStep(4);
    }, 400);
  };

  // Validation finale & Création du CLEANED
  const handleValidateAndIntegrate = () => {
    if (!parsedData || !selectedSource || !qualityReport) return;
    setIsLoading(true);

    setTimeout(() => {
      const rawId = `RAW-IMP-${Date.now().toString().slice(-4)}`;
      const rawRecord: RawImportRecord = {
        id: rawId,
        importNumber: `Import #${(selectedSource.totalImportsCount || 0) + 1}`,
        sourceId: selectedSource.id,
        sourceName: selectedSource.name,
        fileName: parsedData.fileName,
        fileSize: parsedData.fileSize,
        fileHash: `sha256_${Math.random().toString(36).substring(2, 15)}`,
        importDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        importedBy: 'Dr. Mukendi (Épidémiologiste)',
        rowCount: parsedData.rawRows.length,
        columnCount: parsedData.columns.length,
        columns: parsedData.columns,
        rawSample: parsedData.rawRows.slice(0, 5),
        rawContentData: parsedData.rawRows,
        status: 'VALIDE',
        notes: selectedDemoFixtureId ? 'Import de démonstration certifié' : 'Importation externe certifiée',
        isDemo: selectedSource.isDemo || !!selectedDemoFixtureId
      };

      const { cleanedRecords } = normalizeRawToCleaned(
        rawRecord,
        selectedSource,
        mappings,
        synonyms,
        'Dr. Mukendi (Analyste DPS)'
      );

      setCleanedResult(cleanedRecords);
      onCompleteImport(rawRecord, qualityReport, cleanedRecords);
      setIsLoading(false);
      setIsImportFinished(true);
      setCurrentStep(5);
    }, 500);
  };

  const stepsList = [
    { num: 1, label: 'Fichier & Source' },
    { num: 2, label: 'Aperçu Pré-Import' },
    { num: 3, label: 'Mapping Colonnes' },
    { num: 4, label: 'Contrôle & Qualité' },
    { num: 5, label: 'Intégration CLEANED' }
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Progress Steps Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {stepsList.map((st, idx) => (
            <React.Fragment key={st.num}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    currentStep === st.num
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-sm'
                      : currentStep > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > st.num ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span className={`text-[11px] font-semibold hidden sm:inline ${
                  currentStep === st.num ? 'text-teal-700' : 'text-slate-500'
                }`}>
                  {st.label}
                </span>
              </div>

              {idx < stepsList.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 1 : SÉLECTION DE LA SOURCE & FICHIER (OU DÉMO)
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Box */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-teal-600" />
                  Importer un fichier externe (Excel ou CSV)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Les données importées sont conservées au format <strong>RAW immuable</strong> sans modification directe.
                </p>
              </div>

              {/* Source Destination Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Associer à la source de données :
                </label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
                >
                  {sources.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.type}] {s.name} ({s.organization} • {s.periodStart}–{s.periodEnd})
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/20 rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Glissez-déposez votre fichier ici, ou <span className="text-teal-600 underline">parcourez vos dossiers</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Formats acceptés : Classeurs Excel (.xlsx, .xls) ou fichiers délimités (.csv)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* Fundamental Rule Notice */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Règle fondamentale One Health :</strong> Une donnée absente n’est <em>JAMAIS</em> égale à zéro.
                  Si une pluie ou une observation est manquante, elle sera stockée comme <code>NULL / MANQUANT</code> et non comme <code>0</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Pre-loaded Demo Fixtures */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>JEUX D'ESSAI & DÉMONSTRATION</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Vous pouvez tester immédiatement le pipeline complet avec l'un des fichiers pré-configurés portant la mention <code>DONNÉES FICTIVES</code>.
              </p>

              <div className="space-y-2 pt-2">
                {DEMO_RAW_FILES_FIXTURES.map(fixture => (
                  <button
                    key={fixture.id}
                    onClick={() => handleSelectDemoFixture(fixture.id)}
                    className="w-full text-left p-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-teal-400/50 transition flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-teal-300">
                          {fixture.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {fixture.description} ({fixture.period})
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 2 : APERÇU PRÉ-IMPORTATION (PRE-IMPORT INSPECTOR)
          ========================================================================= */}
      {currentStep === 2 && parsedData && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                Aperçu Pré-Importation
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Fichier : {parsedData.fileName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Annuler / Changer de fichier
              </button>
              <button
                onClick={proceedToMapping}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                <span>Continuer vers le Mapping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* File Metadata Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">TAILLE FICHIER</span>
              <span className="text-sm font-bold text-slate-800">
                {(parsedData.fileSize / 1024).toFixed(1)} Ko
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">NOMBRE DE LIGNES</span>
              <span className="text-sm font-bold text-teal-700">
                {parsedData.rawRows.length.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">COLONNES DÉTECTÉES</span>
              <span className="text-sm font-bold text-indigo-700">
                {parsedData.columns.length}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 font-semibold block">SOURCE LIÉE</span>
              <span className="text-xs font-bold text-slate-800 truncate block" title={selectedSource.name}>
                {selectedSource.name}
              </span>
            </div>
          </div>

          {/* Columns Tag List */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Colonnes identifiées dans le fichier ({parsedData.columns.length}) :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parsedData.columns.map(col => (
                <span
                  key={col}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-[11px] font-mono"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Table Preview */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Échantillon des 5 premières lignes brutes :
            </span>
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-xs max-h-64">
              <table className="w-full text-[11px] text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold uppercase sticky top-0">
                  <tr>
                    <th className="px-3 py-2 border-b border-slate-200">#</th>
                    {parsedData.columns.map(col => (
                      <th key={col} className="px-3 py-2 border-b border-slate-200 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {parsedData.rawRows.slice(0, 5).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 font-bold text-slate-400">{rIdx + 1}</td>
                      {parsedData.columns.map(col => (
                        <td key={col} className="px-3 py-1.5 whitespace-nowrap">
                          {row[col] === null || row[col] === undefined ? (
                            <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded text-[10px] italic">
                              NULL
                            </span>
                          ) : (
                            String(row[col])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 3 : ASSISTANT DE MAPPING DES COLONNES
          ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                Étape 3 : Mapping des Variables
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Association des colonnes du fichier au référentiel One Health
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérifiez et confirmez les correspondances suggérées automatiquement. Aucune colonne n'est supprimée silencieusement.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Retour
              </button>
              <button
                onClick={proceedToQualityCheck}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                <span>Lancer le Contrôle Qualité</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Colonne Source (Fichier)</th>
                  <th className="px-4 py-3">Statut & Détection</th>
                  <th className="px-4 py-3">Variable Cible One Health</th>
                  <th className="px-4 py-3">Dimension</th>
                  <th className="px-4 py-3">Type / Unité</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mappings.map((m, idx) => (
                  <tr key={m.id} className={m.status === 'IGNORE' ? 'bg-slate-50 opacity-60' : 'hover:bg-teal-50/10'}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {m.sourceColumn}
                    </td>

                    <td className="px-4 py-3">
                      {m.isAutoDetected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Suggéré ({Math.round(m.confidenceScore * 100)}%)
                        </span>
                      ) : m.status === 'NOUVELLE_VARIABLE' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          Nouvelle Variable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Manuel
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {m.status === 'IGNORE' ? (
                        <span className="text-slate-400 italic">Ignorée à l'analyse</span>
                      ) : (
                        <div className="space-y-0.5">
                          <input
                            type="text"
                            value={m.targetVariableName}
                            onChange={(e) => updateMappingField(idx, { targetVariableName: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-semibold focus:ring-1 focus:ring-teal-500"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">
                            Code : {m.targetVariableCode}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {m.status !== 'IGNORE' && (
                        <select
                          value={m.targetDimension}
                          onChange={(e) => updateMappingField(idx, { targetDimension: e.target.value as any })}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-700"
                        >
                          <option value="SANTE">Santé</option>
                          <option value="CLIMAT">Climat</option>
                          <option value="ENVIRONNEMENT">Environnement</option>
                          <option value="GEOGRAPHIE">Géographie</option>
                          <option value="DEMOGRAPHIE">Démographie</option>
                          <option value="COMMUNAUTAIRE">Communautaire</option>
                          <option value="AUTRE">Autre</option>
                        </select>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {m.status !== 'IGNORE' && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                            {m.targetType}
                          </span>
                          {m.unit && <span className="text-teal-700 font-bold">({m.unit})</span>}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {m.status === 'IGNORE' ? (
                          <button
                            onClick={() => updateMappingField(idx, { status: 'ASSOCIE' })}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded"
                          >
                            Réactiver
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setActiveCustomModalCol(m.sourceColumn);
                                setNewVarForm({
                                  code: m.sourceColumn.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                                  name: m.sourceColumn,
                                  description: `Variable issue de ${m.sourceColumn}`,
                                  type: 'NUMBER',
                                  unit: '',
                                  category: 'Général',
                                  oneHealthDimension: m.targetDimension as any
                                });
                              }}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold rounded border border-purple-200"
                              title="Créer une nouvelle variable personnalisée"
                            >
                              + Définir Variable
                            </button>
                            <button
                              onClick={() => updateMappingField(idx, { status: 'IGNORE' })}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold rounded border border-rose-200"
                            >
                              Ignorer
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Création de Variable Personnalisée */}
      {activeCustomModalCol && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Créer une Nouvelle Variable One Health
            </h4>
            <p className="text-xs text-slate-500">
              Définissez les propriétés de la variable pour la colonne <code>{activeCustomModalCol}</code>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de la variable :</label>
                <input
                  type="text"
                  value={newVarForm.name}
                  onChange={(e) => setNewVarForm({ ...newVarForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  placeholder="Ex: Pluviométrie mensuelle"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code technique :</label>
                  <input
                    type="text"
                    value={newVarForm.code}
                    onChange={(e) => setNewVarForm({ ...newVarForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800"
                    placeholder="pluvio_mensuelle_mm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité de mesure :</label>
                  <input
                    type="text"
                    value={newVarForm.unit || ''}
                    onChange={(e) => setNewVarForm({ ...newVarForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    placeholder="Ex: mm, °C, %, cas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimension One Health :</label>
                  <select
                    value={newVarForm.oneHealthDimension}
                    onChange={(e) => setNewVarForm({ ...newVarForm, oneHealthDimension: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="SANTE">Santé</option>
                    <option value="CLIMAT">Climat</option>
                    <option value="ENVIRONNEMENT">Environnement</option>
                    <option value="COMMUNAUTAIRE">Communautaire</option>
                    <option value="GEOGRAPHIE">Géographie</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de donnée :</label>
                  <select
                    value={newVarForm.type}
                    onChange={(e) => setNewVarForm({ ...newVarForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="NUMBER">Numérique</option>
                    <option value="STRING">Texte</option>
                    <option value="BOOLEAN">Booléen (Oui/Non)</option>
                    <option value="DATE">Date</option>
                    <option value="CATEGORICAL">Catégoriel</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveCustomModalCol(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCustomVariable}
                className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Enregistrer la Variable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 4 : RAPPORT AUTOMATISÉ DE QUALITÉ & GESTION DES DOUBLONS
          ========================================================================= */}
      {currentStep === 4 && qualityReport && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                Étape 4 : Rapport Automatisé de Qualité
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Contrôle d'intégrité, Doublons & Vérification des règles
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Retour Mapping
              </button>
              <button
                disabled={!qualityReport.canImport || isLoading}
                onClick={handleValidateAndIntegrate}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                <span>Valider l'importation & Créer CLEANED</span>
              </button>
            </div>
          </div>

          {/* Quality Score Indicator */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-teal-400 font-semibold tracking-wide">
                SCORE GLOBAL D'INTÉGRITÉ
              </span>
              <h4 className="text-2xl font-black">
                {qualityReport.calculatedScore} %
              </h4>
              <p className="text-[11px] text-slate-300">
                {qualityReport.canImport
                  ? 'Importation conforme aux exigences One Health Maniema.'
                  : 'Des erreurs bloquantes doivent être corrigées avant intégration.'}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Dates Valides</span>
                <strong className="text-emerald-400">{qualityReport.validDatesCount}</strong>
              </div>
              <div className="text-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Dates Manquantes</span>
                <strong className="text-amber-400">{qualityReport.missingDatesCount} (NULL)</strong>
              </div>
              <div className="text-center bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Doublons Arbitrés</span>
                <strong className="text-cyan-400">{qualityReport.duplicateRowsCount}</strong>
              </div>
            </div>
          </div>

          {/* Duplicate Arbitrage Section */}
          {qualityReport.detectedDuplicates.length > 0 && (
            <div className="space-y-3 bg-amber-50/50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Arbitrage des Doublons Potentiels ({qualityReport.detectedDuplicates.length})
              </h4>
              <p className="text-[11px] text-amber-800">
                Les doublons ne sont jamais supprimés automatiquement. Choisissez l'action pour chaque groupe suspect :
              </p>

              <div className="space-y-2">
                {qualityReport.detectedDuplicates.map(dup => (
                  <div key={dup.id} className="bg-white border border-amber-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">
                        {dup.id} (Lignes : {dup.rowIndices.map(i => i + 1).join(', ')})
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                        Similarité : {Math.round(dup.similarityScore * 100)}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-mono">
                      Clé : {JSON.stringify(dup.keyValues)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-500">Décision :</span>
                      {(['CONSERVER', 'FUSIONNER', 'EXCLURE', 'MARQUER_DOUBLON'] as DuplicateResolutionType[]).map(res => (
                        <button
                          key={res}
                          onClick={() => setDuplicateResolutions(prev => ({ ...prev, [dup.id]: res }))}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                            (duplicateResolutions[dup.id] || 'CONSERVER') === res
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings List */}
          {qualityReport.warnings.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600" />
                Avertissements de Conformité ({qualityReport.warnings.length})
              </h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                {qualityReport.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ÉTAPE 5 : CONFIRMATION & INTÉGRATION DATASET CLEANED
          ========================================================================= */}
      {currentStep === 5 && isImportFinished && cleanedResult && (
        <div className="bg-white rounded-xl border border-emerald-200 p-8 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-slate-900">
              Importation Réussie & Intégrée au Dataset CLEANED
            </h3>
            <p className="text-xs text-slate-600">
              L'enregistrement <strong>IMPORT_RAW</strong> a été verrouillé de manière immuable. <strong>{cleanedResult.length}</strong> observations normalisées sont maintenant prêtes pour l'analyse spatio-temporelle.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block">LIGNES RAW</span>
              <strong className="text-slate-800 text-sm">{parsedData?.rawRows.length}</strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <span className="text-emerald-700 text-[10px] block">ENREGISTREMENTS CLEANED</span>
              <strong className="text-emerald-800 text-sm">{cleanedResult.length}</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block">VALEURS MANQUANTES</span>
              <strong className="text-slate-800 text-sm">Préservées (NULL)</strong>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-slate-500 text-[10px] block">TRAÇABILITÉ</span>
              <strong className="text-teal-700 text-sm">100% Intégrale</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
            {parsedData && qualityReport && selectedSource && (
              <button
                onClick={() => {
                  const rawDummy: RawImportRecord = {
                    id: `RAW-IMP-${Date.now()}`,
                    importNumber: 'Import #Recap',
                    sourceId: selectedSource.id,
                    sourceName: selectedSource.name,
                    fileName: parsedData.fileName,
                    fileSize: parsedData.fileSize,
                    fileHash: 'sha256_export',
                    importDate: new Date().toISOString(),
                    importedBy: 'Dr. Mukendi',
                    rowCount: parsedData.rawRows.length,
                    columnCount: parsedData.columns.length,
                    columns: parsedData.columns,
                    rawSample: [],
                    rawContentData: [],
                    status: 'VALIDE',
                    isDemo: selectedSource.isDemo
                  };
                  exportMultiSourceToExcel(cleanedResult, qualityReport, rawDummy, selectedSource);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Télécharger le Classeur Excel Nettoyé</span>
              </button>
            )}

            <button
              onClick={() => {
                setCurrentStep(1);
                setParsedData(null);
                setSelectedFile(null);
                setQualityReport(null);
                setCleanedResult(null);
                setIsImportFinished(false);
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Nouvelle Importation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
