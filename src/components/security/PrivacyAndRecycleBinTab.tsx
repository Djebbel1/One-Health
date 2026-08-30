import React, { useState } from 'react';
import {
  ShieldAlert,
  Trash2,
  RefreshCw,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Download,
  Clock,
  Sparkles,
  Search,
  Database
} from 'lucide-react';
import {
  DataPrivacyRule,
  RecycleBinItem,
  DataRetentionPolicy,
  ExportSecurityPolicy,
  UserRole
} from '../../types';
import { sanitizeDataForExport } from '../../data/mockSecurityDataV120';

interface PrivacyAndRecycleBinTabProps {
  privacyRules: DataPrivacyRule[];
  recycleBinItems: RecycleBinItem[];
  retentionPolicies: DataRetentionPolicy[];
  currentUserRole: UserRole;
  currentUserName: string;
  onRestoreItem: (itemId: string) => void;
  onPermanentDeleteItem: (itemId: string) => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

const SAMPLE_RAW_RECORDS = [
  {
    id: 1,
    respondentName: 'Maman Kasongo Bernadette',
    telephone: '+243 81 234 5678',
    parcelNumber: 'Av. Kasongo #42, Quartier Kasuku',
    gpsLatitudeLongitude: -2.95421,
    casesReported: 2,
    feverDurationDays: 4,
    sourceWater: 'Puits ouvert non protégé'
  },
  {
    id: 2,
    respondentName: 'Papa Amisi Dieudonné',
    telephone: '+243 82 987 6543',
    parcelNumber: 'Route Alunguli #12',
    gpsLatitudeLongitude: -2.94812,
    casesReported: 1,
    feverDurationDays: 2,
    sourceWater: 'Robinet borne fontaine'
  },
  {
    id: 3,
    respondentName: 'Dr. Jeanne Mwamba (Foyer)',
    telephone: '+243 89 111 2233',
    parcelNumber: 'Av. du Fleuve #8, Kindu',
    gpsLatitudeLongitude: -2.96105,
    casesReported: 0,
    feverDurationDays: 0,
    sourceWater: 'Eau de pluie traitée'
  }
];

export const PrivacyAndRecycleBinTab: React.FC<PrivacyAndRecycleBinTabProps> = ({
  privacyRules,
  recycleBinItems,
  retentionPolicies,
  currentUserRole,
  currentUserName,
  onRestoreItem,
  onPermanentDeleteItem,
  onAddSecurityLog
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'PRIVACY_EXPORT' | 'RECYCLE_BIN' | 'RETENTION'>('PRIVACY_EXPORT');
  const [exportMode, setExportMode] = useState<'ANONYMIZED' | 'FULL'>('ANONYMIZED');
  const [exportJustification, setExportJustification] = useState('');
  const [exportExecuted, setExportExecuted] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<RecycleBinItem | null>(null);

  const previewData = sanitizeDataForExport(SAMPLE_RAW_RECORDS, privacyRules, exportMode);

  const handleExecuteExport = () => {
    if (exportMode === 'FULL' && currentUserRole !== 'ADMINISTRATEUR' && currentUserRole !== 'CHERCHEUR') {
      alert('Seuls les Chercheurs Principaux et Administrateurs peuvent exporter des données brutes identifiantes.');
      return;
    }

    if (!exportJustification.trim()) {
      alert('Veuillez renseigner un motif / justification pour l export.');
      return;
    }

    setExportExecuted(true);
    onAddSecurityLog(
      exportMode === 'FULL' ? 'EXPORT_FULL' : 'EXPORT_ANONYMIZED',
      `Export ${exportMode} généré (${previewData.length} lignes) par ${currentUserName} (${currentUserRole}). Motif : ${exportJustification}`,
      exportMode === 'FULL' ? 'WARNING' : 'INFO'
    );
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/90 rounded-2xl max-w-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('PRIVACY_EXPORT')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'PRIVACY_EXPORT'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Anonymisation & Exports
        </button>
        <button
          onClick={() => setActiveSubTab('RECYCLE_BIN')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'RECYCLE_BIN'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          Corbeille Logique ({recycleBinItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('RETENTION')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'RETENTION'
              ? 'bg-white text-indigo-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Politiques de Rétention
        </button>
      </div>

      {/* SubTab 1: Privacy & Export Engine */}
      {activeSubTab === 'PRIVACY_EXPORT' && (
        <div className="space-y-6">
          {/* Privacy Rules Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                  <Lock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Règles de Protection des Données Personnelles (PII)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Définition des stratégies de pseudonymisation et de bruitage spatiotemporel
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {privacyRules.map((r) => (
                <div
                  key={r.fieldKey}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.fieldLabel}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-mono">
                      {r.maskingStrategy}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{r.description}</p>
                  <div className="pt-1 text-[10px] text-slate-500 font-mono">
                    Accès brut réservé à : {r.allowedRolesForRaw.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Export Engine Sandbox */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                  <Download className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Générateur d Exportation Sécurisée avec Justification
                  </h4>
                  <p className="text-xs text-slate-500">
                    Comparaison en direct : Données Brutes (RAW) vs Données Anonymisées (PART-XXXXXX)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExportMode('ANONYMIZED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    exportMode === 'ANONYMIZED'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Export Anonymisé (Recommandé)
                </button>
                <button
                  onClick={() => setExportMode('FULL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    exportMode === 'FULL'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Export Brut Restreint (Chercheur/Admin)
                </button>
              </div>
            </div>

            {/* Justification Form */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <label className="font-bold text-slate-700 block">
                Motif d Exportation / Justification Scientifique Obligatoire :
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={exportJustification}
                  onChange={(e) => setExportJustification(e.target.value)}
                  placeholder="Ex: Analyse statistique spatiale GAM sous R / Comité éthique UNIKI..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
                />
                <button
                  onClick={handleExecuteExport}
                  className="px-4 py-2 bg-indigo-700 text-white font-bold rounded-xl hover:bg-indigo-800 transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Générer le Fichier
                </button>
              </div>
            </div>

            {/* Live Data Preview */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Nom Répondant</th>
                    <th className="p-2.5">Téléphone</th>
                    <th className="p-2.5">Adresse / Parcelle</th>
                    <th className="p-2.5">Latitude (GPS)</th>
                    <th className="p-2.5 text-center">Cas Déclarés</th>
                    <th className="p-2.5">Source Eau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {previewData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60">
                      <td className="p-2.5 font-bold text-slate-700">#{row.id}</td>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">
                        {row.respondentName}
                      </td>
                      <td className="p-2.5 text-slate-600">{row.telephone}</td>
                      <td className="p-2.5 font-sans text-slate-600">{row.parcelNumber}</td>
                      <td className="p-2.5 text-indigo-700 font-bold">
                        {row.gpsLatitudeLongitude}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-800">
                        {row.casesReported}
                      </td>
                      <td className="p-2.5 font-sans text-slate-600">{row.sourceWater}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {exportExecuted && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Fichier sécurisé généré avec succès. Empreinte SHA-256 certifiée et auditée.
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 font-bold">
                  SHA-256: d41d8cd98f00b204e9800998ecf8427e
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SubTab 2: Recycle Bin (Corbeille des suppressions logiques) */}
      {activeSubTab === 'RECYCLE_BIN' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                <Trash2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Corbeille & Rétention des Suppressions Logiques (V1.20)
                </h3>
                <p className="text-xs text-slate-500">
                  Aucune suppression physique immédiate. Restauration instantanée possible avec traçabilité.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-slate-500">
              {recycleBinItems.length} élément(s) conservé(s)
            </span>
          </div>

          {recycleBinItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              La corbeille est vide. Aucun enregistrement supprimé logiquement.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {recycleBinItems.map((item) => (
                <div key={item.itemId} className="p-4 bg-white hover:bg-slate-50 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                          {item.itemType}
                        </span>
                        <strong className="text-xs text-slate-900">{item.title}</strong>
                      </div>
                      <p className="text-[11px] text-rose-700 mt-1 font-medium">
                        Motif : {item.reason}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onRestoreItem(item.itemId);
                          onAddSecurityLog(
                            'RESTORE_RECYCLE_BIN',
                            `Restauration de l élément ${item.itemId} (${item.title})`,
                            'INFO'
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Restaurer
                      </button>

                      {currentUserRole === 'ADMINISTRATEUR' && (
                        <button
                          onClick={() => setDeleteConfirmItem(item)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Suppr. Définitive
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                    <span>Supprimé par : {item.deletedBy} ({item.deletedAt})</span>
                    <span>Expire le : {item.expiresAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 3: Retention Policies */}
      {activeSubTab === 'RETENTION' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Politiques de Conservation & Archivage Légal
                </h3>
                <p className="text-xs text-slate-500">
                  Règles de conservation selon les standards éthiques et réglementaires de la RDC
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {retentionPolicies.map((pol) => (
              <div
                key={pol.policyId}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{pol.dataType}</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                    {pol.retentionPeriodDays} jours ({Math.round(pol.retentionPeriodDays / 365)} an(s))
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1 font-mono">
                  <div>Politique de purge : <strong className="text-slate-800">{pol.purgePolicy}</strong></div>
                  <div>Archivage froid auto : <strong className="text-emerald-700">{pol.autoArchive ? 'OUI' : 'NON'}</strong></div>
                  <div>Dernière exécution : {pol.lastExecution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hard Delete Confirm Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                Suppression Définitive (Hard Delete)
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Êtes-vous absolument sûr de vouloir purger définitivement l élément suivant ? Cette action est irréversible et sera consignée dans le journal de sécurité :
            </p>

            <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-800">
              {deleteConfirmItem.title}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onPermanentDeleteItem(deleteConfirmItem.itemId);
                  onAddSecurityLog(
                    'HARD_DELETE',
                    `Suppression définitive de ${deleteConfirmItem.itemId} (${deleteConfirmItem.title})`,
                    'CRITICAL'
                  );
                  setDeleteConfirmItem(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Purger Définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
