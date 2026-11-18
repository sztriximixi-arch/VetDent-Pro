import React, { useState } from 'react';
import { DentalRecord, ToothRecord } from '../types/dental';
import { getSpeciesAnatomicalConfig } from '../data/anatomicalCoords';
import { PATHOLOGY_DESCRIPTIONS, PROCEDURE_DESCRIPTIONS } from '../data/triadanConfig';
import { Check, CheckSquare, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface GraphicalOdontogramProps {
  record: DentalRecord;
  activeToothId: number | null;
  onSelectTooth: (id: number) => void;
  selectedToothIds: number[];
  onToggleMultiSelect: (id: number, e: React.MouseEvent) => void;
}

export const GraphicalOdontogram: React.FC<GraphicalOdontogramProps> = ({
  record,
  activeToothId,
  onSelectTooth,
  selectedToothIds,
  onToggleMultiSelect,
}) => {
  const [hoveredToothId, setHoveredToothId] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1.2); // Kényelmes alapértelmezett méret a könnyű kattintáshoz

  const config = getSpeciesAnatomicalConfig(record.species);
  const { width, height } = config.dimensions;
  const coords = config.coords;

  // Státusz alapú kitöltési és körvonal színek
  const getToothColor = (tooth?: ToothRecord, isSelected?: boolean, isActive?: boolean) => {
    if (!tooth) return { fill: 'rgba(255,255,255,0.01)', stroke: 'transparent', strokeWidth: 1.5 };

    const hasMissing = tooth.pathologies.includes('M');
    const hasExtraction = tooth.procedures.some(p => p.startsWith('EXT'));
    const hasFracture = tooth.pathologies.some(p => p.startsWith('FX') || p === 'PE');
    const hasTR = tooth.pathologies.some(p => p.startsWith('TR'));
    const hasPeriodontitis = tooth.pathologies.some(p => p.startsWith('PD3') || p === 'PD4' || p.startsWith('Mob'));
    const hasCalculus = tooth.pathologies.some(p => p.startsWith('T'));
    const hasGingivitis = tooth.pathologies.some(p => p.startsWith('G'));

    let fill = 'rgba(16, 185, 129, 0.12)'; // Egészséges halvány zöld
    let stroke = 'rgba(16, 185, 129, 0.4)';

    if (hasMissing) {
      fill = 'rgba(148, 163, 184, 0.55)';
      stroke = '#64748b';
    } else if (hasExtraction) {
      fill = 'rgba(225, 29, 72, 0.45)';
      stroke = '#e11d48';
    } else if (hasFracture || hasTR) {
      fill = 'rgba(168, 85, 247, 0.45)';
      stroke = '#9333ea';
    } else if (hasPeriodontitis) {
      fill = 'rgba(249, 115, 22, 0.45)';
      stroke = '#ea580c';
    } else if (hasCalculus || hasGingivitis) {
      fill = 'rgba(245, 158, 11, 0.42)';
      stroke = '#d97706';
    }

    if (isActive) {
      stroke = '#0d9488'; // Teal kiemelés
    } else if (isSelected) {
      stroke = '#14b8a6';
    }

    return { fill, stroke, strokeWidth: isActive ? 2.5 : isSelected ? 2 : 1.5 };
  };

  const hoveredTooth = hoveredToothId ? record.teeth[hoveredToothId] : null;

  return (
    <div className="flex flex-col items-center">
      
      {/* Zoom és Nagyítási eszközök */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Grafikus Anatómiai Fogazat:</span>
          <span className="text-slate-500">
            {record.species === 'dog' ? 'Kutya fogazat (42 fog)' : 'Macska fogazat (30 fog)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale(s => Math.max(0.9, s - 0.15))}
            className="p-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
            title="Kicsinyítés"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-600 px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale(s => Math.min(1.8, s + 0.15))}
            className="p-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded"
            title="Nagyítás"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setScale(1.2)}
            className="p-1 text-slate-500 hover:text-slate-800 rounded ml-1"
            title="Alaphelyzet"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Központi Grafikus Rajz és Interaktív SVG Terület */}
      <div className="relative py-4 px-2 w-full flex justify-center overflow-x-auto bg-slate-50/40">
        <div 
          className="relative select-none shadow-sm rounded-lg bg-white border border-slate-200 transition-transform"
          style={{ 
            width: `${width * scale}px`, 
            height: `${height * scale}px`,
          }}
        >
          {/* 1. Anatómiai Rajz Háttérkép (A felhasználó által feltöltött grafika) */}
          <img
            src={config.imageSrc}
            alt={`${record.species === 'dog' ? 'Kutya' : 'Macska'} fogazat ábrája`}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* 2. Interaktív SVG Kattintható Réteg */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Átlós sraffozás extrakcióhoz */}
              <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="4" stroke="#e11d48" strokeWidth="1" />
              </pattern>
            </defs>

            {Object.entries(coords).map(([idStr, coord]) => {
              const id = Number(idStr);
              const tooth = record.teeth[id];
              const isActive = activeToothId === id;
              const isSelected = selectedToothIds.includes(id);
              const isHovered = hoveredToothId === id;
              const colors = getToothColor(tooth, isSelected, isActive);

              const hasMissing = tooth?.pathologies.includes('M');
              const hasExtraction = tooth?.procedures.some(p => p.startsWith('EXT'));
              const hasPathology = tooth?.pathologies.some(p => p !== '0');
              const primaryPath = tooth?.pathologies.find(p => p !== '0');
              const primaryProc = tooth?.procedures[0];

              return (
                <g
                  key={id}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredToothId(id)}
                  onMouseLeave={() => setHoveredToothId(null)}
                  onClick={(e) => {
                    if (e.shiftKey || e.ctrlKey || e.metaKey) {
                      onToggleMultiSelect(id, e);
                    } else {
                      onSelectTooth(id);
                    }
                  }}
                >
                  {/* Aktív fog pulzáló / kiemelő köre */}
                  {isActive && (
                    <ellipse
                      cx={coord.x}
                      cy={coord.y}
                      rx={coord.rx + 5}
                      ry={coord.ry + 5}
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Kijelölt állapot külső kerete */}
                  {isSelected && !isActive && (
                    <ellipse
                      cx={coord.x}
                      cy={coord.y}
                      rx={coord.rx + 3}
                      ry={coord.ry + 3}
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Fog anatómiai alakját fedő kattintható ellipszis / felület */}
                  <ellipse
                    cx={coord.x}
                    cy={coord.y}
                    rx={coord.rx}
                    ry={coord.ry}
                    fill={hasExtraction ? 'url(#diagonalHatch)' : colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={colors.strokeWidth}
                    className="transition-colors hover:stroke-teal-600 hover:stroke-[2.5px]"
                  />

                  {/* Hiányzó fog áthúzás */}
                  {hasMissing && (
                    <line
                      x1={coord.x - coord.rx}
                      y1={coord.y - coord.ry}
                      x2={coord.x + coord.rx}
                      y2={coord.y + coord.ry}
                      stroke="#475569"
                      strokeWidth="2"
                    />
                  )}

                  {/* Extrakció 'X' szimbólum */}
                  {hasExtraction && (
                    <>
                      <line
                        x1={coord.x - coord.rx + 2}
                        y1={coord.y - coord.ry + 2}
                        x2={coord.x + coord.rx - 2}
                        y2={coord.y + coord.ry - 2}
                        stroke="#e11d48"
                        strokeWidth="2"
                      />
                      <line
                        x1={coord.x + coord.rx - 2}
                        y1={coord.y - coord.ry + 2}
                        x2={coord.x - coord.rx + 2}
                        y2={coord.y + coord.ry - 2}
                        stroke="#e11d48"
                        strokeWidth="2"
                      />
                    </>
                  )}

                  {/* Kisméretű állapot kód jelző a fog mellett vagy rajta */}
                  {(primaryPath || primaryProc) && (
                    <g transform={`translate(${coord.x + (coord.labelSide === 'left' ? -coord.rx - 12 : coord.rx + 2)}, ${coord.y - 4})`}>
                      <rect
                        x="-2"
                        y="-6"
                        width="14"
                        height="9"
                        rx="2"
                        fill={hasExtraction ? '#e11d48' : hasPathology ? '#f59e0b' : '#0d9488'}
                        className="opacity-90"
                      />
                      <text
                        x="5"
                        y="1"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {primaryProc || primaryPath}
                      </text>
                    </g>
                  )}

                  {/* Triadan szám kattintható hotspotja a margón (a szöveg felett) */}
                  {coord.labelY && (
                    <rect
                      x={coord.labelSide === 'left' ? 38 : width - 68}
                      y={coord.labelY - 8}
                      width="30"
                      height="14"
                      rx="3"
                      fill={isActive ? '#0d9488' : isSelected ? '#ccfbf1' : isHovered ? '#e2e8f0' : 'transparent'}
                      fillOpacity={isActive ? 0.25 : 0.4}
                      stroke={isActive ? '#0d9488' : 'transparent'}
                      strokeWidth="1"
                      className="hover:stroke-teal-500"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Aktív / Egérmutató alatti fog lebegő információs csíkja */}
      <div className="w-full bg-white border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        {hoveredTooth ? (
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-teal-900 bg-teal-100 px-2 py-0.5 rounded">
              {hoveredTooth.id}
            </span>
            <span className="font-bold text-slate-800">{hoveredTooth.nameHu}</span>
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
                <span className="text-slate-500 italic max-w-xs truncate">
                  "{hoveredTooth.notes}"
                </span>
              </>
            )}
          </div>
        ) : activeToothId ? (
          <div className="flex items-center gap-2 text-slate-600">
            <span>Kiválasztva:</span>
            <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {activeToothId} - {record.teeth[activeToothId]?.nameHu}
            </span>
            <span className="text-slate-400 text-[11px]">(Szerkesztés az alsó részletező panelen)</span>
          </div>
        ) : (
          <span className="text-slate-400 italic">
            Vigye az egeret bármelyik fog fölé az adatok megtekintéséhez, vagy kattintson a szerkesztéshez.
          </span>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Kattintás: <strong>Kiválasztás</strong></span>
          <span>·</span>
          <span>Shift+Kattintás: <strong>Többes kijelölés</strong></span>
        </div>
      </div>

    </div>
  );
};
