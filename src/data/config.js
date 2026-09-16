// URL del Web App de Google Apps Script (termina en /exec).
export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx_yCAeaW7hwTBxycx8esJBUsBtYCFMDdvQ_Ll7D77Wle9f1g2o9H6HkRg6zgX2ufPwFQ/exec";

export const WHATSAPP_NUMBER = "5212721162210";
export const WHATSAPP_DISPLAY = "272 116 2210";

export const PRICE_MXN = 99;

export const PAYMENT_METHODS = {
  mercadoPago: {
    label: "Mercado Pago",
    clabe: "722969069509993670",
  },
  oxxoEfectivo: {
    label: "OXXO — depósito en efectivo",
    codigo: "2242 1708 4080 9141",
  },
  oxxoSpin: {
    label: "OXXO — transferencia Spin by OXXO",
    clabe: "728969000146352462",
  },
};

export const FAQ = [
  {
    q: "¿Qué tipo de contenido contiene?",
    a: "Meditaciones guiadas y música binaural grabadas y producidas por mí, enfocadas en desarrollo personal, espiritualidad, bienestar emocional y expansión de conciencia.",
  },
  {
    q: "¿Incluye música binaural?",
    a: "Sí. El catálogo incluye pistas de música binaural y frecuencias terapéuticas diseñadas para relajación, enfoque mental, abundancia, sanación y expansión de conciencia.",
  },
  {
    q: "¿Cuántas meditaciones incluye?",
    a: "El acceso incluye un catálogo en crecimiento de meditaciones guiadas, organizado por categorías para facilitar tu práctica.",
  },
  {
    q: "¿El catálogo sigue creciendo con el tiempo?",
    a: "Sí. Tu acceso es permanente, así que cada meditación o pista nueva que grabe se suma automáticamente a tu catálogo — siempre tienes contenido fresco esperándote, sin que tengas que hacer nada.",
  },
  {
    q: "¿Puedo sugerir temas para nuevas meditaciones?",
    a: "Sí. Al formar parte de la comunidad, puedes sugerir los temas que te gustaría trabajar, y con el tiempo iré grabando meditaciones específicas para esas necesidades.",
  },
  {
    q: "¿Cómo sé que esto es real?",
    a: "Es un acceso digital comprobable: en cuanto confirmas tu pago, recibes de inmediato el acceso a la carpeta con todo el contenido. Además, cuentas con soporte directo para cualquier duda.",
  },
  {
    q: "¿Cuánto dura mi acceso?",
    a: "Es ilimitado y permanente. Una vez que tienes el acceso, puedes escuchar o descargar el contenido cuando quieras.",
  },
];

export const CATEGORIES = [
  {
    key: "relajacion",
    name: "Relajación",
    description: "Para soltar el cuerpo y bajar el ritmo al final del día.",
  },
  {
    key: "enfoque",
    name: "Enfoque mental",
    description: "Claridad y concentración para el trabajo profundo.",
  },
  {
    key: "abundancia",
    name: "Abundancia",
    description: "Prácticas para soltar bloqueos frente al dinero y la oportunidad.",
  },
  {
    key: "sanacion",
    name: "Sanación",
    description: "Acompañamiento para procesar y liberar con suavidad.",
  },
  {
    key: "expansion",
    name: "Expansión de conciencia",
    description:
      "El corazón del catálogo: frecuencias y meditaciones para ampliar la percepción de ti mismo.",
    wide: true,
  },
];

