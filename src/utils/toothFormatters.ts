import { ToothRecord } from '../types/dental';

export function getCalculusIndexValue(tooth?: ToothRecord): string {
  if (!tooth) return '';
  if (tooth.pathologies.includes('T3')) return '3';
  if (tooth.pathologies.includes('T2')) return '2';
  if (tooth.pathologies.includes('T1')) return '1';
  return '';
}

export function getGingivitisIndexValue(tooth?: ToothRecord): string {
  if (!tooth) return '';
  if (tooth.pathologies.includes('G3')) return '3';
  if (tooth.pathologies.includes('G2')) return '2';
  if (tooth.pathologies.includes('G1')) return '1';
  return '';
}

export function getMobileToothValue(tooth?: ToothRecord): string {
  if (!tooth) return '';
  if (tooth.pathologies.includes('Mob3')) return '3';
  if (tooth.pathologies.includes('Mob2')) return '2';
  if (tooth.pathologies.includes('Mob1')) return '1';
  return '';
}

export function getMobilityValue(tooth?: ToothRecord): string {
  if (!tooth) return '';
  if (tooth.pathologies.includes('Mob3')) return 'M3';
  if (tooth.pathologies.includes('Mob2')) return 'M2';
  if (tooth.pathologies.includes('Mob1')) return 'M1';
  return '';
}

export function getMaxProbingDepth(tooth?: ToothRecord): number {
  if (!tooth) return 0;
  const d = tooth.probingDepths || {};
  return Math.max(d.mesial || 0, d.buccal || 0, d.distal || 0, d.palatalOrLingual || 0);
}

export interface OtherFindingItem {
  label: string;
  variant: 'pathology' | 'extraction' | 'procedure' | 'note';
}

export function getOtherFindingsItems(tooth?: ToothRecord): OtherFindingItem[] {
  if (!tooth) return [];

  const items: OtherFindingItem[] = [];

  // Minden egyéb patológiai kód (kivéve 0, T1-3, G1-3, Mob1-3, mert azoknak külön soruk van)
  const otherPaths = tooth.pathologies.filter(
    p => p !== '0' && !/^T[1-3]$/.test(p) && !/^G[1-3]$/.test(p) && !/^Mob[1-3]$/.test(p)
  );
  otherPaths.forEach(p => {
    items.push({ label: p, variant: 'pathology' });
  });

  // Minden kiválasztott beavatkozás / kezelés
  const procs = tooth.procedures || [];
  procs.forEach(proc => {
    const isExt = proc.startsWith('EXT');
    const shortLabel = proc === 'EXT-SURG' ? 'X-S' : proc === 'EXT-S' ? 'X' : proc;
    items.push({
      label: shortLabel,
      variant: isExt ? 'extraction' : 'procedure',
    });
  });

  // Ha csak szöveges megjegyzés van egyéb kód nélkül
  if (items.length === 0 && tooth.notes.trim().length > 0) {
    items.push({ label: '*', variant: 'note' });
  }

  return items;
}

export function getOtherFindingsLabel(tooth?: ToothRecord): string {
  return getOtherFindingsItems(tooth).map(i => i.label).join(', ');
}

export function getFindingsTxLabel(tooth?: ToothRecord): string {
  return getOtherFindingsLabel(tooth);
}
