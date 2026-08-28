import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Layers,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Info,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Download
} from 'lucide-react';
import {
  VariableDiagnosticProfile,
  ScientificAvailabilityState,
  OneHealthDimension
} from '../../types';
import {
  MANIEMA_18_HEALTH_ZONES,
  STUDY_YEARS_2018_2026
} from '../../data/mockScientificDiagnosticDataV113';
import { globalDiagnosticEngine } from '../../utils/scientificDiagnosticEngineV113';

interface AvailabilityMatricesTabProps {
  profiles: VariableDiagnosticProfile[];
}

export const AvailabilityMatricesTab: React.FC<AvailabilityMatricesTabProps> = ({ profiles }) => {
  const [matrixView, setMatrixView] = useState<'TEMPORAL' | 'GEOGRAPHIC' | 'COMPLETE_4D'>('TEMPORAL');
  const [selectedDimension, setSelectedDimension] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 4D complete explorer states
  const [selectedPathology, setSelectedPathology] = useState('PALUDISME');
  const [selectedVariableCode, setSelectedVariableCode] = useState(profiles[0]?.variableCode || 'cas_paludisme_mensuels');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZS-KINDU');

  // Inspection modal/card state
  const [inspectedCell, setInspectedCell] = useState<{
    variableName: string;
    variableCode: string;
    targetContext: string;
    status: ScientificAvailabilityState;
    dimension: OneHealthDimension;
    explanation: string;
  } | null>(null);

  const temporalMatrixRows = globalDiagnosticEngine.getTemporalMatrix();
  const geographicMatrixRows = globalDiagnosticEngine.getGeographicMatrix();

  const filteredTemporalRows = temporalMatrixRows.filter(row => {
    const matchDim = selectedDimension === 'ALL' || row.dimension === selectedDimension;
    const matchSearch = row.variableName.toLowerCase().includes(searchQuery.toLowerCase()) || row.variableCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDim && matchSearch;
  });

  const filteredGeographicRows = geographicMatrixRows.filter(row => {
    const matchDim = selectedDimension === 'ALL' || row.dimension === selectedDimension;
    const matchSearch = row.variableName.toLowerCase().includes(searchQuery.toLowerCase()) || row.variableCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDim && matchSearch;
  });

  const renderStatusSymbol = (status: ScientificAvailabilityState) => {
    switch (status) {
      case 'DISPONIBLE':
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm border border-emerald-300 shadow-2xs" title="Disponible (✓)">
            ✓
          </span>
        );
      case 'PARTIEL':
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-black text-sm border border-amber-300 shadow-2xs" title="Partiel / Proxy (△)">
            △
          </span>
        );
      case 'INCONNU':
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 font-black text-sm border border-indigo-300 shadow-2xs" title="Inconnu (?)">
            ?
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-100 text-rose-800 font-black text-sm border border-rose-300 shadow-2xs" title="Absent (✗)">
            ✗
          </span>
        );
    }
  };

  const current4DEvaluation = globalDiagnosticEngine.evaluate4DCombination(
    selectedPathology,
    selectedVariableCode,
    selectedYear,
    selectedZoneId
  );

  return (
    <div className="space-y-6">
      {/* Header controls & Sub-tab switcher */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Matrices de Disponibilité Scientifique (2018–2026)
            </h3>
            <p className="text-xs text-slate-500">
              Cartographie matricielle multi-dimensionnelle croisant variables, horizons temporels et territoires du Maniema.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => setMatrixView('TEMPORAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                matrixView === 'TEMPORAL'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Matrice Temporelle (9 ans)</span>
            </button>

            <button
              onClick={() => setMatrixView('GEOGRAPHIC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                matrixView === 'GEOGRAPHIC'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Matrice Géographique (18 ZS)</span>
            </button>

            <button
              onClick={() => setMatrixView('COMPLETE_4D')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                matrixView === 'COMPLETE_4D'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorateur 4D Complet</span>
            </button>
          </div>
        </div>

        {/* Global Standardized Legend Banner */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Légende Scientifique Standardisée :
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-300">✓</span>
              <span className="text-slate-700 font-medium">Disponible (Donnée mesurée/validée)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center border border-amber-300">△</span>
              <span className="text-slate-700 font-medium">Partiel (Sous-période ou Proxy justifié)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center border border-indigo-300">?</span>
              <span className="text-slate-700 font-medium">Inconnu (Non inspecté / Non documenté)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center border border-rose-300">✗</span>
              <span className="text-slate-700 font-medium">Absent (Donnée non mesurée / NULL strict)</span>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        {matrixView !== 'COMPLETE_4D' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Filtrer par Dimension :</span>
              {['ALL', 'SANTE', 'CLIMAT', 'ENVIRONNEMENT', 'COMMUNAUTAIRE'].map(dim => (
                <button
                  key={dim}
                  onClick={() => setSelectedDimension(dim)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedDimension === dim
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dim === 'ALL' ? 'Toutes les dimensions' : dim}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher variable..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* VIEW 1: TEMPORAL MATRIX */}
      {matrixView === 'TEMPORAL' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">
              Matrice Temporelle : Variable × Année (2018 à 2026)
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              {filteredTemporalRows.length} variable(s) affichée(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 min-w-[240px]">Variable Scientifique</th>
                  <th className="p-3 w-28">Dimension</th>
                  <th className="p-3 text-center w-24">Couverture</th>
                  {STUDY_YEARS_2018_2026.map(year => (
                    <th key={year} className="p-2.5 text-center w-14 font-extrabold text-slate-800">
                      {year}
                    </th>
                  ))}
                  <th className="p-3 text-center w-24">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTemporalRows.map((row) => (
                  <tr key={row.variableCode} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{row.variableName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.variableCode}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {row.dimension}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700">
                      {row.coverageRate}%
                    </td>
                    {STUDY_YEARS_2018_2026.map(year => {
                      const status = row.yearStatus[year];
                      return (
                        <td
                          key={year}
                          className="p-1.5 text-center cursor-pointer hover:scale-110 transition"
                          onClick={() => setInspectedCell({
                            variableName: row.variableName,
                            variableCode: row.variableCode,
                            targetContext: `Année ${year}`,
                            status,
                            dimension: row.dimension,
                            explanation: status === 'DISPONIBLE'
                              ? `Données continues réelles disponibles pour ${year}.`
                              : status === 'PARTIEL'
                              ? `Données partielles ou sous-échantillonnées pour ${year}.`
                              : `Données absentes pour ${year} (NULL strict).`
                          })}
                        >
                          {renderStatusSymbol(status)}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        row.signal === 'VERT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.signal === 'ORANGE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: GEOGRAPHIC MATRIX */}
      {matrixView === 'GEOGRAPHIC' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800">
              Matrice Géographique : Variable × 18 Zones de Santé du Maniema
            </h4>
            <span className="text-xs text-slate-500 font-medium">
              18 Zones Sanitaires référencées
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 min-w-[220px]">Variable Scientifique</th>
                  <th className="p-3 w-28">Dimension</th>
                  {MANIEMA_18_HEALTH_ZONES.map(zone => (
                    <th key={zone.id} className="p-2 text-center text-[10px] font-extrabold text-slate-800 min-w-[55px]" title={zone.name}>
                      <span className="block truncate w-14 mx-auto">{zone.name.slice(0, 5)}</span>
                    </th>
                  ))}
                  <th className="p-3 text-center w-20">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredGeographicRows.map((row) => (
                  <tr key={row.variableCode} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-semibold text-slate-900">
                      <div>{row.variableName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.variableCode}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {row.dimension}
                      </span>
                    </td>
                    {MANIEMA_18_HEALTH_ZONES.map(zone => {
                      const status = row.zoneStatus[zone.id];
                      return (
                        <td
                          key={zone.id}
                          className="p-1 text-center cursor-pointer hover:scale-110 transition"
                          onClick={() => setInspectedCell({
                            variableName: row.variableName,
                            variableCode: row.variableCode,
                            targetContext: `Zone de Santé : ${zone.name}`,
                            status,
                            dimension: row.dimension,
                            explanation: status === 'DISPONIBLE'
                              ? `Données de surveillance documentées pour la zone de ${zone.name}.`
                              : status === 'PARTIEL'
                              ? `Données parcellaires pour ${zone.name}.`
                              : `Zone ${zone.name} non documentée par cette série (NULL strict).`
                          })}
                        >
                          {renderStatusSymbol(status)}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        row.signal === 'VERT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.signal === 'ORANGE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: 4D COMPLETE EXPLORER */}
      {matrixView === 'COMPLETE_4D' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Explorateur Matriciel 4D : Évaluation Instantanée de Faisabilité
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Sélectionnez une combinaison quadri-dimensionnelle (Pathologie × Variable × Année × Zone) pour obtenir le verdict d'exploitabilité scientifique immédiat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dimension 1: Pathologie */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase">1. Pathologie</label>
              <select
                value={selectedPathology}
                onChange={(e) => setSelectedPathology(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PALUDISME">Paludisme (Malaria)</option>
                <option value="FIEVRE_TYPHOIDE">Fièvre typhoïde</option>
                <option value="CHOLERA">Choléra</option>
                <option value="MPOX">Mpox (Variole du singe)</option>
              </select>
            </div>

            {/* Dimension 2: Variable */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase">2. Variable d'analyse</label>
              <select
                value={selectedVariableCode}
                onChange={(e) => setSelectedVariableCode(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                {profiles.map(p => (
                  <option key={p.variableCode} value={p.variableCode}>
                    [{p.dimension}] {p.variableName}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimension 3: Année */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase">3. Année d'étude</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                {STUDY_YEARS_2018_2026.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Dimension 4: Zone de Santé */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block uppercase">4. Zone de Santé</label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                {MANIEMA_18_HEALTH_ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name} ({z.territory})</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4D Verdict Result Box */}
          <div className={`p-5 rounded-2xl border ${
            current4DEvaluation.signal === 'VERT'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : current4DEvaluation.signal === 'ORANGE'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-rose-50/80 border-rose-300 text-rose-950'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {renderStatusSymbol(current4DEvaluation.status)}
                  <h5 className="font-black text-base">
                    Verdict Scientifique : {current4DEvaluation.explanation}
                  </h5>
                </div>
                <p className="text-xs font-medium max-w-2xl mt-1">
                  {current4DEvaluation.details}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                  current4DEvaluation.isExploitable
                    ? 'bg-slate-900 text-white'
                    : 'bg-rose-700 text-white'
                }`}>
                  {current4DEvaluation.isExploitable ? 'EXPLOITABLE DANS LE MODÈLE' : 'NON EXPLOITABLE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cell Inspection Drawer Modal */}
      {inspectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Inspection Cellule Matricielle • {inspectedCell.dimension}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{inspectedCell.variableName}</h3>
                <span className="text-xs text-indigo-600 font-semibold">{inspectedCell.targetContext}</span>
              </div>
              <button
                onClick={() => setInspectedCell(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                {renderStatusSymbol(inspectedCell.status)}
                <span className="text-xs font-bold text-slate-800">
                  Statut : {inspectedCell.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {inspectedCell.explanation}
              </p>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950 text-xs font-medium">
              <strong>Règle d'intégrité V1.13 :</strong> Aucune valeur manquante n'est convertie implicitement en 0. Les analyses doivent traiter cette cellule en NULL strict.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectedCell(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
