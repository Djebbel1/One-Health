import React, { useState } from 'react';
import { RawImportRecord, DataSourceEntity } from '../../types';
import {
  History,
  Lock,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  GitCompare,
  Download,
  Calendar,
  User,
  Hash,
  Shield,
  Layers
} from 'lucide-react';

interface ImportHistoryTabProps {
  imports: RawImportRecord[];
  sources: DataSourceEntity[];
  onSelectImportForInspection: (rawImport: RawImportRecord) => void;
}

export const ImportHistoryTab: React.FC<ImportHistoryTabProps> = ({
  imports,
  sources,
  onSelectImportForInspection
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const toggleCompareSelect = (importId: string) => {
    if (selectedForCompare.includes(importId)) {
      setSelectedForCompare(prev => prev.filter(id => id !== importId));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare(prev => [...prev, importId]);
      } else {
        setSelectedForCompare([selectedForCompare[1], importId]);
      }
    }
  };

  const importA = imports.find(i => i.id === selectedForCompare[0]);
  const importB = imports.find(i => i.id === selectedForCompare[1]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            Historique des Données Brutes Importées (RAW Immuable)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Chaque import est scellé avec son empreinte numérique SHA-256, son horodatage et son opérateur sans altération possible.
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={() => setIsComparing(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition"
          >
            <GitCompare className="w-4 h-4" />
            <span>Comparer les 2 imports sélectionnés</span>
          </button>
        )}
      </div>

      {/* Comparison Modal */}
      {isComparing && importA && importB && (
        <div className="bg-slate-900 text-white rounded-xl border border-slate-700 p-6 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Comparaison d'Imports : {importA.importNumber} vs {importB.importNumber}
            </h4>
            <button
              onClick={() => setIsComparing(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Fermer Comparaison
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Import A */}
            <div className="space-y-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-400">{importA.importNumber}</span>
                <span className="font-mono text-[10px] text-slate-400">{importA.id}</span>
              </div>
              <p className="font-semibold text-white">{importA.fileName}</p>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p>Source : {importA.sourceName}</p>
                <p>Date : {importA.importDate}</p>
                <p>Opérateur : {importA.importedBy}</p>
                <p className="text-teal-300 font-bold">Lignes : {importA.rowCount.toLocaleString()}</p>
                <p>Colonnes : {importA.columnCount}</p>
              </div>
            </div>

            {/* Import B */}
            <div className="space-y-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-400">{importB.importNumber}</span>
                <span className="font-mono text-[10px] text-slate-400">{importB.id}</span>
              </div>
              <p className="font-semibold text-white">{importB.fileName}</p>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <p>Source : {importB.sourceName}</p>
                <p>Date : {importB.importDate}</p>
                <p>Opérateur : {importB.importedBy}</p>
                <p className="text-indigo-300 font-bold">Lignes : {importB.rowCount.toLocaleString()}</p>
                <p>Colonnes : {importB.columnCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List of Raw Imports */}
      <div className="grid grid-cols-1 gap-4">
        {imports.map(imp => {
          const isSelectedForComp = selectedForCompare.includes(imp.id);
          return (
            <div
              key={imp.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelectedForComp ? 'border-indigo-400 bg-indigo-50/10' : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white font-mono">
                    {imp.importNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    RAW Immuable Scellé
                  </span>
                  {imp.isDemo && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      DONNÉES FICTIVES DE DÉMO
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                    {imp.fileName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Source : <strong className="text-slate-800">{imp.sourceName}</strong>
                  </p>
                </div>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {imp.importDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {imp.importedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{imp.rowCount.toLocaleString()}</strong> lignes • <strong>{imp.columnCount}</strong> colonnes
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 truncate max-w-xs" title={imp.fileHash}>
                    <Hash className="w-3 h-3 text-slate-400" />
                    {imp.fileHash.substring(0, 16)}...
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => toggleCompareSelect(imp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    isSelectedForComp
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isSelectedForComp ? '✓ Sélectionné' : 'Sélectionner pour comparer'}
                </button>

                <button
                  onClick={() => onSelectImportForInspection(imp)}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspecter RAW</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
