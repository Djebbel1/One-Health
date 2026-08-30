import React, { useState } from 'react';
import { FieldCampaign, FieldCampaignStatus, FieldCampaignPeriod } from '../../types';
import {
  Plus,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  FileText,
  Building2,
  Users,
  Target,
  ChevronRight,
  X
} from 'lucide-react';

interface CampaignsTabProps {
  campaigns: FieldCampaign[];
  onAddCampaign: (newCamp: FieldCampaign) => void;
  onUpdateCampaignStatus: (id: string, newStatus: FieldCampaignStatus) => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  onAddCampaign,
  onUpdateCampaignStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Form state for "+ Nouvelle Campagne"
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('Projet Recherche-Action One Health Maniema');
  const [protocol, setProtocol] = useState('PROT-OH-MN-2027-V2');
  const [territory, setTerritory] = useState('Kindu & Territoires limitrophes (Maniema)');
  const [managerName, setManagerName] = useState('Dr. Mukendi K.');
  const [startDate, setStartDate] = useState('2027-02-01');
  const [endDate, setEndDate] = useState('2027-11-30');
  const [targetQuestionnaires, setTargetQuestionnaires] = useState(1200);

  // Multi-pathologies selection
  const [selectedPathologies, setSelectedPathologies] = useState<{ [key: string]: boolean }>({
    PALUDISME: true,
    FIEVRE_TYPHOIDE: true,
    AUTRE_ENTERO: true,
    CHOLERA: false,
    ZOONOSES: false
  });

  // Multi-périodes dynamiques (Séries non codées en dur)
  const [periods, setPeriods] = useState<FieldCampaignPeriod[]>([
    {
      id: 'PER-1',
      name: 'Série 1 - Grande Saison des Pluies',
      year: 2027,
      startDate: '2027-02-01',
      endDate: '2027-05-31',
      isCurrent: true,
      targetCount: 500
    },
    {
      id: 'PER-2',
      name: 'Série 2 - Petite Saison Sèche',
      year: 2027,
      startDate: '2027-06-01',
      endDate: '2027-08-31',
      isCurrent: false,
      targetCount: 350
    },
    {
      id: 'PER-3',
      name: 'Série 3 - Petite Saison des Pluies',
      year: 2027,
      startDate: '2027-09-01',
      endDate: '2027-11-30',
      isCurrent: false,
      targetCount: 350
    }
  ]);

  const togglePathology = (key: string) => {
    setSelectedPathologies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddPeriod = () => {
    const nextNum = periods.length + 1;
    const newP: FieldCampaignPeriod = {
      id: `PER-${Date.now()}`,
      name: `Série ${nextNum} - Période Additionnelle`,
      year: 2027 + Math.floor(nextNum / 4),
      startDate: '2027-12-01',
      endDate: '2028-03-31',
      isCurrent: false,
      targetCount: 400
    };
    setPeriods([...periods, newP]);
  };

  const handleRemovePeriod = (id: string) => {
    if (periods.length <= 1) return;
    setPeriods(periods.filter((p) => p.id !== id));
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const activePaths = Object.keys(selectedPathologies).filter((k) => selectedPathologies[k]);
    const labelsMap: Record<string, string> = {
      PALUDISME: 'Paludisme (Plasmodium)',
      FIEVRE_TYPHOIDE: 'Fièvre Typhoïde (S. typhi)',
      AUTRE_ENTERO: 'Gastro-entérites hydriques',
      CHOLERA: 'Choléra & Diarrhées aiguës',
      ZOONOSES: 'Zoonoses & Contact Faune'
    };

    const newCamp: FieldCampaign = {
      id: `CAMP-${Date.now().toString().slice(-4)}`,
      name,
      description,
      project,
      protocol,
      pathologies: activePaths,
      pathologyLabels: activePaths.map((p) => labelsMap[p] || p),
      territory,
      targetHealthZones: ['Kindu', 'Alunguli'],
      periods,
      startDate,
      endDate,
      managerName,
      managerId: 'USR-MGR-CURRENT',
      status: 'PREPARATION',
      targetQuestionnaires: Number(targetQuestionnaires) || 1000,
      completedQuestionnaires: 0,
      isDemonstrationData: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    onAddCampaign(newCamp);
    setIsModalOpen(false);
    setName('');
    setDescription('');
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedStatusFilter === 'ALL') return true;
    return c.status === selectedStatusFilter;
  });

