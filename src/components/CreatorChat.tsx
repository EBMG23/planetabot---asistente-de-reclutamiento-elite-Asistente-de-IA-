import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  RotateCcw,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { STARTER_CREATOR_QUESTIONS } from "../data/planetaKnowledge";
import type { ChatMessage, CreatorPlatform } from "../types/planeta";

interface CreatorChatProps {
  messages: ChatMessage[];
  platform: CreatorPlatform;
  onChangePlatform: (platform: CreatorPlatform) => void;
  isLoading: boolean;
  error: string | null;
  onSendMessage: (text: string) => void;
  onRetryLast: () => void;
  onResetChat: () => void;
  onOpenApplyModal: () => void;
}

const PLATFORMS: CreatorPlatform[] = ["TikTok", "Instagram", "YouTube", "Otra"];

export function CreatorChat({
  messages,
  platform,
  onChangePlatform,
  isLoading,
  error,
  onSendMessage,
  onRetryLast,
  onResetChat,
  onOpenApplyModal,
}: CreatorChatProps) {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = input.trim();
    if (!cleaned || isLoading) return;
    setInput("");
    onSendMessage(cleaned);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const cleaned = input.trim();
      if (!cleaned || isLoading) return;
      setInput("");
      onSendMessage(cleaned);
    }
  };

  const handleCopyReply = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr));
      }, 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden min-h-[600px] lg:h-[calc(100vh-11rem)]">
      {/* Chat Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5 bg-white">
        <div className="space-y-0.5">
          <h1 className="font-display text-base font-bold text-slate-950">
            Asistente informativo para creadores
          </h1>
          <p className="text-xs text-slate-500">
            Agencia Planeta · Respuestas transparentes sobre ingresos, horarios,
            seguridad y beneficios
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            role="radiogroup"
            aria-label="Tu plataforma principal"
            className="hidden sm:flex items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {PLATFORMS.map((p) => {
              const active = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChangePlatform(p)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {hasUserMessages && (
            <button
              type="button"
              onClick={onResetChat}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reiniciar chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-slate-50/40">
        {messages.map((msg, index) => {
          const isModel = msg.role === "model";
          const isLatestModel =
            isModel && index === messages.length - 1 && !isLoading;
          const timeLabel = new Date(msg.createdAt).toLocaleTimeString(
            "es-ES",
            { hour: "2-digit", minute: "2-digit" }
          );

          if (!isModel) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl space-y-1 text-right">
                  <div className="inline-block rounded-xl bg-slate-900 px-4 py-3 text-left text-[15px] leading-relaxed text-white">
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 tabular-nums">
                    Tú · {timeLabel}
                  </p>
                </div>
              </div>
            );
          }

          const paragraphs = msg.text
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean);

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-900">
                    PlanetaBot
                  </span>
                  {msg.policyTopic && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{msg.policyTopic}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{timeLabel}</span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 space-y-3 text-[15px] leading-relaxed text-slate-800">
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCopyReply(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copiar respuesta</span>
                        </>
                      )}
                    </button>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={onOpenApplyModal}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <span>Solicitar ingreso gratis</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isLatestModel &&
                  msg.suggestedQuestions &&
                  msg.suggestedQuestions.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <p className="text-xs font-medium text-slate-500">
                        También puedes preguntar:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => onSendMessage(q)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-slate-950 cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          );
        })}

        {!hasUserMessages && !isLoading && (
          <div className="max-w-2xl space-y-2.5 pt-2">
            <p className="text-xs font-medium text-slate-500">
              Dudas más frecuentes de nuevos creadores:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {STARTER_CREATOR_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onSendMessage(question)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:border-blue-300 hover:bg-slate-50 cursor-pointer"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start" aria-busy="true">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 inline-flex items-center gap-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span>PlanetaBot está escribiendo tu respuesta...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-white p-4 max-w-xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-slate-700">{error}</p>
                <button
                  type="button"
                  onClick={onRetryLast}
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reintentar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 bg-white p-4"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="creator-chat-input" className="sr-only">
              Escribe tu pregunta sobre Agencia Planeta
            </label>
            <textarea
              id="creator-chat-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregúntame lo que quieras sobre ganancias, horarios, tu cuenta o cómo unirte..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/15 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-45 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span>Enviar</span>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Enter para enviar · Shift + Enter para salto de línea
        </p>
      </form>
    </div>
  );
}
