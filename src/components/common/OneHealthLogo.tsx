import React from 'react';
import { Activity, Shield, Sparkles, Layers, Globe } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface OneHealthLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'badge' | 'placeholder_only';
  showTerritoryBadge?: boolean;
  showTagline?: boolean;
  className?: string;
  officialLogoUrl?: string | null;
  onLogoClick?: () => void;
}

/**
 * Composant Logo ONE HEALTH MANIEMA (V1.21)
 * 
 * Conforme aux directives de présentation institutionnelle :
 * 1. N'invente aucun faux logo présenté comme officiel.
 * 2. Fournit un emplacement réservé normé et élégant ("LOGO ONE HEALTH - Emplacement réservé").
 * 3. Prépare la structure d'accueil pour un fichier SVG/PNG officiel ultérieur via la prop `officialLogoUrl`.
 * 4. Sépare visuellement le concept One Health de tout logo universitaire/institutionnel futur.
 */
export const OneHealthLogo: React.FC<OneHealthLogoProps> = ({
  size = 'md',
  variant = 'full',
  showTerritoryBadge = true,
  showTagline = false,
  className = '',
  officialLogoUrl = null,
  onLogoClick
}) => {
  const sizeStyles = {
    xs: {
      box: 'w-7 h-7 rounded-lg',
      icon: 'w-4 h-4',
      title: 'text-xs font-black tracking-tight',
      tagline: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.2'
    },
    sm: {
      box: 'w-8 h-8 rounded-lg',
      icon: 'w-4.5 h-4.5',
      title: 'text-sm font-bold tracking-tight',
      tagline: 'text-[10px]',
      badge: 'text-[10px] px-2 py-0.5'
    },
    md: {
      box: 'w-10 h-10 rounded-xl',
      icon: 'w-5 h-5',
      title: 'text-base sm:text-lg font-extrabold tracking-tight',
      tagline: 'text-xs',
      badge: 'text-[10px] px-2.5 py-0.5'
    },
    lg: {
      box: 'w-14 h-14 rounded-2xl',
      icon: 'w-7 h-7',
      title: 'text-xl sm:text-2xl font-black tracking-tight',
      tagline: 'text-sm',
      badge: 'text-xs px-3 py-1'
    },
    xl: {
      box: 'w-20 h-20 rounded-3xl',
      icon: 'w-10 h-10',
      title: 'text-2xl sm:text-3xl font-black tracking-tight',
      tagline: 'text-sm sm:text-base',
      badge: 'text-xs px-3.5 py-1'
    }
  }[size];

  // Visual Emblem / Official Slot
  const logoEmblem = (
    <div
      className={`relative shrink-0 ${sizeStyles.box} bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-emerald-500/30 transition-transform active:scale-95 group overflow-hidden`}
      title="Emblème One Health Maniema — Santé Humaine, Animale & Écosystèmes"
      aria-label="Logo One Health"
      role="img"
    >
      {officialLogoUrl ? (
        <img
          src={officialLogoUrl}
          alt="Logo One Health Officiel"
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <div className="flex items-center justify-center relative w-full h-full">
          {/* Subtle nexus geometry representing the 3 One Health interconnected rings */}
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center">
            <svg
              className="w-full h-full p-1.5 opacity-90 text-white"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Ring 1: Human Health (Top) */}
              <circle cx="50" cy="35" r="22" className="stroke-emerald-200" strokeDasharray="3 3" />
              {/* Ring 2: Animal Health (Bottom Left) */}
              <circle cx="34" cy="62" r="22" className="stroke-teal-200" />
              {/* Ring 3: Environment/Climate (Bottom Right) */}
              <circle cx="66" cy="62" r="22" className="stroke-cyan-200" />
              {/* Central nexus node */}
              <circle cx="50" cy="50" r="4" className="fill-white stroke-none" />
            </svg>
          </div>
          <Activity className={`${sizeStyles.icon} text-white z-10 drop-shadow-xs`} />
        </div>
      )}
    </div>
  );

  if (variant === 'placeholder_only') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs font-semibold ${className}`}>
        {logoEmblem}
        <div className="text-left">
          <span className="block text-[11px] font-black uppercase tracking-wider text-emerald-400">
            {APP_CONFIG.name}
          </span>
          <span className="block text-[10px] text-slate-400">
            {APP_CONFIG.logoPlaceholderText}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        onClick={onLogoClick}
        className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
      >
        {logoEmblem}
        <span className={`${sizeStyles.title} text-white font-extrabold`}>
          {APP_CONFIG.name}
        </span>
        {showTerritoryBadge && (
          <span className={`${sizeStyles.badge} uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
            {APP_CONFIG.primaryRegion} — RDC
          </span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onLogoClick}
        className={`flex items-center gap-2.5 cursor-pointer ${className}`}
      >
        {logoEmblem}
        <div>
          <div className="flex items-center gap-2">
            <span className={`${sizeStyles.title} text-white font-extrabold`}>
              {APP_CONFIG.name}
            </span>
            {showTerritoryBadge && (
              <span className={`${sizeStyles.badge} uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
                {APP_CONFIG.primaryRegion}
              </span>
            )}
          </div>
          {showTagline && (
            <p className={`${sizeStyles.tagline} text-slate-400 line-clamp-1`}>
              {APP_CONFIG.tagline}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full Variant
  return (
    <div
      onClick={onLogoClick}
      className={`flex items-center gap-3 cursor-pointer ${className}`}
    >
      {logoEmblem}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${sizeStyles.title} text-white font-black tracking-tight`}>
            {APP_CONFIG.name}
          </span>
          {showTerritoryBadge && (
            <span className={`${sizeStyles.badge} uppercase font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap shadow-xs`}>
              {APP_CONFIG.primaryRegion} — RDC
            </span>
          )}
        </div>
        {showTagline && (
          <p className={`${sizeStyles.tagline} text-slate-300 mt-0.5 max-w-xl font-normal leading-relaxed`}>
            {APP_CONFIG.tagline}
          </p>
        )}
      </div>
    </div>
  );
};
