import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit3,
  Trash2,
  Layers,
  Map as MapIcon,
  List,
  Target,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { HouseholdSurvey } from '../types';
import { HouseholdSurveyForm } from './HouseholdSurveyForm';
import { HouseholdSurveyList, SurveyTabFilter } from './HouseholdSurveyList';
import { HouseholdSurveyDetail } from './HouseholdSurveyDetail';
import { HouseholdSurveyMap } from './HouseholdSurveyMap';

export const HouseholdSurveyModule: React.FC = () => {
  const {
    householdSurveys,
    deleteHouseholdSurvey,
    userSession,
    isOffline
  } = useData();

  // Top View State
  const [currentView, setCurrentView] = useState<'LIST' | 'FORM' | 'DETAIL' | 'MAP'>('LIST');
  const [activeTabFilter, setActiveTabFilter] = useState<SurveyTabFilter>('ALL');
  const [selectedSurvey, setSelectedSurvey] = useState<HouseholdSurvey | null>(null);
  const [surveyToEdit, setSurveyToEdit] = useState<HouseholdSurvey | null>(null);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);

  // Target collection metrics for the university research project
  const TARGET_SAMPLE_SIZE = 400;

  const metrics = useMemo(() => {
    const total = householdSurveys.length;
    const validated = householdSurveys.filter(s => s.status === 'VALIDATED').length;
    const submitted = householdSurveys.filter(s => s.status === 'SUBMITTED').length;
    const drafts = householdSurveys.filter(s => s.status === 'DRAFT').length;
    const pendingSync = householdSurveys.filter(s => s.sync_status === 'PENDING').length;
    const percentage = Math.min(100, Math.round((total / TARGET_SAMPLE_SIZE) * 100));

    return { total, validated, submitted, drafts, pendingSync, percentage };
  }, [householdSurveys]);

  // View switch handlers
  const handleStartNewSurvey = () => {
    setSurveyToEdit(null);
    setSelectedSurvey(null);
    setCurrentView('FORM');
  };

  const handleInspectSurvey = (survey: HouseholdSurvey) => {
    setSelectedSurvey(survey);
    setCurrentView('DETAIL');
  };

  const handleEditSurvey = (survey: HouseholdSurvey) => {
    setSurveyToEdit(survey);
    setSelectedSurvey(null);
    setCurrentView('FORM');
  };

  const handleConfirmDelete = () => {
    if (surveyToDelete) {
      deleteHouseholdSurvey(surveyToDelete);
      setSurveyToDelete(null);
      if (selectedSurvey?.id === surveyToDelete) {
        setSelectedSurvey(null);
        setCurrentView('LIST');
      }
    }
  };

  const handleSaveSuccess = (survey: HouseholdSurvey) => {
    setSelectedSurvey(survey);
    setCurrentView('DETAIL');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: University Research Progress Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PROJET DE RECHERCHE KINDU (UNIKI)
              </span>
              <span className="text-xs text-slate-400">Échantillonnage épidémiologique</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Module de Collecte des Ménages (V1.1)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Enquêtes de terrain sur les facteurs d'exposition au paludisme et à la fièvre typhoïde (eau, assainissement, déchets, MILD et salubrité).
            </p>
          </div>

          {/* View Mode Switcher (List / Map / New) */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => setCurrentView('LIST')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentView === 'LIST'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Liste</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('MAP')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentView === 'MAP'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Carte SIG</span>
            </button>

            <button
              type="button"
              onClick={handleStartNewSurvey}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouvelle Enquête</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Numerical Indicators */}
        <div className="pt-2 border-t border-slate-700/60 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 font-medium">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>
                Objectif de collecte : <strong>{metrics.total} / {TARGET_SAMPLE_SIZE} ménages</strong> ({metrics.percentage}%)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="text-emerald-300 font-medium">
                ✅ Validées: <strong>{metrics.validated}</strong>
              </span>
              <span className="text-sky-300 font-medium">
                ⏳ Soumises: <strong>{metrics.submitted}</strong>
              </span>
              <span className="text-amber-300 font-medium">
                📝 Brouillons: <strong>{metrics.drafts}</strong>
              </span>
              {metrics.pendingSync > 0 && (
                <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  ⚠️ À synchroniser: {metrics.pendingSync}
                </span>
              )}
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, metrics.percentage)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {surveyToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700 font-bold">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="text-base text-slate-900">Supprimer l'enquête {surveyToDelete} ?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Êtes-vous certain de vouloir supprimer cette enquête ménage ? Cette action est irréversible et sera enregistrée dans le journal d'audit du projet.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSurveyToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conditional View Rendering */}
      {currentView === 'FORM' && (
        <HouseholdSurveyForm
          initialData={surveyToEdit}
          onSaveSuccess={handleSaveSuccess}
          onCancel={() => setCurrentView('LIST')}
          onInspectDuplicate={(dupId) => {
            const found = householdSurveys.find(s => s.id === dupId);
            if (found) {
              setSelectedSurvey(found);
              setCurrentView('DETAIL');
            }
          }}
        />
      )}

      {currentView === 'DETAIL' && selectedSurvey && (
        <HouseholdSurveyDetail
          survey={selectedSurvey}
          onBack={() => setCurrentView('LIST')}
          onEdit={(s) => {
            setSurveyToEdit(s);
            setCurrentView('FORM');
          }}
        />
      )}

      {currentView === 'MAP' && (
        <HouseholdSurveyMap
          surveys={householdSurveys}
          onSelectSurvey={(s) => {
            setSelectedSurvey(s);
            setCurrentView('DETAIL');
          }}
        />
      )}

      {currentView === 'LIST' && (
        <HouseholdSurveyList
          activeTab={activeTabFilter}
          onTabChange={setActiveTabFilter}
          onNewSurvey={handleStartNewSurvey}
          onViewSurvey={(s) => {
            setSelectedSurvey(s);
            setCurrentView('DETAIL');
          }}
          onEditSurvey={handleEditSurvey}
          onDeleteSurvey={(id) => setSurveyToDelete(id)}
        />
      )}
    </div>
  );
};
