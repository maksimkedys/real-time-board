ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: read all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Profiles: update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
