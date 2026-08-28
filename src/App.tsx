import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { HomeModule } from './components/HomeModule';
import { DashboardModule } from './components/DashboardModule';
import { MapModule } from './components/MapModule';
import { HealthDataModule } from './components/HealthDataModule';
import { ClimateDataModule } from './components/ClimateDataModule';
import { EnvironmentalModule } from './components/EnvironmentalModule';
import { HouseholdSurveyModule } from './components/HouseholdSurveyModule';
import { QualityControlModule } from './components/QualityControlModule';
import { ModelBaseModule } from './components/ModelBaseModule';
import { HarmonizationModule } from './components/HarmonizationModule';
import { SpatiotemporalDatabaseModule } from './components/spatiotemporal/SpatiotemporalDatabaseModule';
import { DataQualityModule } from './components/quality/DataQualityModule';
import { ExplorationModule } from './components/exploration/ExplorationModule';
import { ManiemaPlatformDashboard } from './components/maniema/ManiemaPlatformDashboard';
import { SurveyOperationsModuleV111 } from './components/SurveyOperationsModuleV111';
import { MultiSourceHubModule } from './components/multisource/MultiSourceHubModule';
import { ScientificDiagnosticModuleV113 } from './components/diagnostic/ScientificDiagnosticModuleV113';
import { DataExportModal } from './components/DataExportModal';
import { AuthModal } from './components/AuthModal';
import { AppModule } from './types';
import {
  LayoutDashboard,
  Map as MapIcon,
  Activity,
  CloudRain,
  Bug,
  Home,
  ShieldCheck,
  Database,
  Menu,
  X,
  Building2,
  Sparkles,
  Globe,
  ClipboardList,
  UploadCloud
} from 'lucide-react';

const NAV_ITEMS: { id: AppModule; label: string; shortLabel: string; icon: any }[] = [
  { id: 'ACCUEIL', label: 'Accueil', shortLabel: 'Accueil', icon: Building2 },
  { id: 'DASHBOARD', label: 'Tableau de bord', shortLabel: 'Dashboard', icon: LayoutDashboard },
  { id: 'DIAGNOSTIC_SCIENTIFIQUE', label: '🔬 Diagnostic Scientifique V1.13', shortLabel: 'V1.13 Diag.', icon: Sparkles },
  { id: 'SOURCES_ET_IMPORTS_V112', label: '📥 Sources & Imports V1.12', shortLabel: 'V1.12 Sources', icon: UploadCloud },
  { id: 'ENQUETES_OPERATIONNELLES_V111', label: '📋 Enquêtes & Supervision V1.11', shortLabel: 'V1.11 Enquêtes', icon: ClipboardList },
  { id: 'MANIEMA_MULTI_PATHOLOGY_V110', label: '🌍 Extension Maniema V1.10', shortLabel: 'V1.10 Maniema', icon: Globe },
  { id: 'SURVEY', label: 'Enquêtes ménages', shortLabel: 'Ménages', icon: Home },
  { id: 'ENV', label: 'Observations env.', shortLabel: 'Gîtes/Env', icon: Bug },
  { id: 'HEALTH', label: 'Données sanitaires', shortLabel: 'Sanitaire', icon: Activity },
  { id: 'CLIMATE', label: 'Données climatiques', shortLabel: 'Climat', icon: CloudRain },
  { id: 'CONTROLE_HARMONISATION', label: 'Contrôle & Harmonisation V1.5', shortLabel: 'Harmonisation', icon: ShieldCheck },
  { id: 'BASE_SPATIO_TEMPORELLE', label: 'Base Spatio-Temporelle V1.7', shortLabel: 'V1.7 Base', icon: Sparkles },
  { id: 'DATA_QUALITY_V18', label: 'Qualité & Dataset V1.8', shortLabel: 'V1.8 Qualité', icon: ShieldCheck },
  { id: 'SPATIOTEMPORAL_EXPLORATION_V19', label: '🔬 Analyse Spatio-Temporelle V1.9', shortLabel: 'V1.9 Analyse', icon: Sparkles },
  { id: 'MAP', label: 'Cartographie SIG', shortLabel: 'Carte', icon: MapIcon },
  { id: 'QUALITY', label: 'Contrôle qualité V1', shortLabel: 'Qualité', icon: ShieldCheck },
  { id: 'MODEL_BASE', label: 'Base modèle (AS×Mois)', shortLabel: 'Matrice', icon: Database },
];

