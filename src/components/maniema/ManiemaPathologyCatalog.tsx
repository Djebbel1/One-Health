import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PathologyConfig, PathologyCategory, TransmissionMode, PathologyVariableDefinition } from '../../types';
import {
  Activity,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  ShieldAlert
} from 'lucide-react';

export const ManiemaPathologyCatalog: React.FC = () => {
  const { pathologies, addPathology, updatePathology, togglePathologyActive } = useData();
  const [selectedPathologyId, setSelectedPathologyId] = useState<string>(pathologies[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPathology, setEditingPathology] = useState<PathologyConfig | null>(null);

  const selectedPathology = pathologies.find(p => p.id === selectedPathologyId) || pathologies[0];

  const filteredPathologies = pathologies.filter(p => {
    if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
    return true;
  });

  // Modal new pathology state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newScientificName, setNewScientificName] = useState('');
  const [newCategory, setNewCategory] = useState<PathologyCategory>('VECTORIELLE');
  const [newTransmission, setNewTransmission] = useState<TransmissionMode>('MOUSTIQUE_ANOPHELE');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState('#0d9488');
  const [newDimension, setNewDimension] = useState<'SANTE_HUMAINE' | 'ENVIRONNEMENT' | 'CLIMAT' | 'SANTE_ANIMALE'>('SANTE_HUMAINE');

  const handleCreatePathology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newPath: PathologyConfig = {
      id: `PATH_${newCode.toUpperCase()}`,
      code: newCode.toUpperCase(),
      name: newName,
      scientificName: newScientificName || newName,
      category: newCategory,
      transmissionMode: newTransmission,
      description: newDescription,
      isActive: true,
      icon: 'Activity',
      color: newColor,
      commonVariables: ['cases_total', 'cases_confirmed', 'hospitalized', 'deaths'],
      specificVariables: [
        {
          id: `var_${newCode.toLowerCase()}_diag`,
          code: `${newCode.toLowerCase()}_diagnostic_type`,
          label: `Type de test diagnostique (${newName})`,
          type: 'CATEGORICAL',
          category: 'SPECIFIQUE',
          required: true,
          options: [
            { value: 'TDR', label: 'Test de Diagnostic Rapide (TDR)' },
            { value: 'LABO', label: 'Confirmation Laboratoire / Culture' },
            { value: 'CLINIQUE', label: 'Suspect Clinique' }
          ],
          description: 'Méthode de confirmation diagnostique utilisée',
          availabilityStatus: 'DISPONIBLE'
        },
        {
          id: `var_${newCode.toLowerCase()}_facteur`,
          code: `${newCode.toLowerCase()}_facteur_risque`,
          label: 'Facteur de risque environnemental prédominant',
          type: 'TEXT',
          category: 'SPECIFIQUE',
          required: false,
          description: 'Facteur local identifié lors de l’investigation épidémiologique',
          availabilityStatus: 'DISPONIBLE'
        }
      ],
      indicators: [
        {
          id: `ind_${newCode.toLowerCase()}_taux`,
          name: `Taux d'incidence ${newName} (/1000 hab)`,
          formulaDescription: '(Nouveaux cas / Population) * 1000',
          unit: 'cas / 1000 hab'
        },
        {
          id: `ind_${newCode.toLowerCase()}_letalite`,
          name: `Taux de létalité ${newName} (%)`,
          formulaDescription: '(Décès / Cas totaux) * 100',
          unit: '%'
        }
      ],
      dataSources: ['REGISTRE_DHIS2', 'SURVEILLANCE_EPIDEMIO'],
      collectionFrequency: 'MENSUEL',
      oneHealthDimension: newDimension,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addPathology(newPath);
    setShowAddModal(false);
    setSelectedPathologyId(newPath.id);
    // Reset form
    setNewCode('');
    setNewName('');
    setNewScientificName('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Moteur Multi-Pathologies One Health</h2>
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              V1.10 Extensible
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Architecture modulaire et découplée pour la surveillance et modélisation de toutes pathologies infectieuses, vectorielles et zoonotiques.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Filtrer par catégorie"
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">Toutes les catégories ({pathologies.length})</option>
            <option value="VECTORIELLE">Vectorielles</option>
            <option value="HYDRIQUE_ALIMENTAIRE">Hydriques & Alimentaires</option>
            <option value="ZOONOTIQUE">Zoonotiques</option>
            <option value="RESPIRATOIRE">Respiratoires</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter une pathologie
          </button>
        </div>
      </div>

      {/* Grid: Pathologies List + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pathologies Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Catalogue des Pathologies ({filteredPathologies.length})
          </h3>

          <div className="space-y-2">
            {filteredPathologies.map(p => {
              const isSelected = p.id === selectedPathology?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPathologyId(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-teal-500 shadow-md ring-1 ring-teal-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      <span className="text-xs font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {p.code}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 italic">
                      {p.scientificName}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-teal-900/40">
                        {p.specificVariables.length} vars spéc.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePathologyActive(p.id);
                      }}
                      title={p.isActive ? 'Désactiver' : 'Activer'}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        p.isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {p.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3" /> Actif
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" /> Inactif
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pathology In-Depth Specification */}
        {selectedPathology && (
          <div className="lg:col-span-2 space-y-5 bg-slate-900 border border-slate-800 rounded-xl p-5">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedPathology.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{selectedPathology.name}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-teal-300 rounded border border-teal-700/50">
                    Code: {selectedPathology.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  {selectedPathology.scientificName} — {selectedPathology.description}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  Dimension One Health: <strong className="text-teal-400">{selectedPathology.oneHealthDimension}</strong>
                </span>
              </div>
            </div>

            {/* Transmission & Epi characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Mode de Transmission</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block">
                  {selectedPathology.transmissionMode}
                </span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Fréquence de Collecte</span>
                <span className="text-xs font-semibold text-teal-300 mt-1 block">
                  {selectedPathology.collectionFrequency}
                </span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Sources de Données</span>
                <span className="text-xs font-semibold text-slate-200 mt-1 block truncate">
                  {selectedPathology.dataSources.join(', ')}
                </span>
              </div>
            </div>

            {/* Socle Commun vs Variables Spécifiques */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-sky-400" />
                    Socle Commun de Variables Épidémiologiques
                  </h4>
                  <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Applicable à toutes les pathologies
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono block">cases_total</span>
                    <span className="text-xs text-slate-200 font-medium">Cas totaux enregistrés</span>
                  </div>
                  <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono block">cases_confirmed</span>
                    <span className="text-xs text-slate-200 font-medium">Cas confirmés labo/TDR</span>
                  </div>
                  <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono block">hospitalized</span>
                    <span className="text-xs text-slate-200 font-medium">Hospitalisations</span>
                  </div>
                  <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono block">deaths</span>
                    <span className="text-xs text-slate-200 font-medium">Décès imputables</span>
                  </div>
                </div>
              </div>

              {/* Specific variables with Status (Rule Section 9) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4" />
                    Variables Spécifiques Définies ({selectedPathology.specificVariables.length})
                  </h4>
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-medium">
                    Gestion stricte des valeurs manquantes (aucun zéro forcé)
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedPathology.specificVariables.map((v, i) => (
                    <div
                      key={v.id || i}
                      className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-teal-300 font-semibold">{v.code}</span>
                          <span className="text-xs font-bold text-slate-200">{v.label}</span>
                          {v.required && (
                            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-semibold">
                              Requis
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{v.description}</p>
                        {v.options && v.options.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {v.options.map(opt => (
                              <span key={opt.value} className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                {opt.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] px-2 py-1 rounded bg-slate-900 text-slate-300 font-mono border border-slate-700">
                          {v.type}
                        </span>
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded font-semibold border ${
                            v.availabilityStatus === 'DISPONIBLE'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              : v.availabilityStatus === 'INDISPONIBLE'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {v.availabilityStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Indicators defined */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Indicateurs Calculés Définis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedPathology.indicators.map((ind, i) => (
                    <div key={ind.id || i} className="bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs font-bold text-slate-200">{ind.name}</div>
                      <div className="text-[11px] text-teal-400 font-mono mt-1">
                        Formule: {ind.formulaDescription}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Unité: {ind.unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Pathology */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">Ajouter une Nouvelle Pathologie au Catalogue</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePathology} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Code Court (ex: CHOL, DENGUE)</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="CHOL"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Nom Commun</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Choléra"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Nom Scientifique / Agent Pathogène</label>
                <input
                  type="text"
                  value={newScientificName}
                  onChange={(e) => setNewScientificName(e.target.value)}
                  placeholder="Vibrio cholerae"
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500 italic"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Catégorie Épidémiologique</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PathologyCategory)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="VECTORIELLE">Vectorielle</option>
                    <option value="HYDRIQUE_ALIMENTAIRE">Hydrique & Alimentaire</option>
                    <option value="ZOONOTIQUE">Zoonotique</option>
                    <option value="RESPIRATOIRE">Respiratoire</option>
                    <option value="AUTRE_INFECTIEUSE">Autre infectieuse</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Mode de Transmission</label>
                  <select
                    value={newTransmission}
                    onChange={(e) => setNewTransmission(e.target.value as TransmissionMode)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="EAU_ALIMENT_CONTAMINE">Eau / aliment contaminé</option>
                    <option value="MOUSTIQUE_ANOPHELE">Moustique Anophèle</option>
                    <option value="MOUSTIQUE_AEDES">Moustique Aedes</option>
                    <option value="CONTACT_DIRECT_ANIMAL">Contact animal (Zoonose)</option>
                    <option value="GOUTTELETTES_AERIENNES">Gouttelettes aériennes</option>
                    <option value="CONTACT_ORAL_FECAL">Contact oral-fécal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Dimension One Health</label>
                  <select
                    value={newDimension}
                    onChange={(e) => setNewDimension(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="SANTE_HUMAINE">Santé humaine</option>
                    <option value="SANTE_ANIMALE">Santé animale (Zoonose)</option>
                    <option value="ENVIRONNEMENT">Environnement</option>
                    <option value="CLIMAT">Climat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Couleur d'Affichage</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="h-9 w-12 bg-transparent border-0 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Description / Contexte Local Maniema</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Facteurs éco-épidémiologiques observés dans les zones du Maniema..."
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-sm"
                >
                  Enregistrer la Pathologie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
