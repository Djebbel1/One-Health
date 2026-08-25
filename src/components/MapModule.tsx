import React, { useState, useMemo } from 'react';
import {
  Map as MapIcon,
  Layers,
  Filter,
  Eye,
  Info,
  MapPin,
  AlertTriangle,
  Bug,
  Home,
  HeartPulse,
  Droplets,
  Calendar,
  Maximize2,
  Minimize2,
  Compass
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  KINDU_HEALTH_AREAS,
  KINDU_BOUNDS,
  isWithinKindu
} from '../data/kinduGeography';
import { HouseholdSurvey, EnvironmentalObservation } from '../types';

// Map projection helpers for Kindu Canvas
// Kindu bounds: minLat ~ -3.00, maxLat ~ -2.90, minLng ~ 25.88, maxLng ~ 25.98
function projectCoordinates(
  lat: number,
  lng: number,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; isInside: boolean } {
  const isInside = isWithinKindu(lat, lng);
  const minLat = KINDU_BOUNDS.minLat;
  const maxLat = KINDU_BOUNDS.maxLat;
  const minLng = KINDU_BOUNDS.minLng;
  const maxLng = KINDU_BOUNDS.maxLng;

  const x = ((lng - minLng) / (maxLng - minLng)) * canvasWidth;
  // Invert Y because latitude goes north (up), SVG Y goes down
  const y = ((maxLat - lat) / (maxLat - minLat)) * canvasHeight;

  return { x, y, isInside };
}

