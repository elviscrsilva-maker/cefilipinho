import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Camera, Play, ImageIcon, ExternalLink } from "lucide-react";
import { useMediaItems } from "@/lib/content";

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

function embedVideoUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
  return null;
}

function Midia() {
  const { data: items = [] } = useMediaItems();
  const videos = items.filter((i) => i.kind === "video");
  const fotos = items.filter((i) => i.kind === "photo");

  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">Mídia</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Fotos & Vídeos</h1>
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
        {videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum vídeo publicado ainda.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => {
              const embed = embedVideoUrl(v.url);
              return (
                <article key={v.id} className="rounded-2xl overflow-hidden border border-border bg-card shadow-card">
                  <div className="aspect-video bg-black">
                    {embed ? (
                      embed.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={embed} controls className="h-full w-full" poster={v.thumbnail_url || undefined} />
                      ) : (
                        <iframe src={embed} title={v.title} className="h-full w-full" allowFullScreen />
                      )
                    ) : (
                      <a href={v.url} target="_blank" rel="noreferrer" className="h-full w-full grid place-items-center text-primary-foreground">
                        <ExternalLink className="h-6 w-6" />
                      </a>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-primary font-semibold">{v.title}</h3>
                    {v.description && <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-secondary/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl text-primary font-semibold">Galeria de fotos</h2>
          </div>
          {fotos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma foto publicada ainda.</p>
          ) : (
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {fotos.map((f) => (
                <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden border border-border shadow-card group">
                  <img src={f.thumbnail_url || f.url} alt={f.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
