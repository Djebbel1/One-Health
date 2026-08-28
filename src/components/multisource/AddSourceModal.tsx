import React, { useState } from 'react';
import {
  DataSourceEntity,
  DataSourceType,
  CoverageLevelType,
  DataFrequencyType,
  FileSourceFormat
} from '../../types';
import {
  Plus,
  Building2,
  Calendar,
  Layers,
  Database,
  FileSpreadsheet,
  Globe,
  Info
} from 'lucide-react';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: DataSourceEntity) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DataSourceType>('SANITAIRE');
  const [subType, setSubType] = useState('');
  const [organization, setOrganization] = useState('');
  const [description, setDescription] = useState('');
  const [periodStart, setPeriodStart] = useState('2018');
  const [periodEnd, setPeriodEnd] = useState('2026');
  const [coverageLevel, setCoverageLevel] = useState<CoverageLevelType>('COMPLETE');
  const [frequency, setFrequency] = useState<DataFrequencyType>('MENSUELLE');
  const [format, setFormat] = useState<FileSourceFormat>('EXCEL');
  const [geographicLevel, setGeographicLevel] = useState<DataSourceEntity['geographicLevel']>('ZONE_SANTE');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organization) return;

    const newSource: DataSourceEntity = {
      id: `SRC-${type.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      name,
      type,
      subType: subType || 'Source externe documentée',
      description: description || 'Source de données déclarée dans le référentiel One Health.',
      organization,
      periodStart,
      periodEnd,
      geographicLevel,
      frequency,
      format,
      status: 'ACTIF',
      importDate: new Date().toISOString().substring(0, 10),
      importedBy: 'Superviseur DPS Maniema',
      estimatedQuality: 'BONNE',
      coverageLevel,
      notes,
      isInternal: false,
      isDemo: false,
      totalImportsCount: 0,
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10)
    };

    onSave(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-600" />
            Déclarer une Nouvelle Source de Données One Health
          </h3>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nom complet de la source *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Registre de laboratoire HGR Kasongo"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Type de source *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DataSourceType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="SANITAIRE">Sanitaire (FOSA, Registres, SNIS)</option>
                <option value="CLIMATIQUE">Climatique (Mettelsat, Stations)</option>
                <option value="ENVIRONNEMENTALE">Environnementale (Gîtes, Déchets)</option>
                <option value="GEOGRAPHIQUE">Géographique / SIG</option>
                <option value="COMMUNAUTAIRE">Communautaire (Enquêtes ménages)</option>
                <option value="AUTRE">Autre source</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sous-type / Modalité</label>
              <input
                type="text"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                placeholder="Ex: Registre d'hospitalisation"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Organisme producteur *</label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Ex: DPS Maniema / METTELSAT"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Format de fichier</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as FileSourceFormat)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="EXCEL">Excel (.xlsx, .xls)</option>
                <option value="CSV">CSV délimité</option>
                <option value="JSON">JSON / API</option>
                <option value="SHAPEFILE_GEOJSON">SIG / GeoJSON</option>
                <option value="MANUEL">Saisie Manuelle</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Période Début</label>
              <input
                type="text"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                placeholder="2018"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Période Fin</label>
              <input
                type="text"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fréquence</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as DataFrequencyType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="JOURNALIERE">Journalière</option>
                <option value="HEBDOMADAIRE">Hebdomadaire</option>
                <option value="MENSUELLE">Mensuelle</option>
                <option value="ANNUELLE">Annuelle</option>
                <option value="PONCTUELLE">Ponctuelle / Campagne</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Niveau Géographique</label>
              <select
                value={geographicLevel}
                onChange={(e) => setGeographicLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="ZONE_SANTE">Zone de Santé</option>
                <option value="AIRE_SANTE">Aire de Santé</option>
                <option value="SITE_VILLAGE">Site / Village</option>
                <option value="COORDONNEES_GPS">Coordonnées GPS directes</option>
                <option value="TERRITOIRE">Territoire</option>
                <option value="PROVINCE">Province entière</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Niveau de Couverture</label>
              <select
                value={coverageLevel}
                onChange={(e) => setCoverageLevel(e.target.value as CoverageLevelType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="COMPLETE">Complète (100% de la zone)</option>
                <option value="PARTIELLE">Partielle</option>
                <option value="PONCTUELLE">Ponctuelle</option>
                <option value="DISCONTINUE">Discontinue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Spécificités</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Décrivez les variables contenues et le mode de collecte..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-xs"
            >
              Enregistrer la Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
