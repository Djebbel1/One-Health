import React, { useState } from 'react';
import {
  CartoLayerConfig,
  CartoDiseaseFilter,
  HealthRecord,
  ClimateRecord,
  EnvironmentalObservation,
  HouseholdSurvey,
  WaterPointItem,
  FloodAreaItem,
} from '../../types';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import { exportToCSV, exportCustomSheetsToExcel } from '../../utils/exportUtils';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

interface CartoExportModalProps {
  layers: CartoLayerConfig[];
  selectedYear: number;
  selectedMonth: number | null;
  selectedDisease: CartoDiseaseFilter;
  selectedHealthAreaId: string | 'ALL';
  healthRecords: HealthRecord[];
  climateRecords: ClimateRecord[];
  environmentalObs: EnvironmentalObservation[];
  householdSurveys: HouseholdSurvey[];
  waterPoints: WaterPointItem[];
  floodAreas: FloodAreaItem[];
  onClose: () => void;
}

export const CartoExportModal: React.FC<CartoExportModalProps> = ({
  layers,
  selectedYear,
  selectedMonth,
  selectedDisease,
  selectedHealthAreaId,
  healthRecords,
  climateRecords,
  environmentalObs,
  householdSurveys,
  waterPoints,
  floodAreas,
  onClose,
}) => {
  const [exportFormat, setExportFormat] = useState<'EXCEL' | 'CSV' | 'GEOJSON' | 'PRINT'>('EXCEL');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const activeAreaName =
    selectedHealthAreaId === 'ALL'
      ? 'Ensemble de Kindu et Alunguli'
      : KINDU_HEALTH_AREAS.find(a => a.id === selectedHealthAreaId)?.name || selectedHealthAreaId;

  const handleExport = () => {
    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const filenamePrefix = `OneHealth_Kindu_Carto_${selectedYear}${selectedMonth ? `_M${selectedMonth}` : ''}_${selectedHealthAreaId}`;

      if (exportFormat === 'EXCEL') {
        // Multi-tab Excel export
        const healthData = healthRecords.map(h => ({
          'ID Sanitaire': h.id || h.health_record_id,
          'Structure': h.facility_name,
          'Aire de Santé': h.health_area_id,
          'Année': h.year,
          'Mois': h.month,
          'Pathologie': h.disease,
          'Cas': h.cases,
          'Hospitalisations': h.hospitalizations,
          'Décès': h.deaths,
          'Source': h.source_name,
          'Statut': h.status,
        }));

        const envData = environmentalObs.map(e => ({
          'ID Observation': e.id || e.observation_id,
          'Facteur': e.factor_type,
          'Description': e.description,
          'Aire de Santé': e.health_area_id,
          'Latitude': e.latitude,
          'Longitude': e.longitude,
          'Date Observation': e.observation_date,
          'Validité Début': e.validity_start,
          'Validité Fin': e.validity_end,
          'Statut Historique': e.historical_status,
        }));

        const climateData = climateRecords.map(c => ({
          'ID Climat': c.id || c.climate_id,
          'Station': c.station_name,
          'Année': c.year,
          'Mois': c.month,
          'Pluie (mm)': c.rainfall_mm,
          'Temp. Moy (°C)': c.temperature_mean,
          'Humidité (%)': c.humidity_percent,
          'Source': c.source_name,
        }));

        const householdData = householdSurveys.map(h => ({
          'ID Ménage (Anonyme)': h.id || h.household_id,
          'Aire de Santé': h.health_area_id,
          'Source Eau': h.water_source_label,
          'Latrine': h.latrine_available ? 'Oui' : 'Non',
          'Moustiquaires': h.bednet_number,
          'Date Enquête': h.survey_date,
          'Latitude': h.latitude,
          'Longitude': h.longitude,
        }));

        const metaData = [
          {
            'Paramètre': 'Titre du Projet',
            'Valeur': 'Cartographie Intégrée One Health Kindu (V1.6)',
          },
          { 'Paramètre': 'Année de filtrage', 'Valeur': selectedYear },
          { 'Paramètre': 'Mois de filtrage', 'Valeur': selectedMonth || 'Année entière' },
          { 'Paramètre': 'Filtre Pathologique', 'Valeur': selectedDisease },
          { 'Paramètre': 'Emprise spatiale', 'Valeur': activeAreaName },
          { 'Paramètre': 'Date d\'export', 'Valeur': new Date().toLocaleString() },
          { 'Paramètre': 'Confidentialité', 'Valeur': 'Données anonymisées sans PII' },
        ];

        exportCustomSheetsToExcel(
          [
            { sheetName: 'Sanitaire', data: healthData },
            { sheetName: 'Environnement', data: envData },
            { sheetName: 'Climat', data: climateData },
            { sheetName: 'Ménages', data: householdData },
            { sheetName: 'Métadonnées', data: metaData },
          ],
          `${filenamePrefix}.xlsx`
        );
      } else if (exportFormat === 'CSV') {
        const combinedData = healthRecords.map(h => ({
          health_id: h.id || h.health_record_id,
          facility: h.facility_name,
          area_id: h.health_area_id,
          year: h.year,
          month: h.month,
          disease: h.disease,
          cases: h.cases,
          source: h.source_name,
        }));
        exportToCSV(combinedData, `${filenamePrefix}.csv`);
      } else if (exportFormat === 'GEOJSON') {
        // Build GeoJSON FeatureCollection
        const features = [
          ...environmentalObs.filter(e => e.latitude && e.longitude).map(e => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [e.longitude, e.latitude],
            },
            properties: {
              layer: 'ENVIRONNEMENT',
              id: e.id || e.observation_id,
              factor: e.factor_type,
              area: e.health_area_id,
              date: e.observation_date,
              validity_start: e.validity_start,
              validity_end: e.validity_end,
            },
          })),
          ...waterPoints.map(w => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [w.longitude, w.latitude],
            },
            properties: {
              layer: 'EAU',
              id: w.id,
              name: w.name,
              type: w.type,
              protected: w.is_protected,
            },
          })),
        ];

        const geojson = {
          type: 'FeatureCollection',
          features,
        };

        const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenamePrefix}.geojson`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'PRINT') {
        window.print();
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5 text-slate-800 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Exportation des Données Cartographiques</h3>
              <p className="text-xs text-slate-500">
                Génération de fichiers normalisés selon les filtres spatio-temporels actifs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Filters Summary */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="font-bold text-slate-700 mb-1">Paramètres de la Carte Actuelle :</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <strong>Période :</strong> {selectedYear} {selectedMonth ? `(Mois ${selectedMonth})` : '(Année entière)'}
            </div>
            <div>
              <strong>Emprise :</strong> {activeAreaName}
            </div>
            <div>
              <strong>Pathologie :</strong> {selectedDisease}
            </div>
            <div>
              <strong>Couches actives :</strong> {layers.filter(l => l.visible).length} sur 8
            </div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Choisir le format d'exportation :</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setExportFormat('EXCEL')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                exportFormat === 'EXCEL'
                  ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-slate-900">Classeur Excel (.xlsx)</div>
                <div className="text-[11px] text-slate-500">5 onglets thématiques consolidés</div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('CSV')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                exportFormat === 'CSV'
                  ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-slate-900">Fichier CSV (.csv)</div>
                <div className="text-[11px] text-slate-500">Données tabulaires pour R / Python</div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('GEOJSON')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                exportFormat === 'GEOJSON'
                  ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-slate-900">Couche GeoJSON (.geojson)</div>
                <div className="text-[11px] text-slate-500">Pour SIG (QGIS, ArcGIS)</div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('PRINT')}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                exportFormat === 'PRINT'
                  ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-200'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Printer className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-slate-900">Fiche Imprimable / PDF</div>
                <div className="text-[11px] text-slate-500">Rapport de synthèse cartographique</div>
              </div>
            </button>
          </div>
        </div>

        {/* Scientific Confidentiality Disclaimer */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            Conformité éthique : Aucun nom, contact ou donnée nominative n'est inclus dans les exports.
          </span>
        </div>

        {/* Success Alert */}
        {exportSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fichier généré et téléchargé avec succès !</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Génération en cours...' : 'Télécharger l\'export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
