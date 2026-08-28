import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PathologyConfig, DynamicObservationRecord, VariableAvailabilityStatus, DataSourceTypeV110 } from '../../types';
import {
  FileText,
  Save,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export const DynamicDataEntryForm: React.FC = () => {
  const {
    pathologies,
    maniemaGeoUnits,
    oneHealthProjects,
    activeProjectId,
    isDemoMode,
    addDynamicObservation,
    timePeriodConfigs
  } = useData();

  const [selectedPathologyCode, setSelectedPathologyCode] = useState<string>('MAL');
  const selectedPathology = pathologies.find(p => p.code === selectedPathologyCode) || pathologies[0];

  const [selectedProject, setSelectedProject] = useState<string>(activeProjectId);
  const [selectedGeoUnitId, setSelectedGeoUnitId] = useState<string>('AS_ALUNGULI');
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [sourceType, setSourceType] = useState<DataSourceTypeV110>('REGISTRE_SANITAIRE');
  const [investigatorName, setInvestigatorName] = useState<string>('Dr. Shabani (One Health Maniema)');

  // Common variables
  const [casesTotal, setCasesTotal] = useState<string>('12');
  const [casesConfirmed, setCasesConfirmed] = useState<string>('10');
  const [hospitalized, setHospitalized] = useState<string>('2');
  const [deaths, setDeaths] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');

  // Specific variables dynamic values and availability states
  const [specificValues, setSpecificValues] = useState<Record<string, any>>({
    tdr_realises: '15',
    tdr_positifs: '10',
    taux_possession_milda_pct: '65',
    gites_larvaires_proximite_count: '2'
  });

  const [variableAvailability, setVariableAvailability] = useState<Record<string, VariableAvailabilityStatus>>({
    tdr_realises: 'DISPONIBLE',
    tdr_positifs: 'DISPONIBLE',
    taux_possession_milda_pct: 'DISPONIBLE',
    gites_larvaires_proximite_count: 'DISPONIBLE'
  });

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSpecificValueChange = (code: string, val: any) => {
    setSpecificValues(prev => ({ ...prev, [code]: val }));
  };

  const handleAvailabilityChange = (code: string, status: VariableAvailabilityStatus) => {
    setVariableAvailability(prev => ({ ...prev, [code]: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const geoUnit = maniemaGeoUnits.find(u => u.id === selectedGeoUnitId);
    const dateObj = new Date(date);

    const record: Omit<DynamicObservationRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      projectId: selectedProject,
      pathologyId: selectedPathology.id,
      pathologyCode: selectedPathology.code,
      date,
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      provinceId: 'PROV_MANIEMA',
      geographicUnitId: selectedGeoUnitId,
      geographicLevel: geoUnit?.level || 'AIRE_SANTE',
      sourceId: 'SRC_FORM_ENTRY',
      sourceType,
      investigatorId: 'USR_INVESTIGATOR_01',
      investigatorName,
      coordinates: geoUnit?.coordinates || null,
      validationStatus: 'VALIDATED',
      dataQuality: 'VALIDE',
      isDemo: isDemoMode,
      commonData: {
        cases_total: casesTotal !== '' ? Number(casesTotal) : null,
        cases_confirmed: casesConfirmed !== '' ? Number(casesConfirmed) : null,
        hospitalized: hospitalized !== '' ? Number(hospitalized) : null,
        deaths: deaths !== '' ? Number(deaths) : null,
        notes: notes || undefined
      },
      specificData: specificValues,
      variableAvailability
    };

    addDynamicObservation(record);
    setSaveSuccess(`Enregistrement réussi pour ${selectedPathology.name} (${date}) en mode ${isDemoMode ? 'DÉMONSTRATION' : 'RÉEL'}.`);

    setTimeout(() => {
      setSaveSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Formulaire de Collecte Multi-Pathologies Adaptatif</h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isDemoMode
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
              }`}
            >
              Mode : {isDemoMode ? 'Démonstration / Simulation' : 'Production Données Réelles'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Génération instantanée des champs de saisie spécifiques selon la pathologie sélectionnée avec gestion rigoureuse des valeurs manquantes.
          </p>
        </div>

        {/* Pathology Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300 font-semibold">Pathologie :</label>
          <select
            value={selectedPathologyCode}
            onChange={(e) => {
              setSelectedPathologyCode(e.target.value);
              // Reset specific values
              setSpecificValues({});
            }}
            className="bg-slate-800 border border-slate-700 text-teal-300 font-bold text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500"
          >
            {pathologies.filter(p => p.isActive).map(p => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          {saveSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 : Contexte Spatial & Temporel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-400" />
            1. Contexte Spatio-Temporel & Source d'Investigation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Projet One Health</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
              >
                {oneHealthProjects.map(prj => (
                  <option key={prj.id} value={prj.id}>
                    {prj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Entité Géographique</label>
              <select
                value={selectedGeoUnitId}
                onChange={(e) => setSelectedGeoUnitId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
              >
                {maniemaGeoUnits
                  .filter(u => u.level === 'AIRE_SANTE' || u.level === 'ZONE_SANTE' || u.level === 'SITE')
                  .map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.level})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Date d'Observation</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Source des Données</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as DataSourceTypeV110)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5"
              >
                <option value="REGISTRE_SANITAIRE">Registre Sanitaire (CS / HGR)</option>
                <option value="ENQUETE_MENAGE">Enquête Ménage One Health</option>
                <option value="OBSERVATION_TERRAIN">Observation Terrain / Gîte</option>
                <option value="SURVEILLANCE_EPIDEMIO">Surveillance Épidémiologique</option>
                <option value="LABORATOIRE">Laboratoire Régional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 : Socle Commun Épidémiologique */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              2. Socle Commun Épidémiologique
            </h3>
            <span className="text-[11px] text-slate-400 italic">
              Variables standardisées pour toutes les pathologies
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Cas Totaux Enregistrés</label>
              <input
                type="number"
                min="0"
                value={casesTotal}
                onChange={(e) => setCasesTotal(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Cas Confirmés (TDR / Labo)</label>
              <input
                type="number"
                min="0"
                value={casesConfirmed}
                onChange={(e) => setCasesConfirmed(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Hospitalisations</label>
              <input
                type="number"
                min="0"
                value={hospitalized}
                onChange={(e) => setHospitalized(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Décès Imputables</label>
              <input
                type="number"
                min="0"
                value={deaths}
                onChange={(e) => setDeaths(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Variables Spécifiques Adaptatives à la Pathologie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                3. Variables Spécifiques pour : {selectedPathology.name} ({selectedPathology.specificVariables.length} variables)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chaque variable peut être marquée comme Disponible, Indisponible (manquante) ou Non Applicable.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-mono">
                Règle V1.10 : Ne jamais forcer un zéro sur donnée indisponible
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {selectedPathology.specificVariables.map(v => {
              const currentAvailability = variableAvailability[v.code] || 'DISPONIBLE';
              const isAvailable = currentAvailability === 'DISPONIBLE';

              return (
                <div
                  key={v.id}
                  className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-4 space-y-2.5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-teal-300 font-semibold">{v.code}</span>
                        <span className="text-xs font-bold text-slate-200">{v.label}</span>
                        {v.required && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-semibold">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{v.description}</p>
                    </div>

                    {/* Availability Switch */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(['DISPONIBLE', 'INDISPONIBLE', 'NON_APPLICABLE'] as VariableAvailabilityStatus[]).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleAvailabilityChange(v.code, st)}
                          className={`text-[10px] px-2 py-1 rounded font-semibold transition border ${
                            currentAvailability === st
                              ? st === 'DISPONIBLE'
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : st === 'INDISPONIBLE'
                                ? 'bg-amber-600 text-white border-amber-500'
                                : 'bg-slate-700 text-white border-slate-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {st === 'DISPONIBLE' ? '✓ Dispo' : st === 'INDISPONIBLE' ? '✕ Indispo' : '∅ N/A'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input widget only active if status is DISPONIBLE */}
                  {isAvailable ? (
                    <div className="pt-1">
                      {v.type === 'CATEGORICAL' && v.options ? (
                        <select
                          value={specificValues[v.code] || ''}
                          onChange={(e) => handleSpecificValueChange(v.code, e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2"
                        >
                          <option value="">-- Sélectionner une option --</option>
                          {v.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : v.type === 'BOOLEAN' ? (
                        <select
                          value={specificValues[v.code] !== undefined ? String(specificValues[v.code]) : ''}
                          onChange={(e) => handleSpecificValueChange(v.code, e.target.value === 'true')}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2"
                        >
                          <option value="">-- Non spécifié --</option>
                          <option value="true">Oui / Présent</option>
                          <option value="false">Non / Absent</option>
                        </select>
                      ) : (
                        <input
                          type={v.type === 'INTEGER' || v.type === 'DECIMAL' ? 'number' : 'text'}
                          value={specificValues[v.code] !== undefined ? specificValues[v.code] : ''}
                          onChange={(e) => handleSpecificValueChange(v.code, e.target.value)}
                          placeholder={`Entrez ${v.label}...`}
                          className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 font-mono"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 p-2 rounded text-[11px] text-slate-400 italic">
                      Valeur enregistrée comme{' '}
                      <strong className="text-amber-300">{currentAvailability}</strong> (aucun 0 injecté).
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-lg transition"
          >
            <Save className="h-4 w-4" />
            Enregistrer l'Observation Spatio-Temporelle
          </button>
        </div>
      </form>
    </div>
  );
};
