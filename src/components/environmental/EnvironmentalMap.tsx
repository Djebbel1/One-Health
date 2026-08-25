import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Filter,
  Eye,
  Info,
  AlertTriangle,
  Layers,
  Droplets,
  Trash2,
  Calendar,
  Compass,
  CheckCircle2,
  Camera,
  Home,
  ShieldCheck,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  KINDU_HEALTH_AREAS,
  KINDU_BOUNDS,
  isWithinKindu,
  CONGO_RIVER_PATH
} from '../../data/kinduGeography';
import { EnvironmentalObservation, EnvironmentalFactorType, HistoricalStatus } from '../../types';

// Map projection helpers for SVG canvas
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
  const y = ((maxLat - lat) / (maxLat - minLat)) * canvasHeight;

  return { x, y, isInside };
}

// Factor colors
const FACTOR_COLORS: Record<string, { fill: string; stroke: string; label: string }> = {
  EAU_STAGNANTE: { fill: '#2563eb', stroke: '#1d4ed8', label: 'Eau stagnante' },
  DECHETS: { fill: '#d97706', stroke: '#b45309', label: 'Déchets & Dépotoirs' },
  CANIVEAU: { fill: '#475569', stroke: '#334155', label: 'Caniveau' },
  EAUX_USEES: { fill: '#4f46e5', stroke: '#3730a3', label: 'Eaux usées' },
  INONDATION: { fill: '#06b6d4', stroke: '#0891b2', label: 'Inondation' },
  POINT_EAU: { fill: '#0d9488', stroke: '#0f766e', label: 'Point d\'eau' },
  COURS_EAU: { fill: '#0284c7', stroke: '#0369a1', label: 'Cours d\'eau' },
  VEGETATION: { fill: '#059669', stroke: '#047857', label: 'Végétation dense' },
  HABITAT_VECTEURS: { fill: '#9333ea', stroke: '#7e22ce', label: 'Habitat vecteurs' },
  AUTRE: { fill: '#64748b', stroke: '#475569', label: 'Autre' }
};

interface EnvironmentalMapProps {
  onSelectObservation?: (obs: EnvironmentalObservation) => void;
}

