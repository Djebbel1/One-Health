import React, { useState, useMemo } from 'react';
import {
  CollectionSession,
  FieldSurvey,
  SurveyQuestionnaire,
  FieldPlanItem,
  HealthRegistryRecord,
  SurveyAuditLog,
  SessionStatus
} from '../types';
import {
  exportSessionsAsCSV,
  exportSurveyDataAsJSON
} from '../utils/surveyOperationsEngine';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  XCircle,
  FileCheck,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  MapPin,
  Calendar,
  History,
  Check,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

interface Props {
  sessions: CollectionSession[];
  surveys: FieldSurvey[];
  questionnaires: SurveyQuestionnaire[];
  fieldPlans: FieldPlanItem[];
  healthRegistries: HealthRegistryRecord[];
  auditLogs: SurveyAuditLog[];
  onValidateSession: (sessionId: string, supervisorNotes?: string) => void;
  onRequestCorrection: (sessionId: string, reason: string, targetQuestionId?: string) => void;
  onRejectSession: (sessionId: string, reason: string) => void;
  onAddComment: (sessionId: string, comment: any) => void;
  currentUserId: string;
  currentUserName: string;
}

export const SupervisionDashboard: React.FC<Props> = ({
  sessions,
  surveys,
  questionnaires,
  fieldPlans,
  healthRegistries,
  auditLogs,
  onValidateSession,
  onRequestCorrection,
  onRejectSession,
  onAddComment,
  currentUserId,
  currentUserName
}) => {
  const [selectedSurveyFilter, setSelectedSurveyFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSessionForInspection, setSelectedSessionForInspection] = useState<CollectionSession | null>(null);

  // Correction Modal State
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [correctionTargetSessionId, setCorrectionTargetSessionId] = useState<string | null>(null);
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [correctionTargetQuestion, setCorrectionTargetQuestion] = useState<string>('Q_D2_BEDNET_COUNT');

  // Supervisor validation notes
  const [validationNotes, setValidationNotes] = useState<string>('Validation de conformité terrain effectuée par le superviseur.');

  // Filtering sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      if (selectedSurveyFilter !== 'ALL' && s.surveyId !== selectedSurveyFilter) return false;
      if (selectedStatusFilter !== 'ALL' && s.status !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = s.id.toLowerCase().includes(q);
        const matchSurveyor = s.surveyorName.toLowerCase().includes(q);
        const matchAnon = s.anonymousSubjectId?.toLowerCase().includes(q);
        if (!matchId && !matchSurveyor && !matchAnon) return false;
      }
      return true;
    });
  }, [sessions, selectedSurveyFilter, selectedStatusFilter, searchQuery]);

  // KPIs
  const stats = useMemo(() => {
    const total = sessions.length;
    const submitted = sessions.filter(s => s.status === 'SOUMISE').length;
    const validated = sessions.filter(s => s.status === 'VALIDEE').length;
    const toCorrect = sessions.filter(s => s.status === 'A_CORRIGER').length;
    const rejected = sessions.filter(s => s.status === 'REJETEE').length;
    const drafts = sessions.filter(s => s.status === 'BROUILLON').length;

    const avgCompleteness =
      total > 0
        ? Math.round(sessions.reduce((acc, s) => acc + s.completenessScore, 0) / total)
        : 100;

    const gpsIssuesCount = sessions.filter(s => s.gps && s.gps.accuracy > 15).length;

    return {
      total,
      submitted,
      validated,
      toCorrect,
      rejected,
      drafts,
      avgCompleteness,
      gpsIssuesCount,
      validationRate: total > 0 ? Math.round((validated / total) * 100) : 0
    };
  }, [sessions]);

  const handleOpenCorrection = (sessionId: string) => {
    setCorrectionTargetSessionId(sessionId);
    setCorrectionReason('');
    setShowCorrectionModal(true);
  };

  const handleConfirmCorrection = () => {
    if (correctionTargetSessionId && correctionReason.trim()) {
      onRequestCorrection(correctionTargetSessionId, correctionReason, correctionTargetQuestion);
      setShowCorrectionModal(false);
      if (selectedSessionForInspection?.id === correctionTargetSessionId) {
        setSelectedSessionForInspection(null);
      }
    }
  };

  const handleValidate = (sessionId: string) => {
    onValidateSession(sessionId, validationNotes);
    if (selectedSessionForInspection?.id === sessionId) {
      setSelectedSessionForInspection(prev => (prev ? { ...prev, status: 'VALIDEE', dataTier: 'CLEANED' } : null));
    }
  };

  return (
    <div id="supervision-dashboard" className="flex flex-col gap-6">
      
      {/* Top Banner & Supervision Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Poste de Supervision & Contrôle Qualité Terrain
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Superviseur connecté : <strong className="text-slate-800">{currentUserName}</strong> — Contrôle des soumissions, demandes de corrections sans écrasement d'historique et qualification des paliers (RAW → CLEANED).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportSessionsAsCSV(filteredSessions)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportSurveyDataAsJSON(filteredSessions, 'supervision_sessions.json')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Sessions
          </span>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Toutes campagnes</span>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
            À Contrôler
          </span>
          <div className="text-2xl font-black text-blue-900">{stats.submitted}</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Soumises récentes</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Validées (Cleaned)
          </span>
          <div className="text-2xl font-black text-emerald-900">{stats.validated}</div>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {stats.validationRate}% validées
          </span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            À Corriger
          </span>
          <div className="text-2xl font-black text-amber-900">{stats.toCorrect}</div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Renvoyées terrain</span>
        </div>

        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
            Complétude Moy.
          </span>
          <div className="text-2xl font-black text-purple-900">{stats.avgCompleteness}%</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Dénominateur ajusté</span>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 shadow-sm">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
            Alertes GPS
          </span>
          <div className="text-2xl font-black text-rose-900">{stats.gpsIssuesCount}</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">&gt; 15 m précision</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher session, enquêteur, code..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedSurveyFilter}
              onChange={e => setSelectedSurveyFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Toutes les enquêtes</option>
              {surveys.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="SOUMISE">SOUMISE (À contrôler)</option>
              <option value="VALIDEE">VALIDEE</option>
              <option value="A_CORRIGER">A_CORRIGER</option>
              <option value="BROUILLON">BROUILLON</option>
              <option value="REJETEE">REJETEE</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-semibold self-end md:self-center">
          {filteredSessions.length} session(s) affichée(s)
        </span>
      </div>

      {/* Main Sessions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ID Session</th>
                <th className="py-3 px-3">Enquête / Date</th>
                <th className="py-3 px-3">Enquêteur</th>
                <th className="py-3 px-3">Sujet Anonymisé</th>
                <th className="py-3 px-3">Complétude</th>
                <th className="py-3 px-3">Qualité & GPS</th>
                <th className="py-3 px-3">Palier & Statut</th>
                <th className="py-3 px-4 text-right">Actions Superviseur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredSessions.map(session => {
                const isSelected = selectedSessionForInspection?.id === session.id;
                return (
                  <tr
                    key={session.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {session.id}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 truncate max-w-[160px]">
                        {session.surveyName}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {session.startDate} à {session.startTime}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{session.surveyorName}</div>
                      <div className="text-[10px] text-slate-400">ID: {session.surveyorId}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {session.anonymousSubjectId || 'N/A'}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              session.completenessScore >= 90
                                ? 'bg-emerald-600'
                                : session.completenessScore >= 60
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${session.completenessScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {session.completenessScore}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            session.dataQualityStatus === 'BONNE_QUALITE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : session.dataQualityStatus === 'A_VERIFIER'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {session.dataQualityStatus}
                        </span>
                        {session.gps && (
                          <span
                            className={`text-[10px] font-mono ${
                              session.gps.accuracy > 15 ? 'text-rose-600 font-bold' : 'text-slate-500'
                            }`}
                          >
                            GPS: ±{session.gps.accuracy}m
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            session.status === 'VALIDEE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : session.status === 'SOUMISE'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : session.status === 'A_CORRIGER'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : session.status === 'REJETEE'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {session.status}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 font-mono text-[9px] font-bold rounded">
                          {session.dataTier}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSessionForInspection(session)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                          title="Examiner les réponses de la session"
                        >
                          <Eye className="w-3.5 h-3.5" /> Voir
                        </button>

                        {session.status === 'SOUMISE' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleValidate(session.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                              title="Valider la session (Passage au palier CLEANED)"
                            >
                              <Check className="w-3.5 h-3.5" /> Valider
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenCorrection(session.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1"
                              title="Renvoyer pour correction terrain ciblée"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Corriger
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Detailed Inspection Drawer / Card */}
      {selectedSessionForInspection && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/40 shadow-xl flex flex-col gap-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Contrôle Superviseur de la Session {selectedSessionForInspection.id}
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded">
                    Sujet: {selectedSessionForInspection.anonymousSubjectId}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Enquête : {selectedSessionForInspection.surveyName} | Enquêteur : {selectedSessionForInspection.surveyorName} | Complétude : {selectedSessionForInspection.completenessScore}%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSessionForInspection(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Answers History if corrected */}
          {selectedSessionForInspection.previousAnswersHistory &&
            selectedSessionForInspection.previousAnswersHistory.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                  <History className="w-4 h-4 text-amber-700" />
                  Historique de Traçabilité des Corrections ({selectedSessionForInspection.previousAnswersHistory.length} révision(s) archivée(s))
                </div>
                <div className="space-y-2">
                  {selectedSessionForInspection.previousAnswersHistory.map((h, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-amber-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span>Version #{h.versionNumber} archivée le {new Date(h.modifiedAt).toLocaleString()}</span>
                        <span className="font-semibold text-amber-800">Motif : {h.correctionReason}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded">
                        Moustiquaires antérieures : {h.answers['Q_D2_BEDNET_COUNT'] ?? 'N/A'} | Fébriles : {h.answers['Q_F2_FEVER_CASES_COUNT'] ?? 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Current Answers Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Données de la Session Actuelle (Réponses saisies)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(selectedSessionForInspection.answers).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 font-mono block mb-0.5">
                    {key}
                  </span>
                  <span className="font-bold text-slate-800">
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Toolbar in Inspection Drawer */}
          {selectedSessionForInspection.status === 'SOUMISE' && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Notes de validation superviseur (archivées dans le journal d'audit)
                </label>
                <input
                  type="text"
                  value={validationNotes}
                  onChange={e => setValidationNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenCorrection(selectedSessionForInspection.id)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Demander correction
                </button>

                <button
                  type="button"
                  onClick={() => handleValidate(selectedSessionForInspection.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Valider & Qualifier (CLEANED)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Field Sampling Progress Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Progression de l’Échantillonnage par Aire de Santé (Plan de Terrain)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Objectif total : {fieldPlans.reduce((acc, p) => acc + p.plannedObservations, 0)} observations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {fieldPlans.map(plan => {
            const pct = Math.round((plan.completedObservations / plan.plannedObservations) * 100);
            return (
              <div key={plan.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{plan.geographicUnitName}</span>
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Réalisé : <strong>{plan.completedObservations}</strong> / {plan.plannedObservations}</span>
                  <span>Validé : <strong className="text-emerald-700">{plan.validatedObservations}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-md w-full animate-in fade-in">
            <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Demande de Correction Supervisée (Traçable)
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              L'ancienne réponse ne sera jamais écrasée silencieusement : elle sera archivée dans <code>previousAnswersHistory</code> avec horodatage et identifiant du superviseur.
            </p>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Question ciblée par l'anomalie
                </label>
                <select
                  value={correctionTargetQuestion}
                  onChange={e => setCorrectionTargetQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="Q_D2_BEDNET_COUNT">Q_D2_BEDNET_COUNT (Nombre moustiquaires)</option>
                  <option value="Q_F2_FEVER_CASES_COUNT">Q_F2_FEVER_CASES_COUNT (Nombre fébriles)</option>
                  <option value="Q_C1_PRIMARY_WATER_SOURCE">Q_C1_PRIMARY_WATER_SOURCE (Source eau)</option>
                  <option value="GPS_POINT">GPS_POINT (Coordonnées satellite)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Motif scientifique de la demande de correction *
                </label>
                <textarea
                  rows={3}
                  value={correctionReason}
                  onChange={e => setCorrectionReason(e.target.value)}
                  placeholder="ex: Incohérence entre nombre de moustiquaires et taille du ménage, merci de re-vérifier avec le chef de ménage."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!correctionReason.trim()}
                onClick={handleConfirmCorrection}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg shadow-sm"
              >
                Renvoyer pour correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
