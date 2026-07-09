import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { Lock, Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg({ type: "success", text: "Conta criada. Você já pode entrar." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({ type: "success", text: "Se este e-mail existir, um link de redefinição foi enviado." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message ?? "Erro inesperado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold text-primary">
              {mode === "signin" ? "Entrar no painel" : mode === "signup" ? "Criar conta admin" : "Recuperar senha"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Área restrita ao administrador do site.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">E-mail</label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent py-2.5 text-sm outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            {mode !== "forgot" && (
              <div>
                <label className="text-xs font-semibold text-primary uppercase tracking-wider">Senha</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
              </div>
            )}
            {msg && (
              <div
                className={`rounded-md px-3 py-2 text-sm ${
                  msg.type === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {msg.text}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "Aguarde..."
                : mode === "signin"
                ? "Entrar"
                : mode === "signup"
                ? "Criar conta"
                : "Enviar link"}
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs">
            {mode === "signin" ? (
              <>
                <button className="text-primary hover:underline" onClick={() => setMode("forgot")}>
                  Esqueci minha senha
                </button>
                <button className="text-primary hover:underline" onClick={() => setMode("signup")}>
                  Primeiro acesso? Criar conta
                </button>
              </>
            ) : (
              <button className="text-primary hover:underline" onClick={() => setMode("signin")}>
                Voltar ao login
              </button>
            )}
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
