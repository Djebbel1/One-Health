import React, { useState } from 'react';
import { ScientificModelingProject } from '../../types';
import {
  MapPin,
  Layers,
  Calendar,
  AlertTriangle,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface RiskMappingTabProps {
  model: ScientificModelingProject;
}

export const RiskMappingTab: React.FC<RiskMappingTabProps> = ({ model }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedZoneDetail, setSelectedZoneDetail] = useState<string | null>('ZS-ALUNGULI');

  // Données de cartographie tenant compte de l'historicité environnementale (ex: Kasuku 2022 vs 2026)
  const mapZones = [
    {
      id: 'ZS-KINDU',
      name: 'Kindu (Centre-Ville)',
      type: 'Zone Urbaine',
      lat: -2.95,
      lng: 25.92,
      riskTier2022: 'ELEVE' as const,
      riskTier2026: 'MODERE' as const,
      incidence2022: 245.2,
      incidence2026: 185.1,
      ci2022: [210.4, 280.0],
      ci2026: [162.4, 207.8],
      envStatus2022: 'Décharge Kasuku active, inondations de berge',
      envStatus2026: 'Décharge réhabilitée, assainissement renforcé',
      isProxy: false
    },
    {
      id: 'ZS-ALUNGULI',
      name: 'Alunguli (Rive Droite)',
      type: 'Zone Péri-Urbaine',
      lat: -2.94,
      lng: 25.95,
      riskTier2022: 'TRES_ELEVE' as const,
      riskTier2026: 'ELEVE' as const,
      incidence2022: 380.5,
      incidence2026: 253.8,
      ci2022: [320.1, 440.9],
      ci2026: [218.2, 289.4],
      envStatus2022: 'Bas-fonds marécageux non drainés, latrines précaires',
      envStatus2026: 'Drainage partiel, moustiquaires imprégnées distribuées',
      isProxy: false
    },
    {
      id: 'ZS-KASONGO',
      name: 'Kasongo (Sud Maniema)',
      type: 'Zone Rurale',
      lat: -4.43,
      lng: 26.66,
      riskTier2022: 'MODERE' as const,
      riskTier2026: 'FAIBLE' as const,
      incidence2022: 172.0,
      incidence2026: 110.4,
      ci2022: [135.0, 209.0],
      ci2026: [88.2, 132.6],
      envStatus2022: 'Station météo locale active (CHIRPS validé)',
      envStatus2026: 'Surveillance sentinelle stable',
      isProxy: false
    },
    {
      id: 'ZS-KIBOMBO',
      name: 'Kibombo',
      type: 'Zone Rurale',
      lat: -3.95,
      lng: 25.98,
      riskTier2022: 'FAIBLE' as const,
      riskTier2026: 'FAIBLE' as const,
      incidence2022: 95.0,
      incidence2026: 82.0,
      ci2022: [65.0, 125.0],
      ci2026: [58.0, 106.0],
      envStatus2022: 'Données climatiques par station voisine Kindu (Proxy)',
      envStatus2026: 'Proxy historique maintenu avec étiquetage',
      isProxy: true,
      proxyNote: 'PROXY HISTORIQUE : Données pluviométriques interpolées de la station synoptique de Kindu.'
    }
  ];

  const activeZone = mapZones.find(z => z.id === selectedZoneDetail) || mapZones[0];
  const activeTier = selectedYear === 2022 ? activeZone.riskTier2022 : activeZone.riskTier2026;
  const activeIncidence = selectedYear === 2022 ? activeZone.incidence2022 : activeZone.incidence2026;
  const activeCI = selectedYear === 2022 ? activeZone.ci2022 : activeZone.ci2026;
  const activeEnv = selectedYear === 2022 ? activeZone.envStatus2022 : activeZone.envStatus2026;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'TRES_ELEVE':
        return 'bg-rose-600 text-white border-rose-700';
      case 'ELEVE':
        return 'bg-orange-500 text-white border-orange-600';
      case 'MODERE':
        return 'bg-amber-400 text-slate-900 border-amber-500';
      case 'FAIBLE':
        return 'bg-emerald-400 text-slate-900 border-emerald-500';
      default:
        return 'bg-teal-200 text-teal-950 border-teal-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôleur d'Année & Historicité */}
      <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Cartographie Prédictive du Risque Épidémiologique
            </h2>
            <p className="text-xs text-slate-400">
              Stratification en 5 classes avec respect strict des états environnementaux historiques.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 font-medium">Année de Référence :</span>
          <button
            onClick={() => setSelectedYear(2022)}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              selectedYear === 2022 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2022 (Décharge active)
          </button>
          <button
            onClick={() => setSelectedYear(2026)}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              selectedYear === 2026 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2026 (Site réhabilité)
          </button>
        </div>
      </div>

      {/* Vue Cartographique Interactive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualiseur Cartographique */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Zones de Santé du Maniema — Risque Prédit ({selectedYear})
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-200"></span> T.Faible
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ml-1"></span> Faible
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-1"></span> Modéré
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ml-1"></span> Élevé
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 ml-1"></span> T.Élevé
            </div>
          </div>

          {/* Grille Interactive Représentant la Carte Spatiale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
            {mapZones.map(zone => {
              const tier = selectedYear === 2022 ? zone.riskTier2022 : zone.riskTier2026;
              const inc = selectedYear === 2022 ? zone.incidence2022 : zone.incidence2026;
              const ci = selectedYear === 2022 ? zone.ci2022 : zone.ci2026;
              const isSelected = zone.id === selectedZoneDetail;

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneDetail(zone.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{zone.name}</h4>
                      <span className="text-[10px] text-slate-500">{zone.type}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierColor(
                        tier
                      )}`}
                    >
                      {tier}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">Incidence prédite :</span>
                      <div className="font-mono font-bold text-slate-800">{inc} / 100k</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">IC 95% :</span>
                      <div className="font-mono text-[10px] text-slate-600">[{ci[0]} ; {ci[1]}]</div>
                    </div>
                  </div>

                  {zone.isProxy && (
                    <div className="mt-2 text-[10px] bg-amber-50 text-amber-800 p-1.5 rounded border border-amber-200 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      PROXY HISTORIQUE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Détail de la Zone Sélectionnée & Facteurs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-bold text-indigo-600">Détail de la Zone</span>
            <h3 className="text-sm font-bold text-slate-900">{activeZone.name}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500">Niveau de Risque Attribué ({selectedYear})</span>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTierColor(activeTier)}`}>
                  {activeTier}
                </span>
                <span>{activeIncidence} cas / 100k hab</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500">Incertitude (Intervalle de Confiance 95%)</span>
              <div className="font-mono text-xs font-bold text-slate-800">
                [{activeCI[0]} ; {activeCI[1]}] / 100 000
              </div>
              <p className="text-[10px] text-slate-400">
                Largeur d incertitude : ± {((activeCI[1] - activeCI[0]) / 2).toFixed(1)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500">État Environnemental & Historique ({selectedYear})</span>
              <div className="text-xs text-slate-700 leading-relaxed font-medium">{activeEnv}</div>
            </div>

            {activeZone.isProxy && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Traçabilité Proxy
                </div>
                <p className="text-[11px]">{activeZone.proxyNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
