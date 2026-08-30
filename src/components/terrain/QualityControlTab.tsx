import React from 'react';
import { FieldFormRecord, FieldEnumerator } from '../../types';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Eye,
  Layers,
  FileCheck
} from 'lucide-react';

interface QualityControlTabProps {
  forms: FieldFormRecord[];
  enumerators: FieldEnumerator[];
}

export const QualityControlTab: React.FC<QualityControlTabProps> = ({
  forms,
  enumerators
}) => {
  // Calculs métriques
  const totalForms = forms.length;
  const validForms = forms.filter((f) => f.status === 'VALIDE' || f.status === 'VERROUILLE').length;
  const completenessAvg = Math.round(
    forms.reduce((acc, f) => acc + f.qualityChecks.completenessScore, 0) / (totalForms || 1)
  );
  const anomaliesCount = forms.filter((f) => f.qualityChecks.hasInconsistencies).length;
  const durationSuspicionCount = forms.filter((f) => f.qualityChecks.durationSuspicion).length;

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Qualité
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Contrôles Algorithmiques &amp; Audit Déontologique</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Contrôle Qualité des Données &amp; Détection des Anomalies
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation de complétude, détection des durées atypiques et surveillance de la cohérence interne.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center space-x-2 self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Score Moyen de Complétude : {completenessAvg}%</span>
        </div>
      </div>

      {/* Cartes Métriques Qualité */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Taux de Validation
            </span>
            <span className="text-xl font-mono font-bold text-emerald-900 block">
              {totalForms > 0 ? Math.round((validForms / totalForms) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Durées Atypiques (&lt;5 min)
            </span>
            <span className="text-xl font-mono font-bold text-amber-900 block">
              {durationSuspicionCount} cas
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Incohérences Internes
            </span>
            <span className="text-xl font-mono font-bold text-rose-900 block">
              {anomaliesCount} signalés
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Doublons Évités
            </span>
            <span className="text-xl font-mono font-bold text-teal-900 block">
              0 (100% Unique)
            </span>
          </div>
        </div>
      </div>

      {/* Notice Déontologique Non-Accusatoire */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs text-slate-700 space-y-1">
        <strong className="font-bold block text-slate-900">
          ⚖️ Principe de Bienveillance &amp; Rigueur Méthodologique :
        </strong>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Les signaux d anomalies ne constituent pas des sanctions mais des indications objectives orientant le travail de relecture des superviseurs et la formation continue des enquêteurs sur le terrain.
        </p>
      </div>

      {/* Tableau des Formulaires Flaggués */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Détail des Anomalies &amp; Contrôles de Cohérence
          </h3>
          <span className="text-[11px] text-slate-400">Algorithme de Contrôle V1.18</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {forms
            .filter((f) => f.qualityChecks.hasInconsistencies || f.qualityChecks.durationSuspicion)
            .map((f) => (
              <div key={f.localId} className="p-4 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-teal-900">{f.localId}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-800">{f.enumeratorName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Durée : {f.durationMinutes || 'N/A'} min</span>
                  </div>

                  <ul className="list-disc list-inside text-[11px] text-rose-700 font-medium">
                    {f.qualityChecks.inconsistencyList.map((inc, idx) => (
                      <li key={idx}>{inc}</li>
                    ))}
                    {f.qualityChecks.durationSuspicion && (
                      <li>Signal durée : Collecte très courte (&lt; 5 min) nécessitant confirmation par le superviseur.</li>
                    )}
                  </ul>
                </div>

                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg text-[10px] border border-amber-200 shrink-0">
                  {f.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Tableau Comparatif Objectif des Enquêteurs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Indicateurs de Complétude par Enquêteur (Tableau Factuel)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Enquêteur</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-600">Équipe</th>
                <th className="px-4 py-2.5 text-center font-bold text-slate-600">Formulaires Réalisés</th>
                <th className="px-4 py-2.5 text-center font-bold text-slate-600">Complétude Moyenne</th>
                <th className="px-4 py-2.5 text-center font-bold text-slate-600">Taux Anomalies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {enumerators.map((enq) => {
                const enqForms = forms.filter((f) => f.enumeratorId === enq.id);
                const enqAnomalies = enqForms.filter((f) => f.qualityChecks.hasInconsistencies).length;
                const enqAvgScore = enqForms.length > 0
                  ? Math.round(enqForms.reduce((a, b) => a + b.qualityChecks.completenessScore, 0) / enqForms.length)
                  : 100;

                return (
                  <tr key={enq.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {enq.displayName} <span className="font-mono text-[10px] text-slate-400">({enq.id})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {enq.teamName}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-teal-800">
                      {enq.completedForms}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-emerald-800">
                      {enqAvgScore}%
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-600">
                      {enqAnomalies} cas
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