export const EnvironmentalMap: React.FC<EnvironmentalMapProps> = ({
  onSelectObservation
}) => {
  const { environmentalObs, householdSurveys } = useData();

  // Filters
  const [selectedFactor, setSelectedFactor] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedHistoricalStatus, setSelectedHistoricalStatus] = useState<string>('ALL');
  const [selectedValidationStatus, setSelectedValidationStatus] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Layer Toggles
  const [showRiver, setShowRiver] = useState<boolean>(true);
  const [showHealthAreas, setShowHealthAreas] = useState<boolean>(true);
  const [showHouseholds, setShowHouseholds] = useState<boolean>(true);

  // Selected Detail Item
  const [selectedObs, setSelectedObs] = useState<EnvironmentalObservation | null>(null);

  // Dimensions
  const canvasWidth = 840;
  const canvasHeight = 620;

  // Filtered dataset
  const filteredObs = useMemo(() => {
    return environmentalObs.filter(obs => {
      if (selectedFactor !== 'ALL' && obs.factor_type !== selectedFactor) return false;
      if (selectedArea !== 'ALL' && obs.health_area_id !== selectedArea) return false;
      if (selectedHistoricalStatus !== 'ALL' && (obs.historical_status || 'CURRENT') !== selectedHistoricalStatus) return false;
      if (selectedValidationStatus !== 'ALL' && obs.status !== selectedValidationStatus) return false;
      if (dateFilter && obs.observation_date && !obs.observation_date.startsWith(dateFilter)) return false;
      return true;
    });
  }, [environmentalObs, selectedFactor, selectedArea, selectedHistoricalStatus, selectedValidationStatus, dateFilter]);

  // River SVG Path
  const riverPath = useMemo(() => {
    const points = CONGO_RIVER_PATH.map(([lat, lng]) => {
      const p = projectCoordinates(lat, lng, canvasWidth, canvasHeight);
      return `${p.x},${p.y}`;
    });
    return `M ${points.join(' L ')}`;
  }, []);

  return (
    <div className="space-y-4">
      {/* Title & Official Notice */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                CARTE DES OBSERVATIONS ENVIRONNEMENTALES
              </h2>
              <p className="text-xs text-slate-500">
                Visualisation spatiale factuelle des facteurs géoréférencés à Kindu
              </p>
            </div>
          </div>
        </div>

        {/* Scientific Warning Disclaimer */}
        <div className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-700 max-w-md">
          ℹ️ <strong>Règle d'intégrité :</strong> Cette carte représente strictement les constats environnementaux observés. Elle ne calcule pas d'indices de risque sanitaire arbitraires.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
          <Filter className="w-3.5 h-3.5 text-teal-700" />
          <span>Filtres multicritères de la carte</span>
          <span className="ml-auto text-slate-500 font-normal">
            Affichage : <strong>{filteredObs.length}</strong> / {environmentalObs.length} observations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Factor Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facteur</label>
            <select
              value={selectedFactor}
              onChange={(e) => setSelectedFactor(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="ALL">Tous les facteurs</option>
              {Object.entries(FACTOR_COLORS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aire de santé</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="ALL">Toutes les aires</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Historical Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statut historique</label>
            <select
              value={selectedHistoricalStatus}
              onChange={(e) => setSelectedHistoricalStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="CURRENT">Actuel (Observation directe)</option>
              <option value="HISTORICAL_DOCUMENTED">Historique documenté</option>
              <option value="HISTORICAL_REPORTED_UNVERIFIED">Historique rapporté non vérifié</option>
              <option value="UNKNOWN">Inconnu</option>
            </select>
          </div>

          {/* Validation Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Validation</label>
            <select
              value={selectedValidationStatus}
              onChange={(e) => setSelectedValidationStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="ALL">Tous les états</option>
              <option value="VALIDATED">Validées uniquement</option>
              <option value="SUBMITTED">Soumises</option>
              <option value="UNDER_REVIEW">En révision</option>
              <option value="REJECTED">Rejetées</option>
              <option value="DRAFT">Brouillons</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date / Période</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showRiver}
              onChange={(e) => setShowRiver(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span className="text-slate-700">Fleuve Congo & Rives</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showHealthAreas}
              onChange={(e) => setShowHealthAreas(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span className="text-slate-700">Limites Aires de Santé</span>
          </label>

          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showHouseholds}
              onChange={(e) => setShowHouseholds(e.target.checked)}
              className="rounded text-teal-600"
            />
            <span className="text-slate-700">Ménages répertoriés ({householdSurveys.length})</span>
          </label>
        </div>
      </div>

      {/* Main Map Container with Canvas and Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: SVG Map Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden relative min-h-[500px]">
          {/* Map Controls Header Overlay */}
          <div className="absolute top-6 left-6 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-white flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>Ville de Kindu • Maniema</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full flex items-center justify-center">
            <svg
              viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
              className="w-full h-auto max-h-[580px] select-none"
            >
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />

              {/* Health Area Polygons */}
              {showHealthAreas &&
                KINDU_HEALTH_AREAS.map((area) => {
                  const pointsStr = area.bounds
                    .map(([lat, lng]) => {
                      const p = projectCoordinates(lat, lng, canvasWidth, canvasHeight);
                      return `${p.x},${p.y}`;
                    })
                    .join(' ');

                  const center = projectCoordinates(
                    area.coordinates.lat,
                    area.coordinates.lng,
                    canvasWidth, canvasHeight
                  );

                  return (
                    <g key={area.id}>
                      <polygon
                        points={pointsStr}
                        fill={selectedArea === area.id ? 'rgba(13, 148, 136, 0.25)' : 'rgba(255, 255, 255, 0.04)'}
                        stroke={selectedArea === area.id ? '#14b8a6' : 'rgba(255, 255, 255, 0.2)'}
                        strokeWidth={selectedArea === area.id ? 2 : 1}
                        strokeDasharray="4 2"
                      />
                      <text
                        x={center.x}
                        y={center.y}
                        fill="rgba(255, 255, 255, 0.4)"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {area.name}
                      </text>
                    </g>
                  );
                })}

              {/* Congo River Flow Line */}
              {showRiver && (
                <g>
                  <path
                    d={riverPath}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="14"
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d={riverPath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    strokeOpacity="0.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="320" y="300" fill="#38bdf8" fontSize="10" fontWeight="bold" opacity="0.6" transform="rotate(-70 320 300)">
                    FLEUVE CONGO
                  </text>
                </g>
              )}

              {/* Background Household markers */}
              {showHouseholds &&
                householdSurveys.map((hh) => {
                  const p = projectCoordinates(hh.latitude, hh.longitude, canvasWidth, canvasHeight);
                  return (
                    <circle
                      key={hh.id}
                      cx={p.x}
                      cy={p.y}
                      r="2.5"
                      fill="rgba(255, 255, 255, 0.25)"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      opacity="0.6"
                    />
                  );
                })}

              {/* ENVIRONMENTAL OBSERVATION PINS WITH STRICT SYMBOLOGY */}
              {filteredObs.map((obs) => {
                const p = projectCoordinates(obs.latitude, obs.longitude, canvasWidth, canvasHeight);
                const colorConfig = FACTOR_COLORS[obs.factor_type] || FACTOR_COLORS.AUTRE;
                const isSelected = selectedObs?.id === obs.id;
                const histStatus = obs.historical_status || 'CURRENT';

                return (
                  <g
                    key={obs.id}
                    className="cursor-pointer transition hover:opacity-100"
                    onClick={() => {
                      setSelectedObs(obs);
                      if (onSelectObservation) onSelectObservation(obs);
                    }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="14"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        className="animate-ping"
                      />
                    )}

                    {/* SYMBOLOGY CASE 1: CURRENT OBSERVATION (Solid pin) */}
                    {histStatus === 'CURRENT' && (
                      <g>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 7 : 5.5}
                          fill={colorConfig.fill}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 1.5}
                        />
                      </g>
                    )}

                    {/* SYMBOLOGY CASE 2: HISTORICAL DOCUMENTED (Double ring / Document symbol) */}
                    {histStatus === 'HISTORICAL_DOCUMENTED' && (
                      <g>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 8 : 6.5}
                          fill={colorConfig.fill}
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 11 : 9.5}
                          fill="none"
                          stroke={colorConfig.fill}
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* SYMBOLOGY CASE 3: HISTORICAL REPORTED UNVERIFIED (Dashed ring + Warning indicator) */}
                    {histStatus === 'HISTORICAL_REPORTED_UNVERIFIED' && (
                      <g>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 8 : 6.5}
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 12 : 10}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                        />
                      </g>
                    )}

                    {/* SYMBOLOGY CASE 4: UNKNOWN (Muted Slate Pin) */}
                    {histStatus === 'UNKNOWN' && (
                      <g>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isSelected ? 7 : 5.5}
                          fill="#64748b"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          strokeDasharray="2 1"
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="mt-2 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Légende de la symbologie scientifique</span>
              <span className="text-[10px] text-slate-400">Distinction temporelle stricte</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500 border border-white inline-block"></span>
                <span>Observation actuelle</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </span>
                <span>Hist. documenté</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full border border-dashed border-amber-400 flex items-center justify-center bg-amber-500/30">
                  <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                </span>
                <span>Hist. rapporté (non vérifié)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white opacity-40 inline-block"></span>
                <span>Ménage enquêté</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Observation Detail Drawer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          {selectedObs ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-teal-100 text-teal-900 px-2 py-0.5 rounded border border-teal-200">
                    {selectedObs.id}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: FACTOR_COLORS[selectedObs.factor_type]?.fill || '#64748b' }}
                  ></span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedObs(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Factor Name */}
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Facteur observé</span>
                <h3 className="text-sm font-bold text-slate-900">
                  {FACTOR_COLORS[selectedObs.factor_type]?.label || selectedObs.factor_type}
                </h3>
              </div>

              {/* Historical Status Alert */}
              {selectedObs.historical_status === 'HISTORICAL_REPORTED_UNVERIFIED' && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900">
                  ⚠️ <strong>Observation historique non vérifiée :</strong> Information rapportée par les riverains.
                </div>
              )}

              {/* Water point notice */}
              {selectedObs.factor_type === 'POINT_EAU' && (
                <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-950">
                  💧 <strong>Point d'eau :</strong> Qualité microbiologique : <strong>NON ANALYSÉE</strong>
                </div>
              )}

              {/* Photo preview if present */}
              {selectedObs.photo_url && (
                <div>
                  <img
                    src={selectedObs.photo_url}
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                </div>
              )}

              {/* Associated Household */}
              {selectedObs.household_id && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ménage associé :</span>
                    <strong className="font-mono text-slate-900">{selectedObs.household_id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distance calculée :</span>
                    <strong className="text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded text-[10px]">
                      {selectedObs.calculated_household_distance_m !== undefined
                        ? `${selectedObs.calculated_household_distance_m} m`
                        : 'Non calculée'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Location details */}
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Aire de santé :</span>
                  <span className="font-semibold text-slate-800">{selectedObs.health_area_id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quartier :</span>
                  <span className="font-semibold text-slate-800">{selectedObs.neighborhood_id}</span>
                </div>
                {selectedObs.street_name && (
                  <div className="flex justify-between">
                    <span>Avenue :</span>
                    <span className="text-slate-800">{selectedObs.street_name}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono pt-1">
                  <span>GPS :</span>
                  <span>{selectedObs.latitude.toFixed(4)}, {selectedObs.longitude.toFixed(4)} (±{selectedObs.gps_accuracy}m)</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Description factuelle</span>
                <p className="text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedObs.description}
                </p>
              </div>

              {/* Action Button */}
              {onSelectObservation && (
                <button
                  type="button"
                  onClick={() => onSelectObservation(selectedObs)}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Voir la fiche d'observation complète
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MapPin className="w-8 h-8 text-slate-300" />
              <div className="font-medium text-slate-600">Aucune observation sélectionnée</div>
              <p className="text-[11px]">
                Cliquez sur un marqueur sur la carte pour afficher ses détails, sa photo et sa distance au ménage associé.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
