import React from 'react';
import { CartoLayerConfig, CartoDiseaseFilter } from '../../types';
import {
  Info,
  Layers,
  Activity,
  Bug,
  Droplet,
  Waves,
  Building2,
  Home,
  CloudRain,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface MapLegendViewProps {
  layers: CartoLayerConfig[];
  selectedDisease: CartoDiseaseFilter;
}

export const MapLegendView: React.FC<MapLegendViewProps> = ({
  layers,
  selectedDisease,
}) => {
  const isVisible = (layerId: string) => layers.find(l => l.id === layerId)?.visible;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Info className="w-5 h-5 text-teal-700" />
        <div>
          <h3 className="font-bold text-sm text-slate-900">Légende Cartographique Dynamique</h3>
          <p className="text-xs text-slate-500">
            Symboles et conventions sémiologiques normalisés de la cartographie One Health Kindu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Section 1: Sanitaire */}
        {isVisible('LAYER_03_SANTE') && (
          <div className="bg-rose-50/50 p-3.5 rounded-lg border border-rose-200 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-1.5 border-b border-rose-200 pb-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Données Sanitaires (Cas)</span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white"></div>
                <span>Paludisme (TDR/GE confirmés)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-600 border border-white"></div>
                <span>Fièvre Typhoïde (Clinique/Widal)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white"></div>
                <span>Cas consolidés (Les deux)</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-rose-100">
                • <strong>Taille des cercles :</strong> Proportionnelle au nombre de cas observés.
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Environnement */}
        {isVisible('LAYER_02_ENVIRONNEMENT') && (
          <div className="bg-teal-50/50 p-3.5 rounded-lg border border-teal-200 space-y-2">
            <div className="font-bold text-teal-900 flex items-center gap-1.5 border-b border-teal-200 pb-1.5">
              <Bug className="w-4 h-4 text-teal-600" />
              <span>Facteurs Environnementaux</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                <span>Eau stagnante & gîte larvaire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                <span>Dépôt de déchets / décharge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-900"></div>
                <span>Caniveau bouché / sédimenté</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                <span>Végétation dense & friches</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Points d'Eau */}
        {isVisible('LAYER_05_EAU') && (
          <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200 space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-1.5 border-b border-blue-200 pb-1.5">
              <Droplet className="w-4 h-4 text-blue-600" />
              <span>Points d'Approvisionnement</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span>Point protégé (Forage / Borne / Captage)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                <span>Point non protégé (Puits ouvert / Fleuve)</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Inondations & Risques */}
        {isVisible('LAYER_06_INONDATION') && (
          <div className="bg-cyan-50/50 p-3.5 rounded-lg border border-cyan-200 space-y-2">
            <div className="font-bold text-cyan-900 flex items-center gap-1.5 border-b border-cyan-200 pb-1.5">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span>Inondations & Submersion</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-cyan-400/60 border border-cyan-600 rounded-xs"></div>
                <span>Inondation observée (Fait historique)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-amber-200/50 border border-dashed border-amber-600 rounded-xs"></div>
                <span>Zone potentiellement inondable</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Infrastructures et Limites */}
        {isVisible('LAYER_07_INFRASTRUCTURES_SANITAIRES') && (
          <div className="bg-purple-50/50 p-3.5 rounded-lg border border-purple-200 space-y-2">
            <div className="font-bold text-purple-900 flex items-center gap-1.5 border-b border-purple-200 pb-1.5">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Structures Sanitaires</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px]">H</span>
                <span>Hôpital Général (HGR)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[9px]">+</span>
                <span>Centre de Santé (CS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">P</span>
                <span>Poste de Santé (PS)</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Ménages Enquêtés */}
        {isVisible('LAYER_01_MENAGES') && (
          <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-200 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 border-b border-emerald-200 pb-1.5">
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Ménages Enquêtés (Anonyme)</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                <span>Ménage enquêté géoréférencé</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                Aucune information personnelle identifiable (PII) n'est diffusée.
              </p>
            </div>
          </div>
        )}

        {/* Section 7: Climat */}
        {isVisible('LAYER_04_CLIMAT') && (
          <div className="bg-sky-50/50 p-3.5 rounded-lg border border-sky-200 space-y-2">
            <div className="font-bold text-sky-900 flex items-center gap-1.5 border-b border-sky-200 pb-1.5">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <span>Climatologie</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px]">☁</div>
                <span>Station Météo Kindu-Aéroport (FZOA)</span>
              </div>
              <p className="text-[10px] text-sky-800">
                Résolution : Macro-échelle urbaine (Ville de Kindu).
              </p>
            </div>
          </div>
        )}

        {/* Section 8: Limites Administratives */}
        {isVisible('LAYER_08_LIMITES_ADMINISTRATIVES') && (
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>Limites Administratives</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500"></div>
                <span>Zone Kindu (Rive Droite)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-amber-500"></div>
                <span>Zone Alunguli (Rive Gauche)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-sky-300 rounded-xs"></div>
                <span>Fleuve Congo</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
