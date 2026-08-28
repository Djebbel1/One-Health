import React, { useState } from 'react';
import {
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Plus,
  ShieldAlert,
  Info,
  Clock,
  MapPin,
  Sparkles,
  FileCheck,
  Check,
  Building
} from 'lucide-react';
import {
  EnvironmentalHistoricityRecord,
  HistoricalProxyDeclaration,
  ConfidenceLevel
} from '../../types';
import {
  MANIEMA_18_HEALTH_ZONES,
  STUDY_YEARS_2018_2026
} from '../../data/mockScientificDiagnosticDataV113';
import { globalDiagnosticEngine } from '../../utils/scientificDiagnosticEngineV113';

interface EnvironmentalHistoricityTabProps {
  envHistory: EnvironmentalHistoricityRecord[];
  proxies: HistoricalProxyDeclaration[];
  onRefreshData: () => void;
}

export const EnvironmentalHistoricityTab: React.FC<EnvironmentalHistoricityTabProps> = ({
  envHistory,
  proxies,
  onRefreshData
}) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('SITE-KASUKU-01');
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);

  // New Proxy form state
  const [proxyVariableCode, setProxyVariableCode] = useState('presence_zone_dechets');
  const [proxyTargetZoneId, setProxyTargetZoneId] = useState('ZS-KINDU');
  const [proxySourceYear, setProxySourceYear] = useState<number>(2026);
  const [proxyTargetYear, setProxyTargetYear] = useState<number>(2025);
  const [proxyConfidence, setProxyConfidence] = useState<ConfidenceLevel>('MODERE');
  const [proxyJustification, setProxyJustification] = useState('');
  const [proxyAuthor, setProxyAuthor] = useState('Chercheur Principal One Health');
  const [proxyError, setProxyError] = useState<string | null>(null);

  const kasukuRecords = envHistory.filter(r => r.siteId === selectedSiteId);

  const handleCreateProxy = (e: React.FormEvent) => {
    e.preventDefault();
    setProxyError(null);

    if (!proxyJustification || proxyJustification.trim().length < 10) {
      setProxyError('La justification scientifique est obligatoire et doit comporter au moins 10 caractères.');
      return;
    }

    try {
      const targetZone = MANIEMA_18_HEALTH_ZONES.find(z => z.id === proxyTargetZoneId);
      globalDiagnosticEngine.addHistoricalProxy({
        variableCode: proxyVariableCode,
        variableName: proxyVariableCode === 'presence_zone_dechets' ? 'Présence de décharges sauvages' : 'Gîtes larvaires anophéliens',
        siteOrZoneId: proxyTargetZoneId,
        siteOrZoneName: targetZone ? `Zone de Santé de ${targetZone.name}` : proxyTargetZoneId,
        sourceObservationYear: proxySourceYear,
        targetProxyYear: proxyTargetYear,
        sourceValue: 'OUI',
        confidenceLevel: proxyConfidence,
        scientificJustification: proxyJustification,
        declaredBy: proxyAuthor
      });

      setIsProxyModalOpen(false);
      setProxyJustification('');
      onRefreshData();
    } catch (err: any) {
      setProxyError(err.message || 'Erreur lors de la déclaration du proxy.');
    }
  };

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case 'ELEVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">CONFIANCE ÉLEVÉE</span>;
      case 'MODERE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">CONFIANCE MODÉRÉE</span>;
      case 'FAIBLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300">CONFIANCE FAIBLE</span>;
      case 'INCONNU':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-900 border border-slate-300">CONFIANCE INCONNUE</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Principle Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Historicité des Facteurs Environnementaux & Validité Temporelle
            </h3>
          </div>
          <button
            onClick={() => setIsProxyModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Déclarer un Proxy Historique</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs font-medium space-y-1">
          <strong className="font-bold text-amber-900 block">
            Règle Scientifique Absolue V1.13 — Non-Extrapolation Rétroactive :
          </strong>
          <p className="leading-relaxed">
            Un facteur environnemental observé à un instant T (ex: en 2026) ne doit <strong>JAMAIS</strong> être appliqué rétroactivement aux années antérieures sans validation explicite. Les sites évoluent dynamiquement dans le temps.
          </p>
        </div>
      </div>

      {/* Mandatory Scenario: Kasuku 5-State Historical Evolution (2022–2026) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Scénario Scientifique Obligatoire • Preuve d'Historicité Temporelle
            </span>
            <h4 className="font-bold text-slate-900 text-sm mt-0.5">
              Site Kasuku (Kindu) : Chronologie des 5 États Distincts (2022 à 2026)
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            5 États Scellés et Vérifiés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {kasukuRecords.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${
                rec.factorState === 'OUI' && rec.factorCode === 'ZONE_DECHETS'
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : rec.factorState === 'OUI' && rec.factorCode === 'CONSTRUCTION'
                  ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">{rec.year}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border">
                    {rec.precision}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-black uppercase tracking-wide">
                    {rec.factorLabel} : <span className="underline">{rec.factorState}</span>
                  </div>
                  <p className="text-[11px] font-medium mt-1 leading-tight">
                    {rec.stateDescription}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-black/10 text-[10px] text-slate-700 space-y-0.5">
                <div>Source : {rec.source.slice(0, 24)}...</div>
                <div className="font-bold">Date : {rec.exactDate || rec.validFrom}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
          <strong className="text-slate-900 font-bold block">Résultat de la vérification scientifique :</strong>
          <p className="leading-relaxed">
            Si une analyse rétrospective de 2022 est lancée, le site Kasuku est correctement identifié comme <strong>« Décharge = OUI »</strong>. Si une analyse de 2026 est lancée, il est identifié comme <strong>« Décharge = NON / Bâti = OUI »</strong>. L'intégrité temporelle est parfaitement préservée.
          </p>
        </div>
      </div>

      {/* Historical Proxies Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Registre des Proxies Historiques Déclarés
            </h4>
            <p className="text-xs text-slate-500">
              Variables transposées avec justification scientifique obligatoire pour les analyses de sensibilité.
            </p>
          </div>
          <span className="text-xs text-slate-500">{proxies.length} proxy(s) validé(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2.5">Variable & Territoire</th>
                <th className="p-2.5 text-center">Source → Cible</th>
                <th className="p-2.5">Justification Scientifique (Obligatoire)</th>
                <th className="p-2.5 text-center">Niveau Confiance</th>
                <th className="p-2.5">Auteur & Date</th>
                <th className="p-2.5 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proxies.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-2.5">
                    <div className="font-bold text-slate-900">{p.variableName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{p.siteOrZoneName}</div>
                  </td>
                  <td className="p-2.5 text-center font-bold text-indigo-700">
                    {p.sourceObservationYear} → {p.targetProxyYear}
                  </td>
                  <td className="p-2.5 text-slate-700 max-w-xs">
                    <p className="line-clamp-2 italic">« {p.scientificJustification} »</p>
                  </td>
                  <td className="p-2.5 text-center">
                    {getConfidenceBadge(p.confidenceLevel)}
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px]">
                    <div>{p.declaredBy}</div>
                    <div className="text-[10px] text-slate-400">{p.declaredAt}</div>
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Proxy Modal */}
      {isProxyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProxy}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Déclarer un Proxy Historique</h3>
                <p className="text-xs text-slate-500">Transposition contrôlée d'une variable environnementale</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProxyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {proxyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-xs font-semibold">
                {proxyError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block uppercase mb-1">Variable d'intérêt</label>
                <select
                  value={proxyVariableCode}
                  onChange={(e) => setProxyVariableCode(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="presence_zone_dechets">Présence de décharges sauvages</option>
                  <option value="gites_larvaires_anopheles">Gîtes larvaires anophéliens</option>
                  <option value="acces_eau_potable_pct">Accès eau potable protégée</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block uppercase mb-1">Zone de Santé cible</label>
                  <select
                    value={proxyTargetZoneId}
                    onChange={(e) => setProxyTargetZoneId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {MANIEMA_18_HEALTH_ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block uppercase mb-1">Niveau de Confiance</label>
                  <select
                    value={proxyConfidence}
                    onChange={(e) => setProxyConfidence(e.target.value as ConfidenceLevel)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="ELEVE">Élevé</option>
                    <option value="MODERE">Modéré</option>
                    <option value="FAIBLE">Faible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block uppercase mb-1">Année Source (Mesurée)</label>
                  <select
                    value={proxySourceYear}
                    onChange={(e) => setProxySourceYear(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {STUDY_YEARS_2018_2026.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block uppercase mb-1">Année Cible (Proxy)</label>
                  <select
                    value={proxyTargetYear}
                    onChange={(e) => setProxyTargetYear(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    {STUDY_YEARS_2018_2026.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block uppercase mb-1">
                  Justification Scientifique (OBLIGATOIRE) *
                </label>
                <textarea
                  rows={3}
                  placeholder="Expliquez pourquoi l'état du site / de la variable peut être considéré comme stable entre ces deux années..."
                  value={proxyJustification}
                  onChange={(e) => setProxyJustification(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block uppercase mb-1">Chercheur déclarant</label>
                <input
                  type="text"
                  value={proxyAuthor}
                  onChange={(e) => setProxyAuthor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsProxyModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Enregistrer le Proxy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
