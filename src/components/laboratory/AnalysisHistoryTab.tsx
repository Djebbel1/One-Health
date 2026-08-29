import React from 'react';
import {
  History,
  CheckCircle,
  Eye,
  RotateCcw,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ScientificAnalysisProject } from '../../types';

interface Props {
  analyses: ScientificAnalysisProject[];
  activeAnalysisId: string;
  onSelectAnalysis: (analysis: ScientificAnalysisProject) => void;
  onNewAnalysisClick: () => void;
}

export const AnalysisHistoryTab: React.FC<Props> = ({
  analyses,
  activeAnalysisId,
  onSelectAnalysis,
  onNewAnalysisClick
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Historique des Analyses & Reproductibilité</h3>
          <p className="text-xs text-slate-500 mt-1">
            Chaque analyse conserve son dataset, ses transformations, ses variables et ses paramètres d exécution.
          </p>
        </div>
        <button
          onClick={onNewAnalysisClick}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          + Nouvelle Analyse
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {analyses.map(analysis => {
          const isActive = analysis.id === activeAnalysisId;
          return (
            <div
              key={analysis.id}
              className={`p-5 rounded-2xl border-2 transition bg-white ${
                isActive
                  ? 'border-indigo-600 shadow-md bg-indigo-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {analysis.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {analysis.status}
                    </span>
                    {analysis.isDemoData && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                        FICTIVES / DÉMO
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{analysis.name}</h4>
                  <p className="text-xs text-slate-500">{analysis.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectAnalysis(analysis)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {isActive ? 'Analyse Active' : 'Charger l Analyse'}
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Pathologie(s)</span>
                  <strong className="text-slate-800 font-semibold">{analysis.targetPathologies.join(', ')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Période & Fréquence</span>
                  <strong className="text-slate-800 font-semibold">
                    {analysis.timeRange.startYear}–{analysis.timeRange.endYear} ({analysis.timeRange.temporalResolution})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Territoire</span>
                  <strong className="text-slate-800 font-semibold truncate block">
                    {analysis.geographicScope.selectedZoneNames.join(', ')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Auteur & Date</span>
                  <span className="text-slate-700 font-medium block truncate">
                    {analysis.author} ({analysis.createdAt})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
