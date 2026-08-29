import React from 'react';
import { ScientificValidationProject } from '../../types';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  Percent,
  Sliders,
  Info
} from 'lucide-react';

interface CalibrationTabProps {
  project: ScientificValidationProject;
}

export const CalibrationTab: React.FC<CalibrationTabProps> = ({ project }) => {
  const { calibration } = project;

  return (
    <div className="space-y-6">
      {/* Présentation du rôle de la calibration */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <Scale className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Analyse de Calibration & Fiabilité Probabiliste (Observed vs Predicted)
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            La calibration évalue la concordance numérique entre les risques ou incidences prédits (ŷ) et les incidences réelles observées (y). Un modèle bien calibré affiche une pente proche de <strong>1.00</strong> et une ordonnée à l origine proche de <strong>0.00</strong>, sans sous-estimation ni sur-estimation systématique.
          </p>
        </div>
      </div>

      {/* 1. Indicateurs clés de Calibration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1 text-center">
          <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
            Pente de Calibration (Slope)
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 block">
            {calibration.calibrationSlope.toFixed(3)}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Cible idéale = 1.000 (Adéquation parfaite)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1 text-center">
          <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
            Ordonnée à l Origine (Intercept)
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 block">
            {calibration.calibrationIntercept > 0 ? `+${calibration.calibrationIntercept.toFixed(2)}` : calibration.calibrationIntercept.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            Cible idéale = 0.00 (Biais nul)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1 text-center">
          <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
            Brier Score / ECE
          </span>
          <span className="text-2xl font-bold font-mono text-teal-700 block">
            {calibration.brierScore.toFixed(3)} / {calibration.ece.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium block">
            Erreur de calibration attendue
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-1 text-center">
          <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
            Qualité Globale
          </span>
          <span className="text-lg font-bold text-emerald-700 block mt-1">
            🟢 {calibration.calibrationQuality}
          </span>
          <span className="text-[10px] text-slate-400 block">
            Accord étroit
          </span>
        </div>
      </div>

      {/* 2. Visualisation Graphique & Déciles de Risque */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Courbe de Calibration par Déciles de Risque</span>
            </h3>
            <p className="text-xs text-slate-500">
              Concordance entre l incidence moyenne prédite et l incidence observée (par tranches de 10% d échantillon)
            </p>
          </div>
        </div>

        {/* Visualisation en barres superposées / déciles */}
        <div className="space-y-3 pt-2">
          {calibration.bins.map((bin) => {
            const maxVal = 130;
            const predPct = Math.min(100, (bin.predictedRiskMean / maxVal) * 100);
            const obsPct = Math.min(100, (bin.observedRiskMean / maxVal) * 100);

            return (
              <div key={bin.decile} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Décile #{bin.decile}</span>
                  <div className="flex items-center space-x-3 font-mono text-[11px]">
                    <span className="text-teal-700 font-bold">
                      Prédit : {bin.predictedRiskMean.toFixed(1)} cas/1000
                    </span>
                    <span className="text-slate-800">
                      Observé : {bin.observedRiskMean.toFixed(1)} cas/1000
                    </span>
                    <span
                      className={`font-bold ${
                        Math.abs(bin.residualGap) <= 1.0
                          ? 'text-emerald-700'
                          : bin.residualGap > 0
                          ? 'text-amber-700'
                          : 'text-indigo-700'
                      }`}
                    >
                      Écart : {bin.residualGap > 0 ? `+${bin.residualGap.toFixed(1)}` : bin.residualGap.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden relative">
                  {/* Prédit */}
                  <div
                    className="h-full bg-teal-500/50 absolute left-0 top-0 rounded-full"
                    style={{ width: `${predPct}%` }}
                  />
                  {/* Observé (curseur) */}
                  <div
                    className="h-full w-2 bg-slate-900 absolute top-0 -ml-1 rounded-sm shadow"
                    style={{ left: `${obsPct}%` }}
                    title={`Observé : ${bin.observedRiskMean}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
          <strong>Note d interprétation :</strong> {calibration.interpretationNote}
        </div>
      </div>

      {/* 3. Tableau détaillé des déciles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Tableau Numérique des Déciles de Calibration
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Décile</th>
                <th className="p-3 font-bold">Observations</th>
                <th className="p-3 font-bold">Incidence Prédite Moyenne</th>
                <th className="p-3 font-bold">Incidence Observée Moyenne</th>
                <th className="p-3 font-bold">Écart Résiduel</th>
                <th className="p-3 font-bold">Concordance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {calibration.bins.map((bin) => (
                <tr key={bin.decile}>
                  <td className="p-3 font-sans font-bold text-slate-900">Décile {bin.decile}</td>
                  <td className="p-3">{bin.sampleCount}</td>
                  <td className="p-3 font-bold text-teal-700">{bin.predictedRiskMean.toFixed(1)}</td>
                  <td className="p-3 font-bold text-slate-900">{bin.observedRiskMean.toFixed(1)}</td>
                  <td className="p-3">
                    <span className={bin.residualGap >= 0 ? 'text-amber-700' : 'text-indigo-700'}>
                      {bin.residualGap > 0 ? `+${bin.residualGap.toFixed(1)}` : bin.residualGap.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    {Math.abs(bin.residualGap) <= 1.0 ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Étroite
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Modérée
                      </span>
                    )}
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
