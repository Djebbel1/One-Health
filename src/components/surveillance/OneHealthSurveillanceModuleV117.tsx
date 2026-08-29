import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CloudRain,
  Layers,
  Droplets,
  MapPin,
  TrendingUp,
  History,
  FileText,
  FlaskConical,
  ShieldCheck,
  Filter,
  UserCheck,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SurveillanceDashboardTab } from './SurveillanceDashboardTab';
import { SanitarySurveillanceTab } from './SanitarySurveillanceTab';
import { ClimateSurveillanceTab } from './ClimateSurveillanceTab';
import { EnvironmentalSurveillanceTab } from './EnvironmentalSurveillanceTab';
import { WashSurveillanceTab } from './WashSurveillanceTab';
import { SignalsDetectionTab } from './SignalsDetectionTab';
import { AlertsAndRulesTab } from './AlertsAndRulesTab';
import { SurveillanceMappingTab } from './SurveillanceMappingTab';
import { TemporalTrendsTab } from './TemporalTrendsTab';
import { SurveillanceHistoryAuditTab } from './SurveillanceHistoryAuditTab';
import { SurveillanceReportsTab } from './SurveillanceReportsTab';
import { SurveillanceSuiteV117Tab } from './SurveillanceSuiteV117Tab';
import { UserSurveillanceRole } from '../../types';

export type SurveillanceTabId =
  | 'DASHBOARD'
  | 'SURVEILLANCE_SANITAIRE'
  | 'SURVEILLANCE_CLIMATIQUE'
  | 'SURVEILLANCE_ENVIRONNEMENTALE'
  | 'SURVEILLANCE_WASH'
  | 'SIGNAUX'
  | 'ALERTES'
  | 'CARTOGRAPHIE'
  | 'TENDANCES'
  | 'HISTORIQUE'
  | 'RAPPORTS'
  | 'TESTS_V117';

