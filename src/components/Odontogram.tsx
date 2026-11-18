import React from 'react';
import { DentalRecord } from '../types/dental';
import { VeterinaryDentalChart } from './VeterinaryDentalChart';

interface OdontogramProps {
  record: DentalRecord;
  activeToothId: number | null;
  onSelectTooth: (id: number) => void;
  selectedToothIds: number[];
  onToggleMultiSelect: (id: number, e: React.MouseEvent) => void;
  onSelectAll: () => void;
  onSelectUpper: () => void;
  onSelectLower: () => void;
  onSelectPathological: () => void;
  onClearSelection: () => void;
  onUpdateRecord?: (patch: Partial<DentalRecord>) => void;
}

export const Odontogram: React.FC<OdontogramProps> = ({
  record,
  activeToothId,
  onSelectTooth,
  selectedToothIds,
  onToggleMultiSelect,
  onSelectAll,
  onSelectUpper,
  onSelectLower,
  onSelectPathological,
  onClearSelection,
  onUpdateRecord,
}) => {
  const isDog = record.species === 'dog';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Fejléc: Fogképlet címe és Gyors kijelölési segédeszközök */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Fogászati Kezelési Táblázat – Módosított Triadan Rendszer ({isDog ? 'Kutya · 42 fog' : 'Macska · 30 fog'})
            </h3>
            <span className="text-xs text-slate-500 hidden md:inline">
              Kattintson egy fogra a szerkesztéshez
            </span>
          </div>
        </div>

        {/* Gyors kijelölő gombok */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Kijelölés:</span>
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-colors"
          >
            Összes
          </button>
          <button
            type="button"
            onClick={onSelectUpper}
            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-colors"
          >
            Felső ív (Maxilla)
          </button>
          <button
            type="button"
            onClick={onSelectLower}
            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-colors"
          >
            Alsó ív (Mandibula)
          </button>
          <button
            type="button"
            onClick={onSelectPathological}
            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-colors"
          >
            Patológiás fogak
          </button>
          {selectedToothIds.length > 0 && (
            <button
              type="button"
              onClick={onClearSelection}
              className="px-2 py-1 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
            >
              Törlés ({selectedToothIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Új táblázatos-grafikus állatorvosi fogászati tábla */}
      <div className="p-3 sm:p-4 bg-slate-50/30">
        <VeterinaryDentalChart
          record={record}
          activeToothId={activeToothId}
          selectedToothIds={selectedToothIds}
          onSelectTooth={onSelectTooth}
          onToggleMultiSelect={onToggleMultiSelect}
          onUpdateRecord={onUpdateRecord}
          readOnly={false}
          compact={false}
        />
      </div>
    </div>
  );
};
