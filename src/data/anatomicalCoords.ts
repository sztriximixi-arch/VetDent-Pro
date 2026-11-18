import { Species } from '../types/dental';

export interface ToothCoord {
  id: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  // Label coordinate next to tooth
  labelSide: 'left' | 'right';
  labelY?: number;
}

// Kutya ábra koordináták (343 x 463 px felbontáshoz)
export const DOG_IMAGE_DIMENSIONS = { width: 343, height: 463 };

export const DOG_TOOTH_COORDS: Record<number, ToothCoord> = {
  // Maxilla Jobb (100) - Felső jobb
  101: { id: 101, x: 173, y: 27, rx: 7, ry: 9, labelSide: 'left', labelY: 41 },
  102: { id: 102, x: 165, y: 30, rx: 7, ry: 9, labelSide: 'left', labelY: 59 },
  103: { id: 103, x: 154, y: 37, rx: 8, ry: 10, labelSide: 'left', labelY: 77 },
  104: { id: 104, x: 144, y: 67, rx: 16, ry: 24, labelSide: 'left', labelY: 95 }, // Szemfog
  105: { id: 105, x: 141, y: 103, rx: 7, ry: 9, labelSide: 'left', labelY: 114 },
  106: { id: 106, x: 135, y: 119, rx: 8, ry: 10, labelSide: 'left', labelY: 132 },
  107: { id: 107, x: 123, y: 138, rx: 9, ry: 11, labelSide: 'left', labelY: 150 },
  108: { id: 108, x: 113, y: 164, rx: 14, ry: 16, labelSide: 'left', labelY: 168 }, // Felső Tépőfog
  109: { id: 109, x: 113, y: 196, rx: 16, ry: 14, labelSide: 'left', labelY: 186 },
  110: { id: 110, x: 120, y: 214, rx: 12, ry: 9, labelSide: 'left', labelY: 204 },

  // Maxilla Bal (200) - Felső bal
  201: { id: 201, x: 182, y: 27, rx: 7, ry: 9, labelSide: 'right', labelY: 41 },
  202: { id: 202, x: 191, y: 30, rx: 7, ry: 9, labelSide: 'right', labelY: 59 },
  203: { id: 203, x: 203, y: 37, rx: 8, ry: 10, labelSide: 'right', labelY: 77 },
  204: { id: 204, x: 213, y: 67, rx: 16, ry: 24, labelSide: 'right', labelY: 95 }, // Szemfog
  205: { id: 205, x: 216, y: 103, rx: 7, ry: 9, labelSide: 'right', labelY: 114 },
  206: { id: 206, x: 223, y: 119, rx: 8, ry: 10, labelSide: 'right', labelY: 132 },
  207: { id: 207, x: 235, y: 138, rx: 9, ry: 11, labelSide: 'right', labelY: 150 },
  208: { id: 208, x: 245, y: 164, rx: 14, ry: 16, labelSide: 'right', labelY: 168 }, // Felső Tépőfog
  209: { id: 209, x: 244, y: 196, rx: 16, ry: 14, labelSide: 'right', labelY: 186 },
  210: { id: 210, x: 237, y: 214, rx: 12, ry: 9, labelSide: 'right', labelY: 204 },

  // Mandibula Jobb (400) - Alsó jobb
  411: { id: 411, x: 128, y: 253, rx: 7, ry: 9, labelSide: 'left', labelY: 254 },
  410: { id: 410, x: 128, y: 268, rx: 8, ry: 9, labelSide: 'left', labelY: 272 },
  409: { id: 409, x: 135, y: 295, rx: 11, ry: 18, labelSide: 'left', labelY: 290 }, // Alsó Tépőfog
  408: { id: 408, x: 143, y: 325, rx: 8, ry: 11, labelSide: 'left', labelY: 308 },
  407: { id: 407, x: 147, y: 347, rx: 7, ry: 10, labelSide: 'left', labelY: 326 },
  406: { id: 406, x: 150, y: 366, rx: 7, ry: 8, labelSide: 'left', labelY: 344 },
  405: { id: 405, x: 151, y: 380, rx: 6, ry: 7, labelSide: 'left', labelY: 362 },
  404: { id: 404, x: 141, y: 413, rx: 18, ry: 21, labelSide: 'left', labelY: 380 }, // Szemfog
  403: { id: 403, x: 156, y: 420, rx: 7, ry: 8, labelSide: 'left', labelY: 398 },
  402: { id: 402, x: 165, y: 422, rx: 6, ry: 8, labelSide: 'left', labelY: 416 },
  401: { id: 401, x: 173, y: 424, rx: 5, ry: 7, labelSide: 'left', labelY: 434 },

  // Mandibula Bal (300) - Alsó bal
  311: { id: 311, x: 230, y: 254, rx: 7, ry: 9, labelSide: 'right', labelY: 254 },
  310: { id: 310, x: 229, y: 268, rx: 8, ry: 9, labelSide: 'right', labelY: 272 },
  309: { id: 309, x: 222, y: 296, rx: 11, ry: 18, labelSide: 'right', labelY: 290 }, // Alsó Tépőfog
  308: { id: 308, x: 214, y: 325, rx: 8, ry: 11, labelSide: 'right', labelY: 308 },
  307: { id: 307, x: 209, y: 346, rx: 7, ry: 10, labelSide: 'right', labelY: 326 },
  306: { id: 306, x: 207, y: 366, rx: 7, ry: 8, labelSide: 'right', labelY: 344 },
  305: { id: 305, x: 206, y: 379, rx: 6, ry: 7, labelSide: 'right', labelY: 362 },
  304: { id: 304, x: 216, y: 412, rx: 18, ry: 21, labelSide: 'right', labelY: 380 }, // Szemfog
  303: { id: 303, x: 200, y: 421, rx: 7, ry: 8, labelSide: 'right', labelY: 398 },
  302: { id: 302, x: 191, y: 423, rx: 6, ry: 8, labelSide: 'right', labelY: 416 },
  301: { id: 301, x: 182, y: 423, rx: 5, ry: 7, labelSide: 'right', labelY: 434 },
};

