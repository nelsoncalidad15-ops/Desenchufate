import React from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  ChevronRight,
  ZapOff,
} from 'lucide-react';
import { EmpresaCalculada, AreaCalculada } from '../types';
import { getBrandTheme } from '../utils/brandTheme';

interface CompanyGridProps {
  empresas: EmpresaCalculada[];
  onSelectCompany: (companyId: string) => void;
  onSelectArea?: (area: AreaCalculada) => void;
}

export const CompanyGrid: React.FC<CompanyGridProps> = ({
  empresas,
  onSelectCompany,
  onSelectArea,
}) => {
  const getAreaTagStyle = (estado: string) => {
    switch (estado) {
      case 'Excelente':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'Bueno':
        return 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100';
      case 'Alerta':
        return 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      case 'Crítico':
      default:
        return 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100';
    }
  };

  const getCompanyScoreBadge = (score: number) => {
    if (score >= 95) return 'bg-emerald-900 text-emerald-100 font-bold';
    if (score >= 85) return 'bg-slate-800 text-slate-100 font-bold';
    if (score >= 70) return 'bg-amber-800 text-amber-100 font-bold';
    return 'bg-rose-900 text-rose-100 font-bold';
  };

  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          Empresas y Sedes
        </h3>
        <span className="text-xs font-mono text-slate-500">
          {empresas.length} Sedes evaluadas
        </span>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empresas.map((emp, idx) => {
          const scoreBadgeClass = getCompanyScoreBadge(emp.puntaje);
          const theme = getBrandTheme(emp.nombre);
          return (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className="group rounded-2xl border bg-white p-4 hover:shadow-xs transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-3" style={{ borderColor: theme.border, borderTopWidth: '4px' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      SEDE {emp.sede}
                    </span>
                    <h4
                      onClick={() => onSelectCompany(emp.id)}
                      className="text-base font-bold cursor-pointer transition-colors" style={{ color: theme.ink }}
                    >
                      {emp.nombre}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{emp.posicion}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${scoreBadgeClass}`} style={{ backgroundColor: theme.accent }}>
                      {emp.puntaje.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Direct Visual Area Pills */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {emp.areas.map((area) => {
                      const style = getAreaTagStyle(area.estado);
                      return (
                        <button
                          key={area.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectArea) onSelectArea(area);
                            else onSelectCompany(emp.id);
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all flex items-center gap-1 cursor-pointer ${style}`}
                        >
                          <span className="truncate max-w-[120px]">{area.areaNombre}</span>
                          <span className="font-mono text-[10px] font-bold">
                            {area.puntaje}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <ZapOff className="w-3.5 h-3.5 text-amber-600" />
                  {emp.desviosCount} desvíos
                </span>

                <button
                  onClick={() => onSelectCompany(emp.id)}
                  className="flex items-center gap-0.5 text-slate-700 hover:text-slate-900 font-bold transition-colors cursor-pointer"
                >
                  <span>Detalle</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
