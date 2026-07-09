import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HomeContent = {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

export type InstitutionalContent = {
  mission: string;
  vision: string;
  values: string;
  history: string;
};

export type ContactContent = {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  map_embed_url: string;
};

export type BrandingContent = {
  site_title: string;
  tagline: string;
  cnes: string;
  logo_url: string;
  footer_dev_logo_url: string;
  footer_dev_url: string;
};

export type MediaItem = {
  id: string;
  kind: "photo" | "video";
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  published: boolean;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  audio_url: string | null;
  external_url: string | null;
  episode_number: number | null;
  published_at: string;
  published: boolean;
};

export const DEFAULTS = {
  home: {
    hero_eyebrow: "SEMUS · São Luís",
    hero_title: "Centro de Especialidades Filipinho",
    hero_subtitle:
      "Qualidade e excelência em cada atendimento. Cuidado multiprofissional, humanizado e resolutivo para a população da grande ilha de São Luís.",
    hero_image_url: "",
    cta_primary_label: "Ver especialidades",
    cta_primary_href: "/especialidades",
    cta_secondary_label: "Fale conosco",
    cta_secondary_href: "/contato",
  } as HomeContent,
  institutional: {
    mission:
      "Em consonância com a SEMUS, oferecer com excelência atendimento multiprofissional de forma resolutiva e humanizada à população de São Luís.",
    vision:
      "Consolidar-se como referência no atendimento multiprofissional especializado junto à população de São Luís e municípios pactuados.",
    values:
      "Ética, respeito, acolhimento, humanização, excelência, resolutividade e satisfação do paciente.",
    history: "",
  } as InstitutionalContent,
  contact: {
    address: "Rua Vespasiano Ramos, 16 — CEP 65043-030, São Luís/MA",
    phone: "(98) 99149-7326",
    whatsapp: "5598991497326",
    email: "cemfilipinhoesp@gmail.com",
    hours: "Segunda a Sexta · 07h às 18h",
    map_embed_url: "",
  } as ContactContent,
  branding: {
    site_title: "Centro de Especialidades Filipinho",
    tagline: "Qualidade e Excelência em cada Atendimento",
    cnes: "2697998",
    logo_url: "",
    footer_dev_logo_url: "",
    footer_dev_url: "",
  } as BrandingContent,
};

async function fetchContent<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (!data?.value) return fallback;
  return { ...fallback, ...(data.value as Partial<T>) };
}

export function useHomeContent() {
  return useQuery({
    queryKey: ["content", "home"],
    queryFn: () => fetchContent("home", DEFAULTS.home),
    initialData: DEFAULTS.home,
  });
}
export function useInstitutionalContent() {
  return useQuery({
    queryKey: ["content", "institutional"],
    queryFn: () => fetchContent("institutional", DEFAULTS.institutional),
    initialData: DEFAULTS.institutional,
  });
}
export function useContactContent() {
  return useQuery({
    queryKey: ["content", "contact"],
    queryFn: () => fetchContent("contact", DEFAULTS.contact),
    initialData: DEFAULTS.contact,
  });
}
export function useBrandingContent() {
  return useQuery({
    queryKey: ["content", "branding"],
    queryFn: () => fetchContent("branding", DEFAULTS.branding),
    initialData: DEFAULTS.branding,
  });
}

export function useMediaItems() {
  return useQuery({
    queryKey: ["media_items"],
    queryFn: async (): Promise<MediaItem[]> => {
      const { data } = await supabase
        .from("media_items")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      return (data ?? []) as MediaItem[];
    },
    initialData: [] as MediaItem[],
  });
}

export function usePodcastEpisodes() {
  return useQuery({
    queryKey: ["podcast_episodes"],
    queryFn: async (): Promise<PodcastEpisode[]> => {
      const { data } = await supabase
        .from("podcast_episodes")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return (data ?? []) as PodcastEpisode[];
    },
    initialData: [] as PodcastEpisode[],
  });
}
