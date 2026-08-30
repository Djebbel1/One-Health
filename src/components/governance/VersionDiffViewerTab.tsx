import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  Edit,
  CheckCircle2,
  Layers,
  FileCode,
  Database,
  FileText
} from 'lucide-react';
import { GovernanceVersionDiff } from '../../types';

interface VersionDiffViewerTabProps {
  diffs: GovernanceVersionDiff[];
}

export const VersionDiffViewerTab: React.FC<VersionDiffViewerTabProps> = ({ diffs }) => {
  const [selectedDiff, setSelectedDiff] = useState<GovernanceVersionDiff>(diffs[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <GitCompare className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Comparateur Visuel de Différences (Diff Viewer)</h3>
            <p className="text-xs text-slate-500">
              Analyse comparative avant/après pour Datasets, Formulaires et Protocoles avec surlignage des ajouts, modifications et retraits
            </p>
          </div>
        </div>
      </div>

      {/* Select Diff Target & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Diff Selection */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Comparaisons de Versions Disponibles
          </h4>
          <div className="space-y-3">
            {diffs.map((d) => {
              const isSelected = selectedDiff.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDiff(d)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {d.targetType}
                        </span>
                        <span className="text-xs font-mono font-bold text-teal-800">
                          {d.versionA} ➔ {d.versionB}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                        {d.targetName}
                      </h5>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="text-emerald-700 font-bold">+{d.summary.addedCount} ajouts</span>
                    <span className="text-amber-700 font-bold">~{d.summary.modifiedCount} modifs</span>
                    <span className="text-rose-700 font-bold">-{d.summary.deletedCount} suppr</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comparative Diff Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-teal-800 text-white px-2.5 py-1 rounded">
                    {selectedDiff.targetType} : {selectedDiff.targetName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border">
                    {selectedDiff.versionA} ➔ {selectedDiff.versionB}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  Rapport Détaillé des Modifications
                </h4>
              </div>

              {/* Summary Badges */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                  +{selectedDiff.summary.addedCount} Ajouts
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs">
                  ~{selectedDiff.summary.modifiedCount} Modifiés
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs">
                  -{selectedDiff.summary.deletedCount} Supprimés
                </span>
              </div>
            </div>

            {/* Changes List */}
            <div className="space-y-3">
              {selectedDiff.changes.map((change, index) => {
                let badge = <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
                let cardStyle = 'bg-emerald-50/50 border-emerald-200 text-emerald-950';

                if (change.type === 'MODIFIED') {
                  badge = <Edit className="w-4 h-4 text-amber-600 shrink-0" />;
                  cardStyle = 'bg-amber-50/50 border-amber-200 text-amber-950';
                } else if (change.type === 'DELETED') {
                  badge = <MinusCircle className="w-4 h-4 text-rose-600 shrink-0" />;
                  cardStyle = 'bg-rose-50/50 border-rose-200 text-rose-950';
                }

                return (
                  <div key={index} className={`p-4 rounded-xl border space-y-2 text-xs ${cardStyle}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {badge}
                        <span className="font-mono font-bold">{change.fieldOrVariable}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-black/10">
                          {change.type}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                      <div className="p-2 bg-white/80 rounded border border-black/10">
                        <span className="text-slate-400 block font-mono text-[10px]">Ancienne Version ({selectedDiff.versionA}) :</span>
                        <span className="font-mono text-slate-700">{change.oldValue || '— (Inexistant)'}</span>
                      </div>
                      <div className="p-2 bg-white/80 rounded border border-black/10">
                        <span className="text-slate-400 block font-mono text-[10px]">Nouvelle Version ({selectedDiff.versionB}) :</span>
                        <span className="font-mono font-bold text-teal-800">{change.newValue || '— (Supprimé)'}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 italic pt-0.5">
                      Commentaire : {change.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
