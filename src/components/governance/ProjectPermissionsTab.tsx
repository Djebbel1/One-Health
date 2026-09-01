import React, { useState } from 'react';
import {
  Users,
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  Lock,
  UserCheck,
  AlertTriangle,
  FolderKanban,
  Sparkles,
  Info
} from 'lucide-react';
import { ProjectUserPermission, StudyProject } from '../../types';

interface ProjectPermissionsTabProps {
  permissions: ProjectUserPermission[];
  projects: StudyProject[];
  onUpdatePermission: (userId: string, projectId: string, permKey: keyof ProjectUserPermission, val: boolean) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const ProjectPermissionsTab: React.FC<ProjectPermissionsTabProps> = ({
  permissions,
  projects,
  onUpdatePermission,
  onAddAuditLog
}) => {
  const [selectedUser, setSelectedUser] = useState<ProjectUserPermission>(permissions[0] || {} as ProjectUserPermission);

  const permKeys: { key: keyof ProjectUserPermission; label: string; desc: string }[] = [
    { key: 'canCollect', label: 'Collecte Mobile Terrain (V1.18)', desc: 'Saisie et synchronisation des fiches sur tablette' },
    { key: 'canAccessData', label: 'Accès aux Données & Datasets', desc: 'Consultation des tables RAW et CLEAN' },
    { key: 'canAnalyze', label: 'Laboratoire d Analyse (V1.14)', desc: 'Exploration spatiotemporelle et statistiques descriptives' },
    { key: 'canModel', label: 'Modélisation & Prédiction (V1.15)', desc: 'Entraînement de modèles GAM, GLM et inférence' },
    { key: 'canSurveil', label: 'Surveillance & Alertes (V1.17)', desc: 'Détection des signaux anormaux et dépassements de seuils' },
    { key: 'canExport', label: 'Exportation des Données (Excel/CSV)', desc: 'Extraction certifiée avec métadonnées et hash' },
    { key: 'canAdminister', label: 'Administration & Gouvernance', desc: 'Gestion des protocoles, dictionnaires et droits' }
  ];

  const handleTogglePerm = (permKey: keyof ProjectUserPermission) => {
    if (!selectedUser || typeof selectedUser[permKey] !== 'boolean') return;
    const currentVal = Boolean(selectedUser[permKey]);
    const newVal = !currentVal;

    onUpdatePermission(selectedUser.userId, selectedUser.projectId, permKey, newVal);

    // local update
    setSelectedUser(prev => ({ ...prev, [permKey]: newVal }));

    onAddAuditLog('MODIFICATION_PERMISSIONS', `Modification droit [${String(permKey)}] pour ${selectedUser.userName} sur projet ${selectedUser.projectId}`, {
      user: selectedUser.userName,
      permKey: String(permKey),
      newValue: newVal
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMINISTRATEUR': return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'RESPONSABLE_CAMPAGNE': return 'bg-teal-100 text-teal-900 border-teal-200';
      case 'SUPERVISEUR': return 'bg-sky-100 text-sky-900 border-sky-200';
      case 'ENQUETEUR': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'CONTROLEUR_QUALITE': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'OBSERVATEUR': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!selectedUser || !selectedUser.userId) {
    return <div className="p-8 text-center text-slate-500 text-sm">Aucune permission d utilisateur enregistrée.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Permissions par Projet & Matrice RBAC</h3>
            <p className="text-xs text-slate-500">
              Isolation stricte des accès inter-projets et matrice de droits granulaires par rôle opérationnel
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Users List & Granular Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Users & Assigned Projects */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Utilisateurs & Assignations aux Projets
          </h4>
          <div className="space-y-3">
            {permissions.map((p) => {
              const isSelected = selectedUser.userId === p.userId && selectedUser.projectId === p.projectId;
              return (
                <div
                  key={`${p.userId}-${p.projectId}`}
                  onClick={() => setSelectedUser(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{p.userName}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(p.userRole)}`}>
                          {p.userRole.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {p.userId}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
                    <span>Projet : <strong>{p.projectId}</strong></span>
                    <span className="text-teal-700 font-semibold">{p.grantedBy}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-teal-900 text-teal-100 rounded-2xl border border-teal-800 text-xs sm:text-sm space-y-1.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-300" />
              Principe du Moindre Privilège
            </p>
            <p className="text-teal-200 text-xs">
              Un utilisateur sans assignation à un projet ne peut ni lire, ni exporter, ni injecter de données dans ce projet.
            </p>
          </div>
        </div>

        {/* Right: Granular Permissions Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                    {selectedUser.userId}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border ${getRoleBadge(selectedUser.userRole)}`}>
                    {selectedUser.userRole}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {selectedUser.userName} — Projet : <span className="font-mono text-teal-700">{selectedUser.projectId}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Droits accordés le {selectedUser.grantedAt} par {selectedUser.grantedBy}
                </p>
              </div>
            </div>

            {/* Granular Module Access Switches */}
            <div className="space-y-3">
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600" />
                Matrice des Droits Applicatifs par Module
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {permKeys.map(({ key, label, desc }) => {
                  const isAllowed = Boolean(selectedUser[key]);
                  return (
                    <div
                      key={String(key)}
                      onClick={() => handleTogglePerm(key)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isAllowed
                          ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-900">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isAllowed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
