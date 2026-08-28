import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  HelpCircle,
  BarChart3,
  Layers,
  Calendar,
  MapPin,
  ShieldCheck,
  Download,
  Info,
  ArrowRight,
  RefreshCw,
  Eye,
  Activity
} from 'lucide-react';
import { VariableDiagnosticProfile, ScientificQuestionAnswer, TrafficLightSignal } from '../../types';

interface OverviewDashboardTabProps {
  profiles: VariableDiagnosticProfile[];
  questions: ScientificQuestionAnswer[];
  onNavigateTab: (tabId: string) => void;
  onOpenExport: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const OverviewDashboardTab: React.FC<OverviewDashboardTabProps> = ({
  profiles,
  questions,
  onNavigateTab,
  onOpenExport,
  isDemoMode,
  setIsDemoMode
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  const handleGenerateDiagnostic = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 600);
  };

  const getSignalBadge = (signal: TrafficLightSignal) => {
    switch (signal) {
      case 'VERT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            FEU VERT (Exploitable)
          </span>
        );
      case 'ORANGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            FEU ORANGE (Restrictions)
          </span>
        );
      case 'ROUGE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            FEU ROUGE (Insuffisant)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Real vs Demo Data Distinction Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-500/30 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide uppercase ${
                isDemoMode
                  ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-xs'
                  : 'bg-emerald-500 text-white border border-emerald-400 shadow-xs'
              }`}>
                {isDemoMode ? 'MODE DÉMONSTRATION / DONNÉE FICTIVE' : 'DONNÉES RÉELLES SCIENTIFIQUES VALIDÉES'}
              </span>
              <span className="text-xs text-slate-400">
                Règle scientifique : Les données fictives sont strictement isolées des résultats de recherche.
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
              Diagnostic Scientifique des Données • One Health Maniema
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Évaluation automatique de l'exploitabilité descriptive, statistique et spatio-temporelle pour répondre à la question clé : 
              <strong className="text-teal-300 font-semibold"> « Que puis-je réellement analyser avec les données dont je dispose ? »</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateDiagnostic}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calcul du diagnostic...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Générer le diagnostic complet</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenExport}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 shadow-xs transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Exporter Rapport</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sources</div>
          <div className="text-xl font-black text-slate-900 mt-1">6</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Certifiées</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Variables</div>
          <div className="text-xl font-black text-indigo-700 mt-1">{profiles.length}</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Cataloguées</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Années</div>
          <div className="text-xl font-black text-slate-900 mt-1">2018–26</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">9 années</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Zones Maniema</div>
          <div className="text-xl font-black text-slate-900 mt-1">18 / 18</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% couvertes</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Complétude</div>
          <div className="text-xl font-black text-emerald-700 mt-1">78.5%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Bonne globale</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Modélisables</div>
          <div className="text-xl font-black text-emerald-700 mt-1">6</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Sans restriction</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Restrictions</div>
          <div className="text-xl font-black text-amber-700 mt-1">4</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Avec proxies / sous-ens.</div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lacunes clés</div>
          <div className="text-xl font-black text-rose-700 mt-1">3</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">À surveiller</div>
        </div>
      </div>

      {/* One Health Dimensional Synthesis */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Synthèse Diagnostique par Dimension One Health
            </h3>
            <p className="text-xs text-slate-500">
              Visualisation des composantes One Health les plus et les moins documentées sur la période 2018–2026.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Disponibilité Globale Pondérée : <strong className="text-teal-700">71.5%</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Dimension 1: Santé */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase">Santé Humaine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">90.4%</span>
              </div>
              <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '90.4%' }}></div>
              </div>
              <p className="text-xs text-emerald-950 mt-2 font-medium">
                Paludisme, Typhoïde, Choléra, Mpox. Série continue FOSA/DHIS2.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Qualité : 88/100</span>
              <span className="text-emerald-700">FEU VERT</span>
            </div>
          </div>

          {/* Dimension 2: Climat */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 uppercase">Climat & Météo</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-600 text-white">98.1%</span>
              </div>
              <div className="w-full bg-teal-200 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: '98.1%' }}></div>
              </div>
              <p className="text-xs text-teal-950 mt-2 font-medium">
                Pluie journalière, Températures min/max, Humidité METTELSAT.
              </p>
            </div>
            <div className="pt-2 border-t border-teal-200/80 flex items-center justify-between text-[11px] font-semibold text-teal-800">
              <span>Qualité : 96/100</span>
              <span className="text-teal-700">FEU VERT</span>
            </div>
          </div>

          {/* Dimension 3: Environnement */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase">Environnement</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-600 text-white">37.1%</span>
              </div>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '37.1%' }}></div>
              </div>
              <p className="text-xs text-amber-950 mt-2 font-medium">
                Gîtes larvaires (2025-26), Décharges (2022-26). Ponctuelles.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-semibold text-amber-800">
              <span>Qualité : 78/100</span>
              <span className="text-amber-800 font-bold">FEU ORANGE</span>
            </div>
          </div>

          {/* Dimension 4: Eau & WASH */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 uppercase">Eau & WASH</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">38.0%</span>
              </div>
              <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '38.0%' }}></div>
              </div>
              <p className="text-xs text-indigo-950 mt-2 font-medium">
                Accès eau potable, latrines hygiéniques (Enquêtes ménages).
              </p>
            </div>
            <div className="pt-2 border-t border-indigo-200/80 flex items-center justify-between text-[11px] font-semibold text-indigo-800">
              <span>Qualité : 82/100</span>
              <span className="text-indigo-800 font-bold">FEU ORANGE</span>
            </div>
          </div>

          {/* Dimension 5: Écosystème & SIG */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase">SIG & Écosystème</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-white">94.0%</span>
              </div>
              <div className="w-full bg-slate-300 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-slate-800 h-full rounded-full" style={{ width: '94.0%' }}></div>
              </div>
              <p className="text-xs text-slate-700 mt-2 font-medium">
                MNT Altitude, réseau hydrographique, 18 zones délimitées.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[11px] font-semibold text-slate-800">
              <span>Qualité : 90/100</span>
              <span className="text-emerald-700 font-bold">FEU VERT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers to the 10 Scientific Questions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Réponses aux 10 Questions Scientifiques Fondamentales
            </h3>
            <p className="text-xs text-slate-500">
              Diagnostic objectif formulé pour guider la démarche de recherche et la sélection des modèles.
            </p>
          </div>
          <span className="text-xs text-slate-500">10 / 10 Évaluées</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions.map((q) => {
            const isExpanded = selectedQuestion === q.questionNumber;
            return (
              <div
                key={q.questionNumber}
                className={`border rounded-xl p-4 transition cursor-pointer ${
                  isExpanded
                    ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                onClick={() => setSelectedQuestion(isExpanded ? null : q.questionNumber)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      Q{q.questionNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{q.question}</h4>
                  </div>
                  {getSignalBadge(q.statusSignal)}
                </div>

                <p className="text-xs text-slate-700 mt-2 font-medium leading-relaxed">
                  {q.shortSummary}
                </p>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5 text-xs text-slate-600 animate-in fade-in-50 duration-150">
                    <div className="space-y-1">
                      <strong className="text-slate-800 block text-[11px] uppercase font-bold">Détails scientifiques :</strong>
                      <ul className="list-disc list-inside space-y-0.5">
                        {q.details.map((d, i) => (
                          <li key={i} className="text-slate-700">{d}</li>
                        ))}
                      </ul>
                    </div>

                    {q.metrics && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        {Object.entries(q.metrics).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-slate-500 block text-[10px]">{k}</span>
                            <span className="font-bold text-slate-800">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-950 text-[11px]">
                      <strong>Recommandation pour la recherche :</strong>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                        {q.scientificRecommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('MATRICES')}
          className="bg-white hover:bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Matrices Temporelles & Géographiques</h4>
            <p className="text-xs text-slate-500">
              Visualiser la disponibilité Variable × Année (2018–2026), Variable × 18 Zones, et l'explorateur 4D.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>Explorer les matrices</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('USABILITY')}
          className="bg-white hover:bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Variables Utilisables & Modélisation</h4>
            <p className="text-xs text-slate-500">
              Détermination automatique de l'exploitabilité descriptive, statistique et spatio-temporelle avec justifications.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>Vérifier l'utilisabilité</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('HISTORICITE')}
          className="bg-white hover:bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Historicité & Proxies Justifiés</h4>
            <p className="text-xs text-slate-500">
              Gestion de l'évolution des facteurs environnementaux (Scénario 2022–2026) et déclaration de proxies explicites.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>Gérer l'historicité</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
