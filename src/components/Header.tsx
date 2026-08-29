import React from 'react';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  User,
  ShieldCheck,
  Download,
  AlertTriangle,
  Layers,
  Database,
  Building2,
  FileSpreadsheet,
  CloudSun,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { exportToFullExcel } from '../utils/exportUtils';
import { AppModule } from '../types';

interface HeaderProps {
  currentModule?: AppModule;
  setCurrentModule?: (m: AppModule) => void;
  activeModule?: AppModule;
  setActiveModule?: (m: AppModule) => void;
  onOpenExport?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  setCurrentModule,
  activeModule,
  setActiveModule,
  onOpenExport,
  onOpenAuth
}) => {
  const active = currentModule || activeModule || 'ACCUEIL';

  const handleModuleChange = (module: AppModule) => {
    if (module === 'IMPORT_EXPORT' && onOpenExport) {
      onOpenExport();
      return;
    }
    if (module === 'ADMINISTRATION' && onOpenAuth) {
      onOpenAuth();
      return;
    }
    if (typeof setCurrentModule === 'function') {
      setCurrentModule(module);
    } else if (typeof setActiveModule === 'function') {
      setActiveModule(module);
    }
  };
  const {
    userSession,
    setUserSession,
    availableUsers,
    isOffline,
    setIsOffline,
    syncQueue,
    syncAllPending,
    pendingSyncCount,
    householdSurveys,
    environmentalObs,
    healthRecords,
    climateRecords,
    modelMatrix,
    qualityIssues
  } = useData();

  const unresolvedCriticalCount = qualityIssues.filter(
    q => q.status === 'A_CORRIGER' && q.severity === 'CRITIQUE'
  ).length;

  const handleQuickExport = () => {
    exportToFullExcel(
      householdSurveys,
      environmentalObs,
      healthRecords,
      climateRecords,
      modelMatrix,
      false
    );
  };

  const navItems: { id: AppModule; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { id: 'ACCUEIL', label: 'Accueil', icon: Building2 },
    { id: 'TABLEAU_BORD', label: 'Tableau de bord', icon: Activity },
    {
      id: 'LABORATOIRE_ANALYSE',
      label: '🧪 Laboratoire d Analyse V1.14',
      icon: Sparkles,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'DIAGNOSTIC_SCIENTIFIQUE',
      label: '🔬 Diagnostic Scientifique V1.13',
      icon: Sparkles,
      badgeColor: 'bg-indigo-600 text-white'
    },
    {
      id: 'SOURCES_ET_IMPORTS_V112',
      label: '📥 Sources & Imports V1.12',
      icon: Database,
      badgeColor: 'bg-teal-600 text-white'
    },
    {
      id: 'ENQUETES_OPERATIONNELLES_V111',
      label: '📋 Enquêtes & Supervision V1.11',
      icon: Database,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'MANIEMA_MULTI_PATHOLOGY_V110',
      label: '🌍 Extension Maniema & Multi-Pathologies V1.10',
      icon: Activity,
      badgeColor: 'bg-teal-600 text-white'
    },
    { id: 'ENQUETES_MENAGES', label: 'Enquêtes Ménages', icon: Database, count: householdSurveys.length },
    { id: 'OBSERVATIONS_ENV', label: 'Observations Env.', icon: Layers, count: environmentalObs.length },
    { id: 'DONNEES_SANITAIRES', label: 'Données Sanitaires', icon: Activity, count: healthRecords.length },
    { id: 'DONNEES_CLIMATIQUES', label: 'Données Climatiques', icon: CloudSun, count: climateRecords.length },
    { id: 'CARTOGRAPHIE', label: 'Cartographie', icon: Layers },
    {
      id: 'CONTROLE_HARMONISATION',
      label: 'Contrôle & Harmonisation V1.5',
      icon: ShieldCheck,
      badgeColor: 'bg-teal-600 text-white'
    },
    {
      id: 'BASE_SPATIO_TEMPORELLE',
      label: 'Base Spatio-Temporelle V1.7',
      icon: Sparkles,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'DATA_QUALITY_V18',
      label: 'Qualité & Dataset V1.8',
      icon: ShieldCheck,
      badgeColor: 'bg-teal-500 text-white'
    },
    {
      id: 'SPATIOTEMPORAL_EXPLORATION_V19',
      label: '🔬 Analyse Spatio-Temporelle V1.9',
      icon: Sparkles,
      badgeColor: 'bg-emerald-500 text-white'
    },
    {
      id: 'MANIEMA_MULTI_PATHOLOGY_V110',
      label: '🌍 Extension Maniema & Multi-Pathologies V1.10',
      icon: Activity,
      badgeColor: 'bg-teal-600 text-white'
    },
    {
      id: 'CONTROLE_QUALITE',
      label: 'Contrôle Qualité V1',
      icon: AlertTriangle,
      count: unresolvedCriticalCount > 0 ? unresolvedCriticalCount : undefined,
      badgeColor: 'bg-rose-600 text-white'
    },
    { id: 'BASE_MODELE', label: 'Base Modèle (R/Py)', icon: FileSpreadsheet },
    {
      id: 'SYNCHRONISATION',
      label: 'Synchro',
      icon: RefreshCw,
      count: pendingSyncCount > 0 ? pendingSyncCount : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    { id: 'IMPORT_EXPORT', label: 'Import / Export', icon: Download },
    { id: 'ADMINISTRATION', label: 'Admin', icon: ShieldCheck },
  ];

  const isTabActive = (itemId: AppModule, activeId: AppModule) => {
    if (itemId === activeId) return true;
    if ((itemId === 'TABLEAU_BORD' || itemId === 'DASHBOARD') && (activeId === 'TABLEAU_BORD' || activeId === 'DASHBOARD')) return true;
    if ((itemId === 'ENQUETES_MENAGES' || itemId === 'SURVEY') && (activeId === 'ENQUETES_MENAGES' || activeId === 'SURVEY')) return true;
    if ((itemId === 'OBSERVATIONS_ENV' || itemId === 'ENV') && (activeId === 'OBSERVATIONS_ENV' || activeId === 'ENV')) return true;
    if ((itemId === 'DONNEES_SANITAIRES' || itemId === 'HEALTH') && (activeId === 'DONNEES_SANITAIRES' || activeId === 'HEALTH')) return true;
    if ((itemId === 'DONNEES_CLIMATIQUES' || itemId === 'CLIMATE') && (activeId === 'DONNEES_CLIMATIQUES' || activeId === 'CLIMATE')) return true;
    if ((itemId === 'CARTOGRAPHIE' || itemId === 'MAP') && (activeId === 'CARTOGRAPHIE' || activeId === 'MAP')) return true;
    if ((itemId === 'CONTROLE_QUALITE' || itemId === 'QUALITY') && (activeId === 'CONTROLE_QUALITE' || activeId === 'QUALITY')) return true;
    if ((itemId === 'CONTROLE_HARMONISATION' || itemId === 'HARMONISATION') && (activeId === 'CONTROLE_HARMONISATION' || activeId === 'HARMONISATION')) return true;
    if (itemId === 'BASE_SPATIO_TEMPORELLE' && activeId === 'BASE_SPATIO_TEMPORELLE') return true;
    if ((itemId === 'DATA_QUALITY_V18' || itemId === 'QUALITE_DONNEES') && (activeId === 'DATA_QUALITY_V18' || activeId === 'QUALITE_DONNEES')) return true;
    if ((itemId === 'SPATIOTEMPORAL_EXPLORATION_V19' || itemId === 'ANALYSE_SPATIO_TEMPORELLE') && (activeId === 'SPATIOTEMPORAL_EXPLORATION_V19' || activeId === 'ANALYSE_SPATIO_TEMPORELLE')) return true;
    if ((itemId === 'SOURCES_ET_IMPORTS_V112' || itemId === 'SOURCES_IMPORTS' || itemId === 'INTEGRATION_MULTI_SOURCES') && (activeId === 'SOURCES_ET_IMPORTS_V112' || activeId === 'SOURCES_IMPORTS' || activeId === 'INTEGRATION_MULTI_SOURCES')) return true;
    if ((itemId === 'ENQUETES_OPERATIONNELLES_V111' || itemId === 'SUPERVISION_TERRAIN_V111' || itemId === 'SURVEY_OPERATIONS') && (activeId === 'ENQUETES_OPERATIONNELLES_V111' || activeId === 'SUPERVISION_TERRAIN_V111' || activeId === 'SURVEY_OPERATIONS')) return true;
    if ((itemId === 'MANIEMA_MULTI_PATHOLOGY_V110' || itemId === 'GESTION_MANIEMA_PATHOLOGIES' || itemId === 'ONE_HEALTH_PLATFORM') && (activeId === 'MANIEMA_MULTI_PATHOLOGY_V110' || activeId === 'GESTION_MANIEMA_PATHOLOGIES' || activeId === 'ONE_HEALTH_PLATFORM')) return true;
    if ((itemId === 'BASE_MODELE' || itemId === 'MODEL_BASE') && (activeId === 'BASE_MODELE' || activeId === 'MODEL_BASE')) return true;
    return false;
  };

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top Banner / Identity Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Project Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleModuleChange('ACCUEIL')}
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-emerald-500/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  ONE HEALTH KINDU
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    RDC • Maniema
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Modélisation spatio-temporelle : Paludisme, Fièvre typhoïde & Climat
              </p>
            </div>
          </button>
        </div>

        {/* Global Action Bar: Network, User Role, Quick Export */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline / Online Switcher Badge */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setIsOffline(!isOffline)}
              title={isOffline ? "Mode Hors-ligne actif (Cliquez pour reconnecter)" : "Connecté au serveur (Cliquez pour simuler hors-ligne)"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hors-ligne</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">En ligne</span>
                </>
              )}
            </button>

            {pendingSyncCount > 0 && (
              <button
                onClick={() => syncAllPending()}
                className="ml-1.5 flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold animate-pulse transition"
                title={`${pendingSyncCount} enregistrement(s) en attente de synchronisation`}
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{pendingSyncCount} synchro</span>
              </button>
            )}
          </div>

          {/* Quick Excel Export */}
          <button
            onClick={handleQuickExport}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition"
            title="Exporter l'ensemble de la base en fichier Excel multi-onglets"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

          {/* Active User / Role Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1 border border-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              aria-label="Sélectionner l'utilisateur et le rôle"
              value={userSession.id}
              onChange={(e) => {
                const user = availableUsers.find(u => u.id === e.target.value);
                if (user) setUserSession(user);
              }}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="border-t border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-thin">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex gap-1 py-1">
          {navItems.map((item) => {
            const isActive = isTabActive(item.id, active);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id.toLowerCase()}`}
                onClick={() => handleModuleChange(item.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.badgeColor || (isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
