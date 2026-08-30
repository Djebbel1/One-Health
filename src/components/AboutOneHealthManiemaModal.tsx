import React, { useState } from 'react';
import {
  X,
  Info,
  ShieldCheck,
  Globe,
  Layers,
  MapPin,
  FileText,
  Activity,
  Trees,
  CloudRain,
  Droplets,
  PawPrint,
  UserCheck,
  Sparkles,
  ChevronRight,
  Database,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { MANIEMA_PROVINCE_DATA, SUPPORTED_PROVINCES_REGISTRY } from '../config/geoHierarchyConfig';
import { OneHealthLogo } from './common/OneHealthLogo';

interface AboutOneHealthManiemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEnvironment?: string;
}

export const AboutOneHealthManiemaModal: React.FC<AboutOneHealthManiemaModalProps> = ({
  isOpen,
  onClose,
  activeEnvironment = 'PRODUCTION'
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PILLARS' | 'GEOGRAPHY' | 'GOVERNANCE' | 'CHANGELOG'>('OVERVIEW');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header with One Health Branding */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <OneHealthLogo size="md" variant="badge" />
            <div className="h-6 w-px bg-slate-700 hidden sm:block" />
            <span className="text-xs font-semibold text-emerald-400/90 px-2.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 hidden sm:inline-block">
              {APP_CONFIG.version}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Fermer la fenêtre à propos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Présentation & Missions</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PILLARS')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'PILLARS'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Piliers One Health</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('GEOGRAPHY')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'GEOGRAPHY'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Territoire & Extensibilité</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('GOVERNANCE')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'GOVERNANCE'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Éthique & Neutralité</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CHANGELOG')}
            className={`py-3 px-3 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'CHANGELOG'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Changelog V1.21</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Primary Identity Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Identité & Vocation de la Plateforme</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {APP_CONFIG.name}
                </h3>
                <p className="text-emerald-300 font-medium">
                  {APP_CONFIG.tagline}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {APP_CONFIG.description}
                </p>
              </div>

              {/* Technical & Operational Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 block font-medium">Version Logicielle</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">{APP_CONFIG.version}</span>
                  <span className="text-[11px] text-emerald-400">Release : {APP_CONFIG.releaseDate}</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 block font-medium">Territoire Principal</span>
                  <span className="text-lg font-bold text-teal-300 mt-0.5 block">{APP_CONFIG.primaryRegion}</span>
                  <span className="text-[11px] text-slate-400">RDC • Chef-lieu : {APP_CONFIG.primaryCity}</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 block font-medium">Environnement Actif</span>
                  <span className="text-lg font-bold text-cyan-300 mt-0.5 block">{activeEnvironment}</span>
                  <span className="text-[11px] text-slate-400">Mode Sandbox & Pilote</span>
                </div>
              </div>

              {/* The 6 Core Modules of One Health Maniema */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Les 6 Piliers Fonctionnels de la Plateforme
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1. Collecter
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Enquêtes ménages géoréférencées, fiches d'observation environnementale et mode déconnecté PWA.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 2. Gérer
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Gouvernance de protocoles, dictionnaire des variables, traçabilité RAW / CLEAN / ANALYTIC.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 3. Analyser
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Analyses statistiques descriptives, croisements spatiaux, saisonnalité et corrélations croisées.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 4. Modéliser
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Modèles spatio-temporels (GLM, INLA/Bayésien), prédictions de risques et scripts R / Python.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 5. Surveiller
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Veille multi-pathologies en temps réel, seuils d'alerte épidémiologique et détection de clusters.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 6. Décider
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Rapports scientifiques automatisés, exports sécurisés pour décideurs et conformité éthique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PILLARS */}
          {activeTab === 'PILLARS' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Approche Multidimensionnelle Intégrée One Health
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  La plateforme traite les risques sanitaires à l'interface entre l'homme, les animaux et leurs écosystèmes partagés.
                </p>
              </div>

              <div className="space-y-3">
                {APP_CONFIG.pillars.map((pillar) => (
                  <div key={pillar.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{pillar.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                          {pillar.shortLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">{pillar.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.indicatorsSample.slice(0, 2).map((ind, i) => (
                        <span key={i} className="text-[10px] bg-slate-900/80 text-emerald-300 px-2 py-1 rounded-md border border-slate-700/60">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Supported Pathologies */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Pathologies & Risques Sanitaires Couverts
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  {APP_CONFIG.supportedPathologies.map((patho, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      <span>{patho}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: GEOGRAPHY */}
          {activeTab === 'GEOGRAPHY' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Cadre Géographique et Harmonisation V1.21</span>
                </div>
                <h4 className="text-base font-bold text-white">
                  Province du Maniema (RDC) & Distinction de Kindu
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Conformément aux principes de rigueur cartographique et épidémiologique, la plateforme distingue rigoureusement la <strong className="text-emerald-300">Province du Maniema</strong> (entité provinciale d'ancrage global) de la <strong className="text-cyan-300">Ville de Kindu</strong> (chef-lieu et territoire pilote des collectes de terrain initiales).
                </p>
              </div>

              {/* Administrative Hierarchy tree */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Structure Administrative & Sanitaire Actuelle
                </h5>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">Niveau 1</span>
                    <span>Province du Maniema (République Démocratique du Congo)</span>
                  </div>

                  <div className="ml-6 space-y-1.5 text-slate-300 border-l-2 border-slate-700 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300">Niveau 2</span>
                      <span className="font-semibold text-white">Territoires & Villes :</span>
                      <span>Kindu (Ville), Kasongo, Kailo, Pangi, Punia, Lubutu, Kibombo, Kabambare</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300">Niveau 3</span>
                      <span className="font-semibold text-white">Zones de Santé :</span>
                      <span>Alunguli, Kasuku, Mikelenge, Kasongo, Kunda, Kailo, Pangi, Kampene, Punia, etc.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300">Niveau 4</span>
                      <span className="font-semibold text-white">Aires de Santé :</span>
                      <span>Basoko, Kandolo, Lwama, Tokolote, Manyanga, Campus UNIKI, Mikelenge Centre, etc.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300">Niveau 5</span>
                      <span className="font-semibold text-white">Micro-Géoréférencement :</span>
                      <span>Avenues, Ménages, Gîtes larvaires, Points d'eau (GPS WGS84)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extensibility note */}
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-start gap-3">
                <Globe className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-bold text-teal-300 block">Extensibilité Provinciale Conçue dès la Conception</span>
                  <p className="text-slate-300">
                    Bien que la plateforme soit actuellement déployée en priorité dans le Maniema, l'architecture logicielle sous-jacente est découplée et prête pour un passage à l'échelle nationale (Tshopo, Sud-Kivu, Sankuru, Kinshasa, etc.) sans rupture d'intégrité.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GOVERNANCE & ETHICS */}
          {activeTab === 'GOVERNANCE' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Conformité Éthique & Politique de Non-Invention
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ONE HEALTH MANIEMA respecte une charte déontologique stricte relative à la transparence scientifique et à l'identité institutionnelle.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Respect du Logo One Health</span>
                    <p className="text-slate-400 mt-0.5">
                      Aucun logo officiel contrefait n'est injecté. Un emplacement réservé normé permet l'accueil des éléments visuels officiellement autorisés par les autorités compétentes.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Absence de Partenaires Fictifs</span>
                    <p className="text-slate-400 mt-0.5">
                      La plateforme s'interdit d'afficher des mentions ou logos d'agences internationales (OMS, FAO, WOAH, UNICEF) ou de ministères sans convention de partenariat formellement signée.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-700 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Protection des Données Personnelles</span>
                    <p className="text-slate-400 mt-0.5">
                      Pseudonymisation automatique des répondants d'enquêtes, masquage des numéros de téléphone et bruitage spatial contrôlé des coordonnées GPS sur les exports publics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHANGELOG */}
          {activeTab === 'CHANGELOG' && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Historique des Versions & Journal de Déploiement
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Traçabilité des évolutions de la plateforme One Health Maniema.
                </p>
              </div>

              <div className="space-y-3">
                {APP_CONFIG.versionHistory.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                          {item.version}
                        </span>
                        <span className="text-xs font-bold text-white">{item.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{item.releaseDate}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{item.tagline}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.changesSummary}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-750">
                      <span>Portée : {item.primaryRegion}</span>
                      <span>Responsable : {item.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="font-bold text-slate-300">{APP_CONFIG.name}</span>
            <span>•</span>
            <span>{APP_CONFIG.primaryRegion}, {APP_CONFIG.country}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-xs"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
