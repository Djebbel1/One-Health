import React, { useState, useMemo, useEffect } from 'react';
import {
  Save,
  Send,
  ArrowLeft,
  MapPin,
  Camera,
  AlertTriangle,
  AlertCircle,
  Info,
  Droplets,
  Trash2,
  Layers,
  HelpCircle,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  Copy
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  EnvironmentalObservation,
  EnvironmentalFactorType,
  HistoricalStatus,
  HistoricalSource,
  RecordStatus,
  HouseholdSurvey,
  EnvironmentalPhoto
} from '../../types';
import {
  KINDU_HEALTH_ZONES,
  getHealthAreasByZone,
  getNeighborhoodsByHealthArea,
  getStreetsByNeighborhood,
  calculateGPSDistance,
  isWithinKindu
} from '../../data/kinduGeography';
import { GPSCaptureButton } from '../GPSCaptureButton';
import { PhotoCapture } from '../PhotoCapture';
import { checkForPII } from '../../utils/qualityControl';

export const FACTOR_CATEGORIES: {
  type: EnvironmentalFactorType;
  label: string;
  shortLabel: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    type: 'EAU_STAGNANTE',
    label: 'Eau stagnante',
    shortLabel: 'Eau stagnante',
    icon: Droplets,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    type: 'DECHETS',
    label: 'Déchets & Dépotoirs',
    shortLabel: 'Déchets',
    icon: Trash2,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  },
  {
    type: 'CANIVEAU',
    label: 'Caniveau d\'évacuation',
    shortLabel: 'Caniveau',
    icon: Layers,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300'
  },
  {
    type: 'EAUX_USEES',
    label: 'Eaux usées & Rejets',
    shortLabel: 'Eaux usées',
    icon: Droplets,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200'
  },
  {
    type: 'INONDATION',
    label: 'Inondation / Crue fluviale',
    shortLabel: 'Inondation',
    icon: Droplets,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200'
  },
  {
    type: 'POINT_EAU',
    label: 'Point d\'eau (Puits, Source, Borne)',
    shortLabel: 'Point d\'eau',
    icon: Droplets,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  {
    type: 'COURS_EAU',
    label: 'Cours d\'eau / Fleuve / Ruisseau',
    shortLabel: 'Cours d\'eau',
    icon: Droplets,
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200'
  },
  {
    type: 'VEGETATION',
    label: 'Végétation dense & herbes',
    shortLabel: 'Végétation',
    icon: Layers,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200'
  },
  {
    type: 'HABITAT_VECTEURS',
    label: 'Habitat favorable aux vecteurs',
    shortLabel: 'Habitat vecteurs',
    icon: Droplets,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    type: 'AUTRE',
    label: 'Autre facteur environnemental',
    shortLabel: 'Autre',
    icon: Info,
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200'
  },
];

interface EnvironmentalFormProps {
  initialData?: EnvironmentalObservation | null;
  onCancel: () => void;
  onSaveSuccess: (savedObs: EnvironmentalObservation) => void;
  onAddAnotherFactorAtSameLocation?: (currentLocation: {
    zone_id: string;
    health_area_id: string;
    neighborhood_id: string;
    street_name?: string;
    latitude: number;
    longitude: number;
    gps_accuracy: number;
    household_id?: string;
  }) => void;
}

