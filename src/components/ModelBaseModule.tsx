import React, { useState, useMemo } from 'react';
import {
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BookOpen,
  Sparkles,
  Info,
  Calendar,
  Activity
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { compileModelMatrix } from '../utils/modelMatrixCompiler';
import {
  exportFullExcelWorkbook,
  exportCsv,
  exportGeoJson,
  exportVariablesCodebook
} from '../utils/exportUtils';
import { KINDU_HEALTH_AREAS } from '../data/kinduGeography';

export const ModelBaseModule: React.FC = () => {
  const { householdSurveys, environmentalObs, healthRecords, climateRecords } = useData();

  const [filterYear, setFilterYear] = useState<string>('ALL');
  const [filterArea, setFilterArea] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'MATRIX' | 'DICTIONARY' | 'EXPORT'>('MATRIX');

  // Compile the full spatio-temporal modeling matrix
  const modelMatrix = useMemo(() => {
    return compileModelMatrix(householdSurveys, environmentalObs, healthRecords, climateRecords);
  }, [householdSurveys, environmentalObs, healthRecords, climateRecords]);

  // Filtered rows
  const filteredMatrix = useMemo(() => {
    return modelMatrix.filter(row => {
      if (filterYear !== 'ALL' && String(row.year) !== filterYear) return false;
      if (filterArea !== 'ALL' && row.health_area_id !== filterArea) return false;
      return true;
    });
  }, [modelMatrix, filterYear, filterArea]);

  // Handlers for Exports
  const handleExportExcel = () => {
    exportFullExcelWorkbook(householdSurveys, environmentalObs, healthRecords, climateRecords);
  };

  const handleExportMatrixCsv = () => {
    exportCsv(modelMatrix, 'OneHealth_Kindu_Base_Modele_SpatioTemporelle');
  };

  const handleExportHouseholdsGeoJson = () => {
    exportGeoJson(householdSurveys, 'OneHealth_Kindu_Menages_GeoJSON');
  };

  const handleExportEnvObsGeoJson = () => {
    exportGeoJson(environmentalObs, 'OneHealth_Kindu_ObsEnvironnementales_GeoJSON');
  };

  const handleExportCodebook = () => {
    exportVariablesCodebook();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              <span>Base Modèle Spatio-Temporelle & Hub d'Exportation</span>
            </h2>
            <p className="text-xs text-slate-500">
              Compilation matricielle unifiée par Aire de Santé et Mois (2020–2024) pour analyse sous R / INLA / GLMM
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-excel-main"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exporter Pack Excel (.xlsx)</span>
            </button>

            <button
              onClick={handleExportMatrixCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition"
            >
              <FileText className="w-4 h-4" />
              <span>CSV Modèle</span>
            </button>
          </div>
        </div>

        {/* Scientific Compliance Alert */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Validation Scientifique de la Matrice :</strong>
            Les observations environnementales sont projetées <strong>strictement</strong> sur les mois où elles étaient attestées comme valides. Les données individuelles ménages sont agrégées sous forme de proportions spatiales sans aucune divulgation de coordonnées nominatives (Zéro PII).
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'MATRIX'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Matrice Spatio-Temporelle ({filteredMatrix.length} lignes)</span>
        </button>

        <button
          onClick={() => setActiveTab('DICTIONARY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'DICTIONARY'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dictionnaire des Variables & Méthodologie</span>
        </button>

        <button
          onClick={() => setActiveTab('EXPORT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'EXPORT'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Centre d'Exportation Multi-Formats</span>
        </button>
      </div>

      {/* TAB 1: MATRIX VIEW */}
      {activeTab === 'MATRIX' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Toutes les années (2020 - 2024)</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            <div>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="ALL">Toutes les Aires de Santé ({KINDU_HEALTH_AREAS.length})</option>
                {KINDU_HEALTH_AREAS.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-3 py-3">Unité Spatiale & Période</th>
                    <th className="px-3 py-3">Paludisme (Cas / Incid.‰)</th>
                    <th className="px-3 py-3">Fièvre Typhoïde (Cas / Incid.‰)</th>
                    <th className="px-3 py-3">Pluie (mm)</th>
                    <th className="px-3 py-3">Temp. Moy (°C)</th>
                    <th className="px-3 py-3">Humidité (%)</th>
                    <th className="px-3 py-3">Gîtes Larvaires Actifs</th>
                    <th className="px-3 py-3">Couv. MILD (%)</th>
                    <th className="px-3 py-3">Eau Protégée (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrix.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-slate-400">
                        Aucune ligne matricielle ne correspond aux critères.
                      </td>
                    </tr>
                  ) : (
                    filteredMatrix.map((r, idx) => (
                      <tr key={`${r.health_area_id}-${r.year}-${r.month}`} className="hover:bg-slate-50/80 transition">
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-slate-900 block">{r.health_area_name}</span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {String(r.month).padStart(2, '0')}/{r.year}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-rose-800">{r.malaria_cases} cas</span>
                          <span className="text-[11px] text-slate-500 block">
                            ({r.malaria_incidence_per_1000.toFixed(1)} ‰)
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-teal-800">{r.typhoid_cases} cas</span>
                          <span className="text-[11px] text-slate-500 block">
                            ({r.typhoid_incidence_per_1000.toFixed(2)} ‰)
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-bold text-sky-800">
                          {(r.rainfall_mm ?? 0).toFixed(1)} mm
                        </td>
                        <td className="px-3 py-2.5 text-slate-800 font-medium">
                          {(r.temp_mean_c ?? r.temp_mean ?? 26.0).toFixed(1)} °C
                        </td>
                        <td className="px-3 py-2.5 text-slate-700">
                          {(r.humidity_pct ?? r.humidity_percent ?? 75).toFixed(0)} %
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-slate-800">
                          {r.active_breeding_sites_count ?? r.valid_stagnant_water_obs ?? 0} gîte(s)
                          {r.flood_presence && (
                            <span className="text-[10px] text-rose-600 block">Crue active</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-emerald-800">
                          {((r.bednet_coverage_rate ?? r.pct_bednet_usage ?? 0) * 100).toFixed(0)} %
                        </td>
                        <td className="px-3 py-2.5 font-medium text-indigo-800">
                          {((r.protected_water_access_rate ?? r.pct_water_improved ?? 0) * 100).toFixed(0)} %
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

      {/* TAB 2: VARIABLE CODEBOOK */}
      {activeTab === 'DICTIONARY' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Dictionnaire des Variables pour Modélisation Épidémiologique
              </h3>
              <p className="text-xs text-slate-500">
                Protocole de standardisation des variables dépendantes, covariables environnementales et climatiques
              </p>
            </div>
            <button
              onClick={handleExportCodebook}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger (.csv)</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Variable</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Unité / Format</th>
                    <th className="p-3">Description & Rôle Épidémiologique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-800">health_area_id</td>
                    <td className="p-3">Categorical</td>
                    <td className="p-3 font-mono">AS_MIKELENGE, ...</td>
                    <td className="p-3">Identifiant unique de l'Aire de Santé (Niveau spatial d'analyse)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-emerald-800">year / month</td>
                    <td className="p-3">Integer</td>
                    <td className="p-3 font-mono">2020-2024 / 1-12</td>
                    <td className="p-3">Période temporelle discrète (Niveau temporel)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-rose-800">malaria_cases</td>
                    <td className="p-3">Count (Integer)</td>
                    <td className="p-3">Nombre de cas</td>
                    <td className="p-3"><strong>Variable Réponse :</strong> Cas mensuels de paludisme confirmés biologiquement</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-teal-800">typhoid_cases</td>
                    <td className="p-3">Count (Integer)</td>
                    <td className="p-3">Nombre de cas</td>
                    <td className="p-3"><strong>Variable Réponse :</strong> Cas mensuels de fièvre typhoïde notifiés</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-sky-800">rainfall_mm</td>
                    <td className="p-3">Continuous</td>
                    <td className="p-3">Millimètres (mm)</td>
                    <td className="p-3">Précipitations mensuelles cumulées (Lag potentiel 1-2 mois)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-amber-800">temp_mean_c</td>
                    <td className="p-3">Continuous</td>
                    <td className="p-3">Degrés Celsius (°C)</td>
                    <td className="p-3">Température moyenne de l'air (Cycle de sporogonie du vecteur)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">active_breeding_sites_count</td>
                    <td className="p-3">Count</td>
                    <td className="p-3">Nombre gîtes</td>
                    <td className="p-3">Gîtes larvaires temporaires ou permanents actifs sur la période exacte</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">bednet_coverage_rate</td>
                    <td className="p-3">Proportion</td>
                    <td className="p-3">0.00 à 1.00 (0-100%)</td>
                    <td className="p-3">Taux de ménages possédant au moins 1 MILD dans l'aire de santé</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">protected_water_access_rate</td>
                    <td className="p-3">Proportion</td>
                    <td className="p-3">0.00 à 1.00 (0-100%)</td>
                    <td className="p-3">Proportion de ménages ayant accès à une source d'eau potable protégée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT CENTER */}
      {activeTab === 'EXPORT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Card 1: Excel Multi-Tab */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cahier de Données Excel Complet (.xlsx)</h4>
                <p className="text-xs text-slate-500">6 onglets formatés avec métadonnées scientifiques</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Contient la base modèle, les enquêtes ménages brutes anonymisées, les observations environnementales avec périodes de validité, les données cliniques, le climat et le dictionnaire.
            </p>
            <button
              onClick={handleExportExcel}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Télécharger le fichier Excel (.xlsx)
            </button>
          </div>

          {/* Card 2: CSV Model Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Matrice Modèle CSV (R / Python / Stata)</h4>
                <p className="text-xs text-slate-500">Tableau plat prêt pour modélisation statistique</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Format UTF-8 standard avec séparateur virgule, compatible direct avec <code>read.csv()</code> sous R pour les modèles INLA, GLMM et séries temporelles.
            </p>
            <button
              onClick={handleExportMatrixCsv}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Télécharger Matrice CSV (.csv)
            </button>
          </div>

          {/* Card 3: GeoJSON GIS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Couches Spatiales GeoJSON (QGIS / ArcGIS)</h4>
                <p className="text-xs text-slate-500">Points géoréférencés WGS84 EPSG:4326</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Exportez les points d'enquêtes ménages ou les gîtes larvaires pour cartographie thématique et interpolation spatiale sous QGIS.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportHouseholdsGeoJson}
                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
              >
                Ménages GeoJSON
              </button>
              <button
                onClick={handleExportEnvObsGeoJson}
                className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
              >
                Facteurs Env GeoJSON
              </button>
            </div>
          </div>

          {/* Card 4: Codebook & Metadata */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dictionnaire des Variables (.csv)</h4>
                <p className="text-xs text-slate-500">Standardisation et définitions méthodologiques</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Fichier de métadonnées pour annexes de thèses et publications universitaires conformément aux exigences FAIR Data.
            </p>
            <button
              onClick={handleExportCodebook}
              className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Télécharger Dictionnaire (.csv)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
