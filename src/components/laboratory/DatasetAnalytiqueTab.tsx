import React, { useState } from 'react';
import {
  Database,
  Download,
  Filter,
  Layers,
  ShieldCheck,
  Calculator,
  FileSpreadsheet,
  AlertCircle,
  Tag
} from 'lucide-react';
import { ScientificAnalysisProject, AnalysisDatasetRecord } from '../../types';
import { ScientificAnalysisEngineV114 } from '../../utils/scientificAnalysisEngineV114';

interface Props {
  activeAnalysis: ScientificAnalysisProject;
}

export const DatasetAnalytiqueTab: React.FC<Props> = ({ activeAnalysis }) => {
  const engine = ScientificAnalysisEngineV114.getInstance();
  const records = engine.getRecordsByAnalysisId(activeAnalysis.id);

  const [incidenceFactor, setIncidenceFactor] = useState<number>(100000);
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredRecords = records.filter(r => {
    if (filterZone !== 'ALL' && r.zoneId !== filterZone) return false;
    if (searchTerm && !r.dateStr.includes(searchTerm) && !r.zoneName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = [
      'RecordID',
      'Date',
      'Annee',
      'Mois',
      'ZoneID',
      'ZoneNom',
      'Pathologie',
      'NouveauxCas',
      'PopulationRisque',
      `Incidence_${incidenceFactor}`,
      'Pluie_mm',
      'Temp_C',
      'Humidite_pct',
      'Dechets_Sauvages',
      'StatutDonnee',
      'EstProxy'
    ];

    const rows = filteredRecords.map(r => {
      const incVal = r.populationAtRisk ? Math.round((r.newCases / r.populationAtRisk) * incidenceFactor * 10) / 10 : 'N/A';
      return [
        r.recordId,
        r.dateStr,
        r.year,
        r.month,
        r.zoneId,
        `"${r.zoneName}"`,
        r.pathology,
        r.newCases,
        r.populationAtRisk || 'N/A',
        incVal,
        r.rainfallMm ?? 'NULL',
        r.temperatureC ?? 'NULL',
        r.humidityPct ?? 'NULL',
        r.wasteDumpPresent === null ? 'NULL' : r.wasteDumpPresent ? 'OUI' : 'NON',
        r.dataStatus,
        r.isProxy ? 'OUI' : 'NON'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeAnalysis.code}_DATASET.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                {activeAnalysis.code}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                VUE CONTRÔLÉE
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{activeAnalysis.datasetMetadata.datasetName}</h3>
            <p className="text-xs text-slate-500">
              {filteredRecords.length} enregistrements auditables | {activeAnalysis.datasetMetadata.columnsCount} dimensions actives
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Exporter le Dataset (CSV)
            </button>
          </div>
        </div>

        {/* Dynamic Calculator & Transformations Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-700">Facteur d incidence :</span>
            <div className="flex items-center gap-1">
              {[1000, 10000, 100000].map(fact => (
                <button
                  key={fact}
                  onClick={() => setIncidenceFactor(fact)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                    incidenceFactor === fact
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  / {fact.toLocaleString()} hab.
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Zone :</span>
            <select
              value={filterZone}
              onChange={e => setFilterZone(e.target.value)}
              className="px-2 py-1 rounded border border-slate-300 text-xs font-semibold"
            >
              <option value="ALL">Toutes les zones</option>
              {activeAnalysis.geographicScope.selectedZones.map((zId, i) => (
                <option key={zId} value={zId}>
                  {activeAnalysis.geographicScope.selectedZoneNames[i] || zId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preservation & Integrity Banner */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-emerald-950">Intégrité des Bases Primaires Respectée (Règle V1.14) :</strong>
          <span>
            Ce dataset analytique est une vue projetée strictement isolée. Les tables <strong>RAW (données brutes d importation)</strong> et <strong>CLEANED (données harmonisées)</strong> demeurent inchangées et scellées.
          </span>
        </div>
      </div>

      {/* Dataset Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Matrice Analytique de Données ({filteredRecords.length} lignes)
          </span>
          <span className="text-[11px] text-slate-500">
            Dénominateur incidence : Population FOSA projetée
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
              <tr>
                <th className="p-3">ID Enregistrement</th>
                <th className="p-3">Période</th>
                <th className="p-3">Zone de Santé</th>
                <th className="p-3 text-center">Pathologie</th>
                <th className="p-3 text-right">Nouveaux Cas</th>
                <th className="p-3 text-right">Pop. Risque</th>
                <th className="p-3 text-right font-bold text-indigo-700">
                  Incidence (/{incidenceFactor.toLocaleString()})
                </th>
                <th className="p-3 text-right">Pluie (mm)</th>
                <th className="p-3 text-right">Temp (°C)</th>
                <th className="p-3 text-right">Humidité (%)</th>
                <th className="p-3 text-center">Décharge Kasuku</th>
                <th className="p-3 text-center">Statut Donnée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRecords.map(r => {
                const incValue = r.populationAtRisk
                  ? Math.round((r.newCases / r.populationAtRisk) * incidenceFactor * 10) / 10
                  : null;

                return (
                  <tr key={r.recordId} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-mono font-bold text-slate-600">{r.recordId}</td>
                    <td className="p-3 font-semibold">{r.dateStr}</td>
                    <td className="p-3">{r.zoneName}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {r.pathology}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">{r.newCases.toLocaleString()}</td>
                    <td className="p-3 text-right text-slate-500">
                      {r.populationAtRisk ? r.populationAtRisk.toLocaleString() : 'N/D'}
                    </td>
                    <td className="p-3 text-right font-bold text-indigo-600">
                      {incValue !== null ? incValue : 'Non calculable'}
                    </td>
                    <td className="p-3 text-right">{r.rainfallMm !== null ? `${r.rainfallMm} mm` : <span className="text-slate-400 italic">NULL</span>}</td>
                    <td className="p-3 text-right">{r.temperatureC !== null ? `${r.temperatureC} °C` : <span className="text-slate-400 italic">NULL</span>}</td>
                    <td className="p-3 text-right">{r.humidityPct !== null ? `${r.humidityPct} %` : <span className="text-slate-400 italic">NULL</span>}</td>
                    <td className="p-3 text-center">
                      {r.wasteDumpPresent === null ? (
                        <span className="text-slate-400 font-mono italic">NULL (Absente)</span>
                      ) : r.wasteDumpPresent ? (
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bold text-[10px]">OUI (Active)</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">NON (Nettoyé/Bâti)</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {r.isProxy ? (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 rounded font-black text-[10px]" title={r.proxyNote}>
                          PROXY
                        </span>
                      ) : r.dataStatus === 'MANQUANTE_NULL' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                          MANQUANTE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          OBSERVÉE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
