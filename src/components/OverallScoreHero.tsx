import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Award,
  Building,
  Layers,
  ZapOff,
} from 'lucide-react';
import { ResumenGeneral, ConfigSheet, EstadoPuntaje } from '../types';

interface OverallScoreHeroProps {
  resumen: ResumenGeneral;
  config: ConfigSheet;
  periodoNombre: string;
}

export const OverallScoreHero: React.FC<OverallScoreHeroProps> = ({
  resumen,
  config,
  periodoNombre,
}) => {
  const {
    puntajeGrupo,
    porcentajeGrupo,
    estadoGrupo,
    variacionMesAnterior,
    tendencia,
    totalEmpresasActivas,
    totalAreasActivas,
    totalDesviosPeriodo,
    totalPuntosDescontados,
  } = resumen;

  // Icon & styling configuration per state
  const getEstadoBadgeConfig = (estado: EstadoPuntaje) => {
    switch (estado) {
      case 'Excelente':
        return {
          colorClass: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
          gaugeGradient: 'from-emerald-500 to-teal-400',
          icon: <Award className="w-5 h-5 text-emerald-400" />,
          desc: 'Nivel óptimo de eficiencia energética.',
        };
      case 'Bueno':
        return {
          colorClass: 'text-teal-300 bg-teal-500/15 border-teal-500/40',
          gaugeGradient: 'from-teal-500 to-cyan-400',
          icon: <CheckCircle className="w-5 h-5 text-teal-400" />,
          desc: 'Buen desempeño con bajas desviaciones.',
        };
      case 'Alerta':
        return {
          colorClass: 'text-amber-300 bg-amber-500/15 border-amber-500/40',
          gaugeGradient: 'from-amber-500 to-yellow-400',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          desc: 'Requiere atención preventiva en áreas clave.',
        };
      case 'Crítico':
      default:
        return {
          colorClass: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
          gaugeGradient: 'from-rose-500 to-red-600',
          icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
          desc: 'Puntaje crítico con desvíos recurrentes.',
        };
    }
  };

  const badgeConfig = getEstadoBadgeConfig(estadoGrupo);

  // SVG Gauge calculations
  const gaugeRadius = 78;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * gaugeRadius;
  const percentageNormalized = Math.min(100, Math.max(0, porcentajeGrupo));
  const strokeDashoffset = circumference - (percentageNormalized / 100) * circumference;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 md:p-8 shadow-2xl backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info & Status */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PUNTAJE GENERAL DEL GRUPO ZENOVA</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-mono">
                {puntajeGrupo.toFixed(1)}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-slate-400">/ 100 pts</span>
              <span className="text-lg font-semibold text-emerald-400 font-mono">
                ({porcentajeGrupo.toFixed(1)}%)
              </span>
            </div>

            {/* State Pill & Trend */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-sm font-bold border shadow-md ${badgeConfig.colorClass}`}
              >
                {badgeConfig.icon}
                <span>Estado: {estadoGrupo}</span>
              </div>

              {/* Trend Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-200">
                {tendencia === 'up' && (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                )}
                {tendencia === 'down' && (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                {tendencia === 'stable' && (
                  <Minus className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {variacionMesAnterior > 0 ? `+${variacionMesAnterior.toFixed(1)}` : variacionMesAnterior.toFixed(1)} pts
                  <span className="text-slate-400 font-normal ml-1">vs mes anterior</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            {badgeConfig.desc} Calculado como el promedio simple de las {totalEmpresasActivas} empresas activas y {totalAreasActivas} áreas evaluadas en {periodoNombre}.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Empresas</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">{totalEmpresasActivas}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Áreas Activas</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">{totalAreasActivas}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <ZapOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Desvíos Totales</span>
              </div>
              <div className="text-lg font-bold text-amber-300 mt-1">{totalDesviosPeriodo}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Puntos Restados</span>
              </div>
              <div className="text-lg font-bold text-rose-300 mt-1">-{totalPuntosDescontados} pts</div>
            </div>
          </div>
        </div>

        {/* Right Gauge Arc Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 200 200">
              {/* Gauge Background Track */}
              <circle
                cx="100"
                cy="100"
                r={gaugeRadius}
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Gauge Active Progress Arc */}
              <circle
                cx="100"
                cy="100"
                r={gaugeRadius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className={`text-emerald-400 transition-all duration-1000 ease-out`}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PUNTAJE</span>
              <span className="text-4xl font-extrabold text-white font-mono mt-0.5">
                {puntajeGrupo.toFixed(1)}
              </span>
              <span className="text-xs font-medium text-emerald-400 mt-0.5">Meta: 100.0</span>
            </div>
          </div>

          {/* Threshold Indicator Bar */}
          <div className="w-full max-w-xs mt-4 bg-slate-800 rounded-full h-2.5 p-0.5 flex items-center gap-0.5 border border-slate-700">
            <div className="h-full rounded-full bg-rose-500 w-[70%]" title="Crítico: <70" />
            <div className="h-full rounded-full bg-amber-500 w-[15%]" title="Alerta: 70-84" />
            <div className="h-full rounded-full bg-teal-500 w-[10%]" title="Bueno: 85-94" />
            <div className="h-full rounded-full bg-emerald-500 w-[5%]" title="Excelente: 95-100" />
          </div>
          <div className="flex justify-between w-full max-w-xs text-[10px] text-slate-400 mt-1 font-mono">
            <span>0</span>
            <span>70 (Alerta)</span>
            <span>85 (Bueno)</span>
            <span>95 (Excelente)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
