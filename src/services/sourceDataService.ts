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

interface AppsScriptRegistro {
  id?: string;
  timestamp?: string;
  empresa?: string;
  sede?: string;
  area?: string;
  tipoDesvio?: string;
  observaciones?: string;
  fotoUrl?: string;
}

interface AppsScriptPayload {
  ultimaActualizacion?: string;
  registros?: AppsScriptRegistro[];
}

const PENALTY_BY_TYPE: Record<string, number> = {
  'Luz encendida sin necesidad': 1,
  'Aire acondicionado prendido fuera de horario': 2,
  'Cargador o equipo conectado sin uso': 1,
  'Motor / Compresor encendido sin actividad': 2,
  'Puerta o ventana abierta con aire encendido': 1,
  'Iluminacion de cartelera fuera de horario': 1,
  'Iluminación de cartelera fuera de horario': 1,
  'Computadora encendida sin uso': 1,
  'Monitor encendido sin uso': 1,
  'Aire fuera del rango permitido (24C)': 1,
  'Aire fuera del rango permitido (24°C)': 1,
  'Aire encendido con puerta/ventana abierta': 1,
  'Microondas enchufado innecesariamente': 1,
  'Pava electrica enchufada innecesariamente': 1,
  'Pava eléctrica enchufada innecesariamente': 1,
  'Cafetera enchufada innecesariamente': 1,
  'Equipo de taller conectado sin uso': 1,
  'Equipo de lavado conectado sin uso': 1,
  'Otro desvio energetico': 1,
  'Otro desvío energético': 1,
};

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function cloneDefaults(): DashboardSourceData {
  return {
    config: { ...INITIAL_CONFIG },
    empresas: INITIAL_EMPRESAS.map((empresa) => ({ ...empresa })),
    areas: INITIAL_AREAS.map((area) => ({ ...area })),
    tiposDesvio: INITIAL_TIPOS_DESVIO.map((tipo) => ({ ...tipo })),
    registros: INITIAL_REGISTROS.map((registro) => ({ ...registro })),
  };
}

export function getDefaultDashboardSourceData(): DashboardSourceData {
  return cloneDefaults();
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseTimestamp(value?: string): Date | null {
  if (!value) return null;

  const firstPass = new Date(value);
  if (!Number.isNaN(firstPass.getTime())) {
    return firstPass;
  }

  const secondPass = new Date(value.replace(' ', 'T'));
  if (!Number.isNaN(secondPass.getTime())) {
    return secondPass;
  }

  return null;
}

function getPenalty(tipoDesvio: string): number {
  return PENALTY_BY_TYPE[tipoDesvio] || 1;
}

function getMonthName(date: Date): string {
  return MONTHS[date.getMonth()] || 'Julio';
}

function buildDataFromAppsScript(payload: AppsScriptPayload): DashboardSourceData {
  const empresas = new Map<string, EmpresaSheet>();
  const areas = new Map<string, AreaSheet>();
  const tipos = new Map<string, TipoDesvioSheet>();
  const registros: RegistroDesvio[] = [];

  INITIAL_TIPOS_DESVIO.forEach((tipo) => {
    tipos.set(tipo.tipo, { ...tipo });
  });

  (payload.registros || []).forEach((item, index) => {
    const empresaNombre = toTitleCase(item.empresa || 'Sin empresa');
    const sede = toTitleCase(item.sede || 'Sin sede');
    const areaNombre = toTitleCase(item.area || 'Sin area');
    const tipoDesvio = item.tipoDesvio?.trim() || 'Otro desvio energetico';
    const observacion = item.observaciones?.trim() || '';
    const parsedDate = parseTimestamp(item.timestamp) || new Date('2026-07-21T12:00:00');
    const empresaId = `EMP-${slugify(`${empresaNombre}-${sede}`)}`;
    const areaId = `AR-${slugify(`${empresaNombre}-${sede}-${areaNombre}`)}`;

    if (!empresas.has(empresaId)) {
      empresas.set(empresaId, {
        id: empresaId,
        nombre: empresaNombre,
        sede,
        activa: true,
        orden: empresas.size + 1,
      });
    }

    if (!areas.has(areaId)) {
      areas.set(areaId, {
        id: areaId,
        idEmpresa: empresaId,
        nombre: areaNombre,
        activa: true,
        orden: areas.size + 1,
      });
    }

    if (!tipos.has(tipoDesvio)) {
      tipos.set(tipoDesvio, {
        id: `D-${slugify(tipoDesvio)}`,
        tipo: tipoDesvio,
        icono: 'alert-triangle',
        activo: true,
        orden: tipos.size + 1,
      });
    }

    registros.push({
      id: item.id?.trim() || `REG-${index + 1}`,
      timestamp: item.timestamp?.trim() || parsedDate.toISOString(),
      fecha: parsedDate.toISOString().slice(0, 10),
      mes: getMonthName(parsedDate),
      anio: parsedDate.getFullYear(),
      idEmpresa: empresaId,
      empresaNombre,
      sede,
      idArea: areaId,
      areaNombre,
      tipoDesvio,
      cantidadDesvios: 1,
      puntosDescontados: getPenalty(tipoDesvio),
      observacion,
      fotoUrl: item.fotoUrl?.trim() || '',
      mostrarFoto: item.fotoUrl ? 'Sí' as const : 'No' as const,
    });
  });

  return {
    config: { ...INITIAL_CONFIG },
    empresas: Array.from(empresas.values()),
    areas: Array.from(areas.values()),
    tiposDesvio: Array.from(tipos.values()),
    registros,
  };
}

export async function loadDashboardSourceData(): Promise<{
  sourceData: DashboardSourceData;
  sourceStatus: DataSourceStatus;
}> {
  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_SCRIPT_URL?.trim();
  const useLiveData = import.meta.env.VITE_USE_LIVE_DATA === 'true';

  if (!scriptUrl || !useLiveData) {
    return {
      sourceData: cloneDefaults(),
      sourceStatus: {
        mode: 'mock',
        label: 'Modo local',
        detail: 'Usando datos de ejemplo para trabajar sin depender de Google Sheets.',
      },
    };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Apps Script devolvio ${response.status}`);
    }

    const payload = (await response.json()) as AppsScriptPayload;
    const sourceData = buildDataFromAppsScript(payload);

    return {
      sourceData,
      sourceStatus: {
        mode: 'live',
        label: 'Google Sheets conectado',
        detail: `Leyendo ${sourceData.registros.length} auditorias desde Apps Script.`,
        lastUpdate: payload.ultimaActualizacion,
      },
    };
  } catch (error) {
    console.error('Fallo la carga remota, se mantiene el modo local.', error);

    return {
      sourceData: cloneDefaults(),
      sourceStatus: {
        mode: 'mock',
        label: 'Modo local por respaldo',
        detail: 'No se pudo leer Apps Script. La app sigue operativa con datos de ejemplo.',
      },
    };
  }
}
