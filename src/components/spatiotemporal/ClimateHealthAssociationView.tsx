import React, { useState, useMemo } from 'react';
import {
  CloudRain,
  Thermometer,
  Activity,
  AlertCircle,
  Clock,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

export const ClimateHealthAssociationView: React.FC = () => {
  const { integratedSpatiotemporalData, climateSpatiotemporal } = useData();

  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [lagOffset, setLagOffset] = useState<number>(0); // 0 = M, 1 = M-1, 2 = M-2

  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  // Aggregate monthly series for the selected year and area
  const chartData = useMemo(() => {
    return months.map((monthName, idx) => {
      const monthNum = idx + 1;

      // Filter integrated rows
      const matchingRows = integratedSpatiotemporalData.filter(
        r => r.year === selectedYear && r.month === monthNum && (selectedAreaId === 'ALL' || r.aire_sante_id === selectedAreaId)
      );

      const totalMalaria = matchingRows.reduce((acc, r) => acc + (r.malaria_cases ?? 0), 0);
      const totalTyphoid = matchingRows.reduce((acc, r) => acc + (r.typhoid_cases ?? 0), 0);

      // Climate from first matching row or fallback
      const sampleRow = matchingRows[0];
      let rain = sampleRow?.rainfall_mm ?? null;
      let temp = sampleRow?.temperature_mean ?? null;
      let hum = sampleRow?.humidity_percent ?? null;

      // Apply Lag if selected
      if (lagOffset === 1) {
        rain = sampleRow?.rainfall_lag_1 ?? rain;
        temp = sampleRow?.temperature_lag_1 ?? temp;
        hum = sampleRow?.humidity_lag_1 ?? hum;
      } else if (lagOffset === 2) {
        rain = sampleRow?.rainfall_lag_2 ?? rain;
      }

      return {
        month: monthName,
        monthNum,
        malaria: totalMalaria > 0 ? totalMalaria : 0,
        typhoid: totalTyphoid > 0 ? totalTyphoid : 0,
        rainfall: rain,
        temperature: temp,
        humidity: hum,
      };
    });
  }, [months, selectedYear, selectedAreaId, lagOffset, integratedSpatiotemporalData]);

  return (
    <div className="space-y-6">
      {/* Strict Scientific Methodological Disclaimer */}
      <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 sm:p-5 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Cadre Méthodologique & Prudence Épidémiologique
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Ce module présente une <strong>analyse descriptive et visuelle des variations temporelles concomitantes</strong> entre paramètres climatiques (Station Kindu-Aéroport) et cas enregistrés. Conformément aux principes de la biostatistique spatio-temporelle, <strong>aucune relation de cause à effet directe ne peut être affirmée sans modélisation formelle</strong> (régression multivariée, décalage temporel distribué, contrôle des facteurs de confusion environnementaux et socio-économiques).
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Lag Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-semibold text-slate-700">Année :</label>
            <select
              id="select-clim-year"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-semibold text-slate-700">Périmètre Spatial :</label>
            <select
              id="select-clim-area"
              value={selectedAreaId}
              onChange={e => setSelectedAreaId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="ALL">Toutes les 10 Aires de Santé (Agglomération)</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.zoneId === 'ZS_KINDU' ? 'Kindu' : 'Alunguli'})
                </option>
              ))}
            </select>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Décalage Temporel (Lags M, M-1, M-2) */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-semibold text-slate-700">Décalage Climat :</label>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                id="btn-lag-0"
                onClick={() => setLagOffset(0)}
                className={`px-2.5 py-1 font-semibold rounded-md transition ${
                  lagOffset === 0 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mois M (Simultané)
              </button>
              <button
                id="btn-lag-1"
                onClick={() => setLagOffset(1)}
                className={`px-2.5 py-1 font-semibold rounded-md transition ${
                  lagOffset === 1 ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lag M-1 (1 Mois)
              </button>
              <button
                id="btn-lag-2"
                onClick={() => setLagOffset(2)}
                className={`px-2.5 py-1 font-semibold rounded-md transition ${
                  lagOffset === 2 ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lag M-2 (2 Mois)
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 italic">
          {lagOffset > 0 ? `Climat décalé de ${lagOffset} mois en amont` : 'Climat du mois courant'}
        </div>
      </div>

      {/* Main Synchronized Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>Courbes Concomitantes : Cas Sanitaires vs Précipitations & Température ({selectedYear})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Précipitations en barres bleues (axe gauche), Cas de Paludisme et Typhoïde en courbes (axe droit)
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
              
              {/* Left Y Axis: Rainfall mm */}
              <YAxis
                yAxisId="left"
                stroke="#0284c7"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit=" mm"
              />
              
              {/* Right Y Axis: Disease Cases */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#d97706"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit=" cas"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: any, name: any) => {
                  if (name === 'Précipitations') return [`${value} mm`, name];
                  if (name === 'Température Moyenne') return [`${value} °C`, name];
                  if (name === 'Paludisme (Cas)') return [`${value} cas`, name];
                  if (name === 'Fièvre Typhoïde (Cas)') return [`${value} cas`, name];
                  return [value, name];
                }}
              />
              
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

              {/* Rainfall Bars */}
              <Bar
                yAxisId="left"
                dataKey="rainfall"
                name="Précipitations"
                fill="#38bdf8"
                opacity={0.65}
                radius={[4, 4, 0, 0]}
              />

              {/* Malaria Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="malaria"
                name="Paludisme (Cas)"
                stroke="#d97706"
                strokeWidth={3}
                dot={{ r: 4, fill: '#d97706' }}
                activeDot={{ r: 6 }}
              />

              {/* Typhoid Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="typhoid"
                name="Fièvre Typhoïde (Cas)"
                stroke="#2563eb"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#2563eb' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Synthetic Table with Lags */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Tableau Synthétique Mensuel des Paramètres Épidémiologiques & Climatiques
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {selectedAreaId === 'ALL' ? 'Agglomération Kindu' : KINDU_HEALTH_AREAS.find(a => a.id === selectedAreaId)?.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Mois</th>
                <th className="py-2.5 px-3 text-right text-amber-800">Paludisme (Cas)</th>
                <th className="py-2.5 px-3 text-right text-blue-800">Fièvre Typhoïde (Cas)</th>
                <th className="py-2.5 px-3 text-right text-sky-800">Pluie (mm)</th>
                <th className="py-2.5 px-3 text-right text-sky-700">Pluie Lag M-1</th>
                <th className="py-2.5 px-3 text-right text-rose-800">Temp. Moyenne (°C)</th>
                <th className="py-2.5 px-3 text-right text-teal-800">Humidité (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {chartData.map(d => {
                const sampleRow = integratedSpatiotemporalData.find(
                  r => r.year === selectedYear && r.month === d.monthNum
                );
                return (
                  <tr key={d.month} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">{d.month} ({selectedYear})</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-900">{d.malaria}</td>
                    <td className="py-2 px-3 text-right font-mono font-semibold text-blue-900">{d.typhoid}</td>
                    <td className="py-2 px-3 text-right font-mono text-sky-900">{d.rainfall !== null ? `${d.rainfall} mm` : 'ND'}</td>
                    <td className="py-2 px-3 text-right font-mono text-sky-700">{sampleRow?.rainfall_lag_1 !== null && sampleRow?.rainfall_lag_1 !== undefined ? `${sampleRow.rainfall_lag_1} mm` : 'ND'}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">{d.temperature !== null ? `${d.temperature} °C` : 'ND'}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">{d.humidity !== null ? `${d.humidity} %` : 'ND'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
