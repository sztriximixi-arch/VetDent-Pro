import React, { useState, useEffect } from 'react';
import { DentalRecord } from '../types/dental';
import { Mail, Copy, Check, ExternalLink, Download, AlertCircle, X } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DentalRecord;
  onDownloadPdf: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  record,
  onDownloadPdf
}) => {
  const [recipient, setRecipient] = useState(record.ownerEmail || '');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (record) {
      setRecipient(record.ownerEmail || '');
      const petName = record.patientName || 'Kis kedvence';
      const clinicName = record.clinicName || 'Állatorvosi Rendelő';

      const sub = `Fogászati kezelési lap és műtét utáni teendők - ${petName} (${clinicName})`;
      setSubject(sub);

      // Kezelt fogak összeszedése
      const extractions = Object.values(record.teeth)
        .filter(t => t.procedures.some(p => p.startsWith('EXT')))
        .map(t => `${t.id} (${t.nameHu})`);

      const medList = record.dischargePlan.medications
        .map(m => `  • ${m.name}: ${m.dose}, ${m.frequency} (${m.durationDays} napig) - ${m.instructions}`)
        .join('\n');

      const body = `Tisztelt ${record.ownerName || 'Gazdi'}!

Köszönjük, hogy a mai napon ránk bízta ${petName} fogászati ellátását a ${clinicName} praxisában.

A mai konzultáció és beavatkozás során elvégeztük a szájüreg alapos vizsgálatát, a digitális fogképlet rögzítését, valamint a szükséges terápiás ellátást.
${extractions.length > 0 ? `\nExtrahált (eltávolított) fogak:\n  • ${extractions.join('\n  • ')}\n` : '\nA fogak ultrahangos depurálása és finom polírozása megtörtént.\n'}
KÉRJÜK, FORDÍTSON KIEMELT FIGYELMET AZ ALÁBBI MŰTÉT UTÁNI TEENDŐKRE:

1. Gyógyszeres kezelés:
${medList || '  • Nincs otthon szedendő gyógyszer felírva.'}

2. Táplálási javaslat:
  ${record.dischargePlan.dietRecommendations || 'Puha eleség adása javasolt a következő napokban.'}

3. Rágási és fizikai kímélet:
  ${record.dischargePlan.activityAndChewRestrictions || 'Kemény rágócsontok és játékok tilosak a varratok védelmében.'}

4. Kontroll vizsgálat:
  ${record.dischargePlan.recheckDate ? `Időpont: ${record.dischargePlan.recheckDate} - ${record.dischargePlan.recheckReason}` : '10-14 nap múlva javasolt a kontroll.'}

A részletes, hivatalos kezelési lapot és a fogképletet mellékelten csatoltuk PDF formátumban.

Ha ${petName} állapotában bármilyen aggasztó tünetet (láz, erős vérzés, elesettség, nem szűnő fájdalom) észlel, kérjük, haladéktalanul vegye fel velünk a kapcsolatot a ${record.clinicPhone || 'klinikánkon'}!

Mielőbbi jobbulást kívánunk!

Üdvözlettel,
${record.vetName || 'Kezelőorvos'}
${clinicName}
Tel: ${record.clinicPhone}
E-mail: ${record.clinicEmail}`;

      setBodyText(body);
    }
  }, [record, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bodyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenMailto = () => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(bodyText);
    const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Fejléc */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Kezelési Lap Továbbítása a Gazdinak E-mailben
              </h3>
              <p className="text-xs text-slate-500">
                Előre megfogalmazott magyar orvosi levél a műtét utáni teendőkkel
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

        {/* Törzs */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Címzett és Tárgy */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Címzett (Gazdi e-mail címe) *
              </label>
              <input
                type="email"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="gazdi@email.hu"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                E-mail tárgya
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Útmutató a PDF csatoláshoz */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-teal-700 mt-0.5" />
            <div>
              <strong className="block text-teal-950 mb-0.5">Hogyan működik a küldés:</strong>
              <p className="text-[11px] leading-relaxed">
                1. Kattintson a <strong>"PDF Letöltése"</strong> gombra a hivatalos kezelési lap letöltéséhez.<br />
                2. Kattintson a <strong>"Megnyitás az E-mail Kliensben"</strong> gombra, amely megnyitja az Ön alapértelmezett levelezőjét a teljes szöveggel és a gazdi címével kitöltve.<br />
                3. Csatolja a letöltött PDF fájlt és küldje el a gazdinak!
              </p>
            </div>
          </div>

          {/* Üzenet szövegtörzs szerkesztő */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">
                E-mail szövege (Testreszabható)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 text-[11px]"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied ? 'Másolva!' : 'Szöveg másolása'}
              </button>
            </div>
            <textarea
              rows={9}
              value={bodyText}
              onChange={e => setBodyText(e.target.value)}
              className="w-full p-3 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
            />
          </div>

        </div>

        {/* Lábléc gombok */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-600" />
            PDF Letöltése
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Mégse
            </button>
            <button
              type="button"
              onClick={handleOpenMailto}
              className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Megnyitás az E-mail Kliensben
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
