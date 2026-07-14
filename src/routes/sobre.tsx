import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Building2, Target, Eye, Heart, Award } from "lucide-react";
import { useInstitutionalContent, useContactContent, useBrandingContent, type TextAlign } from "@/lib/content";

const ALIGN: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
  justify: "text-justify",
};

const TITLE = "Institucional — Centro de Especialidades Filipinho";
const DESC =
  "Missão, visão, valores, direção e ficha técnica do Centro de Especialidades Filipinho, unidade SEMUS em São Luís/MA.";

export const Route = createFileRoute("/sobre")({
  component: Sobre,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
});


function Sobre() {
  const { data: inst } = useInstitutionalContent();
  const { data: contact } = useContactContent();
  const { data: branding } = useBrandingContent();
  const i = inst!;
  const c = contact!;
  const b = branding!;
  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <Building2 className="h-4 w-4" /> {i.hero_eyebrow}
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold">
            {i.hero_title}
          </h1>
          <p className={`mt-4 max-w-2xl text-primary-foreground/85 text-lg whitespace-pre-line ${ALIGN[i.hero_align ?? "left"]}`}>
            {i.hero_subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: "Missão", body: i.mission },
          { icon: Eye, title: "Visão", body: i.vision },
          { icon: Heart, title: "Valores", body: i.values },
        ].map((card) => (
          <article key={card.title} className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground mb-5">
              <card.icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl text-primary font-semibold">{card.title}</h2>
            <p className={`mt-3 text-muted-foreground leading-relaxed whitespace-pre-line ${ALIGN[i.cards_align ?? "left"]}`}>{card.body}</p>
          </article>
        ))}
      </section>

      {i.history && (
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <h2 className="font-display text-2xl text-primary font-semibold">Nossa história</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">{i.history}</p>
          </div>
        </section>
      )}

      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70">
              <Award className="h-4 w-4" /> Alvo Corporativo
            </div>
            <h2 className="mt-3 font-display text-3xl text-primary font-semibold">
              Compromisso com a saúde de São Luís
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Em consonância com a Secretaria Municipal de Saúde, buscamos oferecer, com excelência,
              atendimento multiprofissional tendo como base o acolhimento, a humanização, a
              resolutividade, a ética e a satisfação — consolidando-nos como unidade referência em
              atendimento especializado junto à população de São Luís e municípios pactuados.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8 shadow-card">
            <h3 className="font-display text-xl text-primary font-semibold">Ficha Técnica</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <Row k="CNES" v={b.cnes} />
              <Row k="Endereço" v={c.address} />
              <Row k="Telefone" v={c.phone} />
              <Row k="E-mail" v={c.email} />
              <Row k="Horário" v={c.hours} />
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-primary font-semibold">Direção & Coordenação</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(i.leadership ?? []).map((l) => (
            <div key={l.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="text-xs uppercase tracking-widest text-primary/70">{l.role}</div>
              <div className="mt-2 font-display text-lg text-primary font-semibold">{l.name}</div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-border/60 pb-2 last:border-0">
      <dt className="text-primary font-medium">{k}</dt>
      <dd className="text-muted-foreground sm:text-right">{v}</dd>
    </div>
  );
}
