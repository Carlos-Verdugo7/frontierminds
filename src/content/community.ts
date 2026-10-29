export type CommunityTopic = 'luz' | 'empleo' | 'escuela' | 'ingles';
export type CommunityGuide = {
  id: CommunityTopic; title: string; label: string; description: string;
  steps: string[]; prepare: string[]; note: string;
  sources: { label: string; url: string }[];
  contact: { label: string; href: string }; reviewed: string;
};

export const communityGuides: CommunityGuide[] = [
  {
    id: 'luz', label: 'Luz y servicios', title: 'Necesito ayuda con la luz',
    description: 'Conoce las opciones de FPL y encuentra una agencia que reciba tu solicitud en Palm Beach County.',
    steps: [
      'Revisa tu factura y la fecha de vencimiento. En el centro de ayuda de FPL puedes consultar si tienes una extensión de pago disponible.',
      'Consulta la lista de agencias de FPL para Palm Beach County. Pregunta por LIHEAP o Care To Share y por la disponibilidad de fondos.',
      'Llama a Palm Beach County al 561-355-4792 para preguntar cómo iniciar la solicitud y confirmar los documentos que te pedirán.',
      'Presenta la solicitud directamente a la agencia y guarda su número de confirmación para consultar el estado.',
    ],
    prepare: ['Factura de FPL y número de cuenta', 'Aviso de atraso o desconexión, si lo tienes', 'Identificación, comprobante de domicilio e ingresos: confirma la lista con la agencia'],
    note: 'La agencia determina los requisitos y la elegibilidad. La ayuda depende de los fondos disponibles; una solicitud no garantiza el pago ni detiene una desconexión.',
    sources: [{ label: 'Centro de asistencia de FPL', url: 'https://www.fpl.com/assistance.html' }, { label: 'Agencias de ayuda por condado — FPL', url: 'https://www.fpl.com/help/assistance.html' }],
    contact: { label: 'Llamar al condado: 561-355-4792', href: 'tel:+15613554792' }, reviewed: '2026-10-29',
  },
  {
    id: 'empleo', label: 'Trabajo', title: 'Busco trabajo',
    description: 'Da el primer paso con apoyo para buscar empleo, preparar tu résumé y practicar entrevistas.',
    steps: [
      'Visita CareerSource Palm Beach County y consulta los servicios para personas que buscan empleo.',
      'Pide orientación para tu búsqueda, tu résumé o una entrevista. Pregunta si hay atención en español.',
      'Consulta los eventos de contratación y las oportunidades de capacitación que se ajusten a tu experiencia.',
      'Antes de ir en persona, confirma la ubicación, el horario y si necesitas una cita con CareerSource.',
    ],
    prepare: ['Lista de trabajos anteriores y habilidades', 'Tu résumé, si tienes uno', 'Preguntas sobre el tipo de trabajo y horario que buscas'],
    note: 'CareerSource ofrece orientación y conexiones con empleadores. Los requisitos de cada empleo o programa son distintos; confirma los detalles con el proveedor.',
    sources: [{ label: 'CareerSource Palm Beach County', url: 'https://www.careersourcepbc.com/' }, { label: 'Servicios y orientación para empezar', url: 'https://www.careersourcepbc.com/welcome/' }],
    contact: { label: 'Visitar CareerSource', href: 'https://www.careersourcepbc.com/' }, reviewed: '2026-10-29',
  },
  {
    id: 'escuela', label: 'Escuela', title: 'Quiero inscribir a mis hijos',
    description: 'Encuentra la escuela que corresponde a tu domicilio y prepara la inscripción con el distrito escolar.',
    steps: [
      'Abre la página oficial de inscripción y usa Find My School con tu dirección para identificar tu escuela.',
      'Contacta a esa escuela para confirmar cómo entregar la documentación y pedir apoyo en español.',
      'Reúne los documentos y formularios que indica el distrito. La página incluye formularios en español.',
      'Las familias nuevas pueden consultar la inscripción en línea. Si tu hijo ya tiene un número de estudiante del distrito, consulta la inscripción presencial con su escuela.',
    ],
    prepare: ['Dos comprobantes actuales de domicilio', 'Comprobante de nacimiento', 'Registro de vacunas DH 680 o DH 681 y examen físico DH 3040', 'Formularios de inscripción y documentos de la escuela anterior, si los tienes'],
    note: 'Si te falta algún documento o no tienes vivienda estable, contacta a la escuela para conocer el apoyo y las alternativas disponibles. Confirma los requisitos para tu situación antes de completar la inscripción.',
    sources: [{ label: 'Inscripción y formularios — distrito escolar', url: 'https://www.palmbeachschools.org/studentsparents/student-registration' }],
    contact: { label: 'Abrir la inscripción del distrito', href: 'https://www.palmbeachschools.org/studentsparents/student-registration' }, reviewed: '2026-10-29',
  },
  {
    id: 'ingles', label: 'Inglés y lectura', title: 'Quiero aprender inglés',
    description: 'Explora el apoyo de alfabetización para adultos y las oportunidades de conversación en la biblioteca del condado.',
    steps: [
      'Abre Adult Literacy de Palm Beach County Library System para conocer las opciones de apoyo.',
      'Consulta English Exchange si buscas practicar conversación. La biblioteca recomienda un nivel intermedio para este programa.',
      'Revisa el calendario de eventos para confirmar la sede, el horario y la inscripción de cada sesión.',
      'Escribe a literacy@pbclibrary.org y pregunta qué opción se adapta a tu nivel, especialmente si estás empezando.',
    ],
    prepare: ['Tu nivel de inglés y lo que quieres aprender', 'Los días y horarios en que puedes participar', 'Preguntas sobre inscripción y requisitos del programa'],
    note: 'Los horarios y cupos pueden cambiar. Confirma los detalles del evento antes de viajar; English Exchange es una opción de conversación y puede no ser la mejor primera clase para principiantes.',
    sources: [{ label: 'Adult Literacy y English Exchange — biblioteca del condado', url: 'https://www.pbclibrary.org/adult-literacy/' }],
    contact: { label: 'Escribir a literacy@pbclibrary.org', href: 'mailto:literacy@pbclibrary.org' }, reviewed: '2026-10-29',
  },
];

// Editorial posts: add reviewed, dated entries here; never publish visitor messages.
export const communityPosts = [
  { id: 'bienvenidos', date: '2026-10-29', title: 'Empezamos en West Palm Beach', text: 'Este espacio reúne pasos y fuentes para familias que buscan apoyo. Empezamos con luz, empleo, escuela e inglés. Cuéntanos qué tema falta y qué parte del proceso te resulta difícil.' },
  { id: 'ia-primer-paso', date: '2026-10-29', title: 'Usa la IA para preparar tu próxima conversación', text: 'Elige una guía y pide una lista de preparación o un borrador de preguntas en inglés. Revisa el resultado con la fuente oficial antes de usarlo. No necesitas compartir datos personales.' },
];

export const communityTasks = {
  pasos: 'Explicar los pasos en español sencillo',
  lista: 'Preparar una lista para mi próxima llamada o visita',
  preguntas: 'Redactar preguntas en inglés con traducción al español',
} as const;
