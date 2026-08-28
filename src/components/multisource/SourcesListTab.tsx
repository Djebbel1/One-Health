import React, { useState } from 'react';
import {
  DataSourceEntity,
  DataSourceType,
  CoverageLevelType,
  SourceStatusType
} from '../../types';
import {
  Database,
  Filter,
  Search,
  Plus,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Activity,
  CloudRain,
  Globe,
  Users
} from 'lucide-react';

interface SourcesListTabProps {
  sources: DataSourceEntity[];
  onSelectSource: (source: DataSourceEntity) => void;
  onOpenAddSource: () => void;
  onOpenImporterWithSource: (sourceId: string) => void;
}

export const SourcesListTab: React.FC<SourcesListTabProps> = ({
  sources,
  onSelectSource,
  onOpenAddSource,
  onOpenImporterWithSource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('TOUS');
  const [selectedCoverage, setSelectedCoverage] = useState<string>('TOUS');

  const filteredSources = sources.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'TOUS' || s.type === selectedType;
    const matchesCoverage = selectedCoverage === 'TOUS' || s.coverageLevel === selectedCoverage;
    return matchesSearch && matchesType && matchesCoverage;
  });

  const getTypeIcon = (type: DataSourceType) => {
    switch (type) {
      case 'SANITAIRE':
        return <Activity className="w-4 h-4 text-rose-500" />;
      case 'CLIMATIQUE':
        return <CloudRain className="w-4 h-4 text-cyan-500" />;
      case 'ENVIRONNEMENTALE':
        return <Layers className="w-4 h-4 text-emerald-500" />;
      case 'GEOGRAPHIQUE':
        return <Globe className="w-4 h-4 text-indigo-500" />;
      case 'COMMUNAUTAIRE':
        return <Users className="w-4 h-4 text-amber-500" />;
      default:
        return <Database className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTypeBadgeClass = (type: DataSourceType) => {
    switch (type) {
      case 'SANITAIRE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CLIMATIQUE':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'ENVIRONNEMENTALE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'GEOGRAPHIQUE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'COMMUNAUTAIRE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Référentiel des Sources One Health ({sources.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inventaire exhaustif des sources sanitaires, climatiques, environnementales et communautaires intégrables.
            </p>
          </div>

          <button
            onClick={onOpenAddSource}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Déclarer une Nouvelle Source</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, organisme, mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="TOUS">Tous les types de sources</option>
              <option value="SANITAIRE">Sanitaire (FOSA, SNIS, Labo)</option>
              <option value="CLIMATIQUE">Climatique (Mettelsat, Satellite)</option>
              <option value="ENVIRONNEMENTALE">Environnementale (Gîtes, Déchets)</option>
              <option value="GEOGRAPHIQUE">Géographique / SIG</option>
              <option value="COMMUNAUTAIRE">Communautaire (Enquêtes ménages)</option>
              <option value="AUTRE">Autre source</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="TOUS">Toutes les couvertures</option>
              <option value="COMPLETE">Couverture Complète</option>
              <option value="PARTIELLE">Couverture Partielle</option>
              <option value="PONCTUELLE">Couverture Ponctuelle / Enquête</option>
              <option value="DISCONTINUE">Couverture Discontinue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Sources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header: Type Badge & Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTypeBadgeClass(source.type)}`}>
                  {getTypeIcon(source.type)}
                  {source.type}
                </span>

                <div className="flex items-center gap-1.5">
                  {source.isInternal ? (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                      Interne V1.11
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-full">
                      Externe ({source.format})
                    </span>
                  )}
                  {source.isDemo && (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold rounded-sm">
                      DEMO
                    </span>
                  )}
                </div>
              </div>

              {/* Source Title & Subtype */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {source.name}
                </h4>
                <p className="text-xs text-teal-700 font-medium mt-0.5">
                  {source.subType}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2">
                {source.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate" title={source.organization}>{source.organization}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">
                    {source.periodStart} – {source.periodEnd}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Niveau : {source.geographicLevel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Qualité : <strong className="text-slate-800">{source.estimatedQuality}</strong></span>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Imports : <strong>{source.totalImportsCount}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectSource(source)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Détails
                </button>
                <button
                  onClick={() => onOpenImporterWithSource(source.id)}
                  className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Importer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
