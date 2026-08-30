import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { exportToExcel, exportToCSV, exportToGeoJSON } from '../utils/exportUtils';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Map,
  CheckCircle2,
  Calendar,
  Layers,
  Database
} from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { OneHealthLogo } from './common/OneHealthLogo';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose }) => {
  const {
    modelMatrix,
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    qualityIssues,
    selectedYear,
  } = useData();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = (type: 'EXCEL' | 'CSV' | 'GEOJSON') => {
    if (type === 'EXCEL') {
      exportToExcel(
        householdSurveys,
        environmentalObs,
        healthRecords,
        climateRecords,
        modelMatrix
      );
      setDownloadSuccess('Export Excel multi-onglets généré avec succès !');
    } else if (type === 'CSV') {
      exportToCSV(modelMatrix, 'OneHealth_Kindu_Base_Modele');
      setDownloadSuccess('Fichier CSV pour R & Python généré avec succès !');
    } else if (type === 'GEOJSON') {
      exportToGeoJSON([...environmentalObs, ...householdSurveys], 'OneHealth_Kindu_GIS_Layers');
      setDownloadSuccess('Couches SIG GeoJSON prêtes pour QGIS / ArcGIS générées !');
    }

    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <OneHealthLogo size="sm" variant="badge" showTerritoryBadge={false} />
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Centre d'Export des Données de Recherche</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {APP_CONFIG.name} • {APP_CONFIG.primaryRegion} (RDC) • Formats R, Python, QGIS &amp; Excel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1">
            ✕
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Excel Export Card */}
          <div
            onClick={() => handleExport('EXCEL')}
            className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Classeur Excel (.xlsx) Multi-Onglets</h4>
                <p className="text-[11px] text-slate-500">
                  Matrice modèle, données sanitaires, météo, observations valides et contrôle qualité
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>

          {/* CSV Export Card */}
          <div
            onClick={() => handleExport('CSV')}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Matrice Canonique CSV (R Studio / Python)</h4>
                <p className="text-[11px] text-slate-500">
                  Table agrégée Aire de Santé × Mois avec décalages pluviométriques (Lag-1) et indicateurs WASH
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-700" />
          </div>

          {/* GeoJSON SIG Card */}
          <div
            onClick={() => handleExport('GEOJSON')}
            className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 cursor-pointer transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Couches SIG GeoJSON (QGIS / ArcGIS)</h4>
                <p className="text-[11px] text-slate-500">
                  Polygones des aires de santé avec taux d'incidence et points GPS ponctuels avec validité temporelle
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-sky-600" />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Toutes les données sont anonymisées et conformes aux protocoles éthiques.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