export const EnvironmentalForm: React.FC<EnvironmentalFormProps> = ({
  initialData,
  onCancel,
  onSaveSuccess,
  onAddAnotherFactorAtSameLocation
}) => {
  const {
    userSession,
    householdSurveys,
    generateNextEnvironmentalId,
    addEnvironmentalObservation,
    updateEnvironmentalObservation
  } = useData();

  const isEdit = !!initialData;

  // 1. Identification
  const [formId] = useState<string>(initialData?.id || generateNextEnvironmentalId());

  // 2. Household Association & Location
  const [isHouseholdLinked, setIsHouseholdLinked] = useState<boolean>(!!initialData?.household_id);
  const [householdId, setHouseholdId] = useState<string>(initialData?.household_id || '');
  const [householdSearch, setHouseholdSearch] = useState<string>('');

  const [zoneId, setZoneId] = useState<string>(initialData?.zone_id || 'ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>(initialData?.health_area_id || 'AS_MIKELENGE');
  const [neighborhoodId, setNeighborhoodId] = useState<string>(initialData?.neighborhood_id || 'Q_MIK_CENTRE');
  const [streetName, setStreetName] = useState<string>(initialData?.street_name || '');

  // GPS
  const [latitude, setLatitude] = useState<number>(initialData?.latitude ?? -2.9438);
  const [longitude, setLongitude] = useState<number>(initialData?.longitude ?? 25.9224);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(initialData?.gps_accuracy ?? 4.5);
  const [gpsJustification, setGpsJustification] = useState<string>(initialData?.gps_justification || '');
  const [gpsDate, setGpsDate] = useState<string>(initialData?.gps_date || new Date().toISOString().split('T')[0]);
  const [gpsTime, setGpsTime] = useState<string>(initialData?.gps_time || new Date().toTimeString().split(' ')[0]);

  // 3. Main Factor Type
  const [factorType, setFactorType] = useState<EnvironmentalFactorType>(initialData?.factor_type || 'EAU_STAGNANTE');
  const [presence, setPresence] = useState<string>(initialData?.presence !== undefined ? String(initialData.presence) : 'Oui');
  const [extent, setExtent] = useState<string>(initialData?.extent || 'Moyenne');

  // Factor Specific Sub-Fields
  // A. EAU STAGNANTE
  const [stagnantExtent, setStagnantExtent] = useState<string>(initialData?.stagnant_extent || 'Moyenne');
  const [stagnantDuration, setStagnantDuration] = useState<string>(initialData?.stagnant_duration || '3–7 jours');
  const [stagnantOrigin, setStagnantOrigin] = useState<string>(initialData?.stagnant_origin || 'Pluie');
  const [stagnantHousingProximity, setStagnantHousingProximity] = useState<string>(initialData?.housing_proximity || '10–50 m');

  // B. DECHETS
  const [wastePresence, setWastePresence] = useState<string>(initialData?.waste_presence !== undefined ? String(initialData.waste_presence) : 'Oui');
  const [wasteExtent, setWasteExtent] = useState<string>(initialData?.waste_extent || 'Moyenne');
  const [wasteHousingDistance, setWasteHousingDistance] = useState<string>(initialData?.waste_housing_distance || '< 10 m');
  const [wasteType, setWasteType] = useState<string>(initialData?.waste_type || 'Déchets ménagers');
  const [wasteEstimatedAge, setWasteEstimatedAge] = useState<string>(initialData?.waste_estimated_age || '1–4 semaines');

  // C. CANIVEAU
  const [gutterCondition, setGutterCondition] = useState<string>(initialData?.gutter_condition || 'Partiellement obstrué');
  const [gutterWaterPresent, setGutterWaterPresent] = useState<string>(initialData?.gutter_water_present || 'Oui');

  // D. EAUX USEES
  const [wastewaterFlowType, setWastewaterFlowType] = useState<string>(initialData?.wastewater_flow_type || 'Stagnant');
  const [wastewaterSource, setWastewaterSource] = useState<string>(initialData?.wastewater_source || 'Domestique');

  // E. INONDATION
  const [isCurrentFlood, setIsCurrentFlood] = useState<string>(initialData?.is_current_flood !== undefined ? String(initialData.is_current_flood) : 'Oui');
  const [floodDepth, setFloodDepth] = useState<string>(initialData?.flood_depth || '20–50 cm');
  const [floodDuration, setFloodDuration] = useState<string>(initialData?.flood_duration || '3–7 jours');
  const [isHistoricalFlood, setIsHistoricalFlood] = useState<boolean>(!!initialData?.is_historical_flood);

  // F. POINT D'EAU
  const [waterPointType, setWaterPointType] = useState<string>(initialData?.water_point_type || 'Source');
  const [waterPointUsage, setWaterPointUsage] = useState<string>(initialData?.water_point_usage || 'Boisson et usage domestique');
  const [waterPointAccessibility, setWaterPointAccessibility] = useState<string>(initialData?.water_point_accessibility || 'Publique gratuite');
  const [waterPointCondition, setWaterPointCondition] = useState<string>(initialData?.water_point_condition || 'Bon');
  const [waterPointProtection, setWaterPointProtection] = useState<string>(initialData?.water_point_protection || 'Partiellement protégée');

  // G. COURS D'EAU
  const [watercourseName, setWatercourseName] = useState<string>(initialData?.watercourse_name || 'Fleuve Congo');
  const [watercourseBankCondition, setWatercourseBankCondition] = useState<string>(initialData?.watercourse_bank_condition || 'Berge naturelle instable');
  const [watercourseSpeed, setWatercourseSpeed] = useState<string>(initialData?.watercourse_speed || 'Moyen');

  // H. VEGETATION
  const [vegetationDensity, setVegetationDensity] = useState<string>(initialData?.vegetation_density || 'Moyenne');
  const [vegetationType, setVegetationType] = useState<string>(initialData?.vegetation_type || 'Hautes herbes');
  const [vegetationProximity, setVegetationProximity] = useState<string>(initialData?.vegetation_proximity || '10–50 m');

  // I. HABITAT VECTEURS
  const [vectorHabitatType, setVectorHabitatType] = useState<string>(initialData?.vector_habitat_type || 'Récipients / Déchets abandonnés');
  const [larvalPresence, setLarvalPresence] = useState<boolean>(initialData?.larval_presence ?? true);
  const [larvalDensity, setLarvalDensity] = useState<string>(initialData?.larval_density || 'Moyenne');
  const [waterTurbidity, setWaterTurbidity] = useState<string>(initialData?.water_turbidity || 'CLAIRE');
  const [sunExposure, setSunExposure] = useState<string>(initialData?.sun_exposure || 'OMBRE_PARTIELLE');

  // J. AUTRE
  const [otherFactorLabel, setOtherFactorLabel] = useState<string>(initialData?.other_factor_label || '');

  // 4. Temporal Dimension
  const todayStr = new Date().toISOString().split('T')[0];
  const [observationDate, setObservationDate] = useState<string>(initialData?.observation_date || todayStr);
  const [observationTime, setObservationTime] = useState<string>(initialData?.observation_time || new Date().toTimeString().split(' ')[0]);
  const [historicalStatus, setHistoricalStatus] = useState<HistoricalStatus>(initialData?.historical_status || 'CURRENT');
  const [historicalSource, setHistoricalSource] = useState<HistoricalSource | string>(initialData?.historical_source || 'Observation directe');
  const [validityStart, setValidityStart] = useState<string>(initialData?.validity_start || todayStr);
  const [validityEnd, setValidityEnd] = useState<string>(initialData?.validity_end || '');

  // 5. Photos & Descriptive Text
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photo_url);
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [enumeratorComment, setEnumeratorComment] = useState<string>(initialData?.enumerator_comment || '');

  // 6. Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Dependent dropdowns
  const availableHealthAreas = useMemo(() => getHealthAreasByZone(zoneId), [zoneId]);
  const availableNeighborhoods = useMemo(() => getNeighborhoodsByHealthArea(healthAreaId), [healthAreaId]);
  const availableStreets = useMemo(() => getStreetsByNeighborhood(neighborhoodId), [neighborhoodId]);

  // Household distance auto-calc
  const selectedHousehold = useMemo(() => {
    if (!householdId) return null;
    return householdSurveys.find(h => h.id === householdId || h.household_id === householdId) || null;
  }, [householdId, householdSurveys]);

  const calculatedDistanceMeters = useMemo(() => {
    if (!selectedHousehold || !selectedHousehold.latitude || !selectedHousehold.longitude) {
      return null;
    }
    if (!latitude || !longitude) return null;
    return Math.round(calculateGPSDistance(latitude, longitude, selectedHousehold.latitude, selectedHousehold.longitude));
  }, [selectedHousehold, latitude, longitude]);

  // When a household is chosen, auto-fill location details if not set
  const handleSelectHousehold = (hh: HouseholdSurvey) => {
    setHouseholdId(hh.id);
    if (hh.zone_id) setZoneId(hh.zone_id);
    if (hh.health_area_id) setHealthAreaId(hh.health_area_id);
    if (hh.neighborhood_id) setNeighborhoodId(hh.neighborhood_id);
    if (hh.street_name) setStreetName(hh.street_name);
  };

  // Helper for "Ancien dépôt de déchets" scenario
  const applyFormerWasteDumpScenario = () => {
    setFactorType('DECHETS');
    setPresence('Non');
    setWastePresence('Non');
    setHistoricalStatus('HISTORICAL_REPORTED_UNVERIFIED');
    setHistoricalSource('Ménage');
    setDescription('Ancien dépôt de déchets signalé par le ménage. Le site est actuellement occupé par une construction.');
    setEnumeratorComment('Information historique non vérifiée, terrain actuellement bâti.');
    setValidityStart('2021-01-01');
    setValidityEnd('2022-12-31');
  };

  // Validation
  const validate = (isSubmitting: boolean): boolean => {
    const errs: { [key: string]: string } = {};

    if (!observationDate) {
      errs.observationDate = 'La date d\'observation est obligatoire.';
    }

    if (!latitude || !longitude || (latitude === 0 && longitude === 0)) {
      if (!gpsJustification) {
        errs.gps = 'Coordonnées GPS manquantes. Veuillez justifier l\'absence de GPS.';
      }
    } else {
      if (!isWithinKindu(latitude, longitude)) {
        errs.gps = 'Les coordonnées GPS sont hors des limites géographiques de Kindu.';
      }
      if (gpsAccuracy > 20 && !gpsJustification.trim()) {
        errs.gpsAccuracy = 'Précision GPS > 20 m : justification obligatoire requise.';
      }
    }

    if (!description.trim()) {
      errs.description = 'La description factuelle de l\'observation est obligatoire.';
    } else {
      const pii = checkForPII(description);
      if (pii.hasPII) {
        errs.description = pii.reason || 'Donnée nominative/personnelle interdite dans la description.';
      }
    }

    if (enumeratorComment.trim()) {
      const piiComm = checkForPII(enumeratorComment);
      if (piiComm.hasPII) {
        errs.enumeratorComment = piiComm.reason || 'Donnée nominative interdite dans les commentaires.';
      }
    }

    if (historicalStatus !== 'CURRENT' && !historicalSource) {
      errs.historicalSource = 'Veuillez préciser la source de l\'information historique.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit / Save
  const handleSave = (targetStatus: RecordStatus) => {
    const isValid = validate(targetStatus === 'SUBMITTED');
    if (!isValid && targetStatus === 'SUBMITTED') {
      alert('Veuillez corriger les erreurs indiquées avant de soumettre l\'observation.');
      return;
    }

    let gpsStatus: 'VALID' | 'WARNING' | 'NO_GPS' = 'VALID';
    if (!latitude || !longitude || (latitude === 0 && longitude === 0)) {
      gpsStatus = 'NO_GPS';
    } else if (gpsAccuracy > 20) {
      gpsStatus = 'WARNING';
    }

    const obsData: EnvironmentalObservation = {
      id: formId,
      observation_id: formId,
      status: targetStatus,
      household_id: isHouseholdLinked && householdId ? householdId : undefined,
      calculated_household_distance_m: isHouseholdLinked && calculatedDistanceMeters !== null ? calculatedDistanceMeters : undefined,
      zone_id: zoneId,
      health_area_id: healthAreaId,
      neighborhood_id: neighborhoodId,
      street_name: streetName || undefined,
      latitude,
      longitude,
      gps_accuracy: gpsAccuracy,
      gps_status: gpsStatus,
      gps_justification: gpsJustification || undefined,
      gps_date: gpsDate,
      gps_time: gpsTime,
      gps_user: userSession.name || 'Enquêteur Terrain',
      factor_type: factorType,
      presence,
      extent,
      // Specific fields
      stagnant_extent: factorType === 'EAU_STAGNANTE' ? stagnantExtent : undefined,
      stagnant_duration: factorType === 'EAU_STAGNANTE' ? (stagnantDuration as any) : undefined,
      stagnant_origin: factorType === 'EAU_STAGNANTE' ? (stagnantOrigin as any) : undefined,
      housing_proximity: factorType === 'EAU_STAGNANTE' ? (stagnantHousingProximity as any) : (factorType === 'VEGETATION' ? vegetationProximity : undefined),
      waste_presence: factorType === 'DECHETS' ? wastePresence : undefined,
      waste_extent: factorType === 'DECHETS' ? wasteExtent : undefined,
      waste_housing_distance: factorType === 'DECHETS' ? (wasteHousingDistance as any) : undefined,
      waste_type: factorType === 'DECHETS' ? (wasteType as any) : undefined,
      waste_estimated_age: factorType === 'DECHETS' ? (wasteEstimatedAge as any) : undefined,
      gutter_condition: factorType === 'CANIVEAU' ? gutterCondition : undefined,
      gutter_water_present: factorType === 'CANIVEAU' ? gutterWaterPresent : undefined,
      wastewater_flow_type: factorType === 'EAUX_USEES' ? wastewaterFlowType : undefined,
      wastewater_source: factorType === 'EAUX_USEES' ? wastewaterSource : undefined,
      is_current_flood: factorType === 'INONDATION' ? isCurrentFlood : undefined,
      flood_depth: factorType === 'INONDATION' ? floodDepth : undefined,
      flood_duration: factorType === 'INONDATION' ? floodDuration : undefined,
      is_historical_flood: factorType === 'INONDATION' ? isHistoricalFlood : undefined,
      water_point_type: factorType === 'POINT_EAU' ? waterPointType : undefined,
      water_point_usage: factorType === 'POINT_EAU' ? waterPointUsage : undefined,
      water_point_accessibility: factorType === 'POINT_EAU' ? waterPointAccessibility : undefined,
      water_point_condition: factorType === 'POINT_EAU' ? waterPointCondition : undefined,
      water_point_protection: factorType === 'POINT_EAU' ? waterPointProtection : undefined,
      microbiological_quality: factorType === 'POINT_EAU' ? 'NON_ANALYSEE' : undefined,
      watercourse_name: factorType === 'COURS_EAU' ? watercourseName : undefined,
      watercourse_bank_condition: factorType === 'COURS_EAU' ? watercourseBankCondition : undefined,
      watercourse_speed: factorType === 'COURS_EAU' ? watercourseSpeed : undefined,
      vegetation_density: factorType === 'VEGETATION' ? vegetationDensity : undefined,
      vegetation_type: factorType === 'VEGETATION' ? vegetationType : undefined,
      vegetation_proximity: factorType === 'VEGETATION' ? vegetationProximity : undefined,
      vector_habitat_type: factorType === 'HABITAT_VECTEURS' ? vectorHabitatType : undefined,
      larval_presence: factorType === 'HABITAT_VECTEURS' || factorType === 'EAU_STAGNANTE' ? larvalPresence : undefined,
      larval_density: factorType === 'HABITAT_VECTEURS' || factorType === 'EAU_STAGNANTE' ? (larvalDensity as any) : undefined,
      water_turbidity: factorType === 'HABITAT_VECTEURS' || factorType === 'EAU_STAGNANTE' ? waterTurbidity : undefined,
      sun_exposure: factorType === 'HABITAT_VECTEURS' ? sunExposure : undefined,
      other_factor_label: factorType === 'AUTRE' ? otherFactorLabel : undefined,
      description,
      enumerator_comment: enumeratorComment || undefined,
      observation_date: observationDate,
      observation_time: observationTime,
      historical_status: historicalStatus,
      historical_source: historicalStatus !== 'CURRENT' ? historicalSource : undefined,
      validity_start: validityStart || undefined,
      validity_end: validityEnd || undefined,
      photo_url: photoUrl,
      surveyor_id: userSession.name || 'Enquêteur Environnement',
      enumerator_id: userSession.id,
      isDemoData: initialData?.isDemoData || false,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEdit) {
      updateEnvironmentalObservation(obsData, `Modification observation ${formId}`);
    } else {
      addEnvironmentalObservation(obsData);
    }

    onSaveSuccess(obsData);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 font-mono text-xs font-bold border border-teal-200">
                {formId}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? 'Modifier l\'observation environnementale' : 'Nouvelle observation environnementale'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Module de collecte environnementale géoréférencée • Kindu V1.2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Scenario Button */}
          <button
            type="button"
            onClick={applyFormerWasteDumpScenario}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition"
            title="Charger l'exemple type : Ancien dépôt de déchets signalé mais absent aujourd'hui"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Exemple : Ancien dépôt</span>
          </button>

          {onAddAnotherFactorAtSameLocation && (
            <button
              type="button"
              onClick={() => {
                onAddAnotherFactorAtSameLocation({
                  zone_id: zoneId,
                  health_area_id: healthAreaId,
                  neighborhood_id: neighborhoodId,
                  street_name: streetName,
                  latitude,
                  longitude,
                  gps_accuracy: gpsAccuracy,
                  household_id: isHouseholdLinked ? householdId : undefined
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-700" />
              <span>Ajouter un autre facteur ici</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Save className="w-4 h-4" />
            <span>Brouillon</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('SUBMITTED')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Send className="w-4 h-4" />
            <span>Soumettre</span>
          </button>
        </div>
      </div>

      {/* SECTION 1 : LOCALISATION & ASSOCIATION MÉNAGE */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>1. Localisation & Association au ménage</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Identifiant automatique : <strong className="font-mono text-teal-800">{formId}</strong>
          </span>
        </div>

        {/* Association Type Switch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              !isHouseholdLinked
                ? 'bg-teal-50/70 border-teal-500 text-teal-950 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="linkType"
              checked={!isHouseholdLinked}
              onChange={() => {
                setIsHouseholdLinked(false);
                setHouseholdId('');
              }}
              className="text-teal-600 focus:ring-teal-500"
            />
            <div>
              <div className="text-xs font-bold">Observation indépendante</div>
              <div className="text-[11px] text-slate-500">Facteur environnemental hors parcelle de ménage</div>
            </div>
          </label>

          <label
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              isHouseholdLinked
                ? 'bg-teal-50/70 border-teal-500 text-teal-950 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <input
              type="radio"
              name="linkType"
              checked={isHouseholdLinked}
              onChange={() => setIsHouseholdLinked(true)}
              className="text-teal-600 focus:ring-teal-500"
            />
            <div>
              <div className="text-xs font-bold">Associée à un ménage existant</div>
              <div className="text-[11px] text-slate-500">Calcul automatique de la distance spatiale</div>
            </div>
          </label>
        </div>

        {/* Household Search / Dropdown if linked */}
        {isHouseholdLinked && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-800">
                Sélectionner le ménage enquêté (MEN-XXXXXX) :
              </label>
              <input
                type="text"
                placeholder="Filtrer par ID, avenue, quartier..."
                value={householdSearch}
                onChange={(e) => setHouseholdSearch(e.target.value)}
                className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-md focus:outline-hidden focus:border-teal-500 w-56"
              />
            </div>

            <select
              value={householdId}
              onChange={(e) => {
                const found = householdSurveys.find(h => h.id === e.target.value);
                if (found) handleSelectHousehold(found);
                else setHouseholdId(e.target.value);
              }}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              <option value="">-- Sélectionner un ménage répertorié --</option>
              {householdSurveys
                .filter(h => {
                  if (!householdSearch.trim()) return true;
                  const q = householdSearch.toLowerCase();
                  return (
                    h.id.toLowerCase().includes(q) ||
                    (h.street_name && h.street_name.toLowerCase().includes(q)) ||
                    h.neighborhood_id.toLowerCase().includes(q)
                  );
                })
                .map(h => (
                  <option key={h.id} value={h.id}>
                    {h.id} • {h.street_name || 'Avenue non précisée'} ({h.health_area_id} - {h.neighborhood_id})
                  </option>
                ))}
            </select>

            {/* Read-Only Distance Display */}
            {selectedHousehold && (
              <div className="flex items-center justify-between bg-teal-50 p-2.5 rounded-lg border border-teal-200 text-xs">
                <div className="flex items-center gap-2 text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>
                    Ménage associé : <strong>{selectedHousehold.id}</strong> (GPS: {selectedHousehold.latitude.toFixed(4)}, {selectedHousehold.longitude.toFixed(4)})
                  </span>
                </div>
                <div className="font-bold text-teal-950 bg-teal-200/70 px-2.5 py-1 rounded-md">
                  Distance : {calculatedDistanceMeters !== null ? `${calculatedDistanceMeters} mètres` : 'Calcul en cours...'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Administrative Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Zone de santé <span className="text-rose-500">*</span>
            </label>
            <select
              value={zoneId}
              onChange={(e) => {
                setZoneId(e.target.value);
                const areas = getHealthAreasByZone(e.target.value);
                if (areas.length > 0) {
                  setHealthAreaId(areas[0].id);
                  const neighs = getNeighborhoodsByHealthArea(areas[0].id);
                  if (neighs.length > 0) setNeighborhoodId(neighs[0].id);
                }
              }}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              {KINDU_HEALTH_ZONES.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aire de santé <span className="text-rose-500">*</span>
            </label>
            <select
              value={healthAreaId}
              onChange={(e) => {
                setHealthAreaId(e.target.value);
                const neighs = getNeighborhoodsByHealthArea(e.target.value);
                if (neighs.length > 0) setNeighborhoodId(neighs[0].id);
              }}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              {availableHealthAreas.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.commune})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quartier <span className="text-rose-500">*</span>
            </label>
            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            >
              {availableNeighborhoods.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Avenue / Street name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nom de l'avenue ou rue / Repère de proximité
          </label>
          <input
            type="text"
            list="streets-list"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="Ex: Avenue Lumumba, Rue du Port, Derrière l'école..."
            className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
          <datalist id="streets-list">
            {availableStreets.map((s, idx) => (
              <option key={idx} value={s} />
            ))}
          </datalist>
        </div>

        {/* GPS Capture Controls */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GPSCaptureButton
                onCapture={(loc) => {
                  setLatitude(loc.latitude);
                  setLongitude(loc.longitude);
                  setGpsAccuracy(loc.accuracy);
                  setGpsDate(loc.capturedAtDate);
                  setGpsTime(loc.capturedAtTime);
                }}
              />
              <div className="text-xs text-slate-500">
                Lat: <span className="font-mono font-semibold text-slate-800">{latitude.toFixed(5)}</span> • Long: <span className="font-mono font-semibold text-slate-800">{longitude.toFixed(5)}</span>
              </div>
            </div>

            {/* GPS Control Status Badge */}
            <div className="flex items-center gap-2">
              {gpsAccuracy <= 20 ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Précision GPS valide (±{gpsAccuracy.toFixed(1)} m)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Avertissement : précision faible (±{gpsAccuracy.toFixed(1)} m &gt; 20 m)
                </span>
              )}
            </div>
          </div>

          {/* Justification if precision > 20m or NO_GPS */}
          {(gpsAccuracy > 20 || latitude === 0) && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5">
              <label className="font-semibold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Justification de la mesure GPS (Obligatoire si précision &gt; 20 m) :</span>
              </label>
              <input
                type="text"
                value={gpsJustification}
                onChange={(e) => setGpsJustification(e.target.value)}
                placeholder="Ex: Masquage par frondaison dense, bâtiment haut, météo couverte..."
                className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              {errors.gpsAccuracy && <p className="text-[11px] text-rose-600 font-medium">{errors.gpsAccuracy}</p>}
            </div>
          )}

          {errors.gps && <p className="text-xs text-rose-600 font-medium">{errors.gps}</p>}
        </div>
      </div>

      {/* SECTION 2 : TYPE D'OBSERVATION PRINCIPALE */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>2. Catégorie du facteur environnemental</span>
          </h3>
          <span className="text-[11px] text-slate-500">Un type principal par observation</span>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FACTOR_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = factorType === cat.type;

            return (
              <button
                key={cat.type}
                type="button"
                onClick={() => setFactorType(cat.type)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                  isSelected
                    ? `${cat.bgColor} ${cat.borderColor} ring-2 ring-teal-600 shadow-2xs`
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-1.5 rounded-lg ${cat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />}
                </div>
                <div className="text-xs font-bold leading-snug">{cat.shortLabel}</div>
              </button>
            );
          })}
        </div>

        {/* DYNAMIC FACTOR SUB-FORM */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
          {/* 1. EAU STAGNANTE */}
          {factorType === 'EAU_STAGNANTE' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-blue-900">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Paramètres spécifiques : Eau Stagnante</span>
              </div>

              {/* Scientific Neutrality Notice */}
              <div className="bg-blue-50/80 border-l-3 border-blue-600 p-2.5 text-[11px] text-blue-900 rounded-r-lg">
                ⚠️ <strong>Protocole scientifique :</strong> Ces catégories décrivent l'observation de visu. Elles ne doivent pas être interprétées automatiquement comme preuve de présence ou de transmission vectorielle.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence actuelle</label>
                  <select
                    value={presence}
                    onChange={(e) => setPresence(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Étendue de la nappe</label>
                  <select
                    value={stagnantExtent}
                    onChange={(e) => setStagnantExtent(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Très petite">Très petite (&lt; 1 m²)</option>
                    <option value="Petite">Petite (1–5 m²)</option>
                    <option value="Moyenne">Moyenne (5–20 m²)</option>
                    <option value="Grande">Grande (&gt; 20 m²)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Durée estimée</label>
                  <select
                    value={stagnantDuration}
                    onChange={(e) => setStagnantDuration(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 3 jours">&lt; 3 jours</option>
                    <option value="3–7 jours">3–7 jours</option>
                    <option value="1–4 semaines">1–4 semaines</option>
                    <option value="> 1 mois">&gt; 1 mois</option>
                    <option value="Inconnue">Inconnue</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Origine probable</label>
                  <select
                    value={stagnantOrigin}
                    onChange={(e) => setStagnantOrigin(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Pluie">Pluie</option>
                    <option value="Fuite d'eau">Fuite d'eau (conduite/robinet)</option>
                    <option value="Caniveau">Caniveau / Eaux usées</option>
                    <option value="Inondation">Inondation / Crue</option>
                    <option value="Autre">Autre</option>
                    <option value="Inconnue">Inconnue</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Proximité des habitations</label>
                  <select
                    value={stagnantHousingProximity}
                    onChange={(e) => setStagnantHousingProximity(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 10 m">&lt; 10 m (Parcelle / Mur)</option>
                    <option value="10–50 m">10–50 m</option>
                    <option value="50–100 m">50–100 m</option>
                    <option value="> 100 m">&gt; 100 m</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence de larves visibles</label>
                  <select
                    value={larvalPresence ? 'Oui' : 'Non'}
                    onChange={(e) => setLarvalPresence(e.target.value === 'Oui')}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui (Larves observées)</option>
                    <option value="Non">Non (Aucune larve constatée)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. DECHETS */}
          {factorType === 'DECHETS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-amber-600" />
                  <span>Paramètres spécifiques : Déchets & Dépotoirs</span>
                </div>
                {presence === 'Non' && (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-semibold">
                    Dépôt non présent aujourd'hui (Historique)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence actuelle</label>
                  <select
                    value={wastePresence}
                    onChange={(e) => {
                      setWastePresence(e.target.value);
                      setPresence(e.target.value);
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui (Dépôt visible)</option>
                    <option value="Non">Non (Ancien dépôt disparu / site bâti)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type de déchets</label>
                  <select
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Déchets ménagers">Déchets ménagers</option>
                    <option value="Déchets organiques">Déchets organiques</option>
                    <option value="Déchets plastiques">Déchets plastiques</option>
                    <option value="Déchets médicaux">Déchets médicaux</option>
                    <option value="Déchets mélangés">Déchets mélangés</option>
                    <option value="Autre">Autre</option>
                    <option value="Inconnu">Inconnu</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Étendue</label>
                  <select
                    value={wasteExtent}
                    onChange={(e) => setWasteExtent(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Très petite">Très petite (&lt; 2 m²)</option>
                    <option value="Petite">Petite (2–10 m²)</option>
                    <option value="Moyenne">Moyenne (10–50 m²)</option>
                    <option value="Grande">Grande (&gt; 50 m² - Décharge sauvage)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Distance des habitations</label>
                  <select
                    value={wasteHousingDistance}
                    onChange={(e) => setWasteHousingDistance(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 10 m">&lt; 10 m (Devant la maison / parcelle)</option>
                    <option value="10–50 m">10–50 m</option>
                    <option value="50–100 m">50–100 m</option>
                    <option value="> 100 m">&gt; 100 m</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ancienneté estimée</label>
                  <select
                    value={wasteEstimatedAge}
                    onChange={(e) => setWasteEstimatedAge(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 1 semaine">&lt; 1 semaine</option>
                    <option value="1–4 semaines">1–4 semaines</option>
                    <option value="1–6 mois">1–6 mois</option>
                    <option value="> 6 mois">&gt; 6 mois</option>
                    <option value="Inconnue">Inconnue</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. CANIVEAU */}
          {factorType === 'CANIVEAU' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-slate-900">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>Paramètres spécifiques : Caniveau</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence</label>
                  <select
                    value={presence}
                    onChange={(e) => setPresence(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">État structurel</label>
                  <select
                    value={gutterCondition}
                    onChange={(e) => setGutterCondition(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Bon">Bon (Écoulement fluide)</option>
                    <option value="Partiellement obstrué">Partiellement obstrué</option>
                    <option value="Fortement obstrué">Fortement obstrué (Eau bloquée)</option>
                    <option value="Détruit">Détruit / Effondré</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Eau présente</label>
                  <select
                    value={gutterWaterPresent}
                    onChange={(e) => setGutterWaterPresent(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                    <option value="Inconnu">Inconnu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 4. EAUX USEES */}
          {factorType === 'EAUX_USEES' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-indigo-900">
                <Droplets className="w-4 h-4 text-indigo-700" />
                <span>Paramètres spécifiques : Eaux usées & Déversements</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence</label>
                  <select
                    value={presence}
                    onChange={(e) => setPresence(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Régime d'écoulement</label>
                  <select
                    value={wastewaterFlowType}
                    onChange={(e) => setWastewaterFlowType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Stagnant">Stagnant (Poche d'eaux usées)</option>
                    <option value="Écoulement continu">Écoulement continu</option>
                    <option value="Écoulement intermittent">Écoulement intermittent (après lavage/cuisine)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Source principale</label>
                  <select
                    value={wastewaterSource}
                    onChange={(e) => setWastewaterSource(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Domestique">Domestique (Vaisselle, douche, lessive)</option>
                    <option value="Artisanale/Commerciale">Artisanale / Commerciale / Marché</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 5. INONDATION */}
          {factorType === 'INONDATION' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-cyan-900">
                <Droplets className="w-4 h-4 text-cyan-700" />
                <span>Paramètres spécifiques : Inondation & Crue</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Inondation actuelle</label>
                  <select
                    value={isCurrentFlood}
                    onChange={(e) => setIsCurrentFlood(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui (Eau submersion active)</option>
                    <option value="Non">Non (Traces de crue passée)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Profondeur estimée</label>
                  <select
                    value={floodDepth}
                    onChange={(e) => setFloodDepth(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 20 cm">&lt; 20 cm (Flaques superficielles)</option>
                    <option value="20–50 cm">20–50 cm (Niveau genoux)</option>
                    <option value="> 50 cm">&gt; 50 cm (Submersion sévère parcelles)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Durée estimée de submersion</label>
                  <select
                    value={floodDuration}
                    onChange={(e) => setFloodDuration(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 3 jours">&lt; 3 jours</option>
                    <option value="3–7 jours">3–7 jours</option>
                    <option value="1–4 semaines">1–4 semaines</option>
                    <option value="> 1 mois">&gt; 1 mois</option>
                    <option value="Inconnue">Inconnue</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 6. POINT D'EAU */}
          {factorType === 'POINT_EAU' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold text-teal-900">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-teal-700" />
                  <span>Paramètres spécifiques : Point d'eau</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                  Qualité microbiologique : NON ANALYSÉE
                </span>
              </div>

              {/* Mandatory Potability Warning */}
              <div className="bg-amber-50 border-l-3 border-amber-600 p-2.5 text-[11px] text-amber-900 rounded-r-lg">
                ⚠️ <strong>Règle de rigueur scientifique :</strong> L'application ne doit jamais déclarer qu'une source est « potable » uniquement sur la base de l'observation visuelle. La qualité microbiologique reste classée comme <strong>NON ANALYSÉE</strong> en l'absence d'analyse de laboratoire.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type d'ouvrage</label>
                  <select
                    value={waterPointType}
                    onChange={(e) => setWaterPointType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Forage">Forage</option>
                    <option value="Puits">Puits traditionnel</option>
                    <option value="Source">Source naturelle</option>
                    <option value="Borne-fontaine">Borne-fontaine</option>
                    <option value="Réseau">Réseau REGIDESO</option>
                    <option value="Rivière">Rivière</option>
                    <option value="Fleuve">Fleuve Congo</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Utilisation</label>
                  <select
                    value={waterPointUsage}
                    onChange={(e) => setWaterPointUsage(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Boisson et usage domestique">Boisson et usage domestique</option>
                    <option value="Usage domestique seul">Usage domestique seul (Lessive, bain)</option>
                    <option value="Maraîchage / Animaux">Maraîchage / Animaux</option>
                    <option value="Non utilisé">Non utilisé</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Accessibilité</label>
                  <select
                    value={waterPointAccessibility}
                    onChange={(e) => setWaterPointAccessibility(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Publique gratuite">Publique gratuite</option>
                    <option value="Payante (au bidon)">Payante (au bidon)</option>
                    <option value="Privée / Concession fermée">Privée / Concession fermée</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Protection apparente</label>
                  <select
                    value={waterPointProtection}
                    onChange={(e) => setWaterPointProtection(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Protégée (Margelle maçonnée, couvercle)">Protégée (Margelle maçonnée, couvercle)</option>
                    <option value="Partiellement protégée">Partiellement protégée</option>
                    <option value="Non protégée contre ruissellements">Non protégée contre ruissellements</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 7. COURS D'EAU */}
          {factorType === 'COURS_EAU' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-sky-900">
                <Droplets className="w-4 h-4 text-sky-700" />
                <span>Paramètres spécifiques : Cours d'eau & Rives</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nom du cours d'eau</label>
                  <input
                    type="text"
                    value={watercourseName}
                    onChange={(e) => setWatercourseName(e.target.value)}
                    placeholder="Ex: Fleuve Congo, Ruisseau Kasuku..."
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">État des berges</label>
                  <select
                    value={watercourseBankCondition}
                    onChange={(e) => setWatercourseBankCondition(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Berge naturelle instable">Berge naturelle instable</option>
                    <option value="Berge aménagée / Quai">Berge aménagée / Quai</option>
                    <option value="Zone marécageuse de berge">Zone marécageuse de berge</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vitesse apparente d'écoulement</label>
                  <select
                    value={watercourseSpeed}
                    onChange={(e) => setWatercourseSpeed(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Rapide">Rapide</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Lent / Stagnant en méandre">Lent / Stagnant en méandre</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 8. VEGETATION */}
          {factorType === 'VEGETATION' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-emerald-900">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Paramètres spécifiques : Végétation dense</span>
              </div>

              <div className="bg-emerald-50/80 border-l-3 border-emerald-600 p-2.5 text-[11px] text-emerald-900 rounded-r-lg">
                ⚠️ <strong>Protocole scientifique :</strong> Ne pas interpréter automatiquement la végétation comme un gîte vectoriel.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Densité de la végétation</label>
                  <select
                    value={vegetationDensity}
                    onChange={(e) => setVegetationDensity(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Faible">Faible (Pelouses rases, clairières)</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Dense">Dense (Hautes herbes &gt; 1 m)</option>
                    <option value="Très dense">Très dense (Fourré marécageux)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type de végétation</label>
                  <select
                    value={vegetationType}
                    onChange={(e) => setVegetationType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Hautes herbes">Hautes herbes</option>
                    <option value="Arbustes / Broussailles">Arbustes / Broussailles</option>
                    <option value="Marais / Cultures maraîchères">Marais / Cultures maraîchères</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Proximité des habitations</label>
                  <select
                    value={vegetationProximity}
                    onChange={(e) => setVegetationProximity(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="< 10 m">&lt; 10 m (Attenante à la parcelle)</option>
                    <option value="10–50 m">10–50 m</option>
                    <option value="50–100 m">50–100 m</option>
                    <option value="> 100 m">&gt; 100 m</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 9. HABITAT VECTEURS */}
          {factorType === 'HABITAT_VECTEURS' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-purple-900">
                <Droplets className="w-4 h-4 text-purple-700" />
                <span>Paramètres spécifiques : Habitat larvaire & vecteurs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type de micro-gîte</label>
                  <select
                    value={vectorHabitatType}
                    onChange={(e) => setVectorHabitatType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Récipients / Déchets abandonnés">Récipients / Déchets abandonnés</option>
                    <option value="Pneus usagés">Pneus usagés</option>
                    <option value="Flaque temporaire sur sol argileux">Flaque temporaire sur sol argileux</option>
                    <option value="Creux d'arbre / Bambou">Creux d'arbre / Bambou</option>
                    <option value="Bordure de marécage">Bordure de marécage</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Présence de larves</label>
                  <select
                    value={larvalPresence ? 'Oui' : 'Non'}
                    onChange={(e) => setLarvalPresence(e.target.value === 'Oui')}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Densité larvaire estimée</label>
                  <select
                    value={larvalDensity}
                    onChange={(e) => setLarvalDensity(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Faible">Faible (1–5 larves par coupelle)</option>
                    <option value="Moyenne">Moyenne (6–20 larves par coupelle)</option>
                    <option value="Forte">Forte (&gt; 20 larves par coupelle)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 10. AUTRE */}
          {factorType === 'AUTRE' && (
            <div>
              <label className="font-semibold text-slate-700 block text-xs mb-1">
                Préciser la nature du facteur environnemental
              </label>
              <input
                type="text"
                value={otherFactorLabel}
                onChange={(e) => setOtherFactorLabel(e.target.value)}
                placeholder="Ex: Élevage porcin de proximité, latrine effondrée, etc."
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 : DIMENSION TEMPORELLE & PROTECTION HISTORIQUE */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700" />
            <span>3. Dimension temporelle & Statut historique</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-semibold">
            Règle scientifique fondamentale : Distinction Actuel vs Historique
          </span>
        </div>

        {/* Date and Time of observation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Date d'observation <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={observationDate}
              onChange={(e) => setObservationDate(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            {errors.observationDate && <p className="text-[11px] text-rose-600 mt-0.5">{errors.observationDate}</p>}
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Heure de constat</label>
            <input
              type="time"
              value={observationTime}
              onChange={(e) => setObservationTime(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-slate-700 block mb-1">
              Statut historique de l'observation <span className="text-rose-500">*</span>
            </label>
            <select
              value={historicalStatus}
              onChange={(e) => setHistoricalStatus(e.target.value as HistoricalStatus)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900 focus:ring-2 focus:ring-teal-500"
            >
              <option value="CURRENT">Actuel (Facteur présent au moment de la collecte)</option>
              <option value="HISTORICAL_DOCUMENTED">Historique documenté (Rapports antérieurs / Photos anciennes)</option>
              <option value="HISTORICAL_REPORTED_UNVERIFIED">Historique rapporté mais non vérifié (Témoignage oral)</option>
              <option value="UNKNOWN">Inconnu (Date d'apparition non déterminable)</option>
            </select>
          </div>
        </div>

        {/* Protection Warnings based on Historical Status */}
        {historicalStatus === 'CURRENT' && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>⚠️ Protection anti-extrapolation temporelle :</strong> Cette observation décrit la situation au moment de la collecte. Elle ne constitue pas une preuve de la situation historique des années antérieures.
            </div>
          </div>
        )}

        {historicalStatus === 'HISTORICAL_REPORTED_UNVERIFIED' && (
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900 flex items-center gap-2">
                <span>⚠️ Information non vérifiée</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Symbole cartographique distinct
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Ce point ne sera pas représenté comme un facteur actuel sur la carte, mais comme un témoignage historique à valider scientifiquement.
              </p>
            </div>
          </div>
        )}

        {/* Historical Source & Optional Validity Period */}
        {historicalStatus !== 'CURRENT' && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Source de l'information <span className="text-rose-500">*</span>
              </label>
              <select
                value={historicalSource}
                onChange={(e) => setHistoricalSource(e.target.value as HistoricalSource)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="Observation directe">Observation directe</option>
                <option value="Ménage">Ménage (Habitant riverain)</option>
                <option value="Chef local">Chef local / Chef d'avenue</option>
                <option value="Agent de santé">Agent de santé communautaire</option>
                <option value="Document">Document officiel</option>
                <option value="Photo ancienne">Photo ancienne datée</option>
                <option value="Rapport">Rapport épidémiologique</option>
                <option value="Autre">Autre</option>
              </select>
              {errors.historicalSource && <p className="text-[11px] text-rose-600 mt-0.5">{errors.historicalSource}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Début de validité estimé</label>
              <input
                type="date"
                value={validityStart}
                onChange={(e) => setValidityStart(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Fin de validité estimée</label>
              <input
                type="date"
                value={validityEnd}
                onChange={(e) => setValidityEnd(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4 : PHOTOGRAPHIE & DESCRIPTIONS */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-700" />
            <span>4. Photographie & Description factuelle</span>
          </h3>
          <span className="text-[11px] text-slate-500">Conservation de l'image originale sans altération</span>
        </div>

        {/* Photo Capture */}
        <div className="space-y-2">
          <PhotoCapture
            recordId={formId}
            existingPhotoUrl={photoUrl}
            onPhotoCaptured={(dataUrl) => setPhotoUrl(dataUrl)}
          />
        </div>

        {/* Descriptive Text & Enumerator Comments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Description factuelle <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exemple correct : « Eau stagnante observée derrière trois habitations sur 10 m². » (Éviter les conclusions comme 'Zone à haut risque')"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            {errors.description && <p className="text-[11px] text-rose-600 mt-0.5">{errors.description}</p>}
            <p className="text-[11px] text-slate-400 mt-1">
              Restez strictement descriptif. Aucune donnée nominative (noms de famille) autorisée.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Commentaires de l'enquêteur (Notes de contexte)
            </label>
            <textarea
              rows={3}
              value={enumeratorComment}
              onChange={(e) => setEnumeratorComment(e.target.value)}
              placeholder="Ex: Contexte d'accès, présence de riverains lors de la visite, difficulté d'observation..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            {errors.enumeratorComment && <p className="text-[11px] text-rose-600 mt-0.5">{errors.enumeratorComment}</p>}
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
        >
          Annuler
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('DRAFT')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer comme Brouillon</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('SUBMITTED')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <Send className="w-4 h-4" />
            <span>Soumettre l'observation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
