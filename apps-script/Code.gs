/**
 * Faro del Infinito — backend en Apps Script.
 *
 * Maneja dos caminos de entrega de acceso:
 *   1. Formulario manual (transferencia/OXXO + comprobante subido) — se
 *      otorga el acceso de inmediato y queda marcado "pendiente revisión"
 *      para que el dueño lo confirme o revoque desde el Sheet.
 *   2. Mercado Pago Checkout Pro — el acceso solo se otorga cuando el
 *      webhook confirma el pago como aprobado (ver mercadopago.gs).
 *
 * Este es un proyecto INDEPENDIENTE (no vive "adentro" del Sheet) — por eso
 * SPREADSHEET_ID abajo le dice explícitamente a qué hoja conectarse.
 *
 * ───────────────────────────────────────────────────────────────────────
 * CONFIGURACIÓN REQUERIDA
 * ───────────────────────────────────────────────────────────────────────
 * Configuración del proyecto → Propiedades del script:
 *   MP_ACCESS_TOKEN     → Access Token de Mercado Pago (TEST-... o real)
 *   DRIVE_FOLDER_ID      → ID de la carpeta de Drive con el catálogo
 *   BACKUP_FOLDER_ID     → ID de la carpeta donde se guardan los comprobantes
 *
 * (El ID de una carpeta de Drive es la parte de la URL después de
 * /folders/ — ej. drive.google.com/drive/folders/AQUI_VA_EL_ID)
 *
 * Además, reemplaza SPREADSHEET_ID abajo con el ID de tu Sheet (la parte
 * de la URL entre /d/ y /edit — ej. docs.google.com/spreadsheets/d/AQUI_VA_EL_ID/edit).
 *
 * La PRIMERA VEZ, corre manualmente la función instalarTriggerOnOpen()
 * desde este editor (selecciona la función en el dropdown de arriba y
 * dale ▷ Ejecutar) — así queda instalado el menú "Faro del Infinito"
 * dentro de tu Sheet para poder revocar accesos con un clic.
 */

var SPREADSHEET_ID = '1fXTnqxCkd5jHkLQ6JD75xDpP6CXE982599nXvmEdpak';
var SHEET_NAME = 'Compras';
var COLUMNAS = ['Fecha', 'Nombre', 'Correo', 'Monto', 'Método', 'Sugerencia', 'Comprobante', 'Estado', 'Origen', 'ID pago MP'];

function doGet(e) {
  if (e.parameter.topic || e.parameter.type) {
    return recibirWebhookMP(e);
  }
  return ContentService.createTextOutput('Faro del Infinito API — OK');
}

function doPost(e) {
  var action = e.parameter.action;
  if (action === 'crear_preferencia_mp') {
    return crearPreferenciaMP(e);
  }
  return manejarComprobante(e);
}

/**
 * Formulario manual: nombre, correo, monto, metodo, comprobante (archivo),
 * sugerencia. Otorga acceso de inmediato y lo marca "pendiente revisión".
 */
