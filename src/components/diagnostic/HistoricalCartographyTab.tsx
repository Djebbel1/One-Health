import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  MANIEMA_18_HEALTH_ZONES,
  STUDY_YEARS_2018_2026
} from '../../data/mockScientificDiagnosticDataV113';

export const HistoricalCartographyTab: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedZone, setSelectedZone] = useState<string>('ZS-KINDU');
  const [activeLayers, setActiveLayers] = useState<{
    sante: boolean;
    climat: boolean;
    dechets: boolean;
    gites: boolean;
  }>({
    sante: true,
    climat: true,
    dechets: true,
    gites: true
  });

  const zoneObj = MANIEMA_18_HEALTH_ZONES.find(z => z.id === selectedZone);

  // Determine availability for the selected year
  const isSanteAvailable = true; // 2018-2026
  const isClimatAvailable = true; // 2018-2026
  const isDechetsAvailable = selectedYear >= 2022; // 2022-2026
  const isGitesAvailable = selectedYear >= 2025; // 2025-2026

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Cartographie Historique & Intégrité Temporelle des Couches (2018–2026)
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Visualisation cartographique respectant scrupuleusement la réalité des couches disponibles année par année. 
          Les cartes de 2018 affichent la situation réelle de 2018 sans forcer les relevés récents de 2026.
        </p>
      </div>

      {/* Year Selector Slider / Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Sélectionner l'Année Cartographique :
          </span>
          <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
            Année {selectedYear}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {STUDY_YEARS_2018_2026.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-1 min-w-[70px] py-2 px-3 rounded-xl font-extrabold text-xs transition border ${
                selectedYear === year
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Warning Banner when historical environmental layers are absent */}
        {!isDechetsAvailable && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Avis d'intégrité cartographique ({selectedYear}) :</strong> La couche environnementale (Décharges) n'était pas mesurée en {selectedYear}. Affichage strict en « Donnée absente (NULL) ».
            </span>
          </div>
        )}
      </div>

      {/* Map Simulation & Legend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas / Representation (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Maniema (RDC) • Vue Cartographique {selectedYear}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">18 Zones de Santé</span>
          </div>

          {/* Stylized Zone Map Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800 min-h-[280px]">
            {MANIEMA_18_HEALTH_ZONES.map(z => {
              const isSelected = selectedZone === z.id;
              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold opacity-75">{z.territory.slice(0, 8)}</span>
                    <div className="font-extrabold text-xs mt-0.5">{z.name}</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-300">Palu : ✓</span>
                    <span className="font-mono text-slate-400">
                      {isDechetsAvailable && (z.isUrban || z.name === 'Kasongo') ? 'Env: ✓' : 'Env: ✗'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Layer Toggle Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-800 text-slate-300">
            <span className="font-bold">Couches activées pour {selectedYear} :</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Santé FOSA
              </span>
              <span className="flex items-center gap-1.5 text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pluviométrie
              </span>
              <span className={`flex items-center gap-1.5 ${isDechetsAvailable ? 'text-amber-400' : 'text-slate-500'}`}>
                {isDechetsAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} Décharges
              </span>
              <span className={`flex items-center gap-1.5 ${isGitesAvailable ? 'text-rose-400' : 'text-slate-500'}`}>
                {isGitesAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} Gîtes Larvaires
              </span>
            </div>
          </div>
        </div>

        {/* Selected Zone & Cartographic Legend (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Détail Territorial ({selectedYear})
            </span>
            <h4 className="font-bold text-slate-900 text-base mt-0.5">
              Zone de Santé : {zoneObj?.name}
            </h4>
            <span className="text-xs text-slate-500 font-semibold">Territoire de {zoneObj?.territory}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Surveillance Paludisme :</span>
              <span className="font-bold text-emerald-700">Disponible (✓)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Pluviométrie synoptique :</span>
              <span className="font-bold text-teal-700">Disponible (✓)</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Salubrité & Décharges :</span>
              <span className={`font-bold ${isDechetsAvailable && (zoneObj?.isUrban || zoneObj?.name === 'Kasongo') ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isDechetsAvailable && (zoneObj?.isUrban || zoneObj?.name === 'Kasongo') ? 'Documenté (✓)' : 'Absent (✗)'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-slate-600">Gîtes larvaires Anopheles :</span>
              <span className={`font-bold ${isGitesAvailable && zoneObj?.isUrban ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isGitesAvailable && zoneObj?.isUrban ? 'Observé (✓)' : 'Non couvert (✗)'}
              </span>
            </div>
          </div>

          {/* Cartographic Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase block">Légende Cartographique Officielle :</span>
            <div className="text-[11px] text-slate-600 space-y-1">
              <div>• Date de validité : Année civile {selectedYear}</div>
              <div>• Sources : DPS Maniema, METTELSAT, Faculté des Sciences Kindu</div>
              <div>• Statut des données : Mesures directes + proxies justifiés le cas échéant</div>
              <div>• Système de projection : WGS 84 / UTM Zone 35S</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
