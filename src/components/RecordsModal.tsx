import React, { useRef } from 'react';
import { DentalRecord } from '../types/dental';
import { FolderOpen, Plus, Trash2, Download, Upload, X, Calendar, User, CheckCircle } from 'lucide-react';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: DentalRecord[];
  activeRecordId: string;
  onLoadRecord: (record: DentalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onNewRecord: (species: 'dog' | 'cat') => void;
  onLoadSample: (type: 'dog' | 'cat') => void;
  onExportAllJson: () => void;
  onImportJson: (imported: DentalRecord[]) => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  activeRecordId,
  onLoadRecord,
  onDeleteRecord,
  onNewRecord,
  onLoadSample,
  onExportAllJson,
  onImportJson
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportJson(parsed);
        } else if (parsed && parsed.id && parsed.teeth) {
          onImportJson([parsed]);
        }
      } catch (err) {
        alert('Hiba a JSON fájl beolvasásakor. Érvényes VetDent JSON fájlt töltsön fel.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Fejléc */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Mentett Kezelési Lapok & Adatbázis
              </h3>
              <p className="text-xs text-slate-500">
                Kezelőorvosi lapok betöltése, új páciens indítása vagy biztonsági mentés
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Új lap és minta gombok sáv */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onNewRecord('dog');
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Új Kutya Lap
            </button>
            <button
              type="button"
              onClick={() => {
                onNewRecord('cat');
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Új Macska Lap
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Minta esetek:</span>
            <button
              type="button"
              onClick={() => {
                onLoadSample('dog');
                onClose();
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
            >
              Max (Kutya)
            </button>
            <button
              type="button"
              onClick={() => {
                onLoadSample('cat');
                onClose();
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg"
            >
              Mici (Macska)
            </button>
          </div>
        </div>

        {/* Kezelési lapok listája */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          {records.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Még nincsenek elmentett kezelési lapok a böngésző tárhelyén.
            </div>
          ) : (
            records.map(rec => {
              const isActive = rec.id === activeRecordId;
              const extractedCount = Object.values(rec.teeth).filter(t => t.procedures.some(p => p.startsWith('EXT'))).length;
              const pathologicCount = Object.values(rec.teeth).filter(t => t.pathologies.some(p => p !== '0')).length;

              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    onLoadRecord(rec);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-teal-50/50 border-teal-400 ring-1 ring-teal-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-900">
                        {rec.patientName || 'Névtelen páciens'}
                      </strong>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                        rec.species === 'dog' 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-purple-50 text-purple-800 border-purple-200'
                      }`}>
                        {rec.species === 'dog' ? 'Kutya' : 'Macska'}
                      </span>
                      {isActive && (
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Megnyitva
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Fajta: <strong className="text-slate-700">{rec.breed || '—'}</strong></span>
                      <span>·</span>
                      <span>Gazdi: <strong className="text-slate-700">{rec.ownerName || '—'}</strong></span>
                      <span>·</span>
                      <span>Dátum: <strong className="text-slate-700 font-mono">{rec.visitDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span>Érintett fogak: <strong className="text-amber-700">{pathologicCount}</strong></span>
                      <span>·</span>
                      <span>Húzások (EXT): <strong className="text-rose-700">{extractedCount}</strong></span>
                      <span>·</span>
                      <span>Orvos: {rec.vetName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(rec.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Kezelési lap törlése"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lábléc: JSON Import / Export */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-slate-700 hover:bg-slate-200/60 rounded flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              JSON Betöltés
            </button>
            <button
              type="button"
              onClick={onExportAllJson}
              className="px-2.5 py-1 text-slate-700 hover:bg-slate-200/60 rounded flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              JSON Mentés (Backup)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg"
          >
            Bezárás
          </button>
        </div>

      </div>
    </div>
  );
};
