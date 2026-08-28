import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { OneHealthProject, TimePeriodConfig, DataSourceTypeV110 } from '../../types';
import {
  Briefcase,
  Clock,
  Plus,
  Calendar,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Users,
  Activity
} from 'lucide-react';

export const ManiemaProjectTimeManager: React.FC = () => {
  const {
    oneHealthProjects,
    activeProjectId,
    setActiveProjectId,
    addOneHealthProject,
    timePeriodConfigs,
    addTimePeriodConfig,
    pathologies,
    maniemaGeoUnits,
    isDemoMode,
    setIsDemoMode
  } = useData();

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTimePeriodModal, setShowAddTimePeriodModal] = useState(false);

  // New Project Form State
  const [pCode, setPCode] = useState('');
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pInvestigator, setPInvestigator] = useState('Professeur Université de Kindu');
  const [pInstitution, setPInstitution] = useState('Université de Kindu / DPS Maniema');
  const [pSelectedPathologies, setPSelectedPathologies] = useState<string[]>(['PATH_MAL', 'PATH_TYP']);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pCode || !pName) return;

    const newPrj: OneHealthProject = {
      id: `PRJ_${pCode.toUpperCase()}_${Date.now()}`,
      code: pCode.toUpperCase(),
      name: pName,
      description: pDesc,
      principalInvestigator: pInvestigator,
      institution: pInstitution,
      pathologyIds: pSelectedPathologies,
      geographicUnitIds: ['PROV_MANIEMA'],
      startDate: '2025-01-01',
      endDate: null,
      status: 'ACTIF',
      isDemoAllowed: true,
      assignedUsers: [{ userId: 'USR_PROV_MANIEMA', role: 'RESPONSABLE_PROPRIETAIRE' as any }],
      createdAt: new Date().toISOString()
    };

    addOneHealthProject(newPrj);
    setShowAddProjectModal(false);
    setActiveProjectId(newPrj.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Gestion des Projets One Health & Séries Temporelles</h2>
            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Multi-Projets & Périodes Découplées
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Traçabilité intégrale des sources de données, étanchéité des études de recherche et gestion d'horizons temporels sans limitation arbitraire.
          </p>
        </div>

        {/* Demo Mode Toggle (Section 14) */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
          <div className="text-right">
            <span className="text-[11px] block font-semibold text-slate-300">Séparation Démo / Réel</span>
            <span className={`text-[10px] font-bold ${isDemoMode ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isDemoMode ? 'DONNÉES DE SIMULATION' : 'DONNÉES RÉELLES OFFICIELLES'}
            </span>
          </div>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              isDemoMode
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            Basculer en mode {isDemoMode ? 'Réel' : 'Démo'}
          </button>
        </div>
      </div>

      {/* Projects Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            Projets de Recherche Actifs ({oneHealthProjects.length})
          </h3>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouveau projet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {oneHealthProjects.map(prj => {
            const isCurrent = prj.id === activeProjectId;
            const projectPathologies = pathologies.filter(p => prj.pathologyIds.includes(p.id));

            return (
              <div
                key={prj.id}
                onClick={() => setActiveProjectId(prj.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-slate-800/90 border-sky-500 ring-1 ring-sky-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-sky-400 font-bold px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {prj.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prj.status === 'ACTIF'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {prj.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{prj.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prj.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">Investigateur :</span> {prj.principalInvestigator}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">Institution :</span> {prj.institution}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {projectPathologies.map(p => (
                      <span
                        key={p.id}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                        style={{ borderLeftColor: p.color, borderLeftWidth: 3 }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Periods & Source Traceability (Section 10 & 13) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              Traçabilité des Sources et Séries Temporelles Indépendantes
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chaque source de données possède son propre horizon temporel sans contrainte de bornage artificiel.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px] bg-slate-950/50">
                <th className="py-2.5 px-3">Identifiant Source</th>
                <th className="py-2.5 px-3">Nom de la Source</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Période Couverte</th>
                <th className="py-2.5 px-3">Nombre d'Années</th>
                <th className="py-2.5 px-3">Résolution</th>
                <th className="py-2.5 px-3">Niveau Géographique</th>
                <th className="py-2.5 px-3">Fiabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {timePeriodConfigs.map(tp => (
                <tr key={tp.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2 px-3 font-mono font-bold text-sky-400">{tp.sourceId}</td>
                  <td className="py-2 px-3 font-semibold text-slate-200">{tp.sourceName}</td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tp.sourceType}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-mono text-emerald-300">
                    {tp.startDate} → {tp.endDate}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-200">{tp.totalYears} ans</td>
                  <td className="py-2 px-3 text-slate-300">{tp.temporalResolution}</td>
                  <td className="py-2 px-3 text-slate-400">{tp.geographicLevel}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        tp.reliability === 'HAUTE'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {tp.reliability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Project */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">Créer un Nouveau Projet One Health</h3>
              </div>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Code Projet (ex: PRJ_SURV_LUBUTU)</label>
                  <input
                    type="text"
                    required
                    value={pCode}
                    onChange={(e) => setPCode(e.target.value.toUpperCase())}
                    placeholder="PRJ_SURV_LUBUTU"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Intitulé du Projet</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Surveillance Éco-Épidémiologique Lubutu"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Description & Objectif Scientifique</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Objectif de recherche, cohortes et axes spatio-temporels ciblés..."
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Investigateur Principal</label>
                  <input
                    type="text"
                    value={pInvestigator}
                    onChange={(e) => setPInvestigator(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Institution de Rattachement</label>
                  <input
                    type="text"
                    value={pInstitution}
                    onChange={(e) => setPInstitution(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Pathologies Intégrées au Projet</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
                  {pathologies.map(p => {
                    const isChecked = pSelectedPathologies.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setPSelectedPathologies(prev => prev.filter(id => id !== p.id));
                            } else {
                              setPSelectedPathologies(prev => [...prev, p.id]);
                            }
                          }}
                          className="rounded border-slate-700 text-sky-500 focus:ring-sky-500"
                        />
                        {p.name} ({p.code})
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm"
                >
                  Créer le Projet One Health
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
