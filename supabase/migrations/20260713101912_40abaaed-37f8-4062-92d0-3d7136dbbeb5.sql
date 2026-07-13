DROP POLICY IF EXISTS "auth media read" ON public.media_items;
CREATE POLICY "auth media read" ON public.media_items FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "auth podcast read" ON public.podcast_episodes;
CREATE POLICY "auth podcast read" ON public.podcast_episodes FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "auth specialties read" ON public.specialties;
CREATE POLICY "auth specialties read" ON public.specialties FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));