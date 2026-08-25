import React, { useState, useMemo } from 'react';
import {
  Layers,
  PlusCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Save,
  Send,
  Eye,
  Edit,
  Trash2,
  Search,
  Calendar,
  Camera,
  ArrowLeft,
  Droplets,
  Trash,
  ShieldCheck,
  ShieldAlert,
  Info,
  RefreshCw,
  Clock,
  Compass,
  FileSpreadsheet,
  Download,
  Filter,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  EnvironmentalObservation,
  EnvironmentalFactorType,
  RecordStatus,
  HistoricalStatus
} from '../types';
import { EnvironmentalForm, FACTOR_CATEGORIES } from './environmental/EnvironmentalForm';
import { EnvironmentalDetail } from './environmental/EnvironmentalDetail';
import { EnvironmentalMap } from './environmental/EnvironmentalMap';
import { EnvironmentalRejectModal } from './environmental/EnvironmentalRejectModal';
import { exportToCSV } from '../utils/exportUtils';

type SubTab = 'ALL' | 'NEW' | 'SYNC' | 'VALIDATE' | 'MAP';

export const EnvironmentalModule: React.FC = () => {
  const {
    environmentalObs,
    deleteEnvironmentalObservation,
    syncAllPending,
    isOffline,
    userSession
  } = useData();

  const isSupervisorOrAdmin = userSession.role === 'SUPERVISEUR' || userSession.role === 'ADMIN';

  // Sub-menu Tab
  const [activeTab, setActiveTab] = useState<SubTab>('ALL');

  // Selected item for Detail or Edit
  const [selectedObs, setSelectedObs] = useState<EnvironmentalObservation | null>(null);
  const [editingObs, setEditingObs] = useState<EnvironmentalObservation | null>(null);
  const [isDetailView, setIsDetailView] = useState<boolean>(false);

  // Pre-filled location state when adding another factor at same location
  const [clonedLocationData, setClonedLocationData] = useState<any>(null);

  // Rejection modal
  const [rejectModalObs, setRejectModalObs] = useState<EnvironmentalObservation | null>(null);

  // List filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFactor, setSelectedFactor] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedHistoricalStatus, setSelectedHistoricalStatus] = useState<string>('ALL');
  const [selectedValidationStatus, setSelectedValidationStatus] = useState<string>('ALL');

  // Sync count
  const pendingSyncList = useMemo(() => {
    return environmentalObs.filter(o => o.sync_status === 'PENDING' || o.sync_status === 'ERROR');
  }, [environmentalObs]);

  // Validation pending count
  const pendingValidationList = useMemo(() => {
    return environmentalObs.filter(o => o.status === 'SUBMITTED' || o.status === 'UNDER_REVIEW');
  }, [environmentalObs]);

  // Filtered dataset for table / cards
  const displayedObservations = useMemo(() => {
    return environmentalObs.filter(obs => {
      // Sub-tab restrictions
      if (activeTab === 'SYNC') {
        if (obs.sync_status !== 'PENDING' && obs.sync_status !== 'ERROR') return false;
      } else if (activeTab === 'VALIDATE') {
        if (obs.status !== 'SUBMITTED' && obs.status !== 'UNDER_REVIEW') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          obs.id.toLowerCase().includes(q) ||
          obs.factor_type.toLowerCase().includes(q) ||
          (obs.street_name && obs.street_name.toLowerCase().includes(q)) ||
          obs.health_area_id.toLowerCase().includes(q) ||
          obs.neighborhood_id.toLowerCase().includes(q) ||
          (obs.household_id && obs.household_id.toLowerCase().includes(q)) ||
          (obs.description && obs.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Dropdown filters
      if (selectedFactor !== 'ALL' && obs.factor_type !== selectedFactor) return false;
      if (selectedArea !== 'ALL' && obs.health_area_id !== selectedArea) return false;
      if (selectedHistoricalStatus !== 'ALL' && (obs.historical_status || 'CURRENT') !== selectedHistoricalStatus) return false;
      if (selectedValidationStatus !== 'ALL' && obs.status !== selectedValidationStatus) return false;

      return true;
    });
  }, [
    environmentalObs,
    activeTab,
    searchQuery,
    selectedFactor,
    selectedArea,
    selectedHistoricalStatus,
    selectedValidationStatus
  ]);

  // Actions
  const handleAddNew = () => {
    setEditingObs(null);
    setClonedLocationData(null);
    setIsDetailView(false);
    setActiveTab('NEW');
  };

  const handleEdit = (obs: EnvironmentalObservation) => {
    setEditingObs(obs);
    setIsDetailView(false);
    setActiveTab('NEW');
  };

  const handleViewDetail = (obs: EnvironmentalObservation) => {
    setSelectedObs(obs);
    setIsDetailView(true);
  };

  const handleAddAnotherFactorAtSameLocation = (loc: any) => {
    setClonedLocationData(loc);
    setEditingObs({
      id: '',
      zone_id: loc.zone_id,
      health_area_id: loc.health_area_id,
      neighborhood_id: loc.neighborhood_id,
      street_name: loc.street_name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      gps_accuracy: loc.gps_accuracy,
      household_id: loc.household_id,
      factor_type: 'EAU_STAGNANTE',
      presence: 'Oui',
      description: '',
      observation_date: new Date().toISOString().split('T')[0],
      observation_time: new Date().toTimeString().split(' ')[0],
      historical_status: 'CURRENT',
      status: 'DRAFT'
    } as any);
    setIsDetailView(false);
    setActiveTab('NEW');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Confirmez-vous la suppression de l'observation ${id} ?`)) {
      deleteEnvironmentalObservation(id, 'Suppression manuelle autorisée');
      if (selectedObs?.id === id) {
        setSelectedObs(null);
        setIsDetailView(false);
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    exportToCSV(displayedObservations, 'observations_environnementales_kindu');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Main Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex items-center justify-center text-white shadow-md ring-2 ring-teal-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                🌍 OBSERVATIONS ENVIRONNEMENTALES
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 text-[11px] font-bold">
                Kindu V1.2
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Module indépendant de documentation spatio-temporelle des facteurs écologiques et hydrologiques
            </p>
          </div>
        </div>

        {/* Global Action: Quick Sync & Export */}
        <div className="flex items-center gap-2">
          {pendingSyncList.length > 0 && (
            <button
              type="button"
              onClick={syncAllPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              title="Synchroniser toutes les observations locales en attente"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synchroniser ({pendingSyncList.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub-menu Navigation Bar */}
      <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap items-center gap-1">
        {/* + Nouvelle observation */}
        <button
          type="button"
          onClick={handleAddNew}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'NEW'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-teal-800 hover:bg-teal-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Nouvelle observation</span>
        </button>

        {/* Mes observations */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('ALL');
            setIsDetailView(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'ALL' && !isDetailView
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mes observations</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/80 text-slate-800 font-bold">
            {environmentalObs.length}
          </span>
        </button>

        {/* Observations à synchroniser */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('SYNC');
            setIsDetailView(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'SYNC'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Observations à synchroniser</span>
          {pendingSyncList.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {pendingSyncList.length}
            </span>
          )}
        </button>

        {/* Observations à valider */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('VALIDATE');
            setIsDetailView(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'VALIDATE'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Observations à valider</span>
          {pendingValidationList.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-bold">
              {pendingValidationList.length}
            </span>
          )}
        </button>

        {/* Carte environnementale */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('MAP');
            setIsDetailView(false);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'MAP'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-teal-500" />
          <span>Carte environnementale</span>
        </button>
      </div>

      {/* VIEW 1 : FORM */}
      {activeTab === 'NEW' && (
        <EnvironmentalForm
          initialData={editingObs}
          onCancel={() => {
            setActiveTab('ALL');
            setEditingObs(null);
          }}
          onSaveSuccess={(saved) => {
            setSelectedObs(saved);
            setIsDetailView(true);
            setActiveTab('ALL');
            setEditingObs(null);
          }}
          onAddAnotherFactorAtSameLocation={handleAddAnotherFactorAtSameLocation}
        />
      )}

      {/* VIEW 2 : DETAIL */}
      {activeTab !== 'NEW' && isDetailView && selectedObs && (
        <EnvironmentalDetail
          observation={selectedObs}
          onBack={() => setIsDetailView(false)}
          onEdit={(obs) => handleEdit(obs)}
          onOpenRejectModal={(obs) => setRejectModalObs(obs)}
        />
      )}

      {/* VIEW 3 : DEDICATED MAP */}
      {activeTab === 'MAP' && !isDetailView && (
        <EnvironmentalMap
          onSelectObservation={(obs) => handleViewDetail(obs)}
        />
      )}

      {/* VIEW 4 : OBSERVATIONS LIST (ALL / SYNC / VALIDATE) */}
      {activeTab !== 'NEW' && activeTab !== 'MAP' && !isDetailView && (
        <div className="space-y-4">
          {/* Search & Filter Strip */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par ID (ENV-...), facteur, avenue, quartier, ménage..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Counts Badge */}
              <div className="text-xs text-slate-500">
                Affichage de <strong className="text-slate-900">{displayedObservations.length}</strong> observation(s)
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Catégorie</label>
                <select
                  value={selectedFactor}
                  onChange={(e) => setSelectedFactor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="ALL">Toutes les catégories</option>
                  {FACTOR_CATEGORIES.map(c => (
                    <option key={c.type} value={c.type}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statut historique</label>
                <select
                  value={selectedHistoricalStatus}
                  onChange={(e) => setSelectedHistoricalStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="CURRENT">Actuel</option>
                  <option value="HISTORICAL_DOCUMENTED">Historique documenté</option>
                  <option value="HISTORICAL_REPORTED_UNVERIFIED">Historique rapporté (non vérifié)</option>
                  <option value="UNKNOWN">Inconnu</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statut validation</label>
                <select
                  value={selectedValidationStatus}
                  onChange={(e) => setSelectedValidationStatus(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="VALIDATED">Validée</option>
                  <option value="SUBMITTED">Soumise</option>
                  <option value="UNDER_REVIEW">En révision</option>
                  <option value="REJECTED">Rejetée</option>
                  <option value="DRAFT">Brouillon</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aire de santé</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="ALL">Toutes les aires</option>
                  <option value="AS_MIKELENGE">Mikelenge</option>
                  <option value="AS_TOKOLOTE">Tokolote</option>
                  <option value="AS_BASOKO">Basoko</option>
                  <option value="AS_KASUKU">Kasuku Centre</option>
                  <option value="AS_ALUNGULI">Alunguli</option>
                  <option value="AS_MANIEMA">Maniema</option>
                </select>
              </div>
            </div>
          </div>

          {/* Observations Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5">ID Observation</th>
                    <th className="py-3 px-3">Catégorie Facteur</th>
                    <th className="py-3 px-3">Localisation & GPS</th>
                    <th className="py-3 px-3">Ménage lié</th>
                    <th className="py-3 px-3">Date & Statut Temporel</th>
                    <th className="py-3 px-3">Validation</th>
                    <th className="py-3 px-3">Synchro</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedObservations.length > 0 ? (
                    displayedObservations.map((obs) => {
                      const factorMeta = FACTOR_CATEGORIES.find(c => c.type === obs.factor_type) || FACTOR_CATEGORIES[0];
                      const Icon = factorMeta.icon;

                      return (
                        <tr
                          key={obs.id}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                          onClick={() => handleViewDetail(obs)}
                        >
                          {/* ID */}
                          <td className="py-3 px-3.5 font-mono font-bold text-teal-900 whitespace-nowrap">
                            {obs.id}
                          </td>

                          {/* Factor Category */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${factorMeta.bgColor}`}>
                                <Icon className={`w-3.5 h-3.5 ${factorMeta.color}`} />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">{factorMeta.shortLabel}</div>
                                <div className="text-[10px] text-slate-500">
                                  Présence : {obs.presence || 'Oui'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-800">
                              {obs.health_area_id} • {obs.neighborhood_id}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {obs.latitude.toFixed(4)}, {obs.longitude.toFixed(4)} (±{obs.gps_accuracy}m)
                            </div>
                          </td>

                          {/* Linked Household */}
                          <td className="py-3 px-3">
                            {obs.household_id ? (
                              <div>
                                <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                  {obs.household_id}
                                </span>
                                <div className="text-[10px] text-teal-800 font-medium mt-0.5">
                                  Dist: {obs.calculated_household_distance_m !== undefined ? `${obs.calculated_household_distance_m} m` : 'N/A'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Indépendante</span>
                            )}
                          </td>

                          {/* Date & Historical Status */}
                          <td className="py-3 px-3">
                            <div className="text-slate-800 font-medium">{obs.observation_date}</div>
                            <div>
                              {obs.historical_status === 'CURRENT' && (
                                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Actuel
                                </span>
                              )}
                              {obs.historical_status === 'HISTORICAL_DOCUMENTED' && (
                                <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  Hist. documenté
                                </span>
                              )}
                              {obs.historical_status === 'HISTORICAL_REPORTED_UNVERIFIED' && (
                                <span className="text-[10px] text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-300 font-medium">
                                  ⚠️ Non vérifié
                                </span>
                              )}
                              {obs.historical_status === 'UNKNOWN' && (
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                  Inconnu
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Validation Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                obs.status === 'VALIDATED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : obs.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : obs.status === 'UNDER_REVIEW'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : obs.status === 'SUBMITTED'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {obs.status}
                            </span>
                          </td>

                          {/* Sync Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {obs.sync_status === 'PENDING' ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                                En attente
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                Synchro
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="py-3 px-3 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleViewDetail(obs)}
                                className="p-1 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded"
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEdit(obs)}
                                className="p-1 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {isSupervisorOrAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(obs.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        Aucune observation environnementale ne correspond aux critères.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Supervisor Rejection Modal */}
      <EnvironmentalRejectModal
        observation={rejectModalObs}
        isOpen={!!rejectModalObs}
        onClose={() => setRejectModalObs(null)}
        onConfirmReject={(obsId, reason) => {
          // Handled via updateRecordStatus in context
          setRejectModalObs(null);
        }}
      />
    </div>
  );
};
