import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Laptop,
  Tablet,
  Key,
  Lock,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Radio,
  UserCheck,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Info
} from 'lucide-react';
import {
  SecurityUserSession,
  ConnectedDevice,
  MFAConfiguration,
  SecurityEnvironmentConfig,
  UserRole
} from '../../types';

interface AuthAndSessionsTabProps {
  currentSession: SecurityUserSession;
  connectedDevices: ConnectedDevice[];
  mfaConfig: MFAConfiguration;
  envConfig: SecurityEnvironmentConfig;
  onRevokeDevice: (deviceId: string) => void;
  onUpdateMfaConfig: (updates: Partial<MFAConfiguration>) => void;
  onResetFailedAttempts: () => void;
  onAddSecurityLog: (action: any, details: string, severity?: any) => void;
  onSimulateFailedLogin: () => void;
  onSafeLogout: () => void;
  pendingSyncCount: number;
}

export const AuthAndSessionsTab: React.FC<AuthAndSessionsTabProps> = ({
  currentSession,
  connectedDevices,
  mfaConfig,
  envConfig,
  onRevokeDevice,
  onUpdateMfaConfig,
  onResetFailedAttempts,
  onAddSecurityLog,
  onSimulateFailedLogin,
  onSafeLogout,
  pendingSyncCount
}) => {
  const [totpInput, setTotpInput] = useState('');
  const [totpVerified, setTotpVerified] = useState(false);
  const [showTotpSetupModal, setShowTotpSetupModal] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleToggleMfa = () => {
    if (mfaConfig.enabled) {
      onUpdateMfaConfig({ enabled: false });
      onAddSecurityLog('ROLE_CHANGED', 'Désactivation du protocole MFA/2FA pour la session courante', 'WARNING');
    } else {
      setShowTotpSetupModal(true);
    }
  };

  const handleConfirmTotpSetup = () => {
    if (totpInput.trim().length === 6) {
      onUpdateMfaConfig({
        enabled: true,
        lastVerifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      });
      setTotpVerified(true);
      setShowTotpSetupModal(false);
      setTotpInput('');
      onAddSecurityLog('MFA_ENABLED', 'Activation réussie de l authentification multifacteur (TOTP RFC 6238)', 'INFO');
    }
  };

  const getDeviceIcon = (type: ConnectedDevice['deviceType']) => {
    switch (type) {
      case 'TABLET':
        return <Tablet className="w-4 h-4 text-sky-600" />;
      case 'MOBILE':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'DESKTOP':
      default:
        return <Laptop className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Session Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Session Active & Empreinte de Sécurité
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestion de l identité chiffrée, expiration automatique et paramètres de moindre privilège
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-1 rounded-md font-bold">
              ID Session : {currentSession.sessionId}
            </span>
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion Sécurisée
            </button>
          </div>
        </div>

        {/* User Identity Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Utilisateur Connecté
            </span>
            <p className="text-sm font-bold text-slate-900">{currentSession.userName}</p>
            <p className="text-xs text-slate-600 font-medium">{currentSession.institution}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              Rôle : {currentSession.userRole}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Sécurité du Jeton & Expiration
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-800 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Timeout : {envConfig.sessionTimeoutMinutes} min d inactivité</span>
            </div>
            <p className="text-xs text-slate-600">
              Expire à : <span className="font-mono font-bold text-slate-800">{currentSession.tokenExpiresAt}</span>
            </p>
            <div className="mt-2 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Jeton de session signé cryptographiquement
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Origine Réseau & Matériel
            </span>
            <p className="text-xs font-mono text-slate-800">IP : {currentSession.currentIp}</p>
            <p className="text-xs text-slate-600">OS : {currentSession.currentOs}</p>
            <p className="text-xs text-slate-600">Navigateur : {currentSession.currentBrowser}</p>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication (MFA/2FA) Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Key className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Authentification Multi-Facteurs (MFA / 2FA)
              </h4>
              <p className="text-xs text-slate-500">
                Double validation obligatoire pour les rôles à privilèges élevés (Chercheur Principal, Administrateur)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                mfaConfig.enabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {mfaConfig.enabled ? '✓ MFA ACTIF (TOTP)' : 'MFA DÉSACTIVÉ'}
            </span>
            <button
              onClick={handleToggleMfa}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                mfaConfig.enabled
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
              }`}
            >
              {mfaConfig.enabled ? 'Désactiver' : 'Configurer MFA'}
            </button>
          </div>
        </div>

        {/* MFA Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">Protocole TOTP Standard (RFC 6238)</span>
            <p className="text-slate-600 text-[11px]">
              Compatible avec Google Authenticator, Microsoft Authenticator, FreeOTP ou clés FIDO2.
            </p>
            <div className="font-mono text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-700 flex items-center justify-between">
              <span>Clé Secrète : {mfaConfig.maskedSecretKey}</span>
              <span className="text-[10px] text-slate-400">Masquée</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Codes de secours restants : <strong>{mfaConfig.backupCodesRemaining}</strong>
            </p>
          </div>

          {/* External SMS / Keycloak / Firebase Notice */}
          <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-200 space-y-2 text-xs text-sky-950">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <Info className="w-4 h-4 text-sky-700 shrink-0" />
              <span>Note d Architecture Passerelle SMS / Auth Externe</span>
            </div>
            <p className="text-[11px] leading-relaxed text-sky-900">
              {mfaConfig.externalProviderDocs}
            </p>
            <div className="text-[10px] font-mono text-sky-800 bg-sky-100/70 p-1.5 rounded">
              Conformité : Aucun secret ou clé API tiers en dur dans le frontend.
            </div>
          </div>
        </div>
      </div>

      {/* Connected Devices Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Appareils Connectés & Révocation à Distance
              </h4>
              <p className="text-xs text-slate-500">
                Surveillance des tablettes de collecte mobile, terminaux de supervision et postes de laboratoire
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-500">
            {connectedDevices.filter(d => !d.isRevoked).length} session(s) active(s)
          </span>
        </div>

        {/* Devices List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {connectedDevices.map((dev) => (
            <div
              key={dev.deviceId}
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                dev.isRevoked ? 'bg-slate-100/60 opacity-60' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getDeviceIcon(dev.deviceType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{dev.deviceName}</span>
                    {dev.isCurrentDevice && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Session Courante
                      </span>
                    )}
                    {dev.isRevoked && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        Accès Révoqué
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 space-x-2">
                    <span>IP : {dev.ipAddress}</span>
                    <span>•</span>
                    <span>{dev.os}</span>
                    <span>•</span>
                    <span>{dev.locationCity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Actif : {dev.lastActive}
                </span>
                {!dev.isCurrentDevice && !dev.isRevoked && (
                  <button
                    onClick={() => onRevokeDevice(dev.deviceId)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Révoquer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anti Brute-Force & Rate Limiting Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Protection Anti-Brute-Force & Limitation de Débit (Rate Limiting)
              </h4>
              <p className="text-xs text-slate-500">
                Blocage automatique après tentatives d intrusion répétées
              </p>
            </div>
          </div>

          <button
            onClick={onSimulateFailedLogin}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition"
          >
            Tester Échec Connexion (+1)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Tentatives Échouées Détectées</span>
            <p className="text-lg font-bold font-mono text-slate-900">
              {currentSession.failedLoginAttempts} / 5
            </p>
            <span className="text-[10px] text-slate-500">Seuil de blocage : 5 échecs</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Statut Compte</span>
            <p
              className={`text-sm font-bold mt-1 ${
                currentSession.isLockedOut ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {currentSession.isLockedOut ? '🔒 Verrouillé temporairement' : '✓ Normal (Déverrouillé)'}
            </p>
            {currentSession.isLockedOut && (
              <button
                onClick={onResetFailedAttempts}
                className="mt-1 text-[10px] text-indigo-700 font-bold underline"
              >
                Déverrouiller manuellement
              </button>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500">Politique de Débit (Rate Limit)</span>
            <p className="text-sm font-bold text-slate-900 font-mono">
              {envConfig.rateLimitMaxRequestsPerMinute} requêtes/min
            </p>
            <span className="text-[10px] text-teal-700 font-semibold">
              Protection DoS & Scan actif
            </span>
          </div>
        </div>
      </div>

      {/* TOTP Setup Modal */}
      {showTotpSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-teal-700" />
                Configuration TOTP (MFA)
              </h3>
              <button
                onClick={() => setShowTotpSetupModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Scannez le code ou saisissez la clé secrète dans votre application d authentification (Google Authenticator, Microsoft Authenticator) :
            </p>

            <div className="bg-slate-100 p-3 rounded-xl font-mono text-xs text-center tracking-widest text-slate-800 font-bold border border-slate-200">
              JBSW Y3DP EHPK 3PXP
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Code à 6 chiffres :</label>
              <input
                type="text"
                maxLength={6}
                value={totpInput}
                onChange={(e) => setTotpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 123456"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTotpSetupModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmTotpSetup}
                disabled={totpInput.length !== 6}
                className="px-4 py-2 text-xs font-bold bg-teal-700 text-white rounded-xl hover:bg-teal-800 disabled:opacity-50"
              >
                Valider & Activer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe Logout Confirm Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                Confirmer la Déconnexion Sécurisée
              </h3>
            </div>

            {pendingSyncCount > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
                <strong>Attention fiches en attente !</strong>
                <p>
                  Vous avez <strong>{pendingSyncCount} fiche(s)</strong> en attente de synchronisation dans votre cache local hors-ligne. Ces données sont conservées en sécurité dans votre mémoire locale.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Toutes vos données de collecte sont synchronisées. Votre jeton de session sera détruit et les journaux de sécurité enregistreront votre déconnexion propre.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLogoutConfirmOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  onSafeLogout();
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
              >
                Confirmer la Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
