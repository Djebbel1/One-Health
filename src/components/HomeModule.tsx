import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  MapPin,
  CheckCircle2,
  Info,
  Sliders,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { AppModule } from '../types';
import { useData } from '../context/DataContext';
import { APP_CONFIG } from '../config/appConfig';
import { OneHealthLogo } from './common/OneHealthLogo';
import { AboutOneHealthManiemaModal } from './AboutOneHealthManiemaModal';

interface HomeModuleProps {
  onNavigate: (module: AppModule) => void;
}

export const HomeModule: React.FC<HomeModuleProps> = ({ onNavigate }) => {
  const { householdSurveys, environmentalObs, healthRecords, climateRecords, userSession } = useData();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* About Modal */}
      <AboutOneHealthManiemaModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        activeEnvironment="PRODUCTION"
      />

      {/* Hero Banner with Official ONE HEALTH MANIEMA Identity */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>Plateforme Scientifique &amp; Opérationnelle One Health</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <MapPin className="w-3 h-3" />
              <span>Province du Maniema • RDC</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 bg-slate-800/80 rounded-md border border-slate-700">
              {APP_CONFIG.version}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {APP_CONFIG.name}
            </h1>
            <p className="text-sm sm:text-base text-emerald-300 font-semibold">
              {APP_CONFIG.tagline}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Plateforme numérique intégrée de collecte géoréférencée, gestion de protocoles, contrôle qualité,
            analyses multidimensionnelles, modélisation épidémiologique et surveillance prospective One Health
            en <strong className="text-emerald-300">Province du Maniema (RDC)</strong> — avec la <strong className="text-teal-300">Ville de Kindu</strong> comme territoire pilote initial et extension provinciale continue.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Enquêtes Ménages</span>
              <span className="text-xl font-bold text-emerald-400">{householdSurveys.length}</span>
              <span className="text-[10px] text-slate-400 block">Formulaires géoréférencés</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Observations Env.</span>
              <span className="text-xl font-bold text-teal-400">{environmentalObs.length}</span>
              <span className="text-[10px] text-slate-400 block">Gîtes &amp; Facteurs spatiaux</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Rapports Sanitaires</span>
              <span className="text-xl font-bold text-cyan-400">{healthRecords.length}</span>
              <span className="text-[10px] text-slate-400 block">Registres &amp; Consultations</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Relevés Climat</span>
              <span className="text-xl font-bold text-amber-400">{climateRecords.length}</span>
              <span className="text-[10px] text-slate-400 block">Pluie &amp; Températures</span>
            </div>
          </div>

          {/* Direct Quick Action Buttons for Main V1.20 and V1.21 modules */}
          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40 transition transform active:scale-95"
            >
              <Info className="w-4 h-4 text-emerald-400" />
              <span>ℹ️ À PROPOS DE ONE HEALTH MANIEMA</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('SECURITE_PRODUCTION')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 rounded-xl text-xs font-black shadow-md transition transform active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>🛡️ SÉCURITÉ &amp; PRODUCTION V1.20</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('PROJETS_GOUVERNANCE')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-black border border-teal-500/40 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>🏛️ GOUVERNANCE &amp; PROJETS V1.19</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('TERRAIN')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <span>🧭 OPÉRATIONS TERRAIN V1.18</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('SURVEY')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition transform active:scale-95"
            >
              <span>➕ NOUVELLE ENQUÊTE MÉNAGE</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 6 Core Functions of ONE HEALTH MANIEMA */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Les 6 Fonctions Clés de ONE HEALTH MANIEMA</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cycle complet de valorisation des données épidémiologiques, climatiques et environnementales.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAboutModalOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
          >
            <span>Voir l'architecture institutionnelle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. COLLECTER */}
          <div
            onClick={() => onNavigate('TERRAIN')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                1
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                PWA / Offline
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800">
              Collecter
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enquêtes ménages géoréférencées, fiches d'observation environnementale, géolocalisation GPS et capture hors-ligne.
            </p>
          </div>

          {/* 2. GÉRER */}
          <div
            onClick={() => onNavigate('PROJETS_GOUVERNANCE')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                2
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Gouvernance
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-800">
              Gérer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Protocoles éthiques, dictionnaire de 150+ variables, traçabilité RAW / CLEAN / ANALYTIC et contrôle qualité.
            </p>
          </div>

          {/* 3. ANALYSER */}
          <div
            onClick={() => onNavigate('LABORATOIRE_ANALYSE')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
                3
              </span>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                Exploration
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-cyan-800">
              Analyser
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statistiques descriptives, croisements spatiaux, corrélations météo-épidémio et séries temporelles mensuelles.
            </p>
          </div>

          {/* 4. MODÉLISER */}
          <div
            onClick={() => onNavigate('MODELISATION')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                4
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                GLMM / INLA
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-800">
              Modéliser
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modélisation spatio-temporelle hiérarchique, inférence bayésienne, prédiction du risque et reproductibilité R / Python.
            </p>
          </div>

          {/* 5. SURVEILLER */}
          <div
            onClick={() => onNavigate('SURVEILLANCE_ONE_HEALTH_V117')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition">
                5
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Alertes &amp; Signaux
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-800">
              Surveiller
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Veille sanitaire continue, seuils d'alerte épidémiologiques automatisés et détection précoce d'anomalies.
            </p>
          </div>

          {/* 6. DÉCIDER */}
          <div
            onClick={() => onNavigate('SECURITE_PRODUCTION')}
            className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition cursor-pointer group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                6
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Aide à la Décision
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-800">
              Décider
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tableaux de bord d'aide à la décision pour autorités sanitaires, rapports scientifiques et exports certifiés.
            </p>
          </div>
        </div>
      </div>


      {/* 3 Strict Scientific Directives Warning Panel */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Principes Méthodologiques et Scientifiques Fondamentaux</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Pour garantir la rigueur de la recherche épidémiologique et éviter tout biais de modélisation, le protocole impose :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white/90 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
            <strong className="text-amber-950 font-semibold block flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">1</span>
              Non-extrapolation temporelle
            </strong>
            <p className="text-slate-600 text-[11px] leading-normal">
              Une observation environnementale actuelle (ex: gîte larvaire vu en 2024) ne doit <strong>jamais</strong> être automatiquement attribuée aux années antérieures (2020–2023). Des dates de validité sont obligatoires.
            </p>
          </div>

          <div className="bg-white/90 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
            <strong className="text-amber-950 font-semibold block flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">2</span>
              Pas de carte de risque brute
            </strong>
            <p className="text-slate-600 text-[11px] leading-normal">
              La cartographie affiche les <em>observations descriptives et facteurs</em>. L'estimation du <em>risque épidémiologique</em> découle de la modélisation statistique (GLMM / INLA / GAM) dans R ou Python.
            </p>
          </div>

          <div className="bg-white/90 p-3 rounded-lg border border-amber-200 text-xs space-y-1">
            <strong className="text-amber-950 font-semibold block flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">3</span>
              Anonymisation stricte (No PII)
            </strong>
            <p className="text-slate-600 text-[11px] leading-normal">
              Identifiants standardisés (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">MEN-000001</code>). La saisie de noms de personnes, numéros de téléphone ou identités nominatives est proscrite.
            </p>
          </div>
        </div>
      </div>

      {/* Main Modules Action Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Modules Opérationnels de la Plateforme
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card V1.17: Système de Surveillance One Health & Détection des Signaux d'Alerte */}
          <div
            onClick={() => onNavigate('SURVEILLANCE_ONE_HEALTH_V117')}
            className="group bg-gradient-to-br from-rose-950 via-slate-900 to-teal-950 text-white rounded-xl p-5 border-2 border-rose-400 hover:border-rose-300 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between md:col-span-3 lg:col-span-1 ring-2 ring-rose-500/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center group-hover:bg-rose-500 transition shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-rose-400 text-slate-950 text-[10px] font-black rounded-full shadow-sm">
                  NOUVEAU V1.17
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-rose-300 transition">
                  🚨 Surveillance One Health &amp; Signaux d&apos;Alerte
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Veille prospective intégrée : comparaison aux niveaux attendus modélisés V1.16, surveillance conjointe (Sanitaire, Climat, Environnement, WASH), alertes multi-critères et validation humaine obligatoire.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-rose-300">
              <span>Tableau de Bord, SIG &amp; 10 Scénarios Validés</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card V1.16: Validation Scientifique, Robustesse & Fiabilité des Modèles */}
          <div
            onClick={() => onNavigate('VALIDATION_SCIENTIFIQUE')}
            className="group bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-xl p-5 border-2 border-teal-400 hover:border-teal-300 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between md:col-span-3 lg:col-span-1 ring-2 ring-teal-500/20"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-500 text-white flex items-center justify-center group-hover:bg-teal-400 transition shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-teal-400 text-slate-950 text-[10px] font-black rounded-full shadow-sm">
                  NOUVEAU V1.16
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition">
                  🛡️ Validation Scientifique, Robustesse & Fiabilité
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Validation temporelle (Time-split, Rolling-folds), spatiale (Hold-out), calibration (pente, ECE), détection d&apos;overfitting &amp; data leakage, score de robustesse décomposé, et cartographie à couches strictes.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-300">
              <span>Banc d&apos;Épreuve &amp; 12 Tests Validés</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card V1.15: Moteur de Modélisation Statistique et Spatio-Temporelle */}
          <div
            onClick={() => onNavigate('MODELISATION')}
            className="group bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-xl p-5 border border-indigo-500/70 hover:border-indigo-300 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between md:col-span-3 lg:col-span-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center group-hover:bg-indigo-400 transition shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-400 text-slate-950 text-[10px] font-black rounded-full shadow-sm">
                  NOUVEAU V1.15
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                  📊 Moteur de Modélisation Statistique & Spatio-Temporelle
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  GLM (Poisson, Binomiale Négative, Logistique), Lags (0–4 mois), contrôle de surdispersion, diagnostic de Moran, cartographie du risque en 5 strates, analyse de sensibilité, reproductibilité R/Python et rapport en 20 sections.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-300">
              <span>12 Scénarios de Validation Méthodologique</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card V1.14: Laboratoire d'Analyse Scientifique & Dataset Analytique */}
          <div
            onClick={() => onNavigate('LABORATOIRE_ANALYSE')}
            className="group bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-xl p-5 border border-indigo-500/70 hover:border-indigo-400 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between md:col-span-3 lg:col-span-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-slate-950 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-400/30 text-indigo-200 border border-indigo-400/50 text-[10px] font-black rounded-full">
                  NOUVEAU V1.14
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                  🧪 Laboratoire d Analyse & Dataset Analytique
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Passerelle vers la modélisation : sélection des variables One Health, création de vues contrôlées sans altération du RAW/CLEANED, lags temporels (0–4 mois), associations et rapport automatisé en 17 sections.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-300">
              <span>8 Scénarios de Validation & Suite de Tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card V1.13: Diagnostic Scientifique, Disponibilité & Préparation Analytique */}
          <div
            onClick={() => onNavigate('DIAGNOSTIC_SCIENTIFIQUE')}
            className="group bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-xl p-5 border border-indigo-500/50 hover:border-indigo-400 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-slate-950 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-400/20 text-indigo-300 border border-indigo-400/40 text-[10px] font-black rounded-full">
                  NOUVEAU V1.13
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                  Diagnostic Scientifique & Disponibilité
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Réponses aux 10 questions de recherche, matrices temporelles/géographiques (2018–2026), traçabilité des proxies historiques et préparation analytique sans invention de données.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-300">
              <span>Matrices 4D, Scénario Kasuku & Modèles A/B/C</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card V1.12: Intégration Multi-Sources & Préparation des Données */}
          <div
            onClick={() => onNavigate('SOURCES_ET_IMPORTS_V112')}
            className="group bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 text-white rounded-xl p-5 border border-teal-500/40 hover:border-teal-400 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                  <Database className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-teal-400/20 text-teal-300 border border-teal-400/40 text-[10px] font-black rounded-full">
                  NOUVEAU V1.12
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition">
                  Intégration Multi-Sources & Imports
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Imports Excel/CSV (Santé, Climat, Env, Communautaire), matrice de disponibilité (2018–2026), réconciliation des synonymes et traçabilité RAW immuable.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-teal-300">
              <span>Pipeline RAW→CLEANED & Règle Manquant != 0</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 0: V1.11 Module Enquêtes Opérationnelles & Supervision */}
          <div
            onClick={() => onNavigate('ENQUETES_OPERATIONNELLES_V111')}
            className="group bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-xl p-5 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                  <Database className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold rounded-full">
                  NOUVEAU V1.11
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                  Enquêtes Terrain & Supervision
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Concepteur de questionnaires 7 sections avec versions immuables, collecte mobile géolocalisée, et supervision avec traçabilité intégrale.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>Formulaires versionnés & Contrôle RAW→CLEANED</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 1: Collecte Enquêtes Ménages */}
          <div
            onClick={() => onNavigate('SURVEY')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                  Enquêtes Ménages
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Formulaire multi-étapes avec capture GPS (&lt;20m), démographie, eau, assainissement, moustiquaires et observation directe de parcelle.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>{householdSurveys.length} enquêtes enregistrées</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Observations Environnementales */}
          <div
            onClick={() => onNavigate('ENV')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                  Observations Environnementales
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Enregistrement des gîtes larvaires d'anophèles, dépotoirs, caniveaux obstrués et zones inondables avec dates de validité obligatoire.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>{environmentalObs.length} observations actives</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Données Sanitaires */}
          <div
            onClick={() => onNavigate('HEALTH')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-cyan-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-cyan-700 transition">
                  Données Sanitaires
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Séries épidémiologiques mensuelles agrégées par aire de santé (Paludisme et Fièvre typhoïde) avec cas, hospitalisations et décès.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-700">
              <span>{healthRecords.length} fiches agrégées</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Données Climatiques */}
          <div
            onClick={() => onNavigate('CLIMATE')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition">
                  Données Climatiques
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Précipitations mensuelles (mm), températures (moyenne, min, max) et humidité avec décalages temporels (Lag-1) pour les analyses.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>{climateRecords.length} relevés météo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5: Cartographie Interactive */}
          <div
            onClick={() => onNavigate('MAP')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                  Cartographie Interactive
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Visualisation multi-couches : ménages, gîtes larvaires, points d'eau, caniveaux et limites administratives des aires de santé de Kindu.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Couches SIG & Coordonnées GPS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 7: Contrôle & Harmonisation V1.5 */}
          <div
            onClick={() => onNavigate('CONTROLE_HARMONISATION')}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                    Harmonisation & Contrôle V1.5
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Contrôle qualité multidimensionnel (0-100), résolution des doublons, matrice spatio-temporelle unifiée et dictionnaire global des variables.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>Readiness Score & 4 Domaines</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 8: Base Spatio-Temporelle V1.7 */}
          <div
            onClick={() => onNavigate('BASE_SPATIO_TEMPORELLE')}
            className="group bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-xl p-5 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition">
                    Base Spatio-Temporelle V1.7
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Structure de données intégrée : Espace (10 Aires) + Temps (36 Mois) + Santé + Climat + Environnement + WASH.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>Matrice 10×12, Lags M-1/M-2 & Exports</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 9: Qualité, Normalisation & Dataset V1.8 */}
          <div
            onClick={() => onNavigate('DATA_QUALITY_V18')}
            className="group bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-xl p-5 border border-teal-500/50 hover:border-teal-400 hover:shadow-xl transition cursor-pointer flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-400/40 uppercase tracking-wider">
                  V1.8 — VALIDÉE (12/12 TESTS)
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition">
                  Contrôle Qualité, Normalisation &amp; Préparation du Dataset V1.8
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
                  Chaîne complète de transformation : <strong>RAW_DATA &rarr; CLEAN_DATA &rarr; ANALYSIS_DATASET</strong>. Conservation absolue des données sources, distinction formelle Zéro vs NULL, isolation multicritère des doublons, calcul certifié d'incidence et journal d'audit immuable (TRANSFORMATION_LOG).
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-300">
              <span>9 Écrans Dédiés, Dictionnaire 26 Variables &amp; Rapport de Faisabilité</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 10: V1.9 — Analyse Exploratoire Spatio-Temporelle */}
          <div
            onClick={() => onNavigate('SPATIOTEMPORAL_EXPLORATION_V19')}
            className="group bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-xl p-5 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  V1.9 — ANALYSE SPATIO-TEMPORELLE
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition flex items-center gap-2">
                  <span>🔬 Analyse Exploratoire Spatio-Temporelle (V1.9)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                  Exploration rigoureuse avant modélisation : tendances chronologiques (Mann-Kendall), profils saisonniers, corrélations climat-maladies (Spearman &amp; Pearson avec IC 95% et p-valeurs), décalages temporels (Lags 0 à 3 mois), clusters spatiaux (Moran's I &amp; LISA), matrice de complétude et rapport scientifique automatique en 10 sections.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>10 Sous-menus interactifs • Avertissement épistémologique systématique • Journal ANALYSIS_LOG</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 11: V1.10 — Extension Maniema & Moteur Multi-Pathologies One Health */}
          <div
            onClick={() => onNavigate('MANIEMA_MULTI_PATHOLOGY_V110')}
            className="group bg-gradient-to-br from-teal-950 via-slate-900 to-sky-950 text-white rounded-xl p-5 border-2 border-teal-500 hover:border-teal-400 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-3 ring-1 ring-teal-500/30"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-slate-950 uppercase tracking-wider">
                  V1.10 OPÉRATIONNELLE — EXTENSION MANIEMA
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-teal-300 transition flex items-center gap-2">
                  <span>🌍 Extension Maniema & Moteur Multi-Pathologies One Health (V1.10)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                  Déploiement à l'échelle provinciale (18 Zones de santé, 7 Territoires + Ville de Kindu). Moteur dynamique multi-pathologies (Paludisme, Fièvre typhoïde, Choléra, Diarrhées, Arboviroses, Mpox), gestion multi-projets, formulaires adaptatifs, séries temporelles découplées et banc de 14 tests automatisés.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-300">
              <span>Catalogue 6 Pathologies • 7 Niveaux Spatiaux • Séparation Démo/Réel • Banc de Tests 14/14</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 12: V1.20 — Sécurité, Sauvegardes, Récupération & Préparation à la Production */}
          <div
            onClick={() => onNavigate('SECURITE_PRODUCTION')}
            className="group bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-xl p-5 border-2 border-emerald-500 hover:border-emerald-400 hover:shadow-2xl transition cursor-pointer flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-3 ring-1 ring-emerald-500/40"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center group-hover:bg-emerald-400 transition font-bold shadow-md">
                  <ShieldCheck className="w-6 h-6 text-slate-950" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider shadow-xs">
                  V1.20 NOUVEAU — SÉCURITÉ &amp; PRODUCTION
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-300 transition flex items-center gap-2">
                  <span>🛡️ Sécurité, Sauvegardes, Récupération &amp; Production Readiness (V1.20)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                  Architecture de durcissement opérationnel : isolation stricte des environnements (DEV/STAGING/PROD), authentification renforcée &amp; gestion des sessions/appareils, matrice RBAC 8 niveaux, corbeille de restauration (anti-suppression définitive accidentelle), centre de sauvegardes multi-cibles, plan de reprise après sinistre (PRA/DRP), journalisation d'audit &amp; erreurs centralisées, feature flags et banc de 12 tests de sécurité automatisés.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>9 Onglets Dédiés • Score de Préparation Prod • Sauvegardes Chiffrées • Banc de Tests 12/12</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Profil de l'utilisateur actif */}
      <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="text-slate-700">
            Connecté en tant que <strong className="text-slate-900">{userSession.name}</strong> • Rôle : <span className="font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{userSession.role}</span>
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span>Mode Hors-ligne opérationnel</span>
          <span>•</span>
          <span>Stockage local sécurisé</span>
        </div>
      </div>
    </div>
  );
};
