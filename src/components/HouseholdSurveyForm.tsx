import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Users,
  Droplets,
  Shield,
  Trash2,
  Bug,
  Eye,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  Send,
  AlertCircle,
  RotateCcw,
  FileCheck,
  Check,
  X,
  Lock
} from 'lucide-react';
import { useData } from '../context/DataContext';
import {
  HouseholdSurvey,
  RecordStatus,
  WasteDistance
} from '../types';
import {
  KINDU_HEALTH_ZONES,
  getHealthAreasByZone,
  getNeighborhoodsByHealthArea,
  getStreetsByNeighborhood,
  findPotentialDuplicateHousehold
} from '../data/kinduGeography';
import { GPSCaptureButton } from './GPSCaptureButton';
import { PhotoCapture } from './PhotoCapture';
import { checkForPII } from '../utils/qualityControl';

const DRAFT_STORAGE_KEY = 'onehealth_household_survey_draft_v1_1';

const WATER_SOURCE_CHOICES: { code: number; label: string }[] = [
  { code: 1, label: "1 - Réseau d'eau (REGIDESO / Robinet)" },
  { code: 2, label: '2 - Borne-fontaine publique' },
  { code: 3, label: '3 - Forage équipé de pompe manuelle' },
  { code: 4, label: '4 - Puits creusé' },
  { code: 5, label: '5 - Source naturelle' },
  { code: 6, label: '6 - Rivière / Fleuve Congo' },
  { code: 7, label: '7 - Eau de pluie collectée' },
  { code: 8, label: "8 - Vendeur d'eau en bidons" },
  { code: 9, label: '9 - Autre source' },
  { code: 99, label: '99 - Ne sait pas / Non précisé' },
];

const WATER_TREATMENT_METHODS = [
  'Ébullition',
  'Chloration (Aquatabs / Eau de Javel)',
  'Filtration (Filtre céramique / tissu)',
  'Décantation',
  'Autre',
];

interface HouseholdSurveyFormProps {
  initialData?: HouseholdSurvey | null;
  onSaveSuccess: (survey: HouseholdSurvey) => void;
  onCancel: () => void;
  onInspectDuplicate?: (surveyId: string) => void;
}

