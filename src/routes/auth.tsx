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

  function traduzErro(err: any): string {
    const raw = String(err?.message ?? "").toLowerCase();
    if (raw.includes("already registered") || raw.includes("already been registered") || raw.includes("user already")) {
      return "Este e-mail já possui conta criada. Use a opção “Entrar”. Se não lembra a senha, clique em “Esqueci minha senha”.";
    }
    if (raw.includes("invalid login credentials")) {
      return "E-mail ou senha incorretos. Se este é seu primeiro acesso, use “Esqueci minha senha” para definir uma senha.";
    }
    if (raw.includes("email not confirmed")) {
      return "E-mail ainda não confirmado. Verifique sua caixa de entrada (e o spam) e clique no link de confirmação.";
    }
    if (raw.includes("password") && raw.includes("6")) {
      return "A senha deve ter no mínimo 6 caracteres.";
    }
    if (raw.includes("signups not allowed") || raw.includes("signup is disabled")) {
      return "Criação de contas desativada. Use “Esqueci minha senha” para acessar sua conta já existente.";
    }
    if (raw.includes("rate limit") || raw.includes("too many")) {
      return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
    }
    return err?.message ?? "Erro inesperado";
  }

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
        if (error) {
          const raw = String(error.message ?? "").toLowerCase();
          if (raw.includes("already")) {
            setMode("signin");
            setMsg({ type: "error", text: traduzErro(error) });
            return;
          }
          throw error;
        }
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
      setMsg({ type: "error", text: traduzErro(err) });
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
            {mode === "signup" && (
              <p className="mt-2 text-xs text-muted-foreground">
                Se o e-mail já foi cadastrado antes, não crie outra conta: volte ao login ou use
                “Esqueci minha senha” para definir uma nova senha.
              </p>
            )}
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
