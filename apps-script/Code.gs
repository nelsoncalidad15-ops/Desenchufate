function doGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Respuestas de formulario 1") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();

  var registros = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;

    registros.push({
      id: "REG-" + i,
      timestamp: row[0],
      empresa: row[1] || "",
      sede: row[2] || "",
      area: row[3] || "",
      tipoDesvio: row[4] || "",
      observaciones: row[5] || "",
      fotoUrl: row[6] || ""
    });
  }

  return ContentService.createTextOutput(
    JSON.stringify({
      programa: "DESENCHUFATE",
      grupo: "Grupo Zenova",
      ultimaActualizacion: new Date().toISOString(),
      totalRegistros: registros.length,
      registros: registros
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
