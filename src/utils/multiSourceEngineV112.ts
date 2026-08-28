import * as XLSX from 'xlsx';
import {
  DataSourceEntity,
  RawImportRecord,
  ColumnMappingItem,
  ImportQualityReport,
  DetectedDuplicate,
  OutlierRecord,
  CleanedDatasetRecord,
  DataLineageTrace,
  SynonymMappingItem,
  ReconciliationConfig,
  ReconciledCrossDatasetRow,
  CustomVariableDefinition
} from '../types';

/**
 * ============================================================================
 * ONE HEALTH KINDU — MOTEUR V1.12 D'INTÉGRATION ET PRÉPARATION MULTI-SOURCES
 * Parsing XLSX/CSV, Mapping, Détection d'erreurs, Normalisation & Rapprochement
 * ============================================================================
 */

// Bounding Box officielle de la Province du Maniema (RDC)
export const MANIEMA_BOUNDING_BOX = {
  minLat: -5.5,
  maxLat: -1.0,
  minLng: 24.5,
  maxLng: 29.0
};

/**
 * Parsing asynchrone d'un fichier Excel ou CSV
 */
export async function parseUploadedFile(file: File): Promise<{
  fileName: string;
  fileSize: number;
  format: 'EXCEL' | 'CSV';
  sheetNames: string[];
  columns: string[];
  rawRows: Record<string, any>[];
  detectedDelimiter?: string;
}> {
  return new Promise((resolve, reject) => {
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          throw new Error('Impossible de lire le contenu du fichier.');
        }

        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        if (rawJson.length === 0) {
          throw new Error('Le fichier sélectionné est vide ou ne contient aucune donnée.');
        }

        const columns = Object.keys(rawJson[0]);

        resolve({
          fileName: file.name,
          fileSize: file.size,
          format: isCsv ? 'CSV' : 'EXCEL',
          sheetNames: workbook.SheetNames,
          columns,
          rawRows: rawJson,
          detectedDelimiter: isCsv ? ',' : undefined
        });
      } catch (err: any) {
        reject(new Error(err.message || 'Erreur lors du traitement du fichier.'));
      }
    };

    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Détection automatique des correspondances de colonnes
 */
