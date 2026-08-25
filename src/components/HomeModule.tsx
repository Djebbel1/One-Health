import React from 'react';
import {
  Activity,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  Database,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { AppModule } from '../types';
import { useData } from '../context/DataContext';

interface HomeModuleProps {
  onNavigate: (module: AppModule) => void;
}

export const HomeModule: React.FC<HomeModuleProps> = ({ onNavigate }) => {
  const { householdSurveys, environmentalObs, healthRecords, climateRecords, userSession } = useData();

  return (
    <div className="space-y-6">
      {/* Hero Banner with University Research Framing */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Projet Universitaire de Recherche & Thèse Doctorale</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Approche One Health pour la modélisation des risques sanitaires à Kindu
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Plateforme intégrée de collecte géoréférencée, contrôle qualité et compilation spatio-temporelle
            des données sanitaires (paludisme, fièvre typhoïde), climatiques (pluviométrie, températures) et
            environnementales (gîtes larvaires, assainissement) à <strong className="text-emerald-300">Kindu, Province du Maniema, RDC</strong>.
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
              <span className="text-[10px] text-slate-400 block">Facteurs avec dates validité</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Rapports Sanitaires</span>
              <span className="text-xl font-bold text-cyan-400">{healthRecords.length}</span>
              <span className="text-[10px] text-slate-400 block">Aires de santé (2020-2024)</span>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700">
              <span className="text-xs text-slate-400 block font-medium">Relevés Climat</span>
              <span className="text-xl font-bold text-amber-400">{climateRecords.length}</span>
              <span className="text-[10px] text-slate-400 block">Météo & Précipitations</span>
            </div>
          </div>

          {/* Direct Quick Action Buttons for Household Surveys (V1.1 Access) */}
          <div className="pt-3 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('SURVEY')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition transform active:scale-95"
            >
              <span>➕ NOUVELLE ENQUÊTE MÉNAGE</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('SURVEY')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <span>📋 MES ENQUÊTES</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('SURVEY')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <span>⏳ EN ATTENTE DE SYNCHRONISATION</span>
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full font-mono text-[10px]">
                {householdSurveys.filter(s => s.sync_status === 'PENDING').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('SURVEY')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <span>✅ ENQUÊTES VALIDÉES</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full font-mono text-[10px]">
                {householdSurveys.filter(s => s.status === 'VALIDATED').length}
              </span>
            </button>
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
            className="group bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-5 border border-teal-700/60 hover:border-teal-400 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition">
                    Harmonisation & Contrôle V1.5
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30 uppercase">
                    NOUVEAU
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Contrôle qualité multidimensionnel (0-100), résolution des doublons, matrice spatio-temporelle unifiée et dictionnaire global des variables.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-semibold text-teal-300">
              <span>Readiness Score & 4 Domaines</span>
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
