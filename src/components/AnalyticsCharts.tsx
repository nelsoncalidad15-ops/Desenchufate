import React, { useState } from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import {
  EmpresaCalculada,
  DesvioFrecuente,
  EvolucionMensualData,
  AreaCalculada,
} from '../types';

interface AnalyticsChartsProps {
  empresas: EmpresaCalculada[];
  desviosRecurrentes: DesvioFrecuente[];
  evolucionMensual: EvolucionMensualData[];
  areasConMasDesvios: AreaCalculada[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white shadow-xl">
        <p className="font-bold text-slate-200">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium text-slate-400">{payload[0].name || 'Valor'}:</span>
          <span className="font-mono font-bold text-emerald-400">{payload[0].value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  empresas,
  desviosRecurrentes,
  evolucionMensual,
  areasConMasDesvios,
}) => {
  const [selectedCompanyTrend, setSelectedCompanyTrend] = useState<string>('Grupo');

  const companyChartData = [...empresas]
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((e) => ({
      name: `${e.nombre} (${e.sede})`,
      puntaje: Number(e.puntaje.toFixed(1)),
      desvios: e.desviosCount,
      estado: e.estado,
    }));

  const desviosChartData = desviosRecurrentes.slice(0, 5).map((d) => ({
    tipo: d.tipo.length > 22 ? d.tipo.substring(0, 22) + '...' : d.tipo,
    fullTipo: d.tipo,
    cantidad: d.cantidad,
  }));

  const companyNamesForTrend = empresas.map((e) => `${e.nombre} (${e.sede})`);
  const trendChartData = evolucionMensual.map((item) => {
    const row: Record<string, any> = {
      label: item.label,
      Grupo: item.grupoScore,
    };
    companyNamesForTrend.forEach((name) => {
      row[name] = item.empresasScores[name] ?? 100;
    });
    return row;
  });

  const problemAreasData = areasConMasDesvios.slice(0, 5).map((a) => ({
    shortName: a.areaNombre,
    desvios: a.desviosCount,
    puntosLost: a.puntosDescontadosTotal,
  }));

  const getBarColor = (score: number) => {
    if (score >= 95) return '#065F46';
    if (score >= 85) return '#047857';
    if (score >= 70) return '#D97706';
    return '#B91C1C';
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900">
          <BarChart3 className="h-4 w-4 text-slate-700" />
          Analisis e Indicadores
        </h3>
        <span className="text-xs font-mono text-slate-500">Metricas consolidadas</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Zap className="h-3.5 w-3.5 text-slate-600" /> Desempeno General por Sede
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500">Porcentaje de cumplimiento (Meta: 100%)</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={companyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="puntaje" radius={[4, 4, 0, 0]} barSize={28}>
                  {companyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.puntaje)} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <AlertCircle className="h-3.5 w-3.5 text-slate-600" /> Tipos de Desvio Frecuentes
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500">Conteo de hallazgos registrados</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart layout="vertical" data={desviosChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="tipo" type="category" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" fill="#334155" radius={[0, 4, 4, 0]} barSize={16} name="Casos" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <TrendingUp className="h-3.5 w-3.5 text-slate-600" /> Tendencia Historica
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500">Evolucion mensual del cumplimiento</p>
            </div>

            <select
              value={selectedCompanyTrend}
              onChange={(e) => setSelectedCompanyTrend(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none transition-colors hover:bg-slate-100"
            >
              <option value="Grupo">Promedio General</option>
              {companyNamesForTrend.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData} margin={{ top: 10, right: 20, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis domain={[70, 100]} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey={selectedCompanyTrend} stroke="#0F172A" strokeWidth={2} dot={{ r: 3.5, fill: '#0F172A' }} activeDot={{ r: 5, fill: '#047857' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <AlertCircle className="h-3.5 w-3.5 text-slate-600" /> Areas con Mayor Oportunidad
              </h4>
              <p className="mt-0.5 text-[11px] text-slate-500">Areas que requieren mayor atencion operativa</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={problemAreasData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="shortName" stroke="#64748b" fontSize={10} tickLine={false} axisLine={{ stroke: '#cbd5e1' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="desvios" fill="#991B1B" radius={[4, 4, 0, 0]} barSize={28} name="Desvios" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
