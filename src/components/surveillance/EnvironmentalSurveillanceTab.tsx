import React from 'react';
import {
  Layers,
  Trash2,
  Droplets,
  AlertTriangle,
  Info,
  MapPin,
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';

interface EnvironmentalSurveillanceTabProps {
  selectedZone: string;
}

export const EnvironmentalSurveillanceTab: React.FC<EnvironmentalSurveillanceTabProps> = ({
  selectedZone
}) => {
  const environmentalSites = [
    {
      id: 'ENV-01',
      zone: 'Kasuku',
      area: 'Basoko',
      type: 'Gîte Larvaire Anophélien',
      densityLarva: 'Élevée (>45 larves/puisage)',
      wasteAccumulation: 'Faible',
      floodRisk: 'Critique (Bordure Rivière Kasuku)',
      proxyUsed: false,
      lastInspected: '2026-08-22'
    },
    {
      id: 'ENV-02',
      zone: 'Kasuku',
      area: 'Lwama',
      type: 'Décharge Sauvage d Ordures',
      densityLarva: 'Moyenne (Récipients plastiques)',
      wasteAccumulation: 'Très Élevée (>35 m³)',
      floodRisk: 'Modéré',
      proxyUsed: false,
      lastInspected: '2026-08-20'
    },
    {
      id: 'ENV-03',
      zone: 'Mikelenge',
      area: 'Mikelenge-Centre',
      type: 'Canal d Évacuation Obstrué',
      densityLarva: 'Élevée (Culicidés & Anophèles)',
      wasteAccumulation: 'Élevée',
      floodRisk: 'Élevé (Refoulement d eaux usées)',
      proxyUsed: true,
      proxyNote: 'Inspection par drone / Imagerie satellite Sentinel-2 (Proxy validé)',
      lastInspected: '2026-08-18'
    },
    {
      id: 'ENV-04',
      zone: 'Alunguli',
      area: 'Kimbombo',
      type: 'Zone Inondable Fluviale (Fleuve Congo)',
      densityLarva: 'Moyenne',
      wasteAccumulation: 'Faible',
      floodRisk: 'Critique en saison pluvieuse',
      proxyUsed: true,
      proxyNote: 'Estimation historique basée sur les cotes de crue 2024 (Proxy)',
      lastInspected: '2026-08-15'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête du sous-module */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Surveillance Environnementale &amp; Gîtes Vectoriels
            </h2>
            <p className="text-xs text-slate-500">
              Inventaire terrain des gîtes larvaires anophéliens, décharges sauvages et points critiques d&apos;inondation
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-mono font-bold text-xs border border-emerald-200">
          82 Gîtes Actifs Répertoriés
        </span>
      </div>

      {/* Cartes Métriques Environnementales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gîtes Larvaires Actifs
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">82</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              +14 après les pluies
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Forte densité anophélienne sur les bas-fonds de Kasuku
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Décharges &amp; Dépôts Non Contrôlés
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">36</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Risque entérique &amp; vectoriel
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Accumulation de déchets propice à la rétention d&apos;eaux de pluie
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Surveillance par Proxies
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">2</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Traçabilité garantie
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Sites évalués par satellite/drone ou séries approchées
          </p>
        </div>
      </div>

      {/* Tableau des Sites Environnementaux Renseignés */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Inventaire des Points d&apos;Observation Environnementale (Maniema)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Zone / Aire</th>
                <th className="p-3 font-bold">Nature du Risque</th>
                <th className="p-3 font-bold">Densité Larvaire</th>
                <th className="p-3 font-bold">Accumulation Déchets</th>
                <th className="p-3 font-bold">Risque d&apos;Inondation</th>
                <th className="p-3 font-bold">Statut de la Mesure</th>
                <th className="p-3 font-bold">Dernière Visite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {environmentalSites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-900">
                    <div>{site.zone}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{site.area}</div>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{site.type}</td>
                  <td className="p-3 font-mono text-rose-700 font-semibold">{site.densityLarva}</td>
                  <td className="p-3 text-slate-600">{site.wasteAccumulation}</td>
                  <td className="p-3 font-bold text-amber-800">{site.floodRisk}</td>
                  <td className="p-3">
                    {site.proxyUsed ? (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold font-mono text-[10px] rounded-full flex items-center space-x-1 w-max">
                        <Info className="w-3 h-3" />
                        <span>DONNÉE PROXY</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px] rounded-full w-max">
                        Relevé direct terrain
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-500">{site.lastInspected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Avertissement Spécifique sur les Proxies Environnementaux */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            Règle de Transparence des Proxies Environnementaux :
          </span>
          <p className="text-emerald-800 leading-relaxed">
            Lorsque la mesure environnementale provient d&apos;une source approchée (proxy satellite ou ancien relevé), le système applique automatiquement un <strong>malus de confiance documenté (-10% à -15%)</strong> sur le signal généré, et ne masque jamais l&apos;origine indirecte de la donnée.
          </p>
        </div>
      </div>
    </div>
  );
};
