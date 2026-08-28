import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  CloudRain,
  Sun,
  Droplets,
} from 'lucide-react';

interface TemporalControlBarProps {
  selectedYear: number;
  selectedMonth: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
}

const MONTHS_LABELS = [
  { num: 1, name: 'Jan', fullName: 'Janvier', season: 'Petite Saison Sèche' },
  { num: 2, name: 'Fév', fullName: 'Février', season: 'Petite Saison Sèche' },
  { num: 3, name: 'Mar', fullName: 'Mars', season: 'Petite Saison des Pluies' },
  { num: 4, name: 'Avr', fullName: 'Avril', season: 'Petite Saison des Pluies' },
  { num: 5, name: 'Mai', fullName: 'Mai', season: 'Petite Saison des Pluies' },
  { num: 6, name: 'Juin', fullName: 'Juin', season: 'Grande Saison Sèche' },
  { num: 7, name: 'Juil', fullName: 'Juillet', season: 'Grande Saison Sèche' },
  { num: 8, name: 'Août', fullName: 'Août', season: 'Grande Saison Sèche' },
  { num: 9, name: 'Sep', fullName: 'Septembre', season: 'Grande Saison des Pluies' },
  { num: 10, name: 'Oct', fullName: 'Octobre', season: 'Grande Saison des Pluies' },
  { num: 11, name: 'Nov', fullName: 'Novembre', season: 'Grande Saison des Pluies (Pic)' },
  { num: 12, name: 'Déc', fullName: 'Décembre', season: 'Grande Saison des Pluies' },
];

export const TemporalControlBar: React.FC<TemporalControlBarProps> = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 1 = 1.2s per step, 2 = 0.6s, 0.5 = 2.4s
  const timerRef = useRef<any>(null);

  // Play loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = 1200 / playSpeed;

    timerRef.current = setInterval(() => {
      onMonthChange((prevMonth: number | null) => {
        const currentM = prevMonth === null ? 1 : prevMonth;
        if (currentM < 12) {
          return currentM + 1;
        } else {
          // Wrap or increment year
          if (selectedYear < 2025) {
            onYearChange(selectedYear + 1);
            return 1;
          } else {
            // Loop back to 2023 Jan
            onYearChange(2023);
            return 1;
          }
        }
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed, selectedYear, onMonthChange, onYearChange]);

  const handleStepBack = () => {
    if (selectedMonth === null || selectedMonth === 1) {
      if (selectedYear > 2023) {
        onYearChange(selectedYear - 1);
        onMonthChange(12);
      } else {
        onMonthChange(1);
      }
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleStepForward = () => {
    if (selectedMonth === null || selectedMonth === 12) {
      if (selectedYear < 2025) {
        onYearChange(selectedYear + 1);
        onMonthChange(1);
      } else {
        onMonthChange(12);
      }
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const currentMonthInfo = selectedMonth ? MONTHS_LABELS.find(m => m.num === selectedMonth) : null;

  return (
    <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Year Selector & Playback Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        {/* Years Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[2023, 2024, 2025].map(year => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                selectedYear === year
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={handleStepBack}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
            title="Mois précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lecture</span>
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
            title="Mois suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Speed Select */}
          <select
            value={playSpeed}
            onChange={e => setPlaySpeed(parseFloat(e.target.value))}
            className="text-[11px] font-semibold bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-700 focus:outline-hidden"
            title="Vitesse d'animation"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>
      </div>

      {/* Months Slider & Selector */}
      <div className="flex-1 w-full flex items-center gap-1 overflow-x-auto py-1">
        <button
          onClick={() => onMonthChange(null)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition border ${
            selectedMonth === null
              ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Année complète
        </button>

        {MONTHS_LABELS.map(m => {
          const isSelected = selectedMonth === m.num;
          return (
            <button
              key={m.num}
              onClick={() => onMonthChange(m.num)}
              className={`flex-1 min-w-[38px] py-1 px-1 text-xs font-bold rounded-md text-center transition border ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs ring-2 ring-teal-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Season and Period Information Banner */}
      <div className="w-full md:w-auto shrink-0 flex items-center gap-2 bg-teal-50/80 px-3 py-1.5 rounded-lg border border-teal-200 text-xs">
        {selectedMonth ? (
          <>
            {selectedMonth >= 9 || selectedMonth <= 5 ? (
              <CloudRain className="w-4 h-4 text-teal-700 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <div className="text-teal-900 leading-tight">
              <span className="font-bold">{currentMonthInfo?.fullName} {selectedYear}</span>
              <span className="text-teal-700 block text-[11px]">{currentMonthInfo?.season}</span>
            </div>
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
            <div className="text-teal-900 leading-tight">
              <span className="font-bold">Année {selectedYear}</span>
              <span className="text-teal-700 block text-[11px]">Consolidation annuelle (12 mois)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