  const getStatusBadge = (status: FieldCampaignStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5" /><span>Active</span></span>;
      case 'PREPARATION':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /><span>Préparation</span></span>;
      case 'BROUILLON':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">Brouillon</span>;
      case 'SUSPENDUE':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center space-x-1"><AlertCircle className="w-3.5 h-3.5" /><span>Suspendue</span></span>;
      case 'TERMINEE':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">Terminée</span>;
      case 'ARCHIVEE':
        return <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full flex items-center space-x-1"><Archive className="w-3.5 h-3.5" /><span>Archivée</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* En-tête & Bouton Création */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-black rounded-md border border-teal-200 uppercase">
              V1.18 Opérations
            </span>
            <span className="text-xs text-slate-400 font-bold">•</span>
            <span className="text-xs text-slate-500 font-medium">Multi-pathologies &amp; Séries dynamiques</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Campagnes d Enquête de Terrain One Health
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadre organisationnel liant protocoles de recherche, équipes d enquêteurs et quotas géographiques.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filtre statut */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actives</option>
            <option value="PREPARATION">En préparation</option>
            <option value="TERMINEE">Terminées</option>
            <option value="ARCHIVEE">Archivées</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Campagne</span>
          </button>
        </div>
      </div>

      {/* Grille des Campagnes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => {
          const progressPercent = camp.targetQuestionnaires > 0
            ? Math.min(100, Math.round((camp.completedQuestionnaires / camp.targetQuestionnaires) * 100))
            : 0;

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* Ligne Titre & Statut */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {camp.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {camp.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>
                  <div>{getStatusBadge(camp.status)}</div>
                </div>

                {/* Métadonnées Clés */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Protocole &amp; Projet
                    </span>
                    <span className="font-bold text-slate-800 truncate block">
                      {camp.protocol}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {camp.project}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Territoire &amp; Responsable
                    </span>
                    <span className="font-bold text-slate-800 truncate block">
                      {camp.territory}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {camp.managerName}
                    </span>
                  </div>
                </div>

                {/* Pathologies Couvertes */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pathologies Investigées (Multi-Pathologies) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {camp.pathologyLabels.map((pl, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold rounded-lg"
                      >
                        🔬 {pl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Séries & Périodes Dynamiques */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Séries de Collecte Configurées ({camp.periods.length} périodes) :
                  </span>
                  <div className="space-y-1">
                    {camp.periods.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-teal-500" />
                          <span className="font-medium text-slate-800">{p.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                          <span>{p.startDate} → {p.endDate}</span>
                          <span className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            Cible : {p.targetCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Barre de Progression */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Progression globale de collecte</span>
                    <span className="font-mono font-bold text-teal-800">
                      {camp.completedQuestionnaires} / {camp.targetQuestionnaires} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Actions de Statut */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Créée le {camp.createdAt}
                </span>
                <div className="flex items-center space-x-2">
                  {camp.status === 'ACTIVE' ? (
                    <button
                      onClick={() => onUpdateCampaignStatus(camp.id, 'SUSPENDUE')}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition"
                    >
                      Suspendre
                    </button>
                  ) : camp.status === 'PREPARATION' ? (
                    <button
                      onClick={() => onUpdateCampaignStatus(camp.id, 'ACTIVE')}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition"
                    >
                      Activer la Campagne
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Création Nouvelle Campagne */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Création d une Nouvelle Campagne de Terrain
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configuration multi-pathologies et périodes dynamiques
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Nom de la Campagne *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Campagne One Health Kindu & Kasongo 2027"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Description &amp; Objectifs</label>
                <textarea
                  rows={2}
                  placeholder="Ex : Enquête ménage conjointe pour l analyse des déterminants environnementaux et hydriques..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Projet Associé</label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Protocole de Recherche</label>
                  <input
                    type="text"
                    value={protocol}
                    onChange={(e) => setProtocol(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Sélection Multi-pathologies */}
              <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="font-bold text-slate-800 block">
                  Pathologies Cibles (Approche One Health Intégrée) :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'PALUDISME', label: 'Paludisme' },
                    { key: 'FIEVRE_TYPHOIDE', label: 'Fièvre Typhoïde' },
                    { key: 'AUTRE_ENTERO', label: 'Entéropathogènes' },
                    { key: 'CHOLERA', label: 'Choléra' },
                    { key: 'ZOONOSES', label: 'Zoonoses Faune' }
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPathologies[item.key] || false}
                        onChange={() => togglePathology(item.key)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-slate-800 font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Séries / Périodes Dynamiques */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Périodes / Séries d Étude (Nombre non figé) :
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPeriod}
                    className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold rounded-lg transition text-[11px]"
                  >
                    + Ajouter une Série
                  </button>
                </div>

                <div className="space-y-1.5">
                  {periods.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => {
                          const updated = [...periods];
                          updated[idx].name = e.target.value;
                          setPeriods(updated);
                        }}
                        className="flex-1 p-1 border rounded text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Cible"
                        value={p.targetCount}
                        onChange={(e) => {
                          const updated = [...periods];
                          updated[idx].targetCount = Number(e.target.value);
                          setPeriods(updated);
                        }}
                        className="w-20 p-1 border rounded text-xs text-center"
                      />
                      {periods.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePeriod(p.id)}
                          className="text-rose-500 hover:text-rose-700 px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Territoire / Zone</label>
                  <input
                    type="text"
                    value={territory}
                    onChange={(e) => setTerritory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Responsable de Campagne</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Créer la Campagne
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
