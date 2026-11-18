import React, { useState } from 'react';
import { DentalRecord } from '../types/dental';
import { DOG_TEETH_IDS, CAT_TEETH_IDS } from '../data/triadanConfig';
import { ToothSvgShape } from './ToothSvgShape';
import {
  getCalculusIndexValue,
  getGingivitisIndexValue,
  getMobileToothValue,
  getOtherFindingsItems,
} from '../utils/toothFormatters';

interface VeterinaryDentalChartProps {
  record: DentalRecord;
  activeToothId?: number | null;
  selectedToothIds?: number[];
  onSelectTooth?: (id: number) => void;
  onToggleMultiSelect?: (id: number, e: React.MouseEvent) => void;
  onUpdateRecord?: (patch: Partial<DentalRecord>) => void;
  readOnly?: boolean;
  compact?: boolean;
}

export const VeterinaryDentalChart: React.FC<VeterinaryDentalChartProps> = ({
  record,
  activeToothId = null,
  selectedToothIds = [],
  onSelectTooth,
  onToggleMultiSelect,
  onUpdateRecord,
  readOnly = false,
  compact = false,
}) => {
  const [hoveredToothId, setHoveredToothId] = useState<number | null>(null);

  const isDog = record.species === 'dog';
  const teethConfig = isDog ? DOG_TEETH_IDS : CAT_TEETH_IDS;

  const handleToothClick = (id: number, e: React.MouseEvent) => {
    if (readOnly) return;
    if ((e.shiftKey || e.ctrlKey || e.metaKey) && onToggleMultiSelect) {
      onToggleMultiSelect(id, e);
    } else if (onSelectTooth) {
      onSelectTooth(id);
    }
  };

  const getGridColsClass = (count: number) => {
    if (count === 10) return 'grid-cols-10';
    if (count === 11) return 'grid-cols-11';
    if (count === 8) return 'grid-cols-8';
    return 'grid-cols-7';
  };

  const labelColWidth = compact ? 'w-28 shrink-0' : 'w-32 sm:w-36 shrink-0';
  const rowLabelClass = compact
    ? 'text-[7.5px] font-bold tracking-tight text-slate-600 flex items-center whitespace-nowrap'
    : 'text-[10px] sm:text-[11px] font-bold tracking-tight text-slate-600 flex items-center whitespace-nowrap';

  const renderSingleValueCell = (id: number, value: string, isDanger?: boolean) => {
    const isActive = !readOnly && activeToothId === id;
    const isSelected = !readOnly && selectedToothIds.includes(id);

    return (
      <div
        key={id}
        onClick={(e) => handleToothClick(id, e)}
        onMouseEnter={() => !readOnly && setHoveredToothId(id)}
        onMouseLeave={() => !readOnly && setHoveredToothId(null)}
        className={`border rounded-[3px] flex items-center justify-center font-mono leading-none transition-colors ${
          compact ? 'h-4 text-[8px] px-0.5' : 'h-6 text-[10px] px-0.5'
        } ${
          !readOnly ? 'cursor-pointer' : ''
        } ${
          isActive
            ? 'border-teal-600 bg-teal-50/70 font-bold text-teal-950'
            : isSelected
            ? 'border-sky-500 bg-sky-50/60 font-semibold'
            : isDanger
            ? 'border-rose-300 bg-rose-50/70 text-rose-800 font-bold'
            : value
            ? 'border-slate-300 bg-slate-50/70 text-slate-800 font-semibold'
            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
        }`}
      >
        <span>{value}</span>
      </div>
    );
  };

  const renderOtherFindingsCell = (id: number) => {
    const isActive = !readOnly && activeToothId === id;
    const isSelected = !readOnly && selectedToothIds.includes(id);
    const items = getOtherFindingsItems(record.teeth[id]);
    const hasExtraction = items.some(i => i.variant === 'extraction');
    const hasPathology = items.some(i => i.variant === 'pathology');

    return (
      <div
        key={id}
        onClick={(e) => handleToothClick(id, e)}
        onMouseEnter={() => !readOnly && setHoveredToothId(id)}
        onMouseLeave={() => !readOnly && setHoveredToothId(null)}
        className={`border rounded-[3px] flex flex-wrap items-center justify-center content-center gap-0.5 font-mono leading-tight transition-colors ${
          compact ? 'min-h-4 py-0.5 px-0.5 text-[7px]' : 'min-h-6 py-0.5 px-0.5 text-[9px]'
        } ${
          !readOnly ? 'cursor-pointer' : ''
        } ${
          isActive
            ? 'border-teal-600 bg-teal-50/70 font-bold'
            : isSelected
            ? 'border-sky-500 bg-sky-50/60'
            : hasExtraction
            ? 'border-rose-300 bg-rose-50/60'
            : hasPathology
            ? 'border-purple-300 bg-purple-50/50'
            : items.length > 0
            ? 'border-slate-300 bg-slate-50/60'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        {items.map((item, idx) => (
          <span
            key={`${item.label}-${idx}`}
            className={`px-0.5 rounded-[2px] font-semibold leading-tight ${
              item.variant === 'extraction'
                ? 'bg-rose-200/80 text-rose-900'
                : item.variant === 'pathology'
                ? 'bg-purple-200/80 text-purple-950'
                : item.variant === 'procedure'
                ? 'bg-teal-100/80 text-teal-900'
                : 'text-slate-600'
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    );
  };

  const renderTriadanNumberCell = (id: number) => {
    const isActive = !readOnly && activeToothId === id;
    const isSelected = !readOnly && selectedToothIds.includes(id);

    return (
      <button
        key={id}
        type="button"
        disabled={readOnly}
        onClick={(e) => handleToothClick(id, e)}
        onMouseEnter={() => !readOnly && setHoveredToothId(id)}
        onMouseLeave={() => !readOnly && setHoveredToothId(null)}
        className={`text-center font-mono font-bold transition-colors rounded ${
          compact ? 'text-[8px] py-0' : 'text-[11px] py-0.5'
        } ${
          isActive
            ? 'bg-teal-700 text-white'
            : isSelected
            ? 'bg-sky-100 text-sky-900'
            : 'text-slate-800 hover:bg-slate-100'
        }`}
      >
        {id}
      </button>
    );
  };

  const renderToothDrawingCell = (id: number) => {
    const isActive = !readOnly && activeToothId === id;
    const isSelected = !readOnly && selectedToothIds.includes(id);

    return (
      <div
        key={id}
        onClick={(e) => handleToothClick(id, e)}
        onMouseEnter={() => !readOnly && setHoveredToothId(id)}
        onMouseLeave={() => !readOnly && setHoveredToothId(null)}
        className={`rounded transition-transform ${
          !readOnly ? 'cursor-pointer hover:scale-105' : ''
        }`}
        title={`${id} - ${record.teeth[id]?.nameHu || ''}`}
      >
        <ToothSvgShape
          toothId={id}
          species={record.species}
          tooth={record.teeth[id]}
          isActive={isActive}
          isSelected={isSelected}
          compact={compact}
        />
      </div>
    );
  };

  const renderHorizontalRow = (
    label: string,
    rightIds: number[],
    leftIds: number[],
    renderCell: (id: number) => React.ReactNode,
    options?: { isToothRow?: boolean; isNumberRow?: boolean; alignItems?: 'stretch' | 'end' | 'start' }
  ) => {
    const rightGridClass = getGridColsClass(rightIds.length);
    const leftGridClass = getGridColsClass(leftIds.length);
    const alignClass =
      options?.alignItems === 'end'
        ? 'items-end'
        : options?.alignItems === 'start'
        ? 'items-start'
        : 'items-stretch';

    return (
      <div className="flex items-stretch gap-2">
        <div className={`${labelColWidth} flex items-center`}>
          {options?.isToothRow ? (
            <span className={`${compact ? 'text-[9px]' : 'text-xs'} font-bold uppercase tracking-wider text-slate-800`}>
              {label}
            </span>
          ) : (
            <span className={rowLabelClass}>{label}</span>
          )}
        </div>

        <div className={`flex-1 grid ${rightGridClass} gap-0.5 sm:gap-1 ${alignClass}`}>
          {rightIds.map(renderCell)}
        </div>

        <div className="border-r-2 border-dashed border-blue-400 mx-0.5 sm:mx-1" />

        <div className={`flex-1 grid ${leftGridClass} gap-0.5 sm:gap-1 ${alignClass}`}>
          {leftIds.map(renderCell)}
        </div>
      </div>
    );
  };

  const hoveredTooth = hoveredToothId ? record.teeth[hoveredToothId] : null;

  return (
    <div className="w-full space-y-3">
      {/* FŐ FOGÁSZATI TÁBLÁZAT KÁRTYA */}
      <div className={`bg-white border border-slate-300 rounded-xl ${compact ? 'p-2.5' : 'p-3 sm:p-5 overflow-x-auto'}`}>
        <div className={compact ? 'w-full' : 'min-w-[820px]'}>
          
          {/* Felső oldalisági & faji címsor */}
          <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className={`${labelColWidth} inline-block`} />
              <span className={`${compact ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wider text-slate-500`}>
                PÁCIENS JOBB OLDALA (RHS)
              </span>
            </div>

            <span className={`${compact ? 'text-[10px]' : 'text-xs'} font-bold uppercase tracking-widest text-blue-600`}>
              {isDog ? 'KUTYA · 42 MARADANDÓ FOG' : 'MACSKA · 30 MARADANDÓ FOG'}
            </span>

            <span className={`${compact ? 'text-[9px]' : 'text-[11px]'} font-bold uppercase tracking-wider text-slate-500`}>
              PÁCIENS BAL OLDALA (LHS)
            </span>
          </div>

          {/* 1. FELSŐ ÁLLKAPOCS (MAXILLA) */}
          <div className="flex flex-col gap-1">
            {renderHorizontalRow('Calculus Index (0-3)', teethConfig.q100, teethConfig.q200, id => {
              const val = getCalculusIndexValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '3');
            })}
            {renderHorizontalRow('Gingivitis Index (0-3)', teethConfig.q100, teethConfig.q200, id => {
              const val = getGingivitisIndexValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '3');
            })}
            {renderHorizontalRow('Mobilitás (0-3)', teethConfig.q100, teethConfig.q200, id => {
              const val = getMobileToothValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '2' || val === '3');
            })}
            {renderHorizontalRow('Egyéb', teethConfig.q100, teethConfig.q200, renderOtherFindingsCell)}
            {renderHorizontalRow('FOG', teethConfig.q100, teethConfig.q200, renderTriadanNumberCell, { isNumberRow: true })}
            {renderHorizontalRow('MAXILLA', teethConfig.q100, teethConfig.q200, renderToothDrawingCell, { isToothRow: true, alignItems: 'end' })}
          </div>

          {/* KÖZÉPSŐ ELVÁLASZTÓ SÁV */}
          <div className="my-2.5 border-t border-slate-200" />

          {/* 2. ALSÓ ÁLLKAPOCS (MANDIBULA) */}
          <div className="flex flex-col gap-1">
            {renderHorizontalRow('MANDIBULA', teethConfig.q400, teethConfig.q300, renderToothDrawingCell, { isToothRow: true, alignItems: 'start' })}
            {renderHorizontalRow('FOG', teethConfig.q400, teethConfig.q300, renderTriadanNumberCell, { isNumberRow: true })}
            {renderHorizontalRow('Calculus Index (0-3)', teethConfig.q400, teethConfig.q300, id => {
              const val = getCalculusIndexValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '3');
            })}
            {renderHorizontalRow('Gingivitis Index (0-3)', teethConfig.q400, teethConfig.q300, id => {
              const val = getGingivitisIndexValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '3');
            })}
            {renderHorizontalRow('Mobilitás (0-3)', teethConfig.q400, teethConfig.q300, id => {
              const val = getMobileToothValue(record.teeth[id]);
              return renderSingleValueCell(id, val, val === '2' || val === '3');
            })}
            {renderHorizontalRow('Egyéb', teethConfig.q400, teethConfig.q300, renderOtherFindingsCell)}
          </div>

          {/* Kártyán belüli használati megjegyzés */}
          <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
            <span>
              Áthúzott fog (<strong>X</strong>): hiányzó vagy extrahált · Kék karika (<strong>◯</strong>): röntgen vagy speciális kezelés jelölve.
            </span>
            {!readOnly && (
              <span className="text-slate-600 font-medium">
                Kattintás: fog szerkesztése · Shift+kattintás: többes kijelölés
              </span>
            )}
          </div>
        </div>
      </div>

      {/* INTERAKTÍV HOVER SÁV (Csak szerkesztő módban) */}
      {!readOnly && (
        <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          {hoveredTooth ? (
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
                {hoveredTooth.id}
              </span>
              <span className="font-semibold text-slate-800">{hoveredTooth.nameHu}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">
                Státusz: <strong>{hoveredTooth.pathologies.join(', ')}</strong>
              </span>
              {hoveredTooth.procedures.length > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-rose-700 font-semibold">
                    Kezelés: {hoveredTooth.procedures.join(', ')}
                  </span>
                </>
              )}
              {hoveredTooth.notes && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500 italic truncate max-w-xs">
                    "{hoveredTooth.notes}"
                  </span>
                </>
              )}
            </div>
          ) : activeToothId ? (
            <div className="flex items-center gap-2 text-slate-600">
              <span>Aktív fog:</span>
              <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {activeToothId} – {record.teeth[activeToothId]?.nameHu}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic">
              Kattintson egy fogra a táblázatban a részletes adatok felviteléhez.
            </span>
          )}

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 inline-block" /> RX / Kezelés
            </span>
            <span className="flex items-center gap-1">
              <span className="text-rose-600 font-bold leading-none">✕</span> Extrakció
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-500 inline-block" /> Fogkő / Íny
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-purple-100 border border-purple-600 inline-block" /> Törés / TR
            </span>
          </div>
        </div>
      )}

      {/* ÖSSZESÍTETT PARODONTÁLIS STÁTUSZ ÉS INDEXEK */}
      <div className={`bg-white border border-slate-200 rounded-xl ${compact ? 'p-3 text-[10px]' : 'p-4 text-xs'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Bal oldal: Periodontális stádium jelölőnégyzetek & indexek */}
          <div className="md:col-span-7 space-y-2.5">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                PERIODONTÁLIS STÁDIUM (ÖSSZESÍTETT)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { key: 'normal', label: 'Normál' },
                  { key: 'stage1', label: '1. stádium' },
                  { key: 'stage2', label: '2. stádium' },
                  { key: 'stage3', label: '3. stádium' },
                  { key: 'stage4', label: '4. stádium' },
                ].map(item => {
                  const checked = (record.periodontalStage || 'normal') === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      disabled={readOnly}
                      onClick={() => onUpdateRecord?.({ periodontalStage: item.key as DentalRecord['periodontalStage'] })}
                      className={`flex items-center gap-1.5 ${!readOnly ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center text-[10px] ${
                        checked ? 'bg-blue-600 border-blue-700 text-white font-bold' : 'bg-white border-slate-400'
                      }`}>
                        {checked ? '✓' : ''}
                      </span>
                      <span className={checked ? 'font-bold text-slate-900' : 'text-slate-700'}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  FOGKŐ INDEX
                </span>
                {readOnly ? (
                  <div className="border-b border-slate-300 pb-0.5 font-medium text-slate-800 min-h-[18px]">
                    {record.calculusIndex || '—'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={record.calculusIndex || ''}
                    onChange={e => onUpdateRecord?.({ calculusIndex: e.target.value })}
                    placeholder="Pl. T2"
                    className="w-full border-b border-slate-300 focus:border-teal-600 focus:outline-none py-0.5 text-xs bg-transparent"
                  />
                )}
              </div>

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  ÍNYGYULLADÁS INDEX
                </span>
                {readOnly ? (
                  <div className="border-b border-slate-300 pb-0.5 font-medium text-slate-800 min-h-[18px]">
                    {record.gingivalIndex || '—'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={record.gingivalIndex || ''}
                    onChange={e => onUpdateRecord?.({ gingivalIndex: e.target.value })}
                    placeholder="Pl. G1–G2"
                    className="w-full border-b border-slate-300 focus:border-teal-600 focus:outline-none py-0.5 text-xs bg-transparent"
                  />
                )}
              </div>

              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  OKKLÚZIÓ (HARAPÁS)
                </span>
                {readOnly ? (
                  <div className="border-b border-slate-300 pb-0.5 font-medium text-slate-800 min-h-[18px]">
                    {record.occlusion || '—'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={record.occlusion || ''}
                    onChange={e => onUpdateRecord?.({ occlusion: e.target.value })}
                    placeholder="Pl. Normál"
                    className="w-full border-b border-slate-300 focus:border-teal-600 focus:outline-none py-0.5 text-xs bg-transparent"
                  />
                )}
              </div>
            </div>

            {!isDog && (
              <div className="pt-1">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  STOMATITIS / FELINE RESORPTÍV STÁTUSZ
                </span>
                {readOnly ? (
                  <div className="border-b border-slate-300 pb-0.5 font-medium text-slate-800 min-h-[18px]">
                    {record.stomatitis || '—'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={record.stomatitis || ''}
                    onChange={e => onUpdateRecord?.({ stomatitis: e.target.value })}
                    placeholder="Pl. Enyhe lokalizált gingivostomatitis"
                    className="w-full border-b border-slate-300 focus:border-teal-600 focus:outline-none py-0.5 text-xs bg-transparent"
                  />
                )}
              </div>
            )}
          </div>

          {/* Jobb oldal: Gyors összesítő a legfontosabb rövidítésekről */}
          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[10px] text-slate-600 leading-relaxed">
            <strong className="block text-slate-800 uppercase tracking-wider text-[9px] mb-1">
              Gyakori rövidítések a táblázatban:
            </strong>
            <span>
              <strong>X / X-S:</strong> extrakció (egyszerű / sebészi) · <strong>M:</strong> hiányzó · <strong>FX:</strong> törés · <strong>PE:</strong> pulznyitott · <strong>TR:</strong> resorptív lézió · <strong>U:</strong> ultrahang · <strong>POL:</strong> polírozás · <strong>PD1–4:</strong> periodontitis · <strong>Fur1–3:</strong> furkáció · <strong>RX:</strong> röntgen
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