// Macska ábra koordináták (355 x 482 px felbontáshoz)
export const CAT_IMAGE_DIMENSIONS = { width: 355, height: 482 };

export const CAT_TOOTH_COORDS: Record<number, ToothCoord> = {
  // Maxilla Jobb (100) - Felső jobb
  101: { id: 101, x: 172, y: 44, rx: 5, ry: 7, labelSide: 'left', labelY: 41 },
  102: { id: 102, x: 164, y: 45, rx: 5, ry: 7, labelSide: 'left', labelY: 59 },
  103: { id: 103, x: 155, y: 48, rx: 5, ry: 7, labelSide: 'left', labelY: 77 },
  104: { id: 104, x: 139, y: 65, rx: 12, ry: 20, labelSide: 'left', labelY: 95 }, // Szemfog
  106: { id: 106, x: 129, y: 92, rx: 7, ry: 10, labelSide: 'left', labelY: 130 },
  107: { id: 107, x: 120, y: 130, rx: 9, ry: 14, labelSide: 'left', labelY: 148 },
  108: { id: 108, x: 105, y: 166, rx: 14, ry: 20, labelSide: 'left', labelY: 166 }, // Tépőfog
  109: { id: 109, x: 97, y: 185, rx: 10, ry: 7, labelSide: 'left', labelY: 184 },

  // Maxilla Bal (200) - Felső bal
  201: { id: 201, x: 189, y: 44, rx: 5, ry: 7, labelSide: 'right', labelY: 41 },
  202: { id: 202, x: 197, y: 45, rx: 5, ry: 7, labelSide: 'right', labelY: 59 },
  203: { id: 203, x: 206, y: 48, rx: 5, ry: 7, labelSide: 'right', labelY: 77 },
  204: { id: 204, x: 222, y: 65, rx: 12, ry: 20, labelSide: 'right', labelY: 95 }, // Szemfog
  206: { id: 206, x: 232, y: 92, rx: 7, ry: 10, labelSide: 'right', labelY: 130 },
  207: { id: 207, x: 241, y: 130, rx: 9, ry: 14, labelSide: 'right', labelY: 148 },
  208: { id: 208, x: 256, y: 166, rx: 14, ry: 20, labelSide: 'right', labelY: 166 }, // Tépőfog
  209: { id: 209, x: 264, y: 185, rx: 10, ry: 7, labelSide: 'right', labelY: 184 },

  // Mandibula Jobb (400) - Alsó jobb
  409: { id: 409, x: 114, y: 305, rx: 11, ry: 18, labelSide: 'left', labelY: 279 }, // Carnassial
  408: { id: 408, x: 125, y: 336, rx: 9, ry: 13, labelSide: 'left', labelY: 297 },
  407: { id: 407, x: 135, y: 360, rx: 8, ry: 12, labelSide: 'left', labelY: 315 },
  404: { id: 404, x: 142, y: 422, rx: 14, ry: 18, labelSide: 'left', labelY: 368 }, // Szemfog
  403: { id: 403, x: 160, y: 427, rx: 5, ry: 6, labelSide: 'left', labelY: 386 },
  402: { id: 402, x: 168, y: 428, rx: 5, ry: 6, labelSide: 'left', labelY: 404 },
  401: { id: 401, x: 175, y: 429, rx: 4, ry: 6, labelSide: 'left', labelY: 422 },

  // Mandibula Bal (300) - Alsó bal
  309: { id: 309, x: 247, y: 305, rx: 11, ry: 18, labelSide: 'right', labelY: 279 }, // Carnassial
  308: { id: 308, x: 236, y: 336, rx: 9, ry: 13, labelSide: 'right', labelY: 297 },
  307: { id: 307, x: 226, y: 360, rx: 8, ry: 12, labelSide: 'right', labelY: 315 },
  304: { id: 304, x: 219, y: 422, rx: 14, ry: 18, labelSide: 'right', labelY: 368 }, // Szemfog
  303: { id: 303, x: 201, y: 427, rx: 5, ry: 6, labelSide: 'right', labelY: 386 },
  302: { id: 302, x: 193, y: 428, rx: 5, ry: 6, labelSide: 'right', labelY: 404 },
  301: { id: 301, x: 186, y: 429, rx: 4, ry: 6, labelSide: 'right', labelY: 422 },
};

export function getSpeciesAnatomicalConfig(species: Species) {
  if (species === 'dog') {
    return {
      imageSrc: '/assets/aistudio/kutya_fogazat_c98f86de.jpg',
      dimensions: DOG_IMAGE_DIMENSIONS,
      coords: DOG_TOOTH_COORDS
    };
  }
  return {
    imageSrc: '/assets/aistudio/macska_fogazat_4d41027f.jpg',
    dimensions: CAT_IMAGE_DIMENSIONS,
    coords: CAT_TOOTH_COORDS
  };
}
