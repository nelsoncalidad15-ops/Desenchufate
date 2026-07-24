import React from 'react';
import {
  Zap,
  RefreshCw,
  Filter,
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
  ultimaActualizacion,
  isRefreshing,
  onRefresh,
  activeFilterCount,
  onToggleFilterBar,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
                DESENCHUFATE
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> En linea
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Ultima sincronizacion: <span className="font-mono font-bold text-slate-700">{ultimaActualizacion}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-700 shadow-2xs md:flex">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{periodoSeleccionado}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex cursor-pointer items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-default disabled:opacity-70"
            title="Actualizar datos"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
          </button>

          <button
            onClick={onToggleFilterBar}
            className={`flex cursor-pointer items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilterCount > 0
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
