
-- Fix SECURITY DEFINER exposure on has_role: switch to SECURITY INVOKER.
-- user_roles has an "own roles" policy (auth.uid() = user_id) which lets a signed-in
-- user read their own role rows, which is all has_role(auth.uid(), ...) needs.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Tighten storage admin policies: recreate scoped explicitly to authenticated (non-anon)
DROP POLICY IF EXISTS "admin delete storage" ON storage.objects;
DROP POLICY IF EXISTS "admin update storage" ON storage.objects;
DROP POLICY IF EXISTS "admin insert storage" ON storage.objects;

CREATE POLICY "admin insert storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = ANY (ARRAY['branding','media','podcast'])
    AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "admin update storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = ANY (ARRAY['branding','media','podcast'])
    AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "admin delete storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = ANY (ARRAY['branding','media','podcast'])
    AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
    AND public.has_role(auth.uid(), 'admin')
  );
