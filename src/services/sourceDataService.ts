import {
  ConfigSheet,
  EmpresaSheet,
  AreaSheet,
  TipoDesvioSheet,
  RegistroDesvio,
  TipoControl,
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_EMPRESAS,
  INITIAL_AREAS,
  INITIAL_TIPOS_DESVIO,
  INITIAL_REGISTROS,
} from '../data/mockSheetData';
import { MONTHS } from '../utils/period';

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
  tipoControl?: string; turno?: 'Mañana' | 'Tarde'; auditoriaId?: string;
  observaciones?: string; fotoUrl?: string;
}
interface AppsScriptPayload {
  config?: Partial<ConfigSheet>; ultimaActualizacion?: string; empresas?: AppsScriptEmpresa[];
  areas?: AppsScriptArea[]; tiposDesvio?: AppsScriptTipo[]; registros?: AppsScriptRegistro[];
}

interface CachedLivePayload {
  sourceData: DashboardSourceData;
  lastUpdate?: string;
  cachedAt: string;
}

const LIVE_CACHE_KEY = 'desenchufate-live-cache-v3';

function cloneDefaults(): DashboardSourceData {
  return {
    config: { ...INITIAL_CONFIG },
    empresas: INITIAL_EMPRESAS.map((empresa) => ({ ...empresa })),
    areas: INITIAL_AREAS.map((area) => ({ ...area })),
    tiposDesvio: INITIAL_TIPOS_DESVIO.map((tipo) => ({ ...tipo })),
    registros: INITIAL_REGISTROS.map((registro) => ({ ...registro })),
  };
}

function getCachedLivePayload(): CachedLivePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LIVE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedLivePayload;
    if (!parsed?.sourceData) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCachedLivePayload(sourceData: DashboardSourceData, lastUpdate?: string) {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedLivePayload = {
      sourceData,
      lastUpdate,
      cachedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache write failures
  }
}

export function getDefaultDashboardSourceData(): DashboardSourceData {
  const cached = getCachedLivePayload();
  return cached?.sourceData || cloneDefaults();
}

export function getDefaultDataSourceStatus(): DataSourceStatus {
  const cached = getCachedLivePayload();
  if (cached) {
    return {
      mode: 'live',
      label: 'Google Sheets en cache',
      detail: 'Mostrando ultimo dato guardado mientras se actualiza en segundo plano.',
      lastUpdate: cached.lastUpdate,
    };
  }
  return { mode: 'mock', label: 'Modo local', detail: '' };
}

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// El ID de área debe ser único en todo el tablero. Se conserva el ID original
// de la planilla, pero se lo combina con su empresa para tolerar temporalmente
// planillas históricas con IDs repetidos entre sedes.
function areaKey(idEmpresa: string, idArea: string): string {
  return `${idEmpresa}::${idArea}`;
}

function parseTimestamp(value?: string): Date | null {
  if (!value) return null;
  const normalized = value.trim();
  const latinDateMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (latinDateMatch) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = latinDateMatch;
    const parsedLatinDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
    if (!Number.isNaN(parsedLatinDate.getTime())) return parsedLatinDate;
  }
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getMonthName(date: Date): string { return MONTHS[date.getMonth()] || 'Julio'; }

function normalizarTipoControl(value?: string): TipoControl {
  const normalized = value
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase() || '';

  if (normalized.includes('observ')) return 'Observacion';
  if (normalized.includes('apertura') || normalized.includes('antes') || normalized.includes('ingreso')) {
    return 'Puntuable - Apertura';
  }
  return 'Puntuable - Cierre';
}
function normalizarConfigPuntaje(config: ConfigSheet): ConfigSheet {
  if (config.PUNTAJE_INICIAL === 10 && config.LIMITE_EXCELENTE <= 10 && config.LIMITE_BUENO <= 10 && config.LIMITE_ALERTA <= 10) return config;
  return {
    ...config,
    PUNTAJE_INICIAL: 10,
    LIMITE_EXCELENTE: 10,
    LIMITE_BUENO: 9,
    LIMITE_ALERTA: 8,
  };
}

