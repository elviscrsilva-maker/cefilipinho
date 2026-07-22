import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Stethoscope,
  HeartPulse,
  Microscope,
  Users,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import heroAsset from "@/assets/fachada-filipinho.jpg.asset.json";
import { useHomeContent, useInstitutionalContent, useContactContent, useEvents, type EventItem } from "@/lib/content";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/6a8vCQujcrhCjyT3wWnZnZokVAz2/social-images/social-1783939054506-imagem_ce_filipinho.webp" },
    ],
  }),
});

const HIGHLIGHTS = [
  { icon: Stethoscope, label: "13 Especialidades Médicas" },
  { icon: Users, label: "6 Especialidades Não Médicas" },
  { icon: Microscope, label: "Exames & Procedimentos" },
  { icon: HeartPulse, label: "Mais de 30 profissionais" },
];

function EventsCarousel({ items }: { items: EventItem[] }) {
  const [idx, setIdx] = useState(0);
  const n = items.length;
  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);
  if (n === 0) return null;
  const ev = items[idx];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-10">
      <div className="rounded-2xl bg-card border border-border shadow-elegant overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="aspect-[16/9] md:aspect-auto bg-secondary relative">
            {ev.cover_url ? (
              <img src={ev.cover_url} alt={ev.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-primary grid place-items-center text-primary-foreground">
                <Calendar className="h-10 w-10 opacity-70" />
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70">
              <Calendar className="h-3.5 w-3.5" />
              Eventos & Notícias
              {ev.event_date && (
                <span className="text-muted-foreground normal-case tracking-normal">
                  · {new Date(ev.event_date + "T00:00").toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-2xl md:text-3xl text-primary font-semibold">{ev.title}</h3>
            {ev.description && (
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed whitespace-pre-line line-clamp-5">{ev.description}</p>
            )}
            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
              {ev.external_url ? (
                <a href={ev.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  Saiba mais <ExternalLink className="h-4 w-4" />
                </a>
              ) : <span />}
              {n > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setIdx((i) => (i - 1 + n) % n)} aria-label="Anterior" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-secondary">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {items.map((_, i) => (
                      <button key={i} onClick={() => setIdx(i)} aria-label={`Ir ao item ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
                    ))}
                  </div>
                  <button onClick={() => setIdx((i) => (i + 1) % n)} aria-label="Próximo" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-secondary">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data: home } = useHomeContent();
  const { data: inst } = useInstitutionalContent();
  const { data: contact } = useContactContent();
  const { data: events = [] } = useEvents();
  const h = home!;
  const i = inst!;
  const c = contact!;
  const heroImg = h.hero_image_url || heroAsset.url;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt={h.hero_title}
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              {h.hero_eyebrow}
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
              {h.hero_title}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              {h.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={h.cta_primary_href} className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-primary shadow-elegant hover:brightness-110 transition">
                {h.cta_primary_label} <ArrowRight className="h-4 w-4" />
              </a>
              <a href={h.cta_secondary_href} className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition">
                {h.cta_secondary_label}
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((hi) => (
              <div key={hi.label} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur px-5 py-4 flex items-center gap-3 text-primary-foreground">
                <div className="h-10 w-10 rounded-lg bg-gold/90 grid place-items-center text-primary shrink-0">
                  <hi.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{hi.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTOS / NOTÍCIAS */}
      <EventsCarousel items={events} />

      {/* INSTITUCIONAL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { title: "Missão", body: i.mission },
            { title: "Visão", body: i.vision },
            { title: "Valores", body: i.values },
          ].map((card) => (
            <article key={card.title} className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition">
              <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl text-primary font-semibold">{card.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-3 text-sm">
          <InfoRow icon={Clock} title="Horário de atendimento" text={c.hours} />
          <InfoRow icon={MapPin} title="Endereço" text={c.address} />
          <InfoRow icon={Phone} title="Telefone" text={c.phone} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-14 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Cuidado especializado, perto de você.</h2>
            <p className="mt-4 text-primary-foreground/85">
              Conheça nossas especialidades médicas e não médicas, procedimentos e exames diagnósticos disponíveis para a população da grande ilha.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/especialidades" className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-primary hover:brightness-110 transition">
                Especialidades <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/sobre" className="inline-flex items-center rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10 transition">
                Sobre a unidade
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoRow({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-primary">{title}</div>
        <div className="text-muted-foreground mt-0.5">{text}</div>
      </div>
    </div>
  );
}