export const OneHealthSurveillanceModuleV117: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SurveillanceTabId>('DASHBOARD');
  
  // Filtres contextuels partagés
  const [selectedZone, setSelectedZone] = useState<string>('TOUTES');
  const [selectedPathology, setSelectedPathology] = useState<string>('PALUDISME');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026-S34');

  // Gestion du rôle utilisateur (RBAC)
  const [currentUserRole, setCurrentUserRole] = useState<UserSurveillanceRole>('SUPERVISEUR');
  const [currentUserName, setCurrentUserName] = useState<string>('Dr. Jean-Paul KASONGO');

  const navigationTabs = [
    { id: 'DASHBOARD', label: 'Vue d’Ensemble', icon: Activity },
    { id: 'SURVEILLANCE_SANITAIRE', label: 'Sanitaire', icon: Activity },
    { id: 'SURVEILLANCE_CLIMATIQUE', label: 'Climat', icon: CloudRain },
    { id: 'SURVEILLANCE_ENVIRONNEMENTALE', label: 'Environnement', icon: Layers },
    { id: 'SURVEILLANCE_WASH', label: 'WASH', icon: Droplets },
    { id: 'SIGNAUX', label: 'Signaux Algorithmiques', icon: Activity },
    { id: 'ALERTES', label: 'Alertes & Validation', icon: AlertTriangle },
    { id: 'CARTOGRAPHIE', label: 'Cartographie SIG', icon: MapPin },
    { id: 'TENDANCES', label: 'Tendances & Délais', icon: TrendingUp },
    { id: 'HISTORIQUE', label: 'Audit & Historique', icon: History },
    { id: 'RAPPORTS', label: 'Rapports 17 Sections', icon: FileText },
    { id: 'TESTS_V117', label: 'Tests V1.17 (10)', icon: FlaskConical }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Barre d'En-tête du Module V1.17 avec Contexte & Rôle */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-full font-mono font-bold text-[10px] border border-teal-200">
                MODULE V1.17 • OFFICIEL
              </span>
              <span className="text-xs font-bold text-slate-500">
                Maniema, République Démocratique du Congo
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Système de Surveillance One Health &amp; Détection des Signaux</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl">
              Intégration prospective des flux sanitaires, climatiques, environnementaux et hydriques pour l&apos;aide à la décision sans dénaturation des modèles statistiques V1.16.
            </p>
          </div>

          {/* Sélecteur de Rôle / Utilisateur Actif (RBAC) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-3 text-xs shrink-0">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800">{currentUserName}</div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] text-slate-400">Rôle :</span>
                <select
                  value={currentUserRole}
                  onChange={(e) => {
                    const role = e.target.value as UserSurveillanceRole;
                    setCurrentUserRole(role);
                    if (role === 'LECTEUR') setCurrentUserName('Observateur Public / Partenaire');
                    if (role === 'ANALYSTE') setCurrentUserName('M. Dieudonné LUMUMBA (Analyste One Health)');
                    if (role === 'SUPERVISEUR') setCurrentUserName('Dr. Jean-Paul KASONGO (Médecin Superviseur)');
                    if (role === 'ADMINISTRATEUR') setCurrentUserName('Administrateur Plateforme Maniema');
                  }}
                  className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold text-teal-800"
                >
                  <option value="LECTEUR">Lecteur (Consultation)</option>
                  <option value="ANALYSTE">Analyste (Évaluation)</option>
                  <option value="SUPERVISEUR">Superviseur (Validation Alertes)</option>
                  <option value="ADMINISTRATEUR">Administrateur (Gestion Seuils)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de Filtres Contextuels Globaux */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium">Zone de Santé :</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-bold text-xs"
              >
                <option value="TOUTES">Toutes les Zones (Kindu Urbain/Périurbain)</option>
                <option value="Kasuku">Zone de Santé Kasuku</option>
                <option value="Mikelenge">Zone de Santé Mikelenge</option>
                <option value="Alunguli">Zone de Santé Alunguli</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium">Pathologie Cible :</span>
              <select
                value={selectedPathology}
                onChange={(e) => setSelectedPathology(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-bold text-xs"
              >
                <option value="PALUDISME">Paludisme (Plasmodium falciparum)</option>
                <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde (Salmonella enterica)</option>
                <option value="MULTI_PATHOLOGIES">Toutes Pathologies One Health</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium">Période Active :</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-mono text-slate-800 font-bold text-xs"
              >
                <option value="2026-S34">Semaine 34 (Août 2026) — Active</option>
                <option value="2026-S33">Semaine 33 (Août 2026)</option>
                <option value="2026-S32">Semaine 32 (Août 2026)</option>
                <option value="2026-S31">Semaine 31 (Juillet 2026)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
            <span>Données séparées : Fictif/Validé</span>
          </div>
        </div>
      </div>

      {/* 2. Barre d'Onglets Horizontale Défilante (12 Sous-Modules) */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center space-x-1.5 min-w-max bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SurveillanceTabId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Contenu de l'Onglet Actif */}
      <div className="transition-all duration-200">
        {activeTab === 'DASHBOARD' && (
          <SurveillanceDashboardTab
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            selectedZone={selectedZone}
            selectedPathology={selectedPathology}
          />
        )}

        {activeTab === 'SURVEILLANCE_SANITAIRE' && (
          <SanitarySurveillanceTab
            selectedZone={selectedZone}
            selectedPathology={selectedPathology}
          />
        )}

        {activeTab === 'SURVEILLANCE_CLIMATIQUE' && (
          <ClimateSurveillanceTab selectedZone={selectedZone} />
        )}

        {activeTab === 'SURVEILLANCE_ENVIRONNEMENTALE' && (
          <EnvironmentalSurveillanceTab selectedZone={selectedZone} />
        )}

        {activeTab === 'SURVEILLANCE_WASH' && (
          <WashSurveillanceTab selectedZone={selectedZone} />
        )}

        {activeTab === 'SIGNAUX' && (
          <SignalsDetectionTab
            selectedZone={selectedZone}
            selectedPathology={selectedPathology}
            onSelectSignalForAlert={() => setActiveTab('ALERTES')}
          />
        )}

        {activeTab === 'ALERTES' && (
          <AlertsAndRulesTab
            selectedZone={selectedZone}
            selectedPathology={selectedPathology}
            currentUserRole={currentUserRole}
            currentUserName={currentUserName}
          />
        )}

        {activeTab === 'CARTOGRAPHIE' && (
          <SurveillanceMappingTab selectedZone={selectedZone} />
        )}

        {activeTab === 'TENDANCES' && (
          <TemporalTrendsTab selectedZone={selectedZone} />
        )}

        {activeTab === 'HISTORIQUE' && <SurveillanceHistoryAuditTab />}

        {activeTab === 'RAPPORTS' && <SurveillanceReportsTab />}

        {activeTab === 'TESTS_V117' && <SurveillanceSuiteV117Tab />}
      </div>
    </div>
  );
};
