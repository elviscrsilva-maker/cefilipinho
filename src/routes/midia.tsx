import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  if (url.match(/\.(mp4|webm|ogg)$/i)) return url;
  return null;
}

function youtubeThumb(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}

function VideoCard({ v }: { v: { id: string; url: string; title: string; description: string | null; thumbnail_url: string | null } }) {
  const [playing, setPlaying] = useState(false);
  const embed = embedVideoUrl(v.url);
  const isFile = embed?.match(/\.(mp4|webm|ogg)$/i);
  const poster = v.thumbnail_url || youtubeThumb(v.url) || undefined;

  return (
    <article className="rounded-2xl overflow-hidden border border-border bg-card shadow-card">
      <div className="aspect-video bg-black relative">
        {!embed ? (
          <a href={v.url} target="_blank" rel="noreferrer" className="h-full w-full grid place-items-center text-primary-foreground">
            <ExternalLink className="h-6 w-6" />
          </a>
        ) : isFile ? (
          <video src={embed} controls className="h-full w-full" poster={poster} />
        ) : playing ? (
          <iframe src={embed} title={v.title} className="h-full w-full" allowFullScreen allow="autoplay; encrypted-media" />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group h-full w-full relative"
            aria-label={`Reproduzir ${v.title}`}
          >
            {poster ? (
              <img src={poster} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-hero" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition grid place-items-center">
              <div className="h-16 w-16 rounded-full bg-gold text-primary grid place-items-center shadow-elegant group-hover:scale-105 transition">
                <Play className="h-7 w-7 ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-primary font-semibold">{v.title}</h3>
        {v.description && <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>}
      </div>
    </article>
  );
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
            {videos.map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
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
