import React, { useState } from 'react';
import { FieldFormRecord } from '../../types';
import {
  Wifi,
  WifiOff,
  Radio,
  HardDrive,
  Download,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

interface OfflineManagerTabProps {
  isOfflineMode: boolean;
  onToggleOfflineMode: (offline: boolean) => void;
  forms: FieldFormRecord[];
}

export const OfflineManagerTab: React.FC<OfflineManagerTabProps> = ({
  isOfflineMode,
  onToggleOfflineMode,
  forms
}) => {
  const [networkType, setNetworkType] = useState<'ONLINE' | 'UNSTABLE' | 'OFFLINE'>(
    isOfflineMode ? 'OFFLINE' : 'ONLINE'
  );

  const pendingForms = forms.filter((f) => f.syncStatus === 'PENDING');
  const draftsCount = forms.filter((f) => f.status === 'BROUILLON').length;

  const handleNetworkChange = (type: 'ONLINE' | 'UNSTABLE' | 'OFFLINE') => {
    setNetworkType(type);
    onToggleOfflineMode(type === 'OFFLINE');
  };

  const handleExportEmergencyBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(forms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sauvegarde_terrain_urgence_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Hors Connexion
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Persistance Locale &amp; PWA Service Worker</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Gestionnaire Hors Connexion &amp; Stockage Terminal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Contrôle du mode réseau simulé, de l espace de stockage persistant et de la sécurité des données non synchronisées.
          </p>
        </div>

        <button
          onClick={handleExportEmergencyBackup}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Secours (JSON)</span>
        </button>
      </div>

      {/* Simulateur d'Environnement Réseau */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Simulateur d État Réseau sur le Terrain (Maniema) :
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleNetworkChange('ONLINE')}
            className={`p-4 rounded-2xl border text-left transition flex items-start space-x-3 ${
              networkType === 'ONLINE'
                ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">
                1. Connecté (4G / WiFi Stable)
              </strong>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                Synchronisation automatique en tâche de fond active.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNetworkChange('UNSTABLE')}
            className={`p-4 rounded-2xl border text-left transition flex items-start space-x-3 ${
              networkType === 'UNSTABLE'
                ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">
                2. Réseau Instable (2G / GPRS)
              </strong>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                Latence élevée, transmission par micro-lots sécurisés.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleNetworkChange('OFFLINE')}
            className={`p-4 rounded-2xl border text-left transition flex items-start space-x-3 ${
              networkType === 'OFFLINE'
                ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-900 block">
                3. Hors Connexion (Mode Avion)
              </strong>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                100% autonome : saisie, persistance et GPS stockés en local.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Métriques d'Espace & PWA Cache */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Espace Utilisé */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Espace de Stockage Local</h3>
              <p className="text-[11px] text-slate-500">IndexedDB &amp; LocalStorage persistant</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Volume consommé :</span>
              <span className="font-mono font-bold text-teal-800">4.2 MB / 50 MB alloués</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full w-[8%]" />
            </div>
            <p className="text-[10px] text-slate-400">
              Capacité estimée restante : ~12 500 questionnaires avec coordonnées GPS et horodatages complets.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <p><strong>Formulaires locaux totaux :</strong> {forms.length}</p>
            <p><strong>En attente d envoi :</strong> {pendingForms.length}</p>
            <p><strong>Brouillons actifs :</strong> {draftsCount}</p>
          </div>
        </div>

        {/* Garantie Zéro Perte & Avertissement Déconnexion */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Garantie Anti-Perte de Données</h3>
                <p className="text-[11px] text-slate-500">Protection active des sessions</p>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-indigo-900 leading-relaxed space-y-1">
              <strong>🛡️ Déconnexion Sécurisée du Terminal :</strong>
              <p className="text-[11px]">
                {pendingForms.length > 0 ? (
                  <span>
                    Attention : Vous avez <strong>{pendingForms.length} formulaire(s)</strong> non synchronisé(s). Il est fortement déconseillé de vider le cache du navigateur avant la prochaine synchronisation réussie.
                  </span>
                ) : (
                  <span>
                    Tous les questionnaires enregistrés sont synchronisés ou sauvegardés. Aucune donnée n est en péril.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>PWA Service Worker : Actif</span>
            <span className="font-bold text-emerald-700">Cache Hors-Ligne Prêt</span>
          </div>
        </div>

      </div>

    </div>
  );
};
