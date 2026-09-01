import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Lock,
  RotateCcw,
  UserCheck,
  FileCheck,
  Edit2,
  Trash2,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RecordValidationWorkflow, RecordCorrectionEntry, RecordLifecycleStatus } from '../../types';

interface MultiLevelValidationTabProps {
  records: RecordValidationWorkflow[];
  onUpdateRecordStatus: (recordId: string, status: RecordLifecycleStatus, level?: number, reason?: string) => void;
  onAddCorrection: (recordId: string, correction: RecordCorrectionEntry) => void;
  onToggleLogicalDelete: (recordId: string, reason: string) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const MultiLevelValidationTab: React.FC<MultiLevelValidationTabProps> = ({
  records,
  onUpdateRecordStatus,
  onAddCorrection,
  onToggleLogicalDelete,
  onAddAuditLog
}) => {
  const [selectedRecord, setSelectedRecord] = useState<RecordValidationWorkflow>(records[0]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctField, setCorrectField] = useState('cases_count');
  const [correctOldVal, setCorrectOldVal] = useState('14');
  const [correctNewVal, setCorrectNewVal] = useState('12');
  const [correctReason, setCorrectReason] = useState('');

  const handleValidateLevel = (level: number) => {
    if (!selectedRecord) return;
    const nextStatus: RecordLifecycleStatus = level === 4 ? 'VERROUILLEE' : 'VALIDEE';
    onUpdateRecordStatus(selectedRecord.recordId, nextStatus, level);
    onAddAuditLog('VALIDATION_ETAPE', `Validation Niveau ${level} accordée pour la fiche ${selectedRecord.recordId}`, {
      recordId: selectedRecord.recordId,
      level
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onUpdateRecordStatus(selectedRecord.recordId, 'REJETEE', undefined, rejectReason);
    onAddAuditLog('REJET_FICHE', `Rejet de la fiche ${selectedRecord.recordId} : ${rejectReason}`, {
      recordId: selectedRecord.recordId,
      reason: rejectReason
    });
    setShowRejectModal(false);
    setRejectReason('');
  };

  const handleApplyCorrection = () => {
    if (!correctReason.trim() || !correctNewVal.trim()) return;

    const newCorrection: RecordCorrectionEntry = {
      field: correctField,
      oldValue: correctOldVal,
      newValue: correctNewVal,
      user: 'Dr. Jean-Pierre Mukendi (Superviseur)',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: correctReason
    };

    onAddCorrection(selectedRecord.recordId, newCorrection);
    onAddAuditLog('CORRECTION_VALEUR', `Correction du champ ${correctField} sur fiche ${selectedRecord.recordId} (${correctOldVal} -> ${correctNewVal})`, {
      field: correctField,
      reason: correctReason
    });
    setShowCorrectionModal(false);
    setCorrectReason('');
  };

  const handleToggleDelete = () => {
    const isCurrentlyDeleted = selectedRecord.isLogicallyDeleted;
    const reason = isCurrentlyDeleted
      ? 'Restauration après vérification administrative.'
      : 'Suppression logique : doublon de saisie terrain avéré.';
    onToggleLogicalDelete(selectedRecord.recordId, reason);
    onAddAuditLog(
      isCurrentlyDeleted ? 'RESTAURATION_FICHE' : 'SUPPRESSION_LOGIQUE_FICHE',
      `${isCurrentlyDeleted ? 'Restauration' : 'Suppression logique'} de la fiche ${selectedRecord.recordId}`,
      { reason }
    );
  };

  const getStatusBadge = (status: RecordLifecycleStatus) => {
    switch (status) {
      case 'RAW': return 'bg-slate-100 text-slate-700';
      case 'EN_CONTROLE': return 'bg-sky-100 text-sky-800';
      case 'CORRIGEE': return 'bg-amber-100 text-amber-800 font-semibold';
      case 'VALIDEE': return 'bg-emerald-100 text-emerald-800 font-bold';
      case 'VERROUILLEE': return 'bg-teal-900 text-white font-bold';
      case 'REJETEE': return 'bg-rose-100 text-rose-800 font-bold';
      case 'ARCHIVEE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Validation Multi-Niveaux & Traçabilité des Corrections</h3>
            <p className="text-xs text-slate-500">
              Pipeline 4 niveaux (Technique ➔ Terrain ➔ Scientifique ➔ Verrouillage) et suppression logique réversible
            </p>
          </div>
        </div>
      </div>

      {/* 4-Level Pipeline Visual Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Pipeline de Validation à 4 Niveaux de Responsabilité
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Niveau 1</span>
            <h5 className="font-bold text-slate-900">Automatique & Technique</h5>
            <p className="text-slate-600 text-xs">Format, types, plages et complétude.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1 text-xs sm:text-sm">
            <span className="text-xs font-bold text-sky-600 uppercase">Niveau 2</span>
            <h5 className="font-bold text-sky-950">Superviseur de Terrain</h5>
            <p className="text-sky-700 text-xs">Cohérence enquêteur, GPS et fiches papier.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-1 text-xs sm:text-sm">
            <span className="text-xs font-bold text-teal-700 uppercase">Niveau 3</span>
            <h5 className="font-bold text-teal-950">Épidémiologiste Coordinateur</h5>
            <p className="text-teal-700 text-xs">Conformité définition de cas et biologie.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1 text-xs sm:text-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase">Niveau 4</span>
            <h5 className="font-bold text-emerald-950">Direction Provinciale (DPS)</h5>
            <p className="text-emerald-700 text-xs">Verrouillage et publication officielle.</p>
          </div>
        </div>
      </div>

      {/* Main Workflow & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Records Queue */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            File des Fiches en Processus de Validation
          </h4>
          <div className="space-y-3">
            {records.map((rec) => {
              const isSelected = selectedRecord.recordId === rec.recordId;
              return (
                <div
                  key={rec.recordId}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  } ${rec.isLogicallyDeleted ? 'opacity-50 line-through bg-rose-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded">
                          {rec.recordId}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusBadge(rec.status)}`}>
                          {rec.status}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 mt-1.5">
                        {rec.surveyCode} • {rec.healthArea}
                      </h5>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Enquêteur : {rec.investigator}</span>
                    <span>Niveau {rec.currentValidationLevel}/4</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Record Detailed Validation Workflow & Corrections */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    {selectedRecord.recordId}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${getStatusBadge(selectedRecord.status)}`}>
                    Statut : {selectedRecord.status}
                  </span>
                  {selectedRecord.isLogicallyDeleted && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      SUPPRIMÉE LOGIQUEMENT
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  Fiche {selectedRecord.surveyCode} — Aire de Santé : {selectedRecord.healthArea}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Collectée le {selectedRecord.submissionDate} par {selectedRecord.investigator}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                  Corriger une Valeur
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Rejeter
                </button>
                <button
                  onClick={handleToggleDelete}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border ${
                    selectedRecord.isLogicallyDeleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-rose-700 border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  {selectedRecord.isLogicallyDeleted ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurer
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Suppression Logique
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Validation Levels Progression */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                État des Niveaux de Validation
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRecord.levels.map((lvl) => (
                  <div
                    key={lvl.level}
                    className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
                      lvl.validated
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        Niveau {lvl.level} : {lvl.label}
                      </span>
                      {lvl.validated ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <button
                          onClick={() => handleValidateLevel(lvl.level)}
                          className="px-2.5 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
                        >
                          Valider Niveau {lvl.level}
                        </button>
                      )}
                    </div>

                    {lvl.validated ? (
                      <div className="text-xs text-emerald-800">
                        Validé par <strong>{lvl.validatedBy}</strong> le {lvl.validatedAt}
                        {lvl.notes && <p className="italic text-slate-600 mt-1">« {lvl.notes} »</p>}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">En attente de revue formelle.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Traceability: Correction History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-teal-600" />
                  Journal d Audit des Corrections de Valeurs ({selectedRecord.correctionHistory.length})
                </h5>
              </div>

              {selectedRecord.correctionHistory.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs italic">
                  Aucune modification manuelle apportée. Les valeurs sont intactes par rapport à la saisie brute initiale.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRecord.correctionHistory.map((c) => (
                    <div key={c.correctionId} className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs sm:text-sm space-y-1 text-amber-950">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                            {c.field}
                          </span>
                          <span>
                            <span className="line-through text-slate-500">{c.oldValue}</span> ➔ <strong className="text-emerald-700">{c.newValue}</strong>
                          </span>
                        </div>
                        <span className="text-slate-500 font-mono text-xs">{c.correctedAt}</span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                        <span>Par : {c.correctedBy}</span>
                        <span className="italic">Motif : « {c.reason} »</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: CORRIGER UNE VALEUR AVEC JUSTIFICATION */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-800">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-bold text-base">Correction Traçable de Valeur</h3>
              </div>
              <button onClick={() => setShowCorrectionModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                Toute modification remplace la valeur analytique mais conserve l'ancienne valeur et le motif dans l'audit log.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Champ à Corriger</label>
                <input
                  type="text"
                  value={correctField}
                  onChange={(e) => setCorrectField(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ancienne Valeur</label>
                  <input
                    type="text"
                    value={correctOldVal}
                    onChange={(e) => setCorrectOldVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nouvelle Valeur</label>
                  <input
                    type="text"
                    value={correctNewVal}
                    onChange={(e) => setCorrectNewVal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif Scientifique / Technique Obligatoire</label>
                <textarea
                  rows={2}
                  value={correctReason}
                  onChange={(e) => setCorrectReason(e.target.value)}
                  placeholder="Ex : Erreur typographique de saisie vérifiée sur le registre papier..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => setShowCorrectionModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                Annuler
              </button>
              <button
                onClick={handleApplyCorrection}
                disabled={!correctReason.trim() || !correctNewVal.trim()}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Appliquer et Journaliser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MOTIF DE REJET */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">Rejet de la Fiche de Collecte</h3>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif Détaillé du Rejet</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex : Données aberrantes non documentées, suspicion d inversion d échantillons..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
