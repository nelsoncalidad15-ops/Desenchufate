import React, { useRef } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  MapPin,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { AreaCalculada } from '../types';

interface AreaSliderProps {
  areas: AreaCalculada[];
  onSelectArea: (area: AreaCalculada) => void;
}

export const AreaSlider: React.FC<AreaSliderProps> = ({ areas, onSelectArea }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'Excelente':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          scoreColor: 'text-emerald-800',
        };
      case 'Bueno':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-600',
          scoreColor: 'text-teal-800',
        };
      case 'Alerta':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-600',
          scoreColor: 'text-amber-800',
        };
      case 'Crítico':
      default:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          scoreColor: 'text-rose-800',
        };
    }
  };

  return (
    <section className="space-y-3">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          Áreas Evaluadas ({areas.length})
        </h3>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            title="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Area Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {areas.map((area) => {
          const style = getBadgeStyle(area.estado);
          return (
            <div
              key={area.id}
              onClick={() => onSelectArea(area)}
              className="snap-start flex-shrink-0 w-64 sm:w-72 rounded-2xl bg-white border border-slate-200/90 p-4 hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer shadow-2xs flex flex-col justify-between space-y-3 group relative"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    {area.empresaNombre} ({area.sede})
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${style.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {area.estado}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {area.areaNombre}
                </h4>

                <div className="flex items-baseline justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">PUNTAJE</span>
                    <span className={`text-lg font-black font-mono ${style.scoreColor}`}>
                      {area.puntaje} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">DESVÍOS</span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {area.desviosCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                {area.desviosCount === 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sin desvíos
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> -{area.puntosDescontadosTotal} pts
                  </span>
                )}

                <span className="text-slate-400 group-hover:text-slate-900 font-bold transition-colors text-[11px]">
                  Ver →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
