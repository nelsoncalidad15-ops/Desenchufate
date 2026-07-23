import {
  ConfigSheet,
  EmpresaSheet,
  AreaSheet,
  TipoDesvioSheet,
  RegistroDesvio,
  FiltrosState,
  DashboardData,
  AreaCalculada,
  EmpresaCalculada,
  DesvioFrecuente,
  EvolucionMensualData,
  EstadoPuntaje,
  ResumenGeneral,
} from '../types';

import {
  INITIAL_CONFIG,
  INITIAL_EMPRESAS,
  INITIAL_AREAS,
  INITIAL_TIPOS_DESVIO,
  INITIAL_REGISTROS,
} from '../data/mockSheetData';

// Helper to determine score state
export function getEstadoPuntaje(score: number, config: ConfigSheet): EstadoPuntaje {
  if (score >= config.LIMITE_EXCELENTE) return 'Excelente';
  if (score >= config.LIMITE_BUENO) return 'Bueno';
  if (score >= config.LIMITE_ALERTA) return 'Alerta';
  return 'Crítico';
}

// Calculate the full dashboard object from raw sheet data and filters
export function calculateDashboardData(
  config: ConfigSheet = INITIAL_CONFIG,
  empresasRaw: EmpresaSheet[] = INITIAL_EMPRESAS,
  areasRaw: AreaSheet[] = INITIAL_AREAS,
  tiposDesvioRaw: TipoDesvioSheet[] = INITIAL_TIPOS_DESVIO,
  registrosRaw: RegistroDesvio[] = INITIAL_REGISTROS,
  filtros: FiltrosState = {
    mes: 'Julio',
    anio: '2026',
    empresa: 'Todas',
    sede: 'Todas',
    area: 'Todas',
    estado: 'Todos',
    tipoDesvio: 'Todos',
    busqueda: '',
  }
): DashboardData {
  const activeEmpresasRaw = empresasRaw.filter((e) => e.activa);
  const activeAreasRaw = areasRaw.filter((a) => a.activa);

  // 1. Filter raw audit log entries
  const registrosFiltrados = registrosRaw.filter((reg) => {
    if (filtros.mes !== 'Todos' && reg.mes.toLowerCase() !== filtros.mes.toLowerCase()) return false;
    if (filtros.anio !== 'Todos' && String(reg.anio) !== filtros.anio) return false;
    if (filtros.empresa !== 'Todas' && reg.idEmpresa !== filtros.empresa) return false;
    if (filtros.sede !== 'Todas' && reg.sede.toLowerCase() !== filtros.sede.toLowerCase()) return false;
    if (filtros.area !== 'Todas' && reg.idArea !== filtros.area) return false;
    if (filtros.tipoDesvio !== 'Todos' && reg.tipoDesvio !== filtros.tipoDesvio) return false;
    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      const q = filtros.busqueda.toLowerCase();
      const textMatch =
        reg.empresaNombre.toLowerCase().includes(q) ||
        reg.areaNombre.toLowerCase().includes(q) ||
        reg.tipoDesvio.toLowerCase().includes(q) ||
        reg.observacion.toLowerCase().includes(q) ||
        reg.sede.toLowerCase().includes(q);
      if (!textMatch) return false;
    }
    return true;
  });

  // Previous month filter for MoM comparison calculation
  const mesAnteriorMap: Record<string, string> = {
    'Julio': 'Junio',
    'Junio': 'Mayo',
    'Mayo': 'Abril',
    'Abril': 'Marzo',
    'Marzo': 'Febrero',
    'Febrero': 'Enero',
  };
  const mesAnteriorName = filtros.mes !== 'Todos' ? (mesAnteriorMap[filtros.mes] || 'Junio') : 'Junio';
  const registrosMesAnterior = registrosRaw.filter((reg) => {
    if (reg.mes.toLowerCase() !== mesAnteriorName.toLowerCase()) return false;
    if (filtros.anio !== 'Todos' && String(reg.anio) !== filtros.anio) return false;
    if (filtros.empresa !== 'Todas' && reg.idEmpresa !== filtros.empresa) return false;
    if (filtros.sede !== 'Todas' && reg.sede.toLowerCase() !== filtros.sede.toLowerCase()) return false;
    return true;
  });

  // Helper to compute area score
  const computeAreaCalculada = (
    area: AreaSheet,
    empresaObj: EmpresaSheet,
    regsList: RegistroDesvio[]
  ): AreaCalculada => {
    const areaRegs = regsList.filter((r) => r.idArea === area.id);
    const puntosDescontadosTotal = areaRegs.reduce((sum, r) => sum + (r.puntosDescontados || 1), 0);
    const score = Math.max(0, config.PUNTAJE_INICIAL - puntosDescontadosTotal);
    const porcentaje = Math.round((score / config.PUNTAJE_INICIAL) * 100 * 10) / 10;
    const estado = getEstadoPuntaje(score, config);

    return {
      id: area.id,
      idEmpresa: area.idEmpresa,
      empresaNombre: empresaObj.nombre,
      sede: empresaObj.sede,
      areaNombre: area.nombre,
      puntaje: score,
      porcentaje,
      desviosCount: areaRegs.reduce((sum, r) => sum + (r.cantidadDesvios || 1), 0),
      puntosDescontadosTotal,
      estado,
      variacion: 0,
    };
  };

  // 2. Compute current area scores
  const allAreasCalculadas: AreaCalculada[] = [];
  activeAreasRaw.forEach((area) => {
    const emp = activeEmpresasRaw.find((e) => e.id === area.idEmpresa);
    if (emp) {
      // Check company & sede filter matching
      if (filtros.empresa !== 'Todas' && emp.id !== filtros.empresa) return;
      if (filtros.sede !== 'Todas' && emp.sede.toLowerCase() !== filtros.sede.toLowerCase()) return;
      if (filtros.area !== 'Todas' && area.id !== filtros.area) return;

      const calcArea = computeAreaCalculada(area, emp, registrosFiltrados);

      // Status filter check
      if (filtros.estado !== 'Todos' && calcArea.estado !== filtros.estado) return;

      allAreasCalculadas.push(calcArea);
    }
  });

  // Compute area scores for previous month for variation
  const prevMonthAreasMap: Record<string, number> = {};
  activeAreasRaw.forEach((area) => {
    const emp = activeEmpresasRaw.find((e) => e.id === area.idEmpresa);
    if (emp) {
      const prevCalc = computeAreaCalculada(area, emp, registrosMesAnterior);
      prevMonthAreasMap[area.id] = prevCalc.puntaje;
    }
  });

  // Attach variations to current areas
  allAreasCalculadas.forEach((a) => {
    const prevScore = prevMonthAreasMap[a.id] ?? config.PUNTAJE_INICIAL;
    a.variacion = Math.round((a.puntaje - prevScore) * 10) / 10;
  });

  // 3. Compute Company Scores
  const empresasCalculadasMap = new Map<string, EmpresaCalculada>();

  activeEmpresasRaw.forEach((emp) => {
    // Check filters
    if (filtros.empresa !== 'Todas' && emp.id !== filtros.empresa) return;
    if (filtros.sede !== 'Todas' && emp.sede.toLowerCase() !== filtros.sede.toLowerCase()) return;

    const companyAreas = allAreasCalculadas.filter((a) => a.idEmpresa === emp.id);

    // If company filter is not explicitly filtering out areas
    if (companyAreas.length === 0 && (filtros.area !== 'Todas' || filtros.estado !== 'Todos')) {
      return; // skipped because no area matches specific area/estado filter
    }

    const areaScores = companyAreas.map((a) => a.puntaje);
    const sumScores = areaScores.reduce((a, b) => a + b, 0);
    const avgScore = companyAreas.length > 0 ? Math.round((sumScores / companyAreas.length) * 10) / 10 : config.PUNTAJE_INICIAL;
    const porcentaje = Math.round((avgScore / config.PUNTAJE_INICIAL) * 100 * 10) / 10;
    const estado = getEstadoPuntaje(avgScore, config);

    // MoM company calculation
    const prevCompanyAreas = activeAreasRaw
      .filter((a) => a.idEmpresa === emp.id)
      .map((a) => prevMonthAreasMap[a.id] ?? config.PUNTAJE_INICIAL);
    const prevAvg = prevCompanyAreas.length > 0
      ? Math.round((prevCompanyAreas.reduce((a, b) => a + b, 0) / prevCompanyAreas.length) * 10) / 10
      : config.PUNTAJE_INICIAL;
    const variacionMensual = Math.round((avgScore - prevAvg) * 10) / 10;

    let tendencia: 'up' | 'down' | 'stable' = 'stable';
    if (variacionMensual > 0.1) tendencia = 'up';
    else if (variacionMensual < -0.1) tendencia = 'down';

    const totalDesviosCompany = companyAreas.reduce((sum, a) => sum + a.desviosCount, 0);

    empresasCalculadasMap.set(emp.id, {
      id: emp.id,
      nombre: emp.nombre,
      sede: emp.sede,
      puntaje: avgScore,
      porcentaje,
      desviosCount: totalDesviosCompany,
      areasCount: companyAreas.length,
      estado,
      posicion: 0, // set later after sorting
      variacionMensual,
      tendencia,
      areas: companyAreas,
    });
  });

  // Convert to array and calculate position ranking
  const empresasList = Array.from(empresasCalculadasMap.values()).sort((a, b) => b.puntaje - a.puntaje);
  empresasList.forEach((emp, idx) => {
    emp.posicion = idx + 1;
  });

  // 4. Group Cenoa overall score
  const companyScores = empresasList.map((e) => e.puntaje);
  const puntajeGrupo = companyScores.length > 0
    ? Math.round((companyScores.reduce((a, b) => a + b, 0) / companyScores.length) * 10) / 10
    : config.PUNTAJE_INICIAL;
  const porcentajeGrupo = Math.round((puntajeGrupo / config.PUNTAJE_INICIAL) * 100 * 10) / 10;
  const estadoGrupo = getEstadoPuntaje(puntajeGrupo, config);

  // Group MoM variation
  const prevCompanyScores = activeEmpresasRaw.map((emp) => {
    const prevCompanyAreas = activeAreasRaw
      .filter((a) => a.idEmpresa === emp.id)
      .map((a) => prevMonthAreasMap[a.id] ?? config.PUNTAJE_INICIAL);
    return prevCompanyAreas.length > 0
      ? prevCompanyAreas.reduce((a, b) => a + b, 0) / prevCompanyAreas.length
      : config.PUNTAJE_INICIAL;
  });
  const prevGrupoScore = prevCompanyScores.length > 0
    ? prevCompanyScores.reduce((a, b) => a + b, 0) / prevCompanyScores.length
    : config.PUNTAJE_INICIAL;
  const variacionGrupo = Math.round((puntajeGrupo - prevGrupoScore) * 10) / 10;

  let tendenciaGrupo: 'up' | 'down' | 'stable' = 'stable';
  if (variacionGrupo > 0.1) tendenciaGrupo = 'up';
  else if (variacionGrupo < -0.1) tendenciaGrupo = 'down';

  // 5. Compute Deviation Breakdown (Desvíos más recurrentes)
  const desvioCountsMap: Record<string, { cantidad: number; puntos: number; icono: string }> = {};
  tiposDesvioRaw.forEach((td) => {
    desvioCountsMap[td.tipo] = { cantidad: 0, puntos: 0, icono: td.icono };
  });

  let totalDesviosPeriodo = 0;
  let totalPuntosDescontados = 0;

  registrosFiltrados.forEach((r) => {
    const qty = r.cantidadDesvios || 1;
    const pts = r.puntosDescontados || 1;
    totalDesviosPeriodo += qty;
    totalPuntosDescontados += pts;

    if (!desvioCountsMap[r.tipoDesvio]) {
      desvioCountsMap[r.tipoDesvio] = { cantidad: 0, puntos: 0, icono: 'alert-triangle' };
    }
    desvioCountsMap[r.tipoDesvio].cantidad += qty;
    desvioCountsMap[r.tipoDesvio].puntos += pts;
  });

  const desviosRecurrentes: DesvioFrecuente[] = Object.entries(desvioCountsMap)
    .map(([tipo, data]) => ({
      tipo,
      icono: data.icono,
      cantidad: data.cantidad,
      puntos: data.puntos,
      porcentajeTotal: totalDesviosPeriodo > 0 ? Math.round((data.cantidad / totalDesviosPeriodo) * 100) : 0,
    }))
    .filter((d) => d.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad);

  // 6. Highlights / KPIs
  const mejorEmpresa = empresasList.length > 0 ? empresasList[0] : undefined;

  // Most improved company
  const sortedByMejora = [...empresasList].sort((a, b) => b.variacionMensual - a.variacionMensual);
  const empresaMayorMejora = sortedByMejora.length > 0 && sortedByMejora[0].variacionMensual > 0 ? sortedByMejora[0] : empresasList[0];

  // Top Area
  const sortedAreas = [...allAreasCalculadas].sort((a, b) => b.puntaje - a.puntaje);
  const areaDestacada = sortedAreas.length > 0 ? sortedAreas[0] : undefined;

  // Company with most deviations
  const sortedByDesviosComp = [...empresasList].sort((a, b) => b.desviosCount - a.desviosCount);
  const empresaMasDesvios = sortedByDesviosComp.length > 0 ? sortedByDesviosComp[0] : undefined;

  // Area with most deviations
  const sortedByDesviosArea = [...allAreasCalculadas].sort((a, b) => b.desviosCount - a.desviosCount);
  const areaMasDesvios = sortedByDesviosArea.length > 0 ? sortedByDesviosArea[0] : undefined;

  const tipoDesvioMasFrecuente = desviosRecurrentes.length > 0 ? desviosRecurrentes[0] : undefined;

  // 7. Rankings
  const rankingEmpresas = [...empresasList];
  const rankingAreas = [...sortedAreas];
  const areasConMasDesvios = [...sortedByDesviosArea].slice(0, 8);

  // 8. Monthly score evolution (last 6 months)
  const mesesOrden: { mes: string; anio: number }[] = [
    { mes: 'Febrero', anio: 2026 },
    { mes: 'Marzo', anio: 2026 },
    { mes: 'Abril', anio: 2026 },
    { mes: 'Mayo', anio: 2026 },
    { mes: 'Junio', anio: 2026 },
    { mes: 'Julio', anio: 2026 },
  ];

  const evolucionMensual: EvolucionMensualData[] = mesesOrden.map(({ mes, anio }) => {
    const regsMes = registrosRaw.filter((r) => r.mes.toLowerCase() === mes.toLowerCase() && r.anio === anio);

    // Compute company scores for this month
    const compScoresMap: Record<string, number> = {};
    activeEmpresasRaw.forEach((emp) => {
      const empAreas = activeAreasRaw.filter((a) => a.idEmpresa === emp.id);
      const empAreaScores = empAreas.map((area) => {
        const areaRegs = regsMes.filter((r) => r.idArea === area.id);
        const pts = areaRegs.reduce((sum, r) => sum + (r.puntosDescontados || 1), 0);
        return Math.max(0, config.PUNTAJE_INICIAL - pts);
      });
      const avg = empAreaScores.length > 0
        ? Math.round((empAreaScores.reduce((a, b) => a + b, 0) / empAreaScores.length) * 10) / 10
        : config.PUNTAJE_INICIAL;
      compScoresMap[`${emp.nombre} (${emp.sede})`] = avg;
    });

    const cValues = Object.values(compScoresMap);
    const gScore = cValues.length > 0
      ? Math.round((cValues.reduce((a, b) => a + b, 0) / cValues.length) * 10) / 10
      : config.PUNTAJE_INICIAL;

    return {
      mes,
      anio,
      label: `${mes.slice(0, 3)} ${anio}`,
      grupoScore: gScore,
      empresasScores: compScoresMap,
    };
  });

  // 9. Available filter choices
  const mesesDisponibles = ['Todos', 'Julio', 'Junio', 'Mayo', 'Abril', 'Marzo', 'Febrero'];
  const aniosDisponibles = ['2026', 'Todos'];
  const sedesDisponibles = ['Todas', 'Jujuy', 'Salta'];
  const empresasListFiltro = activeEmpresasRaw.map((e) => ({
    id: e.id,
    nombre: `${e.nombre} - ${e.sede}`,
    sede: e.sede,
  }));
  const areasListFiltro = activeAreasRaw.map((a) => {
    const parentEmp = activeEmpresasRaw.find((e) => e.id === a.idEmpresa);
    return {
      id: a.id,
      nombre: a.nombre,
      empresaNombre: parentEmp ? `${parentEmp.nombre} (${parentEmp.sede})` : '',
    };
  });
  const tiposDesvioListFiltro = ['Todos', ...tiposDesvioRaw.filter((t) => t.activo).map((t) => t.tipo)];

  const resumenGeneral: ResumenGeneral = {
    puntajeGrupo,
    porcentajeGrupo,
    estadoGrupo,
    variacionMesAnterior: variacionGrupo,
    tendencia: tendenciaGrupo,
    totalEmpresasActivas: activeEmpresasRaw.length,
    totalAreasActivas: activeAreasRaw.length,
    totalDesviosPeriodo,
    totalPuntosDescontados,
    mejorEmpresa,
    empresaMayorMejora,
    areaDestacada,
    empresaMasDesvios,
    areaMasDesvios,
    tipoDesvioMasFrecuente,
  };

  return {
    config,
    resumenGeneral,
    empresas: empresasList,
    areas: allAreasCalculadas,
    rankingEmpresas,
    rankingAreas,
    desviosRecurrentes,
    evolucionMensual,
    areasConMasDesvios,
    ultimosRegistros: registrosFiltrados,
    filtrosDisponibles: {
      meses: mesesDisponibles,
      anios: aniosDisponibles,
      sedes: sedesDisponibles,
      empresas: empresasListFiltro,
      areas: areasListFiltro,
      tiposDesvio: tiposDesvioListFiltro,
    },
  };
}

