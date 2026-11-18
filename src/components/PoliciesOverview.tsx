import { ArrowUpRight } from "lucide-react";
import { CREATOR_POLICY_RULES } from "../data/planetaKnowledge";

interface PoliciesOverviewProps {
  onAskAboutPolicy: (question: string) => void;
  onOpenApplyModal: () => void;
}

export function PoliciesOverview({
  onAskAboutPolicy,
  onOpenApplyModal,
}: PoliciesOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Garantías y beneficios oficiales de Agencia Planeta
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Nuestro compromiso es transparente desde el primer día: conservas el
            100% de tus ingresos, tu libertad de horarios y la propiedad total de
            tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenApplyModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Solicitar ingreso gratis</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {CREATOR_POLICY_RULES.map((rule) => (
          <section
            key={rule.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="font-mono text-xs font-medium text-blue-600 tabular-nums">
                  {rule.number}. {rule.title}
                </p>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {rule.headline}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {rule.summary}
                </p>
              </div>

              <ul className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-700">
                {rule.bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => onAskAboutPolicy(rule.sampleQuestion)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Consultar a PlanetaBot</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
