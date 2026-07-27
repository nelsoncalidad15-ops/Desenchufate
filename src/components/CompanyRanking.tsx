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
import { BrandLogos } from './BrandLogos';

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
            <Trophy className="h-5 w-5 text-amber-500" />
            Tabla de Sedes
          </h3>
          <p className="mt-1 text-xs text-slate-500">Listado completo de posiciones con lectura mas clara de marca y estado.</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs">
          <span className="flex items-center gap-1 px-2 text-xs font-bold text-slate-500">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" /> Ordenar:
          </span>
          <select
            value={criterio}
            onChange={(e) => setCriterio(e.target.value as CriterioOrden)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none"
          >
            <option value="score_desc">Mejor Puntaje</option>
            <option value="score_asc">Menor Puntaje</option>
            <option value="mejora_desc">Mayor Mejora</option>
            <option value="desvios_desc">Mas Desvios</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] font-bold uppercase tracking-[0.14em] text-slate-600">
                <th className="w-20 px-4 py-3 text-center">Pos</th>
                <th className="px-4 py-3">Empresa / Sede</th>
                <th className="px-4 py-3 text-center">Puntaje</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Areas</th>
                <th className="px-4 py-3 text-center">Desvios</th>
                <th className="px-4 py-3 text-center">Tendencia</th>
                <th className="px-4 py-3 text-right">Accion</th>
              </tr>
            </thead>
            <tbody>
              {empresasOrdenadas.map((emp, index) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectCompany(emp.id)}
                  className={`group cursor-pointer border-b border-slate-100 transition-colors hover:bg-emerald-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/45'}`}
                >
                  <td className="px-4 py-3 text-center font-mono font-bold">
                    <span
                      className={`inline-flex min-w-[3rem] items-center justify-center rounded-2xl px-2 py-1 font-mono text-xs ${
                        emp.posicion === 1
                          ? 'border border-amber-300 bg-amber-100 font-extrabold text-amber-950 shadow-2xs'
                          : emp.posicion === 2
                          ? 'border border-slate-300 bg-slate-100 font-bold text-slate-800'
                          : emp.posicion === 3
                          ? 'border border-amber-200 bg-amber-50 font-bold text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{emp.posicion}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <BrandLogos companyName={emp.nombre} monochrome size="sm" />
                      <div>
                        <div className="text-sm font-black text-slate-900 transition-colors group-hover:text-emerald-700">
                          {emp.nombre}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Building2 className="h-3 w-3 text-slate-400" /> Sede {emp.sede}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="font-mono text-lg font-black text-slate-900">{emp.porcentaje.toFixed(1)}%</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">cumplimiento</div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full border px-2.5 py-1 font-bold ${getEstadoBadge(emp.estado)}`}>
                      {emp.estado}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center font-mono text-sm font-black text-slate-700">{emp.areasCount}</td>

                  <td className="px-4 py-3 text-center font-mono text-sm font-black text-slate-800">{emp.desviosCount}</td>

                  <td className="px-4 py-3 text-center font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                        emp.variacionMensual > 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : emp.variacionMensual < 0
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {emp.variacionMensual > 0 && <TrendingUp className="h-3.5 w-3.5" />}
                      {emp.variacionMensual < 0 && <TrendingDown className="h-3.5 w-3.5" />}
                      {emp.variacionMensual > 0 ? `+${emp.variacionMensual}` : emp.variacionMensual}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button className="cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition-all group-hover:border-emerald-300 group-hover:bg-emerald-600 group-hover:text-white">
                      <ChevronRight className="h-4 w-4" />
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
