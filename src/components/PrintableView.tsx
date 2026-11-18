import React from 'react';
import { DentalRecord, ANIMAL_SEX_LABELS } from '../types/dental';
import { PATHOLOGY_DESCRIPTIONS, PROCEDURE_DESCRIPTIONS } from '../data/triadanConfig';
import { VeterinaryDentalChart } from './VeterinaryDentalChart';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

interface PrintableViewProps {
  record: DentalRecord;
}

export const PrintableView: React.FC<PrintableViewProps> = ({ record }) => {
  const isDog = record.species === 'dog';

  // Összegyűjtjük az érintett / kezelt fogakat a részletes táblázathoz
  const treatedOrPathologicTeeth = Object.values(record.teeth).filter(t => {
    const hasPathology = t.pathologies.some(p => p !== '0');
    const hasProcedure = t.procedures.length > 0;
    const hasDepths = Object.values(t.probingDepths).some(d => (d || 0) > 0);
    const hasNotes = !!t.notes;
    return hasPathology || hasProcedure || hasDepths || hasNotes;
  });

  return (
    <div 
      id="dental-printable-report"
      className="bg-white text-slate-900 p-8 max-w-4xl mx-auto border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0"
      style={{ minHeight: '297mm' }}
    >
      {/* 1. FEJLÉC: Klinika adatok és Cím */}
      <div className="border-b-2 border-teal-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded bg-teal-800 text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-teal-950 uppercase tracking-tight">
                {record.clinicName}
              </h1>
            </div>
            <p className="text-xs text-slate-600">
              {record.clinicAddress} · Tel: {record.clinicPhone} · E-mail: {record.clinicEmail}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-teal-50 border border-teal-200 text-teal-900 font-bold text-xs rounded uppercase tracking-wider">
              Állatorvosi Fogászati Lap
            </span>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Dátum: {record.visitDate}
            </p>
          </div>
        </div>
      </div>

      {/* 2. PÁCIENS ÉS VIZIT ÖSSZEFOGLALÓ KÁRTYA */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-6">
        <div className="space-y-1">
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">Páciens neve:</span>
            <strong className="text-slate-900 text-sm">{record.patientName || '—'}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">Faj / Fajta:</span>
            <span>{record.species === 'dog' ? 'Kutya' : 'Macska'} / {record.breed || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">Kor / Súly:</span>
            <span>{record.ageYears} év {record.ageMonths > 0 ? `${record.ageMonths} hó` : ''} · <strong>{record.weightKg} kg</strong></span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Állat neme:</span>
            <span className="capitalize">{ANIMAL_SEX_LABELS[record.sex || 'ismeretlen']}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">Gazdi neve:</span>
            <strong className="text-slate-900">{record.ownerName || '—'}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">E-mail:</span>
            <span>{record.ownerEmail || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1">
            <span className="text-slate-500">Kezelőorvos:</span>
            <span>{record.vetName || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ASA Altatási Státusz:</span>
            <span className="font-bold text-teal-800">ASA {record.asaStatus}</span>
          </div>
        </div>
      </div>

      {/* 3. ANAMNÉZIS & FŐ PANASZOK */}
      {record.mainComplaint && record.mainComplaint.length > 0 && (
        <div className="mb-6 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 border-b border-slate-200 pb-0.5">
            Előzmények & Fő Panaszok
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-1">
            {record.mainComplaint.map((c, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded font-medium">
                {c}
              </span>
            ))}
          </div>
          {record.mainComplaintOther && (
            <p className="text-slate-600 italic mt-1">
              Részletek: {record.mainComplaintOther}
            </p>
          )}
        </div>
      )}

      {/* 4. GRAFIKUS TRIADAN ODONTOGRAM ÁTTEKINTÉS */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5 border-b border-slate-200 pb-0.5">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Fogászati Kezelési Táblázat (Módosított Triadan Rendszer)
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            {isDog ? 'Kutya fogazat (42 fog)' : 'Macska fogazat (30 fog)'}
          </span>
        </div>

        <VeterinaryDentalChart
          record={record}
          readOnly={true}
          compact={true}
        />
      </div>

      {/* 5. ÉRINTETT ÉS KEZELT FOGAK RÉSZLETES TÁBLÁZATA */}
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 border-b border-slate-200 pb-0.5">
          Érintett & Kezelt Fogak Részletezése
        </h3>

        {treatedOrPathologicTeeth.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded">
            Minden fog ép és egészséges állapotban van rögzítve.
          </p>
        ) : (
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
              <tr>
                <th className="p-2 border-b border-r border-slate-200 w-16">Fog #</th>
                <th className="p-2 border-b border-r border-slate-200 w-44">Megnevezés</th>
                <th className="p-2 border-b border-r border-slate-200">Patológia / Állapot</th>
                <th className="p-2 border-b border-r border-slate-200">Tasak (mm)</th>
                <th className="p-2 border-b border-r border-slate-200">Beavatkozás</th>
                <th className="p-2 border-b border-slate-200">Megjegyzés</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {treatedOrPathologicTeeth.map(t => {
                const depths = [
                  t.probingDepths.mesial ? `M:${t.probingDepths.mesial}` : null,
                  t.probingDepths.buccal ? `B:${t.probingDepths.buccal}` : null,
                  t.probingDepths.distal ? `D:${t.probingDepths.distal}` : null,
                  t.probingDepths.palatalOrLingual ? `L/P:${t.probingDepths.palatalOrLingual}` : null,
                ].filter(Boolean).join(' ');

                return (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">
                      {t.id}
                    </td>
                    <td className="p-2 font-medium text-slate-800 border-r border-slate-200">
                      {t.nameHu} ({t.shortName})
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {t.pathologies.map(p => (
                          <span key={p} className="font-mono font-bold text-[10px] px-1 bg-slate-100 rounded text-slate-800">
                            {p}: {PATHOLOGY_DESCRIPTIONS[p]?.label || p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 font-mono text-[11px] border-r border-slate-200">
                      {depths || '—'}
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {t.procedures.map(p => (
                          <span 
                            key={p} 
                            className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                              p.startsWith('EXT') ? 'bg-rose-100 text-rose-800' : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {PROCEDURE_DESCRIPTIONS[p]?.label || p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2 text-slate-600 italic text-[11px]">
                      {t.notes || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 6. MŰTÉTI ÉS ANESZTÉZIAI NAPLÓ */}
      <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
          Műtéti & Érzéstelenítési Napló
        </h3>

        {record.surgicalLog.localBlocks.length > 0 && (
          <div>
            <strong className="text-slate-700">Alkalmazott helyi idegblokkok: </strong>
            <span className="text-slate-800">
              {record.surgicalLog.localBlocks.map(b => `${b.nerve} (${b.side} oldal, ${b.drug}, ${b.volumeMl} ml)`).join('; ')}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong className="text-slate-700">Varratok: </strong>
            <span>{record.surgicalLog.sutureType || 'Nem volt varrat'} ({record.surgicalLog.suturePattern})</span>
          </div>
          <div>
            <strong className="text-slate-700">Dentális Röntgen: </strong>
            <span>{record.surgicalLog.xrayCount} felvétel készült</span>
          </div>
        </div>

        {record.surgicalLog.xrayFindings && (
          <div>
            <strong className="text-slate-700">Röntgen lelet: </strong>
            <span className="text-slate-800">{record.surgicalLog.xrayFindings}</span>
          </div>
        )}

        {record.surgicalLog.complications && (
          <div>
            <strong className="text-slate-700">Észrevételek / Szövődmények: </strong>
            <span className="text-slate-800">{record.surgicalLog.complications}</span>
          </div>
        )}
      </div>

      {/* 7. HAZABOCSÁTÁSI LAP & GAZDITÁJÉKOZTATÓ (Kiemelt szekció a gazdinak) */}
      <div className="border-2 border-teal-800 rounded-lg p-4 bg-teal-50/20 text-xs mb-6">
        <div className="flex items-center gap-2 mb-3 border-b border-teal-200 pb-2">
          <CheckCircle2 className="w-5 h-5 text-teal-800" />
          <h2 className="text-sm font-bold text-teal-950 uppercase tracking-wider">
            Otthoni Utókezelési Terv & Gazdi Tájékoztató
          </h2>
        </div>

        {/* Gyógyszer adagolási táblázat */}
        {record.dischargePlan.medications.length > 0 && (
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 mb-1.5">
              1. Felírt Gyógyszerek és Adagolás:
            </h4>
            <table className="w-full text-left border border-slate-200 bg-white rounded overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 text-[10px]">
                <tr>
                  <th className="p-1.5 border-b border-r border-slate-200">Gyógyszer neve</th>
                  <th className="p-1.5 border-b border-r border-slate-200">Egyszeri adag</th>
                  <th className="p-1.5 border-b border-r border-slate-200">Gyakoriság</th>
                  <th className="p-1.5 border-b border-r border-slate-200">Időtartam</th>
                  <th className="p-1.5 border-b border-slate-200">Használati útmutató</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {record.dischargePlan.medications.map((m, idx) => (
                  <tr key={idx}>
                    <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{m.name}</td>
                    <td className="p-1.5 font-mono border-r border-slate-200">{m.dose}</td>
                    <td className="p-1.5 border-r border-slate-200">{m.frequency}</td>
                    <td className="p-1.5 font-bold border-r border-slate-200">{m.durationDays} napig</td>
                    <td className="p-1.5 text-slate-700 italic">{m.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Táplálás & Tilalmak */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <strong className="block text-slate-900 mb-1">Táplálási javaslat:</strong>
            <p className="text-slate-700">{record.dischargePlan.dietRecommendations}</p>
          </div>
          <div className="bg-white p-2.5 rounded border border-slate-200">
            <strong className="block text-slate-900 mb-1">Rágási és fizikai kímélet:</strong>
            <p className="text-slate-700">{record.dischargePlan.activityAndChewRestrictions}</p>
          </div>
        </div>

        {/* Kontroll vizsgálat */}
        <div className="flex justify-between items-center p-2.5 bg-white rounded border border-slate-200">
          <div>
            <strong className="text-slate-900">Javasolt kontroll vizsgálat: </strong>
            <span className="font-mono font-bold text-teal-900 text-sm">{record.dischargePlan.recheckDate || '10-14 nap múlva'}</span>
          </div>
          <div className="text-slate-600">
            Célja: {record.dischargePlan.recheckReason}
          </div>
        </div>
      </div>

      {/* 8. ALÁÍRÁS ÉS ZÁRÁS */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
        <div>
          <p>Kelt: {record.visitDate}, {record.clinicAddress?.split(',')[0] || 'Budapest'}</p>
          <p className="text-[10px] text-slate-400 mt-1">VetDent Pro digitális orvosi rendszerből generálva.</p>
        </div>

        <div className="text-center w-56">
          <div className="border-b border-slate-400 mb-1 h-10 flex items-end justify-center pb-1 font-serif italic text-slate-800">
            {record.vetName}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Kezelőorvos aláírása és bélyegzője
          </span>
        </div>
      </div>

    </div>
  );
};
