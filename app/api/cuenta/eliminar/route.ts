import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase-server";

const CONFIRM_TEXT = "ELIMINAR MI CUENTA";

type DeleteAccountBody = {
  confirmation?: string;
};

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!envSupabaseUrl) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL");
}

if (!envServiceRoleKey) {
  throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
}

const supabaseUrl: string = envSupabaseUrl;
const serviceRoleKey: string = envServiceRoleKey;

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para eliminar tu cuenta." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as DeleteAccountBody;
    const confirmation =
      typeof body.confirmation === "string" ? body.confirmation.trim() : "";

    if (confirmation !== CONFIRM_TEXT) {
      return NextResponse.json(
        { error: "La confirmación escrita no es correcta." },
        { status: 400 }
      );
    }

    const normalizedEmail = (user.email ?? "").trim().toLowerCase();

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: deleteJobsError } = await supabaseAdmin
      .from("trabajos")
      .delete()
      .eq("user_id", user.id);

    if (deleteJobsError) {
      return NextResponse.json(
        {
          error:
            deleteJobsError.message || "No se pudieron borrar los trabajos.",
        },
        { status: 500 }
      );
    }

    const { error: deleteLinksError } = await supabaseAdmin
      .from("shared_agenda_links")
      .delete()
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);

    if (deleteLinksError) {
      return NextResponse.json(
        {
          error:
            deleteLinksError.message ||
            "No se pudieron eliminar las conexiones compartidas.",
        },
        { status: 500 }
      );
    }

    const { error: deleteInvitesByUserError } = await supabaseAdmin
      .from("shared_agenda_invites")
      .delete()
      .or(`inviter_user_id.eq.${user.id},invitee_user_id.eq.${user.id}`);

    if (deleteInvitesByUserError) {
      return NextResponse.json(
        {
          error:
            deleteInvitesByUserError.message ||
            "No se pudieron eliminar las invitaciones de la cuenta.",
        },
        { status: 500 }
      );
    }

    if (normalizedEmail) {
      const { error: deleteInvitesByEmailError } = await supabaseAdmin
        .from("shared_agenda_invites")
        .delete()
        .eq("invitee_email", normalizedEmail);

      if (deleteInvitesByEmailError) {
        return NextResponse.json(
          {
            error:
              deleteInvitesByEmailError.message ||
              "No se pudieron limpiar invitaciones por email.",
          },
          { status: 500 }
        );
      }
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      return NextResponse.json(
        {
          error:
            signOutError.message || "No se pudo cerrar la sesión actual.",
        },
        { status: 500 }
      );
    }

    const { error: deleteUserError } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      return NextResponse.json(
        {
          error:
            deleteUserError.message ||
            "No se pudo eliminar la cuenta de acceso.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la cuenta." },
      { status: 400 }
    );
  }
}