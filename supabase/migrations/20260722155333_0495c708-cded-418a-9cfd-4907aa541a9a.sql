
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Novo projeto',
  description text,
  cover_url text,
  link_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published projects"
  ON public.projects FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can read all projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
