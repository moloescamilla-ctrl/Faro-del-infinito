// URL del Web App de Google Apps Script (termina en /exec).
// TODO: reemplazar con la URL real antes de publicar — ver brief sección 5.
export const APPS_SCRIPT_URL = "APPS_SCRIPT_URL_AQUI";

export const WHATSAPP_NUMBER = "5212721162210";
export const WHATSAPP_DISPLAY = "272 116 2210";

export const PRICE_MXN = 99;

export const PAYMENT_METHODS = {
  mercadoPago: {
    label: "Mercado Pago",
    clabe: "722969069509993670",
    beneficiario: "José Manuel Mateos Escamilla",
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
    q: "¿Por qué el precio no sube aunque agreguen más contenido?",
    a: "Porque tu acceso es permanente: cada meditación o pista nueva que grabe se suma automáticamente a tu catálogo, sin que tengas que pagar de nuevo.",
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

export const CATALOG_ITEMS = [
  "Meditaciones guiadas para relajación, enfoque mental, abundancia, sanación y expansión de conciencia.",
  "Pistas de música binaural y frecuencias terapéuticas, diseñadas para favorecer la concentración, la calma y el equilibrio energético.",
  "Acceso ilimitado y permanente: sin fecha de vencimiento ni costos adicionales.",
  "El catálogo sigue creciendo con el tiempo, sin costo extra para ti.",
  "Al formar parte de la comunidad, puedes sugerir temas para nuevas meditaciones y recibir contenido grabado especialmente para lo que estás trabajando.",
];
