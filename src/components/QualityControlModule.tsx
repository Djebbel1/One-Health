import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Filter,
  Search,
  RotateCcw,
  Check,
  X,
  History,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { runFullQualityAudit } from '../utils/qualityControl';
import { AuditIssue, RecordStatus } from '../types';

export const QualityControlModule: React.FC = () => {
  const {
    householdSurveys,
    environmentalObs,
    healthRecords,
    climateRecords,
    auditLogs,
    updateHouseholdSurvey,
    updateEnvironmentalObservation,
    updateHealthRecord,
    updateClimateRecord,
    userSession
  } = useData();

  const [activeTab, setActiveTab] = useState<'ISSUES' | 'WORKFLOW' | 'AUDIT_TRAIL'>('ISSUES');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Run full automated quality audit
  const auditReport = useMemo(() => {
    return runFullQualityAudit(householdSurveys, environmentalObs, healthRecords, climateRecords);
  }, [householdSurveys, environmentalObs, healthRecords, climateRecords]);

  // Filtered Issues List
  const filteredIssues = useMemo(() => {
    return auditReport.issues.filter(issue => {
      if (filterSeverity !== 'ALL' && issue.severity !== filterSeverity) return false;
      if (filterModule !== 'ALL' && issue.module !== filterModule) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          issue.recordId.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.ruleId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditReport.issues, filterSeverity, filterModule, searchQuery]);

  // Pending approval records (Status = SUBMITTED or UNDER_REVIEW)
  const pendingRecords = useMemo(() => {
    const list: {
      type: 'HOUSEHOLD' | 'ENV' | 'HEALTH' | 'CLIMATE';
      id: string;
      label: string;
      date: string;
      status: RecordStatus;
      surveyor: string;
      raw: any;
    }[] = [];

    householdSurveys
      .filter(s => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW')
      .forEach(s => list.push({
        type: 'HOUSEHOLD',
        id: s.id,
        label: `Enquête Ménage (${s.health_area_id} - ${s.street_name})`,
        date: s.survey_date,
        status: s.status,
        surveyor: s.surveyor_id,
        raw: s
      }));

    environmentalObs
      .filter(e => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW')
      .forEach(e => list.push({
        type: 'ENV',
        id: e.id,
        label: `Observation Env. (${e.factor_type} - ${e.health_area_id})`,
        date: e.observation_date,
        status: e.status,
        surveyor: e.surveyor_id,
        raw: e
      }));

    healthRecords
      .filter(h => h.status === 'SUBMITTED' || h.status === 'UNDER_REVIEW')
      .forEach(h => list.push({
        type: 'HEALTH',
        id: h.health_record_id || h.id,
        label: `Données Sanitaires (${h.disease} - ${h.structure_name})`,
        date: `${h.month}/${h.year}`,
        status: h.status,
        surveyor: h.data_source,
        raw: h
      }));

    climateRecords
      .filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW')
      .forEach(c => list.push({
        type: 'CLIMATE',
        id: c.id,
        label: `Relevé Climat (${c.station_name})`,
        date: `${c.month}/${c.year}`,
        status: c.status,
        surveyor: c.data_source,
        raw: c
      }));

    return list;
  }, [householdSurveys, environmentalObs, healthRecords, climateRecords]);

  // Supervisor Approval Actions
  const handleValidate = (record: { type: string; id: string; raw: any }) => {
    const comment = `Validation superviseur par ${userSession.name}`;
    if (record.type === 'HOUSEHOLD') {
      updateHouseholdSurvey({ ...record.raw, status: 'VALIDATED' }, comment);
    } else if (record.type === 'ENV') {
      updateEnvironmentalObservation({ ...record.raw, status: 'VALIDATED' }, comment);
    } else if (record.type === 'HEALTH') {
      updateHealthRecord({ ...record.raw, status: 'VALIDATED' }, comment);
    } else if (record.type === 'CLIMATE') {
      updateClimateRecord({ ...record.raw, status: 'VALIDATED' }, comment);
    }
  };

  const handleReject = (record: { type: string; id: string; raw: any }) => {
    const reason = prompt('Indiquez le motif du rejet ou les corrections demandées :');
    if (!reason) return;

    const comment = `Rejeté par superviseur : ${reason}`;
    if (record.type === 'HOUSEHOLD') {
      updateHouseholdSurvey({ ...record.raw, status: 'REJECTED' }, comment);
    } else if (record.type === 'ENV') {
      updateEnvironmentalObservation({ ...record.raw, status: 'REJECTED' }, comment);
    } else if (record.type === 'HEALTH') {
      updateHealthRecord({ ...record.raw, status: 'REJECTED' }, comment);
    } else if (record.type === 'CLIMATE') {
      updateClimateRecord({ ...record.raw, status: 'REJECTED' }, comment);
    }
  };

  // Bulk validate all error-free pending
  const handleBulkValidate = () => {
    if (pendingRecords.length === 0) return;
    if (confirm(`Valider l'ensemble des ${pendingRecords.length} enregistrements en attente ?`)) {
      pendingRecords.forEach(r => handleValidate(r));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quality Metric Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-700" />
              <span>Contrôle Qualité, Cohérence & Validation Scientifique</span>
            </h2>
            <p className="text-xs text-slate-500">
              Vérification automatique des règles d'intégrité, impossibilités logiques et anonymisation stricte (Zéro PII)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Score de Qualité Global :</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black font-mono ${
                auditReport.qualityScore >= 90
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : auditReport.qualityScore >= 70
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {auditReport.qualityScore}%
            </span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Total Enregistrements</span>
            <span className="text-xl font-bold text-slate-900">{auditReport.totalRecordsChecked}</span>
          </div>

          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-medium block">Enregistrements Validés</span>
            <span className="text-xl font-bold text-emerald-800">{auditReport.validatedCount}</span>
          </div>

          <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
            <span className="text-[11px] text-blue-800 font-medium block">En Attente Superviseur</span>
            <span className="text-xl font-bold text-blue-800">{pendingRecords.length}</span>
          </div>

          <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200">
            <span className="text-[11px] text-rose-800 font-medium block">Anomalies Détectées</span>
            <span className="text-xl font-bold text-rose-800">{auditReport.errorCount + auditReport.warningCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('ISSUES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'ISSUES'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Rapport d'Anomalies ({auditReport.issues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('WORKFLOW')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'WORKFLOW'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Validation des Soumissions ({pendingRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_TRAIL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'AUDIT_TRAIL'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Journal d'Audit & Traçabilité ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ISSUES REPORT */}
      {activeTab === 'ISSUES' && (
        <div className="space-y-4">
          {/* Issue Filters */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrer par ID, règle ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Toutes les gravités (Erreurs & Avertissements)</option>
                <option value="ERROR">ERROR - Incohérences bloquantes</option>
                <option value="WARNING">WARNING - Avertissements méthodologiques</option>
                <option value="INFO">INFO - Remarques informatives</option>
              </select>
            </div>

            <div>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Tous les modules de recherche</option>
                <option value="HOUSEHOLD">Enquêtes Ménages</option>
                <option value="ENVIRONMENT">Observations Environnementales</option>
                <option value="HEALTH">Données Sanitaires</option>
                <option value="CLIMATE">Données Climatiques</option>
              </select>
            </div>
          </div>

          {/* Issues Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-3.5 py-3">Gravité</th>
                    <th className="px-3.5 py-3">Module & ID Fiche</th>
                    <th className="px-3.5 py-3">Règle de Contrôle</th>
                    <th className="px-3.5 py-3">Description de l'Incohérence</th>
                    <th className="px-3.5 py-3">Valeur Constatée vs Attendue</th>
                    <th className="px-3.5 py-3">Recommandation Scientifique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <span className="font-semibold text-slate-700 block">Aucune anomalie détectée</span>
                        <span className="text-xs">Toutes les règles de cohérence et de non-extrapolation sont respectées.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              issue.severity === 'ERROR'
                                ? 'bg-rose-100 text-rose-800'
                                : issue.severity === 'WARNING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {issue.severity}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 font-bold font-mono text-slate-800">
                          {issue.recordId}
                          <span className="text-[10px] font-sans text-slate-400 block font-normal">{issue.module}</span>
                        </td>
                        <td className="px-3.5 py-2.5 font-mono text-[11px] text-indigo-900 font-semibold">
                          {issue.ruleId}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800">
                          {issue.description}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600 font-mono text-[11px]">
                          {issue.currentValue ? `${issue.currentValue} ` : ''}
                          {issue.expectedValue ? `(Attendu: ${issue.expectedValue})` : ''}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-500 text-[11px]">
                          {issue.recommendation}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SUPERVISOR VALIDATION WORKFLOW */}
      {activeTab === 'WORKFLOW' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                File d'attente des enregistrements soumis par les enquêteurs
              </h3>
              <p className="text-xs text-slate-500">
                Chaque enregistrement doit être validé ou renvoyé pour correction avec justification
              </p>
            </div>

            {pendingRecords.length > 0 && userSession.role === 'SUPERVISEUR' && (
              <button
                onClick={handleBulkValidate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <Check className="w-4 h-4" />
                <span>Valider Tout le Lot ({pendingRecords.length})</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-3.5 py-3">ID & Module</th>
                    <th className="px-3.5 py-3">Description / Contenu</th>
                    <th className="px-3.5 py-3">Date / Période</th>
                    <th className="px-3.5 py-3">Enquêteur / Source</th>
                    <th className="px-3.5 py-3">Statut Actuel</th>
                    <th className="px-3.5 py-3 text-right">Actions Superviseur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <span className="font-semibold text-slate-700 block">File de validation vide</span>
                        <span className="text-xs">Toutes les soumissions récentes ont été traitées.</span>
                      </td>
                    </tr>
                  ) : (
                    pendingRecords.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-3.5 py-2.5 font-bold font-mono text-slate-800">
                          {item.id}
                          <span className="text-[10px] font-sans text-slate-400 block font-normal">{item.type}</span>
                        </td>
                        <td className="px-3.5 py-2.5 font-medium text-slate-800">
                          {item.label}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          {item.date}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">
                          {item.surveyor}
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-right space-x-2">
                          <button
                            onClick={() => handleValidate(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-[11px] font-semibold transition shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Valider</span>
                          </button>
                          <button
                            onClick={() => handleReject(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-[11px] font-semibold transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Rejeter</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Journal d'Audit Immuable des Modifications (Conformité Recherche)
            </h3>
            <p className="text-xs text-slate-500">
              Chaque création, mise à jour de statut ou correction scientifique est archivée avec l'identité de l'opérateur
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-3.5 py-3">Horodatage (UTC)</th>
                  <th className="px-3.5 py-3">Entité & ID Fiche</th>
                  <th className="px-3.5 py-3">Action</th>
                  <th className="px-3.5 py-3">Opérateur & Rôle</th>
                  <th className="px-3.5 py-3">Justification / Commentaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      Aucun événement d'audit enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-3.5 py-2 font-mono text-[11px] text-slate-600">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-3.5 py-2 font-bold font-mono text-slate-800">
                        {log.recordId}
                        <span className="text-[10px] font-sans text-slate-400 block font-normal">{log.entityType}</span>
                      </td>
                      <td className="px-3.5 py-2">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3.5 py-2 text-slate-800 font-medium">
                        {log.userName}
                        <span className="text-[10px] text-slate-400 block">{log.userRole}</span>
                      </td>
                      <td className="px-3.5 py-2 text-slate-600">
                        {log.reason || 'Opération système'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
