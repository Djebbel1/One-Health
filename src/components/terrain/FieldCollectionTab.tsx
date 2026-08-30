import React, { useState, useEffect } from 'react';
import {
  FieldFormRecord,
  FieldEnumerator,
  FieldAssignment,
  FieldFormDataPayload,
  FieldFormGPS
} from '../../types';
import {
  Smartphone,
  MapPin,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';

interface FieldCollectionTabProps {
  currentEnumerator: FieldEnumerator;
  assignments: FieldAssignment[];
  forms: FieldFormRecord[];
  isOfflineMode: boolean;
  onSaveFormLocal: (form: FieldFormRecord) => void;
}

export const FieldCollectionTab: React.FC<FieldCollectionTabProps> = ({
  currentEnumerator,
  assignments,
  forms,
  isOfflineMode,
  onSaveFormLocal
}) => {
  // Select active assignment
  const myAssignments = assignments.filter((a) => a.enumeratorId === currentEnumerator.id);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    myAssignments[0]?.id || 'AFF-2027-001'
  );

  // Resume draft state
  const myDrafts = forms.filter(
    (f) => f.enumeratorId === currentEnumerator.id && f.status === 'BROUILLON'
  );

  // Form State
  const [localId, setLocalId] = useState<string>(`LOCAL-2027-${Date.now().toString().slice(-6)}`);
  const [householdCode, setHouseholdCode] = useState('MEN-KND-NEW');
  const [streetName, setStreetName] = useState('Av. des Martyrs, Parcelle 09');
  const [startTime, setStartTime] = useState(new Date().toLocaleTimeString().slice(0, 5));
  
  // GPS State
  const [gps, setGps] = useState<FieldFormGPS>({
    latitude: -2.9515,
    longitude: 25.9520,
    accuracy: 4.8,
    capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    source: 'DEVICE_HARDWARE',
    isWithinAssignedZone: true,
    distanceFromZoneCenterMeters: 35
  });
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  // Form payload
  const [formData, setFormData] = useState<FieldFormDataPayload>({
    respondentConsent: true,
    respondentAge: 35,
    respondentMaritalStatus: 'MARIE',
    headGender: 'M',
    householdSize: 6,
    childrenUnder5: 2,
    children5To14: 2,
    adults15Plus: 2,
    hadMalariaLast30Days: true,
    casesCountMalaria: 1,
    mosquitoNetAvailable: true,
    mosquitoNetImpregnated: true,
    stagnantWaterNearHouse: true,
    hadTyphoidLast30Days: false,
    casesCountTyphoid: 0,
    waterSource: 'Borne fontaine REGIDESO',
    waterTreatmentMethod: 'CHLORE_AQUATABS',
    waterStorageType: 'BIDON_FERME',
    latrineType: 'FOSSE_SIMPLE_DALLE',
    solidWasteDisposal: 'FOSSE_PARCELLE',
    distanceToWasteMeters: 12,
    notes: ''
  });

  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Auto-save debounced effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLastAutoSaveTime(new Date().toLocaleTimeString());
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData, householdCode, streetName]);

  // Handle GPS Capture simulation
  const handleCaptureGPS = () => {
    setIsCapturingGPS(true);
    setTimeout(() => {
      const simulatedLat = -2.9515 + (Math.random() - 0.5) * 0.005;
      const simulatedLng = 25.9520 + (Math.random() - 0.5) * 0.005;
      const simulatedAcc = Number((3 + Math.random() * 4).toFixed(1));

      setGps({
        latitude: Number(simulatedLat.toFixed(5)),
        longitude: Number(simulatedLng.toFixed(5)),
        accuracy: simulatedAcc,
        capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        source: isOfflineMode ? 'OFFLINE_CACHE' : 'DEVICE_HARDWARE',
        isWithinAssignedZone: true,
        distanceFromZoneCenterMeters: Math.round(Math.random() * 80)
      });
      setIsCapturingGPS(false);
    }, 800);
  };

  // Resume a draft
  const handleResumeDraft = (draft: FieldFormRecord) => {
    setLocalId(draft.localId);
    setHouseholdCode(draft.householdCode || '');
    setStreetName(draft.streetName || '');
    setGps(draft.gps);
    setFormData(draft.formData);
    setSelectedAssignmentId(draft.assignmentId);
    setSaveSuccessMsg(`Brouillon ${draft.localId} chargé pour reprise.`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Validate form consistency
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.respondentConsent) {
      errors.push('Le consentement éclairé du répondant est obligatoire.');
    }
    if ((formData.respondentAge || 0) < 15 && formData.respondentMaritalStatus === 'MARIE') {
      errors.push('Incohérence : Âge répondant < 15 ans incompatible avec statut marié.');
    }
    if (formData.childrenUnder5 + formData.children5To14 + formData.adults15Plus > formData.householdSize) {
      errors.push('Incohérence : La somme des tranches d âge dépasse la taille totale du ménage.');
    }
    if (formData.hadMalariaLast30Days && formData.casesCountMalaria <= 0) {
      errors.push('Veuillez indiquer au moins 1 cas de paludisme si la pathologie a été déclarée.');
    }
    if (formData.hadTyphoidLast30Days && formData.casesCountTyphoid <= 0) {
      errors.push('Veuillez indiquer au moins 1 cas de fièvre typhoïde si la pathologie a été déclarée.');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = (asDraft: boolean) => {
    const isValid = validateForm();
    if (!asDraft && !isValid) {
      return;
    }

    const currentAss = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

    const newRecord: FieldFormRecord = {
      localId,
      campaignId: currentAss?.campaignId || 'CAMP-2027-01',
      campaignName: currentAss?.campaignName || 'Campagne One Health 2027',
      formType: 'MENAGE_ONE_HEALTH',
      pathology: 'MULTI_PATHOLOGIE',
      enumeratorId: currentEnumerator.id,
      enumeratorName: currentEnumerator.displayName,
      teamId: currentEnumerator.teamId,
      assignmentId: selectedAssignmentId,
      status: asDraft ? 'BROUILLON' : 'EN_ATTENTE_SYNCHRONISATION',
      syncStatus: 'PENDING',
      syncAttempts: 0,
      createdAtDevice: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastModifiedDevice: new Date().toISOString().replace('T', ' ').slice(0, 16),
      completedAtDevice: asDraft ? undefined : new Date().toISOString().replace('T', ' ').slice(0, 16),
      durationMinutes: 18,
      startTime,
      endTime: new Date().toLocaleTimeString().slice(0, 5),
      territory: currentAss?.territory || 'Kindu',
      healthZone: currentAss?.healthZone || 'Kindu',
      healthArea: currentAss?.healthArea || 'Kasuku',
      neighborhood: currentAss?.neighborhood || 'Kasuku Ouest',
      streetName,
      householdCode,
      gps,
      formData,
      qualityChecks: {
        completenessScore: asDraft ? 60 : 100,
        hasInconsistencies: validationErrors.length > 0,
        inconsistencyList: validationErrors,
        durationSuspicion: false,
        isFlaggedForAudit: false
      },
      isDemoData: true
    };

    onSaveFormLocal(newRecord);
    setSaveSuccessMsg(
      asDraft
        ? `Brouillon ${localId} sauvegardé localement sur ce terminal.`
        : `Questionnaire ${localId} finalisé et mis en file d attente de synchronisation !`
    );

    if (!asDraft) {
      // Reset for next questionnaire
      setLocalId(`LOCAL-2027-${Date.now().toString().slice(-6)}`);
      setHouseholdCode(`MEN-KND-${Math.floor(100 + Math.random() * 900)}`);
      setStartTime(new Date().toLocaleTimeString().slice(0, 5));
    }

    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête Terminal de Collecte */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Terminal Terrain
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs font-mono font-bold text-slate-600">
              Agent : {currentEnumerator.displayName} ({currentEnumerator.id})
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Formulaire d Enquête Ménage One Health (Hors-Ligne)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Saisie locale persistance avec double identifiant, capture GPS et vérification de cohérence temps réel.
          </p>
        </div>

        {/* Statut Réseau & Auto-save */}
        <div className="flex items-center space-x-3 text-xs">
          {isOfflineMode ? (
            <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold flex items-center space-x-1.5">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span>Mode Hors Connexion Actif</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center space-x-1.5">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span>Connecté (Prêt pour Synchro)</span>
            </div>
          )}

          {lastAutoSaveTime && (
            <span className="text-[11px] text-slate-400 font-mono">
              💾 Sauvegarde auto : {lastAutoSaveTime}
            </span>
          )}
        </div>
      </div>

      {/* Reprise de Brouillons Existants */}
      {myDrafts.length > 0 && (
        <div className="bg-teal-50/70 border border-teal-200 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center">
              {myDrafts.length}
            </span>
            <div>
              <strong className="text-teal-900 block font-bold">
                Brouillons non finalisés disponibles sur ce terminal :
              </strong>
              <span className="text-teal-700 text-[11px]">
                Vous pouvez reprendre immédiatement une enquête interrompue sans perte de données.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            {myDrafts.map((d) => (
              <button
                key={d.localId}
                type="button"
                onClick={() => handleResumeDraft(d)}
                className="px-3 py-1.5 bg-white hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold rounded-xl transition flex items-center space-x-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3 text-teal-700" />
                <span>{d.localId} ({d.householdCode || 'Sans code'})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message de Succès */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Formulaire Principal de Collecte */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
        
        {/* Section 1 : Identification & Géolocalisation */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
              1
            </span>
            <span>Localisation, Affectation &amp; Horodatage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">ID Local Temporaire</label>
              <input
                type="text"
                disabled
                value={localId}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-teal-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Secteur / Affectation</label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                {myAssignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.healthArea} • {a.neighborhood} ({a.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Code Ménage *</label>
              <input
                type="text"
                value={householdCode}
                onChange={(e) => setHouseholdCode(e.target.value)}
                placeholder="Ex : MEN-KND-012"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Avenue / Rue / Parcelle</label>
              <input
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            {/* Boîte GPS */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5 text-[11px] text-slate-600">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>GPS : {gps.latitude}, {gps.longitude}</span>
                </div>
                <p>Précision : ±{gps.accuracy}m • Source : {gps.source}</p>
              </div>

              <button
                type="button"
                onClick={handleCaptureGPS}
                disabled={isCapturingGPS}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1 shadow-xs"
              >
                {isCapturingGPS ? (
                  <span>Capture...</span>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Actualiser GPS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2 : Démographie du Ménage */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
              2
            </span>
            <span>Démographie &amp; Composition du Ménage</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Âge Répondant</label>
              <input
                type="number"
                value={formData.respondentAge}
                onChange={(e) => setFormData({ ...formData, respondentAge: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Sexe Chef Ménage</label>
              <select
                value={formData.headGender}
                onChange={(e) => setFormData({ ...formData, headGender: e.target.value as 'M' | 'F' })}
                className="w-full p-2 border rounded-xl font-bold"
              >
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Taille Totale Ménage</label>
              <input
                type="number"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Enfants &lt; 5 ans</label>
              <input
                type="number"
                value={formData.childrenUnder5}
                onChange={(e) => setFormData({ ...formData, childrenUnder5: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Paludisme & Moustiquaires */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
              3
            </span>
            <span>Paludisme &amp; Facteurs Vectoriels (30 derniers jours)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hadMalariaLast30Days}
                onChange={(e) => setFormData({ ...formData, hadMalariaLast30Days: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="font-bold text-slate-800">Cas de paludisme dans le ménage ?</span>
            </label>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nombre de cas déclarés</label>
              <input
                type="number"
                disabled={!formData.hadMalariaLast30Days}
                value={formData.casesCountMalaria}
                onChange={(e) => setFormData({ ...formData, casesCountMalaria: Number(e.target.value) })}
                className="w-full p-2 border rounded-xl font-bold"
              />
            </div>

            <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.mosquitoNetImpregnated}
                onChange={(e) => setFormData({ ...formData, mosquitoNetImpregnated: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="font-bold text-slate-800">Moustiquaire imprégnée présente ?</span>
            </label>
          </div>
        </div>

        {/* Section 4 : Fièvre Typhoïde & WASH */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs">
              4
            </span>
            <span>Fièvre Typhoïde &amp; Eau / Assainissement (WASH)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hadTyphoidLast30Days}
                onChange={(e) => setFormData({ ...formData, hadTyphoidLast30Days: e.target.checked })}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="font-bold text-slate-800">Cas de fièvre typhoïde ?</span>
            </label>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Source d Approvisionnement en Eau</label>
              <select
                value={formData.waterSource}
                onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                className="w-full p-2 border rounded-xl font-bold"
              >
                <option value="Borne fontaine REGIDESO">Borne fontaine REGIDESO</option>
                <option value="Puits protégé">Puits protégé</option>
                <option value="Puits non protégé">Puits non protégé</option>
                <option value="Fleuve Congo / Rivière">Fleuve Congo / Rivière</option>
                <option value="Source naturelle">Source naturelle aménagée</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Traitement de l Eau à Domicile</label>
              <select
                value={formData.waterTreatmentMethod}
                onChange={(e) => setFormData({ ...formData, waterTreatmentMethod: e.target.value })}
                className="w-full p-2 border rounded-xl font-bold"
              >
                <option value="CHLORE_AQUATABS">Chlore / Aquatabs</option>
                <option value="EBULLITION">Ébullition</option>
                <option value="FILTRATION">Filtration</option>
                <option value="AUCUN">Aucun traitement</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-slate-700 block">Observations &amp; Notes de Terrain</label>
            <textarea
              rows={2}
              placeholder="Notes qualitatives, observations environnementales spécifiques..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        {/* Erreurs de Validation */}
        {validationErrors.length > 0 && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
            <strong className="block font-bold">⚠️ Contrôles de Cohérence Bloquants :</strong>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Barre d'Action & Soumission */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer Brouillon Local</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Finaliser &amp; Mettre en File de Synchro</span>
          </button>
        </div>

      </div>

    </div>
  );
};
