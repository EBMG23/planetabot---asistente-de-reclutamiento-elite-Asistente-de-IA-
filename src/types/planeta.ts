export type CreatorPlatform = "TikTok" | "Instagram" | "YouTube" | "Otra";

export type PolicyPillar =
  | "Ganancias y Comisiones"
  | "Horarios y Libertad"
  | "Propiedad de la Cuenta"
  | "Beneficios y Soporte"
  | "Proceso de Ingreso"
  | "Información General";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  createdAt: string;
  policyTopic?: PolicyPillar;
  suggestedQuestions?: string[];
}

export interface ChatApiResponse {
  reply: string;
  policyTopic: PolicyPillar;
  suggestedQuestions: string[];
}

export interface CreatorFaqItem {
  id: string;
  question: string;
  shortAnswer: string;
  pillar: PolicyPillar;
}

export interface PolicyRule {
  id: string;
  number: string;
  title: PolicyPillar;
  headline: string;
  summary: string;
  bulletPoints: string[];
  sampleQuestion: string;
}

export interface CreatorApplicationResult {
  id: string;
  handle: string;
  platform: string;
  contact: string;
  submittedAt: string;
}
