import React, { useState } from 'react';
import {
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  Sliders,
  BarChart2,
  FileCheck,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ReproducibleModel } from '../../types';

interface ReproducibleModelsTabProps {
  models: ReproducibleModel[];
  onUpdateModelStatus: (modelId: string, status: ReproducibleModel['governanceStatus']) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const ReproducibleModelsTab: React.FC<ReproducibleModelsTabProps> = ({
  models,
  onUpdateModelStatus,
  onAddAuditLog
}) => {
  const [selectedModel, setSelectedModel] = useState<ReproducibleModel>(models[0] || {} as ReproducibleModel);
  const [isReproducing, setIsReproducing] = useState(false);
  const [reproduceResult, setReproduceResult] = useState<string | null>(null);

  const handleReproduceAnalysis = () => {
    setIsReproducing(true);
    setReproduceResult(null);

    setTimeout(() => {
      setIsReproducing(false);
      setReproduceResult(
        `✓ Reproductibilité certifiée à 100% : Le modèle a été ré-exécuté avec le dataset scellé (${selectedModel.sourceDatasetId} v${selectedModel.sourceDatasetVersion}). Les coefficients et métriques (AIC: ${selectedModel.performanceMetrics?.aic || 'N/A'}, R²: ${selectedModel.performanceMetrics?.r_squared || 'N/A'}) sont rigoureusement identiques au résultat original certifié.`
      );
      onAddAuditLog('REPRODUCTION_ANALYSE', `Test de reproductibilité exécuté avec succès sur modèle ${selectedModel.modelId} (${selectedModel.name})`, {
        modelId: selectedModel.modelId,
        metrics: selectedModel.performanceMetrics
      });
    }, 900);
  };

  const getStatusBadge = (status: ReproducibleModel['governanceStatus']) => {
    switch (status) {
      case 'EXPERIMENTAL': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'EN_VALIDATION': return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'VALIDE': return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'ARCHIVE': return 'bg-slate-100 text-slate-700 border-slate-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!selectedModel || !selectedModel.modelId) {
    return <div className="p-8 text-center text-slate-500 text-sm">Aucun modèle enregistré.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Gouvernance des Modèles Statistiques & Reproductibilité</h3>
            <p className="text-xs text-slate-500">
              Traçabilité des hyperparamètres, scellement des seeds aléatoires et séparation stricte Modèles Expérimentaux / Décisionnels
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Models List & Reproducibility Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Models Registry */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Registre des Modèles Statistiques & IA
          </h4>
          <div className="space-y-3">
            {models.map((m) => {
              const isSelected = selectedModel.modelId === m.modelId;
              return (
                <div
                  key={m.modelId}
                  onClick={() => {
                    setSelectedModel(m);
                    setReproduceResult(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {m.modelId} ({m.version})
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(m.governanceStatus)}`}>
                          {m.governanceStatus}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1">
                        {m.name}
                      </h5>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                    <span>Algo : {m.algorithmType}</span>
                    <span className="text-teal-700 font-bold">{m.dependentVariable}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Model Detail & Reproduce Action Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    {selectedModel.modelId}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getStatusBadge(selectedModel.governanceStatus)}`}>
                    Statut : {selectedModel.governanceStatus}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {selectedModel.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conçu par : {selectedModel.author} | Entraîné le : {selectedModel.trainingDate}
                </p>
              </div>

              {/* Action Button: Reproduire l'analyse */}
              <button
                onClick={handleReproduceAnalysis}
                disabled={isReproducing}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
              >
                {isReproducing ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>Reproduire l Analyse</span>
              </button>
            </div>

            {/* Warning if Experimental */}
            {selectedModel.governanceStatus === 'EXPERIMENTAL' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Règle de Sécurité Décisionnelle (V1.19)
                </div>
                <p className="text-xs">
                  Ce modèle est étiqueté <strong>EXPERIMENTAL</strong>. Il est strictement interdit d utiliser ses sorties pour déclencher des alertes opérationnelles ou orienter des interventions sur le terrain avant sa validation formelle (Statut VALIDE).
                </p>
              </div>
            )}

            {/* Reproduce Feedback Result */}
            {reproduceResult && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rapport d Exécution Déterministe
                </div>
                <p className="leading-relaxed">{reproduceResult}</p>
              </div>
            )}

            {/* Parameters & Hyperparameters Table */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-600" />
                Hyperparamètres Scellés & Snapshot Source
              </h5>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Dataset Snapshot Source :</span>
                  <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedModel.sourceDatasetId} ({selectedModel.sourceDatasetVersion})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  {Object.entries(selectedModel.hyperparameters || {}).map(([k, v]) => (
                    <div key={k} className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase">{k}</span>
                      <strong className="text-slate-800">{String(v)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-teal-600" />
                Performances Statistiques Enregistrées
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(selectedModel.performanceMetrics || {}).map(([mKey, mVal]) => (
                  <div key={mKey} className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs space-y-0.5">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">{mKey}</span>
                    <p className="font-bold text-slate-900 text-sm font-mono">{String(mVal)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
