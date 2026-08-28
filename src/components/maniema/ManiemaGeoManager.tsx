import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { GeographicUnitV110, GeographicLevel } from '../../types';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  FolderTree,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Database,
  Building,
  Home,
  Compass
} from 'lucide-react';
import { getChildGeographicUnits, getGeographicBreadcrumbs } from '../../utils/maniemaEngine';

export const ManiemaGeoManager: React.FC = () => {
  const { maniemaGeoUnits, addManiemaGeoUnit, updateManiemaGeoUnit, toggleManiemaGeoUnitStatus } = useData();

  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtered units
  const currentUnits = useMemo(() => {
    let units = maniemaGeoUnits;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return units.filter(
        u =>
          u.name.toLowerCase().includes(term) ||
          u.code.toLowerCase().includes(term) ||
          u.source.toLowerCase().includes(term)
      );
    }

    if (levelFilter !== 'ALL') {
      units = units.filter(u => u.level === levelFilter);
    } else if (selectedParentId !== null) {
      units = getChildGeographicUnits(maniemaGeoUnits, selectedParentId);
    } else {
      // Default: show Territories & Health Zones
      units = maniemaGeoUnits.filter(u => u.level === 'PROVINCE' || u.level === 'VILLE_TERRITOIRE');
    }

    return units;
  }, [maniemaGeoUnits, selectedParentId, searchTerm, levelFilter]);

  const breadcrumbs = useMemo(() => {
    if (!selectedParentId) return [];
    return getGeographicBreadcrumbs(maniemaGeoUnits, selectedParentId);
  }, [maniemaGeoUnits, selectedParentId]);

  // Statistics
  const statsByLevel = useMemo(() => {
    const counts: Record<string, number> = {};
    maniemaGeoUnits.forEach(u => {
      counts[u.level] = (counts[u.level] || 0) + 1;
    });
    return counts;
  }, [maniemaGeoUnits]);

  // New Geographic Unit Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState<GeographicLevel>('ZONE_SANTE');
  const [newParentId, setNewParentId] = useState<string>(selectedParentId || 'TERR_KINDU');
  const [newPopulation, setNewPopulation] = useState<number>(10000);
  const [newLat, setNewLat] = useState<string>('-2.95');
  const [newLng, setNewLng] = useState<string>('25.95');

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const unit: GeographicUnitV110 = {
      id: `GEO_${newCode.toUpperCase()}_${Date.now()}`,
      code: newCode.toUpperCase(),
      name: newName,
      level: newLevel,
      parentId: newParentId || null,
      provinceId: 'PROV_MANIEMA',
      population: Number(newPopulation) || 0,
      coordinates: newLat && newLng ? { lat: parseFloat(newLat), lng: parseFloat(newLng) } : null,
      status: 'ACTIF',
      source: 'RÉFÉRENTIEL_PROVINCIAL_MANIEMA_V110',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addManiemaGeoUnit(unit);
    setShowAddModal(false);
    setNewCode('');
    setNewName('');
  };

  const exportGeoHierarchyJSON = () => {
    const dataStr = JSON.stringify(maniemaGeoUnits, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referentiel_spatial_maniema_v110_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Référentiel Spatial Hiérarchique du Maniema</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Province → Site ({maniemaGeoUnits.length} unités)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Hiérarchie spatiale complète : Province de Maniema, 7 Territoires, Ville de Kindu, 18 Zones de Santé, Aires de Santé et Sites de collecte.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportGeoHierarchyJSON}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
          >
            <Download className="h-4 w-4" />
            Exporter JSON
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Nouvelle unité spatiale
          </button>
        </div>
      </div>

      {/* Hierarchy Level Distribution Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { level: 'PROVINCE', label: 'Province', count: statsByLevel['PROVINCE'] || 0, color: 'text-purple-300 border-purple-800 bg-purple-950/40' },
          { level: 'VILLE_TERRITOIRE', label: 'Territoires/Villes', count: statsByLevel['VILLE_TERRITOIRE'] || 0, color: 'text-sky-300 border-sky-800 bg-sky-950/40' },
          { level: 'ZONE_SANTE', label: 'Zones de Santé', count: statsByLevel['ZONE_SANTE'] || 0, color: 'text-emerald-300 border-emerald-800 bg-emerald-950/40' },
          { level: 'AIRE_SANTE', label: 'Aires de Santé', count: statsByLevel['AIRE_SANTE'] || 0, color: 'text-teal-300 border-teal-800 bg-teal-950/40' },
          { level: 'QUARTIER_VILLAGE', label: 'Villages/Quartiers', count: statsByLevel['QUARTIER_VILLAGE'] || 0, color: 'text-amber-300 border-amber-800 bg-amber-950/40' },
          { level: 'AVENUE_RUE', label: 'Avenues/Rues', count: statsByLevel['AVENUE_RUE'] || 0, color: 'text-indigo-300 border-indigo-800 bg-indigo-950/40' },
          { level: 'SITE', label: 'Sites / Points', count: statsByLevel['SITE'] || 0, color: 'text-rose-300 border-rose-800 bg-rose-950/40' },
        ].map(item => (
          <div
            key={item.level}
            onClick={() => {
              setLevelFilter(levelFilter === item.level ? 'ALL' : item.level);
              setSelectedParentId(null);
            }}
            className={`p-2.5 rounded-lg border text-center cursor-pointer transition ${item.color} ${
              levelFilter === item.level ? 'ring-2 ring-white/50 font-bold scale-[1.02]' : 'opacity-90 hover:opacity-100'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider block font-semibold">{item.label}</span>
            <span className="text-base font-extrabold mt-0.5 block">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Navigation Breadcrumbs & Search Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={() => {
                setSelectedParentId(null);
                setLevelFilter('ALL');
              }}
              className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Compass className="h-3.5 w-3.5" /> Maniema (Racine)
            </button>

            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="h-3 w-3 text-slate-500" />
                <button
                  onClick={() => {
                    setSelectedParentId(crumb.id);
                    setLevelFilter('ALL');
                  }}
                  className={`hover:underline ${
                    idx === breadcrumbs.length - 1 ? 'text-white font-bold' : 'text-slate-300'
                  }`}
                >
                  {crumb.name} ({crumb.level})
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Search and level filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher entité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 w-48 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <select
              aria-label="Filtrer par niveau hiérarchique"
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setSelectedParentId(null);
              }}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les niveaux</option>
              <option value="PROVINCE">Province</option>
              <option value="VILLE_TERRITOIRE">Territoires / Villes</option>
              <option value="ZONE_SANTE">Zones de Santé</option>
              <option value="AIRE_SANTE">Aires de Santé</option>
              <option value="QUARTIER_VILLAGE">Quartiers / Villages</option>
              <option value="SITE">Sites</option>
            </select>
          </div>
        </div>

        {/* Table of Geographic Units */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-slate-950/50">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Nom de l'Entité</th>
                <th className="py-2.5 px-3">Niveau Spatial</th>
                <th className="py-2.5 px-3">Parent Hiérarchique</th>
                <th className="py-2.5 px-3">Population</th>
                <th className="py-2.5 px-3">Coordonnées GPS</th>
                <th className="py-2.5 px-3">Statut</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {currentUnits.map(unit => {
                const parentUnit = maniemaGeoUnits.find(u => u.id === unit.parentId);
                const hasChildren = maniemaGeoUnits.some(u => u.parentId === unit.id);

                return (
                  <tr key={unit.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-mono font-bold text-emerald-400">{unit.code}</td>
                    <td className="py-2 px-3 font-semibold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        {unit.name}
                        {hasChildren && (
                          <button
                            onClick={() => setSelectedParentId(unit.id)}
                            title="Descendre dans la hiérarchie"
                            className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono hover:bg-emerald-900"
                          >
                            Explorer ↓
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                        {unit.level}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {parentUnit ? `${parentUnit.name} (${parentUnit.code})` : '— Racine —'}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-300">
                      {unit.population > 0 ? unit.population.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                      {unit.coordinates ? `${unit.coordinates.lat.toFixed(4)}, ${unit.coordinates.lng.toFixed(4)}` : 'Non géolocalisé'}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => toggleManiemaGeoUnitStatus(unit.id)}
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          unit.status === 'ACTIF'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}
                      >
                        {unit.status}
                      </button>
                    </td>
                    <td className="py-2 px-3 text-right">
                      {hasChildren && (
                        <button
                          onClick={() => setSelectedParentId(unit.id)}
                          className="text-xs text-sky-400 hover:text-sky-300 font-medium mr-2"
                        >
                          Sous-unités →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {currentUnits.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    Aucune entité géographique ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Geographic Unit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Ajouter une Entité Géographique</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Code Unité (ex: ZS_PANGI)</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="ZS_PANGI"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Nom de l'Entité</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Zone de Santé de Pangi"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Niveau Hiérarchique</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as GeographicLevel)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  >
                    <option value="VILLE_TERRITOIRE">Territoire / Ville</option>
                    <option value="ZONE_SANTE">Zone de Santé</option>
                    <option value="AIRE_SANTE">Aire de Santé</option>
                    <option value="QUARTIER_VILLAGE">Quartier / Village</option>
                    <option value="AVENUE_RUE">Avenue / Rue</option>
                    <option value="SITE">Site de surveillance / Gîte</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Parent Hiérarchique</label>
                  <select
                    value={newParentId}
                    onChange={(e) => setNewParentId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  >
                    {maniemaGeoUnits
                      .filter(u => u.level === 'PROVINCE' || u.level === 'VILLE_TERRITOIRE' || u.level === 'ZONE_SANTE' || u.level === 'AIRE_SANTE')
                      .map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.level})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Population estimée</label>
                <input
                  type="number"
                  value={newPopulation}
                  onChange={(e) => setNewPopulation(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
                >
                  Enregistrer l'Entité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
