import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Flag,
  Wrench,
  Sparkles,
  Shield,
  Layers,
  Clock,
  Check,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ProductionReadinessReport,
  FeatureFlag,
  MaintenanceConfig,
  UserRole
} from '../../types';
import { calculateProductionReadinessReport, INITIAL_PRODUCTION_CHECK_ITEMS } from '../../data/mockSecurityDataV120';

interface ProductionReadinessTabProps {
  featureFlags: FeatureFlag[];
  maintenanceConfig: MaintenanceConfig;
  currentUserRole: UserRole;
  onToggleFeatureFlag: (flagKey: string) => void;
  onUpdateMaintenanceConfig: (updates: Partial<MaintenanceConfig>) => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const ProductionReadinessTab: React.FC<ProductionReadinessTabProps> = ({
  featureFlags,
  maintenanceConfig,
  currentUserRole,
  onToggleFeatureFlag,
  onUpdateMaintenanceConfig,
  onAddSecurityLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'READINESS' | 'FEATURE_FLAGS' | 'MAINTENANCE'>('READINESS');
  const [checkItems, setCheckItems] = useState(INITIAL_PRODUCTION_CHECK_ITEMS);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    SECURITY: true,
    DATA: true,
    TECHNICAL: true,
    SCIENTIFIC: true
  });

  const report = calculateProductionReadinessReport(checkItems);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleToggleCheckItem = (id: string) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSatisfied: !item.isSatisfied } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/90 rounded-2xl max-w-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('READINESS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'READINESS'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Checklist Production ({report.overallScore}%)
        </button>
        <button
          onClick={() => setActiveSubTab('FEATURE_FLAGS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'FEATURE_FLAGS'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flag className="w-3.5 h-3.5 text-teal-600" />
          Feature Flags ({featureFlags.length})
        </button>
        <button
          onClick={() => setActiveSubTab('MAINTENANCE')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'MAINTENANCE'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          Mode Maintenance
        </button>
      </div>

      {/* SubTab 1: Production Readiness Checklist */}
      {activeSubTab === 'READINESS' && (
        <div className="space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Score d Éligibilité au Déploiement en Production (V1.20)
                </h3>
                <p className="text-xs text-slate-500">
                  Audit exhaustif des dimensions Sécurité, Données, Technique et Gouvernance Scientifique
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono ${
                    report.isProductionReady
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  Score Global : {report.overallScore}%
                </span>
              </div>
            </div>

            {/* Verdict Explanation Banner */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                report.isProductionReady
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              {report.verdictExplanation.map((v, i) => (
                <p key={i} className="leading-relaxed">
                  {v}
                </p>
              ))}
            </div>

            {/* 4 Dimension Category Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {report.categories.map((cat) => (
                <div
                  key={cat.category}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="truncate">{cat.label}</span>
                    <span className="font-mono text-emerald-700">{cat.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full"
                      style={{ width: `${cat.score}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {cat.items.filter((i) => i.isSatisfied).length} / {cat.items.length} critères
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension Details Checklists */}
          <div className="space-y-4">
            {report.categories.map((cat) => {
              const isExpanded = expandedCategories[cat.category];

              return (
                <div
                  key={cat.category}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  <div
                    onClick={() => toggleCategory(cat.category)}
                    className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                      <strong className="text-sm text-slate-900 font-bold">
                        {cat.label}
                      </strong>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {cat.score}% Conforme
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="divide-y divide-slate-100">
                      {cat.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50"
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={item.isSatisfied}
                              onChange={() => handleToggleCheckItem(item.id)}
                              className="mt-0.5 w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300 cursor-pointer"
                            />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-900">{item.title}</strong>
                                {item.blocker && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                                    Bloquant
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600">{item.description}</p>
                              <div className="text-[10px] text-emerald-800 font-medium pt-0.5">
                                ✓ {item.verificationDetails}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono self-end sm:self-center shrink-0 ${
                              item.isSatisfied
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.isSatisfied ? 'VALIDÉ' : 'À VÉRIFIER'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 2: Feature Flags Controller */}
      {activeSubTab === 'FEATURE_FLAGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-teal-700" />
                Interrupteurs de Fonctionnalités (Feature Flags)
              </h3>
              <p className="text-xs text-slate-500">
                Activation progressive des modules expérimentaux sans risque de régression
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {featureFlags.map((flag) => (
              <div
                key={flag.key}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{flag.label}</strong>
                    {flag.isExperimental && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        BETA EXPÉRIMENTAL
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        flag.impactRisk === 'FAIBLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : flag.impactRisk === 'MOYEN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Risque : {flag.impactRisk}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{flag.description}</p>
                  <span className="text-[10px] font-mono text-slate-400">
                    Clé : {flag.key} • Catégorie : {flag.category}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onToggleFeatureFlag(flag.key);
                    onAddSecurityLog(
                      'CONFIG_CHANGED',
                      `Feature flag [${flag.key}] basculé vers ${!flag.isEnabled ? 'ACTIF' : 'INACTIF'}`,
                      'INFO'
                    );
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition shrink-0 ${
                    flag.isEnabled
                      ? 'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {flag.isEnabled ? '✓ Activé' : 'Désactivé'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Maintenance Mode Scheduler */}
      {activeSubTab === 'MAINTENANCE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                Planification du Mode Maintenance & Fenêtres d Intervention
              </h3>
              <p className="text-xs text-slate-500">
                Verrouillage des écritures pendant les migrations lourdes avec contournement administrateur
              </p>
            </div>

            <button
              onClick={() => {
                const nextState = !maintenanceConfig.isMaintenanceActive;
                onUpdateMaintenanceConfig({ isMaintenanceActive: nextState });
                onAddSecurityLog(
                  'CONFIG_CHANGED',
                  `Mode maintenance ${nextState ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`,
                  nextState ? 'WARNING' : 'INFO'
                );
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                maintenanceConfig.isMaintenanceActive
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {maintenanceConfig.isMaintenanceActive
                ? 'Mode Maintenance ACTIF (Cliquez pour désactiver)'
                : 'Activer Mode Maintenance Immédiat'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Texte du Bandeau d Avertissement Utilisateur :
              </label>
              <input
                type="text"
                value={maintenanceConfig.noticeBannerText}
                onChange={(e) =>
                  onUpdateMaintenanceConfig({ noticeBannerText: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Début Planifié :</label>
                <input
                  type="text"
                  value={maintenanceConfig.scheduledStart}
                  onChange={(e) =>
                    onUpdateMaintenanceConfig({ scheduledStart: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fin Estimée :</label>
                <input
                  type="text"
                  value={maintenanceConfig.scheduledEnd}
                  onChange={(e) =>
                    onUpdateMaintenanceConfig({ scheduledEnd: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-600 pt-1 font-mono">
              Rôles autorisés en contournement (Bypass) :{' '}
              <strong className="text-indigo-900">
                {maintenanceConfig.allowedBypassRoles.join(', ')}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
