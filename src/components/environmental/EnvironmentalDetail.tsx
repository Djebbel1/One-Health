import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  ShieldAlert,
  User,
  ExternalLink,
  Edit,
  Trash2,
  Layers,
  Droplets,
  Home
} from 'lucide-react';
import { EnvironmentalObservation, RecordStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface EnvironmentalDetailProps {
  observation: EnvironmentalObservation;
  onBack: () => void;
  onEdit: (obs: EnvironmentalObservation) => void;
  onOpenRejectModal: (obs: EnvironmentalObservation) => void;
}

export const EnvironmentalDetail: React.FC<EnvironmentalDetailProps> = ({
  observation,
  onBack,
  onEdit,
  onOpenRejectModal
}) => {
  const { userSession, updateRecordStatus, householdSurveys } = useData();
  const isSupervisorOrAdmin = userSession.role === 'SUPERVISEUR' || userSession.role === 'ADMIN';

  const linkedHousehold = observation.household_id
    ? householdSurveys.find(h => h.id === observation.household_id || h.household_id === observation.household_id)
    : null;

  const handleValidate = () => {
    updateRecordStatus(
      'ENVIRONMENTAL',
      observation.id,
      'VALIDATED',
      `Validé scientifiquement par ${userSession.name || 'Superviseur'}`
    );
  };

  const handleSetUnderReview = () => {
    updateRecordStatus(
      'ENVIRONMENTAL',
      observation.id,
      'UNDER_REVIEW',
      `Mis en révision par ${userSession.name || 'Superviseur'}`
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 font-mono text-xs font-bold border border-teal-200">
                {observation.id}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Détail de l'observation environnementale
              </h2>
              {/* Status Badge */}
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  observation.status === 'VALIDATED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : observation.status === 'REJECTED'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : observation.status === 'UNDER_REVIEW'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : observation.status === 'SUBMITTED'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {observation.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Collecté par {observation.surveyor_id || 'Enquêteur'} le {observation.observation_date} à {observation.observation_time || 'N/A'}
            </p>
          </div>
        </div>

        {/* Supervisor Action Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(observation)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Modifier</span>
          </button>

          {isSupervisorOrAdmin && (
            <>
              {observation.status !== 'VALIDATED' && (
                <button
                  type="button"
                  onClick={handleValidate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Valider</span>
                </button>
              )}

              {observation.status !== 'UNDER_REVIEW' && observation.status !== 'VALIDATED' && (
                <button
                  type="button"
                  onClick={handleSetUnderReview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Mettre en révision</span>
                </button>
              )}

              {observation.status !== 'REJECTED' && (
                <button
                  type="button"
                  onClick={() => onOpenRejectModal(observation)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Rejeter</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rejection notice if rejected */}
      {observation.status === 'REJECTED' && observation.rejection_reason && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl text-xs space-y-1">
          <div className="font-bold text-rose-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-700" />
            <span>Observation Rejetée par le superviseur ({observation.rejected_by || 'Superviseur'} - {observation.rejected_at ? new Date(observation.rejected_at).toLocaleString('fr-FR') : 'N/A'})</span>
          </div>
          <p className="text-rose-800 font-medium">Motif : {observation.rejection_reason}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Data details */}
        <div className="md:col-span-2 space-y-6">
          {/* Facteur Principal Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Facteur environnemental : {observation.factor_type}</span>
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-md bg-teal-50 text-teal-900 font-semibold border border-teal-200">
                Présence : {observation.presence || 'Oui'}
              </span>
            </div>

            {/* Scientific Notice for Water Point */}
            {observation.factor_type === 'POINT_EAU' && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Règle de rigueur scientifique :</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  L'application ne déclare pas qu'une source est « potable » sur la base de la simple observation visuelle.
                </p>
                <div className="pt-1 font-bold text-slate-900">
                  Qualité microbiologique : <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">NON ANALYSÉE</span>
                </div>
              </div>
            )}

            {/* Scientific Notice for Stagnant Water / Vectors */}
            {observation.factor_type === 'EAU_STAGNANTE' && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-950">
                ⚠️ <strong>Protocole scientifique :</strong> Les catégories renseignées décrivent l'observation factuelle. Elles ne doivent pas être interprétées automatiquement comme preuve de présence de moustiques ou de transmission active.
              </div>
            )}

            {/* Specific Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              {observation.stagnant_extent && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Étendue</span>
                  <strong className="text-slate-800">{observation.stagnant_extent}</strong>
                </div>
              )}
              {observation.stagnant_duration && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Durée estimée</span>
                  <strong className="text-slate-800">{observation.stagnant_duration}</strong>
                </div>
              )}
              {observation.stagnant_origin && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Origine</span>
                  <strong className="text-slate-800">{observation.stagnant_origin}</strong>
                </div>
              )}
              {observation.housing_proximity && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Proximité habitations</span>
                  <strong className="text-slate-800">{observation.housing_proximity}</strong>
                </div>
              )}
              {observation.waste_type && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Type de déchets</span>
                  <strong className="text-slate-800">{observation.waste_type}</strong>
                </div>
              )}
              {observation.waste_extent && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Étendue dépotoir</span>
                  <strong className="text-slate-800">{observation.waste_extent}</strong>
                </div>
              )}
              {observation.waste_housing_distance && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Distance habitations</span>
                  <strong className="text-slate-800">{observation.waste_housing_distance}</strong>
                </div>
              )}
              {observation.gutter_condition && (
                <div>
                  <span className="text-slate-500 block text-[11px]">État caniveau</span>
                  <strong className="text-slate-800">{observation.gutter_condition}</strong>
                </div>
              )}
              {observation.wastewater_flow_type && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Écoulement eaux usées</span>
                  <strong className="text-slate-800">{observation.wastewater_flow_type}</strong>
                </div>
              )}
              {observation.water_point_type && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Type de point d'eau</span>
                  <strong className="text-slate-800">{observation.water_point_type}</strong>
                </div>
              )}
              {observation.water_point_protection && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Protection</span>
                  <strong className="text-slate-800">{observation.water_point_protection}</strong>
                </div>
              )}
              {observation.watercourse_name && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Cours d'eau</span>
                  <strong className="text-slate-800">{observation.watercourse_name}</strong>
                </div>
              )}
              {observation.vegetation_density && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Densité végétation</span>
                  <strong className="text-slate-800">{observation.vegetation_density}</strong>
                </div>
              )}
              {observation.larval_presence !== undefined && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Larves visibles</span>
                  <strong className="text-slate-800">{observation.larval_presence ? 'Oui' : 'Non'}</strong>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Description factuelle :</span>
              <div className="text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                {observation.description || 'Aucune description saisie.'}
              </div>
            </div>

            {/* Enumerator Comments */}
            {observation.enumerator_comment && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Commentaires enquêteur :</span>
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 italic">
                  « {observation.enumerator_comment} »
                </div>
              </div>
            )}
          </div>

          {/* Temporal Dimension & Historical Protection */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Dimension temporelle & Traçabilité</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Date d'observation</span>
                <strong className="text-slate-900">{observation.observation_date}</strong>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Statut temporel</span>
                <strong className="text-slate-900">{observation.historical_status || 'CURRENT'}</strong>
              </div>

              {observation.historical_source && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Source historique</span>
                  <strong className="text-slate-900">{observation.historical_source}</strong>
                </div>
              )}

              {observation.validity_start && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Période de validité</span>
                  <span className="text-slate-800">
                    {observation.validity_start} {observation.validity_end ? `au ${observation.validity_end}` : '(En cours)'}
                  </span>
                </div>
              )}
            </div>

            {observation.historical_status === 'CURRENT' && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-[11px] text-emerald-950">
                <strong>Protection temporelle :</strong> Donnée descriptive de la situation contemporaine. Ne doit pas être rétro-appliquée aux années antérieures.
              </div>
            )}

            {observation.historical_status === 'HISTORICAL_REPORTED_UNVERIFIED' && (
              <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-lg text-[11px] text-amber-950 font-medium">
                ⚠️ Donnée historique rapportée non vérifiée. Cartographiée avec une symbologie distincte.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Location, Associated Household & Photo */}
        <div className="space-y-6">
          {/* Location & GPS Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-teal-700" />
              <span>Localisation SIG</span>
            </h3>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Zone de santé :</span>
                <strong className="text-slate-900">{observation.zone_id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aire de santé :</span>
                <strong className="text-slate-900">{observation.health_area_id}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quartier :</span>
                <strong className="text-slate-900">{observation.neighborhood_id}</strong>
              </div>
              {observation.street_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Avenue / Rue :</span>
                  <span className="text-slate-800">{observation.street_name}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Latitude :</span>
                  <span className="font-semibold text-slate-900">{observation.latitude.toFixed(5)}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Longitude :</span>
                  <span className="font-semibold text-slate-900">{observation.longitude.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Précision GPS :</span>
                  <span className={`font-semibold ${observation.gps_accuracy > 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    ±{observation.gps_accuracy.toFixed(1)} m ({observation.gps_status || 'VALID'})
                  </span>
                </div>
                {observation.gps_justification && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-md border border-amber-200 mt-1">
                    Justification : {observation.gps_justification}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Associated Household Card */}
          {observation.household_id && (
            <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-200 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-teal-700" />
                <span>Ménage associé</span>
              </h4>
              <div className="text-xs text-teal-900 space-y-1">
                <div className="flex justify-between">
                  <span className="text-teal-700">Code ménage :</span>
                  <strong className="font-mono">{observation.household_id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Distance calculée :</span>
                  <strong className="text-teal-950 bg-teal-200/80 px-2 py-0.5 rounded text-[11px]">
                    {observation.calculated_household_distance_m !== undefined
                      ? `${observation.calculated_household_distance_m} mètres`
                      : 'Non calculée'}
                  </strong>
                </div>
                {linkedHousehold && (
                  <p className="text-[11px] text-teal-800 pt-1">
                    Chef / Localisation : {linkedHousehold.street_name || linkedHousehold.neighborhood_id}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Photo Card */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Camera className="w-4 h-4 text-teal-700" />
              <span>Photographie du constat</span>
            </h3>

            {observation.photo_url ? (
              <div className="space-y-2">
                <img
                  src={observation.photo_url}
                  alt={`Facteur ${observation.factor_type}`}
                  className="w-full h-48 object-cover rounded-lg border border-slate-200 shadow-xs"
                />
                <p className="text-[10px] text-slate-400 text-center">
                  Image brute terrain originale non altérée
                </p>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                Aucune photographie jointe
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
