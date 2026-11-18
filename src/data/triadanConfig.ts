import { Species, ToothQuadrant } from '../types/dental';

export interface ToothMeta {
  id: number;
  quadrant: ToothQuadrant;
  nameHu: string;
  shortName: string;
  isCarnassial?: boolean; // Tépőfog (108, 208, 309, 409)
  isCanine?: boolean;     // Szemfog (104, 204, 304, 404)
  rootsCount: number;     // Gyökerek száma (segít extrakciónál)
}

// Segédfüggvény a fog anatómiai nevéhez
function getToothMeta(id: number): ToothMeta {
  const quad = Math.floor(id / 100) as ToothQuadrant;
  const toothIndex = id % 100;
  
  let quadName = '';
  switch (quad) {
    case 100: quadName = 'Felső jobb'; break;
    case 200: quadName = 'Felső bal'; break;
    case 300: quadName = 'Alsó bal'; break;
    case 400: quadName = 'Alsó jobb'; break;
  }

  let typeName = '';
  let shortName = '';
  let roots = 1;
  let isCarnassial = false;
  let isCanine = false;

  if (toothIndex <= 3) {
    typeName = `${toothIndex}. metszőfog`;
    shortName = `I${toothIndex}`;
    roots = 1;
  } else if (toothIndex === 4) {
    typeName = 'Szemfog';
    shortName = 'C';
    roots = 1;
    isCanine = true;
  } else if (toothIndex === 5) {
    typeName = '1. premoláris';
    shortName = 'PM1';
    roots = 1;
  } else if (toothIndex === 6) {
    typeName = '2. premoláris';
    shortName = 'PM2';
    roots = quad <= 200 ? 2 : 2;
  } else if (toothIndex === 7) {
    typeName = '3. premoláris';
    shortName = 'PM3';
    roots = quad <= 200 ? 2 : 2;
  } else if (toothIndex === 8) {
    typeName = '4. premoláris';
    shortName = 'PM4';
    roots = quad <= 200 ? 3 : 2;
    if (quad <= 200) isCarnassial = true; // Felső tépőfog!
  } else if (toothIndex === 9) {
    typeName = '1. moláris';
    shortName = 'M1';
    roots = quad <= 200 ? 3 : 2;
    if (quad >= 300) isCarnassial = true; // Alsó tépőfog!
  } else if (toothIndex === 10) {
    typeName = '2. moláris';
    shortName = 'M2';
    roots = quad <= 200 ? 3 : 2;
  } else if (toothIndex === 11) {
    typeName = '3. moláris';
    shortName = 'M3';
    roots = 1;
  }

  return {
    id,
    quadrant: quad,
    nameHu: `${quadName} ${typeName}`,
    shortName,
    isCarnassial,
    isCanine,
    rootsCount: roots
  };
}

// Kutya fogak listája (42 fog)
export const DOG_TEETH_IDS = {
  q100: [110, 109, 108, 107, 106, 105, 104, 103, 102, 101], // Jobb felső (kívülről befelé)
  q200: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210], // Bal felső (belülről kifelé)
  q400: [411, 410, 409, 408, 407, 406, 405, 404, 403, 402, 401], // Jobb alsó
  q300: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311], // Bal alsó
};

// Macska fogak listája (30 fog)
// Macskánál hiányzik: 105, 205; alsóban: 305, 306, 405, 406; molárisoknál csak 109, 209, 309, 409 van
export const CAT_TEETH_IDS = {
  q100: [109, 108, 107, 106, 104, 103, 102, 101],
  q200: [201, 202, 203, 204, 206, 207, 208, 209],
  q400: [409, 408, 407, 404, 403, 402, 401],
  q300: [301, 302, 303, 304, 307, 308, 309],
};

export function getSpeciesTeethIds(species: Species) {
  return species === 'dog' ? DOG_TEETH_IDS : CAT_TEETH_IDS;
}

export function getAllTeethMetadata(species: Species): Record<number, ToothMeta> {
  const ids = getSpeciesTeethIds(species);
  const allIds = [...ids.q100, ...ids.q200, ...ids.q300, ...ids.q400];
  const map: Record<number, ToothMeta> = {};
  allIds.forEach(id => {
    map[id] = getToothMeta(id);
  });
  return map;
}

