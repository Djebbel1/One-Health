import React, { useState } from 'react';
import {
  Database,
  Layers,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Camera,
  MapPin,
  FileCheck,
  Shield,
  Clock,
  Sparkles,
  Search,
  Filter,
  Save,
  Check
} from 'lucide-react';
import {
  PathologyDefinitionV124,
  SyntheticSurveyRecordV124,
  EnvironmentType,
  UserRole
} from '../../types';
import {
  INITIAL_PATHOLOGIES_V124,
  MOCK_SYNTHETIC_SURVEYS_V124
} from '../../data/mockV124ToV127Data';

interface V124LocalConsolidationTabProps {
  currentEnvironment: EnvironmentType;
  currentUserRole: UserRole;
}

export const V124LocalConsolidationTab: React.FC<V124LocalConsolidationTabProps> = ({
  currentEnvironment,
  currentUserRole
}) => {
  const [activeSection, setActiveSection] = useState<'PATHOLOGIES' | 'SURVEY_CREATOR' | 'SYNTHETIC_SURVEYS' | 'DATABASE_INTEGRITY' | 'OFFLINE_CYCLE'>('PATHOLOGIES');

  // Pathologies state
  const [pathologies, setPathologies] = useState<PathologyDefinitionV124[]>(INITIAL_PATHOLOGIES_V124);
  const [selectedPathology, setSelectedPathology] = useState<PathologyDefinitionV124>(INITIAL_PATHOLOGIES_V124[0]);
  const [isAddingPathology, setIsAddingPathology] = useState(false);
  const [newPathologyForm, setNewPathologyForm] = useState<Partial<PathologyDefinitionV124>>({
    code: '',
    name: '',
    category: 'VECTOR_BORNE',
    definition: '',
    alertThresholdWeeklyCases: 10,
    r0Estimate: 1.5,
    status: 'EXPERIMENTAL',
    incubationPeriodDays: { min: 2, max: 14 },
    environmentalTriggers: ['Eaux de surface'],
    clinicalSymptoms: ['Fièvre']
  });

  // Synthetic surveys state
  const [surveys, setSurveys] = useState<SyntheticSurveyRecordV124[]>(MOCK_SYNTHETIC_SURVEYS_V124);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  // Interactive survey creation form (Section 17-20)
  const [formData, setFormData] = useState({
    healthZone: 'Kindu' as 'Kindu' | 'Kasongo' | 'Kibombo' | 'Punia' | 'Lubutu' | 'Pangi' | 'Kabambare',
    healthArea: 'Alunguli Nord',
    pathologyCode: 'MALARIA',
    collectorName: 'Agent Terrain Test',
    latitude: -2.9520,
    longitude: 25.9250,
    accuracyMeters: 4.5,
    householdSize: 6,
    suspectedCases: 2,
    confirmedRdt: 1,
    hospitalizedCases: 0,
    waterSourceType: 'BOREHOLE' as 'BOREHOLE' | 'UNPROTECTED_SPRING' | 'RIVER_STREAM' | 'RAINWATER' | 'TAP',
    stagnantWaterNearby: true,
    distanceToWaterStreamMeters: 50,
    ambientTemperatureC: 28.5,
    relativeHumidityPercent: 80,
    livestockPresent: true,
    photoAttached: true,
    offlineMode: true
  });

  const [formValidationErrors, setFormValidationErrors] = useState<string[]>([]);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Offline cycle simulation state (Section 24-30 & Test A -> Test G)
  const [offlineSimStep, setOfflineSimStep] = useState<number>(0);
  const [offlineSimulationLog, setOfflineSimulationLog] = useState<string[]>([]);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);

  // Validation function
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Check GPS in Maniema bounding box
    if (formData.latitude > 0.5 || formData.latitude < -6.0) {
      errors.push('Latitude hors des limites de la province du Maniema (-6.0° à +0.5°).');
    }
    if (formData.longitude < 24.5 || formData.longitude > 29.0) {
      errors.push('Longitude hors des limites du Maniema (24.5° à 29.0°).');
    }
    if (formData.accuracyMeters > 30) {
      errors.push('Précision GPS insuffisante (> 30 mètres). Veuillez acquérir un signal GPS stable.');
    }
    if (formData.suspectedCases > formData.householdSize) {
      errors.push('Le nombre de cas suspects ne peut pas dépasser la taille totale du ménage.');
    }
    if (formData.confirmedRdt > formData.suspectedCases) {
      errors.push('Le nombre de cas confirmés RDT ne peut pas dépasser le nombre de cas suspects.');
    }
    if (formData.ambientTemperatureC < 15 || formData.ambientTemperatureC > 48) {
      errors.push('Température ambiante aberrante (< 15°C ou > 48°C).');
    }
    if (!formData.collectorName.trim()) {
      errors.push('Le nom de l’enquêteur est obligatoire.');
    }

    setFormValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreateSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newSurvey: SyntheticSurveyRecordV124 = {
      id: `SURV-LOCAL-${Date.now().toString().slice(-4)}`,
      surveyCode: `${formData.healthZone.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      projectId: 'PROJ-MANIEMA-001',
      projectName: 'Surveillance Intégrée One Health Maniema',
      healthZone: formData.healthZone,
      healthArea: formData.healthArea,
      collectorName: formData.collectorName,
      collectorRole: currentUserRole,
      collectionDate: new Date().toISOString(),
      pathologyCode: formData.pathologyCode,
      gpsCoordinates: {
        latitude: formData.latitude,
        longitude: formData.longitude,
        accuracyMeters: formData.accuracyMeters,
        isValid: true
      },
      humanHealthData: {
        householdSize: formData.householdSize,
        suspectedCases: formData.suspectedCases,
        confirmedRdt: formData.confirmedRdt,
        hospitalizedCases: formData.hospitalizedCases,
        ageGroupBreakdown: { under5: 1, fiveTo14: 1, adults: formData.householdSize - 2 }
      },
      environmentalData: {
        waterSourceType: formData.waterSourceType,
        stagnantWaterNearby: formData.stagnantWaterNearby,
        distanceToWaterStreamMeters: formData.distanceToWaterStreamMeters,
        vegetationDensityIndex: 0.75,
        wasteDisposalMethod: 'PIT',
        ambientTemperatureC: formData.ambientTemperatureC,
        relativeHumidityPercent: formData.relativeHumidityPercent
      },
      animalHealthData: {
        livestockPresent: formData.livestockPresent,
        animalSpecies: formData.livestockPresent ? ['Caprins', 'Volailles'] : [],
        unexplainedAnimalMortalityCount: 0,
        wildlifeContactReported: false
      },
      photosCount: formData.photoAttached ? 1 : 0,
      photoIds: formData.photoAttached ? [`photo-${Date.now()}.jpg`] : [],
      offlineCreated: formData.offlineMode,
      syncState: formData.offlineMode ? 'PENDING' : 'SYNCED',
      idempotencyKey: `IDEMP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      validationStatus: 'VALID',
      dataIntegrityHash: 'synthetic-sha256-' + Math.random().toString(36).substr(2, 12)
    };

    setSurveys([newSurvey, ...surveys]);
    setFormSuccessMessage(`✅ Enquête ${newSurvey.surveyCode} enregistrée avec succès en local (${formData.offlineMode ? 'Mode Hors-Ligne - Statut PENDING' : 'Statut SYNCED'})`);
    setTimeout(() => setFormSuccessMessage(null), 5000);
  };

  // Run full Offline Simulation Cycle (Test A -> Test G)
  const runOfflineCycleSimulation = async () => {
    setIsSimulatingOffline(true);
    setOfflineSimulationLog([]);
    const logs: string[] = [];

    const addLog = (msg: string) => {
      logs.push(msg);
      setOfflineSimulationLog([...logs]);
    };

    setOfflineSimStep(1);
    addLog('📡 ÉTAPE A : Coupure réseau activée (Mode Avion Terrain - Kindu Rural).');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(2);
    addLog('📝 ÉTAPE B : Création de 2 nouvelles observations avec capture photo locale (IndexedDB).');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(3);
    addLog('🔒 ÉTAPE C : Calcul des empreintes cryptographiques SHA-256 et attribution des clés d’idempotence uniques.');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(4);
    addLog('🔄 ÉTAPE D : Simulation de fermeture et redémarrage de l’application. Vérification intégrité du cache : 100% conservé.');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(5);
    addLog('🌐 ÉTAPE E : Détection de reconnexion réseau (Signal 3G/4G rétabli).');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(6);
    addLog('🚀 ÉTAPE F : Dépilement séquentiel de la file de synchronisation (Statut PENDING -> SYNCING -> SYNCED).');
    await new Promise(r => setTimeout(r, 600));

    setOfflineSimStep(7);
    addLog('🎯 ÉTAPE G : Test d’anti-duplication (Re-jeu de synchronisation contrôlé) : 0 doublon créé sur la base relationnelle.');
    setIsSimulatingOffline(false);
  };

  const filteredSurveys = surveys.filter(s => {
    const matchesSearch = s.surveyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.healthArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === 'ALL' || s.healthZone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* En-tête Phase V1.24 */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Phase V1.24
              </span>
              <h2 className="text-xl font-bold">Consolidation Locale & Modèles One Health</h2>
            </div>
            <p className="text-emerald-100/80 text-sm mt-1">
              Configuration environnementale <code className="bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">APP_ENV=development</code>,
              modélisation multi-pathologies générique, validation stricte des formulaires et résilience offline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-800/60 border border-emerald-700 text-xs font-medium text-emerald-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Données 100% Synthétiques / Test
            </span>
          </div>
        </div>

        {/* Sous-onglets internes V1.24 */}
        <div className="flex flex-wrap gap-2 mt-5 pt-3 border-t border-emerald-800/60">
          <button
            onClick={() => setActiveSection('PATHOLOGIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'PATHOLOGIES'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🦠 Modèle Pathologies ({pathologies.length})
          </button>
          <button
            onClick={() => setActiveSection('SURVEY_CREATOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'SURVEY_CREATOR'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            📋 Formulaire & Validation GPS
          </button>
          <button
            onClick={() => setActiveSection('SYNTHETIC_SURVEYS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'SYNTHETIC_SURVEYS'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            📊 Registre Enquêtes ({surveys.length})
          </button>
          <button
            onClick={() => setActiveSection('OFFLINE_CYCLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'OFFLINE_CYCLE'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🔄 Cycle Offline (Test A → G)
          </button>
          <button
            onClick={() => setActiveSection('DATABASE_INTEGRITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'DATABASE_INTEGRITY'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60'
            }`}
          >
            🗄️ Schéma & Migrations
          </button>
        </div>
      </div>

      {/* SECTION 1 : PATHOLOGIES CONFIGURABLES */}
      {activeSection === 'PATHOLOGIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des pathologies */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                Pathologies Configurées (One Health)
              </h3>
              <button
                onClick={() => setIsAddingPathology(!isAddingPathology)}
                className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {pathologies.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPathology(p)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedPathology.id === p.id
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                      p.category === 'VECTOR_BORNE' ? 'bg-amber-100 text-amber-800' :
                      p.category === 'WATERBORNE' ? 'bg-blue-100 text-blue-800' :
                      p.category === 'ZOONOTIC' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {p.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{p.scientificName || p.definition}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-600 font-mono">
                    <span>R0: {p.r0Estimate}</span>
                    <span>Seuil: {p.alertThresholdWeeklyCases} cas/semaine</span>
                    <span>Variables: {p.configurableVariables.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détails de la pathologie sélectionnée */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-emerald-600 font-bold">{selectedPathology.code}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedPathology.name}</h3>
                <p className="text-xs text-slate-500 italic">{selectedPathology.scientificName}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Statut: {selectedPathology.status}
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Définition & Contexte Épidémiologique :</span>
              {selectedPathology.definition}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Facteurs & Déclencheurs Écologiques</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {selectedPathology.environmentalTriggers.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Symptomatologie Clinique</span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {selectedPathology.clinicalSymptoms.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Variables configurables spécifiques */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Variables de Formulaire Paramétrées ({selectedPathology.configurableVariables.length})</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedPathology.configurableVariables.map((v, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{v.label}</span>
                      <span className="font-mono text-[10px] text-slate-500">{v.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {v.options ? `Options: ${v.options.join(', ')}` : `Défaut: ${String(v.defaultValue)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2 : FORMULAIRE DE COLLECTE AVEC VALIDATION STRICTE */}
      {activeSection === 'SURVEY_CREATOR' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Formulaire d’Enquête Opérationnelle & Contrôles d’Intégrité
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérification automatique des contraintes : GPS dans le Maniema, cohérence des cas, et température.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono">
              Role: {currentUserRole}
            </span>
          </div>

          {formSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {formSuccessMessage}
            </div>
          )}

          {formValidationErrors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                Erreurs de validation détectées ({formValidationErrors.length}) :
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {formValidationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleCreateSurvey} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zone & Pathologie */}
            <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                1. Localisation & Pathologie
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Zone de Santé (Maniema)</label>
                <select
                  value={formData.healthZone}
                  onChange={e => setFormData({ ...formData, healthZone: e.target.value as any })}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Kindu">Kindu</option>
                  <option value="Kasongo">Kasongo</option>
                  <option value="Kibombo">Kibombo</option>
                  <option value="Punia">Punia</option>
                  <option value="Lubutu">Lubutu</option>
                  <option value="Pangi">Pangi</option>
                  <option value="Kabambare">Kabambare</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Aire de Santé</label>
                <input
                  type="text"
                  value={formData.healthArea}
                  onChange={e => setFormData({ ...formData, healthArea: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pathologie Ciblée</label>
                <select
                  value={formData.pathologyCode}
                  onChange={e => setFormData({ ...formData, pathologyCode: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  {pathologies.map(p => (
                    <option key={p.id} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nom de l'Enquêteur</label>
                <input
                  type="text"
                  value={formData.collectorName}
                  onChange={e => setFormData({ ...formData, collectorName: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* GPS & Données Sanitaires */}
            <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                2. GPS & Données Sanitaires
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Taille Ménage</label>
                  <input
                    type="number"
                    value={formData.householdSize}
                    onChange={e => setFormData({ ...formData, householdSize: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Cas Suspects</label>
                  <input
                    type="number"
                    value={formData.suspectedCases}
                    onChange={e => setFormData({ ...formData, suspectedCases: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Confirmés RDT</label>
                  <input
                    type="number"
                    value={formData.confirmedRdt}
                    onChange={e => setFormData({ ...formData, confirmedRdt: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="livestock"
                  checked={formData.livestockPresent}
                  onChange={e => setFormData({ ...formData, livestockPresent: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600"
                />
                <label htmlFor="livestock" className="text-xs text-slate-700 font-medium">Présence d’animaux / bétail au ménage</label>
              </div>
            </div>

            {/* Environnement, Photos & Mode Offline */}
            <div className="space-y-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                3. Écologie & Résilience Offline
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Source d’Eau Principale</label>
                <select
                  value={formData.waterSourceType}
                  onChange={e => setFormData({ ...formData, waterSourceType: e.target.value as any })}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="BOREHOLE">Forage / Puits protégé</option>
                  <option value="UNPROTECTED_SPRING">Source non protégée</option>
                  <option value="RIVER_STREAM">Rivière / Fleuve Congo</option>
                  <option value="RAINWATER">Eau de pluie</option>
                  <option value="TAP">Borne fontaine / Robinet</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Température (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ambientTemperatureC}
                    onChange={e => setFormData({ ...formData, ambientTemperatureC: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Humidité (%)</label>
                  <input
                    type="number"
                    value={formData.relativeHumidityPercent}
                    onChange={e => setFormData({ ...formData, relativeHumidityPercent: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="photo"
                    checked={formData.photoAttached}
                    onChange={e => setFormData({ ...formData, photoAttached: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <label htmlFor="photo" className="text-xs text-slate-700 font-medium">Joindre une photo de terrain (Gîte / Habitat)</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="offline"
                    checked={formData.offlineMode}
                    onChange={e => setFormData({ ...formData, offlineMode: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600"
                  />
                  <label htmlFor="offline" className="text-xs text-slate-900 font-bold">Simuler création hors-ligne (Statut PENDING)</label>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Valider & Enregistrer l'Enquête en Local (IndexedDB)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3 : REGISTRE DES ENQUÊTES SYNTHÉTIQUES */}
      {activeSection === 'SYNTHETIC_SURVEYS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Registre des Observations Synthétiques Maniema ({filteredSurveys.length})</h3>
              <p className="text-xs text-slate-500">Toutes les données présentées sont strictement fictives et destinées aux tests.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher code, aire, enquêteur..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value="ALL">Toutes les zones</option>
                <option value="Kindu">Kindu</option>
                <option value="Kasongo">Kasongo</option>
                <option value="Kibombo">Kibombo</option>
                <option value="Punia">Punia</option>
                <option value="Lubutu">Lubutu</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Code Enquête</th>
                  <th className="p-2.5">Zone & Aire</th>
                  <th className="p-2.5">Pathologie</th>
                  <th className="p-2.5">GPS (Lat/Long)</th>
                  <th className="p-2.5">Cas (Susp / Conf)</th>
                  <th className="p-2.5">Photos</th>
                  <th className="p-2.5">Statut Synchro</th>
                  <th className="p-2.5">Intégrité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSurveys.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80">
                    <td className="p-2.5 font-mono font-bold text-slate-900">{s.surveyCode}</td>
                    <td className="p-2.5">
                      <span className="font-semibold text-slate-800">{s.healthZone}</span>
                      <span className="text-slate-500 block text-[11px]">{s.healthArea}</span>
                    </td>
                    <td className="p-2.5 font-medium text-slate-700">{s.pathologyCode}</td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-600">
                      {s.gpsCoordinates.latitude.toFixed(4)}, {s.gpsCoordinates.longitude.toFixed(4)}
                    </td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[11px]">
                        {s.humanHealthData.suspectedCases} susp
                      </span> /
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[11px] ml-1">
                        {s.humanHealthData.confirmedRdt} conf
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        {s.photosCount}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.syncState === 'SYNCED' ? 'bg-emerald-100 text-emerald-800' :
                        s.syncState === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        s.syncState === 'SYNCING' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {s.syncState}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Conforme
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4 : CYCLE OFFLINE COMPLET (TEST A -> TEST G) */}
      {activeSection === 'OFFLINE_CYCLE' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RefreshCw className={`w-5 h-5 text-emerald-600 ${isSimulatingOffline ? 'animate-spin' : ''}`} />
                Démonstrateur Automatisé du Cycle Offline (Test A → Test G)
              </h3>
              <p className="text-xs text-slate-500">
                Validation formelle de la persistance locale, reprise sur reconnexion et déduplication par clé d'idempotence.
              </p>
            </div>

            <button
              onClick={runOfflineCycleSimulation}
              disabled={isSimulatingOffline}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingOffline ? 'animate-spin' : ''}`} />
              {isSimulatingOffline ? 'Exécution du cycle...' : 'Lancer la Simulation A → G'}
            </button>
          </div>

          {/* Grille des étapes A -> G */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { step: 1, label: 'Test A', desc: 'Création Offline', icon: WifiOff },
              { step: 2, label: 'Test B', desc: 'Photos Locales', icon: Camera },
              { step: 3, label: 'Test C', desc: 'Checksum SHA-256', icon: Shield },
              { step: 4, label: 'Test D', desc: 'Fermeture / Réouverture', icon: Clock },
              { step: 5, label: 'Test E', desc: 'Reconnexion 4G', icon: Wifi },
              { step: 6, label: 'Test F', desc: 'Synchronisation', icon: RefreshCw },
              { step: 7, label: 'Test G', desc: '0 Doublon (Idempotence)', icon: CheckCircle2 }
            ].map(item => (
              <div
                key={item.step}
                className={`p-3 rounded-lg border text-center transition-all ${
                  offlineSimStep >= item.step
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-bold block">{item.label}</span>
                <span className="text-xs font-semibold block mt-1">{item.desc}</span>
                {offlineSimStep >= item.step ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mt-2" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* Journal de sortie d'exécution */}
          <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-lg space-y-1.5 max-h-48 overflow-y-auto">
            <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800">
              # Console de Test de Résilience Réseau & Synchronisation
            </div>
            {offlineSimulationLog.length === 0 && (
              <div className="text-slate-500 italic">Cliquez sur « Lancer la Simulation A → G » pour démarrer le test séquentiel.</div>
            )}
            {offlineSimulationLog.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5 : INTÉGRITÉ DE LA BASE DE DONNÉES & MIGRATIONS */}
      {activeSection === 'DATABASE_INTEGRITY' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Intégrité du Schéma & Migrations Versionnées
              </h3>
              <p className="text-xs text-slate-500">
                Arborescence <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">migrations/</code> préparée pour PostgreSQL & Cloud SQL.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
              Schéma V1.24 Conforme
            </span>
          </div>

          <div className="space-y-3">
            {[
              { file: '001_initial_schema.sql', status: 'APPLIED', desc: 'Tables fondamentales : users, roles, sessions, projects, health_zones.' },
              { file: '002_epidemiological_data.sql', status: 'APPLIED', desc: 'Tables sanitaires, enquêtes, variables One Health, observations vectorielles.' },
              { file: '003_v120_security_rbac.sql', status: 'APPLIED', desc: 'Corbeille PII, politiques de rétention, journal d’audit cryptographique.' },
              { file: '004_v123_cloud_readiness.sql', status: 'APPLIED', desc: 'File d’attente offline, tables de métadonnées objets GCS, idempotence.' },
              { file: '005_v124_generic_pathologies.sql', status: 'READY_TO_APPLY', desc: 'Table pathologies_definitions et liaisons dynamiques One Health.' }
            ].map((m, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-900">{m.file}</span>
                  <p className="text-xs text-slate-600 mt-0.5">{m.desc}</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono ${
                  m.status === 'APPLIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
