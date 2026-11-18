import type { CreatorFaqItem, PolicyRule } from "../types/planeta";

export const CREATOR_POLICY_RULES: PolicyRule[] = [
  {
    id: "commissions",
    number: "01",
    title: "Ganancias y Comisiones",
    headline: "0% de comisión. El 100% de tus diamantes es tuyo.",
    summary:
      "Agencia Planeta nunca descuenta ni retiene un porcentaje de los regalos, diamantes o ingresos que generas con tu audiencia.",
    bulletPoints: [
      "El 100% de tus ganancias va directo a tu balance en la plataforma.",
      "A Agencia Planeta le paga directamente la plataforma (ej. TikTok) mediante bonos por rendimiento y metas de equipo.",
      "Unirse y permanecer en Agencia Planeta es 100% gratis, sin cuotas ni pagos ocultos.",
    ],
    sampleQuestion:
      "¿Es verdad que no me quitan ningún porcentaje de mis diamantes o regalos?",
  },
  {
    id: "freedom",
    number: "02",
    title: "Horarios y Libertad",
    headline: "Sin jefes ni horarios obligatorios. Tú decides cuándo transmitir.",
    summary:
      "Mantienes el control completo de tu calendario, tu estilo y tu ritmo de creación de contenido.",
    bulletPoints: [
      "No existen horarios impuestos ni multas por días libres.",
      "Recomendamos una constancia mínima de 10 a 15 horas al mes para acelerar tu crecimiento y visibilidad.",
      "Tú tienes siempre la última palabra sobre cuándo y qué transmitir.",
    ],
    sampleQuestion:
      "Yo estudio y trabajo, ¿me van a exigir cumplir un horario fijo de transmisiones?",
  },
  {
    id: "ownership",
    number: "03",
    title: "Propiedad de la Cuenta",
    headline: "Tu perfil es 100% tuyo. Jamás pedimos contraseñas.",
    summary:
      "La seguridad, privacidad y titularidad de tu perfil permanecen siempre bajo tu control exclusivo.",
    bulletPoints: [
      "Nunca solicitamos contraseñas, códigos privados ni acceso a tu cuenta.",
      "Sigues siendo dueño total de tus seguidores, videos e ingresos.",
      "Si en el futuro decides salir de la agencia, conservas tu cuenta intacta y sin penalizaciones.",
    ],
    sampleQuestion:
      "¿Tengo que dar mi contraseña o pierdo mi cuenta si después decido salirme?",
  },
  {
    id: "benefits",
    number: "04",
    title: "Beneficios y Soporte",
    headline: "Soporte técnico 24/7, capacitación y eventos oficiales.",
    summary:
      "Te acompañamos con respaldo técnico real y herramientas prácticas para escalar tus transmisiones y alcance.",
    bulletPoints: [
      "Soporte Técnico 24/7 para ayudarte ante baneos injustos, shadowban o incidencias de cobro.",
      "Academia y Capacitación con asesoría personalizada en iluminación, contenido y retención.",
      "Eventos y Retos de Graduación con batallas oficiales, eventos globales y bonos extra de dinero o tráfico.",
    ],
    sampleQuestion:
      "Si ya hago lives por mi cuenta, ¿qué beneficios reales me da entrar a Agencia Planeta?",
  },
];

export const CREATOR_FAQS: CreatorFaqItem[] = [
  {
    id: "faq-commission",
    pillar: "Ganancias y Comisiones",
    question: "¿Cuánto porcentaje me quita Agencia Planeta de mis diamantes?",
    shortAnswer:
      "Cero (0%). El 100% de tus diamantes, regalos y ganancias es completamente tuyo. A nosotros nos paga directamente la plataforma por metas y rendimiento de equipo.",
  },
  {
    id: "faq-cost",
    pillar: "Ganancias y Comisiones",
    question: "¿Tiene algún costo unirse a la agencia?",
    shortAnswer:
      "No. Unirse a Agencia Planeta es 100% gratis y nunca te pediremos pagos de inscripción ni membresías.",
  },
  {
    id: "faq-schedule",
    pillar: "Horarios y Libertad",
    question: "¿Me exigen horarios obligatorios o un mínimo estricto de horas?",
    shortAnswer:
      "No hay horarios obligatorios ni jefes. Solo recomendamos constancia (al menos 10 a 15 horas al mes) para que veas resultados reales, pero tú decides tus tiempos.",
  },
  {
    id: "faq-password",
    pillar: "Propiedad de la Cuenta",
    question: "¿Me piden mi contraseña o toman control de mi perfil?",
    shortAnswer:
      "Jamás. Tu cuenta es 100% tuya en todo momento. El enlace con la agencia se hace mediante invitación oficial de la plataforma sin compartir accesos privados.",
  },
  {
    id: "faq-leave",
    pillar: "Propiedad de la Cuenta",
    question: "¿Qué pasa si después quiero salirme de la agencia?",
    shortAnswer:
      "Conservas tu cuenta, tu comunidad y todo tu contenido sin ningún tipo de penalización.",
  },
  {
    id: "faq-benefits",
    pillar: "Beneficios y Soporte",
    question: "¿Cómo me ayudan si me banean un live o baja mi alcance?",
    shortAnswer:
      "Cuentas con Soporte Técnico 24/7 para gestionar apelaciones por baneos injustos, revisar shadowban o resolver incidencias de cobro, además de asesoría personalizada en Academia.",
  },
  {
    id: "faq-events",
    pillar: "Beneficios y Soporte",
    question: "¿Qué son los retos de graduación y eventos oficiales?",
    shortAnswer:
      "Al formar parte de Agencia Planeta accedes a batallas oficiales, eventos globales de la plataforma y retos internos con bonos extra de tráfico o dinero.",
  },
  {
    id: "faq-join",
    pillar: "Proceso de Ingreso",
    question: "¿Cómo solicito mi ingreso a Agencia Planeta?",
    shortAnswer:
      "Solo necesitas compartirnos tu @usuario público para verificar tu perfil y enviarte la invitación oficial desde la plataforma, sin costo y sin contraseñas.",
  },
];

export const STARTER_CREATOR_QUESTIONS: string[] = [
  "¿Cuánto porcentaje cobran de mis diamantes?",
  "¿Tengo que cumplir horarios obligatorios?",
  "¿Piden mi contraseña o se quedan con mi cuenta?",
  "¿Qué beneficios y soporte me dan como creador?",
];
