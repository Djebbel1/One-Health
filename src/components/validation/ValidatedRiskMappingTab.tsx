import React, { useState } from 'react';
import { ScientificValidationProject, ValidatedRiskMapZone } from '../../types';
import {
  MapPin,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Compass,
  Activity,
  Sliders
} from 'lucide-react';

interface ValidatedRiskMappingTabProps {
  project: ScientificValidationProject;
}

export const ValidatedRiskMappingTab: React.FC<ValidatedRiskMappingTabProps> = ({ project }) => {
  const { validatedMapZones } = project;
  const [activeLayer, setActiveLayer] = useState<'RISQUE_SANITAIRE' | 'FIABILITE_ESTIMATION' | 'INCERTITUDE_MARGE' | 'CARTE_ERREURS'>('RISQUE_SANITAIRE');
  const [selectedHistoricalYear, setSelectedHistoricalYear] = useState<number>(2026);

  return (
    <div className="space-y-6">
      {/* 1. Avertissement de séparation stricte Risque vs Fiabilité */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-teal-950">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block text-[11px] text-teal-900">
            Séparation Sémantique Absolue : Risque Sanitaire vs Fiabilité de l Estimation
          </span>
          <p className="text-teal-800 leading-relaxed mt-0.5">
            Une zone peut présenter un <strong>Risque Sanitaire Très Élevé</strong> tout en bénéficiant d une <strong>Fiabilité d Estimation Élevée</strong> (données d observation complètes et directes). Inversement, un risque modéré prédit avec un proxy climatique sera classé en <strong>Fiabilité Intermédiaire ou Faible</strong>. Ces deux dimensions ne sont jamais fusionnées.
          </p>
        </div>
      </div>

      {/* 2. Barre de contrôle des couches cartographiques */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Couche Thématique Active</span>
            <span className="text-[11px] text-slate-500">Sélectionnez la dimension épidémiologique à projeter</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveLayer('RISQUE_SANITAIRE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeLayer === 'RISQUE_SANITAIRE'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Risque Sanitaire Prédit
          </button>
          <button
            onClick={() => setActiveLayer('FIABILITE_ESTIMATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeLayer === 'FIABILITE_ESTIMATION'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Fiabilité Spatiale
          </button>
          <button
            onClick={() => setActiveLayer('INCERTITUDE_MARGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeLayer === 'INCERTITUDE_MARGE'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Marge d Incertitude ($\pm$)
          </button>
          <button
            onClick={() => setActiveLayer('CARTE_ERREURS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeLayer === 'CARTE_ERREURS'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Erreurs ($Obs - Prédit$)
          </button>
        </div>

        {/* Sélecteur temporel historique */}
        <div className="flex items-center space-x-2 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-medium">État Historique :</span>
          <select
            value={selectedHistoricalYear}
            onChange={(e) => setSelectedHistoricalYear(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800 font-bold"
          >
            <option value={2026}>2026 (Post-réhabilitation environnementale)</option>
            <option value={2022}>2022 (Décharge active non contrôlée)</option>
          </select>
        </div>
      </div>

      {/* 3. Carte Interactive des Zones Territoriales Validées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {validatedMapZones.map((zone) => {
          // Déterminer la couleur selon la couche active
          let badgeColor = '';
          let primaryLabel = '';
          let secondaryDetail = '';

          if (activeLayer === 'RISQUE_SANITAIRE') {
            primaryLabel = `Risque : ${zone.sanitaryRiskTier.replace('_', ' ')}`;
            secondaryDetail = `Incidence prédite : ${zone.predictedIncidence.toFixed(1)} cas/1000`;
            badgeColor =
              zone.sanitaryRiskTier === 'TRES_ELEVE'
                ? 'bg-rose-500 text-white'
                : zone.sanitaryRiskTier === 'ELEVE'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-500 text-white';
          } else if (activeLayer === 'FIABILITE_ESTIMATION') {
            primaryLabel = zone.estimationReliabilityTier === 'FIABILITE_ELEVEE' ? '🟢 Fiabilité Élevée' : '🟠 Fiabilité Intermédiaire';
            secondaryDetail = zone.isProxyHistorical ? 'Présence d un proxy climatique' : 'Données directes et complètes';
            badgeColor =
              zone.estimationReliabilityTier === 'FIABILITE_ELEVEE'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white';
          } else if (activeLayer === 'INCERTITUDE_MARGE') {
            primaryLabel = `Incertitude : ±${zone.uncertaintyMargin.toFixed(1)} cas/1000`;
            secondaryDetail = `Bande IC95% : [${zone.confidenceInterval95[0]} - ${zone.confidenceInterval95[1]}]`;
            badgeColor = zone.uncertaintyMargin <= 8.0 ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white';
          } else {
            primaryLabel = `Erreur : ${zone.estimationError}`;
            secondaryDetail = `Écart résiduel : ${zone.residualGap > 0 ? `+${zone.residualGap.toFixed(1)}` : zone.residualGap.toFixed(1)} cas/1000`;
            badgeColor =
              zone.estimationError === 'CONFORME'
                ? 'bg-emerald-600 text-white'
                : zone.estimationError === 'SURESTIME'
                ? 'bg-indigo-600 text-white'
                : 'bg-rose-600 text-white';
          }

          return (
            <div
              key={zone.zoneId}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-500 transition"
            >
              {/* Header carte */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <h4 className="text-sm font-bold text-slate-900">{zone.zoneName}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Coord : {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                  </span>
                </div>
                {zone.isProxyHistorical && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 font-mono uppercase tracking-wider">
                    {zone.proxyHistoricalLabel || 'PROXY'}
                  </span>
                )}
              </div>

              {/* Badge thématique principal */}
              <div className={`p-3 rounded-xl ${badgeColor} text-center space-y-0.5 shadow-xs`}>
                <span className="font-bold text-xs block">{primaryLabel}</span>
                <span className="text-[11px] opacity-90 block">{secondaryDetail}</span>
              </div>

              {/* Détails épidémiologiques */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Observé (y) :</span>
                  <span className="font-bold font-mono text-slate-900">{zone.observedIncidence.toFixed(1)} cas/1000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Prédit (ŷ) :</span>
                  <span className="font-bold font-mono text-teal-700">{zone.predictedIncidence.toFixed(1)} cas/1000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Intervalle de Confiance :</span>
                  <span className="font-mono text-indigo-800 text-[11px]">
                    [{zone.confidenceInterval95[0]} ; {zone.confidenceInterval95[1]}]
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Intervalle de Prédiction :</span>
                  <span className="font-mono text-slate-600 text-[11px]">
                    [{zone.predictionInterval95[0]} ; {zone.predictionInterval95[1]}]
                  </span>
                </div>
              </div>

              {/* Contexte environnemental & historique */}
              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                <strong>Contexte {selectedHistoricalYear} :</strong>{' '}
                {selectedHistoricalYear === 2026
                  ? zone.environmentalStateText
                  : 'Site de décharge active à ciel ouvert (pression environnementale maximale).'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
