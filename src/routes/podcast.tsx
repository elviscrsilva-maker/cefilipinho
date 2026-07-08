import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mic, Play, Headphones, Clock } from "lucide-react";

const TITLE = "Podcast — Centro de Especialidades Filipinho";
const DESC =
  "Podcast do Centro de Especialidades Filipinho: conversas sobre saúde, cuidado humanizado e prevenção.";

export const Route = createFileRoute("/podcast")({
  component: Podcast,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
});

const EPISODES = [
  { n: "01", title: "Cuidado humanizado no SUS", desc: "Um bate-papo com a direção sobre acolhimento.", duration: "28 min" },
  { n: "02", title: "Prevenção começa na atenção especializada", desc: "Como especialistas atuam na saúde da comunidade.", duration: "32 min" },
  { n: "03", title: "Saúde da mulher e fisioterapia pélvica", desc: "Um serviço pouco conhecido, muito transformador.", duration: "25 min" },
];

function Podcast() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold flex items-center gap-2">
              <Mic className="h-4 w-4" /> Podcast Filipinho
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
              Conversas sobre saúde
            </h1>
            <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
              Episódios com nossos especialistas, gestores e profissionais — informação de qualidade
              para pacientes, familiares e a comunidade.
            </p>
          </div>
          <div className="h-40 w-40 rounded-3xl bg-gold text-primary grid place-items-center shadow-elegant justify-self-start md:justify-self-end">
            <Headphones className="h-20 w-20" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display text-2xl text-primary font-semibold">Episódios</h2>
        <div className="mt-8 space-y-4">
          {EPISODES.map((e) => (
            <article
              key={e.n}
              className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant transition"
            >
              <div className="h-14 w-14 rounded-xl bg-gradient-primary text-primary-foreground grid place-items-center font-display font-semibold shrink-0">
                {e.n}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-primary font-semibold truncate">{e.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{e.desc}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {e.duration}
                </div>
              </div>
              <button
                aria-label={`Reproduzir episódio ${e.n}`}
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center hover:bg-primary-glow transition shrink-0"
              >
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              </button>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
          <strong className="text-primary">Em breve:</strong> integração com Spotify, YouTube e
          plataformas de podcast para transmissão dos episódios diretamente aqui no site.
        </div>
      </section>
    </SiteLayout>
  );
}
