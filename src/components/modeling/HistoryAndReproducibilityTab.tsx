import React, { useState } from 'react';
import { ScientificModelingProject } from '../../types';
import {
  generateREquivalentScript,
  generatePythonEquivalentScript
} from '../../utils/statisticalModelingEngineV115';
import {
  History,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface HistoryAndReproducibilityTabProps {
  model: ScientificModelingProject;
}

export const HistoryAndReproducibilityTab: React.FC<HistoryAndReproducibilityTabProps> = ({ model }) => {
  const [activeCodeLang, setActiveCodeLang] = useState<'R' | 'PYTHON'>('R');
  const [copied, setCopied] = useState<boolean>(false);

  const rCode = generateREquivalentScript(model);
  const pythonCode = generatePythonEquivalentScript(model);
  const activeCode = activeCodeLang === 'R' ? rCode : pythonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const filename = `${model.code}_reproducibility.${activeCodeLang === 'R' ? 'R' : 'py'}`;
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Fiche de Reproduction Intégrale */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Fiche de Reproductibilité Scientifique Intégrale
              </h2>
              <p className="text-xs text-slate-500">
                Audit scellé des hyperparamètres, filtres d exclusion et spécification du modèle.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-800">
            {model.code}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">Origine des Données & Échantillon</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• <strong>Dataset Source :</strong> {model.sourceDatasetName} ({model.sourceDatasetCode})</li>
              <li>• <strong>Fenêtre Temporelle :</strong> {model.timeRange.startYear} – {model.timeRange.endYear} (Résolution {model.timeRange.temporalResolution})</li>
              <li>• <strong>Zones Incluses :</strong> {model.geographicScope.selectedZoneNames.join(', ')}</li>
              <li>• <strong>Comptage Total / Utilisé :</strong> {model.diagnostics.totalObsInitial} / {model.diagnostics.totalObsUsed} observations</li>
              <li>• <strong>Exclusions Justifiées :</strong> {model.diagnostics.totalObsExcluded} ({model.diagnostics.exclusionBreakdown[0]?.reason || 'NULL non convertis'})</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">Spécification Paramétrique</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• <strong>Famille & Lien :</strong> {model.modelType} (Lien {model.modelType === 'LOGISTIC' ? 'Logit' : 'Log'})</li>
              <li>• <strong>Variable Dépendante :</strong> {model.dependentVariableName} ({model.dependentVariableColumn})</li>
              <li>• <strong>Offset d Exposition :</strong> {model.offsetOption === 'POPULATION' ? 'log(population_at_risk)' : 'Aucun'}</li>
              <li>• <strong>Effets Spatiaux :</strong> {model.spatioTemporalConfig.spatialEffect}</li>
              <li>• <strong>Effets Temporels :</strong> {model.spatioTemporalConfig.temporalEffect}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Scripts de Reproductibilité R & Python */}
      <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-xs font-bold text-white">Scripts R & Python Équivalents Prêts à l Exécution</h3>
              <p className="text-[10px] text-slate-400">
                Génération dynamique pour vérification indépendante dans R Studio ou Jupyter Notebook.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setActiveCodeLang('R')}
                className={`px-3 py-1 rounded font-bold transition ${
                  activeCodeLang === 'R' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                R (MASS/glm)
              </button>
              <button
                onClick={() => setActiveCodeLang('PYTHON')}
                className={`px-3 py-1 rounded font-bold transition ${
                  activeCodeLang === 'PYTHON' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Python (statsmodels)
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Copier le code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownloadScript}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
              title="Télécharger le script"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto font-mono text-xs text-indigo-200 bg-slate-950/90 leading-relaxed max-h-96">
          <pre>{activeCode}</pre>
        </div>
      </div>
    </div>
  );
};
