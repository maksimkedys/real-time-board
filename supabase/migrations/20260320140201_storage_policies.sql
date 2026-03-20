CREATE POLICY "Authenticated Delete Access"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated Update Access"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated Upload Access"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public View Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');
