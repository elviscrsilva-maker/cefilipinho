import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  DEFAULTS,
  type HomeContent,
  type InstitutionalContent,
  type ContactContent,
  type BrandingContent,
  type AppearanceContent,
  type MediaItem,
  type PodcastEpisode,
  type Specialty,
  type SpecialtyCategory,
  type TextAlign,
} from "@/lib/content";
import {
  Loader2,
  LogOut,
  Save,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  Video,
  Mic,
  Home,
  Building2,
  Phone,
  Palette,
  KeyRound,
  Stethoscope,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";


export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Tab =
  | "home"
  | "institucional"
  | "contato"
  | "branding"
  | "especialidades"
  | "aparencia"
  | "midia"
  | "podcast"
  | "conta";

const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Página Inicial", icon: Home },
  { id: "institucional", label: "Institucional", icon: Building2 },
  { id: "contato", label: "Contato", icon: Phone },
  { id: "branding", label: "Marca e Rodapé", icon: Palette },
  { id: "especialidades", label: "Especialidades e Exames", icon: Stethoscope },
  { id: "aparencia", label: "Aparência (cores/fontes)", icon: Palette },
  { id: "midia", label: "Mídia (Fotos/Vídeos)", icon: ImageIcon },
  { id: "podcast", label: "Podcast", icon: Mic },
  { id: "conta", label: "Minha Conta", icon: KeyRound },
];

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center rounded-2xl border border-border bg-card p-8 shadow-card">
          <h1 className="font-display text-2xl text-primary">Acesso negado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta ({user.email}) não tem permissão de administrador.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary-foreground/70">
              Painel administrativo
            </div>
            <div className="font-display text-lg font-semibold">
              Centro de Especialidades Filipinho
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-primary-foreground/80 hover:text-primary-foreground">
              Ver site →
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-md border border-primary-foreground/25 px-3 py-1.5 text-xs hover:bg-primary-foreground/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <nav className="lg:sticky lg:top-6 self-start rounded-xl border border-border bg-card p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-left transition ${
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </nav>

        <main className="min-w-0">
          {tab === "home" && <HomeEditor />}
          {tab === "institucional" && <InstitutionalEditor />}
          {tab === "contato" && <ContactEditor />}
          {tab === "branding" && <BrandingEditor />}
          {tab === "especialidades" && <SpecialtiesEditor />}
          {tab === "aparencia" && <AppearanceEditor />}
          {tab === "midia" && <MediaEditor />}
          {tab === "podcast" && <PodcastEditor />}
          {tab === "conta" && <AccountEditor />}
        </main>
      </div>
    </div>
  );
}

