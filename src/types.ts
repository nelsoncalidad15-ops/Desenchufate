export type EstadoPuntaje = 'Excelente' | 'Bueno' | 'Alerta' | 'Crítico';

export interface ConfigSheet {
  PUNTAJE_INICIAL: number;
  LIMITE_EXCELENTE: number;
  LIMITE_BUENO: number;
  LIMITE_ALERTA: number;
  NOMBRE_PROGRAMA: string;
  NOMBRE_GRUPO: string;
  MOSTRAR_FOTOS: string; // 'Sí' | 'No'
}

export interface EmpresaSheet {
  id: string;
  nombre: string;
  sede: string;
  activa: boolean;
  orden: number;
}

export interface AreaSheet {
  id: string;
  idEmpresa: string;
  nombre: string;
  activa: boolean;
  orden: number;
}

export interface TipoDesvioSheet {
  id: string;
  tipo: string;
  icono: string;
  activo: boolean;
  orden: number;
}

export interface RegistroDesvio {
  id: string;
  timestamp: string;
  fecha: string;
  mes: string;
  anio: number;
  idEmpresa: string;
  empresaNombre: string;
  sede: string;
  idArea: string;
  areaNombre: string;
  tipoDesvio: string;
  cantidadDesvios: number;
  puntosDescontados: number;
  observacion: string;
  fotoUrl?: string;
  mostrarFoto: 'Sí' | 'No';
}

export interface AreaCalculada {
  id: string;
  idEmpresa: string;
  empresaNombre: string;
  sede: string;
  areaNombre: string;
  puntaje: number;
  porcentaje: number;
  desviosCount: number;
  puntosDescontadosTotal: number;
  estado: EstadoPuntaje;
  variacion: number;
}

export interface EmpresaCalculada {
  id: string;
  nombre: string;
  sede: string;
  puntaje: number;
  porcentaje: number;
  desviosCount: number;
  areasCount: number;
  estado: EstadoPuntaje;
  posicion: number;
  variacionMensual: number;
  tendencia: 'up' | 'down' | 'stable';
  areas: AreaCalculada[];
}

export interface DesvioFrecuente {
  tipo: string;
  icono: string;
  cantidad: number;
  puntos: number;
  porcentajeTotal: number;
}

export interface EvolucionMensualData {
  mes: string;
  anio: number;
  label: string;
  grupoScore: number;
  empresasScores: Record<string, number>;
}

export interface FiltrosState {
  mes: string; // 'Todos' or specific month like 'Julio'
  anio: string; // 'Todos' or '2026'
  empresa: string; // 'Todas' or ID_EMPRESA
  sede: string; // 'Todas' or 'Jujuy' / 'Salta'
  area: string; // 'Todas' or ID_AREA
  estado: string; // 'Todos' or 'Excelente' | 'Bueno' | 'Alerta' | 'Crítico'
  tipoDesvio: string; // 'Todos' or string
  busqueda: string;
}

export interface ResumenGeneral {
  puntajeGrupo: number;
  porcentajeGrupo: number;
  estadoGrupo: EstadoPuntaje;
  variacionMesAnterior: number;
  tendencia: 'up' | 'down' | 'stable';
  totalEmpresasActivas: number;
  totalAreasActivas: number;
  totalDesviosPeriodo: number;
  totalPuntosDescontados: number;
  mejorEmpresa?: EmpresaCalculada;
  empresaMayorMejora?: EmpresaCalculada;
  areaDestacada?: AreaCalculada;
  empresaMasDesvios?: EmpresaCalculada;
  areaMasDesvios?: AreaCalculada;
  tipoDesvioMasFrecuente?: DesvioFrecuente;
}

export interface DashboardData {
  config: ConfigSheet;
  resumenGeneral: ResumenGeneral;
  empresas: EmpresaCalculada[];
  areas: AreaCalculada[];
  rankingEmpresas: EmpresaCalculada[];
  rankingAreas: AreaCalculada[];
  desviosRecurrentes: DesvioFrecuente[];
  evolucionMensual: EvolucionMensualData[];
  areasConMasDesvios: AreaCalculada[];
  ultimosRegistros: RegistroDesvio[];
  filtrosDisponibles: {
    meses: string[];
    anios: string[];
    sedes: string[];
    empresas: { id: string; nombre: string; sede: string }[];
    areas: { id: string; nombre: string; empresaNombre: string }[];
    tiposDesvio: string[];
  };
}
