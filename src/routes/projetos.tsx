import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FolderKanban, ExternalLink, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useAdminPanelLabels, useProjects, type Project } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { data: panelLabels } = useAdminPanelLabels();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <SiteLayout>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-xs uppercase tracking-widest text-gold">Institucional</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold">
            {panelLabels.projetos}
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85 text-lg">
            Conheça os projetos e instrumentos de gestão desenvolvidos pela unidade. Clique na capa
            para ampliar a imagem ou use o link para acessar o projeto completo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum projeto publicado ainda.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              return (
                <article
                  key={p.id}
                  className="group text-left rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition"
                >
                  <button
                    type="button"
                    onClick={() => p.cover_url && setSelectedProject(p)}
                    disabled={!p.cover_url}
                    className="aspect-[4/3] w-full bg-secondary relative overflow-hidden disabled:cursor-default"
                    aria-label={p.cover_url ? `Ampliar capa de ${p.title}` : undefined}
                  >
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
                    {p.cover_url && (
                      <div className="absolute top-3 right-3 rounded-full bg-background/85 text-foreground p-2 shadow">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-primary font-semibold">{p.title}</h3>
                    {p.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                        {p.description}
                      </p>
                    )}
                    {p.link_url && (
                      <Button asChild className="mt-4">
                        <a href={p.link_url} target="_blank" rel="noreferrer">
                          <ExternalLink /> Acessar projeto
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-5xl border-border bg-card p-3 sm:p-4">
          <DialogTitle className="pr-8 font-display text-primary">
            {selectedProject?.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Imagem ampliada da capa do projeto
          </DialogDescription>
          {selectedProject?.cover_url && (
            <img
              src={selectedProject.cover_url}
              alt={`Capa ampliada de ${selectedProject.title}`}
              className="max-h-[78vh] w-full object-contain"
            />
          )}
          {selectedProject?.link_url && (
            <Button asChild className="justify-self-center">
              <a href={selectedProject.link_url} target="_blank" rel="noreferrer">
                <ExternalLink /> Acessar projeto completo
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