export const PATHOLOGY_DESCRIPTIONS: Record<string, { label: string; description: string; color: string; badge: string }> = {
  '0': { label: 'Egészséges', description: 'Ép klinikai korona és fogíny', color: 'emerald', badge: '0' },
  'T1': { label: 'Fogkő I.', description: 'Enyhe szupra-gingivális lerakódás', color: 'amber', badge: 'T1' },
  'T2': { label: 'Fogkő II.', description: 'Közepes mértékű, a fogfelület 1/3–2/3-át fedő', color: 'amber', badge: 'T2' },
  'T3': { label: 'Fogkő III.', description: 'Súlyos, kiterjedt sub- és szupragingivális kő', color: 'amber', badge: 'T3' },
  'G1': { label: 'Ínygyulladás I.', description: 'Enyhe gingivitis, szondázáskor nem vérzik', color: 'rose', badge: 'G1' },
  'G2': { label: 'Ínygyulladás II.', description: 'Közepes ínygyulladás, vérzés szondázásra', color: 'rose', badge: 'G2' },
  'G3': { label: 'Ínygyulladás III.', description: 'Súlyos gingivitis, spontán vérzés', color: 'rose', badge: 'G3' },
  'PD1': { label: 'Periodontitis 1', description: 'Gingivitis tasakképződés nélkül', color: 'orange', badge: 'PD1' },
  'PD2': { label: 'Periodontitis 2', description: 'Enyhe csontveszteség (<25%)', color: 'orange', badge: 'PD2' },
  'PD3': { label: 'Periodontitis 3', description: 'Közepes csontveszteség (25–50%)', color: 'orange', badge: 'PD3' },
  'PD4': { label: 'Periodontitis 4', description: 'Súlyos csontveszteség (>50%)', color: 'orange', badge: 'PD4' },
  'Mob1': { label: 'Mobilitás I.', description: 'Enyhe horizontális kimozdíthatóság (0.2–0.5 mm)', color: 'red', badge: 'Mob1' },
  'Mob2': { label: 'Mobilitás II.', description: 'Kifejezett kimozdíthatóság (0.5–1 mm)', color: 'red', badge: 'Mob2' },
  'Mob3': { label: 'Mobilitás III.', description: 'Súlyos mobilitás horizontálisan és axiálisan', color: 'red', badge: 'Mob3' },
  'Fur1': { label: 'Furkáció I.', description: 'Gyökérvilla kezdeti szondázható érintettsége', color: 'yellow', badge: 'Fur1' },
  'Fur2': { label: 'Furkáció II.', description: 'A gyökérvilla részlegesen áthatolható', color: 'yellow', badge: 'Fur2' },
  'Fur3': { label: 'Furkáció III.', description: 'A szonda teljesen áthatol a gyökerek között', color: 'yellow', badge: 'Fur3' },
  'FX-C': { label: 'Koronatörés', description: 'A korona részleges törése', color: 'red', badge: 'FX-C' },
  'FX-CR': { label: 'Korona-gyökér törés', description: 'A törésvonal subgingiválisan terjed', color: 'red', badge: 'FX-CR' },
  'PE': { label: 'Pulznyitott törés', description: 'Szabaddá vált pulpaüreg, fertőzésveszély', color: 'red', badge: 'PE' },
  'UCF': { label: 'Zárt törés', description: 'Zománc/dentin törés nyitott pulpa nélkül', color: 'yellow', badge: 'UCF' },
  'TR1': { label: 'Resorptív lézió 1', description: 'FORL / TR: enyhe cement- vagy zománchiány', color: 'purple', badge: 'TR1' },
  'TR2': { label: 'Resorptív lézió 2', description: 'Dentinbe hatoló lézió', color: 'purple', badge: 'TR2' },
  'TR3': { label: 'Resorptív lézió 3', description: 'Pulpát elérő kiterjedt lézió', color: 'purple', badge: 'TR3' },
  'TR4': { label: 'Resorptív lézió 4', description: 'Jelentős fogvesztés és gyökérleépülés', color: 'purple', badge: 'TR4' },
  'TR5': { label: 'Resorptív lézió 5', description: 'Teljesen elpusztult korona, csak gyökérmaradvány', color: 'purple', badge: 'TR5' },
  'M': { label: 'Hiányzó fog', description: 'Korábban kiesett vagy extrahált fog', color: 'slate', badge: 'M' },
  'U': { label: 'Impaktált / Nem előtört', description: 'Gingiva alatt maradt retineált fog', color: 'slate', badge: 'U' },
};

export const PROCEDURE_DESCRIPTIONS: Record<string, { label: string; description: string; badge: string }> = {
  'U': { label: 'Ultrahangos depurálás', description: 'Fogkőeltávolítás szupra- és subgingiválisan', badge: 'U' },
  'POL': { label: 'Polírozás', description: 'Fogfelszín simítása profilaktikus pasztával', badge: 'POL' },
  'CURE': { label: 'Subgingivalis kürett', description: 'Mély tasaktisztítás és gyökérsimítás', badge: 'CURE' },
  'EXT-S': { label: 'Egyszerű extrakció', description: 'Zárt húzás elevátorral és fogóval', badge: 'EXT-S' },
  'EXT-SURG': { label: 'Sebészi extrakció', description: 'Mukoperioszteális lebernyeg, csontfúrás, varrat', badge: 'EXT-SURG' },
  'RX': { label: 'Dentális Röntgen', description: 'Célzott intraorális rtg felvétel', badge: 'RX' },
  'ENDO': { label: 'Gyökérkezelés', description: 'Vitális pulpotómia vagy gyökértömés', badge: 'ENDO' },
  'FLAP': { label: 'Ínylebernyeg', description: 'Sebészi lebernyegképzés feltáráshoz', badge: 'FLAP' },
  'BIO': { label: 'Biopszia', description: 'Szövettani mintavétel elváltozásból', badge: 'BIO' },
};
