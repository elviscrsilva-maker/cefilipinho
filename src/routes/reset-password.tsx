import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, Lock } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Redefinir senha — CE Filipinho" },
      { name: "description", content: "Defina uma nova senha para o acesso administrativo do CE Filipinho." },
      { property: "og:title", content: "Redefinir senha — CE Filipinho" },
      { property: "og:description", content: "Defina uma nova senha para o acesso administrativo do CE Filipinho." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [checking, setChecking] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const isRecoveryLink = hash.get("type") === "recovery";

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || (isRecoveryLink && session)) {
        setRecoveryReady(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (!error && isRecoveryLink && data.session) setRecoveryReady(true);
      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: "error", text: "A nova senha deve ter no mínimo 6 caracteres." });
      return;
    }
    if (password !== confirmation) {
      setMessage({ type: "error", text: "As senhas informadas não são iguais." });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: "Não foi possível alterar a senha. Solicite um novo link e tente novamente." });
      return;
    }

    setMessage({ type: "success", text: "Senha alterada com sucesso. Entrando no painel..." });
    window.setTimeout(() => navigate({ to: "/admin", replace: true }), 900);
  }

  return (
    <SiteLayout>
      <main className="mx-auto max-w-md px-4 py-16">
        <section className="rounded-xl border border-border bg-card p-8 shadow-card" aria-labelledby="reset-title">
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-foreground">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 id="reset-title" className="mt-4 font-display text-2xl font-semibold text-primary">
              Definir nova senha
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Crie a senha do seu acesso administrativo.</p>
          </div>

          {checking ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Validando o link...</p>
          ) : recoveryReady ? (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="text-xs font-semibold uppercase text-primary">Nova senha</label>
                <div className="mt-1 flex items-center gap-2 rounded-md border border-input bg-background px-3">
                  <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="new-password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-xs font-semibold uppercase text-primary">Confirmar nova senha</label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {message && (
                <div className={`rounded-md px-3 py-2 text-sm ${message.type === "error" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`} role="status">
                  {message.text}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                {loading ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Este link é inválido ou expirou. Solicite um novo link de recuperação.
              </p>
              <Link to="/auth" className="inline-flex text-sm font-semibold text-primary hover:underline">
                Solicitar novo link
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/auth" className="hover:text-primary">Voltar ao login</Link>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}