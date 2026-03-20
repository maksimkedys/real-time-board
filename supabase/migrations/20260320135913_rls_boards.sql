ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Boards"
  ON public.boards
  USING (workspace_id IN (SELECT public.get_my_workspace_ids()));

CREATE POLICY "Insert Boards"
  ON public.boards FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspace_ids()));


ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Columns"
  ON public.columns
  USING (board_id IN (SELECT id FROM public.boards));

CREATE POLICY "Insert Columns"
  ON public.columns FOR INSERT
  WITH CHECK (board_id IN (SELECT id FROM public.boards));
