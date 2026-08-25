import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { HealthEnvironmentLink, HealthClimateLink, ClimateEnvironmentLink } from '../../types';
import {
  Link2,
  Plus,
  Trash2,
  Activity,
  CloudSun,
  Layers,
  Home,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  X,
  Info
} from 'lucide-react';

export const CrossDomainRelationsSection: React.FC = () => {
  const {
    healthEnvLinks,
    addHealthEnvLink,
    deleteHealthEnvLink,
    healthClimateLinks,
    addHealthClimateLink,
    deleteHealthClimateLink,
    climateEnvLinks,
    addClimateEnvLink,
    deleteClimateEnvLink,
    geographicUnits,
    analysisPeriods,
  } = useData();

  const [activeRelationTab, setActiveRelationTab] = useState<'HEALTH_ENV' | 'HEALTH_CLIMATE' | 'CLIMATE_ENV'>('HEALTH_ENV');

  // Modal for new link
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [targetGeoId, setTargetGeoId] = useState('AS-001');
  const [targetPeriodId, setTargetPeriodId] = useState('P-2024-04');
  const [spatialMatch, setSpatialMatch] = useState<'EXACT' | 'PROXIMITY_BUFFER' | 'HEALTH_AREA_CONTAINED'>('HEALTH_AREA_CONTAINED');
  const [lagMonths, setLagMonths] = useState<number>(0);
  const [linkQuality, setLinkQuality] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [linkNotes, setLinkNotes] = useState('');

  const handleCreateHealthClimateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const newLink: HealthClimateLink = {
      link_id: `LNK-HC-${Date.now().toString().slice(-4)}`,
      health_record_id: `SAN-${Math.floor(Math.random() * 900000 + 100000)}`,
      climate_record_id: `CLI-000001`,
      geo_id: targetGeoId,
      period_id: targetPeriodId,
      lag_months: lagMonths,
      link_quality: linkQuality,
      spatial_scale_match: 'PROXY_CITY_LEVEL',
      notes: linkNotes || 'Liaison spatio-temporelle créée avec décalage (lag)',
    };
    addHealthClimateLink(newLink);
    setIsAddingLink(false);
    setLinkNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Link2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Liaisons & Relations Inter-Domaines
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Association spatio-temporelle structurée entre Santé, Environnement et Climat. Gestion explicite des <strong>décalages temporels (lags)</strong> et qualification de la représentativité spatiale.
            </p>
          </div>

          <button
            onClick={() => setIsAddingLink(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Créer une Liaison
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveRelationTab('HEALTH_ENV')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeRelationTab === 'HEALTH_ENV' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>&harr;</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Santé &harr; Environnement ({healthEnvLinks.length})
          </button>

          <button
            onClick={() => setActiveRelationTab('HEALTH_CLIMATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeRelationTab === 'HEALTH_CLIMATE' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>&harr;</span>
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            Santé &harr; Climat ({healthClimateLinks.length})
          </button>

          <button
            onClick={() => setActiveRelationTab('CLIMATE_ENV')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeRelationTab === 'CLIMATE_ENV' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span>&harr;</span>
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Climat &harr; Environnement ({climateEnvLinks.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Health <-> Env */}
      {activeRelationTab === 'HEALTH_ENV' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Code Liaison</th>
                  <th className="py-3 px-4">Enreg. Santé</th>
                  <th className="py-3 px-4">Obs. Environnement</th>
                  <th className="py-3 px-4">Unité Spatiale (Aire)</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4">Appariement Spatial</th>
                  <th className="py-3 px-4">Qualité</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {healthEnvLinks.map((link) => (
                  <tr key={link.link_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {link.link_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-700">
                      {link.health_record_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700">
                      {link.env_observation_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {link.geo_id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {link.period_id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                        {link.spatial_match_type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {link.link_quality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteHealthEnvLink(link.link_id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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

      {/* Tab 2: Health <-> Climate */}
      {activeRelationTab === 'HEALTH_CLIMATE' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Code Liaison</th>
                  <th className="py-3 px-4">Enreg. Santé</th>
                  <th className="py-3 px-4">Série Climat</th>
                  <th className="py-3 px-4">Unité Spatiale</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4 text-center">Décalage (Lag)</th>
                  <th className="py-3 px-4">Échelle Spatiale</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {healthClimateLinks.map((link) => (
                  <tr key={link.link_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {link.link_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-700">
                      {link.health_record_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-700">
                      {link.climate_record_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {link.geo_id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {link.period_id}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {link.lag_months === 0 ? 'Lag 0 (Même mois)' : `Lag ${link.lag_months} mois`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {link.spatial_scale_match}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteHealthClimateLink(link.link_id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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

      {/* Tab 3: Climate <-> Env */}
      {activeRelationTab === 'CLIMATE_ENV' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Code Liaison</th>
                  <th className="py-3 px-4">Série Climat</th>
                  <th className="py-3 px-4">Obs. Environnement</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4">Qualité</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {climateEnvLinks.map((link) => (
                  <tr key={link.link_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800">
                      {link.link_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-700">
                      {link.climate_record_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700">
                      {link.env_observation_id}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {link.period_id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {link.link_quality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {link.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteClimateEnvLink(link.link_id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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

      {/* Add Link Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleCreateHealthClimateLink} className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Créer une Liaison Santé &harr; Climat</h3>
              <button type="button" onClick={() => setIsAddingLink(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Aire de Santé Cible</label>
                <select
                  value={targetGeoId}
                  onChange={(e) => setTargetGeoId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                >
                  {geographicUnits.filter(u => u.geo_type === 'AIRE_DE_SANTE').map(u => (
                    <option key={u.geo_id} value={u.geo_id}>
                      {u.geo_id} — {u.geo_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Période Standardisée</label>
                <select
                  value={targetPeriodId}
                  onChange={(e) => setTargetPeriodId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                >
                  {analysisPeriods.slice(0, 12).map(p => (
                    <option key={p.period_id} value={p.period_id}>
                      {p.period_id} ({p.label})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Décalage Temporel (Lag)</label>
                  <select
                    value={lagMonths}
                    onChange={(e) => setLagMonths(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  >
                    <option value={0}>Lag 0 (Même mois)</option>
                    <option value={1}>Lag 1 (Climat mois M-1)</option>
                    <option value={2}>Lag 2 (Climat mois M-2)</option>
                    <option value={3}>Lag 3 (Climat mois M-3)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Qualité de Liaison</label>
                  <select
                    value={linkQuality}
                    onChange={(e) => setLinkQuality(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="HIGH">Élevée (Directe)</option>
                    <option value="MEDIUM">Moyenne (Proxy)</option>
                    <option value="LOW">Faible (Estimée)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Justification Scientifique & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Hypothèse du cycle de reproduction de l anophèle (lag 1 mois post-pluies)"
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs"
              >
                Enregistrer la Liaison
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
