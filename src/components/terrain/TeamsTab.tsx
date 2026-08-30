import React, { useState } from 'react';
import { FieldTeam, FieldEnumerator } from '../../types';
import {
  Users,
  Plus,
  Building2,
  Shield,
  MapPin,
  CheckCircle2,
  X,
  Smartphone,
  Award
} from 'lucide-react';

interface TeamsTabProps {
  teams: FieldTeam[];
  enumerators: FieldEnumerator[];
  onAddTeam: (newTeam: FieldTeam) => void;
}

export const TeamsTab: React.FC<TeamsTabProps> = ({
  teams,
  enumerators,
  onAddTeam
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [territory, setTerritory] = useState('Zone de Santé de Kindu');
  const [targetHouseholds, setTargetHouseholds] = useState(500);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const newTeam: FieldTeam = {
      id: `EQ-${(teams.length + 1).toString().padStart(2, '0')}`,
      name: teamName,
      supervisorId: `USR-SUP-${Date.now().toString().slice(-3)}`,
      supervisorName: supervisorName || 'Dr. Superviseur Nouveau',
      membersIds: [],
      membersNames: [],
      territory,
      healthZones: ['Kindu'],
      campaignId: 'CAMP-2027-01',
      campaignName: 'Campagne Opérationnelle One Health Kindu-Maniema (Série 2027)',
      status: 'ACTIVE',
      assignedAreasCount: 3,
      targetHouseholds: Number(targetHouseholds) || 400,
      completedFormsCount: 0
    };

    onAddTeam(newTeam);
    setIsModalOpen(false);
    setTeamName('');
    setSupervisorName('');
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Organisation
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Structuration des Brigades de Terrain</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Équipes &amp; Brigades d Enquête Terrain
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordination hiérarchique : Superviseurs, Enquêteurs assignés et Quotas par zone de santé.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Équipe</span>
        </button>
      </div>

      {/* Cartes des Équipes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {teams.map((t) => {
          const teamEnums = enumerators.filter((e) => e.teamId === t.id);
          const progressPercent = t.targetHouseholds > 0
            ? Math.min(100, Math.round((t.completedFormsCount / t.targetHouseholds) * 100))
            : 0;

          return (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* ID & Titre */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {t.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{t.name}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full">
                    {t.status}
                  </span>
                </div>

                {/* Superviseur */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Superviseur Référent
                    </span>
                    <span className="text-xs font-bold text-slate-800 block">
                      {t.supervisorName}
                    </span>
                  </div>
                </div>

                {/* Territoire */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate">{t.territory}</span>
                </div>

                {/* Membres / Enquêteurs */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Membres Enquêteurs ({teamEnums.length}) :
                  </span>
                  <div className="space-y-1">
                    {teamEnums.map((enq) => (
                      <div
                        key={enq.id}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-800">{enq.displayName}</span>
                        </div>
                        <span className="font-mono text-[10px] text-teal-700 font-bold bg-white px-1.5 py-0.5 rounded border">
                          {enq.completedForms} / {enq.assignedHouseholdsTarget}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Objectif & Progression */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Progression Équipe</span>
                    <span className="font-mono font-bold text-teal-800">
                      {t.completedFormsCount} / {t.targetHouseholds} ({progressPercent}%)
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

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Zones d affectation : {t.assignedAreasCount} aires</span>
                <span className="font-medium text-teal-700">Opérationnel</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Création Équipe */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nouvelle Équipe de Terrain</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Nom de l Équipe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Équipe Delta - Kasongo Sud"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Superviseur Référent</label>
                <input
                  type="text"
                  placeholder="Ex : Dr. Antoine Kalombo"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Territoire / Zone</label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Ménages Cibles</label>
                  <input
                    type="number"
                    value={targetHouseholds}
                    onChange={(e) => setTargetHouseholds(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
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
                  Créer l Équipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
