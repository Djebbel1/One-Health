import React from 'react';
import {
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Layers
} from 'lucide-react';

interface WashSurveillanceTabProps {
  selectedZone: string;
}

export const WashSurveillanceTab: React.FC<WashSurveillanceTabProps> = ({
  selectedZone
}) => {
  const washMetrics = [
    {
      zone: 'Kasuku',
      safeWaterAccessPercent: 56.0,
      turbidityAverageNtu: 6.2,
      sanitaryLatrinesPercent: 48.0,
      handwashingStationsPercent: 35.0,
      typhoidRiskLevel: 'MODÉRÉ',
      statusNote: 'Contamination diffuse des puits après orage'
    },
    {
      zone: 'Mikelenge',
      safeWaterAccessPercent: 42.0,
      turbidityAverageNtu: 12.4,
      sanitaryLatrinesPercent: 32.0,
      handwashingStationsPercent: 22.0,
      typhoidRiskLevel: 'ÉLEVÉ (VIGILANCE)',
      statusNote: 'Pic de turbidité fluviale + refoulement d égouts'
    },
    {
      zone: 'Alunguli',
      safeWaterAccessPercent: 38.0,
      turbidityAverageNtu: 14.8,
      sanitaryLatrinesPercent: 28.0,
      handwashingStationsPercent: 18.0,
      typhoidRiskLevel: 'ÉLEVÉ (ZONE FLUVIALE)',
      statusNote: 'Dépendance directe aux eaux brutes du Fleuve Congo'
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Surveillance Eau, Assainissement &amp; Hygiène (WASH)
            </h2>
            <p className="text-xs text-slate-500">
              Indicateurs de salubrité de l&apos;eau, couverture en latrines et corrélation avec les syndromes entériques
            </p>
          </div>
        </div>

        <span className="px-3 py-1 bg-cyan-50 text-cyan-800 rounded-lg font-mono font-bold text-xs border border-cyan-200">
          Pilier One Health : Santé Hydrique
        </span>
      </div>

      {/* Cartes d'Indicateurs WASH Clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Accès Eau Potable Sécurisée
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">45.3%</span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Déficit critique
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Moyenne sur les 3 zones urbaines de Kindu
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Turbidité Moyenne des Eaux
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">11.1 NTU</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Norme OMS : &lt; 5 NTU
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Corrélation directe avec les épisodes de turbidité fluviale
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Couverture en Latrines Hygiéniques
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">36.0%</span>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
              Vulnérabilité féco-orale
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Enquête ménages &amp; observations de terrain 2026
          </p>
        </div>
      </div>

      {/* Tableau de Bord WASH par Zone de Santé */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>Indicateurs WASH &amp; Vulnérabilité Typhoïde par Zone (Kindu)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Zone de Santé</th>
                <th className="p-3 font-bold">Accès Eau Potable</th>
                <th className="p-3 font-bold">Turbidité Captage</th>
                <th className="p-3 font-bold">Latrines Sécurisées</th>
                <th className="p-3 font-bold">Lavage Mains</th>
                <th className="p-3 font-bold">Niveau de Risque Typhoïde</th>
                <th className="p-3 font-bold">Diagnostic Terrain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {washMetrics.map((wm) => (
                <tr key={wm.zone} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-900">{wm.zone}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {wm.safeWaterAccessPercent}%
                  </td>
                  <td className="p-3 font-mono font-bold text-cyan-800">
                    {wm.turbidityAverageNtu} NTU
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    {wm.sanitaryLatrinesPercent}%
                  </td>
                  <td className="p-3 font-mono text-slate-600">
                    {wm.handwashingStationsPercent}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                        wm.typhoidRiskLevel.includes('ÉLEVÉ')
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {wm.typhoidRiskLevel}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">{wm.statusNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note d'Association Entérique */}
      <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs text-cyan-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            Corrélation Immédiate (Lag 0 à 1 semaine) pour la Fièvre Typhoïde :
          </span>
          <p className="text-cyan-800 leading-relaxed">
            Contrairement au paludisme dont le délai de réponse vectorielle est d&apos;un mois, les contaminations hydriques réagissent quasi instantanément (Lag court : 3 à 7 jours) aux épisodes d&apos;inondation et de refoulement des latrines dans les puits peu profonds.
          </p>
        </div>
      </div>
    </div>
  );
};
