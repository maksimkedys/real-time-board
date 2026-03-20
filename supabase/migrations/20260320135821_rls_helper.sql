CREATE OR REPLACE FUNCTION public.get_my_workspace_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT id FROM workspaces WHERE owner_id = auth.uid()
  UNION
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid();
$$;
