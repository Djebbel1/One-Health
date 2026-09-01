import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  Database,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertTriangle,
  Info
} from 'lucide-react';
import { DataDictionaryVariable, VariableDomain, VariableObligation, VariableType, VariableSourceType } from '../../types';

interface DataDictionaryTabProps {
  variables: DataDictionaryVariable[];
  onAddVariable: (v: DataDictionaryVariable) => void;
  onUpdateVariable: (v: DataDictionaryVariable) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
  activeProjectId: string;
}

export const DataDictionaryTab: React.FC<DataDictionaryTabProps> = ({
  variables,
  onAddVariable,
  onUpdateVariable,
  onAddAuditLog,
  activeProjectId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('TOUS');
  const [onlyProxies, setOnlyProxies] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<DataDictionaryVariable | null>(variables[0] || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newVarName, setNewVarName] = useState('');
  const [newVarLabel, setNewVarLabel] = useState('');
  const [newVarDesc, setNewVarDesc] = useState('');
  const [newVarType, setNewVarType] = useState<VariableType>('ENTIER');
  const [newVarUnit, setNewVarUnit] = useState('');
  const [newVarDomain, setNewVarDomain] = useState<VariableDomain>('SANTE_HUMAINE');
  const [newVarObligation, setNewVarObligation] = useState<VariableObligation>('OBLIGATOIRE');
  const [newVarCondition, setNewVarCondition] = useState('');
  const [newVarSource, setNewVarSource] = useState<VariableSourceType>('ENQUETE');
  const [newVarIsProxy, setNewVarIsProxy] = useState(false);
  const [newProxyOrig, setNewProxyOrig] = useState('');
  const [newProxyJustif, setNewProxyJustif] = useState('');
  const [newProxySource, setNewProxySource] = useState('');
  const [newProxyLimit, setNewProxyLimit] = useState('');
  const [newVarMeaning, setNewVarMeaning] = useState('');

  const filteredVariables = variables.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === 'TOUS' || v.domain === selectedDomain;
    const matchesProxy = !onlyProxies || v.isProxy;
    return matchesSearch && matchesDomain && matchesProxy;
  });

  const handleCreateVariable = () => {
    if (!newVarName.trim() || !newVarLabel.trim()) return;

    const newVar: DataDictionaryVariable = {
      variableId: `VAR-${Date.now().toString().slice(-4)}`,
      name: newVarName.toLowerCase().replace(/\s+/g, '_').trim(),
      label: newVarLabel.trim(),
      description: newVarDesc || 'Variable de recherche One Health.',
      type: newVarType,
      unit: newVarUnit || undefined,
      domain: newVarDomain,
      obligation: newVarObligation,
      conditionRule: newVarObligation === 'CONDITIONNEL' ? newVarCondition : undefined,
      source: newVarSource,
      isProxy: newVarIsProxy,
      proxyDetails: newVarIsProxy
        ? {
            originalVariable: newProxyOrig || 'Non spécifiée',
            justification: newProxyJustif || 'Imputation ou proxy satellite.',
            sourceName: newProxySource || 'Source externe',
            scientificLimitation: newProxyLimit || 'Précision à valider.'
          }
        : undefined,
      aggregationLevel: 'AIRE_SANTE',
      scientificMeaning: newVarMeaning || 'Indicateur de surveillance éco-épidémiologique.',
      version: 'V1.0',
      projectId: activeProjectId,
      isDemoData: true
    };

    onAddVariable(newVar);
    onAddAuditLog('CREATION_VARIABLE', `Création variable dictionnaire ${newVar.name} (${newVar.label})`, { variableId: newVar.variableId });
    setShowAddModal(false);
    setNewVarName('');
    setNewVarLabel('');
    setNewVarDesc('');
  };

  const domainLabels: Record<VariableDomain, { label: string; color: string }> = {
    SANTE_HUMAINE: { label: 'Santé Humaine', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    CLIMAT: { label: 'Climat & Météo', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    ENVIRONNEMENT: { label: 'Environnement & Gîtes', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    EAU_ASSAINISSEMENT: { label: 'Eau & Assainissement', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    SANTE_ANIMALE: { label: 'Santé Animale', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    DEMOGRAPHIE: { label: 'Démographie', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    SPATIAL: { label: 'Spatial / GNSS', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Dictionnaire des Variables & Métadonnées (Data Dictionary)</h3>
            <p className="text-xs text-slate-500">
              Définitions standardisées, typages, obligations, règles conditionnelles et traçabilité des variables proxies
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all self-stretch md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Définir une Nouvelle Variable
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom technique, libellé ou définition..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="TOUS">Tous les Domaines One Health</option>
            <option value="SANTE_HUMAINE">Santé Humaine</option>
            <option value="CLIMAT">Climat & Météo</option>
            <option value="ENVIRONNEMENT">Environnement</option>
            <option value="EAU_ASSAINISSEMENT">Eau & Assainissement</option>
            <option value="SANTE_ANIMALE">Santé Animale</option>
            <option value="SPATIAL">Spatial / GNSS</option>
          </select>

          <button
            onClick={() => setOnlyProxies(!onlyProxies)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              onlyProxies
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Uniquement Proxies ({variables.filter(v => v.isProxy).length})
          </button>
        </div>
      </div>

      {/* Main Grid: Variables List & Detailed Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Variables Table/Cards */}
        <div className="lg:col-span-2 space-y-3">
          {filteredVariables.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Aucune variable ne correspond aux critères de recherche.
            </div>
          ) : (
            filteredVariables.map((v) => {
              const isSelected = selectedVariable?.variableId === v.variableId;
              const domainInfo = domainLabels[v.domain] || { label: v.domain, color: 'bg-slate-100 text-slate-700' };

              return (
                <div
                  key={v.variableId}
                  onClick={() => setSelectedVariable(v)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/40 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          {v.name}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${domainInfo.color}`}>
                          {domainInfo.label}
                        </span>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {v.type}
                        </span>
                        {v.unit && (
                          <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-100/50 px-2 py-0.5 rounded">
                            {v.unit}
                          </span>
                        )}
                        {v.isProxy && (
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                            <Sparkles className="w-3.5 h-3.5" />
                            PROXY
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 pt-0.5">
                        {v.label}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-1">
                        {v.description}
                      </p>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded shrink-0 ${
                      v.obligation === 'OBLIGATOIRE'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : v.obligation === 'CONDITIONNEL'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {v.obligation}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Variable Detail Inspector */}
        <div className="lg:col-span-1">
          {selectedVariable ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs sticky top-20 space-y-4">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                    {selectedVariable.variableId} (v{selectedVariable.version})
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1 font-mono">
                    {selectedVariable.name}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedVariable(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium text-xs">Libellé d'affichage :</span>
                  <p className="font-bold text-slate-800">{selectedVariable.label}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-medium text-xs">Description Scientifique :</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                    {selectedVariable.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Type de Donnée</span>
                    <p className="font-bold text-slate-800 font-mono text-xs sm:text-sm">{selectedVariable.type}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-400 uppercase font-semibold">Unité / Précision</span>
                    <p className="font-bold text-slate-800 font-mono text-xs sm:text-sm">{selectedVariable.unit || 'Sans unité'}</p>
                  </div>
                </div>

                {selectedVariable.acceptableRange && (
                  <div>
                    <span className="text-slate-400 font-medium text-xs">Plage Acceptable :</span>
                    <p className="font-mono text-slate-800">
                      [{selectedVariable.acceptableRange.min} à {selectedVariable.acceptableRange.max}] {selectedVariable.unit}
                    </p>
                  </div>
                )}

                {selectedVariable.categories && selectedVariable.categories.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-slate-500 font-bold uppercase text-xs">
                      Modalités Catégorielles :
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {selectedVariable.categories.map((cat, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs">
                          <span className="font-mono font-bold text-teal-800">{cat.code}</span>
                          <span className="text-slate-600">{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVariable.conditionRule && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-0.5">
                    <span className="font-bold uppercase text-xs">Règle Conditionnelle :</span>
                    <p>{selectedVariable.conditionRule}</p>
                  </div>
                )}

                {/* Proxy Inspector Card */}
                {selectedVariable.isProxy && selectedVariable.proxyDetails && (
                  <div className="p-3.5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 text-amber-900 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <Sparkles className="w-4 h-4" />
                      Fiche Métadonnées Proxy (V1.19)
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm">
                      <p><span className="font-semibold">Variable Originelle :</span> {selectedVariable.proxyDetails.originalVariable}</p>
                      <p><span className="font-semibold">Justification :</span> {selectedVariable.proxyDetails.justification}</p>
                      <p><span className="font-semibold">Source du Proxy :</span> {selectedVariable.proxyDetails.sourceName}</p>
                      <p><span className="font-semibold">Limite Scientifique :</span> {selectedVariable.proxyDetails.scientificLimitation}</p>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 font-medium">Sens Scientifique & Modélisation :</span>
                  <p className="text-slate-700 italic pt-0.5">{selectedVariable.scientificMeaning}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p>Sélectionnez une variable pour inspecter ses métadonnées détaillées, ses codes internes et ses limites méthodologiques.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: AJOUTER NOUVELLE VARIABLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-800">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-base">Définition d une Nouvelle Variable Scientifique</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom Technique (sans espace)</label>
                  <input
                    type="text"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    placeholder="cases_cholera_conf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domaine One Health</label>
                  <select
                    value={newVarDomain}
                    onChange={(e) => setNewVarDomain(e.target.value as VariableDomain)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="SANTE_HUMAINE">Santé Humaine</option>
                    <option value="CLIMAT">Climat & Météo</option>
                    <option value="ENVIRONNEMENT">Environnement</option>
                    <option value="EAU_ASSAINISSEMENT">Eau & Assainissement</option>
                    <option value="SANTE_ANIMALE">Santé Animale</option>
                    <option value="SPATIAL">Spatial / GNSS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Libellé d affichage clair</label>
                <input
                  type="text"
                  value={newVarLabel}
                  onChange={(e) => setNewVarLabel(e.target.value)}
                  placeholder="Nombre de cas confirmés de choléra..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de donnée</label>
                  <select
                    value={newVarType}
                    onChange={(e) => setNewVarType(e.target.value as VariableType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="ENTIER">Entier</option>
                    <option value="DECIMAL">Décimal</option>
                    <option value="TEXTE">Texte</option>
                    <option value="BOOLEEN">Booléen</option>
                    <option value="CATEGORIE">Catégorie</option>
                    <option value="DATE">Date</option>
                    <option value="GPS">Coordonnées GPS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité (ex: °C, mm, cas)</label>
                  <input
                    type="text"
                    value={newVarUnit}
                    onChange={(e) => setNewVarUnit(e.target.value)}
                    placeholder="cas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statut d obligation</label>
                  <select
                    value={newVarObligation}
                    onChange={(e) => setNewVarObligation(e.target.value as VariableObligation)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="OBLIGATOIRE">Obligatoire</option>
                    <option value="FACULTATIF">Facultatif</option>
                    <option value="CONDITIONNEL">Conditionnel</option>
                  </select>
                </div>
              </div>

              {newVarObligation === 'CONDITIONNEL' && (
                <div>
                  <label className="block font-semibold text-amber-800 mb-1">Règle Conditionnelle (ex: SI variable X == Y alors requise)</label>
                  <input
                    type="text"
                    value={newVarCondition}
                    onChange={(e) => setNewVarCondition(e.target.value)}
                    placeholder="SI source_eau == PUITS -> profondeur obligatoire"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Définition Scientifique</label>
                <textarea
                  rows={2}
                  value={newVarDesc}
                  onChange={(e) => setNewVarDesc(e.target.value)}
                  placeholder="Protocole de mesure, seuils biologiques et méthode..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Proxy Sub-form */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVarIsProxy}
                    onChange={(e) => setNewVarIsProxy(e.target.checked)}
                  />
                  <span className="font-bold text-slate-800">Cette variable est un PROXY (Mesure indirecte / Satellite)</span>
                </label>

                {newVarIsProxy && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <input
                      type="text"
                      value={newProxyOrig}
                      onChange={(e) => setNewProxyOrig(e.target.value)}
                      placeholder="Variable originelle remplacée..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <textarea
                      rows={2}
                      value={newProxyJustif}
                      onChange={(e) => setNewProxyJustif(e.target.value)}
                      placeholder="Justification scientifique du proxy..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <input
                      type="text"
                      value={newProxyLimit}
                      onChange={(e) => setNewProxyLimit(e.target.value)}
                      placeholder="Limites scientifiques identifiées..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateVariable}
                disabled={!newVarName.trim() || !newVarLabel.trim()}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Enregistrer au Dictionnaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
