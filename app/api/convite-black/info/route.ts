import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const ref = req.nextUrl.searchParams.get("ref");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let convidadoPor: { nome: string; foto_url: string | null } | null = null;
    if (ref) {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("nome, foto_url")
        .eq("id", ref)
        .maybeSingle();
      convidadoPor = data ?? null;
    }

    const hoje = new Date().toISOString().slice(0, 10);
    const { data: proximoEncontro } = await supabaseAdmin
      .from("agenda_black")
      .select("titulo, tipo, data, hora, local")
      .gte("data", hoje)
      .order("data", { ascending: true })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({ convidadoPor, proximoEncontro: proximoEncontro ?? null });
  } catch (e) {
    return NextResponse.json({ convidadoPor: null, proximoEncontro: null });
  }
}