export function autoDetectColumnMappings(
  columns: string[],
  sampleRows: Record<string, any>[]
): ColumnMappingItem[] {
  return columns.map((col, index) => {
    const cleanCol = col.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    let targetCode = cleanCol;
    let targetName = col;
    let dimension: ColumnMappingItem['targetDimension'] = 'AUTRE';
    let targetType: ColumnMappingItem['targetType'] = 'STRING';
    let unit: string | undefined = undefined;
    let confidence = 0.5;
    let isAuto = false;
    let transformation: ColumnMappingItem['transformation'] = 'DIRECT';

    // 1. Détection DATE
    if (/date|jour|consult|releve|obs|notif|time|annee|mois/.test(cleanCol)) {
      targetCode = 'date_observation';
      targetName = 'Date de l’observation';
      dimension = 'SANTE';
      targetType = 'DATE';
      transformation = 'PARSE_DATE';
      confidence = 0.95;
      isAuto = true;
    }
    // 2. Détection ZONE DE SANTÉ
    else if (/zone|zs|health_zone|district/.test(cleanCol)) {
      targetCode = 'zone_sante';
      targetName = 'Zone de Santé (Maniema)';
      dimension = 'GEOGRAPHIE';
      targetType = 'ZONE_SANTE_CODE';
      transformation = 'SYNONYM_REPLACE';
      confidence = 0.98;
      isAuto = true;
    }
    // 3. Détection AIRE DE SANTÉ
    else if (/aire|as_name|health_area/.test(cleanCol)) {
      targetCode = 'aire_sante';
      targetName = 'Aire de Santé';
      dimension = 'GEOGRAPHIE';
      targetType = 'STRING';
      confidence = 0.90;
      isAuto = true;
    }
    // 4. Détection SEXE
    else if (/sexe|sex|gender/.test(cleanCol)) {
      targetCode = 'sexe';
      targetName = 'Sexe (M / F)';
      dimension = 'DEMOGRAPHIE';
      targetType = 'STRING';
      transformation = 'TO_UPPERCASE';
      confidence = 0.99;
      isAuto = true;
    }
    // 5. Détection ÂGE
    else if (/age|annee_age|age_ans/.test(cleanCol)) {
      targetCode = 'age_annees';
      targetName = 'Âge du patient';
      dimension = 'DEMOGRAPHIE';
      targetType = 'NUMBER';
      unit = 'ans';
      transformation = 'NUMERIC_PARSE';
      confidence = 0.95;
      isAuto = true;
    }
    // 6. Détection PATHOLOGIE / DIAGNOSTIC
    else if (/pathologie|maladie|diagnostic|disease|patho/.test(cleanCol)) {
      targetCode = 'pathology_code';
      targetName = 'Pathologie diagnostiquée';
      dimension = 'SANTE';
      targetType = 'PATHOLOGY_CODE';
      transformation = 'SYNONYM_REPLACE';
      confidence = 0.96;
      isAuto = true;
    }
    // 7. Détection COORDONNÉES GPS LATITUDE
    else if (/lat|latitude|lat_gps|gps_y/.test(cleanCol)) {
      targetCode = 'latitude';
      targetName = 'Latitude GPS (Décimale)';
      dimension = 'GEOGRAPHIE';
      targetType = 'GPS_LAT';
      unit = '°';
      confidence = 0.99;
      isAuto = true;
    }
    // 8. Détection COORDONNÉES GPS LONGITUDE
    else if (/lng|lon|longitude|long|lng_gps|gps_x/.test(cleanCol)) {
      targetCode = 'longitude';
      targetName = 'Longitude GPS (Décimale)';
      dimension = 'GEOGRAPHIE';
      targetType = 'GPS_LNG';
      unit = '°';
      confidence = 0.99;
      isAuto = true;
    }
    // 9. Détection PRÉCIPITATIONS / PLUIE
    else if (/pluie|precip|rainfall|pluviometrie/.test(cleanCol)) {
      targetCode = 'pluviometrie_mm';
      targetName = 'Précipitations journalières';
      dimension = 'CLIMAT';
      targetType = 'NUMBER';
      unit = 'mm';
      transformation = 'KEEP_MISSING_AS_NULL';
      confidence = 0.95;
      isAuto = true;
    }
    // 10. Détection TEMPÉRATURE
    else if (/temp|temperature|tmax|tmin|degre/.test(cleanCol)) {
      targetCode = 'temperature_celsius';
      targetName = 'Température (°C)';
      dimension = 'CLIMAT';
      targetType = 'NUMBER';
      unit = '°C';
      transformation = 'KEEP_MISSING_AS_NULL';
      confidence = 0.92;
      isAuto = true;
    }
    // 11. Détection HUMIDITÉ
    else if (/hum|humidite|humidity|rh/.test(cleanCol)) {
      targetCode = 'humidite_pct';
      targetName = 'Humidité Relative (%)';
      dimension = 'CLIMAT';
      targetType = 'NUMBER';
      unit = '%';
      confidence = 0.90;
      isAuto = true;
    }
    // 12. Détection GÎTES LARVAIRES
    else if (/gite|larve|anophele|aedes/.test(cleanCol)) {
      targetCode = 'gites_larvaires_presence';
      targetName = 'Présence de gîtes larvaires';
      dimension = 'ENVIRONNEMENT';
      targetType = 'BOOLEAN';
      confidence = 0.90;
      isAuto = true;
    }
    // 13. Détection DÉCHETS
    else if (/dechet|ordure|depotoir|salubrite/.test(cleanCol)) {
      targetCode = 'dechets_proximite_presence';
      targetName = 'Présence dépôts de déchets';
      dimension = 'ENVIRONNEMENT';
      targetType = 'BOOLEAN';
      confidence = 0.90;
      isAuto = true;
    }
    // 14. Détection SOURCE D'EAU
    else if (/eau|point_eau|source_eau|forage|fontaine/.test(cleanCol)) {
      targetCode = 'source_eau_type';
      targetName = 'Type de source d’eau';
      dimension = 'COMMUNAUTAIRE';
      targetType = 'STRING';
      confidence = 0.88;
      isAuto = true;
    }

    return {
      id: `MAP-ITEM-${index + 1}`,
      sourceColumn: col,
      targetVariableCode: targetCode,
      targetVariableName: targetName,
      targetDimension: dimension,
      targetType,
      unit,
      transformation,
      isAutoDetected: isAuto,
      confidenceScore: confidence,
      isUserConfirmed: isAuto && confidence >= 0.95,
      status: isAuto ? 'ASSOCIE' : 'AMBIGU'
    };
  });
}

