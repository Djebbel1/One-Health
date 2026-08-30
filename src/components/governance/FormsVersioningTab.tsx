import React, { useState } from 'react';
import {
  FileCode,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  Table,
  Plus,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { ProjectFormVersion, VariableMigrationRule } from '../../types';

interface FormsVersioningTabProps {
  forms: ProjectFormVersion[];
  onUpdateForm: (f: ProjectFormVersion) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const FormsVersioningTab: React.FC<FormsVersioningTabProps> = ({
  forms,
  onUpdateForm,
  onAddAuditLog
}) => {
  const [selectedForm, setSelectedForm] = useState<ProjectFormVersion>(forms[forms.length - 1] || forms[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <FileCode className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Versionnement des Formulaires & Matrice de Compatibilité</h3>
            <p className="text-xs text-slate-500">
              Liaison formulaires–protocoles, conservation des versions historiques et règles de migration de variables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-teal-50 text-teal-800 px-3 py-1.5 rounded-xl border border-teal-200 font-semibold">
            {forms.length} Versions Répertoriées
          </span>
        </div>
      </div>

      {/* Forms Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Forms Version List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Formulaires & Historique des Versions
          </h4>
          <div className="space-y-3">
            {forms.map((form) => {
              const isSelected = selectedForm.formId === form.formId;
              return (
                <div
                  key={form.formId}
                  onClick={() => setSelectedForm(form)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-teal-50/50 to-white border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {form.version}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          form.status === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {form.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                        {form.name}
                      </h5>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{form.questionsCount} questions</span>
                    <span>Date : {form.releaseDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-teal-900 text-teal-100 rounded-2xl border border-teal-800 text-xs space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              Principe de Préservation Rétroactive
            </p>
            <p className="text-teal-200 text-[11px]">
              La publication d une version V1.1 ne détruit ni ne modifie jamais les fiches collectées sous la version V1.0.
            </p>
          </div>
        </div>

        {/* Right: Detailed Form Inspection & Migration Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {selectedForm.formId}
                  </span>
                  <span className="text-xs font-bold bg-teal-700 text-white px-2.5 py-1 rounded-md">
                    {selectedForm.version}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {selectedForm.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Auteur : {selectedForm.author} | Déployé le : {selectedForm.releaseDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedForm.questionsCount} Variables associées
                </span>
              </div>
            </div>

            {/* Compatibility Matrix with Datasets */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                Matrice de Compatibilité avec les Types de Datasets
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  selectedForm.compatibleDatasetTypes.includes('RAW')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold">Dataset RAW</p>
                    <p className="text-[10px]">Ingestion directe 100%</p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  selectedForm.compatibleDatasetTypes.includes('CLEAN')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold">Dataset CLEAN</p>
                    <p className="text-[10px]">Harmonisé & Nettoyé</p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  selectedForm.compatibleDatasetTypes.includes('ANALYTIC')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {selectedForm.compatibleDatasetTypes.includes('ANALYTIC') ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <p className="font-bold">Dataset ANALYTIC</p>
                    <p className="text-[10px]">
                      {selectedForm.compatibleDatasetTypes.includes('ANALYTIC')
                        ? 'Matrice directe'
                        : 'Nécessite transformation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variable Migration Rules */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-teal-600" />
                Règles de Migration et Transformations Inter-Versions
              </h5>

              {selectedForm.migrationRules && selectedForm.migrationRules.length > 0 ? (
                <div className="space-y-2">
                  {selectedForm.migrationRules.map((rule, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border">
                            {rule.fromVariable}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                          <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {rule.toVariable}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                          {rule.transformationType}
                        </span>
                      </div>

                      <p className="text-slate-700">{rule.description}</p>
                      <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-600">
                        {rule.formulaOrRule}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs italic">
                  Aucune règle de migration requise pour cette version (version de référence ou schémas identiques).
                </div>
              )}
            </div>

            {/* ChangeLog */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Journal des Changements (ChangeLog)
              </h5>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {selectedForm.changeLog.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
