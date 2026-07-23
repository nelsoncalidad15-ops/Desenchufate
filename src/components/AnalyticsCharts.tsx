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
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
        <p className="font-bold text-slate-200">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400 font-medium">{payload[0].name || 'Valor'}:</span>
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

  // Sophisticated executive color palette (Monochrome charcoal + muted emerald/amber)
  const getBarColor = (score: number) => {
    if (score >= 95) return '#065F46'; // Deep Forest Emerald
    if (score >= 85) return '#047857'; // Elegant Green
    if (score >= 70) return '#D97706'; // Muted Amber
    return '#B91C1C'; // Deep Carmine
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-700" />
          Análisis e Indicadores
        </h3>
        <span className="text-xs font-mono text-slate-500">Métricas consolidadas</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Puntaje por Empresa */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-600" /> Desempeño General por Sede
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Puntaje ponderado (Meta: 100 pts)</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={companyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
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

        {/* Chart 2: Desvíos Recurrentes */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> Tipos de Desvío Frecuentes
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Conteo de hallazgos registrados</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart
                layout="vertical"
                data={desviosChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="tipo"
                  type="category"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" fill="#334155" radius={[0, 4, 4, 0]} barSize={16} name="Casos" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Evolución Mensual */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-600" /> Tendencia Histórica
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Evolución mensual del puntaje</p>
            </div>

            <select
              value={selectedCompanyTrend}
              onChange={(e) => setSelectedCompanyTrend(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
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
                <Line
                  type="monotone"
                  dataKey={selectedCompanyTrend}
                  stroke="#0F172A"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#0F172A' }}
                  activeDot={{ r: 5, fill: '#047857' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Áreas con Mayor Incidencia */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> Áreas con Mayor Oportunidad
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Áreas que requieren mayor atención operativa</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={problemAreasData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="desvios" fill="#991B1B" radius={[4, 4, 0, 0]} barSize={28} name="Desvíos" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
