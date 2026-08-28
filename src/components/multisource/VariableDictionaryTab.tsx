import React, { useState } from 'react';
import { CustomVariableDefinition, OneHealthDimension } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Check,
  Tag,
  Layers,
  Activity,
  CloudRain,
  Users,
  Globe,
  Database
} from 'lucide-react';

interface VariableDictionaryTabProps {
  customVariables: CustomVariableDefinition[];
  onAddCustomVariable: (v: CustomVariableDefinition) => void;
}

export const VariableDictionaryTab: React.FC<VariableDictionaryTabProps> = ({
  customVariables,
  onAddCustomVariable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('TOUTES');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<CustomVariableDefinition>({
    code: '',
    name: '',
    description: '',
    type: 'NUMBER',
    unit: '',
    category: 'Général',
    oneHealthDimension: 'SANTE'
  });

  const standardVariables: CustomVariableDefinition[] = [
    { code: 'date_observation', name: 'Date de l’observation', description: 'Date normalisée YYYY-MM-DD', type: 'DATE', category: 'Temporalité', oneHealthDimension: 'SANTE' },
    { code: 'zone_sante', name: 'Zone de Santé (Maniema)', description: 'Code standardisé GEO_ZS_*', type: 'STRING', category: 'Géographie', oneHealthDimension: 'GEOGRAPHIE' },
    { code: 'aire_sante', name: 'Aire de Santé', description: 'Nom de l’aire de santé de rattachement', type: 'STRING', category: 'Géographie', oneHealthDimension: 'GEOGRAPHIE' },
    { code: 'latitude', name: 'Latitude GPS', description: 'Coordonnée décimale (Maniema)', type: 'NUMBER', unit: '°', category: 'Géographie', oneHealthDimension: 'GEOGRAPHIE' },
    { code: 'longitude', name: 'Longitude GPS', description: 'Coordonnée décimale (Maniema)', type: 'NUMBER', unit: '°', category: 'Géographie', oneHealthDimension: 'GEOGRAPHIE' },
    { code: 'pathology_code', name: 'Pathologie diagnostiquée', description: 'Code de la maladie One Health', type: 'STRING', category: 'Épidémiologie', oneHealthDimension: 'SANTE' },
    { code: 'age_annees', name: 'Âge du patient', description: 'Âge en années révolues', type: 'NUMBER', unit: 'ans', category: 'Démographie', oneHealthDimension: 'DEMOGRAPHIE' },
    { code: 'sexe', name: 'Sexe biologique', description: 'M / F', type: 'CATEGORICAL', category: 'Démographie', oneHealthDimension: 'DEMOGRAPHIE' },
    { code: 'pluviometrie_mm', name: 'Précipitations journalières', description: 'Pluie mesurée ou NULL si capteur en panne', type: 'NUMBER', unit: 'mm', category: 'Climatologie', oneHealthDimension: 'CLIMAT' },
    { code: 'temperature_celsius', name: 'Température de l’air', description: 'Température moyenne ou instantanée', type: 'NUMBER', unit: '°C', category: 'Climatologie', oneHealthDimension: 'CLIMAT' },
    { code: 'humidite_pct', name: 'Humidité Relative', description: 'Pourcentage d’humidité de l’air', type: 'NUMBER', unit: '%', category: 'Climatologie', oneHealthDimension: 'CLIMAT' },
    { code: 'gites_larvaires_presence', name: 'Présence de gîtes larvaires', description: 'Observation entomologique d’Anophèles', type: 'BOOLEAN', category: 'Entomologie', oneHealthDimension: 'ENVIRONNEMENT' },
    { code: 'dechets_proximite_presence', name: 'Présence dépôts sauvages', description: 'Salubrité et accumulation de déchets', type: 'BOOLEAN', category: 'Salubrité', oneHealthDimension: 'ENVIRONNEMENT' },
    { code: 'source_eau_type', name: 'Type de point d’eau', description: 'Forage, borne, puits ou fleuve', type: 'STRING', category: 'WASH', oneHealthDimension: 'COMMUNAUTAIRE' }
  ];

  const allVariables = [...standardVariables, ...customVariables];

  const filtered = allVariables.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDim = selectedDimension === 'TOUTES' || v.oneHealthDimension === selectedDimension;
    return matchSearch && matchDim;
  });

  const handleSave = () => {
    if (!form.name || !form.code) return;
    onAddCustomVariable({
      ...form,
      code: form.code.toLowerCase().replace(/[^a-z0-9_]/g, '_')
    });
    setIsModalOpen(false);
    setForm({
      code: '',
      name: '',
      description: '',
      type: 'NUMBER',
      unit: '',
      category: 'Général',
      oneHealthDimension: 'SANTE'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Dictionnaire des Variables One Health ({allVariables.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Définitions standardisées et variables personnalisées avec dimensions, unités et types associés.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Variable Personnalisée</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une variable par nom, code, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-teal-500"
            >
              <option value="TOUTES">Toutes les dimensions</option>
              <option value="SANTE">Santé</option>
              <option value="CLIMAT">Climat</option>
              <option value="ENVIRONNEMENT">Environnement</option>
              <option value="COMMUNAUTAIRE">Communautaire</option>
              <option value="GEOGRAPHIE">Géographie</option>
              <option value="DEMOGRAPHIE">Démographie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Variables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => (
          <div
            key={v.code}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-teal-300 transition"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {v.oneHealthDimension}
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                {v.type} {v.unit ? `(${v.unit})` : ''}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
              <code className="text-[11px] text-teal-700 block font-mono mt-0.5">{v.code}</code>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">
              {v.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Catégorie : {v.category}</span>
              {v.unit && <span className="font-bold text-slate-700">Unité : {v.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création Variable */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-600" />
              Créer une Variable Personnalisée One Health
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom de la variable :</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  placeholder="Ex: Température ressentie"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code technique :</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800"
                    placeholder="temp_ressentie_c"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité de mesure :</label>
                  <input
                    type="text"
                    value={form.unit || ''}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    placeholder="°C, mm, %, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dimension One Health :</label>
                  <select
                    value={form.oneHealthDimension}
                    onChange={(e) => setForm({ ...form, oneHealthDimension: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="SANTE">Santé</option>
                    <option value="CLIMAT">Climat</option>
                    <option value="ENVIRONNEMENT">Environnement</option>
                    <option value="COMMUNAUTAIRE">Communautaire</option>
                    <option value="GEOGRAPHIE">Géographie</option>
                    <option value="DEMOGRAPHIE">Démographie</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type de donnée :</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="NUMBER">Numérique</option>
                    <option value="STRING">Texte</option>
                    <option value="BOOLEAN">Booléen</option>
                    <option value="DATE">Date</option>
                    <option value="CATEGORICAL">Catégoriel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Précisions :</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  placeholder="Expliquez l'origine et le calcul de la variable..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
              >
                Enregistrer la Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
