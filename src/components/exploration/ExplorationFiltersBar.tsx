import React from 'react';
import { Filter, RotateCcw, ShieldAlert } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduData';

export const ExplorationFiltersBar: React.FC = () => {
  const { explorationFilters, setExplorationFilters, resetExplorationFilters, selectedDatasetVersion } = useData();

  const handleDiseaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExplorationFilters(prev => ({
      ...prev,
      disease: e.target.value as 'ALL' | 'MALARIA' | 'TYPHOID'
    }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
    setExplorationFilters(prev => ({ ...prev, year: val }));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
    setExplorationFilters(prev => ({ ...prev, month: val }));
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
    setExplorationFilters(prev => ({ ...prev, quarter: val }));
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExplorationFilters(prev => ({ ...prev, zone_sante_id: e.target.value, aire_sante_id: 'ALL' }));
  };

  const handleAireChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExplorationFilters(prev => ({ ...prev, aire_sante_id: e.target.value }));
  };

  const handleClimateVarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExplorationFilters(prev => ({
      ...prev,
      climate_variable: e.target.value as 'rainfall_mm' | 'temperature_mean' | 'temperature_max' | 'humidity_percent' | 'rainy_days'
    }));
  };

  const handleMovingAverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10) as 0 | 3 | 6 | 12;
    setExplorationFilters(prev => ({ ...prev, movingAverageMonths: val }));
  };

  const filteredAires = explorationFilters.zone_sante_id === 'ALL'
    ? KINDU_HEALTH_AREAS
    : KINDU_HEALTH_AREAS.filter(a => a.zoneId === explorationFilters.zone_sante_id || (a as any).zone_id === explorationFilters.zone_sante_id);

  return (
    <div id="exploration-filters-bar" className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">Filtres Généraux Spatio-Temporels</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            Dataset : <strong className="text-emerald-400 font-mono">{selectedDatasetVersion}</strong>
          </span>
        </div>
        <button
          id="btn-reset-filters"
          onClick={resetExplorationFilters}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser les filtres
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 mt-3">
        {/* Maladie */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Pathologie</label>
          <select
            id="filter-disease"
            value={explorationFilters.disease}
            onChange={handleDiseaseChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Toutes (Palu & Typhoïde)</option>
            <option value="MALARIA">Paludisme seul</option>
            <option value="TYPHOID">Fièvre Typhoïde seule</option>
          </select>
        </div>

        {/* Année */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Année</label>
          <select
            id="filter-year"
            value={explorationFilters.year}
            onChange={handleYearChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">2023 - 2025 (36 mois)</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        {/* Trimestre */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Trimestre</label>
          <select
            id="filter-quarter"
            value={explorationFilters.quarter}
            onChange={handleQuarterChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous trimestres</option>
            <option value="1">T1 (Jan - Mar)</option>
            <option value="2">T2 (Avr - Jun)</option>
            <option value="3">T3 (Jul - Sep)</option>
            <option value="4">T4 (Oct - Déc)</option>
          </select>
        </div>

        {/* Mois */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Mois précis</label>
          <select
            id="filter-month"
            value={explorationFilters.month}
            onChange={handleMonthChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous les mois</option>
            <option value="1">Janvier</option>
            <option value="2">Février</option>
            <option value="3">Mars</option>
            <option value="4">Avril</option>
            <option value="5">Mai</option>
            <option value="6">Juin</option>
            <option value="7">Juillet</option>
            <option value="8">Août</option>
            <option value="9">Septembre</option>
            <option value="10">Octobre</option>
            <option value="11">Novembre</option>
            <option value="12">Décembre</option>
          </select>
        </div>

        {/* Zone de santé */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Zone de Santé</label>
          <select
            id="filter-zone"
            value={explorationFilters.zone_sante_id}
            onChange={handleZoneChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Toutes les ZS (Kindu & Alunguli)</option>
            <option value="ZS_KINDU">ZS Kindu (Rive droite)</option>
            <option value="ZS_ALUNGULI">ZS Alunguli (Rive gauche)</option>
          </select>
        </div>

        {/* Aire de santé */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Aire de Santé</label>
          <select
            id="filter-aire"
            value={explorationFilters.aire_sante_id}
            onChange={handleAireChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Toutes ({filteredAires.length} aires)</option>
            {filteredAires.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Variable climatique */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Variable Climat</label>
          <select
            id="filter-climate"
            value={explorationFilters.climate_variable}
            onChange={handleClimateVarChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="rainfall_mm">Précipitations (mm)</option>
            <option value="temperature_mean">Température Moyenne (°C)</option>
            <option value="temperature_max">Température Max (°C)</option>
            <option value="humidity_percent">Humidité Relative (%)</option>
            <option value="rainy_days">Jours de pluie</option>
          </select>
        </div>

        {/* Moyenne mobile */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Moyenne Mobile</label>
          <select
            id="filter-ma"
            value={explorationFilters.movingAverageMonths}
            onChange={handleMovingAverageChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="0">Brute (Pas de lissage)</option>
            <option value="3">3 Mois (Calculée)</option>
            <option value="6">6 Mois (Calculée)</option>
            <option value="12">12 Mois (Annuelle)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
