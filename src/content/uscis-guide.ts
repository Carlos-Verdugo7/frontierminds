/**
 * Guía independiente sobre herramientas de USCIS: solo datos ilustrativos.
 * URLs en dominios .gov verificados el 24 de noviembre de 2026.
 * No se solicitan, reciben ni almacenan identificadores de casos.
 */
export const uscisReviewed = '2026-11-24';

export const uscisLinks = {
  status: 'https://egov.uscis.gov/es/caseStatus',
  account: 'https://myaccount.uscis.gov/',
  accountGuide: 'https://www.uscis.gov/es/presentacion-de-solicitudes-en-linea/como-crear-una-cuenta-de-uscis-en-linea',
  accountHelp: 'https://my.uscis.gov/account/v1/needhelp',
  times: 'https://egov.uscis.gov/processing-times/es',
  address: 'https://www.uscis.gov/addresschange',
  inquiry: 'https://www.uscis.gov/e-request',
  scams: 'https://www.uscis.gov/es/evite-las-estafas-de-inmigracion',
  legalHelp: 'https://www.uscis.gov/es/encuentre-servicios-legales',
  uscisSpanish: 'https://www.uscis.gov/es',
} as const;

export type UscisGoal = 'estado' | 'cuenta' | 'tiempos' | 'direccion' | 'ayuda';
export type UscisStep = { title: string; detail: string; note?: string };
export type UscisJourney = {
  id: UscisGoal; title: string; short: string; intro: string;
  steps: readonly UscisStep[]; officialLabel: string; url: string;
  remember: string;
};

