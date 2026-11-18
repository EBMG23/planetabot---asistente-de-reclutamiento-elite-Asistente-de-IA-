import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplyModal } from "./components/ApplyModal";
import { CreatorChat } from "./components/CreatorChat";
import { FaqLibrary } from "./components/FaqLibrary";
import { PoliciesOverview } from "./components/PoliciesOverview";
import { TopBar, type WorkspaceView } from "./components/TopBar";
import {
  CREATOR_POLICY_RULES,
  STARTER_CREATOR_QUESTIONS,
} from "./data/planetaKnowledge";
import type {
  ChatApiResponse,
  ChatMessage,
  CreatorPlatform,
} from "./types/planeta";

const CHAT_STORAGE_KEY = "planetabot_creator_chat_v1";

function createWelcomeMessage(): ChatMessage {
  return {
    id: "welcome-message",
    role: "model",
    createdAt: new Date().toISOString(),
    policyTopic: "Información General",
    text: [
      "¡Hola! Soy PlanetaBot, el asistente oficial de Agencia Planeta.",
      "Estoy aquí para contarte con total transparencia cómo trabajamos con creadores de contenido: conservas el 100% de tus diamantes y ganancias, no tienes horarios obligatorios y tu cuenta sigue siendo siempre 100% tuya.",
      "Cuéntame qué dudas tienes sobre cómo funciona la agencia, nuestros beneficios 24/7 o cómo unirte gratis.",
    ].join("\n\n"),
    suggestedQuestions: [
      "¿Cuánto porcentaje cobran?",
      "¿Qué beneficios tiene entrar?",
      "¿Cómo me uno gratis?",
    ],
  };
}

function loadStoredMessages(): ChatMessage[] {
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return [createWelcomeMessage()];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [createWelcomeMessage()];
  } catch {
    return [createWelcomeMessage()];
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>("chat");
  const [platform, setPlatform] = useState<CreatorPlatform>("TikTok");
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadStoredMessages()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify(messages.slice(-30))
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

  const sendConversationToApi = async (conversation: ChatMessage[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Only send messages starting from the first user turn so Gemini starts with user role
      const firstUserIndex = conversation.findIndex((m) => m.role === "user");
      const historyToSend =
        firstUserIndex >= 0 ? conversation.slice(firstUserIndex) : conversation;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorPlatform: platform,
          messages: historyToSend.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload?.error || "No pudimos responder en este momento."
        );
      }

      const data = payload as ChatApiResponse;
      const modelMessage: ChatMessage = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `model-${Date.now()}`,
        role: "model",
        text: data.reply,
        policyTopic: data.policyTopic,
        suggestedQuestions: Array.isArray(data.suggestedQuestions)
          ? data.suggestedQuestions.slice(0, 3)
          : [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error de conexión al consultar a PlanetaBot.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned || isLoading) return;

    const userMessage: ChatMessage = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `user-${Date.now()}`,
      role: "user",
      text: cleaned,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setActiveView("chat");
    void sendConversationToApi(nextMessages);
  };

  const handleRetryLast = () => {
    if (isLoading || messages.length === 0) return;
    void sendConversationToApi(messages);
  };

  const handleResetChat = () => {
    setMessages([createWelcomeMessage()]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
      />

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeView === "chat" && (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Primary Conversational Column */}
            <div className="lg:col-span-8">
              <CreatorChat
                messages={messages}
                platform={platform}
                onChangePlatform={setPlatform}
                isLoading={isLoading}
                error={error}
                onSendMessage={handleSendMessage}
                onRetryLast={handleRetryLast}
                onResetChat={handleResetChat}
                onOpenApplyModal={() => setIsApplyModalOpen(true)}
              />
            </div>

            {/* Right Companion Reference Column */}
            <aside className="lg:col-span-4 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-600">
                    <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold">
                      Garantías Agencia Planeta
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-slate-950">
                    Lo que debes saber antes de unirte
                  </h2>
                </div>

                <ul className="divide-y divide-slate-100 border-y border-slate-100 text-sm">
                  <li className="py-3 flex items-start gap-2.5">
                    <Check
                      className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        0% comisión sobre tus ganancias
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        El 100% de tus diamantes y regalos es tuyo. Unirse es
                        100% gratis.
                      </p>
                    </div>
                  </li>
                  <li className="py-3 flex items-start gap-2.5">
                    <Check
                      className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Sin horarios obligatorios ni jefes
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Manejas tu tiempo con libertad (recomendamos 10–15 h al
                        mes para ver resultados).
                      </p>
                    </div>
                  </li>
                  <li className="py-3 flex items-start gap-2.5">
                    <Check
                      className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Tu cuenta es 100% tuya
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Nunca pedimos contraseñas y puedes salirte cuando
                        quieras sin penalización.
                      </p>
                    </div>
                  </li>
                  <li className="py-3 flex items-start gap-2.5">
                    <Check
                      className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Soporte 24/7, Academia y Eventos
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Ayuda con baneos injustos o shadowban, asesoría y
                        batallas oficiales.
                      </p>
                    </div>
                  </li>
                </ul>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer"
                  >
                    <span>Solicitar ingreso gratis</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView("policies")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Ver todas las políticas oficiales
                  </button>
                </div>
              </div>

              {/* Quick Topic Prompts */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Preguntas rápidas
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveView("faqs")}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Ver FAQ
                  </button>
                </div>
                <div className="grid gap-2">
                  {STARTER_CREATOR_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(q)}
                      className="text-left rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                  {CREATOR_POLICY_RULES.slice(3, 4).map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(rule.sampleQuestion)}
                      className="text-left rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                    >
                      ¿Cómo funcionan los eventos y retos?
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeView === "faqs" && (
          <FaqLibrary onAskInChat={handleSendMessage} />
        )}

        {activeView === "policies" && (
          <PoliciesOverview
            onAskAboutPolicy={handleSendMessage}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <span>
            Agencia Planeta · Asistente informativo para creadores de contenido
          </span>
          <span>
            Ingreso 100% gratuito · 0% retención de ganancias · Cuenta siempre
            tuya
          </span>
        </div>
      </footer>

      <ApplyModal
        isOpen={isApplyModalOpen}
        defaultPlatform={platform}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccessInChat={(summaryText) => handleSendMessage(summaryText)}
      />
    </div>
  );
}
