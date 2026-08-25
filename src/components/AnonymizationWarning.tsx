import React from 'react';
import { ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

interface AnonymizationWarningProps {
  detectedWarning?: string | null;
  compact?: boolean;
}

export const AnonymizationWarning: React.FC<AnonymizationWarningProps> = ({
  detectedWarning,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Protocole d'anonymisation strict actif (RGPD / Comité Éthique UNIKI)</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-3.5 text-xs text-teal-900 shadow-xs space-y-1.5">
      <div className="flex items-center gap-2 font-bold text-teal-950">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>Protocole d'Anonymisation Recherche Scientifique (One Health Kindu)</span>
      </div>
      <p className="text-teal-800 leading-relaxed">
        Conformément aux normes éthiques universitaires, la saisie des noms, prénoms, numéros de téléphone et coordonnées personnelles des patients et enquêtés est <strong>strictement interdite</strong>. Utilisez uniquement les codes anonymisés générés automatiquement.
      </p>

      {detectedWarning && (
        <div className="mt-2 p-2 bg-rose-100 border border-rose-300 text-rose-900 rounded-md flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Alerte éthique : {detectedWarning}</span>
        </div>
      )}
    </div>
  );
};
