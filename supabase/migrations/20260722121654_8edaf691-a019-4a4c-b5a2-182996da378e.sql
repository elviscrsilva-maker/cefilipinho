
-- =========================
-- EVENTS
-- =========================
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE,
  cover_url TEXT,
  description TEXT,
  external_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read published" ON public.events FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "events admin read all" ON public.events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "events admin write" ON public.events FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- TEAM MEMBERS
-- =========================
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team public read published" ON public.team_members FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "team admin read all" ON public.team_members FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "team admin write" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.team_members (name, role, sort_order) VALUES
  ('Marcos Santos', 'Direção Geral', 1),
  ('Elvis Silva', 'Supervisão Administrativa', 2),
  ('Alcione Sodré', 'RT de Enfermagem', 3),
  ('Silvia Botelho', 'RT de Farmácia', 4);

-- =========================
-- PROFESSIONALS (linked to specialties)
-- =========================
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  bio TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_professionals_specialty ON public.professionals(specialty_id);
GRANT SELECT ON public.professionals TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionals TO authenticated;
GRANT ALL ON public.professionals TO service_role;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "professionals public read published" ON public.professionals FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "professionals admin read all" ON public.professionals FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "professionals admin write" ON public.professionals FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_professionals_updated BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- PHOTO ALBUMS
-- =========================
CREATE TABLE public.photo_albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.photo_albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photo_albums TO authenticated;
GRANT ALL ON public.photo_albums TO service_role;
ALTER TABLE public.photo_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums public read published" ON public.photo_albums FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "albums admin read all" ON public.photo_albums FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "albums admin write" ON public.photo_albums FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_albums_updated BEFORE UPDATE ON public.photo_albums FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Link photos to albums (optional)
ALTER TABLE public.media_items ADD COLUMN album_id UUID REFERENCES public.photo_albums(id) ON DELETE SET NULL;
CREATE INDEX idx_media_items_album ON public.media_items(album_id);
