
CREATE POLICY "public read storage" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id IN ('branding','media','podcast'));

CREATE POLICY "admin insert storage" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN ('branding','media','podcast') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update storage" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN ('branding','media','podcast') AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete storage" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN ('branding','media','podcast') AND public.has_role(auth.uid(), 'admin'));
