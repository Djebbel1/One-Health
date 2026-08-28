import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { validateDateAndChronology } from '../../utils/dataNormalizationEngine';

export const TemporalQualityTab: React.FC = () => {
  const { climateRecords } = useData();
  const [testStartDate, setTestStartDate] = useState('2024-06-15');
  const [testEndDate, setTestEndDate] = useState('2024-05-10');
  const [dateValidation, setDateValidation] = useState<any>(null);

  const runDateTest = () => {
    const res = validateDateAndChronology(testStartDate, testEndDate, 2026);
    setDateValidation(res);
  };

  // Exemple didactique des Lags Climatiques (Sections 31, 32, 71, 72)
  const sampleLagRows = [
    { year: 2023, month: 1, rain: 142.5, lag1: null, note: 'NULL (Aucun antécédent en 2022 — Pas d’invention)' },
    { year: 2023, month: 2, rain: 188.0, lag1: 142.5, note: 'Valeur de Janvier 2023' },
    { year: 2023, month: 3, rain: 215.3, lag1: 188.0, note: 'Valeur de Février 2023' },
    { year: 2023, month: 4, rain: 160.8, lag1: 215.3, note: 'Valeur de Mars 2023' },
  ];

  return (
    <div className="space-y-6">
      {/* DIRECTIVES SCIENTIFIQUES TEMPORELLES (Section 12, 13, 14, 15) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Règles de Cohérence Temporelle &amp; Décalages (Lags)</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Le temps est une dimension continue dans l'analyse One Health. Les enregistrements doivent respecter une stricte chronologie. Toute extrapolation temporelle non justifiée est proscrite.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1">1. Pas de Dates Futures</span>
            <p className="text-slate-300 text-[11px]">
              Toute date postérieure à l'année en cours ({new Date().getFullYear()}) est automatiquement signalée comme une anomalie de saisie.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-blue-400 block mb-1">2. Ordre Chronologique</span>
            <p className="text-slate-300 text-[11px]">
              Pour les périodes d'enquête ou de validité : <code>date_fin &ge; date_debut</code> obligatoirement.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">3. Règle des Lags Manquants</span>
            <p className="text-slate-300 text-[11px]">
              Si le mois M-1 est indisponible, le lag est strictement <code className="text-amber-300">NULL</code> (pas d'imputation factice).
            </p>
          </div>
        </div>
      </div>

      {/* TESTEUR DE COHÉRENCE CHRONOLOGIQUE */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          <span>Contrôle Interactif d'Intervalle Temporel</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tester la détection des inversions chronologiques et des dates aberrantes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Date de Début :</label>
            <input
              type="date"
              value={testStartDate}
              onChange={e => setTestStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Date de Fin :</label>
            <input
              type="date"
              value={testEndDate}
              onChange={e => setTestEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={runDateTest}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Valider la Chronologie</span>
            </button>
          </div>
        </div>

        {dateValidation && (
          <div
            className={`p-3.5 rounded-lg border text-xs ${
              dateValidation.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {dateValidation.isValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Intervalle Chronologique Valide</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Anomalie Chronologique Détectée</span>
                </>
              )}
            </div>
            {dateValidation.errors.map((err: string, i: number) => (
              <p key={i} className="text-[11px] text-rose-800">
                {err}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* DÉMONSTRATION DU CALCUL DES LAGS CLIMATIQUES (Section 31, 32, 71, 72) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-blue-600" />
            <span>Principe de Décalage Temporel (Lags Pluviométriques M-1, M-2)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Le lag pluviométrique modélise le délai biologique de 3 à 5 semaines nécessaire à la prolifération des anophèles et à la contamination des eaux.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">Année</th>
                <th className="p-2.5 font-bold">Mois</th>
                <th className="p-2.5 font-bold">Pluviométrie (mm)</th>
                <th className="p-2.5 font-bold text-blue-700">rainfall_lag_1 (mm)</th>
                <th className="p-2.5 font-bold">Règle de Gestion Appliquée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sampleLagRows.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2.5 font-bold text-slate-900">{r.year}</td>
                  <td className="p-2.5">Mois {r.month}</td>
                  <td className="p-2.5 font-mono font-semibold">{r.rain} mm</td>
                  <td className="p-2.5 font-mono font-bold text-blue-700">
                    {r.lag1 !== null ? `${r.lag1} mm` : <span className="text-amber-600">NULL</span>}
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
