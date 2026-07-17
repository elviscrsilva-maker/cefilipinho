import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Menu, X, Instagram } from "lucide-react";
import { useState, type ReactNode } from "react";

import logoFilipinhoAsset from "@/assets/logo-filipinho.png.asset.json";
import logoElvisAsset from "@/assets/logo-elvis.jpeg.asset.json";
import { useBrandingContent, useContactContent, useAppearanceContent } from "@/lib/content";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Institucional" },
  { to: "/especialidades", label: "Especialidades" },
  { to: "/midia", label: "Mídia" },
  { to: "/podcast", label: "Podcast" },
  { to: "/contato", label: "Contato" },
] as const;

function AppearanceInjector() {
  const { data } = useAppearanceContent();
  const a = data!;
  const css = `
    ${a.primary_color ? `--primary: ${a.primary_color};` : ""}
    ${a.primary_glow_color ? `--primary-glow: ${a.primary_glow_color};` : ""}
    ${a.gold_color ? `--gold: ${a.gold_color};` : ""}
    ${a.heading_font ? `--font-display: ${a.heading_font}, Georgia, serif;` : ""}
    ${a.body_font ? `--font-sans: ${a.body_font}, ui-sans-serif, system-ui, sans-serif;` : ""}
  `.trim();
  return (
    <>
      {a.google_fonts_url && <link rel="stylesheet" href={a.google_fonts_url} />}
      {css && <style>{`:root{${css}}`}</style>}
    </>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: branding } = useBrandingContent();
  const { data: contact } = useContactContent();
  const b = branding!;
  const c = contact!;
  const logoUrl = b.logo_url || logoFilipinhoAsset.url;
  const devLogoUrl = b.footer_dev_logo_url || logoElvisAsset.url;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppearanceInjector />
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">

            <img src={logoUrl} alt={b.site_title} className="h-11 sm:h-12 w-auto" />
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
            <div className="font-display text-xl font-semibold">{b.site_title}</div>
            <p className="mt-3 text-sm text-primary-foreground/80 italic">"{b.tagline}"</p>
            {b.cnes && (
              <p className="mt-4 text-xs text-primary-foreground/70">
                CNES: {b.cnes} · Vinculado à SEMUS São Luís
              </p>
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <span>{c.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" />
              <span>{c.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" />
              <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gold" />
              <span>{c.hours}</span>
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
              <li>
                <Link to="/admin" className="text-primary-foreground/50 hover:text-primary-foreground text-xs">
                  Área administrativa
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/70 flex flex-wrap items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} {b.site_title} — SEMUS São Luís · Todos os direitos reservados.</span>
            <a
              href={b.footer_dev_url || "#"}
              target={b.footer_dev_url ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition"
              aria-label="Desenvolvido por Elvis C. R. Silva"
            >
              <span className="hidden sm:inline text-[11px] uppercase tracking-widest">Desenvolvido por</span>
              <img src={devLogoUrl} alt="Elvis C. R. Silva" className="h-9 w-auto rounded-md bg-primary-foreground/5 p-1" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
