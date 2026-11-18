import { DentalRecord, ToothRecord } from '../types/dental';
import { getAllTeethMetadata, getSpeciesTeethIds } from './triadanConfig';

export function createBlankRecord(species: 'dog' | 'cat' = 'dog'): DentalRecord {
  const metadata = getAllTeethMetadata(species);
  const teeth: Record<number, ToothRecord> = {};

  Object.values(metadata).forEach(meta => {
    teeth[meta.id] = {
      id: meta.id,
      quadrant: meta.quadrant,
      nameHu: meta.nameHu,
      shortName: meta.shortName,
      pathologies: ['0'], // Alapértelmezetten ép/egészséges
      procedures: [],
      probingDepths: {},
      notes: ''
    };
  });

  const today = new Date().toISOString().split('T')[0];

  return {
    id: `rec-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clinicName: 'Pannonia Kisállatgyógyászati Centrum & Fogászat',
    clinicAddress: '1118 Budapest, Rétköz utca 12.',
    clinicPhone: '+36 1 450 8820',
    clinicEmail: 'fogaszat@pannoniavet.hu',
    patientName: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    species,
    breed: '',
    ageYears: 3,
    ageMonths: 0,
    sex: 'ismeretlen',
    weightKg: 10,
    visitDate: today,
    vetName: 'Dr. Kovács Eszter Állatorvos',
    assistantName: 'Nagy Vivien asszisztens',
    asaStatus: 'I',
    lastFeedingTime: 'Előző este 20:00 (12 órás koplalás)',
    bloodwork: 'normal',
    bloodworkNote: 'Preoperatív rutin vérkép és biokémia (máj, vese) referencia tartományban.',
    mainComplaint: ['Fogkő', 'Bűzös lehelet (halitosis)'],
    mainComplaintOther: '',
    homeDentalCare: 'Alkalomszerű fogmosás, heti 1x rágóka',
    foodType: 'Száraz táp + nedves táp vegyesen',
    generalHistory: 'Kiegyensúlyozott általános állapot, védőoltásai rendezettek.',
    teeth,
    periodontalStage: 'normal',
    calculusIndex: '0',
    gingivalIndex: '0',
    occlusion: 'Normál (ollós harapás)',
    stomatitis: 'Nincs',
    surgicalLog: {
      localBlocks: [],
      sutureType: 'Monocryl 4-0',
      suturePattern: 'Egyszerű csomós öltések',
      xrayCount: 0,
      xrayFindings: '',
      complications: 'Szövődménymentes beavatkozás.',
      surgicalNotes: ''
    },
    dischargePlan: {
      medications: [
        {
          id: '1',
          name: 'Meloxidyl 1,5 mg/ml orális szuszpenzió',
          dose: '0.1 mg/ttkg',
          frequency: 'Naponta 1x reggel eleséggel',
          durationDays: 4,
          instructions: 'Nem-szteroid gyulladáscsökkentő és fájdalomcsillapító. Mindig etetés közben vagy közvetlenül utána adandó.'
        },
        {
          id: '2',
          name: 'Stomodine szájápoló gél (Klórhexidin 0.12%)',
          dose: 'Borsónyi mennyiség',
          frequency: 'Naponta 2x',
          durationDays: 7,
          instructions: 'Gyengéden az ínyre kenni ujjal a műtéti terület kíméletével.'
        }
      ],
      dietRecommendations: 'Kizárólag puha eleség (konzerv, feláztatott táp) adható 5-7 napig szobahőmérsékleten.',
      activityAndChewRestrictions: 'Kemény rágócsontok, fadarabok, labdák rágása szigorúan tilos legalább 14 napig!',
      oralHygienePostOp: 'A műtéti területet dörzsölni tilos. A szájgél gyengéd felvitele elegendő.',
      recheckDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      recheckReason: 'Sebgyógyulás ellenőrzése, varratok állapotának kontrollja.',
      doctorNotes: 'A beavatkozás során az ép fogak ultrahangos depurálása és polírozása megtörtént.'
    }
  };
}

// 1. MINTA ESET: Max (Kutya - Tépőfog letörés, parodontitis, extrakció)
export function getSampleDogRecord(): DentalRecord {
  const base = createBlankRecord('dog');
  base.patientName = 'Max';
  base.ownerName = 'Kovács Péter';
  base.ownerEmail = 'kovacs.peter.sample@gmail.com';
  base.ownerPhone = '+36 30 456 7890';
  base.breed = 'Golden Retriever';
  base.ageYears = 6;
  base.ageMonths = 4;
  base.sex = 'him';
  base.weightKg = 32.5;
  base.asaStatus = 'II';
  base.mainComplaint = ['Bűzös lehelet (halitosis)', 'Fogkő', 'Fájdalom jelzése rágáskor'];
  base.mainComplaintOther = 'Jobb oldalon nem szívesen rág kemény eleséget.';
  base.generalHistory = '6 éves kan, anamnézisben nincs krónikus belgyógyászati kórkép.';
  base.bloodwork = 'normal';
  base.bloodworkNote = 'Hematológia és biokémiai panel normál tartományban.';

  // Minden fog kap ultrahangos tisztítást és polírozást
  Object.keys(base.teeth).forEach(idStr => {
    const id = Number(idStr);
    const t = base.teeth[id];
    t.pathologies = ['0'];
    t.procedures = ['U', 'POL'];
  });

  // Specifikus patológiák
  // 108: Felső jobb 4. premoláris (tépőfog) - szilánk törés és pulzanyitás!
  if (base.teeth[108]) {
    base.teeth[108].pathologies = ['FX-C', 'PE', 'PD2'];
    base.teeth[108].procedures = ['RX', 'EXT-SURG'];
    base.teeth[108].probingDepths = { mesial: 2, buccal: 4, distal: 2, palatalOrLingual: 2 };
    base.teeth[108].notes = 'Koronatörés szilánkos repedéssel a vestibuláris csúcson, pulpaüreg exponálódott. Sebészi háromgyökerű extrakció indokolt.';
  }

  // 104, 204: Szemfogon fogkő T2 és gingivitis
  if (base.teeth[104]) {
    base.teeth[104].pathologies = ['T2', 'G2', 'PD1'];
    base.teeth[104].probingDepths = { buccal: 3, mesial: 2 };
    base.teeth[104].notes = 'Kifejezett buccalis fogkőlerakódás, szondázáskor enyhe marginális ínyvérzés.';
  }
  if (base.teeth[204]) {
    base.teeth[204].pathologies = ['T2', 'G1'];
    base.teeth[204].probingDepths = { buccal: 2 };
  }

  // 409: Alsó jobb tépőfog - T2, Fur1
  if (base.teeth[409]) {
    base.teeth[409].pathologies = ['T2', 'Fur1'];
    base.teeth[409].procedures = ['U', 'POL', 'CURE'];
    base.teeth[409].probingDepths = { buccal: 4, distal: 3 };
    base.teeth[409].notes = 'Buccalis furkáció kezdeti feltáródása, alapos zárt kürettálás történt.';
  }

  // 308: Korábban hiányzó fog
  if (base.teeth[308]) {
    base.teeth[308].pathologies = ['M'];
    base.teeth[308].procedures = [];
    base.teeth[308].notes = 'Korábban extrahált fog, csontos alveolus teljesen gyógyult.';
  }

  // Összesített parodontális indexek
  base.periodontalStage = 'stage2';
  base.calculusIndex = 'T2 (közepes)';
  base.gingivalIndex = 'G1–G2';
  base.occlusion = 'Normál (ollós harapás)';

  // Műtéti napló
  base.surgicalLog = {
    localBlocks: [
      { nerve: 'N. infraorbitalis', side: 'jobb', drug: 'Bupivacain 0.5% + Lidocain 2% (1:1)', volumeMl: 1.2 },
      { nerve: 'N. mentalis', side: 'jobb', drug: 'Lidocain 2%', volumeMl: 0.5 }
    ],
    sutureType: 'Monocryl 4-0 reverz vágó tűvel',
    suturePattern: 'Egyszerű csomós feszülésmentes öltések a lebernyegen',
    xrayCount: 4,
    xrayFindings: 'Pre- és poszt-extrakciós felvételek a 108-as fogról: a 3 gyökér teljesen eltávolításra került, periapikális lízis enyhe foka látható, gyökércsúcs nem maradt vissza.',
    complications: 'Nincs, vérzés minimális, mucoperiostealis lebernyeg primer zárása sikeres.',
    surgicalNotes: '108-as fog szekcionálása vízhűtéses turbinával történt a bifurkációk mentén, a 3 különálló gyökér luxátorral és elevatorszal atraumatikusan luxálva.'
  };

  // Utókezelési terv
  base.dischargePlan = {
    medications: [
      {
        id: '1',
        name: 'Meloxidyl 1,5 mg/ml orális szuszpenzió',
        dose: '32 kg-os jelzésig szívva fecskendővel',
        frequency: 'Naponta 1x délelőtt eleséggel',
        durationDays: 5,
        instructions: 'Gyulladáscsökkentő és fájdalomcsillapító kutyáknak. Mindig teli gyomorra adandó!'
      },
      {
        id: '2',
        name: 'Kesium 500 mg tabletta (Amoxicillin/Klavulánsav)',
        dose: '1 tabletta',
        frequency: 'Naponta 2x (12 óránként)',
        durationDays: 7,
        instructions: 'Széles spektrumú antibiotikum a szájüregi sebfertőzés megelőzésére.'
      },
      {
        id: '3',
        name: 'Stomodine szájápoló gél',
        dose: 'Borsónyi gél',
        frequency: 'Naponta 2x este',
        durationDays: 10,
        instructions: 'Kívülről a pofa felől óvatosan az ínyre juttatni a seb közvetlen piszkálása nélkül.'
      }
    ],
    dietRecommendations: 'Puha eleség (konzerv, vízben puhított táp) etetése kötelező 10 napig. Tilos szilárd száraz tápot szárazon adni.',
    activityAndChewRestrictions: 'Rágócsontok, fadarabok, labdák, kemény rágójátékok tilosak 14 napig a varratok védelmében.',
    oralHygienePostOp: 'A seb környékét fogkefével tilos mosni. A gél alkalmazása javasolt.',
    recheckDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    recheckReason: 'Varratkontroll és a sebgyógyulás klinikai ellenőrzése.',
    doctorNotes: 'A 108-as tépőfogat sikeresen eltávolítottuk, a többi fogkőmentes és polírozott. Láz, elesettség vagy erős vérzés esetén azonnali konzultáció szükséges.'
  };

  return base;
}

// 2. MINTA ESET: Mici (Macska - TR / FORL resorptív lézió, sebészi húzás)
export function getSampleCatRecord(): DentalRecord {
  const base = createBlankRecord('cat');
  base.patientName = 'Mici';
  base.ownerName = 'Tóth Andrea';
  base.ownerEmail = 'toth.andrea.minta@gmail.com';
  base.ownerPhone = '+36 20 987 6543';
  base.breed = 'Európai házimacska';
  base.ageYears = 7;
  base.ageMonths = 2;
  base.sex = 'ivartalanitott_nosteny';
  base.weightKg = 4.1;
  base.asaStatus = 'II';
  base.mainComplaint = ['Fokozott nyálzás', 'Táplálási nehézség (a tápot kiejti a szájából)', 'Pofa dörzsölése'];
  base.mainComplaintOther = 'Az utóbbi 2 hétben étvágya csökkent, a száraz tápot nem fogadja el.';
  base.generalHistory = '7 éves ivartalanított nőstény, benti tartású macska.';
  base.bloodwork = 'normal';
  base.bloodworkNote = 'Preoperatív idős macska profil (Kreatinin, Urea, GPT, T4) normális.';

  // Minden fog depurálás és polírozás
  Object.keys(base.teeth).forEach(idStr => {
    const id = Number(idStr);
    const t = base.teeth[id];
    t.pathologies = ['0'];
    t.procedures = ['U', 'POL'];
  });

  // TR léziók macskánál tipikusan 307 és 407 (alsó 3. premoláris)
  if (base.teeth[307]) {
    base.teeth[307].pathologies = ['TR3', 'G3', 'Mob2'];
    base.teeth[307].procedures = ['RX', 'EXT-SURG'];
    base.teeth[307].probingDepths = { buccal: 4, palatalOrLingual: 3 };
    base.teeth[307].notes = 'FORL 3. stádiumú macska resorptív lézió a fognyakon kiterjedt granulációs szövettel és dentinvesztéssel. Erősen fájdalmas, extrakció indokolt.';
  }

  if (base.teeth[407]) {
    base.teeth[407].pathologies = ['TR2', 'G2'];
    base.teeth[407].procedures = ['RX', 'EXT-SURG'];
    base.teeth[407].probingDepths = { buccal: 3 };
    base.teeth[407].notes = 'FORL 2. stádiumú nyaki lézió a cementoenamel junctiónál.';
  }

  if (base.teeth[108]) {
    base.teeth[108].pathologies = ['T2', 'G1'];
  }
  if (base.teeth[208]) {
    base.teeth[208].pathologies = ['T2', 'G1'];
  }

  // Összesített parodontális indexek
  base.periodontalStage = 'stage2';
  base.calculusIndex = 'T1–T2';
  base.gingivalIndex = 'G2 (lokális ínygyulladás a 307/407 körül)';
  base.occlusion = 'Normál';
  base.stomatitis = 'Enyhe lokalizált gingivostomatitis';

  // Műtéti napló
  base.surgicalLog = {
    localBlocks: [
      { nerve: 'N. mandibularis (Foramen mandibulare)', side: 'mindkettő', drug: 'Bupivacain 0.5%', volumeMl: 0.15 }
    ],
    sutureType: 'Monocryl 5-0 atraumatikus tűvel',
    suturePattern: 'Egyszerű csomós öltések',
    xrayCount: 4,
    xrayFindings: 'Intraorális rtg megerősítette a 307-es fog 1-es típusú resorptív lézióját (ép gyökérkontúr mellett periapikális lízis) és 407-es fog 2-es típusú lézióját (gyökér ankilózis és rezorpció).',
    complications: 'Nincsenek, stabil altatás.',
    surgicalNotes: '307 és 407 komplett extrakciója csontablak képzésével és feszülésmentes nyálkahártya-plasztikával megtörtént.'
  };

  // Utókezelési terv
  base.dischargePlan = {
    medications: [
      {
        id: '1',
        name: 'Onsior 6 mg tabletta macskáknak (Robenacoxib)',
        dose: '1 tabletta',
        frequency: 'Naponta 1x (reggel étkezéskor)',
        durationDays: 3,
        instructions: 'Gyors hatású fájdalomcsillapító macskáknak. Ízesített, eleségbe rejtve vagy közvetlenül beadható.'
      },
      {
        id: '2',
        name: 'Clavaseptin 50 mg tabletta',
        dose: '1 tabletta',
        frequency: 'Naponta 2x (12 óránként)',
        durationDays: 7,
        instructions: 'Antibiotikum a szájüregi sebfertőzés megelőzésére.'
      }
    ],
    dietRecommendations: 'Kizárólag finom textúrájú macskakonzerv vagy mousse állagú táp adható 7 napig szobahőmérsékleten.',
    activityAndChewRestrictions: 'Száraz tápot, jutalomfalatokat és fűevést szigorúan kerülni kell a seb védelmében.',
    oralHygienePostOp: 'A szájat birizgálni nem szabad, varratok maguktól felszívódnak.',
    recheckDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    recheckReason: 'Műtéti hegek gyógyulásának ellenőrzése és kontroll súlymérés.',
    doctorNotes: 'A fogfájdalmat okozó resorptív fogakat eltávolítottuk, a többi fogat letisztítottuk. A cica étvágya a fájdalom megszűntével 24-48 órán belül normalizálódni fog.'
  };

  return base;
}
