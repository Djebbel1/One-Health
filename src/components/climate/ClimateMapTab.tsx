import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Info,
  Calendar,
  Compass,
  Building2,
  Eye
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ClimateStation, ClimateRecord } from '../../types';
import { KINDU_HEALTH_ZONES } from '../../data/kinduGeography';

export const ClimateMapTab: React.FC = () => {
  const { climateStations, climateRecords } = useData();

  const [selectedStation, setSelectedStation] = useState<ClimateStation | null>(climateStations[0] || null);
  const [activeLayer, setActiveLayer] = useState<'STATIONS' | 'RAINFALL' | 'TEMPERATURE'>('STATIONS');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Aggregated observations for selected station
  const stationRecords = useMemo(() => {
    if (!selectedStation) return [];
    return climateRecords.filter(r => 
      (r.station_id === selectedStation.station_id || r.location_id === selectedStation.station_id || r.location_name === selectedStation.station_name) &&
      r.year === selectedYear
    );
  }, [selectedStation, climateRecords, selectedYear]);

  // Total station rain
  const totalStationRain = useMemo(() => {
    return stationRecords.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0);
  }, [stationRecords]);

  // Kindu bounding box approximate coordinates for SVG map
  // Lat: -2.98 to -2.90 (North-South)
  // Lng: 25.88 to 25.96 (West-East)
  const minLat = -2.99;
  const maxLat = -2.88;
  const minLng = 25.86;
  const maxLng = 25.97;

  const latToY = (lat: number) => {
    return ((maxLat - lat) / (maxLat - minLat)) * 400 + 40;
  };

  const lngToX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng)) * 500 + 50;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Strict V1.4 Boundary Notice */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <h3 className="font-bold flex items-center gap-2 text-sm text-sky-400">
            <Compass className="w-4 h-4" />
            Cartographie des Postes & Stations Météorologiques de Kindu
          </h3>
          <p className="text-slate-300 mt-0.5">
            Localisation spatiale stricte des capteurs sol et des centroïdes de maillage satellitaire.
          </p>
        </div>
        <div className="bg-amber-500/20 border border-amber-400/40 text-amber-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold">
          Protocole V1.4 : Aucune interpolation de risque sanitaire ni prédiction.
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Couche de Visualisation
            </label>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveLayer('STATIONS')}
                className={`px-3 py-1.5 rounded-md transition ${activeLayer === 'STATIONS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Stations & Capteurs
              </button>
              <button
                onClick={() => setActiveLayer('RAINFALL')}
                className={`px-3 py-1.5 rounded-md transition ${activeLayer === 'RAINFALL' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Précipitations (mm)
              </button>
              <button
                onClick={() => setActiveLayer('TEMPERATURE')}
                className={`px-3 py-1.5 rounded-md transition ${activeLayer === 'TEMPERATURE' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Températures (°C)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Année de Référence
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {climateStations.length} stations enregistrées sur la zone d'étude
        </div>
      </div>

      {/* Main Interactive Map & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Map */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[480px]">
          {/* Map Watermark / Legend */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Réseau Climatologique Kindu
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Station Météorologique Actif</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
              <span>Grille Satellitaire CHIRPS / ERA5</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-4 h-1 bg-cyan-500"></span>
              <span>Fleuve Congo</span>
            </div>
          </div>

          <svg viewBox="0 0 600 480" className="w-full h-full max-h-[480px]">
            {/* River Congo representation */}
            <path
              d="M 280 20 Q 310 120, 290 200 T 330 360 T 310 470"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 280 20 Q 310 120, 290 200 T 330 360 T 310 470"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.8"
            />
            <text x="340" y="240" fill="#22d3ee" fontSize="10" fontWeight="bold" opacity="0.8" transform="rotate(75, 340, 240)">
              Fleuve Congo
            </text>

            {/* Health Zones boundaries outlines */}
            <rect x="80" y="60" width="200" height="360" rx="16" fill="#1e293b" fillOpacity="0.3" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="100" y="90" fill="#94a3b8" fontSize="11" fontWeight="bold">ZS KINDU (Rive Gauche)</text>

            <rect x="330" y="60" width="200" height="180" rx="16" fill="#1e293b" fillOpacity="0.3" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="350" y="90" fill="#94a3b8" fontSize="11" fontWeight="bold">ZS KASUKU (Centre)</text>

            <rect x="330" y="260" width="200" height="180" rx="16" fill="#1e293b" fillOpacity="0.3" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="350" y="290" fill="#94a3b8" fontSize="11" fontWeight="bold">ZS ALUNGULI (Rive Droite)</text>

            {/* Weather Stations Markers */}
            {climateStations.map((st) => {
              const cx = lngToX(st.longitude);
              const cy = latToY(st.latitude);
              const isSelected = selectedStation?.station_id === st.station_id;

              return (
                <g
                  key={st.station_id}
                  onClick={() => setSelectedStation(st)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse if selected */}
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="18" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                  )}

                  {/* Base Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "10" : "7"}
                    fill={st.station_type === 'SATELLITE_CHIRPS' || st.station_type === 'SATELLITE_ERA5' ? '#6366f1' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#f8fafc'}
                    fontSize="9"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="drop-shadow"
                  >
                    {st.station_name.split(' ')[0]} ({st.station_id})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Station Detail Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {selectedStation ? (
            <>
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded uppercase">
                  {selectedStation.station_type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedStation.station_name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {selectedStation.station_id} • Opérateur : {selectedStation.operator}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Coordonnées GPS</span>
                  <p className="font-semibold text-slate-800 font-mono">
                    {selectedStation.latitude.toFixed(4)}° N
                  </p>
                  <p className="font-semibold text-slate-800 font-mono">
                    {selectedStation.longitude.toFixed(4)}° E
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Altitude & Statut</span>
                  <p className="font-semibold text-slate-800">
                    {selectedStation.altitude ? `${selectedStation.altitude} m` : 'N/D'}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    {selectedStation.status}
                  </span>
                </div>
              </div>

              {/* Records for this station */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Relevés enregistrés en {selectedYear}</span>
                  <span className="text-sky-600 font-normal">({stationRecords.length} mois)</span>
                </span>

                {stationRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun relevé disponible pour {selectedYear}.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {stationRecords.map(r => (
                      <div key={r.id} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between text-xs transition">
                        <span className="font-medium text-slate-800">
                          Mois {r.month} / {r.year}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sky-700">
                            {r.rainfall_mm !== null ? `${r.rainfall_mm} mm` : 'N/D'}
                          </span>
                          <span className="font-bold text-amber-700">
                            {(r.temp_mean_c ?? r.temperature_mean) !== null ? `${r.temp_mean_c ?? r.temperature_mean} °C` : 'N/D'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Annual Cumulative for this station */}
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-sky-900 font-bold block">Cumul Pluviométrique {selectedYear}</span>
                  <span className="text-[11px] text-sky-700">Total mesuré sur l'année</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-sky-950">{Math.round(totalStationRain * 10) / 10}</span>
                  <span className="text-xs font-bold text-sky-800 ml-1">mm</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">Sélectionnez une station sur la carte pour inspecter ses caractéristiques.</p>
          )}
        </div>
      </div>
    </div>
  );
};
