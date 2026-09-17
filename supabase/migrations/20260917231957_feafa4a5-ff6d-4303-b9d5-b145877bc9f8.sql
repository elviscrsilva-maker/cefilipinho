CREATE POLICY "visitors can read published site files"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id IN ('branding', 'media', 'podcast')
  AND (
    EXISTS (
      SELECT 1 FROM public.site_content sc
      WHERE sc.value::text LIKE ('%' || storage.objects.name || '%')
    )
    OR EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.published = true
        AND e.cover_url LIKE ('%' || storage.objects.name || '%')
    )
    OR EXISTS (
      SELECT 1 FROM public.media_items m
      WHERE m.published = true
        AND (m.url LIKE ('%' || storage.objects.name || '%') OR m.thumbnail_url LIKE ('%' || storage.objects.name || '%'))
    )
    OR EXISTS (
      SELECT 1 FROM public.podcast_episodes p
      WHERE p.published = true
        AND (p.cover_url LIKE ('%' || storage.objects.name || '%') OR p.audio_url LIKE ('%' || storage.objects.name || '%') OR p.video_url LIKE ('%' || storage.objects.name || '%'))
    )
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.published = true
        AND p.cover_url LIKE ('%' || storage.objects.name || '%')
    )
    OR EXISTS (
      SELECT 1 FROM public.professionals p
      WHERE p.published = true
        AND p.photo_url LIKE ('%' || storage.objects.name || '%')
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members t
      WHERE t.published = true
        AND t.photo_url LIKE ('%' || storage.objects.name || '%')
    )
    OR EXISTS (
      SELECT 1 FROM public.photo_albums a
      WHERE a.published = true
        AND a.cover_url LIKE ('%' || storage.objects.name || '%')
    )
  )
);