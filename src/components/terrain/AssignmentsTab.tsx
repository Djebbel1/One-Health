import React, { useState } from 'react';
import { FieldAssignment, FieldEnumerator, FieldTeam } from '../../types';
import {
  MapPin,
  Scale,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Target,
  ChevronRight,
  Clock,
  X
} from 'lucide-react';

interface AssignmentsTabProps {
  assignments: FieldAssignment[];
  enumerators: FieldEnumerator[];
  teams: FieldTeam[];
  onAddAssignment: (newAssignment: FieldAssignment) => void;
  onApplyBalancedDistribution: (newAssignments: FieldAssignment[]) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  enumerators,
  teams,
  onAddAssignment,
  onApplyBalancedDistribution
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  // Form for single assignment
  const [selectedEnumeratorId, setSelectedEnumeratorId] = useState(enumerators[0]?.id || '');
  const [healthZone, setHealthZone] = useState('Kindu');
  const [healthArea, setHealthArea] = useState('Kasuku');
  const [neighborhood, setNeighborhood] = useState('Kasuku Ouest');
  const [avenueStreet, setAvenueStreet] = useState('Av. des Pionniers');
  const [plannedCount, setPlannedCount] = useState(120);

  // Balanced distribution wizard state
  const [balanceTotalHouseholds, setBalanceTotalHouseholds] = useState(600);
  const [balancePreview, setBalancePreview] = useState<
    { enumeratorId: string; enumeratorName: string; quota: number; estimatedHours: number }[]
  >([]);
  const [distributionAppliedSuccess, setDistributionAppliedSuccess] = useState(false);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const enq = enumerators.find((e) => e.id === selectedEnumeratorId);
    if (!enq) return;

    const newAss: FieldAssignment = {
      id: `AFF-2027-${(assignments.length + 1).toString().padStart(3, '0')}`,
      campaignId: 'CAMP-2027-01',
      campaignName: 'Campagne One Health 2027',
      teamId: enq.teamId,
      teamName: enq.teamName,
      enumeratorId: enq.id,
      enumeratorName: enq.displayName,
      territory: healthZone,
      healthZone,
      healthArea,
      neighborhood,
      avenueStreet,
      formType: 'MENAGE_ONE_HEALTH',
      periodId: 'PER-2027-S1',
      periodName: 'Série 1 - 2027',
      plannedHouseholdsCount: Number(plannedCount) || 100,
      completedHouseholdsCount: 0,
      estimatedWorkloadHours: Math.round((Number(plannedCount) || 100) * 0.25),
      status: 'ATTRIBUE',
      assignedDate: new Date().toISOString().slice(0, 10),
      geofenceCenter: { lat: -2.9515, lng: 25.9520, radiusMeters: 800 }
    };

