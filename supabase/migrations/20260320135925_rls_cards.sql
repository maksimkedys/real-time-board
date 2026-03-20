ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Cards"
  ON public.cards
  USING (column_id IN (SELECT id FROM public.columns));

CREATE POLICY "Insert Cards"
  ON public.cards FOR INSERT
  WITH CHECK (column_id IN (SELECT id FROM public.columns));


ALTER TABLE public.card_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Assignees"
  ON public.card_assignees
  USING (card_id IN (SELECT id FROM public.cards));


ALTER TABLE public.card_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Activity"
  ON public.card_activity
  USING (card_id IN (SELECT id FROM public.cards));
