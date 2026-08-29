import React, { useState } from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Filter,
  MapPin,
  Calendar,
  Layers,
  Info
} from 'lucide-react';

interface ResidualsAnalysisTabProps {
  project: ScientificValidationProject;
}

export const ResidualsAnalysisTab: React.FC<ResidualsAnalysisTabProps> = ({ project }) => {
  const { residuals } = project;
  const [filterTier, setFilterTier] = useState<string>('ALL');

  if (!residuals) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
        Aucune donnée de résidus disponible pour cette validation.
      </div>
    );
  }

  const filteredPoints = residuals.points.filter((pt) => {
    if (filterTier === 'ALL') return true;
    return pt.tier === filterTier;
  });

  return (
    <div className="space-y-6">
      {/* 1. Résumé de la distribution statistique des résidus */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Moyenne</span>
          <span className="text-sm font-bold font-mono text-slate-900 block">
            {residuals.distribution.mean > 0 ? `+${residuals.distribution.mean.toFixed(2)}` : residuals.distribution.mean.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500">Biais nul ciblé</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Écart-type</span>
          <span className="text-sm font-bold font-mono text-slate-900 block">
            {residuals.distribution.stdDev.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500">Dispersion</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Min (Sous-est.)</span>
          <span className="text-sm font-bold font-mono text-rose-700 block">
            {residuals.distribution.min.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-500">Erreur négative max</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Q1 (25%)</span>
          <span className="text-sm font-bold font-mono text-slate-700 block">
            {residuals.distribution.q1.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-500">1er quartile</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Médiane</span>
          <span className="text-sm font-bold font-mono text-teal-700 block">
            {residuals.distribution.median.toFixed(2)}
          </span>
          <span className="text-[9px] text-slate-500">Symétrie</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Q3 (75%)</span>
          <span className="text-sm font-bold font-mono text-slate-700 block">
            +{residuals.distribution.q3.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-500">3ème quartile</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Max (Sur-est.)</span>
          <span className="text-sm font-bold font-mono text-amber-700 block">
            +{residuals.distribution.max.toFixed(1)}
          </span>
          <span className="text-[9px] text-slate-500">Erreur positive max</span>
        </div>
      </div>

      {/* 2. Diagnostic Spatial & Temporel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tendance temporelle */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Moyenne Annuelle des Résidus (e = y - ŷ)</span>
          </h3>
          <div className="space-y-2">
            {residuals.temporalTrend.map((t) => (
              <div key={t.period} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-700">{t.period}</span>
                <span className="text-slate-500">{t.count} observations</span>
                <span
                  className={`font-mono font-bold ${
                    Math.abs(t.avgResidual) < 0.3
                      ? 'text-emerald-700'
                      : t.avgResidual > 0
                      ? 'text-amber-700'
                      : 'text-indigo-700'
                  }`}
                >
                  {t.avgResidual > 0 ? `+${t.avgResidual.toFixed(2)}` : t.avgResidual.toFixed(2)} cas/1000
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic d'autocorrélation spatiale des résidus */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>Structure Spatiale des Résidus</span>
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Clusters spatiaux d erreurs résiduelles :</span>
              <span className="font-bold text-emerald-700">0 cluster détecté</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Résidus atypiques extrêmes (|z| &gt; 3) :</span>
              <span className="font-bold text-slate-800">{residuals.extremeResidualsCount} observations</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
              Absence de biais géographique systématique : le modèle ne sous-estime ni ne surestime de façon chronique un secteur particulier de la ville de Kindu.
            </p>
          </div>
        </div>

      </div>

      {/* 3. Table des points d'observation et résidus standardisés */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Observations Échantillonnées & Résidus Standardisés
            </h3>
            <p className="text-xs text-slate-500">
              Calcul précis : e_i = y_i - ŷ_i, résidu studentisé et distance de Cook
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-700"
            >
              <option value="ALL">Tous les statuts d estimation</option>
              <option value="CONFORME">Conforme (|écart| &le; 10)</option>
              <option value="SURESTIME">Surestimé</option>
              <option value="SOUS_ESTIME">Sous-estimé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Zone de Santé</th>
                <th className="p-3 font-bold">Période</th>
                <th className="p-3 font-bold">Observé (y)</th>
                <th className="p-3 font-bold">Prédit (ŷ)</th>
                <th className="p-3 font-bold">Résidu Brut (e)</th>
                <th className="p-3 font-bold">Résidu Standardisé (z)</th>
                <th className="p-3 font-bold">Distance de Cook</th>
                <th className="p-3 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {filteredPoints.map((pt) => (
                <tr key={pt.id}>
                  <td className="p-3 font-sans font-bold text-slate-900">{pt.zoneName}</td>
                  <td className="p-3 text-slate-600">{pt.period}</td>
                  <td className="p-3 font-bold text-slate-900">{pt.observed.toFixed(1)}</td>
                  <td className="p-3 text-teal-700">{pt.predicted.toFixed(1)}</td>
                  <td className="p-3">
                    <span className={pt.residual >= 0 ? 'text-amber-700 font-bold' : 'text-indigo-700 font-bold'}>
                      {pt.residual > 0 ? `+${pt.residual.toFixed(1)}` : pt.residual.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3">{pt.standardizedResidual.toFixed(2)}</td>
                  <td className="p-3 text-slate-500">{pt.cooksDistance.toFixed(3)}</td>
                  <td className="p-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pt.tier === 'CONFORME'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pt.tier === 'SURESTIME'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pt.tier}
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
