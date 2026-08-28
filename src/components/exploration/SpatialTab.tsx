import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  AlertTriangle,
  Info,
  Calendar,
  Waves,
  Building,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  computeSpatialAreaStats,
  getEnvironmentalContextAtDate,
  CAUSALITY_DISCLAIMER
} from '../../utils/spatiotemporalExplorationEngine';
import { KINDU_HEALTH_AREAS } from '../../data/kinduData';

export const SpatialTab: React.FC = () => {
  const { analysisDataset, explorationFilters, environmentalObs } = useData();

  const [selectedAreaId, setSelectedAreaId] = useState<string>('AS_KASUKU');
  const [metric, setMetric] = useState<'INCIDENCE' | 'CASES' | 'DENSITY'>('INCIDENCE');
  const [diseaseChoice, setDiseaseChoice] = useState<'MALARIA' | 'TYPHOID'>('MALARIA');

  const spatialStats = useMemo(() => {
    return computeSpatialAreaStats(analysisDataset, explorationFilters);
  }, [analysisDataset, explorationFilters]);

  const selectedAreaStats = useMemo(() => {
    return spatialStats.find(s => s.aire_sante_id === selectedAreaId) || spatialStats[0];
  }, [spatialStats, selectedAreaId]);

  // Historique environnemental contextualisé au 2024-06-01 (ou année filtrée)
  const contextDate = explorationFilters.year !== 'ALL'
    ? `${explorationFilters.year}-06-01`
    : '2024-06-01';

  const envContext = useMemo(() => {
    if (!selectedAreaId) return [];
    return getEnvironmentalContextAtDate(environmentalObs, selectedAreaId, contextDate);
  }, [environmentalObs, selectedAreaId, contextDate]);

  // Calcul du max pour la jauge visuelle
  const maxIncidence = useMemo(() => {
    const vals = spatialStats.map(s => diseaseChoice === 'MALARIA' ? (s.malaria_incidence_per_1000 || 0) : (s.typhoid_incidence_per_1000 || 0));
    return Math.max(...vals, 1);
  }, [spatialStats, diseaseChoice]);

  return (
    <div className="space-y-6" id="exploration-spatial-tab">
      {/* Contrôles & Filtres Spatiaux */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Pathologie cartographiée :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setDiseaseChoice('MALARIA')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'MALARIA' ? 'bg-red-950 text-red-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paludisme
            </button>
            <button
              onClick={() => setDiseaseChoice('TYPHOID')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                diseaseChoice === 'TYPHOID' ? 'bg-amber-950 text-amber-300 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fièvre Typhoïde
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Variable spatiale :</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setMetric('INCIDENCE')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                metric === 'INCIDENCE' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Incidence (/1 000 hab.)
            </button>
            <button
              onClick={() => setMetric('CASES')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                metric === 'CASES' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nombre de Cas
            </button>
            <button
              onClick={() => setMetric('DENSITY')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                metric === 'DENSITY' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Densité (Cas / km²)
            </button>
          </div>
        </div>
      </div>

      {/* Grille Principale : Carte Synthétique / Grille des Aires + Panneau Détail Aire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grille / Carte Interactive des 10 Aires de Santé */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Distribution Spatiale par Aire de Santé (Kindu)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sélectionnez une aire de santé pour inspecter son profil épidémiologique et son contexte environnemental.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bonne</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Partielle</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Faible</span>
            </div>
          </div>

          {/* Grille Spatiale Responsive des 10 Aires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {spatialStats.map(as => {
              const isSelected = as.aire_sante_id === selectedAreaId;
              const val = metric === 'INCIDENCE'
                ? (diseaseChoice === 'MALARIA' ? as.malaria_incidence_per_1000 : as.typhoid_incidence_per_1000)
                : metric === 'CASES'
                ? (diseaseChoice === 'MALARIA' ? as.total_malaria_cases : as.total_typhoid_cases)
                : (diseaseChoice === 'MALARIA' ? as.malaria_density_km2 : as.typhoid_density_km2);

              const percent = maxIncidence > 0 && val !== null ? Math.min(100, Math.round((val / maxIncidence) * 100)) : 0;

              return (
                <div
                  key={as.aire_sante_id}
                  onClick={() => setSelectedAreaId(as.aire_sante_id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          as.coverage_status === 'BONNE' ? 'bg-emerald-400' : as.coverage_status === 'PARTIELLE' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        {as.aire_sante_name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {as.zone_sante_id === 'ZS_KINDU' ? 'ZS Kindu (Rive droite)' : 'ZS Alunguli (Rive gauche)'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {val !== null ? `${val} ${metric === 'INCIDENCE' ? '‰' : metric === 'DENSITY' ? 'c/km²' : 'cas'}` : 'NULL (Pas de données)'}
                    </span>
                  </div>

                  {/* Barre de progression proportionnelle */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        diseaseChoice === 'MALARIA' ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-mono">
                    <span>Pop : {as.population.toLocaleString()}</span>
                    <span>Couv : {as.coverage_percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>🔴 Distinguer rigoureusement : Faible risque observé ≠ Faible risque réel si la couverture est insuffisante.</span>
            <span className="font-mono">10 aires modélisées</span>
          </div>
        </div>

        {/* Panneau Détail & Contexte Environnemental Historique */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-400" />
                  {selectedAreaStats?.aire_sante_name || 'Sélectionner une aire'}
                </h3>
                <span className="text-xs text-slate-400">Fiche Spatio-Environnementale</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {selectedAreaStats?.zone_sante_id}
              </span>
            </div>

            {selectedAreaStats && (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Population :</span>
                    <span className="font-mono text-slate-200 font-semibold">{selectedAreaStats.population.toLocaleString()} hab.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Superficie estimée :</span>
                    <span className="font-mono text-slate-200">{selectedAreaStats.area_km2} km²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Densité démographique :</span>
                    <span className="font-mono text-slate-200">{Math.round(selectedAreaStats.population / selectedAreaStats.area_km2)} hab./km²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Périodes documentées :</span>
                    <span className="font-mono text-slate-200">{selectedAreaStats.periods_covered} / {selectedAreaStats.total_periods} ({selectedAreaStats.coverage_percentage}%)</span>
                  </div>
                </div>

                {/* Contexte Environnemental Strictement Valide à la Date */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-blue-400" />
                    Contexte Environnemental Valide ({contextDate})
                  </h4>
                  {envContext.length === 0 ? (
                    <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                      Aucun facteur environnemental historique enregistré pour cette période temporelle.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {envContext.map(obs => (
                        <div key={obs.id} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 text-xs">
                          <div className="flex justify-between items-center font-medium text-slate-200">
                            <span>{obs.siteName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-blue-300">
                              {obs.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            Valide du <span className="font-mono text-slate-300">{obs.valid_from || 'Origine'}</span> au <span className="font-mono text-slate-300">{obs.valid_to || 'En cours'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 mt-2 italic">
                    Respect strict de valid_from / valid_to : Aucune observation future ou passée n'est rétro-projetée de manière anachronique.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