const MainContent: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AppModule>('ACCUEIL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { qualityIssues, userSession, setUserSession } = useData();

  const pendingIssuesCount = qualityIssues.filter(q => q.status === 'A_CORRIGER').length;

  const isModuleActive = (itemModule: AppModule, current: AppModule) => {
    if (itemModule === current) return true;
    if ((itemModule === 'DIAGNOSTIC_SCIENTIFIQUE' || itemModule === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || itemModule === 'DIAGNOSTIC_DONNEES') && (current === 'DIAGNOSTIC_SCIENTIFIQUE' || current === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || current === 'DIAGNOSTIC_DONNEES')) return true;
    if ((itemModule === 'DASHBOARD' || itemModule === 'TABLEAU_BORD') && (current === 'DASHBOARD' || current === 'TABLEAU_BORD')) return true;
    if ((itemModule === 'SURVEY' || itemModule === 'ENQUETES_MENAGES') && (current === 'SURVEY' || current === 'ENQUETES_MENAGES' || current === 'SYNCHRONISATION')) return true;
    if ((itemModule === 'ENV' || itemModule === 'OBSERVATIONS_ENV') && (current === 'ENV' || current === 'OBSERVATIONS_ENV')) return true;
    if ((itemModule === 'HEALTH' || itemModule === 'DONNEES_SANITAIRES') && (current === 'HEALTH' || current === 'DONNEES_SANITAIRES')) return true;
    if ((itemModule === 'CLIMATE' || itemModule === 'DONNEES_CLIMATIQUES') && (current === 'CLIMATE' || current === 'DONNEES_CLIMATIQUES')) return true;
    if ((itemModule === 'MAP' || itemModule === 'CARTOGRAPHIE') && (current === 'MAP' || current === 'CARTOGRAPHIE')) return true;
    if ((itemModule === 'QUALITY' || itemModule === 'CONTROLE_QUALITE') && (current === 'QUALITY' || current === 'CONTROLE_QUALITE')) return true;
    if ((itemModule === 'CONTROLE_HARMONISATION' || itemModule === 'HARMONISATION') && (current === 'CONTROLE_HARMONISATION' || current === 'HARMONISATION')) return true;
    if (itemModule === 'BASE_SPATIO_TEMPORELLE' && current === 'BASE_SPATIO_TEMPORELLE') return true;
    if ((itemModule === 'DATA_QUALITY_V18' || itemModule === 'QUALITE_DONNEES') && (current === 'DATA_QUALITY_V18' || current === 'QUALITE_DONNEES')) return true;
    if ((itemModule === 'SPATIOTEMPORAL_EXPLORATION_V19' || itemModule === 'ANALYSE_SPATIO_TEMPORELLE') && (current === 'SPATIOTEMPORAL_EXPLORATION_V19' || current === 'ANALYSE_SPATIO_TEMPORELLE')) return true;
    if ((itemModule === 'SOURCES_ET_IMPORTS_V112' || itemModule === 'SOURCES_IMPORTS' || itemModule === 'INTEGRATION_MULTI_SOURCES') && (current === 'SOURCES_ET_IMPORTS_V112' || current === 'SOURCES_IMPORTS' || current === 'INTEGRATION_MULTI_SOURCES')) return true;
    if ((itemModule === 'ENQUETES_OPERATIONNELLES_V111' || itemModule === 'SUPERVISION_TERRAIN_V111' || itemModule === 'SURVEY_OPERATIONS') && (current === 'ENQUETES_OPERATIONNELLES_V111' || current === 'SUPERVISION_TERRAIN_V111' || current === 'SURVEY_OPERATIONS')) return true;
    if ((itemModule === 'MANIEMA_MULTI_PATHOLOGY_V110' || itemModule === 'GESTION_MANIEMA_PATHOLOGIES' || itemModule === 'ONE_HEALTH_PLATFORM') && (current === 'MANIEMA_MULTI_PATHOLOGY_V110' || current === 'GESTION_MANIEMA_PATHOLOGIES' || current === 'ONE_HEALTH_PLATFORM')) return true;
    if ((itemModule === 'MODEL_BASE' || itemModule === 'BASE_MODELE') && (current === 'MODEL_BASE' || current === 'BASE_MODELE')) return true;
    return false;
  };

  const handleNavigate = (module: AppModule) => {
    if (module === 'IMPORT_EXPORT') {
      setIsExportModalOpen(true);
    } else if (module === 'ADMINISTRATION') {
      setIsAuthModalOpen(true);
    } else {
      setActiveModule(module);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
      <Header
        currentModule={activeModule}
        setCurrentModule={handleNavigate}
        activeModule={activeModule}
        setActiveModule={handleNavigate}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Mobile Top Navigation Trigger */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-[57px] z-20">
        <div className="flex items-center gap-2">
          {(() => {
            const current = NAV_ITEMS.find(n => isModuleActive(n.id, activeModule)) || NAV_ITEMS[0];
            const Icon = current?.icon || LayoutDashboard;
            return (
              <>
                <Icon className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold text-slate-800">{current?.label}</span>
              </>
            );
          })()}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[102px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 shadow-xl space-y-1 animate-in slide-in-from-top-2 duration-150">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isModuleActive(item.id, activeModule);

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.id === 'QUALITY' && pendingIssuesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingIssuesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeModule === 'ACCUEIL' && <HomeModule onNavigate={handleNavigate} />}
        {(activeModule === 'DIAGNOSTIC_SCIENTIFIQUE' || activeModule === 'DIAGNOSTIC_SCIENTIFIQUE_V113' || activeModule === 'DIAGNOSTIC_DONNEES') && (
          <ScientificDiagnosticModuleV113 />
        )}
        {(activeModule === 'DASHBOARD' || activeModule === 'TABLEAU_BORD') && <DashboardModule />}
        {(activeModule === 'MAP' || activeModule === 'CARTOGRAPHIE') && <MapModule />}
        {(activeModule === 'HEALTH' || activeModule === 'DONNEES_SANITAIRES') && <HealthDataModule />}
        {(activeModule === 'CLIMATE' || activeModule === 'DONNEES_CLIMATIQUES') && <ClimateDataModule />}
        {(activeModule === 'ENV' || activeModule === 'OBSERVATIONS_ENV') && <EnvironmentalModule />}
        {(activeModule === 'SURVEY' || activeModule === 'ENQUETES_MENAGES' || activeModule === 'SYNCHRONISATION') && (
          <HouseholdSurveyModule />
        )}
        {(activeModule === 'CONTROLE_HARMONISATION' || activeModule === 'HARMONISATION') && (
          <HarmonizationModule />
        )}
        {activeModule === 'BASE_SPATIO_TEMPORELLE' && <SpatiotemporalDatabaseModule />}
        {(activeModule === 'DATA_QUALITY_V18' || activeModule === 'QUALITE_DONNEES') && <DataQualityModule />}
        {(activeModule === 'SPATIOTEMPORAL_EXPLORATION_V19' || activeModule === 'ANALYSE_SPATIO_TEMPORELLE') && (
          <ExplorationModule />
        )}
        {(activeModule === 'SOURCES_ET_IMPORTS_V112' || activeModule === 'SOURCES_IMPORTS' || activeModule === 'INTEGRATION_MULTI_SOURCES') && (
          <MultiSourceHubModule onNavigateToAnalysis={() => setActiveModule('SPATIOTEMPORAL_EXPLORATION_V19')} />
        )}
        {(activeModule === 'ENQUETES_OPERATIONNELLES_V111' || activeModule === 'SUPERVISION_TERRAIN_V111' || activeModule === 'SURVEY_OPERATIONS') && (
          <SurveyOperationsModuleV111 />
        )}
        {(activeModule === 'MANIEMA_MULTI_PATHOLOGY_V110' || activeModule === 'GESTION_MANIEMA_PATHOLOGIES' || activeModule === 'ONE_HEALTH_PLATFORM') && (
          <ManiemaPlatformDashboard />
        )}
        {(activeModule === 'QUALITY' || activeModule === 'CONTROLE_QUALITE') && <QualityControlModule />}
        {(activeModule === 'MODEL_BASE' || activeModule === 'BASE_MODELE') && <ModelBaseModule />}
      </main>

      {/* Mobile Bottom Quick Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex justify-around z-30 shadow-lg">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = isModuleActive(item.id, activeModule);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={userSession.role}
        currentName={userSession.name}
        onSelectUser={(u) => {
          setUserSession({
            id: u.id,
            name: u.name,
            role: u.role,
            institution: 'Université de Kindu / DPS Maniema',
            assignedArea: u.healthAreaId,
            isActive: true,
          });
          setIsAuthModalOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 mt-auto">
        <p className="max-w-7xl mx-auto px-4">
          One Health Kindu • Plateforme Universitaire de Recherche Spatio-Temporelle (RDC - Maniema) • Respect strict du protocole d'anonymisation et de non-extrapolation historique
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
}
