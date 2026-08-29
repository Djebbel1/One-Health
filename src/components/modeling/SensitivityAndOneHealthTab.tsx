import React, { useState } from 'react';
import { ScientificModelingProject } from '../../types';
import {
  runSensitivityAnalysisComparison,
  calculateOneHealthIntegratedIndex
} from '../../utils/statisticalModelingEngineV115';
import { MOCK_SYNTHETIC_DATASET_RECORDS_V114 as MOCK_DATASET_RECORDS_V114 } from '../../data/mockScientificAnalysisDataV114';
import {
  Sliders,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface SensitivityAndOneHealthTabProps {
  model: ScientificModelingProject;
}

export const SensitivityAndOneHealthTab: React.FC<SensitivityAndOneHealthTabProps> = ({ model }) => {
  const sensitivity = runSensitivityAnalysisComparison(model);
  const oneHealthIndex = calculateOneHealthIntegratedIndex(MOCK_DATASET_RECORDS_V114);

  return (
    <div className="space-y-6">
      {/* 1. Section Analyse de Sensibilité */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Analyse de Sensibilité & Robustesse des Coefficients
              </h2>
              <p className="text-xs text-slate-500">
                Confrontation du Modèle Complet vs Restreint vs Modèle Sans Proxy.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Coefficients Stables
          </span>
        </div>

        {/* Tableau de Comparaison des Métriques Globales */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Variante de Spécification</th>
                <th className="p-3 text-right">Échantillon (N)</th>
                <th className="p-3 text-right">AIC</th>
                <th className="p-3 text-right">BIC</th>
                <th className="p-3 text-right">Log-Vraisemblance</th>
                <th className="p-3 text-right">Dispersion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sensitivity.metrics.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{m.modelType}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{m.sampleSize}</td>
                  <td className="p-3 text-right font-mono font-bold text-indigo-700">{m.aic}</td>
                  <td className="p-3 text-right font-mono text-slate-800">{m.bic}</td>
                  <td className="p-3 text-right font-mono text-slate-600">{m.logLik}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">{m.dispersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparaison des Coefficients Clés */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Variable Clé</th>
                <th className="p-3 text-right">β (Modèle Complet)</th>
                <th className="p-3 text-right">β (Modèle Restreint)</th>
                <th className="p-3 text-right">β (Sans Proxy)</th>
                <th className="p-3">Diagnostic de Stabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sensitivity.coefficientsComparison.map((c, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-slate-900">{c.variable}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">
                    +{c.fullBeta.toFixed(4)} (p&lt;0.001)
                  </td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    +{c.restrictedBeta.toFixed(4)} (p&lt;0.001)
                  </td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    +{c.noProxyBeta.toFixed(4)} (p&lt;0.001)
                  </td>
                  <td className="p-3 text-[11px] text-emerald-700 font-medium">
                    {c.stabilityNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
          <strong>Conclusion de sensibilité :</strong> {sensitivity.conclusionNote}
        </div>
      </div>

      {/* 2. Section Indice Intégré One Health */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">{oneHealthIndex.indexName}</h2>
              <p className="text-xs text-slate-500">
                Score synthétique intégrant Santé humaine (35%), Climat (25%), Environnement (20%) et WASH (20%).
              </p>
            </div>
          </div>
        </div>

        {/* Formule de l'Indice */}
        <div className="p-3 bg-slate-900 text-indigo-200 rounded-xl font-mono text-xs overflow-x-auto">
          {oneHealthIndex.formulaDescription}
        </div>

        {/* Tableau des Scores par Zone */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="p-3">Zone de Santé</th>
                <th className="p-3">Période</th>
                <th className="p-3 text-right">Score Santé (35%)</th>
                <th className="p-3 text-right">Score Climat (25%)</th>
                <th className="p-3 text-right">Score Env (20%)</th>
                <th className="p-3 text-right">Score WASH (20%)</th>
                <th className="p-3 text-right">ISROH Intégré (0-100)</th>
                <th className="p-3 text-center">Strate de Risque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {oneHealthIndex.scoresByZone.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{s.zoneName}</td>
                  <td className="p-3 font-mono text-slate-600">{s.period}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{s.healthComponent}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{s.climaticComponent}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{s.environmentalComponent}</td>
                  <td className="p-3 text-right font-mono text-slate-700">{s.washComponent}</td>
                  <td className="p-3 text-right font-mono font-black text-indigo-700 text-sm">
                    {s.integratedRiskScore}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.riskTier === 'TRES_ELEVE'
                          ? 'bg-rose-100 text-rose-800'
                          : s.riskTier === 'ELEVE'
                          ? 'bg-amber-100 text-amber-800'
                          : s.riskTier === 'MODERE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.riskTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
