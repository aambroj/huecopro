"use client";

import SharedLinkActions from "@/components/SharedLinkActions";

type ActiveSharedLinkItem = {
  id: string;
  label: string;
  description?: string | null;
};

type ActiveSharedLinksListProps = {
  links: ActiveSharedLinkItem[];
};

export default function ActiveSharedLinksList({
  links,
}: ActiveSharedLinksListProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Dejar de compartir con
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Aquí ves las conexiones activas. Si dejas de compartir, ambos dejaréis
          de ver la agenda del otro.
        </p>
      </div>

      {links.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
          No tienes ninguna conexión activa ahora mismo.
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900">
                  {link.label}
                </p>

                {link.description ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {link.description}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0">
                <SharedLinkActions linkId={link.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}