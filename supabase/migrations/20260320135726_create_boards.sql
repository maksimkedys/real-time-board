CREATE TABLE IF NOT EXISTS public.boards (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.columns (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  board_id uuid REFERENCES public.boards(id) ON DELETE CASCADE,
  title text NOT NULL,
  position integer DEFAULT 0
);
