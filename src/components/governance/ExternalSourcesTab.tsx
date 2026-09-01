import React, { useState } from 'react';
import {
  Globe,
  UploadCloud,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Database,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ExternalDataSource, FileImportAudit } from '../../types';

interface ExternalSourcesTabProps {
  sources: ExternalDataSource[];
  fileImports: FileImportAudit[];
  onAddFileImport: (audit: FileImportAudit) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const ExternalSourcesTab: React.FC<ExternalSourcesTabProps> = ({
  sources,
  fileImports,
  onAddFileImport,
  onAddAuditLog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<FileImportAudit | null>(null);
  const [importedFileSuccess, setImportedFileSuccess] = useState<string | null>(null);

  // Simulated File Upload handler with duplicate detection
  const handleSimulatedFileUpload = (fileName: string, simulatedHash: string) => {
    // Check if hash already exists
    const existing = fileImports.find(f => f.sha256Hash === simulatedHash);

    if (existing) {
      setDuplicateWarning(existing);
      setImportedFileSuccess(null);
      onAddAuditLog('IMPORT_FICHIER', `Tentative d importation de fichier en double détectée : ${fileName}`, {
        existingFile: existing.fileName,
        hash: simulatedHash,
        isDuplicate: true
      });
    } else {
      const newAudit: FileImportAudit = {
        importId: `IMP-${Date.now().toString().slice(-4)}`,
        fileName,
        fileFormat: fileName.endsWith('.csv') ? 'CSV' : 'EXCEL',
        fileSizeBytes: (Math.floor(Math.random() * 800) + 120) * 1024,
        sha256Hash: simulatedHash,
        importDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        importedBy: 'Dr. Jean-Pierre Mukendi',
        projectId: 'PRJ-KIN-001',
        rowsDetected: 180,
        columnsDetected: 12,
        importedSuccessfully: 180,
        errorsCount: 0,
        isPotentialDuplicate: false,
        destinationDatasetId: 'DS-RAW-2026',
        isDemoData: true
      };
      onAddFileImport(newAudit);
      setDuplicateWarning(null);
      setImportedFileSuccess(`Fichier ${fileName} vérifié (SHA-256 unique) et enregistré.`);
      onAddAuditLog('IMPORT_FICHIER', `Importation réussie du fichier externe ${fileName}`, {
        importId: newAudit.importId,
        sha256: newAudit.sha256Hash
      });
    }
  };

  const filteredSources = sources.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <Globe className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Sources de Données Externes & Contrôle des Doublons</h3>
            <p className="text-xs text-slate-500">
              Inventaire des flux satellites, météo, SNIS et contrôle d intégrité par empreinte SHA-256
            </p>
          </div>
        </div>
      </div>

      {/* Duplicate File Detection Simulation Card */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-300 bg-teal-900/60 px-3 py-1 rounded-full border border-teal-700 font-mono">
              RÈGLE ANTI-DOUBLONS V1.19
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white">Contrôle d'Intégrité et Détection Non-Destructive des Doublons</h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Avant ingestion dans un dataset RAW, chaque fichier est analysé. En cas d'empreinte SHA-256 déjà connue, une alerte est émise sans suppression arbitraire.
            </p>
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSimulatedFileUpload('METTELSAT_KINDU_SERIES_2026_Q1_Q2.xlsx', '9e7b23c84f1a23e49afbf4c8996fb92427ae41e4649b934ca495991b7852ff11')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            Tester l'Ingestion d'un Fichier Existant (Test Doublon)
          </button>
          <button
            onClick={() => handleSimulatedFileUpload(`chirps_precip_semaine_${Math.floor(Math.random() * 40)}.csv`, `sha256-${Math.random().toString(36).substring(2, 15)}`)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4" />
            Ingérer un Fichier Inédit (Test Unique)
          </button>
        </div>

        {/* Dynamic Feedback Banner */}
        {duplicateWarning && (
          <div className="p-4 bg-amber-500/20 border border-amber-400 rounded-xl text-amber-200 text-xs sm:text-sm space-y-1.5 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Avertissement : Fichier Déjà Importé (Doublon Détecté)
            </div>
            <p>
              Ce fichier possède exactement la même empreinte SHA-256 qu'un fichier déjà validé :
            </p>
            <div className="p-3 bg-slate-900/80 rounded-lg border border-amber-500/40 font-mono text-xs text-amber-200">
              • Référence existante : <strong>{duplicateWarning.importId}</strong> ({duplicateWarning.fileName})<br />
              • Importé le : {duplicateWarning.importDate} par {duplicateWarning.importedBy}<br />
              • Hash SHA-256 : {duplicateWarning.sha256Hash}
            </div>
          </div>
        )}

        {importedFileSuccess && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-400 rounded-xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{importedFileSuccess}</span>
          </div>
        )}
      </div>

      {/* Grid: External Sources & Import History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sources Catalog */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Flux & Sources Externes Partenaires
            </h4>
            <span className="text-xs text-slate-500 font-medium">{sources.length} sources actives</span>
          </div>

          <div className="space-y-3">
            {filteredSources.map((s) => (
              <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded">
                      {s.id}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">{s.name}</h5>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Fiabilité {s.reliabilityScore}%
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm">{s.scientificReference}</p>

                <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
                  <span>Organisation : <strong>{s.organization}</strong></span>
                  <span>Fréquence : {s.temporalResolution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Import Audits History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Journal d'Audit des Fichiers Importés
            </h4>
            <span className="text-xs text-slate-500 font-mono">{fileImports.length} imports vérifiés</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {fileImports.map((imp) => (
              <div key={imp.importId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-800">{imp.fileName}</span>
                    <span className="text-slate-400 text-xs">({Math.round(imp.fileSizeBytes / 1024)} KB)</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${imp.isPotentialDuplicate ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {imp.isPotentialDuplicate ? 'DOUBLON' : 'VALIDE'}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500 break-all">
                  Hash: {imp.sha256Hash}
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                  <span>Par : {imp.importedBy}</span>
                  <span>{imp.importDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
