import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import EditSharedLinkAliasForm from "@/components/EditSharedLinkAliasForm";
import DeactivateSharedLinkForm, {
  type ActiveLinkOption,
} from "@/components/DeactivateSharedLinkForm";

export const dynamic = "force-dynamic";

type InviteRow = {
  id: string;
  inviter_user_id: string;
  inviter_email: string | null;
  invitee_email: string;
  invitee_user_id: string | null;
  status: string;
  alias_for_inviter: string | null;
  alias_for_invitee: string | null;
  created_at: string | null;
};

type LinkRow = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  is_active: boolean;
  created_at?: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

type ActiveLinkCard = {
  id: string;
  inviteId: string | null;
  partnerUserId: string;
  title: string;
  partnerEmail: string | null;
  createdAt: string | null;
  aliasPlaceholder: string;
};

function normalizeEmail(value: string | null | undefined) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(date);
}

function getDisplayNameFromProfile(profile: ProfileRow | null | undefined) {
  const name = profile?.full_name?.trim();
  return name || null;
}

function getPendingIncomingLabel(invite: InviteRow) {
  return invite.alias_for_invitee?.trim()
    ? invite.alias_for_invitee.trim()
    : invite.inviter_email?.trim()
      ? invite.inviter_email.trim()
      : "Profesional pendiente";
}

function getPendingOutgoingLabel(invite: InviteRow) {
  return invite.alias_for_inviter?.trim()
    ? invite.alias_for_inviter.trim()
    : invite.invitee_email?.trim()
      ? invite.invitee_email.trim()
      : "Profesional invitado";
}