// Resultado personalizado del quiz por categoría — headline + mensaje corto
// que aparece en la pantalla de resultado, enmarcado como enfoque/beneficio,
// nunca como diagnóstico clínico.
export const QUIZ_RESULTS = {
  relajacion: {
    headline: "Tu enfoque ahora mismo: Relajación",
    body: "Tu cuerpo te está pidiendo una pausa real. Lo que buscas es una meditación guiada para soltar la tensión acumulada y bajar el ritmo — no solo distraerte un rato.",
  },
  enfoque: {
    headline: "Tu enfoque ahora mismo: Enfoque mental",
    body: "Necesitas claridad, no más ruido. Una meditación guiada que entrene tu atención te va a ayudar a sostener la concentración cuando más lo necesitas.",
  },
  abundancia: {
    headline: "Tu enfoque ahora mismo: Abundancia",
    body: "Hay bloqueos frente al dinero y la oportunidad que vale la pena trabajar de raíz. Una meditación guiada ayuda a soltar esas creencias, no solo a \"pensar en positivo\".",
  },
  sanacion: {
    headline: "Tu enfoque ahora mismo: Sanación",
    body: "Hay algo del pasado que sigues cargando. Procesarlo con suavidad, acompañado de una voz que te guíe, suele doler menos que hacerlo solo.",
  },
  expansion: {
    headline: "Tu enfoque ahora mismo: Expansión de conciencia",
    body: "Buscas algo más grande que la rutina diaria. Esta es la meditación que amplía la manera en que te percibes a ti mismo y al mundo.",
  },
};

export const QUIZ_QUESTIONS = [
  {
    q: "¿Cómo describirías tu mente en un día normal?",
    options: [
      { label: "Acelerada, sin poder desconectar", key: "enfoque" },
      { label: "Tensa, cargando el estrés en el cuerpo", key: "relajacion" },
      { label: "Preocupada por el dinero o el futuro", key: "abundancia" },
      { label: "Regresando a recuerdos que pesan", key: "sanacion" },
      { label: "Buscando un sentido más grande a las cosas", key: "expansion" },
    ],
  },
  {
    q: "¿Qué te gustaría sentir al terminar el día?",
    options: [
      { label: "Claridad y enfoque para lo que sigue", key: "enfoque" },
      { label: "El cuerpo relajado, sin tensión", key: "relajacion" },
      { label: "Confianza en que las cosas van a fluir", key: "abundancia" },
      { label: "Ligereza, como si hubieras soltado algo", key: "sanacion" },
      { label: "Más conexión contigo mismo, más presente", key: "expansion" },
    ],
  },
  {
    q: "¿Qué obstáculo sientes que se repite más en tu vida?",
    options: [
      { label: "Distracción, cuesta concentrarme", key: "enfoque" },
      { label: "Estrés físico, dormir mal", key: "relajacion" },
      { label: "Bloqueos con el dinero o las oportunidades", key: "abundancia" },
      { label: "Heridas o situaciones del pasado sin resolver", key: "sanacion" },
      { label: "Sentir que voy en automático, sin conciencia", key: "expansion" },
    ],
  },
  {
    q: "Si tuvieras 10 minutos solo para ti, ¿qué elegirías?",
    options: [
      { label: "Silencio para ordenar mis pensamientos", key: "enfoque" },
      { label: "Descansar el cuerpo por completo", key: "relajacion" },
      { label: "Visualizar mis metas con claridad", key: "abundancia" },
      { label: "Procesar algo que traigo pendiente", key: "sanacion" },
      { label: "Meditar sin buscar nada en particular", key: "expansion" },
    ],
  },
  {
    q: "¿Qué te trajo hasta aquí hoy?",
    options: [
      { label: "Necesito concentrarme mejor", key: "enfoque" },
      { label: "Necesito relajarme, estoy agotado/a", key: "relajacion" },
      { label: "Quiero atraer más abundancia a mi vida", key: "abundancia" },
      { label: "Quiero sanar algo que llevo cargando", key: "sanacion" },
      { label: "Busco expandir mi conciencia y crecer", key: "expansion" },
    ],
  },
];

export const CATALOG_ITEMS = [
  "Meditaciones guiadas para relajación, enfoque mental, abundancia, sanación y expansión de conciencia.",
  "Pistas de música binaural y frecuencias terapéuticas, diseñadas para favorecer la concentración, la calma y el equilibrio energético.",
  "Acceso ilimitado y permanente: sin fecha de vencimiento ni costos adicionales.",
  "El catálogo sigue creciendo con el tiempo, sin costo extra para ti.",
  "Al formar parte de la comunidad, puedes sugerir temas para nuevas meditaciones y recibir contenido grabado especialmente para lo que estás trabajando.",
];
