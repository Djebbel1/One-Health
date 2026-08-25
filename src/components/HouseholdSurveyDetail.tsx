import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Droplets,
  Shield,
  Trash2,
  Bug,
  Eye,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Edit3,
  Download,
  Share2,
  Calendar,
  Clock,
  User,
  Check,
  X,
  Lock,
  Sparkles,
  Layers
} from 'lucide-react';
import { HouseholdSurvey, RecordStatus } from '../types';
import { useData } from '../context/DataContext';
import { exportToCSV } from '../utils/exportUtils';

interface HouseholdSurveyDetailProps {
  survey: HouseholdSurvey;
  onBack: () => void;
  onEdit: (survey: HouseholdSurvey) => void;
}

export const HouseholdSurveyDetail: React.FC<HouseholdSurveyDetailProps> = ({
  survey,
  onBack,
  onEdit,
}) => {
  const { updateHouseholdSurvey, userSession } = useData();
  const [currentStatus, setCurrentStatus] = useState<RecordStatus>(survey.status);
  const [statusChangeNote, setStatusChangeNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleUpdateStatus = (newStatus: RecordStatus) => {
    const updated: HouseholdSurvey = {
      ...survey,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    updateHouseholdSurvey(updated, `Changement statut vers ${newStatus}: ${statusChangeNote}`);
    setCurrentStatus(newStatus);
    setShowStatusModal(false);
  };

  const handleExportSingle = () => {
    exportToCSV([survey], `enquete_${survey.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-emerald-300">
                {survey.id}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {survey.health_area_id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Fiche Enquête Ménage Détaillée
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge & Workflow */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusModal(!showStatusModal)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Statut: {currentStatus}</span>
            </button>

            {showStatusModal && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-20 space-y-1 text-xs animate-in fade-in zoom-in-95">
                <div className="font-bold text-slate-700 px-2 py-1 border-b border-slate-100">
                  Modifier le statut
                </div>
                {(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VALIDATED', 'REJECTED', 'CORRECTED'] as RecordStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(st)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition flex items-center justify-between ${
                      currentStatus === st
                        ? 'bg-slate-900 text-white font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{st}</span>
                    {currentStatus === st && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>


          <button
            type="button"
            onClick={() => onEdit(survey)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>

          <button
            type="button"
            onClick={handleExportSingle}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Grid of 10 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Localisation & GPS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>1. Localisation & Géoréférencement</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Zone de santé</span>
              <span className="font-semibold text-slate-800">{survey.zone_id || 'ZS_KINDU'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Aire de santé</span>
              <span className="font-semibold text-slate-800">{survey.health_area_id}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Quartier</span>
              <span className="font-semibold text-slate-800">{survey.neighborhood_id}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Avenue / Rue</span>
              <span className="font-semibold text-slate-800">{survey.street_name || 'Non précisé'}</span>
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">
                {survey.latitude?.toFixed(6)}, {survey.longitude?.toFixed(6)}
              </div>
              <div className="text-[11px] text-slate-500">
                Précision: ±{survey.gps_accuracy || 5} m • {survey.gps_date || survey.survey_date}
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-sans font-bold rounded-md">
              Kindu validé
            </span>
          </div>
          {survey.gps_justification && (
            <div className="text-[11px] bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
              <strong>Justification GPS :</strong> {survey.gps_justification}
            </div>
          )}
          {survey.duplicate_justification && (
            <div className="text-[11px] bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-rose-900">
              <strong>Justification ménage contigu :</strong> {survey.duplicate_justification}
            </div>
          )}
        </div>

        {/* 2. Démographie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>2. Caractéristiques Démographiques</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 block text-[11px]">Taille totale (hh_size)</span>
              <span className="text-xl font-black text-emerald-950">{survey.hh_size} pers.</span>
            </div>
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
              <span className="text-rose-800 block text-[11px]">Enfants &lt; 5 ans</span>
              <span className="text-xl font-black text-rose-950">{survey.children_u5} enfants</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Enfants 5 à 14 ans</span>
              <span className="text-base font-bold text-slate-900">{survey.children_5_14 ?? 0} enfants</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Adultes 15+ ans</span>
              <span className="text-base font-bold text-slate-900">
                {survey.adults_15plus ?? Math.max(0, survey.hh_size - (survey.children_u5 || 0) - (survey.children_5_14 || 0))} adultes
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            <strong>Consentement éclairé :</strong> {survey.consent_obtained ? '✅ Attesté et validé' : '❌ Non attesté'}
          </div>
        </div>

        {/* 3. Eau */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Droplets className="w-4 h-4 text-teal-700" />
            <span>3. Eau potable & Traitement</span>
          </h3>
          <div className="text-xs space-y-2 text-slate-700">
            <div>
              <span className="text-slate-400 block">Source principale d'eau</span>
              <span className="font-bold text-slate-900">{survey.water_source_label || `Code ${survey.water_source}`}</span>
              {survey.water_source_other && <span className="text-slate-500 block">({survey.water_source_other})</span>}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block">Dans parcelle / Proche</span>
                <span className="font-semibold">{String(survey.water_nearby)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Temps d'accès</span>
                <span className="font-semibold">{String(survey.water_collection_time || '<5 min')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block">Traitement</span>
                <span className="font-semibold">{survey.water_treatment_frequency || 'Jamais'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Stockage</span>
                <span className="font-semibold">{survey.water_storage_type || 'Récipient fermé'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Assainissement & Déchets */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield className="w-4 h-4 text-indigo-700" />
            <span>4. Assainissement & Gestion des Déchets</span>
          </h3>
          <div className="text-xs space-y-2 text-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block">Latrine disponible</span>
                <span className="font-bold text-slate-900">{String(survey.latrine_available)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Type de latrine</span>
                <span className="font-semibold">{survey.latrine_type || 'N/A'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-slate-400 block">Évacuation eaux usées</span>
                <span className="font-semibold">{survey.wastewater_disposal || 'Infiltration'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gestion ordures</span>
                <span className="font-semibold">{survey.waste_disposal_method || 'Fosse'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Paludisme & Moustiquaires */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Bug className="w-4 h-4 text-rose-700" />
            <span>5. Prévention Paludisme & Moustiquaires</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
              <span className="text-rose-800 block text-[11px]">Dormeurs sous MILD</span>
              <span className="text-lg font-black text-rose-950">
                {survey.bednet_used_last_night ?? 0} / {survey.hh_size}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Moustiquaires possédées</span>
              <span className="text-lg font-black text-slate-900">{survey.bednet_number ?? 0} MILD</span>
            </div>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>Distance eau stagnante : <strong>{survey.stagnant_water_distance || '10–50 m'}</strong></div>
            <div>Végétation dense : <strong>{String(survey.vegetation_dense || 'Non')}</strong></div>
          </div>
        </div>

        {/* 6. Observation Directe */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Eye className="w-4 h-4 text-amber-700" />
            <span>6. Observation Directe Enquêteur</span>
          </h3>
          <div className="text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Eau stagnante visible :</span>
              <strong className="text-slate-900">{survey.obs_stagnant_water || (survey.direct_obs_stagnant_water ? 'Oui' : 'Non')}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Déchets visibles :</span>
              <strong className="text-slate-900">{survey.obs_visible_waste || (survey.direct_obs_visible_waste ? 'Oui' : 'Non')}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Caniveau bouché :</span>
              <strong className="text-slate-900">{survey.obs_blocked_drain || (survey.direct_obs_clogged_gutter ? 'Oui' : 'Non')}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Salubrité générale :</span>
              <strong className="text-slate-900">{survey.obs_general_sanitation || survey.general_sanitation_condition || 'Moyen'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Photo & Free Comments Section */}
      {(survey.photo_url || survey.enumerator_comment || survey.interviewer_notes) && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Camera className="w-4 h-4 text-teal-700" />
            <span>Photographie & Commentaires de Terrain</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {survey.photo_url ? (
              <div className="space-y-2">
                <img
                  src={survey.photo_url}
                  alt={`Enquête ${survey.id}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover rounded-xl border border-slate-200 shadow-xs"
                />
                <div className="text-[11px] text-slate-500 font-mono">
                  📷 {survey.photo_id || 'Photo terrain rattachée'}
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 mb-2 opacity-40" />
                <span>Aucune photo capturée pour ce ménage</span>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Notes d'observation de l'enquêteur</span>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed min-h-[140px] italic">
                "{survey.enumerator_comment || survey.interviewer_notes || 'Aucun commentaire textuel complémentaire.'}"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