export const MapModule: React.FC = () => {
  const { householdSurveys, environmentalObs, healthRecords } = useData();

  // Layer Toggles
  const [showHouseholds, setShowHouseholds] = useState<boolean>(true);
  const [showEnvObs, setShowEnvObs] = useState<boolean>(true);
  const [showHealthAreas, setShowHealthAreas] = useState<boolean>(true);
  const [showRiver, setShowRiver] = useState<boolean>(true);

  // Filters
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedFactor, setSelectedFactor] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'HOUSEHOLD' | 'ENV' | 'AREA';
    data: any;
  } | null>(null);

  // Map canvas dimension
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Filtered Households
  const filteredHouseholds = useMemo(() => {
    return householdSurveys.filter(h => {
      if (selectedArea !== 'ALL' && h.health_area_id !== selectedArea) return false;
      return true;
    });
  }, [householdSurveys, selectedArea]);

  // Filtered Environmental Observations
  const filteredEnvObs = useMemo(() => {
    return environmentalObs.filter(e => {
      if (selectedArea !== 'ALL' && e.health_area_id !== selectedArea) return false;
      if (selectedFactor !== 'ALL' && e.factor_type !== selectedFactor) return false;
      return true;
    });
  }, [environmentalObs, selectedArea, selectedFactor]);

  // Congo River Polyline Path (Coordinates approximate flow through Kindu from South to North)
  const riverCoordinates = [
    { lat: -2.990, lng: 25.910 },
    { lat: -2.970, lng: 25.918 },
    { lat: -2.955, lng: 25.925 },
    { lat: -2.943, lng: 25.928 },
    { lat: -2.930, lng: 25.924 },
    { lat: -2.915, lng: 25.920 },
    { lat: -2.905, lng: 25.915 },
  ];

  const riverPath = useMemo(() => {
    const points = riverCoordinates.map(c => {
      const p = projectCoordinates(c.lat, c.lng, canvasWidth, canvasHeight);
      return `${p.x},${p.y}`;
    });
    return `M ${points.join(' L ')}`;
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-emerald-700" />
            <span>Cartographie Interactive Spatio-Temporelle (Kindu)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Visualisation géoréférencée des ménages, gîtes larvaires, aires de santé et hydrographie du fleuve Congo
          </p>
        </div>

        {/* Scientific disclaimer badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] text-amber-900 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Principe One Health : Les observations brutes ne constituent pas une carte de risque extrapolée.</span>
        </div>
      </div>

      {/* Main Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Layer Controls & Filters Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-5 lg:col-span-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Couches Cartographiques</span>
            </h3>
            <div className="space-y-2.5 text-xs font-medium">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                <span className="flex items-center gap-2 text-slate-800">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                  <span>Ménages enquêtés ({filteredHouseholds.length})</span>
                </span>
                <input
                  type="checkbox"
                  checked={showHouseholds}
                  onChange={(e) => setShowHouseholds(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                <span className="flex items-center gap-2 text-slate-800">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                  <span>Observations env. ({filteredEnvObs.length})</span>
                </span>
                <input
                  type="checkbox"
                  checked={showEnvObs}
                  onChange={(e) => setShowEnvObs(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                <span className="flex items-center gap-2 text-slate-800">
                  <span className="w-3 h-3 rounded-sm bg-indigo-200 border border-indigo-400 inline-block"></span>
                  <span>Aires de Santé (12)</span>
                </span>
                <input
                  type="checkbox"
                  checked={showHealthAreas}
                  onChange={(e) => setShowHealthAreas(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                <span className="flex items-center gap-2 text-slate-800">
                  <span className="w-3 h-1 bg-cyan-500 inline-block"></span>
                  <span>Fleuve Congo & Rivières</span>
                </span>
                <input
                  type="checkbox"
                  checked={showRiver}
                  onChange={(e) => setShowRiver(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
              </label>
            </div>
          </div>

          {/* Spatial Filters */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filtres Géographiques</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Aire de Santé</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Toute la ville de Kindu</option>
                {KINDU_HEALTH_AREAS.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Facteur Environnemental</label>
              <select
                value={selectedFactor}
                onChange={(e) => setSelectedFactor(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Tous les facteurs</option>
                <option value="EAU_STAGNANTE">Eau stagnante / Gîtes</option>
                <option value="DECHETS_VISIBLES">Dépotoir sauvage</option>
                <option value="CANIVEAU_OBSTRUE">Caniveau bouché</option>
                <option value="INONDATION">Zone inondable</option>
                <option value="LATRINE">Latrine insalubre</option>
              </select>
            </div>
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">Détails sélection</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Fermer
                </button>
              </div>

              {selectedItem.type === 'HOUSEHOLD' && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-emerald-900 font-mono">{selectedItem.data.id}</div>
                  <div className="text-slate-700">Aire : <strong>{selectedItem.data.health_area_id}</strong></div>
                  <div className="text-slate-700">Avenue : {selectedItem.data.street_name}</div>
                  <div className="text-slate-700">Taille ménage : <strong>{selectedItem.data.hh_size}</strong> ({selectedItem.data.children_u5} &lt;5 ans)</div>
                  <div className="text-slate-700">Source eau : {selectedItem.data.water_source_label}</div>
                  <div className="text-slate-700">Moustiquaires : {selectedItem.data.bednet_number} MILD ({selectedItem.data.bednet_used_last_night} dormeurs)</div>
                  <div className="text-slate-500 text-[10px] font-mono">
                    GPS : {selectedItem.data.latitude.toFixed(4)}, {selectedItem.data.longitude.toFixed(4)}
                  </div>
                </div>
              )}

              {selectedItem.type === 'ENV' && (
                <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs space-y-1">
                  <div className="font-bold text-teal-900 font-mono">{selectedItem.data.id}</div>
                  <div className="text-slate-800 font-semibold">{selectedItem.data.factor_type.replace(/_/g, ' ')}</div>
                  <div className="text-slate-700">Aire : {selectedItem.data.health_area_id} ({selectedItem.data.neighborhood_id})</div>
                  <div className="text-slate-700">Validité : {selectedItem.data.validity_start} au {selectedItem.data.validity_end}</div>
                  {selectedItem.data.larval_presence && (
                    <div className="text-rose-700 font-bold flex items-center gap-1">
                      <Bug className="w-3.5 h-3.5" />
                      <span>Larves constatées ({selectedItem.data.larval_density})</span>
                    </div>
                  )}
                  <div className="text-slate-500 text-[10px] font-mono">
                    GPS : {selectedItem.data.latitude.toFixed(4)}, {selectedItem.data.longitude.toFixed(4)}
                  </div>
                </div>
              )}

              {selectedItem.type === 'AREA' && (
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1">
                  <div className="font-bold text-indigo-900">{selectedItem.data.name}</div>
                  <div className="text-slate-700">Commune : {selectedItem.data.commune}</div>
                  <div className="text-slate-700">Population : ~{selectedItem.data.population?.toLocaleString()} hab.</div>
                  <div className="text-slate-700">Structure : {selectedItem.data.structure}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive SVG Canvas Map */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-4 lg:col-span-3 flex flex-col justify-between relative overflow-hidden min-h-[550px]">
          {/* Top HUD */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10">
            <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-mono">Kindu, Maniema (RDC) • WGS84 EPSG:4326</span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 font-mono text-[11px]">
              Emprise : Lat [-3.00, -2.90] • Lng [25.88, 25.98]
            </div>
          </div>

          {/* SVG Map Rendering */}
          <div className="relative w-full flex-1 flex items-center justify-center my-2">
            <svg
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              className="w-full h-full max-h-[500px] select-none"
            >
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />

              {/* Health Area Zones Boundaries */}
              {showHealthAreas && KINDU_HEALTH_AREAS.map((area, idx) => {
                const lat = area.coordinates?.lat ?? area.latitude ?? -2.95;
                const lng = area.coordinates?.lng ?? area.longitude ?? 25.93;
                const center = projectCoordinates(lat, lng, canvasWidth, canvasHeight);
                const isCurrentSelected = selectedItem?.type === 'AREA' && selectedItem.data.id === area.id;

                return (
                  <g
                    key={area.id}
                    onClick={() => setSelectedItem({ type: 'AREA', data: area })}
                    className="cursor-pointer transition duration-200"
                  >
                    {/* Area Influence Circle */}
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r={38}
                      fill={isCurrentSelected ? 'rgba(99, 102, 241, 0.35)' : 'rgba(99, 102, 241, 0.12)'}
                      stroke={isCurrentSelected ? '#818cf8' : '#4f46e5'}
                      strokeWidth={isCurrentSelected ? 2 : 1}
                      strokeDasharray="4 2"
                    />
                    {/* Health Structure Marker */}
                    <rect
                      x={center.x - 5}
                      y={center.y - 5}
                      width={10}
                      height={10}
                      fill="#818cf8"
                      rx={2}
                    />
                    <text
                      x={center.x}
                      y={center.y + 16}
                      textAnchor="middle"
                      fill="#c7d2fe"
                      fontSize="9px"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {area.name}
                    </text>
                  </g>
                );
              })}

              {/* Congo River Path */}
              {showRiver && (
                <g>
                  {/* River buffer */}
                  <path
                    d={riverPath}
                    fill="none"
                    stroke="#0891b2"
                    strokeWidth="14"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* River center line */}
                  <path
                    d={riverPath}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text
                    x={projectCoordinates(-2.95, 25.926, canvasWidth, canvasHeight).x + 12}
                    y={projectCoordinates(-2.95, 25.926, canvasWidth, canvasHeight).y}
                    fill="#67e8f9"
                    fontSize="10px"
                    fontWeight="bold"
                    transform="rotate(-75, 420, 300)"
                  >
                    FLEUVE CONGO
                  </text>
                </g>
              )}

              {/* Environmental Observation Points */}
              {showEnvObs && filteredEnvObs.map((env) => {
                const pt = projectCoordinates(env.latitude, env.longitude, canvasWidth, canvasHeight);
                const isCurrent = selectedItem?.type === 'ENV' && selectedItem.data.id === env.id;

                return (
                  <g
                    key={env.id}
                    onClick={() => setSelectedItem({ type: 'ENV', data: env })}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isCurrent ? 9 : 6}
                      fill={env.larval_presence ? '#f43f5e' : '#14b8a6'}
                      stroke="#ffffff"
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      className="transition-all hover:scale-125"
                    />
                    {env.larval_presence && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={12}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}

              {/* Household Survey Points */}
              {showHouseholds && filteredHouseholds.map((hh) => {
                const pt = projectCoordinates(hh.latitude, hh.longitude, canvasWidth, canvasHeight);
                const isCurrent = selectedItem?.type === 'HOUSEHOLD' && selectedItem.data.id === hh.id;

                return (
                  <g
                    key={hh.id}
                    onClick={() => setSelectedItem({ type: 'HOUSEHOLD', data: hh })}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isCurrent ? 7 : 4.5}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth={isCurrent ? 2 : 1}
                      className="transition-all hover:scale-150"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="bg-slate-800/90 backdrop-blur-xs p-3 rounded-xl border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300 z-10">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
                <span>Ménage Enquêté</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span>
                <span>Gîte Larvaire Positif</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-500 border border-white"></span>
                <span>Facteur Env. Sans Larve</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-cyan-400"></span>
                <span>Fleuve Congo</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-400"></span>
                <span>Centre de Santé</span>
              </span>
            </div>

            <span className="text-slate-400 font-mono text-[10px]">
              Total affiché : {filteredHouseholds.length} ménages • {filteredEnvObs.length} obs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
