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

export type HeaderContent = {
  nav_home: string;
  nav_sobre: string;
  nav_especialidades: string;
  nav_midia: string;
  nav_podcast: string;
  nav_contato: string;
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
  album_id: string | null;
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

export type EventItem = {
  id: string;
  title: string;
  event_date: string | null;
  cover_url: string | null;
  description: string | null;
  external_url: string | null;
  sort_order: number;
  published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  published: boolean;
};

export type Professional = {
  id: string;
  specialty_id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  bio: string | null;
  sort_order: number;
  published: boolean;
};

export type PhotoAlbum = {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
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
    leadership: [],
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
  header: {
    nav_home: "Início",
    nav_sobre: "Institucional",
    nav_especialidades: "Especialidades",
    nav_midia: "Mídia",
    nav_podcast: "Podcast",
    nav_contato: "Contato",
  } as HeaderContent,
};

const STORAGE_URL_RE = /\/storage\/v1\/object\/(?:public|sign)\/([^/]+)\/([^?]+)/;

export async function resolveStorageUrl(url: string | null | undefined): Promise<string> {
  if (!url) return url ?? "";
  const m = url.match(STORAGE_URL_RE);
  if (!m) return url;
  try {
    const bucket = m[1];
    const path = decodeURIComponent(m[2]);
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
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
    queryFn: async () => {
      const c = await fetchContent("home", DEFAULTS.home);
      return { ...c, hero_image_url: await resolveStorageUrl(c.hero_image_url) };
    },
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
    queryFn: async () => {
      const c = await fetchContent("branding", DEFAULTS.branding);
      return {
        ...c,
        logo_url: await resolveStorageUrl(c.logo_url),
        footer_dev_logo_url: await resolveStorageUrl(c.footer_dev_logo_url),
      };
    },
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
export function useHeaderContent() {
  return useQuery({
    queryKey: ["content", "header"],
    queryFn: () => fetchContent("header", DEFAULTS.header),
    initialData: DEFAULTS.header,
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
      const rows = (data ?? []) as MediaItem[];
      return Promise.all(
        rows.map(async (r) => ({
          ...r,
          url: await resolveStorageUrl(r.url),
          thumbnail_url: r.thumbnail_url ? await resolveStorageUrl(r.thumbnail_url) : null,
        })),
      );
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
      const rows = (data ?? []) as PodcastEpisode[];
      return Promise.all(
        rows.map(async (r) => ({
          ...r,
          cover_url: r.cover_url ? await resolveStorageUrl(r.cover_url) : null,
          audio_url: r.audio_url ? await resolveStorageUrl(r.audio_url) : null,
        })),
      );
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

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<EventItem[]> => {
      const { data } = await (supabase as any)
        .from("events")
        .select("*")
        .eq("published", true)
        .order("sort_order")
        .order("event_date", { ascending: false })
        .limit(5);
      const rows = (data ?? []) as EventItem[];
      return Promise.all(
        rows.map(async (r) => ({ ...r, cover_url: r.cover_url ? await resolveStorageUrl(r.cover_url) : null })),
      );
    },
    initialData: [] as EventItem[],
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async (): Promise<TeamMember[]> => {
      const { data } = await (supabase as any)
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      const rows = (data ?? []) as TeamMember[];
      return Promise.all(
        rows.map(async (r) => ({ ...r, photo_url: r.photo_url ? await resolveStorageUrl(r.photo_url) : null })),
      );
    },
    initialData: [] as TeamMember[],
  });
}

export function useProfessionals() {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async (): Promise<Professional[]> => {
      const { data } = await (supabase as any)
        .from("professionals")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      const rows = (data ?? []) as Professional[];
      return Promise.all(
        rows.map(async (r) => ({ ...r, photo_url: r.photo_url ? await resolveStorageUrl(r.photo_url) : null })),
      );
    },
    initialData: [] as Professional[],
  });
}

export function usePhotoAlbums() {
  return useQuery({
    queryKey: ["photo_albums"],
    queryFn: async (): Promise<PhotoAlbum[]> => {
      const { data } = await (supabase as any)
        .from("photo_albums")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      const rows = (data ?? []) as PhotoAlbum[];
      return Promise.all(
        rows.map(async (r) => ({ ...r, cover_url: r.cover_url ? await resolveStorageUrl(r.cover_url) : null })),
      );
    },
    initialData: [] as PhotoAlbum[],
  });
}
