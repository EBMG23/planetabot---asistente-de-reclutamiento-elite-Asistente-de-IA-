import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export type WorkspaceView = "chat" | "faqs" | "policies";

interface TopBarProps {
  activeView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onOpenApplyModal: () => void;
}

const PLANETA_LOGO_SRC = "/assets/aistudio/imagen_2026-11-18_112726294_b4b86508.png";

export function TopBar({
  activeView,
  onSelectView,
  onOpenApplyModal,
}: TopBarProps) {
  const [logoError, setLogoError] = useState(false);

  const navItems: { id: WorkspaceView; label: string }[] = [
    { id: "chat", label: "Asistente" },
    { id: "faqs", label: "Preguntas Frecuentes" },
    { id: "policies", label: "Políticas y Beneficios" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onSelectView("chat")}
          className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md py-1 cursor-pointer"
        >
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-200 shadow-xs shrink-0">
            {!logoError ? (
              <img
                src={PLANETA_LOGO_SRC}
                alt="Logo de Agencia Planeta"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-full w-full object-cover object-center scale-110"
              />
            ) : (
              <span className="font-display text-sm font-bold text-white">
                AP
              </span>
            )}
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            PlanetaBot
          </span>
        </button>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 overflow-x-auto"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm cursor-pointer ${
                  isActive
                    ? "text-slate-950 font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenApplyModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Unirme gratis</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <nav
        aria-label="Navegación móvil"
        className="flex md:hidden items-center gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2"
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-slate-600"
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
