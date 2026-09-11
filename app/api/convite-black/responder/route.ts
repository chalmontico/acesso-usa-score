import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, convidadoPor } = await req.json();

    if (!nome || !email) {
      return NextResponse.json({ error: "Preencha nome e e-mail." }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin.from("respostas_convite_black").insert({
      nome,
      email,
      telefone: telefone || null,
      convidado_por: convidadoPor || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}
