import React from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Scale,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Info
} from 'lucide-react';

interface UncertaintyAndIntervalsTabProps {
  project: ScientificValidationProject;
}

export const UncertaintyAndIntervalsTab: React.FC<UncertaintyAndIntervalsTabProps> = ({ project }) => {
  const { validatedMapZones } = project;

  return (
    <div className="space-y-6">
      {/* 1. Distinction Épistémologique : IC vs IP */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-3 text-xs text-indigo-950">
        <div className="flex items-center space-x-2 font-bold text-indigo-900">
          <Scale className="w-5 h-5 text-indigo-700" />
          <span className="text-sm">
            Distinction Fondamentale : Intervalle de Confiance (IC 95%) vs Intervalle de Prédiction (IP 95%)
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
            <span className="font-bold text-indigo-900 block">Intervalle de Confiance (IC 95%)</span>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              Quantifie l incertitude liée à l estimation de <strong>l espérance mathématique ou incidence moyenne</strong> E(Y|X). Sa largeur diminue asymptotiquement avec la taille de l échantillon (n croissant).
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-indigo-100 space-y-1">
            <span className="font-bold text-indigo-900 block">Intervalle de Prédiction (IP 95%)</span>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              Quantifie la plage de variation d une <strong>observation individuelle future</strong> Y_(n+1). Il intègre la variance d estimation ET la variance résiduelle intrinsèque (sigma²). <strong>L IP est strictement plus large que l IC</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tableau Comparatif des Bandes d Incertitude par Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Comparaison des Intervalles Estimés par Zone Territoriale (Maniema)
          </h3>
          <p className="text-xs text-slate-500">
            Observations, estimations ponctuelles ŷ, bandes d incertitude moyenne (IC) et individuelle (IP)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Zone de Santé</th>
                <th className="p-3 font-bold">Incidence Observée</th>
                <th className="p-3 font-bold">Estimation Ponctuelle (ŷ)</th>
                <th className="p-3 font-bold">Intervalle Confiance (IC 95%)</th>
                <th className="p-3 font-bold">Intervalle Prédiction (IP 95%)</th>
                <th className="p-3 font-bold">Marge d Erreur (±)</th>
                <th className="p-3 font-bold">Statut Proxy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {validatedMapZones.map((zone) => (
                <tr key={zone.zoneId}>
                  <td className="p-3 font-sans font-bold text-slate-900">{zone.zoneName}</td>
                  <td className="p-3 font-bold">{zone.observedIncidence.toFixed(1)}</td>
                  <td className="p-3 font-bold text-teal-700">{zone.predictedIncidence.toFixed(1)}</td>
                  <td className="p-3 text-indigo-700 font-bold">
                    [{zone.confidenceInterval95[0].toFixed(1)} ; {zone.confidenceInterval95[1].toFixed(1)}]
                  </td>
                  <td className="p-3 text-slate-600">
                    [{zone.predictionInterval95[0].toFixed(1)} ; {zone.predictionInterval95[1].toFixed(1)}]
                  </td>
                  <td className="p-3 text-slate-900 font-bold">±{zone.uncertaintyMargin.toFixed(1)}</td>
                  <td className="p-3 font-sans">
                    {zone.isProxyHistorical ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                        {zone.proxyHistoricalLabel || 'PROXY'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Direct</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Décomposition des Sources d Incertitude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-900 block">1. Incertitude d Échantillonnage</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Liée à la taille finie des séries historiques (84 mois par zone). Minimisée par le couplage de 3 communes urbaines de Kindu (252 observations).
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-900 block">2. Incertitude Liée aux Proxies</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Pour les communes périphériques ou insulaires (ex: Alunguli), l interpolation climatique trans-rive élargit la marge d erreur de $\pm 7.2$ à $\pm 11.8$ cas/1000.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-900 block">3. Aléa Épidémique Résiduel</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Facteurs non mesurés (comportements humains nocturnes, ruptures de stocks d intrants CTA) captés dans la dispersion binomiale négative.
          </p>
        </div>
      </div>
    </div>
  );
};
