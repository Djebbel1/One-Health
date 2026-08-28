import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Layers,
  Filter,
  Search,
  Info,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { VariableDiagnosticProfile, UsabilityVerdict, TrafficLightSignal } from '../../types';

interface UsabilityAndModelingTabProps {
  profiles: VariableDiagnosticProfile[];
}

export const UsabilityAndModelingTab: React.FC<UsabilityAndModelingTabProps> = ({ profiles }) => {
  const [selectedDimension, setSelectedDimension] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<VariableDiagnosticProfile | null>(profiles[0] || null);

  const filteredProfiles = profiles.filter(p => {
    const matchDim = selectedDimension === 'ALL' || p.dimension === selectedDimension;
    const matchSearch = p.variableName.toLowerCase().includes(searchQuery.toLowerCase()) || p.variableCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDim && matchSearch;
  });

  const getVerdictBadge = (verdict: UsabilityVerdict | 'OUI' | 'NON') => {
    switch (verdict) {
      case 'OUI':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            OUI
          </span>
        );
      case 'PARTIELLEMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            PARTIEL
          </span>
        );
      case 'NON':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            NON
          </span>
        );
    }
  };

  const getSignalBadge = (signal: TrafficLightSignal) => {
    switch (signal) {
      case 'VERT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">FEU VERT</span>;
      case 'ORANGE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">FEU ORANGE</span>;
      case 'ROUGE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">FEU ROUGE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Grille d'Utilisabilité Analytique & Aptitude à la Modélisation Spatio-Temporelle
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Chaque variable est qualifiée pour 3 niveaux d'exploitation : description épidémiologique simple, tests statistiques / corrélations, et modélisation spatio-temporelle prédictive (GLMM, SARIMA, INLA).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
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
              {dim === 'ALL' ? 'Toutes' : dim}
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

      {/* Main Grid: Usability Table + Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table on Left (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Variables Cataloguées & Niveaux d'Exploitabilité
            </h4>
            <span className="text-xs text-slate-500">{filteredProfiles.length} variable(s)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Variable Scientifique</th>
                  <th className="p-3 text-center">Descriptive</th>
                  <th className="p-3 text-center">Statistique</th>
                  <th className="p-3 text-center">Modélisation</th>
                  <th className="p-3 text-center">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProfiles.map(p => {
                  const isSelected = selectedProfile?.variableCode === p.variableCode;
                  return (
                    <tr
                      key={p.variableCode}
                      onClick={() => setSelectedProfile(p)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-indigo-50/70 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{p.variableName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">[{p.dimension}] {p.variableCode}</div>
                      </td>
                      <td className="p-3 text-center">
                        {getVerdictBadge(p.descriptiveUsability.usable)}
                      </td>
                      <td className="p-3 text-center">
                        {getVerdictBadge(p.statisticalUsability.usable)}
                      </td>
                      <td className="p-3 text-center">
                        {getVerdictBadge(p.spatialTemporalModelingUsability.usable)}
                      </td>
                      <td className="p-3 text-center">
                        {getSignalBadge(p.signal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Profile Detail on Right (1 col) */}
        {selectedProfile && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Détail d'Exploitabilité Scientifique
                </span>
                {getSignalBadge(selectedProfile.signal)}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{selectedProfile.variableName}</h4>
              <span className="text-xs text-slate-500 font-mono">{selectedProfile.variableCode}</span>
            </div>

            {/* Level 1: Descriptive */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">1. Analyse Descriptive</span>
                {getVerdictBadge(selectedProfile.descriptiveUsability.usable)}
              </div>
              <p className="text-xs text-slate-600">
                {selectedProfile.descriptiveUsability.justification}
              </p>
            </div>

            {/* Level 2: Statistical */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">2. Tests Statistiques & Corrélations</span>
                {getVerdictBadge(selectedProfile.statisticalUsability.usable)}
              </div>
              <p className="text-xs text-slate-600">
                {selectedProfile.statisticalUsability.justification}
              </p>
              {selectedProfile.statisticalUsability.restrictions && (
                <div className="text-[11px] font-semibold text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                  {selectedProfile.statisticalUsability.restrictions}
                </div>
              )}
            </div>

            {/* Level 3: Spatio-temporal Modeling */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">3. Modélisation Spatio-Temporelle</span>
                {getVerdictBadge(selectedProfile.spatialTemporalModelingUsability.usable)}
              </div>
              <p className="text-xs text-slate-700">
                {selectedProfile.spatialTemporalModelingUsability.justification}
              </p>
              {selectedProfile.spatialTemporalModelingUsability.reasonsForExclusion && selectedProfile.spatialTemporalModelingUsability.reasonsForExclusion.length > 0 && (
                <div className="mt-1 space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Motifs d'exclusion pour le modèle global :</span>
                  <ul className="list-disc list-inside text-xs text-rose-900 space-y-0.5">
                    {selectedProfile.spatialTemporalModelingUsability.reasonsForExclusion.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bias warnings */}
            {selectedProfile.biasRisks.warningMessages.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1 text-amber-950 text-xs">
                <strong className="block font-bold">Avertissements & Biais Méthodologiques :</strong>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {selectedProfile.biasRisks.warningMessages.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scientific Principle Reminder */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-950 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="font-bold text-emerald-900">Règle de Sauvegarde & Non-Destruction des Données :</strong>
          <p className="leading-relaxed">
            L'exclusion d'une variable du modèle spatio-temporel n'entraîne jamais sa suppression de la base. Elle demeure pleinement consultable pour les analyses descriptives locales et les enquêtes entomologiques ponctuelles de terrain.
          </p>
        </div>
      </div>
    </div>
  );
};
