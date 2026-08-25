import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Users,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  RefreshCw,
  Droplets,
  Bug,
  Sparkles,
  Camera,
  Layers,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { HouseholdSurvey, RecordStatus } from '../types';
import {
  KINDU_HEALTH_ZONES,
  KINDU_HEALTH_AREAS,
  KINDU_NEIGHBORHOODS,
  getHealthAreasByZone,
  getNeighborhoodsByHealthArea,
} from '../data/kinduGeography';
import { exportToCSV, exportToGeoJSON } from '../utils/exportUtils';

export type SurveyTabFilter = 'ALL' | 'MINE' | 'PENDING_SYNC' | 'VALIDATED' | 'DRAFT';

interface HouseholdSurveyListProps {
  activeTab: SurveyTabFilter;
  onTabChange: (tab: SurveyTabFilter) => void;
  onNewSurvey: () => void;
  onViewSurvey: (survey: HouseholdSurvey) => void;
  onEditSurvey: (survey: HouseholdSurvey) => void;
  onDeleteSurvey: (surveyId: string) => void;
}

export const HouseholdSurveyList: React.FC<HouseholdSurveyListProps> = ({
  activeTab,
  onTabChange,
  onNewSurvey,
  onViewSurvey,
  onEditSurvey,
  onDeleteSurvey,
}) => {
  const { householdSurveys, userSession, syncData, isOffline } = useData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('TABLE');

  // Filtered Health Areas & Neighborhoods for cascading filters
  const filteredAreas = useMemo(() => {
    if (selectedZone === 'ALL') return KINDU_HEALTH_AREAS;
    return getHealthAreasByZone(selectedZone);
  }, [selectedZone]);

  const filteredNeighborhoods = useMemo(() => {
    if (selectedArea === 'ALL') return KINDU_NEIGHBORHOODS;
    return getNeighborhoodsByHealthArea(selectedArea);
  }, [selectedArea]);

  // Counts for each tab badge
  const tabCounts = useMemo(() => {
    const all = householdSurveys.length;
    const mine = householdSurveys.filter(
      (s) => (s.enumerator_id === userSession.id || s.surveyor_id === userSession.id)
    ).length;
    const pending = householdSurveys.filter((s) => s.sync_status === 'PENDING').length;
    const validated = householdSurveys.filter((s) => s.status === 'VALIDATED').length;
    const draft = householdSurveys.filter((s) => s.status === 'DRAFT').length;

    return { all, mine, pending, validated, draft };
  }, [householdSurveys, userSession.id]);

  // Filtered Survey List
  const filteredSurveys = useMemo(() => {
    return householdSurveys.filter((survey) => {
      // Tab Filter
      if (activeTab === 'MINE') {
        const isMine = survey.enumerator_id === userSession.id || survey.surveyor_id === userSession.id;
        if (!isMine) return false;
      } else if (activeTab === 'PENDING_SYNC') {
        if (survey.sync_status !== 'PENDING') return false;
      } else if (activeTab === 'VALIDATED') {
        if (survey.status !== 'VALIDATED') return false;
      } else if (activeTab === 'DRAFT') {
        if (survey.status !== 'DRAFT') return false;
      }

      // Geographic filters
      if (selectedZone !== 'ALL' && survey.zone_id && survey.zone_id !== selectedZone) {
        return false;
      }
      if (selectedArea !== 'ALL' && survey.health_area_id !== selectedArea) {
        return false;
      }
      if (selectedNeighborhood !== 'ALL' && survey.neighborhood_id && survey.neighborhood_id !== selectedNeighborhood) {
        return false;
      }

      // Search keyword
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesId = survey.id.toLowerCase().includes(term);
        const matchesStreet = survey.street_name?.toLowerCase().includes(term);
        const matchesArea = survey.health_area_id.toLowerCase().includes(term);
        const matchesNeigh = survey.neighborhood_id?.toLowerCase().includes(term);
        const matchesNotes = (survey.enumerator_comment || survey.interviewer_notes)?.toLowerCase().includes(term);

        if (!matchesId && !matchesStreet && !matchesArea && !matchesNeigh && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [householdSurveys, activeTab, userSession.id, selectedZone, selectedArea, selectedNeighborhood, searchTerm]);

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(filteredSurveys, `enquetes_menages_kindu_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportGeoJSON = () => {
    exportToGeoJSON(filteredSurveys, `enquetes_menages_kindu_geojson_${new Date().toISOString().split('T')[0]}`);
  };

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case 'VALIDATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Validée
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Soumise
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Edit3 className="w-3 h-3 text-amber-600" />
            Brouillon
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Clock className="w-3 h-3 text-indigo-600" />
            En révision
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Rejetée
          </span>
        );
      case 'CORRECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            Corrigée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getSyncBadge = (syncStatus?: string) => {
    if (syncStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" /> À synchroniser
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Synchronisé
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Action Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Module Enquêtes Ménages V1.1</h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {filteredSurveys.length} ménages
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Collecte épidémiologique géoréférencée, eau, assainissement, moustiquaires et salubrité.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onNewSurvey}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition focus:ring-2 focus:ring-emerald-500"
          >
            <Plus className="w-4 h-4" />
            <span>➕ NOUVELLE ENQUÊTE MÉNAGE</span>
          </button>

          <button
            type="button"
            onClick={() => syncData()}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition"
            title="Synchroniser avec le serveur central"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Synchroniser</span>
          </button>

          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border-r border-slate-200 transition flex items-center gap-1"
              title="Exporter au format CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportGeoJSON}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1"
              title="Exporter au format GeoJSON (SIG)"
            >
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>GeoJSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'ALL', label: '📋 TOUTES LES ENQUÊTES', count: tabCounts.all },
          { id: 'MINE', label: '👤 MES ENQUÊTES', count: tabCounts.mine },
          { id: 'PENDING_SYNC', label: '⏳ EN ATTENTE DE SYNCHRO', count: tabCounts.pending },
          { id: 'VALIDATED', label: '✅ ENQUÊTES VALIDÉES', count: tabCounts.validated },
          { id: 'DRAFT', label: '📝 BROUILLONS', count: tabCounts.draft },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id as SurveyTabFilter)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-slate-700 text-emerald-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Cascading Dropdown Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Recherche ID (MEN-...), avenue, aire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Zone Filter */}
          <div>
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedArea('ALL');
                setSelectedNeighborhood('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Toutes les Zones de Santé</option>
              {KINDU_HEALTH_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Health Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setSelectedNeighborhood('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Toutes les Aires de Santé</option>
              {filteredAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.commune})
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Tous les Quartiers</option>
              {filteredNeighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Clear Indicator */}
        {(searchTerm || selectedZone !== 'ALL' || selectedArea !== 'ALL' || selectedNeighborhood !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Filtres appliqués : {filteredSurveys.length} résultat(s)</span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedZone('ALL');
                setSelectedArea('ALL');
                setSelectedNeighborhood('ALL');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Main Content List / Table */}
      {filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Aucune enquête ne correspond aux critères</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Commencez une nouvelle collecte sur le terrain ou ajustez vos critères de recherche.
          </p>
          <button
            type="button"
            onClick={onNewSurvey}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Enquête Ménage</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Identifiant</th>
                  <th className="py-3 px-4">Localisation & Avenue</th>
                  <th className="py-3 px-4">Taille & MILD</th>
                  <th className="py-3 px-4">Eau & Salubrité</th>
                  <th className="py-3 px-4">Date & Enquêteur</th>
                  <th className="py-3 px-4">Statut & Synchro</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSurveys.map((survey) => {
                  const isMine = survey.enumerator_id === userSession.id || survey.surveyor_id === userSession.id;
                  const isPrecise = !survey.gps_accuracy || survey.gps_accuracy <= 20;

                  return (
                    <tr key={survey.id} className="hover:bg-slate-50/80 transition group">
                      {/* ID & Demo badge */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{survey.id}</span>
                          {survey.isDemoData && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded font-sans">
                              DEMO
                            </span>
                          )}
                        </div>
                        {survey.duplicate_justification && (
                          <div className="text-[10px] text-amber-700 font-sans mt-0.5 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Ménage contigu validé</span>
                          </div>
                        )}
                      </td>

                      {/* Localisation */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{survey.health_area_id}</div>
                        <div className="text-[11px] text-slate-500">
                          {survey.neighborhood_id} • {survey.street_name || 'Avenue non spécifiée'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>
                            {survey.latitude?.toFixed(4)}, {survey.longitude?.toFixed(4)}
                          </span>
                          {!isPrecise && (
                            <span className="text-amber-600 font-sans font-bold">
                              (±{survey.gps_accuracy}m)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Demography & Bednets */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{survey.hh_size} pers.</span>
                          <span className="text-slate-400 font-normal">
                            ({survey.children_u5} &lt;5 ans)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1">
                          <Bug className="w-3 h-3 text-rose-600" />
                          <span>
                            MILD: {survey.bednet_used_last_night ?? 0}/{survey.hh_size} dormeurs
                          </span>
                        </div>
                      </td>

                      {/* Water & Sanitation */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[160px] flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{survey.water_source_label || `Code ${survey.water_source}`}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Salubrité: <strong>{survey.obs_general_sanitation || survey.general_sanitation_condition || 'Moyen'}</strong>
                          {survey.photo_url && <span className="ml-1.5 text-teal-700">📷</span>}
                        </div>
                      </td>

                      {/* Date & Enumerator */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {survey.survey_date || survey.created_at?.split('T')[0]}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {survey.enumerator_id || survey.surveyor_id || 'Enquêteur'}
                          {isMine && <span className="ml-1 text-emerald-700 font-bold">(Moi)</span>}
                        </div>
                      </td>

                      {/* Status & Sync */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div>{getStatusBadge(survey.status)}</div>
                          <div>{getSyncBadge(survey.sync_status)}</div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewSurvey(survey)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Consulter les détails complets"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditSurvey(survey)}
                            className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                            title="Modifier l'enquête"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteSurvey(survey.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            title="Supprimer l'enquête"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
