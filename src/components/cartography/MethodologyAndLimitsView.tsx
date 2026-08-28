import React from 'react';
import {
  BookOpen,
  AlertTriangle,
  Layers,
  Scale,
  ShieldAlert,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';

export const MethodologyAndLimitsView: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-8 text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-700" />
          <h2 className="text-lg font-bold text-slate-900">Méthodologie Cartographique & Limites des Données</h2>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Cadre conceptuel, gestion des échelles spatiales, résolutions temporelles et limites interprétatives strictes de la version V1.6.
        </p>
      </div>

      {/* 1. Spatial Resolution Hierarchy */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-700" />
          <span>1. Hiérarchie et Résolutions Spatiales des Données</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-emerald-800 block">Échelle Ponctuelle (Point / Site)</span>
            <p className="text-[11px] text-slate-600">
              • <strong>Données concernées :</strong> Ménages enquêtés, gîtes larvaires, dépôts de déchets, points d'eau.<br/>
              • <strong>Précision GPS :</strong> &lt; 5 mètres (WGS84).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-purple-800 block">Échelle Ponctuelle Structurelle</span>
            <p className="text-[11px] text-slate-600">
              • <strong>Données concernées :</strong> Hôpitaux Généraux (HGR), Centres de Santé (CS).<br/>
              • <strong>Nature :</strong> Points physiques d'enregistrement des cas hospitaliers.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-rose-800 block">Échelle Zonale (Aire de Santé)</span>
            <p className="text-[11px] text-slate-600">
              • <strong>Données concernées :</strong> Agrégation épidémiologique mensuelle (SNIS).<br/>
              • <strong>Polygones :</strong> 10 aires de santé urbaines de Kindu et Alunguli.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-sky-800 block">Échelle Macro-Urbaine (Ville)</span>
            <p className="text-[11px] text-slate-600">
              • <strong>Données concernées :</strong> Climatologie synoptique (Pluie, Température, Humidité).<br/>
              • <strong>Source unique :</strong> Station FZOA Aéroport Kindu.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Temporal Resolution Rules */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-700" />
          <span>2. Résolutions Temporelles & Dates de Validité Strictes</span>
        </h3>
        <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-xs space-y-2 leading-relaxed text-slate-700">
          <p>
            <strong>Principe fondamental de validité temporelle :</strong> Les observations environnementales possèdent des dates de début (<code className="font-mono text-teal-900">validity_start</code>) et de fin (<code className="font-mono text-teal-900">validity_end</code>).
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>
              <strong>Interdiction d'extrapolation rétrospective :</strong> L'état actuel d'un site ne doit JAMAIS être projeté automatiquement sur son état passé (ex: si un dépôt de déchets a été nettoyé en 2025 pour faire place à une construction, la carte de 2023 et 2024 doit fidèlement afficher le dépôt de déchets).
            </li>
            <li>
              <strong>Données sanitaires :</strong> Période mensuelle consolidée (pas de faux jour précis artificiel).
            </li>
            <li>
              <strong>Données climatiques :</strong> Relevés mensuels agrégés par station synoptique.
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Representation of Missing Data */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-teal-700" />
          <span>3. Traitement des Données Manquantes (ND vs 0)</span>
        </h3>
        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-xs space-y-2 leading-relaxed text-slate-700">
          <p className="font-bold text-amber-900">
            Règle scientifique stricte : Distinction formelle entre absence de donnée et valeur nulle.
          </p>
          <p className="text-[11px]">
            • Une absence de relevé météorologique ou sanitaire est affichée comme <span className="font-mono font-bold bg-amber-200/70 px-1 py-0.5 rounded text-amber-900">ND</span> (Non Disponible) ou <span className="font-mono font-bold bg-amber-200/70 px-1 py-0.5 rounded text-amber-900">Donnée non disponible</span>.<br/>
            • Elle n'est JAMAIS convertie automatiquement en zéro (0), car 0 mm de pluie réelle a une signification physique totalement opposée à un défaut de collecte.
          </p>
        </div>
      </div>

      {/* 4. Strictly Prohibited Claims (Scientific Guardrails) */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-700" />
          <span>4. Garde-fous Épistémologiques & Vocabulaire Banni en V1.6</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Vocabulaire Strictement Interdit en V1.6 :</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-950">
              <li>« Zone à risque » (Non calculé en V1.6)</li>
              <li>« Facteur causal démontré » (Nécessite modélisation économétrique)</li>
              <li>« Zone épidémique prédictive »</li>
              <li>« Prédiction future des cas »</li>
              <li>« Indice de Risque Synthétique (IIRSK) définitif »</li>
            </ul>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Vocabulaire Scientifique Autorisé en V1.6 :</span>
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-950">
              <li>« Données observées et documentées »</li>
              <li>« Répartition spatio-temporelle des cas déclarés »</li>
              <li>« Facteurs environnementaux inventoriés »</li>
              <li>« Concentrations spatiales observées »</li>
              <li>« Relevés pluviométriques de station »</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
