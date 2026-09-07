/**
 * Integración de Mercado Pago Checkout Pro para Faro del Infinito.
 *
 * ESTE ARCHIVO ES UNA PIEZA NUEVA PARA FUSIONAR CON TU APPS SCRIPT EXISTENTE.
 * No reemplaza tu script actual — solo agrega dos capacidades:
 *
 *   1. Crear una "preferencia" de pago en Mercado Pago y devolver la URL de
 *      checkout (init_point) para redirigir al comprador ahí.
 *   2. Recibir el webhook de Mercado Pago cuando el pago se confirma, y
 *      entonces sí otorgar el acceso (compartir Drive + enviar correo +
 *      registrar en el Sheet) — usando la MISMA lógica que ya tienes para
 *      el flujo de comprobante manual.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CÓMO INTEGRAR CON TU doPost() EXISTENTE
 * ─────────────────────────────────────────────────────────────────────────
 * Tu Web App solo puede tener un doPost(e). Si ya tienes uno que procesa el
 * formulario con comprobante, conviértelo en un dispatcher por "action":
 *
 *   function doPost(e) {
 *     var action = e.parameter.action;
 *     if (action === 'crear_preferencia_mp') return crearPreferenciaMP(e);
 *     return manejarFormularioComprobante(e); // tu lógica actual, renombrada
 *   }
 *
 *   function doGet(e) {
 *     if (e.parameter.topic || e.parameter.type) return recibirWebhookMP(e);
 *     return ContentService.createTextOutput('OK');
 *   }
 *
 * ─────────────────────────────────────────────────────────────────────────
 * CONFIGURACIÓN REQUERIDA (Project Settings → Script Properties)
 * ─────────────────────────────────────────────────────────────────────────
 *   MP_ACCESS_TOKEN   → tu Access Token de Mercado Pago (TEST-... para
 *                        pruebas, luego el de producción). NUNCA lo pongas
 *                        directo en el código — usa Script Properties.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TODOs que debes resolver al fusionar esto con tu script real:
 * ─────────────────────────────────────────────────────────────────────────
 *   - otorgarAcceso(): debe llamar tu función real que comparte la carpeta
 *     de Drive, envía el correo de bienvenida y registra la fila en el
 *     Sheet. Está marcada abajo con TODO.
 *   - WEBAPP_URL: la URL /exec de tu Web App publicado (para notification_url).
 *   - BACK_URL_CONFIRMACION: la URL real de tu página de confirmación.
 */

var MP_API_BASE = 'https://api.mercadopago.com';
var WEBAPP_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec'; // TODO
var BACK_URL_CONFIRMACION = 'https://farodelinfinito.mx/confirmacion'; // TODO
var PRECIO_MXN = 99;

/**
 * Crea una preferencia de pago en Mercado Pago y devuelve la URL de checkout.
 * Se invoca desde el frontend vía POST con action=crear_preferencia_mp,
 * nombre, correo y sugerencia como parámetros de formulario
 * (application/x-www-form-urlencoded, así se evita el preflight CORS).
 */
