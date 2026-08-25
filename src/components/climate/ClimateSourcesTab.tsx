import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Save,
  X,
  Building2,
  Radio,
  FileText,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ClimateStation, ClimateSource, ClimateStationType, ClimateSourceType } from '../../types';
import { KINDU_HEALTH_ZONES, KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

export const ClimateSourcesTab: React.FC = () => {
  const {
    climateStations,
    climateSources,
    addClimateStation,
    updateClimateStation,
    deleteClimateStation,
    addClimateSource,
    updateClimateSource
  } = useData();

  const [activeCatalog, setActiveCatalog] = useState<'STATIONS' | 'SOURCES'>('STATIONS');

  // Station Form State
  const [stationModalOpen, setStationModalOpen] = useState<boolean>(false);
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [stationId, setStationId] = useState<string>('');
  const [stationName, setStationName] = useState<string>('');
  const [stationType, setStationType] = useState<ClimateStationType>('STATION_METEO_LOCALE');
  const [latitude, setLatitude] = useState<string>('-2.9500');
  const [longitude, setLongitude] = useState<string>('25.9200');
  const [altitude, setAltitude] = useState<string>('450');
  const [healthZoneId, setHealthZoneId] = useState<string>('ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>('');
  const [operator, setOperator] = useState<string>('DPS Maniema / Université de Kindu');
  const [status, setStatus] = useState<'ACTIF' | 'INACTIF' | 'OCCASIONNEL'>('ACTIF');
  const [notes, setNotes] = useState<string>('');

  // Source Form State
  const [sourceModalOpen, setSourceModalOpen] = useState<boolean>(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState<string>('');
  const [sourceName, setSourceName] = useState<string>('');
  const [sourceType, setSourceType] = useState<ClimateSourceType>('STATION_METEOROLOGIQUE');
  const [provider, setProvider] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [spatialRes, setSpatialRes] = useState<string>('Point sol / 0.05°');
  const [temporalRes, setTemporalRes] = useState<string>('Journalier / Mensuel');
  const [variablesProvided, setVariablesProvided] = useState<string>('Pluviométrie, Température');
  const [contact, setContact] = useState<string>('');

  // Open Station Modal
  const handleOpenAddStation = () => {
    setEditingStationId(null);
    setStationId(`STN_KIN_${Date.now().toString().slice(-4)}`);
    setStationName('');
    setStationType('STATION_METEO_LOCALE');
    setLatitude('-2.9500');
    setLongitude('25.9200');
    setAltitude('450');
    setHealthZoneId('ZS_KINDU');
    setHealthAreaId('');
    setOperator('DPS Maniema / Université de Kindu');
    setStatus('ACTIF');
    setNotes('');
    setStationModalOpen(true);
  };

  const handleOpenEditStation = (st: ClimateStation) => {
    setEditingStationId(st.station_id);
    setStationId(st.station_id);
    setStationName(st.station_name);
    setStationType(st.station_type);
    setLatitude(String(st.latitude));
    setLongitude(String(st.longitude));
    setAltitude(st.altitude ? String(st.altitude) : '');
    setHealthZoneId(st.health_zone_id || 'ZS_KINDU');
    setHealthAreaId(st.health_area_id || '');
    setOperator(st.operator);
    setStatus(st.status);
    setNotes(st.notes || '');
    setStationModalOpen(true);
  };

  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationId.trim() || !stationName.trim()) {
      alert('Identifiant et nom de la station requis.');
      return;
    }

    const stationObj: ClimateStation = {
      station_id: stationId.trim().toUpperCase(),
      station_name: stationName.trim(),
      station_type: stationType,
      latitude: parseFloat(latitude) || -2.95,
      longitude: parseFloat(longitude) || 25.92,
      altitude: altitude ? parseFloat(altitude) : undefined,
      health_zone_id: healthZoneId,
      health_area_id: healthAreaId || undefined,
      operator: operator.trim(),
      status,
      notes: notes.trim()
    };

    if (editingStationId) {
      updateClimateStation(stationObj);
    } else {
      addClimateStation(stationObj);
    }
    setStationModalOpen(false);
  };

  // Open Source Modal
  const handleOpenAddSource = () => {
    setEditingSourceId(null);
    setSourceId(`SRC_${Date.now().toString().slice(-4)}`);
    setSourceName('');
    setSourceType('STATION_METEOROLOGIQUE');
    setProvider('');
    setReference('');
    setUrl('');
    setSpatialRes('Point sol');
    setTemporalRes('Mensuel');
    setVariablesProvided('Pluviométrie, Température');
    setContact('');
    setSourceModalOpen(true);
  };

  const handleOpenEditSource = (src: ClimateSource) => {
    setEditingSourceId(src.source_id);
    setSourceId(src.source_id);
    setSourceName(src.source_name);
    setSourceType(src.source_type);
    setProvider(src.provider);
    setReference(src.reference || '');
    setUrl(src.url || '');
    setSpatialRes(src.spatial_resolution || '');
    setTemporalRes(src.temporal_resolution || '');
    setVariablesProvided(src.variables_provided.join(', '));
    setContact(src.contact || '');
    setSourceModalOpen(true);
  };

  const handleSaveSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId.trim() || !sourceName.trim()) {
      alert('Identifiant et nom de la source requis.');
      return;
    }

    const sourceObj: ClimateSource = {
      source_id: sourceId.trim().toUpperCase(),
      source_name: sourceName.trim(),
      source_type: sourceType,
      provider: provider.trim(),
      reference: reference.trim() || undefined,
      url: url.trim() || undefined,
      spatial_resolution: spatialRes.trim() || undefined,
      temporal_resolution: temporalRes.trim() || undefined,
      variables_provided: variablesProvided.split(',').map(v => v.trim()).filter(Boolean),
      contact: contact.trim() || undefined
    };

    if (editingSourceId) {
      updateClimateSource(sourceObj);
    } else {
      addClimateSource(sourceObj);
    }
    setSourceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Répertoire & Catalogue des Sources et Stations Météorologiques
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Garantie de traçabilité des données d'entrée • Référencement institutionnel et spatialisé
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeCatalog === 'STATIONS' ? (
            <button
              onClick={handleOpenAddStation}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Ajouter une Station
            </button>
          ) : (
            <button
              onClick={handleOpenAddSource}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Ajouter une Source
            </button>
          )}
        </div>
      </div>

      {/* Catalog Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveCatalog('STATIONS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 ${
            activeCatalog === 'STATIONS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          Stations Sol & Postes Sentinelles ({climateStations.length})
        </button>

        <button
          onClick={() => setActiveCatalog('SOURCES')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition inline-flex items-center gap-2 ${
            activeCatalog === 'SOURCES'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-400" />
          Fournisseurs & Produits Satellitaires ({climateSources.length})
        </button>
      </div>

      {/* 1. STATIONS TABLE */}
      {activeCatalog === 'STATIONS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Code</th>
                  <th className="px-3.5 py-3">Nom de la Station</th>
                  <th className="px-3.5 py-3">Type</th>
                  <th className="px-3.5 py-3">Coordonnées GPS</th>
                  <th className="px-3.5 py-3">Zone de Santé</th>
                  <th className="px-3.5 py-3">Opérateur</th>
                  <th className="px-3.5 py-3">Statut</th>
                  <th className="px-3.5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {climateStations.map(st => (
                  <tr key={st.station_id} className="hover:bg-slate-50 transition">
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900">{st.station_id}</td>
                    <td className="px-3.5 py-3 font-medium text-slate-800">{st.station_name}</td>
                    <td className="px-3.5 py-3">
                      <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        {st.station_type}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 font-mono text-slate-600">
                      {st.latitude.toFixed(4)}°, {st.longitude.toFixed(4)}° {st.altitude ? `(${st.altitude}m)` : ''}
                    </td>
                    <td className="px-3.5 py-3 text-slate-600">{st.health_zone_id || 'Global'}</td>
                    <td className="px-3.5 py-3">{st.operator}</td>
                    <td className="px-3.5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        st.status === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditStation(st)}
                        className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer la station ${st.station_name} (${st.station_id}) ?`)) {
                            deleteClimateStation(st.station_id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SOURCES TABLE */}
      {activeCatalog === 'SOURCES' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-3">Code Source</th>
                  <th className="px-3.5 py-3">Nom du Produit / Source</th>
                  <th className="px-3.5 py-3">Type</th>
                  <th className="px-3.5 py-3">Fournisseur</th>
                  <th className="px-3.5 py-3">Résolution</th>
                  <th className="px-3.5 py-3">Variables Fournies</th>
                  <th className="px-3.5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {climateSources.map(src => (
                  <tr key={src.source_id} className="hover:bg-slate-50 transition">
                    <td className="px-3.5 py-3 font-mono font-bold text-slate-900">{src.source_id}</td>
                    <td className="px-3.5 py-3 font-medium text-slate-800">
                      <div>{src.source_name}</div>
                      {src.reference && <div className="text-[10px] text-slate-400 mt-0.5">{src.reference}</div>}
                    </td>
                    <td className="px-3.5 py-3">
                      <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded">
                        {src.source_type}
                      </span>
                    </td>
                    <td className="px-3.5 py-3">{src.provider}</td>
                    <td className="px-3.5 py-3 text-slate-600">
                      {src.spatial_resolution} • {src.temporal_resolution}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {src.variables_provided.map((v, i) => (
                          <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {v}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3.5 py-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditSource(src)}
                        className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Station Modal */}
      {stationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveStation} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {editingStationId ? 'Modifier la Station' : 'Nouvelle Station Météorologique'}
              </h3>
              <button type="button" onClick={() => setStationModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Code Station *</label>
                <input
                  type="text"
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  disabled={!!editingStationId}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type de Station</label>
                <select
                  value={stationType}
                  onChange={(e) => setStationType(e.target.value as ClimateStationType)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="METEOROLOGIE_NATIONALE_METELSAT">METTELSAT Synoptique</option>
                  <option value="STATION_METEO_LOCALE">Poste Pluviométrique Local</option>
                  <option value="SATELLITE_CHIRPS">Pixel CHIRPS</option>
                  <option value="SATELLITE_ERA5">Pixel ERA5</option>
                  <option value="CAPTEUR_AUTOMATIQUE">Capteur Automatique Connecté</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nom de la Station *</label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  placeholder="Ex: Poste Pluviométrique Kasuku-Centre"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Latitude (° N)</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Longitude (° E)</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opérateur</label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="ACTIF">ACTIF</option>
                  <option value="OCCASIONNEL">OCCASIONNEL</option>
                  <option value="INACTIF">INACTIF</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStationModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow"
              >
                Enregistrer la station
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Source Modal */}
      {sourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSource} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                {editingSourceId ? 'Modifier la Source' : 'Nouvelle Source de Données'}
              </h3>
              <button type="button" onClick={() => setSourceModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Code Source *</label>
                <input
                  type="text"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  disabled={!!editingSourceId}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type de Source</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as ClimateSourceType)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="STATION_METEOROLOGIQUE">Station Météorologique</option>
                  <option value="SERVICE_METEOROLOGIQUE">Service Météorologique</option>
                  <option value="BASE_SATELLITAIRE">Base Satellitaire</option>
                  <option value="BASE_CLIMATIQUE">Base Climatique / Réanalyse</option>
                  <option value="IMPORT_EXCEL">Import Excel</option>
                  <option value="IMPORT_CSV">Import CSV</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nom de la Source *</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fournisseur / Institution</label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Résolution Temporelle</label>
                <input
                  type="text"
                  value={temporalRes}
                  onChange={(e) => setTemporalRes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Variables Fournies (séparées par virgule)</label>
                <input
                  type="text"
                  value={variablesProvided}
                  onChange={(e) => setVariablesProvided(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSourceModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow"
              >
                Enregistrer la source
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
