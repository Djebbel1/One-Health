import React, { useState } from 'react';
import {
  Shield,
  Lock,
  CheckCircle2,
  XCircle,
  FolderLock,
  AlertTriangle,
  Eye,
  PlusCircle,
  Edit3,
  CheckSquare,
  Trash2,
  Download,
  Settings,
  HelpCircle,
  Search
} from 'lucide-react';
import {
  RolePermissionMatrixEntry,
  UserRole,
  OneHealthProject
} from '../../types';

interface RbacAndPermissionsTabProps {
  permissionMatrix: RolePermissionMatrixEntry[];
  currentRole: UserRole;
  projects: OneHealthProject[];
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
}

export const RbacAndPermissionsTab: React.FC<RbacAndPermissionsTabProps> = ({
  permissionMatrix,
  currentRole,
  projects,
  onAddSecurityLog
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'ADMINISTRATEUR');
  const [testResult, setTestResult] = useState<{ allowed: boolean; message: string; timestamp: string } | null>(null);

  const activeRoleEntry = permissionMatrix.find((r) => r.role === selectedRole) || permissionMatrix[0];

  const handleSimulateAccessAttempt = (moduleKey: string, action: string, allowed: boolean) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    if (allowed) {
      setTestResult({
        allowed: true,
        message: `✓ AUTORISÉ : Le rôle [${selectedRole}] dispose de la permission [${action}] sur le module [${moduleKey}].`,
        timestamp
      });
      onAddSecurityLog('ROLE_CHANGED', `Test d accès autorisé : Rôle ${selectedRole} -> ${moduleKey}.${action}`, 'INFO');
    } else {
      setTestResult({
        allowed: false,
        message: `⛔ ACCÈS REFUSÉ (403 Forbidden) : Le rôle [${selectedRole}] n a pas la permission [${action}] sur [${moduleKey}]. Violation de moindre privilège interceptée.`,
        timestamp
      });
      onAddSecurityLog('UNAUTHORIZED_ACCESS_BLOCKED', `Tentative d accès non autorisé bloquée : Rôle ${selectedRole} -> ${moduleKey}.${action}`, 'WARNING');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Shield className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Matrice RBAC & Principe du Moindre Privilège
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Contrôle d accès granulaire basé sur les rôles opérationnels (V1.20)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Choisir un rôle :</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as UserRole);
                setTestResult(null);
              }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:outline-hidden"
            >
              {permissionMatrix.map((p) => (
                <option key={p.role} value={p.role}>
                  {p.role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role Description Card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-indigo-900 font-bold block">
              Périmètre du Rôle : {activeRoleEntry.role}
            </strong>
            <p className="text-slate-600 text-[11px] mt-0.5">{activeRoleEntry.roleDescription}</p>
          </div>
          <div className="shrink-0 font-mono text-[11px] bg-white px-3 py-1 rounded-lg border border-slate-200">
            Portée Projets : <span className="font-bold text-indigo-700">{activeRoleEntry.projectAccessScope}</span>
          </div>
        </div>
      </div>

      {/* Permissions Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          Droits Granulaires par Domaine Fonctionnel
        </h4>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Module Système</th>
                <th className="p-3 text-center">Lecture (Read)</th>
                <th className="p-3 text-center">Création (Create)</th>
                <th className="p-3 text-center">Mise à Jour (Update)</th>
                <th className="p-3 text-center">Validation (Sign)</th>
                <th className="p-3 text-center">Corbeille (SoftDel)</th>
                <th className="p-3 text-center">Suppr. Hard (Admin)</th>
                <th className="p-3 text-center">Export Complet</th>
                <th className="p-3 text-center">Export Anonyme</th>
                <th className="p-3 text-center">Actions Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {activeRoleEntry.modules.map((mod) => (
                <tr key={mod.moduleKey} className="hover:bg-slate-50/70">
                  <td className="p-3 font-sans font-bold text-slate-900">
                    {mod.moduleLabel}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canRead ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canCreate ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canUpdate ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canValidate ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canSoftDelete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canHardDelete ? (
                      <CheckCircle2 className="w-4 h-4 text-rose-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canExportFull ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Brut
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {mod.canExportAnonymized ? (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Anonyme
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center font-sans">
                    <button
                      onClick={() =>
                        handleSimulateAccessAttempt(
                          mod.moduleLabel,
                          'Modification/Écriture',
                          mod.canUpdate
                        )
                      }
                      className="text-[10px] font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                    >
                      Tester Accès
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              testResult.allowed
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : 'bg-rose-50 text-rose-950 border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.allowed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-semibold">{testResult.message}</span>
            </div>
            <span className="text-[10px] font-mono opacity-70 shrink-0">
              {testResult.timestamp.split(' ')[1]}
            </span>
          </div>
        )}
      </div>

      {/* Multi-Project Isolation Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <FolderLock className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Isolation Hermétique Inter-Projets (Multi-Tenancy)
              </h4>
              <p className="text-xs text-slate-500">
                Cloisonnement strict des enquêtes, datasets et fiches entre les zones sanitaires
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  {proj.code}
                </span>
                <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  Isolé
                </span>
              </div>
              <strong className="text-slate-900 font-bold block text-xs">
                {proj.title}
              </strong>
              <p className="text-[11px] text-slate-600">
                Périmètre : Zone de santé de {proj.region || 'Maniema'}
              </p>
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Accès restreint : Enquêteurs affectés</span>
                <span className="text-emerald-700 font-bold">✓ Étanchéité validée</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