export const HouseholdSurveyForm: React.FC<HouseholdSurveyFormProps> = ({
  initialData,
  onSaveSuccess,
  onCancel,
  onInspectDuplicate,
}) => {
  const {
    householdSurveys,
    addHouseholdSurvey,
    updateHouseholdSurvey,
    generateNextHouseholdId,
    userSession,
    isOffline,
  } = useData();

  // Active step (1 to 10)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hasDraftRestored, setHasDraftRestored] = useState<boolean>(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);

  // Auto-generated ID (cannot be changed manually)
  const [surveyId, setSurveyId] = useState<string>(() => {
    return initialData ? initialData.id : generateNextHouseholdId();
  });

  // Step 1: Localisation & Horodatage
  const [zoneId, setZoneId] = useState<string>(initialData?.zone_id || 'ZS_KINDU');
  const [healthAreaId, setHealthAreaId] = useState<string>(initialData?.health_area_id || 'AS_MIKELENGE');
  const [neighborhoodId, setNeighborhoodId] = useState<string>(initialData?.neighborhood_id || 'Q_MIK_CENTRE');
  const [streetName, setStreetName] = useState<string>(initialData?.street_name || '');
  const [isCustomStreet, setIsCustomStreet] = useState<boolean>(false);

  // GPS Coordinates & Quality Control
  const [latitude, setLatitude] = useState<number>(initialData?.latitude || -2.9438);
  const [longitude, setLongitude] = useState<number>(initialData?.longitude || 25.9224);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(initialData?.gps_accuracy || 4.5);
  const [gpsJustification, setGpsJustification] = useState<string>(initialData?.gps_justification || '');

  // Duplicate Detection state
  const [duplicateJustification, setDuplicateJustification] = useState<string>(initialData?.duplicate_justification || '');
  const [detectedDuplicate, setDetectedDuplicate] = useState<HouseholdSurvey | null>(null);

  // Date, Time, Enumerator, Consent
  const [surveyDate, setSurveyDate] = useState<string>(() => {
    return initialData?.survey_date || new Date().toISOString().split('T')[0];
  });
  const [surveyTime, setSurveyTime] = useState<string>(() => {
    if (initialData?.survey_time) return initialData.survey_time;
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [enumeratorId] = useState<string>(() => {
    return initialData?.enumerator_id || initialData?.surveyor_id || userSession.id || 'USR-003';
  });
  const [consentObtained, setConsentObtained] = useState<boolean>(initialData?.consent_obtained ?? true);

  // Step 2: Caractéristiques du ménage
  const [hhSize, setHhSize] = useState<number>(initialData?.hh_size || 5);
  const [childrenU5, setChildrenU5] = useState<number>(initialData?.children_u5 || 1);
  const [children5To14, setChildren5To14] = useState<number>(initialData?.children_5_14 || 2);

  // Auto-calculated: adults_15plus = hh_size - children_u5 - children_5_14
  const adults15Plus = useMemo(() => {
    return Math.max(0, hhSize - childrenU5 - children5To14);
  }, [hhSize, childrenU5, children5To14]);

  // Step 3: Source d'eau & Traitement
  const [waterSource, setWaterSource] = useState<number>(typeof initialData?.water_source === 'number' ? initialData.water_source : 4);
  const [waterSourceOther, setWaterSourceOther] = useState<string>(initialData?.water_source_other || '');
  const [waterNearby, setWaterNearby] = useState<'OUI' | 'NON'>(() => {
    if (typeof initialData?.water_nearby === 'boolean') return initialData.water_nearby ? 'OUI' : 'NON';
    return (initialData?.water_nearby as any) || 'OUI';
  });
  const [waterCollectionTime, setWaterCollectionTime] = useState<string>(() => {
    if (typeof initialData?.water_collection_time === 'number') {
      const min = initialData.water_collection_time;
      if (min < 5) return '<5 minutes';
      if (min <= 15) return '5–15 minutes';
      if (min <= 30) return '16–30 minutes';
      return '>30 minutes';
    }
    return (initialData?.water_collection_time as string) || '5–15 minutes';
  });
  const [waterTreatmentFrequency, setWaterTreatmentFrequency] = useState<string>(() => {
    const f = initialData?.water_treatment_frequency;
    if (f === 'TOUJOURS') return 'Toujours';
    if (f === 'SOUVENT') return 'Souvent';
    if (f === 'PARFOIS') return 'Parfois';
    if (f === 'JAMAIS') return 'Jamais';
    return f || 'Jamais';
  });
  const [waterTreatmentMethods, setWaterTreatmentMethods] = useState<string[]>(() => {
    if (Array.isArray(initialData?.water_treatment_method)) return initialData.water_treatment_method;
    if (typeof initialData?.water_treatment_method === 'string') {
      if (initialData.water_treatment_method === 'AUCUN') return [];
      if (initialData.water_treatment_method === 'EBULLITION') return ['Ébullition'];
      if (initialData.water_treatment_method === 'CHLORE_AQUATABS') return ['Chloration (Aquatabs / Eau de Javel)'];
      if (initialData.water_treatment_method === 'FILTRE_CERAMIQUE') return ['Filtration (Filtre céramique / tissu)'];
      return [initialData.water_treatment_method];
    }
    return [];
  });
  const [waterTreatmentOther, setWaterTreatmentOther] = useState<string>(initialData?.water_treatment_other || '');
  const [waterStorageType, setWaterStorageType] = useState<string>(() => {
    const s = initialData?.water_storage_type;
    if (s === 'BIDON_FERME') return 'Récipient fermé';
    if (s === 'FUT_COUVERT') return 'Récipient couvert';
    if (s === 'SEAU_OUVERT') return 'Récipient ouvert';
    return s || 'Récipient fermé';
  });
  const [waterContainerClean, setWaterContainerClean] = useState<string>(() => {
    if (typeof initialData?.water_container_clean === 'boolean') {
      return initialData.water_container_clean ? 'Oui' : 'Non';
    }
    return (initialData?.water_container_clean as string) || 'Oui';
  });

  // Step 4: Assainissement
  const [latrineAvailable, setLatrineAvailable] = useState<string>(() => {
    if (typeof initialData?.latrine_available === 'boolean') return initialData.latrine_available ? 'Oui' : 'Non';
    return (initialData?.latrine_available as string) || 'Oui';
  });
  const [latrineType, setLatrineType] = useState<string>(() => {
    const t = initialData?.latrine_type;
    if (t === 'FOSSE_SANS_DALLE') return 'traditionnelle';
    if (t === 'FOSSE_SIMPLE_DALLE' || t === 'VIP_AMELIOREE') return 'améliorée';
    if (t === 'CHASSE_MANUELLE' || t === 'CHASSE_MECANIQUE') return 'toilette avec chasse';
    return t || 'traditionnelle';
  });
  const [latrineShared, setLatrineShared] = useState<string>(() => {
    if (typeof initialData?.latrine_shared === 'boolean') return initialData.latrine_shared ? 'Oui' : 'Non';
    return (initialData?.latrine_shared as string) || 'Non';
  });
  const [latrineCondition, setLatrineCondition] = useState<string>(() => {
    const c = initialData?.latrine_condition;
    if (c === 'PROPRE_ENTRETENUE') return 'Bonne';
    if (c === 'MOYENNE') return 'Moyenne';
    if (c === 'DEGRADEE_INONDEE' || c === 'PLEINE') return 'Mauvaise';
    return c || 'Moyenne';
  });

  // Step 5: Eaux usées & Stagnation
  const [wastewaterDisposal, setWastewaterDisposal] = useState<string>(() => {
    const w = initialData?.wastewater_disposal;
    if (w === 'CANIVEAU') return 'Caniveau';
    if (w === 'COUR_PARCELLE') return 'Infiltration dans le sol';
    if (w === 'RUE') return 'Rejet dans la rue';
    if (w === 'RIVIERE_FLEUVE') return "Rejet dans un cours d'eau";
    return w || 'Infiltration dans le sol';
  });
  const [stagnantWaterNear, setStagnantWaterNear] = useState<string>(() => {
    if (typeof initialData?.stagnant_water_near === 'boolean') return initialData.stagnant_water_near ? 'Oui' : 'Non';
    return (initialData?.stagnant_water_near as string) || 'Non';
  });
  const [stagnantWaterLevel, setStagnantWaterLevel] = useState<string>(() => {
    const l = initialData?.stagnant_water_level;
    if (l === 'FAIBLE') return 'Faible';
    if (l === 'MODÉRÉ' || l === 'MODERE') return 'Modérée';
    if (l === 'IMPORTANT') return 'Importante';
    return l || 'Faible';
  });
  const [stagnantWaterDuration, setStagnantWaterDuration] = useState<string>(() => {
    const d = initialData?.stagnant_water_duration;
    if (d === 'TEMPORAIRE_PLUIE') return '<1 semaine';
    if (d === 'SAISONNIER') return '1–4 semaines';
    if (d === 'PERMANENT') return '>1 mois';
    return d || '<1 semaine';
  });

  // Step 6: Déchets
  const [wasteDisposalMethod, setWasteDisposalMethod] = useState<string>(() => {
    const m = initialData?.waste_disposal_method;
    if (m === 'POUBELLE_COLLECTEE') return 'Collecte organisée';
    if (m === 'FOSSE_BRULEE_ENTERREE') return 'Fosse';
    if (m === 'DECHARGE_SAUVAGE_RUE') return 'Dépôt sauvage';
    if (m === 'JET_RIVIERE_FLEUVE') return "Rejet dans un cours d'eau";
    return m || 'Fosse';
  });
  const [wasteNearHouse, setWasteNearHouse] = useState<string>(() => {
    if (typeof initialData?.waste_near_house === 'boolean') return initialData.waste_near_house ? 'Oui' : 'Non';
    return (initialData?.waste_near_house as string) || 'Non';
  });
  const [wasteDistance, setWasteDistance] = useState<string>(initialData?.waste_distance || '10–50 m');

  // Step 7: Paludisme & Moustiquaires
  const [bednetAvailable, setBednetAvailable] = useState<string>(() => {
    if (typeof initialData?.bednet_available === 'boolean') return initialData.bednet_available ? 'Oui' : 'Non';
    return (initialData?.bednet_available as string) || 'Oui';
  });
  const [bednetNumber, setBednetNumber] = useState<number>(initialData?.bednet_number ?? 2);
  const [bednetUsedLastNight, setBednetUsedLastNight] = useState<number>(initialData?.bednet_used_last_night ?? 3);
  const [stagnantWaterDistance, setStagnantWaterDistance] = useState<string>(initialData?.stagnant_water_distance || '10–50 m');
  const [vegetationDense, setVegetationDense] = useState<string>(() => {
    if (typeof initialData?.vegetation_dense === 'boolean') return initialData.vegetation_dense ? 'Oui' : 'Non';
    return (initialData?.vegetation_dense as string) || 'Non';
  });
  const [waterBodyNear, setWaterBodyNear] = useState<string>(() => {
    if (typeof initialData?.water_body_near === 'boolean') return initialData.water_body_near ? 'Oui' : 'Non';
    return (initialData?.water_body_near as string) || 'Non';
  });

  // Step 8: Direct Observation (Enquêteur)
  const [obsStagnantWater, setObsStagnantWater] = useState<string>(() => {
    if (initialData?.obs_stagnant_water) return initialData.obs_stagnant_water;
    if (typeof initialData?.direct_obs_stagnant_water === 'boolean') return initialData.direct_obs_stagnant_water ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsVisibleWaste, setObsVisibleWaste] = useState<string>(() => {
    if (initialData?.obs_visible_waste) return initialData.obs_visible_waste;
    if (typeof initialData?.direct_obs_visible_waste === 'boolean') return initialData.direct_obs_visible_waste ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsBlockedDrain, setObsBlockedDrain] = useState<string>(() => {
    if (initialData?.obs_blocked_drain) return initialData.obs_blocked_drain;
    if (typeof initialData?.direct_obs_clogged_gutter === 'boolean') return initialData.direct_obs_clogged_gutter ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsFlooding, setObsFlooding] = useState<string>(() => {
    if (initialData?.obs_flooding) return initialData.obs_flooding;
    if (typeof initialData?.direct_obs_flooding_sign === 'boolean') return initialData.direct_obs_flooding_sign ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsDenseVegetation, setObsDenseVegetation] = useState<string>(() => {
    if (initialData?.obs_dense_vegetation) return initialData.obs_dense_vegetation;
    if (typeof initialData?.direct_obs_dense_vegetation === 'boolean') return initialData.direct_obs_dense_vegetation ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsWaterBodyNear, setObsWaterBodyNear] = useState<string>(() => {
    if (initialData?.obs_water_body_near) return initialData.obs_water_body_near;
    if (typeof initialData?.direct_obs_nearby_stream === 'boolean') return initialData.direct_obs_nearby_stream ? 'Oui' : 'Non';
    return 'Non';
  });
  const [obsGeneralSanitation, setObsGeneralSanitation] = useState<string>(() => {
    if (initialData?.obs_general_sanitation) return initialData.obs_general_sanitation;
    const g = initialData?.general_sanitation_condition;
    if (g === 'BON') return 'Bon';
    if (g === 'MOYEN') return 'Moyen';
    if (g === 'MAUVAIS') return 'Mauvais';
    if (g === 'CRITIQUE') return 'Critique';
    return 'Moyen';
  });

  // Step 9: Photographie & Commentaires
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialData?.photo_url);
  const [enumeratorComment, setEnumeratorComment] = useState<string>(initialData?.enumerator_comment || initialData?.interviewer_notes || '');

  // Validation Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Geographic helpers
  const availableHealthAreas = useMemo(() => getHealthAreasByZone(zoneId), [zoneId]);
  const availableNeighborhoods = useMemo(() => getNeighborhoodsByHealthArea(healthAreaId), [healthAreaId]);
  const availableStreets = useMemo(() => getStreetsByNeighborhood(neighborhoodId), [neighborhoodId]);

  // Keep dependent lists in sync when parent changes
  const handleZoneChange = (newZone: string) => {
    setZoneId(newZone);
    const areas = getHealthAreasByZone(newZone);
    if (areas.length > 0) {
      setHealthAreaId(areas[0].id);
      const neighs = getNeighborhoodsByHealthArea(areas[0].id);
      if (neighs.length > 0) {
        setNeighborhoodId(neighs[0].id);
        const str = getStreetsByNeighborhood(neighs[0].id);
        setStreetName(str[0] || '');
      }
    }
  };

  const handleHealthAreaChange = (newArea: string) => {
    setHealthAreaId(newArea);
    const neighs = getNeighborhoodsByHealthArea(newArea);
    if (neighs.length > 0) {
      setNeighborhoodId(neighs[0].id);
      const str = getStreetsByNeighborhood(neighs[0].id);
      setStreetName(str[0] || '');
    }
  };

  const handleNeighborhoodChange = (newNeigh: string) => {
    setNeighborhoodId(newNeigh);
    const str = getStreetsByNeighborhood(newNeigh);
    if (str.length > 0) {
      setStreetName(str[0]);
      setIsCustomStreet(false);
    } else {
      setStreetName('');
      setIsCustomStreet(true);
    }
  };

  // Check for proximity duplicate whenever location changes
  useEffect(() => {
    if (!initialData && latitude && longitude) {
      const duplicate = findPotentialDuplicateHousehold(
        {
          id: surveyId,
          latitude,
          longitude,
          health_area_id: healthAreaId,
          neighborhood_id: neighborhoodId,
        },
        householdSurveys,
        25 // within 25 meters
      );

      if (duplicate) {
        setDetectedDuplicate(duplicate as HouseholdSurvey);
      } else {
        setDetectedDuplicate(null);
      }
    }
  }, [latitude, longitude, healthAreaId, neighborhoodId, initialData, surveyId, householdSurveys]);

  // Auto-Save into localStorage
  useEffect(() => {
    if (initialData) return;

    const draftData = {
      surveyId,
      zoneId,
      healthAreaId,
      neighborhoodId,
      streetName,
      latitude,
      longitude,
      gpsAccuracy,
      gpsJustification,
      duplicateJustification,
      surveyDate,
      surveyTime,
      enumeratorId,
      consentObtained,
      hhSize,
      childrenU5,
      children5To14,
      waterSource,
      waterSourceOther,
      waterNearby,
      waterCollectionTime,
      waterTreatmentFrequency,
      waterTreatmentMethods,
      waterTreatmentOther,
      waterStorageType,
      waterContainerClean,
      latrineAvailable,
      latrineType,
      latrineShared,
      latrineCondition,
      wastewaterDisposal,
      stagnantWaterNear,
      stagnantWaterLevel,
      stagnantWaterDuration,
      wasteDisposalMethod,
      wasteNearHouse,
      wasteDistance,
      bednetAvailable,
      bednetNumber,
      bednetUsedLastNight,
      stagnantWaterDistance,
      vegetationDense,
      waterBodyNear,
      obsStagnantWater,
      obsVisibleWaste,
      obsBlockedDrain,
      obsFlooding,
      obsDenseVegetation,
      obsWaterBodyNear,
      obsGeneralSanitation,
      photoUrl,
      enumeratorComment,
      savedAt: new Date().toISOString(),
    };

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        const now = new Date();
        setLastAutoSaveTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
      } catch (e) {}
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    initialData,
    surveyId,
    zoneId,
    healthAreaId,
    neighborhoodId,
    streetName,
    latitude,
    longitude,
    gpsAccuracy,
    gpsJustification,
    duplicateJustification,
    surveyDate,
    surveyTime,
    enumeratorId,
    consentObtained,
    hhSize,
    childrenU5,
    children5To14,
    waterSource,
    waterSourceOther,
    waterNearby,
    waterCollectionTime,
    waterTreatmentFrequency,
    waterTreatmentMethods,
    waterTreatmentOther,
    waterStorageType,
    waterContainerClean,
    latrineAvailable,
    latrineType,
    latrineShared,
    latrineCondition,
    wastewaterDisposal,
    stagnantWaterNear,
    stagnantWaterLevel,
    stagnantWaterDuration,
    wasteDisposalMethod,
    wasteNearHouse,
    wasteDistance,
    bednetAvailable,
    bednetNumber,
    bednetUsedLastNight,
    stagnantWaterDistance,
    vegetationDense,
    waterBodyNear,
    obsStagnantWater,
    obsVisibleWaste,
    obsBlockedDrain,
    obsFlooding,
    obsDenseVegetation,
    obsWaterBodyNear,
    obsGeneralSanitation,
    photoUrl,
    enumeratorComment,
  ]);

  // Check for stored draft on initial mount
  useEffect(() => {
    if (initialData) return;
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d && d.surveyId && d.surveyId !== surveyId) {
          setHasDraftRestored(true);
        }
      } catch (e) {}
    }
  }, [initialData, surveyId]);

  const restoreDraft = () => {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.surveyId) setSurveyId(d.surveyId);
      if (d.zoneId) setZoneId(d.zoneId);
      if (d.healthAreaId) setHealthAreaId(d.healthAreaId);
      if (d.neighborhoodId) setNeighborhoodId(d.neighborhoodId);
      if (d.streetName) setStreetName(d.streetName);
      if (d.latitude) setLatitude(d.latitude);
      if (d.longitude) setLongitude(d.longitude);
      if (d.gpsAccuracy) setGpsAccuracy(d.gpsAccuracy);
      if (d.gpsJustification) setGpsJustification(d.gpsJustification);
      if (d.duplicateJustification) setDuplicateJustification(d.duplicateJustification);
      if (d.hhSize) setHhSize(d.hhSize);
      if (d.childrenU5 !== undefined) setChildrenU5(d.childrenU5);
      if (d.children5To14 !== undefined) setChildren5To14(d.children5To14);
      if (d.waterSource) setWaterSource(d.waterSource);
      if (d.waterSourceOther) setWaterSourceOther(d.waterSourceOther);
      if (d.waterNearby) setWaterNearby(d.waterNearby);
      if (d.waterCollectionTime) setWaterCollectionTime(d.waterCollectionTime);
      if (d.waterTreatmentFrequency) setWaterTreatmentFrequency(d.waterTreatmentFrequency);
      if (d.waterTreatmentMethods) setWaterTreatmentMethods(d.waterTreatmentMethods);
      if (d.waterStorageType) setWaterStorageType(d.waterStorageType);
      if (d.latrineAvailable) setLatrineAvailable(d.latrineAvailable);
      if (d.latrineType) setLatrineType(d.latrineType);
      if (d.latrineShared) setLatrineShared(d.latrineShared);
      if (d.latrineCondition) setLatrineCondition(d.latrineCondition);
      if (d.wastewaterDisposal) setWastewaterDisposal(d.wastewaterDisposal);
      if (d.stagnantWaterNear) setStagnantWaterNear(d.stagnantWaterNear);
      if (d.stagnantWaterLevel) setStagnantWaterLevel(d.stagnantWaterLevel);
      if (d.stagnantWaterDuration) setStagnantWaterDuration(d.stagnantWaterDuration);
      if (d.wasteDisposalMethod) setWasteDisposalMethod(d.wasteDisposalMethod);
      if (d.wasteNearHouse) setWasteNearHouse(d.wasteNearHouse);
      if (d.wasteDistance) setWasteDistance(d.wasteDistance);
      if (d.bednetAvailable) setBednetAvailable(d.bednetAvailable);
      if (d.bednetNumber !== undefined) setBednetNumber(d.bednetNumber);
      if (d.bednetUsedLastNight !== undefined) setBednetUsedLastNight(d.bednetUsedLastNight);
      if (d.stagnantWaterDistance) setStagnantWaterDistance(d.stagnantWaterDistance);
      if (d.vegetationDense) setVegetationDense(d.vegetationDense);
      if (d.waterBodyNear) setWaterBodyNear(d.waterBodyNear);
      if (d.obsStagnantWater) setObsStagnantWater(d.obsStagnantWater);
      if (d.obsVisibleWaste) setObsVisibleWaste(d.obsVisibleWaste);
      if (d.obsBlockedDrain) setObsBlockedDrain(d.obsBlockedDrain);
      if (d.obsFlooding) setObsFlooding(d.obsFlooding);
      if (d.obsDenseVegetation) setObsDenseVegetation(d.obsDenseVegetation);
      if (d.obsWaterBodyNear) setObsWaterBodyNear(d.obsWaterBodyNear);
      if (d.obsGeneralSanitation) setObsGeneralSanitation(d.obsGeneralSanitation);
      if (d.photoUrl) setPhotoUrl(d.photoUrl);
      if (d.enumeratorComment) setEnumeratorComment(d.enumeratorComment);
      setHasDraftRestored(false);
    } catch (e) {}
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraftRestored(false);
  };

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!zoneId) errs.zoneId = 'La zone de santé est obligatoire.';
      if (!healthAreaId) errs.healthAreaId = "L'aire de santé est obligatoire.";
      if (!neighborhoodId) errs.neighborhoodId = 'Le quartier est obligatoire.';
      if (!streetName.trim()) errs.streetName = "L'avenue ou rue est obligatoire.";
      if (!consentObtained) errs.consentObtained = 'Le consentement préalable du ménage est obligatoire.';
      if (!latitude || !longitude) errs.gps = 'La position GPS du ménage est obligatoire.';
      if (gpsAccuracy > 20 && !gpsJustification.trim()) {
        errs.gpsAccuracy = 'Précision GPS > 20m : une justification écrite est obligatoire.';
      }
      if (detectedDuplicate && !duplicateJustification.trim()) {
        errs.duplicate = 'Doublon potentiel détecté : une justification est obligatoire pour continuer.';
      }
    }

    if (step === 2) {
      if (hhSize <= 0) errs.hhSize = 'La taille du ménage doit être strictement supérieure à 0.';
      if (childrenU5 < 0) errs.childrenU5 = 'Le nombre ne peut pas être négatif.';
      if (children5To14 < 0) errs.children5To14 = 'Le nombre ne peut pas être négatif.';
      if (childrenU5 + children5To14 > hhSize) {
        errs.demography = 'Incohérence : la somme des enfants (<5 ans et 5-14 ans) dépasse la taille totale du ménage.';
      }
    }

    if (step === 3) {
      if (!waterSource) errs.waterSource = "La principale source d'eau est obligatoire.";
      if (waterSource === 9 && !waterSourceOther.trim()) {
        errs.waterSourceOther = 'Veuillez préciser la source dans le champ autre.';
      }
    }

    if (step === 4) {
      if (!latrineAvailable) errs.latrineAvailable = "L'information sur la latrine est obligatoire.";
    }

    if (step === 5) {
      if (!wastewaterDisposal) errs.wastewaterDisposal = "Le mode d'évacuation des eaux usées est obligatoire.";
    }

    if (step === 6) {
      if (!wasteDisposalMethod) errs.wasteDisposalMethod = "Le mode d'élimination des ordures est obligatoire.";
    }

    if (step === 7) {
      if (bednetAvailable === 'Oui' && bednetNumber < 0) {
        errs.bednetNumber = 'Le nombre de moustiquaires ne peut pas être négatif.';
      }
      if (bednetUsedLastNight > hhSize) {
        errs.bednetUsage = 'Le nombre de dormeurs sous moustiquaire ne peut pas dépasser la taille totale du ménage.';
      }
    }

    if (step === 9) {
      if (enumeratorComment) {
        const piiCheck = checkForPII(enumeratorComment);
        if (piiCheck.hasPII) {
          errs.enumeratorComment = `Violation de protocole : ${piiCheck.reason}. Veuillez supprimer toute mention nominative.`;
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(10, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compile final survey object
  const buildSurveyRecord = (recordStatus: RecordStatus): HouseholdSurvey => {
    const now = new Date().toISOString();
    const sourceObj = WATER_SOURCE_CHOICES.find(w => w.code === waterSource);
    const sourceLabel = sourceObj ? sourceObj.label.split(' - ')[1] : 'Autre';

    const photoMeta = photoUrl
      ? {
          photo_id: `PHO-${surveyId}-${Date.now().toString().slice(-4)}`,
          household_id: surveyId,
          latitude,
          longitude,
          date: surveyDate,
          time: surveyTime,
          enumerator_id: enumeratorId,
        }
      : undefined;

    return {
      id: surveyId,
      household_id: surveyId,
      status: recordStatus,
      sync_status: isOffline ? 'PENDING' : 'SYNCED',
      isDemoData: false,

      // Localisation
      zone_id: zoneId,
      health_area_id: healthAreaId,
      neighborhood_id: neighborhoodId,
      street_name: streetName.trim(),

      // GPS
      latitude,
      longitude,
      gps_accuracy: gpsAccuracy,
      gps_date: surveyDate,
      gps_time: surveyTime,
      gps_justification: gpsAccuracy > 20 ? gpsJustification : undefined,
      duplicate_justification: detectedDuplicate ? duplicateJustification : undefined,

      // Date & Horodatage
      survey_date: surveyDate,
      survey_time: surveyTime,
      enumerator_id: enumeratorId,
      surveyor_id: enumeratorId,
      consent_obtained: consentObtained,

      // Démographie
      hh_size: Number(hhSize),
      children_u5: Number(childrenU5),
      children_5_14: Number(children5To14),
      adults_15plus: Number(adults15Plus),

      // Eau
      water_source: waterSource,
      water_source_label: sourceLabel,
      water_source_other: waterSource === 9 ? waterSourceOther : undefined,
      water_nearby: waterNearby,
      water_collection_time: waterNearby === 'NON' ? waterCollectionTime : '<5 minutes',
      water_treatment_frequency: waterTreatmentFrequency,
      water_treatment_method: waterTreatmentMethods.length > 0 ? waterTreatmentMethods : 'AUCUN',
      water_treatment_other: waterTreatmentMethods.includes('Autre') ? waterTreatmentOther : undefined,
      water_storage_type: waterStorageType,
      water_container_clean: waterContainerClean,

      // Assainissement
      latrine_available: latrineAvailable,
      latrine_type: latrineAvailable === 'Oui' ? latrineType : undefined,
      latrine_shared: latrineAvailable === 'Oui' ? latrineShared : undefined,
      latrine_condition: latrineAvailable === 'Oui' ? latrineCondition : undefined,

      // Eaux usées
      wastewater_disposal: wastewaterDisposal,
      stagnant_water_near: stagnantWaterNear,
      stagnant_water_level: stagnantWaterNear === 'Oui' ? stagnantWaterLevel : undefined,
      stagnant_water_duration: stagnantWaterNear === 'Oui' ? stagnantWaterDuration : undefined,

      // Déchets
      waste_disposal_method: wasteDisposalMethod,
      waste_near_house: wasteNearHouse,
      waste_distance: wasteNearHouse === 'Oui' ? (wasteDistance as WasteDistance) : undefined,

      // Exposition Paludisme
      bednet_available: bednetAvailable,
      bednet_number: bednetAvailable === 'Oui' ? Number(bednetNumber) : 0,
      bednet_used_last_night: Number(bednetUsedLastNight),
      stagnant_water_distance: stagnantWaterDistance,
      vegetation_dense: vegetationDense,
      water_body_near: waterBodyNear,

      // Observation Directe
      obs_stagnant_water: obsStagnantWater,
      obs_visible_waste: obsVisibleWaste,
      obs_blocked_drain: obsBlockedDrain,
      obs_flooding: obsFlooding,
      obs_dense_vegetation: obsDenseVegetation,
      obs_water_body_near: obsWaterBodyNear,
      obs_general_sanitation: obsGeneralSanitation,

      // Compatibility flags
      direct_obs_stagnant_water: obsStagnantWater === 'Oui',
      direct_obs_visible_waste: obsVisibleWaste === 'Oui',
      direct_obs_clogged_gutter: obsBlockedDrain === 'Oui',
      direct_obs_flooding_sign: obsFlooding === 'Oui',
      direct_obs_dense_vegetation: obsDenseVegetation === 'Oui',
      direct_obs_nearby_stream: obsWaterBodyNear === 'Oui',
      general_sanitation_condition: obsGeneralSanitation.toUpperCase(),

      // Photo & Commentaires
      photo_url: photoUrl,
      photo_id: photoMeta?.photo_id,
      photo_metadata: photoMeta,
      enumerator_comment: enumeratorComment.trim() || undefined,
      interviewer_notes: enumeratorComment.trim() || undefined,

      // Timestamps
      created_at: initialData?.created_at || initialData?.createdAt || now,
      updated_at: now,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };
  };

  const handleFinalSubmit = (asDraft: boolean = false) => {
    if (!asDraft) {
      for (let s = 1; s <= 9; s++) {
        if (!validateStep(s)) {
          setCurrentStep(s);
          return;
        }
      }
    }

    const targetStatus: RecordStatus = asDraft ? 'DRAFT' : 'SUBMITTED';
    const surveyRecord = buildSurveyRecord(targetStatus);

    if (initialData) {
      updateHouseholdSurvey(surveyRecord, asDraft ? 'Sauvegarde brouillon' : 'Soumission enquête terrain V1.1');
    } else {
      addHouseholdSurvey(surveyRecord);
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    onSaveSuccess(surveyRecord);
  };

  const stepTitles = [
    'Localisation',
    'Ménage',
    "Source d'eau",
    'Assainissement',
    'Eaux usées',
    'Déchets',
    'Paludisme',
    'Obs. Directe',
    'Photo & Notes',
    'Révision',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">
      {/* Draft Recovery Notification Banner */}
      {hasDraftRestored && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-lg">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">Brouillon d'enquête non sauvegardé récupéré</h4>
              <p className="text-xs text-amber-800">
                Une session précédente a été interrompue. Souhaitez-vous reprendre là où vous vous étiez arrêté ?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Reprendre l'enquête
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-medium transition"
            >
              Effacer le brouillon
            </button>
          </div>
        </div>
      )}

      {/* Top Header Card with Auto-Generated ID & Status */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-300 tracking-wider">
                {surveyId}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {initialData ? 'Modification enquête' : 'Nouvelle Enquête Ménage V1.1'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Formulaire de Collecte Ménage
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastAutoSaveTime && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sauvegardé à {lastAutoSaveTime}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleFinalSubmit(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>Brouillon</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            title="Fermer le formulaire"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-1 px-1">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep || validateStep(currentStep)) {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`flex flex-col items-center flex-1 py-1 px-1 rounded-lg transition text-center ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : isCompleted
                    ? 'text-slate-600 hover:bg-slate-50'
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition ${
                    isCurrent
                      ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span className="text-[11px] truncate max-w-[80px]">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Body Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: LOCALISATION GÉOGRAPHIQUE & HORODATAGE */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <span>Étape 1 : Localisation dépendante & Géoréférencement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez la zone de santé, l'aire, le quartier, puis capturez la position GPS de la parcelle.
              </p>
            </div>

            {/* Dependent Dropdowns: Zone -> Aire -> Quartier -> Avenue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Zone de Santé <span className="text-rose-500">*</span>
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => handleZoneChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {KINDU_HEALTH_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Aire de Santé <span className="text-rose-500">*</span>
                </label>
                <select
                  value={healthAreaId}
                  onChange={(e) => handleHealthAreaChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {availableHealthAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.commune})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Quartier <span className="text-rose-500">*</span>
                </label>
                <select
                  value={neighborhoodId}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {availableNeighborhoods.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Avenue / Rue <span className="text-rose-500">*</span>
                </label>
                {!isCustomStreet && availableStreets.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={streetName}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setIsCustomStreet(true);
                          setStreetName('');
                        } else {
                          setStreetName(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {availableStreets.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="__CUSTOM__">➕ Saisir une autre avenue...</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Avenue Lumumba, Rue des Marais..."
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    {availableStreets.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomStreet(false);
                          setStreetName(availableStreets[0]);
                        }}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition shrink-0"
                      >
                        Liste
                      </button>
                    )}
                  </div>
                )}
                {errors.streetName && <p className="text-xs text-rose-600 mt-1">{errors.streetName}</p>}
              </div>
            </div>

            {/* GPS Capture Widget with High Accuracy Checking */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Positionnement GPS du ménage (&lt;20m)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)} (±{gpsAccuracy}m)
                </span>
              </div>

              <GPSCaptureButton
                latitude={latitude}
                longitude={longitude}
                accuracy={gpsAccuracy}
                onCoordinatesCaptured={(lat, lng, acc) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  setGpsAccuracy(acc || 5.0);
                }}
              />

              {/* Accuracy > 20m warning */}
              {gpsAccuracy > 20 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Position GPS imprécise ({Math.round(gpsAccuracy)}m &gt; 20m)</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Le protocole recommande une précision inférieure à 20 mètres. Veuillez vous déplacer à ciel ouvert ou renseigner une justification obligatoire.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-950 mb-1">
                      Justification de la précision &gt; 20m <span className="text-rose-600">*</span> :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Couverture nuageuse dense / Canopée d'arbres / Fond de vallée"
                      value={gpsJustification}
                      onChange={(e) => setGpsJustification(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    {errors.gpsAccuracy && <p className="text-xs text-rose-600 mt-1">{errors.gpsAccuracy}</p>}
                  </div>
                </div>
              )}

              {/* Proximity Duplicate Warning */}
              {detectedDuplicate && (
                <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Un ménage similaire existe déjà à proximité : {detectedDuplicate.id}</span>
                    </div>
                    {onInspectDuplicate && (
                      <button
                        type="button"
                        onClick={() => onInspectDuplicate(detectedDuplicate.id)}
                        className="text-xs text-rose-800 font-bold underline hover:text-rose-950"
                      >
                        Consulter {detectedDuplicate.id}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-rose-800">
                    Des coordonnées très proches (&lt;25m) ont déjà été enregistrées dans le même quartier ({detectedDuplicate.street_name}). Pour éviter les doublons, veuillez justifier si ce ménage habite la même parcelle.
                  </p>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-950 mb-1">
                      Justification du ménage contigu / même parcelle <span className="text-rose-600">*</span> :
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Deuxième ménage locataire dans la même cour / Annexe distincte"
                      value={duplicateJustification}
                      onChange={(e) => setDuplicateJustification(e.target.value)}
                      className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                    {errors.duplicate && <p className="text-xs text-rose-600 mt-1">{errors.duplicate}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Date, Time, Enumerator & Consent */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Date de l'enquête <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={surveyDate}
                  onChange={(e) => setSurveyDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Heure de passage
                </label>
                <input
                  type="time"
                  value={surveyTime}
                  onChange={(e) => setSurveyTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enquêteur responsable
                </label>
                <div className="bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>{userSession.name}</span>
                  <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">{userSession.id}</span>
                </div>
              </div>
            </div>

            {/* Informed Consent Agreement */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
              <input
                type="checkbox"
                id="consent-check"
                checked={consentObtained}
                onChange={(e) => setConsentObtained(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="consent-check" className="text-xs text-emerald-950 leading-relaxed cursor-pointer">
                <strong>Consentement éclairé obtenu :</strong> Le représentant du ménage a été informé des objectifs universitaires de l'étude épidémiologique et a accepté de répondre aux questions en toute confidentialité.
              </label>
            </div>
            {errors.consentObtained && <p className="text-xs text-rose-600">{errors.consentObtained}</p>}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: CARACTÉRISTIQUES DU MÉNAGE */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                <span>Étape 2 : Caractéristiques démographiques du ménage</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ventilation de la taille du ménage par tranche d'âge pour l'évaluation des populations à risque.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Taille totale du ménage (hh_size) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={hhSize}
                  onChange={(e) => setHhSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Nombre total de résidents</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enfants &lt; 5 ans (children_u5) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={hhSize}
                  value={childrenU5}
                  onChange={(e) => setChildrenU5(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Population vulnérable paludisme</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Enfants de 5 à 14 ans (children_5_14) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={hhSize}
                  value={children5To14}
                  onChange={(e) => setChildren5To14(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-base font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Enfants d'âge scolaire</span>
              </div>
            </div>

            {/* Auto-Calculated Adults Panel */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                  Adultes de 15 ans et plus (adults_15plus)
                </span>
                <span className="text-xs text-emerald-800">
                  Calculé automatiquement : {hhSize} (Total) - {childrenU5} (&lt;5 ans) - {children5To14} (5-14 ans)
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-700 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                {adults15Plus}
              </div>
            </div>

            {errors.demography && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.demography}</span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SOURCE D'EAU & TRAITEMENT */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-teal-700" />
                <span>Étape 3 : Approvisionnement en eau potable & Traitement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Facteurs de risque hydrique pour la modélisation de la fièvre typhoïde.
              </p>
            </div>

            {/* Main Water Source Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Principale source d'eau potable du ménage <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WATER_SOURCE_CHOICES.map((opt) => (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setWaterSource(opt.code)}
                    className={`text-left p-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                      waterSource === opt.code
                        ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {waterSource === opt.code && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                ))}
              </div>
              {waterSource === 9 && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Préciser l'autre source d'eau :
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Eau minérale en bouteille, camion citerne privé..."
                    value={waterSourceOther}
                    onChange={(e) => setWaterSourceOther(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                  {errors.waterSourceOther && <p className="text-xs text-rose-600 mt-1">{errors.waterSourceOther}</p>}
                </div>
              )}
            </div>

            {/* Proximity & Collection Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  La source d'eau est-elle dans la parcelle ou à proximité immédiate ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['OUI', 'NON'] as const).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setWaterNearby(choice)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        waterNearby === choice
                          ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {choice === 'OUI' ? 'Oui' : 'Non'}
                    </button>
                  ))}
                </div>
              </div>

              {waterNearby === 'NON' && (
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Temps d'accès à l'eau (Aller-retour + Attente)
                  </label>
                  <select
                    value={waterCollectionTime}
                    onChange={(e) => setWaterCollectionTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    <option value="<5 minutes">&lt;5 minutes</option>
                    <option value="5–15 minutes">5–15 minutes</option>
                    <option value="16–30 minutes">16–30 minutes</option>
                    <option value=">30 minutes">&gt;30 minutes</option>
                    <option value="Ne sait pas">Ne sait pas</option>
                  </select>
                </div>
              )}
            </div>

            {/* Treatment Frequency & Methods */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Traitez-vous l'eau avant de la boire ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['Toujours', 'Souvent', 'Parfois', 'Jamais', 'Ne sait pas'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setWaterTreatmentFrequency(freq)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                        waterTreatmentFrequency === freq
                          ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {waterTreatmentFrequency !== 'Jamais' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Méthode(s) de traitement utilisée(s) :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {WATER_TREATMENT_METHODS.map((method) => {
                      const isSelected = waterTreatmentMethods.includes(method);
                      return (
                        <label
                          key={method}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition ${
                            isSelected
                              ? 'bg-teal-50 border-teal-400 text-teal-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setWaterTreatmentMethods([...waterTreatmentMethods, method]);
                              } else {
                                setWaterTreatmentMethods(waterTreatmentMethods.filter(m => m !== method));
                              }
                            }}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>{method}</span>
                        </label>
                      );
                    })}
                  </div>
                  {waterTreatmentMethods.includes('Autre') && (
                    <input
                      type="text"
                      placeholder="Préciser l'autre méthode..."
                      value={waterTreatmentOther}
                      onChange={(e) => setWaterTreatmentOther(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 mt-2"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Storage Type & Container Cleanliness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Type de récipient de stockage de l'eau
                </label>
                <select
                  value={waterStorageType}
                  onChange={(e) => setWaterStorageType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="Récipient fermé">Récipient fermé (Bidon avec bouchon)</option>
                  <option value="Récipient couvert">Récipient couvert (Fût avec couvercle)</option>
                  <option value="Récipient ouvert">Récipient ouvert (Seau/bassine non couvert)</option>
                  <option value="Autre">Autre récipient</option>
                  <option value="Ne sait pas">Ne sait pas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Le récipient est-il propre et protégé ?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWaterContainerClean(opt)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                        waterContainerClean === opt
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: ASSAINISSEMENT */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-700" />
                <span>Étape 4 : Assainissement & Installations Sanitaires</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Disponibilité de latrines, type d'infrastructure et partage avec d'autres ménages.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Le ménage dispose-t-il d'une latrine / toilette ? <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLatrineAvailable(opt)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition ${
                      latrineAvailable === opt
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {latrineAvailable === 'Oui' ? (
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1.5">
                      Type de latrine
                    </label>
                    <select
                      value={latrineType}
                      onChange={(e) => setLatrineType(e.target.value)}
                      className="w-full bg-white border border-indigo-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    >
                      <option value="traditionnelle">Traditionnelle (Fosse sans dalle)</option>
                      <option value="améliorée">Améliorée (Dalle lavable / VIP)</option>
                      <option value="toilette avec chasse">Toilette avec chasse (Manuelle / Eau)</option>
                      <option value="autre">Autre type</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1.5">
                      Latrine partagée avec d'autres ?
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setLatrineShared(opt)}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border transition ${
                            latrineShared === opt
                              ? 'bg-indigo-700 text-white border-indigo-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1.5">
                      État général
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Bonne', 'Moyenne', 'Mauvaise'].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setLatrineCondition(cond)}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border transition ${
                            latrineCondition === cond
                              ? 'bg-indigo-700 text-white border-indigo-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-100 text-slate-600 rounded-xl text-xs">
                ℹ️ Aucune latrine disponible pour ce ménage.
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: EAUX USÉES & STAGNATION */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-700" />
                <span>Étape 5 : Évacuation des eaux usées & Stagnation</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Environnement immédiat propice aux gîtes larvaires d'anophèles.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Mode d'évacuation des eaux usées ménagères <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Canalisation',
                  'Caniveau',
                  'Infiltration dans le sol',
                  'Rejet dans la rue',
                  "Rejet dans un cours d'eau",
                  'Autre',
                  'Ne sait pas',
                ].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setWastewaterDisposal(mode)}
                    className={`text-left p-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                      wastewaterDisposal === mode
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>{mode}</span>
                    {wastewaterDisposal === mode && <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Présence d'eau stagnante à proximité (&lt;50m) ?
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStagnantWaterNear(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        stagnantWaterNear === opt
                          ? 'bg-cyan-700 text-white border-cyan-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {stagnantWaterNear === 'Oui' && (
                <div className="bg-cyan-50/60 border border-cyan-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-cyan-950 mb-1.5">
                      Niveau / Volume d'eau
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Faible', 'Modérée', 'Importante'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setStagnantWaterLevel(lvl)}
                          className={`py-2 px-2 rounded-lg text-xs font-bold border transition ${
                            stagnantWaterLevel === lvl
                              ? 'bg-cyan-700 text-white border-cyan-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-950 mb-1.5">
                      Durée habituelle
                    </label>
                    <select
                      value={stagnantWaterDuration}
                      onChange={(e) => setStagnantWaterDuration(e.target.value)}
                      className="w-full bg-white border border-cyan-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                    >
                      <option value="<1 semaine">&lt;1 semaine (Temporaire)</option>
                      <option value="1–4 semaines">1–4 semaines (Saisonnier)</option>
                      <option value=">1 mois">&gt;1 mois (Permanent)</option>
                      <option value="Inconnue">Inconnue</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 6: DÉCHETS */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-amber-700" />
                <span>Étape 6 : Gestion & Élimination des Ordures Ménagères</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Facteurs d'insalubrité urbaine et dépôts sauvages.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Principal mode d'élimination des ordures <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Collecte organisée',
                  'Dépôt contrôlé',
                  'Fosse',
                  'Enfouissement',
                  'Brûlage',
                  'Dépôt sauvage',
                  'Autre',
                  'Ne sait pas',
                ].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setWasteDisposalMethod(method)}
                    className={`text-left p-3 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                      wasteDisposalMethod === method
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span>{method}</span>
                    {wasteDisposalMethod === method && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Présence d'un dépôt d'ordures proche de la maison ?
                </label>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWasteNearHouse(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        wasteNearHouse === opt
                          ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {wasteNearHouse === 'Oui' && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-amber-950 mb-1.5">
                    Distance approximative du dépôt
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['<10 m', '10–50 m', '51–100 m', '>100 m', 'Inconnue'].map((dist) => (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setWasteDistance(dist)}
                        className={`py-2 px-2 rounded-lg text-xs font-bold border transition text-center ${
                          wasteDistance === dist
                            ? 'bg-amber-700 text-white border-amber-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {dist}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 7: PALUDISME & MOUSTIQUAIRES */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-700" />
                <span>Étape 7 : Exposition & Prévention du Paludisme</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Couverture en MILD (Moustiquaires imprégnées) et proximité des habitats d'anophèles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Le ménage possède-t-il des MILD ?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBednetAvailable(opt)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition ${
                        bednetAvailable === opt
                          ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {bednetAvailable === 'Oui' && (
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Nombre de moustiquaires
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={bednetNumber}
                    onChange={(e) => setBednetNumber(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Dormeurs sous MILD la nuit passée <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={hhSize}
                  value={bednetUsedLastNight}
                  onChange={(e) => setBednetUsedLastNight(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Max : {hhSize} personnes</span>
              </div>
            </div>

            {errors.bednetUsage && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errors.bednetUsage}</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Distance estimée du point d'eau stagnante le plus proche
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['<10 m', '10–50 m', '51–100 m', '>100 m', 'Inconnue'].map((dist) => (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => setStagnantWaterDistance(dist)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition text-center ${
                        stagnantWaterDistance === dist
                          ? 'bg-rose-700 text-white border-rose-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Végétation dense autour de l'habitation (&lt;20m) ?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setVegetationDense(opt)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                          vegetationDense === opt
                            ? 'bg-rose-700 text-white border-rose-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">
                    Présence d'un cours d'eau / fleuve (&lt;100m) ?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Oui', 'Non', 'Ne sait pas'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWaterBodyNear(opt)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                          waterBodyNear === opt
                            ? 'bg-rose-700 text-white border-rose-700'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 8: OBSERVATION DIRECTE DE L'ENQUÊTEUR */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wide">
                <Eye className="w-5 h-5 text-amber-700 shrink-0" />
                <span>OBSERVATION DIRECTE DE L'ENQUÊTEUR (SUR PLACE)</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong>Règle méthodologique absolue :</strong> Ne pas mélanger les déclarations du ménage avec les observations directes constatées de vos propres yeux. Si un élément n'est pas observable, cochez explicitement <code className="font-mono bg-amber-200/60 px-1 py-0.5 rounded text-amber-950">Non observable</code> (ne jamais convertir une donnée manquante en « Non »).
              </p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'obsStagnantWater', label: "Présence visible d'eau stagnante dans ou devant la parcelle", value: obsStagnantWater, setter: setObsStagnantWater },
                { id: 'obsVisibleWaste', label: 'Présence visible de déchets / dépotoir sauvage non contrôlé', value: obsVisibleWaste, setter: setObsVisibleWaste },
                { id: 'obsBlockedDrain', label: 'Caniveau bouché, obstrué ou eau noire stagnante à vue', value: obsBlockedDrain, setter: setObsBlockedDrain },
                { id: 'obsFlooding', label: "Traces visibles d'inondation récente ou sol gorgé d'eau", value: obsFlooding, setter: setObsFlooding },
                { id: 'obsDenseVegetation', label: 'Végétation dense / hautes herbes non débroussaillées', value: obsDenseVegetation, setter: setObsDenseVegetation },
                { id: 'obsWaterBodyNear', label: "Cours d'eau ou lit d'écoulement visible à proximité immédiate", value: obsWaterBodyNear, setter: setObsWaterBodyNear },
              ].map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-800 max-w-md">{item.label}</span>
                  <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
                    {['Oui', 'Non', 'Non observable'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => item.setter(opt)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition ${
                          item.value === opt
                            ? opt === 'Oui'
                              ? 'bg-rose-700 text-white border-rose-700'
                              : opt === 'Non'
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-slate-700 text-white border-slate-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Appréciation globale de la salubrité immédiate de la parcelle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['Bon', 'Moyen', 'Mauvais', 'Critique', 'Non observable'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setObsGeneralSanitation(g)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition ${
                        obsGeneralSanitation === g
                          ? g === 'Bon'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : g === 'Moyen'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : g === 'Mauvais' || g === 'Critique'
                            ? 'bg-rose-700 text-white border-rose-700'
                            : 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 9: PHOTOGRAPHIE & COMMENTAIRES */}
        {/* ========================================================================= */}
        {currentStep === 9 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-700" />
                <span>Étape 9 : Photographie environnementale & Notes de terrain</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Capture visuelle du cadre environnemental et observations complémentaires de l'enquêteur.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-700" />
                <span>Photographie de l'environnement de la parcelle (Optionnelle)</span>
              </label>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Règle éthique :</strong> Ne pas photographier les visages de personnes sans consentement. Cadrer sur les facteurs environnementaux (latrine, évacuation, récipient d'eau, caniveau).
                </span>
              </div>

              <PhotoCapture
                photoUrl={photoUrl}
                onPhotoChange={setPhotoUrl}
                label="Photo de la parcelle / latrine / eau"
              />

              {photoUrl && (
                <div className="text-[11px] text-slate-500 font-mono bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                  <div>📷 <strong>Métadonnées rattachées :</strong></div>
                  <div>ID Ménage : {surveyId} • GPS : {latitude.toFixed(6)}, {longitude.toFixed(6)}</div>
                  <div>Date & Heure : {surveyDate} {surveyTime} • Enquêteur : {userSession.name}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
                <span>Commentaires libres de l'enquêteur</span>
                <span className="text-[10px] text-slate-400 font-normal">Sans nom de personne</span>
              </label>
              <textarea
                rows={4}
                placeholder="Remarques particulières de terrain, difficultés d'accès, contexte de la parcelle..."
                value={enumeratorComment}
                onChange={(e) => setEnumeratorComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
              {errors.enumeratorComment && (
                <p className="text-xs text-rose-600 mt-1">{errors.enumeratorComment}</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 10: RÉVISION & VÉRIFICATION DE L'ENQUÊTE */}
        {/* ========================================================================= */}
        {currentStep === 10 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <span>Étape 10 : VÉRIFICATION DE L'ENQUÊTE & SYNTHÈSE</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Veuillez relire attentivement l'ensemble des données recueillies avant la soumission définitive.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Block 1: Localisation */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700" /> Localisation & GPS
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Zone :</strong> {zoneId}</div>
                  <div><strong>Aire de santé :</strong> {healthAreaId}</div>
                  <div><strong>Quartier :</strong> {neighborhoodId}</div>
                  <div><strong>Avenue :</strong> {streetName}</div>
                  <div><strong>GPS :</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)} (±{gpsAccuracy}m)</div>
                </div>
              </div>

              {/* Block 2: Démographie */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" /> Démographie
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Taille totale :</strong> {hhSize} personnes</div>
                  <div><strong>Moins de 5 ans :</strong> {childrenU5}</div>
                  <div><strong>5 à 14 ans :</strong> {children5To14}</div>
                  <div><strong>15 ans et plus :</strong> {adults15Plus}</div>
                </div>
              </div>

              {/* Block 3: Eau */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-teal-700" /> Eau potable
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Source :</strong> {WATER_SOURCE_CHOICES.find(w => w.code === waterSource)?.label}</div>
                  <div><strong>Dans parcelle :</strong> {waterNearby}</div>
                  <div><strong>Traitement :</strong> {waterTreatmentFrequency} ({waterTreatmentMethods.join(', ') || 'Aucun'})</div>
                  <div><strong>Stockage :</strong> {waterStorageType}</div>
                </div>
              </div>

              {/* Block 4: Assainissement & Déchets */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-indigo-700" /> Assainissement & Déchets
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Latrine :</strong> {latrineAvailable} {latrineAvailable === 'Oui' ? `(${latrineType}, État ${latrineCondition})` : ''}</div>
                  <div><strong>Eaux usées :</strong> {wastewaterDisposal}</div>
                  <div><strong>Ordures :</strong> {wasteDisposalMethod}</div>
                  <div><strong>Eau stagnante :</strong> {stagnantWaterNear}</div>
                </div>
              </div>

              {/* Block 5: Paludisme */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-rose-700" /> Moustiquaires & Paludisme
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(7)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Moustiquaires (MILD) :</strong> {bednetAvailable} {bednetAvailable === 'Oui' ? `(${bednetNumber} possédées)` : ''}</div>
                  <div><strong>Utilisation nuit passée :</strong> {bednetUsedLastNight} / {hhSize} personnes</div>
                  <div><strong>Distance eau stagnante :</strong> {stagnantWaterDistance}</div>
                  <div><strong>Végétation dense :</strong> {vegetationDense}</div>
                </div>
              </div>

              {/* Block 6: Direct Observation */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-700" /> Observation Directe
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(8)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    ✏️ Modifier
                  </button>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Eau stagnante visible :</strong> {obsStagnantWater}</div>
                  <div><strong>Déchets visibles :</strong> {obsVisibleWaste}</div>
                  <div><strong>Caniveau bouché :</strong> {obsBlockedDrain}</div>
                  <div><strong>Salubrité globale :</strong> {obsGeneralSanitation}</div>
                  {photoUrl && <div className="text-emerald-700 font-semibold">📷 1 photo jointe</div>}
                </div>
              </div>
            </div>

            {/* Offline Status indicator */}
            {isOffline && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-800">
                ⚡ <strong>Mode Hors-ligne actif :</strong> Cette enquête sera enregistrée localement dans votre terminal et placée dans la file d'attente de synchronisation automatique dès le retour du réseau.
              </div>
            )}
          </div>
        )}

        {/* Bottom Wizard Navigation Buttons */}
        <div className="border-t border-slate-200 pt-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition"
              >
                Annuler
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFinalSubmit(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-300 transition"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Enregistrer Brouillon</span>
            </button>

            {currentStep < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-xs focus:ring-2 focus:ring-emerald-500"
              >
                <span>Suivant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinalSubmit(false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-black rounded-xl text-xs transition shadow-md focus:ring-2 focus:ring-emerald-500"
              >
                <Send className="w-4 h-4" />
                <span>ENREGISTRER L'ENQUÊTE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
