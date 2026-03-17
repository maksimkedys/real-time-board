import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { Sidebar } from '@/widgets/sidebar/sidebar';
import { ModeToggle } from '@/features/theme-toggle/mode-toggle';
import { SessionInitializer } from '@/entities/session/ui/session-initializer';

import {
  getUserProfile,
  getUserWorkspaces,
} from '@/entities/session/api/session.queries';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return <div>Supabase not configured</div>;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const [profile, workspaces] = await Promise.all([
    getUserProfile(user.id, user.email).catch((error) => {
      console.error('Failed to load profile:', error);
      return {
        id: user.id,
        email: user.email ?? null,
        full_name: null,
        avatar_url: null,
        created_at: null,
      };
    }),

    getUserWorkspaces(user.id).catch((error) => {
      console.error('Failed to load workspaces:', error);
      return [];
    }),
  ]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SessionInitializer profile={profile} workspaces={workspaces} />

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur">
          <h1 className="font-semibold text-foreground">Realtime Board</h1>
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
