import React, { useState } from 'react';
import {
  HealthRegistryRecord,
  FieldSurvey,
  PathologyConfig,
  GeographicUnitV110
} from '../types';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { generateAnonymizedCode } from '../utils/surveyOperationsEngine';

interface Props {
  records: HealthRegistryRecord[];
  surveys: FieldSurvey[];
  pathologies: PathologyConfig[];
  geoUnits: GeographicUnitV110[];
  onAddRecord: (rec: Omit<HealthRegistryRecord, 'id' | 'createdAt'>) => void;
  onBulkAdd: (recs: Omit<HealthRegistryRecord, 'id' | 'createdAt'>[]) => void;
  isDemoMode: boolean;
}

export const HealthRegistriesModule: React.FC<Props> = ({
  records = [],
  surveys = [],
  pathologies = [],
  geoUnits = [],
  onAddRecord,
  onBulkAdd,
  isDemoMode
}) => {
  const safeRecords = Array.isArray(records) ? records : [];
  const safeSurveys = Array.isArray(surveys) ? surveys : [];
  const safePathologies = Array.isArray(pathologies) ? pathologies : [];
  const safeGeoUnits = Array.isArray(geoUnits) ? geoUnits : [];

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPathology, setSelectedPathology] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Record Form State
  const [patientId, setPatientId] = useState<string>(generateAnonymizedCode('FOSA'));
  const [facilityName, setFacilityName] = useState<string>('Centre de Santé Kasuku');
  const [geoUnitId, setGeoUnitId] = useState<string>('AS_KASUKU');
  const [pathologyCode, setPathologyCode] = useState<string>('PALUDISME');
  const [consultationDate, setConsultationDate] = useState<string>('2026-02-15');
  const [ageYears, setAgeYears] = useState<number>(14);
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [diagType, setDiagType] = useState<'CONFIRME_RDT' | 'CONFIRME_GE' | 'CONFIRME_WIDAL' | 'SUSPECT_CLINIQUE'>('CONFIRME_RDT');
  const [outcome, setOutcome] = useState<'GUERI' | 'TRANSFERE' | 'DECEDE' | 'EN_COURS'>('GUERI');

  const filteredRecords = safeRecords.filter(r => {
    if (!r) return false;
    if (selectedPathology !== 'ALL' && r.pathologyCode !== selectedPathology) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPat = r.patientAnonymousId?.toLowerCase().includes(q);
      const matchFac = r.healthFacilityName?.toLowerCase().includes(q);
      if (!matchPat && !matchFac) return false;
    }
    return true;
  });

  const handleSubmitNew = () => {
    const geo = safeGeoUnits.find(g => g.id === geoUnitId);
    onAddRecord({
      surveyId: safeSurveys[0]?.id || 'ENQ_RETRO_FOSA_01',
      healthFacilityName: facilityName,
      healthFacilityId: 'HF_KINDU_KASUKU',
      geographicUnitId: geoUnitId,
      geographicUnitName: geo?.name || 'Kasuku',
      consultationDate,
      patientAnonymousId: patientId,
      ageYears,
      gender,
      pathologyCode,
      diagnosisType: diagType,
      outcome,
      dataQualityCheck: 'VALIDE',
      isDemo: isDemoMode
    });
    setShowAddModal(false);
    setPatientId(generateAnonymizedCode('FOSA'));
  };

  const handleSimulateBulkImport = () => {
    const sampleBatch: Omit<HealthRegistryRecord, 'id' | 'createdAt'>[] = [
      {
        surveyId: surveys[0]?.id || 'ENQ_RETRO_FOSA_01',
        healthFacilityName: 'Hôpital Général de Référence de Kindu',
        healthFacilityId: 'HF_KINDU_HGR',
        geographicUnitId: 'AS_ALUNGULI',
        geographicUnitName: 'Alunguli',
        consultationDate: '2026-01-18',
        patientAnonymousId: generateAnonymizedCode('HGR'),
        ageYears: 28,
        gender: 'F',
        pathologyCode: 'PALUDISME',
        diagnosisType: 'CONFIRME_GE',
        outcome: 'GUERI',
        dataQualityCheck: 'VALIDE',
        isDemo: isDemoMode
      },
      {
        surveyId: surveys[0]?.id || 'ENQ_RETRO_FOSA_01',
        healthFacilityName: 'Centre de Santé Kasuku',
        healthFacilityId: 'HF_KINDU_KASUKU',
        geographicUnitId: 'AS_KASUKU',
        consultationDate: '2026-01-22',
        patientAnonymousId: generateAnonymizedCode('KAS'),
        ageYears: 7,
        gender: 'M',
        pathologyCode: 'FIEVRE_TYPHOIDE',
        diagnosisType: 'CONFIRME_WIDAL',
        outcome: 'GUERI',
        dataQualityCheck: 'VALIDE',
        isDemo: isDemoMode
      },
      {
        surveyId: surveys[0]?.id || 'ENQ_RETRO_FOSA_01',
        healthFacilityName: 'Centre de Santé Tokolote',
        healthFacilityId: 'HF_KINDU_TOKOLOTE',
        geographicUnitId: 'AS_TOKOLOTE',
        consultationDate: '2026-02-04',
        patientAnonymousId: generateAnonymizedCode('TOK'),
        ageYears: 3,
        gender: 'M',
        pathologyCode: 'PALUDISME',
        diagnosisType: 'CONFIRME_RDT',
        outcome: 'GUERI',
        dataQualityCheck: 'VALIDE',
        isDemo: isDemoMode
      }
    ];

    onBulkAdd(sampleBatch);
  };

  return (
    <div id="health-registries-module" className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">
              Registres Rétrospectifs des Formations Sanitaires (FOSA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Numérisation, contrôle d'exhaustivité et audit des cas issus des registres de consultations externes et hospitalisations du Maniema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateBulkImport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Importer un lot FOSA
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Saisir un cas de registre
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher code anonymisé, centre..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedPathology}
              onChange={e => setSelectedPathology(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800"
            >
              <option value="ALL">Toutes pathologies</option>
              <option value="PALUDISME">Paludisme</option>
              <option value="FIEVRE_TYPHOIDE">Fièvre typhoïde</option>
              <option value="CHOLERA">Choléra</option>
              <option value="IRA">Infections Respiratoires</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          {filteredRecords.length} dossier(s) FOSA archivé(s)
        </span>
      </div>

      {/* Registries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Patient Anonymisé</th>
                <th className="py-3 px-3">Date Consultation</th>
                <th className="py-3 px-3">Formation Sanitaire</th>
                <th className="py-3 px-3">Aire de Santé</th>
                <th className="py-3 px-3">Âge / Sexe</th>
                <th className="py-3 px-3">Pathologie</th>
                <th className="py-3 px-3">Type Diagnostic</th>
                <th className="py-3 px-3">Issue Clinique</th>
                <th className="py-3 px-4 text-right">Contrôle Qualité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {r.patientAnonymousId}
                  </td>
                  <td className="py-3 px-3">{r.consultationDate}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {r.healthFacilityName}
                  </td>
                  <td className="py-3 px-3">{r.geographicUnitName}</td>
                  <td className="py-3 px-3">
                    {r.ageYears} ans ({r.gender === 'M' ? 'Homme' : 'Femme'})
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.pathologyCode === 'PALUDISME'
                          ? 'bg-rose-100 text-rose-800'
                          : r.pathologyCode === 'FIEVRE_TYPHOIDE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {r.pathologyCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                    {r.diagnosisType}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.outcome === 'GUERI'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.outcome === 'TRANSFERE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {r.dataQualityCheck}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-w-lg w-full animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Saisie d'un Dossier Registre FOSA
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enregistrement direct avec anonymisation automatique du patient.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Code Anonymisé
                </label>
                <input
                  type="text"
                  value={patientId}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Date de consultation
                </label>
                <input
                  type="date"
                  value={consultationDate}
                  onChange={e => setConsultationDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Formation Sanitaire
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={e => setFacilityName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Aire de Santé
                </label>
                <select
                  value={geoUnitId}
                  onChange={e => setGeoUnitId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                >
                  {geoUnits
                    .filter(g => g.level === 'AIRE_DE_SANTE')
                    .map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pathologie
                </label>
                <select
                  value={pathologyCode}
                  onChange={e => setPathologyCode(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                >
                  <option value="PALUDISME">Paludisme</option>
                  <option value="FIEVRE_TYPHOIDE">Fièvre typhoïde</option>
                  <option value="CHOLERA">Choléra</option>
                  <option value="IRA">Infections Respiratoires</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Âge (années)
                </label>
                <input
                  type="number"
                  value={ageYears}
                  onChange={e => setAgeYears(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sexe
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as 'M' | 'F')}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirmation Diagnostique
                </label>
                <select
                  value={diagType}
                  onChange={e => setDiagType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                >
                  <option value="CONFIRME_RDT">Test Rapide TDR Positif</option>
                  <option value="CONFIRME_GE">Goutte Épaisse (Microscopie)</option>
                  <option value="CONFIRME_WIDAL">Sérodiagnostic Widal / Culture</option>
                  <option value="SUSPECT_CLINIQUE">Présomption Clinique</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Issue du Patient
                </label>
                <select
                  value={outcome}
                  onChange={e => setOutcome(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                >
                  <option value="GUERI">Guéri / Sortie</option>
                  <option value="TRANSFERE">Transféré HGR</option>
                  <option value="DECEDE">Décédé</option>
                  <option value="EN_COURS">En cours de traitement</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitNew}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                Enregistrer le cas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