/* ---------- shared UI ---------- */
function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-xl text-primary font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  );
}
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
    />
  );
}
function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      Salvar alterações
    </button>
  );
}
function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-elegant">
      {text}
    </div>
  );
}
function AlignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: TextAlign;
  onChange: (v: TextAlign) => void;
}) {
  const opts: { v: TextAlign; icon: typeof AlignLeft; title: string }[] = [
    { v: "left", icon: AlignLeft, title: "Esquerda" },
    { v: "center", icon: AlignCenter, title: "Centralizar" },
    { v: "right", icon: AlignRight, title: "Direita" },
    { v: "justify", icon: AlignJustify, title: "Justificar" },
  ];
  return (
    <div>
      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{label}</span>
      <div className="mt-1 inline-flex rounded-md border border-input bg-background overflow-hidden">
        {opts.map((o) => {
          const Icon = o.icon;
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              title={o.title}
              className={`px-3 py-2 text-sm transition ${
                active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- content section hook ---------- */
function useContentSection<T extends Record<string, any>>(key: string, fallback: T) {
  const qc = useQueryClient();
  const query = useQuery<T>({
    queryKey: ["admin_content", key],
    queryFn: async (): Promise<T> => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      return { ...fallback, ...((data?.value as Partial<T>) ?? {}) };
    },
    initialData: fallback,
  });
  const save = async (value: T) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value: value as any }, { onConflict: "key" });
    if (error) throw error;
    qc.invalidateQueries({ queryKey: ["admin_content", key] });
    qc.invalidateQueries({ queryKey: ["content", key] });
  };
  return { data: (query.data ?? fallback) as T, save };
}

/* ---------- HOME ---------- */
function HomeEditor() {
  const { data, save } = useContentSection<HomeContent>("home", DEFAULTS.home);
  const [form, setForm] = useState<HomeContent>(data ?? DEFAULTS.home);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setForm(data), [data]);

  const upd = (k: keyof HomeContent, v: string) => setForm({ ...form, [k]: v });

  return (
    <Card title="Página inicial" description="Textos e imagem principal da home.">
      <Field label="Etiqueta acima do título">
        <TextInput value={form.hero_eyebrow} onChange={(e) => upd("hero_eyebrow", e.target.value)} />
      </Field>
      <Field label="Título principal">
        <TextInput value={form.hero_title} onChange={(e) => upd("hero_title", e.target.value)} />
      </Field>
      <Field label="Subtítulo / descrição">
        <TextArea value={form.hero_subtitle} onChange={(e) => upd("hero_subtitle", e.target.value)} />
      </Field>
      <Field label="Imagem de fundo do hero" hint="Envie uma imagem ou cole uma URL. Deixe em branco para usar a fachada padrão.">
        <UploadOrUrl
          bucket="branding"
          value={form.hero_image_url}
          onChange={(v) => upd("hero_image_url", v)}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Botão 1 — texto">
          <TextInput value={form.cta_primary_label} onChange={(e) => upd("cta_primary_label", e.target.value)} />
        </Field>
        <Field label="Botão 1 — link">
          <TextInput value={form.cta_primary_href} onChange={(e) => upd("cta_primary_href", e.target.value)} />
        </Field>
        <Field label="Botão 2 — texto">
          <TextInput value={form.cta_secondary_label} onChange={(e) => upd("cta_secondary_label", e.target.value)} />
        </Field>
        <Field label="Botão 2 — link">
          <TextInput value={form.cta_secondary_href} onChange={(e) => upd("cta_secondary_href", e.target.value)} />
        </Field>
      </div>
      <SaveButton
        saving={saving}
        onClick={async () => {
          setSaving(true);
          try {
            await save(form);
            setToast("Alterações salvas!");
            setTimeout(() => setToast(null), 2500);
          } catch (e: any) {
            setToast("Erro: " + e.message);
          } finally {
            setSaving(false);
          }
        }}
      />
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- INSTITUCIONAL ---------- */
function InstitutionalEditor() {
  const { data, save } = useContentSection<InstitutionalContent>("institutional", DEFAULTS.institutional);
  const [form, setForm] = useState<InstitutionalContent>(data);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setForm(data), [data]);
  return (
    <Card title="Institucional" description="Cabeçalho, missão, visão, valores, histórico e equipe de direção.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Etiqueta acima do título (hero)">
          <TextInput value={form.hero_eyebrow} onChange={(e) => setForm({ ...form, hero_eyebrow: e.target.value })} />
        </Field>
        <Field label="Título do hero">
          <TextInput value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
        </Field>
      </div>
      <Field label="Subtítulo / descrição do hero">
        <TextArea value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
      </Field>
      <AlignPicker
        label="Alinhamento do subtítulo (hero)"
        value={form.hero_align ?? "left"}
        onChange={(v) => setForm({ ...form, hero_align: v })}
      />
      <Field label="Missão"><TextArea value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} /></Field>
      <Field label="Visão"><TextArea value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} /></Field>
      <Field label="Valores"><TextArea value={form.values} onChange={(e) => setForm({ ...form, values: e.target.value })} /></Field>
      <AlignPicker
        label="Alinhamento dos cartões (missão/visão/valores)"
        value={form.cards_align ?? "left"}
        onChange={(v) => setForm({ ...form, cards_align: v })}
      />
      <Field label="Histórico / apresentação" hint="Texto livre (opcional).">
        <TextArea value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} />
      </Field>
      <AlignPicker
        label="Alinhamento do histórico"
        value={form.history_align ?? "left"}
        onChange={(v) => setForm({ ...form, history_align: v })}
      />

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">Direção & Coordenação</div>
            <div className="text-xs text-muted-foreground">Cartões exibidos na página Institucional.</div>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                leadership: [...(form.leadership ?? []), { role: "", name: "" }],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {(form.leadership ?? []).map((m, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-end">
              <Field label="Cargo">
                <TextInput
                  value={m.role}
                  onChange={(e) => {
                    const next = [...(form.leadership ?? [])];
                    next[idx] = { ...next[idx], role: e.target.value };
                    setForm({ ...form, leadership: next });
                  }}
                />
              </Field>
              <Field label="Nome">
                <TextInput
                  value={m.name}
                  onChange={(e) => {
                    const next = [...(form.leadership ?? [])];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setForm({ ...form, leadership: next });
                  }}
                />
              </Field>
              <button
                type="button"
                onClick={() => {
                  const next = (form.leadership ?? []).filter((_, i) => i !== idx);
                  setForm({ ...form, leadership: next });
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 text-destructive px-3 py-2 text-xs hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remover
              </button>
            </div>
          ))}
          {(form.leadership ?? []).length === 0 && (
            <p className="text-xs text-muted-foreground">Nenhum membro cadastrado.</p>
          )}
        </div>
      </div>

      <SaveButton
        saving={saving}
        onClick={async () => {
          setSaving(true);
          try { await save(form); setToast("Alterações salvas!"); setTimeout(() => setToast(null), 2500); }
          catch (e: any) { setToast("Erro: " + e.message); }
          finally { setSaving(false); }
        }}
      />
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- CONTATO ---------- */
function ContactEditor() {
  const { data, save } = useContentSection<ContactContent>("contact", DEFAULTS.contact);
  const [form, setForm] = useState<ContactContent>(data);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setForm(data), [data]);
  return (
    <Card title="Contato" description="Informações de contato exibidas no site.">
      <Field label="Endereço"><TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Telefone"><TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="WhatsApp (só números com DDI)" hint="Ex.: 5598991497326">
          <TextInput value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
        </Field>
        <Field label="E-mail"><TextInput value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Horário"><TextInput value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></Field>
      </div>
      <Field label="Mapa (URL do iframe do Google Maps)" hint="Cole aqui o link 'src' do iframe de compartilhamento do Google Maps.">
        <TextInput value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} />
      </Field>
      <Field label="Instagram da unidade (URL completa)" hint="Ex.: https://instagram.com/cefilipinho">
        <TextInput value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} />
      </Field>

      <SaveButton
        saving={saving}
        onClick={async () => {
          setSaving(true);
          try { await save(form); setToast("Alterações salvas!"); setTimeout(() => setToast(null), 2500); }
          catch (e: any) { setToast("Erro: " + e.message); }
          finally { setSaving(false); }
        }}
      />
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- BRANDING ---------- */
function BrandingEditor() {
  const { data, save } = useContentSection<BrandingContent>("branding", DEFAULTS.branding);
  const [form, setForm] = useState<BrandingContent>(data);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setForm(data), [data]);
  return (
    <Card title="Marca e Rodapé" description="Logo do cabeçalho, logo do desenvolvedor no rodapé e textos institucionais.">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do site (cabeçalho/rodapé)">
          <TextInput value={form.site_title} onChange={(e) => setForm({ ...form, site_title: e.target.value })} />
        </Field>
        <Field label="Slogan"><TextInput value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
        <Field label="CNES"><TextInput value={form.cnes} onChange={(e) => setForm({ ...form, cnes: e.target.value })} /></Field>
      </div>
      <Field label="Logo do cabeçalho" hint="Se em branco, usa a logo oficial padrão.">
        <UploadOrUrl bucket="branding" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Logo do desenvolvedor (rodapé)" hint="Se em branco, usa sua logomarca padrão.">
          <UploadOrUrl bucket="branding" value={form.footer_dev_logo_url} onChange={(v) => setForm({ ...form, footer_dev_logo_url: v })} />
        </Field>
        <Field label="Link do logo do desenvolvedor" hint="Opcional. Ex.: https://seusite.com">
          <TextInput value={form.footer_dev_url} onChange={(e) => setForm({ ...form, footer_dev_url: e.target.value })} />
        </Field>
      </div>
      <SaveButton
        saving={saving}
        onClick={async () => {
          setSaving(true);
          try { await save(form); setToast("Alterações salvas!"); setTimeout(() => setToast(null), 2500); }
          catch (e: any) { setToast("Erro: " + e.message); }
          finally { setSaving(false); }
        }}
      />
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- MEDIA ---------- */
function MediaEditor() {
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin_media"],
    queryFn: async (): Promise<MediaItem[]> => {
      const { data } = await supabase.from("media_items").select("*").order("sort_order").order("created_at", { ascending: false });
      return (data ?? []) as MediaItem[];
    },
  });
  const [toast, setToast] = useState<string | null>(null);

  async function addItem(kind: "photo" | "video") {
    const { error } = await supabase.from("media_items").insert({
      kind,
      title: kind === "photo" ? "Nova foto" : "Novo vídeo",
      url: "",
      sort_order: (items?.length ?? 0) + 1,
    });
    if (error) return setToast("Erro: " + error.message);
    refetch();
  }

  async function updateItem(id: string, patch: Partial<MediaItem>) {
    const { error } = await supabase.from("media_items").update(patch).eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["media_items"] });
    refetch();
  }

  async function removeItem(id: string) {
    if (!confirm("Excluir este item?")) return;
    const { error } = await supabase.from("media_items").delete().eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["media_items"] });
    refetch();
  }

  return (
    <Card title="Mídia" description="Fotos e vídeos exibidos na página Mídia do site.">
      <div className="flex gap-2">
        <button onClick={() => addItem("photo")} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar foto
        </button>
        <button onClick={() => addItem("video")} className="inline-flex items-center gap-2 rounded-md border border-primary px-3 py-2 text-sm text-primary">
          <Video className="h-4 w-4" /> Adicionar vídeo
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item ainda.</p>}
        {items.map((it) => (
          <div key={it.id} className="rounded-lg border border-border p-4 grid gap-3 md:grid-cols-[120px_1fr_auto]">
            <div className="w-full h-24 bg-secondary rounded-md overflow-hidden grid place-items-center">
              {it.thumbnail_url || (it.kind === "photo" && it.url) ? (
                <img src={it.thumbnail_url || it.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground uppercase">{it.kind}</span>
              )}
            </div>
            <div className="grid gap-2">
              <TextInput defaultValue={it.title} placeholder="Título" onBlur={(e) => updateItem(it.id, { title: e.target.value })} />
              <UploadOrUrl
                bucket="media"
                value={it.url}
                onChange={(v) => updateItem(it.id, { url: v })}
                accept={it.kind === "photo" ? "image/*" : "video/*"}
                placeholder={it.kind === "photo" ? "URL da imagem ou envie o arquivo" : "URL do vídeo (YouTube/Vimeo) ou envie"}
              />
              {it.kind === "video" && (
                <TextInput defaultValue={it.thumbnail_url ?? ""} placeholder="URL da miniatura (opcional)" onBlur={(e) => updateItem(it.id, { thumbnail_url: e.target.value })} />
              )}
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={it.published} onChange={(e) => updateItem(it.id, { published: e.target.checked })} />
                Publicado no site
              </label>
            </div>
            <div className="flex md:flex-col items-start gap-2">
              <button onClick={() => removeItem(it.id)} className="text-destructive hover:bg-destructive/10 rounded-md p-2" aria-label="Excluir">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- PODCAST ---------- */
function PodcastEditor() {
  const qc = useQueryClient();
  const { data: eps = [], refetch } = useQuery({
    queryKey: ["admin_podcast"],
    queryFn: async (): Promise<PodcastEpisode[]> => {
      const { data } = await supabase.from("podcast_episodes").select("*").order("published_at", { ascending: false });
      return (data ?? []) as PodcastEpisode[];
    },
  });
  const [toast, setToast] = useState<string | null>(null);

  async function addEp() {
    const { error } = await supabase.from("podcast_episodes").insert({ title: "Novo episódio" });
    if (error) return setToast("Erro: " + error.message);
    refetch();
  }
  async function upd(id: string, patch: Partial<PodcastEpisode>) {
    const { error } = await supabase.from("podcast_episodes").update(patch).eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["podcast_episodes"] });
    refetch();
  }
  async function del(id: string) {
    if (!confirm("Excluir este episódio?")) return;
    const { error } = await supabase.from("podcast_episodes").delete().eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["podcast_episodes"] });
    refetch();
  }

  return (
    <Card title="Podcast" description="Cadastre e edite os episódios do podcast.">
      <button onClick={addEp} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
        <Plus className="h-4 w-4" /> Novo episódio
      </button>
      <div className="space-y-4">
        {eps.length === 0 && <p className="text-sm text-muted-foreground">Nenhum episódio ainda.</p>}
        {eps.map((ep) => (
          <div key={ep.id} className="rounded-lg border border-border p-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-[120px_1fr]">
              <div className="h-24 w-full bg-secondary rounded-md overflow-hidden grid place-items-center">
                {ep.cover_url ? <img src={ep.cover_url} alt="" className="h-full w-full object-cover" /> : <Mic className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div className="grid gap-2">
                <TextInput defaultValue={ep.title} placeholder="Título" onBlur={(e) => upd(ep.id, { title: e.target.value })} />
                <TextArea defaultValue={ep.description ?? ""} placeholder="Descrição" onBlur={(e) => upd(ep.id, { description: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Capa do episódio">
                <UploadOrUrl bucket="podcast" value={ep.cover_url ?? ""} onChange={(v) => upd(ep.id, { cover_url: v })} accept="image/*" />
              </Field>
              <Field label="Arquivo de áudio" hint="Envie um MP3 ou cole a URL.">
                <UploadOrUrl bucket="podcast" value={ep.audio_url ?? ""} onChange={(v) => upd(ep.id, { audio_url: v })} accept="audio/*" />
              </Field>
              <Field label="Link externo (Spotify/YouTube)" hint="Opcional.">
                <TextInput defaultValue={ep.external_url ?? ""} placeholder="https://open.spotify.com/..." onBlur={(e) => upd(ep.id, { external_url: e.target.value })} />
              </Field>
              <Field label="Nº do episódio">
                <TextInput type="number" defaultValue={ep.episode_number ?? ""} onBlur={(e) => upd(ep.id, { episode_number: e.target.value ? Number(e.target.value) : null })} />
              </Field>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={ep.published} onChange={(e) => upd(ep.id, { published: e.target.checked })} />
                Publicado
              </label>
              <button onClick={() => del(ep.id)} className="text-destructive hover:bg-destructive/10 rounded-md p-2" aria-label="Excluir">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- ACCOUNT ---------- */
function AccountEditor() {
  const { user } = useAuth();
  const [newPass, setNewPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function change() {
    if (newPass.length < 6) return setToast("A senha deve ter pelo menos 6 caracteres.");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSaving(false);
    if (error) return setToast("Erro: " + error.message);
    setNewPass("");
    setToast("Senha alterada!");
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <Card title="Minha conta" description="Altere sua senha de acesso ao painel.">
      <p className="text-sm text-muted-foreground">
        E-mail: <span className="font-medium text-foreground">{user?.email}</span>
      </p>
      <Field label="Nova senha" hint="Mínimo de 6 caracteres.">
        <TextInput type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" />
      </Field>
      <button
        onClick={change}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Alterar senha
      </button>
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- UPLOAD ---------- */
function UploadOrUrl({
  bucket,
  value,
  onChange,
  accept = "image/*",
  placeholder = "URL ou envie um arquivo",
}: {
  bucket: "branding" | "media" | "podcast";
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } else {
      alert("Erro no upload: " + error.message);
    }
    setUploading(false);
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-secondary">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Enviar
          <input type="file" accept={accept} className="hidden" onChange={onFile} disabled={uploading} />
        </label>
      </div>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ExternalLink className="h-3 w-3" /> Abrir arquivo atual
        </a>
      )}
    </div>
  );
}

/* ---------- SPECIALTIES ---------- */
const CATEGORY_LABELS: Record<SpecialtyCategory, string> = {
  medica: "Especialidade Médica",
  nao_medica: "Especialidade Não Médica",
  procedimento: "Procedimento",
  exame: "Exame Diagnóstico",
};

function SpecialtiesEditor() {
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["admin_specialties"],
    queryFn: async (): Promise<Specialty[]> => {
      const { data } = await supabase.from("specialties").select("*").order("category").order("sort_order");
      return (data ?? []) as Specialty[];
    },
  });
  const [toast, setToast] = useState<string | null>(null);

  async function add(category: SpecialtyCategory) {
    const { error } = await supabase.from("specialties").insert({
      category,
      name: "Novo item",
      icon: "Stethoscope",
      sort_order: (items.filter((i) => i.category === category).length + 1) * 10,
    });
    if (error) return setToast("Erro: " + error.message);
    refetch();
  }
  async function upd(id: string, patch: Partial<Specialty>) {
    const { error } = await supabase.from("specialties").update(patch).eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["specialties"] });
    refetch();
  }
  async function del(id: string) {
    if (!confirm("Excluir este item?")) return;
    const { error } = await supabase.from("specialties").delete().eq("id", id);
    if (error) return setToast("Erro: " + error.message);
    qc.invalidateQueries({ queryKey: ["specialties"] });
    refetch();
  }

  const cats: SpecialtyCategory[] = ["medica", "nao_medica", "procedimento", "exame"];

  return (
    <Card title="Especialidades e Exames" description="Adicione, edite ou remova especialidades médicas/não médicas, procedimentos e exames diagnósticos.">
      <p className="text-xs text-muted-foreground">
        Dica: no campo "Ícone", use um nome da biblioteca Lucide (ex.: Heart, Brain, Stethoscope, TestTube, Activity).
        Veja a lista completa em <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer" className="text-primary underline">lucide.dev/icons</a>.
      </p>
      {cats.map((cat) => {
        const list = items.filter((i) => i.category === cat);
        return (
          <div key={cat} className="rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-primary font-semibold">{CATEGORY_LABELS[cat]}</h3>
              <button onClick={() => add(cat)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground">
                <Plus className="h-3.5 w-3.5" /> Adicionar
              </button>
            </div>
            {list.length === 0 && <p className="text-xs text-muted-foreground">Nenhum item cadastrado.</p>}
            {list.map((it) => (
              <div key={it.id} className="grid gap-2 md:grid-cols-[1fr_180px_100px_auto_auto] items-center border-t border-border pt-3">
                <TextInput defaultValue={it.name} placeholder="Nome" onBlur={(e) => upd(it.id, { name: e.target.value })} />
                <TextInput defaultValue={it.icon} placeholder="Ícone (ex: Heart)" onBlur={(e) => upd(it.id, { icon: e.target.value })} />
                <TextInput type="number" defaultValue={it.sort_order} placeholder="Ordem" onBlur={(e) => upd(it.id, { sort_order: Number(e.target.value) || 0 })} />
                <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                  <input type="checkbox" checked={it.published} onChange={(e) => upd(it.id, { published: e.target.checked })} />
                  Publicado
                </label>
                <button onClick={() => del(it.id)} className="text-destructive hover:bg-destructive/10 rounded-md p-2" aria-label="Excluir">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        );
      })}
      <Toast text={toast} />
    </Card>
  );
}

/* ---------- APPEARANCE ---------- */
function AppearanceEditor() {
  const { data, save } = useContentSection<AppearanceContent>("appearance", DEFAULTS.appearance);
  const [form, setForm] = useState<AppearanceContent>(data);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setForm(data), [data]);
  const upd = (k: keyof AppearanceContent, v: string) => setForm({ ...form, [k]: v });

  return (
    <Card title="Aparência" description="Personalize cores e fontes do site. Deixe em branco para usar os valores padrão.">
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Cor primária" hint="Ex.: #1e3a8a">
          <div className="flex gap-2">
            <input type="color" value={form.primary_color || "#1e3a8a"} onChange={(e) => upd("primary_color", e.target.value)} className="h-10 w-14 rounded border border-input" />
            <TextInput value={form.primary_color} onChange={(e) => upd("primary_color", e.target.value)} placeholder="#1e3a8a" />
          </div>
        </Field>
        <Field label="Cor primária clara (brilho)" hint="Usada em gradientes.">
          <div className="flex gap-2">
            <input type="color" value={form.primary_glow_color || "#3b82f6"} onChange={(e) => upd("primary_glow_color", e.target.value)} className="h-10 w-14 rounded border border-input" />
            <TextInput value={form.primary_glow_color} onChange={(e) => upd("primary_glow_color", e.target.value)} placeholder="#3b82f6" />
          </div>
        </Field>
        <Field label="Cor de destaque (dourado)">
          <div className="flex gap-2">
            <input type="color" value={form.gold_color || "#d4af37"} onChange={(e) => upd("gold_color", e.target.value)} className="h-10 w-14 rounded border border-input" />
            <TextInput value={form.gold_color} onChange={(e) => upd("gold_color", e.target.value)} placeholder="#d4af37" />
          </div>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Fonte dos títulos" hint="Nome da fonte (ex.: Fraunces, Playfair Display, Merriweather).">
          <TextInput value={form.heading_font} onChange={(e) => upd("heading_font", e.target.value)} placeholder="Fraunces" />
        </Field>
        <Field label="Fonte do corpo" hint="Ex.: Inter, Roboto, Poppins, Nunito Sans.">
          <TextInput value={form.body_font} onChange={(e) => upd("body_font", e.target.value)} placeholder="Inter" />
        </Field>
      </div>
      <Field label="URL do Google Fonts" hint='Para carregar as fontes escolhidas. Cole a URL do <link> gerada em fonts.google.com. Ex.: https://fonts.googleapis.com/css2?family=Playfair+Display&family=Roboto&display=swap'>
        <TextInput value={form.google_fonts_url} onChange={(e) => upd("google_fonts_url", e.target.value)} placeholder="https://fonts.googleapis.com/css2?..." />
      </Field>
      <SaveButton
        saving={saving}
        onClick={async () => {
          setSaving(true);
          try { await save(form); setToast("Aparência atualizada!"); setTimeout(() => setToast(null), 2500); }
          catch (e: any) { setToast("Erro: " + e.message); }
          finally { setSaving(false); }
        }}
      />
      <Toast text={toast} />
    </Card>
  );
}
