import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { detectTableDuplicates } from '../../utils/harmonizationEngine';
import { DuplicateCandidate } from '../../types';
import {
  Copy,
  CheckCircle2,
  Activity,
  CloudSun,
  Layers,
  Home,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';

export const DuplicateManagementSection: React.FC = () => {
  const {
    healthRecords,
    climateRecords,
    environmentalObs,
    householdSurveys,
    deleteHealthRecord,
    deleteClimateRecord,
    deleteEnvironmentalObservation,
    deleteHouseholdSurvey,
    addAuditLog
  } = useData();

  const [selectedTable, setSelectedTable] = useState<'ALL' | 'SANTE' | 'CLIMAT' | 'ENVIRONNEMENT' | 'MENAGE'>('ALL');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  // Detect duplicates across all domains
  const duplicates = useMemo(() => {
    const all = detectTableDuplicates(healthRecords, climateRecords, environmentalObs, householdSurveys);
    const filtered = selectedTable === 'ALL' ? all : all.filter(d => d.table === selectedTable);
    return filtered.filter(d => !resolvedIds.has(d.id));
  }, [healthRecords, climateRecords, environmentalObs, householdSurveys, selectedTable, resolvedIds]);

  const handleResolveDuplicate = (
    dup: DuplicateCandidate,
    action: 'KEEP_FIRST' | 'KEEP_SECOND' | 'IGNORE',
    justification: string
  ) => {
    const rec1 = dup.records[0];
    const rec2 = dup.records[1];

    if (action === 'KEEP_FIRST' && rec2) {
      // Soft-delete record 2
      if (dup.table === 'SANTE') deleteHealthRecord(rec2.id, justification);
      else if (dup.table === 'CLIMAT') deleteClimateRecord(rec2.id, justification);
      else if (dup.table === 'ENVIRONNEMENT') deleteEnvironmentalObservation(rec2.id, justification);
      else if (dup.table === 'MENAGE') deleteHouseholdSurvey(rec2.id, justification);
    } else if (action === 'KEEP_SECOND' && rec1) {
      // Soft-delete record 1
      if (dup.table === 'SANTE') deleteHealthRecord(rec1.id, justification);
      else if (dup.table === 'CLIMAT') deleteClimateRecord(rec1.id, justification);
      else if (dup.table === 'ENVIRONNEMENT') deleteEnvironmentalObservation(rec1.id, justification);
      else if (dup.table === 'MENAGE') deleteHouseholdSurvey(rec1.id, justification);
    }

    addAuditLog({
      entityType: dup.table === 'SANTE' ? 'HEALTH' : dup.table === 'CLIMAT' ? 'CLIMATE' : dup.table === 'ENVIRONNEMENT' ? 'ENVIRONMENTAL' : 'HOUSEHOLD',
      recordId: rec1?.id || dup.id,
      recordIdentifier: `${rec1?.id || 'R1'} vs ${rec2?.id || 'R2'}`,
      action: 'UPDATE',
      reason: `Résolution de doublon (${action}) : ${justification}`,
    });

    setResolvedIds(prev => new Set(prev).add(dup.id));
  };

  const getTableIcon = (table: string) => {
    switch (table) {
      case 'SANTE': return <Activity className="w-4 h-4 text-rose-600" />;
      case 'CLIMAT': return <CloudSun className="w-4 h-4 text-cyan-600" />;
      case 'ENVIRONNEMENT': return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'MENAGE': return <Home className="w-4 h-4 text-blue-600" />;
      default: return <Copy className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Copy className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Détection et Gestion des Doublons
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Identification automatique des collisions spatio-temporelles et fiches redondantes. Toute résolution s'effectue par <strong>suppression logique (is_deleted = TRUE)</strong> pour garantir l'intégrité historique.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
            <span>Doublons restants à traiter :</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {duplicates.length}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setSelectedTable('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedTable === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes les tables
          </button>
          <button
            onClick={() => setSelectedTable('SANTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'SANTE' ? 'bg-rose-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Santé
          </button>
          <button
            onClick={() => setSelectedTable('CLIMAT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'CLIMAT' ? 'bg-cyan-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            Climat
          </button>
          <button
            onClick={() => setSelectedTable('ENVIRONNEMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'ENVIRONNEMENT' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Environnement
          </button>
          <button
            onClick={() => setSelectedTable('MENAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              selectedTable === 'MENAGE' ? 'bg-blue-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Ménages
          </button>
        </div>
      </div>

      {/* Duplicate Candidate List */}
      {duplicates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Aucun doublon actif détecté</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Toutes les clés logiques (Lieu × Période × Source) sont univoques pour la table sélectionnée.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {duplicates.map((dup) => {
            const rec1 = dup.records[0];
            const rec2 = dup.records[1];
            return (
              <div
                key={dup.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      {getTableIcon(dup.table)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Doublon détecté sur la table {dup.table}
                      </span>
                      <span className="text-xs text-slate-500 block">
                        Clé logique : {dup.logical_key}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        dup.duplicate_status === 'DOUBLON_CERTAIN'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {dup.duplicate_status === 'DOUBLON_CERTAIN' ? 'DOUBLON CERTAIN' : 'DOUBLON POTENTIEL'}
                    </span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      Confiance : {dup.confidence_score}%
                    </span>
                  </div>
                </div>

                {/* Differences breakdown */}
                {dup.differences.length > 0 && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                    <strong className="block font-semibold">Différences constatées entre les fiches :</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {dup.differences.map((diff, i) => (
                        <li key={i}>{diff}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Side-by-side comparison box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  {/* Record 1 */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span className="font-mono">{rec1?.id || 'Fiche 1'} (Original)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">Base</span>
                    </div>
                    <pre className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded overflow-x-auto font-mono">
                      {JSON.stringify(rec1 || {}, null, 2)}
                    </pre>
                  </div>

                  {/* Record 2 */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span className="font-mono">{rec2?.id || 'Fiche 2'} (Candidat)</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">Doublon</span>
                    </div>
                    <pre className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded overflow-x-auto font-mono">
                      {JSON.stringify(rec2 || {}, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      handleResolveDuplicate(
                        dup,
                        'IGNORE',
                        'Enregistrements confirmés distincts après examen clinique/géographique'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                  >
                    Ignorer (Conserver les deux)
                  </button>
                  <button
                    onClick={() =>
                      handleResolveDuplicate(
                        dup,
                        'KEEP_FIRST',
                        `Doublon confirmé : conservation de ${rec1?.id || 'Fiche 1'} et archivage logique de ${rec2?.id || 'Fiche 2'}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition shadow-xs"
                  >
                    Conserver {rec1?.id || 'Fiche 1'} (Archiver {rec2?.id || 'Fiche 2'})
                  </button>
                  <button
                    onClick={() =>
                      handleResolveDuplicate(
                        dup,
                        'KEEP_SECOND',
                        `Mise à jour confirmée : conservation de ${rec2?.id || 'Fiche 2'} et archivage logique de ${rec1?.id || 'Fiche 1'}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
                  >
                    Conserver {rec2?.id || 'Fiche 2'} (Archiver {rec1?.id || 'Fiche 1'})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
