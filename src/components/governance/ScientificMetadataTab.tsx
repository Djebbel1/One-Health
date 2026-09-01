import React, { useState } from 'react';
import {
  FileBadge,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  Calendar,
  MapPin,
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { CaseDefinitionMetadata } from '../../types';

interface ScientificMetadataTabProps {
  caseDefinitions: CaseDefinitionMetadata[];
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const ScientificMetadataTab: React.FC<ScientificMetadataTabProps> = ({
  caseDefinitions,
  onAddAuditLog
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseDefinitionMetadata>(caseDefinitions[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <FileBadge className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Définitions de Cas Opérationnelles & Métadonnées Scientifiques</h3>
            <p className="text-xs text-slate-500">
              Critères clinico-biologiques standardisés, seuils diagnostiques et détection des ruptures de comparabilité temporelle
            </p>
          </div>
        </div>
      </div>

      {/* Case Definitions Selector & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pathologies List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pathologies Ciblées One Health
          </h4>
          <div className="space-y-3">
            {caseDefinitions.map((cd) => {
              const isSelected = selectedCase.id === cd.id;
              return (
                <div
                  key={cd.id}
                  onClick={() => setSelectedCase(cd)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded">
                        {cd.id} (v{cd.version})
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">
                        {cd.pathology}
                      </h5>
                    </div>
                    {cd.comparabilityBreakNote && (
                      <span className="p-1 rounded bg-amber-100 text-amber-800" title="Rupture de comparabilité signalée">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-2">
                    {cd.confirmed}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Case Definition Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    {selectedCase.id}
                  </span>
                  <span className="text-xs font-bold bg-teal-700 text-white px-2.5 py-1 rounded">
                    Version {selectedCase.version}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-2">
                  Définition Clinico-Biologique : {selectedCase.pathology}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Adoptée le : {selectedCase.validFrom} | Validée par Direction Provinciale de la Santé
                </p>
              </div>
            </div>

            {/* Comparability Break Warning Banner */}
            {selectedCase.comparabilityBreakNote && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-xs sm:text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Rupture Méthodologique de Comparabilité Temporelle (V1.19)
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {selectedCase.comparabilityBreakNote}
                </p>
                <div className="text-xs text-amber-800 font-medium">
                  • Recommandation : Ne pas fusionner directement les séries chronologiques antérieures sans appliquer le facteur de correction diagnostique.
                </div>
              </div>
            )}

            {/* Suspect / Probable / Confirmed Levels */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-amber-800 flex items-center gap-1.5 uppercase text-xs">
                  • Cas Suspect :
                </span>
                <p className="text-slate-800">{selectedCase.suspect}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-indigo-800 flex items-center gap-1.5 uppercase text-xs">
                  • Cas Probable :
                </span>
                <p className="text-slate-800">{selectedCase.probable}</p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1 text-xs sm:text-sm">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 uppercase text-xs">
                  • Cas Confirmé :
                </span>
                <p className="text-emerald-950 font-medium">{selectedCase.confirmed}</p>
              </div>
            </div>

            {/* Lab Methods */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                Méthodes et Tests Biologiques Validés
              </h5>
              <div className="flex flex-wrap gap-2">
                {selectedCase.labMethods.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 font-semibold text-xs"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
