export type Phrase = { en: string; es: string };
type SchoolScenario = {
  id: string;
  goal: string;
  opening: Phrase;
  office: Phrase;
  replies: [Phrase, Phrase];
  followUp: Phrase;
};

export const schoolDirectory = 'https://www2.palmbeachschools.org/directorysearch/indexportal.html';

export const schoolScenarios: SchoolScenario[] = [
  {
    id: 'documentos', goal: 'Preguntar qué documentos llevar',
    followUp: { en: 'Who can I contact if I am missing a document?', es: '¿Con quién puedo hablar si me falta un documento?' },
    opening: { en: 'Hello. Which documents should I bring to register my child?', es: 'Hola. ¿Qué documentos debo llevar para inscribir a mi hijo o hija?' },
    office: { en: 'Would you like us to go over the list together?', es: '¿Quiere que repasemos la lista juntos?' },
    replies: [
      { en: 'Yes, please. Could you read the list slowly so I can write it down?', es: 'Sí, por favor. ¿Podría leer la lista despacio para que pueda anotarla?' },
      { en: 'Could you tell me where to find the list in Spanish?', es: '¿Podría decirme dónde encontrar la lista en español?' },
    ],
  },
  {
    id: 'cita', goal: 'Preguntar si necesito una cita',
    followUp: { en: 'If I need to change the appointment, whom should I call?', es: 'Si necesito cambiar la cita, ¿a quién debo llamar?' },
    opening: { en: 'Hello. Do I need an appointment to register my child?', es: 'Hola. ¿Necesito una cita para inscribir a mi hijo o hija?' },
    office: { en: 'What would you like to know about visiting our office?', es: '¿Qué le gustaría saber sobre su visita a nuestra oficina?' },
    replies: [
      { en: 'How can I arrange a time to come in?', es: '¿Cómo puedo acordar una hora para ir?' },
      { en: 'Which office should I go to when I arrive?', es: '¿A qué oficina debo ir cuando llegue?' },
    ],
  },
  {
    id: 'idioma', goal: 'Pedir ayuda en español',
    followUp: { en: 'What is the best way to ask for help in Spanish next time I call?', es: '¿Cuál es la mejor manera de pedir ayuda en español la próxima vez que llame?' },
    opening: { en: 'Hello. Is someone available to help me in Spanish with school registration?', es: 'Hola. ¿Hay alguien que pueda ayudarme en español con la inscripción escolar?' },
    office: { en: 'What part of registration would you like help with?', es: '¿Con qué parte de la inscripción le gustaría recibir ayuda?' },
    replies: [
      { en: 'I would like help understanding the forms. Who should I speak with?', es: 'Me gustaría que me ayudaran a entender los formularios. ¿Con quién debo hablar?' },
      { en: 'Could you tell me how to request an interpreter for my visit?', es: '¿Podría decirme cómo pedir un intérprete para mi visita?' },
    ],
  },
];

export const closing: Phrase = { en: 'Thank you for your help. Have a good day.', es: 'Gracias por su ayuda. Que tenga un buen día.' };

export function callScript(phrases: Phrase[]) {
  return phrases.map(({ en, es }) => en + '\n' + es).join('\n\n');
}
