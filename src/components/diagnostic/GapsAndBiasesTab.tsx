import React from 'react';
import {
  AlertTriangle,
  Building,
  Calendar,
  Compass,
  FileQuestion,
  HelpCircle,
  MapPin,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';
import {
  CaseDefinitionShiftAlert,
  GeographicBoundaryShiftAlert
} from '../../types';
import {
  MOCK_CASE_DEFINITION_SHIFTS_V113,
  MOCK_GEOGRAPHIC_BOUNDARY_SHIFTS_V113
} from '../../data/mockScientificDiagnosticDataV113';

export const GapsAndBiasesTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Identification des Lacunes Critiques & Risques de Biais Méthodologiques
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Pour garantir la rigueur de la recherche One Health, la plateforme détecte et documente systématiquement les discontinuités, les changements de définitions diagnostiques, les biais d'échantillonnage et les modifications territoriales.
        </p>
      </div>

      {/* Critical Gaps Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-rose-600" />
            Inventaire des Lacunes Critiques Identifiées
          </h4>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            3 Lacunes Majeures
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900 uppercase">Lacune 1 • Environnement</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white">CRITIQUE</span>
            </div>
            <h5 className="font-bold text-slate-900 text-xs">Absence de séries environnementales 2018–2021</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Les inspections de salubrité et les relevés de gîtes larvaires n'ont débuté qu'à partir de 2022.
            </p>
            <div className="pt-2 border-t border-rose-200 text-[11px] font-semibold text-rose-800">
              Impact : Impossibilité d'évaluer l'impact des déchets sur le paludisme avant 2022 sans proxy explicite.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase">Lacune 2 • Qualité de l'Eau</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-600 text-white">MODÉRÉE</span>
            </div>
            <h5 className="font-bold text-slate-900 text-xs">Absence d'analyses microbiologiques de l'eau en routine</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              La contamination fécale (E. coli / Coliformes) n'est pas mesurée mensuellement dans les 18 zones de santé.
            </p>
            <div className="pt-2 border-t border-amber-200 text-[11px] font-semibold text-amber-800">
              Impact : Utilisation exclusive du proxy déclaratif « Accès eau potable protégée ».
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase">Lacune 3 • SIG & GPS</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-700 text-white">MINEURE</span>
            </div>
            <h5 className="font-bold text-slate-900 text-xs">7.6% de centres de santé secondaires sans coordonnées GPS</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              11 structures sanitaires isolées (Punia, Fera, Kabambare) sont localisées uniquement au niveau de l'aire de santé.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-slate-700">
              Impact : Agrégation spatiale obligatoire au centroïde de l'aire sanitaire.
            </div>
          </div>
        </div>
      </div>

      {/* Case Definition Shift Alerts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Alertes Épidémiologiques : Changements de Définition de Cas
          </h4>
          <span className="text-xs text-slate-500">2 Transitions Majeures Répertoriées</span>
        </div>

        <div className="space-y-3">
          {MOCK_CASE_DEFINITION_SHIFTS_V113.map(shift => (
            <div key={shift.id} className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-700 text-white">
                    {shift.pathologyName}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Année de bascule : {shift.yearOfShift}
                  </span>
                </div>
                <span className="text-xs text-amber-900 font-semibold">
                  Période concernée : {shift.periodStart} à 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/80 rounded-lg border border-amber-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Ancienne Définition ({shift.periodStart}–{shift.yearOfShift - 1}) :</span>
                  <p className="font-medium text-slate-800 mt-0.5">{shift.formerDefinition}</p>
                </div>

                <div className="p-3 bg-white/80 rounded-lg border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Nouvelle Définition ({shift.yearOfShift}–2026) :</span>
                  <p className="font-medium text-emerald-950 mt-0.5">{shift.newDefinition}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 text-rose-950 text-xs font-medium border border-rose-200">
                <strong>Avertissement méthodologique :</strong> {shift.warningNotice}
                <div className="mt-1 text-[11px] text-rose-800">{shift.impactOnTrendAnalysis}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic Boundary Shifts & Bias Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Boundary Changes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Changements de Découpage Géographique (2018–2026)
            </h4>
            <p className="text-xs text-slate-500">
              Préservation de l'intégrité des découpages historiques sans fusion rétroactive aveugle.
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_GEOGRAPHIC_BOUNDARY_SHIFTS_V113.map(geo => (
              <div key={geo.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{geo.zoneSanteName}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                    Scission en {geo.yearOfShift}
                  </span>
                </div>
                <p className="text-slate-600">
                  <strong className="text-slate-800">Avant {geo.yearOfShift} :</strong> {geo.formerBoundaryDescription}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-800">Depuis {geo.yearOfShift} :</strong> {geo.newBoundaryDescription}
                </p>
                <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200 text-indigo-950 text-[11px] font-medium">
                  <strong>Recommandation d'analyse :</strong> {geo.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodological Bias Safeguards */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-600" />
              Garde-fous contre les Biais d'Échantillonnage
            </h4>
            <p className="text-xs text-slate-500">
              Règles automatiques appliquées par le moteur pour éviter les inférences erronées.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-600" />
                Biais Urbain (Concentration sur Kindu/Alunguli)
              </div>
              <p className="text-slate-600 leading-relaxed">
                Les observations entomologiques et de salubrité étant plus denses en milieu urbain, interdiction de généraliser les taux de gîtes larvaires de Kindu aux territoires ruraux de Kasongo ou Punia sans stratification explicite.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                Biais d'Asymétrie Temporelle
              </div>
              <p className="text-slate-600 leading-relaxed">
                Les séries sanitaires étant mensuelles et continues (2018–2026), tandis que les variables écologiques sont ponctuelles, le système force l'alignement temporel par agrégation saisonnière ou fenêtres d'observation restreintes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-950">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Garantie d'Absence d'Invention de Données
              </div>
              <p className="leading-relaxed text-[11px]">
                Le système n'invente jamais d'observation absente, ne remplace jamais NULL par 0 et n'extrapole jamais le présent vers le passé de façon implicite.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
