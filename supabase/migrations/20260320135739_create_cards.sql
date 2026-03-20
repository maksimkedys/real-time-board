CREATE TABLE IF NOT EXISTS public.cards (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  column_id uuid REFERENCES public.columns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  position integer DEFAULT 0,
  due_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.card_assignees (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  card_id uuid REFERENCES public.cards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.card_activity (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  card_id uuid REFERENCES public.cards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  action text,
  created_at timestamptz DEFAULT now()
);
