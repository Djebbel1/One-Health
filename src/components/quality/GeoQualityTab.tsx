import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Layers,
  Search,
  Crosshair
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { INITIAL_GEO_REFERENCES, KINDU_STUDY_BOUNDS, isWithinKinduBounds } from '../../data/geoReferenceData';
import { validateGpsCoordinates } from '../../utils/dataNormalizationEngine';

export const GeoQualityTab: React.FC = () => {
  const { geoReferences } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [testLat, setTestLat] = useState<string>('500');
  const [testLng, setTestLng] = useState<string>('25.92');
  const [testResult, setTestResult] = useState<any>(null);

  const filteredGeo = geoReferences.filter(g =>
    g.official_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.alternative_names.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const runGpsTest = () => {
    const lat = parseFloat(testLat);
    const lng = parseFloat(testLng);
    const res = validateGpsCoordinates(lat, lng);
    setTestResult(res);
  };

  return (
    <div className="space-y-6">
      {/* CADRE MÉTHODOLOGIQUE : RÉFÉRENTIEL GÉOGRAPHIQUE UNIQUE (Section 40, 41, 42) */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-teal-400 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Référentiel Géographique Officiel : Table GEO_REFERENCE</span>
          </h3>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
            Nomenclature DPS / Cartographie Validée
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          La table <code className="font-mono bg-slate-800 text-teal-300 px-1 py-0.5 rounded">GEO_REFERENCE</code> sert de table de vérité spatiale pour toute l’application. Elle harmonise les identifiants uniques, gère les variantes toponymiques (alias), documente les coordonnées GPS officielles et contrôle l’emprise d’étude de Kindu.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Emprise Latitude</span>
            <span className="font-bold text-slate-200">[{KINDU_STUDY_BOUNDS.minLat}° &agrave; {KINDU_STUDY_BOUNDS.maxLat}°]</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Emprise Longitude</span>
            <span className="font-bold text-slate-200">[{KINDU_STUDY_BOUNDS.minLng}° &agrave; {KINDU_STUDY_BOUNDS.maxLng}°]</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Zones de Santé</span>
            <span className="font-bold text-slate-200">2 (Kindu &amp; Alunguli)</span>
          </div>
          <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block">Aires de Santé</span>
            <span className="font-bold text-slate-200">10 Référencées</span>
          </div>
        </div>
      </div>

      {/* BANC DE TEST GPS INTERACTIF (Section 16, 17, 69) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-rose-600" />
          <span>Contrôle de Validité des Coordonnées GPS (Test Interactif Section 69)</span>
        </h3>
        <p className="text-xs text-slate-500">
          Vérification automatique des bornes physiques (-90..90, -180..180) et de l’appartenance à la zone d’étude de Kindu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Latitude testée :</label>
            <input
              type="text"
              value={testLat}
              onChange={e => setTestLat(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Longitude testée :</label>
            <input
              type="text"
              value={testLng}
              onChange={e => setTestLng(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={runGpsTest}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tester la Coordonnée</span>
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs ${
              testResult.isValidCoords && testResult.isWithinBounds
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {testResult.isValidCoords && testResult.isWithinBounds ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Point GPS Valide et Conforme à l’Emprise Kindu</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Point GPS Non Conforme / Rejeté</span>
                </>
              )}
            </div>
            {testResult.errors.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                {testResult.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
            <div className="text-[11px] mt-1 text-slate-600">
              Qualité estimée du signal : <strong>{testResult.gpsQuality}</strong>
            </div>
          </div>
        )}
      </div>

      {/* TABLE DES ENTITÉS GÉOGRAPHIQUES NORMALISÉES */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Entités Géographiques Référencées ({filteredGeo.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Liste officielle des provinces, villes, zones, aires, structures de santé et quartiers.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher aire, alias, ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-bold">Identifiant Unique (ID)</th>
                <th className="p-2.5 font-bold">Type</th>
                <th className="p-2.5 font-bold">Nom Officiel</th>
                <th className="p-2.5 font-bold">Variantes / Alias Acceptés</th>
                <th className="p-2.5 font-bold">Coordonnées GPS</th>
                <th className="p-2.5 font-bold text-center">Qualité GPS</th>
                <th className="p-2.5 font-bold text-center">Emprise Kindu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredGeo.map((g, idx) => (
                <tr key={g.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2.5 font-mono text-[11px] font-bold text-slate-900">
                    {g.id}
                  </td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-semibold text-[10px] rounded">
                      {g.type}
                    </span>
                  </td>
                  <td className="p-2.5 font-semibold text-slate-900">
                    {g.official_name}
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px]">
                    {g.alternative_names.join(', ')}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-700">
                    {g.latitude !== null ? `${g.latitude.toFixed(4)}, ${g.longitude?.toFixed(4)}` : 'N/A'}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {g.gps_quality}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    {g.is_within_study_bounds ? (
                      <span className="text-emerald-600 font-bold">✓ Oui</span>
                    ) : (
                      <span className="text-amber-600 font-bold">Extérieure</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
