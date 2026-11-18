import React from 'react';
import { Species, ToothRecord } from '../types/dental';

interface ToothSvgShapeProps {
  toothId: number;
  species: Species;
  tooth?: ToothRecord;
  isActive?: boolean;
  isSelected?: boolean;
  compact?: boolean;
}

export const ToothSvgShape: React.FC<ToothSvgShapeProps> = ({
  toothId,
  species,
  tooth,
  isActive = false,
  isSelected = false,
  compact = false,
}) => {
  const quad = Math.floor(toothId / 100);
  const idx = toothId % 100;
  const isUpper = quad === 1 || quad === 2;

  // Státuszok kiolvasása
  const pathologies = tooth?.pathologies || [];
  const procedures = tooth?.procedures || [];

  const isExtracted = procedures.some(p => p.startsWith('EXT'));
  const isMissing = pathologies.includes('M') || pathologies.includes('U');
  const isFlaggedCircle =
    procedures.includes('RX') ||
    procedures.includes('ENDO') ||
    procedures.includes('CURE') ||
    procedures.includes('FLAP') ||
    procedures.includes('BIO');

  const hasFracture = pathologies.some(p => p.startsWith('FX') || p === 'PE' || p === 'UCF');
  const hasTR = pathologies.some(p => p.startsWith('TR'));
  const hasPeriodontitis = pathologies.some(p => p.startsWith('PD') || p.startsWith('Mob') || p.startsWith('Fur'));
  const hasCalculusOrGing = pathologies.some(p => p.startsWith('T') || p.startsWith('G'));

  // Fog körvonal és kitöltés szín
  let fillColor = '#ffffff';
  let strokeColor = '#334155'; // slate-700

  if (isMissing) {
    fillColor = '#f1f5f9';
    strokeColor = '#94a3b8';
  } else if (isExtracted) {
    fillColor = '#ffe4e6';
    strokeColor = '#e11d48';
  } else if (hasFracture || hasTR) {
    fillColor = '#f3e8ff';
    strokeColor = '#7e22ce';
  } else if (hasPeriodontitis) {
    fillColor = '#ffedd5';
    strokeColor = '#c2410c';
  } else if (hasCalculusOrGing) {
    fillColor = '#fef3c7';
    strokeColor = '#b45309';
  }

  if (isActive) {
    strokeColor = '#0f766e';
  } else if (isSelected) {
    strokeColor = '#0284c7';
  }

  // Anatómiai SVG path-ek (viewBox 0 0 40 64)
  const renderAnatomy = () => {
    if (isUpper) {
      // FELSŐ ÁLLKAPOCS (Maxilla): Gyökerek FELFELÉ, Korona LEFELÉ
      if (idx <= 3) {
        // Metszőfogak (I1-I3)
        const w = idx === 3 ? 6.5 : 4.8;
        return (
          <g>
            <path
              d={`M ${20 - w * 0.75} 12 C ${20 - w * 0.7} 7, ${20 + w * 0.7} 7, ${20 + w * 0.75} 12 L ${20 + w} 48 C ${20 + w} 54, ${20 - w} 54, ${20 - w} 48 Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line x1={20 - w * 0.9} y1="36" x2={20 + w * 0.9} y2="36" stroke={strokeColor} strokeWidth="1" opacity="0.6" />
          </g>
        );
      }

      if (idx === 4) {
        // Felső szemfog (C)
        return (
          <g>
            <path
              d="M 20 5 C 26 5, 29 14, 28 32 C 27 44, 23 55, 20 59 C 17 55, 13 44, 12 32 C 11 14, 14 5, 20 5 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 12.2 31 Q 20 34 27.8 31" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx === 5) {
        // Kutya PM1 (105/205) - keskeny kétágú/karcsú sziluett
        return (
          <g>
            <path
              d="M 13 10 C 13 7, 16 7, 17 11 L 20 28 L 23 11 C 24 7, 27 7, 27 10 L 26 42 C 25 49, 22 53, 20 53 C 18 53, 15 49, 14 42 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M 14.5 34 Q 20 37 25.5 34" fill="none" stroke={strokeColor} strokeWidth="0.9" opacity="0.55" />
          </g>
        );
      }

      if (idx === 6 || idx === 7) {
        // Felső PM2, PM3 (106, 107, 206, 207) - 2 gyökér felfelé, csúcsos korona lefelé
        const isSmaller = idx === 6 && species === 'cat';
        const scaleX = isSmaller ? 0.8 : idx === 7 ? 1.08 : 0.96;
        return (
          <g transform={`translate(20, 0) scale(${scaleX}, 1) translate(-20, 0)`}>
            <path
              d="M 10 9 C 10 6, 14 6, 15 10 L 20 28 L 25 10 C 26 6, 30 6, 30 9 L 29 36 C 29 44, 24 53, 20 55 C 16 53, 11 44, 11 36 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 11.5 34 Q 20 38 28.5 34" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx === 8) {
        // Felső tépőfog PM4 (108, 208) - 3 gyökér felfelé, W-alakú korona lefelé
        return (
          <g>
            {/* Hátsó/középső palatinális gyökér */}
            <path
              d="M 17 26 L 18 11 C 18.5 7, 21.5 7, 22 11 L 23 26"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.3"
            />
            {/* Fő test + 2 buccalis gyökér + W korona */}
            <path
              d="M 7 8 C 7 5, 11 5, 12 9 L 17 29 L 23 29 L 28 9 C 29 5, 33 5, 33 8 L 32 39 C 32 45, 29 53, 26 53 C 24 53, 22 48, 20 46 C 18 48, 16 53, 14 53 C 11 53, 8 45, 8 39 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 8.5 36 Q 20 40 31.5 36" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx === 9 || idx === 10) {
        // Felső molárisok (109, 110, 209, 210)
        if (species === 'cat' && idx === 9) {
          // Macska 109/209 kis keskeny moláris
          return (
            <g>
              <path
                d="M 13 13 C 13 10, 16 10, 17 13 L 20 27 L 23 13 C 24 10, 27 10, 27 13 L 27 40 C 27 47, 24 51, 20 51 C 16 51, 13 47, 13 40 Z"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M 13.5 36 Q 20 39 26.5 36" fill="none" stroke={strokeColor} strokeWidth="0.9" opacity="0.55" />
            </g>
          );
        }
        const scale = idx === 10 ? 0.85 : 1;
        return (
          <g transform={`translate(20, 28) scale(${scale}) translate(-20, -28)`}>
            <path
              d="M 17 24 L 18 11 C 18.5 8, 21.5 8, 22 11 L 23 24"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.3"
            />
            <path
              d="M 8 10 C 8 7, 12 7, 13 11 L 17 28 L 23 28 L 27 11 C 28 7, 32 7, 32 10 L 31 39 C 31 48, 26 53, 20 53 C 14 53, 9 48, 9 39 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 9.5 36 Q 20 40 30.5 36" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }
    } else {
      // ALSÓ ÁLLKAPOCS (Mandibula): Korona FELFELÉ, Gyökerek LEFELÉ
      if (idx <= 3) {
        // Alsó metszőfogak (I1-I3)
        const w = idx === 3 ? 6 : 4.5;
        return (
          <g>
            <path
              d={`M ${20 - w} 14 C ${20 - w} 9, ${20 + w} 9, ${20 + w} 14 L ${20 + w * 0.75} 51 C ${20 + w * 0.7} 56, ${20 - w * 0.7} 56, ${20 - w * 0.75} 51 Z`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line x1={20 - w * 0.9} y1="26" x2={20 + w * 0.9} y2="26" stroke={strokeColor} strokeWidth="1" opacity="0.6" />
          </g>
        );
      }

      if (idx === 4) {
        // Alsó szemfog (C)
        return (
          <g>
            <path
              d="M 20 4 C 23 8, 27 19, 28 31 C 29 49, 26 58, 20 58 C 14 58, 11 49, 12 31 C 13 19, 17 8, 20 4 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 12.2 32 Q 20 29 27.8 32" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx >= 5 && idx <= 8) {
        // Alsó premolárisok (405-408, 305-308) - csúcsos korona felfelé, 2 gyökér lefelé
        const scaleX = idx === 5 ? 0.8 : idx === 6 ? 0.9 : idx === 7 ? 0.98 : 1.05;
        return (
          <g transform={`translate(20, 0) scale(${scaleX}, 1) translate(-20, 0)`}>
            <path
              d="M 11 28 C 11 20, 16 11, 20 9 C 24 11, 29 20, 29 28 L 30 54 C 30 57, 26 57, 25 53 L 20 35 L 15 53 C 14 57, 10 57, 10 54 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 11.5 29 Q 20 25 28.5 29" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx === 9) {
        // Alsó tépőfog M1 (409, 309) - M-alakú kétcsúcsú korona felfelé, 2 gyökér lefelé
        return (
          <g>
            <path
              d="M 8 25 C 8 17, 11 10, 14 10 C 16 10, 18 15, 20 17 C 22 15, 24 10, 26 10 C 29 10, 32 17, 32 25 L 33 54 C 33 57, 29 57, 28 53 L 22 34 L 18 34 L 12 53 C 11 57, 7 57, 7 54 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 8.5 27 Q 20 23 31.5 27" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }

      if (idx === 10 || idx === 11) {
        // Alsó molárisok (410, 411, 310, 311 - Kutya)
        const scale = idx === 11 ? 0.78 : 0.94;
        return (
          <g transform={`translate(20, 32) scale(${scale}) translate(-20, -32)`}>
            <path
              d="M 9 25 C 9 15, 14 10, 20 10 C 26 10, 31 15, 31 25 L 32 53 C 32 56, 28 56, 27 52 L 22 35 L 18 35 L 13 52 C 12 56, 8 56, 8 53 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 9.5 27 Q 20 23 30.5 27" fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.55" />
          </g>
        );
      }
    }

    return null;
  };

  return (
    <svg
      viewBox="0 0 40 64"
      className={compact ? 'w-6 h-10 mx-auto block' : 'w-8 h-13 sm:w-9 sm:h-14 mx-auto block'}
      style={{ overflow: 'visible' }}
    >
      {/* Karikázás röntgen / kezelés jelöléséhez ("Circle a tooth to flag it for radiographs or treatment") */}
      {isFlaggedCircle && (
        <ellipse
          cx="20"
          cy="32"
          rx="17"
          ry="28"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.8"
        />
      )}

      {/* Aktív / kiválasztott fog kiemelő keret */}
      {isActive && (
        <rect
          x="1"
          y="1"
          width="38"
          height="62"
          rx="6"
          fill="rgba(13, 148, 136, 0.08)"
          stroke="#0d9488"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
      )}

      {/* Anatómiai fog rajz */}
      {renderAnatomy()}

      {/* Áthúzás extrakció vagy hiányzó fog esetén ("Cross out missing or extracted teeth") */}
      {isExtracted && (
        <g stroke="#e11d48" strokeWidth="2.4" strokeLinecap="round">
          <line x1="7" y1="8" x2="33" y2="56" />
          <line x1="33" y1="8" x2="7" y2="56" />
        </g>
      )}
      {isMissing && !isExtracted && (
        <g stroke="#64748b" strokeWidth="2.2" strokeLinecap="round">
          <line x1="7" y1="10" x2="33" y2="54" />
          <line x1="33" y1="10" x2="7" y2="54" />
        </g>
      )}
    </svg>
  );
};
