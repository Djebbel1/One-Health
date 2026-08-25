import React, { useState, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  CheckCircle2,
  Filter,
  Layers,
  ShieldCheck,
  Calendar,
  Building2,
  Database
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';

export const HealthExportTab: React.FC = () => {
  const { healthRecords, healthFacilities } = useData();

  // Export filters
  const [exportYear, setExportYear] = useState<number | 'ALL'>('ALL');
  const [exportDisease, setExportDisease] = useState<'ALL' | 'PALUDISME' | 'FIEVRE_TYPHOIDE'>('ALL');
  const [exportArea, setExportArea] = useState<string>('ALL');
  const [exportStatus, setExportStatus] = useState<string>('ALL');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return healthRecords.filter(r => {
      if (exportYear !== 'ALL' && r.year !== exportYear) return false;
      if (exportDisease !== 'ALL' && r.disease !== exportDisease) return false;
      if (exportArea !== 'ALL' && r.health_area_id !== exportArea) return false;
      if (exportStatus !== 'ALL' && r.status !== exportStatus) return false;
      return true;
    });
  }, [healthRecords, exportYear, exportDisease, exportArea, exportStatus]);

  // 1. Export Excel Multi-Tabs (.xlsx)
  const exportMultiTabExcel = () => {
    setIsExporting(true);

    try {
      const wb = XLSX.utils.book_new();

      // TAB 1: Fiches Sanitaires
      const fichesData = filteredRecords.map(r => ({
        'ID_Fiche': r.health_record_id || r.id,
        'Statut_Validation': r.status,
        'Zone_Sante': r.zone_id,
        'Aire_Sante': r.health_area_id,
        'Structure_Sante': r.facility_name || r.structure_name,
        'Annee': r.year,
        'Mois': r.month,
        'Periode_Type': r.period_type || 'MOIS',
        'Date_Observation': r.record_date || r.date,
        'Pathologie': r.disease,
        'Classification_Cas': r.case_classification || (r.diagnostic_status === 'CONFIRMED' ? 'CONFIRME' : 'PROBABLE'),
        'Methode_Diagnostic': r.diagnostic_method || 'TDR',
        'Groupe_Age': r.age_group || 'TOUS ÂGES',
        'Sexe': r.sex_category || 'TOTAL',
        'Nombre_Cas': r.cases,
        'Hospitalisations': r.hospitalizations === 'UNKNOWN' ? 'INCONNU' : r.hospitalizations,
        'Deces': r.deaths === 'UNKNOWN' ? 'INCONNU' : r.deaths,
        'Type_Source': r.data_source_type || r.data_source,
        'Reference_Registre': r.source_reference || '',
        'Qualite_Donnee': r.data_quality || 'HIGH',
        'Enregistre_Par': r.registered_by || r.created_by || 'Enquêteur',
        'Valide_Par': r.validated_by || '',
        'Observations': r.notes || r.comments || '',
        'Date_Creation': r.createdAt || '',
      }));
      const ws1 = XLSX.utils.json_to_sheet(fichesData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Fiches_Sanitaires');

      // TAB 2: Synthèse par Aire de Santé
      const syntheseData = KINDU_HEALTH_AREAS.map(area => {
        const areaRecs = filteredRecords.filter(r => r.health_area_id === area.id);
        let palu = 0;
        let typhoide = 0;
        let hosp = 0;
        let deaths = 0;

        areaRecs.forEach(r => {
          if (r.disease === 'PALUDISME') palu += r.cases || 0;
          if (r.disease === 'FIEVRE_TYPHOIDE') typhoide += r.cases || 0;
          if (typeof r.hospitalizations === 'number') hosp += r.hospitalizations;
          if (typeof r.deaths === 'number') deaths += r.deaths;
        });

        const total = palu + typhoide;
        const incidence = area.population > 0 ? Math.round((palu / area.population) * 1000) : 0;

        return {
          'Aire_Sante_ID': area.id,
          'Nom_Aire_Sante': area.name,
          'Zone_Sante': area.zoneId,
          'Population_Totale': area.population,
          'Total_Cas_Paludisme': palu,
          'Total_Cas_Typhoide': typhoide,
          'Cumul_Cas': total,
          'Incidence_Palu_Pour_1000_Hab': incidence,
          'Total_Hospitalisations': hosp,
          'Total_Deces': deaths,
        };
      });
      const ws2 = XLSX.utils.json_to_sheet(syntheseData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Synthese_Aires_Sante');

      // TAB 3: Annuaire Structures
      const structuresData = healthFacilities.map(f => ({
        'Structure_ID': f.facility_id,
        'Nom_Structure': f.facility_name,
        'Type': f.facility_type,
        'Zone_Sante': f.zone_id,
        'Aire_Sante': f.health_area_id,
        'Latitude': f.latitude,
        'Longitude': f.longitude,
        'Adresse': f.address || '',
        'Statut': f.status,
      }));
      const ws3 = XLSX.utils.json_to_sheet(structuresData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Annuaire_Structures');

      // TAB 4: Journal des Corrections
      const correctionsData = healthRecords.flatMap(r =>
        (r.corrections || []).map(c => ({
          'Correction_ID': c.id,
          'Fiche_ID': c.record_id,
          'Champ_Modifie': c.field_name,
          'Valeur_Originale': c.original_value,
          'Valeur_Corrigee': c.corrected_value,
          'Motif_Correction': c.correction_reason,
          'Auteur_Correction': c.corrected_by,
          'Date_Correction': c.corrected_at,
        }))
      );
      const ws4 = XLSX.utils.json_to_sheet(correctionsData.length > 0 ? correctionsData : [{ 'Info': 'Aucune correction enregistrée' }]);
      XLSX.utils.book_append_sheet(wb, ws4, 'Journal_Corrections');

      // Download
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `onehealth_kindu_donnees_sanitaires_v1.3_${dateStr}.xlsx`);

      setSuccessMessage('Fichier Excel multi-onglets généré et téléchargé avec succès.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la génération du fichier Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export CSV Standardisé (.csv)
  const exportStandardCSV = () => {
    setIsExporting(true);

    try {
      const csvRows = filteredRecords.map(r => ({
        'ID_Fiche': r.health_record_id || r.id,
        'Statut': r.status,
        'Zone': r.zone_id,
        'Aire_Sante': r.health_area_id,
        'Structure': r.facility_name || r.structure_name,
        'Annee': r.year,
        'Mois': r.month,
        'Date': r.record_date || r.date,
        'Pathologie': r.disease,
        'Classification': r.case_classification || 'CONFIRME',
        'Methode': r.diagnostic_method || 'TDR',
        'Groupe_Age': r.age_group || 'TOUS ÂGES',
        'Sexe': r.sex_category || 'TOTAL',
        'Cas': r.cases,
        'Hospitalisations': r.hospitalizations === 'UNKNOWN' ? 'INCONNU' : r.hospitalizations,
        'Deces': r.deaths === 'UNKNOWN' ? 'INCONNU' : r.deaths,
        'Type_Source': r.data_source_type || r.data_source,
        'Reference': r.source_reference || '',
        'Qualite': r.data_quality || 'HIGH',
      }));

      const ws = XLSX.utils.json_to_sheet(csvRows);
      const csvContent = XLSX.utils.sheet_to_csv(ws, { FS: ';' });

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `onehealth_kindu_sanitaire_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage('Fichier CSV standardisé téléchargé avec succès.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'export CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export GeoJSON Spatiale
  const exportGeoJSON = () => {
    setIsExporting(true);

    try {
      const features = healthFacilities
        .filter(f => f.latitude && f.longitude)
        .map(f => {
          const matchingRecs = filteredRecords.filter(r =>
            r.facility_id === f.facility_id || (r.facility_name || r.structure_name) === f.facility_name
          );

          let palu = 0;
          let typhoide = 0;
          let hosp = 0;
          let deaths = 0;

          matchingRecs.forEach(r => {
            if (r.disease === 'PALUDISME') palu += r.cases || 0;
            if (r.disease === 'FIEVRE_TYPHOIDE') typhoide += r.cases || 0;
            if (typeof r.hospitalizations === 'number') hosp += r.hospitalizations;
            if (typeof r.deaths === 'number') deaths += r.deaths;
          });

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [f.longitude, f.latitude],
            },
            properties: {
              facility_id: f.facility_id,
              facility_name: f.facility_name,
              facility_type: f.facility_type,
              zone_id: f.zone_id,
              health_area_id: f.health_area_id,
              total_records: matchingRecs.length,
              paludisme_cases: palu,
              typhoide_cases: typhoide,
              total_cases: palu + typhoide,
              hospitalizations: hosp,
              deaths: deaths,
            },
          };
        });

      const geoJsonDoc = {
        type: 'FeatureCollection',
        name: 'OneHealth_Kindu_HealthFacilities_Layer',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features,
      };

      const blob = new Blob([JSON.stringify(geoJsonDoc, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `onehealth_kindu_structures_geo_${dateStr}.geojson`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage('Couche spatiale GeoJSON exportée avec succès pour QGIS / SIG.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'export GeoJSON.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Exportation & Archivage des Données Sanitaires (V1.3)
          </h2>
          <p className="text-xs text-slate-500">
            Exports certifiés pour rapports épidémiologiques, modélisations statistiques et SIG (Kindu)
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Before Export */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtres d'Exportation ({filteredRecords.length} fiches sélectionnées)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Total en base : {healthRecords.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Année</label>
            <select
              value={exportYear}
              onChange={(e) => setExportYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les années</option>
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pathologie</label>
            <select
              value={exportDisease}
              onChange={(e) => setExportDisease(e.target.value as any)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes (Paludisme & Typhoïde)</option>
              <option value="PALUDISME">Paludisme uniquement</option>
              <option value="FIEVRE_TYPHOIDE">Fièvre Typhoïde uniquement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Aire de Santé</label>
            <select
              value={exportArea}
              onChange={(e) => setExportArea(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Toutes les 8 Aires de Santé</option>
              {KINDU_HEALTH_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Statut</label>
            <select
              value={exportStatus}
              onChange={(e) => setExportStatus(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="VALIDATED">Validées uniquement</option>
              <option value="UNDER_REVIEW">En attente de revue</option>
              <option value="IMPORTED">Importées brutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EXCEL */}
        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-emerald-400 shadow-xs transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Classeur Excel (.xlsx)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comprend 4 onglets : Fiches détaillées, Synthèse par aire de santé, Annuaire des structures et Journal d'audit des corrections.
            </p>
          </div>

          <button
            onClick={exportMultiTabExcel}
            disabled={isExporting}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Excel (.xlsx)</span>
          </button>
        </div>

        {/* CSV */}
        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-400 shadow-xs transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">CSV Standardisé (.csv)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format délimité (point-virgule) encodé en UTF-8 BOM, compatible R, Python, Stata, SPSS et Excel.
            </p>
          </div>

          <button
            onClick={exportStandardCSV}
            disabled={isExporting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger CSV (.csv)</span>
          </button>
        </div>

        {/* GEOJSON */}
        <div className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-purple-400 shadow-xs transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 text-purple-700 rounded-xl w-fit">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Couche SIG (.geojson)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Données géoréférencées par structure sanitaire et aire de santé, directement importables dans QGIS et ArcGIS.
            </p>
          </div>

          <button
            onClick={exportGeoJSON}
            disabled={isExporting}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger GeoJSON (.geojson)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
