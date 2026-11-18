import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CREATOR_FAQS } from "../data/planetaKnowledge";
import type { CreatorFaqItem, PolicyPillar } from "../types/planeta";

interface FaqLibraryProps {
  onAskInChat: (question: string) => void;
}

const FAQ_FILTERS: ("Todas" | PolicyPillar)[] = [
  "Todas",
  "Ganancias y Comisiones",
  "Horarios y Libertad",
  "Propiedad de la Cuenta",
  "Beneficios y Soporte",
  "Proceso de Ingreso",
];

export function FaqLibrary({ onAskInChat }: FaqLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<"Todas" | PolicyPillar>(
    "Todas"
  );

  const filtered = useMemo(() => {
    return CREATOR_FAQS.filter((item) => {
      const matchesPillar =
        selectedPillar === "Todas" || item.pillar === selectedPillar;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.pillar.toLowerCase().includes(q);
      return matchesPillar && matchesQuery;
    });
  }, [search, selectedPillar]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Preguntas frecuentes de creadores
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Respuestas directas sobre cómo funciona Agencia Planeta. Si quieres
            profundizar en alguna, envíala directo al chat con PlanetaBot.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar duda (ej. diamantes, contraseña)..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filtrar preguntas por categoría"
        className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 w-fit"
      >
        {FAQ_FILTERS.map((pillar) => {
          const active = selectedPillar === pillar;
          return (
            <button
              key={pillar}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedPillar(pillar)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {pillar}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            No encontramos preguntas con ese término
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Puedes preguntarle directamente a PlanetaBot en el chat o limpiar el
            filtro.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedPillar("Todas");
            }}
            className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Ver todas las preguntas
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((faq: CreatorFaqItem) => (
            <article
              key={faq.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">
                  {faq.pillar}
                </p>
                <h2 className="font-display text-base font-bold text-slate-900">
                  {faq.question}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.shortAnswer}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => onAskInChat(faq.question)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Ampliar en el chat</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
