import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Activity,
  AlertTriangle,
  CloudRain,
  Droplets,
  Eye,
  Info,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface SurveillanceMappingTabProps {
  selectedZone: string;
}

export const SurveillanceMappingTab: React.FC<SurveillanceMappingTabProps> = ({
  selectedZone
}) => {
  // Couches cartographiques indépendantes
  const [showSignalsLayer, setShowSignalsLayer] = useState<boolean>(true);
  const [showPredictedRiskLayer, setShowPredictedRiskLayer] = useState<boolean>(true);
  const [showBreedingSitesLayer, setShowBreedingSitesLayer] = useState<boolean>(true);
  const [showRainfallLayer, setShowRainfallLayer] = useState<boolean>(false);
  const [showWashLayer, setShowWashLayer] = useState<boolean>(false);
  const [showClustersLayer, setShowClustersLayer] = useState<boolean>(true);

  const [selectedMapZone, setSelectedMapZone] = useState<string>('Kasuku - Basoko');

  const mapZones = [
    {
      id: 'Z1',
      name: 'Kasuku - Basoko',
      zone: 'Kasuku',
      coordinates: '2.95° S, 25.95° E',
      signalStatus: 'CRITIQUE',
      predictedRisk: '88% (Élevé)',
      breedingSitesCount: 45,
      washTurbidity: '6.2 NTU',
      rainfallAnomaly: '+42 mm',
      isCluster: true,
      notes: 'Cluster actif de paludisme avec forte densité larvaire le long de la rivière Kasuku.'
    },
    {
      id: 'Z2',
      name: 'Kasuku - Lwama',
      zone: 'Kasuku',
      coordinates: '2.96° S, 25.94° E',
      signalStatus: 'IMPORTANT',
      predictedRisk: '76% (Modéré-Élevé)',
      breedingSitesCount: 22,
      washTurbidity: '5.8 NTU',
      rainfallAnomaly: '+38 mm',
      isCluster: true,
      notes: 'Extension spatiale du signal de Basoko.'
    },
    {
      id: 'Z3',
      name: 'Mikelenge - Centre',
      zone: 'Mikelenge',
      coordinates: '2.94° S, 25.93° E',
      signalStatus: 'IMPORTANT',
      predictedRisk: '78% (Élevé Typhoïde)',
      breedingSitesCount: 15,
      washTurbidity: '12.4 NTU',
      rainfallAnomaly: '+35 mm',
      isCluster: false,
      notes: 'Anomalie de transmission féco-orale liée au pic de turbidité fluviale.'
    },
    {
      id: 'Z4',
      name: 'Alunguli - Kimbombo',
      zone: 'Alunguli',
      coordinates: '2.95° S, 25.91° E',
      signalStatus: 'VIGILANCE',
      predictedRisk: '62% (Modéré)',
      breedingSitesCount: 18,
      washTurbidity: '14.8 NTU',
      rainfallAnomaly: '+18 mm',
      isCluster: false,
      notes: 'Zone fluviale ouest. Complétude des rapports à 72% (données à consolider).'
    }
  ];

  const currentZoneData = mapZones.find((z) => z.name === selectedMapZone) || mapZones[0];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cartographie Spatiale &amp; Multicouche One Health
            </h2>
            <p className="text-xs text-slate-500">
              Superposition contrôlée des signaux épidémiologiques, risques modélisés et déterminants environnementaux
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-mono font-bold text-xs border border-slate-200">
          Système SIG Kindu (EPSG:4326)
        </span>
      </div>

      {/* Interface Carte Multicouche (2 Colonnes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche (4/12) : Contrôle des Couches Indépendantes */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Couches SIG Indépendantes</span>
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>Signaux de Surveillance Actifs</span>
                </span>
                <input
                  type="checkbox"
                  checked={showSignalsLayer}
                  onChange={(e) => setShowSignalsLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                  <span>Risque Prédit (Modèle V1.16)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showPredictedRiskLayer}
                  onChange={(e) => setShowPredictedRiskLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Gîtes Larvaires Anophéliens (82)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showBreedingSitesLayer}
                  onChange={(e) => setShowBreedingSitesLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span>Anomalies Pluviométriques (ERA5)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showRainfallLayer}
                  onChange={(e) => setShowRainfallLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span>Vulnérabilité WASH / Turbidité</span>
                </span>
                <input
                  type="checkbox"
                  checked={showWashLayer}
                  onChange={(e) => setShowWashLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition">
                <span className="font-medium text-slate-800 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span>Polygones de Clusters Spatiaux</span>
                </span>
                <input
                  type="checkbox"
                  checked={showClustersLayer}
                  onChange={(e) => setShowClustersLayer(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Fiche d'Informations Spatiales de la Zone Sélectionnée */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Détails de la Zone : {currentZoneData.name}
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Statut Signal :</span>
                <span className="font-bold text-rose-700 font-mono">{currentZoneData.signalStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Risque Prédit :</span>
                <span className="font-bold text-teal-800 font-mono">{currentZoneData.predictedRisk}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Gîtes Larvaires :</span>
                <span className="font-bold text-slate-800 font-mono">{currentZoneData.breedingSitesCount} répertoriés</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Turbidité Eau :</span>
                <span className="font-bold text-cyan-800 font-mono">{currentZoneData.washTurbidity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cluster Spatiale :</span>
                <span className="font-bold text-purple-700">{currentZoneData.isCluster ? 'Oui (Actif)' : 'Non'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {currentZoneData.notes}
            </p>
          </div>
        </div>

        {/* Colonne Droite (8/12) : Rendu Cartographique Interactif */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-teal-600" />
              <span>Visualisation Interactive du Territoire de Kindu</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              Cliquez sur une zone pour inspecter les couches One Health
            </span>
          </div>

          {/* Canvas Cartographique Stylisé */}
          <div className="w-full h-96 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between p-6 text-white">
            
            {/* Simulation graphique du fleuve Congo & des zones de santé */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50,0 Q 200,150 180,400"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="28"
                />
                <text x="70" y="380" fill="#38bdf8" fontSize="12" fontWeight="bold">
                  Fleuve Congo
                </text>
              </svg>
            </div>

            {/* En-tête carte */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <span>Territoire : <strong>Kindu-Urbain &amp; Périurbain</strong></span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span>Échelle : 1:25 000</span>
              </div>
            </div>

            {/* Points / Aires de Santé Interactives */}
            <div className="relative z-10 grid grid-cols-2 gap-4 my-auto">
              {mapZones.map((z) => {
                const isSelected = z.name === selectedMapZone;
                return (
                  <div
                    key={z.id}
                    onClick={() => setSelectedMapZone(z.name)}
                    className={`p-4 rounded-xl border backdrop-blur-md cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-teal-400 ring-2 ring-teal-500/50 shadow-lg'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{z.name}</span>
                      {showSignalsLayer && (
                        <span
                          className={`w-3 h-3 rounded-full ${
                            z.signalStatus === 'CRITIQUE'
                              ? 'bg-rose-500 animate-ping'
                              : z.signalStatus === 'IMPORTANT'
                              ? 'bg-amber-500'
                              : 'bg-yellow-400'
                          }`}
                        ></span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300 font-mono">
                      {showPredictedRiskLayer && <div>Risque : {z.predictedRisk.split(' ')[0]}</div>}
                      {showBreedingSitesLayer && <div>Gîtes : {z.breedingSitesCount}</div>}
                      {showWashLayer && <div>Turbidité : {z.washTurbidity}</div>}
                      {showRainfallLayer && <div>Pluie : {z.rainfallAnomaly}</div>}
                    </div>

                    {showClustersLayer && z.isCluster && (
                      <div className="text-[9px] font-bold text-purple-300 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700 w-max">
                        CLUSTER SPATIAL ACTIF
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende Cartographique */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 bg-slate-800/80 backdrop-blur-xs p-2 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Signal Critique</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Signal Important</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>Risque Modélisé</span>
                </span>
              </div>
              <span>Coordonnées WGS84 Kindu</span>
            </div>

          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Indépendance des Couches :</strong> La désactivation ou l&apos;activation d&apos;une couche n&apos;altère en aucun cas les données brutes sous-jacentes.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
