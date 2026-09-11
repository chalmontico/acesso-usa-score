"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, MapPin, Calendar, Crown } from "lucide-react";

type Info = {
  convidadoPor: { nome: string; foto_url: string | null } | null;
  proximoEncontro: { titulo: string; tipo: string; data: string; hora: string | null; local: string | null } | null;
};

export default function ConviteBlackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Loader2 size={20} className="animate-spin text-white/40" />
        </div>
      }
    >
      <ConviteBlackConteudo />
    </Suspense>
  );
}

function ConviteBlackConteudo() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [info, setInfo] = useState<Info | null>(null);
  const [carregando, setCarregando] = useState(true);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(`/api/convite-black/info${ref ? `?ref=${ref}` : ""}`)
      .then((r) => r.json())
      .then((dados) => setInfo(dados))
      .finally(() => setCarregando(false));
  }, [ref]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !email) return;
    setEnviando(true);
    await fetch("/api/convite-black/responder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, convidadoPor: ref }),
    });
    setEnviando(false);
    setEnviado(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-acesso-black.png" alt="Acesso Black" className="h-auto w-full max-w-[220px]" />
        </div>

        {carregando ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
            <Loader2 size={16} className="animate-spin" /> Carregando convite...
          </div>
        ) : enviado ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h1 className="text-xl font-semibold text-white">Recebemos seu interesse!</h1>
            <p className="mt-3 text-sm text-white/60">
              Alguém da nossa equipe entra em contato em breve pra te apresentar o Acesso Black direito.
            </p>
            <p className="mt-4 text-xs text-white/40">
              Já quer criar sua conta agora?{" "}
              <Link href="/login" className="text-slate-300 hover:underline">
                Fazer login ou se cadastrar
              </Link>
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-5 text-center">
              {info?.convidadoPor ? (
                <>
                  <div className="mx-auto mb-3">
                    {info.convidadoPor.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={info.convidadoPor.foto_url}
                        alt=""
                        className="mx-auto h-14 w-14 rounded-full border-2 border-amber-400/50 object-cover"
                      />
                    ) : (
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-amber-400/50 bg-amber-400/10 text-lg font-semibold text-amber-300">
                        {info.convidadoPor.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">
                    <strong className="text-white">{info.convidadoPor.nome}</strong> te convidou pro
                  </p>
                </>
              ) : (
                <p className="text-sm text-white/60">Você foi convidado pro</p>
              )}
              <h1 className="mt-1 flex items-center justify-center gap-1.5 text-xl font-bold text-white">
                <Crown size={18} className="text-slate-300" /> Acesso Black
              </h1>
              <p className="mt-1 text-xs text-white/40">
                O círculo premium de empresários da rede Acesso.
              </p>
            </div>

            {info?.proximoEncontro && (
              <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Próximo encontro
                </p>
                <p className="font-medium text-white">{info.proximoEncontro.titulo}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/50">
                  <Calendar size={12} />
                  {new Date(info.proximoEncontro.data + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                  })}
                  {info.proximoEncontro.hora && ` · ${info.proximoEncontro.hora}`}
                </p>
                {info.proximoEncontro.local && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      info.proximoEncontro.local
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300 hover:underline"
                  >
                    <MapPin size={12} /> {info.proximoEncontro.local}
                  </a>
                )}
              </div>
            )}

            <form onSubmit={enviar} className="space-y-3">
              <p className="text-sm text-white/70">
                Deixa seu nome e e-mail que a gente te conta mais e te ajuda a participar:
              </p>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Telefone (opcional)"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-xl bg-gradient-to-b from-white/[0.14] via-black/50 to-black/85 border border-white/25 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_3px_10px_-2px_rgba(0,0,0,0.7)] hover:border-white/40 hover:brightness-110 py-2.5 text-sm font-medium disabled:opacity-60"
              >
                {enviando ? "Enviando..." : "Tenho interesse"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-white/40">
              Já tem conta?{" "}
              <Link href="/login" className="text-slate-300 hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
