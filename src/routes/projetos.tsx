import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FolderKanban, ExternalLink } from "lucide-react";
import { useProjects } from "@/lib/content";

const TITLE = "Projetos e Instrumento de Gestão — Centro de Especialidades Filipinho";
const DESC =
  "Projetos institucionais e instrumentos de gestão do Centro de Especialidades Filipinho.";

export const Route = createFileRoute("/projetos")({
  component: Projetos,
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

function Projetos() {
  const { data: items = [] } = useProjects();

  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">Institucional</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
            Projetos e Instrumento de Gestão
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Conheça os projetos e instrumentos de gestão desenvolvidos pela unidade. Clique em uma
            capa para acessar o projeto completo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum projeto publicado ainda.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const CardInner = (
                <>
                  <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                    {p.cover_url ? (
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                        <FolderKanban className="h-12 w-12" />
                      </div>
                    )}
                    {p.link_url && (
                      <div className="absolute top-3 right-3 rounded-full bg-black/60 text-white text-xs px-2.5 py-1 inline-flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Abrir
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-primary font-semibold">{p.title}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                        {p.description}
                      </p>
                    )}
                  </div>
                </>
              );

              const className =
                "group text-left rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition block";

              return p.link_url ? (
                <a
                  key={p.id}
                  href={p.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  aria-label={`Abrir projeto ${p.title}`}
                >
                  {CardInner}
                </a>
              ) : (
                <div key={p.id} className={className}>
                  {CardInner}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
