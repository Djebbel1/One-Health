import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Percent,
  Calculator,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { calculateIncidenceRate, calculateAndValidateProportion } from '../../utils/dataNormalizationEngine';

export const InconsistenciesTab: React.FC = () => {
  // Testeur d'incidence interactif (Section 67 & 68)
  const [incCases, setIncCases] = useState<string>('100');
  const [incPop, setIncPop] = useState<string>('10000');
  const [incResult, setIncResult] = useState<any>(() => calculateIncidenceRate(100, 10000, 1000));

  // Testeur de proportion interactif (Section 70)
  const [propNum, setPropNum] = useState<string>('120');
  const [propDenom, setPropDenom] = useState<string>('100');
  const [propResult, setPropResult] = useState<any>(() => calculateAndValidateProportion(120, 100));

  const handleIncTest = () => {
    const cases = incCases.trim() === '' ? null : parseFloat(incCases);
    const pop = incPop.trim() === '' ? null : parseFloat(incPop);
    setIncResult(calculateIncidenceRate(cases, pop, 1000));
  };

  const handlePropTest = () => {
    const num = propNum.trim() === '' ? null : parseFloat(propNum);
    const den = propDenom.trim() === '' ? null : parseFloat(propDenom);
    setPropResult(calculateAndValidateProportion(num, den));
  };

  return (
    <div className="space-y-6">
      {/* CADRE SCIENTIFIQUE DES CONTRÔLES D'INCOHÉRENCE (Sections 20, 21, 22, 23) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span>Contrôles de Cohérence Interne &amp; Règles de Validation</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Toutes les relations logiques entre variables sont vérifiées à la volée. Les valeurs physiquement impossibles sont bloquées, tandis que les valeurs extrêmes biologiquement plausibles sont isolées avec alerte sans suppression.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1">Règle Sanitaire 1</span>
            <p className="text-slate-300 text-[11px]">
              <code>Décès &le; Cas</code> et <code>Hospitalisations &le; Cas</code>.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-blue-400 block mb-1">Règle Sanitaire 2</span>
            <p className="text-slate-300 text-[11px]">
              <code>Cas confirmés &le; Total des cas enregistrés</code>.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">Règle Climatique</span>
            <p className="text-slate-300 text-[11px]">
              <code>0 &le; Humidité &le; 100%</code> et <code>Précipitations &ge; 0 mm</code>.
            </p>
          </div>
        </div>
      </div>

      {/* TESTEUR DU CALCUL D'INCIDENCE (Section 24, 25, 67, 68) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-teal-600" />
            <span>Calcul Rigoureux du Taux d’Incidence (Sections 67 &amp; 68)</span>
          </h3>
          <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
            Formule : (Cas / Population) &times; 1 000 hab
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Si la population est absente ou nulle, le système refuse de calculer un taux factice et émet l’avertissement <strong>« INCIDENCE NON CALCULABLE — DÉNOMINATEUR MANQUANT »</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre de cas :</label>
            <input
              type="text"
              value={incCases}
              onChange={e => setIncCases(e.target.value)}
              placeholder="Ex: 100"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Population (dénominateur) :</label>
            <input
              type="text"
              value={incPop}
              onChange={e => setIncPop(e.target.value)}
              placeholder="Laisser vide pour tester NULL"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleIncTest}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculer l’Incidence</span>
            </button>
          </div>
        </div>

        {incResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs ${
              incResult.isCalculable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {incResult.isCalculable ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">
                    Taux d’Incidence : {incResult.ratePer1000} cas / 1 000 hab
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Facteur utilisé et documenté : {incResult.factorUsed}
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">{incResult.errorMessage}</span>
                  <span className="text-[11px] text-rose-700">
                    Conformité V1.8 : Aucun remplacement arbitraire par zéro.
                  </span>
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* TESTEUR DE CONTRÔLE DES PROPORTIONS (Section 26, 27, 70) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Percent className="w-4 h-4 text-purple-600" />
          <span>Contrôle des Bornes de Proportion [0–100%] (Test Section 70)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Rejet strict de toute proportion où le numérateur excède le dénominateur (ex: 120 ménages avec latrine sur 100 ménages enquêtés).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Numérateur (ex: ménages avec latrine) :</label>
            <input
              type="text"
              value={propNum}
              onChange={e => setPropNum(e.target.value)}
              placeholder="Ex: 120"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Dénominateur (total ménages) :</label>
            <input
              type="text"
              value={propDenom}
              onChange={e => setPropDenom(e.target.value)}
              placeholder="Ex: 100"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePropTest}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vérifier la Proportion</span>
            </button>
          </div>
        </div>

        {propResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs ${
              propResult.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {propResult.isValid ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">
                    Proportion Valide : {propResult.ratePercent}%
                  </span>
                  <span className="text-[11px] text-emerald-700">Compris dans l'intervalle [0 – 100%]</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold block text-sm">Proportion Rejetée</span>
                  {propResult.errors.map((e: string, idx: number) => (
                    <span key={idx} className="block text-[11px] text-rose-700">
                      {e}
                    </span>
                  ))}
                </div>
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
