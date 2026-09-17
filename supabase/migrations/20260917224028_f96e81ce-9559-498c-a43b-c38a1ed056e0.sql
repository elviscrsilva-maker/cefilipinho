DROP POLICY IF EXISTS "public read storage" ON storage.objects;

CREATE POLICY "admins can read managed storage"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id IN ('branding', 'media', 'podcast')
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);