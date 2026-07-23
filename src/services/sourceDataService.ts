import {
  ConfigSheet,
  EmpresaSheet,
  AreaSheet,
  TipoDesvioSheet,
  RegistroDesvio,
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_EMPRESAS,
  INITIAL_AREAS,
  INITIAL_TIPOS_DESVIO,
  INITIAL_REGISTROS,
} from '../data/mockSheetData';

export interface DashboardSourceData {
  config: ConfigSheet;
  empresas: EmpresaSheet[];
  areas: AreaSheet[];
  tiposDesvio: TipoDesvioSheet[];
  registros: RegistroDesvio[];
}

export interface DataSourceStatus {
  mode: 'mock' | 'live';
  label: string;
  detail: string;
  lastUpdate?: string;
}

interface AppsScriptEmpresa { id: string; nombre: string; sede: string; activa?: boolean; orden?: number; }
interface AppsScriptArea { id: string; idEmpresa: string; nombre: string; activa?: boolean; orden?: number; }
interface AppsScriptTipo { id: string; tipo: string; icono?: string; activo?: boolean; orden?: number; }
interface AppsScriptRegistro {
  id?: string; timestamp?: string; empresa?: string; sede?: string; area?: string;
  idEmpresa?: string; idArea?: string; tipoDesvio?: string; puntosDescontados?: number;
  observaciones?: string; fotoUrl?: string;
}
interface AppsScriptPayload {
  config?: Partial<ConfigSheet>; ultimaActualizacion?: string; empresas?: AppsScriptEmpresa[];
  areas?: AppsScriptArea[]; tiposDesvio?: AppsScriptTipo[]; registros?: AppsScriptRegistro[];
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function cloneDefaults(): DashboardSourceData {
  return {
    config: { ...INITIAL_CONFIG },
    empresas: INITIAL_EMPRESAS.map((empresa) => ({ ...empresa })),
    areas: INITIAL_AREAS.map((area) => ({ ...area })),
    tiposDesvio: INITIAL_TIPOS_DESVIO.map((tipo) => ({ ...tipo })),
    registros: INITIAL_REGISTROS.map((registro) => ({ ...registro })),
  };
}

export function getDefaultDashboardSourceData(): DashboardSourceData { return cloneDefaults(); }

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseTimestamp(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value.replace(' ', 'T'));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getMonthName(date: Date): string { return MONTHS[date.getMonth()] || 'Julio'; }

function buildDataFromAppsScript(payload: AppsScriptPayload): DashboardSourceData {
  const empresas = (payload.empresas || []).map((empresa, index) => ({
    id: empresa.id, nombre: empresa.nombre.trim(), sede: empresa.sede.trim(), activa: empresa.activa !== false, orden: empresa.orden || index + 1,
  })).filter((empresa) => empresa.id && empresa.nombre);
  const areas = (payload.areas || []).map((area, index) => ({
    id: area.id, idEmpresa: area.idEmpresa, nombre: area.nombre.trim(), activa: area.activa !== false, orden: area.orden || index + 1,
  })).filter((area) => area.id && area.idEmpresa && area.nombre);
  const tiposDesvio = (payload.tiposDesvio || []).map((tipo, index) => ({
    id: tipo.id, tipo: tipo.tipo.trim(), icono: tipo.icono || 'alert-triangle', activo: tipo.activo !== false, orden: tipo.orden || index + 1,
  })).filter((tipo) => tipo.id && tipo.tipo);

  const defaults = cloneDefaults();
  const empresasFinales = empresas.length ? empresas : defaults.empresas;
  const areasFinales = areas.length ? areas : defaults.areas;
  const tiposFinales = tiposDesvio.length ? tiposDesvio : defaults.tiposDesvio;
  const registros = (payload.registros || []).map((item, index) => {
    const empresa = empresasFinales.find((candidate) => candidate.id === item.idEmpresa)
      || empresasFinales.find((candidate) => candidate.nombre.toLowerCase() === item.empresa?.trim().toLowerCase() && candidate.sede.toLowerCase() === item.sede?.trim().toLowerCase());
    const area = areasFinales.find((candidate) => candidate.id === item.idArea)
      || areasFinales.find((candidate) => candidate.idEmpresa === empresa?.id && candidate.nombre.toLowerCase() === item.area?.trim().toLowerCase());
    const parsedDate = parseTimestamp(item.timestamp) || new Date();
    const empresaNombre = empresa?.nombre || item.empresa?.trim() || 'Sin empresa';
    const sede = empresa?.sede || item.sede?.trim() || 'Sin sede';
    const areaNombre = area?.nombre || item.area?.trim() || 'Sin area';
    return {
      id: item.id?.trim() || `REG-${index + 1}`, timestamp: item.timestamp?.trim() || parsedDate.toISOString(), fecha: parsedDate.toISOString().slice(0, 10),
      mes: getMonthName(parsedDate), anio: parsedDate.getFullYear(), idEmpresa: empresa?.id || `EMP-${slugify(`${empresaNombre}-${sede}`)}`,
      empresaNombre, sede, idArea: area?.id || `AR-${slugify(`${empresaNombre}-${sede}-${areaNombre}`)}`, areaNombre,
      tipoDesvio: item.tipoDesvio?.trim() || 'Otro desvio energetico', cantidadDesvios: 1, puntosDescontados: Number(item.puntosDescontados) || 1,
      observacion: item.observaciones?.trim() || '', fotoUrl: item.fotoUrl?.trim() || '', mostrarFoto: item.fotoUrl ? 'Si' : 'No',
    } as RegistroDesvio;
  });
  return { config: { ...INITIAL_CONFIG, ...(payload.config || {}) }, empresas: empresasFinales, areas: areasFinales, tiposDesvio: tiposFinales, registros };
}

export async function loadDashboardSourceData(): Promise<{ sourceData: DashboardSourceData; sourceStatus: DataSourceStatus }> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_SCRIPT_URL?.trim();
  const useLiveData = import.meta.env.VITE_USE_LIVE_DATA === 'true';
  if (!scriptUrl || !useLiveData) return { sourceData: cloneDefaults(), sourceStatus: { mode: 'mock', label: 'Modo local', detail: '' } };
  try {
    const response = await fetch(scriptUrl, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Apps Script devolvio ${response.status}`);
    const payload = await response.json() as AppsScriptPayload;
    return { sourceData: buildDataFromAppsScript(payload), sourceStatus: { mode: 'live', label: 'Google Sheets conectado', detail: '', lastUpdate: payload.ultimaActualizacion } };
  } catch (error) {
    console.error('Fallo la carga remota, se mantiene el modo local.', error);
    return { sourceData: cloneDefaults(), sourceStatus: { mode: 'mock', label: 'Modo local por respaldo', detail: '' } };
  }
}
