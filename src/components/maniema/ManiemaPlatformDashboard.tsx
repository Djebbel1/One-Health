import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import {
  Map,
  Activity,
  FolderTree,
  FileText,
  Briefcase,
  ShieldCheck,
  Globe,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Compass,
  Building,
  HeartPulse,
  CloudRain,
  Trees,
  Footprints
} from 'lucide-react';
import { ManiemaPathologyCatalog } from './ManiemaPathologyCatalog';
import { ManiemaGeoManager } from './ManiemaGeoManager';
import { DynamicDataEntryForm } from './DynamicDataEntryForm';
import { ManiemaProjectTimeManager } from './ManiemaProjectTimeManager';
import { ManiemaValidationTab } from './ManiemaValidationTab';
import { computePathologySummaries } from '../../utils/maniemaEngine';

type ManiemaTab =
  | 'VUE_ENSEMBLE'
  | 'CATALOGUE_PATHOLOGIES'
  | 'HIERARCHIE_SPATIALE'
  | 'COLLECTE_DYNAMIQUE'
  | 'PROJETS_SOURCES'
  | 'VALIDATION_V110';

export const ManiemaPlatformDashboard: React.FC = () => {
  const {
    pathologies,
    maniemaGeoUnits,
    oneHealthProjects,
    activeProjectId,
    setActiveProjectId,
    dynamicObservations,
    isDemoMode,
    setIsDemoMode,
    v110ValidationTests
  } = useData();

  const [activeTab, setActiveTab] = useState<ManiemaTab>('VUE_ENSEMBLE');
  const [selectedGeoTerritory, setSelectedGeoTerritory] = useState<string>('ALL');

  const activeProject = oneHealthProjects.find(p => p.id === activeProjectId) || oneHealthProjects[0];

  // Pathology Summaries (Section 7 & 8)
  const pathologySummaries = useMemo(() => {
    return computePathologySummaries(
      dynamicObservations,
      pathologies,
      maniemaGeoUnits,
      activeProjectId,
      isDemoMode
    );
  }, [dynamicObservations, pathologies, maniemaGeoUnits, activeProjectId, isDemoMode]);

  // Territories list
  const territories = useMemo(() => {
    return maniemaGeoUnits.filter(u => u.level === 'VILLE_TERRITOIRE');
  }, [maniemaGeoUnits]);

  // Health zones list
  const healthZones = useMemo(() => {
    return maniemaGeoUnits.filter(u => u.level === 'ZONE_SANTE');
  }, [maniemaGeoUnits]);

  const totalPop = useMemo(() => {
    const province = maniemaGeoUnits.find(u => u.level === 'PROVINCE');
    return province?.population || 2800000;
  }, [maniemaGeoUnits]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Platform V1.10 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 border border-teal-800/50 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-3 py-0.5 rounded-full font-extrabold tracking-wide uppercase">
                Plateforme One Health V1.10
              </span>
              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs px-3 py-0.5 rounded-full font-semibold">
                Province du Maniema (18 Zones de Santé)
              </span>
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-bold border ${
                  isDemoMode
                    ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                }`}
              >
                {isDemoMode ? 'Mode : Démonstration' : 'Mode : Données Réelles'}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Système Provincial Multi-Pathologies One Health Maniema
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Surveillance, modélisation éco-épidémiologique et analyse prédictive des risques sanitaires (Paludisme, Fièvre typhoïde, Choléra, Diarrhées, Arboviroses, Mpox) à l’échelle provinciale en République Démocratique du Congo.
            </p>
          </div>

          {/* Project Switcher & Quick Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-semibold">Projet Actif :</div>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-slate-900 border border-teal-600/50 text-white font-bold text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              {oneHealthProjects.map(prj => (
                <option key={prj.id} value={prj.id}>
                  {prj.name} ({prj.code})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between gap-3 pt-1 text-[11px] text-slate-400">
              <span>{pathologies.length} pathologies</span>
              <span>•</span>
              <span>{healthZones.length} Zones de Santé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Pristine Tabs matching Guidelines) */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl">
        {[
          { id: 'VUE_ENSEMBLE', label: 'Vue d’Ensemble Maniema', icon: Globe },
          { id: 'CATALOGUE_PATHOLOGIES', label: 'Catalogue Multi-Pathologies', icon: Activity },
          { id: 'HIERARCHIE_SPATIALE', label: 'Référentiel Spatial Hiérarchique', icon: FolderTree },
          { id: 'COLLECTE_DYNAMIQUE', label: 'Formulaire Adaptatif', icon: FileText },
          { id: 'PROJETS_SOURCES', label: 'Projets & Séries Temporelles', icon: Briefcase },
          { id: 'VALIDATION_V110', label: 'Banc de Validation V1.10 (14 Tests)', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ManiemaTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Render */}
      {activeTab === 'VUE_ENSEMBLE' && (
        <div className="space-y-6">
          {/* Provincial Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Population Maniema</span>
                <Globe className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {totalPop.toLocaleString()} hab.
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                7 Territoires + Ville de Kindu
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Zones de Santé Couvertes</span>
                <Building className="h-4 w-4 text-sky-400" />
              </div>
              <div className="text-2xl font-extrabold text-sky-400 mt-1">
                {healthZones.length} Zones
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                DPS Maniema (Surveillance One Health)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pathologies Surveillées</span>
                <Activity className="h-4 w-4 text-teal-400" />
              </div>
              <div className="text-2xl font-extrabold text-teal-400 mt-1">
                {pathologies.filter(p => p.isActive).length} Pathologies
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Moteur dynamique configurable
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Observations Découplées</span>
                <HeartPulse className="h-4 w-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">
                {dynamicObservations.filter(o => o.isDemo === isDemoMode).length} enregistrements
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {isDemoMode ? 'Mode Démonstration' : 'Mode Réel'}
              </div>
            </div>
          </div>

          {/* Pathology Surveillance Matrix (Section 7 & 8) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-teal-400" />
                  Tableau de Surveillance Multi-Pathologies ({isDemoMode ? 'Données Simulation' : 'Données Réelles'})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Indicateurs épidémiologiques calculés dynamiquement pour chaque pathologie active.
                </p>
              </div>

              <span className="text-[11px] text-teal-300 bg-teal-950/60 border border-teal-800 px-2.5 py-1 rounded font-medium">
                Projet : {activeProject.name}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-slate-950/50">
                    <th className="py-2.5 px-3">Pathologie</th>
                    <th className="py-2.5 px-3">Catégorie</th>
                    <th className="py-2.5 px-3">Observations</th>
                    <th className="py-2.5 px-3">Cas Totaux</th>
                    <th className="py-2.5 px-3">Cas Confirmés</th>
                    <th className="py-2.5 px-3">Hospitalisés</th>
                    <th className="py-2.5 px-3">Décès</th>
                    <th className="py-2.5 px-3">Létalité (%)</th>
                    <th className="py-2.5 px-3">Incidence Moyenne (/1000)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pathologySummaries.map(ps => (
                    <tr key={ps.pathologyId} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ps.color }} />
                          {ps.name}
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                            {ps.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {pathologies.find(p => p.id === ps.pathologyId)?.category}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-300">{ps.totalObservations}</td>
                      <td className="py-2 px-3 font-mono font-bold text-white">{ps.totalCases.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-emerald-400">{ps.confirmedCases.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-amber-300">{ps.hospitalized.toLocaleString()}</td>
                      <td className="py-2 px-3 font-mono text-rose-400">{ps.deaths}</td>
                      <td className="py-2 px-3 font-mono text-slate-200">
                        {ps.caseFatalityRate !== null ? `${ps.caseFatalityRate} %` : '—'}
                      </td>
                      <td className="py-2 px-3 font-mono text-teal-300 font-bold">
                        {ps.averageIncidencePer1000 !== null ? `${ps.averageIncidencePer1000} ‰` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Maniema Territorial & Health Zone Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-400" />
                  Cartographie Sanitaire et Territoriale du Maniema (18 Zones de Santé)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Répartition des zones de santé par territoire administratif.
                </p>
              </div>

              <select
                aria-label="Filtrer par territoire"
                value={selectedGeoTerritory}
                onChange={(e) => setSelectedGeoTerritory(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="ALL">Tous les Territoires ({territories.length})</option>
                {territories.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {territories
                .filter(t => selectedGeoTerritory === 'ALL' || t.id === selectedGeoTerritory)
                .map(terr => {
                  const zonesInTerr = healthZones.filter(z => z.parentId === terr.id);

                  return (
                    <div
                      key={terr.id}
                      className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 space-y-2.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{terr.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-900 text-emerald-400 rounded border border-slate-700">
                            {terr.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Population : ~{terr.population.toLocaleString()} hab.
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-slate-700/60">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Zones de Santé ({zonesInTerr.length}) :
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {zonesInTerr.map(z => (
                            <span
                              key={z.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700"
                            >
                              {z.name.replace('Zone de Santé de ', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* One Health 4-Dimensions Conceptual Cross-Analysis (Section 20 & 21) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-400" />
              Chaîne de Transmission Intégrée One Health Maniema (4 Piliers)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/40 border border-sky-800/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                  <CloudRain className="h-4 w-4" /> 1. Climat & Météo
                </div>
                <p className="text-[11px] text-slate-300">
                  Précipitations mensuelles, températures de surface, humidité relative et régime des crues du fleuve Congo.
                </p>
                <span className="text-[10px] font-mono text-sky-400 block pt-1">
                  Sources: Station Kindu Aéro + ERA5
                </span>
              </div>

              <div className="bg-slate-800/40 border border-emerald-800/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <Trees className="h-4 w-4" /> 2. Environnement & Écologie
                </div>
                <p className="text-[11px] text-slate-300">
                  Gîtes larvaires anophéliens, zones inondables, qualité des sources d’eau, couvert végétal et déforestation.
                </p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">
                  Sources: Observations terrain + Sentinel-2
                </span>
              </div>

              <div className="bg-slate-800/40 border border-amber-800/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Footprints className="h-4 w-4" /> 3. Animal & Exposition
                </div>
                <p className="text-[11px] text-slate-300">
                  Faune réservoir (rongeurs, primates Mpox), consommation de viande de brousse, bétail et contact hydrique.
                </p>
                <span className="text-[10px] font-mono text-amber-400 block pt-1">
                  Sources: Enquêtes éco-ménages One Health
                </span>
              </div>

              <div className="bg-slate-800/40 border border-rose-800/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <HeartPulse className="h-4 w-4" /> 4. Santé Humaine
                </div>
                <p className="text-[11px] text-slate-300">
                  Incidence des cas cliniques et confirmés, formes graves, hospitalisations et mortalité en centres de santé.
                </p>
                <span className="text-[10px] font-mono text-rose-400 block pt-1">
                  Sources: Registres DHIS2 DPS Maniema
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CATALOGUE_PATHOLOGIES' && <ManiemaPathologyCatalog />}
      {activeTab === 'HIERARCHIE_SPATIALE' && <ManiemaGeoManager />}
      {activeTab === 'COLLECTE_DYNAMIQUE' && <DynamicDataEntryForm />}
      {activeTab === 'PROJETS_SOURCES' && <ManiemaProjectTimeManager />}
      {activeTab === 'VALIDATION_V110' && <ManiemaValidationTab />}
    </div>
  );
};
