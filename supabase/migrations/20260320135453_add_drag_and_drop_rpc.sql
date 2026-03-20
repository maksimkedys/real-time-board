CREATE OR REPLACE FUNCTION public.reorder_columns(updates jsonb)
RETURNS void AS $$
BEGIN
  UPDATE public.columns
  SET position = u.position
  FROM jsonb_to_recordset(updates) AS u(id uuid, position int)
  WHERE public.columns.id = u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.reorder_cards(updates jsonb)
RETURNS void AS $$
BEGIN
  UPDATE public.cards
  SET position = u.positionі
  FROM jsonb_to_recordset(updates) AS u(id uuid, position int)
  WHERE public.cards.id = u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.move_card(
  p_card_id uuid,
  p_new_column_id uuid,
  p_new_position int,
  p_source_updates jsonb,
  p_dest_updates jsonb
)
RETURNS void AS $$
BEGIN
  UPDATE public.cards
  SET column_id = p_new_column_id, position = p_new_position
  WHERE id = p_card_id;

  UPDATE public.cards
  SET position = u.position
  FROM jsonb_to_recordset(p_source_updates) AS u(id uuid, position int)
  WHERE public.cards.id = u.id;

  UPDATE public.cards
  SET position = u.position
  FROM jsonb_to_recordset(p_dest_updates) AS u(id uuid, position int)
  WHERE public.cards.id = u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;