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
import { BrandLogos } from './BrandLogos';

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
  const canShowPhoto = (value?: string) => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-2xl flex-col justify-between overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="rounded-2xl border p-3"
                style={{ backgroundColor: theme.soft, borderColor: theme.border, color: theme.ink }}
              >
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: theme.ink }}>
                    Detalle de Empresa
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                    #{empresa.posicion} en ranking
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <BrandLogos companyName={empresa.nombre} size="md" />
                  <h2 className="flex items-center gap-2 text-2xl font-black text-slate-900">
                    {empresa.nombre}
                  </h2>
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> Sede: {empresa.sede}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl bg-slate-100 p-2 text-slate-600 transition-all hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center sm:grid-cols-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">PUNTAJE</span>
              <div className="font-mono text-3xl font-black text-slate-900">{empresa.puntaje.toFixed(1)}</div>
              <span className="text-[10px] text-slate-400">sobre 100</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">ESTADO</span>
              <div className="mt-1 text-sm font-black text-emerald-700">{empresa.estado}</div>
              <span className="text-[10px] text-slate-400">{empresa.porcentaje}% de meta</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">AREAS</span>
              <div className="mt-1 font-mono text-2xl font-black text-slate-900">{empresa.areasCount}</div>
              <span className="text-[10px] text-slate-400">evaluadas</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">DESVIOS</span>
              <div className="mt-1 font-mono text-2xl font-black text-slate-900">{empresa.desviosCount}</div>
              <span className="text-[10px] text-slate-400">en el periodo</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Layers className="h-4 w-4 text-emerald-600" /> Desempeno por area
            </h3>

            <div className="space-y-2">
              {empresa.areas.map((area, idx) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 transition-all hover:bg-slate-100/80"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-200 font-mono text-xs font-black text-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{area.areaNombre}</h4>
                      <p className="text-xs font-medium text-slate-500">
                        {area.desviosCount} desvios - {area.puntosDescontadosTotal} pts
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-black text-slate-900">{area.puntaje} pts</span>
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

          <div className="space-y-3 pt-2">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900">
              <ZapOff className="h-4 w-4 text-amber-500" /> Ultimos registros de desvios
            </h3>

            {companyRegs.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs font-medium text-slate-500">
                No hay desvios registrados para esta empresa en el periodo seleccionado.
              </div>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {companyRegs.map((reg) => (
                  <div
                    key={reg.id}
                    onClick={() => onSelectRegistro(reg)}
                    className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all hover:bg-emerald-50/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-emerald-700">{reg.areaNombre}</span>
                        <span className="text-slate-300">-</span>
                        <span className="font-mono text-[11px] font-bold text-slate-500">{reg.fecha}</span>
                      </div>
                      <p className="line-clamp-1 text-xs font-bold text-slate-800">{reg.tipoDesvio}</p>
                      {reg.observacion && (
                        <p className="line-clamp-1 text-[11px] italic text-slate-500">"{reg.observacion}"</p>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      {reg.fotoUrl && canShowPhoto(reg.mostrarFoto) && (
                        <span className="flex items-center gap-1 rounded-lg bg-emerald-100 p-1.5 text-[10px] font-bold text-emerald-800">
                          <Eye className="h-3 w-3" /> Foto
                        </span>
                      )}
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 font-mono text-xs font-bold text-rose-800">
                        -{reg.puntosDescontados} pt
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200"
          >
            Cerrar panel
          </button>
        </div>
      </div>
    </div>
  );
};
