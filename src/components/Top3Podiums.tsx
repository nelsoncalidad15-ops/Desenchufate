import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Award,
  AlertCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { EmpresaCalculada, AreaCalculada } from '../types';
import { getBrandTheme } from '../utils/brandTheme';
import { BrandLogos } from './BrandLogos';

interface Top3PodiumsProps {
  empresas: EmpresaCalculada[];
  areas: AreaCalculada[];
  onSelectCompany: (companyId: string) => void;
  onSelectArea: (area: AreaCalculada) => void;
}

export const Top3Podiums: React.FC<Top3PodiumsProps> = ({
  empresas,
  areas,
  onSelectCompany,
  onSelectArea,
}) => {
  const [activeTab, setActiveTab] = useState<'empresas' | 'peoresEmpresas' | 'mejoresAreas' | 'peoresAreas'>('empresas');

  const sortedEmpresas = [...empresas].sort((a, b) => b.puntaje - a.puntaje);
  const top1 = sortedEmpresas[0];
  const top2 = sortedEmpresas[1];
  const top3 = sortedEmpresas[2];

  const podiumOrder = [
    top2 ? { emp: top2, pos: 2 } : null,
    top1 ? { emp: top1, pos: 1 } : null,
    top3 ? { emp: top3, pos: 3 } : null,
  ].filter(Boolean) as { emp: EmpresaCalculada; pos: number }[];

  const top3PeoresEmpresas = [...empresas]
    .sort((a, b) => {
      if (a.puntaje !== b.puntaje) return a.puntaje - b.puntaje;
      return b.desviosCount - a.desviosCount;
    })
    .slice(0, 3);

  const top3MejoresAreas = [...areas].sort((a, b) => b.puntaje - a.puntaje).slice(0, 3);
  const top3PeoresAreas = [...areas]
    .sort((a, b) => {
      if (a.puntaje !== b.puntaje) return a.puntaje - b.puntaje;
      return b.desviosCount - a.desviosCount;
    })
    .slice(0, 3);

  const top1Score = top1 ? top1.porcentaje : 100;

  return (
    <section className="space-y-3">
      <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.10),_transparent_24%),linear-gradient(135deg,_#0f172a_0%,_#152238_58%,_#111827_100%)] p-6 text-white shadow-xl">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300 shadow-inner">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Tabla de Liderazgo</h2>
              <p className="mt-0.5 text-xs text-slate-400">Competencia visual entre sedes y lectura rapida del podio.</p>
            </div>
          </div>

          {top1 && top2 && (
            <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs backdrop-blur-sm md:self-auto">
              <Flame className="h-4 w-4 flex-shrink-0 text-amber-300" />
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">DISPUTA POR EL 1° PUESTO</span>
                <span className="font-medium text-slate-100">
                  <strong className="font-bold text-amber-200">{top2.nombre}</strong> esta a{' '}
                  <strong className="font-mono font-bold text-emerald-300">{(top1Score - top2.porcentaje).toFixed(1)} pp</strong>{' '}
                  del liderazgo de <strong className="font-bold text-white">{top1.nombre}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('empresas')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all cursor-pointer ${
              activeTab === 'empresas'
                ? 'bg-white font-bold text-slate-900 shadow-sm'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" /> Sedes Destacadas
          </button>
          <button
            onClick={() => setActiveTab('peoresEmpresas')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all cursor-pointer ${
              activeTab === 'peoresEmpresas'
                ? 'border border-rose-400/30 bg-rose-500/15 font-bold text-rose-200'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-rose-300" /> Sedes a Mejorar
          </button>
          <button
            onClick={() => setActiveTab('mejoresAreas')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all cursor-pointer ${
              activeTab === 'mejoresAreas'
                ? 'bg-white font-bold text-slate-900 shadow-sm'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Areas Modelo
          </button>
          <button
            onClick={() => setActiveTab('peoresAreas')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all cursor-pointer ${
              activeTab === 'peoresAreas'
                ? 'border border-rose-400/30 bg-rose-500/15 font-bold text-rose-200'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-rose-300" /> Areas Criticas
          </button>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'empresas' && (
              <motion.div
                key="empresasPodium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 items-end gap-4 md:grid-cols-3"
              >
                {podiumOrder.map(({ emp, pos }) => {
                  const isFirst = pos === 1;
                  const isSecond = pos === 2;
                  const theme = getBrandTheme(emp.nombre);

                  const cardStyle = isFirst
                    ? 'md:-translate-y-2 border-amber-300/40 bg-white/10 shadow-2xl ring-1 ring-amber-300/30'
                    : isSecond
                    ? 'border-white/10 bg-white/6'
                    : 'border-white/10 bg-white/6';

                  const posBadge = isFirst
                    ? 'bg-amber-300 text-slate-950'
                    : isSecond
                    ? 'bg-slate-200 text-slate-900'
                    : 'bg-amber-700/80 text-amber-100';

                  return (
                    <div
                      key={emp.id}
                      onClick={() => onSelectCompany(emp.id)}
                      className={`group relative flex cursor-pointer flex-col justify-between rounded-[1.6rem] border p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-white/12 ${cardStyle}`}
                      style={{ borderColor: isFirst ? undefined : `${theme.accent}55`, borderTopWidth: '3px' }}
                    >
                      {isFirst && <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />}

                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-black tracking-wide ${posBadge}`}>
                            POSICION 0{pos}
                          </span>
                          <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400">SEDE {emp.sede}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <BrandLogos companyName={emp.nombre} size="md" />
                          <div>
                            <h3 className="text-xl font-black text-white">{emp.nombre}</h3>
                            <p className="mt-0.5 text-xs text-slate-400">{emp.areasCount} areas evaluadas</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/10 pt-4">
                        <div className="mb-3 flex items-end justify-between gap-3">
                          <div>
                            <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">PUNTAJE</span>
                            <span className={`font-mono text-3xl font-black ${isFirst ? 'text-amber-200' : 'text-white'}`}>
                              {emp.porcentaje.toFixed(1)}
                            </span>
                            <span className="ml-1 text-sm text-slate-400">%</span>
                          </div>

                          <div className="text-right">
                            <span className="flex items-center justify-end gap-1 font-mono text-xs font-bold text-emerald-300">
                              <TrendingUp className="h-3.5 w-3.5" />
                              {emp.variacionMensual >= 0 ? `+${emp.variacionMensual}` : emp.variacionMensual} pp
                            </span>
                            <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-slate-500">variacion</span>
                          </div>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${isFirst ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300' : 'bg-gradient-to-r from-cyan-300 to-emerald-300'}`}
                            style={{ width: `${Math.max(emp.porcentaje, 8)}%` }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-300 transition-colors group-hover:text-white">
                          Ver detalle <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'peoresEmpresas' && (
              <motion.div
                key="peoresEmpresasPodium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 gap-3 md:grid-cols-3"
              >
                {top3PeoresEmpresas.map((emp, idx) => {
                  const theme = getBrandTheme(emp.nombre);
                  return (
                    <div
                      key={emp.id}
                      onClick={() => onSelectCompany(emp.id)}
                      className="group cursor-pointer rounded-[1.4rem] border border-rose-400/20 bg-rose-500/10 p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-rose-500/15"
                      style={{ borderTopColor: theme.accent, borderTopWidth: '3px' }}
                    >
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-1 font-mono text-[10px] font-black tracking-wide text-rose-200">
                          #{String(idx + 1).padStart(2, '0')} MENOR PUNTAJE
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400">
                          SEDE {emp.sede}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BrandLogos companyName={emp.nombre} size="md" />
                        <div>
                          <h3 className="text-lg font-black text-white">{emp.nombre}</h3>
                          <p className="mt-0.5 text-xs text-slate-400">{emp.areasCount} areas evaluadas</p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-3">
                        <div>
                          <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">PUNTAJE</span>
                          <span className="font-mono text-2xl font-black text-rose-200">{emp.porcentaje.toFixed(1)}%</span>
                        </div>
                        <span className="text-xs font-bold text-rose-300">{emp.desviosCount} hallazgos</span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-300" style={{ width: `${Math.max(emp.porcentaje, 8)}%` }} />
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-300 transition-colors group-hover:text-white">
                        Ver detalle <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
            {activeTab === 'mejoresAreas' && (
              <motion.div
                key="mejoresAreasPodium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 gap-3 md:grid-cols-3"
              >
                {top3MejoresAreas.map((area, idx) => (
                  <div
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 transition-all hover:bg-emerald-400/15"
                  >
                    <div>
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-emerald-300">
                        #0{idx + 1} DESEMPENO EXCELENTE
                      </span>
                      <h4 className="mt-1 text-base font-black text-white">{area.areaNombre}</h4>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                        <MapPin className="h-3 w-3 text-emerald-300" />
                        {area.empresaNombre} ({area.sede})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xl font-black text-emerald-200">{area.porcentaje.toFixed(0)}%</span>
                      <span className="text-[10px] text-slate-400">0 desvios</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'peoresAreas' && (
              <motion.div
                key="peoresAreasPodium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 gap-3 md:grid-cols-3"
              >
                {top3PeoresAreas.map((area, idx) => (
                  <div
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 transition-all hover:bg-rose-500/15"
                  >
                    <div>
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-rose-300">
                        #0{idx + 1} AREA CRITICA
                      </span>
                      <h4 className="mt-1 text-base font-black text-white">{area.areaNombre}</h4>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                        <MapPin className="h-3 w-3 text-rose-300" />
                        {area.empresaNombre} ({area.sede})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xl font-black text-rose-200">{area.porcentaje.toFixed(0)}%</span>
                      <span className="text-[10px] font-bold text-rose-300">-{area.puntosDescontadosTotal} pts</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
