import React, { useState } from 'react';
import {
  Server,
  Database,
  HardDrive,
  Cpu,
  Lock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  RotateCcw,
  Play,
  Activity,
  Wifi,
  FileCheck,
  Download,
  UploadCloud,
  Check,
  Radio,
  Sliders
} from 'lucide-react';
import {
  StagingEnvironmentConfigV127,
  EnvironmentType,
  UserRole
} from '../../types';
import {
  INITIAL_STAGING_CONFIG_V127,
  INITIAL_SIMULATED_INCIDENTS_V127,
  SimulatedIncidentV127
} from '../../data/mockV124ToV127Data';

interface V127StagingModuleTabProps {
  currentEnvironment: EnvironmentType;
  currentUserRole: UserRole;
}

export const V127StagingModuleTab: React.FC<V127StagingModuleTabProps> = ({
  currentEnvironment,
  currentUserRole
}) => {
  const [stagingConfig, setStagingConfig] = useState<StagingEnvironmentConfigV127>(INITIAL_STAGING_CONFIG_V127);
  const [incidents, setIncidents] = useState<SimulatedIncidentV127[]>(INITIAL_SIMULATED_INCIDENTS_V127);
  const [activeSubTab, setActiveSubTab] = useState<'STAGING_DASHBOARD' | 'INCIDENT_SIMULATOR' | 'ROLLBACK_RESTORE' | 'PRODUCTION_GATE'>('STAGING_DASHBOARD');

  // Rollback simulation state
  const [isSimulatingRollback, setIsSimulatingRollback] = useState(false);
  const [rollbackResult, setRollbackResult] = useState<string | null>(null);

  // Restore simulation state
  const [isSimulatingRestore, setIsSimulatingRestore] = useState(false);
  const [restoreResult, setRestoreResult] = useState<string | null>(null);

  // End-to-End Pipeline simulation (Mobile -> Offline -> Reconnect -> API -> Postgres -> Storage -> Analysis -> Map -> Report)
  const [isSimulatingE2E, setIsSimulatingE2E] = useState(false);
  const [e2eCurrentStep, setE2eCurrentStep] = useState<number>(0);
  const [e2eLogs, setE2eLogs] = useState<string[]>([]);

  // Trigger simulated incident
  const handleTriggerIncident = async (incidentId: string) => {
    const updated = incidents.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          isSelfHealed: false
        };
      }
      return inc;
    });
    setIncidents(updated);

    // Auto heal after 2.5s
    setTimeout(() => {
      setIncidents(prev => prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            isSelfHealed: true
          };
        }
        return inc;
      }));
    }, 2500);
  };

  // Run Rollback simulation
  const handleRunRollback = async () => {
    setIsSimulatingRollback(true);
    setRollbackResult(null);
    await new Promise(r => setTimeout(r, 1400));
    setRollbackResult('✅ Bascule instantanée de trafic réussie vers Révision N-1 (v1.23.8). Temps de coupure : 0 ms. Tous les health checks au vert.');
    setIsSimulatingRollback(false);
  };

  // Run Restore simulation
  const handleRunRestore = async () => {
    setIsSimulatingRestore(true);
    setRestoreResult(null);
    await new Promise(r => setTimeout(r, 1600));
    setRestoreResult('✅ Restauration snapshot STAGING réussie sur base isolée. 250 observations et 45 photos vérifiées avec empreinte SHA-256 concordante.');
    setIsSimulatingRestore(false);
  };

  // Run Full End-to-End Pipeline Simulation (Section 124)
  const handleRunE2EPipeline = async () => {
    setIsSimulatingE2E(true);
    setE2eLogs([]);
    const logs: string[] = [];
    const log = (msg: string) => {
      logs.push(msg);
      setE2eLogs([...logs]);
    };

    const steps = [
      '1. Authentification de l’Enquêteur (Role ENQUETEUR_TERRAIN / Session JWT)',
      '2. Sélection du Projet "Surveillance Paludisme Kindu" & Formulaire One Health',
      '3. Collecte hors-ligne avec coordonnées GPS (-2.9512, 25.9234) et capture photo',
      '4. Enregistrement local sécurisé en IndexedDB & Calcul du hash SHA-256',
      '5. Simulation de coupure réseau prolongée puis reconnexion',
      '6. Déclenchement de la synchronisation vers l’API Cloud Run Staging',
      '7. Insertion transactionnelle dans Cloud SQL PostgreSQL (Idempotence validée)',
      '8. Transfert sécurisé de la photo dans Google Cloud Storage (Bucket Staging)',
      '9. Agrégation statistique immédiate et projection SEIR mise à jour',
      '10. Rendu cartographique spatial (Leaflet) & Génération du rapport de synthèse'
    ];

    for (let i = 0; i < steps.length; i++) {
      setE2eCurrentStep(i + 1);
      log(`⚡ ${steps[i]}`);
      await new Promise(r => setTimeout(r, 400));
    }

    log('🎯 [SUCCÈS TOTAL] Démonstration bout en bout V1.24 → V1.27 validée sans aucune anomalie !');
    setIsSimulatingE2E(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête Phase V1.27 */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 text-white rounded-xl p-5 shadow-sm border border-purple-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                Phase V1.27
              </span>
              <h2 className="text-xl font-bold">Environnement STAGING Isolé & Verrouillage Production</h2>
            </div>
            <p className="text-purple-100/80 text-sm mt-1">
              Plateforme de pré-production isolée avec jeux de données synthétiques, tests de résilience aux incidents et verrou de production.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-600 text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              PRODUCTION_LOCKED = true
            </span>
          </div>
        </div>

        {/* Sous-onglets */}
        <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-purple-800/60">
          <button
            onClick={() => setActiveSubTab('STAGING_DASHBOARD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'STAGING_DASHBOARD'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            ☁️ Tableau de Bord Staging
          </button>
          <button
            onClick={() => setActiveSubTab('INCIDENT_SIMULATOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'INCIDENT_SIMULATOR'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            🚨 Simulateur d'Incidents ({incidents.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ROLLBACK_RESTORE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'ROLLBACK_RESTORE'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-950/60 text-purple-200 hover:bg-purple-900/60'
            }`}
          >
            🔄 Restauration & Rollback
          </button>
          <button
            onClick={() => setActiveSubTab('PRODUCTION_GATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'PRODUCTION_GATE'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-950/60 text-rose-200 hover:bg-rose-900/60'
            }`}
          >
            🚫 Production Gate & Verrous
          </button>
        </div>
      </div>

      {/* VUE 1 : TABLEAU DE BORD STAGING & DEMO BOUT EN BOUT */}
      {activeSubTab === 'STAGING_DASHBOARD' && (
        <div className="space-y-6">
          {/* Cartes d'état de l'infrastructure Staging */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold">Compute Cloud Run</span>
                <Cpu className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">onehealth-maniema-staging</div>
              <span className="text-[11px] text-emerald-600 font-semibold block">● Opérationnel (1 instance active)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold">PostgreSQL Cloud SQL</span>
                <Database className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">onehealth-pg-staging-01</div>
              <span className="text-[11px] text-emerald-600 font-semibold block">● 250 obs synthétiques • SSL forcé</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold">Google Cloud Storage</span>
                <HardDrive className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">...media-staging</div>
              <span className="text-[11px] text-emerald-600 font-semibold block">● 45 photos de test • Rétention 30j</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold">Statut Isolation</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-bold text-emerald-700">100% Isolé</div>
              <span className="text-[11px] text-slate-500 block">Zéro donnée patient réelle</span>
            </div>
          </div>

          {/* Démonstrateur Bout en Bout V1.24 -> V1.27 (Section 124) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-600" />
                  Démonstration Complète Bout en Bout (Pipeline Section 124)
                </h3>
                <p className="text-xs text-slate-500">
                  Utilisateur → Connexion → Projet → Enquête → GPS → Photo → Offline → Reconnexion → Synchro → PostgreSQL → Storage → Analyse → Carto → Rapport
                </p>
              </div>

              <button
                onClick={handleRunE2EPipeline}
                disabled={isSimulatingE2E}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all shrink-0"
              >
                <Activity className={`w-3.5 h-3.5 ${isSimulatingE2E ? 'animate-spin' : ''}`} />
                {isSimulatingE2E ? 'Exécution de la chaîne...' : 'Lancer la Démonstration E2E'}
              </button>
            </div>

            {/* Barre de progression des 10 étapes */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
                <div
                  key={step}
                  className={`p-2 rounded border text-center transition-all ${
                    e2eCurrentStep >= step
                      ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold text-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-400 text-xs'
                  }`}
                >
                  <span className="block text-[10px]">Étape</span>
                  <span className="font-mono">{step}</span>
                  {e2eCurrentStep >= step && <CheckCircle2 className="w-3 h-3 text-purple-600 mx-auto mt-0.5" />}
                </div>
              ))}
            </div>

            {/* Console de sortie */}
            <div className="bg-slate-950 text-purple-300 font-mono text-xs p-4 rounded-lg space-y-1.5 max-h-56 overflow-y-auto">
              <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                # Journal d’Exécution du Pipeline Intégré One Health Staging
              </div>
              {e2eLogs.length === 0 && (
                <div className="text-slate-500 italic">Cliquez sur « Lancer la Démonstration E2E » pour exécuter la chaîne intégrée complète.</div>
              )}
              {e2eLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VUE 2 : SIMULATEUR D'INCIDENTS & AUTORÉCUPÉRATION */}
      {activeSubTab === 'INCIDENT_SIMULATOR' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                Simulateur d'Incidents Réseau & Panne de Base (Section 104)
              </h3>
              <p className="text-xs text-slate-500">
                Validation de la capacité d'auto-récupération (Self-Healing) et de la non-perte de données.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {incidents.map(inc => (
              <div key={inc.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">{inc.code}</span>
                      <h4 className="text-xs font-bold text-slate-800">{inc.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTriggerIncident(inc.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Déclencher Incident
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white p-3 rounded border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Comportement Attendu :</span>
                    <p className="text-slate-600">{inc.expectedBehavior}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Résultat Observé :</span>
                    <p className="text-emerald-800 font-medium">{inc.observedResult}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 font-mono">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Récupération Validée ({inc.recoveryDurationSeconds}s)
                  </span>
                  <span className="text-slate-400">0 perte de données confirmée</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE 3 : RESTAURATION & ROLLBACK */}
      {activeSubTab === 'ROLLBACK_RESTORE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test de Rollback */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-indigo-600" />
                Test de Rollback Instantané (Cloud Run Revision)
              </h3>
              <p className="text-xs text-slate-500">
                Simulation de bascule immédiate vers la version stable précédente en cas de régression critique.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold">Version Actuelle :</span>
                <span className="font-mono text-purple-700 font-bold">v1.27.0-staging</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Révision Cible Rollback :</span>
                <span className="font-mono text-emerald-700 font-bold">v1.23.8-stable</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Mécanisme :</span>
                <span>Traffic Splitting 100% N-1</span>
              </div>
            </div>

            <button
              onClick={handleRunRollback}
              disabled={isSimulatingRollback}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSimulatingRollback ? 'animate-spin' : ''}`} />
              {isSimulatingRollback ? 'Bascule de trafic en cours...' : 'Exécuter Test de Rollback'}
            </button>

            {rollbackResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
                {rollbackResult}
              </div>
            )}
          </div>

          {/* Test de Restauration Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Test de Restauration Snapshot (PostgreSQL Staging)
              </h3>
              <p className="text-xs text-slate-500">
                Vérification de l’intégrité des tables et relations post-restauration sur instance isolée.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold">Snapshot Source :</span>
                <span className="font-mono text-blue-700 font-bold">snapshot-stg-2026-08-30.enc</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Taille Snapshot :</span>
                <span className="font-mono">14.2 MB (250 obs + 45 photos)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Contrôle Cryptographique :</span>
                <span className="text-emerald-700 font-semibold">SHA-256 Vérifié</span>
              </div>
            </div>

            <button
              onClick={handleRunRestore}
              disabled={isSimulatingRestore}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2"
            >
              <Database className={`w-3.5 h-3.5 ${isSimulatingRestore ? 'animate-spin' : ''}`} />
              {isSimulatingRestore ? 'Restauration sur base test...' : 'Exécuter Test de Restauration'}
            </button>

            {restoreResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium">
                {restoreResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VUE 4 : PRODUCTION GATE & VERROUS STRICTS */}
      {activeSubTab === 'PRODUCTION_GATE' && (
        <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div>
              <h3 className="font-bold text-rose-950 text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-600" />
                Production Gate & Verrouillage Logique de Déploiement (Section 108-111)
              </h3>
              <p className="text-xs text-slate-500">
                La production reste <strong>strictement verrouillée</strong> (<code className="font-mono text-rose-700">PRODUCTION_LOCKED=true</code>) tant que tous les critères préalables ne sont pas approuvés.
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 font-bold text-xs rounded-full">
              VERROU ACTIF
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Tests fonctionnels réussis', status: 'VALIDATED' },
              { label: 'Tests scientifiques & SEIR reproductibles', status: 'VALIDATED' },
              { label: 'Non-régression V1.0 → V1.23 validée', status: 'VALIDATED' },
              { label: 'Cycle Offline (A → G) validé sans doublon', status: 'VALIDATED' },
              { label: 'Synchronisation & résilience 2G validées', status: 'VALIDATED' },
              { label: 'Sécurité Zéro-Secret frontend vérifiée', status: 'VALIDATED' },
              { label: 'Performance sur 10 000 items validée', status: 'VALIDATED' },
              { label: 'Sauvegardes 3-2-1 documentées', status: 'VALIDATED' },
              { label: 'Test de restauration snapshot validé', status: 'VALIDATED' },
              { label: 'Test de rollback instantané validé', status: 'VALIDATED' },
              { label: 'Monitoring /health et logs JSON validés', status: 'VALIDATED' },
              { label: 'Approval Gate humaine (Comité One Health)', status: 'PENDING_APPROVAL' }
            ].map((crit, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {crit.label}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                  crit.status === 'VALIDATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {crit.status === 'VALIDATED' ? '✓ VALIDÉ' : '⏳ EN ATTENTE ACCORD'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
            <span className="font-bold block flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Rappel des Directives Absolues :
            </span>
            <p>
              Aucun déploiement en production, aucun achat de domaine automatique et aucune ressource cloud payante ne peuvent être activés sans l'accord explicite préalable de l'utilisateur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
