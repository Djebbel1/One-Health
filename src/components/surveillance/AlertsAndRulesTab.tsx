import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_ALERTS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  SurveillanceAlert,
  SurveillanceAlertLevel,
  SurveillanceAlertStatus,
  SignalVerificationAction,
  UserSurveillanceRole
} from '../../types';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  HelpCircle,
  Layers,
  Calendar,
  Eye,
  Info,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';

interface AlertsAndRulesTabProps {
  selectedZone: string;
  selectedPathology: string;
  currentUserRole?: UserSurveillanceRole;
  currentUserName?: string;
}

export const AlertsAndRulesTab: React.FC<AlertsAndRulesTabProps> = ({
  selectedZone,
  selectedPathology,
  currentUserRole = 'SUPERVISEUR',
  currentUserName = 'Dr. Jean-Paul KASONGO'
}) => {
  const [alerts, setAlerts] = useState<SurveillanceAlert[]>(MOCK_SURVEILLANCE_ALERTS_V117);
  const [selectedAlert, setSelectedAlert] = useState<SurveillanceAlert>(alerts[0]);
  
  // Modal de validation humaine
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationAction, setVerificationAction] = useState<SignalVerificationAction>('CONFIRMER');
  const [justificationText, setJustificationText] = useState<string>('');
  const [reviewerNotesText, setReviewerNotesText] = useState<string>('');
  const [additionalDataReq, setAdditionalDataReq] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const handleOpenVerification = (alert: SurveillanceAlert) => {
    setSelectedAlert(alert);
    setJustificationText(alert.humanVerification.mandatoryJustification || '');
    setReviewerNotesText(alert.humanVerification.reviewerNotes || '');
    setVerificationAction(alert.humanVerification.actionTaken || 'CONFIRMER');
    setValidationError('');
    setIsVerifying(true);
  };

  const handleSaveVerification = () => {
    if (!justificationText.trim()) {
      setValidationError('La justification humaine est strictement obligatoire pour toute action de vérification.');
      return;
    }

    let newStatus: SurveillanceAlertStatus = 'EN_VERIFICATION';
    if (verificationAction === 'CONFIRMER') newStatus = 'CONFIRMEE';
    if (verificationAction === 'REJETER') newStatus = 'REJETEE';
    if (verificationAction === 'METTRE_EN_OBSERVATION') newStatus = 'EN_VERIFICATION';
    if (verificationAction === 'DEMANDER_DONNEES_SUPPLEMENTAIRES') newStatus = 'EN_VERIFICATION';

    const updatedAlert: SurveillanceAlert = {
      ...selectedAlert,
      status: newStatus,
      humanVerification: {
        actionTaken: verificationAction,
        verifiedBy: currentUserName,
        verifierRole: currentUserRole,
        verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        mandatoryJustification: justificationText,
        reviewerNotes: reviewerNotesText,
        additionalDataRequested: additionalDataReq ? [additionalDataReq] : selectedAlert.humanVerification.additionalDataRequested
      },
      historyTimeline: [
        ...selectedAlert.historyTimeline,
        {
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: currentUserName,
          role: currentUserRole,
          action: `Action humaine : ${verificationAction}`,
          previousStatus: selectedAlert.status,
          newStatus: newStatus,
          comment: justificationText
        }
      ]
    };

    setAlerts((prev) => prev.map((a) => (a.id === updatedAlert.id ? updatedAlert : a)));
    setSelectedAlert(updatedAlert);
    setIsVerifying(false);
  };

  const getAlertBadge = (level: SurveillanceAlertLevel) => {
    switch (level) {
      case 'NIVEAU_3_MAJEURE':
        return (
          <span className="px-2.5 py-1 bg-red-600 text-white rounded-full font-mono font-bold text-[10px]">
            Niveau 3 — Alerte Majeure
          </span>
        );
      case 'NIVEAU_2_ALERTE':
        return (
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-mono font-bold text-[10px]">
            Niveau 2 — Alerte
          </span>
        );
      case 'NIVEAU_1_VIGILANCE':
        return (
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-mono font-bold text-[10px]">
            Niveau 1 — Vigilance
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono font-bold text-[10px]">
            Niveau 0 — Normal
          </span>
        );
    }
  };

  const getStatusBadge = (status: SurveillanceAlertStatus) => {
    switch (status) {
      case 'CONFIRMEE':
        return <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full text-[10px]">Confirmée</span>;
      case 'EN_VERIFICATION':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">En Vérification</span>;
      case 'REJETEE':
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-full text-[10px]">Rejetée (Faux Positif)</span>;
      case 'CLOTUREE':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">Clôturée</span>;
      default:
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px]">Nouvelle</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du Module Alertes & Rôles */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Gestion des Alertes Potentielles &amp; Validation Humaine
            </h2>
            <p className="text-xs text-slate-500">
              Règles multi-critères One Health, décision humaine obligatoire et historique d&apos;audit
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Utilisateur actif :</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold font-mono border border-slate-200">
            {currentUserName} ({currentUserRole})
          </span>
        </div>
      </div>

      {/* Vue 2 Colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne Gauche : Liste des Alertes (5/12) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Dossiers d&apos;Alertes ({alerts.length})
          </div>

          <div className="space-y-2.5">
            {alerts.map((alt) => {
              const isSelected = selectedAlert.id === alt.id;
              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlert(alt)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-amber-50/60 border-amber-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {alt.code}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {alt.title}
                      </h3>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Zone {alt.healthZone} • {alt.period}
                      </div>
                    </div>
                    {getAlertBadge(alt.level)}
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 line-clamp-2">
                    {alt.multiCriteriaRule.ruleSummary}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-500">Statut :</span>
                      {getStatusBadge(alt.status)}
                    </div>
                    <span className="text-amber-800 font-bold">Consulter &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colonne Droite : Fiche d'Alerte Détaillée (7/12) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            {/* Titre & Statuts */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedAlert.code}
                  </span>
                  {getStatusBadge(selectedAlert.status)}
                  <span className="text-xs text-slate-400 font-medium">{selectedAlert.period}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {selectedAlert.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aires touchées : {selectedAlert.healthAreas.join(', ')}
                </p>
              </div>
              {getAlertBadge(selectedAlert.level)}
            </div>

            {/* Distinction Fondamentale : Risque Prédit Modélisé vs Alerte de Surveillance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1 border-r border-slate-200 pr-3">
                <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Risque Prédit (Modèle V1.16)</span>
                </div>
                <div className="text-lg font-black font-mono text-teal-900">
                  {selectedAlert.predictedRiskScore}%
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Vulnérabilité structurelle à long terme estimée par le modèle spatial
                </p>
              </div>

              <div className="space-y-1 pl-1">
                <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Anomalie de Surveillance Réelle</span>
                </div>
                <div className="text-lg font-black font-mono text-amber-900">
                  +{selectedAlert.multiCriteriaRule.deviationOverExpectedPercent}%
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Écart immédiat constaté sur les données cliniques récentes
                </p>
              </div>
            </div>

            {/* Règle Multi-Critères One Health */}
            <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Règle Multi-Critères : {selectedAlert.multiCriteriaRule.ruleName}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-mono">
                {selectedAlert.multiCriteriaRule.ruleSummary}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div className="p-2 bg-white rounded border border-amber-200">
                  <span className="text-slate-400 block">Persistance</span>
                  <span className="font-bold text-slate-800">
                    {selectedAlert.multiCriteriaRule.persistenceWeeks} sem.
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-amber-200">
                  <span className="text-slate-400 block">Zones Liées</span>
                  <span className="font-bold text-slate-800">
                    {selectedAlert.multiCriteriaRule.spatialZonesCount} zones
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-amber-200">
                  <span className="text-slate-400 block">Déclencheur Climat</span>
                  <span className="font-bold text-emerald-700">Validé (Lag-1)</span>
                </div>
                <div className="p-2 bg-white rounded border border-amber-200">
                  <span className="text-slate-400 block">Qualité Données</span>
                  <span className="font-bold text-emerald-700">Conforme (&gt;85%)</span>
                </div>
              </div>
            </div>

            {/* Décision & Validation Humaine Actuelle */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <span>Décision de Supervision Humaine</span>
                </h4>
                <button
                  onClick={() => handleOpenVerification(selectedAlert)}
                  className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                >
                  <span>Vérifier / Modifier Statut</span>
                </button>
              </div>

              {selectedAlert.humanVerification.verifiedBy ? (
                <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-slate-500">
                    <span>
                      Vérifié par : <strong className="text-slate-800">{selectedAlert.humanVerification.verifiedBy}</strong> ({selectedAlert.humanVerification.verifierRole})
                    </span>
                    <span className="font-mono text-slate-400">{selectedAlert.humanVerification.verifiedAt}</span>
                  </div>
                  <div className="text-slate-700">
                    <strong>Justification obligatoire : </strong>
                    <span>{selectedAlert.humanVerification.mandatoryJustification}</span>
                  </div>
                  {selectedAlert.humanVerification.reviewerNotes && (
                    <div className="text-slate-600 text-[11px]">
                      <strong>Recommandations de terrain : </strong>
                      <span>{selectedAlert.humanVerification.reviewerNotes}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs border border-amber-200 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Aucune vérification humaine enregistrée. Décision en attente de l&apos;équipe cadre.</span>
                </div>
              )}
            </div>

            {/* Timeline Historique des Actions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Journal d&apos;Audit &amp; Traçabilité de l&apos;Alerte
              </span>
              <div className="space-y-2">
                {selectedAlert.historyTimeline.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">{item.user} ({item.role})</span>
                      <span className="font-mono text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-slate-600">{item.action} — {item.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal de Vérification Humaine Obligatoire */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Validation Humaine — Dossier {selectedAlert.code}
                </h3>
              </div>
              <button
                onClick={() => setIsVerifying(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                {validationError}
              </div>
            )}

            {/* Choix de l'Action */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">
                Décision de Supervision (Action) :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setVerificationAction('CONFIRMER')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    verificationAction === 'CONFIRMER'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Confirmer l&apos;Alerte
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationAction('METTRE_EN_OBSERVATION')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    verificationAction === 'METTRE_EN_OBSERVATION'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Mettre en Observation
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationAction('DEMANDER_DONNEES_SUPPLEMENTAIRES')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    verificationAction === 'DEMANDER_DONNEES_SUPPLEMENTAIRES'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Demander Données
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationAction('REJETER')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    verificationAction === 'REJETER'
                      ? 'bg-slate-200 border-slate-400 text-slate-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Rejeter (Faux Positif)
                </button>
              </div>
            </div>

            {/* Justification Obligatoire */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Justification Médicale / Épidémiologique Obligatoire * :
              </label>
              <textarea
                rows={3}
                value={justificationText}
                onChange={(e) => setJustificationText(e.target.value)}
                placeholder="Indiquez les constatations cliniques, résultats de laboratoire de confirmation ou vérifications de terrain..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-teal-600 text-xs"
              />
            </div>

            {/* Recommandations Opérationnelles */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Recommandations d&apos;Action de Terrain (Optionnel) :
              </label>
              <input
                type="text"
                value={reviewerNotesText}
                onChange={(e) => setReviewerNotesText(e.target.value)}
                placeholder="Ex : Réapprovisionnement en ACT, distribution ciblée de moustiquaires..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs"
              />
            </div>

            {/* Boutons Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsVerifying(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveVerification}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enregistrer la Décision de Supervision</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
