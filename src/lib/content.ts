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

export type LeadershipMember = { role: string; name: string };
export type TextAlign = "left" | "center" | "right" | "justify";
export type InstitutionalContent = {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_align: TextAlign;
  mission: string;
  vision: string;
  values: string;
  cards_align: TextAlign;
  history: string;
  history_align: TextAlign;
  leadership: LeadershipMember[];
};

export type ContactContent = {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  map_embed_url: string;
  instagram_url: string;
};


export type BrandingContent = {
  site_title: string;
  tagline: string;
  cnes: string;
  logo_url: string;
  footer_dev_logo_url: string;
  footer_dev_url: string;
};

export type AppearanceContent = {
  primary_color: string;
  primary_glow_color: string;
  gold_color: string;
  heading_font: string;
  body_font: string;
  google_fonts_url: string;
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

export type SpecialtyCategory = "medica" | "nao_medica" | "procedimento" | "exame";
export type Specialty = {
  id: string;
  category: SpecialtyCategory;
  name: string;
  icon: string;
  sort_order: number;
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
    hero_eyebrow: "Institucional",
    hero_title: "Sobre a unidade",
    hero_subtitle:
      "Atendimento ambulatorial e eletivo em 12 especialidades médicas e 6 não médicas, reunindo mais de 30 profissionais dedicados à saúde da população.",
    hero_align: "left",
    mission:
      "Em consonância com a SEMUS, oferecer com excelência atendimento multiprofissional de forma resolutiva e humanizada à população de São Luís.",
    vision:
      "Consolidar-se como referência no atendimento multiprofissional especializado junto à população de São Luís e municípios pactuados.",
    values:
      "Ética, respeito, acolhimento, humanização, excelência, resolutividade e satisfação do paciente.",
    cards_align: "left",
    history: "",
    history_align: "left",
    leadership: [
      { role: "Direção", name: "Marcos Santos da Silva" },
      { role: "Sup. Administrativa", name: "Elvis Silva" },
      { role: "RT de Enfermagem", name: "Alcione Sodré" },
      { role: "RT de Farmácia", name: "Silvia Botelho" },
    ],
  } as InstitutionalContent,
  contact: {
    address: "Rua Vespasiano Ramos, 16 — CEP 65043-030, São Luís/MA",
    phone: "(98) 99149-7326",
    whatsapp: "5598991497326",
    email: "cemfilipinhoesp@gmail.com",
    hours: "Segunda a Sexta · 07h às 18h",
    map_embed_url: "",
    instagram_url: "",
  } as ContactContent,

  branding: {
    site_title: "Centro de Especialidades Filipinho",
    tagline: "Qualidade e Excelência em cada Atendimento",
    cnes: "2697998",
    logo_url: "",
    footer_dev_logo_url: "",
    footer_dev_url: "",
  } as BrandingContent,
  appearance: {
    primary_color: "",
    primary_glow_color: "",
    gold_color: "",
    heading_font: "",
    body_font: "",
    google_fonts_url: "",
  } as AppearanceContent,
};

const STORAGE_URL_RE = /\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/([^?]+)/;

export async function resolveStorageUrl(url: string | null | undefined): Promise<string> {
  if (!url) return url ?? "";
  const m = url.match(STORAGE_URL_RE);
  if (!m) return url;
  try {
    const bucket = m[1];
    const path = decodeURIComponent(m[2]);
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
    return data?.signedUrl ?? url;
  } catch {
    return url;
  }
}

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
export function useAppearanceContent() {
  return useQuery({
    queryKey: ["content", "appearance"],
    queryFn: () => fetchContent("appearance", DEFAULTS.appearance),
    initialData: DEFAULTS.appearance,
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

export function useSpecialties() {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async (): Promise<Specialty[]> => {
      const { data } = await supabase
        .from("specialties")
        .select("*")
        .eq("published", true)
        .order("category")
        .order("sort_order");
      return (data ?? []) as Specialty[];
    },
    initialData: [] as Specialty[],
  });
}
