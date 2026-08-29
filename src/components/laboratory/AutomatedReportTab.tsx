import React from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { ScientificAnalysisProject, ScientificAnalysisReportDocument } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

interface Props {
  activeAnalysis: ScientificAnalysisProject;
}

export const AutomatedReportTab: React.FC<Props> = ({ activeAnalysis }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const report: ScientificAnalysisReportDocument =
    activeAnalysis.reportDocument || engine.generateAutomatedReport(activeAnalysis);

  const handlePrint = () => {
    window.print();
  };

  const handleExportMarkdown = () => {
    let md = `# ${report.analysisTitle}\n\n`;
    md += `**Auteur :** ${report.author}\n`;
    md += `**Date de génération :** ${report.generatedDate}\n`;
    md += `**Avertissement :** ${report.scientificCaveat}\n\n---\n\n`;

    report.sections.forEach(sec => {
      md += `## ${sec.title}\n\n${sec.content}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeAnalysis.code}_RAPPORT_SCIENTIFIQUE.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Rapport Scientifique Complet (17 Sections V1.14)
          </div>
          <h3 className="text-lg font-bold text-slate-900">{report.analysisTitle}</h3>
          <p className="text-xs text-slate-500">
            Auteur : {report.author} | Généré le {report.generatedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF
          </button>
          <button
            onClick={handleExportMarkdown}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exporter (Markdown)
          </button>
        </div>
      </div>

      {/* Scientific Caveat Warning */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-amber-950 mb-0.5">Mise en garde scientifique :</strong>
          <p>{report.scientificCaveat}</p>
        </div>
      </div>

      {/* 17 Structured Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 text-slate-800">
        {report.sections.map(sec => (
          <div key={sec.sectionNum} className="space-y-2 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-mono">
                {sec.sectionNum}
              </span>
              {sec.title.replace(/^\d+\.\s*/, '')}
            </h4>
            <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pl-8">
              {sec.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
