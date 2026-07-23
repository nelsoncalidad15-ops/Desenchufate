import React, { useState } from 'react';
import { Layers, Search, Filter } from 'lucide-react';
import { AreaCalculada } from '../types';

interface AreaRankingProps {
  areas: AreaCalculada[];
  empresasFiltro: { id: string; nombre: string }[];
  onSelectArea: (area: AreaCalculada) => void;
}

export const AreaRanking: React.FC<AreaRankingProps> = ({
  areas,
  empresasFiltro,
  onSelectArea,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAreas = areas.filter((a) => {
    if (selectedCompanyId !== 'Todas' && a.idEmpresa !== selectedCompanyId) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.areaNombre.toLowerCase().includes(q) ||
        a.empresaNombre.toLowerCase().includes(q) ||
        a.sede.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Excelente':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Bueno':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Alerta':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Crítico':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Tabla de Áreas
        </h3>

        {/* Filter Bar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-40 sm:w-48 shadow-2xs"
            />
          </div>

          {/* Company Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-transparent text-slate-800 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="Todas">Todas las empresas</option>
              {empresasFiltro.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Areas Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-12">#</th>
                <th className="py-3 px-4">Área</th>
                <th className="py-3 px-4">Empresa / Sede</th>
                <th className="py-3 px-4 text-center">Puntaje</th>
                <th className="py-3 px-4 text-center">Desvíos</th>
                <th className="py-3 px-4 text-center">Descuento</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs font-medium">
                    No se encontraron áreas.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area, idx) => (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {area.areaNombre}
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {area.empresaNombre} <span className="text-slate-400">({area.sede})</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-black text-sm text-slate-900">
                      {area.puntaje} <span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                      {area.desviosCount}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-rose-700">
                      -{area.puntosDescontadosTotal} pts
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border ${getEstadoBadge(area.estado)}`}>
                        {area.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
