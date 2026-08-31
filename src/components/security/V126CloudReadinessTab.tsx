import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  HardDrive,
  Cpu,
  Lock,
  FileCode,
  Shield,
  Clock,
  DollarSign,
  Copy,
  Check,
  Layers,
  ArrowRight,
  RefreshCw,
  Terminal,
  Activity,
  Server
} from 'lucide-react';
import {
  CloudReadinessItemV126,
  CloudReadinessStateV126,
  EnvironmentType,
  UserRole
} from '../../types';
import {
  CLOUD_READINESS_ITEMS_V126,
  CLOUD_COSTS_TRANSPARENCY_MATRIX
} from '../../data/mockV124ToV127Data';

interface V126CloudReadinessTabProps {
  currentEnvironment: EnvironmentType;
  currentUserRole: UserRole;
}

export const V126CloudReadinessTab: React.FC<V126CloudReadinessTabProps> = ({
  currentEnvironment,
  currentUserRole
}) => {
  const [items, setItems] = useState<CloudReadinessItemV126[]>(CLOUD_READINESS_ITEMS_V126);
  const [selectedItem, setSelectedItem] = useState<CloudReadinessItemV126>(CLOUD_READINESS_ITEMS_V126[0]);
  const [activeSubTab, setActiveSubTab] = useState<'READINESS_MATRIX' | 'ENV_VARIABLES' | 'IAM_LEAST_PRIVILEGE' | 'COSTS_TRANSPARENCY'>('READINESS_MATRIX');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const readyCount = items.filter(i => i.state === 'READY').length;
  const preparedCount = items.filter(i => i.state === 'PREPARED').length;
  const notConfiguredCount = items.filter(i => i.state === 'NOT_CONFIGURED').length;

  return (
    <div className="space-y-6">
      {/* En-tête Phase V1.26 */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-indigo-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                Phase V1.26
              </span>
              <h2 className="text-xl font-bold">Préparation Cloud & Architecture Cible Google Cloud</h2>
            </div>
            <p className="text-indigo-100/80 text-sm mt-1">
              Validation des composants pour la région <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-300">africa-south1</code> (Johannesburg) sans déploiement automatique en production.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700 text-xs font-mono text-indigo-200">
              Région Cible : africa-south1
            </span>
          </div>
        </div>

        {/* Statuts stricts */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-indigo-800/60">
          <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold block">🟢 READY</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{readyCount} Composants</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold block">🟠 PREPARED</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{preparedCount} Composants</span>
            </div>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-800/50 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold block">🔴 NOT CONFIGURED</span>
              <span className="text-lg font-bold text-rose-400 font-mono">{notConfiguredCount} Composants</span>
            </div>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
        </div>

        {/* Sous-onglets */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-indigo-800/60">
          <button
            onClick={() => setActiveSubTab('READINESS_MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'READINESS_MATRIX'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60'
            }`}
          >
            📊 Matrice Readiness ({items.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ENV_VARIABLES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'ENV_VARIABLES'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60'
            }`}
          >
            ⚙️ Variables d'Environnement
          </button>
          <button
            onClick={() => setActiveSubTab('IAM_LEAST_PRIVILEGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'IAM_LEAST_PRIVILEGE'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60'
            }`}
          >
            🔐 IAM & Moindre Privilège
          </button>
          <button
            onClick={() => setActiveSubTab('COSTS_TRANSPARENCY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'COSTS_TRANSPARENCY'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60'
            }`}
          >
            💰 Transparence des Coûts Cloud
          </button>
        </div>
      </div>

      {/* VUE 1 : MATRICE READINESS (Section 115) */}
      {activeSubTab === 'READINESS_MATRIX' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des éléments */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Composants de l'Architecture Cloud Cible
            </h3>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {items.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedItem.id === item.id
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.state === 'READY' ? 'bg-emerald-100 text-emerald-800' :
                      item.state === 'PREPARED' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.state === 'READY' ? '🟢 READY' : item.state === 'PREPARED' ? '🟠 PREPARED' : '🔴 NOT CONFIGURED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-600 font-mono mt-0.5">{item.gcpService}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{item.stagingImplementation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fiche détaillée */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedItem.state === 'READY' ? 'bg-emerald-100 text-emerald-800' :
                selectedItem.state === 'PREPARED' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {selectedItem.state}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{selectedItem.name}</h3>
              <p className="text-xs font-mono text-indigo-600">{selectedItem.gcpService}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Implémentation en Staging :</span>
                <p className="text-slate-700">{selectedItem.stagingImplementation}</p>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Exigence pour la Production :</span>
                <p className="text-amber-800">{selectedItem.productionRequirement}</p>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                <span className="font-bold text-indigo-900 block mb-1">Détails Techniques :</span>
                <p className="text-indigo-800">{selectedItem.technicalDetails}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Estimation Coût Potentiel :</span>
                <p className="font-mono text-slate-800 font-bold">{selectedItem.potentialCostEstimate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VUE 2 : VARIABLES D'ENVIRONNEMENT (Section 66) */}
      {activeSubTab === 'ENV_VARIABLES' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-600" />
                Matrice des Variables d'Environnement Standardisées
              </h3>
              <p className="text-xs text-slate-500">
                Configuration exhaustive conforme à la Section 66 pour Development, Staging et Production.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 font-sans">
                <tr>
                  <th className="p-2.5">Variable</th>
                  <th className="p-2.5">Development (Local)</th>
                  <th className="p-2.5">Staging (Cloud Test)</th>
                  <th className="p-2.5">Production (HA Verrouillée)</th>
                  <th className="p-2.5">Rôle & Sécurité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'APP_ENV', dev: 'development', stg: 'staging', prd: 'production', desc: 'Délimitation stricte d’environnement' },
                  { name: 'LOG_LEVEL', dev: 'debug', stg: 'info', prd: 'warn', desc: 'Granularité de journalisation JSON' },
                  { name: 'CLOUD_TARGET', dev: 'local', stg: 'gcp-africa-south1', prd: 'gcp-africa-south1', desc: 'Cible d’infrastructure' },
                  { name: 'DATABASE_URL', dev: 'postgresql://localhost:5432/...', stg: 'cloudsql:/onehealth-pg-staging', prd: 'cloudsql:/onehealth-pg-prod-ha', desc: 'Connexion PostgreSQL chiffrée' },
                  { name: 'DB_POOL_MAX', dev: '10', stg: '25', prd: '100', desc: 'Taille du pool de connexions' },
                  { name: 'DB_TIMEOUT_MS', dev: '5000', stg: '10000', prd: '8000', desc: 'Timeout limite requête SQL' },
                  { name: 'STORAGE_PROVIDER', dev: 'local', stg: 'google_cloud_storage', prd: 'google_cloud_storage', desc: 'Adaptateur de stockage abstrait' },
                  { name: 'STORAGE_BUCKET', dev: 'local-storage', stg: 'onehealth-maniema-media-staging', prd: 'onehealth-maniema-media-prod', desc: 'Bucket GCS isolé' },
                  { name: 'STORAGE_REGION', dev: 'local', stg: 'africa-south1', prd: 'africa-south1', desc: 'Localisation géographique' },
                  { name: 'SYNC_RETRY', dev: '3', stg: '5', prd: '5', desc: 'Nombre maximal de tentatives' },
                  { name: 'SYNC_BACKOFF', dev: 'exponential', stg: 'exponential', prd: 'exponential', desc: 'Stratégie de backoff (1s, 2s, 4s...)' },
                  { name: 'SYNC_TIMEOUT', dev: '15000', stg: '20000', prd: '30000', desc: 'Délai d’expiration de synchro' },
                  { name: 'CORS_ALLOW', dev: 'http://localhost:3000', stg: 'https://staging-onehealth.run.app', prd: 'https://app.onehealthmaniema.cd', desc: 'Origines autorisées' },
                  { name: 'RATE_LIMIT_MAX', dev: '1000', stg: '300', prd: '500', desc: 'Plafond requêtes/min par IP' }
                ].map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{v.name}</td>
                    <td className="p-2.5 text-emerald-700 bg-emerald-50/40">{v.dev}</td>
                    <td className="p-2.5 text-blue-700 bg-blue-50/40">{v.stg}</td>
                    <td className="p-2.5 text-purple-700 bg-purple-50/40">{v.prd}</td>
                    <td className="p-2.5 font-sans text-slate-600 text-[11px]">{v.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VUE 3 : IAM & MOINDRE PRIVILÈGE */}
      {activeSubTab === 'IAM_LEAST_PRIVILEGE' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Matrice des Rôles IAM au Moindre Privilège (Least Privilege)
              </h3>
              <p className="text-xs text-slate-500">
                Attribution stricte des permissions requises pour les comptes de service Cloud Run.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                role: 'roles/cloudsql.client',
                target: 'Instance Cloud SQL Staging uniquement',
                purpose: 'Permet au conteneur Cloud Run d’établir une liaison via Cloud SQL Auth Proxy sans exposer de port public.'
              },
              {
                role: 'roles/storage.objectAdmin',
                target: 'Bucket onehealth-maniema-media-staging',
                purpose: 'Lecture/Écriture restreinte au bucket de médias de staging. Accès strictement interdit aux buckets d’autres projets.'
              },
              {
                role: 'roles/secretmanager.secretAccessor',
                target: 'Secrets ONEHEALTH_STAGING_*',
                purpose: 'Lecture en mémoire des clés de chiffrement et jetons API au démarrage du conteneur sans persistance disque.'
              },
              {
                role: 'roles/logging.logWriter',
                target: 'Google Cloud Logging',
                purpose: 'Transmission des entrées de journalisation JSON structurées pour audit de sécurité.'
              }
            ].map((iam, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {iam.role}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 font-mono">{iam.target}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1">{iam.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VUE 4 : TRANSPARENCE DES COÛTS CLOUD */}
      {activeSubTab === 'COSTS_TRANSPARENCY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Transparence & Optimisation des Coûts Cloud (Sections 119, 120, 123)
              </h3>
              <p className="text-xs text-slate-500">
                Estimation transparente des coûts prévisionnels pour éviter tout dépassement ou mauvaise surprise.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Ressource Cloud</th>
                  <th className="p-3">Raison d’Usage</th>
                  <th className="p-3">Coût Prévisionnel Staging</th>
                  <th className="p-3">Coût Prévisionnel Production</th>
                  <th className="p-3">Conseil d’Optimisation Budgétaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CLOUD_COSTS_TRANSPARENCY_MATRIX.map((cost, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{cost.resourceName}</td>
                    <td className="p-3 text-slate-600">{cost.reason}</td>
                    <td className="p-3 font-mono font-bold text-blue-700 bg-blue-50/40">{cost.costInStaging}</td>
                    <td className="p-3 font-mono font-bold text-purple-700 bg-purple-50/40">{cost.costInProduction}</td>
                    <td className="p-3 text-emerald-800 text-[11px] bg-emerald-50/30">{cost.costOptimizationTip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
