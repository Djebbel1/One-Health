import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  CartoLayerConfig,
  CartoDiseaseFilter,
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  HealthFacility,
  WaterPointItem,
  FloodAreaItem,
  DistanceMeasurement,
  HealthAreaInfo,
} from '../../types';
import {
  KINDU_BOUNDS,
  KINDU_HEALTH_AREAS,
  KINDU_HEALTH_FACILITIES,
  calculateGPSDistance,
  CONGO_RIVER_COORDINATES,
} from '../../data/kinduGeography';
import {
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Ruler,
  Eye,
  Info,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface LeafletMapViewProps {
  layers: CartoLayerConfig[];
  selectedYear: number;
  selectedMonth: number | null; // 1-12 or null for full year
  selectedDisease: CartoDiseaseFilter;
  selectedHealthAreaId: string | 'ALL';
  selectedEnvFactor: string | 'ALL';
  healthRecords: HealthRecord[];
  climateRecords: ClimateRecord[];
  environmentalObs: EnvironmentalObservation[];
  householdSurveys: HouseholdSurvey[];
  waterPoints: WaterPointItem[];
  floodAreas: FloodAreaItem[];
  onSelectHealthArea?: (areaId: string) => void;
  onSelectFeature?: (feature: any) => void;
  distanceMeasureMode: boolean;
  onDistanceMeasured?: (dist: DistanceMeasurement) => void;
  onToggleDistanceMode?: () => void;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  layers,
  selectedYear,
  selectedMonth,
  selectedDisease,
  selectedHealthAreaId,
  selectedEnvFactor,
  healthRecords,
  climateRecords,
  environmentalObs,
  householdSurveys,
  waterPoints,
  floodAreas,
  onSelectHealthArea,
  onSelectFeature,
  distanceMeasureMode,
  onDistanceMeasured,
  onToggleDistanceMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});
  const measureMarkersRef = useRef<L.Marker[]>([]);
  const measureLineRef = useRef<L.Polyline | null>(null);

  const [mapBaseType, setMapBaseType] = useState<'CARTO' | 'OSM' | 'SATELLITE' | 'CANVAS'>('CARTO');
  const [currentZoom, setCurrentZoom] = useState<number>(13);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [measureState, setMeasureState] = useState<DistanceMeasurement>({
    pointA: null,
    pointB: null,
    distanceMeters: null,
    distanceKm: null,
    isActive: false,
  });

  // Layer visibility map
  const layerVisibility = useMemo(() => {
    const map: { [id: string]: { visible: boolean; opacity: number } } = {};
    layers.forEach(l => {
      map[l.id] = { visible: l.visible, opacity: l.opacity };
    });
    return map;
  }, [layers]);

  // 1. Filtered Data by Year, Month, Health Area, and Strict Validity Dates
  const filteredData = useMemo(() => {
    // 1.1. Health Records
    const filteredHealth = healthRecords.filter(r => {
      if (r.year !== selectedYear) return false;
      if (selectedMonth !== null && r.month !== selectedMonth) return false;
      if (selectedHealthAreaId !== 'ALL' && r.health_area_id !== selectedHealthAreaId) return false;
      if (selectedDisease === 'PALUDISME' && r.disease !== 'PALUDISME') return false;
      if (selectedDisease === 'FIEVRE_TYPHOIDE' && r.disease !== 'FIEVRE_TYPHOIDE') return false;
      return true;
    });

    // 1.2. Climate Records (Station Resolution = VILLE / AIRPORT)
    const filteredClimate = climateRecords.filter(c => {
      if (c.year !== selectedYear) return false;
      if (selectedMonth !== null && c.month !== selectedMonth) return false;
      return true;
    });

    // 1.3. Environmental Observations with STRICT HISTORICAL VALIDITY
    const filteredEnv = environmentalObs.filter(e => {
      if (!e.latitude || !e.longitude) return false;
      if (selectedHealthAreaId !== 'ALL' && e.health_area_id !== selectedHealthAreaId) return false;
      if (selectedEnvFactor !== 'ALL' && e.factor_type !== selectedEnvFactor) return false;

      // Temporal check using validity_start and validity_end
      const targetDate = selectedMonth
        ? `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-15`
        : `${selectedYear}-06-15`;

      if (e.validity_start && e.validity_end) {
        if (targetDate < e.validity_start || targetDate > e.validity_end) {
          return false;
        }
      } else if (e.observation_date) {
        const obsYear = parseInt(e.observation_date.slice(0, 4), 10);
        if (obsYear !== selectedYear) return false;
        if (selectedMonth !== null) {
          const obsMonth = parseInt(e.observation_date.slice(5, 7), 10);
          if (obsMonth !== selectedMonth) return false;
        }
      }

      return true;
    });

    // 1.4. Households (Anonymized)
    const filteredHouseholds = householdSurveys.filter(h => {
      if (!h.latitude || !h.longitude) return false;
      if (selectedHealthAreaId !== 'ALL' && h.health_area_id !== selectedHealthAreaId) return false;
      if (h.survey_date) {
        const hYear = parseInt(h.survey_date.slice(0, 4), 10);
        if (hYear > selectedYear) return false; // Available from survey year onwards
      }
      return true;
    });

    // 1.5. Water Points
    const filteredWater = waterPoints.filter(w => {
      if (selectedHealthAreaId !== 'ALL' && w.health_area_id !== selectedHealthAreaId) return false;
      return true;
    });

    // 1.6. Flood Areas
    const filteredFloods = floodAreas.filter(f => {
      if (selectedHealthAreaId !== 'ALL' && f.health_area_id !== selectedHealthAreaId) return false;
      return true;
    });

    return {
      health: filteredHealth,
      climate: filteredClimate,
      env: filteredEnv,
      households: filteredHouseholds,
      water: filteredWater,
      floods: filteredFloods,
    };
  }, [
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    waterPoints,
    floodAreas,
    selectedYear,
    selectedMonth,
    selectedDisease,
    selectedHealthAreaId,
    selectedEnvFactor,
  ]);

  // Aggregate health cases by health area
  const healthAreaAggregates = useMemo(() => {
    const agg: { [areaId: string]: { malaria: number; typhoid: number; total: number; facilityCount: number } } = {};
    KINDU_HEALTH_AREAS.forEach(area => {
      agg[area.id] = { malaria: 0, typhoid: 0, total: 0, facilityCount: 0 };
    });

    filteredData.health.forEach(r => {
      if (agg[r.health_area_id]) {
        if (r.disease === 'PALUDISME') {
          agg[r.health_area_id].malaria += r.cases;
        } else if (r.disease === 'FIEVRE_TYPHOIDE') {
          agg[r.health_area_id].typhoid += r.cases;
        }
        agg[r.health_area_id].total += r.cases;
        agg[r.health_area_id].facilityCount += 1;
      }
    });

    return agg;
  }, [filteredData.health]);

  // Current climate summary
  const currentClimateSummary = useMemo(() => {
    if (filteredData.climate.length === 0) return null;
    const totalRain = filteredData.climate.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0);
    const avgTemp = filteredData.climate.reduce((acc, c) => acc + (c.temperature_mean || 26), 0) / filteredData.climate.length;
    const avgHum = filteredData.climate.reduce((acc, c) => acc + (c.humidity_percent || 75), 0) / filteredData.climate.length;
    return {
      rainfall_mm: Math.round(totalRain * 10) / 10,
      temp_c: Math.round(avgTemp * 10) / 10,
      humidity: Math.round(avgHum),
      count: filteredData.climate.length,
    };
  }, [filteredData.climate]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [KINDU_BOUNDS.centerLat, KINDU_BOUNDS.centerLng],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
    });

    // Base Tile Layer
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }
    );
    tileLayer.addTo(map);

    // Layer Groups
    const lgMenages = L.layerGroup().addTo(map);
    const lgEnv = L.layerGroup().addTo(map);
    const lgSante = L.layerGroup().addTo(map);
    const lgClimat = L.layerGroup().addTo(map);
    const lgEau = L.layerGroup().addTo(map);
    const lgInondation = L.layerGroup().addTo(map);
    const lgStructures = L.layerGroup().addTo(map);
    const lgLimites = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      LAYER_01_MENAGES: lgMenages,
      LAYER_02_ENVIRONNEMENT: lgEnv,
      LAYER_03_SANTE: lgSante,
      LAYER_04_CLIMAT: lgClimat,
      LAYER_05_EAU: lgEau,
      LAYER_06_INONDATION: lgInondation,
      LAYER_07_INFRASTRUCTURES_SANITAIRES: lgStructures,
      LAYER_08_LIMITES_ADMINISTRATIVES: lgLimites,
    };

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer when switcher changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let attr = '&copy; CARTO &copy; OpenStreetMap';

    if (mapBaseType === 'OSM') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attr = '&copy; OpenStreetMap contributors';
    } else if (mapBaseType === 'SATELLITE') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = '&copy; Esri &copy; Earthstar Geographics';
    } else if (mapBaseType === 'CANVAS') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attr = '&copy; CARTO Light Positron';
    }

    L.tileLayer(url, { attribution: attr, maxZoom: 19 }).addTo(map);
  }, [mapBaseType]);

  // Handle Distance Measurement Click
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!distanceMeasureMode) {
      // Clear measurement markers and line
      measureMarkersRef.current.forEach(m => map.removeLayer(m));
      measureMarkersRef.current = [];
      if (measureLineRef.current) {
        map.removeLayer(measureLineRef.current);
        measureLineRef.current = null;
      }
      setMeasureState({
        pointA: null,
        pointB: null,
        distanceMeters: null,
        distanceKm: null,
        isActive: false,
      });
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const clickedLat = e.latlng.lat;
      const clickedLng = e.latlng.lng;

      if (!measureState.pointA) {
        // Set Point A
        const markerA = L.circleMarker([clickedLat, clickedLng], {
          radius: 7,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip('Point A (Origine)', { permanent: true, direction: 'top' });

        measureMarkersRef.current = [markerA];

        const newState: DistanceMeasurement = {
          pointA: { lat: clickedLat, lng: clickedLng, label: 'Point A' },
          pointB: null,
          distanceMeters: null,
          distanceKm: null,
          isActive: true,
        };
        setMeasureState(newState);
        onDistanceMeasured?.(newState);
      } else if (!measureState.pointB) {
        // Set Point B and calculate
        const markerB = L.circleMarker([clickedLat, clickedLng], {
          radius: 7,
          fillColor: '#ef4444',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip('Point B (Destination)', { permanent: true, direction: 'top' });

        measureMarkersRef.current.push(markerB);

        const distMeters = Math.round(
          calculateGPSDistance(measureState.pointA.lat, measureState.pointA.lng, clickedLat, clickedLng)
        );
        const distKm = Math.round((distMeters / 1000) * 100) / 100;

        const line = L.polyline(
          [
            [measureState.pointA.lat, measureState.pointA.lng],
            [clickedLat, clickedLng],
          ],
          {
            color: '#2563eb',
            weight: 3,
            dashArray: '6, 6',
          }
        )
          .addTo(map)
          .bindTooltip(`Distance : ${distMeters} m (${distKm} km)`, {
            permanent: true,
            direction: 'center',
            className: 'bg-blue-900 text-white font-bold px-2 py-1 rounded shadow text-xs',
          });

        measureLineRef.current = line;

        const newState: DistanceMeasurement = {
          pointA: measureState.pointA,
          pointB: { lat: clickedLat, lng: clickedLng, label: 'Point B' },
          distanceMeters: distMeters,
          distanceKm: distKm,
          isActive: true,
        };
        setMeasureState(newState);
        onDistanceMeasured?.(newState);
      } else {
        // Reset and set new Point A
        measureMarkersRef.current.forEach(m => map.removeLayer(m));
        measureMarkersRef.current = [];
        if (measureLineRef.current) {
          map.removeLayer(measureLineRef.current);
          measureLineRef.current = null;
        }

        const markerA = L.circleMarker([clickedLat, clickedLng], {
          radius: 7,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip('Point A (Origine)', { permanent: true, direction: 'top' });

        measureMarkersRef.current = [markerA];

        const newState: DistanceMeasurement = {
          pointA: { lat: clickedLat, lng: clickedLng, label: 'Point A' },
          pointB: null,
          distanceMeters: null,
          distanceKm: null,
          isActive: true,
        };
        setMeasureState(newState);
        onDistanceMeasured?.(newState);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [distanceMeasureMode, measureState.pointA, measureState.pointB, onDistanceMeasured]);

  // Render & Update all 8 Cartographic Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lg = layerGroupsRef.current;
    if (!lg) return;

    // Helper to clear group
    Object.values(lg).forEach((group: any) => {
      if (group && typeof group.clearLayers === 'function') {
        group.clearLayers();
      }
    });

    // ------------------------------------------------------------------------
    // LAYER 8: LIMITES ADMINISTRATIVES (AIRES DE SANTÉ & ZONES)
    // ------------------------------------------------------------------------
    const confLimites = layerVisibility['LAYER_08_LIMITES_ADMINISTRATIVES'];
    if (confLimites?.visible) {
      // Draw Congo River line for geographic context
      const riverLatLngs = CONGO_RIVER_COORDINATES.map(c => [c.lat, c.lng] as [number, number]);
      L.polyline(riverLatLngs, {
        color: '#38bdf8',
        weight: 12,
        opacity: 0.35 * confLimites.opacity,
        lineCap: 'round',
        lineJoin: 'round',
      })
        .addTo(lg.LAYER_08_LIMITES_ADMINISTRATIVES)
        .bindTooltip('Fleuve Congo (Lualaba)', { sticky: true });

      // Draw Health Areas polygons
      KINDU_HEALTH_AREAS.forEach(area => {
        const isSelected = selectedHealthAreaId === area.id;
        const polyCoords = area.bounds as [number, number][];

        const polygon = L.polygon(polyCoords, {
          color: isSelected ? '#2563eb' : '#64748b',
          weight: isSelected ? 3 : 1.5,
          dashArray: isSelected ? undefined : '4, 4',
          fillColor: area.zoneId === 'ZS_ALUNGULI' ? '#f59e0b' : '#3b82f6',
          fillOpacity: (isSelected ? 0.22 : 0.08) * confLimites.opacity,
        }).addTo(lg.LAYER_08_LIMITES_ADMINISTRATIVES);

        polygon.on('click', () => {
          onSelectHealthArea?.(area.id);
        });

        // Polygon Popup
        const agg = healthAreaAggregates[area.id] || { malaria: 0, typhoid: 0, total: 0 };
        polygon.bindPopup(`
          <div class="p-2 min-w-[220px]">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${area.zoneId === 'ZS_ALUNGULI' ? 'Rive Gauche (Alunguli)' : 'Rive Droite (Kindu)'}</div>
            <div class="text-base font-bold text-slate-900 mb-1">Aire de santé ${area.name}</div>
            <div class="space-y-1 text-xs text-slate-700">
              <div class="flex justify-between"><span>Population :</span> <span class="font-bold">${area.population.toLocaleString()} hab.</span></div>
              <div class="flex justify-between"><span>Aléa Inondation :</span> <span class="font-bold text-amber-600">${area.floodRiskLevel}</span></div>
              <div class="flex justify-between border-t pt-1 mt-1 text-slate-900 font-semibold">
                <span>Cas observés (${selectedYear}${selectedMonth ? ` / M${selectedMonth}` : ''}) :</span>
                <span class="text-rose-600">${agg.total} cas</span>
              </div>
              <div class="text-[11px] text-slate-500 pl-2">
                • Paludisme : ${agg.malaria} | • Typhoïde : ${agg.typhoid}
              </div>
            </div>
            <button id="btn-select-area-${area.id}" class="mt-2.5 w-full py-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded transition shadow-sm">
              Consulter la fiche détaillée
            </button>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 7: INFRASTRUCTURES SANITAIRES (HGR, CS, PS)
    // ------------------------------------------------------------------------
    const confStructures = layerVisibility['LAYER_07_INFRASTRUCTURES_SANITAIRES'];
    if (confStructures?.visible) {
      KINDU_HEALTH_FACILITIES.forEach(fac => {
        if (!fac.latitude || !fac.longitude) return;

        const isHGR = fac.facility_type.includes('Hôpital');
        const isCS = fac.facility_type.includes('Centre');
        const pinColor = isHGR ? '#dc2626' : isCS ? '#7c3aed' : '#059669';

        const customHtml = `
          <div class="flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-md border-2" style="border-color: ${pinColor}; opacity: ${confStructures.opacity}">
            <span class="font-black text-xs" style="color: ${pinColor}">${isHGR ? 'H' : isCS ? '+' : 'P'}</span>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'custom-facility-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([fac.latitude, fac.longitude], { icon }).addTo(
          lg.LAYER_07_INFRASTRUCTURES_SANITAIRES
        );

        marker.bindPopup(`
          <div class="p-2 min-w-[200px]">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isHGR ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}">${fac.facility_type}</span>
            <h4 class="font-bold text-sm text-slate-900 mt-1">${fac.facility_name}</h4>
            <p class="text-xs text-slate-600 mt-0.5">ID: ${fac.facility_id} | Statut: ${fac.status}</p>
            <div class="text-[11px] text-slate-500 mt-1 border-t pt-1">
              Coordonnées: ${fac.latitude.toFixed(4)}, ${fac.longitude.toFixed(4)}
            </div>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 3: DONNÉES SANITAIRES (CERCLES PROPORTIONNELS & RÉSOUDRES PAR STRUCTURE)
    // ------------------------------------------------------------------------
    const confSante = layerVisibility['LAYER_03_SANTE'];
    if (confSante?.visible) {
      // Group health records by structure coordinates or health area centroid
      const structureAgg: { [key: string]: { lat: number; lng: number; name: string; malaria: number; typhoid: number; areaId: string } } = {};

      filteredData.health.forEach(r => {
        // Find structure coordinate
        const fac = KINDU_HEALTH_FACILITIES.find(f => f.facility_id === r.facility_id || f.facility_name === r.facility_name);
        const area = KINDU_HEALTH_AREAS.find(a => a.id === r.health_area_id);

        const lat = fac?.latitude || area?.coordinates.lat || -2.9535;
        const lng = fac?.longitude || area?.coordinates.lng || 25.9350;
        const key = `${r.facility_name || r.health_area_id}`;

        if (!structureAgg[key]) {
          structureAgg[key] = {
            lat,
            lng,
            name: r.facility_name || area?.name || 'Structure',
            malaria: 0,
            typhoid: 0,
            areaId: r.health_area_id,
          };
        }

        if (r.disease === 'PALUDISME') {
          structureAgg[key].malaria += r.cases;
        } else if (r.disease === 'FIEVRE_TYPHOIDE') {
          structureAgg[key].typhoid += r.cases;
        }
      });

      Object.values(structureAgg).forEach(item => {
        const total = item.malaria + item.typhoid;
        if (total <= 0) return;

        // Proportional circle radius: Math.sqrt(total) scaled
        const radius = Math.min(32, Math.max(6, Math.sqrt(total) * 1.8));

        // Color based on disease selection
        let circleColor = '#e11d48'; // Rose for both
        if (selectedDisease === 'PALUDISME') circleColor = '#ea580c'; // Orange for Malaria
        if (selectedDisease === 'FIEVRE_TYPHOIDE') circleColor = '#9333ea'; // Purple for Typhoid

        const circle = L.circleMarker([item.lat, item.lng], {
          radius,
          fillColor: circleColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.7 * confSante.opacity,
        }).addTo(lg.LAYER_03_SANTE);

        circle.bindPopup(`
          <div class="p-2 min-w-[210px]">
            <div class="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Donnée Sanitaire Consolidée</div>
            <h4 class="font-bold text-sm text-slate-900 mb-1">${item.name}</h4>
            <div class="bg-slate-50 p-2 rounded border border-slate-200 text-xs space-y-1 mb-1">
              <div class="flex justify-between font-bold text-slate-900">
                <span>Total Cas observés :</span>
                <span class="text-rose-600">${total} cas</span>
              </div>
              <div class="flex justify-between text-amber-700">
                <span>• Paludisme :</span>
                <span class="font-semibold">${item.malaria}</span>
              </div>
              <div class="flex justify-between text-purple-700">
                <span>• Fièvre typhoïde :</span>
                <span class="font-semibold">${item.typhoid}</span>
              </div>
            </div>
            <div class="text-[11px] text-slate-500 leading-tight">
              Période : ${selectedYear}${selectedMonth ? ` / Mois ${selectedMonth}` : ' (Année entière)'}<br/>
              Résolution : Structure sanitaire / SNIS DPS Maniema
            </div>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 4: DONNÉES CLIMATIQUES (STATION & MACRO-RÉSOLUTION VILLE)
    // ------------------------------------------------------------------------
    const confClimat = layerVisibility['LAYER_04_CLIMAT'];
    if (confClimat?.visible && filteredData.climate.length > 0) {
      // Station Météorologique FZOA Kindu Aéroport
      const stationLat = -2.9197;
      const stationLng = 25.9150;

      const rainTotal = currentClimateSummary?.rainfall_mm || 0;
      const tempMean = currentClimateSummary?.temp_c || 26;

      const climateIcon = L.divIcon({
        html: `
          <div class="flex flex-col items-center">
            <div class="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-sky-300 animate-pulse" style="opacity: ${confClimat.opacity}">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
            </div>
            <div class="bg-slate-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
              ${rainTotal} mm | ${tempMean}°C
            </div>
          </div>
        `,
        className: 'custom-climate-station-pin',
        iconSize: [60, 50],
        iconAnchor: [30, 25],
      });

      const marker = L.marker([stationLat, stationLng], { icon: climateIcon }).addTo(lg.LAYER_04_CLIMAT);

      marker.bindPopup(`
        <div class="p-2 min-w-[230px]">
          <span class="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px] uppercase">Station Synoptique</span>
          <h4 class="font-bold text-sm text-slate-900 mt-1">Station METTELSAT FZOA (Aéroport)</h4>
          <div class="bg-sky-50 p-2 rounded mt-1 border border-sky-100 space-y-1 text-xs">
            <div class="flex justify-between"><span>Pluviométrie :</span> <span class="font-bold text-sky-900">${rainTotal} mm</span></div>
            <div class="flex justify-between"><span>Température Moy. :</span> <span class="font-bold text-slate-800">${tempMean} °C</span></div>
            <div class="flex justify-between"><span>Humidité relative :</span> <span class="font-bold text-slate-800">${currentClimateSummary?.humidity || 75} %</span></div>
          </div>
          <div class="mt-2 text-[10px] bg-amber-50 text-amber-900 p-1.5 rounded border border-amber-200">
            ⚠️ <strong>Échelle macro :</strong> Données représentatives de l'ensemble de la ville de Kindu (Résolution Ville / Station).
          </div>
        </div>
      `);
    }

    // ------------------------------------------------------------------------
    // LAYER 2: OBSERVATIONS ENVIRONNEMENTALES (GÎTES, DÉCHETS, EAUX STAGNANTES)
    // ------------------------------------------------------------------------
    const confEnv = layerVisibility['LAYER_02_ENVIRONNEMENT'];
    if (confEnv?.visible) {
      filteredData.env.forEach(obs => {
        if (!obs.latitude || !obs.longitude) return;

        // Determine symbol and color based on factor_type
        let markerColor = '#0d9488';
        let factorLabel = 'Environnement';
        let iconSymbol = '📍';

        if (obs.factor_type === 'EAU_STAGNANTE') {
          markerColor = '#0284c7';
          factorLabel = 'Eau Stagnante';
          iconSymbol = '💧';
        } else if (obs.factor_type === 'DECHETS') {
          markerColor = '#d97706';
          factorLabel = 'Dépôt de Déchets';
          iconSymbol = '🗑️';
        } else if (obs.factor_type === 'CANIVEAU') {
          markerColor = '#854d0e';
          factorLabel = 'Caniveau Obstrué';
          iconSymbol = '🪵';
        } else if (obs.factor_type === 'INONDATION') {
          markerColor = '#06b6d4';
          factorLabel = 'Inondation Observée';
          iconSymbol = '🌊';
        } else if (obs.factor_type === 'EAU_USEE') {
          markerColor = '#7c3aed';
          factorLabel = 'Eaux Usées';
          iconSymbol = '🧪';
        } else if (obs.factor_type === 'VEGETATION') {
          markerColor = '#16a34a';
          factorLabel = 'Végétation Dense';
          iconSymbol = '🌿';
        } else {
          markerColor = '#475569';
          factorLabel = obs.other_factor_label || 'Autre Facteur';
          iconSymbol = '🏗️';
        }

        const circle = L.circleMarker([obs.latitude, obs.longitude], {
          radius: 8,
          fillColor: markerColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.85 * confEnv.opacity,
        }).addTo(lg.LAYER_02_ENVIRONNEMENT);

        circle.bindPopup(`
          <div class="p-2 min-w-[220px]">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-sm">${iconSymbol}</span>
              <span class="text-xs font-bold text-slate-800">${factorLabel}</span>
              <span class="ml-auto text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">${obs.id || obs.observation_id}</span>
            </div>
            <p class="text-xs text-slate-700 mb-1.5">${obs.description || 'Observation de terrain.'}</p>
            <div class="text-[11px] bg-slate-50 p-1.5 rounded border space-y-0.5 text-slate-600">
              <div><strong>Aire :</strong> ${obs.health_area_id || 'Kindu'}</div>
              <div><strong>Date relevé :</strong> ${obs.observation_date || 'N/A'}</div>
              <div><strong>Période de validité :</strong> ${obs.validity_start || 'Début'} au ${obs.validity_end || 'Indéterminé'}</div>
              <div><strong>Statut historique :</strong> <span class="font-mono text-teal-700">${obs.historical_status || 'ACTUEL'}</span></div>
            </div>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 5: SOURCES D'EAU (LAYER_05_EAU)
    // ------------------------------------------------------------------------
    const confEau = layerVisibility['LAYER_05_EAU'];
    if (confEau?.visible) {
      filteredData.water.forEach(wp => {
        const isProtected = wp.is_protected;
        const wpColor = isProtected ? '#2563eb' : '#ea580c';

        const circle = L.circleMarker([wp.latitude, wp.longitude], {
          radius: 7,
          fillColor: wpColor,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9 * confEau.opacity,
        }).addTo(lg.LAYER_05_EAU);

        circle.bindPopup(`
          <div class="p-2 min-w-[210px]">
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isProtected ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}">
                ${isProtected ? 'Protégé' : 'Non Protégé'}
              </span>
              <span class="text-[10px] font-mono text-slate-500">${wp.id}</span>
            </div>
            <h4 class="font-bold text-sm text-slate-900 mb-0.5">${wp.name}</h4>
            <p class="text-xs text-slate-600 mb-1">${wp.type_label}</p>
            <div class="text-[11px] space-y-0.5 text-slate-600 bg-slate-50 p-1.5 rounded border">
              <div><strong>Statut :</strong> ${wp.status}</div>
              <div><strong>Qualité documentaire :</strong> ${wp.quality_info}</div>
              <div><strong>Usagers estimés :</strong> ${wp.users_estimate ? `${wp.users_estimate} hab.` : 'ND'}</div>
              <div><strong>Source :</strong> ${wp.source_data}</div>
            </div>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 6: INONDATIONS OBSERVÉES ET ZONES INONDABLES (LAYER_06_INONDATION)
    // ------------------------------------------------------------------------
    const confInondation = layerVisibility['LAYER_06_INONDATION'];
    if (confInondation?.visible) {
      filteredData.floods.forEach(flood => {
        const isObserved = flood.type === 'INONDATION_OBSERVEE';
        const circle = L.circle([flood.latitude, flood.longitude], {
          radius: flood.radius_meters || 200,
          color: isObserved ? '#06b6d4' : '#f59e0b',
          weight: isObserved ? 2 : 1.5,
          dashArray: isObserved ? undefined : '5, 5',
          fillColor: isObserved ? '#06b6d4' : '#fbbf24',
          fillOpacity: (isObserved ? 0.35 : 0.18) * confInondation.opacity,
        }).addTo(lg.LAYER_06_INONDATION);

        circle.bindPopup(`
          <div class="p-2 min-w-[220px]">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isObserved ? 'bg-cyan-100 text-cyan-900' : 'bg-amber-100 text-amber-900'}">
              ${isObserved ? '⚠️ Inondation Effectivement Observée' : '🛡️ Zone Potentiellement Inondable (Topographie)'}
            </span>
            <h4 class="font-bold text-sm text-slate-900 mt-1 mb-0.5">${flood.name}</h4>
            <p class="text-xs text-slate-700 mb-1">${flood.notes || ''}</p>
            <div class="text-[11px] bg-slate-50 p-1.5 rounded border space-y-0.5 text-slate-600">
              ${flood.water_level_cm ? `<div><strong>Hauteur d'eau mesurée :</strong> ${flood.water_level_cm} cm</div>` : ''}
              ${flood.duration_label ? `<div><strong>Durée de submersion :</strong> ${flood.duration_label}</div>` : ''}
              <div><strong>Proximité :</strong> ${flood.proximity_stream || 'Fleuve / Ruisseau'}</div>
              <div><strong>Source :</strong> ${flood.source}</div>
            </div>
          </div>
        `);
      });
    }

    // ------------------------------------------------------------------------
    // LAYER 1: MÉNAGES ENQUÊTÉS (ANONYMISÉ - ZERO PII)
    // ------------------------------------------------------------------------
    const confMenages = layerVisibility['LAYER_01_MENAGES'];
    if (confMenages?.visible) {
      filteredData.households.forEach(h => {
        if (!h.latitude || !h.longitude) return;

        const circle = L.circleMarker([h.latitude, h.longitude], {
          radius: 5,
          fillColor: '#10b981',
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 0.85 * confMenages.opacity,
        }).addTo(lg.LAYER_01_MENAGES);

        // Strict Anonymized Popup (Zero PII)
        circle.bindPopup(`
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center justify-between mb-1">
              <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">Ménage Enquêté</span>
              <span class="font-mono text-[10px] text-slate-500">${h.id || h.household_id}</span>
            </div>
            <div class="text-xs text-slate-800 space-y-1 mt-1">
              <div><strong>Aire de santé :</strong> ${h.health_area_id || 'Kindu'}</div>
              <div><strong>Source d'eau :</strong> ${h.water_source_label || 'Forage / Puits'}</div>
              <div><strong>Latrine disponible :</strong> ${h.latrine_available ? 'Oui' : 'Non'}</div>
              <div><strong>Moustiquaires :</strong> ${h.bednet_number || 0} disponibles</div>
              <div><strong>Date d'enquête :</strong> ${h.survey_date || '2024'}</div>
            </div>
            <div class="mt-2 text-[10px] text-slate-400 border-t pt-1 italic">
              🔒 Données strictement anonymisées conformément au protocole de recherche One Health.
            </div>
          </div>
        `);
      });
    }
  }, [
    layerVisibility,
    filteredData,
    selectedYear,
    selectedMonth,
    selectedDisease,
    selectedHealthAreaId,
    healthAreaAggregates,
    currentClimateSummary,
    onSelectHealthArea,
  ]);

  // Zoom control helpers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    mapInstanceRef.current?.setView([KINDU_BOUNDS.centerLat, KINDU_BOUNDS.centerLng], 13);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Floating Controls HUD Top Right */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        {/* Base Map Switcher */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-slate-200 text-xs flex gap-1 items-center">
          <Layers className="w-3.5 h-3.5 text-slate-500 ml-1" />
          <button
            onClick={() => setMapBaseType('CARTO')}
            className={`px-2 py-1 rounded font-medium transition ${
              mapBaseType === 'CARTO' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setMapBaseType('SATELLITE')}
            className={`px-2 py-1 rounded font-medium transition ${
              mapBaseType === 'SATELLITE' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapBaseType('OSM')}
            className={`px-2 py-1 rounded font-medium transition ${
              mapBaseType === 'OSM' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            OSM
          </button>
        </div>

        {/* Zoom and Reset HUD */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-md border border-slate-200 flex flex-col gap-1 items-center self-end">
          <button
            onClick={handleZoomIn}
            title="Zoomer"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-teal-700 transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Dézoomer"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-teal-700 transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-4 h-[1px] bg-slate-200 my-0.5" />
          <button
            onClick={handleResetBounds}
            title="Recentrer sur Kindu"
            className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-teal-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Distance Measure Mode Toggle */}
        <button
          onClick={onToggleDistanceMode}
          className={`p-2 rounded-lg shadow-md border transition flex items-center gap-1.5 text-xs font-semibold self-end ${
            distanceMeasureMode
              ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
              : 'bg-white/95 backdrop-blur-md text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          title="Outil de mesure de distance"
        >
          <Ruler className="w-4 h-4" />
          <span>{distanceMeasureMode ? 'Mesure Active' : 'Mesurer distance'}</span>
        </button>
      </div>

      {/* Distance Measurement Info Banner (if active) */}
      {distanceMeasureMode && (
        <div className="absolute top-3 left-3 z-[400] bg-blue-900/90 text-white backdrop-blur-md p-3 rounded-lg shadow-lg border border-blue-700 text-xs max-w-sm">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Ruler className="w-4 h-4 text-blue-300" />
            <span>Outil Mesure Géodésique (WGS84)</span>
          </div>
          <p className="text-blue-100 text-[11px] mb-2">
            Cliquez sur un premier point (Point A), puis sur un second point (Point B) pour mesurer la distance.
          </p>
          {measureState.pointA && !measureState.pointB && (
            <div className="bg-blue-800/80 px-2 py-1 rounded text-[11px]">
              Point A sélectionné ({measureState.pointA.lat.toFixed(4)}, {measureState.pointA.lng.toFixed(4)}). Cliquez sur le point B.
            </div>
          )}
          {measureState.pointA && measureState.pointB && (
            <div className="bg-emerald-800/90 px-2.5 py-1.5 rounded text-xs space-y-0.5 border border-emerald-600">
              <div className="font-bold text-emerald-200">Distance calculée :</div>
              <div className="text-base font-extrabold text-white">
                {measureState.distanceMeters?.toLocaleString()} mètres ({measureState.distanceKm} km)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scale & Incompatible Spatial Resolution Warning Banner */}
      {layerVisibility['LAYER_04_CLIMAT']?.visible && layerVisibility['LAYER_03_SANTE']?.visible && (
        <div className="absolute bottom-10 left-3 z-[400] bg-amber-900/90 text-amber-100 text-xs px-3 py-1.5 rounded-lg shadow-md border border-amber-700/60 backdrop-blur-md flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong>Avertissement scientifique :</strong> Données climatiques (Échelle Ville/Station) superposées aux données sanitaires (Échelle Aire de santé).
          </span>
        </div>
      )}

      {/* Coordinates and Zoom HUD Bottom */}
      <div className="absolute bottom-2 right-3 z-[400] bg-slate-900/80 text-slate-300 text-[11px] font-mono px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm border border-slate-700 flex items-center gap-3">
        <span>EPSG:4326 (WGS84)</span>
        <span>
          Lat: {cursorCoords ? cursorCoords.lat.toFixed(4) : KINDU_BOUNDS.centerLat} | Lng:{' '}
          {cursorCoords ? cursorCoords.lng.toFixed(4) : KINDU_BOUNDS.centerLng}
        </span>
        <span className="font-bold text-teal-400">Zoom: {currentZoom}</span>
      </div>
    </div>
  );
};
