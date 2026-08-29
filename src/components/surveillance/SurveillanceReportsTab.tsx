import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_REPORT_17_SECTIONS
} from '../../data/mockSurveillanceDataV117';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const SurveillanceReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState<'HEBDOMADAIRE' | 'MENSUEL' | 'COMPLET_17_SECTIONS'>('COMPLET_17_SECTIONS');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    7: true,
    8: true,
    15: true,
    16: true,
    17: true
  });

  const report = MOCK_SURVEILLANCE_REPORT_17_SECTIONS;

  const toggleSection = (sectionNumber: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionNumber]: !prev[sectionNumber]
    }));
  };

  const handleExport = (format: 'CSV' | 'TXT' | 'EXCEL') => {
    setExportSuccess(`Le rapport de surveillance One Health (${format}) a été exporté avec succès.`);
    setTimeout(() => setExportSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête & Boutons d'Export */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Rapports Scientifiques de Surveillance One Health
            </h2>
            <p className="text-xs text-slate-500">
              Génération automatique des bilans périodiques conformes au standard officiel en 17 sections
            </p>
          </div>
        </div>

        {/* Format et Actions */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleExport('EXCEL')}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Excel</span>
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Données</span>
          </button>
          <button
            onClick={() => handleExport('TXT')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Version Texte</span>
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Sélecteur de Type de Rapport */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl w-max">
        <button
          onClick={() => setReportType('COMPLET_17_SECTIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'COMPLET_17_SECTIONS'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rapport Exhaustif One Health (17 Sections)
        </button>
        <button
          onClick={() => setReportType('HEBDOMADAIRE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'HEBDOMADAIRE'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bulletin Hebdomadaire S34
        </button>
        <button
          onClick={() => setReportType('MENSUEL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === 'MENSUEL'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bilan Mensuel Août 2026
        </button>
      </div>

      {/* Document de Rapport Structuré en 17 Sections */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8 max-w-4xl mx-auto text-slate-800">
        
        {/* En-tête Officiel du Rapport */}
        <div className="border-b border-slate-200 pb-6 text-center space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-teal-700 uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            RÉPUBLIQUE DÉMOCRATIQUE DU CONGO • PROVINCE DU MANIEMA
          </span>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            RAPPORT INTÉGRÉ DE SURVEILLANCE ÉPIDÉMIOLOGIQUE &amp; ONE HEALTH (V1.17)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Réf : {report.metadata.reportId} • Période : {report.metadata.periodCovered} • Territoire : {report.metadata.territory} • Généré le {report.metadata.generatedAt} par {report.metadata.authorName} ({report.metadata.authorRole})
          </p>
        </div>

        {/* Liste des 17 Sections */}
        <div className="space-y-4">
          {report.sections.map((sec) => {
            const isExpanded = expandedSections[sec.sectionNumber] !== false;
            return (
              <div
                key={sec.sectionNumber}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <div
                  onClick={() => toggleSection(sec.sectionNumber)}
                  className="p-4 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between border-b border-slate-200/60 select-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold font-mono">
                      {sec.sectionNumber}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">
                      {sec.title}
                    </h3>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white space-y-3 text-xs">
                    <p className="text-slate-700 leading-relaxed">
                      {sec.summary}
                    </p>

                    {sec.keyPoints && sec.keyPoints.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Points Clés &amp; Constatations :
                        </span>
                        <ul className="space-y-1 pl-4 list-disc text-slate-600">
                          {sec.keyPoints.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {sec.metrics && sec.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                        {sec.metrics.map((m, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-[10px] text-slate-400 block">{m.label}</span>
                            <span className="font-bold text-slate-800 font-mono">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.warnings && sec.warnings.length > 0 && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                        {sec.warnings.map((w, idx) => (
                          <p key={idx}>⚠️ {w}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Décharge & Avertissement Scientifique Final */}
        <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 leading-relaxed space-y-2 bg-slate-50 p-4 rounded-2xl">
          <strong className="text-slate-700 block">
            Cadre Déontologique &amp; Règle de Non-Substitution :
          </strong>
          <p>{report.cautiousConclusionNotice}</p>
        </div>

      </div>
    </div>
  );
};