function buildDataFromAppsScript(payload: AppsScriptPayload): DashboardSourceData {
  const empresas = (payload.empresas || []).map((empresa, index) => ({
    id: empresa.id, nombre: empresa.nombre.trim(), sede: empresa.sede.trim(), activa: empresa.activa !== false, orden: empresa.orden || index + 1,
  })).filter((empresa) => empresa.id && empresa.nombre);
  const areas = (payload.areas || []).map((area, index) => ({
    id: areaKey(area.idEmpresa.trim(), area.id.trim()), idEmpresa: area.idEmpresa.trim(), nombre: area.nombre.trim(), activa: area.activa !== false, orden: area.orden || index + 1,
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
    const area = empresa && item.idArea
      ? areasFinales.find((candidate) => candidate.id === areaKey(empresa.id, item.idArea.trim()))
      : undefined;
    const areaByName = area
      || areasFinales.find((candidate) => candidate.idEmpresa === empresa?.id && candidate.nombre.toLowerCase() === item.area?.trim().toLowerCase());
    const parsedDate = parseTimestamp(item.timestamp) || new Date();
    const empresaNombre = empresa?.nombre || item.empresa?.trim() || 'Sin empresa';
    const sede = empresa?.sede || item.sede?.trim() || 'Sin sede';
    const areaNombre = areaByName?.nombre || item.area?.trim() || 'Sin area';
    const turno = item.turno || (parsedDate.getHours() < 14 ? 'Mañana' : 'Tarde');
    const idArea = areaByName?.id || `AR-${slugify(`${empresaNombre}-${sede}-${areaNombre}`)}`;
    return {
      id: item.id?.trim() || `REG-${index + 1}`, timestamp: item.timestamp?.trim() || parsedDate.toISOString(), fecha: parsedDate.toISOString().slice(0, 10),
      mes: getMonthName(parsedDate), anio: parsedDate.getFullYear(), idEmpresa: empresa?.id || `EMP-${slugify(`${empresaNombre}-${sede}`)}`,
      empresaNombre, sede, idArea, areaNombre, turno, auditoriaId: item.auditoriaId || `AUD-${parsedDate.toISOString().slice(0, 10)}-${turno === 'Mañana' ? 'MANANA' : 'TARDE'}-${idArea}`,
      tipoControl: normalizarTipoControl(item.tipoControl),
      tipoDesvio: item.tipoDesvio?.trim() || 'Otro desvio energetico', cantidadDesvios: 1, puntosDescontados: Number(item.puntosDescontados) || 1,
      observacion: item.observaciones?.trim() || '', fotoUrl: item.fotoUrl?.trim() || '', mostrarFoto: item.fotoUrl ? 'Si' : 'No',
    } as RegistroDesvio;
  });
  return { config: normalizarConfigPuntaje({ ...INITIAL_CONFIG, ...(payload.config || {}) }), empresas: empresasFinales, areas: areasFinales, tiposDesvio: tiposFinales, registros };
}

export async function loadDashboardSourceData(): Promise<{ sourceData: DashboardSourceData; sourceStatus: DataSourceStatus }> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_SCRIPT_URL?.trim();
  const useLiveData = import.meta.env.VITE_USE_LIVE_DATA === 'true';
  if (!scriptUrl || !useLiveData) return { sourceData: cloneDefaults(), sourceStatus: { mode: 'mock', label: 'Modo local', detail: '' } };
  try {
    const response = await fetch(scriptUrl, { method: 'GET', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Apps Script devolvio ${response.status}`);
    const payload = await response.json() as AppsScriptPayload;
    const sourceData = buildDataFromAppsScript(payload);
    saveCachedLivePayload(sourceData, payload.ultimaActualizacion);
    return { sourceData, sourceStatus: { mode: 'live', label: 'Google Sheets conectado', detail: '', lastUpdate: payload.ultimaActualizacion } };
  } catch (error) {
    console.error('Fallo la carga remota, se usa el ultimo dato guardado si existe.', error);
    const cached = getCachedLivePayload();
    if (cached) {
      return {
        sourceData: cached.sourceData,
        sourceStatus: {
          mode: 'live',
          label: 'Google Sheets en cache',
          detail: 'No se pudo refrescar en vivo. Se muestra el ultimo dato guardado.',
          lastUpdate: cached.lastUpdate,
        },
      };
    }
    return { sourceData: cloneDefaults(), sourceStatus: { mode: 'mock', label: 'Modo local por respaldo', detail: '' } };
  }
}
