import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Users,
  Droplets,
  Bug,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Navigation,
  Compass,
  FileText
} from 'lucide-react';
import { HouseholdSurvey, RecordStatus } from '../types';
import {
  KINDU_HEALTH_AREAS,
  KINDU_BOUNDS,
  isWithinKindu,
  getHealthAreasByZone
} from '../data/kinduGeography';

interface HouseholdSurveyMapProps {
  surveys: HouseholdSurvey[];
  onSelectSurvey: (survey: HouseholdSurvey) => void;
}

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

export const HouseholdSurveyMap: React.FC<HouseholdSurveyMapProps> = ({
  surveys,
  onSelectSurvey,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeSurvey, setActiveSurvey] = useState<HouseholdSurvey | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 560;

  const filtered = useMemo(() => {
    return surveys.filter((s) => {
      if (selectedArea !== 'ALL' && s.health_area_id !== selectedArea) return false;
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
      return true;
    });
  }, [surveys, selectedArea, selectedStatus]);

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
    const points = riverCoordinates.map((c) => {
      const p = projectCoordinates(c.lat, c.lng, canvasWidth, canvasHeight);
      return `${p.x},${p.y}`;
    });
    return points.join(' ');
  }, []);

  const getMarkerColor = (status: RecordStatus) => {
    switch (status) {
      case 'VALIDATED':
        return '#059669'; // Emerald
      case 'SUBMITTED':
        return '#0284c7'; // Sky
      case 'UNDER_REVIEW':
        return '#6366f1'; // Indigo
      case 'DRAFT':
        return '#d97706'; // Amber
      case 'REJECTED':
        return '#e11d48'; // Rose
      case 'CORRECTED':
        return '#0d9488'; // Teal
      default:
        return '#64748b';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cartographie SIG des Ménages Enquêtés</h3>
            <p className="text-[11px] text-slate-500">
              Visualisation spatiale anonymisée des {filtered.length} points ménages à Kindu.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">Toutes les aires de santé</option>
            {KINDU_HEALTH_AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.commune})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="VALIDATED">Validées</option>
            <option value="SUBMITTED">Soumises</option>
            <option value="DRAFT">Brouillons</option>
            <option value="FLAGGED">Signalées</option>
          </select>
        </div>
      </div>

      {/* Interactive SVG Canvas & Overlay details */}
      <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col items-center justify-center p-2 min-h-[480px]">
        {/* Map Legend Floating */}
        <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/60 text-xs text-white space-y-1.5 z-10 shadow-lg">
          <div className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Légende SIG</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Validée</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Soumise</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Brouillon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-cyan-400 rounded-full"></span>
            <span className="text-[11px] text-cyan-200">Fleuve Congo</span>
          </div>
        </div>

        {/* SVG Drawing Area */}
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto max-h-[560px] select-none"
        >
          {/* Health Area Boundaries Polygons */}
          {KINDU_HEALTH_AREAS.map((area) => {
            const polygonPoints = area.bounds
              .map((coord) => {
                const pt = projectCoordinates(coord[0], coord[1], canvasWidth, canvasHeight);
                return `${pt.x},${pt.y}`;
              })
              .join(' ');

            const center = projectCoordinates(area.coordinates.lat, area.coordinates.lng, canvasWidth, canvasHeight);
            const isSelected = selectedArea === area.id;

            return (
              <g key={area.id}>
                <polygon
                  points={polygonPoints}
                  fill={isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 65, 85, 0.25)'}
                  stroke={isSelected ? '#10b981' : '#475569'}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeDasharray="4 2"
                  className="transition duration-150"
                />
                <text
                  x={center.x}
                  y={center.y - 12}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {area.name}
                </text>
              </g>
            );
          })}

          {/* Congo River Flow */}
          <polyline
            points={riverPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="7"
            strokeOpacity="0.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={canvasWidth * 0.38}
            y={canvasHeight * 0.52}
            fill="#67e8f9"
            fontSize="9"
            fontWeight="bold"
            letterSpacing="2"
            transform={`rotate(-75, ${canvasWidth * 0.38}, ${canvasHeight * 0.52})`}
            className="pointer-events-none opacity-80"
          >
            FLEUVE CONGO
          </text>

          {/* Surveyed Households Markers */}
          {filtered.map((survey) => {
            if (!survey.latitude || !survey.longitude) return null;
            const pt = projectCoordinates(survey.latitude, survey.longitude, canvasWidth, canvasHeight);
            const color = getMarkerColor(survey.status);
            const isTargeted = activeSurvey?.id === survey.id;

            return (
              <g
                key={survey.id}
                onClick={() => setActiveSurvey(survey)}
                className="cursor-pointer group"
              >
                {isTargeted && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isTargeted ? '7' : '5'}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all duration-150 hover:r-7"
                />
              </g>
            );
          })}
        </svg>

        {/* Selected Household Popup Details (Anonymized - strictly research parameters) */}
        {activeSurvey && (
          <div className="absolute bottom-4 right-4 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-2xl space-y-2.5 z-20 text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-slate-900 text-emerald-300 px-2 py-0.5 rounded-md text-[11px]">
                  {activeSurvey.id}
                </span>
                <span className="text-slate-500 font-medium">{activeSurvey.health_area_id}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveSurvey(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Quartier / Rue</span>
                <strong className="text-slate-900">{activeSurvey.street_name || activeSurvey.neighborhood_id}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Taille ménage</span>
                <strong className="text-slate-900">{activeSurvey.hh_size} pers. ({activeSurvey.children_u5} &lt;5a)</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Source d'eau</span>
                <strong className="text-slate-900">{activeSurvey.water_source_label || `Code ${activeSurvey.water_source}`}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Moustiquaires</span>
                <strong className="text-slate-900">{activeSurvey.bednet_used_last_night ?? 0} dormeurs</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                GPS: {activeSurvey.latitude?.toFixed(4)}, {activeSurvey.longitude?.toFixed(4)}
              </span>
              <button
                type="button"
                onClick={() => onSelectSurvey(activeSurvey)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition shadow-xs"
              >
                Consulter fiche ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
