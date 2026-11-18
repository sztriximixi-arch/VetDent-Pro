/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DentalRecord, ToothRecord, Species, PathologyCode, ProcedureCode } from './types/dental';
import { getSampleDogRecord, getSampleCatRecord, createBlankRecord } from './data/sampleCases';
import { getAllTeethMetadata, getSpeciesTeethIds } from './data/triadanConfig';
import { exportReportToPdf } from './utils/pdfGenerator';

import { HeaderBar } from './components/HeaderBar';
import { PatientHeader } from './components/PatientHeader';
import { Odontogram } from './components/Odontogram';
import { ToothDetailPanel } from './components/ToothDetailPanel';
import { QuickActionsToolbar } from './components/QuickActionsToolbar';
import { AnesthesiaSurgeryTab } from './components/AnesthesiaSurgeryTab';
import { DischargePlanTab } from './components/DischargePlanTab';
import { PrintableView } from './components/PrintableView';
import { EmailModal } from './components/EmailModal';
import { RecordsModal } from './components/RecordsModal';

const STORAGE_KEY = 'vetdent_dental_records_v1';

export default function App() {
  // Aktív kórlap
  const [record, setRecord] = useState<DentalRecord>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      }
    } catch (e) {
      console.warn('Nem sikerült betölteni a korábbi lapot:', e);
    }
    return getSampleDogRecord();
  });

  // Elmentett lapok listája
  const [savedRecords, setSavedRecords] = useState<DentalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage olvasási hiba:', e);
    }
    return [getSampleDogRecord(), getSampleCatRecord()];
  });

  // Navigációs fül
  const [activeTab, setActiveTab] = useState<'odontogram' | 'surgery' | 'discharge' | 'preview'>('odontogram');

  // Kiválasztott fogak
  const [activeToothId, setActiveToothId] = useState<number | null>(108); // Alapból a tépőfog kiválasztva
  const [selectedToothIds, setSelectedToothIds] = useState<number[]>([]);

  // Modális ablakok
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Auto-save helyi tárolóba periodikusan vagy változáskor
  useEffect(() => {
    try {
      const existing = [...savedRecords];
      const index = existing.findIndex(r => r.id === record.id);
      if (index >= 0) {
        existing[index] = record;
      } else {
        existing.unshift(record);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSavedRecords(existing);
    } catch (e) {
      console.error('Mentési hiba:', e);
    }
  }, [record]);

  // Mentés gomb kattintásra
  const handleSave = () => {
    try {
      const existing = [...savedRecords];
      const index = existing.findIndex(r => r.id === record.id);
      const updatedRecord = { ...record, updatedAt: new Date().toISOString() };
      if (index >= 0) {
        existing[index] = updatedRecord;
      } else {
        existing.unshift(updatedRecord);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSavedRecords(existing);
      setRecord(updatedRecord);

      setSaveNotice('Kezelési lap mentve!');
      setTimeout(() => setSaveNotice(null), 3000);
    } catch (e) {
      alert('Hiba a mentés során.');
    }
  };

  // Faj váltás (Kutya <-> Macska)
  const handleSpeciesChange = (newSpecies: Species) => {
    if (newSpecies === record.species) return;

    const confirmSwitch = window.confirm(
      `Biztosan átvált ${newSpecies === 'dog' ? 'Kutyára' : 'Macskára'}? Az odontogram fogképlete átáll a kiválasztott faj anatómiai fogazatára.`
    );
    if (!confirmSwitch) return;

    const blank = createBlankRecord(newSpecies);
    setRecord(prev => ({
      ...prev,
      species: newSpecies,
      teeth: blank.teeth
    }));
    setActiveToothId(newSpecies === 'dog' ? 108 : 307);
    setSelectedToothIds([]);
  };

  // Páciens adatok frissítése
  const handleRecordUpdate = (patch: Partial<DentalRecord>) => {
    setRecord(prev => ({ ...prev, ...patch }));
  };

  // Egyedi fog frissítése
  const handleUpdateTooth = (patch: Partial<ToothRecord>) => {
    if (!activeToothId) return;
    setRecord(prev => {
      const currentTooth = prev.teeth[activeToothId];
      if (!currentTooth) return prev;
      return {
        ...prev,
        teeth: {
          ...prev.teeth,
          [activeToothId]: { ...currentTooth, ...patch }
        }
      };
    });
  };

  // Egyedi fog kiválasztása
  const handleSelectTooth = (id: number) => {
    setActiveToothId(id);
    setSelectedToothIds([id]);
  };

  // Multi-select toggle (Shift / Ctrl kattintás)
  const handleToggleMultiSelect = (id: number, e: React.MouseEvent) => {
    setSelectedToothIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
    setActiveToothId(id);
  };

  // Kijelölési segédfüggvények
  const allToothIds = Object.keys(record.teeth).map(Number);

  const handleSelectAll = () => {
    setSelectedToothIds(allToothIds);
  };

  const handleSelectUpper = () => {
    const uppers = allToothIds.filter(id => id < 300);
    setSelectedToothIds(uppers);
    if (uppers.length > 0) setActiveToothId(uppers[0]);
  };

  const handleSelectLower = () => {
    const lowers = allToothIds.filter(id => id >= 300);
    setSelectedToothIds(lowers);
    if (lowers.length > 0) setActiveToothId(lowers[0]);
  };

  const handleSelectPathological = () => {
    const paths = allToothIds.filter(id => {
      const t = record.teeth[id];
      return t && t.pathologies.some(p => p !== '0');
    });
    setSelectedToothIds(paths);
    if (paths.length > 0) setActiveToothId(paths[0]);
  };

  const handleClearSelection = () => {
    setSelectedToothIds([]);
  };

  // Gyorsműveletek alkalmazása a kijelöltekre (vagy aktív fogra)
  const getTargetIds = (): number[] => {
    if (selectedToothIds.length > 0) return selectedToothIds;
    if (activeToothId) return [activeToothId];
    return [];
  };

  const handleApplyPathologyToSelection = (code: PathologyCode) => {
    const targets = getTargetIds();
    if (targets.length === 0) return;

    setRecord(prev => {
      const nextTeeth = { ...prev.teeth };
      targets.forEach(id => {
        const tooth = nextTeeth[id];
        if (!tooth) return;

        let nextPaths: PathologyCode[];
        if (code === '0') {
          nextPaths = ['0'];
        } else {
          const withoutZero = tooth.pathologies.filter(p => p !== '0');
          if (withoutZero.includes(code)) {
            nextPaths = withoutZero.filter(p => p !== code);
            if (nextPaths.length === 0) nextPaths = ['0'];
          } else {
            nextPaths = [...withoutZero, code];
          }
        }

        nextTeeth[id] = { ...tooth, pathologies: nextPaths };
      });
      return { ...prev, teeth: nextTeeth };
    });
  };

  const handleApplyProcedureToSelection = (proc: ProcedureCode) => {
    const targets = getTargetIds();
    if (targets.length === 0) return;

    setRecord(prev => {
      const nextTeeth = { ...prev.teeth };
      targets.forEach(id => {
        const tooth = nextTeeth[id];
        if (!tooth) return;

        let nextProcs: ProcedureCode[];
        if (tooth.procedures.includes(proc)) {
          nextProcs = tooth.procedures.filter(p => p !== proc);
        } else {
          nextProcs = [...tooth.procedures, proc];
        }

        nextTeeth[id] = { ...tooth, procedures: nextProcs };
      });
      return { ...prev, teeth: nextTeeth };
    });
  };

  const handleApplyCleanAndPolishAll = () => {
    setRecord(prev => {
      const nextTeeth = { ...prev.teeth };
      Object.keys(nextTeeth).forEach(idStr => {
        const id = Number(idStr);
        const tooth = nextTeeth[id];
        if (!tooth) return;

        // Ha nem hiányzó, hozzátesszük az U és POL eljárást ha még nincs rajta
        if (!tooth.pathologies.includes('M')) {
          const procs = new Set(tooth.procedures);
          procs.add('U');
          procs.add('POL');
          nextTeeth[id] = { ...tooth, procedures: Array.from(procs) as ProcedureCode[] };
        }
      });
      return { ...prev, teeth: nextTeeth };
    });

    setSaveNotice('Minden megmaradt fog depurálva és polírozva!');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleResetSelectionToHealthy = () => {
    const targets = getTargetIds();
    if (targets.length === 0) return;

    setRecord(prev => {
      const nextTeeth = { ...prev.teeth };
      targets.forEach(id => {
        const tooth = nextTeeth[id];
        if (!tooth) return;
        nextTeeth[id] = {
          ...tooth,
          pathologies: ['0'],
          probingDepths: {}
        };
      });
      return { ...prev, teeth: nextTeeth };
    });
  };

  const handleApplyPocketDepthToSelection = (depth: number) => {
    const targets = getTargetIds();
    if (targets.length === 0) return;

    setRecord(prev => {
      const nextTeeth = { ...prev.teeth };
      targets.forEach(id => {
        const tooth = nextTeeth[id];
        if (!tooth) return;
        nextTeeth[id] = {
          ...tooth,
          probingDepths: {
            mesial: depth,
            buccal: depth,
            distal: depth,
            palatalOrLingual: depth
          }
        };
      });
      return { ...prev, teeth: nextTeeth };
    });
  };

  // Előző / Következő fog lépkedés
  const handlePrevTooth = () => {
    if (!activeToothId) return;
    const currentIndex = allToothIds.indexOf(activeToothId);
    if (currentIndex > 0) {
      const prevId = allToothIds[currentIndex - 1];
      setActiveToothId(prevId);
      setSelectedToothIds([prevId]);
    }
  };

  const handleNextTooth = () => {
    if (!activeToothId) return;
    const currentIndex = allToothIds.indexOf(activeToothId);
    if (currentIndex >= 0 && currentIndex < allToothIds.length - 1) {
      const nextId = allToothIds[currentIndex + 1];
      setActiveToothId(nextId);
      setSelectedToothIds([nextId]);
    }
  };

  // PDF Export
  const handleExportPdf = async () => {
    setIsPdfGenerating(true);
    const fileName = `VetDent_Kezelesi_Lap_${record.patientName || 'Paciens'}_${record.visitDate}`;
    try {
      await exportReportToPdf('dental-printable-report', fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Új üres lap
  const handleNewRecord = (species: Species = 'dog') => {
    const newRec = createBlankRecord(species);
    setRecord(newRec);
    setActiveToothId(species === 'dog' ? 108 : 307);
    setSelectedToothIds([]);
    setSaveNotice('Új kezelési lap inicializálva!');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Minta betöltése
  const handleLoadSample = (type: 'dog' | 'cat') => {
    const sample = type === 'dog' ? getSampleDogRecord() : getSampleCatRecord();
    setRecord(sample);
    setActiveToothId(type === 'dog' ? 108 : 307);
    setSelectedToothIds([]);
    setSaveNotice(`${type === 'dog' ? 'Max (kutya)' : 'Mici (macska)'} minta betöltve!`);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  // Kezelési lapok kezelése (Modal)
  const handleDeleteRecord = (id: string) => {
    const filtered = savedRecords.filter(r => r.id !== id);
    setSavedRecords(filtered);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (record.id === id) {
      if (filtered.length > 0) {
        setRecord(filtered[0]);
      } else {
        setRecord(createBlankRecord('dog'));
      }
    }
  };

  const handleExportAllJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vetdent_osszes_lap_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (imported: DentalRecord[]) => {
    const merged = [...imported, ...savedRecords.filter(r => !imported.some(imp => imp.id === r.id))];
    setSavedRecords(merged);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    if (imported.length > 0) {
      setRecord(imported[0]);
    }
    alert(`${imported.length} kezelési lap sikeresen importálva!`);
  };

  const activeTooth = activeToothId ? record.teeth[activeToothId] || null : null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* 1. TOP BAR */}
      <HeaderBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        onOpenRecords={() => setIsRecordsModalOpen(true)}
        onExportPdf={handleExportPdf}
        onOpenEmail={() => setIsEmailModalOpen(true)}
        onLoadSample={handleLoadSample}
        onNewRecord={() => handleNewRecord('dog')}
        isPdfGenerating={isPdfGenerating}
        saveStatusNotice={saveNotice}
      />

      {/* 2. FŐ TARTALOM TERÜLET */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* Páciens és vizit fejléc minden szerkesztési nézetben látható */}
        {activeTab !== 'preview' && (
          <PatientHeader
            record={record}
            onChange={handleRecordUpdate}
            onSpeciesChange={handleSpeciesChange}
          />
        )}

        {/* 1. FÜL: ODONTOGRAM & FOGVIZSGÁLAT */}
        {activeTab === 'odontogram' && (
          <div className="space-y-5">
            {/* Központi Triadan Odontogram */}
            <Odontogram
              record={record}
              activeToothId={activeToothId}
              onSelectTooth={handleSelectTooth}
              selectedToothIds={selectedToothIds}
              onToggleMultiSelect={handleToggleMultiSelect}
              onSelectAll={handleSelectAll}
              onSelectUpper={handleSelectUpper}
              onSelectLower={handleSelectLower}
              onSelectPathological={handleSelectPathological}
              onClearSelection={handleClearSelection}
              onUpdateRecord={handleRecordUpdate}
            />

            {/* Drótváz szerinti alsó 2 hasáb: 3. Részletező & Tasakok | 4. Gyorsbeviteli Eszköztár */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* Bal hasáb: Részletező & Tasakok */}
              <ToothDetailPanel
                tooth={activeTooth}
                onUpdateTooth={handleUpdateTooth}
                onPrevTooth={handlePrevTooth}
                onNextTooth={handleNextTooth}
              />

              {/* Jobb hasáb: Gyorsbeviteli Eszköztár */}
              <QuickActionsToolbar
                selectedToothIds={selectedToothIds}
                activeToothId={activeToothId}
                onApplyPathologyToSelection={handleApplyPathologyToSelection}
                onApplyProcedureToSelection={handleApplyProcedureToSelection}
                onApplyCleanAndPolishAll={handleApplyCleanAndPolishAll}
                onResetSelectionToHealthy={handleResetSelectionToHealthy}
                onApplyPocketDepthToSelection={handleApplyPocketDepthToSelection}
              />
            </div>
          </div>
        )}

        {/* 2. FÜL: ANESZTÉZIA & MŰTÉT */}
        {activeTab === 'surgery' && (
          <AnesthesiaSurgeryTab
            surgicalLog={record.surgicalLog}
            onChange={updated => handleRecordUpdate({
              surgicalLog: { ...record.surgicalLog, ...updated }
            })}
          />
        )}

        {/* 3. FÜL: HAZADOBÓ LAP & GYÓGYSZEREK */}
        {activeTab === 'discharge' && (
          <DischargePlanTab
            plan={record.dischargePlan}
            onChange={updated => handleRecordUpdate({
              dischargePlan: { ...record.dischargePlan, ...updated }
            })}
            species={record.species}
            patientName={record.patientName}
          />
        )}

        {/* 4. FÜL: NYOMTATÁSI ÉS PDF ELŐNÉZET */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Nyomtatási & PDF Előnézet (A4 Formátum)
                </h3>
                <p className="text-xs text-slate-500">
                  Ez a hivatalos állatorvosi kezelési lap és gazdi tájékoztató fog generálódni PDF formátumban.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
                >
                  Közvetlen Nyomtatás
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isPdfGenerating}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-50"
                >
                  {isPdfGenerating ? 'PDF Készítése...' : 'PDF Letöltése'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-xs"
                >
                  E-mail Küldése a Gazdinak
                </button>
              </div>
            </div>

            <div className="bg-slate-200/60 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto">
              <PrintableView record={record} />
            </div>
          </div>
        )}

      </main>

      {/* OFFSCREEN PRINTABLE VIEW: PDF generáláshoz elérhető marad a DOM-ban még más fülön is */}
      {activeTab !== 'preview' && (
        <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '900px', pointerEvents: 'none', opacity: 0 }}>
          <PrintableView record={record} />
        </div>
      )}

      {/* 3. MODÁLIS ABLAKOK */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        record={record}
        onDownloadPdf={handleExportPdf}
      />

      <RecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        records={savedRecords}
        activeRecordId={record.id}
        onLoadRecord={rec => {
          setRecord(rec);
          setActiveToothId(rec.species === 'dog' ? 108 : 307);
          setSelectedToothIds([]);
        }}
        onDeleteRecord={handleDeleteRecord}
        onNewRecord={handleNewRecord}
        onLoadSample={handleLoadSample}
        onExportAllJson={handleExportAllJson}
        onImportJson={handleImportJson}
      />

    </div>
  );
}