// Generate Google Apps Script code string ready to copy or deploy
export function getGoogleAppsScriptCode(): {
  codeGs: string;
  indexHtml: string;
  stylesHtml: string;
  scriptsHtml: string;
} {
  const codeGs = `/**
 * Google Apps Script Backend for "Desenchufate" - Grupo Cenoa
 * Publíquelo como Web App con acceso "Cualquier persona" (Anyone).
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Desenchufate - Grupo Cenoa')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Función principal solicitada por la app web.
 * Lee empresas, áreas, desvíos y configuraciones, y calcula los puntajes.
 */
function obtenerDatosDashboard(filtros) {
  filtros = filtros || {};
  
  // Cache por 5 minutos para maximizar rendimiento
  const cache = CacheService.getScriptCache();
  const cacheKey = 'dashboard_' + JSON.stringify(filtros);
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      // Ignorar error de cache si expiró mal
    }
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // 1. Leer Config
  const configObj = {
    PUNTAJE_INICIAL: 100,
    LIMITE_EXCELENTE: 95,
    LIMITE_BUENO: 85,
    LIMITE_ALERTA: 70,
    NOMBRE_PROGRAMA: 'Desenchufate',
    NOMBRE_GRUPO: 'Grupo Cenoa',
    MOSTRAR_FOTOS: 'Sí'
  };
  try {
    const sheetConfig = ss.getSheetByName('CONFIG');
    if (sheetConfig) {
      const dataConfig = sheetConfig.getDataRange().getValues();
      for (let i = 1; i < dataConfig.length; i++) {
        const clave = String(dataConfig[i][0]).trim();
        const valor = dataConfig[i][1];
        if (clave && valor !== undefined) {
          if (!isNaN(valor) && String(valor).trim() !== '') {
            configObj[clave] = Number(valor);
          } else {
            configObj[clave] = String(valor);
          }
        }
      }
    }
  } catch (err) {
    Logger.log('Usando config por defecto');
  }

  // 2. Leer EMPRESAS
  const empresasList = [];
  try {
    const sheetEmpresas = ss.getSheetByName('EMPRESAS');
    if (sheetEmpresas) {
      const dataEmp = sheetEmpresas.getDataRange().getValues();
      for (let i = 1; i < dataEmp.length; i++) {
        const id = String(dataEmp[i][0] || '');
        const nombre = String(dataEmp[i][1] || '');
        const sede = String(dataEmp[i][2] || '');
        const activa = String(dataEmp[i][3] || '').toLowerCase() === 'sí' || String(dataEmp[i][3] || '').toLowerCase() === 'si' || dataEmp[i][3] === true;
        const orden = Number(dataEmp[i][4] || i);
        if (id && activa) {
          empresasList.push({ id, nombre, sede, activa, orden });
        }
      }
    }
  } catch (e) {}

  // 3. Leer AREAS
  const areasList = [];
  try {
    const sheetAreas = ss.getSheetByName('AREAS');
    if (sheetAreas) {
      const dataArea = sheetAreas.getDataRange().getValues();
      for (let i = 1; i < dataArea.length; i++) {
        const id = String(dataArea[i][0] || '');
        const idEmpresa = String(dataArea[i][1] || '');
        const nombre = String(dataArea[i][2] || '');
        const activa = String(dataArea[i][3] || '').toLowerCase() === 'sí' || String(dataArea[i][3] || '').toLowerCase() === 'si' || dataArea[i][3] === true;
        const orden = Number(dataArea[i][4] || i);
        if (id && activa) {
          areasList.push({ id, idEmpresa, nombre, activa, orden });
        }
      }
    }
  } catch (e) {}

  // 4. Leer REGISTROS
  const registrosList = [];
  try {
    const sheetReg = ss.getSheetByName('REGISTROS');
    if (sheetReg) {
      const dataReg = sheetReg.getDataRange().getValues();
      for (let i = 1; i < dataReg.length; i++) {
        const row = dataReg[i];
        const id = String(row[0] || 'REG-' + i);
        const timestamp = String(row[1] || '');
        const fecha = String(row[2] || '');
        const mes = String(row[3] || '');
        const anio = Number(row[4] || 2026);
        const idEmpresa = String(row[5] || '');
        const empresaNombre = String(row[6] || '');
        const sede = String(row[7] || '');
        const idArea = String(row[8] || '');
        const areaNombre = String(row[9] || '');
        const tipoDesvio = String(row[10] || '');
        const cantidadDesvios = Number(row[11] || 1);
        const puntosDescontados = Number(row[12] || 1);
        const observacion = String(row[13] || '');
        const fotoUrl = String(row[14] || '');
        const mostrarFoto = (String(row[15] || '').toLowerCase() === 'sí' || String(row[15] || '').toLowerCase() === 'si') ? 'Sí' : 'No';

        if (idArea) {
          registrosList.push({
            id, timestamp, fecha, mes, anio, idEmpresa, empresaNombre,
            sede, idArea, areaNombre, tipoDesvio, cantidadDesvios,
            puntosDescontados, observacion,
            fotoUrl: mostrarFoto === 'Sí' ? fotoUrl : '',
            mostrarFoto
          });
        }
      }
    }
  } catch (e) {}

  const result = {
    config: configObj,
    empresas: empresasList,
    areas: areasList,
    registros: registrosList,
    timestampActualizacion: new Date().toISOString()
  };

  try {
    cache.put(cacheKey, JSON.stringify(result), 300); // 5 min cache
  } catch (e) {}

  return result;
}
`;

  const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Desenchufate - Grupo Cenoa</title>
  <?!= include('Styles'); ?>
</head>
<body>
  <div id="root">Cargando aplicación Desenchufate...</div>
  <?!= include('Scripts'); ?>
</body>
</html>`;

  const stylesHtml = `<style>
  body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; }
</style>`;

  const scriptsHtml = `<script>
  console.log("Desenchufate inicializado desde Apps Script");
</script>`;

  return { codeGs, indexHtml, stylesHtml, scriptsHtml };
}
