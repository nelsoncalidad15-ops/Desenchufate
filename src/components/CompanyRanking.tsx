import React, { useState } from 'react';
import {
  Trophy,
  ArrowUpDown,
  Building2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import { EmpresaCalculada } from '../types';

interface CompanyRankingProps {
  empresas: EmpresaCalculada[];
  onSelectCompany: (companyId: string) => void;
}

type CriterioOrden = 'score_desc' | 'score_asc' | 'mejora_desc' | 'desvios_desc';

export const CompanyRanking: React.FC<CompanyRankingProps> = ({
  empresas,
  onSelectCompany,
}) => {
  const [criterio, setCriterio] = useState<CriterioOrden>('score_desc');

  const empresasOrdenadas = [...empresas].sort((a, b) => {
    switch (criterio) {
      case 'score_desc':
        return b.puntaje - a.puntaje;
      case 'score_asc':
        return a.puntaje - b.puntaje;
      case 'mejora_desc':
        return b.variacionMensual - a.variacionMensual;
      case 'desvios_desc':
        return b.desviosCount - a.desviosCount;
      default:
        return b.puntaje - a.puntaje;
    }
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
      {/* Top Header & Sort Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Tabla de Sedes
        </h3>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-2xl shadow-2xs">
          <span className="text-xs text-slate-500 px-2 font-bold flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Ordenar:
          </span>
          <select
            value={criterio}
            onChange={(e) => setCriterio(e.target.value as CriterioOrden)}
            className="bg-slate-50 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1 border border-slate-200 outline-none cursor-pointer"
          >
            <option value="score_desc">Mejor Puntaje</option>
            <option value="score_asc">Menor Puntaje</option>
            <option value="mejora_desc">Mayor Mejora</option>
            <option value="desvios_desc">Más Desvíos</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-16">Pos</th>
                <th className="py-3 px-4">Empresa / Sede</th>
                <th className="py-3 px-4 text-center">Puntaje</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Áreas</th>
                <th className="py-3 px-4 text-center">Desvíos</th>
                <th className="py-3 px-4 text-center">Tendencia</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empresasOrdenadas.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectCompany(emp.id)}
                  className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono text-xs ${
                        emp.posicion === 1
                          ? 'bg-amber-100 text-amber-900 font-extrabold border border-amber-300'
                          : emp.posicion === 2
                          ? 'bg-slate-100 text-slate-800 font-bold border border-slate-300'
                          : emp.posicion === 3
                          ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {emp.posicion}°
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                      {emp.nombre}
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
                      <Building2 className="w-3 h-3 text-slate-400" /> Sede {emp.sede}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-black text-sm text-slate-900">
                    {emp.puntaje.toFixed(1)} <span className="text-[10px] text-slate-500 font-normal">/100</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border ${getEstadoBadge(emp.estado)}`}>
                      {emp.estado}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-slate-700">
                    {emp.areasCount}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {emp.desviosCount}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-0.5 ${
                        emp.variacionMensual > 0
                          ? 'text-emerald-700'
                          : emp.variacionMensual < 0
                          ? 'text-rose-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {emp.variacionMensual > 0 && <TrendingUp className="w-3.5 h-3.5" />}
                      {emp.variacionMensual < 0 && <TrendingDown className="w-3.5 h-3.5" />}
                      {emp.variacionMensual > 0 ? `+${emp.variacionMensual}` : emp.variacionMensual}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
