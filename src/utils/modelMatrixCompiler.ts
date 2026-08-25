import {
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  ModelMatrixRow
} from '../types';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_ZONES } from '../data/kinduGeography';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Checks if two date intervals [start1, end1] and [start2, end2] overlap
 */
function intervalsOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  if (!start1 || !end1 || !start2 || !end2) return false;
  return start1 <= end2 && end1 >= start2;
}

/**
 * Compile spatio-temporal matrix: Health Area x Year x Month
 * STRICTLY ENFORCES non-extrapolation of environmental observations to historical periods.
 */
export function compileModelMatrix(
  healthRecords: HealthRecord[],
  climateRecords: ClimateRecord[],
  environmentalObs: EnvironmentalObservation[],
  householdSurveys: HouseholdSurvey[]
): ModelMatrixRow[] {
  // Collect all unique Year x Month combinations from available data
  const yearMonthCombos = new Set<string>();

  for (const hr of healthRecords) {
    if (hr.year && hr.month) {
      yearMonthCombos.add(`${hr.year}-${String(hr.month).padStart(2, '0')}`);
    }
  }
  for (const cr of climateRecords) {
    if (cr.year && cr.month) {
      yearMonthCombos.add(`${cr.year}-${String(cr.month).padStart(2, '0')}`);
    }
  }

  // Sort year-months chronologically
  const sortedPeriods = Array.from(yearMonthCombos).sort();

  // Climate map for quick lookup: YYYY-MM -> climate metrics
  const climateMap = new Map<string, {
    rainfall: number;
    tempMean: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
  }>();

  for (const period of sortedPeriods) {
    const [yStr, mStr] = period.split('-');
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);

    const matchingClimate = climateRecords.filter(c => c.year === y && c.month === m);
    if (matchingClimate.length > 0) {
      const totalRain = matchingClimate.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0);
      const avgTemp = matchingClimate.reduce((acc, c) => acc + (c.temp_mean_c ?? c.temperature_mean ?? 26.0), 0) / matchingClimate.length;
      const minTemp = Math.min(...matchingClimate.map(c => c.temp_min_c ?? c.temperature_min ?? 20));
      const maxTemp = Math.max(...matchingClimate.map(c => c.temp_max_c ?? c.temperature_max ?? 30));
      const avgHum = matchingClimate.reduce((acc, c) => acc + (c.humidity_pct ?? c.humidity_percent ?? 75), 0) / matchingClimate.length;

      climateMap.set(period, {
        rainfall: Math.round(totalRain * 10) / 10,
        tempMean: Math.round(avgTemp * 10) / 10,
        tempMin: Math.round(minTemp * 10) / 10,
        tempMax: Math.round(maxTemp * 10) / 10,
        humidity: Math.round(avgHum),
      });
    }
  }

  const matrix: ModelMatrixRow[] = [];

  for (const area of KINDU_HEALTH_AREAS) {
    const zone = KINDU_HEALTH_ZONES.find(z => z.id === area.zoneId);
    const zoneName = zone ? zone.name : 'Zone de Santé de Kindu';

    for (let i = 0; i < sortedPeriods.length; i++) {
      const period = sortedPeriods[i];
      const [yStr, mStr] = period.split('-');
      const year = parseInt(yStr, 10);
      const month = parseInt(mStr, 10);

      // Period date range: e.g. "2024-04-01" to "2024-04-30"
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
      const monthEnd = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

      // 1. Health data for this AS x Year x Month
      const matchingHealth = healthRecords.filter(
        h => h.health_area_id === area.id && h.year === year && h.month === month
      );

      let malariaCases = 0;
      let malariaHosp = 0;
      let malariaDeaths = 0;

      let typhoidCases = 0;
      let typhoidHosp = 0;
      let typhoidDeaths = 0;

      for (const h of matchingHealth) {
        const c = typeof h.cases === 'number' ? h.cases : 0;
        const hosp = typeof h.hospitalizations === 'number' ? h.hospitalizations : 0;
        const d = typeof h.deaths === 'number' ? h.deaths : 0;

        if (h.disease === 'PALUDISME') {
          malariaCases += c;
          malariaHosp += hosp;
          malariaDeaths += d;
        } else if (h.disease === 'FIEVRE_TYPHOIDE') {
          typhoidCases += c;
          typhoidHosp += hosp;
          typhoidDeaths += d;
        }
      }

      const malariaIncidence = area.population > 0 
        ? Math.round((malariaCases / area.population) * 1000 * 10) / 10 
        : 0;
      const typhoidIncidence = area.population > 0
        ? Math.round((typhoidCases / area.population) * 1000 * 10) / 10 
        : 0;

      // 2. Climate & Lag-1 Calculation
      const currentClimate = climateMap.get(period) || {
        rainfall: 0,
        tempMean: 26.0,
        tempMin: 21.0,
        tempMax: 31.0,
        humidity: 78,
      };

      // Previous month period string
      const prevDate = new Date(year, month - 2, 1);
      const prevPeriod = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
      const prevClimate = climateMap.get(prevPeriod);
      const rainfallLag1 = prevClimate ? prevClimate.rainfall : currentClimate.rainfall;
      const tempLag1 = prevClimate ? prevClimate.tempMean : currentClimate.tempMean;

      // 3. Environmental observations strictly valid during THIS SPECIFIC MONTH
      // RÈGLE SCIENTIFIQUE FONDAMENTALE : validation de chevauchement strict
      const validAreaObs = environmentalObs.filter(obs => {
        if (obs.health_area_id !== area.id) return false;
        return intervalsOverlap(obs.validity_start, obs.validity_end, monthStart, monthEnd);
      });

      const validStagnant = validAreaObs.filter(o => o.factor_type === 'EAU_STAGNANTE').length;
      const validWaste = validAreaObs.filter(o => o.factor_type === 'DECHETS_VISIBLES').length;
      const validGutters = validAreaObs.filter(o => o.factor_type === 'CANIVEAU_OBSTRUE').length;

      // 4. Household survey indicators for this health area
      const areaSurveys = householdSurveys.filter(s => s.health_area_id === area.id);
      let pctBednet = 70;
      let pctWaterImproved = 45;
      let pctLatrineImproved = 40;
      let pctExposedStagnant = 35;

      if (areaSurveys.length > 0) {
        const totalPeople = areaSurveys.reduce((acc, s) => acc + s.hh_size, 0);
        const sleptUnderMild = areaSurveys.reduce((acc, s) => acc + s.bednet_used_last_night, 0);
        pctBednet = totalPeople > 0 ? Math.round((sleptUnderMild / totalPeople) * 100) : 70;

        const improvedWater = areaSurveys.filter(
          s => s.water_treatment_method !== 'AUCUN' || s.water_source === 1 || s.water_source === 3
        ).length;
        pctWaterImproved = Math.round((improvedWater / areaSurveys.length) * 100);

        const improvedLatrines = areaSurveys.filter(
          s => s.latrine_type === 'CHASSE_FOSSE_SEPTIQUE' || s.latrine_type === 'FOSSE_VIP_AMELIOREE'
        ).length;
        pctLatrineImproved = Math.round((improvedLatrines / areaSurveys.length) * 100);

        const exposedCount = areaSurveys.filter(s => s.stagnant_water_near).length;
        pctExposedStagnant = Math.round((exposedCount / areaSurveys.length) * 100);
      }

      // 5. Completeness score (0 - 100%)
      let score = 0;
      if (matchingHealth.length > 0) score += 40;
      if (climateMap.has(period)) score += 30;
      if (validAreaObs.length > 0) score += 15;
      if (areaSurveys.length > 0) score += 15;

      matrix.push({
        id: `${area.id}_${year}_${String(month).padStart(2, '0')}`,
        health_area_id: area.id,
        health_area_name: area.name,
        zone_name: zoneName,
        commune: area.commune,
        year,
        month,
        month_label: `${MONTH_NAMES[month - 1]} ${year}`,
        population: area.population,

        malaria_cases: malariaCases,
        malaria_incidence_per_1000: malariaIncidence,
        malaria_hospitalizations: malariaHosp,
        malaria_deaths: malariaDeaths,

        typhoid_cases: typhoidCases,
        typhoid_incidence_per_1000: typhoidIncidence,
        typhoid_hospitalizations: typhoidHosp,
        typhoid_deaths: typhoidDeaths,

        rainfall_mm: currentClimate.rainfall,
        temp_mean: currentClimate.tempMean,
        temp_min: currentClimate.tempMin,
        temp_max: currentClimate.tempMax,
        humidity_percent: currentClimate.humidity,

        temp_mean_c: currentClimate.tempMean,
        temp_min_c: currentClimate.tempMin,
        temp_max_c: currentClimate.tempMax,
        humidity_pct: currentClimate.humidity,

        rainfall_lag1_mm: rainfallLag1,
        temp_lag1_mean: tempLag1,

        valid_stagnant_water_obs: validStagnant,
        valid_waste_obs: validWaste,
        valid_clogged_gutters: validGutters,
        active_breeding_sites_count: validStagnant + validGutters,
        flood_presence: climateRecords.filter(c => c.year === year && c.month === month).some(c => c.flooding_observed),

        surveyed_households_count: areaSurveys.length,
        pct_water_improved: pctWaterImproved,
        pct_latrine_improved: pctLatrineImproved,
        pct_bednet_usage: pctBednet,
        pct_exposed_stagnant_water: pctExposedStagnant,
        bednet_coverage_rate: pctBednet,
        protected_water_access_rate: pctWaterImproved,

        data_completeness_pct: score,
      });
    }
  }

  return matrix;
}
