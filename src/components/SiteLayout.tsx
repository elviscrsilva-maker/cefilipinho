import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Institucional" },
  { to: "/especialidades", label: "Especialidades" },
  { to: "/midia", label: "Mídia" },
  { to: "/podcast", label: "Podcast" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground font-display font-bold shadow-card">
              CF
            </div>
            <div className="leading-tight">
              <div className="font-display text-primary font-semibold text-sm sm:text-base">
                Centro de Especialidades
              </div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Filipinho
              </div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "text-primary bg-secondary" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-primary hover:bg-secondary/60" }}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md text-primary hover:bg-secondary"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-primary bg-secondary" }}
                  inactiveProps={{ className: "text-foreground hover:bg-secondary/60" }}
                  className="px-4 py-2.5 rounded-md text-sm font-medium"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-display text-xl font-semibold">Centro de Especialidades Filipinho</div>
            <p className="mt-3 text-sm text-primary-foreground/80 italic">
              "Qualidade e Excelência em cada Atendimento"
            </p>
            <p className="mt-4 text-xs text-primary-foreground/70">
              CNES: 2697998 · Vinculado à SEMUS São Luís
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <span>Rua Vespasiano Ramos, 16 — CEP 65043-030, São Luís/MA</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" />
              <span>(98) 99149-7326</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" />
              <a href="mailto:cemfilipinhoesp@gmail.com" className="hover:underline">
                cemfilipinhoesp@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gold" />
              <span>Segunda a Sexta · 07h às 18h</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-3 text-gold">Navegação</div>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-primary-foreground/85 hover:text-primary-foreground hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/70 flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} Centro de Especialidades Filipinho — SEMUS São Luís</span>
            <span>Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
