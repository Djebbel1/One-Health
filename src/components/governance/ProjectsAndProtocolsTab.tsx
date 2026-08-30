import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Edit3,
  Archive,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  History,
  ShieldCheck,
  Globe,
  Tag,
  ArrowRight,
  Sparkles,
  Lock,
  RefreshCw,
  Info
} from 'lucide-react';
import { StudyProject, StudyProtocol, ProtocolStatus, ProjectStatus } from '../../types';

interface ProjectsAndProtocolsTabProps {
  projects: StudyProject[];
  selectedProject: StudyProject;
  onSelectProject: (p: StudyProject) => void;
  protocols: StudyProtocol[];
  onUpdateProject: (p: StudyProject) => void;
  onUpdateProtocol: (p: StudyProtocol) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const ProjectsAndProtocolsTab: React.FC<ProjectsAndProtocolsTabProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  protocols,
  onUpdateProject,
  onUpdateProtocol,
  onAddAuditLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PROJETS' | 'PROTOCOLE' | 'HISTORIQUE'>('PROJETS');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showAmendProtocolModal, setShowAmendProtocolModal] = useState(false);

  // New project form state
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLeader, setNewProjectLeader] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectPathologies, setNewProjectPathologies] = useState('Paludisme, Fièvre typhoïde');
  const [newDimHuman, setNewDimHuman] = useState(true);
  const [newDimAnimal, setNewDimAnimal] = useState(false);
  const [newDimEnv, setNewDimEnv] = useState(true);
  const [newDimClimate, setNewDimClimate] = useState(true);
  const [newDimWater, setNewDimWater] = useState(true);
  const [newDimSanitation, setNewDimSanitation] = useState(true);
  const [newDimEcosystem, setNewDimEcosystem] = useState(true);

  // Amendment form state
  const [amendVersion, setAmendVersion] = useState('V1.3');
  const [amendAuthor, setAmendAuthor] = useState('Dr. Jean-Pierre Mukendi');
  const [amendSummary, setAmendSummary] = useState('');
  const [amendJustification, setAmendJustification] = useState('');
  const [isMajorChange, setIsMajorChange] = useState(true);

  const currentProtocol = protocols.find(p => p.projectId === selectedProject.id) || protocols[0];

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !newProjectCode.trim()) return;

    const newProj: StudyProject = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      code: newProjectCode.toUpperCase().trim(),
      name: newProjectName.trim(),
      description: newProjectDesc || 'Projet One Health Maniema nouvellement configuré.',
      leader: newProjectLeader || 'Coordinateur Scientifique',
      leaderRole: 'Investigateur Principal',
      territory: 'Kindu & Maniema, RDC',
      targetPathologies: newProjectPathologies.split(',').map(s => s.trim()).filter(Boolean),
      dimensions: {
        humanHealth: newDimHuman,
        animalHealth: newDimAnimal,
        environment: newDimEnv,
        climate: newDimClimate,
        water: newDimWater,
        sanitation: newDimSanitation,
        ecosystem: newDimEcosystem
      },
      status: 'PREPARATION',
      version: 'v1.0.0',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      startDate: '2026-09-01',
      endDate: '2029-12-31',
      metadata: {
        institution: 'DPS Maniema / Université de Kindu',
        contactEmail: 'contact.projet@dps-rdc.cd',
        keywords: ['One Health', 'Maniema', 'Surveillance'],
        dataSharingPolicy: 'COLLABORATIVE'
      },
      activeProtocolId: 'PROT-NEW',
      campaignsCount: 0,
      datasetsCount: 0,
      modelsCount: 0,
      isArchived: false,
      isDemoData: true
    };

    onUpdateProject(newProj);
    onSelectProject(newProj);
    onAddAuditLog('CREATION_PROJET', `Création du projet d'étude ${newProj.code} - ${newProj.name}`, { projectId: newProj.id });
    setShowNewProjectModal(false);
    setNewProjectCode('');
    setNewProjectName('');
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    const updated = {
      ...selectedProject,
      status: newStatus,
      isArchived: newStatus === 'ARCHIVE'
    };
    onUpdateProject(updated);
    onAddAuditLog('MODIFICATION_PROJET', `Changement de statut du projet ${selectedProject.code} : ${selectedProject.status} -> ${newStatus}`, { newStatus });
  };

  const handleToggleDimension = (dimKey: keyof typeof selectedProject.dimensions) => {
    const updated = {
      ...selectedProject,
      dimensions: {
        ...selectedProject.dimensions,
        [dimKey]: !selectedProject.dimensions[dimKey]
      }
    };
    onUpdateProject(updated);
    onAddAuditLog('MODIFICATION_PROJET', `Mise à jour dimension One Health (${String(dimKey)}) sur le projet ${selectedProject.code}`);
  };

  const handleAmendProtocol = () => {
    if (!amendSummary.trim() || !amendJustification.trim()) return;

    const newHistoryEntry = {
      version: amendVersion,
      date: new Date().toISOString().slice(0, 10),
      author: amendAuthor,
      changesSummary: amendSummary,
      justification: amendJustification,
      isMajorChange: isMajorChange,
      status: 'VALIDE' as ProtocolStatus
    };

    const updatedProtocol: StudyProtocol = {
      ...currentProtocol,
      currentVersion: amendVersion,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      history: [newHistoryEntry, ...currentProtocol.history]
    };

    onUpdateProtocol(updatedProtocol);
    onAddAuditLog('AMENDEMENT_PROTOCOLE', `Nouvel amendement protocole version ${amendVersion} pour ${selectedProject.code} : ${amendSummary}`, {
      isMajorChange,
      version: amendVersion
    });
    setShowAmendProtocolModal(false);
    setAmendSummary('');
    setAmendJustification('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
              <FolderKanban className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gouvernance des Projets & Protocoles d Étude</h3>
              <p className="text-sm text-slate-500">
                Gestion unifiée, isolation des données multi-projets et traçabilité des versions de protocoles
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveSubTab('PROJETS')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'PROJETS' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📁 Projets ({projects.length})
          </button>
          <button
            onClick={() => setActiveSubTab('PROTOCOLE')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'PROTOCOLE' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📜 Protocole Actif ({currentProtocol?.currentVersion || 'V1.0'})
          </button>
          <button
            onClick={() => setActiveSubTab('HISTORIQUE')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === 'HISTORIQUE' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏳ Historique ({currentProtocol?.history?.length || 0})
          </button>
        </div>
      </div>

      {/* TAB 1: LISTE ET GESTION DES PROJETS */}
      {activeSubTab === 'PROJETS' && (
        <div className="space-y-6">
          {/* Top Actions: Multi-Project Selector & New Project */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Projet Actif :
              </span>
              <div className="flex flex-wrap gap-2">
                {projects.map((prj) => (
                  <button
                    key={prj.id}
                    onClick={() => onSelectProject(prj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      selectedProject.id === prj.id
                        ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${prj.status === 'ACTIF' ? 'bg-emerald-400' : prj.status === 'ARCHIVE' ? 'bg-slate-400' : 'bg-amber-400'}`} />
                    {prj.code}
                    {selectedProject.id === prj.id && <span className="text-[10px] bg-teal-800/60 px-1.5 py-0.5 rounded">En cours</span>}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              Nouveau Projet d Étude
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const isSelected = selectedProject.id === project.id;
              return (
                <div
                  key={project.id}
                  className={`relative flex flex-col justify-between rounded-2xl border transition-all p-5 ${
                    isSelected
                      ? 'bg-gradient-to-b from-teal-50/40 to-white border-teal-500/80 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md font-mono">
                            {project.code}
                          </span>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            project.status === 'ACTIF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : project.status === 'ARCHIVE'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-2 line-clamp-2">
                          {project.name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Metadata & Leader */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Responsable :</span>
                        <span className="font-medium text-slate-800">{project.leader}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Territoire :</span>
                        <span className="font-medium text-slate-800">{project.territory}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Période :</span>
                        <span className="font-mono text-slate-700">{project.startDate} ➔ {project.endDate}</span>
                      </div>
                    </div>

                    {/* Target Pathologies */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Pathologies Ciblées :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.targetPathologies.map((patho, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                          >
                            {patho}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dimensions One Health status */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Dimensions One Health :
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <span className={`px-1.5 py-0.5 rounded ${project.dimensions.humanHealth ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-slate-50 text-slate-400 line-through'}`}>
                          • Santé Humaine
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${project.dimensions.animalHealth ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-slate-50 text-slate-400 line-through'}`}>
                          • Santé Animale
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${project.dimensions.environment ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-slate-50 text-slate-400 line-through'}`}>
                          • Environnement
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${project.dimensions.climate ? 'bg-emerald-50 text-emerald-700 font-medium' : 'bg-slate-50 text-slate-400 line-through'}`}>
                          • Climat & Météo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        Projet Actif
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectProject(project)}
                        className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                      >
                        Sélectionner ce projet <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="flex items-center gap-1.5">
                      {project.status !== 'ACTIF' && (
                        <button
                          onClick={() => {
                            onSelectProject(project);
                            handleStatusChange('ACTIF');
                          }}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        >
                          Activer
                        </button>
                      )}
                      {project.status !== 'ARCHIVE' && (
                        <button
                          onClick={() => {
                            onSelectProject(project);
                            handleStatusChange('ARCHIVE');
                          }}
                          className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                        >
                          Archiver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Isolation & Governance Rules Notice */}
          <div className="p-4 rounded-2xl bg-teal-900 text-teal-50 border border-teal-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-800/80 text-teal-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-sm text-white">Règle d Isolation Hermétique des Projets (V1.19)</p>
                <p className="text-teal-200">
                  Les données, formulaires, dictionnaires et modèles d un projet d étude sont rigoureusement isolés.
                  Toute combinaison transversale nécessite une autorisation formelle et une traçabilité explicite au journal d audit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs bg-teal-800 text-teal-200 px-3 py-1.5 rounded-xl border border-teal-700 font-mono">
                Conforme Protocole DPS-MAN
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROTOCOLE D'ÉTUDE DU PROJET ACTIF */}
      {activeSubTab === 'PROTOCOLE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            {/* Protocol Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/60 font-mono">
                    {currentProtocol.id}
                  </span>
                  <span className="text-xs font-bold text-white bg-teal-700 px-2.5 py-1 rounded-md shadow-xs">
                    Version {currentProtocol.currentVersion}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {currentProtocol.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {currentProtocol.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Auteur : {currentProtocol.author} | Réf Éthique : {currentProtocol.ethicsCommitteeRef}
                </p>
              </div>

              <button
                onClick={() => setShowAmendProtocolModal(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                Soumettre un Amendement (Nouvelle Version)
              </button>
            </div>

            {/* Objectives */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                1. Objectifs de l Étude
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                <p className="font-semibold text-slate-800">
                  <span className="text-teal-700 font-bold">Objectif Principal :</span> {currentProtocol.objectives.primary}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="text-slate-500 font-medium">Objectifs Secondaires :</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
                    {currentProtocol.objectives.secondary.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Population & Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900">Population Cible & Méthode</h5>
                <p className="text-slate-700">{currentProtocol.targetPopulation}</p>
                <div className="pt-1">
                  <span className="text-slate-400 font-medium">Échantillonnage :</span>
                  <p className="text-slate-700 font-medium">{currentProtocol.samplingMethod}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 text-xs">
                <h5 className="font-bold text-slate-900">Critères d Inclusion & Exclusion</h5>
                <div className="space-y-1">
                  <span className="text-emerald-700 font-semibold">• Critères d Inclusion :</span>
                  <ul className="list-disc list-inside text-slate-700 pl-2">
                    {currentProtocol.inclusionCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-rose-700 font-semibold">• Critères d Exclusion :</span>
                  <ul className="list-disc list-inside text-slate-700 pl-2">
                    {currentProtocol.exclusionCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Temporal Series & Study Periods */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                2. Séries Temporelles et Périodes d Étude Multi-Années
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {currentProtocol.periods.map((period, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                    <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                      {period.seriesId}
                    </span>
                    <h5 className="font-bold text-slate-900 line-clamp-1">{period.label}</h5>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {period.startDate} ➔ {period.endDate}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1">
                      {period.seasonsCovered.map((s, si) => (
                        <span key={si} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrity Rules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                3. Règles d Intégrité et de Contrôle Qualité Scientifique
              </h4>
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-2 text-xs">
                {currentProtocol.integrityRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-amber-900">
                    <span className="font-bold text-amber-700">R{idx + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORIQUE CHRONOLOGIQUE DES VERSIONS DU PROTOCOLE */}
      {activeSubTab === 'HISTORIQUE' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Registre Historique des Versions & Amendements</h4>
              <p className="text-xs text-slate-500">Traçabilité légale et scientifique : toute modification majeure produit une version incrémentale.</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-semibold">
              {currentProtocol.history.length} versions archivées
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {currentProtocol.history.map((ver, index) => (
              <div key={index} className="relative space-y-2">
                <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white border-2 border-teal-700" />
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-teal-800 text-white">
                        Version {ver.version}
                      </span>
                      {ver.isMajorChange && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          AMENDEMENT MAJEUR
                        </span>
                      )}
                      <span className="text-slate-500 font-mono">{ver.date}</span>
                    </div>
                    <span className="text-slate-600 font-medium">Auteur : {ver.author}</span>
                  </div>

                  <p className="text-slate-800 font-semibold pt-1">
                    {ver.changesSummary}
                  </p>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Justification Scientifique :
                    </span>
                    <p>{ver.justification}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NOUVEAU PROJET D'ÉTUDE */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-800">
                <FolderKanban className="w-5 h-5" />
                <h3 className="font-bold text-base">Création d un Nouveau Projet d Étude</h3>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code Projet (ex: OH-KAS-2027)</label>
                  <input
                    type="text"
                    value={newProjectCode}
                    onChange={(e) => setNewProjectCode(e.target.value)}
                    placeholder="OH-KAS-2027"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Responsable Principal</label>
                  <input
                    type="text"
                    value={newProjectLeader}
                    onChange={(e) => setNewProjectLeader(e.target.value)}
                    placeholder="Dr. Jean-Pierre Mukendi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom Complet du Projet</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Observatoire Éco-Épidémiologique..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Objectif Général</label>
                <textarea
                  rows={2}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Cadre d étude, méthodologie et population ciblée..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pathologies ciblées (séparées par virgules)</label>
                <input
                  type="text"
                  value={newProjectPathologies}
                  onChange={(e) => setNewProjectPathologies(e.target.value)}
                  placeholder="Paludisme, Fièvre typhoïde, Choléra"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Dimensions One Health Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">Dimensions One Health Incluses :</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimHuman} onChange={(e) => setNewDimHuman(e.target.checked)} />
                    <span>Santé Humaine</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimAnimal} onChange={(e) => setNewDimAnimal(e.target.checked)} />
                    <span>Santé Animale</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimEnv} onChange={(e) => setNewDimEnv(e.target.checked)} />
                    <span>Environnement</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimClimate} onChange={(e) => setNewDimClimate(e.target.checked)} />
                    <span>Climat & Météo</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimWater} onChange={(e) => setNewDimWater(e.target.checked)} />
                    <span>Eau & Assainissement</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={newDimEcosystem} onChange={(e) => setNewDimEcosystem(e.target.checked)} />
                    <span>Écosystèmes Fluviaux</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || !newProjectCode.trim()}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Créer et Initialiser le Projet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AMENDEMENT DE PROTOCOLE */}
      {showAmendProtocolModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-800">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-bold text-base">Amendement de Protocole (Nouvelle Version)</h3>
              </div>
              <button
                onClick={() => setShowAmendProtocolModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">Règle de Non-Écrasement (V1.19)</p>
                <p className="text-[11px]">
                  Toute modification scientifique (population, variable clé, méthode) crée une nouvelle version identifiée. L ancienne version reste accessible dans l historique.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nouvelle Version</label>
                  <input
                    type="text"
                    value={amendVersion}
                    onChange={(e) => setAmendVersion(e.target.value)}
                    placeholder="V1.3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Auteur de l Amendement</label>
                  <input
                    type="text"
                    value={amendAuthor}
                    onChange={(e) => setAmendAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Résumé des Modifications</label>
                <textarea
                  rows={2}
                  value={amendSummary}
                  onChange={(e) => setAmendSummary(e.target.value)}
                  placeholder="Ex : Ajout de la station météo Mettelsat et modification du seuil Widal..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Justification Scientifique Obligatoire</label>
                <textarea
                  rows={3}
                  value={amendJustification}
                  onChange={(e) => setAmendJustification(e.target.value)}
                  placeholder="Motivation méthodologique validée par le comité de pilotage..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMajorChange}
                  onChange={(e) => setIsMajorChange(e.target.checked)}
                />
                <div>
                  <span className="font-bold text-slate-800">Changement Majeur de Protocole</span>
                  <p className="text-[11px] text-slate-500">Modifie la population, une variable clé ou un critère d inclusion.</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAmendProtocolModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleAmendProtocol}
                disabled={!amendSummary.trim() || !amendJustification.trim()}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Valider et Archiver Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