/**
 * Calcul du rapport d'analyse de qualité de l'importation
 */
export function generateImportQualityReport(
  rawImportId: string,
  sourceId: string,
  rawRows: Record<string, any>[],
  mappings: ColumnMappingItem[],
  studyPeriodStart: number = 2018,
  studyPeriodEnd: number = 2026
): ImportQualityReport {
  const totalRows = rawRows.length;
  const totalColumns = mappings.length;

  let validDatesCount = 0;
  let missingDatesCount = 0;
  let invalidDatesCount = 0;
  let outOfStudyDatesCount = 0;

  let validGpsCount = 0;
  let missingGpsCount = 0;
  let outOfBoundsGpsCount = 0;

  const outliers: OutlierRecord[] = [];
  const detectedDuplicates: DetectedDuplicate[] = [];
  const blockingErrors: string[] = [];
  const warnings: string[] = [];

  // Trouver les colonnes associées aux types clés
  const dateCol = mappings.find(m => m.targetType === 'DATE')?.sourceColumn;
  const latCol = mappings.find(m => m.targetType === 'GPS_LAT')?.sourceColumn;
  const lngCol = mappings.find(m => m.targetType === 'GPS_LNG')?.sourceColumn;
  const ageCol = mappings.find(m => m.targetVariableCode === 'age_annees')?.sourceColumn;
  const tempCol = mappings.find(m => m.targetVariableCode === 'temperature_celsius')?.sourceColumn;
  const rainCol = mappings.find(m => m.targetVariableCode === 'pluviometrie_mm')?.sourceColumn;

  // Dictionnaire pour détecter les doublons potentiels (clé composite date + premiers champs discriminants)
  const seenKeyMap = new Map<string, number[]>();

  rawRows.forEach((row, idx) => {
    // 1. Analyse des Dates
    if (dateCol) {
      const rawDate = row[dateCol];
      if (rawDate === null || rawDate === undefined || rawDate === '' || rawDate === 'MANQUANT' || rawDate === 'INCONNU') {
        missingDatesCount++;
      } else {
        const parsed = new Date(rawDate);
        if (isNaN(parsed.getTime())) {
          invalidDatesCount++;
        } else {
          validDatesCount++;
          const year = parsed.getFullYear();
          if (year < studyPeriodStart || year > studyPeriodEnd) {
            outOfStudyDatesCount++;
          }
        }
      }
    }

    // 2. Analyse GPS
    if (latCol && lngCol) {
      const rawLat = parseFloat(row[latCol]);
      const rawLng = parseFloat(row[lngCol]);

      if (isNaN(rawLat) || isNaN(rawLng)) {
        missingGpsCount++; // Ne jamais inventer de GPS, compté comme manquant
      } else {
        if (
          rawLat >= MANIEMA_BOUNDING_BOX.minLat &&
          rawLat <= MANIEMA_BOUNDING_BOX.maxLat &&
          rawLng >= MANIEMA_BOUNDING_BOX.minLng &&
          rawLng <= MANIEMA_BOUNDING_BOX.maxLng
        ) {
          validGpsCount++;
        } else {
          outOfBoundsGpsCount++;
          outliers.push({
            rowIndex: idx,
            column: `${latCol},${lngCol}`,
            value: `Lat: ${rawLat}, Lng: ${rawLng}`,
            reason: 'Coordonnées GPS en dehors des limites territoriales du Maniema.',
            severity: 'WARNING'
          });
        }
      }
    }

    // 3. Analyse des Outliers Âge
    if (ageCol) {
      const rawAge = parseFloat(row[ageCol]);
      if (!isNaN(rawAge) && (rawAge < 0 || rawAge > 115)) {
        outliers.push({
          rowIndex: idx,
          column: ageCol,
          value: rawAge,
          reason: `Âge biologiquement improbable (${rawAge} ans).`,
          severity: 'WARNING'
        });
      }
    }

    // 4. Analyse Température Outliers
    if (tempCol) {
      const rawTemp = parseFloat(row[tempCol]);
      if (!isNaN(rawTemp) && (rawTemp < 10 || rawTemp > 50)) {
        outliers.push({
          rowIndex: idx,
          column: tempCol,
          value: rawTemp,
          reason: `Température extrême atypique pour Kindu (${rawTemp} °C).`,
          severity: 'WARNING'
        });
      }
    }

    // 5. Détection des Doublons
    const compositeKeyParts: string[] = [];
    if (dateCol && row[dateCol]) compositeKeyParts.push(String(row[dateCol]));
    mappings.slice(0, 3).forEach(m => {
      if (row[m.sourceColumn] !== null && row[m.sourceColumn] !== undefined) {
        compositeKeyParts.push(String(row[m.sourceColumn]).trim().toLowerCase());
      }
    });

    if (compositeKeyParts.length >= 2) {
      const key = compositeKeyParts.join('___');
      const existing = seenKeyMap.get(key);
      if (existing) {
        existing.push(idx);
      } else {
        seenKeyMap.set(key, [idx]);
      }
    }
  });

  // Construction des groupes de doublons
  let duplicateGroupsCount = 0;
  seenKeyMap.forEach((indices, key) => {
    if (indices.length > 1) {
      duplicateGroupsCount += indices.length - 1;
      if (detectedDuplicates.length < 10) {
        const sampleRow = rawRows[indices[0]];
        detectedDuplicates.push({
          id: `DUP-${detectedDuplicates.length + 1}`,
          rowIndices: indices,
          keyValues: {
            ligne_1: indices[0] + 1,
            ligne_2: indices[1] + 1,
            cle_comparaison: key.replace(/___/g, ' • ')
          },
          similarityScore: 0.95,
          resolution: 'CONSERVER',
          justification: 'En attente de décision de l’analyste (non supprimé automatiquement).'
        });
      }
    }
  });

  // Contrôles bloquants et avertissements
  if (totalRows === 0) {
    blockingErrors.push('Le fichier ne contient aucune ligne de données.');
  }

  const recognizedVariablesCount = mappings.filter(m => m.status === 'ASSOCIE').length;
  const unknownVariablesCount = mappings.filter(m => m.status !== 'ASSOCIE').length;

  if (recognizedVariablesCount === 0) {
    blockingErrors.push('Aucune variable n’a pu être mappée avec le référentiel One Health.');
  }

  if (missingDatesCount > 0) {
    warnings.push(`${missingDatesCount} dates non renseignées (conservées comme MANQUANTES).`);
  }

  if (outOfStudyDatesCount > 0) {
    warnings.push(`${outOfStudyDatesCount} observations antérieures ou postérieures à la période d'étude (${studyPeriodStart}–${studyPeriodEnd}).`);
  }

  if (missingGpsCount > 0) {
    warnings.push(`${missingGpsCount} enregistrements sans coordonnées GPS (laissés NULL, non inventés).`);
  }

  if (duplicateGroupsCount > 0) {
    warnings.push(`${duplicateGroupsCount} doublons potentiels détectés nécessitant arbitrage.`);
  }

  // Score de qualité calculé
  let calculatedScore = 100;
  if (totalRows > 0) {
    const datePenalty = (missingDatesCount / totalRows) * 15 + (invalidDatesCount / totalRows) * 25;
    const gpsPenalty = (outOfBoundsGpsCount / totalRows) * 20;
    const dupPenalty = Math.min((duplicateGroupsCount / totalRows) * 20, 15);
    const outlierPenalty = Math.min((outliers.length / totalRows) * 10, 10);
    calculatedScore = Math.max(10, Math.round((100 - datePenalty - gpsPenalty - dupPenalty - outlierPenalty) * 10) / 10);
  }

  return {
    id: `REP-${Date.now()}`,
    rawImportId,
    sourceId,
    totalRows,
    totalColumns,
    validDatesCount,
    missingDatesCount,
    invalidDatesCount,
    outOfStudyDatesCount,
    validGpsCount,
    missingGpsCount,
    outOfBoundsGpsCount,
    duplicateRowsCount: duplicateGroupsCount,
    detectedDuplicates,
    outliersCount: outliers.length,
    outliers,
    recognizedVariablesCount,
    unknownVariablesCount,
    blockingErrors,
    warnings,
    canImport: blockingErrors.length === 0,
    calculatedScore,
    generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
}

/**
 * Normalisation stricte vers le dataset CLEANED
 * Règle d'or : Donnée manquante = null, jamais 0.
 */
export function normalizeRawToCleaned(
  rawImport: RawImportRecord,
  sourceEntity: DataSourceEntity,
  mappings: ColumnMappingItem[],
  synonyms: SynonymMappingItem[],
  operatorName: string
): {
  cleanedRecords: CleanedDatasetRecord[];
  lineageTraces: DataLineageTrace[];
} {
  const cleanedRecords: CleanedDatasetRecord[] = [];
  const lineageTraces: DataLineageTrace[] = [];

  const dateCol = mappings.find(m => m.targetType === 'DATE')?.sourceColumn;
  const zoneCol = mappings.find(m => m.targetType === 'ZONE_SANTE_CODE')?.sourceColumn;
  const aireCol = mappings.find(m => m.targetVariableCode === 'aire_sante')?.sourceColumn;
  const latCol = mappings.find(m => m.targetType === 'GPS_LAT')?.sourceColumn;
  const lngCol = mappings.find(m => m.targetType === 'GPS_LNG')?.sourceColumn;
  const pathoCol = mappings.find(m => m.targetType === 'PATHOLOGY_CODE')?.sourceColumn;

  rawImport.rawContentData.forEach((row, idx) => {
    // 1. Normalisation Date
    let normalizedDate: string | null = null;
    let normalizedYear: number | null = null;
    let normalizedMonth: number | null = null;

    if (dateCol && row[dateCol]) {
      const d = new Date(row[dateCol]);
      if (!isNaN(d.getTime())) {
        normalizedDate = d.toISOString().substring(0, 10);
        normalizedYear = d.getFullYear();
        normalizedMonth = d.getMonth() + 1;
      }
    }

    // 2. Normalisation Zone de Santé & Synonymes
    let zoneSanteId: string | null = null;
    let zoneSanteName: string | null = null;
    if (zoneCol && row[zoneCol]) {
      const rawZone = String(row[zoneCol]).trim();
      const matchedSynonym = synonyms.find(
        s => s.category === 'ZONE_SANTE' && s.sourceVariant.toLowerCase() === rawZone.toLowerCase()
      );
      if (matchedSynonym) {
        zoneSanteId = matchedSynonym.standardTarget;
        zoneSanteName = matchedSynonym.standardLabel;
      } else {
        zoneSanteName = rawZone;
        zoneSanteId = `GEO_ZS_${rawZone.toUpperCase().replace(/\s+/g, '_')}`;
      }
    }

    // 3. Normalisation GPS (Garantir null si manquant, jamais 0.0)
    let lat: number | null = null;
    let lng: number | null = null;
    if (latCol && lngCol) {
      const parsedLat = parseFloat(row[latCol]);
      const parsedLng = parseFloat(row[lngCol]);
      if (!isNaN(parsedLat) && parsedLat >= MANIEMA_BOUNDING_BOX.minLat && parsedLat <= MANIEMA_BOUNDING_BOX.maxLat) {
        lat = parsedLat;
      }
      if (!isNaN(parsedLng) && parsedLng >= MANIEMA_BOUNDING_BOX.minLng && parsedLng <= MANIEMA_BOUNDING_BOX.maxLng) {
        lng = parsedLng;
      }
    }

    // 4. Normalisation Pathologie & Synonymes
    let pathologyCode: string | null = null;
    let pathologyName: string | null = null;
    if (pathoCol && row[pathoCol]) {
      const rawPatho = String(row[pathoCol]).trim();
      const matchedPathoSynonym = synonyms.find(
        s => s.category === 'PATHOLOGIE' && s.sourceVariant.toLowerCase() === rawPatho.toLowerCase()
      );
      if (matchedPathoSynonym) {
        pathologyCode = matchedPathoSynonym.standardTarget;
        pathologyName = matchedPathoSynonym.standardLabel;
      } else {
        pathologyName = rawPatho;
        pathologyCode = rawPatho.toUpperCase().replace(/\s+/g, '_');
      }
    }

    // 5. Construction des valeurs de variables avec conservation des NULLs
    const values: Record<string, any> = {};
    const missingFieldCodes: string[] = [];

    mappings.forEach(m => {
      const rawVal = row[m.sourceColumn];
      if (rawVal === null || rawVal === undefined || rawVal === '' || rawVal === 'MANQUANT' || rawVal === 'INCONNU' || rawVal === 'NA') {
        values[m.targetVariableCode] = null; // MANQUANT EXPLICITE (JAMAIS 0)
        missingFieldCodes.push(m.targetVariableCode);
      } else {
        if (m.targetType === 'NUMBER') {
          const num = parseFloat(rawVal);
          values[m.targetVariableCode] = isNaN(num) ? null : num;
        } else if (m.targetType === 'BOOLEAN') {
          const s = String(rawVal).toLowerCase().trim();
          values[m.targetVariableCode] = s === 'oui' || s === 'true' || s === '1' || s === 'yes' || s === 'positif';
        } else {
          values[m.targetVariableCode] = rawVal;
        }

        // Trace de lignage
        if (idx < 50) {
          lineageTraces.push({
            id: `LIN-${rawImport.id}-${idx}-${m.targetVariableCode}`,
            sourceId: sourceEntity.id,
            sourceName: sourceEntity.name,
            rawImportId: rawImport.id,
            importNumber: rawImport.importNumber,
            fileName: rawImport.fileName,
            rowIndex: idx + 1,
            originalColumn: m.sourceColumn,
            originalValue: rawVal,
            normalizedVariable: m.targetVariableCode,
            normalizedValue: values[m.targetVariableCode],
            transformationApplied: m.transformation || 'DIRECT',
            timestamp: new Date().toISOString(),
            operator: operatorName
          });
        }
      }
    });

    cleanedRecords.push({
      id: `CLN-${rawImport.id}-${idx + 1}`,
      rawImportId: rawImport.id,
      sourceId: sourceEntity.id,
      sourceType: sourceEntity.type,
      sourceName: sourceEntity.name,
      originalRowIndex: idx + 1,
      normalizedDate,
      normalizedYear,
      normalizedMonth,
      geographicLevel: sourceEntity.geographicLevel,
      zoneSanteId,
      zoneSanteName,
      aireSanteId: aireCol && row[aireCol] ? `AS_${String(row[aireCol]).toUpperCase()}` : null,
      aireSanteName: aireCol && row[aireCol] ? String(row[aireCol]) : null,
      siteVillageName: row['site_nom'] || row['nom_village'] || null,
      latitude: lat,
      longitude: lng,
      pathologyCode,
      pathologyName,
      dataTier: 'CLEANED',
      values,
      missingFieldCodes,
      isDuplicateResolved: false,
      dataQualityFlag: missingFieldCodes.length > 0 ? 'DONNEE_MANQUANTE_PRESERVEE' : 'VALIDE',
      isDemo: sourceEntity.isDemo,
      createdAt: new Date().toISOString()
    });
  });

  return { cleanedRecords, lineageTraces };
}

/**
 * Exportation d'un rapport de validation et dataset en classeur Excel
 */
export function exportMultiSourceToExcel(
  cleanedRecords: CleanedDatasetRecord[],
  qualityReport: ImportQualityReport,
  rawImport: RawImportRecord,
  sourceEntity: DataSourceEntity
) {
  const wb = XLSX.utils.book_new();

  // 1. Feuille Données Nettoyées
  const cleanedRows = cleanedRecords.map(r => ({
    ID_ENREGISTREMENT: r.id,
    SOURCE: r.sourceName,
    DATE_NORMALISEE: r.normalizedDate || 'MANQUANTE',
    ANNEE: r.normalizedYear ?? 'MANQUANT',
    MOIS: r.normalizedMonth ?? 'MANQUANT',
    ZONE_SANTE: r.zoneSanteName || 'NON RENSEIGNEE',
    AIRE_SANTE: r.aireSanteName || 'NON RENSEIGNEE',
    LATITUDE: r.latitude ?? 'NON DISPONIBLE',
    LONGITUDE: r.longitude ?? 'NON DISPONIBLE',
    PATHOLOGIE: r.pathologyName || 'NON SPECIFIEE',
    ...r.values,
    CHAMPS_MANQUANTS: r.missingFieldCodes.join(', ') || 'AUCUN'
  }));

  const wsCleaned = XLSX.utils.json_to_sheet(cleanedRows);
  XLSX.utils.book_append_sheet(wb, wsCleaned, 'DONNEES_NETTOYEES_CLEANED');

  // 2. Feuille Rapport Qualité
  const reportRows = [
    { PARAMETRE: 'Fichier Source', VALEUR: rawImport.fileName },
    { PARAMETRE: 'Identifiant Import', VALEUR: rawImport.importNumber },
    { PARAMETRE: 'Source Productrice', VALEUR: sourceEntity.name },
    { PARAMETRE: 'Organisme / Responsable', VALEUR: sourceEntity.organization },
    { PARAMETRE: 'Total Lignes Traitées', VALEUR: qualityReport.totalRows },
    { PARAMETRE: 'Total Colonnes Mappées', VALEUR: qualityReport.totalColumns },
    { PARAMETRE: 'Dates Valides', VALEUR: qualityReport.validDatesCount },
    { PARAMETRE: 'Dates Manquantes (Non converties en 0)', VALEUR: qualityReport.missingDatesCount },
    { PARAMETRE: 'Coordonnées GPS Valides', VALEUR: qualityReport.validGpsCount },
    { PARAMETRE: 'GPS Manquants (Non inventés)', VALEUR: qualityReport.missingGpsCount },
    { PARAMETRE: 'Doublons Potentiels Détectés', VALEUR: qualityReport.duplicateRowsCount },
    { PARAMETRE: 'Valeurs Aberrantes / Extrêmes', VALEUR: qualityReport.outliersCount },
    { PARAMETRE: 'Score Global de Qualité', VALEUR: `${qualityReport.calculatedScore} %` },
    { PARAMETRE: 'Statut Intégration', VALEUR: qualityReport.canImport ? 'VALIDE & CONFORME' : 'BLOQUE' },
    { PARAMETRE: 'Règle Fondamentale', VALEUR: 'DONNEE ABSENTE != ZERO (Respect strict One Health Maniema)' }
  ];

  const wsReport = XLSX.utils.json_to_sheet(reportRows);
  XLSX.utils.book_append_sheet(wb, wsReport, 'RAPPORT_QUALITE');

  // Génération du fichier binaire et téléchargement
  XLSX.writeFile(wb, `OneHealth_Maniema_Import_${rawImport.id}_${Date.now()}.xlsx`);
}
