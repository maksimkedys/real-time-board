import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/shared/api/supabase/server';
import { getUserWorkspaces } from '@/entities/session/api/session.queries';

import { Header } from '@/widgets/header/header';
import { Sidebar } from '@/widgets/sidebar/sidebar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const workspaces = await getUserWorkspaces(user.id).catch(() => []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header profile={profile} workspaces={workspaces} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar profile={profile} workspaces={workspaces} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
