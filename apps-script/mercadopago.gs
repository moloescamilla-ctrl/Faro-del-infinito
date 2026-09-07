/**
 * Integración de Mercado Pago Checkout Pro para Faro del Infinito.
 *
 * Este archivo trabaja junto con Code.gs (que trae doGet/doPost, el
 * dispatcher por "action", y la función otorgarAcceso() compartida).
 * Pega ambos archivos en el mismo proyecto de Apps Script.
 *
 * Aporta dos capacidades:
 *   1. crearPreferenciaMP(): crea una "preferencia" de pago en Mercado Pago
 *      y devuelve la URL de checkout (init_point) para redirigir ahí al
 *      comprador.
 *   2. recibirWebhookMP(): recibe la notificación de Mercado Pago cuando el
 *      pago se confirma, VERIFICA el estado real contra la API de MP (nunca
 *      confía en el webhook a ciegas), y llama a otorgarAcceso() — la misma
 *      función que usa el flujo de comprobante manual en Code.gs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PENDIENTE al desplegar:
 * ─────────────────────────────────────────────────────────────────────────
 *   - WEBAPP_URL: la URL /exec de tu Web App publicado (para notification_url).
 *     La sabrás hasta DESPUÉS del primer despliegue — actualízala y vuelve
 *     a desplegar.
 *   - BACK_URL_CONFIRMACION: la URL real de tu página de confirmación.
 */

var MP_API_BASE = 'https://api.mercadopago.com';
var WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbx_yCAeaW7hwTBxycx8esJBUsBtYCFMDdvQ_Ll7D77Wle9f1g2o9H6HkRg6zgX2ufPwFQ/exec';
var BACK_URL_CONFIRMACION = 'https://faro-del-infinito.vercel.app/confirmacion';
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

  // Mercado Pago reintenta el webhook varias veces para el mismo pago —
  // sin este chequeo se duplicarían el correo y el acceso otorgado.
  if (pagoYaProcesado(paymentId)) {
    return ContentService.createTextOutput('ya procesado: ' + paymentId);
  }

  // otorgarAcceso() vive en Code.gs — el pago ya está verificado por MP
  // (status === 'approved'), así que este acceso NO pasa por revisión manual.
  otorgarAcceso({
    nombre: nombre,
    correo: correo,
    sugerencia: sugerencia,
    monto: pago.transaction_amount,
    metodo: 'Mercado Pago (' + pago.payment_type_id + ')',
    origen: 'Mercado Pago',
    estado: 'Verificado',
    mpPaymentId: paymentId,
  });

  return ContentService.createTextOutput('ok');
}

function jsonResponse(obj, status) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
