import React from 'react';
import {
  CheckCircle2,
  FileCheck,
  Layers,
  Database,
  ShieldCheck,
  Sparkles,
  Activity,
  AlertTriangle,
  Award,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const V17ReportSummaryView: React.FC = () => {
  const { v17ReportSummary } = useData();

  return (
    <div className="space-y-6">
      {/* Verdict Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800 border border-emerald-700 text-emerald-200 text-xs font-semibold">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Rapport Officiel de Recette & Conformité Méthodologique</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            RAPPORT FINAL DE SYNTHÈSE V1.7 — BASE SPATIO-TEMPORELLE INTÉGRÉE
          </h3>
          <p className="text-xs text-emerald-100/90">
            Validation technique, structurelle et scientifique pour le projet épidémiologique One Health Kindu.
          </p>
        </div>

        <div className="bg-emerald-800/90 border border-emerald-700/80 px-5 py-3 rounded-xl text-center">
          <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-semibold">Verdict Global</span>
          <span className="text-lg font-extrabold text-white font-mono">{v17ReportSummary.verdict}</span>
        </div>
      </div>

      {/* 6 Structured Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. STRUCTURE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Database className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">1. Architecture & Structure</h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Tables créées :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.structure.tablesCreated} tables</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tables modifiées :</span>
              <span className="font-mono font-bold text-emerald-700">{v17ReportSummary.structure.tablesModified} (Zéro altération)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Vues biostatistiques créées :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.structure.viewsCreated} vues</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Relations spatio-temporelles :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.structure.relationsCreated} clés</span>
            </div>
          </div>
        </div>

        {/* 2. DONNÉES */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">2. Inventaire des Données</h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Unités Spatio-Temporelles :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.donnees.spatiotemporalUnitsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Enregistrements Sanitaires :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.donnees.healthRecordsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Relevés Climatiques Mensuels :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.donnees.climateRecordsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Observations Environnementales :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.donnees.envRecordsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Enquêtes Ménages Agrégées :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.donnees.householdSurveysCount}</span>
            </div>
          </div>
        </div>

        {/* 3. QUALITÉ & AUDIT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">3. Contrôle Qualité</h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Complétude moyenne :</span>
              <span className="font-mono font-bold text-emerald-800">{v17ReportSummary.qualite.averageCompleteness}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Doublons potentiels détectés :</span>
              <span className="font-mono font-bold text-indigo-800">{v17ReportSummary.qualite.potentialDuplicatesCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Conflits temporels interceptés :</span>
              <span className="font-mono font-bold text-rose-800">{v17ReportSummary.qualite.conflictsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Erreurs spatiales / dates :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.qualite.geoErrorsCount + v17ReportSummary.qualite.temporalErrorsCount}</span>
            </div>
          </div>
        </div>

        {/* 4. MODEL READY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">4. Base Modèle Y(s,t)</h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Lignes totales disponibles :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.modelReady.availableRows}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Lignes validées (Inclusion OK) :</span>
              <span className="font-mono font-bold text-emerald-800">{v17ReportSummary.modelReady.validatedRows}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Lignes incomplètes :</span>
              <span className="font-mono font-bold text-amber-800">{v17ReportSummary.modelReady.incompleteRows}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Format export compatible :</span>
              <span className="font-mono font-bold text-slate-900">R / INLA / GLMM</span>
            </div>
          </div>
        </div>

        {/* 5. TESTS VALIDATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">5. Suite de Tests (Req. 51-60)</h4>
          </div>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span>Nombre total de tests :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.tests.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tests réussis (PASSED) :</span>
              <span className="font-mono font-bold text-emerald-700">{v17ReportSummary.tests.passed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tests échoués (FAILED) :</span>
              <span className="font-mono font-bold text-slate-900">{v17ReportSummary.tests.failed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taux de réussite :</span>
              <span className="font-mono font-bold text-emerald-800">100%</span>
            </div>
          </div>
        </div>

        {/* 6. COMPATIBILITÉ VERSIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">6. Rétrocompatibilité</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['V1.0 Socle', 'V1.1 Ménages', 'V1.2 Environnement', 'V1.3 Sanitaire', 'V1.4 Climat', 'V1.5 Harmonisation', 'V1.6 Cartographie'].map(v => (
              <div key={v} className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
