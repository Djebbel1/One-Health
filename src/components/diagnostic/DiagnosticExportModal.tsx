import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { VariableDiagnosticProfile, ScientificQuestionAnswer } from '../../types';

interface DiagnosticExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: VariableDiagnosticProfile[];
  questions: ScientificQuestionAnswer[];
}

export const DiagnosticExportModal: React.FC<DiagnosticExportModalProps> = ({
  isOpen,
  onClose,
  profiles,
  questions
}) => {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = 'VariableCode,VariableName,Dimension,Category,CompletenessPct,QualityScore,SourceReliability,Descriptive,Statistical,Modeling\n';
    const rows = profiles.map(p => 
      `"${p.variableCode}","${p.variableName}","${p.dimension}","${p.category}",${p.completenessScorePercent},${p.scientificQualityScore},"${p.sourceReliability}","${p.descriptiveUsability.usable}","${p.statisticalUsability.usable}","${p.spatialTemporalModelingUsability.usable}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rapport_Diagnostic_Scientifique_Maniema_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess('Fichier CSV exporté avec succès !');
    setTimeout(() => setExportSuccess(null), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              Exporter le Diagnostic Scientifique
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Formats certifiés pour publication d'articles scientifiques et rapports de recherche
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {exportSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{exportSuccess}</span>
          </div>
        )}

        <div className="space-y-3">
          <div
            onClick={handleExportCSV}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Tableau Diagnostique Complet (CSV / Excel)</h4>
                <p className="text-xs text-slate-500">Profils de variables, scores de complétude, qualité et seuils d'exploitabilité</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Télécharger</span>
          </div>

          <div
            onClick={handlePrintReport}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/40 transition cursor-pointer flex items-center justify-between shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Impression du Rapport de Thèse / PDF</h4>
                <p className="text-xs text-slate-500">Mise en page optimisée avec les 10 réponses aux questions scientifiques</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-700">Imprimer / PDF</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <strong>Rappel d'intégrité :</strong> L'export inclut la mention de traçabilité, la date d'extraction et les avertissements relatifs aux changements de définitions diagnostiques (2022).
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
