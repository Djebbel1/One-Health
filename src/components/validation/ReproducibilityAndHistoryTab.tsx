import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Code,
  Download,
  Copy,
  Check,
  History,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  FileCode
} from 'lucide-react';

interface ReproducibilityAndHistoryTabProps {
  project: ScientificValidationProject;
}

export const ReproducibilityAndHistoryTab: React.FC<ReproducibilityAndHistoryTabProps> = ({ project }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'R' | 'PYTHON'>('R');
  const [copied, setCopied] = useState<boolean>(false);

  const activeScript = selectedLanguage === 'R' ? project.rValidationScript : project.pythonValidationScript;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = selectedLanguage === 'R' ? 'R' : 'py';
    const blob = new Blob([activeScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation_reproductible_${project.code}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer de Reproductibilité */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Reproductibilité Scientifique Intégrale (FAIR Data & Code)
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            Les scripts ci-dessous permettent à tout chercheur indépendant ou évaluateur de reproduire l intégralité des calculs de validation, des partitions train/test, des courbes de calibration et des métriques sans recourir à l interface utilisateur.
          </p>
        </div>
      </div>

      {/* 1. Générateur de Script Reproductible (R / Python) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header code */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-teal-400" />
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedLanguage('R')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedLanguage === 'R'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Script R (MASS / glm.nb)
              </button>
              <button
                onClick={() => setSelectedLanguage('PYTHON')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedLanguage === 'PYTHON'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Script Python (statsmodels)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger</span>
            </button>
          </div>
        </div>

        {/* Code viewer */}
        <div className="p-4 bg-slate-950 overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-xs text-teal-300 leading-relaxed">
            <code>{activeScript}</code>
          </pre>
        </div>
      </div>

      {/* 2. Historique & Journal d Audit des Validations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <History className="w-4 h-4 text-teal-600" />
          <span>Journal d Audit de Validation (Session & Antériorité)</span>
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900">{project.code} — {project.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {project.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Validé par : {project.validatorName} | Date : {project.validatedAt}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-teal-700">
              Score : {project.decomposedRobustnessScore.overallScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
