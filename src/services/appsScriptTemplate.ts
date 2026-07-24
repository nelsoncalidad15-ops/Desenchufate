export function getGoogleAppsScriptCode(): { codeGs: string } {
  const codeGs = String.raw`/**
 * Desenchufate - Apps Script
 * Hojas requeridas: EMPRESAS, AREAS, TIPOS_DESVIO, CONFIG y Respuestas de formulario 1.
 */
const FORM_ID = ''; // Pega aqui el ID de tu Google Form para sincronizar sus listas.
const RESPUESTAS_SHEET = 'Respuestas de formulario 1';
const DASHBOARD_CACHE_SECONDS = 120;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Desenchufate')
    .addItem('Sincronizar formulario', 'actualizarOpcionesFormulario')
    .addToUi();
}

function doGet() {
  const cache = CacheService.getScriptCache();
  const cached = cache.get('dashboard_payload_v1');
  if (cached) {
    return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const empresas = readEmpresas(ss);
  const areas = readAreas(ss);
  const tiposDesvio = readTiposDesvio(ss);
  const payload = JSON.stringify({
    config: readConfig(ss), empresas: empresas, areas: areas, tiposDesvio: tiposDesvio,
    registros: readRegistros(ss, empresas, areas, tiposDesvio), ultimaActualizacion: new Date().toISOString(),
  });

  cache.put('dashboard_payload_v1', payload, DASHBOARD_CACHE_SECONDS);
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}

function readConfig(ss) {
  const config = { PUNTAJE_INICIAL: 100, LIMITE_EXCELENTE: 95, LIMITE_BUENO: 85, LIMITE_ALERTA: 70, NOMBRE_PROGRAMA: 'DESENCHUFATE', NOMBRE_GRUPO: 'Grupo Cenoa', MOSTRAR_FOTOS: 'Si' };
  const sheet = ss.getSheetByName('CONFIG');
  if (!sheet) return config;
  sheet.getDataRange().getValues().slice(1).forEach(function(row) {
    const key = String(row[0] || '').trim();
    if (key) config[key] = isNaN(Number(row[1])) ? String(row[1] || '') : Number(row[1]);
  });
  return config;
}

function readEmpresas(ss) {
  const sheet = ss.getSheetByName('EMPRESAS');
  if (!sheet) return [];
  return sheet.getDataRange().getValues().slice(1).map(function(row, index) {
    return { id: String(row[0] || '').trim(), nombre: String(row[1] || '').trim(), sede: String(row[2] || '').trim(), activa: isActive(row[3]), orden: Number(row[4]) || index + 1 };
  }).filter(function(item) { return item.id && item.nombre && item.activa; });
}

function readAreas(ss) {
  const sheet = ss.getSheetByName('AREAS');
  if (!sheet) return [];
  return sheet.getDataRange().getValues().slice(1).map(function(row, index) {
    return { id: String(row[0] || '').trim(), idEmpresa: String(row[1] || '').trim(), nombre: String(row[2] || '').trim(), activa: isActive(row[3]), orden: Number(row[4]) || index + 1 };
  }).filter(function(item) { return item.id && item.idEmpresa && item.nombre && item.activa; });
}

function readTiposDesvio(ss) {
  const sheet = ss.getSheetByName('TIPOS_DESVIO');
  if (!sheet) return [];
  return sheet.getDataRange().getValues().slice(1).map(function(row, index) {
    return { id: String(row[0] || '').trim(), tipo: String(row[1] || '').trim(), puntosDescuento: Number(row[2]) || 1, icono: String(row[3] || 'alert-triangle'), activo: isActive(row[4]), orden: Number(row[5]) || index + 1 };
  }).filter(function(item) { return item.id && item.tipo && item.activo; });
}

function readRegistros(ss, empresas, areas, tiposDesvio) {
  const sheet = ss.getSheetByName(RESPUESTAS_SHEET);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0].map(function(header) { return String(header).trim(); });
  const get = function(row, titles) {
    const options = Array.isArray(titles) ? titles : [titles];
    for (var i = 0; i < options.length; i++) {
      var index = headers.indexOf(options[i]);
      if (index >= 0) return row[index];
    }
    return '';
  };
  return values.slice(1).map(function(row, index) {
    const timestamp = String(get(row, ['Timestamp', 'Marca temporal', 'Fecha y hora']) || '').trim();
    const empresaName = String(get(row, ['Empresa / Marca', 'Empresa', 'Marca']) || '').trim();
    const sede = String(get(row, ['Sede / Sucursal', 'Sede', 'Sucursal']) || '').trim();
    const areaValue = String(get(row, ['Area Auditada', 'Área Auditada', 'Area', 'Área']) || '').trim();
    const tipo = String(get(row, ['Tipo de Desvio Detectado', 'Tipo de Desvío Detectado', 'Tipo de Desvio', 'Tipo de Desvío']) || '').trim();
    const empresa = empresas.find(function(item) { return item.nombre.toLowerCase() === empresaName.toLowerCase() && item.sede.toLowerCase() === sede.toLowerCase(); });
    const area = areas.find(function(item) { return item.idEmpresa === (empresa && empresa.id) && (item.nombre.toLowerCase() === areaValue.toLowerCase() || areaLabel(item, empresas) === areaValue); });
    const tipoInfo = tiposDesvio.find(function(item) { return item.tipo.toLowerCase() === tipo.toLowerCase(); });
    if (!timestamp) return null;
    return { id: 'REG-' + (index + 1), timestamp: timestamp, empresa: empresa ? empresa.nombre : empresaName, sede: empresa ? empresa.sede : sede,
      area: area ? area.nombre : areaValue, idEmpresa: empresa ? empresa.id : '', idArea: area ? area.id : '', tipoDesvio: tipo,
      puntosDescontados: tipoInfo ? tipoInfo.puntosDescuento : 1, observaciones: String(get(row, ['Observaciones / Comentarios', 'Observaciones', 'Comentarios']) || ''), fotoUrl: String(get(row, ['Fotografia de Evidencia', 'Fotografía de Evidencia', 'Foto']) || '') };
  }).filter(function(item) { return item; });
}

function actualizarOpcionesFormulario() {
  if (!FORM_ID) throw new Error('Completa FORM_ID con el ID de tu Google Form.');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const empresas = readEmpresas(ss);
  const areas = readAreas(ss);
  const tipos = readTiposDesvio(ss);
  const form = FormApp.openById(FORM_ID);
  setChoices(form, 'Empresa / Marca', unique(empresas.map(function(item) { return item.nombre; })));
  setChoices(form, 'Sede / Sucursal', unique(empresas.map(function(item) { return item.sede; })));
  setChoices(form, 'Area Auditada', unique(areas.map(function(item) { return item.nombre; })));
  setChoices(form, 'Tipo de Desvio Detectado', tipos.map(function(item) { return item.tipo; }));
  CacheService.getScriptCache().remove('dashboard_payload_v1');
  SpreadsheetApp.getUi().alert('Formulario sincronizado correctamente.');
}

function setChoices(form, title, choices) {
  const item = form.getItems().find(function(candidate) { return candidate.getTitle() === title; });
  if (!item) throw new Error('No existe la pregunta: ' + title);
  if (item.getType() === FormApp.ItemType.LIST) item.asListItem().setChoiceValues(choices);
  else if (item.getType() === FormApp.ItemType.MULTIPLE_CHOICE) item.asMultipleChoiceItem().setChoiceValues(choices);
  else throw new Error('La pregunta ' + title + ' debe ser Desplegable u Opcion multiple.');
}

function areaLabel(area, empresas) {
  const empresa = empresas.find(function(item) { return item.id === area.idEmpresa; });
  return empresa ? empresa.nombre + ' | ' + empresa.sede + ' | ' + area.nombre : area.nombre;
}
function unique(values) { return values.filter(function(value, index, list) { return value && list.indexOf(value) === index; }); }
function isActive(value) { const text = String(value).trim().toLowerCase(); return value === true || text === 'si' || text === 'sí' || text === 'true' || text === 'activa'; }
`;
  return { codeGs };
}
