import React from 'react';
import { UserRole } from '../types';
import { Shield, User, CheckCircle, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentName: string;
  onSelectUser: (user: { id: string; name: string; role: UserRole; healthAreaId?: string }) => void;
}

const PRESET_USERS = [
  {
    id: 'USR_CHERCHEUR_01',
    name: 'Pr. Dieudonné Kalonda',
    role: 'CHERCHEUR' as UserRole,
    title: 'Chercheur Principal • Université de Kindu (UNIKI)',
    description: 'Accès complet aux données, matrice de modélisation, exports SIG et analyse spatio-temporelle.',
  },
  {
    id: 'USR_SUPERVISEUR_01',
    name: 'Dr. Jeanne Mwamba',
    role: 'SUPERVISEUR' as UserRole,
    title: 'Médecin Chef de Zone • DPS Maniema',
    description: 'Validation des rapports sanitaires, contrôle qualité, alertes épidémiques.',
  },
  {
    id: 'USR_ENQUETEUR_01',
    name: 'Jean-Pierre Amisi',
    role: 'ENQUETEUR_TERRAIN' as UserRole,
    title: 'Agent de Recherche Terrain • Zone Kindu',
    description: 'Saisie rapide géolocalisée, enquêtes ménages anonymisées et captures photos.',
  },
  {
    id: 'USR_METEO_01',
    name: 'Patrick Ramazani',
    role: 'AGENT DE SAISIE' as UserRole,
    title: 'Technicien Météo • Station Aéroport FZOA',
    description: 'Saisie des données pluviométriques et températures journalières.',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentName,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Changer de Profil Utilisateur (Authentification)
            </h3>
            <p className="text-xs text-slate-500">
              Plateforme One Health Kindu • Recherche Universitaire RDC
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          {PRESET_USERS.map((u) => {
            const isSelected = u.name === currentName;

            return (
              <div
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{u.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                        u.role === 'CHERCHEUR'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'SUPERVISEUR'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'ENQUETEUR_TERRAIN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">{u.title}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{u.description}</p>
                </div>

                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Accès sécurisé pour la recherche. Les identifiants des ménages sont anonymisés de façon irréversible.</span>
        </div>
      </div>
    </div>
  );
};
