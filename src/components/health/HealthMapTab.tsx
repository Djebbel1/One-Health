import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Map as MapIcon,
  HeartPulse,
  Filter,
  Layers,
  Building2,
  Calendar,
  Info,
  Maximize2,
  Eye
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS, CONGO_RIVER_COORDINATES } from '../../data/kinduGeography';

export const HealthMapTab: React.FC = () => {
  const { healthRecords, healthFacilities } = useData();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Filters
  const [selectedDisease, setSelectedDisease] = useState<'ALL' | 'PALUDISME' | 'FIEVRE_TYPHOIDE'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number | 'ALL'>('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');

  // Compute aggregated stats by area and facility
  const aggregatedStats = useMemo(() => {
    const areaStats: { [areaId: string]: { palu: number; typhoide: number; total: number; hosp: number; deaths: number } } = {};
    const facilityStats: { [facName: string]: { palu: number; typhoide: number; total: number; hosp: number; deaths: number; areaId: string } } = {};

    KINDU_HEALTH_AREAS.forEach(a => {
      areaStats[a.id] = { palu: 0, typhoide: 0, total: 0, hosp: 0, deaths: 0 };
    });

    healthRecords.forEach(r => {
      if (r.year !== selectedYear) return;
      if (selectedMonth !== 'ALL' && r.month !== selectedMonth) return;

      const aId = r.health_area_id;
      if (areaStats[aId]) {
        if (r.disease === 'PALUDISME') areaStats[aId].palu += r.cases || 0;
        if (r.disease === 'FIEVRE_TYPHOIDE') areaStats[aId].typhoide += r.cases || 0;
        areaStats[aId].total += r.cases || 0;
        if (typeof r.hospitalizations === 'number') areaStats[aId].hosp += r.hospitalizations;
        if (typeof r.deaths === 'number') areaStats[aId].deaths += r.deaths;
      }

      const fName = r.facility_name || r.structure_name || 'Centre de Santé';
      if (!facilityStats[fName]) {
        facilityStats[fName] = { palu: 0, typhoide: 0, total: 0, hosp: 0, deaths: 0, areaId: aId };
      }
      if (r.disease === 'PALUDISME') facilityStats[fName].palu += r.cases || 0;
      if (r.disease === 'FIEVRE_TYPHOIDE') facilityStats[fName].typhoide += r.cases || 0;
      facilityStats[fName].total += r.cases || 0;
      if (typeof r.hospitalizations === 'number') facilityStats[fName].hosp += r.hospitalizations;
      if (typeof r.deaths === 'number') facilityStats[fName].deaths += r.deaths;
    });

    return { areaStats, facilityStats };
  }, [healthRecords, selectedYear, selectedMonth]);

  // Color generator for choropleth
  const getAreaColor = (cases: number) => {
    if (cases > 300) return '#991b1b'; // dark red
    if (cases > 150) return '#e11d48'; // red
    if (cases > 80) return '#f97316'; // orange
    if (cases > 30) return '#facc15'; // yellow
    return '#a7f3d0'; // light green
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.955, 25.925],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | One Health Kindu',
        maxZoom: 18,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount if needed
    };
  }, []);

  // Update map layers on filter/data change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Draw Congo River
    const riverPolyline = L.polyline(
      CONGO_RIVER_COORDINATES.map(c => [c.lat, c.lng] as [number, number]),
      {
        color: '#0284c7',
        weight: 8,
        opacity: 0.7,
      }
    );
    riverPolyline.bindTooltip('Fleuve Congo (Kindu)', { sticky: true });
    layerGroup.addLayer(riverPolyline);

    // 2. Draw Health Areas Polygons
    KINDU_HEALTH_AREAS.forEach(area => {
      const stats = aggregatedStats.areaStats[area.id] || { palu: 0, typhoide: 0, total: 0, hosp: 0, deaths: 0 };
      const displayCases = selectedDisease === 'PALUDISME' ? stats.palu : selectedDisease === 'FIEVRE_TYPHOIDE' ? stats.typhoide : stats.total;

      const polygon = L.polygon(
        area.bounds || [],
        {
          color: '#334155',
          weight: 1.5,
          fillColor: getAreaColor(displayCases),
          fillOpacity: 0.45,
        }
      );

      const tooltipContent = `
        <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
          <strong style="color: #0f172a; font-size: 12px;">${area.name}</strong><br/>
          <span>Zone : ${area.zoneId === 'ZS_KINDU' ? 'Kindu' : 'Alunguli'}</span><br/>
          <span>Population : ${area.population.toLocaleString()}</span><br/>
          <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;"/>
          <span style="color: #e11d48; font-weight: bold;">Paludisme : ${stats.palu} cas</span><br/>
          <span style="color: #d97706; font-weight: bold;">Fièvre Typhoïde : ${stats.typhoide} cas</span><br/>
          <span>Hospitalisations : ${stats.hosp} | Décès : ${stats.deaths}</span>
        </div>
      `;

      polygon.bindPopup(tooltipContent);
      polygon.bindTooltip(`<strong>${area.name}</strong>: ${displayCases} cas`, { sticky: true });
      layerGroup.addLayer(polygon);
    });

    // 3. Draw Health Facilities Markers / Proportional Circles
    healthFacilities.forEach(fac => {
      if (!fac.latitude || !fac.longitude) return;

      const fStats = aggregatedStats.facilityStats[fac.facility_name] || { palu: 0, typhoide: 0, total: 0, hosp: 0, deaths: 0 };
      const val = selectedDisease === 'PALUDISME' ? fStats.palu : selectedDisease === 'FIEVRE_TYPHOIDE' ? fStats.typhoide : fStats.total;

      const radius = Math.max(6, Math.min(24, Math.sqrt(val + 1) * 3));

      const circle = L.circleMarker([fac.latitude, fac.longitude], {
        radius,
        fillColor: fac.facility_type === 'HGR' ? '#be123c' : '#0d9488',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.85,
      });

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
          <div style="font-size: 12px; font-weight: bold; color: #0f172a;">${fac.facility_name}</div>
          <div style="color: #64748b; font-size: 10px;">Type : ${fac.facility_type} | Aire : ${fac.health_area_id}</div>
          <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;"/>
          <div><strong>Paludisme :</strong> ${fStats.palu} cas</div>
          <div><strong>Fièvre Typhoïde :</strong> ${fStats.typhoide} cas</div>
          <div><strong>Hospitalisations :</strong> ${fStats.hosp}</div>
          <div><strong>Décès déclarés :</strong> ${fStats.deaths}</div>
        </div>
      `;

      circle.bindPopup(popupContent);
      circle.bindTooltip(`🏥 ${fac.facility_name} (${val} cas)`, { direction: 'top' });
      layerGroup.addLayer(circle);
    });

  }, [aggregatedStats, selectedDisease, healthFacilities]);

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-rose-600" />
            <span>Cartographie Sanitaire & Surveillance Spatiale</span>
          </h2>
          <p className="text-xs text-slate-500">
            Répartition des cas par structure sentinelle et aire de santé (Kindu & Alunguli)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Disease */}
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-rose-900"
          >
            <option value="ALL">Toutes pathologies (Palu + Typhoïde)</option>
            <option value="PALUDISME">Paludisme (Plasmodium falciparum)</option>
            <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde (Salmonella Typhi)</option>
          </select>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
          >
            <option value={2024}>Année 2024</option>
            <option value={2023}>Année 2023</option>
          </select>

          {/* Month */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
          >
            <option value="ALL">Tous les mois</option>
            <option value={1}>01 - Janvier</option>
            <option value={2}>02 - Février</option>
            <option value={3}>03 - Mars</option>
            <option value={4}>04 - Avril (Crues)</option>
            <option value={5}>05 - Mai</option>
            <option value={6}>06 - Juin</option>
            <option value={7}>07 - Juillet</option>
            <option value={8}>08 - Août</option>
            <option value={9}>09 - Septembre</option>
            <option value={10}>10 - Octobre</option>
            <option value={11}>11 - Novembre</option>
            <option value={12}>12 - Décembre</option>
          </select>
        </div>
      </div>

      {/* Map Container & Overlay Legend */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden h-[540px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-slate-200 shadow-md text-xs space-y-2.5 z-10 max-w-xs">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>Légende Sanitaire</span>
            <Layers className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Charge par Aire de Santé</div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#991b1b]" />
              <span>Très élevée (&gt; 300 cas)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#e11d48]" />
              <span>Élevée (150 – 300 cas)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#f97316]" />
              <span>Moyenne (80 – 150 cas)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#facc15]" />
              <span>Modérée (30 – 80 cas)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#a7f3d0]" />
              <span>Faible (&lt; 30 cas)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Structures Sentinelles</div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#be123c] border border-white" />
              <span>Hôpital Général (HGR)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0d9488] border border-white" />
              <span>Centre / Poste de Santé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 bg-[#0284c7] rounded-xs" />
              <span>Fleuve Congo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
