
-- Fix: restrict authenticated reads of unpublished content to admins only
DROP POLICY IF EXISTS "auth media read" ON public.media_items;
DROP POLICY IF EXISTS "auth podcast read" ON public.podcast_episodes;
DROP POLICY IF EXISTS "auth specialties read" ON public.specialties;
DROP POLICY IF EXISTS "anon media" ON public.media_items;
DROP POLICY IF EXISTS "anon podcast" ON public.podcast_episodes;
DROP POLICY IF EXISTS "anon specialties read" ON public.specialties;

CREATE POLICY "public media published" ON public.media_items
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin media read all" ON public.media_items
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "public podcast published" ON public.podcast_episodes
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin podcast read all" ON public.podcast_episodes
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "public specialties published" ON public.specialties
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin specialties read all" ON public.specialties
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: reject anonymous (is_anonymous) auth users on user_roles
DROP POLICY IF EXISTS "admin roles" ON public.user_roles;
DROP POLICY IF EXISTS "own roles" ON public.user_roles;

CREATE POLICY "admin roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    AND auth.uid() = user_id
  );
