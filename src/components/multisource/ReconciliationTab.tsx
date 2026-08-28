import React, { useState } from 'react';
import {
  SynonymMappingItem,
  ReconciledCrossDatasetRow,
  OneHealthDimension
} from '../../types';
import {
  GitMerge,
  Search,
  Plus,
  Check,
  Sparkles,
  Link,
  Shield,
  Activity,
  CloudRain,
  Layers,
  MapPin,
  Calendar,
  Info,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface ReconciliationTabProps {
  synonyms: SynonymMappingItem[];
  onAddSynonym: (item: SynonymMappingItem) => void;
}

export const ReconciliationTab: React.FC<ReconciliationTabProps> = ({
  synonyms,
  onAddSynonym
}) => {
  const [synonymCategoryFilter, setSynonymCategoryFilter] = useState<'TOUT' | 'PATHOLOGIE' | 'ZONE_SANTE' | 'AIRE_SANTE'>('TOUT');
  const [testInput, setTestInput] = useState<string>('');
  const [testResult, setTestResult] = useState<SynonymMappingItem | null>(null);

  // New synonym form state
  const [isAddingSynonym, setIsAddingSynonym] = useState(false);
  const [newVariant, setNewVariant] = useState('');
  const [newStandardTarget, setNewStandardTarget] = useState('');
  const [newStandardLabel, setNewStandardLabel] = useState('');
  const [newCategory, setNewCategory] = useState<'PATHOLOGIE' | 'ZONE_SANTE' | 'AIRE_SANTE'>('PATHOLOGIE');

  // Multi-source cross linkage demonstration state
  const [selectedLinkageZone, setSelectedLinkageZone] = useState<string>('Kindu');
  const [selectedLinkageYear, setSelectedLinkageYear] = useState<number>(2025);

  const filteredSynonyms = synonyms.filter(s =>
    synonymCategoryFilter === 'TOUT' || s.category === synonymCategoryFilter
  );

  const handleTestMatch = () => {
    if (!testInput.trim()) return;
    const clean = testInput.trim().toLowerCase();
    const found = synonyms.find(s => s.sourceVariant.toLowerCase() === clean);
    if (found) {
      setTestResult(found);
    } else {
      setTestResult({
        id: 'NO-MATCH',
        category: 'PATHOLOGIE',
        sourceVariant: testInput,
        standardTarget: 'NON_RECONNU',
        standardLabel: 'Terme inconnu du dictionnaire (Nécessite arbitrage)',
        confidence: 0.0,
        isConfirmed: false
      });
    }
  };

  const handleSaveNewSynonym = () => {
    if (!newVariant || !newStandardTarget) return;
    const item: SynonymMappingItem = {
      id: `SYN-${Date.now()}`,
      category: newCategory,
      sourceVariant: newVariant.trim(),
      standardTarget: newStandardTarget.trim(),
      standardLabel: newStandardLabel.trim() || newStandardTarget.trim(),
      confidence: 1.0,
      isConfirmed: true
    };
    onAddSynonym(item);
    setIsAddingSynonym(false);
    setNewVariant('');
    setNewStandardTarget('');
    setNewStandardLabel('');
  };

  // Exemple simulé de rapprochement croisé multi-sources (Santé + Climat + Env)
  const simulatedCrossRows: ReconciledCrossDatasetRow[] = [
    {
      compositeKey: '2022-04_GEO_ZS_KINDU',
      periodYear: 2022,
      periodMonth: 4,
      zoneSanteId: 'GEO_ZS_KINDU',
      zoneSanteName: 'Zone de Santé de Kindu (Ville)',
      healthIncidence: {
        malariaCases: 1420,
        typhoidCases: 380,
        choleraCases: null, // MANQUANT (PAS 0)
        mpoxCases: 8
      },
      climateFactors: {
        monthlyRainfallMm: 245.8,
        meanTemperatureC: 28.4,
        meanHumidityPct: 86
      },
      environmentalFactors: {
        larvalSitesCount: 18,
        wasteDumpPresent: true, // HISTORIQUE : 2022 Déchets = OUI
        dominantWaterSource: 'Puits ouverts et fleuve'
      },
      sourcesParticipating: ['SRC-SAN-001', 'SRC-CLI-001', 'SRC-ENV-001'],
      crossCompletenessScore: 92,
      missingDimensionsNotes: ['Choléra non notifié pour cette période (NULL)']
    },
    {
      compositeKey: '2025-05_GEO_ZS_KINDU',
      periodYear: 2025,
      periodMonth: 5,
      zoneSanteId: 'GEO_ZS_KINDU',
      zoneSanteName: 'Zone de Santé de Kindu (Ville)',
      healthIncidence: {
        malariaCases: 980,
        typhoidCases: 210,
        choleraCases: 0, // 0 Réellement notifié (pas manquant)
        mpoxCases: 42
      },
      climateFactors: {
        monthlyRainfallMm: 110.2,
        meanTemperatureC: 29.8,
        meanHumidityPct: 78
      },
      environmentalFactors: {
        larvalSitesCount: 6,
        wasteDumpPresent: false, // HISTORIQUE : 2025 Déchets = NON (Deux observations distinctes préservées sans écrasement)
        dominantWaterSource: 'Bornes fontaines curées'
      },
      sourcesParticipating: ['SRC-SAN-001', 'SRC-CLI-001', 'SRC-ENV-001', 'SRC-COM-001'],
      crossCompletenessScore: 100,
      missingDimensionsNotes: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          SECTION 1 : DICTIONNAIRE DES SYNONYMES ET NORMALISATION
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Dictionnaire de Réconciliation des Synonymes ({synonyms.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalisation intelligente des variations orthographiques (ex: Malaria, MAL → Paludisme ; ZS Kindu → Ville de Kindu).
            </p>
          </div>

          <button
            onClick={() => setIsAddingSynonym(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Correspondance</span>
          </button>
        </div>

        {/* Live Synonym Tester */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-600" />
            Testeur Interactif de Réconciliation :
          </span>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Saisissez un terme source (ex: 'Malaria', 'FT', 'accès palustre', 'ZS Kindu')..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleTestMatch}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
            >
              Tester l'Association
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg text-xs border ${
              testResult.id === 'NO-MATCH'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-emerald-50 text-emerald-900 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span>
                  Terme Source : <strong>"{testResult.sourceVariant}"</strong>
                </span>
                <span className="font-mono text-[11px] font-bold">
                  Score de Confiance : {Math.round(testResult.confidence * 100)}%
                </span>
              </div>
              <p className="mt-1 font-semibold">
                → Code Standard : <code>{testResult.standardTarget}</code> ({testResult.standardLabel})
              </p>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['TOUT', 'PATHOLOGIE', 'ZONE_SANTE', 'AIRE_SANTE'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSynonymCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                synonymCategoryFilter === cat
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Synonym Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Variante Source Rencontrée</th>
                <th className="px-3 py-2.5">Catégorie</th>
                <th className="px-4 py-2.5">Cible Standardisée (One Health)</th>
                <th className="px-3 py-2.5 text-center">Confiance</th>
                <th className="px-3 py-2.5 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSynonyms.map(syn => (
                <tr key={syn.id} className="hover:bg-purple-50/20">
                  <td className="px-4 py-2.5 font-bold text-slate-900">
                    "{syn.sourceVariant}"
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {syn.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-purple-700">{syn.standardLabel}</span>
                      <code className="block text-[10px] text-slate-500">{syn.standardTarget}</code>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-700">
                    {Math.round(syn.confidence * 100)}%
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" /> Validé
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Synonyme */}
      {isAddingSynonym && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Ajouter une Règle de Synonymie
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catégorie :</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="PATHOLOGIE">Pathologie / Diagnostic</option>
                  <option value="ZONE_SANTE">Zone de Santé</option>
                  <option value="AIRE_SANTE">Aire de Santé</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Variante brute dans les fichiers :</label>
                <input
                  type="text"
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  placeholder="Ex: Fièvre des marais, ZS Alunguli..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Code standard cible :</label>
                <input
                  type="text"
                  value={newStandardTarget}
                  onChange={(e) => setNewStandardTarget(e.target.value)}
                  placeholder="Ex: PALUDISME, GEO_ZS_ALUNGULI"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Libellé complet :</label>
                <input
                  type="text"
                  value={newStandardLabel}
                  onChange={(e) => setNewStandardLabel(e.target.value)}
                  placeholder="Ex: Paludisme grave ou simple"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAddingSynonym(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveNewSynonym}
                className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Enregistrer la Correspondance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2 : MOTEUR DE RAPPROCHEMENT MULTI-SOURCES (SANTÉ + CLIMAT + ENV)
          ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-teal-600" />
            Moteur de Rapprochement Spatio-Temporel Multi-Sources
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Fusion des dimensions (Santé + Météo + Environnement) par clé composite <code>DATE + ZONE_DE_SANTE</code> avec traçabilité des observations historiques.
          </p>
        </div>

        {/* Demo Cross-Dataset Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Exemple de Datasets Rapprochés (Kindu 2022 vs 2025) :
            </span>
            <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Clé de liaison : DATE_MOIS + ZONE_SANTE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {simulatedCrossRows.map(row => (
              <div key={row.compositeKey} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 block">{row.compositeKey}</span>
                    <span className="text-[11px] text-teal-700 font-semibold">{row.zoneSanteName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Complétude : {row.crossCompletenessScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  {/* Santé */}
                  <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-rose-700 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> SANTE
                    </span>
                    <p className="text-[11px] text-slate-800">Palu : <strong>{row.healthIncidence.malariaCases}</strong></p>
                    <p className="text-[11px] text-slate-800">Typhoïde : <strong>{row.healthIncidence.typhoidCases}</strong></p>
                  </div>

                  {/* Climat */}
                  <div className="bg-cyan-50 border border-cyan-100 p-2.5 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-cyan-700 flex items-center gap-1">
                      <CloudRain className="w-3 h-3" /> CLIMAT
                    </span>
                    <p className="text-[11px] text-slate-800">Pluie : <strong>{row.climateFactors.monthlyRainfallMm} mm</strong></p>
                    <p className="text-[11px] text-slate-800">Temp : <strong>{row.climateFactors.meanTemperatureC} °C</strong></p>
                  </div>

                  {/* Environnement */}
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> ENVIRONNEMENT
                    </span>
                    <p className="text-[11px] text-slate-800">Gîtes : <strong>{row.environmentalFactors.larvalSitesCount}</strong></p>
                    <p className="text-[11px] font-bold text-slate-900">
                      Déchets : {row.environmentalFactors.wasteDumpPresent ? 'OUI' : 'NON'}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>Sources liées : {row.sourcesParticipating.join(', ')}</span>
                  <span className="text-teal-700 font-semibold">Observations historiques distinctes préservées</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
