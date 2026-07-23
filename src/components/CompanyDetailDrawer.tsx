import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Layers,
  ZapOff,
  Eye,
} from 'lucide-react';
import { EmpresaCalculada, RegistroDesvio, RegistroDesvio as RegistroType } from '../types';
import { getBrandTheme } from '../utils/brandTheme';

interface CompanyDetailDrawerProps {
  empresa: EmpresaCalculada | null;
  registros: RegistroDesvio[];
  onClose: () => void;
  onSelectRegistro: (registro: RegistroType) => void;
}

export const CompanyDetailDrawer: React.FC<CompanyDetailDrawerProps> = ({
  empresa,
  registros,
  onClose,
  onSelectRegistro,
}) => {
  if (!empresa) return null;

  const companyRegs = registros.filter((r) => r.idEmpresa === empresa.id);
  const theme = getBrandTheme(empresa.nombre);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl border" style={{ backgroundColor: theme.soft, borderColor: theme.border, color: theme.ink }}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.ink }}>
                    Detalle de Empresa
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 font-mono">
                    #{empresa.posicion} en Ranking
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  {empresa.nombre}
                </h2>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Sede: {empresa.sede}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Company Score Banner */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">PUNTAJE</span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {empresa.puntaje.toFixed(1)}
              </div>
              <span className="text-[10px] text-slate-400">sobre 100</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">ESTADO</span>
              <div className="text-sm font-black text-emerald-700 mt-1">
                {empresa.estado}
              </div>
              <span className="text-[10px] text-slate-400">{empresa.porcentaje}% de meta</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">ÁREAS</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {empresa.areasCount}
              </div>
              <span className="text-[10px] text-slate-400">evaluadas</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">DESVÍOS</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {empresa.desviosCount}
              </div>
              <span className="text-[10px] text-slate-400">en el período</span>
            </div>
          </div>

          {/* Area Breakdown Ranking */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" /> Desempeño por Área
            </h3>

            <div className="space-y-2">
              {empresa.areas.map((area, idx) => (
                <div
                  key={area.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-mono font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{area.areaNombre}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {area.desviosCount} desvíos • -{area.puntosDescontadosTotal} pts
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-mono">
                      {area.puntaje} pts
                    </span>
                    <span
                      className={`block text-[11px] font-bold ${
                        area.estado === 'Excelente'
                          ? 'text-emerald-700'
                          : area.estado === 'Bueno'
                          ? 'text-teal-700'
                          : area.estado === 'Alerta'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {area.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Logs for this Company */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ZapOff className="w-4 h-4 text-amber-500" /> Últimos Registros de Desvíos
            </h3>

            {companyRegs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 font-medium">
                No hay desvíos registrados para esta empresa en el período seleccionado.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {companyRegs.map((reg) => (
                  <div
                    key={reg.id}
                    onClick={() => onSelectRegistro(reg)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-emerald-700">{reg.areaNombre}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono text-[11px] font-bold">{reg.fecha}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">
                        {reg.tipoDesvio}
                      </p>
                      {reg.observacion && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          "{reg.observacion}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {reg.fotoUrl && reg.mostrarFoto === 'Sí' && (
                        <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Foto
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-mono text-xs font-bold">
                        -{reg.puntosDescontados} pt
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
