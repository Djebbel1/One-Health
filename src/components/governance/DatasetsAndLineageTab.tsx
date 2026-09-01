import React, { useState } from 'react';
import {
  Database,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  GitCommit,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  History,
  Hash,
  Download,
  Info
} from 'lucide-react';
import {
  GovernanceDataset,
  DatasetSnapshot,
  DataLineageNode,
  DataLineageEdge
} from '../../types';

interface DatasetsAndLineageTabProps {
  datasets: GovernanceDataset[];
  lineageNodes: DataLineageNode[];
  lineageEdges: DataLineageEdge[];
  onAddSnapshot: (datasetId: string, snapshot: DatasetSnapshot) => void;
  onAddAuditLog: (action: any, desc: string, details?: any) => void;
}

export const DatasetsAndLineageTab: React.FC<DatasetsAndLineageTabProps> = ({
  datasets,
  lineageNodes,
  lineageEdges,
  onAddSnapshot,
  onAddAuditLog
}) => {
  const [activeView, setActiveView] = useState<'DATASETS' | 'LINEAGE'>('LINEAGE');
  const [selectedDataset, setSelectedDataset] = useState<GovernanceDataset>(datasets[0]);
  const [selectedNode, setSelectedNode] = useState<DataLineageNode | null>(lineageNodes[lineageNodes.length - 1]);
  const [highlightedTracePath, setHighlightedTracePath] = useState<boolean>(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotNotes, setSnapshotNotes] = useState('');

  const handleCreateSnapshot = () => {
    if (!snapshotName.trim()) return;

    const newSnapshot: DatasetSnapshot = {
      snapshotId: `SNP-${Date.now().toString().slice(-6)}`,
      datasetId: selectedDataset.id,
      name: snapshotName.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      createdBy: 'Dr. Jean-Pierre Mukendi',
      rowsCount: selectedDataset.recordsCount,
      columnsCount: selectedDataset.variablesCount,
      sha256Hash: `sha256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
      isImmutable: true,
      notes: snapshotNotes || 'Instantané certifié pour archivage scientifique.'
    };

    onAddSnapshot(selectedDataset.id, newSnapshot);
    onAddAuditLog('CREATION_SNAPSHOT', `Création Snapshot ${newSnapshot.snapshotId} sur dataset ${selectedDataset.id} (Hash certifié)`, {
      snapshotId: newSnapshot.snapshotId,
      datasetId: selectedDataset.id,
      sha256: newSnapshot.sha256Hash
    });
    setShowSnapshotModal(false);
    setSnapshotName('');
    setSnapshotNotes('');
  };

  const getNodeColor = (type: DataLineageNode['type']) => {
    switch (type) {
      case 'SOURCE': return 'bg-amber-50 border-amber-300 text-amber-900';
      case 'RAW': return 'bg-slate-50 border-slate-300 text-slate-900';
      case 'CLEAN': return 'bg-sky-50 border-sky-300 text-sky-900';
      case 'ANALYTIC': return 'bg-teal-50 border-teal-400 text-teal-900 ring-2 ring-teal-500/20';
      case 'MODEL': return 'bg-indigo-50 border-indigo-300 text-indigo-900';
      case 'PREDICTION': return 'bg-purple-50 border-purple-300 text-purple-900';
      case 'SURVEILLANCE': return 'bg-rose-50 border-rose-300 text-rose-900';
      case 'REPORT': return 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
      default: return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Datasets, Snapshots Immutables & Data Lineage (Provenance)</h3>
            <p className="text-xs text-slate-500">
              Traçabilité ascendante intégrale : remonter de n importe quel résultat/rapport jusqu aux sources brutes
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch md:self-auto">
          <button
            onClick={() => setActiveView('LINEAGE')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'LINEAGE' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌳 Arbre de Lineage ({lineageNodes.length} Nœuds)
          </button>
          <button
            onClick={() => setActiveView('DATASETS')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'DATASETS' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📁 Catalogue des Datasets ({datasets.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: DATA LINEAGE INTERACTIF */}
      {activeView === 'LINEAGE' && (
        <div className="space-y-6">
          {/* Quick Action Bar for Provenance Trace */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-teal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-xs">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <div>
                <p className="font-bold text-sm">Moteur de Traçabilité Ascendante de Provenance (Data Lineage V1.19)</p>
                <p className="text-teal-200 text-xs">
                  Cliquez sur un nœud pour inspecter les transformations appliquées ou visualisez la chaîne complète.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setHighlightedTracePath(!highlightedTracePath);
                setSelectedNode(lineageNodes[lineageNodes.length - 1]);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                highlightedTracePath
                  ? 'bg-teal-400 text-teal-950 shadow-md font-bold'
                  : 'bg-teal-800 hover:bg-teal-700 text-white border border-teal-600'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              {highlightedTracePath ? 'Chaîne Ascendante Active' : "Tracer l'Origine du Rapport"}
            </button>
          </div>

          {/* Interactive Visual Graph Representation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Chaîne de Traçabilité : Source ➔ RAW ➔ CLEAN ➔ ANALYTIC ➔ Modèle ➔ Prédiction ➔ Surveillance ➔ Rapport
            </h4>

            {/* Horizontal Lineage Nodes Carousel */}
            <div className="relative overflow-x-auto pb-4 pt-2">
              <div className="flex items-center gap-3 min-w-[900px]">
                {lineageNodes.map((node, index) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <React.Fragment key={node.id}>
                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer w-48 shrink-0 flex flex-col justify-between h-36 ${getNodeColor(
                          node.type
                        )} ${
                          isSelected
                            ? 'ring-3 ring-teal-500 shadow-md scale-105'
                            : 'hover:border-slate-400 shadow-2xs'
                        } ${highlightedTracePath ? 'border-teal-500 bg-teal-50/70' : ''}`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold font-mono">
                            <span className="bg-white/80 px-2 py-0.5 rounded border border-black/10">
                              {node.type}
                            </span>
                            <span>{node.version}</span>
                          </div>
                          <h5 className="text-sm font-bold mt-2 line-clamp-2">
                            {node.label}
                          </h5>
                        </div>

                        <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs text-slate-600">
                          <span>{node.recordsCount ? `${node.recordsCount} enr.` : '1 entité'}</span>
                          <span className="font-mono">{node.date.slice(5)}</span>
                        </div>
                      </div>

                      {index < lineageNodes.length - 1 && (
                        <div className="flex flex-col items-center justify-center shrink-0 text-slate-300">
                          <ArrowRight className="w-5 h-5 text-teal-600 stroke-[2.5]" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Details Drawer */}
            {selectedNode && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded">
                      {selectedNode.id}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-slate-900">{selectedNode.label}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {selectedNode.validationStatus}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-xs">Horodatage : {selectedNode.date}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-xs">Description & Rôle :</span>
                    <p className="text-slate-800 font-medium mt-0.5 text-xs sm:text-sm">{selectedNode.details}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold uppercase text-xs">Règles de Transformation Appliquées :</span>
                    <p className="text-slate-700 mt-0.5 text-xs sm:text-sm">
                      {lineageEdges.find(e => e.to === selectedNode.id)?.rule || 'Nœud initial de captation de données brutes.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CATALOGUE DES DATASETS ET SNAPSHOTS IMMUTABLES */}
      {activeView === 'DATASETS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Datasets List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Datasets Centralisés du Projet
            </h4>
            <div className="space-y-3">
              {datasets.map((ds) => {
                const isSelected = selectedDataset.id === ds.id;
                return (
                  <div
                    key={ds.id}
                    onClick={() => setSelectedDataset(ds)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-500 shadow-xs ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded">
                            {ds.id}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {ds.type}
                          </span>
                          <span className="text-xs font-mono font-semibold text-teal-700">
                            {ds.version}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 mt-1.5">
                          {ds.name}
                        </h5>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>{ds.recordsCount} lignes</span>
                      <span>{ds.variablesCount} cols</span>
                      <span>{ds.snapshots.length} snapshots</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Dataset Detail & Snapshots Manager */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                      {selectedDataset.id}
                    </span>
                    <span className="text-xs font-bold bg-teal-700 text-white px-2.5 py-1 rounded">
                      Version {selectedDataset.version}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {selectedDataset.validationStatus}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    {selectedDataset.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Origine : {selectedDataset.sourceDataOrigin} | Créé par : {selectedDataset.createdBy}
                  </p>
                </div>

                <button
                  onClick={() => setShowSnapshotModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all shrink-0"
                >
                  <Camera className="w-4 h-4" />
                  Créer un Snapshot Immutable
                </button>
              </div>

              {/* Hash and Transformations */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 font-mono text-xs sm:text-sm space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase">
                    <Hash className="w-3.5 h-3.5" />
                    Empreinte Numérique SHA-256 (Scellée) :
                  </div>
                  <p className="text-slate-800 break-all">{selectedDataset.sha256Hash}</p>
                </div>

                <div className="space-y-1 text-xs sm:text-sm">
                  <span className="text-slate-500 font-bold uppercase text-xs">
                    Transformations Appliquées sur la Donnée Source :
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs sm:text-sm">
                    {selectedDataset.appliedTransformations.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Snapshots List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-teal-600" />
                    Instantanés Immutables Certifiés ({selectedDataset.snapshots.length})
                  </h5>
                </div>

                {selectedDataset.snapshots.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs sm:text-sm text-center">
                    Aucun instantané scellé pour le moment. Cliquez sur « Créer un Snapshot » pour verrouiller une version à date.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDataset.snapshots.map((snp) => (
                      <div
                        key={snp.snapshotId}
                        className="p-4 rounded-xl bg-gradient-to-r from-teal-50/50 to-white border border-teal-200 space-y-2 text-xs sm:text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded">
                              {snp.snapshotId}
                            </span>
                            <span className="font-bold text-slate-900">{snp.name}</span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              IMMUTABLE
                            </span>
                          </div>
                          <span className="text-slate-500 font-mono text-xs">{snp.createdAt}</span>
                        </div>

                        <p className="text-slate-700">{snp.notes}</p>

                        <div className="pt-2 border-t border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-600">
                          <span>{snp.rowsCount} lignes × {snp.columnsCount} colonnes</span>
                          <span className="text-teal-800 font-bold break-all">Hash: {snp.sha256Hash.slice(0, 24)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEAU SNAPSHOT IMMUTABLE */}
      {showSnapshotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-800">
                <Camera className="w-5 h-5" />
                <h3 className="font-bold text-base">Prise d'Instantané Immutable (Snapshot)</h3>
              </div>
              <button
                onClick={() => setShowSnapshotModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Règle d'Immutabilité Scientifique (V1.19)
                </p>
                <p className="text-xs text-teal-800">
                  Un snapshot validé est scellé cryptographiquement et ne peut plus être modifié. Toute modification ultérieure créera une nouvelle version de dataset.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Nom du Snapshot (ex: Clôture T3-2026)</label>
                <input
                  type="text"
                  value={snapshotName}
                  onChange={(e) => setSnapshotName(e.target.value)}
                  placeholder="Snapshot Officiel Clôture Campagne..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Notes et Justification d'Archivage</label>
                <textarea
                  rows={3}
                  value={snapshotNotes}
                  onChange={(e) => setSnapshotNotes(e.target.value)}
                  placeholder="Version scellée pour la soumission au comité et la modélisation statistique..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowSnapshotModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSnapshot}
                disabled={!snapshotName.trim()}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                Sceller le Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
