import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import {
  Heart, Sparkles, Activity, Droplet, Utensils, Stethoscope, Brain, Ear,
  Wind, Baby, Bone, ShieldPlus, Pill, Apple, HandHeart, Users, Waves,
  Syringe, TestTube, Zap, HeartPulse, Radio, ScanLine,
} from "lucide-react";

const TITLE = "Especialidades — Centro de Especialidades Filipinho";
const DESC =
  "Conheça as 13 especialidades médicas, 6 não médicas, procedimentos e exames diagnósticos oferecidos pelo Centro de Especialidades Filipinho.";

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

const MEDICAS = [
  { icon: Heart, name: "Cardiologia" },
  { icon: Sparkles, name: "Dermatologia" },
  { icon: Activity, name: "Endocrinologia" },
  { icon: Droplet, name: "Hematologia" },
  { icon: Utensils, name: "Gastroenterologia" },
  { icon: ShieldPlus, name: "Nefrologia" },
  { icon: Brain, name: "Neurologia" },
  { icon: Ear, name: "Otorrinolaringologia" },
  { icon: Wind, name: "Pneumologia" },
  { icon: Baby, name: "Proctologia" },
  { icon: Stethoscope, name: "Reumatologia" },
  { icon: HandHeart, name: "Urologia" },
  { icon: Bone, name: "Ortopedia" },
];

const NAO_MEDICAS = [
  { icon: Syringe, name: "Enfermagem" },
  { icon: Pill, name: "Farmácia" },
  { icon: Apple, name: "Nutrição" },
  { icon: Users, name: "Serviço Social" },
  { icon: Brain, name: "Psicologia" },
  { icon: Waves, name: "Fisioterapia Pélvica" },
];

const PROCEDIMENTOS = [
  "Retirada de Cerúmen",
  "Infiltração em Articulações",
  "Coleta de exames Laboratoriais",
  "Procedimentos Dermatológicos",
];

const EXAMES = [
  { icon: Zap, name: "Eletroencefalograma" },
  { icon: HeartPulse, name: "Eletrocardiograma" },
  { icon: ScanLine, name: "Ecocardiograma" },
  { icon: Activity, name: "Holter" },
  { icon: Radio, name: "MAPA" },
  { icon: TestTube, name: "Ultrassonografia" },
];

function Especialidades() {
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

      <Group title="Especialidades Médicas" items={MEDICAS} />
      <Group title="Especialidades Não Médicas" items={NAO_MEDICAS} tinted />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-card border border-border p-8 shadow-card">
          <h2 className="font-display text-2xl text-primary font-semibold">
            Procedimentos ofertados
          </h2>
          <ul className="mt-5 space-y-3">
            {PROCEDIMENTOS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-gradient-primary text-primary-foreground p-8 shadow-elegant">
          <h2 className="font-display text-2xl font-semibold">Exames diagnósticos</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {EXAMES.map((e) => (
              <div key={e.name} className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 px-4 py-3">
                <e.icon className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium">{e.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

type Item = { icon: typeof Heart; name: string };
function Group({ title, items, tinted }: { title: string; items: Item[]; tinted?: boolean }) {
  return (
    <section className={tinted ? "bg-secondary/60 border-y border-border" : ""}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-3xl text-primary font-semibold">{title}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.name}
              className="group rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition"
            >
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center group-hover:bg-gradient-primary group-hover:text-primary-foreground transition">
                <it.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg text-primary font-semibold">{it.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
