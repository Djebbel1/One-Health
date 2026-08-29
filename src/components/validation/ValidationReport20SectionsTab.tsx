import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  BookOpen,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface ValidationReport20SectionsTabProps {
  project: ScientificValidationProject;
}

export const ValidationReport20SectionsTab: React.FC<ValidationReport20SectionsTabProps> = ({ project }) => {
  const { reportDocument } = project;
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<number>(1);

  const handleCopyMarkdown = () => {
    if (!reportDocument) return;
    const fullMarkdown = `# ${reportDocument.title}
Code: ${reportDocument.reportCode} | Date: ${reportDocument.generationDate}

${reportDocument.sections.map((s) => `## ${s.sectionNumber}. ${s.sectionTitle}\n\n${s.contentMarkdown}`).join('\n\n')}
`;
    navigator.clipboard.writeText(fullMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!reportDocument) return;
    const fullMarkdown = `# ${reportDocument.title}\n\n${reportDocument.sections
      .map((s) => `## ${s.sectionNumber}. ${s.sectionTitle}\n\n${s.contentMarkdown}`)
      .join('\n\n')}`;
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapport_Validation_Scientifique_${project.code}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!reportDocument) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
        Rapport scientifique en cours de compilation.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header du rapport & Actions d export */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">{reportDocument.title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapport de validation scientifique structuré en 20 sections conformes aux standards de publication épidémiologique
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copié !' : 'Copier Markdown'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger (.MD)</span>
          </button>
        </div>
      </div>

      {/* 2. Vue à deux colonnes : Sommaire des 20 sections & Contenu détaillé */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Sommaire interactif (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2 max-h-[750px] overflow-y-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-2 pb-1 border-b border-slate-100">
            Sommaire des 20 Sections
          </span>
          <div className="space-y-1">
            {reportDocument.sections.map((s) => (
              <button
                key={s.sectionNumber}
                onClick={() => setActiveSectionId(s.sectionNumber)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                  activeSectionId === s.sectionNumber
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {String(s.sectionNumber).padStart(2, '0')}
                  </span>
                  <span className="truncate">{s.sectionTitle}</span>
                </div>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Colonne Contenu de la section active (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          {(() => {
            const currentSection = reportDocument.sections.find((s) => s.sectionNumber === activeSectionId) || reportDocument.sections[0];
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold font-mono text-xs flex items-center justify-center">
                      {currentSection.sectionNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{currentSection.sectionTitle}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    VALIDÉ
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {currentSection.contentMarkdown}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 text-xs">
                  <button
                    disabled={activeSectionId === 1}
                    onClick={() => setActiveSectionId((prev) => Math.max(1, prev - 1))}
                    className="text-slate-600 hover:text-slate-900 disabled:opacity-30"
                  >
                    &larr; Section précédente
                  </button>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Section {activeSectionId} sur 20
                  </span>
                  <button
                    disabled={activeSectionId === 20}
                    onClick={() => setActiveSectionId((prev) => Math.min(20, prev + 1))}
                    className="text-teal-700 hover:text-teal-900 font-bold disabled:opacity-30"
                  >
                    Section suivante &rarr;
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
