import React from 'react';
import { PathologyCode, ProcedureCode } from '../types/dental';
import { Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';

interface QuickActionsToolbarProps {
  selectedToothIds: number[];
  activeToothId: number | null;
  onApplyPathologyToSelection: (code: PathologyCode) => void;
  onApplyProcedureToSelection: (proc: ProcedureCode) => void;
  onApplyCleanAndPolishAll: () => void;
  onResetSelectionToHealthy: () => void;
  onApplyPocketDepthToSelection: (depth: number) => void;
}

export const QuickActionsToolbar: React.FC<QuickActionsToolbarProps> = ({
  selectedToothIds,
  activeToothId,
  onApplyPathologyToSelection,
  onApplyProcedureToSelection,
  onApplyCleanAndPolishAll,
  onResetSelectionToHealthy,
  onApplyPocketDepthToSelection
}) => {
  const targetCount = selectedToothIds.length > 0 ? selectedToothIds.length : (activeToothId ? 1 : 0);
  const targetLabel = selectedToothIds.length > 0 
    ? `${selectedToothIds.length} kijelölt fogra` 
    : (activeToothId ? `Fog #${activeToothId}-re` : 'Nincs kijelölt fog');

  const isDisabled = targetCount === 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Fejléc */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-xs">
            Gyorsbeviteli Eszköztár (Quick Actions)
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold ${
            targetCount > 0 ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-500'
          }`}>
            Cél: {targetLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onApplyCleanAndPolishAll}
          className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1 shadow-xs"
          title="Minden meglévő foghoz hozzáadja: U (Ultrahang) + POL (Polírozás)"
        >
          <Sparkles className="w-3 h-3" />
          Mindet Depurál + Políroz (U+POL)
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[500px]">
        {/* Magyarázó információs sáv */}
        {isDisabled && (
          <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
            <span>ℹ️ Jelöljön ki fogakat a bal oldali fogképletben, vagy kattintson egy fogra a gyorsműveletek alkalmazásához!</span>
          </div>
        )}

        {/* 1. DIAGNOSZTIKAI GOMBOK (Pathology Quick Codes) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <span>1. Diagnosztikai Gyorsgombok</span>
            <span className="text-[10px] text-slate-500 font-normal">(Kattintás → Hozzárendelés)</span>
          </label>

          <div className="space-y-2">
            {/* Fogkő (T1, T2, T3) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 w-16">Fogkő:</span>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('T1')}
                className="px-2 py-1 text-xs font-mono font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded disabled:opacity-40"
              >
                + T1 (Enyhe)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('T2')}
                className="px-2 py-1 text-xs font-mono font-medium bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 rounded disabled:opacity-40 font-semibold"
              >
                + T2 (Közepes)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('T3')}
                className="px-2 py-1 text-xs font-mono font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-500 rounded disabled:opacity-40"
              >
                + T3 (Súlyos)
              </button>
            </div>

            {/* Ínygyulladás (G1, G2, G3) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 w-16">Ínygyull.:</span>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('G1')}
                className="px-2 py-1 text-xs font-mono font-medium bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded disabled:opacity-40"
              >
                + G1
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('G2')}
                className="px-2 py-1 text-xs font-mono font-medium bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded disabled:opacity-40 font-semibold"
              >
                + G2 (Vérzés)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('G3')}
                className="px-2 py-1 text-xs font-mono font-bold bg-rose-200 hover:bg-rose-300 text-rose-950 border border-rose-400 rounded disabled:opacity-40"
              >
                + G3 (Spontán)
              </button>
            </div>

            {/* Periodontitis (PD1, PD2, PD3, PD4) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 w-16">Periodont:</span>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('PD1')}
                className="px-2 py-1 text-xs font-mono font-medium bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 rounded disabled:opacity-40"
              >
                + PD1
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('PD2')}
                className="px-2 py-1 text-xs font-mono font-medium bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 rounded disabled:opacity-40"
              >
                + PD2
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('PD3')}
                className="px-2 py-1 text-xs font-mono font-bold bg-orange-200 hover:bg-orange-300 text-orange-950 border border-orange-400 rounded disabled:opacity-40"
              >
                + PD3
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('PD4')}
                className="px-2 py-1 text-xs font-mono font-bold bg-orange-300 hover:bg-orange-400 text-orange-950 border border-orange-500 rounded disabled:opacity-40"
              >
                + PD4
              </button>
            </div>

            {/* Törés / Resorptív / Mobilitás */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 w-16">Trauma/TR:</span>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('FX-C')}
                className="px-2 py-1 text-xs font-mono font-bold bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded disabled:opacity-40"
              >
                + FX-C (Koronatörés)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('PE')}
                className="px-2 py-1 text-xs font-mono font-bold bg-red-200 hover:bg-red-300 text-red-950 border border-red-400 rounded disabled:opacity-40"
              >
                + PE (Pulznyitott!)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('TR3')}
                className="px-2 py-1 text-xs font-mono font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 rounded disabled:opacity-40"
              >
                + TR (Macska FORL)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('Mob2')}
                className="px-2 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded disabled:opacity-40"
              >
                + Mob (Mozgás)
              </button>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPathologyToSelection('M')}
                className="px-2 py-1 text-xs font-mono font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-400 rounded disabled:opacity-40"
              >
                + M (Hiányzó)
              </button>
            </div>
          </div>
        </div>

        {/* 2. TERÁPIÁS BEAVATKOZÁS GOMBOK (Procedures Quick Codes) */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
            <span>2. Terápiás Beavatkozás Gyorsgombok</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('U')}
              className="px-3 py-1.5 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + U: Ultrahang
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('POL')}
              className="px-3 py-1.5 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + POL: Polírozás
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('RX')}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + RX: Röntgen
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('EXT-S')}
              className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + EXT-S: Egyszerű húzás
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('EXT-SURG')}
              className="px-3 py-1.5 text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-400 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + EXT-SURG: Sebészi húzás
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => onApplyProcedureToSelection('CURE')}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-left disabled:opacity-40 transition-colors"
            >
              + CURE: Kürettálás
            </button>
          </div>
        </div>

        {/* 3. TASAKMÉLYSÉG GYORSRÖGZÍTŐ (0 - 8 mm) */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>3. Tasakmélység gyorsrögzítő (Minden oldalra)</span>
            <span className="text-[10px] text-slate-500 font-normal">Kijelöltekre mm érték</span>
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 8].map(depth => (
              <button
                key={depth}
                type="button"
                disabled={isDisabled}
                onClick={() => onApplyPocketDepthToSelection(depth)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded border transition-colors disabled:opacity-40 ${
                  depth >= 4 
                    ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {depth} mm
              </button>
            ))}
          </div>
        </div>

        {/* 4. VISSZAÁLLÍTÁS ÉPPÉ (0) */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={isDisabled}
            onClick={onResetSelectionToHealthy}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Visszaállítás ép állapotra (0)
          </button>
        </div>

      </div>
    </div>
  );
};
