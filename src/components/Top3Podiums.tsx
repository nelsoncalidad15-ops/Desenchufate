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
  const [activeTab, setActiveTab] = useState<'empresas' | 'mejoresAreas' | 'peoresAreas'>('empresas');

  // Sorted Companies
  const sortedEmpresas = [...empresas].sort((a, b) => b.puntaje - a.puntaje);
  const top1 = sortedEmpresas[0];
  const top2 = sortedEmpresas[1];
  const top3 = sortedEmpresas[2];

  // Visual order for podium: [2nd, 1st, 3rd] on md screens
  const podiumOrder = [
    top2 ? { emp: top2, pos: 2 } : null,
    top1 ? { emp: top1, pos: 1 } : null,
    top3 ? { emp: top3, pos: 3 } : null,
  ].filter(Boolean) as { emp: EmpresaCalculada; pos: number }[];

  // Top Areas
  const top3MejoresAreas = [...areas].sort((a, b) => b.puntaje - a.puntaje).slice(0, 3);
  const top3PeoresAreas = [...areas]
    .sort((a, b) => {
      if (a.puntaje !== b.puntaje) return a.puntaje - b.puntaje;
      return b.desviosCount - a.desviosCount;
    })
    .slice(0, 3);

  const top1Score = top1 ? top1.puntaje : 100;

  return (
    <section className="space-y-3">
      {/* Executive Leaderboard Panel */}
      <div className="rounded-2xl bg-slate-900 p-6 text-white border border-slate-800 shadow-md">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Tabla de Liderazgo
              </h2>
            </div>
          </div>

          {/* Brecha directa entre 1° y 2° puesto */}
          {top1 && top2 && (
            <div className="bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-xl flex items-center gap-3 text-xs self-start md:self-auto">
              <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-mono block uppercase">DISPUTA POR EL 1° PUESTO</span>
                <span className="text-slate-200 font-medium">
                  <strong className="text-amber-300 font-bold">{top2.nombre}</strong> está a sólo{' '}
                  <strong className="font-mono text-emerald-400 font-bold">
                    {(top1Score - top2.puntaje).toFixed(1)} pts
                  </strong>{' '}
                  de <strong className="text-slate-100 font-bold">{top1.nombre}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="mt-5 flex items-center gap-1.5 font-medium text-xs">
          <button
            onClick={() => setActiveTab('empresas')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'empresas'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Sedes Destacadas
          </button>
          <button
            onClick={() => setActiveTab('mejoresAreas')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mejoresAreas'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Áreas Modelo
          </button>
          <button
            onClick={() => setActiveTab('peoresAreas')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'peoresAreas'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Áreas Críticas
          </button>
        </div>

        {/* Podium Display */}
        <div className="mt-5">
          <AnimatePresence mode="wait">
            {activeTab === 'empresas' && (
              <motion.div
                key="empresasPodium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end"
              >
                {podiumOrder.map(({ emp, pos }) => {
                  const isFirst = pos === 1;
                  const isSecond = pos === 2;
                  const theme = getBrandTheme(emp.nombre);

                  const cardStyle = isFirst
                    ? 'bg-slate-800/90 border-2 border-amber-400/80 text-white shadow-lg'
                    : isSecond
                    ? 'bg-slate-800/60 border border-slate-700/80 text-slate-200'
                    : 'bg-slate-800/60 border border-slate-700/80 text-slate-200';

                  const posBadge = isFirst
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : isSecond
                    ? 'bg-slate-300 text-slate-900 font-bold'
                    : 'bg-amber-800/80 text-amber-200 font-bold';

                  return (
                    <div
                      key={emp.id}
                      onClick={() => onSelectCompany(emp.id)}
                      className={`rounded-2xl p-4.5 cursor-pointer transition-all hover:bg-slate-800 flex flex-col justify-between group ${cardStyle}`} style={{ borderColor: theme.accent, borderTopWidth: '3px' }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-wide ${posBadge}`}>
                            POSICIÓN 0{pos}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            SEDE {emp.sede}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold transition-colors" style={{ color: theme.border }}>
                          {emp.nombre}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {emp.areasCount} áreas evaluadas • {emp.desviosCount} desvíos
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono block uppercase">PUNTAJE</span>
                          <span className={`text-2xl font-black font-mono ${isFirst ? 'text-amber-300' : 'text-slate-100'}`}>
                            {emp.puntaje.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/100</span>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {emp.variacionMensual >= 0 ? `+${emp.variacionMensual}` : emp.variacionMensual}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors flex items-center gap-0.5 justify-end mt-0.5 font-medium">
                            Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
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
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                {top3MejoresAreas.map((area, idx) => (
                  <div
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="bg-slate-800/60 border border-emerald-500/30 p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                        #0{idx + 1} DESEMPEÑO EXCELENTE
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{area.areaNombre}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {area.empresaNombre} ({area.sede})
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xl font-bold font-mono text-emerald-400 block">
                        {area.puntaje}
                      </span>
                      <span className="text-[10px] text-slate-400">0 desvíos</span>
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
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                {top3PeoresAreas.map((area, idx) => (
                  <div
                    key={area.id}
                    onClick={() => onSelectArea(area)}
                    className="bg-slate-800/60 border border-rose-500/30 p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                        #0{idx + 1} ÁREA CRÍTICA
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5">{area.areaNombre}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {area.empresaNombre} ({area.sede})
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xl font-bold font-mono text-rose-300 block">
                        {area.puntaje}
                      </span>
                      <span className="text-[10px] font-bold text-rose-400">-{area.puntosDescontadosTotal} pts</span>
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
