'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  workspaceId: z.string().uuid('Invalid workspace ID'),
});

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.log(error);
          }
        },
      },
    }
  );
}

export interface InviteResult {
  success?: boolean;
  error?: string;
}

export async function sendWorkspaceInvite(
  email: string,
  workspaceId: string
): Promise<InviteResult> {
  const parsed = inviteSchema.safeParse({ email, workspaceId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name')
    .eq('id', parsed.data.workspaceId)
    .single();

  if (!workspace) {
    return { error: 'Workspace not found' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email)
    .single();

  if (profile) {
    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', parsed.data.workspaceId)
      .eq('user_id', profile.id)
      .single();

    if (existingMember) {
      return { error: 'This user is already a member of this workspace' };
    }
  }

  let invitationToken: string | null = null;
  try {
    const { data: existingInvite } = await supabase
      .from('workspace_invitations')
      .select('id')
      .eq('workspace_id', parsed.data.workspaceId)
      .eq('email', parsed.data.email)
      .eq('status', 'pending')
      .single();

    if (existingInvite) {
      return { error: 'An invitation is already pending for this email' };
    }

    const { data: invitation } = await supabase
      .from('workspace_invitations')
      .insert({
        workspace_id: parsed.data.workspaceId,
        email: parsed.data.email,
        invited_by: user.id,
      })
      .select('token')
      .single();

    invitationToken = invitation?.token ?? null;
  } catch {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const acceptPath = invitationToken
    ? `/invite/accept?token=${invitationToken}`
    : `/invite/accept?workspace=${parsed.data.workspaceId}`;

  const redirectUrl = `${siteUrl}${acceptPath}`;

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (otpError) {
    console.error('Error sending magic link:', otpError);
    return { error: `Failed to send invitation email: ${otpError.message}` };
  }

  return { success: true };
}

export async function acceptWorkspaceInvite(
  token?: string,
  workspaceId?: string
): Promise<InviteResult & { workspaceId?: string }> {
  const supabase = await getSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated. Please sign in first.' };
  }

  if (token) {
    const tokenSchema = z.string().uuid('Invalid token');
    const parsed = tokenSchema.safeParse(token);
    if (!parsed.success) {
      return { error: 'Invalid invitation token' };
    }

    try {
      const { data, error } = await supabase.rpc(
        'accept_workspace_invitation',
        { p_token: parsed.data }
      );

      if (error) throw error;

      const result = data as {
        error?: string;
        success?: boolean;
        workspace_id?: string;
      };
      if (result.error) {
        return { error: result.error };
      }

      return { success: true, workspaceId: result.workspace_id };
    } catch {}
  }

  if (workspaceId) {
    const wsSchema = z.string().uuid('Invalid workspace ID');
    const parsed = wsSchema.safeParse(workspaceId);
    if (!parsed.success) {
      return { error: 'Invalid workspace ID' };
    }

    const { data: existingMember } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', parsed.data)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return { success: true, workspaceId: parsed.data };
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', parsed.data)
      .single();

    if (!workspace) {
      return { error: 'Workspace not found' };
    }

    const { error: insertError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: parsed.data,
        user_id: user.id,
        role: 'member',
      });

    if (insertError) {
      console.error('Error adding member:', insertError);
      return { error: 'Failed to join workspace' };
    }

    return { success: true, workspaceId: parsed.data };
  }

  return { error: 'Missing invitation token or workspace ID' };
}