export const uscisJourneys: readonly UscisJourney[] = [
  {
    id: 'estado', title: 'Consultar el estatus de mi caso', short: 'Revisar qué dice USCIS',
    intro: 'Para consultar el estatus público no necesitas iniciar sesión. La consulta real se realiza exclusivamente en el sitio de USCIS.',
    steps: [
      { title: 'Busca tu notificación de recibo', detail: 'Localiza el número de recibo en la notificación de USCIS (por ejemplo, Formulario I-797). Es un identificador que suele tener tres letras y diez números. No lo escribas en FrontierMinds.', note: 'El número de recibo no es lo mismo que un A-Number, número de cuenta de USCIS o código de acceso.' },
      { title: 'Abre Estatus de Caso en Línea', detail: 'Ve directamente a egov.uscis.gov/es/caseStatus. Verifica que la dirección sea un sitio .gov y que tu conexión sea segura.' },
      { title: 'Ingresa tu recibo solo en USCIS', detail: 'Escribe los caracteres de tu notificación sin guiones. Conserva otros símbolos, como asteriscos, si forman parte del número. Presiona el botón para verificar el estatus.' },
      { title: 'Lee el mensaje y revisa tus avisos', detail: 'El resultado puede mostrar un evento o una actualización general, pero no siempre indica cuándo llegará una decisión. Si hay una carta o solicitud, lee el aviso oficial y sus instrucciones.' },
    ],
    officialLabel: 'Consultar estatus en USCIS', url: uscisLinks.status,
    remember: 'El sitio de FrontierMinds no consulta expedientes reales ni guarda números de recibo.',
  },
  {
    id: 'cuenta', title: 'Crear o entrar a mi cuenta', short: 'Conocer myUSCIS',
    intro: 'La cuenta de USCIS es diferente a la consulta pública: permite ver funciones y notificaciones adicionales según el tipo de caso.',
    steps: [
      { title: 'Visita la cuenta oficial', detail: 'Abre myaccount.uscis.gov y elige iniciar sesión o crear una cuenta. Usa tu propio correo y no compartas tu contraseña.' },
      { title: 'Completa los pasos de seguridad', detail: 'Sigue las instrucciones de verificación de identidad y autenticación de dos pasos. Guarda tus métodos de recuperación en un lugar seguro.' },
      { title: 'Revisa qué permite tu tipo de caso', detail: 'La cuenta puede ofrecer seguimiento, avisos, mensajes y otras herramientas, según la solicitud. Si presentaste en papel, algunos casos permiten vincularlos con el número de recibo y un código de acceso en línea.' },
      { title: 'Si falta tu código, busca ayuda oficial', detail: 'No inventes un código ni lo compartas con terceros. Usa el formulario oficial de asistencia técnica si tienes problemas con el acceso a la cuenta.' },
    ],
    officialLabel: 'Entrar a myUSCIS', url: uscisLinks.account,
    remember: 'No todos los casos se administran de la misma manera. Sigue las opciones que realmente aparezcan en tu cuenta y las instrucciones oficiales.',
  },
  {
    id: 'tiempos', title: 'Comprender los tiempos de procesamiento', short: 'Saber qué significa la espera',
    intro: 'Los tiempos de procesamiento son estadísticas, no fechas prometidas para resolver un expediente individual.',
    steps: [
      { title: 'Identifica tu formulario', detail: 'Revisa tu notificación para saber si se trata de I-130, I-485, N-400, I-765 u otro formulario. Un número de formulario no indica por sí solo el resultado.' },
      { title: 'Abre la herramienta de tiempos', detail: 'En la página oficial elige el formulario, la categoría y la oficina cuando la herramienta lo solicite. Algunas categorías se agrupan por operaciones de centros de servicio.' },
      { title: 'Interpreta el número con cuidado', detail: 'La cifra publicada refleja casos resueltos anteriormente bajo la metodología de USCIS. No equivale al tiempo restante de tu caso ni garantiza una decisión.' },
      { title: 'Comprueba si puedes consultar una demora', detail: 'Si crees que tu caso excede los tiempos normales, revisa la opción oficial para preguntar sobre tu expediente. Si recibiste una RFE o aviso con plazo, atiende las instrucciones de esa notificación.' },
    ],
    officialLabel: 'Ver tiempos de USCIS', url: uscisLinks.times,
    remember: 'No calculamos ni prometemos fechas de aprobación. La referencia válida es la herramienta oficial actualizada de USCIS.',
  },
  {
    id: 'direccion', title: 'Actualizar mi dirección', short: 'Evitar perder notificaciones',
    intro: 'Mudarte puede afectar la correspondencia del caso. Consulta las reglas que aplican a tu situación directamente con USCIS.',
    steps: [
      { title: 'Revisa si debes informar el cambio', detail: 'Las obligaciones y plazos varían según la situación migratoria. USCIS explica el proceso y las excepciones en su página oficial de cambio de dirección.' },
      { title: 'Prepara la información requerida', detail: 'Ten tus datos y números de recibo en privado. No los ingreses en FrontierMinds ni compartas capturas de notificaciones con desconocidos.' },
      { title: 'Usa el proceso oficial de USCIS', detail: 'Abre uscis.gov/addresschange. Según tu caso, la herramienta indicará el proceso disponible para registrar la nueva dirección.' },
      { title: 'Confirma y guarda tu constancia', detail: 'Verifica el resultado de la solicitud. Cambiar la dirección con USPS no sustituye por sí solo actualizarla ante USCIS.' },
    ],
    officialLabel: 'Cambiar dirección en USCIS', url: uscisLinks.address,
    remember: 'Si tienes un caso con requisitos especiales de cambio de dirección, sigue las instrucciones oficiales o consulta a un profesional autorizado.',
  },
  {
    id: 'ayuda', title: 'Reconocer avisos y pedir ayuda', short: 'RFE, mensajes y seguridad',
    intro: 'Un mensaje de estatus no sustituye una notificación. Si existe una fecha límite, prioriza leer el aviso original.',
    steps: [
      { title: 'Identifica de dónde viene el aviso', detail: 'Comprueba que la comunicación realmente provenga de USCIS. No abras enlaces sospechosos ni pagues a personas que prometen acelerar una aprobación.' },
      { title: 'Lee el documento completo', detail: 'Una solicitud de evidencia (RFE) requiere revisar las instrucciones, el contenido pedido, el método de respuesta y la fecha límite impresa. Una actualización genérica no reemplaza ese aviso.' },
      { title: 'Elige el canal correcto', detail: 'Para dificultades técnicas de tu cuenta usa la ayuda de myUSCIS. Para consultas sobre el expediente, entra a las herramientas de e-Request y al Centro de Contacto de USCIS.' },
      { title: 'Busca asesoría legal autorizada si la necesitas', detail: 'Si tienes dudas legales o un plazo importante, consulta un abogado habilitado o un representante acreditado. Un “notario” no es automáticamente un abogado de inmigración en Estados Unidos.' },
    ],
    officialLabel: 'Encontrar servicios legales', url: uscisLinks.legalHelp,
    remember: 'No uses FrontierMinds para enviar documentos, códigos de acceso, números de recibo ni información personal de tu expediente.',
  },
] as const;

