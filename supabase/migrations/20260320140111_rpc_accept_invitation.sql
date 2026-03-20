CREATE OR REPLACE FUNCTION public.accept_workspace_invitation(p_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_invitation record;
  v_user_email text;
  v_user_id uuid;
  v_existing_member uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  SELECT email INTO v_user_email
  FROM auth.users WHERE id = v_user_id;

  SELECT * INTO v_invitation
  FROM public.workspace_invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now();

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object('error', 'Invitation not found or expired');
  END IF;

  IF v_invitation.email <> v_user_email THEN
    RETURN jsonb_build_object('error', 'This invitation was sent to a different email');
  END IF;

  SELECT id INTO v_existing_member
  FROM public.workspace_members
  WHERE workspace_id = v_invitation.workspace_id AND user_id = v_user_id;

  IF v_existing_member IS NOT NULL THEN
    UPDATE public.workspace_invitations SET status = 'accepted' WHERE id = v_invitation.id;
    RETURN jsonb_build_object('success', true, 'workspace_id', v_invitation.workspace_id, 'already_member', true);
  END IF;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (v_invitation.workspace_id, v_user_id, 'member');

  UPDATE public.workspace_invitations SET status = 'accepted' WHERE id = v_invitation.id;

  RETURN jsonb_build_object('success', true, 'workspace_id', v_invitation.workspace_id);
END;
$$;
