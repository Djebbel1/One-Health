import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_TIMESERIES_2026,
  MOCK_SURVEILLANCE_SIGNALS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Filter,
  Info,
  Calendar,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';

interface SanitarySurveillanceTabProps {
  selectedZone: string;
  selectedPathology: string;
}

export const SanitarySurveillanceTab: React.FC<SanitarySurveillanceTabProps> = ({
  selectedZone,
  selectedPathology
}) => {
  const [activePathologyTab, setActivePathologyTab] = useState<'PALUDISME' | 'FIEVRE_TYPHOIDE' | 'MULTI_PATHOLOGIE'>('PALUDISME');
  const [selectedMethod, setSelectedMethod] = useState<string>('MODELE_GLM_NB_VALIDE_V116');

  const timeseries = MOCK_SURVEILLANCE_TIMESERIES_2026;

  return (
    <div className="space-y-6">
      {/* 1. Sélecteur de Pathologie & Méthode de Calcul du Niveau Attendu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Surveillance Sanitaire Spécialisée
              </h2>
              <p className="text-xs text-slate-500">
                Suivi continu des cas, incidences, intervalles attendus et détection des ruptures de série
              </p>
            </div>
          </div>

          {/* Onglets Pathologies */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActivePathologyTab('PALUDISME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activePathologyTab === 'PALUDISME'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paludisme (Anophèle)
            </button>
            <button
              onClick={() => setActivePathologyTab('FIEVRE_TYPHOIDE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activePathologyTab === 'FIEVRE_TYPHOIDE'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fièvre Typhoïde (Hydrique)
            </button>
            <button
              onClick={() => setActivePathologyTab('MULTI_PATHOLOGIE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activePathologyTab === 'MULTI_PATHOLOGIE'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vue Multi-Pathologies One Health
            </button>
          </div>
        </div>

        {/* Sélection de la méthode de référence pour le niveau attendu */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 font-medium">
            Méthode de calcul du <strong>Niveau Attendu</strong> :
          </span>
          <div className="flex items-center space-x-2">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 font-mono text-slate-800 font-bold text-xs"
            >
              <option value="MODELE_GLM_NB_VALIDE_V116">Modèle GLM Binomial Négatif validé V1.16</option>
              <option value="MEDIANE_SAISONNIERE">Médiane Historique Saisonnière (2020-2025)</option>
              <option value="MOYENNE_HISTORIQUE">Moyenne Historique + 1.96 SD</option>
              <option value="TENDANCE_LINEAIRE">Tendance Linéaire Ajustée</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Tableau & Graphique des Séries Observées vs Attendues */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>
                {activePathologyTab === 'PALUDISME'
                  ? 'Paludisme : Cas Observés vs Niveau Attendu (Modèle GLM-NB V1.16)'
                  : activePathologyTab === 'FIEVRE_TYPHOIDE'
                  ? 'Fièvre Typhoïde : Cas Confirmés vs Médiane Saisonnière'
                  : 'Comparaison Multi-Pathologies One Health'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Zone de Santé Kindu (Kasuku, Mikelenge, Alunguli) — Année épidémiologique 2026
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            Période active : Juin - Août 2026
          </span>
        </div>

        {/* Tableau des points chronologiques */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Semaine Épidémiologique</th>
                <th className="p-3 font-bold">Dates</th>
                <th className="p-3 font-bold">Observé (y)</th>
                <th className="p-3 font-bold">Attendu (ŷ)</th>
                <th className="p-3 font-bold">Intervalle Prédit [IP 95%]</th>
                <th className="p-3 font-bold">Seuil d&apos;Alerte</th>
                <th className="p-3 font-bold">Statut du Signal</th>
                <th className="p-3 font-bold">Complétude</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeseries.map((pt) => {
                const obs =
                  activePathologyTab === 'PALUDISME'
                    ? pt.observedMalariaCases
                    : pt.observedTyphoidCases;
                const exp =
                  activePathologyTab === 'PALUDISME'
                    ? pt.expectedMalariaCases
                    : pt.expectedTyphoidCases;
                const lower =
                  activePathologyTab === 'PALUDISME'
                    ? pt.malariaLowerBound
                    : pt.typhoidLowerBound;
                const upper =
                  activePathologyTab === 'PALUDISME'
                    ? pt.malariaUpperBound
                    : pt.typhoidUpperBound;
                const alertThresh =
                  activePathologyTab === 'PALUDISME'
                    ? pt.malariaThresholdAlert
                    : Math.round(exp * 1.8);
                const isAnomaly =
                  activePathologyTab === 'PALUDISME'
                    ? pt.isAnomalyMalaria
                    : pt.isAnomalyTyphoid;

                return (
                  <tr key={pt.period} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 font-bold font-mono text-slate-900">{pt.period}</td>
                    <td className="p-3 text-slate-500">{pt.dateLabel}</td>
                    <td className="p-3 font-mono font-bold text-teal-900 text-sm">
                      {obs} cas
                    </td>
                    <td className="p-3 font-mono text-slate-600">{exp} cas</td>
                    <td className="p-3 font-mono text-slate-500 text-[11px]">
                      [{lower} - {upper}]
                    </td>
                    <td className="p-3 font-mono text-rose-700 font-semibold text-[11px]">
                      &gt; {alertThresh} cas
                    </td>
                    <td className="p-3">
                      {isAnomaly ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold font-mono text-[10px] rounded-full flex items-center space-x-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ANOMALIE SIGNALÉE</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] rounded-full w-max">
                          NORMAL / CONFORME
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-slate-600 font-semibold">
                      {pt.completenessPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Encadrés Méthodologiques : Saisonnalité & Rupture de Définition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Prise en compte de la Saisonnalité */}
        <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-2">
          <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs">
            <Calendar className="w-4 h-4 text-teal-700" />
            <span>Prise en Compte de la Saisonnalité (Cycle Pluviométrique)</span>
          </div>
          <p className="text-[11px] text-teal-800 leading-relaxed">
            Une augmentation d&apos;incidence survenant lors de la reprise des précipitations (septembre-décembre) est confrontée à la <strong>médiane saisonnière historique (2020-2025)</strong>. Si la hausse reste contenue dans l&apos;enveloppe attendue, aucun signal critique n&apos;est déclenché.
          </p>
        </div>

        {/* Détection des Ruptures de Série et Changement de Définition */}
        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Avertissement : Rupture de Définition &amp; Changement de Kit</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            En cas de modification du protocole de confirmation diagnostique (ex : nouveau kit TDR en S32), le système qualifie l&apos;écart comme <strong>&quot;Rupture potentielle de série&quot;</strong> afin d&apos;éviter de fausses déclarations d&apos;épidémie.
          </p>
        </div>

      </div>
    </div>
  );
};