    onAddAssignment(newAss);
    setIsModalOpen(false);
  };

  const handleComputeBalancedDistribution = () => {
    const activeEnums = enumerators.filter((e) => e.status !== 'INACTIF');
    if (activeEnums.length === 0) return;

    const baseQuota = Math.floor(balanceTotalHouseholds / activeEnums.length);
    const remainder = balanceTotalHouseholds % activeEnums.length;

    const preview = activeEnums.map((enq, idx) => {
      const quota = baseQuota + (idx < remainder ? 1 : 0);
      const estimatedHours = Math.round(quota * 0.26);
      return {
        enumeratorId: enq.id,
        enumeratorName: enq.displayName,
        quota,
        estimatedHours
      };
    });

    setBalancePreview(preview);
  };

  const handleApplyDistribution = () => {
    if (balancePreview.length === 0) return;

    const newAssignmentsList: FieldAssignment[] = balancePreview.map((item, idx) => {
      const enq = enumerators.find((e) => e.id === item.enumeratorId)!;
      return {
        id: `AFF-BAL-2027-${(idx + 1).toString().padStart(3, '0')}`,
        campaignId: 'CAMP-2027-01',
        campaignName: 'Campagne One Health 2027',
        teamId: enq.teamId,
        teamName: enq.teamName,
        enumeratorId: enq.id,
        enumeratorName: enq.displayName,
        territory: 'Kindu',
        healthZone: 'Kindu',
        healthArea: `Aire ${enq.assignedHealthAreas[0] || 'Centrale'}`,
        neighborhood: 'Secteur Réparti',
        formType: 'MENAGE_ONE_HEALTH',
        periodId: 'PER-2027-S1',
        periodName: 'Série 1 - 2027',
        plannedHouseholdsCount: item.quota,
        completedHouseholdsCount: 0,
        estimatedWorkloadHours: item.estimatedHours,
        status: 'ATTRIBUE',
        assignedDate: new Date().toISOString().slice(0, 10),
        geofenceCenter: { lat: -2.9515, lng: 25.9520, radiusMeters: 800 }
      };
    });

    onApplyBalancedDistribution(newAssignmentsList);
    setDistributionAppliedSuccess(true);
    setTimeout(() => {
      setIsBalanceModalOpen(false);
      setDistributionAppliedSuccess(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Boutons d'Action */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Déploiement
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Répartition Équitable &amp; Géofencing</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Affectations des Secteurs &amp; Quotas Ménages
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cartographie des îlots attribués, prévisions de charges horaires et suivi de complétude par aire.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setIsBalanceModalOpen(true);
              handleComputeBalancedDistribution();
            }}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <Scale className="w-4 h-4" />
            <span>Assistant Répartition Équilibrée</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Affectation</span>
          </button>
        </div>
      </div>

      {/* Grille des Affectations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assignments.map((ass) => {
          const progressPercent = ass.plannedHouseholdsCount > 0
            ? Math.min(100, Math.round((ass.completedHouseholdsCount / ass.plannedHouseholdsCount) * 100))
            : 0;

          return (
            <div
              key={ass.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {ass.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    ass.status === 'EN_COURS'
                      ? 'bg-amber-100 text-amber-800'
                      : ass.status === 'TERMINE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ass.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {ass.healthArea} • {ass.neighborhood}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {ass.enumeratorName}
                  </p>
                </div>

                <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span className="truncate">{ass.avenueStreet || 'Axe principal'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Charge estimée : {ass.estimatedWorkloadHours} heures</span>
                  </div>
                </div>

                {/* Barre de Progression */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Ménages</span>
                    <span className="font-mono font-bold text-teal-800">
                      {ass.completedHouseholdsCount} / {ass.plannedHouseholdsCount} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>

              <div className="pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Assigné le {ass.assignedDate}</span>
                <span className="font-bold text-teal-700">Géofence ±{ass.geofenceCenter?.radiusMeters || 800}m</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Assistant Répartition Équilibrée */}
      {isBalanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Assistant de Répartition Équilibrée de la Charge
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calcul automatique de distribution équitable des quotas et volumes horaires
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBalanceModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Total de Ménages Cibles à Répartir :
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={balanceTotalHouseholds}
                    onChange={(e) => setBalanceTotalHouseholds(Number(e.target.value))}
                    className="w-32 p-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleComputeBalancedDistribution}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Recalculer
                  </button>
                </div>
              </div>

              {/* Tableau Prévisionnel de Répartition */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Enquêteur</th>
                      <th className="px-3 py-2 text-center font-bold text-slate-600">Quota Ménages</th>
                      <th className="px-3 py-2 text-center font-bold text-slate-600">Charge Estimée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {balancePreview.map((item) => (
                      <tr key={item.enumeratorId}>
                        <td className="px-3 py-2 font-medium text-slate-800">
                          {item.enumeratorName} <span className="text-[10px] text-slate-400 font-mono">({item.enumeratorId})</span>
                        </td>
                        <td className="px-3 py-2 text-center font-mono font-bold text-teal-800">
                          {item.quota} ménages
                        </td>
                        <td className="px-3 py-2 text-center font-mono text-slate-600">
                          ~{item.estimatedHours} h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-[11px] text-indigo-900">
                <strong>Garantie de Non-Régression :</strong> L application de cette répartition ajoute de nouveaux lots sans écraser ni modifier les formulaires déjà complétés ou en cours.
              </div>

              {distributionAppliedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Répartition appliquée avec succès !</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBalanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleApplyDistribution}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Appliquer la Distribution
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal Nouvelle Affectation Simple */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nouvelle Affectation de Secteur</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Enquêteur Assigné *</label>
                <select
                  value={selectedEnumeratorId}
                  onChange={(e) => setSelectedEnumeratorId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  {enumerators.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.displayName} ({e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Zone de Santé</label>
                  <input
                    type="text"
                    value={healthZone}
                    onChange={(e) => setHealthZone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Aire de Santé</label>
                  <input
                    type="text"
                    value={healthArea}
                    onChange={(e) => setHealthArea(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Quartier</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Quota Ménages</label>
                  <input
                    type="number"
                    value={plannedCount}
                    onChange={(e) => setPlannedCount(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Avenue / Rue / Ruelle</label>
                <input
                  type="text"
                  value={avenueStreet}
                  onChange={(e) => setAvenueStreet(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Attribuer l Affectation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
