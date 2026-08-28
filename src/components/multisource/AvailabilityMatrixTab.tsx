import React, { useState } from 'react';
import { DataAvailabilityMatrixRow, OneHealthDimension } from '../../types';
import {
  Calendar,
  Layers,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Database,
  Activity,
  CloudRain,
  Users,
  Search
} from 'lucide-react';

interface AvailabilityMatrixTabProps {
  matrixRows: DataAvailabilityMatrixRow[];
}

export const AvailabilityMatrixTab: React.FC<AvailabilityMatrixTabProps> = ({
  matrixRows
}) => {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const [selectedDimension, setSelectedDimension] = useState<string>('TOUTES');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCellInfo, setSelectedCellInfo] = useState<{
    variable: string;
    year: number;
    dimension: string;
    status: 'DISPONIBLE' | 'PARTIEL' | 'ABSENT';
    obsCount: number;
    coveragePct: number;
    sources: string[];
    isMissingNotZero: boolean;
  } | null>(null);

  const filteredRows = matrixRows.filter(row => {
    const matchDim = selectedDimension === 'TOUTES' || row.dimension === selectedDimension;
    const matchSearch = row.variableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDim && matchSearch;
  });

  const getDimensionIcon = (dim: OneHealthDimension) => {
    switch (dim) {
      case 'SANTE':
        return <Activity className="w-3.5 h-3.5 text-rose-500" />;
      case 'CLIMAT':
        return <CloudRain className="w-3.5 h-3.5 text-cyan-500" />;
      case 'ENVIRONNEMENT':
        return <Layers className="w-3.5 h-3.5 text-emerald-500" />;
      case 'COMMUNAUTAIRE':
        return <Users className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Database className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: 'DISPONIBLE' | 'PARTIEL' | 'ABSENT') => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200';
      case 'PARTIEL':
        return 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
      case 'ABSENT':
        return 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Matrice de Disponibilité Multi-Annuelle des Données (2018–2026)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisation continue des couvertures temporelles par variable. Règle absolue : une variable absente est identifiée comme <strong>ABSENTE</strong> et jamais comme zéro.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-3 h-3" /> Disponible (≥80%)
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              <AlertCircle className="w-3 h-3" /> Partiel (1-79%)
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              <XCircle className="w-3 h-3" /> Absent (0%)
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer les variables One Health..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="TOUTES">Toutes les dimensions (One Health)</option>
              <option value="SANTE">Santé (Pathologies)</option>
              <option value="CLIMAT">Climat & Météorologie</option>
              <option value="ENVIRONNEMENT">Environnement & Gîtes</option>
              <option value="COMMUNAUTAIRE">Communautaire & WASH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200 w-72">Variable / Pathologie</th>
                <th className="px-3 py-3 border-b border-slate-200 w-28">Dimension</th>
                {years.map(yr => (
                  <th key={yr} className="px-2 py-3 border-b border-slate-200 text-center font-mono">
                    {yr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRows.map((row) => (
                <tr key={row.variableOrPathologyId} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-2.5 font-medium text-slate-900">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs">{row.variableName}</span>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{row.category}</span>
                        <span>•</span>
                        <span className="font-mono text-teal-700 font-semibold">{row.unit}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      {getDimensionIcon(row.dimension)}
                      {row.dimension}
                    </span>
                  </td>

                  {years.map(yr => {
                    const cell = row.yearlyStatus[yr] || {
                      status: 'ABSENT',
                      observationsCount: 0,
                      coveragePercentage: 0,
                      sources: [],
                      isMissingNotZero: true
                    };

                    return (
                      <td key={yr} className="px-1.5 py-2.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedCellInfo({
                              variable: row.variableName,
                              year: yr,
                              dimension: row.dimension,
                              status: cell.status,
                              obsCount: cell.observationsCount,
                              coveragePct: cell.coveragePercentage,
                              sources: cell.sources.length > 0 ? cell.sources : row.sourceNames,
                              isMissingNotZero: cell.isMissingNotZero
                            });
                          }}
                          className={`w-full py-1.5 px-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${getStatusBadge(
                            cell.status
                          )}`}
                          title={`${row.variableName} (${yr}) : ${cell.status} (${cell.coveragePercentage}%)`}
                        >
                          {cell.status === 'DISPONIBLE' && `${cell.coveragePercentage}%`}
                          {cell.status === 'PARTIEL' && `${cell.coveragePercentage}%`}
                          {cell.status === 'ABSENT' && '—'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Cell Detailed Modal / Banner */}
      {selectedCellInfo && (
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-700 shadow-md space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 font-bold text-xs uppercase tracking-wider">
                Détail de Disponibilité Temporelle
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                Année {selectedCellInfo.year}
              </span>
            </div>
            <button
              onClick={() => setSelectedCellInfo(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">VARIABLE</span>
              <strong className="text-white text-sm">{selectedCellInfo.variable}</strong>
              <p className="text-[11px] text-teal-300 mt-0.5">Dimension : {selectedCellInfo.dimension}</p>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">STATUT DE COUVERTURE</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mt-1 ${
                selectedCellInfo.status === 'DISPONIBLE'
                  ? 'bg-emerald-900 text-emerald-300 border border-emerald-600'
                  : selectedCellInfo.status === 'PARTIEL'
                  ? 'bg-amber-900 text-amber-300 border border-amber-600'
                  : 'bg-slate-800 text-slate-400 border border-slate-600'
              }`}>
                {selectedCellInfo.status} ({selectedCellInfo.coveragePct}%)
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">OBSERVATIONS ENREGISTRÉES</span>
              <strong className="text-white text-sm">
                {selectedCellInfo.obsCount.toLocaleString()}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">SOURCES CONTRIBUANTES</span>
              <p className="text-[11px] text-slate-300 truncate">
                {selectedCellInfo.sources.join(', ') || 'Aucune'}
              </p>
            </div>
          </div>

          <div className="text-[11px] bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong>Garantie Méthodologique :</strong> Pour l'année {selectedCellInfo.year}, toute valeur non collectée est stockée en tant que donnée manquante (NULL) et n'est pas traitée comme un taux nul (0).
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