function crearPreferenciaMP(e) {
  var nombre = e.parameter.nombre || '';
  var correo = e.parameter.correo || '';
  var sugerencia = e.parameter.sugerencia || '';

  var token = PropertiesService.getScriptProperties().getProperty('MP_ACCESS_TOKEN');
  if (!token) {
    return jsonResponse({ error: 'MP_ACCESS_TOKEN no configurado en Script Properties' }, 500);
  }

  // external_reference es como recuperamos nombre/correo/sugerencia cuando
  // llegue el webhook — Mercado Pago nos lo regresa tal cual.
  var externalReference = JSON.stringify({ nombre: nombre, correo: correo, sugerencia: sugerencia, ts: Date.now() });

  var payload = {
    items: [
      {
        title: 'Acceso Faro del Infinito — catálogo de meditaciones',
        quantity: 1,
        unit_price: PRECIO_MXN,
        currency_id: 'MXN',
      },
    ],
    payer: { email: correo || undefined, name: nombre || undefined },
    external_reference: externalReference,
    back_urls: {
      success: BACK_URL_CONFIRMACION,
      pending: BACK_URL_CONFIRMACION,
      failure: BACK_URL_CONFIRMACION,
    },
    auto_return: 'approved',
    notification_url: WEBAPP_URL,
  };

  var response = UrlFetchApp.fetch(MP_API_BASE + '/checkout/preferences', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var body = JSON.parse(response.getContentText());

  if (response.getResponseCode() >= 300) {
    return jsonResponse({ error: 'Error creando preferencia', detalle: body }, 500);
  }

  // Usa sandbox_init_point mientras pruebas con credenciales TEST-,
  // cambia a init_point cuando pases a producción con credenciales reales.
  var checkoutUrl = body.sandbox_init_point || body.init_point;

  return jsonResponse({ checkoutUrl: checkoutUrl });
}

/**
 * Recibe la notificación (webhook) de Mercado Pago. MP puede llamar por
 * GET con ?topic=payment&id=... (formato viejo) o ?type=payment&data.id=...
 * (formato nuevo) — soportamos ambos.
 */
function recibirWebhookMP(e) {
  var paymentId = e.parameter.id || e.parameter['data.id'];
  var topic = e.parameter.topic || e.parameter.type;

  if (topic !== 'payment' || !paymentId) {
    return ContentService.createTextOutput('ignored');
  }

  var token = PropertiesService.getScriptProperties().getProperty('MP_ACCESS_TOKEN');

  // Nunca confíes en el contenido del webhook por sí solo: siempre verifica
  // el estado real consultando la API de Mercado Pago con el ID de pago.
  var response = UrlFetchApp.fetch(MP_API_BASE + '/v1/payments/' + paymentId, {
    method: 'get',
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true,
  });

  var pago = JSON.parse(response.getContentText());

  if (pago.status !== 'approved') {
    return ContentService.createTextOutput('not approved: ' + pago.status);
  }

  var datos;
  try {
    datos = JSON.parse(pago.external_reference || '{}');
  } catch (err) {
    datos = {};
  }

  var correo = datos.correo || (pago.payer && pago.payer.email) || '';
  var nombre = datos.nombre || '';
  var sugerencia = datos.sugerencia || '';

  if (!correo) {
    return ContentService.createTextOutput('sin correo, no se puede otorgar acceso');
  }

  otorgarAcceso({
    nombre: nombre,
    correo: correo,
    sugerencia: sugerencia,
    monto: pago.transaction_amount,
    metodo: 'Mercado Pago (' + pago.payment_type_id + ')',
    mpPaymentId: paymentId,
  });

  return ContentService.createTextOutput('ok');
}

/**
 * TODO: reemplaza el cuerpo de esta función con tu lógica real existente:
 *   - Compartir la carpeta de Drive con `datos.correo` (solo lectura)
 *   - Enviar el correo de bienvenida con el enlace
 *   - Registrar la fila en el Sheet (fecha, nombre, correo, monto, método,
 *     sugerencia, estado = "pagado vía Mercado Pago")
 * Con Mercado Pago Checkout Pro el pago YA está verificado por MP antes de
 * llegar aquí, así que este acceso no necesita pasar por tu revisión manual
 * de comprobante — pero puedes seguir registrándolo en el mismo Sheet para
 * tener todo en un solo lugar.
 */
function otorgarAcceso(datos) {
  Logger.log('TODO: otorgar acceso — %s', JSON.stringify(datos));
  // Ejemplo de la forma en que probablemente ya tengas esto:
  // compartirCarpetaDrive(datos.correo);
  // enviarCorreoBienvenida(datos.correo, datos.nombre);
  // registrarEnSheet(datos);
}

function jsonResponse(obj, status) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
