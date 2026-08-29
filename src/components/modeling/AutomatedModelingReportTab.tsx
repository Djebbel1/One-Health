import React, { useState } from 'react';
import { ScientificModelingProject } from '../../types';
import { generateAutomatedModelingReport20Sections } from '../../utils/statisticalModelingEngineV115';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface AutomatedModelingReportTabProps {
  model: ScientificModelingProject;
}

export const AutomatedModelingReportTab: React.FC<AutomatedModelingReportTabProps> = ({ model }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const reportDoc = generateAutomatedModelingReport20Sections(model);

  const handleCopyReportMarkdown = () => {
    let md = `# ${reportDoc.modelTitle} (${reportDoc.modelCode})\n`;
    md += `Auteur : ${reportDoc.author} | Date : ${reportDoc.generatedDate}\n\n`;
    reportDoc.sections.forEach(s => {
      md += `## Section ${s.sectionNum}. ${s.title}\n\n${s.content}\n\n`;
      if (s.tableData) {
        md += `| ${s.tableData.headers.join(' | ')} |\n`;
        md += `| ${s.tableData.headers.map(() => '---').join(' | ')} |\n`;
        s.tableData.rows.forEach(r => {
          md += `| ${r.join(' | ')} |\n`;
        });
        md += `\n`;
      }
    });
    md += `\n> **Avis Épistémologique :** ${reportDoc.formalScientificCaveat}\n`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${reportDoc.modelTitle} (${reportDoc.modelCode})\n\n`;
    reportDoc.sections.forEach(s => {
      md += `## Section ${s.sectionNum}. ${s.title}\n\n${s.content}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RAPPORT_SCIENTIFIQUE_${model.code}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Rapport Scientifique de Modélisation Automatisé (20 Sections)
            </h2>
            <p className="text-xs text-slate-500">
              Génération normalisée respectant les standards de publication épidémiologique One Health.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReportMarkdown}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            Copier Markdown
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4" />
            Télécharger .MD
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Document Complet des 20 Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-8 max-w-5xl mx-auto">
        {/* En-tête officiel */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
              RÉPUBLIQUE DÉMOCRATIQUE DU CONGO • PROVINCE DU MANIEMA
            </span>
            <span className="text-xs font-mono text-slate-500">{reportDoc.generatedDate}</span>
          </div>
          <h1 className="text-xl font-black text-slate-950">{reportDoc.modelTitle}</h1>
          <div className="text-xs text-slate-600 flex items-center gap-4 pt-1">
            <span><strong>Code d Étude :</strong> {reportDoc.modelCode}</span>
            <span><strong>Auteur :</strong> {reportDoc.author}</span>
          </div>
        </div>

        {/* 20 Sections */}
        <div className="space-y-6 text-xs text-slate-800 leading-relaxed divide-y divide-slate-100">
          {reportDoc.sections.map(sec => (
            <div key={sec.sectionNum} className="pt-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {sec.sectionNum}
                </span>
                {sec.title}
              </h3>

              <p className="text-slate-700 pl-7 text-xs">{sec.content}</p>

              {/* Tableau si présent */}
              {sec.tableData && (
                <div className="pl-7 pt-2 overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
                      <tr>
                        {sec.tableData.headers.map((h, i) => (
                          <th key={i} className="p-2 font-bold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {sec.tableData.rows.map((r, ri) => (
                        <tr key={ri} className="hover:bg-slate-50">
                          {r.map((cell, ci) => (
                            <td key={ci} className="p-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Boîte d'avertissement section */}
              {sec.caveatBox && (
                <div className="ml-7 p-2.5 bg-slate-50 border-l-4 border-indigo-600 text-[11px] text-slate-600 rounded-r">
                  {sec.caveatBox}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conclusion Prudente & Caveat Formel */}
        <div className="p-5 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Clause Épistémologique de Réserve Scientifique</span>
          </div>
          <p className="leading-relaxed">
            {reportDoc.formalScientificCaveat}
          </p>
          <p className="italic text-[11px] text-amber-900/90">
            {reportDoc.cautiousConclusionText}
          </p>
        </div>
      </div>
    </div>
  );
};
