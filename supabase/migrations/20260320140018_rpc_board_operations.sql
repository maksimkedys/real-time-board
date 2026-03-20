CREATE OR REPLACE FUNCTION public.reorder_columns(updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE public.columns
    SET position = (item ->> 'position')::int
    WHERE id = (item ->> 'id')::uuid;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.reorder_cards(updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(updates)
  LOOP
    UPDATE public.cards
    SET position = (item ->> 'position')::int
    WHERE id = (item ->> 'id')::uuid;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.move_card(
  p_card_id uuid,
  p_new_column_id uuid,
  p_new_position int,
  p_source_updates jsonb,
  p_dest_updates jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  item jsonb;
BEGIN
  UPDATE public.cards
  SET column_id = p_new_column_id, position = p_new_position
  WHERE id = p_card_id;

  FOR item IN SELECT * FROM jsonb_array_elements(p_source_updates)
  LOOP
    UPDATE public.cards
    SET position = (item ->> 'position')::int
    WHERE id = (item ->> 'id')::uuid;
  END LOOP;

  FOR item IN SELECT * FROM jsonb_array_elements(p_dest_updates)
  LOOP
    UPDATE public.cards
    SET position = (item ->> 'position')::int
    WHERE id = (item ->> 'id')::uuid;
  END LOOP;
END;
$$;