export default async function CompartirPage() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?redirectTo=/compartir");
  }

  const currentUserId = user.id;
  const currentUserEmail = normalizeEmail(user.email);

  const [{ data: invitesData }, { data: linksData }, { data: profilesData }] =
    await Promise.all([
      supabase
        .from("shared_agenda_invites")
        .select(
          "id, inviter_user_id, inviter_email, invitee_email, invitee_user_id, status, alias_for_inviter, alias_for_invitee, created_at"
        )
        .or(
          `inviter_user_id.eq.${currentUserId},invitee_user_id.eq.${currentUserId},invitee_email.eq.${currentUserEmail}`
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("shared_agenda_links")
        .select("id, user_a_id, user_b_id, is_active, created_at")
        .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, full_name"),
    ]);

  const invites = ((invitesData as InviteRow[] | null) ?? []).filter(Boolean);
  const links = ((linksData as LinkRow[] | null) ?? []).filter(Boolean);
  const profiles = ((profilesData as ProfileRow[] | null) ?? []).filter(Boolean);

  const profileMap = new Map<string, ProfileRow>();
  for (const profile of profiles) {
    profileMap.set(profile.id, profile);
  }

  const incomingPendingInvites = invites.filter((invite) => {
    const isPending = invite.status === "pending";
    const belongsToCurrentUser =
      invite.invitee_user_id === currentUserId ||
      normalizeEmail(invite.invitee_email) === currentUserEmail;

    return isPending && belongsToCurrentUser && invite.inviter_user_id !== currentUserId;
  });

  const outgoingPendingInvites = invites.filter((invite) => {
    return invite.status === "pending" && invite.inviter_user_id === currentUserId;
  });

  const activeLinks = links.filter((link) => link.is_active);

  const activeLinkCards: ActiveLinkCard[] = activeLinks.map((link) => {
    const partnerUserId =
      link.user_a_id === currentUserId ? link.user_b_id : link.user_a_id;

    const partnerProfile = profileMap.get(partnerUserId);

    const matchingInvite = invites.find((invite) => {
      const samePair =
        (invite.inviter_user_id === currentUserId &&
          invite.invitee_user_id === partnerUserId) ||
        (invite.inviter_user_id === partnerUserId &&
          invite.invitee_user_id === currentUserId);

      return samePair && invite.status === "accepted";
    });

    const aliasForCurrentUser =
      matchingInvite?.inviter_user_id === currentUserId
        ? matchingInvite.alias_for_inviter
        : matchingInvite?.alias_for_invitee;

    const partnerEmail =
      matchingInvite?.inviter_user_id === currentUserId
        ? matchingInvite.invitee_email
        : matchingInvite?.inviter_email;

    const fallbackName =
      getDisplayNameFromProfile(partnerProfile) ||
      partnerEmail?.trim() ||
      "Profesional conectado";

    const visibleName = aliasForCurrentUser?.trim() || fallbackName;

    return {
      id: String(link.id),
      inviteId: matchingInvite?.id ?? null,
      partnerUserId,
      title: visibleName,
      partnerEmail: partnerEmail?.trim() || null,
      createdAt: link.created_at ?? null,
      aliasPlaceholder: partnerEmail?.trim()
        ? `Ejemplo: ${partnerEmail.trim()}`
        : "Nombre para este compañero",
    };
  });

  const activeLinkOptions: ActiveLinkOption[] = activeLinkCards.map((link) => ({
    id: link.id,
    label: link.title,
    aliasPlaceholder: link.aliasPlaceholder,
  }));

  const activeAliasOptions = activeLinkCards
    .filter((link) => Boolean(link.inviteId))
    .map((link) => ({
      id: String(link.inviteId),
      label: link.title,
      placeholder: link.aliasPlaceholder,
    }));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
            Compartir agenda
          </span>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Comparte tu agenda con otros profesionales
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Aquí puedes invitar a otro profesional para que vea tu agenda y tú la
            suya en modo solo lectura. La conexión se puede desactivar cuando quieras.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Conexiones activas
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {activeLinks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Invitaciones recibidas
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {incomingPendingInvites.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Invitaciones enviadas
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {outgoingPendingInvites.length}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Conexiones activas
            </h2>
            <p className="text-sm text-slate-600">
              Estas son las agendas que ahora mismo tienes conectadas.
            </p>
          </div>

          {activeLinkCards.length ? (
            <div className="mt-5 space-y-4">
              {activeLinkCards.map((link) => (
                <article
                  key={link.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-slate-900">
                        {link.title}
                      </h3>

                      {link.partnerEmail ? (
                        <p className="mt-1 break-all text-sm text-slate-600">
                          {link.partnerEmail}
                        </p>
                      ) : null}

                      <p className="mt-2 text-xs text-slate-500">
                        Conectado desde {formatDate(link.createdAt)}
                      </p>
                    </div>

                    <Link
                      href={`/agenda?shared=${encodeURIComponent(link.partnerUserId)}#agenda-compartida`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      Ver esta agenda
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">
                Todavía no tienes ninguna conexión activa.
              </p>
            </div>
          )}

          <div className="mt-6 min-w-0">
            <EditSharedLinkAliasForm links={activeAliasOptions} />
          </div>

          <div className="mt-6 min-w-0">
            <DeactivateSharedLinkForm links={activeLinkOptions} />
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Invitaciones recibidas
              </h2>
              <p className="text-sm text-slate-600">
                Si aceptas, ambos podréis ver la agenda del otro en modo lectura.
              </p>
            </div>

            {incomingPendingInvites.length ? (
              <div className="mt-5 space-y-4">
                {incomingPendingInvites.map((invite) => (
                  <article
                    key={invite.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="text-base font-semibold text-slate-900">
                      {getPendingIncomingLabel(invite)}
                    </h3>

                    {invite.inviter_email ? (
                      <p className="mt-1 break-all text-sm text-slate-600">
                        {invite.inviter_email}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs text-slate-500">
                      Recibida el {formatDate(invite.created_at)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <form
                        action={`/api/compartir/invitaciones/${invite.id}`}
                        method="post"
                      >
                        <input type="hidden" name="action" value="accept" />
                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Aceptar
                        </button>
                      </form>

                      <form
                        action={`/api/compartir/invitaciones/${invite.id}`}
                        method="post"
                      >
                        <input type="hidden" name="action" value="reject" />
                        <button
                          type="submit"
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                        >
                          Rechazar
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">
                  No tienes invitaciones pendientes de aceptar.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">
                Invitaciones enviadas
              </h2>
              <p className="text-sm text-slate-600">
                Estas son las invitaciones que todavía están esperando respuesta.
              </p>
            </div>

            {outgoingPendingInvites.length ? (
              <div className="mt-5 space-y-4">
                {outgoingPendingInvites.map((invite) => (
                  <article
                    key={invite.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="text-base font-semibold text-slate-900">
                      {getPendingOutgoingLabel(invite)}
                    </h3>

                    <p className="mt-1 break-all text-sm text-slate-600">
                      {invite.invitee_email}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Enviada el {formatDate(invite.created_at)}
                    </p>

                    <form
                      action={`/api/compartir/invitaciones/${invite.id}`}
                      method="post"
                      className="mt-4"
                    >
                      <input type="hidden" name="action" value="cancel" />
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                      >
                        Cancelar invitación
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">
                  No tienes invitaciones enviadas pendientes.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}