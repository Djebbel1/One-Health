import React, { useState, useMemo } from 'react';
import {
  Activity,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  Users,
  ShieldCheck,
  Flame,
  Droplets
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_ZONES } from '../../data/kinduGeography';

export const HealthDashboardTab: React.FC = () => {
  const { healthRecords, healthFacilities } = useData();

  // Filters
  const [filterYear, setFilterYear] = useState<number | 'ALL'>(2024);
  const [filterDisease, setFilterDisease] = useState<'ALL' | 'PALUDISME' | 'FIEVRE_TYPHOIDE'>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return healthRecords.filter(r => {
      if (filterYear !== 'ALL' && r.year !== filterYear) return false;
      if (filterDisease !== 'ALL' && r.disease !== filterDisease) return false;
      if (filterArea !== 'ALL' && r.health_area_id !== filterArea) return false;
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      return true;
    });
  }, [healthRecords, filterYear, filterDisease, filterArea, filterStatus]);

  // Overall Statistics
  const stats = useMemo(() => {
    let totalCases = 0;
    let totalHosp = 0;
    let totalDeaths = 0;
    let malariaCases = 0;
    let typhoidCases = 0;
    let validatedCount = 0;
    let pendingCount = 0;

    const activeFacilities = new Set<string>();

    filteredRecords.forEach(r => {
      totalCases += r.cases || 0;
      if (typeof r.hospitalizations === 'number') totalHosp += r.hospitalizations;
      if (typeof r.deaths === 'number') totalDeaths += r.deaths;

      if (r.disease === 'PALUDISME') malariaCases += r.cases || 0;
      if (r.disease === 'FIEVRE_TYPHOIDE') typhoidCases += r.cases || 0;

      if (r.status === 'VALIDATED') validatedCount++;
      else pendingCount++;

      const fName = r.facility_name || r.structure_name;
      if (fName) activeFacilities.add(fName);
    });

    const hospRate = totalCases > 0 ? ((totalHosp / totalCases) * 100).toFixed(1) : '0';
    const caseFatalityRate = totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(2) : '0';

    return {
      totalCases,
      totalHosp,
      totalDeaths,
      malariaCases,
      typhoidCases,
      validatedCount,
      pendingCount,
      facilitiesCount: activeFacilities.size,
      hospRate,
      caseFatalityRate,
    };
  }, [filteredRecords]);

  // Monthly trends (1 to 12)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months.map((monthName, idx) => {
      const monthNum = idx + 1;
      const monthRecords = filteredRecords.filter(r => r.month === monthNum);

      let palu = 0;
      let typhoide = 0;
      let hosp = 0;
      let deces = 0;

      monthRecords.forEach(r => {
        if (r.disease === 'PALUDISME') palu += r.cases || 0;
        if (r.disease === 'FIEVRE_TYPHOIDE') typhoide += r.cases || 0;
        if (typeof r.hospitalizations === 'number') hosp += r.hospitalizations;
        if (typeof r.deaths === 'number') deces += r.deaths;
      });

      return {
        month: monthName,
        Paludisme: palu,
        'Fièvre Typhoïde': typhoide,
        Total: palu + typhoide,
        Hospitalisations: hosp,
        Décès: deces,
      };
    });
  }, [filteredRecords]);

  // Area distribution
  const areaData = useMemo(() => {
    return KINDU_HEALTH_AREAS.map(area => {
      const areaRecords = filteredRecords.filter(r => r.health_area_id === area.id);
      let palu = 0;
      let typhoide = 0;

      areaRecords.forEach(r => {
        if (r.disease === 'PALUDISME') palu += r.cases || 0;
        if (r.disease === 'FIEVRE_TYPHOIDE') typhoide += r.cases || 0;
      });

      return {
        name: area.name.replace(' (Rive Gauche)', '').replace(' (UNIKI)', ''),
        Paludisme: palu,
        'Fièvre Typhoïde': typhoide,
        Total: palu + typhoide,
        population: area.population,
        incidencePalu: area.population > 0 ? Math.round((palu / area.population) * 1000) : 0,
      };
    }).sort((a, b) => b.Total - a.Total);
  }, [filteredRecords]);

  // Disease share pie
  const pieData = [
    { name: 'Paludisme (P. falciparum)', value: stats.malariaCases, color: '#e11d48' },
    { name: 'Fièvre Typhoïde (S. Typhi)', value: stats.typhoidCases, color: '#f59e0b' },
  ];

  // Age group distribution
  const ageGroupData = useMemo(() => {
    const groups: { [key: string]: number } = {
      '<5 ANS': 0,
      '5–14 ANS': 0,
      '15–24 ANS': 0,
      '25–44 ANS': 0,
      '45–64 ANS': 0,
      '65 ANS ET PLUS': 0,
      'TOUS ÂGES / NON VENTILÉ': 0,
    };

    filteredRecords.forEach(r => {
      const grp = r.age_group || 'TOUS ÂGES / NON VENTILÉ';
      if (groups[grp] !== undefined) {
        groups[grp] += r.cases || 0;
      } else {
        groups['TOUS ÂGES / NON VENTILÉ'] += r.cases || 0;
      }
    });

    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <span>Tableau de Bord Épidémiologique & Sanitaire (V1.3)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Surveillance sentinelle et agrégation des pathologies hydriques et vectorielles à Kindu
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{stats.validatedCount} fiches validées / {filteredRecords.length} fiches actives</span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Année</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les années (2023 - 2024)</option>
              <option value={2024}>Année 2024</option>
              <option value={2023}>Année 2023</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Pathologie</label>
            <select
              value={filterDisease}
              onChange={(e) => setFilterDisease(e.target.value as any)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Paludisme & Fièvre Typhoïde</option>
              <option value="PALUDISME">Paludisme uniquement</option>
              <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde uniquement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Aire de Santé</label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les 8 Aires de Santé</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Statut Fiche</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="VALIDATED">Validées uniquement</option>
              <option value="UNDER_REVIEW">En attente de revue</option>
              <option value="IMPORTED">Importées brutes</option>
              <option value="DRAFT">Brouillons</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Cas Notifiés</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalCases.toLocaleString('fr-FR')}</div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
            <span className="font-semibold text-rose-600">{stats.malariaCases.toLocaleString()} Palu</span>
            <span>•</span>
            <span className="font-semibold text-amber-600">{stats.typhoidCases.toLocaleString()} Typhoïde</span>
          </div>
        </div>

        {/* Hospitalizations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Hospitalisations</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalHosp.toLocaleString('fr-FR')}</div>
          <div className="mt-2 text-[11px] text-slate-500">
            Taux d'hospitalisation : <span className="font-bold text-slate-800">{stats.hospRate}%</span> des cas
          </div>
        </div>

        {/* Deaths & CFR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Décès Déclarés</span>
            <AlertTriangle className="w-4 h-4 text-rose-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalDeaths.toLocaleString('fr-FR')}</div>
          <div className="mt-2 text-[11px] text-slate-500">
            Létalité brute : <span className="font-bold text-rose-700">{stats.caseFatalityRate}%</span>
          </div>
        </div>

        {/* Structures & Coverage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Structures Rapportrices</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.facilitiesCount} / {healthFacilities.length}</div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Couverture zones Kindu & Alunguli</span>
          </div>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Evolution (Line + Bar) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Évolution Mensuelle des Pathologies ({filterYear === 'ALL' ? '2023-2024' : filterYear})</h3>
              <p className="text-xs text-slate-500">Fluctuations épidémiologiques selon la saisonnalité des pluies à Kindu</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Paludisme" fill="#e11d48" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Fièvre Typhoïde" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proportions Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Répartition des Pathologies</h3>
          <p className="text-xs text-slate-500">Part relative dans la morbidité déclarée</p>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" /> Paludisme
              </span>
              <span className="font-bold text-slate-900">
                {stats.totalCases > 0 ? Math.round((stats.malariaCases / stats.totalCases) * 100) : 0}% ({stats.malariaCases.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Fièvre Typhoïde
              </span>
              <span className="font-bold text-slate-900">
                {stats.totalCases > 0 ? Math.round((stats.typhoidCases / stats.totalCases) * 100) : 0}% ({stats.typhoidCases.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Area Distribution Table & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Area Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Charge Morbide par Aire de Santé</h3>
          <p className="text-xs text-slate-500">Distribution géographique des cas cumulés</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={areaData} margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Paludisme" fill="#e11d48" stackId="b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Fièvre Typhoïde" fill="#f59e0b" stackId="b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Summary Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Synthèse par Aire de Santé & Incidence Estimée</h3>
            <p className="text-xs text-slate-500">Indicateurs rapportés pour 1 000 habitants</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Aire de Santé</th>
                    <th className="py-2.5 px-2 text-right">Population</th>
                    <th className="py-2.5 px-2 text-right">Palu</th>
                    <th className="py-2.5 px-2 text-right">Typhoïde</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                    <th className="py-2.5 px-3 text-right">Taux / 1k hab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {areaData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-2 px-2 text-right text-slate-500">{item.population.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-medium text-rose-600">{item.Paludisme.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-medium text-amber-600">{item['Fièvre Typhoïde'].toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-bold text-slate-900">{item.Total.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-700">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          item.incidencePalu > 200 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.incidencePalu} ‰
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2 mt-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Note méthodologique V1.3 :</strong> Les données sanitaires présentées correspondent aux registres réels des structures et rapports mensuels DPS. Aucune modélisation prédictive ou imputation n'est effectuée sur ces totaux bruts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
