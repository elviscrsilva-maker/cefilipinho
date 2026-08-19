import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mic, Headphones, ExternalLink, Play, Copy, Check } from "lucide-react";
import { usePodcastEpisodes, youtubeId, type PodcastEpisode } from "@/lib/content";
import { useState } from "react";

const TITLE = "Podcast — Centro de Especialidades Filipinho";
const DESC = "Podcast do Centro de Especialidades Filipinho: vídeos e conversas sobre saúde, prevenção e cuidado.";

export const Route = createFileRoute("/podcast")({
  component: Podcast,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function shareLink(ep: PodcastEpisode) {
  return ep.external_url || ep.video_url || ep.audio_url || "";
}

function CopyLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  if (!url) return null;
  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 min-w-0 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          } catch {
            /* ignore */
          }
        }}
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"
      >
        {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {done ? "Copiado" : "Copiar link"}
      </button>
    </div>
  );
}

function EpisodeCard({ ep }: { ep: PodcastEpisode }) {
  const [playing, setPlaying] = useState(false);
  const yt = youtubeId(ep.video_url) ?? youtubeId(ep.external_url);
  const hasVideo = Boolean(yt || ep.video_url);
  const thumb = ep.cover_url || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : null);
  const link = shareLink(ep);

  return (
    <article className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
      <div className="relative aspect-video bg-black">
        {playing && yt ? (
          <iframe
            src={`https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`}
            title={ep.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : playing && ep.video_url ? (
          <video src={ep.video_url} controls autoPlay className="absolute inset-0 h-full w-full" />
        ) : (
          <button
            type="button"
            onClick={() => hasVideo && setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={hasVideo ? `Assistir ${ep.title}` : ep.title}
          >
            {thumb ? (
              <img src={thumb} alt={ep.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center bg-gradient-primary text-primary-foreground">
                <Headphones className="h-10 w-10" />
              </span>
            )}
            {hasVideo && (
              <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/40">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-destructive text-primary-foreground shadow-lg">
                  <Play className="h-7 w-7 translate-x-[1px] fill-current" />
                </span>
              </span>
            )}
          </button>
        )}
      </div>

      <div className="p-5">
        {ep.episode_number && (
          <div className="text-xs uppercase tracking-widest text-primary/70">Episódio {ep.episode_number}</div>
        )}
        <h2 className="mt-1 font-display text-lg font-semibold text-primary leading-snug">{ep.title}</h2>
        {ep.description && (
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{ep.description}</p>
        )}

        {ep.audio_url && !hasVideo && <audio src={ep.audio_url} controls className="mt-4 w-full" />}

        <CopyLink url={link} />

        {ep.external_url && (
          <a
            href={ep.external_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> Abrir na plataforma
          </a>
        )}
      </div>
    </article>
  );
}

function Podcast() {
  const { data: eps = [] } = usePodcastEpisodes();
  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <Mic className="h-4 w-4" /> Podcast
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Podcast Filipinho</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Conversas sobre saúde, prevenção, cuidado humanizado e o dia a dia da unidade.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {eps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">Nenhum episódio publicado ainda.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {eps.map((ep) => (
              <EpisodeCard key={ep.id} ep={ep} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
