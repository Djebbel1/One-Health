import React from 'react';
import {
  CartoLayerConfig,
  CartoLayerId,
  CartoDiseaseFilter,
} from '../../types';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';
import {
  Layers,
  Eye,
  EyeOff,
  Sliders,
  Filter,
  CheckSquare,
  Square,
  Activity,
  Bug,
  CloudRain,
  Home,
  Droplet,
  Waves,
  Building2,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface MapLayersSidebarProps {
  layers: CartoLayerConfig[];
  onToggleLayer: (layerId: CartoLayerId) => void;
  onChangeOpacity: (layerId: CartoLayerId, opacity: number) => void;
  selectedDisease: CartoDiseaseFilter;
  onSelectDisease: (disease: CartoDiseaseFilter) => void;
  selectedHealthAreaId: string | 'ALL';
  onSelectHealthArea: (areaId: string) => void;
  selectedEnvFactor: string | 'ALL';
  onSelectEnvFactor: (factor: string) => void;
  onResetAllLayers: () => void;
}

const LAYER_ICONS: { [key: string]: React.ReactNode } = {
  LAYER_01_MENAGES: <Home className="w-4 h-4 text-emerald-600" />,
  LAYER_02_ENVIRONNEMENT: <Bug className="w-4 h-4 text-teal-600" />,
  LAYER_03_SANTE: <Activity className="w-4 h-4 text-rose-600" />,
  LAYER_04_CLIMAT: <CloudRain className="w-4 h-4 text-sky-600" />,
  LAYER_05_EAU: <Droplet className="w-4 h-4 text-blue-600" />,
  LAYER_06_INONDATION: <Waves className="w-4 h-4 text-cyan-600" />,
  LAYER_07_INFRASTRUCTURES_SANITAIRES: <Building2 className="w-4 h-4 text-purple-600" />,
  LAYER_08_LIMITES_ADMINISTRATIVES: <MapPin className="w-4 h-4 text-slate-600" />,
};

export const MapLayersSidebar: React.FC<MapLayersSidebarProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
  selectedDisease,
  onSelectDisease,
  selectedHealthAreaId,
  onSelectHealthArea,
  selectedEnvFactor,
  onSelectEnvFactor,
  onResetAllLayers,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-5 text-slate-800">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-700" />
          <h3 className="font-bold text-sm text-slate-900">Gestionnaire des 8 Couches</h3>
        </div>
        <button
          onClick={onResetAllLayers}
          className="text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 font-medium transition"
          title="Réactiver toutes les couches par défaut"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Global Geo & Disease Filters */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-teal-700" />
          <span>Filtres Spatiaux & Pathologiques</span>
        </div>

        {/* Health Area Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Aire de santé / Emprise :
          </label>
          <select
            value={selectedHealthAreaId}
            onChange={e => onSelectHealthArea(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-md p-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
          >
            <option value="ALL">Toutes les aires de santé (Kindu & Alunguli)</option>
            <optgroup label="Zone de Santé de Kindu (Rive Droite)">
              {KINDU_HEALTH_AREAS.filter(a => a.zoneId === 'ZS_KINDU').map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.population.toLocaleString()} hab.)
                </option>
              ))}
            </optgroup>
            <optgroup label="Zone de Santé d'Alunguli (Rive Gauche)">
              {KINDU_HEALTH_AREAS.filter(a => a.zoneId === 'ZS_ALUNGULI').map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.population.toLocaleString()} hab.)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Disease Filter Tabs */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Filtrer par pathologie (Couche Sanitaire) :
          </label>
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-md border border-slate-200">
            <button
              onClick={() => onSelectDisease('PALUDISME')}
              className={`py-1 text-[11px] font-bold rounded text-center transition ${
                selectedDisease === 'PALUDISME'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Paludisme
            </button>
            <button
              onClick={() => onSelectDisease('FIEVRE_TYPHOIDE')}
              className={`py-1 text-[11px] font-bold rounded text-center transition ${
                selectedDisease === 'FIEVRE_TYPHOIDE'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Typhoïde
            </button>
            <button
              onClick={() => onSelectDisease('LES_DEUX')}
              className={`py-1 text-[11px] font-bold rounded text-center transition ${
                selectedDisease === 'LES_DEUX'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Les deux
            </button>
          </div>
        </div>

        {/* Environmental Factor Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Filtrer facteurs environnementaux :
          </label>
          <select
            value={selectedEnvFactor}
            onChange={e => onSelectEnvFactor(e.target.value)}
            className="w-full text-xs bg-white border border-slate-300 rounded-md p-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
          >
            <option value="ALL">Tous les facteurs environnementaux</option>
            <option value="EAU_STAGNANTE">Eaux stagnantes & Gîtes larvaires</option>
            <option value="DECHETS">Dépôts de déchets sauvages</option>
            <option value="CANIVEAU">Caniveaux obstrués / Eaux usées</option>
            <option value="INONDATION">Zones inondées / Submersion</option>
            <option value="VEGETATION">Végétation dense & friches</option>
          </select>
        </div>
      </div>

      {/* Layer List with Opacity Sliders */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Couches actives ({layers.filter(l => l.visible).length}/8)</span>
          <span className="text-[11px] text-slate-500 font-normal">Opacité réglable</span>
        </div>

        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {layers.map(layer => {
            const isVisible = layer.visible;
            return (
              <div
                key={layer.id}
                className={`p-2.5 rounded-lg border transition ${
                  isVisible ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    onClick={() => onToggleLayer(layer.id)}
                    className="flex items-center gap-2 cursor-pointer select-none flex-1"
                  >
                    {isVisible ? (
                      <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="shrink-0">{LAYER_ICONS[layer.id]}</span>
                    <span className={`text-xs font-bold ${isVisible ? 'text-slate-900' : 'text-slate-500'}`}>
                      {layer.label}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleLayer(layer.id)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title={isVisible ? 'Masquer la couche' : 'Afficher la couche'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 leading-tight mb-2 pl-6">
                  {layer.description}
                </div>

                {/* Opacity Slider */}
                {isVisible && (
                  <div className="flex items-center gap-2 pl-6 pt-1 border-t border-slate-100">
                    <Sliders className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-[10px] text-slate-500 w-12 shrink-0">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={layer.opacity}
                      onChange={e => onChangeOpacity(layer.id, parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
