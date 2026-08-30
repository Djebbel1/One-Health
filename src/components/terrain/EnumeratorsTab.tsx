import React, { useState } from 'react';
import { FieldEnumerator, FieldUserRole } from '../../types';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Clock,
  Shield,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Radio
} from 'lucide-react';

interface EnumeratorsTabProps {
  enumerators: FieldEnumerator[];
  currentUserRole: FieldUserRole;
  onTogglePrivacy?: (enumeratorId: string) => void;
}

export const EnumeratorsTab: React.FC<EnumeratorsTabProps> = ({
  enumerators,
  currentUserRole,
  onTogglePrivacy
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hidePrivateLocations, setHidePrivateLocations] = useState(false);

  const isSupervisorOrAdmin = ['ADMINISTRATEUR', 'SUPERVISEUR', 'RESPONSABLE_CAMPAGNE'].includes(currentUserRole);

  const filteredEnums = enumerators.filter((e) => {
    return (
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.assignedZones.some((z) => z.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getConnectionBadge = (state: 'ONLINE' | 'UNSTABLE' | 'OFFLINE') => {
    switch (state) {
      case 'ONLINE':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>En Ligne (4G)</span>
          </span>
        );
      case 'UNSTABLE':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Instable (2G)</span>
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full flex items-center space-x-1">
            <WifiOff className="w-2.5 h-2.5" />
            <span>Hors Ligne</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Barre d'action */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Agents
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Identifiants Stricts &amp; Protection de la Vie Privée</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Annuaire &amp; Flotte des Terminaux d Enquête
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillance de la connectivité, des niveaux de batterie et du volume de synchronisation en attente.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher enquêteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 w-56"
            />
          </div>

          {/* Toggle Privacy */}
          <button
            onClick={() => setHidePrivateLocations(!hidePrivateLocations)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              hidePrivateLocations
                ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            {hidePrivateLocations ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hidePrivateLocations ? 'GPS Flouté (Anonymat)' : 'GPS Précis'}</span>
          </button>
        </div>
      </div>

      {/* Cartes des Enquêteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEnums.map((enq) => {
          const completionPercent = enq.assignedHouseholdsTarget > 0
            ? Math.min(100, Math.round((enq.completedForms / enq.assignedHouseholdsTarget) * 100))
            : 0;

          return (
            <div
              key={enq.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                
                {/* En-tête Enquêteur */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {enq.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {enq.internalCode}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {enq.displayName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {enq.teamName}
                    </p>
                  </div>
                  <div>{getConnectionBadge(enq.connectionState)}</div>
                </div>

                {/* État Terminal & Télémétrie */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Batterie &amp; App
                    </span>
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800 mt-0.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{enq.batteryLevel || 80}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {enq.appVersion}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      En attente Sync
                    </span>
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        enq.pendingSyncCount > 0
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {enq.pendingSyncCount} non synchronisés
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {enq.draftsCount} brouillon(s)
                    </span>
                  </div>
                </div>

                {/* Localisation GPS & Confidentialité */}
                <div className="text-xs space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Position Géographique :
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold">
                      Précision ~{enq.accuracyMeters || 5}m
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-slate-700">
                    {hidePrivateLocations ? (
                      <span className="italic text-slate-400">
                        Latitude -2.95***, Longitude 25.95*** (Anonymisé)
                      </span>
                    ) : (
                      <span>
                        Lat: {enq.currentLatitude?.toFixed(4)}, Lng: {enq.currentLongitude?.toFixed(4)}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Aires assignées : {enq.assignedHealthAreas.join(', ')}
                  </div>
                </div>

                {/* Progression Objectifs */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Quota Réalisé</span>
                    <span className="font-mono font-bold text-teal-800">
                      {enq.completedForms} / {enq.assignedHouseholdsTarget} ({completionPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Pied de Carte */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Dernière synchro : {enq.lastSyncTimestamp || 'N/A'}</span>
                </div>
                <span className="font-bold text-emerald-700">Actif</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
