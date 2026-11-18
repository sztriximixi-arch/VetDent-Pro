import React, { useState } from 'react';
import { DentalRecord, Species, AsaStatus, BloodworkResult, AnimalSex, ANIMAL_SEX_LABELS } from '../types/dental';
import { ChevronDown, ChevronUp, User, HeartPulse, Clock, Sparkles } from 'lucide-react';

interface PatientHeaderProps {
  record: DentalRecord;
  onChange: (updated: Partial<DentalRecord>) => void;
  onSpeciesChange: (species: Species) => void;
}

const COMMON_COMPLAINTS = [
  'Bűzös lehelet (halitosis)',
  'Fogkő',
  'Fájdalom jelzése rágáskor',
  'Fokozott nyálzás',
  'Táplálási nehézség / féloldalas rágás',
  'Letört fog',
  'Ínyvérzés',
  'Pofa dörzsölése'
];

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  record,
  onChange,
  onSpeciesChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleComplaint = (complaint: string) => {
    const current = record.mainComplaint || [];
    if (current.includes(complaint)) {
      onChange({ mainComplaint: current.filter(c => c !== complaint) });
    } else {
      onChange({ mainComplaint: [...current, complaint] });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-5">
      {/* Címsor összefoglaló sáv */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between cursor-pointer border-b border-slate-200 select-none hover:bg-slate-50 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">
              {record.patientName || 'Névtelen Páciens'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
              record.species === 'dog' 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-purple-50 text-purple-800 border-purple-200'
            }`}>
              {record.species === 'dog' ? 'Kutya' : 'Macska'}
            </span>
          </div>

          <div className="text-slate-500 text-xs flex items-center gap-2">
            <span>Fajta: <strong className="text-slate-700">{record.breed || 'Nem megadott'}</strong></span>
            <span>·</span>
            <span>Kor: <strong className="text-slate-700">{record.ageYears} év {record.ageMonths > 0 ? `${record.ageMonths} hó` : ''}</strong></span>
            <span>·</span>
            <span>Nem: <strong className="text-slate-700">{ANIMAL_SEX_LABELS[record.sex || 'ismeretlen']}</strong></span>
            <span>·</span>
            <span>Súly: <strong className="text-slate-700">{record.weightKg} kg</strong></span>
            <span>·</span>
            <span>Gazdi: <strong className="text-slate-700">{record.ownerName || '—'}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] border ${
              record.asaStatus === 'I' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              record.asaStatus === 'II' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              record.asaStatus === 'III' ? 'bg-amber-50 text-amber-800 border-amber-200' :
              'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              ASA: {record.asaStatus}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">Dátum: <span className="font-mono">{record.visitDate}</span></span>
          </div>
        </div>

        <button 
          type="button" 
          className="text-slate-500 hover:text-slate-700 p-1 rounded-md"
          title={isExpanded ? 'Összecsukás' : 'Lenyitás'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Részletes űrlap panel */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* 1. Sor: Páciens és Gazdi adatok */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Páciens neve *
              </label>
              <input
                type="text"
                value={record.patientName}
                onChange={e => onChange({ patientName: e.target.value })}
                placeholder="Pl. Max, Buksi, Mici"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faj (Odontogram típusa) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSpeciesChange('dog')}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    record.species === 'dog'
                      ? 'bg-amber-500 text-white border-amber-600 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  🐕 Kutya (42 fog)
                </button>
                <button
                  type="button"
                  onClick={() => onSpeciesChange('cat')}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    record.species === 'cat'
                      ? 'bg-purple-600 text-white border-purple-700 font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  🐈 Macska (30 fog)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fajta
              </label>
              <input
                type="text"
                value={record.breed}
                onChange={e => onChange({ breed: e.target.value })}
                placeholder="Pl. Golden Retriever, Perzsa"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kor (év / hó)
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={record.ageYears}
                    onChange={e => onChange({ ageYears: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-center"
                    placeholder="Év"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={record.ageMonths}
                    onChange={e => onChange({ ageMonths: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-center"
                    placeholder="Hó"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Súly (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={record.weightKg}
                  onChange={e => onChange({ weightKg: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-lg text-center"
                />
              </div>
            </div>
          </div>

          {/* 2. Sor: Gazdi adatai & Anesztézia & Vizit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gazdi neve *
              </label>
              <input
                type="text"
                value={record.ownerName}
                onChange={e => onChange({ ownerName: e.target.value })}
                placeholder="Pl. Kovács Péter"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gazdi e-mail címe (PDF küldéshez) *
              </label>
              <input
                type="email"
                value={record.ownerEmail}
                onChange={e => onChange({ ownerEmail: e.target.value })}
                placeholder="gazdi@email.hu"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gazdi telefonszáma
              </label>
              <input
                type="tel"
                value={record.ownerPhone}
                onChange={e => onChange({ ownerPhone: e.target.value })}
                placeholder="+36 30 123 4567"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Állat neme
              </label>
              <select
                value={record.sex || 'ismeretlen'}
                onChange={e => onChange({ sex: e.target.value as AnimalSex })}
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="nosteny">Nőstény</option>
                <option value="him">Hím</option>
                <option value="ivartalanitott_nosteny">Ivartalanított nőstény</option>
                <option value="ivartalanitott_him">Ivartalanított hím</option>
                <option value="ismeretlen">Ismeretlen</option>
              </select>
            </div>
          </div>

          {/* 3. Sor: Aneszteziológiai állapot & Személyzet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-100 bg-slate-50/70 p-3 rounded-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>ASA-státusz (Altatási rizikó)</span>
                <span className="text-[10px] text-slate-500 font-normal">I (egészséges) – V (kritikus)</span>
              </label>
              <div className="flex gap-1">
                {(['I', 'II', 'III', 'IV', 'V'] as AsaStatus[]).map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ asaStatus: val })}
                    className={`flex-1 py-1 text-xs font-bold rounded border transition-colors ${
                      record.asaStatus === val
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Utolsó etetés ideje (Koplalás)
              </label>
              <input
                type="text"
                value={record.lastFeedingTime}
                onChange={e => onChange({ lastFeedingTime: e.target.value })}
                placeholder="Pl. Előző este 20:00 (12 órás koplalás)"
                className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preoperatív vérvizsgálat
              </label>
              <select
                value={record.bloodwork}
                onChange={e => onChange({ bloodwork: e.target.value as BloodworkResult })}
                className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="normal">Normál referenciaértékek</option>
                <option value="slight_variation">Enyhe eltérés (máj/vese/vérkép)</option>
                <option value="pathological">Kóros eltérés</option>
                <option value="not_performed">Nem készült</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kezelőorvos & Asszisztens
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={record.vetName}
                  onChange={e => onChange({ vetName: e.target.value })}
                  placeholder="Orvos neve"
                  className="w-1/2 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={record.assistantName}
                  onChange={e => onChange({ assistantName: e.target.value })}
                  placeholder="Asszisztens"
                  className="w-1/2 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* 4. Sor: Előzmények, panaszok & otthoni ápolás */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fő panaszok és indikációk (Válasszon egy vagy több tünetet)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {COMMON_COMPLAINTS.map(complaint => {
                const isSelected = record.mainComplaint?.includes(complaint);
                return (
                  <button
                    key={complaint}
                    type="button"
                    onClick={() => toggleComplaint(complaint)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 border-teal-300 font-medium'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{complaint}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Egyéb anamnézis / Panasz leírás
                </label>
                <input
                  type="text"
                  value={record.mainComplaintOther}
                  onChange={e => onChange({ mainComplaintOther: e.target.value })}
                  placeholder="Pl. Jobb felső kvadránsban duzzanat látható..."
                  className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Otthoni szájhigiénia
                </label>
                <input
                  type="text"
                  value={record.homeDentalCare}
                  onChange={e => onChange({ homeDentalCare: e.target.value })}
                  placeholder="Pl. Heti 1x fogmosás, enzimes rágóka..."
                  className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Etetés / Táp típusa
                </label>
                <input
                  type="text"
                  value={record.foodType}
                  onChange={e => onChange({ foodType: e.target.value })}
                  placeholder="Pl. Prémium száraz táp, Dental táp..."
                  className="w-full px-3 py-1 text-xs bg-white border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
