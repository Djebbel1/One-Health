import React, { useMemo } from 'react';
import {
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  WaterPointItem,
  FloodAreaItem,
} from '../../types';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_FACILITIES } from '../../data/kinduGeography';
import {
  X,
  MapPin,
  Users,
  Activity,
  Bug,
  Droplet,
  Waves,
  Calendar,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';

interface ZoneProfileDrawerProps {
  areaId: string;
  selectedYear: number;
  healthRecords: HealthRecord[];
  climateRecords: ClimateRecord[];
  environmentalObs: EnvironmentalObservation[];
  householdSurveys: HouseholdSurvey[];
  waterPoints: WaterPointItem[];
  floodAreas: FloodAreaItem[];
  onClose: () => void;
}

export const ZoneProfileDrawer: React.FC<ZoneProfileDrawerProps> = ({
  areaId,
  selectedYear,
  healthRecords,
  climateRecords,
  environmentalObs,
  householdSurveys,
  waterPoints,
  floodAreas,
  onClose,
}) => {
  const areaInfo = useMemo(() => {
    return KINDU_HEALTH_AREAS.find(a => a.id === areaId) || KINDU_HEALTH_AREAS[0];
  }, [areaId]);

  // Filtered records for this specific area and year
  const areaHealth = useMemo(() => {
    return healthRecords.filter(r => r.health_area_id === areaId && r.year === selectedYear);
  }, [healthRecords, areaId, selectedYear]);

  const areaEnv = useMemo(() => {
    return environmentalObs.filter(e => e.health_area_id === areaId);
  }, [environmentalObs, areaId]);

  const areaHouseholds = useMemo(() => {
    return householdSurveys.filter(h => h.health_area_id === areaId);
  }, [householdSurveys, areaId]);

  const areaWater = useMemo(() => {
    return waterPoints.filter(w => w.health_area_id === areaId);
  }, [waterPoints, areaId]);

  const areaFloods = useMemo(() => {
    return floodAreas.filter(f => f.health_area_id === areaId);
  }, [floodAreas, areaId]);

  const areaFacilities = useMemo(() => {
    return KINDU_HEALTH_FACILITIES.filter(f => f.health_area_id === areaId);
  }, [areaId]);

  // Aggregate monthly malaria & typhoid cases for sparkline
  const monthlyStats = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      malaria: 0,
      typhoid: 0,
    }));

    areaHealth.forEach(r => {
      if (r.month && r.month >= 1 && r.month <= 12) {
        if (r.disease === 'PALUDISME') {
          months[r.month - 1].malaria += r.cases;
        } else if (r.disease === 'FIEVRE_TYPHOIDE') {
          months[r.month - 1].typhoid += r.cases;
        }
      }
    });

    return months;
  }, [areaHealth]);

  const totalMalaria = areaHealth.filter(r => r.disease === 'PALUDISME').reduce((acc, r) => acc + r.cases, 0);
  const totalTyphoid = areaHealth.filter(r => r.disease === 'FIEVRE_TYPHOIDE').reduce((acc, r) => acc + r.cases, 0);
  const malariaIncidencePer1000 = Math.round((totalMalaria / (areaInfo.population || 20000)) * 1000 * 10) / 10;
  const typhoidIncidencePer1000 = Math.round((totalTyphoid / (areaInfo.population || 20000)) * 1000 * 10) / 10;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-6 text-slate-800 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-xs font-bold rounded uppercase">
              Fiche Profil Territorial
            </span>
            <span className="text-xs font-mono text-slate-500">{areaInfo.id}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Aire de Santé {areaInfo.name}</h2>
          <p className="text-xs text-slate-600">
            {areaInfo.zoneId === 'ZS_ALUNGULI' ? 'Zone de Santé d\'Alunguli (Rive Gauche)' : 'Zone de Santé de Kindu (Rive Droite)'} • Commune de {areaInfo.commune}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Demographics & Risk Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>Population</span>
          </div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {areaInfo.population.toLocaleString()} hab.
          </div>
          <div className="text-[10px] text-slate-500">Recensement DPS Maniema</div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="text-amber-700 text-[11px] font-semibold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>Paludisme ({selectedYear})</span>
          </div>
          <div className="text-lg font-bold text-amber-900 mt-0.5">
            {totalMalaria} cas
          </div>
          <div className="text-[10px] text-amber-700 font-medium">
            Taux : {malariaIncidencePer1000} ‰ hab.
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div className="text-purple-700 text-[11px] font-semibold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Fièvre Typhoïde ({selectedYear})</span>
          </div>
          <div className="text-lg font-bold text-purple-900 mt-0.5">
            {totalTyphoid} cas
          </div>
          <div className="text-[10px] text-purple-700 font-medium">
            Taux : {typhoidIncidencePer1000} ‰ hab.
          </div>
        </div>

        <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
          <div className="text-cyan-800 text-[11px] font-semibold flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-cyan-600" />
            <span>Aléa Inondation</span>
          </div>
          <div className="text-lg font-bold text-cyan-900 mt-0.5">
            {areaInfo.floodRiskLevel}
          </div>
          <div className="text-[10px] text-cyan-700">Topographie riveraine</div>
        </div>
      </div>

      {/* Monthly Epidemiological Profile Sparkline Table */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-teal-700" />
          <span>Évolution Mensuelle des Cas ({selectedYear})</span>
        </h4>

        <div className="grid grid-cols-12 gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center text-xs">
          {monthlyStats.map(m => (
            <div key={m.month} className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500">M{m.month}</div>
              <div className="bg-amber-100 text-amber-900 font-bold rounded py-0.5 text-[11px]" title={`Paludisme M${m.month} : ${m.malaria} cas`}>
                {m.malaria}
              </div>
              <div className="bg-purple-100 text-purple-900 font-bold rounded py-0.5 text-[11px]" title={`Typhoïde M${m.month} : ${m.typhoid} cas`}>
                {m.typhoid}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400"></span> Paludisme (Cas)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-400"></span> Typhoïde (Cas)</span>
        </div>
      </div>

      {/* Environmental & Health Facilities Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Environmental Factors */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-teal-700" />
            <span>Facteurs Environnementaux Référencés ({areaEnv.length})</span>
          </div>
          {areaEnv.length === 0 ? (
            <p className="text-slate-500 italic">Aucune observation environnementale directe enregistrée.</p>
          ) : (
            <ul className="space-y-1.5">
              {areaEnv.map((e, idx) => (
                <li key={idx} className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">{e.factor_type}</span>
                    <p className="text-[11px] text-slate-500">{e.description || e.street_name}</p>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                    {e.observation_date || 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Water Points and Structures */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-blue-700" />
            <span>Points d'Eau & Structures Sanitaires</span>
          </div>
          <div className="space-y-1.5">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-0.5">Structures Sanitaires Officielles :</span>
              <p className="text-slate-600">{areaInfo.healthStructures.join(', ') || 'Aucune structure'}</p>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-0.5">Points d'Eau Recensés ({areaWater.length}) :</span>
              {areaWater.length === 0 ? (
                <p className="text-slate-500 italic">Aucun point d'eau inventorié.</p>
              ) : (
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {areaWater.map((w, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>• {w.name}</span>
                      <span className={`font-bold ${w.is_protected ? 'text-blue-600' : 'text-amber-600'}`}>
                        {w.is_protected ? 'Protégé' : 'Non protégé'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
