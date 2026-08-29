import React from 'react';
import { ScientificValidationProject } from '../../types';
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  Info,
  AlertTriangle
} from 'lucide-react';

interface SpatialValidationTabProps {
  project: ScientificValidationProject;
}

export const SpatialValidationTab: React.FC<SpatialValidationTabProps> = ({ project }) => {
  const { spatialValidationResult, spatialReliabilityZones } = project;

  return (
    <div className="space-y-6">
      {/* Disclaimer méthodologique */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Validation Spatiale Hors-Échantillon (Spatial Hold-Out)
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            Pour évaluer la capacité du modèle à généraliser à des territoires non observés lors de l entraînement, certaines zones géographiques sont réservées exclusivement pour le test. Le système empêche toute contamination ou fuite d information spatiale.
          </p>
        </div>
      </div>

      {/* 1. Résultat de la validation spatiale */}
      {spatialValidationResult ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Partition Spatiale & Performance Hors-Échantillon</span>
            </h3>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold font-mono">
              Test : {spatialValidationResult.testZoneNames.join(', ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zones d'entraînement */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Zones d Entraînement ({spatialValidationResult.trainObsCount} observations)
              </span>
              <div className="space-y-1.5">
                {spatialValidationResult.trainZoneNames.map((name, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{name}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex justify-between font-mono">
                <span>MAE Entraînement :</span>
                <span className="font-bold text-slate-900">{spatialValidationResult.trainMetrics.mae.toFixed(2)} cas/1000</span>
              </div>
            </div>

            {/* Zones de test */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                Zone de Test Hors-Échantillon ({spatialValidationResult.testObsCount} observations)
              </span>
              <div className="space-y-1.5">
                {spatialValidationResult.testZoneNames.map((name, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-teal-200 text-xs flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-bold text-teal-950">{name}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-teal-200 text-xs text-teal-900 flex justify-between font-mono">
                <span>MAE Test Spatial :</span>
                <span className="font-bold text-teal-800">{spatialValidationResult.testMetrics.mae.toFixed(2)} cas/1000</span>
              </div>
            </div>
          </div>

          {/* Test d'autocorrélation de Moran sur les résidus */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Test d Autocorrélation Spatiale Résiduelle (I de Moran)</span>
              </span>
              <span className="font-mono text-slate-700">
                I = <strong>{spatialValidationResult.moranIOnTestResiduals.toFixed(3)}</strong> (p = {spatialValidationResult.moranPValue.toFixed(3)})
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {spatialValidationResult.spatialGeneralizationNote}
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Aucune partition spatiale hold-out configurée pour cette validation.
        </div>
      )}

      {/* 2. Tableau de Fiabilité Spatiale par Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Fiabilité Spatiale par Zone de Santé (Maniema)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Attribution des niveaux de fiabilité : 🟢 Fiabilité Élevée | 🟠 Fiabilité Intermédiaire | 🔴 Fiabilité Faible
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Zone / Commune</th>
                <th className="p-3 font-bold">Observations</th>
                <th className="p-3 font-bold">Qualité Données</th>
                <th className="p-3 font-bold">Couverture</th>
                <th className="p-3 font-bold">Statut Proxy</th>
                <th className="p-3 font-bold">Erreur Locale (MAE)</th>
                <th className="p-3 font-bold">Incertitude</th>
                <th className="p-3 font-bold">Niveau de Fiabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {spatialReliabilityZones.map((z) => (
                <tr key={z.zoneId}>
                  <td className="p-3 font-bold text-slate-900">{z.zoneName}</td>
                  <td className="p-3 font-mono">{z.obsCount} mois</td>
                  <td className="p-3 font-bold font-mono text-emerald-700">Score {z.dataQualityRating}</td>
                  <td className="p-3 font-mono">{z.coveragePct}%</td>
                  <td className="p-3">
                    {z.isProxy ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 font-mono">
                        PROXY CLIMATIQUE
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Direct</span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-bold">{z.localMae.toFixed(2)}</td>
                  <td className="p-3 font-mono text-slate-600">±{z.uncertaintyMargin.toFixed(1)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        z.reliabilityTier === 'FIABILITE_ELEVEE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : z.reliabilityTier === 'FIABILITE_INTERMEDIAIRE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {z.reliabilityTier === 'FIABILITE_ELEVEE'
                        ? '🟢 Fiabilité Élevée'
                        : z.reliabilityTier === 'FIABILITE_INTERMEDIAIRE'
                        ? '🟠 Fiabilité Intermédiaire'
                        : '🔴 Fiabilité Faible'}{' '}
                      ({z.reliabilityScore}/100)
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
