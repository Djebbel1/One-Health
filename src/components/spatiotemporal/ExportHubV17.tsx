import React from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Share2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  exportSpatiotemporalV17Excel,
  exportSpatiotemporalV17Json,
  exportToCSV,
  exportGeoJson,
  exportVariablesCodebook
} from '../../utils/exportUtils';

export const ExportHubV17: React.FC = () => {
  const {
    spatiotemporalUnits,
    healthSpatiotemporal,
    climateSpatiotemporal,
    environmentSpatiotemporal,
    washSpatiotemporal,
    householdAggregates,
    integratedSpatiotemporalData,
    modelReadyData,
    dataQualityChecks,
    dataSources,
    householdSurveys,
    environmentalObs,
  } = useData();

  const handleExportFullExcel = () => {
    exportSpatiotemporalV17Excel(
      spatiotemporalUnits,
      healthSpatiotemporal,
      climateSpatiotemporal,
      environmentSpatiotemporal,
      washSpatiotemporal,
      householdAggregates,
      integratedSpatiotemporalData,
      modelReadyData,
      dataQualityChecks,
      dataSources
    );
  };

  const handleExportJson = () => {
    const payload = {
      app: 'ONE HEALTH KINDU - Base Spatio-Temporelle V1.7',
      exported_at: new Date().toISOString(),
      metadata: {
        spatial_scope: 'Kindu (Maniema, RDC)',
        primary_unit: 'Aire de Sante x Mois',
        total_units: spatiotemporalUnits.length,
        model_ready_rows: modelReadyData.length,
      },
      tables: {
        SPATIOTEMPORAL_UNIT: spatiotemporalUnits,
        HEALTH_SPATIOTEMPORAL: healthSpatiotemporal,
        CLIMATE_SPATIOTEMPORAL: climateSpatiotemporal,
        ENVIRONMENT_SPATIOTEMPORAL: environmentSpatiotemporal,
        WASH_SPATIOTEMPORAL: washSpatiotemporal,
        HOUSEHOLD_AGGREGATE: householdAggregates,
        INTEGRATED_SPATIOTEMPORAL_DATA: integratedSpatiotemporalData,
        MODEL_READY_DATA: modelReadyData,
        DATA_QUALITY_CHECK: dataQualityChecks,
        DATA_SOURCE: dataSources,
      },
    };
    exportSpatiotemporalV17Json(payload, 'ONE_HEALTH_KINDU_V17_FULL_DATABASE');
  };

  const handleExportModelReadyCsv = () => {
    exportToCSV(modelReadyData, 'MODEL_READY_DATA_ONE_HEALTH_KINDU');
  };

  const handleExportIntegratedCsv = () => {
    exportToCSV(integratedSpatiotemporalData, 'INTEGRATED_SPATIOTEMPORAL_DATA_KINDU');
  };

  const handleExportGeoJson = () => {
    exportGeoJson(environmentalObs, 'ONE_HEALTH_KINDU_ENVIRONMENTAL_GIS');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-700" />
              <span>Centre d'Exportation Multi-Formats — Version 1.7</span>
            </h3>
            <p className="text-xs text-slate-500">
              Génération des classeurs multi-tables, matrices pour modélisation biostatistique (R, Python, INLA) et couches SIG.
            </p>
          </div>

          <button
            id="btn-export-v17-excel-master"
            onClick={handleExportFullExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Télécharger Classeur Complet Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Pack Excel Multi-Feuilles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Classeur Excel Multi-Feuilles</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contient les 9 feuilles consolidées : MODEL_READY_DATA, BASE_INTEGREE, UNITES, SANTE, CLIMAT, ENVIRONNEMENT, WASH, QUALITE et SOURCES.
            </p>
          </div>
          <button
            onClick={handleExportFullExcel}
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger (.xlsx)</span>
          </button>
        </div>

        {/* Card 2: Matrice CSV Model Ready (R / INLA / Python) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Matrice CSV MODEL_READY_DATA</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format plat délimité point-virgule prêt pour l'importation directe dans R (packages <code>INLA</code>, <code>glmmTMB</code>, <code>mgcv</code>) et Python Pandas.
            </p>
          </div>
          <button
            onClick={handleExportModelReadyCsv}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger CSV Modèle ({modelReadyData.length} lignes)</span>
          </button>
        </div>

        {/* Card 3: Base Intégrée Complète CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Base Spatio-Temporelle Intégrée CSV</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensemble complet des 360 unités spatio-temporelles avec toutes les variables sanitaires, climatiques, environnementales et WASH brutes.
            </p>
          </div>
          <button
            onClick={handleExportIntegratedCsv}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger CSV Intégré</span>
          </button>
        </div>

        {/* Card 4: Archive JSON Complète */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Package JSON Base Complète</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export hiérarchique au standard JSON contenant les métadonnées de recherche, toutes les tables et l'historique des audits de qualité.
            </p>
          </div>
          <button
            onClick={handleExportJson}
            className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger Package JSON</span>
          </button>
        </div>

        {/* Card 5: Couches SIG GeoJSON */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Couches Cartographiques GeoJSON</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Données géoréférencées in situ des observations environnementales et infrastructures pour QGIS, ArcGIS et Mapbox.
            </p>
          </div>
          <button
            onClick={handleExportGeoJson}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger GeoJSON</span>
          </button>
        </div>

        {/* Card 6: Dictionnaire des Variables & Codebook */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Dictionnaire & Codebook</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Documentation exhaustive des noms de variables, types biostatistiques, unités de mesure et règles de validation associées.
            </p>
          </div>
          <button
            onClick={exportVariablesCodebook}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger Codebook CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
