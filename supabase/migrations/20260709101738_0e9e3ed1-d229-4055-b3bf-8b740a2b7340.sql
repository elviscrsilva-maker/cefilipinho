
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user_admin()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'elviscrsilva@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin();

CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read site content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete site content" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_content (key, value) VALUES
('home', '{"hero_eyebrow":"SEMUS · São Luís","hero_title":"Centro de Especialidades Filipinho","hero_subtitle":"Qualidade e excelência em cada atendimento. Cuidado multiprofissional, humanizado e resolutivo para a população da grande ilha de São Luís.","hero_image_url":"","cta_primary_label":"Ver especialidades","cta_primary_href":"/especialidades","cta_secondary_label":"Fale conosco","cta_secondary_href":"/contato"}'::jsonb),
('institutional', '{"mission":"Em consonância com a SEMUS, oferecer com excelência atendimento multiprofissional de forma resolutiva e humanizada à população de São Luís.","vision":"Consolidar-se como referência no atendimento multiprofissional especializado junto à população de São Luís e municípios pactuados.","values":"Ética, respeito, acolhimento, humanização, excelência, resolutividade e satisfação do paciente.","history":""}'::jsonb),
('contact', '{"address":"Rua Vespasiano Ramos, 16 — CEP 65043-030, São Luís/MA","phone":"(98) 99149-7326","whatsapp":"5598991497326","email":"cemfilipinhoesp@gmail.com","hours":"Segunda a Sexta · 07h às 18h","map_embed_url":""}'::jsonb),
('branding', '{"site_title":"Centro de Especialidades Filipinho","tagline":"Qualidade e Excelência em cada Atendimento","cnes":"2697998","logo_url":"","footer_dev_logo_url":"","footer_dev_url":""}'::jsonb);

CREATE TYPE public.media_kind AS ENUM ('photo', 'video');
CREATE TABLE public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind media_kind NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon media" ON public.media_items FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth media read" ON public.media_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin media insert" ON public.media_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin media update" ON public.media_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin media delete" ON public.media_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  audio_url TEXT,
  external_url TEXT,
  episode_number INT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.podcast_episodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.podcast_episodes TO authenticated;
GRANT ALL ON public.podcast_episodes TO service_role;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon podcast" ON public.podcast_episodes FOR SELECT TO anon USING (published = true);
CREATE POLICY "auth podcast read" ON public.podcast_episodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin podcast insert" ON public.podcast_episodes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin podcast update" ON public.podcast_episodes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin podcast delete" ON public.podcast_episodes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER media_items_updated BEFORE UPDATE ON public.media_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER podcast_episodes_updated BEFORE UPDATE ON public.podcast_episodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
