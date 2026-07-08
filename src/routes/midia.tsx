import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Camera, Play, ImageIcon } from "lucide-react";

const TITLE = "Mídia — Centro de Especialidades Filipinho";
const DESC = "Galeria de fotos e vídeos institucionais do Centro de Especialidades Filipinho.";

export const Route = createFileRoute("/midia")({
  component: Midia,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
});

const VIDEOS = [
  { title: "Institucional — Centro Filipinho", desc: "Conheça nossa unidade." },
  { title: "Bastidores do atendimento", desc: "A rotina de cuidado humanizado." },
  { title: "Ações comunitárias", desc: "Presença no território de São Luís." },
];

const FOTOS = Array.from({ length: 8 }).map((_, i) => ({ id: i + 1 }));

function Midia() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">Mídia</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
            Fotos & Vídeos
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Registros do dia a dia da unidade, ações institucionais e momentos com os pacientes e equipe.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Play className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl text-primary font-semibold">Vídeos</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <article key={v.title} className="rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-elegant transition">
              <div className="aspect-video bg-gradient-primary relative grid place-items-center">
                <button className="h-16 w-16 rounded-full bg-primary-foreground/95 text-primary grid place-items-center shadow-elegant hover:scale-105 transition" aria-label={`Reproduzir ${v.title}`}>
                  <Play className="h-6 w-6 ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-primary font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Em breve: integração com YouTube/Vimeo para publicar novos vídeos.
        </p>
      </section>

      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl text-primary font-semibold">Galeria de fotos</h2>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {FOTOS.map((f) => (
              <div key={f.id} className="aspect-square rounded-xl bg-gradient-primary/20 border border-border grid place-items-center text-primary/50 shadow-card">
                <ImageIcon className="h-8 w-8" />
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Espaço reservado para as fotos da unidade — serão publicadas nos próximos ajustes.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
