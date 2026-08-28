import React, { useState } from 'react';
import {
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
  BarChart3,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { KINDU_HEALTH_AREAS } from '../../data/kinduGeography';
import { INITIAL_VARIABLE_DICTIONARY } from '../../data/variableDictionaryData';

export const MissingDataTab: React.FC = () => {
  const { analysisDataset } = useData();
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Filtre variables
  const filteredVars = INITIAL_VARIABLE_DICTIONARY.filter(v => {
    if (selectedDomain === 'ALL') return true;
    return v.category === selectedDomain;
  });

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="space-y-6">
      {/* RÈGLE SCIENTIFIQUE FONDAMENTALE : ZÉRO vs NULL (Section 5 & 6) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-xs rounded border border-rose-500/40">
            RÈGLE D'OR SCIENTIFIQUE V1.8
          </span>
          <h3 className="font-bold text-sm text-slate-100">Distinction Absolue entre Zéro et Donnée Manquante</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-emerald-400 block text-sm mb-1">VALEUR = 0 (Zéro Observé)</span>
            <p className="text-slate-300 leading-relaxed">
              Signifie une <strong>absence observée ou mesurée</strong> du phénomène (ex: 0 cas de paludisme enregistré après consultation de 200 patients, ou 0 mm de pluie mesuré par le pluviomètre METTELSAT).
            </p>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-rose-400 block text-sm mb-1">VALEUR = NULL (Donnée Manquante)</span>
            <p className="text-slate-300 leading-relaxed">
              Signifie une <strong>absence d’observation ou de transmission</strong> (ex: registre FOSA non transmis, ou absence de capteur). <span className="text-rose-300 font-bold">Interdiction absolue de remplacer automatiquement NULL par 0.</span>
            </p>
          </div>
        </div>
      </div>

      {/* RAISONS DES DONNÉES MANQUANTES (Section 7) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Typologie des Causes d'Indisponibilité (missing_reason)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Chaque cellule non renseignée dans la base de données est qualifiée par un motif documenté.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800 block">NON_COLLECTE</span>
            <p className="text-[11px] text-slate-500 mt-1">Pas d'enquête ou mesure programmée ce mois-là.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800 block">NON_DISPONIBLE</span>
            <p className="text-[11px] text-slate-500 mt-1">Registre incomplet ou rapport DHIS2 non parvenu.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800 block">NON_APPLICABLE</span>
            <p className="text-[11px] text-slate-500 mt-1">Variable non pertinente pour cette échelle ou structure.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800 block">PERDUE</span>
            <p className="text-[11px] text-slate-500 mt-1">Fiche papier détériorée ou registre égaré.</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="font-bold text-slate-800 block">INCONNUE</span>
            <p className="text-[11px] text-slate-500 mt-1">Cause d'omission non documentée par l'enquêteur.</p>
          </div>
        </div>
      </div>

      {/* MATRICE TEMPORELLE DE COMPLÉTUDE (Section 50) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Matrice Temporelle de Complétude & Détection des Trous</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisation mensuelle de la présence effective des données par aire de santé.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Année :</span>
            {[2023, 2024, 2025].map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  selectedYear === y
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold sticky left-0 bg-slate-100 z-10 w-40">Aire de Santé</th>
                {months.map(m => (
                  <th key={m} className="p-2 text-center font-semibold text-[11px]">
                    M{m}
                  </th>
                ))}
                <th className="p-2 text-center font-bold text-[11px] bg-slate-200/60">Bilan {selectedYear}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {KINDU_HEALTH_AREAS.map((a, idx) => {
                const yearUnits = analysisDataset.filter(
                  u => u.year === selectedYear && u.aire_sante_id === a.id
                );
                const avgComp =
                  yearUnits.length > 0
                    ? Math.round(yearUnits.reduce((s, u) => s + u.data_completeness, 0) / yearUnits.length)
                    : 0;

                return (
                  <tr key={a.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2.5 font-medium text-slate-800 sticky left-0 bg-inherit z-10 whitespace-nowrap">
                      {a.name.replace('Aire de Santé ', '')}
                    </td>
                    {months.map(m => {
                      const unit = yearUnits.find(u => u.month === m);
                      const comp = unit ? unit.data_completeness : 0;
                      let bg = 'bg-emerald-100 text-emerald-800';
                      if (comp < 50) bg = 'bg-rose-100 text-rose-800';
                      else if (comp < 75) bg = 'bg-amber-100 text-amber-800';

                      return (
                        <td key={m} className="p-1 text-center">
                          <span
                            className={`inline-block w-7 py-1 text-[10px] font-bold rounded ${bg}`}
                            title={`Mois ${m}/${selectedYear} : ${comp}% complétude`}
                          >
                            {comp}%
                          </span>
                        </td>
                      );
                    })}
                    <td className="p-2 text-center font-bold text-[11px] bg-slate-100/60">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          avgComp >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : avgComp >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {avgComp}% ({avgComp >= 90 ? 'EXCELLENTE' : avgComp >= 75 ? 'BONNE' : 'MOYENNE'})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE DES VARIABLES ET TAUX DE COMPLÉTUDE (Section 8) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Complétude par Variable & Qualification Épistémologique</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Évaluation rigoureuse des taux de complétude calculés sans imputation factice.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'SANTE', 'CLIMAT', 'ENVIRONNEMENT', 'WASH'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedDomain(cat)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedDomain === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tous les domaines' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">Variable</th>
                <th className="p-2.5 font-bold">Catégorie</th>
                <th className="p-2.5 font-bold">Statut Épistémologique</th>
                <th className="p-2.5 font-bold text-center">Complétude</th>
                <th className="p-2.5 font-bold text-center">Niveau</th>
                <th className="p-2.5 font-bold text-center">Utilisable Modèle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVars.map((v, idx) => (
                <tr key={v.variable_name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2.5">
                    <div className="font-bold text-slate-900">{v.label}</div>
                    <div className="font-mono text-[10px] text-slate-500">{v.variable_name}</div>
                  </td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                      {v.category}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.data_status === 'OBSERVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.data_status === 'CALCULATED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {v.data_status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-800">
                    {v.completeness_rate}%
                  </td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        v.quality_assessment === 'EXCELLENTE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.quality_assessment === 'BONNE'
                          ? 'bg-blue-100 text-blue-800'
                          : v.quality_assessment === 'MOYENNE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {v.quality_assessment}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    {v.is_usable_for_model ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Oui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" /> Non ({v.importance})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
