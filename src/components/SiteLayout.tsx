import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Menu, X, Instagram } from "lucide-react";
import { useState, type ReactNode } from "react";

import logoFilipinhoAsset from "@/assets/logo-filipinho.png.asset.json";
import logoElvisAsset from "@/assets/logo-elvis.jpeg.asset.json";
import { useBrandingContent, useContactContent, useAppearanceContent, useHeaderContent } from "@/lib/content";

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
  const { data: header } = useHeaderContent();
  const b = branding!;
  const c = contact!;
  const h = header!;
  const logoUrl = b.logo_url || logoFilipinhoAsset.url;
  const devLogoUrl = b.footer_dev_logo_url || logoElvisAsset.url;

  const NAV = [
    { to: "/", label: h.nav_home },
    { to: "/sobre", label: h.nav_sobre },
    { to: "/especialidades", label: h.nav_especialidades },
    { to: "/projetos", label: h.nav_midia },
    { to: "/podcast", label: h.nav_podcast },
    { to: "/contato", label: h.nav_contato },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppearanceInjector />
      <header
        className={`sticky top-0 z-40 border-b border-border backdrop-blur-md ${h.bg_color ? "" : "bg-background/85"}`}
        style={{
          backgroundColor: h.bg_color || undefined,
          color: h.text_color || undefined,
        }}
      >


        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src={logoUrl} alt={b.site_title} className="h-14 sm:h-16 md:h-20 w-auto drop-shadow-sm" />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{
                  className: "font-semibold shadow-sm ring-1 ring-gold/70",
                  style: {
                    color: h.nav_active_text_color || undefined,
                    backgroundColor: h.nav_active_bg_color || undefined,
                  },
                }}
                inactiveProps={{
                  className: "hover:bg-secondary/60",
                  style: { color: h.nav_link_color || h.text_color || undefined },
                }}
                className="px-4 py-2 rounded-md text-sm transition-colors"
              >
                {n.label}
              </Link>
            ))}
            {c.instagram_url && (
              <a
                href={c.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary flex items-center gap-1.5"
                style={{ color: h.nav_link_color || h.text_color || undefined }}
                aria-label="Instagram da unidade"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            )}
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
              {c.instagram_url && (
                <a href={c.instagram_url} target="_blank" rel="noreferrer" className="px-4 py-2.5 rounded-md text-sm font-medium text-primary flex items-center gap-2">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
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
            {c.instagram_url && (
              <div className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-gold" />
                <a href={c.instagram_url} target="_blank" rel="noreferrer" className="hover:underline">
                  Instagram da unidade
                </a>
              </div>
            )}
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
