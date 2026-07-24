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
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'Bueno':
        return 'border-teal-200 bg-teal-50 text-teal-800';
      case 'Alerta':
        return 'border-amber-200 bg-amber-50 text-amber-900';
      default:
        return 'border-rose-200 bg-rose-50 text-rose-800';
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <Layers className="h-5 w-5 text-emerald-600" />
            Tabla de Areas
          </h3>
          <p className="mt-1 text-xs text-slate-500">Vista operativa para detectar rapido donde se pierden puntos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 rounded-2xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:border-emerald-500 focus:outline-none sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="cursor-pointer bg-transparent text-xs font-bold text-slate-800 outline-none"
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

      <div className="overflow-hidden rounded-[1.8rem] border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] font-bold uppercase tracking-[0.14em] text-slate-600">
                <th className="w-16 px-4 py-3 text-center">#</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Empresa / Sede</th>
                <th className="px-4 py-3 text-center">Puntaje</th>
                <th className="px-4 py-3 text-center">Desvios</th>
                <th className="px-4 py-3 text-center">Descuento</th>
                <th className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs font-medium text-slate-500">
                    No se encontraron areas.
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area, idx) => (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className={`group cursor-pointer border-b border-slate-100 transition-colors hover:bg-emerald-50/40 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/45'}`}
                  >
                    <td className="px-4 py-3 text-center font-mono text-sm font-black text-slate-500">
                      #{idx + 1}
                    </td>

                    <td className="px-4 py-3 text-sm font-black text-slate-900 transition-colors group-hover:text-emerald-700">
                      {area.areaNombre}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-600">
                      {area.empresaNombre} <span className="text-slate-400">({area.sede})</span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="font-mono text-lg font-black text-slate-900">{area.puntaje}</div>
                      <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">sobre 100</div>
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-sm font-black text-slate-800">
                      {area.desviosCount}
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-sm font-black text-rose-700">
                      -{area.puntosDescontadosTotal} pts
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full border px-2.5 py-1 font-bold ${getEstadoBadge(area.estado)}`}>
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
