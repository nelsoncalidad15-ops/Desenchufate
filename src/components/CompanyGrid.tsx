import React from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  ChevronRight,
  ZapOff,
} from 'lucide-react';
import { EmpresaCalculada, AreaCalculada } from '../types';
import { getBrandTheme } from '../utils/brandTheme';
import { BrandLogos } from './BrandLogos';

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
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Building2 className="h-4 w-4 text-slate-700" />
          Empresas y Sedes
        </h3>
        <span className="text-xs font-mono text-slate-500">{empresas.length} Sedes evaluadas</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {empresas.map((emp, idx) => {
          const scoreBadgeClass = getCompanyScoreBadge(emp.porcentaje);
          const theme = getBrandTheme(emp.nombre);
          return (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className="group flex flex-col justify-between space-y-3 rounded-2xl border bg-white p-4 shadow-2xs transition-all duration-200 hover:shadow-xs"
              style={{ borderColor: theme.border, borderTopWidth: '4px' }}
            >
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      SEDE {emp.sede}
                    </span>
                    <div className="flex items-center gap-2">
                      <BrandLogos companyName={emp.nombre} />
                      <h4
                        onClick={() => onSelectCompany(emp.id)}
                        className="cursor-pointer text-base font-bold transition-colors"
                        style={{ color: theme.ink }}
                      >
                        {emp.nombre}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono font-bold text-slate-700">
                      #{emp.posicion}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-xs font-mono ${scoreBadgeClass}`} style={{ backgroundColor: theme.accent }}>
                      {emp.porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2">
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
                          className={`flex cursor-pointer items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium transition-all ${style}`}
                        >
                          <span className="max-w-[120px] truncate">{area.areaNombre}</span>
                          <span className="font-mono text-[10px] font-bold">{area.porcentaje.toFixed(0)}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <ZapOff className="h-3.5 w-3.5 text-amber-600" />
                  {emp.desviosCount} desvios
                </span>

                <button
                  onClick={() => onSelectCompany(emp.id)}
                  className="flex cursor-pointer items-center gap-0.5 font-bold text-slate-700 transition-colors hover:text-slate-900"
                >
                  <span>Detalle</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
