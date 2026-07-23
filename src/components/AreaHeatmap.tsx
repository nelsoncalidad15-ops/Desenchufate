import React, { useState } from 'react';
import { Grid, BarChart3 } from 'lucide-react';
import { AreaCalculada } from '../types';

interface AreaHeatmapProps {
  areas: AreaCalculada[];
  onSelectArea: (area: AreaCalculada) => void;
}

export const AreaHeatmap: React.FC<AreaHeatmapProps> = ({
  areas,
  onSelectArea,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'bars'>('grid');

  const getTileStyle = (estado: string) => {
    switch (estado) {
      case 'Excelente':
        return {
          bg: 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/80',
          text: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          bar: 'bg-emerald-600',
        };
      case 'Bueno':
        return {
          bg: 'bg-teal-50/80 border-teal-200 hover:border-teal-400 hover:bg-teal-100/80',
          text: 'text-teal-800',
          badge: 'bg-teal-100 text-teal-800 border-teal-300',
          bar: 'bg-teal-600',
        };
      case 'Alerta':
        return {
          bg: 'bg-amber-50/80 border-amber-200 hover:border-amber-400 hover:bg-amber-100/80',
          text: 'text-amber-900',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          bar: 'bg-amber-500',
        };
      case 'Crítico':
      default:
        return {
          bg: 'bg-rose-50/80 border-rose-200 hover:border-rose-400 hover:bg-rose-100/80',
          text: 'text-rose-900',
          badge: 'bg-rose-100 text-rose-900 border-rose-300',
          bar: 'bg-rose-600',
        };
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Grid className="w-5 h-5 text-emerald-600" />
            Monitoreo Rápido de Áreas
          </h2>
          <p className="text-xs text-slate-500">
            Vista global instantánea por código de color.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Cuadraditos
          </button>
          <button
            onClick={() => setViewMode('bars')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'bars'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Barras
          </button>
        </div>
      </div>

      {/* Grid Mode (Cuadraditos / Heatmap) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {areas.map((area) => {
            const style = getTileStyle(area.estado);
            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area)}
                className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between space-y-2 shadow-2xs group ${style.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${style.badge}`}>
                    {area.puntaje} pts
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    {area.desviosCount} desvíos
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {area.areaNombre}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate font-medium">
                    {area.empresaNombre} ({area.sede})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Bars Mode */
        <div className="rounded-3xl bg-white border border-slate-200/90 p-4 space-y-3 shadow-xs">
          {areas.map((area) => {
            const style = getTileStyle(area.estado);
            return (
              <div
                key={area.id}
                onClick={() => onSelectArea(area)}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {area.areaNombre} <span className="text-slate-500 font-normal">({area.empresaNombre} - {area.sede})</span>
                  </span>
                  <span className={`font-mono font-black ${style.text}`}>
                    {area.puntaje} / 100
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${Math.max(area.puntaje, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
