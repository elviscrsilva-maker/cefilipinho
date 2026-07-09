import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mic, Headphones, ExternalLink } from "lucide-react";
import { usePodcastEpisodes } from "@/lib/content";

const TITLE = "Podcast — Centro de Especialidades Filipinho";
const DESC = "Podcast do Centro de Especialidades Filipinho: conversas sobre saúde, prevenção e cuidado.";

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

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {eps.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">Nenhum episódio publicado ainda.</p>
        ) : (
          <div className="space-y-6">
            {eps.map((ep) => (
              <article key={ep.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-5 items-start">
                  <div className="h-24 w-24 rounded-xl overflow-hidden bg-gradient-primary grid place-items-center text-primary-foreground shrink-0">
                    {ep.cover_url ? (
                      <img src={ep.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Headphones className="h-8 w-8" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {ep.episode_number && (
                      <div className="text-xs uppercase tracking-widest text-primary/70">
                        Episódio {ep.episode_number}
                      </div>
                    )}
                    <h2 className="mt-1 font-display text-xl text-primary font-semibold">{ep.title}</h2>
                    {ep.description && (
                      <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{ep.description}</p>
                    )}
                  </div>
                </div>
                {ep.audio_url && (
                  <audio src={ep.audio_url} controls className="mt-5 w-full" />
                )}
                {ep.external_url && (
                  <a
                    href={ep.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" /> Ouvir na plataforma externa
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
