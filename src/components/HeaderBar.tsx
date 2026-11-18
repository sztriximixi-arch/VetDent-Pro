import React from 'react';
import { 
  FileText, 
  Download, 
  Mail, 
  FolderOpen, 
  Sparkles, 
  RotateCcw, 
  Printer, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

interface HeaderBarProps {
  activeTab: 'odontogram' | 'surgery' | 'discharge' | 'preview';
  onTabChange: (tab: 'odontogram' | 'surgery' | 'discharge' | 'preview') => void;
  onSave: () => void;
  onOpenRecords: () => void;
  onExportPdf: () => void;
  onOpenEmail: () => void;
  onLoadSample: (type: 'dog' | 'cat') => void;
  onNewRecord: () => void;
  isPdfGenerating: boolean;
  saveStatusNotice?: string | null;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  onTabChange,
  onSave,
  onOpenRecords,
  onExportPdf,
  onOpenEmail,
  onLoadSample,
  onNewRecord,
  isPdfGenerating,
  saveStatusNotice
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* 1. ZÓNA: Brand & Cím */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight whitespace-nowrap">
                  VetDent Pro
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Fogászati Lap
                </span>
              </div>
            </div>
          </div>

          {/* 2. ZÓNA: Navigációs fülek */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onTabChange('odontogram')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'odontogram'
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Odontogram & Fogvizsgálat
            </button>
            <button
              type="button"
              onClick={() => onTabChange('surgery')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'surgery'
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Anesztézia & Műtét
            </button>
            <button
              type="button"
              onClick={() => onTabChange('discharge')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === 'discharge'
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Hazadobó Lap & Gyógyszerek
            </button>
            <button
              type="button"
              onClick={() => onTabChange('preview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-teal-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              4. Zárójelentés Előnézet
            </button>
          </nav>

          {/* 3. ZÓNA: Akciók (Mentés, Minta, PDF, E-mail) */}
          <div className="flex items-center gap-2 shrink-0">
            {saveStatusNotice && (
              <span className="text-xs text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {saveStatusNotice}
              </span>
            )}

            {/* Minta esetek gombcsoport */}
            <div className="hidden lg:flex items-center gap-1 border-r border-slate-200 pr-2">
              <button
                type="button"
                onClick={() => onLoadSample('dog')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                title="Példa kutya eset betöltése (letört fog, extrakció)"
              >
                Minta Kutya
              </button>
              <button
                type="button"
                onClick={() => onLoadSample('cat')}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                title="Példa macska eset betöltése (TR resorptív lézió)"
              >
                Minta Macska
              </button>
              <button
                type="button"
                onClick={onNewRecord}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                title="Új üres lap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenRecords}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              Kezelési Lapok
            </button>

            <button
              type="button"
              onClick={onSave}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              Mentés
            </button>

            <button
              type="button"
              onClick={onExportPdf}
              disabled={isPdfGenerating}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isPdfGenerating ? 'Generálás...' : 'PDF Mentés'}
            </button>

            <button
              type="button"
              onClick={onOpenEmail}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              E-mail a Gazdinak
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
