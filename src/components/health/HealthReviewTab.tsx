import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  Layers,
  FileText,
  UserCheck,
  History,
  GitMerge,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { HealthRecord, RecordStatus, DiseaseType, DiagnosticStatus, HealthRecordCorrection } from '../../types';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';
import { auditHealthRecord, findHealthDuplicateClusters } from '../../utils/qualityControl';

export const HealthReviewTab: React.FC = () => {
  const {
    healthRecords,
    updateHealthRecord,
    deleteHealthRecord,
    recordHealthCorrection,
    resolveHealthDuplicate,
    userSession
  } = useData();

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDisease, setFilterDisease] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAnomalies, setOnlyAnomalies] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'LIST' | 'DUPLICATES' | 'CORRECTIONS_LOG'>('LIST');

  // Selected for Edit / Correction
  const [selectedRecordForCorrection, setSelectedRecordForCorrection] = useState<HealthRecord | null>(null);
  const [correctionField, setCorrectionField] = useState<string>('cases');
  const [correctionValue, setCorrectionValue] = useState<any>('');
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [correctionError, setCorrectionError] = useState<string>('');

  // Selected for detail view
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<HealthRecord | null>(null);

  // Detect duplicates across all records
  const duplicateGroups = useMemo(() => {
    return findHealthDuplicateClusters(healthRecords);
  }, [healthRecords]);

  // Audit all records to flag anomalies
  const recordsWithAudit = useMemo(() => {
    return healthRecords.map(r => {
      const issues = auditHealthRecord(r);
      return {
        record: r,
        issues,
        hasAnomalies: issues.length > 0,
      };
    });
  }, [healthRecords]);

  // Filtered records
  const filteredData = useMemo(() => {
    return recordsWithAudit.filter(({ record, hasAnomalies }) => {
      if (onlyAnomalies && !hasAnomalies && !record.isPotentialDuplicate) return false;
      if (filterStatus !== 'ALL' && record.status !== filterStatus) return false;
      if (filterDisease !== 'ALL' && record.disease !== filterDisease) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          record.id.toLowerCase().includes(q) ||
          record.health_area_id.toLowerCase().includes(q) ||
          (record.facility_name || record.structure_name || '').toLowerCase().includes(q) ||
          record.disease.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [recordsWithAudit, onlyAnomalies, filterStatus, filterDisease, searchQuery]);

  // Handle Quick Status Change
  const handleStatusChange = (record: HealthRecord, newStatus: RecordStatus, reason?: string) => {
    const updated: HealthRecord = {
      ...record,
      status: newStatus,
      validated_by: newStatus === 'VALIDATED' ? userSession.name || 'Superviseur' : record.validated_by,
      validated_at: newStatus === 'VALIDATED' ? new Date().toISOString() : record.validated_at,
    };
    updateHealthRecord(updated, reason || `Changement de statut sanitaire vers : ${newStatus}`);
  };

  // Open correction modal
  const openCorrectionModal = (record: HealthRecord) => {
    setSelectedRecordForCorrection(record);
    setCorrectionField('cases');
    setCorrectionValue(record.cases);
    setCorrectionReason('');
    setCorrectionError('');
  };

  // Save Unit Correction
  const handleSaveCorrection = () => {
    if (!selectedRecordForCorrection) return;
    if (!correctionReason.trim() || correctionReason.trim().length < 5) {
      setCorrectionError('Le motif de correction est obligatoire (minimum 5 caractères) pour la traçabilité.');
      return;
    }

    const originalVal = (selectedRecordForCorrection as any)[correctionField];
    let parsedVal = correctionValue;
    if (correctionField === 'cases' || correctionField === 'hospitalizations' || correctionField === 'deaths' || correctionField === 'year' || correctionField === 'month') {
      if (correctionValue === 'UNKNOWN') {
        parsedVal = 'UNKNOWN';
      } else {
        parsedVal = Number(correctionValue);
        if (isNaN(parsedVal)) {
          setCorrectionError('Valeur numérique invalide.');
          return;
        }
      }
    }

    recordHealthCorrection(
      selectedRecordForCorrection.id,
      correctionField,
      originalVal,
      parsedVal,
      correctionReason
    );

    setSelectedRecordForCorrection(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Contrôle Qualité, Validation & Arbitrage Sanitaire (V1.3)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Traçabilité des corrections, détection des anomalies épidémiologiques et arbitrage des doublons
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('LIST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'LIST' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fiches à contrôler ({healthRecords.filter(r => r.status !== 'VALIDATED').length})
            </button>

            <button
              onClick={() => setActiveSubTab('DUPLICATES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'DUPLICATES' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Doublons ({duplicateGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('CORRECTIONS_LOG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeSubTab === 'CORRECTIONS_LOG' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Journal des Corrections</span>
            </button>
          </div>
        </div>

        {/* Filters if in LIST sub-tab */}
        {activeSubTab === 'LIST' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par ID, structure, aire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Tous les statuts de validation</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW (À examiner)</option>
                <option value="IMPORTED">IMPORTED (Importé brut)</option>
                <option value="DRAFT">DRAFT (Brouillon)</option>
                <option value="CORRECTED">CORRECTED (Corrigé)</option>
                <option value="VALIDATED">VALIDATED (Validé)</option>
                <option value="REJECTED">REJECTED (Rejeté)</option>
              </select>
            </div>

            <div>
              <select
                value={filterDisease}
                onChange={(e) => setFilterDisease(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Toutes pathologies (Palu / Typhoïde)</option>
                <option value="PALUDISME">Paludisme</option>
                <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-300 w-full">
                <input
                  type="checkbox"
                  checked={onlyAnomalies}
                  onChange={(e) => setOnlyAnomalies(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span>Afficher uniquement les anomalies</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 1. SUB-TAB: LIST OF RECORDS TO REVIEW */}
      {activeSubTab === 'LIST' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5">ID Fiche</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3">Structure & Aire</th>
                    <th className="py-3 px-3">Période</th>
                    <th className="py-3 px-3">Pathologie</th>
                    <th className="py-3 px-2 text-right">Cas</th>
                    <th className="py-3 px-2 text-right">Hosp</th>
                    <th className="py-3 px-2 text-right">Décès</th>
                    <th className="py-3 px-3">Anomalies / Qualité</th>
                    <th className="py-3 px-3.5 text-right">Actions de Contrôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500">
                        Aucune fiche sanitaire ne correspond à vos filtres actuels.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map(({ record, issues, hasAnomalies }) => (
                      <tr key={record.id} className={hasAnomalies ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50'}>
                        <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900">
                          {record.health_record_id || record.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            record.status === 'VALIDATED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : record.status === 'UNDER_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : record.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : record.status === 'CORRECTED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">{record.facility_name || record.structure_name}</div>
                          <div className="text-[10px] text-slate-500">{record.health_area_id}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">
                          {String(record.month).padStart(2, '0')}/{record.year}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            record.disease === 'PALUDISME' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {record.disease}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900">{record.cases}</td>
                        <td className="py-2.5 px-2 text-right text-slate-600">
                          {record.hospitalizations === 'UNKNOWN' ? 'INCONNU' : record.hospitalizations}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-600">
                          {record.deaths === 'UNKNOWN' ? 'INCONNU' : record.deaths}
                        </td>
                        <td className="py-2.5 px-3">
                          {hasAnomalies ? (
                            <div className="space-y-0.5">
                              {issues.map((iss, i) => (
                                <div key={i} className="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{iss.title || iss.description}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Correction Button */}
                            <button
                              onClick={() => openCorrectionModal(record)}
                              className="p-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition"
                              title="Corriger une valeur avec motif obligatoire"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Validate Button */}
                            {record.status !== 'VALIDATED' && (
                              <button
                                onClick={() => handleStatusChange(record, 'VALIDATED')}
                                className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                                title="Valider cette fiche sanitaire"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Reject Button */}
                            {record.status !== 'REJECTED' && (
                              <button
                                onClick={() => {
                                  const r = prompt('Motif du rejet de la fiche sanitaire :');
                                  if (r) handleStatusChange(record, 'REJECTED', r);
                                }}
                                className="p-1 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                                title="Rejeter la fiche"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Details */}
                            <button
                              onClick={() => setSelectedRecordDetail(record)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                              title="Voir tous les détails"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* 2. SUB-TAB: DUPLICATES ARBITRATION */}
      {activeSubTab === 'DUPLICATES' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900">Module d'Arbitrage des Doublons Sanitaires</h4>
              <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                Les doublons sont identifiés selon la clé composite stricte : Aire de santé + Structure + Pathologie + Période (Mois/Année) + Groupe d'âge + Sexe + Classification.
                Vous pouvez arbitrer manuellement chaque paire.
              </p>
            </div>
          </div>

          {duplicateGroups.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Aucun doublon sanitaire détecté</h3>
              <p className="text-xs text-slate-500">Toutes les fiches sanitaires de la base possèdent une clé unique.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicateGroups.map((group, gIdx) => (
                <div key={gIdx} className="bg-white rounded-xl border border-amber-300 shadow-xs p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <GitMerge className="w-4 h-4 text-amber-600" />
                      <span>Groupe de Doublon #{gIdx + 1} ({group.records.length} fiches)</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Clé : {group.compositeKey}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.records.map((rec) => (
                      <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">{rec.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            {rec.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                          <div>Cas : <strong className="text-slate-900">{rec.cases}</strong></div>
                          <div>Hosp : <strong>{rec.hospitalizations}</strong></div>
                          <div>Décès : <strong>{rec.deaths}</strong></div>
                          <div>Source : <strong>{rec.data_source_type || rec.data_source}</strong></div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => resolveHealthDuplicate(rec.id, 'IGNORED')}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded transition"
                          >
                            Conserver (Ignorer)
                          </button>
                          <button
                            onClick={() => resolveHealthDuplicate(rec.id, 'DELETED')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-TAB: CORRECTIONS AUDIT TRAIL LOG */}
      {activeSubTab === 'CORRECTIONS_LOG' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Registre d'Audit des Corrections de Données Sanitaires</span>
            </h3>
            <p className="text-xs text-slate-500">
              Historique inaltérable de toutes les rectifications effectuées sur les fiches (V1.3)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Fiche ID</th>
                  <th className="py-2.5 px-3">Champ Modifié</th>
                  <th className="py-2.5 px-3">Valeur Initiale</th>
                  <th className="py-2.5 px-3">Valeur Rectifiée</th>
                  <th className="py-2.5 px-4">Motif de la Correction</th>
                  <th className="py-2.5 px-3">Auteur</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {healthRecords.flatMap(r => r.corrections || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      Aucune correction manuelle n'a encore été enregistrée.
                    </td>
                  </tr>
                ) : (
                  healthRecords.flatMap(r => r.corrections || []).map((cor) => (
                    <tr key={cor.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{cor.record_id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{cor.field_name}</td>
                      <td className="py-2.5 px-3 text-rose-600 line-through">{cor.original_value || 'vide'}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{cor.corrected_value}</td>
                      <td className="py-2.5 px-4 text-slate-700 italic">{cor.correction_reason}</td>
                      <td className="py-2.5 px-3 text-slate-600">{cor.corrected_by}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                        {new Date(cor.corrected_at).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: UNIT CORRECTION WITH MANDATORY REASON */}
      {selectedRecordForCorrection && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Corriger la Fiche Sanitaire : {selectedRecordForCorrection.id}</span>
              </h3>
              <button
                onClick={() => setSelectedRecordForCorrection(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Champ à corriger
                </label>
                <select
                  value={correctionField}
                  onChange={(e) => {
                    const f = e.target.value;
                    setCorrectionField(f);
                    setCorrectionValue((selectedRecordForCorrection as any)[f]);
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-medium"
                >
                  <option value="cases">Nombre de cas déclarés</option>
                  <option value="hospitalizations">Hospitalisations</option>
                  <option value="deaths">Décès déclarés</option>
                  <option value="case_classification">Classification du cas</option>
                  <option value="diagnostic_method">Méthode de diagnostic</option>
                  <option value="disease">Pathologie (Paludisme / Typhoïde)</option>
                  <option value="age_group">Groupe d'âge</option>
                  <option value="source_reference">Référence du registre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nouvelle Valeur Rectifiée
                </label>
                <input
                  type="text"
                  value={correctionValue}
                  onChange={(e) => setCorrectionValue(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif Obligatoire de la Correction <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Rectification suite à recomptage du registre des hospitalisations du mois d'avril..."
                  value={correctionReason}
                  onChange={(e) => {
                    setCorrectionReason(e.target.value);
                    if (correctionError) setCorrectionError('');
                  }}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
                {correctionError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{correctionError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecordForCorrection(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Correction</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL VIEW */}
      {selectedRecordDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-600" />
                <span>Fiche Sanitaire Détaillée : {selectedRecordDetail.id}</span>
              </h3>
              <button
                onClick={() => setSelectedRecordDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Structure</span>
                <p className="font-bold text-slate-800">{selectedRecordDetail.facility_name || selectedRecordDetail.structure_name}</p>
                <p className="text-slate-600">Aire : {selectedRecordDetail.health_area_id}</p>
                <p className="text-slate-600">Zone : {selectedRecordDetail.zone_id}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Période & Pathologie</span>
                <p className="font-bold text-rose-700">{selectedRecordDetail.disease}</p>
                <p className="text-slate-700">Mois/Année : {selectedRecordDetail.month}/{selectedRecordDetail.year}</p>
                <p className="text-slate-700">Statut : <strong>{selectedRecordDetail.status}</strong></p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Chiffres Déclarés</span>
                <p className="text-slate-800">Cas : <strong className="text-slate-900">{selectedRecordDetail.cases}</strong></p>
                <p className="text-slate-800">Hospitalisations : <strong>{selectedRecordDetail.hospitalizations}</strong></p>
                <p className="text-slate-800">Décès : <strong>{selectedRecordDetail.deaths}</strong></p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Méthode & Source</span>
                <p className="text-slate-700">Méthode : {selectedRecordDetail.diagnostic_method || 'N/A'}</p>
                <p className="text-slate-700">Classification : {selectedRecordDetail.case_classification || 'CONFIRME'}</p>
                <p className="text-slate-700">Source : {selectedRecordDetail.data_source_type || selectedRecordDetail.data_source}</p>
              </div>
            </div>

            {selectedRecordDetail.notes && (
              <div className="p-3 bg-slate-50 rounded-lg text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Observations</span>
                <p className="text-slate-800 mt-1">{selectedRecordDetail.notes}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecordDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
