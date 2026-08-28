import React from 'react';
import {
  Layers,
  Database,
  Building2,
  FileText,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SourcesTab: React.FC = () => {
  const sources = [
    {
      domain: 'SANTÉ',
      name: 'Division Provinciale de la Santé (DPS) Maniema / DHIS2',
      scale: 'Aire de Santé × Mois',
      type: 'Routine Sanitaire (SNIS)',
      period: '2023 – 2025 (36 mois)',
      representativeness: 'REPRESENTATIVE',
      notes: 'Consultations externes, hospitalisations et confirmations biologiques (TDR, microscopie, Widal).',
    },
    {
      domain: 'CLIMAT',
      name: 'METTELSAT Kindu (Station Synoptique Aéroport WMO 64115)',
      scale: 'Ville de Kindu × Mois (Station unique)',
      type: 'Relevés synoptiques officiels',
      period: '2023 – 2025 (36 mois)',
      representativeness: 'REPRESENTATIVE',
      notes: 'Précipitations cumulées, températures max/min/moyenne, hygrométrie et jours de pluie.',
    },
    {
      domain: 'ENVIRONNEMENT',
      name: 'Cartographie & Enquêtes Entomologiques One Health',
      scale: 'Points GPS Géoréférencés / Aire de Santé',
      type: 'Observations de terrain',
      period: '2023 – 2025',
      representativeness: 'PARTIALLY_REPRESENTATIVE',
      notes: 'Gîtes larvaires à eau stagnante, décharges d’immondices et canaux d’évacuation.',
    },
    {
      domain: 'WASH / MÉNAGES',
      name: 'Enquêtes Ménages CAP (Connaissances, Attitudes, Pratiques)',
      scale: 'Ménages / Échantillon stratifié par Aire de Santé',
      type: 'Sondage représentatif',
      period: '2023 – 2025',
      representativeness: 'REPRESENTATIVE',
      notes: 'Sources d’eau, traitement de l’eau à domicile, possession de latrines et gestion des déchets.',
    },
    {
      domain: 'DÉMOGRAPHIE',
      name: 'Recensement Sanitaire DPS Maniema',
      scale: 'Aire de Santé × Année',
      type: 'Projections officielles',
      period: '2023 – 2025',
      representativeness: 'REPRESENTATIVE',
      notes: 'Dénominateurs officiels pour le calcul des taux d’incidence pour 1 000 habitants.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* CADRE MULTI-ÉCHELLE (Section 33, 34, 74) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>Documentation des Résolutions Multi-Échelles &amp; Sources de Données</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          L'approche One Health Kindu intègre des données provenant de niveaux de granularité spatiale et temporelle différents. Conformément à la directive V1.8, chaque résolution d'origine est rigoureusement documentée sans interpolation artificielle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1">Échelle Sanitaire</span>
            <p className="text-slate-300 text-[11px]">
              Granularité : <strong>Aire de Santé &times; Mois</strong>. Les 10 aires de santé possèdent leurs données de morbidité mensuelle distinctes.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-blue-400 block mb-1">Échelle Climatique</span>
            <p className="text-slate-300 text-[11px]">
              Granularité : <strong>Ville de Kindu &times; Mois</strong>. Données synoptiques issues de l'unique station aéroportuaire officielle.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">Échelle Environnementale</span>
            <p className="text-slate-300 text-[11px]">
              Granularité : <strong>Point GPS précis</strong> agrégé ensuite à l'aire de santé avec dates de validité (sans rétroactivité).
            </p>
          </div>
        </div>
      </div>

      {/* TABLEAU DÉTAILLÉ DES SOURCES DE DONNÉES */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-600" />
          <span>Répertoire des Sources Officielles et Représentativité</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">Domaine</th>
                <th className="p-2.5 font-bold">Source Officielle</th>
                <th className="p-2.5 font-bold">Résolution d'Origine</th>
                <th className="p-2.5 font-bold">Période</th>
                <th className="p-2.5 font-bold text-center">Représentativité</th>
                <th className="p-2.5 font-bold">Description des Données</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sources.map((s, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2.5 font-bold text-slate-900">{s.domain}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{s.name}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-700">{s.scale}</td>
                  <td className="p-2.5 text-slate-600">{s.period}</td>
                  <td className="p-2.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.representativeness === 'REPRESENTATIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.representativeness === 'REPRESENTATIVE' ? 'Représentatif' : 'Partiellement'}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px]">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
