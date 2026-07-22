import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Camera, Play, ChevronLeft, FolderOpen, X } from "lucide-react";
import { useMediaItems, usePhotoAlbums, type MediaItem, type PhotoAlbum } from "@/lib/content";

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

function VideoCard({ v }: { v: MediaItem }) {
  const [playing, setPlaying] = useState(false);
  const embed = embedVideoUrl(v.url);
  const isFile = embed?.match(/\.(mp4|webm|ogg)$/i);
  const poster = v.thumbnail_url || youtubeThumb(v.url) || undefined;

  const PosterOverlay = (
    <>
      {poster ? (
        <img src={poster} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
      ) : isFile ? (
        <video src={embed!} preload="metadata" muted playsInline className="absolute inset-0 h-full w-full object-cover pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-gradient-hero" />
      )}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition grid place-items-center">
        <div className="h-16 w-16 rounded-full bg-gold text-primary grid place-items-center shadow-elegant group-hover:scale-105 transition">
          <Play className="h-7 w-7 ml-1" fill="currentColor" />
        </div>
      </div>
    </>
  );

  return (
    <article className="rounded-2xl overflow-hidden border border-border bg-card shadow-card">
      <div className="aspect-video bg-black relative">
        {isFile && playing ? (
          <video src={embed!} controls autoPlay className="h-full w-full" poster={poster} />
        ) : embed && !isFile && playing ? (
          <iframe src={embed} title={v.title} className="h-full w-full" allowFullScreen allow="autoplay; encrypted-media" />
        ) : embed ? (
          <button type="button" onClick={() => setPlaying(true)} className="group h-full w-full relative" aria-label={`Reproduzir ${v.title}`}>
            {PosterOverlay}
          </button>
        ) : (
          <a href={v.url} target="_blank" rel="noreferrer" className="group h-full w-full relative block" aria-label={`Abrir ${v.title}`}>
            {PosterOverlay}
          </a>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-primary font-semibold">{v.title}</h3>
        {v.description && <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>}
      </div>
    </article>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4" onClick={onClose}>
      <button aria-label="Fechar" className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white">
        <X className="h-5 w-5" />
      </button>
      <img src={src} alt="" className="max-h-[90vh] max-w-full object-contain" />
    </div>
  );
}

function AlbumView({ album, photos, onBack }: { album: PhotoAlbum; photos: MediaItem[]; onBack: () => void }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const shown = photos.slice(0, 12);
  return (
    <>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-6">
        <ChevronLeft className="h-4 w-4" /> Voltar aos álbuns
      </button>
      <h3 className="font-display text-2xl text-primary font-semibold">{album.name}</h3>
      {album.description && <p className="mt-1 text-sm text-muted-foreground">{album.description}</p>}
      {shown.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Álbum vazio.</p>
      ) : (
        <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((f) => (
            <button key={f.id} type="button" onClick={() => setLightbox(f.url)} className="aspect-square rounded-xl overflow-hidden border border-border shadow-card group">
              <img src={f.thumbnail_url || f.url} alt={f.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
            </button>
          ))}
        </div>
      )}
      {photos.length > 12 && (
        <p className="mt-4 text-xs text-muted-foreground">Exibindo 12 de {photos.length} fotos deste álbum.</p>
      )}
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function Midia() {
  const { data: items = [] } = useMediaItems();
  const { data: albums = [] } = usePhotoAlbums();
  const [openAlbum, setOpenAlbum] = useState<PhotoAlbum | null>(null);
  const videos = items.filter((i) => i.kind === "video");
  const fotos = items.filter((i) => i.kind === "photo");

  const photosByAlbum = new Map<string, MediaItem[]>();
  const unassigned: MediaItem[] = [];
  fotos.forEach((f) => {
    if (f.album_id) {
      const arr = photosByAlbum.get(f.album_id) ?? [];
      arr.push(f);
      photosByAlbum.set(f.album_id, arr);
    } else {
      unassigned.push(f);
    }
  });

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

          {openAlbum ? (
            <AlbumView
              album={openAlbum}
              photos={photosByAlbum.get(openAlbum.id) ?? []}
              onBack={() => setOpenAlbum(null)}
            />
          ) : (
            <>
              {albums.length === 0 && unassigned.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma foto publicada ainda.</p>
              )}
              {albums.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {albums.map((a) => {
                    const count = photosByAlbum.get(a.id)?.length ?? 0;
                    const cover = a.cover_url || photosByAlbum.get(a.id)?.[0]?.thumbnail_url || photosByAlbum.get(a.id)?.[0]?.url;
                    return (
                      <button
                        key={a.id}
                        onClick={() => setOpenAlbum(a)}
                        className="text-left rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition"
                      >
                        <div className="aspect-[4/3] bg-secondary relative">
                          {cover ? (
                            <img src={cover} alt={a.name} className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                              <FolderOpen className="h-10 w-10" />
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 text-white text-xs px-2.5 py-1">
                            {count} {count === 1 ? "foto" : "fotos"}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="font-display text-lg text-primary font-semibold">{a.name}</div>
                          {a.description && <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.description}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {unassigned.length > 0 && (
                <div className={albums.length > 0 ? "mt-10" : ""}>
                  {albums.length > 0 && (
                    <h3 className="font-display text-lg text-primary font-semibold mb-4">Sem álbum</h3>
                  )}
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {unassigned.slice(0, 12).map((f) => (
                      <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden border border-border shadow-card group">
                        <img src={f.thumbnail_url || f.url} alt={f.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
