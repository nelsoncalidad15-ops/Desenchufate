import React, { useMemo } from 'react';
import { AlertTriangle, Building2, CheckCircle2, FileText, Image as ImageIcon, MapPin, Printer, X, Zap } from 'lucide-react';
import { DashboardData, FiltrosState } from '../types';

interface ExecutiveReportProps {
  dashboard: DashboardData;
  filtros: FiltrosState;
  generatedAt: Date;
  onClose: () => void;
}

const scoreTone = (score: number) => {
  if (score >= 10) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (score >= 9) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
  if (score >= 8) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-rose-100 text-rose-800 border-rose-200';
};

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ dashboard, filtros, generatedAt, onClose }) => {
  const { resumenGeneral: resumen, filtrosDisponibles } = dashboard;

  const filterSummary = useMemo(() => {
    const empresa = filtrosDisponibles.empresas.find((item) => item.id === filtros.empresa)?.nombre;
    const area = filtrosDisponibles.areas.find((item) => item.id === filtros.area);
    return [
      `Período: ${filtros.mes} ${filtros.anio}`,
      filtros.sede !== 'Todas' ? `Sede: ${filtros.sede}` : null,
      empresa ? `Empresa: ${empresa}` : null,
      area ? `Área: ${area.nombre}` : null,
      filtros.estado !== 'Todos' ? `Estado: ${filtros.estado}` : null,
      filtros.tipoDesvio !== 'Todos' ? `Desvío: ${filtros.tipoDesvio}` : null,
      filtros.busqueda.trim() ? `Búsqueda: ${filtros.busqueda.trim()}` : null,
    ].filter(Boolean) as string[];
  }, [filtros, filtrosDisponibles]);

  const criticalAreas = [...dashboard.areas]
    .sort((a, b) => b.desviosCount - a.desviosCount || a.puntaje - b.puntaje)
    .filter((area) => area.desviosCount > 0)
    .slice(0, 10);
  const records = dashboard.ultimosRegistros.slice(0, 30);
  const topDeviation = dashboard.desviosRecurrentes[0];
  const focusArea = criticalAreas[0];
  const periodName = `${filtros.mes} ${filtros.anio}`;

  return (
    <div id="executive-report-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6 print:static print:overflow-visible print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2 text-slate-700">
            <FileText className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-black">Vista previa del informe</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white transition hover:bg-emerald-700">
              <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
            </button>
            <button onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Cerrar informe">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <article id="executive-report" className="print-report p-6 text-slate-900 sm:p-10">
          <header className="overflow-hidden rounded-3xl bg-slate-950 text-white print:rounded-2xl">
            <div className="relative p-7 sm:p-9">
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    <Zap className="h-3.5 w-3.5" /> Informe ejecutivo
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">DESENCHUFATE</h1>
                  <p className="mt-2 text-sm text-slate-300">Control de eficiencia energética · Grupo Cenoa</p>
                </div>
                <div className="border-l border-white/15 pl-4 text-left sm:text-right sm:border-l-0 sm:border-r sm:pl-0 sm:pr-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Período analizado</p>
                  <p className="mt-1 text-lg font-black text-white">{periodName}</p>
                  <p className="mt-2 text-xs text-slate-400">Emitido: {generatedAt.toLocaleDateString('es-AR')} · {generatedAt.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Alcance del informe · filtros aplicados</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {filterSummary.map((filter) => <span key={filter} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">{filter}</span>)}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Puntaje', value: `${resumen.porcentajeGrupo.toFixed(1)}%`, detail: resumen.estadoGrupo, tone: 'text-emerald-700' },
              { label: 'Hallazgos', value: resumen.totalDesviosPeriodo, detail: 'en el alcance', tone: 'text-rose-700' },
              { label: 'Áreas evaluadas', value: resumen.totalAreasActivas, detail: 'con filtros aplicados', tone: 'text-slate-900' },
              { label: 'Áreas con acción', value: resumen.totalAreasPenalizadas, detail: 'con desvíos puntuables', tone: 'text-amber-700' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
                <p className={`mt-2 font-mono text-2xl font-black ${metric.tone}`}>{metric.value}</p>
                <p className="mt-1 text-[11px] font-medium text-slate-500">{metric.detail}</p>
              </div>
            ))}
          </section>

          <section className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="mt-2 text-xs font-black text-emerald-900">Lectura ejecutiva</p>
              <p className="mt-1 text-xs leading-relaxed text-emerald-800">El alcance evaluado se ubica en estado <strong>{resumen.estadoGrupo}</strong>, con un puntaje de {resumen.puntajeGrupo.toFixed(1)}/10.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <p className="mt-2 text-xs font-black text-amber-900">Principal hallazgo</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-800">{topDeviation ? <><strong>{topDeviation.tipo}</strong> concentra {topDeviation.cantidad} registro{topDeviation.cantidad === 1 ? '' : 's'}.</> : 'No se registran desvíos en el alcance seleccionado.'}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <Building2 className="h-5 w-5 text-rose-600" />
              <p className="mt-2 text-xs font-black text-rose-900">Foco de gestión</p>
              <p className="mt-1 text-xs leading-relaxed text-rose-800">{focusArea ? <><strong>{focusArea.empresaNombre} · {focusArea.areaNombre}</strong> presenta {focusArea.desviosCount} hallazgo{focusArea.desviosCount === 1 ? '' : 's'}.</> : 'No hay áreas con hallazgos dentro del alcance.'}</p>
            </div>
          </section>

          <section className="mt-8 print:break-inside-avoid">
            <div className="flex items-end justify-between border-b-2 border-slate-900 pb-2">
              <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Priorización</p><h2 className="text-xl font-black">Áreas que requieren seguimiento</h2></div>
              <span className="text-xs font-bold text-slate-500">{criticalAreas.length} áreas con hallazgos</span>
            </div>
            {criticalAreas.length ? (
              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs"><thead className="bg-slate-950 text-white"><tr><th className="px-3 py-2.5 font-bold">Empresa / sede</th><th className="px-3 py-2.5 font-bold">Área</th><th className="px-3 py-2.5 text-center font-bold">Puntaje</th><th className="px-3 py-2.5 text-center font-bold">Hallazgos</th><th className="px-3 py-2.5 text-center font-bold">Estado</th></tr></thead><tbody>
                  {criticalAreas.map((area) => <tr key={`${area.id}-${area.idEmpresa}`} className="border-t border-slate-200"><td className="px-3 py-2.5 font-bold">{area.empresaNombre}<span className="block font-normal text-slate-500">{area.sede}</span></td><td className="px-3 py-2.5">{area.areaNombre}</td><td className="px-3 py-2.5 text-center font-mono font-black">{area.puntaje.toFixed(1)}</td><td className="px-3 py-2.5 text-center font-black text-rose-700">{area.desviosCount}</td><td className="px-3 py-2.5 text-center"><span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black ${scoreTone(area.puntaje)}`}>{area.estado}</span></td></tr>)}
                </tbody></table>
              </div>
            ) : <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">No se registran hallazgos para los filtros seleccionados.</p>}
          </section>

          <section className="mt-8 print:break-before-page">
            <div className="flex items-end justify-between border-b-2 border-slate-900 pb-2"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Evidencia y trazabilidad</p><h2 className="text-xl font-black">Bitácora de hallazgos</h2></div><span className="text-xs font-bold text-slate-500">{dashboard.ultimosRegistros.length} registros</span></div>
            {records.length ? <div className="mt-3 space-y-2.5">{records.map((record) => <div key={record.id} className="break-inside-avoid rounded-xl border border-slate-200 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-1.5 text-xs font-black"><MapPin className="h-3.5 w-3.5 text-emerald-600" />{record.empresaNombre} · {record.sede} · {record.areaNombre}</div><div className="text-[11px] font-mono font-bold text-slate-500">{record.fecha} · {record.turno || '—'}</div></div><div className="mt-2 flex flex-wrap items-center gap-2"><span className="rounded-md bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-800">{record.tipoDesvio}</span><span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{record.tipoControl}</span>{record.fotoUrl && <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700"><ImageIcon className="h-3 w-3" /> Evidencia fotográfica adjunta</span>}</div>{record.observacion && <p className="mt-2 text-xs leading-relaxed text-slate-600">{record.observacion}</p>}</div>)}</div> : <p className="mt-3 text-sm text-slate-500">No hay registros para mostrar.</p>}
            {dashboard.ultimosRegistros.length > records.length && <p className="mt-3 text-xs italic text-slate-500">Se muestran los primeros {records.length} registros para conservar una impresión ejecutiva. El tablero contiene el detalle completo.</p>}
          </section>

          <footer className="mt-10 border-t border-slate-200 pt-4 text-[10px] text-slate-500"><strong className="text-slate-700">DESENCHUFATE · Grupo Cenoa.</strong> Informe generado desde el tablero de control energético. Los resultados corresponden exclusivamente al alcance indicado en los filtros.</footer>
        </article>
      </div>
    </div>
  );
};
