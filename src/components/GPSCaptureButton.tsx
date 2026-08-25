import React, { useState } from 'react';
import { Navigation, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { isWithinKindu } from '../data/kinduGeography';

interface GPSCaptureButtonProps {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  onCoordinatesCaptured: (lat: number, lng: number, accuracy?: number) => void;
  className?: string;
  allowSimulation?: boolean;
}

export const GPSCaptureButton: React.FC<GPSCaptureButtonProps> = ({
  latitude,
  longitude,
  accuracy,
  onCoordinatesCaptured,
  className = '',
  allowSimulation = true,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCaptureGPS = () => {
    setIsLocating(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg('La géolocalisation n\'est pas supportée par ce terminal.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const acc = position.coords.accuracy;

        onCoordinatesCaptured(lat, lng, acc);
        setIsLocating(false);
      },
      (error) => {
        let msg = 'Erreur lors de la capture GPS';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Autorisation GPS refusée. Veuillez activer la localisation.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Signal GPS indisponible sur cet appareil.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Délai d\'attente GPS expiré. Réessayez en extérieur.';
        }
        setErrorMsg(msg);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  };

  // Preset typical Kindu GPS test points (Center, Mikelenge, Basoko, Alunguli)
  const handleSimulateKinduPoint = () => {
    const kinduPoints = [
      { lat: -2.9438 + (Math.random() - 0.5) * 0.02, lng: 25.9224 + (Math.random() - 0.5) * 0.02, acc: 4.8 }, // Centre Mikelenge
      { lat: -2.9612 + (Math.random() - 0.5) * 0.02, lng: 25.9189 + (Math.random() - 0.5) * 0.02, acc: 6.2 }, // Basoko
      { lat: -2.9554 + (Math.random() - 0.5) * 0.02, lng: 25.9388 + (Math.random() - 0.5) * 0.02, acc: 5.5 }, // Alunguli Rive Droite
      { lat: -2.9298 + (Math.random() - 0.5) * 0.02, lng: 25.9312 + (Math.random() - 0.5) * 0.02, acc: 8.1 }, // Tokolote
    ];
    const pt = kinduPoints[Math.floor(Math.random() * kinduPoints.length)];
    onCoordinatesCaptured(pt.lat, pt.lng, pt.acc);
    setErrorMsg(null);
  };

  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude) && (latitude !== 0 || longitude !== 0);
  const inKindu = hasCoords ? isWithinKindu(latitude!, longitude!) : false;
  const isImprecise = accuracy !== undefined && accuracy > 20;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          id="btn-capture-gps-device"
          onClick={handleCaptureGPS}
          disabled={isLocating}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg font-medium text-xs sm:text-sm transition shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Acquisition satellite en cours...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Capturer GPS terrain</span>
            </>
          )}
        </button>

        {allowSimulation && (
          <button
            type="button"
            id="btn-simulate-kindu-gps"
            onClick={handleSimulateKinduPoint}
            title="Générer des coordonnées valides à Kindu pour les tests"
            className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Point Kindu (Test)</span>
          </button>
        )}

        {hasCoords && (
          <span className="text-xs text-slate-700 font-mono bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200">
            {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
            {accuracy !== undefined ? ` (±${Math.round(accuracy)}m)` : ''}
          </span>
        )}
      </div>

      {hasCoords && (
        <div className="space-y-1 text-xs">
          {inKindu ? (
            <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Position validée dans l'emprise territoriale de Kindu</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-sm font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Avertissement : Coordonnées situées en dehors de Kindu ([-3.05, 25.86] à [-2.87, 26.02])</span>
            </div>
          )}

          {isImprecise && (
            <div className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm font-medium ml-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Précision {accuracy}m &gt; 20m recommandée. Requis validation superviseur.</span>
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-700 flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-2 rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
};
