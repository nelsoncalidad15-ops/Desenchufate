# GUÍA COMPLETA DE INTEGRACIÓN: GOOGLE FORMS + GOOGLE SHEETS + APPS SCRIPT + NETLIFY

Este documento contiene la especificación exacta para la puesta en producción del sistema **DESENCHUFATE** para el Grupo Zenova.

---

## 1. CONFIGURACIÓN DEL GOOGLE FORM

Crea un formulario en **Google Forms** con la siguiente estructura exacta para que las respuestas alimenten automáticamente la hoja de cálculo y el Dashboard en tiempo real.

### 📌 Datos del Formulario
* **Nombre del Formulario**: `DESENCHUFATE - Registro de Auditorías de Eficiencia Energética`
* **Descripción**: *Sistema de control y auditoría energética diaria por sede y área para el Grupo Zenova.*

### 📋 Campos del Formulario (Preguntas)

| # | Pregunta en Google Forms | Tipo de Campo | Opciones de Respuesta |
|---|---------------------------|---------------|-----------------------|
| 1 | **Empresa / Marca** | Desplegable (Obligatorio) | `Autolux`<br>`Autosol`<br>`Autociel`<br>`Chapa y Pintura` |
| 2 | **Sede / Sucursal** | Desplegable (Obligatorio) | `Salta`<br>`Jujuy` |
| 3 | **Área Auditada** | Desplegable / Lista (Obligatorio) | `Taller`<br>`Postventa`<br>`Ventas`<br>`Repuestos`<br>`Administración`<br>`Servicios`<br>`Recepción`<br>`Entregas` |
| 4 | **Tipo de Desvío Detectado** | Desplegable (Obligatorio) | • `Luz encendida sin necesidad` (-1 pt)<br>• `Aire acondicionado prendido fuera de horario` (-2 pts)<br>• `Cargador o equipo conectado sin uso` (-1 pt)<br>• `Motor / Compresor encendido sin actividad` (-2 pts)<br>• `Puerta o ventana abierta con aire encendido` (-1 pt)<br>• `Iluminación de cartelera fuera de horario` (-1 pt) |
| 5 | **Observaciones / Comentarios** | Texto de párrafo (Opcional) | *Ej: Se detectaron luces encendidas en pasillo luego del cierre del taller.* |
| 6 | **Fotografía de Evidencia** | Carga de archivos (Opcional) | Permitir imágenes (JPG, PNG). Google Drive guardará la URL automáticamente. |

---

## 2. VINCULACIÓN DE GOOGLE FORMS CON GOOGLE SHEETS

1. En el Google Form recién creado, ve a la pestaña **Respuestas** (Responses).
2. Haz clic en el ícono verde de **Hojas de cálculo** (Vincular con Hojas de cálculo).
3. Selecciona **Crear una nueva hoja de cálculo** y nómbrala: `DESenchufate_Respuestas_Google_Sheets`.
4. La pestaña creada por defecto se llamará `Respuestas de formulario 1`.

---

## 3. CÓDIGO GOOGLE APPS SCRIPT (`Code.gs`)

1. En tu Hoja de Cálculo de Google Sheets, ve al menú superior **Extensiones > Apps Script**.
2. Reemplaza todo el código existente por la siguiente función `doGet`:

```javascript
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Pestaña de Respuestas del Formulario
  var sheetRespuestas = ss.getSheetByName("Respuestas de formulario 1") || ss.getSheets()[0];
  var dataRespuestas = sheetRespuestas.getDataRange().getValues();
  
  // Encabezados en fila 1
  var headers = dataRespuestas[0];
  
  // Transformar filas a objetos JSON
  var registros = [];
  for (var i = 1; i < dataRespuestas.length; i++) {
    var row = dataRespuestas[i];
    if (!row[0]) continue; // Saltar filas vacías
    
    registros.push({
      id: "REG-" + i,
      timestamp: row[0], // Marca temporal
      empresa: row[1] || "",
      sede: row[2] || "",
      area: row[3] || "",
      tipoDesvio: row[4] || "",
      observaciones: row[5] || "",
      fotoUrl: row[6] || ""
    });
  }
  
  var responsePayload = {
    programa: "DESENCHUFATE",
    grupo: "Grupo Zenova",
    ultimaActualizacion: new Date().toISOString(),
    totalRegistros: registros.length,
    registros: registros
  };
  
  return ContentService.createTextOutput(JSON.stringify(responsePayload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Guarda el proyecto en Apps Script (Ctrl + S / Cmd + S).
4. Haz clic en **Implementar > Nueva implementación**.
5. Tipo: **Aplicación Web**.
6. Acceso: **Cualquier persona** (*Anyone*).
7. Copia la **URL de la Aplicación Web**.

---

## 4. DESPLIEGUE EN NETLIFY (VS CODE + OPEX CODEX)

1. Sube el repositorio a GitHub o conéctalo directamente a **Netlify**.
2. En las configuraciones de Netlify:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment Variable**: `VITE_GOOGLE_SHEETS_SCRIPT_URL` = `<TU_URL_DE_APPS_SCRIPT>`
3. Netlify compilará el proyecto TypeScript React + Tailwind CSS y entregará la app web de alta velocidad.

---

*Documento generado para el Dashboard DESENCHUFATE - Control Energético Grupo Zenova.*
