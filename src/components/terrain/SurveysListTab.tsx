import React, { useState } from 'react';
import { FieldFormRecord, FieldFormStatus, FieldUserRole } from '../../types';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Unlock,
  Trash2,
  Eye,
  FileText,
  MapPin,
  ShieldCheck,
  Download,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  X,
  Smartphone,
  Server
} from 'lucide-react';

interface SurveysListTabProps {
  forms: FieldFormRecord[];
  currentUserRole: FieldUserRole;
  onUpdateFormStatus: (localId: string, newStatus: FieldFormStatus, reason?: string) => void;
  onUnlockForm: (localId: string, unlockReason: string) => void;
  onDeleteRequest: (localId: string, reason: string) => void;
  onResolveConflictRequested?: (localId: string) => void;
}

export const SurveysListTab: React.FC<SurveysListTabProps> = ({
  forms,
  currentUserRole,
  onUpdateFormStatus,
  onUnlockForm,
  onDeleteRequest,
  onResolveConflictRequested
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [syncFilter, setSyncFilter] = useState<string>('ALL');
  const [selectedForm, setSelectedForm] = useState<FieldFormRecord | null>(null);

  // Modal for unlock reason
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockTargetId, setUnlockTargetId] = useState<string | null>(null);
  const [unlockReasonText, setUnlockReasonText] = useState('');

  // Modal for deletion request
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteReasonText, setDeleteReasonText] = useState('');

  const canValidateOrLock = ['ADMINISTRATEUR', 'RESPONSABLE_CAMPAGNE', 'SUPERVISEUR', 'CONTROLEUR_QUALITE'].includes(currentUserRole);
  const canUnlock = ['ADMINISTRATEUR', 'SUPERVISEUR'].includes(currentUserRole);

  const filteredForms = forms.filter((f) => {
    // Search
    const matchesSearch =
      f.localId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.serverId && f.serverId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      f.enumeratorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.healthArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.householdCode && f.householdCode.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;

    // Sync filter
    const matchesSync = syncFilter === 'ALL' || f.syncStatus === syncFilter;

    return matchesSearch && matchesStatus && matchesSync;
  });

  const getStatusBadge = (status: FieldFormStatus) => {
    switch (status) {
      case 'VALIDE':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Validé</span></span>;
      case 'VERROUILLE':
        return <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><Lock className="w-3 h-3" /><span>Verrouillé</span></span>;
      case 'EN_CONTROLE':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><AlertTriangle className="w-3 h-3" /><span>En Contrôle</span></span>;
      case 'EN_ATTENTE_SYNCHRONISATION':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><Clock className="w-3 h-3" /><span>En Attente Sync</span></span>;
      case 'SYNCHRONISE':
        return <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><CheckCircle2 className="w-3 h-3" /><span>Synchronisé</span></span>;
      case 'BROUILLON':
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">Brouillon Local</span>;
      case 'REJETE':
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-md flex items-center space-x-1"><AlertCircle className="w-3 h-3" /><span>Rejeté</span></span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-md">{status}</span>;
    }
  };

  const getSyncBadge = (syncStatus: string) => {
    switch (syncStatus) {
      case 'SYNCED':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">🟢 Serveur OK</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">🟡 En attente</span>;
      case 'CONFLICT':
        return <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-300">🟠 Conflit</span>;
      case 'ERROR':
        return <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded border border-rose-300">🔴 Erreur</span>;
      default:
        return null;
    }
  };

  const handleOpenUnlockModal = (localId: string) => {
    setUnlockTargetId(localId);
    setUnlockReasonText('');
    setIsUnlockModalOpen(true);
  };

  const handleConfirmUnlock = () => {
    if (!unlockTargetId || !unlockReasonText.trim()) return;
    onUnlockForm(unlockTargetId, unlockReasonText);
    setIsUnlockModalOpen(false);
    if (selectedForm && selectedForm.localId === unlockTargetId) {
      setSelectedForm({ ...selectedForm, status: 'VALIDE', lockedAt: undefined, lockedBy: undefined });
    }
  };

  const handleOpenDeleteModal = (localId: string) => {
    setDeleteTargetId(localId);
    setDeleteReasonText('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteRequest = () => {
    if (!deleteTargetId || !deleteReasonText.trim()) return;
    onDeleteRequest(deleteTargetId, deleteReasonText);
    setIsDeleteModalOpen(false);
    if (selectedForm && selectedForm.localId === deleteTargetId) {
      setSelectedForm({
        ...selectedForm,
        qualityChecks: {
          ...selectedForm.qualityChecks,
          markedForDeletion: true,
          deletionReason: deleteReasonText
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Barre de Contrôle */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Données
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Double Identifiant (Local / Serveur) &amp; Traçabilité</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Répertoire des Questionnaires Terrains
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi individuel du cycle de vie : de la création hors connexion au verrouillage post-validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher (ID, ménage, enquêteur, zone)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 w-64"
            />
          </div>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="BROUILLON">Brouillons</option>
            <option value="EN_ATTENTE_SYNCHRONISATION">En attente sync</option>
            <option value="SYNCHRONISE">Synchronisés</option>
            <option value="EN_CONTROLE">En contrôle</option>
            <option value="VALIDE">Validés</option>
            <option value="VERROUILLE">Verrouillés</option>
            <option value="REJETE">Rejetés</option>
          </select>

          {/* Filtre Synchronisation */}
          <select
            value={syncFilter}
            onChange={(e) => setSyncFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="ALL">Toute synchro</option>
            <option value="SYNCED">Synchronisé</option>
            <option value="PENDING">En attente</option>
            <option value="CONFLICT">Conflits</option>
            <option value="ERROR">Erreurs</option>
          </select>
        </div>
      </div>

      {/* Tableau des Questionnaires */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-600">ID Local / Serveur</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Enquêteur</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Localisation (Kindu)</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Statut Cycle</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Synchro</th>
                <th className="px-4 py-3 text-left font-bold text-slate-600">Qualité</th>
                <th className="px-4 py-3 text-right font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredForms.map((form) => (
                <tr key={form.localId} className="hover:bg-slate-50/60 transition">
                  
                  {/* Identifiants Double */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-mono font-bold text-teal-900">{form.localId}</span>
                      </div>
                      {form.serverId ? (
                        <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono mt-0.5">
                          <Server className="w-3 h-3 text-blue-500" />
                          <span>{form.serverId}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Non attribué serveur</span>
                      )}
                    </div>
                  </td>

                  {/* Enquêteur */}
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 block">{form.enumeratorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{form.enumeratorId}</span>
                  </td>

                  {/* Zone & Ménage */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {form.healthArea} • {form.neighborhood}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Code : {form.householdCode || 'N/A'}
                    </div>
                  </td>

                  {/* Statut du cycle */}
                  <td className="px-4 py-3">
                    {getStatusBadge(form.status)}
                  </td>

                  {/* Synchronisation */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      {getSyncBadge(form.syncStatus)}
                      {form.syncStatus === 'CONFLICT' && onResolveConflictRequested && (
                        <button
                          onClick={() => onResolveConflictRequested(form.localId)}
                          className="text-[10px] font-bold text-amber-700 underline hover:text-amber-800 text-left"
                        >
                          Résoudre le conflit →
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Score de Qualité & Drapeaux */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-mono font-bold ${
                        form.qualityChecks.completenessScore >= 95 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {form.qualityChecks.completenessScore}%
                      </span>
                      {form.qualityChecks.hasInconsistencies && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded" title="Incohérence détectée">
                          ⚠️ Anomalie
                        </span>
                      )}
                      {form.qualityChecks.markedForDeletion && (
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
                          🗑️ Marquage suppression
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions Rapides */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => setSelectedForm(form)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Voir le détail complet"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {canValidateOrLock && form.status !== 'VERROUILLE' && form.status !== 'VALIDE' && (
                        <button
                          onClick={() => onUpdateFormStatus(form.localId, 'VALIDE')}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                          title="Valider la conformité"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {canValidateOrLock && form.status === 'VALIDE' && (
                        <button
                          onClick={() => onUpdateFormStatus(form.localId, 'VERROUILLE')}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                          title="Verrouiller le questionnaire"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}

                      {canUnlock && form.status === 'VERROUILLE' && (
                        <button
                          onClick={() => handleOpenUnlockModal(form.localId)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                          title="Déverrouiller avec motif"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer / Modal Détail Formulaire */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedForm.localId}
                  </span>
                  {selectedForm.serverId && (
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedForm.serverId}
                    </span>
                  )}
                  {getStatusBadge(selectedForm.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Enquête Ménage One Health : {selectedForm.householdCode || selectedForm.localId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedForm(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Géolocalisation & Horodatages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Position GPS &amp; Géofencing</span>
                </div>
                <div className="space-y-1 text-slate-600">
                  <p><strong>Latitude :</strong> {selectedForm.gps.latitude.toFixed(5)}</p>
                  <p><strong>Longitude :</strong> {selectedForm.gps.longitude.toFixed(5)}</p>
                  <p><strong>Précision :</strong> {selectedForm.gps.accuracy} m (Source : {selectedForm.gps.source})</p>
                  <p>
                    <strong>Statut Zone :</strong>{' '}
                    {selectedForm.gps.isWithinAssignedZone ? (
                      <span className="text-emerald-700 font-bold">✅ Dans le périmètre assigné</span>
                    ) : (
                      <span className="text-rose-600 font-bold">⚠️ Hors zone assignée ({selectedForm.gps.distanceFromZoneCenterMeters} m)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Horodatages &amp; Traçabilité</span>
                </div>
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <p><strong>Création Terminal :</strong> {selectedForm.createdAtDevice}</p>
                  <p><strong>Synchronisation :</strong> {selectedForm.synchronizedAtServer || 'En attente'}</p>
                  <p><strong>Durée de Saisie :</strong> {selectedForm.durationMinutes || 'N/A'} minutes</p>
                  {selectedForm.validatedBy && (
                    <p><strong>Validé par :</strong> {selectedForm.validatedBy} ({selectedForm.validatedAt})</p>
                  )}
                  {selectedForm.lockedBy && (
                    <p><strong>Verrouillé par :</strong> {selectedForm.lockedBy} ({selectedForm.lockedAt})</p>
                  )}
                </div>
              </div>
            </div>

            {/* Données Saisies */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Variables Collectées (Démographie, Paludisme, Typhoïde, WASH) :
              </span>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Taille Ménage</span>
                  <span className="font-bold text-slate-800">{selectedForm.formData.householdSize} personnes</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Enfants &lt; 5 ans</span>
                  <span className="font-bold text-slate-800">{selectedForm.formData.childrenUnder5}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Cas Paludisme (30j)</span>
                  <span className="font-bold text-rose-700">{selectedForm.formData.casesCountMalaria}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Moustiquaire Imprégnée</span>
                  <span className="font-bold text-slate-800">{selectedForm.formData.mosquitoNetImpregnated ? 'Oui' : 'Non'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Cas Typhoïde (30j)</span>
                  <span className="font-bold text-amber-700">{selectedForm.formData.casesCountTyphoid}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Source d Eau</span>
                  <span className="font-bold text-slate-800">{selectedForm.formData.waterSource || 'N/A'}</span>
                </div>
              </div>

              {selectedForm.formData.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong>Notes de terrain :</strong> {selectedForm.formData.notes}
                </div>
              )}
            </div>

            {/* Contrôles Qualité & Anomalies */}
            {selectedForm.qualityChecks.inconsistencyList.length > 0 && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
                <strong className="block font-bold">⚠️ Signaux de Contrôle Qualité Détectés :</strong>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {selectedForm.qualityChecks.inconsistencyList.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions Administratives */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenDeleteModal(selectedForm.localId)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Marquer pour suppression</span>
              </button>

              <div className="flex items-center space-x-2">
                {canValidateOrLock && selectedForm.status !== 'VERROUILLE' && selectedForm.status !== 'VALIDE' && (
                  <button
                    onClick={() => {
                      onUpdateFormStatus(selectedForm.localId, 'VALIDE');
                      setSelectedForm({ ...selectedForm, status: 'VALIDE' });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Valider ce Questionnaire
                  </button>
                )}
                {canValidateOrLock && selectedForm.status === 'VALIDE' && (
                  <button
                    onClick={() => {
                      onUpdateFormStatus(selectedForm.localId, 'VERROUILLE');
                      setSelectedForm({ ...selectedForm, status: 'VERROUILLE' });
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Verrouiller Définitivement
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal Déverrouillage avec Justification */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-amber-700">
              <Unlock className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Déverrouillage Exceptionnel</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Le déverrouillage d un questionnaire validé nécessite un motif scientifique ou opérationnel formel pour être tracé dans le journal d audit.
            </p>
            <textarea
              required
              rows={3}
              placeholder="Motif obligatoire (ex : Correction du statut TDR suite à double confirmation du laboratoire central)..."
              value={unlockReasonText}
              onChange={(e) => setUnlockReasonText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsUnlockModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmUnlock}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirmer le Déverrouillage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Marquage Suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-700">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900">Demande de Suppression</h3>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
              <strong>ZÉRO SUPPRESSION SILENCIEUSE :</strong> Ce formulaire sera marqué comme "Demande de suppression" avec conservation intégrale dans l historique pour validation finale du superviseur.
            </div>
            <textarea
              required
              rows={3}
              placeholder="Raison formelle de la suppression demandée..."
              value={deleteReasonText}
              onChange={(e) => setDeleteReasonText(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeleteRequest}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Enregistrer la Demande
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