export type UscisStatus = {
  id: string; english: string; spanish: string; meaning: string; next: string;
};
export const sampleStatuses: readonly UscisStatus[] = [
  { id:'received', english:'Case Was Received', spanish:'Caso recibido', meaning:'USCIS registró la recepción. No significa que el caso haya sido aprobado.', next:'Guarda el recibo, revisa la correspondencia y consulta cambios en el sitio oficial.' },
  { id:'review', english:'Case Is Being Actively Reviewed', spanish:'Caso en revisión', meaning:'Se informó una revisión del expediente. No revela una fecha específica de decisión.', next:'Sigue pendiente de avisos y evita interpretar esta frase como una aprobación próxima.' },
  { id:'rfe', english:'Request for Evidence Was Sent', spanish:'Se envió una solicitud de evidencia (RFE)', meaning:'USCIS indica que envió una petición de documentos o información adicional.', next:'Busca la notificación oficial y lee sus instrucciones y fecha límite. Si tienes dudas, busca asesoría autorizada.' },
  { id:'approved', english:'Case Was Approved', spanish:'Caso aprobado', meaning:'USCIS informa una aprobación de esa solicitud; no confirma que una tarjeta o documento ya fue entregado.', next:'Consulta tu notificación de decisión y los pasos correspondientes al tipo de beneficio.' },
  { id:'mailed', english:'Card Was Mailed', spanish:'Tarjeta enviada', meaning:'USCIS indica que envió una tarjeta. No confirma su entrega.', next:'Revisa los detalles oficiales del envío y la correspondencia a tu dirección registrada.' },
] as const;

export const uscisGlossary = [
  { en:'Receipt Number', es:'Número de recibo', desc:'Identificador de 13 caracteres para consultar una solicitud en el portal de estatus.' },
  { en:'Receipt Notice', es:'Notificación de recibo', desc:'Carta de USCIS que confirma que recibió una solicitud; puede contener el número de recibo.' },
  { en:'USCIS Online Access Code', es:'Código de acceso en línea', desc:'Código separado del número de recibo que USCIS puede enviar para vincular ciertos casos a una cuenta.' },
  { en:'Request for Evidence (RFE)', es:'Solicitud de evidencia', desc:'Notificación que pide información adicional. La carta indica qué hacer y los plazos aplicables.' },
  { en:'Biometrics Appointment', es:'Cita de datos biométricos', desc:'Cita para datos biométricos, cuando corresponda; lee los detalles en el aviso.' },
  { en:'Processing Times', es:'Tiempos de procesamiento', desc:'Estadísticas públicas de duración de casos anteriores; no es una promesa para un expediente individual.' },
] as const;

export const uscisSafety = [
  'No escribas tu número real de recibo en páginas de demostración o comentarios públicos.',
  'No compartas contraseñas, códigos de autenticación ni códigos de acceso de USCIS.',
  'Usa enlaces oficiales .gov y verifica la dirección antes de introducir información.',
  'Las fechas límite que aparecen en tus avisos oficiales tienen prioridad sobre ejemplos generales.',
  'Ante dudas legales, consulta un abogado de inmigración habilitado o un representante acreditado.',
] as const;
