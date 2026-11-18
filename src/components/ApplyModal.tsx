import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  CreatorApplicationResult,
  CreatorPlatform,
} from "../types/planeta";

interface ApplyModalProps {
  isOpen: boolean;
  defaultPlatform: CreatorPlatform;
  onClose: () => void;
  onSuccessInChat: (summary: string) => void;
}

const PLATFORMS: CreatorPlatform[] = ["TikTok", "Instagram", "YouTube", "Otra"];

export function ApplyModal({
  isOpen,
  defaultPlatform,
  onClose,
  onSuccessInChat,
}: ApplyModalProps) {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<CreatorPlatform>(defaultPlatform);

  useEffect(() => {
    if (isOpen) {
      setPlatform(defaultPlatform);
    }
  }, [isOpen, defaultPlatform]);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<CreatorApplicationResult | null>(
    null
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/creators/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, platform, contact, notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "No pudimos registrar tu solicitud.");
      }

      setSubmitted(data.application as CreatorApplicationResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error de conexión al enviar tu solicitud."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (submitted) {
      onSuccessInChat(
        `Acabo de enviar mi solicitud de ingreso con el usuario ${submitted.handle} en ${submitted.platform} (referencia ${submitted.id}). ¿Qué sigue ahora?`
      );
    }
    setSubmitted(null);
    setHandle("");
    setContact("");
    setNotes("");
    setError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2
              id="apply-modal-title"
              className="font-display text-lg font-bold text-slate-950"
            >
              Solicitar ingreso gratuito a Agencia Planeta
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              100% gratis · Nunca pedimos contraseñas ni accesos privados
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Solicitud registrada correctamente
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Referencia{" "}
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {submitted.id}
                  </span>{" "}
                  para{" "}
                  <span className="font-semibold text-slate-900">
                    {submitted.handle}
                  </span>{" "}
                  ({submitted.platform}). Nuestro equipo revisará tu perfil
                  público y te contactará para enviarte la invitación oficial.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleFinish}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                Continuar en el chat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="apply-handle"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Tu @usuario público
              </label>
              <input
                id="apply-handle"
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Ej: @camilalive"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Plataforma principal
              </span>
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1">
                {PLATFORMS.map((p) => {
                  const active = platform === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
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
            </div>

            <div>
              <label
                htmlFor="apply-contact"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                WhatsApp o Instagram para enviarte la invitación
              </label>
              <input
                id="apply-contact"
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Ej: +52 55 1234 5678 o IG @camilalive"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
              />
            </div>

            <div>
              <label
                htmlFor="apply-notes"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                ¿En qué te gustaría que te ayudemos primero? (opcional)
              </label>
              <textarea
                id="apply-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Mejorar retención en lives, batallas oficiales, soporte técnico..."
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15 resize-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Enviar solicitud</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
