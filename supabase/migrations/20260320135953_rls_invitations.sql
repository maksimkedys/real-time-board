ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invitations: select"
  ON public.workspace_invitations FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspace_ids()));

CREATE POLICY "Invitations: insert"
  ON public.workspace_invitations FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspace_ids()));

CREATE POLICY "Invitations: update"
  ON public.workspace_invitations FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (true);
