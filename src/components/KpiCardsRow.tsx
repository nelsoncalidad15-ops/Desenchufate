import React from 'react';
import {
  Trophy,
  TrendingUp,
  Star,
  AlertTriangle,
  Flame,
  ZapOff,
  ChevronRight,
} from 'lucide-react';
import { ResumenGeneral } from '../types';

interface KpiCardsRowProps {
  resumen: ResumenGeneral;
  onSelectCompany: (companyId: string) => void;
  onSelectArea: (areaId: string) => void;
}

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({
  resumen,
  onSelectCompany,
}) => {
  const {
    mejorEmpresa,
    empresaMayorMejora,
    areaDestacada,
    empresaMasDesvios,
    areaMasDesvios,
    tipoDesvioMasFrecuente,
  } = resumen;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Mejor Empresa */}
      {mejorEmpresa && (
        <div
          onClick={() => onSelectCompany(mejorEmpresa.id)}
          className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Mejor Empresa
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                #{mejorEmpresa.posicion}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {mejorEmpresa.nombre} ({mejorEmpresa.sede})
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {mejorEmpresa.puntaje.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>{mejorEmpresa.areasCount} áreas</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              Detalle <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* 2. Empresa con Mayor Mejora */}
      {empresaMayorMejora && (
        <div
          onClick={() => onSelectCompany(empresaMayorMejora.id)}
          className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" /> Mayor Mejora
              </span>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-mono text-xs font-bold border border-teal-200">
                +{empresaMayorMejora.variacionMensual.toFixed(1)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
              {empresaMayorMejora.nombre} ({empresaMayorMejora.sede})
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {empresaMayorMejora.puntaje.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>vs mes previo</span>
            <span className="text-teal-700 font-bold flex items-center gap-0.5">
              Detalle <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* 3. Área Destacada */}
      {areaDestacada && (
        <div className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Área Modelo
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                {areaDestacada.puntaje} pts
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
              {areaDestacada.areaNombre}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {areaDestacada.empresaNombre} ({areaDestacada.sede})
            </p>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-3 pt-2 border-t border-slate-100">
            Sin desvíos en el mes
          </div>
        </div>
      )}

      {/* 4. Empresa con Más Desvíos */}
      {empresaMasDesvios && (
        <div
          onClick={() => onSelectCompany(empresaMasDesvios.id)}
          className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Más Desvíos
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-xs font-bold border border-amber-200">
                {empresaMasDesvios.desviosCount} desvíos
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
              {empresaMasDesvios.nombre} ({empresaMasDesvios.sede})
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {empresaMasDesvios.puntaje.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>Atención</span>
            <span className="text-amber-800 font-bold flex items-center gap-0.5">
              Detalle <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      )}

      {/* 5. Área con Más Desvíos */}
      {areaMasDesvios && (
        <div className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Área Crítica
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono text-xs font-bold border border-rose-200">
                -{areaMasDesvios.puntosDescontadosTotal} pts
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
              {areaMasDesvios.areaNombre}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {areaMasDesvios.empresaNombre} ({areaMasDesvios.sede})
            </p>
          </div>
          <div className="text-[11px] text-rose-700 font-bold font-mono mt-3 pt-2 border-t border-slate-100">
            {areaMasDesvios.desviosCount} desvíos
          </div>
        </div>
      )}

      {/* 6. Tipo de Desvío Más Frecuente */}
      {tipoDesvioMasFrecuente && (
        <div className="group relative rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <ZapOff className="w-3.5 h-3.5 text-emerald-600" /> Frecuencia
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                {tipoDesvioMasFrecuente.porcentajeTotal}%
              </span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
              {tipoDesvioMasFrecuente.tipo}
            </h3>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-100">
            {tipoDesvioMasFrecuente.cantidad} registros
          </div>
        </div>
      )}
    </section>
  );
};