function manejarComprobante(e) {
  var nombre = e.parameter.nombre || '';
  var correo = e.parameter.correo || '';
  var monto = e.parameter.monto || '';
  var metodo = e.parameter.metodo || '';
  var sugerencia = e.parameter.sugerencia || '';

  var comprobanteUrl = '';
  var archivo = e.parameter.comprobante;
  if (archivo && archivo.getBytes) {
    var backupFolderId = PropertiesService.getScriptProperties().getProperty('BACKUP_FOLDER_ID');
    if (backupFolderId) {
      var carpeta = DriveApp.getFolderById(backupFolderId);
      var guardado = carpeta.createFile(archivo);
      guardado.setName(Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd_HHmmss') + '_' + correo + '_' + archivo.getName());
      comprobanteUrl = guardado.getUrl();
    }
  }

  otorgarAcceso({
    nombre: nombre,
    correo: correo,
    monto: monto,
    metodo: metodo,
    sugerencia: sugerencia,
    comprobanteUrl: comprobanteUrl,
    origen: 'Manual',
    estado: 'Pendiente revisión',
  });

  var output = ContentService.createTextOutput('ok');
  return output;
}

/**
 * Comparte la carpeta de Drive, envía el correo de bienvenida, y registra
 * la fila en el Sheet. La llaman tanto el flujo manual como el webhook de
 * Mercado Pago (mercadopago.gs).
 */
function otorgarAcceso(datos) {
  var folderId = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID');
  var folderUrl = '';

  if (folderId && datos.correo) {
    var folder = DriveApp.getFolderById(folderId);
    folder.addViewer(datos.correo);
    folderUrl = folder.getUrl();
  }

  if (datos.correo && folderUrl) {
    MailApp.sendEmail({
      to: datos.correo,
      subject: '¡Listo! Tu acceso a Faro del Infinito',
      htmlBody:
        '<p>Hola' + (datos.nombre ? ' ' + datos.nombre : '') + ',</p>' +
        '<p>Gracias por unirte a Faro del Infinito. Aquí está tu acceso a la carpeta de meditaciones y música binaural:</p>' +
        '<p><a href="' + folderUrl + '">' + folderUrl + '</a></p>' +
        '<p>Tu acceso es permanente e ilimitado — vuelve cuando quieras.</p>' +
        '<p>¿Dudas? Escríbenos por WhatsApp.</p>',
    });
  }

  var sheet = getSheet();
  sheet.appendRow([
    new Date(),
    datos.nombre || '',
    datos.correo || '',
    datos.monto || '',
    datos.metodo || '',
    datos.sugerencia || '',
    datos.comprobanteUrl || (datos.mpPaymentId ? 'Mercado Pago #' + datos.mpPaymentId : ''),
    datos.estado || '',
    datos.origen || '',
    datos.mpPaymentId || '',
  ]);
}

/**
 * Evita procesar dos veces el mismo pago de Mercado Pago (MP reintenta el
 * webhook varias veces). Busca el ID de pago en la columna J del Sheet.
 */
function pagoYaProcesado(mpPaymentId) {
  var sheet = getSheet();
  var ultimaFila = sheet.getLastRow();
  if (ultimaFila < 2) return false;
  var idsColumna = sheet.getRange(2, 10, ultimaFila - 1, 1).getValues(); // columna J
  for (var i = 0; i < idsColumna.length; i++) {
    if (String(idsColumna[i][0]) === String(mpPaymentId)) return true;
  }
  return false;
}

function getSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNAS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Instala el trigger que muestra el menú "Faro del Infinito" cada vez que
 * abres el Sheet. CÓRRELA UNA SOLA VEZ manualmente desde este editor
 * (dropdown de funciones arriba → instalarTriggerOnOpen → ▷ Ejecutar).
 * La primera vez te va a pedir autorizar permisos — acéptalos.
 */
function instalarTriggerOnOpen() {
  // Evita duplicar el trigger si ya lo corriste antes.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onOpen') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  ScriptApp.newTrigger('onOpen').forSpreadsheet(ss).onOpen().create();
  Logger.log('Trigger instalado. Abre (o recarga) tu Sheet para ver el menú.');
}

/**
 * Menú personalizado en el Sheet para revocar acceso con un clic.
 * Selecciona la fila del comprador (cualquier celda de esa fila) y usa el
 * menú "Faro del Infinito → Revocar acceso de la fila seleccionada".
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Faro del Infinito')
    .addItem('Revocar acceso de la fila seleccionada', 'revocarAccesoFilaSeleccionada')
    .addToUi();
}

function revocarAccesoFilaSeleccionada() {
  var sheet = getSheet();
  var fila = SpreadsheetApp.getActiveSpreadsheet().getActiveCell().getRow();
  if (fila === 1) {
    SpreadsheetApp.getUi().alert('Selecciona una fila con datos, no el encabezado.');
    return;
  }

  var correo = sheet.getRange(fila, 3).getValue(); // columna C = Correo
  if (!correo) {
    SpreadsheetApp.getUi().alert('Esa fila no tiene correo.');
    return;
  }

  var folderId = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID');
  if (folderId) {
    try {
      DriveApp.getFolderById(folderId).removeViewer(correo);
    } catch (err) {
      Logger.log('No se pudo quitar el permiso (quizá ya no lo tenía): ' + err);
    }
  }

  sheet.getRange(fila, 8).setValue('Revocado'); // columna H = Estado
  SpreadsheetApp.getUi().alert('Acceso revocado para ' + correo);
}
