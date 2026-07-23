import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { FiltrosState } from '../types';

interface FilterBarProps {
  filtros: FiltrosState;
  onFilterChange: (key: keyof FiltrosState, value: string) => void;
  onResetFilters: () => void;
  filtrosDisponibles: {
    meses: string[];
    anios: string[];
    sedes: string[];
    empresas: { id: string; nombre: string; sede: string }[];
    areas: { id: string; nombre: string; empresaNombre: string }[];
    tiposDesvio: string[];
  };
  activeFilterCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filtros,
  onFilterChange,
  onResetFilters,
  filtrosDisponibles,
  activeFilterCount,
}) => {
  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-4 md:p-5 shadow-sm space-y-4 transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-black text-slate-900">Filtros de Búsqueda</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
              {activeFilterCount} activos
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-rose-500" />
            <span>Limpiar Filtros</span>
          </button>
        )}
      </div>

      {/* Filter Control Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* 1. Mes */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Mes</label>
          <select
            value={filtros.mes}
            onChange={(e) => onFilterChange('mes', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
          >
            {filtrosDisponibles.meses.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Año */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Año</label>
          <select
            value={filtros.anio}
            onChange={(e) => onFilterChange('anio', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
          >
            {filtrosDisponibles.anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Empresa */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Empresa</label>
          <select
            value={filtros.empresa}
            onChange={(e) => onFilterChange('empresa', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer truncate"
          >
            <option value="Todas">Todas las empresas</option>
            {filtrosDisponibles.empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Sede */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Sede</label>
          <select
            value={filtros.sede}
            onChange={(e) => onFilterChange('sede', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
          >
            {filtrosDisponibles.sedes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Estado */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Excelente">Excelente (95-100)</option>
            <option value="Bueno">Bueno (85-94)</option>
            <option value="Alerta">Alerta (70-84)</option>
            <option value="Crítico">Crítico (&lt;70)</option>
          </select>
        </div>

        {/* 6. Tipo de Desvío */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Tipo Desvío</label>
          <select
            value={filtros.tipoDesvio}
            onChange={(e) => onFilterChange('tipoDesvio', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium outline-none focus:border-emerald-500 focus:bg-white cursor-pointer truncate"
          >
            {filtrosDisponibles.tiposDesvio.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Texto Búsqueda */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 block">Búsqueda libre</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filtros.busqueda}
              onChange={(e) => onFilterChange('busqueda', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
