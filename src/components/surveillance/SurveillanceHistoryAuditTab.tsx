import React, { useState } from 'react';
import {
  MOCK_SURVEILLANCE_ALERTS_V117
} from '../../data/mockSurveillanceDataV117';
import {
  FileText,
  Clock,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock
} from 'lucide-react';

export const SurveillanceHistoryAuditTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const auditLogs = [
    {
      id: 'AUD-001',
      timestamp: '2026-08-28 14:35',
      user: 'Dr. Jean-Paul KASONGO',
      role: 'SUPERVISEUR',
      action: 'Vérification & Confirmation Alerte',
      target: 'Dossier ALT-2026-08-KAS',
      details: 'Confirmation de l alerte paludisme suite à la persistance de 3 semaines et confirmation biologique TDR.',
      ip: '192.168.1.45'
    },
    {
      id: 'AUD-002',
      timestamp: '2026-08-27 10:15',
      user: 'M. Dieudonné LUMUMBA',
      role: 'ANALYSTE',
      action: 'Évaluation Signal Multi-Critères',
      target: 'Signal SIG-2026-08-KAS-01',
      details: 'Vérification de l anomalie pluviométrique S29 (+42mm) et validation du lag 1 mois.',
      ip: '192.168.1.50'
    },
    {
      id: 'AUD-003',
      timestamp: '2026-08-26 16:40',
      user: 'Dr. Jean-Paul KASONGO',
      role: 'SUPERVISEUR',
      action: 'Mise en Observation Alerte',
      target: 'Dossier ALT-2026-08-MIK',
      details: 'Demande de vérification de potabilité de l eau et prélèvements complémentaires au CS Mikelenge.',
      ip: '192.168.1.45'
    },
    {
      id: 'AUD-004',
      timestamp: '2026-08-25 09:00',
      user: 'Système Automatique V1.17',
      role: 'ADMINISTRATEUR',
      action: 'Génération Hebdomadaire des Signaux S33',
      target: 'Moteur de Détection One Health',
      details: 'Comparaison des 36 structures de santé aux modèles GLM-NB V1.16 validés.',
      ip: '127.0.0.1 (Local)'
    }
  ];

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Journal d&apos;Audit &amp; Historique des Décisions
            </h2>
            <p className="text-xs text-slate-500">
              Traçabilité immuable des actions, vérifications humaines, modifications de seuils et rôles (RBAC)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher utilisateur, dossier..."
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 w-64 focus:outline-teal-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Cartes d'Indicateurs d'Audit */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Actions Enregistrées
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">142</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Intégrité vérifiée
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Historique complet depuis le lancement du module V1.17
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Vérifications Humaines
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">100%</span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Avec justification
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Aucune alerte confirmée sans motivation documentée
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Contrôle des Rôles (RBAC)
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">Actif</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              Lecteur / Analyste / Superviseur / Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Droits stricts sur la clôture et la confirmation des dossiers
          </p>
        </div>
      </div>

      {/* Tableau des Logs d'Audit */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-slate-600" />
            <span>Journal des Événements &amp; Décisions de Surveillance</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-bold">Horodatage</th>
                <th className="p-3 font-bold">Utilisateur &amp; Rôle</th>
                <th className="p-3 font-bold">Action Réalisée</th>
                <th className="p-3 font-bold">Cible / Dossier</th>
                <th className="p-3 font-bold">Détails &amp; Motivation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{log.user}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.role}</div>
                  </td>
                  <td className="p-3 font-medium text-teal-800">{log.action}</td>
                  <td className="p-3 font-mono font-bold text-slate-700">{log.target}</td>
                  <td className="p-3 text-slate-600 text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
