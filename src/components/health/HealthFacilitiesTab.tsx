import React, { useState, useMemo } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Edit3,
  Save,
  X,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { HealthFacility } from '../../types';
import { KINDU_HEALTH_AREAS, KINDU_HEALTH_ZONES } from '../../data/kinduGeography';

export const HealthFacilitiesTab: React.FC = () => {
  const { healthFacilities, addHealthFacility, healthRecords } = useData();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFacility, setEditingFacility] = useState<HealthFacility | null>(null);

  // Form Fields
  const [facilityId, setFacilityId] = useState<string>('');
  const [facilityName, setFacilityName] = useState<string>('');
  const [facilityType, setFacilityType] = useState<'HGR' | 'CENTRE_SANTE' | 'POSTE_SANTE' | 'CLINIQUE' | 'CABINET_MEDICAL'>('CENTRE_SANTE');
  const [zoneId, setZoneId] = useState<string>('ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>('AS_MIKELENGE');
  const [latitude, setLatitude] = useState<number>(-2.955);
  const [longitude, setLongitude] = useState<number>(25.925);
  const [address, setAddress] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [status, setStatus] = useState<'ACTIF' | 'INACTIF'>('ACTIF');

  // Open New Modal
  const handleOpenNew = () => {
    setEditingFacility(null);
    setFacilityId(`FAC_CUSTOM_${Date.now().toString().slice(-4)}`);
    setFacilityName('');
    setFacilityType('CENTRE_SANTE');
    setZoneId('ZS_KINDU');
    setHealthAreaId('AS_MIKELENGE');
    setLatitude(-2.955);
    setLongitude(25.925);
    setAddress('Kindu');
    setContactPerson('Infirmier Titulaire');
    setStatus('ACTIF');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (fac: HealthFacility) => {
    setEditingFacility(fac);
    setFacilityId(fac.facility_id);
    setFacilityName(fac.facility_name);
    setFacilityType(fac.facility_type);
    setZoneId(fac.zone_id);
    setHealthAreaId(fac.health_area_id);
    setLatitude(fac.latitude || -2.955);
    setLongitude(fac.longitude || 25.925);
    setAddress(fac.address || '');
    setContactPerson(fac.contact_person || '');
    setStatus(fac.status);
    setIsModalOpen(true);
  };

  // Save Facility
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityName.trim()) {
      alert('Le nom de la structure est requis.');
      return;
    }

    const payload: HealthFacility = {
      facility_id: facilityId,
      facility_name: facilityName,
      facility_type: facilityType,
      zone_id: zoneId,
      health_area_id: healthAreaId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      address,
      contact_person: contactPerson,
      status,
    };

    addHealthFacility(payload);
    setIsModalOpen(false);
  };

  // Filtered List
  const filteredFacilities = useMemo(() => {
    return healthFacilities.filter(f => {
      if (filterZone !== 'ALL' && f.zone_id !== filterZone) return false;
      if (filterArea !== 'ALL' && f.health_area_id !== filterArea) return false;
      if (filterType !== 'ALL' && f.facility_type !== filterType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.facility_name.toLowerCase().includes(q) ||
          f.facility_id.toLowerCase().includes(q) ||
          f.health_area_id.toLowerCase().includes(q) ||
          (f.address || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [healthFacilities, filterZone, filterArea, filterType, searchQuery]);

  // Count records per facility
  const recordsCountByFacility = useMemo(() => {
    const counts: { [key: string]: number } = {};
    healthRecords.forEach(r => {
      const fId = r.facility_id || r.facility_name || r.structure_name;
      if (fId) {
        counts[fId] = (counts[fId] || 0) + 1;
      }
    });
    return counts;
  }, [healthRecords]);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>Annuaire & Référentiel des Structures de Santé (Kindu & Alunguli)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Cartographie des hôpitaux généraux, centres et postes de santé contribuant à la surveillance One Health
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter une Structure</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher structure, quartier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2"
            />
          </div>

          <div>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les Zones de Santé</option>
              <option value="ZS_KINDU">Zone de Santé de Kindu (Rive Droite)</option>
              <option value="ZS_ALUNGULI">Zone de Santé d'Alunguli (Rive Gauche)</option>
            </select>
          </div>

          <div>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les Aires de Santé ({KINDU_HEALTH_AREAS.length})</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tous les types de structures</option>
              <option value="HGR">Hôpital Général de Référence (HGR)</option>
              <option value="CENTRE_SANTE">Centre de Santé (CS / CSR)</option>
              <option value="POSTE_SANTE">Poste de Santé (PS)</option>
              <option value="CLINIQUE">Clinique privée</option>
              <option value="CABINET_MEDICAL">Cabinet médical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3.5">Code / ID</th>
                <th className="py-3 px-3">Nom de la Structure</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Zone de Santé</th>
                <th className="py-3 px-3">Aire de Santé</th>
                <th className="py-3 px-3">Coordonnées GPS</th>
                <th className="py-3 px-2 text-center">Fiches Liées</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFacilities.map((fac) => {
                const count = recordsCountByFacility[fac.facility_id] || recordsCountByFacility[fac.facility_name] || 0;
                return (
                  <tr key={fac.facility_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3.5 font-mono font-bold text-slate-700">{fac.facility_id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{fac.facility_name}</span>
                      </div>
                      {fac.address && <div className="text-[10px] text-slate-500">{fac.address}</div>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        {fac.facility_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {fac.zone_id === 'ZS_KINDU' ? 'Kindu (Rive Droite)' : 'Alunguli (Rive Gauche)'}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {KINDU_HEALTH_AREAS.find(a => a.id === fac.health_area_id)?.name || fac.health_area_id}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {fac.latitude && fac.longitude ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{fac.latitude.toFixed(4)}, {fac.longitude.toFixed(4)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Non géoréférencé</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {count}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fac.status === 'ACTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {fac.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={() => handleOpenEdit(fac)}
                        className="p-1 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded transition"
                        title="Modifier la structure"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>{editingFacility ? 'Modifier la Structure Sanitaire' : 'Ajouter une Nouvelle Structure'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code Structure ID</label>
                  <input
                    type="text"
                    disabled={Boolean(editingFacility)}
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de Structure</label>
                  <select
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  >
                    <option value="HGR">Hôpital Général (HGR)</option>
                    <option value="CENTRE_SANTE">Centre de Santé (CS / CSR)</option>
                    <option value="POSTE_SANTE">Poste de Santé (PS)</option>
                    <option value="CLINIQUE">Clinique privée</option>
                    <option value="CABINET_MEDICAL">Cabinet médical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nom Complet de la Structure <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Centre de Santé Référence Mikelenge"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zone de Santé</label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  >
                    <option value="ZS_KINDU">Zone de Santé de Kindu</option>
                    <option value="ZS_ALUNGULI">Zone de Santé d'Alunguli</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aire de Santé</label>
                  <select
                    value={healthAreaId}
                    onChange={(e) => setHealthAreaId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                  >
                    {KINDU_HEALTH_AREAS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude GPS</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude GPS</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Statut Opérationnel</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                >
                  <option value="ACTIF">ACTIF (En fonctionnement régulier)</option>
                  <option value="INACTIF">INACTIF (Fermé temporairement)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la Structure</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
