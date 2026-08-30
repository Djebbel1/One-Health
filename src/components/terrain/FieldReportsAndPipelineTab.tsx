import React, { useState } from 'react';
import {
  FieldCampaign,
  FieldTeam,
  FieldEnumerator,
  FieldFormRecord,
  FieldAssignment
} from '../../types';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Database,
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Building2,
  MapPin,
  Users
} from 'lucide-react';

interface FieldReportsAndPipelineTabProps {
  campaigns: FieldCampaign[];
  teams: FieldTeam[];
  enumerators: FieldEnumerator[];
  forms: FieldFormRecord[];
  assignments: FieldAssignment[];
  onFeedIntoPipeline: () => { injectedCount: number; timestamp: string };
}

export const FieldReportsAndPipelineTab: React.FC<FieldReportsAndPipelineTabProps> = ({
  campaigns,
  teams,
  enumerators,
  forms,
  assignments,
  onFeedIntoPipeline
}) => {
  const [pipelineInjectionResult, setPipelineInjectionResult] = useState<{
    injectedCount: number;
    timestamp: string;
  } | null>(null);
  const [isInjecting, setIsInjecting] = useState(false);

  const activeCamp = campaigns[0] || {
    name: 'Campagne One Health Kindu 2027',
    protocol: 'PROT-OH-MN-2027-V2',
    territory: 'Kindu & Territoires limitrophes'
  };

  const validForms = forms.filter((f) => f.status === 'VALIDE' || f.status === 'VERROUILLE');
  const totalMalariaCases = forms.reduce((acc, f) => acc + (f.formData.casesCountMalaria || 0), 0);
  const totalTyphoidCases = forms.reduce((acc, f) => acc + (f.formData.casesCountTyphoid || 0), 0);

  const handleInjectPipeline = () => {
    setIsInjecting(true);
    setTimeout(() => {
      const res = onFeedIntoPipeline();
      setPipelineInjectionResult(res);
      setIsInjecting(false);
    }, 800);
  };

  const handleExportSummaryCSV = () => {
    const headers = ['ID_Local,ID_Serveur,Enqueteur,Zone_Sante,Aire_Sante,Quartier,Menage,Statut,Paludisme_Cas,Moustiquaire,Typhoide_Cas,Source_Eau,Completude_Pct'];
    const rows = forms.map((f) =>
      `"${f.localId}","${f.serverId || ''}","${f.enumeratorName}","${f.healthZone}","${f.healthArea}","${f.neighborhood}","${f.householdCode || ''}","${f.status}",${f.formData.casesCountMalaria},"${f.formData.mosquitoNetImpregnated ? 'Oui' : 'Non'}",${f.formData.casesCountTyphoid},"${f.formData.waterSource}",${f.qualityChecks.completenessScore}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_consolide_terrain_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Rapports &amp; Intégration
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Passerelle vers le Pipeline Analytique V1.0–V1.17</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Rapports Opérationnels &amp; Injection Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Génération des synthèses d enquêtes, fiches de suivi par zone et passerelle vers les modèles statistiques.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleExportSummaryCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Consolidé</span>
          </button>
        </div>
      </div>

      {/* Passerelle d'Injection vers le Pipeline Scientifique V1.0 à V1.17 */}
      <div className="bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded text-[10px] font-bold">
                Passerelle Automatisée One Health
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-teal-200 font-mono">
                {validForms.length} Formulaires Validés Prêts
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Injection des Données Terrain dans le Pipeline Scientifique
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Transfère automatiquement les observations de terrain vérifiées dans les datasets d analyse (RAW -&gt; Nettoyage -&gt; Modélisation spatio-temporelle V1.15 -&gt; Détection des signaux V1.17).
            </p>
          </div>

          <button
            onClick={handleInjectPipeline}
            disabled={isInjecting}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl text-xs transition flex items-center space-x-2 shadow-lg shrink-0"
          >
            <Database className="w-4 h-4" />
            <span>{isInjecting ? 'Injection en cours...' : 'Injecter dans le Pipeline'}</span>
          </button>
        </div>

        {pipelineInjectionResult && (
          <div className="p-4 bg-teal-800/40 border border-teal-500/30 rounded-2xl text-xs space-y-1 text-teal-100 animate-in fade-in">
            <div className="flex items-center space-x-2 font-bold text-teal-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>Injection réussie à {pipelineInjectionResult.timestamp} !</span>
            </div>
            <p className="text-[11px] text-teal-200/90 leading-relaxed">
              {pipelineInjectionResult.injectedCount} enregistrements de ménages injectés sans rupture de schéma. Les indicateurs (cas de paludisme, fièvre typhoïde, accès à l eau potable) sont immédiatement reconnus par les modules analytiques V1.15 à V1.17.
            </p>
          </div>
        )}
      </div>

      {/* Synthèse Globale de la Campagne */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Rapport de Synthèse Opérationnelle — {activeCamp.name}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Questionnaires Réalisés
            </span>
            <span className="text-lg font-mono font-bold text-slate-800 block mt-1">
              {forms.length}
            </span>
            <span className="text-[10px] text-teal-700 font-bold">
              {validForms.length} validés ({forms.length > 0 ? Math.round((validForms.length / forms.length) * 100) : 0}%)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Équipes &amp; Enquêteurs
            </span>
            <span className="text-lg font-mono font-bold text-slate-800 block mt-1">
              {teams.length} équipes / {enumerators.length} agents
            </span>
            <span className="text-[10px] text-slate-500">
              100% équipés en terminaux PWA
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cas Paludisme Déclarés
            </span>
            <span className="text-lg font-mono font-bold text-rose-700 block mt-1">
              {totalMalariaCases} cas
            </span>
            <span className="text-[10px] text-rose-600">
              Ménages avec TDR positifs
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Cas Typhoïde Déclarés
            </span>
            <span className="text-lg font-mono font-bold text-amber-700 block mt-1">
              {totalTyphoidCases} cas
            </span>
            <span className="text-[10px] text-amber-600">
              Corrélés aux sources d eau
            </span>
          </div>
        </div>

        {/* Détail par Aire de Santé */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Bilan par Aire de Santé (Zone de Kindu / Maniema) :
          </span>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3.5 py-2.5 text-left font-bold text-slate-600">Aire de Santé</th>
                  <th className="px-3.5 py-2.5 text-center font-bold text-slate-600">Ménages Enquêtés</th>
                  <th className="px-3.5 py-2.5 text-center font-bold text-slate-600">Cas Paludisme</th>
                  <th className="px-3.5 py-2.5 text-center font-bold text-slate-600">Cas Typhoïde</th>
                  <th className="px-3.5 py-2.5 text-center font-bold text-slate-600">Moustiquaires Imprégnées</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {['Kasuku', 'Basoko', 'Tokolote', 'Mikelenge Centre', 'Alunguli Centre'].map((area) => {
                  const areaForms = forms.filter((f) => f.healthArea === area);
                  const malCases = areaForms.reduce((a, b) => a + (b.formData.casesCountMalaria || 0), 0);
                  const typCases = areaForms.reduce((a, b) => a + (b.formData.casesCountTyphoid || 0), 0);
                  const netCount = areaForms.filter((f) => f.formData.mosquitoNetImpregnated).length;

                  return (
                    <tr key={area} className="hover:bg-slate-50/50">
                      <td className="px-3.5 py-2.5 font-bold text-slate-800">
                        {area}
                      </td>
                      <td className="px-3.5 py-2.5 text-center font-mono font-bold text-teal-800">
                        {areaForms.length}
                      </td>
                      <td className="px-3.5 py-2.5 text-center font-mono text-rose-700 font-bold">
                        {malCases}
                      </td>
                      <td className="px-3.5 py-2.5 text-center font-mono text-amber-700 font-bold">
                        {typCases}
                      </td>
                      <td className="px-3.5 py-2.5 text-center font-mono text-emerald-800 font-bold">
                        {netCount} / {areaForms.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
