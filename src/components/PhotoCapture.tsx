import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface PhotoCaptureProps {
  photoUrl?: string;
  onPhotoChange: (url?: string) => void;
  label?: string;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photoUrl,
  onPhotoChange,
  label = 'Photo du cadre environnemental / gîte',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide.');
      return;
    }

    // Limit to 5MB before compression
    if (file.size > 8 * 1024 * 1024) {
      setError('L\'image est trop volumineuse (max 8 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress using canvas to ~800px max width for lightweight storage
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          onPhotoChange(compressedDataUrl);
        } else {
          onPhotoChange(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {photoUrl ? (
        <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-100 max-w-xs">
          <img
            src={photoUrl}
            alt="Capture terrain"
            className="w-full h-40 object-cover"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={() => onPhotoChange(undefined)}
            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition shadow-md"
            title="Supprimer la photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition"
          >
            <Camera className="w-4 h-4 text-teal-600" />
            <span>Prendre photo / Caméra</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition"
          >
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>Choisir fichier</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
