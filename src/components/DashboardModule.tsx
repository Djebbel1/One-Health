import React, { useState, useMemo } from 'react';
import {
  Activity,
  Users,
  Layers,
  CloudRain,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Filter,
  BarChart3,
  TrendingUp,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useData } from '../context/DataContext';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_ZONES } from '../data/kinduGeography';

export const DashboardModule: React.FC = () => {
  const {
    householdSurveys,
    environmentalObs,
    healthRecords,
    climateRecords,
    modelMatrix,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedHealthAreaId,
    setSelectedHealthAreaId,
    selectedDisease,
    setSelectedDisease
  } = useData();

  const [selectedSurveyor, setSelectedSurveyor] = useState<string>('ALL');

  // Available Years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    healthRecords.forEach(h => h.year && years.add(h.year));
    climateRecords.forEach(c => c.year && years.add(c.year));
    if (years.size === 0) {
      years.add(2024);
      years.add(2023);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [healthRecords, climateRecords]);

  // Available Surveyors
  const surveyors = useMemo(() => {
    const sSet = new Set<string>();
    householdSurveys.forEach(s => s.surveyor_id && sSet.add(s.surveyor_id));
    environmentalObs.forEach(e => e.surveyor_id && sSet.add(e.surveyor_id));
    return Array.from(sSet);
  }, [householdSurveys, environmentalObs]);

  // Filtered Datasets
  const filteredSurveys = useMemo(() => {
    return householdSurveys.filter(s => {
      if (selectedHealthAreaId !== 'ALL' && s.health_area_id !== selectedHealthAreaId) return false;
      if (selectedSurveyor !== 'ALL' && s.surveyor_id !== selectedSurveyor) return false;
      return true;
    });
  }, [householdSurveys, selectedHealthAreaId, selectedSurveyor]);

  const filteredEnvObs = useMemo(() => {
    return environmentalObs.filter(o => {
      if (selectedHealthAreaId !== 'ALL' && o.health_area_id !== selectedHealthAreaId) return false;
      if (selectedSurveyor !== 'ALL' && o.surveyor_id !== selectedSurveyor) return false;
      return true;
    });
  }, [environmentalObs, selectedHealthAreaId, selectedSurveyor]);

  const filteredHealth = useMemo(() => {
    return healthRecords.filter(h => {
      if (selectedYear !== 0 && h.year !== selectedYear) return false;
      if (selectedMonth !== 0 && h.month !== selectedMonth) return false;
      if (selectedHealthAreaId !== 'ALL' && h.health_area_id !== selectedHealthAreaId) return false;
      if (selectedDisease !== 'TOUS' && h.disease !== selectedDisease) return false;
      return true;
    });
  }, [healthRecords, selectedYear, selectedMonth, selectedHealthAreaId, selectedDisease]);

  const filteredClimate = useMemo(() => {
    return climateRecords.filter(c => {
      if (selectedYear !== 0 && c.year !== selectedYear) return false;
      if (selectedMonth !== 0 && c.month !== selectedMonth) return false;
      return true;
    });
  }, [climateRecords, selectedYear, selectedMonth]);

  // Survey Status Aggregations
  const surveyStats = useMemo(() => {
    const total = filteredSurveys.length;
    const validated = filteredSurveys.filter(s => s.status === 'VALIDATED').length;
    const submitted = filteredSurveys.filter(s => s.status === 'SUBMITTED').length;
    const underReview = filteredSurveys.filter(s => s.status === 'UNDER_REVIEW').length;
    const rejected = filteredSurveys.filter(s => s.status === 'REJECTED').length;
    const drafts = filteredSurveys.filter(s => s.status === 'DRAFT').length;

    return { total, validated, submitted, underReview, rejected, drafts, targetPlanned: 1200 };
  }, [filteredSurveys]);

  // Health Metrics
  const healthStats = useMemo(() => {
    let totalMalaria = 0;
    let malariaHosp = 0;
    let malariaDeaths = 0;

    let totalTyphoid = 0;
    let typhoidHosp = 0;
    let typhoidDeaths = 0;

    filteredHealth.forEach(h => {
      if (h.disease === 'PALUDISME') {
        totalMalaria += h.cases || 0;
        malariaHosp += h.hospitalizations || 0;
        malariaDeaths += h.deaths || 0;
      } else if (h.disease === 'FIEVRE_TYPHOIDE') {
        totalTyphoid += h.cases || 0;
        typhoidHosp += h.hospitalizations || 0;
        typhoidDeaths += h.deaths || 0;
      }
    });

    return { totalMalaria, malariaHosp, malariaDeaths, totalTyphoid, typhoidHosp, typhoidDeaths };
  }, [filteredHealth]);

  // Climate Monthly Series Chart Data
  const monthlyEpidemicClimateData = useMemo(() => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYr = selectedYear === 0 ? 2024 : selectedYear;

    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const healthInMonth = healthRecords.filter(h => h.year === currentYr && h.month === monthNum);
      const climateInMonth = climateRecords.filter(c => c.year === currentYr && c.month === monthNum);

      let palu = 0;
      let typhoide = 0;
      healthInMonth.forEach(h => {
        if (h.disease === 'PALUDISME') palu += h.cases || 0;
        if (h.disease === 'FIEVRE_TYPHOIDE') typhoide += h.cases || 0;
      });

      const avgRain = climateInMonth.length > 0
        ? climateInMonth.reduce((acc, c) => acc + (c.rainfall_mm || 0), 0)
        : 0;
      const avgTemp = climateInMonth.length > 0
        ? climateInMonth.reduce((acc, c) => acc + (c.temp_mean_c ?? c.temperature_mean ?? 26.0), 0) / climateInMonth.length
        : 26;

      return {
        month: monthNames[i],
        paludisme: palu,
        typhoide,
        pluviometrie: Math.round(avgRain),
        temperature: Math.round(avgTemp * 10) / 10,
      };
    });
  }, [healthRecords, climateRecords, selectedYear]);

  // Cases per Health Area Chart Data
  const healthAreaComparisonData = useMemo(() => {
    return KINDU_HEALTH_AREAS.slice(0, 10).map(area => {
      const areaHealth = filteredHealth.filter(h => h.health_area_id === area.id);
      let palu = 0;
      let typhoide = 0;
      areaHealth.forEach(h => {
        if (h.disease === 'PALUDISME') palu += h.cases || 0;
        if (h.disease === 'FIEVRE_TYPHOIDE') typhoide += h.cases || 0;
      });

      return {
        name: area.name.replace('Aire de Santé ', ''),
        paludisme: palu,
        typhoide,
        population: area.population,
      };
    });
  }, [filteredHealth]);

  return (
    <div className="space-y-6">
      {/* Module Title & Filtering Ribbon */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Tableau de Bord & Indicateurs Spatio-Temporels
              </h2>
              <p className="text-xs text-slate-500">
                Suivi analytique consolidé de la recherche épidémiologique et environnementale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Indicateurs descriptifs bruts (Modélisation spatio-temporelle effectuée via R/Python)</span>
          </div>
        </div>

        {/* Global Multi-Filters Bar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Année</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500"
            >
              <option value={0}>Toutes les années</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mois</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500"
            >
              <option value={0}>Tous les mois (Annuel)</option>
              <option value={1}>01 - Janvier</option>
              <option value={2}>02 - Février</option>
              <option value={3}>03 - Mars</option>
              <option value={4}>04 - Avril</option>
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

          {/* Health Area Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aire de Santé</label>
            <select
              value={selectedHealthAreaId}
              onChange={(e) => setSelectedHealthAreaId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Toutes les aires ({KINDU_HEALTH_AREAS.length})</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.commune})</option>
              ))}
            </select>
          </div>

          {/* Disease Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Maladie ciblée</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500"
            >
              <option value="TOUS">Paludisme & Typhoïde</option>
              <option value="PALUDISME">Paludisme seul</option>
              <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde seule</option>
            </select>
          </div>

          {/* Surveyor Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enquêteur terrain</label>
            <select
              value={selectedSurveyor}
              onChange={(e) => setSelectedSurveyor(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">Tous les enquêteurs</option>
              {surveyors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Enquêtes Ménages */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Ménages Enquêtés</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{surveyStats.total}</span>
            <span className="text-xs text-slate-500">/ {surveyStats.targetPlanned} prévus</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="text-emerald-700 font-medium">{surveyStats.validated} validés</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-medium">{surveyStats.underReview + surveyStats.submitted} en cours</span>
          </div>
        </div>

        {/* Card 2: Observations Env */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Observations Env.</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{filteredEnvObs.length}</span>
            <span className="text-xs text-teal-700 font-medium">points géoréférencés</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span>{filteredEnvObs.filter(o => o.larval_presence).length} avec larves</span>
            <span>•</span>
            <span>{filteredEnvObs.filter(o => o.factor_type === 'EAU_STAGNANTE').length} eaux stagnantes</span>
          </div>
        </div>

        {/* Card 3: Cas Paludisme */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Cas Paludisme</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700">{healthStats.totalMalaria.toLocaleString()}</span>
            <span className="text-xs text-slate-500">cas notifiés</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="text-slate-600">{healthStats.malariaHosp} hospitalisés</span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-medium">{healthStats.malariaDeaths} décès</span>
          </div>
        </div>

        {/* Card 4: Cas Fièvre Typhoïde */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Cas Fièvre Typhoïde</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-800">{healthStats.totalTyphoid.toLocaleString()}</span>
            <span className="text-xs text-slate-500">cas déclarés</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="text-slate-600">{healthStats.typhoidHosp} hospitalisés</span>
            <span className="text-slate-300">•</span>
            <span className="text-cyan-800 font-medium">{healthStats.typhoidDeaths} décès</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Évolution spatio-temporelle mensuelle (Cas vs Pluviométrie) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              Séries Chronologiques Mensuelles : Épidémies & Pluviométrie
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparaison des tendances épidémiologiques et de la pluviométrie cumulée (Année {selectedYear || 2024})
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEpidemicClimateData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPalu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="pluviometrie"
                  name="Pluviométrie (mm)"
                  stroke="#0284c7"
                  fillOpacity={1}
                  fill="url(#colorRain)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="paludisme"
                  name="Cas Paludisme"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="typhoide"
                  name="Cas Fièvre Typhoïde"
                  stroke="#0d9488"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Comparatif par Aire de Santé */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              Répartition des Cas Notifiés par Aire de Santé
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparaison des volumes de morbidité enregistrés selon l'aire sanitaire
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthAreaComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', bottom: 0 }} />
                <Bar dataKey="paludisme" name="Paludisme" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="typhoide" name="Fièvre Typhoïde" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quality Control & Status Summary */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">
          État d'Avancement de la Collecte & Validation Superviseur
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">Validées</span>
            <span className="text-xl font-bold text-emerald-900">{surveyStats.validated}</span>
            <span className="text-[10px] text-emerald-700">Formulaires certifiés</span>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-800 block">Soumises</span>
            <span className="text-xl font-bold text-blue-900">{surveyStats.submitted}</span>
            <span className="text-[10px] text-blue-700">En attente de revue</span>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">En Révision</span>
            <span className="text-xl font-bold text-amber-900">{surveyStats.underReview}</span>
            <span className="text-[10px] text-amber-700">Vérification terrain</span>
          </div>

          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 block">Rejetées</span>
            <span className="text-xl font-bold text-rose-900">{surveyStats.rejected}</span>
            <span className="text-[10px] text-rose-700">À corriger par enquêteur</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 border border-slate-300">
            <span className="text-[11px] font-semibold text-slate-700 block">Brouillons</span>
            <span className="text-xl font-bold text-slate-900">{surveyStats.drafts}</span>
            <span className="text-[10px] text-slate-600">Non finalisés</span>
          </div>
        </div>
      </div>
    </div>
  );
};
