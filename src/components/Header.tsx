import React from 'react';
import {
  Zap,
  RefreshCw,
  Filter,
  FileCode,
  Sliders,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ConfigSheet } from '../types';

interface HeaderProps {
  config: ConfigSheet;
  periodoSeleccionado: string;
  ultimaActualizacion: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  activeFilterCount: number;
  onToggleFilterBar: () => void;
  onOpenAppsScriptModal?: () => void;
  onOpenConfigModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  periodoSeleccionado,
  isRefreshing,
  onRefresh,
  activeFilterCount,
  onToggleFilterBar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Name & Linked Green Check Badge Only */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
              DESENCHUFATE
            </h1>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" title="Google Sheets Vinculado" />
          </div>
        </div>

        {/* Right: Actions (Period, Refresh, Filter Button) */}
        <div className="flex items-center gap-2">
          {/* Period Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{periodoSeleccionado}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>

          {/* Filters Toggle Button */}
          <button
            onClick={onToggleFilterBar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeFilterCount > 0
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
