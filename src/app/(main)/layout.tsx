import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { Sidebar } from '@/widgets/sidebar/sidebar';
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
    getUserProfile(user.id, user.email).catch(() => ({
      id: user.id,
      email: user.email ?? null,
      full_name: null,
      avatar_url: null,
      created_at: null,
    })),
    getUserWorkspaces(user.id).catch(() => []),
  ]);

  return (
    <div className="flex h-[calc(100%-56px)] w-full overflow-hidden">
      <SessionInitializer profile={profile} workspaces={workspaces} />

      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-transparent p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
