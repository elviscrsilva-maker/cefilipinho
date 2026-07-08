import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import heroAsset from "@/assets/fachada-filipinho.jpg.asset.json";
const heroImg = heroAsset.url;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200" },
    ],
  }),
});

const HIGHLIGHTS = [
  { icon: Stethoscope, label: "13 Especialidades Médicas" },
  { icon: Users, label: "6 Especialidades Não Médicas" },
  { icon: Microscope, label: "Exames & Procedimentos" },
  { icon: HeartPulse, label: "Mais de 30 profissionais" },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Recepção do Centro de Especialidades Filipinho"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-92" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              SEMUS · São Luís
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
              Centro de Especialidades <span className="text-gold">Filipinho</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Qualidade e excelência em cada atendimento. Cuidado multiprofissional, humanizado
              e resolutivo para a população da grande ilha de São Luís.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/especialidades"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-primary shadow-elegant hover:brightness-110 transition"
              >
                Ver especialidades <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
              >
                Fale conosco
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur px-5 py-4 flex items-center gap-3 text-primary-foreground"
              >
                <div className="h-10 w-10 rounded-lg bg-gold/90 grid place-items-center text-primary shrink-0">
                  <h.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUCIONAL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Missão",
              body:
                "Em consonância com a SEMUS, oferecer com excelência atendimento multiprofissional de forma resolutiva e humanizada à população de São Luís.",
            },
            {
              title: "Visão",
              body:
                "Consolidar-se como referência no atendimento multiprofissional especializado junto à população de São Luís e municípios pactuados.",
            },
            {
              title: "Valores",
              body:
                "Ética, respeito, acolhimento, humanização, excelência, resolutividade e satisfação do paciente.",
            },
          ].map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition"
            >
              <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl text-primary font-semibold">{c.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-6 md:grid-cols-3 text-sm">
          <InfoRow icon={Clock} title="Horário de atendimento" text="Segunda a Sexta · 07h às 18h" />
          <InfoRow icon={MapPin} title="Endereço" text="Rua Vespasiano Ramos, 16 — São Luís/MA" />
          <InfoRow icon={Phone} title="Telefone" text="(98) 99149-7326" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-primary p-10 md:p-14 text-primary-foreground shadow-elegant relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Cuidado especializado, perto de você.
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              Conheça nossas especialidades médicas e não médicas, procedimentos e exames diagnósticos
              disponíveis para a população da grande ilha.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/especialidades"
                className="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 text-sm font-semibold text-primary hover:brightness-110 transition"
              >
                Especialidades <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex items-center rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10 transition"
              >
                Sobre a unidade
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoRow({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Clock;
  title: string;
  text: string;
}) {
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
