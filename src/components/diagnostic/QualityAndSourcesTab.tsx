import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Info,
  Database,
  Building,
  Check,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { VariableDiagnosticProfile, SourceReliabilityLevel } from '../../types';
import {
  CompletenessThresholds,
  DEFAULT_COMPLETENESS_THRESHOLDS,
  globalDiagnosticEngine
} from '../../utils/scientificDiagnosticEngineV113';

interface QualityAndSourcesTabProps {
  profiles: VariableDiagnosticProfile[];
}

export const QualityAndSourcesTab: React.FC<QualityAndSourcesTabProps> = ({ profiles }) => {
  const [thresholds, setThresholds] = useState<CompletenessThresholds>(globalDiagnosticEngine.getThresholds());
  const [isEditingThresholds, setIsEditingThresholds] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<VariableDiagnosticProfile>(profiles[0]);

  const handleResetThresholds = () => {
    setThresholds({ ...DEFAULT_COMPLETENESS_THRESHOLDS });
    globalDiagnosticEngine.setThresholds({ ...DEFAULT_COMPLETENESS_THRESHOLDS });
    setIsEditingThresholds(false);
  };

  const handleSaveThresholds = () => {
    globalDiagnosticEngine.setThresholds(thresholds);
    setIsEditingThresholds(false);
  };

  const getSourceReliabilityBadge = (level: SourceReliabilityLevel) => {
    switch (level) {
      case 'TRES_FIABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">TRÈS FIABLE (Officielle/Normée)</span>;
      case 'FIABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-900 border border-teal-300">FIABLE (Validée)</span>;
      case 'ACCEPTABLE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">ACCEPTABLE (Transversale)</span>;
      case 'LIMITEE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">LIMITÉE (Sporadique)</span>;
      case 'INCONNUE':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-900 border border-slate-300">INCONNUE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Principle Banner: Completeness Score vs Quality Score */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Distinction Fondamentale : Score de Complétude vs Score de Qualité Scientifique
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Database className="w-4 h-4 text-indigo-600" />
              1. Score de Complétude (Taux de remplissage)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Mesure la proportion de cellules renseignées dans l'espace-temps sans préjuger de la validité scientifique de la mesure (ex: un registre rempli à 100% avec de faux positifs a 100% de complétude).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              2. Score de Qualité Scientifique (0 à 100)
            </div>
            <p className="text-emerald-900 leading-relaxed">
              Évalue la rigueur méthodologique, la traçabilité de la source, la précision spatio-temporelle et l'absence de biais taxonomique ou diagnostique.
            </p>
          </div>
        </div>
      </div>

      {/* Configurable Thresholds & Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profiles & Scores Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Évaluation de Qualité & Fiabilité des Sources par Variable
              </h4>
              <p className="text-xs text-slate-500">
                Sélectionnez une variable pour inspecter la répartition exacte de ses statuts de données.
              </p>
            </div>
            <span className="text-xs text-slate-500">{profiles.length} variables profilées</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Variable</th>
                  <th className="p-2.5">Source</th>
                  <th className="p-2.5 text-center">Complétude</th>
                  <th className="p-2.5 text-center">Qualité</th>
                  <th className="p-2.5 text-center">Fiabilité Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {profiles.map(p => {
                  const isSelected = selectedVariable.variableCode === p.variableCode;
                  return (
                    <tr
                      key={p.variableCode}
                      onClick={() => setSelectedVariable(p)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-2.5">
                        <div className="text-slate-900">{p.variableName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.variableCode}</div>
                      </td>
                      <td className="p-2.5 text-slate-600 text-[11px]">{p.sourceName}</td>
                      <td className="p-2.5 text-center font-bold text-slate-900">
                        {p.completenessScorePercent}%
                      </td>
                      <td className="p-2.5 text-center font-black text-emerald-700">
                        {p.scientificQualityScore} / 100
                      </td>
                      <td className="p-2.5 text-center">
                        {getSourceReliabilityBadge(p.sourceReliability)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Selected Variable Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Détail Qualité Scientifique
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedVariable.variableName}</h4>
            <div className="mt-1 flex items-center gap-2">
              {getSourceReliabilityBadge(selectedVariable.sourceReliability)}
            </div>
          </div>

          {/* 7 Data Status Categories Count */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block uppercase">
              Répartition des 7 Statuts de Données :
            </span>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-950">
                <span>DONNÉE OBSERVÉE (Terrain)</span>
                <span className="font-bold">{selectedVariable.statusDistribution.observedCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-teal-50 text-teal-950">
                <span>DONNÉE IMPORTÉE (Registres)</span>
                <span className="font-bold">{selectedVariable.statusDistribution.importedCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-950">
                <span>DONNÉE PROXY (Justifié)</span>
                <span className="font-bold">{selectedVariable.statusDistribution.proxyCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 text-slate-900">
                <span>VALEUR ZÉRO RÉELLE MESURÉE</span>
                <span className="font-bold">{selectedVariable.statusDistribution.zeroMeasuredCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 text-rose-950">
                <span>DONNÉE MANQUANTE (NULL strict)</span>
                <span className="font-bold">{selectedVariable.statusDistribution.missingCount}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 text-indigo-950">
                <span>DONNÉE INCONNUE (?)</span>
                <span className="font-bold">{selectedVariable.statusDistribution.unknownCount}</span>
              </div>
            </div>
          </div>

          {/* Criteria Checklist */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase block">Critères de fiabilité de la source :</span>
            <ul className="space-y-1 text-xs text-slate-600">
              {selectedVariable.sourceReliabilityCriteria.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Configurable Thresholds Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Seuils de Complétude Configurables par le Chercheur
              </h4>
              <p className="text-xs text-slate-500">
                Ajustez les seuils de classification pour adapter le diagnostic aux exigences de votre protocole de modélisation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditingThresholds ? (
              <>
                <button
                  onClick={handleSaveThresholds}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Appliquer les seuils
                </button>
                <button
                  onClick={handleResetThresholds}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Réinitialiser
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditingThresholds(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
              >
                Modifier les seuils
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="font-bold text-emerald-900 block text-xs">Très bonne complétude</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black text-emerald-700">≥ {thresholds.tresBonne}%</span>
              {isEditingThresholds && (
                <input
                  type="number"
                  min="80"
                  max="100"
                  value={thresholds.tresBonne}
                  onChange={(e) => setThresholds({ ...thresholds, tresBonne: Number(e.target.value) })}
                  className="w-16 p-1 text-xs border rounded bg-white"
                />
              )}
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">Série continue robuste</span>
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
            <span className="font-bold text-teal-900 block text-xs">Bonne complétude</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black text-teal-700">≥ {thresholds.bonne}%</span>
              {isEditingThresholds && (
                <input
                  type="number"
                  min="60"
                  max="89"
                  value={thresholds.bonne}
                  onChange={(e) => setThresholds({ ...thresholds, bonne: Number(e.target.value) })}
                  className="w-16 p-1 text-xs border rounded bg-white"
                />
              )}
            </div>
            <span className="text-[10px] text-teal-800 font-semibold block mt-0.5">Utilisable avec précautions</span>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <span className="font-bold text-amber-900 block text-xs">Complétude modérée</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black text-amber-700">≥ {thresholds.moderee}%</span>
              {isEditingThresholds && (
                <input
                  type="number"
                  min="40"
                  max="74"
                  value={thresholds.moderee}
                  onChange={(e) => setThresholds({ ...thresholds, moderee: Number(e.target.value) })}
                  className="w-16 p-1 text-xs border rounded bg-white"
                />
              )}
            </div>
            <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">Analyse transversale</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span className="font-bold text-rose-900 block text-xs">Complétude faible</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-black text-rose-700">&lt; {thresholds.moderee}%</span>
            </div>
            <span className="text-[10px] text-rose-800 font-semibold block mt-0.5">Insuffisant pour régression</span>
          </div>
        </div>
      </div>
    </div>
  );
};
