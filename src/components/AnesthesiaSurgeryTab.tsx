import React, { useState } from 'react';
import { SurgicalLog, LocalBlock } from '../types/dental';
import { Plus, Trash2, Image as ImageIcon, Upload, Shield, Eye } from 'lucide-react';

interface AnesthesiaSurgeryTabProps {
  surgicalLog: SurgicalLog;
  onChange: (updated: Partial<SurgicalLog>) => void;
}

const COMMON_NERVES = [
  'N. infraorbitalis (Felső metszők, szemfog, PM1-3)',
  'N. maxillaris (Teljes felső kvadráns)',
  'N. mandibularis (Teljes alsó kvadráns)',
  'N. mentalis (Alsó metszők, szemfog, PM1-2)'
];

const COMMON_DRUGS = [
  'Bupivacain 0.5% (hosszú hatás: 6-8 óra)',
  'Lidocain 2% (gyors hatás: 1-2 óra)',
  'Bupivacain 0.5% + Lidocain 2% (1:1 keverék)',
  'Articain 4% + Epinefrin'
];

export const AnesthesiaSurgeryTab: React.FC<AnesthesiaSurgeryTabProps> = ({
  surgicalLog,
  onChange
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const addBlock = () => {
    const newBlock: LocalBlock = {
      nerve: 'N. infraorbitalis',
      side: 'jobb',
      drug: 'Bupivacain 0.5%',
      volumeMl: 0.5
    };
    onChange({ localBlocks: [...surgicalLog.localBlocks, newBlock] });
  };

  const removeBlock = (index: number) => {
    const updated = surgicalLog.localBlocks.filter((_, i) => i !== index);
    onChange({ localBlocks: updated });
  };

  const updateBlock = (index: number, patch: Partial<LocalBlock>) => {
    const updated = surgicalLog.localBlocks.map((b, i) => i === index ? { ...b, ...patch } : b);
    onChange({ localBlocks: updated });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SZEKCIÓ: Lokális érzéstelenítés és idegblokkok */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Lokális Érzéstelenítés & Idegblokkok
            </h3>
            <p className="text-xs text-slate-500">
              Regionális blokkok alkalmazása a műtét alatti fájdalomcsillapításra és az altatási mélység csökkentésére.
            </p>
          </div>

          <button
            type="button"
            onClick={addBlock}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            + Idegblokk hozzáadása
          </button>
        </div>

        {surgicalLog.localBlocks.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
            Még nem lett rögzítve helyi blokk. Kattintson a fenti gombra új lokális érzéstelenítési blokk hozzáadásához.
          </div>
        ) : (
          <div className="space-y-3">
            {surgicalLog.localBlocks.map((block, idx) => (
              <div key={idx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Ideg kiválasztó */}
                <div className="md:col-span-4">
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Ideg (Anatómiai elhelyezkedés)
                  </label>
                  <select
                    value={block.nerve}
                    onChange={e => updateBlock(idx, { nerve: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-medium"
                  >
                    <option value="N. infraorbitalis">N. infraorbitalis (Felső elülső)</option>
                    <option value="N. maxillaris">N. maxillaris (Felső teljes)</option>
                    <option value="N. mandibularis">N. mandibularis (Alsó teljes)</option>
                    <option value="N. mentalis">N. mentalis (Alsó elülső)</option>
                    <option value="Infiltrációs lokális">Infiltrációs lokális</option>
                  </select>
                </div>

                {/* Oldal */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Oldal
                  </label>
                  <select
                    value={block.side}
                    onChange={e => updateBlock(idx, { side: e.target.value as 'jobb' | 'bal' | 'mindkettő' })}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                  >
                    <option value="jobb">Jobb</option>
                    <option value="bal">Bal</option>
                    <option value="mindkettő">Mindkettő</option>
                  </select>
                </div>

                {/* Hatóanyag */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Helyi érzéstelenítő
                  </label>
                  <select
                    value={block.drug}
                    onChange={e => updateBlock(idx, { drug: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-md"
                  >
                    <option value="Bupivacain 0.5%">Bupivacain 0.5%</option>
                    <option value="Lidocain 2%">Lidocain 2%</option>
                    <option value="Bupivacain 0.5% + Lidocain 2% (1:1)">Bupivacain + Lidocain (1:1)</option>
                    <option value="Articain 4%">Articain 4%</option>
                  </select>
                </div>

                {/* Mennyiség ml */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Mennyiség (ml)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    value={block.volumeMl}
                    onChange={e => updateBlock(idx, { volumeMl: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-md text-center"
                  />
                </div>

                {/* Törlés */}
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                    title="Blokk törlése"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SZEKCIÓ: Varratok és Sebészi részletek */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Varratok & Sebészi Részletek
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alkalmazott varróanyag
            </label>
            <input
              type="text"
              value={surgicalLog.sutureType}
              onChange={e => onChange({ sutureType: e.target.value })}
              placeholder="Pl. Monocryl 4-0 reverz vágó tűvel"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Gyakori: Monocryl 4-0 / 5-0 (gyorsan felszívódó), Vicryl 4-0
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Öltéstípus / Öltésminta
            </label>
            <input
              type="text"
              value={surgicalLog.suturePattern}
              onChange={e => onChange({ suturePattern: e.target.value })}
              placeholder="Pl. Egyszerű csomós öltések feszülésmentes lebennyel"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Részletes sebészi leírás / Megjegyzések
          </label>
          <textarea
            rows={3}
            value={surgicalLog.surgicalNotes}
            onChange={e => onChange({ surgicalNotes: e.target.value })}
            placeholder="Pl. Mukoperioszteális lebeny képzése crevicularis metszéssel, csontfúrás vízhűtéses sebészi turbinával, gyökérluxáció, alveolus kürettálása és sebzárás..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* 3. SZEKCIÓ: Dentális Röntgen Felvételek & Lelet */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Digitális Fogászati Röntgen (Dentális RTG)
            </h3>
            <p className="text-xs text-slate-500">
              Intraorális röntgenfelvételek értékelése, periapikális lízis, rezorpció és gyökérstatusz.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Felvételek száma:</span>
            <input
              type="number"
              min="0"
              max="40"
              value={surgicalLog.xrayCount}
              onChange={e => onChange({ xrayCount: parseInt(e.target.value) || 0 })}
              className="w-16 px-2 py-1 text-xs font-mono font-bold text-center bg-white border border-slate-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Röntgenvizsgálat lelete és megállapításai
          </label>
          <textarea
            rows={3}
            value={surgicalLog.xrayFindings}
            onChange={e => onChange({ xrayFindings: e.target.value })}
            placeholder="Pl. Intraorális párhuzamos és biszektrix felvételek: a 108-as fog distalis gyökerénél periapikális radiolucens terület (csontfelszívódás), gyökértörés kizárva..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
          />
        </div>

        {/* Szövődmények */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Műtét alatti észrevételek / Szövődmények
          </label>
          <input
            type="text"
            value={surgicalLog.complications}
            onChange={e => onChange({ complications: e.target.value })}
            placeholder="Pl. Szövődménymentes beavatkozás, vérzés minimális."
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
          />
        </div>
      </div>

    </div>
  );
};
