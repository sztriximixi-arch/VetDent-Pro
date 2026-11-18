import React, { useState, useEffect } from 'react';
import { ToothRecord, PathologyCode, ProcedureCode, ProbingDepths } from '../types/dental';
import { PATHOLOGY_DESCRIPTIONS, PROCEDURE_DESCRIPTIONS } from '../data/triadanConfig';
import { Mic, MicOff, ChevronLeft, ChevronRight, Check, AlertTriangle, Info } from 'lucide-react';

interface ToothDetailPanelProps {
  tooth: ToothRecord | null;
  onUpdateTooth: (updated: Partial<ToothRecord>) => void;
  onPrevTooth?: () => void;
  onNextTooth?: () => void;
}

export const ToothDetailPanel: React.FC<ToothDetailPanelProps> = ({
  tooth,
  onUpdateTooth,
  onPrevTooth,
  onNextTooth
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Web Speech API inicializálás
  useEffect(() => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || 
                              (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('A böngésző nem támogatja a közvetlen hangfelismerést (Web Speech API). Kérjük írja be a megjegyzést.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hu-HU';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && tooth) {
          const currentNotes = tooth.notes ? `${tooth.notes} ` : '';
          onUpdateTooth({ notes: `${currentNotes}${transcript}.` });
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech error:', err);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  if (!tooth) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs flex flex-col items-center justify-center min-h-[360px]">
        <Info className="w-8 h-8 text-slate-400 mb-2" />
        <h4 className="font-semibold text-slate-700 text-sm mb-1">Nincs kiválasztva fog</h4>
        <p className="text-xs text-slate-500 max-w-sm">
          Kattintson a fenti odontogram bármelyik fogára a részletes vizsgálati adatok, tasakmélység és beavatkozások rögzítéséhez.
        </p>
      </div>
    );
  }

  // Patológia toggle
  const togglePathology = (code: PathologyCode) => {
    const current = [...tooth.pathologies];
    if (code === '0') {
      // Ha egészségest választunk, törli a többit
      onUpdateTooth({ pathologies: ['0'] });
      return;
    }

    // Ha egyéb kódot adunk hozzá, töröljük a '0'-t
    const withoutZero = current.filter(c => c !== '0');
    if (withoutZero.includes(code)) {
      const next = withoutZero.filter(c => c !== code);
      onUpdateTooth({ pathologies: next.length > 0 ? next : ['0'] });
    } else {
      onUpdateTooth({ pathologies: [...withoutZero, code] });
    }
  };

  // Eljárás toggle
  const toggleProcedure = (proc: ProcedureCode) => {
    const current = [...tooth.procedures];
    if (current.includes(proc)) {
      onUpdateTooth({ procedures: current.filter(p => p !== proc) });
    } else {
      onUpdateTooth({ procedures: [...current, proc] });
    }
  };

  // Tasakmélység frissítés
  const updateDepth = (field: keyof ProbingDepths, val: number | undefined) => {
    const depths = { ...tooth.probingDepths, [field]: val };
    onUpdateTooth({ probingDepths: depths });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Fejléc: Fog azonosító és lapozó */}
      <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-extrabold text-teal-900 bg-teal-100/80 px-2.5 py-0.5 rounded border border-teal-200">
            {tooth.id}
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {tooth.nameHu} ({tooth.shortName})
            </h4>
            <span className="text-[11px] text-slate-500">
              {tooth.quadrant === 100 ? 'Jobb felső' : tooth.quadrant === 200 ? 'Bal felső' : tooth.quadrant === 300 ? 'Bal alsó' : 'Jobb alsó'} kvadráns
            </span>
          </div>
        </div>

        {/* Előző / Következő fog gombok */}
        <div className="flex items-center gap-1">
          {onPrevTooth && (
            <button
              type="button"
              onClick={onPrevTooth}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              title="Előző fog vizsgálata"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {onNextTooth && (
            <button
              type="button"
              onClick={onNextTooth}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              title="Következő fog vizsgálata"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
        
        {/* 1. SZEKCIÓ: Tasakmélység szondázás (Probing Depths) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Tasakmélység szondázás (mm)</span>
            <span className="text-[10px] text-slate-500 font-normal">≥ 4 mm periodontális tasak</span>
          </label>
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div>
              <span className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                Mesialis (M)
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={tooth.probingDepths.mesial ?? ''}
                onChange={e => updateDepth('mesial', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="0"
                className={`w-full py-1 text-center font-mono text-xs font-bold rounded border ${
                  (tooth.probingDepths.mesial || 0) >= 4 
                    ? 'bg-rose-50 text-rose-800 border-rose-300' 
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              />
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                Buccalis (B)
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={tooth.probingDepths.buccal ?? ''}
                onChange={e => updateDepth('buccal', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="0"
                className={`w-full py-1 text-center font-mono text-xs font-bold rounded border ${
                  (tooth.probingDepths.buccal || 0) >= 4 
                    ? 'bg-rose-50 text-rose-800 border-rose-300' 
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              />
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                Distalis (D)
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={tooth.probingDepths.distal ?? ''}
                onChange={e => updateDepth('distal', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="0"
                className={`w-full py-1 text-center font-mono text-xs font-bold rounded border ${
                  (tooth.probingDepths.distal || 0) >= 4 
                    ? 'bg-rose-50 text-rose-800 border-rose-300' 
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              />
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-600 text-center mb-1">
                Palat./Ling. (L/P)
              </span>
              <input
                type="number"
                min="0"
                max="15"
                value={tooth.probingDepths.palatalOrLingual ?? ''}
                onChange={e => updateDepth('palatalOrLingual', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="0"
                className={`w-full py-1 text-center font-mono text-xs font-bold rounded border ${
                  (tooth.probingDepths.palatalOrLingual || 0) >= 4 
                    ? 'bg-rose-50 text-rose-800 border-rose-300' 
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 2. SZEKCIÓ: Fogállapot & Patológiák */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Fog állapota / Kóros elváltozások (Több is választható)
          </label>
          <div className="flex flex-wrap gap-1">
            {/* Egészséges gomb */}
            <button
              type="button"
              onClick={() => togglePathology('0')}
              className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                tooth.pathologies.includes('0')
                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              0: Ép / Egészséges
            </button>

            {/* Gyakori patológiák */}
            {[
              'T1', 'T2', 'T3',
              'G1', 'G2', 'G3',
              'PD1', 'PD2', 'PD3', 'PD4',
              'Mob1', 'Mob2', 'Mob3',
              'Fur1', 'Fur2', 'Fur3',
              'FX-C', 'FX-CR', 'PE', 'UCF',
              'TR1', 'TR2', 'TR3', 'TR4', 'TR5',
              'M', 'U'
            ].map(codeStr => {
              const code = codeStr as PathologyCode;
              const isSelected = tooth.pathologies.includes(code);
              const info = PATHOLOGY_DESCRIPTIONS[code];

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => togglePathology(code)}
                  title={info ? `${info.label}: ${info.description}` : code}
                  className={`px-2 py-1 text-xs font-mono font-medium rounded border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-950 font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>

          {/* Aktív kódok magyarázata */}
          {tooth.pathologies.filter(p => p !== '0').length > 0 && (
            <div className="mt-2 p-2 bg-slate-50 rounded text-[11px] text-slate-600 space-y-0.5 border border-slate-200">
              {tooth.pathologies.filter(p => p !== '0').map(p => (
                <div key={p} className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-800">{p}:</span>
                  <span>{PATHOLOGY_DESCRIPTIONS[p]?.label} — {PATHOLOGY_DESCRIPTIONS[p]?.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. SZEKCIÓ: Végzett beavatkozások */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Kezelés / Végzett beavatkozás ezen a fogon
          </label>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(PROCEDURE_DESCRIPTIONS).map(([key, item]) => {
              const proc = key as ProcedureCode;
              const isSelected = tooth.procedures.includes(proc);

              return (
                <button
                  key={proc}
                  type="button"
                  onClick={() => toggleProcedure(proc)}
                  title={item.description}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    isSelected
                      ? proc.startsWith('EXT')
                        ? 'bg-rose-700 text-white border-rose-800 font-bold'
                        : 'bg-teal-700 text-white border-teal-800 font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓ ' : ''}{item.badge}: {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SZEKCIÓ: Megjegyzések & 🎙️ Hangalapú diktálás */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">
              Egyedi fogászati megjegyzés
            </label>

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Hangalapú diktálás magyar nyelven (Web Speech API)"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-3 h-3" />
                  <span>Diktálás leállítása...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3 h-3 text-teal-600" />
                  <span>🎙️ Hangjegyzet rögzítése</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={2}
            value={tooth.notes}
            onChange={e => onUpdateTooth({ notes: e.target.value })}
            placeholder="Pl. Szilánkos törés a palatinalis oldalon, lebernyegképzéssel feltárva..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

      </div>
    </div>
  );
};
