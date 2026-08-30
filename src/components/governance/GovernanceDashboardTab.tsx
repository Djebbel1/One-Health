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
  Award
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
    <div className="space-y-6">
      {/* Top Banner: Quality Score & Governance Statement */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white p-6 rounded-3xl border border-teal-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-300 bg-teal-800/80 px-2.5 py-0.5 rounded-full border border-teal-700 font-mono">
              GOUVERNANCE DES DONNÉES ONE HEALTH V1.19
            </span>
            <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Normes DPS Maniema & Recherche RDC
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Tableau de Bord Central de Gouvernance & Traçabilité
          </h2>
          <p className="text-xs text-teal-100/90 leading-relaxed">
            Supervision unifiée de l intégrité scientifique, de la séparation hermétique des projets, du versionnement des protocoles et de la reproductibilité computationnelle.
          </p>
        </div>

        {/* Global Quality Score Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex items-center gap-5 shrink-0 self-stretch lg:self-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono tracking-tight">
              {score.totalScore}%
            </div>
            <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider block mt-0.5">
              Score Qualité ({score.grade})
            </span>
          </div>

          <div className="h-12 w-px bg-white/20" />

          <div className="space-y-1 text-xs text-teal-100">
            <p className="font-semibold text-white">Explicabilité du Score :</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
              <span>Complétude : {score.breakdown.completeness}%</span>
              <span>Cohérence : {score.breakdown.consistency}%</span>
              <span>Traçabilité : {score.breakdown.traceability}%</span>
              <span>Validation : {score.breakdown.validationCoverage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('PROJETS_PROTOCOLES')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Projets Actifs</span>
            <FolderKanban className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {projects.filter(p => p.status === 'ACTIF').length}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Sur {projects.length} projets configurés</p>
        </div>

        <div
          onClick={() => onNavigateTab('DICTIONNAIRE')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Protocoles d Étude</span>
            <FileCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {protocols.length}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">100% avec historique certifié</p>
        </div>

        <div
          onClick={() => onNavigateTab('DATASETS_LINEAGE')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Datasets & Snapshots</span>
            <Database className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {datasets.reduce((acc, d) => acc + (d.snapshots?.length || 0), 0)}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Snapshots scellés SHA-256</p>
        </div>

        <div
          onClick={() => onNavigateTab('MODELES_REPRODUCTIBLES')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase">Modèles Reproductibles</span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {models.length}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Dont {models.filter(m => m.governanceStatus === 'VALIDE').length} modèles décisionnels</p>
        </div>
      </div>

      {/* Governance Alerts System */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Système d Alertes & Vigilances de Gouvernance ({activeAlerts.length} actives)
            </h4>
          </div>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Aucune anomalie critique détectée. Tous les protocoles, datasets et modèles respectent les normes V1.19.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  alert.severity === 'CRITIQUE'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : alert.severity === 'AVERTISSEMENT'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      alert.severity === 'CRITIQUE' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-bold text-slate-900">{alert.title}</span>
                  </div>
                  <p className="text-slate-600">{alert.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs cursor-pointer"
                  >
                    Marquer Résolue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
