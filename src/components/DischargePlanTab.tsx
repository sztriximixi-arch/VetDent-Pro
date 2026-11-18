import React from 'react';
import { DischargePlan, MedicationItem } from '../types/dental';
import { Plus, Trash2, Calendar, Pill, Sparkles, AlertCircle } from 'lucide-react';

interface DischargePlanTabProps {
  plan: DischargePlan;
  onChange: (updated: Partial<DischargePlan>) => void;
  species: 'dog' | 'cat';
  patientName: string;
}

export const DischargePlanTab: React.FC<DischargePlanTabProps> = ({
  plan,
  onChange,
  species,
  patientName
}) => {
  const addMedication = () => {
    const newMed: MedicationItem = {
      id: `med-${Date.now()}`,
      name: species === 'dog' ? 'Meloxidyl 1,5 mg/ml szuszpenzió' : 'Onsior 6 mg tabletta',
      dose: species === 'dog' ? 'Testtömegnek megfelelően' : '1 tabletta',
      frequency: 'Naponta 1x',
      durationDays: 4,
      instructions: 'Mindig etetéskor vagy teli gyomorra adandó!'
    };
    onChange({ medications: [...plan.medications, newMed] });
  };

  const removeMedication = (id: string) => {
    onChange({ medications: plan.medications.filter(m => m.id !== id) });
  };

  const updateMedication = (id: string, patch: Partial<MedicationItem>) => {
    onChange({
      medications: plan.medications.map(m => m.id === id ? { ...m, ...patch } : m)
    });
  };

  // Gyors sablon hozzáadások
  const addTemplateMed = (type: 'nsaid' | 'antibiotic' | 'oralgel') => {
    let med: MedicationItem;
    if (type === 'nsaid') {
      med = species === 'dog' ? {
        id: `med-${Date.now()}`,
        name: 'Meloxidyl 1,5 mg/ml orális szuszpenzió',
        dose: 'A testsúly kilogramm jelzésig',
        frequency: 'Naponta 1x reggel eleséggel',
        durationDays: 5,
        instructions: 'Gyulladáscsökkentő és fájdalomcsillapító. Mindig etetés közben vagy közvetlenül utána adandó.'
      } : {
        id: `med-${Date.now()}`,
        name: 'Onsior 6 mg tabletta macskáknak (Robenacoxib)',
        dose: '1 tabletta',
        frequency: 'Naponta 1x étkezéskor',
        durationDays: 3,
        instructions: 'Gyors fájdalomcsillapító, kíméletes a gyomorhoz.'
      };
    } else if (type === 'antibiotic') {
      med = {
        id: `med-${Date.now()}`,
        name: species === 'dog' ? 'Kesium 250/500 mg tabletta' : 'Clavaseptin 50 mg tabletta',
        dose: '1 tabletta',
        frequency: 'Naponta 2x (12 óránként)',
        durationDays: 7,
        instructions: 'Széles spektrumú antibiotikum. A kúra teljes ideig végigadandó!'
      };
    } else {
      med = {
        id: `med-${Date.now()}`,
        name: 'Stomodine szájápoló gél (Klórhexidin + O megolaj)',
        dose: 'Borsónyi mennyiség',
        frequency: 'Naponta 2x este',
        durationDays: 10,
        instructions: 'Gyengéden az íny felületére juttatni az ujjbeggyel a seb közvetlen dörzsölése nélkül.'
      };
    }
    onChange({ medications: [...plan.medications, med] });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SZEKCIÓ: Gyógyszeres terápia a gazdinak */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-600" />
              Otthoni Gyógyszeres Kezelési Terv
            </h3>
            <p className="text-xs text-slate-500">
              Ezek az adagolási utasítások fognak pontosan és áttekinthetően szerepelni a gazdinak átadott tájékoztatón és e-mailben.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-medium mr-1">Gyors sablonok:</span>
            <button
              type="button"
              onClick={() => addTemplateMed('nsaid')}
              className="px-2 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200"
            >
              + Fájdalomcsillapító
            </button>
            <button
              type="button"
              onClick={() => addTemplateMed('antibiotic')}
              className="px-2 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200"
            >
              + Antibiotikum
            </button>
            <button
              type="button"
              onClick={() => addTemplateMed('oralgel')}
              className="px-2 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-200"
            >
              + Szájápoló gél
            </button>
            <button
              type="button"
              onClick={addMedication}
              className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded transition-colors flex items-center gap-1 shadow-xs ml-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Új gyógyszer
            </button>
          </div>
        </div>

        {plan.medications.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs text-slate-500">
            Nincs felírt otthoni gyógyszer. Kattintson a gyors sablonokra vagy az Új gyógyszer gombra!
          </div>
        ) : (
          <div className="space-y-3">
            {plan.medications.map((med, idx) => (
              <div key={med.id || idx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Készítmény neve & hatáserősség
                    </label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={e => updateMedication(med.id, { name: e.target.value })}
                      placeholder="Pl. Meloxidyl 1,5 mg/ml orális szuszpenzió"
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-semibold text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Egyszeri adag
                    </label>
                    <input
                      type="text"
                      value={med.dose}
                      onChange={e => updateMedication(med.id, { dose: e.target.value })}
                      placeholder="Pl. 1 tabletta / fecskendő jelzésig"
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Gyakoriság
                    </label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={e => updateMedication(med.id, { frequency: e.target.value })}
                      placeholder="Pl. Naponta 1x"
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Időtartam
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={med.durationDays}
                        onChange={e => updateMedication(med.id, { durationDays: parseInt(e.target.value) || 1 })}
                        className="w-full px-1.5 py-1 text-xs bg-white border border-slate-300 rounded text-center font-bold"
                      />
                      <span className="text-[10px] text-slate-500">nap</span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeMedication(med.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                      title="Gyógyszer törlése"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Gazdinak szóló részletes alkalmazási útmutató
                  </label>
                  <input
                    type="text"
                    value={med.instructions}
                    onChange={e => updateMedication(med.id, { instructions: e.target.value })}
                    placeholder="Pl. Mindig teli gyomorra adandó. Hányás vagy hasmenés esetén a készítmény adását fel kell függeszteni!"
                    className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. SZEKCIÓ: Táplálás & Tevékenység korlátozások */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">
          Műtét Utáni Ápolás & Gazdi Tanácsok
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Táplálási javaslat a műtét utáni napokra *
            </label>
            <textarea
              rows={3}
              value={plan.dietRecommendations}
              onChange={e => onChange({ dietRecommendations: e.target.value })}
              placeholder="Pl. Kizárólag puha eleség (konzerv, feláztatott száraz táp) adható 7-10 napig szobahőmérsékleten..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rágási korlátozások & Fizikai kímélet *
            </label>
            <textarea
              rows={3}
              value={plan.activityAndChewRestrictions}
              onChange={e => onChange({ activityAndChewRestrictions: e.target.value })}
              placeholder="Pl. Kemény rágócsontok, fadarabok, frizbi, labda és húzós játékok szigorúan tilosak legalább 14 napig a varratok védelmében..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Otthoni szájhigiénia a gyógyulás alatt
            </label>
            <input
              type="text"
              value={plan.oralHygienePostOp}
              onChange={e => onChange({ oralHygienePostOp: e.target.value })}
              placeholder="Pl. A seb környékét fogkefével tilos dörzsölni, fertőtlenítő gél használata elegendő."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kezelőorvos záró megjegyzése a gazdinak
            </label>
            <input
              type="text"
              value={plan.doctorNotes}
              onChange={e => onChange({ doctorNotes: e.target.value })}
              placeholder="Pl. A beavatkozás sikeresen lezajlott. Kérdés esetén keressenek minket bizalommal!"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 3. SZEKCIÓ: Kontroll időpont & Varratszedés */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          Kontroll Időpont & Varratszedés
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Javasolt kontroll dátuma
            </label>
            <input
              type="date"
              value={plan.recheckDate}
              onChange={e => onChange({ recheckDate: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold text-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kontroll célja / teendő
            </label>
            <input
              type="text"
              value={plan.recheckReason}
              onChange={e => onChange({ recheckReason: e.target.value })}
              placeholder="Pl. Sebgyógyulás ellenőrzése, varratok állapotának kontrollja (10-14 nap múlva)."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
