import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  CartoLayerConfig,
  CartoLayerId,
  CartoSubMenu,
  CartoDiseaseFilter,
  DistanceMeasurement,
} from '../../types';
import { DEFAULT_CARTO_LAYERS, INITIAL_WATER_POINTS, INITIAL_FLOOD_AREAS } from '../../data/cartographyData';
import { LeafletMapView } from './LeafletMapView';
import { TemporalControlBar } from './TemporalControlBar';
import { MapLayersSidebar } from './MapLayersSidebar';
import { PeriodComparisonView } from './PeriodComparisonView';
import { ZoneProfileDrawer } from './ZoneProfileDrawer';
import { MapLegendView } from './MapLegendView';
import { CartoExportModal } from './CartoExportModal';
import { MethodologyAndLimitsView } from './MethodologyAndLimitsView';
import { CartoValidationSuite } from './CartoValidationSuite';
import {
  Map as MapIcon,
  Layers,
  Activity,
  Bug,
  CloudRain,
  Home,
  GitCompare,
  Clock,
  Info,
  Download,
  BookOpen,
  ShieldCheck,
  Filter,
  Sparkles,
  Search,
  Maximize2,
  Compass,
} from 'lucide-react';

export const IntegratedCartographyModule: React.FC = () => {
  const {
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
  } = useData();

  // Sub-menu Tab State
  const [activeSubMenu, setActiveSubMenu] = useState<CartoSubMenu>('VUE_GENERALE');

  // Temporal Filter State
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(4); // Default to April (rainy peak)

  // Pathology & Geo Filters
  const [selectedDisease, setSelectedDisease] = useState<CartoDiseaseFilter>('LES_DEUX');
  const [selectedHealthAreaId, setSelectedHealthAreaId] = useState<string | 'ALL'>('ALL');
  const [selectedEnvFactor, setSelectedEnvFactor] = useState<string | 'ALL'>('ALL');

  // Layers Configuration
  const [layers, setLayers] = useState<CartoLayerConfig[]>(DEFAULT_CARTO_LAYERS);

  // Selected Zone Profile
  const [activeZoneProfileId, setActiveZoneProfileId] = useState<string | null>(null);

  // Export Modal Toggle
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Distance Measure Mode
  const [distanceMeasureMode, setDistanceMeasureMode] = useState<boolean>(false);
  const [currentDistanceMeasurement, setCurrentDistanceMeasurement] = useState<DistanceMeasurement | null>(null);

  // Layer Toggles
  const handleToggleLayer = (layerId: CartoLayerId) => {
    setLayers(prev =>
      prev.map(l => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleChangeOpacity = (layerId: CartoLayerId, opacity: number) => {
    setLayers(prev =>
      prev.map(l => (l.id === layerId ? { ...l, opacity } : l))
    );
  };

  const handleResetAllLayers = () => {
    setLayers(DEFAULT_CARTO_LAYERS);
  };

  // Quick Preset Handlers for Sub-Menus
  const handleSelectSubMenu = (menu: CartoSubMenu) => {
    setActiveSubMenu(menu);

    if (menu === 'CARTE_SANTE') {
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          visible: l.id === 'LAYER_03_SANTE' || l.id === 'LAYER_07_INFRASTRUCTURES_SANITAIRES' || l.id === 'LAYER_08_LIMITES_ADMINISTRATIVES',
        }))
      );
    } else if (menu === 'CARTE_ENV') {
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          visible: l.id === 'LAYER_02_ENVIRONNEMENT' || l.id === 'LAYER_05_EAU' || l.id === 'LAYER_06_INONDATION' || l.id === 'LAYER_08_LIMITES_ADMINISTRATIVES',
        }))
      );
    } else if (menu === 'CARTE_CLIMAT') {
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          visible: l.id === 'LAYER_04_CLIMAT' || l.id === 'LAYER_08_LIMITES_ADMINISTRATIVES',
        }))
      );
    } else if (menu === 'CARTE_MENAGES') {
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          visible: l.id === 'LAYER_01_MENAGES' || l.id === 'LAYER_08_LIMITES_ADMINISTRATIVES',
        }))
      );
    } else if (menu === 'CARTE_INTEGREE' || menu === 'VUE_GENERALE') {
      setLayers(prev => prev.map(l => ({ ...l, visible: true })));
    } else if (menu === 'EXPORT_CARTO') {
      setShowExportModal(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Cartography Header & Sub-Navigation */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <MapIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  V1.6 Spatio-Temporelle
                </span>
                <h1 className="text-lg font-bold text-slate-900">
                  Cartographie Intégrée One Health Maniema
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Croisement spatial et longitudinal des données des ménages, sanitaires, environnementales et climatiques
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Exporter la carte</span>
            </button>
            <button
              onClick={() => setActiveSubMenu('TESTS_VALIDATION')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validation V1.6 (20/20)</span>
            </button>
          </div>
        </div>

        {/* Sub-menu Horizontal Tab Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 text-xs scrollbar-thin">
          {[
            { id: 'VUE_GENERALE', label: 'Vue générale', icon: MapIcon },
            { id: 'CARTE_SANTE', label: 'Carte sanitaire', icon: Activity },
            { id: 'CARTE_ENV', label: 'Carte environnementale', icon: Bug },
            { id: 'CARTE_CLIMAT', label: 'Carte climatique', icon: CloudRain },
            { id: 'CARTE_MENAGES', label: 'Carte des ménages', icon: Home },
            { id: 'CARTE_INTEGREE', label: 'Carte intégrée (One Health)', icon: Sparkles },
            { id: 'COMPARAISON_PERIODES', label: 'Comparaison des périodes', icon: GitCompare },
            { id: 'LEGENDE', label: 'Légende dynamique', icon: Info },
            { id: 'METHODOLOGIE', label: 'Méthodologie & Limites', icon: BookOpen },
            { id: 'TESTS_VALIDATION', label: 'Validation Scientifique', icon: ShieldCheck },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeSubMenu === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectSubMenu(tab.id as CartoSubMenu)}
                className={`px-3 py-1.5 font-bold rounded-lg whitespace-nowrap transition flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Render based on active sub-menu */}
      {activeSubMenu === 'COMPARAISON_PERIODES' ? (
        <PeriodComparisonView
          healthRecords={healthRecords}
          climateRecords={climateRecords}
          environmentalObs={environmentalObs}
          householdSurveys={householdSurveys}
        />
      ) : activeSubMenu === 'METHODOLOGIE' ? (
        <MethodologyAndLimitsView />
      ) : activeSubMenu === 'TESTS_VALIDATION' ? (
        <CartoValidationSuite />
      ) : activeSubMenu === 'LEGENDE' ? (
        <div className="space-y-4">
          <MapLegendView layers={layers} selectedDisease={selectedDisease} />
          {/* Also show mini-map under legend */}
          <div className="h-[460px]">
            <LeafletMapView
              layers={layers}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDisease={selectedDisease}
              selectedHealthAreaId={selectedHealthAreaId}
              selectedEnvFactor={selectedEnvFactor}
              healthRecords={healthRecords}
              climateRecords={climateRecords}
              environmentalObs={environmentalObs}
              householdSurveys={householdSurveys}
              waterPoints={INITIAL_WATER_POINTS}
              floodAreas={INITIAL_FLOOD_AREAS}
              onSelectHealthArea={id => setActiveZoneProfileId(id)}
              distanceMeasureMode={distanceMeasureMode}
              onToggleDistanceMode={() => setDistanceMeasureMode(!distanceMeasureMode)}
            />
          </div>
        </div>
      ) : (
        /* Standard Cartographic Dashboard View */
        <div className="space-y-4">
          {/* Global Temporal Slider & Playback Bar */}
          <TemporalControlBar
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={year => setSelectedYear(year)}
            onMonthChange={month => setSelectedMonth(month)}
          />

          {/* Map and Layer Controller Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Layers Management Sidebar (4 cols) */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <MapLayersSidebar
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onChangeOpacity={handleChangeOpacity}
                selectedDisease={selectedDisease}
                onSelectDisease={setSelectedDisease}
                selectedHealthAreaId={selectedHealthAreaId}
                onSelectHealthArea={setSelectedHealthAreaId}
                selectedEnvFactor={selectedEnvFactor}
                onSelectEnvFactor={setSelectedEnvFactor}
                onResetAllLayers={handleResetAllLayers}
              />
            </div>

            {/* Interactive Leaflet Map Container (8 cols) */}
            <div className="lg:col-span-8 order-1 lg:order-2 h-[640px] flex flex-col">
              <LeafletMapView
                layers={layers}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDisease={selectedDisease}
                selectedHealthAreaId={selectedHealthAreaId}
                selectedEnvFactor={selectedEnvFactor}
                healthRecords={healthRecords}
                climateRecords={climateRecords}
                environmentalObs={environmentalObs}
                householdSurveys={householdSurveys}
                waterPoints={INITIAL_WATER_POINTS}
                floodAreas={INITIAL_FLOOD_AREAS}
                onSelectHealthArea={id => setActiveZoneProfileId(id)}
                distanceMeasureMode={distanceMeasureMode}
                onDistanceMeasured={dist => setCurrentDistanceMeasurement(dist)}
                onToggleDistanceMode={() => setDistanceMeasureMode(!distanceMeasureMode)}
              />
            </div>
          </div>

          {/* Selected Zone Profile Modal / Drawer (if selected) */}
          {activeZoneProfileId && (
            <ZoneProfileDrawer
              areaId={activeZoneProfileId}
              selectedYear={selectedYear}
              healthRecords={healthRecords}
              climateRecords={climateRecords}
              environmentalObs={environmentalObs}
              householdSurveys={householdSurveys}
              waterPoints={INITIAL_WATER_POINTS}
              floodAreas={INITIAL_FLOOD_AREAS}
              onClose={() => setActiveZoneProfileId(null)}
            />
          )}

          {/* Map Legend Preview at bottom of main view */}
          <MapLegendView layers={layers} selectedDisease={selectedDisease} />
        </div>
      )}

      {/* Export Carto Modal */}
      {showExportModal && (
        <CartoExportModal
          layers={layers}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDisease={selectedDisease}
          selectedHealthAreaId={selectedHealthAreaId}
          healthRecords={healthRecords}
          climateRecords={climateRecords}
          environmentalObs={environmentalObs}
          householdSurveys={householdSurveys}
          waterPoints={INITIAL_WATER_POINTS}
          floodAreas={INITIAL_FLOOD_AREAS}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
