ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspaces Select"
  ON public.workspaces FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Workspaces Insert"
  ON public.workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspaces Update"
  ON public.workspaces FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Workspaces Delete"
  ON public.workspaces FOR DELETE
  USING (owner_id = auth.uid());


ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolate Workspace Members"
  ON public.workspace_members
  USING (workspace_id IN (SELECT public.get_my_workspace_ids()));

CREATE POLICY "Allow Insert Members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
