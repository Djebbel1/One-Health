import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { GeographicUnit, GeographicAlias } from '../../types';
import { SPATIAL_COMPATIBILITY_MATRIX } from '../../data/harmonizationData';
import {
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass,
  X,
  FileText
} from 'lucide-react';

export const GeographicHarmonizationSection: React.FC = () => {
  const {
    geographicUnits,
    addGeographicUnit,
    geographicAliases,
    addGeographicAlias,
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<'UNITS' | 'ALIASES' | 'COMPATIBILITY'>('UNITS');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Unit creation modal
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitType, setNewUnitType] = useState<GeographicUnit['geo_type']>('AIRE_DE_SANTE');
  const [newUnitParentId, setNewUnitParentId] = useState('');
  const [newUnitLat, setNewUnitLat] = useState<string>('');
  const [newUnitLon, setNewUnitLon] = useState<string>('');

  // Alias creation modal
  const [isAddingAlias, setIsAddingAlias] = useState(false);
  const [newAliasName, setNewAliasName] = useState('');
  const [newAliasTargetGeoId, setNewAliasTargetGeoId] = useState('AS-001');
  const [newAliasSourceType, setNewAliasSourceType] = useState('LOCAL_COMMUNITY');

  // Filtered geographic units
  const filteredUnits = useMemo(() => {
    return geographicUnits.filter(u => {
      if (selectedTypeFilter !== 'ALL' && u.geo_type !== selectedTypeFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = u.geo_name.toLowerCase().includes(q);
        const matchId = u.geo_id.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }
      return true;
    });
  }, [geographicUnits, selectedTypeFilter, searchTerm]);

  // Filtered aliases
  const filteredAliases = useMemo(() => {
    return geographicAliases.filter(a => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchAlias = a.alias_name.toLowerCase().includes(q);
        const matchId = a.geo_id.toLowerCase().includes(q);
        if (!matchAlias && !matchId) return false;
      }
      return true;
    });
  }, [geographicAliases, searchTerm]);

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName) return;

    const prefix = newUnitType === 'ZONE_DE_SANTE' ? 'ZS' : newUnitType === 'AIRE_DE_SANTE' ? 'AS' : newUnitType === 'QUARTIER' ? 'Q' : newUnitType === 'AVENUE' ? 'AV' : 'SITE';
    const count = geographicUnits.filter(u => u.geo_type === newUnitType).length + 1;
    const geo_id = `${prefix}-${String(count).padStart(3, '0')}`;

    const newUnit: GeographicUnit = {
      geo_id,
      geo_type: newUnitType,
      geo_name: newUnitName,
      parent_geo_id: newUnitParentId || null,
      latitude: newUnitLat ? parseFloat(newUnitLat) : null,
      longitude: newUnitLon ? parseFloat(newUnitLon) : null,
      is_active: true,
      description: `Création manuelle dans le référentiel Kindu`,
    };

    addGeographicUnit(newUnit);
    setIsAddingUnit(false);
    setNewUnitName('');
  };

  const handleCreateAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAliasName || !newAliasTargetGeoId) return;

    const newAlias: GeographicAlias = {
      alias_id: `ALIAS-${Date.now().toString().slice(-4)}`,
      alias_name: newAliasName,
      geo_id: newAliasTargetGeoId,
      source_type: newAliasSourceType,
    };

    addGeographicAlias(newAlias);
    setIsAddingAlias(false);
    setNewAliasName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Harmonisation Géographique & Référentiel Spatio-Sanitaire
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Hiérarchie spatiale emboîtée de Kindu (Province &rarr; Ville &rarr; Zones de santé &rarr; Aires de santé &rarr; Quartiers &rarr; Avenues &rarr; Sites), gestion des alias toponymiques et matrice de compatibilité.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddingUnit(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Unité Spatiale
            </button>
            <button
              onClick={() => setIsAddingAlias(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Ajouter un Alias
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveSubTab('UNITS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'UNITS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unités Géographiques ({geographicUnits.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ALIASES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'ALIASES' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Table des Alias Toponymiques ({geographicAliases.length})
          </button>
          <button
            onClick={() => setActiveSubTab('COMPATIBILITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'COMPATIBILITY' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Matrice de Compatibilité Spatiale
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Units */}
      {activeSubTab === 'UNITS' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'ZONE_DE_SANTE', 'AIRE_DE_SANTE', 'QUARTIER', 'AVENUE', 'SITE'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedTypeFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedTypeFilter === type ? 'bg-teal-700 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'ALL' ? 'Toutes' : type.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer unité ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Code Stable (ID)</th>
                    <th className="py-3 px-4">Niveau Géographique</th>
                    <th className="py-3 px-4">Nom de l Entité</th>
                    <th className="py-3 px-4">Entité Parente (Emboîtement)</th>
                    <th className="py-3 px-4 text-center">Coordonnées GPS</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.geo_id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">
                        {unit.geo_id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                          {unit.geo_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {unit.geo_name}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {unit.parent_geo_id || '— (Racine)'}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-mono">
                        {unit.latitude && unit.longitude ? `${unit.latitude}, ${unit.longitude}` : 'Non géoréférencé'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ACTIF
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Aliases */}
      {activeSubTab === 'ALIASES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex justify-between items-center">
            <p className="text-xs text-slate-600">
              Les alias toponymiques permettent de faire correspondre les variations orthographiques locales (ex: <em>Alunguli</em>, <em>Port Alunguli</em>, <em>Mikelenge</em>) avec les codes officiels du système de santé.
            </p>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher alias ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Alias / Nom Alternatif</th>
                    <th className="py-3 px-4">Code Entité Cible (geo_id)</th>
                    <th className="py-3 px-4">Nom Officiel Standardisé</th>
                    <th className="py-3 px-4">Source de l Alias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAliases.map((alias) => {
                    const target = geographicUnits.find(u => u.geo_id === alias.geo_id);
                    return (
                      <tr key={alias.alias_id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {alias.alias_name}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-teal-700">
                          {alias.geo_id}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {target ? target.geo_name : 'Entité inconnue'} ({target?.geo_type})
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {alias.source_type}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Spatial Compatibility Matrix */}
      {activeSubTab === 'COMPATIBILITY' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              Matrice d Intégrabilité Spatiale Multi-Échelles
            </h4>
            <p className="text-xs text-slate-500">
              Définition des règles d agrégation et d association entre les résolutions de collecte (Ménage, Site, Aire de Santé, Station Météo).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Niveau Source</th>
                    <th className="py-3 px-4">Niveau Cible</th>
                    <th className="py-3 px-4 text-center">Faisabilité</th>
                    <th className="py-3 px-4">Méthode de Liaison Scientifique</th>
                    <th className="py-3 px-4">Condition Spatiale Requise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SPATIAL_COMPATIBILITY_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {row.source_resolution}
                      </td>
                      <td className="py-3 px-4 font-semibold text-teal-800">
                        {row.target_resolution}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.is_compatible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {row.is_compatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {row.method}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {row.condition}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {isAddingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateUnit} className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Ajouter une Unité Géographique</h3>
              <button type="button" onClick={() => setIsAddingUnit(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Niveau Géographique</label>
                <select
                  value={newUnitType}
                  onChange={(e) => setNewUnitType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="ZONE_DE_SANTE">Zone de Santé</option>
                  <option value="AIRE_DE_SANTE">Aire de Santé</option>
                  <option value="QUARTIER">Quartier</option>
                  <option value="AVENUE">Avenue</option>
                  <option value="SITE">Site Ponctuel</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nom de l Entité</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aire de Santé Mikelenge"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Entité Parente (Code)</label>
                <select
                  value={newUnitParentId}
                  onChange={(e) => setNewUnitParentId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 font-mono"
                >
                  <option value="">— Aucune / Racine —</option>
                  {geographicUnits.map(u => (
                    <option key={u.geo_id} value={u.geo_id}>
                      {u.geo_id} : {u.geo_name} ({u.geo_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-2.95"
                    value={newUnitLat}
                    onChange={(e) => setNewUnitLat(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="25.92"
                    value={newUnitLon}
                    onChange={(e) => setNewUnitLon(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingUnit(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs"
              >
                Enregistrer l Unité
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Alias Modal */}
      {isAddingAlias && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateAlias} className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Ajouter un Alias Toponymique</h3>
              <button type="button" onClick={() => setIsAddingAlias(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alias / Variante</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Quartier Port Alunguli"
                  value={newAliasName}
                  onChange={(e) => setNewAliasName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Entité Officielle Cible</label>
                <select
                  value={newAliasTargetGeoId}
                  onChange={(e) => setNewAliasTargetGeoId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                >
                  {geographicUnits.map(u => (
                    <option key={u.geo_id} value={u.geo_id}>
                      {u.geo_id} — {u.geo_name} ({u.geo_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Source ou Contexte</label>
                <input
                  type="text"
                  placeholder="Ex: Usage communautaire informel"
                  value={newAliasSourceType}
                  onChange={(e) => setNewAliasSourceType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingAlias(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs"
              >
                Enregistrer l Alias
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
