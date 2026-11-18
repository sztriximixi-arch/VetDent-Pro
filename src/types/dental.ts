export type Species = 'dog' | 'cat';

export type AnimalSex =
  | 'nosteny'
  | 'him'
  | 'ivartalanitott_nosteny'
  | 'ivartalanitott_him'
  | 'ismeretlen';

export const ANIMAL_SEX_LABELS: Record<AnimalSex, string> = {
  nosteny: 'nőstény',
  him: 'hím',
  ivartalanitott_nosteny: 'ivartalanított nőstény',
  ivartalanitott_him: 'ivartalanított hím',
  ismeretlen: 'ismeretlen',
};

export type AsaStatus = 'I' | 'II' | 'III' | 'IV' | 'V';

export type BloodworkResult = 'normal' | 'slight_variation' | 'pathological' | 'not_performed';

export type ToothQuadrant = 100 | 200 | 300 | 400;

export type PathologyCode = 
  | '0'      // Egészséges (Healthy)
  | 'T1' | 'T2' | 'T3'       // Fogkő (Tartarus)
  | 'G1' | 'G2' | 'G3'       // Gingivitis (Ínygyulladás)
  | 'PD1' | 'PD2' | 'PD3' | 'PD4' // Periodontális betegség
  | 'Mob1' | 'Mob2' | 'Mob3' // Mobilitás
  | 'Fur1' | 'Fur2' | 'Fur3' // Furkáció lézió
  | 'FX-C'   // Koronatörés (Crown fracture)
  | 'FX-CR'  // Korona-gyökér törés (Crown-root fracture)
  | 'PE'     // Pulznyitott (Pulp exposed)
  | 'UCF'    // Nem pulznyitott (Uncomplicated fracture)
  | 'TR1' | 'TR2' | 'TR3' | 'TR4' | 'TR5' // Macska resorptív lézió (FORL / Tooth Resorption)
  | 'M'      // Hiányzó fog (Missing)
  | 'U'      // Impaktált / elő nem tört (Unerupted)
  | 'CAR';   // Fogszuvasodás (ritka, de előfordul)

export type ProcedureCode = 
  | 'U'         // Ultrahangos fogkőeltávolítás (Ultrasonic scaling)
  | 'POL'       // Polírozás pasztával (Polishing)
  | 'CURE'      // Subgingivalis zárt kürettálás (Subgingival curettage)
  | 'EXT-S'     // Egyszerű zárt extrakció (Simple extraction)
  | 'EXT-SURG'  // Sebészi nyitott extrakció lebernyeggel (Surgical extraction)
  | 'RX'        // Intraorális röntgenfelvétel (Dental radiograph)
  | 'ENDO'      // Endodonciai kezelés / Gyökérkezelés
  | 'FLAP'      // Mukoperioszteális lebernyeg
  | 'BIO';      // Biopszia / Szövettan

export interface ProbingDepths {
  mesial?: number;
  buccal?: number;
  distal?: number;
  palatalOrLingual?: number;
}

export interface ToothRecord {
  id: number; // Triadan number (e.g. 104, 309)
  quadrant: ToothQuadrant;
  nameHu: string; // Pl. Felső jobb szemfog
  shortName: string; // Pl. I1, C, PM4, M1
  pathologies: PathologyCode[];
  procedures: ProcedureCode[];
  probingDepths: ProbingDepths;
  notes: string;
}

export interface LocalBlock {
  nerve: string;
  side: 'jobb' | 'bal' | 'mindkettő';
  drug: string;
  volumeMl: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  durationDays: number;
  instructions: string;
}

export interface SurgicalLog {
  localBlocks: LocalBlock[];
  sutureType: string;
  suturePattern: string;
  xrayCount: number;
  xrayFindings: string;
  complications: string;
  surgicalNotes: string;
}

export interface DischargePlan {
  medications: MedicationItem[];
  dietRecommendations: string;
  activityAndChewRestrictions: string;
  oralHygienePostOp: string;
  recheckDate: string;
  recheckReason: string;
  doctorNotes: string;
}

export interface DentalRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Klinika adatok
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  clinicEmail: string;

  // Páciens és vizit adatai
  patientName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  species: Species;
  breed: string;
  ageYears: number;
  ageMonths: number;
  sex?: AnimalSex;
  weightKg: number;

  // Anesztézia & orvos
  visitDate: string;
  vetName: string;
  assistantName: string;
  asaStatus: AsaStatus;
  lastFeedingTime: string;
  bloodwork: BloodworkResult;
  bloodworkNote: string;

  // Anamnézis
  mainComplaint: string[];
  mainComplaintOther: string;
  homeDentalCare: string;
  foodType: string;
  generalHistory: string;

  // Odontogram (Minden fog külön rögzítve)
  teeth: Record<number, ToothRecord>;

  // Összesített parodontális és szájüregi indexek (a fogászati táblázat aljához)
  periodontalStage?: 'normal' | 'stage1' | 'stage2' | 'stage3' | 'stage4';
  calculusIndex?: string;
  gingivalIndex?: string;
  occlusion?: string;
  stomatitis?: string;

  // Műtéti napló
  surgicalLog: SurgicalLog;

  // Utókezelési terv és gazdi tájékoztató
  dischargePlan: DischargePlan;
}
