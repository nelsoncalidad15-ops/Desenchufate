import React from 'react';
import { History, Eye, Calendar, MapPin, ZapOff, Image as ImageIcon } from 'lucide-react';
import { RegistroDesvio } from '../types';

interface RecentDeviationsLogProps {
  registros: RegistroDesvio[];
  onSelectRegistro: (registro: RegistroDesvio) => void;
}

export const RecentDeviationsLog: React.FC<RecentDeviationsLogProps> = ({
  registros,
  onSelectRegistro,
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-700" />
          Bitácora de Hallazgos
        </h3>
        <span className="text-xs font-mono text-slate-500">
          {registros.length} registros
        </span>
      </div>

      {registros.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <ZapOff className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Sin desvíos en este período</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {registros.map((reg) => (
            <div
              key={reg.id}
              onClick={() => onSelectRegistro(reg)}
              className="group rounded-2xl bg-white border border-slate-200/90 p-4 hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer shadow-2xs flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {reg.empresaNombre} ({reg.sede})
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {reg.fecha}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {reg.areaNombre}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono text-xs font-bold flex-shrink-0">
                    -{reg.puntosDescontados} pt
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {reg.tipoDesvio}
                </p>

                {reg.observacion && (
                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    "{reg.observacion}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                {reg.fotoUrl && reg.mostrarFoto === 'Sí' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Con Foto
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] font-medium">Sin foto</span>
                )}

                <span className="text-slate-500 group-hover:text-slate-900 font-bold flex items-center gap-0.5 text-[11px]">
                  Ver registro <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
