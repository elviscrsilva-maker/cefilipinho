import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import * as Icons from "lucide-react";
import { Stethoscope } from "lucide-react";
import { useSpecialties, type Specialty } from "@/lib/content";

const TITLE = "Especialidades — Centro de Especialidades Filipinho";
const DESC =
  "Conheça as especialidades médicas, não médicas, procedimentos e exames diagnósticos oferecidos pelo Centro de Especialidades Filipinho.";

export const Route = createFileRoute("/especialidades")({
  component: Especialidades,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
});

function getIcon(name: string) {
  const Icon = (Icons as any)[name];
  return Icon ?? Stethoscope;
}

function Especialidades() {
  const { data: items } = useSpecialties();
  const groups = {
    medica: items.filter((i) => i.category === "medica"),
    nao_medica: items.filter((i) => i.category === "nao_medica"),
    procedimento: items.filter((i) => i.category === "procedimento"),
    exame: items.filter((i) => i.category === "exame"),
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">O que oferecemos</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
            Especialidades & Serviços
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Um portfólio completo de cuidado multiprofissional — do diagnóstico ao acompanhamento
            especializado.
          </p>
        </div>
      </section>

      <Group title="Especialidades Médicas" items={groups.medica} />
      <Group title="Especialidades Não Médicas" items={groups.nao_medica} tinted />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-card border border-border p-8 shadow-card">
          <h2 className="font-display text-2xl text-primary font-semibold">
            Procedimentos ofertados
          </h2>
          <ul className="mt-5 space-y-3">
            {groups.procedimento.map((p) => (
              <li key={p.id} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-8 shadow-elegant">
          <h2 className="font-display text-2xl font-semibold">Exames diagnósticos</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {groups.exame.map((e) => {
              const Icon = getIcon(e.icon);
              return (
                <div key={e.id} className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-4 py-3">
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">{e.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Group({ title, items, tinted }: { title: string; items: Specialty[]; tinted?: boolean }) {
  if (items.length === 0) return null;
  return (
    <section className={tinted ? "bg-secondary/60 border-y border-border" : ""}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-primary font-semibold">{title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => {
            const Icon = getIcon(it.icon);
            return (
              <div
                key={it.id}
                className="group rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center group-hover:bg-gradient-primary group-hover:text-primary-foreground transition">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-lg text-primary font-semibold">{it.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
