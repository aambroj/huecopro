"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SharedAgendaOption = {
  userId: string;
  label: string;
};

type SharedAgendaSelectorProps = {
  options: SharedAgendaOption[];
  selectedUserId: string;
};

function buildNextUrl(params: URLSearchParams, pathname: string) {
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default function SharedAgendaSelector({
  options,
  selectedUserId,
}: SharedAgendaSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasOptions = options.length > 0;

  const selectedOption = useMemo(() => {
    return options.find((option) => option.userId === selectedUserId) ?? null;
  }, [options, selectedUserId]);

  const currentLabel = selectedOption?.label ?? "Mi agenda";

  function handleChange(nextUserId: string) {
    if (nextUserId === selectedUserId) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (!nextUserId) {
      params.delete("shared");
    } else {
      params.set("shared", nextUserId);
    }

    params.delete("edit");
    params.delete("quick");
    params.delete("time");
    params.delete("duration");

    const nextUrl = buildNextUrl(params, pathname);

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  }

  if (!hasOptions) {
    return (
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
              Agenda compartida
            </p>
            <p className="mt-1.5 text-base font-semibold text-slate-900 sm:text-lg">
              Todavía no tienes ninguna agenda conectada
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">
              Cuando conectes otra cuenta, podrás cambiar entre agendas en solo
              lectura desde aquí.
            </p>
          </div>

          <div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              Sin conexiones activas
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 sm:text-sm">
            Agenda compartida
          </p>

          <h2 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Cambiar agenda compartida
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-slate-600 sm:text-base">
            Puedes elegir qué agenda compartida quieres ver o salir de esa vista.
            La agenda ajena es solo lectura y se mantiene la semana y los filtros
            que ya tengas aplicados.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm">
              Solo lectura
            </span>

            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
              {options.length} agenda{options.length === 1 ? "" : "s"} disponible
              {options.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <label
            htmlFor="shared-agenda-selector"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Agenda visible
          </label>

          <select
            id="shared-agenda-selector"
            value={selectedUserId}
            onChange={(event) => handleChange(event.target.value)}
            disabled={isPending}
            className="min-h-[52px] w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
          >
            <option value="">Mi agenda (salir de vista compartida)</option>
            {options.map((option) => (
              <option key={option.userId} value={option.userId}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <p className="text-xs leading-5 text-slate-500 sm:text-sm">
              Mostrando:{" "}
              <span className="font-semibold text-slate-700">
                {currentLabel}
              </span>
            </p>

            {isPending ? (
              <span className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-sm">
                Cambiando...
              </span>
            ) : (
              <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
                Lista
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
