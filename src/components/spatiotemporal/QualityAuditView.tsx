import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Layers,
  Database,
  Filter,
  Search,
  RotateCcw,
  Check,
  EyeOff
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { QualityCheckStatus, QualitySeverity } from '../../types';

export const QualityAuditView: React.FC = () => {
  const { dataQualityChecks, resolveQualityCheck, integratedSpatiotemporalData, dataSources } = useData();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Metrics
  const metrics = useMemo(() => {
    const totalUnits = integratedSpatiotemporalData.length;
    const completeUnits = integratedSpatiotemporalData.filter(r => r.data_completeness >= 80).length;
    const incompleteUnits = totalUnits - completeUnits;
    
    const conflicts = dataQualityChecks.filter(c => c.check_type === 'CONFLIT_TEMPOREL');
    const duplicates = dataQualityChecks.filter(c => c.check_type === 'DOUBLON_POTENTIEL');
    const geoErrors = dataQualityChecks.filter(c => c.check_type === 'HORS_ZONE_ETUDE' || c.check_type === 'ERREUR_GEOGRAPHIQUE');
    const dateErrors = dataQualityChecks.filter(c => c.check_type === 'ERREUR_DATE');

    return {
      totalUnits,
      completeUnits,
      incompleteUnits,
      conflictsCount: conflicts.length,
      duplicatesCount: duplicates.length,
      geoErrorsCount: geoErrors.length,
      dateErrorsCount: dateErrors.length,
      totalIssues: dataQualityChecks.length,
      sourcesCount: dataSources.length,
    };
  }, [integratedSpatiotemporalData, dataQualityChecks, dataSources]);

  // Filtered Quality Checks
  const filteredChecks = useMemo(() => {
    return dataQualityChecks.filter(c => {
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!c.message.toLowerCase().includes(q) && !c.table_name.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [dataQualityChecks, severityFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 9 Key Indicators Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Units */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Unités Spatio-Temp.</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{metrics.totalUnits}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">10 Aires × 36 Mois</div>
        </div>

        {/* Card 2: Complete Data */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Données Complètes</div>
          <div className="text-xl font-bold text-emerald-800 mt-1 font-mono">{metrics.completeUnits}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Complétude ≥ 80%</div>
        </div>

        {/* Card 3: Incomplete Data */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Données Incomplètes</div>
          <div className="text-xl font-bold text-amber-800 mt-1 font-mono">{metrics.incompleteUnits}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Variables partielles</div>
        </div>

        {/* Card 4: Conflicts */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">Conflits Temporels</div>
          <div className="text-xl font-bold text-rose-800 mt-1 font-mono">{metrics.conflictsCount}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Signalés pour arbitrage</div>
        </div>

        {/* Card 5: Duplicates */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wide">Doublons Potentiels</div>
          <div className="text-xl font-bold text-indigo-800 mt-1 font-mono">{metrics.duplicatesCount}</div>
          <div className="text-[10px] text-indigo-600 mt-0.5">Non supprimés auto</div>
        </div>

        {/* Card 6: Geo Errors */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-purple-700 uppercase tracking-wide">Erreurs Géo GPS</div>
          <div className="text-xl font-bold text-purple-800 mt-1 font-mono">{metrics.geoErrorsCount}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">Hors emprise Kindu</div>
        </div>

        {/* Card 7: Date Errors */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-orange-700 uppercase tracking-wide">Erreurs Calendrier</div>
          <div className="text-xl font-bold text-orange-800 mt-1 font-mono">{metrics.dateErrorsCount}</div>
          <div className="text-[10px] text-orange-600 mt-0.5">Incohérences de dates</div>
        </div>

        {/* Card 8: Data Sources */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Sources Officielles</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">{metrics.sourcesCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SNIS, METTELSAT, UNIKI</div>
        </div>

        {/* Card 9: Scientific Rigor Status */}
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">Audit Intégrité</div>
          <div className="text-sm font-bold text-emerald-900 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>CONFORME V1.7</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">Audit actif en temps réel</div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher message d'audit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="ALL">Toutes Sévérités</option>
              <option value="ERREUR">Erreurs Critiques</option>
              <option value="AVERTISSEMENT">Avertissements</option>
              <option value="INFORMATION">Informations</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            >
              <option value="ALL">Tous Statuts</option>
              <option value="DETECTE">Détecté</option>
              <option value="VALIDE">Validé / Résolu</option>
              <option value="IGNORE">Ignoré</option>
              <option value="CORRIGE">Corrigé</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {filteredChecks.length} alertes filtrées
        </div>
      </div>

      {/* Quality Checks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Registre des Contrôles de Qualité, Conflits et Doublons (DATA_QUALITY_CHECK)
            </h4>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredChecks.length > 0 ? (
            filteredChecks.map(check => {
              const isError = check.severity === 'ERREUR';
              const isWarn = check.severity === 'AVERTISSEMENT';

              return (
                <div key={check.id} className="p-4 hover:bg-slate-50/80 transition flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="mt-0.5 shrink-0">
                      {isError ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      ) : (
                        <Info className="w-5 h-5 text-sky-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-slate-900">{check.id}</span>
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-bold ${
                          isError
                            ? 'bg-rose-100 text-rose-800'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}>
                          {check.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700 font-mono text-[10px]">
                          {check.table_name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Réf: {check.record_id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        {check.message}
                      </p>
                      {check.suggested_action && (
                        <p className="text-[11px] text-slate-500 italic">
                          Action recommandée : {check.suggested_action}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions to arbitrate / resolve */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      check.status === 'VALIDE' || check.status === 'CORRIGE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : check.status === 'IGNORE'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {check.status}
                    </span>

                    {check.status === 'DETECTE' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => resolveQualityCheck(check.id, 'VALIDE')}
                          title="Valider / Confirmer"
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Valider</span>
                        </button>
                        <button
                          onClick={() => resolveQualityCheck(check.id, 'IGNORE')}
                          title="Ignorer cette anomalie"
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Ignorer</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Aucune anomalie ou conflit détecté avec les filtres sélectionnés.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
