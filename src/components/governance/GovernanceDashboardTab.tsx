import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  Database,
  Cpu,
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
  Layers,
  Sparkles,
  Lock,
  GitBranch,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import {
  GovernanceQualityScore,
  StudyProject,
  StudyProtocol,
  GovernanceDataset,
  ReproducibleModel,
  GovernanceAlert
} from '../../types';

interface GovernanceDashboardTabProps {
  score: GovernanceQualityScore;
  projects: StudyProject[];
  protocols: StudyProtocol[];
  datasets: GovernanceDataset[];
  models: ReproducibleModel[];
  alerts: GovernanceAlert[];
  onResolveAlert: (id: string) => void;
  onNavigateTab: (tabKey: any) => void;
}

export const GovernanceDashboardTab: React.FC<GovernanceDashboardTabProps> = ({
  score,
  projects,
  protocols,
  datasets,
  models,
  alerts,
  onResolveAlert,
  onNavigateTab
}) => {
  const activeAlerts = alerts.filter(a => !a.isResolved);

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner: Quality Score & Governance Statement */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-teal-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
        <div className="space-y-2.5 max-w-3xl flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-800/90 px-3 py-1 rounded-full border border-teal-700 font-mono">
              GOUVERNANCE DES DONNÉES ONE HEALTH V1.19
            </span>
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Normes DPS Maniema & Recherche RDC
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tableau de Bord Central de Gouvernance & Traçabilité
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Supervision unifiée de l'intégrité scientifique, de la séparation hermétique des projets, du versionnement des protocoles et de la reproductibilité computationnelle.
          </p>
        </div>

        {/* Global Quality Score Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/20 flex items-center gap-5 shrink-0 self-stretch lg:self-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono tracking-tight">
              {score.totalScore}%
            </div>
            <span className="text-xs uppercase font-bold text-teal-200 tracking-wider block mt-1">
              Score Qualité ({score.grade})
            </span>
          </div>

          <div className="h-14 w-px bg-white/20" />

          <div className="space-y-1.5 text-xs sm:text-sm text-teal-100">
            <p className="font-semibold text-white">Explicabilité du Score :</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
              <span>Complétude : {score.breakdown.completeness}%</span>
              <span>Cohérence : {score.breakdown.consistency}%</span>
              <span>Traçabilité : {score.breakdown.traceability}%</span>
              <span>Validation : {score.breakdown.validationCoverage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        <div
          onClick={() => onNavigateTab('PROJETS_PROTOCOLES')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projets Actifs</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {projects.filter(p => p.status === 'ACTIF').length}
          </div>
          <p className="text-xs text-slate-500 font-medium">Sur {projects.length} projets d'étude configurés</p>
        </div>

        <div
          onClick={() => onNavigateTab('PROJETS_PROTOCOLES')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Protocoles d'Étude</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {protocols.length}
          </div>
          <p className="text-xs text-slate-500 font-medium">100% avec historique et amendements certifiés</p>
        </div>

        <div
          onClick={() => onNavigateTab('DATASETS_LINEAGE')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Datasets & Snapshots</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {datasets.reduce((acc, d) => acc + (d.snapshots?.length || 0), 0)}
          </div>
          <p className="text-xs text-slate-500 font-medium">Snapshots scellés par empreinte SHA-256</p>
        </div>

        <div
          onClick={() => onNavigateTab('MODELES_REPRODUCTIBLES')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Modèles Reproductibles</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">
            {models.length}
          </div>
          <p className="text-xs text-slate-500 font-medium">Dont {models.filter(m => m.governanceStatus === 'VALIDE').length} validés pour la décision</p>
        </div>
      </div>

      {/* Main 2-Column Section: Projects & Protocols Overview (2/3) + Alerts & Rules (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Left Column (2/3): Projets d'Études & Intégrité des Données */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-teal-600" />
                  <span>Projets d'Études One Health sous Gouvernance Active</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Isolation hermétique des données, protocoles associés et couverture des dimensions
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('PROJETS_PROTOCOLES')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 shrink-0"
              >
                <span>Gérer les projets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-3 font-bold">Code</th>
                    <th className="p-3 font-bold">Projet d'Étude</th>
                    <th className="p-3 font-bold">Territoire</th>
                    <th className="p-3 font-bold">Dimensions</th>
                    <th className="p-3 font-bold">Protocole</th>
                    <th className="p-3 font-bold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((prj) => {
                    const prjProtocol = protocols.find(p => p.projectId === prj.id);
                    return (
                      <tr key={prj.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 font-mono font-bold text-teal-800">{prj.code}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{prj.name}</p>
                          <p className="text-xs text-slate-500 font-medium">Resp. : {prj.leader}</p>
                        </td>
                        <td className="p-3 text-slate-700">{prj.territory}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {prj.dimensions.humanHealth && (
                              <span className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 font-semibold">Humain</span>
                            )}
                            {prj.dimensions.animalHealth && (
                              <span className="px-1.5 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 font-semibold">Animal</span>
                            )}
                            {prj.dimensions.environment && (
                              <span className="px-1.5 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 font-semibold">Env.</span>
                            )}
                            {prj.dimensions.climate && (
                              <span className="px-1.5 py-0.5 rounded text-[11px] bg-indigo-50 text-indigo-700 font-semibold">Climat</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-xs font-semibold text-slate-700">
                          {prjProtocol ? `v${prjProtocol.currentVersion}` : 'V1.0'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                            prj.status === 'ACTIF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prj.status === 'ARCHIVE'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {prj.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Lineage & Pipeline Status Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Chaîne de Traçabilité Ascendante (Data Lineage V1.19)
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab('DATASETS_LINEAGE')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>Voir le graphe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">1. Source</span>
                <span className="font-bold text-slate-900 block mt-0.5">Enquêtes Men.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-700 uppercase block">2. Raw</span>
                <span className="font-bold text-teal-900 block mt-0.5">RAW_DS_01</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-700 uppercase block">3. Clean</span>
                <span className="font-bold text-teal-900 block mt-0.5">CLEAN_DS_02</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">4. Analytic</span>
                <span className="font-bold text-emerald-900 block mt-0.5">ANALYTIC_03</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">5. Modèle</span>
                <span className="font-bold text-indigo-900 block mt-0.5">GAM_PALU_01</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-700 uppercase block">6. Surveillance</span>
                <span className="font-bold text-purple-900 block mt-0.5">V1.17 Signal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 text-white border border-slate-900">
                <span className="text-[10px] font-bold text-teal-300 uppercase block">7. Rapport</span>
                <span className="font-bold text-white block mt-0.5">Certifié DPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Governance Alerts & Ethical Guarantees */}
        <div className="space-y-6">
          {/* Governance Alerts System */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Alertes de Gouvernance ({activeAlerts.length})
                </h4>
              </div>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Aucune anomalie critique. Tous les protocoles et datasets respectent les normes.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border space-y-2 text-xs sm:text-sm ${
                      alert.severity === 'CRITIQUE'
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : alert.severity === 'AVERTISSEMENT'
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        alert.severity === 'CRITIQUE' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                      }`}>
                        {alert.severity}
                      </span>
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs cursor-pointer"
                      >
                        Résoudre
                      </button>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{alert.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scientific Principles & DPS Standards */}
          <div className="bg-teal-900 text-teal-50 rounded-2xl border border-teal-800 p-5 space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              Garanties de Gouvernance V1.19
            </h4>
            <ul className="space-y-2 text-teal-200 text-xs leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-teal-300 font-bold">•</span>
                <span><strong>Isolation Hermétique :</strong> Séparation étanche des jeux de données inter-projets.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-300 font-bold">•</span>
                <span><strong>Non-Extrapolation :</strong> Traçabilité explicite des ruptures de comparabilité temporelle.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-teal-300 font-bold">•</span>
                <span><strong>Immutabilité :</strong> Snapshots de jeux de données scellés par signature SHA-256.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
